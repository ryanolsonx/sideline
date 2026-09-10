# 07: Change a Live lineup

**What to build:** During a Live round, the same swap gesture records ordered Changes while preserving the round's starting lineup and updating the on-field lineup.

**Blocked by:** 05: Play the first suggested round.

**Status:** ready-for-human

**Delivery:** Before implementation, propose the next Gherkin slice in conversation and obtain approval. Then implement this ticket as its own stack of the smallest independently green, reviewable PRs. Supporting technical PRs may precede the user-visible slice; every PR head must remain deployable, and the top PR must deliver all acceptance criteria.

- [ ] The two-tap swap gesture behaves consistently on planned and Live screens.
- [ ] A Live swap appends one coach action containing the resulting ordered Change or Changes.
- [ ] The round's starting lineup is never overwritten after it becomes Live.
- [ ] The on-field lineup is projected from the starting lineup and its Changes.
- [ ] A player who comes on and a player who comes off are both credited with playing the round.

