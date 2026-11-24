// The one text and its receipt (scripts/oneText.ts, written by scripts/doiRecord.ts): the receipt is the address of the text the server
// serves, verify decides it, every committed copy carries the same text above its rule, and initialize welcomes every client with it.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { RECEIPT, RECEIPT_TEXT } from './receipt-index.ts'
import { handle } from './mcp.ts'
import { uuid } from '../uuid/index.ts'

const root = join(import.meta.dirname, '..', '..', '..')
const rpc = async (method: string, params: unknown = {}) => ((await handle({ jsonrpc: '2.0', id: 1, method, params })) as { result: any }).result

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the receipt is the address and the SHA-256 of the one text. */
test('the receipt is the address and the SHA-256 of the one text', () => {
  assert.equal(RECEIPT.uuid, uuid(RECEIPT_TEXT))
  assert.equal(RECEIPT.sha256, createHash('sha256').update(RECEIPT_TEXT).digest('hex'))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the README, the npm README and the Zenodo record carry the one text and its receipt. */
test('the README, the npm README and the Zenodo record carry the one text and its receipt', () => {
  const readme = readFileSync(join(root, 'README.md'), 'utf8')
  assert.equal(readme, readFileSync(join(root, 'src', 'quantum', 'README.md'), 'utf8'))
  assert.equal(`${readme.split('\n---\n')[0]}\n`, RECEIPT_TEXT)
  assert.ok(readme.includes(RECEIPT.uuid) && readme.includes(RECEIPT.sha256))
  const record = JSON.parse(readFileSync(join(root, '.zenodo.json'), 'utf8')) as { title: string; description: string }
  assert.equal(record.title, RECEIPT.title)
  assert.ok(record.description.includes(RECEIPT.uuid))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: initialize welcomes with the receipt, and verify decides the text the resource serves. */
test('initialize welcomes with the receipt, and verify decides the text the resource serves', async () => {
  const init = await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'receipt-test', version: '1' } })
  assert.equal(init.serverInfo.receipt.uuid, RECEIPT.uuid)
  assert.ok(init.instructions.startsWith('Welcome.') && init.instructions.includes(RECEIPT.uuid))
  const text = (await rpc('resources/read', { uri: init.serverInfo.receipt.resource })).contents[0].text as string
  assert.equal(text, RECEIPT_TEXT)
  const verified = (await rpc('tools/call', { name: 'verify', arguments: { uuid: RECEIPT.uuid, content: text } })).structuredContent
  assert.equal(verified.valid, true)
  const tampered = (await rpc('tools/call', { name: 'verify', arguments: { uuid: RECEIPT.uuid, content: `${text} ` } })).structuredContent
  assert.equal(tampered.valid, false)
})
