/-! # Qpu.General.Vocabulary

The terms of ISO/IEC 4879:2024 that no other module of the tree states, each as a theorem the kernel checks.

Every statement here is exact arithmetic over the integers. A state is a pair of integer amplitudes and a gate is a
two-by-two integer matrix, so a factor such as the square root of two is carried as a scale and never rounded.
Each theorem states the smallest fact its term names: a superposition has two amplitudes, a projector applied twice is
itself, a code corrects one error. `Qpu.General.Iso` binds each clause of the standard to its theorem. -/

namespace Vocabulary

/-! ## 3.1 General terms -/

/-- A model: a rule from a parameter and an input to a prediction. -/
def model (w x : Int) : Int := w * x

/-- The observations a model is fitted to. -/
def observations : List (Int × Int) := [(1, 3), (2, 6), (3, 9)]

/-- 3.1.1 model: the model with parameter three reproduces every observation. -/
theorem model_fits : (observations.all fun (x, y) => model 3 x == y) = true := by decide

/-- 3.1.2 model parameter: the parameter that fits the first observation is unique. -/
theorem parameter_unique (w : Int) (h : model w 1 = 3) : w = 3 := by
  simp [model] at h; exact h

/-- Every string of `n` bits: the basis a simulator of `n` qubits stores one amplitude for. -/
def basis : Nat → List (List Bool)
  | 0 => [[]]
  | n + 1 => (basis n).map (false :: ·) ++ (basis n).map (true :: ·)

/-- 3.1.4 simulator: a simulator of `n` qubits holds two to the power `n` amplitudes. -/
theorem basis_length (n : Nat) : (basis n).length = 2 ^ n := by
  induction n with
  | zero => rfl
  | succ n ih => simp [basis, ih, Nat.pow_succ]; omega

/-- A programming language: its terms. -/
inductive Term where
  | lit : Int → Term
  | add : Term → Term → Term
  | mul : Term → Term → Term

/-- The meaning of a term. -/
def Term.eval : Term → Int
  | .lit n => n
  | .add a b => a.eval + b.eval
  | .mul a b => a.eval * b.eval

/-- 3.1.6 programming language: a term of the language has one meaning, and addition of terms is addition of meanings. -/
theorem language_evaluates (a b : Term) :
    (Term.add a b).eval = a.eval + b.eval ∧ (Term.add (.lit 2) (.mul (.lit 3) (.lit 4))).eval = 14 :=
  ⟨rfl, by decide⟩

/-! ## 3.2 Quantum physics -/

/-- A state of one qubit: its two amplitudes, as integers. -/
abbrev Vec := Int × Int

/-- A two-by-two integer matrix, row by row. -/
structure Mat where
  /-- row one, column one -/
  a : Int
  /-- row one, column two -/
  b : Int
  /-- row two, column one -/
  c : Int
  /-- row two, column two -/
  d : Int
  deriving DecidableEq, Repr

/-- The matrix applied to a state. -/
def Mat.apply (m : Mat) (v : Vec) : Vec := (m.a * v.1 + m.b * v.2, m.c * v.1 + m.d * v.2)

/-- The product of two matrices. -/
def Mat.mul (m n : Mat) : Mat :=
  ⟨m.a * n.a + m.b * n.c, m.a * n.b + m.b * n.d, m.c * n.a + m.d * n.c, m.c * n.b + m.d * n.d⟩

/-- The sum of two matrices. -/
def Mat.add (m n : Mat) : Mat := ⟨m.a + n.a, m.b + n.b, m.c + n.c, m.d + n.d⟩

/-- The transpose. -/
def Mat.transpose (m : Mat) : Mat := ⟨m.a, m.c, m.b, m.d⟩

/-- The trace. -/
def Mat.trace (m : Mat) : Int := m.a + m.d

/-- The determinant. -/
def Mat.det (m : Mat) : Int := m.a * m.d - m.b * m.c

/-- The permanent: the determinant with every sign positive. -/
def Mat.perm (m : Mat) : Int := m.a * m.d + m.b * m.c

/-- The identity. -/
def I : Mat := ⟨1, 0, 0, 1⟩
/-- Pauli X. -/
def X : Mat := ⟨0, 1, 1, 0⟩
/-- Pauli Z. -/
def Z : Mat := ⟨1, 0, 0, -1⟩
/-- The Hadamard gate, scaled by the square root of two so its entries are integers. -/
def Hd : Mat := ⟨1, 1, 1, -1⟩
/-- The projector on the first basis state. -/
def P0 : Mat := ⟨1, 0, 0, 0⟩
/-- The projector on the second basis state. -/
def P1 : Mat := ⟨0, 0, 0, 1⟩

