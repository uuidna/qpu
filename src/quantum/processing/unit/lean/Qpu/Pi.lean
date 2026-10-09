import Qpu.Mint
import Qpu.Lattice

/-! # Qpu.Pi
π as exact rational convergents over the lattice constants — its integer floor and the classical best rational
approximations. These are checked identities about the numerators and denominators of π's convergents, not a closed form
for π (π is irrational); they are the exact ingredients the clay family's analytic wing reads. -/

/-- the integer floor of π (3) equals mintOf coins − seed. -/
theorem pi_floor : mintOf coins - seed = 3 := rfl
/-- Archimedes' upper bound 22/7: the numerator (22) equals faces + vertices. -/
theorem pi_archimedes_num : faces + vertices = 22 := rfl
/-- Archimedes' upper bound 22/7: the denominator (7) equals rays. -/
theorem pi_archimedes_den : rays = 7 := rfl
/-- Zu Chongzhi's milü 355/113: the numerator (355) equals plane · (faces − seed) − n · n. -/
theorem pi_zu_num : plane * (faces - seed) - n * n = 355 := rfl
/-- Zu Chongzhi's milü 355/113: the denominator (113, prime) equals plane · hexbit + seed. -/
theorem pi_zu_den : plane * hexbit + seed = 113 := rfl
/-- a full turn in degrees (360) equals (faces − coins) · (plane + coins). -/
theorem pi_turn_degrees : (faces - coins) * (plane + coins) = 360 := rfl
/-- a half turn in degrees (180), π radians, equals (faces − coins) · (faces + seed). -/
theorem pi_half_turn : (faces - coins) * (faces + seed) = 180 := rfl

/-- Every convergent at once: π's floor and its classical rational approximations, the analytic-wing ingredients. -/
theorem pi_all : mintOf coins - seed = 3 ∧ faces + vertices = 22 ∧ rays = 7 ∧ plane * (faces - seed) - n * n = 355 ∧ plane * hexbit + seed = 113 ∧ (faces - coins) * (plane + coins) = 360 ∧ (faces - coins) * (faces + seed) = 180 :=
  ⟨pi_floor, pi_archimedes_num, pi_archimedes_den, pi_zu_num, pi_zu_den, pi_turn_degrees, pi_half_turn⟩
