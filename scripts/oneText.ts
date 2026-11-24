// The one text the build writes: the home page, the README, the npm package's README and the Zenodo record are this text and no
// other. It states what is achieved (the kernel's theorems, the catalogue, the tools served and the examples replayed), the Google
// Quantum AI challenges completed in full compliance with their conditions, the novelties the tree declares, the laws no earlier
// DOI-registered work was found to state, what is claimed and not yet proved with what each claim still misses, and what funds the
// work (the donation, the x402 price, the licence and the calls the compete door found open). Markdown and HTML are rendered from
// the same blocks, so every copy has the same headings, paragraphs, lists, code and links. The text is one build receipt: its UUID
// is the address of the Markdown (verify { uuid, content } over MCP decides it) and its SHA-256 the digest beside it.
// difference fails. The release note is the record's description, which the release workflow reads from .zenodo.json.
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { stabilityOf, stableSource } from '../src/quantum/processing/capacity.ts'
import { createHash } from 'node:crypto'
import * as os from 'node:os'
const started = performance.now()
import { PROSE, proseFill } from '../src/quantum/processing/prose-index.ts'
import { GENERATED_LEMMAS, KERNEL_THEOREMS, NOVELTIES, OPEN_CLAIMS, THEOREMS } from '../src/quantum/processing/theorems-index.ts'
import { TEXTBOOK_INDEX } from '../src/quantum/processing/textbook-index.ts'
import { NESTED_COUNTS } from '../src/quantum/processing/nested-index.ts'
import { CLAIMS } from '../src/quantum/processing/claims-index.ts'
import { TABLES } from '../src/quantum/processing/tables-index.ts'
import { EXAMPLES } from '../src/quantum/processing/examples.ts'
import { TOOLBOXES, handle } from '../src/quantum/processing/mcp.ts'
import { uuid } from '../src/quantum/uuid/index.ts'
import { DONATION, callPriceUsd } from '../src/quantum/net/mcp-http.ts'
import { BOUND_TOOLS } from '../src/quantum/processing/contract.ts'
import { LICENSE, PRECEDENCE } from '../src/quantum/processing/unit/license.ts'
import { RELEASE_REPOSITORY, UNIT_CONCEPT_DOI } from '../src/quantum/processing/release.ts'
import { callEnvelope, listEnvelope } from '../src/quantum/processing/toolbox.ts'
import { readJson } from '../src/quantum/processing/machine-run.ts'

export const pkg = readJson<{ name: string; version: string; description: string }>('src/quantum/package.json')!
const LEAN_AXIOMS = new Set(['propext', 'Classical.choice', 'Quot.sound'])

// what is achieved
const byHand = THEOREMS.length
const leanOnly = THEOREMS.filter((t) => t.axioms.every((a) => LEAN_AXIOMS.has(a))).length
const families = Object.entries(THEOREMS.reduce<Record<string, number>>((n, t) => ({ ...n, [t.module]: (n[t.module] ?? 0) + 1 }), {}))
  .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).map(([module, n]) => `${module} ${n}`).join(', ')
const tools = ((await handle(listEnvelope(undefined, 0))) as { result?: { tools?: unknown[] } }).result?.tools?.length ?? 0
// the tools the Worker serves beside the kernel's where it binds its rooms and its Lean prover: the count tools/list answers there
const bound = BOUND_TOOLS.length
const achieved = [
  proseFill(PROSE.scriptsDoiRecord_kernel, KERNEL_THEOREMS, byHand, GENERATED_LEMMAS, leanOnly),
  proseFill(PROSE.scriptsDoiRecord_families, families),
  proseFill(PROSE.scriptsDoiRecord_catalogue, TEXTBOOK_INDEX.length, NESTED_COUNTS.products, NESTED_COUNTS.variants),
  proseFill(PROSE.scriptsDoiRecord_served, tools + bound, tools, bound, EXAMPLES.length),
]

