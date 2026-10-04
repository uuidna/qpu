import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** VO2MAX — scaffolded integer measures crossed to physiology. Every output an exact finite nonnegative integer. */

const PROOF = 'vo2max arithmetic (estimate, absolute, metequivalent, heartratemax, fitnessscore, oxygenpulse, aerobiccapacity, improvement); scaffolded from the integer-op palette; a measure crossed to physiology'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'vo2max', dst: 'physiology', formula, value, proof: PROOF, ...extra }, holds, { name: `vo2max.${name}`, params })

export class Vo2maxFormulas {
  static estimate(x: number, y: number): CrossFormula { return c('vo2max-estimate', 'estimate(x, y) = ⌊x / y⌋', y > 0 ? Math.floor(x / y) : 0, nat(x, y) && y > 0, 'estimate', [x, y]) }
  static absolute(x: number, y: number): CrossFormula { return c('vo2max-absolute', 'absolute(x, y) = x · y', x * y, nat(x, y), 'absolute', [x, y]) }
  static metequivalent(x: number, y: number): CrossFormula { return c('vo2max-metequivalent', 'metequivalent(x, y) = ⌊x / y⌋', y > 0 ? Math.floor(x / y) : 0, nat(x, y) && y > 0, 'metequivalent', [x, y]) }
  static heartratemax(x: number, y: number): CrossFormula { return c('vo2max-heartratemax', 'heartratemax(x, y) = max(0, x − y)', Math.max(0, x - y), nat(x, y), 'heartratemax', [x, y]) }
  static fitnessscore(x: number, y: number): CrossFormula { return c('vo2max-fitnessscore', 'fitnessscore(x, y) = ⌊x · 100 / y⌋', y > 0 ? Math.floor((x * 100) / y) : 0, nat(x, y) && y > 0, 'fitnessscore', [x, y]) }
  static oxygenpulse(x: number, y: number): CrossFormula { return c('vo2max-oxygenpulse', 'oxygenpulse(x, y) = ⌊x / y⌋', y > 0 ? Math.floor(x / y) : 0, nat(x, y) && y > 0, 'oxygenpulse', [x, y]) }
  static aerobiccapacity(x: number, y: number): CrossFormula { return c('vo2max-aerobiccapacity', 'aerobiccapacity(x, y) = x · y', x * y, nat(x, y), 'aerobiccapacity', [x, y]) }
  static improvement(x: number, y: number): CrossFormula { return c('vo2max-improvement', 'improvement(x, y) = max(0, x − y)', Math.max(0, x - y), nat(x, y), 'improvement', [x, y]) }
}

for (const name of ['absolute', 'aerobiccapacity', 'estimate', 'fitnessscore', 'heartratemax', 'improvement', 'metequivalent', 'oxygenpulse'] as const)
  qpuHexRegisterOf('vo2max', name, (Vo2maxFormulas[name] as (...x: unknown[]) => unknown).bind(Vo2maxFormulas))
