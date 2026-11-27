// clay-statements.ts, which the payload door renders from Qpu/General/Clay.lean (the Clay register's own generator).
// Every other file that follows Lean is written by Lean itself: see the tools beside the Lean sources. Run after Lean has written the theorem index, which they read. With --check nothing is written and a
// difference fails: Lean decides, the rendered files follow.
import { PROSE } from '../src/quantum/uuid/programs/5/9/e/4/9/1/a/4/index.ts'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { scripts } from '../src/quantum/uuid/programs/2/f/b/0/0/f/c/e/index.ts'

type Door = { path: string; text: string; says: string }
const root = 'lean'
const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
  .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
  .flatMap((entry) => entry.isDirectory() ? walk(join(dir, entry.name)) : entry.name.endsWith('.lean') ? [join(dir, entry.name)] : [])
const lean = Object.fromEntries(walk(root).map((file) => [file.slice(root.length + 1), readFileSync(file, 'utf8')]))

const check = process.argv.includes('--check')
const doors = [
  scripts({ clay: { lean: lean['Qpu/General/Clay.lean'] } }) as unknown as Door,
]
let drift = 0
for (const door of doors) {
  const agrees = readFileSync(door.path, 'utf8') === door.text
  if (!agrees && !check) writeFileSync(door.path, door.text)
  if (!agrees && check) drift += 1
  console.log(JSON.stringify({ check, agrees, written: !agrees && !check, path: door.path, says: door.says }))
}
if (drift > 0) {
  console.error(PROSE.scriptsLeanDerived_s1)
  process.exit(1)
}
