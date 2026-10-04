import { test } from '../../quantum/processing/unit/receipted.js'
import assert from 'node:assert/strict'
import { qpuHexFamiliesOf, qpuHexRunOf, qpuHexUuidOf, qpuContentUuidOf, qpuUuidReceiptOf } from '../../quantum/processing/unit/index.js'
import { ProteinFormulas } from './index.js'
import '../../mcp/families.js'

test('protein: molecularweight, residues, codons, isoelectric, hydrophobicity, foldingratio, concentration, aminoacidcount — crossing to biochemistry', async (t) => {
  assert.equal(ProteinFormulas.molecularweight(300).value, 33000, 'a 300-residue chain in daltons')
  assert.equal(ProteinFormulas.residues(900).value, 300, 'three bases to a codon')
  assert.equal(ProteinFormulas.codons(300).value, 301, 'one stop codon added')
  assert.equal(ProteinFormulas.isoelectric(2, 5).value, 10)
  assert.equal(ProteinFormulas.isoelectric(10, 2).value, 0, 'floored at zero')
  assert.equal(ProteinFormulas.hydrophobicity(45, 100).value, 45)
  assert.equal(ProteinFormulas.foldingratio(90, 100).value, 90)
  assert.equal(ProteinFormulas.concentration(100, 5).value, 20, 'mg per mL')
  assert.equal(ProteinFormulas.aminoacidcount(300, 2).value, 600)
  assert.equal(ProteinFormulas.molecularweight(300).dst, 'biochemistry')
  assert.equal(qpuHexFamiliesOf().get('protein')?.length, 8)
  const uuid = qpuHexUuidOf({ family: 'protein', program: ['molecularweight'], params: [300] })
  const run = (await qpuHexRunOf(uuid)) as { value?: unknown }
  assert.equal(Number(run.value), 33000, `protein.molecularweight at ${uuid}`)
  qpuUuidReceiptOf('protein molecularweight', qpuContentUuidOf(run), { uuid })
  t.diagnostic('8 formulas; molecularweight 33000, residues 300, codons 301, isoelectric 10, hydrophobicity 45, foldingratio 90, concentration 20, aminoacidcount 600; crossing to biochemistry')
})
