import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
    render(<FirstTeamScreen />);
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
});
