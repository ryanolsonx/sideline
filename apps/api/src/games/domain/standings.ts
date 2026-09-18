import { GameState, Round } from './game.model';
import { Position } from './lineup';

/** What one player has done so far this game. Nothing here is stored; it is all folded. */
export interface PlayerStanding {
  playerId: string;
  roundsPlayed: number;
  goalieRounds: number;
  defenderRounds: number;
  /** Rounds played in an unbroken run up to the last round played. */
  playedStreak: number;
  playedLastRound: boolean;
  heldLastRound?: Position;
}

function positionsIn(round: Round): Map<string, Position> {
  const held = new Map<string, Position>();
  for (const playerId of round.startingLineup.goalie) held.set(playerId, 'GOALIE');
  for (const playerId of round.startingLineup.defenders) held.set(playerId, 'DEFENDER');
  for (const playerId of round.startingLineup.forwards) held.set(playerId, 'FORWARD');
  return held;
}

export function roundsInOrder(state: GameState): Round[] {
  return [...state.rounds].sort((one, another) => one.round - another.round);
}

/**
 * What has happened, per player, in the order it happened. The engine plans from this rather
 * than from anything it decided earlier, so walking a game back and replaying it agrees.
 */
export function standingsOf(state: GameState, participating: readonly string[]): PlayerStanding[] {
  const rounds = roundsInOrder(state);
  const lastRound = rounds.at(-1);

  return participating.map((playerId) => {
    const held = rounds.map((round) => positionsIn(round).get(playerId));
    const streakStart = held.findLastIndex((position) => position === undefined) + 1;

    return {
      playerId,
      roundsPlayed: held.filter((position) => position !== undefined).length,
      goalieRounds: held.filter((position) => position === 'GOALIE').length,
      defenderRounds: held.filter((position) => position === 'DEFENDER').length,
      playedStreak: held.length - streakStart,
      playedLastRound: lastRound !== undefined && positionsIn(lastRound).has(playerId),
      heldLastRound: lastRound && positionsIn(lastRound).get(playerId),
    };
  });
}

export function standingOf(standings: readonly PlayerStanding[], playerId: string): PlayerStanding {
  const standing = standings.find((candidate) => candidate.playerId === playerId);
  if (!standing) throw new Error('That player is not playing in this game.');
  return standing;
}
