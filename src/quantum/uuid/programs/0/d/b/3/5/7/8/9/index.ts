// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// The one runner of a planned machine action, in the tree: the argument vector the plan returns, spawned with no shell, its output read line by
// line as it arrives (each line handed to the caller at once, so a client that sent a progress token sees the run as it happens) and the whole
// judged into the record the repository tool addresses. next is run here too: the waves of NEXT_STEPS, each door step a child process of this
// file (`step <tool> <json>`) calling the handler as a library (the same code the door serves), each generator writing the path and text its
// door answers, each process step the command the table names; a step past its budget is killed with its process group and recorded red; the
// red steps are retried once after the generators ran; the receipt is the last line, `RECEIPT {json}`, the body of the machine's entry.
import { AFTER_HOOKS, AGENT_CONFIRM_RULES, AGENT_HOOKS } from '../../../../../../../../d/e/a/3/e/d/e/1/index.ts'
import { PROSE, proseFill } from '../../../../../../../../5/9/e/4/9/1/a/4/index.ts'
import { TABLES } from '../../../../../../../../1/2/a/4/3/2/a/8/index.ts'
import { THEOREMS } from '../../../../../../../../3/f/0/e/7/a/6/f/index.ts'
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, readlinkSync, realpathSync, rmSync, statSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { availableParallelism, freemem, homedir, tmpdir, totalmem } from 'node:os'
import { fileURLToPath } from 'node:url'
import { MACHINE_ACTIONS, MACHINE_RUNNER, NEXT_STEPS, forecastTimes, redact, type NextStep } from '../../../../../../../../3/3/0/8/2/1/e/a/index.ts'
import { clock, stamp } from '../../../../../../../../clock/index.ts'
import { canonicalText, uuid } from '../../../../../../../../2/7/1/a/7/6/4/9/index.ts'

export type MachineProgress = { progress: number; total?: number; message: string }
type Run = { status: number | null; stdout: string; stderr: string; ms: number; timedOut: boolean }
const STEP_LINE = /^\s*[✓✗·↻⏱○]\s/
const SELF = fileURLToPath(import.meta.url)
/** lake where elan or Homebrew put it; the table names only `lake`. */
const lakeOf = () => [`${homedir()}/.elan/toolchains/leanprover--lean4---v4.33.0/bin/lake`, `${homedir()}/.elan/bin/lake`, '/opt/homebrew/bin/lake', 'lake'].find((p) => p === 'lake' || existsSync(p))!
const cmdOf = (cmd: string) => (cmd === 'lake' ? lakeOf() : cmd)

/** One command with no shell: its lines streamed, the whole kept, the process group killed at the budget (a grandchild outlived its npx parent). */
export const spawnRun = (cmd: string, args: readonly string[], o: { cwd: string; input?: string | null; budgetMs?: number; /** a variable given as undefined is withheld from the command */ env?: Record<string, string | undefined>; onLine?: (line: string) => void } ): Promise<Run> =>
  new Promise((resolve) => {
    const t0 = clock()
    // git hands a hook its own GIT_DIR and GIT_INDEX_FILE, absolute in a linked worktree: lake runs git inside each package, which would then read
    // this repository for the package's (and write the package's index over this worktree's), so lake is started without them
    const env: Record<string, string | undefined> = { ...process.env, FORCE_COLOR: '0', ...(o.env ?? {}) }
    if (cmd === 'lake') for (const k of Object.keys(env)) if (/^GIT_(DIR|INDEX_FILE|WORK_TREE|COMMON_DIR|PREFIX|OBJECT_DIRECTORY|ALTERNATE_OBJECT_DIRECTORIES)$/.test(k)) delete env[k]
    const child = spawn(cmdOf(cmd), [...args], { cwd: o.cwd, shell: false, detached: process.platform !== 'win32', env })
    let stdout = '', stderr = '', timedOut = false
    const lineOf = (stream: 'stdout' | 'stderr') => { let rest = ''; return (chunk: Buffer) => {
      const s = chunk.toString('utf8'); if (stream === 'stdout') stdout += s; else stderr += s
      const lines = (rest + s).split('\n'); rest = lines.pop() ?? ''
      for (const line of lines) if (line.trim()) o.onLine?.(line)
    } }
    child.stdout.on('data', lineOf('stdout'))
    child.stderr.on('data', lineOf('stderr'))
    const timer = o.budgetMs ? setTimeout(() => { timedOut = true; try { process.kill(-child.pid!, 'SIGKILL') } catch { child.kill('SIGKILL') } }, o.budgetMs) : null
    child.on('error', (e) => { if (timer) clearTimeout(timer); stderr += String(e); resolve({ status: null, stdout, stderr, ms: clock() - t0, timedOut }) })
    child.on('close', (code) => { if (timer) clearTimeout(timer); resolve({ status: code, stdout, stderr, ms: clock() - t0, timedOut }) })
    child.stdin.on('error', () => {}).end(o.input ?? '')
  })

// A door step's arguments resolved in the child: { $file } is that file's text, { $exec } the output of the command over the script text a door answers.
import type { Call } from '../../../../../../../../d/e/7/d/b/7/1/6/index.ts'
import { callEnvelope, headOf, listEnvelope, within } from '../../../../../../../../d/e/7/d/b/7/1/6/index.ts'
const resolveArgs = async (x: unknown, cwd: string, call: Call): Promise<unknown> => {
  if (Array.isArray(x)) return Promise.all(x.map((v) => resolveArgs(v, cwd, call)))
  if (!x || typeof x !== 'object') return x
  const o = x as Record<string, unknown>
  if (typeof o.$file === 'string' && Object.keys(o).length === 1) return readFileSync(join(cwd, o.$file), 'utf8')
  if (o.$device === true && Object.keys(o).length === 1) return readDevice(cwd)
  if (o.$run && typeof o.$run === 'object' && Object.keys(o).length === 1) { const e = o.$run as { cmd: string; args: string[] }; const r = await spawnRun(e.cmd, e.args, { cwd }); return r.stdout + r.stderr }
  // { $lean: true }: every module the Lean UUID programs reach from the root, as { path: text }
  if (o.$lean === true && Object.keys(o).length === 1) return Object.fromEntries((await import('../../../../../../../../lean/index.ts')).leanPrograms().rows.map((row) => [row.source, readFileSync(join(cwd, row.source), 'utf8')]))
  if (o.$exec && typeof o.$exec === 'object' && Object.keys(o).length === 1) {
    const e = o.$exec as { cmd: string; args: string[]; script: { tool: string; arguments: Record<string, unknown>; key: string } }
    const asked = call(e.script.tool, e.script.arguments); if (asked.error) throw new Error(asked.error.message)
    const file = join(tmpdir(), `qpu-${process.pid}-${e.script.key}.lean`); writeFileSync(file, String(asked.result?.structuredContent?.[e.script.key] ?? ''))
    const r = await spawnRun(e.cmd, [...e.args, file], { cwd }); if (r.status !== 0) throw new Error(`${e.cmd} ${e.args.join(' ')} ended with status ${r.status}: ${r.stderr.trim().split('\n').slice(-3).join(' | ')}`)
    return r.stdout
  }
  return Object.fromEntries(await Promise.all(Object.entries(o).map(async ([k, v]) => [k, await resolveArgs(v, cwd, call)])))
}
/** The child of a door or generator step: the handler called as a library, the answer printed as one JSON line, a generator's path and text written. */
// ISO/IEC 4879:2024 3.4.29 quantum memory on the filesystem: each answer the door measured (3.2.16) is written under its content address,
// in a folder named by the code that computed it, so a later process on the same code reads it back instead of computing it again
type Block = { address: string; structured: unknown; widget: string }
const memoryOf = (cwd: string) => {
  const root = join(cwd, 'src/quantum'), code = createHash('sha256')
  for (const f of (readdirSync(root, { recursive: true }) as string[]).filter((f) => /\.(ts|js|json)$/.test(f)).sort()) code.update(f).update(readFileSync(join(root, f)))
  const base = join(cwd, '.qpu', 'memory'), dir = join(base, code.digest('hex'))
  const read = (): Block[] => existsSync(dir) ? readdirSync(dir).flatMap((f) => readFileSync(join(dir, f), 'utf8').split('\n').flatMap((l) => { try { return l ? [JSON.parse(l) as Block] : [] } catch { return [] } })) : []
  const write = (blocks: readonly Block[]) => {
    const lines = blocks.flatMap((b) => { try { return [JSON.stringify(b)] } catch { return [] } })
    if (!lines.length) return
    if (existsSync(base)) for (const old of readdirSync(base)) if (join(base, old) !== dir) rmSync(join(base, old), { recursive: true, force: true })
    mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, `${process.pid}.ndjson`), lines.join('\n'))
  }
  return { read, write }
}

