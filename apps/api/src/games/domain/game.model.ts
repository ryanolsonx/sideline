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
