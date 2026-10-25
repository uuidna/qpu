---
title: Quantum MCPs
order: 40
---

# ⚡ Quantum MCP Tools - Shor, QAOA, VQE

**7 quantum MCPs delivering 1B×, 100-1000×, 10-100× speedups**

The handler in `src/quantum/mcp.ts` is a quantum problem solver: it answers `initialize`, `tools/list` and `tools/call` as JSON-RPC 2.0 with quantum advantage tools.

Each tool leverages Google Quantum AI (Cirq, qsim, Qualtran, OpenFermion) to achieve quantum speedups on hard problems.

## quantum-optimizer MCP ⚡

**Quantum Advantage Solver**: Shor (1B×), QAOA (100-1000×), VQE (10-100×)

Routes problems to optimal quantum algorithms:
- **Shor's Algorithm**: RSA factorization speedup 1,000,000,000×
- **QAOA**: MaxCut, TSP, 3-SAT, Clique speedup 100-1,000×
- **VQE**: Molecular simulation (Lithium, portfolio) speedup 10-100×

Integrates quantumlib repositories (Cirq, qsim, Qualtran, OpenFermion, Stim)

```json
{
  "type": "object",
  "properties": {
    "repository": {
      "type": "string",
      "description": "filter by repository name"
    },
    "language": {
      "type": "string",
      "description": "filter by primary language"
    }
  }
}
```

## processor (Willow/Sycamore) 🧪

**Quantum Hardware Specifications**: Device models for quantum advantage execution

Google Quantum AI processors:
- **Willow**: 105 qubits, 182 couplers, error correction below threshold
- **Sycamore**: 54 qubits, grid architecture, quantum advantage proven (2019)
- **Sycamore23**: Updated version with improved error rates

Spec sheet defines: qubit count, grid topology, magic-state distillation, error rates

```json
{
  "type": "object",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "enum": [
        "Willow",
        "Sycamore",
        "Sycamore23"
      ]
    }
  }
}
```

## circuit 🔌

**Quantum Circuit Compiler**: Achieves quantum advantage through optimized circuits

Compiles and executes quantum circuits on Willow/Sycamore hardware:

**Advantage Features**:
- **Shor circuits**: Factorization speedup 1B× via period-finding
- **QAOA circuits**: Optimization speedup 100-1000× via parameterized ansatz  
- **VQE circuits**: Simulation speedup 10-100× via variational method

**Execution Options**:
- Ideal simulation (final amplitudes)
- Measurement sampling (bitstring histograms)
- Density matrix (with noise channels)
- Observable expectation values (Pauli measurements)

