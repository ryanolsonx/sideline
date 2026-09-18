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

export type BeginGameInput = {
  gameId: Scalars['ID']['input'];
  presentPlayerIds: Array<Scalars['ID']['input']>;
};

export type CreateTeamInput = {
  formation: FormationInput;
  name: Scalars['String']['input'];
  players: Array<Scalars['String']['input']>;
};

export type Formation = {
  __typename?: 'Formation';
  defender: Scalars['Int']['output'];
  forward: Scalars['Int']['output'];
};

export type FormationInput = {
  defender: Scalars['Int']['input'];
  forward: Scalars['Int']['input'];
};

export type Game = {
  __typename?: 'Game';
  attendanceConfirmed: Scalars['Boolean']['output'];
  currentRound?: Maybe<Round>;
  formation: Formation;
  id: Scalars['ID']['output'];
  lifecycle: GameLifecycle;
  plannedRound?: Maybe<Round>;
  players: Array<GamePlayer>;
  startedAt: Scalars['DateTime']['output'];
  teamId: Scalars['ID']['output'];
};

export enum GameLifecycle {
  Abandoned = 'ABANDONED',
  Ended = 'ENDED',
  Live = 'LIVE',
  Setup = 'SETUP'
}

export type GamePlayer = {
  __typename?: 'GamePlayer';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  present: Scalars['Boolean']['output'];
};

export type MarkAttendanceInput = {
  gameId: Scalars['ID']['input'];
  presentPlayerIds: Array<Scalars['ID']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  beginGame: Game;
  createTeam: Team;
  markAttendance: Game;
  resetPlan: Game;
  startGame: Game;
  swapPlayers: Game;
  updateTeam: Team;
  updateTeamFormation: Team;
  updateTeamRoster: Team;
  useLineup: Game;
};


export type MutationBeginGameArgs = {
  input: BeginGameInput;
};


export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
};


export type MutationMarkAttendanceArgs = {
  input: MarkAttendanceInput;
};


export type MutationResetPlanArgs = {
  input: ResetPlanInput;
};


export type MutationStartGameArgs = {
  input: StartGameInput;
};


export type MutationSwapPlayersArgs = {
  input: SwapPlayersInput;
};


export type MutationUpdateTeamArgs = {
  input: UpdateTeamInput;
};


export type MutationUpdateTeamFormationArgs = {
  input: UpdateTeamFormationInput;
};


export type MutationUpdateTeamRosterArgs = {
  input: UpdateTeamRosterInput;
};


export type MutationUseLineupArgs = {
  input: UseLineupInput;
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
  game: Game;
  team: Team;
  teams: Array<Team>;
};


export type QueryGameArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTeamArgs = {
  id: Scalars['String']['input'];
};

export type ResetPlanInput = {
  gameId: Scalars['ID']['input'];
};

export type Round = {
  __typename?: 'Round';
  number: Scalars['Int']['output'];
  out: Array<GamePlayer>;
  slots: Array<RoundSlot>;
};

export type RoundSlot = {
  __typename?: 'RoundSlot';
  player?: Maybe<GamePlayer>;
  position: Position;
};

export type StartGameInput = {
  teamId: Scalars['ID']['input'];
};

export type SwapPlayersInput = {
  gameId: Scalars['ID']['input'];
  playerIds: Array<Scalars['ID']['input']>;
};

export type Team = {
  __typename?: 'Team';
  createdAt: Scalars['DateTime']['output'];
  formation: Formation;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  players: Array<Player>;
};

export type UpdateTeamFormationInput = {
  formation: FormationInput;
  id: Scalars['ID']['input'];
};

export type UpdateTeamInput = {
  formation: FormationInput;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  players: Array<Scalars['String']['input']>;
};

export type UpdateTeamRosterInput = {
  id: Scalars['ID']['input'];
  players: Array<Scalars['String']['input']>;
};

export type UseLineupInput = {
  gameId: Scalars['ID']['input'];
};

export type GameQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GameQuery = { __typename?: 'Query', game: (
    { __typename?: 'Game', id: string, teamId: string, lifecycle: GameLifecycle, attendanceConfirmed: boolean, plannedRound?: { __typename?: 'Round', number: number } | null }
    & { ' $fragmentRefs'?: { 'GameSetupScreen_GameFragment': GameSetupScreen_GameFragment;'RoundPlanScreen_GameFragment': RoundPlanScreen_GameFragment;'RoundScreen_GameFragment': RoundScreen_GameFragment } }
  ) };

