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

- [What a round is: plan versus play](issues/04-round-plan-versus-play.md): a round has two
  screens and one alternating forward action, where the planning screen for a round *is* the
  substitution break; the screen the coach is standing on decides whether a move rewrites what
  the round begins as or records a change, which is why navigation is free and destroys
  nothing; a round holds its starting lineup plus an ordered list of changes and the on-field
  lineup is only ever the fold of the two, so a substitution can never overwrite what the round
  began as; a change has an order and no moment; no round state is stored, only the round and
  screen the game is on, so a round cannot be in the wrong state; back stops at round 1's
  planning screen; nothing is refused for being incomplete; and modifying a past round discards
  every round after it, decided by the coach against the cost of re-entering real history from
  memory. Recorded as
  [ADR 0004](../../docs/adr/0004-a-round-keeps-what-it-began-as.md).

- [What counts as playing time](issues/06-what-counts-as-playing-time.md): the unit is the
  whole round, credited to anyone on the field at any point in it however little, so both sides
  of a mid-round swap are credited and a round may credit more players than it has slots; counts
  are compared raw within one game, never as a share of rounds present, because the players who
  covered while someone was away banked that time and should be rested before the fresh
  arrival, which overturned the recommendation on the coach's call; a late arrival playing next
  is therefore a result of the count rather than a rule, and a child arriving late enough simply
  cannot catch up; goalie counts at full credit and is rationed on its own axis; the live round
  counts the moment it goes onto the field; and the coach reads a per-round history of three
  marks, absent being neither played nor sat. Fairness never crosses games. Recorded as
  [ADR 0005](../../docs/adr/0005-a-round-played-is-a-round-played.md).

- [Rotation rules and constraints](issues/07-rotation-rules-and-constraints.md): goalie and
  defender are **rationed** — each drawn from the players who have held it fewest times, neither
  held two rounds running — while forward is the remainder and repeats freely, because these are
  burdens spread rather than opportunities offered, the opposite polarity from playing time;
  rationing is hard rather than priced, against the prior art, and is safe because a
  minimum-appearance set is never empty; nobody sits two rounds running, which is satisfiable
  only because a team is now capped at nine and which kills the existing tool's
  fourth-consecutive-round rule outright; below the hard rules the preferences yield in the order
  playing time, goalie spread, defender spread, streak length; a position is credited to anyone
  who held it at any point in the round, so a mid-round goalie change burns two appearances; ties
  break on an ordering derived from a **per-game seed** stored at Start, so round one is not
  identical in every game; and the rules bind the engine, never the coach. The engine looks ahead
  internally, discards it, and runs in the API. Recorded as
  [ADR 0006](../../docs/adr/0006-goalie-and-defender-are-rationed.md).

- [What a manual override does to the future](issues/08-what-a-manual-override-does.md): the word is
  **coach adjustment**, a description of a lineup differing from the engine's suggestion rather than a
  record — no entity, no flag, nothing marking a round as adjusted; an adjustment is a **swap** of
  exactly two players, tap-to-activate then tap-to-trade, identical on both screens and rejecting the
  research's pinned re-solve because it would reshuffle children the coach never touched; the engine
  runs **once per round**, on first arrival at its plan screen, so revisiting never recomputes and
  ADR 0004's promise that navigation destroys nothing survives; **Reset** on the plan screen re-runs
  the engine rather than restoring a snapshot, and the live screen has no reset because unsaying a
  swap means swapping again; nothing is remembered as preference and nothing needs to be, since the
  engine plans from what actually happened; and the goalie pool now **advances** through the canonical
  ordering rather than re-offering its head, so a child who refuses is not asked again every round.
  Recorded as [ADR 0007](../../docs/adr/0007-a-coach-adjustment-is-a-swap.md), which amends ADR 0006's
  tie-break. Vocabulary: **Swap**, **Substitutions**/**Subs** (retiring **Break**), **Use Lineup**.

- [Presence changes mid-game](issues/09-presence-changes-mid-game.md): a game carries an
  **attendance** log of marks, each a player, a round, and arrived or left, from which
  participation and the three history states are folded; Setup's who-turned-up list is the same
  log stamped ahead of round 1, there is no `Injured` state, and one **Adjust players** button
  showing the roster as checkboxes serves both. When a mark bites follows the screen, extending
  ADR 0004: on the plan screen it counts for the round being planned and re-runs the engine for
  it, discarding swaps already made, because a changed roster is new input rather than a revisit;
  on the live screen it counts from the next round in both directions, so a child who has gone
  home stays in the record until the coach taps Subs and a departure never leaves a mid-round
  hole. The one exception is an arrival while the side is short, put on the field immediately.
  Attendance survives a walk-back, since ADR 0004 discards rounds and attendance is not one. A
  short side is the formation underfilled — goalie, defenders, then forwards, leftover forward
  slots empty and said plainly — and where that makes ADR 0006 impossible,
  never-two-rounds-running yields while fewest-held stays hard. Recorded as
  [ADR 0008](../../docs/adr/0008-attendance-is-marked-from-where-you-stand.md).

- [Editing a round that already happened](issues/10-editing-a-round-that-already-happened.md): a
  game is an **append-only log of coach actions** and editing the past is not a rule of its own but
  what acting in the past does to that log; any round back to round one is reachable and anything on
  it can change, the first swap bites with no confirmation, and the rounds after it **branch away**
  rather than being discarded — retained, counted by nothing, and brought back by **undo**, which
  with redo walks the log one action at a time from Begin to End Game via a small permanent
  affordance bottom-left. Getting back is one round at a time with each replanned fresh, since a
  fast-forward would invent history. Nothing is editable after End Game. Attendance rides across a
  branch, the single stated exception to the log being one list, taken so the architecture does not
  dictate what the coach experiences. The permanent schema cost of an immutable log was put to the
  coach and accepted; the case for it was that four prior ADRs had independently reached the same
  shape. Recorded as
  [ADR 0009](../../docs/adr/0009-a-game-is-an-append-only-log-of-coach-actions.md), amending ADRs
  0003, 0004, 0007 and 0008. Vocabulary: **Action**, **Log**, **In effect**, **Undo**/**Redo**,
  **Branch**.

- [The live-game screen on a phone](issues/11-live-game-screen-on-a-phone.md): the screen is a
  **list, not a pitch** — one 44px row per player carrying position tag, name, dots and count,
  with positions as group headings and **out first**, above goalie, because who is coming on next
  is what the coach reaches for; the player×round grid is **not behind a tap** but fills the space
  nine players cannot, ordered by who is owed time, so the escape hatch the ticket asked for does
  not exist; plan versus live is carried by a banner and a strip of round pips rather than by the
  surface, which is what a list gives up against the pitch layout; an in-round change reads as an
  amber row labelled `on`, the player who came off having left the list; and 44px is the floor,
  which caught Adjust players as an 18px link and made it a row at the foot of the out group. The
  two-column variant was rejected as too much for a phone. Whether the per-row dots survive
  alongside a permanent grid is left to
  [The player×round grid and the playing-time dots](issues/12-grid-and-playing-time-dots.md).

## Not yet specified

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
