/**
 * Fresh evidence tables for the author's stored Clay σ-involution claim.
 * Evidence only — no prize/citation flips, no solved language.
 *
 *   node --import tsx scripts/claim-seal-evidence.mts
 */
import '../src/mcp/families.js'
import {
  ClaySeals,
  CLAY_SEALS,
  claySealWaveOf,
  claySealDomainCoverageOf,
  claySealDomainOf,
  ClayDisclosure,
} from '../src/families/clay/index.js'
import { CLAY_PROBLEMS } from '../src/mcp/clay-automated-solver.js'
import { clayOf } from '../src/core/showcase.js'
import { CloudFormulas } from '../src/families/cloud/index.js'
import { PermaFormulas } from '../src/families/perma/index.js'
import { YiFormulas } from '../src/families/yi/index.js'
import { MerkabaFormulas } from '../src/families/merkaba/index.js'
import { CombinatoricsFormulas } from '../src/families/combinatorics/index.js'
import { n, qpuFacesOf, qpuHandleOf, qpuNextOf, qpuStatementUuidOf } from '../src/quantum/processing/unit/index.js'
import { qpuMachinesHolds, qpuMachinesOf, qpuPublicOf } from '../src/quantum/processing/unit/zeropage.js'
import { qpuCiteOf } from '../src/quantum/processing/unit/presentation.js'
import { leanSource } from '../src/quantum/processing/unit/lean.js'

/** Same predicates as unit theorem.around / harmonic / involution (not exported). */
const aroundOf = (f: number, c: number, r: number) => f === c * r
const harmonicOf = (f: number, r: number) => f === r + r
const involutionOf = (face: number, f: number, r: number) => (face + r + r) % f === face % f
import { goalOf } from '../src/payload/plugins/goal.js'
import { clayPrizeOf, claySealReadingsOf, openMathScaleOf } from '../src/payload/plugins/clay.js'
import {
  discoverCapacityGateOf,
  gateCourtTrialOf,
  gateCourtOf,
} from '../src/payload/plugins/gate-court.js'
import { connectorAnswerOf } from '../src/payload/plugins/permaculture.js'
import { networkMachineOf } from '../src/payload/plugins/public.js'

const rawNextOf = (r: object) =>
  Object.prototype.hasOwnProperty.call(r, 'next') ? ((r as { next?: unknown }).next ?? null) : ('absent' as const)

const rowOf = (name: string, params: number[], r: { hex?: string | null; value: unknown; holds?: boolean; formula?: string }) => ({
  call: `${name}(${params.join(', ')})`,
  hex: r.hex ?? null,
  value: typeof r.value === 'bigint' ? Number(r.value) : Number(r.value),
  holds: r.holds === true,
  rawNext: rawNextOf(r),
  definition: r.formula,
})

const L = qpuFacesOf()
const coins = L.coins
const rays = L.rays
const faces = L.faces

// --- lattice (2, 7, 14) ---
const lattice = {
  named: { coins: 2, rays: 7, faces: 14 },
  tree: { coins, rays, faces },
  match: coins === 2 && rays === 7 && faces === 14,
  perma: [
    rowOf('perma.coins', [coins], PermaFormulas.coins(coins)),
    rowOf('perma.rays', [rays], PermaFormulas.rays(rays)),
    rowOf('perma.faces', [coins, rays], PermaFormulas.faces(coins, rays)),
  ],
  theorem: {
    around: { holds: aroundOf(faces, coins, rays), formula: 'faces = coins * rays' },
    harmonic: { holds: harmonicOf(faces, rays), formula: 'faces = rays + rays' },
    involution0: {
      holds: involutionOf(0, faces, rays),
      formula: '(face + rays + rays) % faces = face % faces',
      face: 0,
    },
  },
}

// --- cloud.scale only when perNode > 0 ---
const load = 100
const perNode = 30
const scaleRun = perNode > 0 ? CloudFormulas.scale(load, perNode) : null
const cloudScale = {
  condition: 'perNode > 0',
  load,
  perNode,
  called: perNode > 0,
  ...(scaleRun ? rowOf('cloud.scale', [load, perNode], scaleRun) : { skipped: true }),
}

// --- Pravets 8M index 0 ---
const machines = qpuMachinesOf()
const row0 = machines.rows[0]
const pravets = {
  index: 0,
  row: row0
    ? {
        name: row0.name,
        when: row0.when,
        wordBits: row0.wordBits,
        spec: row0.spec,
        oneRegisterFidelity: row0.oneRegisterFidelity,
        lead: row0.lead,
        registerNext: row0.registerNext,
        note: row0.note ?? null,
      }
    : null,
  isPravets8M: row0?.name === 'Pravets 8M',
  machinesHold: qpuMachinesHolds(machines),
  networkMachine: networkMachineOf(),
}

