// Enterprise Authentication & Authorization System (WAVE 4)
// JWT tokens, role-based access control, user management

interface User {
  id: string
  email: string
  name: string
  passwordHash: string
  createdAt: Date
  lastLogin: Date
  isActive: boolean
  roles: string[]
  teams: string[]
}

interface Team {
  id: string
  name: string
  description: string
  owner: string
  members: Array<{ userId: string; role: 'admin' | 'member' | 'viewer' }>
  createdAt: Date
}

interface Role {
  name: string
  permissions: string[]
  description: string
}

interface JWTToken {
  token: string
  expiresAt: Date
  refreshToken: string
}

interface AuthContext {
  userId: string
  email: string
  roles: string[]
  teams: string[]
  permissions: Set<string>
  isAuthenticated: boolean
}

/**
 * User Management System
 */
export class UserManager {
  private users: Map<string, User> = new Map()
  private emailIndex: Map<string, string> = new Map()

  /**
   * Register new user
   */
  registerUser(email: string, password: string, name: string): User {
    if (this.emailIndex.has(email)) {
      throw new Error('Email already registered')
    }

    const userId = 'user_' + Math.random().toString(36).substr(2, 9)
    const passwordHash = this.hashPassword(password)

    const user: User = {
      id: userId,
      email,
      name,
      passwordHash,
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true,
      roles: ['user'], // Default role
      teams: []
    }

    this.users.set(userId, user)
    this.emailIndex.set(email, userId)

    return user
  }

  /**
   * Authenticate user with email/password
   */
  authenticateUser(email: string, password: string): User | null {
    const userId = this.emailIndex.get(email)
    if (!userId) return null

    const user = this.users.get(userId)
    if (!user) return null

    const passwordHash = this.hashPassword(password)
    if (user.passwordHash !== passwordHash) return null

    user.lastLogin = new Date()
    return user
  }

  /**
   * Get user by ID
   */
  getUser(userId: string): User | null {
    return this.users.get(userId) || null
  }

  /**
   * Update user profile
   */
  updateUser(userId: string, updates: Partial<User>): User {
    const user = this.users.get(userId)
    if (!user) throw new Error('User not found')

    Object.assign(user, updates)
    return user
  }

  /**
   * List all users (admin only)
   */
  listUsers(limit: number = 100): User[] {
    return Array.from(this.users.values()).slice(0, limit)
  }

  /**
   * Deactivate user
   */
  deactivateUser(userId: string): void {
    const user = this.users.get(userId)
    if (!user) throw new Error('User not found')

    user.isActive = false
  }

  private hashPassword(password: string): string {
    // Simplified hashing (use bcrypt in production)
    return Buffer.from(password).toString('base64')
  }
}

/**
 * Team Management System
 */
export class TeamManager {
  private teams: Map<string, Team> = new Map()

  /**
   * Create new team
   */
  createTeam(name: string, description: string, ownerId: string): Team {
    const teamId = 'team_' + Math.random().toString(36).substr(2, 9)

    const team: Team = {
      id: teamId,
      name,
      description,
      owner: ownerId,
      members: [{ userId: ownerId, role: 'admin' }],
      createdAt: new Date()
    }

    this.teams.set(teamId, team)
    return team
  }

  /**
   * Add member to team
   */
  addTeamMember(teamId: string, userId: string, role: 'admin' | 'member' | 'viewer'): Team {
    const team = this.teams.get(teamId)
    if (!team) throw new Error('Team not found')

    const existingMember = team.members.find((m) => m.userId === userId)
    if (existingMember) {
      existingMember.role = role
    } else {
      team.members.push({ userId, role })
    }

    return team
  }

  /**
   * Remove member from team
   */
  removeTeamMember(teamId: string, userId: string): void {
    const team = this.teams.get(teamId)
    if (!team) throw new Error('Team not found')

    team.members = team.members.filter((m) => m.userId !== userId)
  }

  /**
   * Get team
   */
  getTeam(teamId: string): Team | null {
    return this.teams.get(teamId) || null
  }

  /**
   * List teams for user
   */
  listUserTeams(userId: string): Team[] {
    return Array.from(this.teams.values()).filter((team) =>
      team.members.some((m) => m.userId === userId)
    )
  }

  /**
   * Get user role in team
   */
  getUserRoleInTeam(teamId: string, userId: string): 'admin' | 'member' | 'viewer' | null {
    const team = this.teams.get(teamId)
    if (!team) return null

    const member = team.members.find((m) => m.userId === userId)
    return member?.role || null
  }
}

/**
 * Role-Based Access Control (RBAC)
 */
export class RBACManager {
  private roles: Map<string, Role> = new Map()
  private userRoles: Map<string, Set<string>> = new Map()

  constructor() {
    this.initializeDefaultRoles()
  }

