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

// learn from books, over the UNIT'S OWN SUBJECT GRAPH: the books lookup is the hex formula record.books(from), a program
// over the family cursor (no typed list) addressing the from-th family and advancing via next — run here through the data
// door (the same computation, clean reading), and addressable on demand at qpu://hex. The wave samples a bounded slice.
// Open Library's public, FACTUAL bibliography only: the books' subjects and numbers fuse into discovery, never the text.
let from = 0
let steps = 0
let firstFamily = null
let familiesTotal = 0
const subjectsAll = new Set()
do {
  const b = await rpc('quantum', { door: 'data', arguments: { source: 'books', from } })
  const reading = b && b.reading
  if (!reading || typeof reading.next !== 'number') break
  if (firstFamily === null) firstFamily = reading.family
  familiesTotal = reading.families ?? familiesTotal
  for (const s of reading.subjects ?? []) subjectsAll.add(s)
  from = reading.next
  steps++
} while (from !== 0 && steps < 40)
line('books', steps ? `sampled ${steps} of ${familiesTotal} families from '${firstFamily}', ${subjectsAll.size} book subjects fused into the graph` : 'unreached')

// discover new cross-family relations, in hex: data.discover(n) = values two or more families reach
const discover = await rpc('quantum', { door: 'hex', arguments: { hex: { family: 'data', program: ['discover'], params: [5] } } })
line('discover', discover ? `holds=${discover.holds}, cross-family relations=${discover.value ?? '?'}` : 'unreached')

// always research for novelty funding while researching: the project's registered priority (its novelty) and the keyless
// funding sources for that novel work, researched every wave alongside the discovery.
const novelty = await rpc('quantum', { door: 'data', arguments: { source: 'novelty' } })
const funding = await rpc('quantum', { door: 'data', arguments: { source: 'funding', about: 'novel quantum research' } })
line('novelty-funding', novelty || funding ? `novelty priority=${novelty?.agrees ? 'registered' : '?'}, keyless funding sources=${funding?.reading?.keyless ?? '?'}` : 'unreached')

// learn from attacks to use as healing waves: the walls the unit refuses (the attacks it rejects) are confirmed holding
// every wave — none crossed is a healing wave; a crossing is a lead to heal. The standards the train returns are the posture.
const std = train && train.standards
line('heal', std ? `walls=${std.walls}, refusals held=${std.refusals?.notCrossed ?? '?'}/${std.refusals?.total ?? '?'}, crossed=${std.refusals?.crossed ?? '?'} — ${(std.refusals?.crossed ?? 1) === 0 ? 'defenses hold, healed' : 'a wall is crossed, heal'}` : 'unreached')

// the live audit of all realtime checks: each gap is a court lead with its resolve (gate.gaps, paged)
const gaps = await rpc('quantum', { door: 'data', arguments: { source: 'proof' } })
line('audit', gaps ? `proof held=${gaps.reading?.held ?? '?'}/${gaps.reading?.theorems ?? '?'}, axioms=${gaps.reading?.axioms ?? '?'}` : 'unreached')

console.log('free waves ran; anything they surface routes to the court (qpu://court) — development is reviewed, not auto-applied.')
