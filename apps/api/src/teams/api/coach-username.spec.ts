import { UnauthorizedException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { coachUsernameFromCookieHeader } from './coach-username';

describe('coach username request identity', () => {
  it('reads and normalizes the coach username cookie', () => {
    expect(
      coachUsernameFromCookieHeader('theme=dark; sidelineCoachUsername=%20River%20%20Coach%20'),
    ).toBe('river coach');
  });

  it('rejects a request without a coach username', () => {
    expect(() => coachUsernameFromCookieHeader(undefined)).toThrow(UnauthorizedException);
    expect(() => coachUsernameFromCookieHeader('theme=dark')).toThrow(
      'A coach username is required.',
    );
  });
});
