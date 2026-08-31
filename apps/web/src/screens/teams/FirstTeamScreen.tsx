import { FormEvent, useRef, useState } from 'react';

export function FirstTeamScreen() {
  const [draftName, setDraftName] = useState('');
  const [teamName, setTeamName] = useState<string>();
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<string[]>([]);
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

  return (
    <main className="onboarding-shell">
      <header className="app-header">
        <span className="brand-mark" aria-hidden="true">S</span>
        <span className="brand-name">Sideline</span>
      </header>

      {!teamName ? (
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
            {players.map((player, index) => <li key={`${player}-${index}`}>{player}</li>)}
          </ul>
        </section>
      )}
    </main>
  );
}
