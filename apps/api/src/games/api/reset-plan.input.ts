import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class ResetPlanInput {
  @Field(() => ID)
  @IsUUID()
  gameId!: string;
}
