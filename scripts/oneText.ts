// The one text the build writes, loaded from sealed receipts: the home page, the README, the npm package's README and the Zenodo record
// are this text and no other. It states the theorems Lean holds that the NIST door and the CERN door both name while each holds, and
// nothing else (src/quantum/processing/verified.ts): each is one receipt (src/quantum/processing/receipts.ts), sealed by the seal door
// under the UUID of its kind and canonical text, as schema.org JSON-LD with the formula Lean wrote, its cost, the licence, the donation
// link and the device that minted it. The text is the merge of those receipts: the RFC 6962 root the seal door computes over their
// UUIDs, so the merge is decided from the handles and UUIDs alone. Every table is rendered from a receipt's JSON-LD and nothing else:
// no sentence is written here or filled in from a template. The text itself is one more receipt, the address of its Markdown, which
// verify { uuid, content } decides over MCP.
import { readFileSync, statfsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import * as os from 'node:os'
const started = performance.now()
import { THEOREMS, THEOREM_KEYS } from '../src/quantum/processing/theorems-index.ts'
import { handle } from '../src/quantum/processing/mcp.ts'
import { uuid } from '../src/quantum/uuid/index.ts'
import { RELEASE_REPOSITORY } from '../src/quantum/processing/release.ts'
import { callEnvelope } from '../src/quantum/processing/toolbox.ts'
import { HARDWARE_MARK, readJson } from '../src/quantum/processing/machine-run.ts'
import { deviceJsonLd, isProperties, isRows, receiptBody, receiptJsonLd, receiptText, type Json } from '../src/quantum/processing/receipts.ts'
import { verifiedByBoth } from '../src/quantum/processing/verified.ts'

export const pkg = readJson<{ name: string; version: string; description: string }>('src/quantum/package.json')!
const SITE = 'https://qpu.uuidna.com', MCP = `${SITE}/api/mcp`, REPO = `https://github.com/${RELEASE_REPOSITORY}`, TAG = `v${pkg.version}`
const sourceOf = (module: string) => `${REPO}/blob/${TAG}/lean/${module.replace(/\./g, '/')}.lean`
const answered = async (name: string, args: object) => ((await handle(callEnvelope(name, args, 0))) as { result?: { structuredContent?: Record<string, any> } }).result?.structuredContent ?? {}
const asked = (tool: string, args: object) => `${tool} ${JSON.stringify(args)}`

// the two doors, and the theorems Lean holds that both name while each holds: the text is not written while there is none
const DOORS = { nist: { nist: true }, cern: { nist: { reverse: true, via: 'cern' } } }
const nist = await answered('seal', DOORS.nist), cern = await answered('seal', DOORS.cern)
/** The theorems the text states: those Lean holds that both doors name while each holds. */
export const verified: string[] = verifiedByBoth(nist as { holds: boolean; theorems: string[] }, cern as { holds: boolean; theorems: string[] })
if (!verified.length) throw new Error(`${asked('seal', DOORS.nist)} holds ${nist.holds}, ${asked('seal', DOORS.cern)} holds ${cern.holds}: no theorem is named by both`)

// the receipts: one a theorem, its body what the kernel holds of it and what each door answers, every body sealed in one call of the seal door
const kernel = new Map(THEOREMS.map((t) => [t.key, t]))
const technique = `lean/tools/Theorems.lean, ${asked('seal', DOORS.nist)}, ${asked('seal', DOORS.cern)}`
const bodies: { kind: string; technique: string; body: Json }[] = verified.map((theorem) => {
  const t = kernel.get(theorem)!
  return { kind: theorem, technique, body: { theorem, module: t.module, source: sourceOf(t.module), axioms: t.axioms, nist: { host: nist.host, holds: nist.holds }, cern: { host: cern.host, via: cern.via, holds: cern.holds } } }
})
type Item = { bytes: number; sha256: string; address: string }
const sealAll = async (texts: string[]) => (await answered('seal', { texts })).items as Item[]
const items = await sealAll(bodies.map((b) => receiptText(b.kind, b.body)))
const place = { site: SITE, version: pkg.version, source: sourceOf }
const parts = bodies.map((b, i) => receiptJsonLd({ ...b, ...place, address: items[i]!.address, sha256: items[i]!.sha256 }))
// the merge: the RFC 6962 root the seal door computes over the parts' UUIDs, sealed as a receipt whose parts they are
const addresses = items.map((i) => i.address)
const root = (await answered('seal', { merkle: { leaves: addresses } })).root as string
const merged = { rfc: 6962, root, parts: addresses }
const [mergedItem] = await sealAll([receiptText('qpu', merged)])
const combination = receiptJsonLd({ kind: 'qpu', technique: asked('seal', { merkle: { leaves: ['uuid'] } }), body: merged, ...place, address: mergedItem!.address, sha256: mergedItem!.sha256, parts: bodies.map((b, i) => ({ kind: b.kind, address: addresses[i]! })) })
/** The receipts the text is loaded from, the merge first and its parts in order: each a schema.org Dataset. */
export const receipts: Json[] = [combination, ...parts]

// rendering: a receipt's JSON-LD to blocks, and blocks to Markdown and HTML; an inline token is a code span, a formula, a URL or plain text
type Block = { kind: 'h2' | 'h3' | 'table'; text?: string; head?: string[]; rows?: string[][] }
type Property = { name: string; value: unknown }
const code = (s: string) => `\`${s}\``
const word = (v: unknown) => (v === null || v === undefined ? '' : typeof v !== 'string' ? String(v) : (/[_.]/.test(v) && THEOREM_KEYS.has(v)) || /^[{[]/.test(v) ? code(v) : v)
const cell = (v: unknown) => (isProperties(v) ? code(JSON.stringify(receiptBody(v))) : Array.isArray(v) ? v.map(word).join(', ') : v !== null && typeof v === 'object' ? code(JSON.stringify(v)) : word(v))
const tablesOf = (path: string, properties: Property[]): Block[] => {
  const flat = properties.filter((p) => !isProperties(p.value)), nested = properties.filter((p) => isProperties(p.value)) as (Property & { value: Property[] })[]
  return [
    ...(flat.length ? [{ kind: 'table' as const, head: [path, ''], rows: flat.map((p) => [p.name, cell(p.value)]) }] : []),
    ...nested.flatMap((p): Block[] => {
      if (!isRows(p.value)) return tablesOf(`${path}.${p.name}`, p.value)
      const rows = p.value.map((r) => (isProperties(r.value) ? r.value : [{ name: p.name, value: r.value }])), head = [...new Set(rows.flatMap((r) => r.map((c) => c.name)))]
      return [{ kind: 'h3', text: `${path}.${p.name}` }, { kind: 'table', head, rows: rows.map((r) => head.map((h) => cell(r.find((c) => c.name === h)?.value))) }]
    }),
  ]
}
const named = (list: unknown) => Object.fromEntries((list as Property[]).map((p) => [p.name, p.value]))
/** One receipt as blocks: what seals it, what it costs, how it is computed, its author, licence and donation link, its variables and its formulas. */
const blocksOf = (r: Json, variables: 'variableMeasured' | 'additionalProperty' = 'variableMeasured'): Block[] => {
  const kind = String(r.alternateName ?? r.name), id = named(r.identifier), size = r.size ? named(r.size) : {}, formulas = (r.isBasedOn ?? []) as (Json & { size: Property[] })[], creator = r.creator as Json | undefined
  return [
    { kind: 'h2', text: kind },
    { kind: 'table', head: ['receipt', ''], rows: [
      ...Object.entries(id).map(([k, v]) => [k, k === 'handle' ? code(String(v)) : String(v)]), ...Object.entries(size).map(([k, v]) => [k, String(v)]),
      ...(r.measurementTechnique ? [['technique', code(String(r.measurementTechnique))]] : []),
      ...(creator ? [['author', String(creator.name)], ['orcid', String(creator.identifier)], ['licence', String(r.license)], ['licensing', String(r.acquireLicensePage)], ['donation', String((r.potentialAction as Json).target)], ['contact', String((creator.contactPoint as Json).url)]] : []),
      ...(r.hasPart ? [['parts', String((r.hasPart as unknown[]).length)]] : []),
    ] },
    ...(r.hasPart ? [{ kind: 'table' as const, head: ['part', 'handle', 'uuid'], rows: (r.hasPart as Json[]).map((x) => [code(String(x.name)), code(String(x.identifier).slice(0, 8)), String(x.identifier)]) }] : []),
    ...tablesOf(kind, r[variables] as Property[]),
    ...(formulas.length ? [{ kind: 'h3' as const, text: `${kind}.formula` }, { kind: 'table' as const, head: ['theorem', 'formula', 'bytes', 'bits', 'tokens', 'joules', 'coin', 'source'], rows: formulas.map((f) => { const c = named(f.size); return [code(String(f.name)), `$${f.text}$`, String(c.bytes), String(c.bits), String(c.tokens), String(c.joules), String(f.identifier), String(f.url)] }) }] : []),
  ]
}
type Token = { kind: 'code' | 'math' | 'url' | 'text'; text: string }
const tokens = (s: string): Token[] => s.split(/(`[^`]+`|\$[^$\n]+\$|https?:\/\/[^\s)]+[^\s).,;:])/).filter(Boolean).map((t) => t.startsWith('`') ? { kind: 'code', text: t.slice(1, -1) } : t.length > 2 && t.startsWith('$') && t.endsWith('$') ? { kind: 'math', text: t.slice(1, -1) } : /^https?:/.test(t) ? { kind: 'url', text: t } : { kind: 'text', text: t })
const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const inlineHtml = (s: string) => tokens(s).map((t) => t.kind === 'code' || t.kind === 'math' ? `<code>${escapeHtml(t.text)}</code>` : t.kind === 'url' ? `<a href="${escapeHtml(t.text)}">${escapeHtml(t.text)}</a>` : escapeHtml(t.text)).join('')
const inlineMarkdown = (s: string) => tokens(s).map((t) => t.kind === 'code' ? `\`${t.text}\`` : t.kind === 'math' ? `$${t.text}$` : t.kind === 'url' ? `<${t.text}>` : t.text.replace(/([\\*_[\]<>|#{}])/g, '\\$1')).join('')
// a bar inside a code span or a formula would end the cell: it is escaped, as a table reads it back
const barred = (s: string) => s.replace(/\|/g, '\\|')
const cellMarkdown = (s: string) => tokens(s).map((t) => t.kind === 'code' ? `\`${barred(t.text)}\`` : t.kind === 'math' ? `$${barred(t.text)}$` : inlineMarkdown(t.text)).join('').replace(/\n/g, ' ')
const blockMarkdown = (b: Block) => b.kind === 'h2' ? `## ${inlineMarkdown(b.text!)}` : b.kind === 'h3' ? `### ${inlineMarkdown(b.text!)}` : [`| ${b.head!.map(cellMarkdown).join(' | ')} |`, `|${b.head!.map(() => ' --- ').join('|')}|`, ...b.rows!.map((r) => `| ${r.map(cellMarkdown).join(' | ')} |`)].join('\n')
const blockHtml = (b: Block) => b.kind === 'h2' ? `<h2>${inlineHtml(b.text!)}</h2>` : b.kind === 'h3' ? `<h3>${inlineHtml(b.text!)}</h3>` : `<table><thead><tr>${b.head!.map((c) => `<th>${inlineHtml(c)}</th>`).join('')}</tr></thead><tbody>${b.rows!.map((r) => `<tr>${r.map((c) => `<td>${inlineHtml(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`

export const title = `${pkg.name} v${pkg.version}: ${pkg.description}`
const blocks = receipts.flatMap((r) => blocksOf(r))
/** The text as Markdown, the content its receipt addresses. */
export const markdown = blocks.map(blockMarkdown).join('\n\n') + '\n'
/** The text a verifier reads: everything above the rule of any Markdown copy, the title included. */
export const above = `# ${inlineMarkdown(title)}\n\n${markdown}`
/** The receipt of the text: the address of the Markdown above the rule, which verify { uuid, content } decides over MCP, and its SHA-256,
 *  with the merge it is loaded from and the parts of that merge by kind, handle and UUID. */
export const receipt = { uuid: uuid(above), sha256: createHash('sha256').update(above).digest('hex'), mcp: MCP, merge: { uuid: mergedItem!.address, handle: mergedItem!.address.slice(0, 8), root, rfc: 6962 }, parts: bodies.map((b, i) => ({ kind: b.kind, handle: addresses[i]!.slice(0, 8), uuid: addresses[i]! })) }
const signed: Block = { kind: 'table', head: ['text', ''], rows: [['uuid', receipt.uuid], ['sha256', receipt.sha256], ['merge', receipt.merge.uuid], ['verify', code(asked('verify', { uuid: receipt.uuid, content: 'text' }))], ['mcp', MCP]] }
/** The text as HTML, block for block, with the receipt: the Zenodo description and the release note. */
export const html = [...blocks.map(blockHtml), '<hr>', blockHtml(signed)].join('')

// the device that minted the receipts: every reading the machine gives of itself, read as the text is finished; no host name, user,
// address or path is kept. Its qubit capacity is the register's own count and no other figure stands beside it: the registers its
// memory holds, one for every byte count the register's bits make, and their qubits at the register's free qubits each, as the
// metrics door carries the register. It changes from machine to machine, so it is its own receipt and the check of the one text
// leaves it out.
const register = (await answered('metrics', {})).quantumCapacity.register as { free: number; bits: number }
const lean = readFileSync('lean-toolchain', 'utf8').trim()
const memoryBytes = os.totalmem(), cpus = os.cpus(), used = process.memoryUsage(), spent = process.resourceUsage(), disk = statfsSync('.')
const registerQubits = Number(register.free), registerBytes = Number(register.bits) / 8
const registersInMemory = Math.floor(memoryBytes / registerBytes), registerQubitsInMemory = registersInMemory * registerQubits
const sum = (of: (c: os.CpuInfo) => number) => cpus.reduce((n, c) => n + of(c), 0)
const facts = {
  registerBytes, registerQubits, registersInMemory, registerQubitsInMemory,
  platform: os.platform(), type: os.type(), release: os.release(), version: os.version(), arch: os.arch(), machine: os.machine(), endianness: os.endianness(),
  cpu: cpus[0]?.model ?? '', cores: cpus.length, parallelism: os.availableParallelism(), cpuMHz: cpus.map((c) => c.speed),
  cpuUserMs: sum((c) => c.times.user), cpuNiceMs: sum((c) => c.times.nice), cpuSysMs: sum((c) => c.times.sys), cpuIdleMs: sum((c) => c.times.idle), cpuIrqMs: sum((c) => c.times.irq),
  memoryBytes, freeMemoryBytes: os.freemem(), load1: os.loadavg()[0], load5: os.loadavg()[1], load15: os.loadavg()[2], uptimeS: Math.round(os.uptime()),
  diskBytes: disk.blocks * disk.bsize, diskFreeBytes: disk.bfree * disk.bsize, diskAvailableBytes: disk.bavail * disk.bsize, diskBlockBytes: disk.bsize, inodes: disk.files, inodesFree: disk.ffree,
  networkInterfaces: Object.keys(os.networkInterfaces()).length,
  versions: { ...process.versions }, lean,
  rssBytes: used.rss, heapTotalBytes: used.heapTotal, heapUsedBytes: used.heapUsed, externalBytes: used.external, arrayBuffersBytes: used.arrayBuffers,
  processUserMicros: spent.userCPUTime, processSystemMicros: spent.systemCPUTime, maxRssKb: spent.maxRSS, pageFaults: spent.majorPageFault + spent.minorPageFault, fsReads: spent.fsRead, fsWrites: spent.fsWrite, contextSwitches: spent.voluntaryContextSwitches + spent.involuntaryContextSwitches,
  buildMs: Math.round(performance.now() - started), at: new Date().toISOString(),
}
const [deviceItem] = await sealAll([receiptText('hardware', facts)])
/** The device as a schema.org Product, sealed like every receipt, and its readings. */
export const hardware = { uuid: deviceItem!.address, sha256: deviceItem!.sha256, facts, jsonLd: deviceJsonLd({ kind: 'hardware', body: facts, address: deviceItem!.address, sha256: deviceItem!.sha256, site: SITE }) }
/** Where the hardware begins in every copy: what is above it is recomputed, what is below it is the device receipt, verified by its seal. */
export { HARDWARE_MARK }
/** The text as HTML with a device receipt below the mark: the Zenodo description and the release note. */
export const htmlWithDevice = (device: Json) => `${html}${HARDWARE_MARK}${blocksOf(device, 'additionalProperty').map(blockHtml).join('')}`
/** The page every Markdown copy is with a device receipt: the title, the text, the receipt under a rule, and the device below the mark. */
export const pageWithDevice = (device: Json) => `${above}---\n\n${blockMarkdown(signed)}\n\n${HARDWARE_MARK}\n\n${blocksOf(device, 'additionalProperty').map(blockMarkdown).join('\n\n')}\n`
/** A device receipt verified by its own content: its UUID is the address, and its SHA-256 the digest, of the body its properties carry. */
export const deviceVerifies = (device: Json) => {
  const id = Object.fromEntries((device.identifier as { name: string; value: string }[]).map((p) => [p.name, p.value])), text = receiptText(String(device.name), receiptBody(device.additionalProperty))
  return { uuid: id.uuid as string, sha256: id.sha256 as string, holds: id.uuid === uuid(text) && id.sha256 === createHash('sha256').update(text).digest('hex') }
}
export const htmlWithHardware = htmlWithDevice(hardware.jsonLd)
/** The page every Markdown copy is: the title, the text, the receipt under a rule, and the hardware receipt of the build. */
export const page = pageWithDevice(hardware.jsonLd)
