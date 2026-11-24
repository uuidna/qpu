// The crypto toolbox: the split folds. A payload larger than what a place can hold (an isolate's memory, a request's time, a
// quantum) is folded into pieces that fit, each addressed by its content, the whole addressed by its pieces; a key names the
// one piece it sits in, so a door answers from that piece and never from the whole. The bound is a reflective boundary:
// σ_n(i) = n − i mirrors every piece onto the one across the fold, and the excess over the bound is reflected into the count
// of pieces, decided by integer comparisons before anything is computed. MCP shell over the pure surfaces in ../crypto.
import { PROSE, proseFill } from '../prose-index.ts'
import { getInteger, writeInteger, sqrtBig } from '../algorithms.ts'
import { defineTool, isObj, unlimited, type Toolbox } from '../toolbox.ts'
import { uuid, canonicalText, seal as uuidSeal, presentation, stream, neighbours, next, navigate, compositions, composition, compositionIndex, rosetta, merkaba, harmonicDefaults, dnaStream, hexToDna, uuidQubits, hexbit, organiseQubits, coins, type StreamQuery } from '../../uuid/index.ts'
import { foldEntropy } from '../scan.ts'
import { pqc, kemRound, dsaRound } from '../crypto/pqc.ts'
import { summonCourt } from './legal.ts'
import { LICENSE } from '../unit/license.ts'
import { mayChoose, type Role } from '../unit/roles.ts'
import { sha256, hmacSha256, sha512, sha1, md5, sha3_256, sha3_512, shake128, shake256, utf8, hex } from '../unit/hmac.ts'
import {
  crypto1000Bit,
  integers,
  uuidSuperpositions,
  uuidSuperpositionsReverse,
  aead,
  exchangeX25519,
  derivePbkdf2,
  merkleTree,
  findStaleReceipts,
  
  
  cryptoHosts,
  nistScenarios,
  nistScenariosReverse,
  nistOpenData,
  cernOpenData,
  attestAnswers,
  BEACON_LAST,
  STH,
  NVD,
  CERN,
  deriveRefererSeeds,
  getGltf,
  type AttestAnswer,
  type CryptoConfig,
} from '../crypto/index.ts'
import { digitalRoot, trinityFor, faces, AXIOMS } from '../clay-register.ts'
import { flowWidget } from '../widgets.ts'
import { listConstants } from '../unit/constants.ts'
import { splitUuid } from '../split.ts'
import { castRays } from '../unit/theme.ts'
import { listNumerals, speakHex, speakThousand } from '../i18n.ts'
import { TABLES } from '../tables-index.ts'
import { cryptoConfig } from '../crypto/config.ts'
import { developViaHooks } from '../iso-develop.ts'

/** Tenant crypto (attest, PQC, ISO/IEC 4879 quantum computers) via Payload MCP only — never hardcoded second doors. */
const tenantCrypto = (args?: Record<string, unknown>): CryptoConfig => {
  if (isObj(args?.config)) return args.config as CryptoConfig
  return cryptoConfig(args?.via === 'tenant.settings' ? 'tenant.settings' : 'qpuMcpPlugin')
}
type Piece = { index: number; reflection: number; address: string; sha256: string; bytes: number; rows: number; firstKey: string | null; lastKey: string | null; seed: number; trinity: number[] }
type Fold = { bytes: number; bound: number; fits: boolean; excess: number; pieces: Piece[]; texts: string[]; count: number; root: string; fold: string; roundTrips: boolean; boundary: { d: number; sigma: string; says: string }; decided: { by: string; comparisons: number } }

const sha = (s: string) => hex(sha256(utf8(s)))
/** An address as a caller indexes it: the handle (its first eight hex digits, a SKU), the program (the ten hex digits between, the version and variant
 *  nibbles left out, an index) and the tail (the last twelve, parameters), beside the free qubits of the register it is at hexbit width 4. */
const addressParts = (address: string) => { const h = address.replace(/-/g, ''); return { handle: h.slice(0, 8), program: [...h.slice(8, 20)].filter((_c, i) => i !== 4 && i !== 8).join(''), tail: h.slice(20), freeQubits: uuidQubits(4).effective } }

const rowKey = (row: string): string | null => { const m = /^\s*\{\s*"(?:key|id|address|uuid)"\s*:\s*"([^"]+)"/.exec(row) ?? /^([^\s,|]+)/.exec(row); return m ? m[1]! : null }

/** The payload folded into pieces of at most `bound` bytes (UTF-8), split at row boundaries (lines) when rows exist, else at characters: slices of the
 *  text (a piece keeps its rows' newlines), so joined they are the text exactly, recomputed (roundTrips). */
const foldLedger = (text: string, bound: number): Fold => {
  const bytes = utf8(text).length
  const rows = text.split('\n').map((r, i, all) => (i < all.length - 1 ? `${r}\n` : r))
  const pieces: string[] = []
  let current = ''
  for (const row of rows) {
    const next = current + row
    if (current && utf8(next).length > bound) { pieces.push(current); current = row } else current = next
    // a single row above the bound is cut at characters: no row is larger than what the place can hold
    while (utf8(current).length > bound) { let cut = current.length; while (utf8(current.slice(0, cut)).length > bound) cut = Math.floor(cut / 2); pieces.push(current.slice(0, cut)); current = current.slice(cut) }
  }
  if (current || !pieces.length) pieces.push(current)
  const n = pieces.length
  const out: Piece[] = pieces.map((p, i) => { const address = uuid(p); const lines = p ? p.replace(/\n$/, '').split('\n') : []; return { index: i, reflection: n - 1 - i, address, sha256: sha(p), bytes: utf8(p).length, rows: lines.length, firstKey: lines.length ? rowKey(lines[0]!) : null, lastKey: lines.length ? rowKey(lines[lines.length - 1]!) : null, seed: digitalRoot(parseInt(address.slice(-2), 16) || 1), trinity: trinityFor(digitalRoot(parseInt(address.slice(-2), 16) || 1)) } })
  const root = sha(out.map((p) => p.sha256).join(''))
  return { bytes, bound, fits: bytes <= bound, excess: Math.max(0, bytes - bound), pieces: out, texts: pieces, count: n, root, roundTrips: unfoldPieces(pieces.map((t, index) => ({ index, text: t })), root).whole === text, fold: uuid(out.map((p) => p.address).join('')), boundary: { d: n - 1, sigma: `σ_${n - 1}(i) = ${n - 1} − i`, says: n === 1 ? PROSE.quantumProcessingToolboxesCrypto_s1 : proseFill(PROSE.quantumProcessingToolboxesCrypto_s2, n, bound, n - 1, Math.max(0, bytes - bound), n - 1) }, decided: { by: PROSE.quantumProcessingToolboxesCrypto_by3, comparisons: rows.length + 1 } }
}

/** The piece a key sits in: by its address (the piece's own), or by the key range of the rows it holds. Decided without reading the whole. */
const pieceOfKey = (fold: Fold, key: string): { index: number; address: string; why: string } | null => {
  const byAddress = fold.pieces.find((p) => p.address === key || p.sha256 === key)
  if (byAddress) return { index: byAddress.index, address: byAddress.address, why: PROSE.quantumProcessingToolboxesCrypto_why4 }
  for (const p of fold.pieces) if (p.firstKey !== null && p.lastKey !== null && p.firstKey <= key && key <= p.lastKey) return { index: p.index, address: p.address, why: proseFill(PROSE.quantumProcessingToolboxesCrypto_why5, p.firstKey, p.lastKey) }
  return null
}

/** The whole recomputed from its pieces joined as cut: the root agrees or names the piece that does not. */
const unfoldPieces = (pieces: readonly { index: number; text: string; sha256?: string }[], root?: string): { whole: string; root: string; agrees: boolean | null; wrong: number[] } => {
  const sorted = [...pieces].sort((a, b) => a.index - b.index)
  const wrong = sorted.filter((p) => p.sha256 && sha(p.text) !== p.sha256).map((p) => p.index)
  const r = sha(sorted.map((p) => sha(p.text)).join(''))
  return { whole: sorted.map((p) => p.text).join(''), root: r, agrees: root ? r === root : null, wrong }
}


const QUENEAU = Array.from({ length: 14 }, () => 10)
const COMBINATORICS = [
  { name: 'queneau', radices: QUENEAU, theorem: 'textbook_queneau_compositions', formula: '10 ^ 14' },
  { name: 'plugins', radices: [2, 2, 2, 2, 2, 2, 2, 2, 2], theorem: 'textbook_plugin_combinations', formula: '2 ^ 9' },
  { name: 'adapters', radices: [5, 5, 2], theorem: 'textbook_mixed_radix', formula: '5 * 5 * 2' },
  { name: 'sets', radices: [3, 8], theorem: 'textbook_mixed_radix', formula: '3 * 8' },
  { name: 'algorithm', radices: [7, 19, 1, 2, 6, 1, 1, 8, 2, 11], theorem: 'textbook_mixed_radix', formula: '7 * 19 * 1 * 2 * 6 * 1 * 1 * 8 * 2 * 11' },
  { name: 'installations', radices: [3, 2, 5, 5, 2, 512], theorem: 'textbook_mixed_radix', formula: '3 * 2 * 5 * 5 * 2 * 512' },
] as const
/** schema.org microdata for one combination space: the list is the positions, the count is the product, and neither stores a composition. */
const combinatoricsMicrodata = (space: { name: string; radices: readonly number[]; theorem: string; formula: string; count: bigint }) => {
  const identifier = uuid(canonicalText({ combinatorics: space.name, formula: space.formula, count: space.count.toString() }))
  const itemListElement = space.radices.map((radix, index) => ({ '@type': 'ListItem' as const, position: index + 1, item: { '@type': 'QuantitativeValue' as const, name: `${space.name} ${index + 1}`, identifier: uuid(canonicalText({ space: space.name, position: index + 1, radix })), minValue: 0, maxValue: radix - 1, value: radix, unitText: 'choice', description: `${radix} choices` } }))
  const additionalProperty = [
    { '@type': 'PropertyValue' as const, name: 'count', value: space.count.toString(), unitText: 'composition', valueReference: { '@type': 'DefinedTerm' as const, name: space.formula, termCode: space.theorem } },
    { '@type': 'PropertyValue' as const, name: 'formula', value: space.formula, valueReference: { '@type': 'DefinedTerm' as const, name: space.theorem, termCode: space.theorem } },
  ]
  return { '@context': 'https://schema.org' as const, '@type': ['ItemList', 'DefinedTerm'] as const, '@id': `urn:uuid:${identifier}`, identifier, name: space.name, description: `${space.formula} = ${space.count}`, inLanguage: 'en' as const, url: `https://qpu.uuidna.com/${identifier}`, license: LICENSE.url, isAccessibleForFree: true as const, termCode: space.theorem, numberOfItems: itemListElement.length, itemListOrder: 'https://schema.org/ItemListOrderAscending', itemListElement, additionalProperty }
}

