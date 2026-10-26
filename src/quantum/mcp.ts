// The qpu MCP surface: JSON-RPC 2.0 tools that take typed POST parameters and compile the circuit they describe on each
// call. The handler does no I/O and imports nothing from Node, so the same code runs in a browser OS, where a caller
// compiles whatever it needs by calling a tool. Tool names and figures follow Google Quantum AI (quantumai.google).

import * as cirq from './cirq.js'
import { EXAMPLES } from './examples.js'
import { auditOf, entropyOf, differencesOf, securityOf, remediesOf, advantageOf, addressedByTheoremOf, billOf, FALLBACKS, FALLBACK_ADAPTERS, handleOrCorrect } from './audit.js'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.js'
import { sdkOf, accessAuditOf, buildOf } from './toolboxes/payload.js'
import { blockOf, verifyOf, uuidOf } from './blocks.js'
import { INSTRUCTIONS, LICENSE } from './license.js'
import { recomputeClay, reflectionOfRegister } from './clay-register.js'
import { matchOf } from './match.js'
import { LOCALES } from './i18n.js'
import { CNOT, CZ, Channel, Circuit, DensityMatrixSimulator, GridQubit, H, InsertStrategy, LineQubit, NamedQubit, Simulator, randomOf, SWAP, TOFFOLI, X, Y, Z, applied, expectationOf, keyOf, measure, powerOf, type Gate, type Operation, type Qubit } from './cirq.js'
import { echoCircuit, echoProbability, QUANTUM_ECHOES } from './echo.js'
import { DEVICES, PROCESSORS, deviceOf, willowNoiseOf } from './processor.js'
import { algorithmWidget, chemistryWidget, circuitWidget, echoBenchmarkWidget, echoWidget, errorCorrectionWidget, leadsWidget, entropyWidget, processorWidget, quantumlibWidget, repositoriesWidget, resourcesWidget, roadmapWidget, softwareWidget, statementsWidget, auditWidget, matchWidget, clayWidget, verifyWidget } from './widgets.js'
import { APPLICATIONS, ROADMAP } from './roadmap.js'
import { groverCircuit, inverseOperations, messageCircuit, phaseEstimationCircuit, qaoaCircuit, qaoaExpectedCut, qaoaSweep, pageInstance, qftOperations, shorCircuit, shorFactors, teleportationCircuit } from './algorithms.js'
import { STATEMENTS, SOFTWARE, type StatementTopic } from './statements.js'
import { LEADS, leadCounts, type LeadStatus } from './leads.js'
import { REPOSITORIES } from './repositories.js'
import { breakEvenOf, codePoint, repetitionCycle, channelOf as qecChannelOf, textbookLogicalError, type ErrorChannel, type LogicalState, type RepetitionCode } from './qec.js'
import { BOHR_ANGSTROM, STO3G_H, TUTORIAL_ENERGIES, ansatzCircuit, energyAt, hydrogen, hydrogenHamiltonian, tutorialChecks, vqeSweep } from './chemistry.js'
import { CLIFFORD_CHECK_ARITY, countResources } from './counting.js'

export type Rpc = { jsonrpc: '2.0'; id?: number | string | null; method: string; params?: unknown }
export type Reply =
  | { jsonrpc: '2.0'; id: number | string | null; result: unknown }
  | { jsonrpc: '2.0'; id: number | string | null; error: { code: number; message: string } }

/** JSON-RPC's invalid-params code: the arguments of a tool do not describe a circuit or a processor. */
const INVALID_PARAMS = -32602
const METHOD_NOT_FOUND = -32601

class ParamError extends Error {}

const GATES: Record<string, Gate> = { X, Y, Z, H, CZ, CNOT, SWAP, TOFFOLI }

type QubitJson = { kind: 'grid'; row: number; col: number } | { kind: 'line'; x: number } | { kind: 'named'; name: string }
type OperationJson = { gate: string; qubits: QubitJson[]; exponent?: number }
type MeasureJson = { key: string; qubits: QubitJson[] }

const qubitOf = (q: QubitJson): Qubit => {
  if (q.kind === 'grid') return GridQubit.of(q.row, q.col)
  if (q.kind === 'line') return LineQubit.of(q.x)
  if (q.kind === 'named') return NamedQubit.of(q.name)
  throw new ParamError(`a qubit is grid, line or named, not ${JSON.stringify(q)}`)
}

const operationOf = (op: OperationJson): Operation => {
  const gate = GATES[op.gate]
  if (!gate) throw new ParamError(`gate ${op.gate} is not one of ${Object.keys(GATES).join(', ')}`)
  const powered = op.exponent === undefined ? gate : powerOf(gate, op.exponent)
  return applied(powered, ...op.qubits.map(qubitOf))
}

/** The circuit a call describes: its operations placed by the insert strategy, then an optional measurement. */
const circuitOf = (operations: OperationJson[], insert: InsertStrategy, measurement?: MeasureJson): Circuit => {
  const circuit = new Circuit().append(operations.map(operationOf), insert)
  if (measurement) circuit.append(measure(measurement.qubits.map(qubitOf), measurement.key))
  return circuit
}

type ChannelJson = { name: string; p?: number; p_x?: number; p_y?: number; p_z?: number; gamma?: number }

/** A noise channel as a call names it: its name and the parameters that name takes. */
const channelOf = (j: ChannelJson): Channel => {
  const need = (v: number | undefined, key: string): number => v ?? reject(`${j.name} needs ${key}`)
  switch (j.name) {
    case 'bit_flip': return { name: 'bit_flip', p: need(j.p, 'p') }
    case 'phase_flip': return { name: 'phase_flip', p: need(j.p, 'p') }
    case 'depolarize': return { name: 'depolarize', p: need(j.p, 'p') }
    case 'asymmetric_depolarize': return { name: 'asymmetric_depolarize', p_x: need(j.p_x, 'p_x'), p_y: need(j.p_y, 'p_y'), p_z: need(j.p_z, 'p_z') }
    case 'amplitude_damp': return { name: 'amplitude_damp', gamma: need(j.gamma, 'gamma') }
    case 'phase_damp': return { name: 'phase_damp', gamma: need(j.gamma, 'gamma') }
    case 'generalized_amplitude_damp': return { name: 'generalized_amplitude_damp', p: need(j.p, 'p'), gamma: need(j.gamma, 'gamma') }
    case 'reset': return { name: 'reset' }
    default: return reject(`channel ${j.name} is not one of the channels Cirq names: bit_flip, phase_flip, depolarize, asymmetric_depolarize, amplitude_damp, phase_damp, generalized_amplitude_damp, reset`)
  }
}

const CHANNEL_SCHEMA = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { enum: ['bit_flip', 'phase_flip', 'depolarize', 'asymmetric_depolarize', 'amplitude_damp', 'phase_damp', 'generalized_amplitude_damp', 'reset'] },
    p: { type: 'number', minimum: 0, maximum: 1 },
    p_x: { type: 'number', minimum: 0, maximum: 1 },
    p_y: { type: 'number', minimum: 0, maximum: 1 },
    p_z: { type: 'number', minimum: 0, maximum: 1 },
    gamma: { type: 'number', minimum: 0, maximum: 1 },
  },
}
const OBSERVABLE_SCHEMA = {
  type: 'object',
  description: 'A Pauli string: each qubit key (line:x, grid:row,col or named:name) mapped to X, Y or Z; unlisted qubits take the identity',
  additionalProperties: { enum: ['X', 'Y', 'Z'] },
}
const INSERT_SCHEMA = { enum: ['EARLIEST', 'NEW', 'INLINE', 'NEW_THEN_INLINE'], default: 'EARLIEST' }

const complex = ([re, im]: [number, number]) => ({ re, im })
const gcdOf = (x: number, y: number): number => (y === 0 ? x : gcdOf(y, x % y))

/** One tool: its name, what it does, its input schema (JSON Schema 2020-12), and the call that compiles or reads it: the
 *  structured result and the widget that shows it. */
import { toolOf, type Tool, type Toolbox, type Context } from './toolbox.js'
import { FLOW } from './toolboxes/flow.js'
import { KERNEL_THEOREMS, GENERATED_LEMMAS, THEOREMS } from './theorems-index.js'
import { matcherOf, PATTERNS, patternOf } from './match.js'
import { sha256, utf8, hex } from './hmac.js'
import { flowWidget } from './widgets.js'
import { cssOf, varsOf, KEY } from './theme.js'
import { LANGUAGE } from './toolboxes/language.js'
import { RAID } from './toolboxes/raid.js'
import { BILLING, usageOrderOf } from './toolboxes/billing.js'
import { LEGAL } from './toolboxes/legal.js'
import { REPOSITORY } from './toolboxes/repository.js'
import { STANDARDS_BOX } from './toolboxes/standards.js'
import { PAYLOAD, payloadDocOf, uiOf, MCP_APPS } from './toolboxes/payload.js'
import { EXTENSION } from './toolboxes/extension.js'
import { factsOf, verifyRequestsOf } from './verifiers.js'
import { CRYPTO } from './toolboxes/crypto.js'
import { blockJsonLdOf, openapiOf, OPENAPI_RESOURCE } from './standards.js'

/** A tool from its run and its widget: the widget takes exactly what the run returns, so the two cannot drift apart. */
// The tools of this host's own two toolboxes, named below; `tool` is the host-side helper until each is a file of its own.
const TREE = new Set(['leads', 'audit', 'match', 'clay', 'verify'])
const tool = <T>(spec: { name: string; description: string; inputSchema: object; run: (args: Record<string, unknown>) => T; widget: (data: T) => string }): Tool => toolOf(TREE.has(spec.name) ? 'tree' : 'google', { ...spec, run: (args) => spec.run(args) })

const QUBIT_SCHEMA = {
  oneOf: [
    { type: 'object', required: ['kind', 'row', 'col'], properties: { kind: { const: 'grid' }, row: { type: 'integer' }, col: { type: 'integer' } } },
    { type: 'object', required: ['kind', 'x'], properties: { kind: { const: 'line' }, x: { type: 'integer' } } },
    { type: 'object', required: ['kind', 'name'], properties: { kind: { const: 'named' }, name: { type: 'string' } } },
  ],
}
const OPERATION_SCHEMA = {
  type: 'object',
  required: ['gate', 'qubits'],
  properties: {
    gate: { enum: Object.keys(GATES) },
    qubits: { type: 'array', items: QUBIT_SCHEMA },
    exponent: { type: 'number', description: 'the power of the gate, as Cirq writes it: 0.5 for X**0.5, the square root of NOT' },
  },
}
const MEASURE_SCHEMA = { type: 'object', required: ['key', 'qubits'], properties: { key: { type: 'string' }, qubits: { type: 'array', items: QUBIT_SCHEMA } } }

const reject = (what: string): never => { throw new ParamError(what) }


