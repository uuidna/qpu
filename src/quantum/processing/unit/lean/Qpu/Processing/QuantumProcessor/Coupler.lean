/-! # Qpu.Processing.QuantumProcessor.Coupler
---
component: tunable coupler (ISO/IEC 4879:2024 3.4.8; Yan et al. 2018, doi:10.1103/PhysRevApplied.10.054062)
---
A transmon between two qubits, tuned by its own coil. The qubits couple directly by g₁₂ and through the coupler by g₁g₂/Δ, of
opposite sign, so the coupling is off where g₁₂·Δ = g₁g₂. Sycamore tunes it from 55 MHz to −40 MHz, through zero (arXiv:1910.11333,
SI I). Willow performs its CZ in 42 ns on the 105-qubit processor and 37 ns on the 72-qubit one (arXiv:2408.13687, SI I); a CZ made
of one |11⟩ ↔ |02⟩ cycle takes t = 1/(2√2 g), so those times put g at 8.4 MHz and 9.5 MHz. Couplings in tenths of a MHz, times in ns. -/

namespace Coupler

/-- the coupling is off at detuning Δ when the direct and mediated terms cancel, for every design -/
theorem off (g₁ g₂ g₁₂ Δ : Nat) (h : g₁₂ * Δ = g₁ * g₂) : g₁ * g₂ - g₁₂ * Δ = 0 := by omega

/-- 8g²t² = 1 lies at g in [x, x + 1) tenths of a MHz for a CZ of `t` ns -/
def cz (t x : Nat) : Prop := 8 * x * x * t * t ≤ 100000000 ∧ 100000000 < 8 * (x + 1) * (x + 1) * t * t
instance (t x : Nat) : Decidable (cz t x) := by unfold cz; infer_instance

/-- Willow's measured CZ times, 42 ns and 37 ns, put the exchange coupling at 8.4 MHz and 9.5 MHz -/
theorem willow : cz 42 84 ∧ cz 37 95 := by decide

end Coupler
