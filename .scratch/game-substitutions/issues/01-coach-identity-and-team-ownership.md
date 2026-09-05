# Coach identity and team ownership

Type: grilling
Status: resolved

## Question

Login is a username and nothing else, and typing an unknown name creates the coach.

Settled during charting: **the username is the identity**. A team references
`coachUsername`, not a surrogate `coachId`. Do not reopen this without a reason that
surfaced after charting.

What is still open:

- Is Coach an entity at all, or does the username exist only as a column on Team?
- What makes two usernames the same: case, whitespace, punctuation?
- Can a username be changed, and if so, what happens to the teams that name it?
- How does a coach switch, and where is the current username shown?
- Does the app remember you between visits, and by what mechanism?
- The local data is throwaway, so the column can be non-null with no backfill. What
  happens to a team whose coach never returns?
- Is every query scoped to the current coach, or does the app simply not offer a way
  to see another's data?

## Answer

**Coach is not persisted.** There is no `coach` table. `team.coach_username` is a
non-null, indexed text column, and "the coaches that exist" is the distinct set of
usernames on teams. A row would earn its place only if something hung off it, and
nothing does: no password, no profile, no settings. "Typing an unknown name creates
the coach" cannot be a validation gate, because unknown names are exactly what is
allowed, so creation is a no-op: typing the name *is* being that coach. A coach with
no teams needs no row. Adding a table under an existing text column later is a pure
addition, which is what makes this cheap to reverse.

**Two usernames are the same when they match after trimming, collapsing internal
whitespace, and lowercasing.** The normalized form is what gets stored and displayed;
`Ryan` and `ryan` are one coach, shown as `ryan`. No punctuation rules: whatever is
typed is a legal name. Storing the typed form alongside the normalized one would need
the table just declined, and would buy only a capitalized greeting. This extends the
`normalizeName` already in `team.model.ts` with a lowercase step.

**A username cannot be changed.** No rename exists. Typing a different name is not
renaming yourself, it is being a different coach, which is what "the username is the
identity" means. A coach who wants a different name makes new teams under it.

**The coach travels in a cookie, which is also what remembers them between visits.**
One value in one place, replacing any `localStorage` copy; two copies means one can go
stale and "who am I" gets two answers. The cookie is **not** `httpOnly`, so the web
app reads the name straight out of it to render the avatar with no round trip and no
`me`-shaped query. Nothing is protected: the entire content is a name the coach typed.
**The browser writes it** on the username screen; there is no `signIn` mutation,
because with no coach table it could not validate, create, or fail.

The case against the cookie was put and lost: it is ambient, so a resolver's inputs no
longer say what scopes them, the schema stops documenting that teams are per-coach, and
every test layer must arrange a browser-ish thing to say "you are ryan". It wins anyway
because an explicit argument does not remove the need to remember the coach between
visits, so that route carries two mechanisms where the cookie carries one. The
infrastructure cost is small: `main.ts` already pins CORS to an explicit origin, so it
is `credentials: true` there plus `credentials: 'include'` on the client, and
`localhost:5173` to `localhost:3000` is same-site, so `SameSite=Lax` suffices.

**A request with no cookie is rejected by the API and never reaches it from the web.**
A resolver needing a coach errors rather than defaulting or returning everyone's teams;
not as a security boundary, but because a silent default is how a team ends up owned by
the empty string. The front end does not rely on that rejection: it treats a missing
cookie as not signed in and routes to the username screen, so no protected screen ever
renders without one.

**Scoping is by filter, not by permission.** Every team query filters on the coach in
the cookie. The UI offers no way to see another coach's data, and nothing stops someone
typing another coach's name; that is accepted, since privacy is already out of scope. A
team whose coach never returns is left alone: no cleanup, no expiry, no orphan handling.

**The avatar is the coach's presence in the UI.** A circle with the first letter of the
username, top-right on the team list and team detail screens. Tapping it opens a small
menu showing the full username and **Sign out**, which clears the cookie and returns to
the username screen. It is hidden for the **whole in-game flow**, from Start Game
through End Game rather than only the live-round screen, because that flow is the
contested-attention space and a stray tap there is a sign-out nobody wanted. It returns
when the game ends. The wording is **Sign out**, chosen by the coach over the more
literal "Switch coach".

The openness this creates is deliberate and is recorded as
[ADR 0001: Identity is a username and nothing else](../../docs/adr/0001-identity-is-a-username-and-nothing-else.md):
anyone who knows a coach's username can be that coach, which is the delegation feature
rather than a gap, since a coach who cannot make a game hands their spouse the URL and
their username and the game runs under the right record.
