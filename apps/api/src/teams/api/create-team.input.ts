import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, MaxLength, ValidateNested } from 'class-validator';
import { FormationInput } from './formation.input';

@InputType()
export class CreateTeamInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name!: string;

  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MaxLength(80, { each: true })
  players!: string[];

  @Field(() => FormationInput)
  @ValidateNested()
  @Type(() => FormationInput)
  formation!: FormationInput;
}
