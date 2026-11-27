// Challenge physics and laws. Soft gates fail; only register FTL through the physics UUID program survives.
import { PROSE, proseFill } from '../5/9/e/4/9/1/a/4/index.ts'
import { seal, uuid } from '../1/6/4/f/0/6/2/1/index.ts'
import leafModule from '../8/3/b/4/a/0/c/1/index.ts'
import { hexbit, uuidQubits } from '../2/7/1/a/7/6/4/9/index.ts'
import { competeProgramNeighbours, program } from '../index.ts'
import { physics } from '../physics/index.ts'
import { ENTROPY_LAW, ENTROPY_MEANS, HEXBIT_LAW, PHYSICS_CONCEPT } from '../b/6/4/6/e/a/0/1/index.ts'

const CONCEPT = PHYSICS_CONCEPT, LAW = HEXBIT_LAW

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
  const concept = CONCEPT === 'src/quantum/uuid/programs/physics/index.ts'
  const leaf = leafModule.prefix === proven.handle && leafModule.depth === proven.depth && proven.indexed === true
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

  const ordered = adversarial.every((row) => row.match) && pathGate && zeroViaProgram && lawGate && online
  const entropy = {
    law: ENTROPY_LAW,
    dictionary: ENTROPY_MEANS,
    verified: {
      standard: 'ISO 80000-5:2019' as const,
      definition: 'S = k ln W' as const,
      W: ordered ? 1 : 2,
      S: ordered ? 0 : Math.LN2,
      holds: ordered,
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
      ? proseFill(PROSE.quantumUuidProgramsChallengeIndex_s1, handle, games.competitions)
      : proseFill(PROSE.quantumUuidProgramsChallengeIndex_s2, handle),
  }
}
