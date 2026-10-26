<!-- The host of an MCP App, in the page: the tool's ui:// resource read over the handler's own resources/read, rendered in a sandboxed
     iframe, and spoken to through the MCP Apps protocol (ui/initialize → initialized, tool-input, tool-result, size-changed) — the UI is
     built from the MCP, the same resource any host renders; nothing is drawn here by hand. -->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { handle } from '../../../../src/quantum/mcp.ts'

const props = defineProps<{ tool: string; args: Record<string, unknown>; result: unknown }>()
const frame = ref<HTMLIFrameElement | null>(null)
const html = ref('')
const height = ref(120)
const ready = ref(false)
const read = () => { const r = handle({ jsonrpc: '2.0', id: 1, method: 'resources/read', params: { uri: `ui://qpu/${props.tool}` } }) as { result?: { contents: { text: string }[] } }; html.value = r.result?.contents[0]?.text ?? '' }
// plain data only: a reactive proxy cannot be cloned across the frame, so every message is the JSON of itself
const post = (m: Record<string, unknown>) => frame.value?.contentWindow?.postMessage(JSON.parse(JSON.stringify({ jsonrpc: '2.0', ...m })), '*')
// the input and the result sent to the view once it is initialised, and again whenever the result changes (the shell is reused, never reloaded)
const tell = () => { if (!ready.value) return; post({ method: 'ui/notifications/tool-input', params: { arguments: props.args } }); post({ method: 'ui/notifications/tool-result', params: props.result }) }
const onMessage = (e: MessageEvent) => {
  if (!frame.value || e.source !== frame.value.contentWindow) return
  const m = e.data ?? {}
  if (m.method === 'ui/initialize') { post({ id: m.id, result: { protocolVersion: '2026-01-26', hostCapabilities: {}, hostContext: { displayMode: 'inline' } } }); return }
  if (m.method === 'ui/notifications/initialized') { ready.value = true; tell(); return }
  if (m.method === 'ui/notifications/size-changed' && typeof m.params?.height === 'number') height.value = Math.max(40, Math.min(2400, m.params.height + 8))
}
onMounted(() => { window.addEventListener('message', onMessage); read() })
onBeforeUnmount(() => window.removeEventListener('message', onMessage))
watch(() => props.tool, () => { ready.value = false; read() })
watch(() => props.result, () => { tell() })
</script>

<template>
  <iframe ref="frame" :srcdoc="html" sandbox="allow-scripts" :style="{ width: '100%', height: height + 'px', border: '0.5px solid var(--vp-c-divider)', borderRadius: '8px', background: 'transparent' }" :title="`qpu · ${tool}`" />
</template>
