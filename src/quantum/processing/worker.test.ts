import test from 'node:test'
import assert from 'node:assert/strict'
import { handle } from './mcp.ts'
import { worker, Docket, discoveryOf, protectedResourceOf, roleAt, stripeCheckout, FRAGMENT_BYTES, STRIPE, sameToken, type Storage, type Env } from '../../worker.ts'
import { uuidOf, channelOf, uuidFromParts } from './unit/blocks.ts'
import { signStripe } from './toolboxes/billing.ts'

const KEY = Buffer.from(new Uint8Array(32).map((_, i) => i * 7 + 1)).toString('base64')
const memory = (): Storage & { map: Map<string, unknown> } => { const m = new Map<string, unknown>(); return { map: m, async get<T>(k: string) { return m.get(k) as T | undefined }, async put(k, v) { m.set(k, v) }, async delete(k) { return m.delete(k) }, async list<T>(o?: { prefix?: string }) { return new Map([...m].filter(([k]) => !o?.prefix || k.startsWith(o.prefix))) as Map<string, T> } } }
const env = (store = memory(), dataKey: string | null = KEY, mirrors: string[] = [], fetcher?: (url: string, init?: RequestInit) => Promise<Response>): Env & { store: typeof store } => { const key = dataKey === null ? undefined : dataKey; const d = new Docket(store, key, mirrors, fetcher, 'test-token'); return { store, QPU_WRITE_TOKEN: 'test-token', QPU_ADMIN_TOKEN: 'admin-token', QPU_DATA_KEY: key, DOCKET: { idFromName: () => 'qpu', get: () => ({ fetch: (r: Request) => d.fetch(r) }) } } }
const auth = { authorization: 'Bearer test-token', 'content-type': 'application/json' }
const admin = { authorization: 'Bearer admin-token', 'content-type': 'application/json' }
const TOOL_COUNT = (handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: unknown[] } }).result.tools.length
const post = (e: Env, entry: unknown) => worker.fetch(req('/docket', { method: 'POST', headers: auth, body: JSON.stringify(entry) }), e)
const req = (path: string, init?: RequestInit) => new Request(`https://qpu.test${path}`, init)

test('POST /mcp serves the handler: tools/list names every tool of every toolbox and every response carries the licence', async () => {
  const r = await worker.fetch(req('/mcp', { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) }), env())
  assert.equal(r.status, 200)
  assert.equal(r.headers.get('x-license'), 'CC-BY-NC-ND-4.0')
  assert.ok(r.headers.get('link')!.includes('rel="license"'))
  const body = await r.json() as { result: { tools: { name: string }[] } }
  assert.equal(body.result.tools.length, TOOL_COUNT)
  const call = await worker.fetch(req('/mcp', { method: 'POST', body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'algorithm', arguments: { name: 'shor', N: 15, a: 7 } } }) }), env())
  const data = await call.json() as { result: { structuredContent: { summary: string[][] } } }
  assert.equal(data.result.structuredContent.summary.find((r) => r[0] === 'Factors')?.[1], '3 × 5')
})

