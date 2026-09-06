# The live-game screen on a phone

Type: prototype
Blocked by: 04, 05
Status: resolved

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

## Prototype

Three variants live at `apps/web/src/prototypes/live-game/`, run with `pnpm dev:web` and opened
at `?prototype=live-game&variant=A|B|C`. One fake in-progress game drives all three: round 3 on
the field with Cleo already on for Beau, Ivy a no-show, nine on the roster in a 1/2/3.

- **A — Pitch.** Positions laid out where the players stand; plan/live carried by the surface
  itself, dashed and grey while planning, green and solid on the field.
- **B — Roster list.** No spatial metaphor. One dense row per player, rounds played on every row,
  a round strip across the top and a state banner under it.
- **C — In / Out columns.** On the field beside Out, a swap being one tap in each column, with an
  explicit ledger of what has changed this round and a fairness list below it.

## Answer

**The screen is a list, not a pitch.** The coach chose B outright over the pitch layout and the
two-column ledger, calling it glanceable; the columns were rejected as too much for a phone. A
player is one row 44px tall carrying a position tag, the name, their rounds-played history as
dots, and their rounds-played count. Positions are group headings above their rows, and nothing
about the screen is spatial: a defender is not drawn next to the other defender, they are simply
the two rows under **Defenders**.

**Out comes first.** The out group sits above goalie, defenders and forwards, because who is
coming on next is what the coach is reaching for. This is the one ordering the coach corrected by
hand, and it inverts what every surveyed product does.

**The grid is not behind a tap.** Nine players cannot fill a phone screen, so the space the roster
leaves is the player×round grid — every round a column, the live one boxed and capped, players
ordered by who is owed time so the emptiest row is at the top. The escape hatch the ticket asked
for does not exist because there is nothing to escape to. The screen ends 848px down, so on a
short phone the grid is what goes below the fold; nothing breaks, but "the grid is always
visible" is not a promise the small screen can keep.

**The plan/live distinction is carried by a banner and a round strip**, not by the surface. A
list has nowhere to put a change of texture, so the state is said in words — a cyan bar reading
"Round 3 is on the field" against a dashed "Planning round 4" — with a strip of eight round pips
above it marking the live round solid and the planned round dashed. On the pitch variant the
whole surface changed and read at a glance; that is the one thing the list gives up, and saying
it plainly was judged enough.

**An in-round change reads as an amber row.** The player who came on is outlined amber and
labelled `on`; the player who came off has left the list, which is what a coach wants mid-game.
Seeing who *started* the round is the grid's job and the record's, not this screen's.

**44px is the floor.** Every tappable row is exactly 44px, including Adjust players, which was an
18px inline link until the mobile-sizing rule caught it. Row height is the tap target rather than
padding plus content, group headings are a hairline, and the strip and banner together cost about
60px. Eight rows is 352px of the budget and nothing below the roster may shrink further.

Settled by silence, in the terms recommended: a swap is tap-to-activate then tap-to-trade,
identical on both screens per ADR 0007; undo and redo stay small and quiet in the bottom-left
beside a full-width primary action; and **Adjust players** is a row at the foot of the out group,
carrying the not-here names as its own subtitle.

**Left to [The player×round grid and the playing-time dots](12-grid-and-playing-time-dots.md):**
with the grid inline, each roster row's dots repeat that player's grid row exactly. The count in
cyan still earns its place next to the name being tapped; whether the dots survive alongside a
permanent grid is that ticket's to settle, as is the fact that a cell shows one position and so
cannot show that a change happened in that round at all.

**Prototype:** three variants on branch `prototype/live-game-screen`, run with `pnpm dev:web` and
opened at `?prototype=live-game&variant=A|B|C`. B is the one that won, revised twice in the
session: out-first, then the grid inline.
