// The files the payload doors render from the Lean sources and the kernel's theorem index: BLUEPRINT.md and
// clay-statements.ts. Run after theoremsIndex.ts, which they read. With --check nothing is written and a
// difference fails: Lean decides, the rendered files follow.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { scripts } from '../quantum/processing/script-doors.ts'

type Door = { path: string; text: string; says: string }
const root = 'src/quantum/processing/unit/lean'
const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
  .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
  .flatMap((entry) => entry.isDirectory() ? walk(join(dir, entry.name)) : entry.name.endsWith('.lean') ? [join(dir, entry.name)] : [])
const lean = Object.fromEntries(walk(root).map((file) => [file.slice(root.length + 1), readFileSync(file, 'utf8')]))

const check = process.argv.includes('--check')
const doors = [
  scripts({ blueprint: { lean } }) as unknown as Door,
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
  console.error('files rendered from Lean differ from the Lean sources: run lake run index and commit the result')
  process.exit(1)
}
