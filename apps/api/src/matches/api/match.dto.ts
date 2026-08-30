import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Match')
export class MatchDto {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  createdAt!: Date;
}
