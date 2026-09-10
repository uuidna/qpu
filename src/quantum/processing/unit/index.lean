def mintOf : Nat → Nat | 0 => 1 | k + 1 => mintOf k + mintOf k
def chooseOf : Nat → Nat → Nat | _, 0 => 1 | 0, _ + 1 => 0 | n + 1, k + 1 => chooseOf n (k + 1) + chooseOf n k
def n : Nat := ["quantum", "processing", "unit"].length
def seed : Nat := mintOf (n - n)
def coins : Nat := seed + seed
def rays : Nat := n + coins + coins
def vertices : Nat := mintOf n
def hexbit : Nat := mintOf coins
def bits : Nat := mintOf (n + coins)
def faces : Nat := vertices + hexbit + coins
def amplitudes : Nat := mintOf bits
def fused : Nat := faces * mintOf (bits + seed)
theorem mintOf_zero : mintOf 0 = 1 := rfl
theorem mintOf_succ (k : Nat) : mintOf (k + 1) = mintOf k + mintOf k := rfl
theorem mintOf_add (a b : Nat) : mintOf (a + b) = mintOf a * mintOf b := by induction b with | zero => rw [Nat.add_zero, mintOf_zero, Nat.mul_one] | succ b ih => rw [Nat.add_succ, mintOf_succ, ih, mintOf_succ, Nat.mul_add]
theorem seed_eq : seed = 1 := by rw [seed, Nat.sub_self, mintOf_zero]
theorem coins_two : coins = 2 := by rw [coins, seed_eq]
theorem n_eq : n = 3 := rfl
theorem mint : mintOf (n + seed) = mintOf n + mintOf n := by rw [seed_eq, mintOf_succ]
theorem cube : bits = vertices * hexbit := by rw [bits, vertices, hexbit, mintOf_add]
theorem around : faces = coins * rays := by rw [faces, vertices, hexbit, rays, coins_two, n_eq]; rw [show 3 = 2 + 1 from rfl, mintOf_succ]; rw [show 2 = 1 + 1 from rfl, mintOf_succ]; rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]
theorem quantum : fused = faces * mintOf (bits + seed) := rfl
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
theorem crypto : fused = faces * mintOf (vertices * hexbit + seed) := by rw [← cube]; exact quantum
theorem health : mintOf hexbit > seed ∧ fused = faces * mintOf (bits + seed) ∧ faces = rays + rays := ⟨propulsion, quantum, harmonic⟩
theorem next : mintOf (bits + seed) = amplitudes + amplitudes := by rw [amplitudes, seed_eq, mintOf_succ]
theorem next_fused : faces * mintOf (bits + coins) = fused + fused := by
  rw [fused, coins_two, seed_eq]
  rw [show bits + 2 = bits + 1 + 1 from rfl, mintOf_succ, Nat.mul_add]
