# The team screen

Type: prototype
Status: open

## Question

The screen a coach lands on when the app opens, and the hub everything else hangs off.
It is now specifiable because [Team format and formation](02-team-format-and-formation.md)
and [Game identity and lifecycle](03-game-identity-and-lifecycle.md) settled what it has
to carry:

- Picking a team, when a coach has more than one.
- Start Game, which must be one tap on a sideline.
- The list of games: unfinished ones at the top, ended ones by date, abandoned ones
  present but visually quieter.
- The way into editing the roster and the formation.

Build it rough and hold it at arm's length. The questions pixels answer better than a
conversation:

- Does one screen hold all of that on a phone, or does picking a team want to be its own
  step ahead of it?
- Is Start Game the loudest thing on the screen, and what happens to it when an
  unfinished game already exists?
- How far down the list does a coach ever scroll, and does a game need anything on its
  row beyond a date and a state?
- Where do roster and formation editing live so they are reachable but never in the way
  of the one tap that matters?
