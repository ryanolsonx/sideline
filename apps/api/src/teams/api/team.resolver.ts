import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TeamService } from '../service/team.service';
import { CreateTeamInput } from './create-team.input';
import { TeamDto } from './team.dto';

@Resolver(() => TeamDto)
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Query(() => [TeamDto])
  teams(): Promise<TeamDto[]> {
    return this.teamService.findAll();
  }

  @Mutation(() => TeamDto)
  createTeam(@Args('input') input: CreateTeamInput): Promise<TeamDto> {
    return this.teamService.create(input.name, input.players);
  }
}
