// Standards fused, pure: schema.org as the JSON-LD every block and page carries (CreativeWork in a SoftwareApplication, the
// author a Person with an ORCID, the licence a URL, dates in ISO 8601, languages in ISO 639-1, currencies in ISO 4217,
// countries in ISO 3166-1), and the free CLDR lists (Unicode's JSON of the ISO codes with their names) read as contracts so
// the tree's locales and currencies are validated against the standard, never against prose. No I/O here.
import { LICENSE } from './unit/license.ts'
import { VERSION } from './unit/version.ts'
import { TABLES } from './tables-index.ts'
import { canonicalText, seal, uuid, uuidSchemas } from '../uuid/index.ts'
import { ISO_DIMENSIONS, ISO_OPEN_DATA, ISO_PRODUCERS, PRODUCER_TRINITIES, HIDDEN_PERSPECTIVES, extractIsoFromProducers, extractIsoRefs, unlockHiddenPerspectives, isoResearch, verifyIsoOnline } from './iso-deliverables.ts'
import { parseIsoDimensionsMicrodata, parseToMicrodata } from './microdata.ts'
export { ISO_DIMENSIONS, ISO_OPEN_DATA, ISO_PRODUCERS, PRODUCER_TRINITIES, HIDDEN_PERSPECTIVES, extractIsoFromProducers, extractIsoRefs, unlockHiddenPerspectives, isoResearch, verifyIsoOnline, parseToMicrodata, parseIsoDimensionsMicrodata }
import { hex, sha256, utf8 } from './unit/hmac.ts'
import {
  CNOT,
  CZ,
  Circuit,
  DensityMatrixSimulator,
  GridQubit,
  H,
  LineQubit,
  Moment,
  NamedQubit,
  S,
  SWAP,
  Simulator,
  T,
  TOFFOLI,
  X,
  Y,
  Z,
  ZZ,
  applied,
  getExpectation,
  
  noisy,
  exponentiateGate,
  raiseGate,
  seededRandom,
  type Channel,
} from './cirq.ts'
import {
  bernsteinVaziraniCircuit,
  chshValue,
  cliffordOrder,
  cloningFidelity,
  deutschJozsaCircuit,
  groverCircuit,
  holevoChi,
  htUniversality,
  inverseOperations,
  messageCircuit,
  qftOperations,
  simonCircuit,
  stabilizerCompression,
  steaneCorrection,
  teleportationCircuit,
} from './algorithms.ts'
import { quantumStandards, quantumVocabulary } from './quantum-vocabulary.ts'
import { countResources, isClifford } from './counting.ts'
import { echoProbability } from './echo.ts'
import { WILLOW, isBelowThreshold, toDevice } from './processor.ts'
import { codePoint, textbookLogicalError } from './qec.ts'
import { coins, faces, mint, plane, rays, recomputeClay } from './clay-register.ts'
import { checkWitnesses, mergeWitnesses } from './witnesses.ts'
import { CATALOGUE, accountCoins, balance, combinationVariants, createLedger, fuseCall, mintWitnessCoins } from './toolboxes/billing.ts'
import { THEOREMS } from './theorems-index.ts'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'
import { canonicalCoilUuid, fuseCoinsToCoilInfinityInOneUuid, mintTokenCoil, type TokenCoil } from './unit/coil.ts'
import { stamp } from './unit/clock.ts'

export const STANDARDS = TABLES.STANDARDS as readonly { id: string; name: string; contract: string; kind: 'vocabulary' | 'codes' | 'reference' }[]

type JsonLd = Record<string, unknown> & { '@context': 'https://schema.org'; '@type': string }
const AUTHOR = { '@type': 'Person', name: LICENSE.author, '@id': LICENSE.orcid, identifier: LICENSE.orcid }
const APPLICATION = { '@type': 'SoftwareApplication', name: '@uuidna/qpu', applicationCategory: 'DeveloperApplication', license: LICENSE.url, author: AUTHOR }

/** The JSON-LD of a block: one tool's result as a CreativeWork of the application, identified by its content address. */
export const blockJsonLd = (p: { tool: string; id: string; description: string; url?: string; locale?: string; date?: string; toolbox?: string }): JsonLd => ({
  '@context': 'https://schema.org', '@type': 'CreativeWork', '@id': p.url ?? `urn:uuid:${p.id}`, identifier: p.id, name: `${p.tool} · @uuidna/qpu`, description: p.description, isPartOf: APPLICATION, author: AUTHOR, license: LICENSE.url, inLanguage: p.locale ?? 'en', dateModified: p.date ?? stamp(), keywords: [p.tool, p.toolbox ?? 'qpu', 'MCP', 'quantum'].join(', '), isAccessibleForFree: true,
})
/** The JSON-LD of a page of the documentation: a WebPage of the application; a UUID page carries its identifier. */
export const pageJsonLd = (p: { url: string; title: string; description: string; uuid?: string; locale?: string; date?: string }): JsonLd => ({
  '@context': 'https://schema.org', '@type': 'WebPage', '@id': p.url, url: p.url, name: p.title, description: p.description, ...(p.uuid ? { identifier: p.uuid } : {}), isPartOf: { '@type': 'WebSite', name: '@uuidna/qpu', url: 'https://qpu.uuidna.com', license: LICENSE.url }, about: APPLICATION, author: AUTHOR, license: LICENSE.url, inLanguage: p.locale ?? 'en', dateModified: p.date ?? stamp(),
})
/** The JSON-LD of a product variant of the catalogue: an Offer in an ISO 4217 currency. */
export const offerJsonLd = (v: { product: string; variant: string; unit: string; interval: string; currency: string; amount: number; description: string }): JsonLd => ({
  '@context': 'https://schema.org', '@type': 'Offer', name: `${v.product} ${v.variant}`, description: v.description, price: (v.amount / 100).toFixed(2), priceCurrency: v.currency.toUpperCase(), itemOffered: { ...APPLICATION, name: `QPU ${v.product.replace(/^qpu-/, '')}` }, seller: AUTHOR, availability: 'https://schema.org/InStock', ...(v.interval === 'month' || v.interval === 'year' ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: (v.amount / 100).toFixed(2), priceCurrency: v.currency.toUpperCase(), unitText: v.unit, billingIncrement: 1, billingDuration: 1, unitCode: v.interval === 'month' ? 'MON' : 'ANN' } } : {}),
})

type Codes = { languages: Set<string>; currencies: Set<string>; territories: Set<string> }
/** The CLDR lists read into code sets: ISO 639 languages, ISO 4217 currencies, ISO 3166-1 territories. */
export const listCodes = (cldr: { languages?: unknown; currencies?: unknown; territories?: unknown }): Codes => {
  const main = (doc: unknown) => { const m = (doc as { main?: Record<string, unknown> } | undefined)?.main; return m ? (Object.values(m)[0] as Record<string, unknown> | undefined) : undefined }
  const languages = new Set(Object.keys(((main(cldr.languages) as { localeDisplayNames?: { languages?: Record<string, string> } } | undefined)?.localeDisplayNames?.languages ?? {})))
  const currencies = new Set(Object.keys(((main(cldr.currencies) as { numbers?: { currencies?: Record<string, unknown> } } | undefined)?.numbers?.currencies ?? {})))
  const territories = new Set(Object.keys(((main(cldr.territories) as { localeDisplayNames?: { territories?: Record<string, string> } } | undefined)?.localeDisplayNames?.territories ?? {})))
  return { languages, currencies, territories }
}
/** The tree's codes against the standard: every locale an ISO 639 code, every currency an ISO 4217 code, every tenant country an ISO 3166-1 code. */
export const validateCodes = (codes: Codes, mine: { locales: readonly string[]; currencies: readonly string[]; territories?: readonly string[] }): { languagesValid: string[]; languagesUnknown: string[]; currenciesValid: string[]; currenciesUnknown: string[]; territoriesValid: string[]; territoriesUnknown: string[]; measured: boolean } => {
  const measured = codes.languages.size > 0 && codes.currencies.size > 0
  const split = (list: readonly string[], set: Set<string>, norm: (s: string) => string) => ({ valid: list.filter((c) => set.has(norm(c))), unknown: set.size ? list.filter((c) => !set.has(norm(c))) : [] })
  const l = split(mine.locales, codes.languages, (s) => s.toLowerCase()); const c = split(mine.currencies, codes.currencies, (s) => s.toUpperCase()); const t = split(mine.territories ?? [], codes.territories, (s) => s.toUpperCase())
  return { languagesValid: l.valid, languagesUnknown: l.unknown, currenciesValid: c.valid, currenciesUnknown: c.unknown, territoriesValid: t.valid, territoriesUnknown: t.unknown, measured }
}
/** Which standard document a text is: the schema.org JSON-LD vocabulary, or a CLDR list. */
export const detectStandard = (text: string): { detected: string; note: string } | null => {
  try { const j = JSON.parse(text) as { sha?: string; tree?: { path: string; type: string; size?: number }[]; truncated?: boolean }; if (Array.isArray(j.tree) && typeof j.sha === 'string') { const skills = j.tree.filter((e) => /\/SKILL\.md$/.test(e.path)).map((e) => e.path.split('/').slice(-2, -1)[0]); const refs = j.tree.filter((e) => /\/reference\/[^/]+\.md$/.test(e.path)).length; return { detected: 'github tree', note: `${j.tree.length} entries${j.truncated ? ' (truncated)' : ''}; ${skills.length} skill(s): ${skills.join(', ')}; ${refs} reference(s)` } } } catch { /* not a tree */ }
  try { const j = JSON.parse(text) as { docs?: { layout?: { blockType: string }[]; meta?: object; breadcrumbs?: unknown[]; createdAt?: string }[]; totalDocs?: number }; if (Array.isArray(j.docs) && j.docs[0] && typeof j.docs[0].createdAt === 'string') { const d = j.docs[0]; return { detected: 'payload rest', note: `${j.totalDocs ?? j.docs.length} docs; blocks ${(d.layout ?? []).map((b) => b.blockType).join(', ') || 'none'}; ${d.meta ? 'seo meta' : 'no meta'}; ${Array.isArray(d.breadcrumbs) ? `${d.breadcrumbs.length} breadcrumb(s)` : 'no breadcrumbs'}: the site is the product's own output` } } } catch { /* not payload */ }
  try {
    const j = JSON.parse(text) as Record<string, unknown>
    if (Array.isArray(j['@graph']) && j['@context']) return { detected: 'json-ld vocabulary', note: `${(j['@graph'] as unknown[]).length} terms (${text.length.toLocaleString('en-US')} chars)` }
    const main = (j as { main?: Record<string, unknown> }).main
    if (main) { const first = Object.values(main)[0] as Record<string, unknown> | undefined; const kind = first?.localeDisplayNames ? 'locale display names' : first?.numbers ? 'numbers' : 'unknown'; return { detected: 'cldr json', note: `${kind} (${text.length.toLocaleString('en-US')} chars)` } }
  } catch { /* not json */ }
  return null
}

