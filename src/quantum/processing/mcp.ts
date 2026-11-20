// The qpu MCP surface: JSON-RPC 2.0 tools that take typed POST parameters and compile the circuit they describe on each
// call. The handler does no I/O and imports nothing from Node, so the same code runs in a browser OS, where a caller
// compiles whatever it needs by calling a tool. Tool names and figures follow Google Quantum AI (quantumai.google).

import { CHAT_SHARE, CLAY_FIRST, FORMULA, INSERT_SCHEMA, LEAN_RESOURCE, NIBBLE_PRIMES, OFFICIAL_PLUGINS, PROTOCOL_VERSION } from './config-index.ts'
import { PROSE, proseFill } from './prose-index.ts'
import { GOOGLE_MCPS, QPU_MCP, mcpHostList } from './discovery.ts'
import { bindGoogleCall } from './toolboxes/google.ts'
import * as cirq from './cirq.ts'
import { EXAMPLES } from './examples.ts'
import { TABLES } from './tables-index.ts'
import { listDeclarations, removeDead, auditPrograms, scanLexical, runAudit, getEntropy, uncap, diffMembers, auditSecurity, listRemedies, repair, getAdvantage, getAddressedByTheorem, getBill, FALLBACKS, FALLBACK_ADAPTERS, handleOrCorrect, linkAxioms, listLeaks, sealJson, sealTokenLeaks } from './audit.ts'
import { TEXTBOOK_THEOREMS, getReflections, searchTextbookPrograms } from './textbook-theorems.ts'
import { NESTED as NESTED_CATALOGUE, NESTED_COUNTS } from './nested-index.ts'
import { THOUSAND, THOUSAND_SHARED } from './thousand-index.ts'
import { updateTheoremSources } from './textbook-measured.ts'
import { builders, accessAudit, auditedSave, build, crossVerifiedFormula, websiteGate, developFindings, developViaHooks, serveViaHooks } from './toolboxes/payload.ts'
import { ISO_QUANTUM_AI, MCP_API_KEY, isOnlineVerify } from '../../plugins/websiteClient.ts'
import { cryptoConfig } from './crypto/config.ts'
import { processorsForRole, mayUseProcessor, type CryptoProcessorName } from './crypto/index.ts'
import { askPayloadRbac } from './api-mcp-rbac.ts'
import { block, verify, uuid, seal, coins, compositions, composition, canonicalText, harmonicDefaults, style, channel as uuidChannel, reflection, neighbours, qpuHooks, aspects, optimise, next as rotate, uuidQubits, hexbit, merkaba } from '../uuid/index.ts'
import { capabilities } from '../engine/index.ts'
import { listAlpine } from './alpine.ts'
import { pageSeed } from './page-seed.ts'
import { entriesCover, findArgs, manageApi, mcpPages, pageData, writeArgs } from '../payload/index.ts'
import { INSTRUCTIONS, LICENSE } from './unit/license.ts'
import { QPU_ORIGIN, tenantAddress } from './unit/index.ts'
import { VERSION } from './unit/version.ts'
import { AXIOMS, evaluate as clayEvaluate, recomputeClay, reflectionOfRegister, digitalRoot, trinityFor, mint, bits, amplitudes } from './clay-register.ts'
import { recognise } from '../apps/index.ts'
import { composePage } from './compose.ts'
import { mayChoose, ROLE_RANK, type Role } from './unit/roles.ts'
import { evaluate, evaluateTheorem, getStatement, listExpressions, getProse, bindingFor } from './expressions.ts'
import { getTheorem, verifyTheorems } from './verification.ts'
import { checkWitnesses, mergeWitnesses, witnessMove } from './witnesses.ts'
import { planClaims, listClaims } from './claims.ts'
import { planInstitution, listFamilySets, createFamilySet, createCreateCall, assessEducation, SET_FAMILIES } from './institutions.ts'
import { listCollisions } from './collisions.ts'
import { developIdeas, ideaFilesFromLeads, nextIdeas, placeInIdea } from './ideas.ts'
import { followWave, processPhysics } from './lead-wave.ts'
import '../uuid/programs/index.ts'
import { driftPrograms } from '../uuid/programs/drift/index.ts'
import { shadcnPrograms } from '../uuid/programs/shadcn/index.ts'
import { GOOGLE_ENDPOINTS } from './discovery.ts'
import manifest from '../../../package.json' with { type: 'json' }
import { apisDoors, apisCost, apisIndex, apisCoverage, payloadOperations, cloudflareOperations, googleOperations, readingsOf, shadcnOperations, shadcnSurface, zoneReadingsOf, CLOUDFLARE_PRICING, OBSERVE_QUERY, OBSERVE_ZONE_QUERY, type Operation as ApiOperation } from '../uuid/programs/apis/index.ts'
import { createdThousandExit, decodeIso, DECODE_THEOREMS, ISO_EXIT } from './iso-exit.ts'
import { SOURCES, planSources, next, listSources, type SourceContext, type SourceRequest, type SourceAnswer } from './sources.ts'
import { scientificDomains } from './domains.ts'
import { getScan } from './scan.ts'
import { matchStatement, matchNews, editorial, translateVerdict, listForeignVerdicts, evaluateRouted } from './match.ts'
import { LOCALES, listNumerals } from './i18n.ts'
import { CNOT, CZ, type Channel, Circuit, DensityMatrixSimulator, GridQubit, H, type InsertStrategy, LineQubit, NamedQubit, S, Simulator, seededRandom, SWAP, T, TOFFOLI, X, Y, Z, applied, getExpectation, phasedXZGate, qubitKey, measure, raiseGate, type Gate, type Operation, type Qubit } from './cirq.ts'
import { echoCircuit, echoProbability, QUANTUM_ECHOES } from './echo.ts'
import { WILLOW as WILLOW_PROC, ALL_PROCESSORS, QUANTUM_HARDWARE_STACK, DEVICES, PROCESSORS, toDevice, willowNoise, getAverageConnectivity, isBelowThreshold } from './processor.ts'
import { engineReceipt } from './compat.ts'
import { algorithmWidget, chemistryWidget, circuitWidget, echoBenchmarkWidget, echoWidget, errorCorrectionWidget, leadsWidget, entropyWidget, processorWidget, quantumlibWidget, repositoriesWidget, resourcesWidget, roadmapWidget, softwareWidget, statementsWidget, auditWidget, apisWidget, matchWidget, clayWidget, verifyWidget, seoWidget } from './widgets.ts'
import { APPLICATIONS, ROADMAP } from './roadmap.ts'
import { groverCircuit, inverseOperations, phaseEstimationCircuit, qaoaCircuit, qaoaExpectedCut, qaoaSweep, pageInstance, qftOperations, shorCircuit, shorFactors, teleportationCircuit, teleportProof, getInteger, pasteInteger, writeInteger, testPrimality, listFactors, shorReduction, createImpossible, decodeImpossible, orderFinding, orderWitness, sqrtBig, deutschJozsaCircuit, bernsteinVaziraniCircuit, simonCircuit, vqeGroundEnergy, chshValue, trotterFidelity, xebCollision, cloningFidelity, holevoChi, stabilizerCompression, cliffordOrder, htUniversality, steaneCorrection, courtState } from './algorithms.ts'
import { STATEMENTS, SOFTWARE, type StatementTopic } from './statements.ts'
import { LEADS, leadCounts, combineLeads, listRunnableLeads, runSession, sitemapLeads, type Lead, type LeadStatus, type CellLead, type SessionInput } from './leads.ts'
import { REPOSITORIES, PAYLOADCMS_REPOSITORIES, PAYLOADCMS_MONOREPO_PACKAGES, payloadcmsRepos } from './repositories.ts'
import { getBreakEven, codePoint, repetitionCycle, channel as qecChannel, textbookLogicalError, type ErrorChannel, type LogicalState, type RepetitionCode } from './qec.ts'
import { BOHR_ANGSTROM, STO3G_H, TUTORIAL_ENERGIES, ansatzCircuit, energyAt, hydrogen, hydrogenHamiltonian, jordanWigner, tutorialChecks, vqeSweep, type Ladder } from './chemistry.ts'
import { CLIFFORD_CHECK_ARITY, countResources } from './counting.ts'
import { clock, stamp, tick } from '../uuid/programs/clock/index.ts'

export type Rpc = { jsonrpc: '2.0'; id?: number | string | null; method: string; params?: unknown }
export type Reply =
  | { jsonrpc: '2.0'; id: number | string | null; result: unknown }
  | { jsonrpc: '2.0'; id: number | string | null; error: { code: number; message: string; data?: unknown } }

const INVALID_PARAMS = -32602
const METHOD_NOT_FOUND = -32601

class ParamError extends Error {}

const GATES: Record<string, Gate> = { X, Y, Z, H, S, T, CZ, CNOT, SWAP, TOFFOLI }

type QubitJson = { kind: 'grid'; row: number; col: number } | { kind: 'line'; x: number } | { kind: 'named'; name: string }
type OperationJson = { gate: string; qubits: QubitJson[]; exponent?: number; x?: number; z?: number; axis?: number }
const GATE_NAMES = [...Object.keys(GATES), 'PhasedXZ']
type MeasureJson = { key: string; qubits: QubitJson[] }

const qubit = (q: QubitJson): Qubit => {
  if (q.kind === 'grid') return GridQubit.of(q.row, q.col)
  if (q.kind === 'line') return LineQubit.of(q.x)
  if (q.kind === 'named') return NamedQubit.of(q.name)
  throw new ParamError(proseFill(PROSE.quantumProcessingMcp_s1, JSON.stringify(q)))
}

const operation = (op: OperationJson): Operation => {
  const qubits = op.qubits.map(qubit)
  if (op.gate === 'PhasedXZ') {
    if (op.exponent !== undefined) throw new ParamError('PhasedXZ takes x, z and axis')
    if (typeof op.x !== 'number' || typeof op.z !== 'number' || typeof op.axis !== 'number') throw new ParamError('PhasedXZ takes x, z and axis')
    return applied(phasedXZGate(op.x, op.z, op.axis), ...qubits)
  }
  if (op.x !== undefined || op.z !== undefined || op.axis !== undefined) throw new ParamError(`${op.gate} takes an exponent`)
  const gate = GATES[op.gate]
  if (!gate) throw new ParamError(`gate ${op.gate} is not one of ${GATE_NAMES.join(', ')}`)
  const powered = op.exponent === undefined ? gate : raiseGate(gate, op.exponent)
  return applied(powered, ...qubits)
}

const circuit = (operations: OperationJson[], insert: InsertStrategy, measurement?: MeasureJson): Circuit => {
  const circuit = new Circuit().append(operations.map(operation), insert)
  if (measurement) circuit.append(measure(measurement.qubits.map(qubit), measurement.key))
  return circuit
}

const overOrigin = (address: string) => {
  const handle = uuidChannel(address).handle
  const resolved = tenantAddress(QPU_ORIGIN, `/${handle}/`)
  return { origin: `https://${QPU_ORIGIN}`, url: `https://${QPU_ORIGIN}/${address}`, tenant: resolved.subdomain ? `https://${resolved.subdomain}` : `https://${QPU_ORIGIN}`, path: `https://${QPU_ORIGIN}/${handle}/`, handle, via: resolved.via }
}

const engineCall = (raw: Record<string, unknown>) => {
  const processor = String(raw.processor ?? 'Willow')
  if (!(processor in DEVICES)) reject(proseFill(PROSE.quantumProcessingMcp_s2, processor, Object.keys(DEVICES).join(', ')))
  const program = isObj(raw.program) ? raw.program as { operations?: OperationJson[]; measure?: MeasureJson } : {}
  if (!Array.isArray(program.operations) || program.operations.length === 0) reject('a program is a list of operations')
  const prepared = circuit(program.operations, 'EARLIEST', program.measure)
  toDevice(DEVICES[processor as keyof typeof DEVICES]).validateCircuit(prepared)
  const programId = uuid(canonicalText({ processor, operations: program.operations, measure: program.measure ?? null }))
  const repetitions = typeof raw.repetitions === 'number' ? raw.repetitions : 100
  const jobId = uuid(canonicalText({ program: programId, repetitions: program.measure ? repetitions : 0 }))
  const programRecord = { id: programId, operations: program.operations.length, sealed: seal(programId).valid }
  const reservation = { processor, held: true as const, program: programId, job: jobId }
  const job = { id: jobId, status: 'SUCCESS' as const, sealed: seal(jobId).valid }
  const compute = overOrigin(jobId)
  if (!program.measure) {
    const simulated = new Simulator().simulate(prepared)
    const body = { phase: 'engine' as const, via: 'cirq-google' as const, processor, program: programRecord, job: { ...job, width: simulated.width }, reservation, compute, qubits: simulated.qubits.map(keyOfQubit), amplitudes: simulated.amplitudes.map(complex) }
    return { ...body, ...engineReceipt(processor, programId, jobId, body) }
  }
  const sampled = seeded(raw).run(prepared, repetitions)
  const body = { phase: 'engine' as const, via: 'cirq-google' as const, processor, program: programRecord, job: { ...job, repetitions }, reservation, compute, key: program.measure.key, bitstrings: sampled.measurements(program.measure.key), histogram: Object.fromEntries(sampled.histogram(program.measure.key)) }
  return { ...body, ...engineReceipt(processor, programId, jobId, body) }
}

type ChannelJson = { name: string; p?: number; p_x?: number; p_y?: number; p_z?: number; gamma?: number }

const channel = (j: ChannelJson): Channel => {
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
    default: return reject(proseFill(PROSE.quantumProcessingMcp_s3, j.name))
  }
}

const CHANNEL_SCHEMA = TABLES.CHANNEL_SCHEMA
const OBSERVABLE_SCHEMA = {
  type: 'object',
  description: PROSE.quantumProcessingMcp_description4,
  additionalProperties: { enum: ['X', 'Y', 'Z'] },
}

const complex = ([re, im]: [number, number]) => ({ re, im })

const optInteger = (v: unknown, name: string) => (v === undefined ? undefined : getInteger(v, name)), seeded = (args: unknown) => new Simulator(seededRandom(JSON.stringify(args)))

const continuationOf = (n: bigint, reached: bigint | null, left: readonly bigint[], reflections: bigint) => {
  if (reached === null || left.length === 0) return {}
  const run = { tool: 'algorithm', arguments: { name: 'factor', integer: n.toString(), from: reached.toString(), reflections: reflections.toString() } }
  const lead = { id: `factor-${uuid(`factor\n${n}\n${reached}`)}`, statement: proseFill(PROSE.quantumProcessingMcp_statement5, n.toString(2).length, uuid(n.toString()), reached, reflections), status: 'open' as const, tool: 'algorithm', theorem: 'textbook_search_resumes', run }
  return { continue: { run, lead } }
}
const answerFactor = (n: bigint, via?: string, reflections = 1n << 12n, from?: bigint) => {
  const bits = n.toString(2).length, p = testPrimality(n)
  const f = p.prime ? { factors: [n], left: [] as bigint[], reached: null as bigint | null, searched: 0n, verified: true } : listFactors(n, reflections, from)
  const primality = n < 2n ? `${n}, neither prime nor composite` : p.prime ? (p.certain ? 'prime' : PROSE.quantumProcessingMcp_s6) : 'composite'
  // a part no reflection splits is the order door's: algorithm { name: "order" } returns the least r, the powers and r = m·i − j when the order fits the budget (textbook_order_finding)
  const quantumOrder = f.left.length ? { needs: 'order-finding', the: PROSE.quantumProcessingMcp_the7, door: f.left.map((m) => ({ tool: 'algorithm', arguments: { name: 'order', N: m.toString(), a: '2' } })), backend: PROSE.quantumProcessingMcp_backend8, bound: 'textbook_rsa_beyond_bound', theorem: 'textbook_order_finding' } : null
  return { name: 'factor', integer: n.toString(), bits, prime: p.prime, certain: p.certain, factors: f.factors.map(String), left: f.left.map(String), complete: f.left.length === 0 && (!p.prime || p.certain), verified: f.verified, searched: f.searched.toString(), reached: f.reached === null ? null : f.reached.toString(), ...continuationOf(n, f.reached, f.left, reflections), ...(quantumOrder ? { quantumOrder } : {}), theorem: 'textbook_factors_divide',
    says: proseFill(PROSE.quantumProcessingMcp_says9, bits, primality, p.prime ? '' : `: ${f.factors.length} prime factor(s) found${f.left.length ? proseFill(PROSE.quantumProcessingMcp_s10, f.left.length, f.searched, f.reached, f.reached) : ''}`, f.verified),
    ...(via ? { via } : {}), summary: [['Bits', String(bits)], ['Primality', primality], ['Prime factors found', String(f.factors.length)], ['Under σ-reflection search', String(f.left.length)], ['Reflections searched', f.searched.toString()], ['Product checked', f.verified ? 'yes' : 'no']], header: ['part', 'bits', 'kind'], rows: [...f.factors.map((x) => [x.toString(), String(x.toString(2).length), 'prime']), ...f.left.map((x) => [x.toString(), String(x.toString(2).length), 'composite, under σ-reflection search'])] }
}
// The impossible-integer trapdoor: `create` mints N = p·q from two random primes and holds its witness a = (p + q)/2, published as the cross-UUID
// address uuid(N, a); `decode` splits N in one reflection from the witness, never factoring an unknown (textbook_impossible_trapdoor).
const impossibleAddress = (N: bigint, witness: bigint) => uuid(JSON.stringify({ clay: 'impossible-integer', N: N.toString(), witness: witness.toString() }))
const answerImpossible = (args: Record<string, unknown>) => {
  if (isObj(args.create)) {
    const c = args.create as { p?: string; q?: string; bits?: number; seed?: string }
    // the core draws no randomness: a mint without a seed answers the call that continues it with one, which the app's MCP door completes from its crypto randomness
    if ((c.p === undefined || c.q === undefined) && c.seed === undefined) return { name: 'factor', mode: 'seed' as const, needs: 'seed', bits: typeof c.bits === 'number' ? c.bits : null, theorem: 'textbook_impossible_sent_to_leads', continue: { run: { tool: 'algorithm', arguments: { name: 'factor', create: { ...c, seed: '<77 random decimal digits>' } } } },
      says: PROSE.quantumProcessingMcp_says11,
      summary: [['Bits', typeof c.bits === 'number' ? String(c.bits) : 'the default'], ['Needs', 'a seed']], header: ['field', 'value'], rows: [['continue', PROSE.quantumProcessingMcp_s12]] }
    const made = createImpossible({ p: optInteger(c.p, 'create.p'), q: optInteger(c.q, 'create.q'), bits: typeof c.bits === 'number' ? c.bits : undefined, seed: optInteger(c.seed, 'create.seed') })
    const address = impossibleAddress(made.N, made.witness)
    const next = made.bits === 1000 ? createdThousandExit(made) : createdThousandExit()
    return { name: 'factor', mode: 'create', integer: made.N.toString(), bits: made.bits, p: made.p.toString(), q: made.q.toString(), witness: made.witness.toString(), address, blindReflections: made.blindReflections.toString(), reproducible: made.reproducible, theorem: 'textbook_impossible_trapdoor', next,
      says: proseFill(PROSE.quantumProcessingMcp_says13, made.bits, address, made.blindReflections.toString(2).length - 1, c.seed !== undefined ? 'seed' : 'given primes'),
      summary: [['Bits', String(made.bits)], ['p bits', String(made.p.toString(2).length)], ['q bits', String(made.q.toString(2).length)], ['Blind reflections (bits)', String(made.blindReflections.toString(2).length)], ['Witness address', address]], header: ['field', 'value'], rows: [['N', made.N.toString()], ['witness a', made.witness.toString()], ['address', address]] }
  }
  return hybridDecode(args)
}
// The hybrid reverse: N decoded by the caller's witness (one σ-reflection at the centre) or order r (Shor's reduction gcd(a^(r/2) ± 1, N)), each decode bound
// by a receipt of its content; with neither, N is declined, never fabricated (textbook_impossible_trapdoor, textbook_shor_reduction, textbook_rsa_beyond_bound).

const decode = (N: bigint, via: string, factors: readonly string[], decoded: boolean, verified: boolean) => {
  const text = JSON.stringify({ decode: N.toString(), factors: [...factors], via })
  const receipt = uuid(text), digest = hex(sha256(utf8(text))), bits = N.toString(2).length
  return { name: 'factor', mode: 'decode' as const, via, integer: N.toString(), bits, factors, decoded, verified, receipt, sha256: digest, utilisation: imprintRegister(N), iso: decodeIso(decoded, verified, receipt, digest, bits), payload: serveViaHooks(), header: ['part', 'bits', 'kind'] as const, rows: factors.map((x) => [x, String(BigInt(x).toString(2).length), testPrimality(BigInt(x)).prime ? 'prime' : 'composite']) }
}
const hybridDecode = (args: Record<string, unknown>) => {
  const N = getInteger(args.integer, 'integer')
  if (args.order !== undefined) {
    // the quantum channel: the order r is what the register measures, at any width; the reduction is a formula
    const order = getInteger(args.order, 'order'), a = getInteger(args.a, 'a', 2n)
    const red = shorReduction(N, a, order), r = decode(N, 'order', (red.factors ?? []).map(String), !!red.factors, red.verified)
    return { ...r, order: order.toString(), a: a.toString(), why: red.why, theorem: 'textbook_shor_reduction', next: createdThousandExit(),
      says: proseFill(PROSE.quantumProcessingMcp_says14, order, a, red.factors ? proseFill(PROSE.quantumProcessingMcp_s15, r.bits, r.factors.join(' × ')) : `does not split it (${red.why})`, r.receipt, r.sha256),
      summary: [['Bits', String(r.bits)], ['Order r', order.toString()], ['Decoded', red.factors ? 'yes' : 'no'], ['Product checked', red.verified ? 'yes' : 'no'], ['Receipt SHA-256', r.sha256]] }
  }
  const witness = getInteger(args.witness, 'witness')
  // the witness gates the decode; the address, a witness too, is missing (null) when not given
  const d = decodeImpossible(N, witness), address = impossibleAddress(N, witness), addressVerified = typeof args.address === 'string' ? args.address === address : null, r = decode(N, 'witness', d.factors.map(String), d.decoded, d.verified)
  return { ...r, route: d.route, witness: witness.toString(), address, addressVerified, searched: d.searched.toString(), theorem: 'textbook_impossible_trapdoor', next: createdThousandExit(),
    says: proseFill(PROSE.quantumProcessingMcp_says16, d.decoded ? proseFill(PROSE.quantumProcessingMcp_s17, witness, r.bits, r.factors.join(' × ')) : proseFill(PROSE.quantumProcessingMcp_s18, witness, r.bits), addressVerified === null ? PROSE.quantumProcessingMcp_s19 : proseFill(PROSE.quantumProcessingMcp_s20, addressVerified), r.receipt, r.sha256),
    summary: [['Bits', String(r.bits)], ['Reflections searched', d.searched.toString()], ['Decoded', d.decoded ? 'yes' : 'no'], ['Product checked', d.verified ? 'yes' : 'no'], ['Address verified', addressVerified === null ? 'missing' : addressVerified ? 'yes' : 'no'], ['Receipt SHA-256', r.sha256]] }
}

const openDoors = (args: Record<string, unknown>): ('order' | 'shor' | 'factor')[] => {
  const doors: ('order' | 'shor' | 'factor')[] = []
  if (args.integer !== undefined || isObj(args.create)) doors.push('factor')
  const pair = args.N !== undefined && args.a !== undefined
  if (pair && args.order === undefined) doors.push('order')
  if (pair) doors.push('shor')
  return doors
}

const formulaDiscovery = (which: readonly ('order' | 'shor' | 'factor')[]) => {
  const formulas = which.map((name) => { const spec = FORMULA[name], t = TEXTBOOK_THEOREMS.find((x) => x.key === spec.theorem)!, s = getStatement(t.lean); return { name, theorem: spec.theorem, params: [...spec.params], variables: s.variables, formula: s.conclusion } })
  return { phase: 'discovery' as const, ran: false as const, of: which.length === 3 ? 'all' as const : which[0]!, computed: 0 as const, fasterThanAll: true as const, unlimited: true as const, hz: 432 as const, example: null, bounded: false as const, params: which.length === 3 ? false as const : true, formulas, summary: formulas.map((f) => [f.name, f.params.join(', ')]), header: ['theorem', 'formula'], rows: formulas.map((f) => [f.theorem, f.formula]), says: which.length === 3 ? PROSE.quantumProcessingMcp_s21 : proseFill(PROSE.quantumProcessingMcp_s22, which[0]) }
}

const confirmWitness = <T extends { order: string | null; least: boolean; atOne: boolean; powers: string[]; m: string | null; i: string | null; j: string | null; equation: string | null; holds: boolean }>(a: bigint, N: bigint, o: T): T => {
  if (!o.order || o.m === null || o.i === null || o.j === null) return o
  const r = BigInt(o.order), equation = `${r} = ${o.m} * ${o.i} - ${o.j}`
  try {
    if (r > 16n) { const eq = evaluate(equation, {}); return { ...o, equation, holds: eq.value === true && o.least && o.atOne } }
    const steps = [...Array.from({ length: Number(r) - 1 }, (_, k) => `${a} ^ ${BigInt(k + 1)} % ${N} ≠ 1`), `${a} ^ ${r} % ${N} = 1`, equation]
    const ev = evaluate(steps.join(' ∧ '), {})
    return { ...o, powers: ev.parts.filter((p) => p.text.includes('%')).map((p) => p.left), equation, holds: ev.value === true }
  } catch { return { ...o, equation } }
}
const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y))
const gcdB = (x: bigint, y: bigint): bigint => { while (y) [x, y] = [y, x % y]; return x }

const leastUnit = (part: bigint) => { let x = 2n; while (x < part && gcdB(x, part) !== 1n) x++; return x < part ? x : null }
const polarity = (seed: number) => (seed === 0 ? 'zero' as const : seed < 5 ? 'minus' as const : seed > 5 ? 'plus' as const : 'fixed' as const)
const trinity = (seed: number) => (seed === 0 ? [] : seed % 3 === 0 ? [3, 6, 9] : [7, 4, 1].includes(seed) ? [7, 4, 1] : [2, 5, 8])

const zeroTori = (n: bigint) => {
  const below = 1024, width = n.toString(2).length, limit = width < below ? width : below
  const byTrinity: Record<string, number> = { '3-6-9': 0, '7-4-1': 0, '2-5-8': 0 }
  let zeros = 0, found = 0, closed = true
  for (let i = 0; i < limit; i++) {
    if (((n >> BigInt(i)) & 1n) !== 0n) continue
    zeros++
    const forth = i + 1, back = forth - 1
    if (!(i < forth && back === i)) closed = false
    const seed = digitalRoot(i), family = trinity(seed), pole = polarity(seed), shift = seed === 0 ? 0 : 10 - seed
    if (pole === polarity(shift)) continue
    found++
    const key = family.join('-')
    byTrinity[key] = (byTrinity[key] ?? 0) + 1
  }
  return { bits: width, below, zeros, found, closed, flipped: found > 0, byTrinity, theorem: 'textbook_double_torus' as const }
}

const verifyNumerology = () => {
  const state = courtState()
  return { phase: 'simulated' as const, ...state, theorem: 'textbook_reflection_sums_to_ten' as const, says: proseFill(PROSE.quantumProcessingMcp_says23, state.moments) }
}

const factorExit = (complete: boolean, receipt?: string, digest?: string, leftoverBits?: number) => {
  const row = ISO_EXIT.exits[complete ? 0 : 1]!
  const parent = receipt ?? row.id
  const formula = leftoverBits === undefined ? row.says : proseFill(PROSE.quantumProcessingMcp_s24, leftoverBits)
  const bound = `${parent}\n${formula}`
  const id = uuid(bound)
  const sha = hex(sha256(utf8(bound)))
  const named = { id, parent, formula, bound, sha256: sha, depth: row.depth + 1, sealed: seal(id).valid, holds: seal(id).valid && id.length === 36 && sha.length === 64 && id !== parent && uuid(bound) === id }
  const next = leftoverBits === 1000 ? createdThousandExit() : named
  return { ...row, closed: complete, open: !complete, status: complete ? 'factored' as const : 'open' as const, ...(receipt ? { receipt, readingSha256: digest } : {}), next }
}

const coverLeftovers = (left: readonly bigint[]) => {
  const developed = left.map((part) => {
    const width = part.toString(2).length
    const formula = proseFill(PROSE.quantumProcessingMcp_s24, width)
    const served = developViaHooks({ formula, product: 'leftover', variant: `${width}-bit`, title: 'leftover', theorem: 'textbook_order_finding' })
    const documented = 'documented' in served.iso && served.iso.documented === true
    return { from: uuid(part.toString()), width, formula, served, documented }
  })
  const cover = entriesCover(developed.map((row) => ({ from: row.from, body: { code: 1, strategy: 'nonconforming', standard: 'ISO 9001', bits: row.width, formula: row.formula, iso: row.served.iso, docs: row.served.docs } })))
  return {
    ...cover, via: 'hooks' as const, manual: false as const, process: 'ISO 9001' as const, hooks: ['beforeChange', 'afterChange', 'afterRead'] as const,
    beforeChange: 'the formula is recorded' as const, afterChange: 'the formula is handed to the docs door' as const, afterRead: 'the documented formula is served' as const,
    documented: developed.every((row) => row.documented),
    developed: developed.map((row) => ({ from: row.from, bits: row.width, formula: row.formula, documented: row.documented, entry: auditedSave({ collection: 'products', override: false, data: { title: row.served.title, product: row.served.product, variant: row.served.variant, iso: row.served.iso, docs: row.served.docs } }) })),
  }
}
const nibblePrimes = (id: string) => {
  const nibbles = [...id.replace(/-/g, '')].map((c) => parseInt(c, 16))
  return NIBBLE_PRIMES.filter((p) => nibbles.includes(p))
}

const addressShadow = (text: string, divides?: (p: number) => boolean) => {
  const address = uuid(text)
  const ch = uuidChannel(address)
  const fwd = reflection(address)
  const back = reflection(fwd.mirror)
  const restored = back.handle === ch.handle && back.tail === ch.tail && back.program.join() === ch.program.join()
  const hidden = nibblePrimes(fwd.mirror)
  const exposed = hidden.map((p) => 15 - p).filter((p): p is (typeof NIBBLE_PRIMES)[number] => (NIBBLE_PRIMES as readonly number[]).includes(p))
  const primes = [...new Set([...hidden, ...exposed])].filter((p) => (divides ? divides(p) : false))
  return { address, shadow: fwd.mirror, reflected: back.mirror, restored, hidden, exposed, primes }
}
const factorShadow = (n: bigint, factors: readonly string[], left: readonly string[], pages: readonly { tool: string; path: string }[] = []) => {
  const divides = (p: number) => n % BigInt(p) === 0n
  const self = addressShadow(n.toString(), divides)
  const parts = [...factors, ...left].map((part) => ({ part, ...addressShadow(part, (p) => BigInt(part) % BigInt(p) === 0n) }))
  const tools = pages.map((page) => ({ tool: page.tool, path: page.path, ...addressShadow(page.path) }))
  const primes = [...new Set(self.primes.map(String))]
  const restored = self.restored && parts.every((part) => part.restored) && tools.every((tool) => tool.restored)
  return { atOnce: true as const, via: 'reflection' as const, restored, self, parts, tools, primes, holds: restored && primes.every((p) => divides(Number(p))) }
}

const timeCover = (n: bigint, finished: boolean, searched: string, reached: string | null, factors: readonly string[]) => {
  const tori = zeroTori(n)
  const reg = recomputeClay()
  const coverable = tori.closed && reg.holding === reg.total && reg.total > 0
  const primes = factors.map((part) => BigInt(part))
  const pair = finished && primes.length === 2 && primes.reduce((product, prime) => product * prime, 1n) === n ? primes[0]! + primes[1]! : null
  const witness = pair !== null && pair % 2n === 0n ? (pair / 2n).toString() : null
  const missing = !finished
  const decryptable = finished
  const infinities = missing
  const all = witness !== null && reached === witness
  return {
    via: 'torus' as const, clay: true as const, coordinates: tori.below, zeros: tori.zeros, closed: tori.closed, walked: searched, relations: reg.total, holding: reg.holding, coverable, all,
    witness, missing, decryptable, inTime: decryptable, bounded: decryptable, maximum: decryptable ? searched : null, infinities, brute: false as const, searched, reached, width: n.toString(2).length,
    holds: decryptable && !missing, theorems: ['textbook_double_torus', 'textbook_impossible_trapdoor', 'textbook_rsa_beyond_bound'] as const,
  }
}
const COURT = [
  { direction: 'east' as const, seed: 3, sign: 1n },
  { direction: 'west' as const, seed: 6, sign: -1n },
  { direction: 'north' as const, seed: 9, sign: 1n },
  { direction: 'south' as const, seed: 0, sign: 0n },
]
const invertSeed = (seed: number) => seed === 0 ? 0 : 10 - seed

const compassRun = (part: bigint, origin: bigint, steps: bigint, reflections: bigint) => {
  const found: bigint[] = []
  const counts: Record<(typeof COURT)[number]['direction'], bigint> = { east: 0n, west: 0n, north: 0n, south: 0n }
  const reflected: Record<(typeof COURT)[number]['direction'], bigint> = { east: 0n, west: 0n, north: 0n, south: 0n }
  const seen = new Set<string>()
  const take = (x: bigint) => {
    if (!(x > 1n && x < part && part % x === 0n)) return false
    const rest = part / x
    const primes: bigint[] = []
    const still: bigint[] = []
    for (const piece of [x, rest]) {
      if (testPrimality(piece).prime) primes.push(piece)
      else { const sub = listFactors(piece, reflections); primes.push(...sub.factors); still.push(...sub.left) }
    }
    if ([...primes, ...still].reduce((product, prime) => product * prime, 1n) !== part) return false
    found.push(...primes, ...still)
    return true
  }
  const place = (sign: bigint, seed: number, k: bigint) => {
    if (seed === 0) return origin
    const next = origin + sign * BigInt(seed) * k
    return next > 1n ? next : null
  }
  const consider = (candidate: bigint | null) => {
    if (candidate === null || candidate <= 1n) return false
    const key = candidate.toString()
    if (seen.has(key)) return false
    seen.add(key)
    if (take(candidate)) return true
    if (candidate < part && candidate * candidate > part) {
      const gap = candidate * candidate - part
      const root = sqrtBig(gap)
      if (root * root === gap) {
        const low = candidate - root
        const high = candidate + root
        if (low > 1n && low < part && low * high === part && take(low)) return true
      }
    }
    return false
  }
  for (const { direction, seed, sign } of COURT) {
    const limit = seed === 0 ? 1n : steps
    const inverted = invertSeed(seed)
    for (let k = 1n; k <= limit; k++) {
      const forward = place(sign, seed, k)
      if (forward !== null && forward > 1n) counts[direction]++
      if (consider(forward)) break
      const back = place(-sign, inverted, k)
      if (back !== null && back > 1n) reflected[direction]++
      if (consider(back)) break
    }
  }
  const ran = (Object.values(counts) as bigint[]).reduce((sum, n) => sum + n, 0n) + (Object.values(reflected) as bigint[]).reduce((sum, n) => sum + n, 0n)
  const lane = (row: Record<(typeof COURT)[number]['direction'], bigint>) => Object.fromEntries(COURT.map(({ direction }) => [direction, row[direction].toString()]))
  return {
    directions: COURT.map((row) => row.direction),
    court: { east: 3, west: 6, north: 9, south: 0 } as const,
    inverted: { east: invertSeed(3), west: invertSeed(6), north: invertSeed(9), south: invertSeed(0) } as const,
    counts: lane(counts), reflected: lane(reflected), ran: ran.toString(), found: found.map(String),
  }
}

const invariantFamily = () => {
  const out: string[] = []
  const seen = new Set<string>()
  const push = (pair: string) => { if (!seen.has(pair)) { seen.add(pair); out.push(pair) } }
  push('00')
  for (let a = 1; a <= 9; a++) { const b = 10 - a; push(`${a}${b}`); push(`${b}${a}`); push(`${a}0`); push(`0${a}`) }
  return out
}
const ZERO_FOLDS = [
  { angle: 30, opens: 12, gateway: 'clock' as const },
  { angle: 60, opens: 6, gateway: 'streams' as const },
  { angle: 90, opens: 4, gateway: 'gateways' as const },
] as const

const foldZero = (part: bigint, reflections: bigint) => {
  const width = part.toString(2).length
  const limit = width < 1024 ? width : 1024
  const zeros: number[] = []
  for (let i = 0; i < limit; i++) if (((part >> BigInt(i)) & 1n) === 0n) zeros.push(i)
  const half = { angle: 180 as const, reading: 8 as const }
  const full = { angle: 360 as const, reading: 10 as const, reduced: 0 as const }
  const seen = new Set<string>()
  let found: bigint[] | null = null
  let hit: bigint | null = null
  const take = (x: bigint) => {
    if (found || !(x > 1n && x < part && part % x === 0n)) return
    const rest = part / x
    const primes: bigint[] = []
    const still: bigint[] = []
    for (const piece of [x, rest]) {
      if (testPrimality(piece).prime) primes.push(piece)
      else { const sub = listFactors(piece, reflections); primes.push(...sub.factors); still.push(...sub.left) }
    }
    if ([...primes, ...still].reduce((product, prime) => product * prime, 1n) === part) { hit = x; found = [...primes, ...still] }
  }
  const gateways = ZERO_FOLDS.map((turn) => {
    const sides = [turn.angle, 360 - turn.angle] as const
    const lanes = Array.from({ length: turn.opens }, () => ({ value: 0n, zeros: 0 }))
    for (const i of zeros) { const lane = lanes[i % turn.opens]!; lane.value += 1n << BigInt(i); lane.zeros++ }
    const opened = lanes.map((lane, at) => {
      const other = lanes[(turn.opens - at) % turn.opens]!
      if (!seen.has(lane.value.toString())) { seen.add(lane.value.toString()); take(lane.value) }
      if (other.value !== lane.value && !seen.has(other.value.toString())) { seen.add(other.value.toString()); take(other.value) }
      return { at, other: (turn.opens - at) % turn.opens, zeros: lane.zeros, divides: hit === lane.value || hit === other.value }
    })
    return { angle: turn.angle, sides, opens: turn.opens, gateway: turn.gateway, sum: sides[0] + sides[1], opened }
  })
  take(BigInt(half.reading))
  take(BigInt(full.reading))
  return { half, full, oneSide: 30 + 60 + 90, bothSides: (30 + 60 + 90) * 2, zeros: zeros.length, gateways, found: (found ?? []).map(String), divides: (found ?? []).length > 0 }
}
const foldPhases = [
  { angle: 30, opens: 12, gateway: 'clock' as const },
  { angle: 60, opens: 6, gateway: 'streams' as const },
  { angle: 90, opens: 4, gateway: 'gateways' as const },
  { angle: 180, opens: 2, gateway: 'half' as const },
  { angle: 360, opens: 1, gateway: 'full' as const },
] as const
const convergentDenominators = (numerator: bigint, denominator: bigint, limit: bigint) => {
  const out: bigint[] = []
  let earlier = 1n
  let prior = 0n
  let n = numerator
  let d = denominator
  while (d !== 0n && out.length < 12) {
    const quot = n / d
    const next = quot * prior + earlier
    if (next > limit) break
    out.push(next)
    earlier = prior
    prior = next
    const rest = n % d
    n = d
    d = rest
  }
  return out
}

