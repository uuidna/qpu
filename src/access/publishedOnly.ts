import type { Access } from 'payload'

/** Drafts are the editors': a signed-in user reads every version, the public reads what is published. */
export const publishedOnly: Access = ({ req }) => (req.user ? true : { _status: { equals: 'published' } })