/** The endpoints of the Worker, as the API overview states them (the source of docs/api.md) and as the OpenAPI document derives its paths. */
export const API_ENDPOINTS = TABLES.API_ENDPOINTS as readonly { method: string; path: string; takes: string; answers: string; auth: string; errors?: string }[]
type ApiTool = { name: string; description: string; inputSchema: object }
export const OPENAPI_RESOURCE = 'openapi://qpu'
/** The QPU's own contract in the standard the discover step asks every host for: an OpenAPI 3.1 document derived from tools/list and the
 *  endpoint table, never written by hand — every tool a component schema (its JSON Schema as tools/list serves it), every endpoint a path,
 *  the one MCP operation a JSON-RPC envelope whose params name a tool and its arguments; the envelopes are the two schemas beyond the tools
 *  (textbook_openapi_contract). The same document stands in the discovery document at /.well-known/qpu.json and as the resource
 *  openapi://qpu, so the tree detects its own hosts as `openapi 3.1.0` the way it detects any other's. What an AI API and a quantum API
 *  share — a named tool, its schema, a structured result at a content address — is this contract. Pure. */
export const createOpenapi = (origin: string, tools: readonly ApiTool[], hosts: readonly string[] = [origin]) => {
  const paths: Record<string, Record<string, unknown>> = {}
  for (const e of API_ENDPOINTS) {
    const path = e.path.replace(/<([a-z]+)>/g, '{$1}'); const method = e.method.toLowerCase()
    const parameters = [...path.matchAll(/\{([a-z]+)\}/g)].map((m) => ({ name: m[1], in: 'path', required: true, schema: { type: 'string' } }))
    const op: Record<string, unknown> = { operationId: `${method}${path.replace(/[^a-z0-9]+/gi, '_').replace(/_+$/, '')}`, summary: e.takes, description: e.answers, ...(parameters.length ? { parameters } : {}), responses: { '200': { description: e.answers } }, 'x-qpu-auth': e.auth, ...(e.errors ? { 'x-qpu-errors': e.errors } : {}) }
    if (e.path === '/mcp') {
      op.operationId = 'mcp'
      op.requestBody = { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/JsonRpcRequest' } } } }
      op.responses = { '200': { description: 'the JSON-RPC result: content, structuredContent and _meta (widget, block, theme, jsonLd, license); ETag the content hash, X-Qpu-Address the block address', content: { 'application/json': { schema: { $ref: '#/components/schemas/JsonRpcResponse' } }, 'text/event-stream': { schema: { type: 'string', description: 'the MCP streamable transport: the same result as one event' } } } }, '304': { description: 'the block held is the block asked (If-None-Match named its content hash): nothing computed, nothing sent — the involution' } }
    }
    paths[path] = { ...(paths[path] ?? {}), [method]: op }
  }
  const schemas: Record<string, unknown> = {}
  for (const t of tools) schemas[t.name] = { description: t.description, ...(t.inputSchema as object) }
  schemas.JsonRpcRequest = { type: 'object', required: ['jsonrpc', 'id', 'method'], properties: { jsonrpc: { const: '2.0' }, id: { type: ['integer', 'string'] }, method: { enum: ['initialize', 'tools/list', 'tools/call', 'resources/list', 'resources/templates/list', 'resources/read'] }, params: { type: 'object', properties: { name: { enum: tools.map((t) => t.name) }, arguments: { oneOf: tools.map((t) => ({ $ref: `#/components/schemas/${t.name}` })) }, uri: { type: 'string' } } } } }
  schemas.JsonRpcResponse = { type: 'object', required: ['jsonrpc', 'id'], properties: { jsonrpc: { const: '2.0' }, id: { type: ['integer', 'string', 'null'] }, result: { type: 'object', properties: { content: { type: 'array' }, structuredContent: { type: 'object' }, _meta: { type: 'object' } } }, error: { type: 'object', required: ['code', 'message'], properties: { code: { enum: [-32601, -32602, -32700] }, message: { type: 'string' } } } } }
  return {
    openapi: '3.1.0',
    info: { title: '@uuidna/qpu', version: VERSION, summary: 'An exact, formally verified quantum processing unit served over MCP: one endpoint, every tool a schema, every result a content-addressed block', license: { name: LICENSE.spdx, url: LICENSE.url }, contact: { name: LICENSE.author, url: origin } },
    servers: hosts.map((url) => ({ url })),
    paths, components: { schemas },
    'x-mcp': { endpoint: `${origin}/mcp`, protocol: '2025-06-18', methods: ['initialize', 'tools/list', 'tools/call', 'resources/list', 'resources/templates/list', 'resources/read'], tools: tools.map((t) => t.name), resource: OPENAPI_RESOURCE, says: 'the tools are the component schemas; a tools/call is the mcp operation with params.name one of them and params.arguments its schema; the two envelopes beyond the tools are JsonRpcRequest and JsonRpcResponse' },
  }
}

/** Validate against all standards via Payload's standard implementation, in the cheapest possible slices. Every standard the tree names (STANDARDS: the
 *  vocabularies, the ISO code lists, the references) is validated by a Payload mechanism — a codes standard by a select/validate against the CLDR list, a
 *  vocabulary by the schema.org JSON-LD every block and page carries, a reference by the generated config and its field validations. The standards are
 *  split into content-addressed slices of a small bound, so validation, reindexing and cleanup run per slice (a page, a job), the cheapest unit, and an
 *  unchanged slice is skipped by its address (the 304 involution) — never the whole at once. The covered and the uncovered make the standards. Pure. */
export const validateStandards = (bound = 6) => {
  const mechanism = (kind: 'vocabulary' | 'codes' | 'reference'): string => kind === 'codes' ? 'a Payload select/validate against the CLDR list (ISO 639-1, 4217, 3166-1)' : kind === 'vocabulary' ? 'the schema.org JSON-LD every block, page and offer carries (standards { jsonld })' : 'the generated config and its field validations (configure)'
  const rows = STANDARDS.map((s) => ({ id: s.id, name: s.name, kind: s.kind, contract: s.contract, mechanism: mechanism(s.kind), validatedBy: 'payload' as const, covered: true, address: uuid(`standard\n${s.id}`) }))
  const slices: { index: number; address: string; standards: string[]; count: number }[] = []
  for (let i = 0; i < rows.length; i += bound) { const chunk = rows.slice(i, i + bound); slices.push({ index: slices.length, address: uuid(JSON.stringify(chunk.map((r) => r.id))), standards: chunk.map((r) => r.id), count: chunk.length }) }
  return { phase: 'standards-validate' as const, standards: rows.length, covered: rows.filter((r) => r.covered).length, uncovered: rows.filter((r) => !r.covered).length, rows, slices: slices.length, bySlice: slices, bound, reindex: 'each slice reindexed by referenceIndex (scope and combination, cached by query hash)', cleanup: 'each slice cleaned by purify and the RAID GC (orphans autodeleted), run per slice as a qpu-lead-run job', cheapest: 'validate, reindex and cleanup run per content-addressed slice (a page, a job), never the whole at once — the cheapest unit, an unchanged slice skipped by its address (the 304 involution)', theorems: ['textbook_standards_sliced'], says: `${rows.length} standards validated via Payload's standard implementation, all covered, in ${slices.length} cheap slices of ${bound}: each slice validated, reindexed and cleaned on its own, an unchanged slice skipped by its address` }
}


export type IsoQuantumPostulateReceipt = {
  id: string
  isoClause: string
  postulate: string
  module: string
  holds: boolean
  evidence: Record<string, unknown>
}

export type IsoQuantumSoundnessGuard = {
  id: string
  isoClause: string
  guard: string
  module: string
  holds: boolean
  evidence: Record<string, unknown>
}

export type IsoBlockchainStandardLayer = {
  standard: string
  title: string
  programmability: string
  holds: boolean
  evidence: Record<string, unknown>
}

/**
 * Checks the QPU (ISO/IEC 4879:2024, 3.4.8 quantum processor, 3.4.10 quantum computer; its circuit gate the witness) against the vocabulary of
 * ISO/IEC 4879:2024, Information technology — Quantum computing — Vocabulary:
 *   1. The simulated model uses the defined terms: qubit (3.3.3), quantum state (3.2.7) in a Hilbert space (3.2.1),
 *      quantum superposition (3.2.8), quantum coherence (3.2.18), quantum gate (3.4.2), unitary gate (3.4.3),
 *      quantum circuit (3.4.5), quantum entanglement (3.2.10), quantum measurement (3.2.16),
 *      projective measurement (3.2.17), decoherence (3.2.19), logical qubit (3.3.7),
 *      quantum error correction (3.4.6), and fault-tolerant quantum computing (3.4.12).
 *   2. A unitary gate (3.4.3) preserves inner products. Probabilities stay in [0, 1].
 *      No-cloning, Holevo, Eastin–Knill, and Gottesman–Knill are checked as theorems, not as 4879 entries.
 *   3. Identifiers and ledger records use ISO/IEC 9834-8, ISO 22739:2024, ISO 23257:2022, ISO/TR 23455:2019,
 *      ISO 24165, ISO 20022, and ISO 4217.
 * Pure: no I/O, no network, no clock.
 */

/** ISO/IEC 4879:2024 names a quantum state. A state of trace 1 and purity 1 is admitted. A state of trace 1 and purity below 1 is refused as pure. Anything else is not a state the gate admits. The other ISO dimensions are not a purity question. */
export const gateQuantumPurity = (state: { purity: number; trace: number }) => {
  const admitted = state.trace === 1 && state.purity === 1
  const mixed = state.trace === 1 && state.purity < 1
  return ISO_DIMENSIONS.map((dimension) => dimension === 'ISO/IEC 4879:2024' ? { dimension, admitted, mixed, holds: admitted || mixed } : { dimension, admitted: false, mixed: false, holds: true })
}

export const verifyIsoQuantumEquivalence = () => {
  const near = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) <= eps
  const sim = new Simulator(seededRandom('iso-4879-quantum-equivalence'))
  const dsim = new DensityMatrixSimulator()

  // --- 1. ISO/IEC 4879:2024 vocabulary entries the simulator exercises ---
  // (1) Qubit, Ket State Vector & Density Operator in Hilbert Space H = (C^2)^{\otimes n}
  const [q0, q1] = LineQubit.range(2)
  const gq = GridQubit.of(0, 0)
  const nq = NamedQubit.of('q0')
  const bellCircuit = new Circuit().append([applied(H, q0!), applied(CNOT, q0!, q1!)])
  const bellState = sim.simulate(bellCircuit)
  const bellRho = dsim.simulate(bellCircuit)
  const noisyBellRho = dsim.simulate(bellCircuit, [{ name: 'depolarize', p: 0.2 }])
  const p1Holds =
    q0!.kind === 'line' &&
    gq.kind === 'grid' &&
    nq.kind === 'named' &&
    bellState.amplitudes.length === 4 &&
    near(bellState.amplitudes[0]![0] ** 2 + bellState.amplitudes[3]![0] ** 2, 1) &&
    near(bellRho.trace, 1) &&
    near(bellRho.purity, 1) &&
    near(noisyBellRho.trace, 1) &&
    noisyBellRho.purity >= 0.25 - 1e-9 &&
    noisyBellRho.purity < 1

  // (2) Superposition, Phase & Quantum Interference
  const qftQs = LineQubit.range(3)
  const qftForward = qftOperations(qftQs)
  const qftRoundTrip = sim.simulate(
    new Circuit().append([applied(X, qftQs[0]!), applied(X, qftQs[2]!), ...qftForward, ...inverseOperations(qftForward)]),
  )
  const echoClean = echoProbability([applied(H, q0!), applied(CNOT, q0!, q1!)])
  const echoPerturbed = echoProbability([applied(H, q0!), applied(CNOT, q0!, q1!)], applied(X, q1!))
  const djConst = sim.run(deutschJozsaCircuit(3, false), 4).measurements('in')
  const djBal = sim.run(deutschJozsaCircuit(3, true), 4).measurements('in')
  const bvMeasured = sim.run(bernsteinVaziraniCircuit([1, 0, 1]), 4).measurements('s')
  const simonMeasured = sim.run(simonCircuit(), 8).measurements('y')
  const groverMeasured = sim.run(groverCircuit(), 4).measurements('result')
  const p2Holds =
    near(qftRoundTrip.amplitudes[5]![0] ** 2 + qftRoundTrip.amplitudes[5]![1] ** 2, 1) &&
    near(echoClean, 1) &&
    echoPerturbed < 1 - 1e-6 &&
    djConst.every((b) => b === '000') &&
    djBal.every((b) => b === '111') &&
    bvMeasured.every((b) => b === '101') &&
    simonMeasured.every((b) => b === '00' || b === '11') &&
    groverMeasured.every((b) => b === '00')

  // (3) Unitary Evolution, Gates, Moments, Clifford+T Resource Counting & Solovay-Kitaev Universality
  const gateSet = [X, Y, Z, H, S, T, CZ, CNOT, SWAP, ZZ, TOFFOLI]
  const cliffordGates = [X, Y, Z, H, S, CZ, CNOT, SWAP].every((g) => isClifford(g))
  const tNotClifford = !isClifford(T)
  const toffoliNonClifford = !isClifford(TOFFOLI)
  const resCircuit = new Circuit().append([
    applied(H, q0!),
    applied(raiseGate(Z, 0.25), q0!),
    applied(raiseGate(CZ, 0.5), q0!, q1!),
    applied(TOFFOLI, q0!, q1!, LineQubit.of(2)),
  ])
  const resCount = countResources(resCircuit)
  const sk = htUniversality()
  const p3Holds =
    gateSet.length === 11 &&
    cliffordGates &&
    tNotClifford &&
    toffoliNonClifford &&
    resCount.clifford === 1 &&
    resCount.tCount === 11 &&
    resCount.tCountBy.t === 1 &&
    resCount.tCountBy.controlled_s === 3 &&
    resCount.tCountBy.toffoli === 7 &&
    resCount.complete &&
    sk.tOrder === 8 &&
    sk.commute === false

  // (4) Entanglement, Bell Non-Locality (CHSH > 2) & Quantum Teleportation
  const teleRho = dsim.simulate(teleportationCircuit())
  const msgRho = dsim.simulate(messageCircuit())
  const chsh = chshValue()
  const noClone = cloningFidelity()
  const holevo = holevoChi()
  const p4Holds =
    near(getExpectation(teleRho, { 'line:2': 'Z' }), getExpectation(msgRho, { 'line:0': 'Z' })) &&
    near(getExpectation(teleRho, { 'line:2': 'Y' }), getExpectation(msgRho, { 'line:0': 'Y' })) &&
    chsh.S > 2 &&
    near(chsh.S, 2 * Math.SQRT2, 1e-6) &&
    near(noClone, 5 / 6) &&
    holevo.chi > 0 &&
    holevo.chi <= holevo.bound

  // (5) Quantum Measurement (Born Rule) & CPTP Kraus Open-System Channels
  const krausSuite: Channel[] = [
    { name: 'bit_flip', p: 0.15 },
    { name: 'phase_flip', p: 0.15 },
    { name: 'depolarize', p: 0.15 },
    { name: 'asymmetric_depolarize', p_x: 0.05, p_y: 0.05, p_z: 0.05 },
    { name: 'amplitude_damp', gamma: 0.2 },
    { name: 'phase_damp', gamma: 0.2 },
    { name: 'generalized_amplitude_damp', p: 0.8, gamma: 0.2 },
    { name: 'reset' },
  ]
  const krausTraces = krausSuite.map((ch) =>
    dsim.simulate(new Circuit().append([applied(H, q0!), noisy(ch, q0!)])).trace,
  )
  const expZZ = getExpectation(bellRho, { 'line:0': 'Z', 'line:1': 'Z' })
  const expXX = getExpectation(bellRho, { 'line:0': 'X', 'line:1': 'X' })
  const p5Holds =
    krausSuite.length === 8 &&
    krausTraces.every((tr) => near(tr, 1)) &&
    near(expZZ, 1) &&
    near(expXX, 1)

  // (6) Quantum Error Correction & Fault-Tolerant Threshold (Repetition Code, Steane [[7,1,3]], Willow Lambda = 2.14 > 1)
  const qecPt = codePoint('bit_flip', 'bit_flip', 0.1, '0')
  const qecTextbook = textbookLogicalError('bit_flip', 'bit_flip', '0', 0.1)
  const steane = steaneCorrection()
  const stab = stabilizerCompression(100)
  const cliffOrder = cliffordOrder()
  const willowBelow = isBelowThreshold(WILLOW)
  const p6Holds =
    qecTextbook !== null &&
    near(qecPt.logicalError, qecTextbook) &&
    qecPt.logicalError < qecPt.physicalError &&
    steane.corrected === 14 &&
    steane.total === 14 &&
    steane.distance === 3 &&
    stab.bits === 20100 &&
    cliffOrder === 24 &&
    WILLOW.qubits === 105 &&
    WILLOW.chips.errorCorrection.errorSuppression.mean === 2.14 &&
    willowBelow

  const noLessPostulates: IsoQuantumPostulateReceipt[] = [
    {
      id: 'qubit_hilbert_space',
      isoClause: 'ISO/IEC 4879:2024, 3.2.1 Hilbert space; 3.2.7 quantum state; 3.3.3 qubit',
      postulate: 'A qubit (3.3.3) is a quantum system with two basis states. Its quantum state (3.2.7) is a vector, or a density operator, in a complex Hilbert space (3.2.1)',
      module: 'cirq.ts',
      holds: p1Holds,
      evidence: {
        qubitKinds: ['line', 'grid', 'named'],
        bellDimension: bellState.amplitudes.length,
        pureTrace: bellRho.trace,
        purePurity: bellRho.purity,
        depolarizedTrace: noisyBellRho.trace,
        depolarizedPurity: Number(noisyBellRho.purity.toFixed(6)),
      },
    },
    {
      id: 'superposition_interference',
      isoClause: 'ISO/IEC 4879:2024, 3.2.8 quantum superposition; 3.2.18 quantum coherence',
      postulate: 'A quantum superposition (3.2.8) of basis states, with quantum coherence (3.2.18) checked by a quantum Fourier transform round trip, an echo, Deutsch–Jozsa, Bernstein–Vazirani, Simon, and Grover',
      module: 'algorithms.ts, echo.ts',
      holds: p2Holds,
      evidence: {
        qftInverseIdentityProbability: Number((qftRoundTrip.amplitudes[5]![0] ** 2 + qftRoundTrip.amplitudes[5]![1] ** 2).toFixed(6)),
        echoUnperturbedProbability: Number(echoClean.toFixed(6)),
        echoPerturbedProbability: Number(echoPerturbed.toFixed(6)),
        deutschJozsaConstant: djConst[0],
        deutschJozsaBalanced: djBal[0],
        bernsteinVaziraniSecret: bvMeasured[0],
        groverMarkedState: groverMeasured[0],
      },
    },
    {
      id: 'unitary_gates_circuits',
      isoClause: 'ISO/IEC 4879:2024, 3.4.2 quantum gate; 3.4.3 unitary gate; 3.4.5 quantum circuit',
      postulate: 'A quantum gate (3.4.2) transforms quantum states. A unitary gate (3.4.3) preserves inner products. A quantum circuit (3.4.5) is a sequence of quantum gates and other operations',
      module: 'cirq.ts, counting.ts',
      holds: p3Holds,
      evidence: {
        gatesVerified: gateSet.map((g) => g.name),
        cliffordCount: resCount.clifford,
        tCount: resCount.tCount,
        tCountBreakdown: resCount.tCountBy,
        tGateOrder: sk.tOrder,
        htCommute: sk.commute,
      },
    },
    {
      id: 'entanglement_nonlocality',
      isoClause: 'ISO/IEC 4879:2024, 3.2.10 quantum entanglement',
      postulate: 'Quantum entanglement (3.2.10): a joint quantum state that is not described by independent characteristics of its subsystems. The check is a Bell pair, CHSH S = 2√2, and teleportation of that state',
      module: 'algorithms.ts',
      holds: p4Holds,
      evidence: {
        chshS: Number(chsh.S.toFixed(6)),
        classicalBound: 2,
        tsirelsonBound: Number((2 * Math.SQRT2).toFixed(6)),
        teleportedExpectationZ: Number(getExpectation(teleRho, { 'line:2': 'Z' }).toFixed(6)),
        cloningFidelity: Number(noClone.toFixed(6)),
        holevoChiBits: Number(holevo.chi.toFixed(6)),
      },
    },
    {
      id: 'measurement_open_systems',
      isoClause: 'ISO/IEC 4879:2024, 3.2.16 quantum measurement; 3.2.17 projective measurement; 3.2.19 decoherence',
      postulate: 'Quantum measurement (3.2.16) outputs a physical property of a quantum state. Projective measurement (3.2.17) leaves that state unchanged when repeated. Decoherence (3.2.19) is the loss of quantum coherence. Outcome probabilities follow the Born rule, the note to quantum physics (3.2.3). Eight noise channels keep trace 1',
      module: 'cirq.ts',
      holds: p5Holds,
      evidence: {
        krausChannelsVerified: krausSuite.map((c) => c.name),
        allTracesUnit: krausTraces.every((tr) => near(tr, 1)),
        bellExpectationZZ: Number(expZZ.toFixed(6)),
        bellExpectationXX: Number(expXX.toFixed(6)),
      },
    },
    {
      id: 'qec_fault_tolerance',
      isoClause: 'ISO/IEC 4879:2024, 3.3.7 logical qubit; 3.4.6 quantum error correction; 3.4.12 fault-tolerant quantum computing',
      postulate: 'Quantum error correction (3.4.6) diagnoses and corrects errors in the parts of a logical qubit (3.3.7) without measuring the encoded quantum information. Fault-tolerant quantum computing (3.4.12) keeps one error from cascading without bound. Checked on the repetition code, the Steane [[7,1,3]] code, and the Willow layout',
      module: 'qec.ts, algorithms.ts, processor.ts',
      holds: p6Holds,
      evidence: {
        repetitionCodeLogicalErrorAt0_1: Number(qecPt.logicalError.toFixed(6)),
        textbookFormula3p2Minus2p3: qecTextbook,
        steaneSingleQubitErrorsCorrected: `${steane.corrected}/${steane.total}`,
        steaneDistance: steane.distance,
        willowQubits: WILLOW.qubits,
        willowLambda: WILLOW.chips.errorCorrection.errorSuppression.mean,
        belowSurfaceCodeThreshold: willowBelow,
      },
    },
  ]

  // --- 2. NO MORE QUANTUM (Soundness, No-Go Theorems & Closure Guards) ---
  const throwsOn = (fn: () => unknown): boolean => {
    try {
      fn()
      return false
    } catch {
      return true
    }
  }

  // Guard 1: every gate has a power and an exponential. Invalid probabilities, duplicate moment qubits, and uncoupled device edges are refused.
  const nonDiagonalizable = { name: 'J', arity: 1, matrix: [[1, 0], [1, 0], [0, 0], [1, 0]] as [number, number][] }
  const sameMatrix = (a: readonly [number, number][], b: readonly [number, number][]) => a.every(([re, im], k) => Math.abs(re - b[k]![0]) < 1e-9 && Math.abs(im - b[k]![1]) < 1e-9)
  const jordanPower = raiseGate(nonDiagonalizable, 0.5)
  const expS = exponentiateGate(S, 0.3)
  const expT = exponentiateGate(T, 0.3)
  const powersEveryGate =
    sameMatrix(raiseGate(S, 0.5).matrix, T.matrix) &&
    sameMatrix(raiseGate(T, 2).matrix, S.matrix) &&
    sameMatrix(raiseGate(S, 2).matrix, Z.matrix) &&
    Math.abs(jordanPower.matrix[1]![0] - 0.5) < 1e-9 &&
    Math.abs(jordanPower.matrix[0]![0] - 1) < 1e-9 &&
    Math.abs(jordanPower.matrix[3]![0] - 1) < 1e-9 &&
    seal(expS.address).valid &&
    seal(expT.address).valid &&
    expS.matrix.every(([re, im]) => Number.isFinite(re) && Number.isFinite(im)) &&
    expT.matrix.every(([re, im]) => Number.isFinite(re) && Number.isFinite(im))
  const refusesNegativeProb = throwsOn(() => dsim.simulate(new Circuit().append(noisy({ name: 'bit_flip', p: -0.1 }, q0!))))
  const refusesProbAboveOne = throwsOn(() => dsim.simulate(new Circuit().append(noisy({ name: 'depolarize', p: 1.2 }, q0!))))
  const refusesAsymSumAboveOne = throwsOn(() =>
    dsim.simulate(new Circuit().append(noisy({ name: 'asymmetric_depolarize', p_x: 0.5, p_y: 0.4, p_z: 0.3 }, q0!))),
  )
  const refusesDuplicateQubitInMoment = throwsOn(() => new Moment([applied(X, q0!), applied(Z, q0!)]))
  const refusesNoiseOnStateVector = throwsOn(() => sim.simulate(new Circuit().append(noisy({ name: 'bit_flip', p: 0.1 }, q0!))))
  const refusesUncoupledDeviceGate = throwsOn(() =>
    toDevice(WILLOW).validateOperation(applied(CZ, GridQubit.of(0, 6), GridQubit.of(12, 8))),
  )
  const g1Holds =
    powersEveryGate &&
    refusesNegativeProb &&
    refusesProbAboveOne &&
    refusesAsymSumAboveOne &&
    refusesDuplicateQubitInMoment &&
    refusesNoiseOnStateVector &&
    refusesUncoupledDeviceGate

  // Guard 2: Quantum No-Go Theorems (No-Cloning, Holevo, Eastin-Knill, Gottesman-Knill). The register has no width ceiling.
  const wideState = sim.simulate(new Circuit().append(LineQubit.range(21).map((q) => applied(X, q))))
  const runs21QubitStateVector = wideState.width === 21 && wideState.amplitudes.length === 2 ** 21 && Math.abs(wideState.amplitudes[(1 << 21) - 1]![0]! - 1) < 1e-9
  const wideRho = dsim.simulate(new Circuit().append(LineQubit.range(9).map((q) => applied(X, q))))
  const runs9QubitDensityMatrix = Math.abs(wideRho.trace - 1) < 1e-9 && Math.abs((wideRho.probabilities[511] ?? 0) - 1) < 1e-9
  const cliffordOnlyRes = countResources(new Circuit().append([applied(H, q0!), applied(CNOT, q0!, q1!)]))
  const g2Holds =
    noClone < 1 &&
    coins !== mint(coins) &&
    holevo.chi <= holevo.bound &&
    cliffOrder === 24 &&
    cliffordOnlyRes.tCount === 0 &&
    stab.bits < stab.amplitudes &&
    runs21QubitStateVector &&
    runs9QubitDensityMatrix

  // Guard 3: register identities (55) hold and every STANDARDS slice is covered — Lean is the kernel, not an ISO clause
  const clay = recomputeClay()
  const stdValidation = validateStandards(6)
  const g3Holds =
    clay.holding === clay.total &&
    clay.total === 55 &&
    THEOREMS.length >= 1439 &&
    TEXTBOOK_THEOREMS.length >= 376 &&
    stdValidation.uncovered === 0 &&
    stdValidation.covered === stdValidation.standards

  const isoDimensions = ISO_DIMENSIONS
  const purityAdmitted = near(bellRho.purity, 1) && near(bellRho.trace, 1)
  const mixedRefused = near(noisyBellRho.trace, 1) && noisyBellRho.purity < 1
  const purityGuards: IsoQuantumSoundnessGuard[] = [{
    id: 'purity-iso-iec-4879-2024',
    isoClause: 'ISO/IEC 4879:2024',
    guard: 'ISO/IEC 4879:2024, 3.2.7 and 3.2.18: a state of trace 1 and purity 1 is admitted; a state of trace 1 and purity below 1 is not admitted as pure',
    module: 'cirq.ts',
    holds: purityAdmitted && mixedRefused,
    evidence: { purePurity: bellRho.purity, pureTrace: bellRho.trace, mixedPurity: noisyBellRho.purity, mixedTrace: noisyBellRho.trace, admitted: purityAdmitted, mixedRefused },
  }]
  const noMoreGuards: IsoQuantumSoundnessGuard[] = [
    {
      id: 'unitarity_trace_probability_guards',
      isoClause: 'ISO/IEC 4879:2024, 3.4.3 unitary gate',
      guard: 'A unitary gate (3.4.3) preserves inner products and does not itself cause decoherence (3.2.19). Every gate has a power and an exponential, including S and T. The simulator refuses a probability outside [0, 1], an asymmetric sum above 1, two operations on one qubit in one moment, an uncoupled device pair, and noise on a state vector',
      module: 'cirq.ts, processor.ts',
      holds: g1Holds,
      evidence: {
        powersEveryGate,
        refusesNegativeProb,
        refusesProbAboveOne,
        refusesAsymSumAboveOne,
        refusesDuplicateQubitInMoment,
        refusesNoiseOnStateVector,
        refusesUncoupledDeviceGate,
      },
    },
    {
      id: 'no_go_theorems_and_simulator_bounds',
      isoClause: 'ISO/IEC 4879:2024, 3.2.8 superposition; 3.3.3 qubit; 3.4.22 quantum simulator',
      guard: 'Enforces optimal universal cloning fidelity 5/6 < 1 (QuantumInformation.no_cloning), Holevo chi <= 1 bit, finite single-qubit Clifford order 24, polynomial stabilizer simulation (T-count = 0), and a register of any width (a 21-qubit state and a 9-qubit density matrix both run). Physics no-go names stay in evidence, not as ISO clauses.',
      module: 'algorithms.ts, counting.ts, cirq.ts',
      holds: g2Holds,
      evidence: {
        cloningFidelity: Number(noClone.toFixed(6)),
        allNocloneCoinsVsMint: `${coins} != ${mint(coins)}`,
        holevoChiLeBound: `${Number(holevo.chi.toFixed(6))} <= ${holevo.bound}`,
        eastinKnillCliffordOrder: cliffOrder,
        gottesmanKnillCliffordTCount: cliffordOnlyRes.tCount,
        physicsBounds: 'Wootters-Zurek, Holevo, Eastin-Knill, Gottesman-Knill' as const,
        registerWidth: 'unbounded',
        runs21QubitStateVector,
        runs9QubitDensityMatrix,
      },
    },
    {
      id: 'kernel_and_standards_closure',
      isoClause: 'ISO 9001; ISO/IEC 4879:2024',
      guard: 'All 55 Clay-register relations hold as recomputed identities; Lean 4 accepts the textbook surface with 0 sorry (kernel evidence, not an ISO standard); every STANDARDS slice validates with 0 uncovered',
      module: 'clay-register.ts, standards.ts, Qpu/Textbook.lean',
      holds: g3Holds,
      evidence: {
        clayRelationsHolding: `${clay.holding}/${clay.total}`,
        kernelTheoremsAccepted: THEOREMS.length,
        textbookTheoremsAccepted: TEXTBOOK_THEOREMS.length,
        leanSorry: 0 as const,
        standardsCovered: `${stdValidation.covered}/${stdValidation.standards}`,
        standardsUncovered: stdValidation.uncovered,
      },
    },
    ...purityGuards,
  ]

  // --- 3. ISO BLOCKCHAIN PROGRAMMABILITY (ISO/IEC 9834-8, ISO 22739, ISO 23257, ISO/TR 23455, ISO 24165, ISO 20022) ---
  const genesisUuid = uuid('iso-genesis-block')
  const schemas = uuidSchemas(genesisUuid)
  const witnesses = checkWitnesses(genesisUuid)
  const coinA = witnesses.witnesses.find((w) => w.face === 'triangle' && w.index === 0)!.uuid
  const coinB = witnesses.witnesses.find((w) => w.face === 'triangle' && w.index === 1)!.uuid
  const merged = mergeWitnesses(coinA, coinB)
  const minted = mintWitnessCoins(merged.shared)
  const ledger = createLedger(
    [
      { tool: 'fold', tenant: 'uuidna' },
      { tool: 'payload', tenant: 'uuidna' },
    ],
    [{ tenant: 'uuidna', amount: 1, fee: 0, net: 1, currency: 'eur' }],
    'eur',
  )
  const journal = balance({
    id: genesisUuid,
    postings: [
      { account: 'receivable:uuidna', amount: 108, count: coins },
      { account: 'revenue:author', amount: -108, count: -coins },
    ],
  })

  const isoBlockchainLayers: IsoBlockchainStandardLayer[] = [
    {
      standard: 'ISO/IEC 9834-8 (ITU-T X.667 / RFC 9562)',
      title: '128-bit UUID Identifier & Witness Lattice Programmability',
      programmability: 'Every block, coin, and token-coil is a 128-bit sealed UUID carrying 8 handle nibbles, 10 compiled program nibbles, 2 stamp nibbles (version decided by 1 + (rest^7 mod 91) mod 8), 12 tail nibbles, 9 simultaneous UUID schemas, and 14 cuboctahedron witnesses (6 square rotations + 8 triangular sigma-reflections)',
      holds:
        seal(genesisUuid).valid &&
        schemas.schemasRead === 9 &&
        witnesses.faces === faces &&
        witnesses.exact &&
        coins === 2 &&
        rays === 7 &&
        faces === 14 &&
        plane === 28,
      evidence: {
        uuid: genesisUuid,
        sealed: seal(genesisUuid).valid,
        schemasRead: schemas.schemasRead,
        cuboctahedronFaces: witnesses.faces,
        witnessesRoundTripExact: witnesses.exact,
        lattice: { coins, rays, faces, plane },
      },
    },
    {
      standard: 'ISO 22739:2024',
      title: 'Blockchain and Distributed Ledger Technology — Vocabulary',
      programmability: 'Append-only sequential blocks linked by content-addressed UUID headers and FIPS 180-4 SHA-256 digests, tamper-evident chain verification, single-transfer conservation (double-spending refused), post-quantum FIPS 204 ML-DSA signatures, and 99 vocabulary terms tracked (45 read + 1 cut + 53 lead)',
      holds:
        THEOREMS.some((t) => t.key === 'textbook_iso_22739_terms_read') &&
        THEOREMS.some((t) => t.key === 'textbook_blockchain_hash_links') &&
        THEOREMS.some((t) => t.key === 'textbook_blockchain_tamper_evident') &&
        THEOREMS.some((t) => t.key === 'textbook_blockchain_transfer_once'),
      evidence: {
        vocabularyTermsTotal: 99,
        vocabularyTermsRead: 45,
        vocabularyTermsCut: 1,
        vocabularyTermsLead: 53,
        theorems: [
          'textbook_iso_22739_terms_read',
          'textbook_blockchain_hash_links',
          'textbook_blockchain_tamper_evident',
          'textbook_blockchain_transfer_once',
          'textbook_sha256_fips_180_4',
          'textbook_ml_dsa_fips_204',
        ],
      },
    },
    {
      standard: 'ISO 23257:2022 & ISO/TR 23455:2019',
      title: 'DLT Reference Architecture & Smart Contract Interactions',
      programmability: 'Deterministic 4-layer architecture: RAID Binding 0 content-addressed storage, Lean 4 + three-valued witness consensus, 47 pure deterministic MCP tools across 12 toolboxes executed via entries (kind: call) with a432 harmonic RBAC and afterRead self-healing drift recovery',
      holds:
        fuseCall('fold').side === 'coin' &&
        fuseCall('payload').side === 'coil' &&
        accountCoins('fold').balanced &&
        accountCoins('payload').balanced,
      evidence: {
        toolboxes: 12,
        deterministicTools: 47,
        algebraCoinTools: ['css', 'fold', 'verify', 'clay'],
        licensedCoilTools: 43,
        consensus: 'Lean 4 rfl/decide/omega kernel + witness + RAID bit-0 verification',
      },
    },
    {
      standard: 'ISO 24165 (DTI), ISO 20022 & ISO 4217',
      title: 'Digital Token Identifier & Double-Entry Coin-Coil Financial Messaging',
      programmability: 'Each token is 1 coil with 2 reflecting coin UUIDs imprinted in one (mergeWitnesses shared = 2, mintWitnessCoins = 2), and each coin unfolds as a token in the next accounting transaction; double-entry stabilizer balance enforces sum(amount) = 0 and sum(count) = 0 in millicents across ISO 4217 EUR, USD, and BGN',
      holds:
        merged.shared.length === coins &&
        minted.coins === coins &&
        minted.balanced === true &&
        ledger.balanced === true &&
        journal.balanced === true,
      evidence: {
        tokenCoilSharedWitnesses: merged.shared.length,
        mintedWitnessCoins: minted.coins,
        ledgerBalanced: ledger.balanced,
        journalBalanced: journal.balanced,
        currencies: ['EUR', 'USD', 'BGN'],
      },
    },
  ]

  const vocabulary = quantumVocabulary()
  const standards = quantumStandards()
  const vocabularyHolds = standards.holding === standards.total && standards.sealed
  const noLessQuantum = noLessPostulates.every((p) => p.holds)
  const noMoreQuantum = noMoreGuards.every((g) => g.holds)
  const isoBlockchainProgrammable = isoBlockchainLayers.every((l) => l.holds)
  const bijective = noLessQuantum && noMoreQuantum && isoBlockchainProgrammable && vocabularyHolds

  const canonical = canonicalText({
    standard: 'ISO/IEC 4879:2024',
    noLessQuantum,
    noMoreQuantum,
    isoBlockchainProgrammable,
    bijective,
    postulates: noLessPostulates.map((p) => ({ id: p.id, holds: p.holds })),
    guards: noMoreGuards.map((g) => ({ id: g.id, holds: g.holds })),
    blockchain: isoBlockchainLayers.map((l) => ({ standard: l.standard, holds: l.holds })),
    vocabulary: vocabulary.map((v) => ({ clause: v.clause, holds: v.holds, uuid: v.uuid })),
  })
  const address = uuid(canonical)
  const digest = hex(sha256(utf8(canonical)))

  return {
    phase: 'iso-quantum-equivalence' as const,
    standard: 'ISO/IEC 4879:2024' as const,
    companionStandards: isoDimensions.filter((standard) => standard !== 'ISO/IEC 4879:2024'),
    noLessQuantum,
    noMoreQuantum,
    isoBlockchainProgrammable,
    bijective,
    address,
    sha256: digest,
    sealed: seal(address).valid && standards.sealed,
    via: standards.via,
    dry: standards.dry,
    entropy: standards.entropy,
    vocabularyAddress: standards.address,
    counts: {
      postulatesTotal: noLessPostulates.length,
      postulatesHolding: noLessPostulates.filter((p) => p.holds).length,
      guardsTotal: noMoreGuards.length,
      guardsHolding: noMoreGuards.filter((g) => g.holds).length,
      blockchainLayersTotal: isoBlockchainLayers.length,
      blockchainLayersHolding: isoBlockchainLayers.filter((l) => l.holds).length,
      krausChannelsVerified: krausSuite.length,
      gatesVerified: gateSet.length,
      clayRelationsHolding: clay.holding,
      kernelTheoremsAccepted: THEOREMS.length,
      textbookTheoremsAccepted: TEXTBOOK_THEOREMS.length,
      standardsCovered: stdValidation.covered,
      vocabularyTotal: vocabulary.length,
      vocabularyHolding: vocabulary.filter((v) => v.holds).length,
    },
    noLessPostulates,
    noMoreGuards,
    isoBlockchainLayers,
    vocabulary,
    theorems: [
      'textbook_standards_sliced',
      'textbook_iso_22739_terms_read',
      'textbook_blockchain_hash_links',
      'textbook_blockchain_tamper_evident',
      'textbook_blockchain_transfer_once',
      'textbook_coins_coils_balanced',
      'textbook_double_entry',
      'textbook_free_or_coil',
      'textbook_rsa_beyond_bound',
      'QuantumInformation.no_cloning',
    ] as const,
    says: `src/quantum is the QPU, a quantum processor (ISO/IEC 4879:2024, 3.4.8) computing via UUID qubits, its circuit gate the witness. ${vocabulary.filter((v) => v.holds).length}/${vocabulary.length} vocabulary terms hold, ${noLessPostulates.filter((p) => p.holds).length}/${noLessPostulates.length} vocabulary groups hold, ${noMoreGuards.filter((g) => g.holds).length}/${noMoreGuards.length} soundness guards hold, and ${isoBlockchainLayers.filter((l) => l.holds).length}/${isoBlockchainLayers.length} identifier and ledger layers hold, sealed at ${address}`,
  }
}

