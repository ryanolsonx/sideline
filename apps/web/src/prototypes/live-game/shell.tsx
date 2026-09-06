// PROTOTYPE — throwaway. Shared plumbing every variant leans on: the fake game, the
// tap-tap swap, undo/redo, and the two overlays.
import { createContext, useContext, useEffect, useState } from 'react';
import {
  type Game,
  type HistoryMark,
  type Lineup,
  TOTAL_ROUNDS,
  back,
  fold,
  forward,
  history,
  newGame,
  participating,
  positionCounts,
  roundsPlayed,
  suggest,
  swap,
  toggleAttendance,
} from './state';

export type Overlay = 'none' | 'grid' | 'attendance';

export type ScreenProps = {
  game: Game;
  lineup: Lineup;
  out: string[];
  played: Record<string, number>;
  goalieCounts: Record<string, number>;
  active: string | null;
  tap: (player: string) => void;
  forward: () => void;
  back: () => void;
  reset: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  openOverlay: (overlay: Overlay) => void;
  markAttendance: (player: string) => void;
  justBranched: boolean;
};

const PrototypeContext = createContext<ScreenProps | null>(null);
export const useScreen = () => useContext(PrototypeContext)!;

export function usePrototypeGame(): ScreenProps & { overlay: Overlay; closeOverlay: () => void } {
  const [past, setPast] = useState<Game[]>([]);
  const [game, setGame] = useState<Game>(newGame);
  const [future, setFuture] = useState<Game[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [overlay, setOverlay] = useState<Overlay>('none');
  const [justBranched, setJustBranched] = useState(false);

  const act = (next: (g: Game) => Game) => {
    setPast((p) => [...p, game]);
    setJustBranched(future.length > 0);
    setFuture([]);
    setGame(next(game));
  };

  const round = game.rounds[game.round];
  const lineup = fold(round);
  const onField = new Set(lineup.map((s) => s.player));
  const out = participating(game).filter((p) => !onField.has(p));

  return {
    game,
    lineup,
    out,
    played: roundsPlayed(game),
    goalieCounts: positionCounts(game, 'goalie'),
    active,
    overlay,
    justBranched,
    closeOverlay: () => setOverlay('none'),
    openOverlay: setOverlay,
    tap: (player) => {
      if (active === null) return setActive(player);
      if (active === player) return setActive(null);
      act((g) => swap(g, active, player));
      setActive(null);
    },
    forward: () => {
      setActive(null);
      act(forward);
    },
    back: () => {
      setActive(null);
      act(back);
    },
    reset: () =>
      act((g) => ({
        ...g,
        rounds: { ...g.rounds, [g.round]: { starting: suggest(g, g.round), changes: [] } },
      })),
    markAttendance: (player) => act((g) => toggleAttendance(g, player)),
    undo: () => {
      if (!past.length) return;
      setFuture((f) => [game, ...f]);
      setGame(past[past.length - 1]);
      setPast((p) => p.slice(0, -1));
      setActive(null);
    },
    redo: () => {
      if (!future.length) return;
      setPast((p) => [...p, game]);
      setGame(future[0]);
      setFuture((f) => f.slice(1));
      setActive(null);
    },
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}

export function Provider({ value, children }: { value: ScreenProps; children: React.ReactNode }) {
  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

export const MARK_LABEL: Record<HistoryMark, string> = {
  played: 'played',
  out: 'out',
  absent: 'not there',
};

export function Dots({ player }: { player: string }) {
  const { game } = useScreen();
  return (
    <span className="dots" aria-label={`${game.round} rounds so far`}>
      {history(game, player).map((mark, i) => (
        <i key={i} className={`dot dot-${mark}`} title={`Round ${i + 1}: ${MARK_LABEL[mark]}`} />
      ))}
    </span>
  );
}

export function UndoRedo() {
  const { undo, redo, canUndo, canRedo, justBranched } = useScreen();
  return (
    <div className="undo-cluster">
      <button className="undo-btn" onClick={undo} disabled={!canUndo} aria-label="Undo">
        ↶
      </button>
      <button className="undo-btn" onClick={redo} disabled={!canRedo} aria-label="Redo">
        ↷
      </button>
      {justBranched && <span className="branch-note">branched</span>}
    </div>
  );
}

export function GridOverlay({ onClose }: { onClose: () => void }) {
  const { game, played } = useScreen();
  const abbrev = (mark: HistoryMark, player: string, n: number) => {
    if (mark === 'absent') return '·';
    if (mark === 'out') return '—';
    const round = game.rounds[n];
    const slot = fold(round).find((s) => s.player === player) ?? round.starting.find((s) => s.player === player);
    return slot ? { goalie: 'GK', defender: 'D', forward: 'F' }[slot.pos] : 'F';
  };
  return (
    <div className="overlay">
      <header className="overlay-head">
        <h2>The game so far</h2>
        <button onClick={onClose}>Close</button>
      </header>
      <div className="grid-scroll">
        <table className="grid">
          <thead>
            <tr>
              <th />
              {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
                <th key={i} className={i + 1 === game.round ? 'now' : ''}>
                  {i + 1}
                </th>
              ))}
              <th className="tot">▲</th>
            </tr>
          </thead>
          <tbody>
            {[...game.roster]
              .sort((a, b) => played[a] - played[b] || a.localeCompare(b))
              .map((player) => (
                <tr key={player}>
                  <th scope="row">{player}</th>
                  {history(game, player).map((mark, i) => (
                    <td key={i} className={`cell-${mark}`}>
                      {abbrev(mark, player, i + 1)}
                    </td>
                  ))}
                  <td className="tot">{played[player]}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AttendanceOverlay({ onClose }: { onClose: () => void }) {
  const { game, markAttendance } = useScreen();
  return (
    <div className="overlay">
      <header className="overlay-head">
        <h2>Who is here</h2>
        <button onClick={onClose}>Done</button>
      </header>
      <p className="overlay-note">
        On the field now, so a mark counts from the next round. Tapping Subs is what makes it bite.
      </p>
      <ul className="attend-list">
        {game.roster.map((player) => (
          <li key={player}>
            <label>
              <input
                type="checkbox"
                checked={!game.absent.includes(player)}
                onChange={() => markAttendance(player)}
              />
              <span>{player}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function useArrowKeys(onLeft: () => void, onRight: () => void) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') onLeft();
      if (e.key === 'ArrowRight') onRight();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [onLeft, onRight]);
}
