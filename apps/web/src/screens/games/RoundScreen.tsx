import { FragmentType, getFragmentData, graphql } from '../../gql';

export const RoundScreen_GameFragment = graphql(`
  fragment RoundScreen_Game on Game {
    currentRound {
      number
      out {
        id
        name
      }
      slots {
        position
        player {
          id
          name
        }
      }
    }
  }
`);

const positionNames = { GOALIE: 'Goalie', DEFENDER: 'Defenders', FORWARD: 'Forwards' } as const;

/**
 * The round on the field. Out comes first because it is the thing a coach scans for, and the
 * places a short-handed side cannot fill are shown rather than hidden.
 */
export function RoundScreen({
  game,
  onBack,
}: {
  game: FragmentType<typeof RoundScreen_GameFragment>;
  onBack: () => void;
}) {
  const { currentRound } = getFragmentData(RoundScreen_GameFragment, game);
  if (!currentRound) return null;

  const groups = (['GOALIE', 'DEFENDER', 'FORWARD'] as const)
    .map((position) => ({
      position,
      slots: currentRound.slots.filter((slot) => slot.position === position),
    }))
    .filter((group) => group.slots.length > 0);

  return <main className="onboarding-shell"><section className="onboarding-content round-screen" aria-labelledby="round-heading">
    <button className="back-link" type="button" onClick={onBack}>‹ Back to team</button>
    <p className="editor-eyebrow">On the field</p>
    <h1 id="round-heading">Round {currentRound.number}</h1>

    <section className="round-group" aria-labelledby="out-heading">
      <h2 id="out-heading">Out</h2>
      {currentRound.out.length === 0
        ? <p className="round-empty-note">Everyone here is playing this round.</p>
        : <ul className="round-list" aria-label="Out">
            {currentRound.out.map((player) => <li key={player.id}><span className="player-name">{player.name}</span></li>)}
          </ul>}
    </section>

    {groups.map(({ position, slots }) => <section className="round-group" key={position} aria-labelledby={`${position}-heading`}>
      <h2 id={`${position}-heading`}>{positionNames[position]}</h2>
      <ul className="round-list" aria-label={positionNames[position]}>
        {slots.map((slot, index) => <li key={`${position}-${index}`}>
          {slot.player
            ? <span className="player-name">{slot.player.name}</span>
            : <span className="round-slot-empty">Nobody</span>}
        </li>)}
      </ul>
    </section>)}
  </section></main>;
}
