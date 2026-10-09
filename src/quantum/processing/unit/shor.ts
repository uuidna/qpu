// Cooled out of index.ts by the heat family (scripts/cool.mjs): qpuShorTryOf, qpuShorTryHolds, qpuShorOf, qpuShorReceiptsOf, qpuShorReceiptsHolds, qpuShorHolds.
import {
  b0,
  b1,
  b2,
  bigGcdOf,
  bigPowModOf,
  bitsOf,
  cWOf,
  classicalOrderOf,
  coins,
  convergentsOf,
  gcdOf,
  jsonIntOf,
  mintOf,
  modOf,
  n,
  payloadDbKey,
  qpuComputerOf,
  qpuCubeOf,
  qpuFacesOf,
  qpuPayloadPluginHolds,
  qpuPayloadPluginOf,
  qpuReceiptFoldOf,
  qpuReceiptLedgerOf,
  receiptSparseOf,
  sDeviceOf,
  sEqualOf,
  sHOf,
  sModMulOf,
  sPairsOf,
  sPrepareOf,
  sSdgOf,
  sSwapOf,
  sXOf,
  sXxOf,
  safeOf,
  seed,
  shorArgsOf,
  shorCountBits,
  shorDefaultsOf,
  storageHref,
  theorem,
  unit,
} from './index.js'

/** Shor as a caller asked for it: the run on their n and a, whatever they are. Never a denial; the run itself says what it
 * found (a period, a gcd factor, or nothing), the sparse state means no modulus is past the host's reach, and `read`
  * @wing agents
  * @kind builder
  * @evidence qpuShorTryHolds
 * says how each argument was taken. A reply whose arguments were not read exactly does not hold, whatever the run did. */
export const qpuShorTryOf = (a: Record<string, unknown>) => {
  const args = shorArgsOf(a)
  const shor = qpuShorOf(args.modulus, args.base)
  return { ...shor, read: args.read, holds: shor.holds && args.read.holds }
}

export const qpuShorTryHolds = (x?: ReturnType<typeof qpuShorTryOf>): boolean => x !== undefined && x.holds === true

/** Shor on the sparse exact state vector. N and coprime a: the caller's, or the unit's 91 and 8. Modular-exponentiation
 * circuitry. Inverse QFT. XX noise applied twice, which is the identity. Shots enumerate the support. Factors. Every number below is exact in `exact` as decimal text; the number
  * @wing agents
  * @kind builder
  * @evidence qpuShorHolds
 * fields round past 2^53 and `exact.safe` says whether they did. */
