import { describe, expect, it, vi } from 'vitest';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { GameRepository } from '../db/game.repository';
import { GameService } from './game.service';
import { TeamService } from '../../teams/service/team.service';

const team = {
  id: 'team-1',
  coachUsername: 'river coach',
  name: 'Salt Lake Strikers',
  players: [
    { id: 'player-1', name: 'Avery' },
    { id: 'player-2', name: 'Jordan' },
  ],
  formation: { defender: 1, forward: 3 },
  createdAt: new Date(),
};

const game = {
  id: 'game-1',
  teamId: 'team-1',
  roster: team.players,
  formation: team.formation,
  rotationSeed: 'seed-1',
  startedAt: new Date(),
};

function serviceFor(teams: Partial<TeamService>, games: Partial<GameRepository> = {}) {
  return new GameService(
    { findActions: vi.fn().mockResolvedValue([]), ...games } as unknown as GameRepository,
    teams as TeamService,
  );
}

describe('GameService', () => {
  it('starts a game from a copy of the team', async () => {
    const create = vi.fn().mockResolvedValue(game);
    const service = serviceFor({ findById: vi.fn().mockResolvedValue(team) }, { create });

    await service.startGameForCoach(' River  Coach ', 'team-1');

    expect(create).toHaveBeenCalledWith('team-1', {
      roster: [
        { id: 'player-1', name: 'Avery' },
        { id: 'player-2', name: 'Jordan' },
      ],
      formation: { defender: 1, forward: 3 },
      rotationSeed: expect.any(String),
    });
  });

  it('gives each game its own rotation seed', async () => {
    const create = vi.fn().mockResolvedValue(game);
    const service = serviceFor({ findById: vi.fn().mockResolvedValue(team) }, { create });

    await service.startGameForCoach('river coach', 'team-1');
    await service.startGameForCoach('river coach', 'team-1');

    const [first, second] = create.mock.calls.map(([, snapshot]) => snapshot.rotationSeed);
    expect(first).not.toEqual(second);
  });

  it('refuses a game for a team with nobody on it as a bad request', async () => {
    const service = serviceFor({ findById: vi.fn().mockResolvedValue({ ...team, players: [] }) });

    await expect(service.startGameForCoach('river coach', 'team-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('refuses a player who is not in the game as a bad request', async () => {
    const service = serviceFor(
      { findById: vi.fn().mockResolvedValue(team) },
      { findById: vi.fn().mockResolvedValue(game), append: vi.fn() },
    );

    await expect(
      service.markAttendanceForCoach('river coach', 'game-1', ['player-9']),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('opens a new game with everyone participating', async () => {
    const service = serviceFor(
      { findById: vi.fn().mockResolvedValue(team) },
      { create: vi.fn().mockResolvedValue(game) },
    );

    const { state } = await service.startGameForCoach('river coach', 'team-1');

    expect(state).toEqual({
      lifecycle: 'SETUP',
      attendanceConfirmed: false,
      presentPlayerIds: ['player-1', 'player-2'],
      rounds: [],
      plannedSwaps: [],
    });
  });

  it('cannot start a game for a team that does not exist', async () => {
    const service = serviceFor({ findById: vi.fn().mockResolvedValue(null) });

    await expect(service.startGameForCoach('river coach', 'team-9')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('cannot start a game for another coach’s team', async () => {
    const service = serviceFor({ findById: vi.fn().mockResolvedValue(team) });

    await expect(service.startGameForCoach('hill coach', 'team-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('appends one action for a whole confirmed list', async () => {
    const append = vi.fn().mockResolvedValue({});
    const service = serviceFor(
      { findById: vi.fn().mockResolvedValue(team) },
      { findById: vi.fn().mockResolvedValue(game), append },
    );

    await service.markAttendanceForCoach('river coach', 'game-1', ['player-2']);

    expect(append).toHaveBeenCalledTimes(1);
    expect(append).toHaveBeenCalledWith('game-1', [
      { kind: 'MARK_ATTENDANCE', payload: { fromRound: 1, presentPlayerIds: ['player-2'] } },
    ]);
  });

  it('reads a game back from its log', async () => {
    const service = serviceFor(
      { findById: vi.fn().mockResolvedValue(team) },
      {
        findById: vi.fn().mockResolvedValue(game),
        findActions: vi.fn().mockResolvedValue([
          { kind: 'MARK_ATTENDANCE', payload: { fromRound: 1, presentPlayerIds: ['player-2'] } },
        ]),
      },
    );

    const { state } = await service.findForCoach('river coach', 'game-1');

    expect(state).toEqual({
      lifecycle: 'SETUP',
      attendanceConfirmed: true,
      presentPlayerIds: ['player-2'],
      rounds: [],
      plannedRound: 1,
      plannedSwaps: [],
    });
  });

  it('offers the planned round to a coach who has said who is here', async () => {
    const service = serviceFor(
      { findById: vi.fn().mockResolvedValue(team) },
      {
        findById: vi.fn().mockResolvedValue(game),
        findActions: vi.fn().mockResolvedValue([
          { kind: 'MARK_ATTENDANCE', payload: { fromRound: 1, presentPlayerIds: ['player-1', 'player-2'] } },
        ]),
      },
    );

    const { plan } = await service.findForCoach('river coach', 'game-1');

    expect(plan?.round).toBe(1);
    expect([...plan!.startingLineup.goalie, ...plan!.startingLineup.defenders].sort())
      .toEqual(['player-1', 'player-2']);
  });

  it('records the planned lineup as what the round began with', async () => {
    const append = vi.fn().mockResolvedValue([]);
    const service = serviceFor(
      { findById: vi.fn().mockResolvedValue(team) },
      {
        findById: vi.fn().mockResolvedValue(game),
        append,
        findActions: vi.fn().mockResolvedValue([
          { kind: 'MARK_ATTENDANCE', payload: { fromRound: 1, presentPlayerIds: ['player-1', 'player-2'] } },
        ]),
      },
    );

    await service.useLineupForCoach('river coach', 'game-1');

    expect(append).toHaveBeenCalledTimes(1);
    const [, entries] = append.mock.calls[0];
    expect(entries.map((entry: { kind: string }) => entry.kind)).toEqual(['USE_LINEUP']);
    expect(entries[0].payload.round).toBe(1);
  });

  it('records a swap against the round being planned', async () => {
    const append = vi.fn().mockResolvedValue([]);
    const service = serviceFor(
      { findById: vi.fn().mockResolvedValue(team) },
      {
        findById: vi.fn().mockResolvedValue(game),
        append,
        findActions: vi.fn().mockResolvedValue([
          { kind: 'MARK_ATTENDANCE', payload: { fromRound: 1, presentPlayerIds: ['player-1', 'player-2'] } },
        ]),
      },
    );

    await service.swapPlayersForCoach('river coach', 'game-1', ['player-1', 'player-2']);

    expect(append).toHaveBeenCalledWith('game-1', [
      { kind: 'SWAP', payload: { round: 1, screen: 'PLAN', playerIds: ['player-1', 'player-2'] } },
    ]);
  });

  it('refuses a swap with somebody who is not in the game', async () => {
    const service = serviceFor(
      { findById: vi.fn().mockResolvedValue(team) },
      {
        findById: vi.fn().mockResolvedValue(game),
        append: vi.fn(),
        findActions: vi.fn().mockResolvedValue([
          { kind: 'MARK_ATTENDANCE', payload: { fromRound: 1, presentPlayerIds: ['player-1', 'player-2'] } },
        ]),
      },
    );

    await expect(service.swapPlayersForCoach('river coach', 'game-1', ['player-1', 'player-9']))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('records a reset against the round being planned', async () => {
    const append = vi.fn().mockResolvedValue([]);
    const service = serviceFor(
      { findById: vi.fn().mockResolvedValue(team) },
      {
        findById: vi.fn().mockResolvedValue(game),
        append,
        findActions: vi.fn().mockResolvedValue([
          { kind: 'MARK_ATTENDANCE', payload: { fromRound: 1, presentPlayerIds: ['player-1', 'player-2'] } },
          { kind: 'SWAP', payload: { round: 1, screen: 'PLAN', playerIds: ['player-1', 'player-2'] } },
        ]),
      },
    );

    await service.resetPlanForCoach('river coach', 'game-1');

    expect(append).toHaveBeenCalledWith('game-1', [{ kind: 'RESET_PLAN', payload: { round: 1 } }]);
  });

  it('will not use a lineup for a round that is already on the field', async () => {
    const service = serviceFor(
      { findById: vi.fn().mockResolvedValue(team) },
      {
        findById: vi.fn().mockResolvedValue(game),
        append: vi.fn(),
        findActions: vi.fn().mockResolvedValue([
          { kind: 'MARK_ATTENDANCE', payload: { fromRound: 1, presentPlayerIds: ['player-1'] } },
          { kind: 'USE_LINEUP', payload: { round: 1, lineup: { goalie: ['player-1'], defenders: [], forwards: [] } } },
        ]),
      },
    );

    await expect(service.useLineupForCoach('river coach', 'game-1'))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('will not use a lineup before anyone has been marked present', async () => {
    const service = serviceFor(
      { findById: vi.fn().mockResolvedValue(team) },
      { findById: vi.fn().mockResolvedValue(game), append: vi.fn() },
    );

    await expect(service.useLineupForCoach('river coach', 'game-1'))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('cannot open a game that does not exist', async () => {
    const service = serviceFor(
      { findById: vi.fn().mockResolvedValue(team) },
      { findById: vi.fn().mockResolvedValue(null) },
    );

    await expect(service.findForCoach('river coach', 'game-9')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('cannot open another coach’s game', async () => {
    const service = serviceFor(
      { findById: vi.fn().mockResolvedValue(team) },
      { findById: vi.fn().mockResolvedValue(game) },
    );

    await expect(service.findForCoach('hill coach', 'game-1')).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
