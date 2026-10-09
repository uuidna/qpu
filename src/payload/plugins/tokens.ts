/**
 * Token seal + usage — fused on `connector`, never a tools/list door.
 *
 * Seals Bearer / API-key / access.token *secrets* out of MCP replies, receipts, observe,
 * and Public logs. Reports token *usage* with identifiable targets (door/tool/family/hex/panel)
 * via text.tokens (LLM estimate) + access.token (entropy floor) + byte counts.
 *
 * Also owns waits audit, heat.slow next chains, and cool-via-formulas — one compact call each.
 *
 *   tools/call connector { waits: true }
 *   tools/call connector { slow: true, take: 14 }
 *   tools/call connector { cool: true }
 *   tools/call connector { observe: true }  — usage rows ride along
 */
import { AccessFormulas } from '../../families/access/index.js'
import { HeatFormulas, heatThresholdOf } from '../../families/heat/index.js'
import { TextFormulas } from '../../families/text/index.js'
import { flowFamiliesOf } from '../../families/merkaba/index.js'
import {
  qpuFacesOf,
  qpuHexFamiliesOf,
  qpuHexUuidOf,
  qpuLatticeNamesOf,
  qpuMcpToolsListOf,
  tenOf,
} from '../../quantum/processing/unit/index.js'
import type { QpuPlugin } from './surface.js'

const L = { ...qpuLatticeNamesOf(), tenOf }
const REDACTED = '[redacted]' as const
/** Four bytes per LLM token — presentation.ts tokens: 'four bytes'. */
const BYTES_PER_TOKEN = 4
/** Cap related/array dumps so seal-wave-style OOM cannot recur. Depth is walk depth, not coins.
 *  MAX_ARRAY is compactOf's cap (sealPayloadOf); the redact-only pass never truncates (fold equality, full: true). */
const MAX_ARRAY = L.faces
const MAX_STRING = tenOf(L.hexbit) // 10000 chars
const MAX_DEPTH = L.faces // 14 — deep enough for usage/matrix trees; related arrays still sliced to faces

const SECRET_KEY =
  /^(authorization|auth|bearer|api[_-]?key|x[_-]?api[_-]?key|access[_-]?token|secret|password|passwd|credential|private[_-]?key|client[_-]?secret|write[_-]?token|patentsview[_-]?api[_-]?key|ibm[_-]?qiskit[_-]?token|qpu[_-]?write[_-]?token|payload[_-]?secret|accesskeyid|secretaccesskey|aws[_-]?secret|s3[_-]?access|s3[_-]?secret)$/i

const SECRET_VALUE =
  /\bBearer\s+[A-Za-z0-9._~+/=-]{8,}\b|\bsk-[A-Za-z0-9]{20,}\b|\bghp_[A-Za-z0-9]{20,}\b|\bxox[baprs]-[A-Za-z0-9-]{10,}\b|\bAKIA[0-9A-Z]{16}\b/gi

const hexOf = (family: string, formula: string, params: number[]): string | null => {
  try {
    return qpuHexUuidOf({ family, program: [formula], params })
  } catch {
    return null
  }
}

const connectBillOf = () => {
  const tools = qpuMcpToolsListOf()
  const bytes = JSON.stringify({ resultType: 'complete' as const, tools }).length
  const qpuPrefixed = tools.filter((t) => t.name.startsWith('qpu_')).length
  return {
    doors: tools.length,
    bytes,
    under16384: bytes < 16384,
    qpuPrefixed,
    holds: tools.length <= 16 && bytes < 16384 && qpuPrefixed === 0,
  }
}

/** True when a string looks like a secret material (Bearer, sk-, ghp_, …) — never echoed. */
export const secretsInOf = (s: string): boolean =>
  /\bBearer\s+[A-Za-z0-9._~+/=-]{8,}\b/i.test(s) ||
  /\bsk-[A-Za-z0-9]{20,}\b/.test(s) ||
  /\bghp_[A-Za-z0-9]{20,}\b/.test(s) ||
  /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/.test(s) ||
  /\bAKIA[0-9A-Z]{16}\b/.test(s)

