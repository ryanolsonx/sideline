import { useState } from 'react';
import { FragmentType, getFragmentData, graphql } from '../../gql';

export const GameSetupScreen_GameFragment = graphql(`
  fragment GameSetupScreen_Game on Game {
    id
    players {
      id
      name
      present
    }
  }
`);

/**
 * The coach unticks the no-shows rather than ticking the arrivals, and one tap both records
 * the whole list and puts round one on the field.
 */
export function GameSetupScreen({
  game,
  onBack,
  onBegin,
}: {
  game: FragmentType<typeof GameSetupScreen_GameFragment>;
  onBack: () => void;
  onBegin: (presentPlayerIds: string[]) => Promise<void>;
}) {
  const { players } = getFragmentData(GameSetupScreen_GameFragment, game);
  const [present, setPresent] = useState(
    () => new Set(players.filter((player) => player.present).map((player) => player.id)),
  );
  const [beginning, setBeginning] = useState(false);
  const [beginError, setBeginError] = useState<string>();

  function toggle(playerId: string) {
    setPresent((current) => {
      const next = new Set(current);
      if (!next.delete(playerId)) next.add(playerId);
      return next;
    });
  }

  async function begin() {
    setBeginning(true);
    setBeginError(undefined);
    try {
      await onBegin(players.filter((player) => present.has(player.id)).map((player) => player.id));
    } catch {
      setBeginError('We could not begin the game. Try again.');
      setBeginning(false);
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
          <input type="checkbox" checked={present.has(player.id)} disabled={beginning} onChange={() => toggle(player.id)} />
          <span className="player-name">{player.name}</span>
        </label>
      </li>)}
    </ul>
    {beginError && <p className="save-error" role="alert">{beginError}</p>}
    <button className="finish-button" type="button" disabled={beginning || present.size === 0} onClick={begin}>{beginning ? 'Beginning…' : 'Begin'}</button>
  </section></main>;
}
