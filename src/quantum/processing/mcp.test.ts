import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { handle, callOf } from './mcp.ts'
import { LEADS, listCleanupSubjects } from './leads.ts'

const call = (name: string, args: unknown): any => callOf(name, args)

test('tools/list serves the forty-seven tools in twelve toolboxes with input schemas, and initialize names the server', () => {
  const init = handle({ jsonrpc: '2.0', id: 0, method: 'initialize' })
  assert.ok('result' in init && (init.result as { serverInfo: { name: string } }).serverInfo.name === 'qpu')
  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
  assert.ok('result' in list)
  const tools = (list.result as { tools: { name: string; inputSchema: object }[] }).tools
  const byToolbox: Record<string, string[]> = {}
  for (const t of tools as { name: string; _meta?: { toolbox?: string } }[]) (byToolbox[t._meta?.toolbox ?? 'none'] ??= []).push(t.name)
  assert.deepEqual(byToolbox, {
    google: ['processor', 'circuit', 'echo', 'echo_benchmark', 'roadmap', 'algorithm', 'software', 'statements', 'repositories', 'quantumlib', 'quantum-error-correction', 'chemistry-simulation', 'fault-tolerant-design'],
    tree: ['clay', 'match', 'verify', 'leads', 'audit', 'metrics', 'textbook', 'css', 'dashboard', 'clone'], // the Clay set first
    flow: ['discover', 'wave', 'readiness', 'imagine', 'e2e', 'shard'],
    language: ['translate', 'prose'],
    raid: ['mongo'],
    billing: ['stripe', 'currency'],
    legal: ['legal', 'compete', 'patents'],
    repository: ['repository'],
    standards: ['jsonld', 'codes', 'validate'],
    payload: ['payload', 'configure'],
    extension: ['extend'],
    crypto: ['fold', 'seal', 'attest'],
  }, 'every tool names its toolbox in _meta, and the twelve toolboxes hold the forty-seven tools')
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
  assert.ok('error' in handle({ jsonrpc: '2.0', id: 2, method: 'prompts/list' })) // resources are served now (MCP Apps); prompts are not
})

test('the handler runs in a browser: it imports nothing from Node', () => {
  for (const file of ['mcp.ts', 'cirq.ts', 'echo.ts', 'processor.ts']) {
    assert.doesNotMatch(readFileSync(new URL(`./${file}`, import.meta.url), 'utf8'), /from ['"]node:/, `${file} imports a Node built-in`)
  }
})

const readWidget = (reply: ReturnType<typeof handle>): string => {
  assert.ok('result' in reply)
  const widget = (reply.result as { _meta?: { widget?: unknown } })._meta?.widget
  assert.equal(typeof widget, 'string')
  return widget as string
}

test('every tool returns a widget that uses the host tokens and no literal colours', () => {
  const widgets = [
    readWidget(call('processor', { name: 'Willow' })),
    readWidget(call('circuit', { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }] })),
    readWidget(call('circuit', { operations: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }], measure: { key: 'm', qubits: [{ kind: 'line', x: 0 }] }, repetitions: 50 })),
    readWidget(call('echo', { forward: [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }] })),
    readWidget(call('echo_benchmark', {})),
    readWidget(call('roadmap', {})),
  ]
  for (const widget of widgets) {
    assert.ok(widget.length > 0 && widget.includes('var(--'))
    assert.doesNotMatch(widget, /#[0-9a-f]{3,6}\b/i, 'a widget writes no literal hex colour')
    assert.doesNotMatch(widget, /<(script|style)\b/i, 'a widget carries no script or style block')
  }
})

test('the widget shows the result it was built from: the processor qubit count and the benchmark speedup', () => {
  assert.match(readWidget(call('processor', { name: 'Willow' })), />105</)
  assert.match(readWidget(call('echo_benchmark', {})), />13,000×</)
})

test('a widget escapes text from the caller, so a name cannot inject markup', () => {
  const widget = readWidget(call('circuit', { operations: [], measure: { key: '<img src=x onerror=1>', qubits: [{ kind: 'line', x: 0 }] }, repetitions: 1 }))
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
  assert.equal(Object.values(counts.counts).reduce((a, b) => a + b, 0), counts.total)
})

