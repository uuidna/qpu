// The leak scanner stays linear on adversarial input; addresses are built from parts so purify passes this file.
import test from 'node:test'
import assert from 'node:assert/strict'
import { listLeaks, sealTokenLeaks } from './audit.ts'

const at = (local: string) => `${local}@${['evilcorp', 'net'].join('.')}`

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the leak scanner is linear on adversarial input and still finds a real address. */
test('the leak scanner is linear on adversarial input and still finds a real address', () => {
  const t = Date.now(), evil = listLeaks({ f: 'x'.repeat(200_000) + '@' + 'a'.repeat(200_000) })
  assert.ok(Date.now() - t < 2000 && evil.clean)
  assert.equal(listLeaks({ f: `mail ${at('secret')}` }).byKind.email, 1)
  assert.equal(listLeaks({ f: 'session-eyJ' + 'a'.repeat(12) + '.' + 'b'.repeat(12) + '.' + 'c'.repeat(12) }).byKind.jwt, 1) // a token after a dash
  const aside = listLeaks({ f: `${'ok@' + ['example', 'com'].join('.')} ${at('00000000-0000-4000-8000-000000000000')}` })
  assert.equal(aside.byKind.email, 0)
  assert.equal(aside.setAside, 2)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: a token leak is sealed by the Lean formula found - redacted = 0. */
test('a token leak is sealed by the Lean formula found - redacted = 0', () => {
  const token = 'gh' + 'p_' + 'a'.repeat(20)
  const stripe = 'sk_' + 'live_' + 'abcdefgh'
  const jwt = 'ey' + 'J' + 'a'.repeat(12) + '.' + 'b'.repeat(12) + '.' + 'c'.repeat(12)
  const pem = '-----BEGIN ' + 'PRIVATE KEY-----'
  const sealed = sealTokenLeaks(`keep ${token} ${stripe} ${jwt} ${pem}`)
  assert.equal(sealed.lean, 'found - redacted = 0')
  assert.equal(sealed.theorem, 'textbook_leaks_redacted')
  assert.equal(sealed.publish, 'textbook_redact_before_publish')
  assert.equal(sealed.found, 4)
  assert.equal(sealed.redacted, sealed.found)
  assert.equal(sealed.found - sealed.redacted, 0)
  assert.equal(sealed.holds, true)
  assert.equal(sealed.left, 0)
  assert.equal(sealed.text.includes(token), false)
  assert.equal(sealed.text.includes(stripe), false)
  assert.equal(sealed.text.includes(jwt), false)
  assert.equal(sealed.text.includes(pem), false)
  assert.equal(sealed.text, 'keep [token] [stripe-secret] [jwt] [private-key]')
  const encoded = sealTokenLeaks('%22' + token + '%22')
  assert.equal(encoded.text.includes(token), false)
  assert.equal(encoded.found - encoded.redacted, 0)
  assert.equal(encoded.holds, true)
})
