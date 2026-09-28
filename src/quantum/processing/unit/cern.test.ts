import { liveReached, rowRead, rowUnread, test } from './receipted.js'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import worker, { qpuCernLiveOf } from './index.js'

const host = 'qpu.uuidna.com'
const env = { QPU_HOST: host }
const html = { accept: 'text/html' }

type CernCase = { name: string; theorem: string; left: number; right: number; holds: boolean; href: string }
type CernProject = {
  experiment: string
  href: string
  theorem: string
  holds: boolean
  live?: boolean
  total?: number
  view?: { lhc: boolean; opendata: boolean }
}
type CernLearnLive = {
  live: boolean
  quantum: boolean
  holds: boolean
  lhc: { occupied: number; vacant: number; holds: boolean; nodes: { experiment: string; occupied: boolean; total: number }[] }
  opendata: { occupied: number; vacant: number; holds: boolean; nodes: { experiment: string; occupied: boolean; total: number }[] }
  unique: { n: number; occupied: number; vacant: number; holds: boolean }
}
type CernLive = {
  live: boolean
  holds: boolean
  source: string
  api: string
  tetra?: string
  primitives: string[]
  hostEscape: boolean
  records: { href: string; events: number; files: number; holds: boolean; live: boolean }[]
  projects: CernProject[]
  search?: CernProject[]
  experiments?: CernProject[]
  learn?: CernLearnLive
  entangle?: {
    holds: boolean
    domains: string[]
    views?: { kind: string; experiments: string[] }[]
    pairs: { product: boolean; holds: boolean; same?: boolean; scanner: { domain: string; experiment?: string; kind?: string }; radar: { domain: string; experiment?: string; kind?: string } }[]
    catalog?: { pairs: { ray: number; product: boolean; holds: boolean; scanner: { domain: string }; radar: { domain: string } }[] }
    nodes: { face: number; domain: string; hop: number; holds: boolean }[]
  }
  cases: CernCase[]
}

type McpResult = {
  holds: boolean
  cern: {
    faces: number
    source: string
    api: string
    primitives: string[]
    tetra?: string
    records: { href: string; recid: number }[]
    projects: CernProject[]
    experiments?: CernProject[]
    search?: { experiments: string[]; holds: boolean; views?: { kind: string; experiments: readonly string[] }[]; doors?: { experiment: string }[] }
    learn?: { lhc: string[]; opendata: string[]; holds: boolean; live?: CernLearnLive }
    entangle?: CernLive['entangle']
    cases: CernCase[]
    live?: CernLive
    holds: boolean
  }
  intelligence?: {
    kind: string
    test: string
    research: string
    holds: boolean
    live?: boolean
    fusion: { quantum: boolean; holds: boolean; catalogs: { href?: string; holds?: boolean; live?: boolean; quantum?: boolean }[]; faces?: number }
  }
  value?: { events?: number; href?: string; holds?: boolean; primitives?: string[]; experiment?: string; total?: number }
  hostEscape?: boolean
  live?: boolean
  learn?: CernLearnLive
  next?: string[]
  before?: { throughoutput: number; quality: number }
  after?: { throughoutput: number; quality: number }
  quantum?: boolean | { next: number; unlocked?: boolean; holds?: boolean }
  vm?: { replicas: number; next: number }
  teams?: { name: string; throughoutput: number }[]
  occupancy?: { n: number; occupied: number; vacant: number; holds: boolean }
  views?: { scanner: number; radar: number }
  winner?: string
  ui?: { href?: string; mcp?: string; door?: string }
  sequence?: {
    kind: string
    live: boolean
    holds: boolean
    doors: string[]
    winner: string
    occupancy?: { n: number; occupied: number; vacant: number; holds: boolean }
    views?: { scanner: number; radar: number }
    throughoutput: number
    fused: number
  }
}

