/**
 * Secure Chat RBAC & Quantum Signalling Tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  secureChat,
  RBACEngine,
  QuantumSignaller,
  type Role
} from '../src/mcp/secure-chat-rbac.js'

describe('Secure Chat with RBAC & Quantum Signalling', () => {
  let rbac: RBACEngine
  let quantumSignaller: QuantumSignaller
  let adminToken: string
  let userToken: string
  let guestToken: string

  beforeEach(() => {
    rbac = new RBACEngine()
    quantumSignaller = new QuantumSignaller()

    // Issue tokens
    adminToken = rbac.issueToken('admin-user', 'admin')
    userToken = rbac.issueToken('regular-user', 'user')
    guestToken = rbac.issueToken('guest-user', 'guest')
  })

  describe('RBAC Access Control', () => {
    it('should verify tokens correctly', () => {
      const context = rbac.verifyToken(adminToken)
      expect(context).toBeDefined()
      expect(context?.role).toBe('admin')
      expect(context?.userId).toBe('admin-user')
    })

    it('should reject invalid tokens', () => {
      const context = rbac.verifyToken('invalid-token')
      expect(context).toBeNull()
    })

    it('should revoke tokens', () => {
      rbac.revokeToken(adminToken)
      const context = rbac.verifyToken(adminToken)
      expect(context).toBeNull()
    })

    it('admin should have all permissions', () => {
      const context = rbac.verifyToken(adminToken)
      if (!context) throw new Error('Admin token invalid')

      expect(rbac.canAccess(context, 'read', 'public')).toBe(true)
      expect(rbac.canAccess(context, 'write', 'public')).toBe(true)
      expect(rbac.canAccess(context, 'execute', 'restricted')).toBe(true)
      expect(rbac.canAccess(context, 'sign', 'quantum-only')).toBe(true)
      expect(rbac.canAccess(context, 'verify', 'quantum-only')).toBe(true)
    })

    it('user should have limited permissions', () => {
      const context = rbac.verifyToken(userToken)
      if (!context) throw new Error('User token invalid')

      expect(rbac.canAccess(context, 'read', 'public')).toBe(true)
      expect(rbac.canAccess(context, 'write', 'internal')).toBe(true)
      expect(rbac.canAccess(context, 'read', 'restricted')).toBe(false)
      expect(rbac.canAccess(context, 'execute', 'quantum-only')).toBe(false)
    })

    it('guest should only read public content', () => {
      const context = rbac.verifyToken(guestToken)
      if (!context) throw new Error('Guest token invalid')

      expect(rbac.canAccess(context, 'read', 'public')).toBe(true)
      expect(rbac.canAccess(context, 'read', 'internal')).toBe(false)
      expect(rbac.canAccess(context, 'write', 'public')).toBe(false)
      expect(rbac.canAccess(context, 'execute', 'quantum-only')).toBe(false)
    })

    it('should enforce payload size limits per role', () => {
      const adminPolicy = rbac.getPolicy('admin')
      const userPolicy = rbac.getPolicy('user')
      const guestPolicy = rbac.getPolicy('guest')

      expect(adminPolicy?.maxPayloadSize).toBeGreaterThan(
        userPolicy?.maxPayloadSize ?? 0
      )
      expect(userPolicy?.maxPayloadSize).toBeGreaterThan(
        guestPolicy?.maxPayloadSize ?? 0
      )
    })
  })

  describe('Quantum Signalling & Encryption', () => {
    it('should generate quantum keys', () => {
      const key = quantumSignaller.generateKey('user-1')
      expect(key.id).toBeDefined()
      expect(key.publicKey.length).toBe(32)
      expect(key.quantumEntanglement).toBeDefined()
      expect(key.rotationPhase).toBeGreaterThanOrEqual(0)
      expect(key.rotationPhase).toBeLessThan(2 * Math.PI)
    })

    it('should encrypt signals', () => {
      const key1 = quantumSignaller.generateKey('user-1')
      const key2 = quantumSignaller.generateKey('user-2')

      const plaintext = new TextEncoder().encode('Secret message')
      const signal = quantumSignaller.encryptSignal(plaintext, key1.id, key2.id)

      expect(signal.id).toBeDefined()
      expect(signal.sender).toBe(key1.id)
      expect(signal.path).toContain(key1.id)
      expect(signal.path).toContain(key2.id)
      expect(signal.signal.length).toBe(plaintext.length)
      expect(signal.signature.length).toBe(32)
      expect(signal.nonce.length).toBe(16)
    })

    it('should decrypt signals', () => {
      const key1 = quantumSignaller.generateKey('user-1')
      const key2 = quantumSignaller.generateKey('user-2')

      const plaintext = new TextEncoder().encode('Confidential data')
      const signal = quantumSignaller.encryptSignal(plaintext, key1.id, key2.id)

      const decrypted = quantumSignaller.decryptSignal(signal, key2.id, key1.id)
      expect(new TextDecoder().decode(decrypted)).toBe('Confidential data')
    })

    it('should reject tampered signals', () => {
      const key1 = quantumSignaller.generateKey('user-1')
      const key2 = quantumSignaller.generateKey('user-2')

      const plaintext = new TextEncoder().encode('Original message')
      const signal = quantumSignaller.encryptSignal(plaintext, key1.id, key2.id)

      // Tamper with signal
      signal.signal[0] ^= 0xFF

      expect(() => {
        quantumSignaller.decryptSignal(signal, key2.id, key1.id)
      }).toThrow()
    })

    it('should maintain signal history', () => {
      const key1 = quantumSignaller.generateKey('user-1')
      const key2 = quantumSignaller.generateKey('user-2')

      for (let i = 0; i < 5; i++) {
        quantumSignaller.encryptSignal(
          new TextEncoder().encode(`Message ${i}`),
          key1.id,
          key2.id
        )
      }

      const history = quantumSignaller.getSignalHistory(10)
      expect(history.length).toBe(5)
    })
  })

  describe('Secure Messaging', () => {
    it('user can send public message', () => {
      const message = secureChat.sendMessage(
        userToken,
        ['recipient@domain.com'],
        'Hello',
        new TextEncoder().encode('World'),
        'public'
      )

      expect(message).toBeDefined()
      expect(message?.sender).toBe('regular-user')
      expect(message?.classification).toBe('public')
      expect(message?.recipients).toContain('recipient@domain.com')
    })

    it('user can send internal message', () => {
      const message = secureChat.sendMessage(
        userToken,
        ['internal-user'],
        'Internal Info',
        new TextEncoder().encode('For team only'),
        'internal'
      )

      expect(message).not.toBeNull()
      expect(message?.classification).toBe('internal')
    })

    it('user cannot send restricted message', () => {
      const message = secureChat.sendMessage(
        userToken,
        ['admin'],
        'Unauthorized',
        new TextEncoder().encode('Should fail'),
        'restricted'
      )

      expect(message).toBeNull()
    })

    it('guest cannot write messages', () => {
      const message = secureChat.sendMessage(
        guestToken,
        ['user@domain.com'],
        'Guest Post',
        new TextEncoder().encode('Hello'),
        'public'
      )

      expect(message).toBeNull()
    })

    it('admin can send quantum-only messages', () => {
      const message = secureChat.sendMessage(
        adminToken,
        ['quantum-peer'],
        'Quantum Data',
        new TextEncoder().encode('Quantum content'),
        'quantum-only'
      )

      expect(message).not.toBeNull()
      expect(message?.classification).toBe('quantum-only')
    })

    it('should reject oversized payloads', () => {
      // Create 15MB payload (exceeds user limit of 10MB)
      const largePayload = new Uint8Array(15 * 1024 * 1024)
      const message = secureChat.sendMessage(
        userToken,
        ['recipient'],
        'Large',
        largePayload,
        'internal'
      )

      expect(message).toBeNull()
    })
  })

  describe('Message Access & Decryption', () => {
    let messageId: string

    beforeEach(() => {
      const message = secureChat.sendMessage(
        userToken,
        ['regular-user', 'another-user'],
        'Test Message',
        new TextEncoder().encode('Secret content'),
        'internal'
      )
      if (message) {
        messageId = message.id
      }
    })

    it('recipient can read message', () => {
      const message = secureChat.readMessage(messageId, userToken)
      expect(message).not.toBeNull()
      expect(message?.subject).toBe('Test Message')
    })

    it('non-recipient cannot read message', () => {
      const message = secureChat.readMessage(messageId, guestToken)
      expect(message).toBeNull()
    })

    it('admin can read any message', () => {
      const message = secureChat.readMessage(messageId, adminToken)
      expect(message).not.toBeNull()
    })

    it('can decrypt message body', () => {
      const readMessage = secureChat.readMessage(messageId, userToken)
      if (!readMessage) throw new Error('Message not found')

      const body = secureChat.decryptMessageBody(readMessage, userToken)
      expect(body).not.toBeNull()
      if (body) {
        expect(new TextDecoder().decode(body)).toBe('Secret content')
      }
    })

    it('should log access on read', () => {
      secureChat.readMessage(messageId, userToken)
      const payload = secureChat.getAccessLog(`payload_${messageId}`)

      expect(payload).not.toBeNull()
      if (payload) {
        const readLog = payload.find(log => log.action === 'read')
        expect(readLog).toBeDefined()
        expect(readLog?.userId).toBe('regular-user')
      }
    })
  })

  describe('Channels & Broadcasting', () => {
    it('admin can create channel', () => {
      const success = secureChat.createChannel(
        'team-alpha',
        ['user1', 'user2', 'user3'],
        adminToken
      )
      expect(success).toBe(true)
    })

    it('non-admin cannot create channel', () => {
      const success = secureChat.createChannel(
        'team-beta',
        ['user1', 'user2'],
        userToken
      )
      expect(success).toBe(false)
    })

    it('can broadcast to channel', () => {
      secureChat.createChannel('channel-x', ['user1', 'user2'], adminToken)

      const success = secureChat.broadcastToChannel(
        'channel-x',
        'Channel Announcement',
        new TextEncoder().encode('Important update'),
        adminToken,
        'internal'
      )

      expect(success).toBe(true)
    })

    it('user can broadcast to joined channel', () => {
      secureChat.createChannel('open-channel', ['regular-user', 'other-user'], adminToken)

      const success = secureChat.broadcastToChannel(
        'open-channel',
        'User Update',
        new TextEncoder().encode('My thoughts'),
        userToken,
        'public'
      )

      expect(success).toBe(true)
    })
  })

  describe('State Coordination', () => {
    it('system can update coordination state', () => {
      const systemToken = rbac.issueToken('system-user', 'system')
      const success = secureChat.updateCoordinationState(
        'cluster-status',
        { nodes: 5, healthy: 5 },
        systemToken
      )
      expect(success).toBe(true)
    })

    it('admin can update coordination state', () => {
      const success = secureChat.updateCoordinationState(
        'config-version',
        { version: '1.0.2' },
        adminToken
      )
      expect(success).toBe(true)
    })

    it('regular user cannot update coordination state', () => {
      const success = secureChat.updateCoordinationState(
        'sensitive-config',
        { secret: 'data' },
        userToken
      )
      expect(success).toBe(false)
    })

    it('can retrieve coordination state', () => {
      secureChat.updateCoordinationState(
        'shared-state',
        { value: 42 },
        adminToken
      )

      const state = secureChat.getCoordinationState('shared-state', userToken)
      expect(state).toEqual({ value: 42 })
    })

    it('cannot retrieve state with invalid token', () => {
      const state = secureChat.getCoordinationState('any-key', 'invalid-token')
      expect(state).toBeNull()
    })
  })

  describe('Event Emissions', () => {
    it('should emit user-registered event', (done) => {
      const chat = secureChat
      chat.on('user-registered', (data) => {
        expect(data.userId).toBeDefined()
        expect(data.role).toBeDefined()
        done()
      })

      rbac.issueToken('test-user', 'user')
    })

    it('should emit access-denied event', (done) => {
      const chat = secureChat
      chat.on('access-denied', () => {
        done()
      })

      // Try to send restricted message as user
      secureChat.sendMessage(
        userToken,
        ['recipient'],
        'Try',
        new TextEncoder().encode('Restricted'),
        'restricted'
      )
    })

    it('should emit message-sent event', (done) => {
      const chat = secureChat
      chat.on('message-sent', (data) => {
        expect(data.messageId).toBeDefined()
        done()
      })

      secureChat.sendMessage(
        userToken,
        ['recipient'],
        'Test',
        new TextEncoder().encode('Message'),
        'public'
      )
    })
  })

  describe('Performance & Scale', () => {
    it('should handle concurrent messages', async () => {
      const promises = []
      for (let i = 0; i < 10; i++) {
        promises.push(
          Promise.resolve(
            secureChat.sendMessage(
              userToken,
              ['recipient'],
              `Message ${i}`,
              new TextEncoder().encode(`Body ${i}`),
              'public'
            )
          )
        )
      }

      const results = await Promise.all(promises)
      expect(results.filter(r => r !== null).length).toBe(10)
    })

    it('should maintain performance with many channels', () => {
      for (let i = 0; i < 100; i++) {
        secureChat.createChannel(`channel-${i}`, ['user1', 'user2'], adminToken)
      }

      expect(secureChat.getChannelCount()).toBe(100)
    })

    it('should track payload counts', () => {
      const initialCount = secureChat.getPayloadCount()

      secureChat.sendMessage(
        userToken,
        ['recipient'],
        'Test',
        new TextEncoder().encode('Payload'),
        'public'
      )

      expect(secureChat.getPayloadCount()).toBe(initialCount + 1)
    })
  })
})
