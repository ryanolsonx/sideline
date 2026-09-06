// PROTOTYPE — throwaway. Three answers to what the roster row's trailing end and the space
// below it carry, switchable via `?prototype=grid-and-dots&variant=A|B|C`. The list screen
// underneath is the settled one and does not vary.
import '../live-game/prototype.css';
import './grid.css';
import { AttendanceOverlay, Provider, useArrowKeys, usePrototypeGame } from '../live-game/shell';
import { NAME as NAME_A, VariantA } from './VariantA';
import { NAME as NAME_B, VariantB } from './VariantB';
import { NAME as NAME_C, VariantC } from './VariantC';
import { seedGame } from './state';

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

export function GridAndDotsPrototype() {
  const screen = usePrototypeGame(seedGame);
  const current = readVariant();
  const step = (delta: number) => goTo(KEYS[(KEYS.indexOf(current) + delta + KEYS.length) % KEYS.length]);
  useArrowKeys(() => step(-1), () => step(1));

  const { Component, name } = VARIANTS[current];

  return (
    <Provider value={screen}>
      <div className="proto-phone">
        <Component />
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
