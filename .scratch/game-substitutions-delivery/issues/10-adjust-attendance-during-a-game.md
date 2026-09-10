# 10: Adjust attendance during a Game

**What to build:** The coach can confirm a new complete attendance list during planning or Live play, with the correct effective round and deterministic short-handed lineup behavior.

**Blocked by:** 08: Advance with a fair rotation.

**Status:** ready-for-human

**Delivery:** Before implementation, propose the next Gherkin slice in conversation and obtain approval. Then implement this ticket as its own stack of the smallest independently green, reviewable PRs. Supporting technical PRs may precede the user-visible slice; every PR head must remain deployable, and the top PR must deliver all acceptance criteria.

- [ ] Adjust players presents the snapshotted roster as freely selectable checkboxes and appends one complete attendance list on confirmation.
- [ ] Attendance confirmed while planning takes effect in the round being planned and regenerates its suggestion.
- [ ] Attendance confirmed during Live play normally takes effect in the next round.
- [ ] An arrival while the side is short may join the Live round immediately.
- [ ] A short-handed lineup fills goalie, then defenders, then forwards and plainly shows any unfilled slots.
- [ ] When short-handed constraints conflict, even rationing remains hard while the consecutive-round rule yields.

