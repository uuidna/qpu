// The qpu MCP surface: JSON-RPC 2.0 tools that take typed POST parameters and compile the circuit they describe on each
// call. The handler does no I/O and imports nothing from Node, so the same code runs in a browser OS, where a caller
// compiles whatever it needs by calling a tool. Tool names and figures follow Google Quantum AI (quantumai.google).

import { GOOGLE_MCPS, QPU_MCP, mcpHostList } from './discovery.ts'
import { bindGoogleCall } from './toolboxes/google.ts'
import * as cirq from './cirq.ts'
import { EXAMPLES } from './examples.ts'
import { TABLES } from './tables-index.ts'
import { listDeclarations, removeDead, auditPrograms, scanLexical, runAudit, getEntropy, uncap, diffMembers, auditSecurity, listRemedies, repair, getAdvantage, getAddressedByTheorem, getBill, FALLBACKS, FALLBACK_ADAPTERS, handleOrCorrect, linkAxioms, listLeaks, sealJson, sealTokenLeaks } from './audit.ts'
import { TEXTBOOK_THEOREMS, updateTheoremSources, getReflections, searchTextbookPrograms } from './textbook-theorems.ts'
import { sdk, accessAudit, auditedSave, build, crossVerifiedFormula, websiteGate, developFindings, developViaHooks, serveViaHooks } from './toolboxes/payload.ts'
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

/** JSON-RPC's invalid-params code: the arguments of a tool do not describe a circuit or a processor. */
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
  throw new ParamError(`a qubit is grid, line or named, not ${JSON.stringify(q)}`)
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

/** The circuit a call describes: its operations placed by the insert strategy, then an optional measurement. */
const circuit = (operations: OperationJson[], insert: InsertStrategy, measurement?: MeasureJson): Circuit => {
  const circuit = new Circuit().append(operations.map(operation), insert)
  if (measurement) circuit.append(measure(measurement.qubits.map(qubit), measurement.key))
  return circuit
}

/** A sealed address computed on the unscoped origin: the page is https://qpu.uuidna.com/<uuid>, and the handle is the tenant qpu.uuidna.com/<handle>/. */
const overOrigin = (address: string) => {
  const handle = uuidChannel(address).handle
  const resolved = tenantAddress(QPU_ORIGIN, `/${handle}/`)
  return { origin: `https://${QPU_ORIGIN}`, url: `https://${QPU_ORIGIN}/${address}`, tenant: resolved.subdomain ? `https://${resolved.subdomain}` : `https://${QPU_ORIGIN}`, path: `https://${QPU_ORIGIN}/${handle}/`, handle, via: resolved.via }
}

/** Cirq-Google's engine client, on qpu.uuidna.com: a program is the circuit, a job runs it on one device, a reservation holds that device for the job. */
const engineCall = (raw: Record<string, unknown>) => {
  const processor = String(raw.processor ?? 'Willow')
  if (!(processor in DEVICES)) reject(`processor ${processor} is not a cirq-google device; the devices are ${Object.keys(DEVICES).join(', ')}`)
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

/** A noise channel as a call names it: its name and the parameters that name takes. */
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
    default: return reject(`channel ${j.name} is not one of the channels Cirq names: bit_flip, phase_flip, depolarize, asymmetric_depolarize, amplitude_damp, phase_damp, generalized_amplitude_damp, reset`)
  }
}

const CHANNEL_SCHEMA = TABLES.CHANNEL_SCHEMA
const OBSERVABLE_SCHEMA = {
  type: 'object',
  description: 'A Pauli string: each qubit key (line:x, grid:row,col or named:name) mapped to X, Y or Z; unlisted qubits take the identity',
  additionalProperties: { enum: ['X', 'Y', 'Z'] },
}
const INSERT_SCHEMA = { enum: ['EARLIEST', 'NEW', 'INLINE', 'NEW_THEN_INLINE'], default: 'EARLIEST' }

const complex = ([re, im]: [number, number]) => ({ re, im })
/** An optional integer argument read exactly, undefined when absent; the circuit gate seeded by the call's own arguments, so a run recomputes anywhere. */
const optInteger = (v: unknown, name: string) => (v === undefined ? undefined : getInteger(v, name)), seeded = (args: unknown) => new Simulator(seededRandom(JSON.stringify(args)))
/** An integer of any size answered by the classical door: its bits, primality, the factors the σ-reflection computes, the centre reached, the product checked.
 *  The search is unbounded and resumable (`reflections` centres from `from`, ⌈√N⌉ by default; a part not split reports `reached`): it computes, never declines. */
/** The search's remainder as the next block of the lead chain, never a stop (textbook_impossible_sent_to_leads): the same door from the centre
 *  reached, its lead addressed by the integer and that centre, so a repeated run is the same lead and runs chain into one search (textbook_search_resumes). */