/** The device this runner runs on, read as a step finishes: its identifier kept only as a content address, and what its own sensors report */
const readDevice = async (cwd: string) => {
  const os = await import('node:os'), read = async (cmd: string, args: string[]) => (await spawnRun(cmd, args, { cwd })).stdout
  const raw = existsSync('/etc/machine-id') ? readFileSync('/etc/machine-id', 'utf8').trim() : /IOPlatformUUID" = "([^"]+)"/.exec(await read('ioreg', ['-rd1', '-c', 'IOPlatformExpertDevice']))?.[1] ?? os.hostname()
  const battery = await read('ioreg', ['-rn', 'AppleSmartBattery']), gauge = (k: string) => Number(new RegExp(`"${k}" = (\\d+)`).exec(battery)?.[1]) || undefined
  return { id: uuid(`device\n${raw}`), platform: os.platform(), arch: os.arch(), cpu: os.cpus()[0]?.model ?? '', cores: os.cpus().length, memoryBytes: os.totalmem(), sensors: { load1: os.loadavg()[0], freeMemoryBytes: os.freemem(), uptimeS: os.uptime(), cpuMHz: os.cpus()[0]?.speed, batteryMillivolts: gauge('Voltage'), batteryCycles: gauge('CycleCount') }, at: stamp() }
}

const runStepChild = async (tool: string, argsJson: string, write: boolean, cwd: string, json = false) => {
  const { call, balancerLoad, balancerSnapshot } = await import('../../../../../../../../3/8/5/9/0/2/0/f/index.ts') as { call: Call; balancerLoad: (b: readonly Block[]) => number; balancerSnapshot: (p: { onlyNew?: boolean }) => Block[] }
  const memory = memoryOf(cwd)
  balancerLoad(memory.read())
  const args = await resolveArgs(JSON.parse(argsJson), cwd, call)
  // e2e asks each host once before it replays a single example: a host that does not answer tools/list as JSON-RPC is named
  if (tool === 'e2e') for (const url of new Set((args as { hosts?: string[] }).hosts ?? [])) { const ok = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', accept: PROSE.quantumProcessingMachineRun_accept1 }, body: '{"jsonrpc":"2.0","id":0,"method":"tools/list"}', signal: within(20000) }).then((r) => /json|event-stream/.test(r.headers.get('content-type') ?? ''), () => false); if (!ok) { console.log(JSON.stringify({ error: proseFill(PROSE.quantumProcessingMachineRun_error2, url) })); process.exitCode = 1; return } }
  const r = call(tool, args)
  if (r.error) { console.log(JSON.stringify({ error: r.error.message })); process.exitCode = 1; return }
  let s = r.result?.structuredContent ?? null
  // a door that answers with requests has them fetched, eight at a time, then answers again with them: e2e decodes here, every other door is asked with answers
  if (Array.isArray(s?.requestList) && !(args as { answers?: unknown }).answers) {
    type Asked = { url: string; method: string; accept: string; headers?: Record<string, string>; body?: unknown; timeoutMs?: number }
    const fetchAll = async (requests: Asked[]) => { const list = [...requests], answers: unknown[] = []; await Promise.all(Array.from({ length: 8 }, async () => { for (let q = list.shift(); q; q = list.shift()) { const t0 = performance.now(); try { const res = await fetch(q.url, { method: q.method, headers: { 'content-type': 'application/json', accept: q.accept, ...q.headers }, body: q.body === undefined ? undefined : JSON.stringify(q.body), signal: within(q.timeoutMs ?? 20000) }); answers.push({ ...q, status: res.status, ms: performance.now() - t0, text: await res.text(), etag: res.headers.get('etag') }) } catch (e) { answers.push({ ...q, status: 0, ms: performance.now() - t0, text: String(e) }) } } })); return answers }
    let answers = await fetchAll(s.requestList as Asked[])
    // in this process: the door's wrapper re-serialises e2e's bodies past a string's length
    if (tool === 'e2e') { const d = (await import('../../../../../../../../f/4/1/9/b/9/0/e/index.ts')).decodeE2e(answers as never); s = { phase: 'decoded', ...d.outcomes, combos: d.combos, copies: d.copies, uncorrectableLeads: d.leads.filter((l) => l.id.startsWith('e2e-uncorrectable')).map((l) => l.id).join(' ') } }
    else {
      // a door that answers the answers with requests again says why (retry), is waited for, and is asked once more with what it kept and the new answers
      for (let attempt = 1; ; attempt++) {
        const again = call(tool, { ...(args as object), answers, attempt }); if (again.error) { console.log(JSON.stringify({ error: again.error.message })); process.exitCode = 1; return }
        s = again.result?.structuredContent ?? null
        if (!Array.isArray(s?.requestList) || !Array.isArray(s?.retry) || attempt >= 8) break
        for (const r of s.retry as { says?: string }[]) console.log(`retry ${r.says ?? JSON.stringify(r)}`)
        await new Promise((done) => setTimeout(done, typeof s.waitMs === 'number' ? s.waitMs : 0))
        answers = [...(Array.isArray(s.kept) ? s.kept : []), ...await fetchAll(s.requestList as Asked[])]
      }
      // requests still owed when the attempts ran out are a gate that did not hold
      if (Array.isArray(s?.requestList) && Array.isArray(s?.retry)) process.exitCode = 1
    }
  }

  // a door that names its readList answers again with those files
  if (Array.isArray(s?.readList) && !(args as { files?: unknown }).files) {
    const files = Object.fromEntries((s.readList as string[]).filter((p) => existsSync(join(cwd, p))).map((p) => [p, readFileSync(join(cwd, p), 'utf8')]))
    const again = call(tool, { ...(args as object), files }); if (again.error) { console.log(JSON.stringify({ error: again.error.message })); process.exitCode = 1; return } s = again.result?.structuredContent ?? null
  }
  const wrote: string[] = []
  // a generator writes the path and text it answers, or every file of its files list, and makes every link of its links list (a relative symlink)
  const outputs = [...(s && typeof s.path === 'string' && typeof s.text === 'string' ? [{ path: s.path, text: s.text }] : []), ...(Array.isArray(s?.files) ? s.files : [])] as { path: string; text: string }[]
  if (write) for (const o of outputs) if (typeof o.path === 'string' && typeof o.text === 'string') { const f = join(cwd, o.path); mkdirSync(dirname(f), { recursive: true }); if (!existsSync(f) || readFileSync(f, 'utf8') !== o.text) { writeFileSync(f, o.text); wrote.push(o.path) } }
  if (write) for (const l of (Array.isArray(s?.links) ? s.links : []) as { path: string; target: string }[]) { const p = join(cwd, l.path); mkdirSync(dirname(p), { recursive: true }); let current: string | null = null; try { current = readlinkSync(p) } catch { current = null }; if (current !== l.target) { if (current !== null) unlinkSync(p); if (!existsSync(p)) { symlinkSync(l.target, p); wrote.push(l.path) } } }
  memory.write(balancerSnapshot({ onlyNew: true }))
  const brief = s && typeof s === 'object' ? Object.fromEntries(Object.entries(s).filter(([k, v]) => k !== 'text' && (typeof v !== 'object' || v === null))) : s
  if (write && outputs.length > 1) (brief as Record<string, unknown>).files = outputs.length
  console.log(`${write ? (wrote.length ? `wrote ${wrote.join(', ')}` : 'unchanged') : 'answered'} ${JSON.stringify(json ? s : brief)}`)
  if (s && s.passed === false) process.exitCode = 1
  if (s && s.holds === false) process.exitCode = 1
}

/** The runner's lanes from node:os: the cores scaled by the free share of memory (Supremacy.lanes_pos, lanes_le_cores). */
/** A JSON file read and parsed, null when it is missing or is not JSON: the one reader. */
export const readJson = <T>(path: string): T | null => { try { return JSON.parse(readFileSync(path, 'utf8')) as T } catch { return null } }
export const lanesNow = () => Math.max(1, Math.min(availableParallelism(), Math.ceil((availableParallelism() * freemem()) / totalmem())))

export type Receipt = { date: string; head: string; runner: string; offline: boolean; fast: boolean; lanes: number; steps: { name: string; status: 'green' | 'red' | 'skipped'; ms: number; via: NextStep['via']; tail: string; attempt: number }[]; green: number; red: number; skipped: number; wallMs: number; sumMs: number; speedup: number | null }
/** next: the waves of NEXT_STEPS run at the root, each step a child, the receipt returned and printed as the last line. */
export const runNext = async (o: { cwd: string; offline?: boolean; fast?: boolean; generators?: boolean; only?: readonly string[]; onLine?: (line: string) => void }): Promise<Receipt> => {
  const say = (l: string) => { console.log(l); o.onLine?.(l) }
  const wall0 = clock()
  const lanes = lanesNow()
  const head = (await spawnRun('git', ['rev-parse', '--short', 'HEAD'], { cwd: o.cwd })).stdout.trim()
  // the wildcard step expanded from tools/list: one tool of each toolbox whose schema names selftest, since every tool of a toolbox
  // answers the same toolbox selftest (toolbox.ts defineTool)
  const expand = async (): Promise<NextStep[]> => {
    const out: NextStep[] = []
    for (const s of NEXT_STEPS.filter((n) => !o.only || o.only.includes(n.name))) {
      if (s.tool !== '*') { out.push(s); continue }
      const { handle } = await import('../../../../../../../../3/8/5/9/0/2/0/f/index.ts') as { handle: (m: unknown) => { result?: { tools?: { name: string; inputSchema?: { properties?: Record<string, unknown> }; _meta?: { toolbox?: string } }[] } } }
      const tools = handle(listEnvelope()).result?.tools ?? [], asked = new Set<string>()
      for (const t of tools) { const box = t._meta?.toolbox ?? t.name; if (t.inputSchema?.properties && Object.keys(s.arguments ?? {}).every((k) => k in t.inputSchema!.properties!) && !asked.has(box)) out.push({ ...s, name: `${s.name}:${asked.add(box) && box}`, tool: t.name }) }
    }
    return out
  }
  // a step is a UUID program addressed by itself over what it reads, read as each wave starts: a test file the files its source names (each
  // relative or root-relative string literal that is a file or a directory of the tree, a template literal by the directory before its first
  // substitution, walked through every script it reaches) and the package files; tsc the TypeScript and JSON files; lake the Lean tree; any
  // other step the whole tree. A green answer that asks nothing of the world is kept under that address and read again in 0 seconds
  const lines = async (...a: string[]) => (await spawnRun('git', a, { cwd: o.cwd })).stdout.split('\n').filter(Boolean)
  let blobs = new Map<string, string>()
  const read = async () => {
    blobs = new Map((await lines('ls-files', '-s')).map((l) => [l.slice(l.indexOf('\t') + 1), l.split(' ')[1]!]))
    const loose = [...await lines('diff', '--name-only'), ...await lines('ls-files', '-o', '--exclude-standard')], present = loose.filter((p) => existsSync(join(o.cwd, p)) || !blobs.delete(p))
    const hashed = present.length ? (await spawnRun('git', ['hash-object', '--stdin-paths'], { cwd: o.cwd, input: present.join('\n') })).stdout.split('\n') : []
    present.forEach((p, i) => blobs.set(p, hashed[i]!))
  }
  let under = new Map<string, string[]>(), edges = new Map<string, string[]>(), reads = new Map<string, Set<string>>()
  const index = () => {
    under = new Map(); edges = new Map(); reads = new Map()
    for (const p of blobs.keys()) for (let d = dirname(p); d !== '.'; d = dirname(d)) { const at = under.get(d); if (at) at.push(p); else under.set(d, [p]) }
  }
  const PACKAGE = /^(package\.json|pnpm-lock\.yaml|package-lock\.json|tsconfig[^/]*\.json)$/
  // a script that lists a directory or asks git reads what no literal names, so a step reaching one reads the whole tree
  const LISTS = /readdirSync|opendirSync|globSync|\breaddir\(|\bglob\(|['"`]git['"`]/
  const named = (p: string): string[] => {
    const hit = edges.get(p); if (hit) return hit
    const out = new Set<string>()
    let text = ''; try { text = readFileSync(join(o.cwd, p), 'utf8') } catch { /* a path the index names and the tree does not hold names nothing */ }
    const take = (q: string) => { if (q === '.') { for (const f of blobs.keys()) out.add(f); return true } if (blobs.has(q)) { out.add(q); return true } const files = under.get(q); if (files) { for (const f of files) out.add(f); return true } return false }
    if (LISTS.test(text)) take('.')
    for (const re of [/'([^'\\\n]+)'/g, /"([^"\\\n]+)"/g, /`([^`\\]+)`/g]) for (const m of text.matchAll(re)) {
      let lit = m[1]!
      if (lit.includes('${')) { lit = lit.slice(0, lit.indexOf('${')); if (!lit.includes('/')) continue; lit = lit.slice(0, lit.lastIndexOf('/') + 1) }
      if (!lit || lit === '.' || lit.length > 300 || /\s/.test(lit)) continue
      const q = join(lit.startsWith('.') ? dirname(p) : '.', lit.replace(/^\/+/, '')).replace(/\/+$/, '') || '.'
      if (q.startsWith('..')) continue
      void (take(q) || take(`${q}.ts`) || take(q.replace(/\.js$/, '.ts')) || take(join(q, 'index.ts')))
    }
    const list = [...out]; edges.set(p, list); return list
  }
  const closure = (entry: string) => {
    const hit = reads.get(entry); if (hit) return hit
    const out = new Set<string>([entry, ...[...blobs.keys()].filter((p) => PACKAGE.test(p))]), todo = [entry]
    while (todo.length) { const p = todo.pop()!; if (/\.[cm]?[jt]sx?$/.test(p)) for (const q of named(p)) if (!out.has(q)) { out.add(q); todo.push(q) } }
    reads.set(entry, out); return out
  }
  const entryOf = new Map<string, string>()
  const readsOf = (s: NextStep): ((p: string) => boolean) => {
    const entry = entryOf.get(s.name)
    if (entry) { const set = closure(entry); return (p) => set.has(p) }
    if (s.cmd === 'lake') return (p) => /\.lean$|^lake/.test(p)
    if (s.via === 'process' && s.cmd === 'npx' && s.args?.[0] === 'tsc') return (p) => /\.[cm]?tsx?$|\.json$/.test(p) || PACKAGE.test(p)
    return () => true
  }
  const kept = (s: NextStep) => { const want = readsOf(s); return join(o.cwd, '.qpu', 'receipts', uuid(JSON.stringify(s) + [...blobs].filter(([p]) => want(p)).sort().join('\n')) + '.json') }
  // a package script `node --test <globs>` is one step for each file its globs match, so a test file whose reads did not change reads its receipt
  const perFile = (s: NextStep): NextStep[] => {
    if (s.via !== 'process' || s.cmd !== 'npm' || !s.args?.length) return [s]
    const name = s.args[0] === 'test' && s.args.length === 1 ? 'test' : s.args[0] === 'run' && s.args.length === 2 ? s.args[1]! : ''
    const script = readJson<{ scripts?: Record<string, string> }>(join(o.cwd, 'package.json'))?.scripts?.[name] ?? ''
    const words = [...script.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map((m) => m[1] ?? m[2] ?? m[3]!)
    if (words[0] !== 'node' || words[1] !== '--test' || words.length < 3 || words.slice(2).some((w) => w.startsWith('-'))) return [s]
    const globs = words.slice(2).map((g) => new RegExp(`^${g.split(/(\*\*\/|\*)/).map((t) => (t === '**/' ? '(?:.*/)?' : t === '*' ? '[^/]*' : t.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))).join('')}$`))
    const files = [...blobs.keys()].filter((p) => globs.some((g) => g.test(p))).sort()
    if (!files.length) return [s]
    return files.map((f) => { entryOf.set(`${s.name}:${f}`, f); return { ...s, name: `${s.name}:${f}`, cmd: process.execPath, args: ['--test', f] } })
  }
  await read(); index()
  const steps = (await expand()).filter((s) => !o.generators || s.via === 'generator' || s.name === 'lean').flatMap(perFile)
  const receipt: Receipt = { date: stamp(), head, runner: MACHINE_RUNNER, offline: o.offline === true, fast: o.fast === true, lanes, steps: [], green: 0, red: 0, skipped: 0, wallMs: 0, sumMs: 0, speedup: null }
  const run = async (s: NextStep, attempt: number): Promise<boolean> => {
    const skip = s.needs === 'online' && o.offline ? 'offline' : s.long && o.fast ? 'fast' : null
    if (skip) { receipt.steps.push({ name: s.name, status: 'skipped', ms: 0, via: s.via, tail: skip, attempt }); say(`· ${s.name}: ${skip}`); return true }
    const t0 = clock(), at = kept(s)
    if (existsSync(at)) { receipt.steps.push({ ...readJson<any>(at), attempt }); say(`✓ ${s.name} (receipt ${at.slice(-41, -5)})`); return true }
    const r = s.via === 'process' ? await spawnRun(s.cmd!, s.args!, { cwd: o.cwd, budgetMs: s.budgetMs }) : await spawnRun(process.execPath, [SELF, 'step', s.tool!, JSON.stringify(s.arguments ?? {}), ...(s.via === 'generator' ? ['--write'] : [])], { cwd: o.cwd, budgetMs: s.budgetMs })
    const out = `${r.stdout}${r.stderr ? `\n${r.stderr}` : ''}`, ok = r.status === 0 && !r.timedOut
    const failing = [...new Set(out.split('\n').filter((l) => /^(✖|✗|not ok) |error TS\d+|^\s*AssertionError|^error:/.test(l)))]
    const tail = redact((failing.length ? failing.join('\n') + '\n' : '') + (r.timedOut ? `⏱ killed at its budget of ${s.budgetMs / 1000} s\n` : '') + out.trim().split('\n').slice(-8).join('\n'), o.cwd, homedir())
    receipt.steps.push({ name: s.name, status: ok ? 'green' : 'red', ms: clock() - t0, via: s.via, tail, attempt })
    if (ok && s.needs !== 'online') { mkdirSync(dirname(at), { recursive: true }); writeFileSync(at, JSON.stringify({ name: s.name, status: 'green', ms: clock() - t0, via: s.via, tail: `${tail}\nkept ${stamp()}`, device: await readDevice(o.cwd) })) }
    say(`${ok ? '✓' : r.timedOut ? '⏱' : '✗'} ${s.name} (${((clock() - t0) / 1000).toFixed(1)} s)`)
    if (!ok) for (const l of tail.split('\n').slice(0, 6)) say(`  ${l}`)
    return ok
  }
  const pool = async <T,>(items: readonly T[], fn: (x: T) => Promise<boolean>, n: number) => { const out: boolean[] = new Array(items.length); let i = 0; await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]!) } })); return out }
  const failed: NextStep[] = []
  for (const wave of [...new Set(steps.map((s) => s.wave))].sort((a, b) => a - b)) {
    await read(); index()
    const inWave = steps.filter((s) => s.wave === wave), results = await pool(inWave, (s) => run(s, 1), lanes)
    for (const [i, ok] of results.entries()) if (!ok) failed.push(inWave[i]!)
  }
  for (const s of failed) { say(`↻ retry ${s.name}`); await run(s, 2) }
  // the last attempt of each step decides
  const last = Object.values(Object.fromEntries(receipt.steps.map((s) => [s.name, s])))
  receipt.green = last.filter((s) => s.status === 'green').length; receipt.red = last.filter((s) => s.status === 'red').length; receipt.skipped = last.filter((s) => s.status === 'skipped').length
  receipt.wallMs = clock() - wall0; receipt.sumMs = receipt.steps.reduce((n, s) => n + s.ms, 0); receipt.speedup = receipt.wallMs ? Number((receipt.sumMs / receipt.wallMs).toFixed(2)) : null
  say(proseFill(PROSE.quantumProcessingMachineRun_s3, receipt.green, receipt.red, receipt.skipped, (receipt.wallMs / 1000).toFixed(1), receipt.lanes, receipt.speedup))
  console.log(`RECEIPT ${JSON.stringify(receipt)}`)
  return receipt
}

