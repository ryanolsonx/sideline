# How comparable rotation apps model substitutions

Research for [How comparable rotation apps model this](../../.scratch/game-substitutions/issues/14-research-comparable-rotation-apps.md).

Sources are vendor documentation, App Store and Play Store listings written by the vendor, federation rule
PDFs, and coach-facing forum threads. Where the public record is silent, this document says so rather than
inferring; the gaps are themselves findings, because a category-wide documentation gap usually means the
vendors have not decided the question either.

## Summary

Eight things worth carrying into the map's decisions:

1. **Whole-game planning is the majority design**, and every serious product that plans ahead also
   recalculates the plan mid-game. Nobody ships a "plan one period, then plan the next" mode.
2. **The planning unit is usually an app-invented interval**, not the sport's period. "Rotation," "block,"
   "sub interval" — the app picks a cadence and the halves are just context.
3. **Nearly every product has a clock**, and the clock is what makes a substitution an event. A tap-driven
   app with no clock is a real but distinctly minority design.
4. **How partial time counts is undocumented across the entire category.** Not one vendor publishes a
   crediting rule. This is the single largest gap in the public record.
5. **Goalie is a first-class constraint wherever it is documented at all**, and the one app whose reviews
   complain loudest is the one that does not model it.
6. **Late arrival and early departure are modelled as player states**, not as roster edits, in every product
   that documents them — and they trigger recalculation of the remaining plan.
7. **Federation rules do not force period-boundary substitution.** US Youth Soccer says any stoppage. AYSO
   is the boundary-locked outlier, and its boundaries are what most paper charts assume.
8. **Federations impose no goalie rotation rule.** Every goalie cap found is a local league or region
   invention.

## 1. Whole game up front, or a period at a time?

The dedicated apps split cleanly into two camps, and the third option the ticket asks about — planning one
period at a time — does not appear in any product surveyed.

