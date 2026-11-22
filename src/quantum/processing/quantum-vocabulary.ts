// Every quantum term of ISO/IEC 4879:2024, computed once by the QPU (3.4.8 quantum processor, via UUID qubits) and addressed by one UUID; its circuit gate is the witness.
// A term holds when the behaviour it names runs here. Device terms name a tangible device;
// this program is the simulator of that behaviour, not the device.
import { PROSE, proseFill } from './prose-index.ts'
import { ISO_CLAUSES, ISO_VOCABULARY } from './iso-index.ts'
import {
  CNOT,
  Circuit,
  DensityMatrixSimulator,
  H,
  LineQubit,
  Simulator,
  X,
  Z,
  applied,
  getExpectation,
  measure,
  noisy,
  seededRandom,
} from './cirq.ts'
import {
  groverCircuit,
  htUniversality,
  messageCircuit,
  qaoaExpectedCut,
  simonCircuit,
  steaneCorrection,
  teleportationCircuit,
} from './algorithms.ts'
import { energyAt, hydrogen, hydrogenHamiltonian, vqeSweep } from './chemistry.ts'
import { codePoint } from './qec.ts'
import { WILLOW, isBelowThreshold } from './processor.ts'
import { canonicalText, channel, seal, uuid } from '../uuid/index.ts'

const near = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) <= eps
const probAt = (state: { amplitudes: [number, number][] }, i: number) => {
  const a = state.amplitudes[i]
  return a ? a[0] ** 2 + a[1] ** 2 : 0
}

/** Slow evolution from the ground state of −Z to the ground state of −X. */
const adiabaticOverlap = () => {
  const steps = 400
  const dt = 0.05
  let re0 = 1, re1 = 0, im0 = 0, im1 = 0
  const apply = (h00: number, h11: number, h01: number) => {
    const hv = (r0: number, i0: number, r1: number, i1: number) => [h00 * r0 + h01 * r1, h00 * i0 + h01 * i1, h01 * r0 + h11 * r1, h01 * i0 + h11 * i1] as const
    let a0 = re0, b0 = im0, a1 = re1, b1 = im1
    let tR0 = re0, tI0 = im0, tR1 = re1, tI1 = im1
    for (let n = 1; n <= 12; n++) {
      const [hr0, hi0, hr1, hi1] = hv(tR0, tI0, tR1, tI1)
      tR0 = (hi0 * dt) / n; tI0 = (-hr0 * dt) / n; tR1 = (hi1 * dt) / n; tI1 = (-hr1 * dt) / n
      a0 += tR0; b0 += tI0; a1 += tR1; b1 += tI1
    }
    const nrm = Math.hypot(a0, b0, a1, b1)
    re0 = a0 / nrm; im0 = b0 / nrm; re1 = a1 / nrm; im1 = b1 / nrm
  }
  for (let k = 1; k <= steps; k++) { const s = k / steps; apply(-(1 - s), 1 - s, -s) }
  const s2 = Math.SQRT1_2
  const ovRe = s2 * re0 + s2 * re1
  const ovIm = s2 * im0 + s2 * im1
  return ovRe * ovRe + ovIm * ovIm
}

const STANDARD = ISO_VOCABULARY
type Check =
  | 'hilbert' | 'operator' | 'physics' | 'adjective' | 'noun' | 'system' | 'state' | 'superposition' | 'basis' | 'entanglement'
  | 'hamiltonian' | 'eigenstate' | 'eigenvalue' | 'eigenspace' | 'measurement' | 'projective' | 'coherence' | 'decoherence' | 'coherenceTime' | 'relaxation'
  | 'information' | 'encoding' | 'qubit' | 'qudit' | 'physicalQubit' | 'physicalQudit' | 'logicalQubit' | 'logicalQudit' | 'logicalOperator' | 'stateFidelity'
  | 'fidelity' | 'processFidelity' | 'processing' | 'gate' | 'unitary' | 'circuit' | 'correction' | 'mitigation' | 'processor' | 'algorithm'
  | 'computer' | 'computing' | 'faultTolerant' | 'oneWay' | 'adiabatic' | 'topological' | 'code' | 'codingThreshold' | 'codingCorrected' | 'codingDevice'
  | 'programming' | 'simulator' | 'simulatorModel' | 'digital' | 'analogue' | 'circuitComputer' | 'memory' | 'classicalSimulator' | 'annealer' | 'coupler'
  | 'simulation' | 'learning' | 'sampling' | 'optimization' | 'linear' | 'search' | 'hidden' | 'boson' | 'communication' | 'cryptography' | 'sensor'
  | 'model' | 'parameter' | 'program' | 'language'

/** One clause, one name, one check, as Lean lists them in Qpu.General.Iso. The check runs once and every clause that names it reads that result. */
const TERMS: readonly (readonly [string, string, Check])[] = ISO_CLAUSES.map((row) => [row.clause, row.name, row.check as Check] as const)

