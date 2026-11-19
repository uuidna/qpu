import Qpu.Physics.PhysicalConstant

/-! # Qpu.Information.PhysicalQubit.Transmon
---
component: physical qubit, transmon (ISO/IEC 4879:2024 3.3.5; Koch et al. 2007, doi:10.1103/PhysRevA.76.042319)
---
A Josephson junction shunted by a capacitance C. Its charging energy is E_C/h = e²/2Ch, its frequency f₀₁ = √(8 E_J E_C) − E_C, its
anharmonicity −E_C to first order, and the transmon regime E_J/E_C ≥ 50 suppresses charge noise. Sycamore's measured medians
(Arute et al. 2019, arXiv:1910.11333, SI Table 2) are a maximum frequency of 6 924 MHz and an anharmonicity of −208 MHz: they put
E_C/h at 208 MHz, so C is 93.1 fF and E_J/h is 30 569 MHz, 147 times E_C, deep in the regime. Frequencies are in MHz. -/

namespace Transmon
open PhysicalConstant

/-- E_C/h for a shunt of `C` attofarads lies in [f, f + 1) MHz: e²/(2Ch) = eNum²·10⁴/(2·C·hNum) Hz -/
def charging (C f : Nat) : Prop :=
  f * 1000000 * (2 * C * hNum) ≤ eNum * eNum * 10000 ∧ eNum * eNum * 10000 < (f + 1) * 1000000 * (2 * C * hNum)
instance (C f : Nat) : Decidable (charging C f) := by unfold charging; infer_instance

/-- f₀₁ = ⌊√(8 E_J E_C)⌋ − E_C -/
def frequency (EJ EC f : Nat) : Prop := (f + EC) * (f + EC) ≤ 8 * EJ * EC ∧ 8 * EJ * EC < (f + EC + 1) * (f + EC + 1)
instance (EJ EC f : Nat) : Decidable (frequency EJ EC f) := by unfold frequency; infer_instance

/-- Sycamore's measured 6 924 MHz and −208 MHz: 93.1 fF gives E_C/h = 208 MHz, E_J/h = 30 569 MHz gives f₀₁, past 50 E_C -/
theorem sycamore : charging 93100 208 ∧ frequency 30569 208 6924 ∧ 50 * 208 < 30569 := by decide

/-- at E_J = 50 E_C exactly, f₀₁ = 19 E_C: √(8 · 50 · E_C²) = 20 E_C, for every E_C -/
theorem frequency_at_fifty (EC : Nat) : (19 * EC + EC) * (19 * EC + EC) = 8 * (50 * EC) * EC := by
  rw [show 19 * EC + EC = 20 * EC by omega, Nat.mul_mul_mul_comm, Nat.mul_assoc 8, Nat.mul_assoc 50, ← Nat.mul_assoc 8]

end Transmon
