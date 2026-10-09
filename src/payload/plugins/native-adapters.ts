/**
 * Native foreign-API → QPU adapters.
 *
 * Discovers every in-tree / industry surface that maps onto QPU's unique sell path
 * (hex / MCP / connector / ecommerce / unix access / seal-wave). One formulated
 * registry — fused catalog, not N tools/list doors. Connect bill is measured on that list
 * and tried in court (connect.bill case).
 *
 * Clay evidence path: connector { seal: true } / { pass: i } / claySealWaveOf.
 * Full-registry discover is the discover.capacity gate (cloud.scale × court.standard).
 */
import { CombinatoricsFormulas } from '../../families/combinatorics/index.js'
import { QuantumFormulas } from '../../families/quantum/index.js'
import { CLAY_SEALS, claySealWaveOf } from '../../families/clay/index.js'
import {
  qpuHexUuidOf,
  qpuMcpToolsListOf,
  qpuServerSubmitOf,
  unit,
  type QpuEnv,
} from '../../quantum/processing/unit/index.js'
import { modeAccessOf } from './access-mode.js'
import { goalStateOf } from './goal.js'
import { catalogPriceRelationOf, nativeJobPriceOf, priceRelationOf, type PriceRelation } from './price-relation.js'
import type { QpuPlugin } from './surface.js'

/** Foreign surfaces discovered in-tree + named industry job/circuit APIs. */
export const NATIVE_VENDORS = [
  'qiskit',
  'braket',
  'cirq',
  'openqasm',
  'azure',
  'ionq',
  'rigetti',
  'pennylane',
  'dwave',
  'server',
  'mcp-anthropic',
  'mcp-openai',
  'mcp-gemini',
  'api-door',
  'domains',
  'crypt',
  'network',
  'storage',
  'stripe-ecommerce',
  'tenant',
  'access-unix',
  'seal-wave',
  'dowhy',
  'shap',
  'llm',
] as const

export type NativeVendor = (typeof NATIVE_VENDORS)[number]

/** Call shapes a foreign SDK expects — mapped, not cloned. */
export const NATIVE_SHAPES = [
  'circuit',
  'job',
  'backend',
  'shots',
  'results',
  'tools/call',
  'openapi',
  'sku',
  'mode',
  'seal',
  'tenant',
  'formula',
] as const

export type NativeShape = (typeof NATIVE_SHAPES)[number]

export type NativeAdapter = {
  /** Index in NATIVE_VENDORS — combinatorics address, not a prose slug alone. */
  i: number
  vendor: NativeVendor
  /** In-tree stub / surface that named this vendor. */
  source: string
  shapes: readonly NativeShape[]
  /** QPU door the foreign call lands on. */
  door: string
  /** Default connector/hex args; price is a court-tried relation. */
  args: Record<string, unknown>
  /** family.formula when hex-backed. */
  address: string
  hex: string | null
  /** Unix execute required to submit. */
  needsExecute: boolean
  /** Seal evidence uses claySealWaveOf; full discover only when capacity gate allows. */
  sealSafe: true
  price: PriceRelation
  holds: boolean
  example: { foreign: string; qpu: string }
}

const hexOf = (family: string, formula: string, params: number[]): string | null => {
  try {
    return qpuHexUuidOf({ family, program: [formula], params })
  } catch {
    return null
  }
}

/** Gate names foreign SDKs use → QPU exact-amplitude ops (h/x/z/cnot/cz/swap/toffoli/reset). */
const GATE_ALIASES: Record<string, string> = {
  h: 'h',
  hadamard: 'h',
  x: 'x',
  pauli_x: 'x',
  not: 'x',
  z: 'z',
  pauli_z: 'z',
  cx: 'cnot',
  cnot: 'cnot',
  cnot_gate: 'cnot',
  cz: 'cz',
  swap: 'swap',
  ccx: 'toffoli',
  toffoli: 'toffoli',
  reset: 'reset',
}

export type NativeGate = { name: string; q?: number; c?: number; t?: number; a?: number; b?: number; c2?: number }

/**
 * Normalize a foreign gate / instruction / OpenQASM-ish row into a QPU op.
 * Unknown / parametric / measure rows are dropped (counted).
 */
