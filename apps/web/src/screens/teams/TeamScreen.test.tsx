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
  it('names the team it is about', () => {
    render(<TeamScreen team={team} onBack={vi.fn()} onEditTeam={vi.fn()} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Salt Lake Strikers' })).toBeInTheDocument();
    expect(screen.getByText(/5v5 · 2 defenders · 2 forwards · 2 players/)).toBeInTheDocument();
  });

  it('keeps team settings one tap away', () => {
    const editTeam = vi.fn();
    render(<TeamScreen team={team} onBack={vi.fn()} onEditTeam={editTeam} />);

    fireEvent.click(screen.getByRole('button', { name: 'Team settings' }));

    expect(editTeam).toHaveBeenCalled();
  });

});
