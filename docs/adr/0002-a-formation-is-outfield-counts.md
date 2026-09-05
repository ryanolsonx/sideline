# A formation is outfield counts

A team's formation is stored as a count per outfield position, `{defender: 2, forward: 3}`,
as JSON on the team and copied by value onto a game when the game starts. The goalie is
not one of those counts. There is always exactly one, implied by the formation existing at
all, so a formation with no goalie or two goalies cannot be written down. Format follows:
5v5 or 6v6 is the sum plus one, derived wherever it is shown and stored nowhere.

Three shapes were considered. An enum of presets, one member per named formation, is the
smallest thing that works today and needs a new member and a migration for every formation
after. Numbered slots, `[G, D1, D2, F1, F2, F3]`, make each place on the field distinct.
Counts sit between them.

Numbered slots were rejected because two defenders are the same position. The rotation
rule the coach actually stated is that nobody plays the same *position* two rounds running,
and under numbered slots a player moving from `D1` to `D2` would satisfy that rule while
plainly violating it. The prior-art tool agrees: it emits a bag of positions, not a
numbered lineup. Presets were rejected because midfielders and 7v7 are visible in the fog
ahead, and counts absorb both without a schema change.

Presets survive in the interface. The coach taps a named formation, never a number, and
the button writes counts. "Preset" is a word the screen knows and the model does not.

## Consequences

- One type and one validator serve both the team and the game: every count at least one,
  sum plus one within the legal range. There is nothing to keep in sync.
- Adding midfielders costs an enum member and a map key. Adding 7v7 costs a widened range.
- The game's copy is a value, not a reference. Editing a team never rewrites a game that
  has already started, which is why editing a formation needs no guard while a game is
  live: the snapshot is the guard.
- No SQL-level query can group games by formation without unpacking JSON. Nothing asks to.
- A lineup is a bag of (player, position) pairs. Anything that later wants a stable place
  on the field, a left back as distinct from a right back, is a different model, not an
  extension of this one.
