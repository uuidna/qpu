---
title: Playground
order: 50
---

# Playground

Call a tool in the browser. The page runs the same `handle` function the MCP surface serves, with no server in between.

<script setup>
import { ref } from 'vue'
import { handle } from '../src/quantum/mcp.ts'

const tools = handle({ jsonrpc: '2.0', id: 0, method: 'tools/list' }).result.tools.map((t) => t.name)
const tool = ref('processor')
const args = ref('{"name": "Willow"}')
const out = ref('')
const widget = ref('')

const run = () => {
  try {
    const reply = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: tool.value, arguments: JSON.parse(args.value) } })
    out.value = JSON.stringify(reply, null, 2)
    widget.value = 'result' in reply ? (reply.result._meta?.widget ?? '') : ''
  } catch (error) {
    out.value = String(error)
  }
}
</script>

<label>Tool <select v-model="tool"><option v-for="t in tools" :key="t">{{ t }}</option></select></label>

<label>Arguments (JSON)<textarea v-model="args" rows="6" style="width: 100%; font-family: monospace"></textarea></label>

<button @click="run">Call</button>

<div v-html="widget"></div>

<pre style="white-space: pre-wrap">{{ out }}</pre>
