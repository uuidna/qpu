import Qpu.Lattice

/-! # Qpu.Shor
Modular exponentiation, period finding by fuel recursion, gcd, and Shor on 91. -/

def powModAux : Nat → Nat → Nat → Nat → Nat | 0, _, _, acc => acc | k + 1, a, m, acc => powModAux k a m (acc * a % m)
def powMod (a e m : Nat) : Nat := powModAux e a m (1 % m)
def periodAux : Nat → Nat → Nat → Nat → Nat | 0, _, _, _ => 0 | fuel + 1, a, m, r => if powMod a r m = 1 then r else periodAux fuel a m (r + 1)
def periodOf (a m : Nat) : Nat := periodAux m a m 1
def gcdAux : Nat → Nat → Nat → Nat | 0, a, _ => a | fuel + 1, a, b => if b = 0 then a else gcdAux fuel b (a % b)
def gcdOf (a b : Nat) : Nat := gcdAux (a + b) a b
def half (a m : Nat) : Nat := powMod a (periodOf a m / 2) m
/-- the Shor modulus, named by the lattice: rays · (faces − seed) = 7 · 13 -/
def shorModulus : Nat := rays * (faces - seed)
/-- the Shor base, named by the lattice: mintOf n = 2^3 -/
def shorBase : Nat := mintOf n
theorem shor : periodOf shorBase shorModulus % coins = 0 ∧ half shorBase shorModulus < shorModulus - seed ∧ seed < gcdOf (half shorBase shorModulus - seed) shorModulus ∧ gcdOf (half shorBase shorModulus - seed) shorModulus < shorModulus ∧ gcdOf (half shorBase shorModulus - seed) shorModulus * gcdOf (half shorBase shorModulus + seed) shorModulus = shorModulus := ⟨rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, rfl⟩
-- 6 theorem complete landscape
theorem all_shor : periodOf shorBase shorModulus % coins = 0 := rfl
