/-! # Qpu.Processing.QuantumProcessor.ReadoutResonator
---
component: readout resonator (ISO/IEC 4879:2024 3.3.15 measurement; Koch et al. 2007, doi:10.1103/PhysRevA.76.042319)
---
Each qubit is read through its own resonator: detuned by Δ, the qubit shifts the resonator by χ = g²α / (Δ(Δ + α)), and the
shift is what measurement reads. Sycamore's measured medians (arXiv:1910.11333, SI Table 2) are g = 72.3 MHz, a qubit at
5 750 MHz during readout, a readout drive at 4 618 MHz and an anharmonicity of −208 MHz; it states no χ, and these put |χ| at
1.03 MHz, against its measured linewidth κ of 0.64 MHz. Couplings are in tenths of a MHz, detunings in MHz. -/

namespace ReadoutResonator

/-- |χ| = g²|α| / (Δ(Δ − |α|)) lies in [x, x + 1) hundredths of a MHz, for g in tenths of a MHz -/
def shift (g α Δ x : Nat) : Prop := x * (Δ * (Δ - α)) ≤ g * g * α ∧ g * g * α < (x + 1) * (Δ * (Δ - α))
instance (g α Δ x : Nat) : Decidable (shift g α Δ x) := by unfold shift; infer_instance

/-- Sycamore's measured g, α and detuning put the dispersive shift at 1.03 MHz -/
theorem sycamore : shift 723 208 (5750 - 4618) 103 := by decide

end ReadoutResonator
