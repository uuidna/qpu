# Playground

Interactive tool testing environment for MCP tools.

## Call Tools in Browser

Test MCP tools with live results:

1. Select a tool (e.g., `processor`, `circuit`, `algorithm`)
2. Enter parameters as JSON
3. Run and see output immediately

## Available Tools

- **processor** — Quantum processor specs (Willow, Sycamore)
- **circuit** — Quantum circuit validation
- **algorithm** — Quantum algorithms (Shor, QAOA)
- **solve** — Problem solver

## Example

Call `processor` with:

```json
{
  "name": "Willow"
}
```

Returns processor specifications and metadata.

## Integration

The playground runs the same `handle` function the MCP server uses—no server required in the browser.

## Try It

Use the [Solve widget](../guide/widgets.md) to test problem solving interactively.