test('the discovery document states only what the tree is', async () => {
  const d = discoveryOf('https://qpu.test')
  assert.equal(d.mcp, 'https://qpu.test/mcp')
  assert.equal(d.tools.length, TOOL_COUNT)
  assert.equal(d.bounds.shorN, 21)
  assert.equal(d.key, 432)
  assert.equal(d.license.spdx, 'CC-BY-NC-ND-4.0')
  // the discovery document is the standard contract too: OpenAPI 3.1, every tool a component schema beside the two JSON-RPC envelopes, every endpoint path a path (textbook_openapi_contract)
  assert.equal(d.openapi, '3.1.0')
  assert.equal(Object.keys(d.components.schemas).length - 2, TOOL_COUNT)
  const paths = d.paths as Record<string, Record<string, { requestBody?: unknown }>>
  assert.ok(paths['/mcp']!.post!.requestBody && paths['/docket/{id}']!.get && paths['/docket/{id}']!.delete)
  // RFC 9728 from the names alone: no issuer named, no authorization server; the issuer named in the environment, one — the docket roles the scopes either way
  const bare = protectedResourceOf('https://qpu.test')
  assert.equal(bare.resource, 'https://qpu.test/mcp')
  assert.deepEqual(bare.authorization_servers, [])
  assert.ok(bare.scopes_supported.includes('docket:writer') && bare.scopes_supported.includes('docket:admin'))
  const bound = protectedResourceOf('https://qpu.test', { [bare['x-qpu'].issuer]: 'https://issuer.test' })
  assert.deepEqual(bound.authorization_servers, ['https://issuer.test'])
  const pr = await worker.fetch(req('/.well-known/oauth-protected-resource'), env())
  assert.equal(pr.status, 200)
  assert.equal(((await pr.json()) as { resource: string }).resource.endsWith('/mcp'), true)
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
  const refused = await worker.fetch(req(`/docket/${a}`, { method: 'DELETE', headers: admin }), e)
  assert.equal(refused.status, 409)
  const bad = await post(e, { kind: 'receipt', from: 'qpu.test', body: { r: 2 }, links: ['00000000-0000-8000-8000-000000000000'] })
  assert.equal(bad.status, 404)
  const delB = await worker.fetch(req(`/docket/${b}`, { method: 'DELETE', headers: admin }), e)
  assert.equal(delB.status, 200)
  const refsAfter = ((await (await worker.fetch(req(`/docket/${a}`), e)).json()) as { refs: number }).refs
  assert.equal(refsAfter, 0)
  const delA = await worker.fetch(req(`/docket/${a}`, { method: 'DELETE', headers: admin }), e)
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
  const refused = await worker.fetch(req(`/docket/${first.id}`, { method: 'DELETE', headers: admin }), e)
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

test('a single UUID unfurls into its page from the id alone: head, Open Graph, swatch and licence need no lookup; the body loads client-side', async () => {
  const e = env()
  const { id } = await (await post(e, { kind: 'reading', from: 'sensor.test', body: { quantity: 'temperature', unit: 'K', value: 293 } })).json() as { id: string }
  const r = await worker.fetch(req(`/docket/${id}`, { headers: { accept: 'text/html' } }), e)
  assert.equal(r.status, 200)
  const html = await r.text()
  assert.ok(html.includes(`<meta property="og:url" content="https://qpu.test/docket/${id}">`))
  assert.ok(html.includes('property="og:image" content="data:image/svg+xml'))
  assert.ok(html.includes(`uuidna:handle" content="${id.slice(0, 8)}"`))
  assert.ok(html.includes('uuidna:seal" content="true"'))
  assert.ok(html.includes('CC-BY-NC-ND-4.0') && html.includes('--a432-hue: 72;'))
  assert.ok(!html.includes('temperature'), 'the body is not in the head: it loads client-side')
  const unknown = uuidOf('never stored')
  const page = await worker.fetch(req(`/docket/${unknown}?og`), e)
  assert.equal(page.status, 200, 'a UUID with no entry here still unfurls')
  assert.ok((await page.text()).includes(unknown.slice(0, 8)))
  const json = await worker.fetch(req(`/docket/${unknown}`), e)
  assert.equal(json.status, 200, 'no 404 from a block: the page computed from the id alone')
  const computed = await json.json() as { computed: boolean; body: { valid: boolean; channel: { handle: string } } }
  assert.ok(computed.computed && computed.body.valid && computed.body.channel.handle === unknown.slice(0, 8))
})

test('the walk: a handle opens its family, a program compiles and executes next, the referer is prev, a locale is a translation lead', async () => {
  const e = env()
  const { id: u } = await (await post(e, { kind: 'receipt', from: 'qpu.test', body: 'qpu' })).json() as { id: string }
  const ch = channelOf(u)
  const fam = await (await worker.fetch(req(`/${ch.handle}`), e)).json() as { handle: string; entries: { id: string }[]; doors: { nibble: string; tool: string; href: string }[] }
  assert.equal(fam.handle, ch.handle); assert.equal(fam.doors.length, 16); assert.ok(fam.entries.some((x) => x.id === u))
  const walk = await worker.fetch(req(`/${ch.handle}/${ch.program.map((n) => n.toString(16)).join('')}/${ch.tail}`, { headers: { accept: 'text/html', referer: 'https://qpu.test/docket/' + u } }), e)
  assert.equal(walk.status, 200)
  const html = await walk.text()
  assert.ok(html.includes(`<link rel="prev" href="https://qpu.test/docket/${u}">`))
  assert.ok(html.includes('<link rel="next" href="https://qpu.test/' + ch.handle + '/'))
  assert.ok(html.includes('<h2>Program</h2>') && html.includes('Next, executed'))
  const walkJson = await (await worker.fetch(req(`/${ch.handle}/${ch.program.map((n) => n.toString(16)).join('')}/${ch.tail}`), e)).json() as { id: string; next: { href: string }; compiled: { tool: string }[]; result: unknown }
  assert.equal(walkJson.id, uuidFromParts(ch.handle, ch.program, ch.tail)); assert.equal(walkJson.compiled.length, 10); assert.ok(walkJson.result)
  const bgPage = await (await worker.fetch(req(`/bg/${ch.handle}`, { headers: { accept: 'text/html' } }), e)).text()
  assert.ok(bgPage.includes('<html lang="bg">') && bgPage.includes('Врати') && bgPage.includes('семейство'))
  const de = await (await worker.fetch(req(`/de/${ch.handle}`), e)).json() as { notes: string[] }
  assert.ok(de.notes[0]!.startsWith('translate later: German'))
})

test('a commit handle is a handle in qpu: its imprint commitment carries the commit as handle, links the receipt, opens a family and walks on', async () => {
  const e = env()
  const receipt = { id: 'r', steps: ['green'] }
  const { id: receiptId, sha256 } = await (await post(e, { kind: 'receipt', from: 'qpu.test', body: receipt })).json() as { id: string; sha256: string }
  const commit = '9452c2d4'
  const ch = channelOf(receiptId)
  const address = uuidFromParts(commit, ch.program, ch.tail)
  const c = await post(e, { kind: 'imprint', from: 'qpu.test', address, sha256, links: [receiptId] })
  assert.equal(c.status, 201)
  const fam = await (await worker.fetch(req(`/${commit}`), e)).json() as { entries: { id: string; kind: string }[] }
  assert.ok(fam.entries.some((x) => x.id === address && x.kind === 'imprint'))
  const linked = await (await worker.fetch(req(`/docket/${receiptId}`), e)).json() as { refs: number }
  assert.equal(linked.refs, 1)
  const walk = await (await worker.fetch(req(`/${commit}/${ch.program.map((n) => n.toString(16)).join('')}/${ch.tail}`), e)).json() as { id: string; compiled: unknown[] }
  assert.equal(walk.id, address); assert.equal(walk.compiled.length, 10)
})

test('catch all, decide later: a path that is not a walk is put to the match tool and comes back decided, never a bare 404', async () => {
  const e = env()
  const page = await worker.fetch(req('/how-many-qubits-does-willow-have', { headers: { accept: 'text/html' } }), e)
  assert.equal(page.status, 200)
  assert.ok((await page.text()).includes('Decided by the match tool: <strong>served</strong>'))
  const j = await worker.fetch(req('/nowhere'), e)
  assert.equal(j.status, 404)
  const d = await j.json() as { decided: { verdict: string; lead: { status: string } } }
  assert.ok(['unknown', 'impossible', 'served'].includes(d.decided.verdict))
})

test('the fallback for anything: a path that names cached assets is answered by their verified combination, code as code, addressed by ETag', async () => {
  const e = env()
  const code = await worker.fetch(req('/collections/entries.ts'), e)
  assert.equal(code.status, 200)
  assert.ok((code.headers.get('content-type') ?? '').startsWith('text/typescript'))
  assert.ok(code.headers.get('etag') && code.headers.get('x-qpu-address'))
  assert.ok((await code.text()).includes('Entries'))
  const again = await worker.fetch(req('/collections/entries.ts', { headers: { 'if-none-match': code.headers.get('etag')! } }), e)
  assert.equal(again.status, 304, 'the same path answers the same address: an involution')
  const j = await worker.fetch(req('/collections/entries'), e)
  assert.equal(j.status, 200)
  const c = await j.json() as { count: number; verified: boolean; kinds: string[]; bill: { coils: number; licence: { links: number } }; decided: unknown }
  assert.ok(c.count >= 2 && c.verified && c.kinds.includes('code') && c.bill.coils === 1 && c.bill.licence.links === 2)
  const none = await worker.fetch(req('/nowhere'), e)
  assert.equal(none.status, 404, 'a path that names no asset keeps the decision alone')
})

test('licensing by architecture: a commercial coil without a licence is refused with the court; the pure algebra and non-commercial use pass; every result carries its side', async () => {
  const e = env()
  const body = (name: string, args: Record<string, unknown>) => JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } })
  const coil = await worker.fetch(req('/mcp', { method: 'POST', headers: { 'content-type': 'application/json', 'x-qpu-use': 'commercial', 'x-qpu-subject': 'acme.example' }, body: body('roadmap', {}) }), e)
  assert.equal(coil.status, 402)
  const c = await coil.json() as { court: { rule: string; case: string }; fusion: { side: string } }
  assert.ok(c.court.rule === 'licence' && /^[0-9a-f-]{36}$/.test(c.court.case) && c.fusion.side === 'coil')
  const free = await worker.fetch(req('/mcp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: body('roadmap', {}) }), e)
  assert.equal(free.status, 200, 'non-commercial use stays free under its term')
  const side = (await free.json() as { result: { _meta: { fusion: { side: string } } } }).result._meta.fusion.side
  assert.equal(side, 'coil')
  const algebra = await worker.fetch(req('/mcp', { method: 'POST', headers: { 'content-type': 'application/json', 'x-qpu-use': 'commercial' }, body: body('css', {}) }), e)
  assert.equal(algebra.status, 200, 'the pure algebra is a coin: free for any use under attribution')
})

test('cheap gates leading every violator to court via its own MCP: a refusal carries the case computed, the rule, the theorem and the call to file it', async () => {
  const e = env()
  const bad = await worker.fetch(req('/docket/not-an-id', { method: 'DELETE', headers: { authorization: 'Bearer ' + (e.QPU_WRITE_TOKEN_UUIDNA ?? e.QPU_WRITE_TOKEN ?? '') } }), e)
  assert.ok(bad.status >= 400 && bad.status < 500)
  const c = (await bad.json() as { court?: { rule: string; theorem: string; case: string; via: { file: { tool: string } } } }).court
  assert.ok(c && /^[0-9a-f-]{36}$/.test(c.case) && c.theorem.startsWith('textbook_') && c.via.file.tool === 'legal', 'the refusal names its court')
  const ok = await worker.fetch(req('/health'), e)
  assert.equal(ok.status, 200)
  assert.equal((await ok.json() as { court?: unknown }).court, undefined, 'a gate that answers leads nobody to court')
})

test('unknown routes answer with the route list, health answers, and OPTIONS allows the cross-origin client', async () => {
  const r = await worker.fetch(req('/nowhere'), env())
  assert.equal(r.status, 404)
  const h = await worker.fetch(req('/health'), env())
  const health = (await h.json()) as { status: string; tenant: string; metrics: { tools: number; auditPassed: number; auditChecks: number } }
  assert.equal(health.metrics.tools, TOOL_COUNT); assert.equal(health.tenant, 'local'); assert.equal(health.metrics.auditPassed, health.metrics.auditChecks)
  const o = await worker.fetch(req('/mcp', { method: 'OPTIONS' }), env())
  assert.equal(o.status, 204)
})

test('tenants by host and roles by token: a writer token cannot delete, a token of one tenant holds no role at another and the answer names the procedure', async () => {
  const e = env()
  const ids = new Set<string>()
  const dockets = { ...e, DOCKET: { idFromName: (n: string) => { ids.add(n); return e.DOCKET!.idFromName(n) }, get: (id: unknown) => e.DOCKET!.get(id) } }
  const uuid = await worker.fetch(new Request('https://qpu.uuidna.com/docket'), dockets)
  const psg = await worker.fetch(new Request('https://qpu.psg.bg/docket'), dockets)
  assert.equal(uuid.status, 200); assert.equal(psg.status, 200)
  assert.deepEqual([...ids].sort(), ['psg', 'uuidna'], 'one docket per tenant, named by the host\'s tenant')
  const writerDelete = await worker.fetch(new Request('https://qpu.psg.bg/docket/x', { method: 'DELETE', headers: auth }), dockets)
  assert.equal(writerDelete.status, 403)
  const body = (await writerDelete.json()) as { procedure: { header: string }; role: string }
  assert.equal(body.role, 'writer'); assert.ok(body.procedure.header.includes('admin token'))
  const other = { ...e, QPU_WRITE_TOKEN_UUIDNA: 'u-token', QPU_WRITE_TOKEN_PSG: 'p-token', QPU_WRITE_TOKEN: undefined }
  const collision = await worker.fetch(new Request('https://qpu.psg.bg/docket', { method: 'POST', headers: { authorization: 'Bearer u-token', 'content-type': 'application/json' }, body: '{}' }), other)
  assert.equal(collision.status, 403)
  const c = (await collision.json()) as { collision: string; lead: { id: string } }
  assert.ok(c.collision.includes('tenant uuidna presented at tenant psg')); assert.equal(c.lead.id, 'rbac-collision-psg')
  const reader = await worker.fetch(new Request('https://qpu.psg.bg/docket', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }), other)
  assert.equal(reader.status, 401)
  const d = discoveryOf('https://qpu.psg.bg')
  assert.equal(d.tenant, 'psg'); assert.equal(d.roles.admin.header?.includes('admin token'), true)
})

