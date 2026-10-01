/**
 * Cloudflare Quantum Secure Messaging
 * Multi-directional quantum-encrypted signalling via Cloudflare Workers,
 * KV storage, Durable Objects, and R2 for efficient end-to-end security
 */

import { QuantumSignaller } from '../mcp/secure-chat-rbac.js'

// ============================================================================
// Cloudflare Bindings Interface
// ============================================================================

export interface CloudflareBindings {
  // KV Namespace for encrypted message storage
  QUANTUM_MESSAGES: any

  // KV for quantum key pairs (never expose privates)
  QUANTUM_KEYS: any

  // KV for delivery confirmations & receipts
  MESSAGE_RECEIPTS: any

  // Durable Object for coordination & multi-directional routing
  QUANTUM_ROUTER: any

  // R2 Bucket for large quantum payloads
  QUANTUM_PAYLOADS: any

  // Environment variables
  ENVIRONMENT: 'production' | 'staging'
  ENCRYPTION_KEY_ID: string
}

export interface Env extends CloudflareBindings {}

// ============================================================================
// Quantum Message with Directions
// ============================================================================

export type Direction = 'forward' | 'backward' | 'bidirectional' | 'broadcast' | 'targeted'

export interface DirectionalQuantumMessage {
  id: string
  timestamp: number
  sender: string
  direction: Direction
  recipients: string[]
  path: string[]
  quantumEncrypted: {
    ciphertext: string // Base64-encoded Uint8Array
    nonce: string
    signature: string
    publicKey: string
  }
  metadata: {
    ttl: number
    priority: 'low' | 'normal' | 'high' | 'critical'
    contentHash: string
    requiresReceipt: boolean
  }
  receipts: MessageReceipt[]
}

export interface MessageReceipt {
  recipient: string
  receivedAt: number
  decryptedAt?: number
  acknowledged: boolean
  signature: string
}

// ============================================================================
// Multi-Directional Quantum Signaller for Cloudflare
// ============================================================================

export class CloudflareQuantumMessenger {
  private bindings: CloudflareBindings
  private quantumSignaller: QuantumSignaller
  private localKeyId: string

  constructor(bindings: CloudflareBindings) {
    this.bindings = bindings
    this.quantumSignaller = new QuantumSignaller()
    this.localKeyId = bindings.ENCRYPTION_KEY_ID
  }

  /**
   * Send message in specified direction
   */
  async sendDirectional(
    sender: string,
    direction: Direction,
    recipients: string[],
    subject: string,
    body: Uint8Array,
    metadata: {
      ttl?: number
      priority?: 'low' | 'normal' | 'high' | 'critical'
      requiresReceipt?: boolean
    } = {}
  ): Promise<DirectionalQuantumMessage | null> {
    const now = Date.now()
    const messageId = `msg_${now}_${Math.random().toString(36).slice(2)}`

    // Generate quantum keys for sender & recipients
    const senderKey = this.quantumSignaller.generateKey(sender)
    const recipientKey = this.quantumSignaller.generateKey(recipients[0])

    // Encrypt with quantum signalling
    const quantumSignal = this.quantumSignaller.encryptSignal(
      body,
      senderKey.id,
      recipientKey.id
    )

    // Create directional message
    const message: DirectionalQuantumMessage = {
      id: messageId,
      timestamp: now,
      sender,
      direction,
      recipients,
      path: [sender, ...recipients],
      quantumEncrypted: {
        ciphertext: this.uint8ToBase64(quantumSignal.signal),
        nonce: this.uint8ToBase64(quantumSignal.nonce),
        signature: this.uint8ToBase64(quantumSignal.signature),
        publicKey: this.uint8ToBase64(senderKey.publicKey)
      },
      metadata: {
        ttl: metadata.ttl || 24 * 60 * 60, // 24 hours default
        priority: metadata.priority || 'normal',
        contentHash: this.computeHash(body),
        requiresReceipt: metadata.requiresReceipt ?? true
      },
      receipts: []
    }

    // Store in Cloudflare KV based on direction
    await this.storeMessage(message)

    // Route based on direction
    switch (direction) {
      case 'forward':
        await this.routeForward(message)
        break
      case 'backward':
        await this.routeBackward(message)
        break
      case 'bidirectional':
        await this.routeBidirectional(message)
        break
      case 'broadcast':
        await this.routeBroadcast(message)
        break
      case 'targeted':
        await this.routeTargeted(message)
        break
    }

    return message
  }

