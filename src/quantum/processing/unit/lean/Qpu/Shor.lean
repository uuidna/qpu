import Qpu.Lattice

/-! # Qpu.Shor
Modular exponentiation, period finding by fuel recursion, gcd, and Shor.
`shor` is the lattice modulus 91. `shor_cases` is every door: an even order past the
five-bit comparison (35 and 77), an odd order, a trivial half-root, a shared factor, and a power of two. -/

def powModAux : Nat → Nat → Nat → Nat → Nat | 0, _, _, acc => acc | k + 1, a, m, acc => powModAux k a m (acc * a % m)
def powMod (a e m : Nat) : Nat := powModAux e a m (1 % m)
def periodAux : Nat → Nat → Nat → Nat → Nat | 0, _, _, _ => 0 | fuel + 1, a, m, r => if powMod a r m = 1 then r else periodAux fuel a m (r + 1)
def period (a m : Nat) : Nat := periodAux m a m 1
def gcdAux : Nat → Nat → Nat → Nat | 0, a, _ => a | fuel + 1, a, b => if b = 0 then a else gcdAux fuel b (a % b)
def gcd (a b : Nat) : Nat := gcdAux (a + b) a b
def half (a m : Nat) : Nat := powMod a (period a m / 2) m
/-- Euler's totient by counting the coprimes (the crypto/number-theory φ the multiplicative period divides), via the gcd above -/
def totientAux : Nat → Nat → Nat → Nat | 0, _, acc => acc | k + 1, n, acc => totientAux k n (if gcd (k + 1) n = 1 then acc + 1 else acc)
def totient (n : Nat) : Nat := totientAux n n 0
/-- the Shor modulus, named by the lattice: rays · (faces − seed) = 7 · 13 -/
def shorModulus : Nat := rays * (faces - seed)
/-- the Shor base, named by the lattice: mint n = 2^3 -/
def shorBase : Nat := mint n
theorem shor : period shorBase shorModulus % coins = 0 ∧ half shorBase shorModulus < shorModulus - seed ∧ seed < gcd (half shorBase shorModulus - seed) shorModulus ∧ gcd (half shorBase shorModulus - seed) shorModulus < shorModulus ∧ gcd (half shorBase shorModulus - seed) shorModulus * gcd (half shorBase shorModulus + seed) shorModulus = shorModulus := ⟨rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, rfl⟩
-- 6 theorem complete landscape
theorem all_shor : period shorBase shorModulus % coins = 0 := rfl

/-- Every door, including moduli past the five-bit comparison 21.
    2 mod 35 has order 12 and splits into 7 × 5.
    2 mod 77 has order 30 and splits into 7 × 11.
    2 mod 7 has odd order 3, so the half-root step does not run.
    3 mod 7 has order 6 and 3³ ≡ −1, so the root is trivial.
    gcd(14, 21) = 7 is Euclid, before any period.
    2048 = 2¹¹ is trial, not a period. -/
theorem shor_cases :
    period 2 35 = 12 ∧ gcd (powMod 2 6 35 - 1) 35 = 7 ∧ gcd (powMod 2 6 35 + 1) 35 = 5 ∧
    period 2 77 = 30 ∧ gcd (powMod 2 15 77 - 1) 77 = 7 ∧ gcd (powMod 2 15 77 + 1) 77 = 11 ∧
    period 2 7 = 3 ∧ period 2 7 % coins = 1 ∧
    period 3 7 = 6 ∧ powMod 3 3 7 + 1 = 7 ∧
    gcd 14 21 = 7 ∧
    2048 = 2 ^ 11 := by decide
