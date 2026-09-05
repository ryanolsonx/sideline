# Fair rotation as a scheduling problem

Type: research
Status: open

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
