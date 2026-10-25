import test from 'node:test'
import assert from 'node:assert/strict'
import { worker, Docket, discoveryOf, FRAGMENT_BYTES, STRIPE, sameToken, type Storage, type Env } from '../worker.js'
import { uuidOf } from './blocks.js'

const KEY = Buffer.from(new Uint8Array(32).map((_, i) => i * 7 + 1)).toString('base64')
const memory = (): Storage & { map: Map<string, unknown> } => { const m = new Map<string, unknown>(); return { map: m, async get<T>(k: string) { return m.get(k) as T | undefined }, async put(k, v) { m.set(k, v) }, async delete(k) { return m.delete(k) }, async list<T>(o?: { prefix?: string }) { return new Map([...m].filter(([k]) => !o?.prefix || k.startsWith(o.prefix))) as Map<string, T> } } }
const env = (store = memory(), dataKey: string | null = KEY, mirrors: string[] = [], fetcher?: (url: string, init?: RequestInit) => Promise<Response>): Env & { store: typeof store } => { const key = dataKey === null ? undefined : dataKey; const d = new Docket(store, key, mirrors, fetcher, 'test-token'); return { store, QPU_WRITE_TOKEN: 'test-token', QPU_DATA_KEY: key, DOCKET: { idFromName: () => 'qpu', get: () => ({ fetch: (r: Request) => d.fetch(r) }) } } }
const auth = { authorization: 'Bearer test-token', 'content-type': 'application/json' }
const post = (e: Env, entry: unknown) => worker.fetch(req('/docket', { method: 'POST', headers: auth, body: JSON.stringify(entry) }), e)
const req = (path: string, init?: RequestInit) => new Request(`https://qpu.test${path}`, init)

test('POST /mcp serves the handler: tools/list names the eighteen tools and every response carries the licence', async () => {
  const r = await worker.fetch(req('/mcp', { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) }), env())
  assert.equal(r.status, 200)
  assert.equal(r.headers.get('x-license'), 'CC-BY-NC-ND-4.0')
  assert.ok(r.headers.get('link')!.includes('rel="license"'))
  const body = await r.json() as { result: { tools: { name: string }[] } }
  assert.equal(body.result.tools.length, 18)
  const call = await worker.fetch(req('/mcp', { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'algorithm', arguments: { name: 'shor', N: 15, a: 7 } } }) }), env())
  const data = await call.json() as { result: { structuredContent: { summary: string[][] } } }
  assert.equal(data.result.structuredContent.summary.find((r) => r[0] === 'Factors')?.[1], '3 × 5')
})

test('the discovery document states only what the tree is', async () => {
  const d = discoveryOf('https://qpu.test')
  assert.equal(d.mcp, 'https://qpu.test/mcp')
  assert.equal(d.tools.length, 18)
  assert.equal(d.bounds.shorN, 21)
  assert.equal(d.key, 432)
  assert.equal(d.license.spdx, 'CC-BY-NC-ND-4.0')
  const r = await worker.fetch(req('/.well-known/qpu.json'), env())
  assert.equal(r.status, 200)
  assert.equal(((await r.json()) as { name: string }).name, '@uuidna/qpu')
})

test('the docket: reads need no auth, writes and deletions need the token, and the same content is stored once', async () => {
  const e = env()
  const denied = await worker.fetch(req('/docket', { method: 'POST', body: JSON.stringify({ kind: 'receipt', from: 'qpu.test', body: { a: 1 } }) }), e)
  assert.equal(denied.status, 401)
  const ok = await post(e, { kind: 'receipt', from: 'qpu.test', body: { a: 1 } })
  assert.equal(ok.status, 201)
  const { id, fragments, sha256 } = await ok.json() as { id: string; fragments: number; sha256: string }
  assert.equal(id, uuidOf(JSON.stringify({ a: 1 })))
  assert.match(sha256, /^[0-9a-f]{64}$/)
  assert.equal(fragments, 1)
  const again = await post(e, { kind: 'lead', from: 'uuidna.com', body: { a: 1 } })
  assert.equal(((await again.json()) as { duplicate: boolean }).duplicate, true)
  assert.equal([...e.store.map.keys()].filter((k) => k.startsWith('row:')).length, 1)
  const list = await worker.fetch(req('/docket'), e)
  assert.equal(((await list.json()) as { count: number }).count, 1)
  const one = await worker.fetch(req(`/docket/${id}`), e)
  assert.equal(((await one.json()) as { body: { a: number } }).body.a, 1)
  assert.equal((await worker.fetch(req(`/docket/${id}`, { method: 'DELETE' }), e)).status, 401)
})

