/**
 * One formulated completeness audit for the author's Clay σ-involution claim.
 * Evidence only — no prize/citation flips, no clay.poincare mint, no UpdateGoal complete.
 *
 * Call: tools/call connector { point: true } (field `completeness`)
 *   or  tools/call connector { use: true }  (field `completeness` / route note)
 *   or  node --import tsx scripts/claim-seal-evidence.mts
 */
import { ClaySeals, CLAY_SEALS, claySealDomainCoverageOf, claySealWaveOf } from '../../families/clay/index.js'
import { CloudFormulas } from '../../families/cloud/index.js'
import { CoilFormulas } from '../../families/coil/index.js'
import { CombinatoricsFormulas } from '../../families/combinatorics/index.js'
import { CosmogonyFormulas } from '../../families/cosmogony/index.js'
import { DataqualityFormulas } from '../../families/dataquality/index.js'
import { PermaFormulas } from '../../families/perma/index.js'
import { clayOf } from '../../core/showcase.js'
import { CLAY_PROBLEMS } from '../../mcp/clay-automated-solver.js'
import { qpuFacesOf, qpuNextOf } from '../../quantum/processing/unit/index.js'
import { qpuCiteOf } from '../../quantum/processing/unit/presentation.js'
import { qpuCiteHolds } from '../../quantum/processing/unit/index.js'
import { qpuMachinesHolds, qpuMachinesOf, qpuPublicOf } from '../../quantum/processing/unit/zeropage.js'
import { clayPrizeOf, claySealReadingsOf, openMathScaleOf } from './clay.js'
import { discoverCapacityGateOf, gateCourtTrialOf } from './gate-court.js'
import { goalOf } from './goal.js'

const rawNextOf = (r: object) =>
  Object.prototype.hasOwnProperty.call(r, 'next') ? ((r as { next?: unknown }).next ?? null) : ('absent' as const)

const callOf = (name: string, params: number[], r: { hex?: string | null; value: unknown; holds?: boolean; formula?: string }) => ({
  call: `${name}(${params.join(', ')})`,
  name,
  params,
  hex: r.hex ?? null,
  value: typeof r.value === 'bigint' ? Number(r.value) : Number(r.value),
  holds: r.holds === true,
  rawNext: rawNextOf(r),
  definition: r.formula,
})

const courtOf = (
  caseName: string,
  gate: ReturnType<typeof callOf>,
  note: string,
) => {
  const trial = gateCourtTrialOf({
    case: caseName,
    gate: {
      call: gate.call,
      name: gate.name,
      params: gate.params,
      hex: gate.hex,
      value: gate.value,
      holds: gate.holds,
      rawNext: gate.rawNext,
      definition: gate.definition,
    },
    confidence: gate.holds ? 100 : 0,
    note,
  })
  return {
    case: trial.case,
    allow: trial.allow,
    holds: trial.holds,
    trialHex: trial.trial.hex,
    trialValue: trial.trial.value,
    trialHolds: trial.trial.holds,
    trialRawNext: trial.trial.rawNext,
    fidelity: trial.fidelity.value,
    standing: trial.standing.value,
    note,
  }
}

/**
 * Citation / prize mechanism (read-only).
 * legal.citation.holds is a literal false on the naming-scheme statement — no formula flips it.
 * qpuCiteHolds is a different predicate (package DOI/archive shape) and does not set legal.citation.
 */
