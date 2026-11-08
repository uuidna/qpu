// ISO/IEC/IEEE 29119-3 test documentation: each test case has an identifier and a description.
// The description is the inline doc immediately above the test. The same record checks the records.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

type TestCaseDoc = { file: string; line: number; title: string; doc: string | null }

const title = (line: string): string | null => {
  if (!line.startsWith('test(')) return null
  let i = 'test('.length
  while (line[i] === ' ') i++
  const q = line[i]
  if (q !== "'" && q !== '"') return null
  i++
  let title = ''
  while (i < line.length) {
    if (line[i] === '\\') { title += line[i + 1] ?? ''; i += 2; continue }
    if (line[i] === q) return title
    title += line[i++]
  }
  return null
}

const files = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name)
  if (statSync(path).isDirectory()) return name === 'node_modules' || name === 'lean' ? [] : files(path)
  return name.endsWith('_test.ts') || name.endsWith('.test.ts') ? [path] : []
})

/** Every node:test in src, with the inline doc that states it. A missing doc is a test case without its description. */
export const testCaseDocs = (root: string): TestCaseDoc[] => files(root).flatMap((file) => {
  const lines = readFileSync(file, 'utf8').split('\n')
  const rows: TestCaseDoc[] = []
  for (let n = 0; n < lines.length; n++) {
    const heading = title(lines[n]!)
    if (heading === null) continue
    let i = n - 1
    while (i >= 0 && lines[i]!.trim() === '') i--
    const prev = i >= 0 ? lines[i]! : ''
    const closed = prev.trimEnd().endsWith('*/')
    const open = closed ? lines.slice(0, i + 1).map((l) => l.includes('/**')).lastIndexOf(true) : -1
    const doc = closed && open >= 0 ? lines.slice(open, i + 1).join('\n') : null
    rows.push({ file, line: n + 1, title: heading, doc })
  }
  return rows
})

/** The record holds when the description names the standard and the identifier, and the identifier is the test title. */
export const documented = (row: TestCaseDoc): boolean => row.doc !== null && row.doc.includes('ISO/IEC/IEEE 29119-3') && row.doc.includes(row.title)
