# A Game starts with a roster snapshot and batch attendance

Starting a Game creates its identity before any GameAction: UUID, team, start time,
formation snapshot, rotation seed, and roster snapshot. The coach then checks the
players who are present and taps Start. That one tap appends one **Mark attendance**
GameAction carrying the complete list of present player IDs, rather than persisting a
row for every checkbox toggle.

Later attendance adjustments use the same complete-list action, stamped with the round
where the list takes effect. The projection reads successive attendance lists to decide
who is participating. This amends ADR 0008: the coach still sees checkboxes and one
Adjust players surface, but the durable record is a confirmation of the whole list, not
a series of individual arrivals and departures.
