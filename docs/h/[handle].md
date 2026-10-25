---
title: Handle
---

# <code>{{ $params.handle }}</code>

The family of a handle: every UUID of this site that begins with it, and the sixteen doors a first program nibble opens. A commit's
short hash is a handle too: its imprint carries it. Where the tree has no entry for a door yet, the walk page below the handle
compiles it live.

<script setup>
import { useData } from 'vitepress'
import { handle } from '../../src/quantum/mcp.ts'
import { uuidFromParts } from '../../src/quantum/blocks.ts'
import { data as receipts } from '../.vitepress/receipts.data.ts'
const { params } = useData()
const tools = handle({ jsonrpc: '2.0', id: 1, method: 'tools/list' }).result.tools.filter((t) => !['audit', 'match', 'verify'].includes(t.name))
const doors = [...Array(16).keys()].map((n) => ({ nibble: n.toString(16), tool: tools[n % tools.length].name, uuid: uuidFromParts(params.value.handle, Array(10).fill(n), '000000000000') }))
const family = receipts.filter((r) => r.id.startsWith(params.value.handle))
</script>

## Receipts of this family
<ul><li v-for="r in family" :key="r.id"><a :href="`/u/${r.id}`"><code>{{ r.id }}</code></a> · {{ r.date }} · {{ r.steps }}</li><li v-if="!family.length">none in the stream</li></ul>

## Doors
<table><thead><tr><th>nibble</th><th>tool</th><th>walk</th></tr></thead><tbody><tr v-for="d in doors" :key="d.nibble"><td>{{ d.nibble }}</td><td>{{ d.tool }}</td><td><a :href="`/u/${d.uuid}`"><code>{{ d.uuid }}</code></a></td></tr></tbody></table>
