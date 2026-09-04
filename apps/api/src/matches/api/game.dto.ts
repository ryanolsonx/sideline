import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PlayerDto, TeamDto } from '../../teams/api/team.dto';

export enum GameStatus {
  ACTIVE = 'ACTIVE',
  COMPLETE = 'COMPLETE',
}

export enum AssignmentStatus {
  PLAYING = 'PLAYING',
  OUT = 'OUT',
}

export enum Position {
  GOALIE = 'GOALIE',
  DEFENDER = 'DEFENDER',
  FORWARD = 'FORWARD',
}

registerEnumType(GameStatus, { name: 'GameStatus' });
registerEnumType(AssignmentStatus, { name: 'AssignmentStatus' });
registerEnumType(Position, { name: 'Position' });

@ObjectType('GameRoundAssignment')
export class GameRoundAssignmentDto {
  @Field(() => ID)
  id!: string;

  @Field(() => AssignmentStatus)
  status!: 'PLAYING' | 'OUT';

  @Field(() => Position, { nullable: true })
  position!: 'GOALIE' | 'DEFENDER' | 'FORWARD' | null;

  @Field(() => PlayerDto)
  player!: PlayerDto;
}

@ObjectType('GameRound')
export class GameRoundDto {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  number!: number;

  @Field(() => [GameRoundAssignmentDto])
  assignments!: GameRoundAssignmentDto[];
}

@ObjectType('Game')
export class GameDto {
  @Field(() => ID)
  id!: string;

  @Field(() => TeamDto)
  team!: TeamDto;

  @Field(() => Int)
  fieldSize!: number;

  @Field(() => GameStatus)
  status!: 'ACTIVE' | 'COMPLETE';

  @Field(() => Int)
  currentRound!: number;

  @Field()
  startedAt!: Date;

  @Field(() => [GameRoundDto])
  rounds!: GameRoundDto[];
}
