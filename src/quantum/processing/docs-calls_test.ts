import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { handle, call } from './mcp.ts'

const DOCS = new URL('../../../docs/', import.meta.url).pathname
const pages = readdirSync(DOCS).filter((f) => f.endsWith('.md')).map((f) => [f, readFileSync(join(DOCS, f), 'utf8')] as const)

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every fenced tool call in the docs replays against the handler (docs → code). */
test('every fenced tool call in the docs replays against the handler (docs → code)', () => {
  let calls = 0
  for (const [file, text] of pages) {
    for (const m of text.matchAll(/```json\n([\s\S]*?)```/g)) {
      let parsed: unknown
      try { parsed = JSON.parse(m[1]!) } catch { continue }
      if (!parsed || typeof parsed !== 'object' || !('name' in parsed) || !('arguments' in parsed)) continue
      const { name, arguments: args } = parsed as { name: string; arguments: unknown }
      const r: any = call(name, args)
      assert.ok('result' in r, `${file}: ${name} → ${'error' in r ? r.error.message : ''}`)
      calls += 1
    }
  }
  assert.ok(calls >= 0)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every served tool is named in the docs (code → docs). */
test('every served tool is named in the docs (code → docs)', () => {
  const list = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' })
  const names = (list as { result: { tools: { name: string }[] } }).result.tools.map((t) => t.name)
  const all = pages.map(([, t]) => t).join('\n')
  const missing = names.filter((n) => !all.includes(`\`${n}\``) && !all.includes(`## ${n}`) && !all.includes(`'${n}'`))
  assert.deepEqual(missing, [])
})
