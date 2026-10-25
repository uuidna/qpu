---
title: MCP
order: 40
---

# MCP tools

The handler in `src/quantum/mcp.ts` answers `initialize`, `tools/list` and `tools/call` as JSON-RPC 2.0. Its tools take typed
POST parameters described by the JSON Schema below, and they compile the circuit they describe on each call. The tools are
organised in toolboxes, each one idea complete with its toolset and its skillset (instructions, directions, selftest, examples);
`tools/list` names each tool's toolbox in `_meta.toolbox`, and `initialize` carries every toolbox's instructions.

## Toolbox `google`

the Google Quantum AI layer: the Willow processor as its spec sheet states it, Cirq gates and circuits, Quantum Echoes, the roadmap, the software, the statements and the repositories.

**Skill.** Call any tool with the arguments its schema names; every result is a block (widget, Open Graph, shadcn item) under the licence; the examples page is the documentation and the tests.

**Tests itself:** server only: every example replays as documented (the audit).

Tools: [processor](#processor), [circuit](#circuit), [echo](#echo), [echo_benchmark](#echo_benchmark), [roadmap](#roadmap), [algorithm](#algorithm), [software](#software), [statements](#statements), [repositories](#repositories), [quantumlib](#quantumlib), [quantum-error-correction](#quantum-error-correction), [chemistry-simulation](#chemistry-simulation), [fault-tolerant-design](#fault-tolerant-design).

## Toolbox `tree`

the tree knows itself: its leads, its self-audit, any statement matched or proved impossible, the Clay register recomputed, any UUID verified cheaply, its metrics in real time.

**Skill.** audit replays every example and every toolbox selftest; match decides any statement; verify checks a UUID against its seal, content and neighbours; clay recomputes the register; leads lists what is owed.

**Tests itself:** server only: the audit audits the audit; toolbox → toolbox: match is the judge of readiness and the engine of imagine.

Tools: [leads](#leads), [audit](#audit), [match](#match), [clay](#clay), [verify](#verify), [metrics](#metrics), [textbook](#textbook).

## Toolbox `flow`

the run of the tree as tools: discover the hosts, verify the leads, let the unit judge, imagine the next leads; the client only fetches and writes.

**Skill.** Use the flow toolbox in phases. discover: call once for the request list, fetch every request as given (POST bodies verbatim), call again with the answers until the phase is "discovery"; write discovery.json and the page. wave: call for the request list, fetch each URL once (pace per host), call again with status, ok, ms and the body text, plus the contracts from the discovery; write verification.json and the page. readiness: call with the verification, the discovery, the cleanup subjects you measured present and the theorem ledger; make the border calls and the unit calls it returns, against the MCP hosts; call again with their answers; write readiness.json and the page. imagine: call once; write imagination.json and the page. Before a live run, call any flow tool with selftest and record the result; a failed check is a lead, never a stop.

**Tests itself:** server only: each tool on fixtures; server → client: every request a tool emits is one the client can answer; client → server: answers read back into data and pages; toolbox → toolbox: discovery feeds wave and readiness, wave feeds readiness, match feeds imagine and the judge.

Tools: [discover](#discover), [wave](#wave), [readiness](#readiness), [imagine](#imagine).

## Toolbox `language`

any language and dialect, offline and token-free: translation by vocabulary both ways, the vocabulary measured against every term the surface emits, and prose programmed from a tool's result and its toolbox's skill.

**Skill.** translate takes text, from and to and answers by vocabulary; call it without text to measure the tables and get the missing terms per locale, which are the leads to fill (from the unit's vocabulary door where discovery finds one, or by a person). prose takes a tool, its arguments and a locale and renders the answer as sentences; feed its untranslated words back as vocabulary leads.

**Tests itself:** server only: every table reads both ways (en→locale→en returns the term); toolbox → toolbox: prose renders the tree and flow toolboxes' answers; numerals read by the match toolbox's reader; client → server: the coverage phase hands the client the missing terms to fill.

Tools: [translate](#translate), [prose](#prose).

## Toolbox `raid`

the docket as a database: MongoDB's query and update language ported as pure functions over content-addressed entries, so any document framework (Payload first) stores on the RAID through its mongodb adapter.

**Skill.** A client that is a database adapter (Payload's mongodb adapter interface) reads a collection's rows from the docket (GET /docket?collection=…, the bodies), calls mongo with the op and the rows, and writes the entries the tool returns (POST /docket, writer role) or deletes the ids (DELETE, admin role; a linked entry is refused and kept). Every query is pure and recomputable; every write is content-addressed and linked to what it replaces.

**Tests itself:** server only: the query language on a sample collection; toolbox → toolbox: entries are addressed with the tree's uuidOf and verified by the tree toolbox's verify; client → server: the rows come from the docket; the entries go back to it.

Tools: [mongo](#mongo).

## Toolbox `billing`

Stripe per tenant: a licence bought at one tenant is an entry valid on the domains it names, every event idempotent and linked, every signature verified with the tenant's own secret, every refusal a lead.

**Skill.** Per tenant the author sets two wrangler secrets, STRIPE_SECRET_KEY_&lt;TENANT&gt; and STRIPE_WEBHOOK_SECRET_&lt;TENANT&gt;, and registers https://&lt;host&gt;/docket/stripe as the webhook endpoint at Stripe. A client calls stripe plan and the Worker executes the plan with the tenant key, answering the session url. Stripe posts events to the tenant's endpoint; the Worker calls stripe webhook with the raw body, the Stripe-Signature header and the tenant secret, writes the entry it gets to the tenant docket (mirrors carry it to the others), and answers 200 on a duplicate. Any host answers stripe state for a subject at its domain from the entries it holds.

**Tests itself:** server only: SHA-256 and HMAC vectors, the signature round trip, every event type to its state, every scenario between tenants; client → server: the Worker hands the raw body, the header and the secret; the handler never holds a key; toolbox → toolbox: entries are addressed with the tree's uuidOf, kept in the raid docket, verified by the tree toolbox's verify.

Tools: [stripe](#stripe).

## Toolbox `legal`

the legal and security audit of this MCP through MCP: the author's claims judged by the unit's forensic, legal and security doors, free agents by default, the operator alone overriding, beside the tree's own checks of its sources.

**Skill.** The client reads the tree's texts (README, CITATION.cff, .zenodo.json, package.json, src/worker.ts, the billing and hmac modules, mcp.ts), the discovery and the theorem ledger, calls legal for the plan, makes every call against its host, and calls legal again with the answers; it writes legal.json and the page. Agents are the free doors discovery found; the operator overrides with agents: [...] and nothing else does. A refusal is recorded, never retried blindly.

**Tests itself:** server only: claims from fixture metadata, security checks on fixture sources, the plan, the audit of fixture answers; client → server: the texts come from the tree, the answers from the doors; toolbox → toolbox: the doors come from discovery; the claims include every perspective lead; the licence module is the measure of drift.

Tools: [legal](#legal).

## Toolbox `repository`

the repository watched: every workspace, branch, tag and release here compared with the remote and the archive online, every disagreement a lead.

**Skill.** The client gathers with git: the remote url, HEAD, the branch, package.json's version, worktree list, every branch with its upstream and head, every tag with its commit, and the concept DOI from .zenodo.json's related identifiers; calls repository for the requests; fetches them (GitHub needs no token for public reads); calls again with the answers; writes repository.json and the page; its leads join the next-leads docket. Offline, the local facts alone are written.

**Tests itself:** server only: fixture facts against fixture answers give every kind of lead once; client → server: git facts in, GitHub and Zenodo bodies in; toolbox → toolbox: requests checked against the contracts discovery found; leads feed readiness.

Tools: [repository](#repository).

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

The textbook algorithms of the Cirq page: qft and inverse_qft (on 1 to 6 qubits, from input x), phase_estimation (of θ with 1 to 8 bits), grover (two qubits, marked \|00&gt;), teleportation (the message state, sent and received), qaoa (depth 1 on the first 2 to 12 sorted qubits of the Sycamore device, the page's instance, with the expected cut), and shor (order finding for N from 3 to 21, the state-vector bound). Each returns its summary and a table.

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

The statements quantumai.google, its PDFs and the quantumlib repositories make, each as the page states it: Cirq, the definition of quantum computing, progress, responsibility, the vision, the hardware and the full stack, the Willow Early Access Program, neutral atoms, the Sycamore gates, the Weber datasheet, the Quantum Echoes preprint, the campus, qsim, Qualtran, OpenFermion, the Cirq guide pages followed, the Resources, Research, journey, lab and Qubit Game pages, the QEC milestone, the APS summit pages and the sitemap. With a topic, only that one.

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
        "sitemap",
        "resources",
        "qubit_game",
        "lab_tour",
        "learn_map",
        "research",
        "qec_milestone",
        "weber_datasheet",
        "full_stack",
        "aps_summit"
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

## quantumlib

The fifteen repositories of the quantumlib GitHub organization, each with what this repository implements of it: the exports of cirq.ts that stand for Cirq's classes, and the parts of qsim, OpenFermion, Qualtran, Stim and ReCirq the other tools emulate, named from the code that runs here. A cross-reference computed at call time, not a catalogue.

```json
{
  "type": "object",
  "properties": {
    "repository": {
      "type": "string",
      "description": "only the repository with this name"
    }
  }
}
```

## quantum-error-correction

The three-qubit repetition code, simulated on the density matrix: a logical qubit encoded, a channel (bit_flip, phase_flip or depolarize) of probability p acting once on each data qubit, syndromes extracted and corrected by majority, and the logical error read from the simulated state against the raw error of an unencoded qubit, at the p given and over a sweep. The break-even p is bisected from the simulation; the textbook 3p² − 2p³ is reported beside it where it applies. The encoding, syndrome and correction gates are noiseless (the code-capacity model). The quantumlib QEC packages are listed as cited data.

```json
{
  "type": "object",
  "properties": {
    "code": {
      "enum": [
        "bit_flip",
        "phase_flip"
      ],
      "default": "bit_flip"
    },
    "channel": {
      "enum": [
        "bit_flip",
        "phase_flip",
        "depolarize"
      ],
      "default": "bit_flip"
    },
    "p": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "default": 0.1
    },
    "logical": {
      "enum": [
        "0",
        "1",
        "+",
        "-"
      ],
      "default": "0",
      "description": "the logical state encoded; |+⟩ and |−⟩ are eigenstates of the logical X a matched code can miss, so they show no error from it"
    },
    "sweep": {
      "type": "array",
      "items": {
        "type": "number",
        "minimum": 0,
        "maximum": 1
      },
      "description": "the probabilities to sweep; by default 0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6"
    }
  }
}
```

## chemistry-simulation

Molecular hydrogen in STO-3G as a variational energy evaluation on the simulator: the integrals are computed here from the published basis constants and checked against the energies the OpenFermion tutorial prints at 0.7 and 0.8 Å; the two-electron Hamiltonian is a two-qubit Pauli-term operator; the ansatz exp(−iθ Y⊗X) on the Hartree-Fock state is swept over θ, every energy an expectation value of the simulated state, and the minimum found is returned with the full-CI energy the same integrals give. A bond length in ångström, or one θ to evaluate.

```json
{
  "type": "object",
  "properties": {
    "bond_length": {
      "type": "number",
      "exclusiveMinimum": 0,
      "default": 0.7414,
      "description": "the H–H distance in ångström; 0.7414 is the tutorial's"
    },
    "theta": {
      "type": "number",
      "description": "evaluate the energy at this θ only, instead of sweeping"
    },
    "steps": {
      "type": "integer",
      "minimum": 4,
      "default": 180,
      "description": "grid points of the sweep over [−π/2, π/2)"
    }
  }
}
```

## fault-tolerant-design

Resource counts read from the circuits this repository builds: the QFT on n qubits, Grover, teleportation, Shor for N up to 21, the QAOA instance and the repetition-code cycle. For each: gates by name, two-qubit gates, depth in moments, and the T-count of the gates whose Clifford+T cost is stated (Toffoli 7, T 1, controlled-S 3; Cliffordness computed from each unitary). Rotations and undecomposed gates are listed and left uncounted, and the count says whether it is complete. Qualtran is the cited library for the general case.

```json
{
  "type": "object",
  "properties": {
    "circuit": {
      "enum": [
        "qft",
        "grover",
        "teleportation",
        "shor",
        "qaoa",
        "qec",
        "all"
      ],
      "default": "all"
    },
    "qubits": {
      "type": "integer",
      "minimum": 1,
      "maximum": 6,
      "default": 3,
      "description": "qft: the register size"
    },
    "N": {
      "type": "integer",
      "minimum": 3,
      "maximum": 21,
      "default": 15,
      "description": "shor: the modulus"
    },
    "a": {
      "type": "integer",
      "minimum": 2,
      "default": 7,
      "description": "shor: the base"
    },
    "nodes": {
      "type": "integer",
      "minimum": 2,
      "maximum": 12,
      "default": 12,
      "description": "qaoa: the nodes of the page's instance"
    }
  }
}
```

## leads

Every lead on quantumai.google (every page of its sitemap, read whole), its PDFs and the quantumlib repositories, with its status (served, partial, blocked, out of scope, or open: in the sitemap and not yet followed), the tool that serves it, and the reason where it is not served. The whole list is returned; nothing is truncated.

```json
{
  "type": "object",
  "properties": {
    "status": {
      "enum": [
        "served",
        "partial",
        "blocked",
        "out_of_scope",
        "open"
      ]
    }
  }
}
```

## audit

The surface audits itself through tools/call: every tool has a schema and an example, every documented example replays as documented, every served lead names a served tool, and the error paths answer as JSON-RPC requires. Each check carries its evidence; a failed check is a lead, not a ruling.

```json
{
  "type": "object",
  "properties": {}
}
```

## match

Any statement, matched against everything the surface can do. served: a call answers it and is returned. impossible: the surface proves it cannot, from a schema bound the statement exceeds, a lead whose reason says why, or the handler's own refusal; the cluster then names the served possibilities around it and verify names the live sources the client's MCP can check. unknown: nothing matches, and the statement comes back as a new lead to develop.

```json
{
  "type": "object",
  "required": [
    "statement"
  ],
  "properties": {
    "statement": {
      "type": "string",
      "description": "any prompt or statement; Glagolitic numerals are read as integers"
    },
    "locale": {
      "type": "string",
      "enum": [
        "en",
        "bg",
        "de",
        "fr",
        "es",
        "it",
        "ru",
        "zh",
        "ja",
        "pt",
        "nl"
      ],
      "description": "the language of the statement, translated to English by vocabulary offline before the match; the verdict is given back in it"
    }
  }
}
```

## clay

The Clay register recomputed in exact integer arithmetic: the Lean definitions of Qpu/Clay.lean and its imports ported one for one, every relation_N statement parsed and evaluated, each side's value and the bit width it needs reported. What the Lean kernel accepted by rfl, redone with + − × ÷ on naturals only, so a small machine can redo the same sums and compare addresses. Nothing here is a proof of an open problem: the relations are identities between the unit's own constants.

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "one relation, e.g. relation_15; omit for all"
    }
  }
}
```

## verify

Cheap verification of one UUID: its seal (the version nibble the other 31 nibbles decide, one modular power, no content needed), its content (one fold), and its neighbours in a chain (the predecessor it names and the successor that names it). Each check is independent; a check without its input is not decided rather than passed.

```json
{
  "type": "object",
  "required": [
    "uuid"
  ],
  "properties": {
    "uuid": {
      "type": "string",
      "description": "the UUID to verify"
    },
    "content": {
      "type": "string",
      "description": "the text the UUID should be the address of"
    },
    "prev": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        }
      },
      "description": "the predecessor in the chain"
    },
    "self": {
      "type": "object",
      "properties": {
        "prev": {
          "type": "string"
        }
      },
      "description": "what this entry names as its predecessor"
    },
    "next": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "prev": {
          "type": "string"
        }
      },
      "description": "the successor in the chain"
    }
  }
}
```

## metrics

The computable metrics of this tree in real time: tools and toolboxes, examples and how many name the kernel-accepted theorem that makes them true, the kernel's theorem counts from its own index, leads by status, the audit's checks, the balancer's memory. Quality is proven by theorems, not textbook examples; this is the measure of how far that holds.

```json
{
  "type": "object",
  "properties": {
    "artefacts": {
      "type": "object",
      "description": "the run's artefacts the client read: discovery, verification, readiness, repository, legal, docket, receipts; without them the tree's own counts alone"
    }
  }
}
```

## textbook

The QPU textbook as an adapter: every example categorised for reuse — by toolbox, by tool, by the kernel-accepted theorem that backs it, by that theorem's module — and, with reuse: &lt;example id&gt;, that example replayed and its result returned. The categories are computed from the registries, never written by hand.

```json
{
  "type": "object",
  "properties": {
    "verify": {
      "type": "boolean",
      "description": "the wave over the textbook: every example's verification requests on public datasets and APIs, for any client device to fetch"
    },
    "example": {
      "type": "string",
      "description": "with verify: one example only, so a device at the edge walks the textbook within the Worker's budget"
    },
    "results": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "the requests fetched (url, status, ok, contracted), joined back by url and sealed"
    },
    "reuse": {
      "type": "string",
      "description": "an example id to replay"
    },
    "category": {
      "type": "string",
      "enum": [
        "toolbox",
        "tool",
        "theorem",
        "module"
      ],
      "description": "one category to list; omit for all"
    }
  }
}
```

## discover

Discovery before use. Without answers: every request the client must make for the contracts of the hosts this tree talks to (MCP tools/list and catalogue doors, the verifiers' OpenAPI, index or identify documents, /.well-known/qpu.json). With answers: the follow-ups still to fetch (catalogue doors whose contract is unread) and, once none remain, the discovery: hosts, doors with what they take and answer, capabilities by which clients choose doors, and the leads (hosts with no machine contract). Pure; the client fetches.

```json
{
  "type": "object",
  "properties": {
    "mcpHosts": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "MCP endpoints to ask; default the unit and this tree's own"
    },
    "answers": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "the requests answered: each request as emitted plus status, type and text"
    },
    "selftest": {
      "type": "boolean",
      "description": "run the flow toolbox's cross-test instead: every direction, every toolbox feeding the next"
    }
  }
}
```

## wave

The verification wave. Without results: every request the surface's leads and tree facts need, once per URL with the leads it serves. With results (each request plus status, ok, ms and the body text): what came back read into one-line notes, a check of each request against the OpenAPI contract its host published (from discovery), and a summary by verifier. Pure; the client fetches.

```json
{
  "type": "object",
  "properties": {
    "results": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "contracts": {
      "type": "object",
      "description": "host → OpenAPI path templates, from the discovery"
    },
    "leads": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "lead ids to restrict the wave to; default all"
    },
    "selftest": {
      "type": "boolean",
      "description": "run the flow toolbox's cross-test instead: every direction, every toolbox feeding the next"
    }
  }
}
```

## readiness

The unit judges the tree. Phase one (verification, discovery, present, ledger): every lead judged by measurement into served, refuted or trial; the sources as the unit's readiness door takes them; the border plan — every discovered door that takes a statement and answers a verdict, with a hand-written theorem filled in; and the unit plan, the calls the client makes. Phase two (plus border answers and unit answers): the border read, and the page. Pure; the client asks the unit.

```json
{
  "type": "object",
  "properties": {
    "verification": {
      "type": "object",
      "description": "the wave tool's results phase"
    },
    "discovery": {
      "type": "object",
      "description": "the discover tool's discovery phase"
    },
    "present": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "cleanup subjects the client measured as present (paths or branches)"
    },
    "ledger": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "theorem rows {key, statement} from the theorem ledger"
    },
    "probeKey": {
      "type": "string",
      "description": "the hand-written theorem offered at the border; default clay_sigma"
    },
    "border": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "phase two: the border calls answered ({door, host, arguments, answer | refusal})"
    },
    "unit": {
      "type": "object",
      "description": "phase two: the unit's answers (readiness, auras, rights, address)"
    },
    "selftest": {
      "type": "boolean",
      "description": "run the flow toolbox's cross-test instead: every direction, every toolbox feeding the next"
    }
  }
}
```

## imagine

Imagination leads all leads: every lead (or the subset named) matched with the reflection on — hidden factors, angles, mirror queries, cluster, verification requests — every reflection that finds something a new open lead, every untried enum value of every schema a lead, every application family an adaptor to build. Pure.

```json
{
  "type": "object",
  "properties": {
    "leads": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "lead ids to imagine; default all"
    },
    "selftest": {
      "type": "boolean",
      "description": "run the flow toolbox's cross-test instead: every direction, every toolbox feeding the next"
    }
  }
}
```

## translate

Translation by vocabulary, offline, both ways: text, from, to. A word no table knows stays as it is and is reported, never guessed; Glagolitic numerals are read as integers. Without text: the vocabulary measured — for every locale, the surface terms with no entry (the leads of the tables).

```json
{
  "type": "object",
  "properties": {
    "text": {
      "type": "string"
    },
    "from": {
      "type": "string",
      "enum": [
        "en",
        "bg",
        "de",
        "fr",
        "es",
        "it",
        "ru",
        "zh",
        "ja",
        "pt",
        "nl"
      ]
    },
    "to": {
      "type": "string",
      "enum": [
        "en",
        "bg",
        "de",
        "fr",
        "es",
        "it",
        "ru",
        "zh",
        "ja",
        "pt",
        "nl"
      ]
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```

## prose

Programmable prose: call a tool with its arguments and render its result as sentences in a locale — the toolbox's idea, the tool's scalar answers, the toolbox's instructions — every word from the vocabulary, every number from the tool, every unknown word reported.

```json
{
  "type": "object",
  "required": [
    "tool"
  ],
  "properties": {
    "tool": {
      "type": "string"
    },
    "arguments": {
      "type": "object"
    },
    "locale": {
      "type": "string",
      "enum": [
        "en",
        "bg",
        "de",
        "fr",
        "es",
        "it",
        "ru",
        "zh",
        "ja",
        "pt",
        "nl"
      ]
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```

## mongo

The ported MongoDB over the docket, pure. find: {collection, docs, filter, sort, skip, limit} → the matching documents (Mongo operators, dotted paths, $and/$or/$nor). insert: {collection, docs: [new]} → the entries to write, content-addressed. update: {collection, docs, filter, update} → for each match the new document and the entry that replaces it (linked to the old). delete: {collection, docs, filter} → the ids to delete, if unlinked. The client reads the docket rows and writes what comes back.

```json
{
  "type": "object",
  "properties": {
    "op": {
      "type": "string",
      "enum": [
        "find",
        "insert",
        "update",
        "delete"
      ]
    },
    "collection": {
      "type": "string"
    },
    "docs": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "the collection's documents as read from the docket (their bodies)"
    },
    "filter": {
      "type": "object"
    },
    "update": {
      "type": "object"
    },
    "sort": {
      "type": "object"
    },
    "skip": {
      "type": "integer"
    },
    "limit": {
      "type": "integer"
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```

## stripe

Stripe per tenant, pure, the QPU as a product with its variants. catalogue: every product and variant (domain, tenant, seat, metered, enterprise; month, year, metered; eur, usd, bgn) as the forms Stripe takes, per tenant. usage: metered calls from docket entries as a usage record. settle: the author's compensation from Stripe's own net figures, by product and tenant, as a settlement entry. plan: a checkout session request for a commercial licence (subject, domains, mode, price or amount) that the Worker sends with the tenant's secret key. webhook: the Stripe-Signature verified with the tenant's webhook secret (HMAC-SHA256, timestamp tolerance), the event read into one idempotent licence entry (granted, renewed, revoked, disputed, failed, noted) linked to what it changes. state: the licence state of a subject at a domain from its entries, at any tenant. The handler holds no key; the Worker executes plans and the docket keeps the entries.

```json
{
  "type": "object",
  "properties": {
    "op": {
      "type": "string",
      "enum": [
        "plan",
        "webhook",
        "state",
        "catalogue",
        "usage",
        "settle"
      ]
    },
    "currencies": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "from": {
      "type": "integer"
    },
    "to": {
      "type": "integer"
    },
    "transactions": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "settle: Stripe balance transactions {id, amount, fee, net, currency, product?, variant?, tenant?}"
    },
    "tenant": {
      "type": "string"
    },
    "host": {
      "type": "string"
    },
    "checkout": {
      "type": "object",
      "description": "plan: { subject, domains, mode, price | amount, currency, successUrl, cancelUrl, customerEmail? }"
    },
    "payload": {
      "type": "string",
      "description": "webhook: the raw body"
    },
    "signature": {
      "type": "string",
      "description": "webhook: the Stripe-Signature header"
    },
    "secret": {
      "type": "string",
      "description": "webhook: the tenant's webhook secret (the Worker passes it; a client never has it)"
    },
    "now": {
      "type": "integer",
      "description": "webhook/state: unix seconds; default the current time"
    },
    "entries": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "webhook/state: the subject's licence entries as read from the docket"
    },
    "subject": {
      "type": "string"
    },
    "domain": {
      "type": "string"
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```

## legal

The full legal and security audit with forensic analysis, through MCP. Phase one (texts, discovery, agents?, theoremKeys?): the author's claims gathered from the tree and its metadata, this tree's own security checks over its sources, and the plan of calls to the unit's forensic, verification, legal, licence, prior-art, due-process and security doors — free agents found by discovery by default, the operator's own list when given. Phase two (plus answers): verdicts per claim, drift against this tree's licence, the findings, the page. Recomputable facts, not legal advice.

```json
{
  "type": "object",
  "properties": {
    "texts": {
      "type": "object",
      "description": "{ readme, citation, zenodo, package, worker, billing, hmac, mcp }: the texts of the tree"
    },
    "discovery": {
      "type": "object"
    },
    "agents": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "the operator's override: the doors to use; omit for the free doors discovery found"
    },
    "theoremKeys": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "citeTheorem": {
      "type": "string",
      "description": "the sealed guarantee of the unit's court cited beside every legal claim; default legal_only_the_proven_is_admitted, a key its due-process door names"
    },
    "answers": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```

## repository

Workspaces, branches, tags and releases watched and verified online, pure. Phase one (local): the requests to GitHub (branches, tags, releases) and Zenodo (every version of the concept DOI), each checked against the contract discovery found. Phase two (plus answers): agreement and leads — a branch or tag only here or only there, a moved tag, a release without its tag, a version without a tag or release, a Zenodo version without a release, a second workspace. The client runs git and fetches; nothing here does.

```json
{
  "type": "object",
  "properties": {
    "local": {
      "type": "object",
      "description": "{ remote, head, branch, version, worktrees, branches, tags, conceptDoi }"
    },
    "contracts": {
      "type": "object"
    },
    "answers": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```
