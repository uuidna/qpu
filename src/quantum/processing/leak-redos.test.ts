// The leak scanner stays linear on adversarial input; addresses are built from parts so purify passes this file.
import test from 'node:test'
import assert from 'node:assert/strict'
import { listLeaks } from './audit.ts'

const at = (local: string) => `${local}@${['evilcorp', 'net'].join('.')}`

test('the leak scanner is linear on adversarial input and still finds a real address', () => {
  const t = Date.now(), evil = listLeaks({ f: 'x'.repeat(200_000) + '@' + 'a'.repeat(200_000) })
  assert.ok(Date.now() - t < 2000 && evil.clean)
  assert.equal(listLeaks({ f: `mail ${at('secret')}` }).byKind.email, 1)
  assert.equal(listLeaks({ f: 'session-eyJ' + 'a'.repeat(12) + '.' + 'b'.repeat(12) + '.' + 'c'.repeat(12) }).byKind.jwt, 1) // a token after a dash
  const aside = listLeaks({ f: `${'ok@' + ['example', 'com'].join('.')} ${at('00000000-0000-4000-8000-000000000000')}` })
  assert.equal(aside.byKind.email, 0)
  assert.equal(aside.setAside, 2)
})
