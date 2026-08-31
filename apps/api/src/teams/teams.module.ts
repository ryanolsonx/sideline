import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamResolver } from './api/team.resolver';
import { PlayerEntity } from './db/player.entity';
import { TeamEntity } from './db/team.entity';
import { TeamRepository } from './db/team.repository';
import { TeamService } from './service/team.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity, PlayerEntity])],
  providers: [TeamResolver, TeamRepository, TeamService],
})
export class TeamsModule {}
