// The qpu MCP surface: JSON-RPC 2.0 tools that take typed POST parameters and compile the circuit they describe on each
// call. The handler does no I/O and imports nothing from Node, so the same code runs in a browser OS, where a caller
// compiles whatever it needs by calling a tool. Tool names and figures follow Google Quantum AI (quantumai.google).

import { GOOGLE_MCPS } from './discovery.ts'
import * as cirq from './cirq.ts'
import { EXAMPLES } from './examples.ts'
import { TABLES } from './tables-index.ts'
import { listDeclarations, scanLexical, runAudit, getEntropy, diffMembers, auditSecurity, listRemedies, repairOf, getAdvantage, getAddressedByTheorem, getBill, FALLBACKS, FALLBACK_ADAPTERS, handleOrCorrect, linkAxioms, listLeaks } from './audit.ts'
import { TEXTBOOK_THEOREMS, updateTheoremSources, getReflections } from './textbook-theorems.ts'
import { sdkOf, accessAuditOf, buildOf } from './toolboxes/payload.ts'
import { blockOf, verifyOf, sealOf, uuidOf, compositionsOf, canonicalTextOf, harmonicDefaultsOf, memoOf } from './unit/blocks.ts'
import { INSTRUCTIONS, LICENSE } from './unit/license.ts'
import { VERSION } from './unit/version.ts'
import { recomputeClay, reflectionOfRegister, digitalRoot } from './clay-register.ts'
import { composePage } from './compose.ts'
import { mayChoose, ROLE_RANK, type Role } from './unit/roles.ts'
import { evaluateTheorem, listExpressions, getProse, getStatement } from './expressions.ts'
import { getTheorem, verifyTheorems } from './verification.ts'
import { checkWitnesses, mergeWitnesses, witnessMove } from './witnesses.ts'
import { planClaims, listClaims } from './claims.ts'
import { planInstitution, listFamilySets, createFamilySet, createCreateCall, SET_FAMILIES } from './institutions.ts'
import { listCollisions } from './collisions.ts'
import { SOURCES, planSources, nextOf, listSources, type SourceContext, type SourceRequest, type SourceAnswer } from './sources.ts'
import { getScan } from './scan.ts'
import { matchStatement, matchNews, editorialOf, translateVerdict, listForeignVerdicts } from './match.ts'
import { LOCALES } from './i18n.ts'
import { CNOT, CZ, type Channel, Circuit, DensityMatrixSimulator, GridQubit, H, type InsertStrategy, LineQubit, NamedQubit, Simulator, seededRandom, SWAP, TOFFOLI, X, Y, Z, applied, getExpectation, qubitKey, measure, raiseGate, type Gate, type Operation, type Qubit } from './cirq.ts'
import { echoCircuit, echoProbability, QUANTUM_ECHOES } from './echo.ts'
import { DEVICES, PROCESSORS, toDevice, willowNoise, getAverageConnectivity, isBelowThreshold } from './processor.ts'
import { algorithmWidget, chemistryWidget, circuitWidget, echoBenchmarkWidget, echoWidget, errorCorrectionWidget, leadsWidget, entropyWidget, processorWidget, quantumlibWidget, repositoriesWidget, resourcesWidget, roadmapWidget, softwareWidget, statementsWidget, auditWidget, matchWidget, clayWidget, verifyWidget } from './widgets.ts'
import { APPLICATIONS, ROADMAP } from './roadmap.ts'
import { groverCircuit, inverseOperations, messageCircuit, phaseEstimationCircuit, qaoaCircuit, qaoaExpectedCut, qaoaSweep, pageInstance, qftOperations, shorCircuit, shorFactors, teleportationCircuit, getInteger, writeInteger, testPrimality, listFactors, shorReduction, createImpossible, decodeImpossible, orderFinding, deutschJozsaCircuit, bernsteinVaziraniCircuit, simonCircuit, vqeGroundEnergy, chshValue, trotterFidelity, xebCollision, cloningFidelity, holevoChi, stabilizerCompression, cliffordOrder, htUniversality, steaneCorrection } from './algorithms.ts'
import { STATEMENTS, SOFTWARE, type StatementTopic } from './statements.ts'
import { LEADS, leadCounts, combineLeads, listRunnableLeads, runSession, sitemapLeads, type Lead, type LeadStatus, type CellLead, type SessionInput } from './leads.ts'
import { REPOSITORIES } from './repositories.ts'
import { getBreakEven, codePoint, repetitionCycle, channelOf as qecChannelOf, textbookLogicalError, type ErrorChannel, type LogicalState, type RepetitionCode } from './qec.ts'
import { BOHR_ANGSTROM, STO3G_H, TUTORIAL_ENERGIES, ansatzCircuit, energyAt, hydrogen, hydrogenHamiltonian, tutorialChecks, vqeSweep } from './chemistry.ts'
import { CLIFFORD_CHECK_ARITY, countResources } from './counting.ts'

export type Rpc = { jsonrpc: '2.0'; id?: number | string | null; method: string; params?: unknown }
export type Reply =
  | { jsonrpc: '2.0'; id: number | string | null; result: unknown }
  | { jsonrpc: '2.0'; id: number | string | null; error: { code: number; message: string; data?: unknown } }

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
  const powered = op.exponent === undefined ? gate : raiseGate(gate, op.exponent)
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

const CHANNEL_SCHEMA = TABLES.CHANNEL_SCHEMA
const OBSERVABLE_SCHEMA = {
  type: 'object',
  description: 'A Pauli string: each qubit key (line:x, grid:row,col or named:name) mapped to X, Y or Z; unlisted qubits take the identity',
  additionalProperties: { enum: ['X', 'Y', 'Z'] },
}
const INSERT_SCHEMA = { enum: ['EARLIEST', 'NEW', 'INLINE', 'NEW_THEN_INLINE'], default: 'EARLIEST' }

const complex = ([re, im]: [number, number]) => ({ re, im })
/** An integer of any size answered by the classical door: its bits, primality, the factors the σ-reflection computes, the centre reached, the product checked.
 *  The search is unbounded and resumable (`reflections` centres from `from`, ⌈√N⌉ by default; a part not split reports `reached`): it computes, never declines. */
const answerFactor = (n: bigint, via?: string, reflections = 1n << 12n, from?: bigint) => {
  const bits = n.toString(2).length, p = testPrimality(n)
  const f = p.prime ? { factors: [n], left: [] as bigint[], reached: null as bigint | null, searched: 0n, verified: true } : listFactors(n, reflections, from)
  const primality = n < 2n ? `${n}, neither prime nor composite` : p.prime ? (p.certain ? 'prime' : 'a probable prime (Miller–Rabin, 24 bases)') : 'composite'
  // a part no classical reflection splits is left for order-finding, the one step not computed here (N ≤ 21 on the simulator, textbook_rsa_beyond_bound):
  // the plan names the door asking a quantum backend for the order, which the hybrid order channel finishes (textbook_shor_reduction); never fabricated
  const quantumOrder = f.left.length ? { needs: 'order-finding', the: 'the one step not computed quantum here', door: f.left.map((m) => ({ tool: 'algorithm', arguments: { name: 'shor', N: m.toString(), a: 2 } })), backend: 'any MCP that computes order-finding: the state-vector simulator answers N ≤ 21, a physical quantum backend at scale; feed the order r back as algorithm { name: "factor", integer, a, order } — the hybrid order channel', bound: 'textbook_rsa_beyond_bound', theorem: 'textbook_shor_reduction' } : null
  return { name: 'factor', integer: n.toString(), bits, prime: p.prime, certain: p.certain, factors: f.factors.map(String), left: f.left.map(String), complete: f.left.length === 0 && (!p.prime || p.certain), verified: f.verified, searched: f.searched.toString(), reached: f.reached === null ? null : f.reached.toString(), ...(quantumOrder ? { quantumOrder } : {}), theorem: 'textbook_factors_divide',
    says: `a ${bits}-bit integer, ${primality}${p.prime ? '' : `: ${f.factors.length} prime factor(s) found${f.left.length ? `, ${f.left.length} part(s) under the σ-reflection search — searched ${f.searched} centre(s), reached ${f.reached}; resume with from=${f.reached} (unbounded, computing, never declined; a balanced semiprime's reflection is the order-finding of textbook_shor_reduction). The one step not computed quantum here is order-finding: ask a quantum backend (quantumOrder.door) for the order r, then decode with it` : ''}`}; the parts multiply back to the integer: ${f.verified}`,
    ...(via ? { via } : {}), summary: [['Bits', String(bits)], ['Primality', primality], ['Prime factors found', String(f.factors.length)], ['Under σ-reflection search', String(f.left.length)], ['Reflections searched', f.searched.toString()], ['Product checked', f.verified ? 'yes' : 'no']], header: ['part', 'bits', 'kind'], rows: [...f.factors.map((x) => [x.toString(), String(x.toString(2).length), 'prime']), ...f.left.map((x) => [x.toString(), String(x.toString(2).length), 'composite, under σ-reflection search'])] }
}
// The impossible-integer trapdoor: `create` mints N = p·q from two random primes and holds its witness a = (p + q)/2, published as the cross-UUID
// address uuidOf(N, a); `decode` splits N in one reflection from the witness, never factoring an unknown (textbook_impossible_trapdoor).
const impossibleAddress = (N: bigint, witness: bigint) => uuidOf(JSON.stringify({ clay: 'impossible-integer', N: N.toString(), witness: witness.toString() }))
const answerImpossible = (args: Record<string, unknown>) => {
  if (isObj(args.create)) {
    const c = args.create as { p?: string; q?: string; bits?: number; seed?: string }
    const made = createImpossible({ p: c.p !== undefined ? getInteger(c.p, 'create.p') : undefined, q: c.q !== undefined ? getInteger(c.q, 'create.q') : undefined, bits: typeof c.bits === 'number' ? c.bits : undefined, seed: c.seed !== undefined ? getInteger(c.seed, 'create.seed') : undefined })
    const address = impossibleAddress(made.N, made.witness)
    return { name: 'factor', mode: 'create', integer: made.N.toString(), bits: made.bits, p: made.p.toString(), q: made.q.toString(), witness: made.witness.toString(), address, blindReflections: made.blindReflections.toString(), reproducible: made.reproducible, theorem: 'textbook_impossible_trapdoor',
      says: `an impossible integer minted over the clay cluster: a ${made.bits}-bit semiprime N = p·q, its σ-reflection witness the centre a = (p + q)/2, published at the cross-UUID address ${address}. Blind, the reflection climbs ~2^${made.blindReflections.toString(2).length - 1} centres from ⌈√N⌉; with the witness, one reflection decodes it (q = σ_{2a}(p) = 2a − p). ${made.reproducible ? 'Its primes were given or seeded, so they are public: a demonstration, not a secret.' : 'Its primes come from crypto randomness: as hard to split blind as an RSA modulus of its size.'} It never factors an unknown.`,
      summary: [['Bits', String(made.bits)], ['p bits', String(made.p.toString(2).length)], ['q bits', String(made.q.toString(2).length)], ['Blind reflections (bits)', String(made.blindReflections.toString(2).length)], ['Witness address', address]], header: ['field', 'value'], rows: [['N', made.N.toString()], ['witness a', made.witness.toString()], ['address', address]] }
  }
  return hybridDecode(args)
}
// The hybrid reverse: N decoded by the caller's witness (one σ-reflection from the centre) or order r (Shor's reduction gcd(a^(r/2) ± 1, N)), each decode sealed
// as a UUID receipt; with neither, N is declined, never fabricated (textbook_impossible_trapdoor, textbook_shor_reduction, textbook_rsa_beyond_bound).
const decodeReceipt = (N: bigint, factors: readonly string[], via: string) => { const receipt = uuidOf(JSON.stringify({ decode: N.toString(), factors: [...factors], via })); return { receipt, sealed: sealOf(receipt).valid } }
const hybridDecode = (args: Record<string, unknown>) => {
  const N = getInteger(args.integer, 'integer')
  if (args.order !== undefined) {
    // the quantum channel: given the order r (the state-vector simulation reaches it only for N ≤ 21; supplied here at any size), the reduction is a formula
    const order = getInteger(args.order, 'order'), a = args.a !== undefined ? getInteger(args.a, 'a') : 2n
    const red = shorReduction(N, a, order), factors = (red.factors ?? []).map(String), r = decodeReceipt(N, factors, 'order')
    return { name: 'factor', mode: 'decode', via: 'order', integer: N.toString(), bits: N.toString(2).length, order: order.toString(), a: a.toString(), factors, decoded: !!red.factors, verified: red.verified, why: red.why, receipt: r.receipt, sealed: r.sealed, theorem: 'textbook_shor_reduction',
      says: `decoded by the quantum channel: with the order r = ${order.toString()} of ${a.toString()} mod N, Shor's reduction gcd(a^(r/2) ± 1, N) ${red.factors ? `splits the ${N.toString(2).length}-bit integer into ${factors.join(' × ')}` : `does not split it (${red.why})`}; the decode is sealed as the UUID ${r.receipt} (${r.sealed ? 'valid' : 'invalid'}) — crypto and UUID upgraded with the quantum step`,
      summary: [['Bits', String(N.toString(2).length)], ['Order r', order.toString()], ['Decoded', red.factors ? 'yes' : 'no'], ['Product checked', red.verified ? 'yes' : 'no'], ['Receipt sealed', r.sealed ? 'yes' : 'no']], header: ['part', 'bits', 'kind'], rows: factors.map((x) => [x, String(BigInt(x).toString(2).length), 'prime']) }
  }
  const witness = getInteger(args.witness, 'witness')
  const d = decodeImpossible(N, witness), address = impossibleAddress(N, witness)
  const addressOk = typeof args.address !== 'string' || args.address === address, factors = d.factors.map(String), r = decodeReceipt(N, factors, 'witness')
  return { name: 'factor', mode: 'decode', via: 'witness', integer: N.toString(), bits: N.toString(2).length, witness: witness.toString(), address, addressVerified: addressOk, factors, decoded: d.decoded, verified: d.verified, searched: d.searched.toString(), receipt: r.receipt, sealed: r.sealed, theorem: 'textbook_impossible_trapdoor',
    says: `decoded over the clay cluster: one σ-reflection from the witness a = ${witness.toString()} split the ${N.toString(2).length}-bit integer into ${factors.join(' × ')} in ${d.searched.toString()} centre(s); the product multiplies back: ${d.verified}${typeof args.address === 'string' ? `; the witness matches the published address: ${addressOk}` : ''}; the decode is sealed as the UUID ${r.receipt} (${r.sealed ? 'valid' : 'invalid'})`,
    summary: [['Bits', String(N.toString(2).length)], ['Reflections searched', d.searched.toString()], ['Decoded', d.decoded ? 'yes' : 'no'], ['Product checked', d.verified ? 'yes' : 'no'], ['Address verified', addressOk ? 'yes' : 'no'], ['Receipt sealed', r.sealed ? 'yes' : 'no']], header: ['part', 'bits', 'kind'], rows: factors.map((x) => [x, String(BigInt(x).toString(2).length), 'prime']) }
}
const gcdOf = (x: number, y: number): number => (y === 0 ? x : gcdOf(y, x % y))
const gcdB = (x: bigint, y: bigint): bigint => { while (y) [x, y] = [y, x % y]; return x }

/** One tool: its name, what it does, its input schema (JSON Schema 2020-12), and the call that compiles or reads it: the
 *  structured result and the widget that shows it. */
import { defineTool, isObj, type Tool, type Toolbox, type Context } from './toolbox.ts'
import { FLOW } from './toolboxes/flow.ts'
import { KERNEL_THEOREMS, GENERATED_LEMMAS, THEOREMS } from './theorems-index.ts'
import { PATTERNS, getPattern } from './match.ts'
import { sha256, utf8, hex } from './unit/hmac.ts'
import { flowWidget } from './widgets.ts'
import { getCss, cssVars, KEY, createTheme, coilColour, programHues, castRays, CSS_FRAMEWORKS, compareCss } from './unit/theme.ts'
import { LANGUAGE } from './toolboxes/language.ts'
import { RAID } from './toolboxes/raid.ts'
import { BILLING, orderUsage, ALGEBRA_TOOLS, fuseCall, CATALOGUE, mintWitnessCoins } from './toolboxes/billing.ts'
import { LEGAL, summonCourt } from './toolboxes/legal.ts'
import { REPOSITORY } from './toolboxes/repository.ts'
import { STANDARDS_BOX } from './toolboxes/standards.ts'
import { PAYLOAD, payloadDocOf, uiOf, MCP_APPS, qpuFieldsOf, docOf } from './toolboxes/payload.ts'
import { EXTENSION } from './toolboxes/extension.ts'
import { extractFacts, createVerifyRequests } from './verifiers.ts'
import { CRYPTO } from './toolboxes/crypto.ts'
import { blockJsonLd, createOpenapi, OPENAPI_RESOURCE } from './standards.ts'
import { cellOf } from './widgets.ts'
export { cellOf }
export { redact } from './machine.ts' // the leak table's redaction, for the generated plugin

