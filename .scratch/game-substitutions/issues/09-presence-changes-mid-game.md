# Presence changes mid-game

Type: grilling
Blocked by: 04, 07
Status: resolved

## Question

The roster at Begin is not the roster at the whistle. Three cases, and they are not
the same case:

- A player **arrives late**. They join and normally start the next round, unless the
  side is short, in which case they go on now.
- A player **leaves early**, at halftime or otherwise. They stop being eligible; the
  rounds they already played still count.
- A player is **injured** during a live round and must come off immediately.

Settle: what states a player moves through during a game, whether absent-then-arrived
is distinguishable from present-all-along, and how each case reaches the rotation
engine. Minimum viable behavior when the side drops below a legal count: the app says
so plainly and lets the coach carry on, since a coach with four kids still needs the
app to work.

## Answer

A game carries an **attendance** log: an ordered list of marks, each a player, the round it
takes effect from, and whether they **arrived** or **left**. Participation at any round is the
fold of the log, and `History`'s three states are read from it. The word **change** was already
taken by a lineup change, so these are marks on attendance, never "presence changes".

Marking who turned up during Setup is the same log stamped ahead of round 1: everyone begins
absent and turning up is an arrival, so a child who never came and a child who left after round
6 are one kind of record read at different rounds. There is no `Injured` state and nothing
records *why* a child stopped being there; arriving late, leaving early and going off injured
are three moments to use one gesture. That gesture is an **Adjust players** button opening the
roster as checkboxes — the same control at Setup and mid-game.

**When a mark takes effect follows the screen**, extending ADR 0004's rule to a second kind of
move. On the plan screen it counts for the round being planned and the child is in that
lineup. On the live screen it counts from the next round, in both directions: a child who has
gone home stays in the round's record until the coach taps Subs. A departure therefore never
leaves a mid-round hole, which removes the auto-fill this ticket's discussion had assumed it
needed. The single exception is an **arrival while the side is short**, which the app puts on
the field immediately, into the emptiest slot in goalie → defenders → forwards order, recorded
as an ordinary change the coach can swap after.

**An attendance mark on the plan screen re-runs the engine for that round**, discarding swaps
already made to it. ADR 0007's "once per round" is a promise about navigation; a changed roster
is new input, like Reset. The cost — a coach loses a hand-arranged lineup when somebody turns
up — was accepted over splicing the newcomer in by a second rotation rule invented for the case.

**Attendance survives a walk-back.** ADR 0004 discards rounds; attendance is not one. A coach
fixing round 3 does not re-tick everyone who arrived at round 5.

**Short-handed**: everyone participating is on, slots fill goalie → defenders → forwards, and
leftover forward slots stand empty with the screen saying so. This is the formation underfilled,
not a formation derived from player count, which the map put out of scope. Where a small side
makes ADR 0006 impossible — three children at 6v6 field a keeper and two defenders every round,
so somebody must defend twice running — **never-two-rounds-running yields and fewest-held stays
hard**. The engine may never refuse to field a legal side.

Recorded as [ADR 0008](../../docs/adr/0008-attendance-is-marked-from-where-you-stand.md), which
amends ADR 0006's hard rules with that precedence.
