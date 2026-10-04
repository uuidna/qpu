import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { LoanFormulas } from './index.js'
import '../../mcp/families.js'

test('loan: simpleinterest, emi, totalinterest, balance, apr, term, prepayment, installment — crossing to banking', async (t) => {
  assert.equal(LoanFormulas.simpleinterest(1000, 5, 2).value, 100, 'two years of simple interest')
  assert.equal(LoanFormulas.emi(12000, 20, 12).value, 1200, 'the level monthly payment')
  assert.equal(LoanFormulas.totalinterest(1200, 12, 12000).value, 2400, 'interest over the life')
  assert.equal(LoanFormulas.balance(10000, 3000).value, 7000)
  assert.equal(LoanFormulas.balance(5000, 8000).value, 0, 'overpaid, nothing owed')
  assert.equal(LoanFormulas.apr(1200, 10000, 2).value, 6, 'the fee annualized')
  assert.equal(LoanFormulas.term(12000, 1000).value, 12, 'a year to clear it')
  assert.equal(LoanFormulas.prepayment(10000, 2).value, 200)
  assert.equal(LoanFormulas.installment(12000, 12).value, 1000, 'split evenly over the year')
  assert.equal(LoanFormulas.simpleinterest(1000, 5, 2).dst, 'banking')
  assert.equal(qpuHexFamiliesOf().get('loan')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'loan', program: ['installment'], params: [12000, 12] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 1000, `loan.installment at ${uuid}`)
  qpuUuidReceiptOf('loan installment', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; simpleinterest 100, emi 1200, totalinterest 2400, balance 7000, apr 6, term 12, prepayment 200, installment 1000; crossing to banking')
})