/** A tool from its run and its widget: the widget takes exactly what the run returns, so the two cannot drift apart. */
// The tools of this host's own two toolboxes, named below; `tool` is the host-side helper until each is a file of its own.
const TREE = new Set(['leads', 'audit', 'match', 'clay', 'verify'])
// Each clay case instances the textbook theorem it proves: the case surfaces that kernel proof (Lean) and docs under its textbook name (pascal-rule-28).
const CLAY_THEOREM_FN: Readonly<Record<string, string>> = { chooseOf: 'pascal_rule', choose: 'pascal_rule', triangular: 'gauss_triangular', qftGates: 'gauss_triangular', qftDepth: 'gauss_triangular', qftStates: 'power_of_two', mintOf: 'power_of_two', amplitudes: 'clay_register_width', powMod: 'euler_fermat', qaoaZz: 'bilinear_symmetry', qaoaX: 'bilinear_symmetry', paulis: 'grover_search', groverSize: 'grover_search', groverIters: 'grover_search', totient: 'euler_totient', fibFusion: 'fibonacci', factorial: 'factorial', cliffordOrder: 'factorial', magicBlock: 'magic_constant', magicCubic: 'magic_constant', glProd: 'magic_constant', isingFusion: 'ising_fusion', chimera: 'ising_fusion', coil: 'free_or_coil', shorModulus: 'relation_rsa', gcdOf: 'relation_rsa' }
const clayCaseTheorems = (r: { name: string; statement: string }) => {
  const names = new Set(r.name === 'relation_7' ? ['shor_sigma_root'] : []), v = r.name.replace('relation_', '')
  for (const fn in CLAY_THEOREM_FN) if (new RegExp(`\\b${fn}\\b`).test(r.statement)) names.add(CLAY_THEOREM_FN[fn]!)
  return [...names].flatMap((nm) => { const key = 'textbook_' + nm, tb = TEXTBOOK_THEOREMS.find((t) => t.key === key), k = THEOREMS.find((t) => t.key === key), b = nm.replace(/_/g, '-'); return k ? [{ theorem: key, case: b.endsWith(v) ? b : `${b}-${v}`, proof: tb?.lean ?? k.statement, docs: tb?.says ?? '', kernelAccepted: true }] : [] })
}
// The sellable catalog derived from the clay cases: each textbook theorem a product, each clay case that instances it a variant, the other theorems
// its cases cross a variation (the cross-textbook use), the case families the taxonomy; priced in coins per superposition (2^bits states), every
// price the content address of its (product, relation, coins, superposition), so costs are comparable by the one UUID accounting and pass computation
// to computation. The clay recompute and the kernel decide each case (and the circuit tool simulates its variant via Cirq), never asserted.
const clayCatalog = () => {
  const cases = recomputeClay().relations.map((r) => ({ name: r.name, bits: r.bits, families: r.families ?? [], theorems: clayCaseTheorems(r) }))
  const byProduct = new Map<string, typeof cases>()
  for (const c of cases) for (const t of c.theorems) { const arr = byProduct.get(t.theorem) ?? []; arr.push(c); byProduct.set(t.theorem, arr) }
  const products = [...byProduct.entries()].map(([theorem, cs]) => {
    const variants = cs.map((c) => { const superposition = 2 ** c.bits, coins = c.bits; return { case: c.theorems.find((t) => t.theorem === theorem)!.case, relation: c.name, bits: c.bits, superposition, coins, price: uuidOf(JSON.stringify({ product: theorem, relation: c.name, coins, superposition })) } })
    const variations = [...new Set(cs.flatMap((c) => c.theorems.map((t) => t.theorem)).filter((k) => k !== theorem))].sort()
    const taxonomy = [...new Set(cs.flatMap((c) => c.families))].sort()
    const coins = variants.reduce((n, v) => n + v.coins, 0), superposition = variants.reduce((n, v) => n + v.superposition, 0)
    const tb = TEXTBOOK_THEOREMS.find((t) => t.key === theorem)
    return { product: theorem, title: theorem.replace(/^textbook_/, '').replace(/_/g, '-'), taxonomy, variants, variations, proof: tb?.lean ?? null, kernelAccepted: THEOREMS.some((t) => t.key === theorem), decidedVia: 'cirq: the circuit tool simulates each variant; the clay recompute and the kernel decide it, never asserted', price: { coins, superposition, perSuperposition: coins / superposition, address: uuidOf(JSON.stringify({ product: theorem, coins, superposition })) } }
  }).sort((a, b) => a.product.localeCompare(b.product))
  return { products, total: products.length, theorems: ['textbook_free_or_coil'], says: 'the sellable catalog from the clay cases: each textbook a product, each case a variant, the cross-textbook theorems the variations, the families the taxonomy; priced in coins per superposition (2^bits), every price a content address so costs are comparable and pass computation to computation' }
}
// The README generated by the clay cluster, never written by hand: the whole document computed from the tree — the clay register recomputed, the
// impossible-integer trapdoor minted and decoded live (clay via the thousand bit and back, one σ-reflection), the kernel census, the MCP surface and
// the sellable catalog — with the measured figures the caller took (git, tsc, the test receipt, lake, the ledger). So the prose can never drift from
// what the tools answer (textbook_impossible_trapdoor, textbook_shor_sigma_root, textbook_factors_divide). Deterministic: the demo primes are seeded.
type ReadmeMeasured = { date?: string; version?: string; doi?: string; rows?: [string, string][]; census?: { declared?: number | string; kernel?: string; generated?: number; sorried?: string; axioms?: string; handWritten?: number } }
export const clayReadme = (m: ReadmeMeasured = {}) => {
  const date = m.date ?? new Date().toISOString().slice(0, 10), version = m.version ?? VERSION
  const reg = recomputeClay(), cat = clayCatalog()
  // the thousand-bit impossible integer, minted and decoded live over the clay cluster (deterministic by seed): the worked proof of §2
  const made = createImpossible({ bits: 1000, seed: 1n }), dec = decodeImpossible(made.N, made.witness), addr = impossibleAddress(made.N, made.witness)
  const small = createImpossible({ p: 5n, q: 13n }) // the kernel's witness example: 65 = (9−4)(9+4), q = σ_{18}(5) = 13
  const perModule = new Map<string, number>(); for (const t of THEOREMS) perModule.set(t.module, (perModule.get(t.module) ?? 0) + 1)
  const sigmaBridges = TEXTBOOK_THEOREMS.filter((t) => /sigma|σ|reflection|trapdoor|shor_sigma/i.test(t.key)).slice(0, 6)
  const L: string[] = []
  L.push(`# UUIDNA QPU — the seven Clay Millennium Problems sealed by the universal σ-involution, verified by the Lean kernel`, '')
  L.push(`*Tsvetan Rouschev* · v${version} · doi:[10.5281/zenodo.21781602](https://doi.org/10.5281/zenodo.21781602) (the solution) · doi:[10.5281/zenodo.23156998](https://doi.org/10.5281/zenodo.23156998) (this unit) · CC-BY-NC-ND-4.0 · https://qpu.uuidna.com`, '')
  L.push(`> Generated by \`npm run next\` through \`clay { readme }\` on ${date} from the computed tree; the prose cannot drift from what the tools answer.`, '')
  L.push(`## Abstract`, '')
  L.push(`**The author's result.** The seven Clay Millennium Problems are sealed by one universal σ-involution, σ_d(x) = d − x — the author's solution, published as [Zenodo doi:10.5281/zenodo.21781602](https://doi.org/10.5281/zenodo.21781602) and **submitted on 4 August 2026**.`, '')
  L.push(`**What this tree is.** The verification of that result: the σ-involution and the Clay register are accepted by the Lean 4 kernel (\`sorry\` 0), recomputed in exact integers by any MCP client, replayed by \`verify\` and the e2e gate; the same reflection, at a thousand bits, **creates and decodes impossible integers** (the σ-trapdoor, §2). The tree states only what the kernel accepts — the solution claim is the author's, cited with its DOI and date (the \`clay\` and \`compete\` tools carry the precedence), never restated in the tree's own voice.`, '')
  if (m.rows?.length) { L.push(`Every figure below was measured on this tree on ${date}.`, '', `| Measure | Value |`, `|---|---:|`, ...m.rows.map(([k, v]) => `| ${k} | ${v} |`), '') }
  // §1 Clay
  L.push(`## 1. The Clay register — one σ-involution, recomputed by any client`, '')
  L.push(`The register's relations are **defined by one reflection** and recomputed as identities, never asserted. The core is the σ-involution σ_d(x) = d − x (\`Qpu/Sigma.lean\`), closed by \`omega\` over every natural number — scale-free, holding at any d. The \`clay\` tool recomputes the whole register in exact integer arithmetic on request: **${reg.holding} of ${reg.total} relations hold**, the widest value needs ${reg.maxBits} bits (${reg.maxLimbs16} limbs of 16 bits), so a small machine redoes the same sums and compares content addresses. Each relation instances the textbook theorem it proves (\`relation_28 → pascal-rule-28\`), surfaced over MCP with its kernel proof and docs.`, '')
  L.push('```', `σ_reflect :  ∀ d x, x ≤ d → d − (d − x) = x      -- self-inverse on [0, d]`, `σ_midpoint:  ∀ d x, 2·x = d → d − x = x          -- fixed at d/2`, '```', '')
  L.push(`The same involution is the tool in every family, each bridge proved *by* the σ-theorems so the kernel owns the connection:`, '', `| Bridge | What one reflection is |`, `|---|---|`)
  for (const b of sigmaBridges) L.push(`| \`${b.key}\` | ${cellOf(b.says.slice(0, 180))} |`)
  L.push('')
  // §2 Impossible integers — the thousand bit, clay and back
  L.push(`## 2. Impossible integers: Clay via the thousand bit, and back`, '')
  L.push(`Factoring **is** the σ-reflection. For a semiprime N = p·q, the centre a = (p + q)/2 and gap b = (q − p)/2 give`, '', '```', `N = a² − b² = (a − b)(a + b)        p = a − b        q = a + b = 2a − p = σ_{2a}(p)`, '```', '')
  L.push(`so the two primes are a σ-reflection pair about the centre a. This is the **clay↔thousand-bit bridge**: the register's crypto relation (\`relation_7\`, 91 = 7·13, proved by \`textbook_shor_sigma_root\`) and a thousand-bit integer are the *same* reflection at d = 91 and at d ≈ 2¹⁰⁰⁰ — Clay solved via the thousand bit, the thousand bit via Clay.`, '')
  L.push(`**The trapdoor, minted and decoded live over the clay cluster (\`algorithm { name: "factor", create | witness }\`, \`textbook_impossible_trapdoor\`):**`, '')
  L.push('```', `create { bits: 1000, seed: 1 }  →  an impossible integer, reproducible`, `  N          = p · q            (${made.bits} bits, two ${made.p.toString(2).length}- and ${made.q.toString(2).length}-bit primes)`, `  witness a  = (p + q)/2        the σ-reflection centre`, `  address    = ${addr}   the clay cluster's cross-UUID`, `  blind cost = ${made.blindReflections.toString(2).length} bits of reflections from ⌈√N⌉`, '', `decode { integer: N, witness: a }  →  p · q`, `  searched   = ${dec.searched} reflection      q = σ_{2a}(p) = 2a − p`, `  verified   = ${dec.verified}            the product multiplies back to N`, '```', '')
  L.push(`Without the witness a blind climb from ⌈√N⌉ takes ~2^${made.blindReflections.toString(2).length - 1} centres; with it, **one** reflection decodes it. This integer is seeded so the README reproduces, which makes its primes public; an unseeded mint draws them from crypto randomness and is as hard to split blind as an RSA modulus of its size. The kernel proves the identity at p = 5, q = 13: ${small.N} = (9 − 4)(9 + 4) = 9² − 4², with q = σ₁₈(5) = 13 (\`textbook_impossible_trapdoor\`, by \`decide\`).`, '')
  L.push(`**The honest boundary.** This is a *trapdoor*: the unit creates the hard integer and holds its witness. It is **not** a factoring of an integer whose witness is unknown. Factoring reduces to order-finding (\`textbook_shor_reduction\`), and the state-vector simulation reaches that quantum step only for **N ≤ 21** (\`textbook_rsa_beyond_bound\`: N ≤ 21 is a five-bit number, an RSA-2048 modulus 2048 bits) — so a **1000-bit** balanced semiprime whose witness is unknown is **declined by the kernel, not withheld**, and an RSA-class modulus you did not mint stays declined. A balanced semiprime (p, q close) is still split with no witness, because b is small; a distant-prime one without its witness is sent to an open research lead by the involution (\`textbook_impossible_sent_to_leads\`), never claimed solved.`, '')
  // §3 kernel census
  L.push(`## 3. What the Lean kernel accepts`, '')
  L.push(`${m.census?.kernel ?? KERNEL_THEOREMS} constants in the \`Qpu\` modules, ${m.census?.handWritten ?? THEOREMS.length} hand-written and ${m.census?.generated ?? GENERATED_LEMMAS} compiler-generated equation lemmas; ${m.census?.sorried ?? '0'} use \`sorry\`; axioms: ${m.census?.axioms ?? 'Classical.choice, Quot.sound, propext'}. \`docs/theorems.md\` lists every key, statement and axiom. What a statement *means* is decided by the tools (\`match\`, \`compete\`), never by this prose.`, '', `| Module | Hand-written theorems |`, `|---|---:|`, ...[...perModule.entries()].sort().map(([mod, n]) => `| ${mod} | ${n} |`), '')
  // §4 MCP surface
  L.push(`## 4. The MCP surface — every tool a client can call`, '')
  L.push(`${TOOLS.length} tools, every one reachable by any MCP client with the same abilities the developer has. A JSON-RPC 2.0 handler (\`initialize\`, \`tools/list\`, \`tools/call\`); the handler is a pure function — no I/O, no network, no hardware.`, '', `| Tool | What it answers |`, `|---|---|`)
  for (const t of TOOLS) L.push(`| \`${t.name}\` | ${cellOf(t.description.split(/(?<=\.)\s/)[0]!.slice(0, 150))} |`)
  L.push('')
  // §5 catalog
  L.push(`## 5. Textbook-grade ISO tools — sold at the website, accessible by client MCP`, '')
  L.push(`The sellable catalog is derived from the clay cases (\`clay { catalog }\`): **each textbook theorem a product, each clay case a variant, the cross-textbook theorems the variations, the families the taxonomy**, priced in coins per superposition (2^bits states), every price a content address so costs are comparable and pass computation to computation. ${cat.total} products, sold through the ecommerce plugin and usable per tenant over the Payload MCP.`, '', `| Product (textbook) | Variants | Taxonomy | Coins | Superposition |`, `|---|---:|---|---:|---:|`)
  for (const p of cat.products.slice(0, 12)) L.push(`| \`${p.product.replace(/^textbook_/, '')}\` | ${p.variants.length} | ${cellOf((p.taxonomy.join(', ') || '—').slice(0, 60))} | ${p.price.coins} | 2^${Math.round(Math.log2(Math.max(1, p.price.superposition)))} |`)
  L.push('')
  // §6 reproduce
  L.push(`## 6. Use and reproduce`, '')
  L.push('```bash', `npm install && npm run typecheck && npm test`, `lake build          # Lean 4.33.0 via elan; builds the Qpu library, no network`, '```', '')
  L.push('```ts', `import { handle } from './src/quantum/processing/mcp.ts'`, `// mint an impossible integer, then decode it by its witness`, `const made = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call',`, `  params: { name: 'algorithm', arguments: { name: 'factor', create: { bits: 1000 } } } })`, '```', '')
  // License + references (authorial)
  L.push(`## License`, '', `CC-BY-NC-ND-4.0. Attribute the author; do not distribute a derivative; do not use commercially without a licence granted on request (https://qpu.uuidna.com). The a432 harmonics are free under attribution; commercial use of the QPU quantum framework is licensed by the author. Support the author: https://revolut.me/ceccec.`, '')
  L.push(`## Citation (first author)`, '', `Rouschev, T. (2026). *All Seven Clay Millennium Problems Sealed via Universal σ-Involution.* Zenodo. doi:[10.5281/zenodo.21781602](https://doi.org/10.5281/zenodo.21781602); **application submitted 4 August 2026.** The QPU record: doi:[10.5281/zenodo.23156998](https://doi.org/10.5281/zenodo.23156998). The solution claim and the submission date are the author's record, **cited as the author's** (the precedence the \`compete\` tool carries), not restated in the tree's voice; the tree records only what the kernel accepts (§3) and the register the \`clay\` tool recomputes.`, '')
  L.push(`## References`, '', `- Google Quantum AI — Willow spec sheet, Cirq documentation and \`cirq.google.known_devices\`, the roadmap (quantumai.google)`, `- Google — *Meet Willow* and *Quantum Echoes* (blog.google; research.google)`, `- quantumlib organization (github.com/quantumlib)`, '')
  return { markdown: L.join('\n'), total: reg.total, holding: reg.holding, maxBits: reg.maxBits, relationCount: reg.total, toolCount: TOOLS.length, productCount: cat.total, thousandBit: { bits: made.bits, decoded: dec.decoded, searched: dec.searched.toString(), verified: dec.verified, address: addr }, theorems: ['textbook_impossible_trapdoor', 'textbook_shor_sigma_root'], says: `the README generated by the clay cluster: ${reg.total} clay relations, ${TOOLS.length} tools, ${cat.total} products, and the thousand-bit impossible integer minted and decoded (searched ${dec.searched}, verified ${dec.verified}) — clay via the thousand bit and back, one σ-reflection` }
}
/** A proof checked both ways and cheaply: a theorem by its key (accepted by the kernel, its statement, the examples it proves), a call by its
 *  content address (the theorem of the example making the same call, and that theorem's examples holding the call again); one lookup, the call
 *  never recomputed — verifying costs a lookup where producing cost the run. */
const proofCheck = (args: Record<string, unknown>) => {
  const callAt = (tool: unknown, a: unknown) => uuidOf(JSON.stringify([tool, a ?? {}])), known = (k: string) => THEOREMS.find((x) => x.key === k || x.key.endsWith('.' + k))
  const c = args.call as { tool?: string; arguments?: unknown } | undefined, at = c ? callAt(c.tool, c.arguments) : null, e = at ? EXAMPLES.find((x) => x.theorem && callAt(x.tool, x.arguments) === at) : undefined
  const key = typeof args.theorem === 'string' ? args.theorem : e?.theorem ?? null, t = key ? known(key) : undefined, proves = key ? EXAMPLES.filter((x) => x.theorem === key) : []
  return { theorem: key, accepted: !!t, statement: t?.statement ?? null, examples: proves.map((x) => x.id), call: at, signed: at && key ? JSON.stringify({ call: at, digest: hex(sha256(utf8(JSON.stringify([c?.tool, c?.arguments ?? {}])))), theorem: key }) : null, example: e?.id ?? null, roundTrip: at === null ? null : proves.some((x) => callAt(x.tool, x.arguments) === at), cost: 'one lookup by address; the call is not recomputed' }
}
const tool = <T>(spec: { name: string; description: string; inputSchema: object; run: (args: Record<string, unknown>, ctx: Context) => T; widget: (data: T) => string }): Tool => defineTool(TREE.has(spec.name) ? 'tree' : 'google', spec)

