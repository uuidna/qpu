// The MCP stdio transport over the pure handler: one JSON-RPC message per line in, one reply per line out, a notification (no id)
// answered with nothing. The harness that declares this server (.mcp.json, qpu-local) reaches the tree's current tools — the chat door
// among them — with no network and no key; every answer is the handler's own. Beside them, the developer machine: an action of the
// repository tool's allow-list, planned by its rules, run here with no shell by the one runner (scripts/machine.ts), and, when the call
// carries params._meta.progressToken, streamed as notifications/progress line by line (step by step for next) before the full record answers.
import { createInterface } from 'node:readline'
import { readFileSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { handle } from '../src/quantum/mcp.ts'
import { runMachine } from './machine.ts'

const ROOT = process.cwd()
const send = (m: unknown) => process.stdout.write(JSON.stringify(m) + '\n')
const callTool = (name: string, args: Record<string, unknown>): any => (handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }) as { result?: { structuredContent: unknown } }).result?.structuredContent
const read = (f: string): any => { try { return existsSync(join(ROOT, f)) ? JSON.parse(readFileSync(join(ROOT, f), 'utf8')) : null } catch { return null } }
const MACHINE_TOOL = { name: 'machine', description: 'The developer machine over stdio: one action of the allow-list (repository { machine: { actions: true } } names them) planned by the workflow rules and run here with no shell; a call carrying _meta.progressToken is streamed as notifications/progress, line by line, step by step for next; the answer is the full record.', inputSchema: { type: 'object', required: ['action'], properties: { action: { type: 'string', description: 'an action of the allow-list' }, message: { type: 'string', description: 'commit: the message' }, confirm: { type: 'boolean', description: 'push: the explicit confirmation' }, branch: { type: 'string', description: 'merge, branch-delete: the branch' }, path: { type: 'string', description: 'worktree-remove: the worktree under .claude/worktrees' }, tag: { type: 'string', description: 'tag: an archive/ name' }, commit: { type: 'string', description: 'tag: the full commit' }, from: { type: 'string', description: 'port: the file in a worktree' }, file: { type: 'string', description: 'port: the relative path in main' }, archived: { type: 'boolean', description: 'branch-delete: -D, when an archive tag points at its commit' } } } }
const answer = (id: unknown, x: unknown) => send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(x) }], structuredContent: x, _meta: { ui: { resourceUri: 'ui://qpu/repository' } } } })

const machine = async (id: unknown, args: Record<string, unknown>, progressToken: unknown) => {
  const facts = { receipt: read('docs/public/receipt.json'), approval: read('docs/public/configs.json')?.approval ?? null, e2e: read('docs/public/e2e.json')?.outcomes ?? null }
  const plan = callTool('repository', { machine: { plan: { action: args.action, message: args.message, confirm: args.confirm, branch: args.branch, path: args.path, tag: args.tag, commit: args.commit, from: args.from, file: args.file, archived: args.archived, facts } } })
  if (!plan?.allowed) return answer(id, plan)
  const run = await runMachine(plan, ROOT, (p) => { if (progressToken !== undefined) send({ jsonrpc: '2.0', method: 'notifications/progress', params: { progressToken, ...p } }) })
  const record = callTool('repository', { machine: { record: { action: plan.action, command: plan.command, status: run.status, stdout: run.stdout, stderr: run.stderr, ms: run.ms, root: ROOT, home: homedir() } } })
  answer(id, { plan: { action: plan.action, command: plan.command, decision: plan.decision?.says ?? null }, record: { says: record.says, ok: record.ok, redacted: record.redacted, entry: record.entry } })
}

const lines = createInterface({ input: process.stdin, crlfDelay: Infinity })
for await (const line of lines) {
  if (!line.trim()) continue
  let message: { id?: unknown; method?: string; params?: { name?: string; arguments?: Record<string, unknown>; _meta?: { progressToken?: unknown } } }
  try { message = JSON.parse(line) } catch { send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'parse error' } }); continue }
  if (message.id === undefined || message.id === null) continue
  if (message.method === 'tools/call' && message.params?.name === 'machine') { await machine(message.id, message.params.arguments ?? {}, message.params._meta?.progressToken); continue }
  const reply = handle(message as Parameters<typeof handle>[0]) as { result?: { tools?: unknown[] } }
  if (message.method === 'tools/list' && reply.result?.tools) reply.result.tools = [...reply.result.tools, MACHINE_TOOL]
  send(reply)
}
