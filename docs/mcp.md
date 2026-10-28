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

## clay

The Clay register recomputed in exact integer arithmetic

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "one relation, e"
    },
    "technique": {
      "type": "string",
      "enum": [
        "reflection"
      ],
      "description": "the register read by the σ-reflection technique",
      "default": "reflection"
    },
    "unit": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "the unit's run_sequence answers per value ({ value, answer | refusal })"
    }
  },
  "x-harmonic": {
    "combinations": "1",
    "index": "0",
    "from": "a432"
  }
}
```

## match

Any statement, matched against everything the surface can do

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
    "questions": {
      "description": "true"
    },
    "verdict": {
      "type": "string",
      "description": "a verdict from another vocabulary (verify_claim"
    },
    "chat": {
      "type": "object",
      "description": "the one door a chat needs"
    },
    "url": {
      "type": "string",
      "description": "a URL path"
    },
    "tenant": {
      "type": "string",
      "description": "with url"
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
      "description": "the language of the statement, translated to English by vocabulary offline before the match; the verdict is given back in it",
      "default": "fr"
    }
  },
  "x-harmonic": {
    "combinations": "11",
    "index": "3",
    "from": "a432"
  }
}
```

## verify

Cheap verification of one UUID

```json
{
  "type": "object",
  "properties": {
    "theorem": {
      "type": "string",
      "description": "a theorem key"
    },
    "call": {
      "type": "object",
      "description": "a call { tool, arguments }"
    },
    "witnesses": {
      "description": "the fourteen witnesses around a UUID, the faces of a cuboctahedron"
    },
    "uuid": {
      "type": "string",
      "description": "the UUID to verify"
    },
    "scan": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "a stream of frames a device sampled ({ t, hue }, hue null for a black frame)"
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

## processor

A Google Quantum AI processor as its spec sheet states it

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
      ],
      "default": "Willow"
    }
  },
  "x-harmonic": {
    "combinations": "3",
    "index": "0",
    "from": "a432"
  }
}
```

## circuit

Compile a circuit from its operations, placed by an insert strategy, and simulate it

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
      "description": "validate the circuit against this device first",
      "default": "Willow"
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
      "description": "the noise of a Willow chip, from its spec sheet medians, after every gate",
      "default": "willow_error_correction"
    }
  },
  "x-harmonic": {
    "combinations": "6",
    "index": "0",
    "from": "a432"
  }
}
```

## echo

Quantum Echoes

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

The Quantum Echoes result as Google states it

```json
{
  "type": "object",
  "properties": {}
}
```

## roadmap

The Google Quantum AI roadmap

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

The textbook algorithms of the Cirq page

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
        "shor",
        "factor"
      ],
      "default": "qft"
    },
    "integer": {
      "type": "string",
      "pattern": "^[0-9]+$",
      "description": "factor"
    },
    "order": {
      "type": "string",
      "pattern": "^[0-9]+$",
      "description": "shor"
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
      "description": "qaoa"
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
  },
  "x-harmonic": {
    "combinations": "8",
    "index": "0",
    "from": "a432"
  }
}
```

## software

The open-source tools of the Google Quantum AI Software page, as the page describes them

```json
{
  "type": "object",
  "properties": {}
}
```

## statements

The statements quantumai

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
      ],
      "default": "qsim"
    }
  },
  "x-harmonic": {
    "combinations": "42",
    "index": "12",
    "from": "a432"
  }
}
```

## repositories

The repositories of the quantumlib GitHub organization, as its list states them

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

The fifteen repositories of the quantumlib GitHub organization, each with what this repository implements of it

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

The three-qubit repetition code, simulated on the density matrix

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
      "description": "the probabilities to sweep; by default 0"
    }
  }
}
```

## chemistry-simulation

Molecular hydrogen in STO-3G as a variational energy evaluation on the simulator

