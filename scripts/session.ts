// The session step of next: every session of the project decides what is next and how. Every transcript of the project (and of each session's
// subagents) is read here; the user's own messages, the answers to AskUserQuestion, the rule breaks and the tool errors are handed to the leads
// tool's session door, which folds, ranks, routes and packs them into waves. Addresses and keys are stripped first (the audit's LEAK_PATTERNS), and
// nothing from a transcript enters the repository but counts and item titles. The decision is written into Open work (folded or created as drafts,
// every write read back); a432 places every lead in its cell, and the Clay rosetta reads the cells' values on both sides, the hosted unit's by real
// MCP client calls sealed in the docket. The tests are tagged by Google's test sizes and timed. Offline, only the writes and the calls are skipped.
import './teleport.ts'
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { homedir } from 'node:os'
import { toolCallerOf, cellOf as cell } from '../src/quantum/processing/mcp.ts'
import { LEAK_PATTERNS, LITERAL_ROOTS } from '../src/quantum/processing/audit.ts'
import { UNIT_MCP } from '../src/quantum/processing/discovery.ts'
import { EXAMPLES } from '../src/quantum/processing/examples.ts'
import { THEOREM_KEYS } from '../src/quantum/processing/theorems-index.ts'
import { LICENSE } from '../src/quantum/processing/unit/license.ts'
import { forecastTimes } from '../src/quantum/processing/machine.ts'
import { mcpClient, getJson, openSession as mcpSessionOf } from './mcp.ts'

const ROOT = process.cwd()
const OPEN_WORK = '6ae070c8219dd782501ada3a', PAGE = 100, UNIT = process.env.UUIDNA_MCP ?? UNIT_MCP
const SEAL_MS = 7 * 86_400_000, QUANTUM_MS = Number(process.env.QPU_QUANTUM_MS ?? 60_000)
const offline = process.env.QPU_OFFLINE === '1' || process.argv.includes('--offline')
const leads = toolCallerOf('leads'), clay = toolCallerOf('clay')
const started = Date.now(), date = new Date().toISOString()
// Google's test sizes, one level each; the time each may take is Bazel's default timeout for the size until the standards doors name an SLO
const SIZES = { small: 60_000, medium: 300_000, large: 900_000, enormous: 3_600_000 } as const
type Size = keyof typeof SIZES
const tests: { size: Size; name: string; passed: boolean }[] = [], phaseMs: Record<Size, number> = { small: 0, medium: 0, large: 0, enormous: 0 }
const test = async (size: Size, name: string, f: () => boolean | Promise<boolean>) => { let passed = false; try { passed = await f() } catch { passed = false } tests.push({ size, name: `[${size}] ${name}`, passed }); return passed }
// each size timed as the phase that runs its calls: the reads and writes of Payload, the unit's and the hosts' calls, the grid's quantum
const timed = async <T>(size: Size, f: () => Promise<T>): Promise<T> => { const t0 = Date.now(); try { return await f() } finally { phaseMs[size] += Date.now() - t0 } }

