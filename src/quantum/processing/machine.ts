// The developer machine managed through the MCP, securely: an allow-list of local actions (reads of the tree's state, the writes the
// workflows already name), each planned here — refused with the court's case when the list does not name it, when its parameters are not
// its own, or when the workflow rules decided by theorems refuse it (a commit needs the flow green, a push the rules of pre-push and the
// user's confirmation) — and each run judged here: its output's paths made relative, its leaks redacted by kind, the whole a docket entry
// at its content address with its SHA-256, the same shape the Worker's docket and the Payload entries address. No shell, no arbitrary
// command: the one runner (scripts/machine.ts), called by the stdio transport and by the Payload MCP plugin's machine tool, executes only
// the argument vector a plan returns, streaming its lines as progress to a caller that sent a progress token.
import { TABLES } from './tables-index.ts'
import { uuidOf, entryTextOf } from './unit/blocks.ts'
import { sha256, utf8, hex } from './unit/hmac.ts'
import { listLeaks, LEAK_PATTERNS } from './audit.ts'
import { summonCourt } from './toolboxes/legal.ts'
import type { WorkflowFacts } from './toolboxes/repository.ts'
type Decide = (name: 'pre-commit' | 'pre-push', facts: WorkflowFacts) => { allowed: boolean; says: string; violated: string[]; unknown: string[] }

type MachineAction = { id: string; kind: 'read' | 'write'; cmd?: string; args: readonly string[]; says: string; needs?: 'message' | 'confirm' | 'branch' | 'file' | 'pattern' | 'patch'; workflow?: 'pre-commit' | 'pre-push' }
/** A branch a merge may name: letters, digits, dot, underscore, slash and dash, never starting with a dash (it would be read as an option). */
const BRANCH_RE = /^[A-Za-z0-9._/-]{1,200}$/
const ROWS = TABLES.MACHINE_ROWS as unknown as readonly MachineAction[]
export const MACHINE_ACTIONS = ROWS.map((a) => ({ ...a, cmd: a.cmd ?? 'git', says: a.needs === 'confirm' ? `${a.says}: only on the user's confirmation` : a.says }))

/** The parameters of the actions that discard or move work, checked before anything runs. */
const WORKTREE_RE = /^\.claude\/worktrees\/[A-Za-z0-9._-]{1,120}$/
const FILE_RE = /^(?![/.-])(?!.*\.\.)[A-Za-z0-9._/-]{1,300}$/
const TAG_RE = /^archive\/[A-Za-z0-9._-]{1,120}$/
const SHA_RE = /^[0-9a-f]{40}$/

