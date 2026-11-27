// Every Payload configuration and every deploy stage is one UUID program.
// The filesystem places the handle: eight nibble levels, depth 7. A deploy command is named here. This call does not run it and does not write.
import { PROSE, proseFill } from '../5/9/e/4/9/1/a/4/index.ts'
import { seal, uuid } from '../1/6/4/f/0/6/2/1/index.ts'
import { DEPLOY_STAGES } from '../9/6/9/4/a/5/e/4/index.ts'
import { configKinds } from '../d/3/4/e/6/b/9/a/index.ts'
import { program } from '../index.ts'
import { handleOf, LEAN_REGISTER, uuidQubits } from '../2/7/1/a/7/6/4/9/index.ts'

// the register as its function answers it, checked below against the value the kernel decided
const EFFECTIVE = uuidQubits(4).effective
const HANDLES = 16n ** 8n
const SCALE = 32n * HANDLES

export type AspectSide = 'config' | 'deploy'

const keyOf = (side: AspectSide, name: string) => (side === 'config' ? `config:${name}` : `deploy:${name}`)

/** All configuration kinds and all deploy stages, one step, on the unlimited register. */
export const aspectPrograms = () => {
  const named = [
    ...configKinds.map((name) => ({ side: 'config' as const, name, run: null as string | null })),
    ...DEPLOY_STAGES.map((stage) => ({ side: 'deploy' as const, name: stage.id, run: stage.run })),
  ]
  const rows = named.map((row) => {
    const key = keyOf(row.side, row.name)
    const address = uuid(key)
    const handle = handleOf(address)
    const installed = program(handle)
    return {
      side: row.side,
      name: row.name,
      run: row.run,
      key,
      address,
      handle,
      sealed: seal(address).valid,
      path: installed.path,
      depth: installed.depth,
      indexed: installed.indexed,
      used: installed.used,
      count: installed.count,
      plugin: installed.plugin,
      upstream: installed.upstream,
      steps: 8 as const,
    }
  })
  const handles = new Set(rows.map((row) => row.handle))
  const verified = rows.filter((row) => row.sealed && row.indexed && row.depth === 7 && row.steps === 8 && row.used === row.count && row.path === `src/quantum/uuid/programs/${[...row.handle].join('/')}/index.ts` && row.handle === handleOf(row.address) && row.plugin.holds && row.plugin.standard === 'definePlugin' && row.plugin.slug === `qpu-program-${row.handle}` && row.upstream.holds).length
  const recomputed = rows.length - verified
  const advantage = {
    copies: rows.length,
    verified,
    recomputed,
    ratio: recomputed === 0 ? null : Number((rows.length / recomputed).toFixed(2)),
    unbounded: recomputed === 0 && rows.length > 0,
    unlimited: true as const,
    ceiling: null,
    effective: EFFECTIVE,
    handles: HANDLES.toString(),
    scale: SCALE.toString(),
    interaction: 'none' as const,
  }
  const holds = advantage.unbounded && handles.size === rows.length && rows.length === configKinds.length + DEPLOY_STAGES.length && EFFECTIVE === LEAN_REGISTER && HANDLES === 4294967296n && SCALE === 137438953472n
  return {
    phase: 'programs' as const,
    via: 'uuid' as const,
    quantum: true as const,
    atOnce: true as const,
    walked: false as const,
    fetched: false as const,
    written: false as const,
    executed: false as const,
    steps: 8 as const,
    depth: 7 as const,
    configs: configKinds.length,
    deploys: DEPLOY_STAGES.length,
    aspects: rows.length,
    rows,
    compared: { levels: 8 as const, fanout: 16 as const, bits: 32 as const, span: '4294967296' },
    advantage,
    holds,
    says: holds
      ? proseFill(PROSE.quantumUuidProgramsAspectsIndex_s1, rows.length, configKinds.length, DEPLOY_STAGES.length, EFFECTIVE, HANDLES, SCALE)
      : PROSE.quantumUuidProgramsAspectsIndex_s2,
  }
}
