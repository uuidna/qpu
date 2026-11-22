<script setup lang="ts">
// A live view of a tool's price: the qubits it uses times the fused real quantum market floor, held below the
// cheapest real quantum call. It reads the server's own x402 challenge (the single source of the numbers) — so the
// widget never restates a figure; when monetisation is off the endpoint serves free and the widget says so.
import { ref, onMounted } from 'vue'

const props = defineProps<{ tool?: string; args?: string }>()
const endpoint = '/api/mcp'
const state = ref<'loading' | 'free' | 'priced' | 'error'>('loading')
const challenge = ref<any>(null)
const message = ref('')

onMounted(async () => {
  try {
    const body = { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: props.tool ?? 'clay', arguments: props.args ? JSON.parse(props.args) : {} } }
    const res = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
    if (res.status === 402) {
      challenge.value = (await res.json()).accepts?.[0] ?? null
      state.value = challenge.value ? 'priced' : 'error'
    } else {
      state.value = 'free'
    }
  } catch (e) {
    state.value = 'error'
    message.value = String(e)
  }
})

const usd = (base: string) => `$${(Number(base) / 1e6).toFixed(6)}`
</script>

<template>
  <div class="qubit-price">
    <p v-if="state === 'loading'" class="hint">Pricing {{ props.tool ?? 'clay' }} from the live quantum market…</p>
    <p v-else-if="state === 'free'" class="hint">Monetisation is off on this deployment — every tool call is free.</p>
    <p v-else-if="state === 'error'" class="err">Could not read a live price. {{ message }}</p>
    <template v-else-if="challenge">
      <div class="price">{{ usd(challenge.maxAmountRequired) }}<span class="per">/ call</span></div>
      <div class="detail">{{ challenge.extra?.qubits }} qubits × ${{ Number(challenge.extra?.marketFloorPerQubitUsd).toExponential(3) }}/qubit (fused market floor), below the ${{ Number(challenge.extra?.cheapestRealCallUsd).toFixed(4) }} cheapest real quantum call — paid in {{ challenge.network }} USDC.</div>
      <table v-if="challenge.extra?.market">
        <thead><tr><th>Provider</th><th>Device</th><th>Qubits</th><th>$/shot</th></tr></thead>
        <tbody>
          <tr v-for="d in challenge.extra.market" :key="d.device"><td>{{ d.provider }}</td><td>{{ d.device }}</td><td>{{ d.qubits }}</td><td>${{ d.perShotUsd }}</td></tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<style scoped>
.qubit-price { border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 14px; margin: 16px 0; }
.price { font-size: 28px; font-weight: 700; color: var(--vp-c-brand-1); }
.price .per { font-size: 14px; font-weight: 400; color: var(--vp-c-text-2); margin-left: 6px; }
.detail { color: var(--vp-c-text-2); font-size: 14px; margin: 6px 0 10px; }
.qubit-price table { width: 100%; font-size: 13px; }
.qubit-price th { text-align: left; }
.hint { color: var(--vp-c-text-2); }
.err { color: var(--vp-c-danger-1); }
</style>
