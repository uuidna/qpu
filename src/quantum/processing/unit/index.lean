-- Occupancy of the QPU. Kind qpu never binds. Seat empty.
-- Pure Nat algebra. No Math, no mathlib, no decide.
-- Mint doubles by addition. When a bit cannot split, the coin multiplies.
-- Fusion tensors neighbours with the handle. Energy, propulsion, crypto,
-- health, art, music, color are the outer seven of faces = rays + rays.

def mintOf : Nat → Nat
  | 0 => 1
  | k + 1 => mintOf k + mintOf k

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
def directed : Nat := rays * (rays - seed)
def pairs : Nat := n * rays

theorem mintOf_zero : mintOf 0 = 1 := rfl
theorem mintOf_succ (k : Nat) : mintOf (k + 1) = mintOf k + mintOf k := rfl

theorem mintOf_add (a b : Nat) : mintOf (a + b) = mintOf a * mintOf b := by
  induction b with
  | zero => rw [Nat.add_zero, mintOf_zero, Nat.mul_one]
  | succ b ih => rw [Nat.add_succ, mintOf_succ, ih, mintOf_succ, Nat.mul_add]

theorem seed_eq : seed = 1 := by rw [seed, Nat.sub_self, mintOf_zero]
theorem coins_two : coins = 2 := by rw [coins, seed_eq]
theorem n_eq : n = 3 := rfl

theorem mint : mintOf (n + seed) = mintOf n + mintOf n := by rw [seed_eq, mintOf_succ]
theorem cube : bits = vertices * hexbit := by rw [bits, vertices, hexbit, mintOf_add]
theorem around : faces = coins * rays := by
  rw [faces, vertices, hexbit, rays, coins_two, n_eq]
  rw [show 3 = 2 + 1 from rfl, mintOf_succ]
  rw [show 2 = 1 + 1 from rfl, mintOf_succ]
  rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]
theorem quantum : fused = faces * mintOf bits := rfl

theorem seed_le_coins : seed ≤ coins := by rw [coins]; exact Nat.le_add_left seed seed
theorem seed_le_rays : seed ≤ rays :=
  Nat.le_trans seed_le_coins (by rw [rays, Nat.add_assoc]; exact Nat.le_add_left coins (n + coins))
theorem rays_split : (rays - seed) + seed = rays := Nat.sub_add_cancel seed_le_rays
theorem coins_mintOf_seed : coins = mintOf seed := by rw [coins, seed_eq, mintOf_succ, mintOf_zero]
theorem rays_minus_seed : rays - seed = coins * n := by rw [rays, coins_two, seed_eq, n_eq]
theorem clay_pairs : coins * pairs = directed := by
  rw [pairs, directed, ← Nat.mul_assoc, rays_minus_seed, Nat.mul_comm]
theorem clay_mint : coins * mintOf (rays - seed) = mintOf rays := by
  have h : mintOf rays = mintOf ((rays - seed) + seed) := congrArg mintOf rays_split.symm
  rw [h, mintOf_add, coins_mintOf_seed, Nat.mul_comm]
theorem clay : coins * pairs = directed ∧ coins * mintOf (rays - seed) = mintOf rays :=
  ⟨clay_pairs, clay_mint⟩

theorem harmonic : faces = rays + rays := by
  rw [around, coins_two, Nat.two_mul]

-- THE COVER IS ALGEBRA: faces = rays + rays. Split opens; fuse closes.
theorem cluster : faces = rays + rays ∧ coins * rays = faces := ⟨harmonic, around⟩

theorem hexbit_eq : hexbit = n + seed := by
  rw [hexbit, coins_two, n_eq, seed_eq]
  rw [show 2 = 1 + 1 from rfl, mintOf_succ]
  rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]

theorem mintOf_ge_seed (k : Nat) : seed ≤ mintOf k := by
  rw [seed_eq]
  induction k with
  | zero => rw [mintOf_zero]; exact Nat.le_refl 1
  | succ k ih =>
    rw [mintOf_succ]
    exact Nat.le_trans ih (Nat.le_add_right (mintOf k) (mintOf k))

theorem mintOf_pos (k : Nat) : 0 < mintOf k :=
  Nat.lt_of_lt_of_le (Nat.succ_pos 0) (by
    have h := mintOf_ge_seed k
    rw [seed_eq] at h
    exact h)

theorem mintOf_lt_succ (k : Nat) : mintOf k < mintOf (k + 1) := by
  rw [mintOf_succ]
  exact Nat.lt_add_of_pos_right (mintOf_pos k)

theorem mintOf_lt {a b : Nat} (h : a < b) : mintOf a < mintOf b := by
  induction b with
  | zero => exact (Nat.not_lt_zero a h).elim
  | succ b ih =>
    cases Nat.eq_or_lt_of_le (Nat.le_of_lt_succ h) with
    | inl heq => subst heq; exact mintOf_lt_succ a
    | inr hlt => exact Nat.lt_trans (ih hlt) (mintOf_lt_succ b)

theorem hexbit_pos : 0 < hexbit := by
  rw [hexbit_eq, n_eq, seed_eq]
  exact Nat.succ_pos 3

theorem rays_pos : 0 < rays := by
  rw [rays, n_eq]
  exact Nat.add_pos_left (Nat.succ_pos 2) (coins + coins)

