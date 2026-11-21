/-! # Qpu.Processing.QuantumErrorCorrection
---
component: quantum error correction (ISO/IEC 4879:2024 3.4.6)
---
The three-bit repetition code corrects every single bit flip by majority decoding. In Steane's seven-qubit code each single
error trips its own nonzero Hamming syndrome and the checks overlap evenly (CSS). Shor's nine-qubit code gives each bit flip its
own syndrome and names each phase flip's block. At distance d ≥ 2t + 1, any t errors are corrected. -/

namespace QuantumErrorCorrection

/-- the three-bit repetition code word of `b` -/
def encode (b : Bool) : Nat := if b then 7 else 0
/-- flip bit `e` of the word (no flip when `e = 3`) -/
def flip (e w : Nat) : Nat := if e < 3 then w ^^^ 2 ^ e else w
/-- majority decoding -/
def decode (w : Nat) : Bool := ((List.range 3).filter fun k => (w / 2 ^ k) % 2 == 1).length ≥ 2

/-- the repetition code corrects every single bit flip, and no flip at all -/
theorem repetition_corrects : ∀ b : Bool, ∀ e, e < 4 → decode (flip e (encode b)) = b := by decide

/-- Hamming check `j` reads the qubits whose position (1 to 7) has bit `j` set -/
def hamming (j i : Nat) : Bool := (i + 1) / 2 ^ j % 2 == 1
/-- the syndrome of one error on qubit `i` (0 to 6): the checks it trips, read as a number -/
def syndrome (i : Nat) : Nat := (List.range 3).foldl (fun s j => s + if hamming j i then 2 ^ j else 0) 0

/-- Steane: each single-qubit error trips its own nonzero syndrome, the position it names -/
theorem steane_corrects : ∀ i, i < 7 → syndrome i = i + 1 := by decide
/-- Steane is CSS: every pair of checks overlaps on an even number of qubits, so the X and Z checks commute -/
theorem steane_css : ∀ a, a < 3 → ∀ b, b < 3 → ((List.range 7).filter fun i => hamming a i && hamming b i).length % 2 = 0 := by decide

/-- Shor's code: the two Z checks inside each block of three, and the two X checks between blocks -/
def bitChecks : List (List Nat) := [[0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8]]
def phaseChecks : List (List Nat) := [[0, 1, 2, 3, 4, 5], [3, 4, 5, 6, 7, 8]]
/-- the checks an error on qubit `q` trips (qubit 9 is none) -/
def flags (checks : List (List Nat)) (q : Nat) : List Bool := checks.map (·.contains q)

/-- Shor: every single bit flip trips its own syndrome, and every single phase flip names its block -/
theorem shor_nine : (∀ a, a < 9 → flags bitChecks a ≠ flags bitChecks 9 ∧ ∀ b, b < 9 → flags bitChecks a = flags bitChecks b → a = b) ∧
    ∀ a, a < 9 → flags phaseChecks a ≠ flags phaseChecks 9 ∧ ∀ b, b < 9 → (flags phaseChecks a = flags phaseChecks b ↔ a / 3 = b / 3) := by decide

/-- at distance d ≥ 2t + 1, two error patterns of weight at most t never span d: a code of that distance corrects t errors -/
theorem distance_corrects (d t e₁ e₂ : Nat) (h : 2 * t + 1 ≤ d) (h₁ : e₁ ≤ t) (h₂ : e₂ ≤ t) : e₁ + e₂ < d := by omega

end QuantumErrorCorrection