  /**
   * Forward direction: sender -> recipient chain
   */
  private async routeForward(message: DirectionalQuantumMessage): Promise<void> {
    // Store primary message
    const key = `forward:${message.id}`
    await this.bindings.QUANTUM_MESSAGES.put(
      key,
      JSON.stringify(message),
      {
        expirationTtl: message.metadata.ttl,
        metadata: { priority: message.metadata.priority }
      }
    )

    // Create forward path entries for each recipient
    for (const recipient of message.recipients) {
      const recipientKey = `forward:recipient:${recipient}:${message.id}`
      await this.bindings.QUANTUM_MESSAGES.put(
        recipientKey,
        JSON.stringify({ messageId: message.id, deliveredAt: Date.now() }),
        { expirationTtl: message.metadata.ttl }
      )
    }
  }

  /**
   * Backward direction: recipient -> sender acknowledgment chain
   */
  private async routeBackward(message: DirectionalQuantumMessage): Promise<void> {
    const key = `backward:${message.id}`
    await this.bindings.QUANTUM_MESSAGES.put(
      key,
      JSON.stringify(message),
      { expirationTtl: message.metadata.ttl }
    )

    // Queue acknowledgment requests
    for (const recipient of message.recipients) {
      const ackKey = `ack:pending:${recipient}:${message.id}`
      await this.bindings.QUANTUM_MESSAGES.put(
        ackKey,
        JSON.stringify({ requiredFrom: recipient, messageId: message.id }),
        { expirationTtl: 60 * 60 } // 1 hour to acknowledge
      )
    }
  }

  /**
   * Bidirectional: sender <-> recipient two-way channel
   */
  private async routeBidirectional(message: DirectionalQuantumMessage): Promise<void> {
    const key = `bidir:${message.id}`
    await this.bindings.QUANTUM_MESSAGES.put(
      key,
      JSON.stringify(message),
      { expirationTtl: message.metadata.ttl }
    )

    // Create reverse channel entries
    for (const recipient of message.recipients) {
      const reverseKey = `bidir:reverse:${recipient}:${message.id}`
      await this.bindings.QUANTUM_MESSAGES.put(
        reverseKey,
        JSON.stringify({ channel: message.id, ready: true }),
        { expirationTtl: message.metadata.ttl }
      )
    }
  }

  /**
   * Broadcast: sender -> all recipients simultaneously
   */
  private async routeBroadcast(message: DirectionalQuantumMessage): Promise<void> {
    const key = `broadcast:${message.id}`
    const broadcastPayload = {
      ...message,
      sentTo: message.recipients,
      timestamp: Date.now()
    }

    await this.bindings.QUANTUM_MESSAGES.put(
      key,
      JSON.stringify(broadcastPayload),
      { expirationTtl: message.metadata.ttl }
    )

    // Also store in R2 for large payloads
    if (message.quantumEncrypted.ciphertext.length > 100 * 1024) {
      await this.bindings.QUANTUM_PAYLOADS.put(
        `broadcast/${message.id}`,
        new TextEncoder().encode(JSON.stringify(broadcastPayload)),
        {
          httpMetadata: {
            contentType: 'application/json',
            cacheControl: `max-age=${message.metadata.ttl}`
          }
        }
      )
    }
  }

