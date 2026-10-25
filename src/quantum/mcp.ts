// The qpu MCP surface: JSON-RPC 2.0 tools that take typed POST parameters and compile the circuit they describe on each
// call. The handler does no I/O and imports nothing from Node, so the same code runs in a browser OS, where a caller
// compiles whatever it needs by calling a tool. Tool names and figures follow Google Quantum AI (quantumai.google).

import * as cirq from './cirq.js'
import { EXAMPLES } from './examples.js'
import { auditOf } from './audit.js'
import { blockOf, verifyOf } from './blocks.js'
import { INSTRUCTIONS, LICENSE } from './license.js'
import { recomputeClay } from './clay-register.js'
import { matchOf } from './match.js'
import { LOCALES } from './i18n.js'
import { CNOT, CZ, Channel, Circuit, DensityMatrixSimulator, GridQubit, H, InsertStrategy, LineQubit, NamedQubit, Simulator, SWAP, TOFFOLI, X, Y, Z, applied, expectationOf, keyOf, measure, powerOf, type Gate, type Operation, type Qubit } from './cirq.js'
import { echoCircuit, echoProbability, QUANTUM_ECHOES } from './echo.js'
import { DEVICES, PROCESSORS, deviceOf, willowNoiseOf } from './processor.js'
import { algorithmWidget, chemistryWidget, circuitWidget, echoBenchmarkWidget, echoWidget, errorCorrectionWidget, leadsWidget, processorWidget, quantumlibWidget, repositoriesWidget, resourcesWidget, roadmapWidget, softwareWidget, statementsWidget, auditWidget, matchWidget, clayWidget, verifyWidget } from './widgets.js'
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
type Tool = { name: string; description: string; inputSchema: object; call: (args: Record<string, unknown>) => { structured: unknown; widget: string } }

/** A tool from its run and its widget: the widget takes exactly what the run returns, so the two cannot drift apart. */
const tool = <T>(spec: { name: string; description: string; inputSchema: object; run: (args: Record<string, unknown>) => T; widget: (data: T) => string }): Tool => ({
  name: spec.name,
  description: spec.description,
  inputSchema: spec.inputSchema,
  call: (args) => {
    const data = spec.run(args)
    return { structured: data, widget: spec.widget(data) }
  },
})

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

const TOOLS: Tool[] = [
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
      const result = new Simulator().run(circuit, repetitions)
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
        const run = new Simulator().run(phaseEstimationCircuit(theta, bits), repetitions)
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
        const run = new Simulator().run(groverCircuit(), repetitions)
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
        const run = new Simulator().run(shorCircuit(N, a), repetitions)
        const found = shorFactors(N, a, run.measurements('m'))
        const counts = new Map<string, number>()
        for (const e of found.estimates) counts.set(e.toFixed(6), (counts.get(e.toFixed(6)) ?? 0) + 1)
        return {
          name,
          summary: [['N', String(N)], ['a', String(a)], ['Order of a mod N', found.order === null ? 'not found' : String(found.order)], ['Factors', found.factors ? `${found.factors[0]} × ${found.factors[1]}` : 'not found']],
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
    inputSchema: { type: 'object', properties: { status: { enum: ['served', 'partial', 'blocked', 'out_of_scope', 'open'] } } },
    run: (args) => {
      const status = args.status as LeadStatus | undefined
      if (status !== undefined && !['served', 'partial', 'blocked', 'out_of_scope', 'open'].includes(status)) reject(`status ${String(status)} is not one of served, partial, blocked, out_of_scope, open`)
      const leads = LEADS.filter((l) => status === undefined || l.status === status)
      return { leads, counts: leadCounts(), total: LEADS.length }
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
    inputSchema: { type: 'object', properties: {} },
    run: () => auditOf(handle, EXAMPLES, LEADS),
    widget: auditWidget,
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
    inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'one relation, e.g. relation_15; omit for all' } } },
    run: (args) => {
      const all = recomputeClay()
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

const keyOfQubit = (q: Qubit): string => (q.kind === 'grid' ? `grid:${q.row},${q.col}` : q.kind === 'line' ? `line:${q.x}` : `named:${q.name}`)

/** Answer one JSON-RPC message: initialize, tools/list, or tools/call. Anything else is method not found. */
export const handle = (message: Rpc): Reply => {
  const id = message.id ?? null
  const fail = (code: number, text: string): Reply => ({ jsonrpc: '2.0', id, error: { code, message: text } })
  const params = (message.params ?? {}) as Record<string, unknown>
  try {
    if (message.method === 'initialize') return { jsonrpc: '2.0', id, result: { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'qpu', version: '1.4.0' , license: LICENSE.spdx, author: LICENSE.author }, instructions: INSTRUCTIONS } }
    if (message.method === 'tools/list') return { jsonrpc: '2.0', id, result: { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) } }
    if (message.method === 'tools/call') {
      const found = TOOLS.find((t) => t.name === params.name)
      if (!found) return fail(METHOD_NOT_FOUND, `no tool ${String(params.name)}; the tools are ${TOOLS.map((t) => t.name).join(', ')}`)
      const { structured, widget } = found.call((params.arguments ?? {}) as Record<string, unknown>)
      const block = blockOf(found.name, (params.arguments ?? {}) as Record<string, unknown>, structured, widget, found.description)
      // the referer of a call: who sent it, carried as _meta.prev, echoed so a chain of calls knows its previous step across domains
      const prev = typeof (params._meta as { prev?: unknown } | undefined)?.prev === 'string' ? (params._meta as { prev: string }).prev : undefined
      return { jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(structured) }], structuredContent: structured, isError: false, _meta: { widget: block.html, openGraph: { ...block.openGraph, ...(prev ? { 'og:see_also': prev } : {}) }, block: block.shadcn, theme: block.theme, license: LICENSE, ...(prev ? { prev } : {}) } } }
    }
    return fail(METHOD_NOT_FOUND, `method ${message.method} is not served`)
  } catch (error) {
    return fail(INVALID_PARAMS, error instanceof Error ? error.message : String(error))
  }
}
