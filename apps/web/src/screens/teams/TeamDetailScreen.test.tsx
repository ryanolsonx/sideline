import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { TeamDetailScreen } from './TeamDetailScreen';

it('replaces a player and saves the team formation', async () => {
  const save = vi.fn().mockResolvedValue(undefined);
  render(<TeamDetailScreen team={{ id: 'team-1', name: 'Salt Lake Strikers', players: [{ name: 'Jordan Lee' }], formation: { defender: 2, forward: 2 } }} onBack={vi.fn()} onSave={save} />);
  fireEvent.click(screen.getByRole('button', { name: 'Remove Jordan Lee' }));
  fireEvent.change(screen.getByLabelText('Player name'), { target: { value: 'Morgan Park' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add player' }));
  fireEvent.click(screen.getByLabelText('6v6: 2 defenders, 3 forwards'));
  fireEvent.click(screen.getByRole('button', { name: 'Save team' }));
  await expect(save).toHaveBeenCalledWith(['Morgan Park'], { defender: 2, forward: 3 });
});
