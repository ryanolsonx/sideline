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

export type GameLifecycle = 'SETUP' | 'LIVE' | 'ENDED' | 'ABANDONED';

export const MARK_ATTENDANCE = 'MARK_ATTENDANCE';

/**
 * The whole present-player list, stamped with the round it takes effect from. One coach
 * confirmation is one action; ticking a box is not.
 */
export interface MarkAttendanceAction {
  kind: typeof MARK_ATTENDANCE;
  fromRound: number;
  presentPlayerIds: string[];
}

export type GameAction = MarkAttendanceAction;

export interface GameState {
  lifecycle: GameLifecycle;
  attendanceConfirmed: boolean;
  presentPlayerIds: string[];
}

/** Reads an action off a stored row, ignoring kinds this version does not know. */
export function gameActionFrom(kind: string, payload: Record<string, unknown>): GameAction | undefined {
  if (kind !== MARK_ATTENDANCE) return undefined;
  return {
    kind: MARK_ATTENDANCE,
    fromRound: Number(payload.fromRound ?? 1),
    presentPlayerIds: (payload.presentPlayerIds as string[] | undefined) ?? [],
  };
}

export function payloadOf(action: GameAction): Record<string, unknown> {
  return { fromRound: action.fromRound, presentPlayerIds: action.presentPlayerIds };
}

/**
 * The only thing a game knows about itself. Nothing derived is ever stored, so this runs on
 * every read and can never disagree with the log it came from.
 */
export function projectGame(snapshot: GameSnapshot, actions: readonly GameAction[]): GameState {
  const everyone = snapshot.roster.map((player) => player.id);

  return actions.reduce<GameState>(
    (state, action) =>
      action.kind === MARK_ATTENDANCE
        ? {
            ...state,
            attendanceConfirmed: true,
            presentPlayerIds: everyone.filter((id) => action.presentPlayerIds.includes(id)),
          }
        : state,
    { lifecycle: 'SETUP', attendanceConfirmed: false, presentPlayerIds: everyone },
  );
}

/** The one action a coach's confirmation writes, whoever they ticked and unticked on the way. */
export function markAttendance(
  snapshot: GameSnapshot,
  state: GameState,
  presentPlayerIds: readonly string[],
): MarkAttendanceAction {
  if (state.lifecycle === 'ENDED' || state.lifecycle === 'ABANDONED') {
    throw new Error('This game is over.');
  }

  const roster = snapshot.roster.map((player) => player.id);
  const unknown = presentPlayerIds.find((id) => !roster.includes(id));
  if (unknown) throw new Error('That player is not in this game.');

  return {
    kind: MARK_ATTENDANCE,
    fromRound: 1,
    presentPlayerIds: roster.filter((id) => presentPlayerIds.includes(id)),
  };
}
