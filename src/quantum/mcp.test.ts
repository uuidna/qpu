import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { handle } from './mcp.js'

const call = (name: string, args: unknown) => handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } })

test('tools/list serves the MCP tools with input schemas, and initialize names the server', () => {
  const init = handle({ jsonrpc: '2.0', id: 0, method: 'initialize' })
  assert.ok('result' in init && (init.result as { serverInfo: { name: string } }).serverInfo.name === 'qpu')
  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
  assert.ok('result' in list)
  const tools = (list.result as { tools: { name: string; inputSchema: object }[] }).tools
  assert.ok(tools.some((t) => t.name === 'quantumlib'), 'quantumlib tool is listed')
  assert.ok(tools.some((t) => t.name === 'processor'), 'processor tool is listed')
  assert.ok(tools.length >= 11, 'all tools are listed')
  for (const t of tools) assert.equal(typeof t.inputSchema, 'object')
})

test('the processor tool returns the Willow figures typed by name', () => {
  const r = call('processor', { name: 'Willow' })
  assert.ok('result' in r)
  const data = (r.result as { structuredContent: { qubits: number; statedAverageConnectivity: number } }).structuredContent
  assert.equal(data.qubits, 105)
  assert.equal(data.statedAverageConnectivity, 3.47)
  const unknown = call('processor', { name: 'Mars' })
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
  const benchmark = (r.result as { structuredContent: { processor: string; qubits: number; speedup: number; molecules: number[]; experiment: { qubitsStatedInText: number } } }).structuredContent
  assert.deepEqual([benchmark.processor, benchmark.qubits, benchmark.speedup, benchmark.molecules], ['Willow', 105, 13000, [15, 28]])
  assert.equal(benchmark.experiment.qubitsStatedInText, 103)
})

test('invalid parameters are refused with a JSON-RPC invalid-params error, and an unknown tool or method is not served', () => {
  const badGate = call('circuit', { operations: [{ gate: 'T', qubits: [{ kind: 'line', x: 0 }] }] })
  assert.ok('error' in badGate && badGate.error.code === -32602)
  const badArity = call('circuit', { operations: [{ gate: 'CZ', qubits: [{ kind: 'line', x: 0 }] }] })
  assert.ok('error' in badArity && badArity.error.code === -32602)
  assert.ok('error' in call('nope', {}))
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
    widgetOf(call('roadmap', {})),
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

test('the roadmap tool serves the six milestones of the Google figure, and one milestone on request', () => {
  const all = call('roadmap', {})
  assert.ok('result' in all)
  const milestones = (all.result as { structuredContent: { milestones: { number: number; physicalQubits: number; status: string }[] } }).structuredContent.milestones
  assert.deepEqual(milestones.map((m) => m.number), [1, 2, 3, 4, 5, 6])
  assert.deepEqual(milestones.map((m) => m.physicalQubits), [54, 100, 1000, 10000, 100000, 1000000])
  assert.deepEqual(milestones.filter((m) => m.status === 'achieved').map((m) => m.number), [1, 2])
  const one = call('roadmap', { milestone: 3 })
  assert.ok('result' in one && (one.result as { structuredContent: { milestones: { number: number }[] } }).structuredContent.milestones[0]!.number === 3)
  assert.ok('error' in call('roadmap', { milestone: 7 }) && (call('roadmap', { milestone: 7 }) as { error: { code: number } }).error.code === -32602)
})

test('the roadmap tool also serves the four application bands of the figure, each with its qubit range', () => {
  const r = call('roadmap', {})
  assert.ok('result' in r)
  const apps = (r.result as { structuredContent: { applications: { band: string; low: number; high: number }[] } }).structuredContent.applications
  assert.deepEqual(apps.map((a) => a.band), ['50k–100k', '100k–500k', '500k–5M', '5M–50M'])
  assert.equal(apps[0]!.low, 50000)
  assert.equal(apps[3]!.high, 50000000)
})

test('the circuit tool runs noise channels on the density matrix and returns expectations for Pauli observables', () => {
  const r = call('circuit', { operations: [{ gate: 'X', qubits: [{ kind: 'line', x: 0 }] }], noise: [{ name: 'amplitude_damp', gamma: 0.2 }] })
  assert.ok('result' in r)
  const data = (r.result as { structuredContent: { probabilities: number[]; trace: number } }).structuredContent
  assert.ok(Math.abs(data.probabilities[1]! - 0.8) < 1e-12 && Math.abs(data.trace - 1) < 1e-12)
  const bell = call('circuit', { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }, { gate: 'CNOT', qubits: [{ kind: 'line', x: 0 }, { kind: 'line', x: 1 }] }], observables: [{ 'line:0': 'Z', 'line:1': 'Z' }, { 'line:0': 'X', 'line:1': 'X' }] })
  assert.ok('result' in bell)
  assert.deepEqual((bell.result as { structuredContent: { expectations: number[] } }).structuredContent.expectations.map((e) => Math.round(e)), [1, 1])
})

