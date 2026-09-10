---
name: implement-stack
description: "Implement work from a spec or tickets as a human-readable stack, then publish a standalone large PR for comparison."
---

# Implement Stack

Implement the work described by the user in the spec or tickets. The completed delivery has two forms:

1. A stack of small, independently green PRs optimized for human review.
2. A standalone PR containing the same commits and final tree, presented as one cohesive feature.

Invoking this skill is an explicit request for both forms. It authorizes creating and publishing their branches and PRs, but never merging them.

## Design the stack

Read the repository instructions, architecture, relevant spec or tickets, and current worktree before choosing seams. Preserve unrelated work.

Plan from prerequisites to behavior. For a full-stack change, prefer this order when those layers exist:

1. Database code first: entity or schema model, migration, registration, and migration-specific tests.
2. Backend domain and persistence.
3. API or request boundary.
4. Frontend presentation.
5. Frontend integration and executable behavior.
6. Focused UX and lifecycle increments.

Use roughly six to eight PRs for a change spanning database, backend, and frontend, but let reviewable seams determine the actual count. Each PR should pose one clear review question and be understandable without reconstructing the whole implementation mentally.

Every PR head must be deployable and green. Introduce a narrow compatibility seam when an old client must coexist with a new backend during the stack. Call that seam out in the PR's review focus, and remove it in a later PR before the top of the stack. The top must contain no scaffolding whose only purpose was making intermediate branches deployable.

Apply the repository's incremental BDD rules. Add only the Gherkin that ships in a PR, and keep all committed scenarios executable.

## Implement and verify

Use the TDD skill where possible, at the agreed seams. Run focused tests and typechecking throughout.

Start the bottom feature branch from the current trunk, then start each later branch from its parent in the stack. Commit no feature work directly to trunk. Build the branches with the repository's stack tooling. Prefer one coherent commit per PR unless preserving a red-green-refactor history materially helps review.

For every branch, run the tests, typechecks, and builds affected by that branch. Run relevant browser acceptance tests when the branch adds observable behavior. Run the full required suite at the top.

Once the top is green, use the code-review skill against the complete stack. Put each fix into the earliest branch that owns the concern, restack its descendants, and repeat the affected verification. Confirm the top tree still represents the intended feature.

## Publish the review stack

Publish or update the stack with the repository's required `gh stack` workflow. Make every PR ready for review.

Give every PR:

- A plain-English title naming its outcome.
- A `## Summary` explaining why this layer exists.
- A `## What changes` describing only its own diff.
- A `## Review focus` identifying the main human decision, compatibility seam, and verification relevant to that layer.

Use the repository's required GitHub metadata workflow, then verify each PR's title, body, base, head, open state, and ready status. The only PR targeting trunk should be the bottom of the stack.

## Publish the standalone feature PR

After the stack is complete and published:

1. Record the exact stack commit list from bottom to top.
2. Create a new standalone branch from the stack's original trunk.
3. Cherry-pick every recorded commit in order. Preserve the commits; do not squash, rebase, or alter the review stack.
4. Verify that the standalone branch's final tree exactly matches the stack's top.
5. Run verification proportional to the replay risk, then push the branch and open a normal ready-for-review PR against trunk.

Present this PR as the primary implementation of one complete feature. Its title and body should explain the product outcome, complete implementation, review focus, and testing guidance. Do not mention cherry-picking, the source stack, or the comparison exercise in the PR.

Finish by reporting the ordered stack links, the standalone PR link, and verification results. State that neither artifact was merged and that trunk was not modified directly.
