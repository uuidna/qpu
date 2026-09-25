#!/usr/bin/env node
/**
 * IS THE RELEASE ACTUALLY LIVE — in npm, on GitHub, and in Zenodo?
 *
 * publish.yml does three things and confirms none of them. It creates a GitHub Release, publishes to npm with
 * provenance, and exits green on the fact that the COMMANDS returned zero. That is a different claim from the
 * release being reachable: npm's PUT can succeed while the version is not yet served by the registry, a
 * provenance attestation is a separate object that can be absent from a publish that otherwise worked, and
 * Zenodo archives through a GitHub webhook that fires minutes later and can silently not fire at all.
 *
 * The drift this exists to catch is already in the tree. CITATION.cff says `version: 0.1.3` and its own archive
 * identifier says "Archived version 0.1.1" — two releases went out and the archive has one of them. Nothing
 * reported that, because nothing was asking.
 *
 * THREE OUTCOMES, NOT TWO. A check is `live`, `waiting`, or `unverifiable`, and the third is not a failure:
 * Zenodo's API shape has changed before and an unauthenticated GitHub API call is rate-limited, so "this host
 * would not answer" must not be reported as "the release is missing". Only a check that definitively answered
 * "not there" after the whole budget fails the run. The same rule the rest of this package keeps — an absent
 * instrument voids, it does not disagree.
 *
 *   node scripts/verify-release.mjs             the version in package.json
 *   node scripts/verify-release.mjs 0.1.4       a version named explicitly
 *
 *   VERIFY_ATTEMPTS  how many rounds before giving up (default 30)
 *   VERIFY_EVERY_MS  pause between rounds        (default 10000)
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
const cff = readFileSync(join(ROOT, 'CITATION.cff'), 'utf8')

const version = process.argv[2] ?? pkg.version
const name = pkg.name
const repo = (pkg.repository?.url ?? '').replace(/^git\+/, '').replace(/\.git$/, '').replace('https://github.com/', '')
/** The "All versions" DOI — the concept record every version is archived under. Read from CITATION.cff so the
 *  citation and the check cannot name different archives. */
const conceptDoi = (cff.match(/description:\s*All versions[\s\S]*?value:\s*(10\.\d+\/zenodo\.(\d+))/) ?? [])[1]
const conceptRecid = (cff.match(/description:\s*All versions[\s\S]*?value:\s*10\.\d+\/zenodo\.(\d+)/) ?? [])[1]

const ATTEMPTS = Number(process.env.VERIFY_ATTEMPTS ?? 30)
const EVERY_MS = Number(process.env.VERIFY_EVERY_MS ?? 10_000)

const LIVE = 'live'
const WAITING = 'waiting'
const UNVERIFIABLE = 'unverifiable'

const get = async (url, headers = {}) => {
  try {
    const response = await fetch(url, { headers: { 'user-agent': `${name} verify-release`, ...headers } })
    return { ok: response.ok, status: response.status, body: response.ok ? await response.json() : undefined }
  } catch (error) {
    return { ok: false, status: 0, error: String(error) }
  }
}

/** The registry serves the version. Not "the PUT returned 200" — the thing a consumer would install. */
const npmLive = async () => {
  const r = await get(`https://registry.npmjs.org/${name}`)
  if (r.status === 0) return { state: UNVERIFIABLE, why: `registry unreachable (${r.error})` }
  if (r.status === 404) return { state: WAITING, why: 'the registry has no such package yet' }
  if (!r.ok) return { state: UNVERIFIABLE, why: `registry answered ${r.status}` }
  const have = Object.keys(r.body.versions ?? {})
  if (!have.includes(version)) return { state: WAITING, why: `registry serves ${have.slice(-3).join(', ') || 'nothing'}, not ${version}` }
  return { state: LIVE, why: `${name}@${version}, tarball ${r.body.versions[version].dist?.tarball?.split('/').pop()}` }
}

/** publish.yml passes --provenance. The attestation is a SEPARATE object, so a publish can succeed without one
 *  and the package then carries no verifiable link to the workflow that built it. */
const npmProvenance = async () => {
  const r = await get(`https://registry.npmjs.org/-/npm/v1/attestations/${name}@${version}`)
  if (r.status === 0) return { state: UNVERIFIABLE, why: `registry unreachable (${r.error})` }
  if (r.status === 404) return { state: WAITING, why: 'no attestation served for this version' }
  if (!r.ok) return { state: UNVERIFIABLE, why: `attestations answered ${r.status}` }
  const kinds = (r.body.attestations ?? []).map((a) => a.predicateType ?? a.predicate_type).filter(Boolean)
  return kinds.length
    ? { state: LIVE, why: kinds.join(', ') }
    : { state: WAITING, why: 'an attestations document with no attestation in it' }
}

/** The Release is what Zenodo archives, so its absence explains a missing archive rather than being a second
 *  independent fault. Unauthenticated when no token is present, which is rate-limited — hence unverifiable. */
const githubRelease = async () => {
  if (!repo) return { state: UNVERIFIABLE, why: 'package.json names no repository' }
  const token = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN
  const r = await get(`https://api.github.com/repos/${repo}/releases/tags/v${version}`, token ? { authorization: `Bearer ${token}` } : {})
  if (r.status === 0) return { state: UNVERIFIABLE, why: `github unreachable (${r.error})` }
  if (r.status === 404) return { state: WAITING, why: `no release tagged v${version}` }
  if (r.status === 403 || r.status === 429) return { state: UNVERIFIABLE, why: 'github rate-limited this check' }
  if (!r.ok) return { state: UNVERIFIABLE, why: `github answered ${r.status}` }
  return { state: LIVE, why: `${r.body.tag_name}${r.body.draft ? ' (DRAFT — Zenodo archives published releases only)' : ''}` }
}

