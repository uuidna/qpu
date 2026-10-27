// The next step is the whole platform running itself: regenerate the docs from the surface, typecheck, test, audit the
// surface through the surface, cross-verify the leads on live public sources, build the site (every live page throws
// at build time if a result drifted), and write the receipt. A red step is a violation: it is written to the leads
// docket as an open lead with its evidence, the red steps are retried once after the generators have run, and a step
// still red fails the run, after every violation is written (no flag lifts it); `--offline` skips the network.
import { spawnSync, spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { appendFileSync, existsSync, readFileSync, writeFileSync, unlinkSync, rmSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir, availableParallelism } from 'node:os'
import { pathToFileURL } from 'node:url'
import { uuidOf } from '../src/quantum/blocks.ts'
import { cellOf as cell } from '../src/quantum/widgets.ts'
import { remediesOf, manualDocsOf } from '../src/quantum/audit.ts'
import { STEP_CACHE, GENERATED_FILES } from '../src/quantum/toolboxes/repository.ts'
import { timesOf } from './machine.ts'
import { forecastOf } from '../src/quantum/machine.ts'
import { readJson, getOf } from './mcp.ts'

const ROOT = process.cwd()
const pub = (f: string) => join(ROOT, 'docs', 'public', f)
// text that reaches a page is escaped once: an angle bracket in evidence or a node name is text, never a tag
const offline = process.argv.includes('--offline')
const fast = process.argv.includes('--fast') // the pre-commit form: the cheap steps only; the long and the networked wait for the full run
const lake = [`${process.env.HOME}/.elan/bin/lake`, `${process.env.HOME}/.elan/toolchains/leanprover--lean4---v4.33.0/bin/lake`, 'lake'].find((p) => p === 'lake' || existsSync(p))!

// quantum multitasking is the natural speedup: steps that need nothing from each other run at once, in waves; a wave waits for
// the one before it (the generators before the checks, the checks before the readers, the readers before the site)
type Step = { name: string; cmd: string; args: string[]; skip?: string; budgetMs?: number; wave: number; /** a long single task split into short multitasks: n shards at once (QPU_SHARD=i/n), then one merge (QPU_SHARD=merge) */ shards?: number }
const TIMES = await timesOf(ROOT), budgetOf = (s: Step) => Math.min(2 * (s.budgetMs ?? 600_000), Math.max(s.budgetMs ?? 600_000, 2 * (forecastOf(TIMES[s.name] ?? [])?.point ?? 0)))
const steps: Step[] = [
  { name: 'clay:gen', cmd: 'node', args: ['scripts/gen-clay.ts'], wave: 1 },
  { name: 'docs:gen', cmd: 'node', args: ['scripts/gen-docs.ts'], wave: 1 },
  { name: 'session', cmd: 'node', args: ['scripts/session.ts'], skip: fast ? 'fast' : undefined, budgetMs: 600_000, wave: 1 }, // every session read to decide what is next and how; offline only the Payload writes and the unit's calls wait
  { name: 'configs', cmd: 'node', args: ['scripts/configs.ts'], wave: 1 }, // always: every configuration (configs, scopes, fields, validations, access, hooks, bindings, actions) improved — the tool's files written, the hand's measured
  { name: 'typecheck', cmd: 'npx', args: ['tsc', '--noEmit', '-p', 'tsconfig.json'], wave: 2 },
  { name: 'test', cmd: 'node', args: ['--test', 'src/quantum/*.test.ts'], budgetMs: 300_000, wave: 2 },
  { name: 'lean', cmd: lake, args: ['build'], wave: 1.5 }, // before purify, which reads the kernel's environment
  { name: 'audit', cmd: 'node', args: ['scripts/audit.ts'], wave: 2 },
  { name: 'imagine', cmd: 'node', args: ['scripts/imagine.ts'], budgetMs: 300_000, skip: fast ? 'fast' : undefined, wave: 3, shards: 4 }, // a quantum: the leads not yet imagined, as many as fit; the rest next run
  { name: 'discover', cmd: 'node', args: ['scripts/discover.ts'], skip: offline ? 'offline' : fast ? 'fast' : undefined, budgetMs: 300_000, wave: 3, shards: 4 }, // a quantum: contracts kept a day, the rest fetched as far as the quantum goes
  { name: 'verify', cmd: 'node', args: ['scripts/verify.ts'], skip: offline ? 'offline' : fast ? 'fast' : undefined, budgetMs: 300_000, wave: 3, shards: 4 }, // a quantum: today's results kept by url, the rest fetched as far as the quantum goes
  { name: 'readiness', cmd: 'node', args: ['scripts/readiness.ts'], skip: offline ? 'offline' : fast ? 'fast' : undefined, budgetMs: 300_000, wave: 3, shards: 4 },
  { name: 'e2e', cmd: 'node', args: ['scripts/e2e.ts'], skip: offline ? 'offline' : fast ? 'fast' : undefined, budgetMs: 300_000, wave: 3 }, // the gate as a repetition code: every combination on every host, decoded by majority; a quantum
  { name: 'constants', cmd: 'node', args: ['scripts/constants.ts'], skip: offline ? 'offline' : undefined, budgetMs: 120_000, wave: 3 }, // CODATA's constants as exact integers, sealed with their uncertainty
  { name: 'theorems-raid', cmd: 'node', args: ['scripts/theorems-raid.ts'], skip: offline ? 'offline' : undefined, budgetMs: 300_000, wave: 3 }, // every textbook theorem a docket entry under the QPU's own tenant, through the Payload MCP
  { name: 'claims', cmd: 'node', args: ['scripts/claims.ts'], skip: offline ? 'offline' : undefined, budgetMs: 600_000, wave: 3 }, // every general textbook theorem measured against OpenAlex, the claims index generated
  { name: 'attest', cmd: 'node', args: ['scripts/attest.ts'], skip: offline ? 'offline' : undefined, budgetMs: 120_000, wave: 3 },
  { name: 'security', cmd: 'node', args: ['scripts/security.ts'], skip: offline ? 'offline' : undefined, budgetMs: 300_000, wave: 3 }, // the security audit from the client and the developer perspectives merged as one, by the audit tool // crypto and certificate APIs, NIST and CERN, verified by theorems in coordinated combinations
  { name: 'patents', cmd: 'node', args: ['scripts/patents.ts'], skip: offline ? 'offline' : undefined, budgetMs: 120_000, wave: 3 }, // the open patent APIs fetched once, the theorems verified over every patent read
  { name: 'compete', cmd: 'node', args: ['scripts/compete.ts'], budgetMs: 120_000, wave: 3 }, // always: every competition's rules judged against the evidence; online, the windows read from the pages and pushed from the remote
  { name: 'currency', cmd: 'node', args: ['scripts/currency.ts'], skip: offline ? 'offline' : undefined, budgetMs: 120_000, wave: 3 }, // every free rate API fetched once, harmonised: one rate per currency, the catalogue in every currency
  { name: 'repository', cmd: 'node', args: ['scripts/repository.ts'], budgetMs: 300_000, wave: 3 }, // always: workspaces, branches, tags, releases; offline the local facts
  { name: 'legal', cmd: 'node', args: ['scripts/legal.ts'], budgetMs: 600_000, wave: 3, shards: 4 },
  { name: 'sources', cmd: 'node', args: ['scripts/sources.ts'], skip: offline ? 'offline' : fast ? 'fast' : undefined, budgetMs: 1_800_000, wave: 3 }, // the immutable sources of leads, every page to its end
  { name: 'workspace', cmd: 'node', args: ['scripts/workspace.ts'], budgetMs: 120_000, wave: 4 }, // Google Forms, Docs and Drive in Payload from the Discovery documents discover cached
  { name: 'textbook', cmd: 'node', args: ['scripts/textbook.ts'], budgetMs: 300_000, wave: 4, shards: 4 }, // always: the examples verified online from the wave; offline the plan // always: cached by inputs, the pure half offline
  { name: 'purify', cmd: 'node', args: ['scripts/purify.ts'], wave: 2 }, // beside the tests and the audit: independent pure work fills the idle cores (its index written atomically)
  { name: 'metrics', cmd: 'node', args: ['scripts/metrics.ts'], budgetMs: 120_000, skip: fast ? 'fast' : undefined, wave: 5 }, // always: the run's artefacts read into one measure
  { name: 'docs:build', cmd: 'npx', args: ['vitepress', 'build', 'docs'], skip: fast ? 'fast' : undefined, wave: 6 },
  { name: 'trunk', cmd: 'node', args: ['scripts/trunk.ts'], wave: 7 }, // always: main fast-forwarded locally when green; never pushed
  { name: 'publish', cmd: 'node', args: ['scripts/publish.ts'], skip: offline ? 'offline' : fast ? 'fast' : undefined, budgetMs: 300_000, wave: 7 },
]
const LICENSE_LINE = 'CC-BY-NC-ND-4.0 © Tsvetan Rouschev (https://orcid.org/0009-0000-7312-9778); commercial use by licence (https://qpu.uuidna.com)'
const receipt: { license: string; date: string; head: string; steps: { name: string; status: 'green' | 'red' | 'skipped'; ms: number; tail: string; counts?: Record<string, number>; measures?: { wallNs: string; cpuUs: number; rssKb: number; firstOutputMs: number | null } }[] } = {
  license: LICENSE_LINE,
  date: new Date().toISOString(),
  head: spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).stdout.trim(),
  steps: [],
}
// Two runs in one tree write the same files under docs/public; the second is not stopped, it is recorded as a lead of this run.
const lockPath = pub('next.lock')
const alive = (pid: number): boolean => { try { process.kill(pid, 0); return true } catch { return false } }
const concurrent: { pid: number; date: string } | null = (() => { const l = readJson(lockPath) as { pid: number; date: string } | null; return l && alive(l.pid) ? l : null })()
if (concurrent) console.log(`⚠ another next run (pid ${concurrent.pid}, since ${concurrent.date}) is writing the same files; recorded as a lead, this run continues`)
writeFileSync(lockPath, JSON.stringify({ pid: process.pid, date: receipt.date }) + '\n')
// the blocks teleported between this run's steps start empty: a block from an earlier run was computed by earlier code
rmSync(join(ROOT, '.qpu', 'blocks'), { recursive: true, force: true })
process.on('exit', () => { if ((readJson(lockPath) as { pid: number } | null)?.pid === process.pid) try { unlinkSync(lockPath) } catch { /* already gone */ } })
// time and heat, the two measures of every step: wall nanoseconds here, and the CPU microseconds and peak RSS of every Node process the step
// spawns, each appending its own on exit (scripts/heat.mjs, preloaded through NODE_OPTIONS) to a file of the step's own
const HEAT = pathToFileURL(join(ROOT, 'scripts', 'heat.mjs')).href
const heatOf = (file: string) => { let cpuUs = 0, rssKb = 0; try { for (const l of readFileSync(file, 'utf8').trim().split('\n')) { if (!l) continue; const h = JSON.parse(l) as { cpuUs: number; rssKb: number }; cpuUs += h.cpuUs; rssKb = Math.max(rssKb, h.rssKb) } unlinkSync(file) } catch { /* no Node process of the step wrote its heat */ } return { cpuUs, rssKb } }
const spawned = (s: Step, shard?: string): Promise<{ status: number | null; out: string; timedOut: boolean; cpuUs: number; rssKb: number; firstMs: number | null }> => new Promise((resolve) => {
  const t0 = Date.now(); let firstMs: number | null = null
  const heat = join(tmpdir(), `qpu-heat-${process.pid}-${s.name.replace(/[^a-z0-9-]/gi, '_')}-${(shard ?? 'all').replace('/', 'of')}.ndjson`)
  const child = spawn(s.cmd, s.args, { cwd: ROOT, shell: process.platform === 'win32', detached: process.platform !== 'win32', env: { ...process.env, FORCE_COLOR: '0', QPU_OFFLINE: offline ? '1' : '', QPU_HEAT_FILE: heat, NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ''} --import=${HEAT}`.trim(), ...(shard ? { QPU_SHARD: shard } : {}) } })
  let out = ''; let timedOut = false
  // the first line the user could see: an action silent past the budget is invisible, priced so and recorded silently
  child.stdout.on('data', (d) => { out += d; firstMs ??= Date.now() - t0 }); child.stderr.on('data', (d) => { out += d; firstMs ??= Date.now() - t0 })
  // the budget kills the step's whole process group: a grandchild outlived its npx parent
  const timer = setTimeout(() => { timedOut = true; try { process.kill(-child.pid!, 'SIGKILL') } catch { child.kill('SIGKILL') } }, budgetOf(s))
  child.on('error', (e) => { clearTimeout(timer); resolve({ status: null, out: out + `\n${e.message}`, timedOut, firstMs, ...heatOf(heat) }) })
  child.on('close', (status) => { clearTimeout(timer); resolve({ status, out, timedOut, firstMs, ...heatOf(heat) }) })
})
// the step cache: a deterministic step whose inputs (their staged blobs, and the content of any file changed beside them) have the address they had
// when it last ran green is reused from its sealed record, never rerun; a generator also needs its generated files to be exactly what it wrote
// (a hand edit of its output reruns it); a step outside STEP_CACHE always runs. Records live in .qpu/steps, sealed by SHA-256.
const recordPath = (name: string) => join(ROOT, '.qpu', 'steps', `${name.replace(/[^a-z0-9-]/gi, '_')}.json`)
const inputKeyOf = (s: Step): string | null => {
  const c = STEP_CACHE[s.name]; if (!c || process.env.QPU_NO_CACHE === '1') return null
  const git = (a: string[]) => spawnSync('git', a, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 }).stdout ?? ''
  const roots = [...c.roots, ...(c.generatedDocsExcluded ? generatedDocsExcludes() : [])]
  const h = createHash('sha256').update(`${s.cmd} ${s.args.join(' ')}\n`).update(git(['ls-files', '-s', '--', ...roots]))
  for (const f of git(['status', '--porcelain', '--untracked-files=all', '--', ...roots]).split('\n').filter(Boolean).map((l) => l.slice(3)).sort()) { h.update(f); try { h.update(readFileSync(join(ROOT, f))) } catch { h.update('gone') } }
  return h.digest('hex')
}
// the docs pages a script writes, read from the scripts' own write targets, excluded from a step's inputs: they are the run's outputs
let excludes: string[] | null = null
const generatedDocsExcludes = () => excludes ??= (() => { const git = (a: string[]) => spawnSync('git', a, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 }).stdout ?? ''; const scripts = Object.fromEntries(git(['ls-files', 'scripts']).trim().split('\n').filter((f) => /\.(ts|mjs)$/.test(f)).map((f) => [f, readFileSync(join(ROOT, f), 'utf8')])); return manualDocsOf(git(['ls-files', 'docs']).trim().split('\n').filter((f) => f.endsWith('.md')).map((path) => ({ path, bytes: 0 })), scripts).rows.filter((r) => r.generator).map((r) => `:(exclude)${r.path}`) })()
const outputsOf = () => { const h = createHash('sha256'); for (const f of GENERATED_FILES) { h.update(f); try { h.update(readFileSync(join(ROOT, f))) } catch { h.update('gone') } } return h.digest('hex') }
const sealedOf = (name: string) => readJson(recordPath(name)) as { name: string; key: string; status: string; outputs?: string; counts?: Record<string, number>; date: string; sha256: string } | null
const run = async (s: Step): Promise<boolean> => {
  const key = s.skip ? null : inputKeyOf(s), sealed = key ? sealedOf(s.name) : null
  if (key && sealed && sealed.status === 'green' && sealed.key === key && (!STEP_CACHE[s.name]?.generator || sealed.outputs === outputsOf())) {
    receipt.steps.push({ name: s.name, status: 'green', ms: 0, tail: `reused: its inputs ${key.slice(0, 12)} unchanged since ${sealed.date} (sealed ${sealed.sha256.slice(0, 12)})`, counts: { ...(sealed.counts ?? {}), reused: 1 }, measures: { wallNs: '0', cpuUs: 0, rssKb: 0, firstOutputMs: 0 } })
    console.log(`↺ ${s.name}: reused (inputs unchanged since ${sealed.date})`); return true
  }
  if (s.skip) { receipt.steps.push({ name: s.name, status: 'skipped', ms: 0, tail: s.skip }); console.log(`· ${s.name}: skipped (${s.skip})`); return true }
  const started = Date.now(), startedNs = process.hrtime.bigint()
  // short multitasks: the shards run at once, each with its share and its own budget, then the merge; the outputs are read as one
  const r = s.shards && !s.skip ? await (async () => { const parts = await Promise.all(Array.from({ length: s.shards! }, (_, i) => spawned(s, `${i}/${s.shards}`))); const merge = await spawned(s, 'merge'); return { status: parts.every((p) => p.status === 0) && merge.status === 0 ? 0 : (parts.find((p) => p.status !== 0)?.status ?? merge.status), out: [...parts.map((p) => p.out), merge.out].join('\n'), timedOut: parts.some((p) => p.timedOut) || merge.timedOut, cpuUs: [...parts, merge].reduce((n, p) => n + p.cpuUs, 0), rssKb: Math.max(...[...parts, merge].map((p) => p.rssKb)), firstMs: parts.map((p) => p.firstMs).filter((x): x is number => x !== null).sort((a, b) => a - b)[0] ?? null } })() : await spawned(s)
  if (r.timedOut) console.log(`⏱ ${s.name}: exceeded its budget of ${budgetOf(s) / 1000} s (the longer of its own and twice its recorded mean) and was killed; a hang is a lead, not a stop`)
  const out = r.out
  const ok = r.status === 0 && !r.timedOut
  const counts: Record<string, number> = {}
  for (const [k, re] of Object.entries({ teleportedIn: /teleport: (\d+) blocks from/, blocksLeft: /teleport: (\d+) block\(s\) left/, keptToday: /(\d+) kept from today/, improved: /configs: .*?(\d+) improved/, drift: /configs: .*?(\d+) drift/, reused: /(\d+) answers kept from today/, imaginedKept: /imagine: (\d+) of \d+ leads kept/, involutions: /\((\d+) teleported by involution/, tests: /ℹ tests (\d+)/, pass: /ℹ pass (\d+)/, fail: /ℹ fail (\d+)/, checks: /(\d+)\/(\d+) checks pass/, jobs: /Build completed successfully \((\d+) jobs\)/, requests: /verify: (\d+) requests, (\d+) reachable/, ready: /readiness: (ready)/, imagined: /(\d+) imagined leads/ })) {
    const m = re.exec(out); if (m) counts[k] = Number(m[1]); if (m && k === 'checks') counts.checksTotal = Number(m[2]); if (m && k === 'requests') counts.reachable = Number(m[2])
  }
  const failingLines = [...new Set(out.split('\n').filter((l) => /^(✖|✗|not ok) /.test(l)))] // the failing check or test named in the receipt, so a first-attempt failure is measured, not lost in the tail
  const tail = (failingLines.length ? failingLines.join('\n') + '\n' : '') + out.trim().split('\n').slice(-8).join('\n')
  const wallNs = process.hrtime.bigint() - startedNs
  receipt.steps.push({ name: s.name, status: ok ? 'green' : 'red', ms: Date.now() - started, tail, counts, measures: { wallNs: String(wallNs), cpuUs: r.cpuUs, rssKb: r.rssKb, firstOutputMs: r.firstMs } })
  writeFileSync(pub('receipt.json'), JSON.stringify({ ...receipt, provisional: true }, null, 1) + '\n')
  if (ok && key) { const rec = { name: s.name, key, status: 'green', counts, date: new Date().toISOString(), ...(STEP_CACHE[s.name]?.generator ? { outputs: outputsOf() } : {}) }; mkdirSync(join(ROOT, '.qpu', 'steps'), { recursive: true }); writeFileSync(recordPath(s.name), JSON.stringify({ ...rec, sha256: createHash('sha256').update(JSON.stringify(rec)).digest('hex') }) + '\n') }
  console.log(`${ok ? '✓' : '✗'} ${s.name} (${((Date.now() - started) / 1000).toFixed(1)} s)${Object.keys(counts).length ? ' ' + JSON.stringify(counts) : ''}`)
  if (!ok) {
    const failing = out.split('\n').filter((l) => /^(✖|not ok) |^\s*AssertionError|^\s*Error: |error TS\d+|^error:/.test(l))
    console.log([...new Set(failing)].join('\n'))
    console.log(out.trim().split('\n').slice(-12).join('\n'))
  }
  return ok
}
const main = async () => {
const wall0 = Date.now()
const failed: Step[] = []
for (const wave of [...new Set(steps.map((s) => s.wave))].sort((a, b) => a - b)) {
  const inWave = steps.filter((s) => s.wave === wave)
  const results = await Promise.all(inWave.map((s) => run(s)))
  for (const [i, ok] of results.entries()) if (!ok) failed.push(inWave[i]!)
}
// A stop is a lead to follow next: retry the red steps once, now that the generators have run.
const stillRed: Step[] = []
for (const s of failed) { console.log(`↻ retry ${s.name}`); if (!(await run(s))) stillRed.push(s) }
const red = stillRed.length > 0
const wallMs = Date.now() - wall0
const sumMs = receipt.steps.reduce((n, x) => n + x.ms, 0)
// the quantum advantage of the run, measured and nothing else: what it did not compute classically — the blocks teleported
// between its steps, the answers kept from an earlier quantum, the copies proven at the edge by involution — and the waves'
// speedup; a sum of what was skipped beside what was done, never a claim about the world
const sumCount = (k: string) => receipt.steps.reduce((n, x) => n + (x.counts?.[k] ?? 0), 0)
const advantage = { speedup: wallMs ? Number((sumMs / wallMs).toFixed(2)) : null, teleportedBlocks: sumCount('teleportedIn'), blocksLeft: sumCount('blocksLeft'), keptFromEarlierQuanta: sumCount('keptToday') + sumCount('reused') + sumCount('imaginedKept'), involutions: sumCount('involutions'), honest: 'measured from this run\'s own outputs: blocks another step computed and this one did not, answers an earlier quantum settled and this run did not fetch, copies the edge proved by hash without a body, and the steps\' summed time over the wall time' }
Object.assign(receipt, { wallMs, sumMs, speedup: advantage.speedup, waves: [...new Set(steps.map((s) => s.wave))].length, advantage })
console.log(`advantage: ${advantage.teleportedBlocks} blocks teleported between steps, ${advantage.keptFromEarlierQuanta} answers kept from earlier quanta, ${advantage.involutions} copies proven by involution`)
console.log(`waves: ${[...new Set(steps.map((s) => s.wave))].length}; steps ${(sumMs / 1000).toFixed(1)} s summed, ${(wallMs / 1000).toFixed(1)} s on the wall: speedup ×${wallMs ? (sumMs / wallMs).toFixed(2) : '—'}`)

// The docket: every red step as an open lead with its evidence, accumulated across runs and deduplicated by id.
type NextLead = { id: string; source: string; statement: string; status: 'open'; reason: string; evidence: string; head: string; date: string }
const docket = pub('next-leads.json')
const previous: NextLead[] = readJson(docket, [])
const opened: NextLead[] = stillRed.map((s) => {
  const step = receipt.steps.filter((x) => x.name === s.name).at(-1)!
  const remedy = remediesOf([step.tail]).leads[0]
  return { id: `next-${s.name}-${receipt.head}`, source: `npm run next ${receipt.date}`, statement: `${s.name} is red at ${receipt.head}${remedy?.remedy ? ` — remedy: ${remedy.remedy}` : ' — no remedy learned yet: a lead that teaches the next row'}`, status: 'open', reason: 'a stop is a lead to follow next; stopping is the failure', evidence: step.tail, head: receipt.head, date: receipt.date }
})
if (concurrent) opened.push({ id: `next-concurrent-${receipt.head}-${receipt.date.slice(11, 19).replace(/:/g, '')}`, source: `npm run next ${receipt.date}`, statement: `two next runs wrote docs/public at once (this run beside pid ${concurrent.pid} started ${concurrent.date})`, status: 'open', reason: 'the flow has no queue: a run that starts while another writes the same files can read a half-written artefact; serialise the runs or give each its own output', evidence: `lock ${lockPath}`, head: receipt.head, date: receipt.date })
// time and heat priced: every step over the one-second budget is a waiting gap — listed, never blocking — priced in its own milliseconds over the
// budget plus its CPU milliseconds (textbook_penalty_time_heat_monotone); the slowest and hottest first, each a lead naming the antimatter that
// removes it (a shard split by the shard theorems, or a cache key), replaced every run, so a step back under the budget closes its own lead
const { waitPriceOf, antimatterOf, capacityOf, runWaitPriceOf } = await import('../src/quantum/toolboxes/billing.ts')
const waiting = receipt.steps.filter((x) => x.measures && x.status !== 'skipped').map((x) => ({ step: x.name, measures: x.measures!, price: waitPriceOf(x.measures!) }))
const over = waiting.filter((w) => !w.price.free).sort((a, b) => b.price.coins - a.price.coins)
for (const w of over) opened.push({ id: `next-waiting-${w.step}`, source: `npm run next ${receipt.date}`, statement: `${w.step} took ${w.price.wallMs} ms on the wall and ${w.price.cpuMs} CPU ms (peak ${w.price.rssKb ?? '?'} kB): ${w.price.coins} coin(s) of waiting — antimatter: ${antimatterOf('waiting', 'next:waiting', { step: w.step, measures: w.measures }).says}`, status: 'open', reason: 'a task over one second is slow: waiting is a penalty, priced in time and heat (heat is CPU work, never a die temperature)', evidence: JSON.stringify(w.price), head: receipt.head, date: receipt.date })
console.log(`time and heat: ${over.length} of ${waiting.length} step(s) over the 1 s budget, ${over.reduce((n, w) => n + w.price.coins, 0)} coin(s) of waiting${over.length ? `; the hottest ${over.slice(0, 4).map((w) => `${w.step} ${w.price.coins}`).join(', ')}` : ''}`)
// unused quantum capacity, each measure in its own unit (used + idle = capacity): the cores every step left idle on this machine, always; on a full
// run also the arguments of the tools no example passes, the textbook theorems nothing names or cites, the gates discovery never reached, the
// qubits the quantum examples leave below the simulator's bound and the Shor N never asked; the ten largest idle items are leads, each with the
// antimatter that wires it
const cores = availableParallelism()
// idle cores over the whole run, not per step (steps of one wave share the cores): the run's wall ms times the cores, less the CPU ms of every step
const capacityIn: Parameters<typeof capacityOf>[0] = { cores: [{ step: 'next run', wallMs, cpuMs: waiting.reduce((n, w) => n + w.price.cpuMs, 0), cores }] }
// the full measures run in the background, detached by post-commit (scripts/idle.ts, the machine action idle), never inside a hook: their latest
// recorded state is read here, never computed
const idleRead = (readJson(pub('idle.json')) as { input?: Parameters<typeof capacityOf>[0] } | null)
Object.assign(capacityIn, { ...(idleRead?.input ?? {}), cores: capacityIn.cores })
// the remaining work, from the tree's own records, in ms: the steps this run did not run, each at its last measured run in the receipts; the idle
// items at the audit's measured ms per example; the open leads counted, their cost unmeasured (said so, never guessed)
{
  const history = existsSync(pub('receipts.ndjson')) ? readFileSync(pub('receipts.ndjson'), 'utf8').trim().split('\n').flatMap((l) => { try { return [JSON.parse(l) as { steps?: { name: string; status: string; ms: number; counts?: Record<string, number> }[] }] } catch { return [] } }) : []
  const lastMs = (name: string) => { for (const r of [...history].reverse()) { const st = r.steps?.find((x) => x.name === name && x.status !== 'skipped' && x.ms > 0); if (st) return st.ms } return null }
  const pending = receipt.steps.filter((x) => x.status === 'skipped').map((x) => ({ name: x.name, ms: lastMs(x.name) }))
  const audit = [...history].reverse().flatMap((r) => r.steps ?? []).find((x) => x.name === 'audit' && x.ms > 0 && x.counts?.checks)
  const perExample = audit ? Math.round(audit.ms / Math.max(1, audit.counts!.checks!)) : null
  const idleItems = (idleRead as { top?: unknown[]; counts?: Record<string, { idleNames?: string[] } | null> } | null)?.counts ? Object.values((idleRead as { counts: Record<string, { idleNames?: string[] } | null> }).counts).reduce((n, m) => n + (m?.idleNames?.length ?? 0), 0) : 0
  const leadsOpen = ['next-leads.json', 'purify-leads.json'].reduce((n, f) => n + (readJson(pub(f), []) as { status?: string }[]).filter((l) => l.status === 'open').length, 0)
  capacityIn.remaining = [
    { category: 'pending steps', count: pending.length, ms: pending.every((p) => p.ms === null) ? null : pending.reduce((n, p) => n + (p.ms ?? 0), 0), how: `each at its last measured run in the receipts${pending.some((p) => p.ms === null) ? `; never measured: ${pending.filter((p) => p.ms === null).map((p) => p.name).join(', ')}` : ''}` },
    { category: 'idle items', count: idleItems, ms: perExample === null ? null : idleItems * perExample, how: `the audit's measured ms per check (${perExample ?? '?'} ms) per generated example` },
    { category: 'open leads', count: leadsOpen, ms: null, how: 'counted; no per-lead cost is measured yet' },
  ]
}
const capacity = capacityOf(capacityIn)
for (const g of capacity.top) opened.push({ id: `next-idle-${g.measure}-${g.name}`, source: `npm run next ${receipt.date}`, statement: `${g.name} leaves ${g.tokens} ${g.unit} of quantum capacity idle (${g.measure}) — antimatter: ${g.antimatter.says}`, status: 'open', reason: 'unused quantum capacity is an idle gap: listed, never blocking, priced in its own unit', evidence: JSON.stringify({ measure: g.measure, tokens: g.tokens, unit: g.unit }), head: receipt.head, date: receipt.date })
if (capacity.idlePrice) console.log(`idle priced by the remaining work: ${capacity.idlePrice.says}`)
console.log(`capacity: ${Object.entries(capacity).filter(([k, v]) => ['doors', 'theorems', 'gates', 'cores', 'qubits', 'shor'].includes(k) && v).map(([k, v]) => `${k} ${(v as { percentIdle: number }).percentIdle}% idle`).join(', ')}; ${capacity.gaps.length} idle item(s), the ten largest as leads (${cores} cores)`)
Object.assign(receipt, { capacity: { cores, idlePrice: capacity.idlePrice ? { idleMs: capacity.idlePrice.idleMs, remainingMs: capacity.idlePrice.remainingMs, price: capacity.idlePrice.price, byCategory: capacity.idlePrice.byCategory, scheduledMs: capacity.idlePrice.scheduledMs } : null, measures: Object.fromEntries(Object.entries(capacity).filter(([k, v]) => ['doors', 'theorems', 'gates', 'cores', 'qubits', 'shor'].includes(k) && v).map(([k, v]) => { const m = v as { unit: string; capacity: number; used: number; idle: number; percentIdle: number }; return [k, { unit: m.unit, capacity: m.capacity, used: m.used, idle: m.idle, percentIdle: m.percentIdle }] })) } })
// booked in the RAID when a key is named: a step newly over the budget raises its waiting gap, one back under it annihilates the open one
if (process.env.QPU_APP_KEY) {
  const { penalise, clear, openPenaltiesOf } = await import('./penalties.ts')
  const standing = await openPenaltiesOf()
  const openWaiting = new Map((standing.open ?? []).filter((b) => (b.snapshot?.key ?? '').startsWith('waiting:next:')).map((b) => [b.snapshot!.key!, b]))
  // the idle cores priced by the remaining work: a listed gap of the waiting family raised by every run that leaves cores idle while work is
  // queued, annihilated by the run that leaves none (the time it stood burned)
  // the budget once per run, over every step summed: pieces under the budget never dodge the price (defragmented into one measure)
  const runPrice = runWaitPriceOf(waiting.map((w) => w.measures)), rkey = 'waiting:next:run', ropen = openWaiting.get(rkey)
  if (!runPrice.free && !ropen) await penalise({ rule: 'next:waiting', kind: 'waiting', subject: 'the run', measures: { wallNs: String(runPrice.wallMs * 1e6), cpuUs: runPrice.cpuMs * 1000 }, committer: null, evidence: { key: rkey, head: receipt.head } } as Parameters<typeof penalise>[0])
  const ip = capacity.idlePrice, ikey = 'waiting:next:idle-cores', iopen = openWaiting.get(ikey)
  if (ip && ip.price > 0 && !iopen) await penalise({ rule: 'next:idle', kind: 'waiting', subject: 'idle cores', tokens: ip.price, committer: null, evidence: { key: ikey, idleMs: ip.idleMs, remainingMs: ip.remainingMs, byCategory: ip.byCategory, head: receipt.head } } as Parameters<typeof penalise>[0])
  if (ip && ip.price === 0 && iopen) await clear('next:idle', 'no core idle while work was queued', { key: ikey, head: receipt.head }, 'waiting', iopen.tokens, null)
  for (const w of waiting) {
    const key = `waiting:next:${w.step}`, held = openWaiting.get(key)
    if (!w.price.free && !held) await penalise({ rule: 'next:waiting', kind: 'waiting', subject: w.step, measures: w.measures, committer: spawnSync('git', ['config', 'user.name'], { encoding: 'utf8' }).stdout.trim() || null, evidence: { key, step: w.step, head: receipt.head } } as Parameters<typeof penalise>[0])
    // an invisible step — past the budget with nothing seen in its first second — recorded silently, never printed; visible again, its status clears
    const unseenMs = Math.min(w.price.wallMs, w.measures.firstOutputMs ?? w.price.wallMs), ikey = `invisible:next:${w.step}`, iheld = (standing.open ?? []).find((b) => b.snapshot?.key === ikey)
    if (unseenMs > 1000 && !iheld) await penalise({ rule: 'next:invisible', kind: 'invisible', subject: w.step, measures: { wallNs: String(unseenMs * 1e6), cpuUs: w.measures.cpuUs }, committer: null, evidence: { key: ikey, step: w.step, head: receipt.head } } as Parameters<typeof penalise>[0])
    if (unseenMs <= 1000 && iheld) await clear('next:invisible', `${w.step} visible within its first second`, { key: ikey, step: w.step, head: receipt.head }, 'invisible', iheld.tokens, null)
    if (w.price.free && held) await clear('next:waiting', `${w.step} back under the budget (${w.price.wallMs} ms)`, { key, step: w.step, head: receipt.head }, 'waiting', held.tokens, (held.coin as { debit?: string } | null | undefined)?.debit?.replace(/^coins:/, () => '') ?? null)
  }
}
const leadsNow = [...previous.filter((l) => !/^next-(waiting|idle)-/.test(l.id) && !opened.some((o) => o.id === l.id) && !receipt.steps.some((x) => x.status === 'green' && l.id.startsWith(`next-${x.name}-`))), ...opened]
writeFileSync(docket, JSON.stringify(leadsNow, null, 1) + '\n')
const docketPage = ['---', 'title: Next leads', 'order: 50', '---', '', '# Leads opened by `npm run next`', '', 'Every red step of every run, as an open lead with its evidence. The next run follows them; a lead closes when its step is green again.', '', '| Lead | Opened | Evidence |', '|---|---|---|', ...leadsNow.map((l) => `| ${l.id} | ${l.date} | ${cell(l.evidence)} |`), ''].join('\n')
writeFileSync(join(ROOT, 'docs', 'next-leads.md'), docketPage)

const streamPath = pub('receipts.ndjson')
const prevLine = existsSync(streamPath) ? readFileSync(streamPath, 'utf8').trim().split('\n').filter(Boolean).at(-1) : undefined
const prev: string | null = prevLine ? (JSON.parse(prevLine) as { id?: string }).id ?? null : null
const chained = { ...receipt, prev }
const stamped = { id: uuidOf(JSON.stringify(chained)), sha256: createHash('sha256').update(JSON.stringify(chained)).digest('hex'), ...chained }
writeFileSync(pub('receipt.json'), JSON.stringify(stamped, null, 1) + '\n')
appendFileSync(pub('receipts.ndjson'), JSON.stringify(stamped) + '\n')
const line = `| ${receipt.date} | ${receipt.head} · ${stamped.id} | ${receipt.steps.map((s) => `${s.name}: ${s.status}${s.counts && Object.keys(s.counts).length ? ` ${Object.entries(s.counts).map(([k, v]) => `${k}=${v}`).join(' ')}` : ''}`).join('; ')} |\n`
const receipts = join(ROOT, 'docs', 'receipts.md')
if (!existsSync(receipts)) writeFileSync(receipts, '---\ntitle: Receipts\norder: 49\n---\n\n# Receipts of `npm run next`\n\nOne row per run of the platform on itself: the steps, their status, and the counts read from their output.\n\n| Date | Head | Steps |\n|---|---|---|\n')
appendFileSync(receipts, line)
console.log(red ? `\nnext: ${stillRed.length} step(s) red → ${opened.length} lead(s) opened in docs/next-leads.md; the run fails` : '\nnext: green')
process.exit(red ? 1 : 0)
}
main().catch((e) => { console.error(e); process.exit(1) })
