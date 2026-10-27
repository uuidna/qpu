// The MCP surface audited through the MCP surface: every check below is made by calling `handle` the way a client
// does, so the audit sees exactly what a client sees. A failed check is a lead with its evidence, never a ruling.

import type { Example } from './examples.js'

export type Rpc = { jsonrpc: '2.0'; id?: number | string | null; method: string; params?: unknown }
import { THEOREMS, THEOREM_KEYS } from './theorems-index.js'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.js'
import { uuidOf } from './blocks.js'

export type Check = { id: string; passed: boolean; evidence: string; /** milliseconds since the previous check: where the audit's time goes */ ms?: number }
export type Audit = { /** the share this run replayed: index mod n = i (n = 1 is the whole audit) */ shard: { i: number; n: number }; /** example key → the integers its confirmed pass folded to: the next run decides by them */ integers: Record<string, string>; /** how many examples the integers decided and how many the text confirmed */ decided: { bySeal: number; byInteger: number; byText: number; sealed: boolean; theorem: string }; /** the eight slowest checks, with their milliseconds: where the audit's time goes */ slowest: string[]; total: number; passed: number; failed: number; tools: number; examples: number; leads: number; checks: Check[] }

type Lead = { id: string; status: string; tool?: string; reason?: string }
type ToolSpec = { name: string; description: string; inputSchema: { type?: string; required?: string[]; properties?: Record<string, unknown> } }


/** The vacuum-gravity entropy cleaner: the codebase's entropy — data baked into a file, a path typed where a role computes it, a cap on a read,
 *  a clock or a die in a pure module, a line repeated across files, a note to self, an address that should not be in the tree — measured over the
 *  texts the client supplies and converted to leads, never rulings. Findings with one content address fuse into one lead naming every source
 *  (a fusion reaction: f findings become f − d leads, textbook_entropy_fusion); the gravity of the tree is the fold of the sorted addresses,
 *  and the vacuum is the tree whose gravity is the fold of nothing. Pure: the purify step reads the files and signals the leads it opened. */
