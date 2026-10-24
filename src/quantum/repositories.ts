// The repositories of the quantumlib GitHub organization, as its repository list states them. Each description is the
// repository's own one-line description; the language is the primary language the list shows. Cirq, qsim, Qualtran and the
// OpenFermion family are the ones this repository implements or names elsewhere.

export type Repository = { name: string; description: string; language: string }

export const REPOSITORIES: readonly Repository[] = [
  { name: 'Cirq', description: 'Python framework for creating, editing, and running Noisy Intermediate-Scale Quantum (NISQ) circuits.', language: 'Python' },
  { name: 'Stim', description: 'A fast stabilizer circuit library.', language: 'C++' },
  { name: 'chromobius', description: 'Open-source implementation of a Möbius decoder for color codes used in quantum error correction (QEC)', language: 'Python' },
  { name: 'Qualtran', description: 'Qᴜᴀʟᴛʀᴀɴ is a Python library for expressing and analyzing Fault Tolerant Quantum algorithms.', language: 'Python' },
  { name: 'tesseract-decoder', description: 'Search-based decoder for quantum error correction (QEC) written in C++ and Python.', language: 'C++' },
  { name: 'OpenFermion-PySCF', description: 'OpenFermion plugin to interface with the electronic structure package PySCF.', language: 'Python' },
  { name: 'OpenFermion-FQE', description: 'The Fermionic Quantum Emulator (FQE) is a fermionic simulation research tool specializing in quantum circuits.', language: 'Python' },
  { name: 'qsim', description: 'Fast C++ and Python library for state-vector simulation of quantum circuits.', language: 'C++' },
  { name: 'OpenFermion', description: 'Python package for compiling and analyzing quantum algorithms to simulate electronic structures.', language: 'Python' },
  { name: 'unitary', description: 'Open-source API library providing common operations for adding quantum behaviors to games.', language: 'OpenQASM' },
  { name: 'ReCirq', description: 'Python modules for quantum computing applications and experiments using Cirq. Research using Cirq!', language: 'Python' },
  { name: 'TypedUnits', description: 'A fast units and dimensions library with support for static dimensionality checking and protobuffer serialization.', language: 'Python' },
  { name: 'OpenFermion-Psi4', description: 'OpenFermion plugin to interface with the electronic structure package Psi4.', language: 'Python' },
  { name: 'qchack-2021-challenge', description: 'The <G|oogl|e> challenge for Quantum Coalition Hackathon 2021', language: 'Python' },
  { name: 'OpenFermion-Cirq', description: 'Quantum circuits for simulations of quantum chemistry and materials.', language: 'Python' },
]
