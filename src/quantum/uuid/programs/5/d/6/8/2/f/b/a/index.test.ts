// A novelty cites its prior-art dossier by the dossier's own receipt, so the citation names that dossier's exact text.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { NOVELTIES } from '../../../../../../../../3/f/0/e/7/a/6/f/index.ts'
import { receiptOf } from '../../../../../../../../index.ts'

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every novelty's doc cites its dossier by that dossier's own receipt. */
test('every novelty\'s doc cites its dossier by that dossier\'s own receipt', () => {
  assert.ok(NOVELTIES.length > 0)
  for (const n of NOVELTIES) assert.ok(n.doc.includes(`Prior art: ${receiptOf('dossier', readFileSync(`lean/dossiers/${n.key}.md`, 'utf8')).address}`), n.key)
})
