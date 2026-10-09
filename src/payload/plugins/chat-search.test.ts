import { test } from 'node:test'
import assert from 'node:assert/strict'
import { chatSearchOf, distroOf, distroPathOf, CHAT_SEARCH_FRAMEWORKS } from './chat-search.js'
import { MerkabaFormulas } from '../../families/merkaba/index.js'
import { CombinatoricsFormulas } from '../../families/combinatorics/index.js'
import { qpuFacesOf } from '../../quantum/processing/unit/index.js'

test('distro path: idea→chat→search→blueprint→docs→app→cure', () => {
  const path = distroPathOf('precision search')
  assert.equal(path.kind, 'distro-path')
  assert.deepEqual(
    path.stages.map((s) => s.stage),
    ['idea', 'chat', 'search', 'blueprint', 'docs', 'app', 'cure'],
  )
  assert.ok(path.frameworks.length >= 8)
  assert.equal(path.cure.family, 'contract')
  assert.equal(path.cure.formula, 'cure')
})

test('chat+search seals token usage; frameworks named', async () => {
  const r = await chatSearchOf({ about: 'search precision 8 10', chat: true, search: true })
  assert.equal(r.kind, 'chat-search')
  assert.equal((r.tokenSeal as { sealed?: boolean }).sealed, true)
  assert.ok(Array.isArray(r.usage))
  assert.ok((r.frameworks as { all: string[] }).all.every((f) => (CHAT_SEARCH_FRAMEWORKS as readonly string[]).includes(f)))
  assert.equal(r.goal, 'OPEN')
})

test('combinatorial distro: double-torus/rosetta manifold + outside-in/inside-out', async () => {
  const faces = qpuFacesOf().faces
  const torus = await MerkabaFormulas.torus(0, 1, 2)
  const rosetta = MerkabaFormulas.rosetta(Math.min(faces, 7))
  const bin = CombinatoricsFormulas.binomial(faces)
  const comb = CombinatoricsFormulas.combinations(faces, 2)

  const d = await distroOf({ passes: 2, k: 2 })
  assert.equal(d.kind, 'distro')
  assert.equal(d.call, 'tools/call connector { distro: true }')
  assert.equal(d.goal, 'OPEN')
  assert.equal((d.tokenSeal as { sealed?: boolean }).sealed, true)

  const manifold = d.manifold as {
    kind: string
    torus: { holds: boolean; formula: string }
    rosetta: { formula: string }
    coil: { formula: string }
  }
  assert.equal(manifold.kind, 'double-torus-rosetta')
  assert.equal(manifold.torus.formula, 'merkaba.torus')
  assert.equal(manifold.rosetta.formula, 'merkaba.rosetta')
  assert.equal(manifold.coil.formula, 'merkaba.coil')
  // evidence from the tree formulas themselves (not invented)
  assert.equal(typeof torus.holds, 'boolean')
  assert.equal(typeof rosetta.value, 'number')
  assert.equal(typeof bin.value, 'number')
  assert.equal(typeof comb.value, 'number')

  const cover = d.cover as { holds: boolean; possibilitySpace: number; passes: { width: number }[] }
  assert.ok(cover.possibilitySpace > 0)
  assert.equal(cover.passes.length, 2)
  assert.equal(cover.passes[1]!.width, cover.passes[0]!.width * 2)

  const maps = d.maps as { insideOut: string[]; outsideIn: string[] }
  assert.ok(maps.insideOut.includes('merkaba.torus'))
  assert.ok(maps.outsideIn.includes('harness→url'))

  const counts = d.counts as { inside: number; outside: number; healthy: number }
  assert.ok(counts.inside >= 4)
  assert.ok(counts.outside >= 2)
  assert.ok(counts.healthy >= 1)
})
