# MCP tools

The handler in `src/quantum/mcp.ts` answers `initialize`, `tools/list` and `tools/call` as JSON-RPC 2.0. Its tools take typed
POST parameters described by the JSON Schema below, and they compile the circuit they describe on each call.

## processor

A Google Quantum AI processor as its spec sheet states it: qubits, the grid, the two chips, and the magic-state figures.

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

## circuit

Compile a circuit from its operations, placed by an insert strategy, and simulate it. Without noise or observables: the final amplitudes, or sampled bitstrings and their histogram when there is a measurement. With noise channels (as Cirq names them) or Pauli observables: the density matrix, its basis probabilities, trace, purity and the expectation values. A device validates the circuit first.

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
      "type": "integer",
      "minimum": 3,
      "maximum": 21,
      "default": 15
    },
    "a": {
      "type": "integer",
      "minimum": 2,
      "default": 7
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