test('fragments are encrypted at rest under the mirror key and named by the plaintext hash', async () => {
  const e = env()
  const secret = 'the-plaintext-marker-' + 'x'.repeat(100)
  await post(e, { kind: 'receipt', from: 'qpu.test', body: { secret } })
  const stored = JSON.stringify([...e.store.map.entries()].filter(([k]) => k.startsWith('frag:')))
  assert.ok(!stored.includes('plaintext-marker'), 'no fragment holds plaintext')
  assert.ok(stored.includes('"iv"') && stored.includes('"ct"'))
  const other = env(memory(), Buffer.from(new Uint8Array(32).map((_, i) => 255 - i)).toString('base64'))
  const r2 = await post(other, { kind: 'receipt', from: 'mirror.test', body: { secret } })
  const idA = [...e.store.map.keys()].find((k) => k.startsWith('row:'))!.slice(4)
  assert.equal(((await r2.json()) as { id: string }).id, idA, 'two mirrors with different keys name the same content identically')
  const fragA = JSON.stringify(e.store.map.get([...e.store.map.keys()].find((k) => k.startsWith('frag:'))!))
  const fragB = JSON.stringify(other.store.map.get([...other.store.map.keys()].find((k) => k.startsWith('frag:'))!))
  assert.notEqual(fragA, fragB, 'and cipher it differently')
  const keyless = env(memory(), null)
  assert.equal((await post(keyless, { kind: 'receipt', from: 'x', body: 1 })).status, 503)
})

test('a large body is fragmented with an XOR parity; one corrupted fragment is rebuilt on read and reported, two are refused', async () => {
  const e = env()
  const body = { text: 'q'.repeat(FRAGMENT_BYTES * 2 + 1000) }
  const r = await post(e, { kind: 'imagination', from: 'qpu.test', body })
  const { id, fragments, parities } = await r.json() as { id: string; fragments: number; parities: number }
  assert.equal(fragments, 3)
  assert.equal(parities, 1)
  const manifest = e.store.map.get(`row:${id}`) as { fragments: string[] }
  const fragKeys = manifest.fragments.map((h) => `frag:${h}`)
  const original = e.store.map.get(fragKeys[1]!) as { iv: string; ct: string }
  e.store.map.set(fragKeys[1]!, { ...original, ct: original.ct.slice(0, -8) + 'AAAAAAAA' })
  const read = await worker.fetch(req(`/docket/${id}`), e)
  assert.equal(read.status, 200)
  assert.equal(read.headers.get('x-repaired'), '1')
  const data = await read.json() as { repaired: string[]; body: { text: string } }
  assert.equal(data.repaired.length, 1)
  assert.equal(data.body.text, body.text)
  const second = e.store.map.get(fragKeys[0]!) as { iv: string; ct: string }
  e.store.map.set(fragKeys[0]!, { ...second, ct: second.ct.slice(0, -8) + 'BBBBBBBB' })
  const broken = await worker.fetch(req(`/docket/${id}`), e)
  assert.equal(broken.status, 409)
  assert.ok(((await broken.json()) as { error: string }).error.startsWith('integrity'))
})

test('links raise reference counts; an entry is deletable only when nothing links it, and a delete releases what it linked', async () => {
  const e = env()
  const a = ((await (await post(e, { kind: 'verification', from: 'qpu.test', body: { v: 1 } })).json()) as { id: string }).id
  const b = ((await (await post(e, { kind: 'receipt', from: 'qpu.test', body: { r: 1 }, links: [a] })).json()) as { id: string }).id
  const readA = await worker.fetch(req(`/docket/${a}`), e)
  assert.equal(((await readA.json()) as { refs: number }).refs, 1)
  const refused = await worker.fetch(req(`/docket/${a}`, { method: 'DELETE', headers: auth }), e)
  assert.equal(refused.status, 409)
  const bad = await post(e, { kind: 'receipt', from: 'qpu.test', body: { r: 2 }, links: ['00000000-0000-8000-8000-000000000000'] })
  assert.equal(bad.status, 404)
  const delB = await worker.fetch(req(`/docket/${b}`, { method: 'DELETE', headers: auth }), e)
  assert.equal(delB.status, 200)
  const refsAfter = ((await (await worker.fetch(req(`/docket/${a}`), e)).json()) as { refs: number }).refs
  assert.equal(refsAfter, 0)
  const delA = await worker.fetch(req(`/docket/${a}`, { method: 'DELETE', headers: auth }), e)
  assert.equal(delA.status, 200)
  assert.equal([...e.store.map.keys()].filter((k) => k.startsWith('frag:') || k.startsWith('row:')).length, 0, 'fragments nobody references are gone')
  assert.ok(sameToken('abc', 'abc') && !sameToken('abc', 'abd') && !sameToken(undefined, 'abc'))
})

