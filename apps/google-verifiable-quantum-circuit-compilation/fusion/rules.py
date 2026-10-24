"""The competition's rules, as constants. Source: Google Quantum AI, Verifiable Quantum Circuit Compilation (Kaggle),
benchmark I, fusion 1/√x, arXiv:2610.23832. A submission is one .kmb circuit file."""

REGISTER_NAME = "x"          # exactly one named register, with this name
REGISTER_WIDTH = 22          # distinct qubits in that register
SHOTS_PER_X = 64             # each x in the domain is simulated this many times
MAX_X = 3 * (2**10 - 2) ** 2  # the domain is x in [1, MAX_X] (n_p = 10)
TOLERANCE_BITS = 24          # tol(x) = 2^-24 * beta / sqrt(x) turns; every shot must pass
BASELINE = {"Q": 260, "toffoli": 7735, "T": 1, "rotations": 37, "C": 7988}
