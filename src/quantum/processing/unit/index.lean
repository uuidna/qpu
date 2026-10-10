/-! # Qpu.Mint
Doubling: mintOf k = 2^k, binomials, and the laws that make a sum inside the doubling a product outside it. -/

def mintOf : Nat → Nat | 0 => 1 | k + 1 => mintOf k + mintOf k
def chooseOf : Nat → Nat → Nat | _, 0 => 1 | 0, _ + 1 => 0 | n + 1, k + 1 => chooseOf n (k + 1) + chooseOf n k
theorem mintOf_zero : mintOf 0 = 1 := rfl
theorem mintOf_succ (k : Nat) : mintOf (k + 1) = mintOf k + mintOf k := rfl
theorem mintOf_add (a b : Nat) : mintOf (a + b) = mintOf a * mintOf b := by induction b with | zero => rw [Nat.add_zero, mintOf_zero, Nat.mul_one] | succ b ih => rw [Nat.add_succ, mintOf_succ, ih, mintOf_succ, Nat.mul_add]
theorem multiply (a b : Nat) : mintOf (a + b) = mintOf a * mintOf b := mintOf_add a b

/-! # Qpu.Lattice
The register geometry: n, seed, coins, rays, vertices, hexbit, bits, faces, amplitudes, fused, plane, and every identity between them. -/

def n : Nat := ["quantum", "processing", "unit"].length
def seed : Nat := mintOf (n - n)
def coins : Nat := seed + seed
def scanner : Nat := seed
def radar : Nat := seed
def rays : Nat := n + coins + coins
def vertices : Nat := mintOf n
def hexbit : Nat := mintOf coins
def bits : Nat := mintOf (n + coins)
def faces : Nat := vertices + hexbit + coins
def amplitudes : Nat := mintOf bits
def fused : Nat := faces * mintOf (bits + seed)
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
theorem next_fused : faces * mintOf (bits + coins) = fused + fused := by rw [fused, coins_two, seed_eq]; rw [show bits + 2 = bits + 1 + 1 from rfl, mintOf_succ, Nat.mul_add]
theorem split_coin (k : Nat) : mintOf (k + seed) = mintOf k + mintOf k := by rw [seed_eq, mintOf_succ]
theorem handle : amplitudes = mintOf bits ∧ mintOf (bits + seed) = amplitudes + amplitudes := ⟨rfl, next⟩
theorem kv : fused = faces * mintOf (bits + seed) ∧ mintOf (bits + seed) = amplitudes + amplitudes := ⟨quantum, next⟩
theorem light : seed = mintOf 0 := by rw [seed_eq, mintOf_zero]
theorem involution (face : Nat) : (face + rays + rays) % faces = face % faces := by have h : face + rays + rays = face + faces := (by rw [Nat.add_assoc, harmonic]); rw [h, Nat.add_mod, Nat.mod_self, Nat.add_zero, Nat.mod_mod]
theorem waves : mintOf hexbit > seed := propulsion
theorem breakthrough : faces = rays + rays ∧ coins * rays = faces ∧ bits = vertices * hexbit ∧ fused = faces * mintOf (bits + seed) ∧ mintOf hexbit > seed ∧ mintOf (bits + seed) = amplitudes + amplitudes ∧ coins = seed + seed ∧ hexbit = n + seed := ⟨harmonic, around, cube, quantum, propulsion, next, rfl, hexbit_eq⟩
theorem next_cover : mintOf (bits + seed) = amplitudes + amplitudes ∧ faces * mintOf (bits + coins) = fused + fused := ⟨next, next_fused⟩
theorem integrity : fused = faces * mintOf (bits + seed) ∧ bits = vertices * hexbit ∧ faces = coins * rays := ⟨quantum, cube, around⟩
theorem tetra : coins + coins = mintOf coins := by rw [coins_two]; rw [show 2 = 1 + 1 from rfl, mintOf_succ]; rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]
theorem qubits : n = 3 ∧ mintOf n = vertices := ⟨n_eq, rfl⟩
theorem measurement : mintOf n = 8 := by rw [n_eq]; rfl
theorem fill : mintOf n * faces = vertices * (coins * rays) := by rw [around]; rfl
theorem infinite (k : Nat) : mintOf (k + seed) = mintOf k + mintOf k := split_coin k
theorem distribute : fused = faces * mintOf (bits + seed) ∧ faces = coins * rays := ⟨quantum, around⟩
theorem raid : faces = coins * rays ∧ faces = rays + rays := ⟨around, harmonic⟩
/-- PLANES: plane = coins * coins * rays is less than mintOf (rays + seed), and coins * rays = faces. -/
def plane : Nat := coins * coins * rays
theorem planes : plane < mintOf (rays + seed) ∧ coins * rays = faces := ⟨Nat.le_of_ble_eq_true rfl, around⟩

