// Teleportation signalling between the flow's steps: every step is its own process, and the balancer (the handler's cache by
// block address) would start empty in each. Imported first by a step, this module teleports the blocks earlier steps computed
// into this process's balancer, and at exit writes the blocks this process computed for the next — one file per process,
// content-addressed inside, so steps running at once never overwrite each other. The handler stays pure: it only exposes
// its balancer; reading and writing files is the client's. A block teleported is a block not computed: the receipt counts.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { balancerLoad, balancerSnapshot } from '../src/quantum/mcp.ts'
import { uuidOf } from '../src/quantum/blocks.ts'

// the folder every step publishes into, made once: every step imports this module first
mkdirSync(join(process.cwd(), 'docs', 'public'), { recursive: true })
const DIR = join(process.cwd(), '.qpu', 'blocks')
const started = Date.now()
// a block is a function of its arguments AND of the code that computed it: every file of blocks carries the code's fingerprint (the
// sizes and times of every source under src/quantum), and a file from other code is not teleported — it would be a block of earlier code
const fingerprintOf = (): string => { const parts: string[] = []; const walk = (d: string) => { for (const f of readdirSync(d)) { const p = join(d, f); const st = statSync(p); if (st.isDirectory()) walk(p); else if (/\.ts$/.test(f)) parts.push(`${p}:${st.size}:${st.mtimeMs}`) } }; try { walk(join(process.cwd(), 'src', 'quantum')) } catch { /* no sources: no fingerprint */ } return uuidOf(parts.join('\n')) }
const FINGERPRINT = fingerprintOf()
let loaded = 0, files = 0, bytes = 0
if (existsSync(DIR)) {
  for (const f of readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
    try { const text = readFileSync(join(DIR, f), 'utf8'); const parsed = JSON.parse(text) as { fingerprint?: string; blocks?: unknown[] }; if (parsed.fingerprint !== FINGERPRINT || !Array.isArray(parsed.blocks)) continue; bytes += text.length; const n = balancerLoad(parsed.blocks as Parameters<typeof balancerLoad>[0]); loaded += n; files += 1 } catch { /* a torn file is skipped; the next step rewrites it */ }
  }
}
const teleported = { files, blocks: loaded, bytes, ms: Date.now() - started }
if (loaded) console.log(`teleport: ${loaded} blocks from ${files} step(s) (${(bytes / 1024).toFixed(0)} KB) in ${teleported.ms} ms`)
process.on('exit', () => {
  try {
    const fresh = balancerSnapshot({ onlyNew: true })
    if (!fresh.length) return
    mkdirSync(DIR, { recursive: true })
    const name = `${(process.argv[1] ?? 'step').split('/').pop()!.replace(/\.ts$/, '')}-${process.pid}.json`
    writeFileSync(join(DIR, name), JSON.stringify({ fingerprint: FINGERPRINT, blocks: fresh }))
    console.log(`teleport: ${fresh.length} block(s) left for the next step (${(statSync(join(DIR, name)).size / 1024).toFixed(0)} KB)`)
  } catch { /* nothing left: the next step computes */ }
})
export { teleported }
