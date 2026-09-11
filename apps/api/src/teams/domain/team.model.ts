export interface Player {
  id: string;
  name: string;
}

export interface Formation {
  defender: number;
  forward: number;
}

export const legacyFormation: Formation = { defender: 2, forward: 2 };

export interface Team {
  id: string;
  name: string;
  coachUsername: string;
  players: Player[];
  formation: Formation;
  createdAt: Date;
}

function normalizeName(value: string, label: string): string {
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (!normalized) throw new Error(`${label} is required.`);
  return normalized;
}

export function normalizeTeamName(name: string): string {
  return normalizeName(name, 'A team name');
}

export function normalizeCoachUsername(username: string): string {
  return normalizeName(username, 'A coach username').toLowerCase();
}

export function normalizePlayerNames(playerNames: string[]): string[] {
  if (playerNames.length === 0) throw new Error('At least one player is required.');
  if (playerNames.length > 9) throw new Error('A team can have no more than nine players.');
  return playerNames.map((name) => normalizeName(name, 'A player name'));
}

export function normalizeFormation(formation: Formation): Formation {
  const normalized = { defender: formation.defender, forward: formation.forward };
  const fieldSize = normalized.defender + normalized.forward + 1;
  if (!Number.isInteger(normalized.defender) || !Number.isInteger(normalized.forward)
    || normalized.defender < 1 || normalized.forward < 1 || (fieldSize !== 5 && fieldSize !== 6)) {
    throw new Error('A formation must be a 5v5 or 6v6 set of positive outfield counts.');
  }
  return normalized;
}

export function formatForFormation(formation: Formation): '5v5' | '6v6' {
  const fieldSize = formation.defender + formation.forward + 1;
  if (fieldSize === 5) return '5v5';
  if (fieldSize === 6) return '6v6';
  throw new Error('A formation must be a 5v5 or 6v6 set of positive outfield counts.');
}
