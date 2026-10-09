#!/usr/bin/env node
/**
 * THEOREMS IN CODE, NOT HARDCODED CONSTANTS. Lean feeds the rest: a value a theorem proves is written in the families as
 * the lattice name the unit exports, never as a bare literal. This codemod sweeps every family and rewrites the degree
 * constants the Lean module Qpu.Pi proves — 180 (pi_half_turn) and 360 (pi_turn_degrees) — to the lattice names
 * `halfTurn` / `fullTurn` from qpuLatticeNamesOf().
 *
 * It only rewrites CODE idioms (ASCII operators: `* 360`, `% 360`, `Math.PI / 180`, the angle-wheel ± ops). It never
 * touches the `·`-middot formula strings (those are the receipt's prose) and never a bare `/ 180` that is not a
 * degree→radian conversion (e.g. a time ratio like testTime / 180), so no value changes — 180 and 360 are preserved
 * exactly, now sourced from the theorem instead of typed in.
 *
 *   node scripts/theorem-constants.mjs           rewrite in place, report
 *   node scripts/theorem-constants.mjs --check   report only, exit 1 if any family still hardcodes an angle
 */
import fs from 'node:fs'
import path from 'node:path'

const SRC = path.resolve(import.meta.dirname, '..', 'src', 'families')
const UNIT = "'../../quantum/processing/unit/index.js'"
const check = process.argv.includes('--check')

// each rule: a code-only regex (ASCII operators, never the `·` middot of a formula string) and its lattice name.
const RULES = [
  [/\* 360\b/g, '* fullTurn', 'fullTurn'],          // path · 360 / wavelength  (phase, hue, conduction, phasedifference)
  [/% 360\b/g, '% fullTurn', 'fullTurn'],            // deg % 360                (angle wheel)
  [/([+\-]=?) 360\b/g, '$1 fullTurn', 'fullTurn'],   // d += 360 / d -= 360 / d + 360 / d - 360
  [/= 360 \//g, '= fullTurn /', 'fullTurn'],         // GATE_ARC = 360 / GATES
  [/Math\.PI\) \/ 180\b/g, 'Math.PI) / halfTurn', 'halfTurn'],  // (deg * Math.PI) / 180  (degree → radian)
  [/Math\.PI \/ 180\b/g, 'Math.PI / halfTurn', 'halfTurn'],
  [/> 180\b/g, '> halfTurn', 'halfTurn'],            // if (d > 180)             (shortest signed turn)
  [/-180\b/g, '-halfTurn', 'halfTurn'],              // if (d <= -180)
]

/** Put qpuLatticeNamesOf into the unit import, and a `const { halfTurn, fullTurn } = qpuLatticeNamesOf()` binding for the
 *  names used, right after the import block. Idempotent. */
const ensureBinding = (src, needed) => {
  let out = src
  if (/const \{[^}]*\} = qpuLatticeNamesOf\(\)/.test(out)) {
    // extend the existing destructure with any missing names
    out = out.replace(/const \{([^}]*)\} = qpuLatticeNamesOf\(\)/, (m, inner) => {
      const have = new Set(inner.split(',').map((s) => s.trim()).filter(Boolean))
      for (const nm of needed) have.add(nm)
      return `const { ${[...have].sort().join(', ')} } = qpuLatticeNamesOf()`
    })
  } else {
    const bind = `const { ${[...needed].sort().join(', ')} } = qpuLatticeNamesOf()`
    const lines = out.split('\n')
    let last = -1
    for (let i = 0; i < lines.length; i++) if (/^import /.test(lines[i])) last = i
    lines.splice(last + 1, 0, '', bind)
    out = lines.join('\n')
  }
  // make sure the symbol is imported from the unit
  if (!/qpuLatticeNamesOf/.test(out.split('\n').filter((l) => l.includes('qpuLatticeNamesOf')).join(''))) { /* bound but not imported */ }
  if (new RegExp(`import \\{[^}]*\\} from ${UNIT.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(out) && !/qpuLatticeNamesOf[^=]/.test(out.split('qpuLatticeNamesOf()')[0] ?? out)) {
    out = out.replace(new RegExp(`import \\{([^}]*)\\} from ${UNIT.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), (m, inner) =>
      inner.includes('qpuLatticeNamesOf') ? m : `import {${inner.replace(/\s*$/, '')}, qpuLatticeNamesOf } from ${UNIT}`)
  } else if (!new RegExp(`from ${UNIT.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(out)) {
    out = `import { qpuLatticeNamesOf } from ${UNIT}\n` + out
  }
  return out
}

/** Mask every string literal AND comment (the formula prose, ids, names, docs live in these) so the rules touch CODE
 *  only — never the receipt's text or a doc comment — then restore. */
const SKIP = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g
const applyToCodeOnly = (src, needed) => {
  const held = []
  const masked = src.replace(SKIP, (m) => { held.push(m); return `\u0000${held.length - 1}\u0000` })
  let next = masked
  for (const [re, to, name] of RULES) if (re.test(next)) { next = next.replace(re, to); needed.add(name) }
  return next.replace(/\u0000(\d+)\u0000/g, (_, i) => held[Number(i)])
}

let changed = 0
const dirty = []
for (const fam of fs.readdirSync(SRC)) {
  const file = path.join(SRC, fam, 'index.ts')
  if (!fs.existsSync(file)) continue
  let src = fs.readFileSync(file, 'utf8')
  const needed = new Set()
  let next = applyToCodeOnly(src, needed)
  if (needed.size === 0) continue
  next = ensureBinding(next, needed)
  if (next !== src) {
    dirty.push(fam)
    if (!check) fs.writeFileSync(file, next)
    changed++
  }
}
console.log(`${check ? 'would rewrite' : 'rewrote'} ${changed} famil${changed === 1 ? 'y' : 'ies'} to lattice turns (halfTurn/fullTurn): ${dirty.join(', ') || '(none)'}`)
if (check && changed > 0) process.exit(1)
