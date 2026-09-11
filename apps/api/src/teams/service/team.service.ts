import { Injectable } from '@nestjs/common';
import { TeamRepository } from '../db/team.repository';
import {
  Team,
  Formation,
  legacyFormation,
  normalizeCoachUsername,
  normalizeFormation,
  normalizePlayerNames,
  normalizeTeamName,
} from '../domain/team.model';

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  findAll(): Promise<Team[]> {
    return this.teamRepository.findAll();
  }

  findAllForCoach(coachUsername: string): Promise<Team[]> {
    return this.teamRepository.findAllByCoachUsername(normalizeCoachUsername(coachUsername));
  }

  create(name: string, playerNames: string[]): Promise<Team> {
    return this.teamRepository.createLegacyWithPlayers(
      normalizeTeamName(name),
      normalizePlayerNames(playerNames),
    );
  }

  createForCoach(
    coachUsername: string,
    name: string,
    playerNames: string[],
    formation: Formation = legacyFormation,
  ): Promise<Team> {
    return this.teamRepository.createWithPlayers(
      normalizeCoachUsername(coachUsername),
      normalizeTeamName(name),
      normalizePlayerNames(playerNames),
      normalizeFormation(formation),
    );
  }
}
