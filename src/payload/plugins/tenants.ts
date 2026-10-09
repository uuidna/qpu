/**
 * Formulated tenants — MCP serves each with specific model doors and individual needs.
 * Owned here; ecommerce catalog and connector `{ tenant }` import this registry.
 * Options are formula/door views — not frozen enums agents memorize.
 */
import { AccessFormulas } from '../../families/access/index.js'
import { ClaySeals, CLAY_SEALS } from '../../families/clay/index.js'
import { permaTrinityOf } from '../../families/perma/index.js'
import {
  qpuHarnessesOf,
  qpuHexFamiliesOf,
  qpuMcpToolsListOf,
  qpuStandardsOf,
  unit,
  type QpuEnv,
} from '../../quantum/processing/unit/index.js'
import { qpuTenantZoneOf, qpuZoneOf } from '../../quantum/processing/unit/presentation.js'
import { domainReadingsOf } from './domains.js'
import type { QpuPlugin } from './surface.js'

export type TenantModel = {
  door: string
  kind: 'sealed' | 'fused'
  via: string
  note: string
}

export type TenantNeed = {
  family: string
  formula?: string
  hex?: string | null
  value?: unknown
  holds?: boolean
  /** Hex params when the need is a formula call — individual need as params, not a special-case list. */
  params?: readonly number[]
  via: string
  note: string
}

export type TenantRecord = {
  slug: string
  name: string
  domain: string
  host: string
  kind: 'zone' | 'client' | 'root'
  serves: string
  client: string | null
  underZone: boolean
  reserved: boolean
  models: TenantModel[]
  needs: TenantNeed[]
  mcp: { via: string; door: 'connector'; args: Record<string, unknown> }
  access: { formula: 'access.tenant'; hex: string | null; value: number | null; holds: boolean; note: string }
  source: string
  collections: { tenants: 'tenants' }
}

const sealed = (door: string, note: string): TenantModel => ({
  door, kind: 'sealed', via: `tools/call ${door}`, note,
})
const fused = (door: string, note: string, args: Record<string, unknown> = {}): TenantModel => ({
  door, kind: 'fused',
  via: Object.keys(args).length ? `tools/call ${door} ${JSON.stringify(args)}` : `tools/call ${door}`,
  note,
})

const zoneOf = () => qpuTenantZoneOf()

