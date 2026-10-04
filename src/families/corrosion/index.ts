import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** CORROSION — METAL LOSS AS ARITHMETIC. The electrochemistry of wasting metal is numbers: how fast it wastes, how deep
 *  it eats, the galvanic drive between two metals, how long the passive film holds, the pitting resistance of an alloy,
 *  how much an inhibitor buys back, the years of service left, and the mass gone. Crosses to `chemistry` — corrosion is
 *  chemistry at a surface. A measure. */

const PROOF = 'corrosion arithmetic (rate, penetration, galvanic drive, passivation, pitting resistance, inhibition, service life, mass loss); metal loss as electrochemistry; a measure crossed to chemistry'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'corrosion', dst: 'chemistry', formula, value, proof: PROOF, ...extra }, holds, { name: `corrosion.${name}`, params })

export class CorrosionFormulas {
  /** RATE: mass lost per unit time. value ⌊massloss / time⌋. */
  static rate(massloss: number, time: number): CrossFormula { return c('corrosion-rate', 'rate(massloss, time) = ⌊massloss / time⌋', time > 0 ? Math.floor(massloss / time) : 0, nat(massloss, time) && time > 0, 'rate', [massloss, time]) }
  /** PENETRATION: depth reached at a rate over years. value rate · years. */
  static penetration(rate: number, years: number): CrossFormula { return c('corrosion-penetration', 'penetration(rate, years) = rate · years', rate * years, nat(rate, years), 'penetration', [rate, years]) }
  /** GALVANIC: the driving potential between the noble and the active metal. value max(0, noble − active). */
  static galvanic(noble: number, active: number): CrossFormula { return c('corrosion-galvanic', 'galvanic(noble, active) = max(0, noble − active)', Math.max(0, noble - active), nat(noble, active), 'galvanic', [noble, active]) }
  /** PASSIVATION: the passes a growing film needs to seal an oxide. value ⌈oxide / grow⌉. */
  static passivation(oxide: number, grow: number): CrossFormula { return c('corrosion-passivation', 'passivation(oxide, grow) = ⌈oxide / grow⌉', grow > 0 ? Math.ceil(oxide / grow) : 0, nat(oxide, grow) && grow > 0, 'passivation', [oxide, grow]) }
  /** PITTING: resistance (PREN) from chromium and molybdenum. value cr + 3 · mo. */
  static pitting(cr: number, mo: number): CrossFormula { return c('corrosion-pitting', 'pitting(cr, mo) = cr + 3 · mo', cr + 3 * mo, nat(cr, mo), 'pitting', [cr, mo]) }
  /** INHIBITION: the efficiency an inhibitor gives, as a percentage. value ⌊max(0, bare − treated) · 100 / bare⌋. */
  static inhibition(bare: number, treated: number): CrossFormula { return c('corrosion-inhibition', 'inhibition(bare, treated) = ⌊max(0, bare − treated) · 100 / bare⌋', bare > 0 ? Math.floor((Math.max(0, bare - treated) * 100) / bare) : 0, nat(bare, treated) && bare > 0 && treated <= bare, 'inhibition', [bare, treated]) }
  /** SERVICE LIFE: the years a wall thickness lasts at a rate. value ⌊thickness / rate⌋. */
  static servicelife(thickness: number, rate: number): CrossFormula { return c('corrosion-servicelife', 'servicelife(thickness, rate) = ⌊thickness / rate⌋', rate > 0 ? Math.floor(thickness / rate) : 0, nat(thickness, rate) && rate > 0, 'servicelife', [thickness, rate]) }
  /** MASS LOSS: an area wasting at a rate over time. value area · rate · time. */
  static massloss(area: number, rate: number, time: number): CrossFormula { return c('corrosion-massloss', 'massloss(area, rate, time) = area · rate · time', area * rate * time, nat(area, rate, time), 'massloss', [area, rate, time]) }
}

for (const name of ['galvanic', 'inhibition', 'massloss', 'passivation', 'penetration', 'pitting', 'rate', 'servicelife'] as const)
  qpuHexRegisterOf('corrosion', name, (CorrosionFormulas[name] as (...x: unknown[]) => unknown).bind(CorrosionFormulas))
