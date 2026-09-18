import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GameRepository } from '../db/game.repository';
import {
  Game,
  GameAction,
  GameState,
  Round,
  gameActionFrom,
  markAttendance,
  payloadOf,
  planRound,
  takeSubs,
  projectGame,
  resetPlan,
  startingSnapshot,
  swapPlayers,
  useLineup,
} from '../domain/game.model';
import { newRotationSeed } from './rotation-seed';
import { TeamService } from '../../teams/service/team.service';
import { Team, normalizeCoachUsername } from '../../teams/domain/team.model';

/** A broken domain rule is something the caller asked for, not a fault in the server. */
function refusing<T>(rule: () => T): T {
  try {
    return rule();
  } catch (error) {
    throw new BadRequestException(error instanceof Error ? error.message : 'That is not allowed.');
  }
}

export interface GameView {
  game: Game;
  state: GameState;
  /** The lineup offered for the round being planned, derived on every read and never stored. */
  plan?: Round;
}

@Injectable()
export class GameService {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly teamService: TeamService,
  ) {}

  async startGameForCoach(coachUsername: string, teamId: string): Promise<GameView> {
    const team = await this.ownedTeam(coachUsername, teamId);
    const snapshot = refusing(() => startingSnapshot(team, newRotationSeed()));
    return this.viewOf(await this.gameRepository.create(team.id, snapshot));
  }

  async findForCoach(coachUsername: string, gameId: string): Promise<GameView> {
    return this.viewOf(await this.ownedGame(coachUsername, gameId));
  }

  /**
   * Who is here, the whole list at once. Beginning a game is this and nothing else, because
   * the round that follows is a plan until the coach uses it.
   */
  async markAttendanceForCoach(
    coachUsername: string,
    gameId: string,
    presentPlayerIds: string[],
  ): Promise<GameView> {
    const game = await this.ownedGame(coachUsername, gameId);
    const state = projectGame(game, await this.actionsOf(game.id));
    const action = refusing(() => markAttendance(game, state, presentPlayerIds));

    await this.gameRepository.append(game.id, [{ kind: action.kind, payload: payloadOf(action) }]);

    return this.viewOf(game);
  }

  /** Two players trading places in the round being planned. */
  async swapPlayersForCoach(
    coachUsername: string,
    gameId: string,
    playerIds: [string, string],
  ): Promise<GameView> {
    const game = await this.ownedGame(coachUsername, gameId);
    const state = projectGame(game, await this.actionsOf(game.id));
    const action = refusing(() => swapPlayers(state, playerIds));

    await this.gameRepository.append(game.id, [{ kind: action.kind, payload: payloadOf(action) }]);

    return this.viewOf(game);
  }

  /** The coach asking the engine again for the round being planned. */
  async resetPlanForCoach(coachUsername: string, gameId: string): Promise<GameView> {
    const game = await this.ownedGame(coachUsername, gameId);
    const state = projectGame(game, await this.actionsOf(game.id));
    const action = refusing(() => resetPlan(state));

    await this.gameRepository.append(game.id, [{ kind: action.kind, payload: payloadOf(action) }]);

    return this.viewOf(game);
  }

  /** The coach taking the planned round onto the field. */
  async useLineupForCoach(coachUsername: string, gameId: string): Promise<GameView> {
    const game = await this.ownedGame(coachUsername, gameId);
    const state = projectGame(game, await this.actionsOf(game.id));
    const action = refusing(() => useLineup(game, state));

    await this.gameRepository.append(game.id, [{ kind: action.kind, payload: payloadOf(action) }]);

    return this.viewOf(game);
  }

  /** The coach calling the players in, which ends the round on the field by planning the next. */
  async takeSubsForCoach(coachUsername: string, gameId: string): Promise<GameView> {
    const game = await this.ownedGame(coachUsername, gameId);
    const state = projectGame(game, await this.actionsOf(game.id));
    const action = refusing(() => takeSubs(state));

    await this.gameRepository.append(game.id, [{ kind: action.kind, payload: payloadOf(action) }]);

    return this.viewOf(game);
  }

  private async viewOf(game: Game): Promise<GameView> {
    const state = projectGame(game, await this.actionsOf(game.id));

    return {
      game,
      state,
      plan: state.plannedRound === undefined ? undefined : planRound(game, state),
    };
  }

  private async actionsOf(gameId: string): Promise<GameAction[]> {
    const rows = await this.gameRepository.findActions(gameId);
    return rows
      .map((row) => gameActionFrom(row.kind, row.payload))
      .filter((action) => action !== undefined);
  }

  private async ownedGame(coachUsername: string, gameId: string): Promise<Game> {
    const game = await this.gameRepository.findById(gameId);
    if (!game) throw new NotFoundException('Game not found.');

    const team = await this.teamService.findById(game.teamId);
    if (!team) throw new NotFoundException('Team not found.');
    if (team.coachUsername !== normalizeCoachUsername(coachUsername)) {
      throw new ForbiddenException('Sorry, that is not your game.');
    }

    return game;
  }

  /**
   * An unknown team and someone else's team are told apart rather than flattened into one
   * answer, because this app keeps no secrets and a coach deserves a comprehensible error.
   */
  private async ownedTeam(coachUsername: string, teamId: string): Promise<Team> {
    const team = await this.teamService.findById(teamId);
    if (!team) throw new NotFoundException('Team not found.');
    if (team.coachUsername !== normalizeCoachUsername(coachUsername)) {
      throw new ForbiddenException('Sorry, that is not your team.');
    }
    return team;
  }
}
