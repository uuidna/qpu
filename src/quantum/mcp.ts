// The qpu MCP surface: JSON-RPC 2.0 tools that take typed POST parameters and compile the circuit they describe on each
// call. The handler does no I/O and imports nothing from Node, so the same code runs in a browser OS, where a caller
// compiles whatever it needs by calling a tool. Tool names and figures follow Google Quantum AI (quantumai.google).

import { CNOT, CZ, GridQubit, H, LineQubit, NamedQubit, Simulator, SWAP, X, Y, Z, Circuit, applied, measure, powerOf, type Gate, type Operation, type Qubit } from './cirq.js'
import { echoCircuit, echoProbability, QUANTUM_ECHOES } from './echo.js'
import { PROCESSORS } from './processor.js'
import { circuitWidget, echoBenchmarkWidget, echoWidget, processorWidget, roadmapWidget } from './widgets.js'
import { ROADMAP } from './roadmap.js'

export type Rpc = { jsonrpc: '2.0'; id?: number | string | null; method: string; params?: unknown }
export type Reply =
  | { jsonrpc: '2.0'; id: number | string | null; result: unknown }
  | { jsonrpc: '2.0'; id: number | string | null; error: { code: number; message: string } }

/** JSON-RPC's invalid-params code: the arguments of a tool do not describe a circuit or a processor. */
const INVALID_PARAMS = -32602
const METHOD_NOT_FOUND = -32601

class ParamError extends Error {}

const GATES: Record<string, Gate> = { X, Y, Z, H, CZ, CNOT, SWAP }

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

/** The circuit a call describes: its operations in order, then an optional measurement. */
const circuitOf = (operations: OperationJson[], measurement?: MeasureJson): Circuit => {
  const ops = operations.map(operationOf)
  if (measurement) ops.push(measure(measurement.qubits.map(qubitOf), measurement.key))
  return new Circuit(ops)
}

const complex = ([re, im]: [number, number]) => ({ re, im })

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
    inputSchema: { type: 'object', required: ['name'], properties: { name: { enum: Object.keys(PROCESSORS) } } },
    run: (args) => {
      const processor = PROCESSORS[args.name as keyof typeof PROCESSORS] ?? reject(`processor ${String(args.name)} is not described here`)
      return { name: processor.name, technology: processor.technology, qubits: processor.qubits, statedAverageConnectivity: processor.statedAverageConnectivity, typicalConnectivity: processor.typicalConnectivity, chips: processor.chips, magicStateCultivation: processor.magicStateCultivation }
    },
    widget: processorWidget,
  }),
  tool({
    name: 'circuit',
    description: 'Compile a circuit from its operations and simulate it: the final amplitudes when there is no measurement, or sampled bitstrings and their histogram when there is one.',
    inputSchema: {
      type: 'object',
      required: ['operations'],
      properties: {
        operations: { type: 'array', items: OPERATION_SCHEMA },
        measure: MEASURE_SCHEMA,
        repetitions: { type: 'integer', minimum: 1, maximum: 10000, default: 100 },
      },
    },
    run: (args) => {
      const operations = args.operations as OperationJson[]
      const measurement = args.measure as MeasureJson | undefined
      const circuit = circuitOf(operations, measurement)
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
      if (args.milestone === undefined) return { milestones: ROADMAP }
      const found = ROADMAP.filter((m) => m.number === args.milestone)
      return found.length ? { milestones: found } : reject(`milestone ${String(args.milestone)} is not on the roadmap; the milestones are 1 to 6`)
    },
    widget: roadmapWidget,
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
