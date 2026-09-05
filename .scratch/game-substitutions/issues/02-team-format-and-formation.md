# Team format and formation

Type: grilling
Status: open

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
