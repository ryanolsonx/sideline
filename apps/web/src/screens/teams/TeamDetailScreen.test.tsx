import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { TeamDetailScreen } from './TeamDetailScreen';

it('saves a renamed team, roster, and formation together', async () => {
  const save = vi.fn().mockResolvedValue(undefined);
  render(<TeamDetailScreen team={{ id: 'team-1', name: 'Salt Lake Strikers', players: [{ name: 'Jordan Lee' }], formation: { defender: 2, forward: 2 } }} onBack={vi.fn()} onSave={save} />);
  fireEvent.click(screen.getByRole('button', { name: 'Remove Jordan Lee' }));
  fireEvent.change(screen.getByLabelText('Team name'), { target: { value: 'Salt Lake Comets' } });
  fireEvent.change(screen.getByLabelText('Add a player'), { target: { value: 'Morgan Park' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add' }));
  fireEvent.click(screen.getByRole('radio', { name: /6v6/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  await expect(save).toHaveBeenCalledWith('Salt Lake Comets', ['Morgan Park'], { defender: 2, forward: 3 });
});
