# 05: Play the first suggested round

**What to build:** Beginning a Game produces a deterministic first-round lineup, displays players by position with Out first, and lets the coach use that lineup to make round one Live.

**Blocked by:** 04: Start a Game and confirm attendance.

**Status:** ready-for-human

**Delivery:** Before implementation, propose the next Gherkin slice in conversation and obtain approval. Then implement this ticket as its own stack of the smallest independently green, reviewable PRs. Supporting technical PRs may precede the user-visible slice; every PR head must remain deployable, and the top PR must deliver all acceptance criteria.

- [ ] Beginning a Game creates a deterministic suggestion for round one from the Game snapshots and confirmed attendance.
- [ ] The planning screen presents Out players first, followed by goalie, defenders, and forwards.
- [ ] The screen clearly communicates that the lineup is planned rather than Live.
- [ ] Choosing Use Lineup records the round's starting lineup and makes round one Live.
- [ ] The canonical Game projection reconstructs the same state from the ordered action log.

