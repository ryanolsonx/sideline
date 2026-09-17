import { useState } from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {
  forgetCoachUsername,
  readCoachUsername,
  rememberCoachUsername,
} from './coach-identity';
import { CoachUsernameScreen } from './screens/coach/CoachUsernameScreen';
import { FirstTeamScreen } from './screens/teams/FirstTeamScreen';
import { TeamDetailScreen, EditableTeam } from './screens/teams/TeamDetailScreen';
import { TeamScreen } from './screens/teams/TeamScreen';
import { CreateTeamMutation, TeamsQuery, UpdateTeamMutation } from './screens/teams/FirstTeamScreen.graphql';

export function App() {
  return <BrowserRouter><AppRouter /></BrowserRouter>;
}

function AppRouter() {
  const client = useApolloClient();
  const [coachUsername, setCoachUsername] = useState(readCoachUsername);
  const navigate = useNavigate();

  if (!coachUsername) {
    return (
      <CoachUsernameScreen
        onContinue={(username) => {
          setCoachUsername(rememberCoachUsername(username));
          navigate('/teams');
        }}
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
        navigate('/');
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
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(TeamsQuery);
  const [createTeam] = useMutation(CreateTeamMutation);
  const [updateTeam] = useMutation(UpdateTeamMutation);

  if (loading) return <p className="app-status">Loading your teams…</p>;
  if (error) return <p className="app-status" role="alert">Could not load your teams.</p>;

  const teams = (data?.teams ?? []).map((team) => ({
    id: team.id, name: team.name, players: team.players.map((player) => ({ name: player.name })), formation: team.formation,
  }));
  const saveTeam = async (team: EditableTeam, name: string, players: string[], formation: EditableTeam['formation']) => {
    const inputFormation = { defender: formation.defender, forward: formation.forward };
    await updateTeam({ variables: { input: { id: team.id, name, players, formation: inputFormation } } });
    await client.refetchQueries({ include: [TeamsQuery] });
  };

  const teamSetup = (startAddingTeam: boolean) => <FirstTeamScreen
    coachUsername={coachUsername}
    onSignOut={onSignOut}
    key={startAddingTeam ? 'new-team' : 'teams'}
    initialTeams={teams}
    startAddingTeam={startAddingTeam}
    onOpenTeam={(team) => navigate(`/teams/${team.id}`)}
    onCreateTeam={async (name, players, formation) => {
      const result = await createTeam({ variables: { input: { name, players, formation } } });
      if (!result.data) throw new Error('The team could not be created.');
      await client.refetchQueries({ include: [TeamsQuery] });
      return result.data.createTeam;
    }}
  />;

  return <Routes>
    <Route path="/" element={<Navigate to="/teams" replace />} />
    <Route path="/teams" element={teamSetup(false)} />
    <Route path="/teams/new" element={teamSetup(true)} />
    <Route path="/teams/:teamId" element={<TeamHome teams={teams} />} />
    <Route path="/teams/:teamId/edit" element={<TeamSettings teams={teams} onSave={saveTeam} />} />
    <Route path="*" element={<Navigate to="/teams" replace />} />
  </Routes>;
}

function TeamHome({ teams }: { teams: EditableTeam[] }) {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const team = teams.find((candidate) => candidate.id === teamId);

  if (!team) return <Navigate to="/teams" replace />;
  return <TeamScreen
    team={team}
    onBack={() => navigate('/teams')}
    onEditTeam={() => navigate(`/teams/${team.id}/edit`)}
  />;
}

function TeamSettings({
  teams,
  onSave,
}: {
  teams: EditableTeam[];
  onSave: (team: EditableTeam, name: string, players: string[], formation: EditableTeam['formation']) => Promise<void>;
}) {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const team = teams.find((candidate) => candidate.id === teamId);

  if (!team) return <Navigate to="/teams" replace />;
  return <TeamDetailScreen
    team={team}
    onBack={() => navigate(`/teams/${team.id}`)}
    onSave={(name, players, formation) => onSave(team, name, players, formation)}
  />;
}
