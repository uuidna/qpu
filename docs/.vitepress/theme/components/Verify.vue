<script setup lang="ts">
import { ref, computed } from 'vue'
import { handle } from '../../../../src/quantum/processing/mcp.ts'
const props = defineProps<{ uuid?: string; compact?: boolean }>()
const input = ref(props.uuid ?? '')
const content = ref('')
const reply = computed(() => (input.value ? handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'verify', arguments: { uuid: input.value, ...(content.value ? { content: content.value } : {}) } } }) as { result?: { structuredContent: { valid: boolean; decided: number; checks: { check: string; passed: boolean | null; evidence: string }[] }; _meta: { widget: string } } } : null))
</script>
<template>
  <div class="verify">
    <template v-if="!compact">
      <label>UUID <input v-model="input" style="width:100%;font-family:monospace" /></label>
      <label>content (optional) <input v-model="content" style="width:100%" /></label>
    </template>
    <p v-if="reply?.result" :title="reply.result.structuredContent.checks.map((c) => `${c.check}: ${c.evidence}`).join('\n')">
      verify: {{ reply.result.structuredContent.valid ? '✓' : '✗' }} ({{ reply.result.structuredContent.decided }} decided)
    </p>
    <div v-if="reply?.result && !compact" v-html="reply.result._meta.widget" />
  </div>
</template>
