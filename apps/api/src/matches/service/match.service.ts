import { Injectable } from '@nestjs/common';
import { MatchRepository } from '../db/match.repository';
import { Match, normalizeMatchName } from '../domain/match.model';

@Injectable()
export class MatchService {
  constructor(private readonly matchRepository: MatchRepository) {}

  async findAll(): Promise<Match[]> {
    return this.matchRepository.findAll();
  }

  async create(name: string): Promise<Match> {
    return this.matchRepository.save({ name: normalizeMatchName(name) });
  }
}
