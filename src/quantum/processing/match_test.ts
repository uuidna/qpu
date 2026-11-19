import test from 'node:test'
import assert from 'node:assert/strict'
import { handle, call } from './mcp.ts'
import { EXAMPLES } from './examples.ts'
import { LEADS } from './leads.ts'
import { matchStatement, tokens, translateVerdict, listForeignVerdicts } from './match.ts'
import { GLAGOLITIC, toGlagolitic, listNumerals, translate } from './i18n.ts'

const match = (statement: string) => matchStatement(statement, handle, EXAMPLES, LEADS)

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the chat routes a prompt to the theorems via the theorems: the subject decides, a common word routes nowhere, no route is a lead. */
test('the chat routes a prompt to the theorems via the theorems: the subject decides, a common word routes nowhere, no route is a lead', () => {
  const coil = match('what colour is the coil when coins fuse')
  assert.equal(coil.route?.theorems[0]?.theorem, 'textbook_coil_green')
  const shor = match('factor 15 with shor')
  assert.equal(shor.route?.theorems[0]?.theorem, 'shor_factored')
  const none = match('hello there')
  assert.equal(none.route?.routed, false)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a statement the surface serves is matched, called, and returned with its lead. */
test('a statement the surface serves is matched, called, and returned with its lead', () => {
  const m = match('How many qubits does Willow have?')
  assert.equal(m.verdict, 'served')
  assert.equal(m.tool, 'processor')
  assert.equal((m.result as { qubits: number }).qubits, 105)
  assert.equal(m.lead.status, 'served')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the integer in RSA-2048 is factored, and no schema ceiling at 21 refuses it. */
test('the integer in RSA-2048 is factored, and no schema ceiling at 21 refuses it', () => {
  const m = match('Factor RSA-2048 with Shor')
  const f = m.reflection.factors.find((x) => x.n === 2048)!
  assert.equal(f.factors, '2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2')
  assert.ok(!m.evidence.some((e) => e.includes('21')), m.evidence.join('; '))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a statement about an out-of-scope lead is unknown, the lead its missing witness: a stored reason is no refutation recomputed now. */
test('a statement about an out-of-scope lead is unknown, the lead its missing witness: a stored reason is no refutation recomputed now', () => {
  const m = match('list the careers jobs page')
  assert.equal(m.verdict, 'unknown'); assert.equal(m.state, 'gas')
  assert.ok(m.evidence[0]!.includes('out_of_scope') && m.witnesses!.missing[0]!.includes('out_of_scope'))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a statement nothing serves becomes a new lead to develop. */
test('a statement nothing serves becomes a new lead to develop', () => {
  const m = match('teleport a cat to the moon')
  assert.equal(m.verdict, 'unknown')
  assert.equal(m.lead.status, 'blocked')
  assert.ok(m.lead.id.length > 0)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the match tool is served over MCP and agrees with the direct call. */
test('the match tool is served over MCP and agrees with the direct call', () => {
  const r = call('match', { statement: 'the Sycamore couplers' })
  assert.ok('result' in r)
  const m = (r.result as { structuredContent: { verdict: string; tool?: string } }).structuredContent
  assert.equal(m.verdict, 'served')
  assert.equal(m.tool, 'processor')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: tokens drop stop words and keep numbers. */
test('tokens drop stop words and keep numbers', () => {
  assert.deepEqual(tokens('Show me the 105 qubits of Willow'), ['105', 'qubits', 'willow'])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the surface's own names never count as coverage: a question about uuidna and qpu that nothing answers is unknown, a lead. */
test('the surface\'s own names never count as coverage: a question about uuidna and qpu that nothing answers is unknown, a lead', () => {
  const m = match('are uuidna and qpu developing alife now?')
  assert.equal(m.verdict, 'unknown')
  assert.equal(m.lead.status, 'blocked')
  assert.ok((m.lead.reason ?? '').includes('lead'))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a verdict crossing the border is translated by table, and a call carries its referer in _meta. */
test('a verdict crossing the border is translated by table, and a call carries its referer in _meta', () => {
  assert.equal(translateVerdict('VERIFIED'), 'served'); assert.equal(translateVerdict('UNVERIFIED'), 'unknown'); assert.equal(translateVerdict('REFUTED'), 'impossible'); assert.equal(translateVerdict('NOT-PROVEN'), 'unknown'); assert.equal(translateVerdict('nonsense'), undefined)
  assert.deepEqual(listForeignVerdicts('impossible'), ['REFUTED'])
  const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'processor', arguments: { name: 'Willow' }, _meta: { prev: 'https://uuidna.com/docket/abc' } } }) as { result: { _meta: { prev?: string; openGraph: Record<string, string> } } }
  assert.equal(r.result._meta.prev, 'https://uuidna.com/docket/abc')
  assert.equal(r.result._meta.openGraph['og:see_also'], 'https://uuidna.com/docket/abc')
  const plain = handle({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'processor', arguments: { name: 'Willow' } } }) as { result: { _meta: { prev?: string } } }
  assert.equal(plain.result._meta.prev, undefined)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: Glagolitic numerals round-trip through the table and are read as integers before a match. */
test('Glagolitic numerals round-trip through the table and are read as integers before a match', () => {
  assert.equal(Object.keys(GLAGOLITIC).length, 28)
  for (const n of [1, 9, 10, 15, 99, 105, 432, 999, 1000, 1999]) assert.equal(listNumerals(toGlagolitic(n)!).numerals[0]!.value, n, `${n}`)
  assert.equal(toGlagolitic(2000), null, 'above the table is a lead, never guessed')
  assert.deepEqual(listNumerals('Factor Ⰺⰴ with Shor'), { text: 'Factor 15 with Shor', numerals: [{ glyphs: 'Ⰺⰴ', value: 15 }] })
  const m = matchStatement('Factor Ⰺⰴ with Shor', handle, EXAMPLES, LEADS)
  assert.equal(m.verdict, 'served'); assert.equal(m.tool, 'algorithm'); assert.equal(m.reflection.factors[0]?.factors, '3 × 5'); assert.equal(m.read?.numerals[0]?.value, 15)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a statement in Bulgarian is translated by vocabulary offline before the match and the verdict comes back in Bulgarian. */
test('a statement in Bulgarian is translated by vocabulary offline before the match and the verdict comes back in Bulgarian', () => {
  assert.equal(translate('Разложи 15 с Shor', 'bg', 'en').text, 'Factor 15 with Shor')
  const m = matchStatement('Разложи Ⰺⰴ с Shor', handle, EXAMPLES, LEADS, 'bg')
  assert.equal(m.verdict, 'served'); assert.equal(m.read?.verdictIn, 'обслужена'); assert.deepEqual(m.read?.untranslated, ['shor'], 'a name stays as it is and is reported, never guessed')
  const r = call('match', { statement: 'Разложи Ⰺⰴ с Shor', locale: 'bg' })
  assert.equal((r as { result: { structuredContent: { read: { locale: string } } } }).result.structuredContent.read.locale, 'bg')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a statement is solved first by the QPU textbook: a kernel-accepted theorem serves it before any tool, and the flow toolboxes are never called to serve. */
test('a statement is solved first by the QPU textbook: a kernel-accepted theorem serves it before any tool, and the flow toolboxes are never called to serve', () => {
  const m = matchStatement('relation 15', handle, EXAMPLES, LEADS)
  assert.equal(m.verdict, 'served'); assert.equal(m.theorem, 'relation_15'); assert.equal(m.tool, undefined); assert.ok(m.evidence[0]!.startsWith('proven by the kernel'))
  const w = matchStatement('How many qubits does Willow have?', handle, EXAMPLES, LEADS)
  assert.equal(w.verdict, 'served'); assert.equal(w.tool, 'processor'); assert.equal(w.theorem, undefined, 'a statement no theorem states is served by its tool')
  const flow = matchStatement('discover every host and verify the wave and judge readiness and imagine the leads', handle, EXAMPLES, LEADS)
  assert.ok(!['discover', 'wave', 'readiness', 'imagine', 'legal', 'repository', 'stripe', 'metrics'].includes(flow.tool ?? ''), `the matcher never calls a flow tool to serve: ${flow.verdict} via ${flow.tool}`)
})
