// The next step is the whole platform running itself: regenerate the docs from the surface, typecheck, test, audit the
// surface through the surface, cross-verify the leads on live public sources, build the site (every live page throws
// at build time if a result drifted), and write the receipt. A red step is not a stop: it is written to the leads
// docket as an open lead with its evidence, the red steps are retried once after the generators have run, and the run
// exits green so nothing downstream stops. `--strict` exits red instead; `--offline` skips the network.
import { spawnSync, spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { appendFileSync, existsSync, readFileSync, writeFileSync, unlinkSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { uuidOf } from '../src/quantum/blocks.ts'

const ROOT = process.cwd()
// text that reaches a page is escaped once: an angle bracket in evidence or a node name is text, never a tag
const cell = (t: string): string => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '\\|').replace(/\n/g, ' ').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')
const offline = process.argv.includes('--offline')
const strict = process.argv.includes('--strict')
const fast = process.argv.includes('--fast') // the pre-commit form: the cheap steps only; the long and the networked wait for the full run
const lake = [`${process.env.HOME}/.elan/bin/lake`, `${process.env.HOME}/.elan/toolchains/leanprover--lean4---v4.33.0/bin/lake`, 'lake'].find((p) => p === 'lake' || existsSync(p))!

// quantum multitasking is the natural speedup: steps that need nothing from each other run at once, in waves; a wave waits for
// the one before it (the generators before the checks, the checks before the readers, the readers before the site)
type Step = { name: string; cmd: string; args: string[]; skip?: string; budgetMs?: number; wave: number; /** a long single task split into short multitasks: n shards at once (QPU_SHARD=i/n), then one merge (QPU_SHARD=merge) */ shards?: number }
const steps: Step[] = [
  { name: 'clay:gen', cmd: 'node', args: ['--import', 'tsx', 'scripts/gen-clay.ts'], wave: 1 },
  { name: 'docs:gen', cmd: 'npx', args: ['tsx', 'scripts/gen-docs.ts'], wave: 1 },
  { name: 'typecheck', cmd: 'npx', args: ['tsc', '--noEmit', '-p', 'tsconfig.json'], wave: 2 },
  { name: 'test', cmd: 'node', args: ['--import', 'tsx', '--test', 'src/quantum/*.test.ts'], budgetMs: 300_000, wave: 2 },
  { name: 'lean', cmd: lake, args: ['build'], wave: 2 },
  { name: 'audit', cmd: 'node', args: ['--import', 'tsx', 'scripts/audit.ts'], wave: 2 },
  { name: 'imagine', cmd: 'node', args: ['--import', 'tsx', 'scripts/imagine.ts'], budgetMs: 300_000, skip: fast ? 'fast' : undefined, wave: 3, shards: 4 }, // a quantum: the leads not yet imagined, as many as fit; the rest next run
  { name: 'discover', cmd: 'node', args: ['--import', 'tsx', 'scripts/discover.ts'], skip: offline ? 'offline' : fast ? 'fast' : undefined, budgetMs: 300_000, wave: 3, shards: 4 }, // a quantum: contracts kept a day, the rest fetched as far as the quantum goes
  { name: 'verify', cmd: 'node', args: ['--import', 'tsx', 'scripts/verify.ts'], skip: offline ? 'offline' : fast ? 'fast' : undefined, budgetMs: 300_000, wave: 3, shards: 4 }, // a quantum: today's results kept by url, the rest fetched as far as the quantum goes
  { name: 'readiness', cmd: 'node', args: ['--import', 'tsx', 'scripts/readiness.ts'], skip: offline ? 'offline' : fast ? 'fast' : undefined, budgetMs: 300_000, wave: 3 },
  { name: 'e2e', cmd: 'node', args: ['--import', 'tsx', 'scripts/e2e.ts'], skip: offline ? 'offline' : fast ? 'fast' : undefined, budgetMs: 300_000, wave: 3 }, // the gate as a repetition code: every combination on every host, decoded by majority; a quantum
  { name: 'repository', cmd: 'node', args: ['--import', 'tsx', 'scripts/repository.ts'], budgetMs: 300_000, wave: 3 }, // always: workspaces, branches, tags, releases; offline the local facts
  { name: 'legal', cmd: 'node', args: ['--import', 'tsx', 'scripts/legal.ts'], budgetMs: 600_000, wave: 3 },
  { name: 'textbook', cmd: 'node', args: ['--import', 'tsx', 'scripts/textbook.ts'], budgetMs: 300_000, wave: 4 }, // always: the examples verified online from the wave; offline the plan // always: cached by inputs, the pure half offline
  { name: 'purify', cmd: 'node', args: ['--import', 'tsx', 'scripts/purify.ts'], wave: 5 },
  { name: 'metrics', cmd: 'node', args: ['--import', 'tsx', 'scripts/metrics.ts'], budgetMs: 120_000, wave: 5 }, // always: the run's artefacts read into one measure
  { name: 'docs:build', cmd: 'npx', args: ['vitepress', 'build', 'docs'], skip: fast ? 'fast' : undefined, wave: 6 },
  { name: 'trunk', cmd: 'node', args: ['--import', 'tsx', 'scripts/trunk.ts'], wave: 7 }, // always: main fast-forwarded locally when green; never pushed
  { name: 'publish', cmd: 'node', args: ['--import', 'tsx', 'scripts/publish.ts'], skip: offline ? 'offline' : fast ? 'fast' : undefined, budgetMs: 300_000, wave: 7 },
]
const LICENSE_LINE = 'CC-BY-NC-ND-4.0 © Tsvetan Rouschev (https://orcid.org/0009-0000-7312-9778); commercial use by licence (ceccec@psg.bg)'
const receipt: { license: string; date: string; head: string; steps: { name: string; status: 'green' | 'red' | 'skipped'; ms: number; tail: string; counts?: Record<string, number> }[] } = {
  license: LICENSE_LINE,
  date: new Date().toISOString(),
  head: spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).stdout.trim(),
  steps: [],
}
// Two runs in one tree write the same files under docs/public; the second is not stopped, it is recorded as a lead of this run.
const lockPath = join(ROOT, 'docs', 'public', 'next.lock')
const alive = (pid: number): boolean => { try { process.kill(pid, 0); return true } catch { return false } }
const concurrent: { pid: number; date: string } | null = (() => { try { const l = JSON.parse(readFileSync(lockPath, 'utf8')) as { pid: number; date: string }; return alive(l.pid) ? l : null } catch { return null } })()
if (concurrent) console.log(`⚠ another next run (pid ${concurrent.pid}, since ${concurrent.date}) is writing the same files; recorded as a lead, this run continues`)
writeFileSync(lockPath, JSON.stringify({ pid: process.pid, date: receipt.date }) + '\n')
// the blocks teleported between this run's steps start empty: a block from an earlier run was computed by earlier code
rmSync(join(ROOT, '.qpu', 'blocks'), { recursive: true, force: true })
process.on('exit', () => { try { const l = JSON.parse(readFileSync(lockPath, 'utf8')) as { pid: number }; if (l.pid === process.pid) unlinkSync(lockPath) } catch { /* already gone */ } })
const spawned = (s: Step, shard?: string): Promise<{ status: number | null; out: string; timedOut: boolean }> => new Promise((resolve) => {
  const child = spawn(s.cmd, s.args, { cwd: ROOT, shell: process.platform === 'win32', env: { ...process.env, FORCE_COLOR: '0', QPU_OFFLINE: offline ? '1' : '', ...(shard ? { QPU_SHARD: shard } : {}) } })
  let out = ''; let timedOut = false
  child.stdout.on('data', (d) => { out += d }); child.stderr.on('data', (d) => { out += d })
  const timer = setTimeout(() => { timedOut = true; child.kill('SIGKILL') }, s.budgetMs ?? 600_000)
  child.on('error', (e) => { clearTimeout(timer); resolve({ status: null, out: out + `\n${e.message}`, timedOut }) })
  child.on('close', (status) => { clearTimeout(timer); resolve({ status, out, timedOut }) })
})
const run = async (s: Step): Promise<boolean> => {
  if (s.skip) { receipt.steps.push({ name: s.name, status: 'skipped', ms: 0, tail: s.skip }); console.log(`· ${s.name}: skipped (${s.skip})`); return true }
  const started = Date.now()
  // short multitasks: the shards run at once, each with its share and its own budget, then the merge; the outputs are read as one
  const r = s.shards && !s.skip ? await (async () => { const parts = await Promise.all(Array.from({ length: s.shards! }, (_, i) => spawned(s, `${i}/${s.shards}`))); const merge = await spawned(s, 'merge'); return { status: parts.every((p) => p.status === 0) && merge.status === 0 ? 0 : (parts.find((p) => p.status !== 0)?.status ?? merge.status), out: [...parts.map((p) => p.out), merge.out].join('\n'), timedOut: parts.some((p) => p.timedOut) || merge.timedOut } })() : await spawned(s)
  if (r.timedOut) console.log(`⏱ ${s.name}: exceeded its budget of ${(s.budgetMs ?? 600_000) / 1000} s and was killed; a hang is a lead, not a stop`)
  const out = r.out
  const ok = r.status === 0 && !r.timedOut
  const counts: Record<string, number> = {}
  for (const [k, re] of Object.entries({ teleportedIn: /teleport: (\d+) blocks from/, blocksLeft: /teleport: (\d+) block\(s\) left/, keptToday: /(\d+) kept from today/, reused: /(\d+) answers kept from today/, imaginedKept: /imagine: (\d+) of \d+ leads kept/, involutions: /\((\d+) teleported by involution/, tests: /ℹ tests (\d+)/, pass: /ℹ pass (\d+)/, fail: /ℹ fail (\d+)/, checks: /(\d+)\/(\d+) checks pass/, jobs: /Build completed successfully \((\d+) jobs\)/, requests: /verify: (\d+) requests, (\d+) reachable/, ready: /readiness: (ready)/, imagined: /(\d+) imagined leads/ })) {
    const m = re.exec(out); if (m) counts[k] = Number(m[1]); if (m && k === 'checks') counts.checksTotal = Number(m[2]); if (m && k === 'requests') counts.reachable = Number(m[2])
  }
  const failingLines = [...new Set(out.split('\n').filter((l) => /^(✖|not ok) /.test(l)))]
  const tail = (failingLines.length ? failingLines.join('\n') + '\n' : '') + out.trim().split('\n').slice(-8).join('\n')
  receipt.steps.push({ name: s.name, status: ok ? 'green' : 'red', ms: Date.now() - started, tail, counts })
  writeFileSync(join(ROOT, 'docs', 'public', 'receipt.json'), JSON.stringify({ ...receipt, provisional: true }, null, 1) + '\n')
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
const docket = join(ROOT, 'docs', 'public', 'next-leads.json')
const previous: NextLead[] = existsSync(docket) ? JSON.parse(readFileSync(docket, 'utf8')) : []
const opened: NextLead[] = stillRed.map((s) => {
  const step = receipt.steps.filter((x) => x.name === s.name).at(-1)!
  return { id: `next-${s.name}-${receipt.head}`, source: `npm run next ${receipt.date}`, statement: `${s.name} is red at ${receipt.head}`, status: 'open', reason: 'a stop is a lead to follow next; stopping is the failure', evidence: step.tail, head: receipt.head, date: receipt.date }
})
if (concurrent) opened.push({ id: `next-concurrent-${receipt.head}-${receipt.date.slice(11, 19).replace(/:/g, '')}`, source: `npm run next ${receipt.date}`, statement: `two next runs wrote docs/public at once (this run beside pid ${concurrent.pid} started ${concurrent.date})`, status: 'open', reason: 'the flow has no queue: a run that starts while another writes the same files can read a half-written artefact; serialise the runs or give each its own output', evidence: `lock ${lockPath}`, head: receipt.head, date: receipt.date })
const leadsNow = [...previous.filter((l) => !opened.some((o) => o.id === l.id)), ...opened]
writeFileSync(docket, JSON.stringify(leadsNow, null, 1) + '\n')
const docketPage = ['---', 'title: Next leads', 'order: 50', '---', '', '# Leads opened by `npm run next`', '', 'Every red step of every run, as an open lead with its evidence. The next run follows them; a lead closes when its step is green again.', '', '| Lead | Opened | Evidence |', '|---|---|---|', ...leadsNow.map((l) => `| ${l.id} | ${l.date} | ${cell(l.evidence).slice(0, 600)} |`), ''].join('\n')
writeFileSync(join(ROOT, 'docs', 'next-leads.md'), docketPage)

const streamPath = join(ROOT, 'docs', 'public', 'receipts.ndjson')
const prevLine = existsSync(streamPath) ? readFileSync(streamPath, 'utf8').trim().split('\n').filter(Boolean).at(-1) : undefined
const prev: string | null = prevLine ? (JSON.parse(prevLine) as { id?: string }).id ?? null : null
const chained = { ...receipt, prev }
const stamped = { id: uuidOf(JSON.stringify(chained)), sha256: createHash('sha256').update(JSON.stringify(chained)).digest('hex'), ...chained }
writeFileSync(join(ROOT, 'docs', 'public', 'receipt.json'), JSON.stringify(stamped, null, 1) + '\n')
appendFileSync(join(ROOT, 'docs', 'public', 'receipts.ndjson'), JSON.stringify(stamped) + '\n')
const line = `| ${receipt.date} | ${receipt.head} · ${stamped.id} | ${receipt.steps.map((s) => `${s.name}: ${s.status}${s.counts && Object.keys(s.counts).length ? ` ${Object.entries(s.counts).map(([k, v]) => `${k}=${v}`).join(' ')}` : ''}`).join('; ')} |\n`
const receipts = join(ROOT, 'docs', 'receipts.md')
if (!existsSync(receipts)) writeFileSync(receipts, '---\ntitle: Receipts\norder: 49\n---\n\n# Receipts of `npm run next`\n\nOne row per run of the platform on itself: the steps, their status, and the counts read from their output.\n\n| Date | Head | Steps |\n|---|---|---|\n')
appendFileSync(receipts, line)
console.log(red ? `\nnext: ${stillRed.length} step(s) red → ${opened.length} lead(s) opened in docs/next-leads.md; the run continues` : '\nnext: green')
process.exit(red && strict ? 1 : 0)
}
main().catch((e) => { console.error(e); process.exit(1) })