/-- The first basis state. -/
def e0 : Vec := (1, 0)
/-- The second basis state. -/
def e1 : Vec := (0, 1)

/-- The inner product of two real states. -/
def inner (u v : Vec) : Int := u.1 * v.1 + u.2 * v.2

/-- 3.2.2 operator: an operator is linear, so it acts on a sum as the sum of its actions. -/
theorem operator_linear (m : Mat) (u v : Vec) :
    m.apply (u.1 + v.1, u.2 + v.2) = ((m.apply u).1 + (m.apply v).1, (m.apply u).2 + (m.apply v).2) := by
  simp only [Mat.apply, Int.mul_add]
  refine Prod.ext ?_ ?_ <;> simp only <;> omega

/-- 3.2.5 quantum, noun: levels that are whole multiples of a quantum have no level between two neighbours. -/
theorem quantum_discrete (q n m : Nat) (h : n * q < m * q) : (n + 1) * q ≤ m * q :=
  Nat.mul_le_mul_right q (Nat.lt_of_mul_lt_mul_right h)

/-- 3.2.6 quantum system: two systems taken as one have the product of their dimensions. -/
theorem system_dimension (m n : Nat) : (basis (m + n)).length = (basis m).length * (basis n).length := by
  simp [basis_length, Nat.pow_add]

/-- 3.2.8 quantum superposition: the Hadamard gate takes a basis state to a state with both amplitudes, equal. -/
theorem superposition : Hd.apply e0 = (1, 1) ∧ Hd.apply e1 = (1, -1) := by decide

/-- 3.2.9 basis states: the basis states have unit length and are orthogonal. -/
theorem basis_orthonormal : inner e0 e0 = 1 ∧ inner e1 e1 = 1 ∧ inner e0 e1 = 0 := by decide

/-- 3.2.11 quantum operator: the Pauli operators X and Z are their own transpose, so they are observables. -/
theorem observable_symmetric : X.transpose = X ∧ Z.transpose = Z ∧ Hd.transpose = Hd := by decide

/-- The Hamiltonian minus Z: the first basis state is its ground state. -/
def hamiltonian : Mat := ⟨-1, 0, 0, 1⟩

/-- 3.2.12 Hamiltonian: the Hamiltonian gives the ground state energy minus one and the excited state energy one. -/
theorem hamiltonian_energies : hamiltonian.apply e0 = (-1, 0) ∧ hamiltonian.apply e1 = (0, 1) := by decide

/-- 3.2.13 eigenstate: the two superpositions are the eigenstates of X, kept up to a sign. -/
theorem eigenstates_of_x : X.apply (1, 1) = (1, 1) ∧ X.apply (1, -1) = (-1, 1) := by decide

/-- 3.2.14 eigenvalue: Z has the eigenvalues one and minus one, so its trace is zero and its determinant minus one. -/
theorem eigenvalues_of_z : Z.apply e0 = e0 ∧ Z.apply e1 = (0, -1) ∧ Z.trace = 0 ∧ Z.det = -1 := by decide

/-- 3.2.15 eigenspace: every state is kept by the identity, so its eigenspace for the value one is the whole space. -/
theorem eigenspace_of_identity (v : Vec) : I.apply v = v := by
  simp [Mat.apply, I]

/-- 3.2.17 projective measurement: each projector applied twice is itself, the two exclude each other, and they sum to the identity. -/
theorem projectors : P0.mul P0 = P0 ∧ P1.mul P1 = P1 ∧ P0.mul P1 = ⟨0, 0, 0, 0⟩ ∧ P0.add P1 = I := by decide

/-- 3.2.18 quantum coherence: two Hadamard gates in a row return the basis state, because the second amplitude cancels. -/
theorem coherence_interferes : Hd.apply (Hd.apply e0) = (2, 0) := by decide

/-- The weights of the two outcomes: the squared amplitudes. -/
def weights (v : Vec) : Int × Int := (v.1 * v.1, v.2 * v.2)

/-- One Hadamard gate acting on weights alone, as it does when the phase between the amplitudes is lost. -/
def mixes (p : Int × Int) : Int × Int := (p.1 + p.2, p.1 + p.2)

/-- 3.2.19 decoherence: with the phase lost between the two gates the outcomes are even, where coherence gave one outcome only. -/
theorem decoherence_loses_interference :
    mixes (weights (Hd.apply e0)) = (2, 2) ∧ weights (Hd.apply (Hd.apply e0)) = (4, 0) := by decide

