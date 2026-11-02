<script setup lang="ts">
import { computed } from 'vue'
import { handle } from '../../../../src/quantum/processing/mcp.ts'
import { channelOf, compileOf, uuidFromParts } from '../../../../src/quantum/processing/unit/blocks.ts'
const props = defineProps<{ uuid: string; prev?: string }>()
const ch = computed(() => channelOf(props.uuid))
const tools = computed(() => (handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }) as { result: { tools: Parameters<typeof compileOf>[1] } }).result.tools)
const compiled = computed(() => compileOf(ch.value.program, tools.value, ch.value.message))
const result = computed(() => (compiled.value.next ? handle({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: compiled.value.next.tool, arguments: compiled.value.next.arguments, _meta: props.prev ? { prev: props.prev } : undefined } }) as { result?: { _meta: { widget: string } }; error?: { message: string } } : null))
const next = computed(() => `/${uuidFromParts(ch.value.handle, [...ch.value.program.slice(1), ch.value.program[0]!], ch.value.tail)}`)
</script>
<template>
  <section>
    <h2>Program</h2>
    <table><thead><tr><th>#</th><th>nibble</th><th>tool</th><th>arguments</th></tr></thead>
      <tbody><tr v-for="(s, i) in compiled.steps" :key="i"><td>{{ i }}</td><td>{{ s.nibble.toString(16) }}</td><td>{{ s.tool }}</td><td><code>{{ JSON.stringify(s.arguments) }}</code></td></tr></tbody></table>
    <h2>Next, executed</h2>
    <div v-if="result?.result" v-html="result.result._meta.widget" />
    <p v-else-if="result?.error" class="danger">{{ result.error.message }}</p>
    <nav style="display:flex;justify-content:space-between;margin:24px 0">
      <span><a v-if="prev" :href="prev">← previous</a></span>
      <span><a :href="next">next (the program rotated) →</a></span>
    </nav>
  </section>
</template>
