import { ReactNode } from 'react';
import { FragmentType, getFragmentData, graphql } from '../../gql';
import { outfieldPositions, positionNames } from './positions';

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

/**
 * Who is where in a round. Out comes first because it is the thing a coach scans for, and the
 * places a short-handed side cannot fill are shown rather than hidden. A screen that allows
 * swaps passes onTapPlayer, which turns each player into a row-sized target.
 */
export function RoundLineup({
  round,
  activePlayerId,
  disabled,
  onTapPlayer,
}: {
  round: FragmentType<typeof RoundLineup_RoundFragment>;
  activePlayerId?: string;
  disabled?: boolean;
  onTapPlayer?: (playerId: string) => void;
}) {
  const lineup = getFragmentData(RoundLineup_RoundFragment, round);

  const player = (id: string, name: string): ReactNode => (onTapPlayer
    ? <button
        type="button"
        className={activePlayerId === id ? 'player-name player-name--active' : 'player-name'}
        aria-pressed={activePlayerId === id}
        disabled={disabled}
        onClick={() => onTapPlayer(id)}
      >{name}</button>
    : <span className="player-name">{name}</span>);

  const groups = outfieldPositions
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
            {lineup.out.map(({ id, name }) => <li key={id}>{player(id, name)}</li>)}
          </ul>}
    </section>

    {groups.map(({ position, slots }) => <section className="round-group" key={position} aria-labelledby={`${position}-heading`}>
      <h2 id={`${position}-heading`}>{positionNames[position]}</h2>
      <ul className="round-list" aria-label={positionNames[position]}>
        {slots.map((slot, index) => <li key={`${position}-${index}`}>
          {slot.player
            ? player(slot.player.id, slot.player.name)
            : <span className="round-slot-empty">Nobody</span>}
        </li>)}
      </ul>
    </section>)}
  </>;
}
