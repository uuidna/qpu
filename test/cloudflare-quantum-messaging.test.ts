/**
 * Cloudflare Quantum Secure Messaging Tests
 * Multi-directional quantum-encrypted signalling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  CloudflareQuantumMessenger,
  type DirectionalQuantumMessage,
  type CloudflareBindings,
  type Direction
} from '../src/cloudflare/quantum-secure-messaging.js'

// Mock Cloudflare bindings
const createMockBindings = (): CloudflareBindings => ({
  QUANTUM_MESSAGES: {
    put: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
    list: vi.fn(),
    getWithMetadata: vi.fn()
  } as any,
  QUANTUM_KEYS: {
    put: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
    list: vi.fn(),
    getWithMetadata: vi.fn()
  } as any,
  MESSAGE_RECEIPTS: {
    put: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
    list: vi.fn(),
    getWithMetadata: vi.fn()
  } as any,
  QUANTUM_ROUTER: {
    get: vi.fn(),
    create: vi.fn()
  } as any,
  QUANTUM_PAYLOADS: {
    put: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
    list: vi.fn(),
    head: vi.fn()
  } as any,
  ENVIRONMENT: 'staging',
  ENCRYPTION_KEY_ID: 'test-key-id'
})

describe('Cloudflare Quantum Messaging', () => {
  let bindings: CloudflareBindings
  let messenger: CloudflareQuantumMessenger

  beforeEach(() => {
    bindings = createMockBindings()
    messenger = new CloudflareQuantumMessenger(bindings)
  })

  describe('Forward Direction Messages', () => {
    it('should send forward message (sender -> recipient)', async () => {
      const message = await messenger.sendDirectional(
        'alice@domain.com',
        'forward',
        ['bob@domain.com'],
        'Hello Bob',
        new TextEncoder().encode('Confidential message'),
        { priority: 'high', requiresReceipt: true }
      )

      expect(message).toBeDefined()
      expect(message?.direction).toBe('forward')
      expect(message?.sender).toBe('alice@domain.com')
      expect(message?.recipients).toContain('bob@domain.com')
      expect(message?.metadata.priority).toBe('high')
      expect(message?.metadata.requiresReceipt).toBe(true)
    })

    it('should create forward path entries', async () => {
      await messenger.sendDirectional(
        'alice@domain.com',
        'forward',
        ['bob@domain.com', 'charlie@domain.com'],
        'Broadcast',
        new TextEncoder().encode('Message body'),
        { priority: 'normal' }
      )

      // Verify KV put was called for each recipient
      expect(bindings.QUANTUM_MESSAGES.put).toHaveBeenCalled()
    })

    it('should set TTL for forward messages', async () => {
      await messenger.sendDirectional(
        'alice@domain.com',
        'forward',
        ['bob@domain.com'],
        'TTL Test',
        new TextEncoder().encode('Body'),
        { ttl: 3600 }
      )

      expect(bindings.QUANTUM_MESSAGES.put).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          expirationTtl: 3600
        })
      )
    })
  })

  describe('Backward Direction Messages', () => {
    it('should send backward message (recipient -> sender ack)', async () => {
      const message = await messenger.sendDirectional(
        'bob@domain.com',
        'backward',
        ['alice@domain.com'],
        'Acknowledgment',
        new TextEncoder().encode('Received and understood'),
        { priority: 'normal' }
      )

      expect(message?.direction).toBe('backward')
      expect(message?.sender).toBe('bob@domain.com')
      expect(message?.recipients).toContain('alice@domain.com')
    })

    it('should queue acknowledgment requests', async () => {
      await messenger.sendDirectional(
        'bob@domain.com',
        'backward',
        ['alice@domain.com'],
        'ACK',
        new TextEncoder().encode('Ack body')
      )

      // Should create acknowledgment entries
      expect(bindings.QUANTUM_MESSAGES.put).toHaveBeenCalled()
    })
  })

  describe('Bidirectional Messages', () => {
    it('should send bidirectional message (two-way channel)', async () => {
      const message = await messenger.sendDirectional(
        'alice@domain.com',
        'bidirectional',
        ['bob@domain.com'],
        'Conversation',
        new TextEncoder().encode('Let\' talk'),
        { priority: 'normal' }
      )

      expect(message?.direction).toBe('bidirectional')
    })

    it('should create reverse channel entries', async () => {
      await messenger.sendDirectional(
        'alice@domain.com',
        'bidirectional',
        ['bob@domain.com', 'charlie@domain.com'],
        'Chat',
        new TextEncoder().encode('Open channel')
      )

      // Should create reverse entries for bidirectional communication
      expect(bindings.QUANTUM_MESSAGES.put).toHaveBeenCalledWith(
        expect.stringContaining('bidir:reverse:'),
        expect.any(String),
        expect.any(Object)
      )
    })
  })

  describe('Broadcast Direction', () => {
    it('should broadcast to multiple recipients', async () => {
      const recipients = ['user1', 'user2', 'user3', 'user4', 'user5']
      const message = await messenger.sendDirectional(
        'admin@domain.com',
        'broadcast',
        recipients,
        'Announcement',
        new TextEncoder().encode('Important update to all'),
        { priority: 'critical' }
      )

      expect(message?.direction).toBe('broadcast')
      expect(message?.recipients).toEqual(recipients)
      expect(message?.metadata.priority).toBe('critical')
    })

    it('should store large broadcast payloads in R2', async () => {
      // Create large body that exceeds 100KB threshold
      const largeBody = new Uint8Array(150 * 1024)

      await messenger.sendDirectional(
        'admin@domain.com',
        'broadcast',
        ['user1', 'user2'],
        'Large Broadcast',
        largeBody,
        { priority: 'high' }
      )

      // Should call R2 put for large payload
      expect(bindings.QUANTUM_PAYLOADS.put).toHaveBeenCalled()
    })

    it('should include cache metadata in broadcast', async () => {
      await messenger.sendDirectional(
        'admin@domain.com',
        'broadcast',
        ['user1', 'user2'],
        'Cached Broadcast',
        new TextEncoder().encode('Content'),
        { ttl: 3600, priority: 'normal' }
      )

      expect(bindings.QUANTUM_MESSAGES.put).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          expirationTtl: expect.any(Number)
        })
      )
    })
  })

  describe('Targeted Direction', () => {
    it('should send targeted message with delivery guarantee', async () => {
      const message = await messenger.sendDirectional(
        'alice@domain.com',
        'targeted',
        ['bob@domain.com'],
        'Private Message',
        new TextEncoder().encode('For your eyes only'),
        { priority: 'high', requiresReceipt: true }
      )

      expect(message?.direction).toBe('targeted')
      expect(message?.metadata.requiresReceipt).toBe(true)
    })

    it('should register delivery receipt expectations', async () => {
      await messenger.sendDirectional(
        'alice@domain.com',
        'targeted',
        ['bob@domain.com', 'charlie@domain.com'],
        'Targeted Msgs',
        new TextEncoder().encode('Body'),
        { requiresReceipt: true }
      )

      // Should create receipt expectation entries in MESSAGE_RECEIPTS
      expect(bindings.MESSAGE_RECEIPTS.put).toHaveBeenCalled()
    })

    it('should map each recipient individually', async () => {
      const recipients = ['user1', 'user2', 'user3']
      await messenger.sendDirectional(
        'sender',
        'targeted',
        recipients,
        'Individual Targeted',
        new TextEncoder().encode('Body'),
        { requiresReceipt: true }
      )

      // Each recipient should have their own targeted entry
      const putCalls = (bindings.QUANTUM_MESSAGES.put as any).mock.calls
      const targetedCalls = putCalls.filter((call: any[]) =>
        call[0].startsWith('targeted:')
      )

      expect(targetedCalls.length).toBeGreaterThanOrEqual(recipients.length)
    })
  })

  describe('Message Retrieval', () => {
    it('should retrieve forward message', async () => {
      ;(bindings.QUANTUM_MESSAGES.get as any).mockResolvedValue(
        JSON.stringify({
          id: 'msg-123',
          direction: 'forward',
          sender: 'alice',
          recipients: ['bob'],
          quantumEncrypted: {
            ciphertext: '1234567890ab',
            nonce: '1111111111111111',
            signature: '2222222222222222',
            publicKey: '3333333333333333'
          },
          metadata: { ttl: 3600, priority: 'normal', requiresReceipt: false, contentHash: 'abc' },
          receipts: []
        })
      )

      const result = await messenger.retrieveMessage('msg-123', 'bob')
      expect(result).toBeDefined()
      expect(result?.message.direction).toBe('forward')
    })

    it('should retrieve bidirectional message', async () => {
      ;(bindings.QUANTUM_MESSAGES.get as any).mockResolvedValue(
        JSON.stringify({
          id: 'msg-456',
          direction: 'bidirectional',
          sender: 'alice',
          recipients: ['bob'],
          quantumEncrypted: {
            ciphertext: '1234567890ab',
            nonce: '1111111111111111',
            signature: '2222222222222222',
            publicKey: '3333333333333333'
          },
          metadata: { ttl: 3600, priority: 'normal', requiresReceipt: false, contentHash: 'def' },
          receipts: []
        })
      )

      const result = await messenger.retrieveMessage('msg-456', 'bob')
      expect(result?.message.direction).toBe('bidirectional')
    })

    it('should return null for non-existent message', async () => {
      ;(bindings.QUANTUM_MESSAGES.get as any).mockResolvedValue(null)

      const result = await messenger.retrieveMessage('nonexistent', 'bob')
      expect(result).toBeNull()
    })
  })

  describe('Receipt Management', () => {
    it('should record message receipt', async () => {
      await messenger.recordReceipt('msg-123', 'bob@domain.com', 'signature-123')

      expect(bindings.MESSAGE_RECEIPTS.put).toHaveBeenCalledWith(
        expect.stringContaining('receipt:msg-123:bob@domain.com'),
        expect.stringContaining('msg-123'),
        expect.objectContaining({
          expirationTtl: 30 * 24 * 60 * 60 // 30 days
        })
      )
    })

    it('should include timestamp in receipt', async () => {
      const beforeTime = Date.now()
      await messenger.recordReceipt('msg-789', 'alice@domain.com', 'sig-789')
      const afterTime = Date.now()

      expect(bindings.MESSAGE_RECEIPTS.put).toHaveBeenCalled()
      const call = (bindings.MESSAGE_RECEIPTS.put as any).mock.calls[0]
      const receipt = JSON.parse(call[1])

      expect(receipt.receivedAt).toBeGreaterThanOrEqual(beforeTime)
      expect(receipt.receivedAt).toBeLessThanOrEqual(afterTime)
    })
  })

  describe('Multi-Directional Scenarios', () => {
    it('should handle request-response cycle', async () => {
      // Alice sends request (forward)
      const request = await messenger.sendDirectional(
        'alice@domain.com',
        'forward',
        ['bob@domain.com'],
        'Request',
        new TextEncoder().encode('Please help'),
        { priority: 'high', requiresReceipt: true }
      )

      expect(request?.direction).toBe('forward')

      // Bob sends response (backward)
      const response = await messenger.sendDirectional(
        'bob@domain.com',
        'backward',
        ['alice@domain.com'],
        'Response',
        new TextEncoder().encode('Happy to help'),
        { priority: 'high' }
      )

      expect(response?.direction).toBe('backward')
    })

    it('should handle chat conversation (bidirectional)', async () => {
      // Establish bidirectional channel
      const initial = await messenger.sendDirectional(
        'alice@domain.com',
        'bidirectional',
        ['bob@domain.com'],
        'Start chat',
        new TextEncoder().encode('Hey, let\' chat'),
        { priority: 'normal' }
      )

      expect(initial?.direction).toBe('bidirectional')

      // Continue conversation
      const response = await messenger.sendDirectional(
        'bob@domain.com',
        'bidirectional',
        ['alice@domain.com'],
        'Re: Start chat',
        new TextEncoder().encode('Sure thing!'),
        { priority: 'normal' }
      )

      expect(response?.direction).toBe('bidirectional')
    })

    it('should handle group announcement (broadcast)', async () => {
      const teams = ['team-engineering', 'team-sales', 'team-marketing']

      const announcement = await messenger.sendDirectional(
        'ceo@company.com',
        'broadcast',
        teams,
        'Company Announcement',
        new TextEncoder().encode('Q3 results are out'),
        { priority: 'critical', requiresReceipt: false }
      )

      expect(announcement?.direction).toBe('broadcast')
      expect(announcement?.recipients.length).toBe(3)
    })

    it('should handle priority-based routing', async () => {
      const priorities: Array<'low' | 'normal' | 'high' | 'critical'> = [
        'low',
        'normal',
        'high',
        'critical'
      ]

      for (const priority of priorities) {
        const message = await messenger.sendDirectional(
          'sender',
          'targeted',
          ['recipient'],
          `Priority ${priority}`,
          new TextEncoder().encode('Body'),
          { priority, requiresReceipt: priority !== 'low' }
        )

        expect(message?.metadata.priority).toBe(priority)
      }
    })
  })

  describe('Quantum Encryption', () => {
    it('should include quantum encryption metadata', async () => {
      const message = await messenger.sendDirectional(
        'alice',
        'forward',
        ['bob'],
        'Encrypted',
        new TextEncoder().encode('Secret'),
        {}
      )

      expect(message?.quantumEncrypted).toBeDefined()
      expect(message?.quantumEncrypted.ciphertext).toBeDefined()
      expect(message?.quantumEncrypted.nonce).toBeDefined()
      expect(message?.quantumEncrypted.signature).toBeDefined()
      expect(message?.quantumEncrypted.publicKey).toBeDefined()
    })

    it('should compute content hash', async () => {
      const message = await messenger.sendDirectional(
        'alice',
        'forward',
        ['bob'],
        'Hash Test',
        new TextEncoder().encode('Content'),
        {}
      )

      expect(message?.metadata.contentHash).toBeDefined()
      expect(typeof message?.metadata.contentHash).toBe('string')
      expect(message?.metadata.contentHash.length).toBeGreaterThan(0)
    })
  })

  describe('Performance & Scale', () => {
    it('should send multiple messages concurrently', async () => {
      const promises = []
      for (let i = 0; i < 10; i++) {
        promises.push(
          messenger.sendDirectional(
            'sender',
            'forward' as Direction,
            [`recipient${i}`],
            `Message ${i}`,
            new TextEncoder().encode(`Body ${i}`),
            {}
          )
        )
      }

      const results = await Promise.all(promises)
      expect(results.length).toBe(10)
      expect(results.every(r => r !== null)).toBe(true)
    })

    it('should handle large recipient lists (broadcast)', async () => {
      const largeRecipientList = Array.from({ length: 1000 }, (_, i) => `user${i}`)

      const message = await messenger.sendDirectional(
        'broadcaster',
        'broadcast',
        largeRecipientList,
        'Large Broadcast',
        new TextEncoder().encode('Message to many'),
        { priority: 'normal' }
      )

      expect(message?.recipients.length).toBe(1000)
    })
  })
})
