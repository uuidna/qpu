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
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const SIBLINGS = resolve(ROOT, '..')
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
const cff = (() => { try { return readFileSync(join(ROOT, 'CITATION.cff'), 'utf8') } catch { return '' } })()

const git = (cwd, ...args) => {
  try { return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() } catch { return null }
}
/* Headers by default, and `method`/`body` lifted out of them when a caller needs to POST — passing those
 * through as headers is silently accepted by fetch and produces a GET, which is the kind of wrong that looks
 * like an empty answer from the server rather than a mistake here. */
const get = async (url, { method, body, ...headers } = {}) => {
  try {
    const res = await fetch(url, {
      method: method ?? 'GET',
      ...(body === undefined ? {} : { body }),
      headers: { 'user-agent': 'uuidna-leads', ...(body === undefined ? {} : { 'content-type': 'application/json' }), ...headers },
      signal: AbortSignal.timeout(30_000),
    })
    return { ok: res.ok, status: res.status, body: res.ok ? await res.json() : undefined }
  } catch (error) { return { ok: false, status: 0, error: String(error) } }
}


/* ── THE DECISIONS, SEPARATED FROM THE GATHERING ────────────────────────────────────────────────────────────────
 *
 * The fetching and the git calls are IO and cannot be driven from a test without a network and a repository. The
 * DECISIONS can, and they are the part that is worth doubting: a detector that never fires is a gatherer that
 * always says fine. Each takes a reading and returns the leads it implies, so a test can hand it the condition
 * and check that it notices — and hand it the absence and check that it stays quiet.
 */

/** What a package owes, given what the registry serves against what the tree holds. */
export const packageLeadsOf = ({ name, version, status, served = [], latest }) => {
  if (status === 404) return [{ source: `npm:${name}`, what: `${name} is not published`, owes: 'a first publish; anything depending on it by file: path cannot install anywhere else' }]
  if (served.includes(version)) return []
  return [{ source: `npm:${name}`, what: `the working tree is ${version}; the registry serves ${latest}`, owes: `publish ${version}` }]
}

/** What a checkout owes. Each condition is independent, so a tree can owe all three at once. */
export const repoLeadsOf = ({ folder, dirty, remote, ahead }) => {
  const leads = []
  if (dirty === null) leads.push({ source: `git:${folder}`, what: 'not a git checkout', owes: 'a repository' })
  else if (dirty) leads.push({ source: `git:${folder}`, what: `${dirty.split('\n').length} uncommitted file(s) — release-cut refuses a dirty tree`, owes: 'commit or restore them; they are somebody\u2019s in-flight work until they say otherwise' })
  if (!remote) leads.push({ source: `git:${folder}`, what: 'no git remote', owes: 'a remote; without one there is no CI, no Release, and no npm provenance, and any sibling depending on it by file: path cannot build off this machine' })
  if (ahead && ahead !== '0') leads.push({ source: `git:${folder}`, what: `${ahead} commit(s) not pushed`, owes: 'a push; a deploy that triggers on push has not seen them' })
  return leads
}

/** What the archive owes for a version. */
export const archiveLeadsOf = ({ version, held = [] }) =>
  held.includes(version) ? [] : [{ source: 'zenodo', what: `${version} is not archived`, owes: 'a published GitHub Release for the tag; Zenodo mints the DOI from it' }]

/** What the host owes when its own monitor says it is unwell. */
export const hostLeadsOf = ({ origin, holds, monitor = {} }) =>
  holds ? [] : [{ source: `${origin}/storage`, what: `monitor holds false — ${monitor.missing ?? '?'} link(s) missing shares of ${monitor.keys ?? '?'}`, owes: 'maintain, bounded, until remaining is 0 — it needs the write token the worker already holds' }]

/**
 * WHERE THE TEACHING CLASSIFICATION CONTRADICTS ITSELF — AND ONLY THERE.
 *
 * qpu_train classifies each school subject against each scientific domain by the swap: entangled when both
 * directions are cited, an application when one is, undecided when neither is. The first version of this
 * detector turned every verdict that was not "entangled" into an open item, because "topology serves arts and
 * crafts; owes theory to practice" has exactly the shape of a lead.
 *
 * IT HAS THE SHAPE AND NOT THE SUBSTANCE. Crossing the corpus took that to forty-three open items, and none of
 * them can be closed: "radiocarbon dating serves history" is a correct and final answer, not a defect awaiting
 * a citation, and fifteen entangled pairs sit unseated because the lattice holds seven rays and the evidence
 * offered twenty-two — a fact about fourteen faces that nobody can fix. A queue that can never empty makes
 * `settledOf` permanently false and teaches a reader to stop opening it, which is the same fault as a gate
 * that always fails.
 *
 * So the line drawn at the deploy gate and at the storage monitor is drawn here too, for the third time: an
 * instrument that CONTRADICTS ITSELF is a lead, and what the instrument FOUND is a reading. The counts go to
 * teachingNoteOf. What is left here is small and is all genuinely wrong: a reading that does not hold, a name
 * holding two seats, or a pair turned away while a ray stands empty — which is the exact fault greedy seating
 * had and nothing noticed.
 */