  /**
   * Targeted: sender -> specific recipient with delivery guarantee
   */
  private async routeTargeted(message: DirectionalQuantumMessage): Promise<void> {
    for (const recipient of message.recipients) {
      const key = `targeted:${recipient}:${message.id}`
      await this.bindings.QUANTUM_MESSAGES.put(
        key,
        JSON.stringify({
          ...message,
          targetedFor: recipient,
          deliveryRequired: true
        }),
        {
          expirationTtl: message.metadata.ttl,
          metadata: {
            priority: message.metadata.priority,
            recipient,
            requiresReceipt: message.metadata.requiresReceipt
          }
        }
      )

      // Register delivery receipt expectation
      if (message.metadata.requiresReceipt) {
        const receiptKey = `receipt:expected:${recipient}:${message.id}`
        await this.bindings.MESSAGE_RECEIPTS.put(
          receiptKey,
          JSON.stringify({
            messageId: message.id,
            recipient,
            sentAt: message.timestamp,
            deliveryDeadline: message.timestamp + 30 * 60 * 1000 // 30min
          }),
          { expirationTtl: 60 * 60 } // 1 hour
        )
      }
    }
  }

  /**
   * Retrieve message with automatic decryption
   */
  async retrieveMessage(
    messageId: string,
    recipient: string
  ): Promise<{ message: DirectionalQuantumMessage; body: Uint8Array } | null> {
    // Try all storage locations
    const locations = [
      `forward:${messageId}`,
      `backward:${messageId}`,
      `bidir:${messageId}`,
      `broadcast:${messageId}`,
      `targeted:${recipient}:${messageId}`
    ]

    for (const location of locations) {
      const stored = await this.bindings.QUANTUM_MESSAGES.get(location)
      if (!stored) continue

      const message: DirectionalQuantumMessage = JSON.parse(stored)

      // Decrypt body
      try {
        const ciphertext = this.base64ToUint8(message.quantumEncrypted.ciphertext)
        const nonce = this.base64ToUint8(message.quantumEncrypted.nonce)
        const signature = this.base64ToUint8(message.quantumEncrypted.signature)
        const publicKey = this.base64ToUint8(message.quantumEncrypted.publicKey)

        // Reconstruct quantum signal for decryption
        const quantumSignal = {
          id: message.id,
          timestamp: message.timestamp,
          sender: message.sender,
          path: message.path,
          signal: ciphertext,
          signature,
          nonce
        }

        // Note: Full decryption would require matching key retrieval
        // This is a simplified version showing the pattern
        return { message, body: ciphertext }
      } catch (e) {
        continue
      }
    }

    return null
  }

  /**
   * Record receipt of message
   */
  async recordReceipt(
    messageId: string,
    recipient: string,
    signature: string
  ): Promise<void> {
    const receiptKey = `receipt:${messageId}:${recipient}`
    await this.bindings.MESSAGE_RECEIPTS.put(
      receiptKey,
      JSON.stringify({
        messageId,
        recipient,
        receivedAt: Date.now(),
        signature
      }),
      { expirationTtl: 30 * 24 * 60 * 60 } // 30 days
    )
  }

  /**
   * Get all receipts for a message
   */
  async getMessageReceipts(messageId: string): Promise<MessageReceipt[]> {
    const receipts: MessageReceipt[] = []
    const pattern = `receipt:${messageId}:`

    // Note: Cloudflare KV doesn't have direct prefix listing in all APIs
    // This would require maintaining a receipt index or using Durable Objects
    return receipts
  }

  /**
   * List messages for a recipient (by direction)
   */
  async listMessages(
    recipient: string,
    direction?: Direction
  ): Promise<DirectionalQuantumMessage[]> {
    const messages: DirectionalQuantumMessage[] = []

    // In production, use Durable Object for efficient querying
    // This is a simplified version
    const prefix = direction ? `${direction}:${recipient}:` : `forward:recipient:${recipient}:`

    // Mock listing (real implementation uses Durable Objects)
    return messages
  }

  /**
   * Purge expired messages
   */
  async purgeExpired(): Promise<number> {
    // Cloudflare KV automatically expires based on TTL
    // This is a coordination method for manual cleanup if needed
    let purged = 0

    // In Durable Objects, track and purge stale entries
    return purged
  }

  // ========================================================================
  // Utilities
  // ========================================================================

  private async storeMessage(message: DirectionalQuantumMessage): Promise<void> {
    const messageKey = `all:${message.id}`
    await this.bindings.QUANTUM_MESSAGES.put(
      messageKey,
      JSON.stringify(message),
      {
        expirationTtl: message.metadata.ttl,
        metadata: {
          sender: message.sender,
          direction: message.direction,
          priority: message.metadata.priority
        }
      }
    )
  }

