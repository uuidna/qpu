// WAVE 8D: Authorization Engine (RBAC + ABAC)
// Field-level access control, attribute-based policies, row-level security

/**
 * Data Classification levels
 */
export enum DataClassification {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  SENSITIVE = 'sensitive',
  PII = 'pii',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted'
}

/**
 * Field metadata with security classification
 */
export interface FieldMetadata {
  name: string
  type: string
  classification: DataClassification
  piiType?: 'email' | 'phone' | 'ssn' | 'passport' | 'credit_card' | 'health' | 'location' | 'custom'
  encrypted: boolean
  requiresAudit: boolean
  retentionDays?: number
  ownershipField?: string // Field that contains the owner/user ID
}

/**
 * Resource definition with field-level security
 */
export interface ResourceDefinition {
  name: string
  fields: Map<string, FieldMetadata>
  ownershipField: string // Which field determines ownership
  defaultClassification: DataClassification
}

/**
 * Attribute-based access control (ABAC) policy
 */
export interface ABACPolicy {
  id: string
  name: string
  resource: string
  actions: string[] // e.g., 'read', 'write', 'delete'
  effect: 'allow' | 'deny'
  conditions: ABACCondition[]
  priority: number
}

/**
 * ABAC condition
 */
export interface ABACCondition {
  attribute: string // e.g., 'user.department', 'resource.owner', 'environment.time'
  operator: 'equals' | 'not_equals' | 'contains' | 'starts_with' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: any
}

/**
 * Row-level security (RLS) policy
 */
export interface RLSPolicy {
  id: string
  tableName: string
  policyName: string
  using: string // SQL WHERE clause or predicate function
  check?: string // Optional: for INSERT/UPDATE
  roles: string[]
}

/**
 * Authorization context
 */
export interface AuthorizationContext {
  userId: string
  email: string
  roles: string[]
  attributes: Map<string, any> // user, department, team, etc.
  permissions: Set<string>
  teams: string[]
  ipAddress?: string
  timestamp: Date
}

/**
 * Field authorization result
 */
export interface FieldAuthResult {
  fieldName: string
  canRead: boolean
  canWrite: boolean
  canDelete: boolean
  maskingRequired: boolean
  encryptionRequired: boolean
  reason?: string
}

/**
 * Authorization Engine
 */
export class AuthorizationEngine {
  private rbacRoles: Map<string, RoleDefinition> = new Map()
  private abacPolicies: Map<string, ABACPolicy[]> = new Map()
  private rlsPolicies: Map<string, RLSPolicy[]> = new Map()
  private resourceDefinitions: Map<string, ResourceDefinition> = new Map()
  private fieldPermissions: Map<string, Map<string, FieldPermission[]>> = new Map()

  constructor() {
    this.initializeDefaultRoles()
  }

  /**
   * Initialize default RBAC roles
   */
  private initializeDefaultRoles(): void {
    // Admin: Full access
    this.defineRole('admin', {
      name: 'admin',
      description: 'Administrator with full access',
      permissions: ['*'],
      dataAccessLevel: 'all',
      fieldAccessLevel: 'all'
    })

    // Data Owner: Can access own data
    this.defineRole('data_owner', {
      name: 'data_owner',
      description: 'Can access and manage own data',
      permissions: ['read:own', 'write:own', 'delete:own', 'view:audit'],
      dataAccessLevel: 'owner',
      fieldAccessLevel: 'owned'
    })

    // Data Analyst: Read-only access with restrictions
    this.defineRole('data_analyst', {
      name: 'data_analyst',
      description: 'Can read non-sensitive data',
      permissions: ['read:public', 'read:internal', 'view:reports'],
      dataAccessLevel: 'team',
      fieldAccessLevel: 'limited'
    })

    // Viewer: Minimal read-only access
    this.defineRole('viewer', {
      name: 'viewer',
      description: 'Read-only public data access',
      permissions: ['read:public'],
      dataAccessLevel: 'public',
      fieldAccessLevel: 'public'
    })

    // DPA (Data Protection Officer): Compliance monitoring
    this.defineRole('dpa', {
      name: 'dpa',
      description: 'Data Protection Officer - compliance oversight',
      permissions: ['read:audit', 'read:compliance', 'export:data', 'manage:retention'],
      dataAccessLevel: 'all',
      fieldAccessLevel: 'audit'
    })

    // Security Officer: Security-focused access
    this.defineRole('security_officer', {
      name: 'security_officer',
      description: 'Security oversight and threat response',
      permissions: ['read:audit', 'manage:access', 'view:encryption', 'respond:threats'],
      dataAccessLevel: 'all',
      fieldAccessLevel: 'security'
    })
  }

