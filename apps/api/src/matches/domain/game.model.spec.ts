import { describe, expect, it } from 'vitest';
import { buildGamePlan } from './game.model';

const players = ['Avery', 'Jordan', 'Sam', 'Taylor', 'Casey', 'Riley', 'Morgan'].map((name, index) => ({
  id: `player-${index + 1}`,
  name,
}));

describe('buildGamePlan', () => {
  it('creates eight six-on-six rounds with a rotating bench', () => {
    const plan = buildGamePlan(players, 6);

    expect(plan).toHaveLength(8);
    expect(plan[0].assignments.filter((assignment) => assignment.status === 'PLAYING')).toHaveLength(6);
    expect(plan[0].assignments.filter((assignment) => assignment.status === 'OUT')).toHaveLength(1);
    expect(plan[0].assignments.filter((assignment) => assignment.position === 'GOALIE')).toHaveLength(1);
    expect(plan[0].assignments.filter((assignment) => assignment.position === 'DEFENDER')).toHaveLength(2);
    expect(plan[0].assignments.filter((assignment) => assignment.position === 'FORWARD')).toHaveLength(3);
  });

  it('keeps play time within one round across an eight-round game', () => {
    const plan = buildGamePlan(players, 6);
    const appearances = new Map(players.map((player) => [player.id, 0]));

    plan.flatMap((round) => round.assignments)
      .filter((assignment) => assignment.status === 'PLAYING')
      .forEach((assignment) => appearances.set(assignment.playerId, (appearances.get(assignment.playerId) ?? 0) + 1));

    expect([...appearances.values()]).toEqual([7, 7, 7, 7, 7, 7, 6]);
  });

  it('uses the five-on-five formation when five or more players are present', () => {
    const plan = buildGamePlan(players.slice(0, 5), 5);
    const positions = plan[0].assignments.map((assignment) => assignment.position);

    expect(positions).toEqual(expect.arrayContaining(['GOALIE', 'DEFENDER', 'FORWARD', 'FORWARD', 'FORWARD']));
  });

  it('requires at least three present players', () => {
    expect(() => buildGamePlan(players.slice(0, 2), 6)).toThrow('At least three players must be present.');
  });
});
