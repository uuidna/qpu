// The plan Payload is seeded from is the Lean catalogue, whole: every page, product and variant, each addressed once.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { planCatalogue } from './catalogue-seed.ts'
import { ISO_CLAUSES, ISO_STANDARDS } from './iso-index.ts'
import { NESTED, NESTED_COUNTS } from './nested-index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the plan holds every product and variant Lean counts, and every slug once. */
test('the plan holds every product and variant Lean counts, and every slug once', () => {
  const plan = planCatalogue()
  assert.equal(plan.counts.products, NESTED_COUNTS.products)
  assert.equal(plan.counts.variants, NESTED_COUNTS.variants)
  assert.equal(plan.counts.pages, NESTED.length + new Set(NESTED.map((page) => page.clause)).size + 1 + ISO_STANDARDS.length + ISO_CLAUSES.length)
  for (const list of [plan.pages, plan.categories, plan.products]) assert.equal(new Set(list.map((doc) => doc.slug)).size, list.length)
  assert.equal(plan.pages.filter((page) => page.parent !== null).every((page) => plan.pages.findIndex((parent) => parent.slug === page.parent) >= 0 && plan.pages.findIndex((parent) => parent.slug === page.parent) < plan.pages.indexOf(page)), true)
  assert.equal(plan.products.every((product) => plan.categories.some((category) => category.slug === product.category) && product.variants.every((variant) => plan.options.includes(variant))), true)
  assert.equal(plan.products.every((product) => product.description.some((line) => line.length > 0)), true)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a plan of one module holds that module alone. */
test('a plan of one module holds that module alone', () => {
  const plan = planCatalogue(['Qpu.Processing.Qft'])
  assert.deepEqual(plan.categories.map((category) => category.title), ['Qpu.Processing.Qft'])
  assert.deepEqual(plan.pages.map((page) => page.slug), ['processing', 'qpu-processing-qft'])
  assert.equal(plan.products.length, NESTED.find((page) => page.module === 'Qpu.Processing.Qft')!.products.length)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the home page states Lean's counts and features three products the plan holds. */
test("the home page states Lean's counts and features three products the plan holds", () => {
  const plan = planCatalogue()
  assert.equal(plan.home.slug, 'home')
  assert.equal(plan.pages.some((page) => page.slug === 'home'), false)
  for (const count of [NESTED_COUNTS.products, NESTED_COUNTS.textbooks, NESTED_COUNTS.variants]) assert.equal(plan.home.lead.includes(String(count)), true)
  assert.equal(plan.home.featured.length, 3)
  assert.equal(plan.home.featured.every((slug) => plan.products.some((product) => product.slug === slug && product.variants.length > 0)), true)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every standard and every term Lean lists is a page, and every term has a witness. */
test('every standard and every term Lean lists is a page, and every term has a witness', () => {
  const plan = planCatalogue()
  for (const standard of ISO_STANDARDS) assert.equal(plan.pages.filter((page) => page.title === standard.reference && page.parent === 'standards').length, 1)
  for (const term of ISO_CLAUSES) assert.equal(plan.pages.filter((page) => page.title === `${term.clause} ${term.name}` && page.parent === 'iso-iec-4879-2024').length, 1)
  assert.equal(ISO_CLAUSES.every((term) => term.witness.length > 0 && term.statement.length > 0), true)
  assert.equal(planCatalogue(['Qpu.Processing.Qft']).pages.some((page) => page.parent === 'standards'), false)
})