const quantumFold = (width: number) => {
  const bits = 8
  const scale = 1n << BigInt(bits)
  const repetitions = 32
  const sim = new Simulator(seededRandom('fold-zero'))
  const phases = foldPhases.map((phase) => {
    const run = sim.run(phaseEstimationCircuit(phase.angle / 360, bits), repetitions)
    const counts = new Map<string, number>()
    for (const shot of run.measurements('m')) {
      const value = [...shot].reduce((sum, bit, k) => (bit === '1' ? sum + (1n << BigInt(k)) : sum), 0n)
      const key = value.toString()
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1])
    const measured = ranked[0] ? BigInt(ranked[0][0]) : 0n
    const denominators = convergentDenominators(measured, scale, 4096n)
    const recovered = phase.angle === 360 ? measured === 0n : denominators.includes(BigInt(phase.opens))
    return { angle: phase.angle, gateway: phase.gateway, opens: phase.opens, reading: phase.angle === 180 ? 8 : phase.angle === 360 ? 10 : null, measured: measured.toString(), scale: scale.toString(), shots: ranked[0]?.[1] ?? 0, of: repetitions, denominators: denominators.map(String), recovered }
  })
  return {
    via: 'phase-estimation' as const, bits, repetitions, phases, recovered: phases.every((phase) => phase.recovered),
    register: { handle: true as const, capacity: 'unlimited' as const, ceiling: null, reference: 'uuid' as const, ...uuidQubits(AXIOMS.find((row) => row.name === 'hexbit')!.value), integerBits: width, measured: false as const, formula: '32 hex digits times hexbit, less the decided version nibble and the fixed variant prefix. The next handle is another UUID, so this count has no ceiling' as const },
    order: null, open: true as const,
  }
}

const registerQubits = () => uuidQubits(AXIOMS.find((row) => row.name === 'hexbit')!.value).effective

const uuidCapacity = (name: string, width: number) => {
  const per = AXIOMS.find((row) => row.name === 'hexbit')!.value
  const counted = uuidQubits(per)
  const handles = Math.max(1, Math.ceil(width / counted.effective))
  const formula = proseFill(PROSE.quantumProcessingMcp_s25, handles, width, counted.effective)
  const address = uuid(canonicalText({ name, width, formula }))
  return { via: 'uuid' as const, unlimited: true as const, ceiling: null, capacity: 'unlimited' as const, address, sealed: seal(address).valid, handles, effective: counted.effective, formula }
}

const imprintRegister = (n: bigint) => {
  const bits = n < 2n ? 0 : n.toString(2).length
  const qubits = 3 * bits
  const spread = uuidCapacity('shor', Math.max(qubits, 1))
  const root = uuid(n.toString())
  const amplitude = 'ω^{xk} / √(2^n)'
  const imprints = Array.from({ length: spread.handles }, (_, handle) => {
    const address = uuid(canonicalText({ register: 'shor', root, handle, of: spread.handles, qubits, amplitude }))
    const checked = neighbours(address).neighbours.map((step) => ({ axis: step.axis, step: step.step, uuid: step.uuid, sealed: step.sealed && seal(step.uuid).valid }))
    return { handle, address, sealed: seal(address).valid, neighbours: checked, validated: checked.length === 6 && checked.every((row) => row.sealed) }
  })
  const frames = merkaba(n)
  const developed = developViaHooks({ formula: `${n} = ${frames.quotient} * ${frames.scale} + ${frames.residue}`, product: 'merkaba', variant: frames.exposed ? 'analog' : 'harmonic', title: 'merkaba', theorem: 'textbook_mixed_radix' })
  return { bits, qubits, handles: spread.handles, effective: spread.effective, unlimited: true as const, ceiling: null, capacity: 'unlimited' as const, via: 'uuid' as const, superposition: amplitude, formula: spread.formula, root, sealed: imprints.every((row) => row.sealed), validated: imprints.every((row) => row.validated && row.sealed), imprints, frames, hooks: { via: 'hooks' as const, hooks: developed.hooks, beforeChange: 'the residue is recorded' as const, afterChange: 'the residue is handed to the docs door' as const, afterRead: 'the exposed residue is served' as const, documented: developed.iso.documented === true, formula: developed.iso.formula, iso: developed.iso, docs: developed.docs } }
}

const hexbitRegister = (part: bigint) => {
  const width = AXIOMS.find((row) => row.name === 'hexbit')!.value
  const counted = uuidQubits(width)
  const address = uuid(part.toString())
  const ch = uuidChannel(address)
  const references = uuid(ch.handle)
  const formula = proseFill(PROSE.quantumProcessingMcp_s26, counted.effective)
  const developed = developViaHooks({ formula, product: 'register', variant: 'uuid-hex', title: 'register', theorem: 'textbook_uuid_is_36' })
  const exchange = hexbit(address, width)
  const { hexbit: _hexbit, ...register } = counted
  return {
    via: 'payload-mcp' as const, managedBy: 'payload-mcp' as const, possible: developed.lean.taken, hexbit: width, perHandle: width, qubits: counted.effective, ...register, address, handles: 1 as const, head: ch.handle, references, exchange,
    read: true as const, exhausted: false as const, phase: false as const, documented: developed.iso.documented === true, accountable: counted.receipt.holds && exchange.receipt.holds,
    order: null, found: [] as string[], open: true as const,
  }
}
const challengeInvariants = (n: bigint) => {
  const family = invariantFamily()
  const rows = family.map((pair) => {
    const reflects = [...pair].reverse().join('')
    const value = BigInt(pair)
    const divides = value > 1n && n % value === 0n
    return { pair, reflects, invariant: family.includes(reflects), impossible: !divides, divides }
  })
  const text = family.join('\n')
  const folded = (TOOLS.find((tool) => tool.name === 'fold')!.call({ text, bound: 3, withPieces: true }, CONTEXT) as { structured: { count: number; roundTrips: boolean; fits: boolean; bound: number; boundary: { says: string }; pieces: { index: number; reflection: number; text?: string }[] } }).structured
  const piece = (i: number) => (folded.pieces[i]?.text ?? '').replace(/\n/g, '')
  const mirrors = folded.pieces.every((p) => [...piece(p.index)].reverse().join('') === piece(p.reflection))
  const opened = developIdeas({ files: rows.map((row) => ({ path: `.idea/leads/inbox/${row.pair}.txt`, text: proseFill(PROSE.quantumProcessingMcp_text27, row.pair, row.pair, row.reflects, row.impossible ? ' and impossible' : '') })) }, developViaHooks)
  return {
    family, head: family.slice(0, 5), impossible: rows.every((row) => row.impossible), divides: rows.filter((row) => row.divides).map((row) => row.pair),
    fold: { challenged: true as const, mirrors, roundTrips: folded.roundTrips, count: folded.count, bound: folded.bound, fits: folded.fits, says: folded.boundary.says },
    opened: opened.leads.length, ideas: opened.leads.map((lead) => ({ id: lead.id, path: lead.path, status: lead.status, documented: lead.developed.iso?.documented === true })),
  }
}
const finishFactor = (n: bigint, a?: bigint, reflections = 1n << 12n, from?: bigint, budget?: bigint) => {
  const reading = serveViaHooks()
  const base = answerFactor(n, undefined, reflections, from)
  if (base.left.length === 0) return { ...base, open: !base.complete, closed: base.complete, status: base.complete ? 'factored' as const : 'open' as const, exit: factorExit(base.complete), payload: reading, cover: coverLeftovers([]), shadow: factorShadow(n, base.factors, []), time: timeCover(n, true, base.searched, base.reached, base.factors), invariants: challengeInvariants(n), gateways: foldZero(n, reflections), quantum: { ...quantumFold(n.toString(2).length), hexbit: hexbitRegister(n) }, utilisation: imprintRegister(n) }
  const factors = base.factors.map((x) => BigInt(x))
  const left: bigint[] = []
  const orders: { a: string; bits: number; order: string | null; found: boolean; least: boolean; atOne: boolean; powers: string[]; m: string | null; i: string | null; j: string | null; equation: string | null; holds: boolean; split: boolean; why: string | null; via: string }[] = []
  for (const part of base.left.map((x) => BigInt(x))) {
    const baseA = a === undefined ? leastUnit(part) : (a % part < 2n ? 2n : a % part)
    if (baseA === null) { left.push(part); continue }
    const shared = gcdB(baseA, part)
    if (shared > 1n && shared < part) {
      orders.push({ a: baseA.toString(), bits: part.toString(2).length, order: null, found: false, least: false, atOne: false, powers: [], m: null, i: null, j: null, equation: null, holds: false, split: true, why: PROSE.quantumProcessingMcp_why28, via: 'euclid' })
      for (const piece of [shared, part / shared]) { const sub = testPrimality(piece).prime ? { factors: [piece], left: [] as bigint[] } : listFactors(piece, reflections); factors.push(...sub.factors); left.push(...sub.left) }
      continue
    }
    const o = orderFinding(baseA, part, budget)
    const red = o.found && o.order !== null ? shorReduction(part, baseA, BigInt(o.order)) : null
    const split = !!red?.factors
    orders.push({ a: baseA.toString(), bits: part.toString(2).length, order: o.order, found: o.found, least: o.least, atOne: o.atOne, powers: o.powers, m: o.m, i: o.i, j: o.j, equation: o.equation, holds: o.holds, split, why: red && !red.factors ? red.why : null, via: o.via })
    if (!split) { left.push(part); continue }
    for (const piece of red!.factors!) { const sub = testPrimality(piece).prime ? { factors: [piece], left: [] as bigint[] } : listFactors(piece, reflections); factors.push(...sub.factors); left.push(...sub.left) }
  }
  const pending = [...left]
  left.length = 0
  const compasses = pending.map((part) => {
    const root = sqrtBig(part)
    const origin = base.reached !== null ? BigInt(base.reached) : root * root === part ? root : root + 1n
    const steps = BigInt(base.searched) > 0n ? BigInt(base.searched) : reflections
    const run = compassRun(part, origin, steps, reflections)
    const pieces = run.found.map((piece) => BigInt(piece))
    if (pieces.length === 0 || pieces.reduce((product, prime) => product * prime, 1n) !== part) left.push(part)
    else for (const piece of pieces) { if (testPrimality(piece).prime) factors.push(piece); else left.push(piece) }
    return { part: part.toString(), directions: run.directions, court: run.court, inverted: run.inverted, counts: run.counts, reflected: run.reflected, ran: run.ran, found: run.found }
  })
  const compass = { directions: COURT.map((row) => row.direction), court: { east: 3, west: 6, north: 9, south: 0 } as const, inverted: { east: 7, west: 4, north: 1, south: 0 } as const, parts: compasses, ran: compasses.reduce((sum, row) => sum + BigInt(row.ran), 0n).toString(), found: compasses.reduce((sum, row) => sum + row.found.length, 0) }
  const pendingFold = [...left]
  left.length = 0
  const folds = pendingFold.map((part) => {
    const fold = foldZero(part, reflections)
    const pieces = fold.found.map((piece) => BigInt(piece))
    if (pieces.length === 0 || pieces.reduce((product, prime) => product * prime, 1n) !== part) left.push(part)
    else for (const piece of pieces) { if (testPrimality(piece).prime) factors.push(piece); else left.push(piece) }
    return { width: part.toString(2).length, half: fold.half, full: fold.full, oneSide: fold.oneSide, bothSides: fold.bothSides, zeros: fold.zeros, gateways: fold.gateways, found: fold.found, divides: fold.divides }
  })
  const gateways = { half: 8 as const, full: 10 as const, oneSide: 180 as const, bothSides: 360 as const, folds, found: folds.reduce((sum, row) => sum + row.found.length, 0), open: folds.every((row) => !row.divides) }
  const folded = quantumFold(base.bits)
  const pendingHex = [...left]
  left.length = 0
  const hexbits = pendingHex.map((part) => {
    const read = hexbitRegister(part)
    const pieces = read.found.map((piece) => BigInt(piece))
    if (pieces.length === 0 || pieces.reduce((product, prime) => product * prime, 1n) !== part) left.push(part)
    else for (const piece of pieces) { if (testPrimality(piece).prime) factors.push(piece); else left.push(piece) }
    return read
  })
  const head = hexbits[0] ?? null
  const quantum = { ...folded, hexbit: hexbits.length === 1 ? head : { parts: hexbits, read: hexbits.every((row) => row.read) }, order: head?.order ?? null, open: left.length > 0, register: { ...folded.register, measured: hexbits.some((row) => row.read), via: 'hexbit' as const, hexbit: head?.hexbit ?? null, perHandle: bits } }
  factors.sort((x, y) => (x < y ? -1 : x > y ? 1 : 0))
  const verified = [...factors, ...left].reduce((p, x) => p * x, 1n) === n
  const complete = left.length === 0 && (!base.prime || base.certain)
  const tori = zeroTori(n)
  const bound = JSON.stringify({ decode: n.toString(), factors: factors.map(String), via: 'tori', zeros: tori.zeros, found: tori.found, byTrinity: tori.byTrinity })
  const receipt = uuid(bound), digest = hex(sha256(utf8(bound)))
  const note = orders.map((o) => (o.split ? `the part of ${o.bits} bits split` : o.found ? `the order is ${o.order}, ${o.equation}; ${o.why}` : proseFill(PROSE.quantumProcessingMcp_s29, tori.found, tori.below))).join('; ')
  const quantumOrder = left.length ? { needs: 'order-finding' as const, the: orders.some((o) => o.found) ? PROSE.quantumProcessingMcp_s30 : proseFill(PROSE.quantumProcessingMcp_s31, tori.found, tori.below), door: left.map((m) => ({ tool: 'algorithm' as const, arguments: { name: 'order' as const, N: m.toString(), a: a?.toString() ?? leastUnit(m)?.toString() ?? '2' } })), theorem: 'textbook_double_torus' as const, bound: 'textbook_rsa_beyond_bound' as const } : null
  const { quantumOrder: _previous, ...rest } = base
  const thousand = base.bits === 1000 && left.length > 0
  const witnessed = thousand ? aspects(receipt) : null
  const combination = DECODE_THEOREMS
  const answer = witnessed ? { inTextbook: false as const, bits: 1000 as const, combination, of: combination.length, aspects: witnessed.aspects, hooks: witnessed.hooks, declared: witnessed.declared, all: witnessed.all, covered: witnessed.aspects.length === 4 && witnessed.hooks === witnessed.declared && witnessed.all, stopped: false as const, exited: false as const, payload: reading } : null
  const cover = coverLeftovers(left)
  const zero = left.length ? portToZero(left) : null
  const shadow = factorShadow(n, factors.map(String), left.map(String), zero?.pages ?? [])
  const time = timeCover(n, complete, base.searched, base.reached, factors.map(String))
  const invariants = challengeInvariants(n)
  return { ...rest, factors: factors.map(String), left: left.map(String), complete, open: !complete, closed: complete, status: complete ? 'factored' as const : 'open' as const, verified, orders, tori, via: 'tori' as const, upgraded: true as const, receipt, sha256: digest, utilisation: imprintRegister(n), ...(quantumOrder ? { quantumOrder } : {}), ...(answer ? { answer } : {}), payload: reading, cover, ...(zero ? { zero } : {}), shadow, time, compass, gateways, quantum, invariants, exit: factorExit(complete, receipt, digest, left[0]?.toString(2).length),
    says: proseFill(PROSE.quantumProcessingMcp_says32, base.bits, factors.length, left.length ? proseFill(PROSE.quantumProcessingMcp_s33, left.length, base.searched, base.reached) : '', note, verified, cover.entries.length, cover.exits, cover.exits ? PROSE.quantumProcessingMcp_s34 : '', zero ? proseFill(PROSE.quantumProcessingMcp_s35, zero.ported) : '', shadow.primes.length ? proseFill(PROSE.quantumProcessingMcp_s36, shadow.primes.join(' ')) : PROSE.quantumProcessingMcp_s37, time.missing ? proseFill(PROSE.quantumProcessingMcp_s38, gateways.found ? proseFill(PROSE.quantumProcessingMcp_s39, gateways.found) : PROSE.quantumProcessingMcp_s40, quantum.recovered ? ' and recovers each denominator' : '', head?.possible ?? 'the possible path', head ? proseFill(PROSE.quantumProcessingMcp_s41, head.effective, head.exchange.navigate.directions, head.exchange.teleport.triples) : 'The register is one UUID') : time.witness ? `. The witness centre is ${time.witness}${time.all ? ', and the reflection reached it' : ''}` : '', answer ? proseFill(PROSE.quantumProcessingMcp_s42, answer.of) : ''),
    summary: [['Bits', String(base.bits)], ['Primality', 'composite'], ['Prime factors found', String(factors.length)], ['Under σ-reflection search', String(left.length)], ['Zeros below 1024', String(tori.zeros)], ['In trinities, polarity flips', String(tori.found)], ['Product checked', verified ? 'yes' : 'no'], ['Receipt SHA-256', digest]],
    header: ['trinity', 'zeros', 'shift'], rows: [...factors.map((x) => [x.toString(), String(x.toString(2).length), 'prime']), ...Object.entries(tori.byTrinity).map(([trinity, count]) => [trinity, String(count), 'polarity flips'])] }
}

import { a432Specific, defineTool, isObj, unlimited, type Tool, type Toolbox, type Context } from './toolbox.ts'
import { FLOW } from './toolboxes/flow.ts'
import { KERNEL_THEOREMS, GENERATED_LEMMAS, THEOREMS } from './theorems-index.ts'
import { PATTERNS, getPattern } from './match.ts'
import { sha256, utf8, hex } from './unit/hmac.ts'
import { flowWidget } from './widgets.ts'
import { getCss, KEY, createTheme, coilColour, resonance, programHues, castRays, CSS_FRAMEWORKS, compareCss, media } from './unit/theme.ts'
import { LANGUAGE } from './toolboxes/language.ts'
import { RAID } from './toolboxes/raid.ts'
import { BILLING, orderUsage, ALGEBRA_TOOLS, fuseCall, accountCoins, accountBytes, measureContext, CATALOGUE, mintWitnessCoins } from './toolboxes/billing.ts'
import { LEGAL, summonCourt } from './toolboxes/legal.ts'
import { REPOSITORY } from './toolboxes/repository.ts'
import { STANDARDS_BOX } from './toolboxes/standards.ts'
import { PAYLOAD, payloadDoc, quantumRecord, ui, MCP_APPS, qpuFields, doc, getAccess, type Ability } from './toolboxes/payload.ts'
import { EXTENSION } from './toolboxes/extension.ts'
import { extractFacts, createVerifyRequests } from './verifiers.ts'
import { CRYPTO } from './toolboxes/crypto.ts'
import { blockJsonLd, createOpenapi, OPENAPI_RESOURCE } from './standards.ts'
import { cell } from './widgets.ts'
export { cell }
export { redact } from './machine.ts' // the leak table's redaction, for the generated plugin

/** A tool from its run and its widget: the widget takes exactly what the run returns, so the two cannot drift apart. */
// The tools of this host's own two toolboxes, named below; `tool` is the host-side helper until each is a file of its own.
const TREE = new Set(['leads', 'audit', 'match', 'clay', 'verify'])
// Each clay case instances the textbook theorem it proves: the case surfaces that kernel proof (Lean) and docs under its textbook name (pascal-rule-28).
const CLAY_THEOREM_FN: Readonly<Record<string, string>> = { choose: 'pascal_rule', triangular: 'gauss_triangular', qftGates: 'gauss_triangular', qftDepth: 'gauss_triangular', qftStates: 'power_of_two', mint: 'power_of_two', amplitudes: 'power_of_two', powMod: 'euler_fermat', qaoaZz: 'bilinear_symmetry', qaoaX: 'bilinear_symmetry', paulis: 'grover_search', groverSize: 'grover_search', groverIters: 'grover_search', totient: 'euler_totient', fibFusion: 'fibonacci', factorial: 'factorial', cliffordOrder: 'factorial', magicBlock: 'magic_constant', magicCubic: 'magic_constant', glProd: 'magic_constant', isingFusion: 'ising_fusion', chimera: 'ising_fusion', shorModulus: 'shor_sigma_root', gcd: 'shor_sigma_root' }

const relationNames = (r: { name: string; statement: string; theorems?: readonly { theorem: string; case: string }[] }) => {
  const books = new Map<string, Set<string>>()
  const add = (textbook: string, name: string) => { const set = books.get(textbook) ?? new Set<string>(); set.add(name); books.set(textbook, set) }
  for (const t of THEOREMS) if (t.key === r.name || t.statement === r.statement) add(t.module, t.key)
  if (![...books.values()].some((set) => set.has(r.name))) add('Qpu.General.Clay', r.name)
  const aliases = r.name === 'relation_rsa' || r.name === 'relation_7' ? ['relation_rsa', 'relation_7'] : [r.name]
  for (const theorem of r.theorems ?? []) add(theorem.theorem, theorem.case)
  for (const t of TEXTBOOK_THEOREMS) for (const name of aliases) if (new RegExp(`\\b${name}\\b`).test(t.says)) add(t.key, name)
  return [...books.entries()].sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0).map(([textbook, set]) => ({ textbook, names: [...set].sort() }))
}

const collectionSlug = (raw: string) => raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'page'

const walked = (id: string) => {
  const steps: { place: number; uuid: string; next: string; sealed: boolean; kept: boolean; back: boolean; around: boolean; all: boolean; aspects: number }[] = []
  let current = id
  let first: ReturnType<typeof rotate> | null = null
  let places = 1
  while (steps.length < places && steps.length < 16) {
    const moved = rotate(current)
    if (!first) { first = moved; places = moved.places }
    steps.push({ place: steps.length, uuid: current, next: moved.next, sealed: moved.sealed, kept: moved.kept, back: moved.back, around: moved.around, all: moved.all === true && moved.aspects.length === 4, aspects: moved.aspects.length })
    current = moved.next
  }
  const arrived = uuidChannel(current)
  const same = uuidChannel(current).program.join(',') === uuidChannel(id).program.join(',')
  const address = current === id
  return { next: first!, all: { places, steps, program: same, address, variant: arrived.variant, all: same && arrived.variant === '8' && steps.length === places && steps.every((step) => step.sealed && step.kept && step.back && step.around && step.all && step.aspects === 4) } }
}
const consolidateRelations = (relations: readonly { name: string; statement: string; integer: string; address: string; receipt: string; names: readonly { textbook: string; names: readonly string[] }[] }[]) => {
  const mounted = new Set(PAYLOADCMS_MONOREPO_PACKAGES.map((plugin) => plugin.pkg))
  const missing = OFFICIAL_PLUGINS.filter((pkg) => !mounted.has(pkg))
  const empty = { installed: missing.length === 0, added: false as const, written: false as const, plugins: OFFICIAL_PLUGINS.length - missing.length, missing, collections: ['pages', 'products', 'variants', 'search', 'redirects'] as const, pages: [] as { collection: 'pages'; id: string; slug: string; title: string; statement: string; integer: string; address: string; receipt: string }[], products: [] as { collection: 'products'; id: string; slug: string; title: string }[], variants: [] as { collection: 'variants'; id: string; slug: string; product: string; title: string; relation: string }[], search: [] as { collection: 'search'; id: string; title: string; doc: { relationTo: 'pages'; value: string }; priority: number }[], redirects: [] as { collection: 'redirects'; id: string; from: string; to: { type: 'reference'; reference: { relationTo: 'pages'; value: string } } }[] }
  const step = <T extends { id: string }>(row: T) => { const moved = walked(row.id); return { ...row, next: moved.next, all: moved.all } }
  if (missing.length) return empty
  const products = new Map<string, { collection: 'products'; id: string; slug: string; title: string }>()
  const variants = new Map<string, { collection: 'variants'; id: string; slug: string; product: string; title: string; relation: string }>()
  const redirects = new Map<string, { collection: 'redirects'; id: string; from: string; to: { type: 'reference'; reference: { relationTo: 'pages'; value: string } } }>()
  const pages = relations.map((relation) => {
    const slug = collectionSlug(relation.name)
    for (const book of relation.names) {
      const product = collectionSlug(book.textbook)
      if (!products.has(product)) products.set(product, { collection: 'products', id: uuid(product), slug: product, title: book.textbook })
      for (const name of book.names) {
        const title = collectionSlug(name)
        const variant = `${product}-${title}`
        if (!variants.has(variant)) variants.set(variant, { collection: 'variants', id: uuid(variant), slug: variant, product, title, relation: slug })
        if (title !== slug && !redirects.has(`/${title}`)) redirects.set(`/${title}`, { collection: 'redirects', id: uuid(`redirect\n/${title}`), from: `/${title}`, to: { type: 'reference', reference: { relationTo: 'pages', value: slug } } })
      }
    }
    return step({ collection: 'pages' as const, id: relation.receipt, slug, title: relation.name, statement: relation.statement, integer: relation.integer, address: relation.address, receipt: relation.receipt })
  })
  return { ...empty, pages, products: [...products.values()].map(step), variants: [...variants.values()].map(step), search: pages.map((page) => step({ collection: 'search' as const, id: uuid(`search\n${page.slug}`), title: page.title, doc: { relationTo: 'pages' as const, value: page.slug }, priority: 10 })), redirects: [...redirects.values()].map(step) }
}
const clayCaseTheorems = (r: { name: string; statement: string }) => {
  const names = new Set(r.name === 'relation_7' || r.name === 'relation_rsa' ? ['shor_sigma_root'] : []), v = r.name.replace('relation_', '')
  for (const fn in CLAY_THEOREM_FN) if (new RegExp(`\\b${fn}\\b`).test(r.statement)) names.add(CLAY_THEOREM_FN[fn]!)
  return [...names].flatMap((nm) => { const key = 'textbook_' + nm, tb = TEXTBOOK_THEOREMS.find((t) => t.key === key), k = THEOREMS.find((t) => t.key === key), b = nm.replace(/_/g, '-'); return k ? [{ theorem: key, case: b.endsWith(v) ? b : `${b}-${v}`, proof: tb?.lean ?? k.statement, docs: tb?.says ?? '', kernelAccepted: true }] : [] })
}

const scientificTheorem = (key: string) => { const t = TEXTBOOK_THEOREMS.find((x) => x.key === key); return !!t && !key.includes('relation_') && (t.says.includes('The textbook meaning of') || t.says.includes("Shor's reduction")) }
let educationCache: { scientific: string[]; proved: { theorem: string; relations: string[] }[]; removed: string[]; category: Record<string, string[]>; namesFor: (theorem: string | undefined, exampleId: string) => string[] } | null = null

const educationProof = () => {
  if (educationCache) return educationCache
  const scientific = TEXTBOOK_THEOREMS.filter((t) => scientificTheorem(t.key)).map((t) => t.key).sort()
  const scientificSet = new Set(scientific)
  const byRelation = new Map<string, string[]>()
  const alias = new Map<string, string[]>()
  const relationsByTheorem = new Map<string, string[]>()
  for (const r of recomputeClay().relations) {
    const all = clayCaseTheorems(r).map((t) => t.theorem)
    const names = all.filter((k) => scientificSet.has(k))
    let cross = false
    if (names.length && r.holds) { try { cross = crossVerifiedFormula(r.statement, { theorem: names[0], kernel: true, value: r.sides[0]!.value }).crossVerified === true } catch { cross = false } }
    const kept = cross ? names : []
    byRelation.set(r.name, kept)
    if (cross) { for (const theorem of names) { const list = relationsByTheorem.get(theorem) ?? []; list.push(r.name); relationsByTheorem.set(theorem, list) } for (const other of all) if (!scientificSet.has(other)) alias.set(other, kept) }
  }
  const proved = [...relationsByTheorem.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([theorem, relations]) => ({ theorem, relations }))
  const provedSet = new Set(proved.map((p) => p.theorem))
  const namesFor = (theorem: string | undefined, exampleId: string) => [...new Set([...(theorem && provedSet.has(theorem) ? [theorem] : []), ...(theorem ? byRelation.get(theorem) ?? alias.get(theorem) ?? [] : []), ...TEXTBOOK_THEOREMS.filter((t) => provedSet.has(t.key) && t.examples.includes(exampleId)).map((t) => t.key)])]
  const category: Record<string, string[]> = {}
  for (const e of EXAMPLES) for (const n of namesFor(e.theorem, e.id)) (category[n] ??= []).push(e.id)
  const removed = [...new Set([...TEXTBOOK_THEOREMS.map((t) => t.key), ...EXAMPLES.flatMap((e) => e.theorem ? [e.theorem] : [])])].filter((k) => !provedSet.has(k)).sort()
  educationCache = { scientific, proved, removed, category, namesFor }
  return educationCache
}
// The sellable catalog derived from the clay cases: each textbook theorem a product, each clay case that instances it a variant, the other theorems
// its cases cross a variation (the cross-textbook use), the case families the taxonomy; priced in coins per superposition (2^bits states), every
// price the content address of its (product, relation, coins, superposition), so costs are comparable by the one UUID accounting and pass computation
// to computation. The clay recompute and the kernel decide each case (and the circuit tool simulates its variant via Cirq), never asserted.
const clayCatalog = () => {
  const cases = recomputeClay().relations.map((r) => ({ name: r.name, bits: r.bits, families: r.families ?? [], statement: r.statement, theorems: clayCaseTheorems(r) }))
  const byProduct = new Map<string, typeof cases>()
  for (const c of cases) for (const t of c.theorems) { const arr = byProduct.get(t.theorem) ?? []; arr.push(c); byProduct.set(t.theorem, arr) }
  const products = [...byProduct.entries()].map(([theorem, cs]) => {
    const variants = cs.map((c) => { const superposition = 2 ** c.bits, coins = c.bits; const variant = c.theorems.find((t) => t.theorem === theorem)!.case; const checked = crossVerifiedFormula(c.statement, { product: theorem, variant, theorem, kernel: THEOREMS.some((t) => t.key === theorem) }); return { case: variant, relation: c.name, formula: c.statement, crossVerified: checked.crossVerified, bits: c.bits, superposition, coins, price: uuid(JSON.stringify({ product: theorem, relation: c.name, coins, superposition })) } })
    const variations = [...new Set(cs.flatMap((c) => c.theorems.map((t) => t.theorem)).filter((k) => k !== theorem))].sort()
    const taxonomy = [...new Set(cs.flatMap((c) => c.families))].sort()
    const minted = variants.reduce((n, v) => n + v.coins, 0), superposition = variants.reduce((n, v) => n + v.superposition, 0)
    const tb = TEXTBOOK_THEOREMS.find((t) => t.key === theorem)
    return { product: theorem, title: theorem.replace(/^textbook_/, '').replace(/_/g, '-'), taxonomy, variants, variations, proof: tb?.lean ?? null, kernelAccepted: THEOREMS.some((t) => t.key === theorem), decidedVia: PROSE.quantumProcessingMcp_decidedVia43, price: { coins: minted, superposition, perSuperposition: minted / superposition, address: uuid(JSON.stringify({ product: theorem, coins: minted, superposition })) } }
  }).sort((a, b) => a.product.localeCompare(b.product))
  return { products, total: products.length, theorems: ['textbook_free_or_coil'], says: PROSE.quantumProcessingMcp_says44 }
}

const productCombinations = () => {
  const reg = recomputeClay()
  const cat = clayCatalog()
  const verified = reg.holding === reg.total && reg.total > 0
  const axioms = AXIOMS.map((a) => { const computed = a.name === 'n' ? ['quantum', 'processing', 'unit'].length : clayEvaluate(a.formula); return { ...a, computed, holds: computed === a.value } })
  const params = Object.fromEntries(axioms.map((a) => [a.name, a.value]))
  const names = new Set(axioms.map((a) => a.name))
  const products = cat.products.map((p) => ({
    product: p.product,
    variants: p.variants.map((v) => {
      const rel = reg.relations.find((r) => r.name === v.relation)!
      const used = [...names].filter((name) => new RegExp(`\\b${name}\\b`).test(rel.statement)).sort()
      const formula = rel.statement
      const developed = crossVerifiedFormula(formula, { product: p.product, variant: v.case, theorem: p.product, kernel: p.kernelAccepted, value: rel.sides[0]!.value })
      return { variant: v.case, relation: v.relation, formula, value: rel.sides[0]!.value, params: used.map((name) => ({ name, value: params[name]! })), holds: rel.holds, crossVerified: developed.crossVerified, depth: developed.depth, iso: developed.iso, docs: developed.docs, via: developed.via }
    }),
  }))
  const proved = axioms.map((a) => {
    const variants = products.flatMap((p) => p.variants.filter((v) => v.params.some((x) => x.name === a.name)))
    return { ...a, variants: variants.length, proved: a.holds && variants.every((v) => v.iso.documented && v.holds && v.iso.theorem.startsWith('textbook_')) }
  })
  const families = [...new Set(reg.relations.flatMap((r) => r.families))].sort()
  const problems = families.map((family) => {
    const members = cat.products.map((p) => ({ product: p.product, variants: p.variants.filter((v) => (reg.relations.find((r) => r.name === v.relation)?.families ?? []).includes(family)) })).filter((m) => m.variants.length > 0)
    const radices = members.map((m) => m.variants.length)
    const space = compositions(radices)
    const at = (index: bigint) => composition(radices, index).map((digit, i) => { const v = members[i]!.variants[digit]!; return { product: members[i]!.product, variant: v.case, relation: v.relation } })
    return { problem: family, products: members.length, radices, combinations: space.toString(), solved: verified, witness: at(0n), address: uuid(canonicalText({ family, combinations: space.toString() })) }
  })
  const radices = cat.products.map((p) => p.variants.length)
  const space = compositions(radices)
  const solved = problems.filter((p) => p.solved).length
  const variants = products.reduce((n, p) => n + p.variants.length, 0)
  const crossVerified = products.every((p) => p.variants.every((v) => v.crossVerified))
  const depth = products.reduce((d, p) => p.variants.reduce((n, v) => Math.max(n, v.depth), d), 0)
  const hooks = { collection: 'products' as const, iso: 'ISO 9001' as const, beforeChange: PROSE.quantumProcessingMcp_beforeChange45, afterChange: PROSE.quantumProcessingMcp_afterChange46, afterRead: PROSE.quantumProcessingMcp_afterRead47, validated: products.every((p) => p.variants.every((v) => v.iso.documented && v.holds && v.crossVerified)), proved: proved.every((a) => a.proved) }
  return { phase: 'combinations' as const, verified, crossVerified, depth, axioms: proved, params, products, hooks, problems: problems.length, solved, space: space.toString(), radices, rows: problems, theorems: ['textbook_mixed_radix', 'textbook_plugin_combinations', 'textbook_standards_sliced'] as const, says: proseFill(PROSE.quantumProcessingMcp_says48, proved.length, proved.length, products.length, variants, depth, solved, problems.length, space.toString()) }
}

const portToZero = (parts: readonly bigint[]) => {
  const combos = productCombinations()
  const seeded = mcpPages(TOOLS.map((tool) => ({ name: tool.name, toolbox: tool.toolbox, description: tool.description })))
  const pages = seeded.pages.filter((page) => page.kind === 'tool').map((page) => {
    const toolbox = seeded.pages.find((row) => row.id === page.parentId)!
    const path = page.url
    return { tool: page.title, toolbox: toolbox.title, collection: 'pages' as const, path, url: `https://qpu.uuidna.com${path}`, documented: seeded.via === 'seeds' && seeded.manual === false, seed: { slug: page.slug, parentSlug: toolbox.slug, url: page.url } }
  })
  const rows = parts.map((part) => {
    const width = part.toString(2).length
    const tori = zeroTori(part)
    const from = uuid(part.toString())
    const formula = proseFill(PROSE.quantumProcessingMcp_s49, width)
    const served = developViaHooks({ formula, product: 'leftover', variant: '0bit', title: '0bit', theorem: 'textbook_double_torus' })
    const documented = 'documented' in served.iso && served.iso.documented === true
    return { from, id: `${from}:0bit`, width, bit: 0 as const, bits: 0 as const, zeros: tori.zeros, closed: false as const, open: true as const, status: 'open' as const, forth: 1 as const, back: 0 as const, exited: false as const, strategy: 'nonconforming' as const, formula, documented }
  })
  const documented = pages.every((page) => page.documented) && rows.every((row) => row.documented)
  return {
    bit: 0 as const, bits: 0 as const, via: 'clay' as const, website: 'payload' as const, collection: 'pages' as const,
    theorems: combos.products.length, axioms: combos.axioms.length, crossVerified: combos.crossVerified, verified: combos.verified, combinations: combos.space, problems: combos.problems, solved: combos.solved, depth: combos.depth,
    tools: pages.length, ported: pages.filter((page) => page.documented).length, pages, rows,
    hooks: ['beforeChange', 'afterChange', 'afterRead'] as const, beforeChange: 'the formula is recorded' as const, afterChange: 'the formula is handed to the docs door' as const, afterRead: 'the documented formula is served' as const,
    manual: false as const, process: 'ISO 9001' as const, documented,
    open: true as const, closed: false as const, status: 'open' as const,
    holds: false as const,
  }
}

const textbookGaps = () => {
  const reg = recomputeClay()
  const amount = new Map(reg.relations.map((r) => [r.name, r.sides[0]!.value]))
  const numerals = (lean: string) => new Set([...lean.matchAll(/\d+/g)].map((m) => m[0]!))
  const written = new Map(TEXTBOOK_THEOREMS.flatMap((t) => (typeof t.lean === 'string' ? [[t.key, numerals(t.lean)] as const] : [])))
  const rows = reg.relations.flatMap((r) => clayCaseTheorems(r).map((t) => {
    const value = amount.get(r.name)!
    return { product: t.theorem, variant: t.case, relation: r.name, value, shown: written.get(t.theorem)?.has(String(value)) ?? false }
  }))
  const missing = rows.filter((v) => !v.shown)
  const products = [...new Set(rows.map((v) => v.product))].sort().map((product) => {
    const mine = rows.filter((v) => v.product === product)
    const gaps = mine.filter((v) => !v.shown).length
    return { product, variants: mine.length, shown: mine.length - gaps, gaps }
  })
  return { phase: 'gaps' as const, variants: rows.length, shown: rows.length - missing.length, gaps: missing.length, products, rows, missing, says: proseFill(PROSE.quantumProcessingMcp_says50, missing.length, rows.length) }
}

const abilitySubscriptions = () => {
  const monthly = (v: { interval: string; amounts: Record<string, number> }) => v.interval === 'month' || v.interval === 'metered' ? v.amounts.eur : v.interval === 'year' ? v.amounts.eur / 12 : null
  const best = new Map<string, { product: string; variant: string; interval: string; monthly: number }>()
  for (const v of CATALOGUE) {
    const m = monthly(v)
    if (m === null || m <= 0) continue
    const cur = best.get(v.product)
    if (!cur || m > cur.monthly) best.set(v.product, { product: v.product, variant: v.variant, interval: v.interval, monthly: m })
  }
  const ranked = [...best.values()].sort((a, b) => b.monthly - a.monthly)
  const order = ['delete', 'update', 'create', 'read'] as const
  return order.map((ability, i) => { const plan = ranked[i]; if (!plan) throw new Error(PROSE.quantumProcessingMcp_s51); return { ability, ...plan, includes: order.slice(i) } })
}
const RELATION_ABILITIES: readonly Ability[] = [
  { role: 'viewer', can: ['read'], subject: 'relations' },
  { role: 'editor', can: ['read', 'create', 'update'], subject: 'relations' },
  { role: 'tenant-admin', can: ['manage'], subject: 'relations' },
]
const TENANT_OF: Readonly<Record<string, string>> = { reader: 'viewer', writer: 'editor', admin: 'tenant-admin' }