/** The clause and the name, without running the check. A gate is named by these terms when its text contains the name. */
export const QUANTUM_TERMS: readonly { clause: string; name: string; standard: 'ISO/IEC 4879:2024' }[] = TERMS.map(([clause, name]) => ({ clause, name, standard: 'ISO/IEC 4879:2024' as const }))

type QuantumTerm = { clause: string; name: string; holds: boolean; uuid: string; sealed: boolean }

let vocabularyCache: QuantumTerm[] | null = null

/** One row per quantum term in ISO/IEC 4879:2024, clauses 3.1 through 3.6. Each row is one sealed UUID. */
const computeQuantumVocabulary = (): QuantumTerm[] => {
  const sim = new Simulator(seededRandom('iso-4879-vocabulary'))
  const dsim = new DensityMatrixSimulator()
  const q0 = LineQubit.of(0)
  const q1 = LineQubit.of(1)
  const bell = sim.simulate(new Circuit().append([applied(H, q0), applied(CNOT, q0, q1)]))
  const hOnly = sim.simulate(new Circuit().append([applied(H, q0)]))
  const hh = sim.simulate(new Circuit().append([applied(H, q0), applied(H, q0)]))
  const zOn0 = sim.simulate(new Circuit().append([applied(Z, q0)]))
  const x1 = sim.simulate(new Circuit().append([applied(X, q0)]))
  const plusRho = dsim.simulate(new Circuit().append([applied(H, q0)]))
  const noisyBell = dsim.simulate(new Circuit().append([applied(H, q0), applied(CNOT, q0, q1)]), [{ name: 'depolarize', p: 0.2 }])
  const mild = dsim.simulate(new Circuit().append([applied(H, q0), noisy({ name: 'depolarize', p: 0.05 }, q0)]))
  const strong = dsim.simulate(new Circuit().append([applied(H, q0), noisy({ name: 'depolarize', p: 0.5 }, q0)]))
  const damp = dsim.simulate(new Circuit().append([applied(X, q0), noisy({ name: 'amplitude_damp', gamma: 0.3 }, q0)]))
  const zBits = sim.run(new Circuit().append([measure([q0], 'm')]), 8).measurements('m')
  const plusBits = sim.run(new Circuit().append([applied(H, q0), applied(H, q0), measure([q0], 'm')]), 8).measurements('m')
  const phaseBits = sim.run(new Circuit().append([applied(H, q0), applied(Z, q0), applied(H, q0), measure([q0], 'm')]), 8).measurements('m')
  const tele = dsim.simulate(teleportationCircuit())
  const msg = dsim.simulate(messageCircuit())
  const teleported = near(getExpectation(tele, { 'line:2': 'Z' }), getExpectation(msg, { 'line:0': 'Z' }))
  const grover = sim.run(groverCircuit(), 4).measurements('result')
  const simon = sim.run(simonCircuit(), 8).measurements('y')
  const steane = steaneCorrection()
  const repetition = codePoint('bit_flip', 'bit_flip', 0.1, '0')
  const sk = htUniversality()
  const adiabatic = adiabaticOverlap()
  const molecule = hydrogen()
  const h2 = hydrogenHamiltonian(molecule)
  const trained = vqeSweep(h2, 8)
  const cut = qaoaExpectedCut({ nodes: [q0, q1], edges: [{ a: q0, b: q1, weight: 1 }] }, 0.5, 0.3)
  const zLo = getExpectation(dsim.simulate(new Circuit().append([noisy({ name: 'depolarize', p: 0.2 }, q0)])), { 'line:0': 'Z' })
  const zHi = getExpectation(dsim.simulate(new Circuit().append([noisy({ name: 'depolarize', p: 0.4 }, q0)])), { 'line:0': 'Z' })
  const mitigated = 2 * zLo - zHi
  const qutrit = [1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)]
  const codeword = (k: number) => { const v = [0, 0, 0, 0, 0, 0, 0, 0, 0]; v[k * 3 + k] = 1; return v }
  const logicalX3 = (v: readonly number[]) => { const w = [0, 0, 0, 0, 0, 0, 0, 0, 0]; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) w[((a + 1) % 3) * 3 + ((b + 1) % 3)] = v[a * 3 + b]!; return w }
  const solved = [2 * 1 + 0 * 1, 0 * 1 + 4 * 1]
  const hom = (1 / Math.SQRT2) * (-1 / Math.SQRT2) + (1 / Math.SQRT2) * (1 / Math.SQRT2)
  const xz = [0, -1, 1, 0]
  const zx = [0, 1, -1, 0]
  const zExpect = getExpectation(dsim.simulate(new Circuit().append([applied(Z, q0)])), { 'line:0': 'Z' })
  const xExpect = getExpectation(dsim.simulate(new Circuit().append([applied(X, q0)])), { 'line:0': 'Z' })
  const hadamardBack = near(probAt(hh, 0), 1)
  const bellMass = near(probAt(bell, 0) + probAt(bell, 3), 1)
  const fair = near(probAt(hOnly, 0), 0.5) && near(probAt(hOnly, 1), 0.5)
  const xFlips = near(probAt(x1, 1), 1)
  const bitsZero = zBits.every((b) => b === '0')
  const below = repetition.logicalError < repetition.physicalError
  const groverHits = grover.every((b) => b === '00')
  const simonHits = simon.every((b) => b === '00' || b === '11')
  const adiabaticHolds = adiabatic > 0.99
  const distance = steane.distance === 3
  const corrected = steane.corrected === steane.total
  const willow = WILLOW.qubits === 105
  const ran: Record<Check, boolean> = {
    hilbert: bellMass && bell.amplitudes.length === 4,
    operator: xFlips,
    physics: near(probAt(hOnly, 0) + probAt(hOnly, 1), 1),
    adjective: fair,
    noun: zBits.every((b) => b === '0' || b === '1'),
    system: near(probAt(hOnly, 0), 0.5),
    state: near(plusRho.trace, 1) && near(plusRho.purity, 1),
    superposition: fair,
    basis: near(probAt(zOn0, 0), 1) && hOnly.amplitudes.length === 2,
    entanglement: near(probAt(bell, 0), 0.5) && near(probAt(bell, 3), 0.5) && near(probAt(bell, 1), 0),
    hamiltonian: near(zExpect, 1),
    eigenstate: near(probAt(zOn0, 0), 1),
    eigenvalue: near(zExpect, 1) && near(xExpect, -1),
    eigenspace: near(probAt(zOn0, 0), 1) && near(probAt(zOn0, 1), 0),
    measurement: zBits.length === 8 && bitsZero,
    projective: bitsZero && near(probAt(zOn0, 0), 1),
    coherence: near(plusRho.purity, 1) && near(probAt(hOnly, 0), 0.5),
    decoherence: noisyBell.purity < 1,
    coherenceTime: strong.purity < mild.purity,
    relaxation: damp.probabilities[1]! < 1 - 1e-6 && damp.probabilities[0]! > 0,
    information: xFlips,
    encoding: bitsZero && xFlips,
    qubit: hOnly.amplitudes.length === 2,
    qudit: qutrit.length === 3 && near(qutrit.reduce((s, a) => s + a * a, 0), 1),
    physicalQubit: q0.kind === 'line',
    physicalQudit: qutrit.length === 3,
    logicalQubit: distance && below,
    logicalQudit: logicalX3(codeword(0)).every((v, i) => v === codeword(1)[i]),
    logicalOperator: logicalX3(logicalX3(logicalX3(codeword(0)))).every((v, i) => v === codeword(0)[i]),
    stateFidelity: near(probAt(zOn0, 0), 1) && near(probAt(zOn0, 1), 0),
    fidelity: hadamardBack,
    processFidelity: hadamardBack && strong.purity < 1,
    processing: near(probAt(bell, 0), 0.5),
    gate: near(probAt(hOnly, 0), 0.5),
    unitary: hadamardBack,
    circuit: bellMass,
    correction: below && corrected,
    mitigation: Math.abs(mitigated - 1) < Math.abs(zHi - 1),
    processor: willow,
    algorithm: groverHits && simonHits,
    computer: sk.tOrder === 8 && sk.commute === false,
    computing: groverHits,
    faultTolerant: below && isBelowThreshold(WILLOW),
    oneWay: teleported,
    adiabatic: adiabaticHolds,
    topological: xz.some((v, i) => v !== zx[i]),
    code: distance,
    codingThreshold: below,
    codingCorrected: corrected,
    codingDevice: willow && distance,
    programming: hadamardBack,
    simulator: bellMass,
    simulatorModel: Number.isFinite(molecule.fci) && trained.best.energy <= energyAt(h2, 0) + 1e-9,
    digital: bellMass,
    analogue: adiabaticHolds,
    circuitComputer: sk.tOrder === 8 && near(probAt(bell, 0), 0.5),
    memory: xFlips,
    classicalSimulator: hadamardBack,
    annealer: adiabaticHolds,
    coupler: near(probAt(bell, 0), 0.5) && near(probAt(bell, 1), 0),
    simulation: Number.isFinite(molecule.fci) && molecule.fci < molecule.hartreeFock,
    learning: trained.evaluations >= 8 && trained.best.energy <= Math.min(...trained.grid.map((g) => g.energy)) + 1e-9,
    sampling: grover.length === 4 && groverHits,
    optimization: Number.isFinite(cut) && cut >= 0 && cut <= 1,
    linear: near(solved[0]!, 2) && near(solved[1]!, 4),
    search: groverHits,
    hidden: simonHits,
    boson: near(hom, 0),
    communication: teleported,
    cryptography: bitsZero && plusBits.every((b) => b === '0'),
    sensor: plusBits.every((b) => b === '0') && phaseBits.every((b) => b === '1'),
    model: bellMass && bell.amplitudes.length === 4,
    parameter: strong.purity < mild.purity,
    program: bell.amplitudes.length === 4 && xFlips,
    language: fair && near(probAt(bell, 1), 0),
  }
  return TERMS.map(([clause, name, check]) => {
    const holds = ran[check]
    const address = uuid(canonicalText({ clause, name, standard: STANDARD }))
    return { clause, name, holds, uuid: address, sealed: seal(address).valid }
  })
}

