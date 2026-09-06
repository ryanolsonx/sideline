# The live-game screen on a phone

Type: prototype
Blocked by: 04, 05
Status: open

## Question

The screen a coach actually looks at with a game going on in front of them. It has to
carry: the goalie, the defenders, the forwards, who is sitting out, the gesture that
plays the round, the gesture that advances, swaps, going back, and the escape hatch
into the grid.

Build it rough and hold it at arm's length. The questions pixels answer better than a
conversation:

- Does the plan/play distinction read at a glance, or does it need explaining?
- Is a swap one tap, two taps, or a drag?
- What is above the fold on a phone, and what is not?
- How does an in-round substitution look different from a planned lineup change?

## Added by [Presence changes mid-game](09-presence-changes-mid-game.md)

The screen must also carry an **Adjust players** control opening the roster as checkboxes, the
same affordance Setup uses for who turned up. Where it sits, and how it reads on a phone
mid-game, is this ticket's to settle; what a mark does is already decided.

## Added by ADR 0009

The live-game screen now carries **undo** and **redo**, small and permanent in the bottom-left
corner, live for the whole game. The prototype should show what they look like next to the lineup
and what the coach sees immediately after a branch, when several rounds have just disappeared with
no confirmation.
