/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query Game($id: ID!) {\n    game(id: $id) {\n      id\n      teamId\n      lifecycle\n      ...GameSetupScreen_Game\n      ...RoundScreen_Game\n    }\n  }\n": typeof types.GameDocument,
    "\n  mutation StartGame($input: StartGameInput!) {\n    startGame(input: $input) {\n      id\n      teamId\n      ...GameSetupScreen_Game\n    }\n  }\n": typeof types.StartGameDocument,
    "\n  mutation BeginGame($input: BeginGameInput!) {\n    beginGame(input: $input) {\n      id\n      lifecycle\n      ...GameSetupScreen_Game\n      ...RoundScreen_Game\n    }\n  }\n": typeof types.BeginGameDocument,
    "\n  fragment GameSetupScreen_Game on Game {\n    id\n    players {\n      id\n      name\n      present\n    }\n  }\n": typeof types.GameSetupScreen_GameFragmentDoc,
    "\n  fragment RoundScreen_Game on Game {\n    currentRound {\n      number\n      out {\n        id\n        name\n      }\n      slots {\n        position\n        player {\n          id\n          name\n        }\n      }\n    }\n  }\n": typeof types.RoundScreen_GameFragmentDoc,
    "\n  query MatchesScreen_Matches {\n    matches {\n      id\n      name\n      createdAt\n    }\n  }\n": typeof types.MatchesScreen_MatchesDocument,
    "\n  mutation MatchesScreen_CreateMatch($input: CreateMatchInput!) {\n    createMatch(input: $input) {\n      id\n      name\n      createdAt\n    }\n  }\n": typeof types.MatchesScreen_CreateMatchDocument,
    "\n  mutation CreateTeam($input: CreateTeamInput!) {\n    createTeam(input: $input) {\n      id\n      name\n      players {\n        id\n        name\n      }\n      formation {\n        defender\n        forward\n      }\n    }\n  }\n": typeof types.CreateTeamDocument,
    "\n  query Teams {\n    teams {\n      id\n      name\n      players {\n        id\n        name\n      }\n      formation {\n        defender\n        forward\n      }\n    }\n  }\n": typeof types.TeamsDocument,
    "\n  mutation UpdateTeamRoster($input: UpdateTeamRosterInput!) { updateTeamRoster(input: $input) { id } }\n": typeof types.UpdateTeamRosterDocument,
    "\n  mutation UpdateTeamFormation($input: UpdateTeamFormationInput!) { updateTeamFormation(input: $input) { id } }\n": typeof types.UpdateTeamFormationDocument,
    "\n  mutation UpdateTeam($input: UpdateTeamInput!) { updateTeam(input: $input) { id } }\n": typeof types.UpdateTeamDocument,
};
const documents: Documents = {
    "\n  query Game($id: ID!) {\n    game(id: $id) {\n      id\n      teamId\n      lifecycle\n      ...GameSetupScreen_Game\n      ...RoundScreen_Game\n    }\n  }\n": types.GameDocument,
    "\n  mutation StartGame($input: StartGameInput!) {\n    startGame(input: $input) {\n      id\n      teamId\n      ...GameSetupScreen_Game\n    }\n  }\n": types.StartGameDocument,
    "\n  mutation BeginGame($input: BeginGameInput!) {\n    beginGame(input: $input) {\n      id\n      lifecycle\n      ...GameSetupScreen_Game\n      ...RoundScreen_Game\n    }\n  }\n": types.BeginGameDocument,
    "\n  fragment GameSetupScreen_Game on Game {\n    id\n    players {\n      id\n      name\n      present\n    }\n  }\n": types.GameSetupScreen_GameFragmentDoc,
    "\n  fragment RoundScreen_Game on Game {\n    currentRound {\n      number\n      out {\n        id\n        name\n      }\n      slots {\n        position\n        player {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.RoundScreen_GameFragmentDoc,
    "\n  query MatchesScreen_Matches {\n    matches {\n      id\n      name\n      createdAt\n    }\n  }\n": types.MatchesScreen_MatchesDocument,
    "\n  mutation MatchesScreen_CreateMatch($input: CreateMatchInput!) {\n    createMatch(input: $input) {\n      id\n      name\n      createdAt\n    }\n  }\n": types.MatchesScreen_CreateMatchDocument,
    "\n  mutation CreateTeam($input: CreateTeamInput!) {\n    createTeam(input: $input) {\n      id\n      name\n      players {\n        id\n        name\n      }\n      formation {\n        defender\n        forward\n      }\n    }\n  }\n": types.CreateTeamDocument,
    "\n  query Teams {\n    teams {\n      id\n      name\n      players {\n        id\n        name\n      }\n      formation {\n        defender\n        forward\n      }\n    }\n  }\n": types.TeamsDocument,
    "\n  mutation UpdateTeamRoster($input: UpdateTeamRosterInput!) { updateTeamRoster(input: $input) { id } }\n": types.UpdateTeamRosterDocument,
    "\n  mutation UpdateTeamFormation($input: UpdateTeamFormationInput!) { updateTeamFormation(input: $input) { id } }\n": types.UpdateTeamFormationDocument,
    "\n  mutation UpdateTeam($input: UpdateTeamInput!) { updateTeam(input: $input) { id } }\n": types.UpdateTeamDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Game($id: ID!) {\n    game(id: $id) {\n      id\n      teamId\n      lifecycle\n      ...GameSetupScreen_Game\n      ...RoundScreen_Game\n    }\n  }\n"): (typeof documents)["\n  query Game($id: ID!) {\n    game(id: $id) {\n      id\n      teamId\n      lifecycle\n      ...GameSetupScreen_Game\n      ...RoundScreen_Game\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation StartGame($input: StartGameInput!) {\n    startGame(input: $input) {\n      id\n      teamId\n      ...GameSetupScreen_Game\n    }\n  }\n"): (typeof documents)["\n  mutation StartGame($input: StartGameInput!) {\n    startGame(input: $input) {\n      id\n      teamId\n      ...GameSetupScreen_Game\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation BeginGame($input: BeginGameInput!) {\n    beginGame(input: $input) {\n      id\n      lifecycle\n      ...GameSetupScreen_Game\n      ...RoundScreen_Game\n    }\n  }\n"): (typeof documents)["\n  mutation BeginGame($input: BeginGameInput!) {\n    beginGame(input: $input) {\n      id\n      lifecycle\n      ...GameSetupScreen_Game\n      ...RoundScreen_Game\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment GameSetupScreen_Game on Game {\n    id\n    players {\n      id\n      name\n      present\n    }\n  }\n"): (typeof documents)["\n  fragment GameSetupScreen_Game on Game {\n    id\n    players {\n      id\n      name\n      present\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment RoundScreen_Game on Game {\n    currentRound {\n      number\n      out {\n        id\n        name\n      }\n      slots {\n        position\n        player {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment RoundScreen_Game on Game {\n    currentRound {\n      number\n      out {\n        id\n        name\n      }\n      slots {\n        position\n        player {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MatchesScreen_Matches {\n    matches {\n      id\n      name\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query MatchesScreen_Matches {\n    matches {\n      id\n      name\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation MatchesScreen_CreateMatch($input: CreateMatchInput!) {\n    createMatch(input: $input) {\n      id\n      name\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  mutation MatchesScreen_CreateMatch($input: CreateMatchInput!) {\n    createMatch(input: $input) {\n      id\n      name\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTeam($input: CreateTeamInput!) {\n    createTeam(input: $input) {\n      id\n      name\n      players {\n        id\n        name\n      }\n      formation {\n        defender\n        forward\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTeam($input: CreateTeamInput!) {\n    createTeam(input: $input) {\n      id\n      name\n      players {\n        id\n        name\n      }\n      formation {\n        defender\n        forward\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Teams {\n    teams {\n      id\n      name\n      players {\n        id\n        name\n      }\n      formation {\n        defender\n        forward\n      }\n    }\n  }\n"): (typeof documents)["\n  query Teams {\n    teams {\n      id\n      name\n      players {\n        id\n        name\n      }\n      formation {\n        defender\n        forward\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTeamRoster($input: UpdateTeamRosterInput!) { updateTeamRoster(input: $input) { id } }\n"): (typeof documents)["\n  mutation UpdateTeamRoster($input: UpdateTeamRosterInput!) { updateTeamRoster(input: $input) { id } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTeamFormation($input: UpdateTeamFormationInput!) { updateTeamFormation(input: $input) { id } }\n"): (typeof documents)["\n  mutation UpdateTeamFormation($input: UpdateTeamFormationInput!) { updateTeamFormation(input: $input) { id } }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTeam($input: UpdateTeamInput!) { updateTeam(input: $input) { id } }\n"): (typeof documents)["\n  mutation UpdateTeam($input: UpdateTeamInput!) { updateTeam(input: $input) { id } }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;