#!/usr/bin/env node
/**
 * What the host itself measures, against the free tiers deploy/COST_OPTIMIZATION.md names.
 *
 *   node scripts/monitor-costs.mjs [origin]      default https://qpu.uuidna.com
 */
const origin = (process.argv[2] ?? 'https://qpu.uuidna.com').replace(/\/$/, '')

const read = async (path, init) => {
  try {
    const res = await fetch(origin + path, { ...init, signal: AbortSignal.timeout(30_000) })
    return { status: res.status, body: await res.json() }
  } catch (error) {
    return { status: 0, error: String(error?.message ?? error) }
  }
}
const rpc = (path, name) =>
  read(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: {} } }),
  })

const [metrics, monitor] = await Promise.all([read('/metrics'), rpc('/storage', 'storage_monitor')])
const store = monitor.body?.result?.structuredContent ?? monitor.body?.result

console.log(`cost monitor — ${origin}\n`)
if (metrics.body) {
  console.log('worker (this isolate since it started)')
  console.log(`  mint calls   ${metrics.body.mint?.calls}`)
  console.log(`  receipts     ${metrics.body.receipts}`)
  console.log(`  foreign reads ${metrics.body.foreign}`)
} else console.log(`worker: /metrics unreached (${metrics.status || metrics.error})`)

console.log('')
if (store?.kind) {
  const perKey = store.sampled ? Math.round(store.bytes / store.sampled) : 0
  const estimate = perKey * store.keys
  console.log('storage (KV + R2, every key carries its RAID shares)')
  console.log(`  keys         ${store.keys}   (~${perKey} bytes/key from ${store.sampled} sampled, ~${estimate} bytes in all)`)
  console.log(`  shares       ${store.shares} of ${store.expected}${store.missing ? `   — ${store.missing} key(s) missing shares` : ''}`)
  console.log(`  kv ${store.kv ? 'bound' : 'absent'}, r2 ${store.r2 ? 'bound' : 'absent'}, holds ${store.holds}`)
  console.log('')
  console.log('free tiers (deploy/COST_OPTIMIZATION.md)')
  console.log(`  KV keys ${store.keys} + shares ${store.shares} held; writes free to 100K/day, reads to 1M/day`)
  console.log(`  R2 ~${estimate} bytes of 10 GB/month free`)
} else console.log(`storage: storage_monitor unreached (${monitor.status || monitor.error})`)

process.exit(metrics.body && store?.kind ? 0 : 1)