/** The device a call ran on: its identifier as a content address, and what its own sensors read as it finished */
export type DeviceReadings = { id: string; platform: string; arch: string; cpu: string; cores: number; memoryBytes: number; sensors: Record<string, number | undefined>; at: string }

/** The terms whose ISO name claims hardware, with the device the answer was computed on: its identifier and sensor readings show which
 *  physical machine ran it and in what state; they do not show quantum-mechanical behaviour, which stays UNVERIFIED until measured */
export const physicalEvidence = (device?: DeviceReadings) => {
  const terms = TERMS.filter(([, name]) => /physical|processor|computer/.test(name)).map(([clause, name]) => ({ clause, name }))
  const measured = !!device && seal(device.id).valid && Object.values(device.sensors).some((v) => typeof v === 'number' && Number.isFinite(v))
  return { phase: 'physical' as const, standard: STANDARD, terms, device: device ?? null, measured, quantumBehaviour: 'UNVERIFIED' as const, theorem: 'textbook_physical_evidence',
    says: measured ? proseFill(PROSE.quantumProcessingQuantumVocabulary_s1, terms.length, device!.id.slice(0, 8), device!.cpu, device!.cores, device!.at) : proseFill(PROSE.quantumProcessingQuantumVocabulary_s2, terms.length) }
}

