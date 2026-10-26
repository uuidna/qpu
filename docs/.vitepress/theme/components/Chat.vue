<script setup lang="ts">
// The chat is the MCP itself: a statement typed here is a tools/call to the handler running in this page (match), answered at
// once with its block. Teleporting: the same call goes to the host naming the block's content hash (If-None-Match); a 304 is the
// host's proof that it holds the same block, no body sent — the analog verified digitally here, in full. Signalling: every
// exchange is broadcast to every open tab of the web OS (BroadcastChannel) and told to the service worker; the log stays on
// this device. Offline, the MCP answers here alone and says so.
import { ref, onMounted } from 'vue'
import { handle } from '../../../../src/quantum/mcp.ts'
import App from './App.vue'
import { hashOf } from '../../../../src/quantum/e2e.ts'
type Turn = { at: string; statement: string; verdict: string; tool: string | null; address: string | null; hash: string; teleport: 'proven' | 'differs' | 'offline' | 'asking' | 'refused'; ms: number; widget: string; from: 'here' | 'signal'; result?: unknown }
const statement = ref('')
const turns = ref<Turn[]>([])
const busy = ref(false)
const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window ? new BroadcastChannel('qpu-chat') : null
const keep = () => { try { localStorage.setItem('qpu-chat', JSON.stringify(turns.value.slice(0, 50))) } catch { /* the log lives this page */ } }
const ask = async () => {
  const text = statement.value.trim(); if (!text || busy.value) return
  busy.value = true
  const t0 = Date.now()
  const call = { jsonrpc: '2.0' as const, id: 1, method: 'tools/call' as const, params: { name: 'match', arguments: { statement: text } } }
  const reply = handle(call) as { result?: { structuredContent: { verdict: string; tool?: string }; _meta: { widget: string; block: { meta: { id: string } } } }; error?: { message: string } }
  const hash = reply.result ? hashOf(reply.result.structuredContent) : hashOf({ error: reply.error?.message })
  const raw: Turn = { at: new Date().toISOString(), statement: text, verdict: reply.result?.structuredContent.verdict ?? `refused: ${reply.error?.message}`, tool: reply.result?.structuredContent.tool ?? null, address: reply.result?._meta.block.meta.id ?? null, hash, teleport: 'asking', ms: Date.now() - t0, widget: reply.result?._meta.widget ?? '', from: 'here' }
  raw.result = reply.result ?? null // the result the tool's own ui:// resource renders (MCP Apps): the UI built from the MCP, not drawn here
  turns.value.unshift(raw); statement.value = ''
  const turn = turns.value[0]! // the reactive proxy: what the page watches
  try {
    const res = await fetch('/mcp', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', 'if-none-match': `"${hash}"` }, body: JSON.stringify(call) })
    if (res.status === 304) turn.teleport = res.headers.get('etag') === `"${hash}"` ? 'proven' : 'differs'
    else if (res.ok) { const j = await res.json() as { result?: { structuredContent: unknown } }; turn.teleport = hashOf(j.result?.structuredContent) === hash ? 'proven' : 'differs' }
    else turn.teleport = 'refused'
  } catch { turn.teleport = 'offline' }
  turn.ms = Date.now() - t0
  busy.value = false
  keep()
  channel?.postMessage({ ...turn, widget: '', from: 'signal' })
  navigator.serviceWorker?.controller?.postMessage({ signal: { statement: turn.statement, address: turn.address, hash: turn.hash, teleport: turn.teleport } })
}
onMounted(() => {
  try { const kept = localStorage.getItem('qpu-chat'); if (kept) turns.value = JSON.parse(kept) } catch { /* none */ }
  if (channel) channel.onmessage = (e: MessageEvent<Turn>) => { turns.value.unshift({ ...e.data, from: 'signal' }); keep() }
})
const word = (t: Turn['teleport']) => ({ proven: 'teleported: the host holds this block (304 to its hash)', differs: 'the host answers another block: a lead', offline: 'offline: answered here alone', asking: 'asking the host…', refused: 'the host refused' })[t]
</script>
<template>
  <div class="qpu-chat" style="display:grid;gap:12px">
    <form @submit.prevent="ask" style="display:flex;gap:8px">
      <input v-model="statement" placeholder="a statement: factor 15 with Shor · the register read by reflection · how many qubits has Willow" style="flex:1;padding:6px 10px;border:1px solid var(--vp-c-divider);border-radius:8px;background:var(--vp-c-bg)" />
      <button type="submit" :disabled="busy" style="padding:6px 14px;border-radius:8px;border:1px solid var(--vp-c-divider);background:var(--a432-accent);color:#fff">ask</button>
    </form>
    <p style="color:var(--vp-c-text-2);font-size:13px">The handler runs in this page: every statement is a tools/call answered here, then named to the host by its content hash — a 304 is the teleport, proven. Other tabs of the web OS receive the signal.</p>
    <article v-for="t in turns" :key="t.at + t.hash" style="border:1px solid var(--vp-c-divider);border-radius:10px;padding:10px 12px">
      <header style="display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;font-size:13px">
        <strong>{{ t.statement }}</strong>
        <span>{{ t.verdict }}{{ t.tool ? ` by ${t.tool}` : '' }}</span>
        <code v-if="t.address" style="font-size:11px">{{ t.address }}</code>
        <em :title="t.hash">{{ word(t.teleport) }}</em>
        <small style="color:var(--vp-c-text-2)">{{ t.ms }} ms · {{ t.from === 'signal' ? 'signalled from another tab' : 'here' }}</small>
      </header>
      <App v-if="t.result" tool="match" :args="{ statement: t.statement }" :result="t.result" />
    </article>
  </div>
</template>
