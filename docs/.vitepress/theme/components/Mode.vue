<script setup lang="ts">
// The web OS mode, switchable by the user and final: auto (content first, the MCP first), online (the network first for
// everything), offline (the cache alone). The choice is sent to the service worker and kept on this device.
import { ref, onMounted } from 'vue'
const mode = ref<'auto' | 'online' | 'offline'>('auto')
const controlled = ref(false)
const cached = ref<number | null>(null)
const tell = async (m: 'auto' | 'online' | 'offline') => { mode.value = m; try { localStorage.setItem('qpu-mode', m) } catch { /* no storage: the mode lives this page */ } const sw = navigator.serviceWorker?.controller; if (sw) sw.postMessage({ mode: m }); await count() }
const askSw = (q: Record<string, string>): Promise<Record<string, string>> => new Promise((res) => { const sw = navigator.serviceWorker?.controller; if (!sw) return res({}); const ch = new MessageChannel(); ch.port1.onmessage = (e) => res(e.data); sw.postMessage(q, [ch.port2]); setTimeout(() => res({}), 1500) })
const count = async () => { try { const c = await caches.open('qpu-pages'); cached.value = (await c.keys()).length } catch { cached.value = null } }
onMounted(async () => { try { const m = localStorage.getItem('qpu-mode') as typeof mode.value | null; if (m) mode.value = m } catch { /* none */ } if ('serviceWorker' in navigator) { const sync = async () => { const reg = await navigator.serviceWorker.ready.catch(() => null); controlled.value = !!navigator.serviceWorker.controller && !!reg; if (controlled.value) { const held = await askSw({ ask: 'mode' }); if (held.mode && ['auto', 'online', 'offline'].includes(held.mode)) { mode.value = held.mode as typeof mode.value; try { localStorage.setItem('qpu-mode', held.mode) } catch { /* none */ } } else navigator.serviceWorker.controller!.postMessage({ mode: mode.value }) } await count() }; navigator.serviceWorker.addEventListener('controllerchange', () => { void sync() }); await sync(); setTimeout(() => { void sync() }, 2000) } await count() })
</script>
<template>
  <span data-mode style="display:inline-flex;gap:4px;align-items:center;margin-left:8px;font-size:12px">
    <button v-for="m in ['auto', 'online', 'offline']" :key="m" @click="tell(m as any)" :aria-pressed="mode === m" :style="{ padding: '2px 8px', border: '1px solid var(--vp-c-divider)', borderRadius: '6px', background: mode === m ? 'var(--a432-accent)' : 'var(--vp-c-bg)', color: mode === m ? '#fff' : 'inherit' }">{{ m }}</button>
    <a v-if="mode === 'offline'" href="/?mode=auto" title="leave offline mode without a script" style="font-size:11px;color:var(--vp-c-text-2)">leave</a>
    <small :title="controlled ? 'the service worker controls this page' : 'no service worker yet: reload once'" style="color:var(--vp-c-text-2)">{{ controlled ? 'sw' : 'no sw' }}{{ cached !== null ? ` · ${cached} cached` : '' }}</small>
  </span>
</template>