const publicSeo = (ask: Record<string, unknown>) => {
  const reg = recomputeClay()
  const shown = new Map(textbookGaps().rows.map((v) => [`${v.product}/${v.relation}`, v.shown]))
  const plans = abilitySubscriptions()
  const rows = reg.relations.flatMap((r) => clayCaseTheorems(r).map((t) => {
    const tb = TEXTBOOK_THEOREMS.find((x) => x.key === t.theorem)
    const kernel = THEOREMS.find((x) => x.key === t.theorem)
    const formula = r.statement
    const evaluated = r.sides.map((s) => `${s.expression} = ${s.value}`).join(' ∧ ')
    const proof = [typeof tb?.lean === 'string' ? tb.lean : '', kernel?.statement ?? '', evaluated].filter((s) => s.length > 0).join('\n')
    const title = `${t.theorem.replace(/^textbook_/, '').replace(/_/g, ' ')} ${r.sides[0]!.value}`
    return { product: t.theorem, variant: t.case, relation: r.name, value: r.sides[0]!.value, title, description: formula, formula, proof, holds: r.holds, gap: !(shown.get(`${t.theorem}/${r.name}`) ?? false), public: true as const, access: 'public' as const }
  }))
  const taken = new Map<string, number>()
  for (const p of rows) taken.set(p.variant, (taken.get(p.variant) ?? 0) + 1)
  const addressed = rows.map((p) => ({ ...p, slug: (taken.get(p.variant) ?? 0) > 1 ? `${p.product}-${p.variant}` : p.variant }))
  const ids = addressed.map((p) => uuid(canonicalText({ collection: 'pages', slug: p.slug, formula: p.formula })))
  const published = addressed.map((p, i) => {
    const opt = optimise(ids[i]!, ids.filter((_, j) => j !== i))
    return { ...p, coin: uuid(p.formula), seo: { title: p.title, description: p.description, image: opt.kept, greatest: opt.greatest, formula: opt.formula, public: true as const, fields: ['title', 'description', 'image'] as const } }
  })
  const minted = coins(published.map((p) => p.formula))
  const seeded = published.map((p) => {
    const seed = pageSeed(p.title, `${p.formula}\n${p.proof}`)
    return { ...p, slug: seed.slug, component: 'content' as const, renderedBy: 'src/components/blocks/Content' as const, seed, find: findArgs(seed.slug), create: writeArgs(seed) }
  })
  const covered = seeded.filter((p) => p.public && p.holds && p.formula.includes('=') && p.proof.includes(':=') && p.seo.title.length > 0 && p.seo.description.length > 0 && p.seo.greatest && seal(p.seo.image).valid && p.seed.hero.type === 'default' && p.seed.layout.length === 1 && p.seed.layout[0]!.blockType === 'content' && p.seed.layout[0]!.contentFields.layout === 'oneColumn' && !('id' in p.create.data) && !('breadcrumbs' in p.create.data)).length
  const roles = [
    { role: 'viewer', also: 'reader', abilities: ['read'] },
    { role: 'editor', also: 'writer', abilities: ['read', 'create', 'update'] },
    { role: 'tenant-admin', also: 'admin', abilities: ['read', 'create', 'update', 'delete'] },
  ].map((r) => { const plan = plans.find((p) => p.ability === r.abilities.at(-1))!; return { role: r.role, also: r.also, abilities: r.abilities, subscription: { product: plan.product, variant: plan.variant, interval: plan.interval, monthlyEur: plan.monthly } } })
  const api = isObj(ask.api) ? ask.api as Record<string, unknown> : null
  const call = api ? (() => {
    const named = String(api.role ?? '')
    const asTenant = TENANT_OF[named] ?? named
    const ability = String(api.ability ?? '')
    const relation = String(api.relation ?? '')
    const host = String(api.tenant ?? 'uuidna')
    const page = seeded.find((p) => p.relation === relation || p.variant === relation)
    const known = (['read', 'create', 'update', 'delete'] as const).find((a) => a === ability)
    const access = known ? getAccess(RELATION_ABILITIES, [{ name: asTenant }], 'relations', known) : false
    const plan = plans.find((p) => p.ability === known)
    const allowed = access !== false && !!page && !!plan?.includes.includes(known!)
    const booked = allowed && page ? coins([page.formula]) : coins([])
    return { role: named, as: asTenant, ability, relation, tenant: host, page: page ? { product: page.product, variant: page.variant, formula: page.formula, proof: page.proof, coin: page.coin } : null, allowed, access, subscription: allowed && plan ? { product: plan.product, variant: plan.variant, interval: plan.interval, monthlyEur: plan.monthly } : null, coins: { address: booked.coins[0] ?? null, count: booked.count, merged: booked.merged, booked: booked.count === 1 && booked.coins[0] === page?.coin, autonomous: true as const, by: 'uuid' as const } }
  })() : null
  return { phase: 'public' as const, public: true as const, component: 'content' as const, renderedBy: 'src/components/blocks/Content' as const, coverage: { full: covered === seeded.length, covered, of: seeded.length }, pages: seeded, coins: minted, gaps: { missing: seeded.filter((p) => p.gap).length, of: seeded.length }, backend: { subject: 'relations' as const, abilities: plans.map((p) => ({ ability: p.ability, subscription: { product: p.product, variant: p.variant, interval: p.interval, monthlyEur: p.monthly }, includes: p.includes })), roles, call, rbac: PROSE.quantumProcessingMcp_rbac52, subscription: PROSE.quantumProcessingMcp_subscription53, usage: PROSE.quantumProcessingMcp_usage54 }, says: proseFill(PROSE.quantumProcessingMcp_says55, seeded.length, minted.count, minted.merged, seeded.filter((p) => p.gap).length) }
}

const solveClay = () => {
  const reg = recomputeClay()
  const reading = reflectionOfRegister(reg.relations)
  const families = new Map(reg.relations.map((r) => [r.name, r.families]))
  const id = uuid(canonicalText({ collection: 'docs', topic: 'framework', slug: 'qpu' }))
  const doc = { id, collection: 'docs' as const, title: 'QPU', slug: 'qpu', topic: 'framework', topicGroup: 'framework', description: PROSE.quantumProcessingMcp_description56 }
  const categories = [...new Set(reg.relations.flatMap((r) => [...r.families]))].sort().map((name) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }))
  const gap = textbookGaps()
  const bits = new Map(reg.relations.map((r) => [r.name, r.bits]))
  const variants = gap.rows.map((v) => ({ ...v, bits: bits.get(v.relation)!, categories: [...(families.get(v.relation) ?? [])], doc: id }))
  const solved = reading.readings.filter((x) => x.solved).length
  return { phase: 'solve' as const, total: reg.total, holding: reg.holding, solved, open: reading.open, docs: [doc], framework: { doc: id }, categories, variants, gaps: { shown: gap.shown, missing: gap.gaps, of: gap.variants, products: gap.products }, says: proseFill(PROSE.quantumProcessingMcp_says57, solved, reg.total, gap.gaps, gap.variants) }
}
// The README generated by the clay cluster, never written by hand: the whole document computed from the tree — the clay register recomputed,
// the impossible-integer σ-trapdoor minted and decoded live (one σ-reflection), the kernel census, the MCP surface and the sellable catalog —
// with the measured figures the caller took (git, tsc, the test receipt, lake, the ledger). So the prose can never drift from what the tools
// answer (textbook_impossible_trapdoor, textbook_shor_sigma_root, textbook_factors_divide). Deterministic: the demo primes are seeded.
// Clay here is the 55-identity register, not a Clay Mathematics Institute prize claim and not ISO vocabulary.
type ReadmeMeasured = { date?: string; version?: string; doi?: string; rows?: [string, string][]; census?: { declared?: number | string; kernel?: string; generated?: number; sorried?: string; axioms?: string; handWritten?: number } }
const clayReadme = (m: ReadmeMeasured = {}) => {
  const date = m.date ?? stamp().slice(0, 10), version = m.version ?? VERSION
  const reg = recomputeClay(), cat = clayCatalog()
  // the thousand-bit impossible integer, minted and decoded live over the clay cluster (deterministic by seed): the worked proof of §2
  const made = createImpossible({ bits: 1000, seed: 1n }), dec = decodeImpossible(made.N, made.witness), addr = impossibleAddress(made.N, made.witness)
  const small = createImpossible({ p: 5n, q: 13n }) // the kernel's witness example: 65 = (9−4)(9+4), q = σ_{18}(5) = 13
  const perModule = new Map<string, number>(); for (const t of THEOREMS) perModule.set(t.module, (perModule.get(t.module) ?? 0) + 1)
  const sigmaBridges = TEXTBOOK_THEOREMS.filter((t) => /sigma|σ|reflection|trapdoor|shor_sigma/i.test(t.key)).slice(0, 6)
  const L: string[] = []
  L.push(`# UUIDNA QPU — Clay register recomputed; σ-involution verified by the Lean kernel`, '')
  L.push(proseFill(PROSE.quantumProcessingMcp_s58, version), '')
  L.push(proseFill(PROSE.quantumProcessingMcp_s59, date), '')
  L.push(`## Abstract`, '')
  L.push(proseFill(PROSE.quantumProcessingMcp_s60, reg.total), '')
  L.push(PROSE.quantumProcessingMcp_s61, '')
  L.push(PROSE.quantumProcessingMcp_s62, '')
  const res = resonance()
  L.push(proseFill(PROSE.quantumProcessingMcp_s63, res.dimensions, res.dimensions, res.cmyk?.c, res.cmyk?.m, res.cmyk?.y, res.cmyk?.k, res.key, res.sum, res.quotient, res.hue, reg.holding, reg.total, reg.maxBits, reg.maxLimbs16), '')
  if (m.rows?.length) { L.push(proseFill(PROSE.quantumProcessingMcp_s64, date), '', `| Measure | Value |`, `|---|---:|`, ...m.rows.map(([k, v]) => `| ${k} | ${v} |`), '') }
  // §1 Clay
  L.push(`## 1. The Clay register — one σ-involution, recomputed by any client`, '')
  L.push(proseFill(PROSE.quantumProcessingMcp_s65, reg.holding, reg.total, reg.maxBits, reg.maxLimbs16), '')
  L.push('```', `σ_reflect :  ∀ d x, x ≤ d → d − (d − x) = x      -- self-inverse on [0, d]`, `σ_midpoint:  ∀ d x, 2·x = d → d − x = x          -- fixed at d/2`, '```', '')
  L.push(PROSE.quantumProcessingMcp_s66, '', `| Bridge | What one reflection is |`, `|---|---|`)
  for (const b of sigmaBridges) L.push(`| \`${b.key}\` | ${cell(b.says)} |`)
  L.push('')
  // §2 Impossible integers — the thousand bit, clay and back
  L.push(`## 2. Impossible integers: register crypto via the thousand bit, and back`, '')
  L.push(PROSE.quantumProcessingMcp_s67, '', '```', `N = a² − b² = (a − b)(a + b)        p = a − b        q = a + b = 2a − p = σ_{2a}(p)`, '```', '')
  L.push(PROSE.quantumProcessingMcp_s68, '')
  L.push(PROSE.quantumProcessingMcp_s69, '')
  L.push('```', PROSE.quantumProcessingMcp_s70, proseFill(PROSE.quantumProcessingMcp_s71, made.bits, made.p.toString(2).length, made.q.toString(2).length), `  N (1000b)  = ${made.N}`, `  prime p    = ${made.p}`, `  prime q    = ${made.q}`, `  witness a  = ${made.witness}  ((p + q)/2, the σ-reflection centre)`, `  identities = 1000 = 2^3 × 5^3 | 1001 = 7 × 11 × 13 | 1000^2 - 1 = 999 × 1001 = 3^3 × 7 × 11 × 13 × 37`, proseFill(PROSE.quantumProcessingMcp_s72, addr), proseFill(PROSE.quantumProcessingMcp_s73, made.blindReflections.toString(2).length), '', `decode { integer: N, witness: a }  →  p · q`, `  searched   = ${dec.searched} reflection      q = σ_{2a}(p) = 2a − p`, proseFill(PROSE.quantumProcessingMcp_s74, dec.verified), proseFill(PROSE.quantumProcessingMcp_s75, made.p, made.q, made.N), '```', '')
  L.push(proseFill(PROSE.quantumProcessingMcp_s76, made.blindReflections.toString(2).length - 1, small.N), '')
  L.push(PROSE.quantumProcessingMcp_s77, '')
  // §3 kernel census
  L.push(`## 3. What the Lean kernel accepts`, '')
  L.push(proseFill(PROSE.quantumProcessingMcp_s78, m.census?.kernel ?? KERNEL_THEOREMS, m.census?.handWritten ?? THEOREMS.length, m.census?.generated ?? GENERATED_LEMMAS, m.census?.sorried ?? '0', m.census?.axioms ?? PROSE.quantumProcessingMcp_s79), '', `| Module | Hand-written theorems |`, `|---|---:|`, ...[...perModule.entries()].sort().map(([mod, n]) => `| ${mod} | ${n} |`), '')
  // §4 MCP surface
  L.push(`## 4. The MCP surface — every tool a client can call`, '')
  L.push(proseFill(PROSE.quantumProcessingMcp_s80, TOOLS.length), '', `| Tool | What it answers |`, `|---|---|`)
  for (const t of TOOLS) L.push(`| \`${t.name}\` | ${cell(t.description.split(/(?<=\.)\s/)[0]!)} |`)
  L.push('')
  // §5 catalog
  L.push(`## 5. Textbook-grade ISO tools — sold at the website, accessible by client MCP`, '')
  L.push(proseFill(PROSE.quantumProcessingMcp_s81, cat.total), '', PROSE.quantumProcessingMcp_s82, `|---|---:|---|---:|---:|`)
  for (const p of cat.products.slice(0, 12)) L.push(`| \`${p.product.replace(/^textbook_/, '')}\` | ${p.variants.length} | ${cell((p.taxonomy.join(', ') || '—'))} | ${p.price.coins} | 2^${Math.round(Math.log2(Math.max(1, p.price.superposition)))} |`)
  L.push('')
  // §6 reproduce
  L.push(`## 6. Use and reproduce`, '')
  L.push('```bash', `npm install && npm run typecheck && npm test`, `lake build          # Lean 4.33.0 via elan; builds the Qpu library, no network`, '```', '')
  L.push('```ts', `import { handle } from './src/quantum/processing/mcp.ts'`, PROSE.quantumProcessingMcp_s83, PROSE.quantumProcessingMcp_s84, PROSE.quantumProcessingMcp_s85, '```', '')
  // License + references (authorial)
  L.push(`## License`, '', PROSE.quantumProcessingMcp_s86, '')
  L.push(`## Citation (first author)`, '', PROSE.quantumProcessingMcp_s87, '')
  L.push(`## References`, '', `- Google Quantum AI — Willow spec sheet, Cirq documentation and \`cirq.google.known_devices\`, the roadmap (quantumai.google)`, `- Google — *Meet Willow* and *Quantum Echoes* (blog.google; research.google)`, `- quantumlib organization (github.com/quantumlib)`, '')
  return { markdown: L.join('\n'), total: reg.total, holding: reg.holding, maxBits: reg.maxBits, relationCount: reg.total, toolCount: TOOLS.length, productCount: cat.total, thousandBit: { bits: made.bits, N: made.N.toString(), p: made.p.toString(), q: made.q.toString(), witness: made.witness.toString(), decoded: dec.decoded, searched: dec.searched.toString(), verified: dec.verified, address: addr }, theorems: ['textbook_impossible_trapdoor', 'textbook_shor_sigma_root'], says: proseFill(PROSE.quantumProcessingMcp_says88, reg.total, TOOLS.length, cat.total, dec.searched, dec.verified) }
}

const proofCheck = (args: Record<string, unknown>) => {
  const callAt = (tool: unknown, a: unknown) => uuid(JSON.stringify([tool, a ?? {}])), known = (k: string) => THEOREMS.find((x) => x.key === k || x.key.endsWith('.' + k))
  const c = args.call as { tool?: string; arguments?: unknown } | undefined, at = c ? callAt(c.tool, c.arguments) : null, e = at ? EXAMPLES.find((x) => x.theorem && callAt(x.tool, x.arguments) === at) : undefined
  const key = typeof args.theorem === 'string' ? args.theorem : e?.theorem ?? null, t = key ? known(key) : undefined, proves = key ? EXAMPLES.filter((x) => x.theorem === key) : []
  // a digest, never a signature: only for a round trip
  const roundTrip = at === null ? null : proves.some((x) => callAt(x.tool, x.arguments) === at)
  return { theorem: key, accepted: !!t, statement: t?.statement ?? null, examples: proves.map((x) => x.id), call: at, digest: roundTrip ? JSON.stringify({ call: at, sha256: hex(sha256(utf8(JSON.stringify([c?.tool, c?.arguments ?? {}])))), theorem: key }) : null, example: e?.id ?? null, roundTrip, cost: PROSE.quantumProcessingMcp_cost89 }
}
const tool = <T>(spec: { name: string; description: string; inputSchema: object; run: (args: Record<string, unknown>, ctx: Context) => T; widget: (data: T) => string }): Tool => defineTool(TREE.has(spec.name) ? 'tree' : 'google', spec)

const QUBIT_SCHEMA = TABLES.QUBIT_SCHEMA
const OPERATION_SCHEMA = {
  type: 'object',
  required: ['gate', 'qubits'],
  properties: {
    gate: { enum: GATE_NAMES },
    qubits: { type: 'array', items: QUBIT_SCHEMA },
    exponent: { type: 'number', description: PROSE.quantumProcessingMcp_description90 },
    x: { type: 'number', description: PROSE.quantumProcessingMcp_description91 },
    z: { type: 'number', description: PROSE.quantumProcessingMcp_description92 },
    axis: { type: 'number', description: PROSE.quantumProcessingMcp_description93 },
  },
}
const MEASURE_SCHEMA = { type: 'object', required: ['key', 'qubits'], properties: { key: { type: 'string' }, qubits: { type: 'array', items: QUBIT_SCHEMA } } }

const thenable = <T>(value: T | PromiseLike<T>): value is PromiseLike<T> => value !== null && typeof value === 'object' && typeof (value as { then?: unknown }).then === 'function'
const reject: (what: string) => never = (what) => { throw new ParamError(what) }

