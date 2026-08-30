import { describe, expect, it } from 'vitest';
import { normalizeMatchName } from './match.model';

describe('normalizeMatchName', () => {
  it('trims and collapses whitespace in a match name', () => {
    expect(normalizeMatchName('  Friday   night  ')).toBe('Friday night');
  });

  it('rejects an empty match name', () => {
    expect(() => normalizeMatchName('   ')).toThrow('A match name is required.');
  });
});