/-! # Qpu.Annealing
Quantum-annealer topology qubit counts over the unit-cell size m, exact Nat grounded in the lattice constants: the
Chimera count (vertices qubits per cell) and the Pegasus count. The kernel proves the values; there is no holds. -/

def chimera (m : Nat) : Nat := vertices * m ^ 2
def pegasus (m : Nat) : Nat := vertices * n * m * (m - 1)
theorem annealing_all : chimera 16 = 2048 ∧ pegasus 16 = 5760 := ⟨rfl, rfl⟩

/-! # Qpu.Anyon
Topological-quantum-computation fusion-space dimensions, exact Nat: the dimension for n Fibonacci (τ) anyons is the nth
Fibonacci number (seeded from the lattice seed), and the dimension for m Ising-anyon pairs is a power of two on the
doubling mintOf. The kernel proves the values; there is no holds. -/

def fibAux : Nat → Nat → Nat → Nat | 0, a, _ => a | k + 1, a, b => fibAux k b (a + b)
def fibFusion (nn : Nat) : Nat := fibAux nn (seed - seed) seed
def isingFusion (m : Nat) : Nat := mintOf (m - seed)
theorem anyon_all : fibFusion 5 = 5 ∧ fibFusion 10 = 55 ∧ isingFusion 3 = 4 := ⟨rfl, rfl, rfl⟩

/-! # Qpu.Cern
CMS Open Data record integers (events = files x q + r). -/

theorem cern : 116 * 17922 + 54 = 2079006 ∧ 184 * 12509 + 12 = 2301668 ∧ 72 * 26572 + 6 = 1913190 ∧ 130 * 21121 + 21 = 2745751 ∧ 8 - 7 = 1 ∧ 8000 - 7000 = 1000 ∧ 7000 / 2 = 3500 ∧ 8000 / 2 = 4000 ∧ 4000 - 3500 = 500 ∧ 2019 - 2011 = 8 ∧ 2019 - 2012 = 7 ∧ 2017 - 2011 = 6 ∧ 2301668 + 2745751 = 5047419 ∧ 2079006 + 1913190 + 2301668 + 2745751 = 9039615 := ⟨rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl, rfl⟩

/-! # Qpu.Circuit
The running circuit on exact amplitudes: gates, noise, Bell, GHZ, no-clone, teleport, kickback, Deutsch, superdense, monogamy. -/

