<script setup lang="ts">
import { rpc as call } from './mcp'
// A live console over the site's own /api/mcp (serveMcp): lists the tools, runs one, shows the JSON result. Client
// only — VitePress renders the page statically, this calls the endpoint in the browser against the same origin.
import { ref, onMounted } from 'vue'

type Tool = { name: string; description?: string }
const endpoint = '/api/mcp'
const tools = ref<Tool[]>([])
const selected = ref('')
const args = ref('{}')
const result = ref('')
const busy = ref(false)
const error = ref('')

const rpc = (method: string, params: unknown) => call(method, params, endpoint)

onMounted(async () => {
  try {
    const r = await rpc('tools/list', {})
    tools.value = r?.result?.tools ?? []
    selected.value = tools.value[0]?.name ?? ''
  } catch (e) {
    error.value = String(e)
  }
})

const run = async () => {
  if (!selected.value) return
  busy.value = true
  error.value = ''
  result.value = ''
  try {
    const parsed = args.value.trim() ? JSON.parse(args.value) : {}
    const r = await rpc('tools/call', { name: selected.value, arguments: parsed })
    result.value = JSON.stringify(r.payment ? { paymentRequired: r.payment } : (r.result ?? r), null, 2)
  } catch (e) {
    error.value = String(e)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="mcp-console">
    <div class="row">
      <select v-model="selected" :disabled="busy || !tools.length">
        <option v-for="t in tools" :key="t.name" :value="t.name">{{ t.name }}</option>
      </select>
      <input v-model="args" spellcheck="false" placeholder='{"selftest": true}' />
      <button :disabled="busy || !selected" @click="run">{{ busy ? 'Running…' : 'Call' }}</button>
    </div>
    <p v-if="!tools.length && !error" class="hint">Loading the live tool catalogue from {{ endpoint }}…</p>
    <p v-if="error" class="err">{{ error }}</p>
    <pre v-if="result"><code>{{ result }}</code></pre>
  </div>
</template>

<style scoped>
.mcp-console { border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 12px; margin: 16px 0; }
.row { display: flex; gap: 8px; flex-wrap: wrap; }
.row select, .row input { padding: 6px 8px; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text-1); }
.row input { flex: 1; min-width: 160px; font-family: var(--vp-font-family-mono); }
.row button { padding: 6px 14px; border-radius: 6px; border: 0; background: var(--vp-c-brand-1); color: #fff; cursor: pointer; }
.row button:disabled { opacity: .5; cursor: default; }
.hint { color: var(--vp-c-text-2); font-size: 14px; margin: 10px 0 0; }
.err { color: var(--vp-c-danger-1); font-size: 14px; }
.mcp-console pre { margin-top: 12px; max-height: 420px; overflow: auto; }
</style>
