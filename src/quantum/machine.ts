// The developer machine managed through the MCP, securely: an allow-list of local actions (reads of the tree's state, the writes the
// workflows already name), each planned here — refused with the court's case when the list does not name it, when its parameters are not
// its own, or when the workflow rules decided by theorems refuse it (a commit needs the flow green, a push the rules of pre-push and the
// user's confirmation) — and each run judged here: its output's paths made relative, its leaks redacted by kind, the whole a docket entry
// at its content address with its SHA-256, the same shape the Worker's docket and the Payload entries address. No shell, no arbitrary
// command: the one runner (scripts/machine.ts), called by the stdio transport and by the Payload MCP plugin's machine tool, executes only
// the argument vector a plan returns, streaming its lines as progress to a caller that sent a progress token.
import { uuidOf } from './blocks.js'
import { sha256, utf8, hex } from './hmac.js'
import { leaksOf, LEAK_PATTERNS } from './audit.js'
import { courtOf } from './toolboxes/legal.js'
import type { WorkflowFacts } from './toolboxes/repository.js'
type Decide = (name: 'pre-commit' | 'pre-push', facts: WorkflowFacts) => { allowed: boolean; says: string; violated: string[]; unknown: string[] }

export type MachineAction = { id: string; kind: 'read' | 'write'; cmd: string; args: readonly string[]; says: string; needs?: 'message' | 'confirm' | 'branch'; workflow?: 'pre-commit' | 'pre-push' }
/** A branch a merge may name: letters, digits, dot, underscore, slash and dash, never starting with a dash (it would be read as an option). */
export const BRANCH_RE = /^[A-Za-z0-9._/-]{1,200}$/
export const MACHINE_ACTIONS: readonly MachineAction[] = [
  { id: 'status', kind: 'read', cmd: 'git', args: ['status', '--porcelain=v1', '--branch'], says: 'the working tree: what changed, the branch and how far it is from its remote' },
  { id: 'log', kind: 'read', cmd: 'git', args: ['log', '--oneline', '-n', '50'], says: 'the last fifty commits' },
  { id: 'ahead', kind: 'read', cmd: 'git', args: ['rev-list', '--left-right', '--count', 'origin/main...main'], says: 'how many commits the remote and this branch each hold that the other does not' },
  { id: 'tags', kind: 'read', cmd: 'git', args: ['tag', '--sort=-creatordate'], says: 'the release tags, newest first' },
  { id: 'diff', kind: 'read', cmd: 'git', args: ['diff', '--stat'], says: 'what the unstaged changes touch' },
  { id: 'versions', kind: 'read', cmd: 'node', args: ['--version'], says: 'the runtime this machine runs the tree with' },
  { id: 'next', kind: 'write', cmd: 'npm', args: ['run', 'next', '--', '--offline', '--fast'], says: 'the development loop, offline and fast: generation, typecheck, tests, Lean, audit, purify' },
  { id: 'precheck', kind: 'write', cmd: 'node', args: ['--import', 'tsx', 'scripts/hook.ts', 'pre-deploy'], says: 'the strict pre-check before a deploy: the OpenNext build, the dry run and the rules decided by theorems; nothing deployed' },
  { id: 'stage', kind: 'write', cmd: 'git', args: ['add', '-A'], says: 'every change staged for the next commit' },
  { id: 'commit', kind: 'write', cmd: 'git', args: ['commit', '-F', '-'], says: 'the staged changes committed through the hooks, the message given', needs: 'message', workflow: 'pre-commit' },
  { id: 'push', kind: 'write', cmd: 'git', args: ['push', 'origin', 'main'], says: 'main pushed to its remote through the pre-push workflow', needs: 'confirm', workflow: 'pre-push' },
  { id: 'dispatch', kind: 'write', cmd: 'gh', args: ['workflow', 'run', 'deploy.yml', '--ref', 'main'], says: 'the deploy workflow started on GitHub for main: it runs in the protected production environment, whose reviewer approves it before any secret in GitHub Secrets is exposed, then next, the pre-deploy theorems, the deploy and the publish; started only through the super admin\'s machine tool and the pre-push rules', needs: 'confirm', workflow: 'pre-push' },
  { id: 'merge', kind: 'write', cmd: 'git', args: ['merge', '--no-ff', '--no-edit'], says: 'a branch merged into the current one, never fast-forwarded, under the pre-commit rules decided by theorems; the branch is the one parameter', needs: 'branch', workflow: 'pre-commit' },
  { id: 'idle', kind: 'write', cmd: 'node', args: ['--import', 'tsx', 'scripts/idle.ts'], says: 'unused quantum capacity measured in the background, never inside a hook: the state the hooks read written, the largest idle items raised as idle gaps and the used ones annihilated, progress line by line' },
  { id: 'regenerate', kind: 'write', cmd: 'node', args: ['--import', 'tsx', 'scripts/regenerate.ts'], says: 'the generators in their order: the docs and the Lean file, every configuration, the theorem index and purity' },
  { id: 'worktree-remove', kind: 'write', cmd: 'git', args: ['worktree', 'remove', '--force'], says: 'a worktree removed: only on the user\'s confirmation', needs: 'confirm' },
  { id: 'branch-delete', kind: 'write', cmd: 'git', args: ['branch', '-d'], says: 'a branch deleted when merged (-D only when an archive tag already points at its commit): only on the user\'s confirmation', needs: 'confirm' },
  { id: 'tag', kind: 'write', cmd: 'git', args: ['tag'], says: 'a local archive tag at a commit, never pushed by this action: only on the user\'s confirmation', needs: 'confirm' },
  { id: 'port', kind: 'write', cmd: 'cp', args: [], says: 'one file of a worktree copied onto the same path in main, to be committed through the hook: only on the user\'s confirmation', needs: 'confirm' },
  { id: 'now', kind: 'read', cmd: 'node', args: ['--import', 'tsx', 'scripts/machine.ts', 'now'], says: 'the status on request: what runs, for how long, its ETA, the last events, the open questions and what is held' },
  { id: 'site-audit', kind: 'read', cmd: 'pnpm', args: ['--dir', 'site', 'audit'], says: 'the app\'s dependency advisories, by severity' },
  { id: 'site-install', kind: 'write', cmd: 'pnpm', args: ['--dir', 'site', 'install'], says: 'the app\'s dependencies installed as its package.json and overrides name them: only on the user\'s confirmation', needs: 'confirm' },
  { id: 'site-build', kind: 'write', cmd: 'pnpm', args: ['--dir', 'site', 'exec', 'next', 'build', '--webpack'], says: 'the app built and type-checked by next build, no database migrated: only on the user\'s confirmation', needs: 'confirm' },
]

