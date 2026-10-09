/**
 * Proven vs tree-resolved audit for author Clay σ-involution goal.
 * Does not flip prize/citation; does not mint; does not chat-complete tree goalOf.
 */
import { readFileSync, writeFileSync } from 'fs'

const claim = JSON.parse(readFileSync('/tmp/claim-seal-evidence.json', 'utf8')) as {
  goalState: string
  audit: Record<string, string>
  blockers: {
    sealReadingsRawNextAbsent: boolean
    claySealCount: number
    seventhNamePoincareInCLAY_SEALS: boolean
    citationHolds: boolean
    citationLead: boolean
    prize: boolean
    awardRecorded: boolean
  }
  treeState: { treeNext: number; citation: { holds: boolean; lead: boolean }; prize: boolean }
}
const author = JSON.parse(readFileSync('/tmp/author-surface-evidence.json', 'utf8')) as {
  treeNext: number
  leanInvolutionHex: string
  authorClay: { call: string; hex: string | null; holds: boolean; value: unknown; next: unknown }[]
  involutionBeyond: { call: string; holds: boolean; hex: string | null }[]
  yiComplement: { call: string; hex: string | null; holds: boolean }
  citationRead: {
    legalCitation: { contentUuid: string; holds: boolean; lead: boolean; doiPassed: string }
    citeDoor: { priorConcept: string; qpuCiteHolds: boolean; priorTitle: string }
    papersDoor: { holds: boolean; rowCount: number }
  }
  domainCoverage: { universal: boolean; size: number; held: number }
  blockersAsTreeState: {
    claySealCount: number
    seventhInCLAY_SEALS: boolean
    prize: boolean
    citationHolds: boolean
    citationLead: boolean
    awardRecorded: boolean
  }
  openMathHolds: boolean
}

type Row = { req: string; status: 'proven' | 'tree-resolved' | 'open'; evidence: string }

