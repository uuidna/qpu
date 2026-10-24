"""Phase from bits, the fusion method's phase stage in kickmix. For x on a register of WIDTH qubits and a table of phase
bits T[x] (K bits each, θ(x) = Σ_k b_k(x)·2^-(k+1) turns), the circuit sets one qubit a_k to b_k(x) by CX from one-hot flags,
applies Z_POW a_k 2^-k (half-turns, so 2θ turns), and uncomputes. The phase is exp(2πi·θ(x)) on |x⟩, with every ancilla
returned to |0⟩. Qubits are kickmix's q0, q1, …: x (WIDTH), then flags (2^WIDTH), then the K bit ancillas.
This version is for WIDTH = 2, where the one-hot flag is a single CCX."""


def layout(width: int, K: int) -> dict:
    x = list(range(width))
    flags = list(range(width, width + 2 ** width))
    bits = list(range(width + 2 ** width, width + 2 ** width + K))
    return {"x": x, "flags": flags, "bits": bits}


def phase_circuit_text(width: int, table: list[int], K: int) -> str:
    assert width == 2, "this version handles a two-qubit x register"
    L = layout(width, K)
    x0, x1 = L["x"]
    compute = []
    for v, f in enumerate(L["flags"]):
        flips = [q for i, q in enumerate(L["x"]) if not (v >> i) & 1]
        compute += [f"X q{q}" for q in flips]
        compute.append(f"CCX q{x0} q{x1} q{f}")
        compute += [f"X q{q}" for q in flips]
    for v, f in enumerate(L["flags"]):
        for k, a in enumerate(L["bits"]):
            if (table[v] >> (K - 1 - k)) & 1:
                compute.append(f"CX q{f} q{a}")
    phase = [f"Z_POW q{a} {2.0 ** -k}" for k, a in enumerate(L["bits"])]
    body = compute + phase + list(reversed(compute))
    return "\n".join(body) + "\n"


def prep_text(width: int, value: int) -> str:
    return "\n".join(f"X q{i}" for i in range(width) if (value >> i) & 1) + "\n"
