import { describe, expect, it } from 'vitest';
import { lineupPlayerIds, outPlayerIds } from './lineup';
import { shuffledBySeed } from './rotation';

const everyone = (playerCount: number) =>
  Array.from({ length: playerCount }, (_, index) => `player-${index + 1}`);

describe('shuffledBySeed', () => {
  it('keeps everyone it was given', () => {
    expect(shuffledBySeed(everyone(9), 'seed-1').sort()).toEqual(everyone(9).sort());
  });

  it('leaves the caller’s list alone', () => {
    const players = everyone(6);

    shuffledBySeed(players, 'seed-1');

    expect(players).toEqual(everyone(6));
  });
});

describe('a lineup', () => {
  it('reads out in the order goalie, defenders, forwards', () => {
    expect(lineupPlayerIds({ goalie: ['player-1'], defenders: ['player-2'], forwards: ['player-3'] }))
      .toEqual(['player-1', 'player-2', 'player-3']);
  });

  it('leaves out anyone here who is not on the field', () => {
    const lineup = { goalie: ['player-1'], defenders: ['player-2'], forwards: [] };

    expect(outPlayerIds(lineup, everyone(4))).toEqual(['player-3', 'player-4']);
  });
});
