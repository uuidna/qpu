// Payload MCP RBAC for every API and every MCP. A read is anyone's, a create is an editor or a writer, an update or a delete
// is manage (tenant-admin, admin). The decision is getAccess, the same CanCanCan table the MCP plugin asks first.
import { BATCH_ACTIONS, OPERATIONS } from './payload-vocabulary.ts'
import { getAccess, type Ability } from './toolboxes/payload.ts'

const ROLES = ['viewer', 'reader', 'editor', 'writer', 'tenant-admin', 'admin'] as const
const ABILITIES: Ability[] = (['apis', 'mcps'] as const).flatMap((subject) => [
  { role: 'viewer', can: ['read'], subject },
  { role: 'reader', can: ['read'], subject },
  { role: 'editor', can: ['read', 'create'], subject },
  { role: 'writer', can: ['read', 'create'], subject },
  { role: 'tenant-admin', can: ['manage'], subject },
  { role: 'admin', can: ['manage'], subject },
])

const actionOfCall = (method: string): (typeof OPERATIONS)[number] => {
  const m = method.toLowerCase()
  if (m === 'get' || m === 'head' || m === 'tools/list' || m === 'resources/read' || m === 'resources/list' || m === 'ping') return 'read'
  if (m === 'put' || m === 'patch') return 'update'
  return m === 'delete' ? 'delete' : 'create'
}

const roleForCall = (action: (typeof OPERATIONS)[number], claimed?: string): string => claimed ?? (action === 'read' ? 'reader' : action === 'create' ? 'writer' : 'admin')

export const decideApiMcp = (subject: 'apis' | 'mcps', action: string, role: string): boolean => {
  if (!(ROLES as readonly string[]).includes(role)) return false
  return getAccess(ABILITIES, [{ name: role }], subject, action) === true
}

export const rbac = (subject: 'apis' | 'mcps', method: string, claimed?: string) => {
  const action = actionOfCall(method)
  const role = roleForCall(action, claimed)
  return { subject, action, role, access: decideApiMcp(subject, action, role), managedBy: 'payload-mcp' as const }
}

const fillGrant = (subject: 'apis' | 'mcps') => Object.fromEntries(ROLES.map((role) => [role, { ...Object.fromEntries(OPERATIONS.map((op) => [op, decideApiMcp(subject, op, role)])), batch: Object.fromEntries(BATCH_ACTIONS.map((b) => [b.action, decideApiMcp(subject, b.action, role)])) }]))
const GRANTS: { apis?: ReturnType<typeof fillGrant>; mcps?: ReturnType<typeof fillGrant> } = {}
export const grant = (subject: 'apis' | 'mcps') => GRANTS[subject] ??= fillGrant(subject)

/** The Worker asks this host first. The tool on it is payload. */
const RBAC_MCP = 'QPU_RBAC_MCP'
const RBAC_TOOL = 'QPU_RBAC_TOOL'

/** One call, asked of the one Payload RBAC MCP before any other host. A known URL is a door. The mcps grant decides the method. */
export const askPayloadRbac = (hosts: readonly { name: string; url: string }[], target: string, method: string, claimed?: string) => {
  const door = hosts.find((row) => row.url === target || row.name === target) ?? null
  const decision = rbac('mcps', method, claimed)
  return {
    server: 'payload-rbac' as const, one: true as const, first: true as const, managedBy: 'payload-mcp' as const,
    asked: RBAC_MCP, tool: 'payload' as const, named: RBAC_TOOL,
    host: door?.url ?? null, door: door?.name ?? null, found: door !== null,
    subject: decision.subject, action: decision.action, role: decision.role, access: decision.access,
  }
}

/** Every named MCP host as a door of the one Payload RBAC MCP. The grant is the mcps grant. A call is allowed when that grant allows it. */
export const payloadRbacMcp = (hosts: readonly { name: string; url: string }[]) => {
  const doors = hosts.map((host) => ({ name: host.name, url: host.url, server: 'payload-rbac' as const, subject: 'mcps' as const, rbac: rbac('mcps', 'tools/list') }))
  const urls = new Set(doors.map((door) => door.url))
  return {
    server: 'payload-rbac' as const, one: true as const, managedBy: 'payload-mcp' as const, subject: 'mcps' as const,
    grant: grant('mcps'), hosts: doors.length, doors,
    merged: doors.length > 0 && urls.size === doors.length && doors.every((door) => door.rbac.managedBy === 'payload-mcp' && door.rbac.subject === 'mcps' && door.rbac.access),
  }
}

/** The batch actions for one role: each operation over many documents, allowed exactly when that operation is allowed. */
export const decideBatch = (subject: 'apis' | 'mcps', role: string) => {
  const calls = BATCH_ACTIONS.map((batch) => ({ action: batch.action, rest: batch.rest, mcp: batch.mcp, where: batch.where, access: decideApiMcp(subject, batch.action, role) }))
  return { subject, action: 'batch' as const, role, calls, access: calls.every((c) => c.access), managedBy: 'payload-mcp' as const, ...(subject === 'mcps' ? { server: 'payload-rbac' as const, one: true as const, first: true as const } : {}) }
}
