// numpy's legacy random generator, as the Cirq QAOA page draws its weights: np.random.seed(11) and np.random.randint(0, 500).
// The Mersenne Twister MT19937 with numpy's seeding (init_genrand), and numpy's masked rejection for a bounded integer: take the
// next 32-bit output, keep the bits under the smallest all-ones mask that covers the range, and reject values above the range.

/** The MT19937 generator of numpy's legacy RandomState. */
export class MersenneTwister {
  private readonly state = new Uint32Array(624)
  private index = 624

  constructor(seed: number) {
    this.state[0] = seed >>> 0
    for (let i = 1; i < 624; i++) {
      const prev = this.state[i - 1]!
      this.state[i] = (Math.imul(1812433253, prev ^ (prev >>> 30)) + i) >>> 0
    }
  }

  private twist(): void {
    for (let i = 0; i < 624; i++) {
      const y = ((this.state[i]! & 0x80000000) | (this.state[(i + 1) % 624]! & 0x7fffffff)) >>> 0
      this.state[i] = (this.state[(i + 397) % 624]! ^ (y >>> 1) ^ (y & 1 ? 0x9908b0df : 0)) >>> 0
    }
    this.index = 0
  }

  /** The next 32-bit output. */
  next(): number {
    if (this.index >= 624) this.twist()
    let y = this.state[this.index++]!
    y ^= y >>> 11
    y ^= (y << 7) & 0x9d2c5680
    y ^= (y << 15) & 0xefc60000
    y ^= y >>> 18
    return y >>> 0
  }
}

/** numpy's randint(low, high) for the range it covers: the masked rejection on the next 32-bit output. */
export const randintOf = (rng: MersenneTwister, low: number, high: number): number => {
  const range = high - low - 1
  let mask = range
  for (const shift of [1, 2, 4, 8, 16]) mask |= mask >>> shift
  for (;;) {
    const value = (rng.next() & mask) >>> 0
    if (value <= range) return low + value
  }
}

/** The weights of the QAOA page: np.random.seed(seed), then one np.random.randint(0, 500) / 100 per edge, in edge order. */
export const numpyWeights = (count: number, seed = 11): number[] => {
  const rng = new MersenneTwister(seed)
  return Array.from({ length: count }, () => randintOf(rng, 0, 500) / 100)
}
