import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GameDto } from './game.dto';
import { MarkAttendanceInput } from './mark-attendance.input';
import { StartGameInput } from './start-game.input';
import { GameService, GameView } from '../service/game.service';
import { coachUsernameFromCookieHeader } from '../../teams/api/coach-username';

type Request = { headers: { cookie?: string } };

/** The API answers with the folded game, never with the log it was folded from. */
function toGameDto({ game, state }: GameView): GameDto {
  return {
    id: game.id,
    teamId: game.teamId,
    startedAt: game.startedAt,
    formation: game.formation,
    lifecycle: state.lifecycle,
    attendanceConfirmed: state.attendanceConfirmed,
    players: game.roster.map((player) => ({
      id: player.id,
      name: player.name,
      present: state.presentPlayerIds.includes(player.id),
    })),
  };
}

@Resolver(() => GameDto)
export class GameResolver {
  constructor(private readonly gameService: GameService) {}

  @Query(() => GameDto)
  async game(@Context('req') request: Request, @Args('id', { type: () => ID }) id: string): Promise<GameDto> {
    return toGameDto(
      await this.gameService.findForCoach(coachUsernameFromCookieHeader(request.headers.cookie), id),
    );
  }

  @Mutation(() => GameDto)
  async startGame(
    @Context('req') request: Request,
    @Args('input') input: StartGameInput,
  ): Promise<GameDto> {
    return toGameDto(
      await this.gameService.startGameForCoach(
        coachUsernameFromCookieHeader(request.headers.cookie),
        input.teamId,
      ),
    );
  }

  @Mutation(() => GameDto)
  async markAttendance(
    @Context('req') request: Request,
    @Args('input') input: MarkAttendanceInput,
  ): Promise<GameDto> {
    return toGameDto(
      await this.gameService.markAttendanceForCoach(
        coachUsernameFromCookieHeader(request.headers.cookie),
        input.gameId,
        input.presentPlayerIds,
      ),
    );
  }
}