const fold = defineTool('crypto', {
  name: 'fold',
  description: PROSE.quantumProcessingToolboxesCrypto_description6,
  inputSchema: { type: 'object', properties: { proven: { type: 'boolean', description: PROSE.quantumProcessingToolboxesCrypto_description7 }, superpositions: { description: PROSE.quantumProcessingToolboxesCrypto_description8 }, qubits: { description: PROSE.quantumProcessingToolboxesCrypto_description9 }, exchange: { description: PROSE.quantumProcessingToolboxesCrypto_description10 }, organise: { description: PROSE.quantumProcessingToolboxesCrypto_description11 }, coins: { type: 'array', items: { type: 'string' }, description: PROSE.quantumProcessingToolboxesCrypto_description12 }, speak: { anyOf: [{ type: 'string' }, { type: 'integer' }, { type: 'object' }], description: PROSE.quantumProcessingToolboxesCrypto_description13 }, split: { type: 'string', description: PROSE.quantumProcessingToolboxesCrypto_description14 }, harmonic: { type: 'object', description: '{ schema, referrer? }: the harmonic options by default of any schema — its enum properties a superposition of their combinations, the referrer\'s address (or the a432 key) choosing the default one by its remainder' }, decode: { type: 'object', description: '{ radices, address? | uuid? }: decoded algebraically, never by search — an address of the form index-digits (or either part alone) inverted in one step per position and checked against itself; a content address is one-way, so the request to find what it hides is refused with the court\'s case and no candidate is tried; free as pure algebra' }, radices: { type: 'array', items: { type: 'integer', minimum: 1 }, description: PROSE.quantumProcessingToolboxesCrypto_description15 }, rosetta: { type: 'array', items: { type: 'integer', minimum: 1 }, description: PROSE.quantumProcessingToolboxesCrypto_description16 }, order: { type: 'array', items: { type: 'integer', minimum: 0 }, description: PROSE.quantumProcessingToolboxesCrypto_description17 }, index: { type: 'string', description: PROSE.quantumProcessingToolboxesCrypto_description18 }, digits: { type: 'array', items: { type: 'integer', minimum: 0 }, description: PROSE.quantumProcessingToolboxesCrypto_description19 }, combinatorics: { type: 'boolean', description: PROSE.quantumProcessingToolboxesCrypto_description20 }, spaces: { type: 'object', description: '{ name: radices }: many combination spaces counted by the one primitive' }, hex: { type: 'string', description: PROSE.quantumProcessingToolboxesCrypto_description21 }, uuids: { type: 'array', items: { type: 'string' }, description: PROSE.quantumProcessingToolboxesCrypto_description22 }, neighbours: { type: 'string', description: PROSE.quantumProcessingToolboxesCrypto_description23 }, next: { type: 'string', description: PROSE.quantumProcessingToolboxesCrypto_description24 }, navigate: { type: 'string', description: PROSE.quantumProcessingToolboxesCrypto_description25 }, query: { type: 'object', description: PROSE.quantumProcessingToolboxesCrypto_description26 }, text: { type: 'string', description: PROSE.quantumProcessingToolboxesCrypto_description27 }, bound: { type: 'integer', minimum: 1, description: PROSE.quantumProcessingToolboxesCrypto_description28 }, key: { type: 'string', description: PROSE.quantumProcessingToolboxesCrypto_description29 }, pieces: { type: 'array', items: { type: 'object' }, description: PROSE.quantumProcessingToolboxesCrypto_description30 }, root: { type: 'string' }, withPieces: { type: 'boolean', description: PROSE.quantumProcessingToolboxesCrypto_description31 }, integers: { description: PROSE.quantumProcessingToolboxesCrypto_description32 }, dna: { description: PROSE.quantumProcessingToolboxesCrypto_description33 }, reflect: { description: PROSE.quantumProcessingToolboxesCrypto_description34 }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (Object.keys(args).every((k) => k === 'selftest')) return unlimited() as never
    if (args.superpositions === true || isObj(args.superpositions)) {
      const spec = (args.superpositions === true ? {} : args.superpositions) as { reverse?: boolean; address?: string; hexbit?: number }
      const address = typeof spec.address === 'string' ? spec.address : typeof (args as { address?: unknown }).address === 'string' ? String((args as { address: string }).address) : '941ef62e-d97b-2438-bfc8-22ae9e5da781'
      const width = typeof spec.hexbit === 'number' ? spec.hexbit : typeof (args as { hexbit?: unknown }).hexbit === 'number' ? Number((args as { hexbit: number }).hexbit) : AXIOMS.find((row) => row.name === 'hexbit')!.value
      return (spec.reverse === true ? uuidSuperpositionsReverse(address, width) : uuidSuperpositions(address, width)) as never
    }
    if (args.qubits !== undefined) {
      const width = typeof args.qubits === 'number' ? args.qubits : isObj(args.qubits) && typeof (args.qubits as { hexbit?: unknown }).hexbit === 'number' ? Number((args.qubits as { hexbit: number }).hexbit) : AXIOMS.find((row) => row.name === 'hexbit')!.value
      if (!Number.isInteger(width) || width < 1) throw new Error('qubits takes a positive hexbit')
      return { phase: 'qubits' as const, ...uuidQubits(width) } as never
    }
    if (isObj(args.exchange) || typeof args.exchange === 'string') {
      const e = (isObj(args.exchange) ? args.exchange : { address: args.exchange }) as { address?: string; hexbit?: number }
      if (typeof e.address !== 'string') throw new Error('exchange takes { address, hexbit? }')
      return { phase: 'hexbit' as const, ...hexbit(e.address, Number.isInteger(e.hexbit) ? e.hexbit! : AXIOMS.find((row) => row.name === 'hexbit')!.value) } as never
    }
    if (isObj(args.organise) || typeof args.organise === 'string') {
      const o = (isObj(args.organise) ? args.organise : { address: args.organise }) as { address?: string; hexbit?: number }
      if (typeof o.address !== 'string') throw new Error('organise takes { address, hexbit? }')
      return { phase: 'organise' as const, ...organiseQubits(o.address, Number.isInteger(o.hexbit) ? o.hexbit! : AXIOMS.find((row) => row.name === 'hexbit')!.value) } as never
    }
    if (Array.isArray(args.coins)) return { phase: 'coins' as const, ...coins(args.coins.map(String)) } as never
    if (args.proven === true) return crypto1000Bit() as never
    if (args.integers !== undefined) return { phase: 'singularity' as const, ...integers(args.integers) } as never
    // a UUID split into time and space, with its timeless twin, and the pair drawn as rays
    if (typeof args.split === 'string') { const s = splitUuid(args.split); return { phase: 'split' as const, ...s, rays: castRays([s.uuid, s.timeless]) } as never }
    // uuid dna uuidna: a DNA sequence as a navigable UUID stream, or decoded back to bases from its hex/uuid
    if (args.dna !== undefined) {
      if (typeof args.dna === 'string') return { phase: 'dna' as const, ...dnaStream(args.dna, isObj((args as { query?: unknown }).query) ? (args as { query: StreamQuery }).query : {}) } as never
      const d = (args.dna ?? {}) as { hex?: string; uuid?: string; bases?: number | null }
      const hex = typeof d.hex === 'string' ? d.hex : typeof d.uuid === 'string' ? d.uuid.replace(/-/g, '') : null
      if (!hex || /[^0-9a-f]/i.test(hex) || (d.bases != null && !(Number.isInteger(d.bases) && d.bases >= 0 && d.bases <= hex.length * 2))) throw new Error(PROSE.quantumProcessingToolboxesCrypto_s35)
      const bases = hexToDna(hex).slice(0, d.bases ?? undefined)
      return { phase: 'dna' as const, decode: true, hex: hex.toLowerCase().replace(/[^0-9a-f]/g, ''), bases, count: bases.length, theorem: 'textbook_dna_base4', says: proseFill(PROSE.quantumProcessingToolboxesCrypto_says36, bases.length, hex.length) } as never
    }
    // the reflective cut (textbook_witness_clock_move): faces paired i ↔ faces−1−i, each pair decoded by σ_d from N = u·v and d = u + v
    if (args.reflect !== undefined) {
      const spec = (args.reflect && typeof args.reflect === 'object' ? args.reflect : { value: args.reflect }) as { value?: unknown; faces?: number }
      const raw = String(spec.value ?? '').trim()
      if (!/^(0x[0-9a-f]+|\d+)$/i.test(raw) || BigInt(raw) < 1n) throw new Error(PROSE.quantumProcessingToolboxesCrypto_s37)
      const value = BigInt(raw), hex = value.toString(16).padStart(2, '0')
      // even (2×k faces, k σ-witnesses), at most the mint's faces (coins·rays = 2·7 = 14, the default) and one face a nibble
      const faceCount = Math.max(2, Math.min(Number.isInteger(spec.faces) ? (spec.faces as number) : faces, hex.length, faces) & ~1)
      const L = hex.length, base = Math.floor(L / faceCount), rem = L - base * faceCount
      const W: number[] = [], off: number[] = []; for (let i = 0, s = 0; i < faceCount; i++) { const w = base + (i < rem ? 1 : 0); W.push(w); off.push(s); s += w }
      const pieces = W.map((w, i) => BigInt('0x' + (hex.slice(off[i]!, off[i]! + w) || '0')))
      const half = faceCount / 2, witnesses: { N: string; d: string; orient: 0 | 1 }[] = [], dec = new Array<bigint>(faceCount)
      let reflections = 0, exactRefl = true, maxBlind = 0n
      for (let j = 0; j < half; j++) {
        const u = pieces[j]!, v = pieces[faceCount - 1 - j]!, N = u * v, d = u + v, b = sqrtBig(d * d - 4n * N)
        const lo = (d - b) / 2n, hi = (d + b) / 2n, orient: 0 | 1 = u >= v ? 0 : 1
        if (d - lo === hi) reflections++
        if (d - hi === lo) reflections++ // the two reflections of this face: σ_d(lo) = hi and σ_d(hi) = lo
        exactRefl = exactRefl && d - lo === hi && d - hi === lo && lo * hi === N
        if (b > maxBlind) maxBlind = b
        witnesses.push({ N: N.toString(), d: d.toString(), orient })
        dec[j] = orient ? lo : hi; dec[faceCount - 1 - j] = orient ? hi : lo
      }
      let rhex = ''; for (let i = 0; i < faceCount; i++) rhex += dec[i]!.toString(16).padStart(W[i]!, '0')
      const bits = value.toString(2).length, exact = BigInt('0x' + rhex) === value
      return { phase: 'reflect' as const, bits, faces: faceCount, rays: half, nibbles: L, witnesses, reflections, reflectionsExact: exactRefl, roundTrips: exact, exact, widestGap: maxBlind.toString(), theorems: ['textbook_witness_clock_move', 'textbook_impossible_trapdoor'], says: proseFill(PROSE.quantumProcessingToolboxesCrypto_says38, bits, faceCount, half, half, reflections, L, exact, maxBlind.toString().length) } as never
    }
    if (args.speak === 1000 || isObj(args.speak) || (typeof args.speak === 'string' && listNumerals(args.speak).numerals.length > 0 && !/[0-9a-f]/i.test(args.speak))) { const speech = speakThousand(args.speak); const { says: _says, ...heard } = speech; const integer = '1000'; const hex = speech.understood === 1000 ? uuid(integer).replace(/-/g, '') : ''; const space = hex ? speakHex(hex) : null; return { phase: 'glagolitic' as const, ...heard, integer: hex ? integer : null, sealed: hex ? uuidSeal(uuid(integer)).valid : false, pass: space ? 1 as const : 0 as const, nibbles: hex.length, used: space?.letters.length ?? 0, whole: hex.length === 32 && space?.roundTrip === true, prose: false as const } as never }
    if (typeof args.speak === 'string') return { phase: 'speak' as const, ...speakHex(args.speak) }
    if (isObj(args.harmonic)) { const h = args.harmonic as { schema?: { properties?: Record<string, { enum?: readonly unknown[]; default?: unknown }> }; referrer?: string; role?: Role; tool?: string }; const r = harmonicDefaults(h.schema ?? {}, h.referrer, h.role && h.tool ? (prop, value) => mayChoose(h.role!, h.tool!, prop, value) : undefined); return { phase: 'harmonic' as const, combinations: r.count.toString(), index: r.index.toString(), from: r.from, defaults: r.defaults, options: r.options, withheld: r.withheld, theorems: ['textbook_harmonic_default', 'textbook_mixed_radix'], says: proseFill(PROSE.quantumProcessingToolboxesCrypto_says39, r.count, r.from === 'referrer' ? 'referrer' : 'a432 key', r.index) } }
    // decoding by combinatorics, never by search: an invertible address inverted in one step per position; a one-way address refused with the court's case
    if (isObj(args.decode)) {
      const d = args.decode as { radices?: number[]; address?: string; uuid?: string }
      const radices = (d.radices ?? []).map(Number); if (!radices.length || radices.some((r) => !Number.isInteger(r) || r < 1)) throw new Error(PROSE.quantumProcessingToolboxesCrypto_s40)
      const count = compositions(radices)
      const cost = { algebraic: radices.length, search: count.toString(), says: proseFill(PROSE.quantumProcessingToolboxesCrypto_says41, radices.length, count) }
      if (typeof d.address === 'string') {
        const m = /^(?:(\d+)-)?(\d+(?:\.\d+)*)$/.exec(d.address.trim()); if (!m) throw new Error(PROSE.quantumProcessingToolboxesCrypto_s42)
        const raw = m[2]!, separated = raw.includes('.')
        const digits = separated ? raw.split('.').map(Number) : raw.length === radices.length && radices.every((r) => r <= 10) ? [...raw].map(Number) : null
        const index = m[1] !== undefined ? BigInt(m[1]) : digits ? compositionIndex(radices, digits) : BigInt(raw)
        if (index < 0n || index >= count) throw new Error(proseFill(PROSE.quantumProcessingToolboxesCrypto_s43, count))
        const decoded = composition(radices, index)
        if (digits && (digits.length !== radices.length || digits.some((x, i) => x >= radices[i]!))) throw new Error(PROSE.quantumProcessingToolboxesCrypto_s44)
        const agrees = digits ? digits.every((x, i) => x === decoded[i]) : true
        return { phase: 'decoded' as const, method: 'algebraic', radices, count: count.toString(), index: index.toString(), digits: decoded, agrees, cost, theorems: ['textbook_mixed_radix', 'textbook_decode_not_search'], says: agrees ? proseFill(PROSE.quantumProcessingToolboxesCrypto_s45, index, count, radices.length) : proseFill(PROSE.quantumProcessingToolboxesCrypto_s46, index, decoded.join(' ')) }
      }
      if (typeof d.uuid === 'string') return { phase: 'refused' as const, method: 'none', decodable: false, radices, count: count.toString(), uuid: d.uuid, cost, reason: PROSE.quantumProcessingToolboxesCrypto_reason47, court: summonCourt({ gate: 'fold decode', rule: 'search', evidence: { uuid: d.uuid, candidates: count.toString() } }), leads: [{ id: `decode-one-way-${d.uuid.slice(0, 8)}`, statement: proseFill(PROSE.quantumProcessingToolboxesCrypto_statement48, d.uuid), status: 'open' }], theorems: ['textbook_decode_not_search', 'textbook_cheap_gates'], says: proseFill(PROSE.quantumProcessingToolboxesCrypto_says49, count) }
      throw new Error(PROSE.quantumProcessingToolboxesCrypto_s148)
    }
    if (args.combinatorics === true) {
      const spaces = COMBINATORICS.map((s) => ({ name: s.name, radices: [...s.radices], theorem: s.theorem, formula: s.formula, count: compositions(s.radices) }))
      const best = spaces.reduce((a, b) => (b.count > a.count ? b : a))
      const microdata = combinatoricsMicrodata(best)
      return { phase: 'combinatorics' as const, best: best.name, formula: best.formula, theorem: best.theorem, radices: best.radices, count: best.count.toString(), microdata, collected: 1 + microdata.itemListElement.length + microdata.additionalProperty.length, spaces: spaces.map((s) => ({ name: s.name, count: s.count.toString() })), theorems: ['textbook_queneau_compositions', 'textbook_mixed_radix'] as const, says: proseFill(PROSE.quantumProcessingToolboxesCrypto_says50, best.name, best.formula, best.count, microdata.itemListElement.length) }
    }
    // Queneau's combinatorics: one primitive for every combination space, the count, the composition an index addresses, and the index of a composition
    if (isObj(args.spaces)) { const spaces = Object.entries(args.spaces as Record<string, number[]>).map(([name, radices]) => ({ name, radices, count: compositions(radices).toString() })); return { phase: 'spaces' as const, spaces, primitive: PROSE.quantumProcessingToolboxesCrypto_primitive51, theorems: ['textbook_mixed_radix', 'textbook_queneau_compositions'] } }
    // a rosetta: one combination space read through two orderings of its axes — 6×7 and its transpose 7×6, the one scale of forty-two read two ways
    if (Array.isArray(args.rosetta)) {
      const radices = args.rosetta.map(Number); if (radices.some((r) => !Number.isInteger(r) || r < 1)) throw new Error(PROSE.quantumProcessingToolboxesCrypto_s52)
      const order = Array.isArray(args.order) ? args.order.map(Number) : undefined
      if (order && (order.length !== radices.length || [...order].sort((a, b) => a - b).some((k, i) => k !== i))) throw new Error(PROSE.quantumProcessingToolboxesCrypto_s53)
      const r = rosetta(radices, order), index = typeof args.index === 'string' || typeof args.index === 'number' ? BigInt(String(args.index)) : null
      if (index !== null && (index < 0n || index >= r.scale)) throw new Error(proseFill(PROSE.quantumProcessingToolboxesCrypto_s54, r.scale))
      const equalScale = r.scale === compositions(r.permuted), mid = r.scale > 0n ? r.scale / 2n : 0n, covers = equalScale && r.from(r.to(mid)) === mid && r.to(r.from(mid)) === mid // total at every scale by textbook_mixed_radix: a permutation keeps the product and each position inverts in one step; witnessed, never enumerated, so no cell is walked and no size caps it
      const frames = radices.length === 2 && radices[0] === 6 && radices[1] === 7 && (!order || (order[0] === 1 && order[1] === 0)) ? merkaba(index ?? 0n) : null
      const hooked = frames ? developViaHooks({ formula: `${index ?? 0n} = ${frames.quotient} * ${frames.scale} + ${frames.residue}`, product: 'merkaba', variant: frames.exposed ? 'analog' : 'harmonic', title: 'merkaba', theorem: 'textbook_mixed_radix' }) : null
      return { phase: 'rosetta' as const, radices: r.radices, order: r.order, permuted: r.permuted, scale: r.scale.toString(), equalScale, covers, ...(index !== null ? { from: index.toString(), to: r.to(index).toString(), back: r.from(r.to(index)).toString() } : {}), ...(frames ? { frames } : {}), ...(hooked ? { hooks: { via: 'hooks' as const, hooks: hooked.hooks, beforeChange: 'the residue is recorded' as const, afterChange: 'the residue is handed to the docs door' as const, afterRead: 'the exposed residue is served' as const, documented: hooked.iso.documented === true, formula: hooked.iso.formula, iso: hooked.iso, docs: hooked.docs } } : {}), theorems: ['textbook_mixed_radix'], says: proseFill(PROSE.quantumProcessingToolboxesCrypto_says55, r.radices.join('×'), r.permuted.join('×'), r.scale, frames ? proseFill(PROSE.quantumProcessingToolboxesCrypto_s56, frames.exposedCells) : '') }
    }
    if (Array.isArray(args.radices)) {
      const radices = args.radices.map(Number); if (radices.some((r) => !Number.isInteger(r) || r < 1)) throw new Error(PROSE.quantumProcessingToolboxesCrypto_s57)
      const count = compositions(radices)
      const index = Array.isArray(args.digits) ? compositionIndex(radices, args.digits.map(Number)) : typeof args.index === 'string' || typeof args.index === 'number' ? BigInt(String(args.index)) : null
      if (Array.isArray(args.digits) && (args.digits.length !== radices.length || args.digits.some((d, i) => !Number.isInteger(Number(d)) || Number(d) < 0 || Number(d) >= radices[i]!))) throw new Error(PROSE.quantumProcessingToolboxesCrypto_s58)
      if (index !== null && (index < 0n || index >= count)) throw new Error(proseFill(PROSE.quantumProcessingToolboxesCrypto_s43, count))
      const digits = index === null ? null : composition(radices, index)
      const address = index === null ? null : `${index}-${digits!.join(radices.every((r) => r <= 10) ? '' : '.')}`
      return { phase: 'composition' as const, positions: radices.length, radices, count: count.toString(), index: index?.toString() ?? null, digits, address, uuid: address ? uuid(`composition\n${radices.join(',')}\n${address}`) : null, returns: index === null ? null : compositionIndex(radices, digits!) === index, theorems: ['textbook_mixed_radix', 'textbook_queneau_compositions'], says: index === null ? proseFill(PROSE.quantumProcessingToolboxesCrypto_s59, radices.length, count) : proseFill(PROSE.quantumProcessingToolboxesCrypto_s60, index, count, digits!.join(' ')) }
    }
    if (typeof args.hex === 'string') { const p = presentation(args.hex); return { phase: 'presented' as const, ...p } }
    if (typeof args.neighbours === 'string') return { phase: 'neighbours' as const, ...neighbours(args.neighbours) }
    if (typeof args.next === 'string') { const n = next(args.next); return { phase: 'next' as const, ...n, says: proseFill(PROSE.quantumProcessingToolboxesCrypto_says61, n.places, n.aspects.length) } }
    // teamwork to the zero bit: a UUID actor's team is its six program-space neighbours and the stream over the neighbourhood — a team a neighbourhood, not a list
    if (typeof args.navigate === 'string') return { phase: 'navigate' as const, ...navigate(args.navigate, (isObj(args.query) ? args.query : {}) as StreamQuery), theorems: ['textbook_teamwork_navigation', 'textbook_neighbour_step'], says: proseFill(PROSE.quantumProcessingToolboxesCrypto_says62, args.navigate.slice(0, 8)) }
    if (Array.isArray(args.uuids)) return { phase: 'streamed' as const, ...stream(args.uuids.map(String), (isObj(args.query) ? args.query : {}) as StreamQuery) }
    if (Array.isArray(args.pieces)) { const u = unfoldPieces(args.pieces as { index: number; text: string; sha256?: string }[], typeof args.root === 'string' ? args.root : undefined); return { phase: 'unfolded' as const, bytes: utf8(u.whole).length, root: u.root, agrees: u.agrees, wrong: u.wrong, ...(args.withPieces ? { whole: u.whole } : {}) } }
    if (typeof args.text !== 'string') throw new Error('text folds, or pieces unfold')
    // any bound folds: one at least the text's bytes is the whole text in one piece, and a bound of 0 holds no byte, so it is read as 1
    const asked = getInteger(args.bound, 'bound', 131072n), whole = BigInt(Math.max(1, utf8(args.text).length)), bound = Number(asked < 1n ? 1n : asked > whole ? whole : asked)
    const f = { ...foldLedger(args.text, bound), asked: writeInteger(asked) }, { texts, ...folded } = f
    const located = typeof args.key === 'string' ? pieceOfKey(f, args.key) : null
    return { phase: 'folded' as const, ...folded, pieces: f.pieces.map((p, i) => (args.withPieces ? { ...p, text: texts[i]! } : p)), ...(typeof args.key === 'string' ? { key: args.key, located, decision: located ? `ask piece ${located.index} (${located.address}); ${located.why}` : PROSE.quantumProcessingToolboxesCrypto_s63 } : {}) }
  },
  widget: flowWidget,
})


/** The MCP Apps widget's token, accepted as its SHA-256 witness: the secret never travels and never returns in the result. */
const acceptWidgetToken = (raw: unknown) => {
  const standards = ['ISO/IEC 27001:2022', 'ISO/IEC 27034'] as const
  const refused = (says: string) => ({ phase: 'token' as const, via: 'widget' as const, accepted: false as const, secret: false as const, echoed: false as const, travelled: false as const, standards, address: null, fetched: false as const, written: false as const, holds: false as const, theorem: 'textbook_leaks_redacted' as const, says })
  if (!isObj(raw)) return refused(PROSE.quantumProcessingToolboxesCrypto_s146)
  const body = raw as Record<string, unknown>
  const extra = Object.entries(body).some(([key, value]) => key !== 'witness' && key !== 'via' && typeof value === 'string')
  const witness = typeof body.witness === 'string' ? body.witness : ''
  const via = body.via === 'widget'
  const shape = /^[0-9a-f]{64}$/.test(witness)
  if (extra || !via || !shape) return refused(PROSE.quantumProcessingToolboxesCrypto_s147)
  const address = uuid(`widget\n${witness}`)
  return { phase: 'token' as const, via: 'widget' as const, accepted: true as const, witness, secret: false as const, echoed: false as const, travelled: false as const, standards, address, fetched: false as const, written: false as const, holds: uuidSeal(address).valid && address.length === 36, theorem: 'textbook_leaks_redacted' as const, says: PROSE.quantumProcessingToolboxesCrypto_says148 }
}


const seal = defineTool('crypto', {
  name: 'seal',
  description: PROSE.quantumProcessingToolboxesCrypto_description64,
  inputSchema: { type: 'object', properties: { token: { description: PROSE.quantumProcessingToolboxesCrypto_description149 }, pqc: { type: 'object', description: PROSE.quantumProcessingCryptoPqc_description }, gltf: { type: 'object', description: PROSE.quantumProcessingToolboxesCrypto_description65 }, text: { type: 'string' }, texts: { type: 'array', items: { type: 'string' }, minItems: 1, description: PROSE.quantumProcessingToolboxesCrypto_texts }, brief: { type: 'boolean', description: PROSE.quantumProcessingToolboxesCrypto_brief }, nist: { description: PROSE.quantumProcessingToolboxesCrypto_description66 }, fips180: { type: 'boolean', description: PROSE.quantumProcessingToolboxesCrypto_description67 }, sha3: { type: 'boolean', description: PROSE.quantumProcessingToolboxesCrypto_description68 }, shake: { type: 'boolean', description: PROSE.quantumProcessingToolboxesCrypto_description69 }, kem: { description: PROSE.quantumProcessingToolboxesCrypto_description70 }, slh: { description: PROSE.quantumProcessingToolboxesCrypto_description71 }, ed25519: { description: PROSE.quantumProcessingToolboxesCrypto_description72 }, ecdsa: { type: 'boolean', description: PROSE.quantumProcessingToolboxesCrypto_description73 }, x25519: { type: 'object', description: PROSE.quantumProcessingToolboxesCrypto_description74 }, pbkdf2: { type: 'object', description: PROSE.quantumProcessingToolboxesCrypto_description75 }, merkle: { type: 'object', description: PROSE.quantumProcessingToolboxesCrypto_description76 }, constants: { description: PROSE.quantumProcessingToolboxesCrypto_description77 }, key: { type: 'string', description: PROSE.quantumProcessingToolboxesCrypto_description78 }, aead: { type: 'object', description: PROSE.quantumProcessingToolboxesCrypto_description79 }, sign: { type: ['string', 'boolean', 'object'], description: PROSE.quantumProcessingToolboxesCrypto_description80 }, referer: { description: PROSE.quantumProcessingToolboxesCrypto_description81 }, artifacts: { type: 'array', items: { type: 'object' }, description: PROSE.quantumProcessingToolboxesCrypto_description82 }, tamper: { type: 'object', description: '{ text, address, sha256? }: a copy checked against the address and digest the original carried — authentic when both match, modified when the text no longer matches them (adapted material under the licence), forged when the address matches and the digest does not (a crafted collision of the fold); a tampered copy answered with the court\'s case' }, entropy: { type: 'array', items: { type: 'object' }, description: PROSE.quantumProcessingToolboxesCrypto_description83 }, receipts: { type: 'array', items: { type: 'object' }, description: '[{ id, leaves: [address… | { seed }], recorded }]: holds when the current fold recomputes the recorded address, stale when an earlier fold does, wrong when none does; a { seed } leaf is minted by uuidna\'s toUuid. Nothing is fetched or read' }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    if (args.token !== undefined) return acceptWidgetToken(args.token) as never
    if (args.pqc === undefined && args.aead === undefined && args.constants === undefined && args.gltf === undefined && args.artifacts === undefined && args.tamper === undefined && args.sign === undefined && args.referer === undefined && args.entropy === undefined && args.key === undefined && args.sha3 === undefined && args.shake === undefined && args.kem === undefined && args.slh === undefined && args.ed25519 === undefined && args.ecdsa === undefined && args.x25519 === undefined && args.pbkdf2 === undefined && args.merkle === undefined && args.receipts === undefined && args.nist === undefined && args.fips180 === undefined && args.texts === undefined && typeof args.text !== 'string') return unlimited() as never
    const cfg = tenantCrypto(args as Record<string, unknown>)
    if (args.nist === true || isObj(args.nist)) {
      const hosts = Array.isArray((args as { hosts?: unknown }).hosts) ? (args as { hosts: string[] }).hosts.map(String) : undefined
      const spec = args.nist === true ? { reverse: false as const } : args.nist as { reverse?: boolean; via?: string; hosts?: string[] }
      const viaHosts = Array.isArray(spec.hosts) ? spec.hosts.map(String) : hosts
      if (spec.reverse === true) {
        if (spec.via !== undefined && spec.via !== 'cern') throw new Error(proseFill(PROSE.quantumProcessingToolboxesCrypto_s84, JSON.stringify(spec.via)))
        return nistScenariosReverse(cfg, viaHosts ?? [cryptoHosts(cfg).cern]) as never
      }
      return nistScenarios(cfg, viaHosts) as never
    }
    if (args.aead !== undefined) return aead(args.aead) as never
    if (args.x25519 !== undefined) return exchangeX25519(args.x25519) as never
    if (args.pbkdf2 !== undefined) return derivePbkdf2(args.pbkdf2) as never
    if (args.receipts !== undefined) return findStaleReceipts(args.receipts) as never
    if (args.merkle !== undefined) return merkleTree(args.merkle) as never
    if (args.pqc !== undefined) return pqc(args.pqc) as never
    if (args.kem !== undefined) return { phase: 'kem' as const, ...kemRound(args.kem) } as never
    if (args.slh !== undefined) return { phase: 'slh' as const, ...dsaRound(args.slh, typeof args.text === 'string' ? args.text : undefined, 'SLH-DSA-SHA2-128s') } as never
    if (args.ed25519 !== undefined) return { phase: 'ed25519' as const, ...dsaRound('Ed25519', args.ed25519 === true ? String(args.text ?? '') : String(args.ed25519)) } as never
    // the physical constants as coins: the request for CODATA's table, then the table read into exact integers, each constant sealed with its stated uncertainty
    if (args.constants === true) return { phase: 'requests' as const, requestList: [{ id: 'codata', method: 'GET', url: cfg.codataUrl, accept: 'text/plain' }], says: PROSE.quantumProcessingToolboxesCrypto_says85 } as never
    if (isObj(args.constants)) { const c = args.constants as { text?: string }; return { phase: 'sealed' as const, ...listConstants(String(c.text ?? '')) } as never }
    if (Array.isArray(args.texts)) {
      const texts = args.texts.map((t, i) => { if (typeof t !== 'string') throw new Error(`texts[${i}] is a string`); return t })
      if (!texts.length) throw new Error(PROSE.quantumProcessingToolboxesCrypto_texts)
      const items = texts.map((t) => { const address = uuid(t), sealed = { bytes: utf8(t).length, sha256: sha(t), address }; return args.brief === true ? sealed : { ...sealed, parts: addressParts(address) } })
      const tree = merkleTree({ leaves: texts }) as { root: string }, address = uuid(tree.root)
      return { phase: 'batch' as const, count: items.length, items, root: { rfc: 6962 as const, sha256: tree.root, address, ...(args.brief === true ? {} : { parts: addressParts(address) }) }, says: proseFill(PROSE.quantumProcessingToolboxesCrypto_batchSays, items.length, address) } as never
    }
    const text = String(args.text)
    const digest = sha(text)
    if (args.brief === true) return { bytes: utf8(text).length, sha256: digest, address: uuid(text) } as never
    if (args.fips180 === true) {
      const message = utf8(text)
      return { phase: 'fips180' as const, fips: '180-4' as const, bytes: message.length, address: uuid(text), sha1: hex(sha1(message)), sha256: digest, sha512: hex(sha512(message)), sizes: { sha1: 20, sha256: 32, sha512: 64 }, theorems: ['textbook_sha256_fips_180_4'] as const, says: PROSE.quantumProcessingToolboxesCrypto_says86 } as never
    }
    if (isObj(args.gltf)) return getGltf(args.gltf as { glb64?: string; json?: unknown }, ((TABLES as Record<string, unknown>).GLTF_EXTENSIONS as { name: string }[] | undefined ?? []).map((x) => x.name)) as never
    if (Array.isArray(args.artifacts)) {
      const rows = (args.artifacts as { source: string; name: string; url: string; algorithm: string; claimed: string; base64?: string; status?: number }[]).map(({ base64, ...a }) => {
        const hash = ({ sha512, sha256, sha1, md5 } as Partial<Record<string, (b: Uint8Array) => Uint8Array>>)[a.algorithm], bytes = a.status === 200 && typeof base64 === 'string' && hash ? Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)) : null
        const d = bytes && hash!(bytes), asHex = /^[0-9a-f]+$/i.test(a.claimed), computed = d && (asHex ? hex(d) : btoa(String.fromCharCode(...d))), verified = computed === null ? null : computed === (asHex ? a.claimed.toLowerCase() : a.claimed)
        return { ...a, bytes: bytes?.length ?? null, computed, reached: verified !== null, verified, verdict: verified === null ? 'unreached' : verified ? 'verified' : 'mismatch', missing: verified !== null ? null : a.status !== 200 ? 'status 200' : hash ? 'base64' : a.algorithm, court: verified === false ? summonCourt({ gate: `artifact ${a.source}`, rule: 'integrity', evidence: { name: a.name, url: a.url, algorithm: a.algorithm } }) : null }
      })
      const verified = rows.filter((r) => r.verified).length, mismatched = rows.filter((r) => r.verified === false).length, unreached = rows.length - verified - mismatched
      return { phase: 'artifacts' as const, artifacts: rows.length, verified, mismatched, unreached, bySource: Object.fromEntries([...new Set(rows.map((r) => r.source))].map((s) => [s, `${rows.filter((r) => r.source === s && r.verified).length}/${rows.filter((r) => r.source === s).length}`])), bytes: rows.reduce((n, r) => n + (r.bytes ?? 0), 0), rows, theorems: ['textbook_artifacts_verified', 'textbook_tamper_detected'], says: proseFill(PROSE.quantumProcessingToolboxesCrypto_says87, verified, rows.length, mismatched, mismatched ? PROSE.quantumProcessingToolboxesCrypto_s88 : '', unreached) }
    }
    if (isObj(args.tamper)) {
      const t = args.tamper as { text?: string; address?: string; sha256?: string }
      if (typeof t.text !== 'string' || typeof t.address !== 'string') throw new Error(PROSE.quantumProcessingToolboxesCrypto_s89)
      const address = uuid(t.text), digest = sha(t.text)
      const addressMatches = address === t.address, digestMatches = typeof t.sha256 === 'string' ? digest === t.sha256.toLowerCase() : null
      const verdict = addressMatches && digestMatches !== false ? 'authentic' : addressMatches && digestMatches === false ? 'forged' : 'modified'
      const court = verdict === 'authentic' ? null : summonCourt({ gate: 'seal tamper', rule: verdict === 'forged' ? 'integrity' : 'licence', evidence: { claimed: t.address, found: address, digestMatches, verdict } })
      return { phase: 'tamper' as const, verdict, address: { claimed: t.address, found: address, matches: addressMatches }, sha256: { claimed: t.sha256 ?? null, found: digest, matches: digestMatches }, court, theorems: ['textbook_tamper_detected', 'textbook_sha256_is_64'], says: verdict === 'authentic' ? (digestMatches === null ? PROSE.quantumProcessingToolboxesCrypto_s90 : PROSE.quantumProcessingToolboxesCrypto_s91) : verdict === 'forged' ? PROSE.quantumProcessingToolboxesCrypto_s92 : PROSE.quantumProcessingToolboxesCrypto_s93 }
    }
    const entropy = Array.isArray(args.entropy) ? foldEntropy(args.entropy as { phase: number; t: number; nonce?: number }[]) : null
    const message = utf8(text)
    const shake = args.shake === true ? { shake128: hex(shake128(message, 32)), shake256: hex(shake256(message, 64)), capacities: { shake128: 256, shake256: 512 }, rates: { shake128: 1344, shake256: 1088 } } : null
    return { bytes: message.length, sha256: digest, address: uuid(text), parts: addressParts(uuid(text)), ...(args.sha3 ? { sha3_256: hex(sha3_256(message)), sha3_512: hex(sha3_512(message)) } : {}), ...(shake ? { phase: 'shake' as const, ...shake } : {}), ...(args.ecdsa === true ? { ecdsa: dsaRound('ECDSA-P256', text) } : {}), ...(entropy ? { entropy, salted: uuid(text + entropy.seed) } : {}), ...(typeof args.key === 'string' ? { hmac: hex(hmacSha256(utf8(args.key), utf8(text))) } : {}), ...(args.sign ? { signature: dsaRound(args.sign, text) } : {}), ...(args.referer !== undefined ? { derivation: deriveRefererSeeds(args.referer, args.key) } : {}), postQuantum: cfg.postQuantum, iso: cfg.iso }
  },
  widget: flowWidget,
})


