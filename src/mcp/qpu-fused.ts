import { aeadOpen, aeadSeal, bytesOf, ed25519PublicKey, ed25519Sign, ed25519Verify, fromHex, hexOf, hkdf, hmac, md5, sha256, sha512, utf8, x25519, type HashName } from '../core/crypt.js'
import { leanSource } from '../quantum/processing/unit/lean.js'
import { packageVersion } from '../quantum/processing/unit/version.js'
import { qpuCernRecordsOf, qpuContentUuidOf, qpuHexCatalogOf, qpuHexRunOf, qpuHexUuidOf, qpuMcpFuseOf, qpuUuidReceiptOf } from '../quantum/processing/unit/index.js'
import { CryptFormulas } from './crypt-formulas.js'
import { hologramStreamsOf } from './hologram-streams.js'
import { certifyUnreachable, findAssignment, findColoring, findHamCycle, generalizedPetersen, pigeonhole, verifyColoring, verifyHamCycle, verifySat, verifySubsetSum, type Graph } from './np-formulas.js'

type Args = Record<string, unknown>
const fail = (why: string, extra: Record<string, unknown> = {}) => ({ holds: false as const, denied: why, ...extra })
const receiptOf = (name: string, value: unknown, holds: boolean) => qpuUuidReceiptOf(`fused ${name}`, qpuContentUuidOf(value), { holds }).uuid
const str = (x: unknown): string => (typeof x === 'string' ? x : '')
const num = (x: unknown, d: number): number => (typeof x === 'number' && Number.isSafeInteger(x) ? x : typeof x === 'string' && /^\d+$/.test(x) ? Number(x) : d)

// ---------------------------------------------------------------------------
// qpu_hex: run any hex program of any family
// ---------------------------------------------------------------------------

qpuMcpFuseOf('qpu_hex', {
  description: 'Run a hex program: { uuid } or { family, program, params }. Every family: Lean (Qpu.*), qpu, crypto, cross, path, audit, signal, holo, crypt, np. {} returns the catalogue.',
  inputSchema: { type: 'object', properties: { uuid: { type: 'string' }, family: { type: 'string' }, program: { type: ['array', 'string'], items: { type: 'string' } }, params: { type: 'array', items: { type: 'integer' } } } },
  run: async (a, env) => {
    if (!a.uuid && !a.family) return qpuHexCatalogOf()
    let uuid = str(a.uuid)
    if (!uuid) {
      const program = Array.isArray(a.program) ? a.program.map(String) : str(a.program).split(',').map((x) => x.trim()).filter(Boolean)
      const params = Array.isArray(a.params) ? a.params.map(Number) : []
      try {
        uuid = qpuHexUuidOf({ family: str(a.family), program, params })
      } catch (e) {
        return fail('program', { reading: (e as Error).message })
      }
    }
    return qpuHexRunOf(uuid, undefined, env)
  },
})

// ---------------------------------------------------------------------------
// qpu_data: live public datasets against the unit's own values
// ---------------------------------------------------------------------------

const DEADLINE = 15000
const get = async (url: string, accept = 'application/json'): Promise<Response> => {
  const r = await fetch(url, { headers: { accept, 'user-agent': 'qpu.uuidna.com (+https://qpu.uuidna.com)' }, signal: AbortSignal.timeout(DEADLINE) })
  if (!r.ok) throw new Error(`${url} answered ${r.status}`)
  return r
}
const leanNat = (name: string): string | undefined => new RegExp(`def ${name} : Nat := (\\d+)`).exec(leanSource)?.[1]
const bellOf = (count: number): bigint[] => {
  const out: bigint[] = []
  let row = [1n]
  for (let i = 0; i < count; i++) {
    out.push(row[0]!)
    const next = [row[row.length - 1]!]
    for (const x of row) next.push(next[next.length - 1]! + x)
    row = next
  }
  return out
}
const catalanOf = (count: number): bigint[] => {
  const out = [1n]
  for (let i = 1; i < count; i++) out.push((out[i - 1]! * BigInt(2 * (2 * i - 1))) / BigInt(i + 1))
  return out
}
const SEQUENCES: Record<string, { name: string; of: (count: number) => bigint[] }> = { A000110: { name: 'Bell numbers', of: bellOf }, A000108: { name: 'Catalan numbers', of: catalanOf } }

