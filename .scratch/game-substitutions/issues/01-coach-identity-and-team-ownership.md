# Coach identity and team ownership

Type: grilling
Status: open

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
