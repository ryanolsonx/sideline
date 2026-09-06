// PROTOTYPE — throwaway. Variant B: one view. There is no grid below the roster, because each
// row *is* its own grid row — eight cells of position letters where the dots used to be. The
// whole roster is on screen, absent players in their own group, so nothing is lost by dropping
// the separate table.
import { useScreen } from '../live-game/shell';
import { ListScreen } from './screen';
import { LETTER, cells } from './state';

export const NAME = 'The row is the grid row';

function Strip({ player }: { player: string }) {
  const { game } = useScreen();
  return (
    <span className="gd-strip">
      {cells(game, player).map((cell, i) => (
        <i
          key={i}
          className={`gd-tick gd-${cell.mark} ${i + 1 === game.round ? 'now' : ''} ${!cell.began && cell.finished ? 'part' : ''}`}
        >
          {cell.mark === 'played' ? LETTER[cell.pos!] : cell.mark === 'out' ? '·' : ''}
        </i>
      ))}
    </span>
  );
}

function NotHere() {
  const { game } = useScreen();
  if (game.absent.length === 0) return null;
  return (
    <section className="list-group">
      <h2>Not here</h2>
      {game.absent.map((player) => (
        <div key={player} className="list-row gd-row is-absent">
          <span className="list-tag">·</span>
          <span className="list-name">{player}</span>
          <span className="list-flag" />
          <Strip player={player} />
          <span className="list-count">0</span>
        </div>
      ))}
    </section>
  );
}

export function VariantB() {
  const { played } = useScreen();
  return (
    <ListScreen
      trailing={(player) => (
        <>
          <Strip player={player} />
          <span className="list-count">{played[player] ?? 0}</span>
        </>
      )}
      below={
        <>
          <NotHere />
          <p className="gd-legend">
            <span>a lowercase letter means they came on mid-round</span>
          </p>
        </>
      }
    />
  );
}
