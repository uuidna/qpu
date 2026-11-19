import Qpu.Physics.PhysicalConstant

/-! # Qpu.Information.PhysicalQubit.Coil
---
component: flux-bias coil (IEC 60050-151 coil; Krantz et al. 2019, doi:10.1063/1.5089550)
---
The winding that tunes a qubit: a current I through the flux-bias line threads Φ = M·I through the qubit SQUID by the mutual
inductance M, and the SQUID reads that flux modulo the flux quantum Φ₀ = h/2e. Sycamore drives its 54 qubit and 88 coupler bias
lines from 14-bit, 1 GS/s DACs (arXiv:1910.11333, SI III.1); it states no M, so none is assumed here. Currents are in nanoamperes
and inductances in femtohenries, so Φ/Φ₀ = M·I·2·eNum / (hNum·10¹⁰). -/

namespace Coil
open PhysicalConstant

/-- the flux the coil threads, in units where hNum·10¹⁰ is one flux quantum -/
def flux (M I : Nat) : Nat := M * I * 2 * eNum

/-- the qubit reads the flux modulo one flux quantum: a whole flux quantum added leaves it unchanged, for every M and every current -/
theorem periodic (M I k : Nat) : (flux M I + k * (hNum * 10 ^ 10)) % (hNum * 10 ^ 10) = flux M I % (hNum * 10 ^ 10) :=
  Nat.add_mul_mod_self_right _ _ _

end Coil
