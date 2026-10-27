// The MCP stdio transport over the pure handler: one JSON-RPC message per line in, one reply per line out, a notification (no id)
// answered with nothing. The harness that declares this server (.mcp.json, qpu-local) reaches the tree's current tools — the chat door
// among them — with no network and no key; every answer is the handler's own. Beside them, the developer machine: an action of the
// repository tool's allow-list, planned by its rules, run here with no shell by the one runner (scripts/machine.ts), and, when the call
// carries params._meta.progressToken, streamed as notifications/progress line by line (step by step for next) before the full record answers.
import { createInterface } from 'node:readline'
import { handle } from '../src/quantum/mcp.ts'
import { runMachine } from './machine.ts'

const ROOT = process.cwd()
const send = (m: unknown) => process.stdout.write(JSON.stringify(m) + '\n')
const MACHINE_TOOL = { name: 'machine', description: 'The developer machine over stdio: one action of the allow-list (repository { machine: { actions: true } } names them) planned by the workflow rules and run here with no shell; a call carrying _meta.progressToken is streamed as notifications/progress, line by line, step by step for next; the answer is the full record.', inputSchema: { type: 'object', required: ['action'], properties: { action: { type: 'string', description: 'an action of the allow-list' }, message: { type: 'string', description: 'commit: the message' }, confirm: { type: 'boolean', description: 'push: the explicit confirmation' }, branch: { type: 'string', description: 'merge, branch-delete: the branch' }, path: { type: 'string', description: 'worktree-remove: the worktree under .claude/worktrees' }, tag: { type: 'string', description: 'tag: an archive/ name' }, commit: { type: 'string', description: 'tag: the full commit' }, from: { type: 'string', description: 'port: the file in a worktree' }, file: { type: 'string', description: 'port: the relative path in main' }, archived: { type: 'boolean', description: 'branch-delete: -D, when an archive tag points at its commit' } } } }
const answer = (id: unknown, x: unknown) => send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(x) }], structuredContent: x, _meta: { ui: { resourceUri: 'ui://qpu/repository' } } } })

const machine = async (id: unknown, args: Record<string, unknown>, progressToken: unknown) => answer(id, (await runMachine(args, ROOT, (p) => { if (progressToken !== undefined) send({ jsonrpc: '2.0', method: 'notifications/progress', params: { progressToken, ...p } }) })).answer)

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
