import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { request as httpsRequest } from 'node:https'
import tls from 'node:tls'
import test from 'node:test'

import { aspects, uuid } from '../../uuid/index.ts'
import { call } from '../mcp.ts'
import { CRYPTO } from './crypto.ts'
import { cryptoHosts } from '../crypto/index.ts'
import { cryptoConfig } from '../crypto/config.ts'
const { qpu: QPU_HOST, cern: CERN_HOST } = cryptoHosts(cryptoConfig())
const fetchText = (url: string, accept: string): Promise<{ status: number; text: string }> => new Promise((resolve) => {
  const u = new URL(url)
  const req = httpsRequest({ hostname: u.hostname, path: `${u.pathname}${u.search}`, method: 'GET', headers: { accept, 'user-agent': 'qpu-crypto-e2e/1.0 (+https://qpu.uuidna.com)' }, timeout: 25000 }, (res) => {
    const chunks: Buffer[] = []
    res.on('data', (c) => chunks.push(c))
    res.on('end', () => resolve({ status: res.statusCode ?? 0, text: Buffer.concat(chunks).toString('utf8') }))
  })
  req.on('error', (e) => resolve({ status: 0, text: String(e) }))
  req.on('timeout', () => { req.destroy(); resolve({ status: 0, text: 'timeout' }) })
  req.end()
})
const readTls = (host: string): Promise<{ notBefore: string; notAfter: string; issuer: string }> => new Promise((resolve, reject) => {
  const socket = tls.connect(443, host, { servername: host }, () => {
    const c = socket.getPeerCertificate()
    socket.end()
    const one = (field: string | string[] | undefined) => (Array.isArray(field) ? field.join(' ') : field)
    const issuer = one(c.issuer?.O) ?? one(c.issuer?.CN) ?? Object.values(c.issuer ?? {}).join(' ')
    resolve({ notBefore: new Date(c.valid_from).toISOString(), notAfter: new Date(c.valid_to).toISOString(), issuer })
  })
  socket.on('error', reject)
})

const invoke = (name: string, args: Record<string, unknown>) => {
  const r = call(name, args)
  if (r.error) throw new Error(`${name}: ${r.error.message}`)
  return r.result!.structuredContent as any
}

const refuse = (name: string, args: Record<string, unknown>, pattern: RegExp) => {
  const r = call(name, args)
  assert.ok(r.error, `${name} should refuse`)
  assert.match(r.error!.message, pattern)
  return r.error!.message
}

const develop = (formula: string, product: string, variant: string) =>
  invoke('payload', { develop: { formula, product, variant, title: `${product} ${variant}` } })

const throughEnd = (developed: any, formula: string) => {
  assert.equal(developed.phase, 'develop')
  assert.equal(developed.via, 'hooks')
  assert.deepEqual(developed.hooks, ['beforeChange', 'afterChange', 'afterRead'])
  assert.equal(developed.iso.documented, true)
  assert.equal(developed.iso.formula, formula)
  assert.equal(developed.docs.text, formula)
  assert.equal(developed.exit.code, 0)
  assert.equal(developed.exit.exited, false)
  assert.equal(developed.exit.closed, true)
  assert.equal(developed.exit.strategy, 'conforming')
  assert.equal(developed.end.complete, true)
  assert.equal(developed.end.fetched, false)
  assert.equal(developed.end.written, false)
  assert.equal(developed.end.next.decision, 'accept')
  assert.equal(developed.end.audit.clause, 'ISO 9001:2015, 9.2')
  assert.equal(developed.end.change.clause, 'ISO 9001:2015, 6.3')
  assert.equal(developed.end.control.clause, 'ISO 9001:2015, 8.1')
  assert.equal(developed.end.release.clause, 'ISO 9001:2015, 8.6')
  assert.equal(developed.end.monitor.clause, 'ISO 9001:2015, 9.1')
}

const witnessed = (tool: string, id: string) => {
  const address = uuid(`crypto\n${tool}\n${id}`)
  const seen = aspects(address)
  assert.equal(seen.all, true)
  assert.equal(seen.aspects.length, 4)
  assert.deepEqual(seen.aspects.map((row) => row.aspect), ['collection', 'global', 'field', 'node'])
  assert.ok(seen.aspects.every((row) => row.address === address))
  return address
}

type Door = {
  tool: 'fold' | 'seal' | 'attest'
  id: string
  args: Record<string, unknown>
  says: string
  ok?: (s: any) => boolean
  pattern?: RegExp
}

const dna = 'ACGTACGTGGCCAATTACGTACGTGGCCAATTACGTACGTGGCCAATTACGTACGTGGCCAATT'
const queneau = Array.from({ length: 14 }, () => 10)
const key = '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f'
const nonce = '000102030405060708090a0b'
const flip = (tag: string) => (parseInt(tag.slice(0, 2), 16) ^ 1).toString(16).padStart(2, '0') + tag.slice(2)
const ledger = Array.from({ length: 40 }, (_, i) => JSON.stringify({ key: `k${String(i).padStart(2, '0')}`, value: i * i, note: 'a row of the ledger' })).join('\n')
const sha512Zeros = createHash('sha512').update(Buffer.alloc(64)).digest('hex').toUpperCase()

