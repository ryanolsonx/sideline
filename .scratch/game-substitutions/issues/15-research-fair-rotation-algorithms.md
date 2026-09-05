# Fair rotation as a scheduling problem

Type: research
Status: resolved

## Question

Assigning N players to R rounds of fixed position slots, balancing total playing time,
rotating a scarce role (goalie) with an at-most-once constraint, avoiding repeated
positions in consecutive rounds, and rotating who rests, is a known shape of problem.

Establish, with sources:

- What class of problem this is, and what the standard approaches are.
- Whether a greedy or round-robin construction gives acceptable fairness at this scale
  (roughly 6 to 14 players, 5 to 8 rounds), or whether it needs real optimization.
- How such formulations express soft versus hard constraints, and how they break ties
  deterministically.
- Whether incremental replanning after a manual override is tractable, or whether the
  usual answer is to regenerate from scratch.
- Any known pitfall where locally fair choices produce a globally unfair game.

Findings go in a Markdown file in the repo, linked from this ticket.

## Answer

Findings: [Fair rotation as a scheduling problem](../../../docs/research/fair-rotation-scheduling.md).

This is **personnel rostering**, not sports scheduling. Sports scheduling in the OR sense
is about fixtures; our problem is a multi-period assignment with skill-typed slots,
workload balance and forbidden sequences, and its closest named relative is the Nurse
Rostering Problem, whose constraint taxonomy maps onto ours almost line for line
(coverage per period, one assignment per person per period, legal shift successions,
total-assignment caps). There is essentially no OR literature on youth-sports playing
time, so we borrow method from rostering and own the application.

At our scale, greedy gets minute fairness right and loses everywhere else. A locally
fair greedy hit the theoretical best playing-time spread in every shape tested, but in
the small-squad shapes it forced five or six consecutive-position repeats where an
exhaustive search found schedules with none at the same spread. Goalie-at-most-once
fails only when there are more rounds than players, which is pigeonhole rather than a
scheduling bug and should be surfaced as a fact about the squad. So the question is not
"is greedy fair enough" but "which constraint do we let greedy sacrifice", and the honest
answer is that unaided round-by-round construction produces visibly repetitive schedules
for small squads. Where R·S is not a multiple of N, a spread of one round is the best
any algorithm can achieve; announcing "everyone played 4 or 5" is a correct outcome.

Standard formulations put hard constraints in the model and reify soft ones onto a
Boolean summed into a single weighted objective. Priorities are expressed either by
weighting level i by a base larger than every lower level's range, or by solving,
fixing, and re-solving. Determinism should not be sourced from the solver: OR-Tools
guarantees no reproducibility across versions and has confirmed non-determinism bugs
even single-threaded with a fixed seed. Make the optimum unique in the model instead,
with a bottom-priority tie-break over a canonical player ordering. Note also that
min-max fairness alone is degenerate — many schedules tie — and leximin is the
documented fix, though even leximin fixes only the sorted vector of loads, not who gets
which.

Manual override is the **minimal perturbation problem**, a named and well-studied thing.
The standard framing is a full re-solve with the override pinned as a hard constraint and
a penalty on deviation from the previous schedule. Every argument found against
regeneration concerns compute cost or churn, never quality; regeneration is the benchmark
repair is measured against. Moving stability into the objective removes the churn
objection, so regenerate forward from the override and penalise changing rounds the coach
has already seen.

The pitfalls are real and named: greedy scheduling is non-monotone (a late-arriving
player can reshuffle everyone), sequential construction can drive a scarce role's
eligibility below Hall's condition and dead-end, committing round by round pays an online
algorithm's price on an instance we fully know at kickoff, and per-step fairness is not
end-state fairness. The design implication throughout: optimize the game, present the
round.
