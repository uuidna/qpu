import { test } from './receipted.js'
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
  assert.equal(css.css.split('animation-delay').length, 2)
  assert.deepEqual(css.lattice.walk, [0, 7, 1, 8, 2, 9, 3, 10, 4, 11, 5, 12, 6, 13])
  assert.equal(css.css.includes('--walk:7}'), true)
  assert.equal(css.css.includes('linear'), false)
  assert.equal(css.experiments.length, 28)
  assert.equal(
    css.experiments.filter((row) => {
      const hep = row as { domain?: string }
      return hep.domain === 'scanner' || hep.domain === 'radar'
    }).every((row) => {
      const hep = row as { domain?: string; hop?: number; product?: boolean; face: number; quantum?: boolean }
      return hep.quantum === true && (hep.domain === 'scanner' || hep.domain === 'radar') && hep.hop === (hep.face + 7) % 14 && hep.product === false
    }),
    true,
  )
  const train = qpuTrainOf()
  assert.equal(train.teams[1]!.agents[0]!.domain, 'scanner')
  assert.equal(train.teams[0]!.agents[0]!.domain, 'radar')
  assert.equal(
    train.challenges.every((c) => c.domain === (c.face < genesis.card.length ? 'scanner' : 'radar')),
    true,
  )
})

test('the sheet expresses every key genesis declares, and a browser can link to it', async () => {
  const genesis = qpuGenesisOf()
  const css = qpuCssOf()

  // FIVE OF SIX KEYS WERE A NUMBER AND NOT A RULE. genesis computed variants * sizes * (n * n) = 432 = hz and
  // emitted only `slot`, so the product was stated by the unit and applicable by nobody. Asked per member: a key
  // that emitted its first member and dropped the rest passes any check that only asks whether the key appears.
  for (const name of genesis.variants) assert.ok(css.css.includes(`[data-variant=${name}]`), `variant ${name}`)
  for (const name of genesis.sizes) assert.ok(css.css.includes(`[data-size=${name}]`), `size ${name}`)
  for (const name of genesis.state) assert.ok(css.css.includes(`[data-state=${name}]`), `state ${name}`)
  for (const name of genesis.element) assert.ok(css.css.includes(`[data-element=${name}]`), `element ${name}`)
  for (const name of genesis.theme) assert.ok(css.css.includes(`[data-theme=${name}]`), `theme ${name}`)

  // SEATED BY INDEX, so the sheet grows by addition where naming every combination would grow by multiplication.
  assert.ok(css.css.includes('[data-variant=default]{--qpu-v:0}'))
  assert.ok(css.css.includes(`[data-variant=link]{--qpu-v:${genesis.variants.length - 1}}`))

  // CSS EXFILTRATES WITHOUT JAVASCRIPT — the discipline @uuidna/school states and keeps. This sheet is served
  // publicly under CORS *, so it must initiate no request of any kind, and every attribute value it emits must
  // be one genesis declares: a value from anywhere else is the thing that would carry a URL.
  assert.equal(/url\(|@import|image-set|element\(/.test(css.css), false)
  const declared = new Set<string>([
    ...genesis.card, ...genesis.variants, ...genesis.sizes,
    ...genesis.state, ...genesis.element, ...genesis.theme,
    ...genesis.frameworks, ...genesis.domains,
  ])
  for (const [, value] of css.css.matchAll(/\[data-(?:slot|variant|size|state|element|theme|framework|domain)=([^\]]+)\]/g)) {
    assert.ok(declared.has(value), `${value} is emitted into the sheet and genesis declares no such member`)
  }

  // AND IT IS REACHABLE. Computed and served as a JSON string inside GET / is a stylesheet no page can link to.
  const host = 'qpu.uuidna.com'
  const { default: worker } = await import('./index.js')
  const response = await worker.fetch(new Request(`https://${host}/qpu.css`), { QPU_HOST: host })
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('content-type'), 'text/css; charset=utf-8')
  assert.equal(response.headers.get('access-control-allow-origin'), '*')
  const served = await response.text()
  assert.equal(served, css.css)
  // No HTML is served here; the fourteen frameworks supply the DOM. Asked for markup rather than for '<', which
  // this sheet legitimately contains: @property declares its types as <length>, <angle> and <number>.
  assert.ok(served.startsWith('@layer qpu{'))
  assert.equal(/<\/|<!/.test(served), false)
})
