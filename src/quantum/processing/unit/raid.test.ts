import { test } from './receipted.js'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
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

test('storage: a write that could not place every slot says which ones, and does not claim to hold', async () => {
  // THE LIVE FAULT, REPRODUCED. A deposit makes two puts — the inode and the referrer — and each places the value
  // and fourteen RAID shares across KV and R2. Thirty slots each, sixty for the deposit, against a budget of
  // fifty. The tail of the second put is refused, and qpu.uuidna.com has been carrying feed records with faces 7,
  // 8 and 9 absent: stable across a minute of polling, so not read-after-write lag, and a different record each
  // time the store grows.
  //
  // Promise.all rejected on the first failure and discarded the rest, so the error named none of the slots. This
  // store refuses exactly the faces the live host loses.
  const { faces } = qpuFacesOf()
  const refused = [faces / 2, faces / 2 + 1, faces / 2 + 2]
  const partial = {
    QPU_HOST: host,
    QPU_WRITE_TOKEN: 'qpu-test-write-token',
    STORAGE: {
      get: async () => null,
      put: async (key: string) => {
        const face = key.includes('/@') ? Number(key.slice(key.lastIndexOf('/@') + 2)) : -1
        if (refused.includes(face)) throw new Error('Too many subrequests')
      },
      delete: async () => {},
      list: async () => ({ keys: [], list_complete: true }),
    },
    BLOBS: {
      get: async () => null,
      put: async () => ({}),
      delete: async () => {},
      list: async () => ({ objects: [], truncated: false }),
    },
  }

  const response = await worker.fetch(
    new Request(`${origin}/storage/feed/partial-probe`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json', accept: 'text/html', authorization: `Bearer ${partial.QPU_WRITE_TOKEN}` },
      body: JSON.stringify({ probe: true }),
    }),
    partial,
  )
  const body = (await response.json()) as { holds: boolean; denied?: string; placement?: string }

  // IT DOES NOT CLAIM TO HOLD. A write that placed eleven of fifteen slots is not a write.
  assert.equal(body.holds, false)
  assert.equal(body.denied, 'slots')
  // AND IT NAMES THEM. "something failed" leaves nobody able to repair anything.
  for (const face of refused) assert.match(body.placement ?? '', new RegExp(`face ${face}\\b`), `face ${face} is not named`)
  assert.match(body.placement ?? '', /slots placed/)
  // A refusal, not a crash: the door answers in the same shape it answers every other refusal in.
  assert.equal(response.status, 200)
})

test('storage: every door costs what the baseline says, on an empty store and a full one', async () => {
  // AUTONOMY, NOT ADVICE. Three faults this session were one fault — a cost that scales with the store, or exceeds
  // what a single request may spend: the catalog's unbounded cursor walk, the monitor's read per key, the
  // deposit's slots. Each was found by somebody reading the code, and each got a test for its own instance. None
  // of them would catch the next one. This counts every subrequest every door makes and holds it to a recorded
  // figure, so the next one fails the suite instead of reaching production.
  //
  // TWO PROFILES, BECAUSE ONE OF THEM CANNOT SEE THE CLASS. On an empty store a byte sample reads nothing and a
  // per-key loop runs zero times, so the very cost that broke the live host does not appear. The populated
  // profile is the shape of the live store. Written after an empty-only baseline failed to notice a byte sample
  // deliberately made larger — the guard was measuring the apparatus, which is the fault it exists to catch.
  const baseline = JSON.parse(readFileSync(join(process.cwd(), 'storage-subrequests.json'), 'utf8')) as {
    budget: number
    doors: Record<string, { empty: number; populated: number }>
    over: Record<string, string>
  }
  const { faces } = qpuFacesOf()
  const { bits, vertices } = qpuCubeOf()

  const storeOf = (populated: boolean) => {
    const kv = new Map<string, string>()
    if (populated) {
      for (let i = 0; i < bits * vertices; i++) {
        kv.set(`p-${i}`, JSON.stringify({ v: i }))
        for (let f = 0; f < faces; f++) kv.set(`p-${i}/@${f}`, JSON.stringify('s'))
      }
    }
    let spent = 0
    const count =
      <T extends unknown[], R>(fn: (...args: T) => Promise<R>) =>
      async (...args: T) => { spent += 1; return fn(...args) }
    const env = {
      QPU_HOST: host,
      QPU_WRITE_TOKEN: 'qpu-test-write-token',
      STORAGE: {
        get: count(async (key: string) => { const v = kv.get(key); return v === undefined ? null : JSON.parse(v) }),
        put: count(async (key: string, value: string) => { kv.set(key, value) }),
        delete: count(async (key: string) => { kv.delete(key) }),
        list: count(async (options?: { prefix?: string }) => ({
          keys: [...kv.keys()].filter((k) => k.startsWith(options?.prefix ?? '')).map((name) => ({ name })),
          list_complete: true,
        })),
      },
      BLOBS: {
        get: count(async () => null),
        put: count(async () => ({})),
        delete: count(async () => {}),
        list: count(async () => ({ objects: [] as { key: string }[], truncated: false })),
      },
    }
    return { env, spent: () => spent }
  }

  const doors = [
    { name: 'GET /storage', path: '/storage', method: 'GET' as const },
    { name: 'GET /storage/:key', path: '/storage/p-0', method: 'GET' as const },
    { name: 'PUT /storage/:key', path: '/storage/p-0', method: 'PUT' as const, body: { probe: true } },
    { name: 'POST /storage {maintain:true}', path: '/storage', method: 'POST' as const, body: { maintain: true } },
  ]

  const spentBy: Record<string, { empty: number; populated: number }> = {}
  for (const door of doors) {
    spentBy[door.name] = { empty: 0, populated: 0 }
    for (const profile of ['empty', 'populated'] as const) {
      const { env: metered, spent } = storeOf(profile === 'populated')
      const init: RequestInit = {
        method: door.method,
        headers: { 'content-type': 'application/json', accept: 'text/html', authorization: 'Bearer qpu-test-write-token' },
        ...('body' in door ? { body: JSON.stringify(door.body) } : {}),
      }
      await worker.fetch(new Request(`${origin}${door.path}`, init), metered)
      spentBy[door.name]![profile] = spent()
    }
  }

  if (process.env.QPU_BASELINE === 'print') console.log(JSON.stringify(spentBy, null, 2))
  for (const [name, recorded] of Object.entries(baseline.doors)) {
    for (const profile of ['empty', 'populated'] as const) {
      assert.equal(
        spentBy[name]?.[profile],
        recorded[profile],
        `${name} (${profile}) spends ${spentBy[name]?.[profile]} subrequests, baseline says ${recorded[profile]} — it may only shrink, so lower the number`,
      )
    }
  }

  // THE DEBT IS NAMED WITH A NUMBER ON IT. A door over the platform budget must be listed with the reason it has
  // not been brought under. Fixing one means deleting its entry; the list cannot quietly grow, and it cannot
  // quietly keep an entry that has stopped being true.
  const over = Object.entries(spentBy).filter(([, s]) => s.populated > baseline.budget).map(([name]) => name).sort()
  assert.deepEqual(over, Object.keys(baseline.over).sort(), 'the doors over the subrequest budget are not the ones the baseline admits to')
  for (const name of over) assert.ok((baseline.over[name] ?? '').length > 0, `${name} is over budget with no reason recorded`)
})
