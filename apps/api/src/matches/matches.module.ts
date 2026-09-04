import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchResolver } from './api/match.resolver';
import { MatchEntity } from './db/match.entity';
import { MatchRepository } from './db/match.repository';
import { MatchService } from './service/match.service';
import { GameEntity } from './db/game.entity';
import { GameRoundEntity } from './db/game-round.entity';
import { GameRoundAssignmentEntity } from './db/game-round-assignment.entity';
import { GameRepository } from './db/game.repository';
import { GameService } from './service/game.service';
import { TeamsModule } from '../teams/teams.module';

@Module({
  imports: [TypeOrmModule.forFeature([MatchEntity, GameEntity, GameRoundEntity, GameRoundAssignmentEntity]), TeamsModule],
  providers: [MatchResolver, MatchRepository, MatchService, GameRepository, GameService],
})
export class MatchesModule {}