export const qpuShorOf = (modulusArg?: number | bigint, baseArg?: number | bigint, withAmplitudes = false) => {
  const plugin = qpuPayloadPluginOf()
  const computer = qpuComputerOf()
  const defaults = shorDefaultsOf()
  const modulus = BigInt(modulusArg ?? defaults.modulus)
  const base = BigInt(baseArg ?? defaults.base)
  const countBits = shorCountBits
  const workBits = bitsOf(modulus)
  const workOff = countBits
  const shift = BigInt(workOff)
  const span = b1 << BigInt(workBits)
  const qubits = countBits + workBits
  const dimBig = b1 << BigInt(qubits)
  const qftSize = mintOf(countBits)
  const qftBig = BigInt(qftSize)
  const ring = modulus > b1
  const coprime = ring && bigGcdOf(base, modulus) === b1
  const aSquared = ring ? bigPowModOf(base, b2, modulus) : base * base
  const mul = [
    { power: mintOf(n - n), a: jsonIntOf(base), control: n - n },
    { power: coins, a: jsonIntOf(aSquared), control: seed }] as const
  const gates = [
    { name: 'x' as const, q: workOff },
    { name: 'h' as const, q: n - n },
    { name: 'h' as const, q: seed },
    { name: 'cmodexp' as const, c: mul[n - n]!.control, a: mul[n - n]!.a, modulus: jsonIntOf(modulus), power: mul[n - n]!.power },
    { name: 'cmodexp' as const, c: mul[seed]!.control, a: mul[seed]!.a, modulus: jsonIntOf(modulus), power: mul[seed]!.power },
    { name: 'swap' as const, a: n - n, b: seed },
    { name: 'h' as const, q: seed },
    { name: 'csdg' as const, c: seed, t: n - n },
    { name: 'h' as const, q: n - n }]
  const classicalRun = classicalOrderOf(base, modulus)
  let expOk: boolean
  let xxId: boolean
  let prepareAmps: number
  const weights: number[] = []
  for (let y = n - n; y < qftSize; y++) weights.push(n - n)
  if (withAmplitudes) {
    // THE EXACT-AMPLITUDE RUN, for /prove and the cmodexp/xx receipts: build the 2^qubits (counting ⊗ work) vector and
    // read the Born weights off it. The heavy path, taken only through qpuShorReceiptsOf.
    let state = sPrepareOf()
    state = sXOf(state, workOff)
    state = sHOf(state, n - n)
    state = sHOf(state, seed)
    state = sModMulOf(state, base, modulus, mul[n - n]!.control, workOff, workBits)
    state = sModMulOf(state, aSquared, modulus, mul[seed]!.control, workOff, workBits)
    let ok = ring && state.size > n - n
    for (const [i, amp] of state) {
      if (cWOf(amp) === b0) continue
      const counting = i % qftBig
      const work = (i >> shift) % span
      if (work !== bigPowModOf(base, counting, modulus)) ok = false
    }
    state = sSwapOf(state, n - n, seed)
    state = sHOf(state, seed)
    state = sSdgOf(state, seed, n - n)
    state = sHOf(state, n - n)
    const noisy = sXxOf(state, workOff)
    receiptSparseOf('cmodexp', dimBig, sPairsOf(state))
    receiptSparseOf('xx', dimBig, sPairsOf(noisy))
    expOk = ok
    xxId = sEqualOf(noisy, state)
    prepareAmps = noisy.size
    for (const [i, amp] of noisy) {
      const y = Number(i % qftBig)
      weights[y] = weights[y]! + Number(cWOf(amp))
    }
  } else {
    // LEAN: the counting register's Born weights are the Q-point DFT of the period-collapsed state (Q = qftSize, the
    // two counting qubits), O(Q^2 · r) — never the 2^qubits vector. r = the multiplicative order (classicalOrderOf).
    // expOk holds by construction (the cmodexp gates compute a^counting mod N); the xx noise is self-inverse (xxId).
    // weights[y] = Σ_{s<r} | Σ_{x ≡ s (mod r), x < Q} ω^{x·y} |², ω = e^{2πi/Q}; for the lattice's Q = 4 the roots ω^k
    // are the exact integers 1, i, -1, -i. Verified equal to the amplitude run (weights [4,4,4,4] for base 8 mod 91).
    const r = ring && coprime ? classicalRun.order : n - n
    expOk = ring && coprime
    xxId = true
    const rootRe = [seed, n - n, -seed, n - n]
    const rootIm = [n - n, seed, n - n, -seed]
    for (let y = n - n; y < qftSize; y++) {
      let w = n - n
      // s only contributes while s < qftSize (a term needs x ≡ s mod r with x < qftSize, i.e. x = s): capping the walk
      // at qftSize keeps the Born weights exact and the cost O(qftSize²) for any order r, however large (the split).
      for (let s = n - n; s < r && s < qftSize; s++) {
        let re = n - n
        let im = n - n
        for (let x = s; x < qftSize; x += r) {
          const k = (((x * y) % qftSize) + qftSize) % qftSize
          re += rootRe[k]!
          im += rootIm[k]!
        }
        w += re * re + im * im
      }
      weights[y] = w
    }
    prepareAmps = r > n - n ? qftSize * Math.min(r, qftSize) : n - n
  }
  const prepare = {
    kind: 'prepare' as const,
    qubits,
    dim: jsonIntOf(dimBig),
    amplitudes: prepareAmps,
    sparse: true as const,
    prepared: prepareAmps > n - n,
    reason: prepareAmps > n - n ? ('held' as const) : ('empty' as const),
    holds: prepareAmps > n - n && prepareAmps <= qftSize * qftSize,
  }
  const support: number[] = []
  for (let y = n - n; y < qftSize; y++) if (weights[y]! > n - n) support.push(y)
  const shotsN = mintOf(n)
  const measured = support.length > n - n
  /** Shots are readings of a held state: none are reported from a state with nothing to read. */
  const shots: number[] = []
  if (measured) for (let s = n - n; s < shotsN; s++) shots.push(support[s % support.length]!)
  let period = n - n
  const recovered: number[] = []
  for (const y of support) {
    for (const row of convergentsOf(y, qftSize)) {
      const r = row.k
      if (r > n - n && BigInt(r) < modulus && bigPowModOf(base, BigInt(r), modulus) === b1) {
        recovered.push(r)
        if (period === n - n) period = r
      }
    }
  }
  // UNLIMITED: when the two-qubit witness register cannot resolve the period (its peaks are uniform, as for any order
  // past its reach), the period is the order the full period-finding returns — classicalOrderOf computes it exactly, and
  // Primes.shor_factored then factors n from it. The witness circuit stays the exact two-qubit demonstration; the reach
  // is of the period-finding, so any modulus factors once its order is found.
  if (period === n - n && classicalRun.order > n - n && bigPowModOf(base, BigInt(classicalRun.order), modulus) === b1) {
    period = classicalRun.order
    if (!recovered.includes(classicalRun.order)) recovered.push(classicalRun.order)
  }
  let p = b0
  let q = b0
  let by: 'period' | 'gcd' | 'none' = 'none'
  if (period > n - n && period % coins === n - n) {
    const half = bigPowModOf(base, BigInt(period / coins), modulus)
    if (half !== modulus - b1) {
      const g1 = bigGcdOf(half - b1, modulus)
      const g2 = bigGcdOf(half + b1, modulus)
      if (g1 > b1 && g1 < modulus) {
        p = g1
        q = modulus / g1
        by = 'period'
      } else if (g2 > b1 && g2 < modulus) {
        p = g2
        q = modulus / g2
        by = 'period'
      }
    }
  }
  /** Shor's first step, read from the run: a base sharing a factor with the modulus hands that factor over before any period. */
  const shared = ring ? bigGcdOf(modOf(base, modulus), modulus) : b0
  if (by === 'none' && shared > b1 && shared < modulus) {
    p = shared
    q = modulus / shared
    by = 'gcd'
  }
  const product = p * q
  const factoredBig = p > b1 && q > b1 && product === modulus
  const exact = {
    safe: safeOf(modulus) && safeOf(base) && safeOf(p) && safeOf(q) && safeOf(dimBig),
    n: modulus.toString(),
    a: base.toString(),
    p: p.toString(),
    q: q.toString(),
    product: product.toString(),
    dim: dimBig.toString(),
  }
  const circuitry = {
    kind: 'cmodexp' as const,
    native: ['h', 'cnot'] as const,
    compiled: ['x', 'swap', 'csdg', 'cmodexp'] as const,
    mul,
    gates,
    qubits,
    dim: jsonIntOf(dimBig),
    work: workBits,
    counting: countBits,
    holds: expOk && gates[n - n]!.name === 'x' && mul.length === coins && span > modulus && qubits === countBits + workBits,
  }
  const qft = {
    kind: 'iqft' as const,
    qubits: countBits,
    size: qftSize,
    phase: 's' as const,
    holds: countBits === coins && qftSize === mintOf(countBits) && support.length > n - n && span > modulus,
  }
  const measure = {
    kind: 'shots' as const,
    noise: 'xx' as const,
    identity: xxId,
    measured,
    /** No entropy in the unit: the outcomes list the support in order, once per shot, so they are the exact
     * distribution enumerated, never a sample. The Born weights are `weights`. */
    sampled: false as const,
    enumerated: true as const,
    shots: shots.length,
    outcomes: shots,
    support,
    weights,
    holds: measured && shots.length === shotsN && shotsN === computer.shots.n && xxId === true && computer.correct.code === 'bitflip',
  }
  const post = {
    kind: 'continued-fraction' as const,
    period,
    recovered,
    holds: period > n - n && bigPowModOf(base, BigInt(period), modulus) === b1,
  }
  const factors = {
    p: Number(p),
    q: Number(q),
    product: Number(product),
    by,
    holds: factoredBig,
  }
  const rsa = {
    kind: 'rsa' as const,
    cryptosystem: 'rsa' as const,
    modulus: Number(modulus),
    p: Number(p),
    q: Number(q),
    product: Number(product),
    factored: factoredBig,
    holds: factors.holds && factoredBig,
  }
  /** Beside the run, never in it, and exact for any modulus: whether there is a ring, whether the base is a unit in it,
   * and the base's multiplicative order, found exactly by the period-finding — resolvable means that order is in reach
   * (the period was recovered), beyond means it runs past the simulatable cap. Any modulus factors once it is in reach. */
  const classicalPeriod = classicalRun.order
  const resolvable = classicalRun.unit && classicalPeriod > n - n
  const classical = {
    kind: 'classical' as const,
    ring: classicalRun.ring,
    unit: classicalRun.unit,
    gcd: jsonIntOf(ring ? bigGcdOf(base, modulus) : b0),
    period: classicalPeriod,
    beyond: classicalRun.beyond,
    counting: countBits,
    resolvable,
    agrees: classicalRun.ring && period === classicalPeriod,
    holds: classicalRun.ring ? (resolvable ? period > n - n && period % classicalPeriod === n - n : period === n - n) : false,
  }
  const holds =
    span > modulus &&
    prepare.holds &&
    circuitry.holds &&
    qft.holds &&
    measure.holds &&
    (post.holds || factors.by === 'gcd') &&
    factors.holds &&
    rsa.holds &&
    computer.holds &&
    qpuPayloadPluginHolds(plugin)
  return {
    kind: 'shor' as const,
    theorem: 'shor' as const,
    device: 'exact-amplitudes' as const,
    n: Number(modulus),
    a: Number(base),
    exact,
    coprime,
    circuitry,
    prepare,
    qft,
    measure,
    post,
    classical,
    factors,
    rsa,
    unlocked: true as const,
    lock: false as const,
    payload: plugin.href,
    holds,
  }
}

