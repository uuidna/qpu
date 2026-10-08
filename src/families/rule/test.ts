import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import '../../mcp/families.js'
import { RuleFormulas } from './index.js'

/** THE RULES, RUN. Each rule is a formula; the ones that count what breaks a rule must be zero. */
test('rule: no family is past its nibble, none is truncated, and every rule runs as a hex program', async (t) => {
  assert.equal(RuleFormulas.cap().value, 15)
  assert.equal(RuleFormulas.slice().value, 14)
  const n = Number(RuleFormulas.families().value)
  assert.ok(n >= 20, `${n} families`)
  const over = RuleFormulas.over()
  assert.equal(over.value, 0, `families past the cap: ${JSON.stringify((over as unknown as { over: string[] }).over)}`)
  assert.equal(over.holds, true)
  for (let i = 0; i < n; i++) {
    const tr = RuleFormulas.truncated(i)
    assert.equal(tr.value, 0, `family ${i} (${(tr as unknown as { family: string }).family}) is served whole`)
    assert.ok(Number(RuleFormulas.nibbles(i).value) + Number(RuleFormulas.free(i).value) === 15)
  }
  const total = Number(RuleFormulas.formulas().value)
  assert.equal(total, [...qpuHexFamiliesOf().values()].reduce((s, fs) => s + fs.length, 0))
  // the rules at their addresses
  for (const [name, params] of [['over', []], ['cap', []], ['truncated', [0]]] as [string, number[]][]) {
    const uuid = qpuHexUuidOf({ family: 'rule', program: [name], params })
    const run = (await qpuHexRunOf(uuid)) as { value?: unknown; holds?: boolean }
    assert.equal(run.holds, true, `rule.${name} holds at ${uuid}`)
    qpuUuidReceiptOf(`rule ${name}`, qpuContentUuidOf(run), { uuid })
  }
  t.diagnostic(`${n} families, ${total} formulas, none truncated`)
})

/** A superposition the discovery named, recomputed at each way's address. The shared integer is whatever the unit
 *  returns; the ways agree with each other. compositions(i) is called so the missing formula is driven. */
test('rule: compositions agrees with the superpositions that still meet, and the ones that moved stay leads', async (t) => {
  const at = async (family: string, program: string[], params: number[]) => {
    const uuid = qpuHexUuidOf({ family, program, params })
    const run = (await qpuHexRunOf(uuid, undefined, undefined, { store: false })) as { value?: unknown; holds?: boolean }
    assert.equal(run.holds, true, `${family}.${program.join('∘')}(${params.join(', ')}) at ${uuid}`)
    return String(run.value)
  }
  const agree = async (ways: readonly (readonly [string, string[], number[]])[]) => {
    const values = []
    for (const [family, program, params] of ways) values.push(await at(family, program, params))
    assert.equal(new Set(values).size, 1, values.join(' ≠ '))
    return values[0]!
  }
  const sixtyFour = await agree([
    ['Qpu.Mint', ['mintOf'], [6]],
    ['cross', ['medSecureWithQSec'], [1, 6]],
    ['cross', ['medSecureWithQSec'], [2, 5]],
    ['cross', ['medSecureWithQSec'], [4, 4]],
    ['cross', ['medSecureWithQSec'], [8, 3]],
    ['clay', ['bsd'], [268]],
    ['signal', ['keyspace'], [6]],
    ['rule', ['compositions'], [12]],
    ['kin', ['combinations'], [1]],
    ['kin', ['crossed', 'combinations'], [1, 1]],
    ['kin', ['crossed', 'combinations'], [2, 2]],
    ['kin', ['crossed', 'combinations'], [3, 3]],
    ['tesla', ['field'], [8, 8]],
    ['tesla', ['windings'], [8, 8]],
    ['yi', ['figures'], [6]],
    ['yi', ['withYang', 'figures'], [1]],
  ])
  assert.equal(String(RuleFormulas.compositions(12).value), sixtyFour)
  const fifteen = await agree([
    ['Qpu.Mint', ['chooseOf'], [6, 2]],
    ['Qpu.Mint', ['chooseOf'], [6, 4]],
    ['np', ['isTime', 'subsetSum'], [3, 2]],
    ['rule', ['cap'], []],
    ['rule', ['cap', 'cap'], []],
    ['rule', ['compositions', 'cap'], [1]],
    ['rule', ['compositions', 'cap'], [2]],
    ['kin', ['seal'], [255]],
    ['kin', ['period', 'dreamspellDrift'], [3]],
    ['tesla', ['field'], [3, 5]],
    ['tesla', ['field'], [5, 3]],
    ['tesla', ['sync'], [1, 8]],
    ['tesla', ['windings'], [3, 5]],
    ['yi', ['change'], [7, 8]],
    ['yi', ['change'], [8, 7]],
    ['yi', ['withYang'], [2]],
    ['yi', ['withYang'], [4]],
  ])
  const eightyOne = await agree([
    ['cal', ['gregorianDrift'], [3]],
    ['rule', ['compositions'], [4]],
    ['rule', ['compositions', 'compositions'], [3]],
  ])
  assert.equal(String(RuleFormulas.compositions(4).value), eightyOne)
  // these addresses were listed under a shared integer the unit no longer reaches. The next address is the formula
  // that moved; its own value holds, and it is not forced back onto the integer the discovery named.
  const leads: [string, string[], number[], string, string[], number[]][] = [
    ['rule', ['compositions'], [6], 'Qpu.Mint', ['mintOf'], [2]],
    ['rule', ['free'], [10], 'Qpu.Physics', ['transmon'], []],
    ['rule', ['nibbles'], [13], 'Qpu.Mint', ['chooseOf'], [5, 2]],
    ['rule', ['compositions'], [7], 'Qpu.Mint', ['mintOf'], [4]],
    ['rule', ['families'], [], 'hd', ['gate'], [362]],
    ['rule', ['compositions'], [9], 'rule', ['compositions'], [1]],
    ['rule', ['compositions'], [10], 'clay', ['hodge'], [50]],
    ['rule', ['formulas'], [], 'clay', ['hodge'], [104]],
    ['rule', ['compositions'], [8], 'kin', ['combinations', 'dootKin'], [2, 1, 1]],
  ]
  const moved = []
  for (const [family, program, params, otherFamily, otherProgram, otherParams] of leads) {
    const here = await at(family, program, params)
    const there = await at(otherFamily, otherProgram, otherParams)
    assert.notEqual(here, there, `${qpuHexUuidOf({ family, program, params })} answers ${here}`)
    if (program[0] === 'compositions' && program.length === 1) assert.equal(String(RuleFormulas.compositions(params[0]!).value), here)
    moved.push(`${qpuHexUuidOf({ family, program, params })} = ${here}`)
  }
  t.diagnostic(`compositions meets ${sixtyFour}, ${fifteen}, ${eightyOne}; leads ${moved.join('; ')}`)
})
