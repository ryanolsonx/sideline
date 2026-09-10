# 04: Start a Game and confirm attendance

**What to build:** The coach starts a Game from the team screen, receives roster, formation, and rotation-seed snapshots, confirms who is present, and creates the initial attendance action.

**Blocked by:** 02: Create a team with its formation.

**Status:** ready-for-human

**Delivery:** Before implementation, propose the next Gherkin slice in conversation and obtain approval. Then implement this ticket as its own stack of the smallest independently green, reviewable PRs. Supporting technical PRs may precede the user-visible slice; every PR head must remain deployable, and the top PR must deliver all acceptance criteria.

- [ ] Starting a Game is the primary action when the team has no unfinished Game.
- [ ] Game creation snapshots the team's roster and formation and assigns a per-Game rotation seed.
- [ ] The new Game remains in Setup while the coach marks the participating players.
- [ ] Confirming attendance appends one action containing the complete present-player list rather than one action per checkbox.
- [ ] Ownership is enforced through the Game's team.
- [ ] The real Games module replaces the disposable `matches` example once this full-stack slice is complete.

