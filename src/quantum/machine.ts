// The developer machine managed through the MCP, securely: an allow-list of local actions (reads of the tree's state, the writes the
// workflows already name), each planned here — refused with the court's case when the list does not name it, when its parameters are not
// its own, or when the workflow rules decided by theorems refuse it (a commit needs the flow green, a push the rules of pre-push and the
// user's confirmation) — and each run judged here: its output's paths made relative, its leaks redacted by kind, the whole a docket entry
// at its content address with its SHA-256, the same shape the Worker's docket and the Payload entries address. No shell, no arbitrary
// command: the local server (scripts/machine.ts) executes only the argument vector a plan returns.
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
  { id: 'regenerate', kind: 'write', cmd: 'node', args: ['--import', 'tsx', 'scripts/regenerate.ts'], says: 'the generators in their order: the docs and the Lean file, every configuration, the theorem index and purity' },
]

export type MachineRequest = { action?: string; message?: string; confirm?: boolean; branch?: string; facts?: WorkflowFacts }
/** The plan of one action: allowed with its argument vector (and the message as its input), or refused with the court's case. */
export const machinePlanOf = (r: MachineRequest, decideOf: Decide) => {
  const a = MACHINE_ACTIONS.find((x) => x.id === r.action)
  const refuse = (rule: string, why: string, evidence: unknown) => ({ allowed: false as const, action: r.action ?? null, refused: why, court: courtOf({ gate: `machine ${r.action ?? '?'}`, rule, evidence }), theorems: ['textbook_machine_allow_list', 'textbook_cheap_gates'] })
  if (!a) return refuse('route', `the allow-list names no action ${String(r.action)}: ${MACHINE_ACTIONS.map((x) => x.id).join(', ')}`, { asked: r.action })
  if (a.needs === 'message' && (typeof r.message !== 'string' || !r.message.trim() || r.message.length > 20000 || r.message.includes('\u0000'))) return refuse('shape', `${a.id} takes a message: one line at least, no NUL`, { action: a.id })
  if (a.needs === 'branch' && (typeof r.branch !== 'string' || !BRANCH_RE.test(r.branch) || r.branch.startsWith('-'))) return refuse('shape', `${a.id} takes a branch: letters, digits, . _ / -, up to 200, never starting with a dash`, { action: a.id, branch: r.branch ?? null })
  if (a.needs === 'confirm' && r.confirm !== true) return refuse('role', `${a.id} leaves the machine: it runs only on the user's explicit confirmation (confirm: true)`, { action: a.id })
  const decision = a.workflow ? decideOf(a.workflow, r.facts ?? {}) : null
  if (decision && !decision.allowed) return { ...refuse('collision', `the ${a.workflow} rules refuse it: ${decision.says}`, { action: a.id, violated: decision.violated, unknown: decision.unknown }), decision }
  return { allowed: true as const, action: a.id, kind: a.kind, command: { cmd: a.cmd, args: a.needs === 'branch' ? [...a.args, r.branch!] : [...a.args] }, input: a.needs === 'message' ? r.message : null, decision, says: a.says, theorems: ['textbook_machine_allow_list'] }
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
