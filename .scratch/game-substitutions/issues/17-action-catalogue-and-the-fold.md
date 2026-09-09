# The action catalogue and the fold

Type: grilling
Blocked by: 10
Status: resolved

## Question

[ADR 0009](../../../docs/adr/0009-a-game-is-an-append-only-log-of-coach-actions.md) makes a game
an append-only log of coach actions and names its own load-bearing gap: what the actions are,
and what each one carries. Every shape decided here is permanent, because ended games stay
readable forever.

- What is the complete list of action kinds, and is a plan-screen swap the same kind as a
  live-screen swap or a different one?
- What does each action carry, and how little can it carry? A swap that names two players and
  lets the fold work out the positions is smaller but reads the state it is being folded into.
- How is an action's place in the log expressed: a sequence number, a parent pointer, something
  else? What does branching do to it, given round numbers repeat across branches?
- How is "in effect" represented, such that reading a game is cheap and a branched chain is
  never accidentally counted?
- Where does the fold live? The shape is settled in
  [Event-Sourced Modules and Projections](../../../ARCHITECTURE.md#event-sourced-modules-and-projections)
  — one canonical projection in the domain layer with selectors over its result — so what remains
  is what that read model actually contains.
- What does the API expose: the log, the folded state, or both, and does undo/redo travel as an
  action of its own or as a pointer move?

## Answer

The durable catalogue is **Begin** (formation snapshot and per-game rotation seed),
**Mark attendance** (player, arrived or left, and effective round), **Use lineup**
(round and complete engine-suggested starting lineup), **Swap** (target round, plan or
live screen, and the two tapped players), **Subs**, **End Game**, **Abandon Game**, and
**Undo**. Subs, End Game, Abandon Game, and Undo carry no payload. A plan-screen Swap and
a live-screen Swap are one kind; the screen in its target tells the fold whether it
adjusts a starting lineup or changes a live one.

Actions are one append-only **ordered log**, with no parent pointer or action tree. A
past-round action gives the projection enough target context to replay the corrected
state and omit later gameplay data that no longer follows from it. Those original rows
remain permanent but are not in effect or counted. The projection is one canonical
domain-layer `GameState`: lifecycle, current round and screen, effective rounds and
lineups, attendance, player histories and counts, plus whether the single Undo is
available. The API exposes that folded state, never the raw log.

Undo is one deliberately small recovery. It neutralizes only the immediately preceding
coach action, then disappears; there is no Redo and no multi-step walk-back. This amends
ADR 0009 through [ADR 0010](../../../docs/adr/0010-an-ordered-game-log-has-one-step-undo.md).