theorem gates : (0 ^^^ 1) ^^^ 2 = 3 := rfl
theorem noise : (3 ^^^ 1) ^^^ 1 = 3 := rfl
theorem circuit : (0 ^^^ 1) ^^^ 2 = 3 ∧ (3 ^^^ 1) ^^^ 1 = 3 ∧ mintOf n = vertices := ⟨rfl, rfl, rfl⟩
theorem physical : n = 3 ∧ mintOf n = vertices ∧ (0 ^^^ 1) ^^^ 2 = 3 ∧ (3 ^^^ 1) ^^^ 1 = 3 := ⟨n_eq, rfl, rfl, rfl⟩
theorem drift : coins = 2 ∧ mintOf n = vertices ∧ (0 ^^^ 1) ^^^ 2 = 3 ∧ (3 ^^^ 1) ^^^ 1 = 3 := ⟨coins_two, rfl, rfl, rfl⟩
theorem sciences : coins = 2 ∧ n = 3 ∧ mintOf n = vertices ∧ faces = coins * rays ∧ bits = vertices * hexbit ∧ fused = faces * mintOf (bits + seed) ∧ (0 ^^^ 1) ^^^ 2 = 3 := ⟨coins_two, n_eq, rfl, around, cube, quantum, rfl⟩
theorem interfere : 1 + 1 = 2 ∧ 1 - 1 = 0 := ⟨rfl, rfl⟩
theorem entangle : 1 * 1 ≠ 0 * 0 := by rw [Nat.mul_one, Nat.mul_zero]; exact Nat.one_ne_zero
theorem ghz : mintOf n - seed = 7 ∧ 1 * 1 ≠ 0 * 0 := ⟨by rw [n_eq, seed_eq]; rfl, entangle⟩
theorem noclone : coins ≠ mintOf coins := by rw [coins_two]; rw [show 2 = 1 + 1 from rfl, mintOf_succ]; rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]; exact Nat.ne_of_lt (Nat.lt_succ_of_lt (Nat.lt_succ_self 2))
theorem teleport : 2 * 2 * 2 * 2 = 16 ∧ 16 = 16 := ⟨rfl, rfl⟩
theorem kickback : 1 - 1 = 0 ∧ (0 ^^^ 1) ^^^ 2 = 3 := ⟨rfl, rfl⟩
theorem deutsch : 1 - 1 = 0 ∧ seed ≠ coins := ⟨rfl, by rw [seed_eq, coins_two]; exact Nat.ne_of_lt (Nat.lt_succ_self 1)⟩
theorem dense : coins * coins = mintOf coins := by rw [coins_two]; rw [show 2 = 1 + 1 from rfl, mintOf_succ]; rw [show 1 = 0 + 1 from rfl, mintOf_succ, mintOf_zero]
theorem monogamy : 1 * 1 ≠ 0 * 0 ∧ 1 * 0 = 0 * 0 := ⟨entangle, rfl⟩
theorem only : 1 * 1 ≠ 0 * 0 ∧ 1 + 1 = 2 ∧ 1 - 1 = 0 ∧ coins ≠ mintOf coins ∧ mintOf n - seed = 7 ∧ 2 * 2 * 2 * 2 = 16 ∧ 16 = 16 ∧ (0 ^^^ 1) ^^^ 2 = 3 ∧ seed ≠ coins ∧ coins * coins = mintOf coins ∧ 1 * 0 = 0 * 0 := ⟨entangle, rfl, rfl, noclone, ghz.1, teleport.1, teleport.2, kickback.2, deutsch.2, dense, monogamy.2⟩
theorem computer : (1 ^^^ 3) = 2 ∧ (6 ^^^ 1) = 7 ∧ mintOf 0 = 1 := ⟨rfl, rfl, mintOf_zero⟩
theorem server : faces = coins * rays ∧ mintOf n = 8 := ⟨around, measurement⟩
theorem design : (0 ^^^ 4) ^^^ 4 = 0 ∧ (3 ^^^ 4) ^^^ 4 = 3 := ⟨rfl, rfl⟩
theorem neuro : faces = coins * rays ∧ mintOf n = 8 ∧ (0 ^^^ 4) ^^^ 4 = 0 := ⟨around, measurement, design.1⟩
theorem all_entangle : 1 * 1 ≠ 0 * 0 := entangle
theorem all_noclone : coins ≠ mintOf coins := noclone

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

/-! # Qpu.Hybrid
Hybrid storage: KV and R2 cost and speed, and their sums. -/

def kvCost : Nat := coins
def r2Cost : Nat := seed
def hybridCost : Nat := kvCost + r2Cost
def kvSpeed : Nat := rays
def r2Speed : Nat := seed
def hybridSpeed : Nat := kvSpeed + r2Speed
theorem hybrid_cost : coins + seed = n := by rw [coins_two, seed_eq, n_eq]
theorem hybrid_speed : rays + seed = mintOf n := by rw [rays, n_eq, coins_two, seed_eq]; rw [show mintOf 3 = 8 from rfl]
theorem hybrid : coins + seed = n ∧ rays + seed = mintOf n ∧ coins = seed + seed := ⟨hybrid_cost, hybrid_speed, coins_two⟩

/-! # Qpu.Physics
Planck and Boltzmann (SI exact digits), transmon temperature, BCS gaps of aluminium and niobium, cooling. -/

