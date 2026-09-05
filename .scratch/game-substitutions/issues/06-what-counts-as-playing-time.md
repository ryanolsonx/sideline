# What counts as playing time

Type: grilling
Blocked by: 04
Status: resolved

## Question

Equal playing time is the point of the product, and in-round substitutions make the
arithmetic fractional rather than integer. A player who came off two minutes into a
round did not play it the way the others did, but there is no clock to say how much
of it they played.

- What is the unit of fairness: rounds started, rounds finished, some fraction, or a
  count of stints?
- Without a clock, how is a partial round valued? Half a round regardless? Not at all?
  Fully, on the grounds that they were picked?
- Does time at goalie count the same as time on the field?
- A player who arrives at round four cannot catch up. What is fair for them?
- What does the coach need to *see* about fairness mid-game, as opposed to what the
  engine needs to compute?

## Answer

**The unit is the whole round.** No fraction, no stint count. A change carries an order and
no moment ([ADR 0004](../../../docs/adr/0004-a-round-keeps-what-it-began-as.md)), so the only
fraction derivable is a segment count between changes, which measures how often the coach
tapped rather than how long a child played. The round is the atom the coach already thinks in,
and a count in rounds is one they can check against their own memory.

**A round is credited to anyone who was on the field at any point in it**, however little.
Both sides of a mid-round swap are credited, so a round can credit more players than it has
slots. Accepted: the ordinary rotation happens at the break, so an in-round change is the
exception, and the looseness errs toward the child who actually went out and played. This is
AYSO's published rule, the only prior art of its kind found anywhere.

**Counts are compared raw, within one game.** Share-of-rounds-present was recommended and
overturned by the coach. When a child is away the others cover and bank the playing time; a
share treats that bank as noise and levels the late arrival on arrival, whereas a raw count
leaves the coverers standing higher, so they are rested next while the fresh child keeps
playing. Playing time is the benefit being distributed, so a higher count is a benefit already
received rather than a burden to correct. Consequence accepted without mitigation: a child
arriving at round six of eight cannot reach the others' count, and nothing compensates for it.

Because there is no denominator, there is no need for a rule about what makes a round one of
your *present* rounds. Whether a mid-round arrival goes on immediately or waits for the break
is a presence-state question and belongs to
[Presence changes mid-game](09-presence-changes-mid-game.md).

**A late arrival playing the next round is a result, not a rule.** Arriving on zero makes them
the most-owed player, so the engine picks them unprompted. A hard constraint would reproduce
what the count already does and would need a tie-break of its own the moment two children
arrive together.

**A round in goal is a round played, at full credit**, with goalie appearances rationed on a
separate axis by [Rotation rules and constraints](07-rotation-rules-and-constraints.md). Half
credit would show a child who played all eight rounds as having played seven. Not a setting:
one rule, picked.

**The live round counts the moment it goes onto the field**, so an in-round substitution moves
the numbers live and there is no special case at the moment of advancing. The screen never
disagrees with what the coach sees by looking up.

**The coach reads a per-round history, not a metric**: one mark per round in round order,
with **three** marks rather than two. Absent is neither played nor sat, because absence is not
a turn taken and is not owed back, so reusing the sat mark would lie about what the child is
owed. Rendering — width on a phone, the mark for a partly-played round, whether it merges with
the grid — belongs to
[The player×round grid and the playing-time dots](12-grid-and-playing-time-dots.md).

**Fairness never crosses games.** It resets every whistle.

Recorded as [ADR 0005](../../../docs/adr/0005-a-round-played-is-a-round-played.md).
