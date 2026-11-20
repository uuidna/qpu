// Lean is the source of the theorem index. This client runs the Lean script the payload door answers against the
// kernel's own environment, hands the output back to the door, and writes src/quantum/processing/theorems-index.ts.
// With --check it writes nothing and fails when the committed index differs from what the kernel reports.
import { PROSE, proseFill } from '../quantum/processing/prose-index.ts'
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { scripts } from '../quantum/processing/script-doors.ts'

type Door = { path: string; lean?: string; text?: string; holds?: boolean; says: string }
const door = (output?: string) => scripts({ theoremsIndex: { output } }) as unknown as Door

const check = process.argv.includes('--check')
const asked = door()
mkdirSync('.lake/build', { recursive: true })
writeFileSync('.lake/build/theorems.lean', asked.lean ?? '')
const output = execFileSync('lake', ['env', 'lean', '.lake/build/theorems.lean'], { encoding: 'utf8', maxBuffer: 1 << 28 })
const answer = door(output)
if (!answer.holds || !answer.text) {
  console.error(JSON.stringify({ holds: false, says: answer.says }))
  process.exit(1)
}
const committed = readFileSync(answer.path, 'utf8')
const agrees = committed === answer.text
if (check) {
  console.log(JSON.stringify({ check, agrees, path: answer.path, says: answer.says }))
  if (!agrees) {
    console.error(proseFill(PROSE.scriptsTheoremsIndex_s1, answer.path))
    process.exit(1)
  }
} else {
  if (!agrees) writeFileSync(answer.path, answer.text)
  console.log(JSON.stringify({ check, written: !agrees, path: answer.path, says: answer.says }))
}
