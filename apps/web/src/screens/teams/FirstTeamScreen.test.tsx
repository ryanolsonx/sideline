import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FirstTeamScreen } from './FirstTeamScreen';

describe('FirstTeamScreen', () => {
  it('invites a first-time coach to add a team', () => {
    render(<FirstTeamScreen />);

    expect(
      screen.getByRole('heading', { name: "Welcome to Sideline. Let's add your team." }),
    ).toBeInTheDocument();
    expect(screen.getByText(/add and switch between more teams/i)).toBeInTheDocument();
  });

  it('continues to the roster with the team name', () => {
    render(<FirstTeamScreen />);

    fireEvent.change(screen.getByLabelText('Team name'), { target: { value: 'Salt Lake Strikers' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add players' }));

    expect(screen.getByRole('heading', { name: 'Add your players.' })).toBeInTheDocument();
    expect(screen.getByText('Salt Lake Strikers')).toBeInTheDocument();
  });

  it('adds a player and readies the field for the next one', () => {
    render(<FirstTeamScreen />);
    fireEvent.change(screen.getByLabelText('Team name'), { target: { value: 'Salt Lake Strikers' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add players' }));

    const playerField = screen.getByLabelText('Player name');
    fireEvent.change(playerField, { target: { value: 'Avery Kim' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByRole('listitem')).toHaveTextContent('Avery Kim');
    expect(playerField).toHaveValue('');
    expect(playerField).toHaveFocus();
  });

  it('builds an ordered roster and shows its count', () => {
    render(<FirstTeamScreen />);
    fireEvent.change(screen.getByLabelText('Team name'), { target: { value: 'Salt Lake Strikers' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add players' }));

    const playerField = screen.getByLabelText('Player name');
    for (const player of ['Avery Kim', 'Jordan Lee', 'Sam Rivera', 'Taylor Brooks', 'Casey Morgan', 'Riley Chen']) {
      fireEvent.change(playerField, { target: { value: player } });
      fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    }

    expect(screen.getAllByRole('listitem').map((item) => item.querySelector('.player-name')?.textContent)).toEqual([
      'Avery Kim',
      'Jordan Lee',
      'Sam Rivera',
      'Taylor Brooks',
      'Casey Morgan',
      'Riley Chen',
    ]);
    expect(screen.getByText('6 players')).toBeInTheDocument();
  });

  it('requires at least one player before setup can finish', () => {
    render(<FirstTeamScreen onCreateTeam={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Team name'), { target: { value: 'Salt Lake Strikers' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add players' }));

    const finishButton = screen.getByRole('button', { name: 'Finish setup' });
    expect(finishButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Player name'), { target: { value: 'Avery Kim' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(finishButton).toBeEnabled();

    fireEvent.click(screen.getByRole('button', { name: 'Remove Avery Kim' }));
    expect(finishButton).toBeDisabled();
  });

  it('shows the completed team after setup is saved', async () => {
    const createTeam = vi.fn().mockResolvedValue({
      name: 'Salt Lake Strikers',
      players: [{ name: 'Avery Kim' }],
    });
    render(<FirstTeamScreen onCreateTeam={createTeam} />);
    fireEvent.change(screen.getByLabelText('Team name'), { target: { value: 'Salt Lake Strikers' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add players' }));
    fireEvent.change(screen.getByLabelText('Player name'), { target: { value: 'Avery Kim' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    fireEvent.click(screen.getByRole('button', { name: 'Finish setup' }));

    await waitFor(() => expect(createTeam).toHaveBeenCalledWith('Salt Lake Strikers', ['Avery Kim']));
    expect(screen.getByRole('heading', { name: 'Salt Lake Strikers' })).toBeInTheDocument();
    expect(screen.getByText('1 player')).toBeInTheDocument();
  });

  it('starts another setup without losing an existing team', () => {
    render(
      <FirstTeamScreen
        initialTeams={[{ name: 'Salt Lake Strikers', players: [{ name: 'Avery Kim' }] }]}
        onCreateTeam={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add team' }));

    expect(screen.getByLabelText('Team name')).toBeInTheDocument();
    expect(screen.getByText('Already managing: Salt Lake Strikers')).toBeInTheDocument();
  });
});
