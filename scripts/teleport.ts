// Teleportation signalling between the flow's steps: every step is its own process, and the balancer (the handler's cache by
// block address) would start empty in each. Imported first by a step, this module teleports the blocks earlier steps computed
// into this process's balancer, and at exit writes the blocks this process computed for the next — one file per process,
// content-addressed inside, so steps running at once never overwrite each other. The handler stays pure: it only exposes
// its balancer; reading and writing files is the client's. A block teleported is a block not computed: the receipt counts.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { balancerLoad, balancerSnapshot } from '../src/quantum/mcp.ts'

const DIR = join(process.cwd(), 'docs', 'public', 'blocks')
const started = Date.now()
let loaded = 0, files = 0, bytes = 0
if (existsSync(DIR)) {
  for (const f of readdirSync(DIR).filter((f) => f.endsWith('.json'))) {
    try { const text = readFileSync(join(DIR, f), 'utf8'); bytes += text.length; const n = balancerLoad(JSON.parse(text)); loaded += n; files += 1 } catch { /* a torn file is skipped; the next step rewrites it */ }
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
    writeFileSync(join(DIR, name), JSON.stringify(fresh))
    console.log(`teleport: ${fresh.length} block(s) left for the next step (${(statSync(join(DIR, name)).size / 1024).toFixed(0)} KB)`)
  } catch { /* nothing left: the next step computes */ }
})
export { teleported }
