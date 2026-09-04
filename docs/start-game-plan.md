# Start Game implementation plan

## Product slice

A coach selects a team, starts a game, chooses 5-on-5 or 6-on-6, marks players present, and sees the opening lineup. The coach can then press **Subs** to advance through eight automatically assigned rounds.

The first release excludes manual swaps, late arrivals, roster editing during a game, resume/history screens, and scheduling.

## Rules

- A game has exactly eight rounds.
- At least three roster players must be present to start.
- 5-on-5 uses one goalie, one defender, and three forwards when five players can play.
- 6-on-6 uses one goalie, two defenders, and three forwards when six players can play.
- When fewer players are present, the formation contracts consistently: goalie first, then defender, then forwards.
- When more players are present than field slots, remaining present players are out for that round.
- The assignment planner balances playing time across all eight rounds and rotates position opportunities where practical.

## Data model

`game`: `teamId`, `fieldSize` (5 or 6), `status` (`ACTIVE` or `COMPLETE`), `currentRound` (1 through 8), and `startedAt`.

`game_round`: `gameId` and `number` (1 through 8).

`game_round_assignment`: `roundId`, `playerId`, `status` (`PLAYING` or `OUT`), and `position` (`GOALIE`, `DEFENDER`, `FORWARD`, or null when out).

All eight rounds are generated and persisted in the same transaction that starts the game. Advancing a round changes only the game’s current round and completion state.

## Frontend boundary

The frontend is deliberately dumb: it submits the selected format and present-player IDs, then renders persisted game data returned by GraphQL. It does not choose a lineup, assign positions, calculate rotation fairness, or construct a future round. Those decisions live in the backend domain planner and are saved before the game is shown.

## Clean PR stack

Each PR must be independently green and have a single review focus.

1. **Plan fair eight-round assignments** — pure domain planner and unit tests only.
2. **Persist planned games and assignments** — migration, entities, repository, and persistence tests; depends on PR 1.
3. **Expose game operations through GraphQL** — `startGame`, `activeGame`, and `advanceGame`; schema generation and service tests; depends on PR 2.
4. **Remove the legacy Matches prototype** — delete the unused screen and its specific operations/tests; no new behavior.
5. **Start a game from a team roster** — team entry point, attendance, format choice, opening lineup, React tests, and generated frontend artifacts; depends on PRs 3 and 4.
6. **Advance rounds with Subs** — Subs action, round-eight completion, and the Cucumber/Playwright happy path; depends on PR 5.

## Required verification

- Each PR: focused tests plus its affected build/type check.
- PR 2 onward: migration run against an isolated PostgreSQL database.
- PR 5: frontend production build.
- PR 6: `pnpm test:bdd` under Node 22.13.0 against a migrated, isolated PostgreSQL database.

## Publishing discipline

- Create branches with `gh stack add` after normalizing the stack.
- Publish only after matching verification passes.
- Use `gh stack submit --auto --open` after each completed slice.
- Verify each PR’s base branch and update its title/body before moving on.
