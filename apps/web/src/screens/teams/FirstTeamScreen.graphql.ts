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

export const TeamsQuery = graphql(`
  query Teams {
    teams {
      id
      name
      players {
        id
        name
      }
    }
  }
`);
