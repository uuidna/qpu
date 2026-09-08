import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  QPU_ASSETS, QPU_COMPATIBILITY_DATE, QPU_CONFIG_HOST, QPU_CONFIG_PINS, QPU_DEV_PACKAGES,
  QPU_NODE, QPU_PAYLOAD_API, QPU_PAYLOAD_PACKAGES, QPU_PAYLOAD_PIN, QPU_PAYLOAD_PLUGINS, QPU_TSCONFIG, QPU_WORKER_ENTRY,
  qpuConfigHolds, qpuConfigOf, qpuFirmwareHolds, qpuFirmwareOf, qpuPayloadHolds, qpuPayloadOf,
} from './config.js'
import { QPU_HOST } from './hologram.js'
import { QPU_PKG_STAMP } from './packages.js'
import { handleQpuFetch } from './edge.js'
import { qpuMcpCall } from './mcp-catalog.js'

const ROOT = join(import.meta.dirname, '..')

test('qpuConfigHolds fuses VitePress hologram and Payload CMS in one stamp', () => {
  const c = qpuConfigOf()
  assert.equal(c.kind, 'config')
  assert.equal(c.when, 'never')
  assert.equal(c.seat, 'empty')
  assert.equal(c.href, `https://${QPU_CONFIG_HOST}/config`)
  assert.equal(c.node, QPU_NODE)
  assert.deepEqual(c.packages, [...QPU_DEV_PACKAGES])
  assert.deepEqual(c.pins, { ...QPU_CONFIG_PINS })
  assert.equal(c.frameworks.length, 5)
  assert.equal(c.editors.length, 2)
  assert.equal(c.fuse.hologram, 'vitepress')
  assert.equal(c.fuse.cms, 'payload')
  assert.equal(c.fuse.api, 'crud')
  assert.equal(c.fuse.editors, 2)
  assert.deepEqual(c.shared.editors, ['vitepress', 'payload'])
  assert.equal(c.shared.node, c.node)
  assert.equal(c.shared.assets, c.wrangler.assets)
  assert.equal(c.shared.worker, c.wrangler.main)
  assert.equal(c.typescript.strict, true)
  assert.equal(c.wrangler.main, QPU_WORKER_ENTRY)
  assert.equal(c.wrangler.compatibilityDate, QPU_COMPATIBILITY_DATE)
  assert.equal(c.vitepress.name, 'vitepress')
  assert.equal(c.vitepress.role, 'hologram')
  assert.equal(c.vitepress.assets, QPU_ASSETS)
  assert.equal(c.vitepress.visible, false)
  assert.equal(c.payload.name, 'payload')
  assert.equal(c.payload.role, 'cms')
  assert.equal(c.payload.visible, false)
  assert.equal(c.payload.pin, QPU_PAYLOAD_PIN)
  assert.equal(qpuConfigHolds(c), true)
  const fw = qpuFirmwareOf()
  assert.equal(fw.host, QPU_HOST)
  assert.equal(fw.role, 'hologram')
  assert.equal(fw.assets, QPU_ASSETS)
  assert.equal(qpuFirmwareHolds(fw), true)
  const cms = qpuPayloadOf()
  assert.equal(cms.pin, '3.88.0')
  assert.equal(cms.skipped.length, 0)
  assert.ok(cms.fused.includes('search'))
  assert.ok(cms.fused.includes('stripe'))
  assert.ok(cms.fused.includes('sentry'))
  assert.equal(cms.order[cms.order.length - 1], 'mcp')
  assert.equal(cms.api.graphql, false)
  assert.equal(cms.api.local, 'crud')
  assert.equal(cms.api.http, 'rest')
  assert.equal(cms.api.vitepress, 'loader')
  assert.equal(cms.lexical.nesting, true)
  assert.equal(cms.lexical.skipped.length, 0)
  assert.ok(cms.lexical.features.includes('typography'))
  assert.ok(cms.lexical.features.includes('embed'))
  assert.equal(cms.teleport.morph, true)
  assert.equal(cms.teleport.lexical, true)
  assert.equal(cms.teleport.nesting, true)
  assert.equal(cms.teleport.at, 'once')
  assert.equal(cms.teleport.dimensions.faces, 14)
  assert.equal(cms.teleport.dimensions.combos, cms.teleport.dimensions.doors * cms.teleport.dimensions.rays)
  assert.equal(cms.plugins.every((p) => p.fused && p.copies === 1), true)
  assert.equal(cms.access.pages.read, 'published-or-user')
  assert.equal(qpuPayloadHolds(cms), true)
})

