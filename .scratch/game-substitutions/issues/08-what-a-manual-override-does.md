# What a manual override does to the future

Type: grilling
Blocked by: 05, 07
Status: resolved

## Question

The coach overrules the engine: a kid refuses goalie, someone plays a position twice
running on purpose, two players swap. What happens next?

- Does the override pin only that round and let the engine replan everything after, or
  does it invalidate a plan the coach was already looking at?
- Does an override teach the engine anything, or is it forgotten immediately?
- Can the coach see that a round was overridden, and does the record say so?
- If the engine replans, does the coach lose swaps they already made further ahead?
- Is there a way to say "no, put it back"?

## Answer

Recorded as [ADR 0007](../../../docs/adr/0007-a-coach-adjustment-is-a-swap.md), which also
amends [ADR 0006](../../../docs/adr/0006-goalie-and-defender-are-rationed.md).

**The word is "coach adjustment", and it is a description rather than a record.** No override
entity, no flag, no mode; nothing stores or shows whether a lineup came from the engine or the
coach. An adjustment may break every rule the engine plans by — the coach's prerogative,
already established by ADR 0006.

**An adjustment is a swap, and it moves exactly two players.** Tap a name to make it active,
tap a second name to trade the two. The engine is not consulted and nobody untouched moves.
This rejects the research's recommendation: manual override is the minimal perturbation
problem, whose standard answer is a full re-solve with the choice pinned. A re-solve would
reshuffle children the coach never touched, which reads as the app arguing back with someone
who has one eye on the game. Across a single round the perturbation-minimal answer is very
nearly the swap anyway, so little is given up.

**The gesture is identical on both screens; only where it lands differs**, per
[What a round is: plan versus play](04-round-plan-versus-play.md). On the plan screen it
rewrites what the round begins as. On the live screen it records changes, and one gesture
trading two on-field players records both halves at once, adjacent in the round's order, so
there is never a moment with an empty position.

**The engine runs once per round**, on the coach's first arrival at that round's plan screen,
writing straight into the starting lineup. Revisiting renders what is stored and never
recomputes, which is what keeps ADR 0004's promise that navigation destroys nothing. A round's
starting lineup therefore exists from the moment its plan screen is reached, not from the
moment the coach leaves it.

**Reset** on the plan screen restores the suggestion by re-running the engine rather than
restoring a snapshot; ADR 0006's per-game seed makes those identical, so nothing extra is
persisted. **No reset on the live screen** — unsaying a swap there means swapping again, and
both players keep their credit because both were on the field.

**Nothing is remembered as preference**, and nothing needs to be: the engine plans from
standings derived from what actually happened, so an adjustment is absorbed completely by a
mechanism that already exists. There is also nothing to pin forward into, since no future
round exists until the coach arrives at it.

**The goalie pool advances through the canonical ordering rather than re-offering its head.**
This is the one place the ticket forced a change to ADR 0006. A child who refuses goalie keeps
their zero appearances and stays in the minimum set, so a tie-break that always takes the
first eligible name would suggest them again *every* round until they relent. Round *n* now
resumes where round *n-1* left off and wraps, so the pool empties before it comes back around.
The offset derives from the round number, so determinism holds. Incidental rather than exact:
it cannot tell a refusal from the coach preferring somebody else, and treats both alike. The
exact alternative — recording the refusal on the player — was rejected for making an
adjustment into a record.

**Vocabulary settled here**, reassigning a term that was already in `CONTEXT.md`:

- **Swap** — two players trading places. The coach's gesture.
- **Substitutions** / **Subs** — the stop between two rounds, and the label on the action out
  of a live round. **Break** is retired; Subs is the coach's word for what it named.
- **Use Lineup** — the action out of the plan screen, ticket 04's other half of the
  alternating forward action.
- **Substitution** no longer names one change. **Change** remains what gets recorded, and one
  swap may record two.

**Absorbed from the fog:** whether a refusal to play goalie is a remembered roster preference
or a one-off. It is a coach adjustment and nothing more, with the pool-advancing rule above
carrying the consequence.

**Left to the screen tickets:** the visual treatment of the tap-to-activate gesture, and
whether the plan screen can express a change with an empty side at all, belong to
[The live-game screen on a phone](11-live-game-screen-on-a-phone.md).
