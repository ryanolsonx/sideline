# Plan the whole game, or one round at a time?

Type: prototype
Blocked by: 04
Status: resolved

## Question

Does the app compute the entire game's rotation at Begin and show all the rounds up
front, or compute each round only when the coach asks for it?

Planning ahead lets a coach see the shape of the game and catch "Riley never plays
goalie" before it happens. Computing as you go cannot be unfair in advance but can
paint itself into a corner by round seven. The early whistle is no longer an argument
against planning ahead, since nothing compensates for truncation.

Build something cheap enough to hold both and react to. The question worth answering
with pixels is whether seeing eight rounds of plan on a phone is useful or
overwhelming.

- Does a plan survive contact with a manual swap, or is it regenerated?
- Is a future round's lineup a promise or a suggestion?

## Answer

**One round at a time.** The engine computes the current round from the standings so
far and does not compute or retain any future round. There is no whole-game plan.

Decided directly by the coach, not by prototype. The prototype was not built, because
the question stopped being open.

Recorded honestly: the evidence pointed the other way. Every product surveyed in
[comparable-rotation-apps.md](../../../docs/research/comparable-rotation-apps.md) plans
the whole game, [fair-rotation-scheduling.md](../../../docs/research/fair-rotation-scheduling.md)
argues per-round fairness can make whole-game fairness unreachable, and the coach's own
tool in [existing-subs-tool.md](../../../docs/research/existing-subs-tool.md) runs a
width-24 beam search across every remaining round while presenting only the first. That
case was put and declined. Research informs this effort; it does not overturn the
coach's specification. Do not reopen this on the strength of those three sources.

The accepted cost: the engine may reach a late round unable to keep everyone equal,
having spent its flexibility earlier. Mitigation, if it bites, belongs in
[Rotation rules and constraints](07-rotation-rules-and-constraints.md) as
lookahead within the scoring rather than as a stored plan.

What this simplifies downstream: there is no future to invalidate, so
[What a manual override does to the future](08-what-a-manual-override-does.md) narrows
to the current round only; [Editing a round that already happened](10-editing-a-round-that-already-happened.md)
has no plan to recompute, only history to re-derive; and
[Game persistence and resumability](13-game-persistence-and-resumability.md) stores
rounds played, never a projection.
