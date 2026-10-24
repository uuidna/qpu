"""Validate a fusion submission and score it: S = Q × C, C = Toffolis + T/4 per shot. Lower is better.

The register and qubit rules are checked here. The per-x verification (64 shots over every x, each within tolerance)
is the competition verifier's job and is not run by this tool; its result is reported as not verified."""

import re
import sys
from dataclasses import dataclass

import kickmix

from .rules import BASELINE, REGISTER_NAME, REGISTER_WIDTH


@dataclass
class Score:
    path: str
    registers: list
    Q: int
    toffoli: int
    t: int
    C: float
    S: float
    register_ok: bool
    verified: bool = False  # set only by the competition verifier

    def line(self) -> str:
        return (f"{self.path}: Q={self.Q} Toffoli={self.toffoli} T={self.t} C={self.C:.1f} S={self.S:.0f} "
                f"register '{REGISTER_NAME}' {'ok' if self.register_ok else 'MISSING'}; verified={self.verified}")


def registers_of(path: str) -> list:
    """The register names declared by REGISTER instructions, in order (quoted names only)."""
    with open(path, "rb") as f:
        text = f.read().decode("utf-8", errors="ignore")
    return re.findall(r'REGISTER\s+"([^"]+)"', text)


def score_of(path: str) -> Score:
    circuit = kickmix.Circuit.from_file(path)
    stats = circuit.operation_statistics()
    Q = circuit.num_qubits
    toffoli = stats.num_toffoli_like
    t = stats.num_t_like
    C = toffoli + t / 4
    regs = registers_of(path)
    register_ok = regs.count(REGISTER_NAME) == 1 and Q >= REGISTER_WIDTH
    return Score(path=path, registers=regs, Q=Q, toffoli=toffoli, t=t, C=C, S=Q * C, register_ok=register_ok)


if __name__ == "__main__":
    s = score_of(sys.argv[1])
    print(s.line())
    print(f"baseline: Q={BASELINE['Q']} C={BASELINE['C']} S={BASELINE['Q'] * BASELINE['C']}")
