---
title: Stream
order: 55
---

# The receipt stream

Every run of `npm run next` appends a receipt; each names the one before it (`prev`), so the stream is a chain a single
UUID verifies against its neighbours. Read at build time from `public/receipts.ndjson`; each receipt has its page.

<script setup>
import { data } from './.vitepress/receipts.data.ts'
</script>

<table><thead><tr><th>Receipt</th><th>Date</th><th>Head</th><th>Steps</th><th>Prev</th></tr></thead><tbody>
<tr v-for="r in data" :key="r.id"><td><a :href="`/${r.id}`"><code>{{ r.id.slice(0, 8) }}</code></a></td><td>{{ r.date }}</td><td><a :href="`/${r.head.slice(0, 8)}`"><code>{{ r.head }}</code></a></td><td>{{ r.steps }}</td><td><a v-if="r.prev" :href="`/u/${r.prev}`"><code>{{ r.prev.slice(0, 8) }}</code></a><span v-else>—</span></td></tr>
<tr v-if="!data.length"><td colspan="5">no receipts yet: run <code>npm run next</code></td></tr>
</tbody></table>