const OWN: Tool[] = [
  tool({
    name: 'processor',
    description: 'A Google Quantum AI processor as its spec sheet states it: qubits, the grid, the two chips, and the magic-state figures.',
    inputSchema: { type: 'object', required: ['name'], properties: { name: { enum: Object.keys(DEVICES) } } },
    run: (args) => {
      const deviceName = String(args.name)
      if (deviceName !== 'Willow' && deviceName in DEVICES) {
        const device = DEVICES[deviceName as keyof typeof DEVICES]
        return { name: device.name, qubits: device.qubits, couplers: device.couplers.length, layout: 'layout' in device ? device.layout : '', ...('statedQubits' in device ? { statedQubits: device.statedQubits, statedCouplers: device.statedCouplers } : {}) }
      }
      const processor = PROCESSORS[args.name as keyof typeof PROCESSORS] ?? reject(`processor ${String(args.name)} is not described here`)
      return { name: processor.name, technology: processor.technology, qubits: processor.qubits, statedAverageConnectivity: processor.statedAverageConnectivity, typicalConnectivity: processor.typicalConnectivity, chips: processor.chips, magicStateCultivation: processor.magicStateCultivation, errorCorrectionPreprint: processor.errorCorrectionPreprint }
    },
    widget: processorWidget,
  }),
  tool({
    name: 'circuit',
    description: 'Compile a circuit from its operations, placed by an insert strategy, and simulate it. Without noise or observables: the final amplitudes, or sampled bitstrings and their histogram when there is a measurement. With noise channels (as Cirq names them) or Pauli observables: the density matrix, its basis probabilities, trace, purity and the expectation values. A device validates the circuit first.',
    inputSchema: {
      type: 'object',
      required: ['operations'],
      properties: {
        operations: { type: 'array', items: OPERATION_SCHEMA },
        insert: INSERT_SCHEMA,
        device: { enum: Object.keys(DEVICES), description: 'validate the circuit against this device first' },
        measure: MEASURE_SCHEMA,
        repetitions: { type: 'integer', minimum: 1, maximum: 10000, default: 100 },
        noise: { type: 'array', items: CHANNEL_SCHEMA, description: 'channels applied after every gate, on each of its qubits' },
        observables: { type: 'array', items: OBSERVABLE_SCHEMA },
        device_noise: { enum: ['willow_error_correction', 'willow_random_circuit_sampling'], description: 'the noise of a Willow chip, from its spec sheet medians, after every gate' },
      },
    },
    run: (args) => {
      const operations = args.operations as OperationJson[]
      const measurement = args.measure as MeasureJson | undefined
      const insert = (args.insert ?? 'EARLIEST') as InsertStrategy
      const circuit = circuitOf(operations, insert, measurement)
      if (typeof args.device === 'string') {
        const device = DEVICES[args.device as keyof typeof DEVICES] ?? reject(`device ${args.device} is not described here`)
        deviceOf(device).validateCircuit(circuit)
      }
      const channels = ((args.noise ?? []) as ChannelJson[]).map(channelOf)
      const observables = (args.observables ?? []) as Record<string, 'X' | 'Y' | 'Z'>[]
      const chip = args.device_noise === 'willow_error_correction' ? 'errorCorrection' : args.device_noise === 'willow_random_circuit_sampling' ? 'randomCircuitSampling' : undefined
      if (channels.length || observables.length || chip !== undefined) {
        if (measurement) reject('noise and observables run on the density matrix, which does not sample; remove measure, or run the measurement without noise')
        const result = new DensityMatrixSimulator().simulate(circuit, chip !== undefined ? willowNoiseOf(chip) : channels)
        return {
          qubits: result.qubits.map(keyOfQubit),
          probabilities: result.probabilities,
          trace: result.trace,
          purity: result.purity,
          expectations: observables.map((o) => expectationOf(result, o)),
        }
      }
      if (!measurement) {
        const { amplitudes, qubits } = new Simulator().simulate(circuit)
        return { qubits: qubits.map(keyOfQubit), amplitudes: amplitudes.map(complex) }
      }
      const repetitions = typeof args.repetitions === 'number' ? args.repetitions : 100
      const result = new Simulator(randomOf(JSON.stringify(args))).run(circuit, repetitions)
      return { key: measurement.key, bitstrings: result.measurements(measurement.key), histogram: Object.fromEntries(result.histogram(measurement.key)) }
    },
    widget: circuitWidget,
  }),
  tool({
    name: 'echo',
    description: 'Quantum Echoes: run the operations forward, perturb once, run them back, and return the probability that every qubit returns to 0.',
    inputSchema: {
      type: 'object',
      required: ['forward'],
      properties: { forward: { type: 'array', items: OPERATION_SCHEMA }, perturbation: OPERATION_SCHEMA },
    },
    run: (args) => {
      const forward = (args.forward as OperationJson[]).map(operationOf)
      const perturbation = args.perturbation === undefined ? undefined : operationOf(args.perturbation as OperationJson)
      return { probability: echoProbability(forward, perturbation), operations: echoCircuit(forward, perturbation).operations.length }
    },
    widget: echoWidget,
  }),
  tool({
    name: 'echo_benchmark',
    description: 'The Quantum Echoes result as Google states it: the processor, its qubits, the speedup, and the molecules.',
    inputSchema: { type: 'object', properties: {} },
    run: () => QUANTUM_ECHOES,
    widget: echoBenchmarkWidget,
  }),
  tool({
    name: 'roadmap',
    description: 'The Google Quantum AI roadmap: its six milestones, their physical-qubit scale, and which are achieved or in progress. With a milestone number, only that milestone.',
    inputSchema: { type: 'object', properties: { milestone: { type: 'integer', minimum: 1, maximum: 6 } } },
    run: (args) => {
      if (args.milestone === undefined) return { milestones: ROADMAP, applications: APPLICATIONS }
      const found = ROADMAP.filter((m) => m.number === args.milestone)
      return found.length ? { milestones: found, applications: APPLICATIONS } : reject(`milestone ${String(args.milestone)} is not on the roadmap; the milestones are 1 to 6`)
    },
    widget: roadmapWidget,
  }),
  tool({
    name: 'algorithm',
    description: 'The textbook algorithms of the Cirq page: qft and inverse_qft (on 1 to 6 qubits, from input x), phase_estimation (of θ with 1 to 8 bits), grover (two qubits, marked |00>), teleportation (the message state, sent and received), qaoa (depth 1 on the first 2 to 12 sorted qubits of the Sycamore device, the page\'s instance, with the expected cut), and shor (order finding for N from 3 to 21, the state-vector bound). Each returns its summary and a table.',
    inputSchema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { enum: ['qft', 'inverse_qft', 'phase_estimation', 'grover', 'teleportation', 'qaoa', 'shor'] },
        N: { type: 'integer', minimum: 3, maximum: 21, default: 15 },
        a: { type: 'integer', minimum: 2, default: 7 },
        sweep: { type: 'boolean', default: false, description: 'qaoa: sweep alpha and beta on the grid of the page and return the best' },
        qubits: { type: 'integer', minimum: 1, maximum: 6, default: 3 },
        input: { type: 'integer', minimum: 0, default: 0 },
        theta: { type: 'number', default: 0.234 },
        bits: { type: 'integer', minimum: 1, maximum: 8, default: 3 },
        repetitions: { type: 'integer', minimum: 1, maximum: 10000, default: 2000 },
        nodes: { type: 'integer', minimum: 2, maximum: 12, default: 12 },
        weights: { type: 'array', items: { type: 'number' }, description: 'one weight per edge of the QAOA graph; all 1 by default' },
        alpha: { type: 'number', default: 0 },
        beta: { type: 'number', default: 0 },
      },
    },
    run: (args) => {
      const name = String(args.name)
      if (name === 'qft' || name === 'inverse_qft') {
        const n = Number(args.qubits ?? 3)
        const x = Number(args.input ?? 0)
        if (!Number.isInteger(n) || n < 1 || n > 6) reject('qubits is an integer from 1 to 6')
        if (!Number.isInteger(x) || x < 0 || x >= 1 << n) reject(`input is an integer from 0 to ${(1 << n) - 1}`)
        const qs = LineQubit.range(n)
        const prep = qs.filter((_, i) => (x >> i) & 1).map((q) => applied(X, q))
        const transform = name === 'qft' ? qftOperations(qs) : inverseOperations(qftOperations(qs))
        const { amplitudes } = new Simulator().simulate(new Circuit().append([...prep, ...transform]))
        return {
          name,
          summary: [['Qubits', String(n)], ['Input |x>', String(x)], ['Transform', name === 'qft' ? 'QFT' : 'inverse QFT']],
          header: ['State', 'Amplitude', 'Probability'],
          rows: amplitudes.map(([re, im], k) => [String(k), `${re.toFixed(4)} ${im < 0 ? '−' : '+'} ${Math.abs(im).toFixed(4)}i`, `${((re * re + im * im) * 100).toFixed(2)}%`]),
        }
      }
      if (name === 'phase_estimation') {
        const theta = Number(args.theta ?? 0.234)
        const bits = Number(args.bits ?? 3)
        const repetitions = Number(args.repetitions ?? 2000)
        if (!Number.isInteger(bits) || bits < 1 || bits > 8) reject('bits is an integer from 1 to 8')
        const run = new Simulator(randomOf(JSON.stringify(args))).run(phaseEstimationCircuit(theta, bits), repetitions)
        const counts = new Map<number, number>()
        for (const b of run.measurements('m')) {
          const estimate = [...b].reduce((sum, bit, k) => sum + Number(bit) * 2 ** k, 0) / 2 ** bits
          counts.set(estimate, (counts.get(estimate) ?? 0) + 1)
        }
        const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1])
        return {
          name,
          summary: [['Eigenphase θ', String(theta)], ['Estimation bits', String(bits)], ['Most frequent estimate', String(ranked[0]?.[0] ?? '—')]],
          header: ['Estimate', 'Count', 'Share'],
          rows: ranked.map(([e, c]) => [e.toFixed(6), String(c), `${((c / repetitions) * 100).toFixed(1)}%`]),
        }
      }
      if (name === 'grover') {
        const repetitions = Number(args.repetitions ?? 100)
        const run = new Simulator(randomOf(JSON.stringify(args))).run(groverCircuit(), repetitions)
        const counts = new Map<string, number>()
        for (const b of run.measurements('result')) counts.set(b, (counts.get(b) ?? 0) + 1)
        return {
          name,
          summary: [['Marked state', '|00>'], ['Repetitions', String(repetitions)]],
          header: ['Measured', 'Count', 'Share'],
          rows: [...counts.entries()].map(([b, c]) => [`|${b}>`, String(c), `${((c / repetitions) * 100).toFixed(1)}%`]),
        }
      }
      if (name === 'teleportation') {
        const sent = new DensityMatrixSimulator().simulate(messageCircuit())
        const received = new DensityMatrixSimulator().simulate(teleportationCircuit())
        return {
          name,
          summary: [['Message', 'X**0.25 on |0>'], ['Received on', 'Bob']],
          header: ['Pauli', 'Sent', 'Received'],
          rows: (['X', 'Y', 'Z'] as const).map((p) => [p, expectationOf(sent, { 'line:0': p }).toFixed(6), expectationOf(received, { 'line:2': p }).toFixed(6)]),
        }
      }
      if (name === 'qaoa') {
        const graph = pageInstance(DEVICES.Sycamore, Number(args.nodes ?? 12))
        const weights = args.weights as number[] | undefined
        if (weights !== undefined) {
          if (weights.length !== graph.edges.length) reject(`weights needs one value per edge: ${graph.edges.length} edges`)
          graph.edges.forEach((e, i) => { e.weight = weights[i]! })
        }
        const total = graph.edges.reduce((sum, e) => sum + e.weight, 0)
        if (args.sweep === true) {
          const sweep = qaoaSweep(graph)
          return {
            name,
            summary: [['Device', 'Sycamore'], ['Nodes', String(graph.nodes.length)], ['Edges', String(graph.edges.length)], ['Best alpha', sweep.best.alpha.toFixed(4)], ['Best beta', sweep.best.beta.toFixed(4)], ['Expected cut at best', sweep.best.expectedCut.toFixed(4)], ['Random baseline', sweep.randomBaseline.toFixed(4)]],
            header: ['Edge', 'Weight'],
            rows: graph.edges.map((e) => [`${keyOf(e.a)} – ${keyOf(e.b)}`, e.weight.toFixed(2)]),
          }
        }
        const alpha = Number(args.alpha ?? 0)
        const beta = Number(args.beta ?? 0)
        const expected = qaoaExpectedCut(graph, alpha, beta)
        return {
          name,
          summary: [['Device', 'Sycamore'], ['Nodes', String(graph.nodes.length)], ['Edges', String(graph.edges.length)], ['Expected cut', expected.toFixed(4)], ['Random baseline', (total / 2).toFixed(4)]],
          header: ['Edge', 'Weight'],
          rows: graph.edges.map((e) => [`${keyOf(e.a)} – ${keyOf(e.b)}`, e.weight.toFixed(2)]),
        }
      }
      if (name === 'shor') {
        const N = Number(args.N ?? 15)
        const a = Number(args.a ?? 7)
        const repetitions = Number(args.repetitions ?? 20)
        if (!Number.isInteger(N) || N < 3 || N > 21) reject('N is an integer from 3 to 21 (the state-vector size bound)')
        if (!Number.isInteger(a) || a < 2 || a >= N || gcdOf(a, N) !== 1) reject('a must be an integer from 2 to N−1 with no common factor with N')
        const run = new Simulator(randomOf(JSON.stringify(args))).run(shorCircuit(N, a), repetitions)
        const found = shorFactors(N, a, run.measurements('m'))
        const counts = new Map<string, number>()
        for (const e of found.estimates) counts.set(e.toFixed(6), (counts.get(e.toFixed(6)) ?? 0) + 1)
        return {
          name,
          summary: [['N', String(N)], ['a', String(a)], ['Order of a mod N', found.order === null ? 'not found' : String(found.order)], ['Factors', found.factors ? `${found.factors[0]} × ${found.factors[1]}` : 'not found'], ['Prime dust', (() => { const d: number[] = []; let n = N; for (let p = 2; p * p <= n; p += 1) while (n % p === 0) { d.push(p); n /= p } if (n > 1) d.push(n); return `${d.join(' × ')} (verified: product = ${d.reduce((x, y) => x * y, 1)})` })()]],
          header: ['Measured phase', 'Count', 'Share'],
          rows: [...counts.entries()].sort((x, y) => y[1] - x[1]).map(([phase, c]) => [phase, String(c), `${((c / repetitions) * 100).toFixed(1)}%`]),
        }
      }
      return reject(`algorithm ${name} is not one of qft, inverse_qft, phase_estimation, grover, teleportation, qaoa, shor`)
    },
    widget: algorithmWidget,
  }),
  tool({
    name: 'software',
    description: 'The open-source tools of the Google Quantum AI Software page, as the page describes them. Only Cirq is implemented in this repository.',
    inputSchema: { type: 'object', properties: {} },
    run: () => ({ tools: SOFTWARE }),
    widget: softwareWidget,
  }),
  tool({
    name: 'statements',
    description: 'The statements quantumai.google, its PDFs and the quantumlib repositories make, each as the page states it: Cirq, the definition of quantum computing, progress, responsibility, the vision, the hardware and the full stack, the Willow Early Access Program, neutral atoms, the Sycamore gates, the Weber datasheet, the Quantum Echoes preprint, the campus, qsim, Qualtran, OpenFermion, the Cirq guide pages followed, the Resources, Research, journey, lab and Qubit Game pages, the QEC milestone, the APS summit pages and the sitemap. With a topic, only that one.',
    inputSchema: { type: 'object', properties: { topic: { enum: Object.keys(STATEMENTS) } } },
    run: (args) => {
      const topic = args.topic as StatementTopic | undefined
      if (topic !== undefined && !(topic in STATEMENTS)) reject(`topic ${String(topic)} is not one of ${Object.keys(STATEMENTS).join(', ')}`)
      const entries = (Object.keys(STATEMENTS) as StatementTopic[]).filter((t) => topic === undefined || t === topic)
      return { statements: entries.map((t) => ({ topic: t, text: STATEMENTS[t] })) }
    },
    widget: statementsWidget,
  }),
  tool({
    name: 'repositories',
    description: 'The repositories of the quantumlib GitHub organization, as its list states them: name, description and primary language.',
    inputSchema: { type: 'object', properties: { language: { type: 'string', description: 'only repositories whose primary language is this' } } },
    run: (args) => {
      const language = args.language === undefined ? undefined : String(args.language)
      const repositories = REPOSITORIES.filter((r) => language === undefined || r.language === language)
      return { repositories, total: REPOSITORIES.length }
    },
    widget: repositoriesWidget,
  }),
  tool({
    name: 'leads',
    description: 'Every lead on quantumai.google (every page of its sitemap, read whole), its PDFs and the quantumlib repositories, with its status (served, partial, blocked, out of scope, or open: in the sitemap and not yet followed), the tool that serves it, and the reason where it is not served. The whole list is returned; nothing is truncated.',
    inputSchema: { type: 'object', properties: { carry: { type: 'boolean', description: 'the cost of carrying the leads and what converting them to Payload documents saves; when nothing is carried the release is published as the next sequential version' }, byTheorem: { type: 'boolean', description: 'every lead addressed by the theorems, never assigned in advance: the textbook theorem sharing the most words with the lead addresses it and its example names the tool; the unaddressed stay open' }, status: { enum: ['served', 'partial', 'blocked', 'out_of_scope', 'open'] }, ids: { type: 'array', items: { type: 'string' }, description: 'the leads named, in this order: a gate answers the leads that pass through it' } } },
    run: (args) => {
      if (args.byTheorem) return addressedByTheoremOf(LEADS, TEXTBOOK_THEOREMS, EXAMPLES)
      // the cost of carrying the leads, and what converting them to Payload documents saves: a lead placed in a gate page or served by a tool is carried no more; when nothing is carried the release is published
      if (args.carry) { const g = (handle({ jsonrpc: '2.0', id: 0, method: 'tools/call', params: { name: 'configure', arguments: { kind: 'gates' } } }) as { result?: { structuredContent?: { config?: { leads?: { placed?: number; unplaced?: string[] } } } } }).result?.structuredContent?.config?.leads; const unplaced = new Set(g?.unplaced ?? []); const converted = LEADS.filter((l) => !unplaced.has(l.id) || (l.status === 'served' && l.tool)); const carriedLeads = LEADS.filter((l) => !converted.includes(l)); const bytes = JSON.stringify(LEADS).length; const perLead = bytes / Math.max(1, LEADS.length); return { leads: carriedLeads.slice(0, 50).map((l) => ({ id: l.id, status: l.status, ...(l.tool ? { tool: l.tool } : {}), statement: l.statement })), counts: { carried: carriedLeads.length, converted: converted.length, placedInGates: LEADS.length - unplaced.size, served: LEADS.filter((l) => l.status === 'served' && l.tool).length }, total: LEADS.length, bytes, perLead: Math.round(perLead), costBytes: Math.round(perLead * carriedLeads.length), savedBytes: Math.round(perLead * converted.length), release: carriedLeads.length === 0 ? 'nothing to carry: publish the next sequential version' : `${carriedLeads.length} lead(s) still carried: convert first — each lead converted to a Payload document (a gate page, a docket entry) is a lead no longer carried; the release waits`, says: 'the leads cost what the tree carries; a lead converted to a Payload document costs nothing to carry; when nothing is carried the release is published as the next sequential version (textbook_carry_release)' } }
      const status = args.status as LeadStatus | undefined
      if (status !== undefined && !['served', 'partial', 'blocked', 'out_of_scope', 'open'].includes(status)) reject(`status ${String(status)} is not one of served, partial, blocked, out_of_scope, open`)
      const ids = Array.isArray(args.ids) ? args.ids.map(String) : null
      const leads = ids ? ids.map((id) => LEADS.find((l) => l.id === id)).filter((l): l is (typeof LEADS)[number] => l !== undefined && (status === undefined || l.status === status)) : LEADS.filter((l) => status === undefined || l.status === status)
      return { leads, counts: leadCounts(), total: LEADS.length, ...(ids ? { named: ids.length, unknown: ids.filter((id) => !LEADS.some((l) => l.id === id)) } : {}) }
    },
    widget: leadsWidget,
  }),
  tool({
    name: 'quantumlib',
    description: 'The fifteen repositories of the quantumlib GitHub organization, each with what this repository implements of it: the exports of cirq.ts that stand for Cirq\'s classes, and the parts of qsim, OpenFermion, Qualtran, Stim and ReCirq the other tools emulate, named from the code that runs here. A cross-reference computed at call time, not a catalogue.',
    inputSchema: { type: 'object', properties: { repository: { type: 'string', description: 'only the repository with this name' } } },
    run: (args) => {
      const name = args.repository === undefined ? undefined : String(args.repository)
      if (name !== undefined && !REPOSITORIES.some((r) => r.name === name)) reject(`repository ${name} is not one of ${REPOSITORIES.map((r) => r.name).join(', ')}`)
      const exportsOf = (predicate: (key: string, value: unknown) => boolean): string[] => Object.entries(cirq).filter(([k, v]) => predicate(k, v)).map(([k]) => k).sort()
      const gates = exportsOf((_, v) => typeof v === 'object' && v !== null && 'arity' in v && 'matrix' in v)
      const classes = exportsOf((_, v) => typeof v === 'function' && /^class\s/.test(Function.prototype.toString.call(v)))
      const functions = exportsOf((_, v) => typeof v === 'function' && !/^class\s/.test(Function.prototype.toString.call(v)))
      const objects = exportsOf((k, v) => typeof v === 'object' && v !== null && !('arity' in v) && !gates.includes(k))
      const toolNames = TOOLS.map((t) => t.name)
      const has = (...names: string[]) => names.filter((n) => toolNames.includes(n))
      const cross: Record<string, { implementedHere: string[]; tools: string[]; note: string }> = {
        Cirq: { implementedHere: [...classes, ...objects, ...gates, ...functions], tools: has('circuit', 'algorithm', 'echo'), note: `the exports of cirq.ts: ${classes.length} classes, ${objects.length} qubit constructors, ${gates.length} gates and ${functions.length} functions, each named after the Cirq class or function it stands for` },
        qsim: { implementedHere: ['Simulator'], tools: has('circuit', 'algorithm'), note: 'the same state-vector computation, in TypeScript, bounded at 20 qubits, without qsim\'s gate fusion, single precision or vector instructions' },
        OpenFermion: { implementedHere: ['hydrogen', 'hydrogenHamiltonian'], tools: has('chemistry-simulation'), note: 'what MolecularData and jordan_wigner produce for one molecule, H₂ in STO-3G: the integrals and the Pauli-term qubit Hamiltonian, computed here and checked against the OpenFermion tutorial\'s printed energies' },
        Qualtran: { implementedHere: ['countResources', 'isClifford'], tools: has('fault-tolerant-design'), note: 'resource counts (gates, two-qubit gates, depth, T-count) read from built circuits; no bloqs, no algorithm library' },
        Stim: { implementedHere: ['repetitionCycle'], tools: has('quantum-error-correction'), note: 'the repetition code cycle is simulated as a density matrix with Toffoli corrections, not as a stabilizer tableau with measured syndromes; Stim\'s stabilizer simulation is not emulated' },
        ReCirq: { implementedHere: ['pageInstance', 'qaoaSweep', 'qaoaEstimate'], tools: has('algorithm', 'statements'), note: 'the QAOA max-cut experiment of the Cirq page is built here; the KPZ, HFVQE, QC-QMC and OTOC experiments are served as statements of their pages' },
      }
      const repositories = REPOSITORIES.filter((r) => name === undefined || r.name === name).map((r) => ({ ...r, url: `https://github.com/quantumlib/${r.name}`, ...(cross[r.name] ?? { implementedHere: [], tools: [], note: 'nothing of this repository is implemented or emulated here' }) }))
      return { organization: 'quantumlib', url: 'https://github.com/quantumlib', repositories, total: REPOSITORIES.length, emulated: REPOSITORIES.filter((r) => r.name in cross).length }
    },
    widget: quantumlibWidget,
  }),
  tool({
    name: 'quantum-error-correction',
    description: 'The three-qubit repetition code, simulated on the density matrix: a logical qubit encoded, a channel (bit_flip, phase_flip or depolarize) of probability p acting once on each data qubit, syndromes extracted and corrected by majority, and the logical error read from the simulated state against the raw error of an unencoded qubit, at the p given and over a sweep. The break-even p is bisected from the simulation; the textbook 3p² − 2p³ is reported beside it where it applies. The encoding, syndrome and correction gates are noiseless (the code-capacity model). The quantumlib QEC packages are listed as cited data.',
    inputSchema: {
      type: 'object',
      properties: {
        code: { enum: ['bit_flip', 'phase_flip'], default: 'bit_flip' },
        channel: { enum: ['bit_flip', 'phase_flip', 'depolarize'], default: 'bit_flip' },
        p: { type: 'number', minimum: 0, maximum: 1, default: 0.1 },
        logical: { enum: ['0', '1', '+', '-'], default: '0', description: 'the logical state encoded; |+⟩ and |−⟩ are eigenstates of the logical X a matched code can miss, so they show no error from it' },
        sweep: { type: 'array', items: { type: 'number', minimum: 0, maximum: 1 }, description: 'the probabilities to sweep; by default 0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6' },
      },
    },
    run: (args) => {
      const code = (args.code ?? 'bit_flip') as RepetitionCode
      const channel = (args.channel ?? 'bit_flip') as ErrorChannel
      const logical = (args.logical ?? '0') as LogicalState
      const p = Number(args.p ?? 0.1)
      if (!['bit_flip', 'phase_flip'].includes(code)) reject('code is bit_flip or phase_flip')
      if (!['bit_flip', 'phase_flip', 'depolarize'].includes(channel)) reject('channel is bit_flip, phase_flip or depolarize')
      if (!['0', '1', '+', '-'].includes(logical)) reject('logical is 0, 1, + or -')
      if (!(p >= 0 && p <= 1)) reject('p is a probability between 0 and 1')
      const grid = (args.sweep as number[] | undefined) ?? [0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6]
      if (!grid.every((q) => typeof q === 'number' && q >= 0 && q <= 1)) reject('every sweep value is a probability between 0 and 1')
      const sweep = grid.map((q) => ({ ...codePoint(code, channel, q, logical), textbook: textbookLogicalError(code, channel, logical, q) }))
      const at = { ...codePoint(code, channel, p, logical), textbook: textbookLogicalError(code, channel, logical, p) }
      const breakEven = breakEvenOf(code, channel, logical, sweep)
      const deviations = sweep.filter((s) => s.textbook !== null).map((s) => Math.abs(s.logicalError - (s.textbook as number)))
      const circuit = repetitionCycle(code, qecChannelOf(channel, p), logical)
      return {
        code, channel, logical, at, sweep, breakEven,
        helpsAtP: at.logicalError < at.physicalError,
        observed: breakEven === null
          ? `over the sweep the code ${sweep.every((s) => s.logicalError < s.physicalError) ? 'always' : 'never'} lowers the error below the unencoded qubit's`
          : `the code lowers the error below the unencoded qubit's for p below ${breakEven.toFixed(6)}, and raises it above; the crossing is bisected from simulated points`,
        textbook: { formula: '3p² − 2p³ for a matched code and channel on a logical |0⟩ or |1⟩', source: 'Nielsen & Chuang, Quantum Computation and Quantum Information, §10.1.1', maxDeviationOverSweep: deviations.length ? Math.max(...deviations) : null },
        model: 'code-capacity: the channel acts once on each data qubit; encoding, syndrome extraction, Toffoli correction and decoding are noiseless; every error is Tr of the simulated density matrix on the decoded qubit',
        circuit: { qubits: circuit.qubits.length, moments: circuit.moments.length, operations: circuit.operations.length },
        packages: REPOSITORIES.filter((r) => ['Stim', 'chromobius', 'tesseract-decoder'].includes(r.name)).map((r) => ({ ...r, url: `https://github.com/quantumlib/${r.name}`, source: 'the quantumlib repository list, as it states them' })),
      }
    },
    widget: errorCorrectionWidget,
  }),
  tool({
    name: 'chemistry-simulation',
    description: 'Molecular hydrogen in STO-3G as a variational energy evaluation on the simulator: the integrals are computed here from the published basis constants and checked against the energies the OpenFermion tutorial prints at 0.7 and 0.8 Å; the two-electron Hamiltonian is a two-qubit Pauli-term operator; the ansatz exp(−iθ Y⊗X) on the Hartree-Fock state is swept over θ, every energy an expectation value of the simulated state, and the minimum found is returned with the full-CI energy the same integrals give. A bond length in ångström, or one θ to evaluate.',
    inputSchema: {
      type: 'object',
      properties: {
        bond_length: { type: 'number', exclusiveMinimum: 0, default: 0.7414, description: 'the H–H distance in ångström; 0.7414 is the tutorial\'s' },
        theta: { type: 'number', description: 'evaluate the energy at this θ only, instead of sweeping' },
        steps: { type: 'integer', minimum: 4, default: 180, description: 'grid points of the sweep over [−π/2, π/2)' },
      },
    },
    run: (args) => {
      const bondLength = Number(args.bond_length ?? TUTORIAL_ENERGIES.bondLengthDefault)
      if (!(bondLength > 0)) reject('bond_length is a positive distance in ångström')
      const molecule = hydrogen(bondLength)
      const terms = hydrogenHamiltonian(molecule)
      const theta = args.theta === undefined ? undefined : Number(args.theta)
      if (theta !== undefined && !Number.isFinite(theta)) reject('theta is a number')
      const steps = Number(args.steps ?? 180)
      if (!Number.isInteger(steps) || steps < 4) reject('steps is an integer of at least 4')
      const vqe = theta === undefined ? vqeSweep(terms, steps) : null
      const ansatz = ansatzCircuit(theta ?? vqe!.best.theta)
      return {
        molecule,
        basis: { name: 'STO-3G', hydrogen: STO3G_H, bohrAngstrom: BOHR_ANGSTROM },
        mapping: 'two qubits: line:0 is the orbital of the spin-up electron (|0⟩ = g, |1⟩ = u), line:1 the spin-down electron\'s; the Hartree-Fock state is |00⟩; the nuclear repulsion is in the identity term',
        terms,
        ansatz: { gate: ansatz.operations[0]!.kind === 'gate' ? ansatz.operations[0]!.gate.name : '', state: 'cos θ |00⟩ + sin θ |11⟩' },
        hartreeFockFromSimulator: energyAt(terms, 0),
        vqe,
        at: theta === undefined ? null : { theta, energy: energyAt(terms, theta) },
        checks: { source: TUTORIAL_ENERGIES.source, points: tutorialChecks(), note: 'the nuclear repulsion, Hartree-Fock, full-CI and orbital energies agree with the printed figures to about 10⁻¹⁵ Ha; MP2 differs by about 4 × 10⁻⁷ Ha at both lengths, and the page states no convergence settings for its MP2' },
        units: 'hartree; bond length in ångström',
      }
    },
    widget: chemistryWidget,
  }),
  tool({
    name: 'fault-tolerant-design',
    description: 'Resource counts read from the circuits this repository builds: the QFT on n qubits, Grover, teleportation, Shor for N up to 21, the QAOA instance and the repetition-code cycle. For each: gates by name, two-qubit gates, depth in moments, and the T-count of the gates whose Clifford+T cost is stated (Toffoli 7, T 1, controlled-S 3; Cliffordness computed from each unitary). Rotations and undecomposed gates are listed and left uncounted, and the count says whether it is complete. Qualtran is the cited library for the general case.',
    inputSchema: {
      type: 'object',
      properties: {
        circuit: { enum: ['qft', 'grover', 'teleportation', 'shor', 'qaoa', 'qec', 'all'], default: 'all' },
        qubits: { type: 'integer', minimum: 1, maximum: 6, default: 3, description: 'qft: the register size' },
        N: { type: 'integer', minimum: 3, maximum: 21, default: 15, description: 'shor: the modulus' },
        a: { type: 'integer', minimum: 2, default: 7, description: 'shor: the base' },
        nodes: { type: 'integer', minimum: 2, maximum: 12, default: 12, description: 'qaoa: the nodes of the page\'s instance' },
      },
    },
    run: (args) => {
      const which = String(args.circuit ?? 'all')
      const n = Number(args.qubits ?? 3)
      const N = Number(args.N ?? 15)
      const a = Number(args.a ?? 7)
      const nodes = Number(args.nodes ?? 12)
      if (!Number.isInteger(n) || n < 1 || n > 6) reject('qubits is an integer from 1 to 6')
      if (!Number.isInteger(N) || N < 3 || N > 21) reject('N is an integer from 3 to 21')
      if (!Number.isInteger(a) || a < 2 || a >= N || gcdOf(a, N) !== 1) reject('a must be an integer from 2 to N−1 with no common factor with N')
      if (!Number.isInteger(nodes) || nodes < 2 || nodes > 12) reject('nodes is an integer from 2 to 12')
      const builders: Record<string, () => Circuit> = {
        qft: () => new Circuit().append(qftOperations(LineQubit.range(n))),
        grover: groverCircuit,
        teleportation: teleportationCircuit,
        shor: () => shorCircuit(N, a),
        qaoa: () => qaoaCircuit(pageInstance(DEVICES.Sycamore, nodes), 0.5, 0.25),
        qec: () => repetitionCycle('bit_flip', { name: 'bit_flip', p: 0.1 }, '0'),
      }
      if (which !== 'all' && !(which in builders)) reject(`circuit ${which} is not one of ${Object.keys(builders).join(', ')}, all`)
      const names = which === 'all' ? Object.keys(builders) : [which]
      const circuits = names.map((name) => ({ name: name === 'qft' ? `qft on ${n} qubits` : name === 'shor' ? `shor N=${N} a=${a}` : name === 'qaoa' ? `qaoa on ${nodes} nodes (alpha = 0.5, beta = 0.25)` : name === 'qec' ? 'repetition code cycle (bit flip, p = 0.1)' : name, count: countResources(builders[name]!()) }))
      return {
        circuits,
        costs: {
          toffoli: { tCount: 7, source: 'Nielsen & Chuang, Quantum Computation and Quantum Information, figure 4.9; Amy, Maslov, Mosca, Roetteler, IEEE TCAD 32, 818 (2013)' },
          t: { tCount: 1, source: 'T = Z**0.25; X**0.25 = H·T·H' },
          controlled_s: { tCount: 3, source: 'CS = (T⊗T)·CNOT·(I⊗T†)·CNOT, verified as a matrix product in counting.test.ts' },
          clifford: `computed from each unitary: it conjugates every Pauli string to a Pauli string, checked up to ${CLIFFORD_CHECK_ARITY} qubits`,
          uncounted: 'arbitrary-angle rotations (CZ**t at other t, ZZ**t, exp(−iθP)) and gates not decomposed here (Shor\'s modular multiplications) are listed, not costed; no synthesis figure is invented',
        },
        library: { name: 'Qualtran', description: REPOSITORIES.find((r) => r.name === 'Qualtran')!.description, url: 'https://github.com/quantumlib/Qualtran', note: 'the quantumlib library for resource estimation of fault-tolerant algorithms; not implemented here' },
      }
    },
    widget: resourcesWidget,
  }),
  tool({
    name: 'audit',
    description: 'The surface audits itself through tools/call: every tool has a schema and an example, every documented example replays as documented, every served lead names a served tool, and the error paths answer as JSON-RPC requires. Each check carries its evidence; a failed check is a lead, not a ruling.',
    inputSchema: { type: 'object', properties: { entropy: { type: 'object', description: 'the vacuum-gravity entropy cleaner: file texts by path (the client reads them); every finding — baked data, a typed path, a cap, a clock in a pure module, a line repeated across files, a note to self, an address — becomes a lead; findings of one address fuse into one lead; the gravity is the fold of the addresses' }, difference: { type: 'object', description: 'two named sets { a: { name, members }, b: { name, members }, config? }: every member on one side only becomes a lead to explore and to config, agnostic of what the members name, counted by textbook_difference_leads' }, security: { type: 'object', description: 'the security audit from the client and the developer perspectives merged as one: { client: { hosts: [{ host, status, headers, optionsStatus?, writeWithoutToken?, audit? }], payloadMcp? }, developer: { vulnerabilities, leaks, envExampleValueless, access, hooks, signing, theorems } } — the measurements a client script took' }, errors: { type: 'array', items: { type: 'string' }, description: 'error texts: each matched to the remedy manual work taught (ERROR_REMEDIES), unmatched ones leads that teach the next row' }, fallbacks: { type: 'boolean', description: 'the fallback combinations (correction ↔ handling, the involution) and the adapters each falls back to' }, access: { type: 'boolean', description: 'the access audit from every perspective — the public reader at the default domain, a licensed tenant\'s users at theirs, the operator, an MCP client with a key, the developer in the generated code, the licence and the law — over the generated collections, hooks and scopes: each check names who may, the hook that guards it, what it costs, the licence clause it enacts and the legal fact behind it; the quantum advantage measured unlimited and without interaction among them' } } },
    run: (args) => { if (args.access) return accessAuditOf(CONTEXT); if (args.entropy && typeof args.entropy === 'object') return entropyOf(args.entropy as Record<string, string>); if (args.security && typeof args.security === 'object') { const s = args.security as { client: Parameters<typeof securityOf>[0]; developer: Parameters<typeof securityOf>[1] }; return securityOf(s.client, s.developer) } if (Array.isArray(args.errors)) return { ...remediesOf(args.errors.map(String)), fallback: handleOrCorrect(args.errors.map(String), false, 'correction') }; if (args.fallbacks) return { fallbacks: FALLBACKS, adapters: FALLBACK_ADAPTERS, involution: 'σ: correction ↔ handling; σ∘σ = id (textbook_fallback_involution)', example: handleOrCorrect(['no majority'], false), says: 'the fallback combinations and adapters declared, so the theorems compute and the gate cross-checks them on every host' }; if (args.difference && typeof args.difference === 'object') { const d = args.difference as { a: { name: string; members: string[] }; b: { name: string; members: string[] }; config?: string | null }; return differencesOf(d.a, d.b, { config: d.config ?? null }) } const was = auditing; auditing = true; try { return auditOf(handle, EXAMPLES, LEADS, TOOLBOXES) } finally { auditing = was } },
    widget: (d: any) => ('gravity' in d && !('fallback' in d) ? entropyWidget(d) : 'sizes' in d || 'fallback' in d ? leadsWidget({ leads: d.leads, counts: { open: d.leads.length }, total: d.leads.length }) : 'perspectives' in d ? leadsWidget({ leads: d.checks.map((c: { id: string; passed: boolean; evidence: string; perspective: string }) => ({ id: c.id, status: c.passed ? 'served' : 'open', tool: c.perspective, statement: c.evidence })), counts: { served: d.passed, open: d.failed }, total: d.total }) : 'fallbacks' in d ? leadsWidget({ leads: d.fallbacks.map((f: { failure: string; involution: string; handling: string }) => ({ id: f.failure, status: 'served', tool: f.involution, statement: f.handling })), counts: { served: d.fallbacks.length }, total: d.fallbacks.length }) : auditWidget(d)),
  }),
  tool({
    name: 'match',
    description: 'Any statement, matched against everything the surface can do. served: a call answers it and is returned. impossible: the surface proves it cannot, from a schema bound the statement exceeds, a lead whose reason says why, or the handler\'s own refusal; the cluster then names the served possibilities around it and verify names the live sources the client\'s MCP can check. unknown: nothing matches, and the statement comes back as a new lead to develop.',
    inputSchema: { type: 'object', required: ['statement'], properties: { statement: { type: 'string', description: 'any prompt or statement; Glagolitic numerals are read as integers' }, locale: { type: 'string', enum: Object.keys(LOCALES), description: 'the language of the statement, translated to English by vocabulary offline before the match; the verdict is given back in it' } } },
    run: (args) => matchOf(String(args.statement ?? ''), handle, EXAMPLES, LEADS, args.locale === undefined ? undefined : String(args.locale)),
    widget: matchWidget,
  }),
  tool({
    name: 'clay',
    description: 'The Clay register recomputed in exact integer arithmetic: the Lean definitions of Qpu/Clay.lean and its imports ported one for one, every relation_N statement parsed and evaluated, each side\'s value and the bit width it needs reported. What the Lean kernel accepted by rfl, redone with + − × ÷ on naturals only, so a small machine can redo the same sums and compare addresses. Nothing here is a proof of an open problem: the relations are identities between the unit\'s own constants.',
    inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'one relation, e.g. relation_15; omit for all' }, technique: { type: 'string', enum: ['reflection'], description: 'the register read by the σ-reflection technique: every value\'s vortex seed, reflection and trinities, the reflecting pairs, the fixed and the tuned; with unit, the unit\'s sequence answers compared' }, unit: { type: 'array', items: { type: 'object' }, description: 'the unit\'s run_sequence answers per value ({ value, answer | refusal })' } } },
    run: (args) => {
      const all = recomputeClay()
      if (args.technique === 'reflection') {
        const reading = reflectionOfRegister(all.relations)
        const unit = Array.isArray(args.unit) ? (args.unit as { value: number; answer?: { seed?: number; reflection?: number; fixed?: boolean }; refusal?: string }[]) : []
        const compared = unit.map((u) => { const mine = reading.readings.find((r) => r.value === u.value); return { value: u.value, tree: mine ? { seed: mine.seed, reflection: mine.reflection } : null, unit: u.answer ? { seed: u.answer.seed, reflection: u.answer.reflection } : null, refusal: u.refusal ?? null, agree: !!mine && !!u.answer && u.answer.seed === mine.seed && u.answer.reflection === mine.reflection } })
        const disagreements = compared.filter((c) => c.unit && !c.agree)
        return { ...all, technique: 'reflection', pairsCount: reading.pairs.length, fixedCount: reading.fixed.length, tunedCount: reading.tuned.length, seeds: Object.keys(reading.bySeed).length, unitAsked: compared.length, unitAgree: compared.filter((c) => c.agree).length, unitDisagree: disagreements.length, unitRefused: compared.filter((c) => c.refusal).length, ...reading, compared, unitPlan: [...new Set(reading.readings.map((r) => r.value))].map((value) => ({ name: 'run_sequence', arguments: { input: value } })), leads: disagreements.map((d) => ({ id: `clay-sequence-${d.value}`, source: 'uuidna.com/mcp run_sequence', statement: `the unit reads ${d.value} as seed ${d.unit?.seed} reflection ${d.unit?.reflection}; this tree reads seed ${d.tree?.seed} reflection ${d.tree?.reflection}`, status: 'open', reason: 'two readings of one value: the digital root is decidable, so one of the two is wrong and the kernel can say which' })) }
      }
      if (args.name) { const r = all.relations.find((x) => x.name === args.name); if (!r) throw new Error(`${String(args.name)} is not one of ${all.relations.map((x) => x.name).join(', ')}`); return { ...all, relations: [r] } }
      return all
    },
    widget: clayWidget,
  }),
  tool({
    name: 'verify',
    description: 'Cheap verification of one UUID: its seal (the version nibble the other 31 nibbles decide, one modular power, no content needed), its content (one fold), and its neighbours in a chain (the predecessor it names and the successor that names it). Each check is independent; a check without its input is not decided rather than passed.',
    inputSchema: { type: 'object', required: ['uuid'], properties: { uuid: { type: 'string', description: 'the UUID to verify' }, content: { type: 'string', description: 'the text the UUID should be the address of' }, prev: { type: 'object', properties: { id: { type: 'string' } }, description: 'the predecessor in the chain' }, self: { type: 'object', properties: { prev: { type: 'string' } }, description: 'what this entry names as its predecessor' }, next: { type: 'object', properties: { id: { type: 'string' }, prev: { type: 'string' } }, description: 'the successor in the chain' } } },
    run: (args) => verifyOf(String(args.uuid ?? ''), typeof args.content === 'string' ? args.content : undefined, args.prev as { id: string } | undefined, args.next as { id: string; prev?: string } | undefined, args.self as { prev?: string } | undefined),
    widget: verifyWidget,
  }),
]

