// Tsvetan Rouschev, @uuidna/qpu, CC-BY-NC-ND-4.0 (https://orcid.org/0009-0000-7312-9778)
// The one runner of a planned machine action, in the tree: the argument vector the plan returns, spawned with no shell, its output read line by
// line as it arrives (each line handed to the caller at once, so a client that sent a progress token sees the run as it happens) and the whole
// judged into the record the repository tool addresses. next is run here too: the waves of NEXT_STEPS, each door step a child process of this
// file (`step <tool> <json>`) calling the handler as a library (the same code the door serves), each generator writing the path and text its
// door answers, each process step the command the table names; a step past its budget is killed with its process group and recorded red; the
// red steps are retried once after the generators ran; the receipt is the last line, `RECEIPT {json}`, the body of the machine's entry.
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, readlinkSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { availableParallelism, homedir, tmpdir, totalmem } from 'node:os'
import { fileURLToPath } from 'node:url'
import { MACHINE_ACTIONS, MACHINE_RUNNER, NEXT_STEPS, forecastTimes, redact, type NextStep } from './machine.ts'
import { clock, stamp } from './unit/clock.ts'
import { uuid } from '../uuid/index.ts'

export type MachineProgress = { progress: number; total?: number; message: string }
type Run = { status: number | null; stdout: string; stderr: string; ms: number; timedOut: boolean }
const STEP_LINE = /^\s*[✓✗·↻⏱○]\s/
const SELF = fileURLToPath(import.meta.url)
/** lake where elan or Homebrew put it; the table names only `lake`. */
const lakeOf = () => [`${homedir()}/.elan/toolchains/leanprover--lean4---v4.33.0/bin/lake`, `${homedir()}/.elan/bin/lake`, '/opt/homebrew/bin/lake', 'lake'].find((p) => p === 'lake' || existsSync(p))!
const cmdOf = (cmd: string) => (cmd === 'lake' ? lakeOf() : cmd)

/** One command with no shell: its lines streamed, the whole kept, the process group killed at the budget (a grandchild outlived its npx parent). */
export const spawnRun = (cmd: string, args: readonly string[], o: { cwd: string; input?: string | null; budgetMs?: number; env?: Record<string, string>; onLine?: (line: string) => void } ): Promise<Run> =>
  new Promise((resolve) => {
    const t0 = clock()
    const child = spawn(cmdOf(cmd), [...args], { cwd: o.cwd, shell: false, detached: process.platform !== 'win32', env: { ...process.env, FORCE_COLOR: '0', ...(o.env ?? {}) } })
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
type Call = (name: string, args: unknown) => { result?: { structuredContent?: any }; error?: { message: string } }
const resolveArgs = async (x: unknown, cwd: string, call: Call): Promise<unknown> => {
  if (Array.isArray(x)) return Promise.all(x.map((v) => resolveArgs(v, cwd, call)))
  if (!x || typeof x !== 'object') return x
  const o = x as Record<string, unknown>
  if (typeof o.$file === 'string' && Object.keys(o).length === 1) return readFileSync(join(cwd, o.$file), 'utf8')
  if (o.$run && typeof o.$run === 'object' && Object.keys(o).length === 1) { const e = o.$run as { cmd: string; args: string[] }; const r = await spawnRun(e.cmd, e.args, { cwd }); return r.stdout + r.stderr }
  // { $lean: true }: every module the Lean UUID programs reach from the root, as { path: text }
  if (o.$lean === true && Object.keys(o).length === 1) return Object.fromEntries((await import('../uuid/programs/lean/index.ts')).leanPrograms().rows.map((row) => [row.source, readFileSync(join(cwd, row.source), 'utf8')]))
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
  const base = join(cwd, '.qpu', 'memory'), dir = join(base, code.digest('hex').slice(0, 32))
  const read = (): Block[] => existsSync(dir) ? readdirSync(dir).flatMap((f) => readFileSync(join(dir, f), 'utf8').split('\n').flatMap((l) => { try { return l ? [JSON.parse(l) as Block] : [] } catch { return [] } })) : []
  const write = (blocks: readonly Block[]) => {
    const lines = blocks.flatMap((b) => { try { return [JSON.stringify(b)] } catch { return [] } })
    if (!lines.length) return
    if (existsSync(base)) for (const old of readdirSync(base)) if (join(base, old) !== dir) rmSync(join(base, old), { recursive: true, force: true })
    mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, `${process.pid}.ndjson`), lines.join('\n'))
  }
  return { read, write }
}

