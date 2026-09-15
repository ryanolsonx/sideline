import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GameRepository } from '../db/game.repository';
import { Game, startingSnapshot } from '../domain/game.model';
import { newRotationSeed } from './rotation-seed';
import { TeamService } from '../../teams/service/team.service';
import { Team, normalizeCoachUsername } from '../../teams/domain/team.model';

/** A broken domain rule is something the caller asked for, not a fault in the server. */
function refusing<T>(rule: () => T): T {
  try {
    return rule();
  } catch (error) {
    throw new BadRequestException(error instanceof Error ? error.message : 'That is not allowed.');
  }
}

@Injectable()
export class GameService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly teamService: TeamService,
  ) {}

  async startGameForCoach(coachUsername: string, teamId: string): Promise<Game> {
    const team = await this.ownedTeam(coachUsername, teamId);
    return this.gameRepository.create(team.id, refusing(() => startingSnapshot(team, newRotationSeed())));
  }

  /**
   * An unknown team and someone else's team are told apart rather than flattened into one
   * answer, because this app keeps no secrets and a coach deserves a comprehensible error.
   */
  private async ownedTeam(coachUsername: string, teamId: string): Promise<Team> {
    const team = await this.teamService.findById(teamId);
    if (!team) throw new NotFoundException('Team not found.');
    if (team.coachUsername !== normalizeCoachUsername(coachUsername)) {
      throw new ForbiddenException('Sorry, that is not your team.');
    }
    return team;
  }
}
