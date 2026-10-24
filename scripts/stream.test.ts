import test from 'node:test'
import assert from 'node:assert/strict'
import { deleteAt, linesOf, mergeInto, replicaOf, textOf, typeAt, type Op, type Replica } from '../src/edit/stream.ts'

const S = '00000000-0000-8000-8000-000000000001'
const OTHER = '00000000-0000-8000-8000-000000000002'
const A = '00000000-0000-8000-8000-00000000000a'
const B = '00000000-0000-8000-8000-00000000000b'

const seeded = (author: string, text: string): Replica => {
  const r = replicaOf(S, author)
  typeAt(r, 0, 0, text)
  return r
}

test('typing lands at its line and column', () => {
  const r = seeded(A, 'hello world')
  typeAt(r, 0, 6, 'big ')
  assert.equal(textOf(r), 'hello big world')
})

test('a newline splits the text into lines', () => {
  const r = seeded(A, 'hello world')
  typeAt(r, 0, 5, '\nX')
  assert.deepEqual(linesOf(r), ['hello', 'X world'])
})

test('a delete removes characters at a position', () => {
  const r = seeded(A, 'hello world')
  deleteAt(r, 0, 5, 6)
  assert.equal(textOf(r), 'hello')
})

test('typing after a deleted character still attaches to it', () => {
  const r = seeded(A, 'abc')
  deleteAt(r, 0, 1, 1)
  typeAt(r, 0, 1, 'X')
  assert.equal(textOf(r), 'aXc')
})

test('two authors typing at one position keep each run whole', () => {
  const base = seeded(A, 'ab')
  const left = mergeInto(replicaOf(S, A), [...base.ops.values()])
  const right = mergeInto(replicaOf(S, B), [...base.ops.values()])
  typeAt(left, 0, 1, 'XY')
  typeAt(right, 0, 1, 'PQ')
  const one = mergeInto(replicaOf(S, A), [...left.ops.values(), ...right.ops.values()])
  const two = mergeInto(replicaOf(S, B), [...right.ops.values(), ...left.ops.values()])
  assert.equal(textOf(one), textOf(two))
  assert.ok(textOf(one).includes('XY'), 'the first run stays whole')
  assert.ok(textOf(one).includes('PQ'), 'the second run stays whole')
  assert.ok(textOf(one).startsWith('a') && textOf(one).endsWith('b'))
})

test('any arrival order of three replicas converges to one text', () => {
  const base = seeded(A, 'shared')
  const copy = (author: string) => mergeInto(replicaOf(S, author), [...base.ops.values()])
  const x = copy(A)
  const y = copy(B)
  const z = copy('00000000-0000-8000-8000-00000000000c')
  typeAt(x, 0, 0, 'x')
  typeAt(y, 0, 6, 'y')
  deleteAt(z, 0, 2, 2)
  const all: Op[] = [...x.ops.values(), ...y.ops.values(), ...z.ops.values()]
  const expected = textOf(mergeInto(replicaOf(S, A), all))
  for (let round = 0; round < 40; round++) {
    const shuffled = [...all].sort(() => Math.random() - 0.5)
    assert.equal(textOf(mergeInto(replicaOf(S, B), shuffled)), expected)
  }
})

test('merging twice is the same as merging once', () => {
  const r = seeded(A, 'abc')
  const ops = [...r.ops.values()]
  const once = textOf(mergeInto(replicaOf(S, B), ops))
  const twice = textOf(mergeInto(mergeInto(replicaOf(S, B), ops), ops))
  assert.equal(once, twice)
})

test('a delete on one replica and an insert after the same character on another both survive', () => {
  const base = seeded(A, 'abc')
  const left = mergeInto(replicaOf(S, A), [...base.ops.values()])
  const right = mergeInto(replicaOf(S, B), [...base.ops.values()])
  deleteAt(left, 0, 1, 1)
  typeAt(right, 0, 2, 'Z')
  const merged = textOf(mergeInto(replicaOf(S, A), [...left.ops.values(), ...right.ops.values()]))
  assert.equal(merged, 'aZc')
})

test('operations from another stream are ignored', () => {
  const r = seeded(A, 'x')
  const foreign: Op = { kind: 'insert', stream: OTHER, id: 'f', seq: 1, author: A, after: null, ch: 'Q' }
  mergeInto(r, [foreign])
  assert.equal(textOf(r), 'x')
})
