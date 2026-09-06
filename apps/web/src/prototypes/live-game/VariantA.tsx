// PROTOTYPE — throwaway. Variant A: the pitch. The lineup is laid out where the players
// stand, and the plan/live distinction is carried by the whole surface rather than a label.
import { Dots, UndoRedo, useScreen } from './shell';

export const NAME = 'Pitch';

export function VariantA() {
  const { game, lineup, out, active, tap, forward, back, reset, openOverlay } = useScreen();
  const planning = game.screen === 'plan';
  const changed = new Set(game.rounds[game.round].changes.flatMap((c) => [c.from, c.to]));

  const row = (pos: 'goalie' | 'defender' | 'forward') =>
    lineup
      .map((slot, i) => ({ ...slot, i }))
      .filter((slot) => slot.pos === pos)
      .map((slot) => (
        <button
          key={slot.i}
          className={[
            'pitch-player',
            `pitch-${slot.pos}`,
            active === slot.player ? 'is-active' : '',
            !planning && changed.has(slot.player) ? 'is-changed' : '',
          ].join(' ')}
          onClick={() => slot.player && tap(slot.player)}
        >
          <span className="pitch-name">{slot.player ?? '—'}</span>
          <Dots player={slot.player ?? ''} />
        </button>
      ));

  return (
    <div className={`pitch-screen ${planning ? 'is-planning' : 'is-live'}`}>
      <header className="pitch-head">
        <button className="ghost" onClick={back}>
          ‹ Back
        </button>
        <div className="pitch-title">
          <strong>Round {game.round}</strong>
          <span>{planning ? 'planning · not on the field yet' : 'on the field'}</span>
        </div>
        <button className="ghost" onClick={() => openOverlay('grid')}>
          Grid
        </button>
      </header>

      <div className="pitch">
        <div className="pitch-row">{row('goalie')}</div>
        <div className="pitch-row">{row('defender')}</div>
        <div className="pitch-row">{row('forward')}</div>
      </div>

      <section className="bench">
        <h2>Out</h2>
        <div className="bench-row">
          {out.map((player) => (
            <button
              key={player}
              className={`bench-player ${active === player ? 'is-active' : ''} ${!planning && changed.has(player) ? 'is-changed' : ''}`}
              onClick={() => tap(player)}
            >
              <span className="pitch-name">{player}</span>
              <Dots player={player} />
            </button>
          ))}
        </div>
      </section>

      <div className="pitch-actions">
        <button className="ghost small" onClick={() => openOverlay('attendance')}>
          Adjust players
        </button>
        {planning && (
          <button className="ghost small" onClick={reset}>
            Reset
          </button>
        )}
      </div>

      <footer className="pitch-foot">
        <UndoRedo />
        <button className="primary" onClick={forward}>
          {planning ? 'Use lineup' : 'Subs'}
        </button>
      </footer>
    </div>
  );
}