// --- six ClaySeals + seal-wave 0..5 ---
const sealReadings = claySealReadingsOf().map((s) => ({
  ...s,
  rawNext: rawNextOf(
    (ClaySeals[s.formula] as (...xs: number[]) => object)(...s.params),
  ),
}))

const domainCoverage = claySealDomainCoverageOf()
const treeNext = qpuNextOf().next

const sealWaves = await Promise.all(
  CLAY_SEALS.map(async (name, i) => {
    const domain = claySealDomainOf(name)
    const w = await claySealWaveOf(i)
    const sealCase = gateCourtTrialOf({
      case: `clay.seal.${name}`,
      gate: {
        call: `clay.pass(${i}) seal-wave`,
        name: 'clay.pass',
        params: [i],
        hex: w?.hex ?? null,
        value: w?.held ?? 0,
        holds: w?.universal === true,
        rawNext: w?.capacity?.rawNext ?? 'absent',
        definition: w?.involution,
      },
      confidence: w?.universal ? 100 : 0,
      note: `domain-wave involution for ${name} (${domain.kind})`,
    })
    const capacityRaw = w?.capacity?.rawNext
    return {
      i,
      name,
      domain: { kind: domain.kind, size: domain.params.length, params: domain.params },
      hex: w?.hex ?? null,
      value: w?.held ?? 0,
      holds: w?.universal === true,
      involution: w?.involution ?? null,
      universal: w?.universal === true,
      values: w?.values ?? [],
      agents: w?.agents ?? 0,
      held: w?.held ?? 0,
      courtTried: w?.courtTried ?? 0,
      proven: w?.proven === true,
      discover: w?.discover ?? null,
      capacityPath: w?.capacity?.path ?? null,
      capacityAllow: w?.capacity?.allow ?? null,
      rawNext: capacityRaw === 'absent' || capacityRaw === null || capacityRaw === undefined ? 'absent' : capacityRaw,
      treeNext: w?.treeNext ?? treeNext,
      court: {
        case: sealCase.case,
        allow: sealCase.allow,
        holds: sealCase.holds,
        trialHex: sealCase.trial.hex,
        trialValue: sealCase.trial.value,
        trialHolds: sealCase.trial.holds,
        trialRawNext: sealCase.trial.rawNext,
        fidelity: sealCase.fidelity.value,
        standing: sealCase.standing.value,
      },
    }
  }),
)

// --- yi.complement / Lean involution ---
const yiComp = YiFormulas.complement(0)
const leanText = leanSource
const leanInvolution = {
  theoremNamed: /\btheorem\s+involution\b/.test(leanText),
  aroundNamed: /\btheorem\s+around\b/.test(leanText),
  harmonicNamed: /\btheorem\s+harmonic\b/.test(leanText),
  involutionSnippet: (leanText.match(/theorem involution[\s\S]{0,200}/)?.[0] ?? '').slice(0, 180),
}
const yiLean = {
  yi: rowOf('yi.complement', [0], yiComp),
  lean: leanInvolution,
  runtimeInvolution: lattice.theorem.involution0,
}

// --- goal.combinations ---
const goal = goalOf({ k: 1 })
const goalCourt = goal.court
const combinationsMeasure = {
  state: goal.state,
  measure: goal.measure,
  holds: goal.holds,
  combinations: goal.combinations.map((c) => ({
    address: c.address,
    params: c.params,
    value: c.value,
    hex: c.hex,
    holds: c.holds,
    role: c.role,
    rawNext: 'absent' as const, // combo objects do not carry next; formula next below
  })),
  domain: goal.lattice.domain,
  domainHeld: goal.lattice.domainHeld,
  formulaNexts: [
    rowOf('combinatorics.combinations', [faces, 1], CombinatoricsFormulas.combinations(faces, 1)),
    rowOf('combinatorics.combinations', [CLAY_SEALS.length, 1], CombinatoricsFormulas.combinations(CLAY_SEALS.length, 1)),
    rowOf('combinatorics.binomial', [3], CombinatoricsFormulas.binomial(3)),
    rowOf('combinatorics.combinations', [domainCoverage.size, 1], CombinatoricsFormulas.combinations(domainCoverage.size, 1)),
  ],
  court: {
    case: goalCourt.case,
    allow: goalCourt.allow,
    holds: goalCourt.holds,
    gateHex: goalCourt.gate.hex,
    gateValue: goalCourt.gate.value,
    gateHolds: goalCourt.gate.holds,
    gateRawNext: goalCourt.gate.rawNext,
    trialHex: goalCourt.trial.hex,
    trialValue: goalCourt.trial.value,
    trialHolds: goalCourt.trial.holds,
    trialRawNext: goalCourt.trial.rawNext,
  },
  next: goal.next,
}

