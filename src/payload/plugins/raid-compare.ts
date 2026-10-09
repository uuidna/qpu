/**
 * RAID vs direct bindings — measured from the tree, no invented magnitudes.
 *
 * Cost/speed: Qpu.Hybrid (kvCost/r2Cost/hybridCost, kvSpeed/r2Speed/hybridSpeed) and qpuRaidOf cluster
 * (minimum / coordinated). Ops: storage-subrequests.json door counts. Security: write-auth fail-closed +
 * RAID faces shares. Usability: connector + Payload RAID adapter axis. Claim rows pass only when the
 * measured inequality holds; "magnitudes" is refused unless a named factor is ≥ mintOf(n).
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  mintOf,
  qpuHybridOf,
  qpuLatticeNamesOf,
  qpuRaidOf,
  qpuStorageWriteAllowedHolds,
} from '../../quantum/processing/unit/index.js'
import { cloudflareRaidAdaptersOf, PAYLOAD_WEBSITE_CLONE } from '../../deployment/payload-cloudflare.js'
import { catalogPriceRelationOf } from './price-relation.js'
import { modeAccessOf } from './access-mode.js'

const timed = <T>(fn: () => T): { value: T; ms: number } => {
  const t0 = performance.now()
  const value = fn()
  return { value, ms: Math.round((performance.now() - t0) * 1000) / 1000 }
}

const subrequestsOf = (): { budget: number; putPopulated: number; getPopulated: number; getEmpty: number } => {
  try {
    const doc = JSON.parse(readFileSync(join(process.cwd(), 'storage-subrequests.json'), 'utf8')) as {
      budget: number
      doors: Record<string, { empty: number; populated: number }>
    }
    return {
      budget: doc.budget,
      putPopulated: doc.doors['PUT /storage/:key']?.populated ?? 0,
      getPopulated: doc.doors['GET /storage/:key']?.populated ?? 0,
      getEmpty: doc.doors['GET /storage/:key']?.empty ?? 0,
    }
  } catch {
    return { budget: 0, putPopulated: 0, getPopulated: 0, getEmpty: 0 }
  }
}

export type RaidClaimRow = {
  dimension: 'cost' | 'speed' | 'security' | 'usability'
  claim: string
  raid: number | string | boolean
  direct: number | string | boolean
  ratio: number | null
  unit: string
  evidence: string
  pass: boolean
  note: string
}

/**
 * Measured RAID (hybrid KV+R2) vs direct single-binding figures from Qpu.Hybrid / RAID / subrequests / access.
 * Does not invent 10×/100× — reports the measured ratio, and refuses "magnitudes" unless ratio ≥ mintOf(n).
 */
