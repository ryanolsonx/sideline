# The team screen

Type: prototype
Status: resolved

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

## Answer

The team screen has two deliberate states, chosen by whether a Game is already in
progress:

- **No unfinished Game:** use the **Game-first** layout (prototype A). `Start a game`
  is the loudest action; team setup is present but subordinate; completed and
  abandoned Games form a short history underneath.
- **An unfinished Game exists:** use the **Today-first** layout (prototype C). The
  in-progress Game is the unmistakable primary card and `Open sideline` is its one
  primary action. Starting another Game becomes secondary, with team setup reachable
  but quiet.

The separate team-switcher layout (prototype B) does not win the default surface.
It may inform a future multi-team picker, but must not dilute the coach's next action
on the team screen.

The three captured variants are preserved on branch `codex/prototype-team-screen`.
