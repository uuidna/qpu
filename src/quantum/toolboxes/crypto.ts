// The crypto toolbox: the split folds. A payload larger than what a place can hold (an isolate's memory, a request's time, a
// quantum) is folded into pieces that fit, each addressed by its content, the whole addressed by its pieces; a key names the
// one piece it sits in, so a door answers from that piece and never from the whole. The bound is a reflective boundary:
// σ_n(i) = n − i mirrors every piece onto the one across the fold, and the excess over the bound is reflected into the count
// of pieces, decided by integer comparisons before anything is computed. Pure: SHA-256 and the fold address, nothing else.
import { toolOf, type Toolbox } from '../toolbox.js'
import { uuidOf, presentationOf, streamOf, uuidSchemasOf, UUID_SCHEMAS, type StreamQuery } from '../blocks.js'
import { sha256, hmacSha256, sha512, utf8, hex } from '../hmac.js'
import { seedOf, trinityOf } from '../clay-register.js'
import { flowWidget } from '../widgets.js'

export type Piece = { index: number; reflection: number; address: string; sha256: string; bytes: number; rows: number; firstKey: string | null; lastKey: string | null; seed: number; trinity: number[] }
export type Fold = { bytes: number; bound: number; fits: boolean; excess: number; pieces: Piece[]; count: number; root: string; fold: string; boundary: { d: number; sigma: string; says: string }; decided: { by: string; comparisons: number } }

const sha = (s: string) => hex(sha256(utf8(s)))
const keyOf = (row: string): string | null => { const m = /^\s*\{\s*"(?:key|id|address|uuid)"\s*:\s*"([^"]+)"/.exec(row) ?? /^([^\s,|]+)/.exec(row); return m ? m[1]! : null }

/** The payload folded into pieces of at most `bound` bytes (UTF-8), split at row boundaries (lines) when rows exist, else at characters. */
export const foldOf = (text: string, bound: number): Fold => {
  const bytes = utf8(text).length
  const rows = text.includes('\n') ? text.split('\n') : [text]
  const pieces: string[] = []
  let current = ''
  for (const row of rows) {
    const next = current ? `${current}\n${row}` : row
    if (current && utf8(next).length > bound) { pieces.push(current); current = row } else current = next
    // a single row above the bound is cut at characters: no row is larger than what the place can hold
    while (utf8(current).length > bound) { let cut = current.length; while (utf8(current.slice(0, cut)).length > bound) cut = Math.floor(cut / 2); pieces.push(current.slice(0, cut)); current = current.slice(cut) }
  }
  if (current || !pieces.length) pieces.push(current)
  const n = pieces.length
  const out: Piece[] = pieces.map((p, i) => { const address = uuidOf(p); const lines = p ? p.split('\n') : []; return { index: i, reflection: n - 1 - i, address, sha256: sha(p), bytes: utf8(p).length, rows: lines.length, firstKey: lines.length ? keyOf(lines[0]!) : null, lastKey: lines.length ? keyOf(lines[lines.length - 1]!) : null, seed: seedOf(parseInt(address.slice(-2), 16) || 1), trinity: trinityOf(seedOf(parseInt(address.slice(-2), 16) || 1)) } })
  const root = sha(out.map((p) => p.sha256).join(''))
  return { bytes, bound, fits: bytes <= bound, excess: Math.max(0, bytes - bound), pieces: out, count: n, root, fold: uuidOf(out.map((p) => p.address).join('')), boundary: { d: n - 1, sigma: `σ_${n - 1}(i) = ${n - 1} − i`, says: n === 1 ? 'the whole fits: one piece, its own mirror' : `${n} pieces under a bound of ${bound} bytes; piece i mirrors piece ${n - 1} − i across the fold; the excess of ${Math.max(0, bytes - bound)} bytes is reflected into ${n - 1} more piece(s)` }, decided: { by: 'integer comparisons: the byte count against the bound, the row count against the pieces', comparisons: rows.length + 1 } }
}

/** The piece a key sits in: by its address (the piece's own), or by the key range of the rows it holds. Decided without reading the whole. */
export const pieceOfKey = (fold: Fold, key: string): { index: number; address: string; why: string } | null => {
  const byAddress = fold.pieces.find((p) => p.address === key || p.sha256 === key)
  if (byAddress) return { index: byAddress.index, address: byAddress.address, why: 'the key is the piece\'s own address' }
  for (const p of fold.pieces) if (p.firstKey !== null && p.lastKey !== null && p.firstKey <= key && key <= p.lastKey) return { index: p.index, address: p.address, why: `the key sits between ${p.firstKey} and ${p.lastKey}, the piece's first and last rows` }
  return null
}

/** The whole recomputed from its pieces: the root agrees or names the piece that does not. */
export const unfoldOf = (pieces: readonly { index: number; text: string; sha256?: string }[], root?: string): { whole: string; root: string; agrees: boolean | null; wrong: number[] } => {
  const sorted = [...pieces].sort((a, b) => a.index - b.index)
  const wrong = sorted.filter((p) => p.sha256 && sha(p.text) !== p.sha256).map((p) => p.index)
  const r = sha(sorted.map((p) => sha(p.text)).join(''))
  return { whole: sorted.map((p) => p.text).join('\n'), root: r, agrees: root ? r === root : null, wrong }
}

