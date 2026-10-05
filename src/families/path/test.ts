import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { CrossDomainPaths, pathHexOf } from './index.js'
import '../../mcp/families.js'

// path is the cross-domain path mechanism: each named path is a real chain of two or more hops across domains whose
// transform composes to a finite value. Its law (holds) is what makes a path a workflow and not a single step.
test('path: the seven named cross-domain paths each hold — a real chain (≥2 hops) with a finite value, carrying a receipt', async (t) => {
  const paths = CrossDomainPaths.allPaths()
  assert.equal(paths.length, 7, 'seven named multi-hop paths')
  for (const p of paths) {
    assert.ok(p.hops.length >= 2, `${p.hops.join('>')} is a real chain of two or more hops`)
    assert.ok(Number.isFinite(p.value ?? NaN), `${p.hops.join('>')} composes to a finite value`)
    assert.equal(p.holds, true, `${p.hops.join('>')} holds under the path law`)
    assert.ok(p.uuid && p.receipt, `${p.hops.join('>')} carries a content uuid and a receipt`)
  }
  // executePath walks the chain hop by hop, one transform per edge
  const chain = CrossDomainPaths.quantumSecurityChain()
  const walk = CrossDomainPaths.executePath(chain, {})
  assert.equal(walk.intermediate.length, chain.hops.length - 1, 'one intermediate per edge')
  assert.deepEqual(walk.path, chain.hops)
  // the family is the hex registry: every named path is a hex program that returns the path
  const fam = qpuHexFamiliesOf().get('path')
  assert.ok((fam?.length ?? 0) >= 7, 'at least the seven named paths are registered')
  const run = (await qpuHexRunOf(pathHexOf('qualityToRisk'))) as { holds?: boolean; handle?: string }
  assert.equal(run.holds, true, 'qualityToRisk holds when recomputed from its hex program')
  assert.ok(pathHexOf('qualityToRisk').startsWith(`${run.handle}-`), 'the run is the hex program path.qualityToRisk')
  qpuUuidReceiptOf('path qualityToRisk', qpuContentUuidOf(run), { uuid: pathHexOf('qualityToRisk') })
  t.diagnostic('7 named paths, each a real ≥2-hop chain with a finite value and a receipt; executePath walks one transform per edge; registered as the hex family path')
})