export const nativeGateOf = (row: unknown): NativeGate | null => {
  if (typeof row === 'string') {
    const name = GATE_ALIASES[row.toLowerCase()]
    return name ? { name, q: 0 } : null
  }
  if (!row || typeof row !== 'object' || Array.isArray(row)) return null
  const r = row as Record<string, unknown>
  const raw = String(r.name ?? r.gate ?? r.type ?? r.op ?? '').toLowerCase()
  if (!raw || raw === 'measure' || raw === 'barrier' || raw.startsWith('r')) return null
  const name = GATE_ALIASES[raw]
  if (!name) return null
  const qubits = Array.isArray(r.qubits) ? r.qubits.map(Number) : Array.isArray(r.targets) ? r.targets.map(Number) : []
  const q = typeof r.q === 'number' ? r.q : qubits[0] ?? 0
  const c = typeof r.c === 'number' ? r.c : typeof r.control === 'number' ? r.control : qubits[0]
  const t = typeof r.t === 'number' ? r.t : qubits[1] ?? 1
  if (name === 'cnot' || name === 'cz') return { name, c: c ?? 0, t: t ?? 1 }
  if (name === 'swap') return { name, a: typeof r.a === 'number' ? r.a : q, b: typeof r.b === 'number' ? r.b : t }
  if (name === 'toffoli') {
    return {
      name,
      c: typeof r.c === 'number' ? r.c : qubits[0] ?? 0,
      c2: typeof r.c2 === 'number' ? r.c2 : qubits[1] ?? 1,
      t: typeof r.t === 'number' ? r.t : qubits[2] ?? 0,
    }
  }
  return { name, q }
}

/** Parse OpenQASM 2.0 gate lines into QPU ops (measure/include dropped). */
export const nativeQasmOf = (qasm: string): { gates: NativeGate[]; dropped: number } => {
  const gates: NativeGate[] = []
  let dropped = 0
  for (const line of qasm.split(/[\n;]+/)) {
    const s = line.trim().toLowerCase()
    if (!s || s.startsWith('//') || s.startsWith('openqasm') || s.startsWith('include') || s.startsWith('qreg') || s.startsWith('creg') || s.startsWith('measure') || s.startsWith('barrier')) {
      if (s.startsWith('measure') || s.startsWith('rx') || s.startsWith('ry') || s.startsWith('rz')) dropped += 1
      continue
    }
    const m = /^(h|x|z|cx|cnot|cz|swap|ccx|toffoli|reset)\s+(.+)$/.exec(s)
    if (!m) {
      dropped += 1
      continue
    }
    const idxs = [...m[2]!.matchAll(/\[(\d+)\]/g)].map((x) => Number(x[1]))
    const op = nativeGateOf({
      name: m[1],
      qubits: idxs,
      ...(m[1] === 'cx' || m[1] === 'cnot' || m[1] === 'cz'
        ? { c: idxs[0], t: idxs[1] }
        : m[1] === 'swap'
          ? { a: idxs[0], b: idxs[1] }
          : m[1] === 'ccx' || m[1] === 'toffoli'
            ? { c: idxs[0], c2: idxs[1], t: idxs[2] }
            : { q: idxs[0] ?? 0 }),
    })
    if (op) gates.push(op)
    else dropped += 1
  }
  return { gates, dropped }
}

/** Collect gates from any foreign circuit / instructions / qasm blob. */
export const nativeGatesFromOf = (input: Record<string, unknown>): { gates: NativeGate[]; dropped: number; read: 'read' | 'absent' | 'qasm' | 'default' } => {
  if (typeof input.qasm === 'string' && input.qasm.trim()) {
    const parsed = nativeQasmOf(input.qasm)
    return { ...parsed, read: parsed.gates.length ? 'qasm' : 'default' }
  }
  const raw = input.gates ?? input.instructions ?? input.circuit ?? input.operations
  if (raw === undefined) return { gates: [], dropped: 0, read: 'absent' }
  if (!Array.isArray(raw)) return { gates: [], dropped: 1, read: 'default' }
  const gates: NativeGate[] = []
  let dropped = 0
  for (const row of raw) {
    const g = nativeGateOf(row)
    if (g) gates.push(g)
    else dropped += 1
  }
  return { gates, dropped, read: gates.length ? 'read' : 'default' }
}

