#!/usr/bin/env node
/**
 * Gap discovery, measured. A gap is a fact on disk that the unit can name: a family folder with no test file. Each
 * such family is a development lead. Nothing else is counted: no coverage percentage, no hand-written gap list.
 * The result is written to experiments-results/gap-discovery.json, and the same counts are printed.
 *
 *   npx tsx scripts/gap-discovery-scanner.ts
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const FAMILIES = path.join(ROOT, 'src', 'families')

const families = fs.readdirSync(FAMILIES, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
const missingTest = families.filter((name) => !fs.existsSync(path.join(FAMILIES, name, 'test.ts')))

const reading = {
  kind: 'gap-discovery',
  measured: { families: families.length, withTest: families.length - missingTest.length },
  gaps: missingTest.map((name) => ({ id: `TEST-${name}`, kind: 'family without a test file', family: name, lead: `write src/families/${name}/test.ts` })),
  holds: missingTest.length === 0,
}

const out = path.join(ROOT, 'experiments-results', 'gap-discovery.json')
fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, JSON.stringify(reading, null, 2) + '\n')

console.log(`families: ${reading.measured.families}, with a test file: ${reading.measured.withTest}`)
for (const gap of reading.gaps) console.log(`  ${gap.id}: ${gap.kind} → ${gap.lead}`)
console.log(`written: ${path.relative(ROOT, out)}`)
