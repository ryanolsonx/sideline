---
name: gh-stack
description: Publish and maintain stacked pull requests with the `gh stack` CLI in this repo. Use when splitting work across dependent branches, creating or adding to a stack, submitting or re-submitting stack PRs, setting stack PR titles and bodies, or repairing stack grouping on GitHub.
---

Stacked PRs in this repo are published with the `gh stack` GitHub CLI extension. Run
`gh stack <command> --help` for mechanics; this skill carries only what the CLI does not
tell you.

## Shape of a stack

Keep each branch small and focused on one technology or vertical-slice concern. Trunk is
`master` unless the user says otherwise.

Create branches with `gh stack add <branch>`. When `master` belongs to several historical
local stacks, `gh stack add` prompts for the parent stack: pick the stack containing the
current trunk lineage.

## Per-PR CI gate

Every branch in a stack is a mergeable application, not merely an incremental diff. A green
stack tip does not prove an intermediate PR is mergeable.

Before submitting, walk the stack bottom to top and, on each checked-out branch, run what
`.github/workflows/ci.yml` runs:

```sh
pnpm schema:generate && pnpm codegen
git diff --exit-code -- apps/api/schema.gql apps/web/src/gql
pnpm build
pnpm test
pnpm test:bdd
```

Publish only once every layer is green.

When a GraphQL schema makes an input field required, the same branch carries the regenerated
schema and client artifacts plus compatible callers, seed helpers, and fixtures. If the UI
that supplies the field lands in a later branch, keep the earlier branch deployable with a
narrow default compatibility seam and replace that seam in the UI slice.

## Submitting

Publish and update the stack with `gh stack submit`. Non-interactively, use
`gh stack submit --auto --open` so new PRs are ready for review.

Stack PRs are ready for review, not drafts, unless the user asks otherwise. This overrides
the global default of opening PRs as drafts.

If submission chains the PRs correctly but GitHub stack grouping fails because the local
stack still references an old merged PR, keep the chained PR bases and create the group
explicitly:

```sh
gh stack link --open <bottom-pr> <...> <top-pr>
```

## PR metadata

Set and verify metadata after publishing.

- Plain-English titles, no conventional-commit prefixes.
- Body sections: `## Summary`, `## What changes`, `## Review focus`. Stack PR bodies use
  these instead of the repository pull request template.
- `gh pr edit` does not persist edits reliably in this environment. Update through the REST
  API and read the result back to confirm:

```sh
gh api --method PATCH repos/<owner>/<repo>/pulls/<number> -f title=... -f body=...
gh api repos/<owner>/<repo>/pulls/<number> --jq '.title, .draft'
```

- `gh pr ready <number>` marks a PR ready for review.

## Large-PR comparison

Only when the user explicitly asks after a completed stack, or invokes `$implement-stack`
for both deliverables:

1. Branch from the stack's trunk.
2. Record the stack's commit list, then cherry-pick every stack commit bottom to top onto
   the new branch. Leave the original stack untouched: no squash, no rebase.
3. Push and open a normal ready-for-review PR against trunk.
4. Write it as the primary implementation: a conventional product-facing title, and a body
   summarizing the complete change, key implementation areas, and review and testing
   guidance. The cherry-picking, the source stack, and the comparison stay out of it.
5. Verify title, body, base branch, and ready state through `gh api`.
