import { Injectable } from '@nestjs/common';
import { TeamRepository } from '../db/team.repository';
import { Team, normalizePlayerNames, normalizeTeamName } from '../domain/team.model';

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  findAll(): Promise<Team[]> {
    return this.teamRepository.findAll();
  }

  create(name: string, playerNames: string[]): Promise<Team> {
    return this.teamRepository.createWithPlayers(
      normalizeTeamName(name),
      normalizePlayerNames(playerNames),
    );
  }
}
