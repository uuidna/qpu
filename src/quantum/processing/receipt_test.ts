// The one text and its receipt (scripts/oneText.ts, written by scripts/doiRecord.ts): the receipt is the address of the text the server
// serves, verify decides it, every committed copy carries the same text above its rule, and initialize welcomes every client with it.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { RECEIPT, RECEIPTS, RECEIPT_DEVICE, RECEIPT_TEXT } from './receipt-index.ts'
import { gateVerified, verifyingDoors } from './verified.ts'
import { WORKFLOWS } from './config-index.ts'
import { receiptBody, receiptText, receiptTheorems } from './receipts.ts'
import { THEOREMS } from './theorems-index.ts'
import { LICENSE } from './unit/license.ts'
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

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every receipt is sealed under the address of its kind and body, and the merge is decided from the UUIDs of its parts alone. */
test('every receipt is sealed under the address of its kind and body, and the merge is decided from the UUIDs of its parts alone', async () => {
  type Node = Record<string, any>
  const named = (list: Node[]) => Object.fromEntries(list.map((p) => [p.name, p.value]))
  const [merge, ...parts] = RECEIPTS as Node[]
  // the parts the receipt of the text names are the receipts, by kind, handle and UUID, in order
  assert.deepEqual(parts.map((p) => ({ kind: p.alternateName, handle: named(p.identifier).handle, uuid: named(p.identifier).uuid })), RECEIPT.parts)
  // each UUID is the address of the kind and the body the receipt's own variables carry: nothing outside the receipt is read
  for (const p of [merge!, ...parts]) assert.equal(uuid(receiptText(p.alternateName, receiptBody(p.variableMeasured))), named(p.identifier).uuid, p.alternateName)
  assert.equal(uuid(receiptText('hardware', receiptBody((RECEIPT_DEVICE as Node).additionalProperty))), named((RECEIPT_DEVICE as Node).identifier).uuid)
  // the merge: the RFC 6962 root the seal door computes over the parts' UUIDs, from the UUIDs alone
  const uuids = RECEIPT.parts.map((p) => p.uuid)
  const root = (await rpc('tools/call', { name: 'seal', arguments: { merkle: { leaves: uuids } } })).structuredContent.root
  assert.equal(root, RECEIPT.merge.root)
  assert.equal(uuid(receiptText('qpu', { rfc: 6962, root, parts: uuids })), RECEIPT.merge.uuid)
  assert.deepEqual((merge!.hasPart as Node[]).map((x) => x.identifier), uuids)
  // one part changed changes the root: a proof of one part is checked against the root without the others' content
  const proof = (await rpc('tools/call', { name: 'seal', arguments: { merkle: { leaves: uuids, index: 1 } } })).structuredContent
  assert.deepEqual([proof.verified, proof.root], [true, RECEIPT.merge.root])
  assert.notEqual((await rpc('tools/call', { name: 'seal', arguments: { merkle: { leaves: [...uuids.slice(1), uuids[0]] } } })).structuredContent.root, root)
  // every receipt is a schema.org Dataset carrying the licence, the donation link where the author is reached, and what it costs to carry
  for (const p of [merge!, ...parts]) {
    assert.deepEqual([p['@context'], p['@type'], p.license, p.acquireLicensePage, p.potentialAction.target, p.creator.contactPoint.url], ['https://schema.org', 'Dataset', LICENSE.deed, LICENSE.url, LICENSE.donation, LICENSE.donation], p.alternateName)
    const cost = named(p.size)
    assert.ok(cost.bytes > 0 && cost.bits === cost.bytes * 8 && cost.tokens === Math.ceil(cost.bytes / 4) && cost.joules > 0, p.alternateName)
    // the coin's handle is the byte count
    assert.equal(parseInt(String(named(p.identifier).coin).slice(0, 8), 16), cost.bytes, p.alternateName)
  }
  // the formulas a receipt is based on are the theorems its body names, each with the TeX Lean wrote and its own cost
  const tex = new Map(THEOREMS.map((t) => [t.key, t.tex]))
  for (const p of parts) {
    assert.deepEqual((p.isBasedOn as Node[]).map((f) => f.name), receiptTheorems(receiptBody(p.variableMeasured)), p.alternateName)
    for (const f of p.isBasedOn as Node[]) assert.deepEqual([f.text, f.encodingFormat, named(f.size).bytes], [tex.get(f.name), 'application/x-tex', new TextEncoder().encode(tex.get(f.name)!).length], f.name)
  }
  assert.ok(parts.some((p) => p.isBasedOn.length > 0))
  // the device states its capacity by the register's own count, and no figure typed beside it
  const device = receiptBody((RECEIPT_DEVICE as Node).additionalProperty) as Record<string, number>
  assert.equal(device.registerQubitsInMemory, Math.floor(device.memoryBytes! / device.registerBytes!) * device.registerQubits!)
  assert.deepEqual(Object.keys(device).filter((k) => /stateVector|willow|sycamore|hostname|username|address|path/i.test(k)), [])
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the one text states only theorems Lean holds that both doors verify, each the kind of one receipt, and the rule that says so is decided first. */
test('the one text states only theorems Lean holds that both doors verify, each the kind of one receipt, and the rule that says so is decided first', async () => {
  const g = gateVerified()
  assert.deepEqual([g.holds, g.unverified, g.absent], [true, [], []])
  assert.ok(g.verified.length > 0)
  assert.deepEqual(RECEIPT.parts.map((p) => p.kind), g.verified)
  // each door names every one of them while it holds, and Lean holds each with its formula
  const doors = verifyingDoors(), held = new Set(THEOREMS.map((t) => t.key))
  assert.deepEqual([doors.nist.holds, doors.cern.holds], [true, true])
  for (const t of g.verified) assert.ok(doors.nist.theorems.includes(t as never) && doors.cern.theorems.includes(t as never) && held.has(t), t)
  // a theorem only one door names is refused by name, wherever it stands in the text
  const one = [...doors.nist.theorems, ...doors.cern.theorems].find((t) => !g.verified.includes(t))!
  const forged = gateVerified(RECEIPT_TEXT + '\n| theorem | `' + one + '` |\n')
  assert.deepEqual([forged.holds, forged.unverified], [false, [one]])
  // a receipt of anything but a verified theorem is refused, and so is a verified theorem left out
  assert.equal(gateVerified(RECEIPT_TEXT, [...RECEIPTS, { alternateName: 'capacity', isBasedOn: [] }]).holds, false)
  assert.equal(gateVerified(RECEIPT_TEXT, RECEIPTS.slice(0, -1)).holds, false)
  // the rule is the first of every workflow, marked to be decided before any step, and it holds on this tree
  for (const workflow of WORKFLOWS) {
    const rules = (await rpc('tools/call', { name: 'repository', arguments: { workflow, facts: {} } })).structuredContent.decision.rules as { rule: string; first?: boolean; holds: boolean | null; theorem: string }[]
    assert.deepEqual([rules[0]!.rule, rules[0]!.first, rules[0]!.holds, rules[0]!.theorem], ['verified', true, true, 'textbook_physical_evidence'], workflow)
    assert.deepEqual(rules.filter((r) => r.first).map((r) => r.rule), ['verified'], workflow)
  }
})
