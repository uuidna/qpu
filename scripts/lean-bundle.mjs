#!/usr/bin/env node
/**
 * index.lean, written from the family modules (src/quantum/processing/unit/lean/Qpu/<Family>.lean) in import order with
 * their import lines dropped — one standalone file the unit serves and `lean` checks, identical in every declaration to
 * the modules `lake build` checks.   node scripts/lean-bundle.mjs [--check]
 */
import fs from 'node:fs'
import { FAMILIES } from './lean-split.mjs'
const dir = 'src/quantum/processing/unit/lean/Qpu'
const text = FAMILIES.map(([f]) => fs.readFileSync(`${dir}/${f}.lean`, 'utf8').split('\n').filter((l) => !l.startsWith('import ')).join('\n').trim()).join('\n\n') + '\n'
const out = 'src/quantum/processing/unit/index.lean'
if (process.argv.includes('--check')) {
  const same = fs.readFileSync(out, 'utf8') === text
  console.log(same ? 'index.lean matches the modules' : 'index.lean differs from the modules')
  process.exit(same ? 0 : 1)
}
fs.writeFileSync(out, text)
console.log(`index.lean: ${FAMILIES.length} modules, ${(text.match(/^theorem /gm) ?? []).length} theorems, ${(text.match(/^def /gm) ?? []).length} definitions`)