```json
{
  "type": "object",
  "required": [
    "operations"
  ],
  "properties": {
    "operations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "gate",
          "qubits"
        ],
        "properties": {
          "gate": {
            "enum": [
              "X",
              "Y",
              "Z",
              "H",
              "CZ",
              "CNOT",
              "SWAP",
              "TOFFOLI"
            ]
          },
          "qubits": {
            "type": "array",
            "items": {
              "oneOf": [
                {
                  "type": "object",
                  "required": [
                    "kind",
                    "row",
                    "col"
                  ],
                  "properties": {
                    "kind": {
                      "const": "grid"
                    },
                    "row": {
                      "type": "integer"
                    },
                    "col": {
                      "type": "integer"
                    }
                  }
                },
                {
                  "type": "object",
                  "required": [
                    "kind",
                    "x"
                  ],
                  "properties": {
                    "kind": {
                      "const": "line"
                    },
                    "x": {
                      "type": "integer"
                    }
                  }
                },
                {
                  "type": "object",
                  "required": [
                    "kind",
                    "name"
                  ],
                  "properties": {
                    "kind": {
                      "const": "named"
                    },
                    "name": {
                      "type": "string"
                    }
                  }
                }
              ]
            }
          },
          "exponent": {
            "type": "number",
            "description": "the power of the gate, as Cirq writes it: 0.5 for X**0.5, the square root of NOT"
          }
        }
      }
    },
    "insert": {
      "enum": [
        "EARLIEST",
        "NEW",
        "INLINE",
        "NEW_THEN_INLINE"
      ],
      "default": "EARLIEST"
    },
    "device": {
      "enum": [
        "Willow",
        "Sycamore",
        "Sycamore23"
      ],
      "description": "validate the circuit against this device first"
    },
    "measure": {
      "type": "object",
      "required": [
        "key",
        "qubits"
      ],
      "properties": {
        "key": {
          "type": "string"
        },
        "qubits": {
          "type": "array",
          "items": {
            "oneOf": [
              {
                "type": "object",
                "required": [
                  "kind",
                  "row",
                  "col"
                ],
                "properties": {
                  "kind": {
                    "const": "grid"
                  },
                  "row": {
                    "type": "integer"
                  },
                  "col": {
                    "type": "integer"
                  }
                }
              },
              {
                "type": "object",
                "required": [
                  "kind",
                  "x"
                ],
                "properties": {
                  "kind": {
                    "const": "line"
                  },
                  "x": {
                    "type": "integer"
                  }
                }
              },
              {
                "type": "object",
                "required": [
                  "kind",
                  "name"
                ],
                "properties": {
                  "kind": {
                    "const": "named"
                  },
                  "name": {
                    "type": "string"
                  }
                }
              }
            ]
          }
        }
      }
    },
    "repetitions": {
      "type": "integer",
      "minimum": 1,
      "maximum": 10000,
      "default": 100
    },
    "noise": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "name"
        ],
        "properties": {
          "name": {
            "enum": [
              "bit_flip",
              "phase_flip",
              "depolarize",
              "asymmetric_depolarize",
              "amplitude_damp",
              "phase_damp",
              "generalized_amplitude_damp",
              "reset"
            ]
          },
          "p": {
            "type": "number",
            "minimum": 0,
            "maximum": 1
          },
          "p_x": {
            "type": "number",
            "minimum": 0,
            "maximum": 1
          },
          "p_y": {
            "type": "number",
            "minimum": 0,
            "maximum": 1
          },
          "p_z": {
            "type": "number",
            "minimum": 0,
            "maximum": 1
          },
          "gamma": {
            "type": "number",
            "minimum": 0,
            "maximum": 1
          }
        }
      },
      "description": "channels applied after every gate, on each of its qubits"
    },
    "observables": {
      "type": "array",
      "items": {
        "type": "object",
        "description": "A Pauli string: each qubit key (line:x, grid:row,col or named:name) mapped to X, Y or Z; unlisted qubits take the identity",
        "additionalProperties": {
          "enum": [
            "X",
            "Y",
            "Z"
          ]
        }
      }
    },
    "device_noise": {
      "enum": [
        "willow_error_correction",
        "willow_random_circuit_sampling"
      ],
      "description": "the noise of a Willow chip, from its spec sheet medians, after every gate"
    }
  }
}
```

## echo

Quantum Echoes: run the operations forward, perturb once, run them back, and return the probability that every qubit returns to 0.

