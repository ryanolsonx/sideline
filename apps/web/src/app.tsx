import { useMutation, useQuery } from '@apollo/client';
import { FirstTeamScreen } from './screens/teams/FirstTeamScreen';
import { CreateTeamMutation, TeamsQuery } from './screens/teams/FirstTeamScreen.graphql';

export function App() {
  const { data, loading, error } = useQuery(TeamsQuery);
  const [createTeam] = useMutation(CreateTeamMutation);

  if (loading) return <p className="app-status">Loading your teams…</p>;
  if (error) return <p className="app-status" role="alert">Could not load your teams.</p>;

  return (
    <FirstTeamScreen
      initialTeams={(data?.teams ?? []).map((team) => ({
        name: team.name,
        players: team.players.map((player) => ({ name: player.name })),
      }))}
      onCreateTeam={async (name, players) => {
        const result = await createTeam({ variables: { input: { name, players } } });
        if (!result.data) throw new Error('The team could not be created.');
        return result.data.createTeam;
      }}
    />
  );
}
