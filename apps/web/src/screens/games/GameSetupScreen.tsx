import { useState } from 'react';
import { FragmentType, getFragmentData, graphql } from '../../gql';

export const GameSetupScreen_GameFragment = graphql(`
  fragment GameSetupScreen_Game on Game {
    id
    attendanceConfirmed
    players {
      id
      name
      present
    }
  }
`);

/**
 * The coach unticks the no-shows rather than ticking the arrivals, and one tap records the
 * whole list, so nothing is written until they say the list is right.
 */
export function GameSetupScreen({
  game,
  onBack,
  onConfirm,
}: {
  game: FragmentType<typeof GameSetupScreen_GameFragment>;
  onBack: () => void;
  onConfirm: (presentPlayerIds: string[]) => Promise<void>;
}) {
  const { players, attendanceConfirmed } = getFragmentData(GameSetupScreen_GameFragment, game);
  const [present, setPresent] = useState(
    () => new Set(players.filter((player) => player.present).map((player) => player.id)),
  );
  const [confirmed, setConfirmed] = useState(attendanceConfirmed);
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string>();

  function toggle(playerId: string) {
    setConfirmed(false);
    setPresent((current) => {
      const next = new Set(current);
      if (!next.delete(playerId)) next.add(playerId);
      return next;
    });
  }

  async function confirm() {
    setConfirming(true);
    setConfirmError(undefined);
    try {
      await onConfirm(players.filter((player) => present.has(player.id)).map((player) => player.id));
      setConfirmed(true);
    } catch {
      setConfirmError('We could not save who is here. Try again.');
    } finally {
      setConfirming(false);
    }
  }

  return <main className="onboarding-shell"><section className="onboarding-content game-setup" aria-labelledby="attendance-heading">
    <button className="back-link" type="button" onClick={onBack}>‹ Back to team</button>
    <p className="editor-eyebrow">Game setup</p>
    <h1 id="attendance-heading">Who's here?</h1>
    <p className="onboarding-intro">Everyone starts here. Untick anyone who didn't turn up.</p>
    <p className="attendance-count" aria-live="polite">{present.size} of {players.length} here</p>
    <ul className="attendance-list" aria-label="Who's here">
      {players.map((player) => <li key={player.id}>
        <label className={present.has(player.id) ? 'attendance-option attendance-option--present' : 'attendance-option'}>
          <input type="checkbox" checked={present.has(player.id)} disabled={confirming} onChange={() => toggle(player.id)} />
          <span className="player-name">{player.name}</span>
        </label>
      </li>)}
    </ul>
    {confirmError && <p className="save-error" role="alert">{confirmError}</p>}
    {confirmed
      ? <p className="game-status" role="status">Who's here is confirmed. This game is waiting to begin.</p>
      : <button className="finish-button" type="button" disabled={confirming} onClick={confirm}>{confirming ? 'Saving…' : "Confirm who's here"}</button>}
  </section></main>;
}
