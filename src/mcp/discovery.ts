import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf } from '../quantum/processing/unit/index.js'

/** One way a value is reached: a hex-program UUID (family handle, formula nibbles, params split by their count) and its run. */
export type Way = { family: string; program: string[]; params: number[]; hex: string; receipt?: string }
export type Relation = { value: string; families: string[]; ways: Way[]; live: boolean }

// the tool doors run whole readings rather than formulas over inputs: they are reached through their own receipts
const DOORS = new Set(['qpu', 'crypto'])
const SMALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
// the params section splits by count: one 48-bit natural, two 24-bit, three 16-bit
const WIDTH = [0, 2 ** 48, 2 ** 24, 2 ** 16]
const fits = (params: number[]) => params.every((p) => Number.isSafeInteger(p) && p >= 0 && p < WIDTH[params.length]!)

const valueOf = (run: { value?: unknown; holds?: boolean }): string | null => {
  if (run.holds !== true) return null
  const v = run.value
  if (typeof v === 'bigint') return v.toString()
  if (typeof v === 'string' && /^\d+$/.test(v)) return v
  if (typeof v === 'number' && Number.isSafeInteger(v)) return String(v)
  return null
}

/**
 * Discovery as the hex UUID splits it: for every family (handle), every program of one formula and every composition of
 * two (nibbles), over params that fit the section their count selects, the UUID is minted and run; the run is stored at
 * its address and receipted. A value reached by programs of two or more families is a cross-formulated solution; it is
 * live when a live reading is its value or among its params. Lean formulas compute exactly (2^n as a natural), so they take
 * the small naturals and meet live readings as values.
 */
export const qpuDiscoverOf = async (live: number[] = []) => {
  const liveSet = new Set(live.filter((x) => Number.isSafeInteger(x) && x >= 0).map(String))
  const liveInputs = live.filter((x) => Number.isSafeInteger(x) && x >= 0 && x < WIDTH[1]!)
  const reached = new Map<string, Way[]>()
  const perFamily: Record<string, { programs: number; runs: number }> = {}
  for (const [family, formulas] of qpuHexFamiliesOf()) {
    if (DOORS.has(family)) continue
    const lean = family.startsWith('Qpu.')
    const singles = lean ? SMALL : [...new Set([...SMALL, ...liveInputs])]
    const tuplesOf = (arity: number, short: boolean): number[][] =>
      arity === 0 ? [[]] : arity === 1 ? (short ? SMALL.slice(0, 4) : singles).map((x) => [x]) : arity === 2 ? SMALL.slice(0, short ? 3 : 8).flatMap((a) => SMALL.slice(0, short ? 3 : 8).map((b) => [a, b])) : SMALL.slice(0, short ? 2 : 5).flatMap((a) => SMALL.slice(0, short ? 2 : 5).flatMap((b) => SMALL.slice(0, short ? 2 : 5).map((c) => [a, b, c])))
    const programs: { program: string[]; tuples: number[][] }[] = [
      ...formulas.map((f) => ({ program: [f.name], tuples: tuplesOf(f.arity, false) })),
      ...formulas.flatMap((a) => formulas.map((b) => ({ program: [a.name, b.name], tuples: tuplesOf(Math.max(a.arity, b.arity), true) }))),
    ]
    perFamily[family] = { programs: programs.length, runs: 0 }
    for (const { program, tuples } of programs) {
      for (const params of tuples) {
        if (!fits(params)) continue
        let hex: string
        try {
          hex = qpuHexUuidOf({ family, program, params })
        } catch {
          continue
        }
        const run = (await qpuHexRunOf(hex)) as { value?: unknown; holds?: boolean; receipt?: string }
        perFamily[family]!.runs++
        const value = valueOf(run)
        if (value === null || BigInt(value) < 3n || params.map(String).includes(value)) continue
        const list = reached.get(value) ?? reached.set(value, []).get(value)!
        if (list.length < 12 && !list.some((w) => w.hex === hex)) list.push({ family, program, params, hex, ...(run.receipt ? { receipt: run.receipt } : {}) })
      }
    }
  }
  const relations: Relation[] = [...reached]
    .map(([value, ways]) => ({ value, ways, families: [...new Set(ways.map((w) => w.family))].sort(), live: liveSet.has(value) || ways.some((w) => w.params.some((p) => liveSet.has(String(p)))) }))
    .filter((r) => r.families.length > 1)
    .sort((a, b) => Number(b.live) - Number(a.live) || b.families.length - a.families.length || (BigInt(a.value) < BigInt(b.value) ? -1 : 1))
  const families = Object.keys(perFamily).sort()
  const related = new Set(relations.flatMap((r) => r.families))
  return {
    kind: 'discover' as const,
    families,
    perFamily,
    runs: Object.values(perFamily).reduce((a, b) => a + b.runs, 0),
    relations,
    liveRelations: relations.filter((r) => r.live).length,
    unrelated: families.filter((f) => !related.has(f)),
    holds: families.every((f) => perFamily[f]!.runs > 0) && relations.length > 0,
  }
}
