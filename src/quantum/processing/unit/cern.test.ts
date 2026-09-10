import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker from './index.js'

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
  ui: { experienced: boolean; door: string }
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
    learn?: { lhc: string[]; opendata: string[]; holds: boolean }
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
    ui?: { experienced?: boolean; prove?: string }
    prove?: { ui?: { experienced?: boolean }; cern?: { cases: { name: string }[] } }
  }
  return { res, json }
}

test('cern faces via mcp', { timeout: 120_000 }, async (t) => {
  const page = await uiOf('/')
  const catalog = await uiOf('/mcp')
  const prove = await mcpOf('qpu_prove', { live: true })
  const live: CernLive | undefined = prove.cern.live
  assert.equal(page.res.headers.get('content-type')?.includes('ld+json'), true)
  assert.equal(page.json.docs?.inline, true)
  assert.equal(page.json.ui?.experienced, true)
  assert.equal(page.json.ui?.prove, 'qpu_prove')
  assert.equal(page.json.docs?.documentation?.includes('qpu_prove'), true)
  assert.equal(page.json.docs?.formulas?.some((f) => f.theorem.startsWith('theorem cern')), true)
  assert.equal(catalog.json.prove?.ui?.experienced, true)
  assert.equal(prove.holds, true)
  assert.equal(prove.ui.experienced, true)
  assert.equal(prove.ui.door, 'qpu_prove')
  assert.equal(prove.cern.faces, 14)
  assert.equal(prove.cern.cases.length, 14)
  assert.equal(prove.cern.source, 'opendata.cern.ch')
  assert.equal(prove.cern.api, 'https://opendata.cern.ch/api/records')
  assert.deepEqual(prove.cern.primitives, ['fetch', 'Request', 'Response', 'BigInt', 'performance'])
  assert.equal(live?.live, true)
  assert.equal(live?.holds, true)
  assert.equal(live?.hostEscape, false)
  assert.equal(live?.records.length, 4)
  assert.equal(live?.cases.length, 14)
  const fetched = await mcpOf('fetch', { href: prove.cern.records[0]?.href })
  assert.equal(fetched.holds, true)
  assert.equal(fetched.hostEscape, false)
  assert.equal(fetched.live, true)
  assert.equal(fetched.value?.holds, true)
  assert.equal(fetched.value?.events, prove.cern.cases[0]?.right)
  assert.deepEqual(fetched.value?.primitives, prove.cern.primitives)
  assert.equal(prove.cern.tetra, 'theorem tetra')
  assert.equal(prove.intelligence?.kind, 'intelligence')
  assert.equal(prove.intelligence?.test, 'fusion')
  assert.equal(prove.intelligence?.research, 'free online')
  assert.equal(prove.intelligence?.holds, true)
  assert.equal(prove.intelligence?.fusion.quantum, false)
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
  assert.equal(live?.experiments?.length, 13)
  assert.equal(live?.search?.length, 9)
  assert.equal(live?.entangle?.holds, true)
  assert.equal(live?.entangle?.pairs.length, 9)
  assert.equal(live?.entangle?.catalog?.pairs.length, 7)
  for (const project of prove.cern.projects) {
    const fetchedProject = await mcpOf('fetch', { href: project.href })
    const liveProjects: CernProject[] = live ? live.projects : []
    const liveProject: CernProject | undefined = liveProjects.find((row) => row.experiment === project.experiment)
    assert.equal(project.theorem, 'theorem tetra')
    assert.equal(project.href.startsWith(prove.cern.api), true)
    assert.equal(fetchedProject.holds, true)
    assert.equal(fetchedProject.live, true)
    assert.equal(fetchedProject.hostEscape, false)
    assert.equal(fetchedProject.value?.holds, true)
    assert.equal(fetchedProject.value?.experiment, project.experiment)
    assert.equal((fetchedProject.value?.total ?? 0) > 0, true)
    assert.equal(liveProject?.holds, true)
    assert.equal(liveProject?.live, true)
    assert.equal(liveProject?.experiment, project.experiment)
    assert.equal((liveProject?.total ?? 0) > 0, true)
  }
  const lhcOnly = ['LHCf', 'MoEDAL', 'FASER', 'SND@LHC']
  for (const experiment of prove.cern.experiments ?? []) {
    const fetchedExperiment = await mcpOf('fetch', { href: experiment.href })
    const liveExperiments: CernProject[] = live?.experiments ?? []
    const liveExperiment: CernProject | undefined = liveExperiments.find((row) => row.experiment === experiment.experiment)
    const openRecords = lhcOnly.includes(experiment.experiment) === false
    assert.equal(experiment.href.startsWith(prove.cern.api), true)
    assert.equal(fetchedExperiment.holds, true)
    assert.equal(fetchedExperiment.live, true)
    assert.equal(fetchedExperiment.hostEscape, false)
    assert.equal(fetchedExperiment.value?.holds, true)
    assert.equal(fetchedExperiment.value?.experiment, experiment.experiment)
    assert.equal(openRecords ? (fetchedExperiment.value?.total ?? 0) > 0 : true, true)
    assert.equal(liveExperiment?.holds, true)
    assert.equal(liveExperiment?.live, true)
    assert.equal(liveExperiment?.experiment, experiment.experiment)
    assert.equal(openRecords ? (liveExperiment?.total ?? 0) > 0 : true, true)
  }
  for (const face of prove.cern.cases) {
    await t.test(face.name, () => {
      const liveFace = live?.cases.find((row) => row.name === face.name)
      assert.equal(prove.ui.experienced, true)
      assert.equal(face.left, face.right)
      assert.equal(face.holds, true)
      assert.equal(face.theorem.includes('by decide'), false)
      assert.equal(face.href.startsWith(prove.cern.api), true)
      assert.equal(liveFace?.holds, true)
      assert.equal(liveFace?.left, liveFace?.right)
      assert.equal(liveFace?.theorem, face.theorem)
    })
  }
})
