# Interactive Widgets

Embed live MCP tools directly in documentation.

## Available Widgets

### Solve
Problem solver widget.

```markdown
<Solve />
```

### Search
Search documentation and MCP tools/resources.

```markdown
<Search />
```

### SearchBridge
Advanced search with live problem solving.

```markdown
<SearchBridge />
```

## Using Widgets

Add to any `.md` file:

```markdown
# Try the Solver

<Solve />

# Search the System

<Search />
```

## Creating Widgets

Widgets auto-register from `docs/.vitepress/components/*.vue`.

Create a new one:

```vue
<!-- docs/.vitepress/components/MyWidget.vue -->
<template>
  <div class="widget">
    <!-- content -->
  </div>
</template>

<script setup>
// component logic
</script>

<style scoped>
/* styles use VitePress CSS variables */
</style>
```

Use in markdown: `<MyWidget />`

## CSS Variables

All widgets automatically theme with VitePress variables:

```
--vp-c-bg           background
--vp-c-text-1       primary text
--vp-c-brand        brand color
--vp-c-divider      borders
--vp-c-danger       error
--vp-c-success      success
```

Supports light/dark mode and mobile automatically.

## MCP Integration

Widgets can call MCP from JavaScript:

```typescript
const response = await fetch('http://localhost:3000/mcp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: { name: 'solve', arguments: { problem: query } }
  })
})
```

Simple pattern: call MCP, display result.

See widgets in action in [API docs](../api/solve.md).
