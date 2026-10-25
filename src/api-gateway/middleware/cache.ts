// Caching Middleware
// Implements ETag, cache-control, and response caching

import * as crypto from 'crypto'

export interface CacheEntry {
  key: string
  value: any
  etag: string
  created_at: number
  expires_at: number
  metadata?: Record<string, any>
}

export interface CachePolicy {
  ttl: number // Time to live in seconds
  max_size?: number // Max cache size in bytes
  etag?: boolean // Enable ETag support
  vary?: string[] // Headers to vary on
}

export class CacheManager {
  private cache: Map<string, CacheEntry> = new Map()
  private policy: CachePolicy
  private totalSize: number = 0

  constructor(policy: CachePolicy = {
    ttl: 300, // 5 minutes default
    max_size: 50 * 1024 * 1024, // 50MB
    etag: true,
    vary: ['Accept', 'Accept-Encoding']
  }) {
    this.policy = policy
    console.log('Cache Manager: initialized')
  }

  // Generate ETag for value
  private generateETag(value: any): string {
    const json = JSON.stringify(value)
    return `"${crypto.createHash('sha256').update(json).digest('hex').slice(0, 16)}"`
  }

  // Get cached value
  get(key: string): CacheEntry | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Check if expired
    if (entry.expires_at < Date.now()) {
      this.cache.delete(key)
      this.totalSize -= JSON.stringify(entry).length
      return null
    }

    return entry
  }

  // Set cached value
  set(key: string, value: any, ttl?: number): CacheEntry {
    // Delete old entry if exists
    const oldEntry = this.cache.get(key)
    if (oldEntry) {
      this.totalSize -= JSON.stringify(oldEntry).length
    }

    const entry: CacheEntry = {
      key,
      value,
      etag: this.generateETag(value),
      created_at: Date.now(),
      expires_at: Date.now() + ((ttl || this.policy.ttl) * 1000)
    }

    const entrySize = JSON.stringify(entry).length

    // Check size limit
    if (this.policy.max_size && this.totalSize + entrySize > this.policy.max_size) {
      // Evict oldest entry
      this.evictOldest()
    }

    this.cache.set(key, entry)
    this.totalSize += entrySize

    return entry
  }

  // Evict oldest entry
  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTime = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.created_at < oldestTime) {
        oldestTime = entry.created_at
        oldestKey = key
      }
    }

    if (oldestKey) {
      const entry = this.cache.get(oldestKey)
      if (entry) {
        this.totalSize -= JSON.stringify(entry).length
      }
      this.cache.delete(oldestKey)
    }
  }

  // Delete cached value
  delete(key: string): boolean {
    const entry = this.cache.get(key)
    if (entry) {
      this.totalSize -= JSON.stringify(entry).length
      this.cache.delete(key)
      return true
    }
    return false
  }

  // Check if ETag matches (for conditional requests)
  matchesETag(key: string, clientETag: string): boolean {
    const entry = this.get(key)
    if (!entry) {
      return false
    }

    return entry.etag === clientETag
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
    this.totalSize = 0
  }

  // Get cache statistics
  getStats(): {
    size: number
    entries: number
    total_bytes: number
  } {
    return {
      size: this.cache.size,
      entries: this.cache.size,
      total_bytes: this.totalSize
    }
  }

  // Get entry count
  size(): number {
    return this.cache.size
  }
}

// HTTP cache directive parser and handler
export class HTTPCacheDirective {
  // Parse cache-control header
  static parseDirective(header: string): Record<string, string | number | boolean> {
    const directive: Record<string, string | number | boolean> = {}
    const parts = header.split(',')

    for (const part of parts) {
      const [key, value] = part.split('=').map(s => s.trim())

      if (value === undefined) {
        directive[key] = true
      } else {
        directive[key] = isNaN(Number(value)) ? value : Number(value)
      }
    }

    return directive
  }

  // Generate cache-control header
  static generateDirective(options: {
    public?: boolean
    private?: boolean
    max_age?: number
    s_maxage?: number
    must_revalidate?: boolean
    no_cache?: boolean
    no_store?: boolean
  }): string {
    const directives: string[] = []

    if (options.public) directives.push('public')
    if (options.private) directives.push('private')
    if (options.max_age !== undefined) directives.push(`max-age=${options.max_age}`)
    if (options.s_maxage !== undefined) directives.push(`s-maxage=${options.s_maxage}`)
    if (options.must_revalidate) directives.push('must-revalidate')
    if (options.no_cache) directives.push('no-cache')
    if (options.no_store) directives.push('no-store')

    return directives.join(', ')
  }

  // Determine if response is cacheable
  static isCacheable(method: string, statusCode: number, headers: Record<string, string>): boolean {
    // Only cache GET and HEAD requests
    if (!['GET', 'HEAD'].includes(method)) {
      return false
    }

    // Cache 200, 203, 206, 300, 301, 404, 405, 410, 414, 501
    const cacheableStatuses = [200, 203, 206, 300, 301, 404, 405, 410, 414, 501]
    if (!cacheableStatuses.includes(statusCode)) {
      return false
    }

    // Check cache-control header
    const cacheControl = headers['cache-control']
    if (cacheControl) {
      if (cacheControl.includes('no-store') || cacheControl.includes('private')) {
        return false
      }
    }

    return true
  }

  // Calculate TTL from cache-control header
  static calculateTTL(headers: Record<string, string>): number {
    const cacheControl = headers['cache-control']
    if (!cacheControl) {
      return 300 // Default 5 minutes
    }

    const directive = HTTPCacheDirective.parseDirective(cacheControl)
    if (typeof directive.max_age === 'number') {
      return directive.max_age
    }

    return 300 // Default 5 minutes
  }
}

// Request key generator for cache lookups
export class CacheKeyGenerator {
  // Generate cache key from request
  static generateKey(method: string, path: string, query?: Record<string, any>, headers?: Record<string, string>): string {
    let key = `${method}:${path}`

    // Include query parameters
    if (query && Object.keys(query).length > 0) {
      const sorted = Object.keys(query)
        .sort()
        .map(k => `${k}=${JSON.stringify(query[k])}`)
        .join('&')
      key += `?${sorted}`
    }

    // Include relevant headers
    if (headers) {
      const relevantHeaders = ['accept', 'accept-encoding', 'accept-language']
      const headerParts = relevantHeaders
        .filter(h => headers[h])
        .map(h => `${h}:${headers[h]}`)
        .join('|')

      if (headerParts) {
        key += `#${headerParts}`
      }
    }

    return key
  }
}
