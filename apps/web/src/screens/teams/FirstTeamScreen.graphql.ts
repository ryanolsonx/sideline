import { graphql } from '../../gql';

export const CreateTeamMutation = graphql(`
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      id
      name
      players {
        id
        name
      }
    }
  }
`);
