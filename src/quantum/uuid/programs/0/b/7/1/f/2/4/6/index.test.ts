import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, join, normalize } from 'node:path'
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

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every relative link in the repository's own documents names a file that exists; the skills the skills lock vendors are their authors' documents and keep their own links. */
test('every relative link in the repository\'s own documents names a file that exists; the skills the skills lock vendors are their authors\' documents and keep their own links', () => {
  // a vendored skill is the one skills-lock.json names, installed under .agents/skills as the skills tool installs it
  const vendored = Object.keys((JSON.parse(readFileSync(join(root, 'skills-lock.json'), 'utf8')) as { skills: Record<string, unknown> }).skills).map((name) => `.agents/skills/${name}/`)
  const documents = tracked.filter((p) => p.endsWith('.md') && !vendored.some((v) => p.startsWith(v)))
  // CommonMark renders no link inside code, a fenced block or a code span, so code is read as text and only the prose's links are links
  const prose = (text: string) => text.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, '').replace(/(`+)[\s\S]*?\1/g, '')
  const dead = documents.flatMap((p) => [...prose(readFileSync(join(root, p), 'utf8')).matchAll(/\]\(([^)#\s]+)(?:#[^)]*)?\)/g)]
    .map((m) => m[1]!).filter((link) => !/^[a-z][a-z0-9+.-]*:/.test(link) && !existsSync(join(root, normalize(join(dirname(p), link)))))
    .map((link) => `${p}: ${link}`))
  assert.deepEqual(dead, [])
  assert.ok(documents.length >= 50 && vendored.length >= 1, `${documents.length} documents, ${vendored.length} vendored skills`)
})