```json
{
  "type": "object",
  "properties": {
    "bond_length": {
      "type": "number",
      "exclusiveMinimum": 0,
      "default": 0.7414,
      "description": "the H–H distance in ångström; 0"
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

Resource counts read from the circuits this repository builds

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
      "description": "qft"
    },
    "N": {
      "type": "integer",
      "minimum": 3,
      "maximum": 21,
      "default": 15,
      "description": "shor"
    },
    "a": {
      "type": "integer",
      "minimum": 2,
      "default": 7,
      "description": "shor"
    },
    "nodes": {
      "type": "integer",
      "minimum": 2,
      "maximum": 12,
      "default": 12,
      "description": "qaoa"
    }
  }
}
```

## leads

Every lead on quantumai

```json
{
  "type": "object",
  "properties": {
    "runnable": {
      "type": "object",
      "description": "the leads that run themselves"
    },
    "records": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "the leads beyond the core as the client read them (the Research leads pages in Payload, else binding 0)"
    },
    "lead": {
      "type": "object",
      "description": "one such lead, as its Research leads page hands it"
    },
    "sitemap": {
      "type": "object",
      "description": "a sitemap as sitemaps"
    },
    "client": {
      "type": "object",
      "description": "a client's own report, apart from the QPU's leads"
    },
    "collide": {
      "type": "boolean",
      "description": "the open problems seen as a toolset of involutions and collided with each other without a limit"
    },
    "sources": {
      "type": "object",
      "description": "the immutable sources of leads"
    },
    "carry": {
      "type": "boolean",
      "description": "the cost of carrying the leads and what converting them to Payload documents saves; when nothing is carried the release is published as the next sequential vers"
    },
    "session": {
      "type": "object",
      "description": "every session read to decide what is next and how"
    },
    "combinations": {
      "type": "object",
      "description": "a432 builds every lead combination"
    },
    "byTheorem": {
      "type": "boolean",
      "description": "every lead addressed by the theorems, never assigned in advance"
    },
    "status": {
      "enum": [
        "served",
        "partial",
        "blocked",
        "out_of_scope",
        "open"
      ],
      "default": "blocked"
    },
    "ids": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "the leads named, in this order"
    }
  },
  "x-harmonic": {
    "combinations": "5",
    "index": "2",
    "from": "a432"
  }
}
```

## audit

The surface audits itself through tools/call

```json
{
  "type": "object",
  "properties": {
    "shard": {
      "type": "object",
      "description": "one share of the audit, split by the shard theorems"
    },
    "lexical": {
      "type": "object",
      "description": "a lexical document scanned, nothing in it run"
    },
    "leaks": {
      "type": "object",
      "description": "{ texts"
    },
    "entropy": {
      "type": "object",
      "description": "the vacuum-gravity entropy cleaner"
    },
    "difference": {
      "type": "object",
      "description": "two named sets { a"
    },
    "security": {
      "type": "object",
      "description": "the security audit from the client and the developer perspectives merged as one"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "error texts"
    },
    "fallbacks": {
      "type": "boolean",
      "description": "the fallback combinations (correction ↔ handling, the involution) and the adapters each falls back to"
    },
    "access": {
      "type": "boolean",
      "description": "the access audit from every perspective — the public reader at the default domain, a licensed tenant's users at theirs, the operator, an MCP client with a key,"
    }
  }
}
```

## metrics

The computable metrics of this tree in real time

```json
{
  "type": "object",
  "properties": {
    "artefacts": {
      "type": "object",
      "description": "the run's artefacts the client read"
    }
  }
}
```

## textbook

The QPU textbook as an adapter

```json
{
  "type": "object",
  "properties": {
    "reflect": {
      "description": "true or { books }"
    },
    "claims": {
      "description": "the textbook claims measured against what is published"
    },
    "theorem": {
      "type": "string",
      "description": "one theorem as its client verifies it"
    },
    "institution": {
      "type": "object",
      "description": "the textbook as an education tool for an institution"
    },
    "verify": {
      "type": "boolean",
      "description": "the wave over the textbook"
    },
    "example": {
      "type": "string",
      "description": "with verify"
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
    "evaluate": {
      "type": "object",
      "description": "the textbook's combinatorial expressions as tools"
    },
    "prose": {
      "type": "object",
      "description": "{ texts"
    },
    "axioms": {
      "type": "boolean",
      "description": "the textbook's axioms each with its theorem"
    },
    "theorems": {
      "type": "boolean",
      "description": "everything the kernel accepts, served whole"
    },
    "category": {
      "type": "string",
      "enum": [
        "toolbox",
        "tool",
        "theorem",
        "module"
      ],
      "description": "one category to list; omit for all",
      "default": "toolbox"
    }
  },
  "x-harmonic": {
    "combinations": "4",
    "index": "0",
    "from": "a432"
  }
}
```

