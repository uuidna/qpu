// ISO conformance gate across the repository: documents, metadata, legal author rights, 128-bit to 122-qubit UUID folding and test cases.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { DOCUMENT_LANGUAGE, ISO_4217_COIN, ISO_80000_UNITS, ISO_CLAUSES, ISO_STANDARDS, isoConformance, orcidCheckValid } from './index.ts'
import { THEOREMS } from '../3/f/0/e/7/a/6/f/index.ts'
import { RECEIPT_DEVICE } from '../2/b/c/0/d/1/3/d/index.ts'
import { receiptBody } from '../c/6/6/e/6/f/2/6/index.ts'
import { quantumCapacity } from '../0/8/7/0/6/d/2/8/index.ts'

const auditedFiles = () => {
  const testFiles = execFileSync('git', ['ls-files', '*_test.ts', '*.test.ts'], { encoding: 'utf8' }).split('\n').filter(Boolean)
  const paths = [...new Set([
    ...testFiles,
    'src/quantum/uuid/programs/iso/index.test.ts',
    'src/quantum/uuid/programs/sdk/index.test.ts',
    'README.md',
    'src/quantum/README.md',
    'src/quantum/CATALOGUE.md',
    'LICENSE',
    'CITATION.cff',
    '.zenodo.json',
    'package.json',
    'src/quantum/package.json',
    ...(existsSync('.disclosure/disclosure.md') ? ['.disclosure/disclosure.md'] : []),
  ])]
  return Object.fromEntries(paths.map((p) => [p, readFileSync(p, 'utf8')]))
}

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the repository conforms to every ISO standard checked by isoConformance, and negative controls are refused by name. */
test('the repository conforms to every ISO standard checked by isoConformance, and negative controls are refused by name', () => {
  const files = auditedFiles()
  assert.equal(files['README.md'], files['src/quantum/README.md'])
  const rows = isoConformance(files)
  for (const row of rows) assert.equal(row.holds, true, `${row.standard}: ${row.findings.join(', ')}`)
  assert.equal(new Intl.DisplayNames(['en'], { type: 'language', fallback: 'none' }).of(DOCUMENT_LANGUAGE), 'English')
  const noCurrency = 'X'.repeat(3)
  assert.equal(ISO_4217_COIN.unit, noCurrency)
  assert.deepEqual(Object.values(ISO_80000_UNITS), ['B', 'bit', 'J'])
  assert.equal(orcidCheckValid('0009-0000-7312-9778'), true)
  assert.equal(orcidCheckValid('0009-0000-7312-9779'), false)

  // negative controls: each broken standard is caught and reported by name
  const readme = files['README.md']!
  const broken = isoConformance({
    'README.md': readme
      .replace(/^\| identifier \| [^|]+ \|\n/m, '')
      .replace(/^\| issued \| [^|]+ \|\n/m, '| issued | 27/11/2026 |\n')
      .replace(/^\| language \| [^|]+ \|\n/m, '| language | english |\n')
      .replace(new RegExp(`^\\| currency \\| ${noCurrency} \\|\\n`, 'm'), '| currency | QPU |\n')
      .replace('| bytes / B |', '| bytes |')
      .replace(/0009-0000-7312-9778/g, '0009-0000-7312-9779')
      .replace(/CC-BY-NC-ND-4\.0/gi, 'UNLICENSED')
      .replace(/10\.5281\/zenodo\.22700098/g, 'no-doi')
      .replace(/ISO 56005/g, 'none')
      .replace(/122 qubits in 16 bytes/g, 'custom'),
    'a.test.ts': "test('a case without its identifier', () => {})\n",
  })
  assert.deepEqual(
    broken.filter((r) => !r.holds).map((r) => r.standard),
    ['ISO/IEC/IEEE 29119-3', 'ISO/IEC/IEEE 15289', 'ISO 8601', 'ISO 639-1', 'ISO 4217', 'ISO/IEC 80000', 'ISO 27729', 'ISO/IEC 5962', 'ISO 690 / ISO 26324', 'ISO 56005', 'ISO/IEC 9834-8'],
  )
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: Lean certifies 128-bit folding into 122-qubit UUIDs and every ISO standard witness is in the kernel index. */
test('Lean certifies 128-bit folding into 122-qubit UUIDs and every ISO standard witness is in the kernel index', () => {
  const keys = new Set(THEOREMS.map((t) => t.key))
  for (const name of [
    'Qpu.Verify.Uuid.free_is_122',
    'Qpu.Verify.Uuid.bands_cover_the_free_bits',
    'Qpu.Verify.Uuid.program_capacity',
    'Qpu.Verify.Uuid.decode_encode_exact',
    'Qpu.Verify.Uuid.encode_lt_free_space',
    'Qpu.Verify.Uuid.encode_injective',
    'Qpu.Verify.Uuid.fold_128_to_122_fiber',
    'Qpu.Verify.Uuid.card_128_eq_card_122_mul_fixed',
    'Qpu.Verify.Uuid.card_free_eq_bands',
    'Qpu.Verify.Uuid.card_nibbles_eq_128_bits',
    'Qpu.Verify.Uuid.version_nibble_valid',
    'Qpu.Verify.Uuid.variant_nibble_valid',
    'Iso.document_identification_states',
    'Iso.test_suite_nonempty',
    'Iso.citation_elements_states',
    'Iso.doi_registrant_length',
    'Iso.isni_orcid_space_and_check',
    'Iso.ip_disclosure_complete',
    'Iso.spdx_expression_valid',
    'Iso.openchain_audit_conserved',
    'Iso.entropy_vacuum_log_zero',
    'Iso.octet_bits_card',
    'Iso.atomic_nucleon_states',
    'Iso.dlt_digest_space',
    'Iso.dlt_architecture_layers',
    'Iso.smart_contract_transitions',
    'Iso.swid_asset_tags',
    'Iso.lifecycle_processes_states',
    'Iso.architecture_view_correspondences',
    'Iso.rusp_quality_verdicts',
  ]) assert.ok(keys.has(name), `missing Lean theorem ${name}`)
  assert.equal(ISO_CLAUSES.length, 86)
  assert.equal(ISO_STANDARDS.length, 30)
  assert.equal(ISO_STANDARDS.filter((s) => s.witness !== null).length, 30)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the quantum receipt metadata reports true computational qubit capacity and utilisation in both the README and the sealed hardware receipt. */
test('the quantum receipt metadata reports true computational qubit capacity and utilisation in both the README and the sealed hardware receipt', () => {
  const cap = quantumCapacity()
  assert.deepEqual([cap.register.bits, cap.register.free, cap.used, cap.left, cap.full, cap.gate.holds], [128, 122, 122, 0, true, true])
  const device = receiptBody((RECEIPT_DEVICE as { additionalProperty: unknown }).additionalProperty) as Record<string, number | string>
  assert.equal(typeof device.issued, 'string')
  assert.equal(device.registerBytes, 16)
  assert.equal(device.registerQubits, 122)
  assert.equal(device.registersInMemory, Math.floor(Number(device.memoryBytes) / 16))
  assert.equal(device.registerQubitsInMemory, Number(device.registersInMemory) * 122)
  assert.equal(device.freeMemoryRegisters, Math.floor(Number(device.freeMemoryBytes) / 16))
  assert.equal(device.freeMemoryQubits, Number(device.freeMemoryRegisters) * 122)
  assert.equal(device.usedMemoryRegisters, Number(device.registersInMemory) - Number(device.freeMemoryRegisters))
  assert.equal(device.usedMemoryQubits, Number(device.usedMemoryRegisters) * 122)
  assert.equal(device.processRssRegisters, Math.floor(Number(device.rssBytes) / 16))
  assert.equal(device.processRssQubits, Number(device.processRssRegisters) * 122)
  assert.ok(Number(device.memoryUtilisationPct) >= 0 && Number(device.memoryUtilisationPct) <= 100)
})