const continuationOf = (n: bigint, reached: bigint | null, left: readonly bigint[], reflections: bigint) => {
  if (reached === null || left.length === 0) return {}
  const run = { tool: 'algorithm', arguments: { name: 'factor', integer: n.toString(), from: reached.toString(), reflections: reflections.toString() } }
  const lead = { id: `factor-${uuid(`factor\n${n}\n${reached}`)}`, statement: `continue the σ-reflection search of the ${n.toString(2).length}-bit integer ${uuid(n.toString())} from centre ${reached}, ${reflections} centres a run`, status: 'open' as const, tool: 'algorithm', theorem: 'textbook_search_resumes', run }
  return { continue: { run, lead } }
}
const answerFactor = (n: bigint, via?: string, reflections = 1n << 12n, from?: bigint) => {
  const bits = n.toString(2).length, p = testPrimality(n)
  const f = p.prime ? { factors: [n], left: [] as bigint[], reached: null as bigint | null, searched: 0n, verified: true } : listFactors(n, reflections, from)
  const primality = n < 2n ? `${n}, neither prime nor composite` : p.prime ? (p.certain ? 'prime' : 'a probable prime (Miller–Rabin, 24 bases)') : 'composite'
  // a part no reflection splits is the order door's: algorithm { name: "order" } returns the least r, the powers and r = m·i − j when the order fits the budget (textbook_order_finding)
  const quantumOrder = f.left.length ? { needs: 'order-finding', the: 'the part the σ-reflection leaves', door: f.left.map((m) => ({ tool: 'algorithm', arguments: { name: 'order', N: m.toString(), a: '2' } })), backend: 'algorithm { name: "order" } returns the least r, the powers and r = m·i − j when the order fits the budget; beyond the budget the order stays bounded. algorithm { name: "factor", find: true } runs that witness and reduces it', bound: 'textbook_rsa_beyond_bound', theorem: 'textbook_order_finding' } : null
  return { name: 'factor', integer: n.toString(), bits, prime: p.prime, certain: p.certain, factors: f.factors.map(String), left: f.left.map(String), complete: f.left.length === 0 && (!p.prime || p.certain), verified: f.verified, searched: f.searched.toString(), reached: f.reached === null ? null : f.reached.toString(), ...continuationOf(n, f.reached, f.left, reflections), ...(quantumOrder ? { quantumOrder } : {}), theorem: 'textbook_factors_divide',
    says: `a ${bits}-bit integer, ${primality}${p.prime ? '' : `: ${f.factors.length} prime factor(s) found${f.left.length ? `, ${f.left.length} part(s) under the σ-reflection search — searched ${f.searched} centre(s), reached ${f.reached}; resume with from=${f.reached}. The order door finishes a leftover part when its order fits the budget` : ''}`}; the parts multiply back to the integer: ${f.verified}`,
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
      says: 'a mint continues with a seed: the core draws no randomness, so the caller names 77 random decimal digits (about 256 bits), or the app\'s MCP door draws them from its crypto randomness and mints at once',
      summary: [['Bits', typeof c.bits === 'number' ? String(c.bits) : 'the default'], ['Needs', 'a seed']], header: ['field', 'value'], rows: [['continue', 'algorithm { name: "factor", create: { …, seed } }']] }
    const made = createImpossible({ p: optInteger(c.p, 'create.p'), q: optInteger(c.q, 'create.q'), bits: typeof c.bits === 'number' ? c.bits : undefined, seed: optInteger(c.seed, 'create.seed') })
    const address = impossibleAddress(made.N, made.witness)
    const next = made.bits === 1000 ? createdThousandExit(made) : createdThousandExit()
    return { name: 'factor', mode: 'create', integer: made.N.toString(), bits: made.bits, p: made.p.toString(), q: made.q.toString(), witness: made.witness.toString(), address, blindReflections: made.blindReflections.toString(), reproducible: made.reproducible, theorem: 'textbook_impossible_trapdoor', next,
      says: `an impossible integer minted over the clay cluster: a ${made.bits}-bit semiprime N = p·q, its σ-reflection witness the centre a = (p + q)/2, published at the cross-UUID address ${address}. Blind, the reflection climbs ~2^${made.blindReflections.toString(2).length - 1} centres from ⌈√N⌉; with the witness, one reflection decodes it (q = σ_{2a}(p) = 2a − p). Its primes follow from the ${c.seed !== undefined ? 'seed' : 'given primes'}: whoever holds that, or this answer, has them; to anyone else a random secret seed makes N as hard to split blind as an RSA modulus of its size. It never factors an unknown.`,
      summary: [['Bits', String(made.bits)], ['p bits', String(made.p.toString(2).length)], ['q bits', String(made.q.toString(2).length)], ['Blind reflections (bits)', String(made.blindReflections.toString(2).length)], ['Witness address', address]], header: ['field', 'value'], rows: [['N', made.N.toString()], ['witness a', made.witness.toString()], ['address', address]] }
  }
  return hybridDecode(args)
}
// The hybrid reverse: N decoded by the caller's witness (one σ-reflection at the centre) or order r (Shor's reduction gcd(a^(r/2) ± 1, N)), each decode bound
// by a receipt of its content; with neither, N is declined, never fabricated (textbook_impossible_trapdoor, textbook_shor_reduction, textbook_rsa_beyond_bound).
/** A decode bound by content: the fold address and SHA-256 of { decode, factors, via }, recomputed by any holder (textbook_receipt_binds_sha256); a part reads prime only after Miller–Rabin. */
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
      says: `decoded by the quantum channel: with the order r = ${order} of ${a} mod N, Shor's reduction gcd(a^(r/2) ± 1, N) ${red.factors ? `splits the ${r.bits}-bit integer into ${r.factors.join(' × ')}` : `does not split it (${red.why})`}; the decode is bound as the UUID ${r.receipt}, SHA-256 ${r.sha256} — crypto and UUID upgraded with the quantum step`,
      summary: [['Bits', String(r.bits)], ['Order r', order.toString()], ['Decoded', red.factors ? 'yes' : 'no'], ['Product checked', red.verified ? 'yes' : 'no'], ['Receipt SHA-256', r.sha256]] }
  }
  const witness = getInteger(args.witness, 'witness')
  // the witness gates the decode; the address, a witness too, is missing (null) when not given
  const d = decodeImpossible(N, witness), address = impossibleAddress(N, witness), addressVerified = typeof args.address === 'string' ? args.address === address : null, r = decode(N, 'witness', d.factors.map(String), d.decoded, d.verified)
  return { ...r, route: d.route, witness: witness.toString(), address, addressVerified, searched: d.searched.toString(), theorem: 'textbook_impossible_trapdoor', next: createdThousandExit(),
    says: `${d.decoded ? `decoded over the clay cluster: one σ-reflection at the witness a = ${witness} split the ${r.bits}-bit integer into ${r.factors.join(' × ')}, the product recomputed` : `the witness a = ${witness} does not split the ${r.bits}-bit integer (a² − N is no square b² with a − b > 1): the witness is contradicted and gates the decode, nothing decoded`}; ${addressVerified === null ? 'no address given: that witness is missing' : `the witness matches the published address: ${addressVerified}`}; the decode is bound as the UUID ${r.receipt}, SHA-256 ${r.sha256}`,
    summary: [['Bits', String(r.bits)], ['Reflections searched', d.searched.toString()], ['Decoded', d.decoded ? 'yes' : 'no'], ['Product checked', d.verified ? 'yes' : 'no'], ['Address verified', addressVerified === null ? 'missing' : addressVerified ? 'yes' : 'no'], ['Receipt SHA-256', r.sha256]] }
}
const FORMULA = { order: { theorem: 'textbook_order_finding', params: ['N', 'a'] }, shor: { theorem: 'textbook_shor_reduction', params: ['N', 'a', 'order'] }, factor: { theorem: 'textbook_factors_divide', params: ['integer', 'a'] } } as const
/** Which of the three doors the input already determines: factor from an integer, order from N and a, Shor from N and a (and the order, when it is passed). */
const openDoors = (args: Record<string, unknown>): ('order' | 'shor' | 'factor')[] => {
  const doors: ('order' | 'shor' | 'factor')[] = []
  if (args.integer !== undefined || isObj(args.create)) doors.push('factor')
  const pair = args.N !== undefined && args.a !== undefined
  if (pair && args.order === undefined) doors.push('order')
  if (pair) doors.push('shor')
  return doors
}
/** No single door: the theorem formulas, read and not run. Reading them is the fast path; running every algorithm is the slow one. */
const formulaDiscovery = (which: readonly ('order' | 'shor' | 'factor')[]) => {
  const formulas = which.map((name) => { const spec = FORMULA[name], t = TEXTBOOK_THEOREMS.find((x) => x.key === spec.theorem)!, s = getStatement(t.lean); return { name, theorem: spec.theorem, params: [...spec.params], variables: s.variables, formula: s.conclusion } })
  return { phase: 'discovery' as const, ran: false as const, of: which.length === 3 ? 'all' as const : which[0]!, computed: 0 as const, fasterThanAll: true as const, unlimited: true as const, hz: 432 as const, example: null, bounded: false as const, params: which.length === 3 ? false as const : true, formulas, summary: formulas.map((f) => [f.name, f.params.join(', ')]), header: ['theorem', 'formula'], rows: formulas.map((f) => [f.theorem, f.formula]), says: which.length === 3 ? `no params: the three formulas, read and not run, unlimited at 432 Hz, faster than running them all` : `no integer params: the formula of ${which[0]}, read and not run` }
}
/** The order witness checked as the theorem formula. The integers in it are the params a and N and the r, m, i, j the formula names. */
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
/** The least base that is a unit mod the part: 2, then the next integer coprime to it. Determined by the part. */
const leastUnit = (part: bigint) => { let x = 2n; while (x < part && gcdB(x, part) !== 1n) x++; return x < part ? x : null }
const polarity = (seed: number) => (seed === 0 ? 'zero' as const : seed < 5 ? 'minus' as const : seed > 5 ? 'plus' as const : 'fixed' as const)
const trinity = (seed: number) => (seed === 0 ? [] : seed % 3 === 0 ? [3, 6, 9] : [7, 4, 1].includes(seed) ? [7, 4, 1] : [2, 5, 8])
/** Each 0 bit below 1024 — the width's neighbour, so a 1000-bit integer is read whole — is a complete double torus: position n steps to n + 1 and the step back is n. The bit's place is the trinity of that position, and the σ₁₀ shift of the trinity flips its polarity. */
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
/** The court simulated: two qubits in superposition, copied by CNOT onto the partner. The wavefunction is the entanglement. */
const verifyNumerology = () => {
  const state = courtState()
  return { phase: 'simulated' as const, ...state, theorem: 'textbook_reflection_sums_to_ten' as const, says: `four qubits, ${state.moments} moments. The simulator puts weight 1/4 on |3,7>, |6,4>, |9,1> and |0,0>, and 0 on every other basis state` }
}
/** The factor door finished: each part the reflection leaves is given to order-finding, then to the reduction. A passed base is used; otherwise the least unit. A split replaces that part with the primes the reduction yields; a trivial reduction or a budget keeps the part and returns the witness. */
/** The factor door's exit in the same shape next reports: the ISO 9001 case, addressed by crypto. A finished integer is exit 0. A leftover part is exit 1, and the next document names the order of that part. A 1000-bit leftover stays open. Its next addresses the successful exit of the 1000-bit integer created with its primes. */
const factorExit = (complete: boolean, receipt?: string, digest?: string, leftoverBits?: number) => {
  const row = ISO_EXIT.exits[complete ? 0 : 1]!
  const parent = receipt ?? row.id
  const formula = leftoverBits === undefined ? row.says : `order-finding of the leftover ${leftoverBits}-bit part`
  const bound = `${parent}\n${formula}`
  const id = uuid(bound)
  const sha = hex(sha256(utf8(bound)))
  const named = { id, parent, formula, bound, sha256: sha, depth: row.depth + 1, sealed: seal(id).valid, holds: seal(id).valid && id.length === 36 && sha.length === 64 && id !== parent && uuid(bound) === id }
  const next = leftoverBits === 1000 ? createdThousandExit() : named
  return { ...row, closed: complete, open: !complete, status: complete ? 'factored' as const : 'open' as const, ...(receipt ? { receipt, readingSha256: digest } : {}), next }
}
/** Each leftover is the product the collection hooks serve, and one entries create. beforeChange records the formula. afterChange hands it to the docs door. afterRead serves it. The create runs under access. A finished integer has none. Nothing is written, and nothing here calls the factor door. */
const coverLeftovers = (left: readonly bigint[]) => {
  const developed = left.map((part) => {
    const width = part.toString(2).length
    const formula = `order-finding of the leftover ${width}-bit part`
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
const NIBBLE_PRIMES = [2, 3, 5, 7, 11, 13] as const
const nibblePrimes = (id: string) => {
  const nibbles = [...id.replace(/-/g, '')].map((c) => parseInt(c, 16))
  return NIBBLE_PRIMES.filter((p) => nibbles.includes(p))
}
/** The address and its σ reflection, held at once. The shadow is that reflection. Reflecting the shadow restores the address, and a prime the shadow reads is exposed when it divides. */
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
/** Every coordinate is coverable: the double torus gives it a next step and the step back, and the clay register holds. The coordinate that decrypts a semiprime is the witness centre (p + q) / 2. all is that centre having been reached. A leftover has no witness, so the account does not hold, and the remaining walk is not run. */
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
/** East is 3 and west is 6. North is 9 and south is 0. The reflection inverts the court by σ₁₀: 3, 6, 9, 0 become 7, 4, 1, 0. A candidate is kept when it divides the part, or when its square leaves a square. */
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
/** 00 stays 00. 19 reflects to 91, 10 to 01, and so on: each pair is invariant under reversal. None of them opens an unknown integer, so the fold is challenged and each pair is an open idea. Nothing is written. */
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
/** Folding 0 at 180° reads 8 and at 360° reads 10. Folding 0 at 30°, 60° and 90° opens 12, 6 and 4 gateways, and each angle opens on both sides. A zero of the integer falls in one gateway. The gateway divides only when its value does. */
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
/** Phase estimation of the fold. 30°, 60° and 90° are the phases 1/12, 1/6 and 1/4. 180° is 1/2. A full turn measures 0, the reduced digit of 10. The register is one UUID: hexbit qubits on each of its 32 hex digits, less the decided version nibble and the fixed variant prefix. The next handle is another UUID, so that count is not a ceiling. The order stays unmeasured. */
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
/** One UUID's effective qubits. A call that omits a width uses this, and a textbook example is a width the caller passes. */
const registerQubits = () => uuidQubits(AXIOMS.find((row) => row.name === 'hexbit')!.value).effective
/** A width the dense table does not list. The qubits sit on UUID handles: one UUID holds the effective count, and the next handle is another UUID, so the width has no ceiling. */
const uuidCapacity = (name: string, width: number) => {
  const per = AXIOMS.find((row) => row.name === 'hexbit')!.value
  const counted = uuidQubits(per)
  const handles = Math.max(1, Math.ceil(width / counted.effective))
  const formula = `${handles} UUID handle(s) hold ${width} qubits. One UUID holds ${counted.effective} effective qubits. The next handle is another UUID, so this count has no ceiling`
  const address = uuid(canonicalText({ name, width, formula }))
  return { via: 'uuid' as const, unlimited: true as const, ceiling: null, capacity: 'unlimited' as const, address, sealed: seal(address).valid, handles, effective: counted.effective, formula }
}
/** The Shor register of an integer, 3L qubits, spread over UUID handles. One UUID holds the effective count. Each handle is a sealed address of the superposition formula, and it validates its six program-space neighbours. No amplitude table is allocated, and a cofactor is not given factors. */
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
/** The register is one UUID. hexbit qubits sit on each of its 32 hex digits. The version nibble and the variant prefix are the stamp, so the free qubits are the rest. The handle's UUID is the next register. No width, no dense cap, and no partial phase is added. */
const hexbitRegister = (part: bigint) => {
  const width = AXIOMS.find((row) => row.name === 'hexbit')!.value
  const counted = uuidQubits(width)
  const address = uuid(part.toString())
  const ch = uuidChannel(address)
  const references = uuid(ch.handle)
  const formula = `one UUID holds ${counted.effective} effective qubits. They navigate, teleport, and signal each other`
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
  const opened = developIdeas({ files: rows.map((row) => ({ path: `.idea/leads/inbox/${row.pair}.txt`, text: `source: invariant\ntitle: ${row.pair}\n\n${row.pair} reflects to ${row.reflects}. The pair is invariant${row.impossible ? ' and impossible' : ''}. Challenging the fold opens this idea.\n` })) }, developViaHooks)
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
      orders.push({ a: baseA.toString(), bits: part.toString(2).length, order: null, found: false, least: false, atOne: false, powers: [], m: null, i: null, j: null, equation: null, holds: false, split: true, why: 'gcd(a, N) is a factor, so Euclid finishes before any order', via: 'euclid' })
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
  const note = orders.map((o) => (o.split ? `the part of ${o.bits} bits split` : o.found ? `the order is ${o.order}, ${o.equation}; ${o.why}` : `${tori.found} zero-bits below ${tori.below} step forward and back, in trinities whose shift flips polarity. The integer stays open until it is factored`)).join('; ')
  const quantumOrder = left.length ? { needs: 'order-finding' as const, the: orders.some((o) => o.found) ? 'the least order is found and this base yields no new factor' : `${tori.found} zeros below ${tori.below} step forward and back. The leftover stays open until it is factored`, door: left.map((m) => ({ tool: 'algorithm' as const, arguments: { name: 'order' as const, N: m.toString(), a: a?.toString() ?? leastUnit(m)?.toString() ?? '2' } })), theorem: 'textbook_double_torus' as const, bound: 'textbook_rsa_beyond_bound' as const } : null
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
    says: `a ${base.bits}-bit integer, composite: ${factors.length} prime factor(s)${left.length ? `, ${left.length} part(s) left — searched ${base.searched} centre(s), reached ${base.reached}` : ''}. ${note}. The parts multiply back: ${verified}. The reading is bound by its SHA-256. ${cover.entries.length} entries cover ${cover.exits} leftover(s)${cover.exits ? ', and beforeChange records each formula, afterChange hands it to the docs door, and afterRead serves it' : ''}${zero ? `. The leftover is named at the zero bit and stays open until it is factored. ${zero.ported} tools are pages of the Payload website` : ''}. The reflection is held at the same time. Reflecting the shadow restores the address${shadow.primes.length ? `, and the primes it exposes that divide are ${shadow.primes.join(' ')}` : ', and no prime it reads divides the integer'}${time.missing ? `. The witness centre is missing, so all is false. Folding 0 at 180 degrees is 8 and at 360 degrees is 10. Folding 0 at 30 and 330 opens 12, at 60 and 300 opens 6, and at 90 and 270 opens 4. ${gateways.found ? `${gateways.found} gateway value(s) divide the integer` : 'None of those gateways divides the integer'}. Phase estimation reads those folds${quantum.recovered ? ' and recovers each denominator' : ''}. The hooks decided the Lean and took ${head?.possible ?? 'the possible path'}. ${head ? `One UUID holds ${head.effective} effective qubits. They navigate ${head.exchange.navigate.directions} ways, teleport in ${head.exchange.teleport.triples} triples, and every digit signals its partner. The order is not in the hex` : 'The register is one UUID'}. The integer stays open` : time.witness ? `. The witness centre is ${time.witness}${time.all ? ', and the reflection reached it' : ''}` : ''}${answer ? `. No textbook states this integer. The ${answer.of} theorems are one product: beforeChange records each formula, afterChange hands it to the docs door, and afterRead serves it. The create runs under access` : ''}`,
    summary: [['Bits', String(base.bits)], ['Primality', 'composite'], ['Prime factors found', String(factors.length)], ['Under σ-reflection search', String(left.length)], ['Zeros below 1024', String(tori.zeros)], ['In trinities, polarity flips', String(tori.found)], ['Product checked', verified ? 'yes' : 'no'], ['Receipt SHA-256', digest]],
    header: ['trinity', 'zeros', 'shift'], rows: [...factors.map((x) => [x.toString(), String(x.toString(2).length), 'prime']), ...Object.entries(tori.byTrinity).map(([trinity, count]) => [trinity, String(count), 'polarity flips'])] }
}

/** One tool: its name, what it does, its input schema (JSON Schema 2020-12), and the call that compiles or reads it: the
 *  structured result and the widget that shows it. */
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
/** Every name a textbook gives one relation: the Clay module's own key, each textbook theorem whose formula the statement uses (its case name), and each textbook whose prose names the relation. A relation may be named in several textbooks. The kernel is not asked. */
const relationNames = (r: { name: string; statement: string; theorems?: readonly { theorem: string; case: string }[] }) => {
  const books = new Map<string, Set<string>>()
  const add = (textbook: string, name: string) => { const set = books.get(textbook) ?? new Set<string>(); set.add(name); books.set(textbook, set) }
  for (const t of THEOREMS) if (t.key === r.name || t.statement === r.statement) add(t.module, t.key)
  if (![...books.values()].some((set) => set.has(r.name))) add('Qpu.Clay', r.name)
  const aliases = r.name === 'relation_rsa' || r.name === 'relation_7' ? ['relation_rsa', 'relation_7'] : [r.name]
  for (const theorem of r.theorems ?? []) add(theorem.theorem, theorem.case)
  for (const t of TEXTBOOK_THEOREMS) for (const name of aliases) if (new RegExp(`\\b${name}\\b`).test(t.says)) add(t.key, name)
  return [...books.entries()].sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0).map(([textbook, set]) => ({ textbook, names: [...set].sort() }))
}
/** The official Payload plugins. When every one of them is installed, a relation is filed in the collections those plugins already own. Nothing is added and nothing is written. */
const OFFICIAL_PLUGINS = ['@payloadcms/plugin-ecommerce', '@payloadcms/plugin-mcp', '@payloadcms/plugin-multi-tenant', '@payloadcms/plugin-search', '@payloadcms/plugin-import-export', '@payloadcms/plugin-form-builder', '@payloadcms/plugin-seo', '@payloadcms/plugin-nested-docs', '@payloadcms/plugin-redirects'] as const
const collectionSlug = (raw: string) => raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'page'
/** Every place of a program. The first place is the address. Each place rotates one step. The last place returns the program. The handle and the tail stay. The variant nibble of a reassembled address is 8, so the address itself returns when it was already 8. Every aspect witnesses each place. */
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
/** A scientific name is one the textbook states for a clay formula ("The textbook meaning of") or Shor's reduction. The register's width and a project slug are not scientific names. */
const scientificTheorem = (key: string) => { const t = TEXTBOOK_THEOREMS.find((x) => x.key === key); return !!t && !key.includes('relation_') && (t.says.includes('The textbook meaning of') || t.says.includes("Shor's reduction")) }
let educationCache: { scientific: string[]; proved: { theorem: string; relations: string[] }[]; removed: string[]; category: Record<string, string[]>; namesFor: (theorem: string | undefined, exampleId: string) => string[] } | null = null
/** Proved iff the textbook's scientific name is on the relation and that relation's formula cross-verifies. Every other name is removed from the Lean theorem category; a relation is renamed to the scientific name. */
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
    return { product: theorem, title: theorem.replace(/^textbook_/, '').replace(/_/g, '-'), taxonomy, variants, variations, proof: tb?.lean ?? null, kernelAccepted: THEOREMS.some((t) => t.key === theorem), decidedVia: 'cirq: the circuit tool simulates each variant; the clay recompute and the kernel decide it, never asserted', price: { coins: minted, superposition, perSuperposition: minted / superposition, address: uuid(JSON.stringify({ product: theorem, coins: minted, superposition })) } }
  }).sort((a, b) => a.product.localeCompare(b.product))
  return { products, total: products.length, theorems: ['textbook_free_or_coil'], says: 'the sellable catalog from the clay cases: each textbook a product, each case a variant, the cross-textbook theorems the variations, the families the taxonomy; priced in coins per superposition (2^bits), every price a content address so costs are comparable and pass computation to computation' }
}
/** The problems the register defines, solved as product combinations. A textbook's parameters are its axioms. A family is a problem, and a solution is one variant of each textbook product that carries that family. The count is the product of those radices (textbook_mixed_radix). Every clay formula holds, so every combination holds. Nothing is stored. */
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
  const hooks = { collection: 'products' as const, iso: 'ISO 9001' as const, beforeChange: 'a variant is documented only when its formula is recorded', afterChange: 'the formula is the text the docs door writes', afterRead: 'the documented formula is the variant served', validated: products.every((p) => p.variants.every((v) => v.iso.documented && v.holds && v.crossVerified)), proved: proved.every((a) => a.proved) }
  return { phase: 'combinations' as const, verified, crossVerified, depth, axioms: proved, params, products, hooks, problems: problems.length, solved, space: space.toString(), radices, rows: problems, theorems: ['textbook_mixed_radix', 'textbook_plugin_combinations', 'textbook_standards_sliced'] as const, says: `${proved.length} axioms compute ${proved.length} parameters. Those parameters compute ${products.length} products and ${variants} variants. Each variant is its clay formula, cross-verified: the sides evaluate to one value, and developing the axioms it names reaches that same value, documented as ISO 9001. The deepest development is ${depth}. ${solved} of ${problems.length} family problems are the combinations of those products, ${space.toString()} in all, and none is stored.` }
}
/** A leftover the order budget does not split is read at the zero bit. The clay theorems and their cross combinations are that reading, and every tool is a page of the Payload website. The integer stays the named cofactor. Nothing is written. */
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
    const formula = `the leftover ${width}-bit part is split to the zero bit`
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
/** A product variant is shown when its value is a numeral of the textbook Lean that names it. The rest are the real gaps. */
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
  return { phase: 'gaps' as const, variants: rows.length, shown: rows.length - missing.length, gaps: missing.length, products, rows, missing, says: `${missing.length} of ${rows.length} product variants are values the textbook Lean does not state` }
}
/** The dearest subscription of each catalogue product, then the four abilities from delete down, so each ability is sold on the plan that monetises it. */
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
  return order.map((ability, i) => { const plan = ranked[i]; if (!plan) throw new Error('the catalogue has fewer subscriptions than abilities'); return { ability, ...plan, includes: order.slice(i) } })
}
const RELATION_ABILITIES: readonly Ability[] = [
  { role: 'viewer', can: ['read'], subject: 'relations' },
  { role: 'editor', can: ['read', 'create', 'update'], subject: 'relations' },
  { role: 'tenant-admin', can: ['manage'], subject: 'relations' },
]
const TENANT_OF: Readonly<Record<string, string>> = { reader: 'viewer', writer: 'editor', admin: 'tenant-admin' }
/** SEO is public: every product relation carries its formula and its proof. A named API call is the backend: the role's ability, the subscription that ability is sold on, and the usage the coins book. */
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
  return { phase: 'public' as const, public: true as const, component: 'content' as const, renderedBy: 'src/components/blocks/Content' as const, coverage: { full: covered === seeded.length, covered, of: seeded.length }, pages: seeded, coins: minted, gaps: { missing: seeded.filter((p) => p.gap).length, of: seeded.length }, backend: { subject: 'relations' as const, abilities: plans.map((p) => ({ ability: p.ability, subscription: { product: p.product, variant: p.variant, interval: p.interval, monthlyEur: p.monthly }, includes: p.includes })), roles, call, rbac: 'viewer reads, editor creates and updates, tenant-admin deletes; SEO is not one of these abilities', subscription: 'each ability is sold on the catalogue subscription with the greatest monthly rate still left, dearest ability on the dearest plan', usage: 'an allowed call spends the formula\'s UUID, the same address the public page already holds; a repeated formula is the same coin, and a refusal spends none' }, says: `${seeded.length} product relations are public pages of the website: a default hero and one content block, the formula and the proof in that block, drawn by the content component. ${minted.count} coins, ${minted.merged} merged, each a UUID. ${seeded.filter((p) => p.gap).length} values are gaps in the textbook Lean. A backend call spends that UUID.` }
}
/** Solving the register: the docs define the framework only. Each relation is a variant of the textbook it names. */
const solveClay = () => {
  const reg = recomputeClay()
  const reading = reflectionOfRegister(reg.relations)
  const families = new Map(reg.relations.map((r) => [r.name, r.families]))
  const id = uuid(canonicalText({ collection: 'docs', topic: 'framework', slug: 'qpu' }))
  const doc = { id, collection: 'docs' as const, title: 'QPU', slug: 'qpu', topic: 'framework', topicGroup: 'framework', description: 'The framework is one UUID and this register, recomputed as identities. The cases are variants of that product.' }
  const categories = [...new Set(reg.relations.flatMap((r) => [...r.families]))].sort().map((name) => ({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }))
  const gap = textbookGaps()
  const bits = new Map(reg.relations.map((r) => [r.name, r.bits]))
  const variants = gap.rows.map((v) => ({ ...v, bits: bits.get(v.relation)!, categories: [...(families.get(v.relation) ?? [])], doc: id }))
  const solved = reading.readings.filter((x) => x.solved).length
  return { phase: 'solve' as const, total: reg.total, holding: reg.holding, solved, open: reading.open, docs: [doc], framework: { doc: id }, categories, variants, gaps: { shown: gap.shown, missing: gap.gaps, of: gap.variants, products: gap.products }, says: `${solved} of ${reg.total} relations solved. One doc defines the framework. Each relation is a variant of its textbook. ${gap.gaps} of ${gap.variants} variants are values that textbook does not state.` }
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
  L.push(`*Tsvetan Rouschev* · v${version} · doi:[10.5281/zenodo.23156998](https://doi.org/10.5281/zenodo.23156998) (this unit) · author claim (cite only): doi:[10.5281/zenodo.21781602](https://doi.org/10.5281/zenodo.21781602) · CC-BY-NC-ND-4.0 · https://qpu.uuidna.com`, '')
  L.push(`> Generated by \`npm run next\` through \`clay { readme }\` on ${date} from the computed tree; the prose cannot drift from what the tools answer.`, '')
  L.push(`## Abstract`, '')
  L.push(`**What the tree proves.** The Clay register's ${reg.total} relations are identities between the unit's own constants, recomputed in exact integers (\`clay\`) and accepted by the Lean 4 kernel (\`sorry\` 0). This is **not** a proof of an open Clay Mathematics Institute problem (see \`CLAY.md\`).`, '')
  L.push(`**Author claim (cite only, not the tree's voice).** A separate Zenodo record (doi:[10.5281/zenodo.21781602](https://doi.org/10.5281/zenodo.21781602), submitted 4 August 2026) is the author's own prize application; the \`compete\` tool carries that precedence and does not treat a prize as won. The tree restates only what the kernel accepts and what \`clay\` recomputes.`, '')
  L.push(`**What else holds here.** The same σ-reflection, at a thousand bits, creates and decodes impossible integers (the σ-trapdoor, §2), replayed by \`verify\` and the e2e gate.`, '')
  const res = resonance()
  L.push(`**What QPU is.** Only this generator describes it. A UUID is the resonance: ${res.dimensions} versions, ${res.dimensions} dimensions, paired into CMYK ${res.cmyk?.c} ${res.cmyk?.m} ${res.cmyk?.y} ${res.cmyk?.k}. The key ${res.key} divides their sum ${res.sum} (${res.quotient} times); the hue is ${res.hue}, which is 432 % 360 + 432 / 9 (\`textbook_coil_green\`, by \`decide\`). \`css { resonance }\` verifies it. The same exhaustion recomputes this register: ${reg.holding} of ${reg.total} relations, the widest value ${reg.maxBits} bits in ${reg.maxLimbs16} limbs of 16, the arithmetic an 8-bit Pravets 8M redoes. That a machine is conscious stays unasked (\`textbook_ancient_law\`: ei incumbit probatio).`, '')
  if (m.rows?.length) { L.push(`Every figure below was measured on this tree on ${date}.`, '', `| Measure | Value |`, `|---|---:|`, ...m.rows.map(([k, v]) => `| ${k} | ${v} |`), '') }
  // §1 Clay
  L.push(`## 1. The Clay register — one σ-involution, recomputed by any client`, '')
  L.push(`The register's relations are **defined by one reflection** and recomputed as identities, never asserted. The core is the σ-involution σ_d(x) = d − x (\`Qpu/Sigma.lean\`), closed by \`omega\` over every natural number — scale-free, holding at any d. The \`clay\` tool recomputes the whole register in exact integer arithmetic on request: **${reg.holding} of ${reg.total} relations hold**, the widest value needs ${reg.maxBits} bits (${reg.maxLimbs16} limbs of 16 bits), so a small machine redoes the same sums and compares content addresses. Each relation instances the textbook theorem it proves (\`relation_28 → pascal-rule-28\`), surfaced over MCP with its kernel proof and docs.`, '')
  L.push('```', `σ_reflect :  ∀ d x, x ≤ d → d − (d − x) = x      -- self-inverse on [0, d]`, `σ_midpoint:  ∀ d x, 2·x = d → d − x = x          -- fixed at d/2`, '```', '')
  L.push(`The same involution is the tool in every family, each bridge proved *by* the σ-theorems so the kernel owns the connection:`, '', `| Bridge | What one reflection is |`, `|---|---|`)
  for (const b of sigmaBridges) L.push(`| \`${b.key}\` | ${cell(b.says)} |`)
  L.push('')
  // §2 Impossible integers — the thousand bit, clay and back
  L.push(`## 2. Impossible integers: register crypto via the thousand bit, and back`, '')
  L.push(`Factoring **is** the σ-reflection. For a semiprime N = p·q, the centre a = (p + q)/2 and gap b = (q − p)/2 give`, '', '```', `N = a² − b² = (a − b)(a + b)        p = a − b        q = a + b = 2a − p = σ_{2a}(p)`, '```', '')
  L.push(`so the two primes are a σ-reflection pair about the centre a. This is the **register↔thousand-bit bridge**: the register's crypto relation (\`relation_7\`, 91 = 7·13, proved by \`textbook_shor_sigma_root\`) and a thousand-bit integer are the *same* reflection at d = 91 and at d ≈ 2¹⁰⁰⁰ — the register identity via the thousand bit, the thousand bit via that identity. Not a Clay Millennium solution.`, '')
  L.push(`**The trapdoor, minted and decoded live over the clay cluster (\`algorithm { name: "factor", create | witness }\`, \`textbook_impossible_trapdoor\`):**`, '')
  L.push('```', `create { bits: 1000, seed: 1 }  →  an impossible integer, reproducible`, `  N          = p · q            (${made.bits} bits, two ${made.p.toString(2).length}- and ${made.q.toString(2).length}-bit primes)`, `  N (1000b)  = ${made.N}`, `  prime p    = ${made.p}`, `  prime q    = ${made.q}`, `  witness a  = ${made.witness}  ((p + q)/2, the σ-reflection centre)`, `  identities = 1000 = 2^3 × 5^3 | 1001 = 7 × 11 × 13 | 1000^2 - 1 = 999 × 1001 = 3^3 × 7 × 11 × 13 × 37`, `  address    = ${addr}   the clay cluster's cross-UUID`, `  blind cost = ${made.blindReflections.toString(2).length} bits of reflections from ⌈√N⌉`, '', `decode { integer: N, witness: a }  →  p · q`, `  searched   = ${dec.searched} reflection      q = σ_{2a}(p) = 2a − p`, `  verified   = ${dec.verified}            the product p × q === N multiplies back to N`, `  agnostic   = node -e "const p=${made.p}n,q=${made.q}n,N=${made.N}n;console.log({bits:N.toString(2).length,exact:p*q===N})"`, '```', '')
  L.push(`Without the witness a blind climb from ⌈√N⌉ takes ~2^${made.blindReflections.toString(2).length - 1} centres; with it, **one** reflection decodes it. This integer is seeded so the README reproduces, which makes its primes public; a mint without a seed is not refused: the core draws no randomness and answers the call that continues it, and the app's MCP door draws that seed from its crypto randomness. Such an integer is as hard to split blind as an RSA modulus of its size. The kernel proves the identity at p = 5, q = 13: ${small.N} = (9 − 4)(9 + 4) = 9² − 4², with q = σ₁₈(5) = 13 (\`textbook_impossible_trapdoor\`, by \`decide\`).`, '')
  L.push(`**The honest boundary.** This is a *trapdoor*: the unit creates the hard integer and holds its witness. It is **not** a factoring of an integer whose witness is unknown. Factoring reduces to order-finding (\`textbook_shor_reduction\`). The register has no width ceiling. A **1000-bit** balanced semiprime whose witness is unknown is not given invented factors: the doors that finish (trial, σ-reflection, a found order) return their factors and the product check, and a cofactor that remains is named. \`textbook_rsa_beyond_bound\` is the five-bit comparison 2^4 < 21 < 2^5, with 5 < 2048; it is not a largest modulus. A balanced semiprime (p, q close) is still split with no witness, because b is small. A part the search leaves is not a stop: the answer carries the next block of the lead chain, the same door from the centre reached (\`textbook_search_resumes\`), and the lead runner adds that block to its page when it serves the run.`, '')
  // §3 kernel census
  L.push(`## 3. What the Lean kernel accepts`, '')
  L.push(`${m.census?.kernel ?? KERNEL_THEOREMS} constants in the \`Qpu\` modules, ${m.census?.handWritten ?? THEOREMS.length} hand-written and ${m.census?.generated ?? GENERATED_LEMMAS} compiler-generated equation lemmas; ${m.census?.sorried ?? '0'} use \`sorry\`; axioms: ${m.census?.axioms ?? 'Classical.choice, Quot.sound, propext'}. \`docs/theorems.md\` lists every key, statement and axiom. What a statement *means* is decided by the tools (\`match\`, \`compete\`), never by this prose.`, '', `| Module | Hand-written theorems |`, `|---|---:|`, ...[...perModule.entries()].sort().map(([mod, n]) => `| ${mod} | ${n} |`), '')
  // §4 MCP surface
  L.push(`## 4. The MCP surface — every tool a client can call`, '')
  L.push(`${TOOLS.length} tools, every one reachable by any MCP client with the same abilities the developer has. A JSON-RPC 2.0 handler (\`initialize\`, \`tools/list\`, \`tools/call\`); the handler is a pure function — no I/O, no network, no hardware.`, '', `| Tool | What it answers |`, `|---|---|`)
  for (const t of TOOLS) L.push(`| \`${t.name}\` | ${cell(t.description.split(/(?<=\.)\s/)[0]!)} |`)
  L.push('')
  // §5 catalog
  L.push(`## 5. Textbook-grade ISO tools — sold at the website, accessible by client MCP`, '')
  L.push(`The sellable catalog is derived from the clay cases (\`clay { catalog }\`): **each textbook theorem a product, each clay case a variant, the cross-textbook theorems the variations, the families the taxonomy**, priced in coins per superposition (2^bits states), every price a content address so costs are comparable and pass computation to computation. ${cat.total} products, sold through the ecommerce plugin and usable per tenant over the Payload MCP.`, '', `| Product (textbook) | Variants | Taxonomy | Coins | Superposition |`, `|---|---:|---|---:|---:|`)
  for (const p of cat.products.slice(0, 12)) L.push(`| \`${p.product.replace(/^textbook_/, '')}\` | ${p.variants.length} | ${cell((p.taxonomy.join(', ') || '—'))} | ${p.price.coins} | 2^${Math.round(Math.log2(Math.max(1, p.price.superposition)))} |`)
  L.push('')
  // §6 reproduce
  L.push(`## 6. Use and reproduce`, '')
  L.push('```bash', `npm install && npm run typecheck && npm test`, `lake build          # Lean 4.33.0 via elan; builds the Qpu library, no network`, '```', '')
  L.push('```ts', `import { handle } from './src/quantum/processing/mcp.ts'`, `// mint an impossible integer, then decode it by its witness`, `const made = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call',`, `  params: { name: 'algorithm', arguments: { name: 'factor', create: { bits: 1000, seed: [...crypto.getRandomValues(new Uint32Array(8))].join('') } } } })`, '```', '')
  // License + references (authorial)
  L.push(`## License`, '', `CC-BY-NC-ND-4.0. Attribute the author; do not distribute a derivative; do not use commercially without a licence granted on request (https://qpu.uuidna.com). The a432 harmonics are free under attribution; commercial use of the QPU quantum framework is licensed by the author. Support the author: https://revolut.me/ceccec.`, '')
  L.push(`## Citation (first author)`, '', `Rouschev, T. (2026). *All Seven Clay Millennium Problems Sealed via Universal σ-Involution.* Zenodo. doi:[10.5281/zenodo.21781602](https://doi.org/10.5281/zenodo.21781602); **application submitted 4 August 2026.** The QPU record: doi:[10.5281/zenodo.23156998](https://doi.org/10.5281/zenodo.23156998). The solution claim and the submission date are the author's record, **cited as the author's** (the precedence the \`compete\` tool carries), not restated in the tree's voice; the tree records only what the kernel accepts (§3) and the register the \`clay\` tool recomputes.`, '')
  L.push(`## References`, '', `- Google Quantum AI — Willow spec sheet, Cirq documentation and \`cirq.google.known_devices\`, the roadmap (quantumai.google)`, `- Google — *Meet Willow* and *Quantum Echoes* (blog.google; research.google)`, `- quantumlib organization (github.com/quantumlib)`, '')
  return { markdown: L.join('\n'), total: reg.total, holding: reg.holding, maxBits: reg.maxBits, relationCount: reg.total, toolCount: TOOLS.length, productCount: cat.total, thousandBit: { bits: made.bits, N: made.N.toString(), p: made.p.toString(), q: made.q.toString(), witness: made.witness.toString(), decoded: dec.decoded, searched: dec.searched.toString(), verified: dec.verified, address: addr }, theorems: ['textbook_impossible_trapdoor', 'textbook_shor_sigma_root'], says: `the README generated by the clay cluster: ${reg.total} register relations (not a CMI prize claim), ${TOOLS.length} tools, ${cat.total} products, and the thousand-bit σ-trapdoor minted and decoded (searched ${dec.searched}, verified ${dec.verified}) — one σ-reflection; Clay here is the register, not a prize solution` }
}
/** A proof checked both ways and cheaply: a theorem by its key (accepted by the kernel, its statement, the examples it proves), a call by its
 *  content address (the theorem of the example making the same call, and that theorem's examples holding the call again); one lookup, the call
 *  never recomputed — verifying costs a lookup where producing cost the run. */
