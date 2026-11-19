# Chemistry

The `chemistry-simulation` tool. The molecule is [`chemistry.ts`](processing/chemistry.ts). The detailed specification is [`README.md`](README.md). The `vqe` name on the `algorithm` tool sweeps ⟨Z⟩ on one qubit. That sweep is [`ALGORITHMS.md`](ALGORITHMS.md). This tool is H₂.

The basis is STO-3G hydrogen. Three primitive Gaussians, exponents 3.42525091, 0.62391373, and 0.1688554, coefficients 0.15432897, 0.53532814, and 0.44463454. The Bohr radius is 0.52917720859 Å. Integrals are closed forms for s-type Gaussians. Energies are hartree. The bond length is ångström. A bond length that is not positive is refused.

Two molecular orbitals, g and u, are the symmetric and antisymmetric combinations of the two atomic functions. The nuclear repulsion is 1/R in bohr. Hartree–Fock, MP2, and full CI are computed from those integrals. Full CI is the lower eigenvalue of the singlet block that couples \|gg⟩ and \|uu⟩.

| Argument | Meaning | When it is omitted |
|---|---|---|
| `bond_length` | H–H distance in ångström | the call is unlimited. Pass 0.7414 for the tutorial length |
| `theta` | evaluate the ansatz at this θ only | a sweep, when `steps` is also passed |
| `steps` | grid points of θ over [−π/2, π/2), at least 4 | the integrals, with no sweep. Pass 180 to prove the variational minimum |

The qubit Hamiltonian is the two-electron singlet, S_z = 0. Line 0 is the spin-up orbital (\|0⟩ = g, \|1⟩ = u). Line 1 is the spin-down orbital. The Hartree–Fock state is \|00⟩. The nuclear repulsion sits in the identity term. The Pauli terms are `I`, `Z0`, `Z1`, `Z0Z1`, and `X0X1`. The coefficients of `Z0` and `Z1` are equal. The coefficient of `X0X1` is (gu\|gu).

The ansatz is exp(−iθ Y⊗X) on \|00⟩. The simulated state is cos θ\|00⟩ + sin θ\|11⟩. Omit `theta` and the sweep evaluates every grid point on the density matrix, then a golden-section search between the neighbours of the best point, to a tolerance of 10⁻¹². The minimum is the full-CI energy of the same integrals. Pass `theta` and the call returns that one energy. The energy at θ = 0 is the Hartree–Fock energy.

`jordanWigner` is the Jordan–Wigner map of one fermionic term. The operators multiply left to right. a†_j is Z on every lower mode times (X_j − iY_j)/2, and a_j uses +iY_j. Omit the coefficient and it is 1. The number operator a†₀a₀ is (I − Z₀)/2. The two hopping terms a†₀a₁ + a†₁a₀ are (X₀X₁ + Y₀Y₁)/2. `chemistry-simulation { jordan_wigner }` is that map. The general MolecularData class stays partial.

The OpenFermion tutorial prints H₂ at 0.7 Å and 0.8 Å. `tutorialChecks` compares six figures at each length: nuclear repulsion, Hartree–Fock, MP2, full CI, and the two orbital energies. Twelve comparisons. The suite requires nuclear repulsion, Hartree–Fock, full CI, and the orbital energies within 10⁻⁹, and MP2 within 10⁻⁶. At 0.7414 Å, the length the example passes, the full-CI energy is about −1.137 Ha, below Hartree–Fock. Omit the bond length and the tool stays unlimited.
