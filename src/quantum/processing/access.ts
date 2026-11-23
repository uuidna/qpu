// The access model: abilities by role over a subject, scoped roles, cannot conditions that negate the where they bind, and the roles a
// tenant maps from Google Workspace groups. Pure: the answer is computed from the abilities, the roles and the document handed over.
import { PROSE, proseFill } from './prose-index.ts'
import { isObj } from './toolbox.ts'

export type Ability = { role: string; can: readonly string[]; subject: string; where?: Record<string, unknown>; cannot?: boolean }
export type ScopedRole = { name: string; resourceType?: string; resource?: string }
// Payload's Where has no general negation: a cannot with conditions negates field operators only (equals, in, exists)
const NEGATED: Readonly<Record<string, string>> = { equals: 'not_equals', not_equals: 'equals', in: 'not_in', not_in: 'in' }
// not (a and b) is (not a) or (not b): a condition over several fields negates into a disjunction of each negated
const negateWhere = (w: Record<string, unknown>): Record<string, unknown> => { const each = Object.entries(w).map(([field, ops]) => negateField({ [field]: ops })); return each.length === 1 ? each[0]! : { or: each } }
const negateField = (w: Record<string, unknown>): Record<string, unknown> => Object.fromEntries(Object.entries(w).map(([field, ops]) => { if (field === 'and' || field === 'or' || !isObj(ops)) throw new Error(proseFill(PROSE.quantumProcessingAccess_s1, field)); return [field, Object.fromEntries(Object.entries(ops).map(([op, v]) => (op === 'exists' ? [op, !v] : NEGATED[op] ? [NEGATED[op], v] : (() => { throw new Error(`a cannot condition cannot negate ${op}`) })())))] }))
export const getAccess = (abilities: readonly Ability[], roles: readonly ScopedRole[], subject: string, action: string, user: { id?: string | null; tenants?: readonly string[] } = {}): boolean | Record<string, unknown> => {
  const fill = (w?: Record<string, unknown>) => (w ? (JSON.parse(JSON.stringify(w).replace(/"\$(user|tenants)"/g, (_m, k: string) => JSON.stringify(k === 'user' ? (user.id ?? null) : (user.tenants ?? [])))) as Record<string, unknown>) : null)
  // a role held for this subject: everywhere (global), over the collection (its class), or on one document (its instance, an id condition)
  const scopes = (role: string) => (role === 'all' ? [null] : roles.filter((r) => r.name === role && (!r.resourceType || r.resourceType === subject)).map((r) => (r.resourceType && r.resource ? { id: { equals: r.resource } } : null)))
  const rules = (cannot: boolean) => abilities.filter((a) => !!a.cannot === cannot && (a.subject === subject || a.subject === 'all') && (a.can.includes(action) || a.can.includes('manage'))).flatMap((a) => scopes(a.role).map((scope) => [fill(a.where), scope].filter((w): w is Record<string, unknown> => !!w && Object.keys(w).length > 0)))
  const can = rules(false), cannot = rules(true)
  if (!can.length || cannot.some((ws) => ws.length === 0)) return false
  const allowed = can.some((ws) => ws.length === 0) ? null : { or: can.map((ws) => (ws.length === 1 ? ws[0]! : { and: ws })) }, denied = cannot.map((ws) => (ws.length === 1 ? negateWhere(ws[0]!) : { or: ws.map(negateWhere) })) // not (a and b) is (not a) or (not b)
  const all = [...(allowed ? [allowed] : []), ...denied]
  return all.length === 0 ? true : all.length === 1 ? all[0]! : { and: all }
}
/** CanCanCan's can? on one document: the access answer evaluated against it, the Where read as Payload reads it (and, or, dot paths, field
 *  operators), without recursion: a node is decided once its children are. */
export const valueAt = (doc: unknown, path: string): unknown => path.split('.').reduce<unknown>((v, k) => (isObj(v) ? (v as Record<string, unknown>)[k] : undefined), doc)
const fieldHolds = (doc: unknown, field: string, ops: Record<string, unknown>) => Object.entries(ops).every(([op, x]) => { const d = valueAt(doc, field)
  switch (op) { case 'equals': return d === x; case 'not_equals': return d !== x; case 'in': return Array.isArray(x) && x.includes(d); case 'not_in': return Array.isArray(x) && !x.includes(d); case 'exists': return (d !== undefined && d !== null) === Boolean(x); default: throw new Error(`no evaluation of the operator ${op}`) } })
const matchesWhere = (doc: unknown, root: Record<string, unknown>): boolean => {
  const decided = new Map<object, boolean>(), stack: Record<string, unknown>[] = [root]
  while (stack.length) { const n = stack[stack.length - 1]!, kids = Object.entries(n).flatMap(([k, v]) => (k === 'and' || k === 'or' ? (v as Record<string, unknown>[]) : [])), open = kids.filter((c) => !decided.has(c))
    if (open.length) { stack.push(...open); continue } stack.pop()
    decided.set(n, Object.entries(n).every(([k, v]) => (k === 'and' ? (v as object[]).every((c) => decided.get(c)) : k === 'or' ? (v as object[]).some((c) => decided.get(c)) : fieldHolds(doc, k, v as Record<string, unknown>)))) }
  return decided.get(root)!
}
export const checkAccess = (abilities: readonly Ability[], roles: readonly ScopedRole[], subject: string, action: string, doc: unknown, user: { id?: string | null; tenants?: readonly string[] } = {}): boolean => { const a = getAccess(abilities, roles, subject, action, user); return typeof a === 'boolean' ? a : matchesWhere(doc, a) }

/** Roles from Google Workspace: the groups the Admin SDK's Directory API lists for a user (groups.list by userKey, through the one Google door),
 *  each mapped by the tenant's table onto a scoped role; a group the table does not name grants nothing. Without the groups, the call to ask. */
export const listRolesFromGroups = (mapping: readonly (ScopedRole & { group: string })[], groups?: readonly { email?: string }[], userKey?: string) =>
  groups ? { phase: 'roles' as const, roles: groups.flatMap((g) => mapping.filter((r) => r.group === g.email).map(({ group: _g, ...role }) => role)) }
    : { phase: 'plan' as const, googleCall: { api: 'admin', version: 'directory_v1', method: 'groups.list', params: { userKey: userKey ?? '' } }, scope: 'admin.directory.group.readonly', says: PROSE.quantumProcessingAccess_says2 }

