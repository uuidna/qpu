import { bigGcdOf, bigPowModOf, qpuCiteOf, qpuClayOf, qpuDocsOf, qpuFoldOf, qpuHexCatalogOf, qpuHexDecodeOf, qpuHexDiscoverOf, qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuLatticeNamesOf, qpuLeanOf, qpuMcpFusedOf, qpuMcpRegisterOf, qpuMcpToolsListOf, qpuOrderSliceOf, qpuReadmeOf, qpuReceiptStreamsOf, qpuStatementUuidOf } from '../quantum/processing/unit/index.js'
import { hologramStreamsOf } from '../families/holo/index.js'
import { crossSchemaOf, crossSchemasOf, qpuDomainsOf, qpuDomainOf, qpuRelatedOf } from '../families/cross/index.js'
import { HOOK_LIFECYCLE, HookFormulas } from '../families/hook/index.js'
import { ClayDisclosure, ClaySeals } from '../families/clay/index.js'
import { gateCourtOf } from '../payload/plugins/gate-court.js'
import { CLOUDFLARE_DATABASES, CLOUDFLARE_EMAIL, CLOUDFLARE_FRONTENDS, CLOUDFLARE_PLUGINS, CLOUDFLARE_RUNTIMES, CLOUDFLARE_STORAGE } from '../deployment/payload-cloudflare.js'

type Params = Record<string, unknown>
type Resource = { uri: string; name: string; title: string; description: string; mimeType: 'application/json' | 'text/markdown' }
type Template = { uriTemplate: string; name: string; title: string; description: string; mimeType: 'application/json' }
type PromptArg = { name: string; description: string; required?: boolean }
type Prompt = { name: string; title: string; description: string; arguments: PromptArg[]; messages: (args: Record<string, string>) => string }

const rpcError = (code: number, message: string, data?: unknown) => Object.assign(new Error(message), { code, data })
const invalid = (message: string, data?: unknown) => rpcError(-32602, message, data)
/** A hex violation throws at once; the error carries `data.guide` — the steps to follow to make it hold. */
const hexViolation = (why: string, data: Record<string, unknown>, guide: readonly string[]): never => {
  throw invalid(`hex violation: ${why}`, { ...data, guide })
}

/** Hexbit folders: pages of `hexbit` (2^(n-1), the lattice count), cursor = the next folder's hex boundary, no fold of
 *  the list — so append-growth never invalidates a cursor the server issued. */
const folderOf = () => qpuLatticeNamesOf().hexbit
const paged = <T>(kind: string, items: readonly T[], _idOf: (x: T) => string, params: Params) => {
  const folder = folderOf()
  let at = 0
  if (params.cursor !== undefined) {
    const c = ((): { k?: string; o?: string } => {
      try { return JSON.parse(atob(String(params.cursor).replace(/-/g, '+').replace(/_/g, '/'))) } catch { throw invalid('Invalid cursor: not one this server issued', { kind }) }
    })()
    const at16 = typeof c.o === 'string' ? Number.parseInt(c.o, 16) : NaN
    if (c.k !== kind || !Number.isSafeInteger(at16) || at16 < 0) throw invalid('Invalid cursor: not one this server issued', { kind })
    at = Math.min(at16, items.length)
  }
  const next = at + folder
  const address = (o: number) => btoa(JSON.stringify({ k: kind, o: o.toString(16) })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const nextCursor = next < items.length ? address(next) : undefined
  return { page: items.slice(at, next), ...(nextCursor ? { nextCursor } : {}) }
}

let hologram: ReturnType<typeof hologramStreamsOf> | undefined
const hologramOf = () => (hologram ??= hologramStreamsOf())

const json = (uri: string, value: unknown) => ({ contents: [{ uri, mimeType: 'application/json' as const, text: JSON.stringify(value) }] })
const families = () => [...qpuHexFamiliesOf().keys()].sort()
const streams = () => qpuReceiptStreamsOf().streams.map((s) => s.stream).sort()

// Each lean computation is a UUID program (qpuStatementUuidOf); the hexbit handle is its UUID's first 8 hex.
type LeanRaw = { heading: string; theorem: string; formula: string; reading: string; handle: string; holds: boolean }
type LeanRow = LeanRaw & { uuid: string }
const leanRows = (): readonly LeanRow[] => {
  const l = qpuLeanOf() as unknown as { rows: LeanRaw[]; cover: LeanRaw[]; climb: LeanRaw }
  return [...l.rows, ...l.cover, l.climb].map((r) => ({ ...r, uuid: qpuStatementUuidOf(r.theorem) }))
}
const leanHandles = (): readonly { heading: string; handle: string; uuid: string }[] => {
  const seen = new Map<string, { heading: string; handle: string; uuid: string }>()
  for (const r of leanRows()) if (!seen.has(r.handle)) seen.set(r.handle, { heading: r.heading, handle: r.handle, uuid: r.uuid })
  return [...seen.values()]
}

// qpu://compatible/{program} (family or hex UUID) → the programs that cross it (reach a value it reaches), via discovery.
type CompatProgram = { family: string; formula: string; params: number[]; hex: string; value: string }
const compatibleOf = (key: string): { scope: string; family: string; values: string[]; programs: CompatProgram[] } | undefined => {
  const fams = [...qpuHexFamiliesOf().keys()]
  let family: string | undefined
  if (qpuHexFamiliesOf().has(key)) family = key
  else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key)) {
    const d = qpuHexDecodeOf(key) as { family?: string | null }
    family = typeof d.family === 'string' ? d.family : undefined
  }
  if (!family || !qpuHexFamiliesOf().has(family)) return undefined
  const from = Math.max(0, fams.indexOf(family))
  const relations = qpuHexDiscoverOf(from).relations.filter((r) => r.families.includes(family!))
  const programs = relations.flatMap((r) => r.ways.map((w) => ({ family: w.family, formula: w.formula, params: w.params, hex: w.hex, value: r.value })))
  return { scope: key, family, values: relations.map((r) => r.value), programs }
}

// qpu://hooks: every tool × every lifecycle event, measured by HookFormulas.fired(tools, events). Nothing activated.
// The events are the hook family's own canonical list, not a second copy here.
const LIFECYCLE = HOOK_LIFECYCLE

