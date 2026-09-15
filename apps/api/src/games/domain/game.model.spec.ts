import { describe, expect, it } from 'vitest';
import { startingSnapshot } from './game.model';

const team = {
  players: [
    { id: 'player-1', name: 'Avery' },
    { id: 'player-2', name: 'Jordan' },
  ],
  formation: { defender: 1, forward: 3 },
};

describe('startingSnapshot', () => {
  it('copies the roster and the formation onto the game', () => {
    expect(startingSnapshot(team, 'seed-1')).toEqual({
      roster: [
        { id: 'player-1', name: 'Avery' },
        { id: 'player-2', name: 'Jordan' },
      ],
      formation: { defender: 1, forward: 3 },
      rotationSeed: 'seed-1',
    });
  });

  it('leaves the game unchanged when the team roster changes afterwards', () => {
    const snapshot = startingSnapshot(team, 'seed-1');

    team.players.push({ id: 'player-3', name: 'Morgan' });

    expect(snapshot.roster).toHaveLength(2);
  });

  it('refuses to start a game for a team with nobody on it', () => {
    expect(() => startingSnapshot({ players: [], formation: { defender: 2, forward: 2 } }, 'seed-1'))
      .toThrow('A game needs at least one player.');
  });
});