// the transcripts: the project's folder of the main checkout (a worktree shares it), every session file and each session's subagents
const common = dirname(execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], { cwd: ROOT, encoding: 'utf8' }).trim())
const DIR = process.env.QPU_SESSIONS_DIR ?? join(homedir(), '.claude', 'projects', common.replace(/[^A-Za-z0-9-]/g, () => '-'))
const mains = existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith('.jsonl')).map((f) => join(DIR, f)) : []
const subs = mains.flatMap((f) => { const d = join(f.replace(/\.jsonl$/, ''), 'subagents'); return existsSync(d) ? readdirSync(d).filter((g) => g.endsWith('.jsonl')).map((g) => join(d, g)) : [] })
const HARNESS = /^(This session is being continued|\[Request interrupted|Base directory for this skill|<task-notification>|Another Claude session sent a message|<scheduled-task|<local-command|<command-(name|message|args)>|Caveat:)/
const redact = (t: string) => LEAK_PATTERNS.reduce((x, p) => x.replace(p.re, () => `<${p.kind}>`), t)
const clean = (t: string) => redact(t.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, () => '').replace(/<((?:pasted|command|local-command|ide)[-_a-z]*)[^>]*>[\s\S]*?<\/\1>/g, () => '').replace(/\[Pasted text[^\]]*\]/g, () => '').split('\n').filter((l) => !/^\s*>/.test(l) && !/^\s*<!--.*-->\s*$/.test(l)).join('\n').trim())
type Block = { type: string; text?: string; id?: string; name?: string; input?: Record<string, unknown>; tool_use_id?: string; is_error?: boolean }
const directives: { session: string; at: string; text: string }[] = [], answers: { session: string; at: string; question: string; answer: string }[] = []
const breaks: { text: string }[] = [], errors: { tool: string }[] = []
for (const f of [...mains, ...subs]) {
  const main = mains.includes(f), session = (main ? f : f.split('/subagents/')[0]!).split('/').pop()!.replace(/\.jsonl$/, '')
  const toolOf = new Map<string, string>()
  for (const line of readFileSync(f, 'utf8').split('\n')) {
    if (!line) continue
    let e: { type?: string; isMeta?: boolean; isSidechain?: boolean; userType?: string; timestamp?: string; origin?: { kind?: string }; toolUseResult?: { answers?: Record<string, string> }; message?: { content?: string | Block[] } }
    try { e = JSON.parse(line) } catch { continue }
    const c = e.message?.content, blocks = Array.isArray(c) ? c : []
    for (const b of blocks) {
      if (b.type === 'tool_use' && b.id && b.name) { toolOf.set(b.id, b.name); const text = b.name === 'Bash' ? String(b.input?.command ?? '').replace(/'[^']*'|"[^"]*"/g, () => '') : ['Edit', 'Write'].includes(b.name) ? String(b.input?.new_string ?? b.input?.content ?? '') : ''; if (text) breaks.push({ text }) }
      if (b.type === 'tool_result' && b.is_error) errors.push({ tool: toolOf.get(b.tool_use_id ?? '') ?? 'unknown' })
      if (main && b.type === 'tool_result' && toolOf.get(b.tool_use_id ?? '') === 'AskUserQuestion') for (const [question, answer] of Object.entries(e.toolUseResult?.answers ?? {})) answers.push({ session, at: e.timestamp ?? '', question: clean(question), answer: clean(String(answer)) })
    }
    // the user's own words: a human turn of a main session, never a tool result, a harness wrapper, a notification or a subagent's hand-back
    if (!main || e.type !== 'user' || e.isMeta || e.isSidechain || e.toolUseResult || blocks.some((b) => b.type === 'tool_result')) continue
    if (e.origin ? e.origin.kind !== 'human' : e.userType !== 'external') continue
    const raw = typeof c === 'string' ? c : blocks.filter((b) => b.type === 'text').map((b) => b.text ?? '').join('\n')
    if (HARNESS.test(raw.trim())) continue
    const text = clean(raw); if (text) directives.push({ session, at: e.timestamp ?? '', text })
  }
}
console.log(`session: read ${mains.length} session(s) and ${subs.length} subagent transcript(s): ${directives.length} directive(s), ${answers.length} answer(s), ${breaks.length} tool input(s), ${errors.length} error(s)`)

// Open work and the dockets, through the one MCP client; a docket unread is unknown, never a file fallback
const mcp = mcpClient(), key = !!process.env.QPU_APP_KEY
type Page = { id: string; title: string; _status?: string; createdAt?: string; layout?: { blockType: string; tool?: string; arguments?: { statement?: string } }[] }
let pages: Page[] = []
const getOpen = async () => { const r = key ? await mcp.findAll('findPages', { draft: true, depth: 0, limit: PAGE, where: JSON.stringify({ parent: { equals: OPEN_WORK } }), select: JSON.stringify({ title: true, _status: true, createdAt: true, layout: true }) }) : { docs: null, says: 'no QPU_APP_KEY' }; return r }
const openRead = await timed('medium', getOpen)
pages = (openRead.docs ?? []) as Page[]
await test('medium', 'Open work read through the local Payload MCP', () => openRead.docs !== null)
const branches = execFileSync('git', ['worktree', 'list', '--porcelain'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter((l) => l.startsWith('branch refs/heads/dev/')).map((l) => l.replace(/^branch refs\/heads\/dev\//, () => '').toLowerCase())
const getStatement = (p: Page) => (p.layout ?? []).map((b) => b.arguments?.statement ?? '').filter((s) => !/^session: |^combinations: /.test(s)).join(' ')
const open = pages.filter((p) => p.title !== COMBINATIONS_TITLE()).map((p) => ({ id: p.id, title: p.title, statement: getStatement(p), status: p._status ?? 'draft', createdAt: p.createdAt, started: branches.some((b) => p.title.toLowerCase().split(/[^a-z]+/).some((w) => w === b || w.startsWith(b))) }))
function COMBINATIONS_TITLE() { return 'Lead combinations (a432)' }
const files = execFileSync('git', ['ls-files', ...LITERAL_ROOTS], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter((f) => /\.(ts|tsx|mts|lean)$/.test(f))
// quality before any lead: the bytes a quality wave frees, measured from the entropy docket (every repeated line kept once), and the net bytes one
// predicted file of a lead adds, measured from the last 200 file changes of the history at the tree's mean bytes per line
const docket = (f: string): { id: string; kind?: string; statement: string; status: string; source?: string; occurrences?: number }[] => { const j = getJson(join(ROOT, 'docs', 'public', f), []); return Array.isArray(j) ? j : j.leads ?? [] }
const freed = docket('entropy.json').filter((l) => l.kind === 'duplicate').reduce((n, l) => n + Math.max(0, (l.occurrences ?? 1) - 1) * Buffer.byteLength(l.statement.split(' — ').pop() ?? ''), 0)
const touches = execFileSync('git', ['log', '-n', '200', '--format=', '--numstat', '--', 'src', 'scripts'], { cwd: ROOT, encoding: 'utf8' }).split('\n').map((l) => l.split('\t')).filter((c) => c.length === 3 && /^\d+$/.test(c[0]!) && /^\d+$/.test(c[1]!))
const code = files.filter((f) => /\.ts$/.test(f) && existsSync(join(ROOT, f))).map((f) => readFileSync(join(ROOT, f), 'utf8'))
const bytesPerLine = code.reduce((n, t) => n + Buffer.byteLength(t), 0) / Math.max(1, code.reduce((n, t) => n + t.split('\n').length, 0))
const cost = Math.max(0, Math.round((touches.reduce((n, c) => n + Number(c[0]) - Number(c[1]), 0) / Math.max(1, touches.length)) * bytesPerLine))
// the forecast of one CL: the gaps between main's commits, oldest first, smoothed by forecastOf; the route through the waves is priced by it
const gaps = execFileSync('git', ['log', '--first-parent', '--format=%ct', 'main'], { cwd: ROOT, encoding: 'utf8' }).trim().split('\n').map(Number).reverse().flatMap((t, i, a) => (i ? [1000 * (t - a[i - 1]!)] : []))
const cl = forecastTimes(gaps)
const decided = leads({ session: { directives, answers, breaks, errors, open, files, now: date, quality: { freed, cost }, ...(cl ? { forecast: { ms: cl.point, interval: cl.interval } } : {}) } })
const d = decided.directives as { total: number; sessions: number; folded: number; proposed: number; once: number; assents: number }
type Item = { id: string; title: string; kind: 'quality' | 'lead'; netBytes: number | null; paid: boolean; proposed: boolean; act: boolean; started: boolean; priority: string; directives: number; sessions: number; how: { name: string; arguments: Record<string, unknown> } | null; files: string[]; cell: number; labels: string; blocker: unknown }
const items = decided.items as Item[], waves = decided.waves as { wave: number; head: string; items: string[] }[]
const waveOf = new Map(waves.flatMap((w) => w.items.map((id) => [id, w.wave] as const)))

// a432: every lead of the tree, the dockets next, purify and the entropy stream keep, and Open work, each in its cell
const extra = [...docket('next-leads.json'), ...docket('purify-leads.json'), ...docket('entropy.json'), ...pages.map((p) => ({ id: p.id, statement: `${p.title} ${getStatement(p)}`, status: p._status === 'published' ? 'published' : 'open', source: 'payload open work', payload: true }))]
const k = leads({ combinations: { leads: extra } })

// the Clay rosetta: the tree's reading in-process, the unit's by real MCP client calls, one session per host, paced; sealed answers reused
type Unit = { value: number; answer?: { seed?: number; reflection?: number }; refusal?: string }
const sealedRead = key && !offline ? await mcp.findAll('findEntries', { where: JSON.stringify({ from: { equals: 'rosetta' } }), limit: PAGE }) : { docs: [] as unknown[], says: 'offline' }
const sealed = new Map<number, Unit>()
for (const e of (sealedRead.docs ?? []) as { body?: { value?: number; seed?: number; reflection?: number; validUntil?: string } }[]) if (e.body && typeof e.body.value === 'number' && Date.parse(e.body.validUntil ?? '') > Date.now()) sealed.set(e.body.value, { value: e.body.value, answer: { seed: e.body.seed, reflection: e.body.reflection } })
const own = key && !offline ? ((await mcp.findAll('findTenants', { where: JSON.stringify({}), sort: 'createdAt', limit: PAGE })).docs as { id: string; namespace?: string }[] | null) : null
const tenant = own?.find((t) => t.namespace === 'qpu') ?? own?.[0]
// a page is created under Open work's own tenant: a parent of another tenant refuses its child
const openTenant = key ? ((await mcp.docOf('findPages', OPEN_WORK))?.tenant as string | { id: string } | undefined) : undefined
const pageTenant = typeof openTenant === 'object' ? openTenant?.id : openTenant
const filledValues = k.rosetta.values as number[], gridValues = k.rosetta.grid as number[]
const unitSession = mcpSessionOf(UNIT)
let calls = 0, sealedNow = 0
const ask = async (value: number): Promise<Unit> => {
  if (sealed.has(value)) return sealed.get(value)!
  if (offline) return { value, refusal: 'offline: not asked' }
  try { calls += 1; const a = await unitSession.tool('run_sequence', { input: value }) as { seed?: number; reflection?: number }; const u = { value, answer: { seed: a.seed, reflection: a.reflection } }; sealed.set(value, u)
    if (tenant) { const r = await mcp.call('createEntries', { tenant: tenant.id, kind: 'document', from: 'rosetta', body: { value, seed: a.seed, reflection: a.reflection, door: 'run_sequence', host: new URL(UNIT).host, validUntil: new Date(Date.now() + SEAL_MS).toISOString() } }); if (r.error === undefined) sealedNow += 1 }
    return u } catch (e) { return { value, refusal: (e as Error).message } }
}
if (!offline) { calls += 1; await unitSession.initialize() }
const unitFilled: Unit[] = []
await timed('large', async () => { for (const v of filledValues) unitFilled.push(await ask(v)) })
const rosetta = clay({ technique: 'reflection', unit: unitFilled })
// enormous: the whole grid against the unit, a quantum per run; what the quantum leaves is asked by the next run, the sealed answers kept
const gridDone: Unit[] = []
await timed('enormous', async () => { for (const v of gridValues) { if (!sealed.has(v) && Date.now() - started > QUANTUM_MS) continue; gridDone.push(await ask(v)) } })
const grid = clay({ technique: 'reflection', unit: gridDone })
const coveredValues = new Set(gridDone.filter((u) => u.answer).map((u) => u.value))
const cellsCovered = (k.cells as { value: number }[]).filter((c) => coveredValues.has(c.value)).length

// small: the pure doors over fixtures and the kernel's theorems
await timed('small', async () => { for (const id of ['leads-combinations', 'leads-session', 'clay-rosetta']) await test('small', `example ${id}`, () => { const e = EXAMPLES.find((x) => x.id === id)!; return e.expect(toolCallerOf(e.tool)(e.arguments)) === null })
for (const t of ['textbook_lead_cells', 'textbook_session_partition', 'textbook_rosetta_conventions']) await test('small', `kernel accepts ${t}`, () => THEOREM_KEYS.has(t))
await test('small', 'every directive in exactly one class', () => d.folded + d.proposed + d.once + d.assents === d.total)
await test('small', 'every lead placed in one of 432 cells', () => k.total === 432 && k.filled + k.empty === 432 && (k.cells as { count: number }[]).reduce((n, c) => n + c.count, 0) === k.placed) })
// large: the hosted unit's readings of every filled value verified, and the tree's readings decoded by majority over every e2e host
for (const c of offline ? [] : (rosetta.compared as { value: number; verified: boolean; refusal: string | null }[])) await test('large', `rosetta ${c.value} on ${new URL(UNIT).host}`, () => c.verified)
const hosts = offline ? [] : (toolCallerOf('e2e')({ tools: ['clay'] }).hosts as string[])
const copies = new Map<string, { seed: number | null }[]>()
await timed('large', async () => { for (const h of hosts) { calls += 2; try { const s = mcpSessionOf(h); await s.initialize(); const r = await s.tool('clay', { technique: 'reflection', unit: unitFilled }) as { compared?: { value: number; tree: { seed: number } | null }[] }; copies.set(h, filledValues.map((v) => ({ seed: r.compared?.find((x) => x.value === v)?.tree?.seed ?? null }))) } catch { copies.set(h, filledValues.map(() => ({ seed: null }))) } } })
for (const [i, v] of filledValues.entries()) {
  if (!hosts.length) break
  const local = (rosetta.compared as { value: number; tree: { seed: number } }[]).find((x) => x.value === v)!.tree.seed
  const votes = [local, ...hosts.map((h) => copies.get(h)![i]!.seed)]
  await test('large', `tree reading of ${v} decoded by majority over ${votes.length} copies`, () => votes.filter((x) => x === local).length * 2 > votes.length)
}
if (!offline) await test('enormous', `the grid quantum: ${cellsCovered} of 432 cells read on both sides`, () => grid.conventionBreaks === 0)

// medium: the decision written into Open work as drafts, every write read back (the MCP client errors on an update that changed nothing)
let foldedWrites = 0, created = 0, refused = 0
const block = (statement: string) => ({ blockType: 'qpu', tool: 'match', arguments: { statement } })
const keep = (p: Page, prefix: RegExp) => (p.layout ?? []).filter((b) => !prefix.test(b.arguments?.statement ?? '')).map((b) => ({ blockType: b.blockType, tool: b.tool, arguments: b.arguments }))
const getLine = (i: Item) => `session: ${i.directives} directive(s) from ${i.sessions} session(s); ${i.kind}; priority ${i.priority}; cell ${i.cell} (${i.labels}); wave ${waveOf.get(i.id) ?? 'none yet: unpaid until a quality wave frees its bytes'}; how ${i.how ? i.how.name : 'routed to no call yet'}`
const combinationsLine = `combinations: ${k.total} cells, ${k.placed} leads placed, ${k.empty} empty; default cell ${k.default.cell} (${k.default.labels}); rosetta ${rosetta.unitVerified} of ${rosetta.unitAsked} filled values verified`
if (key && !offline) await timed('medium', async () => {
  for (const i of items.filter((x) => !x.proposed && x.directives > 0)) {
    const p = pages.find((x) => x.id === i.id)!, line = getLine(i)
    if ((p.layout ?? []).some((b) => b.arguments?.statement === line)) continue
    const r = await mcp.call('updatePages', { id: i.id, layout: [...keep(p, /^session: /), block(line)] })
    if (r.error === undefined) foldedWrites += 1; else refused += 1
  }
  // a proposal that states an act and was said in three sessions or more is written as a draft; the rest are decided and counted, a page waiting for a third saying
  for (const i of items.filter((x) => x.proposed && x.act && x.sessions >= 3)) {
    if (pages.some((p) => p.title === i.title)) continue
    const r = await mcp.call('createPages', { tenant: pageTenant, title: i.title, parent: OPEN_WORK, hero: { type: 'default' }, layout: [block(getLine(i))] })
    if (/"id"/.test(r.text ?? '')) created += 1; else refused += 1
  }
  const kp = pages.find((p) => p.title === COMBINATIONS_TITLE())
  const kw = kp ? ((kp.layout ?? []).some((b) => b.arguments?.statement === combinationsLine) ? { text: 'kept' } : await mcp.call('updatePages', { id: kp.id, layout: [...keep(kp, /^combinations: /), block(combinationsLine)] })) : await mcp.call('createPages', { tenant: pageTenant, title: COMBINATIONS_TITLE(), parent: OPEN_WORK, hero: { type: 'default' }, layout: [block(combinationsLine)] })
  const back = (await getOpen()).docs as Page[] | null
  await test('medium', 'the combinations written to Open work and read back', () => kw.error === undefined && !!back?.some((p) => p.title === COMBINATIONS_TITLE() && (p.layout ?? []).some((b) => b.arguments?.statement === combinationsLine)))
  await test('medium', 'every folded and proposed item written and read back', () => refused === 0 && items.filter((i) => i.proposed && i.act && i.sessions >= 3).every((i) => back?.some((p) => p.title === i.title)))
})

// the record: counts and item titles only; the page beside it
const sizes = (Object.keys(SIZES) as Size[]).map((size) => { const t = tests.filter((x) => x.size === size); const ms = phaseMs[size]; return { size, tests: t.length, passed: t.filter((x) => x.passed).length, ms, budgetMs: SIZES[size], withinBudget: ms <= SIZES[size] } })
const slo = { named: false, lead: 'the standards doors name no SLO for test sizes: each size is timed against Bazel\'s default timeout for it (small 60 s, medium 300 s, large 900 s, enormous 3600 s) until one is named' }
const record = {
  license: LICENSE.attribution, date, ms: Date.now() - started, offline,
  read: { sessions: mains.length, subagents: subs.length, directives: directives.length, answers: answers.length, toolInputs: breaks.length, errors: errors.length },
  decision: { ...d, breaks: decided.breaks, errors: decided.errors, items: items.length, proposed: decided.proposed, started: decided.started, blockers: decided.blockers, waves: waves.length },
  items: items.map((i) => ({ id: i.id, title: i.title, kind: i.kind, netBytes: i.netBytes, paid: i.paid, proposed: i.proposed, act: i.act, started: i.started, priority: i.priority, directives: i.directives, sessions: i.sessions, how: i.how, files: i.files, cell: i.cell, wave: waveOf.get(i.id), blocked: !!i.blocker })),
  next: decided.next,
  combinations: { total: k.total, placed: k.placed, filled: k.filled, empty: k.empty, default: k.default, clusters: (k.clusters as { cell: number; labels: string; count: number }[]).map((c) => ({ cell: c.cell, labels: c.labels, count: c.count })) },
  rosetta: { host: new URL(UNIT).host, values: filledValues.length, verified: rosetta.unitVerified, disagree: rosetta.conventionBreaks, refused: rosetta.unitRefused, calls, sealedNow, sealedKept: sealed.size - sealedNow, grid: { cellsCovered, asked: gridDone.length, verified: grid.unitVerified, disagree: grid.conventionBreaks }, leads: (grid.leads as { id: string }[]).filter((l) => l.id.startsWith('rosetta-')).map((l) => l.id) },
  writes: { folded: foldedWrites, created, refused },
  sizes, slo, tests: tests.map((t) => ({ name: t.name, passed: t.passed })), quality: decided.quality, route: decided.route,
}
writeFileSync(join(ROOT, 'docs', 'public', 'session.json'), JSON.stringify(record, null, 1) + '\n')
writeFileSync(join(ROOT, 'docs', 'session.md'), ['---', 'title: Session', 'order: 58', '---', '', '# Every session decides what is next', '', `Generated by \`npm run next\` on ${date} through the \`leads\` tool's session door: ${mains.length} session transcript(s) and ${subs.length} subagent transcript(s) read; ${d.total} directive(s) from ${d.sessions} session(s), ${d.folded} folded into Open work, ${d.proposed} proposed, ${d.once} acted on where said once, ${d.assents} assent(s). Nothing from a transcript is written here but counts and item titles. The items run in ${waves.length} parallel wave(s) of disjoint files; a432 places ${k.placed} leads in ${k.filled} of 432 cells; the Clay rosetta verified ${rosetta.unitVerified} of ${rosetta.unitAsked} filled values against ${new URL(UNIT).host} over ${calls} MCP call(s).`, '', '| Size | Tests | Passed | ms | Budget ms |', '|---|---:|---:|---:|---:|', ...sizes.map((s) => `| ${s.size} | ${s.tests} | ${s.passed} | ${s.ms} | ${s.budgetMs} |`), '', `${slo.lead}.`, '', '| Wave | Item | Priority | Cell | How | Files |', '|---:|---|---|---:|---|---|', ...items.map((i) => `| ${waveOf.get(i.id)} | ${cell(i.title)} | ${i.priority} | ${i.cell} | ${i.how ? cell(i.how.name) : '—'} | ${cell(i.files.join(', '))} |`), ''].join('\n'))

const n = (s: Size) => sizes.find((x) => x.size === s)!
console.log(`session: ${d.total} directives from ${d.sessions} sessions, ${d.folded} folded, ${d.proposed} proposed; next: ${items.length} items in ${waves.length} parallel waves`)
for (const w of decided.next as { wave: number; item: string; how: { name: string; arguments: unknown } | null }[]) console.log(`next: ${w.item} via ${w.how ? `${w.how.name} ${JSON.stringify(w.how.arguments)}` : 'no call yet (a lead)'}`)
if (decided.route) console.log(`route: ${decided.route.legs.length} leg(s), ${decided.route.duration} estimated (one after another ${decided.route.staticDuration}), interval ${decided.route.interval?.join(' to ') ?? 'none yet'}`)
console.log(`quality: ${decided.quality.items} item(s) first in ${decided.quality.waves} wave(s), ${freed} byte(s) a quality wave frees, ${cost} byte(s) a lead file adds; ${decided.quality.unpaid} lead(s) unpaid`)
console.log(`combinations: ${k.total} cells, ${k.placed} leads placed, ${k.empty} empty; rosetta: ${rosetta.unitVerified} verified, ${rosetta.conventionBreaks} disagree, ${rosetta.unitRefused} refused over ${calls} MCP calls`)
console.log(`sizes: small ${n('small').passed}/${n('small').tests}, medium ${n('medium').passed}/${n('medium').tests}, large ${n('large').passed}/${n('large').tests}, enormous ${cellsCovered} of 432 cells this run`)