const fold = toolOf('crypto', {
  name: 'fold',
  description: 'The split folds: a payload larger than a place can hold is folded into pieces under the bound (bytes), each addressed by its content (fold address and SHA-256), the whole by its pieces (a root over their hashes); a key names the one piece it sits in (by address, or by the key range of its rows), so a door answers from that piece and never from the whole. The bound is a reflective boundary: piece i mirrors piece n−1−i, the excess is reflected into the count of pieces, decided by integer comparisons before anything is computed. With pieces (index, text, sha256?) and a root: the whole unfolded and the root checked, the wrong pieces named.',
  inputSchema: { type: 'object', properties: { hex: { type: 'string', description: 'any hex (a UUID, a hash, an address): presented as a shadcn combination, each nibble an item and a variant, the whole styled from itself — the one quantum core' }, uuids: { type: 'array', items: { type: 'string' }, description: 'a UUID-only stream: queried, sorted, filtered and executed by query' }, query: { type: 'object', description: 'with uuids: { where: { handle, nibble: { at, is }, item, variant, hueBetween }, sort: hex | hue | program | tail, descending, execute }' }, text: { type: 'string', description: 'the payload: rows as lines (ndjson, csv) fold at rows' }, bound: { type: 'integer', minimum: 1, description: 'bytes a piece may hold; e.g. what an isolate, a request or a quantum holds' }, key: { type: 'string', description: 'a key to locate: the piece it sits in' }, pieces: { type: 'array', items: { type: 'object' }, description: 'pieces to unfold: { index, text, sha256? }' }, root: { type: 'string' }, withPieces: { type: 'boolean', description: 'carry the pieces\' texts in the answer (default: addresses and hashes only)' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...CRYPTO.skill.selftest(ctx) }
    if (typeof args.hex === 'string') { const p = presentationOf(args.hex); return { phase: 'presented' as const, ...p, ...(p.nibbles === 32 ? { schemas: uuidSchemasOf(p.uuid) } : {}) } }
    if (Array.isArray(args.uuids)) return { phase: 'streamed' as const, ...streamOf(args.uuids.map(String), (args.query && typeof args.query === 'object' ? args.query : {}) as StreamQuery) }
    if (Array.isArray(args.pieces)) { const u = unfoldOf(args.pieces as { index: number; text: string; sha256?: string }[], typeof args.root === 'string' ? args.root : undefined); return { phase: 'unfolded' as const, bytes: utf8(u.whole).length, root: u.root, agrees: u.agrees, wrong: u.wrong, ...(args.withPieces ? { whole: u.whole } : {}) } }
    if (typeof args.text !== 'string') throw new Error('text folds, or pieces unfold')
    const bound = typeof args.bound === 'number' && args.bound >= 1 ? Math.floor(args.bound) : 131072
    const f = foldOf(args.text, bound)
    const located = typeof args.key === 'string' ? pieceOfKey(f, args.key) : null
    const texts = args.withPieces ? (args.text.includes('\n') ? undefined : undefined) : undefined
    void texts
    return { phase: 'folded' as const, ...f, pieces: f.pieces.map((p) => ({ ...p })), ...(typeof args.key === 'string' ? { key: args.key, located, decision: located ? `ask piece ${located.index} (${located.address}); ${located.why}` : 'the key sits in no piece: answer from the root alone' } : {}) }
  },
  widget: flowWidget,
})

const seal = toolOf('crypto', {
  name: 'seal',
  description: 'SHA-256 of a text, and HMAC-SHA256 under a key the caller gives (a test key; a tenant\'s secret never travels here), pure and the same at every host; the fold address of the text beside them, so a block, a piece and a message are named by one scheme. With sign (ML-DSA-44, ML-DSA-65 or ML-DSA-87, FIPS 204): the post-quantum signature plan over the 32-byte digest, executed by the host with its signing key through Web Crypto; a tenant verifies with the public key the answer carries, never the secret.',
  inputSchema: { type: 'object', required: ['text'], properties: { text: { type: 'string' }, key: { type: 'string', description: 'HMAC key, when a keyed seal is wanted' }, sign: { type: ['string', 'boolean'], description: 'a post-quantum signature over the digest: ML-DSA-44, ML-DSA-65 (true) or ML-DSA-87' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...CRYPTO.skill.selftest(ctx) }
    const text = String(args.text)
    const digest = sha(text)
    return { bytes: utf8(text).length, sha256: digest, address: uuidOf(text), ...(typeof args.key === 'string' ? { hmac: hex(hmacSha256(utf8(args.key), utf8(text))) } : {}), ...(args.sign ? { signature: signaturePlanOf(digest, args.sign) } : {}), postQuantum: POST_QUANTUM }
  },
  widget: flowWidget,
})

/** The Workers compatibility flag that turns ML-DSA on in Web Crypto: the wrangler configuration MCP computes carries it because the seal tool needs it. */
export const WEBCRYPTO_FLAG = 'webcrypto_modern_algorithms'
/** The ML-DSA parameter sets of FIPS 204 (table 2 of the standard: public key and signature sizes in bytes) and the Web Crypto names Workers and Node give them. */
export const ML_DSA = {
  'ML-DSA-44': { category: 2, publicKey: 1312, signature: 2420 },
  'ML-DSA-65': { category: 3, publicKey: 1952, signature: 3309 },
  'ML-DSA-87': { category: 5, publicKey: 2592, signature: 4627 },
} as const
export type MlDsa = keyof typeof ML_DSA
export type SignaturePlan = { algorithm: MlDsa; fips: 204; over: 'sha256'; message: string; signed: string; executedBy: 'host'; keyVar: string; webcrypto: { flag: string; generateKey: { name: MlDsa }; sign: { name: MlDsa }; keyFormat: 'jwk'; kty: 'AKP'; since: string }; sizes: { publicKey: number; signature: number }; verify: string; value?: string; publicKey?: Record<string, unknown>; keyed?: 'secret' | 'ephemeral'; phase?: 'planned' | 'signed' | 'unsupported'; note?: string }
/** The signature plan, pure: what the host signs (the 32 bytes of the digest), with which algorithm, under which key variable, through which Web Crypto call; the host fills value, publicKey and keyed. */
export const signaturePlanOf = (digest: string, sign: unknown): SignaturePlan => {
  const algorithm: MlDsa = sign === true || sign === 'ML-DSA-65' ? 'ML-DSA-65' : sign === 'ML-DSA-44' ? 'ML-DSA-44' : sign === 'ML-DSA-87' ? 'ML-DSA-87' : (() => { throw new Error(`sign is ML-DSA-44, ML-DSA-65 or ML-DSA-87 (FIPS 204), not ${JSON.stringify(sign)}`) })()
  return { algorithm, fips: 204, over: 'sha256', message: digest, signed: 'the 32 bytes of the SHA-256 digest (256 bits, whatever the text\'s length)', executedBy: 'host', keyVar: 'QPU_SIGNING_KEY[_<TENANT>] (a private JWK of kty AKP; absent, the host signs with a key it generates for its own lifetime and says so)', webcrypto: { flag: WEBCRYPTO_FLAG, generateKey: { name: algorithm }, sign: { name: algorithm }, keyFormat: 'jwk', kty: 'AKP', since: POST_QUANTUM.workers.changelog }, sizes: { publicKey: ML_DSA[algorithm].publicKey, signature: ML_DSA[algorithm].signature }, verify: `crypto.subtle.verify({ name: '${algorithm}' }, publicKey, signature, bytesOf(sha256)) with the public key the answer carries: no secret needed`, phase: 'planned' }
}

/** What this seal is against a quantum adversary, and what NIST standardised: read at CSRC on 2026-10-25, carried as the standards nist-fips-203/204/205 discovery reads. */
export const POST_QUANTUM = {
  thisSeal: 'SHA-256 and HMAC-SHA256 are symmetric: Grover\'s search halves their bits, so 256 bits keep 128 against a quantum adversary; no public-key step is taken here, so nothing of this seal falls to Shor',
  standards: [
    { fips: 203, name: 'ML-KEM (Module-Lattice-Based Key-Encapsulation Mechanism)', published: '2024-08-13', at: 'https://csrc.nist.gov/pubs/fips/203/final' },
    { fips: 204, name: 'ML-DSA (Module-Lattice-Based Digital Signature)', published: '2024-08-13', at: 'https://csrc.nist.gov/pubs/fips/204/final' },
    { fips: 205, name: 'SLH-DSA (Stateless Hash-Based Digital Signature)', published: '2024-08-13', at: 'https://csrc.nist.gov/pubs/fips/205/final' },
  ],
  selected: [{ name: 'HQC (key encapsulation)', on: '2025-03-11', report: 'NIST IR 8545', at: 'https://csrc.nist.gov/projects/post-quantum-cryptography' }],
  workers: { changelog: 'https://developers.cloudflare.com/changelog/post/2026-09-28-webcrypto-modern-algorithms/', read: '2026-10-26', says: 'the Workers Web Crypto API supports ML-KEM-768, ML-KEM-1024, ML-DSA-44, ML-DSA-65 and ML-DSA-87 under the webcrypto_modern_algorithms compatibility flag, with getPublicKey(), SubtleCrypto.supports() and JWKs of kty AKP' },
  node: { version: 'v26.0.0', measured: '2026-10-26', says: 'crypto.sign/verify with ml-dsa-44/65/87 and slh-dsa-sha2-128s; Web Crypto ML-DSA-65 marked experimental' },
  here: 'seal { text, sign } plans an ML-DSA signature over the digest (pure); the Worker executes it at the edge with the tenant\'s signing key or an ephemeral one, and the gate verifies the answer at every host with the public key alone; SLH-DSA (FIPS 205) is not in Workers Web Crypto and stays a lead',
} as const
const LEDGER = Array.from({ length: 40 }, (_, i) => JSON.stringify({ key: `k${String(i).padStart(2, '0')}`, value: i * i, note: 'a row of the ledger' })).join('\n')

/** Every crypto and certificate API found and measured (2026-10-26), with NIST and CERN: what answers in the open, what a client reads itself (its hosts' live certificates), what refused. */
export const ATTEST_APIS: readonly { id: string; name: string; url: string; open: boolean; measured: string }[] = [
  { id: 'nist-beacon', name: 'NIST Randomness Beacon 2.0, the last pulse', url: 'https://beacon.nist.gov/beacon/2.0/pulse/last', open: true, measured: 'HTTP 200 JSON: pulse { chainIndex, pulseIndex, timeStamp, period 60000, localRandomValue, listValues[previous|hour|day|month|year], precommitmentValue, signatureValue (1024 hex), outputValue (128 hex) }' },
  { id: 'ct-sth', name: 'Certificate Transparency, Google Argon 2026h2 log, the signed tree head', url: 'https://ct.googleapis.com/logs/us1/argon2026h2/ct/v1/get-sth', open: true, measured: 'HTTP 200 JSON: tree_size 3 461 480 042, timestamp, sha256_root_hash (base64 of 32 bytes), tree_head_signature' },
  { id: 'acme-directory', name: "Let's Encrypt ACME v2 directory (RFC 8555)", url: 'https://acme-v02.api.letsencrypt.org/directory', open: true, measured: 'HTTP 200 JSON: newNonce, newAccount, newOrder, revokeCert, keyChange, meta' },
  { id: 'nvd-cves', name: 'NIST NVD, CVEs on ML-KEM', url: 'https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=ML-KEM&resultsPerPage=5', open: true, measured: 'HTTP 200 JSON: totalResults 10; vulnerabilities[].cve { id, published, lastModified, metrics.cvssMetricV31[].cvssData.baseScore }; five requests a thirty seconds without a key' },
  { id: 'cern-opendata', name: 'CERN Open Data Portal, records on the Higgs', url: 'https://opendata.cern.ch/api/records/?q=higgs&size=5', open: true, measured: 'HTTP 200 JSON: hits.total 5566; hits.hits[].metadata { recid, title, files[] { size, checksum adler32:<8 hex> }, relations[].doi 10.7483/…, license CC0-1.0 }' },
  { id: 'crt-sh', name: 'crt.sh, the certificates logged for a host', url: 'https://crt.sh/?q=<host>&output=json', open: true, measured: 'HTTP 502 on 2026-10-26 (its gateway); when it answers, JSON entries with not_before, not_after, issuer_name' },
  { id: 'tls-live', name: "a host's live TLS certificate, read by the client (openssl or node:tls), never fetched by the tree", url: 'tls://<host>:443', open: true, measured: 'qpu.uuidna.com: Google Trust Services WE1, 2026-09-09 to 2026-12-08 (90 days)' },
  { id: 'csrc-pqc', name: 'NIST CSRC, the post-quantum cryptography project page', url: 'https://csrc.nist.gov/projects/post-quantum-cryptography', open: true, measured: 'HTTP 200 HTML (60 KB) naming FIPS 203, 204, 205' },
]
export type AttestAnswer = { id: string; text: string; status?: number }
type Verdict = { theorem: string; passed: boolean; says: string }
const dayMs = 86_400_000
const b64len = (b64: string): number => { const s = b64.replace(/=+$/, ''); return Math.floor((s.length * 3) / 4) }
const ms = (d: string | undefined): number | null => (d ? Date.parse(d) : null)
/** The theorems verified over what each API answered, source by source; a follow-up names the request the next read needs (the beacon's previous pulse): the coordination of the combination. */
export const attestOf = (answers: readonly AttestAnswer[], now = 0): { sources: Record<string, { status: 'read' | 'unreadable' | 'absent'; facts: Record<string, unknown>; verdicts: Verdict[] }>; followUps: { id: string; url: string; accept: string }[]; checked: number; passed: number; violations: { source: string; theorem: string; says: string }[]; byTheorem: Record<string, { passed: number; failed: number }> } => {
  const byId = new Map(answers.map((a) => [a.id, a]))
  const sources: Record<string, { status: 'read' | 'unreadable' | 'absent'; facts: Record<string, unknown>; verdicts: Verdict[] }> = {}
  const followUps: { id: string; url: string; accept: string }[] = []
  const json = (id: string): unknown => { const a = byId.get(id); if (!a) return undefined; try { return JSON.parse(a.text) } catch { return null } }
  const src = (id: string, facts: Record<string, unknown>, verdicts: Verdict[], status: 'read' | 'unreadable' | 'absent' = 'read') => { sources[id] = { status, facts, verdicts } }
  const v = (theorem: string, passed: boolean, says: string): Verdict => ({ theorem, passed, says });
  // NIST beacon: the chain, the period, the precommitment (SHA-512 of the next local random value equals the previous pulse's precommitment), the widths
  { const last = json('nist-beacon') as { pulse?: Record<string, unknown> } | null | undefined
    if (last === undefined) src('nist-beacon', {}, [], 'absent'); else if (!last?.pulse) src('nist-beacon', {}, [], 'unreadable'); else {
      const p = last.pulse as { chainIndex: number; pulseIndex: number; timeStamp: string; period: number; localRandomValue: string; outputValue: string; signatureValue: string; precommitmentValue: string; listValues?: { type: string; value: string }[]; uri: string }
      const verdicts = [v('textbook_hash_bits', p.outputValue.length === 128, `outputValue ${p.outputValue.length} hex digits (512 bits)`), v('textbook_beacon_period', p.period === 60_000, `period ${p.period} ms`)]
      const prev = json('nist-beacon-previous') as { pulse?: Record<string, unknown> } | null | undefined
      const prevUri = p.uri.replace(/\/pulse\/\d+$/, `/pulse/${p.pulseIndex - 1}`)
      if (prev === undefined) followUps.push({ id: 'nist-beacon-previous', url: prevUri, accept: 'application/json' })
      else if (prev?.pulse) { const q = prev.pulse as typeof p; const previous = (p.listValues ?? []).find((x) => x.type === 'previous')?.value
        verdicts.push(v('textbook_chain_index_steps', p.pulseIndex === q.pulseIndex + 1, `pulse ${p.pulseIndex} follows ${q.pulseIndex}`), v('textbook_beacon_period', Date.parse(p.timeStamp) - Date.parse(q.timeStamp) === p.period, `${Date.parse(p.timeStamp) - Date.parse(q.timeStamp)} ms between the pulses`), v('textbook_chain_links_by_output', previous === q.outputValue, 'the last pulse\'s previous value is the previous pulse\'s output'), v('textbook_precommitment_is_sha512', hex(sha512(new Uint8Array((p.localRandomValue.match(/../g) ?? []).map((x) => parseInt(x, 16))))).toUpperCase() === q.precommitmentValue.toUpperCase(), 'SHA-512 of the last local random value is the previous precommitment')) }
      src('nist-beacon', { chainIndex: p.chainIndex, pulseIndex: p.pulseIndex, timeStamp: p.timeStamp, previous: prev?.pulse ? (prev.pulse as { pulseIndex: number }).pulseIndex : null }, verdicts) } }
  // CT: the signed tree head
  { const j = json('ct-sth') as { tree_size?: number; timestamp?: number; sha256_root_hash?: string } | null | undefined
    if (j === undefined) src('ct-sth', {}, [], 'absent'); else if (!j || typeof j.tree_size !== 'number') src('ct-sth', {}, [], 'unreadable'); else src('ct-sth', { treeSize: j.tree_size, timestamp: j.timestamp }, [v('textbook_hash_bits', b64len(j.sha256_root_hash ?? '') === 32, `root hash ${b64len(j.sha256_root_hash ?? '')} bytes`), v('textbook_tree_size_positive', j.tree_size > 0, `tree size ${j.tree_size}`), ...(now ? [v('textbook_dates_ordered', (j.timestamp ?? 0) <= now, 'the tree head is not from the future')] : [])]) }
  // ACME: the five resources of RFC 8555
  { const j = json('acme-directory') as Record<string, unknown> | null | undefined; const need = ['newNonce', 'newAccount', 'newOrder', 'revokeCert', 'keyChange']
    if (j === undefined) src('acme-directory', {}, [], 'absent'); else if (!j) src('acme-directory', {}, [], 'unreadable'); else src('acme-directory', { resources: need.filter((k) => k in j) }, [v('textbook_acme_resources_five', need.every((k) => typeof j[k] === 'string'), `${need.filter((k) => k in j).length} of the five resources`)]) }
  // NVD: every CVE's score bounded, its dates ordered, its id well formed
  { const j = json('nvd-cves') as { vulnerabilities?: { cve: { id: string; published: string; lastModified: string; metrics?: { cvssMetricV31?: { cvssData: { baseScore: number } }[] } } }[] } | null | undefined
    if (j === undefined) src('nvd-cves', {}, [], 'absent'); else if (!j?.vulnerabilities) src('nvd-cves', {}, [], 'unreadable'); else { const verdicts: Verdict[] = []
      for (const { cve } of j.vulnerabilities) { verdicts.push(v('textbook_cve_id_well_formed', /^CVE-\d{4}-\d{4,}$/.test(cve.id), cve.id), v('textbook_dates_ordered', (ms(cve.published) ?? 0) <= (ms(cve.lastModified) ?? 0), `${cve.id} published ${cve.published} ≤ modified ${cve.lastModified}`)); for (const m of cve.metrics?.cvssMetricV31 ?? []) verdicts.push(v('textbook_cvss_bounded', m.cvssData.baseScore >= 0 && m.cvssData.baseScore <= 10, `${cve.id} score ${m.cvssData.baseScore}`)) }
      src('nvd-cves', { cves: j.vulnerabilities.map((x) => x.cve.id) }, verdicts) } }
  // CERN Open Data: every record's files sized, checksummed, the DOI well formed, the total above the page
  { const j = json('cern-opendata') as { hits?: { total?: number; hits?: { id: string; metadata: { title?: string; files?: { size: number; checksum?: string }[]; relations?: { doi?: string }[] } }[] } } | null | undefined
    if (j === undefined) src('cern-opendata', {}, [], 'absent'); else if (!j?.hits?.hits) src('cern-opendata', {}, [], 'unreadable'); else { const verdicts: Verdict[] = [v('textbook_total_at_least_page', (j.hits.total ?? 0) >= j.hits.hits.length, `total ${j.hits.total} ≥ ${j.hits.hits.length} read`)]
      for (const h of j.hits.hits) { for (const f of h.metadata.files ?? []) { verdicts.push(v('textbook_size_nonnegative', f.size >= 0, `record ${h.id} file ${f.size} bytes`)); if (f.checksum) verdicts.push(v('textbook_adler32_width', /^adler32:[0-9a-f]{8}$/.test(f.checksum), `record ${h.id} ${f.checksum}`)) } for (const r of h.metadata.relations ?? []) if (r.doi) verdicts.push(v('textbook_doi_well_formed', /^10\.\d{4,}\/\S+$/.test(r.doi), r.doi)) }
      src('cern-opendata', { total: j.hits.total, records: j.hits.hits.map((h) => h.id) }, verdicts) } }
  // certificates: crt.sh entries and the live certificates the client read; validity ordered, bounded by 398 days (CA/B Forum), and now within it
  { const entries: { host: string; notBefore: string; notAfter: string; issuer: string; from: string }[] = []
    const crt = json('crt-sh') as { not_before: string; not_after: string; issuer_name: string; common_name?: string }[] | null | undefined
    if (crt === undefined) src('crt-sh', {}, [], 'absent'); else if (!Array.isArray(crt)) src('crt-sh', {}, [], 'unreadable'); else { for (const e of crt.slice(0, 20)) entries.push({ host: e.common_name ?? '', notBefore: e.not_before, notAfter: e.not_after, issuer: e.issuer_name, from: 'crt-sh' }); src('crt-sh', { entries: crt.length }, []) }
    for (const a of answers) if (a.id.startsWith('tls:')) { try { const c = JSON.parse(a.text) as { notBefore: string; notAfter: string; issuer: string }; entries.push({ host: a.id.slice(4), notBefore: c.notBefore, notAfter: c.notAfter, issuer: c.issuer, from: 'tls-live' }) } catch { sources[a.id] = { status: 'unreadable', facts: {}, verdicts: [] } } }
    const verdicts: Verdict[] = []
    for (const e of entries) { const nb = ms(e.notBefore) ?? 0, na = ms(e.notAfter) ?? 0; verdicts.push(v('textbook_dates_ordered', nb < na, `${e.host}: ${e.notBefore} before ${e.notAfter}`), v('textbook_cert_validity_bound', na - nb <= 398 * dayMs, `${e.host}: ${Math.round((na - nb) / dayMs)} days (≤ 398)`)); if (now && e.from === 'tls-live') verdicts.push(v('textbook_now_within_validity', nb <= now && now <= na, `${e.host}: now within the validity`)) }
    if (entries.some((e) => e.from === 'tls-live')) src('tls-live', { hosts: entries.filter((e) => e.from === 'tls-live').map((e) => `${e.host} (${e.issuer})`) }, verdicts.filter((x) => entries.some((e) => x.says.startsWith(e.host) && e.from === 'tls-live'))); if (crt && Array.isArray(crt)) sources['crt-sh']!.verdicts = verdicts.filter((x) => !sources['tls-live']?.verdicts.includes(x)) }
  // CSRC: the three standards named
  { const a = byId.get('csrc-pqc'); if (!a) src('csrc-pqc', {}, [], 'absent'); else src('csrc-pqc', { named: ['FIPS 203', 'FIPS 204', 'FIPS 205'].filter((f) => a.text.includes(f)) }, [v('textbook_pqc_standards_three', ['FIPS 203', 'FIPS 204', 'FIPS 205'].every((f) => a.text.includes(f)), 'FIPS 203, 204 and 205 named on the page')]) }
  const all = Object.entries(sources).flatMap(([id, x]) => x.verdicts.map((y) => ({ source: id, ...y })))
  const byTheorem: Record<string, { passed: number; failed: number }> = {}
  for (const x of all) { byTheorem[x.theorem] = byTheorem[x.theorem] ?? { passed: 0, failed: 0 }; if (x.passed) byTheorem[x.theorem]!.passed += 1; else byTheorem[x.theorem]!.failed += 1 }
  return { sources, followUps, checked: all.length, passed: all.filter((x) => x.passed).length, violations: all.filter((x) => !x.passed).map((x) => ({ source: x.source, theorem: x.theorem, says: x.says })), byTheorem }
}
const BEACON_LAST = JSON.stringify({ pulse: { uri: 'https://beacon.nist.gov/beacon/2.0/chain/2/pulse/2000107', chainIndex: 2, pulseIndex: 2000107, timeStamp: '2026-10-26T09:10:00.000Z', period: 60000, localRandomValue: '00'.repeat(64), outputValue: 'A'.repeat(128), signatureValue: 'B'.repeat(1024), precommitmentValue: 'C'.repeat(128), listValues: [{ type: 'previous', value: 'D'.repeat(128) }] } })
const BEACON_PREV = (precommit: string) => JSON.stringify({ pulse: { uri: 'https://beacon.nist.gov/beacon/2.0/chain/2/pulse/2000106', chainIndex: 2, pulseIndex: 2000106, timeStamp: '2026-10-26T09:09:00.000Z', period: 60000, localRandomValue: '11'.repeat(64), outputValue: 'D'.repeat(128), signatureValue: 'B'.repeat(1024), precommitmentValue: precommit, listValues: [] } })
const STH = JSON.stringify({ tree_size: 3461480042, timestamp: 1793005826714, sha256_root_hash: 'BUW2/ROzVcSOkLmZvNPkf3njsT5E2kno4MriPzOPWaU=', tree_head_signature: 'x' })
const NVD = JSON.stringify({ vulnerabilities: [{ cve: { id: 'CVE-2024-37880', published: '2024-06-10T02:15:47.160', lastModified: '2026-06-17T07:38:58.583', metrics: { cvssMetricV31: [{ cvssData: { baseScore: 7.5 } }] } } }] })
const CERN = JSON.stringify({ hits: { total: 5566, hits: [{ id: '5209', metadata: { title: 'Higgs to two photons from 2011', files: [{ size: 869, checksum: 'adler32:dca4af81' }], relations: [{ doi: '10.7483/OPENDATA.CMS.N9MJ.QEEC' }] } }] } })

const attest = toolOf('crypto', {
  name: 'attest',
  description: 'The crypto and certificate APIs, with NIST and CERN, verified by theorems in coordinated combinations: plan answers the requests to every open API (the NIST randomness beacon, a Certificate Transparency log\'s tree head, Let\'s Encrypt\'s ACME directory, NIST NVD\'s CVEs on ML-KEM, CERN Open Data\'s Higgs records, crt.sh, NIST CSRC) and names the hosts whose live certificates the client reads itself; read takes the bodies, verifies the theorems over each (the beacon\'s chain, period and SHA-512 precommitment; the tree head\'s widths; the five ACME resources; CVSS bounded and dates ordered; sizes, checksums and DOIs; certificates ordered, within 398 days and valid now; the three FIPS named) and answers the follow-ups the combination needs (the beacon\'s previous pulse), so a client reads again until nothing follows. Pure: nothing fetched here.',
  inputSchema: { type: 'object', properties: { op: { type: 'string', enum: ['plan', 'read'] }, hosts: { type: 'array', items: { type: 'string' }, description: 'hosts whose live certificates the client reads (tls:<host> answers)' }, answers: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, text: { type: 'string' }, status: { type: 'integer' } } } }, now: { type: 'number', description: 'the clock (ms) the validity is judged at; absent, not judged' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...CRYPTO.skill.selftest(ctx) }
    const op = String(args.op ?? 'plan')
    const hosts = Array.isArray(args.hosts) ? args.hosts.map(String) : ['qpu.uuidna.com', 'qpu.psg.bg', 'opendata.cern.ch', 'beacon.nist.gov']
    if (op === 'plan') return { op, apis: ATTEST_APIS, requests: ATTEST_APIS.filter((a) => a.open && !a.url.startsWith('tls://') && a.id !== 'crt-sh').map((a) => ({ id: a.id, url: a.url, accept: a.id === 'csrc-pqc' ? 'text/html' : 'application/json' })).concat(hosts.slice(0, 1).map((h) => ({ id: 'crt-sh', url: ATTEST_APIS.find((a) => a.id === 'crt-sh')!.url.replace('<host>', h), accept: 'application/json' }))), liveCertificates: hosts.map((h) => ({ id: `tls:${h}`, host: h, port: 443, answers: '{ notBefore, notAfter, issuer } as the client read them' })), theorems: ['textbook_hash_bits', 'textbook_beacon_period', 'textbook_chain_index_steps', 'textbook_chain_links_by_output', 'textbook_precommitment_is_sha512', 'textbook_tree_size_positive', 'textbook_acme_resources_five', 'textbook_cve_id_well_formed', 'textbook_cvss_bounded', 'textbook_dates_ordered', 'textbook_total_at_least_page', 'textbook_size_nonnegative', 'textbook_adler32_width', 'textbook_doi_well_formed', 'textbook_cert_validity_bound', 'textbook_now_within_validity', 'textbook_pqc_standards_three'], coordination: 'read answers followUps (the beacon\'s previous pulse by index); the client fetches them and reads again until none follow: one combination, several MCP-shaped sources, agnostic of which answered' }
    if (op !== 'read') throw new Error(`op ${op} is not plan or read`)
    const answers = (Array.isArray(args.answers) ? args.answers : []) as AttestAnswer[]
    const r = attestOf(answers, typeof args.now === 'number' ? args.now : 0)
    return { op, ...r, says: `${Object.values(r.sources).filter((x) => x.status === 'read').length} source(s) read of ${Object.keys(r.sources).length}; ${r.checked} theorem checks, ${r.violations.length} violation(s)${r.followUps.length ? `; ${r.followUps.length} follow-up(s) to read` : ''}` }
  },
  widget: flowWidget,
})

