---
title: Clay register
order: 44
---

# The Clay register, recomputed

`Qpu/Clay.lean` states 54 relations between the unit's constants and the Lean kernel accepted each by `rfl`. This page calls
the `clay` tool, which recomputes every relation in exact integer arithmetic from the same definitions, ported one for one,
and reports the bit width each needs. A small machine with software multi-byte arithmetic, the Pravets 8M of the author's
register, can redo these sums and compare content addresses; the kernel check happened once, and this is what it accepted.
Nothing here proves an open problem: the relations are identities between the unit's own constants, and the page says so.

<script setup>
import { handle } from '../src/quantum/mcp.ts'
const reply = handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'clay', arguments: {} } })
const clay = 'result' in reply ? reply.result.structuredContent : null
const widget = 'result' in reply ? reply.result._meta?.widget ?? '' : ''
if (import.meta.env.SSR && (!clay || clay.holding !== clay.total)) throw new Error(`clay register: ${clay?.holding} of ${clay?.total} hold`)
</script>

<p v-if="clay">{{ clay.holding }} of {{ clay.total }} relations hold; the widest value needs {{ clay.maxBits }} bits.</p>

<div v-html="widget"></div>