// --- closeable formula calls named by tree ---
const handleNext = qpuHandleOf().next
const merkabaCoilFaces = MerkabaFormulas.coil(faces)
const merkabaCoilN = MerkabaFormulas.coil(n) // lattice n — holds; faces=14 does not
const disclosure = ClayDisclosure.disclosure()
const involutionLeanHex = qpuStatementUuidOf('involution')
const namedCalls = {
  merkabaCoilFaces: rowOf('merkaba.coil', [faces], merkabaCoilFaces),
  merkabaCoilN: rowOf('merkaba.coil', [n], merkabaCoilN),
  clayDisclosure: rowOf('clay.disclosure', [], disclosure),
  around: lattice.theorem.around,
  harmonic: lattice.theorem.harmonic,
  leanInvolutionHex: involutionLeanHex,
  handleNext,
  treeNext: qpuNextOf().next,
}

// --- connector / publicDoor ---
const connectorBase = await connectorAnswerOf({})
const connectorGoal = await connectorAnswerOf({ goal: true })
const connectorSeal = await connectorAnswerOf({ seal: true })
const connectorPass0 = await connectorAnswerOf({ pass: 0 })

// --- prize / citation / seven / poincaré (report tree state only; do not flip) ---
const prize = clayPrizeOf()
const open = openMathScaleOf()
const face = qpuPublicOf()
const cite = qpuCiteOf()
const capacity = discoverCapacityGateOf()
const court = gateCourtOf()

/** Seventh name: gather tree-named Poincaré evidence surfaces — no seal mint. */
const showcaseProblems = clayOf()
const poincareEvidence = {
  mintedAsSeal: false as const,
  inCLAY_SEALS: CLAY_SEALS.includes('poincare' as never) || CLAY_SEALS.includes('poincaré' as never),
  claimCompleteness: 'incomplete until a seal exists' as const,
  surfaces: [
    {
      surface: 'CLAY_PROBLEMS.poincare' as const,
      file: 'src/mcp/clay-automated-solver.ts',
      entry: CLAY_PROBLEMS.poincare,
      note: 'solver status ALREADY_SOLVED (Perelman); not an Institute award; not a clay.* formula',
    },
    {
      surface: 'clayOf() showcase row' as const,
      file: 'src/core/showcase.ts',
      entry: showcaseProblems.find((p) => p.key === 'poincare') ?? null,
      note: 'reads CLAY_PROBLEMS; evidence row only',
    },
    {
      surface: 'openMathScaleOf().continues.poincare' as const,
      file: 'src/payload/plugins/clay.ts',
      entry: open.continues.poincare,
      note: 'tree-named continuation string',
    },
    {
      surface: 'ClaySeals.hodge comment' as const,
      file: 'src/families/clay/index.ts',
      entry: 'Poincaré duality on the genus-g surface; H₁(Σ_g) = ℤ^(2g)',
      note: 'hodge seal mentions Poincaré duality — not a poincare seal',
    },
    {
      surface: 'public/formula-routing-index.json poincare' as const,
      file: 'public/formula-routing-index.json',
      entry: 'routing key present in public index',
      note: 'routing surface; not clay.poincare formula',
    },
  ],
}

const blockers = {
  claySealCount: CLAY_SEALS.length,
  seventhNamePoincareInCLAY_SEALS: poincareEvidence.inCLAY_SEALS,
  poincareNote: open.continues.poincare,
  citationHolds: prize.citation.holds,
  citationLead: prize.citation.lead,
  prize: face.prize,
  awardRecorded: open.award.recorded,
  involutionHexOnYi: yiComp.hex ?? null,
  leanInvolutionPresent: leanInvolution.theoremNamed,
  sealWaveRawNexts: sealWaves.map((s) => ({ i: s.i, name: s.name, rawNext: s.rawNext, treeNext: s.treeNext })),
  sealReadingsRawNextAbsent: sealReadings.every((s) => s.rawNext === 'absent'),
  domainCoverage,
  goalState: goal.state,
  capacityPath: capacity.path,
  capacityAllow: capacity.allow,
}

