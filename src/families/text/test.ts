import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { TextFormulas } from './index.js'
import '../../mcp/families.js'

test('text: tokens, readability, similarity, density, sentiment, ttr, summary, cost — crossing to ml', async (t) => {
  assert.equal(TextFormulas.tokens(4000, 4).value, 1000)
  assert.equal(TextFormulas.readability(300, 15).value, 20, 'average sentence length')
  assert.equal(TextFormulas.similarity(30, 120).value, 25)
  assert.equal(TextFormulas.density(8, 400).value, 2)
  assert.equal(TextFormulas.sentiment(70, 30).value, 40)
  assert.equal(TextFormulas.sentiment(30, 70).value, -40, 'net sentiment can be negative')
  assert.equal(TextFormulas.ttr(400, 1000).value, 40)
  assert.equal(TextFormulas.summary(1000, 150).value, 15, '15% compression')
  assert.equal(TextFormulas.cost(50000, 2).value, 100, 'two per thousand tokens')
  assert.equal(TextFormulas.tokens(4000, 4).dst, 'ml')
  assert.equal(qpuHexFamiliesOf().get('text')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'text', program: ['tokens'], params: [4000, 4] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 1000, `text.tokens at ${uuid}`)
  qpuUuidReceiptOf('text tokens', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; tokens 1000, readability 20, similarity 25, density 2, sentiment 40/-40, ttr 40, summary 15, cost 100; crossing to ml')
})
