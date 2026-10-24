#!/usr/bin/env node
// npm run next: ask the unit what is next and run it. train names the next door and the climb after it; this runs them
// recognition-first against the deployed host (HTTP/MCP only, token-free) — the autonomous walk advanced one step, no
// developer tokens and no waiting. Derived, not a hardcoded sequence: what runs is what train names. Informational
// (exits 0); a real regression is caught by the gate and the tests, never here.
//   npx tsx scripts/next.ts [https://qpu.uuidna.com]
const host = (process.argv[2] ?? 'https://qpu.uuidna.com').replace(/\/$/, '')
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
