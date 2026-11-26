// Writes the one text (scripts/oneText.ts) everywhere it is read from the repository: the README, the npm package's README, the
// receipt the MCP server welcomes every client with (receipt-index.ts) and the record Zenodo archives with every release, whose description is the release note. Zenodo's GitHub integration reads .zenodo.json at
// the tagged commit, so the record a version carries is the build that version is; the site writes the same text as its home page.
// Each copy ends with the hardware receipt of the build that wrote it, which differs from machine to machine. With --check nothing is
// written and nothing is ignored: every copy is rendered again with the committed device receipt and must equal the committed copy byte for
// byte, and the device receipt must verify by its own seal, so the public reads a build every part of which is recomputed or verified.
import { readFileSync, writeFileSync } from 'node:fs'
import { PROSE } from '../src/quantum/processing/prose-index.ts'
import { TOOLBOXES } from '../src/quantum/processing/mcp.ts'
import { LICENSE, PRECEDENCE } from '../src/quantum/processing/unit/license.ts'
import { RELEASE_REPOSITORY, UNIT_CONCEPT_DOI } from '../src/quantum/processing/release.ts'
import { HARDWARE_MARK, above, deviceVerifies, hardware, htmlWithDevice, pageWithDevice, pkg, receipt, receipts, title, verified } from './oneText.ts'
import { RECEIPT_DEVICE } from '../src/quantum/processing/receipt-index.ts'
import type { Json } from '../src/quantum/processing/receipts.ts'

// every copy with a device receipt below its mark: this build's when writing, the committed one when checking
const copiesOf = (device: Json): readonly [string, string][] => {
  const { uuid: deviceUuid, sha256: deviceSha256 } = deviceVerifies(device)
  const record = {
    title,
    version: pkg.version,
    upload_type: 'software',
    access_right: 'open',
    license: LICENSE.spdx.toLowerCase(),
    creators: [{ name: LICENSE.author, orcid: LICENSE.orcid.slice(LICENSE.orcid.lastIndexOf('/') + 1) }],
    description: htmlWithDevice(device),
    // the build receipt that generated this release, line by line, and the device that minted it after the hardware mark
    notes: [
      `receipt ${receipt.uuid}`, `sha256 ${receipt.sha256}`, `merge ${receipt.merge.uuid}`, `root ${receipt.merge.root}`, `rfc ${receipt.merge.rfc}`,
      ...receipt.parts.map((p) => `part ${p.kind} ${p.uuid}`), `verify ${JSON.stringify({ uuid: receipt.uuid, content: 'text' })}`, `mcp ${receipt.mcp}`,
      HARDWARE_MARK, `hardware ${deviceUuid}`, `hardware.sha256 ${deviceSha256}`,
    ].join('\n'),
    // what a search for the work asks for, then the toolboxes it is served by
    keywords: ['lean4', 'formal-verification', 'theorem-proving', 'mcp', 'model-context-protocol', 'sha-3', 'post-quantum-cryptography', 'uuid', ...TOOLBOXES.map((b) => b.name)],
    related_identifiers: [
      { identifier: `urn:uuid:${receipt.uuid}`, relation: 'isIdenticalTo', scheme: 'urn' },
      { identifier: UNIT_CONCEPT_DOI, relation: 'isVersionOf', scheme: 'doi' },
      ...PRECEDENCE.filter((p) => p.doi !== UNIT_CONCEPT_DOI).map((p) => ({ identifier: p.doi, relation: 'references', scheme: 'doi' })),
      { identifier: `https://github.com/${RELEASE_REPOSITORY}`, relation: 'isSupplementTo', scheme: 'url' },
    ],
  }
  // the receipt as the server reads it at run time, so initialize welcomes every client with the same receipt and serves the text it addresses
  const runtime = [
    `// ${PROSE.scriptsDoiRecord_generated}`,
    `/** ${PROSE.scriptsDoiRecord_receiptDoc} */`,
    `export const RECEIPT = ${JSON.stringify({ uuid: receipt.uuid, sha256: receipt.sha256, title, version: pkg.version, mcp: receipt.mcp, merge: receipt.merge, parts: receipt.parts })} as const`,
    `/** ${PROSE.scriptsDoiRecord_textDoc} */`,
    `export const RECEIPT_TEXT: string = ${JSON.stringify(above)}`,
    `export const RECEIPTS: readonly Record<string, unknown>[] = ${JSON.stringify(receipts)}`,
    `// ${HARDWARE_MARK}`,
    `export const RECEIPT_DEVICE: Record<string, unknown> = ${JSON.stringify(device)}`,
    '',
  ].join('\n')
  return [
    ['src/quantum/processing/receipt-index.ts', runtime],
    ['.zenodo.json', JSON.stringify(record, null, 2) + '\n'],
    ['README.md', pageWithDevice(device)],
    ['src/quantum/README.md', pageWithDevice(device)],
  ]
}

const check = process.argv.includes('--check')
const committedDevice = RECEIPT_DEVICE as Json, sealed = deviceVerifies(committedDevice)
let drift = check && !sealed.holds ? 1 : 0
for (const [path, text] of copiesOf(check ? committedDevice : hardware.jsonLd)) {
  let committed = ''
  try { committed = readFileSync(path, 'utf8') } catch { committed = '' }
  const agrees = committed === text
  if (!check && committed !== text) writeFileSync(path, text)
  if (check && !agrees) drift += 1
  console.log(JSON.stringify({ check, agrees, written: !check && committed !== text, path }))
}
console.log(JSON.stringify({ receipt: receipt.uuid, merge: receipt.merge.uuid, parts: receipt.parts.length, verified: verified.length, hardware: check ? sealed.uuid : hardware.uuid, sealed: sealed.holds }))
if (drift > 0) {
  console.error(PROSE.scriptsDoiRecord_s2)
  process.exit(1)
}
