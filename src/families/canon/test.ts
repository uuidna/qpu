import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { CanonFormulas } from './index.js'
import '../../mcp/families.js'

test('canon: bookcount, readingorders, chapterpairs, versesum, sectiongroupings, booktriples, sequencechoices, chaptertotal — crossing to statistics', async (t) => {
  assert.equal(CanonFormulas.bookcount(39, 27).value, 66)
  assert.equal(CanonFormulas.readingorders(6).value, 720)
  assert.equal(CanonFormulas.chapterpairs(50, 2).value, 1225)
  assert.equal(CanonFormulas.versesum(31, 10).value, 310)
  assert.equal(CanonFormulas.sectiongroupings(10).value, 1024)
  assert.equal(CanonFormulas.booktriples(12, 3).value, 220)
  assert.equal(CanonFormulas.sequencechoices(10, 3).value, 720)
  assert.equal(CanonFormulas.chaptertotal(929, 260).value, 1189)
  assert.equal(CanonFormulas.bookcount(39, 27).dst, 'statistics')
  assert.equal(qpuHexFamiliesOf().get('canon')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'canon', program: ['bookcount'], params: [39, 27] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 66, `canon.bookcount at ${uuid}`)
  qpuUuidReceiptOf('canon bookcount', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; bookcount 66, readingorders 720, chapterpairs 1225, versesum 310, sectiongroupings 1024, booktriples 220, sequencechoices 720, chaptertotal 1189; crossing to statistics')
})
