import { test } from 'node:test'
import assert from 'node:assert/strict'
import { LEAN_HOST, qpuStandingFilesOf, qpuStandingHolds, qpuStandingOf, standingByFileOf } from './standing.js'
import { qpuSidebarOf } from './chrome.js'
import { handleQpuFetch } from './edge.js'
import { qpuMcpCall } from './mcp-catalog.js'

test('standing splits by axiom file; every file is .lean; holds', () => {
  assert.equal(qpuStandingHolds(), true)
  const files = qpuStandingFilesOf()
  assert.ok(files.length >= 2)
  assert.ok(files.every((f) => f.endsWith('.lean')))
  assert.ok(files.includes('Qpu.lean'))
  assert.ok(files.includes('Clay.lean'))
  const qpu = standingByFileOf('Qpu.lean')
  assert.equal(qpu.length, 1)
  assert.ok(qpu[0]!.theorems.length >= 1)
  assert.equal(qpu[0]!.href, `${LEAN_HOST}/Qpu.lean`)
  const scoped = qpuStandingOf({ file: 'Qpu', role: 'is' })
  assert.deepEqual(scoped.files, ['Qpu.lean'])
  assert.ok(scoped.standing.every((s) => s.file === 'Qpu.lean' && s.role === 'is'))
})

test('paper sidebar groups standing by axiom file', () => {
  const side = qpuSidebarOf('/paper')
  const files = qpuStandingFilesOf()
  const groups = side.filter((g) => g.text.endsWith('.lean'))
  assert.equal(groups.length, files.length)
  assert.ok(groups.every((g) => g.items.length > 0))
  assert.ok(groups[0]!.items[0]!.link.startsWith('https://uuidna.com/theorem/'))
})

test('GET /standing and MCP qpu_standing by file', async () => {
  const res = await handleQpuFetch(new Request('https://qpu.uuidna.com/standing'))
  assert.equal(res.status, 200)
  const body = await res.json() as { files: string[]; byFile: { file: string }[] }
  assert.ok(body.files.includes('Qpu.lean'))
  assert.equal(body.byFile.length, body.files.length)
  const mcp = await qpuMcpCall('qpu_standing', { file: 'Qpu.lean' }) as { files: string[] }
  assert.deepEqual(mcp.files, ['Qpu.lean'])
})
