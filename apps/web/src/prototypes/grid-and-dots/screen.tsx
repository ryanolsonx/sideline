// PROTOTYPE — throwaway. The settled live-game screen: a roster list, out first, 44px rows.
// Every variant here renders this same screen and disagrees only about what the trailing end
// of a row carries and what fills the space below the roster.
import type { ReactNode } from 'react';
import { UndoRedo, useScreen } from '../live-game/shell';
import { TOTAL_ROUNDS } from './state';

export type RowTrailing = (player: string) => ReactNode;

export function ListScreen({
  trailing,
  below,
}: {
  trailing: RowTrailing;
  below?: ReactNode;
}) {
  const { game, lineup, out, active, tap, forward, back, reset, openOverlay } = useScreen();
  const planning = game.screen === 'plan';
  const changes = game.rounds[game.round].changes;

  const Row = ({ player, tag }: { player: string | null; tag: string }) => {
    const cameOn = changes.some((c) => c.to === player);
    return (
      <button
        className={`list-row gd-row ${active === player ? 'is-active' : ''} ${cameOn ? 'is-changed' : ''}`}
        onClick={() => player && tap(player)}
      >
        <span className="list-tag">{tag}</span>
        <span className="list-name">{player ?? 'empty'}</span>
        <span className="list-flag">{cameOn ? 'on' : ''}</span>
        {trailing(player ?? '')}
      </button>
    );
  };

  const group = (label: string, pos: 'goalie' | 'defender' | 'forward') => (
    <section className="list-group">
      <h2>{label}</h2>
      {lineup
        .filter((s) => s.pos === pos)
        .map((s, i) => (
          <Row
            key={`${pos}-${i}`}
            player={s.player}
            tag={{ goalie: 'GK', defender: 'D', forward: 'F' }[pos]}
          />
        ))}
    </section>
  );

  return (
    <div className="list-screen">
      <header className="list-head">
        <button className="ghost" onClick={back}>
          ‹
        </button>
        <div className="round-strip">
          {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
            <span
              key={i}
              className={`pip ${i + 1 < game.round ? 'done' : ''} ${i + 1 === game.round ? (planning ? 'planning' : 'live') : ''}`}
            >
              {i + 1}
            </span>
          ))}
        </div>
        <span className="head-spacer" />
      </header>

      <div className={`state-banner ${planning ? 'planning' : 'live'}`}>
        {planning ? `Planning round ${game.round}` : `Round ${game.round} is on the field`}
      </div>

      <section className="list-group">
        <h2>Out</h2>
        {out.map((player) => (
          <Row key={player} player={player} tag="—" />
        ))}
        <button className="list-row list-adjust" onClick={() => openOverlay('attendance')}>
          <span className="list-tag">+/−</span>
          <span className="list-name">Adjust players</span>
          <span className="absent-note">
            {game.absent.length > 0 ? `not here: ${game.absent.join(', ')}` : ''}
          </span>
        </button>
      </section>

      {group('Goalie', 'goalie')}
      {group('Defenders', 'defender')}
      {group('Forwards', 'forward')}

      {planning && (
        <button className="ghost small" onClick={reset}>
          Reset to suggestion
        </button>
      )}

      {below}

      <footer className="list-foot">
        <UndoRedo />
        <button className="primary" onClick={forward}>
          {planning ? 'Use lineup' : 'Subs'}
        </button>
      </footer>
    </div>
  );
}