/** Every formulated tenant the tree names (zone hosts + perma client + root). */
export const formulatedTenantsOf = (): TenantRecord[] => {
  const z = zoneOf()
  const tools = new Set(qpuMcpToolsListOf().map((t) => t.name))
  const accessOk = AccessFormulas.tenant(1, 1, 1)

  const zoneRows: TenantRecord[] = qpuZoneOf().hosts.filter((h) => h.qpu).map((h) => {
    const slug = h.label || z.own
    const models: TenantModel[] = []
    const needs: TenantNeed[] = []

    if (slug === 'qpu' || h.own) {
      for (const door of ['quantum', 'lean', 'cite', 'train', 'forge', 'improve', 'compete', 'prove'] as const) {
        if (tools.has(door)) models.push(sealed(door, h.serves))
      }
      models.push(fused('connector', 'point + tenant + enums', { point: true }))
      models.push(fused('hex', 'any registered family'))
      models.push(fused('domains', 'domain readings'))
      models.push(fused('papers', 'papers'))
      const riemann = ClaySeals.riemann(1, 2)
      needs.push({
        family: 'clay', formula: 'riemann', params: [1, 2], hex: riemann.hex ?? null,
        value: riemann.value, holds: riemann.holds === true,
        via: 'tools/call hex { family:"clay", program:["riemann"], params:[1,2] }',
        note: 'σ-involution anchor',
      })
      needs.push({
        family: 'wave', formula: 'sweep', params: [0],
        via: 'tools/call connector { from: 0 }', note: 'stride = faces',
      })
      // Seal index as formula param: clay.pass(i) / clay.{CLAY_SEALS[i]} — not a memorized enum.
      CLAY_SEALS.forEach((seal, i) => {
        needs.push({
          family: 'clay', formula: seal, params: [i],
          via: `tools/call hex { family:"clay", program:["${seal}"] } · index ${i}`,
          note: `seal enum option i=${i} → clay.${seal}`,
        })
      })
    } else if (slug === 'lean') {
      if (tools.has('lean')) models.push(sealed('lean', h.serves))
      if (tools.has('prove')) models.push(sealed('prove', 'theorems'))
      if (tools.has('cite')) models.push(sealed('cite', 'cite'))
      models.push(fused('hex', 'lean family'))
      needs.push({ family: 'lean', via: 'tools/call lean', note: h.serves })
    } else if (slug === 'unreal' || slug === 'hardware') {
      models.push(fused('hologram', h.serves))
      if (tools.has('prove')) models.push(sealed('prove', 'views'))
      needs.push({ family: 'holo', via: 'tools/call hologram', note: h.serves })
    } else if (slug === 'school') {
      for (const door of ['train', 'improve', 'compete', 'prove'] as const) {
        if (tools.has(door)) models.push(sealed(door, h.serves))
      }
      needs.push({ family: 'ladder', via: 'train→improve→compete→prove', note: h.serves })
    } else {
      models.push(fused('connector', h.serves, { tenant: slug }))
      needs.push({ family: 'zone', via: `tools/call connector { tenant: "${slug}" }`, note: h.serves })
    }

    return {
      slug,
      name: h.host,
      domain: h.host,
      host: h.host,
      kind: h.own ? 'root' as const : 'zone' as const,
      serves: h.serves,
      client: null,
      underZone: !z.reserved.includes(slug),
      reserved: z.reserved.includes(slug),
      models,
      needs,
      mcp: { via: 'tools/call connector', door: 'connector' as const, args: { tenant: slug } },
      access: {
        formula: 'access.tenant' as const,
        hex: accessOk.hex ?? null,
        value: accessOk.value,
        holds: accessOk.holds === true,
        note: 'same-tenant reach; role 3 crosses',
      },
      source: `QPU_ZONE_HOSTS · ${h.serves}`,
      collections: { tenants: 'tenants' as const },
    }
  })

  const trinity = permaTrinityOf()
  const bsd = ClaySeals.bsd(2)
  const domains = domainReadingsOf()
  const perma: TenantRecord = {
    slug: 'perma',
    name: 'perma.family',
    domain: `perma.${z.zone}`,
    host: `perma.${z.zone}`,
    kind: 'client',
    serves: 'commercial client — perma trinity, clay.bsd, domains; citation stays lead',
    client: 'perma.family',
    underZone: !z.reserved.includes('perma'),
    reserved: false,
    models: [
      fused('permaculture', 'tenant document'),
      fused('connector', 'tenant surface', { tenant: 'perma' }),
      fused('domains', 'domain readings'),
      fused('hex', 'clay.bsd + perma'),
    ],
    needs: [
      ...trinity.readings.map((r) => ({
        family: 'perma' as const,
        formula: r.face,
        hex: r.uuid ?? null,
        value: r.value,
        holds: r.holds === true,
        via: `tools/call hex { family:"perma", program:["${r.face}"] }`,
        note: r.formula,
      })),
      {
        family: 'clay', formula: 'bsd', params: [2], hex: bsd.hex ?? null,
        value: bsd.value, holds: bsd.holds === true,
        via: 'tools/call hex { family:"clay", program:["bsd"], params:[2] }',
        note: 'author seal for this client',
      },
      {
        family: 'domains', formula: 'readings', value: domains.readings.length,
        holds: domains.holds === true, via: 'tools/call domains', note: 'domains path',
      },
    ],
    mcp: { via: 'tools/call connector', door: 'connector', args: { tenant: 'perma' } },
    access: {
      formula: 'access.tenant',
      hex: accessOk.hex ?? null,
      value: accessOk.value,
      holds: accessOk.holds === true,
      note: 'client isolation via Payload multi-tenant',
    },
    source: 'permaTenantOf / leads perma.family',
    collections: { tenants: 'tenants' },
  }

  // Deduplicate if zone already has qpu root
  const seen = new Set(zoneRows.map((r) => r.slug))
  const rows = [...zoneRows]
  if (!seen.has('perma')) rows.push(perma)
  return rows
}

export const tenantResolveOf = (ask: { tenant?: string; host?: string; domain?: string } = {}): TenantRecord | null => {
  const rows = formulatedTenantsOf()
  const key = (ask.tenant ?? ask.host ?? ask.domain ?? '').toLowerCase().trim()
  if (!key) return null
  return (
    rows.find((t) => t.slug === key) ??
    rows.find((t) => t.host.toLowerCase() === key || t.domain.toLowerCase() === key) ??
    rows.find((t) => key === 'perma.family' && t.slug === 'perma') ??
    rows.find((t) => key.startsWith(`${t.slug}.`) || key.endsWith(`.${t.slug}`)) ??
    null
  )
}

