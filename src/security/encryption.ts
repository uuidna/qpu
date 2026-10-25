// WAVE 8D: Encryption Layer
// At-rest and in-transit encryption, key management, field-level encryption

import * as crypto from 'crypto'

/**
 * Encryption algorithm types
 */
export enum EncryptionAlgorithm {
  AES_256_GCM = 'aes-256-gcm',
  AES_256_CBC = 'aes-256-cbc',
  ChaCha20_Poly1305 = 'chacha20-poly1305',
  RSA_OAEP = 'rsa-oaep'
}

/**
 * Encryption key metadata
 */
export interface EncryptionKey {
  id: string
  algorithm: EncryptionAlgorithm
  key: Buffer // Actual key material (encrypted at rest in production)
  publicKey?: Buffer // For asymmetric encryption
  createdAt: Date
  rotatedAt?: Date
  expiresAt?: Date
  status: 'active' | 'retired' | 'revoked'
  ownerTeamId?: string
}

/**
 * Encrypted data result
 */
export interface EncryptedData {
  ciphertext: string // Base64 encoded
  iv: string // Base64 encoded initialization vector
  tag: string // Base64 encoded authentication tag (for GCM)
  algorithm: EncryptionAlgorithm
  keyId: string // Reference to the key used
  metadata?: Record<string, any>
}

/**
 * Key rotation policy
 */
export interface KeyRotationPolicy {
  enabled: boolean
  rotationIntervalDays: number
  retentionDays: number // How long to keep retired keys
  algorithm: EncryptionAlgorithm
  autoRotate: boolean
}

/**
 * TLS/mTLS configuration
 */
export interface TLSConfig {
  enabled: boolean
  certificatePath: string
  keyPath: string
  caPath?: string
  minVersion: 'TLSv1.2' | 'TLSv1.3'
  cipherSuites: string[]
  requireClientCert: boolean
}

/**
 * Encryption Service
 */
export class EncryptionService {
  private keyStore: Map<string, EncryptionKey> = new Map()
  private activeKeyId: string | null = null
  private rotationPolicies: Map<string, KeyRotationPolicy> = new Map()
  private tlsConfig: TLSConfig | null = null

  constructor() {
    this.initializeMasterKey()
  }

  /**
   * Initialize master encryption key
   */
  private initializeMasterKey(): void {
    // In production, this should be loaded from a secure key management system
    // like AWS KMS, Azure Key Vault, or HashiCorp Vault
    const masterKeyId = 'master-key-' + Date.now()
    const masterKey: EncryptionKey = {
      id: masterKeyId,
      algorithm: EncryptionAlgorithm.AES_256_GCM,
      key: crypto.randomBytes(32), // 256-bit key
      createdAt: new Date(),
      status: 'active',
      ownerTeamId: 'system'
    }

    this.keyStore.set(masterKeyId, masterKey)
    this.activeKeyId = masterKeyId
  }

  /**
   * Generate a new encryption key
   */
  generateKey(algorithm: EncryptionAlgorithm = EncryptionAlgorithm.AES_256_GCM): EncryptionKey {
    const keyId = 'key-' + crypto.randomBytes(16).toString('hex')
    let key: Buffer
    let publicKey: Buffer | undefined

    switch (algorithm) {
      case EncryptionAlgorithm.AES_256_GCM:
      case EncryptionAlgorithm.AES_256_CBC:
        key = crypto.randomBytes(32) // 256-bit key
        break
      case EncryptionAlgorithm.ChaCha20_Poly1305:
        key = crypto.randomBytes(32) // 256-bit key
        break
      case EncryptionAlgorithm.RSA_OAEP:
        const { publicKey: pub, privateKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 2048,
          publicKeyEncoding: { type: 'spki', format: 'der' },
          privateKeyEncoding: { type: 'pkcs8', format: 'der' }
        })
        key = privateKey
        publicKey = pub
        break
      default:
        throw new Error(`Unsupported algorithm: ${algorithm}`)
    }

    const encryptionKey: EncryptionKey = {
      id: keyId,
      algorithm,
      key,
      publicKey,
      createdAt: new Date(),
      status: 'active'
    }

