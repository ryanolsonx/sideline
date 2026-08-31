import { FormEvent, useRef, useState } from 'react';

interface CreatedTeam {
  name: string;
  players: { name: string }[];
}

interface FirstTeamScreenProps {
  onCreateTeam?: (name: string, players: string[]) => Promise<CreatedTeam>;
}

export function FirstTeamScreen({ onCreateTeam }: FirstTeamScreenProps) {
  const [draftName, setDraftName] = useState('');
  const [teamName, setTeamName] = useState<string>();
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<string[]>([]);
  const [completedTeam, setCompletedTeam] = useState<CreatedTeam>();
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
      setCompletedTeam(await onCreateTeam(teamName, players));
    } catch {
      setSaveError('We could not finish setup. Try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="onboarding-shell">
      <header className="app-header">
        <span className="brand-mark" aria-hidden="true">S</span>
        <span className="brand-name">Sideline</span>
      </header>

      {completedTeam ? (
        <section className="onboarding-content completed-home" aria-labelledby="completed-heading">
          <h1 id="completed-heading">You're ready, Coach.</h1>
          <p className="onboarding-intro">Your first team and roster are set up.</p>
          <section className="teams-section" aria-labelledby="teams-heading">
            <h2 id="teams-heading">Your teams</h2>
            <article className="team-card">
              <div>
                <h3>{completedTeam.name}</h3>
                <p>{completedTeam.players.length} {completedTeam.players.length === 1 ? 'player' : 'players'}</p>
              </div>
              <span aria-hidden="true">›</span>
            </article>
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
