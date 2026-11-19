import Schnorr

/-!
# Schnorr Protocol — Property-Based Tests

Universally-quantified properties over the concrete instantiation
p = 7, g = 3, plus derived cross-property checks.
-/

def g7 : G 7 := ⟨3, by omega⟩

def hgc7 : Nat.Coprime (g7 : G 7).val 7 := by
  exact (Nat.Prime.coprime_iff_not_dvd (by decide) 3 (by omega)).elim id (by omega)

/-! ## Group properties -/

example (a b c : G 7) :
    mul 7 (mul 7 a b) c = mul 7 a (mul 7 b c) := mul_assoc 7 a b c

example (a b : G 7) : mul 7 a b = mul 7 b a := mul_comm 7 a b

example (a : G 7) : mul 7 (e 7) a = a := mul_id 7 a

example (a : G 7) : ∃ b, mul 7 a b = e 7 := mul_inv 7 a

example (a : G 7) : mul 7 a (inv 7 a) = e 7 := inv_right 7 a

example (a : G 7) : mul 7 (inv 7 a) a = e 7 := inv_left 7 a

/-! ## Exponentiation properties -/

example (a b : Nat) :
    pow 7 g7 (a + b) = mul 7 (pow 7 g7 a) (pow 7 g7 b) := pow_add 7 g7 a b

example (c x : Nat) :
    pow 7 g7 (c * x) = pow 7 (pow 7 g7 x) c := pow_mul 7 g7 c x

example : pow 7 g7 (q 7) = e 7 := g_order 7 g7 hgc7

example (h : G 7) : pow 7 h (q 7) = e 7 := h_order 7 h

example (n : Nat) : pow 7 g7 (n % q 7) = pow 7 g7 n := pow_mod 7 g7 n

/-! ## Protocol properties -/

example (h : G 7) (r c x : Nat) (hx : dlog 7 h x) :
    verify 7 (commit 7 h r) h c (respond 7 r x c) = true :=
  completeness 7 g7 hgc7 h r c x hx

example (h : G 7) (c z : Nat) :
    verify 7 (simulate 7 h c z).1 h c z = true :=
  simulate_verifies 7 g7 hgc7 h c z

example (h : G 7) (r x c : Nat) (hx : dlog 7 h x) :
    (simulate 7 h c (respond 7 r x c)).1 = commit 7 h r :=
  transcript_eq 7 g7 hgc7 h r x c hx

example (h : G 7) (r x c : Nat) (hx : dlog 7 h x) :
    ∃ z, simulate 7 h c z = (commit 7 h r, c, z) ∧
         verify 7 (simulate 7 h c z).1 h c z = true :=
  perfect_zk 7 g7 hgc7 h r x c hx

example (h : G 7) (r x : Nat) (hx : dlog 7 h x) :
    ∀ c, ∃ z, simulate 7 h c z = (commit 7 h r, c, z) ∧
              verify 7 (simulate 7 h c z).1 h c z = true :=
  schnorr_zk 7 g7 hgc7 h r x hx

/-! ## Soundness properties -/

example (h : G 7) (a : G 7) (c1 c2 z1 z2 : Nat)
    (hc1c2 : c2 ≤ c1) (hz1z2 : z2 ≤ z1)
    (hcop : Nat.Coprime (c1 - c2) (q 7))
    (h2 : verify 7 a h c1 z1 = true)
    (h3 : verify 7 a h c2 z2 = true) :
    ∃ x : Nat, dlog 7 h x :=
  soundness 7 g7 hgc7 h a c1 c2 z1 z2 hc1c2 hz1z2 hcop h2 h3

example (h : G 7) (a : G 7) (c1 c2 z1 z2 : Nat)
    (hc1c2 : c2 ≤ c1) (hz1z2 : z2 ≤ z1)
    (hcop : Nat.Coprime (c1 - c2) (q 7))
    (h2 : verify 7 a h c1 z1 = true)
    (h3 : verify 7 a h c2 z2 = true) :
    dlog 7 h (extract 7 c1 c2 z1 z2 hcop) :=
  extract_correct 7 g7 hgc7 h a c1 c2 z1 z2 hc1c2 hz1z2 hcop h2 h3

/-! ## Derived cross-property tests -/

example (h : G 7) (a : G 7) (c1 c2 z1 z2 : Nat)
    (hc1c2 : c2 ≤ c1) (hz1z2 : z2 ≤ z1)
    (hcop : Nat.Coprime (c1 - c2) (q 7))
    (h2 : verify 7 a h c1 z1 = true)
    (h3 : verify 7 a h c2 z2 = true) :
    ∃ x, dlog 7 h x := by
  exact ⟨extract 7 c1 c2 z1 z2 hcop,
         extract_correct 7 g7 hgc7 h a c1 c2 z1 z2 hc1c2 hz1z2 hcop h2 h3⟩

example (h : G 7) (c z : Nat) :
    verify 7 (simulate 7 h c z).1 h c z = true :=
  simulate_verifies 7 g7 hgc7 h c z

example (h : G 7) (r c x : Nat) (hx : dlog 7 h x) :
    verify 7 (commit 7 h r) h c (respond 7 r x c) = true :=
  completeness 7 g7 hgc7 h r c x hx

example (a n : Nat) (hcop : Nat.Coprime a n) :
    (a * modInv a n) % n = 1 % n :=
  modInv_correct a n hcop