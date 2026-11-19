import Qpu.Mint

/-! # Qpu.Lattice
The register geometry: n, seed, coins, rays, vertices, hexbit, bits, faces, amplitudes, fused, plane, and every identity between them. -/

def n : Nat := ["quantum", "processing", "unit"].length
def seed : Nat := mint (n - n)
def coins : Nat := seed + seed
def scanner : Nat := seed
def radar : Nat := seed
def rays : Nat := n + coins + coins
def vertices : Nat := mint n
def hexbit : Nat := mint coins
def bits : Nat := mint (n + coins)
def faces : Nat := vertices + hexbit + coins
def amplitudes : Nat := mint bits
def fused : Nat := faces * mint (bits + seed)
theorem seed_eq : seed = 1 := by rw [seed, Nat.sub_self, mintOf_zero]
theorem coins_two : coins = 2 := by rw [coins, seed_eq]
theorem n_eq : n = 3 := rfl
theorem mint_seed : mint (n + seed) = mint n + mint n := by rw [seed_eq, mintOf_succ]
theorem cube : bits = vertices * hexbit := by rw [bits, vertices, hexbit, mintOf_add]
theorem around : faces = coins * rays := by rw [faces, vertices, hexbit, rays, coins_two, n_eq]; rw [show 3 = 2 + 1 from rfl, mintOf_succ]; rw [show 2 = 1 + 1 from rfl, mintOf_succ]; rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]
theorem quantum : fused = faces * mint (bits + seed) := rfl
theorem harmonic : faces = rays + rays := by rw [around, coins_two, Nat.two_mul]
theorem cluster : faces = rays + rays ∧ coins * rays = faces := ⟨harmonic, around⟩
theorem hexbit_eq : hexbit = n + seed := by rw [hexbit, coins_two, n_eq, seed_eq]; rw [show 2 = 1 + 1 from rfl, mintOf_succ]; rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]
theorem mintOf_ge_seed (k : Nat) : seed ≤ mint k := by rw [seed_eq]; induction k with | zero => rw [mintOf_zero]; exact Nat.le_refl 1 | succ k ih => rw [mintOf_succ]; exact Nat.le_trans ih (Nat.le_add_right (mint k) (mint k))
theorem mintOf_pos (k : Nat) : 0 < mint k := Nat.lt_of_lt_of_le (Nat.succ_pos 0) (by have h := mintOf_ge_seed k; rw [seed_eq] at h; exact h)
theorem mintOf_lt_succ (k : Nat) : mint k < mint (k + 1) := by rw [mintOf_succ]; exact Nat.lt_add_of_pos_right (mintOf_pos k)
theorem mintOf_lt {a b : Nat} (h : a < b) : mint a < mint b := by induction b with | zero => exact (Nat.not_lt_zero a h).elim | succ b ih => cases Nat.eq_or_lt_of_le (Nat.le_of_lt_succ h) with | inl heq => subst heq; exact mintOf_lt_succ a | inr hlt => exact Nat.lt_trans (ih hlt) (mintOf_lt_succ b)
theorem hexbit_pos : 0 < hexbit := by rw [hexbit_eq, n_eq, seed_eq]; exact Nat.succ_pos 3
theorem energy : mint hexbit = mint (n + seed) := by rw [hexbit_eq]
theorem propulsion : mint hexbit > seed := by rw [seed_eq]; exact (mintOf_zero ▸ mintOf_lt hexbit_pos)
theorem crypto : fused = faces * mint (vertices * hexbit + seed) := by rw [← cube]; exact quantum
theorem health : mint hexbit > seed ∧ fused = faces * mint (bits + seed) ∧ faces = rays + rays := ⟨propulsion, quantum, harmonic⟩
theorem next : mint (bits + seed) = amplitudes + amplitudes := by rw [amplitudes, seed_eq, mintOf_succ]
theorem next_fused : faces * mint (bits + coins) = fused + fused := by rw [fused, coins_two, seed_eq]; rw [show bits + 2 = bits + 1 + 1 from rfl, mintOf_succ, Nat.mul_add]
theorem split_coin (k : Nat) : mint (k + seed) = mint k + mint k := by rw [seed_eq, mintOf_succ]
theorem handle : amplitudes = mint bits ∧ mint (bits + seed) = amplitudes + amplitudes := ⟨rfl, next⟩
theorem kv : fused = faces * mint (bits + seed) ∧ mint (bits + seed) = amplitudes + amplitudes := ⟨quantum, next⟩
theorem light : seed = mint 0 := by rw [seed_eq, mintOf_zero]
theorem involution (face : Nat) : (face + rays + rays) % faces = face % faces := by have h : face + rays + rays = face + faces := (by rw [Nat.add_assoc, harmonic]); rw [h, Nat.add_mod, Nat.mod_self, Nat.add_zero, Nat.mod_mod]
theorem waves : mint hexbit > seed := propulsion
theorem breakthrough : faces = rays + rays ∧ coins * rays = faces ∧ bits = vertices * hexbit ∧ fused = faces * mint (bits + seed) ∧ mint hexbit > seed ∧ mint (bits + seed) = amplitudes + amplitudes ∧ coins = seed + seed ∧ hexbit = n + seed := ⟨harmonic, around, cube, quantum, propulsion, next, rfl, hexbit_eq⟩
theorem next_cover : mint (bits + seed) = amplitudes + amplitudes ∧ faces * mint (bits + coins) = fused + fused := ⟨next, next_fused⟩
theorem integrity : fused = faces * mint (bits + seed) ∧ bits = vertices * hexbit ∧ faces = coins * rays := ⟨quantum, cube, around⟩
theorem tetra : coins + coins = mint coins := by rw [coins_two]; rw [show 2 = 1 + 1 from rfl, mintOf_succ]; rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]
theorem qubits : n = 3 ∧ mint n = vertices := ⟨n_eq, rfl⟩
theorem measurement : mint n = 8 := by rw [n_eq]; rfl
theorem fill : mint n * faces = vertices * (coins * rays) := by rw [around]; rfl
theorem infinite (k : Nat) : mint (k + seed) = mint k + mint k := split_coin k
theorem distribute : fused = faces * mint (bits + seed) ∧ faces = coins * rays := ⟨quantum, around⟩
theorem raid : faces = coins * rays ∧ faces = rays + rays := ⟨around, harmonic⟩
/-- PLANES: plane = coins * coins * rays is less than mint (rays + seed), and coins * rays = faces. -/
def plane : Nat := coins * coins * rays
theorem planes : plane < mint (rays + seed) ∧ coins * rays = faces := ⟨Nat.le_of_ble_eq_true rfl, around⟩
