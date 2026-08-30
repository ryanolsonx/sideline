import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateMatchInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;
}
