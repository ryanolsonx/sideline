import { describe, expect, it } from 'vitest';
import { lineupPlayerIds, outPlayerIds, suggestFirstRound } from './lineup';
import { shuffledBySeed } from './rotation';

function snapshotFor(playerCount: number, formation = { defender: 2, forward: 2 }, rotationSeed = 'seed-1') {
  return {
    roster: Array.from({ length: playerCount }, (_, index) => ({
      id: `player-${index + 1}`,
      name: `Player ${index + 1}`,
    })),
    formation,
    rotationSeed,
  };
}

const everyone = (playerCount: number) =>
  Array.from({ length: playerCount }, (_, index) => `player-${index + 1}`);

describe('suggestFirstRound', () => {
  it('fills the formation exactly', () => {
    const lineup = suggestFirstRound(snapshotFor(6), everyone(6));

    expect(lineup.goalie).toHaveLength(1);
    expect(lineup.defenders).toHaveLength(2);
    expect(lineup.forwards).toHaveLength(2);
  });

  it('gives nobody two positions in the same round', () => {
    const picked = lineupPlayerIds(suggestFirstRound(snapshotFor(6), everyone(6)));

    expect(new Set(picked).size).toBe(picked.length);
  });

  it('picks only players who turned up', () => {
    const here = ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'];

    const picked = lineupPlayerIds(suggestFirstRound(snapshotFor(6), here));

    expect(picked.every((id) => here.includes(id))).toBe(true);
  });

  it('sits the players the formation has no room for', () => {
    const lineup = suggestFirstRound(snapshotFor(7), everyone(7));

    expect(outPlayerIds(lineup, everyone(7))).toHaveLength(2);
  });

  it('plays a short-handed game rather than refusing it', () => {
    const lineup = suggestFirstRound(snapshotFor(6), ['player-1', 'player-2', 'player-3']);

    expect(lineup.goalie).toHaveLength(1);
    expect(lineup.defenders).toHaveLength(2);
    expect(lineup.forwards).toHaveLength(0);
  });

  it('leaves goal filled first when only one player turned up', () => {
    const lineup = suggestFirstRound(snapshotFor(6), ['player-1']);

    expect(lineup.goalie).toEqual(['player-1']);
    expect(lineup.defenders).toEqual([]);
    expect(lineup.forwards).toEqual([]);
  });

  it('answers the same way every time it is asked', () => {
    const first = suggestFirstRound(snapshotFor(6), everyone(6));
    const second = suggestFirstRound(snapshotFor(6), everyone(6));

    expect(first).toEqual(second);
  });

  it('opens differently for a game with a different seed', () => {
    const one = suggestFirstRound(snapshotFor(9, { defender: 2, forward: 2 }, 'seed-a'), everyone(9));
    const other = suggestFirstRound(snapshotFor(9, { defender: 2, forward: 2 }, 'seed-b'), everyone(9));

    expect(one).not.toEqual(other);
  });
});

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