const reading = async (source: string, a: Args) => {
  if (source === 'cern') {
    const recid = num(a.recid ?? a.id, 38)
    const row = qpuCernRecordsOf().records.find((r) => r.recid === recid)
    if (!row) return fail('recid', { recids: qpuCernRecordsOf().records.map((r) => r.recid) })
    const url = `https://opendata.cern.ch/api/records/${recid}`
    const d = ((await (await get(url)).json()) as { metadata?: { distribution?: { number_events?: number; number_files?: number }; title?: string } }).metadata
    const live = { title: d?.title, events: d?.distribution?.number_events, files: d?.distribution?.number_files }
    const agrees = live.events === row.events && live.files === row.files && row.files * row.q + row.r === row.events
    return { source, url, reading: live, expected: { events: row.events, files: row.files, theorem: `${row.files} * ${row.q} + ${row.r} = ${row.events}` }, agrees }
  }
  if (source === 'nist') {
    const url = 'https://physics.nist.gov/cuu/Constants/Table/allascii.txt'
    const text = await (await get(url, 'text/plain')).text()
    const digitsOf = (quantity: string) => {
      const line = text.split('\n').find((l) => l.startsWith(`${quantity} `))
      const value = line?.slice(60, 85).trim() ?? ''
      return { value, digits: value.replace(/e.*$/, '').replace(/[^0-9]/g, '').replace(/^0+/, ''), exact: line?.includes('(exact)') ?? false }
    }
    const live = { planck: digitsOf('Planck constant'), boltzmann: digitsOf('Boltzmann constant') }
    const expected = { planck: leanNat('planck'), boltzmann: leanNat('boltzmann') }
    return { source, url, reading: live, expected, agrees: live.planck.digits === expected.planck && live.boltzmann.digits === expected.boltzmann && live.planck.exact && live.boltzmann.exact }
  }
  if (source === 'oeis') {
    const id = str(a.id) || 'A000110'
    const seq = SEQUENCES[id]
    if (!seq) return fail('sequence', { sequences: Object.keys(SEQUENCES) })
    const url = `https://oeis.org/search?q=id:${id}&fmt=json`
    const body = (await (await get(url)).json()) as { data?: string }[] | { results?: { data?: string }[] }
    const data = (Array.isArray(body) ? body[0]?.data : body.results?.[0]?.data) ?? ''
    const live = data.split(',').filter(Boolean).map((x) => BigInt(x))
    const mine = seq.of(live.length)
    const mismatches = live.flatMap((v, i) => (v === mine[i] ? [] : [i]))
    return { source, url, reading: { name: seq.name, terms: live.length, last: String(live.at(-1) ?? '') }, expected: { last: String(mine.at(-1) ?? ''), mismatches }, agrees: live.length > 0 && mismatches.length === 0 }
  }
  if (source === 'zenodo') {
    const concept = str(a.id) || '22700098'
    const url = `https://zenodo.org/api/records/${concept}/versions/latest`
    const d = (await (await get(url)).json()) as { id?: number; doi?: string; metadata?: { version?: string; publication_date?: string } }
    const live = { record: d.id, doi: d.doi, version: d.metadata?.version, published: d.metadata?.publication_date }
    return { source, url, reading: live, expected: { version: `v${packageVersion}` }, agrees: live.version === `v${packageVersion}` }
  }
  return fail('source', { sources: ['cern', 'nist', 'oeis', 'zenodo'] })
}

qpuMcpFuseOf('qpu_data', {
  description: "Read a live public dataset and check it against the unit: { source: 'cern', recid } (theorem cern), 'nist' (Planck, Boltzmann vs Qpu.Physics), 'oeis' { id: A000110 | A000108 }, 'zenodo' (latest release vs this version).",
  inputSchema: { type: 'object', properties: { source: { type: 'string', enum: ['cern', 'nist', 'oeis', 'zenodo'] }, recid: { type: 'integer' }, id: { type: 'string' } }, required: ['source'] },
  run: async (a) => {
    const source = str(a.source)
    try {
      const r = await reading(source, a)
      if ('denied' in r) return r
      return { kind: 'data', ...r, holds: r.agrees, receipt: receiptOf(`data ${source}`, r.reading, r.agrees) }
    } catch (e) {
      return fail('unreachable', { source, reading: (e as Error).message })
    }
  },
})

