#!/usr/bin/env node
/**
 * Code quality by temperature and time: git is the thermometer and the clock, the hex family `heat` the physics.
 *
 *   node scripts/heat.mjs              measure every tracked source file, write heat-receipt.json
 *   node scripts/heat.mjs --report     print the hottest files (the staged ones first), write nothing; never fails
 *
 * A file's temperature is its commits per thousand days over the window, whatever its age; its coherence
 * time is the days it holds per fix; its signal and quality are Qpu.Physics' photon / thermal T (dist/mcp/heat-formulas.js).
 */
import fs from 'node:fs'
import { execSync } from 'node:child_process'
import { heatOf } from '../dist/families/heat/index.js'
import { qpuContentUuidOf, qpuUuidReceiptOf, qpuLatticeNamesOf, tenOf } from '../dist/quantum/processing/unit/index.js'
const L = { ...qpuLatticeNamesOf(), tenOf }

const WINDOW = L.n * L.tenOf(L.seed)
const DAY = 86400 // SI: seconds in a day, not a lattice quantity
const SOURCE = /\.(ts|tsx|mjs|lean)$/
const FIX = /\b(fix|fixes|fixed|repair|broke|broken|revert|restore|hotfix)\b/i
const git = (args) => execSync(`git ${args}`, { encoding: 'utf8', maxBuffer: 1 << 28 })
const now = Math.floor(Date.now() / 1000)

// one pass over history, oldest first: each commit's time and subject, then the files it touched; a rename carries the
// file's history to its new path, so moving a file does not make it young
const born = new Map(), last = new Map(), commits = new Map(), fixes = new Map()
const carry = (from, to) => {
  for (const m of [born, last, commits, fixes]) if (m.has(from)) { m.set(to, m.get(from)); m.delete(from) }
}
let at = 0, fix = false
for (const row of git('log --reverse -M --format=%x00%ct%x09%s --name-status').split('\n')) {
  if (row.startsWith('\0')) {
    const [t, ...subject] = row.slice(1).split('\t')
    at = Number(t)
    fix = FIX.test(subject.join('\t'))
    continue
  }
  const [status, a, b] = row.split('\t')
  if (!status || !a) continue
  if (status.startsWith('R') && b) carry(a, b)
  const line = b ?? a
  if (status === 'D' || !SOURCE.test(line)) continue
  if (!born.has(line)) born.set(line, at)
  last.set(line, at)
  if (now - at <= WINDOW * DAY) {
    commits.set(line, (commits.get(line) ?? 0) + 1)
    if (fix) fixes.set(line, (fixes.get(line) ?? 0) + 1)
  }
}

// a generated file carries its source's heat, not its own: it follows the file it is generated from and is not measured
const generated = (f) => /\bgenerated\b/i.test(fs.readFileSync(f, 'utf8').split('\n').slice(0, 8).join('\n'))
// --regions <file>: where in one file the heat sits — each of the window's commits mapped, through its diff, onto the
// top-level declarations it changed; the hottest are what scripts/cool.mjs should move out
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
const regionsOf = (file) => {
  const DECL = /^(?:export )?(?:async )?(?:const|let|function\*?|class|type|interface|enum)\s+([A-Za-z0-9_]+)/
  const commitsOf = git(`log --since=${WINDOW}.days --format=%H -- "${file}"`).split('\n').filter(Boolean)
  const heat = new Map()
  for (const sha of commitsOf) {
    let after
    try { after = git(`show ${sha}:"${file}"`).split('\n') } catch { continue }
    const templated = inTemplateOf(after)
    const starts = after.flatMap((line, i) => { const m = templated[i] ? null : DECL.exec(line); return m ? [{ at: i + 1, name: m[1] }] : [] })
    const owner = (ln) => { let k = -1; for (let j = 0; j < starts.length && starts[j].at <= ln; j++) k = j; return k >= 0 ? starts[k].name : '(head)' }
    const names = new Set()
    for (const m of git(`show --unified=0 --format= ${sha} -- "${file}"`).matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)) {
      const a = Number(m[1]), c = Number(m[2] ?? 1)
      for (let ln = a; ln < a + Math.max(c, 1); ln++) names.add(owner(ln))
    }
    for (const n of names) heat.set(n, (heat.get(n) ?? 0) + 1)
  }
  return { file, commits: commitsOf.length, regions: [...heat].sort((a, b) => b[1] - a[1]).map(([name, commits]) => ({ name, commits, temperature: heatOf([{ file: name, commits, days: WINDOW, fixes: 0, lines: 0, age: WINDOW, since: 0 }]).rows[0].temperature })) }
}
if (process.argv.includes('--regions')) {
  const r = regionsOf(process.argv[process.argv.indexOf('--regions') + 1])
  console.log(`${r.file}: ${r.commits} commits in ${WINDOW} days`)
  for (const x of r.regions.slice(0, L.coins * L.tenOf(L.seed))) console.log(`  ${String(x.commits).padStart(3)} commits · ${x.temperature} mK · ${x.name}`)
  process.exit(0)
}

