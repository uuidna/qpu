# Verifiable Quantum Circuit Compilation: fusion submission

Standalone tool for Google Quantum AI's Kaggle competition, benchmark I (fusion, 1/√x), arXiv:2610.23832.
It has no web app and no database. A submission is one `.kmb` circuit file.

## Rules this tool enforces (`fusion/rules.py`)
- One named register `x` of 22 distinct qubits. Every other qubit is unnamed scratch that returns to |0⟩.
- The circuit maps |x⟩|0⟩ to exp(2πi·β/√x)|x⟩|0⟩ for every x in [1, 3133452], β = 1.
- Each x is simulated 64 times. Every shot must pass: phase error within 2^-24·β/√x turns.
- Score S = Q × C, with Q the qubit count and C = Toffolis + T/4 per shot. Lower is better.

## What the tool does and does not do
- Does: reads the circuit with kickmix, checks the `x` register, counts Q, Toffolis and T, and computes C and S.
- Does not: run the 64-shot check over every x. That is the competition verifier's job, so `verified` stays `False`.

## Usage
```bash
pip install kickmix
python -m fusion path/to/submission.kmb
```