/** Results by block address, once per process: the memory of the balancer. */
const BALANCER = new Map<string, { structured: unknown; widget: string }>()
/** The blocks teleported into this balancer by a client (computed by another process), so a snapshot can leave only the new ones. */
const TELEPORTED = new Set<string>()
let TELEPORT_HITS = 0
/** The balancer's blocks as data, for a client to carry to another process: all of them, or only those this process computed. Pure. */
export const balancerSnapshot = (p: { onlyNew?: boolean } = {}): { address: string; structured: unknown; widget: string }[] => [...BALANCER.entries()].filter(([a]) => !p.onlyNew || !TELEPORTED.has(a)).map(([address, v]) => ({ address, ...v }))
/** Blocks computed elsewhere, teleported into this balancer: a block already here is kept (first computed wins); returns how many arrived. Pure. */
export const balancerLoad = (blocks: readonly { address: string; structured: unknown; widget: string }[]): number => { let n = 0; for (const b of blocks) { if (typeof b.address !== 'string' || BALANCER.has(b.address)) continue; BALANCER.set(b.address, { structured: b.structured, widget: b.widget }); TELEPORTED.add(b.address); n += 1 } return n }
/** Observability: per tool, how often it was asked, how often it computed (a miss), how long the misses took, how many bytes they produced. */
const OBSERVED = new Map<string, { calls: number; misses: number; ms: number; bytes: number }>()
const NESTED: number[] = []

