#!/usr/bin/env node
/**
 * The textbook-literal report, measured. For every family, each numeric literal in its code (not in comments or strings)
 * is listed with its line and value. Nothing is rewritten: a literal becomes a cross formula only after a person has said
 * it is a textbook constant, so this is the list that decision is made from.
 * The result is written to experiments-results/literals.json, and the totals are printed.
 *
 *   npx tsx scripts/literals.ts
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const FAMILIES = path.join(ROOT, 'src', 'families')

// the source without comments and strings, one line per source line, so line numbers still match
const codeOnly = (s: string): string[] => {
  const out: string[] = []
  let inBlock = false
  for (const line of s.split('\n')) {
    let text = ''
    for (let i = 0; i < line.length; i++) {
      const two = line.slice(i, i + 2)
      if (inBlock) {
        if (two === '*/') { inBlock = false; i++ }
        continue
      }
      if (two === '/*') { inBlock = true; i++; continue }
      if (two === '//') break
      const ch = line[i]
      if (ch === "'" || ch === '"' || ch === '`') {
        const end = line.indexOf(ch, i + 1)
        i = end < 0 ? line.length : end
        text += ' '
        continue
      }
      text += ch
    }
    out.push(text)
  }
  return out
}

const families = fs.readdirSync(FAMILIES, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
const rows: { family: string; line: number; value: string }[] = []
for (const name of families) {
  const file = path.join(FAMILIES, name, 'index.ts')
  if (!fs.existsSync(file)) continue
  codeOnly(fs.readFileSync(file, 'utf8')).forEach((text, i) => {
    for (const m of text.matchAll(/(?<![\w.])(\d+)(?![\w.])/g)) rows.push({ family: name, line: i + 1, value: m[1] })
  })
}

const byValue: Record<string, number> = {}
for (const r of rows) byValue[r.value] = (byValue[r.value] ?? 0) + 1
const familiesWithLiterals = new Set(rows.map((r) => r.family)).size

const reading = {
  kind: 'literals',
  families: families.length,
  familiesWithLiterals,
  occurrences: rows.length,
  distinctValues: Object.keys(byValue).length,
  topValues: Object.entries(byValue).sort((a, b) => b[1] - a[1]).slice(0, 15),
  rows,
  decision: 'each literal is a candidate only; a textbook constant is replaced by a cross formula after its family says so',
}

const out = path.join(ROOT, 'experiments-results', 'literals.json')
fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, JSON.stringify(reading, null, 2) + '\n')

console.log(`families: ${reading.families}, with literals: ${reading.familiesWithLiterals}`)
console.log(`occurrences: ${reading.occurrences}, distinct values: ${reading.distinctValues}`)
console.log(`top values: ${reading.topValues.map(([v, n]) => `${v}×${n}`).join(', ')}`)
console.log(`written: ${path.relative(ROOT, out)}`)
