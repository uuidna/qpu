// Harmonized Payload + VitePress + Cloudflare SDK conformance tests: Lean-generated schemas, live computations, theorem entanglements and Worker routing.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  CATALOG_COLLECTIONS,
  CATALOG_VARIANT_TYPES,
  SDK_API_PREFIX,
  SDK_COLLECTIONS,
  SDK_GLOBALS,
  WORKER_ROUTES,
  createQpuSdk,
  isSdkRequest,
  sdkCollection,
  sdkCompute,
  sdkFindById,
  sdkInteract,
  sdkMcpTools,
  sdkProductRoutes,
  sdkSummary,
  serveSdk,
} from './index.ts'
import { isMcp, serveMcp } from '../7/6/a/e/5/0/3/9/index.ts'
import { quantumOs, quantumPivot } from '../e/7/a/6/d/5/2/2/index.ts'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { THEOREMS } from '../3/f/0/e/7/a/6/f/index.ts'
import { ISO_CLAUSES, ISO_STANDARDS } from '../b/4/2/5/4/0/d/7/index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: Lean generates the SDK collections, variant types and Cloudflare Worker routes as one consistent contract. */
test('Lean generates the SDK collections, variant types and Cloudflare Worker routes as one consistent contract', () => {
  assert.deepEqual([...CATALOG_COLLECTIONS], ['variantTypes', 'variantOptions', 'products', 'variants'])
  assert.deepEqual([...CATALOG_VARIANT_TYPES], ['example', 'witness', 'entanglement', 'duality'])
  assert.deepEqual([...SDK_COLLECTIONS], ['variantTypes', 'variantOptions', 'products', 'variants', 'computations', 'standards', 'clauses'])
  assert.deepEqual([...SDK_GLOBALS], ['catalog', 'payload-ui', 'pipeline', 'clay-duality', 'clay-1000bit', 'google', 'mcp-tools'])
  assert.deepEqual([...WORKER_ROUTES], ['/', '/mcp', '/api/*'])
  assert.equal(SDK_API_PREFIX, '/api')
  const summary = sdkSummary()
  assert.equal(summary.collections.products, THEOREMS.length)
  assert.equal(summary.collections.standards, ISO_STANDARDS.length)
  assert.equal(summary.collections.clauses, ISO_CLAUSES.length)
  assert.ok(summary.collections.computations > 0)
  assert.ok(summary.entanglements > 0)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: Cloudflare Worker SDK routing cleanly separates MCP, server-card static assets, Payload REST collections and VitePress pages. */
test('Cloudflare Worker SDK routing cleanly separates MCP, server-card static assets, Payload REST collections and VitePress pages', async () => {
  const req = (path: string, method = 'GET') => new Request(`https://qpu.uuidna.com${path}`, { method })
  // MCP routes stay on serveMcp, never hijacked by serveSdk
  assert.equal(isMcp(req('/api/mcp', 'POST')), true)
  assert.equal(isSdkRequest(req('/api/mcp', 'POST')), false)
  // Static MCP Server Card falls through to ASSETS
  assert.equal(isMcp(req('/api/mcp/server-card', 'GET')), false)
  assert.equal(isSdkRequest(req('/api/mcp/server-card', 'GET')), false)
  // Static VitePress pages fall through to ASSETS
  assert.equal(isSdkRequest(req('/', 'GET')), false)
  assert.equal(isSdkRequest(req('/catalog/', 'GET')), false)
  // Standard Payload package routes (collections and globals) route through serveSdk; bespoke manual routes are rejected
  for (const col of SDK_COLLECTIONS) assert.equal(isSdkRequest(req(`/api/${col}`)), true, col)
  for (const g of SDK_GLOBALS) {
    assert.equal(isSdkRequest(req(`/api/globals/${g}`)), true, g)
    assert.equal(isSdkRequest(req(`/api/globals/${g}`, 'POST')), true, g)
  }
  assert.equal(isSdkRequest(req('/api/computations', 'POST')), true)
  // Bespoke non-Payload routes are NOT routed by serveSdk
  for (const custom of ['/api/catalog', '/api/payload-ui', '/api/pipeline', '/api/pipeline/run', '/api/google/discovery', '/api/mcp-tools']) {
    assert.equal(isSdkRequest(req(custom)), false, custom)
  }
  assert.equal(isSdkRequest(req('/api/computations/entangle', 'POST')), false)
  assert.equal(isSdkRequest(req('/api/computations/metrics', 'POST')), false)
  // CORS preflight answers 204
  const preflight = await serveSdk(req('/api/computations', 'OPTIONS'))
  assert.equal(preflight.status, 204)
  assert.equal(preflight.headers.get('access-control-allow-origin'), '*')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: createQpuSdk serves standard Payload collections, globals, and MCP UI connector through serveSdk and serveMcp. */
test('createQpuSdk serves standard Payload collections, globals, and MCP UI connector through serveSdk and serveMcp', async () => {
  const fetcher: typeof fetch = (input, init) => {
    const req = new Request(input, init)
    if (!isMcp(req)) return serveSdk(req)
    const headers = new Headers(req.headers)
    if (!headers.has('host')) headers.set('host', new URL(req.url).host)
    return serveMcp(new Request(req, { headers }), {})
  }
  const client = createQpuSdk('https://qpu.uuidna.com', fetcher)
  for (const col of SDK_COLLECTIONS) {
    const page = await client.find({ collection: col, page: 1, limit: 5 })
    assert.equal(page.page, 1)
    assert.equal(page.limit, 5)
    assert.ok(page.totalDocs > 0, col)
    assert.ok(page.docs.length > 0 && page.docs.length <= 5, col)
    assert.deepEqual(page.docs.map((d) => d.id), sdkCollection(col, 1, 5).docs.map((d) => d.id), col)
  }

  // findByID resolves products by theorem key or sealed UUID with joined variants, entanglements and MCP tools
  const byKey = await client.findByID({ collection: 'products', id: 'Advantage.advantage_unbounded' })
  const byId = await client.findByID({ collection: 'products', id: byKey.id })
  assert.equal(byId.id, byKey.id)
  assert.equal(byId.vitepressPath, `/catalog/${byKey.id}`)
  assert.ok(Array.isArray(byId.entanglements) && byId.entanglements.length > 0)
  assert.ok(Array.isArray(byId.mcpTools) && byId.mcpTools.length > 0)
  assert.deepEqual(byId.id, sdkFindById('products', byKey.id)?.id)

  // standard Payload create on computations collection
  const computed = await client.create({ collection: 'computations', data: { tool: 'fold', arguments: { qubits: 4 } } }) as Record<string, unknown>
  const direct = await sdkCompute('fold', { qubits: 4 })
  assert.equal(computed.id, direct.id)
  assert.equal(computed.tool, 'fold')
  assert.equal(computed.vitepressPath, '/mcp/crypto')
  assert.ok(computed.result && typeof computed.result === 'object')

  // standard Payload create for theorem entanglement interaction
  const interacted = await client.create({ collection: 'computations', data: { source: 'Advantage.advantage_unbounded', target: 'Advantage.two_pow_le_space' } }) as Record<string, unknown>
  const directInteract = sdkInteract('Advantage.advantage_unbounded', 'Advantage.two_pow_le_space')
  assert.equal(interacted.entangled, true)
  assert.equal(interacted.direct, true)
  assert.deepEqual(interacted.receipt, directInteract.receipt)

  // standard Payload findGlobal on mcp-tools matches sdkMcpTools
  const tools = await client.findGlobal({ slug: 'mcp-tools', query: { product: 'Advantage.advantage_unbounded', page: 1, limit: 20 } }) as { totalDocs: number; docs: { kind: string; targetTheorem?: string }[] }
  assert.equal(tools.totalDocs, sdkMcpTools('Advantage.advantage_unbounded', 1, 20).totalDocs)
  assert.ok(tools.docs.some((t) => t.kind === 'entanglement' && t.targetTheorem === 'Advantage.two_pow_le_space'))

  // MCP serves strictly as the live connector over /api/mcp
  const mcpReply = await client.mcp('tools/call', { name: 'fold', arguments: { qubits: 4 } }) as { result?: { structuredContent?: Record<string, unknown> } }
  assert.ok(mcpReply.result?.structuredContent)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: VitePress product routes match the exact Payload product ids, entanglements and client MCP tool names. */
test('VitePress product routes match the exact Payload product ids, entanglements and client MCP tool names', () => {
  const routes = sdkProductRoutes()
  assert.equal(routes.length, THEOREMS.length)
  const sample = routes.find((r) => r.params.theorem === 'Advantage.advantage_unbounded')
  assert.ok(sample)
  const doc = sdkFindById('products', 'Advantage.advantage_unbounded')!
  assert.equal(sample.params.product, doc.id)
  assert.equal(Number(sample.params.entanglements), doc.entanglementCount)
  assert.equal(Number(sample.params.entanglements), (doc.entanglements as unknown[]).length)
  assert.ok(sample.content.includes('## entanglements'))
  assert.ok(sample.content.includes('Advantage.two_pow_le_space'))
  assert.ok(sample.content.includes('/api/computations'))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: Quantum OS consolidates all layers into one fractal pivot with zero source code entropy. */
test('Quantum OS consolidates all layers into one fractal pivot with zero source code entropy', () => {
  const pivot = quantumPivot()
  assert.equal(pivot.registerQubits, 122)
  assert.equal(pivot.rows.length, 7)
  assert.deepEqual(pivot.rows.map((r) => r.scale.split(' · ')[1]), ['register', 'kernel', 'catalog', 'entanglements', 'sdk', 'cloudflare', 'iso'])
  assert.equal(quantumOs.kernel.theorems, THEOREMS.length)
  assert.equal(quantumOs.kernel.sorry, 0)
  const tracked = execFileSync('git', ['ls-files', 'src/quantum', 'scripts'], { encoding: 'utf8' }).split('\n').filter(Boolean)
  const paths = [...new Set([...tracked, 'src/quantum/uuid/programs/sdk/index.ts', 'src/quantum/uuid/programs/sdk/index.ts'])].filter(quantumOs.kernel.stableSource)
  const files = Object.fromEntries(paths.map((p) => [p, readFileSync(p, 'utf8')]))
  const stability = quantumOs.kernel.stable(files)
  assert.equal(stability.stable, true, JSON.stringify(stability.entropy))
  assert.equal(stability.release, 'allowed')
  assert.equal(stability.entropy.leads, 0)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: QPU serves Google API Discovery v1, Gemini function declarations, OpenAPI 3.1 and live receipt enhancement through standard Payload global /api/globals/google. */
test('QPU serves Google API Discovery v1, Gemini function declarations, OpenAPI 3.1 and live receipt enhancement through standard Payload global /api/globals/google', async () => {
  const get = async (path: string) => {
    const req = new Request(`https://qpu.uuidna.com${path}`)
    assert.equal(isSdkRequest(req), true, path)
    const res = await serveSdk(req)
    assert.equal(res.status, 200, path)
    return res.json() as Promise<Record<string, any>>
  }
  const disc = await get('/api/globals/google?view=discovery')
  assert.equal(disc.kind, 'discovery#restDescription')
  assert.equal(disc.discoveryVersion, 'v1')
  assert.equal(disc.servicePath, 'api/')
  assert.ok(disc.resources.computations && disc.resources.globals && disc.resources.products && disc.resources.mcp)

  const gemini = await get('/api/globals/google?view=gemini-tools')
  assert.equal(gemini.standard, 'gemini-function-declarations')
  assert.ok(gemini.count > 0 && gemini.tools[0].functionDeclarations.length === gemini.count)
  assert.ok(gemini.tools[0].functionDeclarations.every((d: { parameters: { type: string } }) => d.parameters.type === 'OBJECT'))

  const productGemini = await get('/api/globals/google?view=gemini-tools&product=Advantage.advantage_unbounded')
  assert.ok(productGemini.count > 0)
  assert.ok(productGemini.tools[0].functionDeclarations.some((d: { name: string }) => d.name.startsWith('entangle_')))

  const openapi = await get('/api/globals/google?view=openapi')
  assert.equal(openapi.openapi, '3.1.0')
  assert.ok(openapi.paths['/api/globals/google'] && openapi.paths['/api/computations'] && openapi.paths['/api/products/{id}'])

  const integrations = await get('/api/globals/google?view=integrations')
  assert.equal(integrations.phase, 'google-integrations')
  assert.ok(integrations.surfaces.length >= 6)
  assert.ok(integrations.registeredGoogleEndpoints.length > 0)

  const enhancedRes = await serveSdk(new Request('https://qpu.uuidna.com/api/globals/google', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      api: 'gemini.generateContent',
      payload: { model: 'gemini-2.5-pro', input: 'verify' },
      theorem: 'Advantage.advantage_unbounded',
      targetTheorem: 'Advantage.two_pow_le_space',
    }),
  }))
  assert.equal(enhancedRes.status, 200)
  const enhanced = await enhancedRes.json() as Record<string, any>
  assert.equal(enhanced.phase, 'google-enhanced')
  assert.equal(enhanced.sealed, true)
  assert.equal(enhanced.sha256.length, 64)
  assert.equal(enhanced.interaction.entangled, true)
  assert.equal(enhanced.interaction.direct, true)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: Post-Quantum Payload UI manifest covers all Lean-configured Payload UI possibilities, collections, globals, blocks and NIST PQC algorithms through standard Payload global /api/globals/payload-ui. */
test('Post-Quantum Payload UI manifest covers all Lean-configured Payload UI possibilities, collections, globals, blocks and NIST PQC algorithms through standard Payload global /api/globals/payload-ui', async () => {
  const req = new Request('https://qpu.uuidna.com/api/globals/payload-ui')
  assert.equal(isSdkRequest(req), true)
  const res = await serveSdk(req)
  assert.equal(res.status, 200)
  const ui = await res.json() as Record<string, any>
  assert.equal(ui.phase, 'payload-ui')
  assert.equal(ui.coverage.percent, 100)
  assert.equal(ui.coverage.total, quantumOs.sdk.payloadUiPossibilities.length)
  assert.equal(ui.collections.length, SDK_COLLECTIONS.length)
  assert.deepEqual(ui.globals, [...SDK_GLOBALS])
  assert.equal(ui.admin.studioPath, '/studio')
  assert.equal(ui.admin.plugins.length, 9)
  assert.equal(ui.blocks.length, 8)
  assert.deepEqual(ui.pqc.algorithms, [...quantumOs.sdk.pqcAlgorithms])
  assert.equal(ui.pqc.register.free, 122)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: Autonomous online pipeline, Clay duality, and 1000-bit factoring are served through standard Payload globals. */
test('Autonomous online pipeline, Clay duality, and 1000-bit factoring are served through standard Payload globals', async () => {
  const manifestReq = new Request('https://qpu.uuidna.com/api/globals/pipeline')
  assert.equal(isSdkRequest(manifestReq), true)
  const manifestRes = await serveSdk(manifestReq)
  assert.equal(manifestRes.status, 200)
  const manifest = await manifestRes.json() as Record<string, any>
  assert.equal(manifest.phase, 'pipeline')
  assert.equal(manifest.autonomous, true)
  assert.equal(manifest.stages.length, 8)
  assert.ok(manifest.onlineEndpoints.includes('https://qpu.uuidna.com/studio'))
  assert.ok(manifest.onlineEndpoints.includes('https://qpu.uuidna.com/api/globals/pipeline'))

  const runRes = await serveSdk(new Request('https://qpu.uuidna.com/api/globals/pipeline', { method: 'POST' }))
  assert.equal(runRes.status, 200)
  const receipt = await runRes.json() as Record<string, any>
  assert.equal(receipt.phase, 'pipeline-run')
  assert.equal(receipt.autonomous, true)
  assert.equal(receipt.holds, true)
  assert.equal(receipt.passed, 7)
  assert.equal(receipt.total, 7)
  assert.equal(receipt.sealed, true)
  assert.equal(receipt.stages.some((s: { id: string; passed: boolean }) => s.id === 'gqai-challenges' && s.passed), true)
  assert.equal(receipt.sha256.length, 64)

  const clayRes = await serveSdk(new Request('https://qpu.uuidna.com/api/globals/clay-duality'))
  assert.equal(clayRes.status, 200)
  const clay = await clayRes.json() as Record<string, any>
  assert.equal(clay.phase, 'clay-duality')
  assert.equal(clay.driver, 'clay_wings')
  assert.ok(clay.superpositions >= 39)
  assert.deepEqual(clay.dualityPoles, ['primal', 'dual'])
  assert.equal(clay.primal.proverVerdict, 'accept')
  assert.equal(clay.dual.proverVerdict, 'reject')

  const c1000Res = await serveSdk(new Request('https://qpu.uuidna.com/api/globals/clay-1000bit?page=1&limit=10'))
  assert.equal(c1000Res.status, 200)
  const c1000 = await c1000Res.json() as Record<string, any>
  assert.equal(c1000.phase, 'clay-1000bit')
  assert.equal(c1000.bits, 1000)
  assert.equal(c1000.totalProducts, 327680)
  assert.equal(c1000.bellPairs, 136)
  assert.equal(c1000.ghzTrinities, 680)
  assert.equal(c1000.totalVariants, 5243696)
  assert.equal(c1000.docs.length, 10)
  assert.equal(c1000.docs.every((d: { exact: boolean; variants: unknown[] }) => d.exact && d.variants.length === 16), true)
})
