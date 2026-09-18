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
 * The round before it counts. The coach reads it standing on the touchline, so the screen
 * says plainly that nobody is on the field yet and leaves one thing to tap.
 */
export function RoundPlanScreen({
  game,
  onBack,
  onUseLineup,
}: {
  game: FragmentType<typeof RoundPlanScreen_GameFragment>;
  onBack: () => void;
  onUseLineup: () => Promise<void>;
}) {
  const { plannedRound } = getFragmentData(RoundPlanScreen_GameFragment, game);
  const [using, setUsing] = useState(false);
  const [useError, setUseError] = useState<string>();
  if (!plannedRound) return null;

  async function useLineup() {
    setUsing(true);
    setUseError(undefined);
    try {
      await onUseLineup();
    } catch {
      setUseError('We could not put this round on the field. Try again.');
      setUsing(false);
    }
  }

  return <main className="onboarding-shell"><section className="onboarding-content round-screen" aria-labelledby="round-heading">
    <button className="back-link" type="button" onClick={onBack}>‹ Back to team</button>
    <p className="editor-eyebrow">Planned</p>
    <h1 id="round-heading">Round {plannedRound.number}</h1>
    <p className="onboarding-intro">Nobody is on the field yet. Use this lineup when you're ready.</p>

    <RoundLineup round={plannedRound} />

    {useError && <p className="save-error" role="alert">{useError}</p>}
    <button className="finish-button" type="button" disabled={using} onClick={useLineup}>{using ? 'Going on…' : 'Use Lineup'}</button>
  </section></main>;
}