// ---------------------------------------------------------------------------
// qpu_crypt: the internal crypto
// ---------------------------------------------------------------------------

const bytesArg = (a: Args, key: string): Uint8Array => (typeof a[`${key}Hex`] === 'string' ? fromHex(a[`${key}Hex`] as string) : bytesOf(str(a[key])))
const CRYPT_OPS: Record<string, (a: Args) => unknown> = {
  known: () => CryptFormulas.knownAnswers(),
  sha256: (a) => hexOf(sha256(bytesArg(a, 'text'))),
  sha512: (a) => hexOf(sha512(bytesArg(a, 'text'))),
  md5: (a) => hexOf(md5(bytesArg(a, 'text'))),
  hmac: (a) => hexOf(hmac((str(a.hash) || 'sha256') as HashName, bytesArg(a, 'key'), bytesArg(a, 'message'))),
  hkdf: (a) => hexOf(hkdf((str(a.hash) || 'sha256') as HashName, fromHex(str(a.ikm)), fromHex(str(a.salt)), utf8(str(a.info)), num(a.length, 32))),
  aead_seal: (a) => {
    const sealed = aeadSeal(fromHex(str(a.key)), fromHex(str(a.nonce)), bytesArg(a, 'plaintext'), fromHex(str(a.aad)))
    return { ct: hexOf(sealed.subarray(0, sealed.length - 16)), tag: hexOf(sealed.subarray(sealed.length - 16)) }
  },
  aead_open: (a) => {
    const opened = aeadOpen(fromHex(str(a.key)), fromHex(str(a.nonce)), fromHex(`${str(a.ct)}${str(a.tag)}`), fromHex(str(a.aad)))
    return opened ? { plaintextHex: hexOf(opened), authentic: true } : { authentic: false }
  },
  x25519: (a) => hexOf(x25519(fromHex(str(a.scalar)), fromHex(str(a.u) || '09'.padEnd(64, '0')))),
  ed25519_public: (a) => hexOf(ed25519PublicKey(fromHex(str(a.seed)))),
  ed25519_sign: (a) => hexOf(ed25519Sign(fromHex(str(a.seed)), bytesArg(a, 'message'))),
  ed25519_verify: (a) => ed25519Verify(fromHex(str(a.publicKey)), bytesArg(a, 'message'), fromHex(str(a.signature))),
}

qpuMcpFuseOf('qpu_crypt', {
  description: 'The unit\'s own crypto (FIPS 180-4, RFC 1321/2104/5869/8439/7748/8032), no external library: { op: known | sha256 | sha512 | md5 | hmac | hkdf | aead_seal | aead_open | x25519 | ed25519_public | ed25519_sign | ed25519_verify, ... }. Byte inputs are hex; text, key, message and plaintext also take <name>Hex.',
  inputSchema: { type: 'object', properties: { op: { type: 'string', enum: Object.keys(CRYPT_OPS) } }, required: ['op'] },
  run: (a) => {
    const op = CRYPT_OPS[str(a.op)]
    if (!op) return fail('op', { ops: Object.keys(CRYPT_OPS) })
    try {
      const value = op(a)
      const holds = value !== false && !(value && typeof value === 'object' && 'holds' in value && (value as { holds: unknown }).holds === false)
      return { kind: 'crypt', op: a.op, value, holds, receipt: receiptOf(`crypt ${String(a.op)}`, value, holds) }
    } catch (e) {
      return fail('input', { op: a.op, reading: (e as Error).message })
    }
  },
})

// ---------------------------------------------------------------------------
// qpu_np: certificate verifiers and the theorems they decide
// ---------------------------------------------------------------------------

