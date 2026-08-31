# Agent Instructions

If you want to know about the architecture and directory structure, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Feature discovery and Gherkin

When exploring a new feature, treat the conversation as a discovery and iteration phase unless the user explicitly asks to implement or save it.

- Work from small to large: clarify the smallest useful behavior first, then add edge cases and broader workflows.
- Show proposed Gherkin in the conversation before creating or changing any `.feature` file.
- Iterate on the wording, scenarios, and scope with the user until they explicitly approve writing it to the repository.
- Do not add step definitions, test dependencies, application code, or other implementation during feature discovery unless the user separately authorizes that work.

### Incremental BDD delivery

After the user approves implementation, treat the approved Gherkin as a destination rather than a feature file that must be added all at once.

- Build a growing executable specification. Start with the smallest independently useful behavior and add later steps or scenarios only when the corresponding behavior will ship in that PR.
- Never commit a complete feature containing pending, skipped, tagged-out, undefined, or intentionally failing future scenarios.
- Keep every PR head green, deployable, and reviewable. Observe the red test locally during the TDD cycle; a failing commit does not need to be preserved in Git.
- Prefer one observable behavior per vertical-slice PR. Keep the production change, its Gherkin, required step definitions, and focused lower-level tests in the same PR.
- It is acceptable to add a small supporting technical PR, such as a tested persistence capability, without expanding the Gherkin when it creates no new user-visible promise. Existing BDD scenarios must remain green.
- Do not add generalized step libraries speculatively. Add only the Cucumber steps required by scenarios that currently exist, and express them in product language rather than implementation language.
- Run browser scenarios against deterministic state and real application boundaries when the scenario claims persistence. Reset or isolate test data between scenarios.
- Use a representative mobile viewport for mobile-first workflows. Assert observable behavior and accessibility semantics rather than pixel-perfect layout in Cucumber.

Use the test layers for different purposes:

- Cucumber and Playwright cover a small number of user-visible journeys through the application.
- React Testing Library covers component behavior such as form state, focus, validation, lists, and screen transitions.
- API and domain Vitest tests cover business rules, GraphQL behavior, persistence, transactions, and failure cases.
- Avoid duplicating every edge case at every layer. Put each behavior at the lowest layer that proves it confidently, while retaining Cucumber coverage for the product promise.

For each BDD slice:

1. Add only the next Gherkin step or scenario whose behavior will ship in the PR.
2. Add only the step definitions required by that Gherkin.
3. Run the new test and observe the expected failure locally.
4. Add focused lower-level tests to drive the implementation where useful.
5. Implement the smallest behavior that makes the new and existing tests pass.
6. Refactor while the suite remains green.
7. Verify there are no pending or intentionally disabled scenarios, then run the relevant tests, build, and type checks before publishing the PR.

## Full-stack development

Prerequisites: Node.js 22.13 (the repository `.nvmrc` pins 22.13.0), pnpm 11.9 or later, Docker, and Docker Compose v2 (`docker compose`). If using nvm, run `nvm use` before starting the stack. Use the pinned Node version rather than an arbitrary newer release: the current Cucumber version rejects Node 25.

For a first-time setup, or whenever dependencies, migrations, or generated GraphQL artifacts need refreshing, run the full local stack with:

```sh
pnpm setup
```

This installs dependencies, starts PostgreSQL, applies migrations, and regenerates GraphQL artifacts. Run it intentionally when one of those steps is needed; it does not start the development servers.

To start or restart the prepared local applications, run:

```sh
pnpm serve
```

This starts both development servers only. Stop them with `Ctrl+C`; stop the database separately with `pnpm db:down`.

The equivalent individual commands are:

```sh
pnpm install
pnpm db:up
pnpm db:migrate
pnpm schema:generate
pnpm codegen
pnpm serve
```

- `pnpm dev` starts both the NestJS API (`http://localhost:3000/graphql`) and React/Vite web app (`http://localhost:5173`).
- Run commands through `pnpm`; do not invoke Vite or Nest binaries directly.
- Keep generated GraphQL artifacts committed. After API DTO/resolver changes, run `pnpm schema:generate`; after frontend operation changes, run `pnpm codegen`.
- Apollo Server v5 relies on `@as-integrations/express5`; keep that adapter installed with the API dependencies.
- `pnpm-workspace.yaml` deliberately permits build scripts for `esbuild` and `@apollo/protobufjs`.

## Behavior-driven, test-driven development

Use BDD as the acceptance-test layer and TDD as the implementation rhythm for product changes.

