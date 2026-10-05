/**
 * NEXT ORGANISES BY DOMAIN AND DISCOVERS ALL AROUND. The intelligent step: as the families seal their formulas they record
 * a family → domain bridge, and next reads those bridges to let the families organise into domains and discover the
 * neighbourhood around each — no hand list, the graph organises itself. This exercises a cluster and holds that they fall
 * into their domain and find each other. Discovered by the scripts/*.test.mjs glob, run by the one gate.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

test('next: families organise by domain and discover the neighbourhood around', async () => {
  await import('../dist/mcp/families.js')
  const { qpuHexFamiliesOf, qpuHexUuidOf, qpuHexRunOf } = await import('../dist/quantum/processing/unit/index.js')
  const { qpuCrossBridgesOf } = await import('../dist/families/cross/index.js')
  // seal one formula from a cluster so their domain bridges record (the graph fills as families are exercised)
  const cluster = ['law', 'court', 'compliance', 'contract', 'evidence', 'licensing', 'patent', 'compensation', 'creditscore', 'coil']
  for (const f of cluster) {
    const formulas = qpuHexFamiliesOf().get(f)
    if (!formulas?.length) continue
    await qpuHexRunOf(qpuHexUuidOf({ family: f, program: [formulas[0].name], params: [] }), undefined, undefined, { store: false })
  }
  const bridges = qpuCrossBridgesOf()
  assert.ok(bridges.size >= 10, `families recorded their domain (${bridges.size} bridges)`)
  // organise by domain
  const byDomain = new Map()
  for (const [fam, dom] of bridges) (byDomain.get(dom) ?? byDomain.set(dom, []).get(dom)).push(fam)
  // the legal cluster organises into the law domain and discovers each other around it
  const law = (byDomain.get('law') ?? []).sort()
  for (const f of ['compliance', 'contract', 'evidence', 'licensing', 'patent']) assert.ok(law.includes(f), `${f} organises into the law domain (around: ${law.filter((x) => x !== f).join(', ')})`)
})
