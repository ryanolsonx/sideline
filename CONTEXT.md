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
A named roster of players belonging to one coach, with a format and a formation. At most nine
players.

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
The keeper. A rationed position, so a player keeps once per game until everyone has, and never
two rounds running.
_Avoid_: Keeper, goalkeeper, GK

**Rationed position**:
A position nobody wants a second turn at: goalie and defender. It goes to whoever has held it
fewest times so far, and never to the same player two rounds running, so it is spread across
the roster rather than offered. It moves on through the roster each round rather than returning
to the same name, so the pool empties before anyone is asked a second time. Forward is not rationed — it is what is left once the rationed
positions are filled, and playing it repeatedly is tough luck. Which positions are rationed is
a fact about each position, not a consequence of how many of it a formation fields. A small
enough side can make the two halves of the rule contradict each other, and then the one about
consecutive rounds gives way: spreading the burden evenly outranks giving anyone a round off.
_Avoid_: Scarce position, which suggests the count rather than the burden

### A game

**Game**:
One outing by one team, played as a sequence of rounds. It records us and who did what:
there is no opponent, no score, and no name. The unit a coach starts, works through, and
later looks back at.
_Avoid_: Match, fixture

**Round**:
A stretch of play with one lineup, advanced by the coach rather than by a clock. Every
game is eight rounds, though the referee may end it after the seventh. A round is first
planned while play is stopped, then played. It keeps the lineup it began with and every
change made to it after that.
_Avoid_: Period, shift, quarter

**Planned**, **Live**, **Played**:
Where a round sits relative to the round the game is on: ahead of it, on it, or behind it.
Not something a round carries. A round the coach walked back past is planned again, with
everything it recorded still on it.

**Substitutions**, **Subs**:
The stop between two rounds, when the coach settles the next round's lineup, and the name of
the action that begins it: the coach taps Subs to say the live round is over and a new lineup
is needed. The round ahead is being planned; the round behind is still on the field.
_Avoid_: Break

**Setup**:
A game that has been started but not begun: the coach is marking who turned up. No
rounds exist yet.

**Live**:
A game being played, somewhere in its rounds. Also the round the game is on: the one
actually on the field. The two senses never collide in a sentence anyone says.

**Ended**:
A game that is over and counts. Reached by the coach, never by the app, and never
undone.

**Abandoned**:
A game that did not happen: called off by the referee, or started by mistake. It keeps
whatever rounds it reached and stays in the team's list, quieter than an ended game.
Nothing in Sideline is ever deleted, so this is what deleting a game means.
_Avoid_: Cancelled, deleted, discarded

**Starting lineup**:
Which player occupied which position when a round went onto the field. Settled at
substitutions, and never rewritten once the round is on the field.
_Avoid_: Lineup on its own, which no longer says which of the two is meant

**On-field lineup**:
Who is at each position right now: the starting lineup with the round's changes applied.
Worked out when asked rather than kept, so it can never disagree with the record.

**Change**:
One position, the player leaving it, and the player taking it, recorded once a round is on
the field. Either side may be empty: a player can come off with nobody replacing them. A
player moving between two on-field positions is two changes.

**Swap**:
Two players trading places: two on the field exchanging positions, or one on the field
exchanging with one who was out. The coach's gesture, and the only way a lineup is adjusted by
hand: tap a name to make it active, then tap a second name to trade the two. Identical on both
screens, though where it lands differs. **Change** is what gets recorded, and one swap may
record two of them.
_Avoid_: Substitution for this, which now names the stop between rounds

**Coach adjustment**:
A lineup the coach settled that differs from what the engine suggested. A description of a
situation, never a record: nothing stores or shows whether a lineup came from the engine or
from the coach. An adjustment may break every rule the engine plans by, which is the coach's
prerogative, and it is remembered as no preference — later rounds are planned from what
actually happened, which absorbs it.
_Avoid_: Override

### Who is playing

**Participating**:
A player who is at the field and part of this game. The opposite is absent.

**Absent**:
A player on the roster who did not show up, who has not arrived yet, or who left before the
game ended. Absence is not a turn to rest and is not owed back. Why a player is absent is never
recorded: an injury, a dentist appointment and a child who never came are the same fact.
_Avoid_: Injured, which the model does not know

**Attendance**:
Who was at the field, round by round. Kept as an ordered list of marks — a player, the round
the mark takes effect from, and whether they arrived or left — from which participation and
history are worked out. A player may arrive, leave and arrive again. Marking who turned up
before a game begins is the same list, so every player starts absent and turning up is an
arrival.
_Avoid_: Presence change, which collides with Change

**Arrived**, **Left**:
The two marks attendance is made of. The coach makes both with one gesture, tapping a name in
the roster; which one it is follows from whether the player was there already.

**Short-handed**:
Fewer players participating than the formation fields. The formation does not change: the
positions fill goalie first, then defenders, then forwards, and the slots left over stand
empty. A short-handed game is played, never refused.

**In**:
Participating and on the field this round.

**Out**:
Participating but sitting this round. Being out is a turn taken, but it is not itself
counted: what the rotation owes a player is read from their rounds played, not from a
tally of the rounds they sat.
_Avoid_: Benched, resting, sitting

### Fairness

**Rounds played**:
How many rounds a player was on the field for, and the only quantity fairness compares. A
player is credited with a round if they were on the field at any point in it, however
little of it, so both sides of a swap made during a round are credited with it. A
round in goal counts like any other. Counted from the moment a round goes onto the field,
never fractionally, and never across more than one game.

**Fair**:
Rounds played, as close to level across the roster as the game allows. Levelness is
compared between players directly rather than against a share of what each was there for,
so a player who covered while someone was away stands higher and is rested sooner, and a
player who arrives late is fresh rather than owed. A player who arrives late enough cannot
reach the others, and nothing makes that up to them. Fairness is a benefit being levelled,
which is the opposite of a rationed position, a burden being spread; the two are counted alike
and mean opposite things.

**History**:
What a player's game looks like round by round: for each round, played, out, or absent.
Three states, never two, because absence is not being out. What the coach reads; rounds
played is what the rotation compares.
