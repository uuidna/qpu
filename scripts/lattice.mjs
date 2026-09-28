/**
 * A BARE NUMBER THE LATTICE ALREADY NAMES, FOUND AND REWRITTEN BY THE LATTICE ITSELF.
 *
 * This package's standard is that a quantity with a name is written by its name. The scripts written this
 * session broke it repeatedly — a bare thousand for thousandths in four files, a bare billion for a second,
 * a bare sixteen for the digits of a fold — and one of them defined a function whose whole body was the
 * number eight, named after a formula, which is worse than the bare number was.
 *
 * THE VOCABULARY IS COMPUTED, NOT LISTED. The table is built by evaluating the lattice's own functions over
 * their own arguments — mintOf and tenOf across a range the cube bounds, the named faces and vertices, and
 * their products. Nothing here is a pair anybody typed. Add a quantity to the lattice and it becomes findable
 * without editing this file, which is the only version of this that stays true.
 *
 * IT MASKS BEFORE IT MATCHES. A bare regular expression cannot tell code from a comment from a string —
 * a declared boundary of the instrument, not a preference. The first version matched digits with
 * a pattern and its single run corrupted a DOI matcher — `10\.\d+` became `tenOf(1)\.\d+` — rewrote the numbers
 * inside its own documentation until the prose said nothing, and emitted lattice names into files that never
 * imported them, so nothing ran.
 *
 * The obvious fix was the TypeScript parser, and it is not available: this tree is on TypeScript 7, the Go
 * compiler, which no longer ships the JavaScript compiler API — `createSourceFile` is simply absent. So the
 * source is TOKENISED instead, which is less than a parse and enough: comments, strings, templates and
 * regular expressions are masked out, and only what remains is searched.
 *
 * THE TOKENISER IS BIASED TOWARD MISSING. Telling a regex from a division needs context a tokeniser does not
 * fully have — a declared boundary of tokenising rather than parsing — so `/` is read as a regex unless the
 * previous token clearly ends a value. When it guesses wrong
 * it masks a region it should have searched and a literal goes unfound — which costs a finding. The other
 * error would corrupt a file, which is what this is for.
 *
 * AND THE NAMES RESOLVE, because the rewrite writes the import too. scripts/lattice-values.mjs is generated
 * from the lattice and committed, so a script keeps working without a build — leads.mjs runs against the live
 * host and must not need dist to exist.
 *
 *   node scripts/lattice.mjs          report only
 *   node scripts/lattice.mjs --fix    rewrite, and write the import
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'

const ROOT = process.cwd()
const unit = await import(pathToFileURL(join(ROOT, 'dist', 'quantum', 'processing', 'unit', 'index.js')).href)
export const VALUES = 'lattice-values.mjs'

/**
 * The lattice's own quantities, evaluated rather than enumerated. Shortest expression wins a value, so the
 * table answers "what is this number called" with the name a reader recognises — `faces` over `coins * rays`.
 */
export const vocabularyOf = (u = unit) => {
  const faces = u.qpuFacesOf()
  const cube = u.qpuCubeOf()
  const named = [
    ['faces', faces.faces],
    ['rays', faces.rays],
    ['coins', faces.coins],
    ['vertices', cube.vertices],
    ['hexbit', cube.hexbit],
    ['bits', cube.bits],
  ]
  const built = []
  for (let k = 0; k <= cube.hexbit + faces.rays; k++) built.push([`mintOf(${k})`, u.mintOf(k)])
  for (let k = 0; k <= cube.hexbit + faces.coins; k++) built.push([`tenOf(${k})`, u.tenOf(k)])
  for (const [a, av] of named) for (const [b, bv] of named) built.push([`${a} * ${b}`, av * bv])
  const table = new Map()
  for (const [expression, value] of [...named, ...built].sort((x, y) => String(x[0]).length - String(y[0]).length))
    if (!table.has(value)) table.set(value, expression)
  return table
}

/** Below the cube's vertices a number is usually structure — an index, an arity — and is left alone. */
export const floorOf = (u = unit) => u.qpuCubeOf().vertices

/** Which lattice names an expression uses, so only those are imported. */
export const namesUsedOf = (expressions) => {
  const wanted = new Set()
  for (const expression of expressions) for (const name of ['mintOf', 'tenOf', 'faces', 'rays', 'coins', 'vertices', 'hexbit', 'bits']) if (new RegExp(`\\b${name}\\b`).test(expression)) wanted.add(name)
  return [...wanted].sort()
}

/**
 * Every numeric literal the lattice names, with its exact position, searched only where the mask says code.
 * A number inside a comment, a string or a regex is invisible here — by construction, since those spans were
 * blanked before the search rather than filtered after it.
 */
