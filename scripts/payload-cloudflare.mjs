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
import { PayloadTemplates, cloudflareCombinations, cloudflareKeyOf, cloudflareCombinationOf, CLOUDFLARE_PLUGINS, CLOUDFLARE_FRONTENDS, ALT_FRONTENDS } from '../dist/deployment/payload-templates.js'
import { bootPort, qpuCiteOf, qpuContentUuidOf, qpuUuidReceiptOf, qpuReceiptStreamsOf, qpuHexUuidOf, qpuHexRunOf } from '../dist/quantum/processing/unit/index.js'
// every family registers on import — so the combinatorics family that seals the combination count is callable here
await import('../dist/mcp/families.js')
import { themeCssOf } from '../dist/deployment/payload-templates.js'
import { tenOf, vertices } from './lattice-values.mjs'

const arg = (name) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined }
const ROOT = process.cwd()

/* THE REPO'S OWN APP, regenerated from one combination: the QPU document database on KV + R2 (qpu-raid), uploads on
 * R2, the documentation as the public site (docs collection, seeded from scripts/generate-docs.mjs), search and SEO on it.
 * It deploys as the Worker the unit's PAYLOAD binding names; the unit hands it every browser page and /api. */
// the file system is the registry, as payloadcms/website lays it out: src/collections/<Name>.ts, src/globals/<Name>.ts,
// src/blocks/<Name>/index.ts and src/components/blocks/<Name>/index.tsx; each exports <Name>, a block's slug is its name
// in lower camel case. Adding a file or folder adds it; nothing here lists one by hand.
const SRC = 'src'
const modulesOf = (dir, ext) =>
  fs.readdirSync(path.join(SRC, dir), { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? (fs.existsSync(path.join(SRC, dir, e.name, `index.${ext}`)) ? [e.name] : []) : e.name.endsWith(`.${ext}`) && !/^index\.|\.test\./.test(e.name) ? [e.name.slice(0, -ext.length - 1)] : []))
    .filter((n) => /^[A-Z]/.test(n))
    .sort()