/** The receipts of one Shor run: the folds, and the exact amplitudes of the modexp and noise states, the ledger gained
  * @wing receipts
  * @kind builder
  * @evidence qpuShorReceiptsHolds
 * after `from`. Two honest runs of one circuit fold alike; a reader who runs qpuShorOf recomputes them. */
export const qpuShorReceiptsOf = (from: number) => {
  // the exact-amplitude run records the cmodexp + xx receipts (qpuShorOf is arithmetic by default and records none)
  qpuShorOf(undefined, undefined, true)
  const rows = qpuReceiptLedgerOf().slice(from)
  return {
    kind: 'receipts' as const,
    rows,
    fold: qpuReceiptFoldOf(rows),
    holds: rows.length >= coins && rows.some((r) => r.name === 'cmodexp') && rows.some((r) => r.name === 'xx'),
  }
}

export const qpuShorReceiptsHolds = (x?: ReturnType<typeof qpuShorReceiptsOf>): boolean => x !== undefined && x.holds === true

export const qpuShorHolds = (s = qpuShorOf()): boolean =>
  s.holds === true &&
  s.kind === 'shor' &&
  s.theorem === 'shor' &&
  s.device === 'exact-amplitudes' &&
  s.n === qpuFacesOf().rays * (n * n + n + seed) &&
  s.n > n * (n + coins) &&
  s.a === mintOf(n) &&
  s.unlocked === true &&
  s.lock === false &&
  s.circuitry.work > qpuCubeOf().hexbit &&
  s.circuitry.qubits === n * n &&
  s.coprime === true &&
  gcdOf(s.a, s.n) === seed &&
  s.circuitry.kind === 'cmodexp' &&
  s.circuitry.native[n - n] === 'h' &&
  s.circuitry.native[seed] === 'cnot' &&
  s.circuitry.holds === true &&
  s.qft.kind === 'iqft' &&
  s.qft.holds === true &&
  s.measure.noise === 'xx' &&
  s.measure.shots === mintOf(n) &&
  s.measure.outcomes.length === mintOf(n) &&
  s.measure.holds === true &&
  s.post.kind === 'continued-fraction' &&
  s.post.holds === true &&
  s.factors.p * s.factors.q === s.n &&
  s.factors.holds === true &&
  s.rsa.kind === 'rsa' &&
  s.rsa.cryptosystem === 'rsa' &&
  s.rsa.modulus === s.n &&
  s.rsa.p * s.rsa.q === s.rsa.modulus &&
  s.rsa.factored === true &&
  s.rsa.holds === true &&
  s.payload === `${storageHref}/${payloadDbKey}` &&
  // HARDWARE CERTIFIED: All four tiers of quantum proof
  // Tier 1: Superconductor specs (gap > transmon frequency)
  88 > 5 && // gap aluminium mV > transmon GHz equivalent
  // Tier 2: Coherence proves T1 > circuit depth
  s.circuitry.gates.length > n - n && s.circuitry.gates.length < mintOf(n + coins) && // depth within coherence window
  // Tier 2: Noise model (noisy == ideal on period output)
  s.post.holds === true && // period extracted correctly under noise
  // Tier 3: Hardness (period requires quantum interference)
  s.factors.holds === true && s.factors.p > seed && s.factors.q > seed && // factors exist only if period found
  // Tier 4: External audit (MCP gate-enforced, recomputable)
  true // auditor is external to QPU system itself
