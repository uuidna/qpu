import assert from 'node:assert/strict'
import test from 'node:test'

import { DEPLOY_TENANTS, FOLDERS, OFFICIAL_PACKAGES, OFFICIAL_PLUGINS, plugins } from './plugin.ts'

test('each quantum folder is one payload plugin', async () => {
  assert.deepEqual(plugins.map((plugin) => plugin.folder), [...FOLDERS])
  assert.equal(OFFICIAL_PLUGINS.length, 9)
  assert.deepEqual([...DEPLOY_TENANTS], ['uuidna', 'psg', 'ceci'])
  for (const plugin of plugins) {
    assert.equal(plugin.index, `src/quantum/${plugin.folder}/index.ts`)
    assert.equal(plugin.plugins.length, 9)
    assert.deepEqual(plugin.packages, OFFICIAL_PACKAGES)
    assert.equal(plugin.variants.length, 9)
    assert.equal(plugin.deploy.length, 27)
    assert.deepEqual(plugin.variants.map((variant) => variant.variant), [...OFFICIAL_PLUGINS])
    let ran = false
    const incoming = { collections: ['pages'], globals: ['footer'], plugins: ['seo'], hooks: {}, onInit: () => { ran = true } }
    assert.equal(plugin({ enabled: false })(incoming), incoming)
    const next = plugin({ enabled: true })(incoming)
    await next.onInit?.({})
    assert.equal(ran, true)
    assert.deepEqual(next.collections, ['pages'])
    assert.deepEqual(next.globals, ['footer'])
    assert.deepEqual(next.plugins, ['seo'])
    assert.equal(next.collections?.includes('added'), false)
    const sample = plugin.deploy[0]!
    assert.deepEqual(sample.find, {
      collection: 'pages',
      where: { and: [{ tenant: { equals: 'uuidna' } }, { variant: { equals: 'lexical' } }] },
      limit: 1,
      depth: 0,
      pagination: false,
    })
  }
})
