# 03: Manage a team's roster and formation

**What to build:** From the team screen, the coach can update the roster or formation used by future Games without affecting existing Game snapshots.

**Blocked by:** 02: Create a team with its formation.

**Status:** ready-for-human

**Delivery:** Before implementation, propose the next Gherkin slice in conversation and obtain approval. Then implement this ticket as its own stack of the smallest independently green, reviewable PRs. Supporting technical PRs may precede the user-visible slice; every PR head must remain deployable, and the top PR must deliver all acceptance criteria.

- [ ] The coach can open a team and edit its roster.
- [ ] The coach can change the team's supported formation.
- [ ] The same roster-size and formation rules used during setup are enforced during editing.
- [ ] Only the owning coach can view or change the team.
- [ ] Changes affect future Games while existing Game snapshots remain unchanged.

