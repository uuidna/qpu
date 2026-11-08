/** ISO/IEC/IEEE 29119-3 test case. Identifier: every test states itself in the inline doc above it, and this test is one of those docs. */
import test from 'node:test'
import assert from 'node:assert/strict'
import { join } from 'node:path'
import { EXAMPLES } from './examples.ts'
import { documented, testCaseDocs } from './inline-docs.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every test states itself in the inline doc above it, and this test is one of those docs. */
test('every test states itself in the inline doc above it, and this test is one of those docs', () => {
  const rows = testCaseDocs(join(process.cwd(), 'src'))
  const missing = rows.filter((row) => !documented(row)).map((row) => `${row.file}:${row.line} ${row.title}`)
  assert.deepEqual(missing, [])
  const self = rows.find((row) => row.title === 'every test states itself in the inline doc above it, and this test is one of those docs')
  assert.equal(documented(self!), true)
  assert.ok(EXAMPLES.every((example) => example.shows.length > 0))
  assert.ok(rows.length > 1)
})
