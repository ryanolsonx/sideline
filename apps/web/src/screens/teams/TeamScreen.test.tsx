import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TeamScreen } from './TeamScreen';

const team = {
  id: 'team-1',
  name: 'Salt Lake Strikers',
  players: [{ name: 'Jordan Lee' }, { name: 'Avery Kim' }],
  formation: { defender: 2, forward: 2 },
};

describe('TeamScreen', () => {
  it('leads with starting a game', async () => {
    const startGame = vi.fn().mockResolvedValue(undefined);
    render(<TeamScreen team={team} onBack={vi.fn()} onStartGame={startGame} onEditTeam={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Start a game' }));

    await expect(startGame).toHaveBeenCalled();
  });

  it('names the team it is about', () => {
    render(<TeamScreen team={team} onBack={vi.fn()} onStartGame={vi.fn()} onEditTeam={vi.fn()} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Salt Lake Strikers' })).toBeInTheDocument();
    expect(screen.getByText(/5v5 · 2 defenders · 2 forwards · 2 players/)).toBeInTheDocument();
  });

  it('keeps team settings one tap away', () => {
    const editTeam = vi.fn();
    render(<TeamScreen team={team} onBack={vi.fn()} onStartGame={vi.fn()} onEditTeam={editTeam} />);

    fireEvent.click(screen.getByRole('button', { name: 'Team settings' }));

    expect(editTeam).toHaveBeenCalled();
  });

  it('says so when the game could not be started', async () => {
    render(<TeamScreen team={team} onBack={vi.fn()} onStartGame={vi.fn().mockRejectedValue(new Error('nope'))} onEditTeam={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Start a game' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('We could not start the game.');
  });
});
