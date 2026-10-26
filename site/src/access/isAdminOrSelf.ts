import type { Access, FieldAccess } from 'payload'

// req.user is a user or an MCP API key (the MCP plugin's auth collection): only a user carries roles
const rolesOf = (user: unknown): string[] => (user && typeof user === 'object' && 'roles' in user && Array.isArray((user as { roles?: unknown }).roles) ? ((user as { roles: string[] }).roles) : [])

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    // If user has role of 'admin'
    if (rolesOf(user).includes('admin')) {
      return true
    }

    // If any other type of user, only provide access to themselves
    return {
      id: {
        equals: user.id,
      },
    }
  }

  // Reject everyone else
  return false
}

export const isAdminOrSelfFieldLevel: FieldAccess = ({ id, req: { user } }) => {
  // Return true or false based on if the user has an admin role
  if (rolesOf(user).includes('admin')) {
    return true
  }
  if (user?.id === id) {
    return true
  }
  return false
}
