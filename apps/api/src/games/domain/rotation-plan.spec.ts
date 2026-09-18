import { describe, expect, it } from 'vitest';
import { GameState, MARK_ATTENDANCE, USE_LINEUP, projectGame } from './game.model';
import { StartingLineup, lineupPlayerIds, outPlayerIds } from './lineup';
import { suggestRound } from './rotation-plan';
import { standingOf, standingsOf } from './standings';

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

/** Plays a game forward by always taking what the engine offers. */
function playRounds(snapshot: ReturnType<typeof snapshotFor>, present: string[], roundCount: number) {
  const lineups: StartingLineup[] = [];
  let state: GameState = projectGame(snapshot, [
    { kind: MARK_ATTENDANCE, fromRound: 1, presentPlayerIds: present },
  ]);

  for (let round = 1; round <= roundCount; round += 1) {
    const lineup = suggestRound(snapshot, present, standingsOf(state, present), round);
    lineups.push(lineup);
    state = projectGame(snapshot, [
      { kind: MARK_ATTENDANCE, fromRound: 1, presentPlayerIds: present },
      ...lineups.map((played, index) => ({ kind: USE_LINEUP as typeof USE_LINEUP, round: index + 1, lineup: played })),
    ]);
  }

  return { lineups, state };
}

describe('suggestRound', () => {
  it('fills the formation exactly', () => {
    const snapshot = snapshotFor(6);
    const { lineups } = playRounds(snapshot, everyone(6), 2);

    for (const lineup of lineups) {
      expect(lineup.goalie).toHaveLength(1);
      expect(lineup.defenders).toHaveLength(2);
      expect(lineup.forwards).toHaveLength(2);
      expect(new Set(lineupPlayerIds(lineup)).size).toBe(5);
    }
  });

  it('never sits a player two rounds running', () => {
    const snapshot = snapshotFor(7);
    const { lineups } = playRounds(snapshot, everyone(7), 8);

    lineups.forEach((lineup, index) => {
      if (index === 0) return;
      const satBefore = everyone(7).filter((id) => !lineupPlayerIds(lineups[index - 1]).includes(id));
      const satNow = everyone(7).filter((id) => !lineupPlayerIds(lineup).includes(id));
      expect(satNow.filter((id) => satBefore.includes(id))).toEqual([]);
    });
  });

  it('keeps playing time as level as the formation allows', () => {
    const snapshot = snapshotFor(7);
    const { state } = playRounds(snapshot, everyone(7), 8);
    const played = standingsOf(state, everyone(7)).map((standing) => standing.roundsPlayed);

    expect(Math.max(...played) - Math.min(...played)).toBeLessThanOrEqual(1);
  });

  it('empties the goalie pool before anyone keeps goal twice', () => {
    const snapshot = snapshotFor(6);
    const { state } = playRounds(snapshot, everyone(6), 6);
    const kept = standingsOf(state, everyone(6)).map((standing) => standing.goalieRounds);

    expect(kept.filter((rounds) => rounds === 0)).toEqual([]);
    expect(Math.max(...kept)).toBe(1);
  });

  it('does not hand a player the same rationed position two rounds running', () => {
    const snapshot = snapshotFor(7);
    const { lineups } = playRounds(snapshot, everyone(7), 8);

    lineups.forEach((lineup, index) => {
      if (index === 0) return;
      expect(lineup.goalie).not.toEqual(lineups[index - 1].goalie);
      expect(lineup.defenders.filter((id) => lineups[index - 1].defenders.includes(id))).toEqual([]);
    });
  });

  it('spreads defender the way it spreads goalie', () => {
    const snapshot = snapshotFor(7);
    const { state } = playRounds(snapshot, everyone(7), 8);
    const defended = standingsOf(state, everyone(7)).map((standing) => standing.defenderRounds);

    expect(Math.max(...defended) - Math.min(...defended)).toBeLessThanOrEqual(1);
  });

  it('prefers the player who is owed time among equals in the ration', () => {
    const snapshot = snapshotFor(7, { defender: 2, forward: 2 });
    const { state, lineups } = playRounds(snapshot, everyone(7), 1);
    const owed = standingsOf(state, everyone(7))
      .filter((standing) => standing.roundsPlayed === 0)
      .map((standing) => standing.playerId);

    const next = suggestRound(snapshot, everyone(7), standingsOf(state, everyone(7)), 2);

    expect(lineupPlayerIds(next)).toEqual(expect.arrayContaining(owed));
  });

  it('answers the same way every time it is asked', () => {
    const snapshot = snapshotFor(7);
    const { state } = playRounds(snapshot, everyone(7), 3);
    const standings = standingsOf(state, everyone(7));

    expect(suggestRound(snapshot, everyone(7), standings, 4))
      .toEqual(suggestRound(snapshot, everyone(7), standings, 4));
  });

  it('opens two games with the same roster differently', () => {
    const here = everyone(7);
    const one = suggestRound(snapshotFor(7, { defender: 2, forward: 2 }, 'seed-1'), here, standingsOf(projectGame(snapshotFor(7), []), here), 1);
    const another = suggestRound(snapshotFor(7, { defender: 2, forward: 2 }, 'seed-2'), here, standingsOf(projectGame(snapshotFor(7), []), here), 1);

    expect(one).not.toEqual(another);
  });

  it('sits the players the formation has no room for', () => {
    const snapshot = snapshotFor(7);
    const { lineups } = playRounds(snapshot, everyone(7), 1);

    expect(outPlayerIds(lineups[0], everyone(7))).toHaveLength(2);
  });

  it('leaves goal filled first when only one player turned up', () => {
    const snapshot = snapshotFor(6);
    const { lineups } = playRounds(snapshot, ['player-1'], 1);

    expect(lineups[0]).toEqual({ goalie: ['player-1'], defenders: [], forwards: [] });
  });

  it('plays a short-handed side rather than refusing it', () => {
    const snapshot = snapshotFor(6);
    const here = ['player-1', 'player-2', 'player-3', 'player-4'];
    const { lineups } = playRounds(snapshot, here, 2);

    for (const lineup of lineups) {
      expect(lineup.goalie).toHaveLength(1);
      expect(lineup.defenders).toHaveLength(2);
      expect(lineup.forwards).toHaveLength(1);
    }
  });

  it('sits nobody when the side is short', () => {
    const snapshot = snapshotFor(6);
    const here = ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'];
    const { lineups } = playRounds(snapshot, here, 3);

    for (const lineup of lineups) {
      expect(lineupPlayerIds(lineup).sort()).toEqual([...here].sort());
    }
  });

  it('plans from what happened, not from what it once suggested', () => {
    const snapshot = snapshotFor(6);
    const coachsOwn: StartingLineup = {
      goalie: ['player-6'],
      defenders: ['player-5', 'player-4'],
      forwards: ['player-3', 'player-2'],
    };
    const state = projectGame(snapshot, [
      { kind: MARK_ATTENDANCE, fromRound: 1, presentPlayerIds: everyone(6) },
      { kind: USE_LINEUP, round: 1, lineup: coachsOwn },
    ]);

    const next = suggestRound(snapshot, everyone(6), standingsOf(state, everyone(6)), 2);

    expect(next.goalie).not.toEqual(['player-6']);
    expect(lineupPlayerIds(next)).toContain('player-1');
    expect(standingOf(standingsOf(state, everyone(6)), 'player-1').roundsPlayed).toBe(0);
  });
});
