// The roles of the docket per tenant: what each may do, the header that carries it, how it is issued; pure.
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
export const ENUM_POLICY: Readonly<Record<string, Readonly<Record<string, Role>>>> = {
  'mongo.op': { insert: 'writer', update: 'writer', delete: 'admin' },
  'stripe.op': { plan: 'writer', webhook: 'writer', settle: 'admin' },
  'repository.workflow': { 'pre-commit': 'writer', 'prepare-commit-msg': 'writer', 'post-commit': 'writer', ci: 'writer', 'pre-push': 'admin', 'pre-deploy': 'admin' },
}
/** Whether a role may choose a value of a tool's enum: the value's role at or below the caller's. */
export const mayChoose = (role: Role, tool: string, prop: string, value: unknown): boolean => ROLE_RANK[role] >= ROLE_RANK[ENUM_POLICY[`${tool}.${prop}`]?.[String(value)] ?? 'reader']
