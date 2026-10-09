/**
 * Author-named surface reads for doi:10.5281/zenodo.21781602.
 * Evidence only — no prize/citation flips, no seal mint.
 */
import '../src/mcp/families.js'
import { ClaySeals, CLAY_SEALS, claySealDomainCoverageOf } from '../src/families/clay/index.js'
import { YiFormulas } from '../src/families/yi/index.js'
import { ColortheoryFormulas } from '../src/families/colortheory/index.js'
import { ChecksumFormulas } from '../src/families/checksum/index.js'
import { clayPrizeOf, openMathScaleOf } from '../src/payload/plugins/clay.js'
import {
  qpuCiteOf,
  qpuCiteHolds,
  qpuContentUuidOf,
  qpuStatementUuidOf,
  qpuNextOf,
} from '../src/quantum/processing/unit/index.js'
import { qpuPublicOf } from '../src/quantum/processing/unit/zeropage.js'
import { citationPrizeMechanismOf } from '../src/payload/plugins/claim-completeness.js'
import { papersOf } from '../src/mcp/papers.js'
import { goalOf } from '../src/payload/plugins/goal.js'

const DOI = '10.5281/zenodo.21781602'
const row = (name: string, params: number[], r: { hex?: string | null; value: unknown; holds?: boolean; formula?: string; next?: unknown }) => ({
  call: `${name}(${params.join(',')})`,
  hex: r.hex ?? null,
  value: typeof r.value === 'bigint' ? Number(r.value) : typeof r.value === 'number' ? r.value : String(r.value),
  holds: r.holds === true,
  next: Object.prototype.hasOwnProperty.call(r, 'next') ? (r.next ?? null) : ('absent' as const),
  formula: r.formula ?? null,
})

const authorClay = [
  row('clay.riemann', [1, 2], ClaySeals.riemann(1, 2)),
  row('clay.bsd', [9], ClaySeals.bsd(9)),
  row('clay.hodge', [2], ClaySeals.hodge(2)),
  row('clay.navierStokes', [3, 3], ClaySeals.navierStokes(3, 3)),
  row('clay.yangMills', [], ClaySeals.yangMills()),
  row('clay.pVsNp', [0], ClaySeals.pVsNp(0)),
]
const involutionBeyond = [
  row('yi.inverse', [0], YiFormulas.inverse(0)),
  row('colortheory.complement', [120], ColortheoryFormulas.complement(120)),
  row('checksum.onescomplement', [300, 256], ChecksumFormulas.onescomplement(300, 256)),
]
const cite = qpuCiteOf()
const prize = clayPrizeOf()
const face = qpuPublicOf()
const mechanism = citationPrizeMechanismOf()
const papers = await papersOf()
const citationUuid = qpuContentUuidOf({ where: 'legal.citation', doi: DOI })
const leanInvHex = qpuStatementUuidOf('involution')
const goal = goalOf({ k: 1 })
const cov = claySealDomainCoverageOf()
const treeNext = qpuNextOf().next

const out = {
  kind: 'author-surface-evidence',
  goalState: goal.state,
  treeNext,
  authorClay,
  involutionBeyond,
  yiComplement: row('yi.complement', [0], YiFormulas.complement(0)),
  leanInvolutionHex: leanInvHex,
  citationRead: {
    legalCitation: {
      where: 'legal.citation',
      doiPassed: DOI,
      contentUuid: citationUuid,
      statement: prize.citation.statement,
      holds: prize.citation.holds,
      lead: prize.citation.lead,
    },
    citeDoor: {
      doi: cite.doi,
      conceptdoi: cite.conceptdoi,
      priorConcept: cite.prior.conceptdoi,
      priorTitle: cite.prior.title,
      priorDoi: cite.prior.doi,
      qpuCiteHolds: qpuCiteHolds(cite),
    },
    papersDoor: {
      kind: papers.kind,
      holds: papers.holds,
      wrote: papers.wrote,
      rowCount: papers.rows?.length ?? 0,
    },
  },
  domainCoverage: { universal: cov.universal, size: cov.size, held: cov.held },
  blockersAsTreeState: {
    claySealCount: CLAY_SEALS.length,
    seventhInCLAY_SEALS: false,
    prize: face.prize,
    citationHolds: prize.citation.holds,
    citationLead: prize.citation.lead,
    awardRecorded: mechanism.award.recorded,
  },
  openMathHolds: openMathScaleOf().holds,
}

console.log(JSON.stringify(out, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 2))
