<script setup lang="ts">
import { computed } from 'vue'
import { channelOf, sealOf, reflectionOf } from '../../../../src/quantum/blocks.ts'
const props = defineProps<{ uuid: string }>()
const ch = computed(() => channelOf(props.uuid))
const seal = computed(() => sealOf(props.uuid))
const mirror = computed(() => reflectionOf(props.uuid))
</script>
<template>
  <details class="channel">
    <summary>channel <code>{{ ch.handle }}</code> · program <code>{{ ch.program.join('') }}</code> · tail <code>{{ ch.tail }}</code> · seal {{ seal.valid ? '✓' : '✗' }}</summary>
    <table>
      <tbody>
        <tr><td>one 48-bit</td><td>{{ ch.message.one48 }}</td></tr>
        <tr><td>three 16-bit</td><td>{{ ch.message.three16.join(' · ') }}</td></tr>
        <tr><td>text</td><td>{{ ch.message.text6 ?? '—' }}</td></tr>
        <tr><td>timestamp</td><td>{{ ch.message.timestamp ?? '—' }}</td></tr>
        <tr><td>referrer handle · flags</td><td><a :href="`/h/${ch.message.referrer.handle}`">{{ ch.message.referrer.handle }}</a> · {{ ch.message.referrer.flags }}</td></tr>
        <tr><td>colour</td><td><span :style="{ display: 'inline-block', width: '1em', height: '1em', background: ch.message.colour.rgb, verticalAlign: 'middle' }" /> {{ ch.message.colour.rgb }}</td></tr>
        <tr><td>vortex (ℤ/9)</td><td>seed {{ ch.message.vortex.seed }} · reflection {{ ch.message.vortex.reflection }} · {{ ch.message.vortex.polarity }}</td></tr>
        <tr><td>mirror (σ)</td><td><a :href="`/${mirror.mirror}`"><code>{{ mirror.mirror }}</code></a></td></tr>
      </tbody>
    </table>
  </details>
</template>
