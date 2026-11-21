import Qpu.Physics.PhysicalConstant

/-! # Qpu.Information.PhysicalQubit.JosephsonJunction
---
component: physical qubit: Josephson junction (ISO/IEC 4879:2024 3.3.5; IEC 60050-815)
---
The nonlinear element of every superconducting qubit. With h and e exact (`PhysicalConstant`), the flux quantum Φ₀ = h / 2e
and the Josephson constant K_J = 2e / h are exact rationals, every identity stated cross-multiplied in integers. -/

namespace JosephsonJunction
open PhysicalConstant

def hExp : Nat := 42
def eExp : Nat := 28

/-- the flux quantum Φ₀ = h / 2e, as a fraction: numerator h·10^eExp, denominator 2e·10^hExp (in webers) -/
def phi0Num : Nat := hNum * 10 ^ eExp
def phi0Den : Nat := 2 * eNum * 10 ^ hExp

/-- Φ₀ · 2e = h, exactly: the flux quantum is the Planck constant over twice the elementary charge -/
theorem flux_quantum_definition : phi0Num * (2 * eNum) * 10 ^ hExp = hNum * phi0Den * 10 ^ eExp := by
  unfold phi0Num phi0Den; decide

/-- Φ₀ = 2.067 833 848 … × 10⁻¹⁵ Wb: it lies in [2 067 833 848, 2 067 833 849] × 10⁻²⁴ -/
theorem flux_quantum_value :
    2067833848 * phi0Den ≤ phi0Num * 10 ^ 24 ∧ phi0Num * 10 ^ 24 < 2067833849 * phi0Den := by
  unfold phi0Num phi0Den; decide

/-- the Josephson constant K_J = 2e / h = 483 597.848 4 … GHz/V: 2e·10^hExp / (h·10^eExp) in [483 597 848 4, 483 597 848 5] × 10⁻⁴ GHz/V -/
theorem josephson_constant_value :
    4835978484 * (hNum * 10 ^ eExp) * 10 ^ 9 ≤ 2 * eNum * 10 ^ hExp * 10 ^ 4 ∧
    2 * eNum * 10 ^ hExp * 10 ^ 4 < 4835978485 * (hNum * 10 ^ eExp) * 10 ^ 9 := by decide

/-- the Josephson relations are reciprocal: Φ₀ · K_J = 1 -/
theorem flux_quantum_josephson_reciprocal : phi0Num * (2 * eNum * 10 ^ hExp) = phi0Den * (hNum * 10 ^ eExp) := by
  unfold phi0Num phi0Den; decide

end JosephsonJunction