theorem split_coin (k : Nat) : mintOf (k + seed) = mintOf k + mintOf k := by rw [seed_eq, mintOf_succ]
theorem multiply (a b : Nat) : mintOf (a + b) = mintOf a * mintOf b := mintOf_add a b
theorem handle : amplitudes = mintOf bits ∧ mintOf (bits + seed) = amplitudes + amplitudes := ⟨rfl, next⟩
theorem kv : fused = faces * mintOf (bits + seed) ∧ mintOf (bits + seed) = amplitudes + amplitudes := ⟨quantum, next⟩
theorem light : seed = mintOf 0 := by rw [seed_eq, mintOf_zero]
theorem involution (face : Nat) : (face + rays + rays) % faces = face % faces := by have h : face + rays + rays = face + faces := (by rw [Nat.add_assoc, harmonic]); rw [h, Nat.add_mod, Nat.mod_self, Nat.add_zero, Nat.mod_mod]
theorem waves : mintOf hexbit > seed := propulsion
theorem breakthrough : faces = rays + rays ∧ coins * rays = faces ∧ bits = vertices * hexbit ∧ fused = faces * mintOf (bits + seed) ∧ mintOf hexbit > seed ∧ mintOf (bits + seed) = amplitudes + amplitudes ∧ coins = seed + seed ∧ hexbit = n + seed := ⟨harmonic, around, cube, quantum, propulsion, next, rfl, hexbit_eq⟩
theorem next_cover : mintOf (bits + seed) = amplitudes + amplitudes ∧ faces * mintOf (bits + coins) = fused + fused := ⟨next, next_fused⟩
theorem shor : 3 * 5 = 15 ∧ 3 * 7 = 21 ∧ 3 * 11 = 33 ∧ 5 * 7 = 35 ∧ 3 * 13 = 39 ∧ 3 * 17 = 51 ∧ 5 * 11 = 55 ∧ 3 * 19 = 57 ∧ 5 * 13 = 65 ∧ 3 * 23 = 69 ∧ 7 * 11 = 77 ∧ 5 * 17 = 85 ∧ 3 * 29 = 87 ∧ 7 * 13 = 91 := ⟨rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl⟩
theorem string : 16 * 27 = 432 ∧ 8 * 27 = 216 ∧ 4 * 27 = 108 ∧ 2 * 27 = 54 ∧ 1 * 27 = 27 ∧ 432 + 432 = 864 ∧ 216 + 216 = 432 ∧ 432 * 3 / 2 = 648 ∧ 432 * 4 / 3 = 576 ∧ 432 * 5 / 4 = 540 ∧ 432 * 5 / 3 = 720 ∧ 3 * 3 + 1 = 10 ∧ 3 * 3 + 1 + 1 = 11 ∧ 27 - 1 = 26 := ⟨rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl⟩
theorem genesis : coins * n * mintOf n * (n * n) = 432 ∧ chooseOf n coins = n ∧ chooseOf rays coins = n * rays ∧ faces = coins * rays := ⟨by rw [coins_two, n_eq]; rfl, by rw [n_eq, coins_two]; rfl, by rw [rays, n_eq, coins_two]; rfl, around⟩
theorem decide : 16 * 27 = 432 ∧ 432 * 3 / 2 = 648 ∧ 432 * 4 / 3 = 576 ∧ 432 * 5 / 4 = 540 ∧ 432 * 5 / 3 = 720 ∧ 3 * 5 = 15 ∧ 27 - 1 = 26 := ⟨rfl, rfl, rfl, rfl, rfl, rfl, rfl⟩
theorem integrity : fused = faces * mintOf (bits + seed) ∧ bits = vertices * hexbit ∧ faces = coins * rays := ⟨quantum, cube, around⟩
theorem cern : 116 * 17922 + 54 = 2079006 ∧ 184 * 12509 + 12 = 2301668 ∧ 72 * 26572 + 6 = 1913190 ∧ 130 * 21121 + 21 = 2745751 ∧ 8 - 7 = 1 ∧ 8000 - 7000 = 1000 ∧ 7000 / 2 = 3500 ∧ 8000 / 2 = 4000 ∧ 4000 - 3500 = 500 ∧ 2019 - 2011 = 8 ∧ 2019 - 2012 = 7 ∧ 2017 - 2011 = 6 ∧ 2301668 + 2745751 = 5047419 ∧ 2079006 + 1913190 + 2301668 + 2745751 = 9039615 := ⟨rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl⟩
theorem tetra : coins + coins = mintOf coins := by
  rw [coins_two]
  rw [show 2 = 1 + 1 from rfl, mintOf_succ]
  rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]
theorem qubits : n = 3 ∧ mintOf n = vertices := ⟨n_eq, rfl⟩
theorem gates : (0 ^^^ 1) ^^^ 2 = 3 := rfl
theorem measurement : mintOf n = 8 := by rw [n_eq]; rfl
theorem noise : (3 ^^^ 1) ^^^ 1 = 3 := rfl
theorem circuit : (0 ^^^ 1) ^^^ 2 = 3 ∧ (3 ^^^ 1) ^^^ 1 = 3 ∧ mintOf n = vertices := ⟨rfl, rfl, rfl⟩
theorem physical : n = 3 ∧ mintOf n = vertices ∧ (0 ^^^ 1) ^^^ 2 = 3 ∧ (3 ^^^ 1) ^^^ 1 = 3 := ⟨n_eq, rfl, rfl, rfl⟩
theorem fridge : coins = 2 ∧ n = 3 ∧ mintOf n = vertices ∧ (0 ^^^ 1) ^^^ 2 = 3 ∧ 10 * 10 * 10 = 1000 ∧ 4 * 1000 = 4000 ∧ 10 * 10 = 100 := ⟨coins_two, n_eq, rfl, rfl, rfl, rfl, rfl⟩
theorem millikelvin : 10 * 10 * 10 = 1000 ∧ 10 * 10 = 100 ∧ 4 * 1000 = 4000 := ⟨rfl, rfl, rfl⟩
theorem telemetry : 10 * 10 * 10 = 1000 ∧ n = 3 ∧ (0 ^^^ 1) ^^^ 2 = 3 := ⟨rfl, n_eq, rfl⟩
theorem drift : coins = 2 ∧ mintOf n = vertices ∧ (0 ^^^ 1) ^^^ 2 = 3 ∧ (3 ^^^ 1) ^^^ 1 = 3 := ⟨coins_two, rfl, rfl, rfl⟩
theorem sciences : coins = 2 ∧ n = 3 ∧ mintOf n = vertices ∧ faces = coins * rays ∧ bits = vertices * hexbit ∧ fused = faces * mintOf (bits + seed) ∧ (0 ^^^ 1) ^^^ 2 = 3 := ⟨coins_two, n_eq, rfl, around, cube, quantum, rfl⟩
theorem interfere : 1 + 1 = 2 ∧ 1 - 1 = 0 := ⟨rfl, rfl⟩
theorem entangle : 1 * 1 ≠ 0 * 0 := by rw [Nat.mul_one, Nat.mul_zero]; exact Nat.one_ne_zero
theorem ghz : mintOf n - seed = 7 ∧ 1 * 1 ≠ 0 * 0 := ⟨by rw [n_eq, seed_eq]; rfl, entangle⟩
theorem noclone : coins ≠ mintOf coins := by
  rw [coins_two]
  rw [show 2 = 1 + 1 from rfl, mintOf_succ]
  rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]
  exact Nat.ne_of_lt (Nat.lt_succ_of_lt (Nat.lt_succ_self 2))