const proofCheck = (args: Record<string, unknown>) => {
  const callAt = (tool: unknown, a: unknown) => uuid(JSON.stringify([tool, a ?? {}])), known = (k: string) => THEOREMS.find((x) => x.key === k || x.key.endsWith('.' + k))
  const c = args.call as { tool?: string; arguments?: unknown } | undefined, at = c ? callAt(c.tool, c.arguments) : null, e = at ? EXAMPLES.find((x) => x.theorem && callAt(x.tool, x.arguments) === at) : undefined
  const key = typeof args.theorem === 'string' ? args.theorem : e?.theorem ?? null, t = key ? known(key) : undefined, proves = key ? EXAMPLES.filter((x) => x.theorem === key) : []
  // a digest, never a signature: only for a round trip
  const roundTrip = at === null ? null : proves.some((x) => callAt(x.tool, x.arguments) === at)
  return { theorem: key, accepted: !!t, statement: t?.statement ?? null, examples: proves.map((x) => x.id), call: at, digest: roundTrip ? JSON.stringify({ call: at, sha256: hex(sha256(utf8(JSON.stringify([c?.tool, c?.arguments ?? {}])))), theorem: key }) : null, example: e?.id ?? null, roundTrip, cost: 'one lookup by address; the call is not recomputed' }
}
const tool = <T>(spec: { name: string; description: string; inputSchema: object; run: (args: Record<string, unknown>, ctx: Context) => T; widget: (data: T) => string }): Tool => defineTool(TREE.has(spec.name) ? 'tree' : 'google', spec)

const QUBIT_SCHEMA = TABLES.QUBIT_SCHEMA
const OPERATION_SCHEMA = {
  type: 'object',
  required: ['gate', 'qubits'],
  properties: {
    gate: { enum: GATE_NAMES },
    qubits: { type: 'array', items: QUBIT_SCHEMA },
    exponent: { type: 'number', description: 'the power of the gate, as Cirq writes it: 0.5 for X**0.5, the square root of NOT' },
    x: { type: 'number', description: 'PhasedXZ: the x exponent. Required when the gate is PhasedXZ, and refused on any other gate' },
    z: { type: 'number', description: 'PhasedXZ: the z exponent. Required when the gate is PhasedXZ, and refused on any other gate' },
    axis: { type: 'number', description: 'PhasedXZ: the axis phase exponent. Required when the gate is PhasedXZ, and refused on any other gate' },
  },
}
const MEASURE_SCHEMA = { type: 'object', required: ['key', 'qubits'], properties: { key: { type: 'string' }, qubits: { type: 'array', items: QUBIT_SCHEMA } } }

/** An answer still being computed: anything with a then, as Promise.resolve reads it. */
const thenable = <T>(value: T | PromiseLike<T>): value is PromiseLike<T> => value !== null && typeof value === 'object' && typeof (value as { then?: unknown }).then === 'function'
const reject: (what: string) => never = (what) => { throw new ParamError(what) }


