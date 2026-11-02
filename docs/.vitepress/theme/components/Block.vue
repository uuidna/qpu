<script setup lang="ts">
import { computed } from 'vue'
import { handle } from '../../../../src/quantum/processing/mcp.ts'
const props = defineProps<{ tool: string; args?: string | Record<string, unknown> }>()
const reply = computed(() => handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: props.tool, arguments: typeof props.args === 'string' ? JSON.parse(props.args) : (props.args ?? {}) } }) as { result?: { _meta: { widget: string; block: { meta: { id: string } } } }; error?: { message: string } })
</script>
<template>
  <div v-if="reply.result" :data-block="reply.result._meta.block.meta.id" v-html="reply.result._meta.widget" />
  <p v-else class="danger">{{ reply.error?.message }}</p>
</template>
