import type { Access } from 'payload'
import { adminOf } from './isAdmin'

export const publishedOnly: Access = ({ req: { user } }) => {
  if (adminOf(user)) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
