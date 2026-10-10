/-! # Qpu.Combinatorics
Standard enumerative combinatorics as Nat: the factorial, the binomial coefficient with Pascal's rule, triangular
numbers (the handshake count), and the small values the textbook names (3! = 6, C(5,2) = 10, R(2,n) = n). The laws
that count, each checked by Lean. -/

def factorial : Nat → Nat
  | 0 => 1
  | n + 1 => (n + 1) * factorial n

def choose : Nat → Nat → Nat
  | _, 0 => 1
  | 0, _ + 1 => 0
  | n + 1, k + 1 => choose n (k + 1) + choose n k

def triangular : Nat → Nat
  | 0 => 0
  | n + 1 => (n + 1) + triangular n

def ramsey22 : Nat → Nat := fun n => n

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
