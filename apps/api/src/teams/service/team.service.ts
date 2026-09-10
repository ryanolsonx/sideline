import { Injectable, NotFoundException } from '@nestjs/common';
import { TeamRepository } from '../db/team.repository';
import {
  Team,
  Formation,
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

  async findForCoach(coachUsername: string, id: string): Promise<Team> {
    const team = await this.teamRepository.findByIdAndCoachUsername(
      id,
      normalizeCoachUsername(coachUsername),
    );
    if (!team) throw new NotFoundException('Team not found.');
    return team;
  }

  async updateRosterForCoach(coachUsername: string, id: string, playerNames: string[]): Promise<Team> {
    const team = await this.teamRepository.findByIdAndCoachUsername(
      id,
      normalizeCoachUsername(coachUsername),
    );
    if (!team) throw new NotFoundException('Team not found.');
    return this.teamRepository.replacePlayers(team, normalizePlayerNames(playerNames));
  }

  async updateFormationForCoach(
    coachUsername: string,
    id: string,
    formation: Formation,
  ): Promise<Team> {
    const team = await this.teamRepository.findByIdAndCoachUsername(
      id,
      normalizeCoachUsername(coachUsername),
    );
    if (!team) throw new NotFoundException('Team not found.');
    return this.teamRepository.updateFormation(team, normalizeFormation(formation));
  }

  async updateForCoach(coachUsername: string, id: string, playerNames: string[], formation: Formation): Promise<Team> {
    const team = await this.teamRepository.findByIdAndCoachUsername(id, normalizeCoachUsername(coachUsername));
    if (!team) throw new NotFoundException('Team not found.');
    return this.teamRepository.updateTeam(team, normalizePlayerNames(playerNames), normalizeFormation(formation));
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
    formation: Formation,
  ): Promise<Team> {
    return this.teamRepository.createWithPlayers(
      normalizeCoachUsername(coachUsername),
      normalizeTeamName(name),
      normalizePlayerNames(playerNames),
      normalizeFormation(formation),
    );
  }
}