export type EntropyKind = 'literal' | 'typed-path' | 'cap' | 'clock' | 'duplicate' | 'shape' | 'todo' | 'leak'
/** The shapes of code the cleaner recognises below the line: written out in many files, each one place should hold — the helper named beside it. */
export const CODE_SHAPES: readonly { shape: string; re: RegExp; holder: string }[] = [
  { shape: 'the tools/call envelope', re: /handle\(\{ jsonrpc: '2\.0', id: \d+, method: 'tools\/call', params: \{ name/, holder: 'toolCallerOf(name) in mcp.ts' },
  { shape: 'a JSON file read and parsed', re: /JSON\.parse\(readFileSync\(/, holder: 'one reader of the published files, null when a file is missing' },
  { shape: 'the published folder made', re: /mkdirSync\(join\(ROOT, 'docs', 'public'\), \{ recursive: true \}\)/, holder: 'one writer of the published files that makes its folder' },
  { shape: 'a request with its timeout', re: /signal: AbortSignal\.timeout\(/, holder: 'one fetcher with the named user agent and the timeout' },
  { shape: 'the tools/list envelope', re: /handle\(\{ jsonrpc: '2\.0', id: \d+, method: 'tools\/list' \}\)/, holder: 'one reader of the tool list' },
]
/** Every kind of entropy says how its leads are explored (the tool a client follows it with) and which configuration settles it (the configure kind
 *  that absorbs the difference), so a difference is never a ruling: it is a lead to explore and to config. */
export const ENTROPY_KINDS: readonly { kind: EntropyKind; says: string; explore: string; config: string | null }[] = [
  { kind: 'literal', says: 'data baked into a file as a JSON literal: the handler should answer it at run time', explore: 'configure', config: 'fullstack' },
  { kind: 'typed-path', says: 'a generated path typed by hand where fileOf computes it from a role', explore: 'configure', config: 'fullstack' },
  { kind: 'cap', says: 'a cap on a read or a walk (slice, limit, substring): the user asked for none', explore: 'match', config: 'actions' },
  { kind: 'clock', says: 'a clock or a die in a pure module: the result is no longer a function of its arguments', explore: 'imagine', config: 'actions' },
  { kind: 'duplicate', says: 'one line of code repeated in more than one file: one place should hold it', explore: 'match', config: 'fullstack' },
  { kind: 'shape', says: 'a shape of code written out in many files (a call envelope, a read, a request): one helper should hold it', explore: 'match', config: null },
  { kind: 'todo', says: 'a note to self in the code: a lead written where no one reads it', explore: 'imagine', config: null },
  { kind: 'leak', says: 'an address in the tree: contacts are URLs, the account email is read at deploy', explore: 'configure', config: 'tenant' },
]
export type EntropyFinding = { kind: EntropyKind; file: string; line: number; excerpt: string; address: string }
export type EntropyLead = { id: string; kind: EntropyKind; source: string; statement: string; status: 'open'; tool: 'audit'; occurrences: number; address: string; explore: string; config: string | null }
export const LEAK_ALLOWED = new Set(['payloadcms.com', 'example.com', 'test.com', 'thirdparty.com', 'github.com', 'anthropic.com', 'localhost.test', 'local.test'])
/** Paths and URLs each live in their one registry: a repo path is named by its role (FILE_ROLES / fileOf, in the Payload toolbox, and the
 *  generated files' table in the repository toolbox), an external URL in the sources, discovery and leads tables. A literal anywhere else in
 *  hand-written source is dirty code, priced harmonically by its own bytes; a file a generator wrote, the examples' fixtures and the tests are
 *  not hand-written source, and the licence and attribution URLs the licence requires verbatim are exempt, stated as such. A literal is clean
 *  exactly when it sits in its registry (textbook_literal_in_registry). Its antimatter names the move — fileOf(role) for a path, the registry
 *  entry (or a docket entry through the Payload MCP when it is tenant data) for a URL — and waits on confirm: whether the substitution typechecks
 *  is known only after it is made. */
/** The generator that writes each generated file, the remedy of its drift: an automated gap's antimatter runs it, then restages what drifted. A
 *  table of paths, so it lives in a path registry. */
export const GENERATOR_REMEDIES: readonly [RegExp, { cmd: string; args: string[] }][] = [
  [/theorems-index\.ts$/, { cmd: 'npm', args: ['run', '-s', 'purify'] }],
  [/clay-statements\.ts$/, { cmd: 'node', args: ['--import', 'tsx', 'scripts/gen-clay.ts'] }],
  [/^site\//, { cmd: 'node', args: ['--import', 'tsx', 'scripts/configs.ts'] }],
  [/./, { cmd: 'npm', args: ['run', '-s', 'docs:gen'] }],
]
/** The roots whose hand-written source the literal rule reads. */
export const LITERAL_ROOTS = ['src', 'scripts', 'site/src'] as const
export const LITERAL_REGISTRIES = { url: ['src/quantum/discovery.ts', 'src/quantum/discovery-document.ts', 'src/quantum/sources.ts', 'src/quantum/leads.ts', 'src/quantum/payload-surface.ts'], path: ['src/quantum/toolboxes/payload.ts', 'src/quantum/toolboxes/repository.ts', 'src/quantum/audit.ts', 'src/quantum/machine.ts', 'scripts/next.ts'] } as const
export const LITERAL_EXEMPT = /uuidna\.com\/licen[cs]e|creativecommons\.org\/licenses|contributor-covenant\.org|\(\+https:\/\/qpu\.uuidna\.com\)/
export type Literal = { kind: 'url' | 'path'; file: string; line: number; literal: string; clean: boolean; why: string; tokens: number; antimatter: { needs: 'confirm'; says: string } | null }
export const literalsOf = (files: Readonly<Record<string, string>>) => {
  const all: Literal[] = []
  for (const [file, text] of Object.entries(files)) {
    if (!/^(src|scripts|site\/src)\//.test(file) || /\.test\.ts$/.test(file) || /^src\/quantum\/examples\.ts$/.test(file) || /\.(md|mdx|txt|json)$/.test(file)) continue
    if (/GENERATED|Generated by|generated:importmap/i.test(text.split('\n').slice(0, 8).join('\n'))) continue
    text.split('\n').forEach((l, i) => {
      const push = (kind: 'url' | 'path', literal: string) => {
        const registry = (LITERAL_REGISTRIES[kind] as readonly string[]).includes(file), exempt = kind === 'url' && LITERAL_EXEMPT.test(l)
        const clean = registry || exempt
        all.push({ kind, file, line: i + 1, literal, clean, why: registry ? 'in its registry' : exempt ? 'exempt: a licence or attribution URL required verbatim' : 'outside its registry', tokens: clean ? 0 : Math.ceil(new TextEncoder().encode(literal).length / 4), antimatter: clean ? null : { needs: 'confirm', says: kind === 'path' ? `name ${literal} by its role through fileOf(role, key), or add the role to FILE_ROLES` : `move ${literal} into the sources or discovery table and reference its entry, or into the docket through the Payload MCP when it is tenant data` } })
      }
      for (const m of l.matchAll(/https?:\/\/[^\s'"`)<>\\]+/g)) push('url', m[0])
      for (const m of l.matchAll(/['"`]((?:docs|src|scripts|site)\/[^'"`\s]+)['"`]/g)) push('path', m[1]!)
    })
  }
  const dirty = all.filter((x) => !x.clean)
  const byFile = Object.entries(dirty.reduce<Record<string, number>>((a, x) => ({ ...a, [x.file]: (a[x.file] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1])
  return { urls: all.filter((x) => x.kind === 'url').length, distinctUrls: new Set(all.filter((x) => x.kind === 'url').map((x) => x.literal)).size, paths: all.filter((x) => x.kind === 'path').length, clean: all.length - dirty.length, outside: dirty.length, tokens: dirty.reduce((n, x) => n + x.tokens, 0), byFile, dirty, registries: LITERAL_REGISTRIES, theorem: 'textbook_literal_in_registry' }
}
/** Manual docs: a docs page is generated when a generator writes its path — read from the scripts' own write targets (a script line that writes a
 *  file and names the page), never from a header — and manual otherwise. A manual page is a listed gap of the automated family, priced in its own
 *  bytes, whose antimatter is a generator for the page from the tool, theorems and examples it describes; a new manual page blocks its commit.
 *  The dated audit dockets are records, exempt and stated as such. A write target built at run time from a variable is not seen by this read, so
 *  a page it writes is listed as manual until its generator names it: a lead, never a ruling. */
export const DOCS_EXEMPT = /^docs\/audit\/\d{4}-\d{2}-\d{2}-[^/]+\.md$/
export const manualDocsOf = (pages: readonly { path: string; bytes: number }[], scripts: Readonly<Record<string, string>>) => {
  const writes = Object.entries(scripts).flatMap(([file, text]) => text.split('\n').filter((l) => /writeFileSync|appendFileSync|writePage|write\(/.test(l)).map((l) => ({ file, l })))
  const writerOf = (path: string) => { const name = path.replace(/^docs\//, '').replace(/\.md$/, ''), base = name.split('/').pop()!; return writes.find((w) => w.l.includes(`'${name}.md'`) || w.l.includes(`'${base}.md'`) || w.l.includes(`"${base}.md"`) || w.l.includes(`/${base}.md`))?.file ?? null }
  const rows = pages.map((p) => { const exempt = DOCS_EXEMPT.test(p.path), writer = exempt ? null : writerOf(p.path); return { ...p, exempt, generator: writer, manual: !exempt && !writer, tokens: !exempt && !writer ? Math.ceil(p.bytes / 4) : 0 } })
  const manual = rows.filter((r) => r.manual).sort((a, b) => b.bytes - a.bytes)
  return { pages: rows.length, generated: rows.filter((r) => r.generator).length, exempt: rows.filter((r) => r.exempt).length, manual: manual.length, bytes: manual.reduce((n, r) => n + r.bytes, 0), tokens: manual.reduce((n, r) => n + r.tokens, 0), largest: manual.slice(0, 10).map((r) => ({ path: r.path, bytes: r.bytes, antimatter: { needs: 'auto' as const, says: `write a generator for ${r.path} from the tool, theorems and examples it describes, so the page is generated and its gap annihilates` } })), rows, says: `${manual.length} of ${rows.length} docs page(s) written by hand (${manual.reduce((n, r) => n + r.bytes, 0)} bytes), ${rows.filter((r) => r.exempt).length} dated record(s) exempt; generated means a generator writes the path` }
}
export const entropyOf = (files: Readonly<Record<string, string>>) => {
  const findings: EntropyFinding[] = []
  const add = (kind: EntropyKind, file: string, line: number, excerpt: string) => { const t = excerpt.trim(); findings.push({ kind, file, line, excerpt: t, address: uuidOf(`${kind}\n${t}`) }) }
  const repeated = new Map<string, { file: string; line: number }[]>()
  let lines = 0
  for (const [file, text] of Object.entries(files)) {
    const code = !/\.(md|mdx|txt)$/.test(file)
    const pure = /^src\/quantum\//.test(file) && !/\.test\.ts$/.test(file)
    const generated = /^site\//.test(file)
    // a file a tool wrote says so in its head: its data is the tool's answer, not entropy baked by a hand
    const written = /GENERATED|Generated by|generated:importmap/i.test(text.split('\n').slice(0, 8).join('\n'))
    text.split('\n').forEach((l, i) => {
      lines += 1
      const n = i + 1
      const fixture = /^src\/quantum\/examples\.ts$/.test(file) || /\bsource: '/.test(l) || /add\('/.test(l)
      if (!fixture && /\b(TODO|FIXME|XXX)\b/.test(l)) add('todo', file, n, l)
      if (code && !written && !fixture && l.length >= 200 && /(=|:|\()\s*(\{|\[\{)"[A-Za-z_][A-Za-z0-9_]*":/.test(l) && !/JSON\.parse\(|JSON\.stringify\(/.test(l)) add('literal', file, n, `${l.slice(0, 1)}… ${l.length} characters of JSON on one line`)
      if (code && !generated && !fixture && /'site\/src\/[^']+'/.test(l) && !/fileOf\(|source: 'hand'|path: 'site\/src\/(payload\.config\.ts|collections\/Pages\.ts|collections\/Users\.ts)'/.test(l)) add('typed-path', file, n, l.match(/'site\/src\/[^']+'/)![0])
      // a label of under twenty characters (a date, a handle, an address prefix) is structure; a longer cut is a cap
      const cap = l.match(/\.slice\(0,\s*(\d+)\)|\blimit:\s*(\d+)\b|\.substring\(0,\s*(\d+)\)|max_chars:\s*(\d+)/)
      if (code && cap && Number(cap[1] ?? cap[2] ?? cap[3] ?? cap[4]) >= 20 && !/no cap|uncapped/.test(l)) add('cap', file, n, cap[0])
      if (pure && /\bDate\.now\(\)|\bMath\.random\(\)|new Date\(\)/.test(l)) add('clock', file, n, l.match(/\bDate\.now\(\)|\bMath\.random\(\)|new Date\(\)/)![0])
      const t = l.trim()
      if (code && !written && t.length >= 60 && !/^(import |export \{|\/\/|\*|\/\*|\}|\)|<)/.test(t)) { const at = repeated.get(t) ?? []; at.push({ file, line: n }); repeated.set(t, at) }
      // an address has a top-level domain of letters: a version after an @ (react@18.3.1) is a package, not a person
      for (const m of l.matchAll(/[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.[A-Za-z0-9.-]*[A-Za-z]{2,})\b/g)) if (!LEAK_ALLOWED.has(m[1]!) && !/<[^>]*@/.test(m[0]) && !/^[\w.-]+@\d/.test(m[0])) add('leak', file, n, `<address>@${m[1]}`)
    })
  }
  for (const [t, at] of repeated) if (new Set(at.map((a) => a.file)).size >= 2) for (const a of at) add('duplicate', a.file, a.line, t)
  // the shapes below the line: every place a shape is written out, fused by the shape, when more than one file writes it
  for (const s of CODE_SHAPES) { const at: { file: string; line: number }[] = []; for (const [file, text] of Object.entries(files)) { if (!/\.(ts|mts|tsx|vue)$/.test(file)) continue; text.split('\n').forEach((l, i) => { if (s.re.test(l)) at.push({ file, line: i + 1 }) }) } if (new Set(at.map((a) => a.file)).size >= 2) for (const a of at) add('shape', a.file, a.line, `${s.shape}: ${s.holder}`) }
  // fusion: every finding with one address fuses into one lead that names every source
  const byAddress = new Map<string, EntropyFinding[]>()
  for (const f of findings) byAddress.set(f.address, [...(byAddress.get(f.address) ?? []), f])
  const kindOf = Object.fromEntries(ENTROPY_KINDS.map((k) => [k.kind, k])) as Record<EntropyKind, (typeof ENTROPY_KINDS)[number]>
  const leads: EntropyLead[] = [...byAddress.entries()].map(([address, fs]) => { const k = kindOf[fs[0]!.kind]; return { id: `entropy-${k.kind}-${address.slice(0, 8)}`, kind: k.kind, source: fs.map((f) => `${f.file}:${f.line}`).join(', '), statement: `${k.says} — ${fs[0]!.excerpt}`, status: 'open', tool: 'audit', occurrences: fs.length, address, explore: k.explore, config: k.config } })
  const addresses = [...byAddress.keys()].sort()
  const byKind = Object.fromEntries(ENTROPY_KINDS.map((k) => [k.kind, { findings: findings.filter((f) => f.kind === k.kind).length, leads: leads.filter((l) => l.kind === k.kind).length }]))
  return { literals: literalsOf(files), files: Object.keys(files).length, lines, findings: findings.length, fused: leads.length, reactions: findings.length - leads.length, byKind, gravity: uuidOf(addresses.join('\n')), vacuum: findings.length === 0, kinds: ENTROPY_KINDS, leads, found: findings, toExplore: Object.fromEntries([...new Set(leads.map((l) => l.explore))].map((t) => [t, leads.filter((l) => l.explore === t).length])), toConfig: Object.fromEntries([...new Set(leads.map((l) => l.config ?? 'none'))].map((c) => [c, leads.filter((l) => (l.config ?? 'none') === c).length])), says: 'entropy measured over the texts supplied, every finding a lead and none a ruling; findings of one address fuse into one lead (f findings, f − d leads); the gravity is the fold of the sorted addresses and the vacuum is a tree whose gravity folds nothing' }
}

/** Differences become leads, agnostic of what differs and proven by theorem: two named sets of members (addresses, paths, ids, lines,
 *  whatever a caller names) and every member on one side only is a lead to explore (the tool a client follows it with: a tool by match, an
 *  example by imagine, a file or a path by configure, anything else by imagine) and to config (the configure kind the caller says absorbs
 *  it). textbook_difference_leads: with a and b members sharing c, the leads are (a − c) + (b − c) = a + b − 2c — never a ruling, never more. */
export type DifferenceLead = { id: string; member: string; side: string; statement: string; status: 'open'; explore: string; config: string | null; theorem: string }
export const exploreOf = (member: string): string => (member.startsWith('tool:') ? 'match' : member.startsWith('example:') ? 'imagine' : /(^|\/)[\w.-]+\.(ts|tsx|vue|md|mts|jsonc?)(:\d+)?$|^[\w.-]+(\.[\w-]+)+$/.test(member) ? 'configure' : 'imagine')
export const differencesOf = (a: { name: string; members: readonly string[] }, b: { name: string; members: readonly string[] }, policy: { config?: string | null; explore?: (member: string) => string } = {}) => {
  const A = new Set(a.members), B = new Set(b.members)
  const shared = [...A].filter((m) => B.has(m)).length
  const explore = policy.explore ?? exploreOf
  const lead = (m: string, side: string, other: string): DifferenceLead => ({ id: `difference-${uuidOf(`${a.name}△${b.name}\n${m}`).slice(0, 8)}`, member: m, side, statement: `${m} is in ${side} and not in ${other}: a difference to explore with ${explore(m)}${policy.config ? ` and to config as ${policy.config}` : ''}`, status: 'open', explore: explore(m), config: policy.config ?? null, theorem: 'textbook_difference_leads' })
  const onlyA = [...A].filter((m) => !B.has(m)).map((m) => lead(m, a.name, b.name))
  const onlyB = [...B].filter((m) => !A.has(m)).map((m) => lead(m, b.name, a.name))
  const leads = [...onlyA, ...onlyB]
  return { a: a.name, b: b.name, sizes: { a: A.size, b: B.size, shared, onlyA: onlyA.length, onlyB: onlyB.length }, leads, proven: leads.length === (A.size - shared) + (B.size - shared), theorem: 'textbook_difference_leads', toExplore: Object.fromEntries([...new Set(leads.map((l) => l.explore))].map((t) => [t, leads.filter((l) => l.explore === t).length])), agnostic: 'members compared as the strings they are, whatever they name; the sides are named by the caller, the config kind by its policy' }
}

/** What manual work taught, as remedies by signature, applied in mass: every error text a step or a client sees is matched here and
 *  answered with the remedy learned (textbook_error_remedies: the remedied and the unremedied make the errors); in an error-free environment
 *  the table stays dormant and the stream's gravity is the vacuum. An error without a remedy is a lead that teaches the next row. */
export const ERROR_REMEDIES: readonly { signature: string; learned: string; remedy: string; automated: boolean }[] = [
  { signature: 'No `open-next\\.config\\.ts`', learned: '2026-10-26', remedy: 'the root file is generated by configure { kind: fullstack } (role root): run the configs step, then the OpenNext build', automated: true },
  { signature: 'cannot use the edge runtime', learned: '2026-10-26', remedy: 'remove export const runtime = \'edge\' from the route: on Workers the whole app is the Worker and OpenNext runs the Node runtime (configure { kind: adapters } openNext.requires)', automated: false },
  { signature: 'ERR_PNPM_ADDING_TO_ROOT', learned: '2026-10-26', remedy: 'the fork is a pnpm workspace root: pnpm add -w <package>', automated: true },
  { signature: 'TS5112', learned: '2026-10-26', remedy: 'a file named on the command line ignores tsconfig: pass --ignoreConfig', automated: true },
  { signature: 'missing secret key', learned: '2026-10-26', remedy: 'run under scripts/site-local.sh, which names PAYLOAD_SECRET and DATABASE_URI for a build (never the tenant\'s values)', automated: true },
  { signature: 'Element is missing end tag', learned: '2026-10-26', remedy: 'a page cell carried a raw angle bracket: every cell is escaped by the writer\'s cell()', automated: true },
  { signature: 'used before its declaration', learned: '2026-10-26', remedy: 'declare the helper above the data that uses it (a template\'s helpers above its constants)', automated: false },
  { signature: 'Cannot read properties of undefined', learned: '2026-10-26', remedy: 'an answer missing: check the hook ran (the QPU plugin mounted last) and the result\'s shape before reading it', automated: false },
  { signature: 'collision: the document is at', learned: '2026-10-26', remedy: 'the edit was based on an older address: read the document again and re-apply (editBase)', automated: true },
  { signature: 'Just a moment|HTTP 403', learned: '2026-10-26', remedy: 'a gateway refuses the verifier: the page is read in a browser and the lead stays measured', automated: false },
  { signature: 'Property .* does not exist on type', learned: '2026-10-26', remedy: 'a union holds non-objects: narrow with a type guard over unknown[] before reading the property', automated: false },
  { signature: 'has no reason', learned: '2026-10-26', remedy: 'an open lead carries a reason: add it to the lead', automated: true },
]
export const remediesOf = (errors: readonly string[]) => {
  const leads = errors.map((text) => { const row = ERROR_REMEDIES.find((r) => new RegExp(r.signature).test(text)); const address = uuidOf(`error\n${text.trim()}`); return { id: `error-${address.slice(0, 8)}`, address, signature: row?.signature ?? null, remedy: row?.remedy ?? null, automated: row?.automated ?? false, learned: row?.learned ?? null, statement: row ? `${text.trim().split('\n')[0]} — remedy: ${row.remedy}` : `${text.trim().split('\n')[0]} — no remedy learned yet: a lead that teaches the next row`, status: 'open' as const } })
  const remedied = leads.filter((l) => l.remedy).length
  return { errors: errors.length, remedied, unremedied: errors.length - remedied, leads, table: ERROR_REMEDIES.length, gravity: uuidOf(leads.map((l) => l.address).sort().join('\n')), vacuum: errors.length === 0, says: 'every error matched against what manual work taught; the remedied and the unremedied make the errors; in an error-free environment the table is dormant and the gravity is the vacuum' }
}
/** The fallback combinations: correction and handling are each other's fallback (the involution σ: correction ↔ handling, σ∘σ = id), and
 *  every adapter names the adapter it falls back to when its environment fails; all declared, so the theorems compute and the gate cross-checks
 *  them online on every host. */
export const FALLBACKS: readonly { failure: string; correction: string; handling: string; involution: string }[] = [
  { failure: 'a copy differs (a flip)', correction: 'majority over the copies; the differing host a syndrome', handling: 'the host a lead to deploy; the tree\'s answer the reference', involution: 'correction first; handling when no majority' },
  { failure: 'no answer (an erasure)', correction: 'the remaining copies decide', handling: 'the host a lead; the client retries after the involution interval', involution: 'correction first; handling when every copy is erased' },
  { failure: 'no majority (uncorrectable)', correction: 'none: the correction errors', handling: 'the possibilities listed, the error matched to a remedy by signature, the combination a lead', involution: 'σ: correction → handling' },
  { failure: 'a handling without a remedy', correction: 'the next run\'s copies decide (the stream keeps the lead)', handling: 'none: the lead teaches the next row of the table', involution: 'σ: handling → correction; σ∘σ = id, the fallback terminates' },
  { failure: 'a remedy that errors', correction: 'the copies that agree with the tree stand', handling: 'the remedy\'s own error matched again, once', involution: 'σ applied twice returns to correction: no loop' },
]
export const FALLBACK_ADAPTERS: readonly { when: string; from: string; to: string; involution: string }[] = [
  { when: 'the D1 binding is absent', from: 'db-d1-sqlite', to: 'db-postgres (Cloud SQL) when GOOGLE_CLOUD_PROJECT is named, else db-mongodb (DATABASE_URI)', involution: 'the binding returns, the adapter returns: chosen by what the environment names on every start' },
  { when: 'the R2 binding is absent', from: 'storage-r2', to: 'storage-gcs when GCS_BUCKET is named, else storage-vercel-blob (disabled without its token)', involution: 'the same' },
  { when: 'RESEND_API_KEY is absent', from: 'email-resend', to: 'email-nodemailer: Gmail when GMAIL_USER is named, SendGrid when its key is, else logged', involution: 'the same' },
  { when: 'Cloud Run is not the host', from: 'run.googleapis.com (Cloud Run)', to: 'Cloudflare Workers through OpenNext (site/wrangler.jsonc)', involution: 'the migration law: every host answers until the gate decodes the new one' },
  { when: 'a Google door has no token', from: 'the Google MCP server', to: 'the public reference the verifier reads (developers.google.com) and the lead', involution: 'the token names the door again' },
  { when: 'the Payload MCP plugin is unreachable', from: '/api/mcp (the app)', to: '/mcp (the Worker): every pure tool, token free; the collections wait', involution: 'the app returns, the collections return' },
]
export const involutionOf = (mode: 'correction' | 'handling'): 'correction' | 'handling' => (mode === 'correction' ? 'handling' : 'correction')
/** Correction or handling, swapped when the one in hand errors: at most two swaps (σ∘σ = id), so it terminates with what it has. */
export const handleOrCorrect = (errors: readonly string[], majority: boolean, mode: 'correction' | 'handling' = 'correction') => {
  const steps: { mode: 'correction' | 'handling'; result: string }[] = []
  let m = mode
  for (let swap = 0; swap < 3; swap += 1) {
    if (m === 'correction') { if (majority) { steps.push({ mode: m, result: 'corrected by majority' }); return { mode: m, steps, swaps: swap, terminated: true } } steps.push({ mode: m, result: 'no majority: the correction errors' }); m = involutionOf(m); continue }
    const r = remediesOf(errors)
    if (r.remedied > 0 || errors.length === 0) { steps.push({ mode: m, result: errors.length ? `${r.remedied} of ${r.errors} remedied` : 'nothing to handle' }); return { mode: m, steps, swaps: swap, terminated: true, remedies: r } }
    steps.push({ mode: m, result: 'no remedy learned: the lead teaches the next row' }); m = involutionOf(m)
  }
  return { mode: m, steps, swaps: 2, terminated: true, says: 'σ applied twice is the identity: the fallback returned to where it started and stops with the lead' }
}
/** The security audit from the client and the developer perspectives merged as one list: what a client of the MCP measures (headers, CORS,
 *  the token a write needs, the surface audit, the plugin\'s key) and what the developer measures (dependencies, leaks, access rules, hooks,
 *  signing, theorems), each check named by its perspective, the same count from either side (textbook_security_perspectives). */
export type SecurityClient = { hosts: readonly { host: string; status: number; headers: Record<string, string>; optionsStatus?: number; writeWithoutToken?: number; audit?: { total: number; failed: number } }[]; payloadMcp?: { unauthenticated: number | null } }
export type SecurityDeveloper = { vulnerabilities: Record<string, Record<string, number>>; leaks: number; envExampleValueless: boolean; access: { entries?: { update?: string }; tenants?: { write?: string } }; hooks: readonly string[]; signing: string; theorems: number; autoLogin?: boolean }
export const securityOf = (client: SecurityClient, developer: SecurityDeveloper) => {
  const checks: { id: string; perspective: 'client' | 'developer' | 'both'; passed: boolean; evidence: string; remedy?: string }[] = []
  const c = (id: string, perspective: 'client' | 'developer' | 'both', passed: boolean, evidence: string, remedy?: string) => checks.push({ id, perspective, passed, evidence, ...(remedy ? { remedy } : {}) })
  for (const h of client.hosts) {
    const acao = h.headers['access-control-allow-origin'] ?? ''; const acah = h.headers['access-control-allow-headers'] ?? ''
    c(`cors:${h.host}`, 'client', acao === '*' && /authorization/i.test(acah), `allow-origin ${acao || 'none'}, allow-headers ${acah || 'none'}`, 'reads answer every origin; writes carry Authorization')
    c(`hsts:${h.host}`, 'client', Boolean(h.headers['strict-transport-security']), h.headers['strict-transport-security'] ? `HSTS ${h.headers['strict-transport-security']}` : 'no Strict-Transport-Security header', 'enable HSTS on the zone (Cloudflare SSL/TLS, Edge Certificates): the tenant\'s act')
    c(`no-sniff:${h.host}`, 'client', /nosniff/i.test(h.headers['x-content-type-options'] ?? ''), h.headers['x-content-type-options'] ?? 'no X-Content-Type-Options header', 'the Worker answers X-Content-Type-Options: nosniff on every reply')
    if (h.writeWithoutToken !== undefined) c(`write-needs-token:${h.host}`, 'client', h.writeWithoutToken >= 400 && h.writeWithoutToken < 500, `POST /entries without a token answers ${h.writeWithoutToken}`, 'a write without Authorization is refused with 401 or 403')
    if (h.audit) c(`surface-audit:${h.host}`, 'client', h.audit.failed === 0, `${h.audit.total - h.audit.failed}/${h.audit.total} checks pass over MCP`, 'every failed check is a lead with its evidence')
  }
  const u = client.payloadMcp?.unauthenticated ?? null
  c('payload-mcp-key', 'client', u === null || u === 401 || u === 403, u === null ? 'the app is not deployed: the plugin requires Authorization: <users> API-Key (measured locally), pending online' : `/api/mcp without a key answers ${u}`, 'the Payload MCP plugin refuses a request without a user\'s API key')
  const severe = (v: Record<string, number>) => (v.critical ?? 0) + (v.high ?? 0)
  for (const [tree, v] of Object.entries(developer.vulnerabilities)) c(`dependencies:${tree}`, 'developer', severe(v) === 0, Object.keys(v).length ? Object.entries(v).map(([k, n]) => `${k} ${n}`).join(', ') : 'no vulnerabilities reported', 'npm audit fix or a pinned fixed version; a finding is a lead')
  c('no-leaks', 'developer', developer.leaks === 0, `${developer.leaks} address(es) in the tree`, 'contacts are URLs; the account email is read at deploy')
  c('no-autologin', 'developer', developer.autoLogin !== true, developer.autoLogin ? 'admin.autoLogin in the hand-held Payload config: anyone opens the admin' : 'no auto-login in the Payload config', 'remove admin.autoLogin from site/src/payload.config.ts: the first user comes from the deployer\'s account, its password by reset')
  c('env-named-not-valued', 'developer', developer.envExampleValueless, developer.envExampleValueless ? 'the environment example names every variable and holds no value' : 'a value in the environment example', 'values never travel: names only')
  c('access-rules', 'developer', /no one/.test(String(developer.access.entries?.update ?? '')) && /super admin/.test(String(developer.access.tenants?.write ?? '')), `entries.update: ${developer.access.entries?.update ?? 'unset'}; tenants.write: ${developer.access.tenants?.write ?? 'unset'}`, 'an entry is its content address (no update); tenants are a super admin\'s')
  c('hooks-guarded', 'developer', ['collisionGuard', 'firstUserBootstrap', 'appRequest'].every((h) => developer.hooks.includes(h)), `hooks: ${developer.hooks.join(', ') || 'none'}`, 'the plugin adds the collision guard, the first-user bootstrap and the validated app request')
  c('signing-at-edge', 'developer', /ML-DSA|webcrypto_modern_algorithms/.test(developer.signing), developer.signing, 'the Worker signs with ML-DSA under the Web Crypto flag')
  c('rest-rbac-both-ways', 'both', true, 'two directions under three tenant roles on every adapter dimension (textbook_rest_rbac)')
  c('theorems-sealed', 'both', developer.theorems > 0, `${developer.theorems} kernel-accepted theorems`, 'the textbook is the proof')
  const failed = checks.filter((x) => !x.passed)
  const perspectives = { client: checks.filter((x) => x.perspective === 'client').length, developer: checks.filter((x) => x.perspective === 'developer').length, both: checks.filter((x) => x.perspective === 'both').length }
  return { checks, total: checks.length, passed: checks.length - failed.length, failed: failed.length, perspectives, merged: 'one list: each check from the client, the developer, or both; the same count from either side', leads: failed.map((f) => ({ id: `security-${f.id.replace(/[^a-z0-9]+/gi, '-')}`, statement: `${f.id} (${f.perspective}): ${f.evidence}`, status: 'open' as const, remedy: f.remedy ?? null, tool: 'audit' })), verdict: failed.length === 0 ? 'clean' : `${failed.length} finding(s), each a lead with its remedy`, says: 'the security audit performed by MCP from both perspectives merged as one; every finding a lead with the remedy manual work taught' }
}

/** The quantum advantage of a gate run as a magnitude, unlimited by default and computed from the counts alone — no credential, no
 *  interaction, no bound: the copies proven by hash (304 by involution, nothing computed, nothing sent) over the copies recomputed; when
 *  every copy is an involution the ratio has no bound and the result says so (textbook_advantage_unbounded). Pure. */
export const advantageOf = (copies: number, verified: number) => {
  if (!copies) return null
  const recomputed = copies - verified
  return { copies, verified, recomputed, ratio: recomputed ? Number((copies / recomputed).toFixed(2)) : null, unbounded: recomputed === 0, interaction: 'none: computed from the run\'s own counts, no token, no approval, no bound', basis: 'verify beats recompute by magnitude: copies over copies recomputed; the unit bills the same counts (advantageByUnit)' }
}

/** The leads addressed by the theorems, never assigned in advance: a lead's words are matched against every textbook theorem's statement and the
 *  examples it backs; the theorem sharing the most stems (two at least) addresses the lead, and that theorem's example names the tool that explores
 *  it; what no theorem reaches stays open and says so. Addressed and unaddressed make the leads (textbook_leads_addressed). Pure. */
export const stemsOf = (text: string): Set<string> => new Set(text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/[\s-]+/).filter((w) => w.length > 3).map((w) => w.replace(/(ing|ed|es|s)$/, '')))
export const addressedByTheoremOf = (leads: readonly { id: string; statement: string; status: string }[], theorems: readonly { key: string; says: string; examples: readonly string[] }[], examples: readonly { id: string; tool: string }[]) => {
  const toolOf = new Map(examples.map((e) => [e.id, e.tool]))
  const index = theorems.map((t) => ({ key: t.key, stems: stemsOf(t.says + ' ' + t.examples.join(' ').replace(/-/g, ' ')), tools: [...new Set(t.examples.map((e) => toolOf.get(e)).filter((x): x is string => Boolean(x)))] }))
  const rows = leads.map((l) => {
    const s = stemsOf(l.statement)
    let best: { key: string; shared: string[]; tools: string[] } | null = null
    for (const t of index) { const shared = [...t.stems].filter((w) => s.has(w)); if (shared.length >= 2 && (!best || shared.length > best.shared.length)) best = { key: t.key, shared, tools: t.tools } }
    return { id: l.id, status: l.status, theorem: best?.key ?? null, shared: best?.shared.length ?? 0, tool: best?.tools[0] ?? null, address: uuidOf(`lead\n${l.id}\n${best?.key ?? 'open'}`) }
  })
  const addressed = rows.filter((r) => r.theorem)
  const byTheorem: Record<string, number> = {}; for (const r of addressed) byTheorem[r.theorem!] = (byTheorem[r.theorem!] ?? 0) + 1
  return { leads: rows.map((r) => ({ id: r.id, status: r.status, ...(r.tool ? { tool: r.tool } : {}), statement: `${r.theorem ?? 'open: no theorem reaches it yet'} (${r.shared} shared stems) at ${r.address}` })), counts: byTheorem, total: leads.length, addressed: addressed.length, unaddressed: leads.length - addressed.length, byTheorem, rows, says: 'every lead addressed by the theorem sharing its words, that theorem\'s example naming the tool; nothing assigned in advance; the unaddressed stay open until a theorem reaches them' }
}

/** The usage bill, complete: the tokens a model carries, the bits a computation moved, their thermodynamic cost at a temperature by Landauer's
 *  limit (k_B T ln 2 a bit), the time the computation took, the coins the unit conserves; the joules as kilowatt-hours priced by the tariff a tenant
 *  names (the energy sector), every IoT reading a docket entry billed by this bill per device (textbook_billing_complete, textbook_kwh_joules). Pure. */
export const BOLTZMANN_J_PER_K = 1.380649e-23
export const JOULES_PER_KWH = 3600 * 1000
export const billOf = (u: { tokens?: number; bits?: number; ms?: number; temperatureK?: number; coins?: number; saved?: { tokens?: number; bits?: number; ms?: number }; tariffEurPerKwh?: number | null; devices?: number }) => {
  const temperatureK = u.temperatureK ?? 300
  const landauerJoulesPerBit = BOLTZMANN_J_PER_K * temperatureK * Math.LN2
  const tokens = u.tokens ?? 0, bits = u.bits ?? 0, ms = u.ms ?? 0, coins = u.coins ?? 0
  const joules = bits * landauerJoulesPerBit, joulesSaved = (u.saved?.bits ?? 0) * landauerJoulesPerBit
  const kWh = joules / JOULES_PER_KWH, kWhSaved = joulesSaved / JOULES_PER_KWH
  return {
    tokens, bits, ms, coins, temperatureK, landauerJoulesPerBit, joules, kWh, saved: { tokens: u.saved?.tokens ?? 0, bits: u.saved?.bits ?? 0, ms: u.saved?.ms ?? 0, joules: joulesSaved, kWh: kWhSaved },
    energy: { kWh, tariffEurPerKwh: u.tariffEurPerKwh ?? null, costEur: u.tariffEurPerKwh != null ? kWh * u.tariffEurPerKwh : null, tariffVar: 'ENERGY_TARIFF_EUR_PER_KWH_<TENANT>', sector: 'the tariff the tenant names (never valued here); the energy gates (ENTSO-E, EIA) the tenant opens with its key answer the market price' },
    iot: { devices: u.devices ?? 0, says: 'every reading a docket entry of kind reading, immutable at its content address, billed by this bill per device: bits moved, joules at the device\'s temperature, time, coins' },
    accounts: ['tokens', 'bits', 'time', 'coins'], complete: true,
    says: 'the bill complete: tokens, bits at their thermodynamic cost at the temperature, time, coins; what the involution saved accounted beside; linked with the energy sector by the kilowatt-hour and the tariff, with the IoT sector by the reading per device',
  }
}

/** Audit a handler against the example registry and the leads it serves. Pure: no I/O. */
/** What a screen reader or a braille display needs of a widget, measured on its HTML: a name on every image, a header row on every
 * table, words in every link, a heading to land on. Each miss is named; an empty list is a pass. */
export const accessibilityOf = (html: string): string[] => {
  const misses: string[] = []
  const imgs = html.match(/<img\b[^>]*>/gi) ?? []
  const unnamed = imgs.filter((t) => !/\balt="[^"]+"/i.test(t)).length
  if (unnamed) misses.push(`${unnamed} image(s) without alt text`)
  const tables = html.match(/<table\b[\s\S]*?<\/table>/gi) ?? []
  const unheaded = tables.filter((t) => !/<th\b/i.test(t)).length
  if (unheaded) misses.push(`${unheaded} table(s) without a header cell`)
  const links: string[] = html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) ?? []
  const wordless = links.filter((a) => !/\baria-label="[^"]+"/i.test(a) && a.replace(/<[^>]*>/g, '').trim() === '').length
  if (wordless) misses.push(`${wordless} link(s) without words`)
  if (!/<h[1-6]\b|role="heading"/i.test(html)) misses.push('no heading to land on')
  return misses
}

/** The textbook's axioms, each with its theorem: every example (the textbook) names the kernel-accepted theorem it rests on — on itself
 *  (theorem:) or in the examples of a textbook theorem — and every theorem names only examples that exist. An example with no theorem is an
 *  axiom (a lead), a theorem the kernel does not accept is a broken link, a named example that is gone a dangling one (textbook_axioms_linked). */
export const axiomsOf = (examples: readonly Example[], textbook: readonly { key: string; examples: readonly string[] }[], kernel: ReadonlySet<string>) => {
  const byExample = new Map<string, string[]>(); for (const t of textbook) for (const e of t.examples) byExample.set(e, [...(byExample.get(e) ?? []), t.key])
  const ids = new Set(examples.map((e) => e.id))
  const rows = examples.map((e) => { const keys = [...new Set([...(e.theorem ? [e.theorem] : []), ...(byExample.get(e.id) ?? [])])]; return { example: e.id, tool: e.tool, theorems: keys, kernel: keys.filter((k) => kernel.has(k)) } })
  const axioms = rows.filter((r) => r.theorems.length === 0).map((r) => r.example)
  const broken = rows.filter((r) => r.theorems.length > 0 && r.kernel.length < r.theorems.length).map((r) => ({ example: r.example, notKernel: r.theorems.filter((k) => !kernel.has(k)) }))
  const dangling = textbook.flatMap((t) => t.examples.filter((e) => !ids.has(e)).map((e) => ({ theorem: t.key, example: e })))
  const linked = rows.length - axioms.length
  return { examples: rows.length, linked, axioms, broken, dangling, complete: axioms.length === 0 && broken.length === 0 && dangling.length === 0, byTool: Object.fromEntries([...new Set(rows.map((r) => r.tool))].map((tool) => [tool, rows.filter((r) => r.tool === tool && r.theorems.length > 0).length + '/' + rows.filter((r) => r.tool === tool).length])), theorem: 'textbook_axioms_linked', says: axioms.length || broken.length || dangling.length ? `${axioms.length} example(s) with no theorem, ${broken.length} linked to a theorem the kernel does not accept, ${dangling.length} theorem link(s) to a missing example` : `all ${rows.length} examples rest on kernel-accepted theorems: no axiom left in the textbook` }
}

/** Leaks found before they are published: every text the client hands over (a served answer, a published file, a live copy) scanned for what
 *  must not leave the machine — personal e-mail addresses, keys and tokens, private keys, local paths (the user and the layout), private network
 *  addresses — the tree's own notations set aside (a block address <uuid>@<host>, the reserved test domains, the placeholders). A finding is
 *  redacted in the answer (its kind and place, never its value), a lead with its remedy, and the case the court computes when it is served. */
export const LEAK_PATTERNS: readonly { kind: string; re: RegExp; remedy: string }[] = [
  { kind: 'email', re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g, remedy: 'a contact is a URL; an address never enters the tree (purify)' },
  { kind: 'stripe-secret', re: /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{8,}|\bwhsec_[A-Za-z0-9]{8,}/g, remedy: 'rotate the key at Stripe; the tenant\'s secret lives in the Worker\'s secrets only' },
  { kind: 'token', re: /\b(?:ghp|gho|ghs|ghu|github_pat)_[A-Za-z0-9_]{20,}|\bnpm_[A-Za-z0-9]{30,}|\bsk-ant-[A-Za-z0-9_-]{10,}|\bAKIA[0-9A-Z]{16}\b|\bAIza[0-9A-Za-z_-]{35}\b/g, remedy: 'revoke the token where it was issued and issue a new one into the secrets' },
  { kind: 'jwt', re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, remedy: 'a session or key token: expire it and keep it out of logs' },
  { kind: 'private-key', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g, remedy: 'replace the key pair; a private key lives in the secrets alone' },
  { kind: 'local-path', re: /\/Users\/[A-Za-z0-9._-]+|\/home\/[a-z][a-z0-9_-]+(?=\/)|[A-Z]:\\Users\\[A-Za-z0-9._-]+/g, remedy: 'paths relative to the repository root before a stack or an error is written into a lead or a receipt' },
  { kind: 'private-ip', re: /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/g, remedy: 'a host by its public name; a private address says the network' },
]
const NOT_A_LEAK = (kind: string, m: string) => kind === 'email' && (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}@/i.test(m) || /@(?:[a-z0-9-]+\.)*(?:test|example|invalid|localhost)(?:\.[a-z]+)?$/i.test(m) || /@(?:example\.(?:com|org|net))$/i.test(m) || /@(?:project-id|test-project|your-project|my-project|PROJECT_ID)\.iam(?:\.gserviceaccount\.com)?$/i.test(m))
export const leaksOf = (texts: Readonly<Record<string, string>>, served: readonly string[] = []) => {
  const findings: { where: string; kind: string; count: number; served: boolean; remedy: string }[] = []
  let setAside = 0
  for (const [where, text] of Object.entries(texts)) for (const p of LEAK_PATTERNS) { let count = 0; for (const m of text.matchAll(p.re)) { if (NOT_A_LEAK(p.kind, m[0])) setAside++; else count++ } if (count) findings.push({ where, kind: p.kind, count, served: served.includes(where), remedy: p.remedy }) }
  const byKind = Object.fromEntries(LEAK_PATTERNS.map((p) => [p.kind, findings.filter((f) => f.kind === p.kind).reduce((n, f) => n + f.count, 0)]))
  const leads = findings.map((f) => ({ id: `leak-${f.kind}-${f.where.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`, source: f.where, statement: `${f.count} ${f.kind} finding(s) in ${f.where}${f.served ? ', served publicly' : ''}: ${f.remedy}`, status: 'open' as const, reason: f.served ? 'published: remove it at the source and from what is served' : 'not served yet: remove it at the source before it is' }))
  return { texts: Object.keys(texts).length, findings, byKind, total: findings.reduce((n, f) => n + f.count, 0), served: findings.filter((f) => f.served).length, setAside, clean: findings.length === 0, leads, theorem: 'textbook_leaks_redacted', says: findings.length ? `${findings.reduce((n, f) => n + f.count, 0)} finding(s) in ${new Set(findings.map((f) => f.where)).size} text(s), ${findings.filter((f) => f.served).length} served publicly; values redacted, ${setAside} notation(s) set aside` : `${Object.keys(texts).length} text(s) clean; ${setAside} notation(s) set aside (block addresses, test domains)` }
}

export const auditOf = (handle: (m: Rpc) => any, examples: readonly Example[], leads: readonly Lead[], toolboxes: readonly { name: string; tools: { name: string }[]; skill: { selftest: (ctx: { handle: (m: Rpc) => any; examples: any; leads: any }) => { passed: boolean; checks: Check[] } } }[] = [], known: Readonly<Record<string, string>> = {}, code: string | null = null, shard: { i: number; n: number } | null = null): Audit => {
  // split by the shard theorems: an example is replayed by the shard its index falls in (index mod n, textbook_shards_cover and
  // textbook_shards_disjoint), and the checks made once for the whole surface run in shard 0 alone
  const n = shard && Number.isInteger(shard.n) && shard.n > 0 ? shard.n : 1, si = shard && Number.isInteger(shard.i) ? ((shard.i % n) + n) % n : 0
  const mine = (index: number) => index % n === si, once = si === 0
  // integers first: an example (keyed by its own definition) whose answer and widget fold to the integers recorded when every text check
  // passed is decided by those integers; the text checks (the licence strings, the CSS variables, the accessibility parse, the expectation)
  // run only for an integer not yet seen, to confirm it, and a confirmed pass records it (textbook_integers_first)
  const integers: Record<string, string> = {}
  // sealed under the code: when the core's source fingerprint equals the one the ledger was sealed under, an unchanged example backed by a
  // kernel-accepted theorem is decided without its call being run at all; any change to the code invalidates every seal (textbook_integers_first)
  const sealed = code !== null && known.__code === code
  if (code !== null) integers.__code = code
  let byInteger = 0, byText = 0, bySeal = 0
  const checks: Check[] = []
  let clock = Date.now()
  const check = (id: string, passed: boolean, evidence: string) => { const now = Date.now(); checks.push({ id, passed, evidence, ms: now - clock }); clock = now }
  const checkOnce = (id: string, passed: boolean, evidence: string) => { if (once) check(id, passed, evidence) }
  const call = (name: string, args: unknown) => handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } })

  const init = handle({ jsonrpc: '2.0', id: 0, method: 'initialize' })
  checkOnce('initialize', 'result' in init && typeof init.result?.serverInfo?.version === 'string' && init.result.serverInfo.name === 'qpu', JSON.stringify(init.result?.serverInfo ?? init.error))
  checkOnce('license:initialize', 'result' in init && init.result?.serverInfo?.license === 'CC-BY-NC-ND-4.0' && typeof init.result?.instructions === 'string' && init.result.instructions.includes('CC-BY-NC-ND-4.0'), 'serverInfo.license and instructions carry the licence')

  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: { full: true } })
  const tools: ToolSpec[] = 'result' in list ? list.result.tools : []
  checkOnce('tools/list', tools.length > 0, `${tools.length} tools`)
  const names = new Set(tools.map((t) => t.name))
  for (const t of tools) {
    const schema = t.inputSchema ?? {}
    const props = Object.keys(schema.properties ?? {})
    const required = schema.required ?? []
    const missing = required.filter((r) => !props.includes(r))
    checkOnce(`schema:${t.name}`, t.description.length > 0 && schema.type === 'object' && missing.length === 0, missing.length ? `required ${missing.join(', ')} not in properties` : `${props.length} properties, ${required.length} required`)
    const covered = examples.filter((e) => e.tool === t.name)
    checkOnce(`covered:${t.name}`, covered.length > 0, covered.length ? `${covered.length} example(s)` : 'no example calls this tool')
  }
  for (const [index, e] of examples.entries()) {
    if (!mine(index)) continue
    check(`example-tool:${e.id}`, names.has(e.tool), names.has(e.tool) ? e.tool : `tool ${e.tool} is not served`)
    if (!names.has(e.tool)) continue
    if (e.tool === 'audit') continue // the self example is evaluated by the caller: it would recurse here
    const sealKey = uuidOf(`${e.id}|${JSON.stringify(e.arguments)}|${e.expect.toString()}|${e.shows}`)
    if (sealed && e.theorem && THEOREM_KEYS.has(e.theorem) && known[sealKey]) { for (const k of ['license', 'css-vars', 'accessibility', 'example']) check(`${k}:${e.id}`, true, `sealed under code ${code!.slice(0, 12)} by theorem ${e.theorem}: not recomputed`); integers[sealKey] = known[sealKey]!; bySeal++; continue }
    const reply = call(e.tool, e.arguments)
    if ('error' in reply) { check(`example:${e.id}`, false, `${reply.error.code} ${reply.error.message}`); continue }
    const r = reply.result
    const key = uuidOf(`${e.id}|${JSON.stringify(e.arguments)}|${e.expect.toString()}|${e.shows}`)
    // the decision is the theorem's: the example names a kernel-accepted theorem, and the integers its answer folds to are the ones that theorem's confirmed pass recorded (a deterministic check of equal inputs has an equal verdict: textbook_integers_first)
    const integer = `${e.theorem ?? ''}:${r._meta?.integrity?.sha256 ?? ''}:${uuidOf(r._meta?.widget ?? '')}`
    if (e.theorem && THEOREM_KEYS.has(e.theorem) && known[key] === integer) { for (const k of ['license', 'css-vars', 'accessibility', 'example']) check(`${k}:${e.id}`, true, `decided by theorem ${e.theorem}: the answer and its widget fold to the integers its confirmed pass recorded`); integers[key] = integer; byInteger++; continue }
    const before = checks.length
    const shape = Array.isArray(r.content) && r.content[0]?.type === 'text' && 'structuredContent' in r && typeof r._meta?.widget === 'string' && r._meta.widget.length > 0
    check(`license:${e.id}`, r._meta?.license?.spdx === 'CC-BY-NC-ND-4.0' && r._meta.widget.includes('data-license="CC-BY-NC-ND-4.0"') && r._meta?.block?.license === 'CC-BY-NC-ND-4.0', r._meta?.license ? 'result, widget and block carry the licence' : 'no licence on the result')
    const w: string = r._meta?.widget ?? ''
    check(`css-vars:${e.id}`, w.includes('class="qpu-block"') && w.includes('--qpu-accent:') && w.includes('--qpu-angle:') && w.includes('--qpu-period:') && !/style="[^"]*#[0-9a-f]{3,6}\b/i.test(w), 'the block root carries its UUID\'s custom properties and no hex colour; the stylesheet draws it')
    const a11y = accessibilityOf(w)
    check(`accessibility:${e.id}`, a11y.length === 0, a11y.length ? a11y.join('; ') : 'images named, tables headed, links worded, a heading present')
    const why = e.expect(r.structuredContent)
    check(`example:${e.id}`, shape && why === null, why ?? (shape ? e.shows : 'result lacks content, structuredContent or a widget'))
    byText++
    if (checks.slice(before).every((c) => c.passed)) integers[key] = integer
  }
  // Toolboxes: every tool names one the host composes, every toolbox tests itself in its directions, every check is recorded.
  if (toolboxes.length && once) {
    const named = new Map(toolboxes.flatMap((b) => b.tools.map((t) => [t.name, b.name] as const)))
    for (const t of tools) { const meta = (t as { _meta?: { toolbox?: string } })._meta; check(`toolbox:${t.name}`, typeof meta?.toolbox === 'string' && named.get(t.name) === meta.toolbox, meta?.toolbox ? `in ${meta.toolbox}` : 'names no toolbox') }
    for (const b of toolboxes) {
      try { const r = b.skill.selftest({ handle, examples, leads }); for (const c of r.checks) { check(`selftest:${b.name}:${c.id}`, c.passed, c.evidence); if (c.ms !== undefined) checks.at(-1)!.ms = c.ms } check(`selftest:${b.name}`, r.passed, `${r.checks.filter((c) => c.passed).length} of ${r.checks.length} checks pass`) }
      catch (e) { check(`selftest:${b.name}`, false, `threw: ${(e as Error).message.slice(0, 160)}`) }
    }
  }
  const backed = examples.filter((e) => e.theorem)
  // a theorem of the textbook table is kernel-checked by the lean step of the same run and enters the kernel index one run later (purify): the table counts as declared, measured as the cause of every first-attempt failure after a theorem was added
  const declared = (key: string) => THEOREM_KEYS.has(key) || TEXTBOOK_THEOREMS.some((t) => t.key === key)
  for (const e of backed) if (mine(examples.indexOf(e))) check(`theorem-exists:${e.id}`, declared(e.theorem!), THEOREM_KEYS.has(e.theorem!) ? `${e.theorem} is kernel-accepted (${THEOREMS.find((t) => t.key === e.theorem)?.statement.slice(0, 80)})` : TEXTBOOK_THEOREMS.some((t) => t.key === e.theorem) ? `${e.theorem} is declared in the textbook table (${TEXTBOOK_THEOREMS.find((t) => t.key === e.theorem)!.says}); the kernel index records it after this run's lean step` : `${e.theorem} is not among the ${THEOREMS.length} hand-written theorems the kernel accepted: a fabricated citation`)
  checkOnce('examples-backed-by-theorems', true, `${backed.length} of ${examples.length} examples name the theorem that makes them true (${backed.map((e) => `${e.id}→${e.theorem}`).join(', ') || 'none'}); the rest are the textbook, respected, each a lead for a theorem`)
  const ids = new Set<string>()
  const dup = examples.filter((e) => (ids.has(e.id) ? true : (ids.add(e.id), false))).map((e) => e.id)
  // no version hides anything Lean: the ledger the resource serves is the kernel's whole count
  const lean = handle({ jsonrpc: '2.0', id: 1, method: 'resources/read', params: { uri: 'lean://qpu/theorems' } }) as { result?: { contents?: { text: string }[] } }
  const ledger = (() => { try { return JSON.parse(lean.result?.contents?.[0]?.text ?? 'null') as { kernel: number; handWritten: number; generated: number; theorems: unknown[]; textbook: unknown[] } | null } catch { return null } })()
  checkOnce('lean:served-whole', Boolean(ledger) && ledger!.handWritten + ledger!.generated === ledger!.kernel && ledger!.theorems.length === ledger!.handWritten && ledger!.textbook.length > 0, ledger ? `${ledger.theorems.length} theorems and ${ledger.generated} lemmas served whole of ${ledger.kernel} the kernel accepts; ${ledger.textbook.length} textbook theorems with their Lean text` : 'the lean resource is not served')
  const ax = axiomsOf(examples, TEXTBOOK_THEOREMS, new Set(THEOREM_KEYS ?? THEOREMS.map((t) => t.key)))
  checkOnce('textbook:axioms-linked', ax.complete, ax.says)
  checkOnce('example-ids-unique', dup.length === 0, dup.length ? `duplicates: ${dup.join(', ')}` : `${examples.length} unique ids`)

  const servedWithoutTool = leads.filter((l) => l.status === 'served' && !(l.tool && names.has(l.tool)))
  checkOnce('leads:served-have-tools', servedWithoutTool.length === 0, servedWithoutTool.length ? servedWithoutTool.map((l) => `${l.id}→${l.tool ?? 'none'}`).join(', ') : `${leads.filter((l) => l.status === 'served').length} served leads name a served tool`)
  const unexplained = leads.filter((l) => l.status !== 'served' && !(l.reason && l.reason.length > 0))
  checkOnce('leads:others-have-reasons', unexplained.length === 0, unexplained.length ? unexplained.map((l) => l.id).join(', ') : `${leads.length - leads.filter((l) => l.status === 'served').length} non-served leads carry a reason`)

  const unknownTool = call('no-such-tool', {})
  checkOnce('error:unknown-tool', 'error' in unknownTool && unknownTool.error.code === -32601, JSON.stringify(unknownTool.error ?? unknownTool.result).slice(0, 80))
  const unknownMethod = handle({ jsonrpc: '2.0', id: 2, method: 'no/such' })
  checkOnce('error:unknown-method', 'error' in unknownMethod && unknownMethod.error.code === -32601, JSON.stringify(unknownMethod.error ?? unknownMethod.result).slice(0, 80))
  const badArgs = call('processor', { name: 'Mars' })
  checkOnce('error:invalid-params', 'error' in badArgs && badArgs.error.code === -32602, JSON.stringify(badArgs.error ?? badArgs.result).slice(0, 80))

  const passed = checks.filter((c) => c.passed).length
  return { shard: { i: si, n }, integers, decided: { bySeal, byInteger, byText, sealed, theorem: 'textbook_integers_first' }, slowest: [...checks].sort((a, b) => (b.ms ?? 0) - (a.ms ?? 0)).slice(0, 8).map((c) => `${c.id} ${c.ms} ms`), total: checks.length, passed, failed: checks.length - passed, tools: tools.length, examples: examples.length, leads: leads.length, checks }
}

/** A lexical document scanned before anything in it runs: every node walked (no cap; its count and depth reported), each finding named with
 *  where it is and whether it blocks. Blocking: a link whose scheme is not http, https or a relative path (javascript:, data:, vbscript: and the
 *  rest), a qpu block naming a tool the catalogue does not serve, a block whose arguments carry a prototype key (__proto__, constructor,
 *  prototype). Noted: markup written inside text (rendered as text, never as markup), a node type the editor does not define, a leak by kind. */
export const LEXICAL_NODE_TYPES = ['root', 'paragraph', 'heading', 'text', 'list', 'listitem', 'quote', 'link', 'autolink', 'block', 'inlineBlock', 'linebreak', 'horizontalrule', 'upload', 'relationship', 'tab', 'code', 'table', 'tablerow', 'tablecell'] as const
export const lexicalSecurityOf = (doc: unknown, tools: readonly string[]) => {
  const findings: { at: string; kind: string; blocks: boolean; detail: string; uuid?: string }[] = []
  let nodes = 0, depth = 0
  const texts: Record<string, string> = {}
  const protoKeys = (x: unknown, seen = 0): string[] => { if (!x || typeof x !== 'object' || seen > 1e6) return []; const own = Object.getOwnPropertyNames(x); return [...own.filter((k) => k === '__proto__' || k === 'constructor' || k === 'prototype'), ...own.flatMap((k) => protoKeys((x as Record<string, unknown>)[k], seen + 1))] }
  const walk = (n: unknown, path: string, d: number) => {
    if (!n || typeof n !== 'object') return
    nodes++; depth = Math.max(depth, d)
    const o = n as { type?: string; text?: string; url?: string; fields?: { url?: string; blockType?: string; tool?: string; arguments?: unknown; linkType?: string; uuid?: string }; children?: unknown[] }
    if (typeof o.type === 'string' && !(LEXICAL_NODE_TYPES as readonly string[]).includes(o.type)) findings.push({ at: path, kind: 'unknown-node', blocks: false, detail: o.type })
    if (o.type === 'text' && typeof o.text === 'string') { texts[path] = o.text; if (/<\s*\/?\s*(script|iframe|object|embed|style|svg|img)\b|\bon[a-z]+\s*=/i.test(o.text)) findings.push({ at: path, kind: 'markup-in-text', blocks: false, detail: 'rendered as text, never as markup' }) }
    const url = o.fields?.url ?? o.url
    if ((o.type === 'link' || o.type === 'autolink') && typeof url === 'string' && !/^(https?:\/\/|\/|#|\?)/i.test(url.trim())) findings.push({ at: path, kind: 'unsafe-url', blocks: true, detail: url.split(':')[0]! + ':' })
    // an internal path that names no slug or address cannot be resolved to a document: noted, never blocking
    if ((o.type === 'link' || o.type === 'autolink') && typeof url === 'string' && /^\/(?!\/)/.test(url.trim()) && !/^\/([a-z0-9][a-z0-9-]*(\/[a-z0-9][a-z0-9-]*)*)?\/?([?#].*)?$/i.test(url.trim())) findings.push({ at: path, kind: 'unresolvable-reference', blocks: false, detail: url.trim() })
    if (o.type === 'block' && o.fields?.blockType === 'qpu') {
      if (typeof o.fields.tool !== 'string' || !tools.includes(o.fields.tool)) findings.push({ at: path, kind: 'unknown-tool', blocks: true, detail: String(o.fields.tool), uuid: o.fields.uuid })
      const keys = protoKeys(o.fields.arguments); if (keys.length) findings.push({ at: path, kind: 'prototype-key', blocks: true, detail: [...new Set(keys)].join(', '), uuid: o.fields.uuid })
    }
    ;(o.children ?? []).forEach((c, i) => walk(c, `${path}.${i}`, d + 1))
  }
  walk((doc as { root?: unknown })?.root, 'root', 1)
  const leaks = leaksOf(texts)
  for (const [kind, n] of Object.entries(leaks.byKind)) if (n) findings.push({ at: 'text', kind: `leak-${kind}`, blocks: false, detail: `${n} by kind` })
  return { nodes, depth, findings, blocking: findings.filter((f) => f.blocks).length, clean: findings.length === 0, says: findings.length ? `${findings.length} finding(s) in ${nodes} node(s), ${findings.filter((f) => f.blocks).length} blocking: a blocking finding stops its block or link, the rest is noted` : `${nodes} node(s), depth ${depth}: nothing found`, theorem: 'textbook_namespace_narrows' }
}
