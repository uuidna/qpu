#!/usr/bin/env node
/**
 * WHAT IS STILL OPEN, GATHERED RATHER THAN ASKED.
 *
 * Every question put to a person is a gap where the tree should have answered. This session asked three —
 * commit or stash the dirty uuidna tree, public or private for school's remote, and how to supply the write
 * token — and all three were already decidable from the tree and the registries. Nobody had written the gathering
 * down, so it was done by hand, and a gathering done by hand is done once.
 *
 * Each source below answers one question and says what it OWES when the answer is no. The shape is the uuidna
 * leads gate's: {source, reached, why, settled, open:[{source, what, owes}]}. Feed this straight to
 * check_release_readiness, or read it here.
 *
 * THREE STATES, NOT TWO, AND THE THIRD IS THE POINT. A registry that refuses, a host that times out, a sibling
 * checkout that is absent — none of those is "no lead". They are UNREACHED, and an unreached source blocks a
 * release rather than passing it, because a release is the act of saying the tree is what it claims.
 *
 *   node scripts/leads.mjs            every source
 *   node scripts/leads.mjs --json     the gate's input, verbatim
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const SIBLINGS = resolve(ROOT, '..')
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
const cff = (() => { try { return readFileSync(join(ROOT, 'CITATION.cff'), 'utf8') } catch { return '' } })()

const git = (cwd, ...args) => {
  try { return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { return null }
}
const get = async (url, headers = {}) => {
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'uuidna-leads', ...headers } })
    return { ok: res.ok, status: res.status, body: res.ok ? await res.json() : undefined }
  } catch (error) { return { ok: false, status: 0, error: String(error) } }
}

const sources = []
const add = (source, reached, why, open = []) =>
  sources.push({ source, reached, why, settled: reached && open.length === 0 ? 1 : 0, open })

/* ── the packages this deployment installs, and whether a registry can serve them ───────────────────────────── */
const localOf = (name) => {
  const dir = join(SIBLINGS, name)
  const manifest = join(dir, 'package.json')
  return existsSync(manifest) ? { dir, ...JSON.parse(readFileSync(manifest, 'utf8')) } : null
}

for (const folder of ['qpu', 'school', 'uuidna']) {
  const local = localOf(folder)
  if (!local) { add(`local:${folder}`, false, 'no checkout beside this one', []); continue }
  const registry = await get(`https://registry.npmjs.org/${local.name}`)

  if (registry.status === 0) {
    add(`npm:${local.name}`, false, `registry unreachable (${registry.error})`)
  } else if (registry.status === 404) {
    add(`npm:${local.name}`, true, 'the registry has never served this package', [
      { source: `npm:${local.name}`, what: `${local.name} is not published`, owes: 'a first publish; anything depending on it by file: path cannot install anywhere else' },
    ])
  } else if (!registry.ok) {
    add(`npm:${local.name}`, false, `registry answered ${registry.status}`)
  } else {
    const served = Object.keys(registry.body.versions ?? {})
    const open = served.includes(local.version)
      ? []
      : [{ source: `npm:${local.name}`, what: `the working tree is ${local.version}; the registry serves ${registry.body['dist-tags']?.latest}`, owes: `publish ${local.version}` }]
    add(`npm:${local.name}`, true, `registry serves ${served.length} version(s), latest ${registry.body['dist-tags']?.latest}`, open)
  }

  /* A RELEASE CANNOT BE CUT FROM A DIRTY TREE, and release-cut says so and exits 1 — but the feed recorded only
   * "FAIL cut v0.3.1" with no reason, so the reason had to be looked up by a person. It is a lead now. */
  const dirty = git(local.dir, 'status', '--porcelain')
  const remote = git(local.dir, 'remote', 'get-url', 'origin')
  const ahead = git(local.dir, 'rev-list', '--count', 'origin/main..HEAD')
  const open = []
  if (dirty === null) open.push({ source: `git:${folder}`, what: 'not a git checkout', owes: 'a repository' })
  else if (dirty) open.push({ source: `git:${folder}`, what: `${dirty.split('\n').length} uncommitted file(s) — release-cut refuses a dirty tree`, owes: 'commit or restore them; they are somebody’s in-flight work until they say otherwise' })
  if (!remote) open.push({ source: `git:${folder}`, what: 'no git remote', owes: 'a remote; without one there is no CI, no Release, and no npm provenance, and any sibling depending on it by file: path cannot build off this machine' })
  if (ahead && ahead !== '0') open.push({ source: `git:${folder}`, what: `${ahead} commit(s) not pushed`, owes: 'a push; a deploy that triggers on push has not seen them' })
  add(`git:${folder}`, dirty !== null, remote ? `remote ${remote}` : 'local only', open)
}

/* ── the archive, which mints a DOI from a GitHub Release ───────────────────────────────────────────────────── */
const conceptRecid = (cff.match(/description:\s*All versions[\s\S]*?value:\s*10\.\d+\/zenodo\.(\d+)/) ?? [])[1]
if (!conceptRecid) add('zenodo', true, 'CITATION.cff names no concept DOI', [])
else {
  const hits = (await get(`https://zenodo.org/api/records?q=conceptdoi:%2210.5281/zenodo.${conceptRecid}%22&size=100`, { accept: 'application/json' })).body?.hits?.hits
  if (!hits) add('zenodo', false, 'zenodo would not answer — a refusal is not an answer about the archive')
  else {
    const held = hits.map((h) => String(h.metadata?.version ?? '').replace(/^v/, ''))
    add('zenodo', true, `the archive holds ${held.join(', ') || 'no versioned record'}`,
      held.includes(pkg.version) ? [] : [{ source: 'zenodo', what: `${pkg.version} is not archived`, owes: 'a published GitHub Release for the tag; Zenodo mints the DOI from it' }])
  }
}

/* ── the host, which is the only source that can say the deployment is well ─────────────────────────────────── */
const origin = 'https://qpu.uuidna.com'
const storage = await get(`${origin}/storage`)
if (!storage.ok) add(`live:${origin}`, false, `the host answered ${storage.status || storage.error}`)
else {
  const monitor = storage.body.monitor ?? {}
  add(`live:${origin}`, true, `storage answers; holds ${storage.body.holds}`,
    storage.body.holds ? [] : [{
      source: `${origin}/storage`,
      what: `monitor holds false — ${monitor.missing ?? '?'} link(s) missing shares of ${monitor.keys ?? '?'}`,
      owes: 'maintain, bounded, until remaining is 0 — it needs the write token the worker already holds',
    }])
}

/* ── report ─────────────────────────────────────────────────────────────────────────────────────────────────── */
if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ sources }, null, 2))
  process.exit(0)
}

const open = sources.flatMap((s) => s.open)
const unreached = sources.filter((s) => !s.reached).map((s) => s.source)

console.log(`\nLEADS — ${sources.length} source(s) asked\n`)
for (const s of sources) {
  const mark = !s.reached ? '?' : s.open.length === 0 ? '✓' : '✗'
  console.log(`  ${mark}  ${s.source.padEnd(26)} ${s.why}`)
  for (const lead of s.open) console.log(`       ⤷ ${lead.what}\n         owes: ${lead.owes}`)
}

console.log(
  open.length === 0 && unreached.length === 0
    ? `\n✓ nothing open across ${sources.length} source(s)\n`
    : `\n✗ ${open.length} lead(s) open, ${unreached.length} source(s) unreached\n`,
)
process.exit(open.length === 0 && unreached.length === 0 ? 0 : 1)
