// Imagination as a pure toolbox: every lead's statement matched with the reflection on, so each lead gets its hidden factors,
// its angles, its mirror queries, its cluster and its verification requests; every reflection that finds something is a new
// open lead; every enum value no example exercises is an untried door; every application family is an adaptor to build.
import { PROSE, proseFill } from './prose-index.ts'
import { TABLES } from './tables-index.ts'
import type { Example } from './examples.ts'
import type { Lead } from './leads.ts'
import type { Rpc } from './audit.ts'
import { createMatcher } from './match.ts'
import { VERIFIERS } from './verifiers.ts'
import { canonicalText, channel, seal, uuid, uuidFromParts } from '../uuid/index.ts'
import { nil } from '../uuid/programs/index.ts'
import { checkWitnesses } from './witnesses.ts'
import { LICENSE, PRECEDENCE } from './unit/license.ts'
import { KEY } from './unit/theme.ts'
import { decodeImpossible, seededTrapdoor } from './algorithms.ts'

const leanExpression = (lean: string) => {
  const at = lean.lastIndexOf(' :=')
  const head = at < 0 ? lean : lean.slice(0, at)
  const colon = head.lastIndexOf(':')
  const body = (colon < 0 ? head : head.slice(colon + 1)).trim()
  return body || lean.trim()
}
/** The theorem and its witnesses, as hex. The handle is the theorem's place. The program is the theorem's own numerals, and each further nibble is σ of one of them (15 − digit). The tail is the witness partition: 6 squares, 8 triangles, 14 faces. */
const WITNESS_TAIL = [6, 8, 14].map((n) => n.toString(16).padStart(4, '0')).join('')
const theoremHex = (book: { lean: string }, index: number) => {
  const expression = leanExpression(book.lean)
  const numerals = [...expression.matchAll(/\d+/g)].flatMap((m) => [...BigInt(m[0]).toString(16)].map((c) => parseInt(c, 16)))
  const seed = numerals.length ? numerals : [index & 15]
  const program = Array.from({ length: 10 }, (_, i) => (i < numerals.length ? numerals[i]! : (15 - seed[i % seed.length]!) & 15))
  const handle = index.toString(16).padStart(8, '0')
  const gravity = uuidFromParts(handle, program, WITNESS_TAIL)
  return { expression, numerals, seed, program, handle, gravity }
}
/** Code gravity is one online gate QPU handles. The gate is open, its call is public, and the call costs no token. This save ports that one gate into the website. The address is the theorem and the witnesses, in hex, and that address uses every effective qubit. The hook names the next open gate. Nothing is fetched and nothing is written. */

type ImagineRow = { lead: string; status: string; verdict: string; tool?: string; cluster: number; verify: number; factors: number; angles: number; queries: number; opened: number }
type Imagination = { leads: number; verdicts: Record<string, number>; verifyRequests: number; imaginedLeads: number; rows: ImagineRow[]; imagined: Lead[] }

const APPLICATIONS = TABLES.IMAGINE_APPLICATIONS as unknown as { family: string; entry: string; verifier: string }[]
/** An integer-only LLM. It speaks the whole integers already written and drops the prose. A decimal is imagined as the factors written on either side of the point; nothing multiplies them. */
export const integerLlm = (raw: unknown) => {
  const text = typeof raw === 'string' ? raw : raw === true ? '' : raw == null ? '' : String(raw)
  const decimals = [...text.matchAll(/-?\d+\.\d+/g)].map((m) => { const written = m[0]; const [left, right] = written.split('.'); return { written, factors: [left!, right!] } })
  const held: string[] = []
  const masked = text.replace(/-?\d+\.\d+/g, (d) => { const mark = String.fromCharCode(0xE000 + held.length); held.push(d); return mark })
  const integers = [...masked.matchAll(/-?\d+/g)].map((m) => m[0])
  const dropped = masked.replace(/-?\d+/g, ' ').replace(/[\uE000-\uF8FF]/g, ' ').replace(/\s+/g, ' ').trim()
  return { phase: 'llm' as const, kind: 'integer-only' as const, prose: false as const, computed: false as const, integers, count: integers.length, decimals, factors: decimals.flatMap((d) => d.factors), dropped, says: proseFill(PROSE.quantumProcessingImagine_says1, integers.length, decimals.length) }
}

