import { Formation } from '../../teams/domain/team.model';

export interface RosterPlayer {
  id: string;
  name: string;
}

/**
 * The team as it stood when the game started. A later Team edit cannot rewrite a game,
 * so the roster and formation are copied rather than referenced.
 */
export interface GameSnapshot {
  roster: RosterPlayer[];
  formation: Formation;
  rotationSeed: string;
}

export interface Game extends GameSnapshot {
  id: string;
  teamId: string;
  startedAt: Date;
}

/**
 * Copies the team onto a game. Later Team edits change the team, never a game already
 * under way, so the players and the formation are values here rather than references.
 */
export function startingSnapshot(
  team: { players: RosterPlayer[]; formation: Formation },
  rotationSeed: string,
): GameSnapshot {
  if (team.players.length === 0) throw new Error('A game needs at least one player.');
  return {
    roster: team.players.map((player) => ({ id: player.id, name: player.name })),
    formation: { defender: team.formation.defender, forward: team.formation.forward },
    rotationSeed,
  };
}
