// The confidentiality of ML-KEM-768 as the kernel holds it: IND-CPA of K-PKE reduced to Module-LWE with every game written out from the
// scheme and the adversary, the FIPS 203 instance stated with its own ring, noise and encoding, the withdrawn triangle inequality gone from
// every index, and the lead saying exactly that much and naming what remains.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { THEOREMS } from '../../../../../../../../3/f/0/e/7/a/6/f/index.ts'
import { GAPS } from '../../../../../../../b/d/6/c/f/0/2/index.ts'
import { LEAD_ROWS } from '../../../../../../../../f/3/5/3/8/2/1/2/index.ts'

const module = 'Qpu.Processing.Verify.MlKem', ns = 'Qpu.Verify.MlKem.'
const held = THEOREMS.filter((t) => t.module === module)
const statement = (name: string) => held.find((t) => t.key === ns + name)!.statement
const standard = ['propext', 'Classical.choice', 'Quot.sound']

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the kernel holds the IND-CPA reduction of K-PKE to Module-LWE on the standard axioms alone. */
test('the kernel holds the IND-CPA reduction of K-PKE to Module-LWE on the standard axioms alone', () => {
  const names = held.map((t) => t.key.slice(ns.length)).sort()
  assert.deepEqual(names, ['ind_cpa_of_mlwe', 'ind_cpa_reduces_to_mlwe', 'ml_kem_768_ind_cpa_reduces_to_mlwe', 'uniform_eq_bit', 'uniform_shift'])
  for (const t of held) assert.ok(t.axioms.every((a) => standard.includes(a)), `${t.key}: ${t.axioms.join(', ')}`)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: every game of the reduction is written out from the scheme and the adversary, none assumed. */
test('every game of the reduction is written out from the scheme and the adversary, none assumed', () => {
  const s = statement('ind_cpa_reduces_to_mlwe')
  // the key problem, real and random, from the scheme's own product and distributions
  assert.match(s, /PMF\.pure \(A, mul A s \+ e\)/)
  assert.match(s, /uniformOfFintype V\)\.bind fun t => PMF\.pure \(A, t\)/)
  // the IND-CPA game: a hidden bit, the adversary's two messages and the challenge built from the coins, the noise and the message
  assert.match(s, /\(PMF\.uniformOfFintype Bool\)\.bind fun b =>/)
  assert.match(s, /dotT pk\.1 pk\.2 r \+ e\)\.2 \+ encode \(if b = true then x\.2\.1 else x\.1\)/)
  // the encryption problem's matrix is the random public key, and its random samples are uniform
  assert.match(s, /uniformOfFintype \(U × W\)\)\.bind fun c => PMF\.pure \(pk, c\)/)
  // no hypothesis stands in for a game or a hop, and no distinguisher is hidden behind an existential
  assert.doesNotMatch(s, /∃|hfo|hreal|hrand|eps/)
  assert.doesNotMatch(s, /\) →\s*\|/)
  // the hardness corollary takes Module-LWE as a hypothesis on both problems, never as an axiom
  assert.match(statement('ind_cpa_of_mlwe'), /≤ δ₁\) →[\s\S]*≤ δ₂\) →/)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the ML-KEM-768 instance states FIPS 203's ring, rank, noise and message encoding. */
test("the ML-KEM-768 instance states FIPS 203's ring, rank, noise and message encoding", () => {
  const s = statement('ml_kem_768_ind_cpa_reduces_to_mlwe')
  assert.match(s, /Fin 3 → Fin 3 → Fin 256 → ZMod 3329/)
  // the negacyclic product of ZMod 3329[X]/(X^256 + 1): a coefficient past the degree comes back negated
  assert.match(s, /↑i \+ ↑j = ↑k \+ 256 then -\(a i \* b j\)/)
  // centred binomial noise with eta = 2: two pairs of bits per coefficient
  assert.match(s, /Fin 3 → Fin 256 → Fin 2 → Bool × Bool/)
  assert.match(s, /if m c = true then 1665 else 0/)
})

/** ISO/IEC/IEEE 29119-3 test case. Identifier: the withdrawn triangle inequality is gone and the lead claims IND-CPA only, naming what remains. */
test('the withdrawn triangle inequality is gone and the lead claims IND-CPA only, naming what remains', () => {
  const gone = ['game_hop', 'ind_cca2_reduces_to_mlwe', 'ind_cca2_of_mlwe'].map((n) => ns + n)
  for (const key of gone) assert.ok(!THEOREMS.some((t) => t.key === key) && !GAPS.some((g) => g.key === key), key)
  const lead = LEAD_ROWS.find((r) => r.id === 'ml-kem-confidentiality')!
  assert.deepEqual([lead.status, lead.tool], ['partial', 'textbook'])
  for (const name of ['ind_cpa_reduces_to_mlwe', 'ind_cpa_of_mlwe', 'ml_kem_768_ind_cpa_reduces_to_mlwe', 'Fujisaki-Okamoto', 'withdrawn']) assert.ok((lead.reason ?? '').includes(name), name)
})
