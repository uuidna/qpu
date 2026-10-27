// The one runner of a planned machine action, shared by the stdio transport and the Payload MCP plugin's machine tool: the argument vector
// the plan returns, spawned with no shell, its output read line by line as it arrives — each line handed to the caller at once, so a client
// that sent a progress token sees the run as it happens — and the whole kept for the record the repository tool judges. For next, a finished
// step (a line opening with ✓, ✗ or ·) is the unit of progress; for any other action, a line is.
import { spawn } from 'node:child_process'

export type MachineProgress = { progress: number; total?: number; message: string }
const STEP = /^\s*[✓✗·]\s/

/** Runs the plan's command, calling onProgress for every finished step of next or every output line of anything else, and resolves to the whole run. */
const spawnRun = (plan: { action: string; command: { cmd: string; args: readonly string[] }; input?: string | null }, cwd: string, onProgress: (p: MachineProgress) => void = () => {}) =>
  new Promise<{ status: number | null; stdout: string; stderr: string; ms: number }>((resolve) => {
    const t0 = Date.now()
    const child = spawn(plan.command.cmd, [...plan.command.args], { cwd, shell: false })
    let stdout = '', stderr = '', progress = 0
    const lineOf = (stream: 'stdout' | 'stderr') => { let rest = ''; return (chunk: Buffer) => {
      const text = rest + chunk.toString('utf8'); const lines = text.split('\n'); rest = lines.pop() ?? ''
      if (stream === 'stdout') stdout += chunk.toString('utf8'); else stderr += chunk.toString('utf8')
      for (const line of lines) if (line.trim() && (plan.action !== 'next' || STEP.test(line))) onProgress({ progress: ++progress, message: line })
    } }
    child.stdout.on('data', lineOf('stdout'))
    child.stderr.on('data', lineOf('stderr'))
    child.on('error', (e) => { stderr += String(e); resolve({ status: null, stdout, stderr, ms: Date.now() - t0 }) })
    child.on('close', (code) => resolve({ status: code, stdout, stderr, ms: Date.now() - t0 }))
    child.stdin.end(plan.input ?? '')
  })