export type StartGameMutationVariables = Exact<{
  input: StartGameInput;
}>;


export type StartGameMutation = { __typename?: 'Mutation', startGame: (
    { __typename?: 'Game', id: string, teamId: string }
    & { ' $fragmentRefs'?: { 'GameSetupScreen_GameFragment': GameSetupScreen_GameFragment } }
  ) };

export type BeginGameMutationVariables = Exact<{
  input: BeginGameInput;
}>;


export type BeginGameMutation = { __typename?: 'Mutation', beginGame: (
    { __typename?: 'Game', id: string, lifecycle: GameLifecycle, attendanceConfirmed: boolean, plannedRound?: { __typename?: 'Round', number: number } | null }
    & { ' $fragmentRefs'?: { 'GameSetupScreen_GameFragment': GameSetupScreen_GameFragment;'RoundPlanScreen_GameFragment': RoundPlanScreen_GameFragment } }
  ) };

export type ResetPlanMutationVariables = Exact<{
  input: ResetPlanInput;
}>;


export type ResetPlanMutation = { __typename?: 'Mutation', resetPlan: (
    { __typename?: 'Game', id: string }
    & { ' $fragmentRefs'?: { 'RoundPlanScreen_GameFragment': RoundPlanScreen_GameFragment } }
  ) };

export type SwapPlayersMutationVariables = Exact<{
  input: SwapPlayersInput;
}>;


export type SwapPlayersMutation = { __typename?: 'Mutation', swapPlayers: (
    { __typename?: 'Game', id: string }
    & { ' $fragmentRefs'?: { 'RoundPlanScreen_GameFragment': RoundPlanScreen_GameFragment } }
  ) };

export type UseLineupMutationVariables = Exact<{
  input: UseLineupInput;
}>;


export type UseLineupMutation = { __typename?: 'Mutation', useLineup: (
    { __typename?: 'Game', id: string, lifecycle: GameLifecycle, attendanceConfirmed: boolean, plannedRound?: { __typename?: 'Round', number: number } | null }
    & { ' $fragmentRefs'?: { 'RoundPlanScreen_GameFragment': RoundPlanScreen_GameFragment;'RoundScreen_GameFragment': RoundScreen_GameFragment } }
  ) };

export type GameSetupScreen_GameFragment = { __typename?: 'Game', id: string, players: Array<{ __typename?: 'GamePlayer', id: string, name: string, present: boolean }> } & { ' $fragmentName'?: 'GameSetupScreen_GameFragment' };

export type RoundLineup_RoundFragment = { __typename?: 'Round', number: number, out: Array<{ __typename?: 'GamePlayer', id: string, name: string }>, slots: Array<{ __typename?: 'RoundSlot', position: Position, player?: { __typename?: 'GamePlayer', id: string, name: string } | null }> } & { ' $fragmentName'?: 'RoundLineup_RoundFragment' };

export type RoundPlanScreen_GameFragment = { __typename?: 'Game', plannedRound?: (
    { __typename?: 'Round', number: number }
    & { ' $fragmentRefs'?: { 'RoundLineup_RoundFragment': RoundLineup_RoundFragment } }
  ) | null } & { ' $fragmentName'?: 'RoundPlanScreen_GameFragment' };

export type RoundScreen_GameFragment = { __typename?: 'Game', currentRound?: (
    { __typename?: 'Round', number: number }
    & { ' $fragmentRefs'?: { 'RoundLineup_RoundFragment': RoundLineup_RoundFragment } }
  ) | null } & { ' $fragmentName'?: 'RoundScreen_GameFragment' };

export type CreateTeamMutationVariables = Exact<{
  input: CreateTeamInput;
}>;


export type CreateTeamMutation = { __typename?: 'Mutation', createTeam: { __typename?: 'Team', id: string, name: string, players: Array<{ __typename?: 'Player', id: string, name: string }>, formation: { __typename?: 'Formation', defender: number, forward: number } } };

export type TeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type TeamsQuery = { __typename?: 'Query', teams: Array<{ __typename?: 'Team', id: string, name: string, players: Array<{ __typename?: 'Player', id: string, name: string }>, formation: { __typename?: 'Formation', defender: number, forward: number } }> };

export type UpdateTeamRosterMutationVariables = Exact<{
  input: UpdateTeamRosterInput;
}>;


export type UpdateTeamRosterMutation = { __typename?: 'Mutation', updateTeamRoster: { __typename?: 'Team', id: string } };

export type UpdateTeamFormationMutationVariables = Exact<{
  input: UpdateTeamFormationInput;
}>;


