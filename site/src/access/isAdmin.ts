import type { Access, FieldAccess } from 'payload'

// req.user is a user or an MCP API key (the MCP plugin's auth collection): only a user carries roles
export const adminOf = (user: unknown): boolean => Array.isArray((user as { roles?: unknown } | null)?.roles) && (user as { roles: string[] }).roles.includes('admin')

export const isAdmin: Access = ({ req: { user } }) => adminOf(user)

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => adminOf(user)
