import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RoundPlanScreen, RoundPlanScreen_GameFragment } from './RoundPlanScreen';
import { FragmentType } from '../../gql';

function gamePlanning(plannedRound: unknown) {
  return { plannedRound } as unknown as FragmentType<typeof RoundPlanScreen_GameFragment>;
}

const round = {
  number: 1,
  out: [{ id: 'player-6', name: 'Riley Chen' }],
  slots: [
    { position: 'GOALIE', player: { id: 'player-1', name: 'Avery Kim' } },
    { position: 'DEFENDER', player: { id: 'player-2', name: 'Jordan Lee' } },
    { position: 'DEFENDER', player: { id: 'player-3', name: 'Sam Rivera' } },
    { position: 'FORWARD', player: { id: 'player-4', name: 'Taylor Brooks' } },
    { position: 'FORWARD', player: { id: 'player-5', name: 'Casey Morgan' } },
  ],
};

describe('RoundPlanScreen', () => {
  it('names the round being planned', () => {
    render(<RoundPlanScreen game={gamePlanning(round)} onBack={vi.fn()} onUseLineup={vi.fn()} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Round 1' })).toBeInTheDocument();
  });

  it('says the round is not on the field yet', () => {
    render(<RoundPlanScreen game={gamePlanning(round)} onBack={vi.fn()} onUseLineup={vi.fn()} />);

    expect(screen.getByText('Planned')).toBeInTheDocument();
    expect(screen.getByText(/Nobody is on the field yet/)).toBeInTheDocument();
  });

  it('shows who is out before anyone on the field', () => {
    render(<RoundPlanScreen game={gamePlanning(round)} onBack={vi.fn()} onUseLineup={vi.fn()} />);

    const headings = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);
    expect(headings).toEqual(['Out', 'Goalie', 'Defenders', 'Forwards']);
    expect(within(screen.getByRole('list', { name: 'Goalie' })).getByText('Avery Kim')).toBeInTheDocument();
  });

  it('puts the lineup on the field when the coach uses it', async () => {
    const onUseLineup = vi.fn().mockResolvedValue(undefined);
    render(<RoundPlanScreen game={gamePlanning(round)} onBack={vi.fn()} onUseLineup={onUseLineup} />);

    fireEvent.click(screen.getByRole('button', { name: 'Use Lineup' }));

    await waitFor(() => expect(onUseLineup).toHaveBeenCalledTimes(1));
  });

  it('says so when the round could not go onto the field', async () => {
    const onUseLineup = vi.fn().mockRejectedValue(new Error('no'));
    render(<RoundPlanScreen game={gamePlanning(round)} onBack={vi.fn()} onUseLineup={onUseLineup} />);

    fireEvent.click(screen.getByRole('button', { name: 'Use Lineup' }));

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Use Lineup' })).toBeEnabled();
  });
});