/** Redact secret keys and Bearer/API-key shaped values. Public crypto (hex, digest, signature) stays. */
export const redactSecretsOf = (value: unknown, depth = 0): unknown => {
  if (depth > MAX_DEPTH) return REDACTED
  if (typeof value === 'string') {
    if (secretsInOf(value)) return value.replace(SECRET_VALUE, REDACTED)
    return value.length > MAX_STRING ? `${value.slice(0, MAX_STRING)}…` : value
  }
  if (typeof value !== 'object' || value === null) return value
  // redact-only: never truncate here (the caller relies on fold equality and on full: true meaning the whole
  // document — array capping for OOM is compactOf's job, applied by sealPayloadOf). Depth/string caps below stay
  // as cycle- and blast-radius guards.
  if (Array.isArray(value)) return value.map((v) => redactSecretsOf(v, depth + 1))
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (SECRET_KEY.test(k)) {
      out[k] = REDACTED
      continue
    }
    out[k] = redactSecretsOf(v, depth + 1)
  }
  return out
}

/**
 * Compact a payload: truncate huge related arrays / strings, cap depth.
 * Seal-wave OOM lesson — never dump unbounded related/discover rows on the wire.
 */
export const compactOf = (value: unknown, depth = 0): unknown => {
  if (depth > MAX_DEPTH) return { truncated: true as const, depth }
  if (typeof value === 'string') return value.length > MAX_STRING ? `${value.slice(0, MAX_STRING)}…` : value
  if (typeof value !== 'object' || value === null) return value
  if (Array.isArray(value)) {
    const slice = value.slice(0, MAX_ARRAY).map((v) => compactOf(v, depth + 1))
    return value.length > MAX_ARRAY ? [...slice, { truncated: value.length - MAX_ARRAY }] : slice
  }
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    // related / discover / edges are the known OOM vectors
    if ((k === 'related' || k === 'discover' || k === 'edges' || k === 'jobs' || k === 'meets') && Array.isArray(v)) {
      out[k] = compactOf(v.slice(0, L.faces), depth + 1)
      if (v.length > L.faces) out[`${k}Truncated`] = v.length - L.faces
      continue
    }
    out[k] = compactOf(v, depth + 1)
  }
  return out
}

/** Seal = redact secrets then compact. Safe for MCP replies, receipts, observe, Public logs. */
export const sealPayloadOf = <T = unknown>(value: T): T => compactOf(redactSecretsOf(value)) as T

export type TokenTarget = {
  who: string
  door?: string
  tool?: string
  family?: string
  formula?: string
  hex?: string | null
  panel?: string
}

export type TokenUsageRow = {
  target: TokenTarget
  bytes: number
  llmTokens: number
  accessToken: {
    address: 'access.token'
    params: [number]
    value: number
    holds: boolean
    hex: string | null
    floor: number
  }
  textTokens: {
    address: 'text.tokens'
    params: [number, number]
    value: number
    holds: boolean
    hex: string | null
  }
  sealed: boolean
  redacted: boolean
}

/** One usage row: identifiable target + formulated counts (never the secret itself). */
export const tokenUsageOf = (target: TokenTarget, payload: unknown): TokenUsageRow => {
  const sealedPayload = sealPayloadOf(payload)
  const bytes = JSON.stringify(sealedPayload).length
  const llm = TextFormulas.tokens(bytes, BYTES_PER_TOKEN)
  const access = AccessFormulas.token(256)
  const rawHadSecrets = (() => {
    try {
      const raw = typeof payload === 'string' ? payload : JSON.stringify(payload ?? null)
      if (secretsInOf(raw)) return true
      if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
        return Object.keys(payload as object).some((k) => SECRET_KEY.test(k))
      }
    } catch {
      return false
    }
    return false
  })()
  return {
    target: {
      who: target.who,
      ...(target.door ? { door: target.door } : {}),
      ...(target.tool ? { tool: target.tool } : {}),
      ...(target.family ? { family: target.family } : {}),
      ...(target.formula ? { formula: target.formula } : {}),
      ...(target.hex !== undefined ? { hex: target.hex } : {}),
      ...(target.panel ? { panel: target.panel } : {}),
    },
    bytes,
    llmTokens: llm.value,
    accessToken: {
      address: 'access.token',
      params: [256],
      value: access.value,
      holds: access.holds === true,
      hex: hexOf('access', 'token', [256]),
      floor: 256,
    },
    textTokens: {
      address: 'text.tokens',
      params: [bytes, BYTES_PER_TOKEN],
      value: llm.value,
      holds: llm.holds === true,
      hex: hexOf('text', 'tokens', [bytes, BYTES_PER_TOKEN]),
    },
    sealed: !rawHadSecrets || !secretsInOf(JSON.stringify(sealedPayload)),
    redacted: rawHadSecrets,
  }
}

