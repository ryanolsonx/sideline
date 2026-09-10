import { describe, expect, it, vi } from 'vitest';
import { TeamRepository } from '../db/team.repository';
import { TeamService } from './team.service';

describe('TeamService', () => {
  it('scopes teams to the normalized coach username', async () => {
    const repository = {
      findAllByCoachUsername: vi.fn().mockResolvedValue([]),
    } as unknown as TeamRepository;
    const service = new TeamService(repository);

    await service.findAllForCoach(' River   Coach ');

    expect(repository.findAllByCoachUsername).toHaveBeenCalledWith('river coach');
  });

  it('normalizes the coach, team, and roster before persisting them', async () => {
    const repository = {
      createWithPlayers: vi.fn().mockResolvedValue({}),
    } as unknown as TeamRepository;
    const service = new TeamService(repository);

    await service.createForCoach(
      ' River   Coach ',
      ' Salt Lake   Strikers ',
      [' Avery  Kim '],
      { defender: 1, forward: 3 },
    );

    expect(repository.createWithPlayers).toHaveBeenCalledWith(
      'river coach',
      'Salt Lake Strikers',
      ['Avery Kim'],
      { defender: 1, forward: 3 },
    );
  });
});