  /**
   * Define a new RBAC role with field access levels
   */
  defineRole(
    roleName: string,
    definition: {
      name: string
      description: string
      permissions: string[]
      dataAccessLevel: 'all' | 'owner' | 'team' | 'public'
      fieldAccessLevel: 'all' | 'owned' | 'limited' | 'public' | 'audit' | 'security'
    }
  ): void {
    this.rbacRoles.set(roleName, definition as RoleDefinition)
  }

  /**
   * Register a resource with field-level security metadata
   */
  registerResource(resource: ResourceDefinition): void {
    this.resourceDefinitions.set(resource.name, resource)
  }

  /**
   * Add ABAC policy
   */
  addABACPolicy(policy: ABACPolicy): void {
    if (!this.abacPolicies.has(policy.resource)) {
      this.abacPolicies.set(policy.resource, [])
    }
    this.abacPolicies.get(policy.resource)!.push(policy)
    // Sort by priority (higher = first)
    this.abacPolicies.get(policy.resource)!.sort((a, b) => b.priority - a.priority)
  }

  /**
   * Add row-level security policy
   */
  addRLSPolicy(policy: RLSPolicy): void {
    const key = `${policy.tableName}:${policy.policyName}`
    if (!this.rlsPolicies.has(policy.tableName)) {
      this.rlsPolicies.set(policy.tableName, [])
    }
    this.rlsPolicies.get(policy.tableName)!.push(policy)
  }

  /**
   * Define field-level permissions for a role on a resource
   */
  defineFieldPermissions(
    resourceName: string,
    roleName: string,
    permissions: FieldPermission[]
  ): void {
    const key = `${resourceName}:${roleName}`
    if (!this.fieldPermissions.has(key)) {
      this.fieldPermissions.set(key, [])
    }
    this.fieldPermissions.set(key, permissions)
  }

  /**
   * Check if user can perform action on resource
   */
  canPerformAction(context: AuthorizationContext, resource: string, action: string): boolean {
    // Check RBAC
    for (const role of context.roles) {
      const roleDefinition = this.rbacRoles.get(role)
      if (roleDefinition) {
        if (
          roleDefinition.permissions.includes('*') ||
          roleDefinition.permissions.includes(`${action}:*`) ||
          roleDefinition.permissions.includes(`${action}:${resource}`)
        ) {
          // Check ABAC policies
          if (this.evaluateABACPolicies(context, resource, action)) {
            return true
          }
        }
      }
    }
    return false
  }

  /**
   * Evaluate ABAC policies
   */
  private evaluateABACPolicies(context: AuthorizationContext, resource: string, action: string): boolean {
    const policies = this.abacPolicies.get(resource) || []

    for (const policy of policies) {
      if (!policy.actions.includes(action)) continue

      const allConditionsMet = policy.conditions.every((condition) => this.evaluateCondition(context, condition))

      if (allConditionsMet) {
        return policy.effect === 'allow'
      }
    }

    return true // If no matching policies, allow by default
  }

  /**
   * Evaluate a single ABAC condition
   */
  private evaluateCondition(context: AuthorizationContext, condition: ABACCondition): boolean {
    const actualValue = this.getAttributeValue(context, condition.attribute)

    switch (condition.operator) {
      case 'equals':
        return actualValue === condition.value
      case 'not_equals':
        return actualValue !== condition.value
      case 'contains':
        return String(actualValue).includes(String(condition.value))
      case 'starts_with':
        return String(actualValue).startsWith(String(condition.value))
      case 'greater_than':
        return actualValue > condition.value
      case 'less_than':
        return actualValue < condition.value
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(actualValue)
      case 'not_in':
        return !Array.isArray(condition.value) || !condition.value.includes(actualValue)
      default:
        return false
    }
  }

  /**
   * Get attribute value from context
   */
  private getAttributeValue(context: AuthorizationContext, path: string): any {
    const parts = path.split('.')
    let value: any = {
      user: { id: context.userId, email: context.email, roles: context.roles },
      environment: { time: new Date() }
    }

    for (const part of parts) {
      value = value[part]
      if (value === undefined) return null
    }

    return value
  }