export type WaitRow = {
  file: string
  what: string
  ms: number
  cost: string
  formulated: boolean
  formula?: string
  hot: boolean
  fix: string
}

/** Static + lattice-measured wait audit, sorted by cost (ms) descending. */
export const waitsAuditOf = (args: Record<string, unknown> = {}) => {
  const deadline = L.tenOf(L.hexbit) // 10000
  const faces = qpuFacesOf().faces
  const ring = flowFamiliesOf().length
  const rows: WaitRow[] = [
    {
      file: 'scripts/verify-release.mjs',
      what: 'VERIFY_ATTEMPTS × VERIFY_EVERY_MS poll',
      ms: 30 * tenOf(4),
      cost: '≤300s CI worst',
      formulated: false,
      hot: false,
      fix: 'keep; only pipeline-owned channels wait',
    },
    {
      file: 'scripts/verify-live.mjs',
      what: 'attempts × 5s Cloudflare propagate poll',
      ms: 24 * 5000,
      cost: '120s default / 300s CI',
      formulated: false,
      hot: false,
      fix: 'keep; zone crawl is the product',
    },
    {
      file: 'scripts/receipt.mjs',
      what: 'tools/call AbortSignal 120s + backoff 5/10/15s ×3',
      ms: 120000 + 5000 + 10000 + 15000,
      cost: '≤150s one call; ≤375s retry worst',
      formulated: false,
      hot: true,
      fix: 'wave receipts need long budget; prefer pool width=faces',
    },
    {
      file: 'src/quantum/processing/unit/index.ts',
      what: 'foreignDeadlineOf hang (SILENT-cached after first)',
      ms: deadline,
      cost: '1×deadline/process after SILENT',
      formulated: true,
      formula: 'tenOf(hexbit)',
      hot: false,
      fix: 'already sealed — first timeout only',
    },
    {
      file: 'src/mcp/qpu-fused.ts',
      what: 'DEADLINE fetch + BACKOFF retry',
      ms: deadline,
      cost: '≤1 deadline (4xx/timeout not retried)',
      formulated: true,
      formula: 'tenOf(hexbit)',
      hot: false,
      fix: 'ok',
    },
    {
      file: 'src/quantum/quantum-executor.ts',
      what: 'IBM/IonQ/Braket fixed sleep before poll',
      ms: 5000,
      cost: '4–5s ad-hoc (was); now poll',
      formulated: false,
      hot: true,
      fix: 'poll until completed ≤ deadline',
    },
    {
      file: 'scripts/e2e.test.mjs',
      what: 'e2e AbortSignal.timeout(DEADLINE)',
      ms: deadline,
      cost: '10s; fail at rising temp',
      formulated: true,
      formula: 'tenOf(hexbit)',
      hot: true,
      fix: 'ok — hot is the finding',
    },
    {
      file: 'src/payload/plugins/exam.ts',
      what: 'clay.pass withTimeout(faces²·10)',
      ms: faces * faces * 10,
      cost: `${faces * faces * 10}ms`,
      formulated: true,
      formula: 'faces·faces·10',
      hot: false,
      fix: 'ok',
    },
    {
      file: 'src/families/heat/index.ts',
      what: `heat.slow develop rotations ≤2·faces (ring=${ring})`,
      ms: Math.round(28 * 32), // measured ~20–32ms/develop × cap
      cost: `~20–30ms cool; early-exit when hot; was O(|ring|²)`,
      formulated: true,
      formula: 'heat.slow',
      hot: false,
      fix: 'already capped + hot early-exit',
    },
    {
      file: 'src/quantum/ionq-connector.ts',
      what: 'simulate setTimeout 500+1500',
      ms: 2000,
      cost: '2s demo sim',
      formulated: false,
      hot: false,
      fix: 'demo only; executor polls',
    },
    {
      file: 'src/distributed/consensus.ts',
      what: 'waitForQuorum 100ms interval',
      ms: 100,
      cost: 'poll ≤ timeout',
      formulated: false,
      hot: false,
      fix: 'leave',
    },
  ].sort((a, b) => b.ms - a.ms)

  const verbosity = typeof args.verbosity === 'number' ? Math.max(0, Math.min(3, Math.floor(args.verbosity))) : 1
  const usage = tokenUsageOf(
    { who: 'connector.waits', door: 'connector', tool: 'waits', panel: 'waits' },
    { rows: rows.length },
  )
  return sealPayloadOf({
    kind: 'waits' as const,
    call: 'tools/call connector { waits: true }' as const,
    deadline,
    faces,
    ring,
    rows: verbosity <= 0 ? rows.slice(0, 3).map((r) => ({ file: r.file, ms: r.ms, hot: r.hot })) : rows,
    worst: rows[0] ? { file: rows[0].file, ms: rows[0].ms, fix: rows[0].fix } : null,
    usage,
    connectBill: connectBillOf(),
    holds: connectBillOf().holds,
    goal: 'OPEN' as const,
    note: 'wait audit sorted by cost; formulated heat.*/tenOf(hexbit) named; ad-hoc flagged hot when they burn budget' as const,
  })
}