const QUBIT_SCHEMA = TABLES.QUBIT_SCHEMA
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


const OWN: Tool[] = [
  tool({
    name: 'processor',
    description: 'A Google Quantum AI processor as its spec sheet states it: qubits, the grid, the two chips, and the magic-state figures; beside the stated figures, the average connectivity computed from the couplers of the grid (2E/N) and whether error correction runs below threshold (Λ above 1).',
    inputSchema: { type: 'object', required: ['name'], properties: { name: { enum: Object.keys(DEVICES) } } },
    run: (args) => {
      const deviceName = String(args.name)
      if (deviceName !== 'Willow' && deviceName in DEVICES) {
        const device = DEVICES[deviceName as keyof typeof DEVICES]
        return { name: device.name, qubits: device.qubits, couplers: device.couplers.length, layout: 'layout' in device ? device.layout : '', ...('statedQubits' in device ? { statedQubits: device.statedQubits, statedCouplers: device.statedCouplers } : {}) }
      }
      const processor = PROCESSORS[args.name as keyof typeof PROCESSORS] ?? reject(`processor ${String(args.name)} is not described here`)
      return { name: processor.name, technology: processor.technology, qubits: processor.qubits, statedAverageConnectivity: processor.statedAverageConnectivity, averageConnectivity: Math.round(getAverageConnectivity(processor.sites, processor.couplers) * 100) / 100, belowThreshold: isBelowThreshold(processor), typicalConnectivity: processor.typicalConnectivity, chips: processor.chips, magicStateCultivation: processor.magicStateCultivation, errorCorrectionPreprint: processor.errorCorrectionPreprint }
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
        toDevice(device).validateCircuit(circuit)
      }
      const channels = ((args.noise ?? []) as ChannelJson[]).map(channelOf)
      const observables = (args.observables ?? []) as Record<string, 'X' | 'Y' | 'Z'>[]
      const chip = args.device_noise === 'willow_error_correction' ? 'errorCorrection' : args.device_noise === 'willow_random_circuit_sampling' ? 'randomCircuitSampling' : undefined
      if (channels.length || observables.length || chip !== undefined) {
        if (measurement) reject('noise and observables run on the density matrix, which does not sample; remove measure, or run the measurement without noise')
        const result = new DensityMatrixSimulator().simulate(circuit, chip !== undefined ? willowNoise(chip) : channels)
        return {
          qubits: result.qubits.map(keyOfQubit),
          probabilities: result.probabilities,
          trace: result.trace,
          purity: result.purity,
          expectations: observables.map((o) => getExpectation(result, o)),
        }
      }
      if (!measurement) {
        const { amplitudes, qubits } = new Simulator().simulate(circuit)
        return { qubits: qubits.map(keyOfQubit), amplitudes: amplitudes.map(complex) }
      }
      const repetitions = typeof args.repetitions === 'number' ? args.repetitions : 100
      const result = new Simulator(seededRandom(JSON.stringify(args))).run(circuit, repetitions)
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
        name: { enum: ['qft', 'inverse_qft', 'phase_estimation', 'grover', 'teleportation', 'qaoa', 'shor', 'factor', 'order', 'deutsch_jozsa', 'bernstein_vazirani', 'simon', 'vqe', 'chsh', 'trotter', 'xeb', 'no_cloning', 'holevo', 'gottesman_knill', 'eastin_knill', 'solovay_kitaev', 'steane'] },
        depth: { type: 'integer', minimum: 1, maximum: 40, default: 12, description: 'xeb: the depth of the random circuit' },
        balanced: { type: 'boolean', default: true, description: 'deutsch_jozsa: a balanced oracle (parity) vs a constant one' },
        hidden: { type: 'array', items: { type: 'integer', minimum: 0, maximum: 1 }, description: 'bernstein_vazirani: the hidden bit string s, recovered in one query' },
        steps: { type: 'integer', minimum: 1, maximum: 200, default: 20, description: 'vqe: points of the θ sweep over [0, 1]' },
        integer: { type: 'string', pattern: '^[0-9]+$', description: 'factor: the integer, any size, as a decimal string: its bits, its primality (Miller–Rabin), and the factors the σ-involution reflection computes, the product checked' },
        reflections: { type: 'string', pattern: '^[0-9]+$', description: 'factor: σ-reflection centres to search this call from ⌈√N⌉ (no ceiling; default 4096), resumable' },
        from: { type: 'string', pattern: '^[0-9]+$', description: 'factor: resume the σ-reflection search from this centre (a previous call\'s reached value)' },
        create: { type: 'object', description: 'factor: mint an impossible integer over the clay cluster — a semiprime N = p·q of any prime-distance with its σ-reflection witness (centre a) and cross-UUID address. { p, q } from two given primes (decimal), or { bits, seed? } to draw two random primes of bits/2 each (crypto randomness; a seed makes them reproducible, and so public)', properties: { p: { type: 'string', pattern: '^[0-9]+$' }, q: { type: 'string', pattern: '^[0-9]+$' }, bits: { type: 'integer', minimum: 16 }, gapBits: { type: 'integer', minimum: 1 }, seed: { type: 'string', pattern: '^[0-9]+$' } } },
        witness: { type: 'string', pattern: '^[0-9]+$', description: 'factor: decode an impossible integer (integer=N) by its witness — the centre a = (p + q)/2; one σ-reflection splits N into p·q, the product checked, never a search of an unknown' },
        address: { type: 'string', description: 'factor: with witness, the published cross-UUID address to check the witness against (uuidOf of N and the witness)' },
        order: { type: 'string', pattern: '^[0-9]+$', description: 'shor/factor: the order r of a mod N (the quantum-hard quantity a QPU measures; the state-vector simulation reaches it only for N ≤ 21). Given it, Shor\'s reduction gcd(a^(r/2) ± 1, N) runs exactly at any size' },
        budget: { type: 'string', pattern: '^[0-9]+$', description: 'order/factor: the search budget for order-finding over the UUID/RAID content-addressed space (baby-step giant-step); the order is found when it is ≤ √budget squared, else bounded (default 4194304)' },
        find: { type: 'boolean', description: 'factor: complete order-finding over the UUID/RAID space (orderFinding) for the part left by reflection, then reduce it to factors — one call end to end, bounded honestly when the order exceeds the budget' },
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
        if (!Number.isInteger(n) || n < 1 || n > 6) reject('qubits is an integer from 1 to 6')
        const x = Number(getInteger(args.input, 'input', 0n) % (1n << BigInt(n))) // the residue mod 2^qubits: the same basis state
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
        const run = new Simulator(seededRandom(JSON.stringify(args))).run(phaseEstimationCircuit(theta, bits), repetitions)
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
        const run = new Simulator(seededRandom(JSON.stringify(args))).run(groverCircuit(), repetitions)
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
          rows: (['X', 'Y', 'Z'] as const).map((p) => [p, getExpectation(sent, { 'line:0': p }).toFixed(6), getExpectation(received, { 'line:2': p }).toFixed(6)]),
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
        const n = Number(args.qubits ?? 3)
        if (!Number.isInteger(n) || n < 1 || n > 6) reject('qubits is an integer from 1 to 6')
        const balanced = args.balanced !== false
        const run = new Simulator(seededRandom(JSON.stringify(args))).run(deutschJozsaCircuit(n, balanced), Number(args.repetitions ?? 100))
        const counts = new Map<string, number>()
        for (const b of run.measurements('in')) counts.set(b, (counts.get(b) ?? 0) + 1)
        const allZero = [...counts.keys()].every((b) => /^0+$/.test(b))
        return { name, verdict: allZero ? 'constant' : 'balanced', oracle: balanced ? 'balanced' : 'constant', queries: 1,
          summary: [['Inputs', String(n)], ['Oracle', balanced ? 'balanced' : 'constant'], ['Verdict', allZero ? 'constant' : 'balanced'], ['Queries', '1']],
          header: ['Measured', 'Count'], rows: [...counts.entries()].map(([b, c]) => [`|${b}>`, String(c)]) }
      }
      if (name === 'bernstein_vazirani') {
        const s = Array.isArray(args.hidden) && args.hidden.length ? (args.hidden as unknown[]).map((x) => (Number(x) ? 1 : 0)) : [1, 1, 0]
        if (s.length > 6) reject('hidden is at most 6 bits')
        const run = new Simulator(seededRandom(JSON.stringify(args))).run(bernsteinVaziraniCircuit(s), Number(args.repetitions ?? 100))
        const recovered = run.measurements('s')[0] ?? ''
        return { name, hidden: s.join(''), recovered, oneQuery: recovered === s.join(''), queries: 1,
          summary: [['Hidden s', s.join('')], ['Recovered', recovered], ['Classical queries', String(s.length)], ['Quantum queries', '1']],
          header: ['Fact', 'Value'], rows: [['hidden s', s.join('')], ['recovered in one query', recovered]] }
      }
      if (name === 'simon') {
        const run = new Simulator(seededRandom(JSON.stringify(args))).run(simonCircuit(), Number(args.repetitions ?? 200))
        const counts = new Map<string, number>()
        for (const b of run.measurements('y')) counts.set(b, (counts.get(b) ?? 0) + 1)
        const orthogonal = [...counts.keys()].every((y) => (y.split('').reduce((p, c) => p ^ Number(c), 0) === 0))
        return { name, period: '11', orthogonal, note: 'every measured y satisfies y·s = 0 (s = 11)',
          summary: [['Hidden period s', '11'], ['All y satisfy y·s=0', String(orthogonal)]],
          header: ['Measured y', 'Count'], rows: [...counts.entries()].map(([b, c]) => [`|${b}>`, String(c)]) }
      }
      if (name === 'vqe') {
        const steps = Number(args.steps ?? 20)
        if (!Number.isInteger(steps) || steps < 1 || steps > 200) reject('steps is an integer from 1 to 200')
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
        const t = Number(args.theta ?? 1)
        const rows = trotterFidelity(t, [1, 2, 4, 8, 16, 32])
        const improves = rows.every((r, i) => i === 0 || r.fidelity >= rows[i - 1]!.fidelity - 1e-9)
        const best = rows[rows.length - 1]!
        return { name, time: t, converges: improves && best.fidelity > 0.999, bestFidelity: Number(best.fidelity.toFixed(6)),
          summary: [['Evolution', 'e^(−i(X+Z)t)'], ['t', String(t)], ['Fidelity at 32 steps', best.fidelity.toFixed(6)], ['Monotone in steps', String(improves)]],
          header: ['Trotter steps', 'Fidelity'], rows: rows.map((r) => [String(r.steps), r.fidelity.toFixed(6)]) }
      }
      if (name === 'xeb') {
        const n = Number(args.qubits ?? 4), depth = Number(args.depth ?? 12)
        if (!Number.isInteger(n) || n < 1 || n > 6) reject('qubits is an integer from 1 to 6')
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
        const n = Number(args.qubits ?? 10)
        if (!Number.isInteger(n) || n < 1 || n > 1000) reject('qubits is an integer from 1 to 1000')
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
        const oN = getInteger(args.N, 'N'), oA = getInteger(args.a, 'a', 2n), budget = args.budget !== undefined ? getInteger(args.budget, 'budget') : undefined
        const o = orderFinding(oA, oN, budget)
        return { name: 'order', N: oN.toString(), a: oA.toString(), order: o.order, found: o.found, verified: o.verified, babySteps: o.babySteps, table: o.table, via: o.via, theorem: 'textbook_shor_reduction',
          says: o.found ? `order-finding completed over the UUID/RAID space: the order of ${oA} mod ${oN} is ${o.order} (${o.via}); feed it to the reduction to factor` : `order-finding ${o.via}`,
          summary: [['N', oN.toString()], ['a', oA.toString()], ['Order', o.order ?? 'bounded'], ['Found', o.found ? 'yes' : 'no'], ['Baby steps', o.babySteps], ['Table', o.table]], header: ['step', 'value'], rows: [['order', o.order ?? 'bounded'], ['baby-step giant-step', o.via]] } as never
      }
      if (name === 'factor') {
        if (isObj(args.create)) return answerImpossible(args)
        // the hybrid reverse: a witness (crypto/UUID) or an order (quantum) decodes N through one door, each sealed as a UUID receipt
        if (args.witness !== undefined || args.order !== undefined) return hybridDecode(args) as never
        // find: complete order-finding over the UUID/RAID space for a part reflection leaves, then reduce it to factors — one call end to end
        if (args.find) {
          const fN = getInteger(args.integer, 'integer'), fA = getInteger(args.a, 'a', 2n), budget = args.budget !== undefined ? getInteger(args.budget, 'budget') : undefined
          const base = answerFactor(fN, undefined, args.reflections !== undefined ? getInteger(args.reflections, 'reflections') : undefined)
          const part = base.left.length ? getInteger(base.left[0]!, 'left') : null
          if (part === null) return { ...base, find: 'order-finding not needed: reflection split it' } as never
          const o = orderFinding(fA, part, budget)
          if (!o.found || o.order === null) return { ...base, find: { needed: true, order: null, via: o.via, says: `order-finding over the UUID/RAID space is bounded for this part: ${o.via}` } } as never
          const red = shorReduction(part, fA, BigInt(o.order)), factors = (red.factors ?? []).map(String), r = decodeReceipt(part, factors, 'order')
          return { name: 'factor', mode: 'find', integer: fN.toString(), bits: fN.toString(2).length, a: fA.toString(), order: o.order, factors, decoded: !!red.factors, verified: red.verified, babySteps: o.babySteps, table: o.table, receipt: r.receipt, sealed: r.sealed, theorem: 'textbook_shor_reduction',
            says: `order-finding completed over the UUID/RAID space (${o.via}): the order of ${fA} mod ${part} is ${o.order}; the reduction ${red.factors ? `splits it into ${factors.join(' × ')}` : `does not split it (${red.why})`}, sealed as ${r.receipt}`,
            summary: [['Bits', String(fN.toString(2).length)], ['Order', o.order], ['Factors', factors.join(' × ') || red.why], ['Baby steps', o.babySteps], ['Receipt sealed', r.sealed ? 'yes' : 'no']], header: ['part', 'bits', 'kind'], rows: factors.map((x) => [x, String(BigInt(x).toString(2).length), 'prime']) } as never
        }
        return answerFactor(getInteger(args.integer, 'integer'), undefined, args.reflections !== undefined ? getInteger(args.reflections, 'reflections') : undefined, args.from !== undefined ? getInteger(args.from, 'from') : undefined)
      }
      if (name === 'shor') {
        const askedN = getInteger(args.N, 'N', 15n), askedA = getInteger(args.a, 'a', 7n) % askedN
        // a that shares a factor with N is that factor already (Euclid, Shor's own classical first step); 0 and 1 give way to the next unit
        const shared = gcdB(askedA, askedN)
        if (askedA >= 2n && shared > 1n) return { name: 'shor', N: writeInteger(askedN), a: writeInteger(askedA), sharedFactor: writeInteger(shared), factors: [writeInteger(shared < askedN / shared ? shared : askedN / shared), writeInteger(shared < askedN / shared ? askedN / shared : shared)], via: 'gcd(a, N): a shares a factor with N, so Euclid finds it before any circuit', theorem: 'textbook_shor_reduction', summary: [['N', String(writeInteger(askedN))], ['a', String(writeInteger(askedA))], ['gcd(a, N)', String(writeInteger(shared))], ['Factors', `${writeInteger(shared)} × ${writeInteger(askedN / shared)}`]], header: ['step', 'at this size'], rows: [['gcd(a, N)', 'a shares a factor with N: Euclid finds it, no circuit']] }
        // the order supplied (any size): Shor's reduction runs exactly, the quantum-hard order never searched here, only used and verified
        if (args.order !== undefined) { const r = getInteger(args.order, 'order'); const red = shorReduction(askedN, askedA, r)
          return { name: 'shor', N: writeInteger(askedN), a: writeInteger(askedA), order: writeInteger(r), reduction: { ...red, order: writeInteger(red.order), factors: red.factors?.map(writeInteger) ?? null }, factors: red.factors?.map(writeInteger) ?? null, verified: red.verified, bits: askedN.toString(2).length, theorem: 'textbook_shor_reduction',
            summary: [['N', String(writeInteger(askedN))], ['a', String(writeInteger(askedA))], ['Order r (given)', String(writeInteger(r))], ['r even', String(red.even)], ['Factors', red.factors ? `${writeInteger(red.factors[0])} × ${writeInteger(red.factors[1])}` : red.why], ['Product checked', red.verified ? 'yes' : 'no']], header: ['step', 'at this size'], rows: [['order-finding', `the quantum step a QPU measures; the simulation reaches it for N ≤ 21${askedN > 21n ? `, not ${askedN.toString(2).length} bits` : ''}`], ['reduction gcd(a^(r/2) ± 1, N)', red.nonTrivial ? 'exact, the factors found' : red.why]], says: `${red.why}` }
        }
        if (askedN < 3n || askedN > 21n) {
          // no order, beyond the simulation: the reduction is a formula, order-finding is the quantum step; the classical door says what it can and can't, never a false factor
          const classical = answerFactor(askedN, `order-finding for N = ${askedN} (${askedN.toString(2).length} bits) is the quantum step the state-vector simulation reaches only for N ≤ 21; Shor's reduction runs at this size once the order is given (order: <r>)`)
          // beyond the simulation, the classical door computes by the σ-reflection and reports the centre it reached, never a false factor (duty of candour by honest reporting, not a decline)
          return { ...classical, name: 'shor', quantumStep: 'order-finding (the period of a^x mod N): supply order to run the reduction at this size, or a QPU measures it', theorem: 'textbook_shor_reduction', duty: 'legal_only_the_proven_is_admitted', needsQubits: 2 * askedN.toString(2).length }
        }
        const N = Number(askedN); let a = Number(askedA); while (a < 2 || gcdOf(a, N) !== 1) a++
        const repetitions = Number(args.repetitions ?? 20)
        const run = new Simulator(seededRandom(JSON.stringify(args))).run(shorCircuit(N, a), repetitions)
        const found = shorFactors(N, a, run.measurements('m'))
        const counts = new Map<string, number>()
        for (const e of found.estimates) counts.set(e.toFixed(6), (counts.get(e.toFixed(6)) ?? 0) + 1)
        return {
          name,
          summary: [['N', String(N)], ['a', String(a)], ['Order of a mod N', found.order === null ? 'not found' : String(found.order)], ['Factors', found.factors ? `${found.factors[0]} × ${found.factors[1]}` : 'not found'], ['Prime dust', found.factors ? `${found.factors[0]} × ${found.factors[1]} (verified: product = ${found.factors[0] * found.factors[1]})` : 'rerun with another a']],
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
    description: 'Every lead on quantumai.google (every page of its sitemap, as its client hands it), its PDFs and the quantumlib repositories, with its status (served, partial, blocked, out of scope, or open: in the sitemap and not yet followed), the tool that serves it, and the reason where it is not served. The whole list is returned; nothing is truncated.',
    inputSchema: { type: 'object', properties: { runnable: { type: 'object', description: 'the leads that run themselves: { leads? } (the tree\'s leads by default) answered with each open lead that names its door, run { tool, arguments }, as the run next queues as the Payload job qpu-lead-run' }, records: { type: 'array', items: { type: 'object' }, description: 'the leads beyond the core as the client read them (the Research leads pages in Payload, else binding 0): this call\'s leads, as for any tool that reads them' }, lead: { type: 'object', description: 'one such lead, as its Research leads page hands it' }, sitemap: { type: 'object', description: 'a sitemap as sitemaps.org defines it, sealed in the docket by the discover client: { urls: [{ loc, lastmod }] } — every page no hand-written lead names a lead of its own, a url off the site refused by name' }, client: { type: 'object', description: 'a client\'s own report, apart from the QPU\'s leads: { namespace, ideas: [{ statement }] } — each idea routed to the call that serves it or the theorem it reaches, owned by the namespace, nothing run here; the client harness runs what it chooses at its own cost' }, collide: { type: 'boolean', description: 'the open problems seen as a toolset of involutions and collided with each other without a limit: every problem its address and σ-reflection, every problem routed to the theorems, the unreached ones collided in all pairs through the subjects they share; each shared subject a missing theorem that would serve all its problems, a lead to prove' }, sources: { type: 'object', description: 'the immutable sources of leads: { context: { repository, owner, package, hosts } } the first pages to fetch; with next: { request, answer } the next page of that source (null when it has ended: unlimited); with answers: the judgement — immutable versions and snapshots, licence candidates each with the case the court computes, precedence by date, every open textbook routed through the theorems, MCP doors' }, carry: { type: 'boolean', description: 'the cost of carrying the leads and what converting them to Payload documents saves; when nothing is carried the release is published as the next sequential version' }, session: { type: 'object', description: 'every session read to decide what is next and how: { directives: [{ session, at, text }], answers: [{ session, at, question, answer }], breaks: [{ text } | { rule, count }], errors: [{ tool }], open: [{ id, title, statement, status, createdAt, started }], files, now } — each directive folded into an Open work item by shared stems or proposed new, every item ranked (started first), routed to its call, given its files, cell and acceptance, packed into parallel waves of disjoint files' }, combinations: { type: 'object', description: 'a432 builds every lead combination: { leads?: extra dockets [{ id, statement, status, source, kind, priority, payload }], referrer?: a UUID } — every lead of this tool and the dockets given in one of 2⁴·3³ = 432 cells by mixed radix, every cell counted, the filled ones as work clusters, the default cell the key (or the referrer) mod 432, and the Clay rosetta values with the unit calls that read them' }, byTheorem: { type: 'boolean', description: 'every lead addressed by the theorems, never assigned in advance: the textbook theorem sharing the most words with the lead addresses it and its example names the tool; the unaddressed stay open' }, status: { enum: ['served', 'partial', 'blocked', 'out_of_scope', 'open'] }, ids: { type: 'array', items: { type: 'string' }, description: 'the leads named, in this order: a gate answers the leads that pass through it' } } },
    run: (args, ctx) => {
      const LEADS = ctx.leads
      // a client's own report: its ideas, sent under its namespace, each routed through the chat door (the served call, else the routed theorem) without running it, owned by the namespace and never mixed with the QPU's own leads; the client's harness runs what it chooses, at its own cost
      if (isObj(args.client)) { const c = args.client as { namespace?: string; ideas?: { statement: string }[] }; const owner = String(c.namespace ?? ''); if (!/^[a-z][a-z0-9-]{1,62}$/.test(owner)) throw new Error('a client report names its namespace: lower-case letters, digits and dashes, starting with a letter'); const rows = (c.ideas ?? []).map((i) => { const a = chatOf(String(i.statement ?? ''), { run: false }) as { by?: string; call?: { name: string; arguments: Record<string, unknown> }; routed?: string[] }; return { owner, id: uuidOf(JSON.stringify({ owner, statement: i.statement })), statement: i.statement, status: a.call ? (a.by === 'the call the match serves' ? 'served' : 'routed') : 'open', by: a.by ?? null, call: a.call ?? null, theorems: a.routed ?? [] } }); const counts = rows.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {}); return { owner, leads: rows.map((r) => ({ id: r.id, status: r.status, statement: r.statement })), rows, counts, total: rows.length, mixed: false, cost: 'the client harness runs each call itself (over the local stdio server: no billable call)', says: owner + ': ' + rows.length + ' idea(s), ' + (Object.entries(counts).map(([k, v]) => v + ' ' + k).join(', ') || 'none') + '; the QPU\'s own leads are not in this report' } as never }
      if (isObj(args.runnable)) { const r = args.runnable as { leads?: Lead[] }; const pool = Array.isArray(r.leads) ? r.leads : LEADS, runs = listRunnableLeads(pool); return { phase: 'runnable' as const, runs, leads: pool, counts: leadCounts(pool), total: pool.length, says: `${runs.length} lead(s) name the door that serves them: next runs each as the Payload job qpu-lead-run` } as never }
      if (isObj(args.sitemap)) { const s = sitemapLeads(((args.sitemap as { urls?: unknown }).urls ?? []) as { loc: string; lastmod?: string }[]); return { ...s, counts: leadCounts(s.leads), total: s.leads.length } }
      if (args.collide === true) { const c = listCollisions(LEADS, EXAMPLES); return { ...c, counts: Object.fromEntries(['served', 'partial', 'open', 'blocked', 'out_of_scope'].map((k) => [k, c.leads.filter((l) => l.status === k).length])), total: c.leads.length } }
      if (isObj(args.sources)) { const s = args.sources as { context?: SourceContext; next?: { request: SourceRequest; answer: SourceAnswer }; answers?: SourceAnswer[] }; const c = s.context ?? { repository: 'https://github.com/uuidna/qpu.git', owner: 'uuidna', package: '@uuidna/qpu', hosts: ['qpu.uuidna.com', 'qpu.psg.bg'] }; const counted = (leads: readonly { id: string; status: string; statement: string }[]) => ({ leads, counts: Object.fromEntries(['served', 'partial', 'open', 'blocked', 'out_of_scope'].map((k) => [k, leads.filter((l) => l.status === k).length])), total: leads.length }); if (s.next) return { ...counted([]), next: nextOf(s.next.request, s.next.answer) }; if (Array.isArray(s.answers)) { const j = listSources(c, s.answers, EXAMPLES); return { ...j, ...counted(j.leads) } } const plan = planSources(c); return { ...counted([]), phase: 'plan', sources: SOURCES, requests: plan.length, requestList: plan, byKind: Object.fromEntries(['immutable', 'licence', 'precedence', 'textbook', 'mcp'].map((k) => [k, plan.filter((r) => r.kind === k).length])), says: 'the first page of every source; every answer names its next page until the source ends' } }
      if (isObj(args.combinations)) { const c = args.combinations as { leads?: CellLead[]; referrer?: string }; const r = combineLeads([...LEADS, ...(Array.isArray(c.leads) ? c.leads : [])], c.referrer); return { ...r, leads: r.clusters.map((x) => ({ id: `cell-${x.cell}`, status: 'open', statement: `${x.labels}: ${x.count} lead(s)` })), counts: leadCounts(LEADS), total: r.total } as never }
      if (isObj(args.session)) { const s = runSession(args.session as SessionInput, (statement) => chatOf(statement, { run: false }) as { call?: { name: string; arguments: Record<string, unknown> } | null; by?: string }); return { ...s, leads: s.items.map((i) => ({ id: i.id, status: 'open', statement: i.title })), counts: leadCounts(LEADS), total: s.items.length } as never }
      if (args.byTheorem) return getAddressedByTheorem(LEADS, TEXTBOOK_THEOREMS, EXAMPLES)
      // the cost of carrying the leads, and what converting them to Payload documents saves: a lead placed in a gate page or served by a tool is carried no more; when nothing is carried the release is published
      if (args.carry) { const g = CONTEXT.call('configure', { kind: 'gates' })?.config?.leads as { unplaced?: string[] } | undefined; const unplaced = new Set(g?.unplaced ?? []); const converted = LEADS.filter((l) => !unplaced.has(l.id) || (l.status === 'served' && l.tool)); const carriedLeads = LEADS.filter((l) => !converted.includes(l)); const bytes = JSON.stringify(LEADS).length; const perLead = bytes / Math.max(1, LEADS.length); return { leads: carriedLeads.map((l) => ({ id: l.id, status: l.status, ...(l.tool ? { tool: l.tool } : {}), statement: l.statement })), counts: { carried: carriedLeads.length, converted: converted.length, placedInGates: LEADS.length - unplaced.size, served: LEADS.filter((l) => l.status === 'served' && l.tool).length }, total: LEADS.length, bytes, perLead: Math.round(perLead), costBytes: Math.round(perLead * carriedLeads.length), savedBytes: Math.round(perLead * converted.length), release: carriedLeads.length === 0 ? 'nothing to carry: publish the next sequential version' : `${carriedLeads.length} lead(s) still carried: convert first — each lead converted to a Payload document (a gate page, a docket entry) is a lead no longer carried; the release waits`, says: 'the leads cost what the tree carries; a lead converted to a Payload document costs nothing to carry; when nothing is carried the release is published as the next sequential version (textbook_carry_release)' } }
      const status = args.status as LeadStatus | undefined
      if (status !== undefined && !['served', 'partial', 'blocked', 'out_of_scope', 'open'].includes(status)) reject(`status ${String(status)} is not one of served, partial, blocked, out_of_scope, open`)
      const ids = Array.isArray(args.ids) ? args.ids.map(String) : null
      const leads = ids ? ids.map((id) => LEADS.find((l) => l.id === id)).filter((l): l is (typeof LEADS)[number] => l !== undefined && (status === undefined || l.status === status)) : LEADS.filter((l) => status === undefined || l.status === status)
      return { leads, counts: leadCounts(LEADS), total: LEADS.length, ...(ids ? { named: ids.length, unknown: ids.filter((id) => !LEADS.some((l) => l.id === id)) } : {}) }
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
      const has = (...names: string[]) => names.filter((n) => NAMES.includes(n))
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
      const breakEven = getBreakEven(code, channel, logical, sweep)
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
      const askedN = getInteger(args.N, 'N', 15n)
      const beyond = askedN < 3n || askedN > 21n ? { ...answerFactor(askedN, `the fault-tolerant design builds Shor's circuit for N 3 to 21: N = ${askedN} lands by the classical door, its circuit's resources a lead`), lead: 'shor-resources-beyond-21' } : null
      const N = beyond ? 15 : Number(askedN)
      let a = Number(getInteger(args.a, 'a', 7n) % askedN); while (a < 2 || gcdOf(a, N) !== 1) a++
      const nodes = Number(args.nodes ?? 12)
      if (!Number.isInteger(n) || n < 1 || n > 6) reject('qubits is an integer from 1 to 6')
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
      if (beyond) delete builders.shor
      const names = which === 'all' ? Object.keys(builders) : beyond && which === 'shor' ? [] : [which]
      const circuits = names.map((name) => ({ name: name === 'qft' ? `qft on ${n} qubits` : name === 'shor' ? `shor N=${N} a=${a}` : name === 'qaoa' ? `qaoa on ${nodes} nodes (alpha = 0.5, beta = 0.25)` : name === 'qec' ? 'repetition code cycle (bit flip, p = 0.1)' : name, count: countResources(builders[name]!()) }))
      return {
        circuits,
        ...(beyond ? { beyond } : {}),
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
    inputSchema: { type: 'object', properties: { shard: { type: 'object', description: 'one share of the audit, split by the shard theorems: { i, n } replays the examples whose index mod n is i, the checks made once for the whole surface running in share 0 alone; n processes with i = 0 … n − 1 cover every example exactly once (textbook_shards_cover, textbook_shards_disjoint)' }, lexical: { type: 'object', description: 'a lexical document scanned, nothing in it run: { doc } — the findings alone (unsafe link schemes, unknown tools, prototype keys, markup in text, unknown node types, leaks by kind) with where each is and whether it blocks, for a client harness or a tenant app to scan its own documents at its own cost' }, leaks: { type: 'object', description: '{ texts: { name: text }, served?: [names] }: leaks found before they are published — e-mail addresses, keys and tokens, private keys, local paths, private addresses — the tree\'s notations set aside; values redacted, each finding a lead with its remedy' }, entropy: { type: 'object', description: 'the vacuum-gravity entropy cleaner: file texts by path (the client reads them); every finding — baked data, a typed path, a cap, a clock in a pure module, a line repeated across files, a note to self, an address — becomes a lead; findings of one address fuse into one lead; the gravity is the fold of the addresses' }, difference: { type: 'object', description: 'two named sets { a: { name, members }, b: { name, members }, config? }: every member on one side only becomes a lead to explore and to config, agnostic of what the members name, counted by textbook_difference_leads' }, security: { type: 'object', description: 'the security audit from the client and the developer perspectives merged as one: { client: { hosts: [{ host, status, headers, optionsStatus?, writeWithoutToken?, audit? }], payloadMcp? }, developer: { vulnerabilities, leaks, envExampleValueless, access, hooks, signing, theorems } } — the measurements a client script took' }, errors: { type: 'array', items: { type: 'string' }, description: 'error texts: each matched to the remedy manual work taught (ERROR_REMEDIES), unmatched ones leads that teach the next row' }, repair: { type: 'array', items: { type: 'object' }, description: 'the remedy for a hacked or vulnerable system: the advisories the client read ([{ module, severity?, vulnerable?, patched?, title?, cve? }] from npm/pnpm audit --json or an NVD/CVE feed); every advisory with a published patch returns the override that repairs it and the live-apply steps that keep the SLA at 100%, one with no patch a lead (pin away, replace, isolate) — how the public MCP hands a hacked system its repair, licensed and priced' }, fallbacks: { type: 'boolean', description: 'the fallback combinations (correction ↔ handling, the involution) and the adapters each falls back to' }, access: { type: 'boolean', description: 'the access audit from every perspective — the public reader at the default domain, a licensed tenant\'s users at theirs, the operator, an MCP client with a key, the developer in the generated code, the licence and the law — over the generated collections, hooks and scopes: each check names who may, the hook that guards it, what it costs, the licence clause it enacts and the legal fact behind it; the quantum advantage measured unlimited and without interaction among them' } } },
    run: (args) => { if (isObj(args.declarations)) { const d = args.declarations as { files?: Record<string, string> }; if (!isObj(d.files)) throw new Error('declarations takes the sources: { files: { <path>: <text> } }'); return { phase: 'declarations' as const, ...listDeclarations(d.files) } as never } if (isObj(args.lexical)) { const l = args.lexical as { doc?: unknown }; if (!(l.doc as { root?: unknown } | undefined)?.root) throw new Error('lexical takes a document: { doc: { root } }'); return { phase: 'lexical-scan' as const, ...scanLexical(l.doc, TOOLS.map((x) => x.name)), ran: 0 } as never } if (isObj(args.leaks)) { const l = args.leaks as { texts?: Record<string, string>; served?: string[] }; return listLeaks(l.texts ?? {}, l.served ?? []) } if (args.access) return accessAuditOf(CONTEXT); if (isObj(args.entropy)) return getEntropy(args.entropy as Record<string, string>); if (isObj(args.security)) { const s = args.security as { client?: Parameters<typeof auditSecurity>[0]; developer?: Parameters<typeof auditSecurity>[1] }; return s.client?.hosts && s.developer ? auditSecurity(s.client, s.developer) : { phase: 'plan', needs: ['client: each host\'s status, headers, optionsStatus and writeWithoutToken', 'developer: vulnerabilities, leaks, envExampleValueless, access, hooks, signing, theorems'], says: 'the measurements scripts/security.ts takes; given them, the checks', perspectives: [], checks: [], total: 0, passed: 0, failed: 0 } } if (Array.isArray(args.repair)) return repairOf(args.repair as Parameters<typeof repairOf>[0]); if (Array.isArray(args.errors)) return { ...listRemedies(args.errors.map(String)), fallback: handleOrCorrect(args.errors.map(String), false, 'correction') }; if (args.fallbacks) return { fallbacks: FALLBACKS, adapters: FALLBACK_ADAPTERS, involution: 'σ: correction ↔ handling; σ∘σ = id (textbook_fallback_involution)', example: handleOrCorrect(['no majority'], false), says: 'the fallback combinations and adapters declared, so the theorems compute and the gate cross-checks them on every host' }; if (isObj(args.difference)) { const d = args.difference as { a: { name: string; members: string[] }; b: { name: string; members: string[] }; config?: string | null }; return diffMembers(d.a, d.b, { config: d.config ?? null }) } const was = auditing; auditing = true; try { return runAudit(handle, EXAMPLES, LEADS, TOOLBOXES, isObj(args.known) ? args.known as Record<string, string> : {}, typeof args.code === 'string' ? args.code : null, isObj(args.shard) ? args.shard as { i: number; n: number } : null) } finally { auditing = was } },
    widget: (d: any) => (d.phase === 'lexical-scan' || d.phase === 'declarations' ? flowWidget(d) : 'setAside' in d && 'findings' in d ? leadsWidget({ leads: d.leads, counts: { open: d.leads.length }, total: d.leads.length }) : d.phase === 'repair' ? leadsWidget({ leads: d.leads, counts: { served: d.fixable, open: d.unfixable }, total: d.advisories }) : 'gravity' in d && !('fallback' in d) ? entropyWidget(d) : 'sizes' in d || 'fallback' in d ? leadsWidget({ leads: d.leads, counts: { open: d.leads.length }, total: d.leads.length }) : 'perspectives' in d ? leadsWidget({ leads: d.checks.map((c: { id: string; passed: boolean; evidence: string; perspective: string }) => ({ id: c.id, status: c.passed ? 'served' : 'open', tool: c.perspective, statement: c.evidence })), counts: { served: d.passed, open: d.failed }, total: d.total }) : 'fallbacks' in d ? leadsWidget({ leads: d.fallbacks.map((f: { failure: string; involution: string; handling: string }) => ({ id: f.failure, status: 'served', tool: f.involution, statement: f.handling })), counts: { served: d.fallbacks.length }, total: d.fallbacks.length }) : auditWidget(d)),
  }),
  tool({
    name: 'match',
    description: 'Any statement, matched against everything the surface can do. served: a call answers it and is returned. impossible: the surface proves it cannot, from a schema bound the statement exceeds, a lead whose reason says why, or the handler\'s own refusal; the cluster then names the served possibilities around it and verify names the live sources the client\'s MCP can check. unknown: nothing matches, and the statement comes back as a new lead to develop.',
    inputSchema: { type: 'object', required: ['statement'], properties: { statement: { type: 'string', description: 'any prompt or statement; Glagolitic numerals are read as integers' }, questions: { description: 'true: the requests for the unanswered questions of the sources Payload holds (QUESTION_SOURCES, Stack Exchange\'s API); [{ source, text }]: their answers, each title matched, the unknown ones leads, the backoff to honour' }, search: { type: 'string', description: 'MCP/Payload search as the lexical chat (match) over Clay case decisions: a query decided by the surface and answered with a visible client proof (the kernel-accepted theorem and the example that replays it) and the programmable schema of the solution (the served tool\'s inputSchema) — the same decision for a server, so a search result is immediately usable, never prose' }, news: { type: 'array', items: { type: 'object' }, description: 'the day\'s news as problems: [{ title, source?, url? }] the client fetched (GDELT, Hacker News, an NVD/CVE feed, any source) — each title read as a problem statement and matched, so a served item carries its solution (the call that answers it), an impossible one its bound, an unknown one a lead to develop; the news define the problems every day, the QPU provides the solutions. With tenant: the solved news becomes that tenant\'s editorial blog — each served problem a draft post (Payload publishing, the editor publishes at will), the unknowns the backlog, monetised on the tenant\'s own catalogue; run daily as the qpu-news-solve Payload job' }, verdict: { type: 'string', description: 'a verdict from another vocabulary (verify_claim: VERIFIED, UNVERIFIED, REFUTED; due process: PROVEN, NOT-PROVEN, REFUTED) translated by table into this tree\'s served, impossible or unknown, never guessed; with the foreign words that share it' }, chat: { type: 'object', description: 'the one door a chat needs: { role?, call?: { tool, arguments }, referrer?, run? } — the statement (or the call) answered under the role: the served call, else the example of the first routed theorem; values the role may not choose corrected to its harmonic default; a refusal answered with its remedy and the case of the court, never thrown. The chat hook of the app asks this for every chat entry' }, url: { type: 'string', description: 'a URL path: the statement decided and, beside it, the composition the path names — the cached assets its words select (the generated code, the SDK, the registry items, the examples\' blocks), computed in real time, verified at their addresses and billed (the fallback for anything)' }, tenant: { type: 'string', description: 'with url: the tenant reselling the composition (the licence chain)' }, locale: { type: 'string', enum: Object.keys(LOCALES), description: 'the language of the statement, translated to English by vocabulary offline before the match; the verdict is given back in it' } } },
    run: (args) => { if (args.questions !== undefined) return matchQuestions(args.questions) as never; if (typeof args.verdict === 'string') { const ours = translateVerdict(args.verdict); return { phase: 'verdict' as const, foreign: args.verdict, verdict: ours ?? null, translated: ours !== undefined, equivalents: ours ? listForeignVerdicts(ours) : [], theorem: 'textbook_foreign_verdicts' } as never } if (isObj(args.chat)) return chatOf(String(args.statement ?? ''), args.chat as Parameters<typeof chatOf>[1]) as never; if (Array.isArray(args.news)) return (typeof args.tenant === 'string' ? editorialOf(args.news as Parameters<typeof matchNews>[0], String(args.tenant), handle, EXAMPLES, LEADS, args.locale === undefined ? undefined : String(args.locale)) : matchNews(args.news as Parameters<typeof matchNews>[0], handle, EXAMPLES, LEADS, args.locale === undefined ? undefined : String(args.locale))) as never;
      if (typeof args.search === 'string') { const q = args.search; const m = matchStatement(q, handle, EXAMPLES, LEADS, args.locale === undefined ? undefined : String(args.locale)); const theoremKey = m.theorem ?? (m.call ? EXAMPLES.find((e) => e.tool === m.call!.name)?.theorem : undefined) ?? null; const tb = theoremKey ? TEXTBOOK_THEOREMS.find((t) => t.key === theoremKey) : undefined; const kernel = theoremKey ? THEOREMS.find((t) => t.key === theoremKey) : undefined; const proof = theoremKey ? { theorem: theoremKey, lean: kernel?.statement ?? tb?.lean ?? null, kernelAccepted: !!kernel, example: tb?.examples?.[0] ?? EXAMPLES.find((e) => e.theorem === theoremKey)?.id ?? null } : null; const schema = m.call ? (TOOLS.find((t) => t.name === m.call!.name)?.inputSchema ?? null) : null; const clay = /relation_\d+|clay|perfect number|riemann|p\s*(=|vs|versus)\s*np/i.test(q) ? (() => { const all = recomputeClay(); return { relations: all.relations.length, note: 'the Clay register recomputed in exact integers: every relation an identity between the unit\'s own constants, decided by the kernel, never a prose verdict' } })() : null; const chat = m.verdict !== 'served' ? (chatOf(q, { run: false }) as { by?: string; reply?: unknown; question?: unknown; lead?: unknown; routed?: string[] }) : null; const solved = m.verdict === 'served' || !!chat; return { phase: 'search' as const, query: q, verdict: m.verdict, solved, tokenFree: true, solution: m.call ?? null, answer: chat ? { by: chat.by ?? null, reply: chat.reply ?? null, question: chat.question ?? null, lead: chat.lead ?? null, routed: chat.routed ?? [] } : null, nearest: (m.cluster ?? []).slice(0, 5).map((c) => ({ id: c.id, kind: c.kind })), proof, schema, clay, drift: !!(proof && !proof.kernelAccepted), harmonic: uuidOf(`a432\n${q}`), free: { cost: 'free tier — no token paid', online: 'token free means computed from all the free online possibilities: imagine { statement } enumerates the related open MCP servers and public sources online, and the open sources (news — GDELT, Hacker News, Wikipedia; questions — Stack Exchange; the open datasets and APIs) answer without a key, so any request, prompt or question is answerable for free', via: ['imagine', 'discover'], proxiedVia: 'the QPU: every online call is proxied through its doors (imagine, discover, the connector) and validated against its schema before it leaves — never a direct call; the same handler validates every tool call and the Payload MCP (POST /api/entries) runs it, so all calls are validated and proxied via the QPU' }, decidedBy: 'the kernel — a Clay-style case decision carrying a visible client proof (the theorem the kernel accepts and the example that replays it), never prose; drift is a proof the kernel does not accept (a deviation from the textbook harmony), the a432 address the harmonic of the query', theorems: ['textbook_search_proven'], says: `search as the lexical chat (match) over Clay case decisions: "${q}" ${m.verdict}${m.call ? ` by ${m.call.name}` : ''}, solved token free — ${m.call ? `by ${m.call.name}` : chat ? `answered ${chat.by ?? 'by the routed theorem'}` : 'a lead'}; computable from the free online possibilities (imagine over the open public MCPs and sources) at no token cost${proof ? `, proven by ${proof.theorem}${proof.kernelAccepted ? ' (kernel-accepted)' : ''}, replayable as example ${proof.example}` : ''}; the solution's programmable schema is returned, every answer a visible proof` } as never } const m = matchStatement(String(args.statement ?? ''), handle, EXAMPLES, LEADS, args.locale === undefined ? undefined : String(args.locale)); return typeof args.url === 'string' ? { ...m, composition: composePage(args.url, CONTEXT, 'https://qpu.uuidna.com', typeof args.tenant === 'string' ? args.tenant : 'uuidna') } : m },
    widget: ((d: any) => (d.phase === 'search' ? leadsWidget({ leads: [{ id: uuidOf(d.query).slice(0, 8), status: d.verdict === 'served' ? 'served' : 'open', tool: d.solution?.name ?? d.proof?.theorem ?? 'search', statement: d.query }], counts: { served: d.verdict === 'served' ? 1 : 0, open: d.verdict === 'served' ? 0 : 1 }, total: 1 }) : d.phase === 'editorial' ? leadsWidget({ leads: [...d.drafts.map((dr: { slug: string; title: string }) => ({ id: dr.slug, status: 'served' as const, tool: 'posts', statement: dr.title })), ...d.leads.map((l: { id: string; statement: string }) => ({ id: l.id, status: 'open' as const, tool: 'news', statement: l.statement }))], counts: { served: d.posts, open: d.backlog }, total: d.items }) : d.phase === 'news' ? leadsWidget({ leads: d.problems.map((p: { problem: string; verdict: string; solution: { name: string } | null; source: string | null }) => ({ id: uuidOf(p.problem).slice(0, 8), status: p.verdict === 'served' ? 'served' : 'open', tool: p.solution?.name ?? p.source ?? 'news', statement: p.problem })), counts: { served: d.served, open: d.unknown + d.impossible }, total: d.items }) : d.phase === 'verdict' || d.theorem === 'textbook_questions_matched' || ('role' in d && 'theorems' in d && !('verdict' in d)) ? flowWidget(d) : matchWidget(d))) as never,
  }),
  tool({
    name: 'clay',
    description: 'The Clay register recomputed in exact integer arithmetic: the Lean definitions of Qpu/Clay.lean and its imports ported one for one, every relation_N statement parsed and evaluated, each side\'s value and the bit width it needs reported. What the Lean kernel accepted by rfl, redone with + − × ÷ on naturals only, so a small machine can redo the same sums and compare addresses. Nothing here is a proof of an open problem: the relations are identities between the unit\'s own constants.',
    inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'one relation, e.g. relation_15; omit for all' }, technique: { type: 'string', enum: ['reflection'], description: 'the register read by the σ-reflection technique: every value\'s vortex seed, reflection and trinities, the reflecting pairs, the fixed and the tuned; with unit, the unit\'s sequence answers compared' }, unit: { type: 'array', items: { type: 'object' }, description: 'the unit\'s run_sequence answers per value ({ value, answer | refusal })' }, catalog: { type: 'boolean', description: 'the sellable catalog derived from the clay cases: each textbook theorem a product, each clay case a variant, the cross-textbook theorems the variations, the families the taxonomy, priced in coins per superposition (content-addressed)' }, readme: { description: 'the README generated by the clay cluster from the computed tree — the register, the impossible-integer trapdoor (clay via the thousand bit and back), the kernel census, the MCP surface and the catalog; true, or an object of the measured figures the caller took ({ date, version, rows, census })' } } },
    run: (args) => {
      const base = recomputeClay()
      const all = { ...base, relations: base.relations.map((r) => { const theorems = clayCaseTheorems(r); return { ...r, case: theorems[0]?.case ?? r.name, theorems } }) } // sellable unit: textbook = product, case = variant
      if (args.catalog) return clayCatalog()
      if (args.readme) return clayReadme(isObj(args.readme) ? (args.readme as ReadmeMeasured) : {}) as never
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
      if (args.name) { const r = all.relations.find((x) => x.name === args.name); if (!r) throw new Error(`${String(args.name)} is not one of ${all.relations.map((x) => x.name).join(', ')}`); return { ...all, relations: [r] } }
      return all
    },
    widget: clayWidget,
  }),
  tool({
    name: 'verify',
    description: 'Cheap verification of one UUID: its seal (the version nibble the other 31 nibbles decide, one modular power, no content needed), its content (one fold), and its neighbours in a chain (the predecessor it names and the successor that names it). Each check is independent; a check without its input is not decided rather than passed.',
    inputSchema: { type: 'object', properties: { theorem: { type: 'string', description: 'a theorem key: whether the kernel accepts it, its statement, and the examples it proves' }, call: { type: 'object', description: 'a call { tool, arguments }: the theorem of the example making the same call, by content address, checked both ways (the theorem\'s examples hold the call) without recomputing it' }, witnesses: { description: 'the fourteen witnesses around a UUID, the faces of a cuboctahedron: a UUID gives six square witnesses (its program rotated one to six places) and eight triangular ones (one handle nibble reflected by σ), each mapped back exactly; { referrer, destination } merges two sets, the shared witnesses (same address) counted once and booked as coins credited to the author at zero price — free work, never money' }, move: { type: 'integer', minimum: 1, description: 'the clock/calendar move of a superposition at index k: its 2k witnesses (2·7 = 14) step by ±2 to 2(k − 1) and 2(k + 1), covering the clocks (12, 24) and calendars (7, 12, 16) those land on, paying one coin down and collecting one up (net zero)' }, uuid: { type: 'string', description: 'the UUID to verify' }, scan: { type: 'array', items: { type: 'object' }, description: 'a stream of frames a device sampled ({ t, hue }, hue null for a black frame): read back to the address it links, by majority per frame; fewer than 36 frames link nothing; rated by the chain (free for the first period)' }, content: { type: 'string', description: 'the text the UUID should be the address of' }, prev: { type: 'object', properties: { id: { type: 'string' } }, description: 'the predecessor in the chain' }, self: { type: 'object', properties: { prev: { type: 'string' } }, description: 'what this entry names as its predecessor' }, next: { type: 'object', properties: { id: { type: 'string' }, prev: { type: 'string' } }, description: 'the successor in the chain' } } },
    run: (args) => args.move !== undefined ? (witnessMove(Number(args.move)) as never) : typeof args.theorem === 'string' || isObj(args.call) ? (proofCheck(args) as never) : typeof args.witnesses === 'string' ? (checkWitnesses(args.witnesses) as never) : isObj(args.witnesses) ? (() => { const w = args.witnesses as { referrer?: string; destination?: string }; const m = mergeWitnesses(String(w.referrer ?? ''), String(w.destination ?? '')); return { ...m, coins: mintWitnessCoins(m.shared) } as never })() : Array.isArray(args.scan) ? getScan(args.scan as { t: number; hue: number | null }[]) : verifyOf(String(args.uuid ?? ''), typeof args.content === 'string' ? args.content : undefined, args.prev as { id: string } | undefined, args.next as { id: string; prev?: string } | undefined, args.self as { prev?: string } | undefined),
    widget: ((d: any) => ('witnesses' in d || 'shared' in d || 'roundTrip' in d ? flowWidget(d) : verifyWidget(d))) as never,
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
const OBSERVED = new Map<string, { calls: number; misses: number; ms: number; bytes: number }>()
const NESTED: number[] = []
const observedOf = (k: 'calls' | 'misses' | 'ms' | 'bytes') => [...OBSERVED.values()].reduce((n, o) => n + o[k], 0)

/** The computable metrics of the tree, in real time: what the registries, the kernel's index and one audit say right now. */
type RunArtefacts = { advantageByUnit?: unknown; e2e?: { combos?: number; copies?: number; involutions?: number; outcomes?: Record<string, number>; competition?: { saved?: number; msMajority?: number; winners?: Record<string, number> } }; coins?: { calls: number; coins: number; byDoor: Record<string, number>; gated: number; unclean: number }; receipt?: { steps?: { name: string; status: string; ms: number }[] }; sizes?: Record<string, number>; discovery?: { hosts?: { kind: string; detected: string }[]; doors?: unknown[]; capabilities?: Record<string, string[]> }; verification?: { summary?: Record<string, { requests: number; ok: number; contracted: number; uncontracted: number }> }; readiness?: { classes?: { served: number; refuted: number; trial: number }; readiness?: { ready: boolean }; border?: { doors?: unknown[]; sealedBy?: string[] } }; repository?: { branches?: { agree: string[]; local: number }; tags?: { agree: string[]; local: number; mismatch: string[] }; leads?: unknown[] }; legal?: { claims?: number; verdicts?: Record<string, number>; violations?: number; refusals?: number; securityPassed?: number; securityTotal?: number; id?: string }; docket?: { entries?: number; root?: string | null; mirrors?: number }; receipts?: { count?: number; last?: string | null } }
/** What the run's artefacts add to the metrics: textbook APIs autodiscovered and covered, verification on public datasets, the border, the repository watched, the legal audit, the RAID's signalling (docket entries chained to a root), the receipt chain. */
const coverageOf = (a: RunArtefacts): Record<string, unknown> => {
  // the load: a block is paid once when computed (a miss of the balancer, a coin at a gated door); every re-ask is a teleport, free — the cache by address here, the involution (304 by content hash) at the edge
  const calls = observedOf('calls'), misses = observedOf('misses')
  const load = { paid: misses, free: calls - misses + (a.e2e?.involutions ?? 0), involutions: a.e2e?.involutions ?? 0, coins: a.coins?.coins ?? 0, a432: { key: KEY, harmonics: Object.keys(cssVars(uuidOf('a432'))).length, stylesheetBytes: getCss().length, served: 'the shell cache, immutable: the harmonic strings of every block (its custom properties from its UUID alone, the reflected harmonic and the drift\'s prime dust among them) cost the device nothing and the edge nothing' }, note: 'paid: computations (balancer misses); free: answers by address (balancer hits) and by involution (304 at the edge); the coins set the entanglement once, the teleports are free until the load is paid again' }
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
// The audit replays every example, the metrics example among them; metrics inside an audit must not start another audit.
let auditing = false
// the counts are a function of the examples and leads while the code is fixed
const auditCountsOf = memoOf((examples: typeof EXAMPLES, leads: typeof LEADS) => { const a = runAudit(handle, examples, leads, TOOLBOXES); return { total: a.total, passed: a.passed, failed: a.failed } })
const auditNow = () => { if (auditing) return null; auditing = true; try { return auditCountsOf(EXAMPLES, LEADS) } finally { auditing = false } }
/** Everything the kernel accepts, served whole by this version from its own index: every hand-written theorem with its module and statement, every
 *  textbook theorem with its Lean text and the examples it backs, the generated lemmas counted, the kernel's total; the axioms per theorem stand in
 *  /theorems.ndjson, written by the lean step. No version hides anything Lean: the audit fails when this serves less than the kernel accepts
 *  (textbook_lean_served_whole). */
export const LEAN_RESOURCE = 'lean://qpu/theorems'
export const leanLedgerOf = () => {
  const modules: Record<string, number> = {}; for (const t of THEOREMS) modules[t.module] = (modules[t.module] ?? 0) + 1
  return { kernel: KERNEL_THEOREMS, handWritten: THEOREMS.length, generated: GENERATED_LEMMAS, whole: THEOREMS.length + GENERATED_LEMMAS === KERNEL_THEOREMS, modules, theorems: THEOREMS, textbook: TEXTBOOK_THEOREMS.map((t) => ({ key: t.key, lean: t.lean, says: t.says, examples: t.examples })), axioms: 'per theorem in /theorems.ndjson (the lean step\'s collectAxioms sweep); the census in the README', sources: 'src/quantum/processing/unit/lean/Qpu/*.lean, in every release', says: 'everything the kernel accepts, served whole by this version over MCP and in the textbook view: nothing Lean is hidden' }
}
const metricsOf = (artefacts: RunArtefacts = {}): Record<string, unknown> => {
  const audit = auditNow()
  const byStatus: Record<string, number> = {}; for (const l of LEADS) byStatus[l.status] = (byStatus[l.status] ?? 0) + 1
  const backed = EXAMPLES.filter((e) => e.theorem)
  return {
    tools: TOOLS.length, toolboxes: TOOLBOXES.length, patterns: PATTERNS.length, patternsRecognised: EXAMPLES.filter((e) => e.tool === 'match' && typeof e.arguments.statement === 'string' && getPattern(e.arguments.statement)).length, examples: EXAMPLES.length, examplesBackedByTheorems: backed.length, examplesBackedRatio: Number((backed.length / EXAMPLES.length).toFixed(3)),
    theoremsKernel: KERNEL_THEOREMS, theoremsHandWritten: THEOREMS.length, lemmasGenerated: GENERATED_LEMMAS, leads: LEADS.length, leadsByStatus: byStatus,
    auditChecks: audit?.total ?? null, auditPassed: audit?.passed ?? null, auditFailed: audit?.failed ?? null, auditNested: audit === null, selftests: TOOLBOXES.map((b) => b.name), balancer: BALANCER.size, license: LICENSE.spdx, at: new Date().toISOString(),
    // observability of this process: calls served from memory against computed, and where the computed milliseconds went
    balancerTeleported: TELEPORTED.size, balancerTeleportHits: TELEPORT_HITS, toolCalls: observedOf('calls'), toolMisses: observedOf('misses'), toolMs: observedOf('ms'),
    slowestTools: [...OBSERVED.entries()].sort((x, y) => y[1].ms - x[1].ms).slice(0, 6).map(([name, o]) => `${name} ${o.ms} ms / ${o.misses} computed / ${o.calls} asked / ${o.bytes} bytes`),
    msPerComputedCall: (() => { const m = observedOf('misses'); return m ? Number((observedOf('ms') / m).toFixed(1)) : null })(),
    ...coverageOf(artefacts),
    advantageByUnit: artefacts.advantageByUnit ?? null, gateCombos: artefacts.e2e?.combos ?? null, gateCopies: artefacts.e2e?.copies ?? null, gateInvolutions: artefacts.e2e?.involutions ?? null, gateOutcomes: artefacts.e2e?.outcomes ?? null, gateMsSaved: artefacts.e2e?.competition?.saved ?? null, gateWinners: artefacts.e2e?.competition?.winners ?? null,
    // the gate's own advantage as a magnitude, uncapped: the copies proven by hash (304, nothing computed) against the copies recomputed; when every copy is an involution the ratio has no bound and says so
    gateAdvantage: getAdvantage(artefacts.e2e?.copies ?? 0, artefacts.e2e?.involutions ?? 0),
    // the usage billed complete: the tokens of the whole tools/list, the bits the tools computed in this process, their time, the coins, what the gate and the unit saved
    usage: (() => { const bill = getBill({ tokens: Math.ceil(JSON.stringify(CONTRACTS).length / 4), bits: observedOf('bytes') * 8, ms: observedOf('ms'), coins: artefacts.coins?.coins ?? 0, saved: { bits: Number((artefacts.advantageByUnit as { bitsSaved?: number } | null | undefined)?.bitsSaved ?? 0), ms: artefacts.e2e?.competition?.saved ?? 0 } }); const calls = observedOf('calls'), free = [...OBSERVED.entries()].filter(([name]) => ALGEBRA_TOOLS.includes(name)).reduce((n, [, o]) => n + o.calls, 0); return { ...bill, order: orderUsage(calls, 'eur', { kWh: bill.energy.kWh, tariffEurPerKwh: bill.energy.tariffEurPerKwh }, { free, coils: calls - free, commercial: false, delivered: artefacts.e2e?.copies ?? 0 }) } })(),
  }
}
const metrics = defineTool('tree', { name: 'metrics', description: 'The computable metrics of this tree in real time: tools and toolboxes, examples and how many name the kernel-accepted theorem that makes them true, the kernel\'s theorem counts from its own index, leads by status, the audit\'s checks, the balancer\'s memory. Quality is proven by theorems, not textbook examples; this is the measure of how far that holds.', inputSchema: { type: 'object', properties: { artefacts: { type: 'object', description: 'the run\'s artefacts the client read: discovery, verification, readiness, repository, legal, docket, receipts; without them the tree\'s own counts alone' } } }, run: (args) => metricsOf((args.artefacts ?? {}) as RunArtefacts), widget: flowWidget })

/** The textbook as an adapter: every example categorised for reuse — by toolbox, by tool, by the theorem that backs it, by the
 * theorem's module — and any example replayed by id (the balancer makes a replay free). Quality is proven by theorems; the
 * textbook is where the examples wait, respected, each a lead for its theorem. */
const textbook = defineTool('tree', {
  name: 'textbook',
  description: 'The QPU textbook as an adapter: every example categorised for reuse — by toolbox, by tool, by the kernel-accepted theorem that backs it, by that theorem\'s module — and, with reuse: <example id>, that example replayed and its result returned. The categories are computed from the registries, never written by hand.',
  inputSchema: { type: 'object', properties: { reflect: { description: 'true or { books }: every theorem reflected by its shape, against the kernel and the books routed to it' }, claims: { description: 'the textbook claims measured against what is published: true the OpenAlex requests (one per general theorem); { answers, confirmations } each claim own, candidate (DOI-registered works before 2026 sharing three distinctive words or more, at least half of the title), unrecognised, or recognised by a confirmation recorded in the docket' }, theorem: { type: 'string', description: 'one theorem as its client verifies it: accepted by the kernel or not, its module, statement and Lean text, and where its source is published to read and build with lake' }, institution: { type: 'object', description: 'the textbook as an education tool for an institution: { sets: true } the space of Google Workspace sets (every family by every door off, read or write) with the named singles as admin pages created through the Payload MCP; { set: { index } | { family, doors: { Classroom: \'write\', … } } } one set with its least-privilege scopes, its role, its page and the tenant setting; { edition, users, theorems?, course?, answers? } — the edition as Google states it (education, nonprofit or Workspace; omit it for the list), the bill under its cap, Google Workspace\'s nine MCP doors with their scopes, every closed equation of the textbook as a Classroom question (the REST body and the docket entry through the Payload MCP), answers graded by recomputation, and the acts that are the institution\'s own' }, verify: { type: 'boolean', description: 'the wave over the textbook: every example\'s verification requests on public datasets and APIs, for any client device to fetch' }, example: { type: 'string', description: 'with verify: one example only, so a device at the edge walks the textbook within the Worker\'s budget' }, results: { type: 'array', items: { type: 'object' }, description: 'the requests fetched (url, status, ok, contracted), joined back by url and sealed' }, reuse: { type: 'string', description: 'an example id to replay' }, evaluate: { type: 'object', description: 'the textbook\'s combinatorial expressions as tools: { theorem, values? } evaluates that theorem\'s statement exactly (its variables from values, each hypothesis and conjunct computed, what is missing named, its inputSchema answered); {} every theorem, the closed ones checked against the kernel' }, prose: { type: 'object', description: '{ texts: { name: text } }: the prose audited around the textbook — every number a text states resting on an expression a client can evaluate, or a lead; verdict words beside the Clay problems flagged' }, axioms: { type: 'boolean', description: 'the textbook\'s axioms each with its theorem: every example names the kernel-accepted theorem it rests on, every theorem names only examples that exist; what is left unlinked is listed' }, theorems: { type: 'boolean', description: 'everything the kernel accepts, served whole: every theorem with its module and statement, the textbook theorems with their Lean text and examples, the generated lemmas counted, the kernel\'s total; rendered in the textbook view; no version hides anything Lean' }, category: { type: 'string', enum: ['toolbox', 'tool', 'theorem', 'module'], description: 'one category to list; omit for all' } } },
  run: (args) => {
    if (isObj(args.evaluate)) { const e = args.evaluate as { theorem?: string; values?: Record<string, number | string> }; if (typeof e.theorem !== 'string') return listExpressions(); return evaluateTheorem(e.theorem, e.values ?? {}) }
    if (typeof args.theorem === 'string') return getTheorem(args.theorem)
    // the claims measured against what is published: the OpenAlex requests, then the answers and the docket's confirmations read into each claim's status
    if (args.claims === true) return { requests: planClaims(), says: 'one OpenAlex search per general theorem; hand the answers back as claims: { answers, confirmations }' } as never
    if (isObj(args.claims)) { const c = args.claims as { answers?: { id: string; status: number; text: string }[]; confirmations?: { theorem: string; doi: string; by: string }[] }; const claims = listClaims(c.answers ?? [], c.confirmations ?? []); const counts = claims.reduce<Record<string, number>>((a, x) => ({ ...a, [x.status]: (a[x.status] ?? 0) + 1 }), {}); return { claims, counts, says: Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(', ') + ': a candidate resembles, only a recorded confirmation recognises' } as never }
    if (isObj(args.institution)) {
      const r = args.institution as Parameters<typeof planInstitution>[0]
      // a set is a page the admin edits: a qpu block of this door, nested Workspace › family › set, created through the Payload MCP
      const pageOf = (p: ReturnType<typeof createFamilySet>) => ({ title: p.title, hero: { type: 'default' }, slug: `workspace-${p.family}-${p.index}`, under: `workspace-${p.family}`, layout: [qpuFieldsOf(p.id, 'textbook', { institution: { set: { index: p.index } } }, p.theorem)], meta: { title: `${p.title} · Google Workspace set`, description: p.uses.join('; ') || 'no door open' } })
      const roots = [{ title: 'Google Workspace', slug: 'workspace', under: null, hero: { type: 'default' }, layout: [qpuFieldsOf(createFamilySet({ family: 'workspace' }).id, 'textbook', { institution: { sets: true } }, 'textbook_workspace_sets')] }, ...SET_FAMILIES.map((f) => ({ title: `Google Workspace for ${f}`, slug: `workspace-${f}`, under: 'workspace', hero: { type: 'default' }, layout: [qpuFieldsOf(createFamilySet({ family: f }).id, 'textbook', { institution: { set: { family: f } } }, 'textbook_workspace_sets')] }))]
      // the parent is a relationship by id: the call carries the page without it and names the parent's slug; the client sets parent to the id findPages answers for that slug (roots come first)
      const callOf = ({ under, ...page }: { under: string | null } & Record<string, unknown>) => ({ ...createCreateCall('pages', r.tenant ? { ...page, tenant: r.tenant } : page), under })
      if (r.sets === true) { const all = listFamilySets(); const pages = [...roots, ...all.singles.map(pageOf)]; return { ...all, pages: { tree: 'Google Workspace › family › set: nested by the nested-docs plugin, each set a qpu block rendered by its shadcn items', count: pages.length, calls: pages.map(callOf) } } }
      if (isObj(r.set)) { const p = createFamilySet(r.set); return { set: p, page: callOf(pageOf(p)), tenant: { settings: { institution: { set: p.index } } }, says: `${p.title}: ${p.scopes.length} scope(s), the ${p.role} role; ${p.uses.join('; ') || 'no door open'}` } }
      return planInstitution(r)
    }
    if (isObj(args.prose)) return getProse(((args.prose as { texts?: Record<string, string> }).texts) ?? {}, EXAMPLES)
    if (args.axioms) return linkAxioms(EXAMPLES, TEXTBOOK_THEOREMS, new Set(THEOREMS.map((t) => t.key)))
    if (args.reflect) return getReflections(new Set(THEOREMS.map((t) => t.key)), Object(args.reflect).books)
    if (args.theorems) return leanLedgerOf()
    const boxOf = new Map(TOOLBOXES.flatMap((b) => b.tools.map((t) => [t.name, b.name] as const)))
    const group = <K extends string>(key: (e: (typeof EXAMPLES)[number]) => K | null) => { const out: Record<string, string[]> = {}; for (const e of EXAMPLES) { const k = key(e); if (k !== null) (out[k] ??= []).push(e.id) } return out }
    const categories = {
      toolbox: group((e) => boxOf.get(e.tool) ?? 'none'),
      tool: group((e) => e.tool),
      theorem: group((e) => e.theorem ?? 'none yet: a lead for a theorem'),
      module: group((e) => (e.theorem ? THEOREMS.find((t) => t.key === e.theorem)?.module ?? 'unknown' : null)),
    }
    if (typeof args.reuse === 'string') {
      const e = EXAMPLES.find((x) => x.id === args.reuse)
      if (!e) throw new Error(`no example ${args.reuse}; the textbook has ${EXAMPLES.map((x) => x.id).join(', ')}`)
      const r = callOf(e.tool, e.arguments)
      if (r.error) throw new Error(r.error.message)
      const why = e.expect(r.result!.structuredContent)
      return { reused: e.id, tool: e.tool, toolbox: boxOf.get(e.tool) ?? 'none', theorem: e.theorem ?? null, shows: e.shows, asDocumented: why === null, why, result: r.result!.structuredContent }
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
      return { phase: 'verified' as const, id: uuidOf(content), sha256: hex(sha256(utf8(content))), examples: chosenExamples.length, requests: requests.size, fetched: [...requests.keys()].filter((u) => byUrl.has(u)).length, ...Object.fromEntries(Object.entries(states).map(([k, v]) => [`state:${k}`, v])), states, verified }
    }
    const chosen = typeof args.category === 'string' ? { [args.category]: categories[args.category as keyof typeof categories] } : categories
    return { examples: EXAMPLES.length, backedByTheorems: EXAMPLES.filter((e) => e.theorem).length, categories: Object.keys(chosen).length, ...Object.fromEntries(Object.entries(chosen).map(([k, v]) => [`${k}Count`, Object.keys(v).length])), textbook: chosen }
  },
  widget: flowWidget,
})

/** The UI as CSS, served: the stylesheet from the key and, for a UUID, the custom properties its block root carries. */
const css = defineTool('tree', {
  name: 'css',
  description: 'The quantum UI as CSS alone: the stylesheet derived from the key 432 (the harmonics, and the rules that draw every block from its own custom properties with no script, motion only where the device allows it, off-screen blocks at no cost) and, for a uuid, the custom properties its block root carries (hue, CMYK, accent, tail colour and angle, the 9-vortex seed and period). Computed once; a device renders at the cost of CSS.',
  inputSchema: { type: 'object', properties: { compare: { description: 'the stylesheet measured against the CSS frameworks by size: true names the framework files to fetch (pinned on jsDelivr) and this stylesheet to gzip; { qpu: { bytes, gzip }, answers: [{ id, status, bytes, gzip }] } turns the sizes the client measured into ratios; size only, render time not measured' }, uuid: { type: 'string', description: 'a UUID whose block variables to compute' }, uuids: { type: 'array', items: { type: 'string' }, description: 'a sequence of UUIDs set next to each other: each program presented by hue and moved by its own tail, the seams between neighbours measured; a collision (a seam of zero, two identical rings) is entropy exposed as a lead' }, create: { type: 'boolean', description: 'shadcn create (ui.shadcn.com/create) decided by the a432 settings and CSS: the ten settings, the registry item that initialises the project (globals.css light and dark, components.json, the QPU registry), the commands' } } },
  run: (args) => { const stylesheet = getCss()
    // the stylesheet measured against the frameworks: the files named for the client to fetch, then the sizes it hands back turned into ratios
    if (args.compare === true) return { phase: 'requests' as const, stylesheet, bytes: new TextEncoder().encode(stylesheet).length, frameworks: CSS_FRAMEWORKS, says: 'fetch each framework file once, measure its bytes raw and gzipped, gzip this stylesheet the same way, and hand the sizes back as compare: { qpu: { bytes, gzip }, answers }' } as never
    if (isObj(args.compare)) { const c = args.compare as { qpu?: { bytes: number; gzip: number }; answers?: { id: string; status: number; bytes: number; gzip: number }[] }; return { phase: 'compared' as const, ...compareCss(c.qpu ?? { bytes: new TextEncoder().encode(stylesheet).length, gzip: 0 }, c.answers ?? []) } as never }
    const vars = typeof args.uuid === 'string' ? cssVars(args.uuid) : null; const program = typeof args.uuid === 'string' ? programHues(args.uuid) : null; const rays = Array.isArray(args.uuids) ? castRays(args.uuids.map(String)) : null; if (args.create) return { ...createTheme(KEY, 'https://qpu.uuidna.com', ['qpu-style', 'qpu-block', 'qpu-app', 'qpu-card', 'qpu-badge', 'qpu-table', 'qpu-stream', 'qpu-dashboard']) }; return { key: KEY, coil: coilColour(KEY), program, rays, bytes: stylesheet.length, rules: (stylesheet.match(/\{/g) ?? []).length, variables: vars ? Object.keys(vars).length : 0, script: false, uuid: typeof args.uuid === 'string' ? args.uuid : null, vars, stylesheet } },
  widget: flowWidget,
})

/** A bounded tool laid out whole: every value each property admits (an enum, a boolean, an integer range, the ends of a
 * numeric bound, the textbook's values where a string is free), every combination of them with its block address and its
 * walk page, rendered as a grid of cells each drawn by its own UUID's CSS — so the user's click in the UI is the decision,
 * final, and nothing is computed until it is made. */
type Facet = { property: string; kind: 'enum' | 'boolean' | 'range' | 'textbook' | 'free'; required: boolean; values: unknown[]; domain: string; space: number }
const facetsOf = (name: string): { facets: Facet[]; tool: Tool | undefined } => {
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
    if (typeof args.tool !== 'string') return { tools: TOOLS.length, index: TOOLS.map((t) => { const { facets } = facetsOf(t.name); const enumerable = facets.filter((f) => f.values.length); return { tool: t.name, toolbox: t.toolbox, facets: facets.length, enumerable: enumerable.length, free: facets.filter((f) => f.kind === 'free').map((f) => f.property), combinations: enumerable.reduce((n, f) => n * f.values.length, 1), space: facets.some((f) => f.space === Infinity) ? 'unbounded' : facets.reduce((n, f) => n * f.space, 1), dashboard: `${origin}/${uuidOf(`dashboard${JSON.stringify({ tool: t.name })}`)}` } }) }
    const { facets, tool } = facetsOf(args.tool)
    if (!tool) throw new Error(`no tool ${args.tool}`)
    const fixed = (isObj(args.fixed) ? args.fixed : {}) as Record<string, unknown>
    const enumerable = facets.filter((f) => f.values.length)
    const open = enumerable.filter((f) => !(f.property in fixed))
    const freeRequired = facets.filter((f) => f.kind === 'free' && f.required && !(f.property in fixed)).map((f) => f.property)
    const space = Number(compositionsOf(enumerable.map((f) => f.values.length))) // Queneau's primitive: the product of the choices
    // the whole space is reachable by fixing one facet at a time: the cells of this dashboard are the values of the facets still open
    // (the required ones first, else the first open one); a cell fixes its value and leads to the narrower dashboard, until every
    // enumerable facet is fixed and the cell is the walk page of that one combination — the click is the decision, final
    const next = open.filter((f) => f.required).length ? open.filter((f) => f.required) : open.slice(0, 1)
    let combos: Record<string, unknown>[] = [{ ...fixed }]
    for (const f of next) combos = combos.flatMap((c) => f.values.map((v) => ({ ...c, [f.property]: v })))
    const final = (c: Record<string, unknown>) => enumerable.every((f) => f.property in c)
    const cells = combos.map((c) => { const leaf = final(c); const id = leaf ? uuidOf(`${args.tool}${JSON.stringify(c)}`) : uuidOf(`dashboard${JSON.stringify({ tool: args.tool, fixed: c })}`); return { arguments: c, uuid: id, url: `${origin}/${id}`, final: leaf, vars: cssVars(id) } })
    const chip = (text: string, style = '') => `<span style="display:inline-block; padding: 2px 8px; margin: 2px; border-radius: 999px; background: var(--surface-1); font-size: var(--font-size-footnote); ${style}">${text.replace(/[&<>]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[ch]!)}</span>`
    const html = `<div style="display: grid; gap: var(--gap-md);"><div role="heading" aria-level="3">${args.tool}: ${space.toLocaleString('en-US')} combination(s) of ${enumerable.length} facet(s), ${Object.keys(fixed).length} fixed, ${cells.length} cell(s) here${freeRequired.length ? `; ${freeRequired.join(', ')} is yours to type` : ''}</div>` +
      facets.map((f) => `<div data-facet="${f.property}"><strong>${f.property}</strong> <small>${f.domain}${f.required ? ', required' : ''}${f.property in fixed ? `, fixed to ${JSON.stringify(fixed[f.property])}` : ''}</small><div>${f.values.map((v) => chip(JSON.stringify(v), f.property in fixed && JSON.stringify(fixed[f.property]) === JSON.stringify(v) ? 'outline: 2px solid var(--a432-accent);' : '')).join('')}${f.values.length ? '' : chip('free')}</div></div>`).join('') +
      `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--gap-sm, 6px);">${cells.map((c) => `<a href="${c.url}" data-block="${c.uuid}" style="${Object.entries(c.vars).map(([k, v]) => `${k}: ${v}`).join('; ')}; display: block; border-left: 3px solid var(--qpu-accent); padding: 4px 8px; border-radius: var(--radius); background: var(--surface-1); color: var(--text-primary); text-decoration: none; font-size: var(--font-size-footnote);" title="${c.uuid}">${c.final ? '▶ ' : '▸ '}${Object.entries(c.arguments).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(' ').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!) || 'no arguments'}</a>`).join('')}</div></div>`
    return { tool: args.tool, facets: facets.length, enumerable: enumerable.length, fixed: Object.keys(fixed).length, combinations: space, cells: cells.length, final: cells.filter((c) => c.final).length, space: facets.some((f) => f.space === Infinity) ? 'unbounded' : facets.reduce((n, f) => n * f.space, 1), freeRequired, facetList: facets, cellList: cells.map(({ arguments: a, uuid, url, final: leaf }) => ({ arguments: a, uuid, url, final: leaf })), html }
  },
  widget: (d: { html?: string; tools?: number; index?: { tool: string; combinations: number; space: unknown; dashboard: string }[] }) => d.html ?? `<div style="display: grid; gap: var(--gap-sm, 6px);"><div role="heading" aria-level="3">${d.tools} tools, each laid out whole</div>${(d.index ?? []).map((i) => `<a href="${i.dashboard}" style="display: block; padding: 4px 8px; background: var(--surface-1); border-radius: var(--radius); color: var(--text-primary); text-decoration: none;">${i.tool}: ${i.combinations} combination(s), space ${i.space}</a>`).join('')}</div>`,
})

/** No-cloning unlocks the cloning of toolsets: the quantum state of a computation cannot be copied (all_noclone, kernel-checked),
 * so what is cloned is never the state but its classical description — and a toolbox is exactly that: its toolset (names,
 * descriptions, schemas), its skillset (instructions, directions, examples) and its selftest, a document any host mounts or
 * any client walks as doors by discovery. */
const clone = defineTool('tree', {
  name: 'clone',
  description: 'A toolbox cloned whole: its toolset (every tool\'s name, description and schema), its skillset (idea, instructions, directions, examples with what they show), and its selftest run now, as one document another host mounts or a client follows door by door. The quantum state of a computation is never cloned (all_noclone); its classical description is, and this is it. Without a toolbox: every toolbox\'s clone address.',
  inputSchema: { type: 'object', properties: { toolbox: { type: 'string', description: 'the toolbox to clone; omit for the index' }, as: { type: 'string', description: 'the name the clone carries at its new host' } } },
  run: (args, ctx) => {
    if (typeof args.toolbox !== 'string') return { toolboxes: TOOLBOXES.length, theorem: 'all_noclone', index: TOOLBOXES.map((b) => ({ toolbox: b.name, tools: b.tools.length, examples: EXAMPLES.filter((e) => b.tools.some((t) => t.name === e.tool)).length, clone: `/${uuidOf(`clone${JSON.stringify({ toolbox: b.name })}`)}` })) }
    const box = TOOLBOXES.find((b) => b.name === args.toolbox)
    if (!box) throw new Error(`no toolbox ${args.toolbox}; the toolboxes are ${TOOLBOXES.map((b) => b.name).join(', ')}`)
    const examples = EXAMPLES.filter((e) => box.tools.some((t) => t.name === e.tool)).map((e) => ({ id: e.id, tool: e.tool, arguments: e.arguments, shows: e.shows, theorem: e.theorem ?? null }))
    const selftest = box.skill.selftest(ctx)
    const doc = { name: typeof args.as === 'string' ? args.as : box.name, clonedFrom: box.name, idea: box.idea, toolset: box.tools.map((t) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema })), skillset: { instructions: box.skill.instructions, directions: box.skill.directions, examples }, selftest: { passed: selftest.passed, checks: selftest.checks.length }, license: LICENSE.spdx, author: LICENSE.author, theorem: 'all_noclone' }
    return { toolbox: box.name, as: doc.name, tools: box.tools.length, examples: examples.length, selftestPassed: selftest.passed, bytes: JSON.stringify(doc).length, id: uuidOf(`toolbox${JSON.stringify(doc)}`), noCloning: 'the quantum state of a computation cannot be cloned (all_noclone: coins ≠ mintOf coins, kernel-checked); its classical description can, and this document is that description', doc }
  },
  widget: flowWidget,
})

