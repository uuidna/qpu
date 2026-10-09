import { qpuHexFamiliesOf, qpuHexUuidOf } from '../src/quantum/processing/unit/index.js'
import '../src/mcp/families.js'
import { flowFamiliesOf } from '../src/families/merkaba/index.js'

const hits: { family: string; formula: string; j: number; arity: number; live: boolean; a: number }[] = []
const ring = flowFamiliesOf()
for (const [family, formulas] of qpuHexFamiliesOf()) {
  formulas.forEach((f, j) => {
    if (/fuse|fusion/i.test(f.name)) hits.push({ family, formula: f.name, j, arity: f.arity, live: Boolean(f.live), a: ring.indexOf(family) })
  })
}
console.log(JSON.stringify(hits, null, 1))
console.log('ring', ring.length)
