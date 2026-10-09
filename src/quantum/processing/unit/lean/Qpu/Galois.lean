import Qpu.Mint

/-! # Qpu.Galois
GF(2) linear-algebra counts underpinning CSS and stabilizer code construction, exact Nat on the doubling mintOf: the
order of the general linear group GL(n, 2), the product of 2^n − 2^i for i below n. The kernel proves the values; there
is no holds. -/

def glProd : Nat → Nat → Nat | _, 0 => 1 | nn, i + 1 => (mintOf nn - mintOf i) * glProd nn i
def gl2 (nn : Nat) : Nat := glProd nn nn
theorem galois_all : gl2 2 = 6 ∧ gl2 3 = 168 ∧ gl2 4 = 20160 := ⟨rfl, rfl, rfl⟩
