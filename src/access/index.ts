import type { Access } from 'payload'

export { publishedOnly } from './publishedOnly'

/** Anyone, signed in or not: the public site's content is read by everyone. */
export const anyone: Access = () => true

/** A signed-in user: Payload's default for what is written, made explicit so every collection states its RBAC. */
export const authenticated: Access = ({ req }) => Boolean(req.user)
