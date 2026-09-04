import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { ArrayMinSize, IsArray, IsIn, IsUUID } from 'class-validator';

@InputType()
export class StartGameInput {
  @Field(() => ID)
  @IsUUID()
  teamId!: string;

  @Field(() => Int)
  @IsIn([5, 6])
  fieldSize!: 5 | 6;

  @Field(() => [ID])
  @IsArray()
  @ArrayMinSize(3)
  @IsUUID('4', { each: true })
  presentPlayerIds!: string[];
}
