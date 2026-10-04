import { leanSource } from '../../quantum/processing/unit/lean.js'
import { qpuFacesOf, qpuHexFamiliesOf, qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { leanCallOf, leanModelOf } from '../../quantum/processing/unit/lean-eval.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'
import { flowFamiliesOf } from '../merkaba/index.js'
import { chooseOf, mintOf, qpuLatticeNamesOf, tenOf } from '../../quantum/processing/unit/index.js'
const L = { ...qpuLatticeNamesOf(), mintOf, chooseOf, tenOf }

/** Code quality by temperature and time, as Qpu.Physics measures a qubit. A file is hot when it keeps changing: its
 *  temperature in millikelvin is commits per thousand days (one commit a day is 1000 mK). Its signal is the unit's
 *  `photon / thermal T` (theorem temperature: 23 at 10 mK, 2 at 100 mK, 0 at 4000 mK, where noise drowns the signal). Its
 *  coherence time is how many days it holds between fixes. Cooling is splitting: a file split k ways carries T / k each
 *  (theorem cooling_stays_positive). The constants are the Lean source's own. Registered as the hex family `heat`. */
const leanNat = (name: string): number => Number(new RegExp(`def ${name} : Nat := (\\d+)`).exec(leanSource)?.[1] ?? NaN)
const PLANCK = leanNat('planck')
const BOLTZMANN = leanNat('boltzmann')
const TRANSMON = leanNat('transmon')
const photon = PLANCK * TRANSMON
const thermal = (millikelvin: number) => BOLTZMANN * millikelvin * L.tenOf(L.seed)
const PROOF = 'src/quantum/processing/unit/index.lean §Qpu.Physics (theorem temperature, cooling_stays_positive)'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const LEAN = leanModelOf('')

export class HeatFormulas {
  /** Temperature: commits over days as millikelvin, ⌊1000 · commits / days⌋. */
  static temperature(commits: number, days: number): CrossFormula {
    const mK = Math.floor((L.tenOf(L.n) * commits) / Math.max(days, L.seed))
    return crossFormulaOf({ id: 'heat-temperature', src: 'heat', dst: 'physics', formula: 'T = ⌊1000 · commits / days⌋ mK', value: mK, proof: PROOF }, nat(commits, days), { name: 'heat.temperature', params: [commits, days] })
  }

  /** Signal: ⌊photon / thermal T⌋, the unit's own ratio; 0 means the noise drowns what the file delivers. */
  static signal(millikelvin: number): CrossFormula {
    const value = millikelvin === 0 ? photon : Math.floor(photon / thermal(millikelvin))
    return crossFormulaOf({ id: 'heat-signal', src: 'heat', dst: 'physics', formula: 'S = ⌊h·f / k_B·T⌋ (photon / thermal T)', value, proof: PROOF }, nat(millikelvin), { name: 'heat.signal', params: [millikelvin] })
  }

  /** Coherence: days held per fix, ⌊days / (fixes + 1)⌋; every fix is a decoherence event. */
  static coherence(days: number, fixes: number): CrossFormula {
    return crossFormulaOf({ id: 'heat-coherence', src: 'heat', dst: 'physics', formula: 'T₂ = ⌊days / (fixes + 1)⌋', value: Math.floor(days / (fixes + 1)), proof: PROOF }, nat(days, fixes), { name: 'heat.coherence', params: [days, fixes] })
  }

  /** Quality: the signal at the file's temperature held over its coherence time, S(T) · T₂. Zero when hot. */
  static quality(commits: number, days: number, fixes: number): CrossFormula {
    const s = HeatFormulas.signal(HeatFormulas.temperature(commits, days).value).value
    const t2 = HeatFormulas.coherence(days, fixes).value
    return crossFormulaOf({ id: 'heat-quality', src: 'heat', dst: 'physics', formula: 'Q = S(T) · T₂', value: s * t2, proof: PROOF }, nat(commits, days, fixes), { name: 'heat.quality', params: [commits, days, fixes] })
  }

  /** Cooling: a file split k ways carries ⌈T / k⌉ each, and stays positive while T does. */
  static cooling(millikelvin: number, ways: number): CrossFormula {
    return crossFormulaOf({ id: 'heat-cooling', src: 'heat', dst: 'physics', formula: 'T′ = ⌈T / k⌉', value: Math.ceil(millikelvin / Math.max(ways, 1)), proof: PROOF }, nat(millikelvin, ways) && ways > 0, { name: 'heat.cooling', params: [millikelvin, ways] })
  }

  /** The split that cools a file to a target: the least k with ⌈T / k⌉ ≤ target. */
  static ways(millikelvin: number, target: number): CrossFormula {
    return crossFormulaOf({ id: 'heat-ways', src: 'heat', dst: 'physics', formula: 'k = ⌈T / target⌉', value: Math.max(1, Math.ceil(millikelvin / Math.max(target, 1))), proof: PROOF }, nat(millikelvin, target) && target > 0, { name: 'heat.ways', params: [millikelvin, target] })
  }

  /** Erasure: the j-th formula of the f-th flow family (merkaba.develop's address) run on its first n inputs must erase
   *  Σ c·log₂ c bits over its outputs' multiplicities — Landauer's least for that batch. Zero exactly when the formula
   *  is reversible on it: a reversible computation erases nothing, an irreversible one cannot hide that it does. */
  static erasure(f: number, j: number, n: number): CrossFormula {
    const family = flowFamiliesOf()[f], formula = family ? qpuHexFamiliesOf().get(family)?.[j] : undefined
    const counts = new Map<string, number>()
    let runs = 0
    for (let i = 0; formula && i < n; i++) {
      try {
        const r = formula.run(Array.from({ length: formula.arity }, () => BigInt(i))) as unknown
        const out = String(typeof r === 'object' && r !== null && 'value' in r ? (r as { value: unknown }).value : r)
        counts.set(out, (counts.get(out) ?? 0) + 1)
        runs++
      } catch { /* an input the formula does not take */ }
    }
    const bits = [...counts.values()].reduce((s, c) => s + c * Math.log2(c), 0)
    return crossFormulaOf({ id: 'heat-erasure', src: 'heat', dst: 'physics', formula: `erasure(${family}.${formula?.name}, n) = Σ c·log₂ c over its outputs on the first n inputs`, value: bits, proof: 'Landauer: a map that merges c inputs into one output erases log₂ c bits each' }, nat(f, j, n) && runs === n, { name: 'heat.erasure', params: [f, j, n] })
  }

  /** Landauer: erasing `bits` at a core temperature T costs at least bits · k_B · T · ln 2 — in 10⁻³² J at T in mK, with
   *  the Lean source's boltzmann (k_B in 10⁻²⁹ J/K). The unit reads no sensor: T is the device reading the caller saved. */
  static landauer(bits: number, millikelvin: number): CrossFormula {
    return crossFormulaOf({ id: 'heat-landauer', src: 'heat', dst: 'physics', formula: 'E ≥ bits · k_B · T · ln 2 (10⁻³² J, T in mK)', value: Math.floor(bits * BOLTZMANN * millikelvin * Math.LN2), proof: 'Landauer 1961; k_B from index.lean def boltzmann' }, nat(bits, millikelvin), { name: 'heat.landauer', params: [bits, millikelvin] })
  }

  /** SLOW IS A WRAP: an address that answers slowly wraps a computation instead of reaching a value. One job per formula:
   *  the j-th formula of the f-th flow family is timed on its first faces inputs and in every rotation of the rosetta
   *  (merkaba.develop feeds it its neighbours' values, the route that once fed it planck), each run twice and the faster
   *  counted, so a warm-up is not a slow address. Value its slowest run in ms; the statement: its slowest
   *  run is at most faces ms, on a clock that advances during work — false when hot or when the clock stood still (a Worker).
   *  `next` is the following formula's [f, j], so `--all` walks every formula of the ring. */
  static async slow(f: number, j: number): Promise<CrossFormula> {
    const ring = flowFamiliesOf(), faces = qpuFacesOf().faces, family = ring[f], formula = family ? qpuHexFamiliesOf().get(family)?.[j] : undefined
    const after = family && j + 1 < (qpuHexFamiliesOf().get(family) ?? []).length ? [f, j + 1] : f + 1 < ring.length ? [f + 1, 0] : undefined
    if (!formula) return crossFormulaOf({ id: 'heat-slow', src: 'heat', dst: 'physics', formula: 'slow(f, j): a formula is registered at (f, j)', value: 0, proof: 'the registry', ...(after ? { next: after } : {}) }, false, { name: 'heat.slow', params: [f, j] })
    const { MerkabaFormulas } = await import('../merkaba/index.js')
    let worst = { ms: 0, input: '' }, timed = 0
    const once = async (run: () => unknown) => { const t = performance.now(); try { await run() } catch { /* an input it does not take */ } return performance.now() - t }
    const time = async (input: string, run: () => unknown) => { const ms = Math.min(await once(run), await once(run)); timed++; if (ms > worst.ms) worst = { ms, input } }
    const start = performance.now()
    for (let i = 0; i < faces; i++) await time(`(${Array(formula.arity).fill(i).join(',')})`, () => formula.run(Array.from({ length: formula.arity }, () => BigInt(i))))
    for (let s = 0; s < 2 * ring.length; s++) await time(`rotation ${s}`, () => MerkabaFormulas.develop(f, j, s))
    const frozen = performance.now() - start === 0
    const ms = Math.round(worst.ms)
    return crossFormulaOf({ id: 'heat-slow', src: 'heat', dst: 'physics', formula: `slow(${family}.${formula.name}) = its slowest steady-state run in ms ≤ faces ms, timed by a clock that advances`, value: ms, proof: 'device readings: performance.now() around each run', ...{ timed, input: worst.input, hot: ms > faces, clockAdvanced: !frozen, ...(after ? { next: after } : {}) } }, nat(f, j) && !frozen && ms <= faces, { name: 'heat.slow', params: [f, j] })
  }

  /** One job of a split: 2ᵏ mod p by squaring — independent of every other prime, so any node or agent computes it at
   *  its own address and receipts it; two nodes answering the same job differently is a violation, exactly. */
  static residue(k: number, p: number): CrossFormula {
    const value = nat(k, p) && p > 1 ? Number(leanCallOf(LEAN, 'powMod', [2n, BigInt(k), BigInt(p)])) : 0
    return crossFormulaOf({ id: 'heat-residue', src: 'heat', dst: 'crypto', formula: 'r = 2ᵏ mod p', value, proof: 'powMod by squaring (lean-eval), agreeing with index.lean def powMod' }, nat(k, p) && p > 1, { name: 'heat.residue', params: [k, p] })
  }

  /** The split of an astronomical value into coordinated decentralised jobs: 2ᵏ never materialised, only its residues
   *  modulo the first `primes` primes, one heat.residue job each, joined by the Chinese remainder theorem. The residues
   *  refute any claimed value exactly (one prime that disagrees) and recover it only when Πp exceeds 2ᵏ (`exact`).
   *  Value how many jobs; `jobs` the first faces of them (a job whose params pass the hex section is called by name). */
  static split(k: number, primes: number): CrossFormula {
    const ps: number[] = []
    for (let x = 2; ps.length < primes; x++) if (ps.every((p) => x % p !== 0)) ps.push(x)
    const jobs = ps.slice(0, qpuFacesOf().faces).map((p) => ({ p, residue: HeatFormulas.residue(k, p).value, call: { name: 'heat.residue', params: [k, p] } }))
    const extra = { bits: k + 1, exact: ps.reduce((s, p) => s + Math.log2(p), 0) > k, jobs }
    return crossFormulaOf({ id: 'heat-split', src: 'heat', dst: 'crypto', formula: '2ᵏ ↦ (2ᵏ mod p)ₚ, one job per prime, joined by the Chinese remainder theorem', value: ps.length, proof: 'CRT: residues modulo coprime p determine a value below Πp', ...extra }, nat(k, primes) && primes > 0, { name: 'heat.split', params: [k, primes] })
  }
}

for (const name of ['coherence', 'cooling', 'erasure', 'landauer', 'quality', 'residue', 'signal', 'slow', 'split', 'temperature', 'ways'] as const)
  qpuHexRegisterOf('heat', name, (HeatFormulas[name] as (...x: unknown[]) => unknown).bind(HeatFormulas))

/** One file as git measures it. */
export type HeatReading = { file: string; commits: number; days: number; fixes: number; lines: number; age: number; since: number }

/** Every file's heat from its readings, hottest first: temperature, signal, coherence, quality, and the split that would
 *  bring it to the signal's threshold (the coldest temperature at which the signal is still 1). */
export const heatOf = (readings: HeatReading[]) => {
  // the threshold is where photon / thermal T reaches 1: T* = ⌊photon / (k_B · 10)⌋ mK
  const threshold = Math.floor(photon / (BOLTZMANN * L.tenOf(L.seed)))
  const rows = readings
    .map((r) => {
      const t = HeatFormulas.temperature(r.commits, r.days)
      const s = HeatFormulas.signal(t.value)
      const c = HeatFormulas.coherence(r.days, r.fixes)
      const q = HeatFormulas.quality(r.commits, r.days, r.fixes)
      const k = HeatFormulas.ways(t.value, threshold)
      return { ...r, temperature: t.value, signal: s.value, coherence: c.value, quality: q.value, ways: k.value, hot: s.value === 0, hex: q.hex, receipt: q.receipt }
    })
    .sort((a, b) => b.temperature - a.temperature || b.lines - a.lines)
  return { kind: 'heat' as const, threshold, files: rows.length, hot: rows.filter((r) => r.hot).length, rows, holds: rows.every((r) => Number.isFinite(r.quality)) }
}