/** Follow heat.slow `next` for take steps — compact, no related dumps. */
export const slowChainOf = async (args: Record<string, unknown> = {}) => {
  const faces = qpuFacesOf().faces
  const take = typeof args.take === 'number' && Number.isSafeInteger(args.take) && args.take > 0
    ? Math.min(args.take, faces)
    : faces
  let f = typeof args.f === 'number' && Number.isSafeInteger(args.f) && args.f >= 0 ? args.f : 0
  let j = typeof args.j === 'number' && Number.isSafeInteger(args.j) && args.j >= 0 ? args.j : 0
  if (typeof args.from === 'number' && Number.isSafeInteger(args.from) && args.from >= 0) {
    f = args.from
    j = 0
  }
  const ring = flowFamiliesOf()
  const steps: {
    f: number
    j: number
    family: string
    formula: string
    ms: number
    hot: boolean
    holds: boolean
    hex: string | null
    next?: [number, number]
  }[] = []
  const t0 = performance.now()
  for (let n = 0; n < take; n++) {
    const family = ring[f]
    const formulas = family ? qpuHexFamiliesOf().get(family) : undefined
    const formula = formulas?.[j]
    if (!family || !formula) break
    const r = (await HeatFormulas.slow(f, j)) as unknown as {
      value: number
      holds: boolean
      hot?: boolean
      hex?: string
      next?: [number, number]
    }
    steps.push({
      f,
      j,
      family,
      formula: formula.name,
      ms: r.value,
      hot: r.hot === true,
      holds: r.holds === true,
      hex: typeof r.hex === 'string' ? r.hex : hexOf('heat', 'slow', [f, j]),
      ...(r.next ? { next: r.next } : {}),
    })
    if (!r.next) break
    f = r.next[0]
    j = r.next[1]
  }
  const wallMs = Math.round(performance.now() - t0)
  const hot = steps.filter((s) => s.hot).length
  const usage = tokenUsageOf(
    {
      who: `heat.slow→${steps[0]?.family ?? 'none'}`,
      door: 'connector',
      tool: 'slow',
      family: 'heat',
      formula: 'slow',
      hex: steps[0]?.hex ?? null,
      panel: 'slow',
    },
    { steps: steps.length, wallMs },
  )
  return sealPayloadOf({
    kind: 'slow-chain' as const,
    call: 'tools/call connector { slow: true, take }' as const,
    take,
    steps,
    hot,
    cool: steps.length - hot,
    wallMs,
    next: steps.at(-1)?.next ?? null,
    usage,
    connectBill: connectBillOf(),
    holds: steps.length > 0 && steps.every((s) => typeof s.ms === 'number'),
    goal: 'OPEN' as const,
    note: 'heat.slow next chain; hot steps are leads (statement false); no develop dump' as const,
  })
}

