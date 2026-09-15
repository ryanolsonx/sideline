import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { FormationDto } from '../../teams/api/team.dto';
import { GameLifecycle } from '../domain/game.model';
import { Position } from '../domain/lineup';

export enum GameLifecycleDto {
  SETUP = 'SETUP',
  LIVE = 'LIVE',
  ENDED = 'ENDED',
  ABANDONED = 'ABANDONED',
}

registerEnumType(GameLifecycleDto, { name: 'GameLifecycle' });

export enum PositionDto {
  GOALIE = 'GOALIE',
  DEFENDER = 'DEFENDER',
  FORWARD = 'FORWARD',
}

registerEnumType(PositionDto, { name: 'Position' });

@ObjectType('GamePlayer')
export class GamePlayerDto {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  present!: boolean;
}

/** One place in the formation. A short-handed side leaves the place with nobody in it. */
@ObjectType('RoundSlot')
export class RoundSlotDto {
  @Field(() => PositionDto)
  position!: Position;

  @Field(() => GamePlayerDto, { nullable: true })
  player?: GamePlayerDto;
}

@ObjectType('Round')
export class RoundDto {
  @Field(() => Int)
  number!: number;

  @Field(() => [GamePlayerDto])
  out!: GamePlayerDto[];

  @Field(() => [RoundSlotDto])
  slots!: RoundSlotDto[];
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

  @Field(() => RoundDto, { nullable: true })
  currentRound?: RoundDto;
}