const connectBillOf = () => {
  // Lazy: avoid circular import at module load; gate-court trials the measured bill.
  const tools = qpuMcpToolsListOf()
  const listBytes = JSON.stringify({ resultType: 'complete', tools }).length
  const doors = tools.length
  const qpuPrefixed = tools.filter((t) => t.name.startsWith('qpu_')).length
  const holds = doors <= 16 && listBytes < 16384 && qpuPrefixed === 0
  return {
    doors,
    bytes: listBytes,
    under16384: listBytes < 16384,
    qpuPrefixed,
    holds,
  }
}

const connectBillTriedOf = () => {
  // Dynamic so clay ↔ gate-court ↔ adapters do not cycle at load.
  return import('./gate-court.js').then(({ connectBillGateOf, discoverCapacityGateOf }) => ({
    bill: connectBillGateOf(),
    capacity: discoverCapacityGateOf(),
  }))
}

/**
 * Formulated adapter registry — every option is an MCP address (door/args/hex).
 * Combinatorics indexes the set; nothing is a bare prose list.
 */
export const nativeAdaptersOf = (): {
  kind: 'native-adapters'
  call: 'tools/call connector { adapters: true }'
  vendors: typeof NATIVE_VENDORS
  shapes: typeof NATIVE_SHAPES
  count: number
  combinations: { formula: string; hex: string | null; value: number; holds: boolean }
  adapters: NativeAdapter[]
  connectBill: ReturnType<typeof connectBillOf> & { trial?: unknown; fidelity?: unknown; courtHolds?: boolean }
  seal: { note: string; call: string; capacity: { path: string; allow: boolean; trial: unknown; holds: boolean }; court: string }
  price: PriceRelation
  goal: 'OPEN' | 'LEAD'
  holds: boolean
} => {
  const shotsHex = hexOf('quantum', 'shots', [0, 1])
  const qubitsHex = hexOf('quantum', 'qubits', [0, 0])
  const gateHex = hexOf('quantum', 'gatecount', [0, 0])
  const bin = CombinatoricsFormulas.binomial(NATIVE_VENDORS.length > 4 ? 4 : NATIVE_VENDORS.length)
  const comb = CombinatoricsFormulas.combinations(NATIVE_VENDORS.length, 1)
  // Court trials are sync — imported lazily inside nativeAnswerOf / here via require pattern avoided; use dynamic cache.
  // Native registry stays sync for enum builders; trials attach when connector answers.

  const row = (
    i: number,
    vendor: NativeVendor,
    source: string,
    shapes: readonly NativeShape[],
    door: string,
    args: Record<string, unknown>,
    address: string,
    hex: string | null,
    needsExecute: boolean,
    example: { foreign: string; qpu: string },
  ): NativeAdapter => {
    const price = catalogPriceRelationOf(vendor, { vendorIndex: i, vendor })
    return {
      i,
      vendor,
      source,
      shapes,
      door,
      args,
      address,
      hex,
      needsExecute,
      sealSafe: true,
      price,
      holds: price.holds === true,
      example,
    }
  }

  const adapters: NativeAdapter[] = [
    row(0, 'qiskit', 'sdk/adapters/qiskit.ts · src/quantum/ibm-qiskit.ts', ['circuit', 'job', 'backend', 'shots', 'results'], 'connector', { vendor: 'qiskit', native: true }, 'quantum.shots', shotsHex, true, {
      foreign: "backend.run(qc, shots=1024)  # Qiskit",
      qpu: "connector { vendor:'qiskit', gates:[{name:'h',q:0},{name:'cnot',c:0,t:1}], shots:1024 }",
    }),
    row(1, 'braket', 'sdk/adapters/braket.ts · src/quantum/aws-braket.ts', ['circuit', 'job', 'backend', 'shots', 'results'], 'connector', { vendor: 'braket', native: true }, 'quantum.gatecount', gateHex, true, {
      foreign: "device.run(circuit, shots=100)  # Braket",
      qpu: "connector { vendor:'braket', instructions:[{gate:'h',targets:[0]}], shots:100 }",
    }),
    row(2, 'cirq', 'sdk/adapters/cirq.ts', ['circuit', 'job', 'backend', 'shots', 'results'], 'connector', { vendor: 'cirq', native: true }, 'quantum.qubits', qubitsHex, true, {
      foreign: "cirq.Simulator().run(circuit, repetitions=100)",
      qpu: "connector { vendor:'cirq', gates:[{name:'h',q:0}], shots:100 }",
    }),
    row(3, 'openqasm', 'src/quantum/ibm-qiskit.ts circuitToQasm', ['circuit', 'job'], 'connector', { vendor: 'openqasm', native: true }, 'quantum.circuitdepth', hexOf('quantum', 'circuitdepth', [0, 0]), true, {
      foreign: 'OPENQASM 2.0; h q[0]; cx q[0],q[1];',
      qpu: "connector { vendor:'openqasm', qasm:'OPENQASM 2.0;\\nh q[0];\\ncx q[0],q[1];' }",
    }),
    row(4, 'azure', 'industry Azure Quantum Job / Workspace surface', ['circuit', 'job', 'backend', 'shots', 'results'], 'connector', { vendor: 'azure', native: true }, 'quantum.shots', shotsHex, true, {
      foreign: 'job = workspace.submit(circuit); job.get_results()',
      qpu: "connector { vendor:'azure', gates:[...], shots:500 }",
    }),
    row(5, 'ionq', 'sdk/cloud/ionq.ts · src/quantum/ionq-connector.ts', ['circuit', 'job', 'backend', 'results'], 'connector', { vendor: 'ionq', native: true }, 'quantum.fidelity', hexOf('quantum', 'fidelity', [0, 1]), true, {
      foreign: 'client.jobs.create(target, circuit, shots)',
      qpu: "connector { vendor:'ionq', gates:[...], shots:100 }",
    }),
    row(6, 'rigetti', 'sdk/cloud/rigetti.ts', ['circuit', 'job', 'results'], 'connector', { vendor: 'rigetti', native: true }, 'quantum.shots', shotsHex, true, {
      foreign: 'quilc / QPU execute(program)',
      qpu: "connector { vendor:'rigetti', gates:[...], shots:100 }",
    }),
    row(7, 'pennylane', 'sdk/adapters/pennylane.ts · docs/comparison.md PennyLane Lightning', ['circuit', 'job', 'shots', 'results'], 'connector', { vendor: 'pennylane', native: true }, 'quantum.states', hexOf('quantum', 'states', [0]), true, {
      foreign: 'qml.device("default.qubit"); circuit()(shots=1000)',
      qpu: "connector { vendor:'pennylane', gates:[...], shots:1000 }",
    }),
    row(8, 'dwave', 'sdk/adapters/dwave.ts · industry D-Wave sampler / Ising', ['job', 'formula'], 'hex', { family: 'quantum', program: ['gatecount'], params: [0, 0] }, 'quantum.gatecount', gateHex, true, {
      foreign: 'sampler.sample_ising(h, J, num_reads=100)',
      qpu: "hex { family:'quantum', program:['gatecount'], params:[n,k] } · connector { vendor:'dwave', gates:[...] }",
    }),
    row(9, 'server', 'src/quantum/processing/unit qpuServerSubmitOf /server', ['circuit', 'job', 'backend', 'shots', 'results'], 'server_submit', { gates: [] }, 'server.submit', null, true, {
      foreign: 'POST /server tools/call server_submit { gates }',
      qpu: 'tools/call server_submit { gates:[{name:h,q:0},{name:cnot,c:0,t:1}] }',
    }),
    row(10, 'mcp-anthropic', 'src/quantum/processing/unit/mcp.ts vendors.anthropic', ['tools/call'], 'connector', { adapters: true, vendor: 'mcp-anthropic' }, 'door.catalog', null, false, {
      foreign: 'Anthropic tools: [{ name, description, input_schema }]',
      qpu: 'GET /mcp catalogue · vendors.anthropic on each sealed tool',
    }),
    row(11, 'mcp-openai', 'src/quantum/processing/unit/mcp.ts vendors.openai', ['tools/call'], 'connector', { adapters: true, vendor: 'mcp-openai' }, 'door.catalog', null, false, {
      foreign: 'OpenAI functions: [{ type:function, function:{ name, parameters } }]',
      qpu: 'GET /mcp · vendors.openai',
    }),
    row(12, 'mcp-gemini', 'src/quantum/processing/unit/mcp.ts vendors.gemini', ['tools/call'], 'connector', { adapters: true, vendor: 'mcp-gemini' }, 'door.catalog', null, false, {
      foreign: 'Gemini functionDeclarations:[{ name, parameters }]',
      qpu: 'GET /mcp · vendors.gemini',
    }),
    row(13, 'api-door', 'src/mcp/api-door.ts · fused api', ['openapi', 'formula'], 'api', {}, 'api.call', hexOf('api', 'call', [0, 0, 0]), false, {
      foreign: 'OpenAPI GET operation from apis.guru registry',
      qpu: "tools/call api { api, operation, params } → api.call(i,j,s) hex",
    }),
    row(14, 'domains', 'src/payload/plugins/domains.ts', ['formula'], 'domains', {}, 'domains.readings', null, false, {
      foreign: 'domain reading crypto|color|sound|health',
      qpu: 'tools/call domains {} · /api/qpu/domains',
    }),
    row(15, 'crypt', 'src/mcp/qpu-fused.ts crypt · families/crypt', ['formula'], 'crypt', {}, 'crypt.knownAnswers', hexOf('crypt', 'knownAnswers', []), false, {
      foreign: 'post-quantum / curve bit readings',
      qpu: "tools/call crypt {} | hex { family:'crypt', program:['curveQuantumBits'], params:[256] }",
    }),
    row(16, 'network', 'qpuSequenceOf network extras /network', ['tools/call'], 'net_catalog', {}, 'network.catalog', null, false, {
      foreign: 'POST /network tools/list · net_*',
      qpu: 'tools/call net_catalog {}',
    }),
    row(17, 'storage', 'qpuSequenceOf storage extras /storage', ['tools/call'], 'storage_catalog', {}, 'storage.catalog', null, false, {
      foreign: 'POST /storage tools/list · storage_*',
      qpu: 'tools/call storage_catalog {}',
    }),
    row(18, 'stripe-ecommerce', 'ecommerce plugin · @payloadcms/plugin-stripe', ['sku', 'formula'], 'connector', { ecommerce: true }, 'ecommerce.cart', hexOf('ecommerce', 'cart', [0, 0]), false, {
      foreign: 'Stripe Checkout / Payload products (price = priceRelationOf)',
      qpu: "connector { ecommerce: true } · hex ecommerce.* · catalogPriceRelationOf",
    }),
    row(19, 'tenant', 'src/payload/plugins/tenants.ts', ['tenant', 'tools/call'], 'connector', { tenants: true }, 'connector.tenant', null, false, {
      foreign: 'multi-tenant product / model seat',
      qpu: "connector { tenant: '<slug>' } | { tenants: true }",
    }),
    row(20, 'access-unix', 'src/payload/plugins/access-mode.ts', ['mode'], 'connector', { access: true, mode: 5, who: 'other' }, 'access.read', hexOf('access', 'read', [2, 0]), false, {
      foreign: 'RBAC / IAM policy check',
      qpu: "connector { access: true, mode: 0..7, who: 'other'|'user'|'group'|'owner' } · court { case:'access.screen' }",
    }),
    row(21, 'seal-wave', 'src/families/clay claySealWaveOf · SealWavePanel', ['seal', 'formula'], 'connector', { seal: true }, 'clay.pass', hexOf('clay', 'bsd', []), true, {
      foreign: 'clay.pass related discover (capacity-gated)',
      qpu: "connector { seal: true } | { pass: i } · claySealWaveOf · court { case:'discover.capacity' }",
    }),
    row(22, 'dowhy', 'src/mcp/api-adapters.ts DoWhyAdapter', ['formula'], 'hex', { family: 'causal', program: ['pairs'], params: [0, 0] }, 'causal', null, false, {
      foreign: 'DoWhy validateDAG(model)',
      qpu: 'hex causal / path formulas · MCP theorem bridge (api-adapters)',
    }),
    row(23, 'shap', 'src/mcp/api-adapters.ts SHAPAdapter', ['formula'], 'hex', { family: 'xai', program: ['importance'], params: [0] }, 'xai', null, false, {
      foreign: 'SHAP feature importance vector',
      qpu: 'hex xai / explainable formulas · MCP theorem bridge',
    }),
    row(24, 'llm', 'src/integrations/llm-connector.ts · qpuHostsOf', ['tools/call', 'tenant'], 'connector', { model: true }, 'host.llm', null, false, {
      foreign: 'OpenAI/Anthropic chat.completions.create',
      qpu: "connector { model: '<llm>' } · formulatedModelsOf seats",
    }),
  ]

  const holds = adapters.length === NATIVE_VENDORS.length && adapters.every((a) => a.holds && a.sealSafe && a.price.holds === true)
  const bill = connectBillOf()
  return {
    kind: 'native-adapters' as const,
    call: 'tools/call connector { adapters: true }' as const,
    vendors: NATIVE_VENDORS,
    shapes: NATIVE_SHAPES,
    count: adapters.length,
    combinations: {
      formula: `combinatorics.combinations(${NATIVE_VENDORS.length},1)`,
      hex: comb.hex ?? bin.hex ?? null,
      value: Number(comb.value),
      holds: comb.holds === true,
    },
    adapters,
    connectBill: bill,
    seal: {
      note: 'foreign jobs take seal evidence via claySealWaveOf; discover path is capacity-gated',
      call: 'tools/call connector { seal: true } | { pass: i }',
      capacity: { path: 'seal-wave', allow: false, trial: null, holds: false },
      court: 'tools/call connector { court: true, case: discover.capacity }',
    },
    price: catalogPriceRelationOf('native-adapters'),
    goal: goalStateOf(),
    holds,
  }
}

