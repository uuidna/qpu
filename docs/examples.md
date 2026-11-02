---
title: Examples
order: 45
---

# Examples, run live

Every example below is one entry of `src/quantum/examples.ts`. This page calls `handle` for each at render time, the
test suite replays the same list, and the `audit` tool replays it again on request. If an expectation fails, the site
build fails: the page cannot show a result the tool does not return.

<script setup>
import { handle } from '../src/quantum/processing/mcp.ts'
import { EXAMPLES } from '../src/quantum/processing/examples.ts'

const rows = EXAMPLES.map((e) => {
  const reply = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: e.tool, arguments: e.arguments } })
  const ok = 'result' in reply
  const structured = ok ? reply.result.structuredContent : null
  const why = ok ? e.expect(structured) : reply.error.message
  if (import.meta.env.SSR && why !== null) throw new Error(`example ${e.id} failed: ${why}`)
  return { ...e, ok: why === null, why, widget: ok ? reply.result._meta?.widget ?? '' : '', json: JSON.stringify(structured, null, 2) }
})
</script>

<div v-for="r in rows" :key="r.id">

### {{ r.tool }} · {{ r.id }}

<p>{{ r.shows }}</p>

```json-vue
{{ JSON.stringify({ name: r.tool, arguments: r.arguments }) }}
```

<p v-if="r.ok">✓ as expected</p>
<p v-else>✗ {{ r.why }}</p>

<div v-html="r.widget"></div>

<details><summary>structured result</summary><pre style="white-space: pre-wrap">{{ r.json }}</pre></details>

</div>
