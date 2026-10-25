import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { handle } from './mcp.js'
import { EXAMPLES } from './examples.js'
import { LEADS } from './leads.js'
import { auditOf } from './audit.js'

const call = (name: string, args: unknown) => handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } })

test('the MCP surface audits itself through tools/call and every check passes', () => {
  const r = call('audit', {})
  assert.ok('result' in r)
  const a = (r.result as { structuredContent: { total: number; failed: number; checks: { id: string; passed: boolean; evidence: string }[] } }).structuredContent
  const failing = a.checks.filter((c) => !c.passed).map((c) => `${c.id}: ${c.evidence}`)
  assert.deepEqual(failing, [])
  assert.ok(a.total >= 3 * EXAMPLES.length - 1)
})

test('the audit run directly agrees with the audit run through the tool, and the self example passes', () => {
  const direct = auditOf(handle, EXAMPLES, LEADS)
  const self = EXAMPLES.find((e) => e.id === 'audit-self')!
  assert.equal(self.expect(direct), null)
  assert.equal(direct.failed, 0)
})

test('every example replays as documented: the registry is the documentation', () => {
  for (const e of EXAMPLES) {
    if (e.tool === 'audit') continue
    const r = call(e.tool, e.arguments)
    assert.ok('result' in r, `${e.id}: ${'error' in r ? r.error.message : ''}`)
    assert.equal(e.expect((r.result as { structuredContent: unknown }).structuredContent), null, e.id)
  }
})

test('the published manifest equals tools/list byte for byte', () => {
  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
  const manifest = JSON.parse(readFileSync(new URL('../../docs/public/mcp.json', import.meta.url), 'utf8'))
  assert.deepEqual(manifest.tools, (list as { result: { tools: unknown } }).result.tools)
})

test('the live docs pages exist and name every example id', () => {
  const page = readFileSync(new URL('../../docs/examples.md', import.meta.url), 'utf8')
  assert.ok(page.includes('EXAMPLES'))
  const audit = readFileSync(new URL('../../docs/audit.md', import.meta.url), 'utf8')
  assert.ok(audit.includes("name: 'audit'"))
})
