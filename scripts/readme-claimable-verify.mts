/**
 * README claimable Clay seals ↔ live CLAY_SEALS evidence.
 * No prize/citation flip; no Poincaré mint.
 */
import '../src/mcp/families.js'
import {
  ClaySeals,
  CLAY_SEALS,
  claySealDomainCoverageOf,
  claySealWaveOf,
  claySealDomainOf,
} from '../src/families/clay/index.js'
import { clayOf } from '../src/core/showcase.js'
import { claySealReadingsOf } from '../src/payload/plugins/clay.js'
import { qpuAnalyticsOf } from '../src/quantum/processing/unit/zeropage.js'
import { qpuNextOf } from '../src/quantum/processing/unit/index.js'
import { writeFileSync } from 'fs'

/** README / clayOf CLAIMED rows map to these seal formulas (programmatic claimables). */
const NAME_TO_SEAL: Record<string, (typeof CLAY_SEALS)[number]> = {
  'P vs NP': 'pVsNp',
  'Hodge Conjecture': 'hodge',
  'Riemann Hypothesis': 'riemann',
  'Yang-Mills and Mass Gap': 'yangMills',
  'Navier-Stokes Existence and Smoothness': 'navierStokes',
  'Birch and Swinnerton-Dyer Conjecture': 'bsd',
}

const showcase = clayOf()
const claimed = showcase.filter((p) => p.status === 'CLAIMED')
const nonClaimable = showcase.filter((p) => p.status !== 'CLAIMED')
const readings = claySealReadingsOf()
const treeNext = qpuNextOf().next
const a = qpuAnalyticsOf()

const README_REGISTER = {
  coins: 2,
  n: 3,
  rays: 7,
  clay: 14,
  riemann: 1,
  bsd: 2,
  hodge: 4,
  navierStokes: 1,
  pVsNp: 0,
  yangMills: 2,
} as const

const registerLive = Object.fromEntries(
  Object.keys(README_REGISTER).map((k) => [k, (a as Record<string, number>)[k]]),
) as Record<string, number>
const registerMatch = Object.fromEntries(
  Object.entries(README_REGISTER).map(([k, v]) => [k, registerLive[k] === v]),
)

const claimableRows = claimed.map((p) => {
  const seal = NAME_TO_SEAL[p.name]
  const reading = readings.find((r) => r.formula === seal)
  return {
    name: p.name,
    seal: seal ? `clay.${seal}` : null,
    inCLAY_SEALS: seal != null && (CLAY_SEALS as readonly string[]).includes(seal),
    hex: reading?.hex ?? null,
    value: reading?.value ?? null,
    holds: reading?.holds === true,
    params: reading?.params ?? null,
    next: 'absent' as const,
  }
})

const cov = claySealDomainCoverageOf()
const sealWaves = await Promise.all(
  CLAY_SEALS.map(async (name, i) => {
    const domain = claySealDomainOf(name)
    const w = await claySealWaveOf(i)
    return {
      i,
      name,
      domainSize: domain.params.length,
      held: w?.held ?? 0,
      universal: w?.universal === true,
      hex: w?.hex ?? null,
      involution: w?.involution ?? null,
      treeNext,
    }
  }),
)

const discoverySealsCited = 13 // discovery-receipt.json seals field / README glance

const out = {
  kind: 'readme-claimable-verify',
  readmeStatsCited: {
    claimTitle: 'All Seven Clay Millennium Problems Sealed via Universal σ-Involution',
    claimableProgrammaticSeals: 6,
    claimableNames: claimableRows.map((r) => r.seal),
    nonClaimable: nonClaimable.map((p) => ({ name: p.name, status: p.status, seal: '—' })),
    clayRegister: README_REGISTER,
    discoverySealsFixedPointsInvolutions: discoverySealsCited,
    sealWaveReceiptInReadme: '— (clay-receipt.json absent)',
  },
  liveMatch: {
    claimedCountEqualsCLAY_SEALS: claimed.length === CLAY_SEALS.length,
    everyClaimedMappedToSeal: claimableRows.every((r) => r.inCLAY_SEALS),
    everyClaimedHolds: claimableRows.every((r) => r.holds && r.hex),
    claimableRows,
    registerMatch,
    registerAllMatch: Object.values(registerMatch).every(Boolean),
    domainCoverage: { universal: cov.universal, held: cov.held, size: cov.size },
    sealWavesUniversal: sealWaves.every((s) => s.universal),
    sealWaves,
  },
  treeResolved: {
    prize: false,
    citationHolds: false,
    poincareInCLAY_SEALS: false,
    note: 'not claimable programmatically; README marks Poincaré seal —',
  },
  consistent:
    claimed.length === CLAY_SEALS.length &&
    claimableRows.every((r) => r.holds && r.hex && r.inCLAY_SEALS) &&
    Object.values(registerMatch).every(Boolean) &&
    cov.universal === true &&
    sealWaves.every((s) => s.universal),
}

writeFileSync('/tmp/readme-claimable-verify.json', JSON.stringify(out, null, 2) + '\n')
console.log(JSON.stringify(out, null, 2))
