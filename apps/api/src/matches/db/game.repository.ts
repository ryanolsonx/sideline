import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PlannedRound } from '../domain/game.model';
import { GameRoundAssignmentEntity } from './game-round-assignment.entity';
import { GameRoundEntity } from './game-round.entity';
import { GameEntity } from './game.entity';

@Injectable()
export class GameRepository {
  constructor(
    @InjectRepository(GameEntity)
    private readonly games: Repository<GameEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(teamId: string, fieldSize: 5 | 6, plan: PlannedRound[]): Promise<GameEntity> {
    const game = await this.dataSource.transaction(async (manager) => {
      const games = manager.getRepository(GameEntity);
      const rounds = manager.getRepository(GameRoundEntity);
      const assignments = manager.getRepository(GameRoundAssignmentEntity);
      const savedGame = await games.save(games.create({ teamId, fieldSize, status: 'ACTIVE', currentRound: 1 }));

      for (const plannedRound of plan) {
        const round = await rounds.save(rounds.create({ gameId: savedGame.id, number: plannedRound.number }));
        await assignments.save(plannedRound.assignments.map((assignment) => assignments.create({
          roundId: round.id,
          ...assignment,
        })));
      }
      return savedGame;
    });

    return this.findById(game.id) as Promise<GameEntity>;
  }

  findById(id: string): Promise<GameEntity | null> {
    return this.games.findOne({
      where: { id },
      relations: { team: true, rounds: { assignments: { player: true } } },
      order: { rounds: { number: 'ASC', assignments: { player: { name: 'ASC' } } } },
    });
  }

  findActiveForTeam(teamId: string): Promise<GameEntity | null> {
    return this.games.findOne({
      where: { teamId, status: 'ACTIVE' },
      relations: { team: true, rounds: { assignments: { player: true } } },
      order: { startedAt: 'DESC', rounds: { number: 'ASC', assignments: { player: { name: 'ASC' } } } },
    });
  }

  async advance(game: GameEntity): Promise<GameEntity> {
    if (game.currentRound >= 8) {
      game.status = 'COMPLETE';
    } else {
      game.currentRound += 1;
      if (game.currentRound === 8) game.status = 'COMPLETE';
    }
    await this.games.save(game);
    return this.findById(game.id) as Promise<GameEntity>;
  }
}