/** Enum options for ecommerce / Payload selects — one MCP address per vendor. */
export const nativeAdapterEnumOf = () => {
  const reg = nativeAdaptersOf()
  return {
    name: 'nativeAdapter' as const,
    label: 'Native foreign→QPU adapter',
    collection: 'variantTypes' as const,
    source: 'nativeAdaptersOf · connector { adapters: true } · seal-wave safe',
    improves: ['combinatorics', 'access', 'seal', 'serve'] as const,
    options: reg.adapters.map((a) => ({
      value: a.vendor,
      label: `${a.i}:${a.vendor}`,
      door: a.door,
      args: a.args,
      address: a.address,
      hex: a.hex,
      params: a.shapes,
      price: a.price,
    })),
  }
}

/** Shot / batch grids as combinatorics × quantum.shots — lattice-named, not invented. */
export const nativeShotGridOf = (shots = 0, batches = 1) => {
  const s = QuantumFormulas.shots(Math.max(0, shots), Math.max(1, batches))
  const bin = CombinatoricsFormulas.binomial(Math.min(4, Math.max(1, batches)))
  return {
    kind: 'native-shot-grid' as const,
    shots: s,
    binomial: { formula: 'combinatorics.binomial', value: bin.value, hex: bin.hex ?? null, holds: bin.holds === true },
    note: 'QPU exact computer uses mintOf(n) shots; foreign shots are a quantum.shots reading',
    price: priceRelationOf({ shots: Math.max(0, shots), batches: Math.max(1, batches), latticeCost: true, slug: 'shot-grid' }),
  }
}

