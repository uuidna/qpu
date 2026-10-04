import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** METABOLISM — THE CHEMISTRY OF LIFE, AS ARITHMETIC. Living compute is numbers: the resting energy a body burns, the ATP a
 *  fuel yields, the respiratory quotient, the calories an effort costs, the acetyl-CoA an acid is oxidised into, the adenylate
 *  energy charge, enzyme turnover, and the flux of a substrate. Crosses to `biochemistry` — metabolism is biochemistry in
 *  motion. A measure. */

const PROOF = 'metabolism arithmetic (basal rate, ATP yield, respiratory quotient, caloric burn, oxidation, energy charge, turnover, substrate flux); the chemistry of life as integers; a measure crossed to biochemistry'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'metabolism', dst: 'biochemistry', formula, value, proof: PROOF, ...extra }, holds, { name: `metabolism.${name}`, params })

export class MetabolismFormulas {
  /** BASAL METABOLIC RATE: resting kcal/day from mass, height and age. value max(0, 10·weight + 6·height − 5·age). */
  static bmr(weight: number, height: number, age: number): CrossFormula { return c('metabolism-bmr', 'bmr(weight, height, age) = max(0, 10·weight + 6·height − 5·age)', Math.max(0, 10 * weight + 6 * height - 5 * age), nat(weight, height, age), 'bmr', [weight, height, age]) }
  /** ATP YIELD: molecules of ATP from aerobic respiration of glucose (38 each). value glucose · 38. */
  static atpyield(glucose: number): CrossFormula { return c('metabolism-atpyield', 'atpyield(glucose) = glucose · 38', glucose * 38, nat(glucose), 'atpyield', [glucose]) }
  /** RESPIRATORY QUOTIENT: CO₂ produced over O₂ consumed, as a percentage. value ⌊co2 · 100 / o2⌋. */
  static respiratoryquotient(co2: number, o2: number): CrossFormula { return c('metabolism-respiratoryquotient', 'respiratoryquotient(co2, o2) = ⌊co2 · 100 / o2⌋', o2 > 0 ? Math.floor((co2 * 100) / o2) : 0, nat(co2, o2) && o2 > 0, 'respiratoryquotient', [co2, o2]) }
  /** CALORIC BURN: kcal of an effort at an intensity, over minutes. value ⌊met · weight · minutes / 60⌋. */
  static caloricburn(met: number, weight: number, minutes: number): CrossFormula { return c('metabolism-caloricburn', 'caloricburn(met, weight, minutes) = ⌊met · weight · minutes / 60⌋', Math.floor((met * weight * minutes) / 60), nat(met, weight, minutes), 'caloricburn', [met, weight, minutes]) }
  /** OXIDATION: acetyl-CoA units a fatty acid is β-oxidised into. value ⌊carbons / 2⌋. */
  static oxidation(carbons: number): CrossFormula { return c('metabolism-oxidation', 'oxidation(carbons) = ⌊carbons / 2⌋', Math.floor(carbons / 2), nat(carbons), 'oxidation', [carbons]) }
  /** ENERGY CHARGE: adenylate energy charge, scaled to a percentage. value ⌊(2·atp + adp) · 50 / (atp + adp + amp)⌋. */
  static energycharge(atp: number, adp: number, amp: number): CrossFormula { return c('metabolism-energycharge', 'energycharge(atp, adp, amp) = ⌊(2·atp + adp) · 50 / (atp + adp + amp)⌋', (atp + adp + amp) > 0 ? Math.floor(((2 * atp + adp) * 50) / (atp + adp + amp)) : 0, nat(atp, adp, amp) && (atp + adp + amp) > 0, 'energycharge', [atp, adp, amp]) }
  /** TURNOVER: product molecules an enzyme makes per unit time. value ⌊product / time⌋. */
  static turnover(product: number, time: number): CrossFormula { return c('metabolism-turnover', 'turnover(product, time) = ⌊product / time⌋', time > 0 ? Math.floor(product / time) : 0, nat(product, time) && time > 0, 'turnover', [product, time]) }
  /** SUBSTRATE FLUX: molecules through a pathway at a rate. value substrate · rate. */
  static substrateflux(substrate: number, rate: number): CrossFormula { return c('metabolism-substrateflux', 'substrateflux(substrate, rate) = substrate · rate', substrate * rate, nat(substrate, rate), 'substrateflux', [substrate, rate]) }
}

for (const name of ['atpyield', 'bmr', 'caloricburn', 'energycharge', 'oxidation', 'respiratoryquotient', 'substrateflux', 'turnover'] as const)
  qpuHexRegisterOf('metabolism', name, (MetabolismFormulas[name] as (...x: unknown[]) => unknown).bind(MetabolismFormulas))