export const teachingLeadsOf = ({ origin, school }) => {
  if (!school) return [{ source: `${origin}/mcp`, what: 'qpu_train served no school reading', owes: 'a train door that carries the teaching classification, or a gatherer that stops asking for it' }]
  const leads = []
  /* THE CLASSIFICATION MUST AGREE WITH ITSELF. Everything else here is a count. */
  if (school.holds !== true)
    leads.push({ source: `${origin}/mcp qpu_train`, what: 'the teaching reading does not hold — the classifier, the seating, the census or the prose disagree', owes: 'the disagreement found; the counts below are not decidable while it stands' })
  const seated = school.seating?.seated ?? []
  const crowded = school.seating?.crowded ?? []
  const names = seated.flatMap((row) => [row.subject, row.domain])
  if (new Set(names).size !== names.length)
    leads.push({ source: `${origin}/mcp qpu_train`, what: 'a name holds two seats, so the board is a list rather than a seating', owes: 'one seat per name, which is what fourteen faces means' })
  /* MAXIMAL: nothing may be turned away while both of its seats are free. Greedy failed exactly this. */
  const unseatable = crowded.filter((row) => !seated.some((held) => held.subject === row.subject || held.domain === row.domain))
  if (unseatable.length > 0 && seated.length < (school.seating?.rays ?? 7))
    leads.push({
      source: `${origin}/mcp qpu_train`,
      what: `${unseatable.length} entangled pair(s) turned away with both seats free while ${(school.seating?.rays ?? 7) - seated.length} ray(s) stand empty`,
      owes: 'a maximal seating — a rule that refuses a pair AND leaves a ray free has chosen badly, not run out of room',
    })
  return leads
}

/**
 * WHAT THE TEACHING CORPUS IS, as a sentence rather than as a queue.
 *
 * The first version emitted a lead for every pair that teaches in one direction and every pair that earned a
 * seat without getting one. With the corpus crossed that is forty-three open items, and NONE OF THEM CAN BE
 * CLOSED. "Radiocarbon dating serves history" is not a defect awaiting a citation, it is a correct and final
 * answer: history will not be teaching radiocarbon dating. Fifteen entangled pairs are unseated because the
 * lattice holds seven rays and the world offered twenty-two, which is a fact about fourteen faces and not a
 * thing anybody can fix. A queue that can never empty makes `settledOf` permanently false and teaches a reader
 * to stop looking at it, which is the same fault as a gate that always fails.
 *
 * So the same line is drawn here as at the deploy gate and the storage monitor, for the third time: an
 * instrument that CONTRADICTS ITSELF is a lead, and what the instrument FOUND is a reading. Incompleteness is
 * not a fault. It is the measurement.
 */
export const teachingNoteOf = ({ school }) => {
  if (!school) return 'qpu_train carried no school reading'
  const seated = school.seating?.seated ?? []
  const reading = school.reading ?? []
  const applied = reading.filter((row) => row.swap === 'application').length
  const entangled = reading.length - applied
  /* The share that teach both ways is the only figure here that does not move when a name is added to the
   * vocabulary — the undecided count measures how wide the grid is, which is not the same as how much is
   * unknown, and reporting it alone made a richer corpus look like a bigger hole. It is what THIS corpus
   * does not decide — never a claim that the question is unstudied, which no corpus here could support. */
  const share = entangled + applied > 0 ? Math.round((entangled * 100) / (entangled + applied)) : 0
  return `${seated.length} ray(s) seated; ${school.subjects ?? '?'} subjects x ${school.domains ?? '?'} domains = ${school.combinations ?? '?'} combinations, ${school.evidenced ?? entangled + applied} cited (${entangled} entangled, ${applied} one-way, ${share}% both ways), ${school.undecided ?? 0} this corpus does not decide; ${(school.seating?.crowded ?? []).length} entangled pair(s) have no ray`
}

/**
 * CAN THE MCP ANSWER ON ITS OWN?
 *
 * The point of this unit is that a caller gets a computed answer, not a proxy for somebody else's host. A
 * sealed door that only holds when a third party answered is not self-sufficient, and the failure is quiet:
 * it passes every day the network is good and fails on the day it is not, which this repository has already
 * paid for twice — once in the receipt that moved when CERN was down, once in a deploy blocked by a store
 * fault. A door is asked plainly here, with nothing live requested, and it must hold on its own.
 *
 * A door that does not answer at all is a different lead from one that answers and does not hold, and they
 * are kept apart because the first is an outage and the second is a defect.
 */
