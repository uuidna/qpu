// Overclaims processed as underclaims: match never serves a weak or unreplayed match, and a genuine match still serves.
import test from 'node:test'
import assert from 'node:assert/strict'
import { callOf } from './mcp.ts'

const match = (statement: string) => (callOf('match', { statement }) as { result: { structuredContent: Record<string, unknown> } }).result.structuredContent

test('an open frontier is an underclaim: unknown, routed towards discovery, never a false served', () => {
  for (const q of ['Prove the Riemann hypothesis', 'Prove or disprove P equals NP', 'Prove Goldbach conjecture', 'Prove the Hodge conjecture']) {
    const m = match(q)
    assert.equal(m.verdict, 'unknown', q)
    assert.equal((m.lead as { tool?: string }).tool, 'discover', `${q} routed towards discovery`)
    assert.equal(m.theorem, undefined, `${q} names no theorem as its proof`)
    assert.match((m.evidence as string[]).join(' '), /only the proven is admitted|overclaim is processed as an underclaim/)
  }
})

test('a genuine served match still serves (the gate downgrades only overclaims)', () => {
  const m = match('show me the dashboard of algorithm')
  assert.equal(m.verdict, 'served')
  assert.equal(m.tool, 'dashboard')
})

test('an impossible frontier stays impossible, reflected towards its possibility (not served, not silently denied)', () => {
  const m = match('Factor a 2048-bit RSA modulus')
  assert.equal(m.verdict, 'impossible')
  assert.ok((m.reflection as { leads: unknown[] }).leads.length >= 1, 'the σ-reflection opens the possible neighbourhood')
})
