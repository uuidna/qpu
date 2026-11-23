// The prover inside the Lean container (alpine/Dockerfile, stage prover): a Lean source checked against Mathlib and qpu's
// Lean by `lake env lean`, and Lean's library search over every theorem (lean/tools/Gaps.lean) run once per image.
// Every check is its own process group with a time limit, at most two at once (Mathlib loaded is some 3 GiB each), in a
// directory of its own that is removed after; the server runs as an unprivileged user that cannot write the project.
import { spawn } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const ROOT = process.env.QPU_ROOT ?? '/qpu', PORT = Number(process.env.PORT ?? 8080), AT_ONCE = 2, SHARDS = 3
const toolchain = readFileSync(join(ROOT, 'lean-toolchain'), 'utf8').trim()

let busy = 0
const waiting: (() => void)[] = []
const take = async () => { while (busy >= AT_ONCE) await new Promise<void>((r) => waiting.push(r)); busy++ }
const give = () => { busy--; waiting.shift()?.() }

type Ran = { code: number | null; out: string; ms: number; timedOut: boolean }
/** One lake command in the project, its output kept to 1 MiB, its whole process group killed at the limit. */
const lake = (args: string[], seconds: number, env: Record<string, string> = {}) => new Promise<Ran>((done) => {
  const t0 = Date.now(), child = spawn('lake', args, { cwd: ROOT, detached: true, env: { PATH: process.env.PATH ?? '', HOME: tmpdir(), ...env } })
  let out = '', timedOut = false
  const keep = (c: Buffer) => { if (out.length < 1 << 20) out += c }
  child.stdout.on('data', keep)
  child.stderr.on('data', keep)
  const kill = () => { try { process.kill(-child.pid!, 'SIGKILL') } catch { /* already gone */ } }
  const timer = setTimeout(() => { timedOut = true; kill() }, seconds * 1000)
  child.on('close', (code) => { clearTimeout(timer); kill(); done({ code, out, ms: Date.now() - t0, timedOut }) })
})

/** Lean's messages, `file:line:col: severity: text`, each with the lines that continue it. */
const messages = (out: string, file: string) => {
  const found: { line: number; column: number; severity: string; text: string }[] = []
  for (const raw of out.split('\n')) {
    const m = raw.startsWith(file) ? /^:(\d+):(\d+): (error|warning|info)(?:\([^)]*\))?: ?(.*)$/.exec(raw.slice(file.length)) : null
    if (m) found.push({ line: Number(m[1]), column: Number(m[2]), severity: m[3]!, text: m[4]! })
    else if (found.length > 0 && raw.length > 0) found[found.length - 1]!.text += `\n${raw}`
  }
  return found
}

const check = async (source: string, seconds: number) => {
  await take()
  const dir = mkdtempSync(join(tmpdir(), 'check-')), file = join(dir, 'Check.lean')
  try {
    writeFileSync(file, source)
    const r = await lake(['env', 'lean', file], seconds)
    const found = messages(r.out, file)
    return { ok: r.code === 0 && !r.timedOut && !found.some((m) => m.severity === 'error'), timedOut: r.timedOut, ms: r.ms, messages: found, toolchain }
  } finally {
    rmSync(dir, { recursive: true, force: true })
    give()
  }
}

// the gap run: the image's tree never changes, so it runs once; it holds every slot, since its shards fill the memory
let gaps: { started: string; running: boolean; ms?: number; code?: number | null; shards?: string[]; merged?: string } | null = null
const runGaps = async () => {
  gaps = { started: new Date().toISOString(), running: true }
  for (let i = 0; i < AT_ONCE; i++) await take()
  try {
    for (let k = 0; k < SHARDS; k++) writeFileSync(join(ROOT, '.lake', 'build', `gaps-${k}-of-${SHARDS}.jsonl`), '')
    const t0 = Date.now()
    const shards = await Promise.all(Array.from({ length: SHARDS }, (_, k) => lake(['env', 'lean', 'lean/tools/Gaps.lean'], 3600, { GAPS_SHARD: `${k}/${SHARDS}` })))
    const merged = await lake(['env', 'lean', 'lean/tools/Gaps.lean'], 600, { GAPS_MERGE: String(SHARDS) })
    const last = (r: Ran) => r.out.trim().split('\n').at(-1) ?? ''
    gaps = { ...gaps, running: false, ms: Date.now() - t0, code: shards.every((s) => s.code === 0) ? merged.code : 1, shards: shards.map(last), merged: last(merged) }
  } finally {
    for (let i = 0; i < AT_ONCE; i++) give()
  }
}

const body = (req: IncomingMessage) => new Promise<string>((done, fail) => {
  let text = ''
  req.on('data', (c: Buffer) => { text += c; if (text.length > 1 << 20) req.destroy() })
  req.on('end', () => done(text)).on('error', fail)
})
const send = (res: ServerResponse, status: number, value: unknown) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(value)) }

createServer(async (req, res) => {
  try {
    if (req.url === '/health') return send(res, 200, { toolchain, busy })
    if (req.url === '/check' && req.method === 'POST') {
      const { source, seconds } = JSON.parse(await body(req)) as { source?: unknown; seconds?: unknown }
      if (typeof source !== 'string' || source.length === 0) return send(res, 400, { refused: 'source' })
      return send(res, 200, await check(source, typeof seconds === 'number' && seconds > 0 ? Math.min(seconds, 600) : 300))
    }
    if (req.url === '/gaps' && req.method === 'POST') {
      if (gaps === null) void runGaps()
      return send(res, 200, gaps)
    }
    send(res, 404, { refused: 'path' })
  } catch (error) {
    send(res, 500, { error: String(error) })
  }
}).listen(PORT)
