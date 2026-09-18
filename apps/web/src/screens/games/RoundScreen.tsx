import { useState } from 'react';
import { FragmentType, getFragmentData, graphql } from '../../gql';
import { RoundLineup } from './RoundLineup';

export const RoundScreen_GameFragment = graphql(`
  fragment RoundScreen_Game on Game {
    rounds
    currentRound {
      number
      ...RoundLineup_Round
    }
  }
`);

/**
 * The round that is on the field, as it began. Subs is the forward action, and the last round
 * of the game has none to call.
 */
export function RoundScreen({
  game,
  onBack,
  onTakeSubs,
}: {
  game: FragmentType<typeof RoundScreen_GameFragment>;
  onBack: () => void;
  onTakeSubs: () => Promise<void>;
}) {
  const { currentRound, rounds } = getFragmentData(RoundScreen_GameFragment, game);
  const [callingSubs, setCallingSubs] = useState(false);
  const [subsError, setSubsError] = useState<string>();
  if (!currentRound) return null;

  async function takeSubs() {
    setCallingSubs(true);
    setSubsError(undefined);
    try {
      await onTakeSubs();
    } catch {
      setSubsError('We could not call subs. Try again.');
      setCallingSubs(false);
    }
  }

  return <main className="onboarding-shell"><section className="onboarding-content round-screen" aria-labelledby="round-heading">
    <button className="back-link" type="button" onClick={onBack}>‹ Back to team</button>
    <p className="editor-eyebrow">On the field</p>
    <h1 id="round-heading">Round {currentRound.number}</h1>
    <p className="onboarding-intro">{`Round ${currentRound.number} of ${rounds}.`}</p>

    <RoundLineup round={currentRound} />

    {subsError && <p className="save-error" role="alert">{subsError}</p>}
    {currentRound.number < rounds
      && <button className="finish-button" type="button" disabled={callingSubs} onClick={takeSubs}>{callingSubs ? 'Calling subs…' : 'Subs'}</button>}
  </section></main>;
}
