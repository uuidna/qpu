/**
 * QPU PORTS payloadcms/website FOR DEPLOYMENT, AND SERVES ITS FRONTEND FROM THE LEAN SURFACE. The families ported the
 * template's globals, collections and plugin suite for the CMS and deployment (the payload structure is kept, not
 * bypassed), but the public frontend is rendered from the lean surface — docs, families and the unit's qpuPageOf, not
 * Payload blocks — because the content is generated from the code and the Payload worker's init exceeds the Worker
 * budget. This holds that design: the deployment surface is ported, and the catch-all renders the families' own views.
 * Read from the filesystem, token-free. Discovered by the scripts/*.test.mjs glob, run by the one gate.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')
const has = (d, name) => existsSync(join(ROOT, d, name)) || existsSync(join(ROOT, d, `${name}.ts`)) || existsSync(join(ROOT, d, `${name}.tsx`))
const read = (f) => (existsSync(join(ROOT, f)) ? readFileSync(join(ROOT, f), 'utf8') : '')

test('ports the payloadcms/website deployment surface: globals, collections, plugins', () => {
  for (const g of ['Header', 'Footer']) assert.ok(has('src/globals', g), `the website global ${g} is ported`)
  for (const c of ['Pages', 'Posts', 'Categories', 'Users']) assert.ok(has('src/collections', c), `the website collection ${c} is ported`)
  const cfg = read('src/payload.config.ts')
  for (const p of ['seoPlugin', 'nestedDocsPlugin', 'redirectsPlugin', 'searchPlugin', 'formBuilderPlugin']) assert.match(cfg, new RegExp(p), `the website plugin ${p} is configured`)
})

test('the frontend is the lean surface, not Payload blocks: the catch-all renders the families\' own views', () => {
  const slug = read('src/app/(frontend)/(pages)/[...slug]/page.tsx')
  assert.ok(slug, 'the [...slug] catch-all exists')
  // the public content is served from the lean surface (docs, families, the unit's qpuPageOf), deliberately not RenderBlocks
  for (const view of ['DocView', 'FamilyView', 'ProgramView']) assert.match(slug, new RegExp(view), `the catch-all renders ${view} (the lean surface)`)
  assert.doesNotMatch(slug, /RenderBlocks/, 'the catch-all serves the lean surface, not the Payload block renderer')
  for (const c of ['Doc', 'Family', 'Program']) assert.ok(has('src/components', c), `the lean-surface component ${c} is present`)
})
