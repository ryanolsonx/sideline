# Prior art: the existing subs tool

Read from the deployed client-side source at `https://ryanolson.dev/subs/` on
2026-09-05: `assignment-engine.js` (537 lines), `game-state.js` (405), `rng.js` (83),
`share-roster.js` (61), all unminified. Claims below were checked by reading the source
and, where marked, by executing it under Node.

This is the highest-trust source available to this effort. Unlike the vendor material
in [comparable-rotation-apps.md](comparable-rotation-apps.md), it is an implementation
whose behavior has been validated across real games by the coach specifying Sideline.

## It plans the whole game and shows you one round

The headline, and it contradicts how the tool is described from the outside.

`planRoundAssignment` runs a **beam search of width 24 across every remaining round**
(`roundsRemaining = totalRounds - currentRound`), scoring whole-game futures, and then
returns `beam[0].rounds[0]` — the first round of the best complete plan it found. The
plan is computed, used for one round, and thrown away; the next round re-plans from the
updated history.

So it plans ahead and *presents* one round at a time. It reads as round-at-a-time from
the sideline because that is all the interface ever shows.

This independently matches the conclusion in
[fair-rotation-scheduling.md](fair-rotation-scheduling.md): optimize the game, present
the round. Two sources reaching it by different routes.

## The seed is wired up but does not reach the round assignment

`rng.js` is a real seeded PRNG. The seed is generated, put in the URL, persisted with
the game, and threaded down into `chooseRoundAssignment(active, available, byName, randomFn)`.

It is then bypassed. `chooseRoundAssignment` calls `planRoundAssignment` first and
returns immediately on success, and `planRoundAssignment` takes no random function and
calls none. Every scoring function on the live path — `scorePlannedPosition`,
`balanceSpreadScore`, `scoreBenchChoice`, `positionDeviationPenalty` — is deterministic.

Verified by execution: an eight-player roster assigned under seeds `alpha`, `zulu` and
`12345` produced byte-identical lineups.

The randomized path (`chooseLineupPlayers`, `assignPositions`, `chooseGoalie`,
`scoreForNextRound`, `scorePositionAssignment`) is a fallback, reachable only when the
beam empties — every bench combination rejected because someone who must sit cannot.
Forcing that state made the seeds diverge, confirming the path is live but cornered.

Consequence: ties are currently broken by **iteration order**, not by an explicit rule.
`nextBeam.sort` is stable, so equal-scoring futures resolve to whichever the
`combinations` enumeration reached first, which follows roster order. Deterministic, but
incidental rather than chosen — the distinction
[fair-rotation-scheduling.md](fair-rotation-scheduling.md) argues matters.

## One hard constraint, everything else priced

The only inviolable rule besides slot counts: **nobody plays a fourth consecutive
round**. Any bench combination leaving a player at `consecutivePlayed >= 3` on the field
is discarded outright.

Everything else is a weight. Roughly, in descending force:

| Concern | Where | Weight |
| --- | --- | --- |
| Spread of rounds played | `balanceSpreadScore` | 240 × spread |
| Spread of rounds benched | `balanceSpreadScore` | 180 × spread |
| Distance from per-player target | `balanceSpreadScore` | 30 / 26 per round |
| Spread of goalie appearances | `balanceSpreadScore` | 70 × spread |
| Repeat goalie | `scorePlannedPosition` | 45 per prior appearance |
| Consecutive rounds played (bench priority) | `scoreBenchChoice` | 30 each |
| Repeating last round's position | `scorePlannedPosition` | 24 |
| Repeating any position | `scorePlannedPosition` | 18 per prior |

`buildPlannerTargets` computes a per-player fair share by projecting current totals plus
all remaining slots over the roster, so fairness is measured against a moving target
rather than against other players directly.

## Goalie is not once per game

There is no such rule. Repeat goalie is priced at 45 per prior appearance, plus a 16×
deviation weight and a 70× spread term. Once-per-game is the *emergent* behavior when
the roster is large enough, and it degrades gracefully to twice when it is not — which
is exactly the observed behavior, arrived at by pricing rather than by a cap.

## Short-handed formations already exist

`getPositionsForCount` degrades by player count: 1 → Goalie; 2 → +Forward;
3 → +Defender; 4 → +Forward; 5 → `G/D/F/F/F` at fieldSize 5, `G/D/D/F/F` at 6;
6 → `G/D/D/F/F/F`.

This is the capability deferred as out of scope on the map. It is already built and
proven here, and it is smaller than it sounded.

Two divergences from the Sideline spec: there is no 5v5 `1/2/2` option (only `1/1/3`),
and `Center` is normalized to `Forward`, a legacy name.

## A swap rewrites the lineup; no substitution event is recorded

`swapBenchPlayerIntoLineup` overwrites the lineup slot in place, keeping the position,
and moves the displaced player to the bench array. Nothing records that the round began
differently.

This puts the existing tool squarely in the lineup-ledger camp described in
[comparable-rotation-apps.md](comparable-rotation-apps.md). **Sideline's plan-versus-play
distinction, and its in-round substitution events, are genuinely new** — not a
reimplementation of something already working here.

## Rounds are the source of truth

`syncPlayerStats` wipes every derived counter and recomputes it by replaying
`rounds.slice(0, currentRound + 1)`. Nothing accumulates incrementally in storage.
`rebuildGameFromRound` re-derives the tail of a game after an earlier round is edited.

A clean pattern to carry over, and directly relevant to persistence and to editing a
past round.

## Late arrivals are half-solved

Players carry `status` (`not_here_yet` / `bench` / `playing`), `arrivalRound`, and
`startPresent`. `getAvailablePlayers` excludes anyone not yet arrived, so they simply do
not exist to the planner until they show.

`startPresent` is cloned into planner state and then **never read by any live scoring
function** — it is used only in `scoreForNextRound`, on the bypassed path. A late
arrival therefore enters with zero rounds played *and* zero rounds benched, so the
fairness terms treat them as maximally owed playing time while their bench count can
never catch up.

The dead `startPresent` weighting looks like an attempt at this that the planner
rewrite left behind. The question stays open.

## Cost

The beam expands `C(roster, bench)` combinations per node per round. At a 14-player
roster fielding 6, that is 3003 combinations × 24 beam × 8 rounds, each running a
backtracking position search. Worth measuring before assuming it ports to a phone
unchanged.