test('every new tool returns a widget that uses only the host tokens', () => {
  const widgets = [
    readWidget(call('algorithm', { name: 'qft' })),
    readWidget(call('algorithm', { name: 'phase_estimation' })),
    readWidget(call('algorithm', { name: 'grover', repetitions: 5 })),
    readWidget(call('algorithm', { name: 'teleportation' })),
    readWidget(call('algorithm', { name: 'qaoa', nodes: 4 })),
    readWidget(call('software', {})),
    readWidget(call('statements', {})),
    readWidget(call('leads', {})),
    readWidget(call('circuit', { operations: [{ gate: 'X', qubits: [{ kind: 'line', x: 0 }] }], noise: [{ name: 'depolarize', p: 0.1 }] })),
  ]
  for (const widget of widgets) {
    assert.ok(widget.includes('var(--'))
    assert.doesNotMatch(widget, /style="[^"]*#[0-9a-f]{3,6}\b/i)
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
  // re-fused, not refused: a that shares a factor with N is that factor already (Euclid, Shor's own classical step)
  const shared = (call('algorithm', { name: 'shor', N: 15, a: 5 }) as { result?: { structuredContent?: { sharedFactor?: number; factors?: string[] } } }).result?.structuredContent
  assert.deepEqual([shared?.sharedFactor, shared?.factors], [5, [3, 5]], 'a = 5 shares the factor 5 with N = 15: Euclid finds it, the factors sorted')
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

test('the repositories tool serves the seventeen quantumlib repositories, and filters by language', () => {
  const all = call('repositories', {})
  assert.ok('result' in all && (all.result as { structuredContent: { repositories: unknown[]; total: number } }).structuredContent.total === 15)
  const py = call('repositories', { language: 'Python' })
  assert.ok('result' in py && (py.result as { structuredContent: { repositories: { language: string }[] } }).structuredContent.repositories.every((r) => r.language === 'Python'))
})

test('a cleanup lead parses to the subjects whose absence settles it: paths or git branches, and nothing else parses', () => {
  const cleanups = LEADS.filter((l) => listCleanupSubjects(l))
  assert.equal(cleanups.length, 4)
  assert.deepEqual(listCleanupSubjects(LEADS.find((l) => l.id === 'cleanup-census-consolidated')!), { kind: 'paths', names: ['scripts/census.lean'] })
  assert.deepEqual(listCleanupSubjects(LEADS.find((l) => l.id === 'cleanup-auto-release-script')!), { kind: 'paths', names: ['scripts/auto-release.ts'] })
  assert.deepEqual(listCleanupSubjects(LEADS.find((l) => l.id === 'cleanup-next-build-dir')!), { kind: 'paths', names: ['.next'] })
  assert.deepEqual(listCleanupSubjects(LEADS.find((l) => l.id === 'cleanup-stale-branches')!), { kind: 'branches', names: ['snapshot/pre-purge', 'purge/google-only'] })
  assert.equal(listCleanupSubjects(LEADS.find((l) => l.id === 'cleanup-fnv1a-consolidated')!), null, 'a cleanup served by a tool is settled by that tool, not by absence')
})

test('the cheapest view: an LLM reads only the cheapest way to have the answer and what tampering with it would cost, the full answer kept in structuredContent', () => {
  const call = (meta?: Record<string, unknown>) => handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'configure', arguments: { kind: 'adapters', port: 32 }, ...(meta ? { _meta: meta } : {}) } }) as { result: { content: { text: string }[]; structuredContent: unknown; _meta: { block: { meta: { id: string } } } } }
  const full = call(), cheap = call({ view: 'cheapest' })
  const v = JSON.parse(cheap.result.content[0]!.text) as { address: string; sha256: string; recompute: { tool: string }; tamper: { collision: string }; coins: number; unlock: string; theorem: string; tokens: number }
  assert.equal(v.address, full.result._meta.block.meta.id, 'the same address: the answer is the same block')
  assert.equal(v.recompute.tool, 'configure')
  assert.equal(v.sha256.length, 64)
  assert.equal(v.tamper.collision, '2^128')
  assert.ok(v.coins > 0 && v.unlock.startsWith('If-None-Match') && v.theorem === 'textbook_advantage_unbounded', 'a coil names its price in coins a call and how the address unlocks the unbounded advantage')
  const l = JSON.parse(cheap.result.content[0]!.text) as { licence: string; commercial: string }
  assert.ok(l.licence === 'CC-BY-NC-ND-4.0' && l.commercial === 'a licence of the catalogue', 'the view carries the licence: a coil\'s commercial use needs a licence of the catalogue')
  const small = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'fold', arguments: { radices: [10, 10], index: '42' }, _meta: { view: 'cheapest' } } }) as { result: { content: { text: string }[]; structuredContent: unknown } }
  assert.equal(small.result.content[0]!.text, JSON.stringify(small.result.structuredContent), 'a small answer is its own cheapest form')
  assert.ok(cheap.result.content[0]!.text.length * 4 < full.result.content[0]!.text.length, 'the cheapest view is a fraction of the full answer')
  assert.deepEqual(cheap.result.structuredContent, full.result.structuredContent, 'the full answer stays for the interfaces that render it')
})

