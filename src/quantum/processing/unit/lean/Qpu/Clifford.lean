import Qpu.Mint

/-! # Qpu.Clifford
Clifford-group and symplectic-group orders for gate synthesis and randomized benchmarking, exact Nat on the doubling
mint: the order of the symplectic group Sp(2n, 2) — 2^(n^2) times the product of 4^j − 1 for j up to n — and the
n-qubit Clifford group order. The kernel proves the values; there is no holds. -/

def sympProd : Nat → Nat | 0 => 1 | j + 1 => (mint (2 * (j + 1)) - 1) * sympProd j
def symplectic (nn : Nat) : Nat := mint (nn * nn) * sympProd nn
def cliffordOrder (nn : Nat) : Nat := mint (2 * nn) * symplectic nn
theorem clifford_all : symplectic 1 = 6 ∧ symplectic 2 = 720 ∧ symplectic 3 = 1451520 ∧ cliffordOrder 2 = 11520 := ⟨rfl, rfl, rfl, rfl⟩
