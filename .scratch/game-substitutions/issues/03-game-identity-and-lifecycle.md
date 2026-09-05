# Game identity and lifecycle

Type: grilling
Status: resolved

## Question

The arc is: pick a team, Start Game, mark who is present, Begin, play rounds, End Game,
and later find the game again in a list.

- What identifies a game: date and time, plus what else? An optional opponent?
- Start Game should be one tap on a sideline. What, if anything, is required?
- What states does a game move through, and what is legal in each?
- End Game: available at any round, or only after the last one? Can a coach end at
  round 7 because the ref said so, and does the app treat that differently from
  finishing all eight?
- Can a team have two games in progress at once? Can a coach?
- Where does the round count come from, given it is usually eight but not always?
- The `matches` module is example scaffolding. Rename, absorb, or delete?

## Answer

**A game is us and who did what.** It carries a uuid, the team it belongs to, and when
it started. There is no opponent, no name, and no score: nothing in scope reads them,
and a nullable free-text opponent would be a field that grows a meaning by accident.
Games are found again through the team they belong to, listed by date.

**Eight rounds, as a constant rather than a column.** Every game is eight rounds. There
is no round 9 and no per-game round count, because a number a coach can change is a
number the fairness arithmetic has to defend against, and no game has ever wanted a
different one. A game that stops at seven and a game that finishes eight leave identical
records: no `endedEarly` flag, nothing that compensates for the rounds that never
happened.

**Four states: Setup, Live, Ended, Abandoned.** Start Game creates the game in Setup,
snapshots the team's formation, and marks every roster player participating, so the
coach unticks the no-shows rather than ticking the arrivals. Begin moves it to Live and
opens round 1. End Game moves it to Ended.

Two terminal states, and they say different things. **Ended** means this game is over
and counts. **Abandoned** means this game did not happen. Neither is a delete: nothing
in this app is ever deleted, an abandoned game keeps whatever rounds it reached, and it
appears in the team's list marked as abandoned and visually quieter, because a coach
looking for last Saturday should find what became of last Saturday. Recorded as
[ADR 0003](../../../docs/adr/0003-nothing-is-ever-deleted.md).

**End Game is hidden until round 7**, which makes ending at round 2 with a fat thumb
impossible. At round 8 it replaces the forward action in the same thumb position, so
finishing is one tap and nothing auto-ends behind the coach. The ref abandoning at round
4 for weather or an injury is Abandon, available throughout Setup and Live, off the main
round screen and behind a confirm. Wrong team, wrong tap, never begun: also Abandon.

**Concurrency is unrestricted.** Any number of unfinished games, and two tabs on two
games at once is a supported thing rather than a tolerated one. Nothing auto-resumes and
nothing prompts to resume: the app opens on the team screen, whose game list is the way
back, with unfinished games at the top.

**The URL is the whole answer**: `/teams/:teamId/games/:gameId`, nested because a game
is only ever reached through its team. `apps/web` has no router at all today, so this
introduces one.

**Ownership is enforced in the API**, on every game query and mutation, against the
caller's `coachUsername`. The front end does not duplicate the check; it renders what it
gets. Three outcomes are deliberately distinguishable, and the UI says which: *game not
found* for an unknown game id, *invalid team* for an unknown team id, and *sorry, that's
not your game* when either belongs to someone else. Naming the third rather than
flattening it into a not-found is a departure from the usual reflex, and a deliberate
one: ADR 0001 already settled that this app has no secrets, so pretending otherwise
would cost a coach a comprehensible error to buy privacy the app does not offer.

**The `matches` module stays, untouched, on a countdown.** It is the only worked example
of the module layering across the full stack, so it earns its place until `games/` is
real enough to be that example itself, at which point it is deleted outright. `Game` is
written fresh in `games/` and borrows the shape without borrowing the code: the two share
no field. `CLAUDE.md` records what `matches/` is for and what ends it.