test('harmonic options by default: every enum of a schema a superposition of its combinations, the referrer or the a432 key choosing the default', () => {
  const list = (params?: Record<string, unknown>) => (handle({ jsonrpc: '2.0', id: 1, method: 'tools/list', ...(params ? { params } : {}) }) as { result: { tools: { name: string; inputSchema: { properties: Record<string, { enum?: unknown[]; default?: unknown }>; 'x-harmonic'?: { combinations: string; index: string; from: string } } }[] } }).result.tools
  const plain = list(), referred = list({ prev: '941ef62e-d97b-2438-bfc8-22ae9e5da781' })
  const withEnums = plain.filter((t) => t.inputSchema['x-harmonic'] !== undefined) // the tools whose enums carry no default of their own
  assert.ok(withEnums.length > 5)
  for (const t of withEnums) {
    const h = t.inputSchema['x-harmonic']!
    assert.equal(h.from, 'a432')
    assert.ok(BigInt(h.index) < BigInt(h.combinations), 'the remainder names a combination')
    for (const p of Object.values(t.inputSchema.properties)) if (Array.isArray(p.enum) && p.default !== undefined) assert.ok(p.enum.includes(p.default), 'the default is one of the values: the superposition is kept')
  }
  const r = referred.find((t) => t.name === withEnums[0]!.name)!
  assert.equal(r.inputSchema['x-harmonic']!.from, 'referrer')
})

test('selecting options in combinatorial RBAC: a role lists only the enum values it may choose, an enum with none withheld, the default within its options', () => {
  const tool = (role: string, name: string) => ((handle({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: { role } }) as { result: { tools: { name: string; inputSchema: { properties: Record<string, { enum?: string[]; default?: string }>; 'x-harmonic'?: { withheld?: string[] } } }[] } }).result.tools.find((t) => t.name === name)!)
  assert.deepEqual(tool('reader', 'mongo').inputSchema.properties.op!.enum, ['find', 'restore', 'verify', 'health', 'associate', 'validate'])
  assert.deepEqual(tool('writer', 'mongo').inputSchema.properties.op!.enum, ['find', 'insert', 'update', 'mirror', 'restore', 'verify', 'health', 'associate', 'validate'])
  assert.deepEqual(tool('admin', 'mongo').inputSchema.properties.op!.enum, ['find', 'insert', 'update', 'delete', 'mirror', 'restore', 'verify', 'health', 'associate', 'validate'])
  assert.ok(!('workflow' in tool('reader', 'repository').inputSchema.properties), 'a reader chooses no workflow: the enum is withheld')
  assert.ok(tool('reader', 'repository').inputSchema['x-harmonic']!.withheld!.includes('workflow'))
  assert.ok(!tool('writer', 'stripe').inputSchema.properties.op!.enum!.includes('settle'), 'settling is the admin\'s')
})
