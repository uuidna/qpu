// The prover inside the Lean container (alpine/Dockerfile, stage prover): a Lean source checked against Mathlib and qpu's
// Lean by `lean`, and Lean's library search over every theorem (lean/tools/Gaps.lean) run once per image.
// Every check is its own process group with a time limit, at most two at once (Mathlib loaded is some 3 GiB each), in a
// directory of its own that is removed after; the server runs as an unprivileged user that cannot write the project.
//
// Lean is started directly, in the environment `lake env` names: the image writes that environment once while it is
// built (.lake/lean-env.json), so no request loads the workspace, asks git about a package or needs to write the
// project. Where the file is absent (a checkout, the tests) lake is asked once, when the server starts.
//
// An answer is one of two things and never a mix. A verdict is what Lean decided: accepted (exit 0, no error), rejected
// (exit 1 with at least one error message of its own), or not decided within the time limit. Anything else (Lean could
// not be started, was killed, or stopped without saying why) is a failure of the prover, answered as HTTP 500 with the
// exit code, the signal and the end of what the process wrote, so it is never read as "Lean rejected this".
// `node alpine/prover-server.ts --selftest` checks one theorem that holds and one that does not and exits non-zero on a
// wrong answer: the image build runs it as the user the server runs as, so an image whose prover is broken is not built.
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const ROOT = process.env.QPU_ROOT ?? '/qpu', PORT = Number(process.env.PORT ?? 8080), AT_ONCE = 2, SHARDS = 3, WAITING = 8, TAIL = 8192
const toolchain = readFileSync(join(ROOT, 'lean-toolchain'), 'utf8').trim()

/** The variables `lake env` sets for Lean (its search paths and sysroot), from the file the image wrote or from lake asked once. */
const ENV_FILE = join(ROOT, '.lake', 'lean-env.json')
const named = (text: string) => Object.fromEntries(text.split('\n').map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)] as const).filter(([k]) => /^(LEAN|LAKE|ELAN|LD_LIBRARY_PATH$|DYLD_LIBRARY_PATH$)/.test(k)))
const askLake = (): Record<string, string> => {
  const r = spawnSync('lake', ['env', 'env'], { cwd: ROOT, encoding: 'utf8', env: { PATH: process.env.PATH ?? '', HOME: process.env.HOME ?? tmpdir() } })
  if (r.status !== 0) throw new Error(`lake env stopped with code ${r.status}: ${(r.stderr || r.stdout || String(r.error ?? '')).slice(-TAIL)}`)
  return named(r.stdout)
}
if (process.argv.includes('--write-env')) { writeFileSync(ENV_FILE, JSON.stringify(askLake())); process.exit(0) }
const leanEnv: Record<string, string> = existsSync(ENV_FILE) ? JSON.parse(readFileSync(ENV_FILE, 'utf8')) : askLake()

let busy = 0
const waiting: (() => void)[] = []
const take = async () => { while (busy >= AT_ONCE) await new Promise<void>((r) => waiting.push(r)); busy++ }
/** Both slots taken and the queue full: the caller is told to come back, never left waiting without bound. */
const full = () => busy >= AT_ONCE && waiting.length >= WAITING
const give = () => { busy--; waiting.shift()?.() }

