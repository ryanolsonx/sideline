import { describe, expect, it } from 'vitest';
import {
  GameAction,
  MARK_ATTENDANCE,
  USE_LINEUP,
  gameActionFrom,
  markAttendance,
  payloadOf,
  projectGame,
  roundOf,
  planRound,
  startingSnapshot,
  useLineup,
} from './game.model';

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

const snapshot = {
  roster: [
    { id: 'player-1', name: 'Avery' },
    { id: 'player-2', name: 'Jordan' },
    { id: 'player-3', name: 'Riley' },
  ],
  formation: { defender: 2, forward: 2 },
  rotationSeed: 'seed-1',
};

describe('projectGame', () => {
  it('starts every player participating, so the coach unticks the no-shows', () => {
    expect(projectGame(snapshot, [])).toEqual({
      lifecycle: 'SETUP',
      attendanceConfirmed: false,
      presentPlayerIds: ['player-1', 'player-2', 'player-3'],
      rounds: [],
    });
  });

  it('takes the latest confirmed list as who is here', () => {
    const state = projectGame(snapshot, [
      { kind: MARK_ATTENDANCE, fromRound: 1, presentPlayerIds: ['player-1'] },
      { kind: MARK_ATTENDANCE, fromRound: 1, presentPlayerIds: ['player-1', 'player-2'] },
    ]);

    expect(state.presentPlayerIds).toEqual(['player-1', 'player-2']);
    expect(state.attendanceConfirmed).toBe(true);
  });

  it('reads a game whose log holds an action kind it does not know', () => {
    expect(gameActionFrom('SOMETHING_LATER', {})).toBeUndefined();
  });
});

describe('markAttendance', () => {
  const setup = projectGame(snapshot, []);

  it('writes one action carrying the whole list', () => {
    const action = markAttendance(snapshot, setup, ['player-1', 'player-3']);

    expect(payloadOf(action)).toEqual({ fromRound: 1, presentPlayerIds: ['player-1', 'player-3'] });
  });

  it('keeps the list in roster order however the coach ticked it', () => {
    const action = markAttendance(snapshot, setup, ['player-3', 'player-1']);

    expect(action.presentPlayerIds).toEqual(['player-1', 'player-3']);
  });

  it('records a game nobody turned up to rather than refusing it', () => {
    expect(markAttendance(snapshot, setup, []).presentPlayerIds).toEqual([]);
  });

  it('refuses a player who is not in this game', () => {
    expect(() => markAttendance(snapshot, setup, ['player-9']))
      .toThrow('That player is not in this game.');
  });

  it('survives a round trip through the stored row', () => {
    const action = markAttendance(snapshot, setup, ['player-2']);

    expect(gameActionFrom(action.kind, payloadOf(action))).toEqual(action);
  });
});

const attendance: GameAction = {
  kind: MARK_ATTENDANCE,
  fromRound: 1,
  presentPlayerIds: ['player-1', 'player-2', 'player-3'],
};

describe('planRound', () => {
  const confirmed = projectGame(snapshot, [attendance]);

  it('plans round one once the coach has said who is here', () => {
    expect(confirmed.plannedRound).toBe(1);
    expect(planRound(snapshot, confirmed).round).toBe(1);
  });

  it('leaves the game off the field while a round is only planned', () => {
    expect(confirmed.lifecycle).toBe('SETUP');
    expect(confirmed.currentRound).toBeUndefined();
    expect(confirmed.rounds).toEqual([]);
  });

  it('picks only players who turned up', () => {
    const here = projectGame(snapshot, [{ ...attendance, presentPlayerIds: ['player-1', 'player-2'] }]);

    const { startingLineup } = planRound(snapshot, here);

    expect([...startingLineup.goalie, ...startingLineup.defenders, ...startingLineup.forwards].sort())
      .toEqual(['player-1', 'player-2']);
  });

  it('offers the same lineup every time the plan is read', () => {
    expect(planRound(snapshot, confirmed)).toEqual(planRound(snapshot, confirmed));
  });

  it('will not plan a round for a game nobody has been marked present for', () => {
    expect(() => planRound(snapshot, projectGame(snapshot, [])))
      .toThrow('Nobody has been marked present yet.');
  });
});

describe('useLineup', () => {
  const confirmed = projectGame(snapshot, [attendance]);

  it('puts the planned round on the field', () => {
    const action = useLineup(snapshot, confirmed);
    const state = projectGame(snapshot, [attendance, action]);

    expect(state.lifecycle).toBe('LIVE');
    expect(state.currentRound).toBe(1);
    expect(roundOf(state, 1)?.startingLineup).toEqual(planRound(snapshot, confirmed).startingLineup);
  });

  it('leaves no round planned once the lineup is on the field', () => {
    const state = projectGame(snapshot, [attendance, useLineup(snapshot, confirmed)]);

    expect(state.plannedRound).toBeUndefined();
    expect(() => useLineup(snapshot, state)).toThrow('No round is being planned.');
  });

  it('survives a round trip through the stored row', () => {
    const action = useLineup(snapshot, confirmed);

    expect(gameActionFrom(action.kind, payloadOf(action))).toEqual(action);
  });

  it('keeps the round it began with rather than planning it again', () => {
    const action = useLineup(snapshot, confirmed);
    const reread = projectGame(snapshot, [
      attendance,
      { kind: USE_LINEUP, round: 1, lineup: action.lineup },
    ]);

    expect(roundOf(reread, 1)?.startingLineup).toEqual(action.lineup);
  });
});