const attest = defineTool('crypto', {
  name: 'attest',
  description: PROSE.quantumProcessingToolboxesCrypto_description94,
  inputSchema: { type: 'object', properties: { op: { type: 'string', enum: ['plan', 'read', 'experience'] }, nist: { description: PROSE.quantumProcessingToolboxesCrypto_description95 }, cern: { description: PROSE.quantumProcessingToolboxesCrypto_description96 }, hosts: { type: 'array', items: { type: 'string' }, description: PROSE.quantumProcessingToolboxesCrypto_description97 }, answers: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, text: { type: 'string' }, status: { type: 'integer' } } } }, now: { type: 'number', description: PROSE.quantumProcessingToolboxesCrypto_description98 }, selftest: { type: 'boolean' } } },
  run: (args, ctx) => {
    const cfg = tenantCrypto(args as Record<string, unknown>)
    const ATTEST_APIS = cfg.attestApis
    const op = String(args.op ?? 'plan')
    const hosts = Array.isArray(args.hosts) ? args.hosts.map(String) : [...cryptoHosts(cfg).attest]
    if (op === 'experience') {
      if (args.cern !== undefined) return { op, ...cernOpenData(args.cern ?? true, cfg) } as never
      return { op, ...nistOpenData(args.nist ?? true) } as never
    }
    if (op === 'plan') return { op, apis: ATTEST_APIS, iso: cfg.iso, requests: ATTEST_APIS.filter((a) => a.open && !a.url.startsWith('tls://') && a.id !== 'crt-sh').map((a) => ({ id: a.id, url: a.url, accept: a.id === 'csrc-pqc' ? 'text/html' : 'application/json' })).concat(hosts.slice(0, 1).map((h) => ({ id: 'crt-sh', url: ATTEST_APIS.find((a) => a.id === 'crt-sh')!.url.replace('<host>', h), accept: 'application/json' }))), liveCertificates: hosts.map((h) => ({ id: `tls:${h}`, host: h, port: 443, answers: '{ notBefore, notAfter, issuer } as the client read them' })), theorems: ['textbook_hash_bits', 'textbook_beacon_period', 'textbook_chain_index_steps', 'textbook_chain_links_by_output', 'textbook_precommitment_is_sha512', 'textbook_tree_size_positive', 'textbook_acme_resources_five', 'textbook_cve_id_well_formed', 'textbook_cvss_bounded', 'textbook_dates_ordered', 'textbook_total_at_least_page', 'textbook_size_nonnegative', 'textbook_adler32_width', 'textbook_doi_well_formed', 'textbook_cert_validity_bound', 'textbook_now_within_validity', 'textbook_pqc_standards_three'], coordination: PROSE.quantumProcessingToolboxesCrypto_coordination99 }
    if (op !== 'read') throw new Error(`op ${op} is not plan or read`)
    const answers = (Array.isArray(args.answers) ? args.answers : []) as AttestAnswer[]
    const r = attestAnswers(answers, typeof args.now === 'number' ? args.now : 0)
    return { op, ...r, says: proseFill(PROSE.quantumProcessingToolboxesCrypto_says100, Object.values(r.sources).filter((x) => x.status === 'read').length, Object.keys(r.sources).length, r.checked, r.violations.length, r.followUps.length ? `; ${r.followUps.length} follow-up(s) to read` : '') }
  },
  widget: flowWidget,
})


