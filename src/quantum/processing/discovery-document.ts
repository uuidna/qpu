// The discovery document: what this tree serves, from the handler alone — the same at the Worker and at the Payload app; pure.
import { handle } from './mcp.ts'
import { listTools } from './toolbox.ts'
import { EXAMPLES } from './examples.ts'
import { LEADS } from './leads.ts'
import { LICENSE } from './unit/license.ts'
import { KEY } from './unit/theme.ts'
import { VERSION } from './unit/version.ts'
import { TENANTS, tenantOf } from './unit/tenants.ts'
import { DEFAULT_MCP_HOSTS } from './discovery.ts'
import { ROLES } from './unit/roles.ts'
import { createOpenapi } from './standards.ts'

/** RFC 9728: the protected-resource metadata of /mcp, from the names alone — the issuer the tenant binds (QPU_OAUTH_ISSUER_<TENANT>, selected
 *  in the Payload admin, valued in the Worker's environment), the docket roles as scopes; no issuer named means the pure tools need no token
 *  and the docket takes the tenant's tokens by name. The same at the Worker and at the app; pure. */
/** The simulator's stated bounds, the unit's whole quantum capacity: Shor's N, the qubits of the exact state vector, the bits and the nodes. Never
 *  more than the simulator has, and never a hardware claim. */
export const QUANTUM_BOUNDS = { shorN: 21, qubits: 6, bits: 8, nodes: 12 } as const
export const protectedResourceOf = (origin: string, env?: Record<string, unknown>) => {
  const tenant = tenantOf(new URL(origin).hostname)
  const issuerVar = `QPU_OAUTH_ISSUER_${tenant.toUpperCase()}`
  const issuer = (env as Record<string, string | undefined> | undefined)?.[issuerVar]
  return { resource: `${origin}/mcp`, authorization_servers: issuer ? [issuer] : [], scopes_supported: Object.keys(ROLES).map((r) => `docket:${r}`), bearer_methods_supported: ['header'], resource_documentation: `${origin}/.well-known/qpu.json`, 'x-qpu': { pure: 'every tool answers without a credential; only the docket roles are scoped', issuer: issuerVar, bound: Boolean(issuer), adapter: 'the connectors dimension of configure { kind: adapters }, managed per tenant in Payload (tenants.bindings)' } }
}

export const discoveryOf = (origin: string, env?: Record<string, unknown>) => {
  const tenant = tenantOf(new URL(origin).hostname)
  const version = VERSION
  const list = listTools({ handle }), names = list.map((t) => t.name)
  return {
    // the standard contract first: the document is an OpenAPI 3.1 document (openapi, info, servers, paths, components) the discover step detects as such, and the qpu fields stand beside
    ...createOpenapi(origin, list, [origin, ...Object.keys(TENANTS).map((h) => `https://${h}`).filter((u) => u !== origin)]),
    oauthProtectedResource: protectedResourceOf(origin, env),
    name: '@uuidna/qpu', kind: 'qpu', mcp: `${origin}/mcp`, docket: `${origin}/docket`, methods: ['initialize', 'tools/list', 'tools/call'],
    version, versioning: 'quantum: versions coexist — every block and every page is addressed by content, so an earlier version\'s addresses answer beside the new one\'s and a migration moves no address; the e2e gate reads each host\'s version and decodes hosts on different versions as copies of one value', tenant, tenants: Object.entries(TENANTS).map(([host, t]) => ({ host, tenant: t, docket: `https://${host}/docket` })), mcpHosts: (((env as Record<string, string | undefined> | undefined)?.[`QPU_MCP_HOSTS_${tenant.toUpperCase()}`]) ?? DEFAULT_MCP_HOSTS.join(',')).split(',').map((s) => s.trim()).filter(Boolean), mcpHostsNote: 'tenant configurable: QPU_MCP_HOSTS_<TENANT> names the MCP hosts this tenant discovers and extends; QPU_MCP_TOKEN_<HOST>_<TENANT> its token per host; Cloudflare\'s servers are discovered by default, the documentation one in the open, the others when the tenant brings its OAuth token', roles: ROLES, rbac: 'one Worker, one docket per tenant (host); roles asked of the RBAC MCP host when one is configured (a Payload MCP plugin managing every MCP server\'s roles over MCP itself), otherwise one writer and one admin token per tenant; a token at another tenant\'s host holds no role there and the answer names the procedure',
    tools: names, examples: EXAMPLES.length, leads: LEADS.length,
    bounds: { ...QUANTUM_BOUNDS, note: 'the exact state-vector simulator; every bound is in each tool\'s input schema' },
    key: KEY, license: { spdx: LICENSE.spdx, url: LICENSE.url, address: LICENSE.address, imprint: LICENSE.imprint, author: LICENSE.author, orcid: LICENSE.orcid },
    reverse: { host: 'uuidna.com', mcp: 'https://uuidna.com/mcp', note: 'this tree asks the unit for readiness, rights and auras each run; the unit fans out to this host' },
    honest: 'A pure handler over HTTP: no hardware, no network inside the tools, nothing factored beyond N ≤ 21.',
  }
}
