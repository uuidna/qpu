// Qpu/General/Textbook.lean is written in Lean. This renders textbook-index.ts from its text, and runs first: the
// other Lean-rendered files import the textbook, so this script imports nothing that reads the index.
// With --check nothing is written and a difference fails.
import { PROSE, proseFill } from '../quantum/processing/prose-index.ts'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { textbookIndex } from '../quantum/processing/textbook-parse.ts'

const check = process.argv.includes('--check')
const door = textbookIndex(readFileSync('src/quantum/processing/unit/lean/Qpu/General/Textbook.lean', 'utf8'))
const agrees = existsSync(door.path) && readFileSync(door.path, 'utf8') === door.text
if (!agrees && !check) writeFileSync(door.path, door.text)
console.log(JSON.stringify({ check, agrees, written: !agrees && !check, path: door.path, says: door.says }))
if (!agrees && check) {
  console.error(proseFill(PROSE.scriptsTextbookIndex_s1, door.path))
  process.exit(1)
}
