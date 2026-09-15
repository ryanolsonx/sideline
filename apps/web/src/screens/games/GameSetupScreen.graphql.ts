import { graphql } from '../../gql';

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