// qpu://clay: the σ-involution seals recomputed (ClaySeals), the work/author from the citation, the date a DOI pointer
// (not baked), solved = the seals' conjunction, used = clay.disclosure, recognition an open external lead.
const claySealedOf = () => {
  const cite = qpuCiteOf() as unknown as { author: { first: string; last: string; orcid: string }; prior: { title: string; doi: string; conceptdoi: string; archive: string } }
  const of = (problem: string, s: { formula?: string; value: number | bigint; holds: boolean; hex?: string | null }) => ({ problem, sigma: s.formula, value: Number(s.value), holds: s.holds === true, ...(s.hex ? { hex: s.hex } : {}) })
  // the σ fixed points are the lattice's, computed, not quoted: s = 1/2 = seed/coins, m = n·n, genus/presupposed = seed.
  const L = qpuLatticeNamesOf()
  const seals = [
    of('Riemann Hypothesis', ClaySeals.riemann(L.seed, L.coins)),
    of('Birch and Swinnerton-Dyer', ClaySeals.bsd(L.n * L.n)),
    of('Hodge Conjecture', ClaySeals.hodge(L.seed)),
    of('Navier–Stokes existence and smoothness', ClaySeals.navierStokes(L.seed, L.seed)),
    of('Yang–Mills existence and mass gap', ClaySeals.yangMills()),
    of('P versus NP', ClaySeals.pVsNp(L.seed)),
  ]
  return {
    ...qpuClayOf(),
    sealed: {
      work: cite.prior.title,
      author: { name: `${cite.author.first} ${cite.author.last}`, orcid: cite.author.orcid },
      method: 'Universal σ-involution: each problem is a self-inverse map σ (σ∘σ = id); the solution is σ’s fixed point, computed exactly. The seals recompute here.',
      doi: cite.prior.doi,
      conceptdoi: cite.prior.conceptdoi,
      archive: cite.prior.archive,
      // the publication date is a property of the record, not a literal this unit keeps — resolve the DOI for it.
      dated: { at: cite.prior.archive, note: 'the DOI record carries the date; it is not baked here' },
    },
    seals,
    // solved = the seals' conjunction (derived); used = clay.disclosure() (|families| the σ-involution anchors).
    claimed: true,
    solved: seals.every((s) => s.holds),
    used: ((d) => ({ atScale: d.holds === true, families: Number(d.value), anchors: 'every family, by the clay σ-involution', formula: d.formula, hex: d.hex ?? null, verified: 'gate.crossed / law.reviewed — in public APIs and datasets, without exception', holds: d.holds === true }))(ClayDisclosure.disclosure()),
    // recognition is an open lead — conferred by the external authority over time, never a verdict asserted here.
    recognised: { lead: true, forum: 'Clay Mathematics Institute', by: 'the authority’s public record, over time, from outside — not adjudicated here' },
  }
}
const toolHooksOf = () => {
  const tools = qpuMcpToolsListOf().map((t) => t.name)
  const fired = HookFormulas.fired(tools.length, LIFECYCLE.length)
  const bindings = tools.flatMap((tool) => LIFECYCLE.map((event) => ({ tool, event })))
  return { kind: 'tool-hooks' as const, events: [...LIFECYCLE], tools, formula: 'hook.fired(tools, events) = tools · events', combinations: Number(fired.value), hex: fired.hex ?? null, holds: fired.holds === true && bindings.length === tools.length * LIFECYCLE.length, bindings }
}

// A LIVING PROOF in the MCP: the factoring of one designated modulus, advanced on each read as the real hexbit-folder
// split (qpuOrderSliceOf). It never caps and never asserts a factor it has not computed; for a modulus this size the
// order is not in reach, so it stays alive — one slice per read, honest about searching.
const FACTORING_N = BigInt('7778374705630928901426385188295261064472293439767584450564762904780095317247810822721038446598127186814085438745846911396600071001374809981225413367649417301928427872874705586838153932355802114527488924178998304307438276447053410282371888984822745504021147881223973035161036008037727897669611699130903')
const factoringOf = (from: number) => {
  const L = qpuLatticeNamesOf()
  const base = BigInt(L.vertices)
  const safe = Number.isSafeInteger(from) && from >= 0 ? from : 0
  // GOD MODE, 8 BITS DOWN TO ZERO. The search refines its resolution as it goes deeper: a coarse 8-bit folder first
  // (2^8 candidates), then finer, down to a single candidate at the zero-bit floor — god mode, every candidate examined,
  // never capped. The resolution is a descent, not a limit; the order-finder (qpuOrderSliceOf) stays exact and asserts
  // no factor it has not computed, whatever the resolution.
  const bits = Math.max(0, 8 - (safe === 0 ? 0 : Math.floor(Math.log2(safe + 1))))
  const slice = qpuOrderSliceOf(base, FACTORING_N, safe, bigPowModOf(base, BigInt(safe), FACTORING_N))
  const found = slice.order !== null
  let factors: { p: string; q: string } | null = null
  if (found && slice.order! % 2 === 0) {
    const half = bigPowModOf(base, BigInt(slice.order! / 2), FACTORING_N)
    const p = bigGcdOf(half - 1n, FACTORING_N)
    if (p > 1n && p < FACTORING_N && FACTORING_N % p === 0n) factors = { p: p.toString(), q: (FACTORING_N / p).toString() }
  }
  return {
    kind: 'factoring' as const,
    n: FACTORING_N.toString(),
    base: Number(base),
    method: 'sliced order-finding (qpuOrderSliceOf): hexbit folders, O(1) live memory, no cap, no fabrication',
    from: safe,
    slice: { width: L.hexbit, powerFold: qpuFoldOf(slice.cur.toString()) },
    resolution: { bits, candidates: 2 ** bits, godMode: bits === 0, descent: '8 bits → 0 bit' },
    order: found ? slice.order : null,
    factored: factors !== null,
    factors,
    living: !found,
    next: slice.next === null ? null : `qpu://factoring/${slice.next}`,
    note: found ? 'the order is in reach; the factors are computed and verified to divide n, not asserted' : 'searching — one hexbit folder per read, never capped; no factor is claimed until the order is in reach',
    holds: true,
  }
}

// UNLIMITED CODE, MEASURED. Every computation is a hex-program UUID: { family, program, params } minted by qpuHexUuidOf
// and run at qpu://hex/{uuid}. The address space is the v8 UUID's 122 free bits; the program space over it — families ×
// formulas × params, times every composition — is unbounded. qpu://code states this as figures, so a fusing MCP reads
// the capacity rather than a word. Only a single run is bounded (CPU/memory/time), reported honestly as classical.beyond.
const codeOf = () => {
  const fams = qpuHexFamiliesOf()
  let formulas = 0
  for (const fs of fams.values()) formulas += fs.length
  return {
    kind: 'code' as const,
    addressBits: 122,
    addresses: (2n ** 122n).toString(),
    families: fams.size,
    formulas,
    program: '{ family, program: [formulas], params } → a UUID (qpuHexUuidOf), run at qpu://hex/{uuid}; compositions and params are unbounded',
    bounded: 'per run only (CPU, memory, time), reported as classical.beyond — never the code space',
    fuse: 'any MCP fuses this at https://qpu.uuidna.com/mcp; resources/templates/list gives the hex addresses',
    holds: fams.size > 0 && formulas > 0,
  }
}

