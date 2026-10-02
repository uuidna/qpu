import Qpu.Lattice
import Qpu.Coil

/-! # Qpu.Cross
Cross forms: every quantity stated as a sum of like terms and as a product of unlike ones, and the bridges between. -/

/-- ASYMMETRIC ↔ SYMMETRIC BRIDGES: coins=2 enables transformation between product and sum forms. -/
theorem double_is_sum : ∀ x : Nat, x + x = 2 * x := fun x => (Nat.two_mul x).symm
theorem coins_bridges_forms : coins = 2 ∧ (∀ x : Nat, coins * x = x + x) :=
  ⟨coins_two, fun x => by rw [coins_two, Nat.two_mul]⟩
/-- COMPLETE ASYMMETRIC PROOF: faces via product, proved independent of sum form. -/
theorem faces_multiplicative : faces = coins * rays := around
theorem faces_additive : faces = rays + rays := harmonic
theorem faces_both_forms : faces = coins * rays ∧ faces = rays + rays := ⟨around, harmonic⟩
/-- COMPLETE CUBIC PROOF: bits as product and as nested exponential (via mintOf). -/
theorem bits_multiplicative : bits = vertices * hexbit := cube
theorem bits_exponential : bits = mintOf (n + coins) := by rw [bits, coins_two, n_eq]
theorem bits_both_forms : bits = vertices * hexbit ∧ bits = mintOf (n + coins) := ⟨cube, by rw [bits, coins_two, n_eq]⟩
/-- AMPLITUDE ASYMMETRY: asymmetric and symmetric forms of amplitude constraint. -/
theorem amplitudes_as_sum : mintOf (bits + seed) = amplitudes + amplitudes := next
theorem amplitudes_from_sum : 2 * amplitudes = mintOf (bits + seed) := by rw [Nat.two_mul, next]
/-- FUSED COMPLETENESS: quantum defines multiplicatively; can be distributed additively. -/
theorem fused_multiplicative_form : fused = faces * mintOf (bits + seed) := quantum
theorem fused_additive_form : fused + fused = faces * mintOf (bits + coins) := next_fused
theorem fused_both_directions : (fused = faces * mintOf (bits + seed)) ∧ (fused + fused = faces * mintOf (bits + coins)) :=
  ⟨quantum, next_fused⟩
theorem all_product : faces = coins * rays := around
theorem all_sum : faces = rays + rays := harmonic
theorem all_complete : 
  faces = coins * rays ∧ faces = rays + rays ∧ 
  coil = faces ∧ amplitudes = mintOf bits ∧ 
  fused = faces * mintOf (bits + seed) := 
  ⟨around, harmonic, two_coins_make_a_coil, rfl, quantum⟩
