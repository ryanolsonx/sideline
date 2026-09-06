# Attendance is marked from where the coach is standing

The roster at Begin is not the roster at the whistle: children arrive late, leave at halftime,
and go off injured. This records how that reaches the game, and why a child who has already
gone home can still be shown on the field.

A game carries an **attendance** log: an ordered list of marks, each naming a player, the round
it takes effect from, and whether they arrived or left. A player's participation at any round
is the fold of that log, and the three states a coach reads round by round — played, out,
absent — fall out of it. Marking who turned up during Setup is the same log, stamped ahead of
round 1, so everyone begins absent and turning up is an arrival. There is no separate
setup-time storage and no `Injured` state: why a child stopped being there changes nothing the
app does, so a single gesture covers all three cases.

The two shapes rejected: a per-round snapshot of who was participating duplicates the same fact
across eight rounds and can disagree with itself, and the arrival-round / departure-round pair
the [existing tool](../research/existing-subs-tool.md) uses cannot express a child who leaves
and comes back.

## The screen decides when a mark takes effect

[ADR 0004](0004-a-round-keeps-what-it-began-as.md) established that the screen the coach is
standing on decides whether a move rewrites what a round begins as or records a change against
it. Attendance is the second kind of move to obey it.

On the **plan screen**, a mark takes effect for the round being planned, and the child is in
that lineup. On the **live screen**, a mark takes effect from the *next* round, in both
directions. A departure therefore never rewrites the round on the field: a child whose parent
took them home at minute four is still on the field as far as the record is concerned until the
coach taps Subs.

That is the surprising half, and it was chosen deliberately over taking them off immediately.
Taking them off is defensible — the field cannot show a child who is not at the field — but it
makes the live screen rewrite a live round for one case and not for others, and it obliges the
app to fill the hole it just made while the coach is watching a game. Under this rule no
mid-round hole ever appears, so there is no vacancy to fill and nothing to explain. The cost is
a record that briefly disagrees with the touchline, in a round that is about to end anyway, and
the child keeps their credit for it under
[ADR 0005](0005-a-round-played-is-a-round-played.md), which is right either way.

**One exception**: an arrival while the side is short goes onto the field immediately, into the
emptiest slot. A short side is worth breaking the symmetry for, because the alternative is
playing a child down while a substitute stands on the touchline.

## An attendance mark re-runs the engine for the round being planned

[ADR 0007](0007-a-coach-adjustment-is-a-swap.md) fixed the engine to run once per round, on
first arrival at its plan screen, so that navigation never destroys a coach's swaps. A mark on
the plan screen re-runs it anyway, discarding any swaps already made to that round.

This does not break that promise, because "once per round" is about *navigation*. A changed
roster is new information, exactly as tapping **Reset** is; a plan built without a child who is
standing right there is wrong. Splicing the newcomer into the existing plan instead would mean
inventing a second rotation rule used only in this case. The cost is real: a coach who had
already arranged the lineup by hand loses that work when somebody turns up.

## Attendance survives a walk-back

ADR 0004 discards every round after one the coach modifies. It does not discard attendance.
Who was at the field is a fact about the afternoon rather than a consequence of the lineups, so
a coach fixing round 3 does not re-tick everyone who arrived at round 5; the marks keep their
rounds and apply again as the coach replays forward.

## Consequences for a short side

Fewer participating children than the formation fields is not a different formation. Everyone
participating is on, slots fill in the order goalie, defenders, forwards, and the leftover
forward slots simply stand empty with the screen saying plainly that the side is short. The
[existing tool](../research/existing-subs-tool.md) degrades to a *different* shape by player
count, which is the capability this effort deliberately left out of scope.

A small enough side makes [ADR 0006](0006-goalie-and-defender-are-rationed.md) arithmetically
impossible rather than merely tight. Three children at 6v6 field a keeper and two defenders
every round, so the only escape from defending is to be in goal, and somebody defends two
rounds running no matter what the engine does. **This amends ADR 0006**: where its two hard
rules cannot both hold, *never two rounds running* yields and *drawn from those who have held
it fewest* stays hard. The burden still spreads as evenly as three children allow; it just
cannot buy anyone a clean round off. The engine must always field a legal side, which is the
one thing it may never refuse.

## Amended by ADR 0009

[ADR 0009](0009-a-game-is-an-append-only-log-of-coach-actions.md) makes a game an append-only
log, under which a branch would take attendance with it. It does not: marks in effect past the
branch point are emitted again onto the live chain, keeping the round they take effect from, so
"attendance survives a walk-back" holds as written. That is the single stated exception to the
log being one list, and ADR 0009 takes it on the grounds argued here — who was at the field is a
fact about the afternoon, and the coach should not have to say it twice.
