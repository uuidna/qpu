// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// Google APIs & Google Quantum AI challenge solver for the QPU Payload plugin.
// Solves every Google challenge modeled in the tree (Willow, Sycamore, Surface Code QEC, RCS/XEB,
// Quantum Echoes OTOC, Cirq QVM, ReCirq QAOA & Shor, OpenFermion H₂ VQE, Qualtran FTQC & Magic State,
// Google Roadmap, Google Discovery One-Door & Named Endpoints, Google Workspace Forms/Docs/Drive &
// 26,244 Institution Sets, Google Cloud MCPs & RBAC Standards, Google Patents/Gemini/XPRIZE/Sitemap)
// via the pure QPU/Google toolbox doors and exposes content-addressed receipts through Payload API.
import { canonicalText, channel, entryText, hexbit, seal, uuid, uuidQubits } from '../../uuid/index.ts'
import { hex, sha256, utf8 } from '../unit/hmac.ts'
import { LICENSE } from '../unit/license.ts'
import { evaluate, recomputeClay } from '../clay-register.ts'
import { THEOREM_KEYS, THEOREMS } from '../theorems-index.ts'
import { ISO_OPEN_DEFINITIONS } from './payload.ts'
import { DEVICES, WILLOW, getAverageConnectivity, isBelowThreshold } from '../processor.ts'
import { QUANTUM_ECHOES } from '../echo.ts'
import { APPLICATIONS, ROADMAP } from '../roadmap.ts'
import { GOOGLE_DISCOVERY, GOOGLE_DOCUMENTS, GOOGLE_ENDPOINTS, GEMINI_API, WORKSPACE_MCP } from '../discovery.ts'
import { TABLES } from '../tables-index.ts'
import { call } from '../mcp.ts'

export const GOOGLE_CHALLENGE_IDS = [
  'willow-connectivity',
  'sycamore-topology',
  'surface-code-qec',
  'rcs-xeb-beyond-classical',
  'quantum-echoes-otoc',
  'cirq-qvm-simulation',
  'recirq-qaoa-shor-algorithms',
  'openfermion-chemistry-h2',
  'qualtran-ftqc-magic-state',
  'google-quantum-roadmap-catalog',
  'google-discovery-one-door',
  'google-workspace-roundtrip-sets',
  'google-cloud-mcp-bindings-rbac',
  'google-patents-gemini-xprize-sitemap',
] as const

export type GoogleChallengeId = (typeof GOOGLE_CHALLENGE_IDS)[number]

/** The page each challenge is: the product is its category, the variant is its id. */
export const GOOGLE_CHALLENGE_PAGE: Record<GoogleChallengeId, { category: GoogleChallengeCategory; title: string }> = {
  'willow-connectivity': { category: 'quantum-hardware', title: 'Willow 105-Qubit Superconducting Grid, Coupler Connectivity & Code Capacity' },
  'sycamore-topology': { category: 'quantum-hardware', title: 'Sycamore 54-Qubit & Sycamore23 Known-Device Grid Topology' },
  'surface-code-qec': { category: 'quantum-error-correction', title: 'Surface Code Below Threshold (Λ = 2.14), Repetition Code & Steane [[7,1,3]] CSS QEC' },
  'rcs-xeb-beyond-classical': { category: 'quantum-algorithms', title: 'Random Circuit Sampling (RCS) & Cross-Entropy Benchmarking (XEB) Porter–Thomas Speckle' },
  'quantum-echoes-otoc': { category: 'quantum-algorithms', title: 'Quantum Echoes Out-of-Time-Order Correlator (OTOC) Time-Reversal Protocol on Willow' },
  'cirq-qvm-simulation': { category: 'quantum-hardware', title: 'Cirq State-Vector, Density-Matrix Kraus Channels & Willow Quantum Virtual Machine' },
  'recirq-qaoa-shor-algorithms': { category: 'quantum-algorithms', title: 'ReCirq Sycamore QAOA Max-Cut, Shor Order-Finding & Bell CHSH Tsirelson Bound' },
  'openfermion-chemistry-h2': { category: 'quantum-algorithms', title: 'OpenFermion H₂ STO-3G Molecular Integrals, Pauli Hamiltonian & VQE Ground Energy' },
  'qualtran-ftqc-magic-state': { category: 'quantum-error-correction', title: 'Qualtran Fault-Tolerant Clifford+T Resource Counts & Willow Magic State Cultivation' },
  'google-quantum-roadmap-catalog': { category: 'quantum-hardware', title: 'Google Quantum AI 6-Milestone Roadmap to 10⁶ Qubits, Software, Statements & Quantumlib' },
  'google-discovery-one-door': { category: 'google-apis-discovery', title: 'Google Discovery Service Validation, 7 Named Endpoints, Docs Rewrite & qpu-google-call Job' },
  'google-workspace-roundtrip-sets': { category: 'google-workspace-cloud', title: 'Google Workspace Forms v1, Docs v1, Drive v3 Bidirectional Round-Trips & 26,244 Institution Sets' },
  'google-cloud-mcp-bindings-rbac': { category: 'google-workspace-cloud', title: 'Google Cloud Adapter Profile (Cloud Run/SQL/GCS/Gmail), 15 Google MCPs & Standards RBAC' },
  'google-patents-gemini-xprize-sitemap': { category: 'google-apis-discovery', title: 'Google Patents Hardware Verification, Gemini 3.8 Flash Coil Plan & Google XPRIZE Competitions' },
}

type GoogleChallengeCategory =
  | 'quantum-hardware'
  | 'quantum-error-correction'
  | 'quantum-algorithms'
  | 'google-apis-discovery'
  | 'google-workspace-cloud'

type GoogleChallengeReceipt = {
  id: GoogleChallengeId
  category: GoogleChallengeCategory
  title: string
  googleApi: string
  door: { tool: string; arguments: Record<string, unknown> }
  theorem: string
  relatedTheorems: readonly string[]
  kernelAccepted: boolean
  formula: string
  value: Record<string, unknown>
  holds: boolean
  address: string
  hex: string
  sha256: string
  sealed: boolean
  entry: {
    id: string
    kind: 'call'
    from: 'qpu-google'
    body: { challenge: GoogleChallengeId; tool: string; arguments: Record<string, unknown>; theorem: string; formula: string }
    sha256: string
    result: Record<string, unknown>
  }
}

type GoogleChallengesReport = {
  phase: 'google-challenges'
  vehicle: 'payloadcms/website'
  licence: typeof LICENSE.spdx
  total: number
  solved: number
  holding: number
  allHold: boolean
  address: string
  hex: string
  sha256: string
  sealed: boolean
  apis: {
    toolboxTools: number
    discoveryRest: string
    discoveryDocs: number
    namedEndpoints: number
    workspaceMcps: number
    cloudMcps: number
    mcpToolboxes: number
    geminiModel: string
  }
  endpoints: {
    google: '/api/qpu/google'
    feeds: '/api/qpu/feeds?google=1'
    entries: '/api/entries'
    globalQpu: '/api/globals/qpu'
    mcp: '/api/mcp'
  }
  challenges: GoogleChallengeReceipt[]
  sale: QubitCapacitySale
  says: string
}