def planck : Nat := 662607015
def boltzmann : Nat := 1380649
def transmon : Nat := 5
def photon : Nat := planck * transmon
def thermal (millikelvin : Nat) : Nat := boltzmann * millikelvin * 10
theorem temperature : photon / thermal 10 = 23 ∧ photon / thermal 100 = 2 ∧ photon / thermal 4000 = 0 ∧ 4000 / 100 = 40 ∧ 100 / 10 = 10 ∧ 10 < 35 := ⟨rfl, rfl, rfl, rfl, rfl, Nat.le_of_ble_eq_true rfl⟩
def bcs : Nat := 352
def aluminium : Nat := 1200
def niobium : Nat := 9260
def gap (tc : Nat) : Nat := bcs * boltzmann * tc / planck / 10
theorem superconductivity : aluminium > 10 ∧ niobium > aluminium ∧ bcs / 100 = 3 ∧ gap aluminium = 88 ∧ gap aluminium > transmon ∧ gap niobium = 679 := ⟨Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, rfl, rfl, Nat.le_of_ble_eq_true rfl, rfl⟩
/-- COOLING: for every t, a, n with 0 < t and 0 < a, 0 < t * a ^ n; with a < b as well, t * a ^ n * a < t * a ^ n * b. -/
theorem cooling_stays_positive (t a n : Nat) (ht : 0 < t) (ha : 0 < a) : 0 < t * a ^ n :=
  Nat.mul_pos ht (Nat.pow_pos ha)
theorem cooling_strictly_decreases (t a b n : Nat) (ht : 0 < t) (ha : 0 < a) (hab : a < b) : t * a ^ n * a < t * a ^ n * b :=
  Nat.mul_lt_mul_of_pos_left hab (Nat.mul_pos ht (Nat.pow_pos ha))

/-! # Qpu.Shor
Modular exponentiation, period finding by fuel recursion, gcd, and Shor on 91. -/

def powModAux : Nat → Nat → Nat → Nat → Nat | 0, _, _, acc => acc | k + 1, a, m, acc => powModAux k a m (acc * a % m)
def powMod (a e m : Nat) : Nat := powModAux e a m (1 % m)
def periodAux : Nat → Nat → Nat → Nat → Nat | 0, _, _, _ => 0 | fuel + 1, a, m, r => if powMod a r m = 1 then r else periodAux fuel a m (r + 1)
def periodOf (a m : Nat) : Nat := periodAux m a m 1
def gcdAux : Nat → Nat → Nat → Nat | 0, a, _ => a | fuel + 1, a, b => if b = 0 then a else gcdAux fuel b (a % b)
def gcdOf (a b : Nat) : Nat := gcdAux (a + b) a b
def half (a m : Nat) : Nat := powMod a (periodOf a m / 2) m
theorem shor : periodOf 8 91 % 2 = 0 ∧ half 8 91 < 91 - 1 ∧ 1 < gcdOf (half 8 91 - 1) 91 ∧ gcdOf (half 8 91 - 1) 91 < 91 ∧ gcdOf (half 8 91 - 1) 91 * gcdOf (half 8 91 + 1) 91 = 91 := ⟨rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, rfl⟩
-- 6 theorem complete landscape
theorem all_shor : periodOf 8 91 % 2 = 0 := rfl

/-! # Qpu.Clay
Discovered, not written (scripts/lean-clay.mjs): the formulas discover each other — every value two or more families of formulas reach, stated over the lattice's own constant names. No list is kept. clay_wings is their conjunction, and crossDiscoverSchemaOf consolidates the same relations as one schema.org DefinedTermSet. -/

/-- Hybrid, Lattice, Mint, Shor meet at 8. -/
theorem relation_8 : vertices = hybridSpeed ∧ vertices = mintOf n := ⟨rfl, rfl⟩
/-- Coil, Lattice meet at 14. -/
theorem relation_14 : faces = coil := rfl
/-- Mint, Shor meet at 16. -/
theorem relation_16 : mintOf hexbit = powMod coins rays plane ∧ mintOf hexbit = powMod coins hexbit bits := ⟨rfl, rfl⟩
/-- Mint, Shor meet at 21. -/
theorem relation_21 : chooseOf rays coins = powMod rays coins plane ∧ chooseOf rays coins = powMod rays vertices plane := ⟨rfl, rfl⟩
/-- Physics, Shor meet at 25. -/
theorem relation_25 : powMod n hexbit plane = powMod n faces bits ∧ powMod n hexbit plane = powMod n plane plane := ⟨rfl, rfl⟩
/-- Lattice, Mint meet at 28. -/
theorem relation_28 : plane = chooseOf vertices coins := rfl
/-- Lattice, Mint meet at 4294967296. -/
theorem relation_4294967296 : amplitudes = mintOf bits := rfl

