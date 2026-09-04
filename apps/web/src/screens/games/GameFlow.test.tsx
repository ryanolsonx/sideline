import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GameRoundScreen, StartGameScreen } from './GameFlow';

const team = {
  id: 'team-1',
  name: 'Salt Lake Strikers',
  players: [
    { id: 'player-1', name: 'Avery Kim' },
    { id: 'player-2', name: 'Jordan Lee' },
    { id: 'player-3', name: 'Sam Rivera' },
  ],
};

describe('StartGameScreen', () => {
  it('starts a selected format with the players marked present', () => {
    const start = vi.fn().mockResolvedValue(undefined);
    render(<StartGameScreen team={team} onStart={start} isStarting={false} onBack={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /^5 on 5/ }));
    for (const checkbox of screen.getAllByRole('checkbox')) fireEvent.click(checkbox);
    fireEvent.click(screen.getByRole('button', { name: 'Start game' }));

    expect(start).toHaveBeenCalledWith(5, ['player-1', 'player-2', 'player-3']);
  });
});

describe('GameRoundScreen', () => {
  it('shows the opening lineup and players who are out', () => {
    render(<GameRoundScreen game={{
      id: 'game-1', fieldSize: 6, status: 'ACTIVE', currentRound: 1,
      rounds: [{ id: 'round-1', number: 1, assignments: [
        { id: 'assignment-1', status: 'PLAYING', position: 'GOALIE', player: team.players[0] },
        { id: 'assignment-2', status: 'OUT', position: null, player: team.players[1] },
      ] }],
    }} teamName={team.name} onBack={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Round 1 of 8' })).toBeInTheDocument();
    expect(screen.getByLabelText('Playing')).toHaveTextContent('Avery Kim');
    expect(screen.getByLabelText('Out this round')).toHaveTextContent('Jordan Lee');
  });
});