type Plan = { allowed: boolean; action: string; command: { cmd: string; args: string[] }; input?: string | null; worktree?: string | null; decision?: { says?: string } | null; refused?: string }
/** Runs an asked action: planned by the repository tool's rules against the facts the caller read (the last receipt, the approval), run with no
 *  shell, each line streamed, then recorded; an action the rules refuse answers its plan and runs nothing; next runs its waves here. */
export const runMachine = async (args: Record<string, unknown>, cwd: string, onProgress: (p: MachineProgress) => void = () => {}, o: { facts?: Record<string, unknown>; times?: Record<string, readonly number[]> } = {}) => {
  const { caller } = await import('../../../../../../../../3/8/5/9/0/2/0/f/index.ts') as { caller: (name: string) => (a: Record<string, unknown>) => any }
  const repository = caller('repository')
  const plan = repository({ machine: { plan: { ...args, facts: o.facts ?? {} } } }) as Plan
  if (!plan.allowed) return { plan, answer: plan }
  const at = plan.worktree ? join(cwd, plan.worktree) : cwd
  const eta = forecastTimes(o.times?.[plan.action] ?? [])
  let progress = 0
  const t0 = clock()
  let receipt: Receipt | null = null, run: Run
  if (plan.action === 'next' || plan.action === 'regenerate') {
    const flags = plan.command.args
    const lines: string[] = []
    receipt = await runNext({ cwd: at, offline: flags.includes('--offline'), fast: flags.includes('--fast'), generators: plan.action === 'regenerate', onLine: (l) => { lines.push(l); if (STEP_LINE.test(l)) onProgress({ progress: ++progress, message: l }) } })
    run = { status: receipt.red ? 1 : 0, stdout: lines.join('\n'), stderr: '', ms: clock() - t0, timedOut: false }
  } else run = await spawnRun(plan.command.cmd, plan.command.args, { cwd: at, input: plan.input ?? null, onLine: (l) => onProgress({ progress: ++progress, message: l }) })
  const record = repository({ machine: { record: { action: plan.action, command: plan.command, status: run.status, stdout: run.stdout, stderr: run.stderr, ms: run.ms, root: at, home: homedir() } } }) as { says: string; ok: boolean; redacted: number; entry: { id: string; kind: string; from: string; body: Record<string, unknown>; sha256: string } }
  if (receipt) record.entry.body = { ...record.entry.body, receipt }
  // the verdict alone, read from the redacted output: each gate's line, each hook's decision and each red step, once each and whole, as the record holds it,
  // so a harness that repeats a commit or a push reads a few hundred bytes where the record holds tens of thousands; each line is held once, by
  // the record, and kept by the filter (CirqBridge.brief_sound)
  const brief = [...new Set(String(record.entry.body.output ?? '').split(/\n|\\n/).map((l) => l.trim()).filter((l) => /^([✓✗?] [a-z-]+:|hook [a-z-]+:|RED STEP)/.test(l)))]
  return { plan, record, answer: { plan: { action: plan.action, command: plan.command, decision: plan.decision?.says ?? null }, eta, brief, record: { says: record.says, ok: record.ok, redacted: record.redacted, entry: record.entry }, ...(receipt ? { receipt: { green: receipt.green, red: receipt.red, skipped: receipt.skipped, wallMs: receipt.wallMs, red_steps: receipt.steps.filter((s) => s.status === 'red').map((s) => s.name) } } : {}) } }
}