  /**
   * Initialize default roles
   */
  private initializeDefaultRoles(): void {
    this.createRole('admin', ['all'], 'Full system access')
    this.createRole('user', ['execute:circuits', 'view:results', 'train:models'], 'Standard user access')
    this.createRole('viewer', ['view:results', 'view:benchmarks'], 'Read-only access')
    this.createRole('scientist', [
      'execute:vqe',
      'execute:chemistry',
      'train:ml-models',
      'publish:papers'
    ], 'Quantum scientist access')
    this.createRole('member', ['execute:circuits', 'view:team-results'], 'Team member access')
  }

  /**
   * Create custom role
   */
  createRole(name: string, permissions: string[], description: string): Role {
    const role: Role = { name, permissions, description }
    this.roles.set(name, role)
    return role
  }

  /**
   * Assign role to user
   */
  assignRoleToUser(userId: string, roleName: string): void {
    if (!this.roles.has(roleName)) {
      throw new Error(`Role not found: ${roleName}`)
    }

    if (!this.userRoles.has(userId)) {
      this.userRoles.set(userId, new Set())
    }

    this.userRoles.get(userId)!.add(roleName)
  }

  /**
   * Check if user has permission
   */
  hasPermission(userId: string, permission: string): boolean {
    const roles = this.userRoles.get(userId)
    if (!roles) return false

    for (const roleName of roles) {
      const role = this.roles.get(roleName)
      if (!role) continue

      if (role.permissions.includes('all') || role.permissions.includes(permission)) {
        return true
      }

      // Check wildcard permissions
      if (role.permissions.some((p) => p.endsWith('*') && permission.startsWith(p.slice(0, -1)))) {
        return true
      }
    }

    return false
  }

  /**
   * Get all permissions for user
   */
  getUserPermissions(userId: string): Set<string> {
    const roles = this.userRoles.get(userId)
    const permissions = new Set<string>()

    if (!roles) return permissions

    for (const roleName of roles) {
      const role = this.roles.get(roleName)
      if (role) {
        role.permissions.forEach((p) => permissions.add(p))
      }
    }

    return permissions
  }

  /**
   * List all roles
   */
  listRoles(): Role[] {
    return Array.from(this.roles.values())
  }
}

/**
 * JWT Token Manager
 */
export class JWTTokenManager {
  private secretKey = 'secret-key-wave4' // Use environment variable in production
  private tokenBlacklist: Set<string> = new Set()

  /**
   * Generate JWT token
   */
  generateToken(userId: string, expiresIn: number = 3600): JWTToken {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + expiresIn * 1000)

    // Simplified JWT (use jsonwebtoken library in production)
    const payload = {
      userId,
      iat: Math.floor(now.getTime() / 1000),
      exp: Math.floor(expiresAt.getTime() / 1000)
    }

    const token = Buffer.from(JSON.stringify(payload)).toString('base64')
    const refreshToken = Buffer.from(JSON.stringify({ userId, type: 'refresh' })).toString('base64')

    return { token, expiresAt, refreshToken }
  }

  /**
   * Verify token
   */
  verifyToken(token: string): { userId: string } | null {
    if (this.tokenBlacklist.has(token)) {
      return null
    }

    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString())

      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null // Token expired
      }

      return { userId: payload.userId }
    } catch {
      return null
    }
  }

  /**
   * Revoke token
   */
  revokeToken(token: string): void {
    this.tokenBlacklist.add(token)
  }

  /**
   * Refresh token
   */
  refreshToken(refreshToken: string): JWTToken | null {
    try {
      const payload = JSON.parse(Buffer.from(refreshToken, 'base64').toString())

      if (payload.type !== 'refresh') {
        return null
      }

      return this.generateToken(payload.userId)
    } catch {
      return null
    }
  }
}

/**
 * Authentication Context Manager
 */
export class AuthContextManager {
  constructor(
    private userManager: UserManager,
    private teamManager: TeamManager,
    private rbacManager: RBACManager
  ) {}

  /**
   * Create auth context for user
   */
  createAuthContext(userId: string): AuthContext {
    const user = this.userManager.getUser(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const teams = this.teamManager.listUserTeams(userId).map((t) => t.id)
    const permissions = this.rbacManager.getUserPermissions(userId)

    return {
      userId,
      email: user.email,
      roles: user.roles,
      teams,
      permissions,
      isAuthenticated: true
    }
  }

  /**
   * Check if user can access resource in team
   */
  canAccessTeamResource(userId: string, teamId: string): boolean {
    const role = this.teamManager.getUserRoleInTeam(teamId, userId)
    return role !== null
  }

  /**
   * Check if user can perform action
   */
  canPerformAction(userId: string, action: string): boolean {
    return this.rbacManager.hasPermission(userId, action)
  }
}

export { User, Team, Role, JWTToken, AuthContext }
