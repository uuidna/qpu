/**
 * Build writes MCP, then README from the Lean proof of the QPU.
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { qpuIntegrityHolds, qpuMcpOf, qpuReadmeHolds, qpuReadmeOf } from './index.js'

if (!qpuIntegrityHolds()) {
  throw new Error('qpuIntegrityHolds')
}
const mcp = qpuMcpOf()
const readme = qpuReadmeOf(mcp)
if (!qpuReadmeHolds(readme) || mcp.tools[0]?.name !== 'qpu_quantum') {
  throw new Error('qpuReadmeHolds')
}
const root = process.cwd()
writeFileSync(join(root, 'mcp.json'), `${JSON.stringify(mcp, null, 2)}\n`)
writeFileSync(join(root, 'README.md'), readme)
writeFileSync(
  join(root, 'CITATION.cff'),
  [
    'cff-version: 1.2.0',
    'message: Cite the running quantum circuit and its Lean proof. VM scales. Quantum capacity infinite. Crypt split to free agents.',
    'title: QPU',
    'type: software',
    'authors:',
    '  - family-names: Rouschev',
    '    given-names: Tsvetan',
    '    email: ceccec@psg.bg',
    `url: ${mcp.origin}`,
    'repository-code: https://github.com/uuidna/qpu',
    'license: CC-BY-NC-ND-4.0',
    '',
  ].join('\n'),
)
