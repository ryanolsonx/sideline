# Identity is a username and nothing else

A coach signs in by typing a username, which is stored in a plainly readable cookie and
sent with every request; there is no password, no session, no token, and no coach table.
Anyone who knows a coach's username can be that coach: see their teams, start a game,
run the rotation. That is the intended behavior, not a gap left for later.

This is a deliberate deviation from what a production app would do, taken because
nothing in Sideline is private. The data is a roster of children's first names and a
record of who played which position in a youth soccer game. There is no attack worth
mounting: the worst an impostor can do is help.

The openness is closer to a feature than a defect. A coach who cannot make a game hands
their spouse the URL and their username, and the spouse runs the game as the coach, with
the rotation and the playing-time record landing in the right place. No invitation flow,
no shared-access model, no delegation feature. The absence of authentication *is* the
delegation feature, and building real auth would mean building all of that back.

## Consequences

- Scoping is a filter, never a permission. Queries narrow to the coach in the cookie
  because that is the useful view, not because anything is being withheld.
- The API still rejects a request with no cookie. That is not a security boundary; it
  stops a team from being silently owned by the empty string.
- The cookie is not `httpOnly`, so the web app reads the coach's name out of it directly.
  Marking it `httpOnly` would protect nothing and cost a round trip.
- This is reversible but not free. Adding real accounts later means a coach table, a
  credential of some kind, and a migration from usernames to stable ids. It is the sort
  of thing to decide before Sideline ever holds data anyone would mind losing or leaking.