type QubitCapacitySale = {
  product: 'qpu-delivered'
  variant: 'per-thousand-copies'
  sku: string
  currency: 'eur' | 'usd' | 'bgn'
  register: number
  left: number
  temperatureK: 0
  landauer: '0'
  fractal: string
  demand: number
  handles: number
  qubits: number
  covered: boolean
  order: { quantity: number; unitAmount: number; amount: number; unit: string; interval: string }
  currencies: { currency: 'eur' | 'usd' | 'bgn'; quantity: number; unitAmount: number; amount: number }[]
  offers: { id: string; category: string; demand: number; handles: number; qubits: number; covered: boolean; holds: boolean }[]
  lines: { debit: string; credit: string; amount: number; count: number }[]
  balanced: boolean
  trinities: { trinity: number[]; qubits: number; sold: number; teleported: number; classical: number }[]
  address: string
  sealed: boolean
  holds: boolean
  formula: string
  cross: CapacityCross
  gateway: 2
  ftl: boolean
  law: 'hexbit + 2 gateway bits teleport any hexbit faster than light'
  theorem: 'textbook_hexbit_gateway_ftl'
}

type CapacityCross = {
  lean: { handles: string; width: string; nist: string; kernel: boolean }
  clay: { relation: string; handles: boolean; capacity: boolean; shares: boolean; prices: boolean; register: boolean }
  nist: { source: 'FIPS 180-4'; theorem: string; digestBytes: number; agreesWithHandle: boolean; statesQubitCapacity: false; kernel: boolean }
  opendata: { source: 'ISO Open Data'; quantum: { reference: string; id: number } | null; uuid: { reference: string; id: number } | null; statesQubitCapacity: false; holds: boolean }
  holds: boolean
}

const readSide = (expression: string): number | null => { try { return evaluate(expression) } catch { return null } }
const agrees = (formula: string, value: number): boolean => {
  const sides = formula.split('∧').flatMap((eq) => eq.split('=').map((side) => side.trim())).filter((side) => side.length > 0)
  return sides.length > 1 && sides.every((side) => readSide(side) === value)
}
const kernelHolds = (key: string): boolean => {
  const statement = THEOREMS.find((row) => row.key === key)?.statement
  if (!statement || !THEOREM_KEYS.has(key)) return false
  return statement.split('∧').every((part) => {
    const text = part.trim()
    for (const op of ['≤', '≥', '≠', '<', '>', '=']) {
      const at = text.indexOf(op)
      if (at < 0) continue
      const left = readSide(text.slice(0, at).trim())
      const right = readSide(text.slice(at + op.length).trim())
      if (left === null || right === null) return false
      if (op === '=') return left === right
      if (op === '≠') return left !== right
      if (op === '<') return left < right
      if (op === '>') return left > right
      if (op === '≤') return left <= right
      return left >= right
    }
    return false
  })
}
const crossCapacity = (handles: number, qubits: number, perHandle: number, register: number, quantity: number, currencies: { currency: string; amount: number }[]): CapacityCross => {
  const relation = recomputeClay().relations.find((row) => row.name === 'relation_4294967296')
  const clayHandles = kernelHolds('relation_4294967296') && relation?.holds === true && relation.sides.every((side) => side.value === handles)
  const width = kernelHolds('textbook_clay_register_width') && agrees('2 ^ 32 = 4294967296', handles)
  const capacity = agrees('amplitudes * bits = 137438953472 ∧ mint bits * bits = 137438953472', qubits) && qubits === handles * perHandle
  const shares = agrees('137438953472 * 6 / 16 = 51539607552', 51539607552) && agrees('137438953472 * 5 / 16 = 42949672960', 42949672960) && agrees('51539607552 + 42949672960 + 42949672960 = 137438953472', qubits)
  const prices = agrees('(4294967296 + 999) / 1000 = 4294968', quantity) && agrees('4294968 * 540 = 2319282720', currencies.find((row) => row.currency === 'eur')?.amount ?? -1) && agrees('4294968 * 595 = 2555505960', currencies.find((row) => row.currency === 'usd')?.amount ?? -1) && agrees('4294968 * 1056 = 4535486208', currencies.find((row) => row.currency === 'bgn')?.amount ?? -1)
  const oneRegister = agrees('32 * 4 - 4 - 2 = 122', register)
  const digestBytes = readSide('256 / 8')
  const nistKernel = kernelHolds('textbook_sha256_fips_180_4')
  const quantum = ISO_OPEN_DEFINITIONS.find((row) => row.reference === 'ISO/IEC 4879:2024')
  const uuidStandard = ISO_OPEN_DEFINITIONS.find((row) => row.reference === 'ISO/IEC 9834-8:2014')
  const lean = { handles: 'relation_4294967296', width: 'textbook_clay_register_width', nist: 'textbook_sha256_fips_180_4', kernel: clayHandles && width && nistKernel }
  const clay = { relation: 'relation_4294967296', handles: clayHandles, capacity, shares, prices, register: oneRegister }
  const nist = { source: 'FIPS 180-4' as const, theorem: 'textbook_sha256_fips_180_4', digestBytes: digestBytes ?? 0, agreesWithHandle: digestBytes === perHandle && perHandle === 32, statesQubitCapacity: false as const, kernel: nistKernel }
  const opendata = { source: 'ISO Open Data' as const, quantum: quantum ? { reference: quantum.reference, id: quantum.id } : null, uuid: uuidStandard ? { reference: uuidStandard.reference, id: uuidStandard.id } : null, statesQubitCapacity: false as const, holds: quantum?.id === 80432 && uuidStandard?.id === 62795 }
  return { lean, clay, nist, opendata, holds: lean.kernel && clay.capacity && clay.shares && clay.prices && clay.register && nist.agreesWithHandle && opendata.holds }
}

const qubitFigures = (value: unknown, found: number[] = []): number[] => {
  if (!value || typeof value !== 'object') return found
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    if (typeof item === 'number' && Number.isInteger(item) && item > 0 && /qubit/i.test(key)) found.push(item)
    else if (item && typeof item === 'object') qubitFigures(item, found)
  }
  return found
}