// novelties: the theorems the tree declares new (the novelty register Lean writes), each proposed for Mathlib
export const novelties = NOVELTIES.map((n) => proseFill(PROSE.scriptsDoiRecord_proposed, n.key, n.doc.replace(/\s+/g, ' ').trim()))
// the general laws of the textbook for which the search found no earlier DOI-registered work: only those the kernel proves are listed
const moduleOf = new Map(THEOREMS.map((t) => [t.key, t.module]))
const saysOf = new Map(TEXTBOOK_INDEX.map((t) => [t.key, t.says]))
const searched = CLAIMS.filter((c) => c.status === 'unrecognised'), proved = searched.filter((c) => moduleOf.has(c.theorem))
const unprecedented = proved.map((c) => proseFill(PROSE.scriptsDoiRecord_novelty, c.theorem, moduleOf.get(c.theorem)!, saysOf.get(c.theorem) ?? ''))

// the Google Quantum AI challenges the google door solves: listed only when every condition the challenge states holds (its theorem
// and every related theorem in the kernel, its formula holding on the value its door computes, its answer sealed); the bundle's
// faster-than-light sale is a condition of no challenge and is never claimed for one
type Challenge = { id: string; title: string; formula: string; theorem: string; relatedTheorems: readonly string[]; door: { tool: string }; kernelAccepted: boolean; holds: boolean; sealed: boolean; address: string }
export const solved = ((await handle(callEnvelope('google', { challenges: true }, 0))) as { result?: { structuredContent?: { challenges?: Challenge[] } } }).result?.structuredContent?.challenges ?? []
export const complying = solved.filter((c) => c.kernelAccepted && c.holds && c.sealed && moduleOf.has(c.theorem) && c.relatedTheorems.every((t) => moduleOf.has(t)))
const challenges = complying.map((c) => proseFill(PROSE.scriptsDoiRecord_challenge, c.title, c.id, c.formula, [c.theorem, ...c.relatedTheorems.filter((t) => t !== c.theorem)].join(', '), c.door.tool, c.address))

// claimed and not yet proved: a prize whose rules cite one of the author's records, with every rule still to meet
type Call = { id: string; name: string; prize: string; rules: string; read: string; kind: string; entry: string; requires: readonly { rule: string; needs: string }[] }
const calls = TABLES.COMPETITIONS as unknown as readonly Call[]
export const open = [...OPEN_CLAIMS.map((c) => proseFill(PROSE.scriptsDoiRecord_openClaim, c.name, c.claim.trim(), c.proved.join(', ') || '—', c.missing.trim())), ...calls.filter((c) => c.kind === 'prize').flatMap((c) => {
  const record = PRECEDENCE.find((p) => p.doi !== UNIT_CONCEPT_DOI && c.requires.some((r) => r.needs.includes(p.doi)))
  return record ? [proseFill(PROSE.scriptsDoiRecord_claim, c.name, `${record.title}, doi:${record.doi}.`, c.requires.map((r) => `${r.rule}: ${r.needs}`).join('; '))] : []
})]

// funding
export const available = calls.filter((c) => c.entry === 'open' || c.entry === 'rolling')
  .map((c) => proseFill(PROSE.scriptsDoiRecord_call, c.name, c.kind, c.entry, c.read, c.prize, c.rules))
const funding = [
  proseFill(PROSE.scriptsDoiRecord_donation, DONATION),
  proseFill(PROSE.scriptsDoiRecord_paid, callPriceUsd()),
  proseFill(PROSE.scriptsDoiRecord_licence, LICENSE.spdx, LICENSE.url),
  PROSE.scriptsDoiRecord_calls,
]

