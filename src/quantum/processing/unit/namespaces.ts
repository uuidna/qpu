// Tenants as namespaces: the multi-tenant plugin keys every scoped record by its tenant, and a tenant needs no domain of its own — a
// namespace names it. Each app gets its own tenant, a sandbox: a request names the namespace (the x-qpu-namespace header, or the
// ?namespace= of a page), the credential's user is narrowed to that one tenant for the request — the intersection of the tenants the
// user holds with the one named, never more (a super admin is narrowed too, its all-tenants role dropped for the request) — so the
// plugin's own read filter and write check keep every other tenant's records out of reach. Pure: the decision here, the app applies it.
import { PROSE, proseFill } from '../prose-index.ts'
import { uuid } from '../../uuid/index.ts'

/** A DNS label is 63 octets at most (RFC 1035 §2.3.4): the standard's bound, not a cap of ours. */
const DNS_LABEL = 63
const NAMESPACE_HEADER = 'x-qpu-namespace'
const NAMESPACE_RE = /^[a-z][a-z0-9-]{1,62}$/
/** A namespace from a name or an app's address: lower-case letters, digits and dashes, starting with a letter. */
const toNamespace = (name: string) => { const s = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); const ns = /^[a-z]/.test(s) ? s : `ns-${s}`; return ns.slice(0, DNS_LABEL).replace(/-+$/, '') }

export type NarrowRequest = { requested?: string | null; tenants?: readonly { id: string; namespace?: string | null }[]; user?: { roles?: readonly string[]; tenants?: readonly { tenant: string; roles?: readonly string[] }[] } }
/** The credential narrowed to the namespace a request names: allowed with the one tenant row (and the roles without the all-tenants
 *  role), unchanged when no namespace is named, refused when the namespace is unknown or the user holds no row of it. */
export const narrowScope = (r: NarrowRequest) => {
  const ns = r.requested ?? null
  const roles = [...(r.user?.roles ?? [])], rows = [...(r.user?.tenants ?? [])]
  if (ns === null || ns === '') return { allowed: true as const, narrowed: false, namespace: null, tenant: null, roles, rows, says: PROSE.quantumProcessingUnitNamespaces_says1, theorem: 'textbook_namespace_narrows' }
  if (!NAMESPACE_RE.test(ns)) return { allowed: false as const, narrowed: false, namespace: ns, tenant: null, roles: [], rows: [], says: proseFill(PROSE.quantumProcessingUnitNamespaces_says2, ns), theorem: 'textbook_namespace_narrows' }
  const t = (r.tenants ?? []).find((x) => x.namespace === ns)
  if (!t) return { allowed: false as const, narrowed: false, namespace: ns, tenant: null, roles: [], rows: [], says: `no tenant has the namespace ${ns}`, theorem: 'textbook_namespace_narrows' }
  const superAdmin = roles.includes('admin'), row = rows.find((x) => x.tenant === t.id)
  if (!row && !superAdmin) return { allowed: false as const, narrowed: false, namespace: ns, tenant: t.id, roles: [], rows: [], says: proseFill(PROSE.quantumProcessingUnitNamespaces_says3, ns), theorem: 'textbook_namespace_narrows' }
  return { allowed: true as const, narrowed: true, namespace: ns, tenant: t.id, roles: roles.filter((x) => x !== 'admin'), rows: [row ?? { tenant: t.id, roles: ['tenant-admin'] }], says: proseFill(PROSE.quantumProcessingUnitNamespaces_says4, ns, superAdmin ? PROSE.quantumProcessingUnitNamespaces_s5 : ''), theorem: 'textbook_namespace_narrows' }
}

/** An app's sandbox planned: its tenant by namespace (no domain), the key its client holds, the header every request carries, and what is
 *  sandboxed (the scoped collections) and what stays shared (everything else, read as before). */
export const createSandbox = (r: { name?: string; app?: string; scoped?: readonly string[] }) => {
  const name = r.name ?? (r.app ? `app ${r.app.slice(0, 8)}` : null)
  if (!name) throw new Error(PROSE.quantumProcessingUnitNamespaces_s6)
  const namespace = toNamespace(r.app ? `app-${r.app.slice(0, 8)}` : name)
  const scoped = r.scoped ?? []
  return {
    namespace, id: uuid(JSON.stringify({ namespace })),
    tenant: { name, slug: namespace, namespace, domains: [], settings: { sandbox: true, ...(r.app ? { app: r.app } : {}) } },
    key: { label: `sandbox ${namespace}`, says: PROSE.quantumProcessingUnitNamespaces_says7, collections: Object.fromEntries(scoped.map((c) => [c, { find: true, create: true, update: c !== 'orders' }])) },
    header: { [NAMESPACE_HEADER]: namespace },
    writes: PROSE.quantumProcessingUnitNamespaces_writes8,
    measured: PROSE.quantumProcessingUnitNamespaces_measured9,
    sandboxed: scoped, shared: PROSE.quantumProcessingUnitNamespaces_shared10,
    acts: [PROSE.quantumProcessingUnitNamespaces_s11, PROSE.quantumProcessingUnitNamespaces_s12],
    says: proseFill(PROSE.quantumProcessingUnitNamespaces_says13, name, namespace, scoped.length, NAMESPACE_HEADER, namespace),
    theorem: 'textbook_namespace_narrows',
  }
}
