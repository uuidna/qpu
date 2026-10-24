// The qpu MCP surface: JSON-RPC 2.0 tools that take typed POST parameters and compile the circuit they describe on each
// call. The handler does no I/O and imports nothing from Node, so the same code runs in a browser OS, where a caller
// compiles whatever it needs by calling a tool. Tool names and figures follow Google Quantum AI (quantumai.google).

import { CNOT, CZ, Channel, Circuit, DensityMatrixSimulator, GridQubit, H, InsertStrategy, LineQubit, NamedQubit, Simulator, SWAP, TOFFOLI, X, Y, Z, applied, expectationOf, keyOf, measure, powerOf, type Gate, type Operation, type Qubit } from './cirq.js'
import { echoCircuit, echoProbability, QUANTUM_ECHOES } from './echo.js'
import { PROCESSORS, SYCAMORE, WILLOW, deviceOf } from './processor.js'
import { algorithmWidget, circuitWidget, echoBenchmarkWidget, echoWidget, leadsWidget, processorWidget, roadmapWidget, softwareWidget, statementsWidget } from './widgets.js'
import { APPLICATIONS, ROADMAP } from './roadmap.js'
import { groverCircuit, inverseOperations, messageCircuit, phaseEstimationCircuit, qaoaExpectedCut, qaoaSweep, qftOperations, seededWeights, shorCircuit, shorFactors, teleportationCircuit, type Graph } from './algorithms.js'
import { STATEMENTS, SOFTWARE, type StatementTopic } from './statements.js'
import { LEADS, type LeadStatus } from './leads.js'

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
    inputSchema: { type: 'object', required: ['name'], properties: { name: { enum: [...Object.keys(PROCESSORS), SYCAMORE.name] } } },
    run: (args) => {
      if (args.name === SYCAMORE.name) return { name: SYCAMORE.name, qubits: SYCAMORE.qubits, couplers: SYCAMORE.couplers, layout: SYCAMORE.layout }
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
        device: { enum: Object.keys(PROCESSORS), description: 'validate the circuit against this processor first' },
        measure: MEASURE_SCHEMA,
        repetitions: { type: 'integer', minimum: 1, maximum: 10000, default: 100 },
        noise: { type: 'array', items: CHANNEL_SCHEMA, description: 'channels applied after every gate, on each of its qubits' },
        observables: { type: 'array', items: OBSERVABLE_SCHEMA },
      },
    },
    run: (args) => {
      const operations = args.operations as OperationJson[]
      const measurement = args.measure as MeasureJson | undefined
      const insert = (args.insert ?? 'EARLIEST') as InsertStrategy
      const circuit = circuitOf(operations, insert, measurement)
      if (typeof args.device === 'string') {
        const processor = PROCESSORS[args.device as keyof typeof PROCESSORS] ?? reject(`device ${args.device} is not described here`)
        deviceOf(processor).validateCircuit(circuit)
      }
      const channels = ((args.noise ?? []) as ChannelJson[]).map(channelOf)
      const observables = (args.observables ?? []) as Record<string, 'X' | 'Y' | 'Z'>[]
      if (channels.length || observables.length) {
        if (measurement) reject('noise and observables run on the density matrix, which does not sample; remove measure, or run the measurement without noise')
        const result = new DensityMatrixSimulator().simulate(circuit, channels)
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
    description: 'The textbook algorithms of the Cirq page: qft and inverse_qft (on n qubits, from input x), phase_estimation (of θ with bits bits), grover (two qubits, marked |00>), teleportation (the message state, sent and received), and qaoa (depth 1 on the first nodes of the Willow device, with the expected cut). Each returns its summary and a table.',
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
        const count = Number(args.nodes ?? 12)
        const sorted = [...WILLOW.sites].sort((a, b) => (a.kind === 'grid' && b.kind === 'grid' ? a.row - b.row || a.col - b.col : 0))
        const nodes = sorted.slice(0, count)
        const keys = new Set(nodes.map(keyOf))
        const couplers = WILLOW.couplers.filter(([a, b]) => keys.has(keyOf(a)) && keys.has(keyOf(b)))
        const weights = (args.weights as number[] | undefined) ?? seededWeights(couplers.length)
        if (weights.length !== couplers.length) reject(`weights needs one value per edge: ${couplers.length} edges`)
        const graph: Graph = { nodes, edges: couplers.map(([a, b], i) => ({ a, b, weight: weights[i]! })) }
        const total = graph.edges.reduce((sum, e) => sum + e.weight, 0)
        if (args.sweep === true) {
          const sweep = qaoaSweep(graph)
          return {
            name,
            summary: [['Nodes', String(nodes.length)], ['Edges', String(couplers.length)], ['Best alpha', sweep.best.alpha.toFixed(4)], ['Best beta', sweep.best.beta.toFixed(4)], ['Expected cut at best', sweep.best.expectedCut.toFixed(4)], ['Random baseline', sweep.randomBaseline.toFixed(4)]],
            header: ['Edge', 'Weight'],
            rows: graph.edges.map((e) => [`${keyOf(e.a)} – ${keyOf(e.b)}`, e.weight.toFixed(2)]),
          }
        }
        const alpha = Number(args.alpha ?? 0)
        const beta = Number(args.beta ?? 0)
        const expected = qaoaExpectedCut(graph, alpha, beta)
        return {
          name,
          summary: [['Nodes', String(nodes.length)], ['Edges', String(couplers.length)], ['Expected cut', expected.toFixed(4)], ['Random baseline', (total / 2).toFixed(4)]],
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
    description: 'The statements quantumai.google and its PDF make: the Cirq description, the definition of quantum computing, progress, responsibility, the vision, the hardware, the Willow Early Access Program and neutral atoms. With a topic, only that one.',
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
    name: 'leads',
    description: 'Every lead on quantumai.google and its PDF, with its status (served, partial, blocked or out of scope), the tool that serves it, and the reason where it is partial, blocked or out of scope.',
    inputSchema: { type: 'object', properties: { status: { enum: ['served', 'partial', 'blocked', 'out_of_scope'] } } },
    run: (args) => {
      const status = args.status as LeadStatus | undefined
      const leads = LEADS.filter((l) => status === undefined || l.status === status)
      const counts = { served: 0, partial: 0, blocked: 0, out_of_scope: 0 }
      for (const l of LEADS) counts[l.status] += 1
      return { leads, counts, total: LEADS.length }
    },
    widget: leadsWidget,
  }),
]