test('the list is a realtime cursor: filter by kind and by since, and the cursor advances', async () => {
  const e = env()
  await post(e, { kind: 'receipt', from: 'qpu.test', body: { n: 1 } })
  const first = await (await worker.fetch(req('/docket?kind=receipt'), e)).json() as { count: number; cursor: string }
  assert.equal(first.count, 1)
  await new Promise((r) => setTimeout(r, 5))
  await post(e, { kind: 'lead', from: 'qpu.test', body: { n: 2 } })
  await post(e, { kind: 'receipt', from: 'qpu.test', body: { n: 3 } })
  const next = await (await worker.fetch(req(`/docket?kind=receipt&since=${encodeURIComponent(first.cursor)}`), e)).json() as { count: number; entries: { kind: string }[] }
  assert.equal(next.count, 1)
  assert.equal(next.entries[0]!.kind, 'receipt')
  const all = await (await worker.fetch(req('/docket'), e)).json() as { count: number }
  assert.equal(all.count, 3)
})

test('a fold collision is a lead: the second content is kept under its SHA-256, both are named, and a collision lead is written', async () => {
  const e = env()
  const first = await (await post(e, { kind: 'receipt', from: 'a.test', body: { x: 1 } })).json() as { id: string; sha256: string }
  const key = `row:${first.id}`
  const m = e.store.map.get(key) as { sha256: string }
  e.store.map.set(key, { ...m, sha256: '0'.repeat(64) })
  const r = await post(e, { kind: 'receipt', from: 'b.test', body: { x: 1 } })
  assert.equal(r.status, 201)
  const c = await r.json() as { collision: boolean; with: string; lead: string; sha256: string }
  assert.equal(c.collision, true)
  assert.equal(c.with, '0'.repeat(64))
  assert.equal(c.sha256, first.sha256)
  const lead = await (await worker.fetch(req(`/docket/${c.lead}`), e)).json() as { kind: string; links: string[]; body: { statement: string } }
  assert.equal(lead.kind, 'collision')
  assert.deepEqual(lead.links, [first.id])
  assert.ok(lead.body.statement.includes('fold collision'))
  const refused = await worker.fetch(req(`/docket/${first.id}`, { method: 'DELETE', headers: auth }), e)
  assert.equal(refused.status, 409, 'the collided entry is linked by its lead and cannot be deleted')
})

test('a mirror heals lost data: the same address on another mirror, with both fingerprints agreeing, re-stores the fragments', async () => {
  const b = env()
  const a = env(memory(), KEY, ['https://b.test/docket'], (url, init) => worker.fetch(new Request(url, init), b))
  const body = { text: 'r'.repeat(FRAGMENT_BYTES * 2 + 10) }
  const { id } = await (await post(a, { kind: 'receipt', from: 'a.test', body })).json() as { id: string }
  await post(b, { kind: 'receipt', from: 'b.test', body })
  const manifestA = a.store.map.get(`row:${id}`) as { fragments: string[] }
  for (const k of manifestA.fragments.slice(0, 2).map((h) => `frag:${h}`)) { const f = a.store.map.get(k) as { iv: string; ct: string }; a.store.map.set(k, { ...f, ct: f.ct.slice(0, -8) + 'CCCCCCCC' }) }
  const broken = await worker.fetch(req(`/docket/${id}`), a)
  assert.equal(broken.status, 409)
  assert.ok(((await broken.json()) as { heal: { mirrors: string[] } }).heal.mirrors.length === 1)
  const healed = await worker.fetch(req(`/docket/${id}?heal`), a)
  assert.equal(healed.status, 200)
  const data = await healed.json() as { healedFrom?: string; body: { text: string } }
  assert.equal(data.healedFrom, 'https://b.test/docket')
  assert.equal(data.body.text, body.text)
  const again = await (await worker.fetch(req(`/docket/${id}`), a)).json() as { healedFrom?: string; body: { text: string } }
  assert.equal(again.healedFrom, undefined); assert.equal(again.body.text, body.text)
})

