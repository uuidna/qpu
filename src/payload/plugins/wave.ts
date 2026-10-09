import { readFileSync } from 'node:fs'
import { WaveFormulas, waveFamiliesOf } from '../../families/wave/index.js'
import { qpuFacesOf, qpuHexFamiliesOf, qpuHexUuidOf } from '../../quantum/processing/unit/index.js'
import { openMathScaleOf } from './clay.js'
import type { QpuPlugin } from './surface.js'

/** Families whose slice presence is clay / seal / lattice / citation / prize / pravets / cloud.scale relevant. */
const CLAY_HINT = /^(clay|lattice|cloud|perma|ceramics)$|millennium|seal|citation|prize|pravets/i

export type WaveSweepRow = {
  from: number
  hex: string | null
  value: number
  holds: boolean
  rawNext: number | null
  nextVerified: boolean
  families: string[]
  silent: string[]
  answered: string[]
  clayRelevant: string[]
  heldFormulas: {
    family: string
    formula: string
    body: string
    hex: string
    value: number
    holds: boolean
    rawNext: unknown
  }[]
}

export type WavePassSummary = {
  pass: number
  width: number
  fromStart: number
  fromIndices: number[]
  sweeps: number
  holdsTrue: number
  holdsFalse: number
  sumValue: number
  furthestNext: number | null
  wallMs: number
  clayHits: { from: number; families: string[]; heldFormulas: WaveSweepRow['heldFormulas'] }[]
  rows: WaveSweepRow[]
}

const familyText = new Map<string, string>()
const bodyOf = (family: string, formula: string): string => {
  let text = familyText.get(family)
  if (text === undefined) {
    try {
      text = readFileSync(new URL(`../../families/${family}/index.ts`, import.meta.url), 'utf8')
    } catch {
      text = ''
    }
    familyText.set(family, text)
  }
  const at = text.search(new RegExp(`static\\s+${formula}\\s*\\(`))
  if (at < 0) return ''
  const slice = text.slice(at, at + 400)
  const m = slice.match(new RegExp(`static\\s+${formula}\\s*\\([^)]*\\)[^{]*\\{[^}]*\\}`))
  return (m?.[0] ?? slice.split('\n').slice(0, 3).join(' ')).replace(/\s+/g, ' ').trim().slice(0, 240)
}

/** Raw next only when the sweep result itself carries next; verify equals from+faces. Never invent. */
const rawNextOf = (from: number, faces: number, r: { next?: unknown }): { rawNext: number | null; nextVerified: boolean } => {
  if (!('next' in r) || r.next === undefined || r.next === null) return { rawNext: null, nextVerified: false }
  const n = Number(r.next)
  if (!Number.isSafeInteger(n)) return { rawNext: null, nextVerified: false }
  return { rawNext: n, nextVerified: n === from + faces }
}

const heldFormulasOf = async (answered: string[]): Promise<WaveSweepRow['heldFormulas']> => {
  const out: WaveSweepRow['heldFormulas'] = []
  for (const family of answered) {
    const first = qpuHexFamiliesOf().get(family)?.[0]
    if (!first || first.arity > 1) continue
    const params = first.arity === 0 ? [] : [3]
    let hex = ''
    try {
      hex = qpuHexUuidOf({ family, program: [first.name], params })
    } catch {
      continue
    }
    try {
      // Prefer the family's own CrossFormula (first.run) so a filled next:faces from qpuHexRunOf is not mistaken for raw next.
      const direct = first.run(params.map(BigInt)) as { value?: unknown; holds?: boolean; next?: unknown; hex?: string }
      const value =
        typeof direct.value === 'bigint' || typeof direct.value === 'number'
          ? Number(direct.value)
          : typeof direct.value === 'object' && direct.value !== null && 'value' in direct.value
            ? Number((direct.value as { value: unknown }).value)
            : NaN
      out.push({
        family,
        formula: first.name,
        body: bodyOf(family, first.name),
        hex: typeof direct.hex === 'string' ? direct.hex : hex,
        value: Number.isFinite(value) ? value : 0,
        holds: direct.holds === true,
        rawNext: Object.prototype.hasOwnProperty.call(direct, 'next') ? (direct.next ?? null) : undefined,
      })
    } catch {
      out.push({ family, formula: first.name, body: bodyOf(family, first.name), hex, value: 0, holds: false, rawNext: undefined })
    }
  }
  return out
}

