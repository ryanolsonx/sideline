import { graphql } from '../../gql';

export const MatchesQuery = graphql(/* GraphQL */ `
  query MatchesScreen_Matches {
    matches {
      id
      name
      createdAt
    }
  }
`);

export const CreateMatchMutation = graphql(/* GraphQL */ `
  mutation MatchesScreen_CreateMatch($input: CreateMatchInput!) {
    createMatch(input: $input) {
      id
      name
      createdAt
    }
  }
`);
