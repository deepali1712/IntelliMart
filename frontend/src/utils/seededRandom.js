// Mulberry32 deterministic 32-bit PRNG
export function createRng(seed = 1337) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class SeededRandom {
  constructor(seed = 42) {
    this.rng = createRng(seed);
  }

  // Returns float in [0, 1)
  next() {
    return this.rng();
  }

  // Returns float in [min, max)
  nextFloat(min, max) {
    return min + this.next() * (max - min);
  }

  // Returns integer in [min, max]
  nextInt(min, max) {
    return Math.floor(this.nextFloat(min, max + 1));
  }

  // Pick random element
  choice(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[this.nextInt(0, arr.length - 1)];
  }

  // Shuffle array copy deterministically
  shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

export const defaultRng = new SeededRandom(2026);