test('the circuit tool refuses a noisy run that also measures, an unknown channel, and a circuit that does not fit its device', () => {
  const both = call('circuit', { operations: [], noise: [{ name: 'reset' }], measure: { key: 'm', qubits: [{ kind: 'line', x: 0 }] } })
  assert.ok('error' in both && both.error.code === -32602)
  const unknown = call('circuit', { operations: [{ gate: 'X', qubits: [{ kind: 'line', x: 0 }] }], noise: [{ name: 'thermal' }] })
  assert.ok('error' in unknown && unknown.error.code === -32602)
  const off = call('circuit', { operations: [{ gate: 'X', qubits: [{ kind: 'line', x: 0 }] }], device: 'Willow' })
  assert.ok('error' in off && off.error.code === -32602)
})

test('the circuit tool places operations by the insert strategy and the Toffoli gate is served', () => {
  const r = call('circuit', { operations: [{ gate: 'X', qubits: [{ kind: 'line', x: 0 }] }, { gate: 'X', qubits: [{ kind: 'line', x: 1 }] }, { gate: 'TOFFOLI', qubits: [{ kind: 'line', x: 0 }, { kind: 'line', x: 1 }, { kind: 'line', x: 2 }] }], insert: 'NEW' })
  assert.ok('result' in r)
  const amps = (r.result as { structuredContent: { amplitudes: { re: number }[] } }).structuredContent.amplitudes
  assert.ok(Math.abs(amps[7]!.re - 1) < 1e-12)
})

test('every lead that is served or partial names a tool the server serves, and every other lead says why', async () => {
  const { LEADS } = await import('./leads.js')
  const served = new Set(((handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string }[] } }).result).tools.map((t) => t.name))
  for (const lead of LEADS) {
    if (lead.status === 'served' || lead.status === 'partial') assert.ok(lead.tool && served.has(lead.tool), `${lead.id} names no served tool`)
    else assert.ok(lead.reason && lead.reason.length > 0, `${lead.id} has no reason`)
  }
})

test('the algorithm tool answers each textbook algorithm: the QFT rows, the phase estimate, Grover and teleportation', () => {
  const qft = call('algorithm', { name: 'qft', qubits: 3, input: 5 })
  assert.ok('result' in qft && (qft.result as { structuredContent: { rows: string[][] } }).structuredContent.rows.length === 8)
  const pe = call('algorithm', { name: 'phase_estimation', theta: 0.234, bits: 3 })
  assert.ok('result' in pe)
  const peRows = (pe.result as { structuredContent: { rows: string[][] } }).structuredContent.rows
  assert.equal(Number(peRows[0]![0]), 0.25)
  const grover = call('algorithm', { name: 'grover', repetitions: 10 })
  assert.ok('result' in grover && (grover.result as { structuredContent: { rows: string[][] } }).structuredContent.rows.every((r) => r[0] === '|00>'))
  const tele = call('algorithm', { name: 'teleportation' })
  assert.ok('result' in tele && (tele.result as { structuredContent: { rows: string[][] } }).structuredContent.rows.every((r) => r[1] === r[2]))
  const qaoa = call('algorithm', { name: 'qaoa', nodes: 6 })
  assert.ok('result' in qaoa)
  const summary = (qaoa.result as { structuredContent: { summary: string[][] } }).structuredContent.summary
  assert.equal(summary.find((r) => r[0] === 'Nodes')![1], '6')
  assert.ok('error' in call('algorithm', { name: 'grover_shor' }))
})

