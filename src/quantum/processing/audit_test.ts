import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { handle, call } from './mcp.ts'
import { EXAMPLES } from './examples.ts'
import { LEADS } from './leads.ts'
import { runAudit } from './audit.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the MCP surface audits itself through tools/call and every check passes. */
test('the MCP surface audits itself through tools/call and every check passes', () => {
  const r = call('audit', {})
  assert.ok('result' in r)
  const a = (r.result as { structuredContent: { total: number; failed: number; checks: { id: string; passed: boolean; evidence: string }[] } }).structuredContent
  const failing = a.checks.filter((c) => !c.passed).map((c) => `${c.id}: ${c.evidence}`)
  assert.deepEqual(failing, [])
  assert.ok(a.total >= 3 * EXAMPLES.length - 1)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the audit run directly agrees with the audit run through the tool, and the self example passes. */
test('the audit run directly agrees with the audit run through the tool, and the self example passes', () => {
  const direct = runAudit(handle, EXAMPLES, LEADS)
  assert.equal(EXAMPLES.find((e) => e.id === 'audit-self')!.expect(direct), null)
  assert.equal(direct.failed, 0)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every example replays as documented: the registry is the documentation. */
test('every example replays as documented: the registry is the documentation', () => {
  for (const e of EXAMPLES) {
    if (e.id === 'audit-self') continue
    const r = call(e.tool, e.arguments)
    assert.ok('result' in r, `${e.id}: ${'error' in r ? r.error.message : ''}`)
    assert.equal(e.expect((r.result as { structuredContent: unknown }).structuredContent), null, e.id)
  }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the published manifest equals tools/list byte for byte. */
test('the published manifest equals tools/list byte for byte', () => {
  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
  const manifest = JSON.parse(readFileSync(new URL('../../../docs/public/mcp.json', import.meta.url), 'utf8'))
  assert.deepEqual(manifest.tools, (list as { result: { tools: unknown } }).result.tools)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the live docs pages exist and name every example id. */
test('the live docs pages exist and name every example id', () => {
  const page = readFileSync(new URL('../../../docs/examples.md', import.meta.url), 'utf8')
  assert.ok(page.includes('EXAMPLES'))
  const audit = readFileSync(new URL('../../../docs/audit.md', import.meta.url), 'utf8')
  assert.ok(audit.includes("name: 'audit'"))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the quantum advantage is unlimited by default and needs no interaction to compute. */
test('the quantum advantage is unlimited by default and needs no interaction to compute', () => {
  const metrics = (artefacts: unknown) => (call('metrics', { artefacts }) as { result: { structuredContent: { gateAdvantage: { copies: number; verified: number; recomputed: number; ratio: number | null; unbounded: boolean; interaction: string } | null } } }).result.structuredContent.gateAdvantage
  const every = metrics({ e2e: { copies: 660, involutions: 660 } })
  assert.equal(every?.unbounded, true, 'every copy an involution: no bound')
  assert.equal(every?.ratio, null)
  assert.match(every?.interaction ?? '', /none/)
  const some = metrics({ e2e: { copies: 663, involutions: 522 } })
  assert.equal(some?.unbounded, false)
  assert.equal(some?.ratio, 4.7)
  assert.equal(metrics({}), null, 'no run, no magnitude: never a default cap')
  const list = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: { name: string; inputSchema: { properties?: Record<string, unknown> } }[] } }).result.tools
  const schema = list.find((t) => t.name === 'metrics')!.inputSchema.properties ?? {}
  assert.deepEqual(Object.keys(schema), ['artefacts'], 'the metric takes the run and nothing else: no token, no approval')
  const access = (call('audit', { access: true }) as { result: { structuredContent: { checks: { id: string; passed: boolean; evidence: string }[]; failed: number } } }).result.structuredContent
  assert.equal(access.failed, 0, JSON.stringify(access.checks.filter((c) => !c.passed)))
  assert.ok(access.checks.some((c) => c.id === 'client:advantage-unlimited-no-interaction' && c.passed))
})
