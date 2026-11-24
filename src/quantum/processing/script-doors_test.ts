import { test } from 'node:test'
import assert from 'node:assert/strict'
import { call } from './mcp.ts'
import { LEAD_ROWS } from './leads-index.ts'

const leadsIndex = (args: Record<string, unknown>) => { const r = call('textbook', { scripts: { leadsIndex: args } }); if (r.error) throw new Error(r.error.message); return r.result!.structuredContent }
const rowsOf = (text: string) => JSON.parse(text.slice(text.indexOf('= ') + 2)) as { id: string; status: string; statement: string }[]

/** ISO/IEC/IEEE 29119-3 test case. Identifier: one call of the leads door deposits a new lead into the record and keeps every lead already recorded as it is. */
test('one call of the leads door deposits a new lead into the record and keeps every lead already recorded as it is', () => {
  const first = LEAD_ROWS[0]!
  const fresh = { id: 'test-deposit-by-add', source: 'a test', statement: 'one call deposits a lead', status: 'open', reason: 'none' }
  const s = leadsIndex({ add: [fresh, { ...first, status: 'served', statement: 'rewritten' }, { id: 'no-statement', status: 'open' }] })
  assert.equal(s.path, 'src/quantum/processing/leads-index.ts')
  assert.deepEqual([s.added, s.kept, s.rows], [['test-deposit-by-add'], 2, LEAD_ROWS.length + 1])
  const rows = rowsOf(s.text)
  assert.deepEqual(rows.at(-1), fresh, 'the new lead is appended verbatim')
  assert.deepEqual(rows.find((l) => l.id === first.id), Object.fromEntries(Object.entries(first).filter(([k]) => ['id', 'source', 'statement', 'status', 'tool', 'reason', 'lastmod'].includes(k))), 'a recorded lead is never rewritten by add')
  assert.equal(leadsIndex({ add: [fresh, fresh] }).added.length, 1, 'the same lead twice is one lead')
})
