// The one text and its receipt (scripts/oneText.ts, written by scripts/doiRecord.ts): the receipt is the address of the text the server
// serves, verify decides it, every committed copy carries the same text above its rule, and initialize welcomes every client with it.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { RECEIPT, RECEIPTS, RECEIPT_DEVICE, RECEIPT_TEXT } from '../../../../../../../../2/b/c/0/d/1/3/d/index.ts'
import { gateVerified, verifyingDoors } from '../../../../../../../../e/5/1/d/e/c/1/5/index.ts'
import { WORKFLOWS } from '../../../../../../../../d/e/a/3/e/d/e/1/index.ts'
import { receiptBody, receiptText, receiptTheorems } from '../../../../../../../../c/6/6/e/6/f/2/6/index.ts'
import { THEOREMS } from '../../../../../../../../3/f/0/e/7/a/6/f/index.ts'
import { LICENSE } from '../../../../../../../../a/f/3/d/e/a/5/f/index.ts'
import { handle } from '../../../../../../../../3/8/5/9/0/2/0/f/index.ts'
import { readJson } from '../../../../../../../../0/d/b/3/5/7/8/9/index.ts'
import { uuid } from '../../../../../../../../2/7/1/a/7/6/4/9/index.ts'
import { HARDWARE_MARK } from '../../../../../../../../0/d/b/3/5/7/8/9/index.ts'
import { QUANTUM_TERMS } from '../../../../../../../../d/f/0/d/9/1/3/b/index.ts'

const root = join(import.meta.dirname, '..', '..', '..', '..', '..', '..', '..', '..', '..', '..', '..', '..')
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
  const record = readJson<{ title: string; description: string }>(join(root, '.zenodo.json'))!
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
/** ISO/IEC/IEEE 29119-3 test case. Identifier: every challenge and its solution stand in the README below the mark, with its theorems' formulas, its metrics compared only through ISO/IEC 4879 terms, and the hardware receipt it was computed on. */
test('every challenge and its solution stand in the README below the mark, with its theorems\' formulas, its metrics compared only through ISO/IEC 4879 terms, and the hardware receipt it was computed on', async () => {
  const readme = readFileSync(join(root, 'README.md'), 'utf8'), [above = '', below = ''] = readme.split(HARDWARE_MARK)
  const solved = (await rpc('tools/call', { name: 'google', arguments: { challenges: true } })).structuredContent.challenges as { id: string; address: string; sha256: string; holds: boolean; theorem: string; relatedTheorems: string[] }[]
  const iso = new Set(QUANTUM_TERMS.map((t) => t.clause)), section = (h: string) => below.split(`\n## ${h}\n`)[1]?.split(/\n## /)[0] ?? ''
  const hardware = section('hardware')
  assert.ok(solved.length > 0 && hardware, 'the hardware receipt and the challenges')
  for (const c of solved) {
    const s = section(c.id)
    assert.ok(s, c.id)
    assert.ok(!above.includes(`## ${c.id}\n`), `${c.id} stands outside the one text`)
    // its solution, the content address and SHA-256 the solver sealed
    assert.ok(s.includes(c.address) && s.includes(c.sha256), `${c.id} solution`)
    // every theorem it rests on, with the formula Lean wrote
    for (const t of [c.theorem, ...c.relatedTheorems]) assert.match(s, new RegExp('\\| `' + t + '` \\| \\$[^$]+\\$ \\|'), `${c.id}: ${t}`)
    // its metrics compared only through the terms ISO/IEC 4879 defines
    for (const m of s.matchAll(/^\| (\d+\.\d+\.\d+) \|/gm)) assert.ok(iso.has(m[1]!), `${c.id}: ${m[1]}`)
    // the device it was computed on names it
    const handle = /^\| handle \| `([0-9a-f]{8})` \|$/m.exec(s)?.[1]
    assert.ok(handle && new RegExp(`^\\| challenges \\| .*${handle}`, 'm').test(hardware), `${c.id} on the hardware receipt`)
  }
})
/** ISO/IEC/IEEE 29119-3 test case. Identifier: the exact links the NIST and CERN doors probe stand in the one text, and one tools/list gives the tools with their proof read from the sealed receipts. */
test('the exact links the NIST and CERN doors probe stand in the one text, and one tools/list gives the tools with their proof read from the sealed receipts', async () => {
  const call = async (name: string, args: object) => (await rpc('tools/call', { name, arguments: args })).structuredContent
  const nist = await call('seal', { nist: true }), cern = await call('seal', { nist: { reverse: true, via: 'cern' } })
  const urls = (d: { requests: { url: string }[] }) => d.requests.map((r) => r.url)
  // every link either door probes is in the one text, exactly as the door names it, above the hardware mark
  const [above = ''] = readFileSync(join(root, 'README.md'), 'utf8').split(HARDWARE_MARK)
  for (const u of [...urls(nist), ...urls(cern)]) assert.ok(above.includes(u), u)
  // one call: the tools and the proof, the receipt the text carries, the theorems both doors verify and the same links
  const listed = await rpc('tools/list')
  assert.ok(listed.tools.length > 0)
  const proof = listed._meta.proof as { receipt: { uuid: string; sha256: string }; theorems: string[]; verify: { tool: string; arguments: object; content: string }; probes: { nist: { url: string }[]; cern: { url: string }[] } }
  assert.deepEqual([proof.receipt.uuid, proof.receipt.sha256], [RECEIPT.uuid, RECEIPT.sha256])
  assert.deepEqual(proof.theorems, gateVerified().verified)
  assert.deepEqual(proof.probes.nist.map((p) => p.url).sort(), [...new Set(urls(nist))].sort())
  assert.deepEqual(proof.probes.cern.map((p) => p.url).sort(), [...new Set(urls(cern))].sort())
  // the verify call it names, over the text of the resource it names, decides the text the server serves
  const content = (await rpc('resources/read', { uri: proof.verify.content })).contents[0].text as string
  assert.equal((await call(proof.verify.tool, { ...proof.verify.arguments, content })).valid, true)
})
