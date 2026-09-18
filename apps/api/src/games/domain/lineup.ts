export type Position = 'GOALIE' | 'DEFENDER' | 'FORWARD';

/**
 * Who occupied which position. Two players at the same position are at the same position,
 * so each is a list rather than numbered places. A short-handed game fills goalie first,
 * then defenders, then forwards, and the slots left over simply stand empty.
 */
export interface StartingLineup {
  goalie: string[];
  defenders: string[];
  forwards: string[];
}

export function lineupPlayerIds(lineup: StartingLineup): string[] {
  return [...lineup.goalie, ...lineup.defenders, ...lineup.forwards];
}

export function outPlayerIds(lineup: StartingLineup, participating: readonly string[]): string[] {
  const onField = lineupPlayerIds(lineup);
  return participating.filter((id) => !onField.includes(id));
}
