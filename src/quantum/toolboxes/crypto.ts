// The crypto toolbox: the split folds. A payload larger than what a place can hold (an isolate's memory, a request's time, a
// quantum) is folded into pieces that fit, each addressed by its content, the whole addressed by its pieces; a key names the
// one piece it sits in, so a door answers from that piece and never from the whole. The bound is a reflective boundary:
// σ_n(i) = n − i mirrors every piece onto the one across the fold, and the excess over the bound is reflected into the count
// of pieces, decided by integer comparisons before anything is computed. Pure: SHA-256 and the fold address, nothing else.
import { toolOf, type Toolbox } from '../toolbox.js'
import { uuidOf } from '../blocks.js'
import { sha256, hmacSha256, utf8, hex } from '../hmac.js'
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
  inputSchema: { type: 'object', properties: { text: { type: 'string', description: 'the payload: rows as lines (ndjson, csv) fold at rows' }, bound: { type: 'integer', minimum: 1, description: 'bytes a piece may hold; e.g. what an isolate, a request or a quantum holds' }, key: { type: 'string', description: 'a key to locate: the piece it sits in' }, pieces: { type: 'array', items: { type: 'object' }, description: 'pieces to unfold: { index, text, sha256? }' }, root: { type: 'string' }, withPieces: { type: 'boolean', description: 'carry the pieces\' texts in the answer (default: addresses and hashes only)' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...CRYPTO.skill.selftest(ctx) }
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
  description: 'SHA-256 of a text, and HMAC-SHA256 under a key the caller gives (a test key; a tenant\'s secret never travels here), pure and the same at every host; the fold address of the text beside them, so a block, a piece and a message are named by one scheme.',
  inputSchema: { type: 'object', required: ['text'], properties: { text: { type: 'string' }, key: { type: 'string', description: 'HMAC key, when a keyed seal is wanted' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.selftest) return { selftest: true, ...CRYPTO.skill.selftest(ctx) }
    const text = String(args.text)
    return { bytes: utf8(text).length, sha256: sha(text), address: uuidOf(text), ...(typeof args.key === 'string' ? { hmac: hex(hmacSha256(utf8(args.key), utf8(text))) } : {}), postQuantum: POST_QUANTUM }
  },
  widget: flowWidget,
})

/** What this seal is against a quantum adversary, and what NIST standardised: read at CSRC on 2026-10-25, carried as the standards nist-fips-203/204/205 discovery reads. */
export const POST_QUANTUM = {
  thisSeal: 'SHA-256 and HMAC-SHA256 are symmetric: Grover\'s search halves their bits, so 256 bits keep 128 against a quantum adversary; no public-key step is taken here, so nothing of this seal falls to Shor',
  standards: [
    { fips: 203, name: 'ML-KEM (Module-Lattice-Based Key-Encapsulation Mechanism)', published: '2024-08-13', at: 'https://csrc.nist.gov/pubs/fips/203/final' },
    { fips: 204, name: 'ML-DSA (Module-Lattice-Based Digital Signature)', published: '2024-08-13', at: 'https://csrc.nist.gov/pubs/fips/204/final' },
    { fips: 205, name: 'SLH-DSA (Stateless Hash-Based Digital Signature)', published: '2024-08-13', at: 'https://csrc.nist.gov/pubs/fips/205/final' },
  ],
  selected: [{ name: 'HQC (key encapsulation)', on: '2025-03-11', report: 'NIST IR 8545', at: 'https://csrc.nist.gov/projects/post-quantum-cryptography' }],
  here: 'signatures over folds with ML-DSA or SLH-DSA are not implemented in this tree: lead pqc-signature-over-folds; the fold, the hash and the HMAC stand',
} as const
const LEDGER = Array.from({ length: 40 }, (_, i) => JSON.stringify({ key: `k${String(i).padStart(2, '0')}`, value: i * i, note: 'a row of the ledger' })).join('\n')

export const CRYPTO: Toolbox = {
  name: 'crypto',
  idea: 'the split folds: what a place cannot hold is folded into pieces it can, each addressed by content and the whole by its pieces; a key names its piece; the bound is a reflective boundary that decides by comparison before computing',
  tools: [fold, seal],
  examples: [
    { id: 'fold-ledger', tool: 'fold', theorem: 'textbook_fold_mirror', arguments: { text: LEDGER, bound: 600, key: 'k27' }, shows: 'A forty-row ledger folded under a bound of 600 bytes: the pieces, each with its address, SHA-256 and key range, the root over them, the mirror piece of each across the fold, and the one piece the key k27 sits in — decided by comparisons, the whole never read for it.', expect: (s) => (s.phase === 'folded' && !s.fits && s.count >= 4 && s.pieces.every((p: { reflection: number; index: number }) => p.reflection === s.count - 1 - p.index) && s.located && s.located.why.includes('k27') === false && s.located.index >= 0 && s.decision.startsWith('ask piece') ? null : `${s.phase} ${s.count} ${JSON.stringify(s.located)}`) },
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
      check('crypto:seal', sha('abc') === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad' && hex(hmacSha256(utf8('key'), utf8('The quick brown fox jumps over the lazy dog'))) === 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8', 'SHA-256 and HMAC-SHA256 agree with the published vectors')
      void row
      return { passed: checks.every((c) => c.passed), checks }
    },
  },
}
