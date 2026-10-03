import { qpuFacesOf, qpuHexFamiliesOf, qpuHexRegisterOf, qpuHexRunOf, qpuHexUuidOf, qpuProveHolds } from '../../quantum/processing/unit/index.js'
import { SignalFormulas } from '../signal/index.js'
import { apiCallOf, apiSearchOf } from '../../mcp/api-door.js'
import { MerkabaFormulas } from '../merkaba/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'
import { DOORS, qpuDiscoverOf } from '../../mcp/discovery.js'
import { DataFormulas, qpuDataOf, qpuDataSourcesOf, qpuSequencesOf } from '../../mcp/qpu-fused.js'
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
   *  reaches that live readings reach, plus the values another family reaches (Qpu.Coil is met by tesla.windings:
   *  coins · rays = 14, where no API of its words answers). Holds when the sum is positive: something outside the
   *  family has met it. A family nothing meets is a lead, named in the reading. */
  static async family(i: number): Promise<CrossFormula> {
    const name = families()[i]
    if (!name) return f('gate-family', 'family(i)', 0, false, 'family', [i])
    const [r] = await GateFormulas.researched([i])
    return f('gate-family', 'family(i) = answered(research(i)) + live relations(i) + families crossing(i)', r!.answered + r!.live + r!.crossing.length, r!.answered + r!.live + r!.crossing.length > 0, 'family', [i], { family: name, answered: r!.answered, relations: r!.relations, live: r!.live, crossing: r!.crossing })
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
  /** THE LEADS: the formulas no relation with another family reaches over the enumerated inputs and no sequence of
   *  which OEIS identifies — what the next development crosses first (a dataset, an API, a composition), before
   *  anything is removed or edited. Value how many; holds at zero. The Lean families cross in their own domain. */
  static async crossed(): Promise<CrossFormula> {
    // the discovery runs over the window: every reading the deep research made before this call (the registry
    // scanned to its end for every lead's words, every dataset read) is a live input the relations may reach
    const d = (await DataFormulas.discover(4096)) as unknown as { relations: { value: string; families: string[]; ways: { family: string; program: string[]; hex: string }[]; live: boolean }[]; seals: { family: string; program: string[]; kind: string }[]; liveInputs: number }
    const reached = new Set(d.relations.filter((r) => r.families.length > 1).flatMap((r) => r.ways.flatMap((w) => w.program.map((p) => `${w.family}.${p}`))))
    const identified = new Set<string>()
    for (const s of await qpuSequencesOf()) { const r = (await qpuDataOf('sequence', { family: s.family, formula: s.formula, fixed: s.fixed })) as { agrees?: boolean }; if (r.agrees === true) identified.add(`${s.family}.${s.formula}`) }
    const open = [...qpuHexFamiliesOf()].filter(([fam]) => !DOORS.has(fam) && !fam.startsWith('Qpu.')).flatMap(([fam, fs]) => fs.filter((x) => !reached.has(`${fam}.${x.name}`) && !identified.has(`${fam}.${x.name}`)).map((x) => ({ family: fam, name: x.name, arity: x.arity })))
    // NO LEAD REMAINS UNTAGGED. Every lead is given every effort: its terms looked up in OEIS at every small fixed slot
    // (at scale, not only the one slot the sources enumerate), the Clay lens (a seal), the involuted perspective (the
    // formula run from another family's address as referrer answers what it answers directly), and the research of
    // its family in the record. A lead no effort crosses is tagged by the cross formula for it: signal.detection(k)
    // — the chance k independent checks would have caught a manipulation — and stands as unverified until crossed.
    const researched = new Map<string, number>()
    const leads = []
    for (const x of open) {
      const key = `${x.family}.${x.name}`
      const slots = x.arity === 0 ? [] : x.arity === 1 ? [[]] : Array.from({ length: 8 }, (_, i) => [i + 1])
      const looked = await Promise.all(slots.map(async (fixed) => (await qpuDataOf('sequence', { family: x.family, formula: x.name, fixed })) as { agrees?: boolean; reading?: { oeis?: string } }))
      const oeis = looked.filter((r) => r.agrees === true).map((r) => r.reading?.oeis).filter(Boolean)
      const seal = d.seals.find((s) => s.family === x.family && s.program.includes(x.name))
      const params = Array.from({ length: x.arity }, () => 3)
      let involutes = false
      try {
        const own = qpuHexUuidOf({ family: x.family, program: [x.name], params })
        const other = [...qpuHexFamiliesOf()].find(([fam]) => !DOORS.has(fam) && fam !== x.family)
        const referrer = other ? qpuHexUuidOf({ family: other[0], program: [other[1][0]!.name], params: Array.from({ length: other[1][0]!.arity }, () => 3) }) : undefined
        const [direct, mirrored] = await Promise.all([qpuHexRunOf(own, undefined, undefined, { store: false }), qpuHexRunOf(own, referrer, undefined, { store: false })]) as { value?: unknown; holds?: boolean }[]
        // the perspective involutes when the address answers the same from the other family's referrer as directly
        involutes = String(direct?.value) === String(mirrored?.value)
      } catch { involutes = false }
      if (!researched.has(x.family)) researched.set(x.family, Number(((await qpuDataOf('research', { family: x.family })) as { reading?: { matched?: number } }).reading?.matched ?? 0))
      // THE RIGHT APIs, FUSED AND USED: the lead's own words find the registry's APIs, the readable ones are read, and
      // the numbers they answer are crossed with the values the lead takes on the small inputs; an API that answers a
      // value the lead reaches crosses it
      const words = [...new Set([x.family, ...x.name.replace(/[A-Z]/g, (c) => ` ${c.toLowerCase()}`).split(/[^a-z]+/)])].filter((w) => w.length > 2)
      const found = await apiSearchOf(words, qpuFacesOf().faces).catch(() => ({ matched: 0, apis: [] as { index: number; api: string; free?: number }[] }))
      const reads = await Promise.all(found.apis.filter((y) => y.free !== undefined).slice(0, qpuFacesOf().faces).map((y) => apiCallOf(y.index, y.free!).catch(() => null)))
      const answered = reads.filter((r): r is NonNullable<typeof r> => r !== null && r.status > 0)
      const inputs = x.arity === 0 ? [[]] : x.arity === 1 ? Array.from({ length: 16 }, (_, i) => [i + 1]) : Array.from({ length: 8 }, (_, i) => i + 1).flatMap((a) => Array.from({ length: 8 }, (_, j) => [a, j + 1]))
      const values = new Set<number>()
      for (const ps of inputs) { try { const r = (await qpuHexRunOf(qpuHexUuidOf({ family: x.family, program: [x.name], params: ps }), undefined, undefined, { store: false })) as { value?: unknown; holds?: boolean }; const v = Number(r.value); if (r.holds === true && Number.isSafeInteger(v) && v >= 3) values.add(v) } catch { /* an input the address cannot take */ } }
      const byApi = answered.map((r) => ({ api: r.api, hit: numbersOf(r.excerpt).find((v) => values.has(v)) })).find((r) => r.hit !== undefined)
      const efforts = { oeis: `${oeis.length}/${looked.length}`, seal: seal?.kind ?? 'none', involutes, research: researched.get(x.family) ?? 0, apis: `${answered.length}/${found.matched}`, values: values.size }
      const checks = looked.length + 1 + 1 + 1 + answered.length
      const liveRel = d.relations.find((r) => r.live && r.ways.some((w) => w.family === x.family && w.program.includes(x.name)))
      const crossedBy = oeis.length ? `OEIS ${oeis.join(', ')}` : seal ? `seal ${seal.kind}` : byApi ? `API ${byApi.api} answering ${byApi.hit}` : liveRel ? `a live reading reaching ${liveRel.value} with ${liveRel.families.filter((y) => y !== x.family).join(', ')}` : undefined
      leads.push({ formula: key, apis: answered.map((r) => r.api).slice(0, qpuFacesOf().faces), efforts, tag: crossedBy ? `crossed by ${crossedBy}` : `unverified after ${checks} checks: ${involutes ? 'consistent from every perspective but confirmed by no other domain' : 'inconsistent across perspectives'} — a manipulation until crossed`, detection: Number(SignalFormulas.detection(checks).value.toFixed(4)) })
    }
    const uncrossed = leads.filter((l) => l.tag.startsWith('unverified')).map((l) => l.formula)
    return f('gate-crossed', 'crossed = |{formulas no other family reaches and no dataset identifies, after every effort}|', uncrossed.length, uncrossed.length === 0, 'crossed', [], { relations: d.relations.length, liveInputs: d.liveInputs, identified: identified.size, leads: leads.slice(0, 56), uncrossed: uncrossed.slice(0, 56) })
  }
  /** THE PUSH IS A TRINITY OF FAMILIES, NOTHING BY HAND: data — every family of the slice deep-researched (its APIs to
   *  the registry's end, its slice of datasets) into the window; merkaba — the rosetta turned once each way over every
   *  family, every adjacent cross at once; gate — the families crossed with the record, the proof, the rules, and the
   *  leads tagged by crossed() over that window. holds = proof ∧ rules ∧ every family of the slice crossed; the
   *  rosetta and the leads ride in the reading. */
  static async push(from: number): Promise<CrossFormula> {
    const all = families()
    const slice = all.slice(from, from + qpuFacesOf().faces)
    const deep: { family: string; value: number }[] = []
    for (const [k] of slice.entries()) { const d = (await DataFormulas.deep(from + k)) as { value: number; family?: string }; deep.push({ family: slice[k]!, value: Number(d.value) }) }
    const crossed = await GateFormulas.researched(slice.map((_, k) => from + k))
    const failing = crossed.filter((c) => c.answered + c.live + c.crossing.length === 0).map((c) => c.name)
    const proof = GateFormulas.proof(), rules = GateFormulas.rules()
    const rosetta = MerkabaFormulas.rosetta(all.length) as unknown as { value: number; holds: boolean; edges?: number }
    // the leads are the whole lattice's: tagged once, under the last slice, over the window every slice filled
    const last = from + qpuFacesOf().faces >= all.length
    const tagged = last ? ((await GateFormulas.crossed()) as unknown as { value: number; leads?: unknown[] }) : { value: -1, leads: undefined }
    const holds = proof.holds && rules.holds && failing.length === 0
    return f('gate-push', 'push(from) = proof ∧ rules ∧ ⋀ family(i), i in [from, from + faces); data.deep → merkaba.rosetta → gate.crossed in the reading', crossed.length - failing.length, nat(from) && holds, 'push', [from], { deep, rosetta: { value: rosetta.value, holds: rosetta.holds, edges: rosetta.edges }, ...(last ? { uncrossed: tagged.value, leads: tagged.leads } : {}), proof: proof.value, rules: rules.value, failing, ...(from + slice.length < all.length ? { next: from + slice.length } : {}) })
  }
}

for (const name of ['commit', 'crossed', 'family', 'proof', 'push', 'rules'] as const)
  qpuHexRegisterOf('gate', name, (GateFormulas[name] as (...x: unknown[]) => unknown).bind(GateFormulas))
