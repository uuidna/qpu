import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** SYNAPSE — THE CHEMICAL JUNCTION, AS ARITHMETIC. A synapse is numbers: the delay a signal takes down an axon, the
 *  neurotransmitter molecules a release puts into the cleft, how many receptors it occupies, the net of excitation and
 *  inhibition, the rate a neuron fires, a synaptic weight, the vesicles left in reserve, and the probability a vesicle
 *  releases. Crosses to `neurology` — the synapse is what neurology studies. A measure. */

const PROOF = 'synapse arithmetic (transmission delay, neurotransmitter release, receptor occupancy, summation, firing rate, synaptic weight, vesicle count, release probability); the chemical junction as a measure crossed to neurology'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'synapse', dst: 'neurology', formula, value, proof: PROOF, ...extra }, holds, { name: `synapse.${name}`, params })

export class SynapseFormulas {
  /** TRANSMISSION DELAY: the time a signal takes down an axon of a length at a conduction speed. value ⌊distance / speed⌋. */
  static transmissiondelay(distance: number, speed: number): CrossFormula { return c('synapse-transmissiondelay', 'transmissiondelay(distance, speed) = ⌊distance / speed⌋', speed > 0 ? Math.floor(distance / speed) : 0, nat(distance, speed) && speed > 0, 'transmissiondelay', [distance, speed]) }
  /** NEUROTRANSMITTER RELEASE: molecules put into the cleft — vesicles at a molecule count each. value vesicles · molecules. */
  static neurotransmitterrelease(vesicles: number, molecules: number): CrossFormula { return c('synapse-neurotransmitterrelease', 'neurotransmitterrelease(vesicles, molecules) = vesicles · molecules', vesicles * molecules, nat(vesicles, molecules), 'neurotransmitterrelease', [vesicles, molecules]) }
  /** RECEPTOR OCCUPANCY as a percentage of the receptors bound. value ⌊bound · 100 / total⌋. */
  static receptoroccupancy(bound: number, total: number): CrossFormula { return c('synapse-receptoroccupancy', 'receptoroccupancy(bound, total) = ⌊bound · 100 / total⌋', total > 0 ? Math.floor((bound * 100) / total) : 0, nat(bound, total) && total > 0 && bound <= total, 'receptoroccupancy', [bound, total]) }
  /** SUMMATION: the net postsynaptic potential, excitation less inhibition. value max(0, epsp − ipsp). */
  static summation(epsp: number, ipsp: number): CrossFormula { return c('synapse-summation', 'summation(epsp, ipsp) = max(0, epsp − ipsp)', Math.max(0, epsp - ipsp), nat(epsp, ipsp), 'summation', [epsp, ipsp]) }
  /** FIRING RATE: spikes over seconds. value ⌊spikes / seconds⌋. */
  static firingrate(spikes: number, seconds: number): CrossFormula { return c('synapse-firingrate', 'firingrate(spikes, seconds) = ⌊spikes / seconds⌋', seconds > 0 ? Math.floor(spikes / seconds) : 0, nat(spikes, seconds) && seconds > 0, 'firingrate', [spikes, seconds]) }
  /** SYNAPTIC WEIGHT: a presynaptic input scaled by a factor. value presynaptic · factor. */
  static synapticweight(presynaptic: number, factor: number): CrossFormula { return c('synapse-synapticweight', 'synapticweight(presynaptic, factor) = presynaptic · factor', presynaptic * factor, nat(presynaptic, factor), 'synapticweight', [presynaptic, factor]) }
  /** VESICLE COUNT: the reserve pool left after the docked vesicles. value max(0, pool − docked). */
  static vesiclecount(pool: number, docked: number): CrossFormula { return c('synapse-vesiclecount', 'vesiclecount(pool, docked) = max(0, pool − docked)', Math.max(0, pool - docked), nat(pool, docked), 'vesiclecount', [pool, docked]) }
  /** RELEASE PROBABILITY as a percentage — the releases that succeeded over the trials. value ⌊successes · 100 / trials⌋. */
  static releaseprobability(successes: number, trials: number): CrossFormula { return c('synapse-releaseprobability', 'releaseprobability(successes, trials) = ⌊successes · 100 / trials⌋', trials > 0 ? Math.floor((successes * 100) / trials) : 0, nat(successes, trials) && trials > 0 && successes <= trials, 'releaseprobability', [successes, trials]) }
}

for (const name of ['firingrate', 'neurotransmitterrelease', 'receptoroccupancy', 'releaseprobability', 'summation', 'synapticweight', 'transmissiondelay', 'vesiclecount'] as const)
  qpuHexRegisterOf('synapse', name, (SynapseFormulas[name] as (...x: unknown[]) => unknown).bind(SynapseFormulas))
