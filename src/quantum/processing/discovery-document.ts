// The discovery document: what this tree serves, from the handler alone — the same at the Worker and at the Payload app; pure.
import { handle } from './mcp.ts'
import { listTools } from './toolbox.ts'
import { EXAMPLES } from './examples.ts'
import { LEADS } from './leads.ts'
import { LICENSE } from './unit/license.ts'
import { KEY } from './unit/theme.ts'
import { VERSION } from './unit/version.ts'
import { TENANTS, tenant } from './unit/tenants.ts'
import { DEFAULT_MCP_HOSTS, mcpHostList } from './discovery.ts'
import { askPayloadRbac } from './api-mcp-rbac.ts'
import { ROLES } from './unit/roles.ts'
import { createOpenapi } from './standards.ts'
import { uuidQubits } from '../uuid/index.ts'
import { AXIOMS } from './clay-register.ts'

/** RFC 9728: the protected-resource metadata of /mcp, from the names alone — the issuer the tenant binds (QPU_OAUTH_ISSUER_<TENANT>, selected
 *  in the Payload admin, valued in the Worker's environment), the docket roles as scopes; no issuer named means the pure tools need no token
 *  and the docket takes the tenant's tokens by name. The same at the Worker and at the app; pure. */
/** The register. One UUID holds the effective qubits. The next handle is another UUID, so the width has no ceiling. Not a hardware claim. */
const register = uuidQubits(AXIOMS.find((row) => row.name === 'hexbit')!.value)
const QUANTUM_BOUNDS = { ceiling: null, capacity: 'unlimited' as const, qubits: register.effective, handles: register.handles.possible, scale: register.handles.capacity }
const protectedResource = (origin: string, env?: Record<string, unknown>) => {
  const host = tenant(new URL(origin).hostname)
  const issuerVar = `QPU_OAUTH_ISSUER_${host.toUpperCase()}`
  const issuer = (env as Record<string, string | undefined> | undefined)?.[issuerVar]
  return { resource: `${origin}/mcp`, authorization_servers: issuer ? [issuer] : [], scopes_supported: Object.keys(ROLES).map((r) => `docket:${r}`), bearer_methods_supported: ['header'], resource_documentation: `${origin}/.well-known/qpu.json`, 'x-qpu': { pure: 'every tool answers without a credential; only the docket roles are scoped', issuer: issuerVar, bound: Boolean(issuer), adapter: 'the connectors dimension of configure { kind: adapters }, managed per tenant in Payload (tenants.bindings)' } }
}

export const discovery = (origin: string, env?: Record<string, unknown>) => {
  const host = tenant(new URL(origin).hostname)
  const version = VERSION
  const list = listTools({ handle }), names = list.map((t) => t.name)
  return {
    // the standard contract first: the document is an OpenAPI 3.1 document (openapi, info, servers, paths, components) the discover step detects as such, and the qpu fields stand beside
    ...createOpenapi(origin, list, [origin, ...Object.keys(TENANTS).map((h) => `https://${h}`).filter((u) => u !== origin)]),
    oauthProtectedResource: protectedResource(origin, env),
    name: '@uuidna/qpu', kind: 'qpu', mcp: `${origin}/mcp`, docket: `${origin}/docket`, methods: ['initialize', 'tools/list', 'tools/call'],
    version, versioning: 'quantum: versions coexist — every block and every page is addressed by content, so an earlier version\'s addresses answer beside the new one\'s and a migration moves no address; the e2e gate reads each host\'s version and decodes hosts on different versions as copies of one value', tenant: host, tenants: Object.entries(TENANTS).map(([host, t]) => ({ host, tenant: t, docket: `https://${host}/docket` })), mcpHosts: (((env as Record<string, string | undefined> | undefined)?.[`QPU_MCP_HOSTS_${host.toUpperCase()}`]) ?? DEFAULT_MCP_HOSTS.join(',')).split(',').map((s) => s.trim()).filter(Boolean), mcpHostsNote: 'tenant configurable: QPU_MCP_HOSTS_<TENANT> names the doors of the one Payload RBAC MCP; QPU_MCP_TOKEN_<HOST>_<TENANT> its token per door; the Worker asks QPU_RBAC_MCP first', roles: ROLES, rbacServer: askPayloadRbac(mcpHostList(), (env as Record<string, string | undefined> | undefined)?.QPU_RBAC_MCP || `${origin}/mcp`, 'tools/list'), rbac: 'one Worker asks the one Payload RBAC MCP first (QPU_RBAC_MCP, tool payload as QPU_RBAC_TOOL). Every other host is a door of that server. A token at another tenant\'s host holds no role there',
    tools: names, examples: EXAMPLES.length, leads: LEADS.length,
    bounds: { ...QUANTUM_BOUNDS, note: 'one UUID holds the effective qubits. The next handle is another UUID, so the width has no ceiling' },
    key: KEY, license: { spdx: LICENSE.spdx, url: LICENSE.url, address: LICENSE.address, imprint: LICENSE.imprint, author: LICENSE.author, orcid: LICENSE.orcid },
    reverse: { host: 'uuidna.com', mcp: 'https://uuidna.com/mcp', note: 'this tree asks the unit for readiness, rights and auras each run; the unit fans out to this host' },
    honest: 'A pure handler over HTTP: no hardware, no network inside the tools. The register has no width ceiling; a cofactor whose factors are not found is named, not invented.',
  }
}