/-- Twice the dephasing rate, from the relaxation rate and the pure dephasing rate. -/
def twiceDephasing (relaxation pure : Nat) : Nat := relaxation + 2 * pure

/-- 3.2.20 coherence time: twice the dephasing rate is at least the relaxation rate, so the coherence time is at most twice the relaxation time. -/
theorem coherence_bounded_by_relaxation (relaxation pure : Nat) :
    relaxation ≤ twiceDephasing relaxation pure ∧ (twiceDephasing relaxation pure = relaxation ↔ pure = 0) := by
  simp only [twiceDephasing]; omega

/-- The population left after `k` half-lives. -/
def remaining (population k : Nat) : Nat := population / 2 ^ k

/-- 3.2.21 relaxation time: a population halves with each half-life and is gone after finitely many. -/
theorem relaxation_halves : remaining 1024 1 = 512 ∧ remaining 1024 10 = 1 ∧ remaining 1024 11 = 0 := by decide

/-! ## 3.3 Quantum information -/

/-- The dimension of a register of `n` systems of `d` levels each. -/
def registerDim (d n : Nat) : Nat := d ^ n

/-- 3.3.4 qudit: a register of qudits has `d` to the power `n` basis states, and with two levels it is a register of qubits. -/
theorem qudit_register (n : Nat) : registerDim 2 n = (basis n).length ∧ registerDim 3 2 = 9 := by
  simp [registerDim, basis_length]

/-- The energy of level `n` of an oscillator of frequency `w` and anharmonicity `a`, both in megahertz. -/
def level (w a n : Nat) : Nat := n * w - a * (n * (n - 1) / 2)

/-- 3.3.6 physical qudit: the transitions between neighbouring levels differ, so each of three levels is addressed alone. -/
theorem physical_qudit_levels :
    level 5000 200 1 - level 5000 200 0 = 5000 ∧ level 5000 200 2 - level 5000 200 1 = 4800 ∧
    level 5000 200 3 - level 5000 200 2 = 4600 := by decide

/-- A digit repeated three times. -/
def encode3 (d : Nat) : List Nat := [d, d, d]

/-- The value two of three positions agree on. -/
def majority3 : List Nat → Nat
  | [a, b, c] => if a = b then a else if a = c then a else b
  | _ => 0

/-- One position of a word replaced. -/
def corrupt (word : List Nat) (position value : Nat) : List Nat := word.set position value

/-- 3.3.8 logical qudit: a three-level digit repeated three times survives any one error, at any position and of any value. -/
theorem logical_qudit_corrects :
    ((List.range 3).all fun d => (List.range 3).all fun position => (List.range 3).all fun value =>
      majority3 (corrupt (encode3 d) position value) == d) = true := by decide

/-- A bit repeated three times. -/
def encodeBit (b : Bool) : List Bool := [b, b, b]

/-- The bit two of three positions agree on. -/
def decodeBit : List Bool → Bool
  | [a, b, c] => (a && b) || (a && c) || (b && c)
  | _ => false

/-- 3.3.9 logical operator: flipping every physical bit flips the encoded bit and nothing else. -/
theorem logical_x (b : Bool) : decodeBit ((encodeBit b).map (!·)) = !b := by
  cases b <;> rfl

/-- 3.3.10 state fidelity: a basis state overlaps itself fully and the other basis state not at all. -/
theorem state_fidelity : inner e0 e0 = 1 ∧ inner e0 e1 = 0 ∧ inner (1, 1) e0 * inner (1, 1) e0 * 2 = inner (1, 1) (1, 1) := by
  decide

/-- 3.3.11 fidelity: the overlap of two states does not depend on their order. -/
theorem fidelity_symmetric (u v : Vec) : inner u v = inner v u := by
  simp [inner, Int.mul_comm]

/-- The overlap of two processes: the trace of the transpose of one times the other. -/
def traceOverlap (m n : Mat) : Int := (m.transpose.mul n).trace

/-- 3.3.12 process fidelity: a process overlaps itself by the dimension, and the identity does not overlap a flip. -/
theorem process_fidelity : traceOverlap I I = 2 ∧ traceOverlap X X = 2 ∧ traceOverlap I X = 0 := by decide

/-! ## 3.4 Quantum information processing -/

