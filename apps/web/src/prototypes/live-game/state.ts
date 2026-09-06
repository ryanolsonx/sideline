// PROTOTYPE — throwaway. Fake in-memory game behind the live-game screen variants.
// No API, no persistence, no tests. Delete with the rest of this folder.

export type Pos = 'goalie' | 'defender' | 'forward';
export type Slot = { pos: Pos; player: string | null };
export type Lineup = Slot[];
export type Change = { slot: number; from: string | null; to: string | null };
export type Round = { starting: Lineup; changes: Change[] };

export type Game = {
  roster: string[];
  absent: string[];
  round: number;
  screen: 'plan' | 'live';
  rounds: Record<number, Round>;
};

export const ROSTER = ['Ada', 'Beau', 'Cleo', 'Dev', 'Esme', 'Finn', 'Gus', 'Hana', 'Ivy'];
export const FORMATION: Pos[] = ['goalie', 'defender', 'defender', 'forward', 'forward', 'forward'];
export const TOTAL_ROUNDS = 8;

export const fold = (round: Round): Lineup => {
  const lineup = round.starting.map((s) => ({ ...s }));
  for (const c of round.changes) lineup[c.slot].player = c.to;
  return lineup;
};

export const participating = (game: Game) => game.roster.filter((p) => !game.absent.includes(p));

/** Everyone on the field at any point in the round — both sides of a mid-round swap. */
const appeared = (round: Round) => {
  const seen = new Set<string>();
  for (const s of round.starting) if (s.player) seen.add(s.player);
  for (const c of round.changes) if (c.to) seen.add(c.to);
  return seen;
};

const appearedAt = (round: Round, pos: Pos) => {
  const seen = new Set<string>();
  round.starting.forEach((s, i) => {
    if (s.pos === pos && s.player) seen.add(s.player);
    round.changes.filter((c) => c.slot === i && c.to).forEach((c) => seen.add(c.to!));
  });
  return seen;
};

/** Rounds credited so far: every played round, plus the live one once it is on the field. */
const countedRounds = (game: Game) =>
  Object.entries(game.rounds)
    .filter(([n]) => Number(n) < game.round || (Number(n) === game.round && game.screen === 'live'))
    .map(([, r]) => r);

export const roundsPlayed = (game: Game) => {
  const counts = Object.fromEntries(game.roster.map((p) => [p, 0]));
  for (const r of countedRounds(game)) for (const p of appeared(r)) counts[p] += 1;
  return counts;
};

export const positionCounts = (game: Game, pos: Pos) => {
  const counts = Object.fromEntries(game.roster.map((p) => [p, 0]));
  for (const r of countedRounds(game)) for (const p of appearedAt(r, pos)) counts[p] += 1;
  return counts;
};

export type HistoryMark = 'played' | 'out' | 'absent';

export const history = (game: Game, player: string): HistoryMark[] =>
  Array.from({ length: TOTAL_ROUNDS }, (_, i) => {
    const n = i + 1;
    const round = game.rounds[n];
    if (!round || n > game.round || (n === game.round && game.screen === 'plan')) return 'absent';
    if (appeared(round).has(player)) return 'played';
    // The real model reads a per-round attendance log; a flat set is enough to show three marks.
    return game.absent.includes(player) ? 'absent' : 'out';
  });

const heldLastRound = (game: Game, n: number, pos: Pos) => {
  const prev = game.rounds[n - 1];
  return prev ? appearedAt(prev, pos) : new Set<string>();
};

const outLastRound = (game: Game, n: number) => {
  const prev = game.rounds[n - 1];
  if (!prev) return new Set<string>();
  const played = appeared(prev);
  return new Set(participating(game).filter((p) => !played.has(p)));
};

