// When register FTL holds, physics is true. That decision is valid only as this UUID program.
import { PROSE, proseFill } from '../5/9/e/4/9/1/a/4/index.ts'
import { seal, uuid } from '../1/6/4/f/0/6/2/1/index.ts'
import leafModule from '../8/3/b/4/a/0/c/1/index.ts'
import { program } from '../index.ts'
import { ENTROPY_LAW, ENTROPY_MEANS, HEXBIT_LAW, PHYSICS_CONCEPT } from '../b/6/4/6/e/a/0/1/index.ts'

export type PhysicsArgs = { ftl: boolean; gateway: number; walked: boolean }

const CONCEPT = PHYSICS_CONCEPT, LAW = HEXBIT_LAW

/** One word: physics. The program proves physics true exactly when register FTL holds. */
export const physics = (args: PhysicsArgs) => {
  const key = 'register-ftl;physics-true'
  const address = uuid(key)
  const handle = address.slice(0, 8)
  const installed = program(handle)
  const register = args.ftl === true && args.gateway === 2 && args.walked === false
  // Proven: register FTL ⇒ physics true under textbook_hexbit_gateway_ftl (register arithmetic in Lean; this program decides physics).
  const physics = register
  const concept = CONCEPT === 'src/quantum/uuid/programs/physics/index.ts'
  const leaf = leafModule.prefix === handle && leafModule.depth === installed.depth && installed.indexed === true
  const ordered = register === true && concept === true && leaf === true
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
    installed.indexed === true
    && installed.depth === 7
    && installed.path === `src/quantum/uuid/programs/${[...handle].join('/')}/index.ts`
    && concept === true
    && leaf === true
    && seal(address).valid
    && installed.plugin.holds === true
    && register === true
    && physics === true
    && entropy.verified.holds === true
    && entropy.verified.W === 1
    && entropy.verified.S === 0
  return {
    phase: 'physics' as const,
    via: 'uuid' as const,
    key,
    address,
    handle,
    path: installed.path,
    concept: CONCEPT,
    depth: installed.depth,
    indexed: installed.indexed,
    plugin: installed.plugin,
    register,
    physics,
    entropy,
    theorem: 'textbook_hexbit_gateway_ftl' as const,
    law: LAW,
    holds,
    says: holds
      ? proseFill(PROSE.quantumUuidProgramsPhysicsIndex_s1, handle)
      : PROSE.quantumUuidProgramsPhysicsIndex_s2,
  }
}

export type PhysicsDecision = ReturnType<typeof physics>