/** The local Worker the e2e step replays against: kept when it answers on :3000, else started and stopped after. */
const serveLocal = async (cwd: string) => {
  const answers = async () => { try { return (await fetch('http://localhost:3000/api/mcp', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: '{"jsonrpc":"2.0","id":1,"method":"tools/list"}', signal: within(5000) })).ok } catch { return false } }
  if (await answers()) return null
  const child = spawn('npm', ['run', '-s', 'dev'], { cwd, detached: true, stdio: 'ignore' })
  for (let i = 0; i < 90 && !(await answers()); i++) await new Promise((r) => setTimeout(r, 1000))
  return () => { try { process.kill(-child.pid!, 'SIGTERM') } catch { /* gone */ } }
}

/** The staged tree: the index (the one git hands the hook in GIT_INDEX_FILE, a commit by pathspec's own) checked out into a directory of its
 *  own whose git is the repository's, the untracked tools (node_modules, .lake, .qpu) linked into it entry by entry, a link into the tree itself
 *  turned to the copy, and the command run there; so what decides reads exactly what the commit will hold, and one session's unstaged work
 *  never decides another's commit. What the command stages there (a generator's output) is in the index already; it is copied to the working
 *  tree where that file held no unstaged edit of its own, and left as it was where it did. The directory is removed after. */
