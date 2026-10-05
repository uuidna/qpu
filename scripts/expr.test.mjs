/**
 * A FAMILY COMPUTES FROM PURE DATA. The point of the one interpreter (src/quantum/processing/unit/expr.ts) is that a
 * formula need not be a hand-written TypeScript body — it is { name, params, expr } data in a nested document, and the
 * interpreter reproduces the hand body to the integer, holds and all. These are real bodies lifted from the domain
 * families (aerospace, accounting), each given as the expression and checked against the value the hand body returns —
 * including the div-by-zero branch the hand body guarded with `&& y > 0`, which here falls out of the evaluation.
 * Discovered by the scripts/*.test.mjs glob, run by the one gate.
 */
import test from 'node:test'
import assert from 'node:assert/strict'

test('real family formulas reproduce exactly from { params, expr } data', async () => {
  const { exprFormulaOf } = await import('../dist/quantum/processing/unit/expr.js')
  // [name, params, expr, [args, expectedValue, expectedHolds]...]  — expr is the hand body, verbatim arithmetic
  const cases = [
    // aerospace.lift = ⌊coeff · area / 100⌋
    ['lift', ['coeff', 'area'], 'floor(coeff * area / 100)', [[30, 200], 60, true]],
    // aerospace.orbit = ⌊radius³ / mass⌋ — and division by zero holds false, value 0 (the hand guard `&& mass > 0`)
    ['orbit', ['radius', 'mass'], 'floor(radius * radius * radius / mass)', [[10, 4], 250, true], [[10, 0], 0, false]],
    // aerospace.range = ⌊fuel / burn⌋ — burn 0 → 0, holds false
    ['range', ['fuel', 'burn'], 'floor(fuel / burn)', [[100, 7], 14, true], [[100, 0], 0, false]],
    // aerospace.payload = max(0, gross − dry) — never below zero, always holds for naturals
    ['payload', ['gross', 'dry'], 'max(0, gross - dry)', [[500, 120], 380, true], [[100, 300], 0, true]],
    // aerospace.mach = ⌊speed · 100 / sound⌋
    ['mach', ['speed', 'sound'], 'floor(speed * 100 / sound)', [[340, 343], 99, true]],
    // a negative (non-natural) argument holds false — the `nat(...)` guard, here derived
    ['payload-neg', ['gross', 'dry'], 'max(0, gross - dry)', [[-5, 1], 0, false]],
  ]
  for (const [name, params, expr, ...checks] of cases) {
    const run = exprFormulaOf({ name, params, expr })
    assert.equal(run.length, params.length, `${name}: arity reads as ${params.length}`)
    for (const [args, value, holds] of checks) {
      const got = run(...args)
      assert.equal(got.value, value, `${name}(${args.join(', ')}).value`)
      assert.equal(got.holds, holds, `${name}(${args.join(', ')}).holds`)
    }
  }
})

test('the interpreter refuses an unknown name or a malformed expression at compile time', async () => {
  const { exprFormulaOf } = await import('../dist/quantum/processing/unit/expr.js')
  assert.throws(() => exprFormulaOf({ name: 'x', params: ['a'], expr: 'floor(a / b)' }), /not a parameter/, 'b is not a parameter')
  assert.throws(() => exprFormulaOf({ name: 'x', params: ['a'], expr: 'wat(a)' }), /unknown function/, 'wat is not a function')
  assert.throws(() => exprFormulaOf({ name: 'x', params: ['a'], expr: 'a +' }), /unexpected end/, 'a dangling operator')
})