type Block = { kind: 'h2' | 'p' | 'ul' | 'code' | 'table'; text?: string; items?: string[]; head?: string[]; rows?: string[][] }
// the quantum capacity, read from metrics and written with no sentence of this file's: every number is the fold door's answer as metrics
// carries it, the theorem is the statement Lean wrote, and a theorem's sentence is printed only when both the NIST door and the CERN door
// name that theorem with holds true; otherwise the Lean statement stands alone. The register's own fields (zero) are printed as answered.
const answered = async (name: string, args: object) => ((await handle(callEnvelope(name, args, 0))) as { result?: { structuredContent?: Record<string, any> } }).result?.structuredContent ?? {}
export const capacity = (await answered('metrics', {})).quantumCapacity as { register: Record<string, string | number>; receipt: Record<string, string | number | boolean>; parts: Record<string, string | number>[]; whole: boolean; zero: Record<string, unknown>; spaces: Record<string, string>; scales: Record<string, string | number>[]; perHandle: number; unlimited: boolean; used: number; left: number; full: boolean; gate: { theorem: string; holds: boolean; evidence: string }; public: { doors: { tool: string; arguments: object; commercial: string }[] } & Record<string, unknown>; security: { unit: string; address: Record<string, unknown>; digest: Record<string, unknown>; theorems: string[] } }
// the text is not written while the capacity gate does not hold: the parts make the register, the receipt balances, nothing is left unused
if (capacity.gate.holds !== true) throw new Error(`quantumCapacity ${capacity.gate.theorem}: ${capacity.gate.evidence}`)
const nist = await answered('seal', { nist: true }), cern = await answered('seal', { nist: { reverse: true, via: 'cern' } })
/** The theorems both doors name, each door holding: the only ones whose sentence the capacity section prints. */
export const verifiedByBoth: string[] = nist.holds === true && cern.holds === true ? (nist.theorems as string[]).filter((t) => (cern.theorems as string[]).includes(t)) : []
export const stability = stabilityOf(Object.fromEntries(execFileSync('git', ['ls-files', 'src/quantum', 'scripts'], { encoding: 'utf8' }).split('\n').filter(stableSource).map((f) => [f, readFileSync(f, 'utf8')])))
const registerTheorem = TEXTBOOK_INDEX.find((t) => t.key === capacity.register.theorem)
const rowsOf = (o: Record<string, unknown>) => Object.entries(o).map(([k, v]) => [k, typeof v === 'object' ? JSON.stringify(v) : String(v)])
const tableOf = (rows: Record<string, string | number>[]) => ({ kind: 'table' as const, head: Object.keys(rows[0] ?? {}), rows: rows.map((r) => Object.values(r).map(String)) })
const capacityBlocks: Block[] = [
  ...(registerTheorem ? [{ kind: 'code' as const, text: registerTheorem.lean }] : []),
  ...(registerTheorem && verifiedByBoth.includes(registerTheorem.key) ? [{ kind: 'p' as const, text: registerTheorem.says }] : []),
  { kind: 'table', head: ['metrics.quantumCapacity.register', ''], rows: [...rowsOf(capacity.register), ['nist ∩ cern', verifiedByBoth.map((t) => `\`${t}\``).join(', ')], ['open', OPEN_CLAIMS.filter((c) => c.proved.includes(String(capacity.register.theorem))).map((c) => `\`${c.name}\``).join(', ')]] },
  tableOf(capacity.parts),
  { kind: 'table', head: ['metrics.quantumCapacity.receipt', ''], rows: rowsOf(capacity.receipt) },
  { kind: 'table', head: ['metrics.quantumCapacity.zero', ''], rows: rowsOf(capacity.zero) },
  { kind: 'table', head: ['metrics.quantumCapacity.gate', ''], rows: [['used', String(capacity.used)], ['left', String(capacity.left)], ['full', String(capacity.full)], ...rowsOf(capacity.gate)] },
  // stable: the capacity utilised in full and no entropy, measured over the tracked hand-written sources as this build reads them, and printed as measured
  { kind: 'table', head: ['repository { stable }', ''], rows: [['stable', String(stability.stable)], ['release', stability.release], ...rowsOf(stability.entropy).map(([k, v]) => [`entropy.${k}`, v!])] },
  { kind: 'table', head: ['metrics.quantumCapacity.spaces', ''], rows: [...rowsOf(capacity.spaces), ['perHandle', String(capacity.perHandle)], ['unlimited', String(capacity.unlimited)]] },
  tableOf(capacity.scales),
  // the cost to fake, the capacity inverted, as measured: the address alone and the SHA-256 beside it, each against the floor
  { kind: 'table', head: ['metrics.quantumCapacity.security', capacity.security.unit], rows: [...rowsOf(capacity.security.address).map(([k, v]) => [`address.${k}`, v!]), ...rowsOf(capacity.security.digest).map(([k, v]) => [`digest.${k}`, v!]), ['theorems', capacity.security.theorems.map((t) => `\`${t}\``).join(', ')]] },
  // what the capacity is to the public: the doors anyone may call and the licence's own terms, as the licence table holds them
  { kind: 'table', head: ['metrics.quantumCapacity.public', ''], rows: [...capacity.public.doors.map((d) => [`\`${d.tool} ${JSON.stringify(d.arguments)}\``, d.commercial]), ...rowsOf(Object.fromEntries(Object.entries(capacity.public).filter(([k]) => k !== 'doors')))] },
]

