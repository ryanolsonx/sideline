import { describe, expect, it, vi } from 'vitest';
import { TeamRepository } from '../db/team.repository';
import { TeamService } from './team.service';

describe('TeamService', () => {
  it('normalizes a complete roster before persisting it', async () => {
    const repository = {
      createWithPlayers: vi.fn().mockResolvedValue({}),
    } as unknown as TeamRepository;
    const service = new TeamService(repository);

    await service.create(' Salt Lake   Strikers ', [' Avery  Kim ']);

    expect(repository.createWithPlayers).toHaveBeenCalledWith('Salt Lake Strikers', ['Avery Kim']);
  });
});
