/**
 * Develop leads. Integrity then the generated README from the Lean proof.
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { qpuCernOf, qpuCiteOf, qpuDevelopHolds, qpuIntegrityHolds, qpuMcpOf, qpuReadmeHolds, qpuReadmeOf } from './index.js'

if (!qpuIntegrityHolds()) {
  throw new Error('qpuIntegrityHolds')
}
if (!qpuDevelopHolds()) {
  throw new Error('qpuDevelopHolds')
}
const mcp = qpuMcpOf()
const cite = qpuCiteOf()
const cern = qpuCernOf()
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
    'message: Cite the running quantum circuit and its Lean proof.',
    'title: QPU',
    'type: software',
    'authors:',
    `  - family-names: ${cite.author.last}`,
    `    given-names: ${cite.author.first}`,
    '    email: ceccec@psg.bg',
    `    orcid: ${cite.author.orcid}`,
    `url: ${mcp.origin}`,
    'repository-code: https://github.com/uuidna/qpu',
    'license: CC-BY-NC-ND-4.0',
    `version: ${cite.served.version}`,
    'identifiers:',
    `  - description: Archived version ${cite.archived.version} at ${cite.archived.commit}${cite.current ? '' : ' (the host serves v' + cite.served.version + ')'}`,
    '    type: doi',
    `    value: ${cite.doi}`,
    '  - description: All versions',
    '    type: doi',
    `    value: ${cite.conceptdoi}`,
    '',
  ].join('\n'),
)
writeFileSync(
  join(root, '.zenodo.json'),
  `${JSON.stringify(
    {
      title: 'QPU',
      description: `Running quantum circuit at ${mcp.origin}. theorem quantum : fused = faces * mintOf (bits + seed). Public quantum API. No auth. JSON-LD. The TypeScript and Lean sources are the blueprint. ORCID ${cite.author.orcid}.`,
      upload_type: 'software',
      access_right: 'open',
      license: 'cc-by-nc-nd-4.0',
      creators: [{ name: `${cite.author.last}, ${cite.author.first}`, orcid: cite.author.orcid.replace('https://orcid.org/', '') }],
      keywords: ['qpu', 'quantum-processing-unit', 'uuidna', 'mcp', 'Lean 4'],
      communities: [{ identifier: 'uuidna' }],
      related_identifiers: [
        { identifier: cite.prior.doi, relation: 'references', scheme: 'doi', resource_type: 'publication' },
        { identifier: mcp.origin, relation: 'isDocumentedBy', scheme: 'url', resource_type: 'publication-softwaredocumentation' },
        { identifier: cite.rows.find((r) => r.title === 'quantum processing unit')!.url, relation: 'isDocumentedBy', scheme: 'url', resource_type: 'publication-softwaredocumentation' },
        { identifier: 'https://github.com/uuidna/qpu', relation: 'isSupplementTo', scheme: 'url', resource_type: 'software' },
        { identifier: cite.conceptdoi, relation: 'isVersionOf', scheme: 'doi', resource_type: 'software' },
        ...cern.records.map((row) => ({
          identifier: row.doi,
          relation: 'references' as const,
          scheme: 'doi' as const,
          resource_type: 'dataset' as const,
        })),
      ],
      notes: 'Cite the running quantum circuit and its Lean proof.',
    },
    null,
    2,
  )}\n`,
)
