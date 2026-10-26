// The MCP stdio transport over the pure handler: one JSON-RPC message per line in, one reply per line out, a notification (no id)
// answered with nothing. The harness that declares this server (.mcp.json, qpu-local) reaches the tree's current tools — the chat door
// among them — with no network and no key; every answer is the handler's own.
import { createInterface } from 'node:readline'
import { handle } from '../src/quantum/mcp.ts'

const lines = createInterface({ input: process.stdin, crlfDelay: Infinity })
for await (const line of lines) {
  if (!line.trim()) continue
  let message: { id?: unknown; method?: string }
  try { message = JSON.parse(line) } catch { process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'parse error' } }) + '\n'); continue }
  if (message.id === undefined || message.id === null) continue
  process.stdout.write(JSON.stringify(handle(message as Parameters<typeof handle>[0])) + '\n')
}
