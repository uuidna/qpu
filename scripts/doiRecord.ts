// Writes the one text (scripts/oneText.ts) everywhere it is read from the repository: the README, the npm package's README, the
// receipt the MCP server welcomes every client with (receipt-index.ts) and the record Zenodo archives with every release, whose description is the release note. Zenodo's GitHub integration reads .zenodo.json at
// the tagged commit, so the record a version carries is the build that version is; the site writes the same text as its home page.
// Each copy ends with the hardware receipt of the build that wrote it, which differs from machine to machine: with --check nothing is
// written, every copy is compared up to its hardware mark, and a difference fails.
import { readFileSync, writeFileSync } from 'node:fs'
import { PROSE } from '../src/quantum/processing/prose-index.ts'
import { TOOLBOXES } from '../src/quantum/processing/mcp.ts'
import { LICENSE, PRECEDENCE } from '../src/quantum/processing/unit/license.ts'
import { RELEASE_REPOSITORY, UNIT_CONCEPT_DOI } from '../src/quantum/processing/release.ts'
import { HARDWARE_MARK, above, beforeHardware, hardware, htmlWithHardware, page, pkg, receipt, receipts, title, verified } from './oneText.ts'

const record = {
  title,
  version: pkg.version,
  upload_type: 'software',
  access_right: 'open',
  license: LICENSE.spdx.toLowerCase(),
  creators: [{ name: LICENSE.author, orcid: LICENSE.orcid.slice(LICENSE.orcid.lastIndexOf('/') + 1) }],
  description: htmlWithHardware,
  keywords: TOOLBOXES.map((b) => b.name),
  related_identifiers: [
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
  `export const RECEIPT_DEVICE: Record<string, unknown> = ${JSON.stringify(hardware.jsonLd)}`,
  '',
].join('\n')
const copies: readonly [string, string][] = [
  ['src/quantum/processing/receipt-index.ts', runtime],
  ['.zenodo.json', JSON.stringify(record, null, 2) + '\n'],
  ['README.md', page],
  ['src/quantum/README.md', page],
]

const check = process.argv.includes('--check')
let drift = 0
for (const [path, text] of copies) {
  let committed = ''
  try { committed = readFileSync(path, 'utf8') } catch { committed = '' }
  const agrees = beforeHardware(committed) === beforeHardware(text)
  if (!check && committed !== text) writeFileSync(path, text)
  if (check && !agrees) drift += 1
  console.log(JSON.stringify({ check, agrees, written: !check && committed !== text, path }))
}
console.log(JSON.stringify({ receipt: receipt.uuid, merge: receipt.merge.uuid, parts: receipt.parts.length, verified: verified.length, hardware: hardware.uuid }))
if (drift > 0) {
  console.error(PROSE.scriptsDoiRecord_s2)
  process.exit(1)
}
