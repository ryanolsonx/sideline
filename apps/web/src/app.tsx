import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { readCoachUsername, rememberCoachUsername } from './coach-identity';
import { CoachUsernameScreen } from './screens/coach/CoachUsernameScreen';
import { FirstTeamScreen } from './screens/teams/FirstTeamScreen';
import { CreateTeamMutation, TeamsQuery } from './screens/teams/FirstTeamScreen.graphql';

export function App() {
  const [coachUsername, setCoachUsername] = useState(readCoachUsername);

  if (!coachUsername) {
    return (
      <CoachUsernameScreen
        onContinue={(username) => setCoachUsername(rememberCoachUsername(username))}
      />
    );
  }

  return <CoachTeams coachUsername={coachUsername} />;
}

function CoachTeams({ coachUsername }: { coachUsername: string }) {
  const { data, loading, error } = useQuery(TeamsQuery);
  const [createTeam] = useMutation(CreateTeamMutation);

  if (loading) return <p className="app-status">Loading your teams…</p>;
  if (error) return <p className="app-status" role="alert">Could not load your teams.</p>;

  return (
    <FirstTeamScreen
      coachUsername={coachUsername}
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
