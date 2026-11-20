// `lake run prose`: no sentence is typed in TypeScript. Prose is written in Lean under Qpu/General/Prose and read by
// name from prose-index.ts, so each finding names the file, the line and the sentence to move.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { PROSE } from '../quantum/processing/prose-index.ts'
import { findProse, inScope, parse } from './proseFind.ts'

const files = execFileSync('git', ['ls-files', 'src/quantum', 'src/scripts'], { encoding: 'utf8' }).split('\n').filter(inScope)
const findings = files.flatMap((file) => findProse(parse(file, readFileSync(file, 'utf8'))).map((found) => ({ file, line: found.line, text: found.text })))
for (const found of findings.slice(0, 50)) console.error(`${found.file}:${found.line}: ${JSON.stringify(found.text.slice(0, 120))}`)
console.log(JSON.stringify({ files: files.length, sentencesInTypeScript: findings.length, holds: findings.length === 0 }))
if (findings.length > 0) {
  console.error(PROSE.scriptsProseCheck_s1)
  process.exit(1)
}
