import crypto from 'node:crypto'
import { pbkdf2Sha256, randomBytes } from '../core/crypt.js'

// Payload hashes passwords through crypto.pbkdf2 (600000 iterations, SHA-256) and salts them with crypto.randomBytes.
// Both are answered by the qpu crypto, never by node:crypto: the same bytes, the full iteration count, on every runtime
// (Workers refuses PBKDF2 above 100000 iterations natively).
type Input = string | ArrayBuffer | NodeJS.ArrayBufferView
const bytesOf = (x: Input): string | Uint8Array =>
  typeof x === 'string' ? x : x instanceof ArrayBuffer ? new Uint8Array(x) : new Uint8Array(x.buffer, x.byteOffset, x.byteLength)

export const qpuPbkdf2 = (password: Input, salt: Input, iterations: number, keylen: number, digest: string, callback: (err: Error | null, key: Buffer) => void): void => {
  try {
    if (String(digest).toLowerCase() !== 'sha256') throw new Error(`qpu pbkdf2: only sha256 (asked ${digest})`)
    callback(null, Buffer.from(pbkdf2Sha256(bytesOf(password), bytesOf(salt), iterations, keylen)))
  } catch (e) {
    callback(e as Error, Buffer.alloc(0))
  }
}

export const qpuRandomBytes = (size: number, callback?: (err: Error | null, buf: Buffer) => void): Buffer | void => {
  const buf = Buffer.from(randomBytes(size))
  if (!callback) return buf
  callback(null, buf)
}

const target = crypto as unknown as { pbkdf2: typeof qpuPbkdf2; randomBytes: typeof qpuRandomBytes }
target.pbkdf2 = qpuPbkdf2
target.randomBytes = qpuRandomBytes
