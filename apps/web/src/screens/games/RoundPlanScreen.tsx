import { useState } from 'react';
import { FragmentType, getFragmentData, graphql } from '../../gql';
import { RoundLineup } from './RoundLineup';

export const RoundPlanScreen_GameFragment = graphql(`
  fragment RoundPlanScreen_Game on Game {
    plannedRound {
      number
      ...RoundLineup_Round
    }
  }
`);

/**
 * The round before it counts. The coach reads it standing on the touchline, so the screen says
 * plainly that nobody is on the field yet and leaves one thing to tap. Tapping a player then
 * another trades their places, which is the whole of a coach adjustment; the trade is recorded
 * as it is made, so the plan survives a locked phone, and Reset asks the engine again rather
 * than restoring anything the coach did.
 */
export function RoundPlanScreen({
  game,
  onBack,
  onSwap,
  onReset,
  onUseLineup,
}: {
  game: FragmentType<typeof RoundPlanScreen_GameFragment>;
  onBack: () => void;
  onSwap: (playerIds: [string, string]) => Promise<void>;
  onReset: () => Promise<void>;
  onUseLineup: () => Promise<void>;
}) {
  const { plannedRound } = getFragmentData(RoundPlanScreen_GameFragment, game);
  const [activePlayerId, setActivePlayerId] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string>();
  if (!plannedRound) return null;

  async function tap(playerId: string) {
    if (activePlayerId === undefined) return setActivePlayerId(playerId);

    const swapWith = activePlayerId;
    setActivePlayerId(undefined);
    if (swapWith === playerId) return;

    setBusy(true);
    setProblem(undefined);
    try {
      await onSwap([swapWith, playerId]);
    } catch {
      setProblem('We could not swap those players. Try again.');
    }
    setBusy(false);
  }

  async function reset() {
    setActivePlayerId(undefined);
    setBusy(true);
    setProblem(undefined);
    try {
      await onReset();
    } catch {
      setProblem('We could not ask for the lineup again. Try again.');
    }
    setBusy(false);
  }

  async function useLineup() {
    setBusy(true);
    setProblem(undefined);
    try {
      await onUseLineup();
    } catch {
      setProblem('We could not put this round on the field. Try again.');
      setBusy(false);
    }
  }

  return <main className="onboarding-shell"><section className="onboarding-content round-screen" aria-labelledby="round-heading">
    <button className="back-link" type="button" onClick={onBack}>‹ Back to team</button>
    <p className="editor-eyebrow">Planned</p>
    <h1 id="round-heading">Round {plannedRound.number}</h1>
    <p className="onboarding-intro">Nobody is on the field yet. Tap two players to swap them, then use the lineup.</p>

    <RoundLineup
      round={plannedRound}
      activePlayerId={activePlayerId}
      disabled={busy}
      onTapPlayer={tap}
    />

    {problem && <p className="save-error" role="alert">{problem}</p>}
    <button className="finish-button" type="button" disabled={busy} onClick={useLineup}>{busy ? 'Going on…' : 'Use Lineup'}</button>
    <button className="secondary-button" type="button" disabled={busy} onClick={reset}>Reset</button>
  </section></main>;
}
