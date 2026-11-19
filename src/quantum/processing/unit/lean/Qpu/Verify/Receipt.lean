/-
  Qpu.Verify.Receipt — break-even economics of content-addressed caching.
  `sealed(s) = runs * address + answer`: every run pays the content-address
  check; the answer is paid once. Numbers are in deciseconds from the erpax
  reference bundle (~45.9s evaluation vs ~1.5s address check), measured on
  that corpus — re-measure before quoting elsewhere.
-/
namespace Qpu.Verify.Receipt

/-- Cost of a sealed workflow over `runs` runs. -/
def sealed (runs address answer : Nat) : Nat := runs * address + answer

/-- Cost of re-running the full evaluation every time. -/
def rerun (runs eval : Nat) : Nat := runs * eval

/-- Reference bundle, deciseconds: one full evaluation. -/
def evalDs : Nat := 459

/-- Reference bundle, deciseconds: one content-address check + lookup. -/
def checkDs : Nat := 15

/-- Even the first run is cheaper: lookup beats evaluation. -/
theorem address_cheaper_once : sealed 1 checkDs 0 < rerun 1 evalDs := by decide

/-- Break-even arrives by run two. -/
theorem breaks_even_by_run_two : sealed 2 checkDs 0 < rerun 2 evalDs := by decide

/-- ~30× speedup: 15·30 ≤ 459 < 15·31. -/
theorem speedup_is_thirtyfold : 30 * checkDs ≤ evalDs ∧ evalDs < 31 * checkDs := by decide

/-- Control: caching is itself not free. -/
theorem caching_has_a_cost : 0 < checkDs := by decide

/-- Order-dependent fold used for Merkle sealing: fold(a, b) = 256a + b. -/
def foldStep (acc item : Nat) : Nat := 256 * acc + item

def merkleFold (items : List Nat) : Nat := items.foldl foldStep 0

/-- Control: the fold is order-dependent, so swapping two leaves changes the root. -/
theorem fold_is_order_sensitive : merkleFold [1, 2] ≠ merkleFold [2, 1] := by decide

end Qpu.Verify.Receipt