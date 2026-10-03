#!/usr/bin/env node
/**
 * Cooling, as the heat family prescribes it: a hot file is split along the regions that keep changing, so the hot
 * part has a file of its own and the rest goes cold (theorem cooling_stays_positive: what is split stays whole).
 *
 *   node scripts/cool.mjs <file> <module> <declaration> [declaration ...]
 *
 * Moves each named top-level declaration of <file>, with the comments above it, into <module>.ts beside it, verbatim.
 * The module imports what it reads from <file> and its siblings; <file> imports back what it still uses, re-exports
 * what was exported (its public surface does not change), and shares the internals the module reads through one
 * `export { … }` list (not `export const`, so they are not counted as documented capabilities). The modules form a
 * cycle with <file>, which is safe because what they call while loading is hoisted (function declarations).
 */
import fs from 'node:fs'
import path from 'node:path'

const [file, moduleName, ...names] = process.argv.slice(2)
if (!file || !moduleName || !names.length) {
  console.error('usage: node scripts/cool.mjs <file> <module> <declaration> [declaration ...]')
  process.exit(2)
}
const dir = path.dirname(file)
const base = `./${path.basename(file, '.ts')}.js`
const target = path.join(dir, `${moduleName}.ts`)
const L = fs.readFileSync(file, 'utf8').split('\n')

const DECL = /^(export )?(?:async )?(const|let|function\*?|class|type|interface|enum)\s+([A-Za-z0-9_]+|\{[^}]*\}|\[[^\]]*\])/
const IDS = /\b[A-Za-z_$][A-Za-z0-9_$]*\b/g
// comments and plain strings carry no references; template literals are kept, their ${…} are code
const strip = (code) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1').replace(/(['"])(?:\\.|(?!\1)[^\\\n])*\1/g, '""')

// lines that open inside a template literal are its text, not declarations: walk the backticks, skipping comments,
// quoted strings and ${…} nesting, and mark each line by whether it starts inside one
const inTemplateOf = (lines) => {
  const inside = []
  let depth = 0, brace = []
  for (const line of lines) {
    inside.push(depth > 0 && brace.at(-1) === 0)
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      const code = depth === 0 || brace.at(-1) > 0
      if (code && c === '/' && line[i + 1] === '/') break
      if (code && c === '/' && line[i + 1] === '*') { const e = line.indexOf('*/', i + 2); if (e < 0) break; i = e + 1; continue }
      // a regex literal where an operand may start: skip to its closing slash, past escapes and character classes
      if (code && c === '/' && /(^|[(,=:[!&|?{};+\-*%~^<>]|\breturn)\s*$/.test(line.slice(0, i))) {
        let cls = false
        for (i++; i < line.length; i++) { if (line[i] === '\\') { i++; continue } if (line[i] === '[') cls = true; else if (line[i] === ']') cls = false; else if (line[i] === '/' && !cls) break }
        continue
      }
      if (code && (c === "'" || c === '"')) { const q = c; i++; while (i < line.length && line[i] !== q) i += line[i] === '\\' ? 2 : 1; continue }
      if (c === '\\') { i++; continue }
      if (c === '`') { if (code) { depth++; brace.push(0) } else { depth--; brace.pop() } continue }
      if (!code && c === '$' && line[i + 1] === '{') { brace[brace.length - 1]++; i++; continue }
      if (depth > 0 && brace.at(-1) > 0 && c === '{') brace[brace.length - 1]++
      if (depth > 0 && brace.at(-1) > 0 && c === '}') brace[brace.length - 1]--
    }
  }
  return inside
}
const templated = inTemplateOf(L)

// top-level declarations: each starts at its leading comments and ends where the next one's start
const starts = []
L.forEach((line, i) => {
  const m = templated[i] ? null : DECL.exec(line)
  if (!m) return
  let s = i
  while (s > 0 && /^\s*(\/\/|\/\*\*|\*|\*\/)/.test(L[s - 1])) s--
  const bound = /^[{[]/.test(m[3]) ? m[3].slice(1, -1).split(',').map((x) => x.split(':').pop().split('=')[0].trim()).filter(Boolean) : [m[3]]
  starts.push({ name: bound[0], also: bound.slice(1), exported: Boolean(m[1]), kind: m[2], at: i, from: s })
})
const segments = starts.map((d, k) => ({ ...d, to: k + 1 < starts.length ? starts[k + 1].from : L.length }))
const byName = new Map(segments.map((s) => [s.name, s]))
const missing = names.filter((n) => !byName.has(n))
if (missing.length) {
  console.error(`not top-level declarations of ${file}: ${missing.join(', ')}`)
  process.exit(1)
}
const moving = segments.filter((s) => names.includes(s.name))
const movingSet = new Set(names)
// refuse what cannot move verbatim: another top-level statement inside a segment would be carried along with it
for (const s of moving) {
  const stray = L.slice(s.at + 1, s.to).find((line, k) => !templated[s.at + 1 + k] && /^[A-Za-z_$]/.test(line) && !/^(export )?(?:async )?(const|let|function|class|type|interface|enum)\b/.test(line))
  if (stray) {
    console.error(`${s.name} is followed by another top-level statement, which would move with it: ${stray.slice(0, 80)}`)
    process.exit(1)
  }
}
const movedText = moving.map((s) => L.slice(s.from, s.to).join('\n').replace(/\n+$/, '')).join('\n\n')
const restLines = L.filter((_, i) => !moving.some((s) => i >= s.from && i < s.to))
const rest = restLines.join('\n')

// what each side reads of the other
const tops = new Map(segments.filter((s) => !movingSet.has(s.name)).flatMap((s) => [s.name, ...s.also].map((n) => [n, s])))
const used = (code) => new Set(strip(code).match(IDS) ?? [])
const movedUses = used(movedText)
const restUses = used(rest)
const fromFile = [...movedUses].filter((n) => tops.has(n)).sort()
const fromFileTypes = fromFile.filter((n) => ['type', 'interface'].includes(tops.get(n).kind))
const fromFileValues = fromFile.filter((n) => !fromFileTypes.includes(n))
const internals = fromFile.filter((n) => !tops.get(n).exported)
const backUsed = moving.filter((s) => restUses.has(s.name)).map((s) => s.name)
// an imported binding is read-only: neither side may assign to a `let` the other one holds
const assigns = (code, name) => new RegExp(`(?<![.\\w$])${name}\\s*(=(?!=)|\\+=|-=|\\*=|\\?\\?=|\\+\\+|--)`).test(strip(code))
const written = [...fromFile.filter((n) => tops.get(n).kind === 'let' && assigns(movedText, n)), ...moving.filter((s) => s.kind === 'let' && assigns(rest, s.name)).map((s) => s.name)]
if (written.length) {
  console.error(`assigned across the split (an import is read-only): ${written.join(', ')}`)
  process.exit(1)
}
const reexport = moving.filter((s) => s.exported).map((s) => s.name)

// sibling imports the moved code needs, copied from the file's own import lines
const siblingImports = []
for (const [k, line] of L.entries()) {
  if (templated[k]) continue
  const m = /^import (type )?\{([^}]*)\} from '([^']+)'/.exec(line)
  if (!m) continue
  const parts = m[2].split(',').map((p) => p.trim()).filter(Boolean)
  const take = parts.filter((p) => movedUses.has(p.replace(/^type /, '').split(' as ').pop().trim()))
  if (take.length) siblingImports.push(`import ${m[1] ?? ''}{ ${take.join(', ')} } from '${m[3]}'`)
}

