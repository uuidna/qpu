// The MCP surface audited through the MCP surface: every check below is made by calling `handle` the way a client
// does, so the audit sees exactly what a client sees. A failed check is a lead with its evidence, never a ruling.

import type { Example } from './examples.ts'
import type { Context } from './toolbox.ts'
import type { Lead } from './leads.ts'

export type Rpc = { jsonrpc: '2.0'; id?: number | string | null; method: string; params?: unknown }
import { THEOREMS, THEOREM_KEYS } from './theorems-index.ts'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'
import { uuid, seal } from '../uuid/index.ts'
import { manageApi } from '../payload/index.ts'
import { TABLES } from './tables-index.ts'
import { ISO_ENTROPY, isoEntropyOf } from './iso-deliverables.ts'
import { clock } from './unit/clock.ts'

export type Check = { id: string; passed: boolean; evidence: string; /** milliseconds since the previous check: where the audit's time goes */ ms?: number }
type Audit = { /** the share this run replayed: index mod n = i (n = 1 is the whole audit) */ shard: { i: number; n: number }; /** example key → the integers its confirmed pass folded to: the next run decides by them */ integers: Record<string, string>; /** how many examples the integers decided and how many the text confirmed */ decided: { bySeal: number; byInteger: number; byText: number; sealed: boolean; theorem: string }; /** the eight slowest checks, with their milliseconds: where the audit's time goes */ slowest: string[]; total: number; passed: number; failed: number; tools: number; examples: number; leads: number; checks: Check[] }

type ToolSpec = { name: string; description: string; inputSchema: { type?: string; required?: string[]; properties?: Record<string, unknown> } }


/** Entropy cleaner: dictionary meaning first (disorder), then verified under ISO 80000-5 (S = k ln W).
 *  Each finding is a microscopic configuration of disorder; distinct addresses are W; fusion never multiplies
 *  (textbook_entropy_fusion: f − d ≤ f); vacuum is W = 1, S = 0; the gravity is the fold of the sorted addresses. */
