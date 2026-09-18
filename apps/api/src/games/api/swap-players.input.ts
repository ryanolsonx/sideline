import { ArrayMaxSize, ArrayMinSize, IsUUID } from 'class-validator';
import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class SwapPlayersInput {
  @Field(() => ID)
  @IsUUID()
  gameId!: string;

  /** The two players the coach tapped, in the order they were tapped. */
  @Field(() => [ID])
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsUUID('4', { each: true })
  playerIds!: [string, string];
}
