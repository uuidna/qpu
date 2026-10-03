#!/usr/bin/env node
/**
 * Next.js + Payload on Cloudflare, in every combination, through PayloadTemplates.cloudflarePayload.
 *
 *   node scripts/payload-cloudflare.mjs                         enumerate + typecheck + receipt
 *   node scripts/payload-cloudflare.mjs --emit <key> --out dir  write one combination (payload.config.ts, wrangler.jsonc, deps)
 *
 * Enumeration: runtimes × databases × storage × email × every subset of the plugins, each with a content UUID and a
 * quantum receipt (stream payload-cf). Typecheck: every base (runtime × db × storage × email) is generated with no
 * plugins and with all plugins, and compiled against the installed packages in one tsc program. A plugin is one call
 * returning a Plugin in the plugins array and contributes nothing to another plugin's types, so a base that compiles
 * with all of them and with none compiles with every subset; runtime interplay between plugins is not a type question
 * and is not claimed here.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { PayloadTemplates, cloudflareCombinations, cloudflareKeyOf, cloudflareCombinationOf, CLOUDFLARE_PLUGINS } from '../dist/deployment/payload-templates.js'
import { qpuContentUuidOf, qpuUuidReceiptOf, qpuReceiptStreamsOf } from '../dist/quantum/processing/unit/index.js'

const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined }
const ROOT = process.cwd()

/* THE REPO'S OWN APP, regenerated from one combination: the QPU document database on KV + R2 (qpu-raid), uploads on
 * R2, the documentation as the public site (docs collection, seeded from scripts/generate-docs.mjs), search and SEO on it.
 * It deploys as the Worker the unit's PAYLOAD binding names; the unit hands it every browser page and /api. */
const REPO_COLLECTIONS = [['Users', 'users'], ['Tenants', 'tenants'], ['Docs', 'docs'], ['FuseApis', 'fuse-apis'], ['FuseFields', 'fuse-fields'], ['FuseFormulas', 'fuse-formulas'], ['QuantumReceipts', 'quantum-receipts']]
  .map(([name, slug]) => ({ name, slug, from: `./src/payload/collections/${slug}` }))
