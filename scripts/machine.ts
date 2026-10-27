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
import { etaOf, type StreamEvent } from '../src/quantum/machine.js'

const runFiles = async () => (await import('../src/quantum/toolboxes/repository.js')).RUN_FILES
export const streamOf = async (root: string) => {
  const file = join(root, (await runFiles()).stream)
  mkdirSync(dirname(file), { recursive: true })
  let last = Date.now(), beat: ReturnType<typeof setInterval> | null = null, current: { subject: string; t0: number; eta: number | null } | null = null
  const emit = (e: Omit<StreamEvent, 'at'>) => { const ev = { at: new Date().toISOString(), ...e } as StreamEvent; last = Date.now(); appendFileSync(file, JSON.stringify(ev) + '\n'); return ev }
  const start = (subject: string, eta: number | null) => { current = { subject, t0: Date.now(), eta }; emit({ kind: 'step-start', subject, eta, says: `${subject} started${eta === null ? ', no ETA: no recorded time yet' : `, ETA ${(eta / 1000).toFixed(1)} s`}` })
    beat = setInterval(() => { if (current && Date.now() - last >= 900) { const elapsed = Date.now() - current.t0; emit({ kind: 'working', subject: current.subject, elapsed, eta: current.eta, says: `${current.subject} working ${(elapsed / 1000).toFixed(0)} s${current.eta === null ? '' : ` of ~${(current.eta / 1000).toFixed(0)} s`}` }) } }, 100) }
  const end = (ok: boolean, says: string) => { if (beat) clearInterval(beat); beat = null; if (!current) return; const { subject, t0, eta } = current, ms = Date.now() - t0; current = null
    emit({ kind: 'step-end', subject, ms, eta, says: `${subject} ${ok ? 'done' : 'failed'} in ${(ms / 1000).toFixed(1)} s${says ? `: ${says}` : ''}` })
    if (eta !== null && ms > 2 * eta) emit({ kind: 'over-eta', subject, ms, eta, says: `${subject} took ${(ms / 1000).toFixed(1)} s, over twice its ETA of ${(eta / 1000).toFixed(1)} s` }) }
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
  const repository = (await import('../src/quantum/mcp.js')).toolCallerOf('repository'), read = (f: string) => { try { return JSON.parse(readFileSync(join(cwd, f), 'utf8')) } catch { return null } }
  const files = await runFiles(), plan = repository({ machine: { plan: { ...args, facts: { receipt: read(files.receipt), approval: read(files.configs)?.approval ?? null, e2e: read(files.e2e)?.outcomes ?? null } } } })
  if (!plan?.allowed) return { plan, answer: plan }
  const s = await streamOf(cwd), subject = plan.action
  s.start(subject, etaOf((await timesOf(cwd))[subject] ?? []))
  const run = await spawnRun(plan, cwd, (p) => { if (plan.action === 'next') s.emit({ kind: 'progress', subject, says: p.message.slice(0, 200) }); onProgress(p) })
  s.end(run.status === 0, run.status === 0 ? '' : `status ${run.status}`)
  const record = repository({ machine: { record: { action: plan.action, command: plan.command, status: run.status, stdout: run.stdout, stderr: run.stderr, ms: run.ms, root: cwd, home: homedir() } } })
  return { plan, record, answer: { plan: { action: plan.action, command: plan.command, decision: plan.decision?.says ?? null }, record: { says: record.says, ok: record.ok, redacted: record.redacted, entry: record.entry } } }
}

/** The status on request: what runs, for how long and its ETA, the last events and what the stream says of its own silence. */
export const now = async (root: string, last = 20) => {
  const file = join(root, (await runFiles()).stream)
  const events = existsSync(file) ? readFileSync(file, 'utf8').trim().split('\n').flatMap((l) => { try { return [JSON.parse(l)] } catch { return [] } }) : []
  const { toolCallerOf } = await import('../src/quantum/mcp.js')
  return toolCallerOf('repository')({ status: { events, times: await timesOf(root), last } })
}

if (process.argv[1]?.endsWith('machine.ts') && process.argv[2] === 'now') console.log(JSON.stringify(await now(process.cwd()), null, 1))
