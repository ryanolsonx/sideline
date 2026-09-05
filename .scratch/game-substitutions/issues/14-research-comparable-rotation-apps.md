# How comparable rotation apps model this

Type: research
Status: resolved

## Question

Youth-sports substitution and playing-time apps have solved parts of this before.
Gather how they model it, so the decisions in this map are made knowing what others
found necessary.

Look for, with sources:

- Whether they plan a whole game up front or a period at a time.
- How they represent a period or shift, and whether a substitution mid-period is a
  first-class event or a lineup edit.
- How they define and display equal playing time, and whether partial periods count.
- How goalie rotation is handled as a distinct constraint.
- How late arrivals and early departures are handled.
- Any published account of what coaches found unusable.

Findings go in a Markdown file in the repo, linked from this ticket.

## Answer

Findings: [How comparable rotation apps model substitutions](../../../docs/research/comparable-rotation-apps.md).

Most dedicated apps plan the whole game up front and then recalculate it whenever reality
diverges — a late arrival, an injury, an off-schedule swap. Nobody ships a period-at-a-time
mode; products either commit to a whole-game shape or refuse to plan ahead at all. The
planning unit is usually an app-invented interval ("rotation", "block", "sub interval")
rather than the sport's own period, and the formal half or quarter survives mainly as the
boundary the goalie rule hangs off. Almost every product runs a clock, and the clock is what
makes a substitution a first-class event: a timestamp is the thing that distinguishes an
event from a lineup edit. The two clockless products found, CalledUp in baseball and the
paper rotation charts coaches actually use, both fall back to a lineup-per-slot ledger with
no substitution event at all. Sideline's no-clock premise puts it in that second camp while
wanting the first camp's fairness arithmetic, which is a combination nothing surveyed has.

Fairness display splits four ways: a percentage target with a per-player bar (only Pitch
Planner documents one fully), raw minutes on-field and on-bench, a relative gauge showing
each player against the team average, or no number at all — just an alert when someone has
sat too long, which is where the simplest products land. Several products now carry fairness
across a season rather than a game. The category's largest gap is exactly the map's open
question: **no vendor anywhere publishes a crediting rule for partial time**. Clock-based apps
never have to decide, and the clockless ones credit whole units silently. The only published
rule of that kind found is AYSO's, and it is blunt — an injured player is "credited with a
'quarter' played regardless of actual time played."

Goalie is a genuinely distinct constraint wherever it is modelled, and the one app whose
reviews complain loudest is the one that does not model it. Substitution Manager has the most
developed treatment: the coach chooses whether keeper time counts at full credit, half credit,
or is discounted entirely, and separately whether the keeper is fixed or rotates only at half
time. No federation imposes any goalie rule at all — every cap found is a local league or
region invention, so coaches will arrive with different rules in their heads. Late arrivals and
early departures are modelled as player states rather than roster edits in every product that
documents them, usually a three-state field/bench/not-playing model, and a state change
triggers redistribution of the remaining time. What nobody documents is what happens to a
departed player's already-accumulated balance.

On unusability, the sharpest quotable line is a review of a well-liked app: "Learning during
the game is not the time to learn the app." Other complaints cluster on missing goalie
support, missing fixed positions, and data loss. The strongest signal is a negative one:
BigSoccer's own equal-playing-time thread is experienced coaches arguing the problem as policy
and judgement with no app mentioned anywhere, and its U10 substitution thread has coaches using
spreadsheets and printed sheets while arguing five-minute shifts are too short to develop a
rhythm. The i9 Sports paper rotation sheet those coaches replace is rows of players against
eight boundary-locked half-quarter columns — the same shape as Sideline's eight-round game.
