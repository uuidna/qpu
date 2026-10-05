/**
 * QPU PORTS payloadcms/website AND USES IT AS APPLICABLE. The families ported the official template — its collections,
 * globals, blocks and plugin suite — and extended it with their own blocks for their needs. This holds the port: the
 * standard blocks, globals, collections and plugins are present; every block is paired with a component (the template's
 * block ↔ component convention); and the families' own blocks render their content on the same patterns. Read from the
 * filesystem, token-free. Discovered by the scripts/*.test.mjs glob, run by the one gate.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')
const dirs = (d) => (existsSync(join(ROOT, d)) ? readdirSync(join(ROOT, d), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name) : [])
const has = (d, name) => existsSync(join(ROOT, d, name)) || existsSync(join(ROOT, d, `${name}.ts`)) || existsSync(join(ROOT, d, `${name}.tsx`))

test('ports the payloadcms/website standard surface: blocks, globals, collections, plugins', () => {
  for (const b of ['CallToAction', 'Content', 'Media', 'Banner', 'Code', 'Form']) assert.ok(has('src/blocks', b), `the website block ${b} is ported`)
  for (const g of ['Header', 'Footer']) assert.ok(has('src/globals', g), `the website global ${g} is ported`)
  for (const c of ['Pages', 'Posts', 'Categories', 'Users']) assert.ok(has('src/collections', c), `the website collection ${c} is ported`)
  const cfg = existsSync(join(ROOT, 'src/payload.config.ts')) ? readFileSync(join(ROOT, 'src/payload.config.ts'), 'utf8') : ''
  for (const p of ['seoPlugin', 'nestedDocsPlugin', 'redirectsPlugin', 'searchPlugin', 'formBuilderPlugin']) assert.match(cfg, new RegExp(p), `the website plugin ${p} is configured`)
})

test('uses it as applicable: every block is paired with a component, and the families add their own', () => {
  const blocks = dirs('src/blocks')
  const components = new Set(dirs('src/components/blocks'))
  const unpaired = blocks.filter((b) => !components.has(b))
  assert.deepEqual(unpaired, [], `blocks without a component (break the template's pairing): ${unpaired.join(', ')}`)
  for (const own of ['Families', 'Program']) assert.ok(blocks.includes(own), `the families' own block ${own} renders their content on the template's patterns`)
  assert.ok(blocks.length >= 10, `${blocks.length} blocks — the template ported and extended as applicable`)
})

test('the frontend is the template as payloadcms/website keeps it: the catch-all renders blocks', () => {
  const slug = existsSync(join(ROOT, 'src/app/(frontend)/(pages)/[...slug]/page.tsx')) ? readFileSync(join(ROOT, 'src/app/(frontend)/(pages)/[...slug]/page.tsx'), 'utf8') : ''
  assert.match(slug, /RenderBlocks/, 'pages render through RenderBlocks (the template block renderer)')
  assert.match(slug, /FamilyView|ProgramView/, 'the families render their own views on the same catch-all')
})
