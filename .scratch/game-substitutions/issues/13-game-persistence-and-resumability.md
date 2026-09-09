# Game persistence and resumability

Type: grilling
Blocked by: 04, 05, 09, 17
Status: resolved

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

## Reshaped by ADR 0009

[Editing a round that already happened](10-editing-a-round-that-already-happened.md) made a game
an append-only log, which answers some of the above and redirects the rest. What is written is an
action per coach tap, so a swap made and not yet played survives a refresh because it was written
when it happened. An ended game is immutable by decision. The entity and transaction questions now
hang on [The action catalogue and the fold](17-action-catalogue-and-the-fold.md) and should be
asked after it. What remains genuinely open here: how the app finds the in-progress game on load,
and what the coach sees while it is being found.

## Answer

Tapping **Start game** creates a Game immediately, before the attendance screen. The Game
stores its UUID, Team, start time, formation snapshot, rotation seed, and roster snapshot.
The coach checks the players who are there without persisting checkbox toggles, then taps
Start; that appends one **Mark attendance** action carrying the whole present-player list.
Every subsequent coach gesture appends one ordered GameAction attached to the Game UUID.

The Team page is the re-entry point validated by the prototype: a Team with an unfinished
Game shows **Resume game** as its call to action; a Team without one shows **Start game**.
There is no automatic redirect. Resuming loads the Game's ordered actions and projects the
same Setup, plan, or live state the coach left, including a confirmed but unplayed plan.

The Game row holds only its immutable creation snapshots. `GameAction` rows hold the Game
UUID, immutable append order, kind, and payload; no lineup, attendance, count, or other
projection is saved. Starting a Game is one transaction; every permitted subsequent action
is validated against the current projection and appended in its own transaction. Ended Games
are immutable. Recorded as
[ADR 0011](../../../docs/adr/0011-a-game-starts-with-a-roster-snapshot-and-batch-attendance.md),
which amends attendance's per-player-mark shape.
