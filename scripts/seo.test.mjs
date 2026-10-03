/**
 * SEO — NO USELESS PREFIX IN URLS OR PATHS, THE PAYLOAD WAY. Verified against Payload's own URL API and route structure
 * (the Payload-layer modules are not in the Node dist — they build through Next/OpenNext — so this reads their source and
 * the route tree rather than a reconstructed import). Run by the one workflow (scripts/*.test.mjs):
 *   1. Payload's link field generator (hrefOf in src/fields/link.ts) sends a page/doc to /<slug> (home to /), no prefix;
 *   2. the frontend route is a group in parens (not a URL segment) serving a root catch-all — no literal /pages or /docs.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..')

test('seo: Payload link API sends a page to /<slug> with no useless prefix', () => {
  const src = readFileSync(join(ROOT, 'src/fields/link.ts'), 'utf8')
  // hrefOf is Payload's link-field URL generator: /<slug>, home at /, custom URL as written
  assert.match(src, /export const hrefOf/, 'the Payload link URL API is hrefOf')
  assert.match(src, /slug === HOME \? '\/' : `\/\$\{slug\}`/, 'a reference goes to /<slug> (home to /): one segment, no prefix')
  assert.ok(!/`\/(pages|docs|blog|content|posts)\/\$\{/.test(src), 'no dead prefix segment before the slug')
})

test('seo: the frontend route is a Payload/Next group (no URL segment) serving a catch-all slug', () => {
  assert.ok(existsSync(join(ROOT, 'src/app/(frontend)/(pages)/[...slug]')), 'content is a grouped root catch-all')
  assert.ok(!existsSync(join(ROOT, 'src/app/pages')) && !existsSync(join(ROOT, 'src/app/docs')), 'no literal /pages or /docs route prefix')
})