export const tenantServeOf = async (args: Record<string, unknown> = {}, _env?: QpuEnv) => {
  const t0 = Date.now()
  const tools = qpuMcpToolsListOf()
  const listBytes = JSON.stringify({ resultType: 'complete', tools }).length
  const harnesses = qpuHarnessesOf()
  const rows = formulatedTenantsOf()
  const z = zoneOf()

  if (args.tenants === true) {
    return {
      kind: 'tenants' as const,
      call: 'tools/call connector { tenants: true }' as const,
      endpoint: '/api/qpu/tenants' as const,
      zone: z.zone,
      own: z.own,
      reserved: z.reserved,
      standards: qpuStandardsOf(),
      tenants: rows.map((t) => ({
        slug: t.slug,
        name: t.name,
        domain: t.domain,
        kind: t.kind,
        reserved: t.reserved,
        serves: t.serves,
        models: t.models.map((m) => m.door),
        needs: t.needs.map((n) => `${n.family}${n.formula ? `.${n.formula}` : ''}`),
        mcp: t.mcp,
        source: t.source,
      })),
      served: { tenant: null as string | null, model: 'catalog' as string | null, needs: rows.length, ms: Date.now() - t0 },
      connectBill: {
        doors: tools.length,
        bytes: listBytes,
        under16384: listBytes < 16384,
        qpuPrefixed: tools.filter((t) => t.name.startsWith('qpu_')).length,
      },
      harness: harnesses.url,
      holds: rows.length > 0 && tools.length <= 16 && listBytes < 16384,
      goal: 'OPEN' as const,
    }
  }

  const ask =
    typeof args.tenant === 'string' ? { tenant: args.tenant }
    : typeof args.host === 'string' ? { host: args.host }
    : typeof args.domain === 'string' ? { domain: args.domain }
    : {}
  const tenant = tenantResolveOf(ask)
  if (!tenant) {
    return {
      kind: 'tenant-miss' as const,
      ask,
      choices: rows.map((t) => t.slug),
      resolve: `use connector { tenant } with one of: ${rows.map((t) => t.slug).join(', ')}`,
      served: { tenant: null, model: null, needs: [] as string[], ms: Date.now() - t0 },
      holds: false as const,
      goal: 'OPEN' as const,
    }
  }

  const modelAsk = typeof args.model === 'string' ? args.model : typeof args.door === 'string' ? args.door : null
  const model = modelAsk ? tenant.models.find((m) => m.door === modelAsk) ?? null : tenant.models[0] ?? null

  let document: unknown = null
  if (tenant.slug === 'perma' && (args.full === true || args.document === true)) {
    const { permaTenantOf } = await import('./permaculture.js')
    document = permaTenantOf()
  }
  if ((tenant.slug === 'qpu' || tenant.host === unit.host) && args.point === true) {
    const { pointOf } = await import('./point.js')
    document = await pointOf()
  }

  return {
    kind: 'tenant' as const,
    call: `tools/call connector ${JSON.stringify({ tenant: tenant.slug, ...(modelAsk ? { model: modelAsk } : {}) })}` as const,
    endpoint: '/api/qpu/tenants' as const,
    tenant: {
      slug: tenant.slug,
      name: tenant.name,
      domain: tenant.domain,
      host: tenant.host,
      kind: tenant.kind,
      serves: tenant.serves,
      client: tenant.client,
      reserved: tenant.reserved,
      access: tenant.access,
      source: tenant.source,
    },
    models: tenant.models,
    needs: tenant.needs,
    model,
    document,
    familiesRegistered: qpuHexFamiliesOf().size,
    served: {
      tenant: tenant.slug,
      model: model?.door ?? null,
      needs: tenant.needs.map((n) => `${n.family}${n.formula ? `.${n.formula}` : ''}`),
      ms: Date.now() - t0,
    },
    connectBill: {
      doors: tools.length,
      bytes: listBytes,
      under16384: listBytes < 16384,
      qpuPrefixed: tools.filter((t) => t.name.startsWith('qpu_')).length,
    },
    harness: harnesses.url,
    holds: tenant.models.length > 0 && tenant.needs.some((n) => n.holds === true),
    goal: 'OPEN' as const,
  }
}

export const publicTenantsOf = async (request?: Request, env?: QpuEnv): Promise<Response> => {
  const url = request ? new URL(request.url) : null
  const tenant = url?.searchParams.get('tenant') ?? undefined
  const model = url?.searchParams.get('model') ?? undefined
  const list = url?.searchParams.get('tenants') === 'true' || (!tenant && !model)
  return Response.json(
    await tenantServeOf(list ? { tenants: true } : { ...(tenant ? { tenant } : {}), ...(model ? { model } : {}) }, env),
    { headers: { 'cache-control': 'public, max-age=0, s-maxage=30, stale-while-revalidate=120' } },
  )
}

export const tenantsPlugin = (): QpuPlugin => (config) => ({
  ...config,
  endpoints: [
    ...(config.endpoints ?? []),
    { path: '/qpu/tenants', method: 'get' as const, handler: async (req: Request) => publicTenantsOf(req) },
  ],
})
