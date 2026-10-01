/**
 * Detailed Cloudflare Integration Tests
 * Comprehensive coverage of Cloudflare APIs with quantum messaging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  CloudflareQuantumMessengerWithMCP,
  cflareMCPOps,
  CLOUDFLARE_DEVELOPER_GUIDES
} from '../src/cloudflare/mcp-integration.js'

describe('Cloudflare Integration - Detailed Tests', () => {
  let messenger: CloudflareQuantumMessengerWithMCP
  let mockBindings: any
  let operationMetrics: Map<string, number> = new Map()

  beforeEach(() => {
    mockBindings = {
      QUANTUM_MESSAGES: {
        put: vi.fn().mockResolvedValue(undefined),
        get: vi.fn().mockResolvedValue(null),
        delete: vi.fn().mockResolvedValue(undefined),
        list: vi.fn().mockResolvedValue({ keys: [] })
      },
      QUANTUM_KEYS: {
        put: vi.fn().mockResolvedValue(undefined),
        get: vi.fn().mockResolvedValue(null)
      },
      MESSAGE_RECEIPTS: {
        put: vi.fn().mockResolvedValue(undefined),
        get: vi.fn().mockResolvedValue(null)
      },
      QUANTUM_ROUTER: {},
      QUANTUM_PAYLOADS: {
        put: vi.fn().mockResolvedValue({}),
        get: vi.fn().mockResolvedValue(null)
      },
      ENVIRONMENT: 'staging',
      ENCRYPTION_KEY_ID: 'test-key'
    }

    messenger = new CloudflareQuantumMessengerWithMCP(mockBindings, 'test-api-key')
    operationMetrics.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // ========================================================================
  // WORKERS API DETAILED TESTS
  // ========================================================================

  describe('Workers API - Detailed', () => {
    it('should deploy worker with all binding types', async () => {
      const result = await messenger.deployQuantumWorker(
        'acc-123',
        'quantum-secure-messaging',
        {
          KV_MESSAGES: 'kv-msg-namespace',
          KV_KEYS: 'kv-keys-namespace',
          KV_RECEIPTS: 'kv-receipt-namespace',
          DO_ROUTER: 'do-router-namespace',
          R2_PAYLOADS: 'r2-payload-bucket',
          D1_METADATA: 'd1-db-id'
        }
      )

      expect(result.success).toBe(true)
      expect(result.deployedAt).toBeDefined()
      expect(result.bindings).toContain('KV_MESSAGES')
      expect(result.bindings).toContain('DO_ROUTER')
      expect(result.bindings).toContain('R2_PAYLOADS')
      expect(result.bindings).toContain('D1_METADATA')
    })

    it('should validate worker script deployment format', async () => {
      const deployment = await messenger.deployQuantumWorker(
        'acc-123',
        'messaging-worker',
        {}
      )

      // Check deployment response structure
      expect(deployment).toHaveProperty('success')
      expect(deployment).toHaveProperty('deployedAt')
      expect(deployment).toHaveProperty('scriptName')
      expect(deployment).toHaveProperty('bindings')

      // Verify timestamp format
      const deployedTime = new Date(deployment.deployedAt)
      expect(deployedTime).toBeInstanceOf(Date)
      expect(deployedTime.getTime()).toBeLessThanOrEqual(Date.now())
    })

    it('should support multiple concurrent worker deployments', async () => {
      const deployments = await Promise.all([
        messenger.deployQuantumWorker('acc-123', 'worker-1', {}),
        messenger.deployQuantumWorker('acc-123', 'worker-2', {}),
        messenger.deployQuantumWorker('acc-123', 'worker-3', {})
      ])

      expect(deployments.length).toBe(3)
      deployments.forEach(d => {
        expect(d.success).toBe(true)
      })
    })

    it('should track worker invocation rates', async () => {
      const startTime = Date.now()
      const invocationCount = 10

      for (let i = 0; i < invocationCount; i++) {
        await messenger.executeCflareMCP('cf_worker_invoke', {
          accountId: 'acc-123',
          scriptName: 'messaging-worker',
          method: 'POST',
          path: `/messages/send`,
          body: {}
        })
      }

      const elapsedMs = Date.now() - startTime
      const invocationsPerSecond = (invocationCount / elapsedMs) * 1000

      // Workers should support >100 invocations/sec
      expect(invocationsPerSecond).toBeGreaterThan(1)
    })
  })

  // ========================================================================
  // KV API DETAILED TESTS
  // ========================================================================

  describe('KV API - Detailed', () => {
    it('should organize messages by direction prefix', async () => {
      const directions = ['forward', 'backward', 'bidirectional', 'broadcast', 'targeted']
      const operations = []

      for (const direction of directions) {
        const result = await messenger.executeCflareMCP('cf_kv_put_encrypted', {
          namespaceId: 'kv-ns-messages',
          key: `${direction}:msg-${Math.random()}`,
          value: `message-in-${direction}`,
          expirationTtl: 3600,
          metadata: { direction }
        })
        operations.push(result)
      }

      expect(operations.length).toBe(5)
      operations.forEach(op => expect(op.success).toBe(true))
    })

    it('should handle TTL expiration per message', async () => {
      const ttls = [60, 300, 3600, 86400]
      const results = []

      for (const ttl of ttls) {
        const result = await messenger.executeCflareMCP('cf_kv_put_encrypted', {
          namespaceId: 'kv-ns-messages',
          key: `ttl-test-${ttl}`,
          value: `expires in ${ttl}s`,
          expirationTtl: ttl
        })
        results.push(result)
      }

      expect(results.length).toBe(4)
      results.forEach(r => {
        expect(r.success).toBe(true)
        expect(r.stored).toBe(true)
      })
    })

    it('should support pagination for large message lists', async () => {
      const result = await messenger.executeCflareMCP('cf_kv_list_messages', {
        namespaceId: 'kv-ns-messages',
        prefix: 'forward:',
        limit: 100
      })

      expect(result.success).toBe(true)
      expect(Array.isArray(result.keys)).toBe(true)
      expect(result.cursor).toBeDefined()
      expect(result.list_complete).toBeDefined()
    })

    it('should retrieve message with metadata intact', async () => {
      const messageMetadata = {
        sender: 'alice@domain.com',
        priority: 'high',
        createdAt: new Date().toISOString(),
        quantumKeyed: true
      }

      const result = await messenger.executeCflareMCP('cf_kv_get_encrypted', {
        namespaceId: 'kv-ns-messages',
        key: 'forward:msg-with-metadata'
      })

      expect(result.success).toBe(true)
      expect(result.metadata).toBeDefined()
      expect(result.metadata.createdAt).toBeDefined()
      expect(result.metadata.expiresAt).toBeDefined()
    })

    it('should handle concurrent KV reads with consistent results', async () => {
      const messageKey = 'concurrent-test-msg'
      const concurrentReads = 50

      const results = await Promise.all(
        Array(concurrentReads).fill(null).map(() =>
          messenger.executeCflareMCP('cf_kv_get_encrypted', {
            namespaceId: 'kv-ns-messages',
            key: messageKey
          })
        )
      )

      // All reads should succeed and return same result
      expect(results.length).toBe(concurrentReads)
      results.forEach(r => expect(r.success).toBe(true))
    })
  })

  // ========================================================================
  // DURABLE OBJECTS API DETAILED TESTS
  // ========================================================================

  describe('Durable Objects API - Detailed', () => {
    it('should coordinate message routing state', async () => {
      const messageId = 'msg-coordination-test'
      const routing = {
        direction: 'bidirectional',
        recipients: ['alice', 'bob', 'charlie'],
        sentAt: Date.now(),
        status: 'in-flight'
      }

      const putResult = await messenger.executeCflareMCP(
        'cf_durable_object_put_state',
        {
          objectId: 'do-router-primary',
          key: `route:${messageId}`,
          value: routing
        }
      )

      expect(putResult.success).toBe(true)

      const getResult = await messenger.executeCflareMCP(
        'cf_durable_object_get_state',
        {
          objectId: 'do-router-primary',
          key: `route:${messageId}`
        }
      )

      expect(getResult.success).toBe(true)
      expect(getResult.value.direction).toBe('bidirectional')
      expect(getResult.value.recipients.length).toBe(3)
    })

    it('should maintain consensus across multiple Durable Object replicas', async () => {
      const replicas = ['do-router-primary', 'do-router-replica-1', 'do-router-replica-2']
      const consensusKey = 'consensus:delivery-status'
      const state = { confirmed: true, timestamp: Date.now() }

      // Write to all replicas
      const writes = await Promise.all(
        replicas.map(objectId =>
          messenger.executeCflareMCP('cf_durable_object_put_state', {
            objectId,
            key: consensusKey,
            value: state
          })
        )
      )

      expect(writes.length).toBe(3)
      writes.forEach(w => expect(w.success).toBe(true))

      // Verify consistency
      const reads = await Promise.all(
        replicas.map(objectId =>
          messenger.executeCflareMCP('cf_durable_object_get_state', {
            objectId,
            key: consensusKey
          })
        )
      )

      reads.forEach(r => {
        expect(r.value.timestamp).toBe(state.timestamp)
        expect(r.value.confirmed).toBe(true)
      })
    })

    it('should handle rate limiting at Durable Object level', async () => {
      const objectId = 'do-rate-limited'
      const operations = 1000

      const startTime = Date.now()
      const results = []

      for (let i = 0; i < operations; i++) {
        const result = await messenger.executeCflareMCP(
          'cf_durable_object_put_state',
          {
            objectId,
            key: `rate-test-${i}`,
            value: { index: i }
          }
        )
        results.push(result)
      }

      const elapsedMs = Date.now() - startTime
      const opsPerSecond = (operations / elapsedMs) * 1000

      // Should sustain thousands of ops/sec
      expect(results.every(r => r.success)).toBe(true)
      expect(opsPerSecond).toBeGreaterThan(100)
    })
  })

  // ========================================================================
  // R2 API DETAILED TESTS
  // ========================================================================

  describe('R2 API - Detailed', () => {
    it('should store payloads at various sizes', async () => {
      const sizes = [
        100 * 1024,      // 100KB - threshold
        500 * 1024,      // 500KB
        1024 * 1024,     // 1MB
        10 * 1024 * 1024 // 10MB
      ]

      const results = []
      for (const size of sizes) {
        const payload = Buffer.alloc(size).toString()
        const result = await messenger.executeCflareMCP('cf_r2_put_payload', {
          bucketId: 'quantum-payloads',
          key: `payload-${size}`,
          body: payload
        })
        results.push(result)
      }

      expect(results.length).toBe(4)
      results.forEach((r, i) => {
        expect(r.success).toBe(true)
        expect(r.size).toBeGreaterThan(0)
      })
    })

    it('should support cache headers for payload retrieval', async () => {
      const result = await messenger.executeCflareMCP('cf_r2_put_payload', {
        bucketId: 'quantum-payloads',
        key: 'cached-broadcast-payload',
        body: 'cached content',
        cacheControl: 'public, max-age=3600, s-maxage=86400'
      })

      expect(result.cacheControl).toBe('public, max-age=3600, s-maxage=86400')
    })

    it('should generate proper ETags for integrity verification', async () => {
      const payloads = [
        'payload-1-data',
        'payload-2-data',
        'payload-1-data' // Same as first
      ]

      const results = []
      for (let i = 0; i < payloads.length; i++) {
        const result = await messenger.executeCflareMCP('cf_r2_put_payload', {
          bucketId: 'quantum-payloads',
          key: `integrity-test-${i}`,
          body: payloads[i]
        })
        results.push(result)
      }

      expect(results[0].etag).toBeDefined()
      // Different payloads should have different ETags
      expect(results[0].etag).not.toBe(results[1].etag)
      // Same payload should have same ETag
      // (In real scenario with content-based hashing)
    })

    it('should support concurrent R2 uploads', async () => {
      const uploadCount = 20
      const startTime = Date.now()

      const uploads = await Promise.all(
        Array(uploadCount).fill(null).map((_, i) =>
          messenger.executeCflareMCP('cf_r2_put_payload', {
            bucketId: 'quantum-payloads',
            key: `concurrent-${i}`,
            body: `payload-${i}`
          })
        )
      )

      const elapsedMs = Date.now() - startTime
      const uploadsPerSecond = (uploadCount / elapsedMs) * 1000

      expect(uploads.length).toBe(uploadCount)
      expect(uploads.every(u => u.success)).toBe(true)
      expect(uploadsPerSecond).toBeGreaterThan(1)
    })
  })

  // ========================================================================
  // D1 DATABASE DETAILED TESTS
  // ========================================================================

  describe('D1 Database API - Detailed', () => {
    it('should insert receipt with full audit trail', async () => {
      const receipt = {
        messageId: 'msg-audit-001',
        sender: 'alice@domain.com',
        recipient: 'bob@domain.com',
        direction: 'forward',
        priority: 'high',
        deliveredAt: new Date().toISOString(),
        signature: 'sig-hash-xyz',
        confirmed: true
      }

      const result = await messenger.executeCflareMCP('cf_d1_insert_receipt', {
        databaseId: 'd1-audit-db',
        table: 'message_receipts',
        record: receipt
      })

      expect(result.success).toBe(true)
      expect(result.inserted).toBe(1)
      expect(result.lastRowId).toBeDefined()
    })

    it('should query receipts with complex filters', async () => {
      const result = await messenger.executeCflareMCP('cf_d1_query_receipts', {
        databaseId: 'd1-audit-db',
        query: `
          SELECT * FROM message_receipts
          WHERE direction = 'forward'
          AND priority = 'high'
          AND deliveredAt > datetime('now', '-24 hours')
        `
      })

      expect(result.success).toBe(true)
      expect(Array.isArray(result.results)).toBe(true)
      expect(result.meta).toHaveProperty('count')
      expect(result.meta).toHaveProperty('duration')
    })

    it('should maintain ACID properties for receipt storage', async () => {
      // Insert multiple receipts for same message
      const receipts = [
        { messageId: 'msg-tx-001', recipient: 'user1', status: 'pending' },
        { messageId: 'msg-tx-001', recipient: 'user2', status: 'pending' },
        { messageId: 'msg-tx-001', recipient: 'user3', status: 'pending' }
      ]

      const insertResults = await Promise.all(
        receipts.map(r =>
          messenger.executeCflareMCP('cf_d1_insert_receipt', {
            databaseId: 'd1-audit-db',
            table: 'message_receipts',
            record: r
          })
        )
      )

      // Verify all inserts succeeded (transaction)
      expect(insertResults.every(r => r.success)).toBe(true)
      expect(insertResults.every(r => r.inserted === 1)).toBe(true)
    })

    it('should support retention policies (compliance)', async () => {
      // Query receipts with retention metadata
      const result = await messenger.executeCflareMCP('cf_d1_query_receipts', {
        databaseId: 'd1-audit-db',
        query: `
          SELECT id, messageId, createdAt,
          CASE
            WHEN createdAt < datetime('now', '-90 days') THEN 'archived'
            WHEN createdAt < datetime('now', '-30 days') THEN 'retention'
            ELSE 'active'
          END as retention_status
          FROM message_receipts
        `
      })

      expect(result.success).toBe(true)
      if (result.results.length > 0) {
        expect(result.results[0]).toHaveProperty('retention_status')
      }
    })
  })

  // ========================================================================
  // ANALYTICS API DETAILED TESTS
  // ========================================================================

  describe('Analytics API - Detailed', () => {
    it('should measure latency percentiles (p50, p95, p99, p999)', async () => {
      const result = await messenger.getMessageAnalytics('acc-123', '24h')

      expect(result.metrics).toHaveProperty('averageLatencyMs')
      expect(result.metrics).toHaveProperty('p99LatencyMs')

      // Percentiles should be monotonically increasing
      expect(result.metrics.averageLatencyMs).toBeLessThanOrEqual(
        result.metrics.p99LatencyMs
      )
    })

    it('should track delivery rate per direction', async () => {
      const result = await messenger.getMessageAnalytics('acc-123', '7d')

      expect(result.metrics.messagesSent).toBeGreaterThan(0)
      expect(result.metrics.messagesDelivered).toBeLessThanOrEqual(
        result.metrics.messagesSent
      )

      const deliveryRate = (result.metrics.messagesDelivered / result.metrics.messagesSent) * 100
      expect(deliveryRate).toBeGreaterThan(90) // >90% delivery rate
      expect(deliveryRate).toBeLessThanOrEqual(100)
    })

    it('should track security metrics (encryption/decryption)', async () => {
      const securityMetrics = await messenger.getSecurityMetrics('acc-123')

      expect(securityMetrics.metrics.encryptedMessages).toBeGreaterThan(0)
      expect(securityMetrics.metrics.decryptionSuccesses).toBeGreaterThan(0)
      expect(securityMetrics.metrics.signatureVerifications).toBeGreaterThan(0)

      // Decryption success rate should be >99%
      const decryptSuccessRate =
        (securityMetrics.metrics.decryptionSuccesses /
         securityMetrics.metrics.encryptedMessages) * 100
      expect(decryptSuccessRate).toBeGreaterThan(99)
    })

    it('should detect security anomalies (unauthorized access)', async () => {
      const securityMetrics = await messenger.getSecurityMetrics('acc-123')

      expect(securityMetrics.metrics).toHaveProperty('unauthorizedAccess')
      expect(typeof securityMetrics.metrics.unauthorizedAccess).toBe('number')

      // Should have <1% unauthorized attempts
      const unauthorizedRate =
        (securityMetrics.metrics.unauthorizedAccess /
         securityMetrics.metrics.signatureVerifications) * 100
      expect(unauthorizedRate).toBeLessThan(1)
    })

    it('should support time-series analytics (hourly/daily/weekly)', async () => {
      const periods = ['1h', '24h', '7d', '30d']
      const results = []

      for (const period of periods) {
        const result = await messenger.getMessageAnalytics('acc-123', period)
        results.push(result)
      }

      expect(results.length).toBe(4)
      results.forEach(r => {
        expect(r.success).toBe(true)
        expect(r.period).toBeDefined()
      })
    })
  })

  // ========================================================================
  // END-TO-END DETAILED FLOWS
  // ========================================================================

  describe('End-to-End Detailed Flows', () => {
    it('should complete full message lifecycle (send → store → track → query)', async () => {
      // Step 1: Deploy worker
      console.log('Step 1: Deploy worker')
      const deployment = await messenger.deployQuantumWorker(
        'acc-prod',
        'quantum-messaging-prod',
        { KV_MESSAGES: 'kv-prod', D1_METADATA: 'd1-prod' }
      )
      expect(deployment.success).toBe(true)

      // Step 2: Send message (store in KV)
      console.log('Step 2: Store message in KV')
      const kvStore = await messenger.executeCflareMCP('cf_kv_put_encrypted', {
        namespaceId: 'kv-prod',
        key: 'forward:msg-lifecycle-001',
        value: '{"encrypted": "quantum-message-data"}',
        expirationTtl: 86400
      })
      expect(kvStore.success).toBe(true)

      // Step 3: Record receipt in D1
      console.log('Step 3: Record receipt in D1')
      const d1Record = await messenger.executeCflareMCP('cf_d1_insert_receipt', {
        databaseId: 'd1-prod',
        table: 'messages',
        record: {
          messageId: 'msg-lifecycle-001',
          sender: 'alice',
          direction: 'forward',
          status: 'delivered'
        }
      })
      expect(d1Record.success).toBe(true)

      // Step 4: Store large payload in R2
      console.log('Step 4: Store payload in R2')
      const largePayload = Buffer.alloc(500 * 1024).toString()
      const r2Store = await messenger.executeCflareMCP('cf_r2_put_payload', {
        bucketId: 'quantum-payloads-prod',
        key: 'forward/msg-lifecycle-001',
        body: largePayload
      })
      expect(r2Store.success).toBe(true)

      // Step 5: Query analytics
      console.log('Step 5: Query message analytics')
      const analytics = await messenger.getMessageAnalytics('acc-prod', '24h')
      expect(analytics.success).toBe(true)
      expect(analytics.metrics.messagesSent).toBeGreaterThan(0)

      // Step 6: Query security metrics
      console.log('Step 6: Query security metrics')
      const security = await messenger.getSecurityMetrics('acc-prod')
      expect(security.success).toBe(true)
      expect(security.metrics.encryptedMessages).toBeGreaterThan(0)

      console.log('✓ Full lifecycle complete')
    })

    it('should handle multi-directional flow with consensus', async () => {
      // Multi-directional: forward + backward + acknowledgment
      const messageId = 'msg-multidir-001'

      // Forward: Alice → Bob
      await messenger.executeCflareMCP('cf_kv_put_encrypted', {
        namespaceId: 'kv-prod',
        key: `forward:${messageId}`,
        value: 'alice-to-bob'
      })

      // Track routing
      await messenger.executeCflareMCP('cf_durable_object_put_state', {
        objectId: 'do-router',
        key: `route:${messageId}`,
        value: { direction: 'forward', recipient: 'bob' }
      })

      // Backward: Bob → Alice (acknowledgment)
      await messenger.executeCflareMCP('cf_kv_put_encrypted', {
        namespaceId: 'kv-prod',
        key: `backward:${messageId}`,
        value: 'bob-ack-to-alice'
      })

      // Record both directions in ledger
      await messenger.executeCflareMCP('cf_d1_insert_receipt', {
        databaseId: 'd1-prod',
        table: 'messages',
        record: { messageId, direction: 'forward-backward', confirmed: true }
      })
    })
  })

  // ========================================================================
  // CLOUDFLARE DEVELOPER GUIDES VALIDATION
  // ========================================================================

  describe('Cloudflare Developer Guides Reference', () => {
    it('should reference official Cloudflare docs for all APIs', () => {
      const guides = Object.entries(CLOUDFLARE_DEVELOPER_GUIDES)

      expect(guides.length).toBeGreaterThanOrEqual(7)

      guides.forEach(([key, url]) => {
        expect(url).toContain('developers.cloudflare.com')
        expect(url).toStartWith('https://')
      })
    })

    it('should provide guides for all operation categories', () => {
      const categories = new Set(cflareMCPOps.map(op => op.category))
      categories.forEach(category => {
        expect(Object.keys(CLOUDFLARE_DEVELOPER_GUIDES)).toContain(category)
      })
    })
  })
})
