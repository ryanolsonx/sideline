# A game is an append-only log of coach actions

A game stores one ordered, append-only **log** of **actions**: Begin, an attendance mark, a
swap on the plan screen, a swap on the live screen, the engine's suggested lineup for a round,
Subs, End Game. Nothing else about a game is stored. Rounds, starting lineups, changes,
on-field lineups, participation, rounds played, goalie and defender counts and the round and
screen the coach is on are all the fold of the log, computed on read.

An action is one thing the coach did, not one thing that was recorded. A swap that moves two
children records two changes and is one action; a round's suggested lineup arrives as one
action however many positions it fills. That equivalence is what makes **undo** meaningful:
one tap unsays one thing the coach did.

## This is where the design was already going

[ADR 0004](0004-a-round-keeps-what-it-began-as.md) stores a round as a starting lineup plus an
ordered list of changes, folded on read and never cached, because a stored lineup cannot answer
who started the round. [ADR 0008](0008-attendance-is-marked-from-where-you-stand.md) stores
attendance as an ordered list of marks for the same reason, having rejected the per-round
snapshot that can disagree with itself.
[ADR 0005](0005-a-round-played-is-a-round-played.md) and
[ADR 0006](0006-goalie-and-defender-are-rationed.md) derive every count by replaying rounds and
accumulate nothing.

Four decisions, taken separately and on their own merits, all landed on the same answer. This
one removes the last thing that was not a fold — round advancement, and the round entity
itself — so there is one mechanism rather than two that behave alike but must be kept in step.

The domain is genuinely append-only. A game happened; time moves one way on a field. Event
sourcing is worst forced onto a domain that mutates and best where the record is already a
sequence, and every expensive part of it is expensive at scale: one game is eight rounds, nine
players and on the order of eighty actions, so there are no snapshots, no projections and no
replay cost to manage.

## Undo, redo, and the branch

Undo steps back one action along the log. Redo steps forward again. Both are live for the whole
game and reach back to Begin, which is the floor: the game's creation is not something the
coach did inside it. End Game is the ceiling and is not undoable — Ended means the game counts,
and an ended game accepts no editing at all.

Acting after an undo **branches**. The undone actions stop being **in effect**; they are kept
and are unreachable, never shown, never navigable, never counted. Redo is then empty. A coach
who can see two versions of round 5 has to decide which one is real, and that is a question the
app must never ask them.

**Editing a round that already happened is this same mechanism and nothing else.** The coach
walks back to round 3 — navigation alone changes nothing — and swaps. That swap comes after
round 3 in the log, so everything the log held past that point branches off, which is exactly
ADR 0004's rule that modifying a past round discards every round after it. The rule stops being
a special destructive act and becomes an ordinary consequence, and it stops being destructive
at all: the coach who did it by mistake taps undo and rounds 4–6 come back, because they were
never destroyed.

There is no confirmation before a branch. The coach is watching a game, and a dialog they must
read is worse than a mistake they can unsay. Undo and redo are small and permanent in the
bottom-left corner, out of the way of the lineup and reachable by the hand already holding the
phone.

Any round is reachable, back to round one, and anything on a walked-back round can change: its
starting lineup on the plan screen, another change on the live screen, exactly as the live
round behaves. Getting back is walking forward one round at a time through the ordinary Subs
action, and each round is planned fresh because arriving at its plan screen is a first arrival.
There is no fast-forward, because the engine can regenerate a plausible round 4 but cannot know
the swap the coach made in round 5, and inventing history is worse than re-walking it.

## Attendance rides across a branch

ADR 0008 holds: who was at the field is a fact about the afternoon rather than a consequence of
the lineups, so it survives a walk-back. Under a pure log it would not — branching at round 3
would take the mark that says a child left at round 5 with it, and the coach would re-mark
every arrival and departure on the way forward.

So the branch re-appends them. Attendance marks that were in effect past the branch point are
emitted again onto the live chain, keeping the round they take effect from; a mark for a round
the game never reaches again simply never bites.

This is the one exception to "the log is one list", and it is deliberate. The purity argument
says amend ADR 0008 and let the coach re-mark; that is the architecture dictating what the
coach experiences, which is the failure mode that makes event sourcing regrettable. The order
is: decide what should happen, then make the log carry it. One stated rule is affordable. A
habit of exempting whatever is inconvenient is not, so this exception is the only one, and
adding a second is a new decision rather than an extension of this one.

## The price

Every event shape written is permanent, because ended games stay readable forever. Change what
a swap records and there are old-shaped actions in the database and code that has to read them.
This is the real cost, it is the one usually underestimated, and it is accepted here with the
design still moving. The mitigation is that actions are few and coarse — they are the coach's
gestures, which are stable, rather than internal state transitions, which are not.

The alternative was keeping rounds as rows and adding a command log purely to power undo:
cheaper, and SQL can still aggregate. It loses because it is two representations that can
disagree, which ADR 0004 already refused once for the same reason. And undo over mutable rounds
means inventing a change log anyway and keeping it honest against the rows, so the log is the
cheap way to get what was asked for rather than the expensive one.

## Consequences

- No fairness question is ever answered by a SQL aggregate. Every count folds the log in
  application code.
- [ADR 0003](0003-nothing-is-ever-deleted.md) is upheld rather than strained: a branched-off
  chain is retained, not deleted, and is excluded by not being in effect rather than by a
  delete flag.
- ADR 0004's guarantee survives intact and generalises: a round still cannot overwrite what it
  began as, because there is still nowhere to write.
- [ADR 0007](0007-a-coach-adjustment-is-a-swap.md)'s "the engine runs once per round" is
  unchanged. The suggestion is an action in the log, so undoing and redoing it restores the
  same lineup rather than re-running the engine; only a genuine first arrival runs it.
- Round numbers repeat across branches. Nothing may treat a game and a round number as an
  identity.
- The action catalogue and each action's payload are now the load-bearing schema decision and
  are not settled here.
- How this sits in the backend layers — where the projection lives, what each layer may do, and
  why an action shape is permanent — is
  [Event-Sourced Modules and Projections](../../ARCHITECTURE.md#event-sourced-modules-and-projections).
