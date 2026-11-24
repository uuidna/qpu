// The witnesses of a UUID cross-encrypted: its fourteen faces in a ring, each sealed to the next. Witness i's own address is encrypted under
// a secret only witness i + 1 can recover (ML-KEM-768, FIPS 203, then AES-256-GCM with the UUID as associated data) and signed by witness i
// (ML-DSA-65, FIPS 204). Every key comes from one seed and the witness's address by HKDF, so the holder of the seed opens the whole ring and
// nobody else opens any link; no secret key and no shared secret is answered. The ring is checked here as it is built: each link opened by
// its successor, a changed ciphertext refused by the tag, a stranger's key refused, a changed message refused by the signature.
// What it costs to fake is stated beside it: the categories FIPS 203 and 204 state for these sets (described, not proved here), the AEAD's
// key and tag, and the address measured from the capacity inverted (computed here).
import { ml_kem768 } from '@noble/post-quantum/ml-kem.js'
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js'
import { PROSE, proseFill } from '../prose-index.ts'
import { aes256gcmDecrypt, aes256gcmEncrypt, hex, hkdfExpand, hkdfExtract, sha256, utf8 } from '../unit/hmac.ts'
import { checkWitnesses } from '../witnesses.ts'
import { costToFake, quantumCapacity } from '../capacity.ts'
import { fromHex } from './index.ts'

const join = (...parts: Uint8Array[]) => { const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let at = 0; for (const p of parts) { out.set(p, at); at += p.length } return out }
const flipped = (b: Uint8Array) => { const out = Uint8Array.from(b); out[0] = out[0]! ^ 1; return out }

/** The ring of a UUID's witnesses, each sealed to the next and signed, from a seed (hex, a fresh one without). */
export const crossWitnesses = (raw: unknown) => {
  const a = (raw && typeof raw === 'object' ? raw : { uuid: raw }) as { uuid?: unknown; seed?: unknown; full?: unknown }
  if (typeof a.uuid !== 'string') throw new Error(PROSE.quantumProcessingCryptoCross_needs)
  const checked = checkWitnesses(a.uuid), faces = checked.witnesses, n = faces.length, aad = utf8(checked.canonical)
  const seed = a.seed === undefined ? crypto.getRandomValues(new Uint8Array(32)) : fromHex(String(a.seed), 'seed')
  if (seed.length < 32) throw new Error(PROSE.quantumProcessingCryptoCross_seed)
  const prk = hkdfExtract(utf8('qpu witnesses'), seed), derive = (label: string, i: number, bytes: number) => hkdfExpand(prk, utf8(`${label}:${i}:${faces[i]!.uuid}`), bytes)
  const keys = faces.map((_w, i) => ({ kem: ml_kem768.keygen(derive('kem', i, ml_kem768.lengths.seed!)), dsa: ml_dsa65.keygen(derive('dsa', i, ml_dsa65.lengths.seed!)) }))
  const links = faces.map((w, i) => {
    const to = (i + 1) % n, e = ml_kem768.encapsulate(keys[to]!.kem.publicKey, derive('enc', i, 32)), nonce = derive('nonce', i, 12)
    const sealed = aes256gcmEncrypt(e.sharedSecret, nonce, utf8(w.uuid), aad), signedOver = join(e.cipherText, nonce, sealed.ciphertext, sealed.tag)
    const signature = ml_dsa65.sign(signedOver, keys[i]!.dsa.secretKey, { extraEntropy: false })
    // the successor opens it; nobody else does, and nothing changed passes
    const open = (secretKey: Uint8Array, ciphertext: Uint8Array) => { const plain = aes256gcmDecrypt(ml_kem768.decapsulate(e.cipherText, secretKey), nonce, ciphertext, sealed.tag, aad); return plain === null ? null : new TextDecoder().decode(plain) }
    const opened = open(keys[to]!.kem.secretKey, sealed.ciphertext) === w.uuid, signed = ml_dsa65.verify(signature, signedOver, keys[i]!.dsa.publicKey)
    const refuses = { changed: open(keys[to]!.kem.secretKey, flipped(sealed.ciphertext)) === null, stranger: open(keys[(i + 2) % n]!.kem.secretKey, sealed.ciphertext) === null, forged: !ml_dsa65.verify(signature, flipped(signedOver), keys[i]!.dsa.publicKey) }
    const blob = (b: Uint8Array) => (a.full === true ? hex(b) : { bytes: b.length, sha256: hex(sha256(b)) })
    return { index: i, face: w.face, from: w.uuid, to: faces[to]!.uuid, publicKeys: { kem: blob(keys[i]!.kem.publicKey), dsa: blob(keys[i]!.dsa.publicKey) }, kem: blob(e.cipherText), nonce: hex(nonce), ciphertext: hex(sealed.ciphertext), tag: hex(sealed.tag), signature: blob(signature), opened, signed, refuses }
  })
  const closes = links.every((l) => l.opened && l.signed), refused = links.every((l) => l.refuses.changed && l.refuses.stranger && l.refuses.forged)
  return {
    phase: 'witnesses-cross' as const, uuid: checked.canonical, faces: n, reproducible: a.seed !== undefined, links, closes, refused, holds: closes && refused && checked.exact,
    secret: { travels: false as const, answered: [] as string[] },
    cost: {
      kem: { algorithm: 'ML-KEM-768' as const, fips: 203 as const, category: 3 as const, stated: 'described' as const },
      signature: { algorithm: 'ML-DSA-65' as const, fips: 204 as const, category: 3 as const, stated: 'described' as const },
      aead: { cipher: 'aes-256-gcm' as const, keyBits: 256, tagBits: 128, grover: 128, stated: 'computed' as const },
      address: { ...costToFake(quantumCapacity().register.free).address, stated: 'computed' as const },
    },
    theorems: ['textbook_pqc_standards_three', 'textbook_grover_search', 'textbook_tamper_detected'] as const,
    says: proseFill(PROSE.quantumProcessingCryptoCross_says, n, links.filter((l) => l.opened && l.signed).length, links.filter((l) => l.refuses.changed && l.refuses.stranger && l.refuses.forged).length),
  }
}
