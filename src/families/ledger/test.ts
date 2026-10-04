import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { LedgerFormulas } from './index.js'
import '../../mcp/families.js'

test('ledger: balance, credit, debit, journal, posting, reconcile, trial, variance — crossing to accounting', async (t) => {
  assert.equal(LedgerFormulas.balance(5000, 3000).value, 2000, 'debits net of credits')
  assert.equal(LedgerFormulas.credit(100, 12).value, 1200)
  assert.equal(LedgerFormulas.debit(250, 4).value, 1000, 'total debits')
  assert.equal(LedgerFormulas.journal(50, 8).value, 400)
  assert.equal(LedgerFormulas.posting(100, 30).value, 4, 'four batches for the entries')
  assert.equal(LedgerFormulas.reconcile(8000, 7500).value, 500)
  assert.equal(LedgerFormulas.trial(5000, 5000).value, 1, 'trial balances')
  assert.equal(LedgerFormulas.trial(5000, 4000).value, 0)
  assert.equal(LedgerFormulas.variance(1200, 1000).value, 200)
  assert.equal(LedgerFormulas.balance(5000, 3000).dst, 'accounting')
  assert.equal(qpuHexFamiliesOf().get('ledger')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'ledger', program: ['posting'], params: [100, 30] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 4, `ledger.posting at ${uuid}`)
  qpuUuidReceiptOf('ledger posting', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; balance 2000, credit 1200, debit 1000, journal 400, posting 4, reconcile 500, trial 1, variance 200; crossing to accounting')
})