    this.keyStore.set(keyId, encryptionKey)
    return encryptionKey
  }

  /**
   * Encrypt data at rest
   */
  encryptAtRest(plaintext: string | Buffer, keyId?: string): EncryptedData {
    const key = this.getKey(keyId || this.activeKeyId!)
    if (!key) throw new Error('Encryption key not found')

    const plaintextBuffer = Buffer.isBuffer(plaintext) ? plaintext : Buffer.from(plaintext, 'utf-8')
    const iv = crypto.randomBytes(16)

    let ciphertext: Buffer
    let tag: Buffer | undefined

    switch (key.algorithm) {
      case EncryptionAlgorithm.AES_256_GCM: {
        const cipher = crypto.createCipheriv(key.algorithm, key.key, iv)
        ciphertext = Buffer.concat([cipher.update(plaintextBuffer), cipher.final()])
        tag = cipher.getAuthTag()
        break
      }
      case EncryptionAlgorithm.AES_256_CBC: {
        const cipher = crypto.createCipheriv(key.algorithm, key.key, iv)
        ciphertext = Buffer.concat([cipher.update(plaintextBuffer), cipher.final()])
        break
      }
      case EncryptionAlgorithm.ChaCha20_Poly1305: {
        const cipher = crypto.createCipheriv(key.algorithm, key.key, iv)
        ciphertext = Buffer.concat([cipher.update(plaintextBuffer), cipher.final()])
        tag = cipher.getAuthTag()
        break
      }
      default:
        throw new Error(`Unsupported algorithm: ${key.algorithm}`)
    }

    return {
      ciphertext: ciphertext.toString('base64'),
      iv: iv.toString('base64'),
      tag: tag ? tag.toString('base64') : '',
      algorithm: key.algorithm,
      keyId: key.id
    }
  }

  /**
   * Decrypt data at rest
   */
  decryptAtRest(encrypted: EncryptedData): string {
    const key = this.getKey(encrypted.keyId)
    if (!key) throw new Error('Encryption key not found')

    const ciphertext = Buffer.from(encrypted.ciphertext, 'base64')
    const iv = Buffer.from(encrypted.iv, 'base64')
    const tag = encrypted.tag ? Buffer.from(encrypted.tag, 'base64') : undefined

    let plaintext: Buffer

    switch (encrypted.algorithm) {
      case EncryptionAlgorithm.AES_256_GCM: {
        const decipher = crypto.createDecipheriv(encrypted.algorithm, key.key, iv)
        if (tag) decipher.setAuthTag(tag)
        plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()])
        break
      }
      case EncryptionAlgorithm.AES_256_CBC: {
        const decipher = crypto.createDecipheriv(encrypted.algorithm, key.key, iv)
        plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()])
        break
      }
      case EncryptionAlgorithm.ChaCha20_Poly1305: {
        const decipher = crypto.createDecipheriv(encrypted.algorithm, key.key, iv)
        if (tag) decipher.setAuthTag(tag)
        plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()])
        break
      }
      default:
        throw new Error(`Unsupported algorithm: ${encrypted.algorithm}`)
    }

    return plaintext.toString('utf-8')
  }

  /**
   * Hash data (one-way, for comparison)
   */
  hash(data: string | Buffer): string {
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf-8')
    return crypto.createHash('sha256').update(buffer).digest('hex')
  }

  /**
   * Create HMAC for integrity verification
   */
  createHMAC(data: string | Buffer, keyId?: string): string {
    const key = this.getKey(keyId || this.activeKeyId!)
    if (!key) throw new Error('Key not found')

    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf-8')
    return crypto.createHmac('sha256', key.key).update(buffer).digest('hex')
  }

  /**
   * Verify HMAC
   */
  verifyHMAC(data: string | Buffer, hmac: string, keyId: string): boolean {
    try {
      const expectedHMAC = this.createHMAC(data, keyId)
      return crypto.timingSafeEqual(Buffer.from(expectedHMAC), Buffer.from(hmac))
    } catch {
      return false
    }
  }

  /**
   * Rotate encryption key
   */
  rotateKey(keyId: string): EncryptionKey {
    const oldKey = this.getKey(keyId)
    if (!oldKey) throw new Error('Key not found')

    oldKey.status = 'retired'
    oldKey.rotatedAt = new Date()

    const newKey = this.generateKey(oldKey.algorithm)
    if (oldKey.ownerTeamId) newKey.ownerTeamId = oldKey.ownerTeamId
    this.activeKeyId = newKey.id

    return newKey
  }

  /**
   * Get key from store
   */
  private getKey(keyId: string): EncryptionKey | null {
    return this.keyStore.get(keyId) || null
  }

  /**
   * Set key rotation policy
   */
  setKeyRotationPolicy(keyId: string, policy: KeyRotationPolicy): void {
    this.rotationPolicies.set(keyId, policy)
  }

  /**
   * Check and perform key rotation if needed
   */
  checkKeyRotation(keyId: string): EncryptionKey | null {
    const policy = this.rotationPolicies.get(keyId)
    const key = this.getKey(keyId)

    if (!policy || !key || !policy.autoRotate) return null

    const daysSinceRotation = (Date.now() - (key.rotatedAt || key.createdAt).getTime()) / (1000 * 60 * 60 * 24)

    if (daysSinceRotation >= policy.rotationIntervalDays) {
      return this.rotateKey(keyId)
    }

    return null
  }

  /**
   * Configure TLS/mTLS
   */
  configureTLS(config: TLSConfig): void {
    this.tlsConfig = config
  }

  /**
   * Get TLS configuration
   */
  getTLSConfig(): TLSConfig | null {
    return this.tlsConfig
  }

  /**
   * Generate certificate and key for mTLS
   */
  generateTLSCertificate(commonName: string, validDays: number = 365): {
    certificate: string
    key: string
  } {
    // In production, use a proper certificate authority
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    })

    // This is simplified - use proper X.509 certificate generation in production
    return {
      certificate: publicKey as string,
      key: privateKey as string
    }
  }

  /**
   * List all keys
   */
  listKeys(): EncryptionKey[] {
    return Array.from(this.keyStore.values())
  }

  /**
   * Revoke key
   */
  revokeKey(keyId: string): void {
    const key = this.getKey(keyId)
    if (key) {
      key.status = 'revoked'
    }
  }

  /**
   * Get encryption statistics
   */
  getStatistics(): {
    totalKeys: number
    activeKeys: number
    retiredKeys: number
    revokedKeys: number
  } {
    const keys = this.listKeys()
    return {
      totalKeys: keys.length,
      activeKeys: keys.filter((k) => k.status === 'active').length,
      retiredKeys: keys.filter((k) => k.status === 'retired').length,
      revokedKeys: keys.filter((k) => k.status === 'revoked').length
    }
  }
}

/**
 * Create a global encryption service instance
 */
export const encryptionService = new EncryptionService()
