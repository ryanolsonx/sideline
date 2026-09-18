/**
 * A seeded shuffle, so one game answers the same way every time it is read while two games
 * with the same roster do not open the same way every Saturday.
 */
function randomsFrom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (const character of seed) {
    h = Math.imul(h ^ character.charCodeAt(0), 3432918353);
    h = (h << 13) | (h >>> 19);
  }

  let state = (h ^= h >>> 16) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffledBySeed<T>(items: readonly T[], seed: string): T[] {
  const shuffled = [...items];
  const random = randomsFrom(seed);

  // Walk the list from the back, trading each place with an earlier one.
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(random() * index);
    [shuffled[index], shuffled[swapWith]] = [shuffled[swapWith], shuffled[index]];
  }

  return shuffled;
}
