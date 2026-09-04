import { FormEvent, useRef, useState } from 'react';

export interface CreatedTeam {
  id: string;
  name: string;
  players: { id: string; name: string }[];
}

interface FirstTeamScreenProps {
  initialTeams?: CreatedTeam[];
  onCreateTeam?: (name: string, players: string[]) => Promise<CreatedTeam>;
  onStartGame?: (team: CreatedTeam) => void;
}

export function FirstTeamScreen({ initialTeams = [], onCreateTeam, onStartGame }: FirstTeamScreenProps) {
  const [draftName, setDraftName] = useState('');
  const [teamName, setTeamName] = useState<string>();
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<string[]>([]);
  const [teams, setTeams] = useState<CreatedTeam[]>(initialTeams);
  const [isAddingTeam, setIsAddingTeam] = useState(initialTeams.length === 0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>();
  const playerNameInput = useRef<HTMLInputElement>(null);

  function handleTeamSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = draftName.trim();
    if (name) setTeamName(name);
  }

  function handlePlayerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = playerName.trim();
    if (!name) return;

    setPlayers((currentPlayers) => [...currentPlayers, name]);
    setPlayerName('');
    playerNameInput.current?.focus();
  }

  function removePlayer(indexToRemove: number) {
    setPlayers((currentPlayers) => currentPlayers.filter((_, index) => index !== indexToRemove));
  }

  async function finishSetup() {
    if (!teamName || players.length === 0 || !onCreateTeam) return;

    setIsSaving(true);
    setSaveError(undefined);
    try {
      const createdTeam = await onCreateTeam(teamName, players);
      setTeams((currentTeams) => [...currentTeams, createdTeam]);
      setIsAddingTeam(false);
    } catch {
      setSaveError('We could not finish setup. Try again.');
    } finally {
      setIsSaving(false);
    }
  }

  function startAnotherTeam() {
    setDraftName('');
    setTeamName(undefined);
    setPlayerName('');
    setPlayers([]);
    setSaveError(undefined);
    setIsAddingTeam(true);
  }

  return (
    <main className="onboarding-shell">
      <header className="app-header">
        <span className="brand-mark" aria-hidden="true">S</span>
        <span className="brand-name">Sideline</span>
      </header>

      {!isAddingTeam && teams.length > 0 ? (
        <section className="onboarding-content completed-home" aria-labelledby="completed-heading">
          <h1 id="completed-heading">You're ready, Coach.</h1>
          <p className="onboarding-intro">Your teams and rosters are ready.</p>
          <section className="teams-section" aria-labelledby="teams-heading">
            <div className="teams-heading-row">
              <h2 id="teams-heading">Your teams</h2>
              <button type="button" onClick={startAnotherTeam} aria-label="Add team">+ Add team</button>
            </div>
            <div className="team-list">
              {teams.map((team) => (
              <article className="team-card" key={team.id}>
                  <div>
                    <h3>{team.name}</h3>
                    <p>{team.players.length} {team.players.length === 1 ? 'player' : 'players'}</p>
                  </div>
                  <button type="button" onClick={() => onStartGame?.(team)}>Start game</button>
                </article>
              ))}
            </div>
          </section>
        </section>
      ) : !teamName ? (
        <section className="onboarding-content" aria-labelledby="first-team-heading">
          <div className="onboarding-progress">
            <span>Set up your team</span>
            <span>1 of 2</span>
          </div>
          <h1 id="first-team-heading">Welcome to Sideline. Let's add your team.</h1>
          <p className="onboarding-intro">
            Start with the team you coach today. You can add and switch between more teams anytime.
          </p>
          {teams.length > 0 && <p className="existing-team-summary">Already managing: {teams.map((team) => team.name).join(', ')}</p>}
          <form className="onboarding-form" onSubmit={handleTeamSubmit}>
            <label htmlFor="team-name">Team name</label>
            <input
              id="team-name"
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              placeholder="e.g. Salt Lake Strikers"
              maxLength={80}
              required
            />
            <p className="field-hint">Use the name players and families will recognize.</p>
            <button type="submit">Add players</button>
          </form>
        </section>
      ) : (
        <section className="onboarding-content" aria-labelledby="roster-heading">
          <div className="onboarding-progress">
            <span>Set up your team</span>
            <span>2 of 2</span>
          </div>
          <p className="team-context">{teamName}</p>
          <h1 id="roster-heading">Add your players.</h1>
          <p className="onboarding-intro">Your roster is required. Add each player, one at a time.</p>
          <form className="player-form" onSubmit={handlePlayerSubmit}>
            <label htmlFor="player-name">Player name</label>
            <div className="player-entry-row">
              <input
                ref={playerNameInput}
                id="player-name"
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="First and last name"
                maxLength={80}
              />
              <button type="submit">Add</button>
            </div>
          </form>
          <div className="roster-heading">
            <h2>Roster</h2>
            <span aria-live="polite">{players.length} {players.length === 1 ? 'player' : 'players'}</span>
          </div>
          <ul className="roster-list" aria-label="Roster">
            {players.map((player, index) => (
              <li key={`${player}-${index}`}>
                <span className="player-name">{player}</span>
                <button type="button" onClick={() => removePlayer(index)} aria-label={`Remove ${player}`}>×</button>
              </li>
            ))}
          </ul>
          <p className="roster-guidance">Most teams have 6–9 players. You can update the roster later.</p>
          {saveError && <p className="save-error" role="alert">{saveError}</p>}
          <button
            className="finish-button"
            type="button"
            disabled={players.length === 0 || isSaving || !onCreateTeam}
            onClick={finishSetup}
          >
            {isSaving ? 'Saving…' : 'Finish setup'}
          </button>
        </section>
      )}
    </main>
  );
}