test('the software and statements and leads tools serve the stated lists, and an unknown topic is refused', () => {
  const sw = call('software', {})
  assert.ok('result' in sw && (sw.result as { structuredContent: { tools: { name: string; implemented: boolean }[] } }).structuredContent.tools.length === 5)
  const impl = (sw.result as { structuredContent: { tools: { name: string; implemented: boolean }[] } }).structuredContent.tools.filter((t) => t.implemented).map((t) => t.name)
  assert.deepEqual(impl, ['Cirq'])
  const st = call('statements', { topic: 'hardware' })
  assert.ok('result' in st && (st.result as { structuredContent: { statements: unknown[] } }).structuredContent.statements.length === 1)
  assert.ok('error' in call('statements', { topic: 'rumour' }))
  const lead = call('leads', { status: 'blocked' })
  assert.ok('result' in lead)
  const counts = (lead.result as { structuredContent: { counts: Record<string, number>; total: number } }).structuredContent
  assert.equal(counts.counts.served! + counts.counts.partial! + counts.counts.blocked! + counts.counts.out_of_scope!, counts.total)
})

test('every new tool returns a widget that uses only the host tokens', () => {
  const widgets = [
    widgetOf(call('algorithm', { name: 'qft' })),
    widgetOf(call('algorithm', { name: 'phase_estimation' })),
    widgetOf(call('algorithm', { name: 'grover', repetitions: 5 })),
    widgetOf(call('algorithm', { name: 'teleportation' })),
    widgetOf(call('algorithm', { name: 'qaoa', nodes: 4 })),
    widgetOf(call('software', {})),
    widgetOf(call('statements', {})),
    widgetOf(call('leads', {})),
    widgetOf(call('circuit', { operations: [{ gate: 'X', qubits: [{ kind: 'line', x: 0 }] }], noise: [{ name: 'depolarize', p: 0.1 }] })),
  ]
  for (const widget of widgets) {
    assert.ok(widget.includes('var(--'))
    assert.doesNotMatch(widget, /#[0-9a-f]{3,6}\b/i)
    assert.doesNotMatch(widget, /<(script|style)\b/i)
  }
})

test('the processor tool serves the Willow preprint figures and the Sycamore counts the Devices page states', () => {
  const willow = call('processor', { name: 'Willow' })
  assert.ok('result' in willow)
  const preprint = (willow.result as { structuredContent: { errorCorrectionPreprint: { lambda: { mean: number }; qubitsInDistance7Code: number; decoderLatencyMicroseconds: number } } }).structuredContent.errorCorrectionPreprint
  assert.equal(preprint.lambda.mean, 2.14)
  assert.equal(preprint.qubitsInDistance7Code, 101)
  assert.equal(preprint.decoderLatencyMicroseconds, 63)
  const sycamore = call('processor', { name: 'Sycamore' })
  assert.ok('result' in sycamore)
  const counts = (sycamore.result as { structuredContent: { qubits: number; couplers: number; statedQubits: number; statedCouplers: number } }).structuredContent
  assert.deepEqual([counts.qubits, counts.couplers], [counts.statedQubits, counts.statedCouplers])
  assert.deepEqual([counts.qubits, counts.couplers], [54, 88])
})

test('the algorithm tool factors N = 15 by Shor\'s order finding, and runs the QAOA sweep on request', () => {
  const shor = call('algorithm', { name: 'shor', N: 15, a: 7, repetitions: 20 })
  assert.ok('result' in shor)
  const summary = (shor.result as { structuredContent: { summary: string[][] } }).structuredContent.summary
  assert.equal(summary[2]![1], '4')
  assert.equal(summary[3]![1], '3 × 5')
  assert.ok('error' in call('algorithm', { name: 'shor', N: 15, a: 5 }), 'a must have no common factor with N')
  const sweep = call('algorithm', { name: 'qaoa', nodes: 6, sweep: true })
  assert.ok('result' in sweep)
  const sw = (sweep.result as { structuredContent: { summary: string[][] } }).structuredContent.summary
  const label = (l: string) => Number(sw.find((r) => r[0] === l)![1])
  assert.ok(label('Expected cut at best') > label('Random baseline'), 'the expected cut at the best angles beats the random baseline')
})

test('every device the processor tool names is served, and Sycamore23 has 23 qubits', () => {
  const s23 = call('processor', { name: 'Sycamore23' })
  assert.ok('result' in s23 && (s23.result as { structuredContent: { qubits: number } }).structuredContent.qubits === 23)
  for (const topic of ['qsim', 'qualtran', 'openfermion', 'cirq_known_devices']) {
    const r = call('statements', { topic })
    assert.ok('result' in r && (r.result as { structuredContent: { statements: { text: string }[] } }).structuredContent.statements[0]!.text.length > 20, topic)
  }
})

test('the repositories tool serves the quantumlib repositories, and filters by language', () => {
  const all = call('repositories', {})
  assert.ok('result' in all && (all.result as { structuredContent: { repositories: unknown[]; total: number } }).structuredContent.total === 15)
  const py = call('repositories', { language: 'Python' })
  assert.ok('result' in py && (py.result as { structuredContent: { repositories: { language: string }[] } }).structuredContent.repositories.every((r) => r.language === 'Python'))
})

test('the quantumlib tool lists all packages in the quantumlib organization', () => {
  const all = call('quantumlib', {})
  assert.ok('result' in all)
  const data = (all.result as { structuredContent: { repositories: unknown[]; filtered: number; total: number } }).structuredContent
  assert.equal(data.total, 15, 'all fifteen quantumlib repositories')
  assert.ok(data.filtered > 0, 'quantumlib packages are returned')
})

test('the quantumlib tool filters packages by name', () => {
  const cirq = call('quantumlib', { repository: 'Cirq' })
  assert.ok('result' in cirq)
  const data = (cirq.result as { structuredContent: { repositories: { name: string }[] } }).structuredContent
  assert.ok(data.repositories.some((r) => r.name === 'Cirq'), 'Cirq is found by name')
})

test('resources/list serves the core resources and templates, including RSA factorization records', () => {
  const list = handle({ jsonrpc: '2.0', id: 1, method: 'resources/list' })
  assert.ok('result' in list)
  const result = list.result as { resources: { uri: string; name: string }[]; templates: { uriTemplate: string }[] }
  assert.ok(result.resources.some((r) => r.uri === 'qpu://rsa'), 'rsa resource is listed')
  assert.ok(result.templates.some((t) => t.uriTemplate === 'qpu://rsa/{problem}'), 'rsa template is listed')
})

test('resources/read returns RSA factorization records: classical and quantum baselines', () => {
  const read = handle({ jsonrpc: '2.0', id: 1, method: 'resources/read', params: { uri: 'qpu://rsa/rsa-260' } })
  if ('error' in read) throw new Error(`resources/read failed: ${JSON.stringify(read.error)}`)
  assert.ok('result' in read, `expected result but got: ${JSON.stringify(read)}`)
  const result = read.result as { contents: { uri: string; text: string }[] }
  const data = JSON.parse(result.contents[0]!.text) as { problem: string; records: any[] }
  assert.equal(data.problem, 'rsa-260', 'problem is rsa-260')
  assert.ok(data.records.length > 0, 'records exist for rsa-260')
  assert.ok(data.records.some((r) => r.method === 'classical-gnfs'), 'classical record found')
})

test('qpu://rsa/{problem}/{method} retrieves specific factorization records', () => {
  const f0 = handle({ jsonrpc: '2.0', id: 1, method: 'resources/read', params: { uri: 'qpu://rsa/rsa-896/classical-gnfs' } })
  if ('error' in f0) throw new Error(`resources/read failed: ${JSON.stringify(f0.error)}`)
  const data0 = JSON.parse((f0.result as { contents: { text: string }[] }).contents[0]!.text) as { problem: string; method: string; year: number }

  assert.equal(data0.problem, 'rsa-896', 'problem is rsa-896')
  assert.equal(data0.method, 'classical-gnfs', 'method is classical-gnfs')
  assert.equal(data0.year, 2026, 'year is 2026')
})