const runStepChild = async (tool: string, argsJson: string, write: boolean, cwd: string, json = false) => {
  const { call, balancerLoad, balancerSnapshot } = await import('./mcp.ts') as { call: Call; balancerLoad: (b: readonly Block[]) => number; balancerSnapshot: (p: { onlyNew?: boolean }) => Block[] }
  const memory = memoryOf(cwd)
  balancerLoad(memory.read())
  const args = await resolveArgs(JSON.parse(argsJson), cwd, call)
  // e2e asks each host once before it replays a single example: a host that does not answer tools/list as JSON-RPC is named
  if (tool === 'e2e') for (const url of new Set((args as { hosts?: string[] }).hosts ?? [])) { const ok = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: '{"jsonrpc":"2.0","id":0,"method":"tools/list"}', signal: AbortSignal.timeout(20000) }).then((r) => /json|event-stream/.test(r.headers.get('content-type') ?? ''), () => false); if (!ok) { console.log(JSON.stringify({ error: `${url} does not answer tools/list as JSON-RPC; no example was replayed` })); process.exitCode = 1; return } }
  const r = call(tool, args)
  if (r.error) { console.log(JSON.stringify({ error: r.error.message })); process.exitCode = 1; return }
  let s = r.result?.structuredContent ?? null
  // a door that answers with requests has them fetched, eight at a time, then answers again with them: e2e decodes here, every other door is asked with answers
  if (Array.isArray(s?.requestList) && !(args as { answers?: unknown }).answers) {
    const list = [...s.requestList] as { url: string; method: string; accept: string; headers?: Record<string, string>; body?: unknown }[], answers: unknown[] = []
    await Promise.all(Array.from({ length: 8 }, async () => { for (let q = list.shift(); q; q = list.shift()) { const t0 = performance.now(); try { const res = await fetch(q.url, { method: q.method, headers: { 'content-type': 'application/json', accept: q.accept, ...q.headers }, body: q.body === undefined ? undefined : JSON.stringify(q.body), signal: AbortSignal.timeout(20000) }); answers.push({ ...q, status: res.status, ms: performance.now() - t0, text: await res.text(), etag: res.headers.get('etag') }) } catch (e) { answers.push({ ...q, status: 0, ms: performance.now() - t0, text: String(e) }) } } }))
    // in this process: the door's wrapper re-serialises e2e's bodies past a string's length
    if (tool === 'e2e') { const d = (await import('./e2e.ts')).decodeE2e(answers as never); s = { phase: 'decoded', ...d.outcomes, combos: d.combos, copies: d.copies, uncorrectableLeads: d.leads.filter((l) => l.id.startsWith('e2e-uncorrectable')).map((l) => l.id).join(' ') } }
    else { const again = call(tool, { ...(args as object), answers }); if (again.error) { console.log(JSON.stringify({ error: again.error.message })); process.exitCode = 1; return } s = again.result?.structuredContent ?? null }
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

export type Receipt = { date: string; head: string; runner: string; offline: boolean; fast: boolean; lanes: number; steps: { name: string; status: 'green' | 'red' | 'skipped'; ms: number; via: NextStep['via']; tail: string; attempt: number }[]; green: number; red: number; skipped: number; wallMs: number; sumMs: number; speedup: number | null }
/** next: the waves of NEXT_STEPS run at the root, each step a child, the receipt returned and printed as the last line. */
export const runNext = async (o: { cwd: string; offline?: boolean; fast?: boolean; generators?: boolean; onLine?: (line: string) => void }): Promise<Receipt> => {
  const say = (l: string) => { console.log(l); o.onLine?.(l) }
  const wall0 = clock()
  const heapMb = Number(/--max-old-space-size[= ](\d+)/.exec(process.env.NODE_OPTIONS ?? '')?.[1]) || 4096
  const lanes = Math.max(1, Math.min(availableParallelism(), Math.floor(((totalmem() / 1048576) * 0.7) / heapMb)))
  const head = (await spawnRun('git', ['rev-parse', '--short', 'HEAD'], { cwd: o.cwd })).stdout.trim()
  // the wildcard step expanded from tools/list: every tool whose schema names selftest
  const expand = async (): Promise<NextStep[]> => {
    const out: NextStep[] = []
    for (const s of NEXT_STEPS) {
      if (s.tool !== '*') { out.push(s); continue }
      const { handle } = await import('./mcp.ts') as { handle: (m: unknown) => { result?: { tools?: { name: string; inputSchema?: { properties?: Record<string, unknown> } }[] } } }
      const tools = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }).result?.tools ?? []
      for (const t of tools) if (t.inputSchema?.properties && Object.keys(s.arguments ?? {}).every((k) => k in t.inputSchema!.properties!)) out.push({ ...s, name: `${s.name}:${t.name}`, tool: t.name })
    }
    return out
  }
  // a step is a UUID program addressed by itself over what it reads (lake the Lean tree, others the whole tree, read as each wave starts);
  // a green answer that asks nothing of the world is kept under that address
  const lines = async (...a: string[]) => (await spawnRun('git', a, { cwd: o.cwd })).stdout.split('\n').filter(Boolean)
  let blobs = new Map<string, string>()
  const read = async () => {
    blobs = new Map((await lines('ls-files', '-s')).map((l) => [l.slice(l.indexOf('\t') + 1), l.split(' ')[1]!]))
    const loose = [...await lines('diff', '--name-only'), ...await lines('ls-files', '-o', '--exclude-standard')], present = loose.filter((p) => existsSync(join(o.cwd, p)) || !blobs.delete(p))
    const hashed = present.length ? (await spawnRun('git', ['hash-object', '--stdin-paths'], { cwd: o.cwd, input: present.join('\n') })).stdout.split('\n') : []
    present.forEach((p, i) => blobs.set(p, hashed[i]!))
  }
  const kept = (s: NextStep) => join(o.cwd, '.qpu', 'receipts', uuid(JSON.stringify(s) + [...blobs].filter(([p]) => s.cmd !== 'lake' || /\.lean$|^lake/.test(p)).sort().join('\n')) + '.json')
  const steps = (await expand()).filter((s) => !o.generators || s.via === 'generator' || s.name === 'lean')
  const receipt: Receipt = { date: stamp(), head, runner: MACHINE_RUNNER, offline: o.offline === true, fast: o.fast === true, lanes, steps: [], green: 0, red: 0, skipped: 0, wallMs: 0, sumMs: 0, speedup: null }
  const run = async (s: NextStep, attempt: number): Promise<boolean> => {
    const skip = s.needs === 'online' && o.offline ? 'offline' : s.long && o.fast ? 'fast' : null
    if (skip) { receipt.steps.push({ name: s.name, status: 'skipped', ms: 0, via: s.via, tail: skip, attempt }); say(`· ${s.name}: ${skip}`); return true }
    const t0 = clock(), at = kept(s)
    if (existsSync(at)) { receipt.steps.push({ ...JSON.parse(readFileSync(at, 'utf8')), attempt }); say(`✓ ${s.name} (receipt ${at.slice(-41, -5)})`); return true }
    const r = s.via === 'process' ? await spawnRun(s.cmd!, s.args!, { cwd: o.cwd, budgetMs: s.budgetMs }) : await spawnRun(process.execPath, [SELF, 'step', s.tool!, JSON.stringify(s.arguments ?? {}), ...(s.via === 'generator' ? ['--write'] : [])], { cwd: o.cwd, budgetMs: s.budgetMs })
    const out = `${r.stdout}${r.stderr ? `\n${r.stderr}` : ''}`, ok = r.status === 0 && !r.timedOut
    const failing = [...new Set(out.split('\n').filter((l) => /^(✖|✗|not ok) |error TS\d+|^\s*AssertionError|^error:/.test(l)))]
    const tail = redact((failing.length ? failing.join('\n') + '\n' : '') + (r.timedOut ? `⏱ killed at its budget of ${s.budgetMs / 1000} s\n` : '') + out.trim().split('\n').slice(-8).join('\n'), o.cwd, homedir())
    receipt.steps.push({ name: s.name, status: ok ? 'green' : 'red', ms: clock() - t0, via: s.via, tail, attempt })
    if (ok && s.needs !== 'online') { mkdirSync(dirname(at), { recursive: true }); writeFileSync(at, JSON.stringify({ name: s.name, status: 'green', ms: clock() - t0, via: s.via, tail: `${tail}\nkept ${stamp()}` })) }
    say(`${ok ? '✓' : r.timedOut ? '⏱' : '✗'} ${s.name} (${((clock() - t0) / 1000).toFixed(1)} s)`)
    if (!ok) for (const l of tail.split('\n').slice(0, 6)) say(`  ${l}`)
    return ok
  }
  const pool = async <T,>(items: readonly T[], fn: (x: T) => Promise<boolean>, n: number) => { const out: boolean[] = new Array(items.length); let i = 0; await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]!) } })); return out }
  const failed: NextStep[] = []
  for (const wave of [...new Set(steps.map((s) => s.wave))].sort((a, b) => a - b)) {
    await read()
    const inWave = steps.filter((s) => s.wave === wave), results = await pool(inWave, (s) => run(s, 1), lanes)
    for (const [i, ok] of results.entries()) if (!ok) failed.push(inWave[i]!)
  }
  for (const s of failed) { say(`↻ retry ${s.name}`); await run(s, 2) }
  // the last attempt of each step decides
  const last = Object.values(Object.fromEntries(receipt.steps.map((s) => [s.name, s])))
  receipt.green = last.filter((s) => s.status === 'green').length; receipt.red = last.filter((s) => s.status === 'red').length; receipt.skipped = last.filter((s) => s.status === 'skipped').length
  receipt.wallMs = clock() - wall0; receipt.sumMs = receipt.steps.reduce((n, s) => n + s.ms, 0); receipt.speedup = receipt.wallMs ? Number((receipt.sumMs / receipt.wallMs).toFixed(2)) : null
  say(`next: ${receipt.green} green, ${receipt.red} red, ${receipt.skipped} skipped in ${(receipt.wallMs / 1000).toFixed(1)} s (${receipt.lanes} lanes, speedup ${receipt.speedup})`)
  console.log(`RECEIPT ${JSON.stringify(receipt)}`)
  return receipt
}