export const doorLeadsOf = ({ origin, doors }) => {
  if (!Array.isArray(doors) || doors.length === 0)
    return [{ source: `${origin}/mcp`, what: 'the MCP listed no sealed doors', owes: 'a tools/list that answers, or a gatherer that stops asking' }]
  const leads = []
  for (const door of doors) {
    if (door.ok !== true) {
      leads.push({ source: `${origin}/mcp ${door.name}`, what: `${door.name} did not answer (${door.why ?? 'no reason given'})`, owes: 'the door served, or the catalogue that lists it corrected' })
      continue
    }
    if (door.holds !== true)
      leads.push({
        source: `${origin}/mcp ${door.name}`,
        what: `${door.name} answers but does not hold when asked plainly, with nothing live requested`,
        owes: 'a door that computes its own answer — one that holds only when a third party replies is a proxy, not a unit',
      })
  }
  return leads
}

/** A run is settled only when every source answered AND none holds a lead. Unreached blocks; it is not silence. */
export const settledOf = (sources) =>
  sources.length > 0 && sources.every((s) => s.reached) && sources.every((s) => s.open.length === 0)

/* THE GATHERING RUNS ONLY WHEN THIS FILE IS THE COMMAND. Importing a module must not perform network IO and must
 * not call process.exit — the first version did both, so its own test could not load it, which is how the test
 * discovered the fault before any of the detectors did. */

/**
 * What a `file:` dependency owes when its installed copy has drifted from its source.
 *
 * pnpm COPIES a file: dependency rather than linking it, so a consumer silently runs a frozen snapshot of its
 * sibling. That fault surfaced three times in one day and never as itself: as `mintOf is not a function` when the
 * site called an export qpu had just added, as ERR_MODULE_NOT_FOUND on dist/build-graph.js, and as a CI failure
 * that has stood since 13 September. A copy that has fallen behind should say so, not appear as a missing symbol.
 */
export const copyLeadsOf = ({ consumer, name, sourceVersion, copyVersion, sourceFiles, copyFiles }) => {
  if (copyVersion === null) return [{ source: `copy:${consumer}/${name}`, what: `${name} is declared file: and is not installed`, owes: 'an install' }]
  if (sourceVersion !== copyVersion) {
    return [{ source: `copy:${consumer}/${name}`, what: `${consumer} runs a copy of ${name} at ${copyVersion} while the source is ${sourceVersion}`, owes: 'a reinstall; pnpm copies a file: dependency rather than linking it, so the copy froze' }]
  }
  const missing = sourceFiles.filter((f) => !copyFiles.includes(f))
  if (missing.length > 0) {
    return [{ source: `copy:${consumer}/${name}`, what: `${consumer}'s copy of ${name} is the same version but missing ${missing.length} shipped file(s), first ${missing[0]}`, owes: 'a reinstall; the copy predates files the source now ships, and the symptom will be a missing module rather than a stale one' }]
  }
  return []
}

const invoked = process.argv[1]?.endsWith('leads.mjs') === true

