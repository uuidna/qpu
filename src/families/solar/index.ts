import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** SOLAR — PHOTOVOLTAIC GENERATION, AS ARITHMETIC (chosen by the public-API registry, not by hand). Harvesting the sun is
 *  numbers: panel efficiency, power from irradiance over area, capacity factor, daily insolation, payback years, optimal
 *  tilt, annual degradation, and specific yield. Crosses to `energy` — solar is energy made from light. A measure. */

const PROOF = 'solar arithmetic (efficiency, power, capacity factor, insolation, payback, tilt, degradation, specific yield); a photovoltaic measure crossed to energy'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'solar', dst: 'energy', formula, value, proof: PROOF, ...extra }, holds, { name: `solar.${name}`, params })

export class SolarFormulas {
  /** CAPACITY FACTOR: generated against rated, as a percentage. value ⌊generated · 100 / rated⌋. */
  static capacity(generated: number, rated: number): CrossFormula { return c('solar-capacity', 'capacity(generated, rated) = ⌊generated · 100 / rated⌋', rated > 0 ? Math.floor((generated * 100) / rated) : 0, nat(generated, rated) && rated > 0, 'capacity', [generated, rated]) }
  /** DEGRADATION: how far output has fallen from new, as a percentage. value ⌊(initial − current) · 100 / initial⌋. */
  static degradation(initial: number, current: number): CrossFormula { return c('solar-degradation', 'degradation(initial, current) = ⌊(initial − current) · 100 / initial⌋', initial > 0 ? Math.floor(((initial - current) * 100) / initial) : 0, nat(initial, current) && initial > 0 && current <= initial, 'degradation', [initial, current]) }
  /** EFFICIENCY: output against input, as a percentage. value ⌊output · 100 / input⌋. */
  static efficiency(output: number, input: number): CrossFormula { return c('solar-efficiency', 'efficiency(output, input) = ⌊output · 100 / input⌋', input > 0 ? Math.floor((output * 100) / input) : 0, nat(output, input) && input > 0 && output <= input, 'efficiency', [output, input]) }
  /** INSOLATION: sun-hours at an irradiance. value hours · irradiance. */
  static insolation(hours: number, irradiance: number): CrossFormula { return c('solar-insolation', 'insolation(hours, irradiance) = hours · irradiance', hours * irradiance, nat(hours, irradiance), 'insolation', [hours, irradiance]) }
  /** PAYBACK: the years for annual savings to repay the cost. value ⌊cost / annual⌋. */
  static payback(cost: number, annual: number): CrossFormula { return c('solar-payback', 'payback(cost, annual) = ⌊cost / annual⌋', annual > 0 ? Math.floor(cost / annual) : 0, nat(cost, annual) && annual > 0, 'payback', [cost, annual]) }
  /** POWER: irradiance over area in kilowatts. value ⌊irradiance · area / 1000⌋. */
  static power(irradiance: number, area: number): CrossFormula { return c('solar-power', 'power(irradiance, area) = ⌊irradiance · area / 1000⌋', Math.floor((irradiance * area) / 1000), nat(irradiance, area), 'power', [irradiance, area]) }
  /** SPECIFIC YIELD: energy per unit of installed capacity. value ⌊energy / capacity⌋. */
  static specific(energy: number, capacity_: number): CrossFormula { return c('solar-specific', 'specific(energy, capacity) = ⌊energy / capacity⌋', capacity_ > 0 ? Math.floor(energy / capacity_) : 0, nat(energy, capacity_) && capacity_ > 0, 'specific', [energy, capacity_]) }
  /** TILT: optimal panel tilt, a latitude proxy. value latitude. */
  static tilt(latitude: number): CrossFormula { return c('solar-tilt', 'tilt(latitude) = latitude', latitude, nat(latitude), 'tilt', [latitude]) }
}

for (const name of ['capacity', 'degradation', 'efficiency', 'insolation', 'payback', 'power', 'specific', 'tilt'] as const)
  qpuHexRegisterOf('solar', name, (SolarFormulas[name] as (...x: unknown[]) => unknown).bind(SolarFormulas))