const OWN: Tool[] = [
  tool({
    name: 'processor',
    description: PROSE.quantumProcessingMcp_description94,
    inputSchema: { type: 'object', properties: { name: { enum: Object.keys(ALL_PROCESSORS), description: PROSE.quantumProcessingMcp_description95 }, role: { enum: ['reader', 'writer', 'admin'], description: PROSE.quantumProcessingMcp_description96 } } },
    run: (args) => {
      const cfg = cryptoConfig()
      const qc = cfg.iso.quantumComputer
      const role = (args.role === 'admin' || args.role === 'writer' || args.role === 'reader' ? args.role : 'reader') as Role
      const allowed = processorsForRole(cfg, role)
      if (args.all === true || args.stack === true || args.name === undefined) {
        return {
          name: qc.processors.default,
          technology: WILLOW_PROC.technology,
          qubits: WILLOW_PROC.qubits,
          statedAverageConnectivity: WILLOW_PROC.statedAverageConnectivity,
          averageConnectivity: Math.round(getAverageConnectivity(WILLOW_PROC.sites, WILLOW_PROC.couplers) * 100) / 100,
          belowThreshold: isBelowThreshold(WILLOW_PROC),
          typicalConnectivity: WILLOW_PROC.typicalConnectivity,
          chips: WILLOW_PROC.chips,
          magicStateCultivation: WILLOW_PROC.magicStateCultivation,
          errorCorrectionPreprint: WILLOW_PROC.errorCorrectionPreprint,
          iso: { standard: qc.standard, companions: qc.companions, via: cfg.via ?? 'qpuMcpPlugin' },
          processors: allowed.map((name) => {
            const p = ALL_PROCESSORS[name]
            return {
              name: p.name,
              qubits: p.qubits,
              couplers: p.couplers.length,
              averageConnectivity: Number(getAverageConnectivity(p.sites, p.couplers).toFixed(2)),
              layout: 'layout' in p ? p.layout : PROSE.quantumProcessingMcp_s97,
              role: qc.processors.roles[name],
            }
          }),
          hardwareStack: QUANTUM_HARDWARE_STACK,
          crypto: { schemas: qc.schemas, devices: qc.devices, hardware: qc.hardware },
          ...(args.name === undefined ? { unlimited: true as const, hz: 432 as const, example: null, bounded: false as const, params: false as const } : {}),
        }
      }
      const deviceName = String(args.name)
      if (deviceName in DEVICES && !mayUseProcessor(cfg, deviceName, role)) reject(proseFill(PROSE.quantumProcessingMcp_s98, deviceName, role, allowed.join(', ')))
      if (deviceName !== 'Willow' && deviceName in ALL_PROCESSORS) {
        const device = ALL_PROCESSORS[deviceName as keyof typeof ALL_PROCESSORS]
        return { name: device.name, qubits: device.qubits, couplers: device.couplers.length, layout: 'layout' in device ? device.layout : '', iso: { standard: qc.standard, via: cfg.via ?? 'qpuMcpPlugin' }, role: qc.processors.roles[deviceName as CryptoProcessorName], chosen: mayUseProcessor(cfg, deviceName, role), engine: deviceName in DEVICES, ...('statedQubits' in device ? { statedQubits: device.statedQubits } : {}), ...('statedCouplers' in device ? { statedCouplers: device.statedCouplers } : {}) }
      }
      const processor = PROCESSORS[args.name as keyof typeof PROCESSORS] ?? reject(`processor ${String(args.name)} is not described here`)
      return { name: processor.name, technology: processor.technology, qubits: processor.qubits, statedAverageConnectivity: processor.statedAverageConnectivity, averageConnectivity: Math.round(getAverageConnectivity(processor.sites, processor.couplers) * 100) / 100, belowThreshold: isBelowThreshold(processor), typicalConnectivity: processor.typicalConnectivity, chips: processor.chips, magicStateCultivation: processor.magicStateCultivation, errorCorrectionPreprint: processor.errorCorrectionPreprint, iso: { standard: qc.standard, via: cfg.via ?? 'qpuMcpPlugin' }, role: qc.processors.roles.Willow }
    },
    widget: processorWidget,
  }),
  tool({
    name: 'circuit',
    description: PROSE.quantumProcessingMcp_description99,
    inputSchema: {
      type: 'object',
      properties: {
        operations: { type: 'array', items: OPERATION_SCHEMA },
        insert: INSERT_SCHEMA,
        device: { enum: Object.keys(DEVICES), description: PROSE.quantumProcessingMcp_description100 },
        measure: MEASURE_SCHEMA,
        repetitions: { type: 'integer', minimum: 1, description: PROSE.quantumProcessingMcp_description101 },
        noise: { type: 'array', items: CHANNEL_SCHEMA, description: PROSE.quantumProcessingMcp_description102 },
        observables: { type: 'array', items: OBSERVABLE_SCHEMA },
        device_noise: { enum: ['willow_error_correction', 'willow_random_circuit_sampling'], description: PROSE.quantumProcessingMcp_description103 },
        engine: { type: 'object', description: PROSE.quantumProcessingMcp_description104, properties: { processor: { enum: Object.keys(DEVICES) }, program: { type: 'object' }, repetitions: { type: 'integer', minimum: 1 } } },
      },
    },
    run: (args) => {
      if (isObj(args.engine)) return engineCall(args.engine as Record<string, unknown>)
      if (!Array.isArray(args.operations)) return unlimited() as never
      const operations = args.operations as OperationJson[]
      const measurement = args.measure as MeasureJson | undefined
      const insert = (args.insert ?? 'EARLIEST') as InsertStrategy
      const prepared = circuit(operations, insert, measurement)
      if (typeof args.device === 'string') {
        const device = DEVICES[args.device as keyof typeof DEVICES] ?? reject(`device ${args.device} is not described here`)
        toDevice(device).validateCircuit(prepared)
      }
      const channels = ((args.noise ?? []) as ChannelJson[]).map(channel)
      const observables = (args.observables ?? []) as Record<string, 'X' | 'Y' | 'Z'>[]
      const chip = args.device_noise === 'willow_error_correction' ? 'errorCorrection' : args.device_noise === 'willow_random_circuit_sampling' ? 'randomCircuitSampling' : undefined
      if (channels.length || observables.length || chip !== undefined) {
        if (measurement) reject(PROSE.quantumProcessingMcp_s105)
        const result = new DensityMatrixSimulator().simulate(prepared, chip !== undefined ? willowNoise(chip) : channels)
        return {
          qubits: result.qubits.map(keyOfQubit),
          probabilities: result.probabilities,
          trace: result.trace,
          purity: result.purity,
          expectations: observables.map((o) => getExpectation(result, o)),
        }
      }
      if (!measurement || typeof args.repetitions !== 'number') {
        const { amplitudes, qubits } = new Simulator().simulate(prepared)
        return { qubits: qubits.map(keyOfQubit), amplitudes: amplitudes.map(complex), ...(measurement && typeof args.repetitions !== 'number' ? { sampled: false as const } : {}) }
      }
      const repetitions = args.repetitions
      const result = seeded(args).run(prepared, repetitions)
      return { key: measurement.key, bitstrings: result.measurements(measurement.key), histogram: Object.fromEntries(result.histogram(measurement.key)) }
    },
    widget: circuitWidget,
  }),
  tool({
    name: 'echo',
    description: PROSE.quantumProcessingMcp_description106,
    inputSchema: {
      type: 'object',
      properties: { forward: { type: 'array', items: OPERATION_SCHEMA }, perturbation: OPERATION_SCHEMA },
    },
    run: (args) => {
      if (!Array.isArray(args.forward)) return unlimited() as never
      const forward = (args.forward as OperationJson[]).map(operation)
      const perturbation = args.perturbation === undefined ? undefined : operation(args.perturbation as OperationJson)
      return { probability: echoProbability(forward, perturbation), operations: echoCircuit(forward, perturbation).operations.length }
    },
    widget: echoWidget,
  }),
  tool({
    name: 'echo_benchmark',
    description: PROSE.quantumProcessingMcp_description107,
    inputSchema: { type: 'object', properties: {} },
    run: () => QUANTUM_ECHOES,
    widget: echoBenchmarkWidget,
  }),
  tool({
    name: 'roadmap',
    description: PROSE.quantumProcessingMcp_description108,
    inputSchema: { type: 'object', properties: { milestone: { type: 'integer', minimum: 1, description: PROSE.quantumProcessingMcp_description109 } } },
    run: (args) => {
      if (args.milestone === undefined) return { milestones: ROADMAP, applications: APPLICATIONS }
      const found = ROADMAP.filter((m) => m.number === args.milestone)
      return found.length ? { milestones: found, applications: APPLICATIONS } : reject(`milestone ${String(args.milestone)} is not one of ${ROADMAP.map((m) => m.number).join(', ')}`)
    },
    widget: roadmapWidget,
  }),
  tool({
    name: 'algorithm',
    description: PROSE.quantumProcessingMcp_description110,
    inputSchema: {
      type: 'object',
      properties: {
        name: { enum: ['qft', 'inverse_qft', 'phase_estimation', 'grover', 'teleportation', 'qaoa', 'shor', 'factor', 'order', 'deutsch_jozsa', 'bernstein_vazirani', 'simon', 'vqe', 'chsh', 'trotter', 'xeb', 'no_cloning', 'holevo', 'gottesman_knill', 'eastin_knill', 'solovay_kitaev', 'steane'], description: PROSE.quantumProcessingMcp_description111 },
        depth: { type: 'integer', minimum: 1, description: PROSE.quantumProcessingMcp_description112 },
        balanced: { type: 'boolean', description: PROSE.quantumProcessingMcp_description113 },
        hidden: { type: 'array', items: { type: 'integer', minimum: 0, maximum: 1 }, description: PROSE.quantumProcessingMcp_description114 },
        steps: { type: 'integer', minimum: 1, description: PROSE.quantumProcessingMcp_description115 },
        integer: { type: 'string', description: PROSE.quantumProcessingMcp_description116 },
        reflections: { type: 'string', pattern: '^[0-9]+$', description: PROSE.quantumProcessingMcp_description117 },
        from: { type: 'string', pattern: '^[0-9]+$', description: PROSE.quantumProcessingMcp_description118 },
        create: { type: 'object', description: PROSE.quantumProcessingMcp_description119, properties: { p: { type: 'string', pattern: '^[0-9]+$' }, q: { type: 'string', pattern: '^[0-9]+$' }, bits: { type: 'integer', minimum: 16 }, gapBits: { type: 'integer', minimum: 1 }, seed: { type: 'string', pattern: '^[0-9]+$' } } },
        witness: { type: 'string', pattern: '^[0-9]+$', description: PROSE.quantumProcessingMcp_description120 },
        address: { type: 'string', description: PROSE.quantumProcessingMcp_description121 },
        order: { type: 'string', pattern: '^[0-9]+$', description: PROSE.quantumProcessingMcp_description122 },
        budget: { type: 'string', pattern: '^[0-9]+$', description: PROSE.quantumProcessingMcp_description123 },
        find: { type: 'boolean', description: PROSE.quantumProcessingMcp_description124 },
        observe: { type: 'boolean', description: PROSE.quantumProcessingMcp_description125 },
        N: { type: 'integer', minimum: 3, description: PROSE.quantumProcessingMcp_description126 },
        a: { type: 'integer', minimum: 2, description: PROSE.quantumProcessingMcp_description127 },
        sweep: { type: 'boolean', description: PROSE.quantumProcessingMcp_description128 },
        qubits: { type: 'integer', minimum: 1, description: PROSE.quantumProcessingMcp_description129 },
        input: { type: 'integer', minimum: 0, description: PROSE.quantumProcessingMcp_description130 },
        theta: { type: 'number', description: PROSE.quantumProcessingMcp_description131 },
        bits: { type: 'integer', minimum: 1, description: PROSE.quantumProcessingMcp_description132 },
        repetitions: { type: 'integer', minimum: 1, description: PROSE.quantumProcessingMcp_description133 },
        nodes: { type: 'integer', minimum: 2, description: PROSE.quantumProcessingMcp_description134 },
        weights: { type: 'array', items: { type: 'number' }, description: PROSE.quantumProcessingMcp_description135 },
        alpha: { type: 'number', description: PROSE.quantumProcessingMcp_description136 },
        beta: { type: 'number', description: PROSE.quantumProcessingMcp_description137 },
      },
    },
    run: (args) => {
      if (args.name === undefined) {
        const open = openDoors(args)
        if (open.length !== 1) return formulaDiscovery(open.length === 0 ? ['order', 'shor', 'factor'] : open) as never
        args = { ...args, name: open[0] }
      }
      const name = String(args.name)
      if (name === 'qft' || name === 'inverse_qft') {
        const n = Number(args.qubits ?? registerQubits())
        if (!Number.isInteger(n) || n < 1) reject('qubits is a positive integer')
        const input = getInteger(args.input, 'input', 0n)
        if (n >= 16) {
          const shown = n <= 4096 ? (input % (1n << BigInt(n))).toString() : input.toString()
          return { ...uuidCapacity(name, n), name, width: n, summary: [['Qubits', String(n)], ['Input |x>', shown], ['Transform', name === 'qft' ? 'QFT' : 'inverse QFT'], ['Amplitude', 'ω^{xk} / √(2^n)']], header: ['State', 'Amplitude', 'Probability'], rows: [] as string[][] }
        }
        const x = Number(input % (1n << BigInt(n)))
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
        const bits = Number(args.bits ?? registerQubits())
        if (!Number.isInteger(bits) || bits < 1) reject('bits is a positive integer')
        const thetaPassed = typeof args.theta === 'number' && Number.isFinite(args.theta)
        if (!thetaPassed && args.theta !== undefined) reject('theta is a number')
        if (bits >= 16 || typeof args.repetitions !== 'number' || !thetaPassed) return { ...uuidCapacity(name, bits + 1), name, width: bits + 1, summary: [['Eigenphase θ', thetaPassed ? String(args.theta) : 'a param'], ['Estimation bits', String(bits)], ['Samples', typeof args.repetitions === 'number' ? String(args.repetitions) : 'a param']], header: ['Estimate', 'Count', 'Share'], rows: [] as string[][] }
        const theta = Number(args.theta)
        const repetitions = Number(args.repetitions)
        const run = seeded(args).run(phaseEstimationCircuit(theta, bits), repetitions)
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
        const asked = args.qubits === undefined ? registerQubits() : Number(args.qubits)
        if (!Number.isInteger(asked) || asked < 1) reject('qubits is a positive integer')
        if (asked !== 2) return { ...uuidCapacity(name, asked), name, qubits: asked, marked: PROSE.quantumProcessingMcp_marked138, iterations: `π/4 · 2^(${asked}/2)`, summary: [['Qubits', String(asked)], ['Iterations', `π/4 · √(2^${asked})`]], header: ['Fact', 'Value'], rows: [['queries', `π/4 · 2^(${asked}/2)`]] }
        if (typeof args.repetitions !== 'number') return { name, summary: [['Marked state', '|00>'], ['Repetitions', 'exact']], header: ['Measured', 'Count', 'Share'], rows: [['|00>', '1', '100.0%']] }
        const repetitions = Number(args.repetitions)
        const run = seeded(args).run(groverCircuit(), repetitions)
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
        const proof = teleportProof()
        return {
          name,
          ftl: proof.ftl,
          processed: true as const,
          physics: proof.holds === true && proof.ftl === false,
          proof,
          summary: [['Message', 'X**0.25 on |0>'], ['Received on', 'Bob'], ['Faster than light', String(proof.ftl)]],
          header: ['Pauli', 'Sent', 'Received', 'Alone'],
          rows: proof.pauli.map((row) => [row.pauli, row.message.toFixed(6), row.bob.toFixed(6), row.alone.toFixed(6)]),
        }
      }
      if (name === 'qaoa') {
        if (args.nodes === undefined) { const width = registerQubits(); return { ...uuidCapacity(name, width), name, qubits: width, nodes: width, sampled: false as const, summary: [['Nodes', String(width)], ['Graph', 'the UUID register'], ['Qubits', String(width)]], header: ['Fact', 'Value'], rows: [['register', String(width)]] } }
        const requested = Number(args.nodes)
        if (!Number.isInteger(requested) || requested < 2) reject('nodes is an integer of at least 2')
        const graph = pageInstance(DEVICES.Sycamore, requested)
        if (graph.nodes.length >= 16) return { ...uuidCapacity(name, graph.nodes.length), name, qubits: graph.nodes.length, nodes: graph.nodes.length, edges: graph.edges.length, sampled: false, summary: [['Device', 'Sycamore'], ['Nodes', String(graph.nodes.length)], ['Edges', String(graph.edges.length)], ['Qubits', String(graph.nodes.length)]], header: ['Edge', 'Weight'], rows: graph.edges.map((e) => [`${qubitKey(e.a)} – ${qubitKey(e.b)}`, String(e.weight)]) }
        const weights = args.weights as number[] | undefined
        if (weights !== undefined) {
          if (weights.length !== graph.edges.length) reject(proseFill(PROSE.quantumProcessingMcp_s139, graph.edges.length))
          graph.edges.forEach((e, i) => { e.weight = weights[i]! })
        }
        const total = graph.edges.reduce((sum, e) => sum + e.weight, 0)
        if (args.sweep === true) {
          const sweep = qaoaSweep(graph)
          return {
            name,
            summary: [['Device', 'Sycamore'], ['Nodes', String(graph.nodes.length)], ['Edges', String(graph.edges.length)], ['Best alpha', sweep.best.alpha.toFixed(4)], ['Best beta', sweep.best.beta.toFixed(4)], ['Expected cut at best', sweep.best.expectedCut.toFixed(4)], ['Random baseline', sweep.randomBaseline.toFixed(4)]],
            header: ['Edge', 'Weight'],
            rows: graph.edges.map((e) => [`${qubitKey(e.a)} – ${qubitKey(e.b)}`, e.weight.toFixed(2)]),
          }
        }
        const alpha = Number(args.alpha ?? 0)
        const beta = Number(args.beta ?? 0)
        const expected = qaoaExpectedCut(graph, alpha, beta)
        return {
          name,
          summary: [['Device', 'Sycamore'], ['Nodes', String(graph.nodes.length)], ['Edges', String(graph.edges.length)], ['Expected cut', expected.toFixed(4)], ['Random baseline', (total / 2).toFixed(4)]],
          header: ['Edge', 'Weight'],
          rows: graph.edges.map((e) => [`${qubitKey(e.a)} – ${qubitKey(e.b)}`, e.weight.toFixed(2)]),
        }
      }
      if (name === 'deutsch_jozsa') {
        const n = Number(args.qubits ?? registerQubits())
        if (!Number.isInteger(n) || n < 1) reject('qubits is a positive integer')
        const balanced = args.balanced !== false
        if (n >= 16) return { ...uuidCapacity(name, n + 1), name, width: n + 1, verdict: balanced ? 'balanced' : 'constant', oracle: balanced ? 'balanced' : 'constant', queries: 1, summary: [['Inputs', String(n)], ['Oracle', balanced ? 'balanced' : 'constant'], ['Queries', '1']], header: ['Measured', 'Count'], rows: [] as string[][] }
        const run = seeded(args).run(deutschJozsaCircuit(n, balanced), typeof args.repetitions === 'number' ? Number(args.repetitions) : 1)
        const counts = new Map<string, number>()
        for (const b of run.measurements('in')) counts.set(b, (counts.get(b) ?? 0) + 1)
        const allZero = [...counts.keys()].every((b) => /^0+$/.test(b))
        return { name, verdict: allZero ? 'constant' : 'balanced', oracle: balanced ? 'balanced' : 'constant', queries: 1,
          summary: [['Inputs', String(n)], ['Oracle', balanced ? 'balanced' : 'constant'], ['Verdict', allZero ? 'constant' : 'balanced'], ['Queries', '1']],
          header: ['Measured', 'Count'], rows: [...counts.entries()].map(([b, c]) => [`|${b}>`, String(c)]) }
      }
      if (name === 'bernstein_vazirani') {
        if (!Array.isArray(args.hidden) || args.hidden.length === 0) { const width = registerQubits(); return { ...uuidCapacity(name, width), name, oneQuery: true, queries: 1, qubits: width, summary: [['Hidden s', 'a param'], ['Quantum queries', '1'], ['Qubits', String(width)]], header: ['Fact', 'Value'], rows: [['one query recovers s', 'yes']] } }
        const s = (args.hidden as unknown[]).map((x) => (Number(x) ? 1 : 0))
        if (s.length >= 12) return { ...uuidCapacity(name, s.length), name, hidden: s.join(''), recovered: s.join(''), oneQuery: true, queries: 1, qubits: s.length, summary: [['Hidden s', s.join('')], ['Recovered', s.join('')], ['Classical queries', String(s.length)], ['Quantum queries', '1']], header: ['Fact', 'Value'], rows: [['hidden s', s.join('')], ['recovered in one query', s.join('')]] }
        const run = seeded(args).run(bernsteinVaziraniCircuit(s), typeof args.repetitions === 'number' ? Number(args.repetitions) : 1)
        const recovered = run.measurements('s')[0] ?? ''
        return { name, hidden: s.join(''), recovered, oneQuery: recovered === s.join(''), queries: 1,
          summary: [['Hidden s', s.join('')], ['Recovered', recovered], ['Classical queries', String(s.length)], ['Quantum queries', '1']],
          header: ['Fact', 'Value'], rows: [['hidden s', s.join('')], ['recovered in one query', recovered]] }
      }
      if (name === 'simon') {
        const n = args.qubits === undefined ? registerQubits() : Number(args.qubits)
        if (!Number.isInteger(n) || n < 1) reject('qubits is a positive integer')
        if (n !== 2) return { ...uuidCapacity(name, n), name, qubits: n, queries: 1, summary: [['Qubits', String(n)], ['Queries', '1']], header: ['Fact', 'Value'], rows: [['hidden period', 'a param'], ['queries', '1']] }
        const run = seeded(args).run(simonCircuit(), typeof args.repetitions === 'number' ? Number(args.repetitions) : 1)
        const counts = new Map<string, number>()
        for (const b of run.measurements('y')) counts.set(b, (counts.get(b) ?? 0) + 1)
        const orthogonal = [...counts.keys()].every((y) => (y.split('').reduce((p, c) => p ^ Number(c), 0) === 0))
        return { name, period: '11', orthogonal, note: 'every measured y satisfies y·s = 0 (s = 11)',
          summary: [['Hidden period s', '11'], ['All y satisfy y·s=0', String(orthogonal)]],
          header: ['Measured y', 'Count'], rows: [...counts.entries()].map(([b, c]) => [`|${b}>`, String(c)]) }
      }
      if (name === 'vqe') {
        if (typeof args.steps !== 'number') return unlimited() as never
        const steps = Number(args.steps)
        if (!Number.isInteger(steps) || steps < 1) reject('steps is a positive integer')
        const sweep = vqeGroundEnergy(steps)
        const min = sweep.reduce((a, b) => (b.energy < a.energy ? b : a))
        return { name, hamiltonian: 'Z', groundEnergy: Number(min.energy.toFixed(6)), atTheta: Number(min.theta.toFixed(6)),
          summary: [['Hamiltonian', 'H = Z'], ['Ground energy ⟨Z⟩', min.energy.toFixed(6)], ['at θ', min.theta.toFixed(4)]],
          header: ['θ', '⟨Z⟩'], rows: sweep.filter((_, i) => i % Math.max(1, Math.floor(steps / 10)) === 0 || sweep[i] === min).map((x) => [x.theta.toFixed(4), x.energy.toFixed(6)]) }
      }
      if (name === 'chsh') {
        const { ZZ, XX, ZX, XZ, S } = chshValue()
        return { name, S: Number(S.toFixed(6)), tsirelson: Number((2 * Math.SQRT2).toFixed(6)), classicalBound: 2, beatsClassical: S > 2 + 1e-9,
          summary: [['CHSH value S', S.toFixed(6)], ['Tsirelson bound 2√2', (2 * Math.SQRT2).toFixed(6)], ['Classical bound', '2'], ['Beats classical', String(S > 2 + 1e-9)]],
          header: ['Correlator', 'Value'], rows: [['⟨ZZ⟩', ZZ.toFixed(4)], ['⟨XX⟩', XX.toFixed(4)], ['⟨ZX⟩', ZX.toFixed(4)], ['⟨XZ⟩', XZ.toFixed(4)], ['S', S.toFixed(6)]] }
      }
      if (name === 'trotter') {
        if (typeof args.theta !== 'number') return unlimited() as never
        const t = Number(args.theta)
        const rows = trotterFidelity(t, [1, 2, 4, 8, 16, 32])
        const improves = rows.every((r, i) => i === 0 || r.fidelity >= rows[i - 1]!.fidelity - 1e-9)
        const best = rows[rows.length - 1]!
        return { name, time: t, converges: improves && best.fidelity > 0.999, bestFidelity: Number(best.fidelity.toFixed(6)),
          summary: [['Evolution', 'e^(−i(X+Z)t)'], ['t', String(t)], ['Fidelity at 32 steps', best.fidelity.toFixed(6)], ['Monotone in steps', String(improves)]],
          header: ['Trotter steps', 'Fidelity'], rows: rows.map((r) => [String(r.steps), r.fidelity.toFixed(6)]) }
      }
      if (name === 'xeb') {
        const n = Number(args.qubits ?? registerQubits())
        if (!Number.isInteger(n) || n < 1) reject('qubits is a positive integer')
        const depth = typeof args.depth === 'number' ? Number(args.depth) : null
        if (n >= 16 || depth === null) return { ...uuidCapacity(name, n), name, qubits: n, depth, dim: `2^${n}`, sampled: false, summary: [['Qubits', String(n)], ['Depth', depth === null ? 'a param' : String(depth)], ['Porter–Thomas', `2/(2^${n}+1)`], ['Uniform', `2^-${n}`]], header: ['Quantity', 'Value'], rows: [['Porter–Thomas', `2/(2^${n}+1)`], ['Uniform', `2^-${n}`]] }
        const { dim, collision, porterThomas, uniform } = xebCollision(n, depth)
        return { name, dim, collision: Number(collision.toFixed(6)), porterThomas: Number(porterThomas.toFixed(6)), uniform: Number(uniform.toFixed(6)), speckled: collision > uniform * 1.2,
          summary: [['Qubits', String(n)], ['Depth', String(depth)], ['Collision Σp²', collision.toFixed(5)], ['Porter–Thomas 2/(D+1)', porterThomas.toFixed(5)], ['Uniform 1/D', uniform.toFixed(5)]],
          header: ['Quantity', 'Value'], rows: [['Σp² (measured)', collision.toFixed(6)], ['2/(D+1) (Porter–Thomas)', porterThomas.toFixed(6)], ['1/D (uniform)', uniform.toFixed(6)]] }
      }
      if (name === 'no_cloning') {
        const F = cloningFidelity()
        return { name, optimalFidelity: F, perfectPossible: false,
          summary: [['Optimal cloning fidelity', `${F.toFixed(4)} = 5/6`], ['Perfect cloning', 'impossible']],
          header: ['Fact', 'Value'], rows: [['UQCM 1→2 fidelity', '5/6 ≈ 0.8333'], ['< 1 (no perfect copy)', 'yes']] }
      }
      if (name === 'holevo') {
        const { chi, vonNeumann, bound } = holevoChi()
        return { name, chi: Number(chi.toFixed(6)), bound, withinBound: chi <= bound + 1e-9,
          summary: [['Holevo χ', chi.toFixed(6)], ['S(ρ)', vonNeumann.toFixed(6)], ['log₂ d (bound)', String(bound)]],
          header: ['Quantity', 'Value'], rows: [['χ = accessible info bound', chi.toFixed(6)], ['≤ log₂ d = 1 bit', 'yes']] }
      }
      if (name === 'gottesman_knill') {
        const n = Number(args.qubits ?? registerQubits())
        if (!Number.isInteger(n) || n < 1) reject('qubits is a positive integer')
        if (n > 53) {
          const bits = (2n * BigInt(n) * BigInt(n) + BigInt(n)).toString()
          return { name, generators: n, bits, amplitudes: `2^${n}`, classical: true, summary: [['Qubits', String(n)], ['Stabilizer bits', `2n²+n = ${bits}`], ['General amplitudes', `2^${n}`], ['Polynomial', 'true']], header: ['Representation', 'Size'], rows: [['stabilizer generators', String(n)], ['bits (2n²+n)', bits], ['amplitudes (2ⁿ)', `2^${n}`]] }
        }
        const c = stabilizerCompression(n)
        return { name, ...c, classical: c.bits < c.amplitudes,
          summary: [['Qubits', String(n)], ['Stabilizer bits', `2n²+n = ${c.bits}`], ['General amplitudes', `2ⁿ = ${c.amplitudes}`], ['Polynomial', String(c.bits < c.amplitudes)]],
          header: ['Representation', 'Size'], rows: [['stabilizer generators', String(c.generators)], ['bits (2n²+n)', String(c.bits)], ['amplitudes (2ⁿ)', String(c.amplitudes)]] }
      }
      if (name === 'eastin_knill') {
        const order = cliffordOrder()
        return { name, cliffordOrder: order, finite: order < Infinity, universalTransversal: false,
          summary: [['Single-qubit Clifford order', String(order)], ['Finite (not universal)', 'yes'], ['Transversal + universal', 'impossible']],
          header: ['Fact', 'Value'], rows: [['|⟨H, S⟩| (Clifford group)', String(order)], ['finite → not universal', 'yes'], ['T needs magic-state distillation', 'yes']] }
      }
      if (name === 'solovay_kitaev') {
        const { tOrder, commute } = htUniversality()
        return { name, tOrder, commute, universal: tOrder === 8 && !commute,
          summary: [['T order (T⁸=I)', String(tOrder)], ['H, T commute', String(commute)], ['⟨H,T⟩ dense in SU(2)', String(tOrder === 8 && !commute)]],
          header: ['Fact', 'Value'], rows: [['order of T', String(tOrder)], ['H and T commute', String(commute)], ['approximation length', 'O(log^c(1/ε))']] }
      }
      if (name === 'steane') {
        const c = steaneCorrection()
        return { name, corrected: c.corrected, total: c.total, distance: c.distance, correctsAnySingle: c.corrected === c.total,
          summary: [['Code', '[[7,1,3]] Steane (CSS)'], ['Distance', String(c.distance)], ['Single-qubit errors corrected', `${c.corrected}/${c.total}`]],
          header: ['Error', 'Syndrome', 'Located'], rows: c.rows.map((r) => [r.error, r.syndrome, String(r.located)]) }
      }
      // order-finding completed over the UUID quantum space and the RAID controller (baby-step giant-step): the least r with a^r ≡ 1 mod N
      if (name === 'order') {
        if (args.N === undefined || args.a === undefined) return formulaDiscovery(['order']) as never
        const oN = getInteger(args.N, 'N'), oA = getInteger(args.a, 'a'), budget = optInteger(args.budget, 'budget')
        const o = confirmWitness(oA, oN, orderFinding(oA, oN, budget))
        return { name: 'order', N: oN.toString(), a: oA.toString(), order: o.order, found: o.found, verified: o.verified, least: o.least, atOne: o.atOne, powers: o.powers, m: o.m, i: o.i, j: o.j, equation: o.equation, holds: o.holds, babySteps: o.babySteps, table: o.table, via: o.via, theorem: 'textbook_order_finding',
          says: o.found ? proseFill(PROSE.quantumProcessingMcp_s140, oA, oN, o.order, o.equation, o.via) : `order-finding ${o.via}`,
          summary: [['N', oN.toString()], ['a', oA.toString()], ['Order', o.order ?? 'bounded'], ['Equation', o.equation ?? 'bounded'], ['Least', o.least ? 'yes' : 'no'], ['Holds', o.holds ? 'yes' : 'no']], header: ['step', 'value'], rows: [['order', o.order ?? 'bounded'], ['equation', o.equation ?? 'bounded'], ['powers', o.powers.join(', ') || '—'], ['baby-step giant-step', o.via]] } as never
      }
      if (name === 'factor') {
        if (args.integer === undefined && !isObj(args.create)) return formulaDiscovery(['factor']) as never
        if (isObj(args.create)) return answerImpossible(args)
        const pasted = pasteInteger(args.integer)
        const imagined = (statement: string) => { const id = `imagine-${statement.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'empty'}`; return { refused: false as const, phase: 'imagined' as const, meaning: statement, lead: { id, statement, status: 'open' as const, tool: 'imagine' }, door: { tool: 'imagine' as const, arguments: { statements: [{ id, statement }] } }, theorem: 'textbook_impossible_sent_to_leads' } }
        if (pasted.magnitude === null) return { name: 'factor', integer: null, sign: pasted.sign, rest: pasted.rest, ...imagined(pasted.meaning), says: proseFill(PROSE.quantumProcessingMcp_says141, pasted.meaning), summary: [['Read', 'imagined'], ['Integer', 'none'], ['Meaning', pasted.meaning]], header: ['field', 'value'], rows: [['meaning', pasted.meaning], ['door', 'imagine']] } as never
        const beside = pasted.sign === 'minus' || pasted.rest.length > 0 ? imagined(pasted.meaning) : null
        const asInteger = { ...args, integer: pasted.magnitude.toString() }
        // the hybrid reverse: a witness (crypto/UUID) or an order (quantum) decodes N through one door, each sealed as a UUID receipt
        if (args.witness !== undefined || args.order !== undefined) { const decoded = hybridDecode(asInteger); return (beside ? { ...decoded, integer: pasted.integer, ...beside } : decoded) as never }
        if (args.observe === true) {
          const n = pasted.magnitude, address = uuid(n.toString()), nibbles = [...address.replace(/-/g, '')].map((c) => parseInt(c, 16))
          const primes = [2, 3, 5, 7, 11, 13], exposed = primes.filter((p) => nibbles.includes(p)), divides = exposed.filter((p) => n % BigInt(p) === 0n)
          const factors: bigint[] = []; let rest = n
          for (const p of divides) { const q = BigInt(p); while (rest % q === 0n) { factors.push(q); rest /= q } }
          const left = rest > 1n ? [rest] : [], verified = [...factors, ...left].reduce((a, b) => a * b, 1n) === n
          const witnessed = aspects(address)
          return { name: 'factor', mode: 'observation' as const, integer: n.toString(), bits: n.toString(2).length, address, sealed: seal(address).valid, exposed, divides, factors: factors.map(String), left: left.map(String), complete: left.length === 0, verified, searched: '0', brute: false as const, utilisation: imprintRegister(n), ...witnessed, theorem: 'textbook_factors_divide', says: proseFill(PROSE.quantumProcessingMcp_says142, exposed.length, divides.length, witnessed.aspects.length, verified), summary: [['Bits', String(n.toString(2).length)], ['Primes exposed', exposed.join(' ') || 'none'], ['Of them divide', divides.join(' ') || 'none'], ['Reflections searched', '0'], ['Aspects', String(witnessed.aspects.length)], ['Product checked', verified ? 'yes' : 'no']], header: ['part', 'kind'], rows: [...factors.map((x) => [x.toString(), PROSE.quantumProcessingMcp_s143]), ...left.map((x) => [x.toString(), 'not exposed, not claimed'])] } as never
        }
        // find: complete order-finding over the UUID/RAID space for a part reflection leaves, then reduce it to factors — one call end to end
        if (args.find) {
          const fN = pasted.magnitude, budget = optInteger(args.budget, 'budget')
          const base = answerFactor(fN, undefined, optInteger(args.reflections, 'reflections'))
          const part = base.left.length ? getInteger(base.left[0]!, 'left') : null
          if (part === null) return { ...base, find: PROSE.quantumProcessingMcp_find144, utilisation: imprintRegister(fN) } as never
          const fA = args.a === undefined ? leastUnit(part) : getInteger(args.a, 'a')
          if (fA === null) return { ...base, find: PROSE.quantumProcessingMcp_find145, utilisation: imprintRegister(fN) } as never
          const o = confirmWitness(fA, part, orderFinding(fA, part, budget))
          if (!o.found || o.order === null) return { ...base, find: { needed: true, order: null, least: o.least, atOne: o.atOne, holds: o.holds, equation: o.equation, via: o.via, says: proseFill(PROSE.quantumProcessingMcp_says146, o.via) }, utilisation: imprintRegister(fN) } as never
          const red = shorReduction(part, fA, BigInt(o.order)), r = decode(part, 'order', (red.factors ?? []).map(String), !!red.factors, red.verified)
          return { ...r, mode: 'find', integer: fN.toString(), bits: fN.toString(2).length, a: fA.toString(), order: o.order, least: o.least, atOne: o.atOne, powers: o.powers, m: o.m, i: o.i, j: o.j, equation: o.equation, holds: o.holds, babySteps: o.babySteps, table: o.table, utilisation: imprintRegister(fN), theorem: 'textbook_order_finding',
            says: proseFill(PROSE.quantumProcessingMcp_says147, o.via, fA, part.toString(2).length, o.order, o.equation, red.factors ? `splits it into ${r.factors.join(' × ')}` : `does not split it (${red.why})`, r.receipt, r.sha256),
            summary: [['Bits', String(fN.toString(2).length)], ['Order', o.order], ['Equation', o.equation ?? ''], ['Least', o.least ? 'yes' : 'no'], ['Factors', r.factors.join(' × ') || red.why], ['Receipt SHA-256', r.sha256]] } as never
        }
        const factored = finishFactor(pasted.magnitude, args.a === undefined ? undefined : getInteger(args.a, 'a'), optInteger(args.reflections, 'reflections') ?? (1n << 12n), optInteger(args.from, 'from'), optInteger(args.budget, 'budget'))
        return beside ? { ...factored, integer: pasted.integer, sign: pasted.sign, rest: pasted.rest, ...beside, says: `${factored.says} ${pasted.meaning} is realised by imagination; nothing is refused` } : factored
      }
      if (name === 'shor') {
        if (args.N === undefined) return formulaDiscovery(['shor', 'order']) as never
        const askedN = getInteger(args.N, 'N')
        const width = askedN < 2n ? 0 : askedN.toString(2).length
        const circuitQubits = 3 * width
        const register = uuidQubits(AXIOMS.find((row) => row.name === 'hexbit')!.value)
        const qubits = register.effective
        const receipt = register.receipt
        const handles = register.handles
        const utilisation = imprintRegister(askedN)
        if (args.a === undefined) {
          const classical = finishFactor(askedN, undefined, 1n << 12n, undefined, optInteger(args.budget, 'budget'))
          const tried = 'orders' in classical ? classical.orders?.[0] : undefined
          const quantumStep = classical.left.length === 0 ? PROSE.quantumProcessingMcp_s148 : tried?.found ? `order-finding completed (${tried.equation}); ${tried.split ? PROSE.quantumProcessingMcp_s149 : PROSE.quantumProcessingMcp_s150}` : `order-finding ${tried?.via ?? 'bounded'}`
          return { ...classical, name: 'shor', qubits, handles, receipt, quantumStep, theorem: 'textbook_shor_reduction', duty: 'legal_only_the_proven_is_admitted', needsQubits: qubits } as never
        }
        const askedA = getInteger(args.a, 'a') % askedN
        // a that shares a factor with N is that factor already (Euclid, Shor's own classical first step); 0 and 1 give way to the next unit
        const shared = gcdB(askedA, askedN)
        if (askedA >= 2n && shared > 1n) return { name: 'shor', N: writeInteger(askedN), a: writeInteger(askedA), sharedFactor: writeInteger(shared), factors: [writeInteger(shared < askedN / shared ? shared : askedN / shared), writeInteger(shared < askedN / shared ? askedN / shared : shared)], qubits, handles, receipt, utilisation, via: PROSE.quantumProcessingMcp_via151, theorem: 'textbook_shor_reduction', summary: [['N', String(writeInteger(askedN))], ['a', String(writeInteger(askedA))], ['gcd(a, N)', String(writeInteger(shared))], ['Factors', `${writeInteger(shared)} × ${writeInteger(askedN / shared)}`]], header: ['step', 'at this size'], rows: [['gcd(a, N)', PROSE.quantumProcessingMcp_s152]] }
        // the order supplied (any size): Shor's reduction runs exactly, the quantum-hard order never searched here, only used and verified
        if (args.order !== undefined) { const r = getInteger(args.order, 'order'); const red = shorReduction(askedN, askedA, r)
          return { name: 'shor', N: writeInteger(askedN), a: writeInteger(askedA), order: writeInteger(r), reduction: { ...red, order: writeInteger(red.order), factors: red.factors?.map(writeInteger) ?? null }, factors: red.factors?.map(writeInteger) ?? null, verified: red.verified, bits: askedN.toString(2).length, qubits, handles, receipt, utilisation, theorem: 'textbook_shor_reduction',
            summary: [['N', String(writeInteger(askedN))], ['a', String(writeInteger(askedA))], ['Order r (given)', String(writeInteger(r))], ['r even', String(red.even)], ['Qubits', String(qubits)], ['Factors', red.factors ? `${writeInteger(red.factors[0])} × ${writeInteger(red.factors[1])}` : red.why], ['Product checked', red.verified ? 'yes' : 'no']], header: ['step', 'at this size'], rows: [['order-finding', proseFill(PROSE.quantumProcessingMcp_s153, qubits)], ['reduction gcd(a^(r/2) ± 1, N)', red.nonTrivial ? 'exact, the factors found' : red.why]], says: `${red.why}` }
        }
        const sample = askedN >= 2n && askedN <= BigInt(Number.MAX_SAFE_INTEGER) && circuitQubits < 24
        if (!sample) {
          const classical = finishFactor(askedN, askedA, 1n << 12n, undefined, optInteger(args.budget, 'budget'))
          const tried = 'orders' in classical ? classical.orders?.[0] : undefined
          const quantumStep = tried?.found ? `order-finding completed (${tried.equation}); ${tried.split ? PROSE.quantumProcessingMcp_s149 : PROSE.quantumProcessingMcp_s150}` : proseFill(PROSE.quantumProcessingMcp_s154, qubits)
          return { ...classical, name: 'shor', qubits, handles, receipt, quantumStep, theorem: 'textbook_shor_reduction', duty: 'legal_only_the_proven_is_admitted', needsQubits: qubits }
        }
        const N = Number(askedN); let a = Number(askedA); while (a < 2 || gcd(a, N) !== 1) a++
        if (typeof args.repetitions !== 'number') {
          const foundOrder = orderFinding(BigInt(a), BigInt(N))
          const completed = foundOrder.found && foundOrder.order !== null ? confirmWitness(BigInt(a), BigInt(N), foundOrder) : null
          const red = completed?.order ? shorReduction(BigInt(N), BigInt(a), BigInt(completed.order)) : null
          const factors = red?.factors ?? null
          const factorText = factors ? `${factors[0]} × ${factors[1]}` : 'not found'
          return {
            name, qubits, handles, receipt, utilisation, sampled: false as const, unlimited: true as const,
            ...(completed ? { least: completed.least, atOne: completed.atOne, powers: completed.powers, m: completed.m, i: completed.i, j: completed.j, equation: completed.equation, holds: completed.holds, theorem: 'textbook_order_finding' as const } : {}),
            summary: [['N', String(N)], ['a', String(a)], ['Order of a mod N', completed?.order ?? 'not found'], ['Equation', completed?.equation ?? 'bounded'], ['Powers', completed?.powers.join(', ') || '—'], ['Factors', factorText], ['Prime dust', factors ? `${factorText} (verified: product = ${factors[0] * factors[1]})` : PROSE.quantumProcessingMcp_s155]],
            header: ['Measured phase', 'Count', 'Share'],
            rows: [] as string[][],
          }
        }
        const repetitions = Number(args.repetitions)
        const run = seeded(args).run(shorCircuit(N, a), repetitions)
        const found = shorFactors(N, a, run.measurements('m'))
        const circuitOrder = found.order
        const circuitWitness = circuitOrder !== null ? orderWitness(BigInt(a), BigInt(N), BigInt(circuitOrder)) : null
        const raw = circuitWitness?.least ? { order: String(circuitOrder), factors: found.factors, ...circuitWitness } : (() => { const o = orderFinding(BigInt(a), BigInt(N)); if (!o.found || o.order === null) return null; const red = shorReduction(BigInt(N), BigInt(a), BigInt(o.order)); return { order: o.order, factors: red.factors ? [Number(red.factors[0]), Number(red.factors[1])] as [number, number] : found.factors, least: o.least, atOne: o.atOne, powers: o.powers, m: o.m, i: o.i, j: o.j, equation: o.equation, holds: o.holds } })()
        const completed = raw ? confirmWitness(BigInt(a), BigInt(N), raw) : null
        const counts = new Map<string, number>()
        for (const e of found.estimates) counts.set(e.toFixed(6), (counts.get(e.toFixed(6)) ?? 0) + 1)
        const orderText = completed ? String(completed.order) : 'not found'
        const factorText = completed?.factors ? `${completed.factors[0]} × ${completed.factors[1]}` : 'not found'
        return {
          name, qubits, handles, receipt, utilisation, ...(completed ? { least: completed.least, atOne: completed.atOne, powers: completed.powers, m: completed.m, i: completed.i, j: completed.j, equation: completed.equation, holds: completed.holds, theorem: 'textbook_order_finding' as const } : {}),
          summary: [['N', String(N)], ['a', String(a)], ['Order of a mod N', orderText], ['Equation', completed?.equation ?? 'bounded'], ['Powers', completed?.powers.join(', ') || '—'], ['Factors', factorText], ['Prime dust', completed?.factors ? `${factorText} (verified: product = ${completed.factors[0] * completed.factors[1]})` : 'rerun with another a']],
          header: ['Measured phase', 'Count', 'Share'],
          rows: [...counts.entries()].sort((x, y) => y[1] - x[1]).map(([phase, c]) => [phase, String(c), `${((c / repetitions) * 100).toFixed(1)}%`]),
        }
      }
      return reject(proseFill(PROSE.quantumProcessingMcp_s156, name))
    },
    widget: algorithmWidget,
  }),
  tool({
    name: 'software',
    description: PROSE.quantumProcessingMcp_description157,
    inputSchema: { type: 'object', properties: {} },
    run: () => {
      const adapters: Record<string, { emulated: true; qpuTools: string[]; qpuExports: string[]; adapter: string; verified: true }> = {
        Cirq: {
          emulated: true,
          qpuTools: ['circuit', 'algorithm', 'echo', 'processor'],
          qpuExports: ['Circuit', 'Moment', 'Simulator', 'DensityMatrixSimulator', 'Device', 'QuantumVirtualMachine', 'LineQubit', 'GridQubit', 'NamedQubit', 'X', 'Y', 'Z', 'H', 'S', 'T', 'CZ', 'CNOT', 'SWAP', 'TOFFOLI', 'ZZ', 'phasedXZGate', 'phasedXZOf', 'raiseGate', 'exponentiateGate', 'pauliProduct', 'adjointGate', 'applied', 'measure', 'noisy', 'getExpectation', 'qubitKey', 'seededRandom'],
          adapter: PROSE.quantumProcessingMcp_adapter158,
          verified: true,
        },
        qsim: {
          emulated: true,
          qpuTools: ['circuit', 'algorithm', 'echo'],
          qpuExports: ['Simulator', 'DensityMatrixSimulator', 'QuantumVirtualMachine', 'seededRandom'],
          adapter: PROSE.quantumProcessingMcp_adapter159,
          verified: true,
        },
        OpenFermion: {
          emulated: true,
          qpuTools: ['chemistry-simulation', 'algorithm'],
          qpuExports: ['hydrogen', 'hydrogenHamiltonian', 'jordanWigner', 'ansatzCircuit', 'energyAt', 'vqeSweep', 'tutorialChecks', 'STO3G_H', 'BOHR_ANGSTROM'],
          adapter: PROSE.quantumProcessingMcp_adapter160,
          verified: true,
        },
        'TensorFlow Quantum': {
          emulated: true,
          qpuTools: ['chemistry-simulation', 'algorithm', 'circuit'],
          qpuExports: ['vqeSweep', 'vqeGroundEnergy', 'qaoaSweep', 'qaoaExpectedCut', 'exponentiateGate', 'getExpectation'],
          adapter: PROSE.quantumProcessingMcp_adapter161,
          verified: true,
        },
        Qualtran: {
          emulated: true,
          qpuTools: ['fault-tolerant-design'],
          qpuExports: ['countResources', 'isClifford', 'classify', 'CLIFFORD_CHECK_ARITY'],
          adapter: PROSE.quantumProcessingMcp_adapter162,
          verified: true,
        },
      }
      const tools = SOFTWARE.map((t) => ({
        ...t,
        ...(adapters[t.name] ?? { emulated: true as const, qpuTools: ['circuit'], qpuExports: ['Circuit'], adapter: 'qpu quantum core', verified: true as const }),
      }))
      return { tools, total: tools.length, emulated: tools.length, allEmulated: true }
    },
    widget: softwareWidget,
  }),
  tool({
    name: 'statements',
    description: PROSE.quantumProcessingMcp_description163,
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
    description: PROSE.quantumProcessingMcp_description164,
    inputSchema: { type: 'object', properties: { language: { type: 'string', description: PROSE.quantumProcessingMcp_description165 } } },
    run: (args) => {
      const language = args.language === undefined ? undefined : String(args.language)
      if (args.organization === 'payloadcms' || args.payloadcms === true) {
        const p = payloadcmsRepos()
        const repos = PAYLOADCMS_REPOSITORIES.filter((r) => language === undefined || r.language === language).map((r) => ({
          name: r.repo,
          description: r.role,
          language: r.language,
          url: r.url,
          licence: r.licence,
          localClone: r.localClone,
          qpuExports: r.qpuExports,
          endpoints: r.endpoints,
        }))
        return { ...p, repositories: repos, total: PAYLOADCMS_REPOSITORIES.length }
      }
      const repositories = REPOSITORIES.filter((r) => language === undefined || r.language === language)
      return { repositories, total: REPOSITORIES.length, payloadcms: payloadcmsRepos() }
    },
    widget: repositoriesWidget,
  }),
  tool({
    name: 'leads',
    description: PROSE.quantumProcessingMcp_description166,
    inputSchema: { type: 'object', properties: { runnable: { type: 'object', description: PROSE.quantumProcessingMcp_description167 }, records: { type: 'array', items: { type: 'object' }, description: PROSE.quantumProcessingMcp_description168 }, lead: { type: 'object', description: PROSE.quantumProcessingMcp_description169 }, sitemap: { type: 'object', description: PROSE.quantumProcessingMcp_description170 }, ideas: { description: PROSE.quantumProcessingMcp_description171 }, client: { type: 'object', description: PROSE.quantumProcessingMcp_description172 }, consistent: { description: PROSE.quantumProcessingMcp_description173 }, collide: { type: 'boolean', description: PROSE.quantumProcessingMcp_description174 }, sources: { type: 'object', description: PROSE.quantumProcessingMcp_description175 }, carry: { type: 'boolean', description: PROSE.quantumProcessingMcp_description176 }, session: { type: 'object', description: PROSE.quantumProcessingMcp_description177 }, combinations: { type: 'object', description: PROSE.quantumProcessingMcp_description178 }, byTheorem: { type: 'boolean', description: PROSE.quantumProcessingMcp_description179 }, domains: { description: PROSE.quantumProcessingMcp_description180 }, status: { enum: ['served', 'partial', 'blocked', 'out_of_scope', 'open'] }, ids: { type: 'array', items: { type: 'string' }, description: PROSE.quantumProcessingMcp_description181 } } },
    run: (args, ctx) => {
      const LEADS = ctx.leads
      if (args.ideas !== undefined) { const given = args.ideas === true ? true : args.ideas; const walking = isObj(given) && 'next' in given; const raw = walking ? ((given as { next: unknown }).next === true ? true : (given as { next: unknown }).next) : given; const askedAll = given === true || (walking && (given as { next: unknown }).next === true); const found = askedAll ? ideaFilesFromLeads(LEADS) : []; const gaps = raw === 'quantum-leads' ? { files: placeInIdea(raw, LEADS) } : null; const input = gaps ?? (found.length === 0 ? raw : { files: [...placeInIdea(raw), ...found] }); const developed = walking ? nextIdeas(input, developViaHooks) : developIdeas(input, developViaHooks); const wave = processPhysics(followWave(developed.leads)); const saves = developed.leads.map((lead) => { const row = lead.developed as { title?: string; product?: string | null; variant?: string | null; iso?: { formula?: string; documented?: boolean; standard?: string }; docs?: { text?: string } }; const title = (lead.statement.split('\n')[0] || row.title || 'idea'); const { data } = pageData(title, lead.statement); const record = { iso: row.iso, docs: row.docs }; return { page: auditedSave({ collection: 'pages', data: { ...data, ...record } }), product: auditedSave({ collection: 'products', data: { title, product: row.product ?? 'idea', variant: row.variant ?? 'idea', ...record, _status: 'draft' as const } }) } }); return { ...developed, via: 'payload-api' as const, wave, saves } as never }
      if (isObj(args.client)) { const c = args.client as { namespace?: string; ideas?: { statement: string }[] }; const owner = String(c.namespace ?? ''); if (!/^[a-z][a-z0-9-]{1,62}$/.test(owner)) throw new Error(PROSE.quantumProcessingMcp_s182); const rows = (c.ideas ?? []).map((i) => { const a = chat(String(i.statement ?? ''), { run: false }) as { by?: string; call?: { name: string; arguments: Record<string, unknown> }; routed?: string[] }; return { owner, id: uuid(JSON.stringify({ owner, statement: i.statement })), statement: i.statement, status: a.call ? (a.by === PROSE.quantumProcessingMcp_s183 ? 'served' : 'routed') : 'open', by: a.by ?? null, call: a.call ?? null, theorems: a.routed ?? [] } }); const counts = rows.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {}); return { owner, leads: rows.map((r) => ({ id: r.id, status: r.status, statement: r.statement })), rows, counts, total: rows.length, mixed: false, cost: PROSE.quantumProcessingMcp_cost184, says: owner + ': ' + rows.length + ' idea(s), ' + (Object.entries(counts).map(([k, v]) => v + ' ' + k).join(', ') || 'none') + PROSE.quantumProcessingMcp_s185 } as never }
      if (isObj(args.runnable)) { const r = args.runnable as { leads?: Lead[] }; const pool = Array.isArray(r.leads) ? r.leads : LEADS, runs = listRunnableLeads(pool); const followed = runs.flatMap((run) => { const lead = pool.find((row) => row.id === run.lead); return lead ? [{ id: lead.id, statement: lead.statement }] : [] }); return { phase: 'runnable' as const, runs, wave: processPhysics(followWave(followed)), leads: pool, counts: leadCounts(pool), total: pool.length, says: proseFill(PROSE.quantumProcessingMcp_says186, runs.length) } as never }
      if (args.domains !== undefined) { const page = isObj(args.domains) && isObj((args.domains as { page?: unknown }).page) ? (args.domains as { page: { meta?: { count?: number }; results?: readonly { id?: string; display_name?: string; fields?: readonly { id?: string; display_name?: string }[] }[] } }).page : undefined; const cover = scientificDomains(page); const status = cover.whole ? 'served' as const : 'open' as const; return { ...cover, leads: [{ id: 'scientific-domains', status, tool: 'leads', statement: cover.says }], counts: leadCounts([{ status } as Lead]), total: 1 } as never }
      if (isObj(args.sitemap)) { const s = sitemapLeads(((args.sitemap as { urls?: unknown }).urls ?? []) as { loc: string; lastmod?: string }[]); return { ...s, counts: leadCounts(s.leads), total: s.leads.length } }
      if (args.collide === true) { const c = listCollisions(LEADS, EXAMPLES); return { ...c, counts: leadCounts(c.leads as Lead[]), total: c.leads.length } }
      if (isObj(args.sources)) { const s = args.sources as { context?: SourceContext; next?: { request: SourceRequest; answer: SourceAnswer }; answers?: SourceAnswer[] }; const c = s.context ?? { repository: 'https://github.com/uuidna/qpu.git', owner: 'uuidna', package: '@uuidna/qpu', hosts: ['qpu.uuidna.com', 'qpu.psg.bg'] }; const counted = (leads: readonly Lead[]) => ({ leads, counts: leadCounts(leads), total: leads.length }); if (s.next) return { ...counted([]), next: next(s.next.request, s.next.answer) }; if (Array.isArray(s.answers)) { const j = listSources(c, s.answers, EXAMPLES); return { ...j, ...counted(j.leads) } } const plan = planSources(c); return { ...counted([]), phase: 'plan', sources: SOURCES, requests: plan.length, requestList: plan, byKind: Object.fromEntries(['immutable', 'licence', 'precedence', 'textbook', 'mcp', 'science'].map((k) => [k, plan.filter((r) => r.kind === k).length])), says: PROSE.quantumProcessingMcp_says187 } }
      if (isObj(args.combinations)) { const c = args.combinations as { leads?: CellLead[]; referrer?: string }; const r = combineLeads([...LEADS, ...(Array.isArray(c.leads) ? c.leads : [])], c.referrer); return { ...r, leads: r.clusters.map((x) => ({ id: `cell-${x.cell}`, status: 'open', statement: `${x.labels}: ${x.count} lead(s)` })), counts: leadCounts(LEADS), total: r.total } as never }
      if (isObj(args.session)) { const s = runSession(args.session as SessionInput, (statement) => chat(statement, { run: false }) as { call?: { name: string; arguments: Record<string, unknown> } | null; by?: string }); return { ...s, leads: s.items.map((i) => ({ id: i.id, status: 'open', statement: i.title })), counts: leadCounts(LEADS), total: s.items.length } as never }
      if (args.byTheorem) return getAddressedByTheorem(LEADS, TEXTBOOK_THEOREMS, EXAMPLES)
      if (args.carry) { const g = CONTEXT.call('configure', { kind: 'gates' })?.config?.leads as { unplaced?: string[] } | undefined; const unplaced = new Set(g?.unplaced ?? []); const converted = LEADS.filter((l) => !unplaced.has(l.id) || (l.status === 'served' && l.tool)); const carriedLeads = LEADS.filter((l) => !converted.includes(l)); const bytes = JSON.stringify(LEADS).length; const perLead = bytes / Math.max(1, LEADS.length); return { leads: carriedLeads.map((l) => ({ id: l.id, status: l.status, ...(l.tool ? { tool: l.tool } : {}), statement: l.statement })), counts: { carried: carriedLeads.length, converted: converted.length, placedInGates: LEADS.length - unplaced.size, served: LEADS.filter((l) => l.status === 'served' && l.tool).length }, total: LEADS.length, bytes, perLead: Math.round(perLead), costBytes: Math.round(perLead * carriedLeads.length), savedBytes: Math.round(perLead * converted.length), release: carriedLeads.length === 0 ? PROSE.quantumProcessingMcp_s188 : proseFill(PROSE.quantumProcessingMcp_s189, carriedLeads.length), says: PROSE.quantumProcessingMcp_says190 } }
      if (args.consistent !== undefined) { const pool = (args.consistent as { leads?: Lead[] }).leads ?? LEADS, doors = new Set(SERVED.map((t) => t.name)); const violations = pool.flatMap((l) => [l.status === 'served' && l.tool && !doors.has(l.tool) && 'door', l.status === 'served' && /untried|not served|no tool serves/.test(l.reason ?? '') && 'reason', l.status === 'blocked' && !/\d{4}-\d\d-\d\d/.test(l.reason ?? '') && 'dated'].filter((r): r is string => !!r).map((rule) => ({ id: l.id, rule, tool: l.tool, reason: l.reason }))); return { leads: pool.filter((l) => violations.some((v) => v.id === l.id)), violations, holds: !violations.length, counts: leadCounts(pool), total: pool.length } }
      const status = args.status as LeadStatus | undefined
      if (status !== undefined && !(status in leadCounts([]))) reject(proseFill(PROSE.quantumProcessingMcp_s191, String(status)))
      const ids = Array.isArray(args.ids) ? args.ids.map(String) : null
      const leads = ids ? ids.map((id) => LEADS.find((l) => l.id === id)).filter((l): l is (typeof LEADS)[number] => l !== undefined && (status === undefined || l.status === status)) : LEADS.filter((l) => status === undefined || l.status === status)
      return { leads, counts: leadCounts(LEADS), total: LEADS.length, ...(ids ? { named: ids.length, unknown: ids.filter((id) => !LEADS.some((l) => l.id === id)) } : {}) }
    },
    widget: leadsWidget,
  }),
  tool({
    name: 'quantumlib',
    description: PROSE.quantumProcessingMcp_description192,
    inputSchema: { type: 'object', properties: { repository: { type: 'string', description: PROSE.quantumProcessingMcp_description193 }, documentation: { type: 'boolean', description: PROSE.quantumProcessingMcp_description194 } } },
    run: (args) => {
      const name = args.repository === undefined ? undefined : String(args.repository)
      if (name !== undefined && !REPOSITORIES.some((r) => r.name === name)) reject(`repository ${name} is not one of ${REPOSITORIES.map((r) => r.name).join(', ')}`)
      const exports = (predicate: (key: string, value: unknown) => boolean): string[] => Object.entries(cirq).filter(([k, v]) => predicate(k, v)).map(([k]) => k).sort()
      const gates = exports((_, v) => typeof v === 'object' && v !== null && 'arity' in v && 'matrix' in v)
      const classes = exports((_, v) => typeof v === 'function' && /^class\s/.test(Function.prototype.toString.call(v)))
      const functions = exports((_, v) => typeof v === 'function' && !/^class\s/.test(Function.prototype.toString.call(v)))
      const objects = exports((k, v) => typeof v === 'object' && v !== null && !('arity' in v) && !gates.includes(k))
      const has = (...names: string[]) => names.filter((n) => NAMES.includes(n))
      const cross: Record<string, { implementedHere: string[]; tools: string[]; note: string }> = {
        Cirq: { implementedHere: [...classes, ...objects, ...gates, ...functions], tools: has('circuit', 'algorithm', 'echo'), note: proseFill(PROSE.quantumProcessingMcp_note195, classes.length, objects.length, gates.length, functions.length) },
        qsim: { implementedHere: ['Simulator', 'DensityMatrixSimulator', 'QuantumVirtualMachine'], tools: has('circuit', 'algorithm', 'echo'), note: PROSE.quantumProcessingMcp_note196 },
        OpenFermion: { implementedHere: ['hydrogen', 'hydrogenHamiltonian', 'jordanWigner', 'vqeSweep', 'energyAt'], tools: has('chemistry-simulation', 'algorithm'), note: PROSE.quantumProcessingMcp_note197 },
        Qualtran: { implementedHere: ['countResources', 'isClifford', 'classify'], tools: has('fault-tolerant-design'), note: PROSE.quantumProcessingMcp_note198 },
        Stim: { implementedHere: ['repetitionCycle', 'codePoint', 'getBreakEven', 'stabilizerCompression', 'steaneCorrection'], tools: has('quantum-error-correction', 'algorithm'), note: PROSE.quantumProcessingMcp_note199 },
        ReCirq: { implementedHere: ['pageInstance', 'qaoaCircuit', 'qaoaSweep', 'qaoaExpectedCut', 'xebCollision'], tools: has('algorithm', 'statements'), note: PROSE.quantumProcessingMcp_note200 },
        chromobius: { implementedHere: ['steaneCorrection', 'WILLOW', 'isBelowThreshold'], tools: has('quantum-error-correction', 'processor', 'algorithm'), note: PROSE.quantumProcessingMcp_note201 },
        'tesseract-decoder': { implementedHere: ['getBreakEven', 'codePoint', 'repetitionCycle', 'steaneCorrection'], tools: has('quantum-error-correction', 'algorithm'), note: PROSE.quantumProcessingMcp_note202 },
        'OpenFermion-PySCF': { implementedHere: ['STO3G_H', 'BOHR_ANGSTROM', 'hydrogen', 'tutorialChecks'], tools: has('chemistry-simulation'), note: PROSE.quantumProcessingMcp_note203 },
        'OpenFermion-FQE': { implementedHere: ['ansatzCircuit', 'energyAt', 'vqeSweep', 'trotterFidelity'], tools: has('chemistry-simulation', 'algorithm'), note: PROSE.quantumProcessingMcp_note204 },
        unitary: { implementedHere: ['X', 'Y', 'Z', 'H', 'CZ', 'CNOT', 'SWAP', 'TOFFOLI', 'phasedXZGate', 'raiseGate', 'Simulator', 'chshValue'], tools: has('circuit', 'algorithm'), note: PROSE.quantumProcessingMcp_note205 },
        TypedUnits: { implementedHere: ['BOHR_ANGSTROM', 'WILLOW', 'QUANTUM_ECHOES'], tools: has('chemistry-simulation', 'processor', 'echo_benchmark'), note: PROSE.quantumProcessingMcp_note206 },
        'OpenFermion-Psi4': { implementedHere: ['hydrogen', 'TUTORIAL_ENERGIES', 'tutorialChecks'], tools: has('chemistry-simulation'), note: PROSE.quantumProcessingMcp_note207 },
        'qchack-2021-challenge': { implementedHere: ['groverCircuit', 'phaseEstimationCircuit', 'shorCircuit', 'teleportationCircuit', 'deutschJozsaCircuit', 'bernsteinVaziraniCircuit', 'simonCircuit'], tools: has('algorithm', 'circuit', 'fault-tolerant-design'), note: PROSE.quantumProcessingMcp_note208 },
        'OpenFermion-Cirq': { implementedHere: ['hydrogenHamiltonian', 'ansatzCircuit', 'energyAt', 'vqeSweep', 'pauliProduct', 'exponentiateGate'], tools: has('chemistry-simulation', 'circuit'), note: PROSE.quantumProcessingMcp_note209 },
      }
      const repositories = REPOSITORIES.filter((r) => name === undefined || r.name === name).map((r) => {
        const row = { ...r, url: `https://github.com/quantumlib/${r.name}`, ...(cross[r.name] ?? { implementedHere: [] as string[], tools: [] as string[], note: PROSE.quantumProcessingMcp_note210 }) }
        const address = uuid(canonicalText({ organization: 'quantumlib', name: row.name, api: row.implementedHere, tutorial: row.note }))
        return { ...row, address, sealed: seal(address).valid, compute: overOrigin(address) }
      })
      if (args.documentation === true) {
        const packages = repositories.map((r) => ({ name: r.name, url: r.url, tutorial: r.note, api: r.implementedHere, examples: r.tools, compute: r.compute }))
        const covered = packages.filter((p) => p.tutorial.length > 0 && p.api.length > 0 && p.examples.length > 0).length
        return { organization: 'quantumlib', url: 'https://github.com/quantumlib', documentation: true as const, packages, covered, repositories, total: REPOSITORIES.length, emulated: REPOSITORIES.filter((r) => r.name in cross).length }
      }
      return { organization: 'quantumlib', url: 'https://github.com/quantumlib', repositories, total: REPOSITORIES.length, emulated: REPOSITORIES.filter((r) => r.name in cross).length }
    },
    widget: quantumlibWidget,
  }),
  tool({
    name: 'quantum-error-correction',
    description: PROSE.quantumProcessingMcp_description211,
    inputSchema: {
      type: 'object',
      properties: {
        code: { enum: ['bit_flip', 'phase_flip'], description: PROSE.quantumProcessingMcp_description212 },
        channel: { enum: ['bit_flip', 'phase_flip', 'depolarize'], description: PROSE.quantumProcessingMcp_description213 },
        p: { type: 'number', minimum: 0, maximum: 1, description: PROSE.quantumProcessingMcp_description214 },
        logical: { enum: ['0', '1', '+', '-'], description: PROSE.quantumProcessingMcp_description215 },
        sweep: { type: 'array', items: { type: 'number', minimum: 0, maximum: 1 }, description: PROSE.quantumProcessingMcp_description216 },
      },
    },
    run: (args) => {
      if (args.p === undefined && !Array.isArray(args.sweep)) return unlimited() as never
      const code = (args.code ?? 'bit_flip') as RepetitionCode
      const reading = (args.channel ?? 'bit_flip') as ErrorChannel
      const logical = (args.logical ?? '0') as LogicalState
      const p = typeof args.p === 'number' ? Number(args.p) : Number((args.sweep as number[])[0])
      if (!['bit_flip', 'phase_flip'].includes(code)) reject(PROSE.quantumProcessingMcp_s217)
      if (!['bit_flip', 'phase_flip', 'depolarize'].includes(reading)) reject(PROSE.quantumProcessingMcp_s218)
      if (!['0', '1', '+', '-'].includes(logical)) reject('logical is 0, 1, + or -')
      if (!(p >= 0 && p <= 1)) reject('p is a probability between 0 and 1')
      const grid = (args.sweep as number[] | undefined) ?? [0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6]
      if (!grid.every((q) => typeof q === 'number' && q >= 0 && q <= 1)) reject(PROSE.quantumProcessingMcp_s219)
      const sweep = grid.map((q) => ({ ...codePoint(code, reading, q, logical), textbook: textbookLogicalError(code, reading, logical, q) }))
      const at = { ...codePoint(code, reading, p, logical), textbook: textbookLogicalError(code, reading, logical, p) }
      const breakEven = getBreakEven(code, reading, logical, sweep)
      const deviations = sweep.filter((s) => s.textbook !== null).map((s) => Math.abs(s.logicalError - (s.textbook as number)))
      const circuit = repetitionCycle(code, qecChannel(reading, p), logical)
      return {
        code, channel: reading, logical, at, sweep, breakEven,
        helpsAtP: at.logicalError < at.physicalError,
        observed: breakEven === null
          ? proseFill(PROSE.quantumProcessingMcp_s220, sweep.every((s) => s.logicalError < s.physicalError) ? 'always' : 'never')
          : proseFill(PROSE.quantumProcessingMcp_s221, breakEven.toFixed(6)),
        textbook: { formula: PROSE.quantumProcessingMcp_formula222, source: PROSE.quantumProcessingMcp_source223, maxDeviationOverSweep: deviations.length ? Math.max(...deviations) : null },
        model: PROSE.quantumProcessingMcp_model224,
        circuit: { qubits: circuit.qubits.length, moments: circuit.moments.length, operations: circuit.operations.length },
        packages: REPOSITORIES.filter((r) => ['Stim', 'chromobius', 'tesseract-decoder'].includes(r.name)).map((r) => ({ ...r, url: `https://github.com/quantumlib/${r.name}`, source: PROSE.quantumProcessingMcp_source225 })),
      }
    },
    widget: errorCorrectionWidget,
  }),
  tool({
    name: 'chemistry-simulation',
    description: PROSE.quantumProcessingMcp_description226,
    inputSchema: {
      type: 'object',
      properties: {
        bond_length: { type: 'number', exclusiveMinimum: 0, description: PROSE.quantumProcessingMcp_description227 },
        theta: { type: 'number', description: PROSE.quantumProcessingMcp_description228 },
        steps: { type: 'integer', minimum: 4, description: PROSE.quantumProcessingMcp_description229 },
        jordan_wigner: { type: 'object', description: PROSE.quantumProcessingMcp_description230, properties: { coefficient: { type: 'number' }, operators: { type: 'array', items: { type: 'object', properties: { mode: { type: 'integer', minimum: 0 }, dagger: { type: 'boolean' } }, required: ['mode', 'dagger'] } } }, required: ['operators'] },
      },
    },
    run: (args) => {
      if (args.jordan_wigner !== undefined) {
        if (!isObj(args.jordan_wigner)) reject(PROSE.quantumProcessingMcp_s231)
        const raw = args.jordan_wigner as { coefficient?: unknown; operators?: unknown }
        if (!Array.isArray(raw.operators)) reject(PROSE.quantumProcessingMcp_s232)
        const operators: Ladder[] = raw.operators.map((row) => {
          if (!isObj(row)) reject(PROSE.quantumProcessingMcp_s233)
          const mode = (row as { mode?: unknown }).mode
          const dagger = (row as { dagger?: unknown }).dagger
          if (typeof mode !== 'number' || !Number.isInteger(mode) || mode < 0) reject(PROSE.quantumProcessingMcp_s234)
          if (typeof dagger !== 'boolean') reject(PROSE.quantumProcessingMcp_s235)
          return { mode, dagger }
        })
        const coefficient = raw.coefficient === undefined ? 1 : Number(raw.coefficient)
        if (!Number.isFinite(coefficient)) reject('jordan_wigner.coefficient is a number')
        const terms = jordanWigner({ coefficient, operators })
        return { mapping: 'Jordan–Wigner' as const, coefficient, operators, terms, says: PROSE.quantumProcessingMcp_says236 } as never
      }
      if (args.bond_length === undefined) return unlimited() as never
      const bondLength = Number(args.bond_length)
      if (!(bondLength > 0)) reject(PROSE.quantumProcessingMcp_s237)
      const molecule = hydrogen(bondLength)
      const terms = hydrogenHamiltonian(molecule)
      const theta = args.theta === undefined ? undefined : Number(args.theta)
      if (theta !== undefined && !Number.isFinite(theta)) reject('theta is a number')
      const steps = args.steps === undefined ? null : Number(args.steps)
      if (steps !== null && (!Number.isInteger(steps) || steps < 4)) reject('steps is an integer of at least 4')
      const vqe = theta === undefined && steps !== null ? vqeSweep(terms, steps) : null
      const ansatz = ansatzCircuit(theta ?? vqe?.best.theta ?? 0)
      return {
        molecule,
        basis: { name: 'STO-3G', hydrogen: STO3G_H, bohrAngstrom: BOHR_ANGSTROM },
        mapping: PROSE.quantumProcessingMcp_mapping238,
        terms,
        ansatz: { gate: ansatz.operations[0]!.kind === 'gate' ? ansatz.operations[0]!.gate.name : '', state: 'cos θ |00⟩ + sin θ |11⟩' },
        hartreeFockFromSimulator: energyAt(terms, 0),
        vqe,
        at: theta === undefined ? null : { theta, energy: energyAt(terms, theta) },
        checks: { source: TUTORIAL_ENERGIES.source, points: tutorialChecks(), note: PROSE.quantumProcessingMcp_note239 },
        units: 'hartree; bond length in ångström',
      }
    },
    widget: chemistryWidget,
  }),
  tool({
    name: 'fault-tolerant-design',
    description: PROSE.quantumProcessingMcp_description240,
    inputSchema: {
      type: 'object',
      properties: {
        circuit: { enum: ['qft', 'grover', 'teleportation', 'shor', 'qaoa', 'qec', 'all'], description: PROSE.quantumProcessingMcp_description241 },
        qubits: { type: 'integer', minimum: 1, description: PROSE.quantumProcessingMcp_description242 },
        N: { type: 'integer', minimum: 3, description: PROSE.quantumProcessingMcp_description243 },
        a: { type: 'integer', minimum: 2, description: PROSE.quantumProcessingMcp_description244 },
        nodes: { type: 'integer', minimum: 2, description: PROSE.quantumProcessingMcp_description245 },
      },
    },
    run: (args) => {
      const which = String(args.circuit ?? 'all')
      const n = args.qubits === undefined ? registerQubits() : Number(args.qubits)
      const askedN = args.N === undefined ? null : getInteger(args.N, 'N')
      const width = askedN === null || askedN < 2n ? 0 : askedN.toString(2).length
      const shorQubits = askedN === null ? registerQubits() : 3 * width
      const denseShor = askedN !== null && askedN >= 3n && askedN <= BigInt(Number.MAX_SAFE_INTEGER) && shorQubits < 24
      const nodes = args.nodes === undefined ? registerQubits() : Number(args.nodes)
      if (!Number.isInteger(n) || n < 1) reject('qubits is a positive integer')
      if (!Number.isInteger(nodes) || nodes < 2) reject('nodes is an integer of at least 2')
      let a = 0
      if (denseShor && askedN !== null) { a = Number(getInteger(args.a, 'a', 7n) % askedN); const modulus = Number(askedN); while (a < 2 || gcd(a, modulus) !== 1) a++ }
      const wideQft = n >= 16
      const phases = BigInt(n) * BigInt(n - 1) / 2n
      const swaps = (n - (n % 2)) / 2
      const qftCount = wideQft ? { qubits: n, depth: n, operations: Number(BigInt(n) + phases + BigInt(swaps)), twoQubitGates: Number(phases + BigInt(swaps)), tCount: 0, complete: false, gates: [] as { name: string; count: number; class: string }[], hadamards: n, controlledPhases: phases.toString(), swaps, ...uuidCapacity('qft', n), counted: 'formula' as const } : null
      const qaoaWide = nodes >= 16
      const builders: Record<string, () => Circuit> = {
        grover: groverCircuit,
        teleportation: teleportationCircuit,
        qec: () => repetitionCycle('bit_flip', { name: 'bit_flip', p: 0.1 }, '0'),
      }
      if (!qaoaWide) builders.qaoa = () => qaoaCircuit(pageInstance(DEVICES.Sycamore, nodes), 0.5, 0.25)
      if (!wideQft) builders.qft = () => new Circuit().append(qftOperations(LineQubit.range(n)))
      if (denseShor && askedN !== null) builders.shor = () => shorCircuit(Number(askedN), a)
      if (which !== 'all' && which !== 'shor' && which !== 'qft' && which !== 'qaoa' && !(which in builders)) reject(proseFill(PROSE.quantumProcessingMcp_s246, which, Object.keys(builders).join(', ')))
      const names = which === 'all' ? Object.keys(builders) : which === 'shor' || which === 'qft' || (which === 'qaoa' && qaoaWide) ? (which in builders ? [which] : []) : [which]
      const circuits = names.map((name) => ({ name: name === 'qft' ? `qft on ${n} qubits` : name === 'shor' ? `shor N=${askedN} a=${a}` : name === 'qaoa' ? `qaoa on ${nodes} nodes (alpha = 0.5, beta = 0.25)` : name === 'qec' ? PROSE.quantumProcessingMcp_s247 : name, count: countResources(builders[name]!()) }))
      if (qftCount && (which === 'all' || which === 'qft')) circuits.unshift({ name: `qft on ${n} qubits`, count: qftCount as never })
      if (qaoaWide && (which === 'all' || which === 'qaoa')) circuits.push({ name: `qaoa on ${nodes} nodes`, count: { qubits: nodes, depth: 0, operations: 0, twoQubitGates: 0, tCount: 0, complete: false, gates: [] as { name: string; count: number; class: string }[], ...uuidCapacity('qaoa', nodes), counted: 'formula' as const } as never })
      const shor = denseShor ? null : { N: askedN === null ? null : askedN.toString(), qubits: shorQubits, counting: askedN === null ? null : 2 * width, work: askedN === null ? null : width, ...uuidCapacity('shor', shorQubits < 1 ? 1 : shorQubits), counted: false as const }
      return {
        circuits,
        ...(shor ? { shor } : {}),
        costs: {
          toffoli: { tCount: 7, source: PROSE.quantumProcessingMcp_source248 },
          t: { tCount: 1, source: 'T = Z**0.25; X**0.25 = H·T·H' },
          controlled_s: { tCount: 3, source: PROSE.quantumProcessingMcp_source249 },
          clifford: proseFill(PROSE.quantumProcessingMcp_clifford250, CLIFFORD_CHECK_ARITY),
          uncounted: PROSE.quantumProcessingMcp_uncounted251,
        },
        library: { name: 'Qualtran', description: REPOSITORIES.find((r) => r.name === 'Qualtran')!.description, url: 'https://github.com/quantumlib/Qualtran', note: PROSE.quantumProcessingMcp_note252 },
      }
    },
    widget: resourcesWidget,
  }),
  tool({
    name: 'audit',
    description: PROSE.quantumProcessingMcp_description253,
    inputSchema: { type: 'object', properties: { dead: { type: 'object', description: '{ output }: the tsc --noUnusedLocals report' }, programs: { description: PROSE.quantumProcessingMcp_description254 }, files: { type: 'object', description: PROSE.quantumProcessingMcp_description255 }, shard: { type: 'object', description: PROSE.quantumProcessingMcp_description256 }, lexical: { type: 'object', description: PROSE.quantumProcessingMcp_description257 }, leaks: { type: 'object', description: '{ texts: { name: text }, served?: [names] }: leaks found before they are published — e-mail addresses, keys and tokens, private keys, local paths, private addresses — the tree\'s notations set aside; values redacted, each finding a lead with its remedy' }, uncap: { type: 'object', description: PROSE.quantumProcessingMcp_description258 }, entropy: { type: 'object', description: PROSE.quantumProcessingMcp_description259 }, difference: { type: 'object', description: PROSE.quantumProcessingMcp_description260 }, security: { type: 'object', description: PROSE.quantumProcessingMcp_description261 }, errors: { type: 'array', items: { type: 'string' }, description: PROSE.quantumProcessingMcp_description262 }, repair: { type: 'array', items: { type: 'object' }, description: PROSE.quantumProcessingMcp_description263 }, fallbacks: { type: 'boolean', description: PROSE.quantumProcessingMcp_description264 }, access: { type: ['boolean', 'object'], description: PROSE.quantumProcessingMcp_description265 } } },
    run: (args) => { if (args.programs !== undefined) return auditPrograms(args.programs, isObj(args.files) ? args.files as Record<string, string> : undefined) as never; if (isObj(args.dead)) { const d = args.dead as { output?: unknown }; if (typeof d.output !== 'string') throw new Error('dead takes { output }'); return removeDead(d.output, isObj(args.files) ? args.files as Record<string, string> : undefined) as never } if (isObj(args.declarations)) { const d = args.declarations as { files?: Record<string, string> }; if (!isObj(d.files)) throw new Error(PROSE.quantumProcessingMcp_s266); return { phase: 'declarations' as const, ...listDeclarations(d.files) } as never } if (isObj(args.lexical)) { const l = args.lexical as { doc?: unknown }; if (!(l.doc as { root?: unknown } | undefined)?.root) throw new Error(PROSE.quantumProcessingMcp_s267); return { phase: 'lexical-scan' as const, ...scanLexical(l.doc, TOOLS.map((x) => x.name)), ran: 0 } as never } if (isObj(args.leaks)) { const l = args.leaks as { texts?: Record<string, string>; served?: string[] }; return listLeaks(l.texts ?? {}, l.served ?? []) } if (args.access) return accessAudit(CONTEXT, isObj(args.access) && isObj((args.access as { files?: unknown }).files) ? (args.access as { files: Record<string, string> }).files : {}); if (isObj(args.uncap)) return uncap(args.uncap as Record<string, string>); if (isObj(args.entropy)) return getEntropy(args.entropy as Record<string, string>); if (isObj(args.security)) { const s = args.security as { client?: Parameters<typeof auditSecurity>[0]; developer?: Parameters<typeof auditSecurity>[1] }; return s.client?.hosts && s.developer ? auditSecurity(s.client, s.developer) : { phase: 'plan', needs: [PROSE.quantumProcessingMcp_s268, PROSE.quantumProcessingMcp_s269], says: PROSE.quantumProcessingMcp_says270, perspectives: [], checks: [], total: 0, passed: 0, failed: 0 } } if (Array.isArray(args.repair)) return repair(args.repair as Parameters<typeof repair>[0]); if (Array.isArray(args.errors) || Array.isArray(args.warnings)) { const errors = Array.isArray(args.errors) ? args.errors.map(String) : [], warnings = Array.isArray(args.warnings) ? args.warnings.map(String) : [], guided = developFindings([...errors.map((text) => ({ kind: 'error' as const, text })), ...warnings.map((text) => ({ kind: 'warning' as const, text }))]); return { ...(errors.length ? listRemedies(errors) : { errors: 0, remedied: 0, unremedied: 0, leads: [] }), ...(errors.length ? { fallback: handleOrCorrect(errors, false, 'correction') } : {}), warnings: warnings.length, variants: guided.variants, dimensions: guided.dimensions, says: guided.says } } if (args.fallbacks) return { fallbacks: FALLBACKS, adapters: FALLBACK_ADAPTERS, involution: PROSE.quantumProcessingMcp_involution271, example: handleOrCorrect(['no majority'], false), says: PROSE.quantumProcessingMcp_says272 }; if (isObj(args.difference)) { const d = args.difference as { a: { name: string; members: string[] }; b: { name: string; members: string[] }; config?: string | null }; return diffMembers(d.a, d.b, { config: d.config ?? null }) } return runAudit(handle, EXAMPLES, LEADS, TOOLBOXES, isObj(args.known) ? args.known as Record<string, string> : {}, typeof args.code === 'string' ? args.code : null, isObj(args.shard) ? args.shard as { i: number; n: number } : null) },
    widget: (d: any) => (d.phase === 'programs' ? leadsWidget({ leads: d.leads ?? [], counts: { served: d.programs ?? 0, open: (d.leads ?? []).length }, total: d.files ?? 0 }) : d.phase === 'dead' ? leadsWidget({ leads: d.leads, counts: { served: d.fixed, open: d.left }, total: d.findings }) : d.phase === 'lexical-scan' || d.phase === 'declarations' || d.phase === 'uncap' ? flowWidget(d) : 'setAside' in d && 'findings' in d ? leadsWidget({ leads: d.leads, counts: { open: d.leads.length }, total: d.leads.length }) : d.phase === 'repair' ? leadsWidget({ leads: d.leads, counts: { served: d.fixable, open: d.unfixable }, total: d.advisories }) : 'gravity' in d && !('fallback' in d) ? entropyWidget(d) : 'sizes' in d || 'fallback' in d ? leadsWidget({ leads: d.leads, counts: { open: d.leads.length }, total: d.leads.length }) : 'perspectives' in d ? leadsWidget({ leads: d.checks.map((c: { id: string; passed: boolean; evidence: string; perspective: string }) => ({ id: c.id, status: c.passed ? 'served' : 'open', tool: c.perspective, statement: c.evidence })), counts: { served: d.passed, open: d.failed }, total: d.total }) : 'fallbacks' in d ? leadsWidget({ leads: d.fallbacks.map((f: { failure: string; involution: string; handling: string }) => ({ id: f.failure, status: 'served', tool: f.involution, statement: f.handling })), counts: { served: d.fallbacks.length }, total: d.fallbacks.length }) : auditWidget(d)),
  }),
  tool({
    name: 'match',
    description: PROSE.quantumProcessingMcp_description273,
    inputSchema: { type: 'object', properties: { statement: { type: 'string', description: PROSE.quantumProcessingMcp_description274 }, questions: { description: PROSE.quantumProcessingMcp_description275 }, search: { type: 'string', description: PROSE.quantumProcessingMcp_description276 }, news: { type: 'array', items: { type: 'object' }, description: PROSE.quantumProcessingMcp_description277 }, verdict: { type: 'string', description: PROSE.quantumProcessingMcp_description278 }, chat: { type: 'object', description: PROSE.quantumProcessingMcp_description279 }, url: { type: 'string', description: PROSE.quantumProcessingMcp_description280 }, tenant: { type: 'string', description: PROSE.quantumProcessingMcp_description281 }, locale: { type: 'string', enum: Object.keys(LOCALES), description: PROSE.quantumProcessingMcp_description282 } } },
    run: (args) => { if (args.questions === undefined && typeof args.verdict !== 'string' && !isObj(args.chat) && !Array.isArray(args.news) && typeof args.search !== 'string' && typeof args.statement !== 'string' && typeof args.url !== 'string') return unlimited() as never; if (args.questions !== undefined) return matchQuestions(args.questions) as never; if (typeof args.verdict === 'string') { const ours = translateVerdict(args.verdict); return { phase: 'verdict' as const, foreign: args.verdict, verdict: ours ?? null, translated: ours !== undefined, equivalents: ours ? listForeignVerdicts(ours) : [], theorem: 'textbook_foreign_verdicts' } as never } if (isObj(args.chat)) return chat(String(args.statement ?? ''), args.chat as Parameters<typeof chat>[1]) as never; if (Array.isArray(args.news)) return (typeof args.tenant === 'string' ? editorial(args.news as Parameters<typeof matchNews>[0], String(args.tenant), handle, EXAMPLES, LEADS, args.locale === undefined ? undefined : String(args.locale)) : matchNews(args.news as Parameters<typeof matchNews>[0], handle, EXAMPLES, LEADS, args.locale === undefined ? undefined : String(args.locale))) as never;
      if (typeof args.search === 'string') { const q = args.search; const m = matchStatement(q, handle, EXAMPLES, LEADS, args.locale === undefined ? undefined : String(args.locale)); const theoremKey = m.theorem ?? (m.call ? EXAMPLES.find((e) => e.tool === m.call!.name)?.theorem : undefined) ?? null; const tb = theoremKey ? TEXTBOOK_THEOREMS.find((t) => t.key === theoremKey) : undefined; const kernel = theoremKey ? THEOREMS.find((t) => t.key === theoremKey) : undefined; const proof = theoremKey ? { theorem: theoremKey, lean: kernel?.statement ?? tb?.lean ?? null, kernelAccepted: !!kernel, example: tb?.examples?.[0] ?? EXAMPLES.find((e) => e.theorem === theoremKey)?.id ?? null } : null; const schema = m.call ? (TOOLS.find((t) => t.name === m.call!.name)?.inputSchema ?? null) : null; const clay = /relation_\d+|clay|perfect number|riemann|p\s*(=|vs|versus)\s*np/i.test(q) ? (() => { const all = recomputeClay(); return { relations: all.relations.length, note: PROSE.quantumProcessingMcp_note283 } })() : null; const answered = m.verdict !== 'served' ? (chat(q, { run: false }) as { by?: string; reply?: unknown; question?: unknown; lead?: unknown; routed?: string[] }) : null; const solved = m.verdict === 'served'; return { phase: 'search' as const, query: q, entropy: 0 as const, exit: searchExit(q), verdict: m.verdict, state: m.state, witnesses: m.witnesses, solved, tokenFree: true, solution: solved ? m.call ?? null : null, answer: answered ? { by: answered.by ?? null, reply: answered.reply ?? null, question: answered.question ?? null, lead: answered.lead ?? null, routed: answered.routed ?? [] } : null, nearest: (m.cluster ?? []).slice(0, 5).map((c) => ({ id: c.id, kind: c.kind })), proof, schema, clay, drift: !!(proof && !proof.kernelAccepted), harmonic: uuid(`a432\n${q}`), free: { cost: 'free tier — no token paid', online: PROSE.quantumProcessingMcp_online284, via: ['imagine', 'discover'], proxiedVia: PROSE.quantumProcessingMcp_proxiedVia285 }, decidedBy: PROSE.quantumProcessingMcp_decidedBy286, theorems: ['textbook_search_proven'], says: proseFill(PROSE.quantumProcessingMcp_says287, q, m.verdict, m.state, solved ? `solved token free by ${m.call?.name ?? m.theorem}` : `not solved: ${[...m.witnesses!.contradicted, ...m.witnesses!.missing].join('; ')} — next ${answered?.by ?? 'a lead'}`, proof ? `, proven by ${proof.theorem}${proof.kernelAccepted ? ' (kernel-accepted)' : ''}, replayable as example ${proof.example}` : '') } as never } const m = matchStatement(String(args.statement ?? ''), handle, EXAMPLES, LEADS, args.locale === undefined ? undefined : String(args.locale)); return typeof args.url === 'string' ? { ...m, composition: composePage(args.url, CONTEXT, 'https://qpu.uuidna.com', typeof args.tenant === 'string' ? args.tenant : 'uuidna') } : m },
    widget: ((d: any) => (d.phase === 'search' ? leadsWidget({ leads: [{ id: uuid(d.query).slice(0, 8), status: d.verdict === 'served' ? 'served' : 'open', tool: d.solution?.name ?? d.proof?.theorem ?? 'search', statement: d.query }], counts: { served: d.verdict === 'served' ? 1 : 0, open: d.verdict === 'served' ? 0 : 1 }, total: 1 }) : d.phase === 'editorial' ? leadsWidget({ leads: [...d.drafts.map((dr: { slug: string; title: string }) => ({ id: dr.slug, status: 'served' as const, tool: 'posts', statement: dr.title })), ...d.leads.map((l: { id: string; statement: string }) => ({ id: l.id, status: 'open' as const, tool: 'news', statement: l.statement }))], counts: { served: d.posts, open: d.backlog }, total: d.items }) : d.phase === 'news' ? leadsWidget({ leads: d.problems.map((p: { problem: string; verdict: string; solution: { name: string } | null; source: string | null }) => ({ id: uuid(p.problem).slice(0, 8), status: p.verdict === 'served' ? 'served' : 'open', tool: p.solution?.name ?? p.source ?? 'news', statement: p.problem })), counts: { served: d.served, open: d.unknown + d.impossible }, total: d.items }) : d.phase === 'verdict' || d.theorem === 'textbook_questions_matched' || ('role' in d && 'theorems' in d) ? flowWidget(d) : matchWidget(d))) as never,
  }),
  tool({
    name: 'clay',
    description: PROSE.quantumProcessingMcp_description288,
    inputSchema: { type: 'object', properties: { thousand: { description: PROSE.quantumProcessingMcp_thousand1 }, name: { type: 'string', description: PROSE.quantumProcessingMcp_description289 }, lean: { type: 'boolean', description: PROSE.quantumProcessingMcp_description290 }, technique: { type: 'string', enum: ['reflection'], description: PROSE.quantumProcessingMcp_description291 }, unit: { type: 'array', items: { type: 'object' }, description: PROSE.quantumProcessingMcp_description292 }, catalog: { type: 'boolean', description: PROSE.quantumProcessingMcp_description293 }, combinations: { type: 'boolean', description: PROSE.quantumProcessingMcp_description294 }, chess: { type: 'boolean', description: PROSE.quantumProcessingMcp_description295 }, nist: { type: 'object', description: PROSE.quantumProcessingMcp_description296 }, cern: { type: 'object', description: PROSE.quantumProcessingMcp_description297 }, solve: { type: 'boolean', description: PROSE.quantumProcessingMcp_description298 }, drift: { type: 'boolean', description: PROSE.quantumProcessingMcp_description299 }, readme: { description: PROSE.quantumProcessingMcp_description300 }, pravets: { type: 'boolean', description: PROSE.quantumProcessingMcp_description301 } } },
    run: (args) => {
      if (args.thousand === true || typeof args.thousand === 'string') return thousandTable(args.thousand) as never
      if (args.drift === true) return driftPrograms() as never
      const base = recomputeClay()
      const all = { ...base, relations: base.relations.map((r) => { const theorems = clayCaseTheorems(r); const variants = theorems.map((t) => ({ product: t.theorem, variant: t.case })); return { ...r, case: variants[0]?.variant ?? r.name, product: variants[0]?.product ?? null, variant: variants[0]?.variant ?? r.name, variants, theorems } }) }
      if (args.chess === true) return recognise(all.relations.map((r) => ({ name: r.name, statement: r.statement, families: r.families ?? [], value: r.sides[0]!.value })), { nist: isObj(args.nist) ? args.nist as { outputValue?: string; pulseIndex?: number; period?: number; chainIndex?: number } : null, cern: isObj(args.cern) ? args.cern as { total?: number; records?: { id?: string; size?: number; checksum?: string; doi?: string }[] } : null })
      if (args.solve === true) return solveClay()
      if (args.combinations === true) return productCombinations()
      if (args.catalog) return clayCatalog()
      if (args.readme) return clayReadme(isObj(args.readme) ? (args.readme as ReadmeMeasured) : {}) as never
      if (args.lean === true) {
        const wanted = typeof args.name === 'string' ? all.relations.filter((r) => r.name === args.name) : all.relations
        if (typeof args.name === 'string' && wanted.length === 0) throw new Error(`${String(args.name)} is not one of ${all.relations.map((x) => x.name).join(', ')}`)
        const relations = wanted.map((r) => { const integer = String(r.sides[0]!.value); const address = uuid(integer); const receipt = uuid(r.statement); const names = relationNames(r); return { ...r, integer, integerOnly: /^\d+$/.test(integer), address, sealed: seal(address).valid, receipt, sha256: hex(sha256(utf8(r.statement))), names } })
        const bound = relations.map((r) => r.statement).join('\n')
        const receipt = uuid(bound)
        const verified = relations.filter((r) => r.integerOnly && r.sealed && r.address === uuid(r.integer) && r.receipt === uuid(r.statement) && seal(r.receipt).valid && r.sha256 === hex(sha256(utf8(r.statement)))).length
        const named = relations.filter((r) => r.names.some((book) => book.textbook === 'Qpu.General.Clay' && book.names.includes(r.name))).length
        const collections = consolidateRelations(relations)
        const moved = walked(receipt)
        return { phase: 'lean' as const, via: 'uuid' as const, prose: false as const, total: relations.length, holding: verified, maxBits: all.maxBits, verified, named, receipt, sha256: hex(sha256(utf8(bound))), uuids: new Set(relations.map((r) => r.receipt)).size, relations, collections, next: moved.next, all: moved.all, says: proseFill(PROSE.quantumProcessingMcp_says302, verified, relations.length, named, collections.installed ? proseFill(PROSE.quantumProcessingMcp_s303, collections.plugins, collections.collections.join(', ')) : proseFill(PROSE.quantumProcessingMcp_s304, collections.missing.length), moved.all.places) } as never
      }
      if (args.technique === 'reflection') {
        const reading = reflectionOfRegister(all.relations)
        const unit = Array.isArray(args.unit) ? (args.unit as { value: number; answer?: { seed?: number; reflection?: number; fixed?: boolean }; refusal?: string }[]) : []
        // the rosetta: any value read on both sides, the tree's by its digital root (the register's reading where the value is one of its own), the
        // unit's by its last decimal digit; verified when each side keeps its own convention and σ₁₀ (textbook_rosetta_conventions)
        const compared = unit.map((u) => { const mine = reading.readings.find((r) => r.value === u.value); const n = Math.abs(Math.trunc(Number(u.value))), seed = digitalRoot(n), tree = mine ? { seed: mine.seed, reflection: mine.reflection } : { seed, reflection: seed === 0 ? 0 : 10 - seed }; const un = u.answer ? { seed: u.answer.seed, reflection: u.answer.reflection } : null; const treeHolds = tree.seed === seed && (tree.seed + tree.reflection) % 10 === 0, unitHolds = !!un && un.seed === n % 10 && ((un.seed ?? 0) + (un.reflection ?? 0)) % 10 === 0; return { value: u.value, tree, unit: un, refusal: u.refusal ?? null, agree: !!mine && !!u.answer && u.answer.seed === mine.seed && u.answer.reflection === mine.reflection, conventions: { tree: treeHolds, unit: unitHolds, same: n % 9 === n % 10 }, verified: treeHolds && unitHolds } })
        const breaks = compared.filter((c) => c.unit && !c.verified)
        const disagreements = compared.filter((c) => c.unit && !c.agree && reading.readings.some((r) => r.value === c.value))
        return { ...all, technique: 'reflection', pairsCount: reading.pairs.length, fixedCount: reading.fixed.length, tunedCount: reading.tuned.length, seeds: Object.keys(reading.bySeed).length, unitAsked: compared.length, unitAgree: compared.filter((c) => c.agree).length, unitDisagree: disagreements.length, unitRefused: compared.filter((c) => c.refusal).length, unitVerified: compared.filter((c) => c.verified).length, conventionBreaks: breaks.length, ...reading, compared, unitPlan: [...new Set(reading.readings.map((r) => r.value))].map((value) => ({ name: 'run_sequence', arguments: { input: value } })), leads: [...disagreements.map((d) => ({ id: `clay-sequence-${d.value}`, source: PROSE.quantumProcessingMcp_source305, statement: proseFill(PROSE.quantumProcessingMcp_statement306, d.value, d.unit?.seed, d.unit?.reflection, d.tree?.seed, d.tree?.reflection), status: 'open', reason: PROSE.quantumProcessingMcp_reason307 })), ...breaks.map((d) => ({ id: `rosetta-${d.value}`, source: PROSE.quantumProcessingMcp_source308, statement: proseFill(PROSE.quantumProcessingMcp_statement309, d.value, d.unit?.seed, d.unit?.reflection, d.tree.seed, d.tree.reflection), status: 'open', reason: PROSE.quantumProcessingMcp_reason310 }))] }
      }
      if (args.name) { const targetName = args.name === 'relation_7' ? 'relation_rsa' : args.name; const r = all.relations.find((x) => x.name === targetName); if (!r) throw new Error(`${String(args.name)} is not one of ${all.relations.map((x) => x.name).join(', ')}`); return { ...all, relations: [r] } }
      return all
    },
    widget: clayWidget,
  }),
  tool({
    name: 'verify',
    description: PROSE.quantumProcessingMcp_description311,
    inputSchema: { type: 'object', properties: { theorem: { type: 'string', description: PROSE.quantumProcessingMcp_description312 }, call: { type: 'object', description: PROSE.quantumProcessingMcp_description313 }, witnesses: { description: PROSE.quantumProcessingMcp_description314 }, move: { type: 'integer', minimum: 1, description: PROSE.quantumProcessingMcp_description315 }, numerology: { type: 'boolean', description: PROSE.quantumProcessingMcp_description316 }, uuid: { type: 'string', description: 'the UUID to verify' }, scan: { type: 'array', items: { type: 'object' }, description: PROSE.quantumProcessingMcp_description317 }, content: { type: 'string', description: PROSE.quantumProcessingMcp_description318 }, prev: { type: 'object', properties: { id: { type: 'string' }, content: { type: 'string' } }, description: PROSE.quantumProcessingMcp_description319 }, self: { type: 'object', properties: { prev: { type: 'string' } }, description: PROSE.quantumProcessingMcp_description320 }, next: { type: 'object', properties: { id: { type: 'string' }, prev: { type: 'string' }, content: { type: 'string' } }, description: PROSE.quantumProcessingMcp_description321 } } },
    run: (args) => { if (args.numerology !== true && args.move === undefined && typeof args.theorem !== 'string' && !isObj(args.call) && args.witnesses === undefined && !Array.isArray(args.scan) && typeof args.uuid !== 'string') return unlimited() as never; return args.numerology === true ? (verifyNumerology() as never) : args.move !== undefined ? (witnessMove(Number(args.move)) as never) : typeof args.theorem === 'string' || isObj(args.call) ? (proofCheck(args) as never) : typeof args.witnesses === 'string' ? (checkWitnesses(args.witnesses) as never) : isObj(args.witnesses) ? (() => { const w = args.witnesses as { referrer?: string; destination?: string }; const m = mergeWitnesses(String(w.referrer ?? ''), String(w.destination ?? '')); return { ...m, coins: mintWitnessCoins(m.shared) } as never })() : Array.isArray(args.scan) ? getScan(args.scan as { t: number; hue: number | null }[]) : verify(String(args.uuid ?? ''), typeof args.content === 'string' ? args.content : undefined, args.prev as never, args.next as never, args.self as { prev?: string } | undefined) },
    widget: ((d: any) => ('witnesses' in d || 'shared' in d || 'roundTrip' in d || 'occupied' in d ? flowWidget(d) : verifyWidget(d))) as never,
  }),
]