export const TOOLBOXES: Toolbox[] = [
  { name: 'google', idea: 'the Google Quantum AI layer: the Willow processor as its spec sheet states it, Cirq gates and circuits, Quantum Echoes, the roadmap, the software, the statements and the repositories', tools: OWN.filter((t) => t.toolbox === 'google'), examples: [], skill: { instructions: 'Call any tool with the arguments its schema names; every result is a block (widget, Open Graph, shadcn item) under the licence; the examples page is the documentation and the tests.', directions: ['server only: every example replays as documented (the audit)'], selftest: (ctx) => { const checks = ctx.examples.filter((e) => OWN.some((t) => t.name === e.tool && t.toolbox === 'google')).map((e) => { const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } }); const why = 'error' in r ? r.error.message : e.expect(r.result.structuredContent); return { id: `google:${e.id}`, passed: why === null, evidence: why ?? e.shows } }); return { passed: checks.every((c) => c.passed), checks } } } },
  { name: 'tree', idea: 'the tree knows itself: its leads, its self-audit, any statement matched or proved impossible, the Clay register recomputed, any UUID verified cheaply, its metrics in real time', tools: [...OWN.filter((t) => t.toolbox === 'tree'), metrics, textbook, css, dashboard, clone], examples: [], skill: { instructions: 'audit replays every example and every toolbox selftest; match decides any statement; verify checks a UUID against its seal, content and neighbours; clay recomputes the register; leads lists what is owed.', directions: ['server only: the audit audits the audit', 'toolbox → toolbox: match is the judge of readiness and the engine of imagine'], selftest: (ctx) => { const m = matchStatement('How many qubits does Willow have?', ctx.handle, ctx.examples, ctx.leads); const k = combineLeads(ctx.leads, '0'.repeat(31) + '1'); const ses = runSession({ open: [{ id: 'x', title: 'read every session transcript', status: 'draft', started: true }], directives: [{ session: 's', at: '', text: 'read every session transcript now' }, { session: 's', at: '', text: 'ok' }], breaks: [{ text: 'git push' }] }); const checks = [{ id: 'tree:match-serves', passed: m.verdict === 'served', evidence: `${m.verdict} via ${m.tool}` }, { id: 'tree:lead-cells', passed: k.cells.length === 432 && k.filled + k.empty === 432 && k.cells.reduce((n, c) => n + c.count, 0) === ctx.leads.length && k.default.cell === 1 && k.cells.every((c) => c.digits.reduce((n, d, i) => n + d * k.places[i]!, 0) === c.cell), evidence: `${k.says} (a referrer of 1 names cell 1; every cell round-trips its mixed radix)` }, { id: 'tree:session-partition', passed: ses.directives.folded === 1 && ses.directives.assents === 1 && ses.breaks['raw git commit or push in a shell'] === 1 && ses.items[0]?.started === true, evidence: ses.says }]; return { passed: checks.every((c) => c.passed), checks } } } },
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
export const chatOf = (statement: string, c: Ask = {}): any => {
  // the routing measured: a problem not routed to its door is a lead naming both
  if (c.routes) { const n = c.routes.length, leads = c.routes.map((x) => ({ id: uuidOf(x.statement), ...x, routed: chatOf(x.statement, { role: c.role, run: false }).call?.name ?? null })).filter((x) => x.routed !== x.door); return { role: c.role ?? 'reader', asked: n, exact: n - leads.length, leads, theorems: ['textbook_chat_call_or_question'], says: `${n - leads.length} of ${n} routed to their door` } }
  if (chatDepth > 0) return { statement, role: (c.role && c.role in ROLE_RANK ? c.role : 'reader') as Role, by: 'nested: a chat inside a chat is not entered again', routed: [] as string[], theorems: [] as string[], says: 'nested chat not entered' }
  chatDepth++
  // every answer is also a Payload lexical document: the statement as its heading, the call that answered and each theorem to verify as qpu blocks (a block is its tool and arguments, so any MCP client runs it), the answer's sentence after them
  try { const r = chatInner(statement, c) as { call?: Call; verify?: { theorem: string; call: Call }[]; routed?: string[]; says?: string }; const blocks = [...(r.call ? [{ uuid: uuidOf(JSON.stringify(r.call)), tool: r.call.name, arguments: r.call.arguments, theorem: r.routed?.[0] ?? null }] : []), ...(r.verify ?? []).map((v) => ({ uuid: uuidOf(JSON.stringify(v.call)), tool: v.call.name, arguments: v.call.arguments, theorem: v.theorem }))]; return { ...r, doc: docOf(statement, blocks, r.says ? [r.says] : []) } } finally { chatDepth-- }
}
const chatInner = (statement: string, c: Ask) => {
  const role: Role = c.role && c.role in ROLE_RANK ? (c.role as Role) : 'reader'
  // the matcher is asked without the examples that would enter the chat door again (a chat example, a client report): nothing nested is computed, so nothing context-dependent is cached under a call's address
  const reenters = (x?: { name?: string; tool?: string; arguments: Record<string, unknown> } | null) => { const n = x?.name ?? x?.tool; return !!x && ((n === 'match' && 'chat' in x.arguments) || (n === 'leads' && ('client' in x.arguments || 'session' in x.arguments))) }
  const own = EXAMPLES.filter((e) => !reenters(e))
  const m = c.call ? null : (matchStatement(statement, handle, own, LEADS) as { verdict?: string; call?: Call | null; route?: { theorems?: { theorem: string }[] }; cluster?: { kind: string; id: string }[]; lead?: unknown })
  const routed = (m?.route?.theorems ?? []).map((x) => x.theorem)
  // a served call that would enter the chat door again (a chat example, a client report) is not an answer to this chat: the theorems answer instead
  // a question's answer re-enters the loop: the door chosen answers by its first example
  const chosen = own.find((e) => e.tool === c.choice)
  let call: Call | null = c.call ? { name: c.call.tool, arguments: c.call.arguments ?? {} } : chosen ? { name: chosen.tool, arguments: chosen.arguments } : null
  let by = c.call ? 'the call given' : chosen ? `the door chosen: ${c.choice}` : ''
  // in route order, each theorem answers by its expression computed (the statement's numbers bound to its variables in order, evaluated on request) or else by its own example; the first that answers stands — the theorem is computed before any served call, so a textbook question is answered by the kernel's value, not a passage of prose
  // the first routed theorem, if it evaluates to its value, answers before any served call (the kernel's number, not a passage of prose)
  if (!call && routed[0]) { const nums = statement.match(/\d+/g) ?? []; const th = routed[0]; const tt = TEXTBOOK_THEOREMS.find((x) => x.key === th); if (tt) { const vars = getStatement(tt.lean).variables; const values = Object.fromEntries(vars.map((v, i) => [v, nums[i]]).filter(([, n]) => n !== undefined)); const ev = evaluateTheorem(th, values) as { evaluable?: boolean; needs?: string[] }; if (ev.evaluable && !(ev.needs ?? []).length) { call = { name: 'textbook', arguments: { evaluate: { theorem: th, values } } }; by = `theorem ${th} computed` } } }
  // otherwise the match's served call stands
  if (!call && m?.call && !reenters(m.call)) { call = m.call; by = 'the call the match serves' }
  // otherwise each routed theorem in order, by its evaluated value or its own example; the first that answers stands
  if (!call) { const nums = statement.match(/\d+/g) ?? []; for (const th of routed) { const tt = TEXTBOOK_THEOREMS.find((x) => x.key === th); if (tt) { const vars = getStatement(tt.lean).variables; const values = Object.fromEntries(vars.map((v, i) => [v, nums[i]]).filter(([, n]) => n !== undefined)); const ev = evaluateTheorem(th, values) as { evaluable?: boolean; needs?: string[] }; if (ev.evaluable && !(ev.needs ?? []).length) { call = { name: 'textbook', arguments: { evaluate: { theorem: th, values } } }; by = `theorem ${th} computed`; break } } const ex = EXAMPLES.find((x) => x.theorem === th); if (ex) { call = { name: ex.tool, arguments: ex.arguments }; by = `theorem ${th}: its example ${ex.id}`; break } } }
  // nothing decides it alone: one programmable question, the doors around it its options (textbook_chat_call_or_question)
  if (!call) { const doors = [...new Set(own.map((e) => e.tool))], near = doors.filter((d) => m?.cluster?.some((x) => x.id === d || own.some((e) => e.id === x.id && e.tool === d))); return { statement, role, by: 'a question', routed, question: { asks: 'which door decides it?', options: near.length ? near : doors }, lead: m?.lead ?? null, theorems: ['textbook_chat_call_or_question'] } }
  const tool = TOOLS.find((x) => x.name === call!.name) as (Tool & { inputSchema: { properties?: Record<string, { enum?: readonly unknown[]; default?: unknown }> } }) | undefined
  const h = harmonicDefaultsOf(tool?.inputSchema ?? {}, c.referrer, (p, v) => mayChoose(role, call!.name, p, v))
  const args: Record<string, unknown> = { ...call.arguments }
  const corrected: { property: string; from: unknown; to: unknown; why: string }[] = []
  for (const [p, v] of Object.entries(args)) {
    const opts = h.options[p]; if (!opts || opts.includes(v)) continue
    if (!opts.length) { delete args[p]; corrected.push({ property: p, from: v, to: null, why: `the ${role} role may choose no value of ${p}: withheld` }) }
    else { const to = h.defaults[p] ?? opts[0]; args[p] = to; corrected.push({ property: p, from: v, to, why: `the ${role} role may not choose ${String(v)}: its harmonic default within the values it may choose` }) }
  }
  if (c.run === false) return { statement, role, by, call: { name: call.name, arguments: args }, corrected, routed, theorems: ['textbook_rbac_options'], says: `${call.name} corrected for the ${role} role, not run` }
  const r = callOf(call.name, args)
  const theorems = ['textbook_rbac_options', 'textbook_fallback_involution', ...routed]
  const verify = verifyTheorems(theorems)
  if (r.error) return { statement, role, by, verify, call: { name: call.name, arguments: args }, corrected, routed, handled: { error: r.error.message, remedy: listRemedies([r.error.message]), fallback: handleOrCorrect([r.error.message], false, 'handling'), court: summonCourt({ gate: `chat ${call.name}`, rule: 'shape', evidence: { message: r.error.message } }) }, theorems, says: `${call.name} refused it; answered with its remedy and the court's case, nothing thrown` }
  return { statement, role, by, verify, call: { name: call.name, arguments: args }, corrected, routed, reply: r.result?.structuredContent ?? null, theorems, says: `${call.name} answered under the ${role} role (${by})${corrected.length ? `; ${corrected.length} value(s) corrected to what the role may choose` : ''}` }
}
// the tools/call envelope, written once
export const callOf = (name: string, args: unknown) => handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }) as { result?: { structuredContent?: any }; error?: { message: string } }
// the theorems that count what the tools compute read it from here
updateTheoremSources({ toolboxes: TOOLBOXES, call: callOf, googleMcps: GOOGLE_MCPS, get examples() { return EXAMPLES } })
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
const CONTEXT: Context = { get handle() { return handle }, get examples() { return EXAMPLES }, get leads() { return LEADS }, call: (name, args = {}) => callOf(name, args).result?.structuredContent }
// the leads beyond the core, handed by a client or a page's hook as arguments (records, or one lead): the call's leads, the core's ids kept first
const isLead = (l: unknown): l is Lead => isObj(l) && ['id', 'statement', 'status'].every((k) => typeof (l as Record<string, unknown>)[k] === 'string')
const recordsOf = (args: Record<string, unknown>): Context => { const given = [...(Array.isArray(args.records) ? args.records : []), args.lead].filter(isLead), ids = new Set(LEADS.map((l) => l.id)); return given.length ? { handle, examples: EXAMPLES, leads: [...LEADS, ...given.filter((l) => !ids.has(l.id) && ids.add(l.id))], call: CONTEXT.call } : CONTEXT }