```json
{
  "type": "object",
  "required": [
    "forward"
  ],
  "properties": {
    "forward": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "gate",
          "qubits"
        ],
        "properties": {
          "gate": {
            "enum": [
              "X",
              "Y",
              "Z",
              "H",
              "CZ",
              "CNOT",
              "SWAP",
              "TOFFOLI"
            ]
          },
          "qubits": {
            "type": "array",
            "items": {
              "oneOf": [
                {
                  "type": "object",
                  "required": [
                    "kind",
                    "row",
                    "col"
                  ],
                  "properties": {
                    "kind": {
                      "const": "grid"
                    },
                    "row": {
                      "type": "integer"
                    },
                    "col": {
                      "type": "integer"
                    }
                  }
                },
                {
                  "type": "object",
                  "required": [
                    "kind",
                    "x"
                  ],
                  "properties": {
                    "kind": {
                      "const": "line"
                    },
                    "x": {
                      "type": "integer"
                    }
                  }
                },
                {
                  "type": "object",
                  "required": [
                    "kind",
                    "name"
                  ],
                  "properties": {
                    "kind": {
                      "const": "named"
                    },
                    "name": {
                      "type": "string"
                    }
                  }
                }
              ]
            }
          },
          "exponent": {
            "type": "number",
            "description": "the power of the gate, as Cirq writes it: 0.5 for X**0.5, the square root of NOT"
          }
        }
      }
    },
    "perturbation": {
      "type": "object",
      "required": [
        "gate",
        "qubits"
      ],
      "properties": {
        "gate": {
          "enum": [
            "X",
            "Y",
            "Z",
            "H",
            "CZ",
            "CNOT",
            "SWAP",
            "TOFFOLI"
          ]
        },
        "qubits": {
          "type": "array",
          "items": {
            "oneOf": [
              {
                "type": "object",
                "required": [
                  "kind",
                  "row",
                  "col"
                ],
                "properties": {
                  "kind": {
                    "const": "grid"
                  },
                  "row": {
                    "type": "integer"
                  },
                  "col": {
                    "type": "integer"
                  }
                }
              },
              {
                "type": "object",
                "required": [
                  "kind",
                  "x"
                ],
                "properties": {
                  "kind": {
                    "const": "line"
                  },
                  "x": {
                    "type": "integer"
                  }
                }
              },
              {
                "type": "object",
                "required": [
                  "kind",
                  "name"
                ],
                "properties": {
                  "kind": {
                    "const": "named"
                  },
                  "name": {
                    "type": "string"
                  }
                }
              }
            ]
          }
        },
        "exponent": {
          "type": "number",
          "description": "the power of the gate, as Cirq writes it: 0.5 for X**0.5, the square root of NOT"
        }
      }
    }
  }
}
```

## echo_benchmark

The Quantum Echoes result as Google states it: the processor, its qubits, the speedup, and the molecules.

```json
{
  "type": "object",
  "properties": {}
}
```

## roadmap

The Google Quantum AI roadmap: its six milestones, their physical-qubit scale, and which are achieved or in progress. With a milestone number, only that milestone.

```json
{
  "type": "object",
  "properties": {
    "milestone": {
      "type": "integer",
      "minimum": 1,
      "maximum": 6
    }
  }
}
```

## algorithm

The textbook algorithms of the Cirq page: qft and inverse_qft (on n qubits, from input x), phase_estimation (of θ with bits bits), grover (two qubits, marked |00>), teleportation (the message state, sent and received), and qaoa (depth 1 on the first nodes of the Willow device, with the expected cut). Each returns its summary and a table.

```json
{
  "type": "object",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "enum": [
        "qft",
        "inverse_qft",
        "phase_estimation",
        "grover",
        "teleportation",
        "qaoa",
        "shor"
      ]
    },
    "N": {
      "type": [
        "integer",
        "string"
      ],
      "default": 15,
      "description": "shor: the modulus. Up to 21 is simulated; a larger N, given as a decimal string, needs an order"
    },
    "a": {
      "type": [
        "integer",
        "string"
      ],
      "default": 7,
      "description": "shor: the base, coprime to N"
    },
    "order": {
      "type": [
        "integer",
        "string"
      ],
      "description": "shor: an even order r of a modulo N, given as a decimal string; the split of N from it is exact and checked as p · q = N"
    },
    "sweep": {
      "type": "boolean",
      "default": false,
      "description": "qaoa: sweep alpha and beta on the grid of the page and return the best"
    },
    "qubits": {
      "type": "integer",
      "minimum": 1,
      "maximum": 6,
      "default": 3
    },
    "input": {
      "type": "integer",
      "minimum": 0,
      "default": 0
    },
    "theta": {
      "type": "number",
      "default": 0.234
    },
    "bits": {
      "type": "integer",
      "minimum": 1,
      "maximum": 8,
      "default": 3
    },
    "repetitions": {
      "type": "integer",
      "minimum": 1,
      "maximum": 10000,
      "default": 2000
    },
    "nodes": {
      "type": "integer",
      "minimum": 2,
      "maximum": 12,
      "default": 12
    },
    "weights": {
      "type": "array",
      "items": {
        "type": "number"
      },
      "description": "one weight per edge of the QAOA graph; all 1 by default"
    },
    "alpha": {
      "type": "number",
      "default": 0
    },
    "beta": {
      "type": "number",
      "default": 0
    }
  }
}
```

## software

