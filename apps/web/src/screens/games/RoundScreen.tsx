import { FragmentType, getFragmentData, graphql } from '../../gql';
import { RoundLineup } from './RoundLineup';

export const RoundScreen_GameFragment = graphql(`
  fragment RoundScreen_Game on Game {
    currentRound {
      number
      ...RoundLineup_Round
    }
  }
`);

/** The round that is on the field, as it began. */
export function RoundScreen({
  game,
  onBack,
}: {
  game: FragmentType<typeof RoundScreen_GameFragment>;
  onBack: () => void;
}) {
  const { currentRound } = getFragmentData(RoundScreen_GameFragment, game);
  if (!currentRound) return null;

  return <main className="onboarding-shell"><section className="onboarding-content round-screen" aria-labelledby="round-heading">
    <button className="back-link" type="button" onClick={onBack}>‹ Back to team</button>
    <p className="editor-eyebrow">On the field</p>
    <h1 id="round-heading">Round {currentRound.number}</h1>

    <RoundLineup round={currentRound} />
  </section></main>;
}
