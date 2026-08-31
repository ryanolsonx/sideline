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
});
