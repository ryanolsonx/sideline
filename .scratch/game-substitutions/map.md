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

- [Coach identity and team ownership](issues/01-coach-identity-and-team-ownership.md):
  Coach is never persisted as a row, only a normalized (trimmed, collapsed, lowercased)
  username column on Team; the username cannot be renamed, travels in a readable
  non-`httpOnly` cookie that doubles as what remembers the coach between visits, is
  written by the browser with no `signIn` mutation, and is rejected by the API when
  absent while the front end routes to the username screen before it can be; the avatar
  and its Sign out sit top-right everywhere except the in-game flow. The openness is
  deliberate, recorded as
  [ADR 0001](../../docs/adr/0001-identity-is-a-username-and-nothing-else.md).

- [Team format and formation](issues/02-team-format-and-formation.md): a formation is a
  count per outfield position stored as JSON, with the goalie structural rather than
  counted and format derived as the sum plus one; two players at a position are
  interchangeable, so no numbered slots and no presets in the model, only on the screen;
  team setup grows a third step after the roster; roster and formation are both edited
  from the team screen; the game snapshots the same JSON at Start, which is why editing a
  team's formation needs no guard while a game is live. Recorded as
  [ADR 0002](../../docs/adr/0002-a-formation-is-outfield-counts.md).

- [Game identity and lifecycle](issues/03-game-identity-and-lifecycle.md): a game is us
  and who did what, carrying a uuid, a team and a start time, with no opponent and no
  name; eight rounds is a constant rather than a column, so ending at seven and
  finishing eight leave identical records; four states, Setup / Live / Ended /
  Abandoned, where Ended means it counts and Abandoned means it did not happen and
  nothing is ever deleted, recorded as
  [ADR 0003](../../docs/adr/0003-nothing-is-ever-deleted.md); End Game is hidden until round 7 and replaces the forward
  action at round 8; unfinished games are unrestricted and nothing auto-resumes, the
  team screen's list being the way back; the URL is `/teams/:teamId/games/:gameId`,
  which introduces the router `apps/web` does not yet have; ownership is enforced in the
  API and its three failures are deliberately distinguishable to the coach; and
  `matches/` stays untouched as the full-stack architecture example until `games/`
  replaces it.

## Not yet specified

- What the "smart logic" actually does with partial-round data, once
  [What a round is: plan versus play](issues/04-round-plan-versus-play.md) and
  [What counts as playing time](issues/06-what-counts-as-playing-time.md) land.
- Whether a player's refusal to play goalie is a remembered preference on the roster
  or a one-off override in the moment.
- Whether fairness ever carries across games, or resets every whistle.
- Changing the formation of a game already underway. Wanted eventually, deliberately
  absent now.

## Out of scope

- Simplified formations derived from player count when short-handed. Deferred by the
  coach during charting; the map settles only the minimum short-handed behavior.
- Midfielders, and formations beyond the three named in
  [Team format and formation](issues/02-team-format-and-formation.md).
- Passwords, real authentication, and anything private. The roster carries first names.
- Sharing with parents or other coaches.
- A game clock, score, goals, stats, and season-long reporting.
- Offline and PWA behavior.