/** The computable metrics of the tree, in real time: what the registries, the kernel's index and one audit say right now. */
type RunArtefacts = { advantageByUnit?: unknown; e2e?: { combos?: number; copies?: number; involutions?: number; outcomes?: Record<string, number>; competition?: { saved?: number; msMajority?: number; winners?: Record<string, number> } }; coins?: { calls: number; coins: number; byDoor: Record<string, number>; gated: number; unclean: number }; receipt?: { steps?: { name: string; status: string; ms: number }[] }; sizes?: Record<string, number>; discovery?: { hosts?: { kind: string; detected: string }[]; doors?: unknown[]; capabilities?: Record<string, string[]> }; verification?: { summary?: Record<string, { requests: number; ok: number; contracted: number; uncontracted: number }> }; readiness?: { classes?: { served: number; refuted: number; trial: number }; readiness?: { ready: boolean }; border?: { doors?: unknown[]; sealedBy?: string[] } }; repository?: { branches?: { agree: string[]; local: number }; tags?: { agree: string[]; local: number; mismatch: string[] }; leads?: unknown[] }; legal?: { claims?: number; verdicts?: Record<string, number>; violations?: number; refusals?: number; securityPassed?: number; securityTotal?: number; id?: string }; docket?: { entries?: number; root?: string | null; mirrors?: number }; receipts?: { count?: number; last?: string | null } }
/** What the run's artefacts add to the metrics: textbook APIs autodiscovered and covered, verification on public datasets, the border, the repository watched, the legal audit, the RAID's signalling (docket entries chained to a root), the receipt chain. */
const coverageOf = (a: RunArtefacts): Record<string, unknown> => {
  // the load: a block is paid once when computed (a miss of the balancer, a coin at a gated door); every re-ask is a teleport, free — the cache by address here, the involution (304 by content hash) at the edge
  const calls = [...OBSERVED.values()].reduce((n, o) => n + o.calls, 0), misses = [...OBSERVED.values()].reduce((n, o) => n + o.misses, 0)
  const load = { paid: misses, free: calls - misses + (a.e2e?.involutions ?? 0), involutions: a.e2e?.involutions ?? 0, coins: a.coins?.coins ?? 0, a432: { key: KEY, harmonics: Object.keys(varsOf(uuidOf('a432'))).length, stylesheetBytes: cssOf().length, served: 'the shell cache, immutable: the harmonic strings of every block (its custom properties from its UUID alone, the reflected harmonic and the drift\'s prime dust among them) cost the device nothing and the edge nothing' }, note: 'paid: computations (balancer misses); free: answers by address (balancer hits) and by involution (304 at the edge); the coins set the entanglement once, the teleports are free until the load is paid again' }
  const v = Object.values(a.verification?.summary ?? {})
  const sum = (k: 'requests' | 'ok' | 'contracted' | 'uncontracted') => v.reduce((n, s) => n + (s[k] ?? 0), 0)
  const hosts = a.discovery?.hosts ?? []
  return {
    load,
    discoveredHosts: hosts.length, hostsWithContract: hosts.filter((h) => /^openapi|json index|oai-pmh|graphql|mcp tools/.test(h.detected)).length, discoveredDoors: a.discovery?.doors?.length ?? 0, capabilities: Object.fromEntries(Object.entries(a.discovery?.capabilities ?? {}).map(([k, v]) => [k, v.length])),
    verificationRequests: sum('requests'), verificationReachable: sum('ok'), verificationContracted: sum('contracted'), verificationOutsideContract: sum('uncontracted'), verificationReachableRatio: sum('requests') ? Number((sum('ok') / sum('requests')).toFixed(3)) : null,
    readinessClasses: a.readiness?.classes ?? null, ready: a.readiness?.readiness?.ready ?? null, borderDoors: a.readiness?.border?.doors?.length ?? 0, borderSealedBy: a.readiness?.border?.sealedBy?.length ?? 0,
    repositoryBranchesAgree: a.repository?.branches ? `${a.repository.branches.agree.length}/${a.repository.branches.local}` : null, repositoryTagsAgree: a.repository?.tags ? `${a.repository.tags.agree.length}/${a.repository.tags.local}` : null, repositoryTagsMoved: a.repository?.tags?.mismatch.length ?? 0, repositoryLeads: a.repository?.leads?.length ?? 0,
    legalClaims: a.legal?.claims ?? 0, legalVerdicts: a.legal?.verdicts ?? null, legalViolations: a.legal?.violations ?? 0, legalRefusals: a.legal?.refusals ?? 0, legalSecurity: a.legal ? `${a.legal.securityPassed}/${a.legal.securityTotal}` : null, legalAudit: a.legal?.id ?? null,
    // the coins paid to the unit at the wire, accounted by this payer from every answer; the fibonacci source the unit names is recorded as it answers
    coinsPaid: a.coins?.coins ?? 0, coinCalls: a.coins?.calls ?? 0, coinsByDoor: a.coins?.byDoor ?? null, coinsUnclean: a.coins?.unclean ?? 0, coinsPerSettledLead: a.coins && a.readiness?.classes ? Number((a.coins.coins / Math.max(1, a.readiness.classes.served + a.readiness.classes.refuted)).toFixed(3)) : null,
    docketEntries: a.docket?.entries ?? 0, docketRoot: a.docket?.root ?? null, docketMirrors: a.docket?.mirrors ?? 0, receipts: a.receipts?.count ?? 0, lastReceipt: a.receipts?.last ?? null,
    // verbosity: how many bytes each artefact carries; the pages are read by people, the json by tools — both are counted, neither capped
    verbosityBytes: a.sizes ?? null, verbosityTotalBytes: a.sizes ? Object.values(a.sizes).reduce((n, b) => n + b, 0) : null,
    // performance per cost unit: the cost units are milliseconds of the flow and requests to other hosts; the yield is settled leads
    stepMs: a.receipt?.steps ? Object.fromEntries(a.receipt.steps.filter((s) => s.status !== 'skipped').map((s) => [s.name, s.ms])) : null,
    flowMs: a.receipt?.steps?.reduce((n, s) => n + s.ms, 0) ?? null,
    msPerVerificationRequest: sum('requests') && a.receipt?.steps ? Number(((a.receipt.steps.find((s) => s.name === 'verify')?.ms ?? 0) / sum('requests')).toFixed(1)) : null,
    requestsPerSettledLead: a.readiness?.classes && sum('requests') ? Number((sum('requests') / Math.max(1, a.readiness.classes.served + a.readiness.classes.refuted)).toFixed(2)) : null,
    msPerSettledLead: a.readiness?.classes && a.receipt?.steps ? Number((a.receipt.steps.reduce((n, s) => n + s.ms, 0) / Math.max(1, a.readiness.classes.served + a.readiness.classes.refuted)).toFixed(1)) : null,
  }
}
// The audit replays every example, the metrics example among them; metrics inside an audit must not start another audit.
let auditing = false
const auditNow = (): { total: number; passed: number; failed: number } | null => { if (auditing) return null; auditing = true; try { const a = auditOf(handle, EXAMPLES, LEADS, TOOLBOXES); return { total: a.total, passed: a.passed, failed: a.failed } } finally { auditing = false } }
const metricsOf = (artefacts: RunArtefacts = {}): Record<string, unknown> => {
  const audit = auditNow()
  const byStatus: Record<string, number> = {}; for (const l of LEADS) byStatus[l.status] = (byStatus[l.status] ?? 0) + 1
  const backed = EXAMPLES.filter((e) => e.theorem)
  return {
    tools: TOOLS.length, toolboxes: TOOLBOXES.length, patterns: PATTERNS.length, patternsRecognised: EXAMPLES.filter((e) => e.tool === 'match' && typeof e.arguments.statement === 'string' && patternOf(e.arguments.statement)).length, examples: EXAMPLES.length, examplesBackedByTheorems: backed.length, examplesBackedRatio: Number((backed.length / EXAMPLES.length).toFixed(3)),
    theoremsKernel: KERNEL_THEOREMS, theoremsHandWritten: THEOREMS.length, lemmasGenerated: GENERATED_LEMMAS, leads: LEADS.length, leadsByStatus: byStatus,
    auditChecks: audit?.total ?? null, auditPassed: audit?.passed ?? null, auditFailed: audit?.failed ?? null, auditNested: audit === null, selftests: TOOLBOXES.map((b) => b.name), balancer: BALANCER.size, license: LICENSE.spdx, at: new Date().toISOString(),
    // observability of this process: calls served from memory against computed, and where the computed milliseconds went
    balancerTeleported: TELEPORTED.size, balancerTeleportHits: TELEPORT_HITS, toolCalls: [...OBSERVED.values()].reduce((n, o) => n + o.calls, 0), toolMisses: [...OBSERVED.values()].reduce((n, o) => n + o.misses, 0), toolMs: [...OBSERVED.values()].reduce((n, o) => n + o.ms, 0),
    slowestTools: [...OBSERVED.entries()].sort((x, y) => y[1].ms - x[1].ms).slice(0, 6).map(([name, o]) => `${name} ${o.ms} ms / ${o.misses} computed / ${o.calls} asked / ${o.bytes} bytes`),
    msPerComputedCall: (() => { const m = [...OBSERVED.values()].reduce((n, o) => n + o.misses, 0); return m ? Number(([...OBSERVED.values()].reduce((n, o) => n + o.ms, 0) / m).toFixed(1)) : null })(),
    ...coverageOf(artefacts),
    advantageByUnit: artefacts.advantageByUnit ?? null, gateCombos: artefacts.e2e?.combos ?? null, gateCopies: artefacts.e2e?.copies ?? null, gateInvolutions: artefacts.e2e?.involutions ?? null, gateOutcomes: artefacts.e2e?.outcomes ?? null, gateMsSaved: artefacts.e2e?.competition?.saved ?? null, gateWinners: artefacts.e2e?.competition?.winners ?? null,
    // the gate's own advantage as a magnitude, uncapped: the copies proven by hash (304, nothing computed) against the copies recomputed; when every copy is an involution the ratio has no bound and says so
    gateAdvantage: advantageOf(artefacts.e2e?.copies ?? 0, artefacts.e2e?.involutions ?? 0),
    // the usage billed complete: the tokens of the whole tools/list, the bits the tools computed in this process, their time, the coins, what the gate and the unit saved
    usage: (() => { const bill = billOf({ tokens: Math.ceil(JSON.stringify(TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }))).length / 4), bits: [...OBSERVED.values()].reduce((n, o) => n + o.bytes, 0) * 8, ms: [...OBSERVED.values()].reduce((n, o) => n + o.ms, 0), coins: artefacts.coins?.coins ?? 0, saved: { bits: Number((artefacts.advantageByUnit as { bitsSaved?: number } | null | undefined)?.bitsSaved ?? 0), ms: artefacts.e2e?.competition?.saved ?? 0 } }); return { ...bill, order: usageOrderOf([...OBSERVED.values()].reduce((n, o) => n + o.calls, 0), 'eur', { kWh: bill.energy.kWh, tariffEurPerKwh: bill.energy.tariffEurPerKwh }) } })(),
  }
}
const metrics = toolOf('tree', { name: 'metrics', description: 'The computable metrics of this tree in real time: tools and toolboxes, examples and how many name the kernel-accepted theorem that makes them true, the kernel\'s theorem counts from its own index, leads by status, the audit\'s checks, the balancer\'s memory. Quality is proven by theorems, not textbook examples; this is the measure of how far that holds.', inputSchema: { type: 'object', properties: { artefacts: { type: 'object', description: 'the run\'s artefacts the client read: discovery, verification, readiness, repository, legal, docket, receipts; without them the tree\'s own counts alone' } } }, run: (args) => metricsOf((args.artefacts ?? {}) as RunArtefacts), widget: flowWidget })