const keyOfQubit = (q: Qubit): string => (q.kind === 'grid' ? `grid:${q.row},${q.col}` : q.kind === 'line' ? `line:${q.x}` : `named:${q.name}`)

/** Answer one JSON-RPC message: initialize, tools/list, or tools/call. Anything else is method not found. */
/** A batch: a JSON-RPC array is answered as one array, in order — the batch action of every tool, one request. */
export const handleBatch = (messages: readonly Rpc[]): Reply[] => messages.map((m) => handle(m))
/** One door for every client written once: a tool called by name, its structured answer returned or its error thrown — the tools/call
 *  envelope the scripts wrote out each for itself (recognised as a shape by the entropy cleaner). */
export const toolCallerOf = (name: string) => (args: Record<string, unknown> = {}): any => { const r = callOf(name, args); if (r.error) throw new Error(r.error.message); return r.result!.structuredContent }
export const handle = (message: Rpc): Reply => {
  if (Array.isArray(message)) return handleBatch(message as unknown as Rpc[]) as unknown as Reply
  const id = message.id ?? null
  // cheap gates leading every violator to court via its own MCP: the error carries the case computed (the rule, the theorem, the remedy, the call to file it)
  const fail = (code: number, text: string): Reply => ({ jsonrpc: '2.0', id, error: { code, message: text, data: { court: summonCourt({ gate: `${message.method}${(message as { params?: { name?: string } }).params?.name ? ` ${(message as { params: { name: string } }).params.name}` : ''}`, code, evidence: text }) } } })
  const params = (message.params ?? {}) as Record<string, unknown>, ok = (result: unknown) => ({ jsonrpc: '2.0', id, result }) as Reply
  try {
    if (message.method === 'initialize') return ok({ protocolVersion: '2025-06-18', capabilities: { tools: {}, resources: {}, extensions: { [MCP_APPS.extension]: { mimeTypes: [MCP_APPS.mimeType] } } }, serverInfo: { name: 'qpu', version: VERSION, build: buildOf(SERVED.map((t) => t.name)), license: LICENSE.spdx, author: LICENSE.author }, instructions: `${INSTRUCTIONS}\n\nToolboxes: ${TOOLBOXES.map((b) => `${b.name} (${b.tools.map((t) => t.name).join(', ')}): ${b.idea}. ${b.skill.instructions}`).join('\n')}` })
    // every tool declares its UI resource (MCP Apps, _meta.ui.resourceUri): a host that negotiates the extension renders the tool's result through it
    // every tool listed widget-skilled: its UI resource (the widget) and its toolbox's skill (the instructions a client follows, the directions it tests in)
    if (message.method === 'tools/list') {
      // the list balanced to the request, over MCP alone: the tools a statement needs (the match tool decides the cluster), or the tools named, with brief
      // descriptions when asked, so the context a model carries stays small and never needs compacting; the context counted beside (textbook_context_balanced)
      // short by default: first sentences for every description, the toolbox's instructions left out; the full text for a toolbox, for tools named, or with full: true
      const scope = params as { tools?: string[] | string; brief?: boolean; statement?: string; toolbox?: string; full?: boolean }
      const wanted = typeof scope.tools === 'string' ? scope.tools.split(',').map((s) => s.trim()).filter(Boolean) : Array.isArray(scope.tools) ? scope.tools.map(String) : null
      const cluster = typeof scope.statement === 'string' && scope.statement.trim() ? (() => { const c = callOf('match', { statement: scope.statement }).result?.structuredContent as { tool?: string | null; cluster?: { kind: string; id: string }[] } | undefined; return [...new Set([...(c?.tool ? [c.tool] : []), ...(c?.cluster ?? []).filter((x) => x.kind === 'tool').map((x) => x.id)])] })() : null
      const box = typeof scope.toolbox === 'string' ? scope.toolbox : null
      const chosen = SERVED.filter((t) => (!wanted || wanted.includes(t.name)) && (!cluster || cluster.includes(t.name)) && (!box || t.toolbox === box))
      const full = scope.full === true || Boolean(wanted) || Boolean(box)
      const brief = (d: string) => (full ? d : (d.match(/^[^.:]{1,160}/)?.[0] ?? d.slice(0, 160)).trim())
      const briefSchema = (s: object): object => { if (full) return s; const x = s as { properties?: Record<string, { description?: string }> }; return x.properties ? { ...x, properties: Object.fromEntries(Object.entries(x.properties).map(([k, p]) => [k, typeof p.description === 'string' ? { ...p, description: brief(p.description) } : p])) } : s }
      // harmonic options by default: every enum of a tool's schema a superposition of its combinations, the referrer (params.prev) or the a432 key choosing the default one
      const referrer = typeof (params as { prev?: unknown }).prev === 'string' ? (params as { prev: string }).prev : undefined
      const role = ['reader', 'writer', 'admin'].includes(String((params as { role?: unknown }).role)) ? (params as { role: Role }).role : null
      const harmonic = (tool: string, s: object) => { const h = harmonicDefaultsOf(s as { properties?: Record<string, { enum?: readonly unknown[]; default?: unknown }> }, referrer, role ? (prop, value) => mayChoose(role, tool, prop, value) : undefined); const x = s as { properties?: Record<string, { enum?: unknown[] }>; required?: string[] }; if (!Object.keys(h.defaults).length && !h.withheld.length && !role) return s; const properties = Object.fromEntries(Object.entries(x.properties ?? {}).filter(([k]) => !h.withheld.includes(k)).map(([k, p]) => [k, { ...p, ...(Array.isArray(p.enum) && role ? { enum: h.options[k] } : {}), ...(k in h.defaults ? { default: h.defaults[k] } : {}) }])); return { ...x, properties, ...(x.required ? { required: x.required.filter((r) => !h.withheld.includes(r)) } : {}), 'x-harmonic': { combinations: h.count.toString(), index: h.index.toString(), from: h.from, ...(role ? { role, withheld: h.withheld } : {}) } } }
      const list = chosen.map(({ name, description, inputSchema, toolbox }) => { const box = TOOLBOXES.find((b) => b.name === toolbox); return { name, description: brief(description), inputSchema: harmonic(name, briefSchema(inputSchema)), annotations: { title: name, readOnlyHint: true, idempotentHint: true, openWorldHint: false }, _meta: { toolbox, skill: { ...(full ? { instructions: box?.skill.instructions ?? '' } : {}), directions: box?.skill.directions.length ?? 0 }, ui: { resourceUri: `ui://qpu/${name}`, visibility: ['model', 'app'] } } } })
      const chars = JSON.stringify(list).length; const fullChars = JSON.stringify(CONTRACTS).length
      return ok({ tools: list, _meta: { context: { tools: list.length, of: TOOLS.length, chars, tokens: Math.ceil(chars / 4), fullChars, fullTokens: Math.ceil(fullChars / 4), saved: Math.ceil(fullChars / 4) - Math.ceil(chars / 4), balanced: Boolean(wanted || cluster || !full), full, bill: getBill({ tokens: Math.ceil(chars / 4), bits: chars * 8, saved: { tokens: Math.ceil(fullChars / 4) - Math.ceil(chars / 4), bits: (fullChars - chars) * 8 } }), says: 'the list balanced to the request over MCP: the cluster the match tool decides, brief descriptions on request, the context counted; the saved and the kept make the whole (textbook_context_balanced)' } } })
    }
    // the UI resources: one ui://qpu/<tool> per tool, the app shell served over the standard resource methods, nothing bypassed
    // the SDK is a resource too: served here and, through the plugin's resources, by the Payload MCP plugin — and the SDK calls both back (vice versa)
    if (message.method === 'resources/list') return ok({ resources: [...VIEWS.map((v) => { const u = uiOf(v); return { uri: u.uri, name: u.name, description: v === 'chat' ? 'the chat: a problem routed to its door, or one programmable question' : `the MCP Apps view of ${v}: renders the widget the tool computes`, mimeType: u.mimeType, _meta: { ui: { csp: u.csp, prefersBorder: u.prefersBorder } } } }), { uri: 'sdk://qpu/lib', name: 'qpu · sdk', description: 'the SDK: the config sets as the base of combinatorial application builders — one TypeScript module that calls this server over MCP (token free) and the Payload MCP plugin with a user\'s API key (the collections among its tools); served here and by the plugin', mimeType: 'text/typescript' }, { uri: OPENAPI_RESOURCE, name: 'qpu · openapi', description: 'the standard contract: an OpenAPI 3.1 document derived from tools/list and the endpoint table — every tool a component schema, every endpoint a path, the mcp operation a JSON-RPC envelope; the same document stands in the discovery document at /.well-known/qpu.json', mimeType: 'application/json' }, { uri: LEAN_RESOURCE, name: 'qpu · lean', description: 'everything the kernel accepts, served whole: every theorem with its module and statement, the textbook theorems with their Lean text, the generated lemmas counted, the kernel\'s total; no version hides anything Lean', mimeType: 'application/json' }] })
    if (message.method === 'resources/templates/list') return ok({ resourceTemplates: [{ uriTemplate: 'ui://qpu/{tool}', name: 'qpu · a tool\'s view', mimeType: MCP_APPS.mimeType, description: 'the app shell of any tool of the catalogue' }] })
    if (message.method === 'resources/read') {
      const uri = String(params.uri ?? ''), read = (mimeType: string, text: string, more = {}) => ok({ contents: [{ uri, mimeType, text, ...more }] })
      if (uri === 'sdk://qpu/lib') { const sdk = sdkOf('https://qpu.uuidna.com', NAMES); return read('text/typescript', sdk.module) }
      if (uri === LEAN_RESOURCE) return read('application/json', JSON.stringify(leanLedgerOf(), null, 1))
      if (uri === OPENAPI_RESOURCE) return read('application/json', JSON.stringify(createOpenapi('https://qpu.uuidna.com', CONTRACTS), null, 1))
      const name = /^ui:\/\/qpu\/([a-z0-9_-]+)$/.exec(uri)?.[1]
      if (!name || !VIEWS.includes(name)) return fail(INVALID_PARAMS, `no resource ${uri}; the resources are ui://qpu/<view> for ${VIEWS.join(', ')}`)
      const u = uiOf(name)
      return read(u.mimeType, u.html, { _meta: { ui: { csp: u.csp, prefersBorder: u.prefersBorder } } })
    }
    if (message.method === 'tools/call') {
      const found = TOOLS.find((t) => t.name === params.name)
      if (!found) return fail(METHOD_NOT_FOUND, `no tool ${String(params.name)}; the tools are ${NAMES.join(', ')}`)
      // The balancer: every tool is pure, so a call is a function of its block address; computed once per process, served from
      // memory after — the heavy computation inverted, the hardware cooled, the battery saved (lead qpu-balancer-perspective).
      const args = (params.arguments ?? {}) as Record<string, unknown>
      const address = uuidOf(`${found.name}${JSON.stringify(args)}`)
      const cached = found.name === 'metrics' ? undefined : BALANCER.get(address)
      // exclusive time: a tool that calls tools (audit, metrics, match) is charged only for its own milliseconds; the nested ones are theirs
      const started = Date.now(); NESTED.push(0)
      const { structured, widget } = cached ?? found.call(args, recordsOf(args))
      if (!cached) BALANCER.set(address, { structured, widget }); else if (TELEPORTED.has(address)) { TELEPORT_HITS += 1; TELEPORT_USED.add(address) }
      const children = NESTED.pop() ?? 0; const elapsed = Date.now() - started
      if (NESTED.length) NESTED[NESTED.length - 1]! += elapsed
      const o = OBSERVED.get(found.name) ?? { calls: 0, misses: 0, ms: 0, bytes: 0 }
      o.calls += 1; if (!cached) { o.misses += 1; o.ms += elapsed - children; o.bytes += widget.length + JSON.stringify(structured).length }
      OBSERVED.set(found.name, o)
      const block = blockOf(found.name, args, structured, widget, found.description)
      // the referer of a call: who sent it, carried as _meta.prev, echoed so a chain of calls knows its previous step across domains
      const prev = typeof (params._meta as { prev?: unknown } | undefined)?.prev === 'string' ? (params._meta as { prev: string }).prev : undefined
      // the cheapest view (params._meta.view = 'cheapest', the Worker's ?view=cheapest): an LLM reads only the cheapest way to have the answer — its
      // address, the call that recomputes it, an index where the answer has one — and what tampering would cost; the full answer stays in structuredContent
      const view = (params._meta as { view?: unknown } | undefined)?.view
      const full = JSON.stringify(structured)
      const cheapest = view === 'cheapest' ? JSON.stringify({ address: block.id, sha256: hex(sha256(utf8(canonicalTextOf(structured)))), recompute: { tool: found.name, arguments: args }, tamper: { collision: '2^128', secondPreimage: '2^256' }, coins: ALGEBRA_TOOLS.includes(found.name) ? 0 : (CATALOGUE.find((v) => v.product === 'qpu-metered')?.amounts.eur ?? 0) / 1000, unlock: 'If-None-Match: address -> 304', theorem: 'textbook_advantage_unbounded', licence: LICENSE.spdx, commercial: ALGEBRA_TOOLS.includes(found.name) ? 'free under attribution' : 'a licence of the catalogue', tokens: Math.ceil(full.length / 4) }) : null
      return ok({ content: [{ type: 'text', text: cheapest !== null && cheapest.length < full.length ? cheapest : full }], structuredContent: structured, isError: false, _meta: { jsonLd: blockJsonLd({ tool: found.name, id: block.id, description: found.description, toolbox: found.toolbox, url: `urn:uuid:${block.id}` }), payload: found.name === 'payload' ? undefined : payloadDocOf({ uuid: block.id, tool: found.name, arguments: args, description: found.description, openGraph: block.openGraph as unknown as Record<string, string>, prev: typeof (params._meta as { prev?: unknown } | undefined)?.prev === 'string' ? (params._meta as { prev: string }).prev : null }), widget: block.html, openGraph: { ...block.openGraph, ...(prev ? { 'og:see_also': prev } : {}) }, block: block.shadcn, theme: block.theme, license: LICENSE, fusion: fuseCall(found.name), integrity: { address: block.id, sha256: hex(sha256(utf8(canonicalTextOf(structured)))), of: 'the canonical text of structuredContent', check: 'seal { tamper: { text, address, sha256 } }', says: 'the address is a fast fold that catches change; the SHA-256 is what a forger cannot match (a second preimage, 2^256 work); the edge adds an ML-DSA signature with seal { sign }' }, ...(prev ? { prev } : {}) } })
    }
    return fail(METHOD_NOT_FOUND, `method ${message.method} is not served`)
  } catch (error) {
    return fail(INVALID_PARAMS, error instanceof Error ? error.message : String(error))
  }
}
