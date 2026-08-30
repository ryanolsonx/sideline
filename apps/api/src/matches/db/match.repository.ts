import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchEntity } from './match.entity';

@Injectable()
export class MatchRepository {
  constructor(
    @InjectRepository(MatchEntity)
    private readonly repository: Repository<MatchEntity>,
  ) {}

  findAll(): Promise<MatchEntity[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  save(match: Pick<MatchEntity, 'name'>): Promise<MatchEntity> {
    return this.repository.save(this.repository.create(match));
  }
}