theorem teleport : 2 * 2 * 2 * 2 = 16 ∧ 16 = 16 := ⟨rfl, rfl⟩
theorem kickback : 1 - 1 = 0 ∧ (0 ^^^ 1) ^^^ 2 = 3 := ⟨rfl, rfl⟩
theorem deutsch : 1 - 1 = 0 ∧ seed ≠ coins := ⟨rfl, by rw [seed_eq, coins_two]; exact Nat.ne_of_lt (Nat.lt_succ_self 1)⟩
theorem dense : coins * coins = mintOf coins := by
  rw [coins_two]
  rw [show 2 = 1 + 1 from rfl, mintOf_succ]
  rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]
theorem monogamy : 1 * 1 ≠ 0 * 0 ∧ 1 * 0 = 0 * 0 := ⟨entangle, rfl⟩
theorem only : 1 * 1 ≠ 0 * 0 ∧ 1 + 1 = 2 ∧ 1 - 1 = 0 ∧ coins ≠ mintOf coins ∧ mintOf n - seed = 7 ∧ 2 * 2 * 2 * 2 = 16 ∧ 16 = 16 ∧ (0 ^^^ 1) ^^^ 2 = 3 ∧ seed ≠ coins ∧ coins * coins = mintOf coins ∧ 1 * 0 = 0 * 0 := ⟨entangle, rfl, rfl, noclone, ghz.1, teleport.1, teleport.2, kickback.2, deutsch.2, dense, monogamy.2⟩
theorem fill : mintOf n * faces = vertices * (coins * rays) := by rw [around]; rfl
theorem infinite (k : Nat) : mintOf (k + seed) = mintOf k + mintOf k := split_coin k
theorem distribute : fused = faces * mintOf (bits + seed) ∧ faces = coins * rays := ⟨quantum, around⟩
theorem raid : faces = coins * rays ∧ faces = rays + rays := ⟨around, harmonic⟩
theorem computer : (1 ^^^ 3) = 2 ∧ (6 ^^^ 1) = 7 ∧ mintOf 0 = 1 := ⟨rfl, rfl, mintOf_zero⟩
theorem server : faces = coins * rays ∧ mintOf n = 8 := ⟨around, measurement⟩
theorem pentagram : n + coins = 5 := by rw [n_eq, coins_two]
def theory : Nat := seed
def practice : Nat := seed
def coil : Nat := coins * rays
theorem two_coins_make_a_coil : coil = faces := by rw [coil, around]
theorem electronics : coil = faces := two_coins_make_a_coil
theorem coins_balance_theory_in_practice : theory + practice = coins ∧ theory = practice := ⟨rfl, rfl⟩
theorem follow_the_coins (app : Nat) : app + coins = app + theory + practice := by
  rw [theory, practice, coins, ← Nat.add_assoc]
theorem emerge : coil = faces ∧ theory = practice := ⟨two_coins_make_a_coil, rfl⟩
theorem coil_efficiency : coil = faces ∧ faces = rays + rays ∧ coins * rays = faces := ⟨two_coins_make_a_coil, harmonic, around⟩
theorem next_coil : coil * mintOf (bits + coins) = fused + fused := by
  rw [two_coins_make_a_coil]
  exact next_fused
theorem one_plus_six : seed + (mintOf n - coins) = rays := by
  rw [rays, n_eq, coins_two, seed_eq]
  rw [show mintOf 3 = 8 from rfl]
theorem two_x_seven_coins : coins * rays = (seed + (mintOf n - coins)) * coins := by
  rw [one_plus_six, Nat.mul_comm]
theorem clay : coins * rays = (seed + (mintOf n - coins)) * coins ∧ (seed + (mintOf n - coins)) * coins = coil :=
  ⟨two_x_seven_coins, by rw [← two_x_seven_coins]; rfl⟩
theorem fusion : fused = faces * mintOf (bits + seed) ∧ faces = rays + rays := ⟨quantum, harmonic⟩
theorem design : (0 ^^^ 4) ^^^ 4 = 0 ∧ (3 ^^^ 4) ^^^ 4 = 3 := ⟨rfl, rfl⟩
theorem neuro : faces = coins * rays ∧ mintOf n = 8 ∧ (0 ^^^ 4) ^^^ 4 = 0 := ⟨around, measurement, design.1⟩