type Plan = { allowed: boolean; action: string; command: { cmd: string; args: string[] }; input?: string | null; worktree?: string | null; decision?: { says?: string } | null; refused?: string }
/** Runs an asked action: planned by the repository tool's rules against the facts the caller read (the last receipt, the approval), run with no
 *  shell, each line streamed, then recorded; an action the rules refuse answers its plan and runs nothing; next runs its waves here. */
export const runMachine = async (args: Record<string, unknown>, cwd: string, onProgress: (p: MachineProgress) => void = () => {}, o: { facts?: Record<string, unknown>; times?: Record<string, readonly number[]> } = {}) => {
  const { caller } = await import('./mcp.ts') as { caller: (name: string) => (a: Record<string, unknown>) => any }
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
  return { plan, record, answer: { plan: { action: plan.action, command: plan.command, decision: plan.decision?.says ?? null }, eta, record: { says: record.says, ok: record.ok, redacted: record.redacted, entry: record.entry }, ...(receipt ? { receipt: { green: receipt.green, red: receipt.red, skipped: receipt.skipped, wallMs: receipt.wallMs, red_steps: receipt.steps.filter((s) => s.status === 'red').map((s) => s.name) } } : {}) } }
}

/** A git hook as the client of its workflow (repository { workflow }): its steps walked as the door answers them (next run here, a command spawned,
 *  the generated files compared before they are staged), the facts read (the receipt, the staged diff of the hand-written roots, the workflow files,
 *  the message, the packed package, the gate's decoding) and the decision obeyed: a refused rule or a red step ends the hook with status 1. */