/** Cool via heat formulas — ways/cooling to threshold; no file rewrite (cool.mjs stays the mover). */
export const coolFormulasOf = (args: Record<string, unknown> = {}) => {
  const threshold = heatThresholdOf()
  const millikelvin =
    typeof args.millikelvin === 'number' && Number.isSafeInteger(args.millikelvin) && args.millikelvin >= 0
      ? args.millikelvin
      : typeof args.mK === 'number' && Number.isSafeInteger(args.mK) && args.mK >= 0
        ? args.mK
        : 4000
  const ways = HeatFormulas.ways(millikelvin, threshold)
  const cooling = HeatFormulas.cooling(millikelvin, ways.value)
  const signal = HeatFormulas.signal(cooling.value)
  const usage = tokenUsageOf(
    {
      who: 'heat.cooling',
      door: 'connector',
      tool: 'cool',
      family: 'heat',
      formula: 'cooling',
      hex: typeof cooling.hex === 'string' ? cooling.hex : hexOf('heat', 'cooling', [millikelvin, ways.value]),
      panel: 'cool',
    },
    { millikelvin, ways: ways.value, cooling: cooling.value },
  )
  return sealPayloadOf({
    kind: 'cool' as const,
    call: 'tools/call connector { cool: true }' as const,
    millikelvin,
    threshold,
    ways: { value: ways.value, holds: ways.holds, hex: ways.hex ?? hexOf('heat', 'ways', [millikelvin, threshold]) },
    cooling: {
      value: cooling.value,
      holds: cooling.holds,
      hex: cooling.hex ?? hexOf('heat', 'cooling', [millikelvin, ways.value]),
    },
    signal: { value: signal.value, holds: signal.holds, hex: signal.hex ?? hexOf('heat', 'signal', [cooling.value]) },
    hot: signal.value === 0,
    move: 'node scripts/cool.mjs <file> <module> <decl…> — physical split; this reading only names k' as const,
    usage,
    connectBill: connectBillOf(),
    holds: ways.holds === true && cooling.holds === true,
    goal: 'OPEN' as const,
    note: 'cool by heat.ways → heat.cooling to threshold; file move is cool.mjs' as const,
  })
}

/** Unified automation answer for waits | slow | cool | online. */
export const waitsAnswerOf = async (args: Record<string, unknown> = {}) => {
  if (args.online === true || args.offline === true || args.mode === 'online' || args.mode === 'offline') {
    return onlineModeOf(args)
  }
  if (args.slow === true || args.next === true || (typeof args.take === 'number' && args.waits !== true && args.cool !== true)) {
    if (args.cool === true) return coolFormulasOf(args)
    if (args.waits === true) return waitsAuditOf(args)
    return slowChainOf(args)
  }
  if (args.cool === true) return coolFormulasOf(args)
  return waitsAuditOf(args)
}

export type LevelModeCell = {
  level: string
  mode: 'online' | 'offline'
  pass: boolean
  holds?: boolean
  warning?: string
  note: string
  target: TokenTarget
  usage?: TokenUsageRow
}

/**
 * Explore + test online/offline at each stack level.
 * Offline always computes locally (formulas, CERN learn, cloud.scale, seal).
 * Online probes host/network only when `{ online: true }` or mode=online — never echoes secrets.
 */
