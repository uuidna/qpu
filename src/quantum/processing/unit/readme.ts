/**
 * Build writes MCP, then README. Device metrics gate the catalog.
 * LICENSE names the captain fee and the occupancy unlock that fee delivers.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { qpuMcpOf, qpuMetricsHolds, qpuReadmeHolds, qpuReadmeOf } from './index.js'

if (!qpuMetricsHolds()) {
  throw new Error('qpuMetricsHolds')
}
const mcp = qpuMcpOf()
const catalog = `${JSON.stringify(mcp, null, 2)}\n`
const readme = qpuReadmeOf(mcp)
if (mcp.tools[0]?.name !== 'qpu_metrics' || !qpuReadmeHolds(readme)) {
  throw new Error('qpuReadmeHolds')
}
const root = process.cwd()
const licence = readFileSync(join(root, 'LICENSE'), 'utf8')
if (
  !licence.includes('Captain fee 2 per completed 110') ||
  !licence.includes('Paid fee delivers occupancy unlock') ||
  !licence.includes('Incomplete invoice + seed') ||
  !licence.includes('keys on every ray') ||
  !licence.includes('theorem millenium') ||
  !licence.includes('Not a Clay prize')
) {
  throw new Error('qpuLicence')
}
writeFileSync(join(root, 'mcp.json'), catalog)
writeFileSync(join(root, 'README.md'), readme)
