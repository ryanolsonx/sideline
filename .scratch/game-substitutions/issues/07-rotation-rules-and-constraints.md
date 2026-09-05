# Rotation rules and constraints

Type: grilling
Blocked by: 04, 06
Status: resolved

## Question

The rules as stated on the sideline, turned into something a machine can execute.

- Goalie is a special kind. Generally once per game per player; twice when the roster
  is thin. What decides "thin"? What happens when there are more rounds than players?
- Nobody plays the same position two rounds running, unless needed. What is "needed",
  and what gives way first when the constraints conflict?
- Equal playing time: minimize the spread of the fairness unit from
  [What counts as playing time](06-what-counts-as-playing-time.md), or something else?
- Rotate players through being out, so that the same kids do not always rest.
- 5v5 with one defender means forwards repeat constantly. Is that acceptable, or does
  the engine owe the coach something there?
- Which rules are hard constraints and which are preferences, and in what order do the
  preferences yield?
- Tie-breaking must be deterministic, or the tests cannot pin it and the coach cannot
  trust it. What breaks a tie?

## Answer

Recorded as [ADR 0006](../../../docs/adr/0006-goalie-and-defender-are-rationed.md).

**Goalie and defender are rationed; forward is the remainder.** Each is drawn from the
participating players who have held that position fewest times this game, and neither may be
held two rounds running. Forward carries no ration and no repeat penalty. The coach's
reasoning is the polarity of the whole thing: nobody wants goalie or defender twice, everyone
wants to score, so these are burdens being spread rather than opportunities being offered —
the opposite of playing time, which [ADR 0005](../../../docs/adr/0005-a-round-played-is-a-round-played.md)
treats as a benefit already received. Rationing is a named property per position, not derived
from slot count: in 1/2/2 defender and forward have two slots each and are still not alike.

**"Thin" is never defined, because nothing escalates.** The pool empties before it refills.
Five present gives five different goalies in rounds one to five with repeats from round six;
nine present gives eight goalies and no repeat. The no-two-in-a-row rule is not redundant with
the pool rule — the pool permits a repeat at the moment it refills, and that rule catches it.

**Rationing is a hard constraint, against the prior art's pricing.** The existing tool prices
repeat goalie at 45 and lets once-per-game emerge; that cannot express "exhaust the pool
first", and a weight can always be outbid. The usual objection to hard constraints does not
apply, because "from among those who have kept fewest" has a non-empty minimum set by
construction, unlike "at most once", which dead-ends on pigeonhole.

**Hard:** slot counts filled exactly, exactly one goalie, one position per player,
participating players only, the two rations, and **nobody sits out two rounds running**.
**Priced, yielding in this order:** levelness of rounds played, goalie spread, defender
spread, then the length of an unbroken run of rounds played.

**The fatigue cap is dropped to a moderate penalty**, diverging from the existing tool's only
hard rule. Nobody sitting twice running makes a fourth-consecutive-round cap arithmetically
impossible: six present at 5v5 means one child sits per round, so somebody plays seven
straight.

**A team is capped at nine players, enforced.** This is what makes no-sitting-twice-running
satisfiable: eligible sitters are exactly those who played last round, so the rule needs
present ≤ twice the field size. The cap may be raised one day, and raising it past twice the
smallest field size breaks the engine.

**Positions are credited like rounds.** A player holds a position in a round if they held it
at any point, so a mid-round goalie change burns two goalie appearances and a round can credit
more defenders than it has slots. Crediting only the starting lineup would let a coach move a
child through goal all game unnoticed. A consecutive run is broken by any round in which the
player did not hold that position, out or absent alike.

**A late arrival with zero goalie appearances goes straight into goal**, and that is correct
rather than a bug: the same logic as ADR 0005's playing-time count, and softening it would
need a tie-break of its own.

**Determinism comes from a stored per-game seed, not from a fixed roster order.** At round one
every count is zero and everything ties, so a fixed order would put the same child in goal for
round one of every game forever. The seed is generated at Start, stored beside the formation
snapshot, derives the canonical ordering that breaks ties, and is set explicitly in tests. The
existing tool intends exactly this — `rng.js` threads a seed to the planner, which never calls
it.

**5v5 as 1/1/3 is owed nothing.** Forward repetition is a fact about the formation. No
warning, no nudge toward 1/2/2.

**The rules bind the engine, never the coach.** Any lineup the formation's slots allow can be
built by hand, including a goalie two rounds running, and the app never refuses, warns, or
reverts. What an override does to later rounds belongs to
[What a manual override does to the future](08-what-a-manual-override-does.md).

**The engine looks ahead internally and discards it**, scoring futures across the remaining
rounds and returning only the round in front of the coach. Nothing is stored or shown, so
[Plan the whole game, or one round at a time?](05-plan-ahead-or-round-at-a-time.md) is not
reopened. It runs in the API as a domain service, as a beam whose width is a constant chosen
by measurement rather than picked now.
