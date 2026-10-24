"""Wave 2: the phase from a classical table, through kickmix's own lookup. For x on a WIDTH-qubit register and a table T[x]
of K bits, θ(x) = T[x] / 2^K turns. The circuit loads T[x] into a K-qubit target with init_lookup (target := table[address]),
applies Z_POW to target bit i with exponent 2^(i-K+1) half-turns, then clears the target with del_lookup. The global phase
of each shot is then 2θ(x) half-turns, on |x⟩, and every workspace qubit is back in |0⟩.

Unlike wave 1 this has no per-value flags: kickmix's lookup builds the unary iteration itself, so the same code runs at any
WIDTH. Qubits are allocated by CircuitBuilder, and the circuit is returned through finish_circuit()."""

import kickmix


def phase_lookup_circuit(width: int, table: list[int], K: int, value: int) -> kickmix.Circuit:
    assert len(table) == 2**width, "the table has one entry per value of x"
    assert all(0 <= t < 2**K for t in table), "each table entry fits in K bits"
    builder = kickmix.CircuitBuilder()
    x = builder.create_quantum_register(width, "x")
    target = builder.create_quantum_register(K, "target")
    for i in range(width):
        if (value >> i) & 1:
            builder.x(x[i])
    builder.init_lookup(table=table, address=x, target=target)
    for i in range(K):
        builder.z_pow(target[i], 2.0 ** (i - K + 1))
    builder.del_lookup(table=table, address=x, target=target)
    return builder.finish_circuit()
