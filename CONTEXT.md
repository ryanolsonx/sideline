# Sideline

Sideline helps a youth soccer coach manage substitutions during a game from a phone at
the side of the field, keeping playing time fair across a roster.

## Language

### People and teams

**Coach**:
The person using the app. Identified by a username, with no password. Two usernames
name the same coach when they differ only in case or spacing. A coach cannot be
renamed: typing a different username is being a different coach.
_Avoid_: User, manager, account

**Team**:
A named roster of players belonging to one coach, with a format and a formation.

**Player**:
A child on a team's roster. First names only.

### Shape of play

**Format**:
How many players a side fields: 5v5 or 6v6. A consequence of the formation rather than a
separate choice, though the coach picks it first when setting a team up.

**Formation**:
How many players a team fields at each outfield position, such as two defenders and three
forwards. The goalie is not part of the count: there is always exactly one. Belongs to the
team, is editable there, and is copied onto a game when the game starts, so a game keeps
the shape it began with.
_Avoid_: Lineup, which is the specific players in a round rather than the shape
_Avoid_: Preset, which is how the screen offers the named formations rather than what one is

**Position**:
Goalie, defender, or forward. Goalie is a distinct kind rather than merely a position
with a tighter rule. Two players at the same position are at the same position: there is
no left defender as distinct from a right one.
_Avoid_: Role

**Goalie**:
The keeper. Generally played once per game by any given player.
_Avoid_: Keeper, goalkeeper, GK

### A game

**Game**:
One outing by one team, played as a sequence of rounds. It records us and who did what:
there is no opponent, no score, and no name. The unit a coach starts, works through, and
later looks back at.
_Avoid_: Match, fixture

**Round**:
A stretch of play with one lineup, advanced by the coach rather than by a clock. Every
game is eight rounds, though the referee may end it after the seventh.
_Avoid_: Period, shift, quarter

**Setup**:
A game that has been started but not begun: the coach is marking who turned up. No
rounds exist yet.

**Live**:
A game being played, somewhere in its rounds.

**Ended**:
A game that is over and counts. Reached by the coach, never by the app, and never
undone.

**Abandoned**:
A game that did not happen: called off by the referee, or started by mistake. It keeps
whatever rounds it reached and stays in the team's list, quieter than an ended game.
Nothing in Sideline is ever deleted, so this is what deleting a game means.
_Avoid_: Cancelled, deleted, discarded

**Lineup**:
Which player occupies which position for a round.

### Who is playing

**Participating**:
A player who is at the field and part of this game. The opposite is absent.

**Absent**:
A player on the roster who did not show up, or who left before the game ended. Absence
is not a turn to rest and is not owed back.

**In**:
Participating and on the field this round.

**Out**:
Participating but sitting this round. Being out is a turn taken, and the rotation owes
that player time back.
_Avoid_: Benched, resting, sitting
