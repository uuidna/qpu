/-! # Qpu.Processing.QuantumComputer.Wiring
---
component: control wiring (IEC 60050-131 attenuator; Krinner et al. 2019, doi:10.1140/epjqt/s40507-019-0072-0)
---
The drive line from the room-temperature electronics to the qubit. An attenuator of power ratio A at a stage of temperature T_s
passes T_in/A of the noise reaching it and adds T_s(1 − 1/A), so each stage brings the line toward its own temperature and never
below it. Google states no attenuation per stage for its processors, so no chain is assumed here. Temperatures in microkelvin. -/

namespace Wiring

/-- the noise temperature past an attenuator of ratio `A` at a stage of temperature `Ts` -/
def through (Tin Ts A : Nat) : Nat := (Tin + Ts * (A - 1)) / A

/-- an attenuator never cools the line below its own stage, for every input, stage and ratio -/
theorem stage_floor (Tin Ts A : Nat) (hA : 0 < A) (h : Ts ≤ Tin) : Ts ≤ through Tin Ts A := by
  unfold through
  rw [Nat.le_div_iff_mul_le hA]
  have : Ts * A = Ts * (A - 1) + Ts := by rw [← Nat.mul_succ]; congr 1; omega
  omega

end Wiring
