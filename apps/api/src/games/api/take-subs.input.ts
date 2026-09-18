import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class TakeSubsInput {
  @Field(() => ID)
  @IsUUID()
  gameId!: string;
}
