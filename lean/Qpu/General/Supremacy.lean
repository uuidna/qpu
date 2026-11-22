import Mathlib.Data.Nat.Basic
/-! # Qpu.General.Supremacy

Quantum supremacy as Preskill named it (2012): a programmable quantum device performs a task that no classical
computer can perform in any feasible time. Over times in seconds, a task is beyond classical reach when the quantum
time is within a feasibility bound `B` and the best classical time exceeds it, `tq ≤ B < tc`; the quantum time is then
below the classical one. `separation` proves that step from Mathlib's `lt_of_le_of_lt`.

The figures are data, never theorems. Each classical time is its authors' estimate for the best classical algorithm
they knew, not a lower bound: no classical lower bound for random circuit sampling is proved, and BQP ≠ BPP is open, so
no kernel can prove supremacy itself. What the kernel checks is the arithmetic of the published figures against the
bound. The bound is the age of the universe, 13.787 × 10⁹ years (Planck 2018), in Julian years of 31 557 600 s.

* Willow, random circuit sampling (Google Quantum AI, December 2024; the spec sheet in `processor.ts`): under 5 minutes,
  against an estimated 10²⁵ years on the Frontier supercomputer. `willow_rcs` checks 300 s ≤ B < 10²⁵ years.
* Sycamore, random circuit sampling (Arute et al., Nature 574, 505, 2019): 200 s against an estimated 10 000 years.
  Pan, Chen and Zhang (Phys. Rev. Lett. 129, 090502, 2022) sampled the same circuits classically in about 15 hours on
  512 GPUs, so the 2019 task did not stay beyond classical reach: `sycamore_rcs_within` checks 15 h ≤ B.

The worker lanes (`node:os`): machine-run sizes its lanes as `max 1 (min cores share)`, where the share is the cores
scaled by the free memory. `lanes_pos` bounds them below by one, `lanes_le_cores` above by the cores. -/

namespace Supremacy

theorem separation {tq b tc : Nat} (hq : tq ≤ b) (hc : b < tc) : tq < tc := lt_of_le_of_lt hq hc

theorem willow_rcs : 300 < 10 ^ 25 * 31557600 :=
  lt_of_le_of_lt (by decide : 300 ≤ 13787000000 * 31557600) (by decide : 13787000000 * 31557600 < 10 ^ 25 * 31557600)

theorem sycamore_rcs_within : 15 * 3600 ≤ 13787000000 * 31557600 :=
  le_of_lt (by decide : 15 * 3600 < 13787000000 * 31557600)

theorem lanes_pos (share : Nat) : 1 ≤ max 1 share := le_max_left 1 share

theorem lanes_le_cores {cores : Nat} (share : Nat) (h : 1 ≤ cores) : max 1 (min cores share) ≤ cores :=
  max_le h (min_le_left cores share)

end Supremacy