/** The textbook as an adapter: every example categorised for reuse — by toolbox, by tool, by the theorem that backs it, by the
 * theorem's module — and any example replayed by id (the balancer makes a replay free). Quality is proven by theorems; the
 * textbook is where the examples wait, respected, each a lead for its theorem. */
const textbook = toolOf('tree', {
  name: 'textbook',
  description: 'The QPU textbook as an adapter: every example categorised for reuse — by toolbox, by tool, by the kernel-accepted theorem that backs it, by that theorem\'s module — and, with reuse: <example id>, that example replayed and its result returned. The categories are computed from the registries, never written by hand.',
  inputSchema: { type: 'object', properties: { verify: { type: 'boolean', description: 'the wave over the textbook: every example\'s verification requests on public datasets and APIs, for any client device to fetch' }, example: { type: 'string', description: 'with verify: one example only, so a device at the edge walks the textbook within the Worker\'s budget' }, results: { type: 'array', items: { type: 'object' }, description: 'the requests fetched (url, status, ok, contracted), joined back by url and sealed' }, reuse: { type: 'string', description: 'an example id to replay' }, category: { type: 'string', enum: ['toolbox', 'tool', 'theorem', 'module'], description: 'one category to list; omit for all' } } },
  run: (args) => {
    const boxOf = new Map(TOOLBOXES.flatMap((b) => b.tools.map((t) => [t.name, b.name] as const)))
    const group = <K extends string>(key: (e: (typeof EXAMPLES)[number]) => K | null) => { const out: Record<string, string[]> = {}; for (const e of EXAMPLES) { const k = key(e); if (k !== null) (out[k] ??= []).push(e.id) } return out }
    const categories = {
      toolbox: group((e) => boxOf.get(e.tool) ?? 'none'),
      tool: group((e) => e.tool),
      theorem: group((e) => e.theorem ?? 'none yet: a lead for a theorem'),
      module: group((e) => (e.theorem ? THEOREMS.find((t) => t.key === e.theorem)?.module ?? 'unknown' : null)),
    }
    if (typeof args.reuse === 'string') {
      const e = EXAMPLES.find((x) => x.id === args.reuse)
      if (!e) throw new Error(`no example ${args.reuse}; the textbook has ${EXAMPLES.map((x) => x.id).join(', ')}`)
      const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } }) as { result?: { structuredContent: unknown }; error?: { message: string } }
      if (r.error) throw new Error(r.error.message)
      const why = e.expect(r.result!.structuredContent)
      return { reused: e.id, tool: e.tool, toolbox: boxOf.get(e.tool) ?? 'none', theorem: e.theorem ?? null, shows: e.shows, asDocumented: why === null, why, result: r.result!.structuredContent }
    }
    // the wave over the textbook: every example's statement emits its verification requests through the match tool (the leads it
    // names and their facts), deduplicated by url; results fetched by any client device are joined back by url, so the wave the
    // flow already fetched costs nothing more; the outcome is sealed by its content address
    if (args.verify === true || Array.isArray(args.results)) {
      const match = matcherOf(handle, EXAMPLES, LEADS)
      // one example at a time when asked: a device at the edge walks the textbook example by example within the Worker's budget
      const chosenExamples = typeof args.example === 'string' ? EXAMPLES.filter((e) => e.id === args.example) : EXAMPLES
      if (typeof args.example === 'string' && !chosenExamples.length) throw new Error(`no example ${args.example}`)
      // the textbook verifies what each example states: the facts of its own sentence and arguments, not of every lead that shares a word with it (that asked 2,946 requests and 20 s of matching for 68 examples)
      const perExample = chosenExamples.map((e) => ({ id: e.id, tool: e.tool, theorem: e.theorem ?? null, requests: factsOf({ id: e.id, source: 'statement', statement: `${e.shows} ${JSON.stringify(e.arguments)}`, status: 'open' }).flatMap(verifyRequestsOf).map((r) => ({ verifier: r.verifier, url: r.url, check: r.check })) }))
      void match
      const requests = new Map<string, { verifier: string; url: string; check: string; examples: string[] }>()
      for (const ex of perExample) for (const r of ex.requests) { const cur = requests.get(r.url) ?? { ...r, examples: [] }; if (!cur.examples.includes(ex.id)) cur.examples.push(ex.id); requests.set(r.url, cur) }
      if (!Array.isArray(args.results)) return { phase: 'requests' as const, examples: chosenExamples.length, withRequests: perExample.filter((x) => x.requests.length).length, provenByTheorem: perExample.filter((x) => x.theorem).length, requests: requests.size, requestList: [...requests.values()], compliance: 'GET only, free public sources, a named user agent, no credential, a timeout on every request, each request checked against the host\'s discovered contract; nothing is written anywhere by this wave' }
      const results = args.results as { url: string; status: number; ok: boolean; contracted?: string }[]
      const byUrl = new Map(results.map((r) => [r.url, r]))
      const verified = perExample.map((ex) => { const rs = ex.requests.map((r) => byUrl.get(r.url)); const reachable = rs.filter((r) => r?.ok).length; const unfetched = rs.filter((r) => !r).length; return { id: ex.id, tool: ex.tool, theorem: ex.theorem, requests: ex.requests.length, reachable, unreachable: ex.requests.length - reachable - unfetched, unfetched, contracted: rs.filter((r) => r?.contracted === 'yes').length, state: ex.theorem ? 'proven' : ex.requests.length === 0 ? 'no public source named' : unfetched === ex.requests.length ? 'unfetched' : reachable === ex.requests.length ? 'verified online' : reachable ? 'partly reachable' : 'unreachable' } })
      const content = JSON.stringify({ verified, results: results.map((r) => [r.url, r.status]) })
      const states = verified.reduce<Record<string, number>>((acc, v) => ({ ...acc, [v.state]: (acc[v.state] ?? 0) + 1 }), {})
      return { phase: 'verified' as const, id: uuidOf(content), sha256: hex(sha256(utf8(content))), examples: chosenExamples.length, requests: requests.size, fetched: [...requests.keys()].filter((u) => byUrl.has(u)).length, ...Object.fromEntries(Object.entries(states).map(([k, v]) => [`state:${k}`, v])), states, verified }
    }
    const chosen = typeof args.category === 'string' ? { [args.category]: categories[args.category as keyof typeof categories] } : categories
    return { examples: EXAMPLES.length, backedByTheorems: EXAMPLES.filter((e) => e.theorem).length, categories: Object.keys(chosen).length, ...Object.fromEntries(Object.entries(chosen).map(([k, v]) => [`${k}Count`, Object.keys(v).length])), textbook: chosen }
  },
  widget: flowWidget,
})