const inStagedTree = async (cwd: string, cmd: string, args: readonly string[], onLine?: (line: string) => void): Promise<Run> => {
  // a relative GIT_INDEX_FILE or GIT_DIR names a file under the repository; resolved here so the copy reads the same index
  const env = Object.fromEntries((['GIT_INDEX_FILE', 'GIT_DIR'] as const).flatMap((k) => { const v = process.env[k]; return v && !isAbsolute(v) ? [[k, resolve(cwd, v)]] : [] }))
  const git = async (a: string[], input?: string) => { const r = await spawnRun('git', a, { cwd, env, input }); if (r.status !== 0) throw new Error(`git ${a[0]} ended with status ${r.status}: ${r.stderr.trim()}`); return r.stdout }
  const indexed = async () => new Map((await git(['ls-files', '-s', '-z'])).split('\0').filter(Boolean).map((l) => [l.slice(l.indexOf('\t') + 1), l.split(' ')[1]!] as const))
  const gitDir = (await git(['rev-parse', '--absolute-git-dir'])).trim(), before = await indexed()
  const dir = mkdtempSync(join(tmpdir(), 'qpu-staged-')), root = realpathSync(cwd)
  const inside = (p: string, root: string) => p === root || p.startsWith(root + sep)
  // each entry a link to the tool's own; a scope (@x) a directory of links; an entry whose real path is in the tree outside the tool, the copy's
  const link = (top: string, from: string, to: string) => {
    mkdirSync(to, { recursive: true })
    for (const e of readdirSync(from, { withFileTypes: true })) {
      const at = join(from, e.name)
      if (e.name.startsWith('@') && e.isDirectory()) { link(top, at, join(to, e.name)); continue }
      let real = at; try { real = realpathSync(at) } catch { /* a dangling link stays as it is */ }
      symlinkSync(inside(real, root) && !inside(real, top) ? join(dir, relative(root, real)) : at, join(to, e.name))
    }
  }
  try {
    await git(['checkout-index', '--all', `--prefix=${dir}${sep}`])
    writeFileSync(join(dir, '.git'), `gitdir: ${gitDir}\n`)
    for (const name of ['node_modules', '.lake', '.qpu']) { const top = join(cwd, name); if (existsSync(top)) link(realpathSync(top), top, join(dir, name)) }
    // the command finds the repository through the copy's .git and is told the index by name; git's own variables are withheld from it, because a
    // tool it runs that keeps repositories of its own (Lake, in .lake/packages) would read this repository in their place and delete what it took for changed
    const index = process.env.GIT_INDEX_FILE ? resolve(cwd, process.env.GIT_INDEX_FILE) : undefined
    const r = await spawnRun(cmd, args, { cwd: dir, env: { GIT_DIR: undefined, GIT_INDEX_FILE: undefined, GIT_WORK_TREE: undefined, QPU_STAGED_INDEX: index, QPU_STAGED_AT: realpathSync(dir), QPU_STAGED_FROM: cwd }, onLine })
    const moved = [...(await indexed())].filter(([p, blob]) => before.get(p) !== blob && lstatSync(join(dir, p), { throwIfNoEntry: false })?.isFile())
    const present = moved.filter(([p]) => existsSync(join(cwd, p)))
    const hashed = present.length ? (await git(['hash-object', '--stdin-paths'], present.map(([p]) => p).join('\n'))).split('\n') : []
    const held = new Map(present.map(([p], i) => [p, hashed[i]!]))
    for (const [p] of moved) if ((held.get(p) ?? null) === (before.get(p) ?? null)) { mkdirSync(dirname(join(cwd, p)), { recursive: true }); copyFileSync(join(dir, p), join(cwd, p)) }
    return r
  } finally { rmSync(dir, { recursive: true, force: true }) }
}

/** The index this repository's own git reads in a hook: the one the commit holds, named by the staged run for its copy alone, so a runner at work
 *  on any other tree reads that tree's own; git's own where none is named. */
const indexEnv = (cwd: string) => (process.env.QPU_STAGED_INDEX && process.env.QPU_STAGED_AT === realpathSync(cwd) ? { GIT_INDEX_FILE: process.env.QPU_STAGED_INDEX } : undefined)

/** The fakes the table names, found in the tracked tree: each finder is one git command over its paths, and what a kernel theorem or the
 *  finder's standing list holds is no finding. The hooks decide by them, the `fakes` action prints them, and the deploy runs that action first. */
const findFakes = async (cwd: string): Promise<string[]> => {
  const held = new Set<string>(THEOREMS.map((t) => t.key)), git = async (...a: string[]) => (await spawnRun('git', a, { cwd, env: indexEnv(cwd) })).stdout.trim()
  return (await Promise.all(TABLES.FAKES.map(async (k) => [...new Set((await git(...k.git, '--', ...k.paths)).split('\n'))].filter((l) => l && !('standing' in k && (held.has(l) || (k.standing as readonly string[]).includes(l)))).map((l) => `${k.fake}: ${l}`)))).flat()
}

/** A git hook as the client of its workflow (repository { workflow }): its steps walked as the door answers them (next run here, a command spawned,
 *  the generated files compared before they are staged), the facts read (the receipt, the staged diff of the hand-written roots, the workflow files,
 *  the message, the packed package, the gate's decoding) and the decision obeyed: a refused rule or a red step ends the hook with status 1. */