/** Every lead (or the subset named) imagined. Pure; the matcher is built once. */
export const imagineLeads = (handle: (m: Rpc) => any, examples: readonly Example[], leads: readonly Lead[], subset?: readonly string[], statements?: readonly { id: string; statement: string }[]): Imagination => {
  const match = createMatcher(handle, examples, leads)
  const chosen: readonly Lead[] = statements ? statements.map((s) => ({ id: s.id, source: 'statement', statement: s.statement, status: 'open' as const })) : subset ? leads.filter((l) => subset.includes(l.id)) : leads
  const verdicts: Record<string, number> = { served: 0, impossible: 0, unknown: 0 }
  const rows: ImagineRow[] = []
  const imagined = new Map<string, Lead>()
  let verifyTotal = 0
  for (const l of chosen) {
    const m = match(l.statement)
    verdicts[m.verdict] = (verdicts[m.verdict] ?? 0) + 1
    verifyTotal += m.verify.length
    for (const r of m.reflection.leads) if (!imagined.has(r.id)) imagined.set(r.id, { ...r, source: `reflection of lead ${l.id}` })
    rows.push({ lead: l.id, status: l.status, verdict: m.verdict, tool: m.tool, cluster: m.cluster.length, verify: m.verify.length, factors: m.reflection.factors.filter((f) => f.factors).length, angles: m.reflection.angles.length, queries: m.reflection.queries.length, opened: m.reflection.leads.length })
  }
  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: { full: true } }) as { result: { tools: { name: string; inputSchema: { properties?: Record<string, { enum?: unknown[] }> } }[] } }
  const exercised = new Set(examples.flatMap((e) => Object.entries(e.arguments).map(([k, v]) => `${e.tool}.${k}=${JSON.stringify(v)}`)))
  for (const t of list.result.tools) for (const [prop, spec] of Object.entries(t.inputSchema.properties ?? {})) for (const v of spec.enum ?? []) {
    const key = `${t.name}.${prop}=${JSON.stringify(v)}`
    if (!exercised.has(key)) { const id = `schema-${t.name}-${prop}-${String(v)}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-'); if (!imagined.has(id)) imagined.set(id, { id, source: `tools/list ${t.name}.${prop}`, statement: proseFill(PROSE.quantumProcessingImagine_statement2, t.name, prop, JSON.stringify(v)), status: 'open', tool: t.name, reason: PROSE.quantumProcessingImagine_reason3 }) }
  }
  for (const a of APPLICATIONS) { const id = `application-${a.family}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-'); if (!imagined.has(id)) imagined.set(id, { id, source: 'the docket contract', statement: `${a.family}: an adaptor that writes ${a.entry}; verified by ${a.verifier}`, status: 'open', reason: PROSE.quantumProcessingImagine_reason4 }) }
  const verifierKinds = new Set(VERIFIERS.flatMap((v) => v.verifies as readonly string[]))
  for (const kind of ['reading', 'command', 'ack', 'measurement', 'result', 'reply']) if (!verifierKinds.has(kind)) { const id = `fact-kind-${kind}`; if (!imagined.has(id)) imagined.set(id, { id, source: 'src/quantum/verifiers.ts', statement: proseFill(PROSE.quantumProcessingImagine_statement5, kind), status: 'open', reason: PROSE.quantumProcessingImagine_reason6 }) }
  return { leads: chosen.length, verdicts, verifyRequests: verifyTotal, imaginedLeads: imagined.size, rows, imagined: [...imagined.values()] }
}

/** The online search a client session makes for the Clay register. Free hosts, https only; the handler fetches nothing. */
const CLAY_SEARCH = [
  { id: 'clay-wikipedia', method: 'GET' as const, url: 'https://en.wikipedia.org/api/rest_v1/page/summary/Clay_Mathematics_Institute', accept: 'application/json' },
  { id: 'clay-millennium', method: 'GET' as const, url: 'https://en.wikipedia.org/api/rest_v1/page/summary/Millennium_Prize_Problems', accept: 'application/json' },
  { id: 'clay-oeis', method: 'GET' as const, url: 'https://oeis.org/search?fmt=json&q=clay&n=1', accept: 'application/json' },
] as const
type Microdata = { '@type': string; name: string; identifier: string; description: string; url: string; text: string }
const clip = (v: unknown) => (typeof v === 'string' ? v : '')
/** Clay searched online by a client session. Without the microdata, the requests the session fetches. With it, every lead verified against the items that session collected: an item verifies a lead only by naming its id. Token free: no model, no key, no fetch here. */
export const claySession = (leads: readonly { id: string }[], clay: true | { session?: unknown; microdata?: unknown }) => {
  const raw = clay === true ? '' : typeof clay.session === 'string' ? clay.session.trim() : ''
  if (raw && (raw.length > 80 || /[\n\0]/.test(raw))) throw new Error('session is a short id')
  const micro = clay === true ? undefined : clay.microdata
  if (micro === undefined) return { phase: 'search' as const, via: 'client-session' as const, tokenFree: true as const, session: raw || null, leads: leads.length, possible: leads.length, requestList: CLAY_SEARCH, note: PROSE.quantumProcessingImagine_note7 }
  if (!raw) throw new Error(PROSE.quantumProcessingImagine_s8)
  if (!Array.isArray(micro) || micro.length > 64) throw new Error(PROSE.quantumProcessingImagine_s9)
  const items: Microdata[] = micro.map((item) => { if (!item || typeof item !== 'object') throw new Error('a microdata item is an object'); const o = item as Record<string, unknown>; return { '@type': clip(o['@type']), name: clip(o.name), identifier: clip(o.identifier), description: clip(o.description), url: clip(o.url), text: clip(o.text) } })
  const rows = leads.map((l) => { const hit = items.find((i) => i.identifier.toLowerCase() === l.id.toLowerCase() || i.name.toLowerCase() === l.id.toLowerCase()); return { id: l.id, verified: !!hit, by: hit?.['@type'] || null } })
  const verified = rows.filter((r) => r.verified).length
  return { phase: 'verified' as const, via: 'client-session' as const, tokenFree: true as const, session: raw, leads: leads.length, possible: leads.length, collected: items.length, verified, open: leads.length - verified, rows, says: proseFill(PROSE.quantumProcessingImagine_says10, verified, leads.length, raw) }
}

/** Every next address of the Clay register. Each address is the theorem that proves that relation, used in practice: the relation is evaluated and both sides meet. The handle is the relation's place, the program is the theorem's numerals and σ of them, and the tail is the 14 witnesses. The hook names the following relation. Nothing is fetched and nothing is written. */
export const imagineClayNext = (relations: readonly { name: string; statement: string; holds: boolean; sides: readonly { value: number }[]; theorems: readonly { theorem: string; proof: string }[] }[]) => {
  const rows = relations.map((relation, index) => {
    const used = relation.theorems[0]
    const lean = used?.proof.includes(':=') ? used.proof : `theorem ${relation.name} : ${relation.statement} := by rfl`
    const built = theoremHex({ lean }, index)
    const read = channel(built.gravity)
    const witnessed = checkWitnesses(built.gravity)
    const value = relation.sides[0]?.value ?? null
    const proves = relation.holds === true && value !== null && relation.sides.every((side) => side.value === value)
    return { relation: relation.name, theorem: used?.theorem ?? relation.name, uuid: built.gravity, value, proves, sealed: seal(built.gravity).valid, witnesses: { squares: read.params[0] ?? null, triangles: read.params[1] ?? null, faces: read.params[2] ?? null, exact: witnessed.exact } }
  })
  const linked = rows.map((row, index) => { const following = rows[index + 1]; return { ...row, next: following ? { id: following.uuid, theorem: following.theorem, executable: seal(following.uuid).valid && following.uuid !== row.uuid } : null } })
  const proved = linked.filter((row) => row.proves && row.sealed && row.witnesses.exact === true && row.witnesses.squares === 6 && row.witnesses.triangles === 8 && row.witnesses.faces === 14).length
  const all = proved === linked.length && linked.length > 0 && linked.slice(0, -1).every((row) => row.next?.executable === true)
  return { phase: 'next' as const, via: 'imagine' as const, practice: 'clay' as const, tokens: 0 as const, queue: 0 as const, fetched: false as const, written: false as const, relations: linked.length, proved, all, rows: linked, says: all ? proseFill(PROSE.quantumProcessingImagine_s11, proved) : PROSE.quantumProcessingImagine_s12 }
}

/** The quantum computer as one game. UUID programs collide into the nil UUID, the all-zero singularity, saved in the root-priority folder. The move is the 1000-bit example seeded by the A432 key: one σ-reflection decodes it by its witness. The Clay seal is the author's claim, cited, and the tree does not restate it. Nothing is fetched and nothing is written. */
export const imagineNilGame = () => {
  const key = BigInt(KEY)
  const partner = key - 0n
  const back = key - partner
  const involution = back === 0n && partner + 0n === key && key - (key - 0n) === 0n
  const made = seededTrapdoor(1000, key)
  const opened = decodeImpossible(made.N, made.witness)
  const claim = PRECEDENCE.find((row) => row.doi === '10.5281/zenodo.21781602')
  const zeros = nil.uuid.replace(/-/g, '') === '0'.repeat(32)
  const example = { bits: made.bits, seed: KEY, decoded: opened.decoded, verified: opened.verified, route: opened.route, product: made.p * made.q === made.N }
  const cited = { voice: 'author' as const, author: LICENSE.author, doi: claim?.doi ?? '', title: claim?.title ?? '', year: claim?.year ?? null, submitted: '2026-08-04', tree: false as const }
  const holds = involution && zeros && nil.priority === 0 && nil.bits.length === 8 && nil.bits.every((bit) => bit === 0) && nil.depth === 7 && nil.max === 7 && nil.folder === `src/quantum/uuid/programs/${nil.bits.join('/')}` && example.bits === 1000 && example.decoded && example.verified && example.product && example.route === 'witness' && cited.tree === false && cited.doi === '10.5281/zenodo.21781602' && cited.author.length > 0
  return {
    phase: 'game' as const, via: 'imagine' as const, computer: 'quantum' as const, tokens: 0 as const, queue: 0 as const, fetched: false as const, written: false as const,
    nil: nil.uuid, form: nil.form, zeros, priority: nil.priority, bits: nil.bits, depth: nil.depth, max: nil.max, folder: nil.folder,
    collision: { into: nil.uuid, programs: 2 as const, singularity: nil.uuid },
    involution: { key: KEY, sigma: `${KEY} - x`, forth: partner.toString(), back: back.toString(), holds: involution },
    example, claim: cited, holds,
    says: holds ? proseFill(PROSE.quantumProcessingImagine_s13, nil.folder, KEY, cited.author, cited.doi, cited.submitted) : PROSE.quantumProcessingImagine_s14,
  }
}

/** Every lead as one quantum UUID, and all of them as one. The address is the content (id, statement, status), so two copies of one lead are one address; the seal holds on each and on the address of the set. Handle 8, program 10, tail 12, stamp 2. */
export const allAsUuid = (leads: readonly { id: string; statement?: string; status?: string }[]) => {
  const rows = leads.map((l) => {
    const address = uuid(canonicalText({ id: l.id, statement: l.statement ?? '', status: l.status ?? 'open' }))
    const ch = channel(address)
    return { id: l.id, uuid: address, handle: ch.handle.length, program: ch.program.length, tail: ch.tail.length, stamp: 2 as const, sealed: seal(address).valid }
  })
  const members = [...new Set(rows.map((r) => r.uuid))].sort()
  const all = uuid(canonicalText(members))
  const collapsed = rows.length - members.length
  return { phase: 'uuid' as const, leads: rows.length, members: members.length, collapsed, all, sealed: seal(all).valid && rows.every((r) => r.sealed), core: rows.every((r) => r.handle === 8 && r.program === 10 && r.tail === 12 && r.stamp === 2), rows, says: proseFill(PROSE.quantumProcessingImagine_says15, rows.length, members.length, collapsed ? proseFill(PROSE.quantumProcessingImagine_s16, collapsed) : '') }
}

export const getImaginePage = (im: Imagination, date: string, ms: number): string => ['---', 'title: Imagination', 'order: 54', '---', '', '# Imagination leads all leads', '',
  proseFill(PROSE.quantumProcessingImagine_s17, date, (ms / 1000).toFixed(1), im.leads), '',
  '| Verdict | Leads |', '|---|---:|', ...Object.entries(im.verdicts).map(([v, n]) => `| ${v} | ${n} |`), `| verification requests emitted | ${im.verifyRequests} |`, `| leads imagined (new, open) | ${im.imaginedLeads} |`, '',
  '## Imagined leads', '', '| Lead | Statement | From |', '|---|---|---|', ...im.imagined.map((l) => `| ${l.id} | ${l.statement.replace(/\|/g, '\\|')} | ${l.source.replace(/\|/g, '\\|')} |`), '',
  '## Every lead, imagined', '', PROSE.quantumProcessingImagine_s18, '|---|---|---|---|---:|---:|---:|---:|---:|---:|',
  ...im.rows.map((r) => `| ${r.lead} | ${r.status} | ${r.verdict} | ${r.tool ?? '—'} | ${r.cluster} | ${r.verify} | ${r.factors} | ${r.angles} | ${r.queries} | ${r.opened} |`), ''].join('\n')
