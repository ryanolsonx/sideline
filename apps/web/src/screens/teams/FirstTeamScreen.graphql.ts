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
      formation {
        defender
        forward
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
      formation {
        defender
        forward
      }
    }
  }
`);

export const UpdateTeamRosterMutation = graphql(`
  mutation UpdateTeamRoster($input: UpdateTeamRosterInput!) { updateTeamRoster(input: $input) { id } }
`);

export const UpdateTeamFormationMutation = graphql(`
  mutation UpdateTeamFormation($input: UpdateTeamFormationInput!) { updateTeamFormation(input: $input) { id } }
`);

export const UpdateTeamMutation = graphql(`
  mutation UpdateTeam($input: UpdateTeamInput!) { updateTeam(input: $input) { id } }
`);
