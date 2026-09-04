import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMatchInput } from './create-match.input';
import { MatchDto } from './match.dto';
import { MatchService } from '../service/match.service';
import { GameDto } from './game.dto';
import { StartGameInput } from './start-game.input';
import { GameService } from '../service/game.service';

@Resolver(() => MatchDto)
export class MatchResolver {
  constructor(
    private readonly matchService: MatchService,
    private readonly gameService: GameService,
  ) {}

  @Query(() => GameDto, { nullable: true })
  activeGame(@Args('teamId') teamId: string): Promise<GameDto | null> {
    return this.gameService.activeForTeam(teamId);
  }

  @Query(() => [MatchDto])
  matches(): Promise<MatchDto[]> {
    return this.matchService.findAll();
  }

  @Mutation(() => MatchDto)
  createMatch(@Args('input') input: CreateMatchInput): Promise<MatchDto> {
    return this.matchService.create(input.name);
  }

  @Mutation(() => GameDto)
  startGame(@Args('input') input: StartGameInput): Promise<GameDto> {
    return this.gameService.start(input.teamId, input.fieldSize, input.presentPlayerIds);
  }

  @Mutation(() => GameDto)
  advanceGame(@Args('gameId') gameId: string): Promise<GameDto> {
    return this.gameService.advance(gameId);
  }
}