const REPO_NAME = 'uuidna-qpu-payload'
const REPO_WRANGLER = 'payload.wrangler.jsonc'
const REPO = {
  key: 'opennext/qpu-raid/r2/none/ecommerce+form-builder+import-export+mcp+multi-tenant+nested-docs+redirects+search+sentry+seo+stripe',
  app: {
    collections: REPO_COLLECTIONS, adminUser: 'users', title: 'UUIDNA QPU',
    targets: {
      'multi-tenant': [], search: ['docs'], seo: ['docs'], 'nested-docs': ['docs'], redirects: ['docs'],
      'import-export': ['docs', 'quantum-receipts', 'fuse-apis', 'fuse-fields', 'fuse-formulas'], mcp: ['docs', 'quantum-receipts', 'fuse-formulas'],
    },
    pluginOptions: {
      'multi-tenant': "tenantsArrayField: { includeDefaultField: false }, userHasAccessToAllTenants: (user) => (user as { role?: string } | null)?.role === 'super-admin'",
      ecommerce: "products: { productsCollectionOverride: ({ defaultCollection }) => ({ ...defaultCollection, admin: { ...defaultCollection.admin, useAsTitle: 'title' }, fields: [{ name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', unique: true, index: true }, { name: 'description', type: 'textarea' }, ...defaultCollection.fields] }) }",
      seo: "uploadsCollection: 'media', generateTitle: ({ doc }) => seoTitleOf(doc), generateDescription: ({ doc }) => seoDescriptionOf(doc), generateURL: ({ doc }) => seoURLOf(doc)",
    },
    imports: ['seoTitleOf', 'seoDescriptionOf', 'seoURLOf'].map((name) => ({ name, from: './src/payload/collections/docs' })),
    own: ['app/(frontend)/page.tsx', 'app/(frontend)/layout.tsx', 'app/(frontend)/docs/[slug]/page.tsx'],
    origins: ['https://qpu.uuidna.com'],
    typescriptOutput: './src/payload/payload-types.ts',
    frontend: { collection: 'docs', route: 'docs', html: 'html' },
    seed: { name: 'seed', from: './src/payload/seeds' },
    preload: ['./src/payload/workers-crypto'],
    wrangler: REPO_WRANGLER,
    bound: true,
  },
}
// the app's TypeScript: the generated shell, the config and the collections, with @uuidna/qpu resolved to this build
const REPO_TSCONFIG = {
  compilerOptions: {
    target: 'ES2022', lib: ['dom', 'dom.iterable', 'esnext'], module: 'esnext', moduleResolution: 'bundler', jsx: 'preserve', strict: true, noEmit: true,
    skipLibCheck: true, esModuleInterop: true, resolveJsonModule: true, isolatedModules: true, incremental: true, allowJs: true,
    types: ['@cloudflare/workers-types', 'node'], plugins: [{ name: 'next' }],
    paths: { '@/*': ['./*'], '@payload-config': ['./payload.config.ts'], '@uuidna/qpu': ['./dist/quantum/processing/unit/index'], '@uuidna/qpu/payload': ['./dist/db/payload-qpu'] },
  },
  include: ['next-env.d.ts', 'payload.config.ts', 'app/**/*.ts', 'app/**/*.tsx', 'src/payload/**/*.ts', '.next/types/**/*.ts'],
  exclude: ['node_modules', 'dist', '.open-next', '**/*.test.ts'],
}
if (process.argv.includes('--repo')) {
  const t = PayloadTemplates.cloudflarePayload(cloudflareCombinationOf(REPO.key), REPO_NAME, REPO.app)
  const written = { ...t.files, [REPO_WRANGLER]: t.files['wrangler.jsonc'], 'tsconfig.payload.json': JSON.stringify(REPO_TSCONFIG, null, 1) + '\n' }
  delete written['wrangler.jsonc']
  for (const [f, text] of Object.entries(written)) {
    fs.mkdirSync(path.dirname(f), { recursive: true })
    fs.writeFileSync(f, text)
  }
  execSync('npx payload generate:importmap', { cwd: ROOT, stdio: 'pipe', env: { ...process.env, PAYLOAD_CONFIG_PATH: 'payload.config.ts' } })
  const uuid = qpuContentUuidOf(REPO)
  const row = { key: REPO.key, uuid, receipt: qpuUuidReceiptOf('payload-cf repo', uuid, REPO.key, 'scripts/payload-cloudflare.mjs --repo').uuid, files: Object.keys(written), dependencies: t.dependencies }
  // the app compiled against the installed packages, exactly as next build checks it
  let out = ''
  try { execSync('npx tsc -p tsconfig.payload.json --noEmit --incremental false', { cwd: ROOT, stdio: 'pipe' }) } catch (e) { out = `${e.stdout}${e.stderr}` }
  const errors = out.split('\n').filter((l) => /error TS\d+/.test(l))
  console.log(JSON.stringify({ regenerated: row, typecheck: { errors: errors.length, first: errors.slice(0, 8) } }, null, 1))
  process.exit(errors.length ? 1 : 0)
}

if (arg('--emit')) {
  const t = PayloadTemplates.cloudflarePayload(cloudflareCombinationOf(arg('--emit')), path.basename(arg('--out') ?? 'payload-cloudflare'))
  const out = arg('--out') ?? '.'
  fs.mkdirSync(out, { recursive: true })
  for (const [f, text] of Object.entries(t.files)) fs.writeFileSync(path.join(out, f), text)
  fs.writeFileSync(path.join(out, 'dependencies.txt'), t.dependencies.join('\n') + '\n')
  console.log(JSON.stringify({ key: t.key, uuid: qpuContentUuidOf(t.combination), files: Object.keys(t.files), dependencies: t.dependencies }, null, 1))
  process.exit(0)
}

