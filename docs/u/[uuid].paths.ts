// Every UUID the tree knows gets a page: the example blocks, the receipts of the stream, the imagined leads by their statements.
import { existsSync, readFileSync } from 'node:fs'
import { handle } from '../../src/quantum/mcp.ts'
import { EXAMPLES } from '../../src/quantum/examples.ts'
import { uuidOf } from '../../src/quantum/blocks.ts'
export default {
  paths() {
    const ids = new Set<string>()
    for (const e of EXAMPLES) { if (e.tool === 'audit') continue; const r = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } }) as { result?: { _meta: { block: { meta: { id: string } } } } }; if (r.result) ids.add(r.result._meta.block.meta.id) }
    if (existsSync('docs/public/receipts.ndjson')) for (const line of readFileSync('docs/public/receipts.ndjson', 'utf8').split('\n').filter(Boolean)) { try { const r = JSON.parse(line) as { id?: string }; if (r.id) ids.add(r.id) } catch { /* a torn line is a lead the purify step sees */ } }
    if (existsSync('docs/public/imagination.json')) { try { const im = JSON.parse(readFileSync('docs/public/imagination.json', 'utf8')) as { imagined?: { statement: string }[] }; for (const l of im.imagined ?? []) ids.add(uuidOf(l.statement)) } catch { /* same */ } }
    return [...ids].map((uuid) => ({ params: { uuid } }))
  },
}
