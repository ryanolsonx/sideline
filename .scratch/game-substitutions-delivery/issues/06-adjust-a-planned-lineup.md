# 06: Adjust a planned lineup

**What to build:** On the planning screen, the coach can swap two players with two taps, reset the suggestion, and use the adjusted lineup without recording an override.

**Blocked by:** 05: Play the first suggested round.

**Status:** ready-for-human

**Delivery:** Before implementation, propose the next Gherkin slice in conversation and obtain approval. Then implement this ticket as its own stack of the smallest independently green, reviewable PRs. Supporting technical PRs may precede the user-visible slice; every PR head must remain deployable, and the top PR must deliver all acceptance criteria.

- [ ] Tapping one player activates that player and tapping another swaps their places.
- [ ] A planned swap changes the lineup that will start the round without creating a separate coach-adjustment record.
- [ ] The coach may break every engine rule through a manual swap.
- [ ] Reset reruns the rotation engine for the current planned round.
- [ ] Revisiting a planned round does not silently recompute its suggestion.

