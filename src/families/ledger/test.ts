import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { LedgerFormulas } from './index.js'

/** ledger: 8 exact-integer formulas, each recomputed from the palette and run at its hex address. */
test('ledger: debits, credits, balance, accounts, entries, periods, reconciled, combos', async (t) => {
  assert.equal(LedgerFormulas.debits(1000, 5).value, 5000, 'debits(1000, 5)')
  assert.equal(LedgerFormulas.credits(1000, 5).value, 5000, 'credits(1000, 5)')
  assert.equal(LedgerFormulas.balance(10000, 4000).value, 6000, 'balance(10000, 4000)')
  assert.equal(LedgerFormulas.accounts(500, 0).value, 500, 'accounts(500, 0)')
  assert.equal(LedgerFormulas.entries(1000, 2).value, 2000, 'entries(1000, 2)')
  assert.equal(LedgerFormulas.periods(12, 0).value, 12, 'periods(12, 0)')
  assert.equal(LedgerFormulas.reconciled(98, 100).value, 98, 'reconciled(98, 100)')
  assert.equal(LedgerFormulas.combos(6, 2).value, 15, 'combos(6, 2)')
  assert.equal(qpuHexFamiliesOf().get('ledger')?.length, 8)
  for (const [name, params, expected] of [["debits",[1000,5],5000],["credits",[1000,5],5000],["balance",[10000,4000],6000]] as [string, number[], number][]) {
    const uuid = qpuHexUuidOf({ family: 'ledger', program: [name], params })
    const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
    assert.equal(Number(run.value), expected, `ledger.${name} at ${uuid}`)
    qpuUuidReceiptOf(`ledger ${name}`, qpuContentUuidOf(run), { uuid })
  }
  t.diagnostic('8 formulas; ' + "debits=5000, credits=5000, balance=6000")
})