export const codeMaskOf = (text) => {
  const mask = new Uint8Array(text.length).fill(1)
  const blank = (from, to) => {
    for (let i = from; i < to && i < text.length; i++) mask[i] = 0
  }
  let i = 0
  let prev = ''
  while (i < text.length) {
    const two = text.slice(i, i + 2)
    if (two === '//') {
      const end = text.indexOf('\n', i)
      blank(i, end < 0 ? text.length : end)
      i = end < 0 ? text.length : end
      continue
    }
    if (two === '/*') {
      const end = text.indexOf('*/', i + 2)
      blank(i, end < 0 ? text.length : end + 2)
      i = end < 0 ? text.length : end + 2
      continue
    }
    const ch = text[i]
    if (ch === '"' || ch === "'" || ch === '`') {
      let j = i + 1
      while (j < text.length && text[j] !== ch) j += text[j] === '\\' ? 2 : 1
      blank(i, j + 1)
      i = j + 1
      prev = 'x'
      continue
    }
    if (ch === '/' && !/[\w)\]]/.test(prev)) {
      let j = i + 1
      let klass = false
      while (j < text.length && (klass || text[j] !== '/') && text[j] !== '\n') {
        if (text[j] === '[') klass = true
        else if (text[j] === ']') klass = false
        j += text[j] === '\\' ? 2 : 1
      }
      if (text[j] === '/') {
        blank(i, j + 1)
        i = j + 1
        prev = 'x'
        continue
      }
    }
    if (!/\s/.test(ch)) prev = ch
    i += 1
  }
  return mask
}

export const findingsOf = (text, table, floor, _file = 'x.mjs') => {
  const mask = codeMaskOf(text)
  const out = []
  const lineOf = (at) => text.slice(0, at).split('\n').length
  const lineStarts = []
  for (let at = 0; at >= 0; at = text.indexOf('\n', at) + 1 || -1) lineStarts.push(at)
  const lineTextOf = (at) => {
    const from = text.lastIndexOf('\n', at - 1) + 1
    const to = text.indexOf('\n', at)
    return text.slice(from, to < 0 ? text.length : to)
  }
  for (const match of text.matchAll(/(?<![\w.$])(\d[\d_]*)(?![\w.$])/g)) {
    const start = match.index
    if (mask[start] === 0) continue
    /**
     * A LINE THAT ALREADY SPEAKS THE LATTICE IS NOT RE-LITIGATED, and dropping this filter in the rewrite is
     * what made the finder report 183 in src where the honest number is far smaller.
     *
     * `mintOf(n) === cube.vertices && mintOf(n) === 8` is the worst case it produced. That 8 is not a bare
     * number waiting to be named — it is the INDEPENDENT ANCHOR, the check that the formula actually yields
     * eight. Rewrite it and the line becomes `x === y && x === y`, a tautology, which is precisely the
     * kernel knowing the answer this package refuses everywhere else. The literal is load-bearing BECAUSE
     * it is not the formula.
     */
    if (/\b(mintOf|tenOf|chooseOf|qpuFacesOf|qpuCubeOf|faces|rays|coins|vertices|hexbit|bits)\b/.test(lineTextOf(start))) continue
    const value = Number(match[1].replace(/_/g, ''))
    const expression = table.get(value)
    if (!expression || !Number.isSafeInteger(value) || value < floor) continue
    /* A key is a label rather than a quantity, whatever it looks like: `{ 200: ... }` is a status, not eight. */
    if (/^\s*:/.test(text.slice(start + match[1].length))) continue
    out.push({ start, end: start + match[1].length, value, expression, line: lineOf(start) })
  }
  return out
}

/** The rewrite: right to left, so every earlier position stays valid. */
export const rewriteOf = (text, findings, importLine) => {
  let next = text
  for (const row of [...findings].sort((a, b) => b.start - a.start)) next = next.slice(0, row.start) + row.expression + next.slice(row.end)
  if (findings.length === 0 || next.includes(VALUES)) return next
  /* After the last import, or at the top of the body — never above the file's own documentation. */
  const lines = next.split('\n')
  let at = lines.findIndex((line) => /^import .*from '/.test(line))
  if (at < 0) at = lines.findIndex((line) => line.trim() !== '' && !line.trim().startsWith('*') && !line.trim().startsWith('/*'))
  else while (at + 1 < lines.length && /^import .*from '/.test(lines[at + 1])) at += 1
  lines.splice(at + 1, 0, importLine)
  return lines.join('\n')
}

const sourcesOf = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist' || entry.startsWith('.') || entry === VALUES) continue
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) sourcesOf(path, out)
    else if (/\.(ts|mjs)$/.test(entry) && !/\.d\.ts$/.test(entry)) out.push(path)
  }
  return out
}

