# 12: Undo the previous action

**What to build:** The coach gets one recovery tap that neutralizes the immediately preceding action, then disappears, with no Redo or history tree.

**Blocked by:** 06: Adjust a planned lineup; 07: Change a Live lineup; 10: Adjust attendance during a Game.

**Status:** ready-for-human

**Delivery:** Before implementation, propose the next Gherkin slice in conversation and obtain approval. Then implement this ticket as its own stack of the smallest independently green, reviewable PRs. Supporting technical PRs may precede the user-visible slice; every PR head must remain deployable, and the top PR must deliver all acceptance criteria.

- [ ] Undo is available for the immediately preceding coach action and neutralizes that action through the canonical projection.
- [ ] Undo itself is appended to the ordered Game log without deleting or rewriting prior rows.
- [ ] After Undo, the recovery affordance disappears until another eligible coach action occurs.
- [ ] There is no Redo, action tree, or exposed raw-action history.
- [ ] Undo is unavailable after End Game.