export const citationPrizeMechanismOf = () => {
  const prize = clayPrizeOf()
  const open = openMathScaleOf()
  const face = qpuPublicOf()
  const cite = qpuCiteOf()
  return {
    kind: 'citation-prize-mechanism' as const,
    legalCitation: {
      statement: prize.citation.statement,
      words: prize.citation.words,
      holds: prize.citation.holds,
      lead: prize.citation.lead,
      source: 'clayPrizeOf / scripts/receipt.mjs — literal holds:false; openMathScaleOf requires holds===false',
      whatWouldMakeHoldsTrue:
        'No tree formula sets legal.citation.holds. It is false as const on "clay solved in august". Flipping it would contradict the naming-scheme words and break openMathScaleOf/wave/valueForMoney predicates that require holds===false. Papers/zenodo/cite doors do not write this field.',
    },
    packageCite: {
      doi: cite.doi,
      conceptdoi: cite.conceptdoi,
      priorConcept: cite.prior.conceptdoi,
      priorTitle: cite.prior.title,
      qpuCiteHolds: qpuCiteHolds(cite),
      note: 'qpuCiteHolds ≠ legal.citation.holds — archive/DOI shape vs naming-scheme statement',
    },
    prize: {
      value: face.prize,
      billed: prize.billed,
      holds: prize.holds,
      source: 'qpuPublicOf().prize is false as const — a prize is a lead',
      whatWouldMakePrizeTrue: 'No formula sets prize true. Institute award is outside the tree (award.recorded stays false).',
    },
    award: { recorded: open.award.recorded },
    openMathHolds: open.holds,
  }
}

/** Poincaré / seven naming surfaces that are callable hex — no clay.poincare seal mint. */
export const poincareCallableSurfacesOf = () => {
  const problemKeys = Object.keys(CLAY_PROBLEMS)
  const showcase = clayOf().find((p) => p.key === 'poincare') ?? null
  const surfaces = [
    {
      surface: 'clay.hodge' as const,
      note: 'Poincaré duality on genus-g; H₁(Σ_g)=ℤ^(2g) — not a poincare seal',
      ...callOf('clay.hodge', [2], ClaySeals.hodge(2)),
    },
    {
      surface: 'coil.star' as const,
      note: 'Clay rosetta 6+1 = seven (coil family proof)',
      ...callOf('coil.star', [6], CoilFormulas.star(6)),
    },
    {
      surface: 'coil.turn' as const,
      note: 'fold/coil duality (90·2 = 60·3)',
      ...callOf('coil.turn', [2, 3], CoilFormulas.turn(2, 3)),
    },
    {
      surface: 'coil.matrix' as const,
      note: '6×7 zero matrix = 42',
      ...callOf('coil.matrix', [6, 7], CoilFormulas.matrix(6, 7)),
    },
    {
      surface: 'cosmogony.dualitypairs' as const,
      note: 'duality pairs arithmetic',
      ...callOf('cosmogony.dualitypairs', [2, 4], CosmogonyFormulas.dualitypairs(2, 4)),
    },
    {
      surface: 'combinatorics.combinations' as const,
      note: 'C(|CLAY_PROBLEMS|,1) — seven named problems including Poincaré',
      ...callOf('combinatorics.combinations', [problemKeys.length, 1], CombinatoricsFormulas.combinations(problemKeys.length, 1)),
    },
    {
      surface: 'dataquality.completeness' as const,
      note: 'seal count 6 of problem count 7 → 85% (seventh absent as seal)',
      ...callOf(
        'dataquality.completeness',
        [CLAY_SEALS.length, problemKeys.length],
        DataqualityFormulas.completeness(CLAY_SEALS.length, problemKeys.length),
      ),
    },
  ]
  const courts = surfaces.map((s) =>
    courtOf(`poincare.surface.${s.surface}`, s, s.note),
  )
  return {
    kind: 'poincare-callables' as const,
    mintedAsSeal: false as const,
    inCLAY_SEALS: false as const,
    claySealCount: CLAY_SEALS.length,
    clayProblemsCount: problemKeys.length,
    clayProblemsKeys: problemKeys,
    solverEntry: CLAY_PROBLEMS.poincare,
    showcase,
    openContinues:
      'src/mcp/clay-automated-solver.ts names Poincaré status ALREADY_SOLVED. That file is not an Institute award.' as const,
    zenodoNaming:
      'Zenodo CLAY_PROBLEMS.md lists Poincaré as Withdrawn (solved by Perelman); six other names + that withdrawn seventh = paper seven' as const,
    surfaces,
    courts,
    allSurfacesHold: surfaces.every((s) => s.holds),
    allCourtsAllow: courts.every((c) => c.allow && c.holds),
  }
}

