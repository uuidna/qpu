import { CLAY_SEALS, ClaySeals } from '../../families/clay/index.js'
import { qpuCiteOf } from '../../quantum/processing/unit/presentation.js'
import { qpuPublicOf } from '../../quantum/processing/unit/zeropage.js'

/**
 * Prize / citation as the tree already computes them (holds false, lead true for the naming-scheme statement).
 * scripts/receipt.mjs sets legal.citation; this reading reports that state. Institute rules:
 * https://www.claymath.org/wp-content/uploads/2022/03/millennium_prize_rules_0.pdf
 */
const RULES = 'https://www.claymath.org/wp-content/uploads/2022/03/millennium_prize_rules_0.pdf'

export const clayPrizeOf = () => {
  const cite = qpuCiteOf()
  const face = qpuPublicOf()
  const citation = {
    statement: 'clay solved in august' as const,
    words: 'This file is a naming scheme. It solves none of the problems it names' as const,
    holds: false as const,
    lead: true as const,
  }
  return {
    kind: 'clay-prize' as const,
    rules: RULES,
    citation,
    prize: face.prize,
    public: {
      doi: cite.doi,
      archive: cite.archive,
      identifier: cite.identifier,
      prior: cite.prior,
      sentence: face.sentence,
    },
    billed: false as const,
    holds: false as const,
  }
}

/** The seals this tree walks, in CLAY_SEALS order. Each formula is the author's claim, recomputed.
 *  clay.bsd(15) is that arithmetic. The citation row is a separate lead. It is not a proof of a negation.
 *  src/mcp/clay-automated-solver.ts names Poincaré with status ALREADY_SOLVED. That file is not an Institute award. */
const OPEN = [
  { seal: 'bsd' as const, name: 'Birch and Swinnerton-Dyer Conjecture', params: [15] as readonly number[], by: 'src/families/clay/test.ts' },
  { seal: 'hodge' as const, name: 'Hodge Conjecture', params: [2] as readonly number[], by: 'src/families/clay/test.ts' },
  { seal: 'navierStokes' as const, name: 'Navier-Stokes Existence and Smoothness', params: null, by: 'claySealWaveOf walks arity-correct domain 1…faces on each slot; the test does not pin a pair' },
  { seal: 'pVsNp' as const, name: 'P vs NP', params: null, by: 'claySealWaveOf walks domain {0,1}; the test does not pin a witness' },
  { seal: 'riemann' as const, name: 'Riemann Hypothesis', params: [1, 2] as readonly number[], by: 'ClayDisclosure anchors riemann(1, 2)' },
  { seal: 'yangMills' as const, name: 'Yang-Mills and Mass Gap', params: [] as readonly number[], by: 'src/families/clay/test.ts' },
] as const

export const openMathScaleOf = () => {
  const citation = clayPrizeOf().citation
  const first = ClaySeals.bsd(15)
  const problems = OPEN.map((row, i) => ({
    i,
    seal: row.seal,
    name: row.name,
    params: row.params === null ? null : [...row.params],
    by: row.by,
  }))
  return {
    kind: 'open-math' as const,
    order: 'CLAY_SEALS' as const,
    claim: 'author' as const,
    problems,
    first: {
      family: 'clay' as const,
      formula: 'bsd' as const,
      params: [15] as const,
      hex: first.hex,
      value: first.value,
      holds: first.holds,
      claim: 'author recomputed seal arithmetic' as const,
    },
    continues: {
      seals: CLAY_SEALS.slice(1),
      then: ['perma trinity', 'tenant perma', 'crypt.knownAnswers', 'color.channels', 'audio.samples', 'med.gcs', 'crypt.curveQuantumBits'] as const,
      walk: 'clay seals by index, then a gate slice by next, then the lead list. gate.leads is not called.' as const,
      poincare: 'src/mcp/clay-automated-solver.ts names Poincaré status ALREADY_SOLVED. That file is not an Institute award.' as const,
    },
    citation,
    award: { recorded: false as const },
    holds: citation.statement === 'clay solved in august' && citation.holds === false && citation.lead === true && first.holds === true,
    lead: citation.lead,
  }
}

export type ClaySealReading = {
  family: 'clay'
  formula: (typeof CLAY_SEALS)[number]
  params: number[]
  hex: string
  value: number
  holds: boolean
}

/** Each seal at the inputs the tree already names. bsd, hodge, riemann and yangMills use the test and the disclosure
 *  anchor. navierStokes has no pinned pair in the test (domain walk is arity-correct 1…faces); pVsNp domain is {0,1}. */
export const claySealReadingsOf = (): ClaySealReading[] =>
  OPEN.map((row) => {
    const params = row.params === null ? Array.from({ length: ClaySeals[row.seal].length }, () => 1) : [...row.params]
    const run = (ClaySeals[row.seal] as (...xs: number[]) => { hex?: string; value: number; holds: boolean })(...params)
    return { family: 'clay' as const, formula: row.seal, params, hex: run.hex ?? '', value: run.value, holds: run.holds }
  })