export const CRYPTO: Toolbox = {
  name: 'crypto',
  idea: PROSE.quantumProcessingToolboxesCrypto_idea101,
  tools: [fold, seal, attest],
  examples: [
    { id: 'seal-address-parts', tool: 'seal', theorem: 'textbook_uuid_core', arguments: { text: 'sku 42' }, shows: PROSE.quantumProcessingToolboxesCrypto_showsParts, expect: (s) => { const p = s.parts, h = String(s.address).replace(/-/g, ''); return p.handle.length === 8 && p.program.length === 10 && p.tail.length === 12 && p.handle.length + p.program.length + p.tail.length + 2 === h.length && h.startsWith(p.handle) && h.endsWith(p.tail) && p.freeQubits === 122 ? null : JSON.stringify(p) } },
    { id: 'seal-texts-brief', tool: 'seal', theorem: 'textbook_sha256_is_64', arguments: { texts: ['a', 'b', 'c'], brief: true }, shows: PROSE.quantumProcessingToolboxesCrypto_showsBatch, expect: (s) => (s.phase === 'batch' && s.count === 3 && s.items.every((i: Record<string, unknown>) => Object.keys(i).join() === 'bytes,sha256,address' && String(i.sha256).length === 64) && s.root.rfc === 6962 && s.root.sha256.length === 64 && /^[0-9a-f-]{36}$/.test(s.root.address) && !('parts' in s.root) ? null : JSON.stringify(s)) },
    { id: 'fold-proven', tool: 'fold', theorem: 'textbook_only_the_proven_is_admitted', arguments: { proven: true }, shows: PROSE.quantumProcessingToolboxesCrypto_shows102, expect: (s) => (s.phase === 'qpu-crypto-1000-bit' && s.verified === true && s.sealed === true && s.reflect1000Bit.bits === 1000 && s.reflect1000Bit.reflections === 14 && s.reflect1000Bit.exact === true && s.sigmaTrapdoor1000Bit.bits === 1000 && s.sigmaTrapdoor1000Bit.decoded === true && s.sigmaTrapdoor1000Bit.wrongWitnessRefused === true && s.dnaCrossEncryption.roundTrips === true && s.dnaCrossEncryption.decodedByWitness === true && s.glagolitic1000.roundTrip === true && s.exactArithmetic.bits1000 === 1000 && s.exactArithmetic.algebraicProduct === true && uuidSeal(s.address).valid ? null : JSON.stringify({ verified: s.verified, reflections: s.reflect1000Bit?.reflections, trapdoor: s.sigmaTrapdoor1000Bit?.bits })) },
    { id: 'fold-superpositions', tool: 'fold', theorem: 'textbook_neighbour_step', arguments: { superpositions: true }, shows: PROSE.quantumProcessingToolboxesCrypto_shows103, expect: (s) => (s.phase === 'superpositions' && s.holds === true && s.fetched === false && s.written === false && s.walked === false && s.superpositions === 12 && s.neighbours === 6 && s.qubits.leads === 6 ? null : JSON.stringify({ holds: s.holds, n: s.superpositions, qubits: s.qubits })) },
    { id: 'fold-superpositions-reverse', tool: 'fold', theorem: 'textbook_neighbour_step', arguments: { superpositions: { reverse: true } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows104, expect: (s) => (s.phase === 'superpositions-reverse' && s.direction === 'reverse' && s.holds === true && s.fetched === false && s.written === false && s.walked === false && s.superpositions === 12 && s.reversed === 12 && s.scenarios.every((row: { returns: boolean }) => row.returns) ? null : JSON.stringify({ holds: s.holds, reversed: s.reversed, failed: s.scenarios?.filter((row: { returns: boolean }) => !row.returns).map((row: { id: string }) => row.id) })) },
    { id: 'fold-qubits', tool: 'fold', theorem: 'textbook_neighbour_step', arguments: { qubits: 4 }, shows: PROSE.quantumProcessingToolboxesCrypto_shows105, expect: (s) => (s.phase === 'qubits' && s.hexbit === 4 && s.effective === 122 && s.delivery.holds === true && s.delivery.leads.length === 6 && s.delivery.leads.every((lead: { sealed: boolean }) => lead.sealed) && s.receipt.holds === true ? null : JSON.stringify({ effective: s.effective, leads: s.delivery?.leads?.length, holds: s.delivery?.holds })) },
    { id: 'fold-coins', tool: 'fold', theorem: 'textbook_coins_coils_balanced', arguments: { coins: ['941ef62e-d97b-2438-bfc8-22ae9e5da781', 'rodin', '941ef62e-d97b-2438-bfc8-22ae9e5da781'] }, shows: PROSE.quantumProcessingToolboxesCrypto_shows106, expect: (s) => (s.phase === 'coins' && s.count === 2 && s.of === 3 && s.merged === 1 && s.sealed === true ? null : JSON.stringify(s)) },
    { id: 'fold-integers', tool: 'fold', theorem: 'textbook_entropy_fusion', arguments: { integers: ['15', '15', '-15', '12a', 'hello', ''] }, shows: PROSE.quantumProcessingToolboxesCrypto_shows107, expect: (s) => { const members = [...new Set(s.rows.map((r: { address: string }) => r.address))].sort(); return s.phase === 'singularity' && s.agnostic === true && s.refused === false && s.cases === 6 && s.leads + s.collapsed === s.cases && s.leads <= s.findings && s.collapsed === 1 && s.entropy === 6 && s.burned === s.entropy && s.fuel === s.burned && s.wave.next === 1 && s.wave.fuel === 6 && s.singularity === uuid(canonicalText(members)) && s.sealed === true && s.rows.every((r: { sealed: boolean }) => r.sealed) && ['digit', 'minus', 'mixed', 'meaning', 'empty'].every((k) => s.rows.some((r: { kind: string }) => r.kind === k)) ? null : JSON.stringify({ cases: s.cases, leads: s.leads, entropy: s.entropy, kinds: s.rows?.map((r: { kind: string }) => r.kind) }) } },
    { id: 'fold-harmonic', tool: 'fold', theorem: 'textbook_harmonic_default', arguments: { harmonic: { schema: { properties: { style: { enum: ['nova', 'lyra', 'maia'] }, theme: { enum: ['neutral', 'stone', 'zinc', 'gray'] }, radius: { enum: ['0', '0.3', '0.5', '0.75', '1'] } } } } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows108, expect: (s) => (s.combinations === '60' && s.index === '12' && s.from === 'a432' && s.defaults.style === 'nova' && s.defaults.theme === 'zinc' && s.defaults.radius === '0.5' ? null : JSON.stringify(s)) },
    { id: 'fold-harmonic-rbac', tool: 'fold', theorem: 'textbook_rbac_options', arguments: { harmonic: { tool: 'mongo', role: 'writer', schema: { properties: { op: { enum: ['find', 'insert', 'update', 'delete'] }, collection: { enum: ['entries', 'pages'] } } } } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows109, expect: (s) => (s.combinations === '6' && JSON.stringify(s.options.op) === JSON.stringify(['find', 'insert', 'update']) && !s.options.op.includes('delete') && s.withheld.length === 0 && s.options.op.includes(s.defaults.op) ? null : JSON.stringify(s)) },
    { id: 'fold-decode', tool: 'fold', theorem: 'textbook_decode_not_search', arguments: { decode: { radices: QUENEAU, address: '42-00000000000042' } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows110, expect: (s) => (s.phase === 'decoded' && s.method === 'algebraic' && s.index === '42' && s.agrees === true && s.digits.join('') === '00000000000042' && s.cost.algebraic === 14 && s.cost.search === '100000000000000' ? null : JSON.stringify(s)) },
    { id: 'fold-decode-one-way', tool: 'fold', theorem: 'textbook_decode_not_search', arguments: { decode: { radices: QUENEAU, uuid: '941ef62e-d97b-2438-bfc8-22ae9e5da781' } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows111, expect: (s) => (s.phase === 'refused' && s.decodable === false && s.method === 'none' && s.court.rule === 'search' && /^[0-9a-f-]{36}$/.test(s.court.case) && s.leads.length === 1 ? null : JSON.stringify(s)) },
    { id: 'fold-queneau', tool: 'fold', theorem: 'textbook_mixed_radix', arguments: { radices: QUENEAU, index: '99999999999999' }, shows: PROSE.quantumProcessingToolboxesCrypto_shows112, expect: (s) => (s.count === '100000000000000' && s.digits.length === 14 && s.digits.every((d: number) => d === 9) && s.returns === true && s.address === '99999999999999-99999999999999' && /^[0-9a-f-]{36}$/.test(s.uuid) ? null : JSON.stringify(s)) },
    { id: 'fold-spaces', tool: 'fold', theorem: 'textbook_queneau_compositions', arguments: { spaces: { queneau: QUENEAU, plugins: [2, 2, 2, 2, 2, 2, 2, 2, 2], adapters: [5, 5, 2], sets: [3, 8], algorithm: [7, 19, 1, 2, 6, 1, 1, 8, 2, 11], installations: [3, 2, 5, 5, 2, 512] } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows113, expect: (s) => (JSON.stringify(s.spaces.map((x: { count: string }) => x.count)) === JSON.stringify(['100000000000000', '512', '50', '24', '280896', '153600']) ? null : JSON.stringify(s.spaces)) },
    { id: 'fold-combinatorics', tool: 'fold', theorem: 'textbook_queneau_compositions', arguments: { combinatorics: true }, shows: PROSE.quantumProcessingToolboxesCrypto_shows114, expect: (s) => (s.phase === 'combinatorics' && s.best === 'queneau' && s.count === '100000000000000' && s.formula === '10 ^ 14' && s.microdata['@context'] === 'https://schema.org' && s.microdata.numberOfItems === 14 && s.microdata.itemListElement.length === 14 && s.microdata.itemListElement.every((i: { item: { value: number; maxValue: number } }) => i.item.value === 10 && i.item.maxValue === 9) && s.microdata.additionalProperty.find((p: { name: string }) => p.name === 'count').value === s.count && s.collected === 1 + 14 + 2 && s.spaces.every((x: { count: string }) => BigInt(x.count) <= BigInt(s.count)) ? null : JSON.stringify({ best: s.best, count: s.count, collected: s.collected })) },
    { id: 'fold-rosetta', tool: 'fold', theorem: 'textbook_mixed_radix', arguments: { rosetta: [6, 7], index: '20' }, shows: PROSE.quantumProcessingToolboxesCrypto_shows115, expect: (s) => (s.phase === 'rosetta' && s.scale === '42' && JSON.stringify(s.permuted) === JSON.stringify([7, 6]) && s.equalScale === true && s.covers === true && s.to === '38' && s.back === '20' ? null : JSON.stringify(s)) },
    { id: 'fold-hex', tool: 'fold', theorem: 'textbook_uuid_core', arguments: { hex: '941ef62e-d97b-2438-bfc8-22ae9e5da781' }, shows: PROSE.quantumProcessingToolboxesCrypto_shows116, expect: (s) => (s.phase === 'presented' && s.nibbles === 32 && s.parts.length === 32 && s.choices === 16 && /^rgb\(\d+ \d+ \d+\)$/.test(s.style['--qpu-accent']) && s.style['--qpu-hue'] === String(parseInt(s.uuid.slice(0, 8), 16) % 360) ? null : JSON.stringify(s.parts?.slice(0, 2))) },
    { id: 'fold-stream', tool: 'fold', theorem: 'textbook_stream_filter', arguments: { uuids: ['941ef62e-d97b-2438-bfc8-22ae9e5da781', '016da774-e74c-2e44-8742-f8bcf5e8e8f5', '00000000-0000-1000-8000-000000000000'], query: { where: { nibble: { at: 1, is: '0' } }, sort: 'hue', execute: true } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows117, expect: (s) => (s.phase === 'streamed' && s.stream === 3 && s.filtered === 1 && s.rows[0].uuid === '00000000-0000-1000-8000-000000000000' && /^[0-9a-f-]{36}$/.test(s.rows[0].next) ? null : JSON.stringify(s.rows)) },
    { id: 'fold-ledger', tool: 'fold', theorem: 'textbook_fold_mirror', arguments: { text: Array.from({ length: 40 }, (_, i) => JSON.stringify({ key: `k${String(i).padStart(2, '0')}`, value: i * i, note: 'a row of the ledger' })).join('\n'), bound: 600, key: 'k27' }, shows: PROSE.quantumProcessingToolboxesCrypto_shows118, expect: (s) => (s.phase === 'folded' && !s.fits && s.count >= 4 && s.pieces.every((p: { reflection: number; index: number }) => p.reflection === s.count - 1 - p.index) && s.located && s.located.why.includes('k27') === false && s.located.index >= 0 && s.decision.startsWith('ask piece') ? null : `${s.phase} ${s.count} ${JSON.stringify(s.located)}`) },
    { id: 'attest-plan', tool: 'attest', theorem: 'textbook_attest_requests', arguments: { op: 'plan' }, shows: PROSE.quantumProcessingToolboxesCrypto_shows119, expect: (s) => (s.apis.length >= 5 && s.requests.length === s.apis.filter((a: { open: boolean; id: string }) => a.open && a.id !== 'tls-live').length && s.liveCertificates.length === 4 && s.theorems.length === 17 && s.iso?.quantumComputer?.standard === 'ISO/IEC 4879:2024' && s.iso.quantumComputer.processors.allowed.length === 6 ? null : JSON.stringify({ apis: s.apis?.length, iso: s.iso?.quantumComputer?.standard, processors: s.iso?.quantumComputer?.processors?.allowed })) },
    { id: 'attest-read', tool: 'attest', theorem: 'textbook_cert_validity_bound', arguments: { op: 'read', now: 1793005826714, answers: [{ id: 'nist-beacon', text: BEACON_LAST }, { id: 'ct-sth', text: STH }, { id: 'nvd-cves', text: NVD }, { id: 'cern-opendata', text: CERN }, { id: 'tls:qpu.uuidna.com', text: JSON.stringify({ notBefore: '2026-09-09T03:31:22Z', notAfter: '2026-12-08T04:31:19Z', issuer: 'Google Trust Services WE1' }) }] }, shows: PROSE.quantumProcessingToolboxesCrypto_shows120, expect: (s) => (s.violations.length === 0 && s.followUps.length === 1 && s.checked >= 10 ? null : JSON.stringify(s.violations)) },
    { id: 'seal-sign', tool: 'seal', theorem: 'textbook_signature_over_digest', arguments: { text: 'qpu', sign: { algorithm: 'ML-DSA-65', seed: '07'.repeat(32) } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows121, expect: (s) => (s.signature?.algorithm === 'ML-DSA-65' && s.signature.fips === 204 && s.signature.message === 'qpu' && s.signature.verified && s.signature.refusesChanged && s.signature.signature.length === 2 * 3309 && s.signature.publicKey.length === 2 * 1952 && s.iso?.quantumComputer?.standard === 'ISO/IEC 4879:2024' ? null : JSON.stringify(s.signature)) },
    { id: 'seal-entropy', tool: 'seal', theorem: 'textbook_phase_bits', arguments: { text: 'qpu', entropy: [{ phase: 1000, t: 1, nonce: 7, x: 3, y: 4 }, { phase: 2000, t: 2, nonce: 9 }] }, shows: PROSE.quantumProcessingToolboxesCrypto_shows122, expect: (s) => (s.entropy.bits === 86 && s.entropy.phaseBits === 11 && s.entropy.frame === 18 && s.entropy.angle === 185 && /^[0-9a-f-]{36}$/.test(s.entropy.seed) && /^[0-9a-f-]{36}$/.test(s.salted) && s.salted !== s.address && s.entropy.rate.free === 1 && s.entropy.rate.coils === 0 ? null : JSON.stringify(s.entropy)) },
    { id: 'seal-artifacts', tool: 'seal', theorem: 'textbook_artifacts_verified', arguments: { text: 'qpu', artifacts: [{ source: 'npm', name: '@uuidna/qpu@1.4.0', url: 'https://registry.npmjs.org/@uuidna/qpu/-/qpu-1.4.0.tgz', algorithm: 'sha512', claimed: 'MJjXXgqZ643kOTzj27rP1mz8Wehzp8AH2WChye0ggA28ANzcd7hkWHT2VqxOQ+acQqRGYQ/EGyoetXMd4nhvHg==', base64: 'cXB1', status: 200 }, { source: 'zenodo', name: '10.5281/zenodo.1 x.zip', url: 'https://zenodo.org/api/records/1/files/x.zip/content', algorithm: 'md5', claimed: '00ff', base64: 'cXB1', status: 200 }, { source: 'npm', name: '@uuidna/qpu@1.0.0', url: 'https://registry.npmjs.org/@uuidna/qpu/-/qpu-1.0.0.tgz', algorithm: 'sha512', claimed: 'x', status: 0 }] }, shows: PROSE.quantumProcessingToolboxesCrypto_shows123, expect: (s) => (s.artifacts === 3 && s.verified === 1 && s.mismatched === 1 && s.unreached === 1 && s.rows[1].court.rule === 'integrity' && s.bySource.npm === '1/2' ? null : JSON.stringify({ v: s.verified, m: s.mismatched, u: s.unreached })) },
    { id: 'seal-tamper-authentic', tool: 'seal', theorem: 'textbook_tamper_detected', arguments: { text: 'qpu', tamper: { text: 'qpu', address: '70a13419-52d5-8e4c-9f1b-3c0d2e1f4a5b', sha256: '0000000000000000000000000000000000000000000000000000000000000000' } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows124, expect: (s) => (s.verdict === 'modified' && s.address.matches === false && s.sha256.matches === false && s.court.rule === 'licence' && /^[0-9a-f-]{36}$/.test(s.court.case) ? null : JSON.stringify(s)) },
    { id: 'seal-referer', tool: 'seal', theorem: 'textbook_referer_binds_not_entropy', arguments: { text: 'qpu', key: 'test', referer: { address: '941ef62e-d97b-2438-bfc8-22ae9e5da781', chunks: 3 } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows125, expect: (s) => (s.derivation?.seeds?.length === 3 && new Set(s.derivation.seeds).size === 3 && s.derivation.seeds.every((x: string) => /^[0-9a-f]{64}$/.test(x)) && s.derivation.entropy.refererBits === 0 && s.derivation.entropy.totalBits === s.derivation.entropy.secretBits ? null : JSON.stringify(s.derivation)) },
    { id: 'seal-text', tool: 'seal', theorem: 'textbook_sha256_is_64', arguments: { text: 'qpu', key: 'test' }, shows: PROSE.quantumProcessingToolboxesCrypto_shows126, expect: (s) => (s.sha256.length === 64 && s.hmac.length === 64 && /^[0-9a-f-]{36}$/.test(s.address) && s.bytes === 3 ? null : JSON.stringify(s)) },
    { id: 'seal-aead', tool: 'seal', theorem: 'textbook_aead_sizes', arguments: { text: 'functional', aead: { cipher: 'aes-256-gcm', key: '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f', nonce: '000102030405060708090a0b', text: 'functional', aad: 'both' } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows127, expect: (s) => (s.phase === 'aead' && s.direction === 'seal' && s.cipher === 'aes-256-gcm' && s.ciphertext === '2177b878b18cad75ec2d' && s.tag === '4dc07b9416cccdb5d7262a5b3cbe6bac' ? null : JSON.stringify(s)) },
    { id: 'seal-x25519', tool: 'seal', theorem: 'textbook_x25519_sizes', arguments: { x25519: { scalar: '77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a', point: 'de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b4f' } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows128, expect: (s) => (s.phase === 'x25519' && s.rfc === 7748 && s.shared === '4a5d9d5ba4ce2de1728e3bf480350f25e07e21c947d19e3376f09b3c1e161742' && s.sizes.scalar === 32 && s.sizes.point === 32 && s.sizes.shared === 32 ? null : JSON.stringify(s)) },
    { id: 'seal-pbkdf2', tool: 'seal', theorem: 'textbook_pbkdf2_blocks', arguments: { pbkdf2: { password: 'password', salt: 'salt', iterations: 1, length: 32 } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows129, expect: (s) => (s.phase === 'pbkdf2' && s.kdf === 'PBKDF2-HMAC-SHA256' && s.rfc === 8018 && s.iterations === 1 && s.length === 32 && s.derived === '120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b' ? null : JSON.stringify(s)) },
    { id: 'seal-merkle', tool: 'seal', theorem: 'textbook_tree_size_positive', arguments: { merkle: { leaves: ['a', 'b', 'c'], index: 1 } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows130, expect: (s) => (s.phase === 'merkle' && s.rfc === 6962 && s.direction === 'proof' && s.leaves === 3 && s.index === 1 && s.verified === true && s.root === '36642e73c2540ab121e3a6bf9545b0a24982cd830eb13d3cd19de3ce6c021ec1' && s.proof.length === 2 ? null : JSON.stringify(s)) },
    { id: 'seal-receipts', tool: 'seal', theorem: 'textbook_receipts_partitioned', arguments: { receipts: [{ id: 'quintessay-payload-2026-09-05', leaves: ['97a57755-2f00-8510-9085-5f587b5bc62e', '3ec75fd9-b90e-80ae-84ad-2e218293d407', { seed: 'coins:2' }], recorded: '3fb11082-9cac-8510-8a0e-8508c8692be9' }, { id: 'quintessay-payload-2026-11-08', leaves: ['97a57755-2f00-8510-9085-5f587b5bc62e', '3ec75fd9-b90e-80ae-84ad-2e218293d407', '1d258da4-cbdf-8e22-890e-a68b5592fe86'], recorded: '959a1b84-b361-8cc2-887f-f89f80363964' }, { id: 'quintessay-payload-two-leaves', leaves: ['97a57755-2f00-8510-9085-5f587b5bc62e', '3ec75fd9-b90e-80ae-84ad-2e218293d407'], recorded: '3fb11082-9cac-8510-8a0e-8508c8692be9' }] }, shows: PROSE.quantumProcessingToolboxesCrypto_shows131, expect: (s) => (s.phase === 'receipts' && s.receipts === 3 && s.holds === 1 && s.stale === 1 && s.wrong === 1 && s.rows[0].verdict === 'stale' && s.rows[0].fold === 'uuidna-untagged' && s.rows[0].computed === '959a1b84-b361-8cc2-887f-f89f80363964' && s.rows[0].leaves[2] === '1d258da4-cbdf-8e22-890e-a68b5592fe86' && typeof s.rows[0].change === 'string' && s.rows[0].change.includes('0a4c4e9d87') && s.rows[1].verdict === 'holds' && s.rows[1].fold === 'uuidna-0a4c4e9d87' && s.rows[2].verdict === 'wrong' && s.rows[2].fold === null && JSON.stringify(s.invalidated) === JSON.stringify(['quintessay-payload-2026-09-05', 'quintessay-payload-two-leaves']) && s.folds.length === 2 ? null : JSON.stringify(s)) },
    { id: 'seal-kem', tool: 'seal', theorem: 'textbook_pqc_standards_three', arguments: { kem: true }, shows: PROSE.quantumProcessingToolboxesCrypto_shows132, expect: (s) => (s.phase === 'kem' && s.algorithm === 'ML-KEM-768' && s.fips === 203 && s.agrees && s.publicKey.length === 2 * 1184 && s.cipherText.length === 2 * 1088 && s.sizes.sharedSecret === 32 ? null : JSON.stringify(s.sizes)) },
    { id: 'seal-slh', tool: 'seal', theorem: 'textbook_pqc_standards_three', arguments: { text: 'nist', slh: true }, shows: PROSE.quantumProcessingToolboxesCrypto_shows133, expect: (s) => (s.phase === 'slh' && s.algorithm === 'SLH-DSA-SHA2-128s' && s.fips === 205 && s.publicKey.length === 2 * 32 && s.signature.length === 2 * 7856 && s.verified && s.refusesChanged ? null : JSON.stringify(s.sizes)) },
    { id: 'seal-pqc-xwing', tool: 'seal', theorem: 'textbook_decode_not_search', arguments: { pqc: { op: 'kem-keygen', seed: '07'.repeat(32) } }, shows: PROSE.quantumProcessingCryptoPqc_description, expect: (s) => (s.algorithm === 'X-Wing' && s.publicKey.length === 2 * 1216 ? null : JSON.stringify(s.sizes)) },
    { id: 'seal-ed25519', tool: 'seal', theorem: 'textbook_ed25519_sizes', arguments: { ed25519: 'nist' }, shows: PROSE.quantumProcessingToolboxesCrypto_shows134, expect: (s) => (s.phase === 'ed25519' && s.algorithm === 'Ed25519' && s.rfc === 8032 && s.message === 'nist' && s.publicKey.length === 2 * 32 && s.signature.length === 2 * 64 && s.verified && s.refusesChanged ? null : JSON.stringify(s.sizes)) },
    { id: 'seal-ecdsa', tool: 'seal', theorem: 'textbook_sha256_fips_180_4', arguments: { text: 'nist', ecdsa: true }, shows: PROSE.quantumProcessingToolboxesCrypto_shows135, expect: (s) => (s.ecdsa.algorithm === 'ECDSA-P256' && s.ecdsa.fips === '186-5' && s.ecdsa.message === 'nist' && s.sha256.length === 64 && s.ecdsa.publicKey.length === 2 * 65 && s.ecdsa.signature.length === 2 * 64 && s.ecdsa.verified && s.ecdsa.refusesChanged ? null : JSON.stringify(s.ecdsa.sizes)) },
    { id: 'seal-shake', tool: 'seal', theorem: 'textbook_sha3_fips_202', arguments: { text: 'nist', shake: true }, shows: PROSE.quantumProcessingToolboxesCrypto_shows136, expect: (s) => (s.phase === 'shake' && s.shake128.length === 64 && s.shake256.length === 128 && s.rates.shake128 === 1344 && s.rates.shake256 === 1088 && s.capacities.shake128 === 256 && s.capacities.shake256 === 512 ? null : JSON.stringify(s.rates)) },
    { id: 'seal-fips180', tool: 'seal', theorem: 'textbook_sha256_fips_180_4', arguments: { text: 'nist', fips180: true }, shows: PROSE.quantumProcessingToolboxesCrypto_shows137, expect: (s) => (s.phase === 'fips180' && s.fips === '180-4' && s.sha1.length === 40 && s.sha256.length === 64 && s.sha512.length === 128 && s.sizes.sha1 === 20 && /^[0-9a-f-]{36}$/.test(s.address) ? null : JSON.stringify(s)) },
    { id: 'seal-nist', tool: 'seal', theorem: 'textbook_pqc_standards_three', arguments: { nist: true }, shows: PROSE.quantumProcessingToolboxesCrypto_shows138, expect: (s) => (s.phase === 'nist' && s.host === 'qpu.uuidna.com' && s.holds === true && s.fetched === false && s.written === false && s.scenarios.some((row: { id: string }) => row.id === 'fips-203-ML-KEM-512') && s.scenarios.some((row: { id: string }) => row.id === 'fips-204-ML-DSA-87') && s.scenarios.some((row: { id: string }) => row.id === 'fips-205-SLH-DSA-SHA2-256s') && s.requests.some((r: { id: string }) => r.id === 'nist-beacon') && s.liveCertificates.some((c: { host: string }) => c.host === 'qpu.uuidna.com') ? null : JSON.stringify({ holds: s.holds, scenarios: s.scenarios?.length, requests: s.requests?.map((r: { id: string }) => r.id) })) },
    { id: 'seal-nist-reverse-cern', tool: 'seal', theorem: 'textbook_pqc_standards_three', arguments: { nist: { reverse: true, via: 'cern' } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows139, expect: (s) => (s.phase === 'nist-reverse' && s.direction === 'reverse' && s.via === 'cern' && s.host === 'opendata.cern.ch' && s.holds === true && s.fetched === false && s.written === false && s.scenarios.every((row: { returns: boolean }) => row.returns) && s.requests[0]?.id === 'cern-opendata' && s.liveCertificates.some((c: { host: string }) => c.host === 'opendata.cern.ch') ? null : JSON.stringify({ holds: s.holds, reversed: s.reversed, failed: s.scenarios?.filter((row: { returns: boolean }) => !row.returns).map((row: { id: string }) => row.id), requests: s.requests?.map((r: { id: string }) => r.id) })) },
    { id: 'attest-nist-opendata', tool: 'attest', theorem: 'textbook_seal_and_content_decided', arguments: { op: 'experience', nist: { ResultCount: 1, ResultData: [{ title: 'NIST Chemistry WebBook', doi: 'doi:10.18434/T4D303' }] } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows140, expect: (s) => (s.phase === 'experience' && s.fetched === false && s.holds === true && s.records === 1 && s.total === 1 && s.rows[0].doi === '10.18434/T4D303' && s.rows[0].sealed === true ? null : JSON.stringify({ holds: s.holds, says: s.says })) },
    { id: 'attest-cern-opendata', tool: 'attest', theorem: 'textbook_seal_and_content_decided', arguments: { op: 'experience', cern: { hits: { total: 1, hits: [{ id: '5209', metadata: { title: 'Higgs to two photons from 2011', relations: [{ doi: '10.7483/OPENDATA.CMS.N9MJ.QEEC' }] } }] } } }, shows: PROSE.quantumProcessingToolboxesCrypto_shows141, expect: (s) => (s.phase === 'experience' && s.source === 'cern-opendata' && s.fetched === false && s.holds === true && s.records === 1 && s.total === 1 && s.rows[0].doi === '10.7483/OPENDATA.CMS.N9MJ.QEEC' && s.rows[0].sealed === true ? null : JSON.stringify({ holds: s.holds, says: s.says })) },
  ],
  skill: {
    instructions: PROSE.quantumProcessingToolboxesCrypto_instructions142,
    directions: [PROSE.quantumProcessingToolboxesCrypto_s143, PROSE.quantumProcessingToolboxesCrypto_s144, PROSE.quantumProcessingToolboxesCrypto_s145],
    selftest: (ctx) => {
      const tools = new Set(['fold', 'seal', 'attest'])
      const checks = ctx.examples.filter((e) => tools.has(e.tool)).map((e) => {
        const r = ctx.handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } })
        const why = 'error' in r && r.error ? String(r.error.message) : e.expect(r.result.structuredContent)
        return { id: `crypto:${e.id}`, passed: why === null, evidence: why ?? e.shows }
      })
      return { passed: checks.every((c) => c.passed), checks }
    },
  },
}