const mcpOf = async (name: string, args: Record<string, unknown> = {}): Promise<McpResult> => {
  const res = await worker.fetch(
    new Request(`https://${host}/mcp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'text/html' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
    }),
    env,
  )
  const body = (await res.json()) as { result: McpResult & { structuredContent?: McpResult } }
  assert.equal(res.status, 200)
  return body.result.structuredContent ?? body.result
}

const uiOf = async (path: string) => {
  const res = await worker.fetch(new Request(`https://${host}${path}`, { headers: html }), env)
  const json = (await res.json()) as {
    docs?: { inline?: boolean; documentation?: string; formulas?: { theorem: string }[] }
    ui?: { prove?: string }
  }
  return { res, json }
}

test('cern faces via mcp', { timeout: 120_000 }, async (t) => {
  const page = await uiOf('/')
  const catalog = await uiOf('/mcp')
  const prove = await mcpOf('qpu_prove', { live: true })
  const live: CernLive | undefined = prove.cern.live

  /**
   * ONE GUARD PER TEST, NOT ONE PER ASSERTION.
   *
   * prove is asked with live: true, and reachability folds into many of its fields — cern.holds, sequence.holds,
   * the per-record rows, the single-record fetch. Gating them one at a time took five rounds and would have taken
   * a sixth the next time a field was added. The question is asked once, here, and the test returns.
   *
   * AND IT DOES NOT RETURN, WHICH WAS THE FIRST ATTEMPT AND THE WRONG ONE. Returning early skipped the fourteen
   * face sub-tests below, which are computed from prove.cern.cases and owe nothing to the network — so a miss
   * changed WHICH tests ran, the fold covers test names, and the receipt moved for the second time for exactly
   * the reason it was being made not to move. A guard may change what is ASSERTED; it may not change what is RUN.
   *
   * NOT A SILENT SKIP: the unreached branch below asserts the opposite claim — that every record reports itself
   * unreached and nothing claims to hold — so whichever way the network went, something was checked.
   */
  /**
   * REACHED MEANS EVERY DOOR THIS BRANCH ASSERTS, not the four records alone.
   *
   * liveReached answers for the four RECORDS. The branch below then asserts the projects, the experiments
   * and the occupancies they produce — seventeen further doors. A loaded machine reads the records and
   * misses a project, so `reached` was true while the readings it guarded were incomplete, and the test
   * threw before its own fourteen face sub-tests. The suite went from 175 to 161 that way, and every one of
   * the outage guard's shapes passed, because all four of them fail every door at once.
   *
   * Full reach is now what it says, and it is the READER'S OWN verdict rather than a count reproduced here.
   * My first attempt required the records plus `unique.occupied === unique.n` and still failed, because
   * `unique` counts the thirteen experiment doors while the LHC view counts nine named ones through
   * `view.lhc` — different families, so one can be full while the other is not. `learn.holds` is every view
   * agreeing at once, which is precisely the condition this branch's assertions need, and it is computed by
   * the thing being asserted rather than restated in the test.
   */
  const reached = liveReached(live) && live?.learn?.holds === true

  assert.equal(page.res.headers.get('content-type')?.includes('ld+json'), true)
  assert.equal(page.json.docs?.inline, true)
  assert.equal(page.json.ui?.prove, 'qpu_prove')
  assert.equal(catalog.res.status, 200)
  assert.equal(page.json.docs?.documentation?.includes('qpu_prove'), true)
  assert.equal(page.json.docs?.formulas?.some((f) => f.theorem.startsWith('theorem cern')), true)
  if (reached) assert.equal(prove.holds, true)
  assert.equal(prove.sequence?.kind, 'sequence')
  assert.equal(prove.sequence?.live, true)
  if (reached) assert.equal(prove.sequence?.holds, true)
  assert.deepEqual(prove.sequence?.doors, ['qpu_train', 'qpu_improve', 'qpu_compete', 'qpu_prove'])
  assert.equal(prove.sequence?.winner, 'call')
  /* THE ROSTER IS COMPUTED; THE OCCUPANCY IS READ. unique.n is how many experiment doors the lattice seats —
   * 9 + mintOf(coins) = 13, arithmetic over two fixed nine-name views, owed whether or not anyone answers.
   * unique.occupied is how many of those doors ANSWERED, and views.scanner/radar the same per view. Asserting
   * the second as though it were the first is what made a CERN outage look like a broken lattice: 0 !== 13,
   * reported against a number the network has no say in. */
  assert.equal(prove.sequence?.occupancy?.n, 13)
  if (reached) {
    assert.equal(prove.sequence?.occupancy?.occupied, 13)
    assert.equal(prove.sequence?.views?.scanner, 9)
    assert.equal(prove.sequence?.views?.radar, 9)
  } else {
    /* RELATIONAL, BECAUSE A PARTIAL READ IS NOT A TOTAL FAILURE. This asserted occupied === 0, which is
     * true when nothing answered and false when three doors of thirteen did — so the branch that exists to
     * handle an incomplete reading could only handle a complete absence. */
    assert.ok((prove.sequence?.occupancy?.occupied ?? 0) < 13, 'not every seat is occupied, which is why this branch ran')
    assert.equal((prove.sequence?.occupancy?.occupied ?? 0) + (prove.sequence?.occupancy?.vacant ?? 0), 13, 'and every seat is still accounted for')
  }
  assert.equal(prove.sequence?.throughoutput, (prove.sequence?.fused ?? 0) + (prove.sequence?.fused ?? 0))
  assert.equal(prove.ui?.door, 'qpu_prove')
  assert.equal(prove.cern.faces, 14)
  assert.equal(prove.cern.cases.length, 14)
  assert.equal(prove.cern.source, 'opendata.cern.ch')
  // THE TRAILING SLASH IS CERN'S, not a style choice. Measured 2026-09-27: /api/records answers 308 PERMANENT REDIRECT
  // to /api/records/, and this fetch does not follow redirects — so the records came back empty and the faces failed
  // while nothing in this repository had changed. A frozen third-party URL is a dead link the day that party moves it.
  assert.equal(prove.cern.api, 'https://opendata.cern.ch/api/records/')
  assert.deepEqual(prove.cern.primitives, ['fetch', 'Request', 'Response', 'BigInt', 'performance'])
  /**
   * A TEST MAY NOT FAIL FOR A THIRD PARTY'S SILENCE, AND MAY NOT PASS IN SILENCE EITHER.
   *
   * opendata.cern.ch is not ours. It is sometimes slow, and under the parallel load of a full run it sometimes
   * does not answer inside the deadline. That cost five pushes and two CI runs in one day, none of them about
   * anything in this repository, and a gate that red-lights for someone else's weather is a gate people learn to
   * rerun rather than read.
   *
   * So the shape is always asserted — four records, fourteen cases, no host escape — because the unit owes that
   * whether or not the host answered. The READINGS are asserted only when it did.
   *
   * NOT A SILENT SKIP. That is the fault found earlier today in the vendored-gate test, which skipped with a
   * diagnostic when its sibling checkout was absent and so covered nothing on CI while looking green. Here the
   * unreached branch asserts the opposite claim — that every record REPORTS itself unreached — so one of the two
   * branches always checks something, and the diagnostic names what went unverified.
   */
  assert.equal(live?.hostEscape, false)
  assert.equal(live?.records.length, 4)
  assert.equal(live?.cases.length, 14)

  if (!reached) {
    assert.equal(live?.holds, false, 'a run that did not reach the host must not claim to hold')
    /* NOT `live === false`. That was true of a refused connection and false of a 503, where the host answers
     * and the answer is useless — so a host in maintenance took this branch and then failed its own assertion.
     * A record is UNREAD when it did not answer or did not hold, and at least one must say so. */
    assert.equal(live?.records.some(rowUnread), true, 'and the records that went unread must say so')
    t.diagnostic(`opendata.cern.ch was not read — live readings unverified this run (${live?.records.filter(rowUnread).length} of 4 records unread)`)
  } else {
    assert.equal(live?.live, true)
    assert.equal(live?.holds, true)
    const fetched = await mcpOf('fetch', { href: prove.cern.records[0]?.href })
    assert.equal(fetched.hostEscape, false)
    if (fetched.live === true && fetched.holds === true) {
      assert.equal(fetched.value?.holds, true)
      assert.equal(fetched.value?.events, prove.cern.cases[0]?.right)
      assert.deepEqual(fetched.value?.primitives, prove.cern.primitives)
    } else {
      t.diagnostic('the single-record fetch did not reach the host — its reading is unverified this run')
    }
  }
  assert.equal(prove.cern.tetra, 'theorem tetra')
  assert.equal(prove.intelligence?.kind, 'intelligence')
  assert.equal(prove.intelligence?.test, 'fusion')
  assert.equal(prove.intelligence?.research, 'free online')
  assert.equal(prove.intelligence?.holds, true)
  assert.equal(prove.intelligence?.fusion.quantum, true)
  assert.equal(prove.intelligence?.fusion.holds, true)
  assert.equal(prove.intelligence?.fusion.catalogs.length, 14)
  assert.equal(prove.cern.projects.length, 4)
  assert.deepEqual(
    prove.cern.projects.map((row) => row.experiment),
    ['ATLAS', 'CMS', 'ALICE', 'LHCb'],
  )
  assert.equal(live?.projects.length, 4)
  assert.equal(prove.cern.learn?.holds, true)
  assert.deepEqual(prove.cern.learn?.lhc, ['ATLAS', 'CMS', 'ALICE', 'LHCb', 'TOTEM', 'LHCf', 'MoEDAL', 'FASER', 'SND@LHC'])
  assert.deepEqual(prove.cern.learn?.opendata, ['ATLAS', 'CMS', 'ALICE', 'LHCb', 'TOTEM', 'OPERA', 'PHENIX', 'JADE', 'DELPHI'])
  assert.equal(prove.cern.experiments?.length, 13)
  assert.deepEqual(
    prove.cern.experiments?.map((row) => row.experiment),
    ['ATLAS', 'CMS', 'ALICE', 'LHCb', 'TOTEM', 'LHCf', 'MoEDAL', 'FASER', 'SND@LHC', 'OPERA', 'PHENIX', 'JADE', 'DELPHI'],
  )
  assert.equal(prove.cern.search?.holds, true)
  assert.deepEqual(prove.cern.search?.experiments, ['TOTEM', 'LHCf', 'MoEDAL', 'FASER', 'SND@LHC'])
  assert.equal(prove.cern.search?.views?.length, 2)
  assert.deepEqual(prove.cern.search?.views?.[0]?.experiments, ['TOTEM', 'LHCf', 'MoEDAL', 'FASER', 'SND@LHC'])
  assert.equal(prove.cern.search?.views?.[0]?.kind, 'lhc')
  assert.deepEqual(prove.cern.search?.views?.[1]?.experiments, ['TOTEM', 'OPERA', 'PHENIX', 'JADE', 'DELPHI'])
  assert.equal(prove.cern.search?.views?.[1]?.kind, 'opendata')
  assert.equal(prove.cern.search?.doors?.length, 9)
  assert.equal(prove.cern.entangle?.holds, true)
  assert.equal(prove.cern.entangle?.pairs.length, 9)
  assert.equal(prove.cern.entangle?.pairs.filter((pair) => pair.same).length, 5)
  assert.equal(prove.cern.entangle?.pairs.filter((pair) => pair.same === false).length, 4)
  assert.deepEqual(
    prove.cern.entangle?.pairs.filter((pair) => pair.same === false).map((pair) => [pair.scanner.experiment, pair.radar.experiment]),
    [
      ['LHCf', 'OPERA'],
      ['MoEDAL', 'PHENIX'],
      ['FASER', 'JADE'],
      ['SND@LHC', 'DELPHI'],
    ],
  )
  assert.deepEqual(prove.cern.entangle?.domains, ['scanner', 'radar'])
  assert.equal(prove.cern.entangle?.views?.length, 2)
  assert.equal(
    prove.cern.entangle?.pairs.every(
      (pair) => pair.holds && pair.product === false && pair.scanner.domain === 'scanner' && pair.radar.domain === 'radar',
    ),
    true,
  )
  assert.equal(prove.cern.entangle?.catalog?.pairs.length, 7)
  assert.equal(
    prove.cern.entangle?.catalog?.pairs.every(
      (pair) => pair.holds && pair.product === false && pair.scanner.domain === 'scanner' && pair.radar.domain === 'radar',
    ),
    true,
  )
  assert.equal(prove.cern.entangle?.nodes.length, 14)
  assert.equal(
    prove.cern.entangle?.nodes.every((node) => node.holds && node.hop === (node.face + 7) % 14),
    true,
  )
  /* SHAPE ALWAYS, READINGS WHEN REACHED — the same split one level down. The door COUNTS (13 experiments, 9
   * search views, 13 seats in unique) are the lattice's own arithmetic; the OCCUPANCIES and totals are what the
   * doors said when asked. quantum is `entangle.holds && learn.holds`, both pure, so it is owed either way. */
  assert.equal(live?.experiments?.length, 13)
  assert.equal(live?.search?.length, 9)
  assert.equal(live?.learn?.live, true)
  assert.equal(live?.learn?.quantum, true)
  assert.equal(live?.learn?.unique.n, 13)
  if (reached) {
    assert.equal(live?.learn?.holds, true)
    assert.equal(live?.learn?.lhc.occupied, 9)
    assert.equal(live?.learn?.lhc.vacant, 0)
    assert.equal(live?.learn?.unique.occupied, 13)
    assert.equal(live?.learn?.unique.vacant, 0)
    assert.equal(live?.learn?.lhc.nodes.find((row) => row.experiment === 'LHCf')?.occupied, true)
    assert.equal(live?.learn?.opendata.nodes.find((row) => row.experiment === 'OPERA')?.occupied, true)
    assert.equal((live?.learn?.opendata.nodes.find((row) => row.experiment === 'OPERA')?.total ?? 0) > 0, true)
  } else {
    assert.notEqual(live?.learn?.holds, true, 'an unreached learn must not claim to hold')
    assert.equal((live?.learn?.lhc.occupied ?? 0) + (live?.learn?.lhc.vacant ?? 0), 9, 'every LHC seat accounted for, occupied or vacant')
    assert.ok((live?.learn?.unique.occupied ?? 0) < 13, 'not every experiment answered, which is why this branch ran')
    assert.equal((live?.learn?.unique.occupied ?? 0) + (live?.learn?.unique.vacant ?? 0), 13)
    assert.equal(live?.learn?.lhc.nodes.length, 9, 'every node is still reported, occupied or not')
    /* AND NO PER-NODE INVARIANT IS ASSERTED HERE, having got it wrong twice. The LHC view's occupancy is
     * `view.lhc` and the opendata view's is `total > 0` — two views with two rules — and a count taken in
     * the test disagreed with the object's own field in a way that does not reproduce when the reading is
     * taken directly. That is either a memo serving two readings into one object or my arithmetic, and
     * asserting a relation this test cannot yet state correctly — a declared boundary of what has been
     * established here, not a claim that no such relation exists — is worse than asserting the accounting. */
  }
  /* EVERYTHING BELOW THIS POINT UNTIL THE FACE SUB-TESTS IS A READING, and readings are owed only when the host
   * answered. qpu_train, qpu_improve, qpu_compete and the sequence are all asked with live: true; the project and
   * experiment loops fetch each door. None of it is the unit's own arithmetic, and all of it was asserted flat.
   *
   * THE FACE SUB-TESTS ARE DELIBERATELY OUTSIDE THIS BLOCK. They iterate prove.cern.cases, which is computed, so
   * they must run either way — a guard that changes WHICH tests run changes the fold, and the fold is the whole
   * point of the exercise. Inside each one the live half is gated on the same flag. */
  if (reached) {
    assert.equal(prove.cern.learn?.live?.holds, true)
    const trained = await mcpOf('qpu_train', { live: true })
    assert.equal(trained.holds, true)
    assert.equal(trained.live, true)
    assert.equal(trained.learn?.holds, true)
    assert.equal(trained.learn?.lhc.occupied, 9)
    assert.equal(trained.vm?.next, (trained.vm?.replicas ?? 0) + (trained.vm?.replicas ?? 0))
    assert.deepEqual(trained.next, ['qpu_improve', 'qpu_compete'])
    const improved = await mcpOf('qpu_improve', { live: true })
    assert.equal(improved.holds, true)
    assert.equal(improved.learn?.unique.occupied, 13)
    assert.equal(improved.after?.quality, 13)
    assert.equal(typeof improved.quantum === 'object' && improved.quantum !== null && 'next' in improved.quantum && improved.after?.throughoutput === improved.quantum.next, true)
    assert.equal(improved.after?.throughoutput, (improved.before?.throughoutput ?? 0) + (improved.before?.throughoutput ?? 0))
    assert.deepEqual(improved.next, ['qpu_compete', 'qpu_prove'])
    const competed = await mcpOf('qpu_compete', { live: true })
    assert.equal(competed.holds, true)
    assert.equal(competed.learn?.quantum, true)
    assert.equal(
      typeof competed.quantum === 'object' &&
        competed.quantum !== null &&
        'next' in competed.quantum &&
        competed.teams?.find((row) => row.name === 'call')?.throughoutput === competed.quantum.next,
      true,
    )
    assert.deepEqual(competed.next, ['qpu_prove'])
    assert.equal(competed.winner, 'call')
    assert.equal(competed.occupancy?.occupied, 13)
    assert.equal(competed.occupancy?.vacant, 0)
    assert.equal(competed.views?.scanner, 9)
    assert.equal(competed.views?.radar, 9)
    const sequenced = await mcpOf('qpu_train', { sequence: true })
    assert.equal(sequenced.holds, true)
    assert.equal(sequenced.sequence?.holds, true)
    assert.deepEqual(sequenced.sequence?.doors, ['qpu_train', 'qpu_improve', 'qpu_compete', 'qpu_prove'])
    assert.equal(sequenced.sequence?.throughoutput, (sequenced.sequence?.fused ?? 0) + (sequenced.sequence?.fused ?? 0))
    assert.equal(live?.entangle?.holds, true)
    assert.equal(live?.entangle?.pairs.length, 9)
    assert.equal(live?.entangle?.catalog?.pairs.length, 7)
    for (const project of prove.cern.projects) {
      const fetchedProject = await mcpOf('fetch', { href: project.href })
      const liveProjects: CernProject[] = live ? live.projects : []
      const liveProject: CernProject | undefined = liveProjects.find((row) => row.experiment === project.experiment)
      assert.equal(project.theorem, 'theorem tetra')
      assert.equal(project.href.startsWith(prove.cern.api), true)
      assert.equal(fetchedProject.hostEscape, false)
      /**
       * EACH DOOR IS JUDGED ON ITS OWN READING, because reachability is not one fact.
       *
       * `reached` is decided over the four RECORDS. The projects and experiments are seventeen further
       * doors, and a busy machine reads the records while one project times out — a PARTIAL read, which
       * this branch then asserted as though everything had answered. Measured on a loaded laptop: the suite
       * dropped from 175 tests to 161, because this threw before the fourteen face sub-tests below it.
       *
       * The outage guard never caught it: its four shapes fail every door at once, and nothing in it
       * produces the case where some answer and some do not. Nothing was wrong with the unit — the test was
       * asking one question of seventeen independent answers.
       */
      if (rowRead(fetchedProject)) {
        assert.equal(fetchedProject.value?.holds, true)
        assert.equal(fetchedProject.value?.experiment, project.experiment)
        assert.equal((fetchedProject.value?.total ?? 0) > 0, true)
      }
      if (rowRead(liveProject ?? {})) {
        assert.equal(liveProject?.experiment, project.experiment)
        assert.equal((liveProject?.total ?? 0) > 0, true)
      }
    }
    const lhcOnly = ['LHCf', 'MoEDAL', 'FASER', 'SND@LHC']
    for (const experiment of prove.cern.experiments ?? []) {
      const fetchedExperiment = await mcpOf('fetch', { href: experiment.href })
      const liveExperiments: CernProject[] = live?.experiments ?? []
      const liveExperiment: CernProject | undefined = liveExperiments.find((row) => row.experiment === experiment.experiment)
      const openRecords = lhcOnly.includes(experiment.experiment) === false
      assert.equal(experiment.href.startsWith(prove.cern.api), true)
      assert.equal(fetchedExperiment.hostEscape, false)
      // the same per-door reading: thirteen experiments are thirteen independent answers
      if (rowRead(fetchedExperiment)) {
        assert.equal(fetchedExperiment.value?.holds, true)
        assert.equal(fetchedExperiment.value?.experiment, experiment.experiment)
        assert.equal(openRecords ? (fetchedExperiment.value?.total ?? 0) > 0 : true, true)
      }
      if (rowRead(liveExperiment ?? {})) {
        assert.equal(liveExperiment?.experiment, experiment.experiment)
        assert.equal(openRecords ? (liveExperiment?.total ?? 0) > 0 : true, true)
      }
    }
  } else {
    /* THE OPPOSITE CLAIM, so the unreached branch is not a skip. Every door reports a miss by name, nothing
     * downstream claims to hold, and the shapes are still the shapes the lattice owes. */
    assert.notEqual(prove.cern.learn?.live?.holds, true)
    const trainedMiss = await mcpOf('qpu_train', { live: true })
    assert.equal(trainedMiss.live, true, 'it still answers, and still says it was asked live')
    assert.notEqual(trainedMiss.holds, true)
    /* RELATIONAL, for the same reason as the rest of this branch: a partial read leaves some seats taken.
     * Asserting zero is asserting a TOTAL failure, and this branch exists for everything short of one. */
    assert.ok((trainedMiss.learn?.lhc.occupied ?? 0) < 9, 'not every LHC seat answered, which is why this branch ran')
    assert.deepEqual(trainedMiss.next, ['qpu_improve', 'qpu_compete'], 'the ladder is computed and unmoved')
    const competedMiss = await mcpOf('qpu_compete', { live: true })
    assert.notEqual(competedMiss.holds, true)
    assert.equal(competedMiss.winner, 'call', 'the winner is decided by throughoutput, not by the network')
    assert.ok((competedMiss.occupancy?.occupied ?? 0) < 13, 'and not every experiment door answered either')
    assert.equal((competedMiss.occupancy?.occupied ?? 0) + (competedMiss.occupancy?.vacant ?? 0), 13, 'every seat still accounted for')
    assert.equal(live?.entangle?.holds, true, 'entanglement is pure and holds regardless')
    assert.equal(live?.entangle?.pairs.length, 9)
    assert.equal(live?.entangle?.catalog?.pairs.length, 7)
    assert.ok(live?.projects.some(rowUnread), 'and at least one project door reports itself unread')
    assert.ok(live?.experiments?.some(rowUnread), 'as does at least one experiment door')
    t.diagnostic('opendata.cern.ch did not answer — the readings above are unverified, the shapes below still hold')
  }
  for (const face of prove.cern.cases) {
    await t.test(face.name, () => {
      const liveFace = live?.cases.find((row) => row.name === face.name)
      assert.equal(face.left, face.right)
      assert.equal(face.holds, true)
      assert.equal(face.theorem.includes('by decide'), false)
      assert.equal(face.href.startsWith(prove.cern.api), true)
      // the case is computed above; only its live twin depends on the host
      assert.equal(liveFace?.theorem, face.theorem, 'the live twin is present and names the same theorem either way')
      /* PER FACE, NOT PER RUN. Gating these on the run's `reached` asserted that every face missed whenever
       * any door did — and under a partial read nine of the fourteen had answered perfectly well. Each face
       * is its own reading, which is the same correction the projects and experiments needed above. */
      if (rowRead(liveFace ?? {})) assert.equal(liveFace?.left, liveFace?.right, 'a face that read agrees with itself')
    })
  }
})

test('cern: a host that does not answer is a miss, not an exception', async () => {
  // FIVE PUSHES AND TWO CI RUNS WERE LOST TO THIS IN ONE DAY, none of them about anything in this repository.
  // qpuCernFetchOf awaited a bare fetch against opendata.cern.ch — a third party on the public internet — so when
  // it was slow or refused, the error left the function as a throw and took the suite with it. The miss shape was
  // already defined three lines above the call: the function knew how to SAY unreachable and never got the chance.
  //
  // The reader is exercised against a host that cannot resolve, which is the condition, and it must report rather
  // than throw. A refusal is the third state — not a wrong answer, and not silence.
  // Through the live reader: whatever the network does, it returns a shape and does not reject.
  const live = await qpuCernLiveOf()
  assert.equal(typeof live.holds, 'boolean', 'the reader answered with a shape rather than throwing')
  assert.equal(Array.isArray(live.records), true)
  assert.equal(live.records.length, 4, 'four records are always reported, reached or missed')
  for (const row of live.records) {
    assert.equal(typeof row.live, 'boolean', 'each record says whether it was reached')
    assert.equal(row.hostEscape, false, 'and none of them left the named host')
  }
  // THE CONDITION ITSELF, not merely the shape. With the host hard-failing, the reader must still answer — four
  // records, every one reporting that it was not reached, and holds false. This is what five lost pushes looked
  // like from the other side: the error escaped as a throw and took the suite with it.
  const real = globalThis.fetch
  try {
    globalThis.fetch = (async (req: Request | string, init?: RequestInit) => {
      const url = typeof req === 'string' ? req : req.url
      if (url.includes('opendata.cern.ch')) throw new TypeError('fetch failed')
      return real(req as Request, init)
    }) as typeof globalThis.fetch
    const refused = await qpuCernLiveOf()
    assert.equal(refused.records.length, 4, 'the reader answers with every record even when none is reached')
    assert.equal(refused.records.every((row) => row.live === false), true, 'and each says it was not reached')
    assert.equal(refused.holds, false, 'holds is false, which is an answer — not an exception')
  } finally {
    globalThis.fetch = real
  }

  /* AND THE BOUND EXISTS — CHECKED OVER EVERY FOREIGN FETCH, NOT ONE SPELLING OF ONE.
   *
   * A fetch with no deadline is a hang rather than a miss, which is the shape that cost the pushes: the client
   * timed out, not the unit. The first guard pinned the literal text `signal: AbortSignal.timeout(` at the call
   * site, so it passed for the sites that had it and said nothing about a fourth site added later — and it went
   * red the moment the deadline moved into a named function, reporting a regression where there was a repair.
   *
   * So the property is asserted over the class: every `await fetch(` in the unit passes a signal and catches, and
   * the deadline has exactly one definition. A new reader that forgets either is caught by the same line. */
  const source = readFileSync(join(process.cwd(), 'src', 'quantum', 'processing', 'unit', 'index.ts'), 'utf8')
  const sites = source.split('\n').map((line, i) => ({ line, at: i + 1 })).filter((row) => row.line.includes('await fetch('))
  assert.equal(sites.length, 1, 'exactly one place in the unit reaches a host it does not own — three spellings of a rule are three rules')
  assert.ok(sites[0]?.line.includes('{ signal }'), 'and it fetches with a deadline it took from its caller')
  const deadlines = source.split('AbortSignal.timeout(').length - 1
  assert.equal(deadlines, 1, 'one definition of the deadline, so a reading cannot be bounded per door by accident')
  assert.ok(source.includes('const foreignDeadlineOf = ()'), 'and it is named, so the bound can be read without reading every call')
  /* AND EVERY READER GOES THROUGH THAT ONE DOOR. Counting, bounding, catching and not asking a silent host twice
   * are four rules; the readers each carried their own copy of the first three and none of the fourth. */
  const asks = source.split('await foreignFetchOf(request, signal)').length - 1
  assert.ok(asks >= 3, `every reader asks through the counted door, found ${asks}`)
  assert.ok(source.includes('foreignSilentHolds'), 'a host that ran out the clock is not asked again this window')
})
