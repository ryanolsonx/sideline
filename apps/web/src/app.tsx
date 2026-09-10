import { useEffect, useState } from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import {
  forgetCoachUsername,
  readCoachUsername,
  rememberCoachUsername,
} from './coach-identity';
import { CoachUsernameScreen } from './screens/coach/CoachUsernameScreen';
import { FirstTeamScreen } from './screens/teams/FirstTeamScreen';
import { TeamDetailScreen, EditableTeam } from './screens/teams/TeamDetailScreen';
import { CreateTeamMutation, TeamsQuery, UpdateTeamMutation } from './screens/teams/FirstTeamScreen.graphql';

export function App() {
  const client = useApolloClient();
  const [coachUsername, setCoachUsername] = useState(readCoachUsername);
  const [pathname, setPathname] = usePathname();

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
      pathname={pathname}
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
  pathname,
  onSignOut,
}: {
  coachUsername: string;
  pathname: string;
  onSignOut: () => void;
}) {
  const client = useApolloClient();
  useEffect(() => {
    if (pathname === '/') navigate('/teams');
  }, [pathname]);
  const { data, loading, error } = useQuery(TeamsQuery);
  const [createTeam] = useMutation(CreateTeamMutation);
  const [updateTeam] = useMutation(UpdateTeamMutation);

  if (loading) return <p className="app-status">Loading your teams…</p>;
  if (error) return <p className="app-status" role="alert">Could not load your teams.</p>;

  const teams = (data?.teams ?? []).map((team) => ({
    id: team.id, name: team.name, players: team.players.map((player) => ({ name: player.name })), formation: team.formation,
  }));
  const teamId = pathname.match(/^\/teams\/([^/]+)$/)?.[1];
  const selectedTeam = teamId ? teams.find((team) => team.id === teamId) : undefined;

  if (selectedTeam) return <TeamDetailScreen team={selectedTeam} onBack={() => navigate('/teams')} onSave={async (name, players, formation) => {
    const inputFormation = { defender: formation.defender, forward: formation.forward };
    await updateTeam({ variables: { input: { id: selectedTeam.id, name, players, formation: inputFormation } } });
    await client.refetchQueries({ include: [TeamsQuery] });
  }} />;

  return (
    <FirstTeamScreen
      coachUsername={coachUsername}
      onSignOut={onSignOut}
      key={pathname}
      initialTeams={teams}
      startAddingTeam={pathname === '/teams/new'}
      onOpenTeam={(team) => navigate(`/teams/${team.id}`)}
      onCreateTeam={async (name, players, formation) => {
        const result = await createTeam({ variables: { input: { name, players, formation } } });
        if (!result.data) throw new Error('The team could not be created.');
        return result.data.createTeam;
      }}
    />
  );
}

function usePathname(): [string, (pathname: string) => void] {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  useEffect(() => {
    const update = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  return [pathname, (nextPathname) => { window.history.pushState({}, '', nextPathname); setPathname(nextPathname); }];
}

function navigate(pathname: string) {
  window.history.pushState({}, '', pathname);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
