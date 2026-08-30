import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MatchCard } from './MatchCard';

describe('MatchCard', () => {
  it('shows a persisted match name', () => {
    render(<MatchCard name="Friday night match" createdAt="2026-08-30T00:00:00.000Z" />);

    expect(screen.getByText('Friday night match')).toBeInTheDocument();
  });
});