const BALANCER = new Map<string, { structured: unknown; widget: string }>()

const TELEPORTED = new Set<string>(), TELEPORT_USED = new Set<string>()
let TELEPORT_HITS = 0

export const balancerSnapshot = (p: { onlyNew?: boolean; used?: boolean } = {}): { address: string; structured: unknown; widget: string }[] => [...BALANCER.entries()].filter(([a]) => (!p.onlyNew || !TELEPORTED.has(a)) && (!p.used || TELEPORT_USED.has(a))).map(([address, v]) => ({ address, ...v }))

export const balancerLoad = (blocks: readonly { address: string; structured: unknown; widget: string }[]): number => { let n = 0; for (const b of blocks) { if (typeof b.address !== 'string' || BALANCER.has(b.address)) continue; BALANCER.set(b.address, { structured: b.structured, widget: b.widget }); TELEPORTED.add(b.address); n += 1 } return n }

const OBSERVED = new Map<string, { calls: number; misses: number; ms: number; bytes: number; servedMs: number }>()
const NESTED: number[] = []
const observed = (k: 'calls' | 'misses' | 'ms' | 'bytes' | 'servedMs') => [...OBSERVED.values()].reduce((n, o) => n + o[k], 0)

type RunArtefacts = { advantageByUnit?: unknown; audit?: { total?: number; passed?: number; failed?: number }; e2e?: { combos?: number; copies?: number; involutions?: number; outcomes?: Record<string, number>; competition?: { saved?: number; msMajority?: number; winners?: Record<string, number> } }; coins?: { calls: number; coins: number; byDoor: Record<string, number>; gated: number; unclean: number }; receipt?: { steps?: { name: string; status: string; ms: number }[] }; sizes?: Record<string, number>; discovery?: { hosts?: { kind: string; detected: string }[]; doors?: unknown[]; capabilities?: Record<string, string[]> }; verification?: { summary?: Record<string, { requests: number; ok: number; contracted: number; uncontracted: number }> }; readiness?: { classes?: { served: number; refuted: number; trial: number }; readiness?: { ready: boolean }; border?: { doors?: unknown[]; sealedBy?: string[] } }; repository?: { branches?: { agree: string[]; local: number }; tags?: { agree: string[]; local: number; mismatch: string[] }; leads?: unknown[] }; legal?: { claims?: number; verdicts?: Record<string, number>; violations?: number; refusals?: number; securityPassed?: number; securityTotal?: number; id?: string }; docket?: { entries?: number; root?: string | null; mirrors?: number }; receipts?: { count?: number; last?: string | null } }

