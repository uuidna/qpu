/**
 * The fusion, seeded: reads what `npm run fuse` wrote under .fuse/ and creates one document per API, field,
 * cross formula and receipt. Streams the formulas line by line, so the whole registry seeds without holding it.
 */
import fs from 'node:fs'
import readline from 'node:readline'

export async function seedFuse(payload: any, dir = '.fuse') {
  const graph = JSON.parse(fs.readFileSync(`${dir}/fused-apis.json`, 'utf8')) as {
    apis: string[]
    rows: { api: string; spec: string; categories: string[]; reached: boolean; why?: string; methods: number; receipt?: string }[]
    hubs: { uuid: string; name: string; gives: number; takes: number; pairs: number }[]
  }
  const counts = { apis: 0, fields: 0, formulas: 0, receipts: 0 }
  for (const [qubit, row] of graph.rows.entries()) {
    await payload.create({ collection: 'fuse-apis', data: { ...row, qubit } })
    counts.apis++
  }
  for (const field of graph.hubs) {
    await payload.create({ collection: 'fuse-fields', data: field })
    counts.fields++
  }
  const lines = readline.createInterface({ input: fs.createReadStream(`${dir}/fuse-formulas.ndjson`) })
  for await (const line of lines) {
    if (!line) continue
    const f = JSON.parse(line)
    await payload.create({
      collection: 'fuse-formulas',
      data: { uuid: f.uuid, formulaId: f.id, src: f.src, dst: f.dst, formula: f.formula, value: f.value, entangled: f.entangled, forward: f.forward, backward: f.backward, proof: f.proof, receipt: f.receipt, holds: f.holds },
    })
    counts.formulas++
  }
  if (fs.existsSync(`${dir}/receipts.ndjson`)) {
    const rs = readline.createInterface({ input: fs.createReadStream(`${dir}/receipts.ndjson`) })
    for await (const line of rs) {
      if (!line) continue
      await payload.create({ collection: 'quantum-receipts', data: JSON.parse(line) })
      counts.receipts++
    }
  }
  return counts
}
