# The action catalogue and the fold

Type: grilling
Blocked by: 10
Status: open

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