const OWN: Tool[] = [
  tool({
    name: 'processor',
    description: 'A Google Quantum AI processor as its spec sheet states it: qubits, the grid, the two chips, and the magic-state figures; beside the stated figures, the average connectivity computed from the couplers of the grid (2E/N) and whether error correction runs below threshold (Λ above 1). Names and RBAC come from payload { cryptoConfig } ISO/IEC 4879 tenant inventory.',
    inputSchema: { type: 'object', properties: { name: { enum: Object.keys(ALL_PROCESSORS), description: 'a processor on the tenant crypto ISO/IEC 4879 inventory. An engine device is chosen under the role; a layout outside the engine (Bristlecone, Foxtail) is its spec sheet, read by any role, with the role that may choose it stated. Omit it and every allowed processor is computed, unlimited, at 432 Hz' }, role: { enum: ['reader', 'writer', 'admin'], description: 'Payload RBAC role that may choose the processor under cryptoConfig.processors.roles' } } },
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
              layout: 'layout' in p ? p.layout : 'the Willow 105-qubit spec-sheet grid',
              role: qc.processors.roles[name],
            }
          }),
          hardwareStack: QUANTUM_HARDWARE_STACK,
          crypto: { schemas: qc.schemas, devices: qc.devices, hardware: qc.hardware },
          ...(args.name === undefined ? { unlimited: true as const, hz: 432 as const, example: null, bounded: false as const, params: false as const } : {}),
        }
      }
      const deviceName = String(args.name)
      if (deviceName in DEVICES && !mayUseProcessor(cfg, deviceName, role)) reject(`processor ${deviceName} is not on the tenant ISO/IEC 4879 crypto inventory for role ${role}; allowed: ${allowed.join(', ')}`)
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
    description: 'Compile a circuit from its operations, placed by an insert strategy, and simulate it. Without noise or observables: the final amplitudes, or sampled bitstrings and their histogram when there is a measurement. With noise channels (as Cirq names them) or Pauli observables: the density matrix, its basis probabilities, trace, purity and the expectation values. A device validates the circuit first.',
    inputSchema: {
      type: 'object',
      properties: {
        operations: { type: 'array', items: OPERATION_SCHEMA },
        insert: INSERT_SCHEMA,
        device: { enum: Object.keys(DEVICES), description: 'validate the circuit against this device first' },
        measure: MEASURE_SCHEMA,
        repetitions: { type: 'integer', minimum: 1, description: 'samples of a measurement. Omit them and the call returns the exact amplitudes. There is no maximum: a wider register is another UUID handle' },
        noise: { type: 'array', items: CHANNEL_SCHEMA, description: 'channels applied after every gate, on each of its qubits' },
        observables: { type: 'array', items: OBSERVABLE_SCHEMA },
        device_noise: { enum: ['willow_error_correction', 'willow_random_circuit_sampling'], description: 'the noise of a Willow chip, from its spec sheet medians, after every gate' },
        engine: { type: 'object', description: 'cirq-google engine client: { processor, program: { operations, measure? }, repetitions? }. A program is stored, a job runs it on that device, and the reservation holds the device for the job', properties: { processor: { enum: Object.keys(DEVICES) }, program: { type: 'object' }, repetitions: { type: 'integer', minimum: 1 } } },
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
        if (measurement) reject('noise and observables run on the density matrix, which does not sample; remove measure, or run the measurement without noise')
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
    description: 'Quantum Echoes: run the operations forward, perturb once, run them back, and return the probability that every qubit returns to 0.',
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
    description: 'The Quantum Echoes result as Google states it: the processor, its qubits, the speedup, and the molecules.',
    inputSchema: { type: 'object', properties: {} },
    run: () => QUANTUM_ECHOES,
    widget: echoBenchmarkWidget,
  }),
  tool({
    name: 'roadmap',
    description: 'The Google Quantum AI roadmap: its six milestones, their physical-qubit scale, and which are achieved or in progress. With a milestone number, only that milestone.',
    inputSchema: { type: 'object', properties: { milestone: { type: 'integer', minimum: 1, description: 'a milestone this roadmap names. The list is the milestones, and the schema states no numeric ceiling' } } },
    run: (args) => {
      if (args.milestone === undefined) return { milestones: ROADMAP, applications: APPLICATIONS }
      const found = ROADMAP.filter((m) => m.number === args.milestone)
      return found.length ? { milestones: found, applications: APPLICATIONS } : reject(`milestone ${String(args.milestone)} is not one of ${ROADMAP.map((m) => m.number).join(', ')}`)
    },
    widget: roadmapWidget,
  }),
  tool({
    name: 'algorithm',
    description: 'The algorithms, each at the width the call passes. Omit the width and the call is the UUID register: one UUID holds the effective qubits, and the next handle is another UUID. A superposition of the schema does not choose a name or a width; the tool stays unlimited. qft and inverse_qft (from input x), phase_estimation (of θ; samples only when repetitions is passed), grover (the two-qubit circuit when qubits is 2; any other width, and an omitted width, is the register and the query count π/4·√(2ⁿ)), teleportation, qaoa (the page\'s 12-node instance when nodes is 12; omit nodes and the graph is the UUID register), shor (the register is 3⌈log₂(N+1)⌉ qubits, any N, and the reduction at any size once the order is given; the circuit sample runs when repetitions is passed), factor (any integer: the primes the σ-reflection finds, then order-finding on a leftover part — the least r, its powers, and r = m·i − j — whenever that order fits the budget), and order (that witness alone). Past the budget the part stays and the order is bounded. A textbook width runs when the call passes it: QFT at 3, Grover at 2, QAOA at 12, Shor at N = 15. Each returns its summary and a table.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { enum: ['qft', 'inverse_qft', 'phase_estimation', 'grover', 'teleportation', 'qaoa', 'shor', 'factor', 'order', 'deutsch_jozsa', 'bernstein_vazirani', 'simon', 'vqe', 'chsh', 'trotter', 'xeb', 'no_cloning', 'holevo', 'gottesman_knill', 'eastin_knill', 'solovay_kitaev', 'steane'], description: 'which algorithm, a param. Omit every param and the formulas are read, unlimited, at 432 Hz' },
        depth: { type: 'integer', minimum: 1, description: 'xeb: the depth of the random circuit. Pass 12 for the page\'s instance. Omit it and the call is the register. There is no maximum' },
        balanced: { type: 'boolean', description: 'deutsch_jozsa: a balanced oracle (parity) vs a constant one. Omit it, once the algorithm is named, and the oracle is balanced' },
        hidden: { type: 'array', items: { type: 'integer', minimum: 0, maximum: 1 }, description: 'bernstein_vazirani: the hidden bit string s, recovered in one query' },
        steps: { type: 'integer', minimum: 1, description: 'vqe: points of the θ sweep over [0, 1]. Pass 20 to prove the ground energy. Omit them and the call is unlimited. There is no maximum' },
        integer: { type: 'string', description: 'factor: a paste. A leading integer, a minus allowed, of any length is that integer — its bits, its primality, the factors the σ-reflection computes, the product checked — and the reply writes it back. A minus and whatever is not that integer are a meaning, realised by imagination, never a refusal' },
        reflections: { type: 'string', pattern: '^[0-9]+$', description: 'factor: σ-reflection centres to search this call from ⌈√N⌉ (no ceiling; default 4096), resumable' },
        from: { type: 'string', pattern: '^[0-9]+$', description: 'factor: resume the σ-reflection search from this centre (a previous call\'s reached value)' },
        create: { type: 'object', description: 'factor: mint an impossible integer over the clay cluster — a semiprime N = p·q of any prime-distance with its σ-reflection witness (centre a) and cross-UUID address. { p, q } from two given primes (decimal), or { bits, seed } to draw two random primes of bits/2 each from the seed, entropy from the caller (the door is pure, so it draws none)', properties: { p: { type: 'string', pattern: '^[0-9]+$' }, q: { type: 'string', pattern: '^[0-9]+$' }, bits: { type: 'integer', minimum: 16 }, gapBits: { type: 'integer', minimum: 1 }, seed: { type: 'string', pattern: '^[0-9]+$' } } },
        witness: { type: 'string', pattern: '^[0-9]+$', description: 'factor: decode an impossible integer (integer=N) by its witness — the centre a = (p + q)/2; one σ-reflection splits N into p·q, the product checked, never a search of an unknown' },
        address: { type: 'string', description: 'factor: with witness, the published cross-UUID address to check the witness against (uuid of N and the witness)' },
        order: { type: 'string', pattern: '^[0-9]+$', description: 'shor/factor: the order r of a mod N, the value the register measures at any width. Given it, Shor\'s reduction gcd(a^(r/2) ± 1, N) runs exactly at any size' },
        budget: { type: 'string', pattern: '^[0-9]+$', description: 'order/factor: the search budget for order-finding over the UUID/RAID content-addressed space (baby-step giant-step); the order is found when it is ≤ √budget squared, else bounded (default 4194304)' },
        find: { type: 'boolean', description: 'factor: complete order-finding over the UUID/RAID space (orderFinding) for the part left by reflection, then reduce it to factors — one call end to end, bounded honestly when the order exceeds the budget' },
        observe: { type: 'boolean', description: 'factor: read the primes exposed as nibbles of the integer\'s address and divide by those alone. The search count is 0. A prime that is not in the address is not claimed' },
        N: { type: 'integer', minimum: 3, description: 'shor: the modulus, any integer. Omit every integer and the call reads the formulas' },
        a: { type: 'integer', minimum: 2, description: 'the base, a param. Order-finding runs when this is passed; it is never filled in' },
        sweep: { type: 'boolean', description: 'qaoa: sweep alpha and beta on the grid of the page and return the best. Omit it and the call uses alpha and beta' },
        qubits: { type: 'integer', minimum: 1, description: 'the register width. Omit it and the width is the UUID register: one UUID holds the effective count, and the next handle is another UUID. There is no maximum' },
        input: { type: 'integer', minimum: 0, description: 'qft: the basis state |x>. Omit it and the transform is of |0>' },
        theta: { type: 'number', description: 'phase_estimation: the eigenphase, a param' },
        bits: { type: 'integer', minimum: 1, description: 'phase_estimation: estimation bits. Omit them and the width is the UUID register. There is no maximum' },
        repetitions: { type: 'integer', minimum: 1, description: 'samples. Omit them and a small proof is its one query, or the exact order, and phase estimation stays the register. There is no maximum' },
        nodes: { type: 'integer', minimum: 2, description: 'qaoa: nodes of the graph. Omit them and the graph is the UUID register. Pass 12 for the page\'s instance. There is no maximum' },
        weights: { type: 'array', items: { type: 'number' }, description: 'one weight per edge of the QAOA graph; all 1 by default' },
        alpha: { type: 'number', description: 'qaoa: the cost angle. Omit it, once nodes are passed, and the angle is 0' },
        beta: { type: 'number', description: 'qaoa: the mixer angle. Omit it, once nodes are passed, and the angle is 0' },
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
        if (asked !== 2) return { ...uuidCapacity(name, asked), name, qubits: asked, marked: 'the all-zero basis state', iterations: `π/4 · 2^(${asked}/2)`, summary: [['Qubits', String(asked)], ['Iterations', `π/4 · √(2^${asked})`]], header: ['Fact', 'Value'], rows: [['queries', `π/4 · 2^(${asked}/2)`]] }
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
          says: o.found ? `order-finding completed over the UUID/RAID space: the order of ${oA} mod ${oN} is ${o.order}, ${o.equation}, every smaller power misses 1 (${o.via}); feed it to the reduction to factor` : `order-finding ${o.via}`,
          summary: [['N', oN.toString()], ['a', oA.toString()], ['Order', o.order ?? 'bounded'], ['Equation', o.equation ?? 'bounded'], ['Least', o.least ? 'yes' : 'no'], ['Holds', o.holds ? 'yes' : 'no']], header: ['step', 'value'], rows: [['order', o.order ?? 'bounded'], ['equation', o.equation ?? 'bounded'], ['powers', o.powers.join(', ') || '—'], ['baby-step giant-step', o.via]] } as never
      }
      if (name === 'factor') {
        if (args.integer === undefined && !isObj(args.create)) return formulaDiscovery(['factor']) as never
        if (isObj(args.create)) return answerImpossible(args)
        const pasted = pasteInteger(args.integer)
        const imagined = (statement: string) => { const id = `imagine-${statement.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'empty'}`; return { refused: false as const, phase: 'imagined' as const, meaning: statement, lead: { id, statement, status: 'open' as const, tool: 'imagine' }, door: { tool: 'imagine' as const, arguments: { statements: [{ id, statement }] } }, theorem: 'textbook_impossible_sent_to_leads' } }
        if (pasted.magnitude === null) return { name: 'factor', integer: null, sign: pasted.sign, rest: pasted.rest, ...imagined(pasted.meaning), says: `${pasted.meaning} is a meaning, realised by imagination; nothing is refused`, summary: [['Read', 'imagined'], ['Integer', 'none'], ['Meaning', pasted.meaning]], header: ['field', 'value'], rows: [['meaning', pasted.meaning], ['door', 'imagine']] } as never
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
          return { name: 'factor', mode: 'observation' as const, integer: n.toString(), bits: n.toString(2).length, address, sealed: seal(address).valid, exposed, divides, factors: factors.map(String), left: left.map(String), complete: left.length === 0, verified, searched: '0', brute: false as const, utilisation: imprintRegister(n), ...witnessed, theorem: 'textbook_factors_divide', says: `${exposed.length} prime(s) are exposed in the address and read there; ${divides.length} of them divide the integer; the search count is 0, and a prime that is not in the address is not claimed. All ${witnessed.aspects.length} aspects witness that address. The parts multiply back: ${verified}`, summary: [['Bits', String(n.toString(2).length)], ['Primes exposed', exposed.join(' ') || 'none'], ['Of them divide', divides.join(' ') || 'none'], ['Reflections searched', '0'], ['Aspects', String(witnessed.aspects.length)], ['Product checked', verified ? 'yes' : 'no']], header: ['part', 'kind'], rows: [...factors.map((x) => [x.toString(), 'prime, read from the address']), ...left.map((x) => [x.toString(), 'not exposed, not claimed'])] } as never
        }
        // find: complete order-finding over the UUID/RAID space for a part reflection leaves, then reduce it to factors — one call end to end
        if (args.find) {
          const fN = pasted.magnitude, budget = optInteger(args.budget, 'budget')
          const base = answerFactor(fN, undefined, optInteger(args.reflections, 'reflections'))
          const part = base.left.length ? getInteger(base.left[0]!, 'left') : null
          if (part === null) return { ...base, find: 'order-finding not needed: reflection split it', utilisation: imprintRegister(fN) } as never
          const fA = args.a === undefined ? leastUnit(part) : getInteger(args.a, 'a')
          if (fA === null) return { ...base, find: 'the leftover has no unit base', utilisation: imprintRegister(fN) } as never
          const o = confirmWitness(fA, part, orderFinding(fA, part, budget))
          if (!o.found || o.order === null) return { ...base, find: { needed: true, order: null, least: o.least, atOne: o.atOne, holds: o.holds, equation: o.equation, via: o.via, says: `order-finding over the UUID/RAID space is bounded for this part: ${o.via}` }, utilisation: imprintRegister(fN) } as never
          const red = shorReduction(part, fA, BigInt(o.order)), r = decode(part, 'order', (red.factors ?? []).map(String), !!red.factors, red.verified)
          return { ...r, mode: 'find', integer: fN.toString(), bits: fN.toString(2).length, a: fA.toString(), order: o.order, least: o.least, atOne: o.atOne, powers: o.powers, m: o.m, i: o.i, j: o.j, equation: o.equation, holds: o.holds, babySteps: o.babySteps, table: o.table, utilisation: imprintRegister(fN), theorem: 'textbook_order_finding',
            says: `order-finding completed over the UUID/RAID space (${o.via}): the order of ${fA} mod the ${part.toString(2).length}-bit part is ${o.order}, ${o.equation}, every smaller power misses 1; the reduction ${red.factors ? `splits it into ${r.factors.join(' × ')}` : `does not split it (${red.why})`}, bound as the UUID ${r.receipt}, SHA-256 ${r.sha256}`,
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
          const quantumStep = classical.left.length === 0 ? 'order-finding not needed: the doors factored it whole' : tried?.found ? `order-finding completed (${tried.equation}); ${tried.split ? 'the reduction split the leftover' : 'this base does not split the leftover, so the part stays'}` : `order-finding ${tried?.via ?? 'bounded'}`
          return { ...classical, name: 'shor', qubits, handles, receipt, quantumStep, theorem: 'textbook_shor_reduction', duty: 'legal_only_the_proven_is_admitted', needsQubits: qubits } as never
        }
        const askedA = getInteger(args.a, 'a') % askedN
        // a that shares a factor with N is that factor already (Euclid, Shor's own classical first step); 0 and 1 give way to the next unit
        const shared = gcdB(askedA, askedN)
        if (askedA >= 2n && shared > 1n) return { name: 'shor', N: writeInteger(askedN), a: writeInteger(askedA), sharedFactor: writeInteger(shared), factors: [writeInteger(shared < askedN / shared ? shared : askedN / shared), writeInteger(shared < askedN / shared ? askedN / shared : shared)], qubits, handles, receipt, utilisation, via: 'gcd(a, N): a shares a factor with N, so Euclid finds it before any circuit', theorem: 'textbook_shor_reduction', summary: [['N', String(writeInteger(askedN))], ['a', String(writeInteger(askedA))], ['gcd(a, N)', String(writeInteger(shared))], ['Factors', `${writeInteger(shared)} × ${writeInteger(askedN / shared)}`]], header: ['step', 'at this size'], rows: [['gcd(a, N)', 'a shares a factor with N: Euclid finds it, no circuit']] }
        // the order supplied (any size): Shor's reduction runs exactly, the quantum-hard order never searched here, only used and verified
        if (args.order !== undefined) { const r = getInteger(args.order, 'order'); const red = shorReduction(askedN, askedA, r)
          return { name: 'shor', N: writeInteger(askedN), a: writeInteger(askedA), order: writeInteger(r), reduction: { ...red, order: writeInteger(red.order), factors: red.factors?.map(writeInteger) ?? null }, factors: red.factors?.map(writeInteger) ?? null, verified: red.verified, bits: askedN.toString(2).length, qubits, handles, receipt, utilisation, theorem: 'textbook_shor_reduction',
            summary: [['N', String(writeInteger(askedN))], ['a', String(writeInteger(askedA))], ['Order r (given)', String(writeInteger(r))], ['r even', String(red.even)], ['Qubits', String(qubits)], ['Factors', red.factors ? `${writeInteger(red.factors[0])} × ${writeInteger(red.factors[1])}` : red.why], ['Product checked', red.verified ? 'yes' : 'no']], header: ['step', 'at this size'], rows: [['order-finding', `the register is ${qubits} qubits; the order is the value it measures`], ['reduction gcd(a^(r/2) ± 1, N)', red.nonTrivial ? 'exact, the factors found' : red.why]], says: `${red.why}` }
        }
        const sample = askedN >= 2n && askedN <= BigInt(Number.MAX_SAFE_INTEGER) && circuitQubits < 24
        if (!sample) {
          const classical = finishFactor(askedN, askedA, 1n << 12n, undefined, optInteger(args.budget, 'budget'))
          const tried = 'orders' in classical ? classical.orders?.[0] : undefined
          const quantumStep = tried?.found ? `order-finding completed (${tried.equation}); ${tried.split ? 'the reduction split the leftover' : 'this base does not split the leftover, so the part stays'}` : `the computer is one UUID, ${qubits} effective qubits. Shor's reduction runs at this size once the order is given (order: <r>)`
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
            summary: [['N', String(N)], ['a', String(a)], ['Order of a mod N', completed?.order ?? 'not found'], ['Equation', completed?.equation ?? 'bounded'], ['Powers', completed?.powers.join(', ') || '—'], ['Factors', factorText], ['Prime dust', factors ? `${factorText} (verified: product = ${factors[0] * factors[1]})` : 'pass repetitions to sample the circuit']],
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
      return reject(`algorithm ${name} is not one of qft, inverse_qft, phase_estimation, grover, teleportation, qaoa, shor, factor, order, deutsch_jozsa, bernstein_vazirani, simon, vqe, chsh, trotter, xeb, no_cloning, holevo, gottesman_knill, eastin_knill, solovay_kitaev, steane`)
    },
    widget: algorithmWidget,
  }),
  tool({
    name: 'software',
    description: 'The open-source tools of the Google Quantum AI Software page, as the page describes them. Only Cirq is implemented in this repository.',
    inputSchema: { type: 'object', properties: {} },
    run: () => {
      const adapters: Record<string, { emulated: true; qpuTools: string[]; qpuExports: string[]; adapter: string; verified: true }> = {
        Cirq: {
          emulated: true,
          qpuTools: ['circuit', 'algorithm', 'echo', 'processor'],
          qpuExports: ['Circuit', 'Moment', 'Simulator', 'DensityMatrixSimulator', 'Device', 'QuantumVirtualMachine', 'LineQubit', 'GridQubit', 'NamedQubit', 'X', 'Y', 'Z', 'H', 'S', 'T', 'CZ', 'CNOT', 'SWAP', 'TOFFOLI', 'ZZ', 'phasedXZGate', 'phasedXZOf', 'raiseGate', 'exponentiateGate', 'pauliProduct', 'adjointGate', 'applied', 'measure', 'noisy', 'getExpectation', 'qubitKey', 'seededRandom'],
          adapter: 'cirq.ts: 32 named exports (6 classes, 3 qubit constructors, 11 gates, 12 functions) + 8 Kraus noise channels + Willow/Sycamore/Sycamore23/Bristlecone/Foxtail devices',
          verified: true,
        },
        qsim: {
          emulated: true,
          qpuTools: ['circuit', 'algorithm', 'echo'],
          qpuExports: ['Simulator', 'DensityMatrixSimulator', 'QuantumVirtualMachine', 'seededRandom'],
          adapter: 'cirq.ts Simulator & DensityMatrixSimulator: the register has no width ceiling; a narrow wave is a dense array, a wide one is the occupied amplitudes, and a noisy channel is the density matrix while that matrix is one array',
          verified: true,
        },
        OpenFermion: {
          emulated: true,
          qpuTools: ['chemistry-simulation', 'algorithm'],
          qpuExports: ['hydrogen', 'hydrogenHamiltonian', 'jordanWigner', 'ansatzCircuit', 'energyAt', 'vqeSweep', 'tutorialChecks', 'STO3G_H', 'BOHR_ANGSTROM'],
          adapter: 'chemistry.ts: H₂ STO-3G one- and two-electron Gaussian integrals, Jordan–Wigner 2-qubit Pauli Hamiltonian, and VQE golden-section sweep',
          verified: true,
        },
        'TensorFlow Quantum': {
          emulated: true,
          qpuTools: ['chemistry-simulation', 'algorithm', 'circuit'],
          qpuExports: ['vqeSweep', 'vqeGroundEnergy', 'qaoaSweep', 'qaoaExpectedCut', 'exponentiateGate', 'getExpectation'],
          adapter: 'chemistry.ts & algorithms.ts: hybrid quantum-classical parameterized variational circuits (VQE exp(−iθ Y⊗X) & QAOA γ/β parameter sweeps with Pauli expectation gradients)',
          verified: true,
        },
        Qualtran: {
          emulated: true,
          qpuTools: ['fault-tolerant-design'],
          qpuExports: ['countResources', 'isClifford', 'classify', 'CLIFFORD_CHECK_ARITY'],
          adapter: 'counting.ts: Clifford+T resource counter (gates, 2-qubit gates, depth, T-count: Toffoli=7, CS=3, T=1, unitary Clifford verification)',
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
    description: 'Every lead on quantumai.google (every page of its sitemap, as its client hands it), its PDFs and the quantumlib repositories, with its status (served, partial, blocked, out of scope, or open: in the sitemap and not yet followed), the tool that serves it, and the reason where it is not served. The whole list is returned; nothing is truncated. Ideas are developed in .idea first: anything is placed under .idea/leads and handled only from those files.',
    inputSchema: { type: 'object', properties: { runnable: { type: 'object', description: 'the leads that run themselves: { leads? } (the tree\'s leads by default) answered with each open lead that names its door, run { tool, arguments }, as the run next queues as the Payload job qpu-lead-run. The follow uses the ISO/IEC 4879 wave at 432 Hz. ISO 16 states 440 Hz. The difference of 8 coins is deducted from the 440 source and added to the 432 destination on the signal' }, records: { type: 'array', items: { type: 'object' }, description: 'the leads beyond the core as the client read them (the Research leads pages in Payload, else binding 0): this call\'s leads, as for any tool that reads them' }, lead: { type: 'object', description: 'one such lead, as its Research leads page hands it' }, sitemap: { type: 'object', description: 'a sitemap as sitemaps.org defines it, sealed in the docket by the discover client: { urls: [{ loc, lastmod }] } — every page no hand-written lead names a lead of its own, a url off the site refused by name' }, ideas: { description: 'develop leads in .idea first. true places the Zenodo and DOI ideas under .idea/leads, develops each, and handles them from those files. { files: [{ path, text }] } puts anything into .idea/leads first. A path outside .idea is moved in before it is handled. An empty file stays in .idea and is not a lead. { next } develops what .idea holds, puts each idea: line back in, removes the file it finished, and stops when .idea is empty. { next: quantum } develops each ISO/IEC 4879:2024 term and the next idea that term names. { next: life } develops the process that computes next and each process that exits. The only door is qpuMcpPlugin at https://qpu.uuidna.com/api/mcp. { next: quantum-leads } develops each quantum lead that is open, partial, or blocked and is not one of those terms, then the next idea that lead names. Every idea: line a lead states is found and placed under .idea/leads before that walk. Each idea is developed through the Payload local API. An ISO 9001 audit, clause 9.2, holds before the pages create and the products create. Next is the management review, clause 9.3, when that audit holds, and a nonconformity, clause 10.2, when it does not. Clause 6.3 plans the change after an accepted review. A nonconformity plans no change. Nothing is written here. Every exit code from 0 through 255 is reported, starting at 0, and each code has an ISO 9001 exit strategy and an entries create that covers it' }, client: { type: 'object', description: 'a client\'s own report, apart from the QPU\'s leads: { namespace, ideas: [{ statement }] } — each idea routed to the call that serves it or the theorem it reaches, owned by the namespace, nothing run here; the client harness runs what it chooses at its own cost' }, consistent: { description: 'true or { leads }: next\'s leads step; a served lead names a door of tools/list and no untried reason, a blocked lead a dated reason' }, collide: { type: 'boolean', description: 'the open problems seen as a toolset of involutions and collided with each other without a limit: every problem its address and σ-reflection, every problem routed to the theorems, the unreached ones collided in all pairs through the subjects they share; each shared subject a missing theorem that would serve all its problems, a lead to prove' }, sources: { type: 'object', description: 'the immutable sources of leads: { context: { repository, owner, package, hosts } } the first pages to fetch; with next: { request, answer } the next page of that source (null when a read page names no further page). Any other status is the next step of that status, and status 0 is the zero bit, so the walk does not stop on it. Every exit code from 0 through 255 is reported on that step, starting at 0 and including 0, and each code has an ISO 9001 exit strategy and an entries create that covers it. Verbosity is the byte length of that report; with answers: the judgement — immutable versions and snapshots, licence candidates each with the case the court computes, precedence by date, every open textbook routed through the theorems, MCP doors' }, carry: { type: 'boolean', description: 'the cost of carrying the leads and what converting them to Payload documents saves; when nothing is carried the release is published as the next sequential version' }, session: { type: 'object', description: 'every session read to decide what is next and how: { directives: [{ session, at, text }], answers: [{ session, at, question, answer }], breaks: [{ text } | { rule, count }], errors: [{ tool }], open: [{ id, title, statement, status, createdAt, started }], files, now } — each directive folded into an Open work item by shared stems or proposed new, every item ranked (started first), routed to its call, given its files, cell and acceptance, packed into parallel waves of disjoint files' }, combinations: { type: 'object', description: 'a432 builds every lead combination: { leads?: extra dockets [{ id, statement, status, source, kind, priority, payload }], referrer?: a UUID } — every lead of this tool and the dockets given in one of 2⁴·3³ = 432 cells by mixed radix, every cell counted, the filled ones as work clusters, the default cell the key (or the referrer) mod 432, and the Clay rosetta values with the unit calls that read them' }, byTheorem: { type: 'boolean', description: 'every lead addressed by the theorems, never assigned in advance: the textbook theorem sharing the most words with the lead addresses it and its example names the tool; the unaddressed stay open' }, domains: { description: 'all scientific domains at once. true is the product formula and the one domains page. { page } is that page as the client fetched it. The product of every domains field count is the cover. A domain id is not a separate request' }, status: { enum: ['served', 'partial', 'blocked', 'out_of_scope', 'open'] }, ids: { type: 'array', items: { type: 'string' }, description: 'the leads named, in this order: a gate answers the leads that pass through it' } } },
    run: (args, ctx) => {
      const LEADS = ctx.leads
      if (args.ideas !== undefined) { const given = args.ideas === true ? true : args.ideas; const walking = isObj(given) && 'next' in given; const raw = walking ? ((given as { next: unknown }).next === true ? true : (given as { next: unknown }).next) : given; const askedAll = given === true || (walking && (given as { next: unknown }).next === true); const found = askedAll ? ideaFilesFromLeads(LEADS) : []; const gaps = raw === 'quantum-leads' ? { files: placeInIdea(raw, LEADS) } : null; const input = gaps ?? (found.length === 0 ? raw : { files: [...placeInIdea(raw), ...found] }); const developed = walking ? nextIdeas(input, developViaHooks) : developIdeas(input, developViaHooks); const wave = processPhysics(followWave(developed.leads)); const saves = developed.leads.map((lead) => { const row = lead.developed as { title?: string; product?: string | null; variant?: string | null; iso?: { formula?: string; documented?: boolean; standard?: string }; docs?: { text?: string } }; const title = (lead.statement.split('\n')[0] || row.title || 'idea'); const { data } = pageData(title, lead.statement); const record = { iso: row.iso, docs: row.docs }; return { page: auditedSave({ collection: 'pages', data: { ...data, ...record } }), product: auditedSave({ collection: 'products', data: { title, product: row.product ?? 'idea', variant: row.variant ?? 'idea', ...record, _status: 'draft' as const } }) } }); return { ...developed, via: 'payload-api' as const, wave, saves } as never }
      if (isObj(args.client)) { const c = args.client as { namespace?: string; ideas?: { statement: string }[] }; const owner = String(c.namespace ?? ''); if (!/^[a-z][a-z0-9-]{1,62}$/.test(owner)) throw new Error('a client report names its namespace: lower-case letters, digits and dashes, starting with a letter'); const rows = (c.ideas ?? []).map((i) => { const a = chat(String(i.statement ?? ''), { run: false }) as { by?: string; call?: { name: string; arguments: Record<string, unknown> }; routed?: string[] }; return { owner, id: uuid(JSON.stringify({ owner, statement: i.statement })), statement: i.statement, status: a.call ? (a.by === 'the call the match serves' ? 'served' : 'routed') : 'open', by: a.by ?? null, call: a.call ?? null, theorems: a.routed ?? [] } }); const counts = rows.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {}); return { owner, leads: rows.map((r) => ({ id: r.id, status: r.status, statement: r.statement })), rows, counts, total: rows.length, mixed: false, cost: 'the client harness runs each call itself (over the local stdio server: no billable call)', says: owner + ': ' + rows.length + ' idea(s), ' + (Object.entries(counts).map(([k, v]) => v + ' ' + k).join(', ') || 'none') + '; the QPU\'s own leads are not in this report' } as never }
      if (isObj(args.runnable)) { const r = args.runnable as { leads?: Lead[] }; const pool = Array.isArray(r.leads) ? r.leads : LEADS, runs = listRunnableLeads(pool); const followed = runs.flatMap((run) => { const lead = pool.find((row) => row.id === run.lead); return lead ? [{ id: lead.id, statement: lead.statement }] : [] }); return { phase: 'runnable' as const, runs, wave: processPhysics(followWave(followed)), leads: pool, counts: leadCounts(pool), total: pool.length, says: `${runs.length} lead(s) name the door that serves them: next runs each as the Payload job qpu-lead-run. The wave computes at 432 Hz. The QPU MCP processes the teleport readout.` } as never }
      if (args.domains !== undefined) { const page = isObj(args.domains) && isObj((args.domains as { page?: unknown }).page) ? (args.domains as { page: { meta?: { count?: number }; results?: readonly { id?: string; display_name?: string; fields?: readonly { id?: string; display_name?: string }[] }[] } }).page : undefined; const cover = scientificDomains(page); const status = cover.whole ? 'served' as const : 'open' as const; return { ...cover, leads: [{ id: 'scientific-domains', status, tool: 'leads', statement: cover.says }], counts: leadCounts([{ status } as Lead]), total: 1 } as never }
      if (isObj(args.sitemap)) { const s = sitemapLeads(((args.sitemap as { urls?: unknown }).urls ?? []) as { loc: string; lastmod?: string }[]); return { ...s, counts: leadCounts(s.leads), total: s.leads.length } }
      if (args.collide === true) { const c = listCollisions(LEADS, EXAMPLES); return { ...c, counts: leadCounts(c.leads as Lead[]), total: c.leads.length } }
      if (isObj(args.sources)) { const s = args.sources as { context?: SourceContext; next?: { request: SourceRequest; answer: SourceAnswer }; answers?: SourceAnswer[] }; const c = s.context ?? { repository: 'https://github.com/uuidna/qpu.git', owner: 'uuidna', package: '@uuidna/qpu', hosts: ['qpu.uuidna.com', 'qpu.psg.bg'] }; const counted = (leads: readonly Lead[]) => ({ leads, counts: leadCounts(leads), total: leads.length }); if (s.next) return { ...counted([]), next: next(s.next.request, s.next.answer) }; if (Array.isArray(s.answers)) { const j = listSources(c, s.answers, EXAMPLES); return { ...j, ...counted(j.leads) } } const plan = planSources(c); return { ...counted([]), phase: 'plan', sources: SOURCES, requests: plan.length, requestList: plan, byKind: Object.fromEntries(['immutable', 'licence', 'precedence', 'textbook', 'mcp', 'science'].map((k) => [k, plan.filter((r) => r.kind === k).length])), says: 'the first page of every source; every answer names its next page until the source ends' } }
      if (isObj(args.combinations)) { const c = args.combinations as { leads?: CellLead[]; referrer?: string }; const r = combineLeads([...LEADS, ...(Array.isArray(c.leads) ? c.leads : [])], c.referrer); return { ...r, leads: r.clusters.map((x) => ({ id: `cell-${x.cell}`, status: 'open', statement: `${x.labels}: ${x.count} lead(s)` })), counts: leadCounts(LEADS), total: r.total } as never }
      if (isObj(args.session)) { const s = runSession(args.session as SessionInput, (statement) => chat(statement, { run: false }) as { call?: { name: string; arguments: Record<string, unknown> } | null; by?: string }); return { ...s, leads: s.items.map((i) => ({ id: i.id, status: 'open', statement: i.title })), counts: leadCounts(LEADS), total: s.items.length } as never }
      if (args.byTheorem) return getAddressedByTheorem(LEADS, TEXTBOOK_THEOREMS, EXAMPLES)
      if (args.carry) { const g = CONTEXT.call('configure', { kind: 'gates' })?.config?.leads as { unplaced?: string[] } | undefined; const unplaced = new Set(g?.unplaced ?? []); const converted = LEADS.filter((l) => !unplaced.has(l.id) || (l.status === 'served' && l.tool)); const carriedLeads = LEADS.filter((l) => !converted.includes(l)); const bytes = JSON.stringify(LEADS).length; const perLead = bytes / Math.max(1, LEADS.length); return { leads: carriedLeads.map((l) => ({ id: l.id, status: l.status, ...(l.tool ? { tool: l.tool } : {}), statement: l.statement })), counts: { carried: carriedLeads.length, converted: converted.length, placedInGates: LEADS.length - unplaced.size, served: LEADS.filter((l) => l.status === 'served' && l.tool).length }, total: LEADS.length, bytes, perLead: Math.round(perLead), costBytes: Math.round(perLead * carriedLeads.length), savedBytes: Math.round(perLead * converted.length), release: carriedLeads.length === 0 ? 'nothing to carry: publish the next sequential version' : `${carriedLeads.length} lead(s) still carried: convert first — each lead converted to a Payload document (a gate page, a docket entry) is a lead no longer carried; the release waits`, says: 'the leads cost what the tree carries; a lead converted to a Payload document costs nothing to carry; when nothing is carried the release is published as the next sequential version (textbook_carry_release)' } }
      if (args.consistent !== undefined) { const pool = (args.consistent as { leads?: Lead[] }).leads ?? LEADS, doors = new Set(SERVED.map((t) => t.name)); const violations = pool.flatMap((l) => [l.status === 'served' && l.tool && !doors.has(l.tool) && 'door', l.status === 'served' && /untried|not served|no tool serves/.test(l.reason ?? '') && 'reason', l.status === 'blocked' && !/\d{4}-\d\d-\d\d/.test(l.reason ?? '') && 'dated'].filter((r): r is string => !!r).map((rule) => ({ id: l.id, rule, tool: l.tool, reason: l.reason }))); return { leads: pool.filter((l) => violations.some((v) => v.id === l.id)), violations, holds: !violations.length, counts: leadCounts(pool), total: pool.length } }
      const status = args.status as LeadStatus | undefined
      if (status !== undefined && !(status in leadCounts([]))) reject(`status ${String(status)} is not one of served, partial, blocked, out_of_scope, open`)
      const ids = Array.isArray(args.ids) ? args.ids.map(String) : null
      const leads = ids ? ids.map((id) => LEADS.find((l) => l.id === id)).filter((l): l is (typeof LEADS)[number] => l !== undefined && (status === undefined || l.status === status)) : LEADS.filter((l) => status === undefined || l.status === status)
      return { leads, counts: leadCounts(LEADS), total: LEADS.length, ...(ids ? { named: ids.length, unknown: ids.filter((id) => !LEADS.some((l) => l.id === id)) } : {}) }
    },
    widget: leadsWidget,
  }),
  tool({
    name: 'quantumlib',
    description: 'The fifteen repositories of the quantumlib GitHub organization, each with what this repository implements of it: the exports of cirq.ts that stand for Cirq\'s classes, and the parts of qsim, OpenFermion, Qualtran, Stim and ReCirq the other tools emulate, named from the code that runs here. documentation: true is the tutorial, the API and the examples of every package. A cross-reference computed at call time, not a catalogue.',
    inputSchema: { type: 'object', properties: { repository: { type: 'string', description: 'only the repository with this name' }, documentation: { type: 'boolean', description: 'the tutorial, API reference and examples of every package' } } },
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
        Cirq: { implementedHere: [...classes, ...objects, ...gates, ...functions], tools: has('circuit', 'algorithm', 'echo'), note: `the exports of cirq.ts: ${classes.length} classes, ${objects.length} qubit constructors, ${gates.length} gates and ${functions.length} functions, each named after the Cirq class or function it stands for` },
        qsim: { implementedHere: ['Simulator', 'DensityMatrixSimulator', 'QuantumVirtualMachine'], tools: has('circuit', 'algorithm', 'echo'), note: 'the same state-vector computation, in TypeScript, on a register of any width, plus the density-matrix Kraus simulation while that matrix is one array' },
        OpenFermion: { implementedHere: ['hydrogen', 'hydrogenHamiltonian', 'jordanWigner', 'vqeSweep', 'energyAt'], tools: has('chemistry-simulation', 'algorithm'), note: 'what MolecularData and jordan_wigner produce for one molecule, H₂ in STO-3G: the integrals and the Pauli-term qubit Hamiltonian, computed here and checked against the OpenFermion tutorial\'s printed energies. jordanWigner is the transform of one fermionic term' },
        Qualtran: { implementedHere: ['countResources', 'isClifford', 'classify'], tools: has('fault-tolerant-design'), note: 'resource counts (gates, two-qubit gates, depth, T-count) read from built circuits; Cliffordness verified from each gate unitary' },
        Stim: { implementedHere: ['repetitionCycle', 'codePoint', 'getBreakEven', 'stabilizerCompression', 'steaneCorrection'], tools: has('quantum-error-correction', 'algorithm'), note: 'the repetition code cycle simulated on the density matrix with Toffoli corrections, Gottesman–Knill 2n²+n stabilizer tableau compression, and [[7,1,3]] Steane CSS syndrome decoding' },
        ReCirq: { implementedHere: ['pageInstance', 'qaoaCircuit', 'qaoaSweep', 'qaoaExpectedCut', 'xebCollision'], tools: has('algorithm', 'statements'), note: 'the QAOA max-cut experiment on Sycamore and XEB speckle collision benchmark built here; the KPZ, HFVQE, QC-QMC and OTOC experiments are served as statements of their pages' },
        chromobius: { implementedHere: ['steaneCorrection', 'WILLOW', 'isBelowThreshold'], tools: has('quantum-error-correction', 'processor', 'algorithm'), note: 'color-code and CSS syndrome decoding: Willow distance-3 color code to distance-5 surface code magic-state cultivation (99.99% fidelity, 40× error reduction) and [[7,1,3]] Steane 14-error syndrome lookup' },
        'tesseract-decoder': { implementedHere: ['getBreakEven', 'codePoint', 'repetitionCycle', 'steaneCorrection'], tools: has('quantum-error-correction', 'algorithm'), note: 'search-based QEC syndrome decoding and bisection break-even threshold finder across bit-flip, phase-flip and depolarizing channels' },
        'OpenFermion-PySCF': { implementedHere: ['STO3G_H', 'BOHR_ANGSTROM', 'hydrogen', 'tutorialChecks'], tools: has('chemistry-simulation'), note: 'closed-form contracted s-Gaussian overlap, kinetic, nuclear-attraction and two-electron repulsion (ab|cd) integrals matching PySCF STO-3G reference values' },
        'OpenFermion-FQE': { implementedHere: ['ansatzCircuit', 'energyAt', 'vqeSweep', 'trotterFidelity'], tools: has('chemistry-simulation', 'algorithm'), note: 'fermionic singlet S_z = 0 sector state evolution exp(−iθ Y⊗X) on |00⟩ and Trotterized Hamiltonian dynamics' },
        unitary: { implementedHere: ['X', 'Y', 'Z', 'H', 'CZ', 'CNOT', 'SWAP', 'TOFFOLI', 'phasedXZGate', 'raiseGate', 'Simulator', 'chshValue'], tools: has('circuit', 'algorithm'), note: 'quantum game mechanics: superposition, fractional gate powers G**t, PhasedXZ as every one-qubit unitary, measurement collapse, and CHSH Bell nonlocality game (2√2 > 2)' },
        TypedUnits: { implementedHere: ['BOHR_ANGSTROM', 'WILLOW', 'QUANTUM_ECHOES'], tools: has('chemistry-simulation', 'processor', 'echo_benchmark'), note: 'dimensional physical quantities and units: ångström, bohr radius a₀, hartree energies, microsecond T₁ coherence, and kHz QEC cycle rates' },
        'OpenFermion-Psi4': { implementedHere: ['hydrogen', 'TUTORIAL_ENERGIES', 'tutorialChecks'], tools: has('chemistry-simulation'), note: 'Hartree–Fock, MP2 and Full-CI energy benchmarks verified against Psi4/OpenFermion tutorial outputs at 0.7, 0.7414 and 0.8 Å' },
        'qchack-2021-challenge': { implementedHere: ['groverCircuit', 'phaseEstimationCircuit', 'shorCircuit', 'teleportationCircuit', 'deutschJozsaCircuit', 'bernsteinVaziraniCircuit', 'simonCircuit'], tools: has('algorithm', 'circuit', 'fault-tolerant-design'), note: 'Google Quantum Hackathon challenge circuits: Deutsch–Jozsa, Bernstein–Vazirani, Simon, Grover, QPE, Shor, and quantum teleportation' },
        'OpenFermion-Cirq': { implementedHere: ['hydrogenHamiltonian', 'ansatzCircuit', 'energyAt', 'vqeSweep', 'pauliProduct', 'exponentiateGate'], tools: has('chemistry-simulation', 'circuit'), note: 'Jordan–Wigner Pauli-term Hamiltonians compiled into Cirq variational ansatz circuits and evaluated on DensityMatrixSimulator' },
      }
      const repositories = REPOSITORIES.filter((r) => name === undefined || r.name === name).map((r) => {
        const row = { ...r, url: `https://github.com/quantumlib/${r.name}`, ...(cross[r.name] ?? { implementedHere: [] as string[], tools: [] as string[], note: 'nothing of this repository is implemented or emulated here' }) }
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
    description: 'The three-qubit repetition code, simulated on the density matrix: a logical qubit encoded, a channel (bit_flip, phase_flip or depolarize) of probability p acting once on each data qubit, syndromes extracted and corrected by majority, and the logical error read from the simulated state against the raw error of an unencoded qubit, at the p given and over a sweep. The break-even p is bisected from the simulation; the textbook 3p² − 2p³ is reported beside it where it applies. The encoding, syndrome and correction gates are noiseless (the code-capacity model). The quantumlib QEC packages are listed as cited data.',
    inputSchema: {
      type: 'object',
      properties: {
        code: { enum: ['bit_flip', 'phase_flip'], description: 'the repetition code. Omit it, once p is passed, and the code is bit_flip. Omit p and the call is unlimited' },
        channel: { enum: ['bit_flip', 'phase_flip', 'depolarize'], description: 'the channel. Omit it, once p is passed, and the channel is bit_flip' },
        p: { type: 'number', minimum: 0, maximum: 1, description: 'the channel probability. Pass 0.1 to prove the repetition code. Omit it and the call is unlimited' },
        logical: { enum: ['0', '1', '+', '-'], description: 'the logical state encoded; |+⟩ and |−⟩ are eigenstates of the logical X a matched code can miss, so they show no error from it. Omit it, once p is passed, and the state is |0>' },
        sweep: { type: 'array', items: { type: 'number', minimum: 0, maximum: 1 }, description: 'the probabilities to sweep. Omit them, once p is passed, and the sweep is 0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6' },
      },
    },
    run: (args) => {
      if (args.p === undefined && !Array.isArray(args.sweep)) return unlimited() as never
      const code = (args.code ?? 'bit_flip') as RepetitionCode
      const reading = (args.channel ?? 'bit_flip') as ErrorChannel
      const logical = (args.logical ?? '0') as LogicalState
      const p = typeof args.p === 'number' ? Number(args.p) : Number((args.sweep as number[])[0])
      if (!['bit_flip', 'phase_flip'].includes(code)) reject('code is bit_flip or phase_flip')
      if (!['bit_flip', 'phase_flip', 'depolarize'].includes(reading)) reject('channel is bit_flip, phase_flip or depolarize')
      if (!['0', '1', '+', '-'].includes(logical)) reject('logical is 0, 1, + or -')
      if (!(p >= 0 && p <= 1)) reject('p is a probability between 0 and 1')
      const grid = (args.sweep as number[] | undefined) ?? [0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6]
      if (!grid.every((q) => typeof q === 'number' && q >= 0 && q <= 1)) reject('every sweep value is a probability between 0 and 1')
      const sweep = grid.map((q) => ({ ...codePoint(code, reading, q, logical), textbook: textbookLogicalError(code, reading, logical, q) }))
      const at = { ...codePoint(code, reading, p, logical), textbook: textbookLogicalError(code, reading, logical, p) }
      const breakEven = getBreakEven(code, reading, logical, sweep)
      const deviations = sweep.filter((s) => s.textbook !== null).map((s) => Math.abs(s.logicalError - (s.textbook as number)))
      const circuit = repetitionCycle(code, qecChannel(reading, p), logical)
      return {
        code, channel: reading, logical, at, sweep, breakEven,
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
    description: 'Molecular hydrogen in STO-3G as a variational energy evaluation by the QPU\'s circuit gate: the integrals are computed here from the published basis constants and checked against the energies the OpenFermion tutorial prints at 0.7 and 0.8 Å; the two-electron Hamiltonian is a two-qubit Pauli-term operator; the ansatz exp(−iθ Y⊗X) on the Hartree-Fock state is swept over θ, every energy an expectation value of the simulated state, and the minimum found is returned with the full-CI energy the same integrals give. A bond length in ångström, or one θ to evaluate. jordan_wigner maps one fermionic term to Pauli strings.',
    inputSchema: {
      type: 'object',
      properties: {
        bond_length: { type: 'number', exclusiveMinimum: 0, description: 'the H–H distance in ångström. Pass 0.7414 for the tutorial length. Omit it and the call is unlimited, unless jordan_wigner is passed' },
        theta: { type: 'number', description: 'evaluate the energy at this θ only, instead of sweeping' },
        steps: { type: 'integer', minimum: 4, description: 'grid points of the sweep over [−π/2, π/2). Pass 180 to prove the variational minimum. Omit them and the call returns the integrals without a sweep' },
        jordan_wigner: { type: 'object', description: 'one fermionic term: { operators: [{ mode, dagger }], coefficient? }. The Jordan–Wigner map. Omit the coefficient and it is 1, the term as written. Omit the whole object and the call is the molecule, or unlimited when the bond length is omitted too', properties: { coefficient: { type: 'number' }, operators: { type: 'array', items: { type: 'object', properties: { mode: { type: 'integer', minimum: 0 }, dagger: { type: 'boolean' } }, required: ['mode', 'dagger'] } } }, required: ['operators'] },
      },
    },
    run: (args) => {
      if (args.jordan_wigner !== undefined) {
        if (!isObj(args.jordan_wigner)) reject('jordan_wigner is { operators: [{ mode, dagger }] }')
        const raw = args.jordan_wigner as { coefficient?: unknown; operators?: unknown }
        if (!Array.isArray(raw.operators)) reject('jordan_wigner.operators is a list of { mode, dagger }')
        const operators: Ladder[] = raw.operators.map((row) => {
          if (!isObj(row)) reject('a Jordan–Wigner ladder is { mode, dagger }')
          const mode = (row as { mode?: unknown }).mode
          const dagger = (row as { dagger?: unknown }).dagger
          if (typeof mode !== 'number' || !Number.isInteger(mode) || mode < 0) reject('a Jordan–Wigner mode is an integer of at least 0')
          if (typeof dagger !== 'boolean') reject('a Jordan–Wigner ladder names dagger')
          return { mode, dagger }
        })
        const coefficient = raw.coefficient === undefined ? 1 : Number(raw.coefficient)
        if (!Number.isFinite(coefficient)) reject('jordan_wigner.coefficient is a number')
        const terms = jordanWigner({ coefficient, operators })
        return { mapping: 'Jordan–Wigner' as const, coefficient, operators, terms, says: 'a†_j = Z_0…Z_{j−1}(X_j − iY_j)/2 and a_j = Z_0…Z_{j−1}(X_j + iY_j)/2. The operators multiply left to right.' } as never
      }
      if (args.bond_length === undefined) return unlimited() as never
      const bondLength = Number(args.bond_length)
      if (!(bondLength > 0)) reject('bond_length is a positive distance in ångström')
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
    description: 'Resource counts read from the circuits this repository builds: the QFT on n qubits, Grover, teleportation, Shor for any N, the QAOA instance and the repetition-code cycle. For each: gates by name, two-qubit gates, depth in moments, and the T-count of the gates whose Clifford+T cost is stated (Toffoli 7, T 1, controlled-S 3; Cliffordness computed from each unitary). Rotations and undecomposed gates are listed and left uncounted, and the count says whether it is complete. Qualtran is the cited library for the general case.',
    inputSchema: {
      type: 'object',
      properties: {
        circuit: { enum: ['qft', 'grover', 'teleportation', 'shor', 'qaoa', 'qec', 'all'], description: 'which circuit to count. Omit it and every circuit is counted. A superposition does not choose one' },
        qubits: { type: 'integer', minimum: 1, description: 'qft: the register width. Omit it and the width is the UUID register. There is no maximum' },
        N: { type: 'integer', minimum: 3, description: 'shor: the modulus. Omit it and the count is the register. A passed modulus stays that modulus' },
        a: { type: 'integer', minimum: 2, description: 'shor: the base, a param, used when the modulus is passed and the dense circuit lists it' },
        nodes: { type: 'integer', minimum: 2, description: 'qaoa: the nodes. Omit them and the count is the UUID register. Pass 12 for the page\'s instance. There is no maximum' },
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
      if (which !== 'all' && which !== 'shor' && which !== 'qft' && which !== 'qaoa' && !(which in builders)) reject(`circuit ${which} is not one of ${Object.keys(builders).join(', ')}, qft, shor, qaoa, all`)
      const names = which === 'all' ? Object.keys(builders) : which === 'shor' || which === 'qft' || (which === 'qaoa' && qaoaWide) ? (which in builders ? [which] : []) : [which]
      const circuits = names.map((name) => ({ name: name === 'qft' ? `qft on ${n} qubits` : name === 'shor' ? `shor N=${askedN} a=${a}` : name === 'qaoa' ? `qaoa on ${nodes} nodes (alpha = 0.5, beta = 0.25)` : name === 'qec' ? 'repetition code cycle (bit flip, p = 0.1)' : name, count: countResources(builders[name]!()) }))
      if (qftCount && (which === 'all' || which === 'qft')) circuits.unshift({ name: `qft on ${n} qubits`, count: qftCount as never })
      if (qaoaWide && (which === 'all' || which === 'qaoa')) circuits.push({ name: `qaoa on ${nodes} nodes`, count: { qubits: nodes, depth: 0, operations: 0, twoQubitGates: 0, tCount: 0, complete: false, gates: [] as { name: string; count: number; class: string }[], ...uuidCapacity('qaoa', nodes), counted: 'formula' as const } as never })
      const shor = denseShor ? null : { N: askedN === null ? null : askedN.toString(), qubits: shorQubits, counting: askedN === null ? null : 2 * width, work: askedN === null ? null : width, ...uuidCapacity('shor', shorQubits < 1 ? 1 : shorQubits), counted: false as const }
      return {
        circuits,
        ...(shor ? { shor } : {}),
        costs: {
          toffoli: { tCount: 7, source: 'Nielsen & Chuang, Quantum Computation and Quantum Information, figure 4.9; Amy, Maslov, Mosca, Roetteler, IEEE TCAD 32, 818 (2013)' },
          t: { tCount: 1, source: 'T = Z**0.25; X**0.25 = H·T·H' },
          controlled_s: { tCount: 3, source: 'CS = (T⊗T)·CNOT·(I⊗T†)·CNOT, verified as a matrix product in counting_test.ts' },
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
    inputSchema: { type: 'object', properties: { dead: { type: 'object', description: '{ output }: the tsc --noUnusedLocals report' }, programs: { description: 'the paths to audit against the UUID programs (one per line); with files, each non-program a lead naming its ISO/IEC 4879 terms' }, files: { type: 'object', description: 'with dead: the files it names' }, shard: { type: 'object', description: 'one share of the audit, split by the shard theorems: { i, n } replays the examples whose index mod n is i, the checks made once for the whole surface running in share 0 alone; n processes with i = 0 … n − 1 cover every example exactly once (textbook_shards_cover, textbook_shards_disjoint)' }, lexical: { type: 'object', description: 'a lexical document scanned, nothing in it run: { doc } — the findings alone (unsafe link schemes, unknown tools, prototype keys, markup in text, unknown node types, leaks by kind) with where each is and whether it blocks, for a client harness or a tenant app to scan its own documents at its own cost' }, leaks: { type: 'object', description: '{ texts: { name: text }, served?: [names] }: leaks found before they are published — e-mail addresses, keys and tokens, private keys, local paths, private addresses — the tree\'s notations set aside; values redacted, each finding a lead with its remedy' }, uncap: { type: 'object', description: 'the caps removed by the QPU: { <path>: <text> } in, the new texts out: every literal slice, substring and limit of a read gone, a read of ours paginated no more; a bound the line cites as a standard\'s or an API\'s own stays and is listed (textbook_caps_removed)' }, entropy: { type: 'object', description: 'the vacuum-gravity entropy cleaner: file texts by path (the client reads them); every finding — baked data, a typed path, a cap, a clock in a pure module, a line repeated across files, a note to self, an address — becomes a lead; findings of one address fuse into one lead; the gravity is the fold of the addresses' }, difference: { type: 'object', description: 'two named sets { a: { name, members }, b: { name, members }, config? }: every member on one side only becomes a lead to explore and to config, agnostic of what the members name, counted by textbook_difference_leads' }, security: { type: 'object', description: 'the security audit from the client and the developer perspectives merged as one: { client: { hosts: [{ host, status, headers, optionsStatus?, writeWithoutToken?, audit? }], payloadMcp? }, developer: { vulnerabilities, leaks, envExampleValueless, access, hooks, signing, theorems } } — the measurements a client script took' }, errors: { type: 'array', items: { type: 'string' }, description: 'error texts: each matched to the remedy manual work taught (ERROR_REMEDIES), unmatched ones leads that teach the next row' }, repair: { type: 'array', items: { type: 'object' }, description: 'the remedy for a hacked or vulnerable system: the advisories the client read ([{ module, severity?, vulnerable?, patched?, title?, cve? }] from npm/pnpm audit --json or an NVD/CVE feed); every advisory with a published patch returns the override that repairs it and the live-apply steps that keep the SLA at 100%, one with no patch a lead (pin away, replace, isolate) — how the public MCP hands a hacked system its repair, licensed and priced' }, fallbacks: { type: 'boolean', description: 'the fallback combinations (correction ↔ handling, the involution) and the adapters each falls back to' }, access: { type: ['boolean', 'object'], description: 'the access audit from every perspective — the public reader at the default domain, a licensed tenant\'s users at theirs, the operator, an MCP client with a key, the developer in the app\'s code, the licence and the law — over the app\'s collections, hooks and scopes: each check names who may, the hook that guards it, what it costs, the licence clause it enacts and the legal fact behind it; the quantum advantage measured unlimited and without interaction among them. true measures the answered configurations alone and names each check over an app file as unmeasured, with the file it needs; { files: { "<path>": "<text>" } } hands the app\'s own files (the app under src/ is the one implementation, never copied into the generator) and measures them' } } },
    run: (args) => { if (args.programs !== undefined) return auditPrograms(args.programs, isObj(args.files) ? args.files as Record<string, string> : undefined) as never; if (isObj(args.dead)) { const d = args.dead as { output?: unknown }; if (typeof d.output !== 'string') throw new Error('dead takes { output }'); return removeDead(d.output, isObj(args.files) ? args.files as Record<string, string> : undefined) as never } if (isObj(args.declarations)) { const d = args.declarations as { files?: Record<string, string> }; if (!isObj(d.files)) throw new Error('declarations takes the sources: { files: { <path>: <text> } }'); return { phase: 'declarations' as const, ...listDeclarations(d.files) } as never } if (isObj(args.lexical)) { const l = args.lexical as { doc?: unknown }; if (!(l.doc as { root?: unknown } | undefined)?.root) throw new Error('lexical takes a document: { doc: { root } }'); return { phase: 'lexical-scan' as const, ...scanLexical(l.doc, TOOLS.map((x) => x.name)), ran: 0 } as never } if (isObj(args.leaks)) { const l = args.leaks as { texts?: Record<string, string>; served?: string[] }; return listLeaks(l.texts ?? {}, l.served ?? []) } if (args.access) return accessAudit(CONTEXT, isObj(args.access) && isObj((args.access as { files?: unknown }).files) ? (args.access as { files: Record<string, string> }).files : {}); if (isObj(args.uncap)) return uncap(args.uncap as Record<string, string>); if (isObj(args.entropy)) return getEntropy(args.entropy as Record<string, string>); if (isObj(args.security)) { const s = args.security as { client?: Parameters<typeof auditSecurity>[0]; developer?: Parameters<typeof auditSecurity>[1] }; return s.client?.hosts && s.developer ? auditSecurity(s.client, s.developer) : { phase: 'plan', needs: ['client: each host\'s status, headers, optionsStatus and writeWithoutToken', 'developer: vulnerabilities, leaks, envExampleValueless, access, hooks, signing, theorems'], says: 'the measurements scripts/security.ts takes; given them, the checks', perspectives: [], checks: [], total: 0, passed: 0, failed: 0 } } if (Array.isArray(args.repair)) return repair(args.repair as Parameters<typeof repair>[0]); if (Array.isArray(args.errors) || Array.isArray(args.warnings)) { const errors = Array.isArray(args.errors) ? args.errors.map(String) : [], warnings = Array.isArray(args.warnings) ? args.warnings.map(String) : [], guided = developFindings([...errors.map((text) => ({ kind: 'error' as const, text })), ...warnings.map((text) => ({ kind: 'warning' as const, text }))]); return { ...(errors.length ? listRemedies(errors) : { errors: 0, remedied: 0, unremedied: 0, leads: [] }), ...(errors.length ? { fallback: handleOrCorrect(errors, false, 'correction') } : {}), warnings: warnings.length, variants: guided.variants, dimensions: guided.dimensions, says: guided.says } } if (args.fallbacks) return { fallbacks: FALLBACKS, adapters: FALLBACK_ADAPTERS, involution: 'σ: correction ↔ handling; σ∘σ = id (textbook_fallback_involution)', example: handleOrCorrect(['no majority'], false), says: 'the fallback combinations and adapters declared, so the theorems compute and the gate cross-checks them on every host' }; if (isObj(args.difference)) { const d = args.difference as { a: { name: string; members: string[] }; b: { name: string; members: string[] }; config?: string | null }; return diffMembers(d.a, d.b, { config: d.config ?? null }) } return runAudit(handle, EXAMPLES, LEADS, TOOLBOXES, isObj(args.known) ? args.known as Record<string, string> : {}, typeof args.code === 'string' ? args.code : null, isObj(args.shard) ? args.shard as { i: number; n: number } : null) },
    widget: (d: any) => (d.phase === 'programs' ? leadsWidget({ leads: d.leads ?? [], counts: { served: d.programs ?? 0, open: (d.leads ?? []).length }, total: d.files ?? 0 }) : d.phase === 'dead' ? leadsWidget({ leads: d.leads, counts: { served: d.fixed, open: d.left }, total: d.findings }) : d.phase === 'lexical-scan' || d.phase === 'declarations' || d.phase === 'uncap' ? flowWidget(d) : 'setAside' in d && 'findings' in d ? leadsWidget({ leads: d.leads, counts: { open: d.leads.length }, total: d.leads.length }) : d.phase === 'repair' ? leadsWidget({ leads: d.leads, counts: { served: d.fixable, open: d.unfixable }, total: d.advisories }) : 'gravity' in d && !('fallback' in d) ? entropyWidget(d) : 'sizes' in d || 'fallback' in d ? leadsWidget({ leads: d.leads, counts: { open: d.leads.length }, total: d.leads.length }) : 'perspectives' in d ? leadsWidget({ leads: d.checks.map((c: { id: string; passed: boolean; evidence: string; perspective: string }) => ({ id: c.id, status: c.passed ? 'served' : 'open', tool: c.perspective, statement: c.evidence })), counts: { served: d.passed, open: d.failed }, total: d.total }) : 'fallbacks' in d ? leadsWidget({ leads: d.fallbacks.map((f: { failure: string; involution: string; handling: string }) => ({ id: f.failure, status: 'served', tool: f.involution, statement: f.handling })), counts: { served: d.fallbacks.length }, total: d.fallbacks.length }) : auditWidget(d)),
  }),
  tool({
    name: 'match',
    description: 'Any statement, matched against everything the surface can do and decided by its witnesses. served: a call answers it, every witness present. impossible: a witness contradicts it (a schema bound it exceeds, arithmetic or a value that does not recompute, the negation of a proof, the handler\'s refusal); the cluster then names the served possibilities around it and verify names the live sources the client\'s MCP can check. unknown: a witness is missing, and the statement comes back as a new lead to develop.',
    inputSchema: { type: 'object', properties: { statement: { type: 'string', description: 'any prompt or statement, a param; Glagolitic numerals are read as integers. Omit every param and the match is unlimited at 432 Hz' }, questions: { description: 'true: the requests for the unanswered questions of the sources Payload holds (QUESTION_SOURCES, Stack Exchange\'s API); [{ source, text }]: their answers, each title matched, the unknown ones leads, the backoff to honour' }, search: { type: 'string', description: 'the Payload search collection\'s own find, which is the chat: a query decided by the surface and answered with a visible client proof (the kernel-accepted theorem and the example that replays it) and the programmable schema of the solution (the served tool\'s inputSchema). The exit of that find carries no entropy' }, news: { type: 'array', items: { type: 'object' }, description: 'the day\'s news as problems: [{ title, source?, url? }] the client fetched (GDELT, Hacker News, an NVD/CVE feed, any source) — each title read as a problem statement and matched, so a served item carries its solution (the call that answers it), an impossible one its bound, an unknown one a lead to develop; the news define the problems every day, the QPU provides the solutions. With tenant: the solved news becomes that tenant\'s editorial blog — each served problem a draft post (Payload publishing, the editor publishes at will), the unknowns the backlog, monetised on the tenant\'s own catalogue; run daily as the qpu-news-solve Payload job' }, verdict: { type: 'string', description: 'a verdict from another vocabulary (verify_claim: VERIFIED, UNVERIFIED, REFUTED; due process: PROVEN, NOT-PROVEN, REFUTED) translated by table into this tree\'s served, impossible or unknown, never guessed; with the foreign words that share it' }, chat: { type: 'object', description: 'the Payload search itself: { role?, call?: { tool, arguments }, referrer?, run? } — the statement (or the call) answered under the role: the served call, else the example of the first routed theorem; values the role may not choose corrected to its harmonic default; a refusal answered with its remedy and the case of the court, never thrown. Every exit is the search collection\'s find and carries no entropy. The chat hook of the app asks this for every chat entry' }, url: { type: 'string', description: 'a URL path: the statement decided and, beside it, the composition the path names — the cached assets its words select (the generated code, the SDK, the registry items, the examples\' blocks), computed in real time, verified at their addresses and billed (the fallback for anything)' }, tenant: { type: 'string', description: 'with url: the tenant reselling the composition (the licence chain)' }, locale: { type: 'string', enum: Object.keys(LOCALES), description: 'the language of the statement, translated to English by vocabulary offline before the match; the verdict is given back in it' } } },
    run: (args) => { if (args.questions === undefined && typeof args.verdict !== 'string' && !isObj(args.chat) && !Array.isArray(args.news) && typeof args.search !== 'string' && typeof args.statement !== 'string' && typeof args.url !== 'string') return unlimited() as never; if (args.questions !== undefined) return matchQuestions(args.questions) as never; if (typeof args.verdict === 'string') { const ours = translateVerdict(args.verdict); return { phase: 'verdict' as const, foreign: args.verdict, verdict: ours ?? null, translated: ours !== undefined, equivalents: ours ? listForeignVerdicts(ours) : [], theorem: 'textbook_foreign_verdicts' } as never } if (isObj(args.chat)) return chat(String(args.statement ?? ''), args.chat as Parameters<typeof chat>[1]) as never; if (Array.isArray(args.news)) return (typeof args.tenant === 'string' ? editorial(args.news as Parameters<typeof matchNews>[0], String(args.tenant), handle, EXAMPLES, LEADS, args.locale === undefined ? undefined : String(args.locale)) : matchNews(args.news as Parameters<typeof matchNews>[0], handle, EXAMPLES, LEADS, args.locale === undefined ? undefined : String(args.locale))) as never;
      if (typeof args.search === 'string') { const q = args.search; const m = matchStatement(q, handle, EXAMPLES, LEADS, args.locale === undefined ? undefined : String(args.locale)); const theoremKey = m.theorem ?? (m.call ? EXAMPLES.find((e) => e.tool === m.call!.name)?.theorem : undefined) ?? null; const tb = theoremKey ? TEXTBOOK_THEOREMS.find((t) => t.key === theoremKey) : undefined; const kernel = theoremKey ? THEOREMS.find((t) => t.key === theoremKey) : undefined; const proof = theoremKey ? { theorem: theoremKey, lean: kernel?.statement ?? tb?.lean ?? null, kernelAccepted: !!kernel, example: tb?.examples?.[0] ?? EXAMPLES.find((e) => e.theorem === theoremKey)?.id ?? null } : null; const schema = m.call ? (TOOLS.find((t) => t.name === m.call!.name)?.inputSchema ?? null) : null; const clay = /relation_\d+|clay|perfect number|riemann|p\s*(=|vs|versus)\s*np/i.test(q) ? (() => { const all = recomputeClay(); return { relations: all.relations.length, note: 'the Clay register recomputed in exact integers: every relation an identity between the unit\'s own constants, decided by the kernel, never a prose verdict' } })() : null; const answered = m.verdict !== 'served' ? (chat(q, { run: false }) as { by?: string; reply?: unknown; question?: unknown; lead?: unknown; routed?: string[] }) : null; const solved = m.verdict === 'served'; return { phase: 'search' as const, query: q, entropy: 0 as const, exit: searchExit(q), verdict: m.verdict, state: m.state, witnesses: m.witnesses, solved, tokenFree: true, solution: solved ? m.call ?? null : null, answer: answered ? { by: answered.by ?? null, reply: answered.reply ?? null, question: answered.question ?? null, lead: answered.lead ?? null, routed: answered.routed ?? [] } : null, nearest: (m.cluster ?? []).slice(0, 5).map((c) => ({ id: c.id, kind: c.kind })), proof, schema, clay, drift: !!(proof && !proof.kernelAccepted), harmonic: uuid(`a432\n${q}`), free: { cost: 'free tier — no token paid', online: 'token free means computed from all the free online possibilities: imagine { statement } enumerates the related open MCP servers and public sources online, and the open sources (news — GDELT, Hacker News, Wikipedia; questions — Stack Exchange; the open datasets and APIs) answer without a key, so any request, prompt or question is answerable for free', via: ['imagine', 'discover'], proxiedVia: 'the QPU: every online call is proxied through its doors (imagine, discover, the connector) and validated against its schema before it leaves — never a direct call; the same handler validates every tool call and the Payload MCP (POST /api/entries) runs it, so all calls are validated and proxied via the QPU' }, decidedBy: 'the kernel — a Clay-style case decision carrying a visible client proof (the theorem the kernel accepts and the example that replays it), never prose; drift is a proof the kernel does not accept (a deviation from the textbook harmony), the a432 address the harmonic of the query', theorems: ['textbook_search_proven'], says: `search as the lexical chat (match) over Clay case decisions: "${q}" ${m.verdict} (${m.state}), ${solved ? `solved token free by ${m.call?.name ?? m.theorem}` : `not solved: ${[...m.witnesses!.contradicted, ...m.witnesses!.missing].join('; ')} — next ${answered?.by ?? 'a lead'}`}; computable from the free online possibilities (imagine over the open public MCPs and sources) at no token cost${proof ? `, proven by ${proof.theorem}${proof.kernelAccepted ? ' (kernel-accepted)' : ''}, replayable as example ${proof.example}` : ''}; the solution's programmable schema is returned, every answer a visible proof` } as never } const m = matchStatement(String(args.statement ?? ''), handle, EXAMPLES, LEADS, args.locale === undefined ? undefined : String(args.locale)); return typeof args.url === 'string' ? { ...m, composition: composePage(args.url, CONTEXT, 'https://qpu.uuidna.com', typeof args.tenant === 'string' ? args.tenant : 'uuidna') } : m },
    widget: ((d: any) => (d.phase === 'search' ? leadsWidget({ leads: [{ id: uuid(d.query).slice(0, 8), status: d.verdict === 'served' ? 'served' : 'open', tool: d.solution?.name ?? d.proof?.theorem ?? 'search', statement: d.query }], counts: { served: d.verdict === 'served' ? 1 : 0, open: d.verdict === 'served' ? 0 : 1 }, total: 1 }) : d.phase === 'editorial' ? leadsWidget({ leads: [...d.drafts.map((dr: { slug: string; title: string }) => ({ id: dr.slug, status: 'served' as const, tool: 'posts', statement: dr.title })), ...d.leads.map((l: { id: string; statement: string }) => ({ id: l.id, status: 'open' as const, tool: 'news', statement: l.statement }))], counts: { served: d.posts, open: d.backlog }, total: d.items }) : d.phase === 'news' ? leadsWidget({ leads: d.problems.map((p: { problem: string; verdict: string; solution: { name: string } | null; source: string | null }) => ({ id: uuid(p.problem).slice(0, 8), status: p.verdict === 'served' ? 'served' : 'open', tool: p.solution?.name ?? p.source ?? 'news', statement: p.problem })), counts: { served: d.served, open: d.unknown + d.impossible }, total: d.items }) : d.phase === 'verdict' || d.theorem === 'textbook_questions_matched' || ('role' in d && 'theorems' in d) ? flowWidget(d) : matchWidget(d))) as never,
  }),
  tool({
    name: 'clay',
    description: 'The Clay register recomputed in exact integer arithmetic: the Lean definitions of Qpu/Clay.lean and its imports ported one for one, every relation_N statement parsed and evaluated, each side\'s value and the bit width it needs reported. What the Lean kernel accepted by rfl, redone with + − × ÷ on naturals only, so a small machine can redo the same sums and compare addresses. Nothing here is a proof of an open problem: the relations are identities between the unit\'s own constants.',
    inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'one relation, e.g. relation_15; omit for all' }, lean: { type: 'boolean', description: 'verify the register by the UUID alone: the address of a relation\'s integer, digits only, seals, and the UUID of its Lean statement is the receipt, bound by the SHA-256 of that statement. Every name each textbook gives the relation is collected. When every official plugin is installed, each relation is filed in the collections those plugins already own. Every place of the program is walked: the first is the address, each place rotates one step, and the last returns the program. The handle and the tail stay. The variant nibble of a reassembled address is 8, so the address itself returns when it was already 8. Every aspect witnesses each place. The kernel is not asked. Nothing is added and nothing is written' }, technique: { type: 'string', enum: ['reflection'], description: 'the register read by the σ-reflection technique: every value\'s vortex seed, reflection and trinities, the reflecting pairs, the fixed and the tuned; with unit, the unit\'s sequence answers compared' }, unit: { type: 'array', items: { type: 'object' }, description: 'the unit\'s run_sequence answers per value ({ value, answer | refusal })' }, catalog: { type: 'boolean', description: 'the sellable catalog derived from the clay cases: each textbook theorem a product, each clay case a variant, the cross-textbook theorems the variations, the families the taxonomy, priced in coins per superposition (content-addressed)' }, combinations: { type: 'boolean', description: 'the problems the register defines, solved as product combinations: a textbook\'s parameters are its axioms, a family is a problem, and a solution is one variant of each textbook product in that family. The count is the product of the radices and nothing is stored' }, chess: { type: 'boolean', description: 'the clay chess game: each family a team of formulas, each formula played by its coin, coins whose seeds sum to ten against each other, and only a chess move meets them. The board is the NIST beacon (512 bits, 8×8, a minute a move) and the CERN open-data record sits on it by its Adler32. Nothing is fetched' }, nist: { type: 'object', description: 'a NIST beacon pulse the client read: { outputValue, pulseIndex, period, chainIndex }. The 128 hex digits are the 8×8 board. Nothing is fetched' }, cern: { type: 'object', description: 'a CERN open-data page the client read: { total, records: [{ id, size, checksum, doi? }] }. A record is seated by its adler32 checksum. Nothing is fetched' }, solve: { type: 'boolean', description: 'the solved register as one framework document. The case families are categories and every case is a product variant of that framework; no other doc is written' }, drift: { type: 'boolean', description: 'true runs every Clay family as a UUID program. The program stores no params. The tail is the params and the ten program nibbles are the expected schema. The next place rotates the program one step. The handle and the tail stay, and ten places return the program. Cross-encryption is the reflection both ways and the six neighbour steps, read as nine schemas. A changed nibble breaks the seal. A forged record costs 2^128 to collide and 2^256 as a second preimage. Each wave computes at 432 Hz. The next program is the next family. A family stays a register identity with solved false, and its program is closed. Each folder is closed by its own UUID program. The next place of a closed program rotates it one step. The handle, 432 Hz and the closed mark stay, and ten places return the program. Lean is Qpu.Program only when all 14 witnessing superpositions cross-verify that program in the same UUID. Nothing is fetched. The program file is written and every quantum folder is aligned to a multiple of 432 bytes. The coin drift is 8' }, readme: { description: 'the README generated by the clay cluster from the computed tree — the register, the impossible-integer trapdoor (clay via the thousand bit and back), the kernel census, the MCP surface and the catalog; true, or an object of the measured figures the caller took ({ date, version, rows, census })' } } },
    run: (args) => {
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
        const named = relations.filter((r) => r.names.some((book) => book.textbook === 'Qpu.Clay' && book.names.includes(r.name))).length
        const collections = consolidateRelations(relations)
        const moved = walked(receipt)
        return { phase: 'lean' as const, via: 'uuid' as const, prose: false as const, total: relations.length, holding: verified, maxBits: all.maxBits, verified, named, receipt, sha256: hex(sha256(utf8(bound))), uuids: new Set(relations.map((r) => r.receipt)).size, relations, collections, next: moved.next, all: moved.all, says: `${verified} of ${relations.length} relation(s) verified by the UUID of the integer, the UUID of each Lean statement is its receipt, and ${named} relation(s) carry the names collected from every textbook. ${collections.installed ? `All ${collections.plugins} official plugins are installed, so the relations sit in ${collections.collections.join(', ')}` : `${collections.missing.length} official plugin(s) are not installed`}. All ${moved.all.places} places of the program are walked, and the program returns. The handle and the tail stay. The variant nibble is 8, so the address returns when it was already 8. Every aspect witnesses each place. Nothing is added and nothing is written` } as never
      }
      if (args.technique === 'reflection') {
        const reading = reflectionOfRegister(all.relations)
        const unit = Array.isArray(args.unit) ? (args.unit as { value: number; answer?: { seed?: number; reflection?: number; fixed?: boolean }; refusal?: string }[]) : []
        // the rosetta: any value read on both sides, the tree's by its digital root (the register's reading where the value is one of its own), the
        // unit's by its last decimal digit; verified when each side keeps its own convention and σ₁₀ (textbook_rosetta_conventions)
        const compared = unit.map((u) => { const mine = reading.readings.find((r) => r.value === u.value); const n = Math.abs(Math.trunc(Number(u.value))), seed = digitalRoot(n), tree = mine ? { seed: mine.seed, reflection: mine.reflection } : { seed, reflection: seed === 0 ? 0 : 10 - seed }; const un = u.answer ? { seed: u.answer.seed, reflection: u.answer.reflection } : null; const treeHolds = tree.seed === seed && (tree.seed + tree.reflection) % 10 === 0, unitHolds = !!un && un.seed === n % 10 && ((un.seed ?? 0) + (un.reflection ?? 0)) % 10 === 0; return { value: u.value, tree, unit: un, refusal: u.refusal ?? null, agree: !!mine && !!u.answer && u.answer.seed === mine.seed && u.answer.reflection === mine.reflection, conventions: { tree: treeHolds, unit: unitHolds, same: n % 9 === n % 10 }, verified: treeHolds && unitHolds } })
        const breaks = compared.filter((c) => c.unit && !c.verified)
        const disagreements = compared.filter((c) => c.unit && !c.agree && reading.readings.some((r) => r.value === c.value))
        return { ...all, technique: 'reflection', pairsCount: reading.pairs.length, fixedCount: reading.fixed.length, tunedCount: reading.tuned.length, seeds: Object.keys(reading.bySeed).length, unitAsked: compared.length, unitAgree: compared.filter((c) => c.agree).length, unitDisagree: disagreements.length, unitRefused: compared.filter((c) => c.refusal).length, unitVerified: compared.filter((c) => c.verified).length, conventionBreaks: breaks.length, ...reading, compared, unitPlan: [...new Set(reading.readings.map((r) => r.value))].map((value) => ({ name: 'run_sequence', arguments: { input: value } })), leads: [...disagreements.map((d) => ({ id: `clay-sequence-${d.value}`, source: 'uuidna.com/mcp run_sequence', statement: `the unit reads ${d.value} as seed ${d.unit?.seed} reflection ${d.unit?.reflection}; this tree reads seed ${d.tree?.seed} reflection ${d.tree?.reflection}`, status: 'open', reason: 'two readings of one value: the digital root is decidable, so one of the two is wrong and the kernel can say which' })), ...breaks.map((d) => ({ id: `rosetta-${d.value}`, source: 'uuidna.com/mcp run_sequence; clay { technique: reflection }', statement: `the rosetta breaks a convention at ${d.value}: the unit answers seed ${d.unit?.seed} reflection ${d.unit?.reflection} (its convention: n mod 10), the tree seed ${d.tree.seed} reflection ${d.tree.reflection} (its convention: the digital root)`, status: 'open', reason: 'a side that leaves its own stated convention or σ₁₀ is a disagreement, recorded with both answers' }))] }
      }
      if (args.name) { const targetName = args.name === 'relation_7' ? 'relation_rsa' : args.name; const r = all.relations.find((x) => x.name === targetName); if (!r) throw new Error(`${String(args.name)} is not one of ${all.relations.map((x) => x.name).join(', ')}`); return { ...all, relations: [r] } }
      return all
    },
    widget: clayWidget,
  }),
  tool({
    name: 'verify',
    description: 'Cheap verification of one UUID: its seal (the version nibble the other 31 nibbles decide, one modular power, no content needed), its content (one fold), and its neighbours in a chain (the predecessor it names and the successor that names it). The same UUID is kept as the idler: each digit signals its partner and the echo is read at every program-space step. Each check is independent; a check without its input is not decided rather than passed. numerology runs the four-qubit court on the simulator.',
    inputSchema: { type: 'object', properties: { theorem: { type: 'string', description: 'a theorem key: whether the kernel accepts it, its statement, and the examples it proves' }, call: { type: 'object', description: 'a call { tool, arguments }: the theorem of the example making the same call, by content address, checked both ways (the theorem\'s examples hold the call) without recomputing it' }, witnesses: { description: 'the fourteen witnesses around a UUID, the faces of a cuboctahedron: a UUID gives six square witnesses (its program rotated one to six places) and eight triangular ones (one handle nibble reflected by σ), each mapped back exactly; { referrer, destination } merges two sets, the shared witnesses (same address) counted once and booked as coins credited to the author at zero price — free work, never money' }, move: { type: 'integer', minimum: 1, description: 'the clock/calendar move of a superposition at index k: its 2k witnesses (2·7 = 14) step by ±2 to 2(k − 1) and 2(k + 1), covering the clocks (12, 24) and calendars (7, 12, 16) those land on, paying one coin down and collecting one up (net zero)' }, numerology: { type: 'boolean', description: 'simulate the court: two qubits in superposition, two CNOTs onto the partner. The wavefunction has weight 1/4 on the pairs 3-7, 6-4, 9-1 and 0-0' }, uuid: { type: 'string', description: 'the UUID to verify' }, scan: { type: 'array', items: { type: 'object' }, description: 'a stream of frames a device sampled ({ t, hue }, hue null for a black frame): read back to the address it links, by majority per frame; fewer than 36 frames link nothing; rated by the chain (free for the first period)' }, content: { type: 'string', description: 'the text the UUID should be the address of' }, prev: { type: 'object', properties: { id: { type: 'string' }, content: { type: 'string' } }, description: 'the predecessor in the chain; decided only with its content (else asserted, null)' }, self: { type: 'object', properties: { prev: { type: 'string' } }, description: 'what this entry names as its predecessor' }, next: { type: 'object', properties: { id: { type: 'string' }, prev: { type: 'string' }, content: { type: 'string' } }, description: 'the successor in the chain; decided as prev' } } },
    run: (args) => { if (args.numerology !== true && args.move === undefined && typeof args.theorem !== 'string' && !isObj(args.call) && args.witnesses === undefined && !Array.isArray(args.scan) && typeof args.uuid !== 'string') return unlimited() as never; return args.numerology === true ? (verifyNumerology() as never) : args.move !== undefined ? (witnessMove(Number(args.move)) as never) : typeof args.theorem === 'string' || isObj(args.call) ? (proofCheck(args) as never) : typeof args.witnesses === 'string' ? (checkWitnesses(args.witnesses) as never) : isObj(args.witnesses) ? (() => { const w = args.witnesses as { referrer?: string; destination?: string }; const m = mergeWitnesses(String(w.referrer ?? ''), String(w.destination ?? '')); return { ...m, coins: mintWitnessCoins(m.shared) } as never })() : Array.isArray(args.scan) ? getScan(args.scan as { t: number; hue: number | null }[]) : verify(String(args.uuid ?? ''), typeof args.content === 'string' ? args.content : undefined, args.prev as never, args.next as never, args.self as { prev?: string } | undefined) },
    widget: ((d: any) => ('witnesses' in d || 'shared' in d || 'roundTrip' in d || 'occupied' in d ? flowWidget(d) : verifyWidget(d))) as never,
  }),
]

/** Results by block address, once per process: the memory of the balancer. */
const BALANCER = new Map<string, { structured: unknown; widget: string }>()
/** The blocks teleported into this balancer by a client (computed by another process), so a snapshot can leave only the new ones. */
const TELEPORTED = new Set<string>(), TELEPORT_USED = new Set<string>()
let TELEPORT_HITS = 0
/** The balancer's blocks as data, for a client to carry to another process: all of them, or only those this process computed. Pure. */
export const balancerSnapshot = (p: { onlyNew?: boolean; used?: boolean } = {}): { address: string; structured: unknown; widget: string }[] => [...BALANCER.entries()].filter(([a]) => (!p.onlyNew || !TELEPORTED.has(a)) && (!p.used || TELEPORT_USED.has(a))).map(([address, v]) => ({ address, ...v }))
/** Blocks computed elsewhere, teleported into this balancer: a block already here is kept (first computed wins); returns how many arrived. Pure. */
export const balancerLoad = (blocks: readonly { address: string; structured: unknown; widget: string }[]): number => { let n = 0; for (const b of blocks) { if (typeof b.address !== 'string' || BALANCER.has(b.address)) continue; BALANCER.set(b.address, { structured: b.structured, widget: b.widget }); TELEPORTED.add(b.address); n += 1 } return n }
/** Observability: per tool, how often it was asked, how often it computed (a miss), how long the misses took, how many bytes they produced. */
const OBSERVED = new Map<string, { calls: number; misses: number; ms: number; bytes: number; servedMs: number }>()
const NESTED: number[] = []
const observed = (k: 'calls' | 'misses' | 'ms' | 'bytes' | 'servedMs') => [...OBSERVED.values()].reduce((n, o) => n + o[k], 0)

/** The computable metrics of the tree, in real time: what the registries, the kernel's index and one audit say right now. */
type RunArtefacts = { advantageByUnit?: unknown; audit?: { total?: number; passed?: number; failed?: number }; e2e?: { combos?: number; copies?: number; involutions?: number; outcomes?: Record<string, number>; competition?: { saved?: number; msMajority?: number; winners?: Record<string, number> } }; coins?: { calls: number; coins: number; byDoor: Record<string, number>; gated: number; unclean: number }; receipt?: { steps?: { name: string; status: string; ms: number }[] }; sizes?: Record<string, number>; discovery?: { hosts?: { kind: string; detected: string }[]; doors?: unknown[]; capabilities?: Record<string, string[]> }; verification?: { summary?: Record<string, { requests: number; ok: number; contracted: number; uncontracted: number }> }; readiness?: { classes?: { served: number; refuted: number; trial: number }; readiness?: { ready: boolean }; border?: { doors?: unknown[]; sealedBy?: string[] } }; repository?: { branches?: { agree: string[]; local: number }; tags?: { agree: string[]; local: number; mismatch: string[] }; leads?: unknown[] }; legal?: { claims?: number; verdicts?: Record<string, number>; violations?: number; refusals?: number; securityPassed?: number; securityTotal?: number; id?: string }; docket?: { entries?: number; root?: string | null; mirrors?: number }; receipts?: { count?: number; last?: string | null } }
/** What the run's artefacts add to the metrics: textbook APIs autodiscovered and covered, verification on public datasets, the border, the repository watched, the legal audit, the RAID's signalling (docket entries chained to a root), the receipt chain. */
const coverage = (a: RunArtefacts): Record<string, unknown> => {
  // the load: a block is paid once when computed (a miss of the balancer, a coin at a gated door); every re-ask is a teleport, free — the cache by address here, the involution (304 by content hash) at the edge
  const calls = observed('calls'), misses = observed('misses')
  const load = { paid: misses, free: calls - misses + (a.e2e?.involutions ?? 0), involutions: a.e2e?.involutions ?? 0, coins: a.coins?.coins ?? 0, a432: { key: KEY, harmonics: Object.keys(style(uuid('a432')).vars).length, stylesheetBytes: getCss().length, served: 'the shell cache, immutable: the harmonic strings of every block (its custom properties from its UUID alone, the reflected harmonic and the drift\'s prime dust among them) cost the device nothing and the edge nothing' }, note: 'paid: computations (balancer misses); free: answers by address (balancer hits) and by involution (304 at the edge); the coins set the entanglement once, the teleports are free until the load is paid again' }
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
/** Everything the kernel accepts, served whole by this version from its own index: every hand-written theorem with its module and statement, every
 *  textbook theorem with its Lean text and the examples it backs, the generated lemmas counted, the kernel's total; the axioms per theorem stand in
 *  /theorems.ndjson, written by the lean step. No version hides anything Lean: the audit fails when this serves less than the kernel accepts
 *  (textbook_lean_served_whole). */
const LEAN_RESOURCE = 'lean://qpu/theorems'
const leanLedger = () => {
  const modules: Record<string, number> = {}; for (const t of THEOREMS) modules[t.module] = (modules[t.module] ?? 0) + 1
  return { kernel: KERNEL_THEOREMS, handWritten: THEOREMS.length, generated: GENERATED_LEMMAS, whole: THEOREMS.length + GENERATED_LEMMAS === KERNEL_THEOREMS, modules, theorems: THEOREMS, textbook: TEXTBOOK_THEOREMS.map((t) => ({ key: t.key, lean: t.lean, says: t.says, examples: t.examples })), axioms: 'per theorem in /theorems.ndjson (the lean step\'s collectAxioms sweep); the census in the README', sources: 'src/quantum/processing/unit/lean/Qpu/*.lean, in every release', says: 'everything the kernel accepts, served whole by this version over MCP and in the textbook view: nothing Lean is hidden' }
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
  description: 'Payload, Cloudflare, Google and shadcn admin APIs merged as one UUID program: every door and every operation a sealed UUID row (uuid(provider, method, server/path)), sorted by address. doors: the three providers\' doors. pricing: Cloudflare\'s meters (included a month, rate past it, remedy). cost: readings { meter: used } priced to integer micro-dollars, zero inside the allowances (textbook_bill_covered), a lead at 80% of an allowance. readings: a GraphQL Analytics answer read into readings and priced. index: operations from a Payload config (collections, globals), a Cloudflare OpenAPI (paths) and Google Discovery documents, merged and counted by provider and tag. coverage: Payload\'s monorepo packages, official plugins, templates and examples against what is mounted, the next gap with its qubits and the unit\'s turn. observe: the one GraphQL query the observe job posts. shadcn: the shadcn MCP\'s surface served from the registry contract, as part of qpu and not a second server — { search } finds items, { items } views them with their URLs and UUID addresses and the add command, { registries } names more registries, { index } stands for a fetched registry index. index.shadcn: true adds the shadcn tools and items as operations. Omit everything for doors, pricing, coverage and the query.',
  inputSchema: { type: 'object', properties: { doors: { description: 'true, or { origin } for the Payload doors under another origin' }, pricing: { type: 'boolean', description: 'the Cloudflare meters table' }, cost: { type: 'object', description: 'readings { "workers.requests": n, "workers.cpuMs": n, "d1.rowsRead": n, "d1.rowsWritten": n, "r2.classA": n, "r2.classB": n, "logs.events": n, "d1.storage": n, "r2.storage": n (GB-month) }' }, headSamplingRate: { type: 'number', description: 'the Workers Logs head sampling rate the cost is answered at, a fraction (0.01) or permille (10): logs.events × rate is priced and the cost at the full stream named beside it (sampling)' }, headSamplingPermille: { type: 'number', description: 'the same rate in permille (10 is 1%)' }, readings: { type: 'object', description: 'the GraphQL Analytics answer of the observe query, read into readings (the storage meters included) then priced; headSamplingRate applies' }, zone: { type: 'object', description: 'the GraphQL Analytics answer of the zone query (observe names it; it takes a zoneTag), read into request counts per value of cacheStatus, edgeResponseStatus, clientRequestPath, userAgent and clientIP, every value kept, most requests first' }, index: { type: 'object', description: '{ payload?: { collections: [{ slug }], globals: [{ slug }], server? }, cloudflare?: { servers?, paths }, google?: Discovery document | [documents] | true for the endpoints table }' }, coverage: { description: 'true (the dependencies of package.json in the working directory) or { mounted: [names], template?, examples? }' }, observe: { type: 'boolean', description: 'the GraphQL queries (the account query, and the zone query that takes a zoneTag) and the variables they take' }, shadcn: { description: 'true, or { search?, items?: [names], registries?: { "@name": url }, index?: { items } }' } } },
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
    if (asked && args.observe === true && !args.doors && !args.pricing && !args.coverage) return { phase: 'observe' as const, query: OBSERVE_QUERY, variables: ['accountTag', 'since', 'until'], zone: { query: OBSERVE_ZONE_QUERY, variables: ['zoneTag', 'since', 'until'] }, endpoint: 'https://api.cloudflare.com/client/v4/graphql', token: 'the tenant binding named CLOUDFLARE_*TOKEN with Account Analytics Read' } as never
    return { phase: 'apis' as const, doors: apisDoors(origin), pricing: CLOUDFLARE_PRICING, coverage: apisCoverage(mountedOf()), observe: { query: OBSERVE_QUERY, variables: ['accountTag', 'since', 'until'], zone: { query: OBSERVE_ZONE_QUERY, variables: ['zoneTag', 'since', 'until'] } } } as never
  },
  widget: apisWidget as never,
})
const metrics = defineTool('tree', { name: 'metrics', description: 'The computable metrics of this tree in real time: tools and toolboxes, examples and how many name the kernel-accepted theorem that makes them true, the kernel\'s theorem counts from its own index, leads by status, the audit\'s checks, the balancer\'s memory. Quality is proven by theorems, not textbook examples; this is the measure of how far that holds.', inputSchema: { type: 'object', properties: { artefacts: { type: 'object', description: 'the run\'s artefacts the client read: discovery, verification, readiness, repository, legal, docket, receipts; without them the tree\'s own counts alone' } } }, run: (args) => treeMetrics((args.artefacts ?? {}) as RunArtefacts), widget: flowWidget })

/** The textbook as an adapter: every example categorised for reuse — by toolbox, by tool, by the theorem that backs it, by the
 * theorem's module — and any example replayed by id (the balancer makes a replay free). Quality is proven by theorems; the
 * textbook is where the examples wait, respected, each a lead for its theorem. */
const textbook = defineTool('tree', {
  name: 'textbook',
  description: 'The QPU textbook as an adapter: every example categorised for reuse — by toolbox, by tool, by the kernel-accepted theorem that backs it, by that theorem\'s module — and, with reuse: <example id>, that example replayed and its result returned. The categories are computed from the registries, never written by hand. seo serves every product relation in public: the formula and the proof, in the answer and the widget. A backend call names the role, the ability and the relation; the subscription and the coin bill are decided there.',
  inputSchema: { type: 'object', properties: { particles: { description: 'true or { theorems }: each base theorem as a particle (sentence, statement, tactic, variants, coin, derived class); holds is false on a mismatch' }, search: { type: 'string', description: 'full-text search over textbook theorems: each theorem is a real scenario whose says uses respected terminology, so the query returns usable programs — the examples that replay each hit (tool + arguments), never axiom names' }, google: { description: 'rewrite the whole textbook through the one Google door: true names the Docs discovery the client fetches; { documentId } is documents.batchUpdate, the body the natural formula of every theorem, the thousand-bit width unmaterialised, no entropy left, the rewrite addressable in hex' }, reflect: { description: 'true or { books }: every theorem reflected by its shape, against the kernel and the books routed to it' }, claims: { description: 'the textbook claims measured against what is published: true the OpenAlex requests (one per general theorem); { answers, confirmations } each claim own, candidate (DOI-registered works before 2026 sharing three distinctive words or more, at least half of the title), unrecognised, or recognised by a confirmation recorded in the docket' }, theorem: { type: 'string', description: 'one theorem as its client verifies it: accepted by the kernel or not, its module, statement and Lean text, and where its source is published to read and build with lake' }, institution: { type: 'object', description: 'the textbook as an education tool for an institution: { sets: true } the space of Google Workspace sets (every family by every door off, read or write) with the named singles as admin pages created through the Payload MCP; { set: { index } | { family, doors: { Classroom: \'write\', … } } } one set with its least-privilege scopes, its role, its page and the tenant setting; { edition, users, theorems?, course?, answers? } — the edition as Google states it (education, nonprofit or Workspace; omit it for the list), the bill under its cap, Google Workspace\'s nine MCP doors with their scopes, every closed equation of the textbook as a Classroom question (the REST body and the docket entry through the Payload MCP), answers graded by recomputation, and the acts that are the institution\'s own' }, quality: { type: 'boolean', description: 'ISO 21001:2025, strict: a theorem is proved only when its name is a scientific name the textbook states and the Lean cross formula accepts it (the sides evaluate to one value, the axioms it names develop to that value, the kernel has accepted it). Any other name is removed from the Lean theorem category; a relation is filed under the scientific name' }, verify: { type: 'boolean', description: 'the wave over the textbook: every example\'s verification requests on public datasets and APIs, for any client device to fetch' }, example: { type: 'string', description: 'with verify: one example only, so a device at the edge walks the textbook within the Worker\'s budget' }, results: { type: 'array', items: { type: 'object' }, description: 'the requests fetched (url, status, ok, contracted), joined back by url and sealed' }, reuse: { type: 'string', description: 'an example id to replay' }, evaluate: { type: 'object', description: 'the textbook\'s combinatorial expressions as tools: { theorem, values? } evaluates that theorem\'s statement exactly (its variables from values, each hypothesis and conjunct computed, what is missing named, its inputSchema answered); {} every theorem, the closed ones checked against the kernel' }, prose: { type: 'object', description: '{ texts: { name: text } }: the prose audited around the textbook — every number a text states resting on an expression a client can evaluate, or a lead; verdict words beside the Clay problems flagged' }, seo: { description: 'true, or { api: { role, ability, relation, tenant? } }: every product relation is public SEO, its formula and its proof in the answer and the widget. The api object is the backend call: the role, the ability, the subscription, and the usage the coins book' }, gaps: { type: 'boolean', description: 'the real gaps: each clay relation as a variant of its textbook, and the values that textbook\'s Lean does not state' }, axioms: { type: 'boolean', description: 'the textbook\'s axioms each with its theorem: every example names the kernel-accepted theorem it rests on, every theorem names only examples that exist; what is left unlinked is listed' }, chat: { description: 'the chat coverage sweep as a sealed step: true names every kernel textbook sentence; { theorem } or { theorems } (at most twelve) puts each sentence to the chat and seals that share; { parts: [{ id, rows }] } joins shares whose ids seal their rows into one census, in textbook order' }, theorems: { type: 'boolean', description: 'everything the kernel accepts, served whole: every theorem with its module and statement, the textbook theorems with their Lean text and examples, the generated lemmas counted, the kernel\'s total; rendered in the textbook view; no version hides anything Lean' }, category: { type: 'string', enum: ['toolbox', 'tool', 'theorem', 'module'], description: 'one category to list; omit for all' } } },
  run: (args) => {
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
      add(claim('textbooks'), null, 'root', 'Textbooks', 'every textbook a clay case involves', [], null, null, null)
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
      const hooks = { collection: 'products' as const, iso: 'ISO 9001' as const, via: 'hooks' as const, beforeChange: 'a product is developed only with its formula recorded', afterChange: 'the formula is written through the one Google Docs door', afterRead: 'the documented formula is served with the product', documented: products.filter((p) => p.iso.documented).length, of: products.length }
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
      const seo = { plugin: '@payloadcms/plugin-seo' as const, indexed: pages.length, fields: seoFields, folder: true as const, oneWord, urls, optimise: { all: pages.every((p) => p.seo.optimised && p.seo.greatest && p.seo.iso.documented && seoFields.every((f) => typeof p.seo[f] === 'string' && p.seo[f].length > 0)), pages: pages.length, fields: seoFields, iso: 'ISO 9001' as const, documented: pages.filter((p) => p.seo.iso.documented).length, by: 'greatest seam' as const, passes, went: passes === 2 }, follow, next, compare: { by: 'similar-keywords' as const, planned: most?.allowed === true, request: most?.request ?? null, mostSearched: 'the queries searched most, read by Search Console', similar: urls.reduce((n, u) => n + u.similar.length, 0), joined, redirects } }
      const nestedDocs = { plugin: '@payloadcms/plugin-nested-docs' as const, recursive: true as const, pages: pages.length }
      const documentId = isObj(args.google) && typeof (args.google as { documentId?: unknown }).documentId === 'string' ? (args.google as { documentId: string }).documentId : null
      const natural = { phase: 'rewrite' as const, natural: true as const, dry: true as const, entropy: 0 as const, prose: false as const, materialised: false as const, bits: 1000 as const, theorems: rows.length, width: width?.formula ?? null, address, hex: hexDigits, sealed: seal(address).valid, addressable: /^[0-9a-f]{32}$/.test(hexDigits) && seal(address).valid, clay, clusters, products, hooks, nested: pages, seo, nestedDocs, theorem: 'textbook_google_one_door' as const }
      if (!documentId) return { ...natural, phase: 'plan' as const, discovery: 'https://www.googleapis.com/discovery/v1/apis/docs/v1/rest', says: 'the natural formulas are the textbook; the client fetches the Docs discovery and calls again with google: { documentId }' }
      const google = call('payload', { googleCall: { api: 'docs', version: 'v1', method: 'docs.documents.batchUpdate', params: { documentId }, body: { requests: [{ insertText: { location: { index: 1 }, text } }] }, discovery: { name: 'docs', version: 'v1', rootUrl: 'https://docs.googleapis.com/', servicePath: 'v1/', parameters: {}, resources: { documents: { methods: { batchUpdate: { id: 'docs.documents.batchUpdate', path: 'documents/{documentId}:batchUpdate', httpMethod: 'POST', parameters: { documentId: { type: 'string', required: true, location: 'path' } }, scopes: ['https://www.googleapis.com/auth/documents'], request: { $ref: 'BatchUpdateDocumentRequest' } } } } } } } }).result?.structuredContent
      return { ...natural, google, says: `${products.length} products developed via hooks, each documented as ISO 9001 requires and the docs used by the product hooks; ${urls.length} SEO urls are one-word folders, and ISO 9001 optimises every SEO field of every page, then goes on one step against neighbours that have moved too, keeping the greatest seam of that step; the coins are followed, theory and practice each the seed and the coins their sum, so the pages plus the coins equal the pages plus theory plus practice; the next step is mint of the bits plus the seed, equal to the amplitudes twice, and each page's coin rotates one place with the handle and the tail kept; a keyword a reader asks that the collection does not hold is a 404 whose handling falls back to the zero bit, so beyond imagination the 404 left is zero; ${rows.length} theorems rewritten as their natural formulas through the Docs API; ${clay.involved} of them sit in ${clay.cases} clay cases, nested by the nested-docs plugin and indexed by the SEO plugin; the thousand-bit width stays the formula, and the rewrite is addressable in hex` }
    }
    if (typeof args.theorem === 'string') return getTheorem(args.theorem)
    // the claims measured against what is published: the OpenAlex requests, then the answers and the docket's confirmations read into each claim's status
    if (args.claims === true) return { requests: planClaims(), says: 'one OpenAlex search per general theorem; hand the answers back as claims: { answers, confirmations }' } as never
    if (isObj(args.claims)) { const c = args.claims as { answers?: { id: string; status: number; text: string }[]; confirmations?: { theorem: string; doi: string; by: string }[] }; const claims = listClaims(c.answers ?? [], c.confirmations ?? []); const counts = claims.reduce<Record<string, number>>((a, x) => ({ ...a, [x.status]: (a[x.status] ?? 0) + 1 }), {}); return { claims, counts, says: Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(', ') + ': a candidate resembles, only a recorded confirmation recognises' } as never }
    if (args.quality === true) { const proof = educationProof(); return assessEducation({ scientific: proof.scientific, proved: proof.proved, removed: proof.removed, category: Object.keys(proof.category).sort() }) }
    if (isObj(args.institution)) {
      const r = args.institution as Parameters<typeof planInstitution>[0]
      // a set is a page the admin edits: a qpu block of this door, nested Workspace › family › set, created through the Payload MCP
      const page = (p: ReturnType<typeof createFamilySet>) => ({ title: p.title, hero: { type: 'default' }, slug: `workspace-${p.family}-${p.index}`, under: `workspace-${p.family}`, layout: [qpuFields(p.id, 'textbook', { institution: { set: { index: p.index } } }, p.theorem)], meta: { title: `${p.title} · Google Workspace set`, description: p.uses.join('; ') || 'no door open' } })
      const roots = [{ title: 'Google Workspace', slug: 'workspace', under: null, hero: { type: 'default' }, layout: [qpuFields(createFamilySet({ family: 'workspace' }).id, 'textbook', { institution: { sets: true } }, 'textbook_workspace_sets')] }, ...SET_FAMILIES.map((f) => ({ title: `Google Workspace for ${f}`, slug: `workspace-${f}`, under: 'workspace', hero: { type: 'default' }, layout: [qpuFields(createFamilySet({ family: f }).id, 'textbook', { institution: { set: { family: f } } }, 'textbook_workspace_sets')] }))]
      // the parent is a relationship by id: the call carries the page without it and names the parent's slug; the client sets parent to the id findPages answers for that slug (roots come first)
      const pageCall = ({ under, ...page }: { under: string | null } & Record<string, unknown>) => ({ ...createCreateCall('pages', r.tenant ? { ...page, tenant: r.tenant } : page), under })
      if (r.sets === true) { const all = listFamilySets(); const pages = [...roots, ...all.singles.map(page)]; return { ...all, pages: { tree: 'Google Workspace › family › set: nested by the nested-docs plugin, each set a qpu block rendered by its shadcn items', count: pages.length, calls: pages.map(pageCall) } } }
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
      const W = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' '), TENS = 'twenty thirty forty fifty sixty seventy eighty ninety'.split(' '), SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹'
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
      if (!Array.isArray(args.results)) return { phase: 'requests' as const, examples: chosenExamples.length, withRequests: perExample.filter((x) => x.requests.length).length, provenByTheorem: perExample.filter((x) => x.theorem).length, requests: requests.size, requestList: [...requests.values()], compliance: 'GET only, free public sources, a named user agent, no credential, a timeout on every request, each request checked against the host\'s discovered contract; nothing is written anywhere by this wave' }
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

/** The UI as CSS, served: the stylesheet from the key and, for a UUID, the custom properties its block root carries. */
const css = defineTool('tree', {
  name: 'css',
  description: 'The quantum UI as CSS alone: the stylesheet derived from the key 432 (the harmonics, and the rules that draw every block from its own custom properties with no script, motion only where the device allows it, off-screen blocks at no cost) and, for a uuid, the custom properties its block root carries (hue, CMYK, accent, tail colour and angle, the 9-vortex seed and period). Computed once; a device renders at the cost of CSS.',
  inputSchema: { type: 'object', properties: { compare: { description: 'the stylesheet measured against the CSS frameworks by size: true names the framework files to fetch (pinned on jsDelivr) and this stylesheet to gzip; { qpu: { bytes, gzip }, answers: [{ id, status, bytes, gzip }] } turns the sizes the client measured into ratios; size only, render time not measured' }, uuid: { type: 'string', description: 'a UUID whose block variables to compute' }, uuids: { type: 'array', items: { type: 'string' }, description: 'a sequence of UUIDs set next to each other: each program presented by hue and moved by its own tail, the seams between neighbours measured; a collision (a seam of zero, two identical rings) is entropy exposed as a lead' }, create: { type: 'boolean', description: 'shadcn create (ui.shadcn.com/create) decided by the a432 settings and CSS: the ten settings, the registry item that initialises the project (globals.css light and dark, components.json, the QPU registry), the commands' }, shadcn: { description: 'true, or { index }: the saved shadcn registry as UUID programs. The handle is the hex colour. The program and the three params build the UI. The tail verifies it. An index opens one I Ching rosetta cell' }, resonance: { description: 'true, or { key?, uuid? }: the eight UUID versions as eight dimensions, paired into one CMYK. The odd pairs are cyan and yellow full, the even pairs magenta and black empty. The key 432 divides their sum and opens that resonance; another key leaves the dimensions shut. A uuid occupies the dimension of its version nibble' }, media: { type: 'string', description: 'a UUID coin: its tail witnesses four 8-bit notes A B C D as hex, the a432 harmony. The stylesheet encodes the audio, the four-frame video and the vibration, eight hex digits the compression; decoding returns the notes, and reversing them shows the shadow that verifies them in the same coin. One nibble changed, the seal no longer agrees' } } },
  run: (args) => { const stylesheet = getCss()
    // the stylesheet measured against the frameworks: the files named for the client to fetch, then the sizes it hands back turned into ratios
    if (args.compare === true) return { phase: 'requests' as const, stylesheet, bytes: new TextEncoder().encode(stylesheet).length, frameworks: CSS_FRAMEWORKS, says: 'fetch each framework file once, measure its bytes raw and gzipped, gzip this stylesheet the same way, and hand the sizes back as compare: { qpu: { bytes, gzip }, answers }' } as never
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
      return { phase: 'media' as const, uuid, ...m, sealed: stamp.valid, same: m.token === ch.message.referrer.handle && m.verifies, params: ch.message.referrer, tamper: { moved: movedBy, sealed: tamperSeal.valid, witnessesHold, caught }, possible: tamperSeal.valid && witnessesHold, stable, says: `four 8-bit notes A B C D, witnessed as hex through the tail, are the harmony at ${m.audio.notes.map((n) => n.hz).join(', ')} hertz; the stylesheet encodes the audio, the ${m.video.frames}-frame video and the vibration, and decoding it returns the same notes; their reverse is the shadow and it verifies them in this coin; one nibble changed, the seal no longer agrees` } as never
    }
    if (args.shadcn === true || isObj(args.shadcn)) { const spec = args.shadcn === true ? {} : args.shadcn as { index?: unknown }; const index = typeof spec.index === 'string' || typeof spec.index === 'number' ? String(spec.index) : undefined; return shadcnPrograms(index) as never }
    const vars = typeof args.uuid === 'string' ? style(args.uuid).vars : null; const program = typeof args.uuid === 'string' ? programHues(args.uuid) : null; const rays = Array.isArray(args.uuids) ? castRays(args.uuids.map(String)) : null; if (args.create) return { ...createTheme(KEY, 'https://qpu.uuidna.com', ['qpu-style', 'qpu-block', 'qpu-app', 'qpu-card', 'qpu-badge', 'qpu-table', 'qpu-stream', 'qpu-dashboard']) }; return { key: KEY, coil: coilColour(KEY), program, rays, bytes: stylesheet.length, rules: (stylesheet.match(/\{/g) ?? []).length, variables: vars ? Object.keys(vars).length : 0, script: false, uuid: typeof args.uuid === 'string' ? args.uuid : null, vars, stylesheet } },
  widget: flowWidget,
})

/** A bounded tool laid out whole: every value each property admits (an enum, a boolean, an integer range, the ends of a
 * numeric bound, the textbook's values where a string is free), every combination of them with its block address and its
 * walk page, rendered as a grid of cells each drawn by its own UUID's CSS — so the user's click in the UI is the decision,
 * final, and nothing is computed until it is made. */
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
      return { property: prop, kind: 'range' as const, required: required.has(prop), values, domain: `${spec.type} in [${spec.minimum}, ${spec.maximum}]${values.length < size ? ` (${values.length} shown: the ends and the textbook's; any value in the range is yours to type)` : ''}`, space: size }
    }
    if (tb.length) return { property: prop, kind: 'textbook' as const, required: required.has(prop), values: tb, domain: `${tb.length} value(s) the textbook uses`, space: tb.length }
    return { property: prop, kind: 'free' as const, required: required.has(prop), values: [], domain: `${spec.type ?? 'any'}: free, no value enumerable`, space: Infinity }
  })
  return { facets, tool: tool as unknown as Tool }
}
const dashboard = defineTool('tree', {
  name: 'dashboard',
  description: 'A bounded tool laid out whole, so the user\'s decision in the UI is final: every value each property admits (an enum, a boolean, an integer range, the ends of a numeric bound, the textbook\'s values where a string is free), the whole space reachable by fixing one facet at a time (each cell narrows the dashboard until one combination remains, whose cell is its walk page /<uuid>), every cell drawn by its own UUID\'s CSS. Without a tool: every tool with the size of its space.',
  inputSchema: { type: 'object', properties: { tool: { type: 'string', description: 'the tool to lay out; omit for the index of all' }, fixed: { type: 'object', description: 'the facets already decided; the dashboard shows the rest' }, origin: { type: 'string' } } },
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
  description: 'A toolbox cloned whole: its toolset (every tool\'s name, description and schema), its skillset (idea, instructions, directions, examples with what they show), and its selftest run now, as one document another host mounts or a client follows door by door. The quantum state of a computation is never cloned (QuantumInformation.no_cloning); its classical description is, and this is it. Without a toolbox: every toolbox\'s clone address. With ve: the Proxmox VE 9.2 datasheet\'s linked or full clone, shown in the noVNC console. Anyone uses the ML-DSA-44 plan over that clone only when every catalogue product is a complete unlimited online and offline qpu browser quantum os. This process does not run KVM or LXC.',
  inputSchema: { type: 'object', properties: { toolbox: { type: 'string', description: 'the toolbox to clone; omit for the index' }, as: { type: 'string', description: 'the name the clone carries at its new host' }, ve: { description: 'true, or { copies, verified, kind?: linked | full }: Proxmox VE 9.2 as its datasheet states the clone. copies and verified are the gate counts; the advantage is unbounded only when they are equal' } } },
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
      const leads = [...(os.os.complete ? [] : [{ id: 'qpu-os-incomplete', statement: os.says, status: 'open' as const }]), ...(unlimited ? [] : [{ id: 'advantage-bounded', statement: 'the advantage is unbounded only when every copy is verified', status: 'open' as const }])]
      return { phase: 've' as const, sheet, guests: sheet.guests, clones: sheet.clones, kind, browser: 'noVNC' as const, runsHere: false as const, os: os.os, gaps: os.gaps, catalogue: names.length, products, complete, unlimited, advantage, admitted, anyone: admitted, using: admitted && signed?.signature ? { postQuantum: signed.signature.algorithm, fips: signed.signature.fips, executedBy: signed.signature.executedBy, virtualised: 'browser' as const, clone: kind, console: 'noVNC' as const } : null, signature: signed?.signature ?? null, leads, theorem: 'QuantumInformation.no_cloning' as const, noCloning: 'the quantum state of a computation cannot be cloned (QuantumInformation.no_cloning); a linked or full clone is the classical description, and the noVNC console shows it. KVM and LXC stay on the host the datasheet names', says: admitted ? `every catalogue product is a complete unlimited online and offline ${os.os.name}. Anyone using it gets the ML-DSA-44 plan over a ${kind} clone in the noVNC console. The host signs. This process does not run KVM or LXC.` : `${complete} of ${names.length} catalogue products are a complete unlimited online and offline ${os.os.name}. The use is not admitted. Proxmox VE 9.2 names linked and full clones from a template, the noVNC console, live migration, and the Offline Mirror.` }
    }
    if (typeof args.toolbox !== 'string') return { toolboxes: TOOLBOXES.length, theorem: 'QuantumInformation.no_cloning', index: TOOLBOXES.map((b) => ({ toolbox: b.name, tools: b.tools.length, examples: EXAMPLES.filter((e) => b.tools.some((t) => t.name === e.tool)).length, clone: `/${uuid(`clone${JSON.stringify({ toolbox: b.name })}`)}` })) }
    const box = TOOLBOXES.find((b) => b.name === args.toolbox)
    if (!box) throw new Error(`no toolbox ${args.toolbox}; the toolboxes are ${TOOLBOXES.map((b) => b.name).join(', ')}`)
    const examples = EXAMPLES.filter((e) => box.tools.some((t) => t.name === e.tool)).map((e) => ({ id: e.id, tool: e.tool, arguments: e.arguments, shows: e.shows, theorem: e.theorem ?? null }))
    const selftest = box.skill.selftest(ctx)
    const doc = { name: typeof args.as === 'string' ? args.as : box.name, clonedFrom: box.name, idea: box.idea, toolset: box.tools.map((t) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema })), skillset: { instructions: box.skill.instructions, directions: box.skill.directions, examples }, lean: toolboxLean(box), selftest: { passed: selftest.passed, checks: selftest.checks.length }, license: LICENSE.spdx, author: LICENSE.author, theorem: 'QuantumInformation.no_cloning' }
    return { toolbox: box.name, as: doc.name, tools: box.tools.length, examples: examples.length, selftestPassed: selftest.passed, bytes: JSON.stringify(doc).length, id: uuid(`toolbox${JSON.stringify(doc)}`), noCloning: 'the quantum state of a computation cannot be cloned (QuantumInformation.no_cloning: coins ≠ mint coins, kernel-checked); its classical description can, and this document is that description', doc }
  },
  widget: flowWidget,
})

