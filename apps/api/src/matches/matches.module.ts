import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchResolver } from './api/match.resolver';
import { MatchEntity } from './db/match.entity';
import { MatchRepository } from './db/match.repository';
import { MatchService } from './service/match.service';

@Module({
  imports: [TypeOrmModule.forFeature([MatchEntity])],
  providers: [MatchResolver, MatchRepository, MatchService],
})
export class MatchesModule {}
