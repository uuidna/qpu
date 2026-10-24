#!/usr/bin/env node
/**
 * GUARD. A check passes only when this machine verifies it. The host is asked the same questions and must agree with
 * what this machine computed. A host's own yes is never the verdict, and a host that cannot be reached is refused.
 *
 *   npm run guard                 every check; an unreached host is refused
 *   npm run guard -- --soft       an unreached host is reported as SOFT and does not fail (QPU_GUARD_SOFT=1 does the same)
 *
 * Local, always: the Lean kernel builds (lake build); no sorry or axiom in the kernel sources; the embedded Lean source
 * is the bundle of the modules on disk; prove holds in-process.
 * Remote, from the host: the MCP serves the payload plugin and agrees with the local kernel on the theorem count and
 * the holds; every news portal answers and surfaces its leads to court.
 */
import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { proveOf } from '../src/quantum/processing/unit/index.js'

const ROOT = join(import.meta.dirname, '..')
const KERNEL = join(ROOT, 'src/quantum/processing/unit/lean')
const PLUGIN = '@payloadcms/plugin-mcp'
const PORTALS = ['hn', 'reddit', 'lobsters', 'devto', 'gdelt']
const SOFT = process.argv.includes('--soft') || process.env.QPU_GUARD_SOFT === '1'
const HOST = (process.argv.find((a) => /^https?:\/\//.test(a)) ?? (process.env.QPU_HOST ? `https://${process.env.QPU_HOST}` : 'https://qpu.uuidna.com')).replace(/\/$/, '')

type Verdict = { name: string; ok: boolean; reached?: boolean; why: string }
const results: Verdict[] = []
const record = (v: Verdict) => {
  results.push(v)
  const state = v.ok ? 'OK' : v.reached === false && SOFT ? 'SOFT' : 'REFUSED'
  console.log(`guard ${v.name}: ${state} — ${v.why}`)
}

/** The kernel's Lean modules: the root file and every module under Qpu/, the ones the kernel imports. */
const kernelFiles = (): string[] => [
  join(KERNEL, 'Qpu.lean'),
  ...readdirSync(join(KERNEL, 'Qpu'), { recursive: true }).map(String).filter((f) => f.endsWith('.lean')).map((f) => join(KERNEL, 'Qpu', f)),
]

const theoremCount = (): number => kernelFiles().reduce((n, f) => n + (readFileSync(f, 'utf8').match(/^theorem /gm) ?? []).length, 0)

// LOCAL: the Lean kernel is compiled here, by the Lean toolchain, not by the host.
const lake = (): Verdict => {
  try {
    execFileSync('lake', ['build'], { cwd: ROOT, stdio: 'pipe' })
    return { name: 'lake', ok: true, why: `lake build compiles the kernel (${theoremCount()} theorems in its modules)` }
  } catch (e) {
    const out = String((e as { stderr?: Buffer }).stderr ?? e).split('\n').slice(-6).join(' | ')
    return { name: 'lake', ok: false, why: `lake build failed: ${out}` }
  }
}

// LOCAL: no proof is closed by sorry, and no axiom is declared in the kernel.
const kernelClean = (): Verdict => {
  const bad = kernelFiles().filter((f) => /\bsorry\b|^axiom\b/m.test(readFileSync(f, 'utf8')))
  return bad.length === 0
    ? { name: 'kernel', ok: true, why: `no sorry and no axiom in ${kernelFiles().length} kernel modules` }
    : { name: 'kernel', ok: false, why: `sorry or axiom in ${bad.map((f) => f.slice(ROOT.length + 1)).join(', ')}` }
}

// LOCAL: the Lean source embedded in the unit is the bundle of the modules on disk.
const bundled = (): Verdict => {
  try {
    execFileSync(join(ROOT, 'node_modules/.bin/tsx'), [join(ROOT, 'scripts/lean-bundle.ts'), '--check'], { cwd: ROOT, stdio: 'pipe' })
    return { name: 'bundle', ok: true, why: 'index.lean is the bundle of the modules' }
  } catch {
    return { name: 'bundle', ok: false, why: 'index.lean does not match the modules: run npm run lean:bundle' }
  }
}

// LOCAL: the prove holds in-process.
const prove = (): Verdict => {
  const p = proveOf()
  return { name: 'prove', ok: p.holds === true, why: `prove holds in-process: ${p.holds}` }
}

/** One MCP call to the host: its parsed reply, or null when the host did not answer. */
const remote = async (name: string, args: Record<string, unknown>): Promise<Record<string, unknown> | null> => {
  const r = await fetch(`${HOST}/mcp`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }),
    signal: AbortSignal.timeout(120000),
  }).catch(() => null)
  if (!r) return null
  const b = (await r.json().catch(() => null)) as { result?: { content?: { text?: string }[]; structuredContent?: Record<string, unknown> } } | null
  const text = b?.result?.content?.[0]?.text
  if (typeof text === 'string') {
    try { return JSON.parse(text) as Record<string, unknown> } catch { /* the structured reply stands */ }
  }
  return b?.result?.structuredContent ?? null
}

