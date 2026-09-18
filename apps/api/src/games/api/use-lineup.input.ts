import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UseLineupInput {
  @Field(() => ID)
  @IsUUID()
  gameId!: string;
}
