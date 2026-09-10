export interface Player {
  id: string;
  name: string;
}

export interface Formation {
  defender: number;
  forward: number;
}

export const supportedFormations: readonly Formation[] = [
  { defender: 2, forward: 2 },
  { defender: 1, forward: 3 },
  { defender: 2, forward: 3 },
];

export const defaultFormation: Formation = supportedFormations[0];

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
  const isSupported = supportedFormations.some(
    (candidate) => candidate.defender === normalized.defender && candidate.forward === normalized.forward,
  );
  if (!isSupported) throw new Error('Choose a supported formation.');
  return normalized;
}

export function formatForFormation(formation: Formation): '5v5' | '6v6' {
  return formation.defender + formation.forward + 1 === 5 ? '5v5' : '6v6';
}
