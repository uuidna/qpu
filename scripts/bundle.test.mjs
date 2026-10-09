/**
 * THE BUNDLE IS ALWAYS COMPLETE. @uuidna/qpu 1.0.0 shipped unimportable once: the files list excluded
 * dist/**​/readme.js, which dist/.../index.js imports, so `import('@uuidna/qpu')` and `qpu-boot --prove` threw
 * ERR_MODULE_NOT_FOUND from the published tarball while the same code proved itself from the repo. This gate makes that
 * impossible: it walks the runtime import graph from every published dist entry point (exports + bin) and asserts that
 * no module the graph reaches is dropped by a package.json `files` exclusion, and that an explicit .js/.mjs import
 * resolves on disk. An imported-but-excluded module fails the gate, here, before a publish.
 * Needs dist — run `npm run build` first. Discovered by the scripts/*.test.mjs glob, run in CI.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'))

// package.json `files` exclusions (the `!…` globs) as matchers over repo-relative POSIX paths.
const globToRegExp = (glob) =>
  new RegExp(
    '^' +
      glob
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*\*\//g, '\u0000') // **/ → any depth of directories (or none)
        .replace(/\*\*/g, '\u0001') // trailing ** → anything, files included
        .replace(/\*/g, '[^/]*')
        .replace(/\u0000/g, '(?:.*/)?')
        .replace(/\u0001/g, '.*') +
      '$',
  )
const excluded = pkg.files.filter((f) => f.startsWith('!')).map((f) => ({ glob: f.slice(1), re: globToRegExp(f.slice(1)) }))
const isExcluded = (rel) => excluded.find((e) => e.re.test(rel))

// Every published dist entry point: the exports map and the bin scripts (the runtime .js under dist/). worker.js is the
// Cloudflare shim that pulls the opennext build bundle (not an npm module graph) and is left out.
const under = (v) => typeof v === 'string' && /\.js$/.test(v) && !v.includes('*') && /(^|\/)dist\//.test(v)
const entries = [...Object.values(pkg.exports ?? {}).map((v) => (typeof v === 'string' ? v : (v?.import ?? v?.default))), ...Object.values(pkg.bin ?? {}), pkg.main]
  .filter(under)
  .map((v) => path.normalize(v.replace(/^\.\//, '')))

// Relative import/export/dynamic-import/require specifiers. Only edges that RESOLVE to a real .js/.mjs on disk are
// followed — an unresolved specifier is a template string the generators emit (payload-cloudflare writes Next admin
// pages as text), not a runtime module edge, so it is ignored rather than mistaken for a gap.
const SPEC = /(?:\bfrom|\bimport|\brequire)\s*\(?\s*['"](\.[^'"]+)['"]/g
const resolveOf = (fromRel, spec) => {
  const target = path.normalize(path.join(path.dirname(fromRel), spec))
  if (existsSync(path.join(ROOT, target)) && /\.(?:js|mjs)$/.test(target)) return target
  if (existsSync(path.join(ROOT, target + '.js'))) return target + '.js'
  return null
}

test('the published bundle is complete: no module an entry point imports is dropped by the files exclusions', () => {
  assert.ok(entries.length > 0, 'no publishable dist entry points resolved from package.json')
  for (const e of entries) assert.ok(existsSync(path.join(ROOT, e)), `entry point ${e} is absent from disk — run npm run build`)
  const seen = new Set()
  const dropped = []
  const queue = [...entries]
  while (queue.length) {
    const rel = queue.shift()
    if (seen.has(rel) || !rel.startsWith('dist/')) continue
    seen.add(rel)
    const drop = isExcluded(rel)
    if (drop) dropped.push({ rel, by: '!' + drop.glob })
    for (const m of readFileSync(path.join(ROOT, rel), 'utf8').matchAll(SPEC)) {
      const r = resolveOf(rel, m[1])
      if (r && !seen.has(r)) queue.push(r)
    }
  }
  assert.deepEqual(dropped, [], `the tarball would DROP modules the entry points import — ERR_MODULE_NOT_FOUND on install: ${JSON.stringify(dropped)}`)
  assert.ok(seen.size > 50, `only ${seen.size} modules reached — the import walk did not traverse the package`)
})
