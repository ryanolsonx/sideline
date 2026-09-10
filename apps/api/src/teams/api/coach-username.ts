import { UnauthorizedException } from '@nestjs/common';
import { normalizeCoachUsername } from '../domain/team.model';

const COACH_USERNAME_COOKIE = 'sidelineCoachUsername';

export function coachUsernameFromCookieHeader(cookieHeader: string | undefined): string {
  const encodedUsername = cookieHeader
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${COACH_USERNAME_COOKIE}=`))
    ?.slice(COACH_USERNAME_COOKIE.length + 1);

  if (!encodedUsername) throw new UnauthorizedException('A coach username is required.');

  try {
    return normalizeCoachUsername(decodeURIComponent(encodedUsername));
  } catch {
    throw new UnauthorizedException('A coach username is required.');
  }
}
