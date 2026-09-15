import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { FormationDto } from '../../teams/api/team.dto';
import { GameLifecycle } from '../domain/game.model';

export enum GameLifecycleDto {
  SETUP = 'SETUP',
  LIVE = 'LIVE',
  ENDED = 'ENDED',
  ABANDONED = 'ABANDONED',
}

registerEnumType(GameLifecycleDto, { name: 'GameLifecycle' });

@ObjectType('GamePlayer')
export class GamePlayerDto {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  present!: boolean;
}

@ObjectType('Game')
export class GameDto {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  teamId!: string;

  @Field()
  startedAt!: Date;

  @Field(() => FormationDto)
  formation!: FormationDto;

  @Field(() => GameLifecycleDto)
  lifecycle!: GameLifecycle;

  @Field()
  attendanceConfirmed!: boolean;

  @Field(() => [GamePlayerDto])
  players!: GamePlayerDto[];
}
