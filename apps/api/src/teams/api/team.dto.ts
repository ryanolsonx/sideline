import { Field, ID, ObjectType } from '@nestjs/graphql';

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

  @Field()
  createdAt!: Date;
}