const GENERATED = /^\/\/ generated by |(automatically|generated) by payload|generated by configure \{/im
const runHook = async (name: string, rest: readonly string[], cwd: string) => {
  // the workflow before a commit decides on the staged tree alone: the hook runs itself again in a checkout of the index, and obeys that run
  if (name === 'pre-commit' && !process.env.QPU_STAGED_FROM) return (await inStagedTree(cwd, process.execPath, [MACHINE_RUNNER, 'hook', name, ...rest], (l) => console.log(l))).status === 0 ? 0 : 1
  const { call } = await import('../../../../../../../../3/8/5/9/0/2/0/f/index.ts') as { call: Call }, { LITERAL_ROOTS } = await import('../../../../../../../../5/b/3/0/7/9/e/2/index.ts')
  const ask = (a: Record<string, unknown>) => { const r = call('repository', a); if (r.error) throw new Error(r.error.message); return r.result!.structuredContent }
  const git = async (...a: string[]) => (await spawnRun('git', a, { cwd, env: indexEnv(cwd) })).stdout.trim()
  // a workflow after the act reports through the door, so its door is asked for; the others run here, offline
  const after = (AFTER_HOOKS as readonly string[]).includes(name)
  const w = ask({ workflow: name, offline: !after }).workflow as { steps: { id: string; kind: string; detach?: boolean; cmd?: string; args?: string[]; files?: string[] }[] }
  const facts: Record<string, unknown> = { branch: await git('branch', '--show-current') }
  // first and fast: a rule the door marks first is decided before any step runs, and a workflow it refuses runs none
  const first = after ? [] : (ask({ workflow: name, facts }).decision as { rules: { rule: string; first?: boolean; holds: boolean | null; evidence: string }[] }).rules.filter((r) => r.first && r.holds === false)
  if (first.length) { for (const r of first) console.log(`✗ ${r.rule}: ${r.evidence}`); console.log(`hook ${name}: refused first: ${first.map((r) => r.rule).join(', ')}`); return 1 }
  let red = false
  for (const s of w.steps) {
    if (red || s.detach || (s.kind !== 'run' && s.kind !== 'stage')) continue
    if (s.kind === 'stage') {
      // a changed file whose head names its generator is staged with the commit
      const changed = (await git('diff', '--name-only')).split('\n').filter((p) => p && existsSync(join(cwd, p)))
      const written = changed.filter((p) => GENERATED.test(headOf(readFileSync(join(cwd, p), 'utf8'))))
      const files = [...new Set([...(s.files ?? []).filter((p) => existsSync(join(cwd, p))), ...written])]; if (files.length) await git('add', '-u', '--', ...files)
      facts.automated = { drifted: [] as string[], staged: written }
      continue
    }
    if (s.args?.[1] === 'next') { const r = await runNext({ cwd, offline: s.args.includes('--offline'), fast: s.args.includes('--fast') }); facts.receipt = r; red = r.red > 0; continue }
    const served = s.id === 'e2e' ? await serveLocal(cwd) : null
    const r = await spawnRun(s.cmd!, s.args ?? [], { cwd, onLine: (l) => console.log(l) }); red = r.status !== 0
    served?.()
    if (s.id === 'e2e') { const m = /\{.*\}\s*$/.exec(r.stdout.trim().split('\n').pop() ?? ''); facts.e2e = m ? JSON.parse(m[0]) : null }
  }
  const flows = join(cwd, '.github/workflows')
  facts.workflows = existsSync(flows) ? Object.fromEntries(readdirSync(flows).filter((f) => /\.ya?ml$/.test(f)).map((f) => [`.github/workflows/${f}`, readFileSync(join(flows, f), 'utf8')])) : null
  facts.fakes = await findFakes(cwd)
  if (name === 'commit-msg') facts.message = readFileSync(rest[0]!, 'utf8')
  if (name === 'pre-commit') {
    const diff = await git('diff', '--cached', '-U0', '--no-color', '--no-renames', '--', ...LITERAL_ROOTS), generated: string[] = []
    for (const f of [...diff.matchAll(/^\+\+\+ b\/(.+)$/gm)].map((m) => m[1]!)) if (GENERATED.test(headOf(await git('show', `:${f}`)))) generated.push(f)
    // a merge adds no file the merged branch already holds: those paths are named, so a rule reading additions reads only this commit's own
    const added = (await git('diff', '--cached', '--name-only', '--diff-filter=A', '--no-renames', '--', ...LITERAL_ROOTS)).split('\n').filter(Boolean)
    const merged = added.length && (await git('rev-parse', '-q', '--verify', 'MERGE_HEAD')) ? (await git('ls-tree', '-r', '--name-only', 'MERGE_HEAD', '--', ...added)).split('\n').filter(Boolean) : []
    // a file this commit only moves is held already, under its old path
    const moved = (await git('diff', '--cached', '--name-status', '--find-renames', '--diff-filter=R', '--', ...LITERAL_ROOTS)).split('\n').flatMap((l) => { const [, , to] = l.split('\t'); return to ? [to] : [] })
    const parents = [...merged, ...moved]
    facts.staged = { diff, generated, ...(parents.length ? { parents } : {}) }
    // every tool call imprinted: each example and each tool's own call is asked once, the answers that took a second or more are kept under
    // their addresses in the memory of this code, and all are asked again; the slowest read is the time the rule folded reads
    const kernel = await import('../../../../../../../../3/8/5/9/0/2/0/f/index.ts') as unknown as { handle: (m: object) => unknown; balancerLoad: (b: readonly Block[]) => number; balancerSnapshot: (p: { onlyNew?: boolean }) => Block[] }
    const { EXAMPLES } = await import('../../../../../../../../9/d/4/f/e/4/4/2/index.ts'), memory = memoryOf(cwd), slow = new Set<string>()
    kernel.balancerLoad(memory.read())
    const tools = ((await kernel.handle(listEnvelope(undefined, 0))) as { result: { tools: { name: string }[] } }).result.tools
    const asked = [...EXAMPLES.map((e) => [e.tool, e.arguments] as const), ...tools.map((t) => [t.name, {}] as const)]
    const time = async () => { let slowest = 0; for (const [tool, args] of asked) { const t0 = performance.now(); await kernel.handle(callEnvelope(tool, args, 0)); const ms = performance.now() - t0; if (ms >= 1000) slow.add(uuid(`${tool}${canonicalText(args)}`)); slowest = Math.max(slowest, ms) } return slowest }
    const computeMs = Math.round(await time())
    memory.write(kernel.balancerSnapshot({ onlyNew: true }).filter((b) => slow.has(b.address)))
    const readMs = Math.round(await time())
    facts.calls = { asked: asked.length, computeMs, readMs, seconds: Math.floor(readMs / 1000) }
  }
  if (name === 'pre-push') {
    const dir = join(cwd, 'src/quantum'), pkg = readJson<any>(join(dir, 'package.json')), packed = JSON.parse((await spawnRun('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: dir })).stdout || '[]')[0]?.files?.map((f: { path: string }) => `./${f.path}`) ?? null
    facts.npm = { name: pkg.name, version: pkg.version, license: pkg.license, description: pkg.description, exports: pkg.exports, packed }
  }
  // a push the commit's hook started carries the commit's context: the hook before the push is handed it with the commit and branch it is for
  if (name === 'pre-push' && process.env.QPU_CONTEXT) facts.context = { given: process.env.QPU_CONTEXT, head: await git('rev-parse', 'HEAD'), branch: facts.branch }
  type Decision = { allowed: boolean; says?: string; rules: { rule: string; holds: boolean | null; evidence: string }[] }
  // a workflow after the act reports it to the door: the commit, and for a push every remote-tracking ref that moved (old, new, ref, as git hands them over)
  if (after) {
    facts.commit = { head: await git('rev-parse', 'HEAD'), subject: await git('log', '-1', '--format=%s') }
    if (name === 'post-push') facts.pushed = Array.from({ length: Math.floor(rest.length / 3) }, (_, i) => ({ from: rest[3 * i]!, to: rest[3 * i + 1]!, ref: rest[3 * i + 2]! }))
  }
  const d = ask({ workflow: name, facts }).decision as Decision
  for (const r of d.rules) console.log(`${r.holds === true ? '✓' : r.holds === false ? '✗' : '?'} ${r.rule}: ${r.evidence}`)
  console.log(`hook ${name}: ${after ? 'reported' : d.allowed && !red ? 'allowed' : 'refused'}${d.says ? `: ${d.says}` : ''}`)
  // one pipeline: the hook after a stage starts the next, handing it this stage's context; a rule that does not hold, a detached head or QPU_HOLD starts nothing
  const branch = String(facts.branch ?? ''), chain = w.steps.find((s) => s.detach && (s.id === 'push' || s.id === 'ship'))
  if (after && chain && branch && !process.env.QPU_HOLD && d.rules.every((r) => r.holds !== false)) {
    const { pipelineContexts } = await import('../../../../../../../../1/3/2/6/0/0/3/e/index.ts'), head = await git('rev-parse', 'HEAD'), contexts = pipelineContexts(head, branch)
    if (chain.id === 'push') {
      console.log(`context commit ${contexts.commit.address}`)
      const pushed = await spawnRun(chain.cmd!, chain.args ?? [], { cwd, env: { QPU_CONTEXT: contexts.commit.address }, onLine: (l) => console.log(l) })
      console.log(`chain push: ${pushed.status === 0 ? 'pushed' : `exit ${pushed.status}`}`)
    } else if (branch !== 'main' && rest.some((x, i) => i % 3 === 2 && x === `refs/remotes/origin/${branch}` && rest[i - 1] === head)) {
      // this push moved the branch to this commit: its pull request is opened where none is and the branch is ahead of main
      const open = await spawnRun('gh', ['pr', 'list', '--head', branch, '--state', 'open', '--json', 'url', '--jq', '.[0].url'], { cwd }), ahead = Number(await git('rev-list', '--count', `origin/main..${head}`))
      console.log(`context push ${contexts.push.address}`)
      if (open.status === 0 && open.stdout.trim()) console.log(`chain ship: ${open.stdout.trim()}`)
      else if (open.status === 0 && ahead > 0) {
        const body = `${await git('log', '-1', '--format=%b')}\n\ncontext: ${contexts.ship.address} (ship) ← ${contexts.push.address} (push) ← ${contexts.commit.address} (commit)`
        const made = await spawnRun(chain.cmd!, [...(chain.args ?? []), '--head', branch, '--title', await git('log', '-1', '--format=%s'), '--body', body], { cwd })
        console.log(`chain ship: ${made.status === 0 ? made.stdout.trim().split('\n').pop() : `exit ${made.status} ${made.stderr.trim().split('\n').pop()}`}`)
      }
    }
  }
  // the act has already happened: a workflow after it reports and never refuses
  return !after && (red || !d.allowed) ? 1 : 0
}

/** An agent hook as the client of its workflow: the call the harness hands over on stdin (the tool, the path a write names, the session's transcript)
 *  and what git and that transcript measure (the milliseconds since a commit last landed, the bytes the session has written) are the facts; the
 *  decision is printed as the harness reads it: deny where a rule refuses, ask where every refused rule is one the owner confirms, nothing where all hold. */
const runAgentHook = async (name: string, cwd: string) => {
  const { call } = await import('../../../../../../../../3/8/5/9/0/2/0/f/index.ts') as { call: Call }
  const asked = JSON.parse(readFileSync(0, 'utf8') || '{}') as { hook_event_name?: string; tool_name?: string; tool_input?: { file_path?: string; notebook_path?: string }; transcript_path?: string }
  const git = async (at: string, ...a: string[]) => (await spawnRun('git', a, { cwd: at })).stdout.trim()
  const path = asked.tool_input?.file_path ?? asked.tool_input?.notebook_path, file = path === undefined ? null : resolve(cwd, path)
  // where a write lands: in this tree, in another repository (its own court decides there), or outside every repository
  const held = (dir: string): string => (existsSync(dir) || dir === dirname(dir) ? dir : held(dirname(dir)))
  const writes = file === null ? null : file.startsWith(cwd + sep) ? 'tree' : (await git(held(dirname(file)), 'rev-parse', '--show-toplevel')) ? 'repository' : 'outside'
  const size = (p: string): number => { try { const s = statSync(p); return s.isDirectory() ? readdirSync(p).reduce((n, f) => n + size(join(p, f)), 0) : s.size } catch { return 0 } }
  const transcript = asked.transcript_path ?? null
  const facts = { tool: { name: asked.tool_name ?? '', writes }, landed: { ms: clock() - 1000 * Number(await git(cwd, 'log', '-1', '--format=%ct')), bytes: transcript ? size(transcript) + size(transcript.replace(/\.jsonl$/, '')) : 0 } }
  const r = call('repository', { workflow: name, facts }); if (r.error) throw new Error(r.error.message)
  const d = r.result!.structuredContent.decision as { allowed: boolean; violated: string[]; unknown: string[]; rules: { rule: string; holds: boolean | null; evidence: string }[] }
  if (!d.allowed) console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: asked.hook_event_name, permissionDecision: d.unknown.length === 0 && d.violated.every((rule) => (AGENT_CONFIRM_RULES as readonly string[]).includes(rule)) ? 'ask' : 'deny', permissionDecisionReason: d.rules.filter((x) => x.holds !== true).map((x) => `${x.rule}: ${x.evidence}`).join('; ') } }))
  return 0
}

