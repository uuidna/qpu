// Ecommerce @payloadcms/plugin-seo as MCP conformance tests: whatever SEO attaches to IS the toolbox (ISO/IEC/IEEE 29119-3).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  attachSeoToolbox,
  ecommerceSeoMcp,
  ecommerceSeoToolboxes,
  seoMetaFor,
} from './index.ts'
import { EXAMPLES } from '../9/d/4/f/e/4/4/2/index.ts'
import { call } from '../3/8/5/9/0/2/0/f/index.ts'
import { seal } from '../2/7/1/a/7/6/4/9/index.ts'
import { isSdkRequest, serveSdk } from '../sdk/index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: seoMetaFor produces greatest-seam sealed image UUID, 100/100 score, OpenGraph and Product Offer JSON-LD. */
test('seoMetaFor produces greatest-seam sealed image UUID, 100/100 score, OpenGraph and Product Offer JSON-LD', () => {
  const peer = '016da774-e74c-2e44-8742-f8bcf5e8e8f5'
  const meta = seoMetaFor({
    id: '941ef62e-d97b-2438-bfc8-22ae9e5da781',
    title: 'Advantage.advantage_unbounded',
    description: 'Quantum space unbounded theorem witnessed by Lean 4.33.0',
    path: '/catalog/941ef62e-d97b-2438-bfc8-22ae9e5da781',
    schemaType: 'Product',
  }, [peer])
  assert.equal(meta.score, 100)
  assert.equal(meta.checks.titleLength, true)
  assert.equal(meta.checks.descriptionLength, true)
  assert.equal(meta.checks.greatestSeam, true)
  assert.equal(meta.checks.imageSealed, true)
  assert.equal(seal(meta.image).valid, true)
  assert.equal(meta.optimised.theorem, 'textbook_hue_shift')
  assert.equal(meta.og.type, 'product')
  assert.equal((meta.jsonLd.offers as { price: string }).price, '0')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: Whatever SEO is attached to becomes its MCP toolbox with 4 scoped tools and sealed audit receipt. */
test('Whatever SEO is attached to becomes its MCP toolbox with 4 scoped tools and sealed audit receipt', () => {
  const attached = attachSeoToolbox({
    target: 'quantum-articles',
    source: 'custom',
    items: [
      { id: 'article-1', title: 'ISO/IEC 4879 Vocabulary', description: 'Normative quantum vocabulary mapped to Lean 4 kernel theorems.', path: '/vocabulary/' },
      { id: 'article-2', title: '1000-bit Cyclotomic Factoring', description: 'Exact cyclotomic factorisation of 2^999 + 1 in 63 16-bit limbs.', path: '/clay/' },
    ],
  })
  assert.equal(attached.phase, 'seo-toolbox')
  assert.equal(attached.plugin, '@payloadcms/plugin-seo')
  assert.equal(attached.toolbox, 'quantum-articles')
  assert.equal(attached.attachedTo, 'quantum-articles')
  assert.equal(attached.sealed, true)
  assert.equal(attached.tools.length, 4)
  assert.equal(attached.tools.every((t) => t.toolbox === 'quantum-articles' && t.attachedTo === 'quantum-articles'), true)
  assert.equal(attached.audit.fullCoverage, true)
  assert.equal(attached.audit.averageScore, 100)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: Ecommerce collections attach @payloadcms/plugin-seo as MCP toolboxes over both /api/mcp and Payload globals. */
test('Ecommerce collections attach @payloadcms/plugin-seo as MCP toolboxes over both /api/mcp and Payload globals', async () => {
  const all = ecommerceSeoToolboxes(EXAMPLES)
  assert.equal(all.phase, 'ecommerce-seo-mcp')
  assert.equal(all.attachedEqualsToolbox, true)
  assert.equal(all.fullCoverage, true)
  assert.equal(all.averageScore, 100)
  assert.equal(all.sealed, true)
  assert.ok(all.toolboxNames.includes('products'))
  assert.ok(all.toolboxNames.includes('variants'))
  assert.ok(all.toolboxNames.includes('variantTypes'))
  assert.ok(all.toolboxNames.includes('variantOptions'))
  for (const tb of all.toolboxes) {
    assert.equal(tb.toolbox, tb.attachedTo)
    assert.equal(tb.tools.every((t) => t.toolbox === tb.toolbox), true)
  }

  // Live MCP kernel: imagine { catalog: { seo } }
  const viaMcp = call('imagine', { catalog: { seo: true } }).result!.structuredContent as typeof all
  assert.equal(viaMcp.address, all.address)
  const productsAudit = call('imagine', { catalog: { seo: { target: 'products', tool: 'seo_products_audit' } } }).result!.structuredContent as { phase: string; toolbox: string; audit: { fullCoverage: boolean } }
  assert.equal(productsAudit.phase, 'seo-audit')
  assert.equal(productsAudit.toolbox, 'products')
  assert.equal(productsAudit.audit.fullCoverage, true)

  const dynamicViaMcp = call('imagine', {
    catalog: {
      seo: {
        attach: {
          target: 'custom-catalog',
          items: [{ id: 'c1', title: 'Custom QPU Item', description: 'Custom attached item converted into its own MCP toolbox.', path: '/custom/c1' }],
        },
      },
    },
  }).result!.structuredContent as { toolbox: string; attachedTo: string; sealed: boolean }
  assert.equal(dynamicViaMcp.toolbox, 'custom-catalog')
  assert.equal(dynamicViaMcp.attachedTo, 'custom-catalog')
  assert.equal(dynamicViaMcp.sealed, true)

  // Standard Payload globals REST interface
  const catalogSeoReq = new Request('https://qpu.uuidna.com/api/globals/catalog?view=seo')
  assert.equal(isSdkRequest(catalogSeoReq), true)
  const catalogSeoRes = await serveSdk(catalogSeoReq)
  assert.equal(catalogSeoRes.status, 200)
  const catalogSeo = await catalogSeoRes.json() as typeof all
  assert.equal(catalogSeo.address, all.address)

  const toolsRes = await serveSdk(new Request('https://qpu.uuidna.com/api/globals/mcp-tools?view=seo&target=products'))
  assert.equal(toolsRes.status, 200)
  const toolsJson = await toolsRes.json() as { phase: string; totalDocs: number; docs: { toolbox: string }[] }
  assert.equal(toolsJson.phase, 'seo-mcp-tools')
  assert.equal(toolsJson.docs.length, 4)
  assert.equal(toolsJson.docs.every((d) => d.toolbox === 'products'), true)

  const postRes = await serveSdk(new Request('https://qpu.uuidna.com/api/globals/catalog', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      attach: {
        target: 'qpu-storefront',
        items: [{ id: 's1', title: 'QPU Storefront Licence', description: 'Storefront page attached to @payloadcms/plugin-seo MCP.', path: '/studio' }],
      },
    }),
  }))
  assert.equal(postRes.status, 200)
  const attachedPost = await postRes.json() as { toolbox: string; attachedTo: string; sealed: boolean }
  assert.equal(attachedPost.toolbox, 'qpu-storefront')
  assert.equal(attachedPost.attachedTo, 'qpu-storefront')
  assert.equal(attachedPost.sealed, true)
  assert.equal(ecommerceSeoMcp({ target: 'products' }, EXAMPLES).phase, 'seo-toolbox')
})