const slugOf = (name) => `${name[0].toLowerCase()}${name.slice(1)}`
// a collection's or global's slug is the one its source declares (fuse-apis, not fuseApis)
const declaredSlugOf = (dir, name) => /slug:\s*'([^']+)'/.exec(fs.readFileSync(path.join(SRC, dir, `${name}.ts`), 'utf8'))?.[1] ?? slugOf(name)
const fromConfig = (dir) => (name) => ({ name, slug: declaredSlugOf(dir, name), from: `./${dir}/${name}` })
const REPO_COLLECTIONS = modulesOf('collections', 'ts').map(fromConfig('collections'))
const REPO_GLOBALS = modulesOf('globals', 'ts').map(fromConfig('globals'))
// the hex families, fused doors and MCP methods register themselves on import: the modules that do so are found by
// what they call, and every importer (the Worker, the site, the receipts, the README) imports this one registry
const registers = (f) => /\b(qpuHexRegisterOf|qpuMcpFuseOf|qpuMcpRegisterOf)\(/.test(fs.readFileSync(f, 'utf8'))
const registering = [
  // every family is a folder: src/families/<name>/index.ts (its test beside it as test.ts)
  ...fs.readdirSync(path.join(SRC, 'families'), { withFileTypes: true }).filter((e) => e.isDirectory() && fs.existsSync(path.join(SRC, 'families', e.name, 'index.ts')) && registers(path.join(SRC, 'families', e.name, 'index.ts'))).map((e) => ({ name: e.name, from: `../families/${e.name}/index.js`, key: e.name })),
  // and the doors that register themselves, beside the registry
  ...fs.readdirSync(path.join(SRC, 'mcp')).filter((f) => /\.ts$/.test(f) && !/\.test\.ts$|^index\.ts$|^families\.ts$|^registry\.ts$/.test(f) && registers(path.join(SRC, 'mcp', f))).map((f) => ({ name: f.slice(0, -3), from: `./${f.slice(0, -3)}.js`, key: f.slice(0, -3) })),
].sort((a, b) => a.key.localeCompare(b.key))
const REPO_REGISTRIES = [
  { file: `${SRC}/mcp/families.ts`, export: 'families', sideEffects: true, entries: registering },
  { file: `${SRC}/blocks/index.ts`, export: 'blocks', type: { name: 'Block', from: 'payload' }, entries: modulesOf('blocks', 'ts').map((name) => ({ name, from: `./${name}/index.js`, key: slugOf(name) })) },
  { file: `${SRC}/components/blocks/index.ts`, export: 'blockComponents', record: true, entries: modulesOf('components/blocks', 'tsx').map((name) => ({ name, from: `./${name}/index.js`, key: slugOf(name) })) },
]
// ONE WORKER: qpu runs on Payload running on qpu. uuidna-qpu is the Payload app; worker.js fronts it with the unit, which
// hands browser pages and /api to the app in-process, and the app keeps its documents in the unit's storage (db/payload).
// The name stays uuidna-qpu: the custom domain is attached to it and uuidna's Worker binds its QpuDeposit entrypoint.
const REPO_NAME = 'uuidna-qpu'
const REPO_WRANGLER = 'wrangler.jsonc'
const REPO_WORKER = {
  main: 'worker.js',
  // no workers.dev or preview address: every request there was a scanner, billed as an invocation
  workers_dev: false,
  preview_urls: false,
  routes: [{ pattern: 'qpu.uuidna.com', custom_domain: true }, { pattern: '*.uuidna.com/*', zone_name: 'uuidna.com' }],
  vars: { QPU_HOST: 'qpu.uuidna.com' },
  kv_namespaces: [{ binding: 'STORAGE', id: 'b341b266250444198e54508ca3aee53a', preview_id: 'b341b266250444198e54508ca3aee53a' }],
  r2_buckets: [{ binding: 'BLOBS', bucket_name: 'uuidna-qpu-blobs' }, { binding: 'MEDIA', bucket_name: 'uuidna-qpu-payload-media' }],
  version_metadata: { binding: 'CF_VERSION_METADATA' },
}
const REPO = {
  // sentry dropped from the served build: it is disabled at runtime without SENTRY_DSN yet `import * as Sentry from
  // '@sentry/nextjs'` bundles its whole tree (226 MB in node_modules) into the Worker, pushing the render over the
  // 128 MB limit. Cloudflare observability covers the host. Re-add '+sentry' here if a DSN-backed deployment needs it.
  key: 'opennext/qpu-raid/r2/none/next/ecommerce+form-builder+import-export+mcp+multi-tenant+nested-docs+redirects+search+seo+stripe',
  app: {
    root: SRC, collections: REPO_COLLECTIONS, globals: REPO_GLOBALS, registries: REPO_REGISTRIES, adminUser: 'users', title: 'UUIDNA QPU',
    targets: {
      // each tenant is an app: an app owns its own content, so every collection is scoped per tenant except the two
      // the QPU shares across all apps — the content-addressed engine (quantum-receipts and the fuse-* registry, the
      // same bytes same UUID for everyone) and the auth/tenant infra (users, tenants) that decides who an app is.
      'multi-tenant': REPO_COLLECTIONS.map((c) => c.slug).filter((s) => !['users', 'tenants', 'quantum-receipts', 'fuse-apis', 'fuse-fields', 'fuse-formulas'].includes(s)),
      search: ['docs', 'pages'], seo: ['docs', 'pages'], 'nested-docs': ['docs', 'pages'], redirects: ['docs', 'pages'],
      // every fused API is usable in the Payload MCP: the fused apis, their shape fields and the cross-formulas they produce
      'import-export': REPO_COLLECTIONS.map((c) => c.slug).filter((s) => s !== 'users'), mcp: ['docs', 'pages', 'quantum-receipts', 'fuse-apis', 'fuse-fields', 'fuse-formulas'],
    },
    pluginOptions: {
      'multi-tenant': "tenantsArrayField: { includeDefaultField: false }, userHasAccessToAllTenants: (user) => (user as { role?: string } | null)?.role === 'super-admin'",
      ecommerce: "products: { productsCollectionOverride: ({ defaultCollection }) => ({ ...defaultCollection, admin: { ...defaultCollection.admin, useAsTitle: 'title' }, fields: [{ name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', unique: true, index: true }, { name: 'description', type: 'textarea' }, { name: 'organisation', type: 'text' }, { name: 'use', type: 'textarea' }, { name: 'licence', type: 'text', defaultValue: 'CC-BY-NC-ND-4.0' }, { name: 'billedAccount', type: 'text' }, { name: 'cloudflareAccountId', type: 'text' }, { name: 'royalty', type: 'json' }, ...defaultCollection.fields] }) }",
      seo: "uploadsCollection: 'media', generateTitle: ({ doc }) => seoTitleOf(doc), generateDescription: ({ doc }) => seoDescriptionOf(doc), generateURL: ({ doc }) => seoURLOf(doc)",
    },
    imports: ['seoTitleOf', 'seoDescriptionOf', 'seoURLOf'].map((name) => ({ name, from: './collections/Docs' })),
    // the frontend is the app's: its layout, the (pages) group and the blocks; the template's sample routes are not written
    own: ['page.tsx', 'layout.tsx', 'site.ts', 'docs/[slug]/page.tsx'].map((f) => `${SRC}/app/(frontend)/${f}`),
    origins: ['https://qpu.uuidna.com'],
    typescriptOutput: `./${SRC}/payload-types.ts`,
    frontend: { collection: 'docs', route: 'docs', html: 'html' },
    seed: { name: 'seed', from: './seed' },
    preload: ['./utilities/workers-crypto'],
    wrangler: REPO_WRANGLER,
    worker: REPO_WORKER,
  },
}
// the site's folders under src, beside the library's (core, mcp, quantum, …): the app compiles them, the library skips them
const SITE = ['access', 'app', 'blocks', 'collections', 'components', 'css', 'fields', 'globals', 'providers', 'receipts', 'seed', 'utilities']
const SITE_FILES = ['payload.config.ts', 'payload-types.ts']
// the app's TypeScript: src as payloadcms/website keeps it (@/ is src), @root/ the repository, @uuidna/qpu this build
const REPO_TSCONFIG = {
  compilerOptions: {
    target: 'ES2022', lib: ['dom', 'dom.iterable', 'esnext'], module: 'esnext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: true, noEmit: true,
    skipLibCheck: true, esModuleInterop: true, resolveJsonModule: true, isolatedModules: true, incremental: true, allowJs: true,
    types: ['@cloudflare/workers-types', 'node'], plugins: [{ name: 'next' }],
    paths: { '@/*': [`./${SRC}/*`], '@root/*': ['./*'], '@payload-config': [`./${SRC}/payload.config.ts`], '@uuidna/qpu': ['./dist/quantum/processing/unit/index'], '@uuidna/qpu/payload': ['./dist/db/payload-qpu'], '@uuidna/qpu/*': ['./dist/*'] },
  },
  include: ['next-env.d.ts', ...SITE_FILES.map((f) => `${SRC}/${f}`), ...SITE.flatMap((d) => [`${SRC}/${d}/**/*.ts`, `${SRC}/${d}/**/*.tsx`]), '.next/types/**/*.ts', '.next/dev/types/**/*.ts'],
  exclude: ['node_modules', 'dist', '.open-next', '**/*.test.ts'],
}
// THE IMAGE, FROM THE SAME SPEC: the Dockerfile, compose file and Kubernetes manifest derive from package.json (name,
// version, licence, author, repository, the Node line engines names, what `files` ships) and the unit (the port the boot
// listens on, the flags it answers). Nothing about the image is written by hand.
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const REPO_IMAGE = {
  name: pkg.name, version: pkg.version, license: pkg.license, author: `${pkg.author.name} <${pkg.author.email}>`,
  repository: pkg.repository.url.replace(/^git\+/, '').replace(/\.git$/, ''), homepage: pkg.homepage,
  node: Number(/\d+/.exec(pkg.engines.node)[0]), port: bootPort, boot: pkg.bin['qpu-boot'].replace(/^\.\//, ''), health: '--health', prove: '--prove',
  ship: ['LICENSE', 'README.md', 'CITATION.cff', 'mcp.json', 'install.json'].filter((f) => fs.existsSync(f)),
  image: `ghcr.io/${pkg.repository.url.replace(/^git\+https:\/\/github\.com\//, '').replace(/\.git$/, '')}`,
}
if (process.argv.includes('--repo')) {
  const t = PayloadTemplates.cloudflarePayload(cloudflareCombinationOf(REPO.key), REPO_NAME, REPO.app)
  const image = { ...PayloadTemplates.dockerPayload(REPO_IMAGE).files, ...PayloadTemplates.kubernetesPayload(REPO_IMAGE).files }
  // the theme from the lattice and the host; the committed receipts as a registry the seed and the site read
  const receiptFiles = fs.readdirSync('.').filter((f) => /-receipt\.json$/.test(f)).sort()
  const ident = (f) => f.replace(/-receipt\.json$/, '').replace(/-(\w)/g, (_, c) => c.toUpperCase())
  const site = {
    [`${SRC}/css/theme.css`]: themeCssOf(qpuCiteOf().website),
    [`${SRC}/receipts/index.ts`]: [
      '// Generated by scripts/payload-cloudflare.mjs from the committed *-receipt.json files — regenerate, do not edit',
      ...receiptFiles.map((f) => `import ${ident(f)} from '../../${f}'`),
      '',
      'export type Receipt = { file: string; name: string; doc: Record<string, unknown> }',
      '/** The committed receipts: `file` as committed (heat-receipt.json), `name` the page it makes (heat-receipt). */',
      `export const receipts: Receipt[] = [${receiptFiles.map((f) => `{ file: '${f}', name: '${f.replace(/\.json$/, '')}', doc: ${ident(f)} as Record<string, unknown> }`).join(', ')}]`,
      '',
    ].join('\n'),
  }
  // the library's tsconfig skips the site's folders, read from the same list
  const lib = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'))
  lib.exclude = [...new Set([...lib.exclude.filter((x) => !x.startsWith(`${SRC}/`) || x.startsWith(`${SRC}/autonomous`)), ...SITE.map((d) => `${SRC}/${d}/**`), ...SITE_FILES.map((f) => `${SRC}/${f}`)])]
  // the bundler keeps a bare import only when package.json's sideEffects names its file: the list is the registry's
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const kept = (pkg.sideEffects ?? []).filter((f) => !f.startsWith('./dist/'))
  pkg.sideEffects = [...kept, './dist/mcp/families.js', ...registering.map((e) => `./dist/${e.from.startsWith('../') ? e.from.slice(3) : `mcp/${e.from.slice(2)}`}`)]
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n')
  const written = { ...t.files, ...image, ...site, [REPO_WRANGLER]: t.files['wrangler.jsonc'], // written as next build writes it back (react-jsx, its dev types, two spaces), so a build leaves it unchanged
    'tsconfig.payload.json': JSON.stringify(REPO_TSCONFIG, null, 2) + '\n', 'tsconfig.json': JSON.stringify(lib, null, 2) + '\n' }
  if (REPO_WRANGLER !== 'wrangler.jsonc') delete written['wrangler.jsonc']
  for (const [f, text] of Object.entries(written)) {
    fs.mkdirSync(path.dirname(f), { recursive: true })
    fs.writeFileSync(f, text)
  }
  // the registries just written are read by the config and the frontend: the import map and the types follow them
  for (const cmd of ['generate:importmap', 'generate:types']) execSync(`npx payload ${cmd}`, { cwd: ROOT, stdio: 'pipe', env: { ...process.env, PAYLOAD_CONFIG_PATH: `${SRC}/payload.config.ts` } })
  const uuid = qpuContentUuidOf({ ...REPO, image: REPO_IMAGE })
  const row = { key: REPO.key, uuid, image: REPO_IMAGE.image, receipt: qpuUuidReceiptOf('payload-cf repo', uuid, REPO.key, 'scripts/payload-cloudflare.mjs --repo').uuid, files: Object.keys(written), dependencies: t.dependencies }
  // the app compiled against the installed packages, exactly as next build checks it
  let out = ''
  try { execSync('npx tsc -p tsconfig.payload.json --noEmit --incremental false', { cwd: ROOT, stdio: 'pipe' }) } catch (e) { out = `${e.stdout}${e.stderr}` }
  const errors = out.split('\n').filter((l) => /error TS\d+/.test(l))
  console.log(JSON.stringify({ regenerated: row, typecheck: { errors: errors.length, first: errors.slice(0, vertices) } }, null, 1))
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
const axes = { runtime: new Set(), db: new Set(), storage: new Set(), email: new Set(), frontend: new Set() }
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

// The API combination count is SEALED BY THE FAMILY, not just counted: the combinatorics family's power-set formula
// binomial(n) = 2ⁿ gives the plugin subsets, times the axis cardinalities. The enumerator and the family must agree —
// a mismatch means the plugin axis drifted from what the family computes, and the run fails rather than ship a wrong count.
const binomialUuid = qpuHexUuidOf({ family: 'combinatorics', program: ['binomial'], params: [CLOUDFLARE_PLUGINS.length] })
const binomial = await qpuHexRunOf(binomialUuid)
const pluginSubsets = binomial.value
const familyCombinations = axes.runtime.size * axes.db.size * axes.storage.size * axes.email.size * axes.frontend.size * pluginSubsets
if (!(binomial.holds === true) || familyCombinations !== total)
  throw new Error(`payload-cf combinatorics drift: family ${familyCombinations} (2^${CLOUDFLARE_PLUGINS.length}=${pluginSubsets} × axes) ≠ enumerated ${total} (holds ${binomial.holds})`)

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
// FRONTEND AXIS, STRICTLY GENERATED: each frontend delivers its own files over the same (frontend-independent, already
// type-checked) backend. A representative opennext combination is generated per frontend and the shell files it must
// carry are asserted present — next the React app, shadcn its Tailwind/shadcn setup, pwa its manifest and worker,
// vitepress its alternative static frontend.
const expectOf = {
  next: ['app/(frontend)/layout.tsx', 'app/(frontend)/page.tsx'],
  shadcn: ['components.json', 'app/(frontend)/globals.css', 'lib/utils.ts', 'postcss.config.mjs'],
  pwa: ['public/manifest.webmanifest', 'public/sw.js', 'public/icon.svg'],
}
// every alternative framework must generate exactly the files its own table declares — derived, so it never drifts
const probeCtx = { name: 'demo', head: '//', collection: 'pages', html: 'html', theme: '#000' }
for (const [fw, def] of Object.entries(ALT_FRONTENDS)) expectOf[fw] = Object.keys(def.files(probeCtx))
const frontends = CLOUDFLARE_FRONTENDS.map((frontend) => {
  const files = Object.keys(PayloadTemplates.cloudflarePayload({ runtime: 'opennext', db: 'qpu-raid', storage: 'r2', email: 'none', frontend, plugins: ['seo'] }).files)
  const missing = (expectOf[frontend] ?? []).filter((f) => !files.includes(f))
  return { frontend, files: files.length, ok: missing.length === 0, missing }
})

const stream = qpuReceiptStreamsOf(0).streams.find((s) => s.stream === 'payload-cf')
const receipt = {
  kind: 'payload-cf-receipt',
  when: new Date().toISOString().slice(0, tenOf(1)),
  axes: Object.fromEntries(Object.entries(axes).map(([k, v]) => [k, [...v]])),
  plugins: [...CLOUDFLARE_PLUGINS],
  combinations: total,
  combinatorics: { pluginSubsets, familyCombinations, formula: `2^${CLOUDFLARE_PLUGINS.length} × axes`, by: binomialUuid, holds: binomial.holds === true && familyCombinations === total },
  typechecked: { bases: bases.length, compiled: tsc === '' || errors.length > unattributed.length || unattributed.length === 0, ok: byBase.filter((b) => b.ok).length, unattributed: unattributed.slice(0, 5), failing: byBase.filter((b) => !b.ok) },
  frontends: { axis: [...CLOUDFLARE_FRONTENDS], ok: frontends.every((fr) => fr.ok), each: frontends },
  coverage: 'each base compiled with no plugins and with all plugins; plugins are independent Plugin calls, so every subset of a compiling base compiles; each frontend generates its own shell files over the frontend-independent config',
  stream: stream && { length: stream.length, head: stream.head, chain: stream.chain, holds: stream.holds },
}
fs.writeFileSync('payload-cf-receipt.json', JSON.stringify(receipt, null, 1) + '\n')
console.log(JSON.stringify({ ...receipt, typechecked: { ...receipt.typechecked, failing: receipt.typechecked.failing.slice(0, 4) } }, null, 1))
