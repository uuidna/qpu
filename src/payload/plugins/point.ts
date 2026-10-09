import { ClaySeals, CLAY_SEALS, ClayDisclosure } from '../../families/clay/index.js'
import { CloudFormulas } from '../../families/cloud/index.js'
import { LawFormulas } from '../../families/law/index.js'
import { PermaFormulas, permaTrinityOf } from '../../families/perma/index.js'
import { YiFormulas } from '../../families/yi/index.js'
import { qpuFacesOf, qpuMcpToolsListOf } from '../../quantum/processing/unit/index.js'
import { qpuPublicOf } from '../../quantum/processing/unit/zeropage.js'
import { usageBillOf } from './billing.js'
import { claimCompletenessAuditOf } from './claim-completeness.js'
import { clayPrizeOf, claySealReadingsOf, openMathScaleOf } from './clay.js'
import type { QpuPlugin } from './surface.js'
import { CoilFormulas } from '../../families/coil/index.js'
import { CombinatoricsFormulas } from '../../families/combinatorics/index.js'
import { CLAY_PROBLEMS } from '../../mcp/clay-automated-solver.js'

const rawNextOf = (r: object) =>
  Object.prototype.hasOwnProperty.call(r, 'next') ? ((r as { next?: unknown }).next ?? null) : ('absent' as const)

const callOf = (name: string, params: number[], r: { hex?: string; value: number; holds: boolean; formula?: string }) => ({
  call: `${name}(${params.join(', ')})`,
  name,
  params,
  hex: r.hex ?? null,
  value: r.value,
  holds: r.holds === true,
  rawNext: rawNextOf(r),
  definition: r.formula,
})

/**
 * THE POINT — affirmative MCP surface. What to call through the connector so named-scale claims HOLD.
 * Formulas decide; this reading attracts those calls.
 * prize / citation / connect bill are reported as the tree already computes them.
 */
export const pointOf = async () => {
  const L = qpuFacesOf()
  const coins = L.coins
  const rays = L.rays
  const faces = L.faces
  const seals = claySealReadingsOf().map((s) => {
    const run = (ClaySeals[s.formula] as (...xs: number[]) => { hex?: string; value: number; holds: boolean; formula?: string })(...s.params)
    return callOf(`clay.${s.formula}`, s.params, run)
  })

  // Seal involution over combinatorial domains — path from discover.capacity gate (court-tried).
  const { claySealWaveOf } = await import('../../families/clay/index.js')
  const { connectBillGateOf, discoverCapacityGateOf, gateCourtOf } = await import('./gate-court.js')
  const capacity = discoverCapacityGateOf()
  const billTrial = connectBillGateOf()
  const sealWaves = await Promise.all(CLAY_SEALS.map(async (name, i) => {
    const r = await claySealWaveOf(i)
    return {
      i,
      seal: name,
      call: `clay.pass(${i}) seal-wave`,
      agents: r?.agents ?? 0,
      held: r?.held ?? 0,
      involution: r?.involution ?? 'none',
      involutive: r?.involutive === true,
      values: r?.values ?? [],
      hex: r?.hex ?? null,
      rawNext: r?.capacity?.rawNext ?? ('absent' as const),
      capacity: r?.capacity ?? null,
      note: `path=${capacity.path}; court.standard allow=${capacity.allow}` as const,
    }
  }))

  const trinity = permaTrinityOf()
  const disclosure = ClayDisclosure.disclosure()
  const scale = CloudFormulas.scale(100, 30)
  const tools = qpuMcpToolsListOf()
  const listBytes = JSON.stringify({ resultType: 'complete' as const, tools }).length
  const prize = clayPrizeOf()
  const open = openMathScaleOf()
  const face = qpuPublicOf()
  const qpuPrefixed = tools.filter((t) => t.name.startsWith('qpu_')).length
  const connectBill = {
    doors: tools.length,
    bytes: listBytes,
    under16384: listBytes < 16384,
    qpuPrefixed,
    holds: billTrial.allow,
    trial: billTrial.trial,
    fidelity: billTrial.fidelity,
  }
  const court = gateCourtOf()

  const problemCount = Object.keys(CLAY_PROBLEMS).length
  const attracts = [
    ...seals,
    callOf('clay.disclosure', [], disclosure),
    callOf('perma.coins', [coins], PermaFormulas.coins(coins)),
    callOf('perma.rays', [rays], PermaFormulas.rays(rays)),
    callOf('perma.faces', [coins, rays], PermaFormulas.faces(coins, rays)),
    callOf('cloud.scale', [100, 30], scale),
    callOf('yi.complement', [0], YiFormulas.complement(0)),
    callOf('law.lawful', [0], LawFormulas.lawful(0)),
    callOf('law.reviewed', [0], LawFormulas.reviewed(0)),
    callOf('court.standard', [capacity.confidence, capacity.required], {
      hex: capacity.trial.hex ?? undefined,
      value: capacity.trial.value,
      holds: capacity.trial.holds,
      formula: capacity.trial.definition,
    }),
    // Seven-naming / Poincaré duality callables — no clay.poincare mint
    callOf('coil.star', [6], CoilFormulas.star(6)),
    callOf('coil.turn', [2, 3], CoilFormulas.turn(2, 3)),
    callOf('clay.hodge', [2], ClaySeals.hodge(2)),
    callOf('combinatorics.combinations', [problemCount, 1], CombinatoricsFormulas.combinations(problemCount, 1)),
  ]

  const held = attracts.filter((a) => a.holds)
  const completeness = await claimCompletenessAuditOf()
  return {
    kind: 'point' as const,
    call: 'tools/call connector { point: true }' as const,
    endpoint: '/api/qpu/point' as const,
    thesis: 'follow formulas that hold; every gate case is tried in court; completeness is one audit field' as const,
    lattice: { coins, rays, faces },
    attracts,
    held: held.length,
    of: attracts.length,
    sealWaves,
    court,
    completeness,
    trinityHolds: trinity.holds === true,
    public: {
      prize: face.prize,
      citationHolds: prize.citation.holds,
      awardRecorded: open.award.recorded,
      connectBill,
    },
    bill: usageBillOf(),
    /** Tree-marked state readable via connector/hex — prize, citation, bill, seals, court. */
    tree: {
      prize: face.prize,
      citation: { holds: prize.citation.holds, lead: prize.citation.lead },
      awardRecorded: open.award.recorded,
      connectBill,
      lawReviewed: callOf('law.reviewed', [0], LawFormulas.reviewed(0)),
      claySeals: CLAY_SEALS.length,
      sealPath: 'connector { seal: true } | { pass: i } · claySealWaveOf' as const,
      discoverCapacity: { path: capacity.path, allow: capacity.allow, trial: capacity.trial },
      court: { via: 'connector { court: true }' as const, stable: court.stable, held: court.held, of: court.of },
      claimComplete: completeness.claimComplete,
      goalState: completeness.goal.state,
    },
    holds: held.length > 0 && court.stable && completeness.holds,
    goal: completeness.goal.state,
  }
}

export const publicPointOf = async (): Promise<Response> =>
  Response.json(await pointOf(), {
    headers: { 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' },
  })

export const pointPlugin = (): QpuPlugin => (config) => ({
  ...config,
  endpoints: [
    ...(config.endpoints ?? []),
    { path: '/qpu/point', method: 'get' as const, handler: async () => publicPointOf() },
  ],
})