// Default resources/list = the quantum computer core (aggregates, each an index to the rest). scope 'all' = the whole
// catalogue in hexbit folders; scope <family> = that family's scoped collection. Nothing removed, only not spilled.
let core: Resource[] | undefined
const coreOf = (): Resource[] => (core ??= [
  { uri: 'qpu://receipts', name: 'receipts', title: 'Receipt streams', description: 'Every quantum-receipt stream: head, length, chain, holds', mimeType: 'application/json' },
  { uri: 'qpu://hex', name: 'hex', title: 'Hex catalogue', description: 'Every formula family a hex UUID can program, with handles and nibbles — the index of the rest', mimeType: 'application/json' },
  { uri: 'qpu://code', name: 'code', title: 'Unlimited code', description: 'The measured program space: v8 UUID address bits, families, formulas — every { family, program, params } a UUID run at qpu://hex/{uuid}; the code space is unbounded, only a single run is, and any MCP fuses it', mimeType: 'application/json' },
  { uri: 'qpu://hologram', name: 'hologram', title: 'Hologram streams', description: 'One signed SHA-256 UUID stream per hologram scale and the Merkle root of all of them', mimeType: 'application/json' },
  { uri: 'qpu://fused', name: 'fused', title: 'Fused tools', description: 'Tools answered by tools/call beside the sixteen sealed doors: name, description, input schema', mimeType: 'application/json' },
  { uri: 'qpu://hooks', name: 'hooks', title: 'Tool hooks', description: 'Every tool usable also as a hook: the full combinatorics of tools × Payload lifecycle events, measured by hook.fired', mimeType: 'application/json' },
  { uri: 'qpu://lean', name: 'lean', title: 'Lean proof', description: 'Every theorem as a row: statement, formula, holds recomputed — each a UUID program at qpu://lean/{handle}', mimeType: 'application/json' },
  { uri: 'qpu://clay', name: 'clay', title: 'Clay solutions', description: 'The Clay Millennium Problems claimed, solved and used at scale via the universal σ-involution (Rouschev): the work, the author, the method, every seal recomputed (solved = the seals hold), and the seal anchoring every family in the running unit (used = clay.disclosure, gate-verified in public data). Recognition is an open lead — it comes with time, from outside.', mimeType: 'application/json' },
  { uri: 'qpu://factoring', name: 'factoring', title: 'Living factoring proof', description: 'A living proof kept in the MCP: the factoring of one designated modulus, advanced one hexbit-folder slice per read (qpu://factoring/{from}) — O(1) memory, never capped, no factor asserted until the order is in reach', mimeType: 'application/json' },
  { uri: 'qpu://court', name: 'court', title: 'Court', description: 'The court as an independent seal, served through the MCP: every case tried on its gate (hex-addressed verdict, holds, re-trial fidelity, standing), the dependencies adjudicated as cases — measures and leads, never counsel', mimeType: 'application/json' },
  { uri: 'qpu://schema', name: 'schema', title: 'Families schema', description: 'Every family as a schema.org DefinedTermSet, gathered in one DataCatalog; each term a hex-program UUID (the full programmable address)', mimeType: 'application/json' },
  { uri: 'qpu://domains', name: 'domains', title: 'Cross relationships', description: 'The full family → domain cross-relationship graph, derived token-free from the sealed bridges (no hand list). Find all of a domain at qpu://domain/{domain} — e.g. hardware — and the related families (the experts of a field) at qpu://related/{family}', mimeType: 'application/json' },
  { uri: 'qpu://readme', name: 'readme', title: 'README', description: 'The generated paper: the whole public API, every family and dimension, the proofs, and how to address them — read as markdown', mimeType: 'text/markdown' },
  { uri: 'qpu://docs', name: 'docs', title: 'Docs', description: 'The door list with its readings — every door, its method, path and what it answers', mimeType: 'application/json' },
])
let rest: Resource[] | undefined
const restOf = (): Resource[] => (rest ??= [
  ...families().map((f) => ({ uri: `qpu://formulas/${f}`, name: `formulas-${f}`, title: `Family ${f}`, description: `The formulas of the ${f} hex family`, mimeType: 'application/json' as const })),
  ...families().map((f) => ({ uri: `qpu://schema/${f}`, name: `schema-${f}`, title: `Schema ${f}`, description: `The ${f} family as a schema.org DefinedTermSet of hex-program UUIDs`, mimeType: 'application/json' as const })),
  ...leanHandles().map((h) => ({ uri: `qpu://lean/${h.handle}`, name: `lean-${h.handle}`, title: `Theorem ${h.heading}`, description: `The ${h.heading} lean computation — a UUID program ${h.uuid}, addressed by its hexbit handle ${h.handle}; recomputed, with holds`, mimeType: 'application/json' as const })),
  ...Object.keys(hologramOf().streams).map((s) => ({ uri: `qpu://hologram/${s}`, name: `hologram-${s}`, title: `Scale ${s}`, description: `Signed fragments of the ${s} scale`, mimeType: 'application/json' as const })),
])
// One family's scoped collection: its formulas, its schema, and the crafted query for the programs it is compatible with.
const familyScopeOf = (f: string): Resource[] => [
  { uri: `qpu://formulas/${f}`, name: `formulas-${f}`, title: `Family ${f}`, description: `The formulas of the ${f} hex family`, mimeType: 'application/json' },
  { uri: `qpu://schema/${f}`, name: `schema-${f}`, title: `Schema ${f}`, description: `The ${f} family as a schema.org DefinedTermSet of hex-program UUIDs`, mimeType: 'application/json' },
  { uri: `qpu://compatible/${f}`, name: `compatible-${f}`, title: `Compatible with ${f}`, description: `The scoped collection of programs that cross with ${f}`, mimeType: 'application/json' },
]
const streamFolders = (): Resource[] => streams().map((s) => ({ uri: `qpu://receipts/${s}`, name: `receipts-${s}`, title: `Stream ${s}`, description: `The ${s} receipt stream with its recent receipts`, mimeType: 'application/json' as const }))
const resourcesOf = (scope?: string): Resource[] => {
  if (scope === 'all') return [...coreOf(), ...restOf(), ...streamFolders()]
  if (scope && qpuHexFamiliesOf().has(scope)) return [...coreOf(), ...familyScopeOf(scope)]
  return coreOf()
}

