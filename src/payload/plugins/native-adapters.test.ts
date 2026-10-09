import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import {
  NATIVE_VENDORS,
  nativeAdaptersOf,
  nativeGateOf,
  nativeGatesFromOf,
  nativeJobOf,
  nativeQasmOf,
} from './native-adapters.js'

test('native-adapters: registry covers every vendor; connect bill; seal-safe; qiskit Bell → QPU', async (t) => {
  const reg = nativeAdaptersOf()
  assert.equal(reg.adapters.length, NATIVE_VENDORS.length)
  assert.equal(reg.holds, true)
  assert.equal(reg.goal, 'OPEN')
  assert.equal(reg.price.kind, 'price-relation')
  assert.equal(reg.price.court.holds, true)
  assert.equal(reg.price.holds, true)
  assert.ok(reg.connectBill.doors <= 16, `doors ${reg.connectBill.doors}`)
  assert.ok(reg.connectBill.under16384, `bytes ${reg.connectBill.bytes}`)
  assert.equal(reg.connectBill.qpuPrefixed, 0)
  assert.ok(reg.seal.call.includes('seal: true'))
  assert.ok(reg.seal.note.includes('claySealWaveOf') || reg.seal.capacity?.path === 'seal-wave')
  assert.ok(reg.adapters.every((a) => a.price.holds === true && a.price.court.standard.value === 1))

  assert.equal(nativeGateOf({ name: 'cx', qubits: [0, 1] })?.name, 'cnot')
  assert.equal(nativeGateOf({ gate: 'h', targets: [0] })?.name, 'h')
  assert.equal(nativeGateOf({ type: 'measure', qubits: [0] }), null)

  const qasm = nativeQasmOf('OPENQASM 2.0;\nqreg q[2];\nh q[0];\ncx q[0],q[1];\nmeasure q[0] -> c[0];')
  assert.equal(qasm.gates.length, 2)
  assert.ok(qasm.dropped >= 1)

  const from = nativeGatesFromOf({
    instructions: [{ gate: 'h', targets: [0] }, { gate: 'cnot', targets: [0, 1] }],
  })
  assert.equal(from.read, 'read')
  assert.equal(from.gates.length, 2)

  const job = await nativeJobOf({
    vendor: 'qiskit',
    gates: [
      { name: 'h', q: 0 },
      { name: 'cnot', c: 0, t: 1 },
    ],
    shots: 8,
    seal: true,
    pass: 0,
    mode: 5,
    who: 'other',
  })
  assert.equal(job.kind, 'native-job')
  assert.equal(job.vendor, 'qiskit')
  const discover = (job as { seal?: { discover?: string } }).seal?.discover
  assert.ok(discover === 'skipped' || discover === 'capacity-gated', `seal discover ${discover}`)
  assert.ok((job as { foreign?: { status?: string } }).foreign?.status === 'COMPLETED')
  assert.equal(job.price.kind, 'price-relation')
  assert.equal(job.price.ticket.minted, false)
  assert.equal(job.price.court.kind, 'price-court')
  assert.equal(job.price.court.standard.value, 1)
  assert.equal(job.price.holds, true)
  assert.ok(job.price.ticket.hex)

  const examples = reg.adapters.map((a) => `${a.vendor}: ${a.example.foreign} → ${a.example.qpu}`)
  t.diagnostic(`${reg.count} adapters; bill doors=${reg.connectBill.doors} bytes=${reg.connectBill.bytes}; price measure=${job.price.measure}; ${examples[0]}`)
})
