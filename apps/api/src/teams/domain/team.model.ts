export interface Player {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
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

export function normalizePlayerNames(playerNames: string[]): string[] {
  if (playerNames.length === 0) throw new Error('At least one player is required.');
  return playerNames.map((name) => normalizeName(name, 'A player name'));
}