/**
 * Run a foreign-shaped job on QPU's exact computer.
 * Access = Unix mode (execute to submit). Seal evidence = claySealWaveOf(pass).
 */
export const nativeJobOf = async (input: Record<string, unknown> = {}) => {
  const vendorRaw = typeof input.vendor === 'string' ? input.vendor.toLowerCase() : 'server'
  const vendor = (NATIVE_VENDORS.includes(vendorRaw as NativeVendor) ? vendorRaw : 'server') as NativeVendor
  const vendorIndex = NATIVE_VENDORS.indexOf(vendor)
  const mode = typeof input.mode === 'number' && Number.isSafeInteger(input.mode) ? input.mode : 5
  const who = typeof input.who === 'string' ? input.who : 'other'
  const access = modeAccessOf({
    mode,
    who: who as 'other' | 'user' | 'group' | 'owner',
  })
  const pass = typeof input.pass === 'number' && Number.isSafeInteger(input.pass) ? input.pass & 7 : 0
  const wantSeal = input.seal === true || input.pass !== undefined
  const jobPrice = (shots = 0, sealIndex = pass) =>
    nativeJobPriceOf({ vendorIndex, vendor, shots, batches: 1, mode, sealIndex })

  // Catalogue / non-execute surfaces
  if (vendor === 'seal-wave' || (wantSeal && input.gates === undefined && input.qasm === undefined && input.instructions === undefined)) {
    const wave = await claySealWaveOf(pass)
    const price = jobPrice(0, pass)
    return {
      kind: 'native-job' as const,
      vendor,
      surface: 'seal-wave' as const,
      call: wantSeal && input.pass === undefined && input.seal === true
        ? 'tools/call connector { seal: true }'
        : `tools/call connector { pass: ${pass} }`,
      seal: wave
        ? {
            i: wave.i,
            name: wave.name,
            hex: wave.hex,
            held: wave.held,
            involutive: wave.involutive,
            discover: wave.discover,
            fullDiscover: wave.seal ?? 'qpuDiscoverOf full registry OOMs ~4GB',
          }
        : null,
      access: { decides: access.decides, mode: access.unix.mode, who: access.unix.who },
      connectBill: connectBillOf(),
      price,
      holds: wave?.involutive === true && price.holds === true,
      goal: goalStateOf(),
      note: 'seal-wave = claySealWaveOf (fullDiscover OOMs)',
    }
  }

  if (!access.decides.execute && !access.decides.call) {
    const price = jobPrice()
    return {
      kind: 'native-job' as const,
      vendor,
      holds: false as const,
      denied: 'access.execute' as const,
      access: { decides: access.decides, mode: access.unix.mode, who: access.unix.who },
      connectBill: connectBillOf(),
      price,
      goal: goalStateOf(),
      note: 'Unix mode needs x (execute) or public call bit to submit / map',
    }
  }

  const { gates, dropped, read } = nativeGatesFromOf(input)
  const shotsAsked = typeof input.shots === 'number' && Number.isSafeInteger(input.shots) ? Math.max(0, input.shots) : 0
  const shotGrid = nativeShotGridOf(shotsAsked, 1)

  // Non-circuit vendors resolve to their formulated door (no invented foreign call).
  if (gates.length === 0 && !['qiskit', 'braket', 'cirq', 'openqasm', 'azure', 'ionq', 'rigetti', 'pennylane', 'dwave', 'server'].includes(vendor)) {
    const reg = nativeAdaptersOf()
    const adapter = reg.adapters.find((a) => a.vendor === vendor)!
    const price = adapter.price
    return {
      kind: 'native-job' as const,
      vendor,
      surface: 'formulated-door' as const,
      adapter,
      door: adapter.door,
      args: adapter.args,
      example: adapter.example,
      access: { decides: access.decides, mode: access.unix.mode, who: access.unix.who },
      connectBill: connectBillOf(),
      price,
      holds: price.holds === true,
      goal: goalStateOf(),
    }
  }

  const job = qpuServerSubmitOf({
    gates: gates.length
      ? gates
      : [
          { name: 'h', q: 0 },
          { name: 'cnot', c: 0, t: 1 },
        ],
  })

  let seal: Awaited<ReturnType<typeof claySealWaveOf>> | null = null
  if (wantSeal) {
    seal = await claySealWaveOf(pass)
  }

  // Foreign-shaped result envelopes (compatibility, not vendor clones).
  const counts: Record<string, number> = {}
  for (const row of job.counts as { i: number; w: number }[]) {
    const bits = job.support?.length ? Number(row.i).toString(2).padStart(3, '0') : String(row.i)
    counts[bits] = (counts[bits] ?? 0) + row.w
  }
  const foreign = (() => {
    switch (vendor) {
      case 'qiskit':
      case 'azure':
      case 'pennylane':
        return { job_id: `qpu-${job.id}`, status: job.status === 'done' ? 'COMPLETED' : 'FAILED', result: { counts }, backend: unit.host }
      case 'braket':
        return { taskArn: `arn:qpu:${unit.host}:task/${job.id}`, status: 'COMPLETED', result: { measurements: job.support, resultTypes: ['Sample'] } }
      case 'cirq':
        return { id: job.id, repetitions: job.shots, histogram: counts }
      case 'ionq':
      case 'rigetti':
        return { id: `qpu-${job.id}`, status: 'completed', result: { counts }, backend: unit.host }
      case 'openqasm':
        return { qasm: typeof input.qasm === 'string' ? input.qasm : null, counts, shots: job.shots }
      case 'dwave':
        return { sample_id: job.id, energy: job.index, num_occurrences: job.shots, solution: job.support }
      default:
        return { id: job.id, status: job.status, counts, shots: job.shots, backend: unit.host }
    }
  })()

  const price = jobPrice(shotsAsked, pass)
  return {
    kind: 'native-job' as const,
    vendor,
    surface: 'qpuServerSubmitOf' as const,
    backend: unit.host,
    read,
    dropped,
    gates: job.gates,
    shots: { asked: shotsAsked, qpu: job.shots, grid: shotGrid },
    result: {
      index: job.index,
      counts: job.counts,
      support: job.support,
      collapsed: job.collapsed,
      holds: job.holds,
    },
    foreign,
    seal: seal
      ? {
          i: seal.i,
          name: seal.name,
          hex: seal.hex,
          held: seal.held,
          involutive: seal.involutive,
          discover: seal.discover,
          seals: CLAY_SEALS,
          note: 'claySealWaveOf — discover skipped',
        }
      : { note: 'pass seal:true or pass:i for claySealWaveOf evidence', call: 'connector { seal: true }' },
    access: { decides: access.decides, mode: access.unix.mode, who: access.unix.who },
    connectBill: connectBillOf(),
    price,
    holds: job.holds === true && price.holds === true && (seal ? seal.involutive === true : true),
    goal: goalStateOf(),
    tree: {
      fullDiscover: 'qpuDiscoverOf OOMs ~4GB — seal-wave is the clay path',
      ticket: price.ticket,
      court: price.court,
      foreignHardware: 'live IBM|Braket|Azure → formulated ticket hex + court-tried priceRelationOf on qpuServerSubmitOf',
    },
  }
}

