import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf, qpuMcpCallOf } from '../../quantum/processing/unit/index.js'
import { qpuDataOf } from '../../mcp/qpu-fused.js'
import '../../mcp/families.js'

/** Every formula the Clay solutions compose is cross developed: reached by a discovery relation with another family,
 *  the relation answering alike from every way's referrer; and tested on the public record: the family's words find
 *  APIs in the registry, and each formula's terms are looked up in OEIS. */
test('clay: every formula is cross developed from every perspective and tested on the public record', async (t) => {
  const names = (qpuHexFamiliesOf().get('clay') ?? []).map((f) => f.name)
  assert.ok(names.length >= 6, 'the six problems are formulas')
  const sorted = [...qpuHexFamiliesOf().keys()].filter((f) => !['qpu', 'crypto', 'api', 'data', 'gate'].includes(f)).sort()
  const run = async (program: string, params: number[]) => {
    const r = (await qpuMcpCallOf('qpu_cite', { hex: { family: 'data', program: [program], params } })) as { structuredContent?: Record<string, unknown> }
    const sc = r.structuredContent ?? {}
    qpuUuidReceiptOf(`clay data.${program}`, qpuContentUuidOf(sc), { params })
    return { ...sc, reading: (sc.steps as { reading?: Record<string, unknown> }[] | undefined)?.at(-1)?.reading ?? {} } as { value?: unknown; holds?: boolean; reading: Record<string, unknown> }
  }
  const research = await run('research', [sorted.indexOf('clay')])
  assert.ok(Number(research.value) > 0, 'the registry holds APIs the clay words name')
  const d = await run('discover', [256])
  const relations = ((d.reading.relations ?? []) as { value: string; families: string[]; ways: { family: string; program: string[]; hex: string }[] }[])
  void qpuHexUuidOf
  const seals = ((d.reading.seals ?? []) as { family: string; program: string[]; kind: string }[])
  // cross developed: another family reaches the value of a program that includes the formula; or the Clay lens found
  // its seal (a fixed point, an involution, an inverse pair); or it is an indicator — every value it takes over the
  // inputs tried is below the discovery floor — whose σ-involution holds on every input: the seal the paper states
  const floor = 3
  const crossed = async (name: string) => {
    if (relations.some((r) => r.families.length > 1 && r.ways.some((w) => w.family === 'clay' && w.program.includes(name)))) return 'relation'
    if (seals.some((s) => s.family === 'clay' && s.program.includes(name))) return 'seal'
    const arity = qpuHexFamiliesOf().get('clay')!.find((f) => f.name === name)!.arity
    const tuples = arity === 0 ? [[]] : arity === 1 ? Array.from({ length: 16 }, (_, i) => [i + 1]) : Array.from({ length: 8 }, (_, i) => i + 1).flatMap((a) => Array.from({ length: 8 }, (_, j) => [a, j + 1]))
    const runs = await Promise.all(tuples.map(async (params) => (await qpuHexRunOf(qpuHexUuidOf({ family: 'clay', program: [name], params }), undefined, undefined, { store: false })) as { value?: unknown; holds?: boolean }))
    return runs.length > 0 && runs.every((r) => r.holds === true && Number(r.value) < floor) ? 'involution' : undefined
  }
  const how = Object.fromEntries(await Promise.all(names.map(async (name) => [name, await crossed(name)])))
  assert.deepEqual(names.filter((name) => !how[name]), [], 'every clay formula is cross developed: a relation with another family, a seal, or an involution that holds on every input')
  const clayRelations = relations.filter((r) => r.ways.some((w) => w.family === 'clay'))
  for (const rel of clayRelations) {
    for (const w of rel.ways) for (const o of rel.ways) if (o !== w) {
      const r = (await qpuHexRunOf(w.hex, o.hex, undefined, { store: false })) as { value?: unknown }
      assert.equal(String(r.value), rel.value, `${w.family}.${w.program.join('∘')} from the perspective of ${o.family}.${o.program.join('∘')} reaches ${rel.value}`)
    }
  }
  // the datasets, at scale: every formula's terms looked up in OEIS — one parameter as it is, two with the other fixed
  // at each small natural (split), none (yangMills) through its value reached in the discovery with the live readings
  let looked = 0, identified = 0
  for (const name of names) {
    const arity = qpuHexFamiliesOf().get('clay')!.find((f) => f.name === name)!.arity
    if (arity === 0) { assert.ok(how[name], `clay.${name}: a value with no parameter is tested by the relation that reaches it or by its own involution`); continue }
    for (const fixed of arity === 1 ? [[]] : Array.from({ length: 8 }, (_, i) => [i + 1])) {
      const s = (await qpuDataOf('sequence', { family: 'clay', formula: name, fixed })) as { reading?: { oeis?: string }; warning?: string; agrees?: boolean }
      assert.ok(s.reading !== undefined || s.warning !== undefined, `clay.${name}(${fixed.join(',')}, n): its terms were looked up in OEIS`)
      looked += 1
      if (s.agrees === true) identified += 1
      qpuUuidReceiptOf(`clay sequence ${name} ${fixed.join(',')}`, qpuContentUuidOf(s), { agrees: s.agrees === true })
    }
  }
  const uuid = qpuHexUuidOf({ family: 'clay', program: [names[0]!], params: [1, 2] })
  const first = (await qpuHexRunOf(uuid)) as { holds?: boolean }
  qpuUuidReceiptOf('clay first', qpuContentUuidOf(first), { uuid })
  t.diagnostic(`${names.map((n) => `${n}: ${how[n]}`).join(', ')}; ${clayRelations.length} relations, every perspective closed; ${research.value} matched in the record; OEIS: ${identified} of ${looked} lookups identified`)
})
