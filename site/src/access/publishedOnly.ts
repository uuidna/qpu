import type { Access } from 'payload'
// req.user is a user or an MCP API key (the MCP plugin's auth collection): only a user carries roles
const rolesOf = (user: unknown): string[] => (user && typeof user === 'object' && 'roles' in user && Array.isArray((user as { roles?: unknown }).roles) ? ((user as { roles: string[] }).roles) : [])


export const publishedOnly: Access = ({ req: { user } }) => {
  if (rolesOf(user).includes('admin')) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
