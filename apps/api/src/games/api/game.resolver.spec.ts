import { describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { GameResolver } from './game.resolver';
import { GameService } from '../service/game.service';

const view = {
  game: {
    id: 'game-1',
    teamId: 'team-1',
    startedAt: new Date('2026-09-12T15:00:00Z'),
    roster: [
      { id: 'player-1', name: 'Avery' },
      { id: 'player-2', name: 'Jordan' },
    ],
    formation: { defender: 2, forward: 2 },
    rotationSeed: 'seed-1',
  },
  state: {
    lifecycle: 'SETUP' as const,
    attendanceConfirmed: true,
    presentPlayerIds: ['player-1'],
    rounds: [],
  },
};

const liveView = {
  game: { ...view.game, formation: { defender: 1, forward: 1 } },
  state: {
    lifecycle: 'LIVE' as const,
    attendanceConfirmed: true,
    presentPlayerIds: ['player-1', 'player-2'],
    currentRound: 1,
    rounds: [{ round: 1, startingLineup: { goalie: ['player-2'], defenders: ['player-1'], forwards: [] } }],
  },
};

const request = { headers: { cookie: 'sidelineCoachUsername=River%20Coach' } };

describe('GameResolver', () => {
  it('answers with the folded game rather than its log', async () => {
    const service = { findForCoach: vi.fn().mockResolvedValue(view) } as unknown as GameService;

    await expect(new GameResolver(service).game(request, 'game-1')).resolves.toEqual({
      id: 'game-1',
      teamId: 'team-1',
      startedAt: view.game.startedAt,
      formation: { defender: 2, forward: 2 },
      lifecycle: 'SETUP',
      attendanceConfirmed: true,
      players: [
        { id: 'player-1', name: 'Avery', present: true },
        { id: 'player-2', name: 'Jordan', present: false },
      ],
      currentRound: undefined,
    });
  });

  it('shows the round out first, then the formation filled in order', async () => {
    const service = { findForCoach: vi.fn().mockResolvedValue(liveView) } as unknown as GameService;

    const { currentRound } = await new GameResolver(service).game(request, 'game-1');

    expect(currentRound).toEqual({
      number: 1,
      out: [],
      slots: [
        { position: 'GOALIE', player: { id: 'player-2', name: 'Jordan', present: true } },
        { position: 'DEFENDER', player: { id: 'player-1', name: 'Avery', present: true } },
        { position: 'FORWARD', player: undefined },
      ],
    });
  });

  it('begins the game as the coach the request carries', async () => {
    const beginGameForCoach = vi.fn().mockResolvedValue(liveView);
    const service = { beginGameForCoach } as unknown as GameService;

    await new GameResolver(service).beginGame(request, {
      gameId: 'game-1',
      presentPlayerIds: ['player-1'],
    });

    expect(beginGameForCoach).toHaveBeenCalledWith('river coach', 'game-1', ['player-1']);
  });

  it('uses the lineup as the coach the request carries', async () => {
    const useLineupForCoach = vi.fn().mockResolvedValue(liveView);
    const service = { useLineupForCoach } as unknown as GameService;

    await new GameResolver(service).useLineup(request, { gameId: 'game-1' });

    expect(useLineupForCoach).toHaveBeenCalledWith('river coach', 'game-1');
  });

  it('acts as the coach the request carries', async () => {
    const startGameForCoach = vi.fn().mockResolvedValue(view);
    const service = { startGameForCoach } as unknown as GameService;

    await new GameResolver(service).startGame(request, { teamId: 'team-1' });

    expect(startGameForCoach).toHaveBeenCalledWith('river coach', 'team-1');
  });

  it('passes the whole confirmed list to the service', async () => {
    const markAttendanceForCoach = vi.fn().mockResolvedValue(view);
    const service = { markAttendanceForCoach } as unknown as GameService;

    await new GameResolver(service).markAttendance(request, {
      gameId: 'game-1',
      presentPlayerIds: ['player-1'],
    });

    expect(markAttendanceForCoach).toHaveBeenCalledWith('river coach', 'game-1', ['player-1']);
  });

  it('says a game belongs to someone else rather than hiding it', async () => {
    const service = {
      findForCoach: vi.fn().mockRejectedValue(new ForbiddenException('Sorry, that is not your game.')),
    } as unknown as GameService;

    await expect(new GameResolver(service).game(request, 'game-1')).rejects.toMatchObject({
      message: 'Sorry, that is not your game.',
      extensions: { code: 'NOT_YOURS' },
    });
  });

  it('says a game is not there when it is not there', async () => {
    const service = {
      findForCoach: vi.fn().mockRejectedValue(new NotFoundException('Game not found.')),
    } as unknown as GameService;

    await expect(new GameResolver(service).game(request, 'game-1')).rejects.toBeInstanceOf(
      GraphQLError,
    );
  });

  it('tells a request with no coach on it to sign in', async () => {
    const service = { findForCoach: vi.fn() } as unknown as GameService;

    await expect(new GameResolver(service).game({ headers: {} }, 'game-1')).rejects.toMatchObject({
      extensions: { code: 'NOT_SIGNED_IN' },
    });
  });

  it('names a broken rule as a refusal rather than a server fault', async () => {
    const service = {
      markAttendanceForCoach: vi.fn().mockRejectedValue(
        new BadRequestException('That player is not in this game.'),
      ),
    } as unknown as GameService;

    await expect(
      new GameResolver(service).markAttendance(request, { gameId: 'game-1', presentPlayerIds: [] }),
    ).rejects.toMatchObject({ extensions: { code: 'REFUSED' } });
  });
});
