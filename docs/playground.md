---
title: Playground
order: 50
---

# Playground

Call a tool in the browser. The page runs the same `handle` function the MCP surface serves, with no server in between; the result is rendered by the tool's own `ui://qpu/<tool>` resource (MCP Apps), read over `resources/read` and hosted in a sandboxed frame through the Apps protocol — the UI is built from the MCP, the same view any host renders.

<script setup>
import { ref } from 'vue'
import { handle } from '../src/quantum/mcp.ts'
import App from './.vitepress/theme/components/App.vue'

const tools = handle({ jsonrpc: '2.0', id: 0, method: 'tools/list' }).result.tools.map((t) => t.name)
const tool = ref('processor')
const args = ref('{"name": "Willow"}')
const out = ref('')
const widget = ref('')
const result = ref(null)
const parsed = ref({})

const run = () => {
  try {
    const reply = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool.value, arguments: JSON.parse(args.value) } })
    out.value = JSON.stringify(reply, null, 2)
    widget.value = 'result' in reply ? (reply.result._meta?.widget ?? '') : ''
    result.value = 'result' in reply ? reply.result : null
    parsed.value = JSON.parse(args.value)
  } catch (error) {
    out.value = String(error)
  }
}
</script>

<label>Tool <select v-model="tool"><option v-for="t in tools" :key="t">{{ t }}</option></select></label>

<label>Arguments (JSON)<textarea v-model="args" rows="6" style="width: 100%; font-family: monospace"></textarea></label>

<button @click="run">Call</button>

<App v-if="result" :tool="tool" :args="parsed" :result="result" />

<pre style="white-space: pre-wrap">{{ out }}</pre>
