import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameActionEntity } from './db/game-action.entity';
import { GameEntity } from './db/game.entity';
import { GameRepository } from './db/game.repository';
import { GameResolver } from './api/game.resolver';
import { GameService } from './service/game.service';
import { TeamsModule } from '../teams/teams.module';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity, GameActionEntity]), TeamsModule],
  providers: [GameResolver, GameRepository, GameService],
})
export class GamesModule {}