## css

The quantum UI as CSS alone

```json
{
  "type": "object",
  "properties": {
    "compare": {
      "description": "the stylesheet measured against the CSS frameworks by size"
    },
    "uuid": {
      "type": "string",
      "description": "a UUID whose block variables to compute"
    },
    "uuids": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "a sequence of UUIDs set next to each other"
    },
    "create": {
      "type": "boolean",
      "description": "shadcn create (ui"
    }
  }
}
```

## dashboard

A bounded tool laid out whole, so the user's decision in the UI is final

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

A toolbox cloned whole

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

Discovery before use

```json
{
  "type": "object",
  "properties": {
    "lead": {
      "type": "string",
      "description": "a lead id"
    },
    "statement": {
      "type": "string",
      "description": "with lead"
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
      "description": "host → bearer token, the tenant's own"
    },
    "answers": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "the requests answered"
    },
    "selftest": {
      "type": "boolean",
      "description": "run the flow toolbox's cross-test instead"
    }
  }
}
```

## wave

The verification wave

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
      "description": "run the flow toolbox's cross-test instead"
    }
  }
}
```

## readiness

The unit judges the tree

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
      "description": "phase two"
    },
    "unit": {
      "type": "object",
      "description": "phase two"
    },
    "selftest": {
      "type": "boolean",
      "description": "run the flow toolbox's cross-test instead"
    }
  }
}
```

## imagine

Imagination leads all leads

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
      "description": "ad-hoc statements {id, statement} to imagine instead"
    },
    "selftest": {
      "type": "boolean",
      "description": "run the flow toolbox's cross-test instead"
    }
  }
}
```

## e2e

The end-to-end gate as a repetition code

```json
{
  "type": "object",
  "properties": {
    "hosts": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "MCP endpoints to call; default https"
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
      "description": "run the flow toolbox's cross-test instead"
    }
  }
}
```

## shard

A long single task split into short multitasks

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
      "description": "run the flow toolbox's cross-test instead"
    }
  }
}
```

## translate

Translation by vocabulary, offline, both ways

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
      ],
      "default": "ru"
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
      ],
      "default": "fr"
    },
    "selftest": {
      "type": "boolean"
    }
  },
  "x-harmonic": {
    "combinations": "121",
    "index": "69",
    "from": "a432"
  }
}
```

## prose

Programmable prose

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
      ],
      "default": "fr"
    },
    "selftest": {
      "type": "boolean"
    }
  },
  "x-harmonic": {
    "combinations": "11",
    "index": "3",
    "from": "a432"
  }
}
```

## mongo

The ported MongoDB over the docket, pure

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
        "delete",
        "mirror",
        "restore",
        "verify",
        "associate",
        "validate"
      ],
      "default": "find"
    },
    "association": {
      "type": "object",
      "description": "the Rails guide Active Record Associations as Payload fields"
    },
    "validation": {
      "type": "object",
      "description": "the Rails guide Active Record Validations as Payload field options or a validate function"
    },
    "files": {
      "type": "object",
      "description": "restore"
    },
    "copies": {
      "type": "object",
      "description": "verify"
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
  },
  "x-harmonic": {
    "combinations": "9",
    "index": "0",
    "from": "a432"
  }
}
```

## stripe

Stripe per tenant, pure, the QPU as a product with its variants

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
        "settle",
        "usecases",
        "fusion",
        "ledger"
      ],
      "default": "plan"
    },
    "currency": {
      "type": "string",
      "enum": [
        "eur",
        "usd",
        "bgn"
      ],
      "description": "op ledger",
      "default": "eur"
    },
    "calls": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "op ledger"
    },
    "settled": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "op ledger"
    },
    "tools": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "op fusion"
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
      "description": "settle"
    },
    "tenant": {
      "type": "string"
    },
    "host": {
      "type": "string"
    },
    "checkout": {
      "type": "object",
      "description": "plan"
    },
    "payload": {
      "type": "string",
      "description": "webhook"
    },
    "signature": {
      "type": "string",
      "description": "webhook"
    },
    "secret": {
      "type": "string",
      "description": "webhook"
    },
    "now": {
      "type": "integer",
      "description": "webhook/state"
    },
    "entries": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "webhook/state"
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
  },
  "x-harmonic": {
    "combinations": "27",
    "index": "0",
    "from": "a432"
  }
}
```

