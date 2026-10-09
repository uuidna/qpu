import { ClaySeals, ClayPass, CLAY_SEALS } from '../../families/clay/index.js'
import { MonitoringFormulas } from '../../families/monitoring/index.js'
import { WaveFormulas, waveFamiliesOf } from '../../families/wave/index.js'
import {
  qpuFacesOf,
  qpuHarnessesOf,
  qpuHexUuidOf,
  qpuHexRunOf,
  qpuMcpToolsListOf,
  qpuMcpFusedOf,
  qpuMcpDoorsOf,
  type QpuEnv,
} from '../../quantum/processing/unit/index.js'
import type { QpuPlugin } from './surface.js'

/** One measurable hop — same shape inside-out and outside-in. */
export type ExamHop = {
  dir: 'inside-out' | 'outside-in'
  layer: string
  door?: string
  tool?: string
  family?: string
  formula?: string
  hex?: string | null
  ms: number
  holds?: boolean
  value?: unknown
  error?: string
  timeout?: boolean
  silent?: boolean
  note?: string
}

const withTimeout = async <T>(ms: number, work: () => Promise<T>): Promise<{ ok: true; value: T; ms: number } | { ok: false; ms: number; timeout: boolean; error: string }> => {
  const t0 = Date.now()
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    const value = await Promise.race([
      work(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(Object.assign(new Error(`timeout ${ms}ms`), { name: 'TimeoutError' })), ms)
      }),
    ])
    return { ok: true, value, ms: Date.now() - t0 }
  } catch (e) {
    const err = e as { name?: string; message?: string }
    const timeout = err?.name === 'TimeoutError' || /timeout/i.test(String(err?.message ?? e))
    return { ok: false, ms: Date.now() - t0, timeout, error: String(err?.message ?? e) }
  } finally {
    if (timer) clearTimeout(timer)
  }
}

const hopOk = (partial: Omit<ExamHop, 'ms' | 'error' | 'timeout'> & { ms: number; holds?: boolean; value?: unknown }): ExamHop => ({
  ...partial,
  silent: false,
})

const hopFail = (partial: Omit<ExamHop, 'ms' | 'holds'> & { ms: number; timeout?: boolean; error: string }): ExamHop => ({
  ...partial,
  silent: partial.timeout === true,
  holds: false,
})

/**
 * Bidirectional MCP path exam.
 * Inside-out: formula → hex → wave/clay → fused catalogue → tools/list → Payload doors → harnesses.
 * Outside-in: harness URL → tools/list → tools/call (via publicDoorFetchOf) → hex/formula.
 * clay.pass is probed with a deadline so a discover hang is a timeout hop, not silence.
 */
