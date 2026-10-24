// THE INVOLUTION DOOR. Given N and a base a, it finds the multiplicative order r of a modulo N by walking the powers, then
// reflects the exponents about the midpoint r/2 (σ_r(x) = r − x, the reflection shor_sigma states) and splits N with the
// square root a^(r/2): p = gcd(a^(r/2) − 1, N), q = gcd(a^(r/2) + 1, N). The walk is capped by `budget` steps, so a case
// whose order is out of reach is answered unresolved rather than left running. The court judges the result: four checks,
// and the court's standard of proof requires all four.
import { CourtFormulas } from '../families/court/index.js'
import { mcpFuseOf } from '../quantum/processing/unit/index.js'

const DEFAULT_BUDGET = 2_000_000

const gcdOf = (a: bigint, b: bigint): bigint => {
  let x = a < 0n ? -a : a
  let y = b < 0n ? -b : b
  while (y !== 0n) [x, y] = [y, x % y]
  return x
}

const powModOf = (base: bigint, exp: bigint, m: bigint): bigint => {
  let r = 1n % m
  let b = base % m
  let e = exp
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m
    b = (b * b) % m
    e >>= 1n
  }
  return r
}

/** Strong probable-prime test over fixed bases: a probable prime, not a proof. */
const probablePrimeOf = (n: bigint): boolean => {
  if (n < 2n) return false
  for (const p of [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n]) {
    if (n === p) return true
    if (n % p === 0n) return false
  }
  let d = n - 1n
  let s = 0
  while (d % 2n === 0n) { d /= 2n; s++ }
  return [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n].every((a) => {
    let x = powModOf(a, d, n)
    if (x === 1n || x === n - 1n) return true
    for (let i = 1; i < s; i++) {
      x = (x * x) % n
      if (x === n - 1n) return true
    }
    return false
  })
}

/** The multiplicative order of a modulo n by walking the powers, or null when the budget runs out first. */
const orderOf = (a: bigint, n: bigint, budget: number): { order: number | null; steps: number } => {
  let power = a % n
  for (let r = 1; r <= budget; r++) {
    if (power === 1n) return { order: r, steps: r }
    power = (power * a) % n
  }
  return { order: null, steps: budget }
}

const digitsOf = (x: unknown, fallback: string) => (typeof x === 'string' && /^[0-9]+$/.test(x) ? x : typeof x === 'number' && Number.isSafeInteger(x) ? String(x) : fallback)

mcpFuseOf('involute', {
  description: 'The involution door: { n, a?, budget? } finds the order of a modulo n by walking its powers, reflects the exponents about r/2 (σ_r(x) = r − x) and splits n with a^(r/2). The court judges the four checks. A walk past the budget is unresolved.',
  inputSchema: {
    type: 'object',
    properties: {
      n: { type: 'string', description: 'the modulus, as digits' },
      a: { type: 'string', description: 'the base, as digits (default 2)' },
      budget: { type: 'number', description: 'the most powers to walk (default 2000000)' },
    },
  },
  run: async (args) => {
    const n = BigInt(digitsOf(args.n, '91'))
    const a = BigInt(digitsOf(args.a, '2'))
    const budget = typeof args.budget === 'number' && args.budget > 0 ? Math.floor(args.budget) : DEFAULT_BUDGET
    if (n < 4n) return { kind: 'involute', n: String(n), status: 'refused', holds: false, next: ['the modulus must be at least 4'] }
    if (gcdOf(a, n) !== 1n) {
      const g = gcdOf(a, n)
      return { kind: 'involute', n: String(n), a: String(a), status: 'shared-factor', p: String(g), q: String(n / g), holds: g !== 1n && g !== n }
    }
    const walk = orderOf(a, n, budget)
    if (walk.order === null) {
      return { kind: 'involute', n: String(n), a: String(a), status: 'unresolved', steps: walk.steps, budget, holds: false, next: ['raise budget, or the order is beyond this walk'] }
    }
    const r = walk.order
    const even = r % 2 === 0
    const midpoint = even ? r / 2 : null
    const reflect = even ? powModOf(a, BigInt(midpoint as number), n) : null
    const bad = reflect === null ? 'odd order' : reflect === n - 1n ? 'a^(r/2) = -1' : null
    const p = reflect !== null && bad === null ? gcdOf(reflect - 1n, n) : 1n
    const q = reflect !== null && bad === null ? gcdOf(reflect + 1n, n) : 1n
    const checks = [p > 1n && p < n, q > 1n && q < n, p * q === n, probablePrimeOf(p) && probablePrimeOf(q)]
    const confidence = checks.filter(Boolean).length
    const court = CourtFormulas.standard(confidence, checks.length)
    return {
      kind: 'involute',
      n: String(n),
      a: String(a),
      status: bad ? 'bad-base' : 'factored',
      order: r,
      midpoint,
      reflect: reflect === null ? null : String(reflect),
      bad,
      p: String(p),
      q: String(q),
      product: String(p * q),
      steps: walk.steps,
      checks: { nontrivial: checks[0] && checks[1], product: checks[2], probablePrime: checks[3] },
      court: { formula: 'court.standard(confidence, required)', confidence, required: checks.length, value: court.value, holds: court.holds === true },
      holds: court.holds === true,
    }
  },
})
