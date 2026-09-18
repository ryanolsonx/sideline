import { GameSnapshot } from './game.model';
import { Position, StartingLineup } from './lineup';
import { PlayerStanding, standingOf } from './standings';
import { shuffledBySeed } from './rotation';

/**
 * The order ties break in. It comes from the game's seed rather than the roster, so round one
 * of every game does not open the same way, and it advances by round so a player the coach
 * moved out of goal is not offered it again immediately.
 */
function canonicalOrder(participating: readonly string[], snapshot: GameSnapshot, round: number): string[] {
  const ordered = shuffledBySeed(participating, snapshot.rotationSeed);
  const offset = ordered.length === 0 ? 0 : (round - 1) % ordered.length;

  return [...ordered.slice(offset), ...ordered.slice(0, offset)];
}

function by<T>(...preferences: ((candidate: T) => number)[]) {
  return (one: T, another: T) => {
    for (const preference of preferences) {
      const difference = preference(one) - preference(another);
      if (difference !== 0) return difference;
    }
    return 0;
  };
}

/**
 * Who sits. Nobody sits two rounds running, so the only eligible sitters are the players who
 * played last round; among them the ones who have played most sit first, then the ones in the
 * longest unbroken run.
 */
function sitters(
  order: readonly string[],
  standings: readonly PlayerStanding[],
  seats: number,
): string[] {
  if (seats <= 0) return [];

  const eligible = order.filter((playerId) => standingOf(standings, playerId).playedLastRound);
  const pool = eligible.length >= seats ? eligible : order;

  return [...pool]
    .sort(by(
      (playerId) => -standingOf(standings, playerId).roundsPlayed,
      (playerId) => -standingOf(standings, playerId).playedStreak,
      (playerId) => pool.indexOf(playerId),
    ))
    .slice(0, seats);
}

/**
 * A rationed position is drawn from the players who have held it fewest times, and is not held
 * two rounds running while that is satisfiable. Levelness of rounds played comes first, so a
 * player who is owed time is preferred among equals in the ration.
 */
function rationed(
  available: readonly string[],
  standings: readonly PlayerStanding[],
  position: Position,
  held: (standing: PlayerStanding) => number,
  count: number,
): string[] {
  const picked: string[] = [];
  let pool = [...available];

  while (picked.length < count && pool.length > 0) {
    const fewest = Math.min(...pool.map((playerId) => held(standingOf(standings, playerId))));
    const atFewest = pool.filter((playerId) => held(standingOf(standings, playerId)) === fewest);
    const notJustHeld = atFewest.filter((playerId) => standingOf(standings, playerId).heldLastRound !== position);
    const candidates = notJustHeld.length > 0 ? notJustHeld : atFewest;

    const [chosen] = [...candidates].sort(by(
      (playerId) => standingOf(standings, playerId).roundsPlayed,
      (playerId) => available.indexOf(playerId),
    ));

    picked.push(chosen);
    pool = pool.filter((playerId) => playerId !== chosen);
  }

  return picked;
}

/**
 * The round the engine offers, from what has actually happened. It plans this round only:
 * nothing about a later round is decided, stored, or shown.
 */
export function suggestRound(
  snapshot: GameSnapshot,
  participating: readonly string[],
  standings: readonly PlayerStanding[],
  round: number,
): StartingLineup {
  const order = canonicalOrder(participating, snapshot, round);
  const slots = 1 + snapshot.formation.defender + snapshot.formation.forward;
  const sitting = sitters(order, standings, participating.length - slots);
  const onField = order.filter((playerId) => !sitting.includes(playerId));

  const goalie = rationed(onField, standings, 'GOALIE', (standing) => standing.goalieRounds, 1);
  const outfield = onField.filter((playerId) => !goalie.includes(playerId));
  const defenders = rationed(outfield, standings, 'DEFENDER', (standing) => standing.defenderRounds, snapshot.formation.defender);
  const forwards = outfield
    .filter((playerId) => !defenders.includes(playerId))
    .slice(0, snapshot.formation.forward);

  return { goalie, defenders, forwards };
}
