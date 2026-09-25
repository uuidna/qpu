import { test } from './receipted.js'
import assert from 'node:assert/strict'
import worker, { qpuCubeOf, qpuFacesOf, raidJoinOf, raidStripeOf } from './index.js'

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

  // Bounded, and bounded per layer: the catalog makes three page-budgeted walks, so no layer is listed more times
  // than there are faces. A ceiling rather than an equality, so retuning the budget does not break the property.
  assert.ok(kvLists > 0, 'the KV layer was never listed, so this store was not exercised')
  assert.ok(r2Lists > 0, 'the R2 layer was never listed, so this store was not exercised')
  assert.ok(kvLists <= qpuFacesOf().faces, `KV was listed ${kvLists} times for one request`)
  assert.ok(r2Lists <= qpuFacesOf().faces, `R2 was listed ${r2Lists} times for one request`)
  assert.ok(Array.isArray(body.keys), 'the catalog still answers with the census it did manage to take')
})

test('storage: the catalog costs the same whether the store holds ten keys or a thousand', async () => {
  // WHAT ACTUALLY TOOK THE DOOR DOWN. The monitor read every value, sequentially, to decide `verified` — and
  // store.get reads KV and then R2, so a catalog request cost one or two subrequests PER KEY. Measured live at
  // 253 keys: 27 seconds, and monitor.holds false, because reads past Cloudflare's per-request budget came back
  // empty, every empty read skipped its key, and `verified === keys` stopped being true. The door was reporting
  // the store as unhealthy when what was unhealthy was the question being asked of it.
  //
  // Share presence is a question about NAMES, and the listing already carries them. This store is the live one's
  // shape — 253 links, fourteen shares each — and the assertion is that the reads do not scale with it.
  // The live store's shape, in the lattice's own numbers: links enough to outrun any per-key budget, and one
  // share per face. `faces` is what RAID actually stripes across, so a change to the geometry moves this fixture
  // with it instead of leaving a 14 here that quietly means something else.
  const { faces } = qpuFacesOf()
  const { bits } = qpuCubeOf()
  const links = Array.from({ length: bits * qpuCubeOf().vertices }, (_, i) => `probe-${i}`)
  const names = [...links, ...links.flatMap((k) => Array.from({ length: faces }, (_, f) => `${k}/@${f}`))]
  let reads = 0
  const populated = {
    QPU_HOST: host,
    STORAGE: {
      get: async () => { reads += 1; return { v: 1 } },
      put: async () => {},
      delete: async () => {},
      list: async (options?: { prefix?: string }) => ({
        keys: names.filter((nm) => nm.startsWith(options?.prefix ?? '')).map((nm) => ({ name: nm })),
        list_complete: true,
      }),
    },
    BLOBS: {
      get: async () => null,
      put: async () => ({}),
      delete: async () => {},
      list: async () => ({ objects: [], truncated: false }),
    },
  }

  const response = await worker.fetch(new Request(`${origin}/storage`, { headers: html }), populated)
  assert.equal(response.status, 200)
  const body = (await response.json()) as {
    holds: boolean
    monitor: { holds: boolean; keys: number; verified: number; missing: number; shares: number; expected: number; sampled: number }
  }

  // Every link verified, from the listing alone.
  assert.equal(body.monitor.keys, links.length)
  assert.equal(body.monitor.verified, links.length)
  assert.equal(body.monitor.missing, 0)
  assert.equal(body.monitor.shares, body.monitor.expected)
  assert.equal(body.monitor.holds, true)
  assert.equal(body.holds, true)

  // AND THE COST DID NOT FOLLOW THE STORE. This is the property; the exact sample size is an implementation
  // choice, so the bound is generous and the point is that it is a bound at all rather than 253.
  assert.ok(reads < links.length, `the monitor read ${reads} values for ${links.length} keys — the reads scale with the store`)
  assert.ok(reads <= qpuCubeOf().bits, `${reads} value reads in one catalog request`)
  // The byte total is a sample and says so, rather than being a confident figure measured over part of the store.
  assert.equal(body.monitor.sampled, reads)
})

