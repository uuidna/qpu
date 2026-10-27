// The one QPU MCP over stdio, a proxy of Payload: the keychain mocked by a security on the PATH, the local app a stub (or a closed port).
import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdtempSync, writeFileSync, chmodSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawn } from 'node:child_process'

const proxied = async (port: number, stub?: (m: any, auth?: string) => unknown) => {
  const bin = mkdtempSync(join(tmpdir(), 'qpu-')); writeFileSync(join(bin, 'security'), '#!/bin/sh\necho k-from-keychain\n'); chmodSync(join(bin, 'security'), 0o755)
  const server = stub && createServer((req, res) => { let b = ''; req.on('data', (c) => (b += c)).on('end', () => { const m = JSON.parse(b); res.setHeader('content-type', 'application/json'); res.end(m.id === undefined ? '' : JSON.stringify({ jsonrpc: '2.0', id: m.id, result: stub(m, req.headers.authorization) })) }) }).listen(port)
  const child = spawn('node', ['scripts/stdio.ts'], { env: { ...process.env, PATH: bin + ':' + process.env.PATH, QPU_LOCAL_MCP: `http://127.0.0.1:${port}/api/mcp`, QPU_APP_MCP: '', QPU_APP_KEY: 'env-key' } })
  let out = ''; child.stdout.on('data', (c) => (out += c)); child.stdin.end(['initialize', 'tools/list', 'tools/call'].map((method, id) => JSON.stringify({ jsonrpc: '2.0', id, method, params: method === 'tools/call' ? { name: 'findPages', arguments: { text: 'x' } } : {} })).join('\n') + '\n')
  await new Promise((r) => child.on('close', r)); server?.close()
  return { out, replies: out.split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l)) }
}
test('with no Payload app, tools/list names the probe in one entry and a call is an error naming it', async () => {
  const { replies } = await proxied(39741)
  assert.deepEqual([replies[1].result.tools.length, /site-local\.sh start/.test(replies[1].result.tools[0].description), /QPU_APP_MCP/.test(replies[2].error.message)], [1, true, true])
})
test('with a Payload endpoint it lists that endpoint\'s tools and forwards a call, the key from the keychain alone and never printed', async () => {
  const seen: (string | undefined)[] = [], { out, replies } = await proxied(39742, (m, auth) => (seen.push(auth), m.method === 'tools/list' ? { tools: [{ name: 'findPages', inputSchema: { type: 'object' } }] } : m.method === 'tools/call' ? { content: [{ type: 'text', text: 'found ' + m.params.arguments.text }] } : {}))
  assert.deepEqual([replies[1].result.tools.map((t: { name: string }) => t.name), replies[2].result.content[0].text, replies[2].result._meta.source], [['findPages'], 'found x', 'local'])
  assert.ok(seen.length >= 3 && seen.every((a) => a === 'Bearer k-from-keychain') && !out.includes('k-from-keychain'))
})