const sweepOne = async (from: number, faces: number, names: string[]): Promise<WaveSweepRow> => {
  const r = (await WaveFormulas.sweep(from)) as unknown as {
    hex?: string
    value: number
    holds: boolean
    next?: unknown
    families?: string[]
    silent?: string[]
  }
  const families = Array.isArray(r.families) ? r.families : names.slice(from, from + faces)
  const silent = Array.isArray(r.silent) ? r.silent : []
  const answered = families.filter((f) => !silent.includes(f))
  const clayRelevant = families.filter((f) => CLAY_HINT.test(f))
  const { rawNext, nextVerified } = rawNextOf(from, faces, r)
  // Held-formula bodies only when the slice is clay-relevant or at least one agent held — keeps mass sweeps lean.
  const heldFormulas = clayRelevant.length || answered.length ? await heldFormulasOf(answered) : []
  return {
    from,
    hex: typeof r.hex === 'string' ? r.hex : null,
    value: Number(r.value),
    holds: r.holds === true,
    rawNext,
    nextVerified,
    families,
    silent,
    answered,
    clayRelevant,
    heldFormulas,
  }
}

const passOf = async (pass: number, fromStart: number, width: number, faces: number, names: string[]): Promise<WavePassSummary> => {
  const fromIndices = Array.from({ length: width }, (_, k) => fromStart + k * faces)
  const t0 = Date.now()
  const rows = await Promise.all(fromIndices.map((from) => sweepOne(from, faces, names)))
  const wallMs = Date.now() - t0
  const clayHits = rows
    .filter((row) => row.clayRelevant.length > 0)
    .map((row) => ({
      from: row.from,
      families: row.clayRelevant,
      heldFormulas: row.heldFormulas.filter((h) => row.clayRelevant.includes(h.family)),
    }))
  const nexts = rows.map((r) => r.rawNext).filter((n): n is number => n !== null)
  return {
    pass,
    width,
    fromStart,
    fromIndices,
    sweeps: rows.length,
    holdsTrue: rows.filter((r) => r.holds).length,
    holdsFalse: rows.filter((r) => !r.holds).length,
    sumValue: rows.reduce((s, r) => s + (Number.isFinite(r.value) ? r.value : 0), 0),
    furthestNext: nexts.length ? Math.max(...nexts) : null,
    wallMs,
    clayHits,
    rows,
  }
}

/**
 * Combinatorial wave.sweep grid: stride = faces, width concurrent from-indices, width doubles each pass.
 * Local unit compute only. Caller supplies from / width / passes — nothing is invented.
 */
