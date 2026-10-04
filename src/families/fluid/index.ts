import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** FLUID — MOVING FLUIDS AS ARITHMETIC. The forces a flow carries are numbers: a Reynolds proxy, the total head, viscosity,
 *  drag, buoyancy, the flow rate a pipe passes, a Froude number, and the pressure a force makes on an area. Crosses to
 *  `hydraulics` — fluid is what hydraulics drives. A measure. */

const PROOF = 'fluid arithmetic (reynolds proxy, bernoulli head, viscosity, drag, buoyancy, continuity flow, froude, pressure); moving fluids as numbers; a measure crossed to hydraulics'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'fluid', dst: 'hydraulics', formula, value, proof: PROOF, ...extra }, holds, { name: `fluid.${name}`, params })

export class FluidFormulas {
  /** REYNOLDS proxy: velocity through a diameter. value velocity · diameter. */
  static reynolds(velocity: number, diameter: number): CrossFormula { return c('fluid-reynolds', 'reynolds(velocity, diameter) = velocity · diameter', velocity * diameter, nat(velocity, diameter), 'reynolds', [velocity, diameter]) }
  /** BERNOULLI: total head as pressure plus kinetic. value pressure + kinetic. */
  static bernoulli(pressure: number, kinetic: number): CrossFormula { return c('fluid-bernoulli', 'bernoulli(pressure, kinetic) = pressure + kinetic', pressure + kinetic, nat(pressure, kinetic), 'bernoulli', [pressure, kinetic]) }
  /** VISCOSITY: shear stress over the strain rate. value ⌊stress / rate⌋. */
  static viscosity(stress: number, rate: number): CrossFormula { return c('fluid-viscosity', 'viscosity(stress, rate) = ⌊stress / rate⌋', rate > 0 ? Math.floor(stress / rate) : 0, nat(stress, rate) && rate > 0, 'viscosity', [stress, rate]) }
  /** DRAG: a coefficient over a frontal area. value coefficient · area. */
  static drag(coefficient: number, area: number): CrossFormula { return c('fluid-drag', 'drag(coefficient, area) = coefficient · area', coefficient * area, nat(coefficient, area), 'drag', [coefficient, area]) }
  /** BUOYANCY: fluid density times displaced volume. value density · volume. */
  static buoyancy(density: number, volume: number): CrossFormula { return c('fluid-buoyancy', 'buoyancy(density, volume) = density · volume', density * volume, nat(density, volume), 'buoyancy', [density, volume]) }
  /** CONTINUITY: flow rate as area times velocity. value area · velocity. */
  static continuity(area: number, velocity: number): CrossFormula { return c('fluid-continuity', 'continuity(area, velocity) = area · velocity', area * velocity, nat(area, velocity), 'continuity', [area, velocity]) }
  /** FROUDE: velocity over a wave speed, scaled. value ⌊velocity · 100 / wave⌋. */
  static froude(velocity: number, wave: number): CrossFormula { return c('fluid-froude', 'froude(velocity, wave) = ⌊velocity · 100 / wave⌋', wave > 0 ? Math.floor((velocity * 100) / wave) : 0, nat(velocity, wave) && wave > 0, 'froude', [velocity, wave]) }
  /** PRESSURE: a force over the area it acts on. value ⌊force / area⌋. */
  static pressure(force: number, area: number): CrossFormula { return c('fluid-pressure', 'pressure(force, area) = ⌊force / area⌋', area > 0 ? Math.floor(force / area) : 0, nat(force, area) && area > 0, 'pressure', [force, area]) }
}

for (const name of ['bernoulli', 'buoyancy', 'continuity', 'drag', 'froude', 'pressure', 'reynolds', 'viscosity'] as const)
  qpuHexRegisterOf('fluid', name, (FluidFormulas[name] as (...x: unknown[]) => unknown).bind(FluidFormulas))
