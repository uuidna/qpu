import { permaTrinityOf } from '../../families/perma/index.js'
import { qpuTenantZoneOf } from '../../quantum/processing/unit/presentation.js'
import { usageBillOf } from './billing.js'
import { postQuantumUpgradeOf } from './upgrade.js'
import { clayPrizeOf } from './clay.js'
import { payloadLeadsOf } from './leads.js'
import type { QpuPlugin } from './surface.js'

/**
 * perma.family is a commercial client of this unit, not a second app. A tenant under the zone is one label
 * (qpuTenantZoneOf): the slug is the family name `perma`. The client name carries a dot, so it is not itself a
 * zone label. The bill is the usage meter. The margin place stays empty. The prize is not this bill.
 */
const SLUG = 'perma'

export const permaTenantOf = () => {
  const zone = qpuTenantZoneOf()
  const underZone = !SLUG.includes('.') && !SLUG.includes('*') && !zone.reserved.includes(SLUG)
  const trinity = permaTrinityOf()
  const usage = usageBillOf()
  const citation = clayPrizeOf().citation
  const bill = { ...usage, tenant: SLUG, client: 'perma.family' as const }
  return {
    kind: 'perma-tenant' as const,
    client: 'perma.family' as const,
    slug: SLUG,
    host: `${SLUG}.${zone.zone}`,
    of: zone.own,
    zone: zone.zone,
    underZone,
    trinity,
    upgrade: postQuantumUpgradeOf().upgrade,
    bill,
    citation,
    holds: underZone && trinity.holds === true && bill.holds === true,
  }
}

export const permacultureVisionOf = () => {
  const tenant = permaTenantOf()
  return {
    kind: 'permaculture-vision' as const,
    asked: 'permaculture' as const,
    tenant,
    upgrade: tenant.upgrade,
    citation: tenant.citation,
    gateway: payloadLeadsOf(),
    holds: false as const,
    lead: true as const,
  }
}

export const permaculturePlugin = (): QpuPlugin => (config) => ({
  ...config,
  endpoints: [...(config.endpoints ?? []), {
    path: '/qpu/permaculture',
    method: 'get' as const,
    handler: () => Response.json(permaTenantOf()),
  }],
})