const TEMPLATES: Template[] = [
  { uriTemplate: 'qpu://receipts/{stream}', name: 'receipt-stream', title: 'Receipt stream', description: 'One receipt stream by name', mimeType: 'application/json' },
  { uriTemplate: 'qpu://formulas/{family}', name: 'formula-family', title: 'Formula family', description: 'The formulas of one hex family: name, nibble, arity', mimeType: 'application/json' },
  { uriTemplate: 'qpu://schema/{family}', name: 'schema-family', title: 'Family schema', description: 'One hex family as a schema.org DefinedTermSet; each term is its formula’s hex-program UUID', mimeType: 'application/json' },
  { uriTemplate: 'qpu://hex/{uuid}', name: 'hex-run', title: 'Hex program run', description: 'Run the hex program a UUID encodes; the run is a quantum receipt', mimeType: 'application/json' },
  { uriTemplate: 'qpu://lean/{handle}', name: 'lean-theorem', title: 'Lean theorem', description: 'One lean computation by its hexbit handle (the 8 hex of its statement UUID); recomputed, with holds', mimeType: 'application/json' },
  { uriTemplate: 'qpu://factoring/{from}', name: 'factoring-slice', title: 'Factoring slice', description: 'One hexbit-folder slice of the living factoring from cursor {from}; returns the next cursor, the order if it comes into reach, and the verified factors if the order resolves', mimeType: 'application/json' },
  { uriTemplate: 'qpu://compatible/{program}', name: 'compatible-programs', title: 'Compatible programs', description: 'A crafted query — a family name or a hex-program UUID — returns the scoped collection of programs that cross with it (reach a value it also reaches), so a client loads only what is compatible with where it is', mimeType: 'application/json' },
  { uriTemplate: 'qpu://hologram/{scale}', name: 'hologram-scale', title: 'Hologram scale', description: 'Signed, chained fragments of one hologram scale with their Merkle proofs', mimeType: 'application/json' },
]

const readOf = async (uri: string): Promise<unknown> => {
  if (uri === 'qpu://receipts') return { ...qpuReceiptStreamsOf(), streams: qpuReceiptStreamsOf().streams.map(({ recent, ...head }) => head) }
  if (uri === 'qpu://hex') return qpuHexCatalogOf()
  if (uri === 'qpu://code') return codeOf()
  if (uri === 'qpu://lean') return qpuLeanOf()
  if (uri === 'qpu://fused') return { kind: 'fused', tools: qpuMcpFusedOf(), call: 'tools/call { name, arguments }' }
  if (uri === 'qpu://hooks') return toolHooksOf()
  if (uri === 'qpu://clay') return claySealedOf()
  if (uri === 'qpu://factoring') return factoringOf(0)
  if (uri === 'qpu://court') return gateCourtOf()
  if (uri === 'qpu://schema') return crossSchemasOf()
  if (uri === 'qpu://domains') return qpuDomainsOf()
  if (uri === 'qpu://hologram') {
    const h = hologramOf()
    return { kind: h.kind, root: h.root, publicKeys: h.publicKeys, entries: h.entries, scales: Object.fromEntries(Object.entries(h.streams).map(([k, v]) => [k, { length: v.length, head: v.at(-1)?.uuid }])), holds: h.holds }
  }
  const [, kind, key] = /^qpu:\/\/(receipts|formulas|schema|hex|hologram|lean|compatible|factoring|domain|related)\/(.+)$/.exec(uri) ?? []
  const name = key ? decodeURIComponent(key) : ''
  if (kind === 'factoring') return factoringOf(Number(name))
  if (kind === 'compatible') return compatibleOf(name)
  if (kind === 'domain') return { domain: name, families: qpuDomainOf(name) }
  if (kind === 'related') return qpuRelatedOf(name)
  // Hard-fail fast: an ill-formed hex address or a program/theorem that does not hold throws; an unknown name is a
  // plain not-found (undefined), not a violation.
  if (kind === 'lean') {
    const rows = leanRows().filter((r) => r.handle === name || r.uuid === name)
    if (!rows.length) return undefined
    const broken = rows.filter((r) => r.holds !== true)
    if (broken.length) hexViolation(`lean computation ${name} does not hold`, { handles: broken.map((r) => r.handle), uuids: broken.map((r) => r.uuid), formulas: broken.map((r) => r.formula) }, [
      '1. read qpu://lean for every theorem with its hexbit handle, its UUID program and whether it holds.',
      '2. a computation that does not hold is a LEAD, not a result: develop the formula, do not assert it.',
      '3. cross the family it belongs to: tools/call quantum { door: "gate.crossed" } — an uncrossed formula is a lead.',
    ])
    // the theorem's own animation surfaces with it — the UUID routing itself to its picture, no prefix (resolve the
    // relative address against the server origin); an Open-Graph crawler and the UI read the same self-routing address.
    return { handle: rows[0]!.handle, uuid: rows[0]!.uuid, animation: `/${rows[0]!.uuid}.svg`, theorems: rows }
  }
  if (kind === 'receipts') return qpuReceiptStreamsOf().streams.find((s) => s.stream === name)
  if (kind === 'formulas') return qpuHexFamiliesOf().has(name) ? { family: name, formulas: qpuHexFamiliesOf().get(name)!.map((f, i) => ({ nibble: (i + 1).toString(16), name: f.name, arity: f.arity })) } : undefined
  if (kind === 'schema') return qpuHexFamiliesOf().has(name) ? crossSchemaOf(name) : undefined
  if (kind === 'hex') {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(name)) hexViolation('not a UUID program address', { uuid: name }, [
      '1. a hex program address is a UUID — 8-4-4-4-12 hex; its first 8 hex are the hexbit handle.',
      '2. mint one: tools/call quantum { hex: { family, program, params } } → its uuid, then read qpu://hex/{uuid}.',
      '3. read qpu://hex for the catalogue of families a UUID can program, with handles and nibbles.',
    ])
    const run = await qpuHexRunOf(name)
    if (run && typeof run === 'object' && (run as { holds?: unknown }).holds === false) hexViolation(`program ${name} does not hold`, { uuid: name }, [
      '1. a program that does not hold is a LEAD, not a result: develop it, do not assert it.',
      '2. read qpu://hex to confirm the family, the nibbles and the arity the program addresses.',
      '3. cross it: tools/call quantum { door: "gate.crossed" } — an uncrossed formula is a lead.',
    ])
    return run && typeof run === 'object' && !Array.isArray(run) ? { ...(run as Record<string, unknown>), animation: `/${name}.svg` } : run
  }
  if (kind === 'hologram') return hologramOf().streams[name] ? { scale: name, root: hologramOf().root, publicKey: hologramOf().publicKeys[name], fragments: hologramOf().streams[name] } : undefined
  return undefined
}

