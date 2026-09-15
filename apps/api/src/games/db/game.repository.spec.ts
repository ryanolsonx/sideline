import { describe, expect, it, vi } from 'vitest';
import { DataSource, Repository } from 'typeorm';
import { GameActionEntity } from './game-action.entity';
import { GameEntity } from './game.entity';
import { GameRepository } from './game.repository';

const snapshot = {
  roster: [{ id: 'player-1', name: 'Avery' }],
  formation: { defender: 2, forward: 2 },
  rotationSeed: 'seed-1',
};

describe('GameRepository', () => {
  it('stores the snapshot the game was started with', async () => {
    const games = {
      create: vi.fn((values) => values),
      save: vi.fn().mockResolvedValue({ id: 'game-1' }),
    } as unknown as Repository<GameEntity>;
    const repository = new GameRepository(games, {} as Repository<GameActionEntity>, {} as DataSource);

    await repository.create('team-1', snapshot);

    expect(games.create).toHaveBeenCalledWith({ teamId: 'team-1', ...snapshot });
    expect(games.save).toHaveBeenCalledWith({ teamId: 'team-1', ...snapshot });
  });

  it('reads a game’s actions in the order the coach took them', async () => {
    const actions = { find: vi.fn().mockResolvedValue([]) } as unknown as Repository<GameActionEntity>;
    const repository = new GameRepository({} as Repository<GameEntity>, actions, {} as DataSource);

    await repository.findActions('game-1');

    expect(actions.find).toHaveBeenCalledWith({
      where: { gameId: 'game-1' },
      order: { sequence: 'ASC' },
    });
  });

  it('appends an action after the ones already logged', async () => {
    const actions = {
      countBy: vi.fn().mockResolvedValue(2),
      create: vi.fn((values) => values),
      save: vi.fn().mockResolvedValue({ id: 'action-3' }),
    };
    const games = { findOne: vi.fn().mockResolvedValue({ id: 'game-1' }) };
    const manager = {
      getRepository: vi.fn((entity) => (entity === GameEntity ? games : actions)),
    };
    const dataSource = {
      transaction: vi.fn((work: (manager: unknown) => Promise<unknown>) => work(manager)),
    } as unknown as DataSource;
    const repository = new GameRepository(
      {} as Repository<GameEntity>,
      {} as Repository<GameActionEntity>,
      dataSource,
    );

    await repository.append('game-1', 'MARK_ATTENDANCE', { presentPlayerIds: ['player-1'] });

    expect(actions.create).toHaveBeenCalledWith({
      gameId: 'game-1',
      sequence: 2,
      kind: 'MARK_ATTENDANCE',
      payload: { presentPlayerIds: ['player-1'] },
    });
  });

  it('locks the game while it works out the next place in the log', async () => {
    const actions = {
      countBy: vi.fn().mockResolvedValue(0),
      create: vi.fn((values) => values),
      save: vi.fn().mockResolvedValue({}),
    };
    const games = { findOne: vi.fn().mockResolvedValue({ id: 'game-1' }) };
    const manager = {
      getRepository: vi.fn((entity) => (entity === GameEntity ? games : actions)),
    };
    const dataSource = {
      transaction: vi.fn((work: (manager: unknown) => Promise<unknown>) => work(manager)),
    } as unknown as DataSource;
    const repository = new GameRepository(
      {} as Repository<GameEntity>,
      {} as Repository<GameActionEntity>,
      dataSource,
    );

    await repository.append('game-1', 'MARK_ATTENDANCE', {});

    expect(games.findOne).toHaveBeenCalledWith({
      where: { id: 'game-1' },
      lock: { mode: 'pessimistic_write' },
    });
  });
});
