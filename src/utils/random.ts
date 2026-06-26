export function createRng(seed: number): () => number {
  let s = seed | 0;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function weightedRandom<T>(rng: () => number, items: { item: T; weight: number }[]): T {
  const totalWeight = items.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = rng() * totalWeight;
  for (const entry of items) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry.item;
    }
  }
  return items[items.length - 1].item;
}

export function poissonRandom(rng: () => number, lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rng();
  } while (p > L);
  return k - 1;
}
