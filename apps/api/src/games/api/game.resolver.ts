import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { answering } from './answering';
import { BeginGameInput } from './begin-game.input';
import { GameDto, GamePlayerDto, RoundDto } from './game.dto';
import { MarkAttendanceInput } from './mark-attendance.input';
import { ResetPlanInput } from './reset-plan.input';
import { StartGameInput } from './start-game.input';
import { SwapPlayersInput } from './swap-players.input';
import { TakeSubsInput } from './take-subs.input';
import { UseLineupInput } from './use-lineup.input';
import { GameService, GameView } from '../service/game.service';
import { Position, StartingLineup, outPlayerIds } from '../domain/lineup';
import { ROUNDS_IN_A_GAME, Round, roundOf } from '../domain/game.model';
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
function toGameDto({ game, state, plan }: GameView): GameDto {
  const players: GamePlayerDto[] = game.roster.map((player) => ({
    id: player.id,
    name: player.name,
    present: state.presentPlayerIds.includes(player.id),
  }));
  const playerBy = (id: string) => players.find((player) => player.id === id);

  const asRoundDto = (round: Round): RoundDto => ({
    number: round.round,
    out: outPlayerIds(round.startingLineup, state.presentPlayerIds)
      .map(playerBy)
      .filter((player): player is GamePlayerDto => player !== undefined),
    slots: slotsOf(round.startingLineup, playerBy, game.formation),
  });

  const round = state.currentRound === undefined ? undefined : roundOf(state, state.currentRound);

  return {
    id: game.id,
    teamId: game.teamId,
    startedAt: game.startedAt,
    formation: game.formation,
    lifecycle: state.lifecycle,
    attendanceConfirmed: state.attendanceConfirmed,
    players,
    rounds: ROUNDS_IN_A_GAME,
    currentRound: round && asRoundDto(round),
    plannedRound: plan && asRoundDto(plan),
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
      await this.gameService.markAttendanceForCoach(
        coachUsernameFromCookieHeader(request.headers.cookie),
        input.gameId,
        input.presentPlayerIds,
      ),
    ));
  }

  @Mutation(() => GameDto)
  async useLineup(
    @Context('req') request: Request,
    @Args('input') input: UseLineupInput,
  ): Promise<GameDto> {
    return answering(async () => toGameDto(
      await this.gameService.useLineupForCoach(
        coachUsernameFromCookieHeader(request.headers.cookie),
        input.gameId,
      ),
    ));
  }

  @Mutation(() => GameDto)
  async swapPlayers(
    @Context('req') request: Request,
    @Args('input') input: SwapPlayersInput,
  ): Promise<GameDto> {
    return answering(async () => toGameDto(
      await this.gameService.swapPlayersForCoach(
        coachUsernameFromCookieHeader(request.headers.cookie),
        input.gameId,
        input.playerIds,
      ),
    ));
  }

  @Mutation(() => GameDto)
  async resetPlan(
    @Context('req') request: Request,
    @Args('input') input: ResetPlanInput,
  ): Promise<GameDto> {
    return answering(async () => toGameDto(
      await this.gameService.resetPlanForCoach(
        coachUsernameFromCookieHeader(request.headers.cookie),
        input.gameId,
      ),
    ));
  }

  @Mutation(() => GameDto)
  async takeSubs(
    @Context('req') request: Request,
    @Args('input') input: TakeSubsInput,
  ): Promise<GameDto> {
    return answering(async () => toGameDto(
      await this.gameService.takeSubsForCoach(
        coachUsernameFromCookieHeader(request.headers.cookie),
        input.gameId,
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
