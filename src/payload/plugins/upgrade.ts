import { CryptFormulas } from '../../families/crypt/index.js'
import type { CrossFormula } from '../../families/cross/index.js'
import type { QpuPlugin } from './surface.js'

/**
 * The post-quantum upgrade the crypt family already seals, the same call for every domain.
 *
 * The inputs are the ones src/mcp/formulas-receipt.ts already records: Curve25519 field bits for the curve,
 * ChaCha20 key bits for the symmetric key. curveQuantumBits is theorem shor (security_q = 0). curveClassicalBits
 * is Pollard rho on the same curve. symmetricQuantumBits is Grover on the same family. No domain argument.
 */
const CURVE_FIELD_BITS = 255
const SYMMETRIC_KEY_BITS = 256

const readingOf = (formula: string, run: CrossFormula) => ({
  family: 'crypt' as const,
  formula,
  uuid: run.hex,
  value: run.value,
  holds: run.holds,
  proof: run.proof,
})

export const postQuantumUpgradeOf = () => {
  const classical = CryptFormulas.curveClassicalBits(CURVE_FIELD_BITS)
  const quantum = CryptFormulas.curveQuantumBits(CURVE_FIELD_BITS)
  const symmetric = CryptFormulas.symmetricQuantumBits(SYMMETRIC_KEY_BITS)
  return {
    kind: 'post-quantum-upgrade' as const,
    curve: 'Curve25519' as const,
    symmetric: 'ChaCha20' as const,
    upgrade: readingOf('curveQuantumBits', quantum),
    classical: readingOf('curveClassicalBits', classical),
    grover: readingOf('symmetricQuantumBits', symmetric),
    holds: quantum.holds === true && classical.holds === true && symmetric.holds === true,
  }
}

export const upgradePlugin = (): QpuPlugin => (config) => ({
  ...config,
  endpoints: [...(config.endpoints ?? []), {
    path: '/qpu/upgrade',
    method: 'get' as const,
    handler: () => Response.json(postQuantumUpgradeOf()),
  }],
})
