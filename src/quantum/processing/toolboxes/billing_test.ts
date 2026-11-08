import assert from 'node:assert/strict'
import test from 'node:test'

import { channel, uuid } from '../../uuid/index.ts'
import { call } from '../mcp.ts'
import { listSources } from '../sources.ts'
import { accountBytes, combinationVariants } from './billing.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every byte is the UUID handle and the program and params carry the rest. */
test('every byte is the UUID handle and the program and params carry the rest', () => {
  const rest = (text: string) => channel(uuid(text))
  const one = accountBytes(['a'])
  const oneRest = rest('a')
  assert.equal(one.bytes, 1)
  assert.equal(one.bits, 8)
  assert.equal(one.handle, '00000001')
  assert.equal(one.sku, one.handle)
  assert.equal(channel(one.uuid).sku, one.sku)
  assert.deepEqual(one.program, oneRest.program)
  assert.equal(one.params, oneRest.tail)
  assert.equal(one.line.count, one.bytes)
  assert.equal(channel(one.uuid).handle, one.handle)
  assert.equal(channel(one.uuid).program.join(), oneRest.program.join())
  assert.equal(channel(one.uuid).tail, oneRest.tail)
  assert.equal(one.sealed, true)
  assert.equal(one.holds, true)
  const sixteen = accountBytes(['0123456789abcdef'])
  assert.equal(sixteen.bytes, 16)
  assert.equal(sixteen.handle, '00000010')
  assert.deepEqual(sixteen.program, rest('0123456789abcdef').program)
  assert.equal(sixteen.params, rest('0123456789abcdef').tail)
  assert.equal(sixteen.holds, true)
  const wide = accountBytes(['é'])
  assert.equal(wide.bytes, 2)
  assert.equal(wide.bits, 16)
  assert.equal(wide.handle, '00000002')
  assert.equal(wide.params, rest('é').tail)
  const joined = accountBytes(['aa', 'b'])
  assert.equal(joined.bytes, 3)
  assert.equal(joined.handle, '00000003')
  assert.deepEqual(joined.program, rest('aa\0b').program)
  const spilled = accountBytes(2 ** 32 + 5)
  assert.equal(spilled.bytes, 2 ** 32 + 5)
  assert.equal(spilled.handle, '00000005')
  assert.deepEqual(spilled.program, rest(String(2 ** 32 + 5)).program)
  assert.equal(spilled.params, rest(String(2 ** 32 + 5)).tail)
  assert.equal(spilled.holds, true)
  const judged = listSources({ repository: 'https://github.com/uuidna/qpu.git', owner: 'uuidna', package: '@uuidna/qpu', hosts: [] }, [{ id: 'note', url: 'https://example.test', status: 200, text: 'abcd' }], [])
  assert.equal(judged.bytes.bytes, 4)
  assert.equal(judged.bytes.handle, '00000004')
  assert.deepEqual(judged.bytes.program, rest('abcd').program)
  assert.equal(judged.bytes.holds, true)
  const reply = call('verify', { uuid: uuid('a') }) as { result?: { _meta?: { bytes?: ReturnType<typeof accountBytes> } } }
  const booked = reply.result?._meta?.bytes
  assert.ok(booked)
  assert.equal(booked.holds, true)
  assert.equal(booked.bits, booked.bytes * 8)
  assert.equal(channel(booked.uuid).handle, booked.handle)
  assert.equal(channel(booked.uuid).program.join(), booked.program.join())
  assert.equal(channel(booked.uuid).tail, booked.params)
  const sku = combinationVariants()[0]!.sku
  assert.equal(sku, channel(uuid('qpu-combination\n0')).handle)
  assert.equal(sku, channel(uuid('qpu-combination\n0')).sku)
})
