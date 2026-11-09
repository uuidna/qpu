/-! # Qpu.Physics.PhysicalConstant
---
component: physical constant (SI 2019, ISO 80000-1)
---
The defining constants the hardware reads, exact since the 2019 SI, each an integer mantissa: h = hNum × 10⁻⁴² J s,
e = eNum × 10⁻²⁸ C, k_B = kNum × 10⁻²⁹ J/K, and c in m/s. Every module states its identities cross-multiplied in integers. -/

namespace PhysicalConstant
def hNum : Nat := 662607015
def eNum : Nat := 1602176634
def kNum : Nat := 1380649
def c : Nat := 299792458
end PhysicalConstant
