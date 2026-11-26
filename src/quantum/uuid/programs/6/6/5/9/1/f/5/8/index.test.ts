// Publishing a post posts a release, and the release refreshes the DOI. The network here is a stub: no release is created.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { nextTag, planRelease, postRelease, publishesNow, UNIT_CONCEPT_DOI } from './index.ts'

const post = { title: 'The register is one UUID', slug: 'the-register-is-one-uuid', description: 'What changed.', status: 'published', previousStatus: 'draft' }
const stub = (answers: Record<string, { ok: boolean; status: number; body: unknown }>) => {
  const calls: { url: string; method: string; authorization?: string; body?: any }[] = []
  const fetch = async (url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) => {
    calls.push({ url, method: init?.method ?? 'GET', authorization: init?.headers?.authorization, body: init?.body ? JSON.parse(init.body) : undefined })
    const answer = answers[`${init?.method ?? 'GET'} ${url}`] ?? { ok: false, status: 404, body: {} }
    return { ok: answer.ok, status: answer.status, json: async () => answer.body }
  }
  return { calls, fetch }
}
const LATEST = 'GET https://api.github.com/repos/uuidna/qpu/releases/latest', ZENODO = 'GET https://zenodo.org/api/records/22700098', CREATE = 'POST https://api.github.com/repos/uuidna/qpu/releases'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the next tag is one patch above the highest version GitHub or Zenodo holds. */
test('the next tag is one patch above the highest version GitHub or Zenodo holds', () => {
  assert.equal(nextTag(['v1.0.1', '1.1.0']), 'v1.1.1')
  assert.equal(nextTag(['v2.3.9', 'v2.3.10']), 'v2.3.11')
  assert.equal(nextTag([undefined, 'not a version']), 'v0.0.1')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: only the change that publishes a post posts a release. */
test('only the change that publishes a post posts a release', async () => {
  assert.equal(publishesNow(post), true)
  assert.equal(publishesNow({ ...post, previousStatus: 'published' }), false)
  assert.equal(publishesNow({ ...post, status: 'draft' }), false)
  const net = stub({})
  const again = await postRelease({ post: { ...post, previousStatus: 'published' }, fetch: net.fetch, token: 'named-not-real', origin: 'https://qpu.uuidna.com' })
  assert.equal(again.sent, false)
  const tokenless = await postRelease({ post, fetch: net.fetch, token: undefined, origin: 'https://qpu.uuidna.com' })
  assert.equal(tokenless.sent, false)
  assert.equal(net.calls.length, 0)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a published post posts one release named after it, under the concept DOI. */
test('a published post posts one release named after it, under the concept DOI', async () => {
  const net = stub({ [LATEST]: { ok: true, status: 200, body: { tag_name: 'v1.0.1' } }, [ZENODO]: { ok: true, status: 200, body: { metadata: { version: '1.1.0' } } }, [CREATE]: { ok: true, status: 201, body: { html_url: 'https://github.com/uuidna/qpu/releases/tag/v1.1.1' } } })
  const result = await postRelease({ post, fetch: net.fetch, token: 'named-not-real', origin: 'https://qpu.uuidna.com/' })
  assert.equal(result.posted, true)
  assert.equal(result.tag, 'v1.1.1')
  assert.equal(result.conceptDoi, UNIT_CONCEPT_DOI)
  const created = net.calls.filter((c) => c.method === 'POST')
  assert.equal(created.length, 1)
  assert.equal(created[0]!.authorization, 'Bearer named-not-real')
  assert.deepEqual({ tag: created[0]!.body.tag_name, name: created[0]!.body.name, target: created[0]!.body.target_commitish, draft: created[0]!.body.draft }, { tag: 'v1.1.1', name: post.title, target: 'main', draft: false })
  assert.equal(created[0]!.body.body.includes('https://qpu.uuidna.com/posts/the-register-is-one-uuid'), true)
  assert.equal(created[0]!.body.body.includes(UNIT_CONCEPT_DOI), true)
  assert.equal(net.calls.filter((c) => c.method === 'GET').every((c) => c.authorization === undefined), true)
  assert.deepEqual(planRelease(post, ['v1.0.1', '1.1.0'], 'https://qpu.uuidna.com').request.body, created[0]!.body)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a refused release is reported and the post stays published. */
test('a refused release is reported and the post stays published', async () => {
  const net = stub({ [CREATE]: { ok: false, status: 422, body: {} } })
  const result = await postRelease({ post, fetch: net.fetch, token: 'named-not-real', origin: 'https://qpu.uuidna.com' })
  assert.equal(result.sent, true)
  assert.equal(result.posted, false)
  assert.equal(result.status, 422)
})
