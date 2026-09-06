// PROTOTYPE — throwaway. Variant C: two columns and a ledger. On is left, Out is right, a
// swap is one tap in each column, and the live screen shows what has changed since kick-off.
import { Dots, UndoRedo, useScreen } from './shell';

export const NAME = 'In / Out columns';

export function VariantC() {
  const { game, lineup, out, played, active, tap, forward, back, reset, openOverlay } = useScreen();
  const planning = game.screen === 'plan';
  const round = game.rounds[game.round];
  const label = { goalie: 'GK', defender: 'D', forward: 'F' } as const;

  return (
    <div className="cols-screen">
      <header className="cols-head">
        <button className="ghost" onClick={back}>
          ‹ Round {Math.max(1, game.round - (planning ? 1 : 0))}
        </button>
        <span className={`cols-state ${planning ? 'planning' : 'live'}`}>
          {planning ? 'Planning' : 'Live'} · R{game.round}
        </span>
        <button className="ghost" onClick={() => openOverlay('grid')}>
          Grid
        </button>
      </header>

      <div className="cols">
        <section className="col col-in">
          <h2>On the field</h2>
          {lineup.map((slot, i) => (
            <button
              key={i}
              className={`col-row ${active === slot.player ? 'is-active' : ''}`}
              onClick={() => slot.player && tap(slot.player)}
            >
              <span className={`pos pos-${slot.pos}`}>{label[slot.pos]}</span>
              <span className="col-name">{slot.player ?? '—'}</span>
              <span className="col-count">{played[slot.player ?? ''] ?? 0}</span>
            </button>
          ))}
        </section>

        <section className="col col-out">
          <h2>Out</h2>
          {out.map((player) => (
            <button
              key={player}
              className={`col-row ${active === player ? 'is-active' : ''}`}
              onClick={() => tap(player)}
            >
              <span className="col-name">{player}</span>
              <span className="col-count">{played[player]}</span>
            </button>
          ))}
          <button className="ghost small full" onClick={() => openOverlay('attendance')}>
            Adjust players
          </button>
        </section>
      </div>

      <section className="ledger">
        <h2>{planning ? 'Round starts as' : 'Changes this round'}</h2>
        {planning ? (
          <p className="ledger-empty">
            Nothing is on the field yet. A swap here rewrites what round {game.round} begins as.
            <button className="ghost small" onClick={reset}>
              Reset
            </button>
          </p>
        ) : round.changes.length === 0 ? (
          <p className="ledger-empty">
            Round {game.round} is being played as it started. A swap here is recorded as a change.
          </p>
        ) : (
          <ol>
            {round.changes.map((c, i) => (
              <li key={i}>
                <span className={`pos pos-${round.starting[c.slot].pos}`}>
                  {label[round.starting[c.slot].pos]}
                </span>
                <strong>{c.to}</strong> on for <span className="off">{c.from}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="fairness">
        {[...game.roster]
          .filter((p) => !game.absent.includes(p))
          .sort((a, b) => played[a] - played[b] || a.localeCompare(b))
          .map((player) => (
            <div key={player} className="fair-row">
              <span>{player}</span>
              <Dots player={player} />
            </div>
          ))}
      </section>

      <footer className="cols-foot">
        <UndoRedo />
        <button className="primary" onClick={forward}>
          {planning ? 'Use lineup ›' : 'Subs ›'}
        </button>
      </footer>
    </div>
  );
}
