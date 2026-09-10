# 01: Sign in with a coach username

**What to build:** A coach enters a username, is remembered between visits, sees only teams belonging to that normalized username, and can sign out.

**Blocked by:** None (can start immediately).

**Status:** ready-for-human

**Delivery:** Before implementation, propose the next Gherkin slice in conversation and obtain approval. Then implement this ticket as its own stack of the smallest independently green, reviewable PRs. Supporting technical PRs may precede the user-visible slice; every PR head must remain deployable, and the top PR must deliver all acceptance criteria.

- [ ] Entering a username establishes the coach identity without a password or a separate sign-in mutation.
- [ ] Usernames are normalized by trimming, collapsing spacing, and ignoring case.
- [ ] The remembered username restores the coach on a later visit.
- [ ] Team reads and writes are scoped to the current coach, and an absent identity is rejected by the API.
- [ ] The coach can see the current identity and sign out outside the in-game flow.