test('roles are asked of the RBAC MCP host first and fall back to the tenant secrets when it is silent', async () => {
  const e = { ...env(), QPU_RBAC_MCP: 'https://rbac.test/mcp', QPU_RBAC_TOOL: 'role' }
  const asked: unknown[] = []
  const answering = async (_url: string, init: RequestInit) => { asked.push(JSON.parse(String(init.body))); return new Response(JSON.stringify({ jsonrpc: '2.0', id: 1, result: { structuredContent: { role: 'admin' } } }), { headers: { 'content-type': 'application/json' } }) }
  const r = await roleAt(e, 'psg', 'qpu.psg.bg', 'any-token', answering)
  assert.deepEqual(r, { role: 'admin', by: 'rbac-mcp' })
  assert.deepEqual((asked[0] as { params: { name: string; arguments: unknown } }).params, { name: 'role', arguments: { token: 'any-token', tenant: 'psg', host: 'qpu.psg.bg' } })
  const silent = async () => { throw new Error('unreachable') }
  assert.deepEqual(await roleAt(e, 'psg', 'qpu.psg.bg', 'test-token', silent), { role: 'writer', by: 'tenant-secrets' })
  assert.deepEqual(await roleAt(env(), 'psg', 'qpu.psg.bg', 'admin-token', silent), { role: 'admin', by: 'tenant-secrets' })
})

