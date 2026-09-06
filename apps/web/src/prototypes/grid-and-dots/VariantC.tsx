// PROTOTYPE — throwaway. Variant C: owed, not history. The row carries a running balance
// against an even share rather than a raw count or a row of dots, and the grid below is
// sorted and labelled by who is owed time. A cell says the position and nothing else: that a
// change happened inside a round is the record's business, not the grid's.
import { useScreen } from '../live-game/shell';
import { ListScreen } from './screen';
import { LETTER, TOTAL_ROUNDS, balances, cells, owedOrder } from './state';

export const NAME = 'Owed, not history';

const label = (balance: number) => (balance === 0 ? 'even' : balance > 0 ? `+${balance}` : `${balance}`);

function Balance({ player }: { player: string }) {
  const { game } = useScreen();
  const balance = balances(game)[player] ?? 0;
  return (
    <span className={`gd-balance ${balance < 0 ? 'owed' : balance > 0 ? 'ahead' : ''}`}>
      {label(balance)}
    </span>
  );
}

function OwedGrid() {
  const { game, played } = useScreen();
  const balance = balances(game);
  const order = owedOrder(game);
  return (
    <section className="gd-grid-wrap">
      <h2>Owed the most, first</h2>
      <table className="gd-grid gd-quiet">
        <thead>
          <tr>
            <th />
            <th className="gd-owed">owed</th>
            {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
              <th key={i} className={i + 1 === game.round ? 'now' : ''}>
                {i + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {order.map((player) => (
            <tr key={player}>
              <th scope="row">{player}</th>
              <td className={`gd-owed ${balance[player] < 0 ? 'owed' : ''}`}>{label(balance[player])}</td>
              {cells(game, player).map((cell, i) => (
                <td key={i} className={`gd-cell gd-${cell.mark} ${i + 1 === game.round ? 'now' : ''}`}>
                  {cell.mark === 'played' ? LETTER[cell.pos!] : cell.mark === 'out' ? '—' : '·'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="gd-legend">
        <span>{order[0]} is next on</span>
        <span>
          {order.filter((p) => played[p] === played[order[0]]).length} tied at {played[order[0]]}
        </span>
      </p>
    </section>
  );
}

export function VariantC() {
  return <ListScreen trailing={(player) => <Balance player={player} />} below={<OwedGrid />} />;
}