type Ran = { code: number | null; signal: string | null; out: string; ms: number; timedOut: boolean; failed?: string }
/** One Lean run in the project, its output kept to 1 MiB, its whole process group killed at the limit. */
const lean = (args: string[], seconds: number, env: Record<string, string> = {}) => new Promise<Ran>((done) => {
  const t0 = Date.now(), child = spawn('lean', args, { cwd: ROOT, detached: true, env: { PATH: process.env.PATH ?? '', HOME: tmpdir(), ...leanEnv, ...env } })
  let out = '', timedOut = false, failed: string | undefined
  const keep = (c: Buffer) => { if (out.length < 1 << 20) out += c }
  child.stdout.on('data', keep)
  child.stderr.on('data', keep)
  const kill = () => { try { process.kill(-child.pid!, 'SIGKILL') } catch { /* already gone */ } }
  const timer = setTimeout(() => { timedOut = true; kill() }, seconds * 1000)
  // a process that could not be started says so here and closes with no code
  child.on('error', (e) => { failed = String(e) })
  child.on('close', (code, signal) => { clearTimeout(timer); kill(); done({ code, signal, out, ms: Date.now() - t0, timedOut, failed }) })
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

export type Verdict = { ok: boolean; timedOut: boolean; ms: number; messages: ReturnType<typeof messages>; toolchain: string }
export type Failure = { error: 'prover_failed'; exit: number | null; signal: string | null; ms: number; stderr: string; toolchain: string }
/** What one run means: Lean's verdict, or the prover's failure with what the process left behind. */
export const decide = (r: Ran, file: string): Verdict | Failure => {
  const found = messages(r.out, file), errors = found.some((m) => m.severity === 'error')
  if (r.timedOut) return { ok: false, timedOut: true, ms: r.ms, messages: found, toolchain }
  if (r.failed === undefined && r.code === 0 && !errors) return { ok: true, timedOut: false, ms: r.ms, messages: found, toolchain }
  if (r.failed === undefined && r.code === 1 && errors) return { ok: false, timedOut: false, ms: r.ms, messages: found, toolchain }
  return { error: 'prover_failed', exit: r.code, signal: r.signal, ms: r.ms, stderr: (r.failed ? `${r.failed}\n` : '') + r.out.slice(-TAIL), toolchain }
}

const check = async (source: string, seconds: number) => {
  await take()
  const dir = mkdtempSync(join(tmpdir(), 'check-')), file = join(dir, 'Check.lean')
  try {
    writeFileSync(file, source)
    return decide(await lean([file], seconds), file)
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
    const shards = await Promise.all(Array.from({ length: SHARDS }, (_, k) => lean(['lean/tools/Gaps.lean'], 3600, { GAPS_SHARD: `${k}/${SHARDS}` })))
    const merged = await lean(['lean/tools/Gaps.lean'], 600, { GAPS_MERGE: String(SHARDS) })
    // a shard that stopped says why: the end of what it wrote, not its last line alone
    const last = (r: Ran) => (r.code === 0 ? r.out.trim().split('\n').at(-1) ?? '' : `exit ${r.code}${r.signal ? ` ${r.signal}` : ''}: ${r.out.slice(-TAIL)}`)
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

/** One theorem that holds, one that does not and one that needs Mathlib, through the same path a request takes: the answers an image must give to be served. */
const selftest = async () => {
  const holds = await check('theorem t : 1 + 1 = 2 := rfl', 300), fails = await check('theorem t : 1 + 1 = 3 := rfl', 300)
  const mathlib = await check('import Mathlib.Tactic\nexample (a b : ℕ) : a + b = b + a := by ring', 300)
  const right = 'ok' in holds && holds.ok === true && 'ok' in mathlib && mathlib.ok === true && 'ok' in fails && fails.ok === false && !fails.timedOut && fails.messages.some((m) => m.severity === 'error')
  console.log(JSON.stringify({ selftest: right, holds, fails, mathlib }))
  return right
}
if (process.argv.includes('--selftest')) process.exit(await selftest() ? 0 : 1)

createServer(async (req, res) => {
  try {
    if (req.url === '/health') return send(res, 200, { toolchain, busy, waiting: waiting.length })
    if (req.url === '/selftest') { const right = await selftest(); return send(res, right ? 200 : 500, { selftest: right }) }
    if (req.url === '/check' && req.method === 'POST') {
      const { source, seconds } = JSON.parse(await body(req)) as { source?: unknown; seconds?: unknown }
      if (typeof source !== 'string' || source.length === 0) return send(res, 400, { refused: 'source' })
      if (full()) return send(res, 503, { error: 'prover_busy', busy, waiting: waiting.length, retryAfterSeconds: 30 })
      const answer = await check(source, typeof seconds === 'number' && seconds > 0 ? Math.min(seconds, 600) : 300)
      return send(res, 'error' in answer ? 500 : 200, answer)
    }
    if (req.url === '/gaps' && req.method === 'POST') {
      if (gaps === null) void runGaps()
      return send(res, 200, gaps)
    }
    send(res, 404, { refused: 'path' })
  } catch (error) {
    send(res, 500, { error: 'prover_failed', exit: null, signal: null, stderr: String(error), toolchain })
  }
}).listen(PORT)
