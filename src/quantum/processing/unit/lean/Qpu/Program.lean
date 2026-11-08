/-! # Qpu.Program
A UUID program stores no params. The program is the ten schema nibbles. The tail is the three params:
the family index, 432 Hz, and the next family (`65535` on the last). One step rotates the program.
The handle and the tail stay. Ten steps return the program. Every Clay family is that one program.
The drift is the tuning ratio, and a family is not marked solved. A folder program closes that drift:
its third param is 0. -/

def schema : List Nat := [0, 1, 1, 1, 1, 0, 2, 2, 3, 1]

def rot1 : List Nat → List Nat
  | [] => []
  | x :: xs => xs ++ [x]

def rotN : Nat → List Nat → List Nat
  | 0, xs => xs
  | n + 1, xs => rotN n (rot1 xs)

def waveHz : Nat := 432
def pitchHz : Nat := 440
def familyCount : Nat := 19
def noneNext : Nat := 65535

def familyNext (i : Nat) : Nat :=
  if i + 1 < familyCount then i + 1 else noneNext

def familyNames : List String :=
  ["Annealing", "Anyon", "Clifford", "Coil", "Combinatorics", "Crypto", "Crypto (Shor)", "Galois", "Grover", "Hybrid", "Lattice", "Magic", "Mint", "Physics", "Qaoa", "Qft", "Shor", "Stabilizer", "Surfacecode"]

structure UuidProgram where
  handle : Nat
  program : List Nat
  family : Nat
  hz : Nat
  next : Nat

def step (p : UuidProgram) : UuidProgram :=
  { p with program := rot1 p.program }

def ofFamily (i handle : Nat) : UuidProgram :=
  { handle, program := schema, family := i, hz := waveHz, next := familyNext i }

theorem step_keeps (p : UuidProgram) :
    (step p).handle = p.handle ∧ (step p).family = p.family ∧ (step p).hz = p.hz ∧ (step p).next = p.next :=
  ⟨rfl, rfl, rfl, rfl⟩

theorem program_rotates : rotN 1 schema = [1, 1, 1, 1, 0, 2, 2, 3, 1, 0] := by decide

theorem program_returns : rotN 10 schema = schema ∧ schema.length = 10 := by decide

theorem uuid_families :
    familyNames.length = 19 ∧
    familyNames[0]? = some "Annealing" ∧
    familyNames[18]? = some "Surfacecode" ∧
    (List.range 18).all (fun i => familyNext i == i + 1) = true ∧
    familyNext 18 = 65535 := by decide

theorem uuid_programs :
    (List.range 19).all (fun i =>
      let p := ofFamily i 0
      (rotN 10 p.program == p.program) &&
      ((step p).handle == p.handle) &&
      ((step p).hz == 432) &&
      ((step p).family == i) &&
      ((step p).next == familyNext i) &&
      (p.program == schema)) = true := by decide

theorem uuid_drift :
    Nat.gcd waveHz pitchHz = 8 ∧
    waveHz / 8 = 54 ∧
    pitchHz / 8 = 55 ∧
    waveHz * 55 = pitchHz * 54 ∧
    pitchHz - waveHz = 8 ∧
    55 - 54 = 1 ∧
    34 * 54 = 1836 ∧
    34 * 55 = 1870 ∧
    34 * waveHz = 8 * 1836 := by decide

def witnessSquares : Nat := 6
def witnessTriangles : Nat := 8
def witnessFaces : Nat := witnessSquares + witnessTriangles

def mix (acc d : Nat) : Nat := (acc * 16 + d) % 4294967296

def fold : Nat → List Nat → Nat
  | acc, [] => acc
  | acc, d :: ds => fold (mix acc d) ds

def programIntegers (i : Nat) : List Nat :=
  schema ++ [i, waveHz, familyNext i, witnessSquares, witnessTriangles, witnessFaces]

def programHandle (i : Nat) : Nat := fold 0 (programIntegers i)

theorem witnesses_partition : witnessSquares = 6 ∧ witnessTriangles = 8 ∧ witnessFaces = 14 := by decide

theorem program_handles : (List.range 19).map programHandle = [
  0x32b0168e, 0x32c0268e, 0x32d0368e, 0x32e0468e, 0x32f0568e, 0x3300668e, 0x3310768e, 0x3320868e, 0x3330968e, 0x3340a68e,
  0x3350b68e, 0x3360c68e, 0x3370d68e, 0x3380e68e, 0x3390f68e, 0x33a1068e, 0x33b1168e, 0x33c1268e, 0x43cff68e
] := by decide

theorem uuid_cross : 2 = 2 ∧ 6 = 6 ∧ 7 + 2 = 9 ∧ witnessFaces = 14 ∧ 256 / 2 = 128 ∧ 10 ^ 38 < 2 ^ 128 := by decide

def closedMark : Nat := 0

def folderNames : List String :=
  ["app", "apps", "config", "db", "engine", "fs", "generators", "net", "os", "password", "payload", "processing", "uuid", "qpu-migrations"]

def folderIntegers (i : Nat) : List Nat :=
  schema ++ [i, waveHz, closedMark, witnessSquares, witnessTriangles, witnessFaces]

def folderHandle (i : Nat) : Nat := fold 0 (folderIntegers i)

def ofFolder (i handle : Nat) : UuidProgram :=
  { handle, program := schema, family := i, hz := waveHz, next := closedMark }

theorem families_closed :
    closedMark = 0 ∧
    folderNames.length = 14 ∧
    folderNames[0]? = some "app" ∧
    folderNames[13]? = some "qpu-migrations" ∧
    (List.range 19).all (fun i => (familyNext i == closedMark) = false) = true ∧
    (List.range 14).map folderHandle = [
      0x32b0068e, 0x32c0068e, 0x32d0068e, 0x32e0068e, 0x32f0068e, 0x3300068e, 0x3310068e,
      0x3320068e, 0x3330068e, 0x3340068e, 0x3350068e, 0x3360068e, 0x3370068e, 0x3380068e
    ] := by decide

theorem close_returns :
    (List.range 14).all (fun i =>
      let p := ofFolder i (folderHandle i)
      (rotN 10 p.program == schema) &&
      ((step p).handle == folderHandle i) &&
      ((step p).hz == waveHz) &&
      ((step p).family == i) &&
      ((step p).next == closedMark) &&
      (p.program == schema)) = true ∧
    rotN 1 schema = [1, 1, 1, 1, 0, 2, 2, 3, 1, 0] := by decide

theorem cross_lean :
    witnessSquares = 6 ∧ witnessTriangles = 8 ∧ witnessFaces = 14 ∧
    (List.range 6).all (fun k => rotN (10 - (k + 1)) (rotN (k + 1) schema) == schema) = true ∧
    (List.range 16).all (fun d => 15 - (15 - d) == d) = true ∧
    (List.range 14).all (fun i =>
      let p := ofFolder i (folderHandle i)
      p.next == closedMark && p.hz == waveHz && p.handle == folderHandle i) = true ∧
    (List.range 19).all (fun i =>
      let p := ofFamily i (programHandle i)
      p.hz == waveHz && (step p).handle == programHandle i && rotN 10 p.program == schema) = true := by decide

theorem uuid_program_all :
    schema.length = 10 ∧
    rotN 10 schema = schema ∧
    familyNames.length = 19 ∧
    familyNext 0 = 1 ∧
    familyNext 18 = 65535 ∧
    pitchHz - waveHz = 8 ∧
    7 + 2 = 9 ∧
    256 / 2 = 128 := by decide
