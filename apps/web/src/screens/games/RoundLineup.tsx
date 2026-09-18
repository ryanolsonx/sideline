import { FragmentType, getFragmentData, graphql } from '../../gql';

export const RoundLineup_RoundFragment = graphql(`
  fragment RoundLineup_Round on Round {
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
`);

const positionNames = { GOALIE: 'Goalie', DEFENDER: 'Defenders', FORWARD: 'Forwards' } as const;

/**
 * Who is where in a round. Out comes first because it is the thing a coach scans for, and the
 * places a short-handed side cannot fill are shown rather than hidden.
 */
export function RoundLineup({ round }: { round: FragmentType<typeof RoundLineup_RoundFragment> }) {
  const lineup = getFragmentData(RoundLineup_RoundFragment, round);

  const groups = (['GOALIE', 'DEFENDER', 'FORWARD'] as const)
    .map((position) => ({
      position,
      slots: lineup.slots.filter((slot) => slot.position === position),
    }))
    .filter((group) => group.slots.length > 0);

  return <>
    <section className="round-group" aria-labelledby="out-heading">
      <h2 id="out-heading">Out</h2>
      {lineup.out.length === 0
        ? <p className="round-empty-note">Everyone here is playing this round.</p>
        : <ul className="round-list" aria-label="Out">
            {lineup.out.map((player) => <li key={player.id}><span className="player-name">{player.name}</span></li>)}
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
  </>;
}
