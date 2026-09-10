import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker from './index.js'

const host = 'qpu.uuidna.com'
const env = { QPU_HOST: host }
const html = { accept: 'text/html' }

type CernCase = { name: string; theorem: string; left: number; right: number; holds: boolean; href: string }
type CernLive = {
  live: boolean
  holds: boolean
  source: string
  api: string
  primitives: string[]
  host: boolean
  hostEscape: boolean
  records: { href: string; events: number; files: number; holds: boolean; live: boolean }[]
  cases: CernCase[]
}

const mcpOf = async (name: string, args: Record<string, unknown> = {}) => {
  const res = await worker.fetch(
    new Request(`https://${host}/mcp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'text/html' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
    }),
    env,
  )
  const body = (await res.json()) as {
    result: {
      holds: boolean
      ui: { experienced: boolean; door: string }
      cern: {
        faces: number
        source: string
        api: string
        primitives: string[]
        records: { href: string; recid: number }[]
        cases: CernCase[]
        live?: CernLive
        holds: boolean
      }
      value?: { events?: number; href?: string; holds?: boolean; primitives?: string[] }
      host?: boolean
      hostEscape?: boolean
      live?: boolean
    }
  }
  assert.equal(res.status, 200)
  return body.result
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
  const live = prove.cern.live
  assert.equal(page.res.headers.get('content-type')?.includes('application/json'), true)
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