## currency

Currency harmonised in real time across every computation, agnostic of the source

```json
{
  "type": "object",
  "properties": {
    "op": {
      "type": "string",
      "enum": [
        "plan",
        "harmonise"
      ],
      "default": "plan"
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
  },
  "x-harmonic": {
    "combinations": "2",
    "index": "0",
    "from": "a432"
  }
}
```

## legal

The full legal and security audit with forensic analysis, through MCP

```json
{
  "type": "object",
  "properties": {
    "now": {
      "type": "number",
      "description": "the clock the client names (milliseconds since the epoch), so the audit is a function of its arguments"
    },
    "texts": {
      "type": "object",
      "description": "{ readme, citation, zenodo, package, worker, billing, hmac, mcp }"
    },
    "discovery": {
      "type": "object"
    },
    "agents": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "the operator's override"
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
    "court": {
      "description": "true"
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```

## compete

The competitions with prizes and funding, their rules read at the source and judged against this tree's own evidence on every run

```json
{
  "type": "object",
  "properties": {
    "conduct": {
      "type": "boolean",
      "description": "the client found a CODE_OF_CONDUCT in the repository"
    },
    "news": {
      "type": "boolean",
      "description": "the public news APIs as adapters of the DOI research"
    },
    "mentions": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "the answers to the news requests ({ id, status, text })"
    },
    "pages": {
      "type": "object",
      "description": "competition id → the text of its rules page, read by the client"
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

Every patent API found, wired and measured

```json
{
  "type": "object",
  "properties": {
    "op": {
      "type": "string",
      "enum": [
        "plan",
        "read"
      ],
      "default": "plan"
    },
    "query": {
      "type": "string",
      "description": "the search, e"
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
  },
  "x-harmonic": {
    "combinations": "2",
    "index": "0",
    "from": "a432"
  }
}
```

## repository

Workspaces, branches, tags, releases, the registry and the workflows watched and verified online, pure

```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "object",
      "description": "the machine's status on request"
    },
    "penalties": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "penalty and clearing entries as the docket holds them"
    },
    "steps": {
      "type": "object",
      "description": "the step cache"
    },
    "docs": {
      "type": "object",
      "description": "with penalties"
    },
    "capacity": {
      "type": "object",
      "description": "with penalties"
    },
    "e2e": {
      "type": "object",
      "description": "with penalties"
    },
    "penalty": {
      "type": "object",
      "description": "a penalty harmonic to its violation and sealed"
    },
    "via": {
      "type": "string",
      "enum": [
        "rest",
        "mcp"
      ],
      "description": "mcp",
      "default": "mcp"
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
    "machine": {
      "type": "object",
      "description": "the developer machine through the MCP, securely"
    },
    "workflow": {
      "type": "string",
      "enum": [
        "pre-commit",
        "commit-msg",
        "pre-push",
        "post-commit",
        "prepare-commit-msg",
        "ci",
        "pre-deploy"
      ],
      "description": "the git hook or the CI as a client MCP workflow",
      "default": "ci"
    },
    "offline": {
      "type": "boolean",
      "description": "with workflow"
    },
    "facts": {
      "type": "object",
      "description": "with workflow"
    },
    "selftest": {
      "type": "boolean"
    }
  },
  "x-harmonic": {
    "combinations": "14",
    "index": "12",
    "from": "a432"
  }
}
```

## jsonld

schema

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
      ],
      "default": "catalogue"
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
      ],
      "default": "fr"
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
  },
  "x-harmonic": {
    "combinations": "44",
    "index": "36",
    "from": "a432"
  }
}
```

