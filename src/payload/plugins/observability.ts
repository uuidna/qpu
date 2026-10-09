/**
 * Receipt observability + connector verbosity — fused on `connector`, never a tools/list door.
 *
 * Verbosity 0..3 is how much of each receipt's signal is kept (observability.sampling /
 * logging.samplingrate). `{ observe: true }` reads committed receipts with an observability
 * block; `{ verbosity: n }` sets the level for that reading. Connect bill stays ≤16.
 *
 *   tools/call connector { observe: true }
 *   tools/call connector { verbosity: 2 }
 *   tools/call connector { observe: true, verbosity: 3, receipt: "gate-receipt" }
 */
import { ObservabilityFormulas } from '../../families/observability/index.js'
import { LoggingFormulas } from '../../families/logging/index.js'
import { qpuHexUuidOf, qpuMcpToolsListOf } from '../../quantum/processing/unit/index.js'
import type { QpuPlugin } from './surface.js'

/** Cap = 3 → four levels (silent / holds / doors+ms / full). Combinatorial, not prose. */
export const VERBOSITY_CAP = 3 as const

export type Verbosity = 0 | 1 | 2 | 3

export type ReceiptObserveInput = {
  kind?: string
  file?: string
  ms?: number
  seconds?: number
  door?: string
  tool?: string
  holds?: boolean
  value?: unknown
  verbosity?: number
  errors?: readonly string[]
  pass?: number
  fail?: number
  rows?: number
}

export type ReceiptObservability = {
  kind: 'receipt-observability'
  ms: number
  door: string
  tool: string
  holds: boolean
  value: unknown
  verbosity: Verbosity
  errors: readonly string[]
  formulas: {
    sampling: { address: string; hex: string | null; value: number; holds: boolean }
    signal: { address: string; hex: string | null; value: number; holds: boolean }
    errorratio: { address: string; hex: string | null; value: number; holds: boolean }
    slo: { address: string; hex: string | null; value: number; holds: boolean }
  }
  note: string
}

const clampVerbosity = (n: unknown): Verbosity => {
  const v = typeof n === 'number' && Number.isSafeInteger(n) ? n : 1
  if (v <= 0) return 0
  if (v >= VERBOSITY_CAP) return VERBOSITY_CAP
  return v as Verbosity
}

const hexOf = (family: string, formula: string, params: number[]): string | null => {
  try {
    return qpuHexUuidOf({ family, program: [formula], params })
  } catch {
    return null
  }
}

const formulaRow = (family: string, formula: string, params: number[], row: { value: number; holds: boolean }) => ({
  address: `${family}.${formula}`,
  hex: hexOf(family, formula, params),
  value: row.value,
  holds: row.holds === true,
})

/**
 * Stamp one receipt (or live call) with formulated observability.
 * Verbosity gates which fields a UI should surface; the stamp always carries the full block.
 */
export const receiptObservabilityOf = (input: ReceiptObserveInput = {}): ReceiptObservability => {
  const verbosity = clampVerbosity(input.verbosity)
  const ms =
    typeof input.ms === 'number' && Number.isFinite(input.ms)
      ? Math.max(0, Math.round(input.ms))
      : typeof input.seconds === 'number' && Number.isFinite(input.seconds)
        ? Math.max(0, Math.round(input.seconds * 1000))
        : 0
  const door = typeof input.door === 'string' && input.door ? input.door : 'connector'
  const tool = typeof input.tool === 'string' && input.tool ? input.tool : typeof input.kind === 'string' ? input.kind : 'receipt'
  const holds = input.holds === true
  const errors = Array.isArray(input.errors) ? input.errors.filter((e) => typeof e === 'string') : []
  const pass = typeof input.pass === 'number' && Number.isSafeInteger(input.pass) ? Math.max(0, input.pass) : holds ? 1 : 0
  const fail =
    typeof input.fail === 'number' && Number.isSafeInteger(input.fail)
      ? Math.max(0, input.fail)
      : errors.length > 0
        ? errors.length
        : holds
          ? 0
          : 1
  const total = Math.max(1, pass + fail)
  const sampled = verbosity
  const events = Math.max(1, typeof input.rows === 'number' && Number.isSafeInteger(input.rows) ? input.rows : total)
  const noise = Math.max(1, fail + 1)

  const sampling = ObservabilityFormulas.sampling(sampled, VERBOSITY_CAP)
  const signal = ObservabilityFormulas.signal(events, noise)
  const errorratio = LoggingFormulas.errorratio(fail, total)
  const slo = ObservabilityFormulas.slo(pass, total)

  return {
    kind: 'receipt-observability',
    ms,
    door,
    tool,
    holds,
    value: input.value ?? (holds ? 1 : 0),
    verbosity,
    errors,
    formulas: {
      sampling: formulaRow('observability', 'sampling', [sampled, VERBOSITY_CAP], sampling),
      signal: formulaRow('observability', 'signal', [events, noise], signal),
      errorratio: formulaRow('logging', 'errorratio', [fail, total], errorratio),
      slo: formulaRow('observability', 'slo', [pass, total], slo),
    },
    note:
      verbosity === 0
        ? 'silent — recognition only'
        : verbosity === 1
          ? 'holds/value'
          : verbosity === 2
            ? 'holds/value + ms/door/tool'
            : 'full — errors + formulated sampling/signal/slo',
  }
}

