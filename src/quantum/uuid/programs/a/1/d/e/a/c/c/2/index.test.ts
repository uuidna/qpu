// ISO/IEC/IEEE 29119-3 test cases for the verification wave: OpenAlex read for its meaning, every failure handled, the handled ones asked
// again when the handling says so, and every lead verified by any source of its facts.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { hexagonHandle } from '../../../../../../../../d/7/8/3/e/4/6/3/index.ts'
import { VERIFIED } from '../../../../../../../../b/2/7/3/e/a/e/6/index.ts'
import { addressOf, asRequest, getWave, handleResult, isFinal, readOpenAlex, toAskAgain, unsealed, verifiedIndex, verifiedLeads, type WaveResult } from './index.ts'

const base = { url: 'https://api.openalex.org/works/doi:10.1/x', check: 'indexed, with the repositories that hold it', leads: ['a'], ms: 1 }
const r = (o: Partial<WaveResult>): WaveResult => ({ verifier: 'openalex', status: 200, ok: true, ...base, ...o }) as WaveResult
const work = (orcid: string | null) => JSON.stringify({ id: 'W1', publication_date: '2026-09-11', authorships: [{ author: { display_name: 'T', orcid } }], locations: [{ source: { display_name: 'Zenodo', type: 'repository' } }, { source: { display_name: 'Zenodo', type: 'repository' } }] })

/** ISO/IEC/IEEE 29119-3 test case. Identifier: an OpenAlex answer means its work, date, repositories and ORCIDs. */
test('an OpenAlex answer means its work, date, repositories and ORCIDs', () => {
  assert.deepEqual(readOpenAlex(work('https://orcid.org/1')), { work: 'W1', date: '2026-09-11', repositories: ['Zenodo'], orcids: ['https://orcid.org/1'] })
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every failure has its handling, and the wave holds with none unhandled. */
test('every failure has its handling, and the wave holds with none unhandled', () => {
  const kinds = [[0, 'retry'], [500, 'retry'], [429, 'rate'], [403, 'key'], [301, 'moved'], [404, 'not-harvested']] as const
  for (const [status, kind] of kinds) assert.equal(handleResult(r({ status, ok: false })!)?.kind, kind)
  assert.equal(handleResult(r({ status: 429, ok: false, text: JSON.stringify({ reason: 'daily_budget' }) }))?.kind, 'budget')
  assert.equal(handleResult(r({ verifier: 'github', status: 403, ok: false }))?.kind, 'refused')
  assert.equal(handleResult(r({ verifier: 'oeis', status: 404, ok: false }))?.kind, 'not-found')
  const author = 'indexed, dated as the record, and its authorships include T (https://orcid.org/1)'
  assert.equal(handleResult(r({ check: author, text: work('https://orcid.org/1') })), null)
  assert.equal(handleResult(r({ check: author, text: work(null) }))?.kind, 'not-linked')
  const w = getWave([r({ text: work('https://orcid.org/1') }), r({ url: 'https://x/2', status: 429, ok: false, leads: ['b'] })])
  assert.equal(w.unhandled, 0)
  assert.equal(w.holds, true)
  assert.deepEqual(w.handled, { rate: 1 })
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: what the handling asks again goes back as its request; a lead any source answered is verified. */
test('what the handling asks again goes back as its request; a lead any source answered is verified', () => {
  const results = [r({ leads: ['a'] }), r({ url: 'https://x/2', status: 429, ok: false, leads: ['a', 'b'], bearer: 'OPENALEX_API_KEY' }), r({ url: 'https://x/3', status: 404, ok: false, leads: ['c'] })]
  const again = toAskAgain(results)
  assert.deepEqual(again.map((x) => x.url), ['https://x/2'])
  assert.deepEqual(asRequest(again[0]!), { verifier: 'openalex', url: 'https://x/2', check: base.check, leads: ['a', 'b'], bearer: 'OPENALEX_API_KEY' })
  assert.deepEqual(verifiedLeads(results), { leads: 3, verified: 1, unverified: ['b', 'c'] })
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: what a source answered for good is sealed by its address and never asked again. */
test('what a source answered for good is sealed by its address and never asked again', () => {
  const q = { verifier: 'openalex', url: 'https://api.openalex.org/works/doi:10.1/x', check: 'c', leads: ['a'] }
  const answered = r({ ...q, note: 'W1', handling: null })
  const index = verifiedIndex([answered, r({ url: 'https://x/rate', status: 429, ok: false, handling: { kind: 'rate', remedy: '' } })], [])
  assert.equal(index.rows, 1)
  const held = [{ address: addressOf(q), verifier: 'openalex', url: q.url, status: 200, ok: true, note: 'W1', handling: null }]
  const { ask, kept } = unsealed([q, { ...q, url: 'https://x/new' }], held)
  assert.deepEqual(ask.map((x) => x.url), ['https://x/new'])
  assert.equal(kept[0]!.note, 'W1')
  assert.equal(unsealed([q], held, true).ask.length, 1)
  assert.equal(addressOf({ url: 'https://x' }), addressOf({ method: 'GET', url: 'https://x' }))
  assert.equal(isFinal({ ok: false, handling: { kind: 'not-found', remedy: '' } }), true)
  assert.equal(isFinal({ ok: false, handling: { kind: 'rate', remedy: '' } }), false)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every sealed address is its hexagon's, the hash of its program's three pairs over its tail. */
test('every sealed address is its hexagon\'s, the hash of its program\'s three pairs over its tail', () => {
  const a = addressOf({ url: 'https://api.openalex.org/works/doi:10.1/x' })
  assert.equal(hexagonHandle(a).holds, true)
  const changed = a.slice(0, -1) + (a.endsWith('0') ? '1' : '0')
  assert.equal(hexagonHandle(changed).holds, false)
  for (const v of VERIFIED) assert.equal(hexagonHandle(v.address).holds, true, v.address)
})
