import Qpu.Lattice

/-! # Qpu.Register
qpu's qubit register as formulas over the hexbit width `w`. Each of the address's digits is a row of qubits: the version
digit is decided and holds none, the variant digit gives two bits to the RFC prefix, every other digit holds `w`. The
device's couplers are the row and column neighbours of that grid. Every count the code serves is an evaluation of these. -/

/-- the hex digits of one address -/
def digits : Nat := bits
/-- the version digit: decided by the content, so it holds no qubit -/
def versionAt : Nat := 12
/-- the variant digit: its two gateway bits are the RFC prefix -/
def variantAt : Nat := 16
/-- the bits the variant digit gives to the RFC prefix -/
def gateway : Nat := coins

/-- the qubits digit `i` holds at hexbit width `w` -/
def held (i w : Nat) : Nat := if i = versionAt then 0 else if i = variantAt then w - gateway else w

/-- the qubits one address holds at width `w`: the sum of its rows -/
def effective (w : Nat) : Nat := ((List.range digits).map (held · w)).sum

/-- the couplers inside the rows: neighbours along a digit's bits -/
def rowCouplers (w : Nat) : Nat := ((List.range digits).map (fun i => held i w - 1)).sum

/-- the couplers between rows: neighbours on the same bit of consecutive digits -/
def columnCouplers (w : Nat) : Nat := ((List.range (digits - 1)).map (fun i => min (held i w) (held (i + 1) w))).sum

/-- the register's couplers -/
def couplers (w : Nat) : Nat := rowCouplers w + columnCouplers w

theorem digits_eq : digits = 32 := by decide
theorem gateway_eq : gateway = 2 := by decide
theorem register_hexbit : hexbit = 4 := by decide
theorem coins_eq : coins = 2 := by decide

/-- an address at width `w` holds every digit's `w` save the version digit's `w` and the two gateway bits -/
theorem register_effective (w : Nat) (h : gateway ≤ w) : effective w = digits * w - w - gateway := by
  rw [gateway_eq] at h
  simp only [effective, held, digits_eq, gateway_eq, versionAt, variantAt, List.range_succ, List.range_zero, List.nil_append,
    List.map_append, List.map_cons, List.map_nil, List.sum_append, List.sum_cons, List.sum_nil]
  simp
  omega

/-- the couplers at every width `w`: the rows, less the version row and two bits of the variant row, plus the columns the decided digits leave -/
theorem register_couplers (w : Nat) :
    couplers w = (digits - coins) * (w - 1) + (w - gateway - 1) + (digits - 1 - hexbit) * w + coins * (w - gateway) := by
  simp only [couplers, rowCouplers, columnCouplers, held, digits_eq, gateway_eq, coins_eq, register_hexbit, versionAt, variantAt,
    List.range_succ, List.range_zero, List.nil_append, List.map_append, List.map_cons, List.map_nil, List.sum_append,
    List.sum_cons, List.sum_nil]
  simp
  omega

/-- `k` addresses chained by their handles hold `k` times one address: the register has no width ceiling -/
theorem register_chains (k w : Nat) : (List.replicate k (effective w)).sum = k * effective w := by
  induction k with
  | zero => simp
  | succ k ih => simp [List.replicate_succ, ih, Nat.succ_mul, Nat.add_comm]

/-- the register holds more than any count `N`: enough coins, each an address at width `hexbit`, exceed it -/
theorem register_unbounded (N : Nat) : ∃ k, N < k * effective hexbit :=
  ⟨N + 1, by rw [show effective hexbit = 122 by decide]; omega⟩
