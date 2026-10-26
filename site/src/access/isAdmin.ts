import type { Access, FieldAccess } from 'payload'

// req.user is a user or an MCP API key (the MCP plugin's auth collection): only a user carries roles
const rolesOf = (user: unknown): string[] => (user && typeof user === 'object' && 'roles' in user && Array.isArray((user as { roles?: unknown }).roles) ? ((user as { roles: string[] }).roles) : [])

export const isAdmin: Access = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(rolesOf(user).includes('admin'))
}

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(rolesOf(user).includes('admin'))
}
