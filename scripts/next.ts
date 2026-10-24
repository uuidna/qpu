#!/usr/bin/env node
// npm run next: ask the unit what is next and run it. train names the next door and the climb after it; this runs them
// recognition-first against the deployed host (HTTP/MCP only, token-free) — the autonomous walk advanced one step, no
// developer tokens and no waiting. Derived, not a hardcoded sequence: what runs is what train names. Informational
// (exits 0); a real regression is caught by the gate and the tests, never here.
//   npx tsx scripts/next.ts [https://qpu.uuidna.com]
const host = (process.argv.slice(2).find((a) => a.startsWith('http')) ?? 'https://qpu.uuidna.com').replace(/\/$/, '')
const rpc = async (name, args = {}) => {
  const r = await fetch(`${host}/mcp`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
    signal: AbortSignal.timeout(120000),
  }).catch(() => null)
  if (!r) return null
  const b = await r.json().catch(() => null)
  try { return JSON.parse(b.result.content[0].text) } catch { return b?.result?.structuredContent ?? null }
}
const holdsOf = (x) => x?.holds ?? x?.quantum?.holds ?? x?.steps?.holds ?? '?'

console.log(`next, as the unit names it (recognition-first against ${host}):`)
const train = await rpc('train')
if (!train) { console.log('  next: unreached (host slow/down — retried next run)'); process.exit(0) }
const door = train.steps?.next?.door?.tool
const todo = train.steps?.todo ?? []
const climb = Array.isArray(train.next) ? train.next : []
console.log(`  train: holds=${holdsOf(train)}, next door=${door ?? '?'}, todo=${JSON.stringify(todo)}, then=${JSON.stringify(climb)}`)

// run the next door, then the climb the unit names after it — in order, deduped, token-free
for (const tool of [...new Set([door, ...climb].filter(Boolean))]) {
  const r = await rpc(tool)
  console.log(`  ${tool}: holds=${holdsOf(r)}${r && r.next !== undefined ? `, next=${JSON.stringify(r.next).slice(0, 60)}` : ''}`)
}
console.log('next ran; anything it surfaces routes to the court (qpu://court) — development is reviewed, not auto-applied.')

// THE OPEN ITEMS, EVERY RUN. Each open item is read from the repository or the host and named with what it owes. Nothing
// here commits, pushes, deploys or publishes: an item that needs a person says so, and the release gate refuses until it
// is settled.
import { execSync } from 'node:child_process'
const sh = (cmd: string): string => { try { return execSync(cmd, { stdio: 'pipe' }).toString().trim() } catch { return '' } }
const dirty = sh('git status --porcelain').split('\n').filter(Boolean)
const unpushed = sh('git log origin/main..HEAD --oneline').split('\n').filter(Boolean)
const shipOut = sh('./node_modules/.bin/tsx scripts/ship-gate.ts 2>&1')
const localTheorems = /(\d+)\/\d+ theorems/.exec(shipOut)?.[1]
const hostedTheorems = (await rpc('prove'))?.lean?.source?.theorems ?? (await rpc('prove'))?.source?.theorems
console.log('open items:')
console.log(`  uncommitted: ${dirty.length} entr${dirty.length === 1 ? 'y' : 'ies'}${dirty.length ? ` — owed: the owner of each change commits or reverts it (${dirty.slice(0, 3).map((l) => l.replace(/^\s*\S+\s+/, '')).join(', ')}${dirty.length > 3 ? ', …' : ''})` : ' — none'}`)
console.log(`  not on origin: ${unpushed.length} commit(s)${unpushed.length ? ' — owed: a push, which is a person\'s command' : ' — none'}`)
console.log(`  host theorems: ${hostedTheorems ?? '?'} hosted, ${localTheorems ?? '?'} local${hostedTheorems !== undefined && hostedTheorems === localTheorems ? ' — none' : ' — owed: a deploy, which is a person\'s command'}`)
const gate = (() => { try { return execSync('node --import tsx --test scripts/*.test.ts 2>&1', { stdio: 'pipe' }).toString() } catch (e) { return String((e as { stdout?: Buffer }).stdout ?? '') } })()
const failing = [...gate.matchAll(/^✖ (.+?) \(/gm)].map((m) => m[1]).filter((v, i, a) => a.indexOf(v) === i)
console.log(`  scripts gate: ${failing.length ? `${failing.length} failing — owed: ${failing.slice(0, 2).join('; ')}` : 'green'}`)

// next --all: when every open item is clear, the automatic release runs; until then it refuses and says which check failed.
if (process.argv.includes('--all')) {
  console.log('next --all: automatic release, refused unless every check is green')
  try {
    execSync('./node_modules/.bin/tsx scripts/release.ts --auto', { stdio: 'inherit' })
  } catch {
    console.log('next --all: the release did not run; see the checks above')
  }
}