test('Stripe per tenant on the Worker: the webhook verified with the tenant secret lands one entry, a replay is a duplicate, the state is read at the domain, and a checkout runs with the tenant key', async () => {
  const secret = 'whsec_psg'
  const e = { ...env(), STRIPE_WEBHOOK_SECRET_PSG: secret, STRIPE_SECRET_KEY_PSG: 'sk_test_psg' }
  const payload = JSON.stringify({ id: 'evt_w1', type: 'checkout.session.completed', created: 1_700_000_000, data: { object: { customer: 'cus_9', amount_total: 100, currency: 'eur', metadata: { subject: 'acme', domains: 'qpu.psg.bg,qpu.uuidna.com' } } } })
  const sig = signStripe(secret, Math.floor(Date.now() / 1000), payload)
  const hook = (body: string, signature: string) => worker.fetch(new Request('https://qpu.psg.bg/docket/stripe', { method: 'POST', headers: { 'stripe-signature': signature, 'content-type': 'application/json' }, body }), e)
  const first = await hook(payload, sig); assert.equal(first.status, 200)
  const f = (await first.json()) as { state: string; duplicate: boolean; stored: boolean }
  assert.equal(f.state, 'granted'); assert.equal(f.duplicate, false); assert.equal(f.stored, true)
  const again = await hook(payload, sig); const a = (await again.json()) as { duplicate: boolean }
  assert.equal(a.duplicate, true, 'the same event again is a duplicate, nothing changes')
  const forged = await hook(payload.replace('100', '1'), sig); assert.equal(forged.status, 400)
  const state = (await (await worker.fetch(new Request('https://qpu.psg.bg/docket/stripe/acme'), e)).json()) as { state: string; entries: number }
  assert.equal(state.state, 'licensed'); assert.equal(state.entries, 1)
  const elsewhere = (await (await worker.fetch(new Request('https://qpu.ceci.workers.dev/docket/stripe/acme'), e)).json()) as { state: string }
  assert.equal(elsewhere.state, 'unlicensed', 'the ceci docket holds no entry for acme: a licence is where its entries are')
  const unconfigured = await worker.fetch(new Request('https://qpu.uuidna.com/docket/stripe', { method: 'POST', headers: { 'stripe-signature': sig }, body: payload }), e)
  assert.equal(unconfigured.status, 503)
  const sent: { url: string; auth: string | undefined; body: string }[] = []
  const stripeApi = async (url: string, init: RequestInit) => { sent.push({ url, auth: (init.headers as Record<string, string>).authorization, body: String(init.body) }); return new Response(JSON.stringify({ id: 'cs_1', url: 'https://checkout.stripe.com/c/cs_1' }), { headers: { 'content-type': 'application/json' } }) }
  const planned = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'stripe', arguments: { op: 'plan', tenant: 'psg', host: 'qpu.psg.bg', checkout: { subject: 'acme', successUrl: 'https://qpu.psg.bg/ok', cancelUrl: 'https://qpu.psg.bg/no', amount: 100 } } } }) as { result: { structuredContent: { plan: { url: string; form: Record<string, string>; headers: Record<string, string>; secret: string } } } }
  const executed = (await stripeCheckout(planned, new URL('https://qpu.psg.bg/mcp'), e, stripeApi)) as { result: { structuredContent: { executed: boolean; url: string } } }
  assert.equal(executed.result.structuredContent.executed, true); assert.equal(executed.result.structuredContent.url, 'https://checkout.stripe.com/c/cs_1')
  assert.equal(sent[0]!.auth, 'Bearer sk_test_psg'); assert.ok(sent[0]!.body.includes('metadata%5Bsubject%5D=acme'))
})

test('the cheapest view over the Worker: ?view=cheapest answers the address, the recompute call and the tampering cost', async () => {
  const e = env()
  const res = await worker.fetch(req('/mcp?view=cheapest', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'roadmap', arguments: {} } }) }), e)
  assert.equal(res.status, 200)
  const v = JSON.parse(((await res.json()) as { result: { content: { text: string }[] } }).result.content[0]!.text) as { address: string; recompute: { tool: string }; tamper: { secondPreimage: string } }
  assert.ok(/^[0-9a-f-]{36}$/.test(v.address) && v.recompute.tool === 'roadmap' && v.tamper.secondPreimage === '2^256')
})
