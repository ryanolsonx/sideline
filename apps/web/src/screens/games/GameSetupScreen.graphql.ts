import { graphql } from '../../gql';

export const GameQuery = graphql(`
  query Game($id: ID!) {
    game(id: $id) {
      id
      teamId
      ...GameSetupScreen_Game
    }
  }
`);

export const StartGameMutation = graphql(`
  mutation StartGame($input: StartGameInput!) {
    startGame(input: $input) {
      id
      teamId
      ...GameSetupScreen_Game
    }
  }
`);

export const MarkAttendanceMutation = graphql(`
  mutation MarkAttendance($input: MarkAttendanceInput!) {
    markAttendance(input: $input) {
      id
      ...GameSetupScreen_Game
    }
  }
`);