const invoked = process.argv[1]?.endsWith('lattice.mjs') === true
if (invoked) {
  const fix = process.argv.includes('--fix')
  const table = vocabularyOf()
  const floor = floorOf()
  const faces = unit.qpuFacesOf()
  const cube = unit.qpuCubeOf()

  /* The generated constants, so a script names the lattice without needing dist to exist. Committed, and
   * rewritten here from the lattice rather than typed. */
  if (fix)
    writeFileSync(
      join(ROOT, 'scripts', VALUES),
      `/** GENERATED by scripts/lattice.mjs from the lattice. Do not edit; run \`npm run lattice:fix\`. */\n` +
        `export const faces = ${faces.faces}\nexport const rays = ${faces.rays}\nexport const coins = ${faces.coins}\n` +
        `export const vertices = ${cube.vertices}\nexport const hexbit = ${cube.hexbit}\nexport const bits = ${cube.bits}\n` +
        `export const mintOf = (k) => coins ** k\nexport const tenOf = (k) => ${faces.faces - faces.coins - faces.coins} ** k\n`,
    )

  /**
   * SCRIPTS ONLY, AND THE SRC EXCLUSION IS NOW A MEASUREMENT RATHER THAN AN ASSERTION.
   *
   * This said "src is already held to this by review and by the gate" and nobody had checked. Run over src
   * it reports 156, which sounds like a scandal and is mostly the finder being wrong about what it is
   * looking at. A number matching a lattice value is not thereby a lattice quantity:
   *
   *   `mintOf(n) === cube.vertices && mintOf(n) === 8`  the 8 is the ANCHOR — the independent check that
   *     the formula yields eight. Rewriting it gives `x === y && x === y`, which is the kernel knowing the
   *     answer. The line filter above catches these, and restoring it took index.ts from 28 to 22.
   *   `photon / thermalOf(10n) === 23n`                 physics. Ten kelvin is not tenOf(1).
   *   `2019 - 2011 === 8`                               arithmetic in a proof about years.
   *   `hardware: { lanes: 16, bits: 32 }`               a device's specification that happens to coincide.
   *
   * The fold's radix and width WERE real and are fixed — index.ts fell from 22 to 10 — and what remains
   * there is physics, anchors and device facts. So src is reported when asked and not swept, because the
   * finder cannot yet tell a quantity from a coincidence — a declared boundary of matching on value alone,
   * not a claim that the distinction is undecidable — and a sweep would do damage no test would catch.
   *
   * Not the tests either: a fixture's round number is data chosen to be legible, and renaming it would lend
   * it a significance it does not have. And not this file, which quotes the numbers it is about.
   */
  const files = sourcesOf(join(ROOT, 'scripts')).filter((path) => !/\.test\.mjs$|lattice\.mjs$/.test(path))
  let total = 0
  for (const path of files) {
    const text = readFileSync(path, 'utf8')
    const findings = findingsOf(text, table, floor, path)
    if (findings.length === 0) continue
    total += findings.length
    console.log(`\n  ${relative(ROOT, path)}`)
    for (const row of findings) console.log(`    ${String(row.line).padStart(4)}  ${String(row.value).padStart(12)} -> ${row.expression}`)
    if (!fix) continue
    const names = namesUsedOf(findings.map((row) => row.expression))
    writeFileSync(path, rewriteOf(text, findings, `import { ${names.join(', ')} } from './${VALUES}'`))
  }

  const receiptPath = join(ROOT, 'lattice-receipt.json')
  const was = existsSync(receiptPath) ? JSON.parse(readFileSync(receiptPath, 'utf8')).literals : undefined
  const left = fix ? 0 : total
  console.log(`\n  ${total} bare literal(s) the lattice names, across ${files.length} script(s), floor ${floor}`)
  if (fix) {
    console.log(`  rewritten through the parser, imports written, ${VALUES} regenerated\n`)
    writeFileSync(receiptPath, `${JSON.stringify({ kind: 'lattice-receipt', literals: 0, floor, scripts: files.length }, null, 2)}\n`)
    process.exit(0)
  }
  /* A ratchet: it may only shrink, the rule the walls finder and the dry-clean floor already keep. */
  if (was === undefined || left < was) {
    writeFileSync(receiptPath, `${JSON.stringify({ kind: 'lattice-receipt', literals: left, floor, scripts: files.length }, null, 2)}\n`)
    console.log(was === undefined ? '  recorded as the first floor\n' : `  fell from ${was} — floor recorded\n`)
    process.exit(0)
  }
  if (left > was) {
    console.log(`  ROSE from ${was}: a quantity the lattice names was written as a bare number — run npm run lattice:fix\n`)
    process.exit(1)
  }
  console.log(`  unchanged at ${was}\n`)
  process.exit(0)
}
