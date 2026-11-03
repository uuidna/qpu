// src/mcp/crypto — the crypto word-folder, run by `npm run mcp:crypto`: a thin client over the one pure handler (src/quantum/mcp.ts), the
// crypto toolbox as any MCP client sees it. The toolbox tests itself (the selftest), then fold (content-address + the σ-involution) and seal
// (SHA-256 + an ML-DSA post-quantum signature) answer through the handler. The folder is the word; the meaning is the crypto the handler serves.
import { callOf } from '../../quantum/processing/mcp.ts'

type Reply = { result?: { content: { text: string }[] }; error?: { message: string } }
const call = (name: string, args: Record<string, unknown>): Record<string, any> => {
  const r = callOf(name, args) as Reply
  if (r.error) throw new Error(`${name}: ${r.error.message}`)
  return JSON.parse(r.result!.content[0]!.text) as Record<string, any>
}

const st = call('fold', { selftest: true })
console.log(`crypto selftest: ${st.checks.length} checks, ${st.passed ? 'all pass' : 'FAILED'}`)

const f = call('fold', { text: 'quantum crypto', bound: 2000 })
console.log(`fold: ${f.count} chunk(s), root ${String(f.root).slice(0, 12)}, σ_${f.boundary.d}(i) = ${f.boundary.d} − i (content-address, FNV, O(n))`)

const s = call('seal', { text: 'quantum crypto', sign: true })
const sig = s.signature ? `${typeof s.postQuantum === 'object' ? JSON.stringify(s.postQuantum).slice(0, 48) : s.postQuantum ?? 'PQC'} signed` : 'unsigned'
console.log(`seal: address ${String(s.address).slice(0, 12)}, sha256 ${String(s.sha256).slice(0, 12)} (vetted node:crypto / Web Crypto), ${sig}`)

console.log(st.passed ? 'mcp:crypto: green' : 'mcp:crypto: RED')
if (!st.passed) process.exitCode = 1
