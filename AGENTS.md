# Agent Instructions

If you want to know about the architecture and directory structure, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Full-stack development

Prerequisites: Node.js 22.13 or later (the repository `.nvmrc` pins 22.13.0), pnpm 11.9 or later, Docker, and Docker Compose v2 (`docker compose`). If using nvm, run `nvm use` before starting the stack.

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

## Stacked pull requests

- Keep PRs small and focused on one technology or vertical-slice concern.
- Create branches with `gh stack add <branch>` and publish/update the stack with `gh stack submit`.
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
