# 09: Show playing-time history

**What to build:** The sideline screen shows per-player rounds-played counts and the eight-round grid, including played, Out, absent, position, came-on, and came-off marks.

**Blocked by:** 07: Change a Live lineup; 08: Advance with a fair rotation.

**Status:** ready-for-human

**Delivery:** Before implementation, propose the next Gherkin slice in conversation and obtain approval. Then implement this ticket as its own stack of the smallest independently green, reviewable PRs. Supporting technical PRs may precede the user-visible slice; every PR head must remain deployable, and the top PR must deliver all acceptance criteria.

- [ ] Each roster row shows the player's position, name, and rounds-played count without duplicate dot history.
- [ ] The permanent grid shows eight round columns and distinguishes played, Out, and absent.
- [ ] Played cells show position and retain came-on and came-off marks where applicable.
- [ ] The grid orders participating players by who is owed playing time and dims absent players at the bottom.
- [ ] A planned round remains blank in the grid until the coach chooses Use Lineup.

