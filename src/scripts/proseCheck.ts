// `lake run prose`: no sentence is typed in TypeScript. A theorem a sentence names and Lean does not have is reported as a lead. Prose is written in Lean under Qpu/General/Prose and read by
// name from prose-index.ts, so each finding names the file, the line and the sentence to move.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { PROSE } from '../quantum/processing/prose-index.ts'
import { THEOREMS } from '../quantum/processing/theorems-index.ts'
import { findProse, inScope, parse } from './proseFind.ts'

const files = execFileSync('git', ['ls-files', 'src/quantum', 'src/scripts'], { encoding: 'utf8' }).split('\n').filter(inScope)
const findings = files.flatMap((file) => findProse(parse(file, readFileSync(file, 'utf8'))).map((found) => ({ file, line: found.line, text: found.text })))
for (const found of findings.slice(0, 50)) console.error(`${found.file}:${found.line}: ${JSON.stringify(found.text.slice(0, 120))}`)
// a sentence that names a theorem conflicts with Lean when the kernel has no theorem of that name
const kernel = new Set(THEOREMS.map((theorem) => theorem.key))
const conflicts = Object.entries(PROSE).flatMap(([name, text]) => [...new Set(text.match(/\b(?:textbook|relation)_[a-z0-9_]*[a-z0-9]\b/g) ?? [])].filter((cited) => !kernel.has(cited)).map((cited) => ({ name, cited })))
for (const conflict of conflicts.slice(0, 50)) console.error(`${conflict.name}: ${conflict.cited}`)
// a theorem a sentence names and Lean lacks is a lead, a theorem still to prove: it is reported, and nothing is removed for it
const holds = findings.length === 0
console.log(JSON.stringify({ files: files.length, sentencesInTypeScript: findings.length, theoremsNamedAndNotYetProved: [...new Set(conflicts.map((conflict) => conflict.cited))], holds }))
if (findings.length > 0) console.error(PROSE.scriptsProseCheck_s1)
if (conflicts.length > 0) console.error(PROSE.scriptsProseCheck_s2)
if (!holds) process.exit(1)