/** The parameters of the actions that discard or move work, checked before anything runs. */
const WORKTREE_RE = /^\.claude\/worktrees\/[A-Za-z0-9._-]{1,120}$/
const FILE_RE = /^(?![/.-])(?!.*\.\.)[A-Za-z0-9._/-]{1,300}$/
const TAG_RE = /^archive\/[A-Za-z0-9._-]{1,120}$/
const SHA_RE = /^[0-9a-f]{40}$/

export type MachineRequest = { action?: string; message?: string; confirm?: boolean; branch?: string; path?: string; tag?: string; commit?: string; from?: string; file?: string; archived?: boolean; facts?: WorkflowFacts }
/** The plan of one action: allowed with its argument vector (and the message as its input), or refused with the court's case. */
export const machinePlanOf = (r: MachineRequest, decideOf: Decide) => {
  const a = MACHINE_ACTIONS.find((x) => x.id === r.action)
  const refuse = (rule: string, why: string, evidence: unknown) => ({ allowed: false as const, action: r.action ?? null, refused: why, court: courtOf({ gate: `machine ${r.action ?? '?'}`, rule, evidence }), theorems: ['textbook_machine_allow_list', 'textbook_cheap_gates'] })
  if (!a) return refuse('route', `the allow-list names no action ${String(r.action)}: ${MACHINE_ACTIONS.map((x) => x.id).join(', ')}`, { asked: r.action })
  if (a.needs === 'message' && (typeof r.message !== 'string' || !r.message.trim() || r.message.length > 20000 || r.message.includes('\u0000'))) return refuse('shape', `${a.id} takes a message: one line at least, no NUL`, { action: a.id })
  if (a.needs === 'branch' && (typeof r.branch !== 'string' || !BRANCH_RE.test(r.branch) || r.branch.startsWith('-'))) return refuse('shape', `${a.id} takes a branch: letters, digits, . _ / -, up to 200, never starting with a dash`, { action: a.id, branch: r.branch ?? null })
  if (a.needs === 'confirm' && r.confirm !== true) return refuse('role', `${a.id} leaves the machine: it runs only on the user's explicit confirmation (confirm: true)`, { action: a.id })
  const PARAMETRISED: Record<string, () => string[] | null> = {
    'worktree-remove': () => (typeof r.path === 'string' && WORKTREE_RE.test(r.path) ? [...a.args, r.path] : null),
    'branch-delete': () => (typeof r.branch === 'string' && BRANCH_RE.test(r.branch) && !r.branch.startsWith('-') && r.branch !== 'main' ? ['branch', r.archived === true ? '-D' : '-d', r.branch] : null),
    tag: () => (typeof r.tag === 'string' && TAG_RE.test(r.tag) && typeof r.commit === 'string' && SHA_RE.test(r.commit) ? ['tag', r.tag, r.commit] : null),
    port: () => (typeof r.file === 'string' && FILE_RE.test(r.file) && typeof r.from === 'string' && r.from.endsWith(`/${r.file}`) && WORKTREE_RE.test(r.from.slice(0, r.from.length - r.file.length - 1)) ? [r.from, r.file] : null),
  }
  if (PARAMETRISED[a.id]) {
    const args = PARAMETRISED[a.id]!()
    if (!args) return refuse('shape', `${a.id} takes its own parameters only: a worktree under .claude/worktrees, a branch other than main, an archive/ tag at a full commit, or a relative file of a worktree`, { action: a.id })
    return { allowed: true as const, action: a.id, kind: a.kind, command: { cmd: a.cmd, args }, input: null, decision: null, says: a.says, theorems: ['textbook_machine_allow_list'] }
  }
  const decision = a.workflow ? decideOf(a.workflow, r.facts ?? {}) : null
  // a commit runs the pre-commit hook itself, which reads the facts only the staged tree holds (the generated files compared, the staged literals)
  // and decides the same rules strictly: a rule unknown here is deferred to it, a rule violated here refuses at once; a push decides here, all of it
  const deferred = a.workflow === 'pre-commit' && decision && !decision.allowed && decision.violated.length === 0
  if (decision && !decision.allowed && !deferred) return { ...refuse('collision', `the ${a.workflow} rules refuse it: ${decision.says}`, { action: a.id, violated: decision.violated, unknown: decision.unknown }), decision }
  return { allowed: true as const, action: a.id, kind: a.kind, command: { cmd: a.cmd, args: a.needs === 'branch' ? [...a.args, r.branch!] : [...a.args] }, input: a.needs === 'message' ? r.message : null, decision, deferred: deferred ? decision!.unknown : [], says: a.says, theorems: ['textbook_machine_allow_list'] }
}

