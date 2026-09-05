# Game persistence and resumability

Type: grilling
Blocked by: 04, 05, 09
Status: open

## Question

Refreshing the browser mid-game must land the coach back in the round they were in.
State lives in Postgres, not the browser.

- What is written, and when? Every tap, or at round boundaries?
- What exactly is restored: the round, the plan, unplayed swaps in progress?
- A swap made but not yet played: does it survive a refresh?
- How does the app find the in-progress game on load?
- What does a past game retain, and is the record immutable once ended?
- What does this imply for entities, migrations, and transaction boundaries under
  `ARCHITECTURE.md`?
