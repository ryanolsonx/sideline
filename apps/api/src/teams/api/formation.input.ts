import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@InputType()
export class FormationInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  defender!: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  forward!: number;
}
