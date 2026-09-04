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
    "\n  fragment GameFlow_Game on Game {\n    id fieldSize status currentRound\n    rounds { id number assignments { id status position player { id name } } }\n  }\n": typeof types.GameFlow_GameFragmentDoc,
    "\n  mutation GameFlow_StartGame($input: StartGameInput!) {\n    startGame(input: $input) { ...GameFlow_Game }\n  }\n": typeof types.GameFlow_StartGameDocument,
    "\n  mutation CreateTeam($input: CreateTeamInput!) {\n    createTeam(input: $input) {\n      id\n      name\n      players {\n        id\n        name\n      }\n    }\n  }\n": typeof types.CreateTeamDocument,
    "\n  query Teams {\n    teams {\n      id\n      name\n      players {\n        id\n        name\n      }\n    }\n  }\n": typeof types.TeamsDocument,
};
const documents: Documents = {
    "\n  fragment GameFlow_Game on Game {\n    id fieldSize status currentRound\n    rounds { id number assignments { id status position player { id name } } }\n  }\n": types.GameFlow_GameFragmentDoc,
    "\n  mutation GameFlow_StartGame($input: StartGameInput!) {\n    startGame(input: $input) { ...GameFlow_Game }\n  }\n": types.GameFlow_StartGameDocument,
    "\n  mutation CreateTeam($input: CreateTeamInput!) {\n    createTeam(input: $input) {\n      id\n      name\n      players {\n        id\n        name\n      }\n    }\n  }\n": types.CreateTeamDocument,
    "\n  query Teams {\n    teams {\n      id\n      name\n      players {\n        id\n        name\n      }\n    }\n  }\n": types.TeamsDocument,
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
export function graphql(source: "\n  fragment GameFlow_Game on Game {\n    id fieldSize status currentRound\n    rounds { id number assignments { id status position player { id name } } }\n  }\n"): (typeof documents)["\n  fragment GameFlow_Game on Game {\n    id fieldSize status currentRound\n    rounds { id number assignments { id status position player { id name } } }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation GameFlow_StartGame($input: StartGameInput!) {\n    startGame(input: $input) { ...GameFlow_Game }\n  }\n"): (typeof documents)["\n  mutation GameFlow_StartGame($input: StartGameInput!) {\n    startGame(input: $input) { ...GameFlow_Game }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTeam($input: CreateTeamInput!) {\n    createTeam(input: $input) {\n      id\n      name\n      players {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTeam($input: CreateTeamInput!) {\n    createTeam(input: $input) {\n      id\n      name\n      players {\n        id\n        name\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Teams {\n    teams {\n      id\n      name\n      players {\n        id\n        name\n      }\n    }\n  }\n"): (typeof documents)["\n  query Teams {\n    teams {\n      id\n      name\n      players {\n        id\n        name\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;