import assert from 'node:assert/strict'
import test from 'node:test'
import { rsaPrograms } from './index.ts'

test('every RSA case is one uuid program and factors the primes it was created with', () => {
  const programs = rsaPrograms()
  assert.equal(programs.holds, true)
  assert.equal(programs.via, 'rsa')
  assert.equal(programs.example, 'thousand')
  assert.equal(programs.written, false)
  assert.equal(programs.fetched, false)
  assert.equal(programs.walked, false)
  assert.equal(programs.rows[0]?.id, 'thousand')
  assert.equal(new Set(programs.rows.map((row) => row.address)).size, programs.cases)
  const thousand = programs.rows[0]!
  assert.equal(thousand.bits, 1000)
  assert.equal(thousand.example, true)
  assert.equal(thousand.product, true)
  assert.equal(thousand.same, true)
  assert.equal(BigInt(thousand.factors[0]!) * BigInt(thousand.factors[1]!), BigInt(thousand.integer))
  assert.equal(thousand.factors[0], thousand.primes[0])
  assert.equal(thousand.factors[1], thousand.primes[1])
  assert.equal(thousand.exit?.code, 0)
  assert.equal(thousand.exit?.holds, true)
  for (const row of programs.rows) {
    assert.equal(row.holds, true)
    assert.equal(row.depth, 7)
    assert.equal(row.places, 10)
    assert.equal(row.aspects, 4)
    assert.equal(row.kept, true)
    assert.equal(row.back, true)
    assert.equal(row.around, true)
    assert.equal(row.sealed, true)
    assert.equal(row.witnessed, true)
    assert.equal(row.same, true)
    assert.equal(row.product, true)
    assert.equal(row.rotated, row.program.slice(1) + row.program[0])
    assert.equal(row.handle, row.address.slice(0, 8))
    assert.equal(row.next.slice(0, 8), row.handle)
    assert.equal(row.factors.join(), row.primes.join())
    assert.equal(BigInt(row.factors[0]!) * BigInt(row.factors[1]!), BigInt(row.integer))
  }
  assert.equal(/[0-9a-f]{8}-[0-9a-f]{4}-/.test(programs.says), false)
})