const MAX_VERTICES = 4096
const MAX_EDGES = 100000
const graphOf = (a: Args): Graph | null => {
  const n = num(a.n, -1)
  const edges = Array.isArray(a.edges) ? (a.edges as unknown[]).filter((e): e is [number, number] => Array.isArray(e) && e.length === 2 && e.every((v) => Number.isSafeInteger(v) && v >= 0 && v < n)) : []
  return n > 0 && n <= MAX_VERTICES && edges.length <= MAX_EDGES && edges.length === (a.edges as unknown[] | undefined)?.length ? { n, edges } : null
}
const NP_OPS: Record<string, (a: Args) => unknown> = {
  coloring: (a) => {
    const g = graphOf(a)
    return g && Array.isArray(a.colors) ? verifyColoring(g, a.colors as number[], num(a.k, 3)) : fail('graph')
  },
  ham_cycle: (a) => {
    const g = graphOf(a)
    return g && Array.isArray(a.cycle) ? verifyHamCycle(g, a.cycle as number[]) : fail('graph')
  },
  subset_sum: (a) => (Array.isArray(a.set) ? verifySubsetSum(a.set as number[], num(a.mask, 0), num(a.target, 0)) : fail('set')),
  sat: (a) => (Array.isArray(a.cnf) && Array.isArray(a.assignment) ? verifySat(a.cnf as number[][], a.assignment as boolean[]) : fail('cnf')),
  unreachable: (a) => {
    const g = graphOf(a)
    return g ? certifyUnreachable(g, num(a.s, 0), num(a.t, 0)) : fail('graph')
  },
  theorems: () => {
    const petersen = generalizedPetersen(5, 2)
    const dodecahedron = generalizedPetersen(10, 2)
    const colour = findColoring(petersen, 3)
    const cycle = findHamCycle(dodecahedron)
    const php = pigeonhole(3, 2)
    const rows = [
      { name: 'petersen chromatic 3', holds: colour !== null && verifyColoring(petersen, colour, 3) && findColoring(petersen, 2) === null },
      { name: 'petersen non-hamiltonian', holds: findHamCycle(petersen) === null },
      { name: 'dodecahedron hamiltonian', holds: cycle !== null && verifyHamCycle(dodecahedron, cycle), cycle },
      { name: 'pigeonhole 3 into 2 unsatisfiable', holds: findAssignment(php.cnf, php.vars) === null },
      { name: 'subset sum {3,7,1,9,4} reaches 13', holds: verifySubsetSum([3, 7, 1, 9, 4], 13, 13) },
    ]
    return { rows, holds: rows.every((r) => r.holds) }
  },
}

qpuMcpFuseOf('qpu_np', {
  description: 'Check NP certificates in linear time and NL non-reachability by inductive counting: { op: coloring { n, edges, colors, k } | ham_cycle { n, edges, cycle } | subset_sum { set, mask, target } | sat { cnf, assignment } | unreachable { n, edges, s, t } | theorems }.',
  inputSchema: { type: 'object', properties: { op: { type: 'string', enum: Object.keys(NP_OPS) } }, required: ['op'] },
  run: (a) => {
    const op = NP_OPS[str(a.op)]
    if (!op) return fail('op', { ops: Object.keys(NP_OPS) })
    const value = op(a)
    const holds = value === true || (value !== null && typeof value === 'object' && ('unreachable' in value ? (value as { unreachable: boolean }).unreachable : (value as { holds?: unknown }).holds === true))
    return { kind: 'np', op: a.op, value, holds, receipt: receiptOf(`np ${String(a.op)}`, value, holds) }
  },
})

// ---------------------------------------------------------------------------
// qpu_hologram: the signed hologram streams
// ---------------------------------------------------------------------------

let hologram: ReturnType<typeof hologramStreamsOf> | undefined
qpuMcpFuseOf('qpu_hologram', {
  description: "The unit's hologram as signed SHA-256 UUID streams, one per scale, each fragment carrying a Merkle proof to the root: {} for the whole, { scale } for one stream's fragments.",
  inputSchema: { type: 'object', properties: { scale: { type: 'string' } } },
  run: (a) => {
    const h = (hologram ??= hologramStreamsOf())
    const scale = str(a.scale)
    if (scale) return h.streams[scale] ? { kind: 'hologram-scale', scale, root: h.root, publicKey: h.publicKeys[scale], fragments: h.streams[scale], holds: h.holds } : fail('scale', { scales: Object.keys(h.streams) })
    return { kind: h.kind, root: h.root, publicKeys: h.publicKeys, entries: h.entries, scales: Object.fromEntries(Object.entries(h.streams).map(([k, v]) => [k, { length: v.length, head: v.at(-1)?.uuid }])), holds: h.holds }
  },
})
