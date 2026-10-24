import { contentUuidOf, facesOf, hexFamiliesOf } from '../../quantum/processing/unit/index.js'
import type { QpuEnv } from '../../quantum/processing/unit/index.js'

/**
 * SEND THE WAVES. A wave is a set of independent units sent together: each unit is one family's research walk, read
 * through the research source and followed through next until every usable API the family names is read. Units in a
 * wave share no state, so they run at once; waves follow one another, so the next wave starts when the last is done.
 *
 *   tools/call connector { send: true, over: 'families' }                  the first wave
 *   tools/call connector { send: true, over: 'families', all: true }      every wave, until no family is left
 *   tools/call connector { send: true, over: 'families', from, width }    a wave from a position, at a width
 */

type Unit = {
  family: string
  matched: number
  read: number
  answered: number
  pages: number
  covered: boolean
  warning?: string
}

type Reading = { reading?: { matched?: number; read?: number; next?: number; readings?: unknown }; warning?: string }

const statusesOf = (readings: unknown): number[] =>
  Array.isArray(readings) ? readings.map((x) => (x && typeof x === 'object' && typeof (x as { status?: unknown }).status === 'number' ? (x as { status: number }).status : 0)) : []

/** One independent unit: a family's research walk, followed through every next position until none is left. */
export const walkUnitOf = async (family: string, env?: QpuEnv, auth?: string | null): Promise<Unit> => {
  const { dataOf } = await import('../../mcp/qpu-fused.js')
  let from = 0
  let matched = 0
  let read = 0
  let answered = 0
  let pages = 0
  let warning: string | undefined
  for (;;) {
    pages++
    let reply: Reading
    try {
      reply = (await dataOf('research', { family, from }, env, auth)) as Reading
    } catch (e) {
      return { family, matched, read, answered, pages, covered: answered > 0, warning: `the research read failed: ${(e as Error).message}` }
    }
    matched = Math.max(matched, reply.reading?.matched ?? 0)
    read += reply.reading?.read ?? 0
    answered += statusesOf(reply.reading?.readings).filter((s) => s > 0).length
    warning = reply.warning
    const next = reply.reading?.next
    if (next === undefined || next <= from) break
    from = next
  }
  return { family, matched, read, answered, pages, covered: answered > 0, ...(warning ? { warning } : {}) }
}

/** Every family with formulas, in the order the registry lists them. */
const familiesOf = (): string[] => [...hexFamiliesOf().entries()].filter(([, formulas]) => formulas.length > 0).map(([name]) => name).sort()

/** Sends the waves: each wave's units run at once; with all, the waves run one after another until none is left. */
export const sendWavesOf = async (a: { over?: unknown; from?: unknown; width?: unknown; all?: unknown }, env?: QpuEnv, auth?: string | null) => {
  if (a.over !== 'families') return { kind: 'send-failure', over: a.over ?? null, resolve: "over: 'families' is the one unit set this route sends" }
  const families = familiesOf()
  const width = typeof a.width === 'number' && Number.isSafeInteger(a.width) && a.width > 0 ? a.width : facesOf().faces
  let start = typeof a.from === 'number' && Number.isSafeInteger(a.from) && a.from >= 0 ? a.from : 0
  const waves: { wave: number; from: number; width: number; units: Unit[]; covered: number; uuid: string }[] = []
  while (start < families.length) {
    const members = families.slice(start, start + width)
    // the units of this wave are independent: each walks its own family, and none reads another's result
    const units = await Promise.all(members.map((family) => walkUnitOf(family, env, auth)))
    waves.push({ wave: waves.length, from: start, width: members.length, units, covered: units.filter((u) => u.covered).length, uuid: contentUuidOf(units.map((u) => [u.family, u.covered, u.read])) })
    start += members.length
    if (a.all !== true) break
  }
  const sent = waves.reduce((n, w) => n + w.units.length, 0)
  return {
    kind: 'send-waves' as const,
    over: 'families' as const,
    families: families.length,
    width,
    sent,
    covered: waves.reduce((n, w) => n + w.covered, 0),
    ...(start < families.length ? { next: start } : {}),
    waves,
  }
}