test('a commitment witnesses fingerprints now and the reveal proves possession later without leaking the content', async () => {
  const e = env()
  const body = { claim: 'the prize-winning content', n: 42 }
  const text = JSON.stringify(body)
  const address = uuidOf(text)
  const sha256 = Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))).toString('hex')
  const c = await post(e, { address, sha256, from: 'author.test', kind: 'prize' })
  assert.equal(c.status, 201)
  const commitment = await c.json() as { committedAt: string; witness: string }
  const peek = await (await worker.fetch(req(`/docket/${address}`), e)).json() as { sha256: string; body?: unknown; revealed: boolean }
  assert.equal(peek.sha256, sha256); assert.equal(peek.body, undefined); assert.equal(peek.revealed, false)
  await new Promise((r) => setTimeout(r, 3))
  const reveal = await (await post(e, { kind: 'prize', from: 'author.test', body })).json() as { committedAt: string; witness: string; revealedAt: string; revealed: boolean }
  assert.equal(reveal.revealed, true)
  assert.equal(reveal.committedAt, commitment.committedAt)
  assert.equal(reveal.witness, commitment.witness)
  assert.ok(reveal.revealedAt > commitment.committedAt)
  const after = await (await worker.fetch(req(`/docket/${address}`), e)).json() as { revealedAt?: string; body: { n: number } }
  assert.ok(after.revealedAt); assert.equal(after.body.n, 42)
  const other = env()
  await post(other, { address: uuidOf('{"z":1}'), sha256: '1'.repeat(64), from: 'x', kind: 'prize' })
  const mismatch = await post(other, { kind: 'prize', from: 'x', body: { z: 1 } })
  assert.equal(mismatch.status, 409)
  assert.equal(((await mismatch.json()) as { mismatch: boolean }).mismatch, true)
})

test('parity per stripe: a large entry loses one fragment in each of two stripes and both are rebuilt', async () => {
  const e = env()
  const body = { text: Array.from({ length: FRAGMENT_BYTES * (2 * STRIPE) + 7 }, (_, i) => String.fromCharCode(97 + ((i * 7 + (i >> 10)) % 26))).join('') }
  const { id, fragments, parities } = await (await post(e, { kind: 'imagination', from: 'qpu.test', body })).json() as { id: string; fragments: number; parities: number }
  assert.equal(fragments, 2 * STRIPE + 1); assert.equal(parities, 3)
  const m = e.store.map.get(`row:${id}`) as { fragments: string[] }
  for (const i of [1, STRIPE + 2]) { const k = `frag:${m.fragments[i]}`; const f = e.store.map.get(k) as { iv: string; ct: string }; e.store.map.set(k, { ...f, ct: f.ct.slice(0, -8) + 'DDDDDDDD' }) }
  const r = await worker.fetch(req(`/docket/${id}`), e)
  assert.equal(r.status, 200)
  assert.equal(r.headers.get('x-repaired'), '2')
  assert.equal(((await r.json()) as { body: { text: string } }).body.text, body.text)
})

test('a write replicates to every mirror in the same call, the roots agree, and a cheap read reports the mirrors\' agreement', async () => {
  const b = env()
  const a = env(memory(), KEY, ['https://b.test/docket'], (url, init) => worker.fetch(new Request(url, init), b))
  const w = await (await post(a, { kind: 'receipt', from: 'a.test', body: { rep: 1 } })).json() as { id: string; landed: { mirror: string; status: number }[] }
  assert.deepEqual(w.landed, [{ mirror: 'https://b.test/docket', status: 201 }])
  const onB = await worker.fetch(req(`/docket/${w.id}`), b)
  assert.equal(onB.status, 200)
  const rootA = ((await (await worker.fetch(req('/docket'), a)).json()) as { root: string }).root
  const rootB = ((await (await worker.fetch(req('/docket'), b)).json()) as { root: string }).root
  assert.equal(rootA, rootB)
  const cheap = await (await worker.fetch(req(`/docket/${w.id}?cheap`), a)).json() as { mirrors: { mirror: string; agree: boolean }[]; parities: unknown[] }
  assert.deepEqual(cheap.mirrors.map((m) => m.agree), [true])
  assert.equal(cheap.parities.length, 1)
})

test('the cheap docket read verifies seals and fingerprints without decrypting', async () => {
  const e = env()
  const { id } = await (await post(e, { kind: 'receipt', from: 'qpu.test', body: { c: 1 } })).json() as { id: string }
  const r = await (await worker.fetch(req(`/docket/${id}?cheap`), e)).json() as { seal: { valid: boolean }; allPresent: boolean; fragments: { present: boolean; seal: boolean }[]; parities: { present: boolean }[] }
  assert.equal(r.seal.valid, true)
  assert.equal(r.allPresent, true)
  assert.ok(r.fragments.every((f) => f.present && f.seal) && r.parities.every((p) => p.present))
})

test('unknown routes answer with the route list, health answers, and OPTIONS allows the cross-origin client', async () => {
  const r = await worker.fetch(req('/nowhere'), env())
  assert.equal(r.status, 404)
  const h = await worker.fetch(req('/health'), env())
  assert.equal(((await h.json()) as { tools: number }).tools, 18)
  const o = await worker.fetch(req('/mcp', { method: 'OPTIONS' }), env())
  assert.equal(o.status, 204)
})
