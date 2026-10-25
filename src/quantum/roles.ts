// The roles of the docket per tenant: what each may do, the header that carries it, how it is issued; pure.
export type Role = 'reader' | 'writer' | 'admin'
export const ROLES: Readonly<Record<Role, { may: string; header: string | null; issued: string }>> = {
  reader: { may: 'GET: read the docket, the discovery document, every tool over POST /mcp', header: null, issued: 'no token: every reader is a reader' },
  writer: { may: 'POST /docket: append entries, commitments and reveals to this tenant\'s docket', header: 'Authorization: Bearer <writer token of this tenant>', issued: 'by the author, one wrangler secret per tenant (QPU_WRITE_TOKEN_<TENANT>) or the shared QPU_WRITE_TOKEN' },
  admin: { may: 'DELETE /docket/<id>: delete an unlinked entry of this tenant\'s docket', header: 'Authorization: Bearer <admin token of this tenant>', issued: 'by the author, one wrangler secret per tenant (QPU_ADMIN_TOKEN_<TENANT>) or the shared QPU_ADMIN_TOKEN' },
}
