import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker, { qpuHarnessesHolds, qpuHarnessesOf, qpuReadmeOf } from './index.js'

// INTEGRATE IN ANY HARNESS: eight recipes computed from the origin, served on initialize, printed in the README from
// the same function. Every recipe carries the URL; every named recipe carries the server name; two calls agree.
test('the harness recipes carry the URL and the name, and initialize serves them', async () => {
  const h = qpuHarnessesOf()
  assert.equal(qpuHarnessesHolds(h), true)
  assert.equal(h.rows.length, 8)
  assert.equal(h.url, 'https://qpu.uuidna.com/mcp')
  assert.deepEqual(h.rows.map((r) => r.harness), ['Claude Code', 'Cursor', 'VS Code', 'OpenAI Codex CLI', 'Gemini CLI', 'Anthropic Messages API', 'OpenAI Responses API', 'Any HTTP client'])
  for (const r of h.rows) assert.ok(JSON.stringify(r).includes(h.url), r.harness)
  assert.deepEqual(qpuHarnessesOf(), h)
  const res = await worker.fetch(
    new Request('https://qpu.uuidna.com/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'text/html' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'harness', version: '1' } } }),
    }),
    { QPU_HOST: 'qpu.uuidna.com' },
  )
  const body = (await res.json()) as { result: { install: { rows: { harness: string }[] } } }
  assert.equal(body.result.install.rows.length, 8)
  const readme = qpuReadmeOf()
  assert.equal(readme.includes('claude mcp add --transport http'), true)
  assert.equal(readme.includes('.vscode/mcp.json'), true)
  assert.equal(readme.includes('[mcp_servers.uuidna-qpu]'), true)
})