test('storage: maintain repairs what is broken and does not read what is not', async () => {
  // MAINTAIN HAD THE SAME FAULT AS THE MONITOR AND IT MATTERED MORE. It read every value, sequentially, to find the
  // few needing a rewrite — so at 253 links it was past a Worker's subrequest budget before attempting a single
  // repair, and the repair path failed on exactly the stores that needed it. A missing share is a missing NAME and
  // the listing carries the names, so the broken set is decided without reading anything.
  //
  // This store persists, so the fault is asserted to CLEAR rather than merely to be attempted.
  const { faces } = qpuFacesOf()
  const links = Array.from({ length: faces * qpuFacesOf().coins }, (_, i) => `mend-${i}`)
  const kv = new Map<string, string>()
  for (const key of links) {
    kv.set(key, JSON.stringify({ v: key }))
    for (let f = 0; f < faces; f++) kv.set(`${key}/@${f}`, JSON.stringify('share'))
  }
  kv.delete('mend-7/@9') // exactly the shape of the live fault: one link, one face

  let reads = 0
  const bound = {
    QPU_HOST: host,
    QPU_WRITE_TOKEN: 'qpu-test-write-token',
    STORAGE: {
      get: async (key: string) => { reads += 1; const v = kv.get(key); return v === undefined ? null : JSON.parse(v) },
      put: async (key: string, value: string) => { kv.set(key, value) },
      delete: async (key: string) => { kv.delete(key) },
      list: async (options?: { prefix?: string }) => ({
        keys: [...kv.keys()].filter((k) => k.startsWith(options?.prefix ?? '')).map((name) => ({ name })),
        list_complete: true,
      }),
    },
  }
  const call = (body: unknown) =>
    worker.fetch(
      new Request(`${origin}/storage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'text/html', authorization: `Bearer ${bound.QPU_WRITE_TOKEN}` },
        body: JSON.stringify(body),
      }),
      bound,
    )

  const mended = (await (await call({ maintain: true })).json()) as { repaired: number; remaining: number }
  assert.equal(mended.repaired, 1, 'one link was broken, so one link is repaired')
  assert.equal(mended.remaining, 0, 'and nothing is left for a second call')

  // THE COST DID NOT FOLLOW THE STORE. Forty links, one broken: the reads are the repair plus the monitor's byte
  // sample, not one per link.
  assert.ok(reads < links.length, `maintain read ${reads} values for ${links.length} links`)

  // AND THE FAULT IS GONE — asked of the catalog, which is what reported it.
  const after = (await (await worker.fetch(new Request(`${origin}/storage`, { headers: html }), bound)).json()) as {
    holds: boolean
    monitor: { missing: number; verified: number; keys: number; incomplete: unknown[] }
  }
  assert.equal(after.monitor.missing, 0)
  assert.equal(after.monitor.verified, after.monitor.keys)
  assert.deepEqual(after.monitor.incomplete, [])
  assert.equal(after.holds, true)
})

test('raid: striping inverts across every residue of length against rays, up to faces', () => {
  // WHAT THE WRITE PATH USED TO ASK, ASKED PROPERLY. Every storage write stringified its value, dealt it into
  // rays, joined it back and compared — then fed that into the write's holds. It never consulted the store, so a
  // write that landed nowhere said exactly what a write that landed said: the answer was already in the input,
  // which is the one thing a holds here may not be. It was O(value) on the write path as well.
  //
  // And one sample per write proves one case. Dealing text into rays can only behave differently by LENGTH
  // MODULO RAYS, so the real claim is a cross product — every residue against every ray count the lattice admits.
  // Walked once here instead of sampled forever at runtime.
  const { coins, rays, faces } = qpuFacesOf()
  const { hexbit, bits } = qpuCubeOf()
  const roundTrip = (text: string, stripes: number) => raidJoinOf(raidStripeOf(text, stripes))
  const alphabet = (length: number) =>
    Array.from({ length }, (_, i) => String.fromCharCode(97 + (i % 26))).join('')

  let checked = 0
  for (let stripes = coins; stripes <= faces; stripes++) {
    for (let residue = 0; residue < stripes; residue++) {
      // One length per residue class, long enough to wrap the deal several times over.
      const text = alphabet(stripes * hexbit + residue)
      assert.equal(text.length % stripes, residue)
      assert.equal(roundTrip(text, stripes), text, `length ${text.length} dealt into ${stripes}`)
      checked += 1
    }
  }
  // Every pair from coins stripes up to faces: the triangular number of faces, less the single-stripe row.
  assert.equal(checked, (faces * (faces + 1)) / 2 - 1)

  // The three cases the residue walk cannot reach: one stripe, no text, and less text than there are rays.
  assert.equal(roundTrip(alphabet(faces), 1), alphabet(faces))
  assert.equal(roundTrip('', rays), '')
  assert.equal(roundTrip('x', rays), 'x')

  // And a value the width of the register's word squared — the largest single write the unit describes.
  const wide = alphabet(bits * bits)
  assert.equal(roundTrip(wide, rays), wide)
})