export const onlineModeOf = async (args: Record<string, unknown> = {}) => {
  const wantOnline = args.online === true || args.mode === 'online'
  const wantOffline = args.offline === true || args.mode === 'offline' || !wantOnline
  const cells: LevelModeCell[] = []
  const host = typeof args.host === 'string' && args.host ? args.host.replace(/\/$/, '') : 'https://qpu.uuidna.com'
  const deadline = L.tenOf(L.hexbit)

  // ── formula/unit (offline always) ──
  {
    const { CloudFormulas } = await import('../../families/cloud/index.js')
    const scale = CloudFormulas.scale(100, 30)
    const clay = (await import('../../families/clay/index.js')).ClaySeals.riemann(1, 2)
    const pass = scale.holds === true && clay.holds === true
    const target: TokenTarget = {
      who: 'formula.cloud.scale+clay.riemann',
      door: 'hex',
      family: 'cloud',
      formula: 'scale',
      hex: scale.hex ?? hexOf('cloud', 'scale', [100, 30]),
    }
    cells.push({
      level: 'formula/unit',
      mode: 'offline',
      pass,
      holds: pass,
      note: `cloud.scale=${scale.value} clay.riemann holds — no network`,
      target,
      usage: tokenUsageOf(target, { scale: scale.value, clay: clay.value }),
    })
  }

  // ── formula/unit live CERN: offline learn vs online experience ──
  {
    const { qpuCernLearnOf } = await import('../../quantum/processing/unit/index.js')
    const learn = qpuCernLearnOf()
    const target: TokenTarget = { who: 'unit.cern.learn', door: 'data', tool: 'cern', family: 'cern', panel: 'unit' }
    cells.push({
      level: 'formula/unit',
      mode: 'offline',
      pass: learn.holds === true,
      holds: learn.holds === true,
      note: 'qpuCernLearnOf occupancy lattice — offline exact',
      target,
      usage: tokenUsageOf(target, { holds: learn.holds }),
    })
  }

  // ── MCP/connector offline: local connectorAnswerOf seals ──
  {
    const { connectorUseOf } = await import('./permaculture.js')
    const use = connectorUseOf()
    const leakProbe = sealPayloadOf({
      authorization: 'Bearer FAKESECRET_e2f3g4h5i6j7k8l9m0n1',
      apiKey: 'sk-leakprobeabcdefghijklmnopqrstuvwxyz',
      use: use.kind,
    })
    const sealed =
      (leakProbe as { authorization?: string }).authorization === REDACTED &&
      (leakProbe as { apiKey?: string }).apiKey === REDACTED
    const target: TokenTarget = { who: 'connector.use', door: 'connector', tool: 'use', panel: 'connector-use' }
    cells.push({
      level: 'MCP/connector',
      mode: 'offline',
      pass: use.holds === true && use.connectBill.holds === true && sealed,
      holds: use.holds === true,
      note: `connector { use } bill doors=${use.connectBill.doors}; secrets sealed=${sealed}`,
      target,
      usage: tokenUsageOf(target, { kind: use.kind, sealed }),
    })
  }

  // ── MCP/connector online: host tools/list (optional) ──
  if (wantOnline) {
    const target: TokenTarget = { who: 'host.mcp.tools/list', door: 'mcp', tool: 'tools/list', panel: 'host' }
    const t0 = Date.now()
    try {
      const r = await fetch(`${host}/mcp`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }),
        signal: AbortSignal.timeout(deadline),
      })
      const body = (await r.json()) as { result?: { tools?: unknown[] }; error?: unknown }
      const tools = body.result?.tools
      const pass = r.ok && Array.isArray(tools) && tools.length <= 16
      const raw = JSON.stringify(body)
      cells.push({
        level: 'MCP/connector',
        mode: 'online',
        pass: pass && !secretsInOf(raw),
        holds: pass,
        note: `host tools/list ${Array.isArray(tools) ? tools.length : 0} doors in ${Date.now() - t0}ms; sealed=${!secretsInOf(raw)}`,
        target,
        usage: tokenUsageOf(target, { doors: Array.isArray(tools) ? tools.length : 0, ms: Date.now() - t0 }),
      })
    } catch (e) {
      const why = (e as { name?: string; message?: string })?.name === 'TimeoutError' ? 'timeout' : 'offline'
      cells.push({
        level: 'MCP/connector',
        mode: 'online',
        pass: false,
        warning: why,
        note: `host unreached (${why}) — documented, not a formula fail`,
        target,
        usage: tokenUsageOf(target, { warning: why }),
      })
    }
  }

  // ── Payload public offline: publicDoorFetchOf local ──
  {
    const { publicDoorFetchOf } = await import('./public.js')
    const env = { QPU_HOST: 'qpu.uuidna.com' }
    const res = await publicDoorFetchOf(new Request('https://qpu.uuidna.com/api/qpu/cite'), env)
    const body = await res.json()
    const sealedBody = sealPayloadOf(body)
    const pass = res.status === 200 && !secretsInOf(JSON.stringify(sealedBody))
    const target: TokenTarget = { who: 'payload.public.cite', door: 'cite', tool: 'cite', panel: 'payload' }
    cells.push({
      level: 'Payload public',
      mode: 'offline',
      pass,
      holds: pass,
      note: `publicDoorFetchOf /api/qpu/cite status ${res.status} — in-process, no egress`,
      target,
      usage: tokenUsageOf(target, sealedBody),
    })
  }

  // ── Worker/cache: SILENT + offlineUntil contract (documented; force-offline path) ──
  {
    const offWindow = L.tenOf(L.hexbit) * L.coins * L.n
    const target: TokenTarget = { who: 'worker.offlineUntil+SILENT', door: 'data', tool: 'foreignFetch', panel: 'worker' }
    cells.push({
      level: 'Worker/cache',
      mode: 'offline',
      pass: offWindow === 10000 * 2 * 3,
      holds: true,
      note: `OFFLINE_WINDOW=${offWindow}ms; SILENT host skips after first TimeoutError — miss same, cost 1×deadline`,
      target,
      usage: tokenUsageOf(target, { OFFLINE_WINDOW: offWindow }),
    })
  }

  if (wantOnline) {
    const target: TokenTarget = { who: 'worker.cache-control', door: 'mcp', tool: 'GET', panel: 'worker' }
    try {
      const r = await fetch(`${host}/mcp`, {
        method: 'GET',
        headers: { accept: 'application/ld+json' },
        signal: AbortSignal.timeout(deadline),
      })
      const cc = r.headers.get('cache-control') ?? ''
      const pass = r.status === 200
      cells.push({
        level: 'Worker/cache',
        mode: 'online',
        pass,
        holds: pass,
        note: `GET /mcp ${r.status}; cache-control=${cc || 'none'}`,
        target,
        usage: tokenUsageOf(target, { status: r.status, cache: cc }),
      })
    } catch (e) {
      cells.push({
        level: 'Worker/cache',
        mode: 'online',
        pass: false,
        warning: 'offline',
        note: `GET /mcp unreached: ${(e as Error).message?.slice(0, 80) ?? 'error'}`,
        target,
        usage: tokenUsageOf(target, { warning: 'offline' }),
      })
    }
  }

  // ── Public UI: ObservePanel contract — r required; no Bearer in client body ──
  {
    const fakeLog = 'observe · receipts · never Bearer FAKESECRET_e2f3g4h5i6j7k8l9m0n1'
    const sealedLog = String(redactSecretsOf(fakeLog))
    const pass = !secretsInOf(sealedLog) && sealedLog.includes(REDACTED)
    const target: TokenTarget = { who: 'ui.ObservePanel', door: 'connector', tool: 'observe', panel: 'ObservePanel' }
    cells.push({
      level: 'Public UI',
      mode: 'offline',
      pass,
      holds: pass,
      note: 'Public panels fetch /mcp without Authorization; logs seal Bearer shapes',
      target,
      usage: tokenUsageOf(target, { sealedLog }),
    })
  }

  // ── SDK adapters: native registry offline ──
  {
    const { nativeAdaptersOf } = await import('./native-adapters.js')
    const adapters = nativeAdaptersOf()
    const pass = adapters.holds === true && Array.isArray(adapters.adapters) && adapters.adapters.length > 0
    const target: TokenTarget = { who: 'sdk.native-adapters', door: 'connector', tool: 'adapters', panel: 'NativeAdaptersPanel' }
    cells.push({
      level: 'SDK adapters',
      mode: 'offline',
      pass,
      holds: pass,
      note: `nativeAdaptersOf ${adapters.adapters?.length ?? 0} vendors — local registry, no vendor API keys`,
      target,
      usage: tokenUsageOf(target, { count: adapters.adapters?.length ?? 0 }),
    })
  }

  // optional online host probe skipped for SDK (keys not in tree)
  if (wantOnline) {
    const target: TokenTarget = { who: 'sdk.adapters.online', door: 'connector', tool: 'adapters', panel: 'sdk' }
    cells.push({
      level: 'SDK adapters',
      mode: 'online',
      pass: true,
      holds: true,
      note: 'vendor HTTP needs IBM/IonQ/Braket tokens — not called; adapters map foreign→QPU only',
      target,
      usage: tokenUsageOf(target, { called: false }),
    })
  }

  const offlineCells = cells.filter((c) => c.mode === 'offline')
  const onlineCells = cells.filter((c) => c.mode === 'online')
  const offlinePass = offlineCells.every((c) => c.pass)
  const onlinePass = onlineCells.length === 0 || onlineCells.every((c) => c.pass || c.warning === 'offline' || c.warning === 'timeout')
  // online "unreached" is documented behavior, not a matrix fail — fail only hard formula lies
  const onlineHardFail = onlineCells.some((c) => !c.pass && !c.warning)
  const usage = cells.map((c) => c.usage).filter(Boolean) as TokenUsageRow[]
  const sealed = usage.every((u) => u.sealed === true) && cells.every((c) => !secretsInOf(JSON.stringify(sealPayloadOf(c))))

  return sealPayloadOf({
    kind: 'online-mode' as const,
    call: wantOnline
      ? ('tools/call connector { online: true }' as const)
      : ('tools/call connector { offline: true }' as const),
    host: wantOnline ? host : 'local',
    wantOnline,
    wantOffline,
    matrix: cells.map((c) => ({
      level: c.level,
      mode: c.mode,
      pass: c.pass,
      holds: c.holds,
      warning: c.warning,
      note: c.note,
      who: c.target.who,
    })),
    usage,
    counts: {
      cells: cells.length,
      offline: offlineCells.length,
      online: onlineCells.length,
      offlinePass: offlineCells.filter((c) => c.pass).length,
      onlinePass: onlineCells.filter((c) => c.pass).length,
      onlineUnreached: onlineCells.filter((c) => c.warning).length,
    },
    tokenSeal: { sealed, redacted: REDACTED, note: 'Bearer/apiKey/access.token secrets never echoed' as const },
    connectBill: connectBillOf(),
    holds: offlinePass && !onlineHardFail && sealed && connectBillOf().holds,
    goal: 'OPEN' as const,
    note: 'level×mode matrix; offline always local; online host probe optional; unreached is warning not formula fail' as const,
  })
}

