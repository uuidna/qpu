import crypto, * as cryptoModule from 'crypto'
import { pbkdf2Sha256, pbkdf2Sha512, randomBytes as formulaRandomBytes } from '@uuidna/qpu/core/crypt.js'

// Payload hashes passwords through crypto.pbkdf2 (600000 iterations, SHA-256) and salts them with crypto.randomBytes.
// PBKDF2 is answered by the qpu formula (Workers native caps iterations at 100000).
// Digest choice is the crypt.digest gate (tried in court) — sha256|sha512 registered; others absent formula state.
// Salts take platform entropy via Web Crypto getRandomValues when present — formula DRBG in core/crypt stays
// deterministic for hex recomputation and is not a CSPRNG for password salts.
type Input = string | ArrayBuffer | NodeJS.ArrayBufferView
const bytesOf = (x: Input): string | Uint8Array =>
  typeof x === 'string' ? x : x instanceof ArrayBuffer ? new Uint8Array(x) : new Uint8Array(x.buffer, x.byteOffset, x.byteLength)

const DIGEST = {
  sha256: pbkdf2Sha256,
  sha512: pbkdf2Sha512,
} as const

export const qpuPbkdf2 = (password: Input, salt: Input, iterations: number, keylen: number, digest: string, callback: (err: Error | null, key: Buffer) => void): void => {
  try {
    const name = String(digest).toLowerCase().replace(/^sha-/, 'sha') as keyof typeof DIGEST
    const run = DIGEST[name]
    if (!run) {
      // Absent formula state — not a policy refuse. Gate: cryptDigestGateOf(name) holds false.
      throw new Error(`qpu pbkdf2: digest ${digest} unbound in formula port (registered: sha256|sha512)`)
    }
    callback(null, Buffer.from(run(bytesOf(password), bytesOf(salt), iterations, keylen)))
  } catch (e) {
    callback(e as Error, Buffer.alloc(0))
  }
}

/** Prefer Web Crypto CSPRNG for Payload salts; fall back to formula DRBG only when getRandomValues is absent. */
export const qpuRandomBytes = (size: number, callback?: (err: Error | null, buf: Buffer) => void): Buffer | void => {
  const out = new Uint8Array(size)
  const web = globalThis.crypto?.getRandomValues?.bind(globalThis.crypto)
  if (typeof web === 'function') web(out)
  else out.set(formulaRandomBytes(size))
  const buf = Buffer.from(out)
  if (!callback) return buf
  callback(null, buf)
}

type Patchable = { pbkdf2: typeof qpuPbkdf2; randomBytes: typeof qpuRandomBytes }

/** Called by the generated config, so no bundler can drop it as an unused import. Payload reads the raw 'crypto'
 *  module object (a bundler hands it the module, not its default view), so both are patched and the raw one is checked. */
export const install = (): void => {
  for (const target of [cryptoModule, crypto] as unknown as Patchable[]) {
    try {
      target.pbkdf2 = qpuPbkdf2
      target.randomBytes = qpuRandomBytes
    } catch {
      // an ES module namespace is read-only; the other view carries the patch
    }
  }
  const raw = cryptoModule as unknown as Patchable
  const view = crypto as unknown as Patchable
  console.log(`qpu crypto: module pbkdf2 ${raw.pbkdf2 === qpuPbkdf2 ? 'installed' : 'NOT installed'}, default pbkdf2 ${view.pbkdf2 === qpuPbkdf2 ? 'installed' : 'NOT installed'}`)
}
install()