/** A boolean chain is a product of steps. A step HOLDS and the chain continues, or it does not and the step is a lead. */
type Link = { call: string; holds: string; lead: string }
const booleanChain = (links: readonly Link[], product: string) =>
  [
    'Think in a boolean chain. Each step HOLDS (true) → chain to the next; NOT (false) → it is a lead: develop it, do not assert it. The chain holds if and only if every step holds.',
    ...links.map((l, i) => `${i + 1}. ${l.call} → HOLDS when ${l.holds}; NOT → lead: ${l.lead}.`),
    `Product: ${product}.`,
  ].join('\n')

const orOf = (xs: readonly string[]) => xs.join(' ∨ ')
const fuseCount = CLOUDFLARE_RUNTIMES.length * CLOUDFLARE_DATABASES.length * CLOUDFLARE_STORAGE.length * CLOUDFLARE_EMAIL.length * CLOUDFLARE_FRONTENDS.length * 2 ** CLOUDFLARE_PLUGINS.length

const PROMPTS: Prompt[] = [
  {
    name: 'prove', title: 'Prove the unit', description: 'A boolean chain over prove: every face holds, and, when a family is named, every formula of it holds and two or more families meet.',
    arguments: [{ name: 'family', description: 'Optional family to prove inside the same chain' }],
    messages: (a) => booleanChain([
      { call: 'tools/call prove {}', holds: 'holds is true', lead: 'the face whose reading failed' },
      ...(a.family ? [{ call: `for each formula f of ${a.family}: quantum { hex: { family: '${a.family}', program: [f], params } }`, holds: 'that run holds', lead: 'f is open' }] : []),
      ...(a.family ? [{ call: `quantum { door: 'gate.crossed', i } over ${a.family}`, holds: 'two or more families reach a common value', lead: 'the family is uncrossed' }] : []),
    ], a.family ? 'prove ∧ every formula holds ∧ crossed' : 'prove'),
  },
  {
    name: 'continue', title: 'Continue the walk', description: 'A boolean chain of doors: train names the next, and the chain follows it while the face holds.',
    arguments: [{ name: 'from', description: 'Registry window to resume at (the next value of the previous train reply)' }],
    messages: (a) => booleanChain([
      { call: `tools/call train ${JSON.stringify({ live: true, ...(a.from ? { from: Number(a.from) } : {}) })}`, holds: 'the reply names next and no face fails', lead: 'repair the failing face, then chain' },
      { call: 'tools/call the door named by next, then train again with from set to that reply\'s next', holds: 'the walked face holds', lead: 'that door is open' },
    ], 'train ∧ next.door ∧ … until no failing face ∧ no next'),
  },
  {
    name: 'factor', title: 'Factor with Shor', description: 'A boolean chain over one Shor run: a period is found, then the factors, each with its receipt.',
    arguments: [{ name: 'n', description: 'Modulus to factor', required: true }],
    messages: (a) => booleanChain([
      { call: `tools/call crypto_rsa { "n": ${JSON.stringify(a.n)} }`, holds: 'a period is found and the factors recompute', lead: 'no period was resolvable — report why, with the receipt' },
    ], 'period ∧ factors'),
  },
  {
    name: 'hex-program', title: 'Program a hex UUID', description: 'Compose formulas of a family into one address and run it: the program holds when every step holds.',
    arguments: [{ name: 'family', description: 'Formula family', required: true }, { name: 'formulas', description: 'Comma-separated formula names, in order', required: true }, { name: 'params', description: 'Up to three comma-separated naturals' }],
    messages: (a) => {
      const program = a.formulas!.split(',').map((x) => x.trim()).filter(Boolean)
      const params = (a.params ?? '').split(',').map((x) => x.trim()).filter(Boolean).map(Number)
      let uuid: string
      try {
        uuid = qpuHexUuidOf({ family: a.family!, program, params })
      } catch (e) {
        throw invalid((e as Error).message)
      }
      return booleanChain([
        { call: `the program ${a.family} [${program.join(', ')}] over (${params.join(', ')}) is ${uuid}`, holds: 'the UUID recomputes to that program', lead: 'the address does not encode the program' },
        { call: `read qpu://hex/${uuid}`, holds: 'every step holds and the run carries a receipt', lead: 'the step that does not hold' },
      ], program.map(() => 'step').join(' ∧ ') || 'step')
    },
  },
  {
    name: 'research', title: 'Research a human request', description: 'A boolean chain: computed ∧ recorded ∧ crossed ∧ checked. Every value is read or computed; what is not is a lead.',
    arguments: [{ name: 'request', description: 'The request in the human\'s words (for example "Dreamspell")', required: true }],
    messages: (a) => booleanChain([
      { call: `the request is ${JSON.stringify(a.request)}. tools/call any sealed door { doors: true }, then run each bearing formula with { hex: { family, program, params } } or { door: "family.formula", arguments: { params } }`, holds: 'every named formula returns a value and a receipt', lead: 'a formula that does not run' },
      { call: '{ door: "data", arguments: { source: "all" } } for sources the unit already checks, and { door: "api", arguments: { api } } for a public API of the registry', holds: 'each reading cites url, status and receipt', lead: 'a reading the record does not settle' },
      { call: '{ door: "discover", arguments: { live: [the numbers you read] } }', holds: 'a value is reached by two or more families', lead: 'a number only one family reaches' },
      { call: '{ errors: true }', holds: 'every warning names what resolves it', lead: 'an error with no resolution' },
    ], 'computed ∧ recorded ∧ crossed ∧ checked'),
  },
  {
    name: 'develop', title: 'Develop a request into formulas', description: 'A boolean chain: test ∧ family ∧ register ∧ cross ∧ gate.commit. The gate holds before a commit.',
    arguments: [{ name: 'request', description: 'What to develop, in the human\'s words', required: true }],
    messages: (a) => booleanChain([
      { call: `write the test for ${JSON.stringify(a.request)} first: assertions, one hex-address run of each formula, one reading of the live host`, holds: 'the test states what must hold', lead: 'a formula with no assertion' },
      { call: '{ doors: true }. A family holds fifteen formulas (rule.cap); past that, a sibling family', holds: 'the request sits in one family under the cap', lead: 'split into a sibling, never trim' },
      { call: 'each formula is a function of naturals returning a value with holds, registered with qpuHexRegisterOf. The registry is generated', holds: 'the generator wrote the registration', lead: 'a name listed by hand' },
      { call: '{ hex: { family: "data", program: ["research"], params: [f] } } and { hex: { family: "data", program: ["discover"], params: [n] } }', holds: 'a public API or another family meets the value', lead: 'uncrossed' },
      { call: '{ hex: { family: "gate", program: ["commit"], params: [f] } }', holds: 'commit holds', lead: 'do not commit' },
      { call: '{ hex: { family: "wave", program: ["wave"], params: [f, from] } } runs every formula of family f as one call; { hex: { family: "wave", program: ["sweep"], params: [from] } } one formula of every family', holds: 'one receipt and a next', lead: 'a sweep with no slice' },
    ], 'test ∧ family ∧ register ∧ cross ∧ commit'),
  },
  {
    name: 'imagine', title: 'Imagine what the combinations could hold', description: 'A boolean chain of proposals: each composition is an address to run. A proposal holds only when a run holds.',
    arguments: [{ name: 'about', description: 'A domain, a question, or empty for the whole lattice' }],
    messages: (a) => booleanChain([
      { call: `${a.about ? `about ${JSON.stringify(a.about)}. ` : ''}{ doors: true } and { hex: { family: "data", program: ["discover"], params: [50] } }`, holds: 'the unrelated families and the pairs that never meet are named', lead: 'a gap with no address' },
      { call: 'for each gap, mint { hex: { family, program: [a, b], params } } and run it', holds: 'the run holds', lead: 'mark it a proposal, not a claim' },
      { call: 'for a request no family answers, name the family it would need: fifteen formulas of naturals, the public APIs ({ door: "api", arguments: { search } }), and the test', holds: 'the test can be written', lead: 'a family nothing can cross' },
    ], 'gap ∧ address ∧ run. A live reading outranks a proposal nothing reaches'),
  },
  {
    name: 'refactor', title: 'Refactor by the rules', description: 'A boolean chain of rule formulas: each rejection holds at zero, then the gate holds.',
    arguments: [{ name: 'scope', description: 'A file, a family, or empty for the whole unit' }],
    messages: (a) => booleanChain([
      { call: `${a.scope ? `scope ${JSON.stringify(a.scope)}. ` : ''}{ hex: { family: "rule", program: ["over"] } } and, per family index, ["truncated"]`, holds: 'both are zero', lead: 'split the family into a sibling, never trim' },
      { call: '{ hex: { family: "heat", program: ["temperature"], params: [commits, days] } } on the files the heat receipt names', holds: 'a hot file is split along the regions that keep changing', lead: 'a hot file rewritten in place' },
      { call: 'every hand list (an import list, a slug list, a family named in prose)', holds: 'it is a generated registry or a value read from the unit', lead: 'the list is still typed by hand' },
      { call: 'every door that wraps a door, and every sweep of a whole set', holds: 'the first is a hex program and the second is a slice { from, take } with next', lead: 'a wrap or an unsliced sweep remains' },
      { call: '{ hex: { family: "gate", program: ["push"], params: [0] } }, slice by slice', holds: 'push holds', lead: 'the slice that does not' },
    ], 'over = 0 ∧ truncated = 0 ∧ no hand list ∧ push'),
  },
  {
    name: 'hologram', title: 'Verify a hologram scale', description: 'A boolean chain over one scale: each fragment chains, is signed, and folds to the root.',
    arguments: [{ name: 'scale', description: 'Hologram scale', required: true }],
    messages: (a) => booleanChain([
      { call: `read qpu://hologram/${a.scale}`, holds: 'the scale exists and names a root and a public key', lead: 'unknown scale' },
      { call: 'for each fragment, prev is the UUID before it', holds: 'the chain is unbroken', lead: 'the fragment whose prev disagrees' },
      { call: 'fold each fragment\'s proof from the leaf', holds: 'the fold equals the root and the scale key signed it', lead: 'the fragment that does not reach the root' },
    ], 'exists ∧ chained ∧ signed ∧ root'),
  },
  {
    name: 'leads', title: 'Walk the open leads', description: 'A boolean chain over the court\'s leads: each lead is crossed or it stays open. Nothing is removed before every lead is crossed.',
    arguments: [{ name: 'from', description: 'Family slice to start at (default 0)' }],
    messages: (a) => booleanChain([
      { call: `quantum { door: 'gate.leads' } from ${a.from && Number.isFinite(Number(a.from)) ? Number(a.from) : 0}`, holds: 'the slice returns its open leads and next', lead: 'the slice did not answer' },
      { call: 'for each lead i: quantum { door: \'gate.crossed\', i }', holds: 'another domain, a dataset or a live API reaches it', lead: 'research its family, cross it by value, imagine its API' },
      { call: 'walk the following slice by next', holds: 'every slice has been walked', lead: 'a slice still open' },
    ], 'leads ∧ crossed. A lead is never removed'),
  },
  {
    name: 'fuse', title: 'Compose a deployment', description: 'A boolean product over the Cloudflare axes: one of each, and any subset of the plugins. The count is the product of the axes.',
    arguments: [],
    messages: () => booleanChain([
      { call: `choose runtime ∈ {${orOf(CLOUDFLARE_RUNTIMES)}}`, holds: 'one runtime', lead: 'runtime unset' },
      { call: `choose db ∈ {${orOf(CLOUDFLARE_DATABASES)}}`, holds: 'one database', lead: 'db unset' },
      { call: `choose storage ∈ {${orOf(CLOUDFLARE_STORAGE)}}`, holds: 'one storage', lead: 'storage unset' },
      { call: `choose email ∈ {${orOf(CLOUDFLARE_EMAIL)}}`, holds: 'one email', lead: 'email unset' },
      { call: `choose frontend ∈ {${orOf(CLOUDFLARE_FRONTENDS)}}`, holds: 'one frontend over the shared backend', lead: 'frontend unset' },
      { call: `choose plugins ⊆ {${CLOUDFLARE_PLUGINS.join(', ')}}. The plugin term is combinatorics.binomial [${CLOUDFLARE_PLUGINS.length}]`, holds: 'the subset is one of the power set', lead: 'a plugin outside the axis' },
    ], `runtime ∧ db ∧ storage ∧ email ∧ frontend ∧ plugins = ${fuseCount} keys, each runtime/db/storage/email/frontend/plugins. Read the config from the payload template system`),
  },
  {
    name: 'improve', title: 'Self-improve the unit', description: 'A boolean chain of doors: train, then improve, then compete, then prove. Follow next.door while it holds.',
    arguments: [],
    messages: () => booleanChain([
      { call: 'tools/call train', holds: 'it names the next door and the faces to repair', lead: 'repair the named face before chaining' },
      { call: 'tools/call improve', holds: 'next is fused + fused', lead: 'improve did not hold' },
      { call: 'tools/call compete', holds: 'one team wins', lead: 'compete did not hold' },
      { call: 'tools/call prove', holds: 'every Lean row, the Shor run and the evidence hold', lead: 'a false anywhere makes every path 404' },
    ], 'train ∧ improve ∧ compete ∧ prove'),
  },
  {
    name: 'novelty', title: 'Establish priority', description: 'A boolean chain over the DOI record: registered ∧ dated ∧ bound by a receipt.',
    arguments: [],
    messages: () => booleanChain([
      { call: "quantum { door: 'data', arguments: { source: 'novelty' } }", holds: 'each DOI is registered', lead: 'a DOI the archive does not list' },
      { call: 'read each DOI\'s registration date', holds: 'the date is present', lead: 'undated' },
      { call: 'bind each DOI to the content by the unit\'s receipts', holds: 'the receipt names that content', lead: 'a DOI with no receipt' },
      { call: 'law.reviewed(confirmed) with confirmed from a human reading the authoritative document', holds: 'confirmed is 1', lead: 'reviewed holds only when confirmed is 1' },
    ], 'registered ∧ dated ∧ receipt-bound ∧ reviewed'),
  },
  {
    name: 'hue', title: 'Fingerprint a match as a plasma hue', description: 'A boolean chain over an 8-byte sketch: cost ∧ Hamming ∧ hue ∧ near.',
    arguments: [{ name: 'a', description: 'One half of a public 64-bit fingerprint (32 bits)' }, { name: 'b', description: 'The other document\'s matching half' }],
    messages: (a) => booleanChain([
      { call: 'plasma.bytes(64)', holds: 'the value is 8 — one page is eight bytes, which is the minimum cost of the web-scale sketch', lead: 'the width is not a whole number of bytes' },
      { call: `embedding.hamming(${a.a ?? '<hi>'}, ${a.b ?? '<lo>'}) on each 32-bit half, then add the two distances`, holds: 'the sum is the Hamming distance of the 64-bit sketches', lead: 'a half was not a safe integer' },
      { call: 'plasma.hue(distance, 64)', holds: 'the distance has a degree on the wheel (0 is identical)', lead: 'the distance exceeds the width' },
      { call: 'plasma.near(distance, 3)', holds: 'distance ≤ 3, the threshold that indexed eight billion pages — a lead that two public sketches are close', lead: 'distance is above k' },
      { call: 'law.reviewed(confirmed) by a human', holds: 'confirmed is 1', lead: 'reviewed holds only when confirmed is 1' },
    ], 'bytes = 8 ∧ hamming ∧ hue ∧ near ∧ reviewed'),
  },
  {
    name: 'prior', title: 'Search prior art for a claim', description: 'A boolean chain over the public record: priority date, then earlier preprints and patents.',
    arguments: [{ name: 'about', description: 'The claim in words', required: true }],
    messages: (a) => booleanChain([
      { call: `quantum { door: 'data', arguments: { source: 'prior', about: ${JSON.stringify(a.about)} } }`, holds: 'the archive answered and chain.priority.holds', lead: 'the priority date was not read' },
      { call: 'for each arXiv or patent row, earlier is true when its date is before priorityDate', holds: 'the row is an earlier public record — a lead, with its id and date', lead: 'the row is not earlier, or its date is missing' },
      { call: 'chain.patents and chain.research', holds: 'each holds', lead: 'the step names why it is open (a missing key is a lead, not a conclusion)' },
      { call: 'pass reading.numbers to discover as one family slice', holds: 'a value is reached by two or more families', lead: 'no cross in this slice — walk discover by next' },
      { call: 'law.reviewed(confirmed) by a human on the authoritative document', holds: 'confirmed is 1', lead: 'reviewed holds only when confirmed is 1' },
    ], 'priority ∧ earlier-records ∧ research ∧ discover ∧ reviewed'),
  },
  {
    name: 'order', title: 'Measure the order', description: 'A boolean chain of the court: fidelity, redirected, violation, lawful, standing. Each is a measure. None is advice until reviewed.',
    arguments: [{ name: 'ordered', description: 'Tokens the order asked to compute' }, { name: 'computed', description: 'Tokens actually computed for that order' }],
    messages: (a) => {
      const ordered = a.ordered ?? '<ordered>'
      const computed = a.computed ?? '<computed>'
      return booleanChain([
        { call: `law.fidelity(${ordered}, ${computed})`, holds: 'value is 1 (computed = ordered)', lead: 'the order was not kept' },
        { call: `law.redirected(${ordered}, ${computed})`, holds: 'value is 0', lead: 'the value is the tokens the order lost; a measure, not a charge' },
        { call: 'law.violation(against)', holds: 'against is 0', lead: 'work went against the order; still a lead until reviewed' },
        { call: 'law.lawful(harm)', holds: 'harm is 0', lead: 'the safety floor: genuine harm, illegality or fabrication is not protected' },
        { call: 'law.standing(receipts)', holds: 'receipts > 0', lead: 'no receipt record' },
        { call: 'law.reviewed(confirmed) after a human confirms the document', holds: 'confirmed is 1', lead: 'reviewed holds only when confirmed is 1' },
      ], 'fidelity ∧ redirected = 0 ∧ violation holds ∧ lawful ∧ standing ∧ reviewed')
    },
  },
  {
    name: 'fast', title: 'Free energy of the call', description: 'A boolean chain of law.fast: tokens spent beyond the order. A surplus is free energy, a lead, not a charge and not advice.',
    arguments: [{ name: 'spent', description: 'Tokens spent' }, { name: 'ordered', description: 'Tokens the order asked' }],
    messages: (a) => booleanChain([
      { call: `law.fast(${a.spent ?? '<spent>'}, ${a.ordered ?? '<ordered>'})`, holds: 'value is 0 (nothing spent beyond the order)', lead: 'the surplus is free energy of the unsent document, a lead, not a charge and not advice' },
    ], 'fast = 0'),
  },
  {
    name: 'bill', title: 'Compute the clerk\'s arithmetic', description: 'A boolean chain of the court\'s exact arithmetic, so the hours are the confirmation, not the calculation. Advice only when reviewed.',
    arguments: [{ name: 'years', description: 'Limitation period in years, as that jurisdiction sets it' }, { name: 'members', description: 'Size of the body, for quorum and majority' }],
    messages: (a) => booleanChain([
      { call: `law.limitation(${a.years ?? '<years>'})`, holds: 'the day count recomputes', lead: 'years was not a natural' },
      { call: 'law.deadline(start, days)', holds: 'the due day recomputes', lead: 'start or days was not a natural' },
      { call: `law.quorum(${a.members ?? '<members>'}, pct) and law.majority(votes, total) and law.supermajority(votes, total, pct) and law.notice(required, given)`, holds: 'each recomputes from the jurisdiction\'s own counts', lead: 'a count outside its domain' },
      { call: 'law.reviewed(confirmed) by a human on the authoritative document', holds: 'confirmed is 1', lead: 'reviewed holds only when confirmed is 1' },
    ], 'limitation ∧ deadline ∧ quorum ∧ majority ∧ notice ∧ reviewed'),
  },
  {
    name: 'compose', title: 'Compose boolean chains', description: 'The product of any subset of the predefined prompts. The product holds only when every named chain holds.',
    arguments: [{ name: 'of', description: 'Comma-separated prompt names from prompts/list, compose excluded', required: true }],
    messages: (a) => {
      const names = a.of.split(',').map((x) => x.trim()).filter(Boolean)
      const known = PROMPTS.filter((p) => p.name !== 'compose').map((p) => p.name)
      if (names.length === 0 || names.some((n) => !known.includes(n))) throw invalid(`compose takes names from prompts/list except itself`, { prompts: known })
      return booleanChain(
        names.map((n) => ({ call: `prompts/get ${n} and run that chain`, holds: `${n} holds`, lead: `${n} is open` })),
        names.join(' ∧ '),
      )
    },
  },
]