/** Project a stamp down to what the chosen verbosity keeps (author signal, not a second truth). */
export const observeAtVerbosityOf = (obs: ReceiptObservability): Record<string, unknown> => {
  if (obs.verbosity <= 0) return { kind: obs.kind, verbosity: 0 }
  if (obs.verbosity === 1) return { kind: obs.kind, verbosity: 1, holds: obs.holds, value: obs.value }
  if (obs.verbosity === 2) {
    return { kind: obs.kind, verbosity: 2, holds: obs.holds, value: obs.value, ms: obs.ms, door: obs.door, tool: obs.tool }
  }
  return { ...obs }
}

export type ObserveReading = {
  kind: 'observe'
  call: 'tools/call connector { observe: true }'
  verbosity: Verbosity
  cap: typeof VERBOSITY_CAP
  levels: readonly { level: Verbosity; keeps: string }[]
  connectBill: { doors: number; bytes: number; under16384: boolean; qpuPrefixed: number; holds: boolean }
  receipts: {
    file: string
    name: string
    kind: string | null
    holds: boolean | null
    seconds: number | null
    observability: Record<string, unknown>
  }[]
  selected?: { file: string; name: string; observability: Record<string, unknown> }
  formulas: ReceiptObservability['formulas']
  holds: boolean
  goal: 'OPEN'
  note: string
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

/**
 * Connector answer for `{ observe: true }` / `{ verbosity }`.
 * Overlays formulated observability on each committed receipt — does not invent prices or flip goal.
 */
export const observeOf = async (args: Record<string, unknown> = {}): Promise<ObserveReading & { usage?: unknown[]; tokenSeal?: unknown }> => {
  const verbosity = clampVerbosity(args.verbosity ?? args.level ?? 1)
  const bill = connectBillOf()
  const { receipts } = await import('../../receipts/index.js')
  const { sealPayloadOf, tokenUsageOf, secretsInOf } = await import('./tokens.js')
  const want =
    typeof args.receipt === 'string'
      ? args.receipt
      : typeof args.file === 'string'
        ? args.file
        : typeof args.name === 'string'
          ? args.name
          : undefined

  const rows = receipts.map((r) => {
    const doc = sealPayloadOf(r.doc) as typeof r.doc
    const kind = typeof doc.kind === 'string' ? doc.kind : null
    const holds = typeof doc.holds === 'boolean' ? doc.holds : null
    const seconds = typeof doc.seconds === 'number' ? doc.seconds : null
    const rowsN = Array.isArray(doc.rows) ? doc.rows.length : typeof doc.tests === 'number' ? doc.tests : 0
    const fail = typeof doc.fail === 'number' ? doc.fail : typeof doc.untested === 'number' ? doc.untested : holds === false ? 1 : 0
    const pass = typeof doc.pass === 'number' ? doc.pass : typeof doc.tested === 'number' ? doc.tested : holds === true ? 1 : 0
    const existing = doc.observability && typeof doc.observability === 'object' ? (doc.observability as ReceiptObserveInput) : {}
    const stamp = receiptObservabilityOf({
      ...existing,
      kind: kind ?? r.name,
      file: r.file,
      seconds: seconds ?? undefined,
      ms: typeof existing.ms === 'number' ? existing.ms : undefined,
      door: typeof existing.door === 'string' ? existing.door : 'connector',
      tool: typeof existing.tool === 'string' ? existing.tool : r.name,
      holds: holds === true,
      value: doc.value ?? doc.uuid ?? doc.receipt ?? (holds ? 1 : 0),
      verbosity,
      errors: Array.isArray(existing.errors) ? existing.errors : fail > 0 && holds === false ? [`${r.name} does not hold`] : [],
      pass,
      fail,
      rows: rowsN,
    })
    return {
      file: r.file,
      name: r.name,
      kind,
      holds,
      seconds,
      observability: observeAtVerbosityOf(stamp),
      usage: tokenUsageOf(
        {
          who: `receipt.${r.name}`,
          door: stamp.door,
          tool: stamp.tool,
          panel: 'observe',
        },
        { kind, holds, seconds, rows: rowsN },
      ),
    }
  })

  const selected = want
    ? rows.find((r) => r.file === want || r.name === want || r.file.replace(/\.json$/, '') === want)
    : undefined

  const sample = receiptObservabilityOf({ verbosity, holds: bill.holds, door: 'connector', tool: 'observe', value: rows.length, rows: rows.length })
  const usage = rows.map((r) => r.usage)
  const sealed = !secretsInOf(JSON.stringify(sealPayloadOf({ receipts: rows.map(({ usage: _u, ...rest }) => rest), usage })))

  return sealPayloadOf({
    kind: 'observe',
    call: 'tools/call connector { observe: true }',
    verbosity,
    cap: VERBOSITY_CAP,
    levels: [
      { level: 0, keeps: 'silent — recognition only' },
      { level: 1, keeps: 'holds/value + usage who/bytes/llmTokens' },
      { level: 2, keeps: 'holds/value + ms/door/tool + usage' },
      { level: 3, keeps: 'full — errors + formulated sampling/signal/slo + usage' },
    ],
    connectBill: bill,
    receipts:
      verbosity <= 0
        ? []
        : rows.map(({ usage: _u, ...rest }) =>
            verbosity <= 1
              ? {
                  file: rest.file,
                  name: rest.name,
                  kind: rest.kind,
                  holds: rest.holds,
                  seconds: rest.seconds,
                  observability: rest.observability,
                }
              : rest,
          ),
    usage: verbosity <= 0 ? [] : usage,
    tokenSeal: { sealed, note: 'Bearer/API keys/access.token secrets redacted; compact related dumps' },
    ...(selected
      ? {
          selected: {
            file: selected.file,
            name: selected.name,
            observability: selected.observability,
            usage: selected.usage,
          },
        }
      : {}),
    formulas: sample.formulas,
    holds: bill.holds === true && sample.formulas.sampling.holds && sealed,
    goal: 'OPEN',
    note: 'observability + identifiable token usage per receipt; secrets sealed; verbosity fused on connector — not a tools/list door',
  }) as ObserveReading & { usage?: unknown[]; tokenSeal?: unknown }
}

export const publicObserveOf = async (request: Request): Promise<Response> => {
  const url = new URL(request.url)
  const verbosity = url.searchParams.has('verbosity') ? Number(url.searchParams.get('verbosity')) : 2
  const receipt = url.searchParams.get('receipt') ?? undefined
  return Response.json(await observeOf({ observe: true, verbosity, ...(receipt ? { receipt } : {}) }), {
    headers: { 'cache-control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=120' },
  })
}

export const observabilityPlugin = (): QpuPlugin => (config) => ({
  ...config,
  endpoints: [
    ...(config.endpoints ?? []),
    {
      path: '/qpu/observe',
      method: 'get' as const,
      handler: (req: Request) => publicObserveOf(req),
    },
  ],
})
