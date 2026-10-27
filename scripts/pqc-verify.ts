// The post-quantum pass of the gate: seal { text: 'qpu', sign: 'ML-DSA-65' } asked at every host, each answer's signature
// verified here with the public key it carries and nothing else (Node's Web Crypto, FIPS 204): a host whose signature does
// not verify is an error block like any other. Runs only online; the plan's shape is the tool's, this is a thin client.
import { webcrypto } from 'node:crypto'
import { toolCallerOf } from '../src/quantum/mcp.ts'
import type { SignaturePlan } from '../src/quantum/toolboxes/crypto.ts'

type PqcHost = { host: string; status: number; ms: number; phase: string; keyed?: string; algorithm?: string; verified: boolean | null; note: string }
type PqcPass = { algorithm: 'ML-DSA-65'; text: 'qpu'; sha256Here: string; hosts: PqcHost[]; verified: number; note: string }

const bytesOfHex = (h: string) => new Uint8Array(Buffer.from(h, 'hex'))
const unb64 = (s: string) => new Uint8Array(Buffer.from(s, 'base64'))

export const verifySignaturesAt = async (hosts: readonly string[]): Promise<PqcPass> => {
  const here = toolCallerOf('seal')({ text: 'qpu', sign: 'ML-DSA-65' }) as { sha256: string; signature: SignaturePlan }
  const out: PqcHost[] = []
  await Promise.all(hosts.map(async (host) => {
    const t0 = Date.now()
    try {
      const res = await fetch(/\/mcp$/.test(host) ? host : `${host}/mcp`, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', 'user-agent': 'uuidna-qpu-e2e (https://qpu.uuidna.com)' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'seal', arguments: { text: 'qpu', sign: 'ML-DSA-65' } } }), signal: AbortSignal.timeout(20000) })
      const ms = Date.now() - t0
      const body = await res.json() as { result?: { structuredContent?: { sha256: string; signature?: SignaturePlan } } }
      const sc = body.result?.structuredContent
      const sig = sc?.signature
      if (!sc || !sig) { out.push({ host, status: res.status, ms, phase: 'no-plan', verified: null, note: `HTTP ${res.status}: no signature plan in the answer` }); return }
      if (sig.phase !== 'signed' || !sig.value || !sig.publicKey) { out.push({ host, status: res.status, ms, phase: sig.phase ?? 'planned', verified: null, note: sig.note ?? 'the plan came back unsigned' }); return }
      if (sc.sha256 !== here.sha256) { out.push({ host, status: res.status, ms, phase: sig.phase, keyed: sig.keyed, algorithm: sig.algorithm, verified: false, note: `the digest differs: ${sc.sha256} at the host, ${here.sha256} here` }); return }
      const key = await webcrypto.subtle.importKey('jwk', sig.publicKey as webcrypto.JsonWebKey, { name: sig.algorithm }, true, ['verify'])
      const ok = await webcrypto.subtle.verify({ name: sig.algorithm }, key, unb64(sig.value), bytesOfHex(sc.sha256))
      out.push({ host, status: res.status, ms, phase: sig.phase, keyed: sig.keyed, algorithm: sig.algorithm, verified: ok, note: ok ? `${sig.algorithm} signature of ${unb64(sig.value).length} bytes verified with the public key alone (${sig.keyed} key)` : 'the signature does not verify with the public key it came with' })
    } catch (e) { out.push({ host, status: 0, ms: Date.now() - t0, phase: 'failed', verified: null, note: `${(e as Error).message}` }) }
  }))
  out.sort((a, b) => a.host.localeCompare(b.host))
  const verified = out.filter((h) => h.verified === true).length
  return { algorithm: 'ML-DSA-65', text: 'qpu', sha256Here: here.sha256, hosts: out, verified, note: `${verified} of ${out.length} host(s) signed with ML-DSA-65 and verified here with the public key alone` }
}