const keyOfQubit = (q: Qubit): string => (q.kind === 'grid' ? `grid:${q.row},${q.col}` : q.kind === 'line' ? `line:${q.x}` : `named:${q.name}`)

/** Answer one JSON-RPC message: initialize, tools/list, or tools/call. Anything else is method not found. */
export const handle = (message: Rpc): Reply => {
  const id = message.id ?? null
  const fail = (code: number, text: string): Reply => ({ jsonrpc: '2.0', id, error: { code, message: text } })
  const params = (message.params ?? {}) as Record<string, unknown>
  try {
    if (message.method === 'initialize') return { jsonrpc: '2.0', id, result: { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'qpu', version: '1.4.0' } } }
    if (message.method === 'tools/list') return { jsonrpc: '2.0', id, result: { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) } }
    if (message.method === 'tools/call') {
      const found = TOOLS.find((t) => t.name === params.name)
      if (!found) return fail(METHOD_NOT_FOUND, `no tool ${String(params.name)}; the tools are ${TOOLS.map((t) => t.name).join(', ')}`)
      const { structured, widget } = found.call((params.arguments ?? {}) as Record<string, unknown>)
      return { jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(structured) }], structuredContent: structured, isError: false, _meta: { widget } } }
    }
    return fail(METHOD_NOT_FOUND, `method ${message.method} is not served`)
  } catch (error) {
    return fail(INVALID_PARAMS, error instanceof Error ? error.message : String(error))
  }
}