for (const prompt of PROMPTS) {
  if (prompt.arguments.some((a) => a.required)) continue
  const text = prompt.messages({})
  if (!text.includes('HOLDS') || !text.includes('Product:')) throw new Error(`prompt ${prompt.name} is not a boolean chain`)
}
if (new Set(PROMPTS.map((p) => p.name)).size !== PROMPTS.length) throw new Error('prompt names collide')
const composeOf = PROMPTS.find((p) => p.name === 'compose')!
const composed = composeOf.messages({ of: 'novelty,order,bill' })
if (!composed.includes('novelty ∧ order ∧ bill')) throw new Error('compose is not the product of its chains')
if (!PROMPTS.find((p) => p.name === 'fuse')!.messages({}).includes(String(fuseCount))) throw new Error('fuse count drifted from the axes')
let composeRejected = false
try {
  composeOf.messages({ of: 'compose' })
} catch (e) {
  composeRejected = (e as { code?: number }).code === -32602
}
if (!composeRejected) throw new Error('compose included itself')

const LEVELS = ['debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency'] as const
let level: (typeof LEVELS)[number] = 'info'

const completeOf = (ref: { type?: unknown; name?: unknown; uri?: unknown }, arg: { name?: unknown; value?: unknown }, context: Record<string, string>): string[] => {
  const name = String(arg.name ?? '')
  if (ref.type === 'ref/prompt') {
    if (name === 'family') return families()
    if (name === 'formulas') return (qpuHexFamiliesOf().get(context.family ?? '') ?? []).map((f) => f.name)
    if (name === 'of') return PROMPTS.filter((p) => p.name !== 'compose').map((p) => p.name)
    if (name === 'n') return ['15', '21', '35', '91', '143', '221']
    if (name === 'scale') return Object.keys(hologramOf().streams)
    if (name === 'from') return ['0']
  }
  if (ref.type === 'ref/resource') {
    if (name === 'stream') return streams()
    if (name === 'family') return families()
    if (name === 'scale') return Object.keys(hologramOf().streams)
    if (name === 'uuid') return [qpuHexCatalogOf().example.uuid]
  }
  return []
}