/** Connector / HTTP entry: catalogue, one vendor, or submit. */
export const nativeAnswerOf = async (args: Record<string, unknown> = {}) => {
  if (args.man === true) {
    return {
      kind: 'man' as const,
      name: 'native-adapters',
      synopsis: 'Foreign quantum/compute API shapes → QPU hex/MCP/connector. Catalogue { adapters: true }. Submit { vendor, gates|qasm|instructions, shots?, seal?, pass?, mode?, who? }.',
      seal: 'claySealWaveOf via { seal: true } / { pass: i }; discover.capacity court-tried',
      connectBill: connectBillOf(),
      court: 'connector { court: true }',
      holds: true as const,
      goal: goalStateOf(),
    }
  }
  if (args.adapters === true || args.native === true && args.vendor === undefined && args.gates === undefined && args.qasm === undefined) {
    const reg = nativeAdaptersOf()
    const { bill, capacity } = await connectBillTriedOf()
    return {
      ...reg,
      connectBill: {
        ...reg.connectBill,
        doors: bill.gate.value,
        holds: bill.allow,
        trial: bill.trial,
        fidelity: bill.fidelity,
        courtHolds: bill.holds,
      },
      seal: {
        ...reg.seal,
        capacity: {
          path: capacity.path,
          allow: capacity.allow,
          trial: capacity.trial,
          holds: capacity.holds,
        },
        note: `path=${capacity.path}; court.standard allow=${capacity.allow}`,
      },
      court: { bill, capacity, via: 'connector { court: true }' as const },
      connector: { kind: 'connector' as const, call: 'tools/call connector { adapters: true }' },
    }
  }
  if (typeof args.vendor === 'string' || Array.isArray(args.gates) || typeof args.qasm === 'string' || Array.isArray(args.instructions) || args.native === true) {
    return nativeJobOf(args)
  }
  return nativeAdaptersOf()
}

