import { Type } from 'class-transformer';
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID, ValidateNested } from 'class-validator';
import { FormationInput } from './formation.input';

@InputType()
export class UpdateTeamFormationInput {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field(() => FormationInput)
  @ValidateNested()
  @Type(() => FormationInput)
  formation!: FormationInput;
}
