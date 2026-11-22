// The live stream of the background movie, shared by the canvas and the caption: this deployment's own /api/mcp, asked
// the crypto toolbox's fold for the register on the movie's clock while the page is visible, with the round trip the browser measured.
import { ref } from 'vue'

export const live = ref<{ effective: number; formula: string; holds: boolean; ms: number } | null>(null)
export const liveError = ref(false)

const ask = async () => {
  const t0 = performance.now()
  try {
    const res = await fetch('/api/mcp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'fold', arguments: { qubits: 4 } } }) })
    const s = (await res.json())?.result?.structuredContent
    live.value = { effective: s.effective, formula: s.receipt.formula, holds: s.receipt.holds === true && s.delivery.holds === true, ms: performance.now() - t0 }
    liveError.value = false
  } catch {
    liveError.value = true
  }
}

let started = false
/** Start asking once per page load: now, then every twelve seconds of the clock while the page is visible. */
export const startLive = () => {
  if (started) return
  started = true
  void ask()
  setInterval(() => { if (document.visibilityState === 'visible') void ask() }, 12000)
}