- Before implementing a new or changed feature, discuss its behavior with the user and collaboratively write or update the Gherkin feature file in `features/`. Do not begin implementation until the scenarios and the public seams they exercise are agreed.
- Describe observable user behavior and business outcomes in feature files. Avoid UI mechanics, selectors, database details, GraphQL operations, and implementation terminology in Gherkin.
- Work in thin vertical slices using red → green cycles: add one failing scenario or example, run it to confirm the expected failure, implement only enough behavior to pass, then repeat. Do not write a batch of speculative scenarios followed by a batch of implementation.
- Drive browser acceptance scenarios through Cucumber step definitions and Playwright. Test through the public browser interface; do not use direct database queries or internal application calls to prove an outcome that a user should observe.
- Keep step definitions reusable and intention-revealing. Prefer accessible Playwright locators such as roles and labels over CSS selectors, and keep assertions in outcome-oriented `Then` steps.
- Keep lower-level unit or integration tests for domain rules and focused seams where they provide faster feedback. BDD scenarios cover representative product behavior rather than every permutation.
- Treat committed feature files as living documentation of what is built. Update them in the same change when behavior changes, and never make an existing scenario pass by weakening its stated outcome.
- Run `pnpm test:bdd` for the acceptance suite and `pnpm test` for the complete suite. Install the Chromium runtime once with `pnpm test:bdd:install`; use `pnpm test:bdd:headed` when visual debugging is useful.

### Full-stack BDD harness

- `pnpm test:bdd` starts the Nest API on port 3000 and Vite on port 4173, launches Chromium at a mobile viewport, and stops the application processes afterward.
- The behavior harness expects a reachable, migrated PostgreSQL database. It uses the normal `DATABASE_*` environment variables and truncates the `team` and `player` tables before every scenario for deterministic state.
- Keep `cucumber.mjs` on `requireModule: ['tsx/cjs']` with TypeScript files listed under `require`. Loading current `tsx` through Cucumber's `loader` option fails on Node 22 because `tsx` requires Node's `--import` mechanism.
- CI provides PostgreSQL, applies migrations, and installs Chromium before running the behavior suite. Keep those CI steps when changing the harness.
- The harness treats any non-5xx response from the GraphQL URL as proof that the API is ready because an HTTP GET to the POST-oriented GraphQL endpoint need not return 2xx.

If Docker Compose is unavailable locally but the Homebrew PostgreSQL tools are installed, use an isolated temporary cluster rather than modifying a developer database. Pick an unused port if 5432 is reserved:

```sh
bdd_pg_dir=$(mktemp -d /private/tmp/sideline-bdd-postgres.XXXXXX)
initdb -D "$bdd_pg_dir" -U sideline -A trust
pg_ctl -D "$bdd_pg_dir" -l "$bdd_pg_dir/postgres.log" -o "-p 55432 -h 127.0.0.1" start
createdb -h 127.0.0.1 -p 55432 -U sideline sideline
DATABASE_PORT=55432 pnpm db:migrate
DATABASE_PORT=55432 pnpm test:bdd
pg_ctl -D "$bdd_pg_dir" stop
```

Remove the temporary directory after the server has stopped and verification is complete.

## Stacked pull requests

- Keep PRs small and focused on one technology or vertical-slice concern.
- Create branches with `gh stack add <branch>` and publish/update the stack with `gh stack submit`.
- When `master` belongs to multiple historical local stacks, `gh stack add` prompts for the parent stack; select the stack containing the current trunk lineage before creating the branch.
- For non-interactive publication, use `gh stack submit --auto --open` so newly created PRs are ready for review.
- If submission creates the PR chain but GitHub stack grouping fails because the local stack still references an old merged PR, preserve the correctly chained PR bases and run `gh stack link --open <bottom-pr> ... <top-pr>` to create the GitHub stack explicitly.
- PRs should be ready for review, not drafts, unless the user explicitly asks otherwise.
- Set and verify PR metadata after publishing:
  - Use plain-English titles without conventional-commit prefixes.
  - Use `## Summary`, `## What changes`, and `## Review focus` in each body.
  - In this environment, use `gh api --method PATCH repos/<owner>/<repo>/pulls/<number> ...` for title/body updates; verify through `gh api`. The installed `gh pr edit` command did not persist edits reliably.
  - Use `gh pr ready <number>` to mark a PR ready for review.

## Stacked versus large PR experiment

When the user explicitly gives the go-ahead after a completed stack:

- Create a new standalone branch from the stack's trunk (`master` unless stated otherwise).
- Record the full stack commit list, then cherry-pick every stack commit from bottom to top onto the new branch.
- Do not alter, squash, or rebase the original stack as part of creating the comparison PR.
- Push the new branch and create a normal, ready-for-review PR against the trunk.
- Write the large PR as though it were the primary implementation:
  - Do not mention cherry-picking, the source stack, or the comparison experiment.
  - Use a conventional product-facing title.
  - Its body should summarize the complete change, key implementation areas, and review/testing guidance.
- Use the repository's REST API metadata workflow (`gh api ...`) and verify the final title, body, base branch, and ready-for-review status.
