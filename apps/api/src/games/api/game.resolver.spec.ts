import { describe, expect, it, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
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
    });
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

  it('refuses a request with no coach on it', async () => {
    const service = { findForCoach: vi.fn() } as unknown as GameService;

    await expect(new GameResolver(service).game({ headers: {} }, 'game-1')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