test('package.json, tsconfig.json, and wrangler.toml match the config constructor', () => {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as {
    devDependencies: Record<string, string>
    engines?: { node?: string }
  }
  assert.deepEqual(pkg.devDependencies, { ...QPU_CONFIG_PINS })
  assert.equal(pkg.engines?.node, QPU_NODE)
  assert.deepEqual(QPU_PKG_STAMP.devDependencies, { ...QPU_CONFIG_PINS })
  const tsconfig = JSON.parse(readFileSync(join(ROOT, 'tsconfig.json'), 'utf8')) as {
    compilerOptions: Record<string, unknown>
  }
  assert.equal(tsconfig.compilerOptions.target, QPU_TSCONFIG.target)
  assert.equal(tsconfig.compilerOptions.module, QPU_TSCONFIG.module)
  assert.equal(tsconfig.compilerOptions.moduleResolution, QPU_TSCONFIG.moduleResolution)
  assert.equal(tsconfig.compilerOptions.strict, QPU_TSCONFIG.strict)
  assert.equal(tsconfig.compilerOptions.noEmitOnError, QPU_TSCONFIG.noEmitOnError)
  assert.deepEqual(tsconfig.compilerOptions.types, [...QPU_TSCONFIG.types])
  const wrangler = readFileSync(join(ROOT, 'wrangler.toml'), 'utf8')
  assert.match(wrangler, new RegExp(`^main = "${QPU_WORKER_ENTRY}"`, 'm'))
  assert.match(wrangler, new RegExp(`compatibility_date = "${QPU_COMPATIBILITY_DATE}"`))
  assert.match(wrangler, /run_worker_first = \[/)
  assert.match(wrangler, /"!\/assets\/\*"/)
  assert.match(wrangler, /binding = "ASSETS"/)
  assert.match(wrangler, new RegExp(`directory = "\\./${QPU_ASSETS.replace(/\//g, '\\/')}"`))
})

test('GET /config and MCP qpu_config are the toolchain stamp', async () => {
  const res = await handleQpuFetch(new Request(`https://${QPU_HOST}/config`))
  assert.equal(res.status, 200)
  const body = await res.json() as { kind: string; holds: boolean; href: string }
  assert.equal(body.kind, 'config')
  assert.equal(body.holds, true)
  assert.equal(body.href, `https://${QPU_CONFIG_HOST}/config`)
  const mcp = await qpuMcpCall('qpu_config', {}) as { holds: boolean; kind: string }
  assert.equal(mcp.kind, 'config')
  assert.equal(mcp.holds, true)
})

test('Payload plugins fuse on this stamp; no sibling CMS package', () => {
  const cms = qpuPayloadOf()
  assert.equal(cms.packages.length, QPU_PAYLOAD_PACKAGES.length)
  for (const name of QPU_PAYLOAD_PACKAGES) assert.ok(cms.packages.includes(name), name)
  assert.equal(QPU_PAYLOAD_PLUGINS.every((p) => p.fused), true)
  assert.equal(cms.skipped.length, 0)
  assert.equal(qpuPayloadHolds(cms), true)
})

test('VitePress defineLoader occupies Payload CRUD, not GraphQL', () => {
  const cms = qpuPayloadOf()
  const c = qpuConfigOf()
  const graphql = {
    method: 'POST',
    path: '/api/graphql',
    schema: true,
    uploads: false,
    hops: 1,
    watch: false,
  }
  const rest = {
    method: 'GET',
    path: '/api/{collection}',
    schema: false,
    uploads: true,
    hops: 1,
    depth: true,
  }
  const local = {
    method: 'find',
    path: QPU_PAYLOAD_API.find,
    schema: false,
    uploads: true,
    hops: 0,
    watch: true,
    depth: QPU_PAYLOAD_API.depth,
  }
  assert.equal(QPU_PAYLOAD_API.graphql, false)
  assert.equal(QPU_PAYLOAD_API.local, 'crud')
  assert.equal(QPU_PAYLOAD_API.http, 'rest')
  assert.equal(QPU_PAYLOAD_API.vitepress, 'loader')
  assert.equal(cms.api.graphql, graphql.schema && QPU_PAYLOAD_API.graphql)
  assert.equal(local.hops < rest.hops && rest.uploads && !graphql.uploads, true)
  assert.equal(local.watch && !graphql.watch, true)
  assert.equal(c.fuse.api, local.method === 'find' ? 'crud' : 'graphql')
  assert.equal(QPU_PAYLOAD_PACKAGES.some((n) => n.includes('graphql')), false)
  assert.equal(QPU_PAYLOAD_PLUGINS.some((p) => p.package.includes('graphql')), false)
  assert.equal((QPU_DEV_PACKAGES as readonly string[]).includes('graphql'), false)
  assert.equal((QPU_DEV_PACKAGES as readonly string[]).includes('graphql-request'), false)
  assert.equal(qpuPayloadHolds(cms), true)
})
