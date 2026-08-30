import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMatchInput } from './create-match.input';
import { MatchDto } from './match.dto';
import { MatchService } from '../service/match.service';

@Resolver(() => MatchDto)
export class MatchResolver {
  constructor(private readonly matchService: MatchService) {}

  @Query(() => [MatchDto])
  matches(): Promise<MatchDto[]> {
    return this.matchService.findAll();
  }

  @Mutation(() => MatchDto)
  createMatch(@Args('input') input: CreateMatchInput): Promise<MatchDto> {
    return this.matchService.create(input.name);
  }
}
