export const outfieldPositions = ['GOALIE', 'DEFENDER', 'FORWARD'] as const;

export type Position = (typeof outfieldPositions)[number];

export const positionNames: Record<Position, string> = {
  GOALIE: 'Goalie',
  DEFENDER: 'Defenders',
  FORWARD: 'Forwards',
};