export const waveSweepGridOf = async (args: { from: number; width?: number; passes?: number }) => {
  const faces = qpuFacesOf().faces
  const names = waveFamiliesOf()
  const from0 = args.from
  const width0 = args.width ?? faces * 2
  const passesN = args.passes ?? 1
  if (!Number.isSafeInteger(from0) || from0 < 0) {
    return { kind: 'wave-sweep-grid' as const, holds: false as const, denied: 'from' as const, faces, citation: openMathScaleOf().citation }
  }
  if (!Number.isSafeInteger(width0) || width0 < 1) {
    return { kind: 'wave-sweep-grid' as const, holds: false as const, denied: 'width' as const, faces, citation: openMathScaleOf().citation }
  }
  if (!Number.isSafeInteger(passesN) || passesN < 1) {
    return { kind: 'wave-sweep-grid' as const, holds: false as const, denied: 'passes' as const, faces, citation: openMathScaleOf().citation }
  }
  const passes: WavePassSummary[] = []
  let from = from0
  let width = width0
  for (let p = 1; p <= passesN; p++) {
    const summary = await passOf(p, from, width, faces, names)
    passes.push(summary)
    from = summary.furthestNext ?? from + width * faces
    width *= 2
  }
  const citation = openMathScaleOf().citation
  return {
    kind: 'wave-sweep-grid' as const,
    formula: 'wave.sweep' as const,
    stride: faces,
    lattice: { faces, coins: qpuFacesOf().coins, rays: qpuFacesOf().rays, familyCount: names.length },
    clayRelevantIndices: Object.fromEntries(['clay', 'cloud', 'lattice', 'perma', 'ceramics'].map((n) => [n, names.indexOf(n)])),
    passes: passes.map((p) => ({
      pass: p.pass,
      width: p.width,
      fromStart: p.fromStart,
      sweeps: p.sweeps,
      holdsTrue: p.holdsTrue,
      holdsFalse: p.holdsFalse,
      sumValue: p.sumValue,
      furthestNext: p.furthestNext,
      wallMs: p.wallMs,
      clayHits: p.clayHits,
      table: p.rows.map((r) => ({
        from: r.from,
        value: r.value,
        holds: r.holds,
        next: r.rawNext,
        nextVerified: r.nextVerified,
        hex: r.hex,
        clayRelevant: r.clayRelevant,
        held: r.heldFormulas.map((h) => ({
          family: h.family,
          formula: h.formula,
          value: h.value,
          holds: h.holds,
          rawNext: h.rawNext === undefined ? 'absent' : h.rawNext,
          body: h.body,
          hex: h.hex,
        })),
      })),
    })),
    nextPassPlan: {
      from: passes.at(-1)?.furthestNext ?? null,
      width: width0 * 2 ** passesN,
      note: 'double width again; continue from furthest raw next; do not re-sweep covered indices' as const,
    },
    citation,
    prize: false as const,
    goal: (await import('./goal.js')).goalOf({ width: width0, passes: passesN }).goal,
    holds: passes.every((p) => p.sweeps === p.width) && citation.holds === false,
  }
}

/** Payload GET /api/qpu/wave — combinatorial grid through the same reading the connector fuses. */
export const publicWaveOf = async (request: Request): Promise<Response> => {
  const url = new URL(request.url)
  const from = Number(url.searchParams.get('from') ?? '434')
  const width = Number(url.searchParams.get('width') ?? String(qpuFacesOf().faces * 2))
  const passes = Number(url.searchParams.get('passes') ?? '1')
  return Response.json(await waveSweepGridOf({ from, width, passes }), {
    headers: { 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' },
  })
}

/**
 * Payload plugin: wave-sweeps collection (afterRead → combinatorial grid) + GET /qpu/wave endpoint.
 * Truth lives here; clients reach it through publicDoorFetchOf / fused connector, not a parallel stack.
 */
export const wavePlugin = (): QpuPlugin => (config) => ({
  ...config,
  collections: [
    ...(config.collections ?? []),
    {
      slug: 'wave-sweeps',
      admin: { useAsTitle: 'from', description: 'Combinatorial wave.sweep grids; afterRead runs the lattice stride.' },
      access: { read: () => true },
      fields: [
        { name: 'from', type: 'number', required: true },
        { name: 'width', type: 'number' },
        { name: 'passes', type: 'number' },
        { name: 'reading', type: 'json', admin: { readOnly: true } },
      ],
      hooks: {
        afterRead: [
          async ({ doc }: { doc?: { from?: unknown; width?: unknown; passes?: unknown; reading?: unknown } | null }) => {
            if (!doc || typeof doc.from !== 'number' || !Number.isSafeInteger(doc.from) || doc.from < 0) return doc
            const width = typeof doc.width === 'number' && Number.isSafeInteger(doc.width) && doc.width > 0 ? doc.width : qpuFacesOf().faces * 2
            const passes = typeof doc.passes === 'number' && Number.isSafeInteger(doc.passes) && doc.passes > 0 ? doc.passes : 1
            const reading = await waveSweepGridOf({ from: doc.from, width, passes })
            return { ...doc, reading }
          },
        ],
      },
    },
  ],
  endpoints: [
    ...(config.endpoints ?? []),
    {
      path: '/qpu/wave',
      method: 'get' as const,
      handler: (req: Request) => publicWaveOf(req),
    },
  ],
})
