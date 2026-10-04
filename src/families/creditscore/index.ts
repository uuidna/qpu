import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** CREDITSCORE — scaffolded integer measures crossed to banking. Every output an exact finite nonnegative integer. */

const PROOF = 'creditscore arithmetic (score, paymenthistory, utilization, riskbands, defaultprob, factorcombos, inquiries, tier); scaffolded from the integer-op palette; a measure crossed to banking'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'creditscore', dst: 'banking', formula, value, proof: PROOF, ...extra }, holds, { name: `creditscore.${name}`, params })

export class CreditscoreFormulas {
  static score(x: number, y: number): CrossFormula { return c('creditscore-score', 'score(x, y) = x + y', x + y, nat(x, y), 'score', [x, y]) }
  static paymenthistory(x: number, y: number): CrossFormula { return c('creditscore-paymenthistory', 'paymenthistory(x, y) = ⌊x · 100 / y⌋', y > 0 ? Math.floor((x * 100) / y) : 0, nat(x, y) && y > 0, 'paymenthistory', [x, y]) }
  static utilization(x: number, y: number): CrossFormula { return c('creditscore-utilization', 'utilization(x, y) = ⌊x · 100 / y⌋', y > 0 ? Math.floor((x * 100) / y) : 0, nat(x, y) && y > 0, 'utilization', [x, y]) }
  static riskbands(x: number, y: number): CrossFormula { return c('creditscore-riskbands', 'riskbands(x, y) = x + y', x + y, nat(x, y), 'riskbands', [x, y]) }
  static defaultprob(x: number, y: number): CrossFormula { return c('creditscore-defaultprob', 'defaultprob(x, y) = ⌊x · 100 / y⌋', y > 0 ? Math.floor((x * 100) / y) : 0, nat(x, y) && y > 0, 'defaultprob', [x, y]) }
  static factorcombos(x: number, y: number): CrossFormula { return c('creditscore-factorcombos', 'factorcombos(x, y) = C(x, y)', x >= y ? ((n: number, k: number) => { let kk = Math.min(k, n - k); let r = 1; for (let i = 0; i < kk; i++) r = (r * (n - i)) / (i + 1); return Math.round(r) })(x, y) : 0, nat(x, y) && x >= y, 'factorcombos', [x, y]) }
  static inquiries(x: number, y: number): CrossFormula { return c('creditscore-inquiries', 'inquiries(x, y) = max(0, x − y)', Math.max(0, x - y), nat(x, y), 'inquiries', [x, y]) }
  static tier(x: number, y: number): CrossFormula { return c('creditscore-tier', 'tier(x, y) = ⌊x / y⌋', y > 0 ? Math.floor(x / y) : 0, nat(x, y) && y > 0, 'tier', [x, y]) }
}

for (const name of ['defaultprob', 'factorcombos', 'inquiries', 'paymenthistory', 'riskbands', 'score', 'tier', 'utilization'] as const)
  qpuHexRegisterOf('creditscore', name, (CreditscoreFormulas[name] as (...x: unknown[]) => unknown).bind(CreditscoreFormulas))