/** A record for THIS version under the concept DOI. Asked by version rather than by "is there any record",
 *  because the concept record always answers and answering is not archiving. */
const zenodoArchived = async () => {
  if (!conceptRecid) return { state: UNVERIFIABLE, why: 'CITATION.cff names no "All versions" DOI' }

  /**
   * THREE SHAPES, BECAUSE ZENODO ANSWERS DIFFERENTLY TO DIFFERENT CALLERS. Measured 2026-09-25 from this
   * machine: the same query returned 200 to curl and 400 to node's fetch minutes apart, `all_versions=true` is
   * rejected outright with 400 by InvenioRDM, and a plain record fetch came back 403 — bot protection, not a
   * missing archive. A runner may well get through where this host does not, so each shape is tried and only a
   * shape that ANSWERS decides anything.
   */
  const shapes = [
    // The concept record redirects to the newest version — cheapest, and enough when the release is the latest.
    { url: `https://zenodo.org/api/records/${conceptRecid}`, pick: (b) => (b.metadata?.version ? [b] : undefined) },
    // The full list. No all_versions: InvenioRDM 400s on it.
    { url: `https://zenodo.org/api/records?q=conceptdoi:%22${conceptDoi}%22&size=100`, pick: (b) => b.hits?.hits },
    { url: `https://zenodo.org/api/records?q=%22${repo}%22&size=100`, pick: (b) => b.hits?.hits },
  ]

  const refusals = []
  for (const shape of shapes) {
    const r = await get(shape.url, { accept: 'application/json' })
    if (!r.ok) { refusals.push(r.status || 'unreachable'); continue }
    const hits = shape.pick(r.body)
    if (!hits) { refusals.push('answered without records'); continue }
    const found = hits.find((h) => String(h.metadata?.version ?? '').replace(/^v/, '') === version)
    if (found) return { state: LIVE, why: `${found.doi} — ${found.metadata.version}` }
    const known = hits.map((h) => h.metadata?.version).filter(Boolean)
    return { state: WAITING, why: `the archive holds ${known.join(', ') || 'no versioned record'}, not ${version}` }
  }
  return { state: UNVERIFIABLE, why: `zenodo refused every shape (${refusals.join(', ')}) — not an answer about ${version}` }
}

/**
 * The citation must name the version being released, or every downstream cite points at a different artefact.
 *
 * A RELEASE-TIME GATE, NOT A LIVENESS ONE, and the difference matters because this script is run both ways.
 * CITATION.cff tracks the WORKING TREE: while 0.1.4 is being prepared it correctly says 0.1.4, and the weekly
 * re-check of the last tag would then report a perfectly live 0.1.2 as incomplete — every week, for doing the
 * normal thing. A check that cries wolf gets switched off, and then it is not checking anything at all. So it
 * answers only when the version asked about is the one the tree is holding, which is exactly the publish case.
 */
const citationAgrees = async () => {
  const stated = (cff.match(/^version:\s*(.+)$/m) ?? [])[1]?.trim()
  if (version !== pkg.version) {
    return { state: UNVERIFIABLE, why: `not asked: CITATION.cff tracks the working tree (${stated}), and ${version} is a past release` }
  }
  return stated === version
    ? { state: LIVE, why: `CITATION.cff version: ${stated}` }
    : { state: WAITING, why: `CITATION.cff says version: ${stated}, this release is ${version}` }
}

const CHECKS = [
  ['npm serves the version', npmLive],
  ['npm provenance attestation', npmProvenance],
  ['github release for the tag', githubRelease],
  ['zenodo archived this version', zenodoArchived],
  ['CITATION.cff names this version', citationAgrees],
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

console.log(`\nRELEASE ${name}@${version}${repo ? ` (${repo})` : ''}\n`)

const settled = new Map()
for (let round = 1; round <= ATTEMPTS; round++) {
  for (const [label, check] of CHECKS) {
    if (settled.get(label)?.state === LIVE) continue
    settled.set(label, await check())
  }
  const pending = CHECKS.filter(([label]) => settled.get(label).state === WAITING)
  if (pending.length === 0) break
  if (round < ATTEMPTS) {
    console.log(`  round ${round}: waiting on ${pending.map(([l]) => l).join(', ')}`)
    await sleep(EVERY_MS)
  }
}

let waiting = 0
for (const [label] of CHECKS) {
  const { state, why } = settled.get(label)
  const mark = state === LIVE ? '✓' : state === UNVERIFIABLE ? '?' : '✗'
  console.log(`  ${mark}  ${label.padEnd(34)} ${why}`)
  if (state === WAITING) waiting++
}

// UNVERIFIABLE DOES NOT FAIL THE RUN. A host that would not answer has told us nothing, and reporting nothing as
// a missing release is how a green pipeline starts lying in the other direction.
console.log(
  waiting === 0
    ? `\n✓ release ${version} is complete and live\n`
    : `\n✗ release ${version} is INCOMPLETE — ${waiting} check(s) never went live after ${ATTEMPTS} round(s)\n`,
)
process.exit(waiting === 0 ? 0 : 1)