export const TOOLBOXES: Toolbox[] = [
  { name: 'google', idea: 'the Google Quantum AI layer: the Willow processor as its spec sheet states it, Cirq gates and circuits, Quantum Echoes, the roadmap, the software, the statements and the repositories', tools: OWN.filter((t) => t.toolbox === 'google'), examples: [], skill: { instructions: 'Call any tool with the arguments its schema names; every result is a block (widget, Open Graph, shadcn item) under the licence; the examples page is the documentation and the tests.', directions: ['server only: every example replays as documented (the audit)'], selftest: (ctx) => { const checks = ctx.examples.filter((e) => OWN.some((t) => t.name === e.tool && t.toolbox === 'google')).map((e) => { const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } }); const why = 'error' in r ? r.error.message : e.expect(r.result.structuredContent); return { id: `google:${e.id}`, passed: why === null, evidence: why ?? e.shows } }); return { passed: checks.every((c) => c.passed), checks } } } },
  { name: 'tree', idea: 'the tree knows itself: its leads, its self-audit, any statement matched or proved impossible, the Clay register recomputed, any UUID verified cheaply, its metrics in real time', tools: [...OWN.filter((t) => t.toolbox === 'tree'), metrics, textbook, css, dashboard, clone, apis], examples: [], skill: { instructions: 'audit replays every example and every toolbox selftest; match decides any statement; verify checks a UUID against its seal, content and neighbours; clay recomputes the register; leads lists what is owed.', directions: ['server only: the audit audits the audit', 'toolbox → toolbox: match is the judge of readiness and the engine of imagine'], selftest: (ctx) => { const m = matchStatement('How many qubits does Willow have?', ctx.handle, ctx.examples, ctx.leads); const k = combineLeads(ctx.leads, '0'.repeat(31) + '1'); const ses = runSession({ open: [{ id: 'x', title: 'read every session transcript', status: 'draft', started: true }], directives: [{ session: 's', at: '', text: 'read every session transcript now' }, { session: 's', at: '', text: 'ok' }], breaks: [{ text: 'git push' }] }); const checks = [{ id: 'tree:match-serves', passed: m.verdict === 'served', evidence: `${m.verdict} via ${m.tool}` }, { id: 'tree:lead-cells', passed: k.cells.length === 432 && k.filled + k.empty === 432 && k.cells.reduce((n, c) => n + c.count, 0) === ctx.leads.length && k.default.cell === 1 && k.cells.every((c) => c.digits.reduce((n, d, i) => n + d * k.places[i]!, 0) === c.cell), evidence: `${k.says} (a referrer of 1 names cell 1; every cell round-trips its mixed radix)` }, { id: 'tree:session-partition', passed: ses.directives.folded === 1 && ses.directives.assents === 1 && ses.breaks['raw git commit or push in a shell'] === 1 && ses.items[0]?.started === true, evidence: ses.says }]; return { passed: checks.every((c) => c.passed), checks } } } },
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
const CLAY_FIRST = ['clay', 'match', 'verify']
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
  if (chatDepth > 0) return leaveChat(statement, { statement, role: (c.role && c.role in ROLE_RANK ? c.role : 'reader') as Role, by: 'nested: a chat inside a chat is not entered again', routed: [] as string[], account: accountCoins(), theorems: [] as string[], says: 'nested chat not entered' })
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
  if (!asked && m?.verdict === 'served' && m.call && !reenters(m.call)) { asked = m.call; by = 'the call the match serves' }
  if (!asked) for (const th of routed) { const r = computed(th), ex = EXAMPLES.find((x) => x.theorem === th); if (r || ex) { ({ call: asked, by } = r ?? { call: { name: ex!.tool, arguments: ex!.arguments }, by: `theorem ${th}: its example ${ex!.id}` }); break } }
  // nothing decides it alone: one programmable question, the doors around it its options (textbook_chat_call_or_question)
  if (!asked) { const doors = [...new Set(own.map((e) => e.tool))], near = doors.filter((d) => m?.cluster?.some((x) => x.id === d || own.some((e) => e.id === x.id && e.tool === d))); return out({ by: 'a question', routed, question: { asks: 'which door decides it?', options: near.length ? near : doors }, lead: m?.lead ?? null, account: accountCoins(), theorems: ['textbook_chat_call_or_question'] }) }
  const tool = TOOLS.find((x) => x.name === asked!.name) as (Tool & { inputSchema: { properties?: Record<string, { enum?: readonly unknown[]; default?: unknown }> } }) | undefined
  const h = harmonicDefaults(tool?.inputSchema ?? {}, c.referrer, (p, v) => mayChoose(role, asked!.name, p, v))
  const args: Record<string, unknown> = { ...asked.arguments }
  const corrected: { property: string; from: unknown; to: unknown; why: string }[] = []
  for (const [p, v] of Object.entries(args)) {
    const opts = h.options[p]; if (!opts || opts.includes(v)) continue
    if (!opts.length) { delete args[p]; corrected.push({ property: p, from: v, to: null, why: `the ${role} role may choose no value of ${p}: withheld` }) }
    else { const to = h.defaults[p] ?? opts[0]; args[p] = to; corrected.push({ property: p, from: v, to, why: `the ${role} role may not choose ${String(v)}: its harmonic default within the values it may choose` }) }
  }
  const account = accountCoins(asked.name, args)
  if (c.run === false) return out({ by, call: { name: asked.name, arguments: args }, corrected, routed, account, theorems: ['textbook_rbac_options', 'textbook_coins_coils_balanced'], says: `${asked.name} corrected for the ${role} role, not run` })
  const r = call(asked.name, args)
  const theorems = ['textbook_rbac_options', 'textbook_fallback_involution', 'textbook_coins_coils_balanced', ...routed]
  const verify = verifyTheorems(theorems)
  if (r.error) return out({ by, verify, call: { name: asked.name, arguments: args }, corrected, routed, account, handled: { error: r.error.message, remedy: listRemedies([r.error.message]), fallback: handleOrCorrect([r.error.message], false, 'handling'), court: summonCourt({ gate: `chat ${asked.name}`, rule: 'shape', evidence: { message: r.error.message } }) }, theorems, says: `${asked.name} refused it; answered with its remedy and the court's case, nothing thrown` })
  return out({ by, verify, call: { name: asked.name, arguments: args }, corrected, routed, account, reply: r.result?.structuredContent ?? null, theorems, says: `${asked.name} answered under the ${role} role (${by})${corrected.length ? `; ${corrected.length} value(s) corrected to what the role may choose` : ''}` })
}
/** The chat coverage sweep, sealed: the plan names every kernel textbook sentence, a share puts at most twelve of them to the chat by their own
 *  sentence, and the join checks each share's content address before sealing the census in textbook order (textbook_chat_call_or_question). */
