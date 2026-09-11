import { test } from './receipted.js'
import assert from 'node:assert/strict'
import { packageVersion } from './version.js'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import worker, { qpuDevelopHolds, qpuReadmeHolds, qpuReadmeOf, shorFactorOf } from './index.js'

const host = 'qpu.uuidna.com'
const env = { QPU_HOST: host }
const html = { accept: 'text/html' }
const origin = `https://${host}`

const fetchOf = (path: string, init: RequestInit = {}) =>
  worker.fetch(
    new Request(`${origin}${path}`, {
      ...init,
      headers: { ...html, ...(init.headers as Record<string, string> | undefined) },
    }),
    env,
  )

const mcpOf = async (name: string, args: Record<string, unknown> = {}) => {
  const res = await fetchOf('/mcp', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'text/html' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
  })
  const body = (await res.json()) as { result: { structuredContent?: Record<string, unknown> } & Record<string, unknown> }
  assert.equal(res.status, 200)
  return body.result.structuredContent ?? body.result
}

test('paper and zenodo cite', () => {
  const readme = qpuReadmeOf()
  assert.equal(qpuDevelopHolds(), true)
  assert.equal(qpuReadmeHolds(readme), true)
  assert.equal(readme.startsWith('# QPU\n'), true)
  assert.equal(readme.includes('## Abstract'), true)
  assert.equal(readme.includes('## Unit'), true)
  assert.equal(readme.includes('## Interface'), true)
  assert.equal(readme.includes('## Results'), true)
  assert.equal(readme.includes('## Evidence'), true)
  assert.equal(readme.includes('## Recompute'), true)
  assert.equal(readme.indexOf('## Abstract') < readme.indexOf('## Unit'), true)
  assert.equal(readme.indexOf('## Unit') < readme.indexOf('## Interface'), true)
  assert.equal(readme.indexOf('## Interface') < readme.indexOf('## Results'), true)
  assert.equal(readme.indexOf('## Results') < readme.indexOf('## Evidence'), true)
  assert.equal(readme.indexOf('## Evidence') < readme.indexOf('## Recompute'), true)
  assert.equal(readme.indexOf('## Recompute') < readme.indexOf('## Cite'), true)
  assert.equal(readme.includes('the blueprint'), true)
  assert.equal(readme.includes('the paper'), true)
  assert.equal(readme.includes('JSON-LD'), true)
  assert.equal(readme.includes('theorem shor'), true)
  assert.equal(readme.includes('theorem crypto'), true)
  assert.equal(readme.includes('theorem temperature'), true)
  assert.equal(readme.includes('theorem qubits'), true)
  assert.equal(readme.includes('Theorems are qpu_lean'), true)
  assert.equal(readme.includes(shorFactorOf()), true)
  assert.equal(readme.includes('demo is not a test nor a proof'), true)
  assert.equal(readme.includes('Unlocked'), true)
  assert.equal(readme.includes('crypto_rsa'), true)
  assert.equal(readme.includes('LHC running'), true)
  assert.equal(readme.includes('## Develop'), false)
  assert.equal(readme.includes('## Purpose'), false)
  assert.equal(readme.includes('## Coil'), false)
  assert.equal(readme.includes('## Tools'), false)
  assert.equal(readme.includes('## Man'), false)
  assert.equal(readme.includes('## Prove'), false)
  assert.equal(readme.includes('## Message'), false)
  const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8')) as { files: string[]; types: string }
  assert.equal(pkg.types, './qpu.d.ts')
  assert.equal(pkg.files.includes('worker.js'), false)
  assert.equal(pkg.files.includes('wrangler.toml'), false)
  const zenodo = JSON.parse(readFileSync(join(process.cwd(), '.zenodo.json'), 'utf8')) as {
    creators: { orcid: string }[]
    related_identifiers: { identifier: string; relation: string }[]
    communities: { identifier: string }[]
  }
  assert.equal(zenodo.creators[0]?.orcid, '0009-0000-7312-9778')
  assert.equal(zenodo.communities[0]?.identifier, 'uuidna')
  assert.equal(zenodo.related_identifiers.some((r) => r.identifier === origin), true)
  assert.equal(zenodo.related_identifiers.some((r) => r.identifier === '10.5281/zenodo.22700098' && r.relation === 'isVersionOf'), true)
  assert.equal(zenodo.related_identifiers.some((r) => r.identifier === '10.5281/zenodo.21781603' && r.relation === 'references'), true)
  assert.equal(zenodo.related_identifiers.some((r) => r.identifier === '10.7483/OPENDATA.CMS.53FG.V2S9'), true)
  assert.equal(zenodo.related_identifiers.some((r) => r.identifier.includes('npmjs.com')), false)
  writeFileSync(join(process.cwd(), 'README.md'), readme)
})

