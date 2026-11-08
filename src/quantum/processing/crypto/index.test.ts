import assert from 'node:assert/strict'
import test from 'node:test'
// physics is only a UUID program: the handler binds it by loading the programs, and each test file runs in its own process, so this one loads them too
import '../../uuid/programs/index.ts'

import {
  crypto1000Bit,
  uuidSuperpositions,
  uuidSuperpositionsReverse,
  nistScenarios,
  nistScenariosReverse,
  nistOpenData,
  cernOpenData,
  attestAnswers,
  aead,
  merkleTree,
  derivePbkdf2,
  planEncapsulation,
  planSlhDsa,
  planSignature,
  planEcdsaP256,
  cryptoHosts,
  processorsForRole,
  BEACON_LAST,
  STH,
  NVD,
  CERN,
} from './index.ts'
import { cryptoConfig } from './config.ts'
import { sha256 as sha256Bytes, utf8, hex } from '../unit/hmac.ts'

const digest = (text: string) => hex(sha256Bytes(utf8(text)))
const cfg = () => cryptoConfig()
const hosts = () => cryptoHosts(cfg())
const QPU_HOST = () => hosts().qpu
const CERN_HOST = () => hosts().cern
const ATTEST_HOSTS = () => hosts().attest
const WEBCRYPTO_FLAG = () => cfg().postQuantum.workers.flag

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the proven 1000-bit cryptographic surface holds. */
test('the proven 1000-bit cryptographic surface holds', () => {
  const s = crypto1000Bit()
  assert.equal(s.phase, 'qpu-crypto-1000-bit')
  assert.equal(s.verified, true)
  assert.equal(s.sealed, true)
  assert.equal(s.reflect1000Bit.bits, 1000)
  assert.equal(s.reflect1000Bit.reflections, 14)
  assert.equal(s.reflect1000Bit.exact, true)
  assert.equal(s.sigmaTrapdoor1000Bit.bits, 1000)
  assert.equal(s.sigmaTrapdoor1000Bit.decoded, true)
  assert.equal(s.dnaCrossEncryption.roundTrips, true)
  assert.equal(s.glagolitic1000.roundTrip, true)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every UUID superposition holds without walking. */
test('every UUID superposition holds without walking', () => {
  const s = uuidSuperpositions()
  assert.equal(s.phase, 'superpositions')
  assert.equal(s.holds, true)
  assert.equal(s.fetched, false)
  assert.equal(s.walked, false)
  assert.equal(s.superpositions, 15)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every UUID superposition reverses to the program. */
test('every UUID superposition reverses to the program', () => {
  const s = uuidSuperpositionsReverse()
  assert.equal(s.phase, 'superpositions-reverse')
  assert.equal(s.direction, 'reverse')
  assert.equal(s.holds, true)
  assert.equal(s.reversed, 15)
  assert.ok(s.scenarios.every((row) => row.returns))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: forward NIST scenarios name the Payload QPU host and fetch nothing. */
test('forward NIST scenarios name the Payload QPU host and fetch nothing', () => {
  const s = nistScenarios(cfg())
  assert.equal(s.phase, 'nist')
  assert.equal(s.host, QPU_HOST())
  assert.equal(s.holds, true)
  assert.equal(s.fetched, false)
  assert.ok(s.requests.some((r) => r.id === 'nist-beacon'))
  assert.ok(s.liveCertificates.some((c) => c.host === QPU_HOST()))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every NIST scenario reverses via CERN from Payload hosts. */
test('every NIST scenario reverses via CERN from Payload hosts', () => {
  const s = nistScenariosReverse(cfg())
  assert.equal(s.phase, 'nist-reverse')
  assert.equal(s.direction, 'reverse')
  assert.equal(s.via, 'cern')
  assert.equal(s.host, CERN_HOST())
  assert.equal(s.holds, true)
  assert.equal(s.fetched, false)
  assert.equal(s.requests[0]?.id, 'cern-opendata')
  assert.ok(s.scenarios.every((row) => row.returns))
  assert.ok(s.liveCertificates.some((c) => c.host === CERN_HOST()))
  assert.equal(ATTEST_HOSTS()[0], QPU_HOST())
  assert.ok(ATTEST_HOSTS().includes(CERN_HOST()))
  assert.ok(WEBCRYPTO_FLAG().startsWith('webcrypto_'))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: ISO/IEC 4879 quantum computers are crypto per tenant. */
test('ISO/IEC 4879 quantum computers are crypto per tenant', () => {
  const c = cfg()
  const qc = c.iso.quantumComputer
  assert.equal(c.phase, 'crypto-config')
  assert.equal(qc.standard, 'ISO/IEC 4879:2024')
  assert.equal(qc.processors.default, 'Willow')
  assert.equal(qc.processors.allowed.length, 5)
  assert.equal(qc.processors.inventory.length, 5)
  assert.ok(qc.schemas.qubit)
  assert.ok(qc.schemas.channel)
  assert.deepEqual([...processorsForRole(c, 'reader')], ['Willow', 'Sycamore', 'Sycamore23'])
  assert.ok(processorsForRole(c, 'writer').includes('Bristlecone'))
  assert.ok(processorsForRole(c, 'writer').includes('Foxtail'))
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: UUID hexbit qubit register is tenant crypto under ISO/IEC 4879 and 9834-8. */
test('UUID hexbit qubit register is tenant crypto under ISO/IEC 4879 and 9834-8', () => {
  const reg = cfg().iso.quantumComputer.register
  assert.equal(reg.standard, 'ISO/IEC 4879:2024')
  assert.equal(reg.uuid, 'ISO/IEC 9834-8')
  assert.equal(reg.hexbit, 4)
  assert.equal(reg.digits, 32)
  assert.equal(reg.effective, 122)
  assert.equal(reg.formula, '32 * 4 - 4 - 2 = 122')
  assert.equal(reg.delivery.leads, 6)
  assert.equal(reg.delivery.holds, true)
  assert.ok(reg.clauses.some((row) => row.clause === '3.3.3' && row.name === 'qubit'))
  assert.ok(reg.clauses.some((row) => row.kind === 'uuid'))
  assert.equal(reg.doors.fold, 'qubits')
  assert.equal(reg.doors.via, 'qpuMcpPlugin')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: local NIST reverse doors open, verify and recompute. */
test('local NIST reverse doors open, verify and recompute', () => {
  const sealed = aead({
    cipher: 'aes-256-gcm',
    key: '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f',
    nonce: '000102030405060708090a0b',
    text: 'functional',
    aad: 'both',
  }) as { ciphertext: string; tag: string }
  const opened = aead({
    cipher: 'aes-256-gcm',
    key: '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f',
    nonce: '000102030405060708090a0b',
    aad: 'both',
    open: { ciphertext: sealed.ciphertext, tag: sealed.tag },
  }) as { verified: boolean; text: string | null }
  assert.equal(opened.verified, true)
  assert.equal(opened.text, 'functional')

  const proof = merkleTree({ leaves: ['a', 'b', 'c'], index: 1 }) as { verified: boolean; root: string; proof: { hash: string; right: boolean }[] }
  const verified = merkleTree({ leaf: 'b', proof: proof.proof, root: proof.root }) as { verified: boolean }
  assert.equal(proof.verified, true)
  assert.equal(verified.verified, true)

  const once = derivePbkdf2({ password: 'password', salt: 'salt', iterations: 1, length: 32 }) as { derived: string }
  const again = derivePbkdf2({ password: 'password', salt: 'salt', iterations: 1, length: 32 }) as { derived: string }
  assert.equal(once.derived, again.derived)
  assert.equal(once.derived, '120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b')

  const kem = planEncapsulation('ML-KEM-768', cfg())
  assert.equal(kem.fips, 203)
  assert.equal(kem.webcrypto.flag, WEBCRYPTO_FLAG())
  assert.equal(planSlhDsa(true).fips, 205)
  assert.equal(planSignature(digest('nist'), 'ML-DSA-65', cfg()).fips, 204)
  assert.equal(planEcdsaP256(digest('nist')).fips, '186-5')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: NIST and CERN Open Data fixtures coil as two realities. */
test('NIST and CERN Open Data fixtures coil as two realities', () => {
  const nist = nistOpenData({ ResultCount: 1, ResultData: [{ title: 'NIST Chemistry WebBook', doi: 'doi:10.18434/T4D303' }] })
  assert.equal(nist.phase, 'experience')
  assert.equal(nist.holds, true)
  assert.equal(nist.rows[0]!.doi, '10.18434/T4D303')
  assert.equal(nist.rows[0]!.realities.map((r) => r.digit).join(), '1,6')

  const cern = cernOpenData({ hits: { total: 1, hits: [{ id: '5209', metadata: { title: 'Higgs to two photons from 2011', relations: [{ doi: '10.7483/OPENDATA.CMS.N9MJ.QEEC' }] } }] } })
  assert.equal(cern.phase, 'experience')
  assert.equal(cern.source, 'cern-opendata')
  assert.equal(cern.holds, true)
  assert.equal(cern.rows[0]!.doi, '10.7483/OPENDATA.CMS.N9MJ.QEEC')
  assert.equal(cern.rows[0]!.realities.map((r) => r.digit).join(), '1,6')
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: attestAnswers verifies fixtures and asks for the beacon previous pulse. */
test('attestAnswers verifies fixtures and asks for the beacon previous pulse', () => {
  const read = attestAnswers([
    { id: 'nist-beacon', text: BEACON_LAST },
    { id: 'ct-sth', text: STH },
    { id: 'nvd-cves', text: NVD },
    { id: 'cern-opendata', text: CERN },
    { id: 'tls:qpu.uuidna.com', text: JSON.stringify({ notBefore: '2026-09-09T03:31:22Z', notAfter: '2026-12-08T04:31:19Z', issuer: 'Google Trust Services WE1' }) },
  ], 1793005826714)
  assert.equal(read.violations.length, 0)
  assert.equal(read.followUps.length, 1)
  assert.equal(read.followUps[0]?.id, 'nist-beacon-previous')
  assert.ok(read.checked >= 10)
})