  /**
   * Check field-level authorization
   */
  async checkFieldAuthorization(
    context: AuthorizationContext,
    resourceName: string,
    fieldName: string,
    action: 'read' | 'write' | 'delete'
  ): Promise<FieldAuthResult> {
    const resource = this.resourceDefinitions.get(resourceName)
    if (!resource) {
      return {
        fieldName,
        canRead: false,
        canWrite: false,
        canDelete: false,
        maskingRequired: false,
        encryptionRequired: false,
        reason: 'Resource not found'
      }
    }

    const fieldMeta = resource.fields.get(fieldName)
    if (!fieldMeta) {
      return {
        fieldName,
        canRead: false,
        canWrite: false,
        canDelete: false,
        maskingRequired: false,
        encryptionRequired: false,
        reason: 'Field not found'
      }
    }

    // Check data classification access
    const classification = fieldMeta.classification
    let canAccess = this.canAccessClassification(context, classification)

    // Check field-specific permissions
    if (canAccess) {
      for (const role of context.roles) {
        const fieldPermissions = this.fieldPermissions.get(`${resourceName}:${role}`)
        if (fieldPermissions) {
          const permission = fieldPermissions.find((p) => p.fieldName === fieldName)
          if (permission) {
            if (action === 'read' && !permission.canRead) canAccess = false
            if (action === 'write' && !permission.canWrite) canAccess = false
            if (action === 'delete' && !permission.canDelete) canAccess = false
            break
          }
        }
      }
    }

    return {
      fieldName,
      canRead: canAccess && (action === 'read' || this.canPerformAction(context, resourceName, 'read')),
      canWrite: canAccess && (action === 'write' || this.canPerformAction(context, resourceName, 'write')),
      canDelete: canAccess && (action === 'delete' || this.canPerformAction(context, resourceName, 'delete')),
      maskingRequired:
        !this.hasHighPrivilege(context) &&
        (classification === DataClassification.PII || classification === DataClassification.SENSITIVE),
      encryptionRequired: fieldMeta.encrypted,
      reason: canAccess ? undefined : `Insufficient access for ${classification} data`
    }
  }

  /**
   * Check if user can access data classification
   */
  private canAccessClassification(context: AuthorizationContext, classification: DataClassification): boolean {
    // Admins can access everything
    if (context.roles.includes('admin')) return true

    // DPA and Security Officers can access all for audit
    if (context.roles.includes('dpa') || context.roles.includes('security_officer')) return true

    switch (classification) {
      case DataClassification.PUBLIC:
        return true
      case DataClassification.INTERNAL:
        return context.roles.some((r) => ['admin', 'data_owner', 'data_analyst', 'dpa'].includes(r))
      case DataClassification.SENSITIVE:
        return context.roles.some((r) => ['admin', 'data_owner', 'security_officer'].includes(r))
      case DataClassification.PII:
        return context.roles.some((r) => ['admin', 'data_owner', 'dpa'].includes(r))
      case DataClassification.CONFIDENTIAL:
        return context.roles.some((r) => ['admin', 'data_owner'].includes(r))
      case DataClassification.RESTRICTED:
        return context.roles.includes('admin')
      default:
        return false
    }
  }

  /**
   * Check if user has high privilege
   */
  private hasHighPrivilege(context: AuthorizationContext): boolean {
    return context.roles.some((r) => ['admin', 'dpa', 'data_owner'].includes(r))
  }

  /**
   * Get row-level security predicate for user
   */
  getRLSPredicate(context: AuthorizationContext, tableName: string): string | null {
    const policies = this.rlsPolicies.get(tableName) || []

    for (const policy of policies) {
      if (policy.roles.some((r) => context.roles.includes(r))) {
        return policy.using
      }
    }

    return null
  }

  /**
   * Filter fields based on authorization
   */
  async filterFields(
    context: AuthorizationContext,
    resourceName: string,
    data: Record<string, any>,
    action: 'read' | 'write' = 'read'
  ): Promise<Record<string, any>> {
    const resource = this.resourceDefinitions.get(resourceName)
    if (!resource) return {}

    const filtered: Record<string, any> = {}

    for (const [fieldName, value] of Object.entries(data)) {
      const authResult = await this.checkFieldAuthorization(context, resourceName, fieldName, action)
      if (authResult.canRead && action === 'read') {
        filtered[fieldName] = value
      } else if (authResult.canWrite && action === 'write') {
        filtered[fieldName] = value
      }
    }

    return filtered
  }

  /**
   * Export all policies for audit
   */
  exportPolicies(): {
    rbac: Map<string, RoleDefinition>
    abac: Map<string, ABACPolicy[]>
    rls: Map<string, RLSPolicy[]>
    fieldPermissions: Map<string, Map<string, FieldPermission[]>>
  } {
    return {
      rbac: this.rbacRoles,
      abac: this.abacPolicies,
      rls: this.rlsPolicies,
      fieldPermissions: this.fieldPermissions
    }
  }
}

/**
 * Role definition
 */
interface RoleDefinition {
  name: string
  description: string
  permissions: string[]
  dataAccessLevel: 'all' | 'owner' | 'team' | 'public'
  fieldAccessLevel: 'all' | 'owned' | 'limited' | 'public' | 'audit' | 'security'
}

/**
 * Field permission
 */
export interface FieldPermission {
  fieldName: string
  canRead: boolean
  canWrite: boolean
  canDelete: boolean
  requiresMasking?: boolean
  requiresEncryption?: boolean
}

export { RoleDefinition }