export const publicNativeOf = async (request?: Request, _env?: QpuEnv): Promise<Response> => {
  const url = request ? new URL(request.url) : null
  const vendor = url?.searchParams.get('vendor') ?? undefined
  const seal = url?.searchParams.get('seal') === '1' || url?.searchParams.get('seal') === 'true'
  const passRaw = url?.searchParams.get('pass')
  const pass = passRaw !== null && passRaw !== undefined && /^\d+$/.test(passRaw) ? Number(passRaw) : undefined
  const body =
    vendor || seal || pass !== undefined
      ? await nativeJobOf({
          ...(vendor ? { vendor } : { adapters: true }),
          ...(seal ? { seal: true } : {}),
          ...(pass !== undefined ? { pass } : {}),
        })
      : nativeAdaptersOf()
  return Response.json(body, {
    headers: { 'cache-control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=120' },
  })
}

export const nativeAdaptersPlugin = (): QpuPlugin => (config) => ({
  ...config,
  endpoints: [
    ...(config.endpoints ?? []),
    {
      path: '/qpu/native',
      method: 'get' as const,
      handler: async (req: Request) => publicNativeOf(req),
    },
    {
      path: '/qpu/native',
      method: 'post' as const,
      handler: async (req: Request) => {
        const args = (await req.json().catch(() => ({}))) as Record<string, unknown>
        return Response.json(await nativeAnswerOf(args))
      },
    },
  ],
})
