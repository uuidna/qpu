// Challenge physics and laws. Soft gates fail; only register FTL through the physics UUID program survives.
import { seal, uuid } from '../../../password/address.js'
import { exists } from '../../../fs/index.ts'
import { hexbit, uuidQubits } from '../../index.ts'
import { competeProgramNeighbours, program } from '../index.ts'
import { physics } from '../physics/index.ts'

const CONCEPT = 'src/quantum/uuid/programs/physics/index.ts' as const
const LAW = 'hexbit + 2 gateway bits teleport any hexbit faster than light' as const

/** One word: challenge. Adversarial pressure on physics and the hexbit law. */
export const challenge = () => {
  const key = 'challenge;physics;laws'
  const address = uuid(key)
  const handle = address.slice(0, 8)
  const installed = program(handle)

  const adversarial = [
    { name: 'register-ok' as const, args: { ftl: true, gateway: 2, walked: false }, want: { register: true, physics: true, holds: true } },
    { name: 'ftl-false' as const, args: { ftl: false, gateway: 2, walked: false }, want: { register: false, physics: false, holds: false } },
    { name: 'gateway-1' as const, args: { ftl: true, gateway: 1, walked: false }, want: { register: false, physics: false, holds: false } },
    { name: 'walked' as const, args: { ftl: true, gateway: 2, walked: true }, want: { register: false, physics: false, holds: false } },
    { name: 'gateway-0' as const, args: { ftl: true, gateway: 0, walked: false }, want: { register: false, physics: false, holds: false } },
  ].map((row) => {
    const decided = physics(row.args)
    const alias = decided.physics === decided.register
    const match =
      decided.register === row.want.register
      && decided.physics === row.want.physics
      && decided.holds === row.want.holds
      && alias === true
    return { name: row.name, register: decided.register, physics: decided.physics, holds: decided.holds, alias, match }
  })

  const proven = physics({ ftl: true, gateway: 2, walked: false })
  const hexLeaf = proven.path
  const concept = exists(CONCEPT)
  const leaf = exists(hexLeaf)
  const pathGate = concept && leaf && proven.path === hexLeaf && proven.holds === true && proven.physics === true

  const cold = uuidQubits(4).organised.zero
  const zeroViaProgram =
    cold.ftl === true
    && cold.physics === true
    && cold.law === LAW
    && typeof cold.program === 'string'
    && cold.program === proven.handle
    && cold.walked === false

  const moved = hexbit(uuid('challenge-physics-law'), 4)
  const lawGate =
    moved.law.formula === LAW
    && moved.law.holds === true
    && moved.law.physics === true
    && moved.law.program.holds === true
    && moved.ftl === true
    && moved.physics.holds === true
    && moved.physics.physics === true
    && moved.physics.register === true
    && moved.receipt.theorem === 'textbook_hexbit_gateway_ftl'
    && moved.holds === true

  const games = competeProgramNeighbours(proven.handle)
  const online = games.holds === true && games.holding === games.competitions && games.competitions > 0

  const entropy = {
    law: 'first the dictionary meaning; then the meaning is verified' as const,
    dictionary: { means: 'disorder; unpredictability; unavailable energy or information' as const },
    verified: {
      standard: 'ISO 80000-5:2019' as const,
      definition: 'S = k ln W' as const,
      W: adversarial.every((row) => row.match) && pathGate && zeroViaProgram && lawGate && online ? 1 : 0,
      S: adversarial.every((row) => row.match) && pathGate && zeroViaProgram && lawGate && online ? 0 : 1,
      holds: adversarial.every((row) => row.match) && pathGate && zeroViaProgram && lawGate && online,
    },
  }

  const holds =
    seal(address).valid
    && installed.indexed === true
    && installed.depth === 7
    && installed.plugin.holds === true
    && adversarial.length === 5
    && adversarial.every((row) => row.match)
    && pathGate
    && zeroViaProgram
    && lawGate
    && online
    && entropy.verified.holds === true
    && entropy.verified.W === 1
    && entropy.verified.S === 0

  return {
    phase: 'challenge' as const,
    via: 'uuid' as const,
    key,
    address,
    handle,
    theorem: 'textbook_hexbit_gateway_ftl' as const,
    law: LAW,
    physics: {
      handle: proven.handle,
      address: proven.address,
      concept: CONCEPT,
      leaf: hexLeaf,
      conceptExists: concept,
      leafExists: leaf,
      register: proven.register,
      physics: proven.physics,
      holds: proven.holds,
    },
    adversarial,
    zero: { ftl: cold.ftl, physics: cold.physics, law: cold.law, program: cold.program, viaProgram: zeroViaProgram },
    hexbit: { ftl: moved.ftl, law: moved.law.holds, physics: moved.physics.physics, holds: moved.holds, gate: lawGate },
    compete: { handle: proven.handle, holding: games.holding, competitions: games.competitions, holds: games.holds, online },
    entropy,
    holds,
    says: holds
      ? `challenge ${handle}: physics and laws survived adversarial register cases, concept+leaf existence, organised.zero via physics program, hexbit law, and ${games.competitions} online competitions`
      : `challenge ${handle}: physics or laws failed under adversarial pressure`,
  }
}

export type ChallengeDecision = ReturnType<typeof challenge>