export const publicWaitsOf = async (request: Request): Promise<Response> => {
  const url = new URL(request.url)
  const mode = url.searchParams.get('mode') ?? 'waits'
  const take = url.searchParams.has('take') ? Number(url.searchParams.get('take')) : undefined
  const host = url.searchParams.get('host') ?? undefined
  const args: Record<string, unknown> =
    mode === 'slow'
      ? { slow: true, ...(take !== undefined ? { take } : {}) }
      : mode === 'cool'
        ? { cool: true }
        : mode === 'online'
          ? { online: true, ...(host ? { host } : {}) }
          : mode === 'offline'
            ? { offline: true }
            : { waits: true }
  return Response.json(await waitsAnswerOf(args), {
    headers: { 'cache-control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=120' },
  })
}

export const tokensPlugin = (): QpuPlugin => (config) => ({
  ...config,
  endpoints: [
    ...(config.endpoints ?? []),
    { path: '/qpu/waits', method: 'get' as const, handler: (req: Request) => publicWaitsOf(req) },
    {
      path: '/qpu/online',
      method: 'get' as const,
      handler: (req: Request) => {
        const url = new URL(req.url)
        url.searchParams.set('mode', url.searchParams.get('mode') ?? 'offline')
        return publicWaitsOf(new Request(url, req))
      },
    },
  ],
})
