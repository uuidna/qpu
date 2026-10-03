import { qpuFacesOf, qpuHexFamiliesOf, qpuHexRegisterOf, qpuProveHolds } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'
import { DOORS, qpuDiscoverOf } from '../../mcp/discovery.js'
import { DataFormulas, qpuDataOf, qpuDataSourcesOf } from '../../mcp/qpu-fused.js'
import { RuleFormulas } from '../rule/index.js'

/** THE GATES ARE CROSS FORMULAS. What a commit, a push or a deploy must satisfy is not a script that blocks but a
 *  formula of this family whose `holds` is the verdict, composed from the other families: data.research (the
 *  public APIs a family's formulas name, read live), discovery (the values a family reaches that other families and
 *  live readings reach), rule (no family past its nibble, none truncated) and the unit's own proof. The hooks and the
 *  workflow run these through the MCP in-process (scripts/gate.mjs) and act on holds; nothing else decides. */

const PROOF = 'gate = cross(data.research, discovery, rule, qpu_prove): holds is the verdict'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const families = () => [...qpuHexFamiliesOf().keys()].filter((f) => !DOORS.has(f)).sort()
const f = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'gate', dst: 'rule', formula, value, proof: PROOF, ...extra }, holds, { name: `gate.${name}`, params })

const numbersOf = (x: unknown): number[] =>
  typeof x === 'number' ? (Number.isSafeInteger(x) && x >= 3 ? [x] : []) : typeof x === 'string' ? (/^\d+$/.test(x) && Number.isSafeInteger(Number(x)) && Number(x) >= 3 ? [Number(x)] : []) : x && typeof x === 'object' ? Object.values(x).flatMap(numbersOf) : []

export class GateFormulas {
  // the research of a family and, over the readings' numbers, the relations the family has: discovery runs ONCE per
  // call over the union of readings (a discovery is the whole lattice; fourteen at once exhaust the memory)
  private static async researched(indices: number[]) {
    const rows: { name: string; answered: number; numbers: number[] }[] = []
    for (const i of indices) {
      const name = families()[i]!
      const research = (await DataFormulas.research(i)) as { reading?: { readings?: { status: number; excerpt?: unknown }[] } }
      const readings = research.reading?.readings ?? []
      // a live source whose check names the family (nist names Qpu.Physics, cern theorem cern) is a cross when it agrees
      const naming = (await qpuDataSourcesOf()).filter((s) => `${s.label} ${s.checks}`.includes(name) && s.source !== 'research')
      const sources = (await Promise.all(naming.map(async (s) => (await qpuDataOf(s.source, s.args)) as { agrees?: boolean }))).filter((r) => r.agrees === true).length
      rows.push({ name, answered: readings.filter((r) => r.status > 0).length + sources, numbers: readings.flatMap((r) => numbersOf(r.excerpt ?? {})) })
    }
    // the readings' numbers as discovery's inputs, a slice of them: every integer of seventy API excerpts is thousands,
    // and discovery over thousands of inputs is the whole lattice squared (it exhausted 4 GB); the first 2^8 distinct
    // ones, smallest first, are what the formulas' small inputs can meet
    const numbers = [...new Set(rows.flatMap((r) => r.numbers))].sort((a, b) => a - b).slice(0, 256)
    const d = await qpuDiscoverOf(numbers)
    return rows.map((r) => {
      const relations = d.relations.filter((x) => x.families.includes(r.name))
      const live = relations.filter((x) => x.live).length
      return { ...r, relations: relations.length, live, crossing: [...new Set(relations.flatMap((x) => x.families))].filter((x) => x !== r.name) }
    })
  }
  /** The f-th family crossed with the public record: the APIs its formulas name that answered, plus the values it
   *  reaches that other families and live readings reach. Holds when the sum is positive: something outside the
   *  family has met it. */
  static async family(i: number): Promise<CrossFormula> {
    const name = families()[i]
    if (!name) return f('gate-family', 'family(i)', 0, false, 'family', [i])
    const [r] = await GateFormulas.researched([i])
    return f('gate-family', 'family(i) = answered(research(i)) + live relations(i)', r!.answered + r!.live, r!.answered + r!.live > 0, 'family', [i], { family: name, answered: r!.answered, relations: r!.relations, live: r!.live, crossing: r!.crossing })
  }
  /** The rules: families past the cap plus formulas truncated; holds only at zero. */
  static rules(): CrossFormula {
    const over = Number(RuleFormulas.over().value)
    const truncated = families().reduce((s, _, i) => s + Number(RuleFormulas.truncated(i).value), 0)
    return f('gate-rules', 'rules = over + Σ truncated(i)', over + truncated, over + truncated === 0, 'rules', [])
  }
  /** The proof: the unit proves itself end to end (qpu_prove holds). */
  static proof(): CrossFormula { const ok = qpuProveHolds(); return f('gate-proof', 'proof = [qpu_prove holds]', ok ? 1 : 0, ok, 'proof', []) }
  /** A commit of the i-th family: crossed with the record, within the rules. */
  static async commit(i: number): Promise<CrossFormula> {
    const fam = await GateFormulas.family(i)
    const rules = GateFormulas.rules()
    return f('gate-commit', 'commit(i) = family(i) ∧ rules', Number(fam.value), fam.holds && rules.holds, 'commit', [i], { family: (fam as unknown as { family?: string }).family, rules: rules.value })
  }
  /** A push: the proof, the rules, and every family crossed with the record — a slice of faces families per call
   *  (from the i-th), next in the result when more follow. */
  static async push(from: number): Promise<CrossFormula> {
    const all = families()
    const slice = all.slice(from, from + qpuFacesOf().faces)
    const crossed = await GateFormulas.researched(slice.map((_, k) => from + k))
    const failing = crossed.filter((c) => c.answered + c.live === 0).map((c) => c.name)
    const proof = GateFormulas.proof(), rules = GateFormulas.rules()
    const holds = proof.holds && rules.holds && failing.length === 0
    return f('gate-push', 'push(from) = proof ∧ rules ∧ ⋀ family(i), i in [from, from + faces)', crossed.length - failing.length, nat(from) && holds, 'push', [from], { proof: proof.value, rules: rules.value, failing, ...(from + slice.length < all.length ? { next: from + slice.length } : {}) })
  }
}

for (const name of ['commit', 'family', 'proof', 'push', 'rules'] as const)
  qpuHexRegisterOf('gate', name, (GateFormulas[name] as (...x: unknown[]) => unknown).bind(GateFormulas))
