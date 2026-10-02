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
