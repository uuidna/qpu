import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** SATELLITE — ORBITAL MECHANICS AND LINK ENGINEERING, AS ARITHMETIC. A constellation is numbers: orbital period, the
 *  ground a swath covers over many orbits, the link budget left after path loss, the footprint a look angle sees, how
 *  often a constellation revisits, the downlink rate in a pass, the elevation of a bird, and the one-way latency to it.
 *  Crosses to `aerospace` — satellites are what aerospace flies. A measure. */

const PROOF = 'satellite arithmetic (orbital period, coverage, link budget, footprint, revisit, downlink, elevation, latency); a measure crossed to aerospace'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'satellite', dst: 'aerospace', formula, value, proof: PROOF, ...extra }, holds, { name: `satellite.${name}`, params })

export class SatelliteFormulas {
  /** ORBITAL PERIOD proxy: altitude scaled by a factor. value altitude · factor. */
  static period(altitude: number, factor: number): CrossFormula { return c('satellite-period', 'period(altitude, factor) = altitude · factor', altitude * factor, nat(altitude, factor), 'period', [altitude, factor]) }
  /** COVERAGE: a swath over many orbits. value swath · orbits. */
  static coverage(swath: number, orbits: number): CrossFormula { return c('satellite-coverage', 'coverage(swath, orbits) = swath · orbits', swath * orbits, nat(swath, orbits), 'coverage', [swath, orbits]) }
  /** LINK BUDGET: transmit power less path loss, never below zero. value max(0, power − loss). */
  static linkbudget(power: number, loss: number): CrossFormula { return c('satellite-linkbudget', 'linkbudget(power, loss) = max(0, power − loss)', Math.max(0, power - loss), nat(power, loss), 'linkbudget', [power, loss]) }
  /** FOOTPRINT: altitude times the look angle. value altitude · angle. */
  static footprint(altitude: number, angle: number): CrossFormula { return c('satellite-footprint', 'footprint(altitude, angle) = altitude · angle', altitude * angle, nat(altitude, angle), 'footprint', [altitude, angle]) }
  /** REVISIT: the period shared across the constellation. value ⌊period / satellites⌋. */
  static revisit(period: number, satellites: number): CrossFormula { return c('satellite-revisit', 'revisit(period, satellites) = ⌊period / satellites⌋', satellites > 0 ? Math.floor(period / satellites) : 0, nat(period, satellites) && satellites > 0, 'revisit', [period, satellites]) }
  /** DOWNLINK: bits over the seconds of a pass. value ⌊bits / seconds⌋. */
  static downlink(bits: number, seconds: number): CrossFormula { return c('satellite-downlink', 'downlink(bits, seconds) = ⌊bits / seconds⌋', seconds > 0 ? Math.floor(bits / seconds) : 0, nat(bits, seconds) && seconds > 0, 'downlink', [bits, seconds]) }
  /** ELEVATION: the angle of a bird above the horizon. value degrees. */
  static elevation(degrees: number): CrossFormula { return c('satellite-elevation', 'elevation(degrees) = degrees', degrees, nat(degrees), 'elevation', [degrees]) }
  /** LATENCY: one-way distance over signal speed. value ⌊distance / speed⌋. */
  static latency(distance: number, speed: number): CrossFormula { return c('satellite-latency', 'latency(distance, speed) = ⌊distance / speed⌋', speed > 0 ? Math.floor(distance / speed) : 0, nat(distance, speed) && speed > 0, 'latency', [distance, speed]) }
}

for (const name of ['coverage', 'downlink', 'elevation', 'footprint', 'latency', 'linkbudget', 'period', 'revisit'] as const)
  qpuHexRegisterOf('satellite', name, (SatelliteFormulas[name] as (...x: unknown[]) => unknown).bind(SatelliteFormulas))
