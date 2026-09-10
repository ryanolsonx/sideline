import { describe, expect, it, vi } from 'vitest';
import { rememberCoachUsername } from './coach-identity';

describe('rememberCoachUsername', () => {
  it('persists the normalized username between browser visits', () => {
    const cookieSetter = vi.spyOn(Document.prototype, 'cookie', 'set');

    expect(rememberCoachUsername(' Casey   Morgan ')).toBe('casey morgan');
    expect(cookieSetter).toHaveBeenCalledWith(
      'sidelineCoachUsername=casey%20morgan; Path=/; Max-Age=31536000; SameSite=Lax',
    );
  });
});
