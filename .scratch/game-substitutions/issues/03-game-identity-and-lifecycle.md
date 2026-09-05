# Game identity and lifecycle

Type: grilling
Status: open

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
