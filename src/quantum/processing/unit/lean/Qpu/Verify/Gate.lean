/-
  Qpu.Verify.Gate — scaled Gaussian-integer gate matrices, kernel-checked by `decide`.

  Irrational phases (1/√2) are absorbed into scaling: scaledH = √2·H, so
  `scaledH * scaledH = 2·I` is exact integer arithmetic the kernel decides.
-/
namespace Qpu.Verify.Gate

/-- Gaussian integer `re + im·i`. -/
structure Gq where
  re : Int
  im : Int
deriving DecidableEq, Repr

namespace Gq
protected def add (a b : Gq) : Gq := ⟨a.re + b.re, a.im + b.im⟩
protected def mul (a b : Gq) : Gq := ⟨a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re⟩
end Gq

instance : Add Gq := ⟨Gq.add⟩
instance : Mul Gq := ⟨Gq.mul⟩

/-- Integer scalar embedded as a Gaussian integer. -/
def g (n : Int) : Gq := ⟨n, 0⟩

/-- 2×2 matrix over `Gq`, row-major. -/
structure M2 where
  a00 a01 a10 a11 : Gq
deriving DecidableEq, Repr

namespace M2
protected def mul (A B : M2) : M2 :=
  ⟨A.a00 * B.a00 + A.a01 * B.a10,
   A.a00 * B.a01 + A.a01 * B.a11,
   A.a10 * B.a00 + A.a11 * B.a10,
   A.a10 * B.a01 + A.a11 * B.a11⟩

/-- Twice the identity — the unit `scaledH` squares to. -/
def two : M2 := ⟨g 2, g 0, g 0, g 2⟩
end M2

instance : Mul M2 := ⟨M2.mul⟩

def matI : M2 := ⟨g 1, g 0, g 0, g 1⟩
/-- √2 · H. -/
def scaledH : M2 := ⟨g 1, g 1, g 1, g (-1)⟩
def matX : M2 := ⟨g 0, g 1, g 1, g 0⟩
def matY : M2 := ⟨g 0, ⟨0, -1⟩, ⟨0, 1⟩, g 0⟩
def matZ : M2 := ⟨g 1, g 0, g 0, g (-1)⟩
def matS : M2 := ⟨g 1, g 0, g 0, ⟨0, 1⟩⟩

theorem h_unitary : scaledH * scaledH = M2.two := by decide
theorem x_squared : matX * matX = matI := by decide
theorem y_squared : matY * matY = matI := by decide
theorem z_squared : matZ * matZ = matI := by decide
theorem s_squared_is_z : matS * matS = matZ := by decide
theorem s_fourth_is_identity : (matS * matS) * (matS * matS) = matI := by decide
/-- H Z H = X, in the scaled units: (√2 H)·Z·(√2 H) = 2X. -/
theorem h_z_h_is_two_x : scaledH * matZ * scaledH = ⟨g 0, g 2, g 2, g 0⟩ := by decide
/-- Negative control: H X H = 2Z, never 2Y. -/
theorem h_x_h_is_not_two_y : scaledH * matX * scaledH ≠ ⟨g 0, ⟨0, -2⟩, ⟨0, 2⟩, g 0⟩ := by decide

/-- Row of four Gaussian integers. -/
structure V4 where
  e0 e1 e2 e3 : Gq
deriving DecidableEq, Repr

/-- 4×4 matrix over `Gq` as four rows. -/
structure M4 where
  r0 r1 r2 r3 : V4
deriving DecidableEq, Repr

namespace M4
def dot (a b : V4) : Gq := a.e0 * b.e0 + a.e1 * b.e1 + a.e2 * b.e2 + a.e3 * b.e3

def col (B : M4) : Nat → V4
  | 0 => ⟨B.r0.e0, B.r1.e0, B.r2.e0, B.r3.e0⟩
  | 1 => ⟨B.r0.e1, B.r1.e1, B.r2.e1, B.r3.e1⟩
  | 2 => ⟨B.r0.e2, B.r1.e2, B.r2.e2, B.r3.e2⟩
  | _ => ⟨B.r0.e3, B.r1.e3, B.r2.e3, B.r3.e3⟩

protected def mul (A B : M4) : M4 :=
  ⟨⟨dot A.r0 (col B 0), dot A.r0 (col B 1), dot A.r0 (col B 2), dot A.r0 (col B 3)⟩,
   ⟨dot A.r1 (col B 0), dot A.r1 (col B 1), dot A.r1 (col B 2), dot A.r1 (col B 3)⟩,
   ⟨dot A.r2 (col B 0), dot A.r2 (col B 1), dot A.r2 (col B 2), dot A.r2 (col B 3)⟩,
   ⟨dot A.r3 (col B 0), dot A.r3 (col B 1), dot A.r3 (col B 2), dot A.r3 (col B 3)⟩⟩
end M4

instance : Mul M4 := ⟨M4.mul⟩

def id4 : M4 :=
  ⟨⟨g 1, g 0, g 0, g 0⟩,
   ⟨g 0, g 1, g 0, g 0⟩,
   ⟨g 0, g 0, g 1, g 0⟩,
   ⟨g 0, g 0, g 0, g 1⟩⟩

/-- CNOT, qubit 0 controlling qubit 1 (basis 00, 01, 10, 11). -/
def cnot : M4 :=
  ⟨⟨g 1, g 0, g 0, g 0⟩,
   ⟨g 0, g 1, g 0, g 0⟩,
   ⟨g 0, g 0, g 0, g 1⟩,
   ⟨g 0, g 0, g 1, g 0⟩⟩

def swap : M4 :=
  ⟨⟨g 1, g 0, g 0, g 0⟩,
   ⟨g 0, g 0, g 1, g 0⟩,
   ⟨g 0, g 1, g 0, g 0⟩,
   ⟨g 0, g 0, g 0, g 1⟩⟩

theorem cnot_is_an_involution : cnot * cnot = id4 := by decide
theorem swap_is_an_involution : swap * swap = id4 := by decide
/-- Negative control. -/
theorem cnot_is_not_swap : cnot ≠ swap := by decide

end Qpu.Verify.Gate