/** Rough stand-in for the real engine: rationed goalie and defender, level playing time. */
export const suggest = (game: Game, n: number): Lineup => {
  const played = roundsPlayed(game);
  const wasOut = outLastRound(game, n);
  const pool = [...participating(game)].sort(
    (a, b) => Number(wasOut.has(b)) - Number(wasOut.has(a)) || played[a] - played[b] || a.localeCompare(b),
  );
  const onField = pool.slice(0, FORMATION.length);

  const pick = (candidates: string[], pos: Pos, count: number) => {
    const held = positionCounts(game, pos);
    const lastRound = heldLastRound(game, n, pos);
    const ranked = [...candidates].sort(
      (a, b) => held[a] - held[b] || Number(lastRound.has(a)) - Number(lastRound.has(b)) || a.localeCompare(b),
    );
    // The pool advances through the ordering rather than re-offering its head (ADR 0007).
    const offset = pos === 'goalie' ? (n - 1) % Math.max(ranked.length, 1) : 0;
    const fewest = ranked.filter((p) => held[p] === held[ranked[0]]);
    const rotated = [...fewest.slice(offset % fewest.length), ...fewest.slice(0, offset % fewest.length)];
    return [...new Set([...rotated, ...ranked])].slice(0, count);
  };

  let left = [...onField];
  const take = (names: string[]) => {
    left = left.filter((p) => !names.includes(p));
    return names;
  };
  const goalie = take(pick(left, 'goalie', 1));
  const defenders = take(pick(left, 'defender', 2));
  const forwards = left;

  const queue = [...goalie, ...defenders, ...forwards];
  return FORMATION.map((pos) => ({ pos, player: queue.shift() ?? null }));
};

export const newGame = (): Game => {
  const game: Game = { roster: ROSTER, absent: ['Ivy'], round: 1, screen: 'plan', rounds: {} };
  // Walk it forward so the prototype opens on a game already in progress.
  for (let n = 1; n <= 3; n += 1) {
    game.round = n;
    game.screen = 'plan';
    game.rounds[n] = { starting: suggest(game, n), changes: [] };
    game.screen = 'live';
  }
  game.round = 3;
  game.screen = 'live';
  // One change already made this round, so the live screen opens with something to read.
  const onField = new Set(game.rounds[3].starting.map((s) => s.player));
  const sittingOut = participating(game).find((p) => !onField.has(p))!;
  const comingOff = game.rounds[3].starting[FORMATION.length - 1].player!;
  return swap(game, comingOff, sittingOut);
};

export const swap = (game: Game, a: string, b: string): Game => {
  const round = game.rounds[game.round];
  const lineup = fold(round);
  const slotA = lineup.findIndex((s) => s.player === a);
  const slotB = lineup.findIndex((s) => s.player === b);
  if (slotA === -1 && slotB === -1) return game;

  if (game.screen === 'plan') {
    const starting = round.starting.map((s) => ({ ...s }));
    if (slotA >= 0) starting[slotA].player = b;
    if (slotB >= 0) starting[slotB].player = a;
    return { ...game, rounds: { ...game.rounds, [game.round]: { ...round, starting } } };
  }

  const changes = [...round.changes];
  if (slotA >= 0) changes.push({ slot: slotA, from: a, to: b });
  if (slotB >= 0) changes.push({ slot: slotB, from: b, to: a });
  return { ...game, rounds: { ...game.rounds, [game.round]: { ...round, changes } } };
};

export const toggleAttendance = (game: Game, player: string): Game => ({
  ...game,
  absent: game.absent.includes(player)
    ? game.absent.filter((p) => p !== player)
    : [...game.absent, player],
});

/** Subs on the live screen, Use Lineup on the plan screen: one alternating forward action. */
export const forward = (game: Game): Game => {
  if (game.screen === 'plan') return { ...game, screen: 'live' };
  const n = game.round + 1;
  const next = { ...game, round: n, screen: 'plan' as const };
  if (!next.rounds[n]) next.rounds = { ...next.rounds, [n]: { starting: suggest(next, n), changes: [] } };
  return next;
};

export const back = (game: Game): Game => {
  if (game.screen === 'live') return { ...game, screen: 'plan' };
  if (game.round === 1) return game;
  return { ...game, round: game.round - 1, screen: 'live' };
};
