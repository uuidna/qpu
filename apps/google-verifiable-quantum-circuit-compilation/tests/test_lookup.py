"""Wave 2: the lookup-based phase circuit reproduces exp(2πi·T[x]/2^K) on |x⟩ for every x, at widths 2 and 3, measured by
kickmix's simulator as the global phase of each shot (half-turns)."""

import math

import kickmix

from fusion.lookup import phase_lookup_circuit

K = 8


def test_lookup_phase_matches_table_for_every_x():
    for width in (2, 3):
        check_width(width)


def check_width(width):
    table = [int(math.floor((1 / math.sqrt(v + 1) % 1.0) * 2**K)) for v in range(2**width)]
    for v in range(2**width):
        sim = kickmix.Simulator(batch_size=1)
        sim.do(phase_lookup_circuit(width, table, K, v))
        measured = float(sim.read_shot_phase(0)) % 2.0
        expected = (2 * table[v] / 2**K) % 2.0
        assert abs(measured - expected) < 1e-9, (width, v, measured, expected)
