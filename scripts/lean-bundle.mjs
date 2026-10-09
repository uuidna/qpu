#!/usr/bin/env node
/**
 * index.lean and the lake root Qpu.lean, written from EVERY Qpu/<Module>.lean discovered on the filesystem — no hand
 * list. Each module names its dependencies by its `import Qpu.X` lines; the modules are emitted in dependency order (a
 * module after every module it imports, alphabetical tiebreak for determinism), imports stripped and bodies concatenated
 * into one namespace. Add a module file and it bundles; `npm run lean` then proves it. `--check` exits 1 when index.lean
 * or Qpu.lean differs from what the modules give.
 *   node scripts/lean-bundle.mjs [--check]
 */
import fs from 'node:fs'

const dir = 'src/quantum/processing/unit/lean/Qpu'
const modules = fs.readdirSync(dir).filter((f) => f.endsWith('.lean')).map((f) => f.slice(0, -'.lean'.length))
const set = new Set(modules)
const depsOf = (m) => [...new Set([...fs.readFileSync(`${dir}/${m}.lean`, 'utf8').matchAll(/^import Qpu\.(\w+)/gm)].map((x) => x[1]).filter((d) => set.has(d)))]
// deterministic dependency order: depth-first, deps (sorted) before the module, over the modules in alphabetical order
const order = []
const done = new Set()
const emit = (m, stack = new Set()) => {
  if (done.has(m)) return
  if (stack.has(m)) throw new Error(`lean-bundle: import cycle through ${m}`)
  stack.add(m)
  for (const d of depsOf(m).sort()) emit(d, stack)
  stack.delete(m)
  done.add(m)
  order.push(m)
}
for (const m of [...modules].sort()) emit(m)

const index = order.map((m) => fs.readFileSync(`${dir}/${m}.lean`, 'utf8').split('\n').filter((l) => !l.startsWith('import ')).join('\n').trim()).join('\n\n') + '\n'
const root = order.map((m) => `import Qpu.${m}`).join('\n') + '\n'
const indexPath = 'src/quantum/processing/unit/index.lean'
const rootPath = `${dir}.lean`

if (process.argv.includes('--check')) {
  const okIndex = fs.existsSync(indexPath) && fs.readFileSync(indexPath, 'utf8') === index
  const okRoot = fs.existsSync(rootPath) && fs.readFileSync(rootPath, 'utf8') === root
  console.log(okIndex && okRoot ? 'index.lean matches the modules' : 'index.lean differs from the modules')
  process.exit(okIndex && okRoot ? 0 : 1)
}
fs.writeFileSync(indexPath, index)
fs.writeFileSync(rootPath, root)
console.log(JSON.stringify({ modules: order.length, theorems: (index.match(/^theorem /gm) ?? []).length, definitions: (index.match(/^def /gm) ?? []).length }))