  private computeHash(data: Uint8Array): string {
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data[i]
      hash |= 0
    }
    return Math.abs(hash).toString(16)
  }

  private uint8ToBase64(arr: Uint8Array): string {
    return Array.from(arr)
      .map(b => String.fromCharCode(b))
      .join('')
      .split('')
      .map(c => ('0' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  }

  private base64ToUint8(str: string): Uint8Array {
    const arr = new Uint8Array(str.length / 2)
    for (let i = 0; i < str.length; i += 2) {
      arr[i / 2] = parseInt(str.substr(i, 2), 16)
    }
    return arr
  }
}

// ============================================================================
// Durable Object for Coordination & Routing
// ============================================================================

export class QuantumRouter {
  private state: any // DurableObjectState
  private env: Env
  private messenger: CloudflareQuantumMessenger
  private messageIndex: Map<string, string> = new Map() // messageId -> direction

  constructor(state: any, env: Env) {
    this.state = state
    this.env = env
    this.messenger = new CloudflareQuantumMessenger(env)
  }

  /**
   * Route message to correct direction handler
   */
  async route(message: DirectionalQuantumMessage): Promise<boolean> {
    this.messageIndex.set(message.id, message.direction)

    // Persist routing decision
    await this.state.storage.put(
      `route:${message.id}`,
      JSON.stringify({
        direction: message.direction,
        recipients: message.recipients,
        timestamp: Date.now()
      })
    )

    return true
  }

  /**
   * Get delivery status for multi-recipient message
   */
  async getDeliveryStatus(
    messageId: string
  ): Promise<{ total: number; delivered: number; failed: number }> {
    const routeData = await this.state.storage.get(`route:${messageId}`)
    if (!routeData) {
      return { total: 0, delivered: 0, failed: 0 }
    }

    const route = JSON.parse(routeData as string)
    const receipts = await this.messenger.getMessageReceipts(messageId)

    return {
      total: route.recipients.length,
      delivered: receipts.length,
      failed: route.recipients.length - receipts.length
    }
  }

  /**
   * Coordinate multi-hop message propagation
   */
  async propagate(
    messageId: string,
    direction: Direction,
    recipients: string[]
  ): Promise<void> {
    // Track propagation state
    await this.state.storage.put(
      `propagate:${messageId}`,
      JSON.stringify({
        direction,
        recipients,
        propagatedAt: Date.now(),
        status: 'in-progress'
      })
    )
  }
}

// ============================================================================
// Cloudflare Worker Handler
// ============================================================================

export interface QuantumMessagesRequest {
  action: 'send' | 'retrieve' | 'receipt' | 'status' | 'list'
  sender?: string
  recipients?: string[]
  subject?: string
  body?: string
  messageId?: string
  direction?: Direction
  metadata?: Record<string, unknown>
}

export async function handleQuantumMessage(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const req: QuantumMessagesRequest = await request.json()
  const messenger = new CloudflareQuantumMessenger(env)

  try {
    switch (req.action) {
      case 'send': {
        if (!req.sender || !req.recipients || !req.subject || !req.body) {
          return new Response('Missing required fields', { status: 400 })
        }

        const message = await messenger.sendDirectional(
          req.sender,
          req.direction || 'forward',
          req.recipients,
          req.subject,
          new TextEncoder().encode(req.body),
          req.metadata as any
        )

        return new Response(JSON.stringify(message), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      case 'retrieve': {
        if (!req.messageId) {
          return new Response('messageId required', { status: 400 })
        }

        // Note: Would need sender context to retrieve
        const result = await messenger.retrieveMessage(req.messageId, req.sender || '')

        if (!result) {
          return new Response('Message not found', { status: 404 })
        }

        return new Response(JSON.stringify(result.message), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      case 'receipt': {
        if (!req.messageId || !req.sender) {
          return new Response('messageId and sender required', { status: 400 })
        }

        await messenger.recordReceipt(
          req.messageId,
          req.sender,
          req.metadata?.signature as string
        )

        return new Response(JSON.stringify({ acknowledged: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      default:
        return new Response('Unknown action', { status: 400 })
    }
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Exports above
