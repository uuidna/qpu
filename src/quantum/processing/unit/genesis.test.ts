import { test } from 'node:test'
import assert from 'node:assert/strict'
import { qpuCssHolds, qpuCssOf, qpuGenesisHolds, qpuGenesisOf, qpuTrainOf } from './index.js'

test('shadcn schema combinatorial genesis covers all known frameworks', () => {
  const genesis = qpuGenesisOf()
  const css = qpuCssOf()
  assert.equal(qpuGenesisHolds(genesis), true)
  assert.equal(qpuCssHolds(css), true)
  assert.equal(genesis.framework, 'shadcn')
  assert.equal(genesis.scope, 'all')
  assert.equal(genesis.hz, 432)
  assert.equal(genesis.product, 432)
  assert.equal(genesis.schema.keys.join(' '), 'slot variant size state element theme')
  assert.equal(genesis.schema.keys.length, 6)
  assert.equal(genesis.card.length, 7)
  assert.equal(genesis.card[4], 'card-action')
  assert.equal(genesis.variants.length, 6)
  assert.equal(genesis.sizes.length, 8)
  assert.equal(genesis.alpine.length, 10)
  assert.equal(genesis.frameworks.length, 14)
  assert.equal(genesis.occupied, 14)
  assert.equal(genesis.vacant, 0)
  assert.equal(genesis.known, 14)
  assert.equal(
    genesis.frameworks.join(' '),
    'shadcn radix react vue svelte alpine vitepress payload tailwind cva panda vanilla-extract html qpu',
  )
  assert.equal(
    genesis.nodes.every((node) => node.schema === 'shadcn' && node.involution && node.holds && node.hop === node.face),
    true,
  )
  assert.equal(genesis.domains.join(' '), 'scanner radar')
  assert.equal(genesis.domains.length, 2)
  assert.equal(
    genesis.nodes.every((node) => node.face === node.team * 7 + node.ray && node.domain === genesis.domains[node.team]),
    true,
  )
  assert.equal(genesis.nodes[0]?.domain, 'scanner')
  assert.equal(genesis.nodes[7]?.domain, 'radar')
  assert.equal(genesis.nodes[4]?.slot, 'card-action')
  assert.equal(genesis.choose.n, 3)
  assert.equal(genesis.choose.rays, 21)
  assert.equal(
    genesis.frameworks.every((name) => css.css.includes(`data-framework=${name}`)),
    true,
  )
  assert.equal(css.hz, 432)
  assert.equal(css.keyframes, 1)
  assert.equal(css.css.includes('data-domain=scanner'), true)
  assert.equal(css.css.includes('data-domain=radar'), true)
  const train = qpuTrainOf()
  assert.equal(train.teams[1]!.agents[0]!.domain, 'scanner')
  assert.equal(train.teams[0]!.agents[0]!.domain, 'radar')
  assert.equal(
    train.challenges.every((c) => c.domain === (c.face < genesis.card.length ? 'scanner' : 'radar')),
    true,
  )
})
