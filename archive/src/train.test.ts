import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HANDLE_HEXBITS, QPU_HOST, QPU_POINTS, VE_FACES, qpuVersionIntegerOf } from './hologram.js'
import { QPU_VERSION } from './version.js'
import { QPU_LICENCE_APEX } from './licence.js'
import {
  QPU_TRAIN_APIS,
  QPU_TRAIN_CENSUS,
  QPU_TRAIN_LESSONS,
  QPU_TRAIN_WORKER_FIRST,
  qpuTrainHolds,
  qpuTrainOf,
} from './train.js'
import { handleQpuFetch } from './edge.js'
import { qpuMcpCall } from './mcp-catalog.js'

test('qpuTrainHolds proves fourteen occupancy lessons fused under the law, never a crawl', () => {
  const t = qpuTrainOf()
  assert.equal(t.kind, 'train')
  assert.equal(t.when, 'never')
  assert.equal(t.seat, 'empty')
  assert.equal(t.crawl, false)
  assert.equal(t.fetches, 0)
  assert.equal(t.corpus, 'occupancy')
  assert.equal(t.training, 'professional')
  assert.equal(t.record, 'may')
  assert.equal(t.video.container, 'webm')
  assert.equal(t.video.chapters, true)
  assert.equal(t.video.role, 'train')
  assert.equal(t.messenger, 'uuid')
  assert.equal(t.lessons.length, VE_FACES)
  assert.equal(QPU_TRAIN_LESSONS.length, VE_FACES)
  const packed = qpuVersionIntegerOf(QPU_VERSION)
  assert.equal(t.sequence, packed.sequence)
  const titles = new Set<string>()
  for (let i = 0; i < VE_FACES; i++) {
    const row = t.lessons[i]!
    assert.equal(row.face, i)
    assert.equal(row.title, QPU_TRAIN_LESSONS[i]!.title)
    assert.equal(row.path, QPU_TRAIN_LESSONS[i]!.path)
    assert.equal(row.constructor, QPU_TRAIN_LESSONS[i]!.constructor)
    assert.equal(row.record, 'may')
    assert.ok(row.path.startsWith('/'))
    assert.equal(row.path.includes('*'), false)
    assert.ok(row.claim.length > 0)
    assert.equal(titles.has(row.title), false, row.title)
    titles.add(row.title)
  }
  assert.equal(titles.size, VE_FACES)
  assert.equal(new Set(t.lessons.map((l) => l.path)).size, VE_FACES)
  assert.equal(qpuTrainHolds(t), true)
})

test('public keyless APIs are uuidna.com hosts; they hold occupancy without keys', () => {
  const t = qpuTrainOf()
  assert.equal(t.law.keys, false)
  assert.equal(t.law.completions, false)
  assert.equal(t.law.quotes, false)
  assert.equal(t.law.crawl, false)
  assert.equal(t.law.secrets, false)
  assert.equal(t.law.wildcards, false)
  assert.equal(t.law.hosts, QPU_LICENCE_APEX)
  assert.equal(t.apis.length, QPU_POINTS.length)
  assert.equal(QPU_TRAIN_APIS.length, QPU_POINTS.length)
  for (let i = 0; i < t.apis.length; i++) {
    const row = t.apis[i]!
    const want = QPU_TRAIN_APIS[i]!
    const u = new URL(row.href)
    assert.equal(row.host, want.host)
    assert.equal(row.key, false)
    assert.equal(row.uuidna, 'hold')
    assert.equal(row.fetches, 0)
    assert.equal(row.crawl, false)
    assert.equal(u.protocol, 'https:')
    assert.equal(u.hostname, want.host)
    assert.equal(u.hostname.includes('*'), false)
    assert.ok(u.hostname === QPU_LICENCE_APEX || u.hostname.endsWith(`.${QPU_LICENCE_APEX}`))
  }
})

test('hardware occupancy never claims the chip; trading constructors never quote exchanges', () => {
  const t = qpuTrainOf()
  assert.equal(t.relations.length, QPU_POINTS.length)
  for (let i = 0; i < t.relations.length; i++) {
    const row = t.relations[i]!
    assert.equal(row.point, QPU_POINTS[i])
    assert.equal(row.hardware.claimed, false)
    assert.equal(row.hardware.binds, false)
    assert.equal(row.hardware.kind, 'qpu')
    assert.equal(row.trading.quotes, false)
    assert.equal(row.trading.crawl, false)
    assert.equal(row.trading.fetches, 0)
    assert.ok(row.trading.count > 0)
    assert.equal(row.merge, true)
    const lead = new URL(row.lead.href)
    assert.equal(lead.protocol, 'https:')
    assert.equal(lead.hostname, 'uuidna.com')
    assert.equal(lead.pathname, `/theorem/${row.lead.slug}`)
  }
})

test('strategies fuse lessons, hardware, constructor APIs, billing skip, and sealed leads', () => {
  const t = qpuTrainOf()
  assert.equal(t.strategies.length, VE_FACES)
  assert.equal(t.leads.length, HANDLE_HEXBITS)
  assert.equal(QPU_TRAIN_CENSUS.length, HANDLE_HEXBITS)
  assert.deepEqual(t.billing.runWorkerFirst, [...QPU_TRAIN_WORKER_FIRST])
  assert.equal(t.billing.ai, false)
  assert.equal(t.billing.kv, false)
  assert.equal(t.billing.d1, false)
  assert.equal(t.billing.r2, false)
  assert.equal(t.billing.durable, false)
  assert.equal(t.billing.assets.invoke, false)
  for (const row of t.strategies) {
    assert.equal(row.hardware.claimed, false)
    assert.equal(row.hardware.seat, 'empty')
    assert.equal(row.trading.quotes, false)
    assert.equal(row.ai.key, false)
    assert.equal(row.ai.uuidna, 'hold')
    assert.equal(row.billing.invoke, false)
    const lead = new URL(row.lead.href)
    assert.equal(lead.hostname, 'uuidna.com')
    assert.ok(lead.pathname.startsWith('/theorem/'))
  }
  for (let i = 0; i < t.leads.length; i++) {
    assert.equal(t.leads[i]!.slug, QPU_TRAIN_CENSUS[i])
    assert.equal(t.census[i]!.slug, QPU_TRAIN_CENSUS[i])
  }
})

test('GET /train and MCP qpu_train are the occupancy corpus', async () => {
  const res = await handleQpuFetch(new Request(`https://${QPU_HOST}/train`))
  assert.equal(res.status, 200)
  const body = await res.json() as {
    kind: string
    holds: boolean
    lessons: unknown[]
    apis: { key: boolean }[]
    law: { completions: boolean; quotes: boolean }
  }
  assert.equal(body.kind, 'train')
  assert.equal(body.holds, true)
  assert.equal(body.lessons.length, VE_FACES)
  assert.equal(body.law.completions, false)
  assert.equal(body.law.quotes, false)
  assert.ok(body.apis.every((a) => a.key === false))
  const mcp = await qpuMcpCall('qpu_train', {}) as { holds: boolean; crawl: boolean; training: string; record: string; fetches: number }
  assert.equal(mcp.holds, true)
  assert.equal(mcp.crawl, false)
  assert.equal(mcp.training, 'professional')
  assert.equal(mcp.record, 'may')
  assert.equal(mcp.fetches, 0)
})