// Work that was done by hand becomes the runner's own. settle: the index, the generators and the seed run in rounds until the tree they
// write stops changing, then the check. sync: the default branch is fetched and this branch moved forward to it, only by fast-forward.
// ratchet: the Lean library is built and the meaning gate writes its list again. intake: the work kept outside the tree is taken in
// (runIntake below).
const BASE_BRANCH = 'main'
const SETTLE = { rounds: 4, steps: [['lake', ['run', 'index']], [process.execPath, [MACHINE_RUNNER, 'next', '--generators']], ['lake', ['run', 'seed']]] as const, check: ['lake', ['run', 'check']] as const }
const shown = (cmd: string, args: readonly string[]) => [cmd === process.execPath ? 'node' : cmd, ...args].join(' ')
/** Where the device's own reading starts in a file the build writes: what follows it differs at every run, so nothing compares it. */
export const HARDWARE_MARK = '<!-- hardware -->'
/** The tree the generators write, as one digest: every path git names as changed, with its content up to the hardware mark. */
const treeState = async (cwd: string) => {
  const names = (await spawnRun('git', ['status', '--porcelain=v1', '-z'], { cwd })).stdout.split('\0').filter(Boolean).map((row) => row.slice(3)).sort()
  const digest = createHash('sha256')
  for (const name of names) { digest.update(`${name}\0`); try { const bytes = readFileSync(join(cwd, name)), at = bytes.indexOf(HARDWARE_MARK); digest.update(at < 0 ? bytes : bytes.subarray(0, at)) } catch { digest.update('\0') } }
  return digest.digest('hex')
}
const runSettle = async (cwd: string): Promise<number> => {
  let before = await treeState(cwd)
  for (let round = 1; round <= SETTLE.rounds; round++) {
    for (const [cmd, args] of SETTLE.steps) { const r = await spawnRun(cmd, args, { cwd }); console.log(`${r.status === 0 ? '✓' : '✗'} ${shown(cmd, args)} (${r.ms} ms)`); if (r.status !== 0) { console.log(`${r.stdout}${r.stderr}`.trim().split('\n').slice(-12).join('\n')); return 1 } }
    const after = await treeState(cwd)
    console.log(`round ${round}: ${after === before ? 'settled' : 'changed'}`)
    if (after === before) { const c = await spawnRun(SETTLE.check[0], SETTLE.check[1], { cwd }); console.log(`${c.status === 0 ? '✓' : '✗'} ${shown(...SETTLE.check)} (${c.ms} ms)`); return c.status === 0 ? 0 : 1 }
    before = after
  }
  console.log(`✗ ${SETTLE.rounds} rounds: still changing`)
  return 1
}
const runSync = async (cwd: string): Promise<number> => {
  for (const args of [['fetch', 'origin', BASE_BRANCH], ['merge', '--ff-only', 'FETCH_HEAD']]) { const r = await spawnRun('git', args, { cwd }); console.log(`${r.status === 0 ? '✓' : '✗'} git ${args.join(' ')}: ${`${r.stdout}${r.stderr}`.trim().split('\n').pop() ?? ''}`); if (r.status !== 0) return 1 }
  return 0
}
const runRatchet = async (cwd: string): Promise<number> => {
  for (const [args, env] of [[['build', 'Qpu'], {}], [['env', 'lean', 'lean/Gate.lean'], { MEANING_RATCHET: '1' }]] as const) { const r = await spawnRun('lake', args, { cwd, env }); console.log(`${r.status === 0 ? '✓' : '✗'} ${shown('lake', args)}: ${`${r.stdout}${r.stderr}`.trim().split('\n').pop() ?? ''}`); if (r.status !== 0) return 1 }
  return 0
}
const INTAKE = { scripts: /\.(py|ts|mts|cts|mjs|cjs|js|sh)$/, skipped: /(^|\/)(node_modules|\.git|\.lake)(\/|$)/, scriptBytes: 1 << 18, door: /(?:mcp\.mjs|d\.py)['", ]+['"]?([a-z][a-z-]*)|callEnvelope\('([a-z_]+)'|["']action["']: ?["']([a-z-]+)["']/g, argv: /\[\s*['"](git|lake|node|npx|pnpm|npm|curl|tsc|python3|docker)['"]\s*(?:,\s*\[?\s*['"]([a-z][a-z0-9:-]*)['"])?/g, shell: /^[ \t]*(?:[A-Z_]+=\S+[ \t]+)*(git|lake|node|npx|pnpm|npm|curl|tsc|python3|docker)(?:[ \t]+([a-z][a-z0-9:-]*))?(?![\w./])/gm, runner: /mcp\.mjs|d\.py|machine-run\.ts/ }
/** The work kept outside the tree taken in. Every file is read once and named by its SHA-256, so a content that stands in many places is one piece:
 *  the merge is the RFC 6962 root the seal door computes over the distinct digests in order, decided from the digests alone, wherever the files lay.
 *  A script is read for the doors it calls and for the commands it runs past them; each such command is set beside the door action that already
 *  covers it, or stands as one still to add. The answer holds counts, digests and command names only: no path and no content leaves the list file. */
const runIntake = async (roots: readonly string[], cwd: string): Promise<number> => {
  if (!roots.length) { console.log(JSON.stringify({ phase: 'intake', roots: 0, asked: 'QPU_SCRATCH' })); return 1 }
  const started = clock()
  const { call } = await import('../../../../../../../../3/8/5/9/0/2/0/f/index.ts') as { call: Call }
  const files: { path: string; bytes: number; sha256: string }[] = [], kinds: Record<string, { files: number; bytes: number }> = {}, doors: Record<string, number> = {}, direct: Record<string, number> = {}
  const count = (into: Record<string, number>, key: string) => { into[key] = (into[key] ?? 0) + 1 }
  const sha256 = (bytes: Buffer) => createHash('sha256').update(bytes).digest('hex')
  // the tree's own files by content: a copy of one of them outside the tree is the tree's, and is not read as work done past the doors
  const tracked = new Set((await spawnRun('git', ['ls-files', '-z'], { cwd })).stdout.split('\0').filter(Boolean).flatMap((name) => { try { return [sha256(readFileSync(join(cwd, name)))] } catch { return [] } }))
  let ofTree = 0
  const walk = (at: string, root: string, n: number): void => {
    let s; try { s = lstatSync(at) } catch { return }
    if (s.isSymbolicLink()) return
    if (s.isDirectory()) { let names: string[]; try { names = readdirSync(at).sort() } catch { return }; for (const name of names) walk(join(at, name), root, n); return }
    if (!s.isFile()) return
    let bytes: Buffer; try { bytes = readFileSync(at) } catch { return }
    const path = `${n}/${relative(root, at) || '.'}`, kind = /\.([A-Za-z0-9]+)$/.exec(at)?.[1]?.toLowerCase() ?? ''
    const digest = sha256(bytes)
    files.push({ path, bytes: bytes.length, sha256: digest })
    kinds[kind] = { files: (kinds[kind]?.files ?? 0) + 1, bytes: (kinds[kind]?.bytes ?? 0) + bytes.length }
    if (tracked.has(digest)) { ofTree += 1; return }
    if (INTAKE.scripts.test(at) && !INTAKE.skipped.test(path) && bytes.length <= INTAKE.scriptBytes) {
      const text = bytes.toString('utf8')
      for (const m of text.matchAll(INTAKE.door)) count(doors, (m[1] ?? m[2] ?? m[3])!)
      // a command runs where it heads an argument vector, or a line of a shell script; one that starts the door's own client or the runner is a call
      // through the door, counted above
      for (const m of [...text.matchAll(INTAKE.argv), ...(at.endsWith('.sh') ? text.matchAll(INTAKE.shell) : [])]) if (!INTAKE.runner.test(text.slice(m.index, m.index + m[0].length + 80).split('\n')[0]!)) count(direct, m[2] ? `${m[1]} ${m[2]}` : m[1]!)
    }
  }
  roots.forEach((root, n) => walk(resolve(cwd, root), resolve(cwd, root), n))
  const sizes = new Map(files.map((f) => [f.sha256, f.bytes])), distinct = [...sizes.keys()].sort(), total = files.reduce((n, f) => n + f.bytes, 0)
  const merged = call('seal', { merkle: { leaves: distinct, hex: true } }); if (merged.error) throw new Error(merged.error.message)
  const root = String(merged.result!.structuredContent.root), held = [...sizes.values()].reduce((n, b) => n + b, 0)
  const address = uuid(`intake;${canonicalText({ rfc: 6962, root, distinct: distinct.length, bytes: held })}`), handle = address.slice(0, 8)
  const ranked = (of: Record<string, number>) => Object.entries(of).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
  const covering = (command: string) => { const [cmd, sub] = command.split(' '); return MACHINE_ACTIONS.find((a) => a.cmd === cmd && a.args[0] === sub)?.id ?? null }
  const ms = clock() - started
  const answer = {
    phase: 'intake', roots: roots.length, files: files.length, bytes: total, distinct: distinct.length, distinctBytes: held, repeatedBytes: total - held, ofTree, rfc: 6962, root, address, handle,
    kinds: Object.fromEntries(Object.entries(kinds).sort((a, b) => b[1].bytes - a[1].bytes).slice(0, 12)), doors: Object.fromEntries(ranked(doors)),
    direct: ranked(direct).map(([command, uses]) => ({ command, uses, action: covering(command) })), ms, bytesPerSecond: ms > 0 ? Math.round((total * 1000) / ms) : null,
  }
  const out = join(cwd, '.qpu', 'intake'); mkdirSync(out, { recursive: true }); writeFileSync(join(out, `${handle}.json`), JSON.stringify({ ...answer, list: files }))
  console.log(JSON.stringify(answer))
  return 0
}

// the runner from the command line: `step <tool> <json> [--write]` (the child of a door step), `next [--offline] [--fast]`, or any allowed action
if (process.argv[1] && SELF === fileURLToPath(new URL(process.argv[1], 'file://')) ) {
  const [, , action, ...rest] = process.argv
  // the arguments as JSON, or @<file> holding the JSON (a list of texts outgrows an argument)
  if (action === 'step') await runStepChild(rest[0]!, rest[1]?.startsWith('@') ? readFileSync(rest[1].slice(1), 'utf8') : rest[1] ?? '{}', rest.includes('--write'), process.cwd(), rest.includes('--json'))
  // `staged <cmd> [args…]`: the command run in a checkout of the index (inStagedTree), its status the runner's
  else if (action === 'staged') process.exitCode = (await inStagedTree(process.cwd(), rest[0]!, rest.slice(1), (l) => console.log(l))).status ?? 1
  // `fakes`: every fake the table's finders name in the tracked tree, one a line; status 1 when any stands
  else if (action === 'fakes') { const found = await findFakes(process.cwd()); for (const f of found) console.log(f); process.exitCode = found.length ? 1 : 0 }
  else if (action === 'hook') process.exitCode = (AGENT_HOOKS as readonly string[]).includes(rest[0] ?? '') ? await runAgentHook(rest[0]!, process.cwd()) : await runHook(rest[0] ?? '', rest.slice(1), process.cwd())
  else if (action === 'next') { const r = await runNext({ cwd: process.cwd(), offline: rest.includes('--offline'), fast: rest.includes('--fast'), generators: rest.includes('--generators') }); process.exitCode = r.red ? 1 : 0 }
  // the work once done by hand: `settle`, `sync`, `ratchet`, and `intake [dir…]` (the directories QPU_SCRATCH names where none is given)
  else if (action === 'settle') process.exitCode = await runSettle(process.cwd())
  else if (action === 'sync') process.exitCode = await runSync(process.cwd())
  else if (action === 'ratchet') process.exitCode = await runRatchet(process.cwd())
  else if (action === 'intake') process.exitCode = await runIntake(rest.length ? rest : (process.env.QPU_SCRATCH ?? '').split(':').filter(Boolean), process.cwd())
  else if (action) { const r = await runMachine({ action, confirm: rest.includes('--confirm'), message: rest.includes('-m') ? rest[rest.indexOf('-m') + 1] : undefined, branch: rest.includes('--branch') ? rest[rest.indexOf('--branch') + 1] : undefined }, process.cwd()); console.log(JSON.stringify(r.answer)); process.exitCode = (r as { record?: { ok: boolean } }).record?.ok === false ? 1 : 0 }
  else console.log(proseFill(PROSE.quantumProcessingMachineRun_s4, MACHINE_RUNNER, MACHINE_ACTIONS.map((a) => a.id).join(' | ')))
}
