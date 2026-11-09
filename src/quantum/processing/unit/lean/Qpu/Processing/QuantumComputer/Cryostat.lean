import Qpu.Physics.PhysicalConstant

/-! # Qpu.Processing.QuantumComputer.Cryostat
---
component: quantum computer: dilution refrigerator (ISO/IEC 4879:2024 3.4.10; SI 2019 kelvin)
---
Why the qubits sit at millikelvin: a qubit stays in its ground state when its transition energy h·f is many times the thermal
energy k_B·T. With h and k_B exact (`PhysicalConstant`), the comparison is exact integer arithmetic. Frequencies are in hertz and temperatures in microkelvin. -/

namespace Cryostat
open PhysicalConstant

/-- `h·f ≥ r · k_B·T`, with `f` in hertz and `T` in microkelvin, cross-multiplied in integers:
h·f = hNum·f·10⁻⁴², k_B·T = kNum·T·10⁻²⁹·10⁻⁶ = kNum·T·10⁻³⁵ -/
def coldEnough (f T r : Nat) : Prop := r * kNum * T * 10000000 ≤ hNum * f

instance (f T r : Nat) : Decidable (coldEnough f T r) := by unfold coldEnough; infer_instance

/-- at a mixing chamber of 10 mK, a qubit at 5 GHz, the floor of the 5-7 GHz band Sycamore operates in (arXiv:1910.11333, SI VI.2.1),, has h·f at least 19 times k_B·T -/
theorem qubit_cold_at_ten_millikelvin : coldEnough 5000000000 10000 19 := by decide

/-- the margin grows as the stage gets colder or the qubit higher: at every T ≤ 10 mK and every f ≥ 5 GHz, h·f ≥ 19 · k_B·T -/
theorem qubit_cold_below (f T : Nat) (hf : 5000000000 ≤ f) (hT : T ≤ 10000) : coldEnough f T 19 := by
  unfold coldEnough kNum hNum
  have h1 : 19 * 1380649 * T * 10000000 ≤ 19 * 1380649 * 10000 * 10000000 := by
    apply Nat.mul_le_mul_right; apply Nat.mul_le_mul_left; exact hT
  have h2 : 662607015 * 5000000000 ≤ 662607015 * f := Nat.mul_le_mul_left _ hf
  have h3 : 19 * 1380649 * 10000 * 10000000 ≤ 662607015 * 5000000000 := by decide
  exact Nat.le_trans h1 (Nat.le_trans h3 h2)

/-- at room temperature (300 K) the same qubit is far from cold: h·f is below k_B·T -/
theorem qubit_hot_at_room_temperature : ¬ coldEnough 5000000000 300000000 1 := by decide

end Cryostat