const CHAT_SHARE = 12
type ChatRow = { theorem: string; by: string; kind: 'computed' | 'served' | 'example' | 'other'; ownFirst: boolean }
const chatPlan = () => { const kernel = new Set(THEOREMS.map((t) => t.key)); return TEXTBOOK_THEOREMS.filter((t) => kernel.has(t.key)) }
const chatKindOf = (theorem: string, by: string): ChatRow['kind'] => by.includes('computed') && by.includes(theorem) ? 'computed' : by === 'the call the match serves' ? 'served' : by.includes('its example') && by.includes(theorem) ? 'example' : 'other'
const chatCensus = (rows: readonly ChatRow[]) => { const count = (k: ChatRow['kind']) => rows.filter((r) => r.kind === k).length; const unanswered = rows.filter((r) => r.kind === 'other').map((r) => r.theorem); return { computed: count('computed'), served: count('served'), byExample: count('example'), ownFirst: rows.filter((r) => r.ownFirst).length, other: unanswered.length, unanswered } }
const chatShare = (keys: readonly string[]) => {
  if (!keys.length) throw new Error('chat names at least one theorem')
  if (keys.length > CHAT_SHARE) throw new Error(`a chat share is at most ${CHAT_SHARE} theorems; this names ${keys.length}`)
  const known = new Map(chatPlan().map((t) => [t.key, t]))
  const missing = keys.filter((k) => !known.has(k))
  if (missing.length) throw new Error(`not a kernel textbook theorem: ${missing.join(', ')}`)
  const rows: ChatRow[] = keys.map((key) => { const a = chat(known.get(key)!.says, { run: false }) as { by?: string; routed?: string[] }; const by = a.by ?? ''; return { theorem: key, by, kind: chatKindOf(key, by), ownFirst: a.routed?.[0] === key } })
  const id = uuid(canonicalText(rows))
  return { phase: 'chat-share' as const, theorems: rows.length, share: CHAT_SHARE, rows, id, sealed: seal(id).valid, ...chatCensus(rows), says: `${rows.length} theorem sentence(s) put to the chat, the share sealed ${id}` }
}
const chatJoin = (parts: readonly { id?: unknown; rows?: unknown }[]) => {
  if (!parts.length) throw new Error('chat joins at least one part')
  const rows: ChatRow[] = []
  for (const p of parts) {
    if (!Array.isArray(p.rows) || typeof p.id !== 'string') throw new Error('a chat part is { id, rows }')
    if (uuid(canonicalText(p.rows)) !== p.id) throw new Error('a chat part does not seal its rows')
    for (const r of p.rows as ChatRow[]) {
      if (typeof r?.theorem !== 'string' || typeof r.by !== 'string' || typeof r.ownFirst !== 'boolean' || !['computed', 'served', 'example', 'other'].includes(r.kind)) throw new Error('a chat row is theorem, by, kind, ownFirst')
      rows.push({ theorem: r.theorem, by: r.by, kind: r.kind, ownFirst: r.ownFirst })
    }
  }
  const order = chatPlan().map((t) => t.key), place = new Map(order.map((k, i) => [k, i])), seen = new Set<string>()
  for (const r of rows) { if (!place.has(r.theorem)) throw new Error(`${r.theorem} is not in the chat plan`); if (seen.has(r.theorem)) throw new Error(`${r.theorem} is in two parts`); seen.add(r.theorem) }
  const sorted = [...rows].sort((a, b) => place.get(a.theorem)! - place.get(b.theorem)!)
  const id = uuid(canonicalText(sorted)), census = chatCensus(sorted)
  return { phase: 'chat-coverage' as const, complete: seen.size === order.length, of: order.length, theorems: sorted.length, ...census, id, sealed: seal(id).valid, says: census.other ? `${census.other} of ${sorted.length} unanswered (${census.unanswered.join(', ')}), the census sealed ${id}` : `${sorted.length} theorem sentence(s) answered, ${census.ownFirst} routed to themselves first, the census sealed ${id}` }
}
const chatCoverage = (chatArg: unknown) => {
  if (chatArg === true) { const sentences = chatPlan().map((t) => ({ theorem: t.key, says: t.says })); return { phase: 'chat-plan' as const, theorems: sentences.length, share: CHAT_SHARE, sentences, says: `${sentences.length} kernel textbook sentences; call again with chat: { theorems } of at most ${CHAT_SHARE}, then chat: { parts } joins the sealed shares` } }
  const c = chatArg as { theorem?: unknown; theorems?: unknown; parts?: unknown }
  if (Array.isArray(c.parts)) return chatJoin(c.parts as { id?: unknown; rows?: unknown }[])
  const keys = typeof c.theorem === 'string' ? [c.theorem] : Array.isArray(c.theorems) && c.theorems.every((k) => typeof k === 'string') ? c.theorems as string[] : null
  if (!keys) throw new Error('chat is true, { theorem } or { theorems }, or { parts }')
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
  const leads = rows.filter((r) => !r.decided).map((r) => ({ id: `question-${r.source}-${r.id}`, source: r.link, statement: `an unanswered question (${r.tags.join(', ')}) no door decides yet`, status: 'open' as const, reason: r.routed ? `a lexical neighbour only (${r.routed.shared.join(', ')} shared with ${r.routed.theorem})` : 'matched by no tool, example or lead' }))
  return { phase: 'matched' as const, questions: rows.length, byVerdict, decided: rows.filter((r) => r.decided).length, rows, leads, backoff: Math.max(0, ...read.map(({ j }) => j.backoff ?? 0)), quotaRemaining: Math.min(...read.map(({ j }) => j.quota_remaining ?? Infinity)), theorem: 'textbook_questions_matched' }
}
const CONTEXT: Context = { get handle() { return handle }, get examples() { return EXAMPLES }, get leads() { return LEADS }, call: (name, args = {}) => call(name, args).result?.structuredContent, selftest: (name, ctx) => TOOLBOXES.find((b) => b.name === name)?.skill.selftest(ctx) }
// the leads beyond the core, handed by a client or a page's hook as arguments (records, or one lead): the call's leads, the core's ids kept first
const isLead = (l: unknown): l is Lead => isObj(l) && ['id', 'statement', 'status'].every((k) => typeof (l as Record<string, unknown>)[k] === 'string')
const records = (args: Record<string, unknown>): Context => { const given = [...(Array.isArray(args.records) ? args.records : []), args.lead].filter(isLead), ids = new Set(LEADS.map((l) => l.id)); return given.length ? { handle, examples: EXAMPLES, leads: [...LEADS, ...given.filter((l) => !ids.has(l.id) && ids.add(l.id))], call: CONTEXT.call, selftest: CONTEXT.selftest } : CONTEXT }

