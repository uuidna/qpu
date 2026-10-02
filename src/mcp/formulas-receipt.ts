import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { sha256, utf8 } from '../core/crypt.js'
import { attacksOf } from '../core/crypt-attacks.js'
import { qpuContentUuidOf, qpuHexRunOf, qpuUuidReceiptOf } from '../quantum/processing/unit/index.js'
import { CrossDomainFormulas, type CrossFormula } from './cross-domain-formulas.js'
import { CryptFormulas } from './crypt-formulas.js'
import { HoloFormulas, hologramStreamsOf, holoStreamHolds } from './hologram-streams.js'
import { QuantumSecureSignalling, SignalFormulas } from './quantum-secure-signalling.js'
import { BB84_RAW, SecureChat } from './secure-chat-rbac.js'

const loadSeconds = Math.round(performance.now() / 100) / 10

export interface FormulaRow {
  name: string
  family: string
  pass: boolean
  value: number | string
  formula?: string
  inputs?: Record<string, number>
  from: string
  hex?: string
  hexAgrees?: boolean
  receipt: string
}

const readJson = (root: string, file: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
  } catch {
    return null
  }
}

const timed = <T>(run: () => T): { value: T; ms: number } => {
  const t = performance.now()
  const value = run()
  return { value, ms: performance.now() - t }
}

/** The chat run end to end: two recipients decrypt, an outsider cannot. */
const chatRunOf = () => {
  const chat = new SecureChat()
  const t = Object.fromEntries(['alice', 'bob', 'carol', 'eve'].map((u) => [u, chat.registerUser(u, 'user')]))
  const body = utf8('formulas receipt')
  return timed(() => {
    const msg = chat.sendMessage(t.alice!, ['bob', 'carol'], 'receipt', body)!
    const read = ['bob', 'carol'].map((u) => chat.decryptMessageBody(msg, t[u]!))
    return {
      users: 4,
      messages: chat.getMessageCount(),
      ciphertext: msg.body.length,
      delivered: read.every((r) => r !== null && sha256(r).join() === sha256(body).join()),
      outsider: chat.decryptMessageBody(msg, t.eve!) === null,
    }
  })
}

