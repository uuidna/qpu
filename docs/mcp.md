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

Tools: [leads](#leads), [audit](#audit), [match](#match), [clay](#clay), [verify](#verify), [metrics](#metrics), [textbook](#textbook), [css](#css), [dashboard](#dashboard), [clone](#clone).

## Toolbox `flow`

the run of the tree as tools: discover the hosts, verify the leads, let the unit judge, imagine the next leads; the client only fetches and writes.

**Skill.** Use the flow toolbox in phases. discover: call once for the request list, fetch every request as given (POST bodies verbatim), call again with the answers until the phase is "discovery"; write discovery.json and the page. wave: call for the request list, fetch each URL once (pace per host), call again with status, ok, ms and the body text, plus the contracts from the discovery; write verification.json and the page. readiness: call with the verification, the discovery, the cleanup subjects you measured present and the theorem ledger; make the border calls and the unit calls it returns, against the MCP hosts; call again with their answers; write readiness.json and the page. imagine: call once; write imagination.json and the page. Before a live run, call any flow tool with selftest and record the result; a failed check is a lead, never a stop.

**Tests itself:** server only: each tool on fixtures; server → client: every request a tool emits is one the client can answer; client → server: answers read back into data and pages; toolbox → toolbox: discovery feeds wave and readiness, wave feeds readiness, match feeds imagine and the judge.

Tools: [discover](#discover), [wave](#wave), [readiness](#readiness), [imagine](#imagine), [e2e](#e2e), [shard](#shard).

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

Tools: [stripe](#stripe), [currency](#currency).

## Toolbox `legal`

the legal and security audit of this MCP through MCP: the author's claims judged by the unit's forensic, legal and security doors, free agents by default, the operator alone overriding, beside the tree's own checks of its sources.

**Skill.** The client reads the tree's texts (README, CITATION.cff, .zenodo.json, package.json, src/worker.ts, the billing and hmac modules, mcp.ts), the discovery and the theorem ledger, calls legal for the plan, makes every call against its host, and calls legal again with the answers; it writes legal.json and the page. Agents are the free doors discovery found; the operator overrides with agents: [...] and nothing else does. A refusal is recorded, never retried blindly.

**Tests itself:** server only: claims from fixture metadata, security checks on fixture sources, the plan, the audit of fixture answers; client → server: the texts come from the tree, the answers from the doors; toolbox → toolbox: the doors come from discovery; the claims include every perspective lead; the licence module is the measure of drift.

Tools: [legal](#legal), [compete](#compete), [patents](#patents).

## Toolbox `repository`

the repository watched: every workspace, branch, tag and release here compared with the remote and the archive online, every disagreement a lead.

**Skill.** The client gathers with git: the remote url, HEAD, the branch, package.json's version, worktree list, every branch with its upstream and head, every tag with its commit, and the concept DOI from .zenodo.json's related identifiers; calls repository for the requests; fetches them (GitHub needs no token for public reads); calls again with the answers; writes repository.json and the page; its leads join the next-leads docket. Offline, the local facts alone are written.

**Tests itself:** server only: fixture facts against fixture answers give every kind of lead once; client → server: git facts in, GitHub and Zenodo bodies in; toolbox → toolbox: requests checked against the contracts discovery found; leads feed readiness.

Tools: [repository](#repository).

## Toolbox `standards`

the standards fused: schema.org on every block, page and offer; ISO 8601, 639-1, 4217 and 3166-1 in every date, language, price and country, validated against the CLDR lists discovery reads as contracts.

**Skill.** jsonld needs no fetch. codes: the client fetches the three CLDR documents the plan names (GET, free, no credential) and calls codes with them; a code the standard does not know is a lead. The discover step reads schema.org's vocabulary and the CLDR lists as contracts; every tools/call result carries _meta.jsonLd and every documentation page a JSON-LD script.

**Tests itself:** server only: JSON-LD shapes on fixtures; CLDR fixtures read into code sets; the tree's codes validated; client → server: the CLDR lists come from Unicode's repository; toolbox → toolbox: offers come from the billing catalogue, locales from the language toolbox, the contracts from discovery.

Tools: [jsonld](#jsonld), [codes](#codes).

## Toolbox `payload`

Payload's plugin schema as the one shape of every result: nested docs of lexical documents whose blocks are programmable UUID logic, SEO from the block, no custom collection, a few kilobytes computed once.

**Skill.** configure: a client calls it with no kind to test every configuration around the torus, with kind and current (its file text) to learn the drift as leads, with kind tenant and the names of its environment to learn what the operator still has to set; gen-docs writes the manifest from kind pwa. A Payload host with the default plugins (lexical, nested-docs, seo) stores _meta.payload of any result as it is: the lexical field is the document, nestedDocs.parent the parent relation, seo the plugin's fields; the block's uuid is the id. A device renders the block from its uuid alone (the walk) and never recomputes what the balancer computed.

**Tests itself:** server only: the document shape on a fixture block; the next uuid is the program rotated; the breadcrumbs follow the chain; toolbox → toolbox: the block's Open Graph and JSON-LD come from the tree and standards toolboxes; client → server: a Payload host reads the document; the device reads the uuid.

Tools: [payload](#payload), [configure](#configure).

## Toolbox `extension`

QPU the natural extension of every MCP and every MCP of QPU: a host's tools read into doors of this catalogue by the same reading discovery uses, a foreign door served by one request the client fetches, and this catalogue expressed as the registration any MCP client mounts; tenant configurable through the hosts and tokens a tenant names.

**Skill.** Inward: call extend with a host (direction in); fetch the one request it emits, adding the tenant's bearer token where the host asks for one (QPU_MCP_TOKEN_&lt;HOST&gt;); call again with tools and the host's doors join the catalogue as host:tool. Serve one: extend with call &#123; tool, arguments &#125;; fetch the request; call again with answer. Outward: extend with direction out gives the registration (mcpServers fragment) any MCP client mounts. The discover tool extends the default hosts (the unit, this tree, Cloudflare's eight servers) on every run; a tenant names its own hosts with QPU_MCP_HOSTS[_&lt;TENANT&gt;].

**Tests itself:** server only: a fixture tools/list read into doors; an event-stream answer read back; the registration from this catalogue; client → server: the client fetches tools/list and tools/call of the foreign host, token in the request, never in the tool; server → client: every answer the host gives is read the same way discovery reads it (JSON or event stream, error, refusal); toolbox → toolbox: the door reading is discovery's own (doorOf); the matcher never calls a foreign door to serve a statement; QPU extended by itself is the identity.

Tools: [extend](#extend).

## Toolbox `crypto`

the split folds: what a place cannot hold is folded into pieces it can, each addressed by content and the whole by its pieces; a key names its piece; the bound is a reflective boundary that decides by comparison before computing.

**Skill.** fold &#123; text, bound &#125; before sending a payload to a place with a limit (an isolate, a request, a quantum): send the pieces, each under the bound; a reader asks fold &#123; text, bound, key &#125; to learn which piece a key sits in and reads that piece alone; fold &#123; pieces, root &#125; checks the whole came back. seal names any text the way blocks and pieces are named.

**Tests itself:** server only: a ledger folded under a bound, pieces under the bound, keys located, the root recomputed from the pieces, a wrong piece named; toolbox → toolbox: the fold address is the balancer's and the docket's (blocks.ts), the hash the billing toolbox's (hmac.ts), the seed and trinity the Clay register's; client → server: the unit's doors answer from one piece (rowsForKeys) or the baked root — this is the fold they need.

Tools: [fold](#fold), [seal](#seal), [attest](#attest).

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
    },
    "ids": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "the leads named, in this order: a gate answers the leads that pass through it"
    }
  }
}
```

## audit

The surface audits itself through tools/call: every tool has a schema and an example, every documented example replays as documented, every served lead names a served tool, and the error paths answer as JSON-RPC requires. Each check carries its evidence; a failed check is a lead, not a ruling.

```json
{
  "type": "object",
  "properties": {
    "entropy": {
      "type": "object",
      "description": "the vacuum-gravity entropy cleaner: file texts by path (the client reads them); every finding — baked data, a typed path, a cap, a clock in a pure module, a line repeated across files, a note to self, an address — becomes a lead; findings of one address fuse into one lead; the gravity is the fold of the addresses"
    },
    "difference": {
      "type": "object",
      "description": "two named sets { a: { name, members }, b: { name, members }, config? }: every member on one side only becomes a lead to explore and to config, agnostic of what the members name, counted by textbook_difference_leads"
    },
    "security": {
      "type": "object",
      "description": "the security audit from the client and the developer perspectives merged as one: { client: { hosts: [{ host, status, headers, optionsStatus?, writeWithoutToken?, audit? }], payloadMcp? }, developer: { vulnerabilities, leaks, envExampleValueless, access, hooks, signing, theorems } } — the measurements a client script took"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "error texts: each matched to the remedy manual work taught (ERROR_REMEDIES), unmatched ones leads that teach the next row"
    },
    "fallbacks": {
      "type": "boolean",
      "description": "the fallback combinations (correction ↔ handling, the involution) and the adapters each falls back to"
    },
    "access": {
      "type": "boolean",
      "description": "the access audit from every perspective — the public reader at the default domain, a licensed tenant's users at theirs, the operator, an MCP client with a key, the developer in the generated code, the licence and the law — over the generated collections, hooks and scopes: each check names who may, the hook that guards it, what it costs, the licence clause it enacts and the legal fact behind it; the quantum advantage measured unlimited and without interaction among them"
    }
  }
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
    },
    "technique": {
      "type": "string",
      "enum": [
        "reflection"
      ],
      "description": "the register read by the σ-reflection technique: every value's vortex seed, reflection and trinities, the reflecting pairs, the fixed and the tuned; with unit, the unit's sequence answers compared"
    },
    "unit": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "the unit's run_sequence answers per value ({ value, answer | refusal })"
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

## css

The quantum UI as CSS alone: the stylesheet derived from the key 432 (the harmonics, and the rules that draw every block from its own custom properties with no script, motion only where the device allows it, off-screen blocks at no cost) and, for a uuid, the custom properties its block root carries (hue, CMYK, accent, tail colour and angle, the 9-vortex seed and period). Computed once; a device renders at the cost of CSS.

```json
{
  "type": "object",
  "properties": {
    "uuid": {
      "type": "string",
      "description": "a UUID whose block variables to compute"
    }
  }
}
```

## dashboard

A bounded tool laid out whole, so the user's decision in the UI is final: every value each property admits (an enum, a boolean, an integer range, the ends of a numeric bound, the textbook's values where a string is free), the whole space reachable by fixing one facet at a time (each cell narrows the dashboard until one combination remains, whose cell is its walk page /&lt;uuid&gt;), every cell drawn by its own UUID's CSS. Without a tool: every tool with the size of its space.

```json
{
  "type": "object",
  "properties": {
    "tool": {
      "type": "string",
      "description": "the tool to lay out; omit for the index of all"
    },
    "fixed": {
      "type": "object",
      "description": "the facets already decided; the dashboard shows the rest"
    },
    "origin": {
      "type": "string"
    }
  }
}
```

## clone

A toolbox cloned whole: its toolset (every tool's name, description and schema), its skillset (idea, instructions, directions, examples with what they show), and its selftest run now, as one document another host mounts or a client follows door by door. The quantum state of a computation is never cloned (all_noclone); its classical description is, and this is it. Without a toolbox: every toolbox's clone address.

```json
{
  "type": "object",
  "properties": {
    "toolbox": {
      "type": "string",
      "description": "the toolbox to clone; omit for the index"
    },
    "as": {
      "type": "string",
      "description": "the name the clone carries at its new host"
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
    "lead": {
      "type": "string",
      "description": "a lead id: its words are asked of the public MCP registry first; with answers, the related servers and their extend requests"
    },
    "statement": {
      "type": "string",
      "description": "with lead: the statement of a lead not in the registry"
    },
    "mcpHosts": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "MCP endpoints to ask; default the unit, this tree's own and Cloudflare's eight servers; a tenant names its own"
    },
    "auth": {
      "type": "object",
      "description": "host → bearer token, the tenant's own: forwarded as the authorization header of the requests emitted, never kept"
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
    "statements": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "ad-hoc statements {id, statement} to imagine instead: the rest of the leads from any text"
    },
    "selftest": {
      "type": "boolean",
      "description": "run the flow toolbox's cross-test instead: every direction, every toolbox feeding the next"
    }
  }
}
```

## e2e

The end-to-end gate as a repetition code. Without answers: every combination the dashboards lay out and every example of the textbook, as one tools/call request per host (default the tenants' hosts and the operator's), each carrying the hash of the tree's own answer. With answers (each request plus status, ms, text): every combination decoded by majority over the tree and the hosts — agree, corrected (a flipped host, named by the syndrome), erased (a host that did not answer), uncorrectable (no majority) — the physical and logical error rates against the textbook 3-copy code, every error a UUID block for the stream, and the leads. Pure; the client fetches.

```json
{
  "type": "object",
  "properties": {
    "hosts": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "MCP endpoints to call; default https://<tenant host>/mcp for every tenant and the operator's workers.dev"
    },
    "tools": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "only these tools' combinations; default every tool"
    },
    "answers": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "selftest": {
      "type": "boolean",
      "description": "run the flow toolbox's cross-test instead: every direction, every toolbox feeding the next"
    }
  }
}
```

## shard

A long single task split into short multitasks: the share of a list among n shards (index, count) is every item whose position mod n is the shard's index — the shares cover the list exactly once, proven by the kernel (textbook_shards_cover, textbook_shards_disjoint). The clients of the flow take their share from this door and leave what they settled for the merge; nothing is decided by hand.

```json
{
  "type": "object",
  "properties": {
    "list": {
      "type": "array",
      "description": "the items (or their ids)"
    },
    "index": {
      "type": "integer",
      "minimum": 0
    },
    "count": {
      "type": "integer",
      "minimum": 1
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

The ported MongoDB over the docket, pure. find: &#123;collection, docs, filter, sort, skip, limit&#125; → the matching documents (Mongo operators, dotted paths, $and/$or/$nor). insert: &#123;collection, docs: [new]&#125; → the entries to write, content-addressed. update: &#123;collection, docs, filter, update&#125; → for each match the new document and the entry that replaces it (linked to the old). delete: &#123;collection, docs, filter&#125; → the ids to delete, if unlinked. The client reads the docket rows and writes what comes back.

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

## currency

Currency harmonised in real time across every computation, agnostic of the source: plan answers the requests to every free rate API found (ECB, Frankfurter, BNB, open.er-api, currency-api) and names the related MCPs the registry lists; harmonise reads the bodies a client fetched, decodes one rate per currency by the median of the sources (agree within 0.5 %, drift named, pegs fixed by law: BGN 1.95583 since Bulgaria adopted the euro), and converts amounts in the base currency's minor unit into every currency, for a tenant (its currency) and a domain (its top-level domain's). Pure: nothing fetched here.

```json
{
  "type": "object",
  "properties": {
    "op": {
      "type": "string",
      "enum": [
        "plan",
        "harmonise"
      ]
    },
    "answers": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "source": {
            "type": "string"
          },
          "text": {
            "type": "string"
          }
        }
      },
      "description": "the bodies of the sources, fetched by the client"
    },
    "symbols": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "amounts": {
      "type": "object",
      "description": "name → amount in the base currency's minor unit (cents)"
    },
    "tenant": {
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

## compete

The competitions with prizes and funding, their rules read at the source and judged against this tree's own evidence on every run: the Clay Millennium Prize rules (three conditions), XPRIZE Quantum Applications (closed: finalists chosen, winners spring 2027), GitHub's maintainer programs, Cloudflare's Workers Launchpad, Vercel's open source program; the registry's grant and funding MCPs proposed. Each rule is satisfied, pending (the author's act), closed or open (a lead). Nothing is claimed won; the tree competes by following every rule. Pure.

```json
{
  "type": "object",
  "properties": {
    "pages": {
      "type": "object",
      "description": "competition id → the text of its rules page, read by the client: the entry window is measured from it"
    },
    "now": {
      "type": "number",
      "description": "the clock (ms) the window is judged at; the host's when absent"
    },
    "published": {
      "type": "boolean",
      "description": "a publication in a qualifying outlet exists (the author says so)"
    },
    "pushed": {
      "type": "boolean",
      "description": "the repository is public (the author pushed)"
    },
    "hosts": {
      "type": "integer"
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```

## patents

Every patent API found, wired and measured: plan answers the requests to the open ones (Google Patents' query endpoint, the EPO publication server) and names the keyed ones (PatentsView, USPTO ODP, EPO OPS, Lens: the variable names, never values) and the registry's patent MCPs; read takes the bodies a client fetched, reads the patents (number, dates, assignee, inventor, title) and verifies the theorems over them — the dates ordered, the number well formed for its office, the twenty-year term — naming every violation. Pure: nothing fetched here.

```json
{
  "type": "object",
  "properties": {
    "op": {
      "type": "string",
      "enum": [
        "plan",
        "read"
      ]
    },
    "query": {
      "type": "string",
      "description": "the search, e.g. quantum error correction"
    },
    "queries": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "count": {
      "type": "integer",
      "minimum": 1,
      "maximum": 100
    },
    "answers": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "query": {
            "type": "string"
          },
          "text": {
            "type": "string"
          }
        }
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
    "via": {
      "type": "string",
      "enum": [
        "rest",
        "mcp"
      ],
      "description": "mcp: the three facts through GitHub's MCP doors (list_branches, list_tags, list_releases) with the tenant's token in the client's request; default rest"
    },
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

## jsonld

schema.org JSON-LD, pure: for a block (tool, id, description), a page (url, title, description, uuid?) or an offer of the catalogue (product, variant, currency). The author a Person with an ORCID, the licence a URL, dates ISO 8601, languages ISO 639-1, currencies ISO 4217. Every tools/call result already carries its block's JSON-LD in _meta.jsonLd; every documentation page carries its own in its head.

```json
{
  "type": "object",
  "properties": {
    "kind": {
      "type": "string",
      "enum": [
        "block",
        "page",
        "offer",
        "catalogue"
      ]
    },
    "tool": {
      "type": "string"
    },
    "id": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "url": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "uuid": {
      "type": "string"
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
    "product": {
      "type": "string"
    },
    "variant": {
      "type": "string"
    },
    "currency": {
      "type": "string"
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```

## codes

The tree's ISO codes validated against the CLDR lists a client fetched (languages ISO 639, currencies ISO 4217, territories ISO 3166-1): every locale of the language toolbox, every currency of the catalogue, the tenants' countries. Without the lists: what would be checked and where the lists are. A code the standard does not know is a lead, never a guess.

```json
{
  "type": "object",
  "properties": {
    "cldr": {
      "type": "object",
      "description": "{ languages, currencies, territories }: the CLDR JSON documents as fetched"
    },
    "territories": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```

## payload

Any tool's result as the document Payload's default plugins hold, no custom collection: a lexical document whose one block is the programmable UUID logic (uuid, handle, program, tail, tool, arguments, prev, next), nested by the referer chain as nested-docs nests (parent, breadcrumbs), the SEO plugin's title, description and image from the block's Open Graph, the JSON-LD and the licence. Every tools/call result carries the same in _meta.payload.

```json
{
  "type": "object",
  "properties": {
    "theorems": {
      "type": "boolean",
      "description": "the textbook's axioms replaced by theorems through the tenant's Payload MCP plugin, as a client: the plan, then with answers { list, found } the update requests"
    },
    "payloadUrl": {
      "type": "string",
      "description": "the tenant's Payload origin; its MCP is at /api/mcp"
    },
    "answers": {
      "type": "object"
    },
    "website": {
      "description": "true: the requests for payloadcms.com's source tree and one live page; the tree as answered: its collections, blocks, globals, fields and plugins, and whether the live page's blocks have a block in the source"
    },
    "liveBlockTypes": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "skills": {
      "description": "true: the request for Payload's skills tree (github.com/payloadcms/skills); the tree as answered: every skill and reference mapped to the tool of this tree that enacts it"
    },
    "site": {
      "type": "boolean",
      "description": "the site as its own use cases: every toolbox a use case, every example a page document, as payloadcms.com is built of what Payload computes"
    },
    "app": {
      "type": "object",
      "description": "an app requested from the Payload UI: { name, host, plugins?, env?, variant? } — answered as the generated app (every file with its address, the bundle address, the adapters the environment chooses, the enterprise capabilities), priced by the catalogue in the host's currency and ordered through the ecommerce plugin: what the QPU is paid for; { validate: { name, host, env, variant } } answers the streamed form's verdicts, token free; { form: true } the form itself"
    },
    "tool": {
      "type": "string"
    },
    "arguments": {
      "type": "object"
    },
    "prev": {
      "type": "string",
      "description": "the referer block's uuid"
    },
    "chain": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "the referers before prev, oldest first"
    },
    "origin": {
      "type": "string"
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```

## configure

MCP configures Payload and the rest: Payload's default plugins (lexical with the one qpu block, nested-docs, seo, search, redirects, form-builder, multi-tenant, mcp, ecommerce) in all their combinations with no custom collection; the Worker's wrangler configuration from the tenants; each tenant's variable names (never values); the PWA manifest; the MCP registration. Every configuration carries its torus: address, seed, reflection and trinity, and whether the loop closes (config → text → config at the same address). With current (the text a client holds), the drift: every path that differs, each a lead; for a hand-held TypeScript file (payload, hooks, bindings), what MCP configures and the text lacks. With files: every configuration's file and its source, what next writes and what it measures on every run. Kinds hooks and bindings: the Payload hooks and the providers' bindings for full-scale use at minimum cost. Without kind: all of them, tested.

```json
{
  "type": "object",
  "properties": {
    "kind": {
      "type": "string",
      "enum": [
        "payload",
        "wrangler",
        "tenant",
        "pwa",
        "mcp",
        "versions",
        "migration",
        "fullstack",
        "api",
        "hooks",
        "bindings",
        "scopes",
        "fields",
        "validations",
        "access",
        "actions",
        "packages",
        "ecommerce",
        "ui",
        "adapters",
        "gates",
        "sets",
        "realtime"
      ],
      "description": "omit for all"
    },
    "files": {
      "type": "boolean",
      "description": "the file of every configuration and its source (tool or hand): what next writes and what it measures"
    },
    "experience": {
      "type": "object",
      "description": "kind actions: what the gate measured ({ copies, involutions, msByHost }): the shard size follows it"
    },
    "rates": {
      "type": "object",
      "description": "kind ecommerce: the harmonised rates the currency tool answered (currency → { rate }): every price derived from the euro amount"
    },
    "lastTag": {
      "type": "object",
      "description": "{ version, tools }: the last tag and the tools it served, from the repository tool; with it, kind versions computes the next number"
    },
    "current": {
      "type": "string",
      "description": "the configuration text the client holds (JSON or JSONC): compared, the drift answered"
    },
    "version": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "env": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "the variable NAMES the client's environment holds: which of a tenant's are missing (values never travel)"
    },
    "hex": {
      "type": "string",
      "description": "kind ui: any hex (a UUID, a hash, an address) presented as a shadcn combination: each nibble an item and a variant, the whole styled from itself"
    },
    "stream": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "kind ui: a UUID-only stream, queried, sorted, filtered and executed by query (the crypto fold tool answers the same)"
    },
    "query": {
      "type": "object",
      "description": "kind ui, with stream: { where: { handle, nibble: { at, is }, item, variant, hueBetween }, sort: hex | hue | program | tail, descending, execute }"
    },
    "sets": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "kind sets: two set names (a toolbox, mcp, tools, ui, backed, configs, mount:<tenant>) whose union, intersection and differences are answered"
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```

## extend

QPU as the natural extension of every MCP and every MCP of QPU. Inward (host, tools): the host's tools/list read into doors that join this catalogue as host:tool, with what each takes and answers; without tools, the one request the client makes for them (a tenant's token travels in the request, never here). Outward: this catalogue as the registration any MCP client mounts. call (host, tool, arguments): the request that serves a foreign door; with answer, what it answered, read whether JSON or an event stream. Pure; the client fetches. Cloudflare's eight servers are extended by default, the documentation one in the open.

```json
{
  "type": "object",
  "properties": {
    "direction": {
      "type": "string",
      "enum": [
        "in",
        "out",
        "both"
      ],
      "description": "default both"
    },
    "host": {
      "type": "string",
      "description": "the MCP endpoint; default this tree's own"
    },
    "tools": {
      "description": "the host's tools/list answer: its tools array, its JSON-RPC envelope, or the raw text (JSON or event stream)"
    },
    "call": {
      "type": "object",
      "properties": {
        "tool": {
          "type": "string"
        },
        "arguments": {
          "type": "object"
        }
      },
      "description": "a foreign door to serve: the request is emitted"
    },
    "answer": {
      "type": "string",
      "description": "what the host answered the call: read back"
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```

## fold

The split folds: a payload larger than a place can hold is folded into pieces under the bound (bytes), each addressed by its content (fold address and SHA-256), the whole by its pieces (a root over their hashes); a key names the one piece it sits in (by address, or by the key range of its rows), so a door answers from that piece and never from the whole. The bound is a reflective boundary: piece i mirrors piece n−1−i, the excess is reflected into the count of pieces, decided by integer comparisons before anything is computed. With pieces (index, text, sha256?) and a root: the whole unfolded and the root checked, the wrong pieces named.

```json
{
  "type": "object",
  "properties": {
    "hex": {
      "type": "string",
      "description": "any hex (a UUID, a hash, an address): presented as a shadcn combination, each nibble an item and a variant, the whole styled from itself — the one quantum core"
    },
    "uuids": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "a UUID-only stream: queried, sorted, filtered and executed by query"
    },
    "query": {
      "type": "object",
      "description": "with uuids: { where: { handle, nibble: { at, is }, item, variant, hueBetween }, sort: hex | hue | program | tail, descending, execute }"
    },
    "text": {
      "type": "string",
      "description": "the payload: rows as lines (ndjson, csv) fold at rows"
    },
    "bound": {
      "type": "integer",
      "minimum": 1,
      "description": "bytes a piece may hold; e.g. what an isolate, a request or a quantum holds"
    },
    "key": {
      "type": "string",
      "description": "a key to locate: the piece it sits in"
    },
    "pieces": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "pieces to unfold: { index, text, sha256? }"
    },
    "root": {
      "type": "string"
    },
    "withPieces": {
      "type": "boolean",
      "description": "carry the pieces' texts in the answer (default: addresses and hashes only)"
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```

## seal

SHA-256 of a text, and HMAC-SHA256 under a key the caller gives (a test key; a tenant's secret never travels here), pure and the same at every host; the fold address of the text beside them, so a block, a piece and a message are named by one scheme. With sign (ML-DSA-44, ML-DSA-65 or ML-DSA-87, FIPS 204): the post-quantum signature plan over the 32-byte digest, executed by the host with its signing key through Web Crypto; a tenant verifies with the public key the answer carries, never the secret.

```json
{
  "type": "object",
  "required": [
    "text"
  ],
  "properties": {
    "text": {
      "type": "string"
    },
    "key": {
      "type": "string",
      "description": "HMAC key, when a keyed seal is wanted"
    },
    "sign": {
      "type": [
        "string",
        "boolean"
      ],
      "description": "a post-quantum signature over the digest: ML-DSA-44, ML-DSA-65 (true) or ML-DSA-87"
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```

## attest

The crypto and certificate APIs, with NIST and CERN, verified by theorems in coordinated combinations: plan answers the requests to every open API (the NIST randomness beacon, a Certificate Transparency log's tree head, Let's Encrypt's ACME directory, NIST NVD's CVEs on ML-KEM, CERN Open Data's Higgs records, crt.sh, NIST CSRC) and names the hosts whose live certificates the client reads itself; read takes the bodies, verifies the theorems over each (the beacon's chain, period and SHA-512 precommitment; the tree head's widths; the five ACME resources; CVSS bounded and dates ordered; sizes, checksums and DOIs; certificates ordered, within 398 days and valid now; the three FIPS named) and answers the follow-ups the combination needs (the beacon's previous pulse), so a client reads again until nothing follows. Pure: nothing fetched here.

```json
{
  "type": "object",
  "properties": {
    "op": {
      "type": "string",
      "enum": [
        "plan",
        "read"
      ]
    },
    "hosts": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "hosts whose live certificates the client reads (tls:<host> answers)"
    },
    "answers": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "text": {
            "type": "string"
          },
          "status": {
            "type": "integer"
          }
        }
      }
    },
    "now": {
      "type": "number",
      "description": "the clock (ms) the validity is judged at; absent, not judged"
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```