// The stream every run writes. Each start, end and heartbeat is one NDJSON line in the stream file (the harness tails it, the Payload admin
// reads it): while a run lasts, a heartbeat follows any second without an event, so the stream is never silent (textbook_stream_no_silence), and
// every event carries the ETA the receipts and the stream's own finished runs give, or none (textbook_eta_from_receipts). The stream is the
// machine's own file, beside the run's record in Entries; it is never a docket entry of its own.
import { appendFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { homedir } from 'node:os'
import { forecastOf, MACHINE_ACTIONS, type StreamEvent } from '../src/quantum/machine.ts'
import { readJson } from './mcp.ts'

const runFiles = async () => (await import('../src/quantum/toolboxes/repository.ts')).RUN_FILES
export const streamOf = async (root: string) => {
  const file = join(root, (await runFiles()).stream)
  mkdirSync(dirname(file), { recursive: true })
  let last = Date.now(), beat: ReturnType<typeof setInterval> | null = null, current: { subject: string; t0: number; eta: number | null } | null = null
  const emit = (e: Omit<StreamEvent, 'at'>) => { const ev = { at: new Date().toISOString(), ...e } as StreamEvent; last = Date.now(); appendFileSync(file, JSON.stringify(ev) + '\n'); return ev }
  let high: number | undefined
  const start = (subject: string, eta: number | null, hi?: number) => { current = { subject, t0: Date.now(), eta }; high = hi; emit({ kind: 'step-start', subject, eta, says: `${subject} started${eta === null ? ', no ETA: no recorded time yet' : `, ETA ${(eta / 1000).toFixed(1)} s`}` })
    beat = setInterval(() => { if (current && Date.now() - last >= 900) { const elapsed = Date.now() - current.t0; emit({ kind: 'working', subject: current.subject, elapsed, eta: current.eta, says: `${current.subject} working ${(elapsed / 1000).toFixed(0)} s${current.eta === null ? '' : ` of ~${(current.eta / 1000).toFixed(0)} s`}` }) } }, 100) }
  const end = (ok: boolean, says: string) => { if (beat) clearInterval(beat); beat = null; if (!current) return; const { subject, t0, eta } = current, ms = Date.now() - t0; current = null
    emit({ kind: 'step-end', subject, ms, eta, says: `${subject} ${ok ? 'done' : 'failed'} in ${(ms / 1000).toFixed(1)} s${says ? `: ${says}` : ''}` })
    const bound = high ?? (eta === null ? null : 2 * eta) // the forecast is the budget: past its interval is a violation, its profile the event
    if (bound !== null && ms > bound) emit({ kind: 'over-forecast', subject, ms, eta, says: `${subject} took ${(ms / 1000).toFixed(1)} s, past its forecast's bound of ${(bound / 1000).toFixed(1)} s (estimated ${((eta ?? 0) / 1000).toFixed(1)} s)` }) }
  return { emit, start, end }
}

/** The recorded times of each step and action, from the receipts and the stream's own finished runs: the ETA's only source. */
export const timesOf = async (root: string) => {
  const files = await runFiles(), times: Record<string, number[]> = {}
  const lines = (f: string) => (existsSync(join(root, f)) ? readFileSync(join(root, f), 'utf8').trim().split('\n') : [])
  for (const l of lines(files.receipts)) { try { for (const st of (JSON.parse(l) as { steps?: { name: string; ms?: number; status?: string }[] }).steps ?? []) if (typeof st.ms === 'number' && st.ms > 0 && st.status === 'green') (times[st.name] ??= []).push(st.ms) } catch {} }
  for (const l of lines(files.stream)) { try { const e = JSON.parse(l) as StreamEvent; if (e.kind === 'step-end' && typeof e.ms === 'number' && e.ms > 0 && !/ failed /.test(e.says)) (times[e.subject] ??= []).push(e.ms) } catch {} }
  return times
}

/** Runs an asked action: planned by the workflow rules against the facts at the root, run with no shell and streamed (its start with the ETA, a
 *  heartbeat every second, each finished step of next), then recorded; an action the rules refuse answers its plan and runs nothing. */
export const runMachine = async (args: Record<string, unknown>, cwd: string, onProgress: (p: MachineProgress) => void = () => {}) => {
  const repository = (await import('../src/quantum/mcp.ts')).toolCallerOf('repository'), read = (f: string) => readJson(join(cwd, f))
  const files = await runFiles(), plan = repository({ machine: { plan: { ...args, facts: { receipt: read(files.receipt), approval: read(files.configs)?.approval ?? null, e2e: read(files.e2e)?.outcomes ?? null } } } })
  if (!plan?.allowed) return { plan, answer: plan }
  // the action's own hooks run first, before use: a refusal is answered here, before anything is changed or booked
  const workflow = MACHINE_ACTIONS.find((a) => a.id === plan.action)?.workflow, pre = workflow ? await spawnRun({ action: 'pre-use', command: { cmd: 'node', args: [...MACHINE_ACTIONS.find((a) => a.id === 'precheck')!.args.slice(0, 1), workflow, '--pre-use'] } }, cwd) : null
  if (pre && / refused/.test(pre.stdout + pre.stderr)) return { plan, answer: { plan, preUse: (pre.stdout + pre.stderr).trim() } }
  const s = await streamOf(cwd), subject = plan.action
  const f = forecastOf((await timesOf(cwd))[subject] ?? [])
  s.start(subject, f?.point ?? null, f?.interval?.[1])
  const run = await spawnRun(plan, cwd, (p) => { if (plan.action === 'next') s.emit({ kind: 'progress', subject, says: p.message.slice(0, 200) }); onProgress(p) })
  s.end(run.status === 0, run.status === 0 ? '' : `status ${run.status}`)
  const record = repository({ machine: { record: { action: plan.action, command: plan.command, status: run.status, stdout: run.stdout, stderr: run.stderr, ms: run.ms, root: cwd, home: homedir() } } })
  return { plan, record, answer: { plan: { action: plan.action, command: plan.command, decision: plan.decision?.says ?? null }, record: { says: record.says, ok: record.ok, redacted: record.redacted, entry: record.entry } } }
}

/** A merge as one linear flow of machine actions: the working tree set aside when it holds changes, the branch merged without a commit (no
 *  pre-use: nothing is regenerated before it), the merge completed by the commit action, whose pre-use decides the merged tree. */
const mergeFlow = async (branch: string, message: string | undefined, cwd: string, onProgress: (p: MachineProgress) => void = () => {}) => {
  const dirty = (await spawnRun({ action: 'status', command: { cmd: 'git', args: ['status', '--porcelain', '--untracked-files=no'] } }, cwd)).stdout.trim()
  const aside = dirty ? await runMachine({ action: 'set-aside' }, cwd, onProgress) : null, merged = await runMachine({ action: 'merge', branch }, cwd, onProgress)
  const commit = merged.record?.ok ? await runMachine({ action: 'commit', confirm: true, message: message ?? `Merge ${branch}\n\nBrought in by the machine's merge flow: the working tree set aside, the branch merged without a\ncommit, the merge completed through the commit action.` }, cwd, onProgress) : null
  return { aside, merged, commit }
}

/** The status on request: what runs, for how long and its ETA, the last events and what the stream says of its own silence. */
export const now = async (root: string, last = 20) => {
  const file = join(root, (await runFiles()).stream)
  const events = existsSync(file) ? readFileSync(file, 'utf8').trim().split('\n').flatMap((l) => { try { return [JSON.parse(l)] } catch { return [] } }) : []
  const { toolCallerOf } = await import('../src/quantum/mcp.ts')
  return toolCallerOf('repository')({ status: { events, times: await timesOf(root), last } })
}

// the machine from the command line: now, the last receipt's red steps, or any allowed action, its message read from a file
if (process.argv[1]?.endsWith('machine.ts')) {
  const [, , action, ...rest] = process.argv, flag = (n: string) => (rest.includes(n) ? rest[rest.indexOf(n) + 1] : undefined)
  const say = (x: Awaited<ReturnType<typeof runMachine>>) => (x.answer as { preUse?: string }).preUse ?? (x.answer as { record?: { says?: string } }).record?.says ?? (x.answer as { says?: string }).says ?? JSON.stringify(x.answer)
  if (action === 'now') console.log(JSON.stringify(await now(process.cwd()), null, 1))
  else if (action === 'receipt') { const r = readJson(join(process.cwd(), (await runFiles()).receipt)) as { head?: string; steps?: { name: string; status: string; tail: string }[] } | null, red = (r?.steps ?? []).filter((s) => s.status === 'red'); for (const s of red) console.log(`${s.name}: ${s.tail.split('\n').filter((l) => /✗|✖|rror/.test(l)).slice(0, 3).join(' | ')}`); console.log(`${r?.head}: ${red.length} red`) }
  else if (action === 'merge') { const file = flag('--message-file'), f = await mergeFlow(flag('--branch') ?? '', file ? readFileSync(file, 'utf8') : flag('-m'), process.cwd()); for (const x of [f.aside, f.merged, f.commit]) if (x) console.log(say(x)) }
  else if (action) { const file = flag('--message-file'), r = await runMachine({ action, confirm: rest.includes('--confirm'), message: file ? readFileSync(file, 'utf8') : flag('-m'), branch: flag('--branch') }, process.cwd()); console.log(say(r)) }
}
