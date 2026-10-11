import type { Access } from 'payload'

export { publishedOnly } from './publishedOnly'

/** Anyone, signed in or not: the public site's content is read by everyone. */
export const anyone: Access = () => true

/** A signed-in user: Payload's default for what is written, made explicit so every collection states its RBAC. */
export const authenticated: Access = ({ req }) => Boolean(req.user)

/** Never: no caller, signed in or not. For an append-only, content-addressed ledger that must stay tamper-evident. */
export const never: Access = () => false

/** Only a super-admin. For destructive or cross-tenant operations no ordinary signed-in user may perform. */
export const superAdmin: Access = ({ req }) => (req.user as { role?: string } | null | undefined)?.role === 'super-admin'
