// The release receipt ignores nothing: every copy (the READMEs, the Zenodo record and the receipt the server reads) is the one text above
// its hardware mark and the committed device receipt below it, and that device receipt verifies by its own seal.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { RECEIPT, RECEIPT_DEVICE } from './receipt-index.ts'
import { deviceVerifies, pageWithDevice } from '../../../scripts/oneText.ts'
import type { Json } from './receipts.ts'

const device = RECEIPT_DEVICE as Json

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the committed device receipt verifies by its own seal and every copy carries it whole. */
test('the committed device receipt verifies by its own seal and every copy carries it whole', () => {
  const sealed = deviceVerifies(device)
  assert.equal(sealed.holds, true)
  for (const path of ['README.md', 'src/quantum/README.md']) assert.equal(readFileSync(path, 'utf8'), pageWithDevice(device), path)
  const record = JSON.parse(readFileSync('.zenodo.json', 'utf8')) as { notes: string; related_identifiers: { identifier: string }[] }
  for (const line of [`receipt ${RECEIPT.uuid}`, `sha256 ${RECEIPT.sha256}`, `hardware ${sealed.uuid}`, `hardware.sha256 ${sealed.sha256}`]) assert.ok(record.notes.split('\n').includes(line), line)
  assert.equal(record.related_identifiers[0]!.identifier, `urn:uuid:${RECEIPT.uuid}`)
})