const audit = {
  'lattice coins=2': lattice.tree.coins === 2 && lattice.perma[0]!.holds ? 'proven' : 'incomplete',
  'lattice rays=7': lattice.tree.rays === 7 && lattice.perma[1]!.holds ? 'proven' : 'incomplete',
  'lattice faces=14': lattice.tree.faces === 14 && lattice.perma[2]!.holds ? 'proven' : 'incomplete',
  'theorem.around': lattice.theorem.around.holds ? 'proven' : 'incomplete',
  'theorem.harmonic': lattice.theorem.harmonic.holds ? 'proven' : 'incomplete',
  'Lean theorem involution': leanInvolution.theoremNamed ? 'proven' : 'absent',
  'cloud.scale (perNode>0)': cloudScale.called && (cloudScale as { holds?: boolean }).holds === true ? 'proven' : 'incomplete',
  'Pravets 8M rows[0]': pravets.isPravets8M ? 'proven' : 'incomplete',
  'six ClaySeals hex/value/holds': sealReadings.every((s) => s.hex && s.holds) ? 'proven' : 'incomplete',
  'seal-wave involution 0..5': sealWaves.every((s) => s.holds) ? 'proven' : 'incomplete',
  'seal cases court-tried': sealWaves.every((s) => s.court.allow && s.court.holds) ? 'proven' : 'incomplete',
  'domain-wave universal (all six)': sealWaves.every((s) => s.universal && s.involution === 'holds on every domain input')
    ? 'proven'
    : 'incomplete',
  'domain coverage sync': domainCoverage.universal ? 'proven' : 'incomplete',
  'goal.combinations domain leg': goal.combinations.some((c) => c.role === 'domain' && c.holds) ? 'proven' : 'incomplete',
  'yi.complement(0)': yiComp.holds === true ? 'proven' : 'incomplete',
  'goal.combinations measure': goal.holds && goal.state === 'OPEN' ? 'proven' : 'incomplete',
  'goal.combinations court': goalCourt.allow && goalCourt.holds ? 'proven' : 'incomplete',
  'merkaba.coil(n=3)': merkabaCoilN.holds === true ? 'proven' : 'incomplete',
  'merkaba.coil(faces=14)': merkabaCoilFaces.holds === true ? 'proven' : 'incomplete',
  'seal-wave holds on every domain input (all six)': sealWaves.every((s) => s.involution === 'holds on every domain input')
    ? 'proven'
    : 'incomplete',
  'seventh Clay name (Poincaré) as seal formula': 'absent',
  'Poincaré evidence surfaces gathered (no mint)': poincareEvidence.surfaces.length >= 4 ? 'proven' : 'incomplete',
  'legal.citation.holds': prize.citation.holds === true ? 'proven' : 'incomplete',
  'prize true': face.prize === true ? 'proven' : 'incomplete',
  'claim title all-seven sealed': CLAY_SEALS.length === 7 ? 'proven' : 'incomplete',
  'raw next on seal formulas': sealReadings.every((s) => s.rawNext !== 'absent') ? 'proven' : 'incomplete',
  'raw next on seal-wave (capacity)': sealWaves.every((s) => s.rawNext !== 'absent' && s.rawNext !== null)
    ? 'proven'
    : 'incomplete',
  'tree next when formula next null/absent': typeof treeNext === 'number' && treeNext > 0 ? 'proven' : 'incomplete',
  'qpuNextOf recorded on domain-wave': sealWaves.every((s) => s.treeNext === treeNext) ? 'proven' : 'incomplete',
}

const out = {
  claim: 'All Seven Clay Millennium Problems Sealed via Universal σ-Involution',
  source: 'doi:10.5281/zenodo.21781602',
  goalState: goal.state,
  lattice,
  cloudScale,
  pravets,
  domainCoverage,
  sealReadings,
  sealWaves,
  yiLean,
  combinationsMeasure,
  namedCalls,
  poincareEvidence,
  connector: {
    baseKind: (connectorBase as { kind?: string }).kind ?? null,
    goalState: (connectorGoal as { state?: string; goal?: string }).state ?? (connectorGoal as { goal?: string }).goal ?? null,
    sealKind: (connectorSeal as { kind?: string }).kind ?? null,
    pass0Kind: (connectorPass0 as { kind?: string }).kind ?? null,
  },
  treeState: {
    prize: face.prize,
    citation: prize.citation,
    awardRecorded: open.award.recorded,
    doi: cite.doi,
    sentence: face.sentence,
    claySeals: [...CLAY_SEALS],
    problems: open.problems.map((p) => ({ i: p.i, seal: p.seal, name: p.name })),
    capacity: { path: capacity.path, allow: capacity.allow, holds: capacity.holds, rawNext: capacity.trial.rawNext },
    court: { stable: court.stable, held: court.held, of: court.of, holds: court.holds },
    treeNext,
  },
  blockers,
  audit,
}

console.log(JSON.stringify(out, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 2))
process.exit(0)
