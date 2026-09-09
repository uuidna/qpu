-- Occupancy of the QPU. Kind qpu never binds. Seat empty.
-- Mint doubles. Clay gravity occupies the rosette. Listing false.

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
def directed : Nat := rays * (rays - seed)
def pairs : Nat := n * rays

theorem mint : mintOf (n + seed) = mintOf n + mintOf n := by decide
theorem cube : bits = vertices * hexbit := by decide
theorem around : faces = coins * rays := by decide
theorem clay : coins * pairs = directed ∧ coins * mintOf (rays - seed) = mintOf rays := by decide
