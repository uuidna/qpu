// The QPU: the quantum processing unit. Its proofs are the Lean kernel beside this file (./lean), its compute is the
// quantum core (../../blocks.ts) served over MCP (../../mcp.ts). This index is the unit's own surface: the one unscoped
// account (qpu.uuidna.com), and the pure resolver that scopes it down to a tenant by either address — the subdomain
// <slug>.uuidna.com or the internal path qpu.uuidna.com/<slug>/. Pure: host and path in, the tenant address out.

import { VERSION } from './version.ts'

/** The unit's origin: the main UNSCOPED account — every tenant, the super-admin view. Never itself a tenant. */
export const QPU_ORIGIN = 'qpu.uuidna.com'
/** The apex the tenant subdomains live under. */
export const QPU_APEX = 'uuidna.com'
/** Where the unit's proofs are published; the client reads the module and builds it with lake. */
export const QPU_LEAN = 'https://github.com/uuidna/qpu/blob/main/src/quantum/processing/unit/lean'
/** First path segments that belong to the app's own routes: resolved before any tenant, never a tenant slug. */
export const RESERVED_SEGMENTS: ReadonlySet<string> = new Set(['admin', 'api', '_next', 'static', 'favicon.ico'])

/** A tenant address segment is a slug (letter-first) or a hex handle (the UUID head) — the same form the subdomain takes. */
const isSegment = (s: string): boolean => /^[a-z][a-z0-9-]*$/.test(s) || /^[0-9a-f]{8}$/.test(s)

/** How the address was reached: a tenant by subdomain or by origin path, the unscoped origin account, or not the unit. */
export type AddressVia = 'subdomain' | 'origin-path' | 'origin-unscoped' | 'none'
/** The tenant a request names, with both of its equal addresses; slug null is the unscoped origin account. */
export type TenantAddress = { slug: string | null; subdomain: string | null; internalPath: string | null; via: AddressVia }

/**
 * The unit resolving itself: from EITHER address to the same tenant, the slug (the UUID head) the invariant.
 *   <slug>.uuidna.com            -> { slug, via: 'subdomain' }
 *   qpu.uuidna.com/<slug>/...     -> { slug, via: 'origin-path' }      (the internal alias of the subdomain)
 *   qpu.uuidna.com (no segment)   -> { slug: null, via: 'origin-unscoped' }   (the main unscoped account)
 * A reserved first segment under the origin defers to the app's routes, so it stays unscoped, not a tenant.
 */
export const tenantAddressOf = (host: string, pathname: string = '/'): TenantAddress => {
  const h = (host || '').split(':')[0].toLowerCase()
  // form A — the subdomain <slug>.uuidna.com (the origin qpu.uuidna.com is excluded: it is the unscoped account, handled below)
  if (h !== QPU_ORIGIN && h.endsWith('.' + QPU_APEX)) {
    const sub = h.slice(0, -('.' + QPU_APEX).length)
    if (sub && sub !== 'qpu' && !sub.includes('.') && isSegment(sub)) return { slug: sub, subdomain: `${sub}.${QPU_APEX}`, internalPath: `/${sub}/`, via: 'subdomain' }
    return { slug: null, subdomain: null, internalPath: null, via: 'origin-unscoped' }
  }
  // form B — the internal path qpu.uuidna.com/<slug>/ (and the apex / a local host serve the same unit)
  if (h === QPU_ORIGIN || h === QPU_APEX || /^(localhost|127\.0\.0\.1)$/.test(h)) {
    const seg = (pathname || '/').split('/').filter(Boolean)[0]
    if (seg && !RESERVED_SEGMENTS.has(seg) && isSegment(seg)) return { slug: seg, subdomain: `${seg}.${QPU_APEX}`, internalPath: `/${seg}/`, via: 'origin-path' }
    return { slug: null, subdomain: null, internalPath: null, via: 'origin-unscoped' }
  }
  return { slug: null, subdomain: null, internalPath: null, via: 'none' }
}

/** The unscoped main account answers when no tenant is named and the host is the unit's own. */
export const isUnscoped = (a: TenantAddress): boolean => a.via === 'origin-unscoped'

/** The quantum processing unit named whole: its origin, version, kernel, and the two equal tenant-address forms. */
export const QPU = {
  origin: QPU_ORIGIN,
  apex: QPU_APEX,
  version: VERSION,
  kernel: QPU_LEAN,
  unscoped: `${QPU_ORIGIN} is the main unscoped account: every tenant, super-admin; never a tenant`,
  address: '<slug>.uuidna.com == qpu.uuidna.com/<slug>/ ; slug = the UUID head, the invariant',
  resolve: tenantAddressOf,
} as const