const tracked = git('ls-files').split('\n').filter((f) => SOURCE.test(f) && fs.existsSync(f) && !f.startsWith('dist/'))
const followers = tracked.filter(generated)
const readings = tracked.filter((f) => !followers.includes(f)).map((file) => {
  const age = Math.max(1, Math.floor((now - (born.get(file) ?? now)) / DAY))
  return {
    file,
    commits: commits.get(file) ?? 0,
    // the window is the exposure: a young file is measured over the same days as an old one, so a split's new files
    // read what they carry, not hot for being new
    days: WINDOW,
    fixes: fixes.get(file) ?? 0,
    lines: fs.readFileSync(file, 'utf8').split('\n').length,
    age,
    since: Math.floor((now - (last.get(file) ?? now)) / DAY),
  }
})
const heat = heatOf(readings)

if (process.argv.includes('--report')) {
  try {
    const staged = new Set(git('diff --cached --name-only').split('\n').filter(Boolean))
    const pick = [...heat.rows.filter((r) => staged.has(r.file)), ...heat.rows.filter((r) => !staged.has(r.file))].filter((r) => r.hot).slice(0, L.hexbit + L.seed)
    console.log(`heat: ${heat.hot} of ${heat.files} files above ${heat.threshold} mK (signal 0)`)
    for (const r of pick) console.log(`  ${staged.has(r.file) ? '●' : '○'} ${r.temperature} mK · T₂ ${r.coherence}d · ${r.lines} lines · split ${r.ways} ways to cool · ${r.file}`)
  } catch {}
  process.exit(0)
}

const top = heat.rows.slice(0, L.hexbit * L.tenOf(L.seed))
const doc = {
  kind: 'heat-receipt',
  when: new Date().toISOString().slice(0, 10),
  window: WINDOW,
  threshold: heat.threshold,
  files: heat.files,
  hot: heat.hot,
  cold: heat.files - heat.hot,
  hottest: top[0]?.file ?? 'none',
  hottestMilliKelvin: top[0]?.temperature ?? 0,
  followers: followers.length,
  holds: heat.holds,
  rows: top.map((r) => ({ name: r.file, pass: !r.hot, value: `${r.temperature} mK · signal ${r.signal} · T₂ ${r.coherence}d · quality ${r.quality} · ${r.commits} commits/${r.days}d · ${r.fixes} fixes · ${r.lines} lines · split ${r.ways}`, receipt: r.receipt, hex: r.hex ?? '' })),
}
doc.uuid = qpuContentUuidOf(doc.rows)
doc.receipt = qpuUuidReceiptOf('heat', doc.uuid, `${doc.hot}/${doc.files} hot`, 'scripts/heat.mjs').uuid
fs.writeFileSync('heat-receipt.json', JSON.stringify(doc, null, 1) + '\n')
console.log(JSON.stringify({ files: doc.files, hot: doc.hot, threshold: doc.threshold, hottest: doc.hottest, mK: doc.hottestMilliKelvin }))
