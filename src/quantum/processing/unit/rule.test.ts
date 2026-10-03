import { test } from './receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from './index.js'
import '../../../mcp/families.js'
import { RuleFormulas } from '../../../mcp/rule-formulas.js'

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