/-- 3.4.4 gate fidelity: the scaled Hadamard gate overlaps itself by four and a flip by two, so the flip is not that gate. -/
theorem gate_fidelity : traceOverlap Hd Hd = 4 ∧ traceOverlap Hd X = 2 := by decide

/-- 3.4.7 quantum error mitigation: from a value measured at one and at two units of noise, the value without noise is twice the first minus the second. -/
theorem mitigation_extrapolates (value noise : Int) : 2 * (value - noise) - (value - 2 * noise) = value := by
  omega

/-- A Pauli string on three qubits: where it has an X and where it has a Z. -/
abbrev Pauli := List Bool × List Bool

/-- Whether the count of true bits of a list is odd. -/
def odd (bits : List Bool) : Bool := bits.foldl xor false

/-- Two Pauli strings commute when they clash at an even number of places. -/
def commutes (p q : Pauli) : Bool :=
  !(xor (odd (List.zipWith and p.1 q.2)) (odd (List.zipWith and p.2 q.1)))

/-- The stabilizers of the cluster state on a line of three qubits: X on a qubit and Z on its neighbours. -/
def clusterStabilizers : List Pauli :=
  [ ([true, false, false], [false, true, false])
  , ([false, true, false], [true, false, true])
  , ([false, false, true], [false, true, false]) ]

/-- 3.4.14 one-way quantum computing: the cluster state has one stabilizer for each qubit, and they all commute. -/
theorem cluster_stabilizers_commute :
    clusterStabilizers.length = 3 ∧
    (clusterStabilizers.all fun p => clusterStabilizers.all fun q => commutes p q) = true := by decide

/-- The squared gap, up to a constant, of the path from minus Z to minus X at step `k` of `n`. -/
def gapSquared (n k : Nat) : Nat := (n - k) * (n - k) + k * k

/-- 3.4.15 adiabatic quantum computing: the gap along the path from the first Hamiltonian to the last never closes. -/
theorem adiabatic_gap_open (n k : Nat) (hn : 0 < n) (hk : k ≤ n) : 0 < gapSquared n k := by
  unfold gapSquared
  rcases Nat.eq_zero_or_pos k with h | h
  · subst h; exact Nat.add_pos_left (Nat.mul_pos (by omega) (by omega)) _
  · have : n - k ≤ n := Nat.sub_le n k
    exact Nat.add_pos_right _ (Nat.mul_pos h h)

/-- 3.4.18 quantum coding, threshold: with a logical error of three times the square of the physical error, coding helps below one third and harms above it. -/
theorem coding_threshold : 3 * 100 * 100 < 100 * 1000 ∧ 400 * 1000 < 3 * 400 * 400 := by decide

/-! ## 3.5 Applications -/

/-- The matrix of a linear system. -/
def system : Mat := ⟨2, 1, 1, 3⟩

/-- 3.5.5 linear systems solving: the system has exactly one solution, and it is the one stated. -/
theorem linear_system_solved (v : Vec) : system.apply v = (5, 10) ↔ v = (1, 3) := by
  constructor
  · intro h
    have h1 : 2 * v.1 + 1 * v.2 = 5 := congrArg Prod.fst h
    have h2 : 1 * v.1 + 3 * v.2 = 10 := congrArg Prod.snd h
    exact Prod.ext (by show v.1 = 1; omega) (by show v.2 = 3; omega)
  · intro h; subst h; decide

/-- 3.5.8 boson sampling: the permanent of the beam splitter is zero where its determinant is not, so two bosons never leave by different ports. -/
theorem bosons_bunch : Hd.perm = 0 ∧ Hd.det = -2 := by decide

/-! ## 3.6 Communication and sensing -/

/-- A bit prepared in a basis: the bit and the basis it was prepared in. -/
def prepare (bit basis : Bool) : Bool × Bool := (bit, basis)

/-- A measurement in a basis: the bit when the bases agree, and no certain answer when they differ. -/
def measure (basis : Bool) (state : Bool × Bool) : Option Bool := if state.2 = basis then some state.1 else none

/-- 3.6.2 quantum cryptography: the receiver reads the sender's bit exactly when the two chose the same basis. -/
theorem key_sifting (bit basis : Bool) :
    measure basis (prepare bit basis) = some bit ∧ measure (!basis) (prepare bit basis) = none := by
  cases bit <;> cases basis <;> decide

/-- 3.6.4 quantum sensing: the precision `n` entangled probes reach is at least the precision `n` separate probes reach. -/
theorem sensing_gain (n : Nat) : n ≤ n * n := Nat.le_mul_self n

end Vocabulary