**Plan the whole game, then adapt.** SubTime plans "before the game or manage them as the action unfolds,"
and its Auto Plan "works mid-game, so you can rebuild the rotation after a late arrival or an injury"
(https://apps.apple.com/us/app/subtime-game-management/id1248650528). SubNow generates the plan once the
coach confirms who is playing, from sport, format, duration and breaks
(https://www.subnowapp.com/faq/). Substitution Cavalry: "Set your duration and substitution interval and
SubCav builds the whole block-by-block plan" (https://subcav.com/). Pitch Planner: "Choose a rotation plan
before kickoff" (https://pitch-planner.app/). Coach Meister generates a complete schedule from roster size
and interval (https://www.coachmeister.com/). Soccer Subs shows a "Sub Rotation Plan before game start"
(https://apps.apple.com/us/app/soccer-subs/id6758869521). Outside soccer, B-Ball Subs generates "a complete
rotation plan before the game starts"
(https://play.google.com/store/apps/details?id=com.tallday.basketballsubplanner) and The Hoops Geek's Equal
Playing Time Generator takes roster size plus game length and emits a chart for the whole game
(https://www.thehoopsgeek.com/equal-playing-time/).

**Live and reactive, with no pre-built schedule.** NextSub / SoccerTime Live: "Add your players, start the
match and let NextSub track playing time and suggest who should come on next"
(https://www.4dot6digital.com/soccer-subs-app). CoachAny has no pre-plan concept at all; it answers one
question, who has been on the bench longest (https://coachany.com/). SubAssist just alerts the coach when it
is time (https://www.subassist.co.nz/). At the far minimal end, Coach's Clock is a stopwatch over a virtual
field with no planning at all (https://apps.apple.com/us/app/coachs-clock/id455525937).

**The general platforms do neither.** TeamSnap's Lineups feature is pre-game assignment synced to RSVPs
(https://www.teamsnap.com/teams/features/lineups). GameChanger treats a substitution as a live scorekeeping
edit — tap the player, sub them out, "Add From Bench"
(https://help.gc.com/hc/en-us/articles/30714729500301-Manage-Lineups-and-Substitutions). Hudl, Sideline
Sports XPS and MOJO have no substitution or playing-time feature at all
(https://sidelinesports.com/sport/soccer/, https://apps.apple.com/us/app/mojo-sports/id1509108036).

**Reading for the map.** The absence of a period-at-a-time mode is the interesting part. Products either
commit to a whole-game shape or refuse to plan ahead entirely. But the plan-ahead products universally treat
the plan as provisional: every one of them advertises recalculation. A published plan that regenerates on
contact with reality is the settled industry answer, which bears directly on
[Plan the whole game, or one round at a time?](../../.scratch/game-substitutions/issues/05-plan-ahead-or-round-at-a-time.md)
and its question of whether a future round is a promise or a suggestion. The category says suggestion.

## 2. How a period or shift is represented, and whether a mid-period substitution is an event

Two conventions for the unit, and they are not the same idea:

- **The sport's own periods.** SubHero offers "Halves, Quarters, Periods, or Innings" (https://subhero.app/).
  FairSub, SubManager and Soccer Playing Time Tracker are period-configured
  (https://fairsub.app/, https://apps.apple.com/us/app/submanager-game-management/id6754280598,
  https://playingtimetracker.com/).
- **An app-invented interval independent of the periods.** SubNow calls it a "rotation"
  (https://www.subnowapp.com/faq/). SubCav calls it a "block" (https://subcav.com/). Pitch Planner offers
  6/8/10 minutes (https://pitch-planner.app/), Coach Meister 5/10/15 (https://www.coachmeister.com/), and
  Soccer Manager Pro a coach-set "sub interval"
  (https://apps.apple.com/us/app/soccer-manager-pro/id6793163724).

The second convention is more common among the products that actually plan a rotation. The formal period
matters to them mostly as a boundary the goalie rule hangs off.

**Is a mid-period substitution first-class?** Where documented, yes — and the marker of first-classness is
that it triggers recomputation of everything downstream. SubNow: an off-schedule sub means "SubNow will
recalculate the substitution plan for you" (https://www.subnowapp.com/faq/). Pitch Planner logs it as a
paired gesture against a running clock: "Tap the bench player, then the one coming off. The match clock keeps
running" (https://pitch-planner.app/). SubManager records "Automatic substitution timestamps" reviewable
after the game (https://apps.apple.com/us/app/submanager-game-management/id6754280598). The Hoops Geek logs
stints with start and end and makes the log editable after the fact: "If someone forgets to track a change,
you can quickly go back and fix it" (https://app.thehoopsgeek.com/features/substitution-manager).

The contrast case is baseball: CalledUp has no clock at all and accrues fairness only when a coach builds a
lineup, so a substitution is genuinely just the next lineup
(https://calledup.app/fair-playing-time-tracker). Hockey's individual trackers sit at the far opposite end,
detecting shift boundaries from accelerometer data and backdating "the exact second your shift ended"
(https://timeonice.app/).

**The clock is doing the work.** Almost every product that treats a substitution as an event has a running
clock, because the timestamp is what distinguishes an event from an edit. Sideline's premise — no clock, the
coach taps to advance — puts it closest to CalledUp's lineup-ledger model, and means the "moment" a
substitution happened has to be marked by something other than time. No surveyed product has solved this,
because no surveyed product has this constraint.

## 3. How equal playing time is defined and displayed, and whether partial periods count

**Display idioms, in rough order of how concrete the evidence is:**

- **A percentage target with a per-player bar.** Pitch Planner is the only product found with a fully
  documented fairness UI: "Pick a minimum: 40, 50, or 60%. Each player's bar turns green when they hit it,
  amber if they're short," plus a jersey icon that "pulses amber when a player is due to come off"
  (https://pitch-planner.app/).
- **Raw minutes, on-field and bench.** SubTime shows "each player's playing and bench time at a glance"
  (https://apps.apple.com/us/app/subtime-game-management/id1248650528). FairSub shows fractions such as
  "12/12" and "10/12" (https://fairsub.app/). SubNow is minutes-based
  (https://www.subnowapp.com/faq/).
- **A relative gauge rather than a number.** Who's On (basketball) colours players red when significantly
  above the team average and blue when below
  (https://apps.apple.com/us/app/whos-on-basketball/id842425065). The legacy Playing Time app shows "each
  player's time in relation to the others" (https://apps.apple.com/us/app/playing-time/id382745080).
- **No number at all, only an alert.** Substitution Manager gives "gentle alerts when someone's been on the
  bench too long" (https://apps.apple.com/us/app/substitution-manager/id6745534315). Soccer Manager Pro
  flashes a stint indicator at the coach's chosen interval
  (https://apps.apple.com/us/app/soccer-manager-pro/id6793163724). CoachAny reduces the whole question to a
  queue: who has been sitting longest goes in next (https://coachany.com/).
- **A structural guarantee instead of a metric.** SubCav enforces fairness by construction: "No player sits
  more than one block in a row while someone else stays on" (https://subcav.com/).
- **Season-long ledgers.** Pitch Time "tracks cumulative minutes across the season and automatically
  compensates players who got fewer minutes in past matches"
  (https://apps.apple.com/us/app/pitch-time-fair-lineups/id6758683417). CalledUp tracks total innings logged
  this season "so nobody quietly falls behind" (https://calledup.app/fair-playing-time-tracker). The
  Playing Time Calculator lets a coach mark a game Official to feed season averages
  (https://www.playingtimecalculator.com/).

**Do partial periods count, and how?** No vendor in this survey publishes a crediting rule. Not a rounding
rule, not a minimum-stint rule, not a statement of what happens to a stint cut short by a whistle. The apps
with clocks sidestep the question entirely — seconds are seconds, so partiality never becomes a modelling
decision. The apps without clocks (CalledUp) credit whole units and do not discuss it.

The one place a partial-credit rule *is* published is AYSO's rulebook, and it is deliberately blunt: an
injured player "may not return until the beginning of the next 'quarter'... **Only the player who is injured
is credited with a 'quarter' played regardless of actual time played**"
(https://dt5602vnjxv0c.cloudfront.net/portals/14715/docs/national-rules-regulations-2018-0616-marked.pdf,
Article I.C.2.a). A partial quarter counts as a full quarter, for the injured player only. That is a real
answer to
[What counts as playing time](../../.scratch/game-substitutions/issues/06-what-counts-as-playing-time.md),
from a body that has had to defend it to parents for decades, and it is the only such answer found anywhere.

**Reading for the map.** Sideline has no clock, so it is in the category's blind spot: it must publish a
crediting rule that no competitor has had to write down. AYSO's rule and Substitution Manager's three-way
goalie credit setting (below) are the only prior art.

## 4. Goalie rotation as a distinct constraint

Where it is documented, goalie is genuinely distinct — not a position with a tighter rule but an axis of its
own. Where it is not documented, users complain.

- **Substitution Manager** has the most developed model found. A coach chooses how keeper time counts toward
  fair play: **full credit, half credit (shared keepers), or fully discounted**. Separately, a rotation
  policy: no keeper rotation (fixed keeper), or rotate keepers only at half time, with automatic half-time
  swap prompts (https://apps.apple.com/us/app/substitution-manager/id6745534315).
- **SubNow** "supports planned goalkeeper changes at half time and unplanned changes at any time," defaulting
  to one goalkeeper per half (https://www.subnowapp.com/faq/).
- **NextSub** advertises "Smart Goalie Protections: Easily separate or shield goalkeepers from your general
  outfield rotation calculations" (https://apps.apple.com/us/app/soccer-time-soccer-subs-app/id6450653830).
- **Soccer Subs** has a "Designated goalkeeper with separate swap flow"
  (https://apps.apple.com/us/app/soccer-subs/id6758869521).
- **Soccer Manager Pro** simply lets you "Exclude the goalie from alerts"
  (https://apps.apple.com/us/app/soccer-manager-pro/id6793163724).
- **Playing Time: Easy Rotations** does not model goalie, and its App Store reviews say so directly: one
  coach's team "is not old enough to have a goalie position yet" and wants "goalie to be optional and toggle
  on/off"; another wants "ability to rotate Goalkeeper every substitution as an option, or at least more
  configuration for it" (https://apps.apple.com/us/app/playing-time-easy-rotations/id6465690976).
- Hockey is worse served. Hockey Lineup Manager's own comparison copy concedes that neither major hockey
  lineup app "explicitly focuses on dedicated goalie rotation features beyond basic lineup building"
  (https://hockeyapps.com/hockey-lineup-manager-app/). No hockey or lacrosse source states whether goalie
  time counts toward a fairness metric.

**Federations impose nothing.** The US Soccer Player Development Initiatives and the current US Youth Soccer
Policy on Players and Playing Rules (effective 2025-12-05) contain no goalkeeper playing-time or rotation
rule; keeper minutes count like any other minutes toward the 50% guidance
(https://www.usyouthsoccer.org/wp-content/uploads/sites/160/2023/09/Player-Development-Initiatives-2017.pdf,
https://www.usyouthsoccer.org/wp-content/uploads/sites/160/2025/12/Policy-on-Players-and-Playing-Rules-_APP-12.05.2025.pdf).
AYSO's national rules likewise have no keeper carve-out; the caps that exist are regional, e.g. AYSO Region
76's "a player may play in goal for at most 2 quarters in a single game" for 10U/12U
(https://www.ayso76.org/everyone-plays-guidelines). Every goalie constraint found in the wild is a local
invention, which means Sideline is free to pick one and should expect coaches to arrive with different
league rules in their heads.

## 5. Late arrivals and early departures

Every product that documents this models presence as a **player state**, not as adding or removing a roster
row, and treats a state change as a trigger to recompute the remainder.

- **SubNow** has an explicit three-state model — "Not Playing" / bench / field — with named workflows for a
  late arrival (move them from Not Playing to the bench) and a mid-game injury (field to bench, then bench to
  Not Playing) (https://www.subnowapp.com/faq/).
- **NextSub** markets an attendance switch and "Mid-Game Injury & Absence Locks" that "automatically
  redistribute remaining minutes away from unavailable players"
  (https://apps.apple.com/us/app/soccer-time-soccer-subs-app/id6450653830).
- **SubTime**'s own copy frames the scenario as the reason Auto Plan exists mid-game: "A player arrives late.
  Someone picks up an injury... Rework the squad, the rotation, and the record"
  (https://apps.apple.com/us/app/subtime-game-management/id1248650528).
- **Coach Meister** claims automatic rebalancing of remaining time for "a late arrival, an injury, or a
  player leaving early," with manual override preserved (https://www.coachmeister.com/).
- **Substitution Manager** offers a one-tap exclude "handy for injuries, knocks, or your own coaching calls"
  (https://apps.apple.com/us/app/substitution-manager/id6745534315).
- **Hockey Lineup Manager**'s cross-ice module surfaces four states on one screen — "On the Ice, Up Next, On
  the Bench, or Injured" — making unavailability a peer of the other three
  (https://apps.apple.com/us/app/hockey-lineup-manager/id6756636286).
- **Court Time** (basketball) handles the analogous case of foul trouble by recalculating: "If a player gets
  in foul trouble early, the Shadow Brain AI instantly recalculates the minutes for the rest of the team"
  (https://apps.apple.com/us/app/court-time/id6757116946).

**What nobody documents:** what happens to a departed player's accumulated balance. No source states whether
an early departure freezes that player's total out of the fairness computation or leaves them in it as a
permanently short player. This is exactly the question
[Presence changes mid-game](../../.scratch/game-substitutions/issues/09-presence-changes-mid-game.md) has to
settle, and the category offers no precedent.

## 6. What coaches found unusable

Direct, quotable evidence is thin — vendors do not publish complaints, and targeted Reddit and Hacker News
searches for coaches abandoning these tools returned nothing usable. What exists:

- **"Learning during the game is not the time to learn the app."** A review of the legacy Playing Time app,
  which has been shipping since 2010 and holds 4.5 stars across 112 reviews — so this is a complaint about a
  product people otherwise like (https://apps.apple.com/us/app/playing-time/id382745080). The same page
  carries "set up and initial configuration could use a wizard... rather than digging into settings."
- **Who's On (basketball)**: "Although this app looks very intuitive it is not. Very primitive features and
  no customizable features to support different game formats," alongside a data-loss report: "I entered my
  teams twice because they got deleted the first time. None of them show up to choose the kids"
  (https://apps.apple.com/us/app/whos-on-basketball/id842425065).
- **Playing Time: Easy Rotations**: the goalie complaints above, plus a coach stating "the random lineups
  doesnt meet my needs" for want of fixed positions
  (https://apps.apple.com/us/app/playing-time-easy-rotations/id6465690976).
- **SubTime's founders** describe the category they entered as tools that "were not intuitive enough to be
  able to use it during a live game" (https://www.subtimeapp.com/about-us).
- **The strongest signal is a negative one.** BigSoccer's own
  [Equal Playing Time thread](https://www.bigsoccer.com/threads/equal-playing-time.484372/) is experienced
  coaches discussing fairness as a policy and judgement problem, and **no app, spreadsheet, or tool is
  mentioned anywhere in it**. The
  [U10 sub pattern thread](https://www.bigsoccer.com/threads/u10-sub-pattern.1807507/) has coaches using
  manual spreadsheets and printed sheets, and arguing that 5-minute shifts are too short — "5 minutes is not
  nearly long enough to develop a rhythm... encourages mindless running" — favouring 10. Coaches who have
  thought hardest about this problem are not using these products.

## 7. What the rules and the paper charts actually assume

Worth recording because it constrains what a coach expects the app to let them do.

**Substitution is not structurally locked to period boundaries — except under AYSO.**

- US Soccer PDI (2017): 4v4 substitutions are "unlimited and can occur at any time"; 7v7 and 9v9 "unlimited
  and can occur at any stoppage"
  (https://www.usyouthsoccer.org/wp-content/uploads/sites/160/2023/09/Player-Development-Initiatives-2017.pdf).
- US Youth Soccer national policy, Rule 302 (effective 2025-12-05): "Substitutions shall be unlimited...
  Substitutions may be made, with the consent of the referee, at any stoppage in play"
  (https://www.usyouthsoccer.org/wp-content/uploads/sites/160/2025/12/Policy-on-Players-and-Playing-Rules-_APP-12.05.2025.pdf).
- The FA uses rolling substitutions at 7v7
  (https://learn.englandfootball.com/articles-and-resources/coaching/resources/2025/How-to-play-and-manage-7v7-games).
- **AYSO is the outlier and it is deliberate.** Matches are two halves at every division, but Article I.C.1.a
  says "Approximately midway through each half the referee shall permit substitution" — exactly four windows
  per match. AYSO then calls each window-unit a "quarter" for bookkeeping even though the match has no
  quarters
  (https://dt5602vnjxv0c.cloudfront.net/portals/14715/docs/national-rules-regulations-2018-0616-marked.pdf).

**Structure by age**: 4v4 at U6–U8 is four quarters; 7v7 at U9–U10 and 9v9 at U11–U12 are two halves. The
quarters-to-halves line falls at U10 (both sources above). Many local associations layer a four-quarter
structure over formats US Soccer defines as halves.

**The playing-time floor**: "Every player should play a minimum of 50% of the time in each game," which the
PDI deck itself labels best practice rather than a mandated Law. US Youth Soccer's policy then makes it
definitional — a "recreational league" is one whose "rules require that each player must play at least
one-half of each game except for reasons of injury, illness, or discipline" (Rule 101 §3(16)). AYSO's is a
hard rule: "all eligible team members in attendance at AYSO matches must play at least half of the match,
excluding overtime," recorded on referee-signed lineup cards.

**Paper charts assume boundaries regardless of what the rules permit.** The i9 Sports rotation sheet has rows
= players and columns = each quarter split in two (Q1-A/B through Q4-A/B, eight columns), with the coach
writing a sequential number into each cell
(https://api.mobilecoach.org/static/asset/pdf/146_fddea42f-bd16-4eaa-94f1-b678f838729f_default.pdf). Its own
instruction hedges the fairness promise to the season: "Although some players may play more quarters in a
particular game, playing time over the season should be as close to equal as possible." Eight boundary-locked
slots is precisely Sideline's eight-round game — the paper artefact coaches already use has the same shape.

## Open questions the public record does not answer

Recorded so the map does not go looking twice:

- **No published crediting rule for partial time**, anywhere, from any vendor. AYSO's "credited with a
  quarter regardless of actual time played" is the only rule of its kind found, and it applies only to
  injury.
- **No published account of what happens to an early-departing player's accumulated balance** in any
  fairness computation.
- **No published rotation algorithm or data model.** The one first-person developer writeup found is about
  build speed with AI tooling, not the algorithm
  (https://medium.com/@trentallday/substimy-experience-building-the-basketball-substitution-manager-with-ai-e2989b68273e).
  No open-source rotation planner README, no Show HN, no schema.
- **No hockey or lacrosse source states whether goalie time counts toward fairness**, despite goalie being
  structurally central in both.
- **No indexed forum or Reddit account of a coach abandoning one of these apps mid-season.** Absence of
  evidence, not evidence of absence — it may live in Facebook coaching groups that search does not reach.