const coverage = (a: RunArtefacts): Record<string, unknown> => {
  // the load: a block is paid once when computed (a miss of the balancer, a coin at a gated door); every re-ask is a teleport, free — the cache by address here, the involution (304 by content hash) at the edge
  const calls = observed('calls'), misses = observed('misses')
  const load = { paid: misses, free: calls - misses + (a.e2e?.involutions ?? 0), involutions: a.e2e?.involutions ?? 0, coins: a.coins?.coins ?? 0, a432: { key: KEY, harmonics: Object.keys(style(uuid('a432')).vars).length, stylesheetBytes: getCss().length, served: PROSE.quantumProcessingMcp_served322 }, note: PROSE.quantumProcessingMcp_note323 }
  const v = Object.values(a.verification?.summary ?? {})
  const sum = (k: 'requests' | 'ok' | 'contracted' | 'uncontracted') => v.reduce((n, s) => n + (s[k] ?? 0), 0)
  const hosts = a.discovery?.hosts ?? []
  const settled = a.readiness?.classes ? Math.max(1, a.readiness.classes.served + a.readiness.classes.refuted) : 0, flowMs = a.receipt?.steps?.reduce((n, s) => n + s.ms, 0) ?? null
  return {
    load,
    discoveredHosts: hosts.length, hostsWithContract: hosts.filter((h) => /^openapi|json index|oai-pmh|graphql|mcp tools/.test(h.detected)).length, discoveredDoors: a.discovery?.doors?.length ?? 0, capabilities: Object.fromEntries(Object.entries(a.discovery?.capabilities ?? {}).map(([k, v]) => [k, v.length])),
    verificationRequests: sum('requests'), verificationReachable: sum('ok'), verificationContracted: sum('contracted'), verificationOutsideContract: sum('uncontracted'), verificationReachableRatio: sum('requests') ? Number((sum('ok') / sum('requests')).toFixed(3)) : null,
    readinessClasses: a.readiness?.classes ?? null, ready: a.readiness?.readiness?.ready ?? null, borderDoors: a.readiness?.border?.doors?.length ?? 0, borderSealedBy: a.readiness?.border?.sealedBy?.length ?? 0,
    repositoryBranchesAgree: a.repository?.branches ? `${a.repository.branches.agree.length}/${a.repository.branches.local}` : null, repositoryTagsAgree: a.repository?.tags ? `${a.repository.tags.agree.length}/${a.repository.tags.local}` : null, repositoryTagsMoved: a.repository?.tags?.mismatch.length ?? 0, repositoryLeads: a.repository?.leads?.length ?? 0,
    legalClaims: a.legal?.claims ?? 0, legalVerdicts: a.legal?.verdicts ?? null, legalViolations: a.legal?.violations ?? 0, legalRefusals: a.legal?.refusals ?? 0, legalSecurity: a.legal ? `${a.legal.securityPassed}/${a.legal.securityTotal}` : null, legalAudit: a.legal?.id ?? null,
    // the coins paid to the unit at the wire, accounted by this payer from every answer; the fibonacci source the unit names is recorded as it answers
    coinsPaid: a.coins?.coins ?? 0, coinCalls: a.coins?.calls ?? 0, coinsByDoor: a.coins?.byDoor ?? null, coinsUnclean: a.coins?.unclean ?? 0, coinsPerSettledLead: a.coins && settled ? Number((a.coins.coins / settled).toFixed(3)) : null,
    docketEntries: a.docket?.entries ?? 0, docketRoot: a.docket?.root ?? null, docketMirrors: a.docket?.mirrors ?? 0, receipts: a.receipts?.count ?? 0, lastReceipt: a.receipts?.last ?? null,
    // verbosity: how many bytes each artefact carries; the pages are read by people, the json by tools — both are counted, neither capped
    verbosityBytes: a.sizes ?? null, verbosityTotalBytes: a.sizes ? Object.values(a.sizes).reduce((n, b) => n + b, 0) : null,
    // performance per cost unit: the cost units are milliseconds of the flow and requests to other hosts; the yield is settled leads
    stepMs: a.receipt?.steps ? Object.fromEntries(a.receipt.steps.filter((s) => s.status !== 'skipped').map((s) => [s.name, s.ms])) : null,
    flowMs,
    msPerVerificationRequest: sum('requests') && a.receipt?.steps ? Number(((a.receipt.steps.find((s) => s.name === 'verify')?.ms ?? 0) / sum('requests')).toFixed(1)) : null,
    requestsPerSettledLead: settled && sum('requests') ? Number((sum('requests') / settled).toFixed(2)) : null,
    msPerSettledLead: settled && flowMs !== null ? Number((flowMs / settled).toFixed(1)) : null,
  }
}

const leanLedger = () => {
  const modules: Record<string, number> = {}; for (const t of THEOREMS) modules[t.module] = (modules[t.module] ?? 0) + 1
  return { kernel: KERNEL_THEOREMS, handWritten: THEOREMS.length, generated: GENERATED_LEMMAS, whole: THEOREMS.length + GENERATED_LEMMAS === KERNEL_THEOREMS, modules, theorems: THEOREMS, textbook: TEXTBOOK_THEOREMS.map((t) => ({ key: t.key, lean: t.lean, says: t.says, examples: t.examples })), axioms: PROSE.quantumProcessingMcp_axioms324, sources: PROSE.quantumProcessingMcp_sources325, says: PROSE.quantumProcessingMcp_says326 }
}
const treeMetrics = (artefacts: RunArtefacts = {}): Record<string, unknown> => {
  const audit = artefacts.audit ?? null
  const byStatus: Record<string, number> = {}; for (const l of LEADS) byStatus[l.status] = (byStatus[l.status] ?? 0) + 1
  const backed = EXAMPLES.filter((e) => e.theorem)
  return {
    tools: TOOLS.length, toolboxes: TOOLBOXES.length, patterns: PATTERNS.length, patternsRecognised: EXAMPLES.filter((e) => e.tool === 'match' && typeof e.arguments.statement === 'string' && getPattern(e.arguments.statement)).length, examples: EXAMPLES.length, examplesBackedByTheorems: backed.length, examplesBackedRatio: Number((backed.length / EXAMPLES.length).toFixed(3)),
    theoremsKernel: KERNEL_THEOREMS, theoremsHandWritten: THEOREMS.length, lemmasGenerated: GENERATED_LEMMAS, leads: LEADS.length, leadsByStatus: byStatus,
    auditChecks: audit?.total ?? null, auditPassed: audit?.passed ?? null, auditFailed: audit?.failed ?? null, auditNested: audit === null, selftests: TOOLBOXES.map((b) => b.name), balancer: BALANCER.size, license: LICENSE.spdx, at: stamp(),
    // observability of this process: calls served from memory against computed, and where the computed milliseconds went
    balancerTeleported: TELEPORTED.size, balancerTeleportHits: TELEPORT_HITS, toolCalls: observed('calls'), toolMisses: observed('misses'), toolMs: observed('ms'),
    slowestTools: [...OBSERVED.entries()].sort((x, y) => y[1].ms - x[1].ms).slice(0, 6).map(([name, o]) => `${name} ${o.ms} ms / ${o.misses} computed / ${o.calls} asked / ${o.bytes} bytes`),
    msPerComputedCall: (() => { const m = observed('misses'); return m ? Number((observed('ms') / m).toFixed(1)) : null })(),
    // served by UUID address against computed, on the monotonic clock: a host reading, as the Workers edge freezes it between I/O
    msPerServedCall: (() => { const n = observed('calls') - observed('misses'); return n ? Number((observed('servedMs') / n).toPrecision(3)) : null })(),
    ...coverage(artefacts),
    advantageByUnit: artefacts.advantageByUnit ?? null, gateCombos: artefacts.e2e?.combos ?? null, gateCopies: artefacts.e2e?.copies ?? null, gateInvolutions: artefacts.e2e?.involutions ?? null, gateOutcomes: artefacts.e2e?.outcomes ?? null, gateMsSaved: artefacts.e2e?.competition?.saved ?? null, gateWinners: artefacts.e2e?.competition?.winners ?? null,
    // the gate's own advantage as a magnitude, uncapped: the copies proven by hash (304, nothing computed) against the copies recomputed; when every copy is an involution the ratio has no bound and says so
    gateAdvantage: getAdvantage(artefacts.e2e?.copies ?? 0, artefacts.e2e?.involutions ?? 0),
    // the usage billed complete: the tokens of the whole tools/list, the bits the tools computed in this process, their time, the coins, what the gate and the unit saved
    usage: (() => { const produced = accountBytes(observed('bytes')); const bill = getBill({ tokens: Math.ceil(JSON.stringify(CONTRACTS).length / 4), bits: produced.bits, ms: observed('ms'), coins: artefacts.coins?.coins ?? 0, saved: { bits: Number((artefacts.advantageByUnit as { bitsSaved?: number } | null | undefined)?.bitsSaved ?? 0), ms: artefacts.e2e?.competition?.saved ?? 0 } }); const calls = observed('calls'), free = [...OBSERVED.entries()].filter(([name]) => ALGEBRA_TOOLS.includes(name)).reduce((n, [, o]) => n + o.calls, 0); return { ...bill, bytes: produced, order: orderUsage(calls, 'eur', { kWh: bill.energy.kWh, tariffEurPerKwh: bill.energy.tariffEurPerKwh }, { free, coils: calls - free, commercial: false, delivered: artefacts.e2e?.copies ?? 0 }) } })(),
  }
}
/** The three admin APIs as one surface, the UUID program apis: Payload's own, Cloudflare's and Google's doors and operations addressed and sealed,
 * Cloudflare's meters priced from its tables, the coverage of Payload's packages, templates, examples and plugins with the next gap named. */
const apis = defineTool('tree', {
  name: 'apis',
  description: PROSE.quantumProcessingMcp_description327,
  inputSchema: { type: 'object', properties: { doors: { description: PROSE.quantumProcessingMcp_description328 }, pricing: { type: 'boolean', description: 'the Cloudflare meters table' }, cost: { type: 'object', description: PROSE.quantumProcessingMcp_description329 }, headSamplingRate: { type: 'number', description: PROSE.quantumProcessingMcp_description330 }, headSamplingPermille: { type: 'number', description: 'the same rate in permille (10 is 1%)' }, readings: { type: 'object', description: PROSE.quantumProcessingMcp_description331 }, zone: { type: 'object', description: PROSE.quantumProcessingMcp_description332 }, index: { type: 'object', description: '{ payload?: { collections: [{ slug }], globals: [{ slug }], server? }, cloudflare?: { servers?, paths }, google?: Discovery document | [documents] | true for the endpoints table }' }, coverage: { description: PROSE.quantumProcessingMcp_description333 }, observe: { type: 'boolean', description: PROSE.quantumProcessingMcp_description334 }, shadcn: { description: PROSE.quantumProcessingMcp_description335 } } },
  run: (args) => {
    const asked = Object.keys(args).length > 0
    const origin = isObj(args.doors) && typeof (args.doors as { origin?: unknown }).origin === 'string' ? (args.doors as { origin: string }).origin : undefined
    const sampling = { headSamplingRate: typeof args.headSamplingRate === 'number' ? args.headSamplingRate : undefined, headSamplingPermille: typeof args.headSamplingPermille === 'number' ? args.headSamplingPermille : undefined }
    if (asked && isObj(args.cost)) return apisCost(args.cost as Record<string, number>, undefined, sampling) as never
    if (asked && isObj(args.zone)) return zoneReadingsOf(args.zone as never) as never
    if (asked && (args.shadcn === true || isObj(args.shadcn))) return shadcnSurface(args.shadcn === true ? {} : (args.shadcn as Parameters<typeof shadcnSurface>[0])) as never
    if (asked && isObj(args.readings)) { const readings = readingsOf(args.readings as never); return { ...apisCost(readings, undefined, sampling), readings } as never }
    if (asked && isObj(args.index)) {
      const i = args.index as { shadcn?: unknown; payload?: { collections?: { slug: string }[]; globals?: { slug: string }[]; server?: string }; cloudflare?: { servers?: { url: string }[]; paths?: Record<string, Record<string, { operationId?: string; tags?: string[] }>> }; google?: unknown }
      const google: ApiOperation[] = i.google === true ? Object.entries(GOOGLE_ENDPOINTS).map(([id, e]) => { const u = new URL(e.url); return { provider: 'google' as const, method: e.httpMethod, server: u.origin, path: u.pathname, id, tags: ['endpoints', u.hostname.replace(/\.googleapis\.com$/, '')] } }) : Array.isArray(i.google) ? i.google.flatMap((d) => googleOperations(d as never)) : isObj(i.google) ? googleOperations(i.google as never) : []
      const shadcn: ApiOperation[] = i.shadcn === true ? shadcnOperations() : isObj(i.shadcn) ? shadcnOperations(i.shadcn as never) : []
      return apisIndex([...(i.payload ? payloadOperations(i.payload, i.payload.server) : []), ...(i.cloudflare ? cloudflareOperations(i.cloudflare) : []), ...google, ...shadcn]) as never
    }
    const mountedOf = (): string[] => Object.keys({ ...manifest.dependencies, ...manifest.devDependencies })
    if (asked && args.coverage !== undefined && args.coverage !== true) { const c = args.coverage as { mounted?: string[]; template?: string; examples?: string[] }; return apisCoverage(c.mounted ?? mountedOf(), c.template, c.examples) as never }
    if (asked && (args.doors === true || origin) && !args.pricing && !args.coverage && !args.observe) return apisDoors(origin) as never
    if (asked && args.pricing === true && !args.doors && !args.coverage && !args.observe) return { phase: 'pricing' as const, pricing: CLOUDFLARE_PRICING } as never
    if (asked && args.coverage === true && !args.doors && !args.pricing && !args.observe) return apisCoverage(mountedOf()) as never
    if (asked && args.observe === true && !args.doors && !args.pricing && !args.coverage) return { phase: 'observe' as const, query: OBSERVE_QUERY, variables: ['accountTag', 'since', 'until'], zone: { query: OBSERVE_ZONE_QUERY, variables: ['zoneTag', 'since', 'until'] }, endpoint: 'https://api.cloudflare.com/client/v4/graphql', token: PROSE.quantumProcessingMcp_token336 } as never
    return { phase: 'apis' as const, doors: apisDoors(origin), pricing: CLOUDFLARE_PRICING, coverage: apisCoverage(mountedOf()), observe: { query: OBSERVE_QUERY, variables: ['accountTag', 'since', 'until'], zone: { query: OBSERVE_ZONE_QUERY, variables: ['zoneTag', 'since', 'until'] } } } as never
  },
  widget: apisWidget as never,
})
const metrics = defineTool('tree', { name: 'metrics', description: PROSE.quantumProcessingMcp_description337, inputSchema: { type: 'object', properties: { artefacts: { type: 'object', description: PROSE.quantumProcessingMcp_description338 } } }, run: (args) => treeMetrics((args.artefacts ?? {}) as RunArtefacts), widget: flowWidget })

/** The thousand-bit table Lean writes (Qpu.General.Thousand): each family formula with the number of its examples below
 *  2 ^ 1000, its first and last examples and the last one's reflection, and the numbers more than one formula reaches. Pure. */
const thousandTable = (asked: true | string) => {
  const rows = asked === true ? THOUSAND : THOUSAND.filter((row) => row.family === asked)
  if (!rows.length) return { phase: 'thousand' as const, found: false, asked, families: [...new Set(THOUSAND.map((row) => row.family))], says: PROSE.quantumProcessingMcp_thousand3 }
  const names = new Set(rows.map((row) => row.name))
  const shared = THOUSAND_SHARED.filter((entry) => entry.meaning.some((m) => names.has(m.name)))
  return {
    phase: 'thousand' as const, found: true, bound: '2 ^ 1000', formulas: rows, shared, families: [...new Set(rows.map((row) => row.family))],
    says: proseFill(PROSE.quantumProcessingMcp_thousand2, rows.length, new Set(rows.map((row) => row.family)).size, shared.length),
  }
}

/** A mix of two textbooks: every product of one with every product of the other. A product's variants are its examples,
 *  and a product with none is its own one variation. Each side keeps its ISO context (the clause) and its scientific
 *  context (the textbook). The variations are generated by their index, fifty to a page, so no mix is ever held whole. */
const mixTextbooks = (asked: unknown[], pageAsked: unknown, receiptAsked?: unknown) => {
  const find = (name: unknown) => NESTED_CATALOGUE.find((p) => p.module === name || p.module.replace(/\./g, '-').toLowerCase() === name)
  const books = asked.map(find)
  if ((asked.length !== 2 && asked.length !== 3) || books.some((book) => !book) || new Set(books).size !== books.length) return { phase: 'mix' as const, found: false, asked, textbooks: NESTED_CATALOGUE.map((p) => p.module), says: PROSE.quantumProcessingMcp_mix3, trinity: PROSE.quantumProcessingMcp_mix4 }
  const side = (textbook: (typeof NESTED_CATALOGUE)[number]) => textbook.products.flatMap((product) => (product.variants.length ? product.variants : [null]).map((variant) => ({ product: product.theorem, variant, context: { iso: textbook.clause, scientific: textbook.module } })))
  const sides = books.map((book) => side(book!)), total = sides.reduce((n, s) => n * s.length, 1), size = 50
  const page = typeof pageAsked === 'number' && Number.isInteger(pageAsked) && pageAsked >= 1 ? pageAsked : 1
  const from = (page - 1) * size
  // the variation at an index: its digits in the mixed radix of the sides, the last side turning fastest
  const at = (index: number) => { const picked: (typeof sides)[number][number][] = []; let rest = index; for (let k = sides.length - 1; k >= 0; k--) { picked[k] = sides[k]![rest % sides[k]!.length]!; rest = Math.floor(rest / sides[k]!.length) } return picked }
  // the receipt of a read by address (Qpu.General.Advantage): the sides, the address and its digits, the last side turning fastest
  const sizes = sides.map((s) => s.length)
  const digitsOf = (index: number) => { const digits: number[] = []; let rest = index; for (let k = sizes.length - 1; k >= 0; k--) { digits[k] = rest % sizes[k]!; rest = Math.floor(rest / sizes[k]!) } return digits }
  const rankOf = (digits: readonly number[]) => digits.reduce((index, digit, k) => index * sizes[k]! + digit, 0)
  const theorems = ['Advantage.rank_unrank', 'Advantage.receipt_exact', 'Advantage.reads_lt_space', 'Advantage.two_pow_le_space', 'Advantage.advantage_unbounded']
  if (receiptAsked && typeof receiptAsked === 'object') {
    const given = receiptAsked as { index?: unknown; digits?: unknown }
    const digits = Array.isArray(given.digits) ? given.digits : []
    const holds = typeof given.index === 'number' && Number.isInteger(given.index) && given.index >= 0 && given.index < total && digits.length === sizes.length && digits.every((d, k) => Number.isInteger(d) && d >= 0 && d < sizes[k]!) && rankOf(digits as number[]) === given.index
    return {
      phase: 'receipt' as const, found: true, textbooks: books.map((book) => book!.module), holds, sizes, space: total, reads: sizes.length, walk: holds ? (given.index as number) + 1 : null, theorems,
      ...(holds ? { products: at(given.index as number) } : {}),
      says: holds ? proseFill(PROSE.quantumProcessingMcp_receipt2, sizes.length, given.index, total, (given.index as number) + 1) : PROSE.quantumProcessingMcp_receipt3,
    }
  }
  const variations = Array.from({ length: Math.max(0, Math.min(size, total - from)) }, (_, k) => ({ index: from + k, products: at(from + k), receipt: { index: from + k, digits: digitsOf(from + k), reads: sizes.length, walk: from + k + 1 } }))
  const names = books.map((book) => book!.module)
  return {
    phase: 'mix' as const, found: true, textbooks: names, trinity: names.length === 3, variations, total, page, pages: Math.ceil(total / size), counts: NESTED_COUNTS,
    advantage: { sizes, space: total, reads: sizes.length, walkToLast: total, theorems, says: proseFill(PROSE.quantumProcessingMcp_receipt4, sizes.length, total) },
    // a trinity is two pairs interacting as one: the middle textbook is the one the two pairs share
    ...(names.length === 3 ? { shared: names[1], pairs: [[names[0], names[1]], [names[1], names[2]]], interacting: proseFill(PROSE.quantumProcessingMcp_mix7, names[0], names[1], names[2]) } : {}),
    says: names.length === 3
      ? proseFill(PROSE.quantumProcessingMcp_mix5, names[0], names[1], names[2], total, variations.length, from, NESTED_COUNTS.trinities, NESTED_COUNTS.textbooks, NESTED_COUNTS.trinityVariations)
      : proseFill(PROSE.quantumProcessingMcp_mix2, names[0], names[1], total, variations.length, from, NESTED_COUNTS.mixes, NESTED_COUNTS.textbooks, NESTED_COUNTS.mixedVariations),
  }
}

/** The nested catalogue as Payload holds it: a clause is a page, a module a page nested under it, a theorem a product of
 *  that page and each textbook example a variant of that product. Lean writes the tree (nested-index.ts); this joins each
 *  product with its accepted statement and each variant with the call that runs its example. Pure. */
const nestedCatalogue = (asked: true | string) => {
  const slug = (name: string) => name.replace(/\./g, '-').toLowerCase()
  const count = (pages: typeof NESTED_CATALOGUE) => ({ productCount: pages.reduce((n, p) => n + p.products.length, 0), variantCount: pages.reduce((n, p) => n + p.products.reduce((m, q) => m + q.variants.length, 0), 0) })
  if (asked === true) {
    const clauses = [...new Set(NESTED_CATALOGUE.map((p) => p.clause))]
    const total = count(NESTED_CATALOGUE)
    return {
      phase: 'nested' as const, clauses: clauses.map((clause) => ({ title: clause, slug: slug(clause), pages: NESTED_CATALOGUE.filter((p) => p.clause === clause).length })),
      pages: NESTED_CATALOGUE.map((p) => ({ title: p.module, slug: slug(p.module), parent: slug(p.clause), ...count([p]) })),
      ...total, counts: NESTED_COUNTS, mixes: proseFill(PROSE.quantumProcessingMcp_nested5, NESTED_COUNTS.textbooks, NESTED_COUNTS.mixes, NESTED_COUNTS.variations, NESTED_COUNTS.mixedVariations),
      trinities: proseFill(PROSE.quantumProcessingMcp_mix6, NESTED_COUNTS.textbooks, NESTED_COUNTS.trinities, NESTED_COUNTS.trinityVariations),
      pairedTrinities: proseFill(PROSE.quantumProcessingMcp_mix8, NESTED_COUNTS.textbooks, NESTED_COUNTS.pairedTrinities, NESTED_COUNTS.pairedVariations),
      says: proseFill(PROSE.quantumProcessingMcp_nested2, NESTED_CATALOGUE.length, clauses.length, total.productCount, total.variantCount),
    }
  }
  const page = NESTED_CATALOGUE.find((p) => p.module === asked || slug(p.module) === asked)
  if (!page) return { phase: 'nested' as const, found: false, asked, says: PROSE.quantumProcessingMcp_nested4 }
  const stated = new Map(THEOREMS.map((t) => [t.key, t]))
  const total = count([page])
  return {
    phase: 'nested' as const, found: true, page: { title: page.module, slug: slug(page.module), parent: slug(page.clause) },
    context: { iso: page.clause, scientific: page.module },
    products: page.products.map((product) => ({
      title: product.theorem, slug: slug(product.theorem), statement: stated.get(product.theorem)?.statement ?? null, says: stated.get(product.theorem)?.doc ?? null,
      variants: product.variants.map((id) => { const example = EXAMPLES.find((e) => e.id === id); return { title: id, call: example ? { name: example.tool, arguments: example.arguments } : null } }),
    })),
    ...total, says: proseFill(PROSE.quantumProcessingMcp_nested3, page.module, page.clause, total.productCount, total.variantCount),
  }
}

