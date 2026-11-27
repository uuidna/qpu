# MCP

One connector: `qpuMcpPlugin` at `https://qpu.uuidna.com/api/mcp`.

Any client mounts:

```json
{
  "mcpServers": {
    "qpu": {
      "url": "https://qpu.uuidna.com/api/mcp"
    }
  }
}
```

## tools/list (47)

The kernel serves these 47 everywhere. The deployed Worker serves 3 more where it binds its rooms and its Lean prover:
`send`, `receive` and `lean`, so `tools/list` there answers 50. `metrics` states all three numbers (`tools`,
`toolsBound`, `toolsServed`).

| Tool | Toolbox |
|---|---|
| `clay` | tree |
| `match` | tree |
| `verify` | tree |
| `processor` | google |
| `circuit` | google |
| `echo` | google |
| `echo_benchmark` | google |
| `roadmap` | google |
| `algorithm` | google |
| `software` | google |
| `statements` | google |
| `repositories` | google |
| `quantumlib` | google |
| `quantum-error-correction` | google |
| `chemistry-simulation` | google |
| `fault-tolerant-design` | google |
| `google` | google |
| `leads` | tree |
| `audit` | tree |
| `metrics` | tree |
| `textbook` | tree |
| `css` | tree |
| `dashboard` | tree |
| `clone` | tree |
| `apis` | tree |
| `discover` | flow |
| `wave` | flow |
| `readiness` | flow |
| `imagine` | flow |
| `e2e` | flow |
| `shard` | flow |
| `translate` | language |
| `prose` | language |
| `mongo` | raid |
| `stripe` | billing |
| `currency` | billing |
| `legal` | legal |
| `compete` | legal |
| `patents` | legal |
| `repository` | repository |
| `jsonld` | standards |
| `codes` | standards |
| `validate` | standards |
| `extend` | extension |
| `fold` | crypto |
| `seal` | crypto |
| `attest` | crypto |

