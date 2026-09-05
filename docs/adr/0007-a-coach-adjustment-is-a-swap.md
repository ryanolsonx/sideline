# A coach adjustment is a swap, not a re-solve

The coach overrules the engine constantly: a child refuses goalie, two players want to trade,
someone plays forward twice on purpose. [ADR 0006](0006-goalie-and-defender-are-rationed.md)
established that the rules bind the engine and never the coach, and left open what happens to
the rest of the game when the coach exercises that. This is that answer.

A **coach adjustment** is any lineup the coach settles that differs from what the engine
suggested. It is a description of a situation, not a record: there is no override entity, no
flag, no mode, and nothing anywhere says whether a lineup came from the engine or from the
coach. The coach was standing there when they did it.

## The adjustment is a swap, and it moves exactly two players

The gesture is a **swap**: two players trade places. The engine is not consulted, and no
player the coach did not touch moves.

[The research](../research/fair-rotation-scheduling.md) names the alternative and recommends
it: manual override is the minimal perturbation problem, whose standard answer is to re-solve
the model with the coach's choice pinned as a hard constraint and a penalty on deviating from
the previous solution. That was rejected. Under a re-solve, moving one child quietly reshuffles
two others, and a coach with one eye on the game watches the app rearrange children they never
touched. An adjustment must do what the coach can see it doing and no more.

The cost is real and small: a swap can leave a round the engine would never have proposed, and
the engine will not tidy it. That is the point. The perturbation-minimal answer across a single
round is very nearly the swap in any case, so little is given up — the literature's argument is
about whole timetables, where a pinned constraint propagates for weeks.

## The engine runs once per round

A round's suggestion is computed when the coach first reaches that round's plan screen, and is
written straight into the round's starting lineup. Revisiting the screen renders what is
stored; the engine is never run for that round again. This is what keeps
[ADR 0004](0004-a-round-keeps-what-it-began-as.md)'s promise that navigation destroys nothing —
a recompute on every visit would silently overwrite the coach's adjustments. A consequence
worth naming: a round's starting lineup exists from the moment its plan screen is reached, not
from the moment the coach leaves it.

**Reset** on the plan screen restores the suggestion by re-running the engine rather than by
restoring a stored copy. ADR 0006's per-game seed makes the two identical, so nothing extra is
persisted. Where presence has changed in the meantime the answer differs, which is correct: it
is the suggestion for the situation as it now stands.

There is no reset on the live screen. The round keeps what it began as, and unsaying a swap
there means performing another swap. Both players keep their credit, because both were on the
field.

## Nothing is remembered, and nothing needs to be

An adjustment teaches the engine no preference: no weight, no sticky flag, no lock carried
forward. It needs none, because the engine plans each round from the standings **derived from
what actually happened**. Move a child into goal by hand and they hold a goalie appearance;
the ration reads it and will not pick them again. Every adjustment is therefore absorbed
completely and permanently by a mechanism that already exists. There is also nothing to pin
forward into, since [ADR 0004](0004-a-round-keeps-what-it-began-as.md) and the round-at-a-time
decision mean no future round exists until the coach arrives at it.

## The goalie pool advances instead of re-offering its head

One case forces an amendment to ADR 0006. A child who refuses goalie keeps their zero
appearances, so they stay in the minimum-appearance set. Under a tie-break that always takes
the **first** eligible name in the canonical ordering, they are still at its head next round,
and the engine suggests them again every round until they relent or the game ends.

So the goalie suggestion **advances through** the canonical ordering rather than re-taking its
head: round *n* resumes from where round *n-1* left off and wraps when it runs out. A child
moved out of goal is not revisited until the ordering comes back around, by which time
everyone else with zero appearances has had their turn — the pool empties before it returns.
The offset is derived from the round number, so ADR 0006's determinism holds: walking back and
recomputing still gives the same answer.

This is incidental rather than exact. It does not know a refusal happened, so it cannot tell
one from the coach simply preferring somebody else that round, and treats both alike. The
alternative — recording the refusal on the player for the game — is exact, and was rejected
because it turns a coach adjustment into a record, which is the one thing this ADR says it is
not.
