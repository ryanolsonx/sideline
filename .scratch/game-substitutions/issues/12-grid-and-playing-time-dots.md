# The player×round grid and the playing-time dots

Type: prototype
Blocked by: 06
Status: resolved

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

## Prototype

Three variants live at `apps/web/src/prototypes/grid-and-dots/`, run with `pnpm dev:web` and
opened at `?prototype=grid-and-dots&variant=A|B|C`. The list screen underneath is the settled
one and does not vary; only the trailing end of a roster row and the space below it do. The
seeded game is round 6 on the field, nine on the roster, Ivy a no-show, mid-round changes in
rounds 2, 5 and 6, because a near-empty grid cannot answer whether a full one fits.

- **A — Grid only, no dots.** Rows keep tag, name and count; one grid below carries every
  question about who played when, marking a mid-round arrival `↑` and a departure `↓`.
- **B — The row is the grid row.** No grid below at all: each row extends into its own
  eight-cell strip, the whole roster on one screen, absent players in a **Not here** group.
- **C — Owed, not history.** A running balance against an even share instead of a count, and a
  grid led by an `owed` column with no mid-round mark.

## Answer

**The dots do not survive.** The coach chose A outright. A row carries its position tag, the
name and the rounds-played count, and nothing else; every question about who played when is
answered by one grid below. The dots were the same row of marks the grid already draws three
inches away, and the redundancy that ticket 11 flagged is resolved by deleting the smaller of
the two rather than the larger.

**The grid does owe the coach a mark.** A cell that says only the position cannot distinguish a
round a player started from one they were thrown into halfway through, and both are credited
identically under ADR 0005. So a cell carries the position plus, where it applies, `↑` for came
on mid-round and `↓` for came off. Both marks survive rather than only the `↑` the ticket asked
about, because a mid-round swap is one event across two rows and `↑` alone shows that somebody
arrived without showing who made room.

**The count lives on the row and nowhere else.** The grid's `▲` total column is gone. The count
is the rounds credited so far — a raw integer, not a share and not a balance, the live round
included the moment it goes onto the field — and it belongs next to the name the coach is about
to tap, because that is the number they are weighing when they choose who goes on. That the
column was the only place the counts appeared in one sorted stack was put and rejected; the
grid's owed-ordering carries that job.

**A balance is not the unit.** C offered `+1` / `even` / `−2` against an even share and lost on
two counts found by building it: it goes quiet exactly when the spread is small, so it says
nothing for most of a game where a raw count always says something, and it reads `−5` for a
child who never turned up, which a count cannot do. This confirms ADR 0005's raw-count decision
from the screen's side.

**The grid and the roster deliberately disagree about order.** The roster is grouped by position
and the grid is sorted by who is owed time, so a player sits in two places in two orders.
Different questions — *who is where* against *who is owed* — and the owed-ordering is the only
thing floating the emptiest row to where it gets noticed.

**Anyone not here sorts to the bottom, dimmed.** Owed-order otherwise puts a no-show first on
zero rounds, reading as most-owed when they are simply absent. The ranking is of the players who
can actually go on; the rest are a footnote to the record.

**The grid is always eight columns.** Rounds not yet played are empty rather than absent, so no
column moves under the coach's thumb between rounds, and the empty space says how much game is
left. The round being planned stays blank until Use Lineup, so the grid never disagrees with the
count beside the name.

**Below the fold is accepted, not fought.** Measured on the prototype, the grid starts 608px
down and runs 289px on a 944px screen, so on a small phone the heading is all that shows. The
alternatives were shrinking the 44px rows, which the mobile floor forbids, or collapsing the out
group, which ticket 11 put first on purpose. The grid is for a deliberate look when something is
being changed around, and a deliberate look can afford a scroll.

Settled by silence, in the terms recommended: the differing orders, both marks, the always-eight
columns, the blank planned round, and accepting the fold.

**Prototype:** branch `ro-grid-and-dots-prototype`, two commits — the three variants as judged,
then variant A with the decisions above folded in.
