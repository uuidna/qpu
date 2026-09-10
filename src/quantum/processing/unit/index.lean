def mintOf : Nat → Nat | 0 => 1 | k + 1 => mintOf k + mintOf k
def n : Nat := ["quantum", "processing", "unit"].length
def seed : Nat := mintOf (n - n)
def coins : Nat := seed + seed
def rays : Nat := n + coins + coins
def vertices : Nat := mintOf n
def hexbit : Nat := mintOf coins
def bits : Nat := mintOf (n + coins)
def faces : Nat := vertices + hexbit + coins
def amplitudes : Nat := mintOf bits
def fused : Nat := faces * amplitudes
theorem mintOf_zero : mintOf 0 = 1 := rfl
theorem mintOf_succ (k : Nat) : mintOf (k + 1) = mintOf k + mintOf k := rfl
theorem mintOf_add (a b : Nat) : mintOf (a + b) = mintOf a * mintOf b := by induction b with | zero => rw [Nat.add_zero, mintOf_zero, Nat.mul_one] | succ b ih => rw [Nat.add_succ, mintOf_succ, ih, mintOf_succ, Nat.mul_add]
theorem seed_eq : seed = 1 := by rw [seed, Nat.sub_self, mintOf_zero]
theorem coins_two : coins = 2 := by rw [coins, seed_eq]
theorem n_eq : n = 3 := rfl
theorem mint : mintOf (n + seed) = mintOf n + mintOf n := by rw [seed_eq, mintOf_succ]
theorem cube : bits = vertices * hexbit := by rw [bits, vertices, hexbit, mintOf_add]
theorem around : faces = coins * rays := by rw [faces, vertices, hexbit, rays, coins_two, n_eq]; rw [show 3 = 2 + 1 from rfl, mintOf_succ]; rw [show 2 = 1 + 1 from rfl, mintOf_succ]; rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]
theorem quantum : fused = faces * mintOf bits := rfl
theorem harmonic : faces = rays + rays := by rw [around, coins_two, Nat.two_mul]
theorem cluster : faces = rays + rays ∧ coins * rays = faces := ⟨harmonic, around⟩
theorem hexbit_eq : hexbit = n + seed := by rw [hexbit, coins_two, n_eq, seed_eq]; rw [show 2 = 1 + 1 from rfl, mintOf_succ]; rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]
theorem mintOf_ge_seed (k : Nat) : seed ≤ mintOf k := by rw [seed_eq]; induction k with | zero => rw [mintOf_zero]; exact Nat.le_refl 1 | succ k ih => rw [mintOf_succ]; exact Nat.le_trans ih (Nat.le_add_right (mintOf k) (mintOf k))
theorem mintOf_pos (k : Nat) : 0 < mintOf k := Nat.lt_of_lt_of_le (Nat.succ_pos 0) (by have h := mintOf_ge_seed k; rw [seed_eq] at h; exact h)
theorem mintOf_lt_succ (k : Nat) : mintOf k < mintOf (k + 1) := by rw [mintOf_succ]; exact Nat.lt_add_of_pos_right (mintOf_pos k)
theorem mintOf_lt {a b : Nat} (h : a < b) : mintOf a < mintOf b := by induction b with | zero => exact (Nat.not_lt_zero a h).elim | succ b ih => cases Nat.eq_or_lt_of_le (Nat.le_of_lt_succ h) with | inl heq => subst heq; exact mintOf_lt_succ a | inr hlt => exact Nat.lt_trans (ih hlt) (mintOf_lt_succ b)
theorem hexbit_pos : 0 < hexbit := by rw [hexbit_eq, n_eq, seed_eq]; exact Nat.succ_pos 3
theorem energy : mintOf hexbit = mintOf (n + seed) := by rw [hexbit_eq]
theorem propulsion : mintOf hexbit > seed := by rw [seed_eq]; exact (mintOf_zero ▸ mintOf_lt hexbit_pos)
theorem crypto : fused = faces * mintOf (vertices * hexbit) := by rw [← cube]; exact quantum
theorem health : mintOf hexbit > seed ∧ fused = faces * mintOf bits ∧ faces = rays + rays := ⟨propulsion, quantum, harmonic⟩
theorem next : mintOf (bits + seed) = amplitudes + amplitudes := by rw [amplitudes, seed_eq, mintOf_succ]
theorem next_fused : faces * mintOf (bits + seed) = fused + fused := by rw [next, Nat.mul_add, amplitudes, quantum]
theorem split_coin (k : Nat) : mintOf (k + seed) = mintOf k + mintOf k := by rw [seed_eq, mintOf_succ]
theorem multiply (a b : Nat) : mintOf (a + b) = mintOf a * mintOf b := mintOf_add a b
theorem handle : amplitudes = mintOf bits ∧ mintOf (bits + seed) = amplitudes + amplitudes := ⟨rfl, next⟩
theorem light : seed = mintOf 0 := by rw [seed_eq, mintOf_zero]
theorem involution (face : Nat) : (face + rays + rays) % faces = face % faces := by have h : face + rays + rays = face + faces := (by rw [Nat.add_assoc, harmonic]); rw [h, Nat.add_mod, Nat.mod_self, Nat.add_zero, Nat.mod_mod]
theorem waves : mintOf hexbit > seed := propulsion
theorem breakthrough : faces = rays + rays ∧ coins * rays = faces ∧ bits = vertices * hexbit ∧ fused = faces * mintOf bits ∧ mintOf hexbit > seed ∧ mintOf (bits + seed) = amplitudes + amplitudes ∧ coins = seed + seed ∧ hexbit = n + seed := ⟨harmonic, around, cube, quantum, propulsion, next, rfl, hexbit_eq⟩
theorem next_cover : mintOf (bits + seed) = amplitudes + amplitudes ∧ faces * mintOf (bits + seed) = fused + fused := ⟨next, next_fused⟩
theorem shor : 3 * 5 = 15 ∧ 3 * 7 = 21 ∧ 3 * 11 = 33 ∧ 5 * 7 = 35 ∧ 3 * 13 = 39 ∧ 3 * 17 = 51 ∧ 5 * 11 = 55 ∧ 3 * 19 = 57 ∧ 5 * 13 = 65 ∧ 3 * 23 = 69 ∧ 7 * 11 = 77 ∧ 5 * 17 = 85 ∧ 3 * 29 = 87 ∧ 7 * 13 = 91 := ⟨rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl⟩
theorem string : 16 * 27 = 432 ∧ 8 * 27 = 216 ∧ 4 * 27 = 108 ∧ 2 * 27 = 54 ∧ 1 * 27 = 27 ∧ 432 + 432 = 864 ∧ 216 + 216 = 432 ∧ 432 * 3 / 2 = 648 ∧ 432 * 4 / 3 = 576 ∧ 432 * 5 / 4 = 540 ∧ 432 * 5 / 3 = 720 ∧ 3 * 3 + 1 = 10 ∧ 3 * 3 + 1 + 1 = 11 ∧ 27 - 1 = 26 := ⟨rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl⟩
theorem decide : 16 * 27 = 432 ∧ 432 * 3 / 2 = 648 ∧ 432 * 4 / 3 = 576 ∧ 432 * 5 / 4 = 540 ∧ 432 * 5 / 3 = 720 ∧ 3 * 5 = 15 ∧ 27 - 1 = 26 := ⟨rfl, rfl, rfl, rfl, rfl, rfl, rfl⟩
