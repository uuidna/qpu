import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker from './index.js'

const host = 'qpu.uuidna.com'
const env = { QPU_HOST: host }
const html = { accept: 'text/html' }

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
      cern: { faces: number; cases: { name: string; theorem: string; left: number; right: number; holds: boolean }[] }
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

test('cern faces via mcp', async (t) => {
  const page = await uiOf('/')
  const catalog = await uiOf('/mcp')
  const prove = await mcpOf('qpu_prove')
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
  for (const face of prove.cern.cases) {
    await t.test(face.name, () => {
      assert.equal(prove.ui.experienced, true)
      assert.equal(face.left, face.right)
      assert.equal(face.holds, true)
      assert.equal(face.theorem.includes('by decide'), false)
    })
  }
})