/** The UI as CSS, served: the stylesheet from the key and, for a UUID, the custom properties its block root carries. */
const css = toolOf('tree', {
  name: 'css',
  description: 'The quantum UI as CSS alone: the stylesheet derived from the key 432 (the harmonics, and the rules that draw every block from its own custom properties with no script, motion only where the device allows it, off-screen blocks at no cost) and, for a uuid, the custom properties its block root carries (hue, CMYK, accent, tail colour and angle, the 9-vortex seed and period). Computed once; a device renders at the cost of CSS.',
  inputSchema: { type: 'object', properties: { uuid: { type: 'string', description: 'a UUID whose block variables to compute' } } },
  run: (args) => { const stylesheet = cssOf(); const vars = typeof args.uuid === 'string' ? varsOf(args.uuid) : null; return { key: KEY, bytes: stylesheet.length, rules: (stylesheet.match(/\{/g) ?? []).length, variables: vars ? Object.keys(vars).length : 0, script: false, uuid: typeof args.uuid === 'string' ? args.uuid : null, vars, stylesheet } },
  widget: flowWidget,
})

/** A bounded tool laid out whole: every value each property admits (an enum, a boolean, an integer range, the ends of a
 * numeric bound, the textbook's values where a string is free), every combination of them with its block address and its
 * walk page, rendered as a grid of cells each drawn by its own UUID's CSS — so the user's click in the UI is the decision,
 * final, and nothing is computed until it is made. */
type Facet = { property: string; kind: 'enum' | 'boolean' | 'range' | 'textbook' | 'free'; required: boolean; values: unknown[]; domain: string; space: number }
const facetsOf = (name: string): { facets: Facet[]; tool: Tool | undefined } => {
  const tool = TOOLS.find((t) => t.name === name) as (Tool & { inputSchema: { properties?: Record<string, { type?: string; enum?: unknown[]; minimum?: number; maximum?: number }>; required?: string[] } }) | undefined
  if (!tool) return { facets: [], tool: undefined }
  const props = tool.inputSchema.properties ?? {}; const required = new Set(tool.inputSchema.required ?? [])
  const textbook = (prop: string): unknown[] => { const vals: unknown[] = []; for (const e of EXAMPLES) if (e.tool === name && prop in e.arguments) { const v = e.arguments[prop]; if (!vals.some((x) => JSON.stringify(x) === JSON.stringify(v))) vals.push(v) } return vals }
  const facets: Facet[] = Object.entries(props).filter(([prop]) => prop !== 'selftest').map(([prop, spec]) => {
    const tb = textbook(prop)
    if (Array.isArray(spec.enum)) return { property: prop, kind: 'enum' as const, required: required.has(prop), values: spec.enum, domain: `one of ${spec.enum.length}`, space: spec.enum.length }
    if (spec.type === 'boolean') return { property: prop, kind: 'boolean' as const, required: required.has(prop), values: [false, true], domain: 'false or true', space: 2 }
    if ((spec.type === 'integer' || spec.type === 'number') && typeof spec.minimum === 'number' && typeof spec.maximum === 'number') {
      const size = spec.type === 'integer' ? spec.maximum - spec.minimum + 1 : Infinity
      const values = spec.type === 'integer' && size <= 24 ? Array.from({ length: size }, (_, i) => spec.minimum! + i) : [...new Set([spec.minimum, ...tb.filter((v) => typeof v === 'number'), spec.maximum])]
      return { property: prop, kind: 'range' as const, required: required.has(prop), values, domain: `${spec.type} in [${spec.minimum}, ${spec.maximum}]${values.length < size ? ` (${values.length} shown: the ends and the textbook's; any value in the range is yours to type)` : ''}`, space: size }
    }
    if (tb.length) return { property: prop, kind: 'textbook' as const, required: required.has(prop), values: tb, domain: `${tb.length} value(s) the textbook uses`, space: tb.length }
    return { property: prop, kind: 'free' as const, required: required.has(prop), values: [], domain: `${spec.type ?? 'any'}: free, no value enumerable`, space: Infinity }
  })
  return { facets, tool: tool as unknown as Tool }
}
const dashboard = toolOf('tree', {
  name: 'dashboard',
  description: 'A bounded tool laid out whole, so the user\'s decision in the UI is final: every value each property admits (an enum, a boolean, an integer range, the ends of a numeric bound, the textbook\'s values where a string is free), the whole space reachable by fixing one facet at a time (each cell narrows the dashboard until one combination remains, whose cell is its walk page /<uuid>), every cell drawn by its own UUID\'s CSS. Without a tool: every tool with the size of its space.',
  inputSchema: { type: 'object', properties: { tool: { type: 'string', description: 'the tool to lay out; omit for the index of all' }, fixed: { type: 'object', description: 'the facets already decided; the dashboard shows the rest' }, origin: { type: 'string' } } },
  run: (args) => {
    const origin = typeof args.origin === 'string' ? args.origin : ''
    if (typeof args.tool !== 'string') return { tools: TOOLS.length, index: TOOLS.map((t) => { const { facets } = facetsOf(t.name); const enumerable = facets.filter((f) => f.values.length); return { tool: t.name, toolbox: t.toolbox, facets: facets.length, enumerable: enumerable.length, free: facets.filter((f) => f.kind === 'free').map((f) => f.property), combinations: enumerable.reduce((n, f) => n * f.values.length, 1), space: facets.some((f) => f.space === Infinity) ? 'unbounded' : facets.reduce((n, f) => n * f.space, 1), dashboard: `${origin}/${uuidOf(`dashboard${JSON.stringify({ tool: t.name })}`)}` } }) }
    const { facets, tool } = facetsOf(args.tool)
    if (!tool) throw new Error(`no tool ${args.tool}`)
    const fixed = (args.fixed && typeof args.fixed === 'object' ? args.fixed : {}) as Record<string, unknown>
    const enumerable = facets.filter((f) => f.values.length)
    const open = enumerable.filter((f) => !(f.property in fixed))
    const freeRequired = facets.filter((f) => f.kind === 'free' && f.required && !(f.property in fixed)).map((f) => f.property)
    const space = enumerable.reduce((n, f) => n * f.values.length, 1)
    // the whole space is reachable by fixing one facet at a time: the cells of this dashboard are the values of the facets still open
    // (the required ones first, else the first open one); a cell fixes its value and leads to the narrower dashboard, until every
    // enumerable facet is fixed and the cell is the walk page of that one combination — the click is the decision, final
    const next = open.filter((f) => f.required).length ? open.filter((f) => f.required) : open.slice(0, 1)
    let combos: Record<string, unknown>[] = [{ ...fixed }]
    for (const f of next) combos = combos.flatMap((c) => f.values.map((v) => ({ ...c, [f.property]: v })))
    const final = (c: Record<string, unknown>) => enumerable.every((f) => f.property in c)
    const cells = combos.map((c) => { const leaf = final(c); const id = leaf ? uuidOf(`${args.tool}${JSON.stringify(c)}`) : uuidOf(`dashboard${JSON.stringify({ tool: args.tool, fixed: c })}`); return { arguments: c, uuid: id, url: `${origin}/${id}`, final: leaf, vars: varsOf(id) } })
    const chip = (text: string, style = '') => `<span style="display:inline-block; padding: 2px 8px; margin: 2px; border-radius: 999px; background: var(--surface-1); font-size: var(--font-size-footnote); ${style}">${text.replace(/[&<>]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[ch]!)}</span>`
    const html = `<div style="display: grid; gap: var(--gap-md);"><div role="heading" aria-level="3">${args.tool}: ${space.toLocaleString('en-US')} combination(s) of ${enumerable.length} facet(s), ${Object.keys(fixed).length} fixed, ${cells.length} cell(s) here${freeRequired.length ? `; ${freeRequired.join(', ')} is yours to type` : ''}</div>` +
      facets.map((f) => `<div data-facet="${f.property}"><strong>${f.property}</strong> <small>${f.domain}${f.required ? ', required' : ''}${f.property in fixed ? `, fixed to ${JSON.stringify(fixed[f.property])}` : ''}</small><div>${f.values.map((v) => chip(JSON.stringify(v), f.property in fixed && JSON.stringify(fixed[f.property]) === JSON.stringify(v) ? 'outline: 2px solid var(--a432-accent);' : '')).join('')}${f.values.length ? '' : chip('free')}</div></div>`).join('') +
      `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--gap-sm, 6px);">${cells.map((c) => `<a href="${c.url}" data-block="${c.uuid}" style="${Object.entries(c.vars).map(([k, v]) => `${k}: ${v}`).join('; ')}; display: block; border-left: 3px solid var(--qpu-accent); padding: 4px 8px; border-radius: var(--radius); background: var(--surface-1); color: var(--text-primary); text-decoration: none; font-size: var(--font-size-footnote);" title="${c.uuid}">${c.final ? '▶ ' : '▸ '}${Object.entries(c.arguments).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(' ').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!) || 'no arguments'}</a>`).join('')}</div></div>`
    return { tool: args.tool, facets: facets.length, enumerable: enumerable.length, fixed: Object.keys(fixed).length, combinations: space, cells: cells.length, final: cells.filter((c) => c.final).length, space: facets.some((f) => f.space === Infinity) ? 'unbounded' : facets.reduce((n, f) => n * f.space, 1), freeRequired, facetList: facets, cellList: cells.map(({ arguments: a, uuid, url, final: leaf }) => ({ arguments: a, uuid, url, final: leaf })), html }
  },
  widget: (d: { html?: string; tools?: number; index?: { tool: string; combinations: number; space: unknown; dashboard: string }[] }) => d.html ?? `<div style="display: grid; gap: var(--gap-sm, 6px);"><div role="heading" aria-level="3">${d.tools} tools, each laid out whole</div>${(d.index ?? []).map((i) => `<a href="${i.dashboard}" style="display: block; padding: 4px 8px; background: var(--surface-1); border-radius: var(--radius); color: var(--text-primary); text-decoration: none;">${i.tool}: ${i.combinations} combination(s), space ${i.space}</a>`).join('')}</div>`,
})

/** No-cloning unlocks the cloning of toolsets: the quantum state of a computation cannot be copied (all_noclone, kernel-checked),
 * so what is cloned is never the state but its classical description — and a toolbox is exactly that: its toolset (names,
 * descriptions, schemas), its skillset (instructions, directions, examples) and its selftest, a document any host mounts or
 * any client walks as doors by discovery. */
const clone = toolOf('tree', {
  name: 'clone',
  description: 'A toolbox cloned whole: its toolset (every tool\'s name, description and schema), its skillset (idea, instructions, directions, examples with what they show), and its selftest run now, as one document another host mounts or a client follows door by door. The quantum state of a computation is never cloned (all_noclone); its classical description is, and this is it. Without a toolbox: every toolbox\'s clone address.',
  inputSchema: { type: 'object', properties: { toolbox: { type: 'string', description: 'the toolbox to clone; omit for the index' }, as: { type: 'string', description: 'the name the clone carries at its new host' } } },
  run: (args, ctx) => {
    if (typeof args.toolbox !== 'string') return { toolboxes: TOOLBOXES.length, theorem: 'all_noclone', index: TOOLBOXES.map((b) => ({ toolbox: b.name, tools: b.tools.length, examples: EXAMPLES.filter((e) => b.tools.some((t) => t.name === e.tool)).length, clone: `/${uuidOf(`clone${JSON.stringify({ toolbox: b.name })}`)}` })) }
    const box = TOOLBOXES.find((b) => b.name === args.toolbox)
    if (!box) throw new Error(`no toolbox ${args.toolbox}; the toolboxes are ${TOOLBOXES.map((b) => b.name).join(', ')}`)
    const examples = EXAMPLES.filter((e) => box.tools.some((t) => t.name === e.tool)).map((e) => ({ id: e.id, tool: e.tool, arguments: e.arguments, shows: e.shows, theorem: e.theorem ?? null }))
    const selftest = box.skill.selftest(ctx)
    const doc = { name: typeof args.as === 'string' ? args.as : box.name, clonedFrom: box.name, idea: box.idea, toolset: box.tools.map((t) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema })), skillset: { instructions: box.skill.instructions, directions: box.skill.directions, examples }, selftest: { passed: selftest.passed, checks: selftest.checks.length }, license: LICENSE.spdx, author: LICENSE.author, theorem: 'all_noclone' }
    return { toolbox: box.name, as: doc.name, tools: box.tools.length, examples: examples.length, selftestPassed: selftest.passed, bytes: JSON.stringify(doc).length, id: uuidOf(`toolbox${JSON.stringify(doc)}`), noCloning: 'the quantum state of a computation cannot be cloned (all_noclone: coins ≠ mintOf coins, kernel-checked); its classical description can, and this document is that description', doc }
  },
  widget: flowWidget,
})