export type MachineRequest = { action?: string; message?: string; confirm?: boolean; branch?: string; path?: string; tag?: string; commit?: string; from?: string; file?: string; archived?: boolean; worktree?: string; pattern?: string; patch?: string; facts?: WorkflowFacts }
/** The plan of one action: allowed with its argument vector (and the message as its input), or refused with the court's case. */
export const planMachine = (r: MachineRequest, decideOf: Decide) => {
  const a = MACHINE_ACTIONS.find((x) => x.id === r.action)
  const refuse = (rule: string, why: string, evidence: unknown) => ({ allowed: false as const, action: r.action ?? null, refused: why, court: summonCourt({ gate: `machine ${r.action ?? '?'}`, rule, evidence }), theorems: ['textbook_machine_allow_list', 'textbook_cheap_gates'] })
  if (!a) return refuse('route', `the allow-list names no action ${String(r.action)}: ${MACHINE_ACTIONS.map((x) => x.id).join(', ')}`, { asked: r.action })
  if (a.needs === 'message' && (typeof r.message !== 'string' || !r.message.trim() || r.message.includes('\u0000'))) return refuse('shape', `${a.id} takes a message: one line at least, no NUL`, { action: a.id })
  if (a.needs === 'branch' && (typeof r.branch !== 'string' || !BRANCH_RE.test(r.branch) || r.branch.startsWith('-'))) return refuse('shape', `${a.id} takes a branch: letters, digits, . _ / -, up to 200, never starting with a dash`, { action: a.id, branch: r.branch ?? null })
  if (a.needs === 'confirm' && r.confirm !== true) return refuse('role', `${a.id} leaves the machine: it runs only on the user's explicit confirmation (confirm: true)`, { action: a.id })
  if (r.worktree !== undefined && !WORKTREE_RE.test(String(r.worktree))) return refuse('shape', `${a.id} runs at the root or in a worktree under .claude/worktrees`, { action: a.id })
  // the row's own parameter by its needs, uncapped: a relative file after --, a pattern after -e, a patch read as the input
  const param = a.needs === 'file' ? (typeof r.file === 'string' && FILE_RE.test(r.file) ? ['--', r.file] : null) : a.needs === 'pattern' ? (typeof r.pattern === 'string' && r.pattern && !r.pattern.includes('\u0000') ? ['-e', r.pattern] : null) : a.needs === 'patch' && (typeof r.patch !== 'string' || r.patch.includes('\u0000')) ? null : []
  if (!param) return refuse('shape', `${a.id} takes its ${a.needs}: a relative file, a pattern or a patch, no NUL`, { action: a.id })
  const worktree = r.worktree ?? null
  const PARAMETRISED: Record<string, () => string[] | null> = {
    'worktree-remove': () => (typeof r.path === 'string' && WORKTREE_RE.test(r.path) ? [...a.args, r.path] : null),
    'branch-delete': () => (typeof r.branch === 'string' && BRANCH_RE.test(r.branch) && !r.branch.startsWith('-') && r.branch !== 'main' ? ['branch', r.archived === true ? '-D' : '-d', r.branch] : null),
    tag: () => (typeof r.tag === 'string' && TAG_RE.test(r.tag) && typeof r.commit === 'string' && SHA_RE.test(r.commit) ? ['tag', r.tag, r.commit] : null),
    port: () => (typeof r.file === 'string' && FILE_RE.test(r.file) && typeof r.from === 'string' && r.from.endsWith(`/${r.file}`) && WORKTREE_RE.test(r.from.slice(0, r.from.length - r.file.length - 1)) ? [r.from, r.file] : null),
  }
  if (PARAMETRISED[a.id]) {
    const args = PARAMETRISED[a.id]!()
    if (!args) return refuse('shape', `${a.id} takes its own parameters only: a worktree under .claude/worktrees, a branch other than main, an archive/ tag at a full commit, or a relative file of a worktree`, { action: a.id })
    return { allowed: true as const, action: a.id, kind: a.kind, command: { cmd: a.cmd, args }, input: null, worktree, decision: null, says: a.says, theorems: ['textbook_machine_allow_list'] }
  }
  const decision = a.workflow ? decideOf(a.workflow, r.facts ?? {}) : null
  // a commit runs the pre-commit hook itself, which reads the facts only the staged tree holds (the generated files compared, the staged literals)
  // and decides the same rules strictly: a rule unknown here is deferred to it, a rule violated here refuses at once; a push decides here, all of it
  const deferred = a.workflow === 'pre-commit' && decision && !decision.allowed && decision.violated.length === 0
  if (decision && !decision.allowed && !deferred) return { ...refuse('collision', `the ${a.workflow} rules refuse it: ${decision.says}`, { action: a.id, violated: decision.violated, unknown: decision.unknown }), decision }
  return { allowed: true as const, action: a.id, kind: a.kind, command: { cmd: a.cmd, args: a.needs === 'branch' ? [...a.args, r.branch!] : [...a.args, ...param] }, input: a.needs === 'message' ? r.message : a.needs === 'patch' ? r.patch : null, worktree, decision, deferred: deferred ? decision!.unknown : [], says: a.says, theorems: ['textbook_machine_allow_list'] }
}

export type MachineRun = { action: string; command: { cmd: string; args: readonly string[] }; status: number | null; stdout: string; stderr: string; ms: number; root: string; home?: string }
/** Paths made relative to the tree (the root as ., the home as ~) and, unless asked not to, every leak redacted by its kind: what any record may hold. */
export const redact = (text: string, root?: string, home?: string, leaks = true) => {
  let t = text; if (root) t = t.split(root).join('.'); if (home) t = t.split(home).join('~')
  if (leaks) for (const p of LEAK_PATTERNS) t = t.replace(p.re, (m) => (p.kind === 'email' && /^[0-9a-f-]{36}@/i.test(m) ? m : `[${p.kind}]`))
  return t
}
/** A run judged: redacted, the record a docket entry at its address. */
export const recordMachine = (run: MachineRun) => {
  const relative = redact(`${run.stdout}${run.stderr ? `\n${run.stderr}` : ''}`, run.root, run.home, false), found = listLeaks({ output: relative }), output = redact(relative)
  const body = { action: run.action, command: [run.command.cmd, ...run.command.args].join(' '), status: run.status, ms: run.ms, output, leaks: found.byKind }
  const text = entryTextOf({ kind: 'machine', from: 'local', body })
  const id = uuidOf(text)
  return { entry: { id, kind: 'machine', from: 'local', body, sha256: hex(sha256(utf8(text))) }, ok: run.status === 0, redacted: found.total, says: `${run.action} ${run.status === 0 ? 'ran' : `ended with status ${run.status}`} in ${run.ms} ms; ${found.total ? `${found.total} leak(s) redacted by kind; ` : ''}recorded at ${id}`, theorems: ['textbook_machine_allow_list', 'textbook_leaks_redacted'] }
}