## codes

The tree's ISO codes validated against the CLDR lists a client fetched (languages ISO 639, currencies ISO 4217, territories ISO 3166-1)

```json
{
  "type": "object",
  "properties": {
    "cldr": {
      "type": "object",
      "description": "{ languages, currencies, territories }"
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

Any tool's result as the document Payload's default plugins hold, no custom collection

```json
{
  "type": "object",
  "properties": {
    "access": {
      "type": "object",
      "description": "CanCanCan over Payload"
    },
    "rolesFromGroups": {
      "type": "object",
      "description": "roles from Google Workspace"
    },
    "references": {
      "type": "object",
      "description": "the references between documents as one graph"
    },
    "hooks": {
      "type": "object",
      "description": "the witness hooks"
    },
    "google": {
      "type": "object",
      "description": "{ pages, tenants, entries, keys }"
    },
    "workspace": {
      "type": "object",
      "description": "{ discovery | kinds | form | forms | response | lexical | document | doc | file | answers }"
    },
    "standardise": {
      "type": "object",
      "description": "a lexical document set in standard typography without a change of meaning"
    },
    "lexical": {
      "type": "object",
      "description": "a Payload lexical document whose qpu blocks run through MCP"
    },
    "namespace": {
      "type": "object",
      "description": "tenants as namespaces, each app its own sandbox without a domain"
    },
    "theorems": {
      "type": "boolean",
      "description": "the textbook's axioms replaced by theorems through the tenant's Payload MCP plugin, as a client"
    },
    "schemas": {
      "type": "boolean",
      "description": "Payload's combinatorial surface handled programmatically"
    },
    "collection": {
      "type": "object",
      "description": "schemas"
    },
    "payloadUrl": {
      "type": "string",
      "description": "the tenant's Payload origin; its MCP is at /api/mcp"
    },
    "answers": {
      "type": "object"
    },
    "website": {
      "description": "true"
    },
    "liveBlockTypes": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "skills": {
      "description": "true"
    },
    "site": {
      "type": "boolean",
      "description": "the site as its own use cases"
    },
    "hologram": {
      "type": "boolean",
      "description": "the QPU as a fractal plugin hologram"
    },
    "merge": {
      "type": "object",
      "description": "two edits of one document merged by block address"
    },
    "devDependencies": {
      "type": "object",
      "description": "with site"
    },
    "app": {
      "type": "object",
      "description": "an app requested from the Payload UI"
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

MCP configures Payload and the rest

```json
{
  "type": "object",
  "properties": {
    "port": {
      "description": "kind adapters"
    },
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
        "realtime",
        "branding",
        "policies"
      ],
      "description": "omit for all",
      "default": "adapters"
    },
    "files": {
      "type": "boolean",
      "description": "the file of every configuration and its source (tool or hand)"
    },
    "experience": {
      "type": "object",
      "description": "kind actions"
    },
    "rates": {
      "type": "object",
      "description": "kind ecommerce"
    },
    "lastTag": {
      "type": "object",
      "description": "{ version, tools }"
    },
    "current": {
      "type": "string",
      "description": "the configuration text the client holds (JSON or JSONC)"
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
      "description": "the variable NAMES the client's environment holds"
    },
    "template": {
      "type": "string",
      "enum": [
        "worker",
        "site",
        "app"
      ],
      "description": "kind wrangler",
      "default": "worker"
    },
    "useCase": {
      "type": "string",
      "description": "kind wrangler"
    },
    "name": {
      "type": "string",
      "description": "kind wrangler, template app"
    },
    "hex": {
      "type": "string",
      "description": "kind ui"
    },
    "stream": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "kind ui"
    },
    "query": {
      "type": "object",
      "description": "kind ui, with stream"
    },
    "sets": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "kind sets"
    },
    "devDependencies": {
      "type": "object",
      "description": "kind gates"
    },
    "google": {
      "type": "object",
      "description": "kind gates"
    },
    "branding": {
      "type": "object",
      "description": "kind branding"
    },
    "selftest": {
      "type": "boolean"
    }
  },
  "x-harmonic": {
    "combinations": "75",
    "index": "57",
    "from": "a432"
  }
}
```

## extend

QPU as the natural extension of every MCP and every MCP of QPU

```json
{
  "type": "object",
  "properties": {
    "coverage": {
      "description": "how much of the registered MCP world the QPU reaches"
    },
    "gemini": {
      "type": "object",
      "description": "the Gemini API as an operator agent the tenant names"
    },
    "compare": {
      "description": "the QPU's tools/list measured against open MCP servers that answer without a key"
    },
    "statement": {
      "type": "string",
      "description": "with direction out"
    },
    "direction": {
      "type": "string",
      "enum": [
        "in",
        "out",
        "both"
      ],
      "description": "default both",
      "default": "in"
    },
    "host": {
      "type": "string",
      "description": "the MCP endpoint; default this tree's own"
    },
    "tools": {
      "description": "the host's tools/list answer"
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
      "description": "a foreign door to serve"
    },
    "answer": {
      "type": "string",
      "description": "what the host answered the call"
    },
    "selftest": {
      "type": "boolean"
    }
  },
  "x-harmonic": {
    "combinations": "3",
    "index": "0",
    "from": "a432"
  }
}
```

## fold

The split folds

```json
{
  "type": "object",
  "properties": {
    "speak": {
      "type": "string",
      "description": "a hex spoken in Glagolitic numerals"
    },
    "split": {
      "type": "string",
      "description": "a UUID split into time and space"
    },
    "harmonic": {
      "type": "object",
      "description": "{ schema, referrer? }"
    },
    "decode": {
      "type": "object",
      "description": "{ radices, address? | uuid? }"
    },
    "radices": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 1
      },
      "description": "Queneau's combinatorics"
    },
    "index": {
      "type": "string",
      "description": "with radices"
    },
    "digits": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0
      },
      "description": "with radices"
    },
    "spaces": {
      "type": "object",
      "description": "{ name"
    },
    "hex": {
      "type": "string",
      "description": "any hex (a UUID, a hash, an address)"
    },
    "uuids": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "a UUID-only stream"
    },
    "neighbours": {
      "type": "string",
      "description": "a UUID"
    },
    "query": {
      "type": "object",
      "description": "with uuids"
    },
    "text": {
      "type": "string",
      "description": "the payload"
    },
    "bound": {
      "type": "integer",
      "minimum": 1,
      "description": "bytes a piece may hold; e"
    },
    "key": {
      "type": "string",
      "description": "a key to locate"
    },
    "pieces": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "pieces to unfold"
    },
    "root": {
      "type": "string"
    },
    "withPieces": {
      "type": "boolean",
      "description": "carry the pieces' texts in the answer (default"
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```

## seal

SHA-256 of a text, and HMAC-SHA256 under a key the caller gives (a test key; a tenant's secret never travels here), pure and the same at every host; the fold ad

```json
{
  "type": "object",
  "required": [
    "text"
  ],
  "properties": {
    "gltf": {
      "type": "object",
      "description": "a glTF 2"
    },
    "text": {
      "type": "string"
    },
    "constants": {
      "description": "the physical constants as coins"
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
      "description": "a post-quantum signature over the digest"
    },
    "referer": {
      "description": "seeds bound to a referer block"
    },
    "artifacts": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "public artifacts verified against the digests their registries recorded"
    },
    "tamper": {
      "type": "object",
      "description": "{ text, address, sha256? }"
    },
    "entropy": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "the device's randomness"
    },
    "selftest": {
      "type": "boolean"
    }
  }
}
```

## attest

The crypto and certificate APIs, with NIST and CERN, verified by theorems in coordinated combinations

```json
{
  "type": "object",
  "properties": {
    "op": {
      "type": "string",
      "enum": [
        "plan",
        "read"
      ],
      "default": "plan"
    },
    "hosts": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "hosts whose live certificates the client reads (tls"
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
  },
  "x-harmonic": {
    "combinations": "2",
    "index": "0",
    "from": "a432"
  }
}
```