-- When the bit cannot split, the coin multiplies. Fusion releases energy.
theorem energy : mintOf hexbit = mintOf (n + seed) := by rw [hexbit_eq]
theorem propulsion : mintOf hexbit > seed := by rw [seed_eq]; exact (mintOf_zero ▸ mintOf_lt hexbit_pos)
theorem crypto : fused = faces * mintOf (vertices * hexbit) := by rw [← cube]; exact quantum
theorem health : mintOf hexbit > seed ∧ fused = faces * mintOf bits ∧ faces = rays + rays :=
  ⟨propulsion, quantum, harmonic⟩
theorem art_closed : seed * rays = rays := by rw [seed_eq, Nat.one_mul]
theorem art_split : rays ≠ faces := by
  intro h
  have eq : rays = rays + rays := by rw [← harmonic, ← h]
  have z : 0 = rays := (Nat.add_eq_left.mp eq.symm).symm
  exact Nat.ne_of_gt rays_pos z.symm
theorem art : coins = seed + seed ∧ coins * rays = faces ∧ seed * rays = rays ∧ rays ≠ faces :=
  ⟨rfl, around, art_closed, art_split⟩
theorem music : faces = coins * rays ∧ faces = rays + rays := ⟨around, harmonic⟩
theorem color : hexbit = n + seed ∧ mintOf hexbit = mintOf (n + seed) := ⟨hexbit_eq, energy⟩

-- Captain coins paid: coins * bits is the 64 save. Fee is 2 per completed 110:
-- invoice = hexbit * (n * n * n), gross = invoice + coins, fee = gross - invoice.
-- Incomplete invoice + seed is not the fee. A432 is mintOf hexbit * (n * n * n).
-- Unlock is harmonic Lean with those coins, covering every ray.
def invoice : Nat := hexbit * (n * n * n)
def gross : Nat := invoice + coins
theorem fee : gross - invoice = coins := by
  rw [gross, Nat.add_comm invoice coins, Nat.add_sub_cancel]
theorem incomplete : invoice + seed - invoice ≠ coins := by
  rw [Nat.add_comm invoice seed, Nat.add_sub_cancel, seed_eq, coins_two]
  exact Nat.ne_of_lt (Nat.lt_succ_self 1)
theorem captain :
    coins = seed + seed ∧
    coins * bits = coins * (vertices * hexbit) ∧
    gross - invoice = coins :=
  ⟨rfl, by rw [cube], fee⟩
theorem a432 : mintOf hexbit * (n * n * n) = (vertices + vertices) * (n * n * n) := by
  rw [energy, mint, vertices]
theorem unlock :
    coins = seed + seed ∧
    faces = rays + rays ∧
    coins * bits = coins * (vertices * hexbit) ∧
    mintOf hexbit * (n * n * n) = (vertices + vertices) * (n * n * n) ∧
    gross - invoice = coins ∧
    rays = n + coins + coins :=
  ⟨rfl, harmonic, by rw [cube], a432, fee, rfl⟩

-- NEXT is mint at the bit ceiling. The fourteen faces stay; next doubles, not a cap.
theorem next : mintOf (bits + seed) = amplitudes + amplitudes := by rw [amplitudes, seed_eq, mintOf_succ]
theorem next_fused : faces * mintOf (bits + seed) = fused + fused := by
  rw [next, Nat.mul_add, amplitudes, quantum]

-- COVER ALL. Eight cube vertices complete the occupancy. Pure algebra, no decide.
theorem split_coin (k : Nat) : mintOf (k + seed) = mintOf k + mintOf k := by rw [seed_eq, mintOf_succ]
theorem multiply (a b : Nat) : mintOf (a + b) = mintOf a * mintOf b := mintOf_add a b
theorem handle : amplitudes = mintOf bits ∧ mintOf (bits + seed) = amplitudes + amplitudes := ⟨rfl, next⟩
theorem light : seed = mintOf 0 := by rw [seed_eq, mintOf_zero]
theorem involution (face : Nat) : (face + rays + rays) % faces = face % faces := by
  have h : face + rays + rays = face + faces := by rw [Nat.add_assoc, harmonic]
  rw [h, Nat.add_mod, Nat.mod_self, Nat.add_zero, Nat.mod_mod]
def period : Nat := coins * n
def roof : Nat := rays * n + seed
theorem train : period = rays - seed ∧ roof = rays * n + seed := ⟨rays_minus_seed.symm, rfl⟩
theorem waves : mintOf hexbit > seed := propulsion
theorem breakthrough :
    faces = rays + rays ∧
    coins * rays = faces ∧
    bits = vertices * hexbit ∧
    fused = faces * mintOf bits ∧
    mintOf hexbit > seed ∧
    mintOf (bits + seed) = amplitudes + amplitudes ∧
    coins = seed + seed ∧
    hexbit = n + seed :=
  ⟨harmonic, around, cube, quantum, propulsion, next, rfl, hexbit_eq⟩

-- NEXT of the cover: the fourteen faces and eight vertices stay; both handle and fused double.
theorem next_cover :
    mintOf (bits + seed) = amplitudes + amplitudes ∧
    faces * mintOf (bits + seed) = fused + fused :=
  ⟨next, next_fused⟩