export const TOOLBOXES: Toolbox[] = [
  { name: 'google', idea: 'the Google Quantum AI layer: the Willow processor as its spec sheet states it, Cirq gates and circuits, Quantum Echoes, the roadmap, the software, the statements and the repositories', tools: OWN.filter((t) => t.toolbox === 'google'), examples: [], skill: { instructions: 'Call any tool with the arguments its schema names; every result is a block (widget, Open Graph, shadcn item) under the licence; the examples page is the documentation and the tests.', directions: ['server only: every example replays as documented (the audit)'], selftest: (ctx) => { const checks = ctx.examples.filter((e) => OWN.some((t) => t.name === e.tool && t.toolbox === 'google')).map((e) => { const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } }); const why = 'error' in r ? r.error.message : e.expect(r.result.structuredContent); return { id: `google:${e.id}`, passed: why === null, evidence: why ?? e.shows } }); return { passed: checks.every((c) => c.passed), checks } } } },
  { name: 'tree', idea: 'the tree knows itself: its leads, its self-audit, any statement matched or proved impossible, the Clay register recomputed, any UUID verified cheaply, its metrics in real time', tools: [...OWN.filter((t) => t.toolbox === 'tree'), metrics, textbook, css, dashboard, clone], examples: [], skill: { instructions: 'audit replays every example and every toolbox selftest; match decides any statement; verify checks a UUID against its seal, content and neighbours; clay recomputes the register; leads lists what is owed.', directions: ['server only: the audit audits the audit', 'toolbox → toolbox: match is the judge of readiness and the engine of imagine'], selftest: (ctx) => { const m = matchOf('How many qubits does Willow have?', ctx.handle, ctx.examples, ctx.leads); return { passed: m.verdict === 'served', checks: [{ id: 'tree:match-serves', passed: m.verdict === 'served', evidence: `${m.verdict} via ${m.tool}` }] } } } },
  FLOW,
  LANGUAGE,
  RAID,
  BILLING,
  LEGAL,
  REPOSITORY,
  STANDARDS_BOX,
  PAYLOAD,
  EXTENSION,
  CRYPTO,
]
const TOOLS: Tool[] = TOOLBOXES.flatMap((b) => b.tools)
const CONTEXT: Context = { get handle() { return handle }, get examples() { return EXAMPLES }, get leads() { return LEADS } }