const runHook = async (name: string, rest: readonly string[], cwd: string) => {
  const { call } = await import('./mcp.ts') as { call: Call }, { LITERAL_ROOTS } = await import('./audit.ts')
  const ask = (a: Record<string, unknown>) => { const r = call('repository', a); if (r.error) throw new Error(r.error.message); return r.result!.structuredContent }
  const git = async (...a: string[]) => (await spawnRun('git', a, { cwd })).stdout.trim()
  const w = ask({ workflow: name, offline: true }).workflow as { steps: { id: string; kind: string; detach?: boolean; cmd?: string; args?: string[]; files?: string[] }[] }
  const facts: Record<string, unknown> = { branch: await git('branch', '--show-current') }
  let red = false
  for (const s of w.steps) {
    if (red || s.detach || (s.kind !== 'run' && s.kind !== 'stage')) continue
    if (s.kind === 'stage') {
      // a changed file whose head names its generator is staged with the commit
      const changed = (await git('diff', '--name-only')).split('\n').filter((p) => p && existsSync(join(cwd, p)))
      const written = changed.filter((p) => /^\/\/ generated by |(automatically|generated) by payload|generated by configure \{/im.test(readFileSync(join(cwd, p), 'utf8').slice(0, 800)))
      const files = [...new Set([...(s.files ?? []).filter((p) => existsSync(join(cwd, p))), ...written])]; if (files.length) await git('add', '-u', '--', ...files)
      facts.automated = { drifted: [] as string[], staged: written }
      continue
    }
    if (s.args?.[1] === 'next') { const r = await runNext({ cwd, offline: s.args.includes('--offline'), fast: s.args.includes('--fast') }); facts.receipt = r; red = r.red > 0; continue }
    const r = await spawnRun(s.cmd!, s.args ?? [], { cwd, onLine: (l) => console.log(l) }); red = r.status !== 0
    if (s.id === 'e2e') { const m = /\{.*\}\s*$/.exec(r.stdout.trim().split('\n').pop() ?? ''); facts.e2e = m ? JSON.parse(m[0]) : null }
  }
  const flows = join(cwd, '.github/workflows')
  facts.workflows = existsSync(flows) ? Object.fromEntries(readdirSync(flows).filter((f) => /\.ya?ml$/.test(f)).map((f) => [`.github/workflows/${f}`, readFileSync(join(flows, f), 'utf8')])) : null
  if (name === 'commit-msg') facts.message = readFileSync(rest[0]!, 'utf8')
  if (name === 'pre-commit') {
    const diff = await git('diff', '--cached', '-U0', '--no-color', '--no-renames', '--', ...LITERAL_ROOTS), generated: string[] = []
    for (const f of [...diff.matchAll(/^\+\+\+ b\/(.+)$/gm)].map((m) => m[1]!)) if (/^\/\/ generated by |(automatically|generated) by payload|generated by configure \{/im.test((await git('show', `:${f}`)).slice(0, 800))) generated.push(f)
    facts.staged = { diff, generated }
  }
  if (name === 'pre-push') {
    const dir = join(cwd, 'src/quantum'), pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')), packed = JSON.parse((await spawnRun('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { cwd: dir })).stdout || '[]')[0]?.files?.map((f: { path: string }) => `./${f.path}`) ?? null
    facts.npm = { name: pkg.name, version: pkg.version, license: pkg.license, description: pkg.description, exports: pkg.exports, packed }
  }
  const d = ask({ workflow: name, facts }).decision as { allowed: boolean; says?: string; rules: { rule: string; holds: boolean | null; evidence: string }[] }
  for (const r of d.rules) console.log(`${r.holds === true ? '✓' : r.holds === false ? '✗' : '?'} ${r.rule}: ${r.evidence}`)
  console.log(`hook ${name}: ${d.allowed && !red ? 'allowed' : 'refused'}${d.says ? `: ${d.says}` : ''}`)
  return red || !d.allowed ? 1 : 0
}

