import { describe, expect, it } from 'vitest';
import {
  formatForFormation,
  normalizeCoachUsername,
  normalizeFormation,
  normalizePlayerNames,
  normalizeTeamName,
} from './team.model';

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

  it('limits a roster to nine players', () => {
    expect(() => normalizePlayerNames(Array.from({ length: 10 }, (_, index) => `Player ${index}`))).toThrow(
      'A team can have no more than nine players.',
    );
  });

  it('accepts only supported formations and derives their format', () => {
    expect(normalizeFormation({ defender: 1, forward: 3 })).toEqual({ defender: 1, forward: 3 });
    expect(formatForFormation({ defender: 2, forward: 3 })).toBe('6v6');
    expect(() => normalizeFormation({ defender: 3, forward: 1 })).toThrow(
      'Choose a supported formation.',
    );
  });

  it('normalizes a coach username as its identity', () => {
    expect(normalizeCoachUsername('  Casey   MORGAN ')).toBe('casey morgan');
    expect(() => normalizeCoachUsername('  ')).toThrow('A coach username is required.');
  });
});