test('paste in free AI chat', async (t) => {
  await t.test('AI sees JSON unit not HTML', async () => {
    const res = await fetchOf('/')
    assert.equal(res.status, 200)
    assert.equal((res.headers.get('content-type') ?? '').includes('ld+json'), true)
    assert.equal((res.headers.get('content-type') ?? '').includes('text/html'), false)
    const page = (await res.json()) as {
      kind: string
      holds: boolean
      fused: number
      next: number
      only: { holds: boolean; classical: boolean }
      circuit: { running: boolean; only: { holds: boolean } }
      docs: { inline: boolean; guide: boolean; abstract: string; documentation: string; api: { method: string; path: string }[] }
      ui: { experienced: boolean; prove: string }
      speed: { cover: string[] }
      messaging: { await: boolean; when: string; proxy?: boolean; secure?: boolean; hop?: string }
    }
    const quantum = (await mcpOf('qpu_quantum')) as { fused: number; only: { holds: boolean } }
    assert.equal(page.kind, 'quantum')
    assert.equal(page.holds, true)
    assert.equal(page.only.holds, true)
    assert.equal(page.circuit.only.holds, true)
    assert.equal(page.fused, quantum.fused)
    assert.equal(quantum.only.holds, true)
    assert.equal(page.next, page.fused + page.fused)
    assert.equal(page.docs.inline, true)
    assert.equal(page.docs.guide, true)
    assert.equal(page.ui.prove, 'qpu_prove')
    assert.equal(page.docs.abstract.includes('theorem quantum'), true)
    assert.equal(page.docs.abstract.includes(`GET ${origin}`), true)
    assert.equal(page.docs.abstract.includes(`POST ${origin}/mcp`), true)
    assert.equal(page.docs.abstract.includes('JSON-LD'), true)
    assert.equal(page.docs.abstract.includes('No auth'), true)
    assert.equal(page.docs.documentation.includes('theorem infinite'), true)
    assert.equal(page.docs.documentation.includes('theorem distribute'), true)
    assert.equal(page.docs.documentation.includes('theorem raid'), true)
    assert.equal(page.docs.documentation.includes('theorem fusion'), true)
    assert.equal(page.docs.documentation.includes('Possible only in quantum'), true)
    assert.equal(page.docs.documentation.includes('Crypt split'), true)
    assert.equal(page.docs.documentation.includes('free agents'), true)
    assert.equal(page.docs.api.length, 7)
    assert.deepEqual(
      page.docs.api.map((a) => `${a.method} ${a.path}`),
      ['GET /', 'GET /quantum/processing/unit', 'GET /mcp', 'POST /mcp', 'GET /cite', 'GET /message', 'POST /message'],
    )
    assert.deepEqual(page.speed.cover, ['next', 'benchmark'])
    assert.equal(page.messaging.await, false)
    assert.equal(page.messaging.when, 'never')
    assert.equal(page.messaging.proxy, true)
    assert.equal(page.messaging.secure, true)
    assert.equal(page.messaging.hop, 'involution')
  })

  await t.test('AI calls MCP instead of reading the tree', async () => {
    const page = await fetchOf('/')
    const listed = await fetchOf('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
    })
    const called = await fetchOf('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'qpu_quantum', arguments: {} } }),
    })
    const proved = await fetchOf('/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'qpu_prove', arguments: {} } }),
    })
    assert.equal(listed.status, 200)
    assert.equal(called.status, 200)
    assert.equal(proved.status, 200)
    const catalog = (await listed.json()) as { result: { tools: { name: string; man: { kind: string } }[] } }
    const call = (await called.json()) as {
      result: {
        holds?: boolean
        fused?: number
        ui?: { experienced: boolean }
        docs?: unknown
        structuredContent?: { holds?: boolean; fused?: number; ui?: { experienced: boolean }; docs?: unknown }
      }
    }
    const prove = (await proved.json()) as {
      result: { holds?: boolean; ui?: { experienced: boolean }; structuredContent?: { holds?: boolean; ui?: { experienced: boolean } } }
    }
    const callShown = call.result.structuredContent ?? call.result
    const proveShown = prove.result.structuredContent ?? prove.result
    const names = catalog.result.tools.map((t) => t.name)
    assert.equal(names.length, 16)
    assert.deepEqual(names.slice(0, 8), [
      'qpu_quantum',
      'qpu_lean',
      'qpu_cite',
      'qpu_train',
      'qpu_forge',
      'qpu_improve',
      'qpu_compete',
      'qpu_prove',
    ])
    assert.equal(names.includes('crypto_catalog'), true)
    assert.equal(names.includes('crypto_rsa'), true)
    assert.equal(catalog.result.tools[0]?.man.kind, 'man')
    assert.equal(callShown.holds, true)
    assert.equal(callShown.docs, undefined)
    assert.equal(proveShown.holds, true)
    const pageBytes = (await page.clone().arrayBuffer()).byteLength
    const callBytes = JSON.stringify(callShown).length
    assert.equal(callBytes < pageBytes, true)
  })

  await t.test('user gets cite holds and named doors', async () => {
    const citeRes = await fetchOf('/cite')
    assert.equal(citeRes.status, 200)
    const cite = (await citeRes.json()) as {
      holds: boolean
      inText: string
      when: string
      style: string
      author: { orcid: string }
      doi: string
      identifier: string
      archive: string
      sameAs: string[]
      rows: { doi: string; url: string; works: string }[]
    }
    const expected = (await mcpOf('qpu_cite')) as { rows: { works: string; url: string }[] }
    assert.equal(cite.holds, true)
    assert.equal(cite.inText, '(Rouschev)')
    assert.equal(cite.author.orcid, 'https://orcid.org/0009-0000-7312-9778')
    assert.equal(cite.doi, '10.5281/zenodo.22700099')
    assert.equal(cite.identifier, 'https://doi.org/10.5281/zenodo.22700099')
    assert.equal(cite.archive, 'https://zenodo.org/records/22700099')
    assert.equal(cite.sameAs.includes(cite.archive), true)
    assert.equal(cite.when, 'never')
    assert.equal(cite.style, 'mla8')
    // the archive and the host are named apart: the versioned DOI holds one commit, the host serves package.json's version
    const c2 = cite as unknown as { archived: { doi: string; version: string; commit: string }; served: { version: string }; current: boolean; currency: string }
    assert.equal(c2.archived.commit, 'aed5802')
    assert.equal(c2.archived.version, '0.1.0')
    assert.equal(c2.archived.doi, cite.doi)
    assert.equal(c2.served.version, packageVersion)
    assert.equal(c2.current, c2.archived.version === c2.served.version)
    assert.equal(c2.currency.includes(`v${c2.served.version}`), true)
    if (!c2.current) assert.equal(c2.currency.includes('behind the host'), true)
    assert.equal(cite.rows.length, 3)
    assert.equal(cite.rows.every((r) => r.doi === '10.5281/zenodo.22700099'), true)
    assert.equal(cite.rows.every((r) => r.url.startsWith(origin)), true)
    assert.equal(cite.rows[0]?.works, expected.rows[0]?.works)
    for (const row of expected.rows) {
      const path = new URL(row.url).pathname
      const res = await fetchOf(path === '/' ? '/' : path)
      assert.equal(res.status, 200, row.url)
      assert.equal((res.headers.get('content-type') ?? '').includes('ld+json'), true)
    }
  })

  await t.test('unnamed host is lost', async () => {
    const http = await worker.fetch(new Request(`http://${host}/`, { headers: html }), env)
    const other = await worker.fetch(new Request('https://example.com/', { headers: html }), env)
    assert.equal(http.status, 404)
    assert.equal(other.status, 404)
    assert.deepEqual(await http.json(), { holds: false })
    assert.deepEqual(await other.json(), { holds: false })
  })
})