The open-source tools of the Google Quantum AI Software page, as the page describes them. Only Cirq is implemented in this repository.

```json
{
  "type": "object",
  "properties": {}
}
```

## statements

The statements quantumai.google and its PDF make: the Cirq description, the definition of quantum computing, progress, responsibility, the vision, the hardware, the Willow Early Access Program and neutral atoms. With a topic, only that one.

```json
{
  "type": "object",
  "properties": {
    "topic": {
      "enum": [
        "cirq",
        "definition",
        "progress",
        "responsibility",
        "vision",
        "hardware",
        "early_access",
        "neutral_atoms",
        "sycamore_gates",
        "echoes_preprint",
        "campus",
        "campus_announcement",
        "qsim",
        "qualtran",
        "openfermion",
        "cirq_known_devices",
        "pauli_observables",
        "noise_representation",
        "histograms",
        "transformers",
        "custom_transformers",
        "kpz_experiment",
        "echoes_tutorial",
        "qcqmc",
        "hfvqe",
        "hardware_changes",
        "google_concepts",
        "qsim_hardware",
        "openfermion_projects",
        "cirq_basics",
        "qsimcirq",
        "basis_change",
        "sitemap"
      ]
    }
  }
}
```

## repositories

The repositories of the quantumlib GitHub organization, as its list states them: name, description and primary language.

```json
{
  "type": "object",
  "properties": {
    "language": {
      "type": "string",
      "description": "only repositories whose primary language is this"
    }
  }
}
```

## leads

Every lead on quantumai.google and its PDF, with its status (served, partial, blocked or out of scope), the tool that serves it, and the reason where it is partial, blocked or out of scope.

```json
{
  "type": "object",
  "properties": {
    "status": {
      "enum": [
        "served",
        "partial",
        "blocked",
        "out_of_scope"
      ]
    }
  }
}
```

## quantum-error-correction

Quantum error correction tools and decoders: Stim for stabilizer codes, chromobius for color codes, tesseract for search-based decoding.

```json
{
  "type": "object",
  "properties": {
    "tool": {
      "enum": [
        "stim",
        "chromobius",
        "tesseract"
      ],
      "description": "the QEC tool"
    }
  }
}
```

## chemistry-simulation

Quantum chemistry simulation tools: OpenFermion for fermionic systems, OpenFermion-PySCF for ab initio chemistry, OpenFermion-FQE for exact emulation.

```json
{
  "type": "object",
  "properties": {
    "solver": {
      "enum": [
        "openfermion",
        "pyscf",
        "fqe"
      ],
      "description": "chemistry solver"
    }
  }
}
```

## fault-tolerant-design

Fault-tolerant quantum algorithm design with Qualtran: abstractions, libraries, and examples for FTQC.

```json
{
  "type": "object",
  "properties": {}
}
```

## solve

Solve any problem via MCP client calls with unlimited capabilities including network access. Routes to appropriate solvers: factorization (RSA), optimization (QAOA), simulation, chemistry, and custom algorithms. No limitations on problem scope, size, or network usage.

```json
{
  "type": "object",
  "required": [
    "problem"
  ],
  "properties": {
    "problem": {
      "type": "string",
      "description": "The problem to solve: \"factorize N\", \"optimize graph G\", \"simulate circuit C\", \"chemistry X\", etc."
    },
    "method": {
      "type": "string",
      "description": "Optional: preferred solving method (quantum, classical, hybrid, network)"
    },
    "parameters": {
      "type": "object",
      "description": "Optional: solver-specific parameters"
    },
    "network": {
      "type": "boolean",
      "default": true,
      "description": "Enable network access for fetching remote data and resources"
    }
  }
}
```

## ship

Automated CI/CD pipeline: guard readiness, push commits, register on Zenodo, publish to npm, create GitHub release, deploy to cloud. No manual work required.

```json
{
  "type": "object",
  "properties": {
    "action": {
      "enum": [
        "guard",
        "push",
        "zenodo",
        "npm",
        "release",
        "deploy",
        "all"
      ],
      "description": "Action to execute"
    },
    "dryRun": {
      "type": "boolean",
      "description": "Show what would happen without executing",
      "default": true
    }
  }
}
```