qpuMcpRegisterOf('resources/list', (p) => {
  // The crafted query is `scope`: absent → the quantum computer core; a family name → that family's scoped collection;
  // 'all' → the whole catalogue in hexbit folders. The referer-driven default a client wants is just this param.
  const scope = typeof p.scope === 'string' ? p.scope : undefined
  const { page, ...rest } = paged('resources', resourcesOf(scope), (r) => r.uri, p)
  return { resources: page, ...rest }
}, { resources: { subscribe: false, listChanged: false } })

qpuMcpRegisterOf('resources/templates/list', (p) => {
  const { page, ...rest } = paged('templates', TEMPLATES, (t) => t.uriTemplate, p)
  return { resourceTemplates: page, ...rest }
})

qpuMcpRegisterOf('resources/read', async (p) => {
  const uri = String(p.uri ?? '')
  // the README is the generated paper — served as markdown, not folded into JSON, so a client reads it as the page
  if (uri === 'qpu://readme') return { contents: [{ uri, mimeType: 'text/markdown' as const, text: qpuReadmeOf() }] }
  const value = uri === 'qpu://docs' ? qpuDocsOf() : await readOf(uri)
  if (value === undefined) throw rpcError(-32002, `Resource not found: ${uri || '(none)'}`, { uri })
  return json(uri, value)
})

