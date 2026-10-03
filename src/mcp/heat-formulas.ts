import { leanSource } from '../quantum/processing/unit/lean.js'
import { qpuHexRegisterOf } from '../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from './cross-domain-formulas.js'

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
const thermal = (millikelvin: number) => BOLTZMANN * millikelvin * 10
const PROOF = 'src/quantum/processing/unit/index.lean §Qpu.Physics (theorem temperature, cooling_stays_positive)'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)

export class HeatFormulas {
  /** Temperature: commits over days as millikelvin, ⌊1000 · commits / days⌋. */
  static temperature(commits: number, days: number): CrossFormula {
    const mK = Math.floor((1000 * commits) / Math.max(days, 1))
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
}

for (const name of ['coherence', 'cooling', 'quality', 'signal', 'temperature', 'ways'] as const)
  qpuHexRegisterOf('heat', name, (HeatFormulas[name] as (...x: unknown[]) => unknown).bind(HeatFormulas))

/** One file as git measures it. */
export type HeatReading = { file: string; commits: number; days: number; fixes: number; lines: number; age: number; since: number }

/** Every file's heat from its readings, hottest first: temperature, signal, coherence, quality, and the split that would
 *  bring it to the signal's threshold (the coldest temperature at which the signal is still 1). */
export const heatOf = (readings: HeatReading[]) => {
  // the threshold is where photon / thermal T reaches 1: T* = ⌊photon / (k_B · 10)⌋ mK
  const threshold = Math.floor(photon / (BOLTZMANN * 10))
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