/** Measure the tree, evaluate every formula family on what was measured, re-run each through its hex address. */
export const formulasReceiptOf = async (root = process.cwd()) => {
  const test = readJson(root, 'test-receipt.json') as { tests?: number; pass?: number } | null
  const lean = readJson(root, 'lean-receipt.json') as { theorems?: number } | null
  const receiptRows = fs
    .readdirSync(root)
    .filter((f) => f.endsWith('-receipt.json') && f !== 'formulas-receipt.json')
    .reduce((a, f) => a + ((readJson(root, f)?.rows as unknown[] | undefined)?.length ?? 0), 0)

  const chat = chatRunOf()
  const attacks = timed(() => attacksOf())
  const breaches = attacks.value.filter((a) => !a.resisted).length
  const trials = attacks.value.reduce((s, a) => s + a.trials, 0)
  const bb84 = QuantumSecureSignalling.sift(QuantumSecureSignalling.BB84KeyGen(BB84_RAW))
  const eve = QuantumSecureSignalling.sift(QuantumSecureSignalling.BB84KeyGen(BB84_RAW), true)
  const hologram = hologramStreamsOf()
  const corner = (s: string) => parseInt(Array.from(sha256(s).subarray(0, 2), (b) => b.toString(16).padStart(2, '0')).join(''), 16)
  const testSeconds = Math.round((chat.ms + attacks.ms) / 100) / 10

  const evaluated: [string, CrossFormula, string, boolean?][] = [
    ['cross', CrossDomainFormulas.bb84ToCompress(bb84.bits.length), 'sifted BB84 key bits'],
    ['cross', CrossDomainFormulas.observabilityToML(receiptRows), 'rows across the committed receipts'],
    ['cross', CrossDomainFormulas.deploymentToObs(loadSeconds, testSeconds), 'seconds to load the unit, seconds to run chat and attacks'],
    ['cross', CrossDomainFormulas.quantumToEnterprise(lean?.theorems ?? 0), 'Lean theorems in lean-receipt.json'],
    ['cross', CrossDomainFormulas.medSecureWithQSec(chat.value.users, 256), 'chat users, session key bits'],
    ['cross', CrossDomainFormulas.observabilityToUI(breaches, trials), 'attacks that got through, attack trials'],
    ['cross', CrossDomainFormulas.compressQSecSignals(chat.value.ciphertext, bb84.bits.length), 'sealed body bytes, BB84 key bits'],
    ['cross', CrossDomainFormulas.mlOnObsForPrediction(attacks.value.length, breaches), 'attacks, breaches'],
    ['cross', CrossDomainFormulas.enterpriseMetricsViaObs((attacks.value.length - breaches) / attacks.value.length, Math.round(chat.ms)), 'share of attacks resisted, chat milliseconds'],
    ['cross', CrossDomainFormulas.testCoverageToQuality(test?.pass ?? 0, test?.tests ?? 0), 'test-receipt.json pass / tests'],
    ['signal', SignalFormulas.siftedBits(BB84_RAW), 'raw qubits per chat pair'],
    ['signal', SignalFormulas.keyBits(BB84_RAW), 'raw qubits per chat pair'],
    ['signal', SignalFormulas.qber(bb84.errors, bb84.sampled), 'honest BB84 run'],
    ['signal', SignalFormulas.qber(eve.errors, eve.sampled), 'intercept-resend run: holds false means Eve was caught', false],
    ['signal', SignalFormulas.detection(eve.sampled), 'disclosed bits of the intercepted run'],
    ['signal', SignalFormulas.hops(8, corner('alice'), corner('bob')), 'corners of alice and bob on the 8-cube'],
    ['holo', HoloFormulas.proofDepth(hologram.streams ? Object.keys(hologram.streams).length : 0), 'hologram scales'],
    ['holo', HoloFormulas.forgery(256), 'SHA-256 output bits'],
    ['crypt', CryptFormulas.knownAnswers(), 'FIPS 180-4, RFC 1321, RFC 7748, RFC 8032 vectors'],
    ['crypt', CryptFormulas.symmetricQuantumBits(256), 'ChaCha20 key bits'],
    ['crypt', CryptFormulas.curveClassicalBits(255), 'Curve25519 field bits'],
    ['crypt', CryptFormulas.curveQuantumBits(255), 'Curve25519 field bits'],
    ['crypt', CryptFormulas.tagForgery(chat.value.ciphertext), 'sealed body bytes'],
    ['crypt', CryptFormulas.nonceCollision(chat.value.messages), 'messages sent'],
  ]

  const rows: FormulaRow[] = []
  for (const [family, f, from, expect = true] of evaluated) {
    let hexAgrees: boolean | undefined
    if (f.hex && f.hexExact) {
      const run = await qpuHexRunOf(f.hex)
      hexAgrees = 'value' in run && run.value === f.value
    }
    rows.push({ name: `${family} ${f.id}`, family, pass: f.holds === expect && hexAgrees !== false, value: f.value, formula: f.formula, from, hex: f.hex, hexAgrees, receipt: f.receipt })
  }
  const minted = (name: string, family: string, pass: boolean, value: number | string, from: string) =>
    rows.push({ name, family, pass, value, from, receipt: qpuUuidReceiptOf(`formulas ${name}`, qpuContentUuidOf({ name, pass, value }), { pass, value }).uuid })
  for (const a of attacks.value) minted(`attack ${a.name}`, 'attack', a.resisted, `${a.breaches}/${a.trials}`, a.detail)
  for (const [scale, entries] of Object.entries(hologram.streams)) minted(`hologram ${scale}`, 'holo', holoStreamHolds(entries, hologram.publicKeys), entries.length, entries.at(-1)?.uuid ?? '')
  minted('chat delivered', 'chat', chat.value.delivered, 2, 'both recipients decrypt')
  minted('chat outsider', 'chat', chat.value.outsider, 0, 'a non-recipient decrypts nothing')

  const pass = rows.filter((r) => r.pass).length
  return {
    kind: 'formulas-receipt' as const,
    when: new Date().toISOString().slice(0, 10),
    formulas: evaluated.length,
    rowsTotal: rows.length,
    pass,
    fail: rows.length - pass,
    attacks: `${attacks.value.length - breaches}/${attacks.value.length}`,
    hexAgrees: rows.filter((r) => r.hexAgrees === true).length,
    hologramRoot: hologram.root,
    holds: pass === rows.length,
    rows,
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const doc = await formulasReceiptOf()
  fs.writeFileSync(path.join(process.cwd(), 'formulas-receipt.json'), JSON.stringify(doc, null, 1) + '\n')
  for (const r of doc.rows.filter((x) => !x.pass)) console.log(`fail ${r.name} = ${r.value} (${r.from})`)
  console.log(JSON.stringify({ formulas: doc.formulas, rows: doc.rowsTotal, pass: doc.pass, fail: doc.fail, attacks: doc.attacks, hexAgrees: doc.hexAgrees, holds: doc.holds }))
}
