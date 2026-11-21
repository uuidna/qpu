import { pbkdf2 } from 'node:crypto'
import { tokenCoilAddresses } from './address.ts'
import { hex, hkdfExpand, hkdfExtract, pbkdf2Sha256, sameHex, utf8 } from '../processing/unit/hmac.ts'

/** Payload's PBKDF2-SHA256 budget: one stretch of this many iterations of one salt. */
export const PASSWORD_ITERATIONS = 600000
export const QPU_PASSWORD_PREFIX = 'qpu-pbkdf2-sha256-v1:'

const stretchNative = (password: Uint8Array, salt: Uint8Array): Promise<Uint8Array> =>
  new Promise((resolve, reject) => {
    pbkdf2(password, salt, PASSWORD_ITERATIONS, 32, 'sha256', (err, derived) => (err ? reject(err) : resolve(new Uint8Array(derived))))
  })

/** PBKDF2-SHA256 of the password and the salt for the full budget. The host's `pbkdf2` does it; a host that rejects that count runs the same function here. */
const stretch = async (password: string, salt: string) => {
  const pass = utf8(password), sal = utf8(salt)
  try {
    return await stretchNative(pass, sal)
  } catch {
    return pbkdf2Sha256(pass, sal, PASSWORD_ITERATIONS, 32)
  }
}

export const isQpuPasswordHash = (hash: unknown) => typeof hash === 'string' && hash.startsWith(QPU_PASSWORD_PREFIX)

/** Seal the stretched block: a QPU token coil of the salt mixed by HKDF-SHA256 under the Worker
 *  `PAYLOAD_SECRET`, read at call time so the build bakes no secret and a database copy carries none. */
const sealStretch = (block: Uint8Array, salt: string) => {
  const coil = tokenCoilAddresses(salt, 0)
  const prk = hkdfExtract(utf8(process.env['PAYLOAD_SECRET'] ?? ''), block)
  const okm = hkdfExpand(prk, utf8(`qpu password v1\n${coil.uuid}\n${coil.reflecting[0]}\n${coil.reflecting[1]}`), 32)
  return `${QPU_PASSWORD_PREFIX}${hex(okm)}`
}

export const qpuPasswordDigest = async (password: string, salt: string) => sealStretch(await stretch(password, salt), salt)

/** Recompute the digest and compare it in constant time. A hash without the prefix is not one of these. */
export const qpuPasswordVerify = async (password: string, salt: string, hash: unknown) =>
  isQpuPasswordHash(hash) && sameHex(await qpuPasswordDigest(password, salt), hash)