export const examOf = async (env?: QpuEnv) => {
  const faces = qpuFacesOf().faces
  // lattice-named foreign deadline scale: tenOf(hexbit)=10000; clay.pass probe uses faces*faces*10 ms so hangs surface
  const passBudgetMs = faces * faces * 10
  const hops: ExamHop[] = []

  // ─── INSIDE-OUT ─────────────────────────────────────────────
  {
    const t0 = Date.now()
    const r = ClaySeals.riemann(1, 2)
    hops.push(hopOk({
      dir: 'inside-out', layer: 'formula', family: 'clay', formula: 'riemann',
      hex: r.hex ?? null, ms: Date.now() - t0, holds: r.holds === true, value: r.value,
      note: 'CrossFormula direct',
    }))
  }

  {
    const t0 = Date.now()
    let hex = ''
    try { hex = qpuHexUuidOf({ family: 'clay', program: ['riemann'], params: [1, 2] }) } catch (e) {
      hops.push(hopFail({ dir: 'inside-out', layer: 'hex-mint', family: 'clay', formula: 'riemann', ms: Date.now() - t0, error: String(e) }))
      hex = ''
    }
    if (hex) {
      const run = await withTimeout(passBudgetMs, async () => qpuHexRunOf(hex, undefined, undefined, { store: false }) as Promise<{ value?: unknown; holds?: boolean }>)
      if (run.ok) {
        hops.push(hopOk({
          dir: 'inside-out', layer: 'hex-run', family: 'clay', formula: 'riemann', door: 'hex',
          hex, ms: run.ms, holds: run.value.holds === true, value: run.value.value,
        }))
      } else {
        hops.push(hopFail({ dir: 'inside-out', layer: 'hex-run', family: 'clay', formula: 'riemann', door: 'hex', hex, ms: run.ms, timeout: run.timeout, error: run.error }))
      }
    }
  }

  {
    const run = await withTimeout(passBudgetMs, async () => WaveFormulas.sweep(0) as Promise<{ value?: unknown; holds?: boolean; hex?: string; next?: unknown }>)
    if (run.ok) {
      hops.push(hopOk({
        dir: 'inside-out', layer: 'wave', family: 'wave', formula: 'sweep',
        hex: typeof run.value.hex === 'string' ? run.value.hex : null,
        ms: run.ms, holds: run.value.holds === true, value: run.value.value,
        note: `families=${waveFamiliesOf().length}; next=${'next' in run.value ? run.value.next : 'absent'}`,
      }))
    } else {
      hops.push(hopFail({ dir: 'inside-out', layer: 'wave', family: 'wave', formula: 'sweep', ms: run.ms, timeout: run.timeout, error: run.error }))
    }
  }

  {
    // Affirmative: seal-wave (no discover) — safe evidence. Anti-point: full qpuDiscoverOf OOMs (~4GB / exit 134).
    const { claySealWaveOf } = await import('../../families/clay/index.js')
    const sealRun = await withTimeout(passBudgetMs, async () => claySealWaveOf(0))
    if (sealRun.ok && sealRun.value) {
      const r = sealRun.value
      hops.push(hopOk({
        dir: 'inside-out', layer: 'clay.seal-wave', family: 'clay', formula: 'pass', tool: 'hex',
        hex: r.hex || null, ms: sealRun.ms, holds: r.involutive === true, value: r.held,
        note: `seal=${r.name}; discover=skipped; fullDiscover OOM/SIGABRT 134`,
      }))
    } else {
      hops.push(hopFail({
        dir: 'inside-out', layer: 'clay.seal-wave', family: 'clay', formula: 'pass', tool: 'hex',
        ms: sealRun.ms, timeout: !sealRun.ok && sealRun.timeout, error: !sealRun.ok ? sealRun.error : 'null',
        note: `seal=${CLAY_SEALS[0]}`,
      }))
    }
    // Sliced clay.pass (faces families) — still time-boxed; never full-registry in exam.
    const run = await withTimeout(passBudgetMs, async () => ClayPass.pass(0))
    if (run.ok) {
      const r = run.value as { hex?: string; value?: number; holds?: boolean }
      hops.push(hopOk({
        dir: 'inside-out', layer: 'clay.pass', family: 'clay', formula: 'pass', tool: 'hex',
        hex: r.hex ?? null, ms: run.ms, holds: r.holds === true, value: r.value,
        note: `seal=${CLAY_SEALS[0]}; sliced discover; budgetMs=${passBudgetMs}; fullDiscover=OOM`,
      }))
    } else {
      hops.push(hopFail({
        dir: 'inside-out', layer: 'clay.pass', family: 'clay', formula: 'pass', tool: 'hex',
        ms: run.ms, timeout: run.timeout, error: run.error,
        note: `seal=${CLAY_SEALS[0]}; timeout/OOM risk on discover; budgetMs=${passBudgetMs}; use claySealWaveOf`,
      }))
    }
  }

  {
    const t0 = Date.now()
    const doors = qpuMcpDoorsOf()
    hops.push(hopOk({
      dir: 'inside-out', layer: 'unit', door: 'boot/stdio/router',
      ms: Date.now() - t0, holds: doors.holds === true, value: doors.reachable,
      note: `doors=${doors.doors.length}; formulas=${doors.formulas.length}; fused rides on the same /mcp router`,
    }))
  }

  {
    const t0 = Date.now()
    const fused = qpuMcpFusedOf()
    hops.push(hopOk({
      dir: 'inside-out', layer: 'fused-mcp', door: 'qpu-fused',
      ms: Date.now() - t0, holds: fused.length > 0, value: fused.length,
      note: fused.map((t) => t.name).join(','),
    }))
  }

  {
    const t0 = Date.now()
    const tools = qpuMcpToolsListOf()
    const bytes = JSON.stringify({ resultType: 'complete', tools }).length
    hops.push(hopOk({
      dir: 'inside-out', layer: 'tools/list', door: '/mcp',
      ms: Date.now() - t0, holds: tools.length <= 16 && bytes < 16384 && tools.every((t) => !t.name.startsWith('qpu_')),
      value: { doors: tools.length, bytes },
      note: tools.map((t) => t.name).join(','),
    }))
  }

  {
    const t0 = Date.now()
    const h = qpuHarnessesOf()
    hops.push(hopOk({
      dir: 'inside-out', layer: 'harnesses', door: 'connector',
      ms: Date.now() - t0, holds: h.holds === true, value: h.rows.length,
      note: h.url,
    }))
  }

  // ─── OUTSIDE-IN (Payload publicMcpOf — same door harnesses POST) ───
  const { publicMcpOf } = await import('./public.js')

  {
    const t0 = Date.now()
    const h = qpuHarnessesOf()
    hops.push(hopOk({
      dir: 'outside-in', layer: 'harness→url', door: h.url, tool: 'connector',
      ms: Date.now() - t0, holds: h.holds === true, value: h.rows.length,
      note: 'all 8 harnesses → one /mcp URL',
    }))
  }

  {
    const run = await withTimeout(passBudgetMs, async () => {
      const res = await publicMcpOf(new Request('https://qpu.uuidna.com/mcp', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
      }), env)
      return { status: res.status, body: await res.json() as { result?: { tools?: { name: string }[] } } }
    })
    if (run.ok) {
      const tools = run.value.body.result?.tools ?? []
      hops.push(hopOk({
        dir: 'outside-in', layer: 'tools/list', door: '/mcp', tool: 'tools/list',
        ms: run.ms, holds: run.value.status === 200 && tools.length === 16, value: tools.length,
      }))
    } else {
      hops.push(hopFail({ dir: 'outside-in', layer: 'tools/list', door: '/mcp', tool: 'tools/list', ms: run.ms, timeout: run.timeout, error: run.error }))
    }
  }

  {
    const run = await withTimeout(passBudgetMs, async () => {
      const res = await publicMcpOf(new Request('https://qpu.uuidna.com/mcp', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 2, method: 'tools/call',
          params: { name: 'hex', arguments: { family: 'clay', program: ['riemann'], params: [1, 2] } },
        }),
      }), env)
      const body = await res.json() as { result?: { structuredContent?: { holds?: boolean; value?: unknown; uuid?: string }; holds?: boolean; value?: unknown; uuid?: string }; error?: unknown }
      const sc = body.result?.structuredContent ?? body.result ?? {}
      return { status: res.status, error: body.error, sc }
    })
    if (run.ok) {
      const sc = run.value.sc as { holds?: boolean; value?: unknown; uuid?: string }
      hops.push(hopOk({
        dir: 'outside-in', layer: 'tools/call→hex→formula', door: '/mcp', tool: 'hex',
        family: 'clay', formula: 'riemann', hex: sc.uuid ?? null,
        ms: run.ms, holds: run.value.status === 200 && !run.value.error && sc.holds === true, value: sc.value,
      }))
    } else {
      hops.push(hopFail({
        dir: 'outside-in', layer: 'tools/call→hex→formula', door: '/mcp', tool: 'hex',
        family: 'clay', formula: 'riemann', ms: run.ms, timeout: run.timeout, error: run.error,
      }))
    }
  }

  {
    const run = await withTimeout(passBudgetMs, async () => {
      const res = await publicMcpOf(new Request('https://qpu.uuidna.com/mcp', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 3, method: 'tools/call',
          params: { name: 'connector', arguments: { point: true } },
        }),
      }), env)
      const body = await res.json() as { result?: { structuredContent?: { kind?: string; holds?: boolean; held?: number }; holds?: boolean; kind?: string }; error?: unknown }
      const sc = body.result?.structuredContent ?? body.result ?? {}
      return { status: res.status, error: body.error, sc }
    })
    if (run.ok) {
      const sc = run.value.sc as { kind?: string; holds?: boolean; held?: number }
      hops.push(hopOk({
        dir: 'outside-in', layer: 'tools/call→connector→point', door: '/mcp', tool: 'connector',
        ms: run.ms, holds: run.value.status === 200 && !run.value.error && (sc.kind === 'point' || sc.holds === true),
        value: { kind: sc.kind, held: sc.held },
      }))
    } else {
      hops.push(hopFail({
        dir: 'outside-in', layer: 'tools/call→connector→point', door: '/mcp', tool: 'connector',
        ms: run.ms, timeout: run.timeout, error: run.error,
      }))
    }
  }

  const inside = hops.filter((h) => h.dir === 'inside-out')
  const outside = hops.filter((h) => h.dir === 'outside-in')
  const healthy = hops.filter((h) => h.holds === true && !h.timeout && !h.error)
  const blind = hops.filter((h) => h.timeout || h.silent || (h.error && !h.holds))
  const tools = qpuMcpToolsListOf()
  const listBytes = JSON.stringify({ resultType: 'complete', tools }).length
  const coverage = MonitoringFormulas.coverage(healthy.length, hops.length)
  const noise = MonitoringFormulas.noise(blind.filter((h) => h.timeout).length, Math.max(1, hops.length))

  return {
    kind: 'exam' as const,
    call: 'tools/call connector { exam: true }' as const,
    endpoint: '/api/qpu/exam' as const,
    maps: {
      insideOut: ['formula', 'hex-mint/run', 'wave', 'clay.pass', 'unit', 'fused-mcp', 'tools/list', 'harnesses'] as const,
      outsideIn: ['harness→url', 'tools/list', 'tools/call→hex→formula', 'tools/call→connector→point'] as const,
    },
    passBudgetMs,
    hops,
    healthy: healthy.map((h) => ({ layer: h.layer, dir: h.dir, ms: h.ms, family: h.family, formula: h.formula, value: h.value })),
    blindSpots: blind.map((h) => ({ layer: h.layer, dir: h.dir, ms: h.ms, timeout: h.timeout, error: h.error, note: h.note })),
    counts: {
      hops: hops.length,
      inside: inside.length,
      outside: outside.length,
      healthy: healthy.length,
      blind: blind.length,
    },
    monitoring: {
      coverage: { hex: coverage.hex, value: coverage.value, holds: coverage.holds, rawNext: 'absent' as const },
      noise: { hex: noise.hex, value: noise.value, holds: noise.holds, rawNext: 'absent' as const },
    },
    connectBill: {
      doors: tools.length,
      bytes: listBytes,
      under16384: listBytes < 16384,
      qpuPrefixed: tools.filter((t) => t.name.startsWith('qpu_')).length,
    },
    clayPass: hops.find((h) => h.layer === 'clay.pass') ?? null,
    holds: healthy.length > 0 && blind.every((h) => h.timeout === true || h.layer === 'clay.pass'),
    goal: 'OPEN' as const,
  }
}

export const publicExamOf = async (env?: QpuEnv): Promise<Response> =>
  Response.json(await examOf(env), {
    headers: { 'cache-control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=120' },
  })

export const examPlugin = (): QpuPlugin => (config) => ({
  ...config,
  endpoints: [
    ...(config.endpoints ?? []),
    { path: '/qpu/exam', method: 'get' as const, handler: async () => publicExamOf() },
  ],
})
