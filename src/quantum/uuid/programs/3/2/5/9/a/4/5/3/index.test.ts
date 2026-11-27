import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { handle } from '../../../../../../../8/5/9/0/2/0/f/index.ts'

const DOCS = new URL('../../../../../../../../../../../../docs/', import.meta.url).pathname
const pages = readdirSync(DOCS).filter((f) => f.endsWith('.md')).map((f) => [f, readFileSync(join(DOCS, f), 'utf8')] as const)

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every served tool is named in the docs (code → docs). */
test('every served tool is named in the docs (code → docs)', () => {
  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
  const names = (list as { result: { tools: { name: string }[] } }).result.tools.map((t) => t.name)
  const all = pages.map(([, t]) => t).join('\n')
  const missing = names.filter((n) => !all.includes(`\`${n}\``) && !all.includes(`## ${n}`) && !all.includes(`'${n}'`))
  assert.deepEqual(missing, [])
})
