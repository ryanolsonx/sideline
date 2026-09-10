import { UnauthorizedException } from '@nestjs/common';
import { normalizeCoachUsername } from '../domain/team.model';

const COACH_USERNAME_COOKIE = 'sidelineCoachUsername';

export function coachUsernameFromCookieHeader(cookieHeader: string | undefined): string {
  const coachUsername = optionalCoachUsernameFromCookieHeader(cookieHeader);
  if (!coachUsername) throw new UnauthorizedException('A coach username is required.');
  return coachUsername;
}

export function optionalCoachUsernameFromCookieHeader(
  cookieHeader: string | undefined,
): string | undefined {
  const encodedUsername = cookieHeader
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${COACH_USERNAME_COOKIE}=`))
    ?.slice(COACH_USERNAME_COOKIE.length + 1);

  if (!encodedUsername) return undefined;

  try {
    return normalizeCoachUsername(decodeURIComponent(encodedUsername));
  } catch {
    return undefined;
  }
}
