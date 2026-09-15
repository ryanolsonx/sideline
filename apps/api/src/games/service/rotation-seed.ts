import { randomUUID } from 'node:crypto';

/**
 * Each game plans from its own seed, so the same roster does not produce the same round one
 * every Saturday while one game still answers the same way every time it is read.
 */
export function newRotationSeed(): string {
  return randomUUID();
}
