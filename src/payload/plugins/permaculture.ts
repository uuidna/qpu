import { permaTrinityOf } from '../../families/perma/index.js'
import { ContractFormulas } from '../../families/contract/index.js'
import { EvidenceFormulas } from '../../families/evidence/index.js'
import { LawFormulas } from '../../families/law/index.js'
import { qpuHarnessesOf, qpuManOf, qpuRecognizeOf, qpuStandardsOf } from '../../quantum/processing/unit/index.js'
import { qpuTenantZoneOf } from '../../quantum/processing/unit/presentation.js'
import { usageBillOf } from './billing.js'
import { openMathScaleOf } from './clay.js'
import { domainReadingsOf } from './domains.js'
import { postQuantumUpgradeOf } from './upgrade.js'
import { payloadLeadsOf } from './leads.js'
import type { QpuPlugin } from './surface.js'

/**
 * perma.family is a commercial client of this unit, not a second app. A tenant under the zone is one label
 * (qpuTenantZoneOf): the slug is the family name `perma`. The client name carries a dot, so it is not itself a
 * zone label. The bill is the usage meter. The margin place stays empty. The prize is not this bill.
 */
const SLUG = 'perma'

/** The connectors qpuHarnessesOf already names, each checked by that function. No efficiency formula takes this count.
 *  benchmark.efficiency and the other efficiency formulas are not called. Unconfirmed novelty is not billed. */
export const connectorExamOf = () => {
  const harnesses = qpuHarnessesOf()
  const reviewed = LawFormulas.reviewed(0)
  return {
    kind: 'connector-exam' as const,
    examined: harnesses.rows.length,
    connectors: harnesses.rows.map((row) => row.harness),
    url: harnesses.url,
    holds: harnesses.holds === true,
    efficiency: { formula: null, hex: null, value: null, holds: false as const, lead: true as const },
    novelty: { confirmed: false as const, billed: false as const, lead: true as const, reviewed: reviewed.holds },
  }
}

/** One public connector: every harness already points at the same MCP url, and a read needs no credential.
 *  A secured API and a write that needs a bearer stay outside. No second protocol. */
export const publicConnectorOf = () => {
  const harnesses = qpuHarnessesOf()
  const exam = connectorExamOf()
  const fused = harnesses.rows.filter((row) => JSON.stringify(row.config).includes(harnesses.url) || row.how.includes(harnesses.url))
  return {
    kind: 'connector' as const,
    url: harnesses.url,
    name: harnesses.name,
    fused: fused.map((row) => row.harness),
    examined: fused.length,
    efficiency: exam.efficiency,
    novelty: exam.novelty,
    outside: [
      { where: 'storage-write' as const, why: 'A storage write needs Authorization: Bearer. That token is not handed to a public caller.' },
      { where: 'googleapis.com:books' as const, why: 'Secured. Not called.' },
      { where: 'nytimes.com:books_api' as const, why: 'Secured. Not called.' },
      { where: 'stdio' as const, why: 'The porting table names stdio. qpuHarnessesOf has no stdio row.' },
    ],
    holds: harnesses.holds === true && fused.length === harnesses.rows.length && new Set(fused.map(() => harnesses.url)).size === 1,
  }
}

