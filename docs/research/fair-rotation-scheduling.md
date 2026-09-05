# Fair rotation as a scheduling problem

Research for [Fair rotation as a scheduling problem](../../.scratch/game-substitutions/issues/15-research-fair-rotation-algorithms.md).

The problem: assign N players (roughly 6 to 14) to R rounds (roughly 5 to 8) of fixed position slots (1 goalie, 2 defenders, 3 forwards), balancing total playing time, rotating goalie under an at-most-once-per-player rule, avoiding the same position in consecutive rounds, and rotating who sits.

## Summary

1. This is **personnel rostering**, not sports scheduling. The closest named problem with a literature behind it is the **Nurse Rostering Problem**, whose constraint taxonomy maps onto ours almost line for line. Sports scheduling in the OR sense is about fixtures and does not cover it.
2. There is **essentially no OR literature on youth-sports playing-time allocation**. We are not going to find a paper describing our exact problem, and we do not need one.
3. A greedy construction gets **playing-time balance right at our scale** but pays for it in the other constraints. In a local experiment it hit the theoretical best minute spread in every shape tested while forcing five or six consecutive-position repeats in the small-squad shapes, where an exhaustive search found schedules with none at the same minute spread. Fairness in minutes is the easy objective; it is the constraints around it that greedy sacrifices.
4. Hard versus soft is a solved modeling question: hard constraints go in the model, soft ones get reified onto a Boolean and weighted into a single objective. Deterministic tie-breaking should come from **making the optimum unique in the model**, not from trusting solver determinism.
5. Manual override is the **minimal perturbation problem**, a named and well-studied thing. The standard answer is to re-solve the whole model with the override pinned as a hard constraint and a penalty on deviation from the previous schedule. Nothing in the literature argues local repair produces *better* schedules; the arguments for repair are all about compute cost and churn.

## 1. What class of problem this is

### Not sports scheduling

