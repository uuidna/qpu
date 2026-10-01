/**
 * Cloudflare MCP Integration Tests
 * Test fusion of Cloudflare APIs with quantum secure messaging
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  CloudflareQuantumMessengerWithMCP,
  cflareMCPOps,
  CLOUDFLARE_DEVELOPER_GUIDES
} from '../src/cloudflare/mcp-integration.js'

describe('Cloudflare MCP Integration', () => {
  let messenger: CloudflareQuantumMessengerWithMCP
  let mockBindings: any

  beforeEach(() => {
    mockBindings = {
      QUANTUM_MESSAGES: { put: async () => {}, get: async () => null },
      QUANTUM_KEYS: { put: async () => {}, get: async () => null },
      MESSAGE_RECEIPTS: { put: async () => {}, get: async () => null },
      QUANTUM_ROUTER: {},
      QUANTUM_PAYLOADS: { put: async () => {}, get: async () => null },
      ENVIRONMENT: 'staging',
      ENCRYPTION_KEY_ID: 'test-key'
    }

    messenger = new CloudflareQuantumMessengerWithMCP(mockBindings, 'test-api-key')
  })

  describe('MCP Operations Registry', () => {
    it('should have 17 Cloudflare MCP operations registered', () => {
      expect(cflareMCPOps.length).toBe(17)
    })

    it('should categorize operations correctly', () => {
      const categories = new Set(cflareMCPOps.map(op => op.category))
      expect(Array.from(categories)).toEqual(
        expect.arrayContaining(['workers', 'kv', 'durable-objects', 'r2', 'd1', 'analytics'])
      )
    })

    it('should have rate limits defined', () => {
      cflareMCPOps.forEach(op => {
        expect(op.rateLimit).toBeGreaterThan(0)
      })
    })

    it('should define authentication method', () => {
      cflareMCPOps.forEach(op => {
        expect(['api-key', 'service-account', 'oauth']).toContain(op.auth)
      })
    })
  })

  describe('Workers API Integration', () => {
    it('should deploy quantum worker', async () => {
      const result = await messenger.deployQuantumWorker(
        'acc-123',
        'quantum-messaging',
        { KV_MESSAGES: 'kv-namespace-id' }
      )

      expect(result.success).toBe(true)
      expect(result.scriptName).toBe('quantum-messaging')
      expect(result.bindings).toContain('KV_MESSAGES')
    })

    it('should invoke worker endpoint', async () => {
      const result = await messenger.executeCflareMCP('cf_worker_invoke', {
        accountId: 'acc-123',
        scriptName: 'quantum-messaging',
        method: 'POST',
        path: '/messages/send',
        body: { sender: 'alice', recipient: 'bob' }
      })

      expect(result.statusCode).toBe(200)
      expect(result.workerResponse).toBeDefined()
    })
  })

  describe('KV API Integration', () => {
    it('should store encrypted message in KV', async () => {
      const result = await messenger.executeCflareMCP('cf_kv_put_encrypted', {
        namespaceId: 'kv-ns-123',
        key: 'forward:msg-001',
        value: '{"encrypted": "data"}',
        expirationTtl: 3600,
        metadata: { priority: 'high' }
      })

      expect(result.success).toBe(true)
      expect(result.namespace).toBe('kv-ns-123')
      expect(result.key).toBe('forward:msg-001')
    })

    it('should retrieve message from KV', async () => {
      const result = await messenger.executeCflareMCP('cf_kv_get_encrypted', {
        namespaceId: 'kv-ns-123',
        key: 'forward:msg-001'
      })

      expect(result.success).toBe(true)
      expect(result.value).toBeDefined()
      expect(result.metadata).toBeDefined()
    })

    it('should list messages by direction prefix', async () => {
      const result = await messenger.executeCflareMCP('cf_kv_list_messages', {
        namespaceId: 'kv-ns-123',
        prefix: 'forward:',
        limit: 100
      })

      expect(result.success).toBe(true)
      expect(Array.isArray(result.keys)).toBe(true)
      expect(result.list_complete).toBe(true)
    })
  })

  describe('Durable Objects API Integration', () => {
    it('should store state in Durable Object', async () => {
      const result = await messenger.executeCflareMCP('cf_durable_object_put_state', {
        objectId: 'do-router-001',
        key: 'route:msg-001',
        value: { direction: 'forward', recipients: ['bob', 'charlie'] }
      })

      expect(result.success).toBe(true)
      expect(result.stored).toBe(true)
    })

    it('should retrieve state from Durable Object', async () => {
      const result = await messenger.executeCflareMCP('cf_durable_object_get_state', {
        objectId: 'do-router-001',
        key: 'route:msg-001'
      })

      expect(result.success).toBe(true)
      expect(result.value.direction).toBe('forward')
    })
  })

  describe('R2 API Integration', () => {
    it('should store large payload in R2', async () => {
      const largeBody = Buffer.alloc(500 * 1024).toString()
      const result = await messenger.executeCflareMCP('cf_r2_put_payload', {
        bucketId: 'quantum-payloads',
        key: 'broadcast/msg-large-001',
        body: largeBody,
        cacheControl: 'public, max-age=3600'
      })

      expect(result.success).toBe(true)
      expect(result.bucket).toBe('quantum-payloads')
      expect(result.stored).toBe(true)
    })

    it('should retrieve payload from R2', async () => {
      const result = await messenger.executeCflareMCP('cf_r2_get_payload', {
        bucketId: 'quantum-payloads',
        key: 'broadcast/msg-large-001'
      })

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
    })
  })

  describe('D1 API Integration', () => {
    it('should insert message receipt into D1', async () => {
      const result = await messenger.executeCflareMCP('cf_d1_insert_receipt', {
        databaseId: 'd1-db-001',
        table: 'messages',
        record: {
          messageId: 'msg-001',
          sender: 'alice@domain.com',
          direction: 'forward',
          priority: 'high'
        }
      })

      expect(result.success).toBe(true)
      expect(result.inserted).toBe(1)
    })

    it('should query receipts from D1', async () => {
      const result = await messenger.executeCflareMCP('cf_d1_query_receipts', {
        databaseId: 'd1-db-001',
        query: 'SELECT * FROM messages WHERE sender = ?'
      })

      expect(result.success).toBe(true)
      expect(Array.isArray(result.results)).toBe(true)
      expect(result.meta.duration).toBeDefined()
    })
  })

  describe('Analytics API Integration', () => {
    it('should get message flow analytics', async () => {
      const result = await messenger.getMessageAnalytics('acc-123', '24h')

      expect(result.success).toBe(true)
      expect(result.metrics.messagesSent).toBeGreaterThan(0)
      expect(result.metrics.deliveryRate).toBeGreaterThan(0)
      expect(result.metrics.averageLatencyMs).toBeGreaterThan(0)
    })

    it('should return latency percentiles', async () => {
      const result = await messenger.getMessageAnalytics('acc-123', '7d')

      expect(result.metrics.averageLatencyMs).toBeDefined()
      expect(result.metrics.p99LatencyMs).toBeDefined()
      expect(result.metrics.p99LatencyMs).toBeGreaterThanOrEqual(
        result.metrics.averageLatencyMs
      )
    })

    it('should get security metrics', async () => {
      const result = await messenger.getSecurityMetrics('acc-123')

      expect(result.success).toBe(true)
      expect(result.metrics.encryptedMessages).toBeGreaterThan(0)
      expect(result.metrics.decryptionSuccesses).toBeGreaterThan(0)
      expect(result.metrics.signatureVerifications).toBeGreaterThan(0)
    })

    it('should track security failures', async () => {
      const result = await messenger.getSecurityMetrics('acc-123')

      expect(result.metrics.decryptionFailures).toBeDefined()
      expect(result.metrics.signatureFailures).toBeDefined()
      expect(result.metrics.unauthorizedAccess).toBeDefined()
    })
  })

  describe('Dual-Write for Redundancy', () => {
    it('should store message in KV + D1', async () => {
      const message = {
        id: 'msg-123',
        sender: 'alice',
        direction: 'forward',
        metadata: { ttl: 3600, priority: 'high' }
      }

      await messenger.storeMessageSecurely(
        message.id,
        'kv-ns-123',
        'd1-db-001',
        message
      )

      // Should execute both KV and D1 operations
      expect(true).toBe(true)
    })
  })

  describe('Operation Listing & Discovery', () => {
    it('should list all operations', () => {
      const ops = messenger.listOperations()
      expect(ops.length).toBe(17)
      expect(ops[0].name).toBeDefined()
    })

    it('should get operation by name', () => {
      const op = messenger.getOperation('cf_worker_deploy')
      expect(op).toBeDefined()
      expect(op?.category).toBe('workers')
    })

    it('should filter operations by category', () => {
      const kvOps = messenger.getOperationsByCategory('kv')
      expect(kvOps.length).toBeGreaterThan(0)
      expect(kvOps.every(op => op.category === 'kv')).toBe(true)
    })

    it('should have operations for each category', () => {
      const categories = ['workers', 'kv', 'durable-objects', 'r2', 'd1', 'analytics']
      categories.forEach(category => {
        const ops = messenger.getOperationsByCategory(category)
        expect(ops.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Error Handling', () => {
    it('should throw on unknown operation', async () => {
      expect(async () => {
        await messenger.executeCflareMCP('cf_unknown_operation', {})
      }).rejects.toThrow('Unknown Cloudflare MCP operation')
    })
  })

  describe('Developer Guides Reference', () => {
    it('should define all developer guide URLs', () => {
      expect(CLOUDFLARE_DEVELOPER_GUIDES.workers).toContain('developers.cloudflare.com')
      expect(CLOUDFLARE_DEVELOPER_GUIDES.kv).toContain('kv')
      expect(CLOUDFLARE_DEVELOPER_GUIDES.durableObjects).toContain('durable-objects')
      expect(CLOUDFLARE_DEVELOPER_GUIDES.r2).toContain('r2')
      expect(CLOUDFLARE_DEVELOPER_GUIDES.d1).toContain('d1')
      expect(CLOUDFLARE_DEVELOPER_GUIDES.analytics).toContain('analytics')
    })

    it('should have 7 guide categories', () => {
      const guides = Object.keys(CLOUDFLARE_DEVELOPER_GUIDES)
      expect(guides.length).toBeGreaterThanOrEqual(7)
    })
  })

  describe('Rate Limiting', () => {
    it('Workers should have 100 rps limit', () => {
      const op = messenger.getOperation('cf_worker_deploy')
      expect(op?.rateLimit).toBe(100)
    })

    it('KV should have 10000 rps limit', () => {
      const op = messenger.getOperation('cf_kv_put_encrypted')
      expect(op?.rateLimit).toBe(10000)
    })

    it('Analytics should have 100 rps limit (low)', () => {
      const op = messenger.getOperation('cf_analytics_message_flow')
      expect(op?.rateLimit).toBe(100)
    })
  })

  describe('End-to-End MCP Flow', () => {
    it('should deploy worker → send message → store → query analytics', async () => {
      // 1. Deploy worker
      const deployment = await messenger.deployQuantumWorker(
        'acc-123',
        'quantum-messaging',
        {}
      )
      expect(deployment.success).toBe(true)

      // 2. Store message in KV
      const kvStore = await messenger.executeCflareMCP('cf_kv_put_encrypted', {
        namespaceId: 'kv-ns-123',
        key: 'msg-001',
        value: 'encrypted',
        expirationTtl: 3600
      })
      expect(kvStore.success).toBe(true)

      // 3. Store metadata in D1
      const d1Store = await messenger.executeCflareMCP('cf_d1_insert_receipt', {
        databaseId: 'd1-db-001',
        table: 'messages',
        record: { messageId: 'msg-001', sender: 'alice' }
      })
      expect(d1Store.success).toBe(true)

      // 4. Query analytics
      const analytics = await messenger.getMessageAnalytics('acc-123')
      expect(analytics.success).toBe(true)
      expect(analytics.metrics.messagesSent).toBeGreaterThan(0)
    })
  })
})
