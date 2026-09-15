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
import { GameSetupScreen } from './screens/games/GameSetupScreen';
import { BeginGameMutation, GameQuery, StartGameMutation } from './screens/games/GameSetupScreen.graphql';
import { RoundScreen } from './screens/games/RoundScreen';
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
  const [startGame] = useMutation(StartGameMutation);
  const [beginGame] = useMutation(BeginGameMutation);

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
    <Route path="/teams/:teamId" element={<TeamHome
      teams={teams}
      onStartGame={async (team) => {
        const result = await startGame({ variables: { input: { teamId: team.id } } });
        if (!result.data) throw new Error('The game could not be started.');
        navigate(`/teams/${team.id}/games/${result.data.startGame.id}`);
      }}
    />} />
    <Route path="/teams/:teamId/edit" element={<TeamSettings teams={teams} onSave={saveTeam} />} />
    <Route path="/teams/:teamId/games/:gameId" element={<OpenGame
      onBegin={async (gameId, presentPlayerIds) => {
        await beginGame({ variables: { input: { gameId, presentPlayerIds } } });
      }}
    />} />
    <Route path="*" element={<Navigate to="/teams" replace />} />
  </Routes>;
}

function TeamHome({
  teams,
  onStartGame,
}: {
  teams: EditableTeam[];
  onStartGame: (team: EditableTeam) => Promise<void>;
}) {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const team = teams.find((candidate) => candidate.id === teamId);

  if (!team) return <Navigate to="/teams" replace />;
  return <TeamScreen
    team={team}
    onBack={() => navigate('/teams')}
    onStartGame={() => onStartGame(team)}
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

/** A game is reached only through its own URL, so opening one is a query rather than a memory. */
function OpenGame({
  onBegin,
}: {
  onBegin: (gameId: string, presentPlayerIds: string[]) => Promise<void>;
}) {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GameQuery, { variables: { id: gameId ?? '' } });

  if (loading) return <p className="app-status">Loading this game…</p>;
  if (error || !data) return <p className="app-status" role="alert">We could not open that game.</p>;

  const game = data.game;
  const backToTeam = () => navigate(`/teams/${game.teamId}`);

  if (game.lifecycle === 'SETUP') {
    return <GameSetupScreen
      game={game}
      onBack={backToTeam}
      onBegin={(presentPlayerIds) => onBegin(game.id, presentPlayerIds)}
    />;
  }

  return <RoundScreen game={game} onBack={backToTeam} />;
}
