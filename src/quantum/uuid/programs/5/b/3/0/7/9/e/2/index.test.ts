import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { handle, call } from '../../../../../../../../3/8/5/9/0/2/0/f/index.ts'
import { EXAMPLES } from '../../../../../../../../9/d/4/f/e/4/4/2/index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the MCP surface audits itself through tools/call and every check passes. */
test('the MCP surface audits itself through tools/call and every check passes', () => {
  // one audit run: it replays every example and checks each against its documented expectation, so no other test
  // of this file replays them again
  const r = call('audit', {})
  assert.ok('result' in r)
  const a = (r.result as { structuredContent: { total: number; failed: number; checks: { id: string; passed: boolean; evidence: string }[] } }).structuredContent
  const failing = a.checks.filter((c) => !c.passed).map((c) => `${c.id}: ${c.evidence}`)
  assert.deepEqual(failing, [])
  assert.ok(a.total >= 3 * EXAMPLES.length - 1)
  assert.equal(a.failed, 0)
  // the audit's own example reads the same run
  assert.equal(EXAMPLES.find((e) => e.id === 'audit-self')!.expect(a), null)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the published manifest equals tools/list byte for byte. */
test('the published manifest equals tools/list byte for byte', () => {
  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
  const manifest = JSON.parse(readFileSync(new URL('../../../../../../../../../../../../docs/public/mcp.json', import.meta.url), 'utf8'))
  assert.deepEqual(manifest.tools, (list as { result: { tools: unknown } }).result.tools)
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
})