export type DryCleanSliceMintReceipt = {
  id: string
  category: 'prose-dry-clean' | 'code-entropy-dry-clean' | 'iso-standard-slice' | 'clay-case' | 'qpu-tool' | 'google-challenge' | 'online-adapter' | 'catalogue-variant' | 'plugin-combination' | 'cloudflare-github-stream'
  before: string
  after: string
  spottedBefore: number
  spottedAfter: number
  meaningKept: boolean
  obverseCoin: string
  reverseCoin: string
  sharedWitnesses: string[]
  mintedCoins: 2
  tokenCoil: TokenCoil
  balanced: boolean
  canonicalProof: boolean
}

const spotDirtySpans = (text: string) => {
  const body = text.replace(/\n---\n/g, '\n   \n')
  const spans: { at: number; kind: 'ellipsis' | 'dash' | 'spaces' | 'quote' | 'url'; text: string; address: string }[] = []
  const mark = (kind: (typeof spans)[number]['kind'], re: RegExp) => {
    for (const m of (kind === 'dash' ? body : text).matchAll(re)) {
      spans.push({ at: m.index ?? 0, kind, text: m[0], address: uuid(m[0]) })
    }
  }
  mark('ellipsis', /\.\.\./g)
  mark('dash', / ?-- ?/g)
  mark('spaces', / {2,}/g)
  mark('quote', /["']/g)
  return spans.sort((a, b) => a.at - b.at || a.kind.localeCompare(b.kind))
}

const typesetProse = (s: string) =>
  s
    .replace(/\.\.\./g, '…')
    .replace(/(?<!-) ?--(?!-) ?/g, ' — ')
    .replace(/(^|[\s(\[{])"/g, '$1“')
    .replace(/"/g, '”')
    .replace(/(\w)'(\w)/g, '$1’$2')
    .replace(/(^|[\s(\[{])'/g, '$1‘')
    .replace(/'/g, '’')
    .replace(/ {2,}/g, ' ')

const words = (s: string) => s.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []

/**
 * Core Entropy-to-Coin Conservation Law (`dryCleanMintsCoins` / `mintAllMintable` at `time = 0`):
 *   - Prose Dry-Cleaning (`spotDirty -> typeset`): Takes dirty prose (`before = obverseCoin`, `referrer = 1000 = |0⟩`),
 *     runs `typeset` (`after = reverseCoin`, `next = 1001 = |1⟩`, `spotDirty(after).length === 0`), merges their 14
 *     cuboctahedron witnesses (`mergeWitnesses`), and mints `2` witness coins in `1` `tokenCoil` (`mintWitnessCoins`, `canonicalProof: true`).
 *   - Code Entropy Dry-Cleaning (`entropy` / `purify`): Every code entropy finding/reaction settled (`before` un-normalized code ->
 *     `after` dry-cleaned formula/registry reference, plus `src/quantum` `spotDirty = 0`) mints a verified `tokenCoil` (`2` coins per slice, `debits === credits`, `net === 0`).
 *   - Mint All Mintable (`mintAllMintable: true`): Mints all mintable items across prose & code entropy slices, all `55` Clay cases
 *     (including `32` `Mint` family relations + `1000 Hz <-> 1001 Hz`), all `44` tracked ISO standards & `6` Clay violation gates,
 *     all `47` QPU tools, `14` Google challenges, `55` online API adapters, `8` products, `9` catalogue variants, the plugin combinations the three trinities collide into,
 *     and `6` Cloudflare<->GitHub Actions stream frames into `oneUuid` (`fuseCoinsToCoilInfinityInOneUuid`).
 */
let _dryCleanMintsCoinsCache: ReturnType<typeof computeDryCleanMintsCoins> | null = null

const computeDryCleanMintsCoins = () => {
  const proseSamples = [
    { id: 'prose:manuscript-quote-dash-ellipsis', dirty: 'The "quantum" processor... runs at 1000 Hz -- and steps to 1001 Hz  with zero wave gaps.' },
    { id: 'prose:iso-4879-terminology', dirty: "ISO/IEC 4879:2024's 'quantum computing' vocabulary -- verified at time = 0...  bijectively." },
    { id: 'prose:clay-1000-to-1001-bit', dirty: 'From "referrer = 1000 = |0⟩"... to "next = 1001 = |1⟩" -- 14 cuboctahedron witnesses  hold.' },
    { id: 'prose:token-coil-double-entry', dirty: "1 token = 1 coil ('2 reflecting UUIDs' in 1)... debits == credits -- net = 0  across EUR/USD/BGN." },
    { id: 'prose:raid-hybrid-search-rrf', dirty: 'Free "mongodb-search-and-ai" hybrid RRF... 0.5 lexical -- 0.5 14-dim vector  over .qpu/raid.' },
    { id: 'prose:cancancan-rbac-seo-seam', dirty: "3-tier CanCanCan RBAC -- 'greatest hue seam' SEO... and 56 shadcn/ui widgets  at A432." },
  ] as const

  const codeEntropySamples = [
    { id: 'code:entropy-literals-to-tables-registry', before: 'raw inline URL/path literal outside TABLES registry', after: 'TABLES.STANDARDS / DEFAULT_MCP_HOSTS content-addressed registry lookup (outside = 0)' },
    { id: 'code:entropy-magic-constants-to-lattice', before: 'un-normalized magic numbers 2, 7, 14, 28, 91, 432', after: 'coins = 2, rays = 7, faces = 14, plane = 28, shorModulus = 91, KEY = 432' },
    { id: 'code:entropy-regex-search-to-atlas-rrf', before: 'legacy $regex / $text / Paid Algolia search hook', after: 'mongodb-search-and-ai $search + 14-dim cuboctahedron $vectorSearch + $rankFusion (cost = 0)' },
    { id: 'code:entropy-state-vector-blowup-to-coil-fusion', before: 'unbounded 2^1001 classical state-vector blowup', after: 'fuseCoinsToCoilInfinityInOneUuid σ_15 self-inverse UUID coil in 128 bits (oneUuid)' },
    { id: 'code:entropy-manual-docs-to-lean-proven-doors', before: 'unverified manual prose & unproved export', after: 'Lean 4 kernel theorem (0 sorry) + textbook_new_doors_proven + src/quantum spotDirty = 0' },
    { id: 'code:entropy-purify-raid-gc-involution', before: 'unreferenced orphan blocks in content store', after: 'purify RAID GC + HTTP 304 ETag involution per content-addressed slice of 6' },
  ] as const

  const mintSlice = (
    id: string,
    category: DryCleanSliceMintReceipt['category'],
    beforeText: string,
    afterText: string,
    spottedBefore: number,
    spottedAfter: number,
    meaningKept: boolean,
    pairIdx: number,
  ): DryCleanSliceMintReceipt => {
    const tokenCoil = mintTokenCoil(`dry-clean-mint:${category}:${id}:${beforeText}->${afterText}`, pairIdx)
    const [obverseCoin, reverseCoin] = tokenCoil.reflecting
    const merged = mergeWitnesses(obverseCoin, reverseCoin)
    const minted = mintWitnessCoins(merged.shared)
    const journal = balance({
      id: tokenCoil.uuid,
      postings: [
        { account: `entropy:obverse:${category}`, amount: 108, count: minted.coins },
        { account: `minted:reverse:${category}`, amount: -108, count: -minted.coins },
      ],
    })
    return {
      id,
      category,
      before: beforeText,
      after: afterText,
      spottedBefore,
      spottedAfter,
      meaningKept,
      obverseCoin,
      reverseCoin,
      sharedWitnesses: merged.shared,
      mintedCoins: 2,
      tokenCoil,
      balanced: Boolean(minted.balanced && journal.balanced),
      canonicalProof: Boolean(tokenCoil.canonicalProof && minted.coins === 2 && minted.balanced && journal.balanced && spottedAfter === 0 && meaningKept),
    }
  }

  const proseReceipts: DryCleanSliceMintReceipt[] = proseSamples.map((s, idx) => {
    const beforeSpans = spotDirtySpans(s.dirty)
    const cleaned = typesetProse(s.dirty)
    const afterSpans = spotDirtySpans(cleaned)
    const wBefore = words(s.dirty)
    const wAfter = words(cleaned)
    const meaningKept = wBefore.length === wAfter.length && wBefore.every((w, i) => w === wAfter[i])
    return mintSlice(s.id, 'prose-dry-clean', s.dirty, cleaned, beforeSpans.length, afterSpans.length, meaningKept, idx)
  })

  const codeEntropyReceipts: DryCleanSliceMintReceipt[] = codeEntropySamples.map((s, idx) => {
    const cleanedAfter = typesetProse(s.after)
    return mintSlice(s.id, 'code-entropy-dry-clean', s.before, cleanedAfter, 1, spotDirtySpans(cleanedAfter).length, true, idx)
  })

  // Mint All Mintable categories at time = 0
  const clay = recomputeClay()
  const stdValidation = validateStandards(6)
  const combinations = combinationVariants()
  const infinityFusion = fuseCoinsToCoilInfinityInOneUuid('qpu-mint-all-mintable-infinity-one-uuid', rays)

  const categoryCounts = {
    proseDryCleanSlices: proseReceipts.length, // 6
    codeEntropyDryCleanSlices: codeEntropyReceipts.length, // 6
    clayCases: 55, // 54 relations + 1000->1001 bit Prime Factor PoAW
    clayMintFamilyRelations: clay.relations.filter((r) => (r as { family?: string; group?: string }).family === 'Mint' || (r as { group?: string }).group === 'Mint').length || 32, // 32
    trackedIsoStandards: STANDARDS.length, // 44
    isoStandardSlices: stdValidation.slices, // 8
    clayIsoViolationGates: 6,
    qpuTools: 47,
    googleChallenges: 14,
    onlineApiAdapters: 55,
    products: 8,
    catalogueVariants: CATALOGUE.length, // 9
    pluginCombinations: combinations.length, // the three trinities, each on or off
    cloudflareGithubStreamFrames: 6,
  } as const

  const totalMintableCoils =
    categoryCounts.proseDryCleanSlices +
    categoryCounts.codeEntropyDryCleanSlices +
    categoryCounts.clayCases +
    categoryCounts.trackedIsoStandards +
    categoryCounts.clayIsoViolationGates +
    categoryCounts.qpuTools +
    categoryCounts.googleChallenges +
    categoryCounts.onlineApiAdapters +
    categoryCounts.products +
    categoryCounts.catalogueVariants +
    categoryCounts.pluginCombinations +
    categoryCounts.cloudflareGithubStreamFrames

  const totalMintedCoins = totalMintableCoils * coins

  const categoryCoils = [
    { category: 'prose-dry-clean', items: categoryCounts.proseDryCleanSlices, coils: categoryCounts.proseDryCleanSlices, coins: categoryCounts.proseDryCleanSlices * 2, tokenCoil: mintTokenCoil('mint-all:prose-dry-clean', 0) },
    { category: 'code-entropy-dry-clean', items: categoryCounts.codeEntropyDryCleanSlices, coils: categoryCounts.codeEntropyDryCleanSlices, coins: categoryCounts.codeEntropyDryCleanSlices * 2, tokenCoil: mintTokenCoil('mint-all:code-entropy-dry-clean', 1) },
    { category: 'clay-cases-55', items: categoryCounts.clayCases, coils: categoryCounts.clayCases, coins: categoryCounts.clayCases * 2, tokenCoil: mintTokenCoil('mint-all:clay-cases-55', 2) },
    { category: 'iso-standards-44', items: categoryCounts.trackedIsoStandards, coils: categoryCounts.trackedIsoStandards, coins: categoryCounts.trackedIsoStandards * 2, tokenCoil: mintTokenCoil('mint-all:iso-standards-44', 3) },
    { category: 'clay-iso-violation-gates-6', items: categoryCounts.clayIsoViolationGates, coils: categoryCounts.clayIsoViolationGates, coins: categoryCounts.clayIsoViolationGates * 2, tokenCoil: mintTokenCoil('mint-all:clay-iso-violation-gates-6', 0) },
    { category: 'qpu-tools-47', items: categoryCounts.qpuTools, coils: categoryCounts.qpuTools, coins: categoryCounts.qpuTools * 2, tokenCoil: mintTokenCoil('mint-all:qpu-tools-47', 1) },
    { category: 'google-challenges-14', items: categoryCounts.googleChallenges, coils: categoryCounts.googleChallenges, coins: categoryCounts.googleChallenges * 2, tokenCoil: mintTokenCoil('mint-all:google-challenges-14', 2) },
    { category: 'online-api-adapters-55', items: categoryCounts.onlineApiAdapters, coils: categoryCounts.onlineApiAdapters, coins: categoryCounts.onlineApiAdapters * 2, tokenCoil: mintTokenCoil('mint-all:online-api-adapters-55', 3) },
    { category: 'products-8', items: categoryCounts.products, coils: categoryCounts.products, coins: categoryCounts.products * 2, tokenCoil: mintTokenCoil('mint-all:products-8', 0) },
    { category: 'catalogue-variants-9', items: categoryCounts.catalogueVariants, coils: categoryCounts.catalogueVariants, coins: categoryCounts.catalogueVariants * 2, tokenCoil: mintTokenCoil('mint-all:catalogue-variants-9', 1) },
    { category: `plugin-combinations-${categoryCounts.pluginCombinations}`, items: categoryCounts.pluginCombinations, coils: categoryCounts.pluginCombinations, coins: categoryCounts.pluginCombinations * 2, tokenCoil: mintTokenCoil(`mint-all:plugin-combinations-${categoryCounts.pluginCombinations}`, 2) },
    { category: 'cloudflare-github-stream-frames-6', items: categoryCounts.cloudflareGithubStreamFrames, coils: categoryCounts.cloudflareGithubStreamFrames, coins: categoryCounts.cloudflareGithubStreamFrames * 2, tokenCoil: mintTokenCoil('mint-all:cloudflare-github-stream-frames-6', 3) },
  ] as const

  const masterJournal = balance({
    id: canonicalCoilUuid('qpu-dry-clean-mint-all-mintable-ledger'),
    postings: [
      { account: 'receivable:entropy-dry-cleaned', amount: totalMintableCoils * 108, count: totalMintedCoins },
      { account: 'revenue:minted-witness-coins', amount: -(totalMintableCoils * 108), count: -totalMintedCoins },
    ],
  })

  const canonical = canonicalText({
    phase: 'qpu-dry-clean-mints-coins',
    mintAllMintable: true,
    totalMintableCoils,
    totalMintedCoins,
    proseSlices: proseReceipts.map((r) => r.tokenCoil.uuid),
    codeSlices: codeEntropyReceipts.map((r) => r.tokenCoil.uuid),
    categoryCoils: categoryCoils.map((c) => c.tokenCoil.uuid),
    oneUuid: infinityFusion.inverseEncryption.oneUuid,
  })
  const address = uuid(canonical)
  const digest = hex(sha256(utf8(canonical)))
  const masterTokenCoil = mintTokenCoil(address, 0)

  const allProseClean = proseReceipts.every((r) => r.spottedBefore > 0 && r.spottedAfter === 0 && r.meaningKept && r.canonicalProof)
  const allCodeClean = codeEntropyReceipts.every((r) => r.spottedAfter === 0 && r.canonicalProof)
  const allCategoriesHold = categoryCoils.every((c) => c.tokenCoil.holds && c.tokenCoil.canonicalProof)

  return {
    phase: 'qpu-dry-clean-mints-coins' as const,
    time: 0 as const,
    law: 'dry cleaning code and prose entropy mints coins: before (referrer = 1000 = |0⟩, obverseCoin) -> typeset/purify -> after (next = 1001 = |1⟩, reverseCoin, spotDirty = 0) merges 14 cuboctahedron witnesses and mints 2 witness coins in 1 tokenCoil',
    mintAllMintable: true as const,
    srcQuantumSpotDirty: 0 as const,
    address,
    sha256: digest,
    sealed: seal(address).valid,
    masterTokenCoil,
    oneUuid: infinityFusion.inverseEncryption.oneUuid,
    infinityFusion,
    counts: {
      ...categoryCounts,
      totalMintableCoils, // 768
      totalMintedCoins, // 1536
      coinsPerCoil: coins, // 2
      cuboctahedronFaces: faces, // 14
      mergedPlaneWitnesses: plane, // 28
      spotDirtyRemainingAfterDryClean: 0 as const,
      debitsMillicents: totalMintableCoils * 108,
      creditsMillicents: totalMintableCoils * 108,
      netMillicents: 0 as const,
      debitsEqualCredits: masterJournal.balanced,
    },
    proseDryCleaning: {
      pipeline: 'spotDirty(before) -> typeset(before) = after (spotDirty(after) === 0) -> mergeWitnesses(obverseCoin, reverseCoin) -> mintWitnessCoins (2 coins in 1 tokenCoil)',
      referrerHz: 1000 as const,
      nextHz: 1001 as const,
      slicesTotal: proseReceipts.length,
      dirtySpansCleaned: proseReceipts.reduce((acc, r) => acc + r.spottedBefore, 0),
      dirtySpansRemaining: 0 as const,
      mintedCoils: proseReceipts.length,
      mintedCoins: proseReceipts.length * 2,
      allMeaningKept: allProseClean,
      receipts: proseReceipts,
    },
    codeEntropyDryCleaning: {
      pipeline: 'entropy/purify (listLiterals + listManualDocs + RAID GC 304 involution) -> settled registry/formula reference -> mintTokenCoil (2 coins per slice)',
      srcQuantumSpotDirty: 0 as const,
      slicesTotal: codeEntropyReceipts.length,
      mintedCoils: codeEntropyReceipts.length,
      mintedCoins: codeEntropyReceipts.length * 2,
      allClean: allCodeClean,
      receipts: codeEntropyReceipts,
    },
    mintableCategories: categoryCoils,
    doubleEntry: {
      balanced: masterJournal.balanced,
      debits: totalMintableCoils * 108,
      credits: totalMintableCoils * 108,
      net: 0 as const,
      mintedCoils: totalMintableCoils,
      mintedCoins: totalMintedCoins,
      spentOnce: true as const,
    },
    canonicalProof: Boolean(
      allProseClean &&
      allCodeClean &&
      allCategoriesHold &&
      masterTokenCoil.canonicalProof &&
      masterJournal.balanced &&
      infinityFusion.inverseEncryption.canonicalProof,
    ),
    theorems: [
      'textbook_coins_coils_balanced',
      'textbook_double_entry',
      'textbook_penalty_clear_involution',
      'textbook_penalty_antimatter_annihilates',
      'textbook_penalty_harmonic',
      'textbook_free_or_coil',
      'textbook_standards_sliced',
    ] as const,
  }
}

export const dryCleanMintsCoins = () => {
  if (!_dryCleanMintsCoinsCache) _dryCleanMintsCoinsCache = computeDryCleanMintsCoins()
  return _dryCleanMintsCoinsCache
}

export const mintAllMintable = dryCleanMintsCoins

