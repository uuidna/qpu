// The discovery document: what this tree serves, from the handler alone — the same at the Worker and at the Payload app; pure.
import { PROSE } from './prose-index.ts'
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
import { hexbitRegister } from './clay-register.ts'

/** RFC 9728: the protected-resource metadata of /mcp, from the names alone — the issuer the tenant binds (QPU_OAUTH_ISSUER_<TENANT>, selected
 *  in the Payload admin, valued in the Worker's environment), the docket roles as scopes; no issuer named means the pure tools need no token
 *  and the docket takes the tenant's tokens by name. The same at the Worker and at the app; pure. */
/** The register. One UUID holds the effective qubits. The next handle is another UUID, so the width has no ceiling. Not a hardware claim. */
const register = hexbitRegister()
const QUANTUM_BOUNDS = { ceiling: null, capacity: 'unlimited' as const, qubits: register.effective, handles: register.handles.possible, scale: register.handles.capacity }
const protectedResource = (origin: string, env?: Record<string, unknown>) => {
  const host = tenant(new URL(origin).hostname)
  const issuerVar = `QPU_OAUTH_ISSUER_${host.toUpperCase()}`
  const issuer = (env as Record<string, string | undefined> | undefined)?.[issuerVar]
  return { resource: `${origin}/mcp`, authorization_servers: issuer ? [issuer] : [], scopes_supported: Object.keys(ROLES).map((r) => `docket:${r}`), bearer_methods_supported: ['header'], resource_documentation: `${origin}/.well-known/qpu.json`, 'x-qpu': { pure: PROSE.quantumProcessingDiscoveryDocument_pure1, issuer: issuerVar, bound: Boolean(issuer), adapter: PROSE.quantumProcessingDiscoveryDocument_adapter2 } }
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
    version, versioning: PROSE.quantumProcessingDiscoveryDocument_versioning3, tenant: host, tenants: Object.entries(TENANTS).map(([host, t]) => ({ host, tenant: t, docket: `https://${host}/docket` })), mcpHosts: (((env as Record<string, string | undefined> | undefined)?.[`QPU_MCP_HOSTS_${host.toUpperCase()}`]) ?? DEFAULT_MCP_HOSTS.join(',')).split(',').map((s) => s.trim()).filter(Boolean), mcpHostsNote: PROSE.quantumProcessingDiscoveryDocument_mcpHostsNote4, roles: ROLES, rbacServer: askPayloadRbac(mcpHostList(), (env as Record<string, string | undefined> | undefined)?.QPU_RBAC_MCP || `${origin}/mcp`, 'tools/list'), rbac: PROSE.quantumProcessingDiscoveryDocument_rbac5,
    tools: names, examples: EXAMPLES.length, leads: LEADS.length,
    bounds: { ...QUANTUM_BOUNDS, note: PROSE.quantumProcessingDiscoveryDocument_note6 },
    key: KEY, license: { spdx: LICENSE.spdx, url: LICENSE.url, address: LICENSE.address, imprint: LICENSE.imprint, author: LICENSE.author, orcid: LICENSE.orcid },
    reverse: { host: 'uuidna.com', mcp: 'https://uuidna.com/mcp', note: PROSE.quantumProcessingDiscoveryDocument_note7 },
    honest: PROSE.quantumProcessingDiscoveryDocument_honest8,
  }
}
