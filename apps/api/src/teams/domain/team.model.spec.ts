import { describe, expect, it } from 'vitest';
import { normalizeCoachUsername, normalizePlayerNames, normalizeTeamName } from './team.model';

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

  it('normalizes a coach username as its identity', () => {
    expect(normalizeCoachUsername('  Casey   MORGAN ')).toBe('casey morgan');
    expect(() => normalizeCoachUsername('  ')).toThrow('A coach username is required.');
  });
});
