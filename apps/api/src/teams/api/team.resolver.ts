import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TeamService } from '../service/team.service';
import { optionalCoachUsernameFromCookieHeader } from './coach-username';
import { CreateTeamInput } from './create-team.input';
import { TeamDto } from './team.dto';

@Resolver(() => TeamDto)
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Query(() => [TeamDto])
  teams(@Context('req') request: { headers: { cookie?: string } }): Promise<TeamDto[]> {
    const coachUsername = optionalCoachUsernameFromCookieHeader(request.headers.cookie);
    return coachUsername
      ? this.teamService.findAllForCoach(coachUsername)
      : this.teamService.findAll();
  }

  @Mutation(() => TeamDto)
  createTeam(
    @Context('req') request: { headers: { cookie?: string } },
    @Args('input') input: CreateTeamInput,
  ): Promise<TeamDto> {
    const coachUsername = optionalCoachUsernameFromCookieHeader(request.headers.cookie);
    return coachUsername
      ? this.teamService.createForCoach(coachUsername, input.name, input.players)
      : this.teamService.create(input.name, input.players);
  }
}