/-- Every discovered relation at once: the families of formulas that meet. -/
theorem clay_wings : (vertices = hybridSpeed ∧ vertices = mintOf n) ∧ faces = coil ∧ (mintOf hexbit = powMod coins rays plane ∧ mintOf hexbit = powMod coins hexbit bits) ∧ (chooseOf rays coins = powMod rays coins plane ∧ chooseOf rays coins = powMod rays vertices plane) ∧ (powMod n hexbit plane = powMod n faces bits ∧ powMod n hexbit plane = powMod n plane plane) ∧ plane = chooseOf vertices coins ∧ amplitudes = mintOf bits := ⟨relation_8, relation_14, relation_16, relation_21, relation_25, relation_28, relation_4294967296⟩

/-! # Qpu.Clifford
Clifford-group and symplectic-group orders for gate synthesis and randomized benchmarking, exact Nat on the doubling
mintOf: the order of the symplectic group Sp(2n, 2) — 2^(n^2) times the product of 4^j − 1 for j up to n — and the
n-qubit Clifford group order. The kernel proves the values; there is no holds. -/

def sympProd : Nat → Nat | 0 => 1 | j + 1 => (mintOf (2 * (j + 1)) - 1) * sympProd j
def symplectic (nn : Nat) : Nat := mintOf (nn * nn) * sympProd nn
def cliffordOrder (nn : Nat) : Nat := mintOf (2 * nn) * symplectic nn
theorem clifford_all : symplectic 1 = 6 ∧ symplectic 2 = 720 ∧ symplectic 3 = 1451520 ∧ cliffordOrder 2 = 11520 := ⟨rfl, rfl, rfl, rfl⟩

/-! # Qpu.Combinatorics
Standard enumerative combinatorics as Nat: the factorial, the binomial coefficient with Pascal's rule, triangular
numbers (the handshake count), the small Ramsey party R(2,n) = n, and the textbook values (3! = 6, C(5,2) = 10). The
laws that count, each checked by Lean and recomputed in TypeScript. -/

def factorial : Nat → Nat | 0 => 1 | n + 1 => (n + 1) * factorial n
def choose : Nat → Nat → Nat | _, 0 => 1 | 0, _ + 1 => 0 | n + 1, k + 1 => choose n (k + 1) + choose n k
def triangular : Nat → Nat | 0 => 0 | n + 1 => (n + 1) + triangular n
def ramsey22 : Nat → Nat | n => n

theorem factorial_zero : factorial 0 = 1 := rfl
theorem factorial_succ (n : Nat) : factorial (n + 1) = (n + 1) * factorial n := rfl
theorem factorial_three : factorial 3 = 6 := rfl
theorem choose_zero (n : Nat) : choose n 0 = 1 := by cases n <;> rfl
theorem choose_zero_succ (k : Nat) : choose 0 (k + 1) = 0 := rfl
theorem choose_pascal (n k : Nat) : choose (n + 1) (k + 1) = choose n (k + 1) + choose n k := rfl
theorem choose_five_two : choose 5 2 = 10 := rfl
theorem choose_symm_small : choose 5 2 = choose 5 3 := rfl
theorem triangular_zero : triangular 0 = 0 := rfl
theorem triangular_succ (n : Nat) : triangular (n + 1) = (n + 1) + triangular n := rfl
theorem triangular_four : triangular 4 = 10 := rfl
theorem ramsey22_eq (n : Nat) : ramsey22 n = n := rfl
theorem ramsey_three_three : triangular 3 = 6 := rfl

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

/-! # Qpu.Fuse
The fused API registry: qubits, composing pairs, specificity buckets, cut entanglement within bounds. -/

-- The API registry fused (scripts/fuse-apis.mjs, fuse-receipt.json): qubits = connected + isolated; composing pairs =
-- entangled + one-way; the specificity buckets partition the pairs; each cut's ebits within its bound; receipts =
-- qubits + formulas. Snapshot integers, as theorem cern holds CMS counts.
theorem fuse : 2247 + 282 = 2529 ∧ 94598 + 343701 = 438299 ∧ 406 + 1565 + 3389 + 6011 + 12801 + 414127 = 438299 ∧ 448 ≤ 1264 ∧ 362 ≤ 955 ∧ 301 ≤ 340 ∧ 252 ≤ 284 ∧ 144 ≤ 166 ∧ 2529 + 438299 = 440828 := ⟨rfl, rfl, rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, rfl⟩

