---
title: Match
order: 47
---

# Any statement, matched or proved impossible

Type a statement. The `match` tool searches everything the surface can do, calls what serves it, or proves from the
surface itself why it cannot: a schema bound the statement exceeds, a lead whose reason says why, or the handler's own
refusal. A statement nothing serves comes back as a new lead to develop. The fixed statements below are evaluated at
build time; a verdict that changes fails the build.

<script setup>
import { ref } from 'vue'
import { handle } from '../src/quantum/mcp.ts'

const match = (statement) => handle({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'match', arguments: { statement } } })
const fixed = [
  ['How many qubits does Willow have?', 'served'],
  ['Factor RSA-2048 with Shor', 'impossible'],
  ['list the careers jobs page', 'impossible'],
  ['teleport a cat to the moon', 'unknown'],
].map(([statement, expected]) => {
  const reply = match(statement)
  const m = 'result' in reply ? reply.result.structuredContent : null
  if (import.meta.env.SSR && m?.verdict !== expected) throw new Error(`match of "${statement}" is ${m?.verdict}, expected ${expected}`)
  return { statement, expected, m, widget: 'result' in reply ? reply.result._meta?.widget ?? '' : '' }
})

const statement = ref('Show the Sycamore couplers')
const out = ref('')
const widget = ref('')
const run = () => { const reply = match(statement.value); out.value = JSON.stringify(reply, null, 2); widget.value = 'result' in reply ? reply.result._meta?.widget ?? '' : '' }
</script>

<label>Statement <input v-model="statement" style="width: 100%" /></label>
<button @click="run">Match</button>
<div v-html="widget"></div>
<pre style="white-space: pre-wrap">{{ out }}</pre>

## Fixed statements

<div v-for="f in fixed" :key="f.statement">

### “{{ f.statement }}” → {{ f.m?.verdict }}

<div v-html="f.widget"></div>

</div>
