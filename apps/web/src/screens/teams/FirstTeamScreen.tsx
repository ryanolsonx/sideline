import { FormEvent, useRef, useState } from 'react';

export interface CreatedTeam {
  name: string;
  players: { name: string }[];
  formation: { defender: number; forward: number };
}

interface FirstTeamScreenProps {
  coachUsername?: string;
  onSignOut?: () => void;
  initialTeams?: CreatedTeam[];
  onCreateTeam?: (
    name: string,
    players: string[],
    formation: { defender: number; forward: number },
  ) => Promise<CreatedTeam>;
}

export function FirstTeamScreen({
  coachUsername,
  onSignOut,
  initialTeams = [],
  onCreateTeam,
}: FirstTeamScreenProps) {
  const [draftName, setDraftName] = useState('');
  const [teamName, setTeamName] = useState<string>();
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState<string[]>([]);
  const [formation, setFormation] = useState({ defender: 2, forward: 2 });
  const [isChoosingFormation, setIsChoosingFormation] = useState(false);
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
    if (!name || players.length === 9) return;

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
      const createdTeam = await onCreateTeam(teamName, players, formation);
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
    setFormation({ defender: 2, forward: 2 });
    setIsChoosingFormation(false);
    setSaveError(undefined);
    setIsAddingTeam(true);
  }

  return (
    <main className="onboarding-shell">
      <header className="app-header">
        <span className="brand-mark" aria-hidden="true">S</span>
        <span className="brand-name">Sideline</span>
        {coachUsername && (
          <div className="coach-identity">
            <span className="coach-avatar" aria-hidden="true">{coachUsername.at(0)}</span>
            <span>{coachUsername}</span>
            {onSignOut && <button type="button" onClick={onSignOut}>Sign out</button>}
          </div>
        )}
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
                <article className="team-card" key={team.name}>
                  <div>
                    <h3>{team.name}</h3>
                    <p>{team.players.length} {team.players.length === 1 ? 'player' : 'players'}</p>
                  </div>
                  <span aria-hidden="true">›</span>
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
      ) : !isChoosingFormation ? (
        <section className="onboarding-content" aria-labelledby="roster-heading">
          <div className="onboarding-progress">
            <span>Set up your team</span>
            <span>2 of 3</span>
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
              <button type="submit" disabled={players.length === 9}>Add</button>
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
          <p className="roster-guidance">Most teams have 6–9 players. A team can have no more than 9 players.</p>
          {saveError && <p className="save-error" role="alert">{saveError}</p>}
          <button
            className="finish-button"
            type="button"
            disabled={players.length === 0}
            onClick={() => setIsChoosingFormation(true)}
          >
            Choose formation
          </button>
        </section>
      ) : (
        <section className="onboarding-content" aria-labelledby="formation-heading">
          <div className="onboarding-progress">
            <span>Set up your team</span>
            <span>3 of 3</span>
          </div>
          <p className="team-context">{teamName}</p>
          <h1 id="formation-heading">Choose your formation.</h1>
          <fieldset>
            <legend>Format</legend>
            <label>
              <input
                type="radio"
                name="formation"
                checked={formation.defender === 2 && formation.forward === 2}
                onChange={() => setFormation({ defender: 2, forward: 2 })}
              />
              5v5: 2 defenders, 2 forwards
            </label>
            <label>
              <input
                type="radio"
                name="formation"
                checked={formation.defender === 1 && formation.forward === 3}
                onChange={() => setFormation({ defender: 1, forward: 3 })}
              />
              5v5: 1 defender, 3 forwards
            </label>
            <label>
              <input
                type="radio"
                name="formation"
                checked={formation.defender === 2 && formation.forward === 3}
                onChange={() => setFormation({ defender: 2, forward: 3 })}
              />
              6v6: 2 defenders, 3 forwards
            </label>
          </fieldset>
          {saveError && <p className="save-error" role="alert">{saveError}</p>}
          <button
            className="finish-button"
            type="button"
            disabled={isSaving || !onCreateTeam}
            onClick={finishSetup}
          >
            {isSaving ? 'Saving…' : 'Finish setup'}
          </button>
        </section>
      )}
    </main>
  );
}