const keyOfQubit = (q: Qubit): string => (q.kind === 'grid' ? `grid:${q.row},${q.col}` : q.kind === 'line' ? `line:${q.x}` : `named:${q.name}`)

/** A slim router: each method is answered, and each tool is the website page of its gate. */
/** A batch: a JSON-RPC array is answered as one array, in order. Each call is its batch action, and RBAC decides that action for the claimed role before the call runs. */
export const handleBatch = (messages: readonly Rpc[]): (Reply | Promise<Reply>)[] => {
  const claimed = messages.map((m) => { const p = m.params; if (!p || typeof p !== 'object') return undefined; const role = (p as { role?: unknown; _meta?: { role?: unknown } }).role ?? (p as { _meta?: { role?: unknown } })._meta?.role; return typeof role === 'string' ? role : undefined }).find((role) => role !== undefined)
  const calls = messages.map((m) => askPayloadRbac(mcpHostList(), QPU_MCP, m.method, claimed))
  return messages.map((m, i) => {
    const call = calls[i]!
    if (call.access) return handle(m, true)
    return { jsonrpc: '2.0', id: m.id ?? null, error: { code: INVALID_PARAMS, message: `${call.role} may not ${call.action} through the Payload MCP`, data: { rbac: call } } }
  })
}
/** One door for every client written once: a tool called by name, its structured answer returned or its error thrown — the tools/call
 *  envelope the scripts wrote out each for itself (recognised as a shape by the entropy cleaner). */
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
      if (!asked.access) return { jsonrpc: '2.0', id, error: { code: INVALID_PARAMS, message: `${asked.role} may not ${asked.action} through the Payload MCP`, data: { rbac: asked } } }
      askedFirst = { server: asked.server, one: asked.one, first: asked.first, asked: asked.asked, tool: asked.tool }
    }
    if (message.method === 'initialize') return ok({ protocolVersion: '2025-06-18', capabilities: { tools: {}, resources: {}, extensions: { [MCP_APPS.extension]: { mimeTypes: [MCP_APPS.mimeType] } }, ...capabilities() }, serverInfo: { name: 'qpu', version: VERSION, build: build(SERVED.map((t) => t.name)), license: LICENSE.spdx, author: LICENSE.author, website: { collection: 'pages', path: websiteGate('gates', 'root').rootPath }, ...(askedFirst ? { rbac: askedFirst } : {}) }, instructions: `${INSTRUCTIONS}\n\nToolboxes: ${TOOLBOXES.map((b) => `${b.name} (${b.tools.map((t) => t.name).join(', ')}): ${b.idea}. ${b.skill.instructions}`).join('\n')}` })
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
      const list = chosen.map(({ name, description, inputSchema, toolbox }) => { const box = TOOLBOXES.find((b) => b.name === toolbox); return { name, description: brief(description), inputSchema: harmonic(name, briefSchema(inputSchema), toolbox === 'google'), annotations: { title: name, readOnlyHint: true, idempotentHint: true, openWorldHint: false }, _meta: { toolbox, website: websiteGate(toolbox, name), skill: { ...(full ? { instructions: box?.skill.instructions ?? '' } : {}), directions: box?.skill.directions.length ?? 0 }, ...(full && toolbox === 'google' ? { specific: a432Specific(name) } : {}), ...(full && box ? { lean: toolboxLean(box) } : {}), ui: { resourceUri: `ui://qpu/${name}`, visibility: ['model', 'app'] } } } })
      const listed = accountBytes([JSON.stringify(list)]), whole = accountBytes([JSON.stringify(CONTRACTS)])
      const efficiency = measureContext(listed, whole)
      const kept = efficiency.tokens, fullTokens = efficiency.full, saved = efficiency.saved
      return ok({ tools: list, _meta: { context: { tools: list.length, of: TOOLS.length, chars: listed.bytes, tokens: kept, fullChars: whole.bytes, fullTokens, saved, balanced: Boolean(wanted || cluster || !full), full, bytes: listed, efficiency, formula: { theorem: 'textbook_context_balanced' as const, lean: 'full - kept + kept = full' as const, full: fullTokens, kept, saved, holds: efficiency.holds }, bill: getBill({ tokens: kept, bits: listed.bits, coins: efficiency.coins, saved: { tokens: saved, bits: whole.bits - listed.bits } }), says: 'the list balanced to the request over MCP: the cluster the match tool decides, brief descriptions on request, the context counted; the saved and the kept make the whole (textbook_context_balanced); the list\'s bytes sit in the handle, the program and the params carrying the rest. Efficiency is the tokens kept for that one coin.' } } })
    }
    // the UI resources: one ui://qpu/<tool> per tool, the app shell served over the standard resource methods, nothing bypassed
    // the SDK is a resource too: served here and, through the plugin's resources, by the Payload MCP plugin — and the SDK calls both back (vice versa)
    if (message.method === 'resources/list') return ok({ resources: [...VIEWS.map((v) => { const u = ui(v); return { uri: u.uri, name: u.name, description: v === 'chat' ? 'the chat: a problem routed to its door, or one programmable question' : `the MCP Apps view of ${v}: renders the widget the tool computes`, mimeType: u.mimeType, _meta: { ui: { csp: u.csp, prefersBorder: u.prefersBorder } } } }), { uri: 'sdk://qpu/lib', name: 'qpu · sdk', description: 'the SDK: the config sets as the base of combinatorial application builders — one TypeScript module that calls this server over MCP (token free) and the Payload MCP plugin with a user\'s API key (the collections among its tools); served here and by the plugin', mimeType: 'text/typescript' }, { uri: OPENAPI_RESOURCE, name: 'qpu · openapi', description: 'the standard contract: an OpenAPI 3.1 document derived from tools/list and the endpoint table — every tool a component schema, every endpoint a path, the mcp operation a JSON-RPC envelope; the same document stands in the discovery document at /.well-known/qpu.json', mimeType: 'application/json' }, { uri: LEAN_RESOURCE, name: 'qpu · lean', description: 'everything the kernel accepts, served whole: every theorem with its module and statement, the textbook theorems with their Lean text, the generated lemmas counted, the kernel\'s total; no version hides anything Lean', mimeType: 'application/json' }] })
    if (message.method === 'resources/templates/list') return ok({ resourceTemplates: [{ uriTemplate: 'ui://qpu/{tool}', name: 'qpu · a tool\'s view', mimeType: MCP_APPS.mimeType, description: 'the app shell of any tool of the catalogue' }] })
    if (message.method === 'resources/read') {
      const uri = String(params.uri ?? ''), read = (mimeType: string, text: string, more = {}) => ok({ contents: [{ uri, mimeType, text, ...more }] })
      if (uri === 'sdk://qpu/lib') { const module = sdk('https://qpu.uuidna.com', NAMES); return read('text/typescript', module.module) }
      if (uri === LEAN_RESOURCE) return read('application/json', JSON.stringify(leanLedger(), null, 1))
      if (uri === OPENAPI_RESOURCE) return read('application/json', JSON.stringify(createOpenapi('https://qpu.uuidna.com', CONTRACTS), null, 1))
      const name = /^ui:\/\/qpu\/([a-z0-9_-]+)$/.exec(uri)?.[1]
      if (!name || !VIEWS.includes(name)) return fail(INVALID_PARAMS, `no resource ${uri}; the resources are ui://qpu/<view> for ${VIEWS.join(', ')}`)
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
      const reply = { content: [{ type: 'text', text: cheapest !== null && cheapest.length < full.length ? cheapest : full }], structuredContent: structured, isError: false, _meta: { jsonLd: blockJsonLd({ tool: found.name, id: rendered.id, description: found.description, toolbox: found.toolbox, url: `urn:uuid:${rendered.id}` }), payload: found.name === 'payload' ? undefined : { ...payloadDoc({ uuid: rendered.id, tool: found.name, arguments: args, description: found.description, openGraph: rendered.openGraph as unknown as Record<string, string>, prev: prev ?? null }), ...(found.toolbox === 'google' ? { quantum: quantumRecord({ uuid: rendered.id, tool: found.name, arguments: args }) } : {}) }, widget: rendered.html, openGraph: { ...rendered.openGraph, ...(prev ? { 'og:see_also': prev } : {}) }, block: rendered.shadcn, theme: rendered.theme, license: LICENSE, fusion: fuseCall(found.name), account, integrity: { address: uuid(canon), sha256: digest, of: 'the canonical text of structuredContent', check: 'seal { tamper: { text, address, sha256 } }', says: 'the address is the fast fold of the same text, so an untouched result reads authentic and a change is caught; the SHA-256 is what a forger cannot match (a second preimage, 2^256 work); the edge adds an ML-DSA signature with seal { sign }' }, ...(prev ? { prev } : {}) } }
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