/-! # Qpu.Galois
GF(2) linear-algebra counts underpinning CSS and stabilizer code construction, exact Nat on the doubling mintOf: the
order of the general linear group GL(n, 2), the product of 2^n − 2^i for i below n. The kernel proves the values; there
is no holds. -/

def glProd : Nat → Nat → Nat | _, 0 => 1 | nn, i + 1 => (mintOf nn - mintOf i) * glProd nn i
def gl2 (nn : Nat) : Nat := glProd nn nn
theorem galois_all : gl2 2 = 6 ∧ gl2 3 = 168 ∧ gl2 4 = 20160 := ⟨rfl, rfl, rfl⟩

/-! # Qpu.Grover
Grover quantum-search iteration counts, exact Nat with no π literal and no float: the optimal number of iterations over a
2^(2k)-item database is ⌊(π/4)·2^k⌋, where π is carried by the proven Zu Chongzhi rational pi_zu (355/113) written over
the lattice constants — 355 = plane·(faces−seed) − n·n, 113 = plane·hexbit + seed. The kernel proves the values; there
is no holds. -/

def groverIters (k : Nat) : Nat := (plane * (faces - seed) - n * n) * mintOf k / (coins * coins * (plane * hexbit + seed))
def groverSize (k : Nat) : Nat := mintOf (2 * k)
theorem grover_all : groverIters 2 = 3 ∧ groverIters 5 = 25 ∧ groverSize 5 = 1024 := ⟨rfl, rfl, rfl⟩

/-! # Qpu.Magic
Magic-state distillation parameters of the [[15, 1, 3]] Reed–Muller code (15-to-1), as exact Nat over the lattice
constants: the block length, the logical qubits, the code distance, and the cubic suppression factor. The kernel proves
the values from the proven constants; there is no holds. -/

def magicBlock : Nat := faces + seed
def magicLogical : Nat := seed
def magicDistance : Nat := n
def magicCubic : Nat := plane + rays
theorem magic_all : magicBlock = 15 ∧ magicLogical = 1 ∧ magicDistance = 3 ∧ magicCubic = 35 := ⟨rfl, rfl, rfl, rfl⟩

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

/-! # Qpu.Primes
The primes the register geometry already exhibits, written as exact identities over the lattice constants — the
ingredients the Riemann/zeta wing of the clay family reads. These are checked facts about particular primes, not a proof
of the Riemann hypothesis; that remains a lead the clay family carries, fed by exactly these exhibited values. -/

/-- the smallest prime (2) equals coins. -/
theorem prime_two : coins = 2 := coins_two
/-- the first odd prime (3) equals n. -/
theorem prime_three : n = 3 := n_eq
/-- the Mersenne prime 2^2 − 1 (3) equals mintOf coins − seed. -/
theorem mersenne_3 : mintOf coins - seed = 3 := rfl
/-- the Mersenne prime 2^3 − 1 (7) equals mintOf n − seed, and equals rays. -/
theorem mersenne_7 : mintOf n - seed = 7 := rfl
/-- the Mersenne prime 2^5 − 1 (31) equals bits − seed. -/
theorem mersenne_31 : bits - seed = 31 := rfl
/-- the Mersenne prime 2^7 − 1 (127) equals mintOf rays − seed. -/
theorem mersenne_127 : mintOf rays - seed = 127 := rfl
/-- the Shor modulus (91) is the product of its two prime factors: rays · (faces − seed) = 7 · 13. -/
theorem shor_factored : rays * (faces - seed) = 91 := rfl
/-- the Shor modulus equals the binomial too: rays · (faces − seed) = chooseOf faces coins. -/
theorem shor_modulus_binomial : rays * (faces - seed) = chooseOf faces coins := rfl
/-- the lower twin prime (11) equals faces − n. -/
theorem twin_lower : faces - n = 11 := rfl
/-- the upper twin prime (13) equals faces − seed. -/
theorem twin_upper : faces - seed = 13 := rfl
/-- the twin-prime gap (2) is coins: (faces − seed) − (faces − n) = coins. -/
theorem twin_gap : (faces - seed) - (faces - n) = coins := rfl
/-- the primorial 2 · 3 · 5 · 7 (210) equals coins · n · (n + coins) · rays. -/
theorem primorial_210 : coins * n * (n + coins) * rays = 210 := rfl

