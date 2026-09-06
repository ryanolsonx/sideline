# Editing a round that already happened

Type: grilling
Blocked by: 05, 08
Status: resolved

## Question

Going back shows a previous round and allows changing it.

- Which rounds are editable: any of them, or only the most recent?
- What can change: the lineup, the substitutions within it, both?
- What happens to the rounds after the edited one? Recomputed, left alone, or
  invalidated?
- Does editing a played round differ from editing a planned one, given
  [What a round is](04-round-plan-versus-play.md)?
- Can a round be edited after End Game?
- How does the coach get back to where they were?

## Answer

A game is an **append-only log of coach actions**, and editing a round that already happened is
not a rule of its own — it is what acting in the past does to that log. Recorded as
[ADR 0009](../../../docs/adr/0009-a-game-is-an-append-only-log-of-coach-actions.md), which
amends ADRs 0003, 0004, 0007 and 0008.

**Which rounds** — any of them, back to round one. **What can change** — anything: the starting
lineup on the walked-back round's plan screen, another change on its live screen, exactly as the
live round behaves. **When it bites** — on the first swap, with **no confirmation**, because a
coach watching a game is better served by a mistake they can unsay than by a dialog they must
read.

**What happens to the rounds after it** — they branch away rather than being discarded. They are
retained, unreachable and counted by nothing, and **undo** brings them back. Undo and redo walk
the log one action at a time for the whole game, back as far as Begin; acting after an undo
branches and empties redo. The affordance is small and permanent in the **bottom-left corner**.

**Planned versus played** — no difference, because a round carries no state; the screen the coach
stands on still decides where a move lands, per ADR 0004.

**After End Game** — no. Ended means it counts, and an ended game accepts no editing. Undo's
ceiling is End Game, its floor is Begin.

**Getting back** — one round at a time through the ordinary Subs action, each planned fresh
because arriving is a first arrival. No fast-forward: the engine can regenerate a plausible round
4 but cannot know the swap the coach made in round 5, and inventing history is worse than
re-walking it.

**Attendance** — ADR 0008 holds. Marks in effect past the branch point are re-emitted onto the
live chain keeping the round they take effect from. This is the one stated exception to the log
being a single list, taken because the alternative was the architecture dictating what the coach
experiences.

The coach chose the log over a bolted-on undo after the case against was put — the permanent
schema cost of an immutable log, and the cheaper command-log alternative — and the case for
rested on four prior ADRs having already reached the same shape independently.

The action catalogue and each action's payload are deliberately not settled here; they are
[The action catalogue and the fold](17-action-catalogue-and-the-fold.md).
