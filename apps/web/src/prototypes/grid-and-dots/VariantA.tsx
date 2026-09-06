// PROTOTYPE — throwaway. Variant A: the grid carries the history, so the dots go.
// A row keeps only its tag, name and count; every question about who played when is answered
// by one grid below, which marks a mid-round arrival and departure explicitly.
import { useScreen } from '../live-game/shell';
import { ListScreen } from './screen';
import { LETTER, TOTAL_ROUNDS, cells, owedOrder } from './state';

export const NAME = 'Grid only, no dots';

/** Owed-order ranks the players who can actually go on, so anyone not here falls to the bottom. */
const gridOrder = (game: Parameters<typeof cells>[0]) => {
  const order = owedOrder(game);
  return [
    ...order.filter((p) => !game.absent.includes(p)),
    ...order.filter((p) => game.absent.includes(p)),
  ];
};

function Grid() {
  const { game } = useScreen();
  return (
    <section className="gd-grid-wrap">
      <h2>The game so far</h2>
      <table className="gd-grid">
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
          {gridOrder(game).map((player) => (
            <tr key={player} className={game.absent.includes(player) ? 'gd-not-here' : ''}>
              <th scope="row">{player}</th>
              {cells(game, player).map((cell, i) => (
                <td key={i} className={`gd-cell gd-${cell.mark} ${i + 1 === game.round ? 'now' : ''}`}>
                  {cell.mark === 'played' ? (
                    <>
                      {LETTER[cell.pos!]}
                      {!cell.began && <i className="gd-on">↑</i>}
                      {!cell.finished && <i className="gd-off">↓</i>}
                    </>
                  ) : cell.mark === 'out' ? (
                    '—'
                  ) : (
                    '·'
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="gd-legend">
        <span>
          <i className="gd-on">↑</i> came on mid-round
        </span>
        <span>
          <i className="gd-off">↓</i> came off
        </span>
        <span>— sat out</span>
        <span>· not there</span>
      </p>
    </section>
  );
}

export function VariantA() {
  const { played } = useScreen();
  return (
    <ListScreen
      trailing={(player) => <span className="list-count">{played[player] ?? 0}</span>}
      below={<Grid />}
    />
  );
}
