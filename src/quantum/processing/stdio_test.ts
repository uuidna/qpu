// The QPU MCP over stdio: the kernel's own server on the SDK's stdio door, answering a harness that starts a command.
import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: started as a command, it initializes, lists every tool, answers a call, and runs this machine's git only through the allow-list. */
test('started as a command, it initializes, lists every tool, answers a call, and runs this machine\'s git only through the allow-list', async () => {
  const child = spawn('node', ['scripts/stdio.ts'], { env: { ...process.env, QPU_X402_RECIPIENT: '' } })
  const lines: Record<string, any>[] = []
  let out = ''
  const answered = new Promise<void>((done) => child.stdout.on('data', (c) => { out += c; const all = out.split('\n'); out = all.pop()!; for (const l of all) if (l.trim()) lines.push(JSON.parse(l)); if ([2, 3, 4, 5, 6].every((id) => lines.some((m) => m.id === id))) done() }))
  const send = (m: object) => child.stdin.write(JSON.stringify({ jsonrpc: '2.0', ...m }) + '\n')
  send({ id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'harness', version: '1' } } })
  send({ method: 'notifications/initialized' })
  send({ id: 2, method: 'tools/list' })
  send({ id: 3, method: 'tools/call', params: { name: 'currency', arguments: { selftest: true } } })
  send({ id: 4, method: 'tools/call', params: { name: 'machine', arguments: { action: 'status' } } })
  send({ id: 5, method: 'tools/call', params: { name: 'machine', arguments: { action: 'push' } } })
  send({ id: 6, method: 'tools/call', params: { name: 'machine', arguments: { action: 'stage' } } })
  await answered
  child.kill()
  const by = (id: number) => lines.find((m) => m.id === id)!
  assert.deepEqual([by(1).result.serverInfo.name, by(2).result.tools.length > 40, by(3).result.isError ?? false], ['qpu', true, false])
  // this machine's git, through the allow-list: a read runs and is recorded, a push without confirmation and a stage without paths are refused
  const status = by(4).result.structuredContent, push = by(5).result.structuredContent, stage = by(6).result.structuredContent
  assert.deepEqual([by(2).result.tools.some((t: { name: string }) => t.name === 'machine'), status.record.ok, status.plan.command.args[0], push.allowed, push.court.rule, stage.allowed], [true, true, 'status', false, 'role', false])
})
