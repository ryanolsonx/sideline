import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class StartGameInput {
  @Field(() => ID)
  @IsUUID()
  teamId!: string;
}
