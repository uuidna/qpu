// The roles of the docket per tenant: what each may do, the header that carries it, how it is issued; pure.
import { hmacSha256, sameHex, utf8, hex } from './hmac.js'
export type Role = 'reader' | 'writer' | 'admin'
export const ROLES: Readonly<Record<Role, { may: string; header: string | null; issued: string }>> = {
  reader: { may: 'GET: read the docket, the discovery document, every tool over POST /mcp', header: null, issued: 'no token: every reader is a reader' },
  writer: { may: 'POST /docket: append entries, commitments and reveals to this tenant\'s docket', header: 'Authorization: Bearer <writer token of this tenant>', issued: 'by the author, one wrangler secret per tenant (QPU_WRITE_TOKEN_<TENANT>) or the shared QPU_WRITE_TOKEN' },
  admin: { may: 'DELETE /docket/<id>: delete an unlinked entry of this tenant\'s docket', header: 'Authorization: Bearer <admin token of this tenant>', issued: 'by the author, one wrangler secret per tenant (QPU_ADMIN_TOKEN_<TENANT>) or the shared QPU_ADMIN_TOKEN' },
}

/** The roles in order: a role may choose what a lower one may. */
export const ROLE_RANK: Readonly<Record<Role, number>> = { reader: 0, writer: 1, admin: 2 }
/** The enum values that write, per tool and property, with the role each needs; every other value is a read any role may choose. A table, not a
 *  guess from the word: "plan" starts a checkout in the stripe tool and only plans requests in the currency, patents and attest tools. */
const ENUM_POLICY: Readonly<Record<string, Readonly<Record<string, Role>>>> = {
  'mongo.op': { insert: 'writer', update: 'writer', mirror: 'writer', delete: 'admin' },
  'stripe.op': { plan: 'writer', webhook: 'writer', settle: 'admin' },
  'repository.workflow': { 'pre-commit': 'writer', 'commit-msg': 'writer', 'prepare-commit-msg': 'writer', 'post-commit': 'writer', ci: 'writer', 'pre-push': 'admin', 'pre-deploy': 'admin' },
}
/** Whether a role may choose a value of a tool's enum: the value's role at or below the caller's. */
export const mayChoose = (role: Role, tool: string, prop: string, value: unknown): boolean => ROLE_RANK[role] >= ROLE_RANK[ENUM_POLICY[`${tool}.${prop}`]?.[String(value)] ?? 'reader']

/** A role a request claims in a header counts only when signed: HMAC-SHA-256 under the deployment's secret (QPU_ROLE_SECRET) over
 *  role|tenant|METHOD. A header alone is no claim — anyone can send one — and without the secret configured no claim is honoured. */
const roleClaimMessageOf = (role: string, tenant: string, method: string) => `${role}|${tenant}|${method.toUpperCase()}`
export const roleMacOf = (secret: string, role: string, tenant: string, method: string) => hex(hmacSha256(utf8(secret), utf8(roleClaimMessageOf(role, tenant, method))))
export const signedRoleOf = (h: { role?: string | null; tenant?: string | null; mac?: string | null; method: string }, secret?: string | null): Role | null => {
  if (!secret || !h.role || !h.mac || !(h.role in ROLE_RANK)) return null
  return sameHex(roleMacOf(secret, h.role, h.tenant ?? '', h.method), h.mac.toLowerCase()) ? (h.role as Role) : null
}
