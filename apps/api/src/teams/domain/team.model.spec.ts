import { describe, expect, it } from 'vitest';
import { normalizePlayerNames, normalizeTeamName } from './team.model';

describe('team setup', () => {
  it('normalizes the team and player names', () => {
    expect(normalizeTeamName('  Salt Lake   Strikers ')).toBe('Salt Lake Strikers');
    expect(normalizePlayerNames([' Avery   Kim ', 'Jordan Lee'])).toEqual(['Avery Kim', 'Jordan Lee']);
  });

  it('requires a team name', () => {
    expect(() => normalizeTeamName('  ')).toThrow('A team name is required.');
  });

  it('requires at least one named player', () => {
    expect(() => normalizePlayerNames([])).toThrow('At least one player is required.');
    expect(() => normalizePlayerNames(['  '])).toThrow('A player name is required.');
  });
});
