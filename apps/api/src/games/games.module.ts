import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameActionEntity } from './db/game-action.entity';
import { GameEntity } from './db/game.entity';
import { GameRepository } from './db/game.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity, GameActionEntity])],
  providers: [GameRepository],
})
export class GamesModule {}
