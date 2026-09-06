// PROTOTYPE — throwaway. The seeded game and the per-cell facts the grid variants read.
// Built on the live-game prototype's state so the list screen underneath stays the settled one.
import {
  FORMATION,
  type Game,
  type HistoryMark,
  type Pos,
  ROSTER,
  TOTAL_ROUNDS,
  fold,
  history,
  participating,
  roundsPlayed,
  suggest,
  swap,
} from '../live-game/state';

export { TOTAL_ROUNDS };

/** Takes the last forward off for whoever has been sitting, so a round has a mid-round change in it. */
const changeMidRound = (game: Game): Game => {
  const onField = new Set(fold(game.rounds[game.round]).map((s) => s.player));
  const sittingOut = participating(game).find((p) => !onField.has(p));
  const comingOff = fold(game.rounds[game.round])[FORMATION.length - 1].player;
  return sittingOut && comingOff ? swap(game, comingOff, sittingOut) : game;
};

/**
 * Round 6 on the field, five rounds behind it, mid-round changes in 2, 5 and 6. A near-full
 * grid is the only way to judge whether eight rounds of nine players fit on a phone.
 */
export const seedGame = (): Game => {
  let game: Game = { roster: ROSTER, absent: ['Ivy'], round: 1, screen: 'plan', rounds: {} };
  for (let n = 1; n <= 6; n += 1) {
    game = { ...game, round: n, screen: 'plan' };
    game = { ...game, rounds: { ...game.rounds, [n]: { starting: suggest(game, n), changes: [] } } };
    game = { ...game, screen: 'live' };
    if (n === 2 || n === 5 || n === 6) game = changeMidRound(game);
  }
  return game;
};

export type Cell = {
  mark: HistoryMark;
  pos: Pos | null;
  /** In the round's starting lineup. */
  began: boolean;
  /** On the field when the round ended. */
  finished: boolean;
};

export const LETTER: Record<Pos, string> = { goalie: 'GK', defender: 'D', forward: 'F' };

export const cells = (game: Game, player: string): Cell[] =>
  history(game, player).map((mark, i) => {
    const round = game.rounds[i + 1];
    if (mark !== 'played' || !round) return { mark, pos: null, began: false, finished: false };
    const begun = round.starting.find((s) => s.player === player);
    const ended = fold(round).find((s) => s.player === player);
    return {
      mark,
      pos: (ended ?? begun)?.pos ?? null,
      began: Boolean(begun),
      finished: Boolean(ended),
    };
  });

/** Rounds played against an even share of the rounds credited so far. */
export const balances = (game: Game) => {
  const played = roundsPlayed(game);
  const here = participating(game);
  const share = here.reduce((sum, p) => sum + played[p], 0) / here.length;
  return Object.fromEntries(game.roster.map((p) => [p, Math.round(played[p] - share)]));
};

export const owedOrder = (game: Game) => {
  const played = roundsPlayed(game);
  return [...game.roster].sort((a, b) => played[a] - played[b] || a.localeCompare(b));
};