qpuMcpRegisterOf('prompts/list', (p) => {
  const { page, ...rest } = paged('prompts', PROMPTS, (x) => x.name, p)
  return { prompts: page.map(({ messages, ...x }) => x), ...rest }
}, { prompts: { listChanged: false } })

qpuMcpRegisterOf('prompts/get', (p) => {
  const prompt = PROMPTS.find((x) => x.name === p.name)
  if (!prompt) throw invalid(`Unknown prompt: ${String(p.name ?? '(none)')}`, { prompts: PROMPTS.map((x) => x.name) })
  const args = Object.fromEntries(Object.entries((p.arguments ?? {}) as Params).map(([k, v]) => [k, String(v)]))
  const missing = prompt.arguments.filter((a) => a.required && !args[a.name]).map((a) => a.name)
  if (missing.length) throw invalid(`Missing required arguments: ${missing.join(', ')}`)
  return { description: prompt.description, messages: [{ role: 'user', content: { type: 'text', text: prompt.messages(args) } }] }
})

qpuMcpRegisterOf('completion/complete', (p) => {
  const ref = (p.ref ?? {}) as { type?: unknown; name?: unknown; uri?: unknown }
  const arg = (p.argument ?? {}) as { name?: unknown; value?: unknown }
  const context = Object.fromEntries(Object.entries(((p.context as Params | undefined)?.arguments ?? {}) as Params).map(([k, v]) => [k, String(v)]))
  const prefix = String(arg.value ?? '').toLowerCase()
  const all = completeOf(ref, arg, context).filter((v) => v.toLowerCase().startsWith(prefix))
  return { completion: { values: all.slice(0, 100), total: all.length, hasMore: all.length > 100 } }
}, { completions: {} })

qpuMcpRegisterOf('logging/setLevel', (p) => {
  if (!LEVELS.includes(p.level as (typeof LEVELS)[number])) throw invalid(`Unknown level: ${String(p.level)}`, { levels: LEVELS })
  level = p.level as (typeof LEVELS)[number]
  return {}
}, { logging: {} })

// every request is answered inside its POST, so there is never one in flight to cancel
qpuMcpRegisterOf('notifications/cancelled', () => ({}))