Sports scheduling and sports timetabling in OR are about *fixtures*. Van Bulck and Goossens define the field's object as assigning "a given set of matches to rounds (also called time slots) such that each team plays at most once per round" ([arXiv:2309.03229](https://arxiv.org/html/2309.03229v2)), and the field's flagship benchmark ITC2021 "consists of constructing a compact double round-robin tournament with 16 to 20 teams" ([ITC2021](https://robinxval.ugent.be/ITC2021/), [EJOR](https://www.sciencedirect.com/science/article/abs/pii/S0377221722009201)). Kendall, Knust, Ribeiro and Urrutia's annotated bibliography ([PDF](https://www.graham-kendall.com/papers/kkru2010.pdf)) organizes the field around round-robin schedules, breaks, carry-over effects, venues, the Traveling Tournament Problem and referee assignment.

Our rounds are not matches and our players are not teams. The resemblance is the phrase "assign to rounds" and nothing below it.

### It is personnel rostering

Ernst, Jiang, Krishnamoorthy and Sier's review ([EJOR 153(1):3-27, 2004](https://www.sciencedirect.com/science/article/abs/pii/S037722170300095X)) decomposes staff scheduling into modules including days-off scheduling, shift scheduling and task assignment. Our problem is exactly three of them at once: who sits out, who plays which round, and which position they hold. Van den Bergh et al.'s successor survey ([EJOR 226(3):367-385, 2013](https://lirias.kuleuven.be/retrieve/231816)) classifies by personnel characteristics including skills, and by decision delineation across time, tasks and shift sequence.

The tightest match is the **Nurse Rostering Problem**. Burke, De Causmaecker, Vanden Berghe and Van Landeghem's survey ([Journal of Scheduling 7(6):441-499, 2004](https://dl.acm.org/doi/abs/10.1023/B:JOSH.0000046076.75950.0b)) names resource utilization, equitable workload distribution and worker preferences as what a roster must balance. The [INRC-II specification](https://arxiv.org/abs/1501.04177) gives constraint names that translate directly:

| INRC-II constraint | Our rule |
| --- | --- |
| H1 Single Assignment per Day: "A nurse can be assigned to at most one shift per day" | one position per player per round |
| H2 Under-staffing | fill 1 goalie + 2 defenders + 3 forwards every round |
| H3 Shift Type Successions: assignments "in two consecutive days must belong to the legal successions" | no same position in consecutive rounds |
| H4 Missing Required Skill | position eligibility, if we ever restrict who keeps goal |
| S2/S3 Consecutive Assignments and Days Off | how sit-outs cluster |
| S6 Total Assignments over the horizon | playing-time balance; goalie-at-most-once is a per-role cap |
| S4 Preferences | player or parent requests, if we add them |

See also De Causmaecker and Vanden Berghe's categorisation ([Journal of Scheduling 14:3-16, 2011](https://link.springer.com/article/10.1007/s10951-010-0211-z)) and the INRC-I write-up ([Annals of OR 218:221-236](https://link.springer.com/article/10.1007/s10479-012-1062-0)).

The Generalized Assignment Problem ([Öncan's survey](https://www.tandfonline.com/doi/abs/10.3138/infor.45.3.123)) is a component of ours, not the whole: it has no time dimension, so it cannot express the consecutive-round rule or across-round balance. The most precise single description is *multi-period personnel rostering with skill-typed task assignment, workload balancing and sequence constraints*.

One strong adjacent citation on the fairness objective specifically: Li, Shehadeh, Curtis and Hochman, "Equity-promoting integer programming approaches for medical resident rotation scheduling" ([Health Care Management Science 28(4), 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12743667/)), which models equity with Gini deviation and maximum pairwise deviation and solves the multi-objective IP by Pareto search.

### The youth-sports literature does not exist

Searching INFORMS venues, arXiv and general academic search across several phrasings turned up **no peer-reviewed paper formulating youth-sports playing time or substitution scheduling as a mathematical program**. What exists:

- A normative discussion paper, not a model: Lorentzen, "Allocation of playing time within team sports - a problem for discussion" ([Open Review of Educational Research 4(1), 2017](https://www.tandfonline.com/doi/abs/10.1080/23265507.2016.1266694), [ERIC](https://eric.ed.gov/?id=EJ1160899)), asking "under which condition is it 'fair' to use equal and under which condition 'fair' to use unequal playing time?"
- Policy advocacy, such as [Aspen Institute Project Play on equal playing time](https://projectplay.org/news/2018/1/11/why-project-play-recommends-equal-playing-time-for-kids).
- A dense commercial and hobbyist tool space encoding our constraints as folk rules. One lineup generator states plainly that "a player will not stay in the same position for two consecutive rotations" and "no player will be put on the bench a second time until all other players have been on the bench once" ([freebaseballlineups.com](https://freebaseballlineups.com/lineups.html)). That is our rule set, arrived at without a paper.
- INFORMS Transactions on Education does carry sports-scheduling teaching papers ([Belgian soccer league](https://pubsonline.informs.org/doi/10.1287/ited.2022.0269), [using sports scheduling to teach IP](https://pubsonline.informs.org/doi/pdf/10.1287/ited.5.1.10)), but both are fixture scheduling.

We borrow structure and method from nurse rostering, and the application itself is unclaimed.

### Complexity

NP-hard in general, with a qualifier that matters more than the hardness.

The sharpest on-point result is the **Days On Days Off Scheduling Problem** ([arXiv:2410.23056](https://www.arxiv.org/abs/2410.23056), published in [EJOR](https://www.sciencedirect.com/science/article/abs/pii/S0377221725005363)), which proves NP-completeness for exactly our combination: hardness "arises from combining lower bounds on consecutive work days or days off with an upper bound on each worker's total number of work days," by reduction from 3-Partition. It also identifies polynomial special cases reducing to negative-cycle detection, and it corrects an earlier incorrect NP-completeness proof of Brunner et al. (2013), so cite the 2024 paper rather than that one. NRP hardness is conventionally attributed to Osogami and Imai, ISAAC 2000 ([Springer](https://link.springer.com/content/pdf/10.1007/3-540-40996-3_7.pdf)); that attribution is relayed from the survey literature rather than read from the primary text.

The qualifier: our instance is roughly 14 x 8 x 4 boolean decisions. Asymptotic hardness has no operational consequence at that size. It governs how we describe the problem, not how we solve it.

## 2. Greedy versus real optimization at our scale

### What greedy guarantees in general

Even on the friendliest structure imaginable, greedy is measurably off optimal:

- Any list-scheduling algorithm is a **2 - 1/m approximation** for identical machines, and the bound is tight ([identical-machines scheduling](https://en.wikipedia.org/wiki/Identical-machines_scheduling); Graham, "Bounds for Certain Multiprocessing Anomalies," [BSTJ 45(9):1563-1581, 1966](https://onlinelibrary.wiley.com/doi/abs/10.1002/j.1538-7305.1966.tb01709.x)).
- Sorting first (Longest Processing Time) improves this to **4/3 - 1/(3m)**, and that bound is tight too ([LPT scheduling](https://en.wikipedia.org/wiki/Longest-processing-time-first_scheduling); Graham, [SIAM J. Appl. Math. 17(2):416-429, 1969](https://epubs.siam.org/doi/10.1137/0117039)).
- Greedy set cover is Θ(ln n) and that is essentially unimprovable ([Feige, JACM 45(4), 1998](https://dl.acm.org/doi/10.1145/285055.285059)); greedy monotone submodular maximization is 1 - 1/e ([Nemhauser, Wolsey and Fisher, Mathematical Programming 14:265-294, 1978](https://link.springer.com/article/10.1007/BF01588971)).
- Greedy is *exactly* optimal for additive objectives precisely when the independence system is a **matroid** (Rado-Edmonds; [Edmonds, Mathematical Programming 1:127-136, 1971](https://link.springer.com/article/10.1007/BF01584082)), with tight worst-case bounds off matroids in [Conforti and Cornuéjols, Discrete Applied Mathematics 7(3), 1984](https://www.sciencedirect.com/science/article/pii/0166218X84900039).

Our constraint set is not a matroid: goalie-at-most-once, no-repeat-in-consecutive-rounds and one-slot-per-round together break the exchange property, so a maximal feasible partial assignment need not extend to a maximum one. By Rado-Edmonds that is exactly when greedy loses its guarantee. None of the specific bounds above transfer to our objective; they are the right cautionary reference class, not applicable theorems.

### Where construction is exactly optimal

Cyclic rotation is genuinely optimal when the symmetry holds. The circle method rotates all but one competitor by a fixed step each round, with a bye or dummy competitor for odd counts ([round-robin tournament](https://en.wikipedia.org/wiki/Round-robin_tournament)), and it corresponds to a 1-factorization of the complete graph ([graph factorization](https://en.wikipedia.org/wiki/Graph_factorization); [Rasmussen and Trick, EJOR 188(3):617-636](https://mat.tepper.cmu.edu/trick/survey.pdf)). That result is about *pairings* rather than player-to-slot assignment, so for us it is an analogy, not a theorem.

The directly citable analogue for "spread at most one" is **equitable colouring**, which requires that "the numbers of vertices in any two color classes differ by at most one" and which Meyer motivated by scheduling, giving "equal or nearly-equal numbers of tasks in each time step" ([equitable coloring](https://en.wikipedia.org/wiki/Equitable_coloring)). The load-balancing lower bound gives the same number arithmetically: total work over machine count bounds the optimal makespan below, so with unit-length round slots the minimum achievable maximum load is ⌈R·S/N⌉ ([identical-machines scheduling](https://en.wikipedia.org/wiki/Identical-machines_scheduling)). **When R·S is not a multiple of N, a spread of one round is the best any algorithm can do.** Announcing "everyone played 4 or 5" is not a failure of the algorithm.

The fair-division literature says the same thing from the other side: exact fairness is impossible with indivisible items, so the standard relaxation is envy-freeness up to one good ([Budish, JPE 119(6), 2011](https://arxiv.org/pdf/2202.08713)). Most on point for rounds: Igarashi, Lackner, Nardi and Novaro, "Repeated Fair Allocation of Indivisible Items" ([arXiv:2304.01644](https://arxiv.org/abs/2304.01644)), which shows that insisting on fairness *within each round* can make an envy-free and Pareto-optimal sequence impossible, while relaxing the per-round requirement and balancing across the whole sequence recovers both. That is our design decision stated as a theorem: fairness is a property of the game, not of a round.

### What actually happens on our instances

The literature has no measurement at our size, so a throwaway experiment was run: a locally fair greedy (fill each slot with the eligible player who has played fewest rounds, ties by roster order, preferring players who did not hold that position last round) against an exhaustive backtracking search treating every rule as hard.

| N, R | greedy minute spread (best possible) | greedy goalie repeats | greedy consecutive-position repeats | exhaustive search |
| --- | --- | --- | --- | --- |
| 9, 6 | 0 (0) | 0 | 0 | feasible, spread 0 |
| 8, 6 | 1 (1) | 0 | **5** | feasible, spread 1, zero repeats |
| 7, 6 | 1 (1) | 0 | **5** | feasible, spread 1, zero repeats |
| 6, 6 | 0 (0) | 0 | **5** | feasible, spread 0, zero repeats |
| 7, 7 | 0 (0) | 0 | **6** | feasible, spread 0, zero repeats |
| 10, 5 | 0 (0) | 0 | 0 | feasible, spread 0 |
| 12, 6 | 0 (0) | 0 | 0 | feasible, spread 0 |

Three things fall out.

**Minute balance is easy.** Greedy hit the theoretical optimum spread in every shape. If total playing time were the only goal, no optimizer is warranted.

**The other constraints are where greedy loses.** In every small-squad shape the greedy schedule forced five or six consecutive-position repeats, while a schedule with zero repeats and the same optimal minute spread exists. The greedy did not know that, because it committed each round before seeing the next.

**Goalie-at-most-once fails only when R > N**, which is pigeonhole, not a defect: with more rounds than players, somebody keeps goal twice regardless of algorithm. Worth surfacing in the product as a fact about the squad rather than as a scheduling bug.

Naive exhaustive search is not the answer either: proving the 9-players-6-rounds case feasible took 11.9 million search nodes and about two seconds of plain depth-first backtracking, and an earlier run with a lower node cap reported it *infeasible* purely because it ran out of budget. That is a caution about hand-rolled search, and an argument for either a real propagating solver or a heuristic-plus-repair scheme, not for brute force.

### What that implies

Constraint programming is described as "one of the best-suited methodologies for modelling and solving small and medium-sized practical instances" of nurse rostering, and OR-Tools treats employee and nurse scheduling as a flagship CP-SAT application while noting that "finding a schedule that satisfies all constraints can be computationally difficult" ([OR-Tools employee scheduling](https://developers.google.com/optimization/scheduling/employee_scheduling)). The CP-SAT primer's own scale statement is that "you can still get lucky for smaller problems (let us say a few hundred to thousands of variables) and obtain optimal solutions without having an idea of what is going on" ([CP-SAT primer](https://github.com/d-krupke/cpsat-primer/blob/main/chapters/example.md)) - a claim about modeling forgiveness at that scale, not a runtime bound.

No source found states "CP-SAT solves an instance of this shape in milliseconds." Treat that as a hypothesis to benchmark rather than a fact. What the evidence does support: greedy alone will produce visibly repetitive schedules for small squads, and the fix is either propagation and backtracking during construction or a real solver.

## 3. Hard versus soft constraints, and deterministic tie-breaking

### The encoding

Hard constraints go into the model as constraints. Soft constraints are **reified** onto a Boolean literal, and that literal or a slack integer is summed into the objective with a weight.

OR-Tools' reification is deliberately one-way: "The CP-SAT solver supports *half-reified* constraints, also called *implications*, which are of the form: `x implies constraint`," and "this is not an equivalence relation. The constraint can still be true if `x` is false" ([boolean_logic.md](https://github.com/google/or-tools/blob/stable/ortools/sat/docs/boolean_logic.md)). "To implement full reification, two half-reified constraints must be used." This matters in one direction only: minimizing a penalty on a violation literal is safe, but *maximizing* satisfaction of a soft constraint with only a half-reified link lets the solver set the literal true for free.

The general name is channeling: "a channeling constraint links variables inside a model... Channeling is usually implemented using half-reified linear constraints" ([channeling.md](https://github.com/google/or-tools/blob/stable/ortools/sat/docs/channeling.md)), whose bin-packing example is literally a soft capacity constraint with both implications and a maximized slack sum. Graduated integer penalties are documented too: "if the cumul of the sequence is greater than soft_max, then linear_penalty * (cumul - soft_max) is added to the cost" ([scheduling.md](https://github.com/google/or-tools/blob/stable/ortools/sat/docs/scheduling.md)).

The canonical worked example is exactly our shape: `AddExactlyOne` for coverage, `AddAtMostOne` for one shift per person per day, `min_shifts_per_nurse = (num_shifts * num_days) // num_nurses` with each nurse's total constrained into `[min, max]` for balance, and shift requests maximized as the soft objective ([employee scheduling](https://developers.google.com/optimization/scheduling/employee_scheduling)). Note that the soft term there needs no extra variable at all, because the request coefficient multiplies an existing decision variable - the cheapest form of a soft constraint, worth preferring where it applies.

### Modeling the fairness objective

The measures actually used in rostering are the range between most- and least-loaded, the standard deviation of workloads, and the sum of absolute deviations from the mean ([workload balancing for the nurse scheduling problem](https://www.sciencedirect.com/science/article/pii/S0038012124002453); [Wolbeck, Fairness Aspects in Personnel Scheduling](https://d-nb.info/1202043291/34)). Absolute deviation is the integer-linear-friendly one; standard deviation is quadratic and awkward.

**Plain min-max ties too much, and this is documented.** "Standard max-min optimization has a critical limitation: non-uniqueness combined with potential inefficiency... multiple optimal solutions can exist with different unsorted value vectors - for example, both (1,2,3) and (2,1,3) might be optimal" ([lexicographic max-min optimization](https://en.wikipedia.org/wiki/Lexicographic_max-min_optimization)). The documented fix is **leximin**: raise the smallest value as high as possible, then the second-smallest, and so on. The canonical CP treatment is Bouveret and Lemaître, "Computing leximin-optimal solutions in constraint networks" ([Artificial Intelligence 173(2):343-364, 2009](https://www.sciencedirect.com/science/article/pii/S0004370208001495)); Ogryczak and Śliwiński's ordered-values reduction is the variant that suits us, being efficient when objectives take finitely many values, which integer round counts do.

A caveat worth carrying: leximin pins down the *sorted* vector of loads uniquely only under convexity, which an integer model does not have. It settles that somebody plays 4 and somebody plays 5; it does not settle who. That is what tie-breaking is for.

### Deterministic tie-breaking

The honest reading of OR-Tools' own documentation is that solver determinism is best-effort. `random_seed` promises only that "the random number generator... is reinitialized to this seed. If you change the random seed, the solver may make different choices during the solving process" - not that the returned solution is reproducible. `num_workers` of 1 "means no parallelism." `interleave_search` is marked **Experimental** and claims "the search is deterministic (independently of num_workers!)" ([sat_parameters.proto](https://github.com/google/or-tools/blob/stable/ortools/sat/sat_parameters.proto)). Against that, the maintainer states plainly "we do not guarantee the same solution across versions" ([#3590](https://github.com/google/or-tools/issues/3590)), a report titled "Non-determinism for CP-SAT with num_workers=1" with a fixed seed was answered "Reproduced" ([#3948](https://github.com/google/or-tools/issues/3948)), and a later report of varying solutions at the same objective value with a seed, eight workers and `interleave_search` was reproduced on two versions ([#4458](https://github.com/google/or-tools/issues/4458)). A useful debugging note from the same maintainer: the log prints a fingerprint of the input model and of the output solution, and non-reproducibility is often the *caller's* model-building order, "usually from hash_maps."

**So do not source determinism from the solver. Source it from the model.** Add a bottom-priority tie-break term over a canonical ordering - a weight strictly decreasing in a canonical player index, with the whole tie-break block weighted below the smallest meaningful difference in the primary objective - so the optimum is unique regardless of search order. This rests on the classical lexicographic-weights result: for linear problems "there exist a set of weights w₁ > w₂ > ⋯ > wₙ such that the set of lexicographically-optimal solutions is identical to the set of solutions" of the single weighted objective, with weights approximately dᵗ ([lexicographic optimization](https://en.wikipedia.org/wiki/Lexicographic_optimization)). No OR-Tools document states this technique explicitly; the weighting result it rests on is cited above.

The same device answers "fairness first, then position variety": weight priority level *i* by Bᵐ⁻ⁱ where B strictly exceeds the range of every lower-priority objective. The alternative is solve-fix-resolve, which is what CP-SAT natively supports - "to implement a lexicographic optimization, you can do multiple rounds and always fix the previous objective as constraint" ([CP-SAT primer, modelling](https://d-krupke.github.io/cpsat-primer/modelling.html)) - with the caveat from the same source that adding the previous bound as a constraint "often limits CP-SAT's ability to find better solutions" by interfering with the linear relaxation, and that the second solve should be warm-started with the first solution as a hint ([coding patterns](https://d-krupke.github.io/cpsat-primer/coding_patterns.html)).

**CP-SAT has no native multi-objective support.** `CpModelProto` carries a single field, `CpObjectiveProto objective = 4`, "the objective to minimize" ([cp_model.proto](https://github.com/google/or-tools/blob/stable/ortools/sat/cp_model.proto)). Web summaries claiming otherwise are wrong; the proto is the authority.

## 4. Replanning after a manual override

### This is the minimal perturbation problem

It has a name and a literature. "A minimal perturbation problem incorporates changes along with the initial solution, as a new problem whose solution must be as close as possible to the initial solution," arising when a timetable "contains hard constraint violations or infeasibilities which need to be resolved, with the objective being to resolve these infeasibilities while minimising the disruption or perturbation to the remainder of the timetable."

- Barták, Müller and Rudová, "A New Approach to Modeling and Solving Minimal Perturbation Problems" ([CSCLP 2004](https://link.springer.com/chapter/10.1007/978-3-540-24662-6_13)), and the [formal view](https://www.unitime.org/papers/ercimprelimin03.pdf).
- Müller, Rudová and Barták, "Minimal Perturbation Problem in Course Timetabling" ([PATAT 2005](https://link.springer.com/chapter/10.1007/11593577_8), [PDF](https://www.unitime.org/papers/patat05.pdf)).
- El Sakkout and Wallace, "Probe Backtrack Search for Minimal Perturbation in Dynamic Scheduling" ([Constraints 5(4):359-388, 2000](https://link.springer.com/article/10.1023/A:1009856210543)): "an algorithm designed to minimally reconfigure schedules in response to a changing environment... The total shift in the start and end times of already scheduled activities should be kept to a minimum."
- Later exact treatments: [integer programming for minimal perturbation in university course timetabling](https://link.springer.com/article/10.1007/s10479-015-2094-z), a [MaxSAT formulation](https://link.springer.com/chapter/10.1007/978-3-030-58942-4_21), and [hybrid search for minimal perturbation in dynamic CSPs](https://link.springer.com/article/10.1007/s10601-011-9108-5).

### The standard framing is re-solve, not repair

The cleanest statement of the pattern our product needs is Kotas, Pham and Koellmann, "Optimal minimal-perturbation university timetabling with faculty preferences" ([arXiv:2008.12342](https://arxiv.org/abs/2008.12342)): "additions or cancellations of course sections occur shortly before the beginning of the academic term, necessitating last-minute teaching staffing changes. We present a decision-making framework that both minimizes the number of course swaps, which are inconvenient to faculty members, and maximizes faculty members' preferences... formulated as an integer linear program." That is exactly a full re-solve with the original objective retained plus a term counting deviations from the previous solution.

The rescheduling taxonomy behind it is Vieira, Herrmann and Lin, "Rescheduling Manufacturing Systems" ([Journal of Scheduling 6(1):35-58, 2003](https://link.springer.com/article/10.1023/A:1022235519958), [author copy](https://isr.umd.edu/Labs/CIM/projects/jos-rescheduling.pdf)), which names three methods - right-shift, **regeneration** ("reschedules the entire set of operations not processed before the disruption point") and partial rescheduling - and the concept of schedule **nervousness**, where "a rescheduling policy that yields fewer revisions increases schedule stability."

### Which to choose

Every argument found *against* regeneration is about computation cost or churn, not about solution quality. On quality, regeneration is the benchmark repair methods are measured against. Bean, Birge, Mittenthal and Noon's match-up scheduling ([Operations Research 39(3):470-483, 1991](https://pubsonline.informs.org/doi/10.1287/opre.39.3.470)) reconstructs part of a schedule "to match up with the preschedule at some future time" and reports strategies "comparable to right-shift for stability, and as good as total-rescheduling for performance" - a well-designed repair can match regeneration, but that takes design work and is not what ad-hoc patching gives you. The utility-versus-stability tension is explicit in the literature and is a tradeoff to be stated, not discovered ([Geiger, instability measure](https://arxiv.org/abs/1004.4734), which stresses that stability "has to be defined w.r.t. the particular situation and the requirements of the human decision maker"). The CP vocabulary for the same idea is solution stability and super solutions ([Hebrard, Hnich and Walsh, CPAIOR 2004](https://homepages.laas.fr/ehebrard/papers/cpaior2004.pdf); [JAIR survey](https://www.jair.org/index.php/jair/article/download/10858/25907/20251)).

**For an instance where a full re-solve is fast, there is no quality reason to prefer local repair, and the minimal-perturbation formulation removes the nervousness objection by moving stability into the objective rather than into the algorithm.** Regenerate from the override forward, with a penalty on changing rounds the coach has already seen. That conclusion is an inference from the pattern of what these comparisons measure; no source states it for instances of our size.

## 5. Pitfalls where locally fair choices go globally wrong

**Greedy scheduling is non-monotone.** Graham's 1966 paper is about exactly this: adding processors, shortening task times, or relaxing precedence constraints can each *increase* the finishing time ([BSTJ 45(9), 1966](https://onlinelibrary.wiley.com/doi/abs/10.1002/j.1538-7305.1966.tb01709.x)). Relevant reading for us: LPT was deliberately engineered to be monotone, "if one of the input numbers increases, the objective function... weakly increases," in contrast to Multifit, which is not ([LPT scheduling](https://en.wikipedia.org/wiki/Longest-processing-time-first_scheduling)). Monotonicity is a designed property. A coach adding a late-arriving player and watching everyone else's minutes shuffle is the anomaly, and preventing it is work.

**Greedy construction can paint itself into infeasibility.** Because greedy operates sequentially, "the greedy algorithm might run into infeasibility problems at the end, when violations of constraints are not allowed" ([ScienceDirect greedy strategy topic page](https://www.sciencedirect.com/topics/computer-science/greedy-strategy); relayed from a search extract, the fetch was blocked). The CSP framing: "a dead-end situation occurs when it's impossible to extend the current partial schedule," which look-ahead schemes prevent and look-back schemes recover from ([backtracking search](https://www.sciencedirect.com/topics/computer-science/backtracking-search)). Our scarce-role case is a bipartite feasibility problem - each round needs a goalie from the set of players who have not yet kept goal and are not otherwise blocked - and a rule that spends goalie-eligible players on a who-has-played-least criterion can drive later rounds' eligibility sets below Hall's condition. The remedies the CSP literature names are look-ahead propagation before committing, and assigning the scarcest resource first.

**Irrevocable decisions cost something provable.** Round-by-round construction voluntarily behaves like an online algorithm even though the whole instance is known up front: "jobs are available one by one and each job must be scheduled irrevocably before the availability of the next job" ([semi-online scheduling survey, arXiv:2005.08614](https://arxiv.org/abs/2005.08614)). Online bin packing bounds that price unconditionally: no online algorithm beats an asymptotic competitive ratio of 1.54278 ([Balogh, Békési, Dósa, Epstein and Levin, arXiv:1807.05554](https://arxiv.org/abs/1807.05554)). We know the roster and the round count at kickoff, so paying an online algorithm's price is a choice.

**Per-step fairness is not end-state fairness.** Kumar and Yeoh contrast *instantaneous* fairness, which treats each allocation independently "without considering temporal dynamics," thereby missing how inequalities compound over time, with *perfect-recall* fairness tracking "cumulative utilities" across previous steps ([arXiv:2504.01154](https://arxiv.org/abs/2504.01154)). Combined with the repeated-allocation result cited earlier ([arXiv:2304.01644](https://arxiv.org/abs/2304.01644)), the design implication is direct: optimize the game, present the round.

**The concrete pitfall for us, measured.** The greedy in the table above was locally fair by construction and still forced five or six consecutive-position repeats in every small-squad shape where a zero-repeat schedule existed at identical minute fairness. Nothing about any individual round looked wrong. The schedule was only bad as a whole.

## Confidence and gaps

- Springer, ScienceDirect, MDPI, Wiley and Taylor & Francis blocked several direct fetches. Claims relayed from search extracts rather than a read primary source are flagged inline: the Kendall et al. bibliography's category list, Van den Bergh et al.'s full text, Osogami and Imai's theorem statement, Vieira et al.'s method names, the Bean et al. results summary, the Lorentzen paper's contents, and the ScienceDirect greedy topic page.
- A Schönberger MIP for in-match player substitutions appeared in one search extract and **could not be verified to exist**. Do not cite it.
- No source measures solve time for a rostering instance of our size. The claim that a solver handles this instantly is a hypothesis to benchmark.
- The greedy-versus-exhaustive numbers in section 2 are from a throwaway local experiment written for this ticket, not from any publication. They are evidence about our instances specifically, and the experiment was not kept.
