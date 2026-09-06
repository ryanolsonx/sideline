// PROTOTYPE — throwaway. Three variants of the live-game screen, switchable via
// `?prototype=live-game&variant=A|B|C`. Delete this folder once a variant has won.
import './prototype.css';
import {
  AttendanceOverlay,
  GridOverlay,
  Provider,
  UndoRedo,
  useArrowKeys,
  usePrototypeGame,
} from './shell';
import { NAME as NAME_A, VariantA } from './VariantA';
import { NAME as NAME_B, VariantB } from './VariantB';
import { NAME as NAME_C, VariantC } from './VariantC';

const VARIANTS = {
  A: { name: NAME_A, Component: VariantA },
  B: { name: NAME_B, Component: VariantB },
  C: { name: NAME_C, Component: VariantC },
} as const;

type Key = keyof typeof VARIANTS;
const KEYS = Object.keys(VARIANTS) as Key[];

const readVariant = (): Key => {
  const raw = new URLSearchParams(window.location.search).get('variant');
  return KEYS.includes(raw as Key) ? (raw as Key) : 'A';
};

const goTo = (key: Key) => {
  const params = new URLSearchParams(window.location.search);
  params.set('variant', key);
  window.location.search = params.toString();
};

export function LiveGamePrototype() {
  const screen = usePrototypeGame();
  const current = readVariant();
  const step = (delta: number) => goTo(KEYS[(KEYS.indexOf(current) + delta + KEYS.length) % KEYS.length]);
  useArrowKeys(() => step(-1), () => step(1));

  const { Component, name } = VARIANTS[current];

  return (
    <Provider value={screen}>
      <div className="proto-phone">
        <Component />
        {screen.overlay === 'grid' && <GridOverlay onClose={screen.closeOverlay} />}
        {screen.overlay === 'attendance' && <AttendanceOverlay onClose={screen.closeOverlay} />}
      </div>
      <div className="proto-switcher">
        <button onClick={() => step(-1)} aria-label="Previous variant">
          ←
        </button>
        <span>
          {current} · {name}
        </span>
        <button onClick={() => step(1)} aria-label="Next variant">
          →
        </button>
      </div>
    </Provider>
  );
}

export { UndoRedo };
