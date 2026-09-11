import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker from './index.js'

const host = 'qpu.uuidna.com'
const env = { QPU_HOST: host }
const html = { accept: 'text/html' }
const origin = `https://${host}`

const fetchOf = (path: string, init: RequestInit = {}) =>
  worker.fetch(
    new Request(`${origin}${path}`, {
      ...init,
      headers: { ...html, ...(init.headers as Record<string, string> | undefined) },
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
