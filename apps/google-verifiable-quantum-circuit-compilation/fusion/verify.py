"""The per-x verifier for a fusion submission. This client simulates; it computes no arithmetic of the check. For each x in
the domain it prepares |x⟩ on register x with |0⟩ elsewhere, runs the submission for SHOTS_PER_X shots, and reads each
shot's global phase exactly (kickmix returns a Fraction, in half-turns). The phases go to the MCP `fusion` door, which
answers the target and each shot's verdict from the theorems (fusion_floor, fusion_accepts, fusion_tolerance). A submission
is verified only when the whole domain 1..MAX_X was checked and every shot of every x holds."""

import json
import os
import urllib.request
from dataclasses import dataclass, field

import kickmix

from .rules import MAX_X, REGISTER_NAME, SHOTS_PER_X

HOST = os.environ.get("QPU_HOST", "http://localhost:8787")
BATCH = 256  # x values per door call


def door_of(items: list[dict]) -> dict:
    """One call to the fusion door; the reading is the JSON text inside the tool's content envelope."""
    body = {"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "fusion", "arguments": {"items": items, "full": True}}}
    req = urllib.request.Request(f"{HOST}/mcp", data=json.dumps(body).encode(), headers={"content-type": "application/json", "accept": "application/json, text/event-stream"})
    with urllib.request.urlopen(req) as r:
        reply = json.load(r)
    if "error" in reply:
        raise RuntimeError(f"fusion door: {reply['error']}")
    return json.loads(reply["result"]["content"][0]["text"])


@dataclass
class Verdict:
    path: str
    checked: int
    failures: list = field(default_factory=list)
    verified: bool = False

    def line(self) -> str:
        return f"{self.path}: checked {self.checked} x, {SHOTS_PER_X} shots each, failures {len(self.failures)}; verified={self.verified}"


def prep_of(qubits: list, x: int) -> kickmix.Circuit:
    return kickmix.Circuit("\n".join(f"X q{q.id}" for i, q in enumerate(qubits) if (x >> i) & 1) + "\n")


def shots_of(circuit: kickmix.Circuit, qubits: list, x: int) -> list[str]:
    sim = kickmix.Simulator(batch_size=SHOTS_PER_X)
    sim.do(prep_of(qubits, x))
    sim.do(circuit)
    return [str(sim.read_shot_phase(shot)) for shot in range(SHOTS_PER_X)]


def verify_of(path: str, xs=None) -> Verdict:
    """Run the verifier over xs (default: the whole domain 1..MAX_X). Verified only for the full domain with no failures."""
    circuit = kickmix.Circuit.from_file(path)
    qubits = circuit.register_data[REGISTER_NAME]
    domain = range(1, MAX_X + 1) if xs is None else xs
    failures: list = []
    checked = 0
    batch: list[dict] = []

    def flush():
        nonlocal checked
        if not batch:
            return
        reply = door_of(batch)
        for row in reply["rows"]:
            if not (row["floor"] and row["holds"]):
                failures.append({"x": row["x"], "target": row["target"], "failed_phases": row["failures"]})
        checked += len(batch)
        batch.clear()

    for x in domain:
        if x >= 2 ** len(qubits):
            failures.append({"x": x, "error": "outside the register"})
            continue
        batch.append({"x": str(x), "phases": shots_of(circuit, qubits, x)})
        if len(batch) == BATCH:
            flush()
    flush()
    full = xs is None
    return Verdict(path=path, checked=checked, failures=failures[:50], verified=full and checked == MAX_X and not failures)


if __name__ == "__main__":
    import sys

    print(verify_of(sys.argv[1], None if len(sys.argv) < 3 else range(1, int(sys.argv[2]) + 1)).line())