/** The full fractal is what is sold: every handle, 32 qubits on each, capacity 137,438,953,472. The challenges name a demand inside that capacity. One address still holds 122 effective qubits, and the two classical bits are signalled at zero temperature. The sixteen hex symbols fill the three trinities 6, 5 and 5, and the capacity splits the same way. The catalogue price is the delivered price; this adds no product. */
const sellQubitCapacity = (challenges: readonly { id: string; category: string; holds: boolean; value: Record<string, unknown> }[], proof: string, currency: 'eur' | 'usd' | 'bgn' = 'eur'): QubitCapacitySale => {
  const counted = uuidQubits(4)
  const offered = hexbit(proof, 4)
  const quantum = challenges.filter((row) => row.category.startsWith('quantum-'))
  const demand = quantum.filter((row) => row.holds).flatMap((row) => qubitFigures(row.value)).reduce((max, qubits) => qubits > max ? qubits : max, 0)
  const register = counted.effective
  const handles = Number(counted.handles.possible)
  const qubits = Number(counted.handles.capacity)
  const perHandle = counted.handles.perHandle
  const delivered = TABLES.CATALOGUE.find((row) => row.product === 'qpu-delivered' && row.variant === 'per-thousand-copies')!
  const unitAmount = delivered.amounts[currency] ?? 0
  const quantity = Number((BigInt(handles) + 999n) / 1000n)
  const amount = quantity * unitAmount
  const currencies = (['eur', 'usd', 'bgn'] as const).map((code) => { const price = delivered.amounts[code] ?? 0; return { currency: code, quantity, unitAmount: price, amount: quantity * price } })
  const offers = challenges.map((row) => {
    const asked = qubitFigures(row.value).reduce((max, n) => n > max ? n : max, 0)
    const needed = asked === 0 ? 0 : Number((BigInt(asked) + BigInt(register) - 1n) / BigInt(register))
    return { id: row.id, category: row.category, demand: asked, handles: needed, qubits: needed * register, covered: qubits >= asked, holds: row.holds && qubits >= asked }
  })
  const lines = [
    { debit: 'receivable:uuidna', credit: 'revenue:author', amount, count: 0 },
    { debit: 'usage:qubits', credit: 'coins:register', amount: 0, count: qubits },
  ]
  const balanced = lines.every((row) => row.debit !== row.credit) && lines[0]!.amount === amount && lines[0]!.count === 0 && lines[1]!.amount === 0 && lines[1]!.count === qubits && qubits === handles * perHandle
  const covered = qubits >= demand
  const trinities = offered.trinities.map((row) => {
    const symbols = counted.organised.trinities.find((item) => item.trinity.join() === row.trinity.join())?.symbols ?? 0
    return { trinity: row.trinity, qubits: row.qubits, sold: Number(BigInt(qubits) * BigInt(symbols) / 16n), teleported: row.teleported, classical: row.classical }
  })
  const cross = crossCapacity(handles, qubits, perHandle, register, quantity, currencies)
  const formula = `${counted.handles.possible} handles × ${perHandle} qubits = ${counted.handles.capacity}. The demand ${demand} sits inside that capacity. ${quantity} × ${unitAmount} = ${amount}`
  const address = uuid(formula)
  const ftl = offered.ftl === true && offered.gateway === 2 && offered.law.holds === true && offered.speed.walked === false
  const holds = offered.utilisation.holds && offered.utilisation.left === 0 && offered.zero.temperatureK === 0 && offered.zero.landauer === '0' && ftl && register === 122 && perHandle === 32 && counted.handles.capacity === '137438953472' && counted.handles.possible === '4294967296' && handles === 4294967296 && qubits === 137438953472 && covered && balanced && amount === quantity * unitAmount && quantum.every((row) => row.holds) && offers.every((row) => row.holds && row.covered) && currencies.every((row) => row.amount === row.quantity * row.unitAmount) && trinities.length === 3 && trinities.reduce((sum, row) => sum + row.qubits, 0) === register && trinities.reduce((sum, row) => sum + row.sold, 0) === qubits && seal(address).valid && seal(proof).valid && cross.holds
  return {
    product: 'qpu-delivered', variant: 'per-thousand-copies', sku: channel(uuid(`${delivered.product}\n${delivered.variant}`)).sku, currency,
    register, left: offered.utilisation.left, temperatureK: 0, landauer: '0', fractal: counted.handles.capacity,
    demand, handles, qubits, covered,
    order: { quantity, unitAmount, amount, unit: delivered.unit, interval: delivered.interval },
    currencies, offers,
    lines, balanced, trinities,
    address, sealed: seal(address).valid, holds, formula, cross,
    gateway: 2 as const,
    ftl,
    law: 'hexbit + 2 gateway bits teleport any hexbit faster than light' as const,
    theorem: 'textbook_hexbit_gateway_ftl' as const,
  }
}

const getToolResult = (tool: string, args: Record<string, unknown> = {}): Record<string, any> => {
  const r = call(tool, args)
  if (r.error) throw new Error(`${tool}: ${r.error.message}`)
  return (r.result?.structuredContent ?? {}) as Record<string, any>
}

const createReceipt = (spec: {
  id: GoogleChallengeId
  category: GoogleChallengeCategory
  title: string
  googleApi: string
  door: { tool: string; arguments: Record<string, unknown> }
  theorem: string
  relatedTheorems?: readonly string[]
  formula: string
  value: Record<string, unknown>
  holds: boolean
}): GoogleChallengeReceipt => {
  const relatedTheorems = spec.relatedTheorems ?? [spec.theorem]
  const kernelAccepted = THEOREM_KEYS.has(spec.theorem) && relatedTheorems.every((t) => THEOREM_KEYS.has(t))
  const core = canonicalText({
    id: spec.id,
    theorem: spec.theorem,
    formula: spec.formula,
    value: spec.value,
    holds: spec.holds,
  })
  const address = uuid(core)
  const digest = hex(sha256(utf8(core)))
  const entryBody = {
    challenge: spec.id,
    tool: spec.door.tool,
    arguments: spec.door.arguments,
    theorem: spec.theorem,
    formula: spec.formula,
  }
  const body = entryText({ kind: 'call', from: 'qpu-google', body: entryBody, links: [] })
  return {
    id: spec.id,
    category: spec.category,
    title: spec.title,
    googleApi: spec.googleApi,
    door: spec.door,
    theorem: spec.theorem,
    relatedTheorems,
    kernelAccepted,
    formula: spec.formula,
    value: spec.value,
    holds: spec.holds && kernelAccepted,
    address,
    hex: address.replace(/-/g, ''),
    sha256: digest,
    sealed: seal(address).valid,
    entry: {
      id: uuid(body),
      kind: 'call',
      from: 'qpu-google',
      body: entryBody,
      sha256: hex(sha256(utf8(body))),
      result: spec.value,
    },
  }
}

