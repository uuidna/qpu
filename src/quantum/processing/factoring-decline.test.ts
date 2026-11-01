// The 1000-bit factoring decline is a formulated Clay proof published in the README and the homepage, not prose: the
// pre-push gate (the test step, node --test over src/quantum/*.test.ts) fails if either page drops the formulation, or
// if the kernel theorems it cites stop holding by decide. The published claim and the kernel proof move together.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { TEXTBOOK_THEOREMS } from './textbook-theorems.ts'

const PAGES: Record<string, string> = { 'README.md': readFileSync('README.md', 'utf8'), 'docs/index.md': readFileSync('docs/index.md', 'utf8') }
// the formulation each page must carry: the 1000-bit case, the N ≤ 21 order-finding bound, the two kernel theorems, and the verdict
const REQUIRED = ['1000-bit', 'N ≤ 21', 'textbook_shor_reduction', 'textbook_rsa_beyond_bound', 'declined']

for (const [page, text] of Object.entries(PAGES))
  test(`the 1000-bit clay formulated proof is published in ${page}`, () => {
    const missing = REQUIRED.filter((t) => !text.includes(t))
    assert.deepEqual(missing, [], `${page} is missing the formulation tokens: ${missing.join(', ')}`)
  })

// the pages cite theorems the kernel actually proves: both exist and close by decide, and the bound theorem states the five-bit N ≤ 21
test('the cited kernel theorems hold by decide and state the bound', () => {
  const reduction = TEXTBOOK_THEOREMS.find((t) => t.key === 'textbook_shor_reduction')
  const bound = TEXTBOOK_THEOREMS.find((t) => t.key === 'textbook_rsa_beyond_bound')
  assert.ok(reduction, 'textbook_shor_reduction is defined')
  assert.ok(bound, 'textbook_rsa_beyond_bound is defined')
  assert.match(reduction!.lean, /by decide/, 'the reduction theorem closes by decide')
  assert.match(bound!.lean, /2 \^ 4 < 21 ∧ 21 < 2 \^ 5/, 'the bound theorem states the five-bit N ≤ 21')
  assert.match(bound!.lean, /by decide/, 'the bound theorem closes by decide')
})
