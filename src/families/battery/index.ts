import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** BATTERY — ENERGY STORAGE AS ARITHMETIC. A cell pack is numbers: the capacity cells hold, the charge they carry, the
 *  cycles left in them, the depth of a discharge, how long a draw lasts, the current at a C-rate, the state of health, and
 *  the energy stored. Crosses to `electrical` — a battery is an electrical source. A measure. */

const PROOF = 'battery arithmetic (pack capacity, charge level, remaining cycles, depth of discharge, runtime, C-rate current, state of health, stored energy); energy storage as a measure crossed to electrical'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'battery', dst: 'electrical', formula, value, proof: PROOF, ...extra }, holds, { name: `battery.${name}`, params })

export class BatteryFormulas {
  /** PACK CAPACITY: cells in parallel each holding mAh. value cells · mAh. */
  static capacity(cells: number, mAh: number): CrossFormula { return c('battery-capacity', 'capacity(cells, mAh) = cells · mAh', cells * mAh, nat(cells, mAh), 'capacity', [cells, mAh]) }
  /** CHARGE LEVEL as a percentage. value ⌊charged · 100 / capacity⌋. */
  static charge(charged: number, capacity: number): CrossFormula { return c('battery-charge', 'charge(charged, capacity) = ⌊charged · 100 / capacity⌋', capacity > 0 ? Math.floor((charged * 100) / capacity) : 0, nat(charged, capacity) && capacity > 0 && charged <= capacity, 'charge', [charged, capacity]) }
  /** C-RATE CURRENT: the current a pack sources at a C-rate multiple. value capacity · rate. */
  static crate(capacity: number, rate: number): CrossFormula { return c('battery-crate', 'crate(capacity, rate) = capacity · rate', capacity * rate, nat(capacity, rate), 'crate', [capacity, rate]) }
  /** REMAINING CYCLES: rated cycles less those used. value max(0, rated − used). */
  static cycles(rated: number, used: number): CrossFormula { return c('battery-cycles', 'cycles(rated, used) = max(0, rated − used)', Math.max(0, rated - used), nat(rated, used), 'cycles', [rated, used]) }
  /** DEPTH OF DISCHARGE as a percentage. value ⌊discharged · 100 / capacity⌋. */
  static depth(discharged: number, capacity: number): CrossFormula { return c('battery-depth', 'depth(discharged, capacity) = ⌊discharged · 100 / capacity⌋', capacity > 0 ? Math.floor((discharged * 100) / capacity) : 0, nat(discharged, capacity) && capacity > 0 && discharged <= capacity, 'depth', [discharged, capacity]) }
  /** STORED ENERGY in watt-hours. value ⌊voltage · mAh / 1000⌋. */
  static energy(voltage: number, mAh: number): CrossFormula { return c('battery-energy', 'energy(voltage, mAh) = ⌊voltage · mAh / 1000⌋', Math.floor((voltage * mAh) / 1000), nat(voltage, mAh), 'energy', [voltage, mAh]) }
  /** RUNTIME: hours a capacity lasts at a steady draw. value ⌊capacity / draw⌋. */
  static runtime(capacity: number, draw: number): CrossFormula { return c('battery-runtime', 'runtime(capacity, draw) = ⌊capacity / draw⌋', draw > 0 ? Math.floor(capacity / draw) : 0, nat(capacity, draw) && draw > 0, 'runtime', [capacity, draw]) }
  /** STATE OF HEALTH as a percentage. value ⌊current · 100 / original⌋. */
  static soh(current: number, original: number): CrossFormula { return c('battery-soh', 'soh(current, original) = ⌊current · 100 / original⌋', original > 0 ? Math.floor((current * 100) / original) : 0, nat(current, original) && original > 0 && current <= original, 'soh', [current, original]) }
}

for (const name of ['capacity', 'charge', 'crate', 'cycles', 'depth', 'energy', 'runtime', 'soh'] as const)
  qpuHexRegisterOf('battery', name, (BatteryFormulas[name] as (...x: unknown[]) => unknown).bind(BatteryFormulas))