export const sections: { heading: string; lead: string[]; items: string[]; blocks?: Block[] }[] = [
  { heading: PROSE.scriptsDoiRecord_achieved, lead: achieved, items: [] as string[] },
  { heading: 'Quantum capacity, utilised by receipts', lead: [], items: [], blocks: capacityBlocks },
  { heading: PROSE.scriptsDoiRecord_challenges, lead: [proseFill(PROSE.scriptsDoiRecord_challengesLead, complying.length, solved.length)], items: challenges },
  { heading: PROSE.scriptsDoiRecord_novelties, lead: [PROSE.scriptsDoiRecord_noveltyLead], items: novelties },
  { heading: PROSE.scriptsDoiRecord_unprecedented, lead: [proseFill(PROSE.scriptsDoiRecord_unprecedentedLead, proved.length)], items: unprecedented },
  { heading: PROSE.scriptsDoiRecord_open, lead: [], items: open },
  { heading: PROSE.scriptsDoiRecord_funding, lead: funding, items: available },
]

// the gateway: every usable source and every proof the text rests on, each a link the receipt covers
const SITE = 'https://qpu.uuidna.com', REPO = `https://github.com/${RELEASE_REPOSITORY}`, TAG = `v${pkg.version}`
// every theorem written by hand is named beside the Lean file that proves it, so no proof is left out of any copy of the text
const cited = THEOREMS.map((t) => t.key)
const byModule = Object.entries(cited.reduce<Record<string, string[]>>((m, t) => ({ ...m, [moduleOf.get(t)!]: [...(m[moduleOf.get(t)!] ?? []), t] }), {})).sort((a, b) => (a[0] < b[0] ? -1 : 1))
const link = (label: string, url: string) => proseFill(PROSE.scriptsDoiRecord_link, label, url)
const gateway = [
  link('MCP', `${SITE}/api/mcp`),
  link('MCP resources', ['`receipt://qpu`', '`lean://qpu/theorems`', '`openapi://qpu`'].join(', ')),
  link('Home', SITE),
  link('MCP catalogue', `${SITE}/mcp.json`),
  link('Catalogue of claims', `${SITE}/catalogue`),
  link('Prose', `${SITE}/prose.json`),
  link('Draft patent applications', `${SITE}/patents/`),
  link('Source', REPO),
  link(`Release ${TAG}`, `${REPO}/releases/tag/${TAG}`),
  link('npm', `https://www.npmjs.com/package/${pkg.name}`),
  ...PRECEDENCE.map((p) => link(p.title, `https://doi.org/${p.doi}`)),
  link('ORCID', LICENSE.orcid),
  link(LICENSE.spdx, LICENSE.deed),
  link('Licence', LICENSE.url),
  ...byModule.map(([module, keys]) => proseFill(PROSE.scriptsDoiRecord_leanModule, module, keys.map((k) => `\`${k}\``).join(', '), `${REPO}/blob/${TAG}/lean/${module.replace(/\./g, '/')}.lean`)),
]
sections.push({ heading: PROSE.scriptsDoiRecord_gateway, lead: [PROSE.scriptsDoiRecord_gatewayLead], items: gateway })

