# 02: Create a team with its formation

**What to build:** Team setup gains its third step, allowing the coach to select 5v5 or 6v6 and a supported formation before saving a roster of at most nine players.

**Blocked by:** 01: Sign in with a coach username.

**Status:** ready-for-human

**Delivery:** Before implementation, propose the next Gherkin slice in conversation and obtain approval. Then implement this ticket as its own stack of the smallest independently green, reviewable PRs. Supporting technical PRs may precede the user-visible slice; every PR head must remain deployable, and the top PR must deliver all acceptance criteria.

- [ ] Team setup collects a team name, a roster, and a supported formation before completion.
- [ ] Formation persists as outfield-position counts, with goalie structural and format derived from the counts.
- [ ] The coach can choose the supported 5v5 and 6v6 formations described by the domain model.
- [ ] A team requires at least one player and permits no more than nine.
- [ ] The created team belongs to the signed-in coach and appears on that coach's team screen.

