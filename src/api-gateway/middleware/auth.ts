// Authentication Middleware

export interface APIKey {
  key: string
  name: string
  enabled: boolean
  rate_limit: number
  created_at: number
  expires_at?: number
  permissions?: string[]
}

export interface AuthContext {
  apiKey?: string
  bearerToken?: string
  userId?: string
  permissions: string[]
  authenticated: boolean
}

export class AuthMiddleware {
  private apiKeys: Map<string, APIKey> = new Map()
  private tokenCache: Map<string, { userId: string; expires: number }> = new Map()

  // Initialize with default keys (for development)
  initialize(): void {
    // Add development key
    this.apiKeys.set('dev_key_12345', {
      key: 'dev_key_12345',
      name: 'Development Key',
      enabled: true,
      rate_limit: 10000,
      created_at: Date.now(),
      permissions: ['read', 'write', 'admin']
    })

    console.log('Auth Middleware: initialized')
  }

  // Register API key
  registerAPIKey(name: string, permissions: string[], rateLimit: number = 1000): string {
    const key = `api_key_${Date.now()}_${Math.random().toString(36).slice(2)}`

    this.apiKeys.set(key, {
      key,
      name,
      enabled: true,
      rate_limit: rateLimit,
      created_at: Date.now(),
      permissions
    })

    return key
  }

  // Authenticate request
  authenticateRequest(headers: Record<string, string>): AuthContext {
    const context: AuthContext = {
      permissions: [],
      authenticated: false
    }

    // Check for API Key
    const apiKey = headers['x-api-key']
    if (apiKey) {
      const keyInfo = this.apiKeys.get(apiKey)
      if (keyInfo && keyInfo.enabled) {
        context.apiKey = apiKey
        context.permissions = keyInfo.permissions || ['read']
        context.authenticated = true
        context.userId = `key:${keyInfo.name}`
        return context
      }
    }

    // Check for Bearer token
    const authHeader = headers['authorization']
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      const cached = this.tokenCache.get(token)

      if (cached && cached.expires > Date.now()) {
        context.bearerToken = token
        context.userId = cached.userId
        context.authenticated = true
        context.permissions = ['read', 'write']
        return context
      }

      // Verify token (simplified - in production would verify JWT signature)
      if (this.verifyToken(token)) {
        context.bearerToken = token
        context.authenticated = true
        context.permissions = ['read', 'write']
        return context
      }
    }

    // Check for user ID header (for testing)
    const userId = headers['x-user-id']
    if (userId) {
      context.userId = userId
      context.permissions = ['read']
      context.authenticated = true
    }

    return context
  }

  // Verify bearer token
  private verifyToken(token: string): boolean {
    // Simplified verification - in production would verify JWT
    if (token.length < 20) {
      return false
    }

    const parts = token.split('.')
    if (parts.length !== 3) {
      return false
    }

    // Cache valid tokens
    this.tokenCache.set(token, {
      userId: 'user:' + Math.random().toString(36).slice(2),
      expires: Date.now() + 3600000 // 1 hour
    })

    return true
  }

  // Check permission
  hasPermission(context: AuthContext, required: string): boolean {
    if (!context.authenticated) {
      return false
    }

    if (context.permissions.includes('admin')) {
      return true
    }

    return context.permissions.includes(required)
  }

  // Check if key is rate limited
  isRateLimited(apiKey: string, requestCount: number): boolean {
    const keyInfo = this.apiKeys.get(apiKey)
    if (!keyInfo) {
      return true
    }

    return requestCount > keyInfo.rate_limit
  }

  // Get API key info
  getAPIKeyInfo(apiKey: string): APIKey | undefined {
    return this.apiKeys.get(apiKey)
  }

  // List all API keys
  listAPIKeys(): APIKey[] {
    return Array.from(this.apiKeys.values())
  }

  // Revoke API key
  revokeAPIKey(apiKey: string): boolean {
    const keyInfo = this.apiKeys.get(apiKey)
    if (keyInfo) {
      keyInfo.enabled = false
      return true
    }
    return false
  }
}
