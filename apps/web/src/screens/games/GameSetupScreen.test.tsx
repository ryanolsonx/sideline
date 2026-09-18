import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GameSetupScreen, GameSetupScreen_GameFragment } from './GameSetupScreen';
import { FragmentType } from '../../gql';

function gameWith(players: { id: string; name: string; present: boolean }[]) {
  return { id: 'game-1', players } as unknown as FragmentType<typeof GameSetupScreen_GameFragment>;
}

const roster = [
  { id: 'player-1', name: 'Avery Kim', present: true },
  { id: 'player-2', name: 'Jordan Lee', present: true },
  { id: 'player-3', name: 'Riley Chen', present: true },
];

describe('GameSetupScreen', () => {
  it('starts with everyone here, so the coach unticks the no-shows', () => {
    render(<GameSetupScreen game={gameWith(roster)} onBack={vi.fn()} onBegin={vi.fn()} />);

    for (const player of roster) {
      expect(screen.getByRole('checkbox', { name: player.name })).toBeChecked();
    }
    expect(screen.getByText('3 of 3 here')).toBeInTheDocument();
  });

  it('begins the game with the whole list in one action', async () => {
    const begin = vi.fn().mockResolvedValue(undefined);
    render(<GameSetupScreen game={gameWith(roster)} onBack={vi.fn()} onBegin={begin} />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Riley Chen' }));
    fireEvent.click(screen.getByRole('button', { name: 'Begin' }));

    await waitFor(() => expect(begin).toHaveBeenCalledWith(['player-1', 'player-2']));
    expect(begin).toHaveBeenCalledTimes(1);
  });

  it('will not let the list drift from what is being sent', () => {
    const begin = vi.fn(() => new Promise<void>(() => {}));
    render(<GameSetupScreen game={gameWith(roster)} onBack={vi.fn()} onBegin={begin} />);

    fireEvent.click(screen.getByRole('button', { name: 'Begin' }));

    expect(screen.getByRole('checkbox', { name: 'Riley Chen' })).toBeDisabled();
  });

  it('will not begin a game nobody turned up to', () => {
    render(<GameSetupScreen
      game={gameWith(roster.map((player) => ({ ...player, present: false })))}
      onBack={vi.fn()}
      onBegin={vi.fn()}
    />);

    expect(screen.getByRole('button', { name: 'Begin' })).toBeDisabled();
  });

  it('keeps the coach on the list when the game could not begin', async () => {
    render(<GameSetupScreen game={gameWith(roster)} onBack={vi.fn()} onBegin={vi.fn().mockRejectedValue(new Error('nope'))} />);

    fireEvent.click(screen.getByRole('button', { name: 'Begin' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('We could not begin the game.');
  });
});
