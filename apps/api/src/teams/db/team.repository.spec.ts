import { describe, expect, it, vi } from 'vitest';
import { DataSource, Repository } from 'typeorm';
import { PlayerEntity } from './player.entity';
import { TeamEntity } from './team.entity';
import { TeamRepository } from './team.repository';

describe('TeamRepository', () => {
  it('loads only teams belonging to the coach', async () => {
    const teams = {
      find: vi.fn().mockResolvedValue([]),
    } as unknown as Repository<TeamEntity>;
    const repository = new TeamRepository(teams, {} as DataSource);

    await repository.findAllByCoachUsername('river coach');

    expect(teams.find).toHaveBeenCalledWith({
      where: { coachUsername: 'river coach' },
      relations: { players: true },
      order: { createdAt: 'ASC' },
    });
  });

  it('creates a team and its players in one transaction', async () => {
    const savedTeam = {
      id: 'team-1',
      coachUsername: 'river coach',
      name: 'Salt Lake Strikers',
      formation: { defender: 2, forward: 2 },
      createdAt: new Date(),
    } as TeamEntity;
    const savedPlayers = [
      { id: 'player-1', name: 'Avery Kim', teamId: 'team-1' },
      { id: 'player-2', name: 'Jordan Lee', teamId: 'team-1' },
    ] as PlayerEntity[];
    const teams = {
      create: vi.fn().mockReturnValue({
        coachUsername: savedTeam.coachUsername,
        name: savedTeam.name,
        formation: savedTeam.formation,
      }),
      save: vi.fn().mockResolvedValue(savedTeam),
    };
    const players = {
      create: vi.fn((player) => player),
      save: vi.fn().mockResolvedValue(savedPlayers),
    };
    const manager = {
      getRepository: vi.fn((entity) => entity === TeamEntity ? teams : players),
    };
    const dataSource = {
      transaction: vi.fn(async (work) => work(manager)),
    } as unknown as DataSource;
    const repository = new TeamRepository({} as Repository<TeamEntity>, dataSource);

    const team = await repository.createWithPlayers(
      savedTeam.coachUsername,
      savedTeam.name,
      ['Avery Kim', 'Jordan Lee'],
      savedTeam.formation,
    );

    expect(dataSource.transaction).toHaveBeenCalledOnce();
    expect(teams.create).toHaveBeenCalledWith({
      coachUsername: 'river coach',
      name: 'Salt Lake Strikers',
      formation: { defender: 2, forward: 2 },
    });
    expect(players.save).toHaveBeenCalledWith([
      { name: 'Avery Kim', teamId: 'team-1' },
      { name: 'Jordan Lee', teamId: 'team-1' },
    ]);
    expect(team.players).toEqual(savedPlayers);
  });
});
