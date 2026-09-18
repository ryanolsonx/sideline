import { describe, expect, it } from 'vitest';
import { GameState, MARK_ATTENDANCE, USE_LINEUP, projectGame } from './game.model';
import { standingOf, standingsOf } from './standings';

const snapshot = {
  roster: [
    { id: 'player-1', name: 'Avery' },
    { id: 'player-2', name: 'Jordan' },
    { id: 'player-3', name: 'Riley' },
    { id: 'player-4', name: 'Sam' },
  ],
  formation: { defender: 1, forward: 1 },
  rotationSeed: 'seed-1',
};

const everyone = snapshot.roster.map((player) => player.id);

function gameAfter(rounds: { goalie: string[]; defenders: string[]; forwards: string[] }[]): GameState {
  return projectGame(snapshot, [
    { kind: MARK_ATTENDANCE, fromRound: 1, presentPlayerIds: everyone },
    ...rounds.map((lineup, index) => ({ kind: USE_LINEUP as typeof USE_LINEUP, round: index + 1, lineup })),
  ]);
}

describe('standingsOf', () => {
  it('starts everyone level', () => {
    const [avery] = standingsOf(gameAfter([]), everyone);

    expect(avery).toEqual({
      playerId: 'player-1',
      roundsPlayed: 0,
      goalieRounds: 0,
      defenderRounds: 0,
      playedStreak: 0,
      playedLastRound: false,
      heldLastRound: undefined,
    });
  });

  it('counts a round played whatever position it was played at', () => {
    const standings = standingsOf(gameAfter([
      { goalie: ['player-1'], defenders: ['player-2'], forwards: ['player-3'] },
      { goalie: ['player-2'], defenders: ['player-3'], forwards: ['player-1'] },
    ]), everyone);

    expect(standingOf(standings, 'player-1').roundsPlayed).toBe(2);
    expect(standingOf(standings, 'player-4').roundsPlayed).toBe(0);
  });

  it('counts the rationed positions separately', () => {
    const standings = standingsOf(gameAfter([
      { goalie: ['player-1'], defenders: ['player-2'], forwards: ['player-3'] },
      { goalie: ['player-2'], defenders: ['player-1'], forwards: ['player-4'] },
    ]), everyone);

    expect(standingOf(standings, 'player-1')).toMatchObject({ goalieRounds: 1, defenderRounds: 1 });
    expect(standingOf(standings, 'player-2')).toMatchObject({ goalieRounds: 1, defenderRounds: 1 });
    expect(standingOf(standings, 'player-3')).toMatchObject({ goalieRounds: 0, defenderRounds: 0 });
  });

  it('says what each player held in the round just played', () => {
    const standings = standingsOf(gameAfter([
      { goalie: ['player-1'], defenders: ['player-2'], forwards: ['player-3'] },
      { goalie: ['player-2'], defenders: ['player-3'], forwards: ['player-4'] },
    ]), everyone);

    expect(standingOf(standings, 'player-2').heldLastRound).toBe('GOALIE');
    expect(standingOf(standings, 'player-1')).toMatchObject({
      heldLastRound: undefined,
      playedLastRound: false,
    });
  });

  it('counts an unbroken run of rounds played, broken by any round out', () => {
    const standings = standingsOf(gameAfter([
      { goalie: ['player-1'], defenders: ['player-2'], forwards: ['player-3'] },
      { goalie: ['player-2'], defenders: ['player-3'], forwards: ['player-4'] },
      { goalie: ['player-1'], defenders: ['player-2'], forwards: ['player-3'] },
    ]), everyone);

    expect(standingOf(standings, 'player-3').playedStreak).toBe(3);
    expect(standingOf(standings, 'player-1').playedStreak).toBe(1);
  });

  it('reads the rounds in the order they were played, however the log arrived', () => {
    const state = projectGame(snapshot, [
      { kind: MARK_ATTENDANCE, fromRound: 1, presentPlayerIds: everyone },
      { kind: USE_LINEUP, round: 1, lineup: { goalie: ['player-1'], defenders: ['player-2'], forwards: ['player-3'] } },
      { kind: USE_LINEUP, round: 1, lineup: { goalie: ['player-4'], defenders: ['player-2'], forwards: ['player-3'] } },
    ]);

    expect(standingOf(standingsOf(state, everyone), 'player-4').roundsPlayed).toBe(1);
    expect(standingOf(standingsOf(state, everyone), 'player-1').roundsPlayed).toBe(0);
  });

  it('will not answer for someone who is not playing', () => {
    expect(() => standingOf(standingsOf(gameAfter([]), everyone), 'player-9'))
      .toThrow('That player is not playing in this game.');
  });
});
