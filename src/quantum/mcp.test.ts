import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { handle } from './mcp.js'

const call = (name: string, args: unknown) => handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } })

test('tools/list serves the four tools with input schemas, and initialize names the server', () => {
  const init = handle({ jsonrpc: '2.0', id: 0, method: 'initialize' })
  assert.ok('result' in init && (init.result as { serverInfo: { name: string } }).serverInfo.name === 'qpu')
  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
  assert.ok('result' in list)
  const tools = (list.result as { tools: { name: string; inputSchema: object }[] }).tools
  assert.deepEqual(tools.map((t) => t.name), ['processor', 'circuit', 'echo', 'echo_benchmark'])
  for (const t of tools) assert.equal(typeof t.inputSchema, 'object')
})

test('the processor tool returns the Willow figures typed by name', () => {
  const r = call('processor', { name: 'Willow' })
  assert.ok('result' in r)
  const data = (r.result as { structuredContent: { qubits: number; statedAverageConnectivity: number } }).structuredContent
  assert.equal(data.qubits, 105)
  assert.equal(data.statedAverageConnectivity, 3.47)
  const unknown = call('processor', { name: 'Sycamore' })
  assert.ok('error' in unknown && unknown.error.code === -32602)
})

test('a circuit compiles from POST parameters: a Hadamard on a grid qubit gives equal weight, sampled by key', () => {
  const r = call('circuit', { operations: [{ gate: 'H', qubits: [{ kind: 'grid', row: 0, col: 0 }] }], measure: { key: 'm', qubits: [{ kind: 'grid', row: 0, col: 0 }] }, repetitions: 400 })
  assert.ok('result' in r)
  const data = (r.result as { structuredContent: { bitstrings: string[]; histogram: Record<string, number> } }).structuredContent
  assert.equal(data.bitstrings.length, 400)
  assert.ok(data.bitstrings.every((b) => b === '0' || b === '1'))
})

test('an exponent compiles the gate power: X with exponent 0.5 squared is X, so two of them flip the qubit', () => {
  const r = call('circuit', { operations: [{ gate: 'X', qubits: [{ kind: 'line', x: 0 }], exponent: 0.5 }, { gate: 'X', qubits: [{ kind: 'line', x: 0 }], exponent: 0.5 }] })
  assert.ok('result' in r)
  const amps = (r.result as { structuredContent: { amplitudes: { re: number; im: number }[] } }).structuredContent.amplitudes
  assert.ok(Math.abs(amps[0]!.re) < 1e-12 && Math.abs(amps[1]!.re - 1) < 1e-12)
})

test('echo returns probability 1 without a perturbation, and less than 1 when a perturbation reaches the measured qubits', () => {
  const forward = [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }, { gate: 'CNOT', qubits: [{ kind: 'line', x: 0 }, { kind: 'line', x: 1 }] }]
  const clean = call('echo', { forward })
  assert.ok('result' in clean && Math.abs((clean.result as { structuredContent: { probability: number } }).structuredContent.probability - 1) < 1e-12)
  const perturbed = call('echo', { forward, perturbation: { gate: 'X', qubits: [{ kind: 'line', x: 1 }] } })
  assert.ok('result' in perturbed && (perturbed.result as { structuredContent: { probability: number } }).structuredContent.probability < 1 - 1e-6)
})

test('the echo benchmark is the figures Google states', () => {
  const r = call('echo_benchmark', {})
  assert.ok('result' in r)
  assert.deepEqual((r.result as { structuredContent: unknown }).structuredContent, { processor: 'Willow', qubits: 105, speedup: 13000, molecules: [15, 28] })
})

test('invalid parameters are refused with a JSON-RPC invalid-params error, and an unknown tool or method is not served', () => {
  const badGate = call('circuit', { operations: [{ gate: 'T', qubits: [{ kind: 'line', x: 0 }] }] })
  assert.ok('error' in badGate && badGate.error.code === -32602)
  const badArity = call('circuit', { operations: [{ gate: 'CZ', qubits: [{ kind: 'line', x: 0 }] }] })
  assert.ok('error' in badArity && badArity.error.code === -32602)
  assert.ok('error' in call('nope', {}))
  assert.ok('error' in handle({ jsonrpc: '2.0', id: 2, method: 'resources/list' }))
})

test('the handler runs in a browser: it imports nothing from Node', () => {
  for (const file of ['mcp.ts', 'cirq.ts', 'echo.ts', 'processor.ts']) {
    assert.doesNotMatch(readFileSync(new URL(`./${file}`, import.meta.url), 'utf8'), /from ['"]node:/, `${file} imports a Node built-in`)
  }
})

const widgetOf = (reply: ReturnType<typeof handle>): string => {
  assert.ok('result' in reply)
  const widget = (reply.result as { _meta?: { widget?: unknown } })._meta?.widget
  assert.equal(typeof widget, 'string')
  return widget as string
}

test('every tool returns a widget that uses the host tokens and no literal colours', () => {
  const widgets = [
    widgetOf(call('processor', { name: 'Willow' })),
    widgetOf(call('circuit', { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }] })),
    widgetOf(call('circuit', { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }], measure: { key: 'm', qubits: [{ kind: 'line', x: 0 }] }, repetitions: 50 })),
    widgetOf(call('echo', { forward: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }] })),
    widgetOf(call('echo_benchmark', {})),
  ]
  for (const widget of widgets) {
    assert.ok(widget.length > 0 && widget.includes('var(--'))
    assert.doesNotMatch(widget, /#[0-9a-f]{3,6}\b/i, 'a widget writes no literal hex colour')
    assert.doesNotMatch(widget, /<(script|style)\b/i, 'a widget carries no script or style block')
  }
})

test('the widget shows the result it was built from: the processor qubit count and the benchmark speedup', () => {
  assert.match(widgetOf(call('processor', { name: 'Willow' })), />105</)
  assert.match(widgetOf(call('echo_benchmark', {})), />13,000×</)
})

test('a widget escapes text from the caller, so a name cannot inject markup', () => {
  const widget = widgetOf(call('circuit', { operations: [], measure: { key: '<img src=x onerror=1>', qubits: [{ kind: 'line', x: 0 }] }, repetitions: 1 }))
  assert.doesNotMatch(widget, /<img/)
  assert.match(widget, /&lt;img/)
})
