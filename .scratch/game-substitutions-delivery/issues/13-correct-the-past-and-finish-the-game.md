# 13: Correct the past and finish the Game

**What to build:** The coach can revisit a prior round, make a correction that causes later invalid gameplay to be omitted, return forward through freshly planned rounds, and finally End or Abandon the Game. The team screen then presents unfinished, ended, and abandoned Games appropriately.

**Blocked by:** 09: Show playing-time history; 11: Resume an unfinished Game; 12: Undo the previous action.

**Status:** ready-for-human

**Delivery:** Before implementation, propose the next Gherkin slice in conversation and obtain approval. Then implement this ticket as its own stack of the smallest independently green, reviewable PRs. Supporting technical PRs may precede the user-visible slice; every PR head must remain deployable, and the top PR must deliver all acceptance criteria.

- [ ] The coach can navigate back as far as round one's planning screen without navigation itself changing the record.
- [ ] The first action taken against a past round makes the projection omit later gameplay that no longer follows while retaining the raw action rows.
- [ ] Attendance remains effective across the correction, and later rounds are planned again one at a time.
- [ ] End Game is offered at round seven and replaces the forward action at round eight; ending makes the Game read-only and counted.
- [ ] Abandoning keeps the Game record but marks it as not counted.
- [ ] The team screen lists unfinished Games first, ended Games by date, and abandoned Games more quietly.
