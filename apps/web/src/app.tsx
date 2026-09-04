import { useMutation, useQuery } from '@apollo/client';
import { FirstTeamScreen } from './screens/teams/FirstTeamScreen';
import { CreateTeamMutation, TeamsQuery } from './screens/teams/FirstTeamScreen.graphql';
import { GameFlow, type GameTeam } from './screens/games/GameFlow';
import { useState } from 'react';

export function App() {
  const { data, loading, error } = useQuery(TeamsQuery);
  const [createTeam] = useMutation(CreateTeamMutation);
  const [selectedTeam, setSelectedTeam] = useState<GameTeam>();

  if (loading) return <p className="app-status">Loading your teams…</p>;
  if (error) return <p className="app-status" role="alert">Could not load your teams.</p>;

  if (selectedTeam) return <GameFlow team={selectedTeam} onBack={() => setSelectedTeam(undefined)} />;

  return (
    <FirstTeamScreen
      initialTeams={(data?.teams ?? []).map((team) => ({
        id: team.id,
        name: team.name,
        players: team.players.map((player) => ({ id: player.id, name: player.name })),
      }))}
      onStartGame={setSelectedTeam}
      onCreateTeam={async (name, players) => {
        const result = await createTeam({ variables: { input: { name, players } } });
        if (!result.data) throw new Error('The team could not be created.');
        return result.data.createTeam;
      }}
    />
  );
}
