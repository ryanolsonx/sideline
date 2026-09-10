const COACH_USERNAME_COOKIE = 'sidelineCoachUsername';

export function normalizeCoachUsername(username: string): string {
  return username.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function readCoachUsername(): string | undefined {
  const encodedUsername = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${COACH_USERNAME_COOKIE}=`))
    ?.slice(COACH_USERNAME_COOKIE.length + 1);

  if (!encodedUsername) return undefined;

  const username = normalizeCoachUsername(decodeURIComponent(encodedUsername));
  return username || undefined;
}

export function rememberCoachUsername(username: string): string {
  const normalizedUsername = normalizeCoachUsername(username);
  document.cookie = `${COACH_USERNAME_COOKIE}=${encodeURIComponent(normalizedUsername)}; Path=/; Max-Age=31536000; SameSite=Lax`;
  return normalizedUsername;
}

export function forgetCoachUsername(): void {
  document.cookie = `${COACH_USERNAME_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