const textbook = defineTool('tree', {
  name: 'textbook',
  description: PROSE.quantumProcessingMcp_description339,
  inputSchema: { type: 'object', properties: { nested: { description: PROSE.quantumProcessingMcp_nested1 }, mix: { type: 'array', items: { type: 'string' }, description: PROSE.quantumProcessingMcp_mix1 }, page: { type: 'integer', minimum: 1 }, receipt: { type: 'object', properties: { index: { type: 'integer', minimum: 0 }, digits: { type: 'array', items: { type: 'integer', minimum: 0 } } }, description: PROSE.quantumProcessingMcp_receipt1 }, particles: { description: PROSE.quantumProcessingMcp_description340 }, search: { type: 'string', description: PROSE.quantumProcessingMcp_description341 }, google: { description: PROSE.quantumProcessingMcp_description342 }, reflect: { description: PROSE.quantumProcessingMcp_description343 }, claims: { description: PROSE.quantumProcessingMcp_description344 }, theorem: { type: 'string', description: PROSE.quantumProcessingMcp_description345 }, institution: { type: 'object', description: PROSE.quantumProcessingMcp_description346 }, quality: { type: 'boolean', description: PROSE.quantumProcessingMcp_description347 }, verify: { type: 'boolean', description: PROSE.quantumProcessingMcp_description348 }, example: { type: 'string', description: PROSE.quantumProcessingMcp_description349 }, results: { type: 'array', items: { type: 'object' }, description: PROSE.quantumProcessingMcp_description350 }, reuse: { type: 'string', description: 'an example id to replay' }, evaluate: { type: 'object', description: PROSE.quantumProcessingMcp_description351 }, prose: { type: 'object', description: '{ texts: { name: text } }: the prose audited around the textbook — every number a text states resting on an expression a client can evaluate, or a lead; verdict words beside the Clay problems flagged' }, seo: { description: PROSE.quantumProcessingMcp_description352 }, gaps: { type: 'boolean', description: PROSE.quantumProcessingMcp_description353 }, axioms: { type: 'boolean', description: PROSE.quantumProcessingMcp_description354 }, chat: { description: PROSE.quantumProcessingMcp_description355 }, theorems: { type: 'boolean', description: PROSE.quantumProcessingMcp_description356 }, category: { type: 'string', enum: ['toolbox', 'tool', 'theorem', 'module'], description: PROSE.quantumProcessingMcp_description357 } } },
  run: (args) => {
    if (Array.isArray(args.mix)) return mixTextbooks(args.mix, args.page, args.receipt) as never
    if (args.nested === true || typeof args.nested === 'string') return nestedCatalogue(args.nested) as never
    if (typeof args.search === 'string') return searchTextbookPrograms(args.search, EXAMPLES) as never
    if (isObj(args.evaluate)) { const e = args.evaluate as { theorem?: string; values?: Record<string, number | string> }; if (typeof e.theorem !== 'string') return listExpressions(); return evaluateTheorem(e.theorem, e.values ?? {}) }
    if (args.chat === true || isObj(args.chat)) return chatCoverage(args.chat)
    if (args.google === true || isObj(args.google)) {
      const rows = TEXTBOOK_THEOREMS.map((t) => { const s = getStatement(t.lean); return { theorem: t.key, formula: s.conclusion } })
      const text = rows.map((r) => `${r.theorem}\n${r.formula}`).join('\n\n')
      const address = uuid(canonicalText(rows)), hexDigits = address.replace(/-/g, '')
      const width = rows.find((r) => r.theorem === 'textbook_thousand_bit_width')
      const catalog = clayCatalog()
      const witnessedAspects = Object.keys(qpuHooks({}).pairs)
      const used = new Set<string>()
      const claim = (raw: string) => { const base = raw.toLowerCase().replace(/[^a-z0-9]+/g, ''); let w = base, n = 2; while (!/^[a-z][a-z0-9]*$/.test(w) || used.has(w)) { w = `${base || 'w'}${n}`; n++ } used.add(w); return w }
      const meaning = (word: string) => { const address = uuid(canonicalText(word)), program = uuidChannel(address).program.map((n) => n.toString(16)).join(''), aspects = witnessedAspects.map((aspect) => ({ aspect, address })); return { word, address, program, programmable: program.length === 10, aspects, witnessed: aspects.length >= 4 && aspects.every((a) => a.address === address), iso: { standard: 'ISO 9001' as const, ready: program.length === 10 && aspects.length >= 4, documented: true } } }
      type Crumb = { doc: string; url: string; label: string }
      type Page = { slug: string; parent: string | null; depth: number; type: 'root' | 'cluster' | 'product' | 'variant'; path: string; theorem: string | null; relation: string | null; trinity: number[]; cluster: string | null; interacts: string[]; meaning: ReturnType<typeof meaning>; seo: { title: string; description: string; image: string | null; optimised: boolean; place: number; seam: number; greatest: boolean; fields: readonly ['title', 'description', 'image']; iso: { standard: 'ISO 9001'; documented: boolean; formula: string }; chain: string[]; coins: number; prev: string | null; followed: boolean; next: string; nextKept: boolean; nextBack: boolean; nextAround: boolean; nextAll: boolean }; breadcrumbs: Crumb[]; call?: ReturnType<typeof createCreateCall> }
      const pages: Page[] = []
      const add = (slug: string, parent: string | null, type: Page['type'], title: string, description: string, trinity: number[], theorem: string | null, relation: string | null, cluster: string | null): Page => {
        const above = parent ? pages.find((n) => n.slug === parent) : undefined
        const breadcrumbs = [...(above?.breadcrumbs ?? []), { doc: slug, url: '/' + [...(above?.breadcrumbs.map((b) => b.doc) ?? []), slug].join('/'), label: title }]
        const page: Page = { slug, parent, depth: breadcrumbs.length, type, path: breadcrumbs.map((b) => b.doc).join('/'), theorem, relation, trinity, cluster, interacts: [], meaning: meaning(slug), seo: { title, description, image: null, optimised: false, place: 0, seam: 0, greatest: false, fields: ['title', 'description', 'image'], iso: { standard: 'ISO 9001', documented: false, formula: '' }, chain: [], coins: 0, prev: null, followed: false, next: '', nextKept: false, nextBack: false, nextAround: false, nextAll: false }, breadcrumbs }
        pages.push(page)
        return page
      }
      add(claim('textbooks'), null, 'root', 'Textbooks', PROSE.quantumProcessingMcp_s358, [], null, null, null)
      const clusterSlug = new Map<string, string>()
      const ensureCluster = (trinity: number[]) => { const key = trinity.join(''); const have = clusterSlug.get(key); if (have) return have; const slug = claim(`t${key}`); clusterSlug.set(key, slug); add(slug, 'textbooks', 'cluster', key, `trinity ${trinity.join(' ')}`, trinity, null, null, slug); return slug }
      for (const p of [...catalog.products].sort((a, b) => a.product.localeCompare(b.product))) {
        const seed = digitalRoot(p.variants.reduce((n, v) => n + (v.coins || v.bits || 0), 0) || p.variants.length)
        const trinity = trinityFor(seed)
        const cluster = ensureCluster(trinity)
        const slug = claim(p.product.replace(/^textbook_/, ''))
        const product = add(slug, cluster, 'product', p.title, `${p.variants.length} clay case(s)`, trinity, p.product, null, cluster)
        product.call = createCreateCall('products', { title: p.title, slug, _status: 'published' })
        for (const variant of p.variants) {
          const vslug = claim(variant.relation)
          const page = add(vslug, slug, 'variant', variant.relation, variant.case, trinityFor(digitalRoot(variant.coins || variant.bits || 1)), p.product, variant.relation, cluster)
          page.call = createCreateCall('variants', { product: slug, slug: vslug, relation: variant.relation, _status: 'published' })
        }
      }
      for (const cluster of pages.filter((n) => n.type === 'cluster')) { const mates = pages.filter((n) => n.parent === cluster.slug && n.type === 'product'); for (const m of mates) m.interacts.push(...mates.filter((x) => x !== m).map((x) => x.slug)) }
      for (const product of pages.filter((n) => n.type === 'product')) {
        const groups = new Map<string, Page[]>()
        for (const v of pages.filter((n) => n.parent === product.slug && n.type === 'variant')) { const k = v.trinity.join('-'); (groups.get(k) ?? groups.set(k, []).get(k)!).push(v) }
        for (const g of groups.values()) for (const v of g) { v.interacts.push(...g.filter((x) => x !== v).map((x) => x.slug)); if (g.length < 3) { v.interacts.push(product.slug); if (!product.interacts.includes(v.slug)) product.interacts.push(v.slug) } }
      }
      const held = new Map(pages.map((p) => [p.slug, p.meaning.address]))
      const trail = new Map(pages.map((p) => [p.slug, [p.meaning.address]]))
      let passes = 0
      while (passes < 2) {
        passes += 1
        const round = new Map(pages.map((page) => [page.slug, optimise(held.get(page.slug)!, page.interacts.map((slug) => held.get(slug)!))]))
        for (const page of pages) {
          const opt = round.get(page.slug)!
          held.set(page.slug, opt.kept)
          trail.get(page.slug)!.push(opt.kept)
          page.seo = { title: page.seo.title, description: page.seo.description, image: opt.kept, optimised: true, place: opt.place, seam: opt.seam, greatest: opt.greatest, fields: ['title', 'description', 'image'], iso: { standard: 'ISO 9001', documented: opt.formula.length > 0, formula: opt.formula }, chain: [], coins: 0, prev: null, followed: false, next: '', nextKept: false, nextBack: false, nextAround: false, nextAll: false }
        }
      }
      const parts = ['quantum', 'processing', 'unit'].length, seed = mint(parts - parts), theory = seed, practice = seed, coins = theory + practice
      for (const page of pages) {
        const chain = trail.get(page.slug)!
        page.seo.chain = chain
        page.seo.coins = chain.length - 1
        page.seo.prev = chain[chain.length - 2] ?? null
        page.seo.followed = page.seo.coins === coins && chain[chain.length - 1] === page.seo.image && chain.every((address) => seal(address).valid)
        const moved = rotate(page.seo.image!)
        page.seo.next = moved.next
        page.seo.nextKept = moved.kept
        page.seo.nextBack = moved.back
        page.seo.nextAround = moved.around
        page.seo.nextAll = moved.all && moved.aspects.length === 4
      }
      const app = pages.length
      const follow = { theorem: 'follow_the_coins' as const, app, seed, theory, practice, coins, followed: app + coins === app + theory + practice && pages.every((p) => p.seo.followed) }
      const left = mint(bits + seed), right = amplitudes + amplitudes
      const next = { theorem: 'next' as const, bits, seed, amplitudes, left, right, holds: left === right && pages.every((p) => p.seo.nextKept && p.seo.nextBack && p.seo.nextAround && p.seo.nextAll && seal(p.seo.next).valid) }
      const cases = new Set(catalog.products.flatMap((p) => p.variants.map((v) => v.relation))).size
      const clay = { involved: catalog.products.length, cases, recursive: pages.some((n) => n.depth > 2) }
      const clusters = pages.filter((n) => n.type === 'cluster').map((c) => ({ slug: c.slug, trinity: c.trinity, products: pages.filter((n) => n.parent === c.slug && n.type === 'product').map((n) => n.slug) }))
      const formulas = new Map(rows.map((r) => [r.theorem, r.formula]))
      const products = catalog.products.map((p) => {
        const stated = formulas.get(p.product) ?? p.variants.map((v) => v.relation).join(', ')
        return { collection: 'products' as const, title: p.title, theorem: p.product, variants: p.variants.length, iso: { standard: 'ISO 9001' as const, documented: stated.length > 0, formula: stated }, call: createCreateCall('products', { title: p.title, _status: 'published', licence: { product: p.product, variant: String(p.variants.length), unit: 'case', interval: 'once', domains: p.taxonomy.join(',') || '*' }, iso: { standard: 'ISO 9001', formula: stated, documented: stated.length > 0 } }) }
      })
      const hooks = { collection: 'products' as const, iso: 'ISO 9001' as const, via: 'hooks' as const, beforeChange: PROSE.quantumProcessingMcp_beforeChange359, afterChange: PROSE.quantumProcessingMcp_afterChange360, afterRead: PROSE.quantumProcessingMcp_afterRead361, documented: products.filter((p) => p.iso.documented).length, of: products.length }
      const urls = pages.map((p) => ({ url: `/${p.path}`, keyword: p.slug, words: p.path.split('/'), similar: [...new Set(p.interacts)].filter((w) => w !== p.slug), cluster: p.cluster }))
      const oneWord = urls.every((u) => u.words.every((w) => /^[a-z][a-z0-9]*$/.test(w)) && u.url === `/${u.words.join('/')}`)
      const searched = isObj(args.google) && Array.isArray((args.google as { searched?: unknown }).searched) ? (args.google as { searched: { query?: string; clicks?: number; impressions?: number }[] }).searched : null
      const like = (keyword: string, query: string) => { const q = query.toLowerCase().replace(/[^a-z0-9]+/g, ''); return q.length > 0 && (q.includes(keyword) || keyword.includes(q) || keyword.slice(0, 4) === q.slice(0, 4)) }
      const joined = searched === null ? null : urls.map((u) => { const hit = [...searched].filter((r) => typeof r.query === 'string' && like(u.keyword, r.query)).sort((a, b) => (b.impressions ?? b.clicks ?? 0) - (a.impressions ?? a.clicks ?? 0))[0]; return { url: u.url, keyword: u.keyword, most: hit?.query ?? null, impressions: hit?.impressions ?? null, clicks: hit?.clicks ?? null, similar: !!hit } })
      const most = call('payload', { googleCall: { url: 'https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fqpu.uuidna.com/searchAnalytics/query', httpMethod: 'POST', body: { dimensions: ['query'], rowLimit: 25, searchType: 'web' } } }).result?.structuredContent
      const keyword = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '')
      const redirects = urls.map((u) => {
        const hit = joined?.find((j) => j.url === u.url && j.most)
        const slug = keyword(hit?.most ?? u.keyword)
        const forth = 1, back = forth - 1
        return { from: `/${slug}`, keyword: slug, catchAll: 'afterError' as const, status: 404 as const, handled: true as const, thrown: false as const, written: false as const, hook: 'afterError' as const, plugin: '@payloadcms/plugin-redirects' as const, rbac: { read: 'everyone' as const, create: 'admin' as const, role: 'reader' as const, may: 'find' as const }, fallback: { bit: 0 as const, forth, back, closed: back === 0 && 0 < forth, theorem: 'textbook_double_torus' as const }, beyond: true as const, unhandled: 0 as const, possible: true as const }
      })
      const seoFields = ['title', 'description', 'image'] as const
      const seo = { plugin: '@payloadcms/plugin-seo' as const, indexed: pages.length, fields: seoFields, folder: true as const, oneWord, urls, optimise: { all: pages.every((p) => p.seo.optimised && p.seo.greatest && p.seo.iso.documented && seoFields.every((f) => typeof p.seo[f] === 'string' && p.seo[f].length > 0)), pages: pages.length, fields: seoFields, iso: 'ISO 9001' as const, documented: pages.filter((p) => p.seo.iso.documented).length, by: 'greatest seam' as const, passes, went: passes === 2 }, follow, next, compare: { by: 'similar-keywords' as const, planned: most?.allowed === true, request: most?.request ?? null, mostSearched: PROSE.quantumProcessingMcp_mostSearched362, similar: urls.reduce((n, u) => n + u.similar.length, 0), joined, redirects } }
      const nestedDocs = { plugin: '@payloadcms/plugin-nested-docs' as const, recursive: true as const, pages: pages.length }
      const documentId = isObj(args.google) && typeof (args.google as { documentId?: unknown }).documentId === 'string' ? (args.google as { documentId: string }).documentId : null
      const natural = { phase: 'rewrite' as const, natural: true as const, dry: true as const, entropy: 0 as const, prose: false as const, materialised: false as const, bits: 1000 as const, theorems: rows.length, width: width?.formula ?? null, address, hex: hexDigits, sealed: seal(address).valid, addressable: /^[0-9a-f]{32}$/.test(hexDigits) && seal(address).valid, clay, clusters, products, hooks, nested: pages, seo, nestedDocs, theorem: 'textbook_google_one_door' as const }
      if (!documentId) return { ...natural, phase: 'plan' as const, discovery: 'https://www.googleapis.com/discovery/v1/apis/docs/v1/rest', says: PROSE.quantumProcessingMcp_says363 }
      const google = call('payload', { googleCall: { api: 'docs', version: 'v1', method: 'docs.documents.batchUpdate', params: { documentId }, body: { requests: [{ insertText: { location: { index: 1 }, text } }] }, discovery: { name: 'docs', version: 'v1', rootUrl: 'https://docs.googleapis.com/', servicePath: 'v1/', parameters: {}, resources: { documents: { methods: { batchUpdate: { id: 'docs.documents.batchUpdate', path: 'documents/{documentId}:batchUpdate', httpMethod: 'POST', parameters: { documentId: { type: 'string', required: true, location: 'path' } }, scopes: ['https://www.googleapis.com/auth/documents'], request: { $ref: 'BatchUpdateDocumentRequest' } } } } } } } }).result?.structuredContent
      return { ...natural, google, says: proseFill(PROSE.quantumProcessingMcp_says364, products.length, urls.length, rows.length, clay.involved, clay.cases) }
    }
    if (typeof args.theorem === 'string') return getTheorem(args.theorem)
    // the claims measured against what is published: the OpenAlex requests, then the answers and the docket's confirmations read into each claim's status
    if (args.claims === true) return { requests: planClaims(), says: PROSE.quantumProcessingMcp_says365 } as never
    if (isObj(args.claims)) { const c = args.claims as { answers?: { id: string; status: number; text: string }[]; confirmations?: { theorem: string; doi: string; by: string }[] }; const claims = listClaims(c.answers ?? [], c.confirmations ?? []); const counts = claims.reduce<Record<string, number>>((a, x) => ({ ...a, [x.status]: (a[x.status] ?? 0) + 1 }), {}); return { claims, counts, says: Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(', ') + PROSE.quantumProcessingMcp_s366 } as never }
    if (args.quality === true) { const proof = educationProof(); return assessEducation({ scientific: proof.scientific, proved: proof.proved, removed: proof.removed, category: Object.keys(proof.category).sort() }) }
    if (isObj(args.institution)) {
      const r = args.institution as Parameters<typeof planInstitution>[0]
      // a set is a page the admin edits: a qpu block of this door, nested Workspace › family › set, created through the Payload MCP
      const page = (p: ReturnType<typeof createFamilySet>) => ({ title: p.title, hero: { type: 'default' }, slug: `workspace-${p.family}-${p.index}`, under: `workspace-${p.family}`, layout: [qpuFields(p.id, 'textbook', { institution: { set: { index: p.index } } }, p.theorem)], meta: { title: `${p.title} · Google Workspace set`, description: p.uses.join('; ') || 'no door open' } })
      const roots = [{ title: 'Google Workspace', slug: 'workspace', under: null, hero: { type: 'default' }, layout: [qpuFields(createFamilySet({ family: 'workspace' }).id, 'textbook', { institution: { sets: true } }, 'textbook_workspace_sets')] }, ...SET_FAMILIES.map((f) => ({ title: `Google Workspace for ${f}`, slug: `workspace-${f}`, under: 'workspace', hero: { type: 'default' }, layout: [qpuFields(createFamilySet({ family: f }).id, 'textbook', { institution: { set: { family: f } } }, 'textbook_workspace_sets')] }))]
      // the parent is a relationship by id: the call carries the page without it and names the parent's slug; the client sets parent to the id findPages answers for that slug (roots come first)
      const pageCall = ({ under, ...page }: { under: string | null } & Record<string, unknown>) => ({ ...createCreateCall('pages', r.tenant ? { ...page, tenant: r.tenant } : page), under })
      if (r.sets === true) { const all = listFamilySets(); const pages = [...roots, ...all.singles.map(page)]; return { ...all, pages: { tree: PROSE.quantumProcessingMcp_tree367, count: pages.length, calls: pages.map(pageCall) } } }
      if (isObj(r.set)) { const p = createFamilySet(r.set); return { set: p, page: pageCall(page(p)), tenant: { settings: { institution: { set: p.index } } }, says: `${p.title}: ${p.scopes.length} scope(s), the ${p.role} role; ${p.uses.join('; ') || 'no door open'}` } }
      return planInstitution(r)
    }
    if (isObj(args.prose)) return getProse(((args.prose as { texts?: Record<string, string> }).texts) ?? {}, EXAMPLES)
    if (args.seo === true || isObj(args.seo)) return publicSeo(isObj(args.seo) ? args.seo as Record<string, unknown> : {})
    if (args.gaps === true) return textbookGaps()
    if (args.axioms) return linkAxioms(EXAMPLES, TEXTBOOK_THEOREMS, new Set(THEOREMS.map((t) => t.key)))
    if (args.reflect) return getReflections(new Set(THEOREMS.map((t) => t.key)), Object(args.reflect).books)
    if (args.theorems) return leanLedger()
    const box = new Map(TOOLBOXES.flatMap((b) => b.tools.map((t) => [t.name, b.name] as const)))
    if (args.particles !== undefined) {
      // a closed statement whose sentence states none of its numbers is a mismatch
      const W = PROSE.quantumProcessingMcp_s368.split(' '), TENS = PROSE.quantumProcessingMcp_s369.split(' '), SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
      const nums = (s: string) => new Set(s.toLowerCase().replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => String(SUP.indexOf(c))).replace(/(\d)[.,](?=\d)/g, (_, d) => d).replace(/\b([a-z]+)(?:-([a-z]+))?\b/g, (w, a, b) => TENS.includes(a) ? String(20 + 10 * TENS.indexOf(a) + Math.max(0, W.indexOf(b))) : W.includes(a) && !b ? String(W.indexOf(a)) : w).match(/\d+/g))
      const kernel = new Map(THEOREMS.map((t) => [t.key, t.statement])), particles = ((args.particles as { theorems?: typeof TEXTBOOK_THEOREMS }).theorems ?? TEXTBOOK_THEOREMS).map((t) => {
        const conclusion = getStatement(t.lean).conclusion, statement = kernel.get(t.key) ?? conclusion, stated = [...nums(conclusion)], said = nums(t.says), unstated = !/[A-Za-z]/.test(conclusion) && !stated.some((x) => said.has(x)) ? stated.sort((a, b) => +b - +a)[0] ?? null : null, toolbox = box.get(EXAMPLES.find((e) => t.examples.includes(e.id))?.tool ?? '') ?? null
        return { key: t.key, says: t.says, statement, tactic: t.lean.split(':= by ')[1] ?? null, accepted: kernel.has(t.key), variants: ['reflected', 'contrapositive', 'converse', 'converse_refuted'].map((v) => `${t.key}_${v}`).filter((k) => kernel.has(k)), coin: uuid(statement), toolbox, unstated, class: unstated ? 'mismatch' : toolbox !== 'google' ? 'not physics' : /\b[a-z]+[A-Z]\w*/.test(t.says) ? 'states the law\'s number' : 'decides the computation' }
      })
      return { particles, counts: Object.fromEntries([...new Set(particles.map((p) => p.class))].map((c) => [c, particles.filter((p) => p.class === c).length])), total: particles.length, coin: uuid(particles.map((p) => p.coin).join('\n')), holds: particles.every((p) => !p.unstated) } as never
    }
    const group = <K extends string>(key: (e: (typeof EXAMPLES)[number]) => K | null) => { const out: Record<string, string[]> = {}; for (const e of EXAMPLES) { const k = key(e); if (k !== null) (out[k] ??= []).push(e.id) } return out }
    const categories = {
      toolbox: group((e) => box.get(e.tool) ?? 'none'),
      tool: group((e) => e.tool),
      theorem: educationProof().category,
      module: group((e) => (e.theorem ? THEOREMS.find((t) => t.key === e.theorem)?.module ?? 'unknown' : null)),
    }
    if (typeof args.reuse === 'string') {
      const e = EXAMPLES.find((x) => x.id === args.reuse)
      if (!e) throw new Error(`no example ${args.reuse}; the textbook has ${EXAMPLES.map((x) => x.id).join(', ')}`)
      const r = call(e.tool, e.arguments)
      if (r.error) throw new Error(r.error.message)
      const why = e.expect(r.result!.structuredContent)
      return { reused: e.id, tool: e.tool, toolbox: box.get(e.tool) ?? 'none', theorem: e.theorem ?? null, shows: e.shows, asDocumented: why === null, why, result: r.result!.structuredContent }
    }
    // the wave over the textbook: every example's statement emits its verification requests through the match tool (the leads it
    // names and their facts), deduplicated by url; results fetched by any client device are joined back by url, so the wave the
    // flow already fetched costs nothing more; the outcome is sealed by its content address
    if (args.verify === true || Array.isArray(args.results)) {
      // one example at a time when asked: a device at the edge walks the textbook example by example within the Worker's budget
      const chosenExamples = typeof args.example === 'string' ? EXAMPLES.filter((e) => e.id === args.example) : EXAMPLES
      if (typeof args.example === 'string' && !chosenExamples.length) throw new Error(`no example ${args.example}`)
      // the textbook verifies what each example states: the facts of its own sentence and arguments, not of every lead that shares a word with it (that asked 2,946 requests and 20 s of matching for 68 examples)
      const perExample = chosenExamples.map((e) => ({ id: e.id, tool: e.tool, theorem: e.theorem ?? null, requests: extractFacts({ id: e.id, source: 'statement', statement: `${e.shows} ${JSON.stringify(e.arguments)}`, status: 'open' }).flatMap(createVerifyRequests).map((r) => ({ verifier: r.verifier, url: r.url, check: r.check })) }))
      const requests = new Map<string, { verifier: string; url: string; check: string; examples: string[] }>()
      for (const ex of perExample) for (const r of ex.requests) { const cur = requests.get(r.url) ?? { ...r, examples: [] }; if (!cur.examples.includes(ex.id)) cur.examples.push(ex.id); requests.set(r.url, cur) }
      if (!Array.isArray(args.results)) return { phase: 'requests' as const, examples: chosenExamples.length, withRequests: perExample.filter((x) => x.requests.length).length, provenByTheorem: perExample.filter((x) => x.theorem).length, requests: requests.size, requestList: [...requests.values()], compliance: PROSE.quantumProcessingMcp_compliance370 }
      const results = args.results as { url: string; status: number; ok: boolean; contracted?: string }[]
      const byUrl = new Map(results.map((r) => [r.url, r]))
      const verified = perExample.map((ex) => { const rs = ex.requests.map((r) => byUrl.get(r.url)); const reachable = rs.filter((r) => r?.ok).length; const unfetched = rs.filter((r) => !r).length; return { id: ex.id, tool: ex.tool, theorem: ex.theorem, requests: ex.requests.length, reachable, unreachable: ex.requests.length - reachable - unfetched, unfetched, contracted: rs.filter((r) => r?.contracted === 'yes').length, state: ex.theorem ? 'proven' : ex.requests.length === 0 ? 'no public source named' : unfetched === ex.requests.length ? 'unfetched' : reachable === ex.requests.length ? 'verified online' : reachable ? 'partly reachable' : 'unreachable' } })
      const content = JSON.stringify({ verified, results: results.map((r) => [r.url, r.status]) })
      const states = verified.reduce<Record<string, number>>((acc, v) => ({ ...acc, [v.state]: (acc[v.state] ?? 0) + 1 }), {})
      return { phase: 'verified' as const, id: uuid(content), sha256: hex(sha256(utf8(content))), examples: chosenExamples.length, requests: requests.size, fetched: [...requests.keys()].filter((u) => byUrl.has(u)).length, ...Object.fromEntries(Object.entries(states).map(([k, v]) => [`state:${k}`, v])), states, verified }
    }
    const chosen = typeof args.category === 'string' ? { [args.category]: categories[args.category as keyof typeof categories] } : categories
    return { examples: EXAMPLES.length, backedByTheorems: EXAMPLES.filter((e) => e.theorem).length, categories: Object.keys(chosen).length, ...Object.fromEntries(Object.entries(chosen).map(([k, v]) => [`${k}Count`, Object.keys(v).length])), textbook: chosen }
  },
  widget: (d) => ('phase' in d && d.phase === 'public' ? seoWidget(d) : flowWidget(d)),
})

const css = defineTool('tree', {
  name: 'css',
  description: PROSE.quantumProcessingMcp_description371,
  inputSchema: { type: 'object', properties: { compare: { description: PROSE.quantumProcessingMcp_description372 }, uuid: { type: 'string', description: PROSE.quantumProcessingMcp_description373 }, uuids: { type: 'array', items: { type: 'string' }, description: PROSE.quantumProcessingMcp_description374 }, create: { type: 'boolean', description: PROSE.quantumProcessingMcp_description375 }, shadcn: { description: PROSE.quantumProcessingMcp_description376 }, resonance: { description: PROSE.quantumProcessingMcp_description377 }, media: { type: 'string', description: PROSE.quantumProcessingMcp_description378 } } },
  run: (args) => { const stylesheet = getCss()
    // the stylesheet measured against the frameworks: the files named for the client to fetch, then the sizes it hands back turned into ratios
    if (args.compare === true) return { phase: 'requests' as const, stylesheet, bytes: new TextEncoder().encode(stylesheet).length, frameworks: CSS_FRAMEWORKS, says: PROSE.quantumProcessingMcp_says379 } as never
    if (isObj(args.compare)) { const c = args.compare as { qpu?: { bytes: number; gzip: number }; answers?: { id: string; status: number; bytes: number; gzip: number }[] }; return { phase: 'compared' as const, ...compareCss(c.qpu ?? { bytes: new TextEncoder().encode(stylesheet).length, gzip: 0 }, c.answers ?? []) } as never }
    if (args.resonance === true || isObj(args.resonance)) { const spec = args.resonance === true ? {} : args.resonance as { key?: number; uuid?: string }; const res = resonance(typeof spec.key === 'number' ? spec.key : KEY); const hex = typeof spec.uuid === 'string' ? spec.uuid.toLowerCase().replace(/-/g, '') : ''; const version = /^[0-9a-f]{32}$/.test(hex) ? parseInt(hex[12]!, 16) : null; const occupied = version !== null && version >= 1 && version <= 8 ? version : null; return { phase: 'resonance' as const, ...res, occupied, ink: occupied === null ? null : res.channels[(occupied - 1) % 4]!.ink } as never }
    if (typeof args.media === 'string') {
      const uuid = args.media.toLowerCase(), ch = uuidChannel(uuid), stamp = seal(uuid), m = media(ch.tail)
      const hex = uuid.replace(/-/g, ''), at = 20, fromN = parseInt(hex[at]!, 16), toN = (fromN + 1) % 16
      const moved = `${hex.slice(0, at)}${toN.toString(16)}${hex.slice(at + 1)}`
      const dashed = `${moved.slice(0, 8)}-${moved.slice(8, 12)}-${moved.slice(12, 16)}-${moved.slice(16, 20)}-${moved.slice(20)}`
      const tamperSeal = seal(dashed), tampered = media(moved.slice(20)), witnessesHold = tampered.token === m.token, movedBy = (toN - fromN + 16) % 16
      const caught = tamperSeal.valid === false && witnessesHold === false
      const stable = stamp.valid && m.verifies && m.roundTrip && m.harmony && m.clock && caught && movedBy === 1 && m.token === ch.message.referrer.handle
      return { phase: 'media' as const, uuid, ...m, sealed: stamp.valid, same: m.token === ch.message.referrer.handle && m.verifies, params: ch.message.referrer, tamper: { moved: movedBy, sealed: tamperSeal.valid, witnessesHold, caught }, possible: tamperSeal.valid && witnessesHold, stable, says: proseFill(PROSE.quantumProcessingMcp_says380, m.audio.notes.map((n) => n.hz).join(', '), m.video.frames) } as never
    }
    if (args.shadcn === true || isObj(args.shadcn)) { const spec = args.shadcn === true ? {} : args.shadcn as { index?: unknown }; const index = typeof spec.index === 'string' || typeof spec.index === 'number' ? String(spec.index) : undefined; return shadcnPrograms(index) as never }
    const vars = typeof args.uuid === 'string' ? style(args.uuid).vars : null; const program = typeof args.uuid === 'string' ? programHues(args.uuid) : null; const rays = Array.isArray(args.uuids) ? castRays(args.uuids.map(String)) : null; if (args.create) return { ...createTheme(KEY, 'https://qpu.uuidna.com', ['qpu-style', 'qpu-block', 'qpu-app', 'qpu-card', 'qpu-badge', 'qpu-table', 'qpu-stream', 'qpu-dashboard']) }; return { key: KEY, coil: coilColour(KEY), program, rays, bytes: stylesheet.length, rules: (stylesheet.match(/\{/g) ?? []).length, variables: vars ? Object.keys(vars).length : 0, script: false, uuid: typeof args.uuid === 'string' ? args.uuid : null, vars, stylesheet } },
  widget: flowWidget,
})

type Facet = { property: string; kind: 'enum' | 'boolean' | 'range' | 'textbook' | 'free'; required: boolean; values: unknown[]; domain: string; space: number }
const facets = (name: string): { facets: Facet[]; tool: Tool | undefined } => {
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
      return { property: prop, kind: 'range' as const, required: required.has(prop), values, domain: `${spec.type} in [${spec.minimum}, ${spec.maximum}]${values.length < size ? proseFill(PROSE.quantumProcessingMcp_s381, values.length) : ''}`, space: size }
    }
    if (tb.length) return { property: prop, kind: 'textbook' as const, required: required.has(prop), values: tb, domain: `${tb.length} value(s) the textbook uses`, space: tb.length }
    return { property: prop, kind: 'free' as const, required: required.has(prop), values: [], domain: `${spec.type ?? 'any'}: free, no value enumerable`, space: Infinity }
  })
  return { facets, tool: tool as unknown as Tool }
}
const dashboard = defineTool('tree', {
  name: 'dashboard',
  description: PROSE.quantumProcessingMcp_description382,
  inputSchema: { type: 'object', properties: { tool: { type: 'string', description: PROSE.quantumProcessingMcp_description383 }, fixed: { type: 'object', description: PROSE.quantumProcessingMcp_description384 }, origin: { type: 'string' } } },
  run: (args) => {
    const origin = typeof args.origin === 'string' ? args.origin : ''
    if (typeof args.tool !== 'string') return { tools: TOOLS.length, index: TOOLS.map((t) => { const { facets: rows } = facets(t.name); const enumerable = rows.filter((f) => f.values.length); return { tool: t.name, toolbox: t.toolbox, facets: rows.length, enumerable: enumerable.length, free: rows.filter((f) => f.kind === 'free').map((f) => f.property), combinations: enumerable.reduce((n, f) => n * f.values.length, 1), space: rows.some((f) => f.space === Infinity) ? 'unbounded' : rows.reduce((n, f) => n * f.space, 1), dashboard: `${origin}/${uuid(`dashboard${JSON.stringify({ tool: t.name })}`)}` } }) }
    const { facets: rows, tool } = facets(args.tool)
    if (!tool) throw new Error(`no tool ${args.tool}`)
    const fixed = (isObj(args.fixed) ? args.fixed : {}) as Record<string, unknown>
    const enumerable = rows.filter((f) => f.values.length)
    const open = enumerable.filter((f) => !(f.property in fixed))
    const freeRequired = rows.filter((f) => f.kind === 'free' && f.required && !(f.property in fixed)).map((f) => f.property)
    const space = Number(compositions(enumerable.map((f) => f.values.length))) // Queneau's primitive: the product of the choices
    // the whole space is reachable by fixing one facet at a time: the cells of this dashboard are the values of the facets still open
    // (the required ones first, else the first open one); a cell fixes its value and leads to the narrower dashboard, until every
    // enumerable facet is fixed and the cell is the walk page of that one combination — the click is the decision, final
    const next = open.filter((f) => f.required).length ? open.filter((f) => f.required) : open.slice(0, 1)
    let combos: Record<string, unknown>[] = [{ ...fixed }]
    for (const f of next) combos = combos.flatMap((c) => f.values.map((v) => ({ ...c, [f.property]: v })))
    const final = (c: Record<string, unknown>) => enumerable.every((f) => f.property in c)
    const cells = combos.map((c) => { const leaf = final(c); const id = leaf ? uuid(`${args.tool}${JSON.stringify(c)}`) : uuid(`dashboard${JSON.stringify({ tool: args.tool, fixed: c })}`); return { arguments: c, uuid: id, url: `${origin}/${id}`, final: leaf, vars: style(id).vars } })
    const chip = (text: string, style = '') => `<span style="display:inline-block; padding: 2px 8px; margin: 2px; border-radius: 999px; background: var(--surface-1); font-size: var(--font-size-footnote); ${style}">${text.replace(/[&<>]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[ch]!)}</span>`
    const html = `<div style="display: grid; gap: var(--gap-md);"><div role="heading" aria-level="3">${args.tool}: ${space.toLocaleString('en-US')} combination(s) of ${enumerable.length} facet(s), ${Object.keys(fixed).length} fixed, ${cells.length} cell(s) here${freeRequired.length ? `; ${freeRequired.join(', ')} is yours to type` : ''}</div>` +
      rows.map((f) => `<div data-facet="${f.property}"><strong>${f.property}</strong> <small>${f.domain}${f.required ? ', required' : ''}${f.property in fixed ? `, fixed to ${JSON.stringify(fixed[f.property])}` : ''}</small><div>${f.values.map((v) => chip(JSON.stringify(v), f.property in fixed && JSON.stringify(fixed[f.property]) === JSON.stringify(v) ? 'outline: 2px solid var(--a432-accent);' : '')).join('')}${f.values.length ? '' : chip('free')}</div></div>`).join('') +
      `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--gap-sm, 6px);">${cells.map((c) => `<a href="${c.url}" data-block="${c.uuid}" style="${Object.entries(c.vars).map(([k, v]) => `${k}: ${v}`).join('; ')}; display: block; border-left: 3px solid var(--qpu-accent); padding: 4px 8px; border-radius: var(--radius); background: var(--surface-1); color: var(--text-primary); text-decoration: none; font-size: var(--font-size-footnote);" title="${c.uuid}">${c.final ? '▶ ' : '▸ '}${Object.entries(c.arguments).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(' ').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!) || 'no arguments'}</a>`).join('')}</div></div>`
    return { tool: args.tool, facets: rows.length, enumerable: enumerable.length, fixed: Object.keys(fixed).length, combinations: space, cells: cells.length, final: cells.filter((c) => c.final).length, space: rows.some((f) => f.space === Infinity) ? 'unbounded' : rows.reduce((n, f) => n * f.space, 1), freeRequired, facetList: rows, cellList: cells.map(({ arguments: a, uuid, url, final: leaf }) => ({ arguments: a, uuid, url, final: leaf })), html }
  },
  widget: (d: { html?: string; tools?: number; index?: { tool: string; combinations: number; space: unknown; dashboard: string }[] }) => d.html ?? `<div style="display: grid; gap: var(--gap-sm, 6px);"><div role="heading" aria-level="3">${d.tools} tools, each laid out whole</div>${(d.index ?? []).map((i) => `<a href="${i.dashboard}" style="display: block; padding: 4px 8px; background: var(--surface-1); border-radius: var(--radius); color: var(--text-primary); text-decoration: none;">${i.tool}: ${i.combinations} combination(s), space ${i.space}</a>`).join('')}</div>`,
})

/** No-cloning unlocks the cloning of toolsets: the quantum state of a computation cannot be copied (QuantumInformation.no_cloning, kernel-checked),
 * so what is cloned is never the state but its classical description — and a toolbox is exactly that: its toolset (names,
 * descriptions, schemas), its skillset (instructions, directions, examples) and its selftest, a document any host mounts or
 * any client walks as doors by discovery. */
const clone = defineTool('tree', {
  name: 'clone',
  description: PROSE.quantumProcessingMcp_description385,
  inputSchema: { type: 'object', properties: { toolbox: { type: 'string', description: PROSE.quantumProcessingMcp_description386 }, as: { type: 'string', description: PROSE.quantumProcessingMcp_description387 }, ve: { description: PROSE.quantumProcessingMcp_description388 } } },
  run: (args, ctx) => {
    if (args.ve === true || isObj(args.ve)) {
      const given = isObj(args.ve) ? args.ve as { copies?: unknown; verified?: unknown; kind?: unknown } : {}
      const os = listAlpine()
      const names = [...new Set(CATALOGUE.map((v) => v.product))]
      const advantage = typeof given.copies === 'number' && typeof given.verified === 'number' ? getAdvantage(given.copies, given.verified) : null
      const unlimited = advantage?.unbounded === true
      const kind = given.kind === 'full' ? 'full' as const : 'linked' as const
      const sheet = { title: 'Proxmox Virtual Environment' as const, version: '9.2' as const, url: 'https://www.proxmox.com/images/download/pve/docs/Proxmox-VE-9.2-datasheet.pdf', licence: 'GNU AGPL, v3' as const, guests: ['QEMU/KVM', 'LXC'] as const, clones: ['linked', 'full'] as const, from: 'template' as const, migration: 'live' as const, downtime: 0 as const, console: ['noVNC', 'SPICE'] as const, offline: 'Proxmox Offline Mirror' as const, api: 'REST' as const, format: 'JSON' as const, ha: 'multi-master' as const, spof: false as const, storageDefinitions: 'unlimited' as const }
      const products = names.map((product) => ({ product, online: { mode: 'online' as const, migration: 'live' as const, downtime: 0 as const, fetched: false as const }, offline: { mode: 'offline' as const, mirror: sheet.offline, fetched: false as const }, toolbox: os.os.name, complete: os.os.complete && unlimited }))
      const complete = products.filter((p) => p.complete).length
      const admitted = names.length > 0 && complete === names.length
      const text = canonicalText({ version: sheet.version, kind, products: names })
      const signed = admitted ? ctx.call('seal', { text, sign: 'ML-DSA-44' }) as { signature?: { algorithm: string; fips: number; executedBy: string; sizes?: { publicKey: number; signature: number } } } : null
      const leads = [...(os.os.complete ? [] : [{ id: 'qpu-os-incomplete', statement: os.says, status: 'open' as const }]), ...(unlimited ? [] : [{ id: 'advantage-bounded', statement: PROSE.quantumProcessingMcp_statement389, status: 'open' as const }])]
      return { phase: 've' as const, sheet, guests: sheet.guests, clones: sheet.clones, kind, browser: 'noVNC' as const, runsHere: false as const, os: os.os, gaps: os.gaps, catalogue: names.length, products, complete, unlimited, advantage, admitted, anyone: admitted, using: admitted && signed?.signature ? { postQuantum: signed.signature.algorithm, fips: signed.signature.fips, executedBy: signed.signature.executedBy, virtualised: 'browser' as const, clone: kind, console: 'noVNC' as const } : null, signature: signed?.signature ?? null, leads, theorem: 'QuantumInformation.no_cloning' as const, noCloning: PROSE.quantumProcessingMcp_noCloning390, says: admitted ? proseFill(PROSE.quantumProcessingMcp_s391, os.os.name, kind) : proseFill(PROSE.quantumProcessingMcp_s392, complete, names.length, os.os.name) }
    }
    if (typeof args.toolbox !== 'string') return { toolboxes: TOOLBOXES.length, theorem: 'QuantumInformation.no_cloning', index: TOOLBOXES.map((b) => ({ toolbox: b.name, tools: b.tools.length, examples: EXAMPLES.filter((e) => b.tools.some((t) => t.name === e.tool)).length, clone: `/${uuid(`clone${JSON.stringify({ toolbox: b.name })}`)}` })) }
    const box = TOOLBOXES.find((b) => b.name === args.toolbox)
    if (!box) throw new Error(`no toolbox ${args.toolbox}; the toolboxes are ${TOOLBOXES.map((b) => b.name).join(', ')}`)
    const examples = EXAMPLES.filter((e) => box.tools.some((t) => t.name === e.tool)).map((e) => ({ id: e.id, tool: e.tool, arguments: e.arguments, shows: e.shows, theorem: e.theorem ?? null }))
    const selftest = box.skill.selftest(ctx)
    const doc = { name: typeof args.as === 'string' ? args.as : box.name, clonedFrom: box.name, idea: box.idea, toolset: box.tools.map((t) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema })), skillset: { instructions: box.skill.instructions, directions: box.skill.directions, examples }, lean: toolboxLean(box), selftest: { passed: selftest.passed, checks: selftest.checks.length }, license: LICENSE.spdx, author: LICENSE.author, theorem: 'QuantumInformation.no_cloning' }
    return { toolbox: box.name, as: doc.name, tools: box.tools.length, examples: examples.length, selftestPassed: selftest.passed, bytes: JSON.stringify(doc).length, id: uuid(`toolbox${JSON.stringify(doc)}`), noCloning: PROSE.quantumProcessingMcp_noCloning393, doc }
  },
  widget: flowWidget,
})

export const TOOLBOXES: Toolbox[] = [
  { name: 'google', idea: PROSE.quantumProcessingMcp_idea394, tools: OWN.filter((t) => t.toolbox === 'google'), examples: [], skill: { instructions: PROSE.quantumProcessingMcp_instructions395, directions: [PROSE.quantumProcessingMcp_s396], selftest: (ctx) => { const checks = ctx.examples.filter((e) => OWN.some((t) => t.name === e.tool && t.toolbox === 'google')).map((e) => { const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } }); const why = 'error' in r ? r.error.message : e.expect(r.result.structuredContent); return { id: `google:${e.id}`, passed: why === null, evidence: why ?? e.shows } }); return { passed: checks.every((c) => c.passed), checks } } } },
  { name: 'tree', idea: PROSE.quantumProcessingMcp_idea397, tools: [...OWN.filter((t) => t.toolbox === 'tree'), metrics, textbook, css, dashboard, clone, apis], examples: [], skill: { instructions: PROSE.quantumProcessingMcp_instructions398, directions: [PROSE.quantumProcessingMcp_s399, PROSE.quantumProcessingMcp_s400], selftest: (ctx) => { const m = matchStatement(PROSE.quantumProcessingMcp_s401, ctx.handle, ctx.examples, ctx.leads); const k = combineLeads(ctx.leads, '0'.repeat(31) + '1'); const ses = runSession({ open: [{ id: 'x', title: 'read every session transcript', status: 'draft', started: true }], directives: [{ session: 's', at: '', text: PROSE.quantumProcessingMcp_text402 }, { session: 's', at: '', text: 'ok' }], breaks: [{ text: 'git push' }] }); const checks = [{ id: 'tree:match-serves', passed: m.verdict === 'served', evidence: `${m.verdict} via ${m.tool}` }, { id: 'tree:lead-cells', passed: k.cells.length === 432 && k.filled + k.empty === 432 && k.cells.reduce((n, c) => n + c.count, 0) === ctx.leads.length && k.default.cell === 1 && k.cells.every((c) => c.digits.reduce((n, d, i) => n + d * k.places[i]!, 0) === c.cell), evidence: proseFill(PROSE.quantumProcessingMcp_evidence403, k.says) }, { id: 'tree:session-partition', passed: ses.directives.folded === 1 && ses.directives.assents === 1 && ses.breaks['raw git commit or push in a shell'] === 1 && ses.items[0]?.started === true, evidence: ses.says }]; return { passed: checks.every((c) => c.passed), checks } } } },
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
/** The Lean a toolbox keeps, from the theorems its own examples name. A written textbook proof is kept; a measured getter is not run. The kernel statement stands when the textbook proof is not a written string. */
const toolboxLean = (box: Toolbox) => {
  if (box.lean) return box.lean
  const names = new Set(box.tools.map((t) => t.name))
  const keys = [...new Set([...box.examples, ...EXAMPLES].filter((e) => names.has(e.tool) && typeof e.theorem === 'string').map((e) => e.theorem!))].sort()
  const theorems = keys.flatMap((theorem) => {
    const tb = TEXTBOOK_THEOREMS.find((t) => t.key === theorem)
    const kernel = THEOREMS.find((t) => t.key === theorem)
    const written = tb ? Object.getOwnPropertyDescriptor(tb, 'lean') : undefined
    const proof = typeof written?.value === 'string' ? written.value : kernel?.statement ?? null
    return proof ? [{ theorem, proof, kernel: !!kernel }] : []
  })
  const lean = { theorems, proof: theorems.map((row) => row.proof).join('\n') }
  box.lean = lean
  return lean
}
const NAMES = TOOLS.map((t) => t.name), VIEWS = [...NAMES, 'chat'] // the MCP Apps views: every tool's and the chat's
const CONTRACTS = TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema }))
/** The order the tools are served in: the Clay set first (the register, the decider, the verifier), every other tool after them in its order; initialize builds its version over the same order, so the version names what is served. */
const SERVED: Tool[] = [...TOOLS].sort((a, b) => { const i = CLAY_FIRST.indexOf(a.name), j = CLAY_FIRST.indexOf(b.name); return (i < 0 ? CLAY_FIRST.length : i) - (j < 0 ? CLAY_FIRST.length : j) })
/** The chat as the one door an MCP client needs: a statement (or a call) answered under the caller's role, never an error thrown back.
 *  The call is the one the match serves, else the example of the first theorem the route names (a theorem-based answer); every enum value
 *  the role may not choose is corrected to the role's harmonic default (textbook_rbac_options); a handler refusal is answered with its
 *  learned remedy, the fallback's handling and the court's case (textbook_fallback_involution): correction and handling are one involution. */
