import { Formation } from '../../teams/domain/team.model';
import { StartingLineup, suggestFirstRound } from './lineup';

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
export const USE_LINEUP = 'USE_LINEUP';
export const SWAP = 'SWAP';

/**
 * The whole present-player list, stamped with the round it takes effect from. One coach
 * confirmation is one action; ticking a box is not.
 */
export interface MarkAttendanceAction {
  kind: typeof MARK_ATTENDANCE;
  fromRound: number;
  presentPlayerIds: string[];
}

/** The lineup the engine offered for a round. A round keeps what it began as. */
export interface UseLineupAction {
  kind: typeof USE_LINEUP;
  round: number;
  lineup: StartingLineup;
}

/**
 * Two players trading places, which is the whole of a coach adjustment. It names the round it
 * targets and the screen it was made on, so the fold knows whether it changes what a round
 * begins as or what is on the field now.
 */
export interface SwapAction {
  kind: typeof SWAP;
  round: number;
  screen: RoundScreen;
  playerIds: [string, string];
}

export type RoundScreen = 'PLAN' | 'LIVE';

export type GameAction = MarkAttendanceAction | UseLineupAction | SwapAction;

export interface Round {
  round: number;
  startingLineup: StartingLineup;
}

/** Two players trading places in a lineup. Everyone else stays where the engine put them. */
export function swappedLineup(lineup: StartingLineup, [one, another]: readonly [string, string]): StartingLineup {
  const traded = (playerId: string) =>
    playerId === one ? another : playerId === another ? one : playerId;

  return {
    goalie: lineup.goalie.map(traded),
    defenders: lineup.defenders.map(traded),
    forwards: lineup.forwards.map(traded),
  };
}

function afterSwaps(lineup: StartingLineup, swaps: readonly (readonly [string, string])[]): StartingLineup {
  return swaps.reduce(swappedLineup, lineup);
}

export interface GameState {
  lifecycle: GameLifecycle;
  attendanceConfirmed: boolean;
  presentPlayerIds: string[];
  rounds: Round[];
  currentRound?: number;
  /** The round waiting for the coach to use a lineup. Nothing about it is stored. */
  plannedRound?: number;
  /** The swaps the coach has made to the round being planned, in the order they were made. */
  plannedSwaps: [string, string][];
}

/** Reads an action off a stored row, ignoring kinds this version does not know. */
export function gameActionFrom(kind: string, payload: Record<string, unknown>): GameAction | undefined {
  if (kind === MARK_ATTENDANCE) {
    return {
      kind: MARK_ATTENDANCE,
      fromRound: Number(payload.fromRound ?? 1),
      presentPlayerIds: (payload.presentPlayerIds as string[] | undefined) ?? [],
    };
  }

  if (kind === USE_LINEUP) {
    return {
      kind: USE_LINEUP,
      round: Number(payload.round ?? 1),
      lineup: payload.lineup as StartingLineup,
    };
  }

  if (kind === SWAP) {
    return {
      kind: SWAP,
      round: Number(payload.round ?? 1),
      screen: (payload.screen as RoundScreen | undefined) ?? 'PLAN',
      playerIds: payload.playerIds as [string, string],
    };
  }

  return undefined;
}

export function payloadOf(action: GameAction): Record<string, unknown> {
  if (action.kind === MARK_ATTENDANCE) {
    return { fromRound: action.fromRound, presentPlayerIds: action.presentPlayerIds };
  }
  if (action.kind === SWAP) {
    return { round: action.round, screen: action.screen, playerIds: action.playerIds };
  }

  return { round: action.round, lineup: action.lineup };
}

/**
 * The only thing a game knows about itself. Nothing derived is ever stored, so this runs on
 * every read and can never disagree with the log it came from.
 */
export function projectGame(snapshot: GameSnapshot, actions: readonly GameAction[]): GameState {
  const everyone = snapshot.roster.map((player) => player.id);

  return actions.reduce<GameState>((state, action) => {
    if (action.kind === MARK_ATTENDANCE) {
      return {
        ...state,
        attendanceConfirmed: true,
        presentPlayerIds: everyone.filter((id) => action.presentPlayerIds.includes(id)),
        plannedRound: state.currentRound === undefined ? 1 : state.plannedRound,
        plannedSwaps: [],
      };
    }

    if (action.kind === SWAP) {
      return action.round === state.plannedRound && action.screen === 'PLAN'
        ? { ...state, plannedSwaps: [...state.plannedSwaps, action.playerIds] }
        : state;
    }

    if (action.kind === USE_LINEUP) {
      return {
        ...state,
        lifecycle: 'LIVE',
        currentRound: action.round,
        plannedRound: undefined,
        plannedSwaps: [],
        rounds: [
          ...state.rounds.filter((round) => round.round !== action.round),
          { round: action.round, startingLineup: afterSwaps(action.lineup, state.plannedSwaps) },
        ],
      };
    }

    return state;
  }, {
    lifecycle: 'SETUP',
    attendanceConfirmed: false,
    presentPlayerIds: everyone,
    rounds: [],
    plannedSwaps: [],
  });
}

export function roundOf(state: GameState, round: number): Round | undefined {
  return state.rounds.find((played) => played.round === round);
}

/**
 * What the engine offers for the round being planned. A suggestion is derived from the log
 * rather than stored, so reading a plan twice offers the same lineup both times.
 */
export function planRound(snapshot: GameSnapshot, state: GameState): Round {
  if (state.plannedRound === undefined) {
    throw new Error(state.attendanceConfirmed ? 'No round is being planned.' : 'Nobody has been marked present yet.');
  }

  return {
    round: state.plannedRound,
    startingLineup: afterSwaps(suggestFirstRound(snapshot, state.presentPlayerIds), state.plannedSwaps),
  };
}

/**
 * The coach trading two players around the plan. The engine's rules bind the engine rather
 * than the coach, so the only players refused are ones who are not playing in this game.
 */
export function swapPlayers(state: GameState, playerIds: [string, string]): SwapAction {
  if (state.plannedRound === undefined) throw new Error('No round is being planned.');

  const [one, another] = playerIds;
  if (one === another) throw new Error('A player cannot swap with themselves.');
  if (![one, another].every((playerId) => state.presentPlayerIds.includes(playerId))) {
    throw new Error('That player is not playing in this game.');
  }

  return { kind: SWAP, round: state.plannedRound, screen: 'PLAN', playerIds };
}

/**
 * The coach taking the plan onto the field. The action carries the lineup the engine offered;
 * the swaps already in the log are what make the round begin as the coach arranged it.
 */
export function useLineup(snapshot: GameSnapshot, state: GameState): UseLineupAction {
  if (state.plannedRound === undefined) {
    throw new Error(state.attendanceConfirmed ? 'No round is being planned.' : 'Nobody has been marked present yet.');
  }

  return {
    kind: USE_LINEUP,
    round: state.plannedRound,
    lineup: suggestFirstRound(snapshot, state.presentPlayerIds),
  };
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
