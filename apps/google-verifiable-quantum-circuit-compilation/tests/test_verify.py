"""The verifier sends each x's shot phases to the MCP fusion door, and the door's theorems decide. A correct submission holds
for every sampled x; a submission off by 2^50 units fails at every x. Each submission is a .kmb file on disk, the form a
competitor submits. Needs a running qpu server: QPU_HOST (default http://localhost:8787)."""

import os
import tempfile

from fusion.lookup import phase_lookup_circuit
from fusion.verify import verify_of

WIDTH = 3
K = 64
TURN = 1 << 64


def submission_of(table: list[int], path: str) -> None:
    # The verifier prepares x itself, so the submission is the unitary part: value 0 leaves the register untouched.
    phase_lookup_circuit(WIDTH, table, K, 0).to_file(path)


def target_table(offset: int = 0) -> list[int]:
    # The table holds the target in units of 2^-64 turns, read from the door's theorem so the test defines no arithmetic.
    from fusion.verify import door_of

    rows = door_of([{"x": str(x), "phases": []} for x in range(1, 2**WIDTH)])["rows"]
    table = [0] + [(int(row["target"]) + offset) % TURN for row in rows]
    return table


def test_correct_submission_holds_for_every_sampled_x():
    with tempfile.TemporaryDirectory() as d:
        path = os.path.join(d, "good.kmb")
        submission_of(target_table(), path)
        verdict = verify_of(path, range(1, 2**WIDTH))
        assert verdict.checked == 2**WIDTH - 1
        assert verdict.failures == [], verdict.failures[:3]
        assert verdict.verified is False  # a sample, not the full domain


def test_offset_submission_fails_at_every_x():
    with tempfile.TemporaryDirectory() as d:
        path = os.path.join(d, "bad.kmb")
        submission_of(target_table(offset=1 << 50), path)
        verdict = verify_of(path, range(1, 2**WIDTH))
        assert len(verdict.failures) == 2**WIDTH - 1, verdict.failures[:2]
        assert verdict.verified is False


if __name__ == "__main__":
    test_correct_submission_holds_for_every_sampled_x()
    test_offset_submission_fails_at_every_x()
    print("verifier via the fusion door: ok")
