import { graphql } from '../../gql';

export const GameFragment = graphql(/* GraphQL */ `
  fragment GameFlow_Game on Game {
    id fieldSize status currentRound
    rounds { id number assignments { id status position player { id name } } }
  }
`);

export const StartGameMutation = graphql(/* GraphQL */ `
  mutation GameFlow_StartGame($input: StartGameInput!) {
    startGame(input: $input) { ...GameFlow_Game }
  }
`);
