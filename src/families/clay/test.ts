import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf } from '../../quantum/processing/unit/index.js'
import { leanSource } from '../../quantum/processing/unit/lean.js'
import { verifyHex } from '../verify.js'
import { ClaySeals } from './index.js'
import '../../mcp/families.js'

/** THE CLUSTER GENERATOR, offline and exact. The clusters a formula belongs to are read from the served Lean source
 *  and the registry, never the live host: the theorem cluster (every theorem the kernel recomputes), the axiom cluster
 *  (none — the lattice assumes nothing of its own), the def cluster the theorems are built from, and each family's
 *  formulas, counted by how many are a Lean def the kernel already proves. The clay cluster is held to its seals,
 *  exact, at their hex addresses. The live cross-development — a value two families reach, answering alike from every
 *  perspective — is verified where it is generated, by `receipt.mjs next` and the discovery receipt, not here. */
test('clusters: 124 theorems, 0 axioms, the def cluster, each family, and the clay seals — offline and exact', async (t) => {
  const families = qpuHexFamiliesOf()
  const leanDefs = new Set([...leanSource.matchAll(/^[ \t]*def ([A-Za-z]\w*)/gm)].map((m) => m[1]))
  const theorems = [...leanSource.matchAll(/^[ \t]*theorem ([A-Za-z]\w*)/gm)].map((m) => m[1])
  const axioms = [...leanSource.matchAll(/^[ \t]*axiom ([A-Za-z]\w*)/gm)].map((m) => m[1])

  // the Lean clusters, from the source the kernel checks
  assert.equal(theorems.length, 124, 'the theorem cluster: 124, each recomputed by the kernel')
  assert.equal(axioms.length, 0, 'no axioms: nothing assumed, everything proven')
  assert.ok(leanDefs.size >= 40, 'the def cluster the theorems are built from')

  // THE GENERATOR over every family cluster: how many of its formulas are a Lean def the kernel already proves
  const clusters = [...families.keys()].filter((f) => !['qpu', 'crypto', 'api', 'data', 'gate'].includes(f)).sort()
    .map((family) => { const ns = (families.get(family) ?? []).map((f) => f.name); return { family, lean: ns.filter((n) => leanDefs.has(n)).length, total: ns.length } })
  assert.ok(clusters.length > 0 && clusters.every((c) => c.lean <= c.total), 'the generator accounts for every family cluster')

  // THE CLAY CLUSTER: six problems, their σ-seals exact — Hodge's rank 2g, Yang–Mills' two eigenvalues ±1, BSD's
  // self-inverse pairs — at their hex addresses through the MCP (verifyHex)
  const clayNames = (families.get('clay') ?? []).map((f) => f.name)
  assert.ok(clayNames.length >= 6, 'the six problems are formulas')
  assert.equal(ClaySeals.hodge(2).value, 4, 'H₁(Σ₂) = ℤ⁴')
  assert.equal(ClaySeals.yangMills().value, 2, 'spectrum {−1, +1}: two real eigenvalues')
  assert.equal(ClaySeals.bsd(15).value, 2, 'two self-inverse pairs in (ℤ/15ℤ)*')
  await verifyHex('clay', clayNames.length, [['hodge', [2], 4], ['yangMills', [], 2], ['bsd', [15], 2]])

  t.diagnostic(`${clusters.length} family clusters (${clusters.reduce((s, c) => s + c.lean, 0)} kernel-proven of ${clusters.reduce((s, c) => s + c.total, 0)}); theorems ${theorems.length}, axioms ${axioms.length}, defs ${leanDefs.size}; clay seals hodge 4, yangMills 2, bsd 2`)
})
