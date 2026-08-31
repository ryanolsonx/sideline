import { useMutation } from '@apollo/client';
import { FirstTeamScreen } from './screens/teams/FirstTeamScreen';
import { CreateTeamMutation } from './screens/teams/FirstTeamScreen.graphql';

export function App() {
  const [createTeam] = useMutation(CreateTeamMutation);

  return (
    <FirstTeamScreen
      onCreateTeam={async (name, players) => {
        const result = await createTeam({ variables: { input: { name, players } } });
        if (!result.data) throw new Error('The team could not be created.');
        return result.data.createTeam;
      }}
    />
  );
}