export type MachineRun = { action: string; command: { cmd: string; args: readonly string[] }; status: number | null; stdout: string; stderr: string; ms: number; root: string; home?: string }
/** A run judged: paths made relative to the tree (the root as ., the home as ~), every leak redacted by its kind, the record a docket entry at its address. */
export const machineRecordOf = (run: MachineRun) => {
  const relative = (s: string) => { let t = s; if (run.root) t = t.split(run.root).join('.'); if (run.home) t = t.split(run.home).join('~'); return t }
  let output = relative(`${run.stdout}${run.stderr ? `\n${run.stderr}` : ''}`)
  const found = leaksOf({ output })
  for (const p of LEAK_PATTERNS) output = output.replace(p.re, (m) => (p.kind === 'email' && /^[0-9a-f-]{36}@/i.test(m) ? m : `[${p.kind}]`))
  const body = { action: run.action, command: [run.command.cmd, ...run.command.args].join(' '), status: run.status, ms: run.ms, output, leaks: found.byKind }
  const text = JSON.stringify({ kind: 'machine', from: 'local', body })
  const id = uuidOf(text)
  return { entry: { id, kind: 'machine', from: 'local', body, sha256: hex(sha256(utf8(text))) }, ok: run.status === 0, redacted: found.total, says: `${run.action} ${run.status === 0 ? 'ran' : `ended with status ${run.status}`} in ${run.ms} ms; ${found.total ? `${found.total} leak(s) redacted by kind; ` : ''}recorded at ${id}`, theorems: ['textbook_machine_allow_list', 'textbook_leaks_redacted'] }
}

/** One event of the stream: every step start and end, commit, penalty, question, decision and receipt, and a heartbeat every second while work runs. */
export type StreamEvent = { at: string; kind: string; subject: string; ms?: number; says: string; address?: string; eta?: number | null; elapsed?: number; options?: readonly string[] }
/** An ETA is the mean of the recorded times, or absent: never a constant (textbook_eta_from_receipts). */
export const etaOf = (times: readonly number[]): number | null => (times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : null)
/** The largest gap between consecutive events while work runs, against the heartbeat bound (textbook_stream_no_silence). */
export const silenceOf = (events: readonly Pick<StreamEvent, 'at'>[], boundMs = 1000) => {
  const ts = events.map((e) => Date.parse(e.at)).filter(Number.isFinite)
  let maxGapMs = 0, at: string | null = null
  for (let i = 1; i < ts.length; i++) if (ts[i]! - ts[i - 1]! > maxGapMs) { maxGapMs = ts[i]! - ts[i - 1]!; at = events[i]!.at }
  return { holds: maxGapMs <= boundMs, maxGapMs, boundMs, at, theorem: 'textbook_stream_no_silence' }
}
/** The status on request: what runs and its ETA from the receipts, the last events, the open questions (asked and not yet decided) and what is held. */
export const statusOf = (s: { events: readonly StreamEvent[]; times?: Record<string, readonly number[]>; held?: unknown; last?: number }) => {
  const ev = s.events, last = ev[ev.length - 1] ?? null
  const started = [...ev].reverse().find((e) => e.kind === 'step-start' && !ev.some((x) => x.kind === 'step-end' && x.subject === e.subject && x.at >= e.at)) ?? null
  const elapsed = started && last ? Date.parse(last.at) - Date.parse(started.at) : null
  const eta = started ? etaOf(s.times?.[started.subject] ?? []) : null
  const questions = ev.filter((e) => e.kind === 'question' && !ev.some((x) => x.kind === 'decision' && x.subject === e.subject && x.at >= e.at))
  return { running: started ? { subject: started.subject, since: started.at, elapsed, eta, remaining: eta !== null && elapsed !== null ? Math.max(0, eta - elapsed) : null } : null, last: ev.slice(-(s.last ?? 10)), questions, held: s.held ?? null, silence: silenceOf(ev), theorems: ['textbook_eta_from_receipts', 'textbook_stream_no_silence'] }
}