// every combination, addressed and receipted
const dir = path.join(ROOT, '.payload-cf')
fs.mkdirSync(dir, { recursive: true })
const manifest = fs.createWriteStream(path.join(dir, 'combinations.ndjson'))
const axes = { runtime: new Set(), db: new Set(), storage: new Set(), email: new Set() }
let total = 0
for (const c of cloudflareCombinations()) {
  const key = cloudflareKeyOf(c)
  const uuid = qpuContentUuidOf(c)
  const r = qpuUuidReceiptOf(`payload-cf ${key}`, uuid, key, 'scripts/payload-cloudflare.mjs')
  manifest.write(JSON.stringify({ key, uuid, receipt: r.uuid }) + '\n')
  for (const a of Object.keys(axes)) axes[a].add(c[a])
  total++
}
await new Promise((r) => manifest.end(r))

// typecheck: every base with no plugins and with all plugins, one tsc program
const check = path.join(dir, 'check')
fs.rmSync(check, { recursive: true, force: true })
fs.mkdirSync(check, { recursive: true })
const bases = []
for (const runtime of axes.runtime) for (const db of axes.db) for (const storage of axes.storage) for (const email of axes.email)
  for (const plugins of [[], [...CLOUDFLARE_PLUGINS]]) bases.push({ runtime, db, storage, email, plugins })
bases.forEach((c, i) => {
  const d = path.join(check, String(i).padStart(3, '0'))
  fs.mkdirSync(d)
  fs.writeFileSync(path.join(d, 'payload.config.ts'), PayloadTemplates.cloudflarePayload(c).files['payload.config.ts'])
})
const rel = (p) => path.relative(check, path.join(ROOT, p))
fs.writeFileSync(path.join(check, 'tsconfig.json'), JSON.stringify({
  compilerOptions: {
    target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', strict: true, noEmit: true, skipLibCheck: true, esModuleInterop: true,
    types: ['@cloudflare/workers-types', 'node'], typeRoots: [rel('node_modules/@types'), rel('node_modules')],
    paths: { '@uuidna/qpu': [rel('src/quantum/processing/unit/index.ts')], '@uuidna/qpu/payload': [rel('src/db/payload-qpu.ts')], '*': [rel('node_modules/*')] },
  },
  include: ['*/payload.config.ts'],
}, null, 1))
let tsc = ''
try { execSync(`npx tsc -p ${check}/tsconfig.json`, { cwd: ROOT, stdio: 'pipe' }) } catch (e) { tsc = `${e.stdout}${e.stderr}` }
const errors = tsc.split('\n').filter((l) => /error TS\d+/.test(l))
// an error tied to no config (tsconfig, a library) fails every base: a check that did not compile proved nothing
const unattributed = errors.filter((l) => !/^\.?\/?(\.payload-cf\/check\/)?\d{3}\//.test(l.replace(/^.*?\.payload-cf\/check\//, '')))
const byBase = bases.map((c, i) => {
  const id = String(i).padStart(3, '0')
  const own = errors.filter((l) => l.includes(`${id}/payload.config.ts`) || l.startsWith(`${id}/`))
  const all = [...own, ...unattributed]
  return { key: cloudflareKeyOf(c), ok: all.length === 0, errors: all.slice(0, 3).map((l) => l.replace(/^.*?error /, 'error ')) }
})
const stream = qpuReceiptStreamsOf(0).streams.find((s) => s.stream === 'payload-cf')
const receipt = {
  kind: 'payload-cf-receipt',
  when: new Date().toISOString().slice(0, 10),
  axes: Object.fromEntries(Object.entries(axes).map(([k, v]) => [k, [...v]])),
  plugins: [...CLOUDFLARE_PLUGINS],
  combinations: total,
  typechecked: { bases: bases.length, compiled: tsc === '' || errors.length > unattributed.length || unattributed.length === 0, ok: byBase.filter((b) => b.ok).length, unattributed: unattributed.slice(0, 5), failing: byBase.filter((b) => !b.ok) },
  coverage: 'each base compiled with no plugins and with all plugins; plugins are independent Plugin calls, so every subset of a compiling base compiles',
  stream: stream && { length: stream.length, head: stream.head, chain: stream.chain, holds: stream.holds },
}
fs.writeFileSync('payload-cf-receipt.json', JSON.stringify(receipt, null, 1) + '\n')
console.log(JSON.stringify({ ...receipt, typechecked: { ...receipt.typechecked, failing: receipt.typechecked.failing.slice(0, 4) } }, null, 1))
