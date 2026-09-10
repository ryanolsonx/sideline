import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { FormationInput } from './formation.input';

@InputType()
export class UpdateTeamFormationInput {
  @Field(() => ID)
  @IsUUID()
  id!: string;

  @Field(() => FormationInput)
  formation!: FormationInput;
}