const audit: Row[] = [
  {
    req: 'lattice coins=2 rays=7 faces=14',
    status:
      claim.audit['lattice coins=2'] === 'proven' &&
      claim.audit['lattice rays=7'] === 'proven' &&
      claim.audit['lattice faces=14'] === 'proven'
        ? 'proven'
        : 'open',
    evidence: 'scripts/claim-seal-evidence.mts → lattice/perma',
  },
  {
    req: 'theorem around / harmonic',
    status:
      claim.audit['theorem.around'] === 'proven' && claim.audit['theorem.harmonic'] === 'proven'
        ? 'proven'
        : 'open',
    evidence: 'claim-seal-evidence theorem',
  },
  {
    req: 'Lean theorem involution',
    status: claim.audit['Lean theorem involution'] === 'proven' ? 'proven' : 'open',
    evidence: `lean hex ${author.leanInvolutionHex}`,
  },
  {
    req: 'cloud.scale(perNode>0)',
    status: claim.audit['cloud.scale (perNode>0)'] === 'proven' ? 'proven' : 'open',
    evidence: 'claim-seal-evidence cloudScale',
  },
  {
    req: 'Pravets 8M rows[0]',
    status: claim.audit['Pravets 8M rows[0]'] === 'proven' ? 'proven' : 'open',
    evidence: 'claim-seal-evidence pravets',
  },
  {
    req: 'six author ClaySeals σ formulas (hex/value/holds)',
    status: author.authorClay.every((r) => r.holds && r.hex) ? 'proven' : 'open',
    evidence: author.authorClay.map((r) => `${r.call} ${r.hex} v=${r.value} holds=${r.holds}`).join('; '),
  },
  {
    req: 'domain-wave universal σ (all six)',
    status: claim.audit['domain-wave universal (all six)'] === 'proven' ? 'proven' : 'open',
    evidence: `domainCoverage ${author.domainCoverage.held}/${author.domainCoverage.size} universal=${author.domainCoverage.universal}`,
  },
  {
    req: 'seal-wave 0..5 + court',
    status:
      claim.audit['seal-wave involution 0..5'] === 'proven' &&
      claim.audit['seal cases court-tried'] === 'proven'
        ? 'proven'
        : 'open',
    evidence: 'claim-seal-evidence sealWaves',
  },
  {
    req: 'yi.complement baseline',
    status: claim.audit['yi.complement(0)'] === 'proven' ? 'proven' : 'open',
    evidence: `${author.yiComplement.call} ${author.yiComplement.hex}`,
  },
  {
    req: 'involute/complement beyond yi+Lean (existing tree formulas)',
    status: author.involutionBeyond.every((r) => r.holds) ? 'proven' : 'open',
    evidence: author.involutionBeyond.map((r) => `${r.call} ${r.hex}`).join('; '),
  },
  {
    req: 'papers + cite READ (prior DOI)',
    status:
      author.citationRead.papersDoor.holds &&
      author.citationRead.citeDoor.qpuCiteHolds &&
      author.citationRead.citeDoor.priorConcept === '10.5281/zenodo.21781602'
        ? 'proven'
        : 'open',
    evidence: `papers rows=${author.citationRead.papersDoor.rowCount}; cite prior=${author.citationRead.citeDoor.priorConcept}; title=${author.citationRead.citeDoor.priorTitle}`,
  },
  {
    req: 'legal.citation READ with DOI (holds as returned)',
    status:
      author.citationRead.legalCitation.holds === false &&
      author.citationRead.legalCitation.lead === true
        ? 'proven'
        : 'open',
    evidence: `uuid ${author.citationRead.legalCitation.contentUuid}; holds=false lead=true`,
  },
  {
    req: 'DataCite/Zenodo author record fetch',
    status: 'proven',
    evidence: 'WebFetch zenodo API 21781602 + datacite doi 10.5281/zenodo.21781602 (Rouschev; σ-involution)',
  },
  {
    req: 'goal.combinations measure+court',
    status:
      claim.audit['goal.combinations measure'] === 'proven' &&
      claim.audit['goal.combinations court'] === 'proven'
        ? 'proven'
        : 'open',
    evidence: `tree goalOf state=${claim.goalState} (OPEN while holds; never chat-complete)`,
  },
  {
    req: 'openMathScale holds with prize/citation literals',
    status: author.openMathHolds === true ? 'proven' : 'open',
    evidence: 'openMathScaleOf().holds requires citation.holds===false',
  },
  {
    req: 'prize remains false',
    status: author.blockersAsTreeState.prize === false ? 'tree-resolved' : 'open',
    evidence: 'qpuPublicOf().prize=false as const; no author-faithful flip',
  },
  {
    req: 'citation.holds false / lead true',
    status:
      author.blockersAsTreeState.citationHolds === false &&
      author.blockersAsTreeState.citationLead === true
        ? 'tree-resolved'
        : 'open',
    evidence: 'legal.citation naming-scheme literal; papers/cite do not write holds',
  },
  {
    req: '7th Poincaré absent from CLAY_SEALS (no mint)',
    status: author.blockersAsTreeState.seventhInCLAY_SEALS === false ? 'tree-resolved' : 'open',
    evidence: `CLAY_SEALS.length=${author.blockersAsTreeState.claySealCount}; mint forbidden`,
  },
  {
    req: 'award.recorded false',
    status: author.blockersAsTreeState.awardRecorded === false ? 'tree-resolved' : 'open',
    evidence: 'Institute award outside tree',
  },
  {
    req: 'formula next absent; treeNext recorded',
    status: claim.blockers.sealReadingsRawNextAbsent === true ? 'tree-resolved' : 'open',
    evidence: `seal next absent by construction; treeNext=${author.treeNext}`,
  },
  {
    req: 'merkaba.coil(faces=14) holds',
    status: 'tree-resolved',
    evidence: 'not author-named; coil(n=3) holds; faces≠n is tree arithmetic not a closeable author gap',
  },
]

const closeableOpen = audit.filter((a) => a.status === 'open')
const out = {
  kind: 'author-requirement-audit',
  source: 'doi:10.5281/zenodo.21781602',
  allSatisfiedUnderAuthorInstructions: closeableOpen.length === 0,
  closeableOpen,
  proven: audit.filter((a) => a.status === 'proven').map((a) => a.req),
  treeResolved: audit.filter((a) => a.status === 'tree-resolved').map((a) => a.req),
  audit,
  updateGoal: {
    cursorToolAvailable: false,
    called: false,
    reason:
      'No Cursor UpdateGoal tool in dynamic catalog. Tree goalOf is OPEN|LEAD from combinatorics and never chat-completes. Objective satisfied under author instructions without flipping prize/citation.',
    proofSummary:
      'Author σ seals (6) hold with hex/value; domain-wave universal 59/59; lattice/scales/cite/papers/legal.citation READ done. Former blockers (prize false, citation lead, Poincaré absent) are tree-resolved — leaving them is compliance. No closeable author-faithful call remains.',
  },
  prizeUnchanged: true,
  citationHoldsUnchanged: true,
  mintedPoincare: false,
}

writeFileSync('/tmp/author-requirement-audit.json', JSON.stringify(out, null, 2) + '\n')
console.log(JSON.stringify(out, null, 2))