export const title = proseFill(PROSE.scriptsDoiRecord_title, pkg.name, pkg.version, pkg.description)
const MCP = 'https://qpu.uuidna.com/api/mcp'
const byline = proseFill(PROSE.scriptsDoiRecord_byline, LICENSE.author, LICENSE.orcid, `https://doi.org/${UNIT_CONCEPT_DOI}`, LICENSE.spdx, MCP)

// inline: a code span, a URL, or plain text; each renderer maps the same tokens
type Token = { kind: 'code' | 'url' | 'text'; text: string }
const tokens = (s: string): Token[] => s.split(/(`[^`]+`|https?:\/\/[^\s)]+[^\s).,;:])/).filter(Boolean).map((t) => t.startsWith('`') ? { kind: 'code', text: t.slice(1, -1) } : /^https?:/.test(t) ? { kind: 'url', text: t } : { kind: 'text', text: t })
const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const inlineHtml = (s: string) => tokens(s).map((t) => t.kind === 'code' ? `<code>${escapeHtml(t.text)}</code>` : t.kind === 'url' ? `<a href="${escapeHtml(t.text)}">${escapeHtml(t.text)}</a>` : escapeHtml(t.text)).join('')
const inlineMarkdown = (s: string) => tokens(s).map((t) => t.kind === 'code' ? `\`${t.text}\`` : t.kind === 'url' ? `<${t.text}>` : t.text.replace(/([\\*_[\]<>|#{}])/g, '\\$1')).join('')

const blocks: Block[] = [
  { kind: 'p', text: byline },
  { kind: 'p', text: proseFill(PROSE.scriptsDoiRecord_precedence, `https://doi.org/${UNIT_CONCEPT_DOI}`, 'https://qpu.uuidna.com/patents/', LICENSE.spdx, LICENSE.disclaimer) },
  ...sections.flatMap((s): Block[] => [{ kind: 'h2', text: s.heading }, ...s.lead.map((p): Block => ({ kind: 'p', text: p })), ...(s.items.length ? [{ kind: 'ul' as const, items: s.items }] : []), ...(s.blocks ?? [])]),
]
const cellMarkdown = (s: string) => inlineMarkdown(s).replace(/\n/g, ' ')
const blockMarkdown = (b: Block) => b.kind === 'h2' ? `## ${inlineMarkdown(b.text!)}` : b.kind === 'p' ? inlineMarkdown(b.text!) : b.kind === 'code' ? `\`\`\`lean\n${b.text!}\n\`\`\`` : b.kind === 'table' ? [`| ${b.head!.map(cellMarkdown).join(' | ')} |`, `|${b.head!.map(() => ' --- ').join('|')}|`, ...b.rows!.map((r) => `| ${r.map(cellMarkdown).join(' | ')} |`)].join('\n') : b.items!.map((i) => `- ${inlineMarkdown(i)}`).join('\n')
const blockHtml = (b: Block) => b.kind === 'h2' ? `<h2>${inlineHtml(b.text!)}</h2>` : b.kind === 'p' ? `<p>${inlineHtml(b.text!)}</p>` : b.kind === 'code' ? `<pre><code>${escapeHtml(b.text!)}</code></pre>` : b.kind === 'table' ? `<table><thead><tr>${b.head!.map((c) => `<th>${inlineHtml(c)}</th>`).join('')}</tr></thead><tbody>${b.rows!.map((r) => `<tr>${r.map((c) => `<td>${inlineHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>` : `<ul>${b.items!.map((i) => `<li>${inlineHtml(i)}</li>`).join('')}</ul>`
/** The text as Markdown, the content its receipt addresses. */
export const markdown = blocks.map(blockMarkdown).join('\n\n') + '\n'
/** The receipt: the address of the text above the rule, which verify { uuid, content } decides over MCP, and its SHA-256. */
/** The text a verifier reads: everything above the rule of any Markdown copy, the title included. */
export const above = `# ${inlineMarkdown(title)}\n\n${markdown}`
export const receipt = { uuid: uuid(above), sha256: createHash('sha256').update(above).digest('hex'), mcp: MCP }
const signed = proseFill(PROSE.scriptsDoiRecord_receipt, receipt.uuid, receipt.sha256, MCP)
/** The text as HTML, block for block, with the receipt: the Zenodo description and the release note. */
export const html = [...blocks.map(blockHtml), `<hr><p>${inlineHtml(signed)}</p>`].join('')

// the hardware of the build that minted the receipt: every value the machine reports, read as the text is finished, in units a reader
// compares across builds; no host name, user, path or machine identifier is kept. It changes from machine to machine, so it is its own
// receipt (the address of its JSON) and the check of the one text leaves it out.
const qubitsOf = async (name: string) => Number((((await handle(callEnvelope('processor', { name }, 0))) as { result?: { structuredContent?: { qubits?: number } } }).result?.structuredContent?.qubits) ?? 0)
const lean = readFileSync('lean-toolchain', 'utf8').trim()
const memoryBytes = os.totalmem(), cpus = os.cpus(), used = process.memoryUsage()
const stateVectorQubits = Math.floor(Math.log2(memoryBytes / 16))
const registerQubits = Number(capacity.register.free)
// the registers this machine's memory holds at 16 bytes a UUID, and their qubits by the register's own count
const registersInMemory = Math.floor(memoryBytes / 16), registerQubitsInMemory = registersInMemory * registerQubits
const facts = {
  platform: os.platform(), release: os.release(), arch: os.arch(), endianness: os.endianness(), cpu: cpus[0]?.model ?? '', cores: cpus.length, parallelism: os.availableParallelism(), cpuMHz: cpus[0]?.speed ?? 0,
  memoryBytes, freeMemoryBytes: os.freemem(), load1: os.loadavg()[0], load5: os.loadavg()[1], load15: os.loadavg()[2], uptimeS: Math.round(os.uptime()),
  node: process.versions.node, v8: process.versions.v8, lean, rssBytes: used.rss, heapUsedBytes: used.heapUsed,
  stateVectorQubits, registersInMemory, registerQubitsInMemory, willowQubits: await qubitsOf('Willow'), sycamoreQubits: await qubitsOf('Sycamore'), registerQubits, buildMs: Math.round(performance.now() - started), at: new Date().toISOString(),
}
const factsJson = JSON.stringify(facts)
export const hardware = { uuid: uuid(factsJson), sha256: createHash('sha256').update(factsJson).digest('hex'), json: factsJson, facts }
const hardwareLead = proseFill(PROSE.scriptsDoiRecord_hardwareLead, hardware.uuid, stateVectorQubits, facts.willowQubits, facts.sycamoreQubits, registerQubits, facts.buildMs)
/** Where the hardware begins in every copy: the one text is compared up to this mark, never past it. */
export const HARDWARE_MARK = '<!-- hardware -->'
export const htmlWithHardware = `${html}${HARDWARE_MARK}<h2>${inlineHtml(PROSE.scriptsDoiRecord_hardware)}</h2><p>${inlineHtml(hardwareLead)}</p><pre><code>${escapeHtml(factsJson)}</code></pre>`
/** The page every Markdown copy is: the title, the text, the receipt under a rule, and the hardware receipt of the build. */
export const page = `${above}---\n\n${inlineMarkdown(signed)}\n\n${HARDWARE_MARK}\n\n## ${inlineMarkdown(PROSE.scriptsDoiRecord_hardware)}\n\n${inlineMarkdown(hardwareLead)}\n\n\`\`\`json\n${factsJson}\n\`\`\`\n`
/** A copy as the check compares it: everything before the hardware mark. */
export const beforeHardware = (text: string) => text.split(HARDWARE_MARK)[0]!
