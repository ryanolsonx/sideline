# Goalie and defender are rationed, forward is the remainder

Sideline runs **two systems that look alike and mean opposite things**. Playing time is a
benefit, levelled across the roster. Goalie and defender are burdens, rationed across the
roster. Both are counts per player compared within one game, and confusing them inverts the
product.

A **rationed position** is one nobody wants a second turn at. The coach's words: nobody wants
to be goalie or defender twice, everyone wants to score goals. So goalie and defender are each
drawn from the participating players who have held that position fewest times so far this
game, and neither may be held two rounds running. Forward carries no ration and no penalty: it
is what is left after the rationed positions are filled, and repeating at forward is tough
luck.

Rationing is a named property of a position, not something derived from how many slots it has.
In a 1/2/2 formation defender and forward have two slots each and are still not alike.

## Why rationed and not priced

[The existing tool](../research/existing-subs-tool.md) prices everything: repeat goalie costs
45 per prior appearance, on top of a spread term and a deviation term, and "once per game"
emerges from that pricing rather than being written anywhere. It degrades to twice per game on
a thin roster without anyone having decided that it should. That is elegant, and it was
rejected.

Pricing cannot express the rule the coach actually stated, which is about **exhausting the
pool before refilling it**: with five present, five different children keep goal in rounds one
to five and the repeats begin at round six; with nine present, eight children keep goal and
nobody repeats. A weight approximates that and can always be outbid by a large enough
countervailing term, which means the guarantee holds until the one game where it visibly does
not.

The failure mode that makes hard constraints dangerous does not apply here. "Goalie at most
once" is the rule that dead-ends, because it can exhaust the eligible set and leave no legal
lineup — the pigeonhole problem
[the research](../research/fair-rotation-scheduling.md) describes. "Goalie from among those
who have kept fewest" cannot: the minimum set is never empty. The rule was made satisfiable by
construction rather than made soft.

## What is hard, and what is priced

Hard, in that the engine will not propose a lineup that breaks them:

- The formation's slot counts are filled exactly, with exactly one goalie, and no player holds
  two positions in a round.
- Only participating players are picked.
- Goalie and defender are each drawn from the minimum-appearance set, and neither repeats in
  consecutive rounds.
- Nobody sits out two rounds running.

Everything else is a weight, and they yield in this order: levelness of rounds played first,
then spread of goalie appearances, then spread of defender appearances, then the length of an
unbroken run of rounds played. Playing time outranks the rest because it is the point of the
product. The streak penalty is a comfort rule and yields to all three.

That last one is a deliberate divergence from the existing tool, whose *only* hard constraint
is that nobody plays a fourth consecutive round. Nobody sitting twice running makes a fatigue
cap arithmetically impossible: six present at 5v5 means one child sits per round, so somebody
plays seven straight. The two rules cannot both be hard, and the coach chose the one about
sitting.

## Nobody sitting twice running depends on the roster cap

A team holds at most nine players. That cap is what makes the rule satisfiable: the children
eligible to sit are exactly those who played the round before, so the rule holds only while
the number present is at most twice the field size — ten at 5v5, twelve at 6v6. Eleven present
at 5v5 has no legal lineup at all.

**Raising the roster cap past twice the smallest field size breaks the engine**, and whoever
raises it owes this rule a relaxation.

## Positions are credited like rounds are

A player is credited with a position in a round if they held it at any point, matching how
[ADR 0005](0005-a-round-played-is-a-round-played.md) credits the round itself. A goalie
substituted mid-round burns two goalie appearances, and a round can credit more defenders than
it has defender slots. Crediting only the starting lineup would let a coach move a child
through goal all game without the ration noticing, which defeats the rationing.

A run of consecutive rounds is broken by any round in which the player did not hold that
position, whether they were out or absent. It reads the way a coach says it: they were not
defender last round, so defender now is not twice running.

## Determinism without sameness

At the first round of a game every count is zero and everything ties. A fixed tie-break over
roster order would put the same child in goal for round one of every game the team ever plays.

So a game carries a **seed**, generated when the coach starts it and stored alongside the
formation snapshot, and the canonical player ordering that breaks ties is derived from it. The
order is fixed for the life of one game — walking back to round one and recomputing gives the
same answer it gave the first time — and differs between games. Tests set the seed explicitly.

Determinism lives in the model rather than in the search, which is what the research argues
for and what the existing tool intends: `rng.js` threads a seed all the way down to the
planner, and the planner never calls it.

The goalie suggestion advances through that ordering rather than always taking its head, so a
child moved out of goal is not immediately re-offered it. Amended by
[ADR 0007](0007-a-coach-adjustment-is-a-swap.md).

## The rules bind the engine, never the coach

Every rule here constrains what the app **proposes**. None of them constrains what the coach
may do. The coach can build any lineup the formation's slots allow — the same child in goal
twice running included — and the app never refuses it, warns about it, or puts it back.

The engine looks ahead internally, scoring futures across the remaining rounds and returning
only the round in front of the coach, then discarding the rest. This does not reopen
[the decision to plan one round at a time](../../.scratch/game-substitutions/issues/05-plan-ahead-or-round-at-a-time.md):
nothing is stored, retained, or shown. It is the same shape as the existing tool, which runs a
beam across every remaining round and displays `rounds[0]`.