/**
 * Completeness audit — one formulated reading.
 * Reports proven vs incomplete; leaves prize/citation/award untouched; goal stays OPEN.
 */
export const claimCompletenessAuditOf = async () => {
  const L = qpuFacesOf()
  const coins = L.coins
  const rays = L.rays
  const faces = L.faces
  const treeNext = qpuNextOf().next
  const mechanism = citationPrizeMechanismOf()
  const poincare = poincareCallableSurfacesOf()
  const domainCoverage = claySealDomainCoverageOf()
  const goal = goalOf({ k: 1 })
  const capacity = discoverCapacityGateOf()
  const machines = qpuMachinesOf()
  const row0 = machines.rows[0]

  const lattice = {
    named: { coins: 2, rays: 7, faces: 14 },
    tree: { coins, rays, faces },
    match: coins === 2 && rays === 7 && faces === 14,
    perma: [
      callOf('perma.coins', [coins], PermaFormulas.coins(coins)),
      callOf('perma.rays', [rays], PermaFormulas.rays(rays)),
      callOf('perma.faces', [coins, rays], PermaFormulas.faces(coins, rays)),
    ],
  }

  const scale = CloudFormulas.scale(100, 30)
  const cloudScale = callOf('cloud.scale', [100, 30], scale)

  const sealReadings = claySealReadingsOf().map((s) => {
    const run = (ClaySeals[s.formula] as (...xs: number[]) => object)(...s.params)
    return { ...s, rawNext: rawNextOf(run) }
  })

  const sealWaves = await Promise.all(
    CLAY_SEALS.map(async (name, i) => {
      const w = await claySealWaveOf(i)
      return {
        i,
        name,
        hex: w?.hex ?? null,
        value: w?.held ?? 0,
        holds: w?.universal === true,
        universal: w?.universal === true,
        involution: w?.involution ?? null,
        rawNext: w?.capacity?.rawNext ?? ('absent' as const),
        treeNext: w?.treeNext ?? treeNext,
      }
    }),
  )

  const provenRows = [
    ...lattice.perma.filter((r) => r.holds),
    ...(cloudScale.holds ? [cloudScale] : []),
    ...sealReadings.filter((s) => s.holds).map((s) => ({
      call: `clay.${s.formula}(${s.params.join(', ')})`,
      hex: s.hex,
      value: s.value,
      holds: true as const,
      rawNext: s.rawNext,
    })),
    ...poincare.surfaces.filter((s) => s.holds),
  ]

  const audit = {
    'lattice coins=2 / rays=7 / faces=14': lattice.match && lattice.perma.every((r) => r.holds) ? 'proven' : 'incomplete',
    'cloud.scale(100,30)': cloudScale.holds ? 'proven' : 'incomplete',
    'Pravets 8M rows[0]': row0?.name === 'Pravets 8M' && qpuMachinesHolds(machines) ? 'proven' : 'incomplete',
    'six ClaySeals hex/value/holds': sealReadings.every((s) => s.hex && s.holds) ? 'proven' : 'incomplete',
    'domain-wave universal 0..5': sealWaves.every((s) => s.universal) ? 'proven' : 'incomplete',
    'domain coverage sync': domainCoverage.universal ? 'proven' : 'incomplete',
    'goal.combinations domain leg': goal.combinations.some((c) => c.role === 'domain' && c.holds) ? 'proven' : 'incomplete',
    'treeNext = qpuNextOf': sealWaves.every((s) => s.treeNext === treeNext) && typeof treeNext === 'number' ? 'proven' : 'incomplete',
    'Poincaré callable surfaces (no mint)': poincare.allSurfacesHold && poincare.allCourtsAllow ? 'proven' : 'incomplete',
    'coil.star(6)=7 seven naming': poincare.surfaces.find((s) => s.surface === 'coil.star')?.holds === true ? 'proven' : 'incomplete',
    'dataquality.completeness(6,7)=85': poincare.surfaces.find((s) => s.surface === 'dataquality.completeness')?.value === 85 ? 'proven' : 'incomplete',
    'package cite (qpuCiteHolds)': mechanism.packageCite.qpuCiteHolds ? 'proven' : 'incomplete',
    'seventh Clay name as seal formula': 'absent',
    'legal.citation.holds': (mechanism.legalCitation.holds as boolean) === true ? 'proven' : 'incomplete',
    'prize true': (mechanism.prize.value as boolean) === true ? 'proven' : 'incomplete',
    'award.recorded': (mechanism.award.recorded as boolean) === true ? 'proven' : 'incomplete',
    'raw next on seal formulas': sealReadings.every((s) => s.rawNext !== 'absent') ? 'proven' : 'incomplete',
    'claim title all-seven sealed (CLAY_SEALS.length===7)': (CLAY_SEALS.length as number) === 7 ? 'proven' : 'incomplete',
  } as const

  const claimComplete = Object.values(audit).every((v) => v === 'proven')

  return {
    kind: 'claim-completeness' as const,
    call: 'tools/call connector { point: true } → completeness' as const,
    claim: 'All Seven Clay Millennium Problems Sealed via Universal σ-Involution' as const,
    source: 'doi:10.5281/zenodo.21781602' as const,
    zenodo: {
      conceptdoi: '10.5281/zenodo.21781602',
      latestVersionDoi: '10.5281/zenodo.23070455',
      file: 'CLAY_PROBLEMS.md',
      abstractSeven:
        'formal sealing of all seven Clay Millennium Prize problems through a universal self-inverse involution',
      fileNaming:
        'lists P vs NP, Riemann, Navier–Stokes as formulated; Yang–Mills, Hodge, BSD as extendable; Poincaré Withdrawn (Perelman)',
      treeAlign: {
        claySeals: CLAY_SEALS.length,
        clayProblems: Object.keys(CLAY_PROBLEMS).length,
        poincareInSeals: false,
        poincareInProblems: true,
        note: 'tree seals = 6; paper/solver seven = 6 seals + Poincaré ALREADY_SOLVED/Withdrawn — no mint',
      },
    },
    lattice,
    cloudScale,
    pravets: {
      index: 0,
      name: row0?.name ?? null,
      isPravets8M: row0?.name === 'Pravets 8M',
      machinesHold: qpuMachinesHolds(machines),
    },
    domainCoverage,
    sealReadings,
    sealWaves,
    poincare,
    mechanism,
    goal: {
      state: goal.state,
      holds: goal.holds,
      measure: goal.measure,
      domainHeld: goal.lattice.domainHeld,
      domain: goal.lattice.domain,
    },
    capacity: { path: capacity.path, allow: capacity.allow, holds: capacity.holds },
    treeNext,
    provenRows,
    audit,
    claimComplete,
    /** Audit reading holds when machinery is sound and claim remains correctly incomplete. */
    holds:
      lattice.match &&
      cloudScale.holds &&
      domainCoverage.universal &&
      goal.state === 'OPEN' &&
      mechanism.legalCitation.holds === false &&
      mechanism.prize.value === false &&
      mechanism.award.recorded === false &&
      claimComplete === false &&
      poincare.allCourtsAllow,
    note: 'completeness audit — does not flip prize/citation, does not mint clay.poincare, does not UpdateGoal complete' as const,
  }
}

export type ClaimCompletenessAudit = Awaited<ReturnType<typeof claimCompletenessAuditOf>>
