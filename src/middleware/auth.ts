/** API Authentication Middleware - Production Security */

export interface APIKey {
  key: string
  name: string
  rateLimit: number // requests per second
  created: Date
  lastUsed?: Date
}

const validKeys = new Map<string, APIKey>()

// Initialize with default key (would be loaded from secrets in production)
export function initializeKeys(keys: APIKey[]) {
  keys.forEach(k => validKeys.set(k.key, k))
}

export function validateAPIKey(key: string): APIKey | null {
  const apiKey = validKeys.get(key)
  if (!apiKey) return null

  apiKey.lastUsed = new Date()
  return apiKey
}

export function generateAPIKey(name: string, rateLimit = 1000): string {
  const key = `qpu_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`
  validKeys.set(key, {
    key,
    name,
    rateLimit,
    created: new Date(),
  })
  return key
}

export function revokeAPIKey(key: string): boolean {
  return validKeys.delete(key)
}

export function listAPIKeys(): APIKey[] {
  return Array.from(validKeys.values()).map(k => ({
    ...k,
    key: k.key.substring(0, 10) + '...' // Hide full key in logs
  }))
}
