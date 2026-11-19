/-! # Qpu.Fusion
Google Benchmark I, fusion 1/√x (arXiv:2610.23832): the register width, the domain and the quoted baseline, checked by the kernel. -/

def fusionNp : Nat := 10
def fusionRegister : Nat := 2 * fusionNp + 2
def fusionMaxX : Nat := 3 * (2 ^ fusionNp - 2) ^ 2
def fusionBaselineQ : Nat := 260
def fusionBaselineC : Nat := 7988

theorem fusion_register : fusionRegister = 22 := rfl
theorem fusion_max_x : fusionMaxX = 3133452 := rfl
theorem fusion_baseline : fusionBaselineQ * fusionBaselineC = 2076880 := rfl

/-- The squared tolerance in units of (2^-64 turns)², scaled by x: tol(x) = 2^-24/√x turns. -/
def fusionTolSquared : Nat := 2 ^ 80
theorem fusion_tolerance : fusionTolSquared = 2 ^ 128 / 2 ^ 48 := rfl

/-- r is ⌊2^64/√x⌋: r·r·x ≤ 2^128 < (r+1)·(r+1)·x. -/
def fusionFloor (r x : Nat) : Prop := r * r * x ≤ 2 ^ 128 ∧ 2 ^ 128 < (r + 1) * (r + 1) * x

/-- A shot with error e/den (units of 2^-64 turns) is within tolerance at x: e·e·x ≤ 2^80·den². -/
def fusionAccepts (e x den : Nat) : Prop := e * e * x ≤ fusionTolSquared * den * den
