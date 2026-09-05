# A round keeps what it began as, plus what changed

A round stores the **starting lineup** it went onto the field with, plus an **ordered list
of changes**. A change is one position, the player leaving it, and the player taking it.
The lineup on the field right now is the fold of those changes over the starting lineup,
computed on read and never stored. A substitution therefore cannot overwrite what the round
began as, because there is nowhere for it to write.

Round state is not stored either. A game carries the round and screen it is on; a round is
Planned, Live or Played according to where it sits relative to that pointer.

The alternative was the lineup ledger: the round holds one lineup, and substituting rewrites
the slot. It is what the coach's own tool at `https://ryanolson.dev/subs/` does — its
`swapBenchPlayerIntoLineup` overwrites the slot in place and records nothing about the round
having started differently — and every product surveyed in
[comparable-rotation-apps.md](../research/comparable-rotation-apps.md) does the same. It is
simpler, it is what a screen mostly wants to render, and it was rejected anyway.

It was rejected because the ledger cannot answer "who started this round". A coach looking
back at Saturday sees who was on the field at the end of each round and no trace of the kid
who started at forward and came off, and the playing-time arithmetic that is the entire point
of the app has no way to know that kid played. The distinction between what was planned and
what actually happened is not a refinement of this app; it is the app.

Storing the state as well as the lineup was rejected for a smaller reason: a stored state can
disagree with where the coach actually is. Deriving it means a round cannot be in the wrong
state, because there is no state to get wrong — which matters on a phone at a field, where the
recovery from an inconsistency is worse than the inconsistency.

The cost is that every read folds. At eight rounds and a handful of changes each that is
nothing, but nothing may cache the on-field lineup back into storage, or the guarantee is
gone.

## Consequences

- Where a coach's move lands depends on the screen they are standing on. On the planning
  screen it rewrites the starting lineup and is recorded as nothing; on the live screen it is a
  change. Navigation between the two must stay free, because the coach is the only one who
  knows which they meant.
- A change has an order within its round and no moment. `createdAt` exists as provenance and no
  rotation rule may read it. Any future partial-time crediting is a new decision, not an
  extension of this one.
- Nothing is refused for being incomplete: an empty position, a round with no goalie, a player
  leaving with nobody coming on. The formation describes a full lineup, not a valid round.
- Playing time, position counts and goalie counts are all derived by replaying rounds. Nothing
  accumulates in storage, so correcting a round corrects every total for free.
- Navigation deletes nothing. Modifying a past round discards every round after it, and that is
  the only destructive act in a game.
