// ISO/IEC/IEEE 29119-3 test cases for the claims run: the searches sealed once answered, OpenAlex's refusals handled by their reason,
// every theorem claimed in the author's interest as far as the law carries it, and every work under the author's ORCID discovered and claimed.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { AUTHORSHIP_GROUNDS, DISCLOSURE_GROUNDS, PRECEDENCE_GROUNDS, claimLeads, claimWorks, connectWorks, listClaims, meaningsOf, planDiscovery, queryOf, readDiscovery, runClaims, standardWords, type VerifiedRecord } from './index.ts'
import { CLAIMS, CONNECTIONS, RECORD, WORKS } from '../../../../../../../../7/2/b/f/9/7/c/c/index.ts'
import { TEXTBOOK_THEOREMS } from '../../../../../../../../3/4/7/e/0/c/e/0/index.ts'

const page = (results: unknown[], count = results.length) => ({ id: 'works:1', status: 200, text: JSON.stringify({ meta: { count }, results }) })

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a run asks only what is unsealed, and always the discovery under the author's ORCID. */
test('a run asks only what is unsealed, and always the discovery under the author\'s ORCID', () => {
  const r = runClaims() as { requestList: { id: string; url: string; bearer?: string }[]; sealed: number }
  const sealed = CLAIMS.filter((c) => c.status !== 'unasked' && (c.kind === 'own' || c.query === queryOf(TEXTBOOK_THEOREMS.find((t) => t.key === c.theorem)!))).length
  assert.equal(r.sealed, sealed)
  assert.equal(r.requestList[0]!.id, 'works:1')
  assert.ok(r.requestList[0]!.url.includes('filter=author.orcid:0009-0000-7312-9778'))
  assert.ok(r.requestList.every((q) => q.bearer === 'OPENALEX_API_KEY'))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a rate refusal is asked again after OpenAlex's wait; a spent budget ends the run. */
test('a rate refusal is asked again after OpenAlex\'s wait; a spent budget ends the run', () => {
  const refresh = runClaims(undefined, 0, true) as { requestList: { id: string }[] }
  const first = refresh.requestList.find((q) => q.id !== 'works:1')!
  const rate = runClaims([page([]), { id: first.id, status: 429, text: JSON.stringify({ reason: 'first_dollar', retryAfter: 120 }) }], 0, true) as { requestList?: unknown[]; retry?: { says: string }[]; waitMs?: number; kept?: unknown[] }
  assert.ok(Array.isArray(rate.retry) && rate.retry.some((x) => x.says.includes('first_dollar')))
  assert.equal(rate.waitMs, 120_000)
  assert.equal(rate.kept!.length, 1)
  const spent = runClaims([page([]), { id: first.id, status: 429, text: JSON.stringify({ reason: 'daily_budget' }) }], 0, true) as { retry?: unknown; budget: { spent: boolean; resets: string } | null; owed: string[] }
  assert.equal(spent.retry, undefined)
  assert.deepEqual(spent.budget, { spent: true, resets: 'midnight UTC' })
  assert.ok(spent.owed.includes(first.id))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every theorem's authorship is claimed; precedence holds unless a confirmed earlier work states it. */
test('every theorem\'s authorship is claimed; precedence holds unless a confirmed earlier work states it', () => {
  const general = TEXTBOOK_THEOREMS.find((t) => CLAIMS.find((c) => c.theorem === t.key)?.kind === 'general')!
  const record: VerifiedRecord = { doi: '10.5281/zenodo.22700098', openalex: 'W1', date: '2026-09-11', verifiedBy: 'openalex' }
  const answer = { id: general.key, status: 200, text: JSON.stringify({ results: [] }) }
  assert.deepEqual(listClaims([answer]).find((c) => c.theorem === general.key)!.precedence, { holds: null, pending: 'record' })
  const plain = listClaims([answer], [], record).find((c) => c.theorem === general.key)!
  assert.equal(plain.disclosure.date, '2026-09-11')
  assert.deepEqual(plain.authorship.grounds, AUTHORSHIP_GROUNDS)
  assert.equal(plain.precedence.holds, true)
  assert.deepEqual(plain.disclosure.grounds, DISCLOSURE_GROUNDS)
  assert.equal(plain.disclosure.priority, true)
  const confirmed = listClaims([answer], [{ theorem: general.key, doi: '10.1/earlier', by: 'a reader' }], record).find((c) => c.theorem === general.key)!
  assert.deepEqual(confirmed.precedence, { holds: false, yieldsTo: '10.1/earlier', by: 'a reader' })
  assert.equal(confirmed.authorship.object, 'expression')
  assert.equal(confirmed.disclosure.priority, false)
  const unasked = listClaims([], [], record).find((c) => c.theorem === general.key)!
  assert.deepEqual(unasked.precedence, { holds: null, pending: 'search' })
  for (const c of CLAIMS) { assert.equal(c.authorship.author, 'Tsvetan Rouschev'); if (c.precedence.holds === true) assert.deepEqual(c.precedence.grounds, PRECEDENCE_GROUNDS) }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the works under the author's ORCID are discovered once each, and each claimed with its grace day. */
test('the works under the author\'s ORCID are discovered once each, and each claimed with its grace day', () => {
  const zenodo = { source: { display_name: 'Zenodo', type: 'repository' } }
  const found = readDiscovery([page([{ id: 'W2', doi: 'https://doi.org/10.5281/zenodo.22700098', title: 'QPU', type: 'software', publication_date: '2026-09-11', locations: [zenodo] }, { id: 'W1', doi: 'https://doi.org/10.1/x', title: 'x', type: 'preprint', publication_date: '2026-08-04', locations: [zenodo, { source: { display_name: 'A journal', type: 'journal' } }] }, { id: 'W1', doi: 'https://doi.org/10.1/x', publication_date: '2026-08-04' }]).text])
  assert.equal(found.works.length, 2)
  assert.deepEqual(found.works.map((w) => [w.openalex, w.namedByTree]), [['W1', false], ['W2', true]])
  assert.deepEqual(found.works[0]!.repositories, ['Zenodo'])
  const [first] = claimWorks(found.works)
  assert.equal(first!.disclosure.from, '2026-08-04')
  assert.equal(first!.disclosure.usGraceUntil, '2027-08-04')
  assert.equal(first!.disclosure.europeanGrace, 0)
  assert.equal(planDiscovery(2).url.includes('page=2'), true)
  assert.ok(WORKS.length >= 3 && WORKS.every((w) => w.authorship.author === 'Tsvetan Rouschev'))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: what connects the works is read only from the source: shared repositories, topics and citations. */
test('what connects the works is read only from the source: shared repositories, topics and citations', () => {
  const w = (openalex: string, repositories: string[], topics: string[], cites: string[] = []) => ({ doi: null, openalex, title: '', type: '', date: '2026-01-01', repositories, topics, cites, namedByTree: false })
  const c = connectWorks([w('W1', ['Zenodo'], ['Quantum', 'Algebra']), w('W2', ['Zenodo', 'arXiv'], ['Quantum'], ['W1', 'W9'])])
  assert.deepEqual(c.repositories, ['Zenodo'])
  assert.deepEqual(c.topicsInAll, ['Quantum'])
  assert.deepEqual(c.topics, [{ name: 'Quantum', works: 2 }, { name: 'Algebra', works: 1 }])
  assert.deepEqual(c.citations, [{ from: 'W2', to: 'W1' }])
  assert.deepEqual(connectWorks([]), { orcid: null, works: 0, repositories: [], topicsInAll: [], topics: [], citations: [] })
  assert.ok(RECORD === null || RECORD.verifiedBy === 'openalex')
  assert.equal(CONNECTIONS.works, WORKS.length)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: code and file names are read in their standard words, and only custom entropy is left out. */
test('code and file names are read in their standard words, and only custom entropy is left out', () => {
  assert.equal(standardWords('see `Fintype.card_sum` in src/quantum/uuid/programs/2/3/3/6/7/5/e/f/index.ts'), 'see fintype card sum in src quantum uuid programs index ts')
  assert.equal(standardWords('getAccessToken of 07ad7a89-b700-14bd-9fb6-aed470caba92 on 105 qubits'), 'get access token of on 105 qubits')
  const t = { key: 'textbook_integrations_are_thirty_five', says: 'a keyed integrations and b open ones make a + b, the cardinality of a disjoint union. From Mathlib\'s `Fintype.card_sum` and `Fintype.card_fin`' }
  assert.deepEqual(meaningsOf(t), ['keyed integrations and open ones make the cardinality of disjoint union', "from mathlib's fintype card sum and fintype card fin", 'integrations are thirty five'])
  assert.equal(queryOf(t), "(keyed integrations and open ones make the cardinality of disjoint union) OR (from mathlib's fintype card sum and fintype card fin) OR (integrations are thirty five)")
  assert.ok(meaningsOf({ key: 'lone', says: 'a' }).every((m) => m.length > 0))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every claim records the query it was searched with, so only a changed meaning is asked again. */
test('every claim records the query it was searched with, so only a changed meaning is asked again', () => {
  const r = runClaims() as { requestList: { id: string }[] }
  const changed = r.requestList.filter((q) => q.id !== 'works:1')
  for (const q of changed) assert.notEqual(CLAIMS.find((c) => c.theorem === q.id)?.query, queryOf(TEXTBOOK_THEOREMS.find((t) => t.key === q.id)!))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the leads are found from what the source returned, one per unnamed work and per candidate. */
test('the leads are found from what the source returned, one per unnamed work and per candidate', () => {
  const work = { doi: '10.5281/zenodo.1', openalex: 'W1', title: 'A work', type: 'software', date: '2026-08-04', repositories: ['Zenodo'], topics: [], cites: [], namedByTree: false }
  const claim = listClaims([{ id: TEXTBOOK_THEOREMS[0]!.key, status: 200, text: '{}' }]).find((c) => c.kind === 'general') ?? CLAIMS.find((c) => c.kind === 'general')!
  const withCandidate = { ...claim, status: 'candidate' as const, candidates: [{ doi: '10.1/prior', title: 'Prior', date: '2020-01-01', shared: 3, meaning: 'm' }] }
  const none = claimLeads([], [], null)
  assert.deepEqual(none.map((l) => l.id), ['claims-record-unverified'])
  const leads = claimLeads([withCandidate], [work, { ...work, openalex: 'W2', doi: '10.5281/zenodo.2', namedByTree: true }], { doi: '10.5281/zenodo.22700098', openalex: 'W0', date: '2026-09-11', verifiedBy: 'openalex' })
  assert.deepEqual(leads.map((l) => l.id).sort(), [`candidate-${withCandidate.theorem.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-10-1-prior`, 'work-10-5281-zenodo-1'].sort())
  assert.ok(leads.every((l) => l.status === 'open' && l.run?.tool === 'textbook'))
})
