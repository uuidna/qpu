/-! # Qpu.Fuse
The fused API registry: qubits, composing pairs, specificity buckets, cut entanglement within bounds. -/

-- The API registry fused (scripts/fuse-apis.mjs, fuse-receipt.json): qubits = connected + isolated; composing pairs =
-- entangled + one-way; the specificity buckets partition the pairs; each cut's ebits within its bound; receipts =
-- qubits + formulas. Snapshot integers, as theorem cern holds CMS counts.
theorem fuse : 2247 + 282 = 2529 ∧ 94598 + 343701 = 438299 ∧ 406 + 1565 + 3389 + 6011 + 12801 + 414127 = 438299 ∧ 448 ≤ 1264 ∧ 362 ≤ 955 ∧ 301 ≤ 340 ∧ 252 ≤ 284 ∧ 144 ≤ 166 ∧ 2529 + 438299 = 440828 := ⟨rfl, rfl, rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, Nat.le_of_ble_eq_true rfl, rfl⟩
