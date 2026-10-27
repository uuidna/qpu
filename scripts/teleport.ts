// Teleportation signalling between the flow's steps: every step is its own process, and the balancer (the handler's cache by
// block address) would start empty in each. Imported first by a step, this module teleports the blocks earlier steps computed
// into this process's balancer, and at exit writes the blocks this process computed for the next — one file per process,
// content-addressed inside, so steps running at once never overwrite each other. The handler stays pure: it only exposes
// its balancer; reading and writing files is the client's. A block teleported is a block not computed: the receipt counts.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, statSync, renameSync, watch } from 'node:fs'
import { join } from 'node:path'
import { balancerLoad, balancerSnapshot } from '../src/quantum/mcp.ts'
import { uuidOf } from '../src/quantum/blocks.ts'

// the folder every step publishes into, made once: every step imports this module first
mkdirSync(join(process.cwd(), 'docs', 'public'), { recursive: true })
// the tenant's secrets from .dev.vars (wrangler keeps it out of git) beneath the environment, which wins: every step reads process.env alone
if (existsSync('.dev.vars')) process.loadEnvFile('.dev.vars')
const DIR = join(process.cwd(), '.qpu', 'blocks')
const started = Date.now()
// a block is a function of its arguments AND of the code that computed it: every file of blocks carries the code's fingerprint (the
// sizes and times of every source under src/quantum), and a file from other code is not teleported — it would be a block of earlier code
const fingerprintTree = (): string => { const parts: string[] = []; const walk = (d: string) => { for (const f of readdirSync(d)) { const p = join(d, f); const st = statSync(p); if (st.isDirectory()) walk(p); else if (/\.ts$/.test(f)) parts.push(`${p}:${st.size}:${st.mtimeMs}`) } }; try { walk(join(process.cwd(), 'src', 'quantum')) } catch { /* no sources: no fingerprint */ } return uuidOf(parts.join('\n')) }
const FINGERPRINT = fingerprintTree()
let loaded = 0, files = 0, bytes = 0, onTheWay = 0
// teleportation both ways and on the way: a step loads what earlier and concurrent steps computed (forward), publishes the addresses of those it
// used (backward: producers learn what is wanted, unused blocks can be pruned), and flushes its own fresh blocks every second while it runs,
// watching the folder, so a sibling in the same wave receives them on the way instead of computing them again
const own = `${(process.argv[1] ?? 'step').split('/').pop()!.replace(/\.ts$/, '')}-${process.pid}.json`
const loadFile = (f: string): number => { try { const text = readFileSync(join(DIR, f), 'utf8'), parsed = JSON.parse(text) as { fingerprint?: string; blocks?: unknown[] }; if (parsed.fingerprint !== FINGERPRINT || !Array.isArray(parsed.blocks)) return 0; bytes += text.length; return balancerLoad(parsed.blocks as never) } catch { return 0 } }
mkdirSync(DIR, { recursive: true })
for (const f of readdirSync(DIR).filter((f) => f.endsWith('.json') && f !== own)) { const n = loadFile(f); if (n) { loaded += n; files++ } }
const teleported = { files, blocks: loaded, bytes, ms: Date.now() - started }
if (loaded) console.log(`teleport: ${loaded} blocks from ${files} step(s) (${(bytes / 1024).toFixed(0)} KB) in ${teleported.ms} ms`)
const flush = () => { try { const fresh = balancerSnapshot({ onlyNew: true }), used = balancerSnapshot({ used: true }).map((b) => b.address); if (!fresh.length && !used.length) return 0; const tmp = join(DIR, own + '.tmp'); writeFileSync(tmp, JSON.stringify({ fingerprint: FINGERPRINT, blocks: fresh, used })); renameSync(tmp, join(DIR, own)); return fresh.length } catch { return 0 } }
const timer = setInterval(flush, 1000); timer.unref()
try { watch(DIR, (_e, f) => { if (f && f.endsWith('.json') && f !== own) onTheWay += loadFile(f) }).unref() } catch { /* no watcher: start and exit carry the blocks */ }
process.on('exit', () => {
  clearInterval(timer); const left = flush(), used = balancerSnapshot({ used: true }).length
  if (left) console.log(`teleport: ${left} block(s) left for the next step (${(statSync(join(DIR, own)).size / 1024).toFixed(0)} KB)`)
  if (loaded || onTheWay) console.log(`teleport: ${used} of ${loaded + onTheWay} teleported block(s) used, ${onTheWay} arrived on the way`)
})
export { teleported }
