import { useState } from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import {
  forgetCoachUsername,
  readCoachUsername,
  rememberCoachUsername,
} from './coach-identity';
import { CoachUsernameScreen } from './screens/coach/CoachUsernameScreen';
import { FirstTeamScreen } from './screens/teams/FirstTeamScreen';
import { TeamDetailScreen, EditableTeam } from './screens/teams/TeamDetailScreen';
import { CreateTeamMutation, TeamsQuery, UpdateTeamFormationMutation, UpdateTeamRosterMutation } from './screens/teams/FirstTeamScreen.graphql';

export function App() {
  const client = useApolloClient();
  const [coachUsername, setCoachUsername] = useState(readCoachUsername);

  if (!coachUsername) {
    return (
      <CoachUsernameScreen
        onContinue={(username) => setCoachUsername(rememberCoachUsername(username))}
      />
    );
  }

  return (
    <CoachTeams
      coachUsername={coachUsername}
      onSignOut={async () => {
        forgetCoachUsername();
        await client.clearStore();
        setCoachUsername(undefined);
      }}
    />
  );
}

function CoachTeams({
  coachUsername,
  onSignOut,
}: {
  coachUsername: string;
  onSignOut: () => void;
}) {
  const client = useApolloClient();
  const { data, loading, error } = useQuery(TeamsQuery);
  const [createTeam] = useMutation(CreateTeamMutation);
  const [updateRoster] = useMutation(UpdateTeamRosterMutation);
  const [updateFormation] = useMutation(UpdateTeamFormationMutation);
  const [selectedTeam, setSelectedTeam] = useState<EditableTeam>();

  if (loading) return <p className="app-status">Loading your teams…</p>;
  if (error) return <p className="app-status" role="alert">Could not load your teams.</p>;

  if (selectedTeam) return <TeamDetailScreen team={selectedTeam} onBack={() => setSelectedTeam(undefined)} onSave={async (players, formation) => {
    await updateRoster({ variables: { input: { id: selectedTeam.id, players } } });
    await updateFormation({ variables: { input: { id: selectedTeam.id, formation } } });
    await client.refetchQueries({ include: [TeamsQuery] });
  }} />;

  return (
    <FirstTeamScreen
      coachUsername={coachUsername}
      onSignOut={onSignOut}
      initialTeams={(data?.teams ?? []).map((team) => ({
        id: team.id,
        name: team.name,
        players: team.players.map((player) => ({ name: player.name })),
        formation: team.formation,
      }))}
      onOpenTeam={setSelectedTeam}
      onCreateTeam={async (name, players, formation) => {
        const result = await createTeam({ variables: { input: { name, players, formation } } });
        if (!result.data) throw new Error('The team could not be created.');
        return result.data.createTeam;
      }}
    />
  );
}
