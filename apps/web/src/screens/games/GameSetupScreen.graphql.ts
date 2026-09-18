import { graphql } from '../../gql';

export const GameQuery = graphql(`
  query Game($id: ID!) {
    game(id: $id) {
      id
      teamId
      lifecycle
      attendanceConfirmed
      plannedRound {
        number
      }
      ...GameSetupScreen_Game
      ...RoundPlanScreen_Game
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
      attendanceConfirmed
      plannedRound {
        number
      }
      ...GameSetupScreen_Game
      ...RoundPlanScreen_Game
    }
  }
`);

export const ResetPlanMutation = graphql(`
  mutation ResetPlan($input: ResetPlanInput!) {
    resetPlan(input: $input) {
      id
      ...RoundPlanScreen_Game
    }
  }
`);

export const SwapPlayersMutation = graphql(`
  mutation SwapPlayers($input: SwapPlayersInput!) {
    swapPlayers(input: $input) {
      id
      ...RoundPlanScreen_Game
    }
  }
`);

export const UseLineupMutation = graphql(`
  mutation UseLineup($input: UseLineupInput!) {
    useLineup(input: $input) {
      id
      lifecycle
      attendanceConfirmed
      plannedRound {
        number
      }
      ...RoundPlanScreen_Game
      ...RoundScreen_Game
    }
  }
`);
