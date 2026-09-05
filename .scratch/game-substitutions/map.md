# Map: In-game substitutions

Label: wayfinder:map

## Destination

A settled plan for managing substitutions through a youth soccer game on a coach's
phone: the domain model, the round lifecycle, the rotation and fairness rules, the
manual-override semantics, and the screen flow, decided and written down such that
someone can build it in vertical slices with nothing left to decide.

This map plans. It does not build.

## Notes

**Domain:** youth soccer, 5v5 and 6v6, one coach managing several teams. The coach is
on a phone at the side of a field; every interaction competes with watching the game.

**Skills every session should consult:** `grilling` and `domain-modeling` by default.
Prototype tickets call `prototype`; research tickets call `research`.

**Repo context:** `ARCHITECTURE.md` governs. Team and Player already exist. The
`matches` module is disposable example scaffolding, to be renamed or absorbed into
Game. Vocabulary settled so far lives in `CONTEXT.md`.

**Standing preference:** the coach's specification is the source of truth. Research
findings and prior art inform decisions; they do not overturn what the coach has
already given. Where the evidence disagrees with the spec, put the case once, then
record the coach's call and move on.

**Prior art:** the coach's existing client-side tool at `https://ryanolson.dev/subs/`,
read and executed in
[docs/research/existing-subs-tool.md](../../docs/research/existing-subs-tool.md). It
already solves much of this well. Consult it before deciding anything about rotation,
fairness, goalie selection, or short-handed formations.

**Settled before charting:**

- The word is **Game**, never Match.
- Login is a username and nothing else. Typing an unknown name creates the coach, and
  the username itself is the identity: teams carry `coachUsername`, not a surrogate id.
- A round advances only when the coach taps. The app has no clock.
- The ref can end the game early. Nothing compensates for the rounds that never
  happened; it is what it is.
- Formation is snapshotted onto a game at Start, so editing a team never rewrites
  the record of a game already played.
- Goalie is a special kind of position, not merely a position with a tighter rule.

## Decisions so far

<!-- one line per resolved ticket: gist plus link -->

- [Plan the whole game, or one round at a time?](issues/05-plan-ahead-or-round-at-a-time.md):
  one round at a time, computed from the standings so far, with no whole-game plan
  stored or shown; decided by the coach against the weight of all three research
  sources, and not to be reopened on their strength.
- [How comparable rotation apps model this](issues/14-research-comparable-rotation-apps.md):
  every surveyed planner computes the whole game up front and recalculates on any
  disruption, so a future round is a suggestion rather than a promise; a clock is what
  makes a substitution first-class everywhere it is, leaving Sideline's clockless
  premise wanting an arithmetic nothing surveyed has; and no vendor anywhere publishes
  a partial-time crediting rule.
- [Fair rotation as a scheduling problem](issues/15-research-fair-rotation-algorithms.md):
  this is personnel rostering, not sports scheduling, and at our size greedy reaches
  optimal playing-time spread but pays for it in repeated positions that exhaustive
  search avoids at the same spread; determinism must come from a canonical tie-break in
  the model rather than from a solver; a manual override is the minimal perturbation
  problem, whose standard answer is a full re-solve pinning the override; and per-round
  fairness can make whole-game fairness unreachable, so optimize the game and present
  the round.

## Not yet specified

- What the "smart logic" actually does with partial-round data, once
  [What a round is: plan versus play](issues/04-round-plan-versus-play.md) and
  [What counts as playing time](issues/06-what-counts-as-playing-time.md) land.
- Whether a player's refusal to play goalie is a remembered preference on the roster
  or a one-off override in the moment.
- Whether fairness ever carries across games, or resets every whistle.

## Out of scope

- Simplified formations derived from player count when short-handed. Deferred by the
  coach during charting; the map settles only the minimum short-handed behavior.
- Midfielders, and formations beyond the three named in
  [Team format and formation](issues/02-team-format-and-formation.md).
- Passwords, real authentication, and anything private. The roster carries first names.
- Sharing with parents or other coaches.
- A game clock, score, goals, stats, and season-long reporting.
- Offline and PWA behavior.
