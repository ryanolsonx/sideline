# What a round is: plan versus play

Type: grilling
Status: resolved

## Question

The keystone. A round has two phases: the app proposes a lineup, the coach shuffles it
freely while it is still a proposal, then taps Play round and it becomes what actually
happened. A swap after that tap is a different kind of event: this player started the
round and came off, that one came on.

Settled after reading the prior art: **a substitution must not overwrite the lineup in
place.** The existing tool's `swapBenchPlayerIntoLineup` rewrites the slot and records
nothing about the round having started differently, and the coach has ruled that a flaw.
A round must retain what it began as, plus what changed. Do not reopen this.

- What are the round's states, and what is the exact meaning of the Play round tap?
- What does an in-round substitution record? A pair of players and a position? A
  moment in time? There is no clock, so what marks "when"?
- Can a round be un-played, or is the tap one-way?
- Does a round end when the next one is planned, or is there a separate gesture?
- What does the model look like: a lineup plus a substitution log, or a sequence of
  stints per player?
- How much of this does the coach see? A round that has been played and then edited
  three times must still read clearly on a phone.

Most of the rest of this map hangs off the answer.

## Answer

### A round has two screens, and one forward action alternates between them

```
Setup ─▶ R1 plan ─▶ R1 live ─▶ R2 plan ─▶ R2 live ─▶ … ─▶ R8 live ─▶ End Game
```

The planning screen for round N **is the substitution break**: while it is open, round
N−1 is still on the field and the referee has stopped play. This is why two screens per
round cost nothing. The earlier objection to a two-tap round — that it opens an interval
in which no round is on the field — was wrong, because that interval is a real moment of
a real game and the screen is what fills it.

End Game replaces the forward action on **round 8's live screen**, preserving what
[Game identity and lifecycle](03-game-identity-and-lifecycle.md) settled.

### The screen you are standing on decides what a move means

Moving a defender to forward on the **planning** screen rewrites what the round begins
as, and is recorded as nothing: it never happened any other way. The identical move on
the **live** screen is a substitution. Only the coach knows which one it was, and that is
the whole reason navigation has to be free — an early tap must be walkable back so the
change lands in the right place.

### What a round holds

A **starting lineup** — one player per position slot, goalie included — plus an
**ordered list of changes**. A change is one position, the player leaving it, and the
player taking it; either side may be empty. The **on-field lineup** is the fold of the
changes over the starting lineup and is never stored, which is what makes it structurally
impossible for a substitution to overwrite what the round began as. Who is Out is derived:
participating, minus whoever is on the field.

A move between two on-field positions is two change entries with no bench involvement.
The entry is therefore called a **Change**; **Substitution** stays the coach-facing word
for the ordinary case it usually is.

### A change has an order and no moment

There is no clock, so a change knows only where it falls in its round's sequence. Rows
carry `createdAt` because rows do; **no rotation rule may read it**. A real timestamp was
rejected specifically because it would let partial-time crediting leak back into a
deliberately clockless app — and
[comparable-rotation-apps.md](../../../docs/research/comparable-rotation-apps.md) found no
vendor anywhere publishes a partial-time crediting rule to leak toward. This leaves
[What counts as playing time](06-what-counts-as-playing-time.md) a whole question rather
than an arithmetic accident.

### No round state is stored

A game carries **the round and screen it is on**, and that is the only pointer. Rounds
behind it are Played, the one it is on is Live, the one ahead is Planned. Those words are
read off the position, never off a column, so a round cannot be in the wrong state —
there is no state to get wrong. A round ahead of the position that already carries
changes is not a contradiction; it means the coach had been there and walked back.

### Navigation is free and destroys nothing

Back and forward move the position. Walk back to round 1's live screen to check who was
in goal, walk forward again, and every round in between kept its lineup and its changes,
so the coach lands exactly where they left. A mis-tap therefore needs no undo action and
no ceremony: going back to round 4 makes round 4 live and round 5 planned again, and
everything normally available there is available.

**Back does not go behind round 1's planning screen.** Begin is a one-way door, so
[Presence changes mid-game](09-presence-changes-mid-game.md) keeps its whole question
rather than inheriting an answer from navigation.

### Modification deletes the future

Editing a past round — its starting lineup or its changes — **discards every round after
it**. The coach then walks forward, re-planning each one so it represents reality, with
the engine recomputing each planning screen from the corrected standings.

Decided by the coach. The softer alternative was put with its cost stated: keep what the
later rounds recorded, mark them as worth a second look, and offer the recomputation
rather than applying it — because a coach who fixes round 5 during round 7 must otherwise
re-enter two rounds of real history from memory, on a phone, at a field, and may well
enter them worse than they were. It was declined for consistency with the rule. Recorded
as the coach's call; do not reopen.

This subsumes the plan-staleness rule: a plan the coach has not touched follows the live
data and regenerates, a plan the coach has shuffled stands until they ask for a fresh one,
and both hold only while nothing behind the round has changed. A modification behind a
round deletes that round outright, touched or not.

Whether the app confirms before discarding is a screen question, left to
[The live-game screen on a phone](11-live-game-screen-on-a-phone.md).

### Nothing is refused for being incomplete

A position may be empty, and a change may be a player leaving with nobody coming on. A
round with no goalie is representable. **The formation says what a full lineup looks like;
it does not say what a round must contain.** The app says loudly that the team is a player
short; it never blocks the tap. A kid getting hurt with nobody to bring on is a thing that
happens on a field, and a model that cannot hold it is a model that lies.

### What this unblocks

[What counts as playing time](06-what-counts-as-playing-time.md) now has a unit to credit
and an explicit absence of partial time.
[Rotation rules and constraints](07-rotation-rules-and-constraints.md) knows the engine
reads played rounds and produces one planning screen at a time.
[Presence changes mid-game](09-presence-changes-mid-game.md) knows it cannot lean on
walking back to the presence screen.
[The live-game screen on a phone](11-live-game-screen-on-a-phone.md) has its skeleton: two
screens per round, a free back, and a forward that means different things on each.
[Game persistence and resumability](13-game-persistence-and-resumability.md) stores
rounds, changes, and one position pointer, and nothing else.

Recorded as [ADR 0004](../../../docs/adr/0004-a-round-keeps-what-it-began-as.md).
