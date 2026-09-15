import { useState } from 'react';
import { EditableTeam } from './TeamDetailScreen';

/**
 * The hub a coach lands on for one team. Starting a game is the one thing they came to do,
 * so everything else on the screen stays out of its way.
 */
export function TeamScreen({
  team,
  onBack,
  onStartGame,
  onEditTeam,
}: {
  team: EditableTeam;
  onBack: () => void;
  onStartGame: () => Promise<void>;
  onEditTeam: () => void;
}) {
  const fieldSize = team.formation.defender + team.formation.forward + 1;

  return <main className="onboarding-shell"><section className="onboarding-content team-screen" aria-labelledby="team-heading">
    <button className="back-link" type="button" onClick={onBack}>‹ Back to teams</button>
    <p className="editor-eyebrow">Your team</p>
    <h1 id="team-heading">{team.name}</h1>
    <p className="team-screen-summary">
      {fieldSize}v{fieldSize} · {team.formation.defender} defender{team.formation.defender === 1 ? '' : 's'} · {team.formation.forward} forwards · {team.players.length} {team.players.length === 1 ? 'player' : 'players'}
    </p>
    <StartGameAction onStartGame={onStartGame} />
    <button className="team-settings-link" type="button" onClick={onEditTeam}>Team settings</button>
  </section></main>;
}

function StartGameAction({ onStartGame }: { onStartGame: () => Promise<void> }) {
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string>();

  async function startGame() {
    setStarting(true);
    setStartError(undefined);
    try {
      await onStartGame();
    } catch {
      setStartError('We could not start the game. Try again.');
      setStarting(false);
    }
  }

  return <div className="team-primary-action">
    <button className="start-game-button" type="button" disabled={starting} onClick={startGame}>{starting ? 'Starting…' : 'Start a game'}</button>
    {startError && <p className="save-error" role="alert">{startError}</p>}
  </div>;
}