/** ISO/IEC/IEEE 29119-3 test case. Identifier: crypto examples replay through the Payload MCP. */
test('crypto examples replay through the Payload MCP', () => {
  assert.ok(CRYPTO.examples.length > 0)
  for (const example of CRYPTO.examples) {
    assert.equal(example.expect(invoke(example.tool, example.arguments)), null, example.id)
  }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every crypto door answers through Payload MCP, develops through the hooks, and is witnessed by the four aspects. */
test('every crypto door answers through Payload MCP, develops through the hooks, and is witnessed by the four aspects', () => {
  const aes = invoke('seal', { aead: { cipher: 'aes-256-gcm', key, nonce, text: 'functional', aad: 'both' } })
  const chacha = invoke('seal', { aead: { cipher: 'chacha20-poly1305', key, nonce, text: 'functional', aad: 'both' } })
  const proof = invoke('seal', { merkle: { leaves: ['a', 'b', 'c'], index: 1 } })
  const coined = invoke('seal', { text: 'qpu' })
  const cut = invoke('fold', { text: 'abcdefgh\nij', bound: 3, withPieces: true })
  const now = 1793005826714
  const beaconLast = JSON.stringify({ pulse: { uri: 'https://beacon.nist.gov/beacon/2.0/chain/2/pulse/2000107', chainIndex: 2, pulseIndex: 2000107, timeStamp: '2026-10-26T09:10:00.000Z', period: 60000, localRandomValue: '00'.repeat(64), outputValue: 'A'.repeat(128), signatureValue: 'B'.repeat(1024), precommitmentValue: 'C'.repeat(128), listValues: [{ type: 'previous', value: 'D'.repeat(128) }] } })
  const beaconPrev = (pc: string) => JSON.stringify({ pulse: { uri: 'https://beacon.nist.gov/beacon/2.0/chain/2/pulse/2000106', chainIndex: 2, pulseIndex: 2000106, timeStamp: '2026-10-26T09:09:00.000Z', period: 60000, localRandomValue: '11'.repeat(64), outputValue: 'D'.repeat(128), signatureValue: 'B'.repeat(1024), precommitmentValue: pc, listValues: [] } })
  const sth = JSON.stringify({ tree_size: 3461480042, timestamp: 1793005826714, sha256_root_hash: 'BUW2/ROzVcSOkLmZvNPkf3njsT5E2kno4MriPzOPWaU=', tree_head_signature: 'x' })
  const nvd = JSON.stringify({ vulnerabilities: [{ cve: { id: 'CVE-2024-37880', published: '2024-06-10T02:15:47.160', lastModified: '2026-06-17T07:38:58.583', metrics: { cvssMetricV31: [{ cvssData: { baseScore: 7.5 } }] } } }] })
  const cern = JSON.stringify({ hits: { total: 5566, hits: [{ id: '5209', metadata: { title: 'Higgs to two photons from 2011', files: [{ size: 869, checksum: 'adler32:dca4af81' }], relations: [{ doi: '10.7483/OPENDATA.CMS.N9MJ.QEEC' }] } }] } })
  const table = "  2022 CODATA adjustment\n\n  Quantity                                                       Value                 Uncertainty           Unit\n-----------------------------------------------------------------------------------------------------------------------------\nNewtonian constant of gravitation                           6.674 30 e-11            0.000 15 e-11            m^3 kg^-1 s^-2\nPlanck constant                                             6.626 070 15 e-34        (exact)                  J Hz^-1\n"

  const doors: Door[] = [
    { tool: 'fold', id: 'unlimited', args: {}, says: 'no params stays unlimited at 432 Hz', ok: (s) => s.phase === 'unlimited' && s.hz === 432 && s.bounded === false },
    { tool: 'fold', id: 'proven', args: { proven: true }, says: 'the proven 1000-bit surface holds', ok: (s) => s.phase === 'qpu-crypto-1000-bit' && s.verified === true && s.sealed === true && s.reflect1000Bit.reflections === 14 },
    { tool: 'fold', id: 'integers', args: { integers: ['15', '15', '-15', '12a', 'hello', ''] }, says: 'six pastes meet at one sealed address', ok: (s) => s.phase === 'singularity' && s.cases === 6 && s.collapsed === 1 && s.sealed === true },
    { tool: 'fold', id: 'split', args: { split: '017f22e2-79b0-7cc3-98c4-dc0c0c07398f' }, says: 'version 7 splits into 48 bits of time and 74 of space', ok: (s) => s.phase === 'split' && s.version === 7 && s.timeBits === 48 && s.spaceBits === 74 },
    { tool: 'fold', id: 'dna', args: { dna }, says: '64 bases encode as one UUID and read back', ok: (s) => s.phase === 'dna' && s.bases === 64 && s.roundTrips === true },
    { tool: 'fold', id: 'dna-decode', args: { dna: { hex: '1b1ba50f1b1ba50f1b1ba50f1b1ba50f' } }, says: '32 nibbles decode to 64 bases', ok: (s) => s.phase === 'dna' && s.decode === true && s.count === 64 },
    { tool: 'fold', id: 'reflect', args: { reflect: '0xdeadbeef' }, says: 'the reflective cut rebuilds the integer', ok: (s) => s.phase === 'reflect' && s.exact === true },
    { tool: 'fold', id: 'speak', args: { speak: 'f0a5' }, says: 'the hex speaks and reads back', ok: (s) => s.phase === 'speak' && s.read === 'f0a5' && s.roundTrip === true },
    { tool: 'fold', id: 'speak-thousand', args: { speak: { bits: 1000 } }, says: 'the thousand-bit width is spoken and the integer is not written', ok: (s) => s.phase === 'glagolitic' && s.understood === 1000 && s.materialised === false },
    { tool: 'fold', id: 'combinatorics', args: { combinatorics: true }, says: 'the greatest count is 10^14 and no composition is stored', ok: (s) => s.phase === 'combinatorics' && s.best === 'queneau' && s.count === '100000000000000' },
    { tool: 'fold', id: 'decode', args: { decode: { radices: queneau, address: '42-00000000000042' } }, says: 'the address decodes in 14 steps', ok: (s) => s.phase === 'decoded' && s.method === 'algebraic' && s.agrees === true },
    { tool: 'fold', id: 'decode-one-way', args: { decode: { radices: queneau, uuid: '941ef62e-d97b-2438-bfc8-22ae9e5da781' } }, says: 'a content address is refused and no candidate is tried', ok: (s) => s.phase === 'refused' && s.decodable === false && s.court.rule === 'search' },
    { tool: 'fold', id: 'harmonic', args: { harmonic: { schema: { properties: { style: { enum: ['nova', 'lyra', 'maia'] }, theme: { enum: ['neutral', 'stone', 'zinc', 'gray'] }, radius: { enum: ['0', '0.3', '0.5', '0.75', '1'] } } } } }, says: 'sixty combinations held at once as a harmonic superposition', ok: (s) => s.phase === 'harmonic' && s.combinations === '60' && s.from === 'a432' },
    { tool: 'fold', id: 'rosetta', args: { rosetta: [6, 7], index: '20' }, says: '6×7 and 7×6 are one scale of forty-two read two ways', ok: (s) => s.phase === 'rosetta' && s.scale === '42' && s.covers === true && s.to === '38' },
    { tool: 'fold', id: 'hex', args: { hex: '941ef62e-d97b-2438-bfc8-22ae9e5da781' }, says: 'thirty-two nibbles present as a shadcn combination', ok: (s) => s.phase === 'presented' && s.nibbles === 32 },
    { tool: 'fold', id: 'stream', args: { uuids: ['941ef62e-d97b-2438-bfc8-22ae9e5da781', '016da774-e74c-2e44-8742-f8bcf5e8e8f5', '00000000-0000-1000-8000-000000000000'], query: { where: { nibble: { at: 1, is: '0' } }, sort: 'hue', execute: true } }, says: 'a UUID stream filters to one address without storing the space', ok: (s) => s.phase === 'streamed' && s.filtered === 1 && s.rows[0].uuid === '00000000-0000-1000-8000-000000000000' },
    { tool: 'fold', id: 'neighbours', args: { neighbours: '941ef62e-d97b-2438-bfc8-22ae9e5da781' }, says: 'six program-space neighbours are sealed leads', ok: (s) => s.phase === 'neighbours' && s.neighbours.length === 6 && s.neighbours.every((n: { sealed: boolean }) => n.sealed) },
    { tool: 'fold', id: 'navigate', args: { navigate: '941ef62e-d97b-2438-bfc8-22ae9e5da781' }, says: 'the team is the six neighbours and their stream', ok: (s) => s.phase === 'navigate' && s.neighbours.length === 6 && s.stream.stream === 7 },
    { tool: 'fold', id: 'next', args: { next: '941ef62e-d97b-2438-bfc8-22ae9e5da781' }, says: 'the program rotates one place and ten rotations return it', ok: (s) => s.phase === 'next' && s.places === 10 && /^[0-9a-f-]{36}$/.test(s.next) },
    { tool: 'fold', id: 'qubits', args: { qubits: 4 }, says: 'the register delivers six sealed neighbour leads', ok: (s) => s.phase === 'qubits' && s.delivery.holds === true && s.delivery.leads.length === 6 },
    { tool: 'fold', id: 'exchange', args: { exchange: { address: '941ef62e-d97b-2438-bfc8-22ae9e5da781', hexbit: 4 } }, says: 'qubit exchange navigates six directions and holds its receipt', ok: (s) => s.phase === 'hexbit' && s.navigate.directions === 6 && s.receipt.holds === true },
    { tool: 'fold', id: 'organise', args: { organise: { address: '941ef62e-d97b-2438-bfc8-22ae9e5da781', hexbit: 4 } }, says: 'qubits organised by trinity hold', ok: (s) => s.phase === 'organise' && s.holds === true },
    { tool: 'fold', id: 'coins', args: { coins: ['941ef62e-d97b-2438-bfc8-22ae9e5da781', 'rodin', '941ef62e-d97b-2438-bfc8-22ae9e5da781'] }, says: 'repeated addresses merge to two coins', ok: (s) => s.phase === 'coins' && s.count === 2 },
    { tool: 'fold', id: 'superpositions', args: { superpositions: true }, says: 'every UUID superposition holds at once and nothing is walked', ok: (s) => s.phase === 'superpositions' && s.holds === true && s.superpositions === 12 && s.walked === false },
    { tool: 'fold', id: 'superpositions-reverse', args: { superpositions: { reverse: true } }, says: 'every UUID superposition reverses to the program it started from', ok: (s) => s.phase === 'superpositions-reverse' && s.holds === true && s.reversed === 12 && s.walked === false },
    { tool: 'fold', id: 'folded', args: { text: ledger, bound: 600, key: 'k27' }, says: 'k27 names its piece and each piece mirrors across the fold', ok: (s) => s.phase === 'folded' && s.fits === false && !!s.located },
    { tool: 'fold', id: 'unfold', args: { pieces: (cut.pieces as { index: number; text: string }[]).map((p) => ({ index: p.index, text: p.text })), withPieces: true }, says: 'the pieces join back to the text they were cut from', ok: (s) => s.phase === 'unfolded' && s.whole === 'abcdefgh\nij' },
    { tool: 'seal', id: 'unlimited', args: {}, says: 'no params stays unlimited at 432 Hz', ok: (s) => s.phase === 'unlimited' && s.hz === 432 },
    { tool: 'seal', id: 'text', args: { text: 'qpu', key: 'test' }, says: 'SHA-256, HMAC and the fold address of one text', ok: (s) => s.sha256.length === 64 && s.hmac.length === 64 && s.bytes === 3 },
    { tool: 'seal', id: 'sha3', args: { text: 'qpu', sha3: true }, says: 'SHA3-256 and SHA3-512 sit beside SHA-256', ok: (s) => /^[0-9a-f]{64}$/.test(s.sha3_256) && /^[0-9a-f]{128}$/.test(s.sha3_512) },
    { tool: 'seal', id: 'shake', args: { text: 'nist', shake: true }, says: 'SHAKE128 reads 32 bytes and SHAKE256 reads 64', ok: (s) => s.phase === 'shake' && s.shake128.length === 64 && s.shake256.length === 128 },
    { tool: 'seal', id: 'aes-256-gcm', args: { aead: { cipher: 'aes-256-gcm', key, nonce, text: 'functional', aad: 'both' } }, says: 'aes-256-gcm seals to its known ciphertext and tag', ok: (s) => s.phase === 'aead' && s.ciphertext === '2177b878b18cad75ec2d' && s.tag === '4dc07b9416cccdb5d7262a5b3cbe6bac' },
    { tool: 'seal', id: 'aes-256-gcm-open', args: { aead: { cipher: 'aes-256-gcm', key, nonce, aad: 'both', open: { ciphertext: aes.ciphertext, tag: aes.tag } } }, says: 'aes-256-gcm opens the text it sealed', ok: (s) => s.verified === true && s.text === 'functional' },
    { tool: 'seal', id: 'aes-256-gcm-flipped', args: { aead: { cipher: 'aes-256-gcm', key, nonce, aad: 'both', open: { ciphertext: aes.ciphertext, tag: flip(aes.tag) } } }, says: 'a flipped aes-256-gcm tag opens nothing', ok: (s) => s.verified === false && s.text === null },
    { tool: 'seal', id: 'chacha20-poly1305', args: { aead: { cipher: 'chacha20-poly1305', key, nonce, text: 'functional', aad: 'both' } }, says: 'chacha20-poly1305 seals to its known ciphertext and tag', ok: (s) => s.ciphertext === 'ef8e66635d7eca2ed6ef' && s.tag === '21b44daa0c7f4690ddd98fdec07c6956' },
    { tool: 'seal', id: 'chacha20-poly1305-open', args: { aead: { cipher: 'chacha20-poly1305', key, nonce, aad: 'both', open: { ciphertext: chacha.ciphertext, tag: chacha.tag } } }, says: 'chacha20-poly1305 opens the text it sealed', ok: (s) => s.verified === true && s.text === 'functional' },
    { tool: 'seal', id: 'aead-short-key', args: { aead: { cipher: 'aes-256-gcm', key: '00'.repeat(16), nonce, text: 'functional' } }, says: 'a 16-byte AES key is refused', pattern: /32 bytes/ },
    { tool: 'seal', id: 'x25519', args: { x25519: { scalar: '77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a', point: 'de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b4f' } }, says: 'X25519 matches the RFC 7748 Alice×Bob vector', ok: (s) => s.phase === 'x25519' && s.shared === '4a5d9d5ba4ce2de1728e3bf480350f25e07e21c947d19e3376f09b3c1e161742' },
    { tool: 'seal', id: 'x25519-short', args: { x25519: { scalar: '00'.repeat(16), point: '00'.repeat(32) } }, says: 'a short X25519 scalar is refused', pattern: /32 bytes/ },
    { tool: 'seal', id: 'pbkdf2', args: { pbkdf2: { password: 'password', salt: 'salt', iterations: 1, length: 32 } }, says: 'PBKDF2-SHA256 matches its one-iteration vector', ok: (s) => s.derived === '120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b' },
    { tool: 'seal', id: 'pbkdf2-iterations', args: { pbkdf2: { password: 'password', salt: 'salt', iterations: 0 } }, says: 'zero PBKDF2 iterations are refused', pattern: /positive integer/ },
    { tool: 'seal', id: 'merkle-root', args: { merkle: { leaves: ['a', 'b', 'c'] } }, says: 'three leaves make one RFC 6962 root', ok: (s) => s.root === '36642e73c2540ab121e3a6bf9545b0a24982cd830eb13d3cd19de3ce6c021ec1' },
    { tool: 'seal', id: 'merkle-empty', args: { merkle: { leaves: [] } }, says: 'an empty tree is SHA-256()', ok: (s) => s.empty === true && s.root === 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { tool: 'seal', id: 'merkle-proof', args: { merkle: { leaves: ['a', 'b', 'c'], index: 1 } }, says: 'leaf 1 proves its inclusion', ok: (s) => s.verified === true && s.proof.length === 2 },
    { tool: 'seal', id: 'merkle-verify', args: { merkle: { leaf: 'b', proof: proof.proof, root: proof.root } }, says: 'the proof verifies against the root', ok: (s) => s.direction === 'verify' && s.verified === true },
    { tool: 'seal', id: 'merkle-tampered', args: { merkle: { leaf: 'x', proof: proof.proof, root: proof.root } }, says: 'a different leaf fails the proof', ok: (s) => s.verified === false },
    { tool: 'seal', id: 'fips180', args: { text: 'nist', fips180: true }, says: 'FIPS 180-4 digests of one text', ok: (s) => s.phase === 'fips180' && s.sha1.length === 40 && s.sha256.length === 64 && s.sha512.length === 128 },
    { tool: 'seal', id: 'kem-ML-KEM-512', args: { kem: 'ML-KEM-512' }, says: 'ML-KEM-512 names its sizes and stays on the host', ok: (s) => s.phase === 'kem' && s.plan.algorithm === 'ML-KEM-512' && s.plan.fips === 203 && s.plan.sizes.ciphertext === 768 },
    { tool: 'seal', id: 'kem-ML-KEM-768', args: { kem: 'ML-KEM-768' }, says: 'ML-KEM-768 names its sizes and stays on the host', ok: (s) => s.phase === 'kem' && s.plan.fips === 203 && s.plan.sizes.sharedSecret === 32 },
    { tool: 'seal', id: 'kem-ML-KEM-1024', args: { kem: 'ML-KEM-1024' }, says: 'ML-KEM-1024 names its sizes and stays on the host', ok: (s) => s.phase === 'kem' && s.plan.algorithm === 'ML-KEM-1024' && s.plan.sizes.encapsulationKey === 1568 },
    { tool: 'seal', id: 'kem-refused', args: { kem: 'RSA' }, says: 'a name outside FIPS 203 is refused', pattern: /FIPS 203/ },
    { tool: 'seal', id: 'slh-SLH-DSA-SHA2-128s', args: { slh: 'SLH-DSA-SHA2-128s' }, says: 'SLH-DSA-SHA2-128s names its public key and signature', ok: (s) => s.plan.fips === 205 && s.plan.sizes.signature === 7856 },
    { tool: 'seal', id: 'slh-SLH-DSA-SHA2-128f', args: { slh: 'SLH-DSA-SHA2-128f' }, says: 'SLH-DSA-SHA2-128f names its public key and signature', ok: (s) => s.plan.algorithm === 'SLH-DSA-SHA2-128f' && s.plan.sizes.signature === 17088 },
    { tool: 'seal', id: 'slh-SLH-DSA-SHA2-192s', args: { slh: 'SLH-DSA-SHA2-192s' }, says: 'SLH-DSA-SHA2-192s names its public key and signature', ok: (s) => s.plan.algorithm === 'SLH-DSA-SHA2-192s' && s.plan.sizes.publicKey === 48 },
    { tool: 'seal', id: 'slh-SLH-DSA-SHA2-256s', args: { slh: 'SLH-DSA-SHA2-256s' }, says: 'SLH-DSA-SHA2-256s names its public key and signature', ok: (s) => s.plan.algorithm === 'SLH-DSA-SHA2-256s' && s.plan.sizes.signature === 29792 },
    { tool: 'seal', id: 'slh-refused', args: { slh: 'RSA' }, says: 'a name outside FIPS 205 is refused', pattern: /FIPS 205/ },
    { tool: 'seal', id: 'ed25519', args: { ed25519: 'nist' }, says: 'Ed25519 names a 32-byte key and a 64-byte signature', ok: (s) => s.plan.rfc === 8032 && s.plan.sizes.signature === 64 },
    { tool: 'seal', id: 'ecdsa', args: { text: 'nist', ecdsa: true }, says: 'ECDSA P-256 signs the SHA-256 of the text', ok: (s) => s.ecdsa.curve === 'P-256' && s.ecdsa.message === s.sha256 },
    { tool: 'seal', id: 'sign-ML-DSA-44', args: { text: 'qpu', sign: 'ML-DSA-44' }, says: 'ML-DSA-44 plans a signature over the digest', ok: (s) => s.signature.algorithm === 'ML-DSA-44' && s.signature.sizes.signature === 2420 },
    { tool: 'seal', id: 'sign-ML-DSA-65', args: { text: 'qpu', sign: 'ML-DSA-65' }, says: 'ML-DSA-65 plans a signature over the digest', ok: (s) => s.signature.fips === 204 && s.signature.executedBy === 'host' },
    { tool: 'seal', id: 'sign-ML-DSA-87', args: { text: 'qpu', sign: 'ML-DSA-87' }, says: 'ML-DSA-87 plans a signature over the digest', ok: (s) => s.signature.algorithm === 'ML-DSA-87' && s.signature.sizes.publicKey === 2592 },
    { tool: 'seal', id: 'sign-refused', args: { text: 'qpu', sign: 'RSA' }, says: 'a name outside FIPS 204 is refused', pattern: /FIPS 204/ },
    { tool: 'seal', id: 'nist', args: { nist: true }, says: 'every NIST scenario is named for qpu.uuidna.com and nothing is fetched', ok: (s) => s.phase === 'nist' && s.host === QPU_HOST && s.holds === true && s.fetched === false && s.scenarios.length >= 20 },
    { tool: 'seal', id: 'nist-reverse-cern', args: { nist: { reverse: true, via: 'cern' } }, says: 'every NIST scenario reverses via CERN and nothing is fetched', ok: (s) => s.phase === 'nist-reverse' && s.via === 'cern' && s.host === CERN_HOST && s.holds === true && s.requests[0]?.id === 'cern-opendata' && s.scenarios.every((row: { returns: boolean }) => row.returns) },
    { tool: 'attest', id: 'experience-cern', args: { op: 'experience', cern: { hits: { total: 1, hits: [{ id: '5209', metadata: { title: 'Higgs to two photons from 2011', relations: [{ doi: '10.7483/OPENDATA.CMS.N9MJ.QEEC' }] } }] } } }, says: 'one CERN record is sealed and its DOI well formed', ok: (s) => s.phase === 'experience' && s.source === 'cern-opendata' && s.holds === true && s.rows[0].sealed === true },
    { tool: 'seal', id: 'referer', args: { text: 'qpu', key: 'test', referer: { address: '941ef62e-d97b-2438-bfc8-22ae9e5da781', chunks: 3 } }, says: 'three seeds bind to the referer and the referer adds no bits', ok: (s) => s.derivation.seeds.length === 3 && s.derivation.entropy.refererBits === 0 },
    { tool: 'seal', id: 'tamper-authentic', args: { text: 'qpu', tamper: { text: 'qpu', address: coined.address, sha256: coined.sha256 } }, says: 'the same text, address and digest are authentic', ok: (s) => s.verdict === 'authentic' && s.court === null },
    { tool: 'seal', id: 'tamper-forged', args: { text: 'qpu', tamper: { text: 'qpu', address: coined.address, sha256: '00'.repeat(32) } }, says: 'a matching address with a different digest is forged', ok: (s) => s.verdict === 'forged' && s.court.rule === 'integrity' },
    { tool: 'seal', id: 'constants-request', args: { constants: true }, says: 'CODATA is named and not fetched', ok: (s) => s.phase === 'requests' && s.requestList.length === 1 },
    { tool: 'seal', id: 'constants-table', args: { constants: { text: table } }, says: 'one measured constant and one exact constant, each sealed', ok: (s) => s.phase === 'sealed' && s.exact === 1 && s.measured === 1 },
    { tool: 'attest', id: 'default', args: {}, says: 'an empty call plans the seventeen theorems and four hosts', ok: (s) => s.op === 'plan' && s.theorems.length === 17 && s.liveCertificates.length === 4 },
    { tool: 'attest', id: 'read-follow', args: { op: 'read', now, answers: [{ id: 'nist-beacon', text: beaconLast }, { id: 'ct-sth', text: sth }, { id: 'nvd-cves', text: nvd }, { id: 'cern-opendata', text: cern }, { id: 'tls:qpu.uuidna.com', text: JSON.stringify({ notBefore: '2026-09-09T03:31:22Z', notAfter: '2026-12-08T04:31:19Z', issuer: 'Google Trust Services WE1' }) }] }, says: 'the beacon asks for its previous pulse', ok: (s) => s.violations.length === 0 && s.followUps[0]?.id === 'nist-beacon-previous' },
    { tool: 'attest', id: 'read-chain', args: { op: 'read', now, answers: [{ id: 'nist-beacon', text: beaconLast }, { id: 'nist-beacon-previous', text: beaconPrev(sha512Zeros) }, { id: 'ct-sth', text: sth }, { id: 'acme-directory', text: JSON.stringify({ newNonce: 'u', newAccount: 'u', newOrder: 'u', revokeCert: 'u', keyChange: 'u' }) }, { id: 'nvd-cves', text: nvd }, { id: 'cern-opendata', text: cern }, { id: 'csrc-pqc', text: 'FIPS 203 FIPS 204 FIPS 205' }, { id: 'tls:qpu.uuidna.com', text: JSON.stringify({ notBefore: '2026-09-09T03:31:22Z', notAfter: '2026-12-08T04:31:19Z', issuer: 'WE1' }) }] }, says: 'the chain holds and a source that was not handed stays absent', ok: (s) => s.violations.length === 0 && s.followUps.length === 0 && s.sources['crt-sh'].status === 'absent' },
    { tool: 'attest', id: 'experience-record', args: { op: 'experience', nist: { ResultCount: 1, ResultData: [{ title: 'NIST Chemistry WebBook', doi: 'doi:10.18434/T4D303' }] } }, says: 'one record is sealed and its DOI well formed', ok: (s) => s.phase === 'experience' && s.holds === true && s.rows[0].sealed === true },
  ]

  for (const door of doors) {
    if (door.pattern) {
      refuse(door.tool, door.args, door.pattern)
    } else {
      const answer = invoke(door.tool, door.args)
      assert.equal(door.ok!(answer), true, `${door.tool}:${door.id}`)
    }
    const developed = develop(door.says, door.tool, door.id)
    throughEnd(developed, door.says)
    witnessed(door.tool, door.id)
  }
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every UUID superposition holds through fold and develops through the hooks. */
test('every UUID superposition holds through fold and develops through the hooks', () => {
  const plan = invoke('fold', { superpositions: true })
  assert.equal(plan.phase, 'superpositions')
  assert.equal(plan.holds, true)
  assert.equal(plan.fetched, false)
  assert.equal(plan.written, false)
  assert.equal(plan.walked, false)
  assert.equal(plan.superpositions, 12)
  assert.equal(plan.neighbours, 6)
  assert.equal(plan.qubits.leads, 6)

  for (const row of plan.scenarios) {
    const answer = invoke(row.tool, row.arguments)
    if (row.id === 'neighbours') assert.equal(answer.neighbours.length, 6)
    else if (row.id === 'navigate') assert.equal(answer.neighbours.length, 6)
    else if (row.id === 'next') assert.equal(answer.places, 10)
    else if (row.id === 'harmonic') assert.equal(answer.combinations, '60')
    else if (row.id === 'stream') assert.equal(answer.filtered, 1)
    else if (row.id === 'rosetta') assert.equal(answer.scale, '42')
    else if (row.id === 'combinatorics') assert.equal(answer.best, 'queneau')
    else if (row.id === 'spaces') assert.equal(answer.spaces.length, 6)
    else if (row.id === 'qubits') assert.equal(answer.delivery.leads.length, 6)
    else if (row.id === 'exchange') assert.equal(answer.receipt.holds, true)
    else if (row.id === 'organise') assert.equal(answer.holds, true)
    else if (row.id === 'coins') assert.equal(answer.count, 2)
    else assert.fail(`uncovered superposition ${row.id}`)
  }

  const developed = develop(plan.says, 'fold', 'superpositions')
  throughEnd(developed, plan.says)
  witnessed('fold', 'superpositions')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every UUID superposition reverses through fold and develops through the hooks. */
test('every UUID superposition reverses through fold and develops through the hooks', () => {
  const plan = invoke('fold', { superpositions: { reverse: true } })
  assert.equal(plan.phase, 'superpositions-reverse')
  assert.equal(plan.direction, 'reverse')
  assert.equal(plan.holds, true)
  assert.equal(plan.fetched, false)
  assert.equal(plan.written, false)
  assert.equal(plan.walked, false)
  assert.equal(plan.superpositions, 12)
  assert.equal(plan.reversed, 12)
  assert.ok(plan.scenarios.every((row: { returns: boolean }) => row.returns))
  assert.ok(plan.neighbours.every((row: { returns: boolean; sealed: boolean }) => row.returns && row.sealed))

  const developed = develop(plan.says, 'fold', 'superpositions-reverse')
  throughEnd(developed, plan.says)
  witnessed('fold', 'superpositions-reverse')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the crypto toolbox selftest replays every crypto example through Payload MCP. */
test('the crypto toolbox selftest replays every crypto example through Payload MCP', () => {
  const s = invoke('seal', { selftest: true })
  assert.equal(s.selftest, true)
  assert.equal(s.passed, true)
  assert.ok(s.checks.length >= CRYPTO.examples.length)
  assert.ok(s.checks.every((c: { passed: boolean }) => c.passed))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every NIST scenario runs locally, then e2e against qpu.uuidna.com fetches the planned NIST APIs and its live TLS certificate. */
test('every NIST scenario holds locally and e2e against qpu.uuidna.com', async () => {
  const plan = invoke('seal', { nist: true })
  assert.equal(plan.phase, 'nist')
  assert.equal(plan.host, QPU_HOST)
  assert.equal(plan.holds, true)
  assert.equal(plan.fetched, false)
  assert.equal(plan.written, false)

  const local = plan.scenarios.filter((row: { request?: unknown; live?: unknown }) => !row.request && !row.live)
  assert.ok(local.length >= 14, `expected local FIPS doors, got ${local.length}`)
  for (const row of local) {
    if (row.id === 'attest-plan') {
      const attest = invoke('attest', row.arguments)
      assert.equal(attest.op, 'plan')
      assert.ok(attest.liveCertificates.some((c: { host: string }) => c.host === QPU_HOST))
      continue
    }
    const answer = invoke(row.tool, row.arguments)
    if (row.id.startsWith('fips-203-')) assert.equal(answer.plan.fips, 203)
    else if (row.id.startsWith('fips-204-')) assert.equal(answer.signature.fips, 204)
    else if (row.id.startsWith('fips-205-')) assert.equal(answer.plan.fips, 205)
    else if (row.id === 'fips-180-4') assert.equal(answer.phase, 'fips180')
    else if (row.id === 'fips-202-shake') assert.equal(answer.phase, 'shake')
    else if (row.id === 'sp-800-132-pbkdf2') assert.equal(answer.derived, '120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b')
    else if (row.id === 'sp-800-38d-aes-gcm') assert.equal(answer.ciphertext, '2177b878b18cad75ec2d')
    else if (row.id === 'codata') assert.equal(answer.phase, 'requests')
    else if (row.id === 'nist-opendata') assert.equal(answer.phase, 'requests')
  }

  const developed = develop(plan.says, 'seal', 'nist-e2e')
  throughEnd(developed, plan.says)
  witnessed('seal', 'nist-e2e')

  const attestPlan = invoke('attest', { op: 'plan', hosts: [QPU_HOST] })
  assert.equal(attestPlan.op, 'plan')
  assert.ok(attestPlan.requests.length >= 6)
  assert.ok(attestPlan.liveCertificates.some((c: { host: string }) => c.host === QPU_HOST))

  const answers: { id: string; text: string; status: number }[] = []
  for (const req of attestPlan.requests as { id: string; url: string; accept: string }[]) {
    const got = await fetchText(req.url, req.accept)
    answers.push({ id: req.id, text: got.text, status: got.status })
  }
  const cert = await readTls(QPU_HOST)
  answers.push({ id: `tls:${QPU_HOST}`, text: JSON.stringify(cert), status: 200 })
  const now = Date.now()

  let read = invoke('attest', { op: 'read', now, answers })
  assert.equal(read.op, 'read')
  assert.ok(read.sources['nist-beacon']?.status === 'read' || read.sources['nist-beacon']?.status === 'unreadable')
  assert.ok(read.sources['csrc-pqc']?.status === 'read' || read.sources['csrc-pqc']?.status === 'unreadable')
  assert.ok(read.sources['tls-live']?.status === 'read')
  assert.equal(read.sources['tls-live'].verdicts.every((v: { passed: boolean }) => v.passed), true, JSON.stringify(read.sources['tls-live'].verdicts))

  if (read.followUps?.length) {
    for (const follow of read.followUps as { id: string; url: string; accept: string }[]) {
      const got = await fetchText(follow.url, follow.accept)
      answers.push({ id: follow.id, text: got.text, status: got.status })
    }
    read = invoke('attest', { op: 'read', now, answers })
    assert.equal(read.followUps.length, 0)
    if (answers.find((a) => a.id === 'nist-beacon')?.status === 200 && answers.find((a) => a.id === 'nist-beacon-previous')?.status === 200) {
      assert.equal(read.sources['nist-beacon'].status, 'read')
      assert.equal(read.sources['nist-beacon'].verdicts.every((v: { passed: boolean }) => v.passed), true, JSON.stringify(read.sources['nist-beacon'].verdicts))
    }
  }

  const open = invoke('attest', { op: 'experience', nist: true })
  assert.equal(open.phase, 'requests')
  const openBody = await fetchText(open.request.url, open.request.accept)
  assert.equal(openBody.status, 200)
  const experienced = invoke('attest', { op: 'experience', nist: JSON.parse(openBody.text) })
  assert.equal(experienced.phase, 'experience')
  assert.equal(experienced.holds, true)
  assert.ok(experienced.records >= 1)

  const codataPlan = invoke('seal', { constants: true })
  const codata = await fetchText(codataPlan.requestList[0].url, 'text/plain')
  assert.equal(codata.status, 200)
  const sealed = invoke('seal', { constants: { text: codata.text } })
  assert.equal(sealed.phase, 'sealed')
  assert.ok(sealed.constants.length > 0)
  assert.ok(sealed.exact + sealed.measured === sealed.constants.length)

  const pages = await fetchText(`https://${QPU_HOST}/api/pages?limit=1`, 'application/json')
  assert.equal(pages.status, 200)
  assert.ok(JSON.parse(pages.text).docs?.length >= 1)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every NIST scenario reverses via CERN, then e2e against opendata.cern.ch fetches CERN first and its live TLS certificate. */
test('every NIST scenario reverses via CERN and e2e against opendata.cern.ch', async () => {
  const plan = invoke('seal', { nist: { reverse: true, via: 'cern' } })
  assert.equal(plan.phase, 'nist-reverse')
  assert.equal(plan.direction, 'reverse')
  assert.equal(plan.via, 'cern')
  assert.equal(plan.host, CERN_HOST)
  assert.equal(plan.holds, true)
  assert.equal(plan.fetched, false)
  assert.equal(plan.written, false)
  assert.ok(plan.scenarios.every((row: { returns: boolean }) => row.returns))
  assert.equal(plan.requests[0]?.id, 'cern-opendata')
  assert.ok(plan.liveCertificates.some((c: { host: string }) => c.host === CERN_HOST))

  for (const row of plan.scenarios.filter((s: { id?: string; tool?: string; arguments?: unknown; request?: unknown; live?: unknown }) => s.tool && s.arguments && !s.request && !s.live && s.id !== 'attest-plan')) {
    const answer = invoke(row.tool, row.arguments)
    if (row.id === 'sp-800-38d-aes-gcm') assert.equal(answer.verified === true && answer.text === 'functional', true)
    else if (row.id === 'rfc-6962-merkle') assert.equal(answer.verified, true)
    else if (row.id === 'fips-180-4') assert.equal(answer.phase, 'fips180')
    else if (row.id.startsWith('fips-203-')) assert.equal(answer.plan.fips, 203)
    else if (row.id.startsWith('fips-204-')) assert.equal(answer.signature.fips, 204)
    else if (row.id.startsWith('fips-205-')) assert.equal(answer.plan.fips, 205)
  }

  const developed = develop(plan.says, 'seal', 'nist-reverse-cern')
  throughEnd(developed, plan.says)
  witnessed('seal', 'nist-reverse-cern')

  const cernReq = plan.requests.find((r: { id: string }) => r.id === 'cern-opendata')
  assert.ok(cernReq)
  const cernBody = await fetchText(cernReq.url, cernReq.accept)
  assert.equal(cernBody.status, 200)
  const experienced = invoke('attest', { op: 'experience', cern: JSON.parse(cernBody.text) })
  assert.equal(experienced.phase, 'experience')
  assert.equal(experienced.source, 'cern-opendata')
  assert.equal(experienced.holds, true)
  assert.ok(experienced.records >= 1)

  const answers: { id: string; text: string; status: number }[] = [{ id: 'cern-opendata', text: cernBody.text, status: cernBody.status }]
  for (const req of (plan.requests as { id: string; url: string; accept: string }[]).filter((r) => r.id !== 'cern-opendata' && r.id !== 'codata')) {
    const got = await fetchText(req.url, req.accept)
    answers.push({ id: req.id, text: got.text, status: got.status })
  }
  const cert = await readTls(CERN_HOST)
  answers.push({ id: `tls:${CERN_HOST}`, text: JSON.stringify(cert), status: 200 })
  const now = Date.now()

  let read = invoke('attest', { op: 'read', now, answers })
  assert.equal(read.op, 'read')
  assert.ok(read.sources['cern-opendata']?.status === 'read' || read.sources['cern-opendata']?.status === 'unreadable')
  assert.ok(read.sources['tls-live']?.status === 'read')
  assert.equal(read.sources['tls-live'].verdicts.every((v: { passed: boolean }) => v.passed), true, JSON.stringify(read.sources['tls-live'].verdicts))
  if (answers.find((a) => a.id === 'cern-opendata')?.status === 200) {
    assert.equal(read.sources['cern-opendata'].status, 'read')
    assert.equal(read.sources['cern-opendata'].verdicts.every((v: { passed: boolean }) => v.passed), true, JSON.stringify(read.sources['cern-opendata'].verdicts))
  }

  if (read.followUps?.length) {
    for (const follow of read.followUps as { id: string; url: string; accept: string }[]) {
      const got = await fetchText(follow.url, follow.accept)
      answers.push({ id: follow.id, text: got.text, status: got.status })
    }
    read = invoke('attest', { op: 'read', now, answers })
    assert.equal(read.followUps.length, 0)
  }
})
