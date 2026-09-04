/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export enum AssignmentStatus {
  Out = 'OUT',
  Playing = 'PLAYING'
}

export type CreateMatchInput = {
  name: Scalars['String']['input'];
};

export type CreateTeamInput = {
  name: Scalars['String']['input'];
  players: Array<Scalars['String']['input']>;
};

export type Game = {
  __typename?: 'Game';
  currentRound: Scalars['Int']['output'];
  fieldSize: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  rounds: Array<GameRound>;
  startedAt: Scalars['DateTime']['output'];
  status: GameStatus;
  team: Team;
};

export type GameRound = {
  __typename?: 'GameRound';
  assignments: Array<GameRoundAssignment>;
  id: Scalars['ID']['output'];
  number: Scalars['Int']['output'];
};

export type GameRoundAssignment = {
  __typename?: 'GameRoundAssignment';
  id: Scalars['ID']['output'];
  player: Player;
  position?: Maybe<Position>;
  status: AssignmentStatus;
};

export enum GameStatus {
  Active = 'ACTIVE',
  Complete = 'COMPLETE'
}

export type Match = {
  __typename?: 'Match';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  advanceGame: Game;
  createMatch: Match;
  createTeam: Team;
  startGame: Game;
};


export type MutationAdvanceGameArgs = {
  gameId: Scalars['String']['input'];
};


export type MutationCreateMatchArgs = {
  input: CreateMatchInput;
};


export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
};


export type MutationStartGameArgs = {
  input: StartGameInput;
};

export type Player = {
  __typename?: 'Player';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export enum Position {
  Defender = 'DEFENDER',
  Forward = 'FORWARD',
  Goalie = 'GOALIE'
}

export type Query = {
  __typename?: 'Query';
  activeGame?: Maybe<Game>;
  matches: Array<Match>;
  teams: Array<Team>;
};


export type QueryActiveGameArgs = {
  teamId: Scalars['String']['input'];
};

export type StartGameInput = {
  fieldSize: Scalars['Int']['input'];
  presentPlayerIds: Array<Scalars['ID']['input']>;
  teamId: Scalars['ID']['input'];
};

export type Team = {
  __typename?: 'Team';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  players: Array<Player>;
};

export type GameFlow_GameFragment = { __typename?: 'Game', id: string, fieldSize: number, status: GameStatus, currentRound: number, rounds: Array<{ __typename?: 'GameRound', id: string, number: number, assignments: Array<{ __typename?: 'GameRoundAssignment', id: string, status: AssignmentStatus, position?: Position | null, player: { __typename?: 'Player', id: string, name: string } }> }> } & { ' $fragmentName'?: 'GameFlow_GameFragment' };

export type GameFlow_StartGameMutationVariables = Exact<{
  input: StartGameInput;
}>;


export type GameFlow_StartGameMutation = { __typename?: 'Mutation', startGame: (
    { __typename?: 'Game' }
    & { ' $fragmentRefs'?: { 'GameFlow_GameFragment': GameFlow_GameFragment } }
  ) };

export type GameFlow_AdvanceGameMutationVariables = Exact<{
  gameId: Scalars['String']['input'];
}>;


export type GameFlow_AdvanceGameMutation = { __typename?: 'Mutation', advanceGame: (
    { __typename?: 'Game' }
    & { ' $fragmentRefs'?: { 'GameFlow_GameFragment': GameFlow_GameFragment } }
  ) };

export type CreateTeamMutationVariables = Exact<{
  input: CreateTeamInput;
}>;


export type CreateTeamMutation = { __typename?: 'Mutation', createTeam: { __typename?: 'Team', id: string, name: string, players: Array<{ __typename?: 'Player', id: string, name: string }> } };

export type TeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type TeamsQuery = { __typename?: 'Query', teams: Array<{ __typename?: 'Team', id: string, name: string, players: Array<{ __typename?: 'Player', id: string, name: string }> }> };

export const GameFlow_GameFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GameFlow_Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fieldSize"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"currentRound"}},{"kind":"Field","name":{"kind":"Name","value":"rounds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"assignments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GameFlow_GameFragment, unknown>;
export const GameFlow_StartGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GameFlow_StartGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartGameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GameFlow_Game"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GameFlow_Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fieldSize"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"currentRound"}},{"kind":"Field","name":{"kind":"Name","value":"rounds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"assignments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GameFlow_StartGameMutation, GameFlow_StartGameMutationVariables>;
export const GameFlow_AdvanceGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GameFlow_AdvanceGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"advanceGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GameFlow_Game"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GameFlow_Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fieldSize"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"currentRound"}},{"kind":"Field","name":{"kind":"Name","value":"rounds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"assignments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GameFlow_AdvanceGameMutation, GameFlow_AdvanceGameMutationVariables>;
export const CreateTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTeamInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTeamMutation, CreateTeamMutationVariables>;
export const TeamsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<TeamsQuery, TeamsQueryVariables>;