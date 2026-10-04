import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** ENZYME — CATALYSIS AS ARITHMETIC. An enzyme is numbers: the reaction velocity at a substrate level, the Michaelis
 *  constant, the turnover number, catalytic efficiency, how inhibition raises the apparent constant, specific activity,
 *  fractional substrate saturation, and the maximum velocity. Crosses to `biochemistry` — enzymes are what biochemistry
 *  measures. A measure. */

const PROOF = 'enzyme arithmetic (Michaelis constant, velocity, turnover, catalytic efficiency, inhibition, specific activity, substrate saturation, vmax); Michaelis-Menten kinetics as integers; a measure crossed to biochemistry'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'enzyme', dst: 'biochemistry', formula, value, proof: PROOF, ...extra }, holds, { name: `enzyme.${name}`, params })

export class EnzymeFormulas {
  /** MICHAELIS CONSTANT from a measured velocity. value ⌊s · (vmax − v) / v⌋. */
  static michaelis(vmax: number, s: number, v: number): CrossFormula { return c('enzyme-michaelis', 'michaelis(vmax, s, v) = ⌊s · (vmax − v) / v⌋', v > 0 ? Math.floor((s * Math.max(0, vmax - v)) / v) : 0, nat(vmax, s, v) && v > 0, 'michaelis', [vmax, s, v]) }
  /** REACTION VELOCITY at a substrate level (Michaelis-Menten). value ⌊vmax · s / (km + s)⌋. */
  static velocity(vmax: number, s: number, km: number): CrossFormula { return c('enzyme-velocity', 'velocity(vmax, s, km) = ⌊vmax · s / (km + s)⌋', (km + s) > 0 ? Math.floor((vmax * s) / (km + s)) : 0, nat(vmax, s, km) && (km + s) > 0, 'velocity', [vmax, s, km]) }
  /** TURNOVER number kcat: velocity per unit of enzyme. value ⌊vmax / enzyme⌋. */
  static turnover(vmax: number, enzyme: number): CrossFormula { return c('enzyme-turnover', 'turnover(vmax, enzyme) = ⌊vmax / enzyme⌋', enzyme > 0 ? Math.floor(vmax / enzyme) : 0, nat(vmax, enzyme) && enzyme > 0, 'turnover', [vmax, enzyme]) }
  /** CATALYTIC EFFICIENCY: turnover over the Michaelis constant. value ⌊kcat / km⌋. */
  static catalyticefficiency(kcat: number, km: number): CrossFormula { return c('enzyme-catalyticefficiency', 'catalyticefficiency(kcat, km) = ⌊kcat / km⌋', km > 0 ? Math.floor(kcat / km) : 0, nat(kcat, km) && km > 0, 'catalyticefficiency', [kcat, km]) }
  /** INHIBITION: competitive inhibition raises the apparent constant. value ⌊km · (ki + i) / ki⌋. */
  static inhibition(km: number, i: number, ki: number): CrossFormula { return c('enzyme-inhibition', 'inhibition(km, i, ki) = ⌊km · (ki + i) / ki⌋', ki > 0 ? Math.floor((km * (ki + i)) / ki) : 0, nat(km, i, ki) && ki > 0, 'inhibition', [km, i, ki]) }
  /** SPECIFIC ACTIVITY: enzyme activity per unit of protein. value ⌊activity / protein⌋. */
  static specificactivity(activity: number, protein: number): CrossFormula { return c('enzyme-specificactivity', 'specificactivity(activity, protein) = ⌊activity / protein⌋', protein > 0 ? Math.floor(activity / protein) : 0, nat(activity, protein) && protein > 0, 'specificactivity', [activity, protein]) }
  /** SUBSTRATE SATURATION as a percentage. value ⌊s · 100 / (km + s)⌋. */
  static substratesaturation(s: number, km: number): CrossFormula { return c('enzyme-substratesaturation', 'substratesaturation(s, km) = ⌊s · 100 / (km + s)⌋', (km + s) > 0 ? Math.floor((s * 100) / (km + s)) : 0, nat(s, km) && (km + s) > 0, 'substratesaturation', [s, km]) }
  /** MAXIMUM VELOCITY recovered from a measured velocity. value ⌊v · (km + s) / s⌋. */
  static vmax(v: number, km: number, s: number): CrossFormula { return c('enzyme-vmax', 'vmax(v, km, s) = ⌊v · (km + s) / s⌋', s > 0 ? Math.floor((v * (km + s)) / s) : 0, nat(v, km, s) && s > 0, 'vmax', [v, km, s]) }
}

for (const name of ['catalyticefficiency', 'inhibition', 'michaelis', 'specificactivity', 'substratesaturation', 'turnover', 'velocity', 'vmax'] as const)
  qpuHexRegisterOf('enzyme', name, (EnzymeFormulas[name] as (...x: unknown[]) => unknown).bind(EnzymeFormulas))
