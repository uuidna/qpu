import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { DOCUMENT_LANGUAGE, ISO_80000_UNITS, isoConformance } from './index.ts'

const root = join(import.meta.dirname, '..', '..', '..', '..', '..', '..', '..', '..', '..', '..', '..', '..')
const tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean)

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the repository conforms to every ISO standard its register names, and the register refuses each break by place. */
test('the repository conforms to every ISO standard its register names, and the register refuses each break by place', () => {
  const files = Object.fromEntries(tracked.filter((f) => /README\.md$|(\.test|_test)\.ts$/.test(f)).map((f) => [f, readFileSync(join(root, f), 'utf8')]))
  const rows = isoConformance(files)
  for (const r of rows) assert.deepEqual(r.findings, [], r.standard)
  // each standard refuses what breaks it, by the place it breaks
  const readme = files['README.md']!
  const broken = isoConformance({
    'README.md': readme.replace(/^\| language \| [^|]+ \|$/m, '| language | english |').replace(/^\| issued \| [^|]+ \|$/m, '| issued | 26/11/2026 |').replace(/^\| currency \| [^|]+ \|$/m, '| currency | QPU |').replace('| bytes / B |', '| bytes |').replace(/^\| identifier \| [^|]+ \|\n/m, ''),
    'a.test.ts': "test('a case without its identifier', () => {})\n",
  })
  assert.deepEqual(broken.filter((r) => !r.holds).map((r) => r.standard), ['ISO/IEC/IEEE 29119-3', 'ISO/IEC/IEEE 15289', 'ISO 8601', 'ISO 639-1', 'ISO 4217', 'ISO/IEC 80000'])
  // the language and the units are the standard's own codes
  assert.equal(new Intl.DisplayNames(['en'], { type: 'language', fallback: 'none' }).of(DOCUMENT_LANGUAGE), 'English')
  assert.deepEqual(Object.values(ISO_80000_UNITS), ['B', 'bit', 'J'])
})
