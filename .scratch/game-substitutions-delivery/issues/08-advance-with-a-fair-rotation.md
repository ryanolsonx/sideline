# 08: Advance with a fair rotation

**What to build:** Tapping Subs ends the current round and proposes the next lineup using rounds played, rationed positions, consecutive-round constraints, and the Game's deterministic ordering.

**Blocked by:** 05: Play the first suggested round.

**Status:** ready-for-human

**Delivery:** Before implementation, propose the next Gherkin slice in conversation and obtain approval. Then implement this ticket as its own stack of the smallest independently green, reviewable PRs. Supporting technical PRs may precede the user-visible slice; every PR head must remain deployable, and the top PR must deliver all acceptance criteria.

- [ ] Tapping Subs moves from the Live round to planning the next round without a clock or separate end-round gesture.
- [ ] Playing-time spread is the first optimization preference after hard constraints.
- [ ] Goalie and defender are assigned from players with the fewest appearances in that rationed position and do not repeat consecutively when satisfiable.
- [ ] No participating player sits for two consecutive rounds when satisfiable.
- [ ] Ties use the Game's deterministic rotation ordering, and the engine plans from what actually happened.
- [ ] The engine computes only the current suggestion; it does not store or show a whole-Game plan.

