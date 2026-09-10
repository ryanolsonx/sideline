import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Formation')
export class FormationDto {
  @Field(() => Int)
  defender!: number;

  @Field(() => Int)
  forward!: number;
}

@ObjectType('Player')
export class PlayerDto {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;
}

@ObjectType('Team')
export class TeamDto {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => [PlayerDto])
  players!: PlayerDto[];

  @Field(() => FormationDto)
  formation!: FormationDto;

  @Field()
  createdAt!: Date;
}