export const raidCompareOf = () => {
  const hybridTimed = timed(() => qpuHybridOf())
  const raidTimed = timed(() => qpuRaidOf())
  const hybrid = hybridTimed.value
  const raid = raidTimed.value
  const lattice = qpuLatticeNamesOf()
  const adapters = cloudflareRaidAdaptersOf({ db: 'qpu-raid', storage: 'r2' })
  const ops = subrequestsOf()
  const access = modeAccessOf({ mode: 5, who: 'other' })
  const price = catalogPriceRelationOf('qpu-raid')
  const writeAuth = qpuStorageWriteAllowedHolds()
  const magnitudeFloor = mintOf(lattice.n)

  const kv = { cost: hybrid.kv.cost, speed: hybrid.kv.speed, name: 'STORAGE kv' as const }
  const r2 = { cost: hybrid.r2.cost, speed: hybrid.r2.speed, name: 'BLOBS r2' as const }
  const raidCost = hybrid.cost
  const raidSpeed = hybrid.speed

  const rows: RaidClaimRow[] = [
    {
      dimension: 'cost',
      claim: 'RAID cheaper than direct KV',
      raid: raidCost,
      direct: kv.cost,
      ratio: kv.cost > 0 ? raidCost / kv.cost : null,
      unit: 'Qpu.Hybrid cost units',
      evidence: 'hybridCost = kvCost + r2Cost = n; kvCost = coins',
      pass: raidCost < kv.cost,
      note: 'hybrid is the sum — not cheaper than KV alone',
    },
    {
      dimension: 'cost',
      claim: 'RAID cheaper than direct R2',
      raid: raidCost,
      direct: r2.cost,
      ratio: r2.cost > 0 ? raidCost / r2.cost : null,
      unit: 'Qpu.Hybrid cost units',
      evidence: 'hybridCost = n; r2Cost = seed',
      pass: raidCost < r2.cost,
      note: 'hybrid is the sum — not cheaper than R2 alone',
    },
    {
      dimension: 'cost',
      claim: 'RAID cluster cost is minimum (cheapest-first)',
      raid: raid.cluster.cost,
      direct: 'uncoordinated placement',
      ratio: null,
      unit: 'raid.cluster.cost',
      evidence: 'qpuRaidOf().cluster.cost === minimum ∧ holds',
      pass: raid.cluster.cost === 'minimum' && raid.holds === true,
      note: 'identity on placement, not a dollar price',
    },
    {
      dimension: 'cost',
      claim: 'RAID PUT ops under Workers subrequest budget',
      raid: ops.putPopulated,
      direct: ops.budget,
      ratio: ops.budget > 0 ? ops.putPopulated / ops.budget : null,
      unit: 'subrequests (storage-subrequests.json)',
      evidence: 'PUT /storage/:key populated vs budget 50',
      pass: ops.putPopulated > 0 && ops.putPopulated <= ops.budget,
      note: 'known RAID write debt: shares push PUT over budget',
    },
    {
      dimension: 'speed',
      claim: 'RAID faster than direct KV',
      raid: raidSpeed,
      direct: kv.speed,
      ratio: kv.speed > 0 ? raidSpeed / kv.speed : null,
      unit: 'Qpu.Hybrid speed units',
      evidence: 'hybridSpeed = kvSpeed + r2Speed = mintOf(n); kvSpeed = rays',
      pass: raidSpeed > kv.speed,
      note: 'coordinated sum beats KV alone',
    },
    {
      dimension: 'speed',
      claim: 'RAID faster than direct R2',
      raid: raidSpeed,
      direct: r2.speed,
      ratio: r2.speed > 0 ? raidSpeed / r2.speed : null,
      unit: 'Qpu.Hybrid speed units',
      evidence: 'hybridSpeed = mintOf(n); r2Speed = seed',
      pass: raidSpeed > r2.speed,
      note: 'coordinated sum beats R2 alone',
    },
    {
      dimension: 'speed',
      claim: 'RAID cluster speed is coordinated',
      raid: raid.cluster.speed,
      direct: 'single-binding alone',
      ratio: null,
      unit: 'raid.cluster.speed',
      evidence: 'qpuRaidOf().cluster.speed === coordinated ∧ holds',
      pass: raid.cluster.speed === 'coordinated' && raid.holds === true,
      note: 'identity on coordination',
    },
    {
      dimension: 'security',
      claim: 'RAID write auth fails closed',
      raid: writeAuth,
      direct: 'open write without bearer',
      ratio: null,
      unit: 'qpuStorageWriteAllowedHolds',
      evidence: 'bound/wrong/unbound probe matrix',
      pass: writeAuth === true,
      note: 'Bearer QPU_WRITE_TOKEN; reads stay open',
    },
    {
      dimension: 'security',
      claim: 'RAID share count vs single binding',
      raid: raid.faces,
      direct: 1,
      ratio: raid.faces / 1,
      unit: 'RAID faces / shares',
      evidence: 'qpuRaidOf().faces (RAID 10 stripes×teams)',
      pass: raid.faces > 1 && raid.holds === true,
      note: `share ratio ${raid.faces} — not security-bit magnitudes`,
    },
    {
      dimension: 'security',
      claim: 'magnitudes more secure (ratio ≥ mintOf(n))',
      raid: raid.faces,
      direct: 1,
      ratio: raid.faces,
      unit: `share ratio vs mintOf(n)=${magnitudeFloor}`,
      evidence: 'refuse invented 10×/100×; magnitudes only if ratio ≥ mintOf(n)',
      pass: raid.faces >= magnitudeFloor,
      note: raid.faces >= magnitudeFloor
        ? `share ratio ${raid.faces} ≥ mintOf(n)=${magnitudeFloor}`
        : `share ratio ${raid.faces} < mintOf(n)=${magnitudeFloor} — not magnitudes`,
    },
    {
      dimension: 'usability',
      claim: 'RAID native on Payload db/storage axes (no port)',
      raid: adapters.holds,
      direct: 'node:fs / mongod port into QPU_PORTS',
      ratio: null,
      unit: 'cloudflareRaidAdaptersOf.holds',
      evidence: 'qpu-raid + r2; port:false',
      pass: adapters.holds === true && adapters.port === false,
      note: PAYLOAD_WEBSITE_CLONE.generate,
    },
    {
      dimension: 'usability',
      claim: 'Unix access + catalog price on RAID slug',
      raid: access.holds === true && price.holds === true,
      direct: 'no connector / priceRelation path',
      ratio: null,
      unit: 'modeAccessOf + catalogPriceRelationOf',
      evidence: 'access mode 5 other; priceRelation latticeCost qpu-raid',
      pass: access.holds === true && (price.holds === true || price.goal === 'OPEN' || price.goal === 'LEAD'),
      note: `access.holds=${access.holds}; price.goal=${price.goal}`,
    },
  ]

  const byDim = (d: RaidClaimRow['dimension']) => rows.filter((r) => r.dimension === d)
  const verdict = {
    cheaper: byDim('cost').some((r) => r.claim.includes('cheaper') && r.pass) === false
      ? (byDim('cost').find((r) => r.claim.includes('minimum'))?.pass === true ? 'partial: minimum placement, not cheaper than KV/R2 alone' : 'fail')
      : 'pass',
    faster: byDim('speed').filter((r) => r.claim.includes('faster')).every((r) => r.pass)
      ? 'pass'
      : 'fail',
    magnitudesSecure: byDim('security').find((r) => r.claim.startsWith('magnitudes'))?.pass === true ? 'pass' : 'fail',
    usable: byDim('usability').every((r) => r.pass) ? 'pass' : 'fail',
  }

  const claimPass =
    verdict.faster === 'pass' &&
    verdict.usable === 'pass' &&
    (verdict.cheaper === 'pass' || verdict.cheaper.startsWith('partial')) &&
    writeAuth === true

  return {
    kind: 'raid-compare' as const,
    call: 'tools/call connector { raid: true }' as const,
    clone: PAYLOAD_WEBSITE_CLONE,
    adapters,
    lattice: { n: lattice.n, coins: lattice.coins, seed: lattice.seed, rays: hybrid.kv.speed, faces: raid.faces },
    hybrid: {
      kvCost: kv.cost,
      r2Cost: r2.cost,
      hybridCost: raidCost,
      kvSpeed: kv.speed,
      r2Speed: r2.speed,
      hybridSpeed: raidSpeed,
      holds: hybrid.holds,
      ms: hybridTimed.ms,
    },
    raid: {
      level: raid.level,
      cost: raid.cluster.cost,
      speed: raid.cluster.speed,
      cheapest: raid.cheapest,
      faces: raid.faces,
      holds: raid.holds,
      ms: raidTimed.ms,
    },
    ops,
    price: { slug: 'qpu-raid', holds: price.holds, goal: price.goal },
    access: { holds: access.holds, goal: access.goal },
    writeAuth,
    magnitudeFloor,
    rows,
    verdict,
    claim: 'RAID is cheaper and faster than direct bindings and magnitudes more secure and usable',
    /** Whole claim: faster+usable+writeAuth hold; cheaper is partial (minimum, not < KV/R2); magnitudes fail unless share ratio ≥ mintOf(n). */
    pass: claimPass && verdict.magnitudesSecure === 'pass' ? true : false,
    partial: claimPass && verdict.magnitudesSecure !== 'pass',
    holds: hybrid.holds === true && raid.holds === true && adapters.holds === true,
  }
}

export const raidCompareHolds = (x = raidCompareOf()): boolean => x.holds === true && Array.isArray(x.rows) && x.rows.length > 0
