import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { answering } from './answering';
import { BeginGameInput } from './begin-game.input';
import { GameDto, GamePlayerDto, RoundDto } from './game.dto';
import { MarkAttendanceInput } from './mark-attendance.input';
import { StartGameInput } from './start-game.input';
import { GameService, GameView } from '../service/game.service';
import { Position, StartingLineup, outPlayerIds } from '../domain/lineup';
import { roundOf } from '../domain/game.model';
import { coachUsernameFromCookieHeader } from '../../teams/api/coach-username';

type Request = { headers: { cookie?: string } };

/** Out first, then the formation filled goalie, defenders, forwards. */
function slotsOf(lineup: StartingLineup, playerBy: (id: string) => GamePlayerDto | undefined, formation: { defender: number; forward: number }) {
  const places: [Position, string[], number][] = [
    ['GOALIE', lineup.goalie, 1],
    ['DEFENDER', lineup.defenders, formation.defender],
    ['FORWARD', lineup.forwards, formation.forward],
  ];

  return places.flatMap(([position, playerIds, slotCount]) =>
    Array.from({ length: slotCount }, (_, index) => ({
      position,
      player: playerIds[index] === undefined ? undefined : playerBy(playerIds[index]),
    })),
  );
}

/** The API answers with the folded game, never with the log it was folded from. */
function toGameDto({ game, state }: GameView): GameDto {
  const players: GamePlayerDto[] = game.roster.map((player) => ({
    id: player.id,
    name: player.name,
    present: state.presentPlayerIds.includes(player.id),
  }));
  const playerBy = (id: string) => players.find((player) => player.id === id);

  const round = state.currentRound === undefined ? undefined : roundOf(state, state.currentRound);
  const currentRound: RoundDto | undefined = round && {
    number: round.round,
    out: outPlayerIds(round.startingLineup, state.presentPlayerIds)
      .map(playerBy)
      .filter((player): player is GamePlayerDto => player !== undefined),
    slots: slotsOf(round.startingLineup, playerBy, game.formation),
  };

  return {
    id: game.id,
    teamId: game.teamId,
    startedAt: game.startedAt,
    formation: game.formation,
    lifecycle: state.lifecycle,
    attendanceConfirmed: state.attendanceConfirmed,
    players,
    currentRound,
  };
}

@Resolver(() => GameDto)
export class GameResolver {
  constructor(private readonly gameService: GameService) {}

  @Query(() => GameDto)
  async game(@Context('req') request: Request, @Args('id', { type: () => ID }) id: string): Promise<GameDto> {
    return answering(async () => toGameDto(
      await this.gameService.findForCoach(coachUsernameFromCookieHeader(request.headers.cookie), id),
    ));
  }

  @Mutation(() => GameDto)
  async startGame(
    @Context('req') request: Request,
    @Args('input') input: StartGameInput,
  ): Promise<GameDto> {
    return answering(async () => toGameDto(
      await this.gameService.startGameForCoach(
        coachUsernameFromCookieHeader(request.headers.cookie),
        input.teamId,
      ),
    ));
  }

  @Mutation(() => GameDto)
  async beginGame(
    @Context('req') request: Request,
    @Args('input') input: BeginGameInput,
  ): Promise<GameDto> {
    return answering(async () => toGameDto(
      await this.gameService.beginGameForCoach(
        coachUsernameFromCookieHeader(request.headers.cookie),
        input.gameId,
        input.presentPlayerIds,
      ),
    ));
  }

  @Mutation(() => GameDto)
  async markAttendance(
    @Context('req') request: Request,
    @Args('input') input: MarkAttendanceInput,
  ): Promise<GameDto> {
    return answering(async () => toGameDto(
      await this.gameService.markAttendanceForCoach(
        coachUsernameFromCookieHeader(request.headers.cookie),
        input.gameId,
        input.presentPlayerIds,
      ),
    ));
  }
}
