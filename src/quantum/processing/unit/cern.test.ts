import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker from './index.js'

const host = 'qpu.uuidna.com'
const env = { QPU_HOST: host }
const html = { accept: 'text/html' }

type CernCase = { name: string; theorem: string; left: number; right: number; holds: boolean; href: string }
type CernProject = { experiment: string; href: string; theorem: string; holds: boolean; live?: boolean; total?: number }
type CernLive = {
  live: boolean
  holds: boolean
  source: string
  api: string
  tetra?: string
  primitives: string[]
  host: boolean
  hostEscape: boolean
  records: { href: string; events: number; files: number; holds: boolean; live: boolean }[]
  projects: CernProject[]
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
  host?: boolean
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

test('cern faces via mcp', { timeout: 60_000 }, async (t) => {
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
  assert.equal(live?.host, false)
  assert.equal(live?.hostEscape, false)
  assert.equal(live?.records.length, 4)
  assert.equal(live?.cases.length, 14)
  const fetched = await mcpOf('fetch', { href: prove.cern.records[0]?.href })
  assert.equal(fetched.holds, true)
  assert.equal(fetched.host, false)
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