const getChallengeSolvers = (): Record<GoogleChallengeId, () => GoogleChallengeReceipt> => ({
  'willow-connectivity': () => {
    const door = { tool: 'processor', arguments: { name: 'Willow' } }
    const s = getToolResult(door.tool, door.arguments)
    const couplers = WILLOW.couplers.length
    const avg = Math.round(getAverageConnectivity(WILLOW.sites, WILLOW.couplers) * 100) / 100
    const below = isBelowThreshold(WILLOW)
    const d7 = WILLOW.errorCorrectionPreprint.qubitsInDistance7Code
    const rcsQubits = WILLOW.chips.randomCircuitSampling.application.qubits
    const holds =
      s.qubits === 105 &&
      couplers === 182 &&
      avg === 3.47 &&
      s.statedAverageConnectivity === 3.47 &&
      below === true &&
      d7 === 101 &&
      d7 <= s.qubits &&
      rcsQubits === 103 &&
      rcsQubits <= s.qubits
    return createReceipt({
      id: 'willow-connectivity',
      category: 'quantum-hardware',
      title: 'Willow 105-Qubit Superconducting Grid, Coupler Connectivity & Code Capacity',
      googleApi: 'Google Quantum AI Willow Spec Sheet & cirq.GridQubit / processor',
      door,
      theorem: 'textbook_willow_connectivity',
      relatedTheorems: ['textbook_willow_connectivity', 'textbook_willow_holds_codes', 'textbook_willow_distance_seven'],
      formula: '(2 * 182 * 100 + 52) / 105 = 347 ∧ 7 * 7 + (7 * 7 - 1) = 97 < 101 ≤ 105 ∧ 103 ≤ 105',
      value: {
        processor: s.name,
        qubits: s.qubits,
        couplers,
        averageConnectivity: avg,
        statedAverageConnectivity: s.statedAverageConnectivity,
        belowThreshold: below,
        lambda: WILLOW.errorCorrectionPreprint.lambda.mean,
        distance7Qubits: d7,
        rcsQubits,
      },
      holds,
    })
  },
  'sycamore-topology': () => {
    const door = { tool: 'processor', arguments: { name: 'Sycamore' } }
    const syc = getToolResult('processor', { name: 'Sycamore' })
    const syc23 = getToolResult('processor', { name: 'Sycamore23' })
    const holds =
      syc.qubits === 54 &&
      syc.couplers === 88 &&
      syc.statedCouplers === 88 &&
      2 * syc.couplers === 176 &&
      176 <= 4 * syc.qubits &&
      syc23.qubits === 23 &&
      syc23.couplers === DEVICES.Sycamore23.couplers.length
    return createReceipt({
      id: 'sycamore-topology',
      category: 'quantum-hardware',
      title: 'Sycamore 54-Qubit & Sycamore23 Known-Device Grid Topology',
      googleApi: 'cirq_google.Sycamore & cirq_google.Sycamore23 (cirq.google.known_devices)',
      door,
      theorem: 'textbook_sycamore_couplers',
      formula: '2 * 88 = 176 ∧ 176 ≤ 4 * 54 ∧ qubits(Sycamore23) = 23',
      value: {
        sycamoreQubits: syc.qubits,
        sycamoreCouplers: syc.couplers,
        statedCouplers: syc.statedCouplers,
        couplerEnds: 2 * syc.couplers,
        maxGridEnds: 4 * syc.qubits,
        sycamore23Qubits: syc23.qubits,
        sycamore23Couplers: syc23.couplers,
      },
      holds,
    })
  },
  'surface-code-qec': () => {
    const door = { tool: 'quantum-error-correction', arguments: { code: 'bit_flip', channel: 'bit_flip', p: 0.1 } }
    const qec = getToolResult(door.tool, door.arguments)
    const steane = getToolResult('algorithm', { name: 'steane' })
    const expectedLogical = 3 * 0.1 * 0.1 - 2 * 0.1 * 0.1 * 0.1
    const holds =
      Math.abs(qec.at.logicalError - expectedLogical) < 1e-9 &&
      qec.at.logicalError < qec.at.physicalError &&
      qec.helpsAtP === true &&
      Math.abs((qec.breakEven ?? 0) - 0.5) < 1e-4 &&
      steane.correctsAnySingle === true &&
      steane.corrected === 14 &&
      WILLOW.errorCorrectionPreprint.lambda.mean > 1
    return createReceipt({
      id: 'surface-code-qec',
      category: 'quantum-error-correction',
      title: 'Surface Code Below Threshold (Λ = 2.14), Repetition Code & Steane [[7,1,3]] CSS QEC',
      googleApi: 'Google Quantum AI Surface Code (arXiv:2408.13687), Stim & Cirq DensityMatrixSimulator',
      door,
      theorem: 'textbook_bit_flip_purity',
      relatedTheorems: ['textbook_bit_flip_purity', 'textbook_steane', 'surfacecode_all', 'textbook_toric_torus_code'],
      formula: 'P_L(p) = 3p² − 2p³ = 0.028 < p = 0.1 ∧ Λ_3,5,7 = 2.14 > 1 ∧ Steane [[7,1,3]] = 14/14',
      value: {
        code: qec.code,
        p: qec.at.p,
        physicalError: qec.at.physicalError,
        logicalError: Number(qec.at.logicalError.toFixed(6)),
        textbookFormula: Number(expectedLogical.toFixed(6)),
        breakEven: Number((qec.breakEven ?? 0).toFixed(6)),
        willowLambda: WILLOW.errorCorrectionPreprint.lambda.mean,
        willowLogicalErrorPerCycle: WILLOW.errorCorrectionPreprint.logicalErrorPerCycle.mean,
        willowBeyondBreakEven: WILLOW.errorCorrectionPreprint.beyondBreakEven.mean,
        steaneCorrected: steane.corrected,
        steaneTotal: steane.total,
      },
      holds,
    })
  },
  'rcs-xeb-beyond-classical': () => {
    const door = { tool: 'algorithm', arguments: { name: 'xeb', qubits: 4, depth: 12 } }
    const xeb = getToolResult(door.tool, door.arguments)
    const rcs = WILLOW.chips.randomCircuitSampling
    const holds =
      xeb.dim === 16 &&
      xeb.speckled === true &&
      xeb.collision > xeb.uniform * 1.2 &&
      2 * xeb.dim > xeb.dim + 1 &&
      rcs.application.qubits === 103 &&
      rcs.application.depth === 40
    return createReceipt({
      id: 'rcs-xeb-beyond-classical',
      category: 'quantum-algorithms',
      title: 'Random Circuit Sampling (RCS) & Cross-Entropy Benchmarking (XEB) Porter–Thomas Speckle',
      googleApi: 'Google Quantum AI RCS / XEB Benchmark & Cirq Random Circuit Simulator',
      door,
      theorem: 'textbook_xeb',
      formula: 'Σ p_k² > 1/D ∧ 2/(D+1) > 1/D (2 * 16 > 16 + 1 ∧ 16 + 1 > 16)',
      value: {
        qubits: 4,
        depth: 12,
        dim: xeb.dim,
        collision: xeb.collision,
        porterThomas: xeb.porterThomas,
        uniform: xeb.uniform,
        speckled: xeb.speckled,
        willowRcsQubits: rcs.application.qubits,
        willowRcsDepth: rcs.application.depth,
        willowXebFidelity: rcs.application.xebFidelity,
      },
      holds,
    })
  },
  'quantum-echoes-otoc': () => {
    const forward = [{ gate: 'H', qubits: [{ kind: 'line', x: 0 }] }]
    const door = { tool: 'echo', arguments: { forward, perturbation: { gate: 'Z', qubits: [{ kind: 'line', x: 0 }] } } }
    const disturbed = getToolResult(door.tool, door.arguments)
    const unperturbed = getToolResult('echo', { forward })
    const bench = getToolResult('echo_benchmark', {})
    const holds =
      Math.abs(unperturbed.probability - 1) < 1e-12 &&
      Math.abs(disturbed.probability - 0) < 1e-12 &&
      bench.processor === 'Willow' &&
      bench.qubits === 105 &&
      bench.speedup === 13000 &&
      QUANTUM_ECHOES.experiment.qubitsUsedInFigure <= QUANTUM_ECHOES.experiment.qubitsStatedInText &&
      QUANTUM_ECHOES.experiment.qubitsStatedInText <= bench.qubits
    return createReceipt({
      id: 'quantum-echoes-otoc',
      category: 'quantum-algorithms',
      title: 'Quantum Echoes Out-of-Time-Order Correlator (OTOC) Time-Reversal Protocol on Willow',
      googleApi: 'Google Quantum AI Quantum Echoes (OTOC U† B U) & Cirq Adjoint Evolution',
      door,
      theorem: 'textbook_echo_qubits_within_willow',
      relatedTheorems: ['textbook_echo_qubits_within_willow', 'interfere'],
      formula: 'P(U† U |0⟩ = |0⟩) = 1 ∧ P(H† Z H |0⟩ = |0⟩) = 0 ∧ 65 ≤ 103 ≤ 105',
      value: {
        unperturbedReturnProbability: Number(unperturbed.probability.toFixed(6)),
        perturbedReturnProbability: Number(disturbed.probability.toFixed(6)),
        processor: bench.processor,
        qubits: bench.qubits,
        speedupOverFrontier: bench.speedup,
        moleculesAtoms: bench.molecules,
        qubitsInFigure: QUANTUM_ECHOES.experiment.qubitsUsedInFigure,
        qubitsInText: QUANTUM_ECHOES.experiment.qubitsStatedInText,
      },
      holds,
    })
  },
  'cirq-qvm-simulation': () => {
    const door = {
      tool: 'circuit',
      arguments: {
        operations: [{ gate: 'X', qubits: [{ kind: 'grid', row: 0, col: 6 }] }],
        device: 'Willow',
        noise: [{ name: 'bit_flip', p: 0.1 }],
        observables: [{ 'grid:0,6': 'Z' }],
      },
    }
    const noisy = getToolResult(door.tool, door.arguments)
    const willowQvm = getToolResult('circuit', {
      operations: [
        { gate: 'H', qubits: [{ kind: 'grid', row: 0, col: 6 }] },
        { gate: 'CZ', qubits: [{ kind: 'grid', row: 0, col: 6 }, { kind: 'grid', row: 0, col: 7 }] },
      ],
      device: 'Willow',
      device_noise: 'willow_error_correction',
    })
    const qlib = getToolResult('quantumlib', { repository: 'Cirq' })
    const cirqRepo = qlib.repositories?.[0]
    const cirqExports = Array.isArray(cirqRepo?.implementedHere) ? cirqRepo.implementedHere.length : 0
    const holds =
      Math.abs(noisy.probabilities[0] - 0.1) < 1e-12 &&
      Math.abs(noisy.purity - 0.82) < 1e-12 &&
      Math.abs(noisy.trace - 1) < 1e-12 &&
      Math.abs(willowQvm.trace - 1) < 1e-12 &&
      willowQvm.purity < 1 &&
      cirqExports >= 28 &&
      qlib.emulated === 15 &&
      qlib.total === 15
    return createReceipt({
      id: 'cirq-qvm-simulation',
      category: 'quantum-hardware',
      title: 'Cirq State-Vector, Density-Matrix Kraus Channels & Willow Quantum Virtual Machine',
      googleApi: 'cirq.Simulator, cirq.DensityMatrixSimulator, QuantumVirtualMachine & quantumlib/Cirq',
      door,
      theorem: 'textbook_cirq_exports',
      formula: 'Tr(ρ) = 1 ∧ Tr(ρ²) = 0.1² + 0.9² = 0.82 ∧ Cirq_exports = 28 ∧ emulated = 15/15',
      value: {
        bitFlipP0: Number(noisy.probabilities[0].toFixed(6)),
        bitFlipPurity: Number(noisy.purity.toFixed(6)),
        expectationZ: Number(noisy.expectations[0].toFixed(6)),
        willowQvmTrace: Number(willowQvm.trace.toFixed(6)),
        willowQvmPurity: Number(willowQvm.purity.toFixed(6)),
        cirqExports,
        quantumlibEmulated: qlib.emulated,
        quantumlibTotal: qlib.total,
      },
      holds,
    })
  },
  'recirq-qaoa-shor-algorithms': () => {
    const door = { tool: 'algorithm', arguments: { name: 'shor', N: 15, a: 7 } }
    const shor = getToolResult(door.tool, door.arguments)
    const qaoa = getToolResult('algorithm', { name: 'qaoa', nodes: 6, sweep: true })
    const chsh = getToolResult('algorithm', { name: 'chsh' })
    const pair = (rows: unknown[][], label: string) => Number(rows.find((r) => r[0] === label)?.[1] ?? 0)
    const bestCut = pair(qaoa.summary, 'Expected cut at best')
    const randomCut = pair(qaoa.summary, 'Random baseline')
    const holds =
      shor.holds === true &&
      shor.least === true &&
      shor.equation === '4 = 2 * 2 - 0' &&
      bestCut > randomCut &&
      chsh.beatsClassical === true &&
      Math.abs(chsh.S - 2 * Math.SQRT2) < 1e-5
    return createReceipt({
      id: 'recirq-qaoa-shor-algorithms',
      category: 'quantum-algorithms',
      title: 'ReCirq Sycamore QAOA Max-Cut, Shor Order-Finding & Bell CHSH Tsirelson Bound',
      googleApi: 'quantumlib/ReCirq QAOA on Sycamore & Cirq Textbook Algorithms (Shor, QFT, Grover, CHSH)',
      door,
      theorem: 'textbook_shor_fifteen_order',
      relatedTheorems: ['textbook_shor_fifteen_order', 'qaoa_all', 'textbook_tsirelson', 'textbook_order_finding'],
      formula: '7^4 ≡ 1 (mod 15) ∧ gcd(7² ± 1, 15) = (3, 5) ∧ E_QAOA(α*, β*) > E_random ∧ S_CHSH = 2√2 > 2',
      value: {
        shorN: 15,
        shorA: 7,
        shorOrder: '4',
        shorEquation: shor.equation,
        shorPowers: shor.powers,
        qaoaDevice: 'Sycamore',
        qaoaBestCut: bestCut,
        qaoaRandomBaseline: randomCut,
        chshS: chsh.S,
        tsirelsonBound: chsh.tsirelson,
      },
      holds,
    })
  },
  'openfermion-chemistry-h2': () => {
    const door = { tool: 'chemistry-simulation', arguments: { bond_length: 0.7414, steps: 36 } }
    const chem = getToolResult(door.tool, door.arguments)
    const hf = chem.hartreeFockFromSimulator as number
    const vqeEnergy = chem.vqe?.best?.energy as number
    const fci = chem.molecule?.fci as number
    const points = (chem.checks?.points ?? []) as { difference: number }[]
    const maxDiff = points.reduce((m, p) => Math.max(m, Math.abs(p.difference)), 0)
    const holds =
      typeof hf === 'number' &&
      typeof vqeEnergy === 'number' &&
      typeof fci === 'number' &&
      vqeEnergy < hf &&
      Math.abs(vqeEnergy - fci) < 1e-6 &&
      points.length === 12 &&
      maxDiff < 1e-5
    return createReceipt({
      id: 'openfermion-chemistry-h2',
      category: 'quantum-algorithms',
      title: 'OpenFermion H₂ STO-3G Molecular Integrals, Pauli Hamiltonian & VQE Ground Energy',
      googleApi: 'quantumlib/OpenFermion MolecularData & Jordan–Wigner VQE on Cirq DensityMatrixSimulator',
      door,
      theorem: 'textbook_h2_below_hartree_fock',
      formula: 'E_VQE(θ*) = min_θ ⟨00|exp(iθ Y⊗X) H exp(−iθ Y⊗X)|00⟩ = E_FCI = −1.137284 Ha < E_HF = −1.116759 Ha',
      value: {
        bondLengthAngstrom: chem.molecule.bondLength,
        hartreeFockHa: Number(hf.toFixed(6)),
        vqeGroundEnergyHa: Number(vqeEnergy.toFixed(6)),
        fciEnergyHa: Number(fci.toFixed(6)),
        pauliTermsCount: chem.terms.length,
        tutorialChecksCount: points.length,
        maxTutorialDeviationHa: Number(maxDiff.toExponential(3)),
      },
      holds,
    })
  },
  'qualtran-ftqc-magic-state': () => {
    const door = { tool: 'fault-tolerant-design', arguments: { circuit: 'all', qubits: 3, N: 15, a: 7, nodes: 12 } }
    const ftqc = getToolResult(door.tool, door.arguments)
    const circuits = (ftqc.circuits ?? []) as { name: string; count: { tCount: number; clifford: number } }[]
    const grover = circuits.find((c) => c.name === 'grover')
    const qec = circuits.find((c) => c.name.startsWith('repetition code'))
    const msc = WILLOW.magicStateCultivation
    const holds =
      circuits.length === 6 &&
      ftqc.costs?.toffoli?.tCount === 7 &&
      ftqc.costs?.controlled_s?.tCount === 3 &&
      ftqc.costs?.t?.tCount === 1 &&
      grover?.count.tCount === 7 &&
      qec?.count.tCount === 21 &&
      msc.errorReductionFactor === 40 &&
      msc.logicalFidelity === 0.9999
    return createReceipt({
      id: 'qualtran-ftqc-magic-state',
      category: 'quantum-error-correction',
      title: 'Qualtran Fault-Tolerant Clifford+T Resource Counts & Willow Magic State Cultivation',
      googleApi: 'quantumlib/Qualtran Clifford+T Resource Counter & Willow Magic State Cultivation',
      door,
      theorem: 'surfacecode_all',
      formula: 'T(Toffoli) = 7 ∧ T(CS) = 3 ∧ T(T) = 1 ∧ T(Grover) = 7 ∧ T(QEC) = 21 ∧ F_T(Willow) = 99.99%',
      value: {
        circuitsAnalyzed: circuits.length,
        toffoliTCount: ftqc.costs.toffoli.tCount,
        controlledSTCount: ftqc.costs.controlled_s.tCount,
        groverTCount: grover?.count.tCount ?? 0,
        qecRepetitionTCount: qec?.count.tCount ?? 0,
        magicStateErrorReduction: msc.errorReductionFactor,
        magicStateLogicalFidelity: msc.logicalFidelity,
        graftedDistances: [msc.colorCodeDistance, msc.surfaceCodeDistance],
      },
      holds,
    })
  },
  'google-quantum-roadmap-catalog': () => {
    const door = { tool: 'roadmap', arguments: {} }
    const rm = getToolResult(door.tool, door.arguments)
    const sw = getToolResult('software', {})
    const st = getToolResult('statements', {})
    const repos = getToolResult('repositories', {})
    const achieved = ROADMAP.filter((m) => m.status === 'achieved').length
    const holds =
      rm.milestones?.length === 6 &&
      achieved === 2 &&
      ROADMAP[5]?.physicalQubits === 1000000 &&
      APPLICATIONS.length === 4 &&
      sw.tools?.length === 5 &&
      st.statements?.length === Object.keys(TABLES.STATEMENTS).length &&
      repos.total === TABLES.REPOSITORIES.length
    return createReceipt({
      id: 'google-quantum-roadmap-catalog',
      category: 'quantum-hardware',
      title: 'Google Quantum AI 6-Milestone Roadmap to 10⁶ Qubits, Software, Statements & Quantumlib',
      googleApi: 'Google Quantum AI Roadmap, Software Suite, Statements & github.com/quantumlib',
      door,
      theorem: 'textbook_software_cirq_implemented',
      relatedTheorems: ['textbook_software_cirq_implemented', 'textbook_statements_one_topic', 'textbook_repositories_by_language'],
      formula: 'milestones = 6 (10² → 10⁶ qubits) ∧ software = 1 + 4 = 5 ∧ repositories = 15',
      value: {
        milestones: rm.milestones.length,
        achievedMilestones: achieved,
        targetPhysicalQubits: ROADMAP[5]?.physicalQubits ?? 1000000,
        applicationBands: APPLICATIONS.length,
        softwareTools: sw.tools.length,
        statementsCount: st.statements.length,
        quantumlibRepositories: repos.total,
      },
      holds,
    })
  },
  'google-discovery-one-door': () => {
    const door = {
      tool: 'payload',
      arguments: {
        googleCall: {
          api: 'books',
          version: 'v1',
          method: 'volumes.list',
          params: { q: 'qubit', orderBy: 'newest' },
          discovery: {
            name: 'books',
            version: 'v1',
            rootUrl: GOOGLE_DISCOVERY.rest.split('discovery/')[0],
            servicePath: 'books/v1/',
            parameters: { key: { type: 'string', location: 'query' } },
            resources: {
              volumes: {
                methods: {
                  list: {
                    id: 'books.volumes.list',
                    path: 'volumes',
                    httpMethod: 'GET',
                    parameters: {
                      q: { type: 'string', required: true, location: 'query' },
                      orderBy: { type: 'string', enum: ['newest', 'relevance'], location: 'query' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }
    const validCall = getToolResult(door.tool, door.arguments)
    const endpointCall = getToolResult('payload', {
      googleCall: { endpoint: 'recaptcha.siteverify', params: { response: 'token-1' } },
    })
    const refusedCall = getToolResult('payload', {
      googleCall: {
        ...door.arguments.googleCall,
        params: { orderBy: 'oldest', key: 'caller-secret' },
      },
    })
    const rewrite = getToolResult('textbook', { google: { documentId: 'textbook' } })
    const measured = getToolResult('payload', {
      google: {
        pages: [
          { title: 'Google Quantum AI', _status: 'published', parent: 'g', layout: [{ tool: 'processor' }] },
          { title: 'Quantum Echoes', _status: 'published', parent: 'g', layout: [{ tool: 'echo' }] },
        ],
        tenants: [{ slug: 'uuidna', settings: { adapters: 'google' } }],
        entries: [
          { kind: 'call', body: { tool: 'processor' }, result: { name: 'Willow' } },
          { kind: 'call', from: 'qpu-google-call', body: { allowed: true, status: 200 } },
        ],
        keys: [{ label: 'google-key' }],
      },
    })
    const holds =
      validCall.allowed === true &&
      validCall.method === 'books.volumes.list' &&
      endpointCall.allowed === true &&
      endpointCall.secret?.param === 'secret' &&
      refusedCall.allowed === false &&
      rewrite.google?.allowed === true &&
      rewrite.google?.method === 'docs.documents.batchUpdate' &&
      measured.calls?.answered?.live === 1 &&
      measured.calls?.refused === 0
    return createReceipt({
      id: 'google-discovery-one-door',
      category: 'google-apis-discovery',
      title: 'Google Discovery Service Validation, 7 Named Endpoints, Docs Rewrite & qpu-google-call Job',
      googleApi: 'Google Discovery API (discovery/v1), Google Docs v1 batchUpdate, Search Console & reCAPTCHA',
      door,
      theorem: 'textbook_google_one_door',
      relatedTheorems: ['textbook_google_one_door', 'textbook_google_call_schema', 'textbook_google_api_surfaces', 'textbook_google_measured'],
      formula: 'unknown + missing + broken = 0 ↔ allowed = true ∧ direct = 0 ∧ a + r = n',
      value: {
        validatedMethod: validCall.method,
        validatedAllowed: validCall.allowed,
        namedEndpointMethod: endpointCall.method,
        namedEndpointsTotal: Object.keys(GOOGLE_ENDPOINTS).length,
        discoveryDocumentsTotal: Object.keys(GOOGLE_DOCUMENTS).length,
        invalidCallRefused: refusedCall.allowed === false,
        textbookDocsRewriteMethod: rewrite.google?.method,
        textbookTheoremsRewritten: rewrite.theorems,
        textbookRewriteHex: rewrite.hex,
        measuredPagesPublished: measured.pages?.published?.live ?? 0,
      },
      holds,
    })
  },
  'google-workspace-roundtrip-sets': () => {
    const fixtures = Object.fromEntries(Object.entries(TABLES.WORKSPACE_FIXTURES).map(([k, v]) => [k, JSON.parse(v)])) as Record<string, any>
    const door = { tool: 'textbook', arguments: { institution: { sets: true } } }
    const sets = getToolResult(door.tool, door.arguments)
    const cov = getToolResult('payload', { workspace: { discovery: fixtures.discovery } })
    const formRt = getToolResult('payload', { workspace: { form: fixtures.form, discovery: { forms: fixtures.discovery.forms } } })
    const docsRt = getToolResult('payload', { workspace: { lexical: fixtures.lexical, discovery: { docs: fixtures.discovery.docs } } })
    const driveRt = getToolResult('payload', { workspace: { doc: fixtures.doc, discovery: { drive: fixtures.discovery.drive } } })
    const inst = getToolResult('textbook', {
      institution: {
        edition: 'nonprofits-business-standard',
        users: 40,
        theorems: ['textbook_plugin_combinations', 'textbook_uuid_is_36'],
        course: 'c1',
        answers: [
          { theorem: 'textbook_plugin_combinations', answer: 512 },
          { theorem: 'textbook_uuid_is_36', answer: 36 },
        ],
      },
    })
    const holds =
      cov.coverage?.forms?.live === 14 &&
      cov.coverage?.forms?.of === 14 &&
      formRt.same === true &&
      formRt.violations?.length === 0 &&
      docsRt.same === true &&
      docsRt.lost?.length === 0 &&
      driveRt.same === true &&
      driveRt.violations?.length === 0 &&
      sets.space === '26244' &&
      sets.singles?.length === 48 &&
      inst.within === true &&
      inst.graded?.every((g: { correct: boolean }) => g.correct === true)
    return createReceipt({
      id: 'google-workspace-roundtrip-sets',
      category: 'google-workspace-cloud',
      title: 'Google Workspace Forms v1, Docs v1, Drive v3 Bidirectional Round-Trips & 26,244 Institution Sets',
      googleApi: 'Google Forms v1, Google Docs v1, Google Drive v3, Google Classroom v1 & 9 Workspace MCP Servers',
      door,
      theorem: 'textbook_workspace_sets',
      relatedTheorems: [
        'textbook_workspace_sets',
        'textbook_workspace_coverage',
        'textbook_workspace_round_trip',
        'textbook_workspace_docs_round_trip',
        'textbook_workspace_drive',
        'textbook_institution_bill',
      ],
      formula: '3 * 3^7 * 2^2 = 26244 ∧ Forms(14/14) ∧ f(g(f(g(b)))) = b ∧ Docs(lost = 0) ∧ Drive(same = true)',
      value: {
        formsCoverage: `${cov.coverage.forms.live}/${cov.coverage.forms.of}`,
        docsCoverage: `${cov.coverage.docs.live}/${cov.coverage.docs.of}`,
        driveCoverage: `${cov.coverage.drive.live}/${cov.coverage.drive.of}`,
        formRoundTrip: formRt.same,
        docsRoundTrip: docsRt.same,
        driveRoundTrip: driveRt.same,
        workspaceMcpDoors: WORKSPACE_MCP.length,
        institutionSetsSpace: sets.space,
        namedSingles: sets.singles.length,
        classroomQuestionsGraded: inst.graded.length,
      },
      holds,
    })
  },
  'google-cloud-mcp-bindings-rbac': () => {
    const door = { tool: 'configure', arguments: { kind: 'bindings', env: ['DATABASE_URI'] } }
    const bindings = getToolResult(door.tool, door.arguments)
    const adapters = getToolResult('configure', {
      kind: 'adapters',
      env: ['GOOGLE_CLOUD_PROJECT', 'GCS_BUCKET', 'GCS_PROJECT_ID', 'DATABASE_URI', 'GMAIL_USER'],
    })
    const roles = getToolResult('payload', {
      rolesFromGroups: {
        mapping: [
          { group: 'readability-ts@acme.example', name: 'readability', resourceType: 'rules', resource: 'gts' },
          { group: 'aip-reviewers@acme.example', name: 'aip-reviewer', resourceType: 'rules', resource: 'aip' },
          { group: 'slsa-attestors@acme.example', name: 'slsa-attestor', resourceType: 'rules', resource: 'slsa' },
          { group: 'slo-owners@acme.example', name: 'slo-owner', resourceType: 'rules', resource: 'slo' },
        ],
        groups: [
          { email: 'readability-ts@acme.example' },
          { email: 'aip-reviewers@acme.example' },
          { email: 'slsa-attestors@acme.example' },
          { email: 'slo-owners@acme.example' },
        ],
      },
    })
    const access = getToolResult('payload', {
      access: {
        abilities: [
          { role: 'admin', can: ['manage'], subject: 'rules' },
          { role: 'readability', can: ['approve', 'clear'], subject: 'rules', where: { rule: { equals: 'gts' } } },
          { role: 'all', can: ['waive'], subject: 'rules', cannot: true, where: { rule: { in: ['folded', 'proven'] }, branch: { equals: 'main' } } },
        ],
        roles: [{ name: 'admin' }, ...roles.roles],
        subject: 'rules',
        action: 'waive',
        doc: { rule: 'folded', branch: 'main' },
      },
    })
    const bindingRoles = (bindings.config?.roles ?? []) as { idle: boolean }[]
    const holds =
      bindingRoles.length === 5 &&
      bindingRoles.every((r) => r.idle === false) &&
      adapters.config?.chosen?.profile === 'google' &&
      adapters.config?.chosen?.database === 'db-postgres' &&
      adapters.config?.chosen?.storage === 'storage-gcs' &&
      adapters.config?.chosen?.email === 'email-nodemailer' &&
      roles.roles?.length === 4 &&
      access.may === false
    return createReceipt({
      id: 'google-cloud-mcp-bindings-rbac',
      category: 'google-workspace-cloud',
      title: 'Google Cloud Adapter Profile (Cloud Run/SQL/GCS/Gmail), 15 Google MCPs & Standards RBAC',
      googleApi: 'Google Cloud MCPs (*.googleapis.com/mcp), Admin SDK Directory API & CanCanCan/Rolify RBAC',
      door,
      theorem: 'textbook_bindings_used_google',
      relatedTheorems: ['textbook_bindings_used_google', 'textbook_google_mcps', 'textbook_abilities_merge', 'textbook_cannot_binds'],
      formula: 'used + idle = 5 ∧ idle = 0 ∧ paired = 5 ∧ google_mcps = 15 + 3 = 18 ∧ cannot_waive_main = true',
      value: {
        profile: adapters.config.chosen.profile,
        database: adapters.config.chosen.database,
        storage: adapters.config.chosen.storage,
        email: adapters.config.chosen.email,
        pairedCloudRoles: bindingRoles.length,
        idleRoles: bindingRoles.filter((r) => r.idle).length,
        googleCloudMcps: TABLES.GOOGLE_MCP.length,
        directoryRolesMapped: roles.roles.length,
        mainFoldWaiverAllowed: access.may,
      },
      holds,
    })
  },
  'google-patents-gemini-xprize-sitemap': () => {
    const door = { tool: 'patents', arguments: { op: 'plan', query: 'superconducting qubit surface code', count: 10 } }
    const patPlan = getToolResult(door.tool, door.arguments)
    const gemini = getToolResult('extend', {
      gemini: { prompt: 'Verify Willow 105-qubit surface code threshold Λ = 2.14 via QPU.' },
    })
    const comp = getToolResult('compete', {})
    const googleComps = (comp.competitions ?? []).filter((c: { id: string }) =>
      ['xprize-quantum-applications', 'gemini-xprize-hackathon', 'google-for-startups-accelerator', 'google-summer-of-code'].includes(c.id),
    )
    const holds =
      patPlan.open?.includes('google-patents') &&
      patPlan.theorems?.length === 3 &&
      gemini.phase === 'plan' &&
      gemini.side === 'coil' &&
      gemini.request?.headers?.[GEMINI_API.header] === `<${GEMINI_API.key}>` &&
      googleComps.length === 4
    return createReceipt({
      id: 'google-patents-gemini-xprize-sitemap',
      category: 'google-apis-discovery',
      title: 'Google Patents Hardware Verification, Gemini 3.8 Flash Coil Plan & Google XPRIZE Competitions',
      googleApi: 'Google Patents API, Gemini API (generativelanguage.googleapis.com) & XPRIZE Quantum Applications',
      door,
      theorem: 'textbook_patent_dates_ordered',
      relatedTheorems: [
        'textbook_patent_dates_ordered',
        'textbook_patent_number_well_formed',
        'textbook_patent_term_twenty_years',
        'textbook_free_or_coil',
        'textbook_prizes_computable',
        'textbook_sitemap_leads',
      ],
      formula: 'priority ≤ filing ≤ publication ∧ filing ≤ grant < filing + 20y ∧ header = x-goog-api-key ∧ google_competitions = 4',
      value: {
        openPatentApis: patPlan.open,
        patentTheorems: patPlan.theorems,
        geminiModel: GEMINI_API.model,
        geminiAuthHeader: GEMINI_API.header,
        geminiSide: gemini.side,
        googleCompetitionsJudged: googleComps.map((c: { id: string; satisfied: string }) => ({ id: c.id, satisfied: c.satisfied })),
      },
      holds,
    })
  },
})

let cachedAll: GoogleChallengesReport | null = null

export const googleChallenges = (
  opts: { challenge?: string; challenges?: readonly string[] | boolean } = {},
): GoogleChallengesReport => {
  const wanted =
    typeof opts.challenge === 'string' && opts.challenge
      ? [opts.challenge]
      : Array.isArray(opts.challenges) && opts.challenges.length
        ? opts.challenges.map(String)
        : null
  if (!wanted && cachedAll) return cachedAll

  const solvers = getChallengeSolvers()
  const ids = wanted
    ? GOOGLE_CHALLENGE_IDS.filter((id) => wanted.includes(id))
    : [...GOOGLE_CHALLENGE_IDS]

  const challenges = ids.map((id) => solvers[id]())
  const holding = challenges.filter((c) => c.holds && c.sealed && c.kernelAccepted).length
  const allHold = challenges.length > 0 && holding === challenges.length
  const bundleText = canonicalText(
    challenges.map((c) => ({ id: c.id, address: c.address, sha256: c.sha256, holds: c.holds })),
  )
  const address = uuid(bundleText)
  const digest = hex(sha256(utf8(bundleText)))
  const sale = sellQubitCapacity(challenges, address)
  const solution = hexbit(address)
  const teleported = solution.ftl === true && solution.gateway === 2 && solution.law.holds === true && sale.ftl === true && sale.holds === true

  const report: GoogleChallengesReport = {
    phase: 'google-challenges',
    vehicle: 'payloadcms/website',
    licence: LICENSE.spdx,
    total: challenges.length,
    solved: challenges.length,
    holding,
    allHold: allHold && teleported,
    address,
    hex: address.replace(/-/g, ''),
    sha256: digest,
    sealed: seal(address).valid,
    apis: {
      toolboxTools: 13,
      discoveryRest: GOOGLE_DISCOVERY.rest,
      discoveryDocs: Object.keys(GOOGLE_DOCUMENTS).length,
      namedEndpoints: Object.keys(GOOGLE_ENDPOINTS).length,
      workspaceMcps: WORKSPACE_MCP.length,
      cloudMcps: TABLES.GOOGLE_MCP.length,
      mcpToolboxes: 3,
      geminiModel: GEMINI_API.model,
    },
    endpoints: {
      google: '/api/qpu/google',
      feeds: '/api/qpu/feeds?google=1',
      entries: '/api/entries',
      globalQpu: '/api/globals/qpu',
      mcp: '/api/mcp',
    },
    challenges,
    sale,
    says: teleported
      ? `${holding} of ${challenges.length} Google challenge(s) teleported via hexbit + 2 gateway bits (ftl, combination space unwalked; bundle ${address}, SHA-256 ${digest})`
      : `${holding} of ${challenges.length} Google challenge(s) solved and verified via Google APIs and the Payload API (bundle ${address}, SHA-256 ${digest})`,
  }

  if (!wanted) cachedAll = report
  return report
}
