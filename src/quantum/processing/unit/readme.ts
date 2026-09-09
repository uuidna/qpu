/**
 * Build writes MCP, then README from that catalog.
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { qpuMcpHolds, qpuMcpOf, qpuReadmeHolds, qpuReadmeOf } from './index.js'

const mcp = qpuMcpOf()
const catalog = `${JSON.stringify(mcp, null, 2)}\n`
const readme = qpuReadmeOf(mcp)
if (!qpuMcpHolds(mcp) || !qpuReadmeHolds(readme)) {
  throw new Error('qpuMcpHolds')
}
const root = process.cwd()
writeFileSync(join(root, 'mcp.json'), catalog)
writeFileSync(join(root, 'README.md'), readme)