if (invoked) {
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
      add(`npm:${local.name}`, true, 'the registry has never served this package', packageLeadsOf({ name: local.name, version: local.version, status: 404 }))
    } else if (!registry.ok) {
      add(`npm:${local.name}`, false, `registry answered ${registry.status}`)
    } else {
      const served = Object.keys(registry.body.versions ?? {})
      const latest = registry.body['dist-tags']?.latest
      add(`npm:${local.name}`, true, `registry serves ${served.length} version(s), latest ${latest}`,
        packageLeadsOf({ name: local.name, version: local.version, status: 200, served, latest }))
    }

    /* A RELEASE CANNOT BE CUT FROM A DIRTY TREE, and release-cut says so and exits 1 — but the feed recorded only
     * "FAIL cut v0.3.1" with no reason, so the reason had to be looked up by a person. It is a lead now. */
    const dirty = git(local.dir, 'status', '--porcelain')
    const remote = git(local.dir, 'remote', 'get-url', 'origin')
    const ahead = git(local.dir, 'rev-list', '--count', 'origin/main..HEAD')
    add(`git:${folder}`, dirty !== null, remote ? `remote ${remote}` : 'local only', repoLeadsOf({ folder, dirty, remote, ahead }))
  }


  /* ── a file: dependency is COPIED, not linked, so the copy can be behind its source ─────────────────────────── */
  const consumers = ['payload', 'school', 'qpu']
  for (const consumer of consumers) {
    const manifestPath = join(SIBLINGS, consumer, 'package.json')
    if (!existsSync(manifestPath)) continue
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    const deps = { ...manifest.dependencies, ...manifest.devDependencies }
    for (const [dep, spec] of Object.entries(deps)) {
      if (typeof spec !== 'string' || !spec.startsWith('file:')) continue
      const sourceDir = resolve(join(SIBLINGS, consumer), spec.slice('file:'.length))
      const sourceManifest = join(sourceDir, 'package.json')
      if (!existsSync(sourceManifest)) continue
      const sourceVersion = JSON.parse(readFileSync(sourceManifest, 'utf8')).version
      const copyDir = join(SIBLINGS, consumer, 'node_modules', ...dep.split('/'))
      const copyManifest = join(copyDir, 'package.json')
      const copyVersion = existsSync(copyManifest) ? JSON.parse(readFileSync(copyManifest, 'utf8')).version : null
      /* A sample of the source's shipped dist, checked for presence in the copy. Cheap, and it is exactly the
       * shape that failed: a file the source ships and the copy has never seen. */
      const n0 = 0
      const tenOfTwo = 20
      const sample = (() => {
        try {
          const dir = join(sourceDir, 'dist')
          return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.js')).slice(n0, tenOfTwo) : []
        } catch { return [] }
      })()
      const copySample = (() => {
        try {
          const dir = join(copyDir, 'dist')
          return existsSync(dir) ? readdirSync(dir) : []
        } catch { return [] }
      })()
      add(`copy:${consumer}/${dep}`, copyVersion !== null, copyVersion === null ? 'not installed' : `copy ${copyVersion}, source ${sourceVersion}`,
        copyLeadsOf({ consumer, name: dep, sourceVersion, copyVersion, sourceFiles: sample, copyFiles: copySample }))
    }
  }

  /* ── the archive, which mints a DOI from a GitHub Release ───────────────────────────────────────────────────── */
  const conceptRecid = (cff.match(/description:\s*All versions[\s\S]*?value:\s*10\.\d+\/zenodo\.(\d+)/) ?? [])[1]
  if (!conceptRecid) add('zenodo', true, 'CITATION.cff names no concept DOI', [])
  else {
    const hits = (await get(`https://zenodo.org/api/records?q=conceptdoi:%2210.5281/zenodo.${conceptRecid}%22&size=100`, { accept: 'application/json' })).body?.hits?.hits
    if (!hits) add('zenodo', false, 'zenodo would not answer — a refusal is not an answer about the archive')
    else {
      const held = hits.map((h) => String(h.metadata?.version ?? '').replace(/^v/, ''))
      add('zenodo', true, `the archive holds ${held.join(', ') || 'no versioned record'}`, archiveLeadsOf({ version: pkg.version, held }))
    }
  }

  /* ── the MCP, asked about itself ────────────────────────────────────────────────────────────────────────────
   * Every sealed door is called PLAINLY, with nothing live requested, because that is what self-sufficiency
   * means: the unit computes its own answer rather than proxying somebody else's host. A door that holds only
   * when a third party replies passes every day the network is good, which is the failure this repository has
   * already paid for twice. And qpu_train's teaching classification is read back as work: every pair that
   * teaches in one direction owes the other, and the door has been computing that owed direction all along
   * with nobody collecting it. */
  const origin = 'https://qpu.uuidna.com'
  const callOf = async (name, args = {}) => {
    const res = await get(`${origin}/mcp`, {
      accept: 'application/json',
      method: 'POST',
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
    })
    const shown = res.body?.result?.structuredContent ?? res.body?.result
    return { name, ok: res.ok === true && shown !== undefined, holds: shown?.holds, why: res.ok ? 'no structured result' : `${res.status || res.error}`, shown }
  }
  const listed = await get(`${origin}/mcp`, {
    accept: 'application/json',
    method: 'POST',
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
  })
  if (!listed.ok) add(`mcp:${origin}`, false, `tools/list answered ${listed.status || listed.error}`)
  else {
    const names = (listed.body?.result?.tools ?? []).map((row) => row.name)
    const doors = []
    for (const name of names) doors.push(await callOf(name))
    add(`mcp:${origin}`, true, `${doors.filter((d) => d.holds === true).length}/${doors.length} sealed door(s) hold when asked plainly`, doorLeadsOf({ origin, doors }))
    const school = doors.find((door) => door.name === 'qpu_train')?.shown?.school
    add(`teaching:${origin}`, true, teachingNoteOf({ school }), teachingLeadsOf({ origin, school }))
  }

  /* ── the host, which is the only source that can say the deployment is well ─────────────────────────────────── */
  const storage = await get(`${origin}/storage`)
  if (!storage.ok) add(`live:${origin}`, false, `the host answered ${storage.status || storage.error}`)
  else {
    const monitor = storage.body.monitor ?? {}
    add(`live:${origin}`, true, `storage answers; holds ${storage.body.holds}`, hostLeadsOf({ origin, holds: storage.body.holds, monitor }))
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

}
