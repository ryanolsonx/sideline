import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TeamRepository } from '../../teams/db/team.repository';
import { GameRepository } from '../db/game.repository';
import { GameEntity } from '../db/game.entity';
import { buildGamePlan } from '../domain/game.model';

@Injectable()
export class GameService {
  constructor(
    private readonly games: GameRepository,
    private readonly teams: TeamRepository,
  ) {}

  async start(teamId: string, fieldSize: 5 | 6, presentPlayerIds: string[]): Promise<GameEntity> {
    const team = await this.teams.findById(teamId);
    if (!team) throw new NotFoundException('Team not found.');
    if (fieldSize !== 5 && fieldSize !== 6) throw new BadRequestException('Choose five-on-five or six-on-six.');

    const uniqueIds = [...new Set(presentPlayerIds)];
    const presentPlayers = team.players.filter((player) => uniqueIds.includes(player.id));
    if (presentPlayers.length !== uniqueIds.length) throw new BadRequestException('A selected player is not on this team.');

    try {
      return await this.games.create(team.id, fieldSize, buildGamePlan(presentPlayers, fieldSize));
    } catch (error) {
      if (error instanceof Error) throw new BadRequestException(error.message);
      throw error;
    }
  }

  activeForTeam(teamId: string): Promise<GameEntity | null> {
    return this.games.findActiveForTeam(teamId);
  }

  async advance(gameId: string): Promise<GameEntity> {
    const game = await this.games.findById(gameId);
    if (!game) throw new NotFoundException('Game not found.');
    if (game.status === 'COMPLETE') throw new BadRequestException('This game is already complete.');
    return this.games.advance(game);
  }
}
