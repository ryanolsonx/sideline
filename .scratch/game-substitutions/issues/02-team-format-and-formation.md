# Team format and formation

Type: grilling
Status: resolved

## Question

A team is 5v5 or 6v6, chosen at creation, with a formation under it. 6v6 is fixed at
1 goalie / 2 defenders / 3 forwards. 5v5 offers two: 1/2/2 or 1/1/3. A coach can edit
the formation later, and future games use the new one.

- How is format and formation stored: an enum per preset, or counts per position?
  Counts buy 7v7 and midfielders later for nearly nothing, but only if the positions
  themselves generalize.
- Where does this land in the existing first-team-setup flow, which currently asks
  only for a name and a roster?
- Editing a team's formation: any guard when a game is in progress?
- What does the snapshot onto a game physically look like?

## Answer

**A formation is a count per outfield position, and nothing else.** A team carries
`{defender: n, forward: n}` as a JSON column. The goalie is structural rather than
counted: there is always exactly one, so a formation without a goalie cannot be
represented at all. Format is derived as the sum plus one and is stored nowhere, which
means 5v5 and 6v6 differ only in their counts and a team moving up an age group is an
ordinary edit rather than a distinct operation.

Numbered slots were rejected: two defenders are the same position, and under `D1`/`D2`
a player moving between them would satisfy the no-repeat-position rule while obviously
breaking it. Enum presets were rejected: midfielders and 7v7 are visible in the fog, and
counts absorb both without a migration. The named formations survive as buttons on the
screen that write counts; `preset` is not a word the model knows. Recorded as
[ADR 0002](../../../docs/adr/0002-a-formation-is-outfield-counts.md).

**Setup grows a third step, after the roster.** `FirstTeamScreen` becomes name → roster
→ shape: "How many on the field?", then the formation, with 6v6's single option shown
rather than asked. It is required, never defaulted, because a wrong default silently
mis-shapes every game the team ever plays.

**Roster and formation are both edited from the team screen** — the one where a coach
picks a team, taps Start Game, and looks back at previous games. What that screen looks
like is not settled here.

**The game snapshots the same JSON into its own column at Start.** One TypeScript type
and one validator (every count at least one, sum plus one within the legal range) serve
the team and the game alike. Editing a team's formation while a game is live needs no
guard, warning, or confirmation: the snapshot already is the guard, and a warning would
ask a one-handed sideline coach to worry about something the model has handled. Changing
the formation of a game already underway is a capability we may want later; it does not
exist now.
