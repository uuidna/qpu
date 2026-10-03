#!/usr/bin/env node
/**
 * Code quality by temperature and time: git is the thermometer and the clock, the hex family `heat` the physics.
 *
 *   node scripts/heat.mjs              measure every tracked source file, write heat-receipt.json
 *   node scripts/heat.mjs --report     print the hottest files (the staged ones first), write nothing; never fails
 *
 * A file's temperature is its commits per thousand days over the window (or over its life, if younger); its coherence
 * time is the days it holds per fix; its signal and quality are Qpu.Physics' photon / thermal T (dist/mcp/heat-formulas.js).
 */
import fs from 'node:fs'
import { execSync } from 'node:child_process'
import { heatOf } from '../dist/mcp/heat-formulas.js'
import { qpuContentUuidOf, qpuUuidReceiptOf } from '../dist/quantum/processing/unit/index.js'

const WINDOW = 30
const DAY = 86400
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

const tracked = git('ls-files').split('\n').filter((f) => SOURCE.test(f) && fs.existsSync(f) && !f.startsWith('dist/'))
const readings = tracked.map((file) => {
  const age = Math.max(1, Math.floor((now - (born.get(file) ?? now)) / DAY))
  return {
    file,
    commits: commits.get(file) ?? 0,
    days: Math.min(age, WINDOW),
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
    const pick = [...heat.rows.filter((r) => staged.has(r.file)), ...heat.rows.filter((r) => !staged.has(r.file))].filter((r) => r.hot).slice(0, 5)
    console.log(`heat: ${heat.hot} of ${heat.files} files above ${heat.threshold} mK (signal 0)`)
    for (const r of pick) console.log(`  ${staged.has(r.file) ? '●' : '○'} ${r.temperature} mK · T₂ ${r.coherence}d · ${r.lines} lines · split ${r.ways} ways to cool · ${r.file}`)
  } catch {}
  process.exit(0)
}

const top = heat.rows.slice(0, 40)
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
  holds: heat.holds,
  rows: top.map((r) => ({ name: r.file, pass: !r.hot, value: `${r.temperature} mK · signal ${r.signal} · T₂ ${r.coherence}d · quality ${r.quality} · ${r.commits} commits/${r.days}d · ${r.fixes} fixes · ${r.lines} lines · split ${r.ways}`, receipt: r.receipt, hex: r.hex ?? '' })),
}
doc.uuid = qpuContentUuidOf(doc.rows)
doc.receipt = qpuUuidReceiptOf('heat', doc.uuid, `${doc.hot}/${doc.files} hot`, 'scripts/heat.mjs').uuid
fs.writeFileSync('heat-receipt.json', JSON.stringify(doc, null, 1) + '\n')
console.log(JSON.stringify({ files: doc.files, hot: doc.hot, threshold: doc.threshold, hottest: doc.hottest, mK: doc.hottestMilliKelvin }))