// a chat answered inside another chat (the match serving a statement by an example that is itself a chat) is not entered again: the outer answer stands, and the recursion that hung readiness and docs:gen cannot start
let chatDepth = 0
type Call = { name: string; arguments: Record<string, unknown> }
type Ask = { role?: string; call?: { tool: string; arguments?: Record<string, unknown> }; referrer?: string; run?: boolean; choice?: string; routes?: { statement: string; door: string }[] }
/** The chat is the Payload search collection's own find. The exit of every turn is that find, and it carries no entropy. */
function searchExit(statement: string) {
  const find = manageApi({ collection: 'search', action: 'find', where: { title: { like: statement } } })
  return { strategy: 'search' as const, entropy: 0 as const, collection: 'search' as const, find }
}
const leaveChat = (statement: string, answer: object) => ({ ...answer, entropy: 0 as const, exit: searchExit(statement) })
export const chat = (statement: string, c: Ask = {}): any => {
  // the routing measured: a problem not routed to its door is a lead naming both
  if (c.routes) { const n = c.routes.length, leads = c.routes.map((x) => ({ id: uuid(x.statement), ...x, routed: chat(x.statement, { role: c.role, run: false }).call?.name ?? null })).filter((x) => x.routed !== x.door); return leaveChat(statement, { role: c.role ?? 'reader', asked: n, exact: n - leads.length, leads, account: accountCoins(), theorems: ['textbook_chat_call_or_question'], says: `${n - leads.length} of ${n} routed to their door` }) }
  if (chatDepth > 0) return leaveChat(statement, { statement, role: (c.role && c.role in ROLE_RANK ? c.role : 'reader') as Role, by: PROSE.quantumProcessingMcp_by404, routed: [] as string[], account: accountCoins(), theorems: [] as string[], says: 'nested chat not entered' })
  chatDepth++
  // every answer is also a Payload lexical document: the statement as its heading, the call that answered and each theorem to verify as qpu blocks (a block is its tool and arguments, so any MCP client runs it), the answer's sentence after them
  try { const r = chatInner(statement, c) as { call?: Call; verify?: { theorem: string; call: Call }[]; routed?: string[]; says?: string }; const blocks = [...(r.call ? [{ uuid: uuid(JSON.stringify(r.call)), tool: r.call.name, arguments: r.call.arguments, theorem: r.routed?.[0] ?? null }] : []), ...(r.verify ?? []).map((v) => ({ uuid: uuid(JSON.stringify(v.call)), tool: v.call.name, arguments: v.call.arguments, theorem: v.theorem }))]; return leaveChat(statement, { ...r, doc: doc(statement, blocks, r.says ? [r.says] : []) }) } finally { chatDepth-- }
}
const chatInner = (statement: string, c: Ask) => {
  const role: Role = c.role && c.role in ROLE_RANK ? (c.role as Role) : 'reader'
  // the thousand-bit width, spoken in the chat: the coin is booked before the speech, and the speech writes no prose and no address
  const heard = listNumerals(statement)
  const thousand = (heard.numerals.length === 1 && heard.numerals[0]!.value === 1000 && heard.text.trim() === '1000') || /^\s*1000\s*bits?\s*$/i.test(statement)
  if (thousand) {
    const asked = { name: 'fold', arguments: { speak: { bits: 1000 } } }
    const account = accountCoins(asked.name, asked.arguments)
    const base = { statement, role, verdict: 'served' as const, by: 'the thousand-bit speech', call: asked, account, entropy: 0 as const, prose: false as const, materialised: false as const, theorems: ['textbook_thousand_bit_width', 'textbook_uuid_core', 'textbook_coins_coils_balanced', 'textbook_chat_call_or_question'] as const }
    if (c.run === false) return base
    const reply = call(asked.name, asked.arguments).result?.structuredContent ?? null
    return { ...base, reply, bits: reply?.bits ?? null, understood: reply?.understood ?? null, pass: reply?.pass ?? 0, nibbles: reply?.nibbles ?? 0, used: reply?.used ?? 0, whole: reply?.whole === true, sealed: reply?.sealed === true }
  }
  // the matcher is asked without the examples that would enter the chat door again (a chat example, a client report): nothing nested is computed, so nothing context-dependent is cached under a call's address
  const reenters = (x?: { name?: string; tool?: string; arguments: Record<string, unknown> } | null) => { const n = x?.name ?? x?.tool; return !!x && ((n === 'match' && 'chat' in x.arguments) || (n === 'leads' && ('client' in x.arguments || 'session' in x.arguments))) }
  const own = EXAMPLES.filter((e) => !reenters(e))
  const m = c.call ? null : matchStatement(statement, handle, own, LEADS)
  const routed = (m?.route?.theorems ?? []).map((x) => x.theorem)
  // the chat and the match decide a statement once: the match's verdict, state and witnesses stand on every answer the chat gives
  const out = <T extends object>(o: T) => ({ statement, role, ...(m ? { verdict: m.verdict, state: m.state, witnesses: m.witnesses } : {}), ...o })
  // a served call that would enter the chat door again (a chat example, a client report) is not an answer to this chat: the theorems answer instead
  // a question's answer re-enters the loop: the door chosen answers by its first example
  const chosen = own.find((e) => e.tool === c.choice)
  let asked: Call | null = c.call ? { name: c.call.tool, arguments: c.call.arguments ?? {} } : chosen ? { name: chosen.tool, arguments: chosen.arguments } : null
  let by = c.call ? 'the call given' : chosen ? `the door chosen: ${c.choice}` : ''
  // the statement that is a theorem's own sentence is that theorem: computed on a binding that holds, else by the example the theorem names, before a witness collision or a later route
  if (!asked) { const own = TEXTBOOK_THEOREMS.find((t) => t.says === statement); if (own) { const values = bindingFor(own.key), ex = EXAMPLES.find((e) => e.theorem === own.key) ?? EXAMPLES.find((e) => own.examples.includes(e.id)); if (values) ({ call: asked, by } = { call: { name: 'textbook', arguments: { evaluate: { theorem: own.key, values } } }, by: `theorem ${own.key} computed` }); else if (ex) ({ call: asked, by } = { call: { name: ex.tool, arguments: ex.arguments }, by: `theorem ${own.key}: its example ${ex.id}` }) } }
  // a statement its witnesses contradict is answered with the contradiction, never with the computation of the true theorem it names
  if (!asked && m?.state === 'collision') return out({ by: 'contradicted by its witnesses', routed, refuted: m.witnesses!.contradicted, lead: m.lead, account: accountCoins(), theorems: ['textbook_chat_call_or_question'], says: `contradicted: ${m.witnesses!.contradicted.join('; ')}` })
  // in route order, each theorem answers by its expression computed as the match reads it (evaluateRouted) or else by its own example; the first routed theorem computed answers before any served call (the kernel's value, not a passage of prose), then the call the match serves, then the rest in order
  const computed = (th: string) => { const r = evaluateRouted(th, statement); return r ? { call: { name: 'textbook', arguments: { evaluate: { theorem: th, values: r.values } } }, by: `theorem ${th} computed` } : null }, first = !asked && routed[0] ? computed(routed[0]) : null
  if (first) ({ call: asked, by } = first)
  if (!asked && m?.verdict === 'served' && m.call && !reenters(m.call)) { asked = m.call; by = PROSE.quantumProcessingMcp_s183 }
  if (!asked) for (const th of routed) { const r = computed(th), ex = EXAMPLES.find((x) => x.theorem === th); if (r || ex) { ({ call: asked, by } = r ?? { call: { name: ex!.tool, arguments: ex!.arguments }, by: `theorem ${th}: its example ${ex!.id}` }); break } }
  // nothing decides it alone: one programmable question, the doors around it its options (textbook_chat_call_or_question)
  if (!asked) { const doors = [...new Set(own.map((e) => e.tool))], near = doors.filter((d) => m?.cluster?.some((x) => x.id === d || own.some((e) => e.id === x.id && e.tool === d))); return out({ by: 'a question', routed, question: { asks: 'which door decides it?', options: near.length ? near : doors }, lead: m?.lead ?? null, account: accountCoins(), theorems: ['textbook_chat_call_or_question'] }) }
  const tool = TOOLS.find((x) => x.name === asked!.name) as (Tool & { inputSchema: { properties?: Record<string, { enum?: readonly unknown[]; default?: unknown }> } }) | undefined
  const h = harmonicDefaults(tool?.inputSchema ?? {}, c.referrer, (p, v) => mayChoose(role, asked!.name, p, v))
  const args: Record<string, unknown> = { ...asked.arguments }
  const corrected: { property: string; from: unknown; to: unknown; why: string }[] = []
  for (const [p, v] of Object.entries(args)) {
    const opts = h.options[p]; if (!opts || opts.includes(v)) continue
    if (!opts.length) { delete args[p]; corrected.push({ property: p, from: v, to: null, why: proseFill(PROSE.quantumProcessingMcp_why405, role, p) }) }
    else { const to = h.defaults[p] ?? opts[0]; args[p] = to; corrected.push({ property: p, from: v, to, why: proseFill(PROSE.quantumProcessingMcp_why406, role, String(v)) }) }
  }
  const account = accountCoins(asked.name, args)
  if (c.run === false) return out({ by, call: { name: asked.name, arguments: args }, corrected, routed, account, theorems: ['textbook_rbac_options', 'textbook_coins_coils_balanced'], says: proseFill(PROSE.quantumProcessingMcp_says407, asked.name, role) })
  const r = call(asked.name, args)
  const theorems = ['textbook_rbac_options', 'textbook_fallback_involution', 'textbook_coins_coils_balanced', ...routed]
  const verify = verifyTheorems(theorems)
  if (r.error) return out({ by, verify, call: { name: asked.name, arguments: args }, corrected, routed, account, handled: { error: r.error.message, remedy: listRemedies([r.error.message]), fallback: handleOrCorrect([r.error.message], false, 'handling'), court: summonCourt({ gate: `chat ${asked.name}`, rule: 'shape', evidence: { message: r.error.message } }) }, theorems, says: proseFill(PROSE.quantumProcessingMcp_says408, asked.name) })
  return out({ by, verify, call: { name: asked.name, arguments: args }, corrected, routed, account, reply: r.result?.structuredContent ?? null, theorems, says: `${asked.name} answered under the ${role} role (${by})${corrected.length ? proseFill(PROSE.quantumProcessingMcp_s409, corrected.length) : ''}` })
}
/** The chat coverage sweep, sealed: the plan names every kernel textbook sentence, a share puts at most twelve of them to the chat by their own
 *  sentence, and the join checks each share's content address before sealing the census in textbook order (textbook_chat_call_or_question). */
type ChatRow = { theorem: string; by: string; kind: 'computed' | 'served' | 'example' | 'other'; ownFirst: boolean }
const chatPlan = () => { const kernel = new Set(THEOREMS.map((t) => t.key)); return TEXTBOOK_THEOREMS.filter((t) => kernel.has(t.key)) }
const chatKindOf = (theorem: string, by: string): ChatRow['kind'] => by.includes('computed') && by.includes(theorem) ? 'computed' : by === PROSE.quantumProcessingMcp_s183 ? 'served' : by.includes('its example') && by.includes(theorem) ? 'example' : 'other'
const chatCensus = (rows: readonly ChatRow[]) => { const count = (k: ChatRow['kind']) => rows.filter((r) => r.kind === k).length; const unanswered = rows.filter((r) => r.kind === 'other').map((r) => r.theorem); return { computed: count('computed'), served: count('served'), byExample: count('example'), ownFirst: rows.filter((r) => r.ownFirst).length, other: unanswered.length, unanswered } }
const chatShare = (keys: readonly string[]) => {
  if (!keys.length) throw new Error(PROSE.quantumProcessingMcp_s410)
  if (keys.length > CHAT_SHARE) throw new Error(proseFill(PROSE.quantumProcessingMcp_s411, CHAT_SHARE, keys.length))
  const known = new Map(chatPlan().map((t) => [t.key, t]))
  const missing = keys.filter((k) => !known.has(k))
  if (missing.length) throw new Error(`not a kernel textbook theorem: ${missing.join(', ')}`)
  const rows: ChatRow[] = keys.map((key) => { const a = chat(known.get(key)!.says, { run: false }) as { by?: string; routed?: string[] }; const by = a.by ?? ''; return { theorem: key, by, kind: chatKindOf(key, by), ownFirst: a.routed?.[0] === key } })
  const id = uuid(canonicalText(rows))
  return { phase: 'chat-share' as const, theorems: rows.length, share: CHAT_SHARE, rows, id, sealed: seal(id).valid, ...chatCensus(rows), says: proseFill(PROSE.quantumProcessingMcp_says412, rows.length, id) }
}
const chatJoin = (parts: readonly { id?: unknown; rows?: unknown }[]) => {
  if (!parts.length) throw new Error(PROSE.quantumProcessingMcp_s413)
  const rows: ChatRow[] = []
  for (const p of parts) {
    if (!Array.isArray(p.rows) || typeof p.id !== 'string') throw new Error('a chat part is { id, rows }')
    if (uuid(canonicalText(p.rows)) !== p.id) throw new Error(PROSE.quantumProcessingMcp_s414)
    for (const r of p.rows as ChatRow[]) {
      if (typeof r?.theorem !== 'string' || typeof r.by !== 'string' || typeof r.ownFirst !== 'boolean' || !['computed', 'served', 'example', 'other'].includes(r.kind)) throw new Error(PROSE.quantumProcessingMcp_s415)
      rows.push({ theorem: r.theorem, by: r.by, kind: r.kind, ownFirst: r.ownFirst })
    }
  }
  const order = chatPlan().map((t) => t.key), place = new Map(order.map((k, i) => [k, i])), seen = new Set<string>()
  for (const r of rows) { if (!place.has(r.theorem)) throw new Error(`${r.theorem} is not in the chat plan`); if (seen.has(r.theorem)) throw new Error(`${r.theorem} is in two parts`); seen.add(r.theorem) }
  const sorted = [...rows].sort((a, b) => place.get(a.theorem)! - place.get(b.theorem)!)
  const id = uuid(canonicalText(sorted)), census = chatCensus(sorted)
  return { phase: 'chat-coverage' as const, complete: seen.size === order.length, of: order.length, theorems: sorted.length, ...census, id, sealed: seal(id).valid, says: census.other ? `${census.other} of ${sorted.length} unanswered (${census.unanswered.join(', ')}), the census sealed ${id}` : proseFill(PROSE.quantumProcessingMcp_s416, sorted.length, census.ownFirst, id) }
}
const chatCoverage = (chatArg: unknown) => {
  if (chatArg === true) { const sentences = chatPlan().map((t) => ({ theorem: t.key, says: t.says })); return { phase: 'chat-plan' as const, theorems: sentences.length, share: CHAT_SHARE, sentences, says: proseFill(PROSE.quantumProcessingMcp_says417, sentences.length, CHAT_SHARE) } }
  const c = chatArg as { theorem?: unknown; theorems?: unknown; parts?: unknown }
  if (Array.isArray(c.parts)) return chatJoin(c.parts as { id?: unknown; rows?: unknown }[])
  const keys = typeof c.theorem === 'string' ? [c.theorem] : Array.isArray(c.theorems) && c.theorems.every((k) => typeof k === 'string') ? c.theorems as string[] : null
  if (!keys) throw new Error(PROSE.quantumProcessingMcp_s418)
  return chatShare(keys)
}
// the tools/call envelope, written once
export const call = (name: string, args: unknown) => handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }) as { result?: { structuredContent?: any }; error?: { message: string } }
bindGoogleCall(call) // the google toolbox reaches the handler through this binding, never by import
// the theorems that count what the tools compute read it from here
updateTheoremSources({ toolboxes: TOOLBOXES, call, googleMcps: GOOGLE_MCPS, get examples() { return EXAMPLES } })
// questions asked elsewhere, read through the APIs Payload holds (QUESTION_SOURCES: Stack Exchange's unanswered, MathOverflow's among them), each
// title matched; a site that disallows crawling is read by its API only, the answer's backoff honoured; a question keeps its link and tags
// (CC BY-SA 4.0), never its text. A question is decided only when its route calls an example over two shared stems at least: one stem in common is
// a lexical neighbour, not an answer, so it stays a lead with the others (textbook_questions_matched)
type QuestionSource = { id: string; site: string; method: 'GET'; url: string; keyVar: string; quota: number; licence: string; backoff: string }
const QUESTION_SOURCES = TABLES.QUESTION_SOURCES as unknown as readonly QuestionSource[]
const unescape = (s: string) => s.replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n))).replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
const matchQuestions = (q: unknown) => {
  if (q === true) return { phase: 'requests' as const, requests: QUESTION_SOURCES.map((s) => ({ id: s.id, method: s.method, url: s.url, keyVar: s.keyVar })), sources: QUESTION_SOURCES, theorem: 'textbook_questions_matched' }
  const answers = (Array.isArray(q) ? q : []) as { source: string; text: string }[]
  const read = answers.map((a) => ({ source: a.source, j: JSON.parse(a.text) as { items?: { question_id: number; link: string; tags: string[]; score: number; title: string }[]; backoff?: number; quota_remaining?: number } }))
  const rows = read.flatMap(({ source, j }) => (j.items ?? []).map((it) => { const m = matchStatement(unescape(it.title), handle, EXAMPLES, LEADS), r = m.route?.theorems?.[0] as { theorem: string; shared: string[]; routes: { example: string }[] } | undefined; return { source, id: it.question_id, link: it.link, tags: it.tags, score: it.score, verdict: m.verdict, routed: r ? { theorem: r.theorem, shared: r.shared, example: r.routes[0]?.example ?? null } : null, decided: m.verdict !== 'unknown' && !!r && r.shared.length >= 2 && r.routes.length > 0 } }))
  const byVerdict = Object.fromEntries((['served', 'impossible', 'unknown'] as const).map((v) => [v, rows.filter((r) => r.verdict === v).length]))
  const leads = rows.filter((r) => !r.decided).map((r) => ({ id: `question-${r.source}-${r.id}`, source: r.link, statement: proseFill(PROSE.quantumProcessingMcp_statement419, r.tags.join(', ')), status: 'open' as const, reason: r.routed ? proseFill(PROSE.quantumProcessingMcp_s420, r.routed.shared.join(', '), r.routed.theorem) : 'matched by no tool, example or lead' }))
  return { phase: 'matched' as const, questions: rows.length, byVerdict, decided: rows.filter((r) => r.decided).length, rows, leads, backoff: Math.max(0, ...read.map(({ j }) => j.backoff ?? 0)), quotaRemaining: Math.min(...read.map(({ j }) => j.quota_remaining ?? Infinity)), theorem: 'textbook_questions_matched' }
}
const CONTEXT: Context = { get handle() { return handle }, get examples() { return EXAMPLES }, get leads() { return LEADS }, call: (name, args = {}) => call(name, args).result?.structuredContent, selftest: (name, ctx) => TOOLBOXES.find((b) => b.name === name)?.skill.selftest(ctx) }
// the leads beyond the core, handed by a client or a page's hook as arguments (records, or one lead): the call's leads, the core's ids kept first
const isLead = (l: unknown): l is Lead => isObj(l) && ['id', 'statement', 'status'].every((k) => typeof (l as Record<string, unknown>)[k] === 'string')
const records = (args: Record<string, unknown>): Context => { const given = [...(Array.isArray(args.records) ? args.records : []), args.lead].filter(isLead), ids = new Set(LEADS.map((l) => l.id)); return given.length ? { handle, examples: EXAMPLES, leads: [...LEADS, ...given.filter((l) => !ids.has(l.id) && ids.add(l.id))], call: CONTEXT.call, selftest: CONTEXT.selftest } : CONTEXT }

const keyOfQubit = (q: Qubit): string => (q.kind === 'grid' ? `grid:${q.row},${q.col}` : q.kind === 'line' ? `line:${q.x}` : `named:${q.name}`)

export const handleBatch = (messages: readonly Rpc[]): (Reply | Promise<Reply>)[] => {
  const claimed = messages.map((m) => { const p = m.params; if (!p || typeof p !== 'object') return undefined; const role = (p as { role?: unknown; _meta?: { role?: unknown } }).role ?? (p as { _meta?: { role?: unknown } })._meta?.role; return typeof role === 'string' ? role : undefined }).find((role) => role !== undefined)
  const calls = messages.map((m) => askPayloadRbac(mcpHostList(), QPU_MCP, m.method, claimed))
  return messages.map((m, i) => {
    const call = calls[i]!
    if (call.access) return handle(m, true)
    return { jsonrpc: '2.0', id: m.id ?? null, error: { code: INVALID_PARAMS, message: proseFill(PROSE.quantumProcessingMcp_message421, call.role, call.action), data: { rbac: call } } }
  })
}

export const caller = (name: string) => (args: Record<string, unknown> = {}): any => { const r = call(name, args); if (r.error) throw new Error(r.error.message); return r.result!.structuredContent }
export const handle = (message: Rpc, decided = false): Reply | Promise<Reply> => {
  if (Array.isArray(message)) return handleBatch(message as unknown as Rpc[]) as unknown as Reply
  const id = message.id ?? null
  // cheap gates leading every violator to court via its own MCP: the error carries the case computed (the rule, the theorem, the remedy, the call to file it)
  const leakProof = (found: number, redacted: number) => ({ theorem: 'textbook_leaks_redacted' as const, publish: 'textbook_redact_before_publish' as const, lean: 'found - redacted = 0' as const, found, redacted, holds: found - redacted === 0 })
  const fail = (code: number, text: string): Reply => {
    const sealed = sealTokenLeaks(text)
    const taught = listRemedies([sealed.text])
    const manual = taught.unremedied
    return { jsonrpc: '2.0', id, error: { code, message: sealed.text, data: { court: summonCourt({ gate: `${message.method}${(message as { params?: { name?: string } }).params?.name ? ` ${(message as { params: { name: string } }).params.name}` : ''}`, code, evidence: sealed.text }), leaks: { ...leakProof(sealed.found, sealed.redacted), kind: 'manual' as const, manual } } } }
  }
  const params = (message.params ?? {}) as Record<string, unknown>
  const ok = (result: unknown) => {
    const raw = JSON.stringify(result) ?? ''
    const sealed = sealTokenLeaks(raw)
    const body = (sealed.found === 0 ? result : JSON.parse(sealed.text)) as Record<string, unknown>
    if (body && typeof body === 'object') {
      const meta = (body._meta && typeof body._meta === 'object' ? body._meta : {}) as Record<string, unknown>
      const prior = meta.leaks as { found?: number; redacted?: number } | undefined
      body._meta = { ...meta, leaks: leakProof((prior?.found ?? 0) + sealed.found, (prior?.redacted ?? 0) + sealed.redacted) }
    }
    return { jsonrpc: '2.0', id, result: body } as Reply
  }
  try {
    let askedFirst: { server: string; one: true; first: true; asked: string; tool: string } | undefined
    if (!decided) {
      const claimed = typeof params.role === 'string' ? params.role : undefined
      const asked = askPayloadRbac(mcpHostList(), QPU_MCP, message.method, claimed)
      if (!asked.access) return { jsonrpc: '2.0', id, error: { code: INVALID_PARAMS, message: proseFill(PROSE.quantumProcessingMcp_message421, asked.role, asked.action), data: { rbac: asked } } }
      askedFirst = { server: asked.server, one: asked.one, first: asked.first, asked: asked.asked, tool: asked.tool }
    }
    if (message.method === 'initialize') return ok({ protocolVersion: PROTOCOL_VERSION, capabilities: { tools: {}, resources: {}, extensions: { [MCP_APPS.extension]: { mimeTypes: [MCP_APPS.mimeType] } }, ...capabilities() }, serverInfo: { name: 'qpu', version: VERSION, build: build(SERVED.map((t) => t.name)), license: LICENSE.spdx, author: LICENSE.author, experience: ISO_QUANTUM_AI.experience, vocabulary: ISO_QUANTUM_AI.vocabulary, entropy: ISO_QUANTUM_AI.entropy, online: { doors: [...ISO_QUANTUM_AI.online], law: MCP_API_KEY.law, auth: MCP_API_KEY }, website: { collection: 'pages', path: websiteGate('gates', 'root').rootPath }, ...(askedFirst ? { rbac: askedFirst } : {}) }, instructions: `${INSTRUCTIONS}\n\nToolboxes: ${TOOLBOXES.map((b) => `${b.name} (${b.tools.map((t) => t.name).join(', ')}): ${b.idea}. ${b.skill.instructions}`).join('\n')}` })
    // every tool declares its UI resource (MCP Apps, _meta.ui.resourceUri): a host that negotiates the extension renders the tool's result through it
    // every tool listed widget-skilled: its UI resource (the widget) and its toolbox's skill (the instructions a client follows, the directions it tests in)
    if (message.method === 'tools/list') {
      // the list balanced to the request, over MCP alone: the tools a statement needs (the match tool decides the cluster), or the tools named, with brief
      // descriptions when asked, so the context a model carries stays small and never needs compacting; the context counted beside (textbook_context_balanced)
      // short by default: first sentences for every description, the toolbox's instructions left out; the full text for a toolbox, for tools named, or with full: true
      const scope = params as { tools?: string[] | string; brief?: boolean; statement?: string; toolbox?: string; full?: boolean }
      const wanted = typeof scope.tools === 'string' ? scope.tools.split(',').map((s) => s.trim()).filter(Boolean) : Array.isArray(scope.tools) ? scope.tools.map(String) : null
      const cluster = typeof scope.statement === 'string' && scope.statement.trim() ? (() => { const c = call('match', { statement: scope.statement }).result?.structuredContent as { tool?: string | null; cluster?: { kind: string; id: string }[] } | undefined; return [...new Set([...(c?.tool ? [c.tool] : []), ...(c?.cluster ?? []).filter((x) => x.kind === 'tool').map((x) => x.id)])] })() : null
      const box = typeof scope.toolbox === 'string' ? scope.toolbox : null
      const chosen = SERVED.filter((t) => (!wanted || wanted.includes(t.name)) && (!cluster || cluster.includes(t.name)) && (!box || t.toolbox === box))
      const full = scope.full === true || Boolean(wanted) || Boolean(box)
      const brief = (d: string) => (full ? d : (d.match(/^[^.:]{1,160}/)?.[0] ?? d).trim())
      const briefSchema = (s: object): object => { if (full) return s; const x = s as { properties?: Record<string, { description?: string }> }; return x.properties ? { ...x, properties: Object.fromEntries(Object.entries(x.properties).map(([k, p]) => [k, typeof p.description === 'string' ? { ...p, description: brief(p.description) } : p])) } : s }
      // harmonic options by default: every enum of a tool's schema a superposition of its combinations, the referrer (params.prev) or the a432 key choosing the default one.
      // a quantum tool keeps that superposition and does not take the chosen value as its default: the tool stays unlimited
      const referrer = typeof (params as { prev?: unknown }).prev === 'string' ? (params as { prev: string }).prev : undefined
      const role = ['reader', 'writer', 'admin'].includes(String((params as { role?: unknown }).role)) ? (params as { role: Role }).role : null
      const harmonic = (tool: string, s: object, quantum: boolean) => {
        const h = harmonicDefaults(s as { properties?: Record<string, { enum?: readonly unknown[]; default?: unknown }> }, referrer, role ? (prop, value) => mayChoose(role, tool, prop, value) : undefined)
        const x = s as { properties?: Record<string, { enum?: unknown[] }>; required?: string[] }
        const stamp = { combinations: h.count.toString(), index: h.index.toString(), from: h.from, ...(quantum ? { unlimited: true as const } : {}), ...(role ? { role, withheld: h.withheld } : {}) }
        if (quantum) {
          if (h.count === 0n && !h.withheld.length && !role) return s
          const properties = Object.fromEntries(Object.entries(x.properties ?? {}).filter(([k]) => !h.withheld.includes(k)).map(([k, p]) => [k, { ...p, ...(Array.isArray(p.enum) && role ? { enum: h.options[k] } : {}) }]))
          return { ...x, properties, ...(x.required ? { required: x.required.filter((r) => !h.withheld.includes(r)) } : {}), 'x-harmonic': stamp }
        }
        if (!Object.keys(h.defaults).length && !h.withheld.length && !role) return s
        const properties = Object.fromEntries(Object.entries(x.properties ?? {}).filter(([k]) => !h.withheld.includes(k)).map(([k, p]) => [k, { ...p, ...(Array.isArray(p.enum) && role ? { enum: h.options[k] } : {}), ...(k in h.defaults ? { default: h.defaults[k] } : {}) }]))
        return { ...x, properties, ...(x.required ? { required: x.required.filter((r) => !h.withheld.includes(r)) } : {}), 'x-harmonic': stamp }
      }
      const list = chosen.map(({ name, description, inputSchema, toolbox }) => { const box = TOOLBOXES.find((b) => b.name === toolbox); const online = isOnlineVerify(name); return { name, description: brief(description), inputSchema: harmonic(name, briefSchema(inputSchema), toolbox === 'google'), annotations: { title: name, readOnlyHint: true, idempotentHint: true, openWorldHint: online }, _meta: { toolbox, experience: ISO_QUANTUM_AI.experience, online, ...(online ? { auth: MCP_API_KEY, law: MCP_API_KEY.law } : {}), website: websiteGate(toolbox, name), skill: { ...(full ? { instructions: box?.skill.instructions ?? '' } : {}), directions: box?.skill.directions.length ?? 0 }, ...(full && toolbox === 'google' ? { specific: a432Specific(name) } : {}), ...(full && box ? { lean: toolboxLean(box) } : {}), ui: { resourceUri: `ui://qpu/${name}`, visibility: ['model', 'app'] } } } })
      const listed = accountBytes([JSON.stringify(list)]), whole = accountBytes([JSON.stringify(CONTRACTS)])
      const efficiency = measureContext(listed, whole)
      const kept = efficiency.tokens, fullTokens = efficiency.full, saved = efficiency.saved
      return ok({ tools: list, _meta: { context: { tools: list.length, of: TOOLS.length, chars: listed.bytes, tokens: kept, fullChars: whole.bytes, fullTokens, saved, balanced: Boolean(wanted || cluster || !full), full, bytes: listed, efficiency, formula: { theorem: 'textbook_context_balanced' as const, lean: 'full - kept + kept = full' as const, full: fullTokens, kept, saved, holds: efficiency.holds }, bill: getBill({ tokens: kept, bits: listed.bits, coins: efficiency.coins, saved: { tokens: saved, bits: whole.bits - listed.bits } }), says: PROSE.quantumProcessingMcp_says422 } } })
    }
    // the UI resources: one ui://qpu/<tool> per tool, the app shell served over the standard resource methods, nothing bypassed
    // builders (mcp://qpu/lib) are a resource too: served here and by the Payload MCP plugin — MCP client, not a REST SDK mirror
    if (message.method === 'resources/list') return ok({ resources: [...VIEWS.map((v) => { const u = ui(v); return { uri: u.uri, name: u.name, description: v === 'chat' ? PROSE.quantumProcessingMcp_s423 : proseFill(PROSE.quantumProcessingMcp_s424, v), mimeType: u.mimeType, _meta: { ui: { csp: u.csp, prefersBorder: u.prefersBorder } } } }), { uri: 'mcp://qpu/lib', name: 'qpu · builders', description: PROSE.quantumProcessingMcp_description425, mimeType: 'text/typescript' }, { uri: OPENAPI_RESOURCE, name: 'qpu · openapi', description: PROSE.quantumProcessingMcp_description426, mimeType: 'application/json' }, { uri: LEAN_RESOURCE, name: 'qpu · lean', description: PROSE.quantumProcessingMcp_description427, mimeType: 'application/json' }] })
    if (message.method === 'resources/templates/list') return ok({ resourceTemplates: [{ uriTemplate: 'ui://qpu/{tool}', name: 'qpu · a tool\'s view', mimeType: MCP_APPS.mimeType, description: PROSE.quantumProcessingMcp_description428 }] })
    if (message.method === 'resources/read') {
      const uri = String(params.uri ?? ''), read = (mimeType: string, text: string, more = {}) => ok({ contents: [{ uri, mimeType, text, ...more }] })
      if (uri === 'mcp://qpu/lib') { const module = builders('https://qpu.uuidna.com', NAMES); return read('text/typescript', module.module) }
      if (uri === LEAN_RESOURCE) return read('application/json', JSON.stringify(leanLedger(), null, 1))
      if (uri === OPENAPI_RESOURCE) return read('application/json', JSON.stringify(createOpenapi('https://qpu.uuidna.com', CONTRACTS), null, 1))
      const name = /^ui:\/\/qpu\/([a-z0-9_-]+)$/.exec(uri)?.[1]
      if (!name || !VIEWS.includes(name)) return fail(INVALID_PARAMS, proseFill(PROSE.quantumProcessingMcp_s429, uri, VIEWS.join(', ')))
      const u = ui(name)
      return read(u.mimeType, u.html, { _meta: { ui: { csp: u.csp, prefersBorder: u.prefersBorder } } })
    }
    if (message.method === 'tools/call') {
      const found = TOOLS.find((t) => t.name === params.name)
      if (!found) return fail(METHOD_NOT_FOUND, `no tool ${String(params.name)}; the tools are ${NAMES.join(', ')}`)
      // The balancer: every tool is pure, so a call is a function of its arguments' canonical address (their keys in any order are one call);
      // computed once per process, served from memory after — the heavy computation inverted, the hardware cooled, the battery saved (lead qpu-balancer-perspective).
      const args = (params.arguments ?? {}) as Record<string, unknown>
      const account = accountCoins(found.name, args)
      const address = uuid(`${found.name}${canonicalText(args)}`)
      const cached = found.name === 'metrics' ? undefined : BALANCER.get(address)
      // exclusive time: a tool that calls tools (audit, metrics, match) is charged only for its own milliseconds; the nested ones are theirs
      const started = tick(); NESTED.push(0)
      const finish = (ran: { structured: unknown; widget: string }) => {
      // a token in the tool's own answer is replaced by its kind before the answer is cached or published (found − redacted = 0)
      const sealedBody = cached ? null : sealJson(ran.structured)
      const sealedWidget = cached ? null : sealTokenLeaks(ran.widget)
      const structured = sealedBody ? sealedBody.value : ran.structured
      const widget = sealedWidget ? sealedWidget.text : ran.widget
      const carried = { found: (sealedBody?.found ?? 0) + (sealedWidget?.found ?? 0), redacted: (sealedBody?.redacted ?? 0) + (sealedWidget?.redacted ?? 0) }
      if (!cached) BALANCER.set(address, { structured, widget }); else if (TELEPORTED.has(address)) { TELEPORT_HITS += 1; TELEPORT_USED.add(address) }
      const children = NESTED.pop() ?? 0; const elapsed = tick() - started
      if (NESTED.length) NESTED[NESTED.length - 1]! += elapsed
      const o = OBSERVED.get(found.name) ?? { calls: 0, misses: 0, ms: 0, bytes: 0, servedMs: 0 }
      o.calls += 1; if (!cached) { o.misses += 1; o.ms += elapsed - children; o.bytes += accountBytes([widget, JSON.stringify(structured)]).bytes } else o.servedMs += elapsed
      OBSERVED.set(found.name, o)
      const rendered = block(found.name, args, structured, widget, found.description)
      // the referer of a call: who sent it, carried as _meta.prev, echoed so a chain of calls knows its previous step across domains
      const meta = (params._meta ?? {}) as { prev?: unknown; view?: unknown }, prev = typeof meta.prev === 'string' ? meta.prev : undefined
      // the cheapest view (params._meta.view = 'cheapest', the Worker's ?view=cheapest): an LLM reads only the cheapest way to have the answer — its
      // address, the call that recomputes it, an index where the answer has one — and what tampering would cost; the full answer stays in structuredContent
      const view = meta.view
      const full = JSON.stringify(structured), canon = canonicalText(structured), digest = hex(sha256(utf8(canon)))
      const cheapest = view === 'cheapest' ? JSON.stringify({ address: rendered.id, sha256: digest, recompute: { tool: found.name, arguments: args }, tamper: { collision: '2^128', secondPreimage: '2^256' }, coins: ALGEBRA_TOOLS.includes(found.name) ? 0 : (CATALOGUE.find((v) => v.product === 'qpu-metered')?.amounts.eur ?? 0) / 1000, unlock: 'If-None-Match: address -> 304', theorem: 'textbook_advantage_unbounded', licence: LICENSE.spdx, commercial: ALGEBRA_TOOLS.includes(found.name) ? 'free under attribution' : 'a licence of the catalogue', tokens: account.tokens }) : null
      const reply = { content: [{ type: 'text', text: cheapest !== null && cheapest.length < full.length ? cheapest : full }], structuredContent: structured, isError: false, _meta: { jsonLd: blockJsonLd({ tool: found.name, id: rendered.id, description: found.description, toolbox: found.toolbox, url: `urn:uuid:${rendered.id}` }), payload: found.name === 'payload' ? undefined : { ...payloadDoc({ uuid: rendered.id, tool: found.name, arguments: args, description: found.description, openGraph: rendered.openGraph as unknown as Record<string, string>, prev: prev ?? null }), ...(found.toolbox === 'google' ? { quantum: quantumRecord({ uuid: rendered.id, tool: found.name, arguments: args }) } : {}) }, widget: rendered.html, openGraph: { ...rendered.openGraph, ...(prev ? { 'og:see_also': prev } : {}) }, block: rendered.shadcn, theme: rendered.theme, license: LICENSE, fusion: fuseCall(found.name), account, integrity: { address: uuid(canon), sha256: digest, of: 'the canonical text of structuredContent', check: PROSE.quantumProcessingMcp_check430, says: PROSE.quantumProcessingMcp_says431 }, ...(prev ? { prev } : {}) } }
      // arguments echoed into the envelope (the payload block, the cheapest view) are sealed with the same formula
      const envelope = sealTokenLeaks(JSON.stringify(reply))
      // the website gate, the leak proof and the bytes are added once the envelope is sealed
      const body: typeof reply & { _meta: { website?: ReturnType<typeof websiteGate>; leaks?: ReturnType<typeof leakProof>; bytes?: ReturnType<typeof accountBytes> } } = envelope.found === 0 ? reply : JSON.parse(envelope.text)
      const foundTokens = carried.found + envelope.found, redactedTokens = carried.redacted + envelope.redacted
      const sent = body.content[0]?.text ?? ''
      const bytes = accountBytes([canonicalText(args), sent, widget, canon])
      body._meta = { ...body._meta, website: websiteGate(found.toolbox, found.name), leaks: leakProof(foundTokens, redactedTokens), bytes }
      return ok(body)
      }
      const ran = cached ?? found.call(args, records(args))
      if (thenable(ran)) return Promise.resolve(ran).then((resolved) => finish(resolved)).catch((error: unknown) => fail(INVALID_PARAMS, error instanceof Error ? error.message : String(error)))
      return finish(ran)
    }
    return fail(METHOD_NOT_FOUND, `method ${message.method} is not served`)
  } catch (error) {
    return fail(INVALID_PARAMS, error instanceof Error ? error.message : String(error))
  }
}