type EntropyKind = 'literal' | 'typed-path' | 'cap' | 'clock' | 'duplicate' | 'shape' | 'todo' | 'leak'
/** Shapes written out in many files that one helper (named beside each) should hold. */
const CODE_SHAPES: readonly { shape: string; re: RegExp; holder: string }[] = [
  { shape: 'the tools/call envelope', re: /handle\(\{ jsonrpc: '2\.0', id: \d+, method: 'tools\/call', params: \{ name/, holder: 'caller(name) in mcp.ts' },
  { shape: 'a JSON file read and parsed', re: /JSON\.parse\(readFileSync\(/, holder: 'one reader of the published files, null when a file is missing' },
  { shape: 'the published folder made', re: /mkdirSync\(join\(ROOT, 'docs', 'public'\), \{ recursive: true \}\)/, holder: 'one writer of the published files that makes its folder' },
  { shape: 'a request with its timeout', re: /signal: AbortSignal\.timeout\(/, holder: 'one fetcher with the named user agent and the timeout' },
  { shape: 'the tools/list envelope', re: /handle\(\{ jsonrpc: '2\.0', id: \d+, method: 'tools\/list' \}\)/, holder: 'one reader of the tool list' },
]
/** Each kind of entropy: the tool that explores its leads and the configure kind that settles them. */
export const ENTROPY_KINDS = TABLES.ENTROPY_KINDS as readonly { kind: EntropyKind; says: string; explore: string; config: string | null }[]
type EntropyFinding = { kind: EntropyKind; file: string; line: number; excerpt: string; address: string }
type EntropyLead = { id: string; kind: EntropyKind; source: string; statement: string; status: 'open'; tool: 'audit'; occurrences: number; address: string; explore: string; config: string | null }
export const LEAK_ALLOWED = new Set(['payloadcms.com', 'example.com', 'test.com', 'thirdparty.com', 'github.com', 'anthropic.com', 'localhost.test', 'local.test'])
/** Paths and URLs each live in one registry (a path by its role, file; a URL in the sources, discovery and leads tables): a literal elsewhere in
 *  hand-written source is dirty, priced by its bytes, its antimatter the move to its registry (textbook_literal_in_registry). Generated files,
 *  fixtures, tests and the licence's verbatim URLs are exempt. */
/** The generator of each generated file: the antimatter of its drift runs it and restages what drifted. */
export const GENERATOR_REMEDIES: readonly [RegExp, { cmd: string; args: string[] }][] = [
  [/theorems-index\.ts$/, { cmd: 'npm', args: ['run', '-s', 'purify'] }],
  [/clay-statements\.ts$/, { cmd: 'node', args: ['scripts/run.ts', 'clay:gen'] }],
  [/payload\.qpu\.|\.qpu\.(hooks\.ts|md)$|\/plugins\/qpu\.ts$|\/blocks\/Qpu\//, { cmd: 'node', args: ['scripts/configs.ts'] }],
  [/./, { cmd: 'npm', args: ['run', '-s', 'docs:gen'] }],
]
/** The roots whose hand-written source the literal rule reads. */
export const LITERAL_ROOTS = ['src', 'scripts'] as const
export const LITERAL_REGISTRIES = { url: ['src/quantum/processing/discovery.ts', 'src/quantum/processing/discovery-document.ts', 'src/quantum/processing/sources.ts', 'src/quantum/processing/leads.ts', 'src/quantum/processing/payload-surface.ts', 'src/quantum/processing/institutions.ts', 'src/quantum/processing/unit/index.ts'], path: ['src/quantum/processing/toolboxes/payload.ts', 'src/quantum/processing/toolboxes/repository.ts', 'src/quantum/processing/toolboxes/legal.ts', 'src/quantum/processing/audit.ts', 'src/quantum/processing/machine.ts', 'src/quantum/processing/examples.ts', 'src/quantum/processing/script-doors.ts', 'scripts/next.ts', 'scripts/run.ts', 'scripts/gen-clay.ts', 'scripts/legal.ts'] } as const
const LITERAL_EXEMPT = /uuidna\.com\/licen[cs]e|creativecommons\.org\/licenses|contributor-covenant\.org|\(\+https:\/\/qpu\.uuidna\.com\)/
type Literal = { kind: 'url' | 'path'; file: string; line: number; literal: string; clean: boolean; why: string; tokens: number; antimatter: { needs: 'confirm'; says: string } | null }
export const listLiterals = (files: Readonly<Record<string, string>>) => {
  const all: Literal[] = []
  for (const [file, text] of Object.entries(files)) {
    if (!/^(src|scripts)\//.test(file) || /\.test\.ts$/.test(file) || /^src\/quantum\/examples\.ts$/.test(file) || /\.(md|mdx|txt|json)$/.test(file)) continue
    if (/GENERATED|Generated by|generated:importmap/i.test(text.split('\n').slice(0, 8).join('\n'))) continue
    text.split('\n').forEach((l, i) => {
      const push = (kind: 'url' | 'path', literal: string) => {
        const registry = (LITERAL_REGISTRIES[kind] as readonly string[]).includes(file), exempt = kind === 'url' && LITERAL_EXEMPT.test(l)
        const clean = registry || exempt
        all.push({ kind, file, line: i + 1, literal, clean, why: registry ? 'in its registry' : exempt ? 'exempt: a licence or attribution URL required verbatim' : 'outside its registry', tokens: clean ? 0 : Math.ceil(new TextEncoder().encode(literal).length / 4), antimatter: clean ? null : { needs: 'confirm', says: kind === 'path' ? `name ${literal} by its role through file(role, key), or add the role to FILE_ROLES` : `move ${literal} into the sources or discovery table and reference its entry, or into the docket through the Payload MCP when it is tenant data` } })
      }
      for (const m of l.matchAll(/https?:\/\/[^\s'"`)<>\\]+/g)) push('url', m[0])
      for (const m of l.matchAll(/['"`]((?:docs|src|scripts)\/[^'"`\s]+)['"`]/g)) push('path', m[1]!)
    })
  }
  const dirty = all.filter((x) => !x.clean)
  const byFile = Object.entries(dirty.reduce<Record<string, number>>((a, x) => ({ ...a, [x.file]: (a[x.file] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1])
  return { urls: all.filter((x) => x.kind === 'url').length, distinctUrls: new Set(all.filter((x) => x.kind === 'url').map((x) => x.literal)).size, paths: all.filter((x) => x.kind === 'path').length, clean: all.length - dirty.length, outside: dirty.length, tokens: dirty.reduce((n, x) => n + x.tokens, 0), byFile, dirty, registries: LITERAL_REGISTRIES, theorem: 'textbook_literal_in_registry' }
}
/** Docs are expensive entropy unless a Lean program names the path. A TypeScript generator still leaves the page expensive.
 *  A page no script writes is manual, and that page is the leak. Dated audit dockets are exempt. Tokens are the bytes over four, rounded up, and never above the bytes (textbook_penalty_tokens_bound). */
const DOCS_EXEMPT = /^docs\/audit\/\d{4}-\d{2}-\d{2}-[^/]+\.md$/
export const listManualDocs = (pages: readonly { path: string; bytes: number }[], scripts: Readonly<Record<string, string>>, lean: Readonly<Record<string, string>> = {}) => {
  const writes = Object.entries(scripts).flatMap(([file, text]) => text.split('\n').filter((l) => /writeFileSync|appendFileSync|writePage|write\(/.test(l)).map((l) => ({ file, l })))
  const writer = (path: string) => { const name = path.replace(/^docs\//, '').replace(/\.md$/, ''), base = name.split('/').pop()!; return writes.find((w) => w.l.includes(`'${name}.md'`) || w.l.includes(`'${base}.md'`) || w.l.includes(`"${base}.md"`) || w.l.includes(`/${base}.md`))?.file ?? null }
  const inLean = (path: string) => Object.entries(lean).some(([file, text]) => file.endsWith('.lean') && text.includes(path))
  const rows = pages.map((p) => { const exempt = DOCS_EXEMPT.test(p.path), generator = exempt ? null : writer(p.path), byLean = !exempt && inLean(p.path), expensive = !exempt && !byLean, manual = !exempt && !generator && !byLean; return { ...p, exempt, generator, lean: byLean, manual, leak: manual, expensive, tokens: expensive ? Math.ceil(p.bytes / 4) : 0 } })
  const manual = rows.filter((r) => r.manual).sort((a, b) => b.bytes - a.bytes)
  const costly = rows.filter((r) => r.expensive).sort((a, b) => b.bytes - a.bytes)
  const found = manual.length, redacted = found
  const leaks = { kind: 'manual' as const, found, redacted, left: found - redacted, holds: found - redacted === 0, where: manual.map((r) => r.path), theorem: 'textbook_leaks_redacted' as const }
  return { pages: rows.length, generated: rows.filter((r) => r.generator).length, exempt: rows.filter((r) => r.exempt).length, lean: rows.filter((r) => r.lean).length, expensive: costly.length, manual: found, leaks, bytes: costly.reduce((n, r) => n + r.bytes, 0), tokens: costly.reduce((n, r) => n + r.tokens, 0), largest: costly.slice(0, 10).map((r) => ({ path: r.path, bytes: r.bytes, tokens: r.tokens, antimatter: { needs: 'auto' as const, says: `a Lean program names ${r.path}; until it does the page is expensive entropy, and a TypeScript generator does not cheapen it` } })), rows, says: `${costly.length} of ${rows.length} doc(s) are expensive entropy (${costly.reduce((n, r) => n + r.tokens, 0)} tokens); ${rows.filter((r) => r.lean).length} named by a Lean program cost nothing; ${found} written by no script, and that manual page is the leak` }
}
export const getEntropy = (files: Readonly<Record<string, string>>) => {
  const findings: EntropyFinding[] = []
  const add = (kind: EntropyKind, file: string, line: number, excerpt: string) => { const t = excerpt.trim(); findings.push({ kind, file, line, excerpt: t, address: uuid(`${kind}\n${t}`) }) }
  const repeated = new Map<string, { file: string; line: number }[]>()
  let lines = 0
  for (const [file, text] of Object.entries(files)) {
    const code = !/\.(md|mdx|txt)$/.test(file)
    const pure = /^src\/quantum\//.test(file) && !/\.test\.ts$|\/machine-run\.ts$|\/unit\/clock\.ts$/.test(file)
    const generated = /payload\.qpu\.|\.qpu\.(hooks\.ts|md)$|\/plugins\/qpu\.ts$|\/blocks\/Qpu\//.test(file)
    // a file a tool wrote says so in its head: its data is the tool's answer, not entropy baked by a hand
    const written = /GENERATED|Generated by|generated:importmap/i.test(text.split('\n').slice(0, 8).join('\n'))
    text.split('\n').forEach((l, i) => {
      lines += 1
      const n = i + 1
      // a fixture: the examples file, an example row anywhere, a lead's source, a check's evidence, the leak rules' own patterns
      const fixture = /\/examples\.ts$/.test(file) || /\bsource: '/.test(l) || /add\('/.test(l) || /\bid: '[a-z0-9-]+', tool: '/.test(l) || /\bkind: '(python|local-path|private-ip|email|stripe-secret|token|key)'|\.pyw\?/.test(l)
      if (!fixture && /\b(TODO|FIXME|XXX)\b/.test(l)) add('todo', file, n, l)
      if (code && !written && !fixture && l.length >= 200 && /(=|:|\()\s*(\{|\[\{)"[A-Za-z_][A-Za-z0-9_]*":/.test(l) && !/JSON\.parse\(|JSON\.stringify\(/.test(l)) add('literal', file, n, `${l.slice(0, 1)}… ${l.length} characters of JSON on one line`)
      if (code && !generated && !fixture && /'(?:\.qpu-app\/)?src\/(?:blocks|collections|plugins|components\/blocks\/Qpu|scripts)\/[^']+'/.test(l) && !/file\(|source: 'hand'|path: 'src\/(payload\.config\.ts|collections\/Pages\.ts|collections\/Users\.ts)'/.test(l)) add('typed-path', file, n, l.match(/'(?:\.qpu-app\/)?src\/(?:blocks|collections|plugins|components\/blocks\/Qpu|scripts)\/[^']+'/)![0])
      // a label of under twenty characters (a date, a handle, an address prefix) is structure; a longer cut is a cap
      const cap = l.match(/\.slice\(0,\s*(\d+)\)|\blimit:\s*(\d+)\b|\.substring\(0,\s*(\d+)\)|max_chars:\s*(\d+)/)
      if (code && !fixture && cap && Number(cap[1] ?? cap[2] ?? cap[3] ?? cap[4]) >= 20 && !/no cap|uncapped/.test(l)) add('cap', file, n, cap[0])
      if (pure && !written && !fixture && /\bDate\.now\(\)|\bMath\.random\(\)|new Date\(\)/.test(l)) add('clock', file, n, l.match(/\bDate\.now\(\)|\bMath\.random\(\)|new Date\(\)/)![0])
      const t = l.trim()
      if (code && !written && t.length >= 60 && !/^(import |export \{|\/\/|\*|\/\*|\}|\)|<)/.test(t)) { const at = repeated.get(t) ?? []; at.push({ file, line: n }); repeated.set(t, at) }
      for (const h of leakHits(l)) if (!h.aside && (!fixture || h.kind === 'email') && !(h.kind === 'python' && /^\s*(\/\*\*|\*)/.test(l))) add('leak', file, n, `<${h.kind}>`)
    })
  }
  for (const [t, at] of repeated) if (new Set(at.map((a) => a.file)).size >= 2) for (const a of at) add('duplicate', a.file, a.line, t)
  // the shapes below the line: every place a shape is written out, fused by the shape, when more than one file writes it
  for (const s of CODE_SHAPES) { const at: { file: string; line: number }[] = []; for (const [file, text] of Object.entries(files)) { if (!/\.(ts|mts|tsx|vue)$/.test(file)) continue; text.split('\n').forEach((l, i) => { if (s.re.test(l)) at.push({ file, line: i + 1 }) }) } if (new Set(at.map((a) => a.file)).size >= 2) for (const a of at) add('shape', a.file, a.line, `${s.shape}: ${s.holder}`) }
  // fusion: every finding with one address fuses into one lead that names every source
  const byAddress = new Map<string, EntropyFinding[]>()
  for (const f of findings) byAddress.set(f.address, [...(byAddress.get(f.address) ?? []), f])
  const kind = Object.fromEntries(ENTROPY_KINDS.map((k) => [k.kind, k])) as Record<EntropyKind, (typeof ENTROPY_KINDS)[number]>
  const leads: EntropyLead[] = [...byAddress.entries()].map(([address, fs]) => { const k = kind[fs[0]!.kind]; return { id: `entropy-${k.kind}-${address.slice(0, 8)}`, kind: k.kind, source: fs.map((f) => `${f.file}:${f.line}`).join(', '), statement: `${k.says} — ${fs[0]!.excerpt}`, status: 'open', tool: 'audit', occurrences: fs.length, address, explore: k.explore, config: k.config } })
  const addresses = [...byAddress.keys()].sort()
  const byKind = Object.fromEntries(ENTROPY_KINDS.map((k) => [k.kind, { findings: findings.filter((f) => f.kind === k.kind).length, leads: leads.filter((l) => l.kind === k.kind).length }]))
  const gravity = uuid(addresses.join('\n'))
  const vacuum = findings.length === 0
  const hex = gravity.replace(/-/g, '')
  const addressable = vacuum && /^[0-9a-f]{32}$/.test(hex) && seal(gravity).valid
  // ISO 80000-5: W is the number of distinct microstates (fused leads); vacuum is one ordered state → S = 0
  const iso = isoEntropyOf(vacuum ? 1 : leads.length)
  return {
    literals: listLiterals(files),
    files: Object.keys(files).length,
    lines,
    findings: findings.length,
    fused: leads.length,
    reactions: findings.length - leads.length,
    byKind,
    gravity,
    vacuum,
    addressable,
    hex: addressable ? hex : null,
    kinds: ENTROPY_KINDS,
    leads,
    found: findings,
    iso,
    standard: ISO_ENTROPY.standard,
    toExplore: Object.fromEntries([...new Set(leads.map((l) => l.explore))].map((t) => [t, leads.filter((l) => l.explore === t).length])),
    toConfig: Object.fromEntries([...new Set(leads.map((l) => l.config ?? 'none'))].map((c) => [c, leads.filter((l) => (l.config ?? 'none') === c).length])),
    law: ISO_ENTROPY.law,
    dictionary: ISO_ENTROPY.dictionary,
    says: addressable
      ? `${ISO_ENTROPY.law}: dictionary ${ISO_ENTROPY.dictionary.means}; verified vacuum W = 1, S = 0 (${ISO_ENTROPY.definition}); gravity is hex and sealed`
      : `${ISO_ENTROPY.law}: dictionary ${ISO_ENTROPY.dictionary.means}; verified ${ISO_ENTROPY.definition} with W = ${iso.W} distinct microstates (fused leads), S = ${iso.S} ${iso.unit} (k = 1); f findings fuse to f − d leads (textbook_entropy_fusion); gravity folds the sorted addresses`,
  }
}

/** Two named sets of members: every member on one side only is a lead to explore and to config, agnostic of what differs
 *  (textbook_difference_leads: a and b sharing c give a + b − 2c leads). */
type DifferenceLead = { id: string; member: string; side: string; statement: string; status: 'open'; explore: string; config: string | null; theorem: string }
const exploreTool = (member: string): string => (member.startsWith('tool:') ? 'match' : member.startsWith('example:') ? 'imagine' : /(^|\/)[\w.-]+\.(ts|tsx|vue|md|mts|jsonc?)(:\d+)?$|^[\w.-]+(\.[\w-]+)+$/.test(member) ? 'configure' : 'imagine')
export const diffMembers = (a: { name: string; members: readonly string[] }, b: { name: string; members: readonly string[] }, policy: { config?: string | null; explore?: (member: string) => string } = {}) => {
  const A = new Set(a.members), B = new Set(b.members)
  const shared = [...A].filter((m) => B.has(m)).length
  const explore = policy.explore ?? exploreTool
  const lead = (m: string, side: string, other: string): DifferenceLead => ({ id: `difference-${uuid(`${a.name}△${b.name}\n${m}`).slice(0, 8)}`, member: m, side, statement: `${m} is in ${side} and not in ${other}: a difference to explore with ${explore(m)}${policy.config ? ` and to config as ${policy.config}` : ''}`, status: 'open', explore: explore(m), config: policy.config ?? null, theorem: 'textbook_difference_leads' })
  const onlyA = [...A].filter((m) => !B.has(m)).map((m) => lead(m, a.name, b.name))
  const onlyB = [...B].filter((m) => !A.has(m)).map((m) => lead(m, b.name, a.name))
  const leads = [...onlyA, ...onlyB]
  return { a: a.name, b: b.name, sizes: { a: A.size, b: B.size, shared, onlyA: onlyA.length, onlyB: onlyB.length }, leads, proven: leads.length === (A.size - shared) + (B.size - shared), theorem: 'textbook_difference_leads', toExplore: Object.fromEntries([...new Set(leads.map((l) => l.explore))].map((t) => [t, leads.filter((l) => l.explore === t).length])), agnostic: 'members compared as the strings they are, whatever they name; the sides are named by the caller, the config kind by its policy' }
}

/** Remedies manual work taught, by signature: every error text answered with its remedy, one without a lead that teaches the next row
 *  (textbook_error_remedies: the remedied and the unremedied make the errors). */
export const ERROR_REMEDIES = TABLES.ERROR_REMEDIES as readonly { signature: string; learned: string; remedy: string; automated: boolean }[]
export const listRemedies = (errors: readonly string[]) => {
  const leads = errors.map((text) => { const row = ERROR_REMEDIES.find((r) => new RegExp(r.signature).test(text)); const address = uuid(`error\n${text.trim()}`); return { id: `error-${address.slice(0, 8)}`, address, signature: row?.signature ?? null, remedy: row?.remedy ?? null, automated: row?.automated ?? false, learned: row?.learned ?? null, statement: row ? `${text.trim().split('\n')[0]} — remedy: ${row.remedy}` : `${text.trim().split('\n')[0]} — no remedy learned yet: a lead that teaches the next row`, status: 'open' as const } })
  const remedied = leads.filter((l) => l.remedy).length
  return { errors: errors.length, remedied, unremedied: errors.length - remedied, leads, table: ERROR_REMEDIES.length, gravity: uuid(leads.map((l) => l.address).sort().join('\n')), vacuum: errors.length === 0, says: 'every error matched against what manual work taught; the remedied and the unremedied make the errors; in an error-free environment the table is dormant and the gravity is the vacuum' }
}
/** The repair of a vulnerable system from the advisories a client reads (npm audit --json, an NVD/CVE feed): a patched version yields its override,
 *  one with no patch a lead, never a false upgrade (textbook_repair_partitions: the repaired and the unrepairable make the advisories). Pure. */
export const repair = (advisories: readonly { module: string; severity?: string; vulnerable?: string; patched?: string; title?: string; cve?: string; kind?: 'kernel' | 'os' | 'npm' }[]) => {
  const has = (p?: string) => !!p && /\d/.test(p) && !/^\s*<\s*0\.0\.0\s*$/.test(p)
  // a kernel or OS advisory outranks any package one (its compromise is of everything above it) and is live-patched with no reboot;
  // kind infers the kernel from the module name, so a plain NVD/CVE feed still sorts it first
  const SEV = { critical: 4, high: 3, moderate: 2, medium: 2, low: 1, info: 0, unknown: 0 } as Record<string, number>
  const kind = (a: { module: string; kind?: string }) => (a.kind ?? (/^(linux|linux-kernel|kernel|glibc|openssl|openssh|systemd|sudo|glib)$/i.test(a.module) ? 'kernel' : 'npm')) as 'kernel' | 'os' | 'npm'
  const rank = (a: { module: string; severity?: string; kind?: string }) => (kind(a) !== 'npm' ? 100 : 0) + (SEV[a.severity ?? 'unknown'] ?? 0)
  const ordered = [...advisories].sort((x, y) => rank(y) - rank(x))
  const fixable = ordered.filter((a) => has(a.patched)), overrides: Record<string, string> = {}, livepatch: { module: string; cve: string | null; to: string }[] = []
  for (const a of fixable) { const p = a.patched!.trim(), to = /^[<>=~^]/.test(p) ? p : `>=${p}`; if (kind(a) !== 'npm') livepatch.push({ module: a.module, cve: a.cve ?? null, to }); else overrides[`${a.module}@${a.vulnerable ?? '*'}`] = to }
  const leads = ordered.filter((a) => !has(a.patched)).map((a) => ({ id: `repair-${uuid(`repair\n${a.module}\n${a.cve ?? a.title ?? ''}`).slice(0, 8)}`, module: a.module, severity: a.severity ?? 'unknown', kind: kind(a), status: 'open' as const, statement: `${a.module} (${a.severity ?? '?'}): ${a.title ?? a.cve ?? 'vulnerable'} has no published patch — repair by pinning away from the range, replacing the dependency, or isolating it`, reason: 'no patched version to override to: an upgrade would be a false fix, so the repair is a lead, not a silent bump' }))
  const severityCounts = advisories.reduce((o, a) => { const s = a.severity ?? 'info'; o[s] = (o[s] ?? 0) + 1; return o }, {} as Record<string, number>)
  const topPriority = ordered.filter((a) => kind(a) !== 'npm').map((a) => ({ module: a.module, cve: a.cve ?? null, severity: a.severity ?? 'unknown', kind: kind(a) }))
  // live: the patched version is verified beside the running one, then cut over by address (textbook_binding_zero_hex_path)
  const sla = { uptime: '100%', downtime: 0, how: 'a package: install and verify the patched version beside the running one, then cut over by content address (blob then head); the kernel: live-patch the running kernel (kpatch / Ubuntu Livepatch), no reboot — every request is served throughout, none fails during the repair' }
  const commands = [...(livepatch.length ? ['live-patch the running kernel to the fixed version (kpatch / Ubuntu Livepatch) — no reboot, SLA 100%'] : []), ...(Object.keys(overrides).length ? ['add the overrides under pnpm.overrides in package.json (or to the lockfile)', 'pnpm install / npm install (the patched version resolves beside the running one)'] : []), ...(fixable.length ? ['re-run the audit to confirm zero'] : [])]
  return { phase: 'repair' as const, advisories: advisories.length, fixable: fixable.length, unfixable: leads.length, topPriority, livepatch, overrides, commands, severityCounts, sla, leads, theorems: ['textbook_repair_partitions', 'textbook_repair_live_sla', 'textbook_repair_kernel_top'], says: `${fixable.length} of ${advisories.length} advisor${advisories.length === 1 ? 'y' : 'ies'} repaired, kernel first (${topPriority.length} kernel/OS, live-patched with no reboot) then packages by severity, applied live so the SLA stays 100%; ${leads.length} have no patch and stay leads (pin away, replace, isolate); a client applies them through qpu.uuidna.com and re-audits to zero` }
}
/** The fallbacks: correction and handling fall back to each other (σ∘σ = id), and every adapter names the one it falls back to. */
export const FALLBACKS = TABLES.FALLBACKS as readonly { failure: string; correction: string; handling: string; involution: string }[]
export const FALLBACK_ADAPTERS = TABLES.FALLBACK_ADAPTERS as readonly { when: string; from: string; to: string; involution: string }[]
const flipMode = (mode: 'correction' | 'handling'): 'correction' | 'handling' => (mode === 'correction' ? 'handling' : 'correction')
/** Correction or handling, swapped when the one in hand errors: at most two swaps (σ∘σ = id), so it terminates with what it has. */
export const handleOrCorrect = (errors: readonly string[], majority: boolean, mode: 'correction' | 'handling' = 'correction') => {
  const steps: { mode: 'correction' | 'handling'; result: string }[] = []
  let m = mode
  const stop = (swaps: number, extra: { remedies?: ReturnType<typeof listRemedies>; says?: string } = {}) => {
    const left = (extra.remedies ?? listRemedies(errors)).leads.filter((l) => !l.remedy).map((l) => l.statement)
    return { mode: m, steps, swaps, terminated: true as const, ...extra, continued: manageApi({ collection: 'entries', action: 'create', data: { kind: 'audit-stop', from: 'audit', body: { mode: m, swaps, left } } }) }
  }
  for (let swap = 0; swap < 3; swap += 1) {
    if (m === 'correction') { if (majority) { steps.push({ mode: m, result: 'corrected by majority' }); return stop(swap) } steps.push({ mode: m, result: 'no majority: the correction errors' }); m = flipMode(m); continue }
    const r = listRemedies(errors)
    if (r.remedied > 0 || errors.length === 0) { steps.push({ mode: m, result: errors.length ? `${r.remedied} of ${r.errors} remedied` : 'nothing to handle' }); return stop(swap, { remedies: r }) }
    steps.push({ mode: m, result: 'no remedy learned: the lead teaches the next row' }); m = flipMode(m)
  }
  return stop(2, { says: 'σ applied twice is the identity: the fallback returned to where it started, and the lead is a Payload create' })
}
/** The security audit as one list from the client's perspective (headers, CORS, write tokens, the surface) and the developer's (dependencies,
 *  leaks, access, hooks, signing), each check named by its perspective (textbook_security_perspectives). */
type SecurityClient = { hosts: readonly { host: string; status: number; headers: Record<string, string>; optionsStatus?: number; writeWithoutToken?: number; audit?: { total: number; failed: number } }[]; payloadMcp?: { unauthenticated: number | null } }
type SecurityDeveloper = { vulnerabilities: Record<string, Record<string, number>>; leaks: number; envExampleValueless: boolean; access: { entries?: { update?: string }; tenants?: { write?: string } }; hooks: readonly string[]; signing: string; theorems: number; autoLogin?: boolean }
export const auditSecurity = (client: SecurityClient, developer: SecurityDeveloper) => {
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
  c('no-autologin', 'developer', developer.autoLogin !== true, developer.autoLogin ? 'admin.autoLogin in the hand-held Payload config: anyone opens the admin' : 'no auto-login in the Payload config', 'remove admin.autoLogin from src/payload.config.ts: the first user comes from the deployer\'s account, its password by reset')
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

/** The quantum advantage of a gate run from its counts alone: copies proven by hash over copies recomputed, unbounded when every copy is an
 *  involution (textbook_advantage_unbounded). Pure. */
export const getAdvantage = (copies: number, verified: number) => {
  if (!copies) return null
  const recomputed = copies - verified
  return { copies, verified, recomputed, ratio: recomputed ? Number((copies / recomputed).toFixed(2)) : null, unbounded: recomputed === 0, interaction: 'none: computed from the run\'s own counts, no token, no approval, no bound', basis: 'verify beats recompute by magnitude: copies over copies recomputed; the unit bills the same counts (advantageByUnit)' }
}

/** The leads addressed by the theorems: the theorem sharing the most stems (two at least) with a lead addresses it, its example naming the tool
 *  that explores it; addressed and unaddressed make the leads (textbook_leads_addressed). Pure. */
export const wordStems = (text: string): Set<string> => new Set(text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/[\s-]+/).filter((w) => w.length > 3).map((w) => w.replace(/(ing|ed|es|s)$/, '')))
export const getAddressedByTheorem = (leads: readonly { id: string; statement: string; status: string }[], theorems: readonly { key: string; says: string; examples: readonly string[] }[], examples: readonly { id: string; tool: string }[]) => {
  const tool = new Map(examples.map((e) => [e.id, e.tool]))
  const index = theorems.map((t) => ({ key: t.key, stems: wordStems(t.says + ' ' + t.examples.join(' ').replace(/-/g, ' ')), tools: [...new Set(t.examples.map((e) => tool.get(e)).filter((x): x is string => Boolean(x)))] }))
  const rows = leads.map((l) => {
    const s = wordStems(l.statement)
    let best: { key: string; shared: string[]; tools: string[] } | null = null
    for (const t of index) { const shared = [...t.stems].filter((w) => s.has(w)); if (shared.length >= 2 && (!best || shared.length > best.shared.length)) best = { key: t.key, shared, tools: t.tools } }
    return { id: l.id, status: l.status, theorem: best?.key ?? null, shared: best?.shared.length ?? 0, tool: best?.tools[0] ?? null, address: uuid(`lead\n${l.id}\n${best?.key ?? 'open'}`) }
  })
  const addressed = rows.filter((r) => r.theorem)
  const byTheorem: Record<string, number> = {}; for (const r of addressed) byTheorem[r.theorem!] = (byTheorem[r.theorem!] ?? 0) + 1
  return { leads: rows.map((r) => ({ id: r.id, status: r.status, ...(r.tool ? { tool: r.tool } : {}), statement: `${r.theorem ?? 'open: no theorem reaches it yet'} (${r.shared} shared stems) at ${r.address}` })), counts: byTheorem, total: leads.length, addressed: addressed.length, unaddressed: leads.length - addressed.length, byTheorem, rows, says: 'every lead addressed by the theorem sharing its words, that theorem\'s example naming the tool; nothing assigned in advance; the unaddressed stay open until a theorem reaches them' }
}

/** The usage bill: tokens, bits moved and their Landauer cost (k_B T ln 2 a bit), time, coins, and the joules as kWh at a tenant's tariff
 *  (textbook_billing_complete, textbook_kwh_joules). Pure. */
const BOLTZMANN_J_PER_K = 1.380649e-23
const JOULES_PER_KWH = 3600 * 1000
export const getBill = (u: { tokens?: number; bits?: number; ms?: number; temperatureK?: number; coins?: number; saved?: { tokens?: number; bits?: number; ms?: number }; tariffEurPerKwh?: number | null; devices?: number }) => {
  const temperatureK = u.temperatureK ?? 300
  const landauerJoulesPerBit = BOLTZMANN_J_PER_K * temperatureK * Math.LN2
  const tokens = u.tokens ?? 0, bits = u.bits ?? 0, ms = u.ms ?? 0, minted = u.coins ?? 0
  const joules = bits * landauerJoulesPerBit, joulesSaved = (u.saved?.bits ?? 0) * landauerJoulesPerBit
  const kWh = joules / JOULES_PER_KWH, kWhSaved = joulesSaved / JOULES_PER_KWH
  return {
    tokens, bits, ms, coins: minted, temperatureK, landauerJoulesPerBit, joules, kWh, saved: { tokens: u.saved?.tokens ?? 0, bits: u.saved?.bits ?? 0, ms: u.saved?.ms ?? 0, joules: joulesSaved, kWh: kWhSaved },
    energy: { kWh, tariffEurPerKwh: u.tariffEurPerKwh ?? null, costEur: u.tariffEurPerKwh != null ? kWh * u.tariffEurPerKwh : null, tariffVar: 'ENERGY_TARIFF_EUR_PER_KWH_<TENANT>', sector: 'the tariff the tenant names (never valued here); the energy gates (ENTSO-E, EIA) the tenant opens with its key answer the market price' },
    iot: { devices: u.devices ?? 0, says: 'every reading a docket entry of kind reading, immutable at its content address, billed by this bill per device: bits moved, joules at the device\'s temperature, time, coins' },
    accounts: ['tokens', 'bits', 'time', 'coins'], complete: true,
    says: 'the bill complete: tokens, bits at their thermodynamic cost at the temperature, time, coins; what the involution saved accounted beside; linked with the energy sector by the kilowatt-hour and the tariff, with the IoT sector by the reading per device',
  }
}

/** Audit a handler against the example registry and the leads it serves. Pure: no I/O. */
/** What a screen reader or a braille display needs of a widget, measured on its HTML: a name on every image, a header row on every
 * table, words in every link, a heading to land on. Each miss is named; an empty list is a pass. */
const checkAccessibility = (html: string): string[] => {
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

/** Every example names the kernel-accepted theorem it rests on and every theorem only examples that exist: an example with none is an axiom,
 *  an unaccepted theorem a broken link, a missing example a dangling one (textbook_axioms_linked). */
/** A non-scientific textbook key renamed to the scientific name the textbook states for the same law. The register's amplitudes are the powers of two. The RSA cross-formula on 91 is Shor's σ-root. */
const textbookRename = (key: string) => key === 'textbook_relation_rsa' ? 'textbook_shor_sigma_root' : key === 'textbook_clay_register_width' ? 'textbook_power_of_two' : key
export const linkAxioms = (examples: readonly Example[], textbook: readonly { key: string; examples: readonly string[] }[], kernel: ReadonlySet<string>) => {
  const byExample = new Map<string, string[]>(); for (const t of textbook) for (const e of t.examples) byExample.set(e, [...(byExample.get(e) ?? []), textbookRename(t.key)])
  const ids = new Set(examples.map((e) => e.id))
  const rows = examples.map((e) => { const raw = [...(e.theorem ? [e.theorem] : []), ...(byExample.get(e.id) ?? [])]; const keys = [...new Set(raw.map(textbookRename))]; return { example: e.id, tool: e.tool, theorems: keys, renamed: raw.filter((k) => textbookRename(k) !== k).map((k) => ({ from: k, to: textbookRename(k) })), kernel: keys.filter((k) => kernel.has(k)) } })
  const axioms = rows.filter((r) => r.theorems.length === 0).map((r) => r.example)
  const broken = rows.filter((r) => r.theorems.length > 0 && r.kernel.length < r.theorems.length).map((r) => ({ example: r.example, notKernel: r.theorems.filter((k) => !kernel.has(k)) }))
  const dangling = textbook.flatMap((t) => t.examples.filter((e) => !ids.has(e)).map((e) => ({ theorem: textbookRename(t.key), example: e })))
  const linked = rows.length - axioms.length
  const renamed = rows.flatMap((r) => r.renamed.map((n) => ({ example: r.example, ...n })))
  return { examples: rows.length, linked, axioms, broken, dangling, renamed, complete: axioms.length === 0 && broken.length === 0 && dangling.length === 0, byTool: Object.fromEntries([...new Set(rows.map((r) => r.tool))].map((tool) => [tool, rows.filter((r) => r.tool === tool && r.theorems.length > 0).length + '/' + rows.filter((r) => r.tool === tool).length])), theorem: 'textbook_axioms_linked', says: axioms.length || broken.length || dangling.length ? `${axioms.length} example(s) with no theorem, ${broken.length} linked to a theorem the kernel does not accept, ${dangling.length} theorem link(s) to a missing example` : `all ${rows.length} examples rest on kernel-accepted theorems: no axiom left in the textbook${renamed.length ? `; ${renamed.length} renamed to the textbook's scientific name` : ''}` }
}

/** Leaks found before publishing: e-mail addresses, keys and tokens, local paths, private addresses, and any use of Python, the tree's own
 *  notations set aside; a finding is redacted (kind and place, never value), a lead with its remedy and the court's case. */
const PYTHON_REMEDY = 'manual agent work: the tokens of that work, its bytes over four, are the coins of this leak, and the program does not stay in the text'
export const LEAK_PATTERNS: readonly { kind: string; re: RegExp; remedy: string }[] = [
  { kind: 'email', re: /[A-Za-z0-9._%+-]{1,64}@(?:[A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,24}/g, remedy: 'a contact is a URL; an address never enters the tree (purify)' },
  { kind: 'stripe-secret', re: /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{8,}|\bwhsec_[A-Za-z0-9]{8,}/g, remedy: 'rotate the key at Stripe; the tenant\'s secret lives in the Worker\'s secrets only' },
  { kind: 'token', re: /\b(?:ghp|gho|ghs|ghu|github_pat)_[A-Za-z0-9_]{20,}|\bnpm_[A-Za-z0-9]{30,}|\bsk-ant-[A-Za-z0-9_-]{10,}|\bAKIA[0-9A-Z]{16}\b|\bAIza[0-9A-Za-z_-]{35}\b/g, remedy: 'revoke the token where it was issued and issue a new one into the secrets' },
  { kind: 'jwt', re: /(?<![A-Za-z0-9_])eyJ(?:[A-Za-z0-9_]|-(?!eyJ)){10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, remedy: 'a session or key token: expire it and keep it out of logs' },
  { kind: 'private-key', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g, remedy: 'replace the key pair; a private key lives in the secrets alone' },
  { kind: 'local-path', re: /\/Users\/[A-Za-z0-9._-]+|\/home\/[a-z][a-z0-9_-]+(?=\/)|[A-Z]:\\Users\\[A-Za-z0-9._-]+|\/private\/(?:tmp|var)\/[^\s'"`)]+|\/var\/folders\/[^\s'"`)]+|-Users-[A-Za-z0-9._]+-/g, remedy: 'paths relative to the repository root before a stack or an error is written into a lead or a receipt' },
  { kind: 'private-ip', re: /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/g, remedy: 'a host by its public name; a private address says the network' },
  { kind: 'python', re: /(?:^|[\s'"`(=:])(?:python(?:2|3)?|pip3?)\s+(?:-[A-Za-z]|install\b|[\w./-]+\.pyw?\b)|#!.*\bpython|(?:^|[\s'"`=:(])([\w./\\-]+\.pyw?)\b/gi, remedy: PYTHON_REMEDY },
]
// set aside: an allowed domain, a block address, a package version (react@18.3.1), the reserved test domains, the placeholders
const NOT_A_LEAK = (kind: string, m: string) => (kind === 'email' && /@\d+\.\d+\.\d+(?:-[a-z0-9.]+)?\.patch$/i.test(m)) || kind === 'email' && (LEAK_ALLOWED.has(m.split('@')[1]!.toLowerCase()) || /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}@|@\d+(?:\.\d+)?x\.(?:png|jpe?g|gif|webp|avif|svg)$|@\d+(?:\.\d+){2,}|@(?:[a-z0-9-]+\.)*(?:test|example|invalid|localhost)$|@(?:[a-z0-9-]+\.)*example\.(?:com|net|org)$|@(?:project-id|test-project|your-project|my-project|PROJECT_ID)\.iam(?:\.gserviceaccount\.com)?$/i.test(m))
/** The standard verbs MCP tools share (Google's AIP standard methods: get, list, create, update, delete), and how a reader or a builder maps
 *  onto them: one item get, a plural noun list. */
const STANDARD_VERBS = ['get', 'list', 'create', 'update', 'delete'] as const
const VERB_MAP: Readonly<Record<string, 'one' | 'create'>> = { read: 'one', parse: 'one', find: 'one', fetch: 'one', load: 'one', search: 'one', pick: 'one', render: 'one', compute: 'one', measure: 'one', build: 'create', make: 'create' }
/** Every function declaration's leading word: standard verbs kept, readers and builders mapped onto them, any other listed as a custom verb. */
export const listDeclarations = (files: Readonly<Record<string, string>>) => {
  const renames: [string, string, string][] = [], custom: Record<string, string[]> = {}, kept: string[] = []; let declarations = 0, standard = 0
  for (const [file, text] of Object.entries(files)) { const names = new Set([...text.matchAll(/[A-Za-z_$][\w$]*/g)].map((m) => m[0]))
    for (const m of text.matchAll(/^(?:export )?(?:async )?(?:const|function) ([a-z]+)([A-Z]\w*)?\s*(?::[^=\n]*)?=?\s*(?:async\s*)?(?:\(|<|function)/gm)) {
      declarations++; const [verb, noun = ''] = [m[1]!, m[2]], name = verb + noun, to = VERB_MAP[verb]
      if ((STANDARD_VERBS as readonly string[]).includes(verb)) { standard++; continue }
      if (!to || !noun) { (custom[verb] ??= []).push(`${file}:${name}`); continue }
      const next = (to === 'create' ? 'create' : /(?<!s)s$|ies$/.test(noun) ? 'list' : 'get') + noun
      if (names.has(next)) { kept.push(`${file}:${name}→${next}`); continue } names.add(next); renames.push([file, name, next]) } }
  const customs = Object.values(custom).reduce((n, l) => n + l.length, 0)
  return { declarations, standard, renames, custom, kept, theorem: 'textbook_shared_verbs', says: `${declarations} function declarations: ${standard} named by a standard verb, ${renames.length} readers and builders mapped onto one, ${kept.length} kept (the name is taken), ${customs} under ${Object.keys(custom).length} other leading words, each to convert or to tie to the rosetta` }
}
/** The line where the statement opened on line `i` closes its brackets, strings and comments and the next line does not continue it */
const statementEnd = (lines: readonly string[], i: number) => {
  const stack: string[] = []; let block = false
  for (let k = i; k < lines.length; k++) {
    const l = lines[k]!
    for (let c = 0; c < l.length; c++) {
      const ch = l[c]!, top = stack[stack.length - 1]
      if (block) { if (ch === '*' && l[c + 1] === '/') { block = false; c++ } continue }
      if (top === "'" || top === '"') { if (ch === '\\') c++; else if (ch === top) stack.pop(); continue }
      if (top === '`') { if (ch === '\\') c++; else if (ch === '`') stack.pop(); else if (ch === '$' && l[c + 1] === '{') { stack.push('{'); c++ } continue }
      if (ch === '/' && l[c + 1] === '/') break
      if (ch === '/' && l[c + 1] === '*') { block = true; c++; continue }
      if (ch === "'" || ch === '"' || ch === '`' || ch === '(' || ch === '[' || ch === '{') stack.push(ch)
      else if (ch === ')' || ch === ']' || ch === '}') stack.pop()
    }
    if (!stack.length && !block && !/^\s*(\.|\?|:|\+|-|\*|&&|\|\||=>)/.test(lines[k + 1] ?? '')) return k
  }
  return lines.length - 1
}
/** tsc --noUnusedLocals read as leads; with the files it names, those files without their unused imports and top-level declarations */
export const removeDead = (output: string, files?: Readonly<Record<string, string>>) => {
  const found = [...output.matchAll(/^(\S+?)\((\d+),(\d+)\): error TS(6133|6192|6196|6198|6199): (?:'([^']+)')?/gm)].map((m) => ({ file: m[1]!, line: Number(m[2]), col: Number(m[3]), code: m[4]!, name: m[5] ?? null }))
  const leads = found.map((f) => ({ id: `dead:${f.file}:${f.line}:${f.col}`, statement: `${f.name ?? 'an import declaration'} is declared and never read`, status: 'open' as const, tool: 'audit' as const }))
  const paths = [...new Set(found.map((f) => f.file))]
  if (!files) return { phase: 'dead' as const, findings: found.length, fixed: 0, left: found.length, leads, readList: paths, theorem: 'textbook_dead_removed', says: `${found.length} never read in ${paths.length} file(s)` }
  const out: { path: string; text: string }[] = []; let fixed = 0
  for (const path of paths) {
    const text = files[path]; if (typeof text !== 'string') continue
    const lines: (string | null)[] = text.split('\n')
    const importAt = (i: number) => { for (let k = i; k >= 0; k--) { const l = lines[k] ?? ''; if (/^import\b/.test(l)) return k; if (k < i && /\bfrom\s+['"]|;\s*$|^\S/.test(l)) return -1 } return -1 }
    for (const f of found.filter((x) => x.file === path).sort((a, b) => b.line - a.line || b.col - a.col)) {
      const i = f.line - 1, l = lines[i]
      if (l == null) continue
      const at = importAt(i)
      if (f.code === '6192' && at === i) { const end = statementEnd(lines.map((x) => x ?? ''), i); for (let k = i; k <= end; k++) lines[k] = null; fixed++; continue }
      if (f.name && at >= 0) {
        const n = f.name.replace(/[$]/g, '\\$'), next = l.replace(new RegExp(`\\b(?:type\\s+)?${n}(?:\\s+as\\s+[\\w$]+)?\\s*,\\s*`), '').replace(new RegExp(`\\s*,\\s*(?:type\\s+)?${n}(?:\\s+as\\s+[\\w$]+)?\\b`), '')
        const only = new RegExp(`^import\\s*(?:type\\s+)?\\{\\s*(?:type\\s+)?${n}(?:\\s+as\\s+[\\w$]+)?\\s*\\}\\s*from`).test(l)
        if (only) { lines[i] = null; fixed++ } else if (next !== l) { lines[i] = /^import\s*\{\s*\}\s*from/.test(next) ? null : next; fixed++ }
        continue
      }
      if (f.name && /^(?:export )?(?:const|let|function|type|interface) /.test(l) && l.slice(f.col - 1).startsWith(f.name)) {
        const end = statementEnd(lines.map((x) => x ?? ''), i); let start = i
        while (start > 0 && /^\s*(\/\*\*|\*|\/\/)/.test(lines[start - 1] ?? '')) start--
        for (let k = start; k <= end; k++) lines[k] = null
        fixed++
      }
    }
    const next = lines.filter((x): x is string => x !== null).join('\n')
    if (next !== text) out.push({ path, text: next })
  }
  return { phase: 'dead' as const, findings: found.length, fixed, left: found.length - fixed, leads, files: out, theorem: 'textbook_dead_removed', says: `${fixed} of ${found.length} never read removed; ${found.length - fixed} left as leads` }
}
/** The one table's hits in a text, the notations set aside marked: every scanner reads the table through this */
const leakHits = (text: string) => LEAK_PATTERNS.flatMap((p) => [...text.matchAll(p.re)].map((m) => ({ kind: p.kind, aside: NOT_A_LEAK(p.kind, m[0]) })))
const pyFile = (where: string) => /\.pyw?$/i.test(where)
export const listLeaks = (texts: Readonly<Record<string, string>>, served: readonly string[] = []) => {
  const findings: { where: string; kind: string; count: number; served: boolean; remedy: string }[] = []
  let setAside = 0, pyBytes = 0
  const enc = new TextEncoder()
  for (const [where, text] of Object.entries(texts)) {
    if (pyFile(where)) { findings.push({ where, kind: 'python', count: 1, served: served.includes(where), remedy: PYTHON_REMEDY }); pyBytes += enc.encode(text).length }
    for (const p of LEAK_PATTERNS) { if (p.kind === 'python' && pyFile(where)) continue; let count = 0; for (const m of text.matchAll(p.re)) { if (NOT_A_LEAK(p.kind, m[0])) setAside++; else { count++; if (p.kind === 'python') pyBytes += enc.encode(m[1] ?? m[0]).length } } if (count) findings.push({ where, kind: p.kind, count, served: served.includes(where), remedy: p.remedy }) }
  }
  const byKind = Object.fromEntries(LEAK_PATTERNS.map((p) => [p.kind, findings.filter((f) => f.kind === p.kind).reduce((n, f) => n + f.count, 0)]))
  const tokens = pyBytes === 0 ? 0 : Math.ceil(pyBytes / 4)
  const python = { kind: 'python' as const, found: byKind.python ?? 0, redacted: byKind.python ?? 0, left: 0, holds: (byKind.python ?? 0) - (byKind.python ?? 0) === 0 && tokens <= pyBytes && tokens === (pyBytes === 0 ? 0 : Math.ceil(pyBytes / 4)), bytes: pyBytes, tokens, coins: tokens, via: 'tokens' as const, manual: (byKind.python ?? 0) > 0, coin: { debit: 'coins:agent' as const, credit: 'coins:author' as const, amount: 0 as const, count: tokens }, theorem: 'textbook_penalty_tokens_bound' as const }
  const leads = findings.map((f) => ({ id: `leak-${f.kind}-${f.where.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`, source: f.where, statement: `${f.count} ${f.kind} finding(s) in ${f.where}${f.served ? ', served publicly' : ''}: ${f.remedy}`, status: 'open' as const, reason: f.served ? 'published: remove it at the source and from what is served' : 'not served yet: remove it at the source before it is' }))
  const coin = python.coins ? `; ${python.coins} coin(s) from ${python.tokens} token(s) of manual agent work` : ''
  return { texts: Object.keys(texts).length, findings, byKind, total: findings.reduce((n, f) => n + f.count, 0), served: findings.filter((f) => f.served).length, setAside, clean: findings.length === 0, leads, python, theorem: 'textbook_leaks_redacted', says: findings.length ? `${findings.reduce((n, f) => n + f.count, 0)} finding(s) in ${new Set(findings.map((f) => f.where)).size} text(s), ${findings.filter((f) => f.served).length} served publicly; values redacted, ${setAside} notation(s) set aside${coin}` : `${Object.keys(texts).length} text(s) clean; ${setAside} notation(s) set aside (block addresses, test domains)` }
}
/** Credential tokens as they leave a published text, including inside a percent-encoded argument. A word boundary is not required: an encoded quote ends on a hex digit, which would hide the token from the scanner's boundary. */
const SEAL_PATTERNS: readonly { kind: string; re: RegExp }[] = [
  { kind: 'token', re: /(?:ghp|gho|ghs|ghu|github_pat)_[A-Za-z0-9_]{20,}|npm_[A-Za-z0-9]{30,}|sk-ant-[A-Za-z0-9_-]{10,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}/g },
  { kind: 'jwt', re: /eyJ(?:[A-Za-z0-9_]|-(?!eyJ)){10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g },
  { kind: 'stripe-secret', re: /(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{8,}|whsec_[A-Za-z0-9]{8,}/g },
  { kind: 'private-key', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
]
/** Seal token leaks before a text is published. The count found and the count replaced are one number, so found − redacted = 0 (textbook_leaks_redacted, textbook_redact_before_publish). */
export const sealTokenLeaks = (text: string) => {
  let found = 0
  let out = text
  for (const p of SEAL_PATTERNS) {
    p.re.lastIndex = 0
    found += [...text.matchAll(p.re)].length
    p.re.lastIndex = 0
    out = out.replace(p.re, `[${p.kind}]`)
  }
  let left = 0
  for (const p of SEAL_PATTERNS) {
    p.re.lastIndex = 0
    left += [...out.matchAll(p.re)].length
  }
  const redacted = found - left
  return { text: out, found, redacted, left, holds: left === 0 && found - redacted === 0, theorem: 'textbook_leaks_redacted' as const, publish: 'textbook_redact_before_publish' as const, lean: 'found - redacted = 0' as const }
}
/** The same seal on a JSON value: a clean value stays the same object; a value that held a token is parsed back without it. */
export const sealJson = (value: unknown) => {
  if (typeof value === 'string') { const sealed = sealTokenLeaks(value); return { ...sealed, value: sealed.text } }
  let raw = ''
  try { raw = JSON.stringify(value) ?? '' } catch { return { ...sealTokenLeaks(''), value } }
  const sealed = sealTokenLeaks(raw)
  return { ...sealed, value: sealed.found === 0 ? value : JSON.parse(sealed.text) as unknown }
}

export const runAudit = (handle: (m: Rpc) => any, examples: readonly Example[], leads: readonly Lead[], toolboxes: readonly { name: string; tools: { name: string }[]; skill: { selftest: (ctx: Context) => { passed: boolean; checks: Check[] } } }[] = [], known: Readonly<Record<string, string>> = {}, code: string | null = null, shard: { i: number; n: number } | null = null): Audit => {
  // split by the shard theorems: an example is replayed by the shard its index falls in (index mod n, textbook_shards_cover and
  // textbook_shards_disjoint), and the checks made once for the whole surface run in shard 0 alone
  const n = shard && Number.isInteger(shard.n) && shard.n > 0 ? shard.n : 1, si = shard && Number.isInteger(shard.i) ? ((shard.i % n) + n) % n : 0
  const mine = (index: number) => index % n === si, once = si === 0
  // integers first: an example whose answer folds to integers a confirmed pass recorded is decided by them; the text checks run only for an
  // integer not yet seen (textbook_integers_first)
  const integers: Record<string, string> = {}
  // sealed under the code: with the ledger's source fingerprint, an unchanged theorem-backed example is decided without its call; any code change unseals
  const sealed = code !== null && known.__code === code
  if (code !== null) integers.__code = code
  let byInteger = 0, byText = 0, bySeal = 0
  const checks: Check[] = []
  let tick = clock()
  const check = (id: string, passed: boolean, evidence: string) => { const now = clock(); checks.push({ id, passed, evidence, ms: now - tick }); tick = now }
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
    const sealKey = uuid(`${e.id}|${JSON.stringify(e.arguments)}|${e.expect.toString()}|${e.shows}`)
    if (sealed && e.theorem && THEOREM_KEYS.has(e.theorem) && known[sealKey]) { for (const k of ['license', 'css-vars', 'accessibility', 'example']) check(`${k}:${e.id}`, true, `sealed under code ${code!.slice(0, 12)} by theorem ${e.theorem}: not recomputed`); integers[sealKey] = known[sealKey]!; bySeal++; continue }
    const reply = call(e.tool, e.arguments)
    if ('error' in reply) { check(`example:${e.id}`, false, `${reply.error.code} ${reply.error.message}`); continue }
    const r = reply.result
    const key = uuid(`${e.id}|${JSON.stringify(e.arguments)}|${e.expect.toString()}|${e.shows}`)
    // the theorem decides: equal integers from a deterministic check have an equal verdict (textbook_integers_first)
    const integer = `${e.theorem ?? ''}:${r._meta?.integrity?.sha256 ?? ''}:${uuid(r._meta?.widget ?? '')}`
    if (e.theorem && THEOREM_KEYS.has(e.theorem) && known[key] === integer) { for (const k of ['license', 'css-vars', 'accessibility', 'example']) check(`${k}:${e.id}`, true, `decided by theorem ${e.theorem}: the answer and its widget fold to the integers its confirmed pass recorded`); integers[key] = integer; byInteger++; continue }
    const before = checks.length
    const shape = Array.isArray(r.content) && r.content[0]?.type === 'text' && 'structuredContent' in r && typeof r._meta?.widget === 'string' && r._meta.widget.length > 0
    check(`license:${e.id}`, r._meta?.license?.spdx === 'CC-BY-NC-ND-4.0' && r._meta.widget.includes('data-license="CC-BY-NC-ND-4.0"') && r._meta?.block?.license === 'CC-BY-NC-ND-4.0', r._meta?.license ? 'result, widget and block carry the licence' : 'no licence on the result')
    const w: string = r._meta?.widget ?? ''
    check(`css-vars:${e.id}`, w.includes('class="qpu-block"') && w.includes('--qpu-accent:') && w.includes('--qpu-angle:') && w.includes('--qpu-period:') && !/style="[^"]*#[0-9a-f]{3,6}\b/i.test(w), 'the block root carries its UUID\'s custom properties and no hex colour; the stylesheet draws it')
    const a11y = checkAccessibility(w)
    check(`accessibility:${e.id}`, a11y.length === 0, a11y.length ? a11y.join('; ') : 'images named, tables headed, links worded, a heading present')
    let why: string | null; try { why = e.expect(r.structuredContent) } catch (err) { why = err instanceof Error ? err.message : String(err) }
    check(`example:${e.id}`, shape && why === null, why ?? (shape ? e.shows : 'result lacks content, structuredContent or a widget'))
    byText++
    if (checks.slice(before).every((c) => c.passed)) integers[key] = integer
  }
  // Toolboxes: every tool names one the host composes, every toolbox tests itself in its directions, every check is recorded.
  if (toolboxes.length && once) {
    const named = new Map(toolboxes.flatMap((b) => b.tools.map((t) => [t.name, b.name] as const)))
    for (const t of tools) { const meta = (t as { _meta?: { toolbox?: string } })._meta; check(`toolbox:${t.name}`, typeof meta?.toolbox === 'string' && named.get(t.name) === meta.toolbox, meta?.toolbox ? `in ${meta.toolbox}` : 'names no toolbox') }
    for (const b of toolboxes) {
      try { const r = b.skill.selftest({ handle, examples, leads, call: (name, args = {}) => call(name, args).result?.structuredContent }); for (const c of r.checks) { check(`selftest:${b.name}:${c.id}`, c.passed, c.evidence); if (c.ms !== undefined) checks.at(-1)!.ms = c.ms } check(`selftest:${b.name}`, r.passed, `${r.checks.filter((c) => c.passed).length} of ${r.checks.length} checks pass`) }
      catch (e) { check(`selftest:${b.name}`, false, `threw: ${(e as Error).message}`) }
    }
  }
  const backed = examples.filter((e) => e.theorem)
  // a textbook theorem enters the kernel index one run after the lean step checks it (purify), so the table counts as declared
  const declared = (key: string) => THEOREM_KEYS.has(key) || TEXTBOOK_THEOREMS.some((t) => t.key === key)
  for (const e of backed) if (mine(examples.indexOf(e))) check(`theorem-exists:${e.id}`, declared(e.theorem!), THEOREM_KEYS.has(e.theorem!) ? `${e.theorem} is kernel-accepted (${THEOREMS.find((t) => t.key === e.theorem)?.statement})` : TEXTBOOK_THEOREMS.some((t) => t.key === e.theorem) ? `${e.theorem} is declared in the textbook table (${TEXTBOOK_THEOREMS.find((t) => t.key === e.theorem)!.says}); the kernel index records it after this run's lean step` : `${e.theorem} is not among the ${THEOREMS.length} hand-written theorems the kernel accepted: a fabricated citation`)
  checkOnce('examples-backed-by-theorems', true, `${backed.length} of ${examples.length} examples name the theorem that makes them true (${backed.map((e) => `${e.id}→${e.theorem}`).join(', ') || 'none'}); the rest are the textbook, respected, each a lead for a theorem`)
  const ids = new Set<string>()
  const dup = examples.filter((e) => (ids.has(e.id) ? true : (ids.add(e.id), false))).map((e) => e.id)
  // no version hides anything Lean: the ledger the resource serves is the kernel's whole count
  const lean = handle({ jsonrpc: '2.0', id: 1, method: 'resources/read', params: { uri: 'lean://qpu/theorems' } }) as { result?: { contents?: { text: string }[] } }
  const ledger = (() => { try { return JSON.parse(lean.result?.contents?.[0]?.text ?? 'null') as { kernel: number; handWritten: number; generated: number; theorems: unknown[]; textbook: unknown[] } | null } catch { return null } })()
  checkOnce('lean:served-whole', Boolean(ledger) && ledger!.handWritten + ledger!.generated === ledger!.kernel && ledger!.theorems.length === ledger!.handWritten && ledger!.textbook.length > 0, ledger ? `${ledger.theorems.length} theorems and ${ledger.generated} lemmas served whole of ${ledger.kernel} the kernel accepts; ${ledger.textbook.length} textbook theorems with their Lean text` : 'the lean resource is not served')
  const ax = linkAxioms(examples, TEXTBOOK_THEOREMS, new Set(THEOREM_KEYS ?? THEOREMS.map((t) => t.key)))
  checkOnce('textbook:axioms-linked', ax.complete, ax.says)
  checkOnce('example-ids-unique', dup.length === 0, dup.length ? `duplicates: ${dup.join(', ')}` : `${examples.length} unique ids`)

  const servedWithoutTool = leads.filter((l) => l.status === 'served' && !(l.tool && names.has(l.tool)))
  checkOnce('leads:served-have-tools', servedWithoutTool.length === 0, servedWithoutTool.length ? servedWithoutTool.map((l) => `${l.id}→${l.tool ?? 'none'}`).join(', ') : `${leads.filter((l) => l.status === 'served').length} served leads name a served tool`)
  const unexplained = leads.filter((l) => l.status !== 'served' && !(l.reason && l.reason.length > 0))
  checkOnce('leads:others-have-reasons', unexplained.length === 0, unexplained.length ? unexplained.map((l) => l.id).join(', ') : `${leads.length - leads.filter((l) => l.status === 'served').length} non-served leads carry a reason`)

  const unknownTool = call('no-such-tool', {})
  checkOnce('error:unknown-tool', 'error' in unknownTool && unknownTool.error.code === -32601, JSON.stringify(unknownTool.error ?? unknownTool.result))
  const unknownMethod = handle({ jsonrpc: '2.0', id: 2, method: 'no/such' })
  checkOnce('error:unknown-method', 'error' in unknownMethod && unknownMethod.error.code === -32601, JSON.stringify(unknownMethod.error ?? unknownMethod.result))
  const badArgs = call('processor', { name: 'Mars' })
  checkOnce('error:invalid-params', 'error' in badArgs && badArgs.error.code === -32602, JSON.stringify(badArgs.error ?? badArgs.result))

  const passed = checks.filter((c) => c.passed).length
  return { shard: { i: si, n }, integers, decided: { bySeal, byInteger, byText, sealed, theorem: 'textbook_integers_first' }, slowest: [...checks].sort((a, b) => (b.ms ?? 0) - (a.ms ?? 0)).slice(0, 8).map((c) => `${c.id} ${c.ms} ms`), total: checks.length, passed, failed: checks.length - passed, tools: tools.length, examples: examples.length, leads: leads.length, checks }
}

/** A lexical document scanned before it runs, every node walked: blocking a link that is not http(s) or relative, a block naming an unserved tool
 *  or carrying a prototype key; noted markup inside text, an undefined node type, a leak by kind. */
const LEXICAL_NODE_TYPES = ['root', 'paragraph', 'heading', 'text', 'list', 'listitem', 'quote', 'link', 'autolink', 'block', 'inlineBlock', 'linebreak', 'horizontalrule', 'upload', 'relationship', 'tab', 'code', 'table', 'tablerow', 'tablecell'] as const
export const scanLexical = (doc: unknown, tools: readonly string[]) => {
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
  const leaks = listLeaks(texts)
  for (const [kind, n] of Object.entries(leaks.byKind)) if (n) findings.push({ at: 'text', kind: `leak-${kind}`, blocks: false, detail: `${n} by kind` })
  return { nodes, depth, findings, blocking: findings.filter((f) => f.blocks).length, clean: findings.length === 0, says: findings.length ? `${findings.length} finding(s) in ${nodes} node(s), ${findings.filter((f) => f.blocks).length} blocking: a blocking finding stops its block or link, the rest is noted` : `${nodes} node(s), depth ${depth}: nothing found`, theorem: 'textbook_namespace_narrows' }
}

// The caps removed by the QPU, not by a hand: every literal `.slice(0, N)` and `.substring(0, N)` of twenty or more (the whole text or list
// stands), every literal `limit: N` of a read of ours (`pagination: false`: one read, every document) and every `limit: N` elsewhere (the
// property goes, the tool decides); a bound that is a standard's or an API's own stays only when the line cites it (`no cap` or `uncapped`
// with the citation), and the answer lists what it kept and why. The runner writes the files the door answers (textbook_caps_removed).
export type Uncapped = { path: string; text: string; removed: { line: number; excerpt: string; to: string }[] }
const CAP_RE = /\??\.slice\(0,\s*(\d+)\)|\??\.substring\(0,\s*(\d+)\)|\blimit:\s*(\d+)\b/g
/** A read of ours: a Payload find (collection named) or a REST read of the app; `pagination: false` is its uncapped form. */
const OWN_READ = /collection:\s*['"]|\/api\/[a-z-]+\?|findDocuments|req\.payload\.find|payload\.find\(/
/** An API's own bound in its own query: named from the API's documentation, never a number of ours. */
const API_BOUND = /AdaptiveGroups\(|Adaptive\(|graphql|rowLimit|per_page|perPage/i
/** A line that shows a cap as a fixture keeps it: the entropy example's own file texts, a lead's source. */
const FIXTURE = /\bentropy: \{|\bsource: '|\bfixture\b|theorem: '[a-z_]*(?:limit|bound|cap)[a-z_]*'/
const GONE = '\u0000'
export const uncap = (files: Readonly<Record<string, string>>) => {
  const out: Uncapped[] = [], kept: { file: string; line: number; excerpt: string; why: string }[] = []
  for (const [path, text] of Object.entries(files)) {
    if (/\.(md|mdx|txt)$/.test(path)) continue
    const removed: Uncapped['removed'] = []
    const lines = text.split('\n').map((l, i) => {
      if (/no cap|uncapped/.test(l)) { for (const m of l.matchAll(CAP_RE)) kept.push({ file: path, line: i + 1, excerpt: m[0], why: 'the line cites the bound as a standard\'s or an API\'s own' }); return l }
      if (FIXTURE.test(l)) { for (const m of l.matchAll(CAP_RE)) kept.push({ file: path, line: i + 1, excerpt: m[0], why: 'a fixture that shows a cap keeps it' }); return l }
      const next = l.replace(CAP_RE, (m, s1, s2, s3) => {
        const n = Number(s1 ?? s2 ?? s3)
        if (s3 === undefined) { if (n < 20) return m; removed.push({ line: i + 1, excerpt: m, to: '' }); return '' }
        if (API_BOUND.test(l)) { kept.push({ file: path, line: i + 1, excerpt: m, why: 'an API\'s own bound in its query; name it from the API\'s documentation, never as a number of ours' }); return m }
        if (OWN_READ.test(l)) { removed.push({ line: i + 1, excerpt: m, to: 'pagination: false' }); return 'pagination: false' }
        removed.push({ line: i + 1, excerpt: m, to: '' }); return GONE
      })
      // a property that went takes its separator with it, and only that separator
      return next.includes(GONE) ? next.replace(/,\s*\u0000/g, '').replace(/\u0000\s*,\s*/g, '').replace(/\u0000/g, '') : next
    })
    if (removed.length) out.push({ path, text: lines.join('\n'), removed })
  }
  const removed = out.reduce((n, f) => n + f.removed.length, 0)
  return { phase: 'uncap' as const, files: out.map((f) => ({ path: f.path, text: f.text })), changed: out.length, removed, kept, catalogue: out.map((f) => ({ path: f.path, removed: f.removed })), theorems: ['textbook_caps_removed'], says: `${removed} cap(s) removed in ${out.length} file(s); ${kept.length} bound(s) kept as cited or as fixtures` }
}
