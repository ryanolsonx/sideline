import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TeamService } from '../service/team.service';
import { coachUsernameFromCookieHeader } from './coach-username';
import { CreateTeamInput } from './create-team.input';
import { TeamDto } from './team.dto';
import { UpdateTeamRosterInput } from './update-team-roster.input';
import { UpdateTeamFormationInput } from './update-team-formation.input';
import { UpdateTeamInput } from './update-team.input';

@Resolver(() => TeamDto)
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Query(() => [TeamDto])
  teams(@Context('req') request: { headers: { cookie?: string } }): Promise<TeamDto[]> {
    return this.teamService.findAllForCoach(
      coachUsernameFromCookieHeader(request.headers.cookie),
    );
  }

  @Query(() => TeamDto)
  team(
    @Context('req') request: { headers: { cookie?: string } },
    @Args('id') id: string,
  ): Promise<TeamDto> {
    return this.teamService.findForCoach(
      coachUsernameFromCookieHeader(request.headers.cookie),
      id,
    );
  }

  @Mutation(() => TeamDto)
  createTeam(
    @Context('req') request: { headers: { cookie?: string } },
    @Args('input') input: CreateTeamInput,
  ): Promise<TeamDto> {
    return this.teamService.createForCoach(
      coachUsernameFromCookieHeader(request.headers.cookie),
      input.name,
      input.players,
      input.formation,
    );
  }

  @Mutation(() => TeamDto)
  updateTeamRoster(
    @Context('req') request: { headers: { cookie?: string } },
    @Args('input') input: UpdateTeamRosterInput,
  ): Promise<TeamDto> {
    return this.teamService.updateRosterForCoach(
      coachUsernameFromCookieHeader(request.headers.cookie),
      input.id,
      input.players,
    );
  }

  @Mutation(() => TeamDto)
  updateTeamFormation(
    @Context('req') request: { headers: { cookie?: string } },
    @Args('input') input: UpdateTeamFormationInput,
  ): Promise<TeamDto> {
    return this.teamService.updateFormationForCoach(
      coachUsernameFromCookieHeader(request.headers.cookie),
      input.id,
      input.formation,
    );
  }

  @Mutation(() => TeamDto)
  updateTeam(@Context('req') request: { headers: { cookie?: string } }, @Args('input') input: UpdateTeamInput): Promise<TeamDto> {
    return this.teamService.updateForCoach(coachUsernameFromCookieHeader(request.headers.cookie), input.id, input.players, input.formation);
  }
}