// REMOTE: the host serves the payload plugin, and its kernel agrees with this one: the same theorem count, all recomputed
// and served verbatim, and the source holds.
const mcp = async (): Promise<Verdict> => {
  const reply = await remote('prove', {})
  if (reply === null) return { name: 'mcp', ok: false, reached: false, why: `${HOST} did not answer` }
  const circuit = reply.circuit as { steps?: { path?: { plugin?: string } } } | undefined
  const plugin = circuit?.steps?.path?.plugin
  const src = reply.source as { holds?: boolean; theorems?: number; recomputed?: number; verbatim?: unknown; served?: unknown } | undefined
  const local = theoremCount()
  const agrees = plugin === PLUGIN && src?.holds === true && src?.theorems === local && src?.recomputed === local && src?.verbatim === src?.served
  return agrees
    ? { name: 'mcp', ok: true, why: `${HOST} serves ${PLUGIN}; ${local}/${local} theorems recomputed and served, as this kernel has them` }
    : { name: 'mcp', ok: false, why: `${HOST} disagrees with this machine: plugin=${plugin ?? '?'}, theorems=${src?.theorems ?? '?'} (local ${local}), recomputed=${src?.recomputed ?? '?'}, verbatim=${src?.verbatim === src?.served ? 'equal' : 'differs'}, holds=${src?.holds ?? '?'}` }
}

// REMOTE: every news portal is read and surfaces its leads to court. No majority: each portal must answer and surface.
const news = async (): Promise<Verdict> => {
  const replies = await Promise.all(PORTALS.map((site) => remote('quantum', { door: 'data', arguments: { source: 'news', site } })))
  if (replies.every((r) => r === null)) return { name: 'news', ok: false, reached: false, why: `${HOST} did not answer any portal` }
  const failed = PORTALS.filter((_, i) => (replies[i] as { agrees?: boolean } | null)?.agrees !== true)
  return failed.length === 0
    ? { name: 'news', ok: true, why: `${PORTALS.length}/${PORTALS.length} public news portals surface leads to court (reviewed=0, never asserted)` }
    : { name: 'news', ok: false, why: `news not surfacing in court from: ${failed.join(', ')}` }
}

const main = async () => {
  record(lake())
  record(kernelClean())
  record(bundled())
  record(prove())
  record(await mcp())
  record(await news())
  const refused = results.filter((v) => !v.ok && !(v.reached === false && SOFT))
  console.log(refused.length === 0 ? 'guard: every check passes' : `guard: ${refused.length} check(s) refused`)
  process.exit(refused.length === 0 ? 0 : 1)
}

if (import.meta.url === `file://${process.argv[1]}`) await main()
