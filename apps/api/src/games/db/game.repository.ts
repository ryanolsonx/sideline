import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { GameActionEntity } from './game-action.entity';
import { GameEntity } from './game.entity';
import { GameSnapshot } from '../domain/game.model';

@Injectable()
export class GameRepository {
  constructor(
    @InjectRepository(GameEntity)
    private readonly games: Repository<GameEntity>,
    @InjectRepository(GameActionEntity)
    private readonly actions: Repository<GameActionEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  create(teamId: string, snapshot: GameSnapshot): Promise<GameEntity> {
    return this.games.save(this.games.create({ teamId, ...snapshot }));
  }

  findById(id: string): Promise<GameEntity | null> {
    return this.games.findOneBy({ id });
  }

  findActions(gameId: string): Promise<GameActionEntity[]> {
    return this.actions.find({ where: { gameId }, order: { sequence: 'ASC' } });
  }

  /**
   * Locks the game so two requests cannot claim the same place in the log, then appends.
   * Appending is the only write a game ever takes, and one coach action is one transaction
   * however many entries it writes.
   */
  append(
    gameId: string,
    entries: readonly { kind: string; payload: Record<string, unknown> }[],
  ): Promise<GameActionEntity[]> {
    return this.dataSource.transaction(async (manager) => {
      await manager.getRepository(GameEntity).findOne({ where: { id: gameId }, lock: { mode: 'pessimistic_write' } });
      const actions = manager.getRepository(GameActionEntity);
      const nextSequence = await actions.countBy({ gameId });
      return actions.save(
        entries.map((entry, index) => actions.create({ gameId, sequence: nextSequence + index, ...entry })),
      );
    });
  }
}