/** What the Payload surface delivers: a holds-true reading beside the usage bill. A lead is listed and not delivered. Margin is not a number. */
export const valueForMoneyOf = () => {
  const trinity = permaTrinityOf()
  const upgrade = postQuantumUpgradeOf().upgrade
  const bill = usageBillOf()
  const citation = openMathScaleOf().citation
  const exam = connectorExamOf()
  const value = [
    ...trinity.readings.filter((row) => row.holds === true).map((row) => ({ where: `perma.${row.face}`, hex: row.uuid, value: row.value, holds: true as const })),
    ...(upgrade.holds === true ? [{ where: 'crypt.curveQuantumBits' as const, hex: upgrade.uuid, value: upgrade.value, holds: true as const }] : []),
  ]
  return {
    kind: 'value-for-money' as const,
    surface: 'Payload frontend RunCard and the generic block' as const,
    tenant: 'perma.uuidna.com' as const,
    value,
    bill: { units: bill.units, charged: bill.charged, billed: bill.billed, prizeBilled: false as const },
    leads: [
      { where: 'legal.citation' as const, holds: citation.holds, lead: citation.lead },
      { where: 'industry-margin' as const, lead: true as const },
      { where: 'connector-efficiency' as const, lead: exam.efficiency.lead },
      { where: 'novelty' as const, lead: exam.novelty.lead, billed: exam.novelty.billed },
      { where: 'clay-prize' as const, lead: bill.prize.lead, billed: bill.prize.billed },
      { where: 'product-variant' as const, lead: true as const },
    ],
    holds: value.length > 0 && value.every((row) => row.holds === true) && bill.holds === true && citation.holds === false && bill.margin === null,
  }
}

export const permaTenantOf = () => {
  const zone = qpuTenantZoneOf()
  const underZone = !SLUG.includes('.') && !SLUG.includes('*') && !zone.reserved.includes(SLUG)
  const trinity = permaTrinityOf()
  const usage = usageBillOf()
  const exam = connectorExamOf()
  const bill = { ...usage, tenant: SLUG, client: 'perma.family' as const, novelty: exam.novelty }
  const scale = openMathScaleOf()
  const reviewed = LawFormulas.reviewed(0)
  const cure = ContractFormulas.cure(7, 14)
  const lawful = LawFormulas.lawful(0)
  const chain = EvidenceFormulas.chain(5, 5)
  const domains = domainReadingsOf()
  return {
    kind: 'perma-tenant' as const,
    standards: qpuStandardsOf(),
    client: 'perma.family' as const,
    slug: SLUG,
    host: `${SLUG}.${zone.zone}`,
    of: zone.own,
    zone: zone.zone,
    underZone,
    scale,
    trinity,
    domains,
    protection: [
      { party: 'perma' as const, family: 'contract' as const, formula: 'cure' as const, hex: cure.hex, value: cure.value, holds: cure.holds },
      { party: 'qpu' as const, family: 'law' as const, formula: 'lawful' as const, hex: lawful.hex, value: lawful.value, holds: lawful.holds },
      { party: 'public' as const, family: 'evidence' as const, formula: 'chain' as const, hex: chain.hex, value: chain.value, holds: chain.holds },
    ],
    reviewed: { family: 'law' as const, formula: 'reviewed' as const, params: [0] as const, hex: reviewed.hex, value: reviewed.value, holds: reviewed.holds, lead: true as const, note: 'not advice' as const },
    upgrade: postQuantumUpgradeOf().upgrade,
    exam,
    connector: publicConnectorOf(),
    bill,
    citation: scale.citation,
    valueForMoney: valueForMoneyOf(),
    holds: underZone && trinity.holds === true && bill.holds === true,
  }
}

/** Default is the recognition. { full: true } is the document. { man: true } is the schema page. */
export const permaManOf = () => qpuManOf(
  'permaculture',
  'perma.family is a tenant of this unit. clay.bsd is the author\'s seal arithmetic, recomputed. The citation row is a lead.',
  'The reply is the recognition. { full: true } is the document. { man: true } is this page. The walk is the clay seals, then the domains on this path. No price is confirmed.',
  'https://qpu.uuidna.com/mcp',
  ['hex', 'law', 'clay'],
)

export const permaAnswerOf = (args: { full?: boolean; man?: boolean } = {}) => {
  if (args.man === true) return permaManOf()
  const doc = permaTenantOf()
  return args.full === true ? doc : qpuRecognizeOf(doc)
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
    handler: (req: { url?: string }) => {
      const url = req?.url ?? ''
      return Response.json(permaAnswerOf({ full: /[?&]full=true(?:&|$)/.test(url), man: /[?&]man=true(?:&|$)/.test(url) }))
    },
  }],
})
