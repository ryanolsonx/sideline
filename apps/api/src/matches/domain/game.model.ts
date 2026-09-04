export type FieldSize = 5 | 6;
export type AssignmentStatus = 'PLAYING' | 'OUT';
export type Position = 'GOALIE' | 'DEFENDER' | 'FORWARD';

export interface GamePlayer {
  id: string;
  name: string;
}

export interface PlannedAssignment {
  playerId: string;
  status: AssignmentStatus;
  position: Position | null;
}

export interface PlannedRound {
  number: number;
  assignments: PlannedAssignment[];
}

export function positionsFor(playerCount: number, fieldSize: FieldSize): Position[] {
  if (playerCount <= 0) return [];
  if (playerCount === 1) return ['GOALIE'];
  if (playerCount === 2) return ['GOALIE', 'FORWARD'];
  if (playerCount === 3) return ['GOALIE', 'DEFENDER', 'FORWARD'];
  if (playerCount === 4) return ['GOALIE', 'DEFENDER', 'FORWARD', 'FORWARD'];
  if (playerCount === 5 && fieldSize === 5) return ['GOALIE', 'DEFENDER', 'FORWARD', 'FORWARD', 'FORWARD'];
  if (playerCount === 5) return ['GOALIE', 'DEFENDER', 'DEFENDER', 'FORWARD', 'FORWARD'];
  return ['GOALIE', 'DEFENDER', 'DEFENDER', 'FORWARD', 'FORWARD', 'FORWARD'];
}

function rotate<T>(items: T[], offset: number): T[] {
  const start = offset % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

export function buildGamePlan(presentPlayers: GamePlayer[], fieldSize: FieldSize): PlannedRound[] {
  if (presentPlayers.length < 3) throw new Error('At least three players must be present.');

  const playersOnField = Math.min(fieldSize, presentPlayers.length);
  const positions = positionsFor(playersOnField, fieldSize);

  return Array.from({ length: 8 }, (_, index) => {
    const rotatedPlayers = rotate(presentPlayers, index);
    const playingPlayers = rotatedPlayers.slice(0, playersOnField);
    const positionOrder = rotate(positions, index);
    const assignments = presentPlayers.map((player) => {
      const playingIndex = playingPlayers.findIndex((playingPlayer) => playingPlayer.id === player.id);
      return playingIndex === -1
        ? { playerId: player.id, status: 'OUT' as const, position: null }
        : { playerId: player.id, status: 'PLAYING' as const, position: positionOrder[playingIndex] };
    });

    return { number: index + 1, assignments };
  });
}
