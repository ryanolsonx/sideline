import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PlayerEntity } from './player.entity';
import { TeamEntity } from './team.entity';

@Injectable()
export class TeamRepository {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  findAll(): Promise<TeamEntity[]> {
    return this.teamRepository.find({ relations: { players: true }, order: { createdAt: 'ASC' } });
  }

  findById(id: string): Promise<TeamEntity | null> {
    return this.teamRepository.findOne({ where: { id }, relations: { players: true } });
  }

  createWithPlayers(name: string, playerNames: string[]): Promise<TeamEntity> {
    return this.dataSource.transaction(async (manager) => {
      const teams = manager.getRepository(TeamEntity);
      const players = manager.getRepository(PlayerEntity);
      const team = await teams.save(teams.create({ name }));
      const savedPlayers = await players.save(
        playerNames.map((playerName) => players.create({ name: playerName, teamId: team.id })),
      );

      team.players = savedPlayers;
      return team;
    });
  }
}
