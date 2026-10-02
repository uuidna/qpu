import Qpu.Lattice

/-! # Qpu.Coil
Theory, practice and the coil: two coins make a coil, one plus six, clay, fusion. -/

def theory : Nat := seed
def practice : Nat := seed
def coil : Nat := coins * rays
theorem follow_the_coins (app : Nat) : app + coins = app + theory + practice := by rw [theory, practice, coins, ← Nat.add_assoc]
theorem two_coins_make_a_coil : coil = faces := by rw [coil, around]
theorem electronics : coil = faces := two_coins_make_a_coil
theorem coil_efficiency : coil = faces ∧ faces = rays + rays ∧ coins * rays = faces := ⟨two_coins_make_a_coil, harmonic, around⟩
theorem next_coil : coil * mintOf (bits + coins) = fused + fused := by rw [two_coins_make_a_coil]; exact next_fused
theorem one_plus_six : seed + (mintOf n - coins) = rays := by rw [rays, n_eq, coins_two, seed_eq]; rw [show mintOf 3 = 8 from rfl]
theorem two_x_seven_coins : coins * rays = (seed + (mintOf n - coins)) * coins := by rw [one_plus_six, Nat.mul_comm]
theorem clay : coins * rays = (seed + (mintOf n - coins)) * coins ∧ (seed + (mintOf n - coins)) * coins = coil := ⟨two_x_seven_coins, by rw [← two_x_seven_coins]; rfl⟩
theorem fusion : fused = faces * mintOf (bits + seed) ∧ faces = rays + rays := ⟨quantum, harmonic⟩
