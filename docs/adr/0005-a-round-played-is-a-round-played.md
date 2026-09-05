# A round played is a round played

Playing time is counted in **whole rounds**, and a player is credited with a round if they
were on the field at any point during it, however little of it. Rounds played are compared
between players as **raw counts**, within one game. Nothing is fractional, nothing is
weighted, and nothing carries across games.

Sideline has no clock, so it sits in a blind spot the whole category avoids: the surveyed
products in [comparable-rotation-apps.md](../research/comparable-rotation-apps.md) either
count seconds, where partiality never becomes a modelling decision, or credit whole units
without discussing it. Not one vendor publishes a crediting rule. The only published prior
art found anywhere is AYSO's, and it is deliberately blunt: an injured player "is credited
with a 'quarter' played regardless of actual time played."

## Why not a fraction

A fraction was available and was rejected. [ADR 0004](0004-a-round-keeps-what-it-began-as.md)
gives a change an order and no moment, so the only fractions derivable are segment counts
between changes. Three changes crammed into the last twenty seconds produce the same segments
as three spread across a round, so such a fraction measures how often the coach tapped rather
than how long a child played. It is precision about the wrong quantity, and it looks rigorous
enough to survive review.

Crediting a whole round to both sides of a mid-round swap means a round can credit more
players than it has slots. That is accepted. The ordinary rotation happens at the break, so
an in-round change is the exception rather than the rhythm, and the looseness errs toward the
child who actually went out and played.

## Why raw counts and not a share

The rejected alternative was a share: rounds played over rounds the player was present for,
so a child arriving at round four is measured only over the game they were there for and
neither catches up nor is owed anything back. It has an attractive property — with full
attendance every denominator is identical and the share collapses into a plain count, so the
common case never pays for it.

It was rejected because it erases the signal the coach wants most. When a child is away, the
children who are there cover for them and bank the extra playing time. A share treats that
bank as noise and levels the late arrival with everyone the moment they walk up. A raw count
does not: the coverers stand higher, so they are the ones rested next, and the fresh child —
who has done none of the work — keeps playing. Playing time is the benefit this app
distributes, so a higher count is a benefit already received, not a burden to be corrected.

The consequence is accepted rather than mitigated: a child arriving at round six of eight
cannot reach the others' count even playing every remaining round. Nothing compensates for
it, exactly as nothing compensates for a referee ending the game after the seventh.

## Goalie, and what the coach reads

A round in goal is a round played, at full credit. Half credit would show a child who played
all eight rounds as having played seven, which is not a number a coach can defend on the
sideline. Goalie is rationed on its own separate axis instead of by discounting it, which is
what [Rotation rules and constraints](../../.scratch/game-substitutions/issues/07-rotation-rules-and-constraints.md)
settles.

The engine compares counts; the coach reads a **per-round history**, one mark per round in
round order. It is strictly more than a count, since the marks can be counted, and it answers
the question a count cannot — who has sat back-to-back — which is the one a coach actually
feels bad about. It also cannot lie, being the record rather than a summary of it. There are
three marks and not two: a round the player was absent for is neither played nor sat, because
absence is not a turn taken and is not owed back.
