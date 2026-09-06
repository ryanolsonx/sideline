# Nothing is ever deleted

A game reaches one of two terminal states and stays there. **Ended** means the game is
over and counts. **Abandoned** means the game did not happen: the referee called it off
after four rounds, or the coach tapped Start Game on the wrong team. An abandoned game
keeps whatever rounds it reached, keeps its row, and appears in its team's list marked as
abandoned and rendered quieter than an ended one. There is no delete, on games or on
anything else, and no soft-delete flag standing in for one.

The alternative was ordinary deletion: a wrong-tap game removed, a called-off game
removed, the list showing only games that count. It was rejected on what a coach does
with the app. The list is how a coach answers "what happened last Saturday", and a
Saturday that was rained off is an answer to that question. A game that silently vanishes
leaves a coach unsure whether they are looking at a game that was called off or a game
they failed to record, and the app has no other place to tell them which.

Abandon also has to carry weight that delete could not. End Game is hidden until round 7,
so a coach in round 4 with lightning overhead has no way to end the game — Abandon is
that exit. Making the emergency exit a deletion would mean the thumb-reachable action
during a live game destroys the rounds already played.

The cost is a table that only grows and a list that accumulates games nobody wants. At
one coach, one team, one game a week, that is a row a week. The word is deliberately not
"cancelled" or "discarded": those describe an intent, and Abandoned describes an outcome
the referee or the weather usually chose.

## Consequences

- Every query over games filters by state rather than by existence. "Previous games"
  means ended and abandoned, not everything.
- Nothing downstream may assume a game it has a reference to is still reachable-and-valid
  in the sense a live game is. State is always part of reading a game.
- Fairness arithmetic must decide what an abandoned game contributes. It is not decided
  here; it is now a question that has to be asked, where deletion would have answered it
  by accident.
- There is no story for a coach who wants a game gone. If one is ever needed it is a new
  decision, not a flag added to this one.
- Nothing needs cascading deletes, so rounds, lineups, and substitutions can hold plain
  references to their game.

## Amended by ADR 0009

[ADR 0009](0009-a-game-is-an-append-only-log-of-coach-actions.md) makes a game an append-only
log, which extends this rule inside a game rather than straining it. Undoing an action and then
acting again leaves the undone actions branched off: retained, unreachable, and excluded by not
being in effect rather than by a delete flag. Discarding the rounds after an edited one destroys
nothing.
