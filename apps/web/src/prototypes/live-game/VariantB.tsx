// PROTOTYPE — throwaway. Variant B: the roster list. No spatial metaphor at all. Every
// participating player is one dense row, positions are groups, and fairness is on every row.
// Out leads, because who is coming on next is what the coach is looking for.
import { Dots, UndoRedo, useScreen } from './shell';
import { TOTAL_ROUNDS, fold, history } from './state';

export const NAME = 'Roster list';

/** The escape hatch made permanent: the whole game in the space the roster leaves behind. */
function FairnessGrid() {
  const { game, played } = useScreen();
  const abbrev = (player: string, n: number, mark: string) => {
    if (mark !== 'played') return mark === 'out' ? '—' : '·';
    const round = game.rounds[n];
    const slot = fold(round).find((s) => s.player === player) ?? round.starting.find((s) => s.player === player);
    return slot ? { goalie: 'GK', defender: 'D', forward: 'F' }[slot.pos] : 'F';
  };

  return (
    <section className="inline-grid-wrap">
      <h2>The game so far</h2>
      <table className="inline-grid">
        <thead>
          <tr>
            <th />
            {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
              <th key={i} className={i + 1 === game.round ? 'now' : ''}>
                {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...game.roster]
            .sort((a, b) => played[a] - played[b] || a.localeCompare(b))
            .map((player) => (
              <tr key={player}>
                <th scope="row">{player}</th>
                {history(game, player).map((mark, i) => (
                  <td key={i} className={`cell-${mark} ${i + 1 === game.round ? 'now' : ''}`}>
                    {abbrev(player, i + 1, mark)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
}

export function VariantB() {
  const { game, lineup, out, played, goalieCounts, active, tap, forward, back, reset, openOverlay } =
    useScreen();
  const planning = game.screen === 'plan';
  const changes = game.rounds[game.round].changes;

  const Row = ({ player, tag }: { player: string | null; tag: string }) => {
    const cameOn = changes.some((c) => c.to === player);
    return (
      <button
        className={`list-row ${active === player ? 'is-active' : ''} ${cameOn ? 'is-changed' : ''}`}
        onClick={() => player && tap(player)}
      >
        <span className="list-tag">{tag}</span>
        <span className="list-name">{player ?? 'empty'}</span>
        <span className="list-flag">{cameOn ? 'on' : ''}</span>
        <Dots player={player ?? ''} />
        <span className="list-count">{played[player ?? ''] ?? 0}</span>
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
            tag={pos === 'goalie' ? `GK ×${goalieCounts[s.player ?? ''] ?? 0}` : pos === 'defender' ? 'D' : 'F'}
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

      <FairnessGrid />

      <footer className="list-foot">
        <UndoRedo />
        <button className="primary" onClick={forward}>
          {planning ? 'Use lineup' : 'Subs'}
        </button>
      </footer>
    </div>
  );
}