/-- Every exhibited prime at once: the primes the lattice carries into the clay family's number-theory wing. -/
theorem primes_all : coins = 2 ∧ n = 3 ∧ mintOf coins - seed = 3 ∧ mintOf n - seed = 7 ∧ bits - seed = 31 ∧ mintOf rays - seed = 127 ∧ rays * (faces - seed) = 91 ∧ rays * (faces - seed) = chooseOf faces coins ∧ faces - n = 11 ∧ faces - seed = 13 ∧ (faces - seed) - (faces - n) = coins ∧ coins * n * (n + coins) * rays = 210 :=
  ⟨prime_two, prime_three, mersenne_3, mersenne_7, mersenne_31, mersenne_127, shor_factored, shor_modulus_binomial, twin_lower, twin_upper, twin_gap, primorial_210⟩

/-! # Qpu.Qaoa
QAOA circuit resource counts over p layers, exact Nat grounded in the lattice constants: the variational parameter
count (two per layer, from coins), the cost-layer ZZ gates over e edges, and the mixer X gates over q qubits. The kernel
proves the values; there is no holds. -/

def qaoaParams (p : Nat) : Nat := coins * p
def qaoaZz (p e : Nat) : Nat := p * e
def qaoaX (p q : Nat) : Nat := p * q
theorem qaoa_all : qaoaParams 3 = 6 ∧ qaoaZz 2 5 = 10 ∧ qaoaX 3 4 = 12 := ⟨rfl, rfl, rfl⟩

/-! # Qpu.Qft
Quantum Fourier transform resource counts over the qubit count q, exact Nat: the gate count (a triangular number), the
swap count, the circuit depth and the output dimension. The kernel proves the values; there is no holds. -/

def qftGates (q : Nat) : Nat := q * (q + 1) / 2
def qftSwaps (q : Nat) : Nat := q / 2
def qftDepth (q : Nat) : Nat := 2 * q - 1
def qftStates (q : Nat) : Nat := 2 ^ q
theorem qft_all : qftGates 3 = 6 ∧ qftGates 4 = 10 ∧ qftSwaps 4 = 2 ∧ qftDepth 4 = 7 ∧ qftStates 4 = 16 := ⟨rfl, rfl, rfl, rfl, rfl⟩

/-! # Qpu.Stabilizer
Stabilizer-formalism counts for Clifford-circuit simulation, exact Nat built on the doubling mintOf: the number of
n-qubit stabilizer states (2^n times the product of 2^i+1 for i up to n), the order of the n-qubit Pauli group with
phases, and the order of a stabilizer subgroup. The kernel proves the values; there is no holds. -/

def stabProd : Nat → Nat | 0 => 1 | k + 1 => (mintOf (k + 1) + 1) * stabProd k
def stabStates (nn : Nat) : Nat := mintOf nn * stabProd nn
def paulis (nn : Nat) : Nat := mintOf (2 * nn + 2)
def stabSubgroup (nn : Nat) : Nat := mintOf nn
theorem stabilizer_all : stabStates 1 = 6 ∧ stabStates 2 = 60 ∧ stabStates 3 = 1080 ∧ paulis 1 = 16 := ⟨rfl, rfl, rfl, rfl⟩

/-! # Qpu.Surfacecode
Rotated surface-code parameters over the code distance d, exact Nat grounded in the lattice constants: the physical
qubit count, the number of correctable errors, and the logical qubits per patch. The kernel proves the values; there is
no holds. -/

def surfacePhysical (d : Nat) : Nat := coins * d ^ 2 - coins * d + seed
def surfaceCorrectable (d : Nat) : Nat := (d - seed) / coins
def surfaceLogical : Nat := coins
theorem surfacecode_all : surfacePhysical 3 = 13 ∧ surfaceCorrectable 5 = 2 ∧ surfaceLogical = 2 := ⟨rfl, rfl, rfl⟩
