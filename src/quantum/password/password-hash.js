import { pbkdf2 } from 'node:crypto'
import { tokenCoilAddresses } from './address.js'
import { hex, hkdfExpand, hkdfExtract, pbkdf2Sha256, sameHex, utf8 } from '../processing/unit/hmac.ts'

/** Payload's PBKDF2-SHA256 budget: one stretch of this many iterations of one salt. */
export const PASSWORD_ITERATIONS = 600000
/** Hard cap on a single `crypto.pbkdf2` call in workerd. Above it, the same function runs as {@link pbkdf2Sha256}. */
const CLOUDFLARE_PBKDF2_MAX = 100000
export const QPU_PASSWORD_PREFIX = 'qpu-pbkdf2-sha256-v1:'

const stretchNative = (password, salt) =>
  new Promise((resolve, reject) => {
    pbkdf2(password, salt, PASSWORD_ITERATIONS, 32, 'sha256', (err, derived) =>
      err ? reject(err) : resolve(new Uint8Array(derived)),
    )
  })

/** PBKDF2-SHA256 of the password and the salt for the full budget. The host's `pbkdf2` does it; a host that rejects that count runs the same function here. */
const stretch = async (password, salt) => {
  const pass = utf8(String(password)), sal = utf8(String(salt))
  try {
    return await stretchNative(pass, sal)
  } catch {
    return pbkdf2Sha256(pass, sal, PASSWORD_ITERATIONS, 32)
  }
}

export const isQpuPasswordHash = (hash) =>
  typeof hash === 'string' && hash.startsWith(QPU_PASSWORD_PREFIX)

/**
 * Stretch the password with PBKDF2-SHA256 for 600000 iterations of its salt, then seal it.
 * The seal is a QPU token coil of the salt (two reflecting UUIDs in one) mixed by HKDF-SHA256
 * under the Worker `PAYLOAD_SECRET`. A copy of the database does not carry that secret.
 * The lookup is computed so the build does not bake the secret into the bundle.
 */
const sealStretch = (block, salt) => {
  const coil = tokenCoilAddresses(String(salt), 0)
  const pepper = process.env['PAYLOAD_SECRET'] ?? ''
  const prk = hkdfExtract(utf8(pepper), block)
  const okm = hkdfExpand(prk, utf8(`qpu password v1\n${coil.uuid}\n${coil.reflecting[0]}\n${coil.reflecting[1]}`), 32)
  return `${QPU_PASSWORD_PREFIX}${hex(okm)}`
}

export const qpuPasswordDigest = async (password, salt) => sealStretch(await stretch(password, salt), salt)

/** Recompute the digest and compare it in constant time. A hash without the prefix is not one of these. */
export const qpuPasswordVerify = async (password, salt, hash) =>
  isQpuPasswordHash(hash) && sameHex(await qpuPasswordDigest(password, salt), hash)
