import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PlayerEntity } from './player.entity';
import { TeamEntity } from './team.entity';
import { Formation, legacyFormation } from '../domain/team.model';

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

  findAllByCoachUsername(coachUsername: string): Promise<TeamEntity[]> {
    return this.teamRepository.find({
      where: { coachUsername },
      relations: { players: true },
      order: { createdAt: 'ASC' },
    });
  }

  findByIdAndCoachUsername(id: string, coachUsername: string): Promise<TeamEntity | null> {
    return this.teamRepository.findOne({
      where: { id, coachUsername },
      relations: { players: true },
    });
  }

  async replacePlayers(team: TeamEntity, playerNames: string[]): Promise<TeamEntity> {
    return this.dataSource.transaction(async (manager) => {
      const players = manager.getRepository(PlayerEntity);
      await players.delete({ teamId: team.id });
      team.players = await players.save(
        playerNames.map((name) => players.create({ name, teamId: team.id })),
      );
      return team;
    });
  }

  updateFormation(team: TeamEntity, formation: Formation): Promise<TeamEntity> {
    team.formation = formation;
    return this.teamRepository.save(team);
  }

  createWithPlayers(
    coachUsername: string,
    name: string,
    playerNames: string[],
    formation: Formation = legacyFormation,
  ): Promise<TeamEntity> {
    return this.dataSource.transaction(async (manager) => {
      const teams = manager.getRepository(TeamEntity);
      const players = manager.getRepository(PlayerEntity);
      const team = await teams.save(teams.create({ coachUsername, name, formation }));
      const savedPlayers = await players.save(
        playerNames.map((playerName) => players.create({ name: playerName, teamId: team.id })),
      );

      team.players = savedPlayers;
      return team;
    });
  }

  createLegacyWithPlayers(name: string, playerNames: string[]): Promise<TeamEntity> {
    return this.createWithPlayers('legacy', name, playerNames, legacyFormation);
  }
}
