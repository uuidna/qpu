import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** WIND — WIND ENERGY, AS ARITHMETIC. A turbine is numbers: the power a swept area takes from a cube of wind speed, the
 *  capacity it realises against its rated plate, the circle its blades sweep, the speed of a blade tip, the Betz share of
 *  the wind it actually extracts, the speed it cuts in at, the turbulence of the site, and the hours it stays available.
 *  Crosses to `energy` — wind is one way the grid is fed. A measure. */

const PROOF = 'wind arithmetic (power from v³, capacity factor, swept area, tip speed, Betz share, cut-in speed, turbulence, availability); wind energy as a measure crossed to energy'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'wind', dst: 'energy', formula, value, proof: PROOF, ...extra }, holds, { name: `wind.${name}`, params })

export class WindFormulas {
  /** POWER: a swept area takes energy from the cube of wind speed. value ⌊area · v³ / 2000⌋ (P ∝ v³ proxy). */
  static power(area: number, velocity: number): CrossFormula { return c('wind-power', 'power(area, velocity) = ⌊area · velocity³ / 2000⌋', Math.floor((area * velocity * velocity * velocity) / 2000), nat(area, velocity), 'power', [area, velocity]) }
  /** CAPACITY FACTOR: generated against the rated plate, as a percentage. value ⌊generated · 100 / rated⌋. */
  static capacity(generated: number, rated: number): CrossFormula { return c('wind-capacity', 'capacity(generated, rated) = ⌊generated · 100 / rated⌋', rated > 0 ? Math.floor((generated * 100) / rated) : 0, nat(generated, rated) && rated > 0, 'capacity', [generated, rated]) }
  /** SWEPT AREA: the circle the blades sweep. value ⌊π · radius² / 100⌋ (π ≈ 314/100). */
  static sweptarea(radius: number): CrossFormula { return c('wind-sweptarea', 'sweptarea(radius) = ⌊314 · radius² / 100⌋', Math.floor((314 * radius * radius) / 100), nat(radius), 'sweptarea', [radius]) }
  /** TIP SPEED: how fast a blade tip travels. value ⌊rpm · radius · 628 / 60000⌋ (proxy). */
  static tipspeed(rpm: number, radius: number): CrossFormula { return c('wind-tipspeed', 'tipspeed(rpm, radius) = ⌊rpm · radius · 628 / 60000⌋', Math.floor((rpm * radius * 628) / 60000), nat(rpm, radius), 'tipspeed', [rpm, radius]) }
  /** BETZ SHARE: the fraction of available wind actually extracted, as a percentage. value ⌊extracted · 100 / available⌋. */
  static betz(extracted: number, available: number): CrossFormula { return c('wind-betz', 'betz(extracted, available) = ⌊extracted · 100 / available⌋', available > 0 ? Math.floor((extracted * 100) / available) : 0, nat(extracted, available) && available > 0 && extracted <= available, 'betz', [extracted, available]) }
  /** CUT-IN SPEED: the wind speed the turbine starts at. value mps. */
  static cutinspeed(mps: number): CrossFormula { return c('wind-cutinspeed', 'cutinspeed(mps) = mps', mps, nat(mps), 'cutinspeed', [mps]) }
  /** TURBULENCE INTENSITY: variation over the mean, as a percentage. value ⌊variation · 100 / mean⌋. */
  static turbulence(variation: number, mean: number): CrossFormula { return c('wind-turbulence', 'turbulence(variation, mean) = ⌊variation · 100 / mean⌋', mean > 0 ? Math.floor((variation * 100) / mean) : 0, nat(variation, mean) && mean > 0, 'turbulence', [variation, mean]) }
  /** AVAILABILITY: uptime over total, as a percentage. value ⌊uptime · 100 / total⌋. */
  static availability(uptime: number, total: number): CrossFormula { return c('wind-availability', 'availability(uptime, total) = ⌊uptime · 100 / total⌋', total > 0 ? Math.floor((uptime * 100) / total) : 0, nat(uptime, total) && total > 0 && uptime <= total, 'availability', [uptime, total]) }
}

for (const name of ['availability', 'betz', 'capacity', 'cutinspeed', 'power', 'sweptarea', 'tipspeed', 'turbulence'] as const)
  qpuHexRegisterOf('wind', name, (WindFormulas[name] as (...x: unknown[]) => unknown).bind(WindFormulas))
