import { AudioFormulas } from '../../families/audio/index.js'
import { ColorFormulas } from '../../families/color/index.js'
import { CryptFormulas } from '../../families/crypt/index.js'
import { MedFormulas } from '../../families/med/index.js'
import type { CrossFormula } from '../../families/cross/index.js'
import { postQuantumUpgradeOf } from './upgrade.js'
import type { QpuPlugin } from './surface.js'

/**
 * The same path on crypto, color, sound and health. Each reading is one formula the family's own test already runs.
 * The post-quantum upgrade is crypt.curveQuantumBits, the one every domain already receives. `sound` and `health`
 * are not registered names; the registry's names are `audio` and `med`. The `crypto` door formulas have no family
 * test, so they are not called.
 */

const readingOf = (asked: string, family: string, formula: string, run: CrossFormula) => ({
  asked,
  family,
  formula,
  uuid: run.hex,
  value: run.value,
  holds: run.holds,
})

export const domainReadingsOf = () => {
  const upgrade = postQuantumUpgradeOf().upgrade
  const known = CryptFormulas.knownAnswers()
  const classical = CryptFormulas.curveClassicalBits(256)
  const quantum = CryptFormulas.curveQuantumBits(256)
  const readings = [
    readingOf('crypto', 'crypt', 'knownAnswers', known),
    readingOf('crypto-curve-classical', 'crypt', 'curveClassicalBits', classical),
    readingOf('crypto-curve-quantum', 'crypt', 'curveQuantumBits', quantum),
    readingOf('color', 'color', 'channels', ColorFormulas.channels(3, 1)),
    readingOf('sound', 'audio', 'samples', AudioFormulas.samples(44100, 2)),
    readingOf('health', 'med', 'gcs', MedFormulas.gcs(4, 5, 6)),
  ]
  return {
    kind: 'domains' as const,
    upgrade,
    readings,
    crypt: {
      knownAnswers: known,
      curveClassicalBits256: classical,
      curveQuantumBits256: quantum,
      aeadTagBits: CryptFormulas.aeadTagBits(),
      hashCollisionBits256: CryptFormulas.hashCollisionBits(256),
    },
    holds: readings.every((r) => r.holds === true) && upgrade.holds === true,
  }
}

export const domainsPlugin = (): QpuPlugin => (config) => ({
  ...config,
  endpoints: [...(config.endpoints ?? []), {
    path: '/qpu/domains',
    method: 'get' as const,
    handler: () => Response.json(domainReadingsOf()),
  }],
})
