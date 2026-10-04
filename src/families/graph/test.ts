import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { GraphFormulas } from './index.js'
import '../../mcp/families.js'

test('graph: maxedges, density, degreesum, components, treeedges, bipartiteedges, cyclomaticnumber, averagedegree — crossing to graphtheory', async (t) => {
  assert.equal(GraphFormulas.maxedges(10).value, 45, 'a complete graph on ten nodes')
  assert.equal(GraphFormulas.density(9, 10).value, 20)
  assert.equal(GraphFormulas.degreesum(15).value, 30, 'the handshake lemma')
  assert.equal(GraphFormulas.components(10, 7).value, 3, 'a forest\'s components')
  assert.equal(GraphFormulas.treeedges(10).value, 9)
  assert.equal(GraphFormulas.bipartiteedges(3, 4).value, 12)
  assert.equal(GraphFormulas.cyclomaticnumber(15, 10, 1).value, 6, 'independent cycles')
  assert.equal(GraphFormulas.averagedegree(15, 10).value, 3)
  assert.equal(GraphFormulas.maxedges(10).dst, 'graphtheory')
  assert.equal(qpuHexFamiliesOf().get('graph')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'graph', program: ['maxedges'], params: [10] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 45, `graph.maxedges at ${uuid}`)
  qpuUuidReceiptOf('graph maxedges', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; maxedges 45, density 20, degreesum 30, components 3, treeedges 9, bipartiteedges 12, cyclomaticnumber 6, averagedegree 3; crossing to graphtheory')
})