/** One event of the stream: every step start and end, commit, penalty, question, decision and receipt, and a heartbeat every second while work runs. */
export type StreamEvent = { at: string; kind: string; subject: string; ms?: number; says: string; address?: string; eta?: number | null; elapsed?: number; options?: readonly string[] }
/** The forecast of a step's next time from its recorded times, estimated and labelled so, or absent when none is recorded (textbook_eta_from_receipts):
 *  the additive decomposition BigQuery ML's ARIMA_PLUS documents (a one-period moving-average trend, one index per phase summing to zero) when two
 *  periods are recorded, then simple exponential smoothing in exact rationals (each time weighed a/q, the level (q - a)/q; numerator and q^n kept
 *  as integers), and the interval the one-step errors give at 95 % (z = 1.96). TimesFM is the reference model, cited, never run here. */
export const forecastTimes = (times: readonly number[], o: { a?: number; q?: number; period?: number } = {}) => {
  if (!times.length) return null
  const a = BigInt(o.a ?? 3), q = BigInt(o.q ?? 10), m = o.period ?? 0, x = times.map(Math.round), n = x.length
  const trend = (i: number) => { const s = Math.max(0, Math.min(n - m, i - Math.floor(m / 2))); return x.slice(s, s + m).reduce((u, v) => u + v, 0) / m }
  const raw = m >= 2 && n >= 2 * m ? Array.from({ length: m }, (_, p) => { const d = x.flatMap((v, i) => (i % m === p ? [v - trend(i)] : [])); return d.reduce((u, v) => u + v, 0) / d.length }) : null
  const index = raw ? raw.map((v) => Math.round(v - raw.reduce((u, w) => u + w, 0) / m)) : null, y = x.map((v, i) => v - (index?.[i % m] ?? 0))
  let num = BigInt(y[0]!), den = 1n, sq = 0
  for (const v of y.slice(1)) { sq += (v - Number((num * 1000n) / den) / 1000) ** 2; num = a * BigInt(v) * den + (q - a) * num; den *= q }
  const level = Number((2n * num + den) / (2n * den)), point = Math.max(0, level + (index?.[n % m] ?? 0)), half = n > 2 ? Math.round(1.96 * Math.sqrt(sq / (n - 1))) : null
  return { estimated: true as const, point, interval: half === null ? null : [Math.max(0, point - half), point + half] as [number, number], confidence: 0.95, n, alpha: `${a}/${q}`, level: `${num}/${den}`, seasonal: index ? { period: m, index } : null, method: 'additive decomposition by a moving average (ARIMA_PLUS documents STL), then simple exponential smoothing in exact rationals (ARIMA_PLUS: an ARIMA trend, ETS seasonality, spikes, steps and holidays cleaned)', reference: 'TimesFM (google-research/timesfm), not run' }
}
/** The largest gap between consecutive events while work runs, against the heartbeat bound (textbook_stream_no_silence). */
const getSilence = (events: readonly Pick<StreamEvent, 'at'>[], boundMs = 1000) => {
  const ts = events.map((e) => Date.parse(e.at)).filter(Number.isFinite)
  let maxGapMs = 0, at: string | null = null
  for (let i = 1; i < ts.length; i++) if (ts[i]! - ts[i - 1]! > maxGapMs) { maxGapMs = ts[i]! - ts[i - 1]!; at = events[i]!.at }
  return { holds: maxGapMs <= boundMs, maxGapMs, boundMs, at, theorem: 'textbook_stream_no_silence' }
}
/** The status on request: what runs and its ETA from the receipts, the last events, the open questions (asked and not yet decided) and what is held. */
export const machineStatus = (s: { events: readonly StreamEvent[]; times?: Record<string, readonly number[]>; held?: unknown; last?: number; period?: number }) => {
  const ev = s.events, last = ev[ev.length - 1] ?? null
  const started = [...ev].reverse().find((e) => e.kind === 'step-start' && !ev.some((x) => x.kind === 'step-end' && x.subject === e.subject && x.at >= e.at)) ?? null
  const elapsed = started && last ? Date.parse(last.at) - Date.parse(started.at) : null
  const forecasts = Object.fromEntries(Object.entries(s.times ?? {}).map(([k, v]) => [k, forecastTimes(v, { period: s.period })])), f = started ? forecasts[started.subject] ?? null : null, eta = f?.point ?? null
  const questions = ev.filter((e) => e.kind === 'question' && !ev.some((x) => x.kind === 'decision' && x.subject === e.subject && x.at >= e.at))
  return { running: started ? { subject: started.subject, since: started.at, elapsed, eta, interval: f?.interval ?? null, remaining: eta !== null && elapsed !== null ? Math.max(0, eta - elapsed) : null } : null, last: ev.slice(-(s.last ?? 10)), questions, forecasts, held: s.held ?? null, silence: getSilence(ev), theorems: ['textbook_eta_from_receipts', 'textbook_stream_no_silence'] }
}
