# The player×round grid and the playing-time dots

Type: prototype
Blocked by: 06
Status: claimed

## Question

Two related views the coach asked for by name.

The **grid**: players down one axis, rounds across the other, each cell an abbreviated
position. For checking the shape of the game when things are being changed around.

The **dots**: per player, within a round, green dots for rounds played and red for
rounds out, so the coach can see at a glance who is owed time.

- Does a grid of eight rounds and ten players fit on a phone, and if not, what gives?
- How does a partially-played round render in a cell?
- Are the dots a count, a ratio, or a running balance?
- Do the two views want to be one view?

## Reshaped by [The live-game screen on a phone](11-live-game-screen-on-a-phone.md)

The grid is no longer a separate view reached from the live screen: it lives permanently in the
space the roster leaves, ordered by who is owed time. Two questions arrive with it.

- Each roster row's dots now repeat that player's grid row exactly, three inches apart. The count
  in cyan still earns its place next to the name being tapped. Do the dots survive?
- A cell shows one position, so a round where a player came on mid-round is indistinguishable
  from one they started. Both are credited, per ADR 0005. Does the grid owe the coach a mark for
  that, or is the record the only place it shows?
