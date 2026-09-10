import { Field, ID, InputType } from '@nestjs/graphql';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

@InputType()
export class UpdateTeamRosterInput {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(80, { each: true })
  players!: string[];
}
