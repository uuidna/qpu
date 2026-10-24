---
title: MCP
order: 40
---

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
        "Willow"
      ]
    }
  }
}
```

## circuit

Compile a circuit from its operations and simulate it: the final amplitudes when there is no measurement, or sampled bitstrings and their histogram when there is one.

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
              "SWAP"
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
              "SWAP"
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
            "SWAP"
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