const keyOfQubit = (q: Qubit): string => (q.kind === 'grid' ? `grid:${q.row},${q.col}` : q.kind === 'line' ? `line:${q.x}` : `named:${q.name}`)

/** Answer one JSON-RPC message: initialize, tools/list, or tools/call. Anything else is method not found. */
/** A batch: a JSON-RPC array is answered as one array, in order — the batch action of every tool, one request. */
export const handleBatch = (messages: readonly Rpc[]): Reply[] => messages.map((m) => handle(m))
export const handle = (message: Rpc): Reply => {
  if (Array.isArray(message)) return handleBatch(message as unknown as Rpc[]) as unknown as Reply
  const id = message.id ?? null
  const fail = (code: number, text: string): Reply => ({ jsonrpc: '2.0', id, error: { code, message: text } })
  const params = (message.params ?? {}) as Record<string, unknown>
  try {
    if (message.method === 'initialize') return { jsonrpc: '2.0', id, result: { protocolVersion: '2025-06-18', capabilities: { tools: {}, resources: {}, extensions: { [MCP_APPS.extension]: { mimeTypes: [MCP_APPS.mimeType] } } }, serverInfo: { name: 'qpu', version: '1.4.0' , build: buildOf(TOOLS.map((t) => t.name)), license: LICENSE.spdx, author: LICENSE.author }, instructions: `${INSTRUCTIONS}\n\nToolboxes: ${TOOLBOXES.map((b) => `${b.name} (${b.tools.map((t) => t.name).join(', ')}): ${b.idea}. ${b.skill.instructions}`).join('\n')}` } }
    // every tool declares its UI resource (MCP Apps, _meta.ui.resourceUri): a host that negotiates the extension renders the tool's result through it
    // every tool listed widget-skilled: its UI resource (the widget) and its toolbox's skill (the instructions a client follows, the directions it tests in)
    if (message.method === 'tools/list') {
      // the list balanced to the request, over MCP alone: the tools a statement needs (the match tool decides the cluster), or the tools named, with brief
      // descriptions when asked, so the context a model carries stays small and never needs compacting; the context counted beside (textbook_context_balanced)
      const scope = params as { tools?: string[] | string; brief?: boolean; statement?: string }
      const wanted = typeof scope.tools === 'string' ? scope.tools.split(',').map((s) => s.trim()).filter(Boolean) : Array.isArray(scope.tools) ? scope.tools.map(String) : null
      const cluster = typeof scope.statement === 'string' && scope.statement.trim() ? (() => { const r = handle({ jsonrpc: '2.0', id: 0, method: 'tools/call', params: { name: 'match', arguments: { statement: scope.statement } } }) as { result?: { structuredContent?: { tool?: string | null; cluster?: { kind: string; id: string }[] } } }; const c = r.result?.structuredContent; return [...new Set([...(c?.tool ? [c.tool] : []), ...(c?.cluster ?? []).filter((x) => x.kind === 'tool').map((x) => x.id)])] })() : null
      const chosen = TOOLS.filter((t) => (!wanted || wanted.includes(t.name)) && (!cluster || cluster.includes(t.name)))
      const brief = (d: string) => (scope.brief ? (d.match(/^[^.:]{1,160}/)?.[0] ?? d.slice(0, 160)).trim() : d)
      const list = chosen.map(({ name, description, inputSchema, toolbox }) => { const box = TOOLBOXES.find((b) => b.name === toolbox); return { name, description: brief(description), inputSchema, annotations: { title: name, readOnlyHint: true, idempotentHint: true, openWorldHint: false }, _meta: { toolbox, skill: { instructions: box?.skill.instructions ?? '', directions: box?.skill.directions.length ?? 0 }, ui: { resourceUri: `ui://qpu/${name}`, visibility: ['model', 'app'] } } } })
      const chars = JSON.stringify(list).length; const fullChars = JSON.stringify(TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }))).length
      return { jsonrpc: '2.0', id, result: { tools: list, _meta: { context: { tools: list.length, of: TOOLS.length, chars, tokens: Math.ceil(chars / 4), fullChars, fullTokens: Math.ceil(fullChars / 4), saved: Math.ceil(fullChars / 4) - Math.ceil(chars / 4), balanced: Boolean(wanted || cluster || scope.brief), bill: billOf({ tokens: Math.ceil(chars / 4), bits: chars * 8, saved: { tokens: Math.ceil(fullChars / 4) - Math.ceil(chars / 4), bits: (fullChars - chars) * 8 } }), says: 'the list balanced to the request over MCP: the cluster the match tool decides, brief descriptions on request, the context counted; the saved and the kept make the whole (textbook_context_balanced)' } } } }
    }
    // the UI resources: one ui://qpu/<tool> per tool, the app shell served over the standard resource methods, nothing bypassed
    // the SDK is a resource too: served here and, through the plugin's resources, by the Payload MCP plugin — and the SDK calls both back (vice versa)
    if (message.method === 'resources/list') return { jsonrpc: '2.0', id, result: { resources: [...TOOLS.map((t) => { const u = uiOf(t.name); return { uri: u.uri, name: u.name, description: `the MCP Apps view of ${t.name}: renders the widget the tool computes`, mimeType: u.mimeType, _meta: { ui: { csp: u.csp, prefersBorder: u.prefersBorder } } } }), { uri: 'sdk://qpu/lib', name: 'qpu · sdk', description: 'the SDK: the config sets as the base of combinatorial application builders — one TypeScript module that calls this server over MCP (token free) and the Payload MCP plugin with a user\'s API key (the collections among its tools); served here and by the plugin', mimeType: 'text/typescript' }, { uri: OPENAPI_RESOURCE, name: 'qpu · openapi', description: 'the standard contract: an OpenAPI 3.1 document derived from tools/list and the endpoint table — every tool a component schema, every endpoint a path, the mcp operation a JSON-RPC envelope; the same document stands in the discovery document at /.well-known/qpu.json', mimeType: 'application/json' }] } }
    if (message.method === 'resources/templates/list') return { jsonrpc: '2.0', id, result: { resourceTemplates: [{ uriTemplate: 'ui://qpu/{tool}', name: 'qpu · a tool\'s view', mimeType: MCP_APPS.mimeType, description: 'the app shell of any tool of the catalogue' }] } }
    if (message.method === 'resources/read') {
      const uri = String(params.uri ?? '')
      if (uri === 'sdk://qpu/lib') { const sdk = sdkOf('https://qpu.uuidna.com', TOOLS.map((t) => t.name)); return { jsonrpc: '2.0', id, result: { contents: [{ uri, mimeType: 'text/typescript', text: sdk.module }] } } }
      if (uri === OPENAPI_RESOURCE) return { jsonrpc: '2.0', id, result: { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(openapiOf('https://qpu.uuidna.com', TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }))), null, 1) }] } }
      const name = /^ui:\/\/qpu\/([a-z0-9_-]+)$/.exec(uri)?.[1]
      const found = name ? TOOLS.find((t) => t.name === name) : undefined
      if (!found) return fail(INVALID_PARAMS, `no resource ${uri}; the resources are ui://qpu/<tool> for ${TOOLS.map((t) => t.name).join(', ')}`)
      const u = uiOf(found.name)
      return { jsonrpc: '2.0', id, result: { contents: [{ uri: u.uri, mimeType: u.mimeType, text: u.html, _meta: { ui: { csp: u.csp, prefersBorder: u.prefersBorder } } }] } }
    }
    if (message.method === 'tools/call') {
      const found = TOOLS.find((t) => t.name === params.name)
      if (!found) return fail(METHOD_NOT_FOUND, `no tool ${String(params.name)}; the tools are ${TOOLS.map((t) => t.name).join(', ')}`)
      // The balancer: every tool is pure, so a call is a function of its block address; computed once per process, served from
      // memory after — the heavy computation inverted, the hardware cooled, the battery saved (lead qpu-balancer-perspective).
      const args = (params.arguments ?? {}) as Record<string, unknown>
      const address = uuidOf(`${found.name}${JSON.stringify(args)}`)
      const cached = found.name === 'metrics' ? undefined : BALANCER.get(address)
      // exclusive time: a tool that calls tools (audit, metrics, match) is charged only for its own milliseconds; the nested ones are theirs
      const started = Date.now(); NESTED.push(0)
      const { structured, widget } = cached ?? found.call(args, CONTEXT)
      if (!cached) BALANCER.set(address, { structured, widget }); else if (TELEPORTED.has(address)) TELEPORT_HITS += 1
      const children = NESTED.pop() ?? 0; const elapsed = Date.now() - started
      if (NESTED.length) NESTED[NESTED.length - 1]! += elapsed
      const o = OBSERVED.get(found.name) ?? { calls: 0, misses: 0, ms: 0, bytes: 0 }
      o.calls += 1; if (!cached) { o.misses += 1; o.ms += elapsed - children; o.bytes += widget.length + JSON.stringify(structured).length }
      OBSERVED.set(found.name, o)
      const block = blockOf(found.name, args, structured, widget, found.description)
      // the referer of a call: who sent it, carried as _meta.prev, echoed so a chain of calls knows its previous step across domains
      const prev = typeof (params._meta as { prev?: unknown } | undefined)?.prev === 'string' ? (params._meta as { prev: string }).prev : undefined
      return { jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(structured) }], structuredContent: structured, isError: false, _meta: { jsonLd: blockJsonLdOf({ tool: found.name, id: block.id, description: found.description, toolbox: found.toolbox, url: `urn:uuid:${block.id}` }), payload: found.name === 'payload' ? undefined : payloadDocOf({ uuid: block.id, tool: found.name, arguments: args, description: found.description, openGraph: block.openGraph as unknown as Record<string, string>, prev: typeof (params._meta as { prev?: unknown } | undefined)?.prev === 'string' ? (params._meta as { prev: string }).prev : null }), widget: block.html, openGraph: { ...block.openGraph, ...(prev ? { 'og:see_also': prev } : {}) }, block: block.shadcn, theme: block.theme, license: LICENSE, ...(prev ? { prev } : {}) } } }
    }
    return fail(METHOD_NOT_FOUND, `method ${message.method} is not served`)
  } catch (error) {
    return fail(INVALID_PARAMS, error instanceof Error ? error.message : String(error))
  }
}