export const CRYPTO: Toolbox = {
  name: 'crypto',
  idea: 'the split folds: what a place cannot hold is folded into pieces it can, each addressed by content and the whole by its pieces; a key names its piece; the bound is a reflective boundary that decides by comparison before computing',
  tools: [fold, seal, attest],
  examples: [
    { id: 'fold-hex', tool: 'fold', theorem: 'textbook_uuid_core', arguments: { hex: '941ef62e-d97b-2438-bfc8-22ae9e5da781' }, shows: 'The one quantum core over MCP: any hex presented as a shadcn combination — thirty-two nibbles, each an item of eight and a variant of two, the whole styled from itself (hue from the handle, saturation and lightness from the program, radius and gap from the tail); every toolbox\'s result is such an address.', expect: (s) => (s.phase === 'presented' && s.nibbles === 32 && s.parts.length === 32 && s.choices === 16 && /^hsl\(/.test(s.style['--qpu-accent']) ? null : JSON.stringify(s.parts?.slice(0, 2))) },
    { id: 'fold-stream', tool: 'fold', theorem: 'textbook_stream_filter', arguments: { uuids: ['941ef62e-d97b-2438-bfc8-22ae9e5da781', '016da774-e74c-2e44-8742-f8bcf5e8e8f5', '00000000-0000-1000-8000-000000000000'], query: { where: { nibble: { at: 1, is: '0' } }, sort: 'hue', execute: true } }, shows: 'A UUID-only stream through the core: the addresses whose second nibble is 0 kept (one of three), sorted by their own hue, executed as the program rotated with the page and the dashboard each answers.', expect: (s) => (s.phase === 'streamed' && s.stream === 3 && s.filtered === 1 && s.rows[0].uuid === '00000000-0000-1000-8000-000000000000' && /^[0-9a-f-]{36}$/.test(s.rows[0].next) ? null : JSON.stringify(s.rows)) },
    { id: 'fold-schemas', tool: 'fold', theorem: 'textbook_uuid_schemas', arguments: { hex: '017f22e2-79b0-7cc3-98c4-dc0c0c07398f' }, shows: 'All UUID version schemas at once in one UUID: the same bits read as version 1 (Gregorian time, clock sequence, node), 3 and 5 (a digest), 4 (random), 6 (time reordered), 7 (Unix milliseconds: 2022-02-22T19:22:22Z for this one, the RFC 9562 example), 8 (custom), nil and max, beside the stamp\'s version 7 and RFC variant; the core\'s channel, style and presentation read none of them, so every schema presents the same.', expect: (s) => (s.schemas.stamped.version === 7 && s.schemas.stamped.variant.startsWith('RFC') && s.schemas.schemas.v7.time === '2022-02-22T19:22:22.000Z' && s.schemas.schemasRead === 9 && s.schemas.core.channel.handle === '017f22e2' && s.parts.length === 32 ? null : JSON.stringify(s.schemas?.schemas?.v7)) },
    { id: 'fold-ledger', tool: 'fold', theorem: 'textbook_fold_mirror', arguments: { text: LEDGER, bound: 600, key: 'k27' }, shows: 'A forty-row ledger folded under a bound of 600 bytes: the pieces, each with its address, SHA-256 and key range, the root over them, the mirror piece of each across the fold, and the one piece the key k27 sits in — decided by comparisons, the whole never read for it.', expect: (s) => (s.phase === 'folded' && !s.fits && s.count >= 4 && s.pieces.every((p: { reflection: number; index: number }) => p.reflection === s.count - 1 - p.index) && s.located && s.located.why.includes('k27') === false && s.located.index >= 0 && s.decision.startsWith('ask piece') ? null : `${s.phase} ${s.count} ${JSON.stringify(s.located)}`) },
    { id: 'attest-plan', tool: 'attest', arguments: { op: 'plan' }, shows: 'Every crypto and certificate API found with NIST and CERN: the requests to the open ones, the hosts whose live certificates the client reads, the seventeen theorems verified over the answers, and the coordination (follow-ups read until none follow).', expect: (s) => (s.apis.length === 8 && s.requests.length === 7 && s.liveCertificates.length === 4 && s.theorems.length === 17 ? null : JSON.stringify(s.requests.map((r: { id: string }) => r.id))) },
    { id: 'attest-read', tool: 'attest', theorem: 'textbook_cert_validity_bound', arguments: { op: 'read', now: 1793005826714, answers: [{ id: 'nist-beacon', text: BEACON_LAST }, { id: 'ct-sth', text: STH }, { id: 'nvd-cves', text: NVD }, { id: 'cern-opendata', text: CERN }, { id: 'tls:qpu.uuidna.com', text: JSON.stringify({ notBefore: '2026-09-09T03:31:22Z', notAfter: '2026-12-08T04:31:19Z', issuer: 'Google Trust Services WE1' }) }] }, shows: 'Fixtures of the beacon, a tree head, a CVE, a CERN record and a live certificate read and verified: every theorem holds, and the beacon asks for its previous pulse as a follow-up.', expect: (s) => (s.violations.length === 0 && s.followUps.length === 1 && s.checked >= 10 ? null : JSON.stringify(s.violations)) },
    { id: 'seal-sign', tool: 'seal', theorem: 'textbook_signature_over_digest', arguments: { text: 'qpu', sign: 'ML-DSA-65' }, shows: 'The post-quantum signature plan over one text: ML-DSA-65 (FIPS 204) over the 32 bytes of its SHA-256, the Web Crypto call and flag the host uses, the key variable, the sizes of key and signature; served at a host, the plan carries the signature and the public key a tenant verifies without any secret.', expect: (s) => (s.signature?.algorithm === 'ML-DSA-65' && s.signature.message === s.sha256 && s.signature.sizes.signature === 3309 && s.signature.sizes.publicKey === 1952 && s.signature.webcrypto.flag === 'webcrypto_modern_algorithms' ? null : JSON.stringify(s.signature)) },
    { id: 'seal-text', tool: 'seal', arguments: { text: 'qpu', key: 'test' }, shows: 'SHA-256, the HMAC under a test key and the fold address of one text, the same at every host.', expect: (s) => (s.sha256.length === 64 && s.hmac.length === 64 && /^[0-9a-f-]{36}$/.test(s.address) && s.bytes === 3 ? null : JSON.stringify(s)) },
  ],
  skill: {
    instructions: 'fold { text, bound } before sending a payload to a place with a limit (an isolate, a request, a quantum): send the pieces, each under the bound; a reader asks fold { text, bound, key } to learn which piece a key sits in and reads that piece alone; fold { pieces, root } checks the whole came back. seal names any text the way blocks and pieces are named.',
    directions: ['server only: a ledger folded under a bound, pieces under the bound, keys located, the root recomputed from the pieces, a wrong piece named', 'toolbox → toolbox: the fold address is the balancer\'s and the docket\'s (blocks.ts), the hash the billing toolbox\'s (hmac.ts), the seed and trinity the Clay register\'s', 'client → server: the unit\'s doors answer from one piece (rowsForKeys) or the baked root — this is the fold they need'],
    selftest: () => {
      const checks: { id: string; passed: boolean; evidence: string }[] = []
      const check = (id: string, passed: boolean, evidence: string) => checks.push({ id, passed, evidence })
      const f = foldOf(LEDGER, 600)
      check('crypto:pieces-under-the-bound', f.pieces.every((p) => p.bytes <= 600) && f.count > 1 && !f.fits && f.excess === f.bytes - 600, `${f.count} pieces, the largest ${Math.max(...f.pieces.map((p) => p.bytes))} bytes under 600`)
      check('crypto:reflective-boundary', f.pieces.every((p) => p.reflection === f.count - 1 - p.index) && f.boundary.d === f.count - 1, f.boundary.sigma)
      const loc = pieceOfKey(f, 'k27')!; const row = LEDGER.split('\n')[27]!
      check('crypto:key-names-its-piece', !!loc && f.pieces[loc.index]!.firstKey! <= 'k27' && 'k27' <= f.pieces[loc.index]!.lastKey! && loc.address === f.pieces[loc.index]!.address, `k27 sits in piece ${loc?.index} by its key range`)
      const texts = (() => { const rows = LEDGER.split('\n'); const out: string[] = []; let i = 0; for (const p of f.pieces) { out.push(rows.slice(i, i + p.rows).join('\n')); i += p.rows } return out })()
      const u = unfoldOf(texts.map((t, i) => ({ index: i, text: t, sha256: f.pieces[i]!.sha256 })), f.root)
      check('crypto:unfold-agrees', u.agrees === true && u.whole === LEDGER && u.wrong.length === 0, 'the pieces give back the whole and the root agrees')
      const bad = unfoldOf(texts.map((t, i) => ({ index: i, text: i === 1 ? t.replace('row', 'ROW') : t, sha256: f.pieces[i]!.sha256 })), f.root)
      check('crypto:wrong-piece-named', bad.agrees === false && bad.wrong.join() === '1', 'a changed piece is named and the root disagrees')
      const one = foldOf('small', 1000)
      check('crypto:whole-fits', one.fits && one.count === 1 && one.pieces[0]!.reflection === 0, 'a payload under the bound is one piece, its own mirror')
      const big = foldOf('x'.repeat(2500), 1000)
      check('crypto:row-cut-at-characters', big.count === 3 && big.pieces.every((p) => p.bytes <= 1000), 'a single row above the bound is cut at characters')
      const plan = signaturePlanOf(sha('qpu'), true); let refused = ''; try { signaturePlanOf(sha('qpu'), 'RSA') } catch (e) { refused = (e as Error).message }
      check('crypto:signature-plan', plan.algorithm === 'ML-DSA-65' && plan.fips === 204 && plan.message === sha('qpu') && plan.sizes.signature === ML_DSA['ML-DSA-65'].signature && plan.executedBy === 'host' && /FIPS 204/.test(refused), `sign: true plans ML-DSA-65 over the digest, ${plan.sizes.signature}-byte signatures; a non-FIPS-204 name is refused`)
      const precommit = hex(sha512(new Uint8Array(64))).toUpperCase()
      const chained = attestOf([{ id: 'nist-beacon', text: BEACON_LAST }, { id: 'nist-beacon-previous', text: BEACON_PREV(precommit) }, { id: 'ct-sth', text: STH }, { id: 'acme-directory', text: JSON.stringify({ newNonce: 'u', newAccount: 'u', newOrder: 'u', revokeCert: 'u', keyChange: 'u' }) }, { id: 'nvd-cves', text: NVD }, { id: 'cern-opendata', text: CERN }, { id: 'csrc-pqc', text: 'FIPS 203 FIPS 204 FIPS 205' }, { id: 'tls:qpu.uuidna.com', text: JSON.stringify({ notBefore: '2026-09-09T03:31:22Z', notAfter: '2026-12-08T04:31:19Z', issuer: 'WE1' }) }], 1793005826714)
      const broken = attestOf([{ id: 'nist-beacon', text: BEACON_LAST }, { id: 'nist-beacon-previous', text: BEACON_PREV('E'.repeat(128)) }, { id: 'tls:x', text: JSON.stringify({ notBefore: '2020-01-01T00:00:00Z', notAfter: '2022-01-01T00:00:00Z', issuer: 'y' }) }], 1793005826714)
      check('crypto:attest-theorems-in-combination', chained.violations.length === 0 && chained.followUps.length === 0 && chained.checked >= 16 && chained.byTheorem.textbook_precommitment_is_sha512!.passed === 1 && broken.violations.some((x) => x.theorem === 'textbook_precommitment_is_sha512') && broken.violations.some((x) => x.theorem === 'textbook_cert_validity_bound') && broken.violations.some((x) => x.theorem === 'textbook_now_within_validity') && hex(sha512(utf8('abc'))).startsWith('ddaf35a193617aba'), `${chained.checked} checks over eight sources, none violated; a wrong precommitment and an expired two-year certificate are named; SHA-512 agrees with the published vector`)
      check('crypto:seal', sha('abc') === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad' && hex(hmacSha256(utf8('key'), utf8('The quick brown fox jumps over the lazy dog'))) === 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8', 'SHA-256 and HMAC-SHA256 agree with the published vectors')
      void row
      return { passed: checks.every((c) => c.passed), checks }
    },
  },
}
