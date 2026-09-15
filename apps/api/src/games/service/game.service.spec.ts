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

function serviceFor(teams: Partial<TeamService>, games: Partial<GameRepository> = {}) {
  return new GameService(games as GameRepository, teams as TeamService);
}

describe('GameService', () => {
  it('starts a game from a copy of the team', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'game-1' });
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
    const create = vi.fn().mockResolvedValue({ id: 'game-1' });
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
});
