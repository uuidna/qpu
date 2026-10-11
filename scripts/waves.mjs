#!/usr/bin/env node
// THE FREE MASSIVE WAVES, SEALED INTO AUTOMATION. On the schedule the host's own improve + discover doors are run
// against it, recognition-first (token-free), so the audit loop is complete and automatic:
//   find (examine / CodeQL / npm audit) -> develop (the court) -> improve + discover (these waves) -> repeat.
// This is informational: it surfaces what the waves find and exits 0 (a real regression is caught by examine/npm test,
// which gate the run). It never fixes — development stays in the court, where a change is reviewed before it ships.
//   node scripts/waves.mjs [https://qpu.uuidna.com]
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
const line = (k, v) => console.log(`  ${k}: ${v}`)
console.log(`free waves against ${host} (improve + discover, recognition-first):`)

const train = await rpc('train')
line('train', train ? `holds=${train.holds}, next=${train.steps?.next?.door?.tool ?? '?'}, todo=${JSON.stringify(train.steps?.todo ?? [])}` : 'unreached (host slow/down — retried next cron)')

const improve = await rpc('improve')
line('improve', improve ? `holds=${improve.quantum?.holds}, next=${improve.quantum?.next}` : 'unreached')

// learn from books, RANGING ACROSS THE WHOLE SUBJECT GRAPH: with no theme the books source walks the subject roots —
// each root's books give its neighbour subjects (the graph's edges) — advancing via next until the walk wraps, once per
// wave. Open Library's public, FACTUAL bibliography only: subjects and numbers fuse into discovery, never the text.
let from = 0
let steps = 0
let firstRoot = null
const subjectsAll = new Set()
do {
  const b = await rpc('quantum', { door: 'data', arguments: { source: 'books', from } })
  if (!b || !b.reading || typeof b.reading.next !== 'number') break
  if (firstRoot === null) firstRoot = b.reading.root
  for (const s of b.reading.subjects ?? []) subjectsAll.add(s)
  from = b.reading.next
  steps++
} while (from !== 0 && steps < 40)
line('books', steps ? `ranged ${steps} subject roots from '${firstRoot}', ${subjectsAll.size} subjects fused across the graph` : 'unreached')

// discover new cross-family relations, in hex: data.discover(n) = values two or more families reach
const discover = await rpc('quantum', { door: 'hex', arguments: { hex: { family: 'data', program: ['discover'], params: [5] } } })
line('discover', discover ? `holds=${discover.holds}, cross-family relations=${discover.value ?? '?'}` : 'unreached')

// the live audit of all realtime checks: each gap is a court lead with its resolve (gate.gaps, paged)
const gaps = await rpc('quantum', { door: 'data', arguments: { source: 'proof' } })
line('audit', gaps ? `proof held=${gaps.reading?.held ?? '?'}/${gaps.reading?.theorems ?? '?'}, axioms=${gaps.reading?.axioms ?? '?'}` : 'unreached')

console.log('free waves ran; anything they surface routes to the court (qpu://court) — development is reviewed, not auto-applied.')