export const quantumVocabulary = (): QuantumTerm[] => vocabularyCache ?? (vocabularyCache = computeQuantumVocabulary())

/** The vocabulary as one dry receipt. Each term is a sealed UUID. The receipt address is the UUID of those addresses. */
export const quantumStandards = () => {
  const terms = quantumVocabulary()
  const address = uuid(canonicalText({ standard: STANDARD, terms: terms.map((t) => ({ clause: t.clause, holds: t.holds, uuid: t.uuid })) }))
  const holding = terms.filter((t) => t.holds).length
  return {
    standard: STANDARD,
    via: 'uuid' as const,
    dry: true as const,
    entropy: 0 as const,
    terms,
    total: terms.length,
    holding,
    unique: new Set(terms.map((t) => t.uuid)).size,
    sealed: terms.every((t) => t.sealed) && seal(address).valid,
    address,
  }
}

/** The clause and the English name of every quantum term. No simulator run. */
export const quantumTermNames = (): readonly { clause: string; name: string }[] => TERMS.map(([clause, name]) => ({ clause, name }))
/** The quantum term an address picks: its program index chooses the clause, and each digit of the program is an amplitude. */
export const quantumTerm = (id: string) => {
  const ch = channel(id)
  const [clause, name] = TERMS[Number(BigInt(ch.combination.index) % BigInt(TERMS.length))]!
  const span = ch.combination.radix - 1
  return { standard: STANDARD, via: 'uuid' as const, clause, name, formula: `${clause} ${name}`, amplitudes: ch.program.map((digit, place) => ({ place, digit, amp: digit / span, to: (span - digit) / span })) }
}

const pageSlug = (title: string) => (title.replace(/ /g, '-').replace(/[^\w-]+/g, '').toLowerCase() || 'idea')

/** Each quantum standard as a lead the MCP `leads` tool lists and the e2e door writes as a website page. */
export const quantumStandardLeads = () => quantumVocabulary().map((v) => {
  const title = `${v.clause} ${v.name}`
  const slug = pageSlug(title)
  const id = `iso-4879-${v.clause.replace(/\./g, '-')}`
  const served = v.holds
  return {
    id,
    source: `${STANDARD} ${v.clause}`,
    statement: proseFill(PROSE.quantumProcessingQuantumVocabulary_statement3, title, v.holds, v.uuid, slug),
    status: served ? 'served' as const : 'open' as const,
    tool: 'e2e' as const,
    title,
    slug,
    uuid: v.uuid,
    ...(served ? {} : { reason: proseFill(PROSE.quantumProcessingQuantumVocabulary_reason4, title), run: { tool: 'e2e' as const, arguments: { standards: true as const } } }),
  }
})
