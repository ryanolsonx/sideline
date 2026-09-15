import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsUUID } from 'class-validator';

@InputType()
export class MarkAttendanceInput {
  @Field(() => ID)
  @IsUUID()
  gameId!: string;

  @Field(() => [ID])
  @IsArray()
  @IsUUID('4', { each: true })
  presentPlayerIds!: string[];
}
