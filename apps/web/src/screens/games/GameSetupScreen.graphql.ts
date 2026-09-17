import { graphql } from '../../gql';

export const GameQuery = graphql(`
  query Game($id: ID!) {
    game(id: $id) {
      id
      teamId
      lifecycle
      ...GameSetupScreen_Game
      ...RoundScreen_Game
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

export const BeginGameMutation = graphql(`
  mutation BeginGame($input: BeginGameInput!) {
    beginGame(input: $input) {
      id
      lifecycle
      ...GameSetupScreen_Game
      ...RoundScreen_Game
    }
  }
`);