// the runner from the command line: `step <tool> <json> [--write]` (the child of a door step), `next [--offline] [--fast]`, or any allowed action
if (process.argv[1] && SELF === fileURLToPath(new URL(process.argv[1], 'file://')) ) {
  const [, , action, ...rest] = process.argv
  // the arguments as JSON, or @<file> holding the JSON (a list of texts outgrows an argument)
  if (action === 'step') await runStepChild(rest[0]!, rest[1]?.startsWith('@') ? readFileSync(rest[1].slice(1), 'utf8') : rest[1] ?? '{}', rest.includes('--write'), process.cwd(), rest.includes('--json'))
  else if (action === 'hook') process.exitCode = await runHook(rest[0] ?? '', rest.slice(1), process.cwd())
  else if (action === 'next') { const r = await runNext({ cwd: process.cwd(), offline: rest.includes('--offline'), fast: rest.includes('--fast'), generators: rest.includes('--generators') }); process.exitCode = r.red ? 1 : 0 }
  else if (action) { const r = await runMachine({ action, confirm: rest.includes('--confirm'), message: rest.includes('-m') ? rest[rest.indexOf('-m') + 1] : undefined, branch: rest.includes('--branch') ? rest[rest.indexOf('--branch') + 1] : undefined }, process.cwd()); console.log(JSON.stringify(r.answer)); process.exitCode = (r as { record?: { ok: boolean } }).record?.ok === false ? 1 : 0 }
  else console.log(`${MACHINE_RUNNER}: step <tool> <json> [--write] | next [--offline] [--fast] [--generators] | hook <pre-commit|commit-msg|pre-push> [git's arguments] | ${MACHINE_ACTIONS.map((a) => a.id).join(' | ')}`)
}
