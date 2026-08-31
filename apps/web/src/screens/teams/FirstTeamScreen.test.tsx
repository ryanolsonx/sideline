import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
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
});