// the module: the moved declarations verbatim, those not exported but read back by the file now exported
let moduleText = movedText
for (const s of moving) if (!s.exported && backUsed.includes(s.name)) moduleText = moduleText.replace(new RegExp(`^(async )?(const|let|function\\*?|class|type|interface|enum) ${s.name}\\b`, 'm'), (m) => `export ${m}`)
const header = `// Cooled out of ${path.basename(file)} by the heat family (scripts/cool.mjs): ${names.join(', ')}.`
const imports = [
  fromFileValues.length ? `import {\n  ${fromFileValues.join(',\n  ')},\n} from '${base}'` : '',
  fromFileTypes.length ? `import type { ${fromFileTypes.join(', ')} } from '${base}'` : '',
  ...siblingImports,
].filter(Boolean)
fs.writeFileSync(target, `${header}\n${imports.join('\n')}\n\n${moduleText}\n`)

// the file: imports back what it reads, re-exports what was exported, shares the internals the module reads
let out = rest
// wiring goes at the end of the leading import block, before the first declaration
const firstDecl = restLines.findIndex((line) => DECL.test(line))
const lastImport = restLines.slice(0, firstDecl < 0 ? restLines.length : firstDecl).reduce((k, line, i) => (/^(import|export \* from|export \{[^}]*\} from)/.test(line) ? i : k), -1)
const wiring = [
  backUsed.length ? `import { ${backUsed.join(', ')} } from './${moduleName}.js'` : '',
  reexport.length ? `export { ${reexport.join(', ')} } from './${moduleName}.js'` : '',
].filter(Boolean)
const lines = out.split('\n')
lines.splice(lastImport + 1, 0, ...wiring)
out = lines.join('\n')
const shared = /\n\/\/ what the router reads from this module and does not export as a capability\nexport \{\n([\s\S]*?)\n\}/
const SHARED_HEAD = '\n// what the cooled modules read from this module and do not export as a capability\nexport {\n'
const existing = (shared.exec(out) ?? /\n\/\/ what the cooled modules read from this module and do not export as a capability\nexport \{\n([\s\S]*?)\n\}/.exec(out))
const have = existing ? existing[1].split(',').map((x) => x.trim()).filter(Boolean) : []
const all = [...new Set([...have, ...internals])].sort()
const block = `${SHARED_HEAD}  ${all.join(',\n  ')},\n}`
if (all.length) out = existing ? out.replace(existing[0], block) : `${out.replace(/\n+$/, '')}\n${block}\n`
fs.writeFileSync(file, out)

console.log(JSON.stringify({ moved: names, lines: movedText.split('\n').length, to: target, imports: fromFileValues.length + fromFileTypes.length, internals: internals.length, backUsed, reexport }))
