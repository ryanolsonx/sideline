import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RoundScreen, RoundScreen_GameFragment } from './RoundScreen';
import { FragmentType } from '../../gql';

function gameOn(currentRound: unknown) {
  return { currentRound } as unknown as FragmentType<typeof RoundScreen_GameFragment>;
}

const round = {
  number: 1,
  out: [{ id: 'player-6', name: 'Riley Chen' }],
  slots: [
    { position: 'GOALIE', player: { id: 'player-1', name: 'Avery Kim' } },
    { position: 'DEFENDER', player: { id: 'player-2', name: 'Jordan Lee' } },
    { position: 'DEFENDER', player: { id: 'player-3', name: 'Sam Rivera' } },
    { position: 'FORWARD', player: { id: 'player-4', name: 'Taylor Brooks' } },
    { position: 'FORWARD', player: { id: 'player-5', name: 'Casey Morgan' } },
  ],
};

describe('RoundScreen', () => {
  it('names the round it is showing', () => {
    render(<RoundScreen game={gameOn(round)} onBack={vi.fn()} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Round 1' })).toBeInTheDocument();
  });

  it('shows who is out before anyone on the field', () => {
    render(<RoundScreen game={gameOn(round)} onBack={vi.fn()} />);

    const headings = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);
    expect(headings).toEqual(['Out', 'Goalie', 'Defenders', 'Forwards']);
    expect(within(screen.getByRole('list', { name: 'Out' })).getByText('Riley Chen')).toBeInTheDocument();
  });

  it('puts each player at the position they are playing', () => {
    render(<RoundScreen game={gameOn(round)} onBack={vi.fn()} />);

    expect(within(screen.getByRole('list', { name: 'Goalie' })).getByText('Avery Kim')).toBeInTheDocument();
    expect(within(screen.getByRole('list', { name: 'Defenders' })).getByText('Jordan Lee')).toBeInTheDocument();
    expect(within(screen.getByRole('list', { name: 'Forwards' })).getByText('Casey Morgan')).toBeInTheDocument();
  });

  it('shows the places a short-handed side cannot fill', () => {
    render(<RoundScreen game={gameOn({
      ...round,
      out: [],
      slots: [...round.slots.slice(0, 4), { position: 'FORWARD', player: null }],
    })} onBack={vi.fn()} />);

    expect(within(screen.getByRole('list', { name: 'Forwards' })).getByText('Nobody')).toBeInTheDocument();
    expect(screen.getByText('Everyone here is playing this round.')).toBeInTheDocument();
  });
});
