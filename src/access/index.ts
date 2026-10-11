import type { Access, PayloadRequest } from 'payload'

export { publishedOnly } from './publishedOnly'

/** Anyone, signed in or not: the public site's content is read by everyone. */
export const anyone: Access = () => true

/** A signed-in user: Payload's default for what is written, made explicit so every collection states its RBAC. */
export const authenticated: Access = ({ req }) => Boolean(req.user)

/** Never: no caller, signed in or not. For an append-only, content-addressed ledger that must stay tamper-evident. */
export const never: Access = () => false

/** Only a super-admin. For destructive or cross-tenant operations no ordinary signed-in user may perform. */
export const superAdmin: Access = ({ req }) => (req.user as { role?: string } | null | undefined)?.role === 'super-admin'

/** An ACTIVE admin or super-admin. Content writes and the admin panel use this, so a role:'user' account cannot edit
 *  the CMS or enter /admin, and a deactivated account (active:false) is locked out even if it still holds a session. */
export const adminOrAbove: Access = ({ req }) => {
  const u = req.user as { role?: string; active?: boolean } | null | undefined
  return Boolean(u) && u!.active !== false && (u!.role === 'admin' || u!.role === 'super-admin')
}

/** The same rule as adminOrAbove, but returning a plain boolean — the signature CollectionConfig.access.admin requires
 *  (the admin-panel gate cannot be a query, only yes/no). Used to gate /admin to active admins and super-admins. */
export const canAccessAdmin = ({ req }: { req: PayloadRequest }): boolean => {
  const u = req.user as { role?: string; active?: boolean } | null | undefined
  return Boolean(u) && u?.active !== false && (u?.role === 'admin' || u?.role === 'super-admin')
}
