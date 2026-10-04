import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { ApiFormulas } from './index.js'

/** The web interface's arithmetic — pagination, rate windows, backoff, status class, quota, payload, methods, offset. */
test('api: pages, window, backoff, statusClass, remaining, payload, methods, offset', async (t) => {
  assert.equal(ApiFormulas.pages(101, 20).value, 6, '101 rows, 20 a page')
  assert.equal(ApiFormulas.pages(100, 0).value, 0, 'no page size, no divide')
  assert.equal(ApiFormulas.window(600, 60).value, 10, '600 a minute is 10 a second')
  assert.equal(ApiFormulas.backoff(100, 4).value, 1600, '100ms doubled four times')
  assert.equal(ApiFormulas.statusClass(404).value, 4, '4xx')
  assert.equal(ApiFormulas.remaining(1000, 999).value, 1, 'quota left')
  assert.equal(ApiFormulas.remaining(1000, 2000).value, 0, 'overspent, floored')
  assert.equal(ApiFormulas.payload(12, 64).value, 768, '12 fields of 64 bytes')
  assert.equal(ApiFormulas.methods(4).value, 16, '2^4 method subsets')
  assert.equal(ApiFormulas.offset(5, 20).value, 100, 'page 5 at 20 a page')
  assert.equal(qpuHexFamiliesOf().get('api')?.length, 8)
  for (const [name, params, expected] of [['pages', [101, 20], 6], ['backoff', [100, 4], 1600], ['offset', [5, 20], 100]] as [string, number[], number][]) {
    const uuid = qpuHexUuidOf({ family: 'api', program: [name], params })
    const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
    assert.equal(Number(run.value), expected, `api.${name} at ${uuid}`)
    qpuUuidReceiptOf(`api ${name}`, qpuContentUuidOf(run), { uuid })
  }
  t.diagnostic('8 formulas; 101/20=6 pages, window 10/s, backoff 100·2^4=1600, 2^4 methods')
})
