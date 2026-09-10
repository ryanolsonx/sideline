# 11: Resume an unfinished Game

**What to build:** The team screen prominently offers the unfinished Game, and reopening or refreshing it reconstructs the exact current round, screen, attendance, lineups, and playing-time state from its action log.

**Blocked by:** 08: Advance with a fair rotation.

**Status:** ready-for-human

**Delivery:** Before implementation, propose the next Gherkin slice in conversation and obtain approval. Then implement this ticket as its own stack of the smallest independently green, reviewable PRs. Supporting technical PRs may precede the user-visible slice; every PR head must remain deployable, and the top PR must deliver all acceptance criteria.

- [ ] A team with an unfinished Game presents Open sideline or Resume Game more prominently than starting another Game.
- [ ] The application does not automatically redirect into an unfinished Game.
- [ ] Refreshing or reopening a Game restores the exact round and planning-or-Live screen.
- [ ] Attendance, starting lineups, Changes, and playing-time history are reconstructed from the snapshots and ordered actions.
- [ ] Another coach cannot discover or resume the Game.

