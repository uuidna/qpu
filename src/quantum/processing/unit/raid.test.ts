import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker from './index.js'

const host = 'qpu.uuidna.com'
const env = { QPU_HOST: host, QPU_WRITE_TOKEN: 'qpu-test-write-token' }
const bearer = { authorization: `Bearer ${env.QPU_WRITE_TOKEN}` }
const html = { accept: 'text/html' }
const origin = `https://${host}`

const fetchOf = (path: string, init: RequestInit = {}) =>
  worker.fetch(
    new Request(`${origin}${path}`, {
      ...init,
      headers: {
        ...html,
        ...(init.method === 'PUT' || init.method === 'POST' || init.method === 'DELETE' ? bearer : {}),
        ...(init.headers as Record<string, string> | undefined),
      },
    }),
    env,
  )

test('raid starts cheapest and covers all', async () => {
  const catalog = (await (await fetchOf('/storage')).json()) as {
    kind: string
    anything: boolean
    raid: {
      holds: boolean
      start: string
      cheapest: string
      cover: string[]
      pick: { name: string; cost: number }
      types: { name: string; cost: number; face: number }[]
      clouds: { name: string }[]
      cluster: { rotate: boolean; cost: string; security: string; speed: string }
    }
    hybrid: { speed: number; cost: number; layers: number; holds: boolean }
    payload: { key: string; seed: number; remainder: number; unity: boolean; collections: string[]; secrets: boolean }
    alpine: { native: boolean; os: string; libc: string; toolbox: string; fs: string; upper: string; lower: string; work: string; inode: boolean; unlink: boolean; next: number; fused: number; last: boolean; infinite: boolean }
    holds: boolean
  }
  assert.equal(catalog.kind, 'storage')
  assert.equal(catalog.anything, true)
  assert.equal(catalog.holds, true)
  assert.equal(catalog.hybrid.speed, 8)
  assert.equal(catalog.hybrid.cost, 3)
  assert.equal(catalog.payload.key, 'databases/payload')
  assert.equal(catalog.payload.seed, 1)
  assert.equal(catalog.payload.remainder, 0)
  assert.equal(catalog.payload.unity, true)
  assert.equal(catalog.payload.collections.join(' '), 'pages users media tenants')
  assert.equal(catalog.payload.secrets, false)
  assert.equal(catalog.alpine.native, true)
  assert.equal(catalog.alpine.os, 'alpine')
  assert.equal(catalog.alpine.libc, 'musl')
  assert.equal(catalog.alpine.toolbox, 'busybox')
  assert.equal(catalog.alpine.fs, 'overlay')
  assert.equal(catalog.alpine.upper, 'kv')
  assert.equal(catalog.alpine.lower, 'r2')
  assert.equal(catalog.alpine.work, 'kv')
  assert.equal(catalog.alpine.work, catalog.alpine.upper)
  assert.equal(catalog.alpine.inode, true)
  assert.equal(catalog.alpine.unlink, true)
  assert.equal(catalog.alpine.next, catalog.alpine.fused + catalog.alpine.fused)
  const seeded = (await (await fetchOf('/storage/databases/payload/seed')).json()) as {
    key: string
    seed: number
    remainder: number
    unity: boolean
    holds: boolean
    value: { key: string; seed: number; unity: boolean; secrets: boolean; collections: string[] }
  }
  assert.equal(seeded.holds, true)
  assert.equal(seeded.key, 'databases/payload/seed')
  assert.equal(seeded.seed, 1)
  assert.equal(seeded.remainder, 0)
  assert.equal(seeded.unity, true)
  assert.equal(seeded.value.secrets, false)
  assert.equal(seeded.value.collections.join(' '), 'pages users media tenants')
  assert.equal(catalog.raid.holds, true)
  assert.equal(catalog.raid.start, 'cheapest')
  assert.equal(catalog.raid.cheapest, '0')
  assert.equal(catalog.raid.cover[0], '0')
  assert.equal(catalog.raid.cover.length, 14)
  assert.equal(catalog.raid.types[0]?.name, '0')
  assert.equal(catalog.raid.types[0]?.cost, 1)
  assert.equal(catalog.raid.pick.name, catalog.raid.cover[0])
  assert.equal(catalog.raid.clouds.length, 14)
  assert.equal(catalog.raid.cluster.rotate, true)
  assert.equal(catalog.raid.cluster.cost, 'minimum')
  assert.equal(catalog.raid.cluster.security, 'crypt')
  assert.equal(catalog.raid.cluster.speed, 'coordinated')
  const picked: string[] = []
  for (let i = 0; i < 14; i++) {
    const res = await fetchOf(`/storage/docs/sheet-${i}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind: 'docs', row: i, value: i + i }),
    })
    assert.equal(res.status, 200)
    const stored = (await res.json()) as { holds: boolean; raid: { pick: { name: string }; cover: string[] }; value: { kind: string } }
    assert.equal(stored.holds, true)
    assert.equal(stored.value.kind, 'docs')
    picked.push(stored.raid.pick.name)
  }
  assert.deepEqual([...picked].sort(), [...catalog.raid.cover].sort())
  const got = (await (await fetchOf('/storage/docs/sheet-0')).json()) as { key: string; value: { kind: string; row: number }; holds: boolean }
  assert.equal(got.holds, true)
  assert.equal(got.key, 'docs/sheet-0')
  assert.equal(got.value.kind, 'docs')
  assert.equal(got.value.row, 0)
})

test('storage: the catalog walk is bounded by pages, and says when it stopped short', async () => {
  // THE FAULT THIS IS FOR TOOK THE LIVE HOST DOWN. `keys()` and `raw()` walked EVERY page of KV and every page of
  // R2 by cursor, and GET /storage calls both — so one request made an unbounded number of subrequests. A Worker
  // has a budget for those. Measured on qpu.uuidna.com: GET /storage never returned headers and the client timed
  // out at 20s, while /network and /server answered in about a second. The suite could not see it because no test
  // binds a store, so the cursor loops never ran at all and the local heap path returned instantly.
  //
  // This store never stops paging. Against the unbounded walk the request cannot complete; against the budget it
  // completes, having spent a countable number of list calls.
  let kvLists = 0
  let r2Lists = 0
  const endless = {
    QPU_HOST: host,
    STORAGE: {
      get: async () => null,
      put: async () => {},
      delete: async () => {},
      list: async (options?: { prefix?: string; limit?: number; cursor?: string }) => {
        kvLists += 1
        return {
          keys: [{ name: `kv-${options?.cursor ?? '0'}-${kvLists}` }],
          list_complete: false,
          cursor: `c${kvLists}`,
        }
      },
    },
    BLOBS: {
      get: async () => null,
      put: async () => ({}),
      delete: async () => {},
      list: async (options?: { prefix?: string; limit?: number; cursor?: string }) => {
        r2Lists += 1
        return { objects: [{ key: `r2-${options?.cursor ?? '0'}-${r2Lists}` }], truncated: true, cursor: `c${r2Lists}` }
      },
    },
  }

  const response = await worker.fetch(new Request(`${origin}/storage`, { headers: html }), endless)
  assert.equal(response.status, 200)
  const body = (await response.json()) as { keys?: unknown[] }

  // Bounded, and bounded per layer. The exact budget is an implementation choice; that it EXISTS is the property,
  // so this asserts a ceiling rather than an equality that would break the moment the budget is retuned.
  assert.ok(kvLists > 0, 'the KV layer was never listed, so this store was not exercised')
  assert.ok(r2Lists > 0, 'the R2 layer was never listed, so this store was not exercised')
  assert.ok(kvLists <= 16, `KV was listed ${kvLists} times for one request`)
  assert.ok(r2Lists <= 16, `R2 was listed ${r2Lists} times for one request`)
  assert.ok(Array.isArray(body.keys), 'the catalog still answers with the census it did manage to take')
})
