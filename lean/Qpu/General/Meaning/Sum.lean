import Qpu.General.MachineLearning.FederatedLearning

/-- Computes the sum of the elements of a list.

Examples:
* `[a, b, c].sum = a + (b + (c + 0))`
* `[1, 2, 5].sum = 8`
-/
theorem sumZ_eq_list_sum (l : List Int) : Qpu.Federated.sumZ l = l.sum := by
  induction l with
  | nil => rfl
  | cons x xs ih => rw [Qpu.Federated.sumZ, List.sum_cons, ih]