export type UpdateTeamFormationMutation = { __typename?: 'Mutation', updateTeamFormation: { __typename?: 'Team', id: string } };

export type UpdateTeamMutationVariables = Exact<{
  input: UpdateTeamInput;
}>;


export type UpdateTeamMutation = { __typename?: 'Mutation', updateTeam: { __typename?: 'Team', id: string } };

export const GameSetupScreen_GameFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GameSetupScreen_Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"present"}}]}}]}}]} as unknown as DocumentNode<GameSetupScreen_GameFragment, unknown>;
export const RoundLineup_RoundFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundLineup_Round"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Round"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"out"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RoundLineup_RoundFragment, unknown>;
export const RoundPlanScreen_GameFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundPlanScreen_Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plannedRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoundLineup_Round"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundLineup_Round"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Round"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"out"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RoundPlanScreen_GameFragment, unknown>;
export const RoundScreen_GameFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundScreen_Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoundLineup_Round"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundLineup_Round"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Round"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"out"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RoundScreen_GameFragment, unknown>;
export const GameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Game"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"Field","name":{"kind":"Name","value":"lifecycle"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceConfirmed"}},{"kind":"Field","name":{"kind":"Name","value":"plannedRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"GameSetupScreen_Game"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoundPlanScreen_Game"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoundScreen_Game"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundLineup_Round"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Round"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"out"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GameSetupScreen_Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"present"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundPlanScreen_Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plannedRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoundLineup_Round"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundScreen_Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoundLineup_Round"}}]}}]}}]} as unknown as DocumentNode<GameQuery, GameQueryVariables>;
export const StartGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StartGameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"teamId"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"GameSetupScreen_Game"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GameSetupScreen_Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"present"}}]}}]}}]} as unknown as DocumentNode<StartGameMutation, StartGameMutationVariables>;
export const BeginGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BeginGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BeginGameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"beginGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lifecycle"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceConfirmed"}},{"kind":"Field","name":{"kind":"Name","value":"plannedRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"GameSetupScreen_Game"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoundPlanScreen_Game"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundLineup_Round"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Round"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"out"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GameSetupScreen_Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"present"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundPlanScreen_Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plannedRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoundLineup_Round"}}]}}]}}]} as unknown as DocumentNode<BeginGameMutation, BeginGameMutationVariables>;
export const ResetPlanDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPlan"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResetPlanInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPlan"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoundPlanScreen_Game"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundLineup_Round"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Round"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"out"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundPlanScreen_Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plannedRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoundLineup_Round"}}]}}]}}]} as unknown as DocumentNode<ResetPlanMutation, ResetPlanMutationVariables>;
export const SwapPlayersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SwapPlayers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SwapPlayersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swapPlayers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoundPlanScreen_Game"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundLineup_Round"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Round"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"out"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundPlanScreen_Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plannedRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoundLineup_Round"}}]}}]}}]} as unknown as DocumentNode<SwapPlayersMutation, SwapPlayersMutationVariables>;
export const UseLineupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UseLineup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UseLineupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"useLineup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lifecycle"}},{"kind":"Field","name":{"kind":"Name","value":"attendanceConfirmed"}},{"kind":"Field","name":{"kind":"Name","value":"plannedRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoundPlanScreen_Game"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoundScreen_Game"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundLineup_Round"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Round"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"Field","name":{"kind":"Name","value":"out"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slots"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundPlanScreen_Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"plannedRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoundLineup_Round"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoundScreen_Game"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"number"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoundLineup_Round"}}]}}]}}]} as unknown as DocumentNode<UseLineupMutation, UseLineupMutationVariables>;
export const CreateTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTeamInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"formation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defender"}},{"kind":"Field","name":{"kind":"Name","value":"forward"}}]}}]}}]}}]} as unknown as DocumentNode<CreateTeamMutation, CreateTeamMutationVariables>;
export const TeamsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"players"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"formation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defender"}},{"kind":"Field","name":{"kind":"Name","value":"forward"}}]}}]}}]}}]} as unknown as DocumentNode<TeamsQuery, TeamsQueryVariables>;
export const UpdateTeamRosterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTeamRoster"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTeamRosterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTeamRoster"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateTeamRosterMutation, UpdateTeamRosterMutationVariables>;
export const UpdateTeamFormationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTeamFormation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTeamFormationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTeamFormation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateTeamFormationMutation, UpdateTeamFormationMutationVariables>;
export const UpdateTeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTeam"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTeamInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTeam"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateTeamMutation, UpdateTeamMutationVariables>;