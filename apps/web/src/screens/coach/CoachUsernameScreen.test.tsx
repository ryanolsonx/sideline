import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CoachUsernameScreen } from './CoachUsernameScreen';

describe('CoachUsernameScreen', () => {
  it('continues with a normalized coach username', () => {
    const continueAs = vi.fn();
    render(<CoachUsernameScreen onContinue={continueAs} />);

    fireEvent.change(screen.getByLabelText('Coach username'), {
      target: { value: '  Casey   Morgan ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(continueAs).toHaveBeenCalledWith('casey morgan');
  });
});
