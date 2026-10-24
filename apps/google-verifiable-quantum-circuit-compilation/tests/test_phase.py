"""Wave 1: the phase-from-bits circuit reproduces exp(2πi·θ(x)) on |x⟩ for every x of a 2-qubit register, measured by
kickmix's simulator as the global phase of each shot (half-turns)."""

import math

import kickmix

from fusion.phase import phase_circuit_text, prep_text

WIDTH, K = 2, 8


def test_phase_matches_table_for_every_x():
    table = [int(math.floor((1 / math.sqrt(v + 1) % 1.0) * 2**K)) for v in range(2**WIDTH)]
    circuit = phase_circuit_text(WIDTH, table, K)
    for v in range(2**WIDTH):
        sim = kickmix.Simulator(batch_size=1)
        sim.do(kickmix.Circuit(prep_text(WIDTH, v) + circuit))
        measured = float(sim.read_shot_phase(0)) % 2.0
        expected = (2 * table[v] / 2**K) % 2.0
        assert abs(measured - expected) < 1e-9, (v, measured, expected)
