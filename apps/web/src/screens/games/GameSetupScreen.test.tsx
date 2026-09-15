import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GameSetupScreen, GameSetupScreen_GameFragment } from './GameSetupScreen';
import { FragmentType } from '../../gql';

function gameWith(players: { id: string; name: string; present: boolean }[], attendanceConfirmed = false) {
  return { id: 'game-1', attendanceConfirmed, players } as unknown as FragmentType<
    typeof GameSetupScreen_GameFragment
  >;
}

const roster = [
  { id: 'player-1', name: 'Avery Kim', present: true },
  { id: 'player-2', name: 'Jordan Lee', present: true },
  { id: 'player-3', name: 'Riley Chen', present: true },
];

describe('GameSetupScreen', () => {
  it('starts with everyone here, so the coach unticks the no-shows', () => {
    render(<GameSetupScreen game={gameWith(roster)} onBack={vi.fn()} onConfirm={vi.fn()} />);

    for (const player of roster) {
      expect(screen.getByRole('checkbox', { name: player.name })).toBeChecked();
    }
    expect(screen.getByText('3 of 3 here')).toBeInTheDocument();
  });

  it('confirms the whole list in one action', async () => {
    const confirm = vi.fn().mockResolvedValue(undefined);
    render(<GameSetupScreen game={gameWith(roster)} onBack={vi.fn()} onConfirm={confirm} />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Riley Chen' }));
    fireEvent.click(screen.getByRole('button', { name: "Confirm who's here" }));

    await waitFor(() => expect(confirm).toHaveBeenCalledWith(['player-1', 'player-2']));
    expect(confirm).toHaveBeenCalledTimes(1);
  });

  it('says the game is waiting to begin once who is here is confirmed', async () => {
    render(<GameSetupScreen game={gameWith(roster)} onBack={vi.fn()} onConfirm={vi.fn().mockResolvedValue(undefined)} />);

    fireEvent.click(screen.getByRole('button', { name: "Confirm who's here" }));

    expect(await screen.findByText(/waiting to begin/)).toBeInTheDocument();
  });

  it('opens an already confirmed game showing who was marked absent', () => {
    render(<GameSetupScreen
      game={gameWith([...roster.slice(0, 2), { id: 'player-3', name: 'Riley Chen', present: false }], true)}
      onBack={vi.fn()}
      onConfirm={vi.fn()}
    />);

    expect(screen.getByRole('checkbox', { name: 'Riley Chen' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Avery Kim' })).toBeChecked();
    expect(screen.getByText(/waiting to begin/)).toBeInTheDocument();
  });

  it('will not let the list drift from what is being saved', async () => {
    let finishConfirm = () => {};
    const confirm = vi.fn(() => new Promise<void>((resolve) => { finishConfirm = resolve; }));
    render(<GameSetupScreen game={gameWith(roster)} onBack={vi.fn()} onConfirm={confirm} />);

    fireEvent.click(screen.getByRole('button', { name: "Confirm who's here" }));

    expect(screen.getByRole('checkbox', { name: 'Riley Chen' })).toBeDisabled();
    finishConfirm();
    await screen.findByText(/waiting to begin/);
  });

  it('keeps the coach on the list when it could not be saved', async () => {
    render(<GameSetupScreen game={gameWith(roster)} onBack={vi.fn()} onConfirm={vi.fn().mockRejectedValue(new Error('nope'))} />);

    fireEvent.click(screen.getByRole('button', { name: "Confirm who's here" }));

    expect(await screen.findByRole('alert')).toHaveTextContent('We could not save who is here.');
  });
});
