---
title: Bindings
---

# Bindings

QPU is always fused with the environment it can see. Copy `src/bindings/<name>/kinds.ts` and call `providerOf`. Same ops, same mock, same drive.

| Folder | What the drivers cover |
|---|---|
| `cloudflare` | Worker bindings |
| `google` | GCP products |
| `aws` | AWS services |
| `azure` | Azure resources |
| `ibm` | IBM Cloud |
| `oracle` | OCI |
| `hardware` | BindingPoint pentagram + peripherals. Kind `qpu` never binds. |
| `arch` | Alpine ISAs + wasm + GPU ISAs |

JSON: `/environment` (always fused), `/bindings`, `/providers`. MCP: `qpu_environment`, `qpu_drive`.
