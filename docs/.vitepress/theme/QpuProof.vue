<script setup lang="ts">
import { VPBadge, VPButton, VPLink } from 'vitepress/theme'

export type QpuTheoremRow = {
  kind: string
  name: string
  href: string
  axiom: string
  face: number
  holds: boolean
}

export type QpuProofRow = {
  face: number
  at: number
  axiom: { name: string; hex: string; neighbour: number; holds: boolean }
  theorems: QpuTheoremRow[]
  proof: { empty: boolean; holds: boolean }
  abstract?: string
  formulas?: { identity: string }[]
  documentation?: string
  docs?: { inline: boolean; powers: string }
  measurements?: {
    hex: string
    experiment?: {
      control: { v: number; c: number }
      inner: { processing: number; exceeds: boolean }
      quantum: { fused: number }
    }
  }
  experiments?: { holds: boolean; result: boolean }
  application?: { domain: string; origin: string; firmware: string }
  cross: string
  quantum: string
  jsonld?: boolean
  minted?: boolean
  holds: boolean
}

defineProps<{ proof: QpuProofRow }>()
</script>

<template>
  <section class="vp-doc" :id="`face-${proof.face}`">
    <h2>
      <VPBadge type="tip" :text="proof.axiom.name" />
      superposition {{ proof.face }}
    </h2>
    <p>
      Axiom empty. Hex <code>{{ proof.axiom.hex }}</code>.
      Proof on demand at time {{ proof.at }}. Holds {{ proof.proof.holds }}.
      Minted {{ proof.minted }}. JSON-LD {{ proof.jsonld }}.
    </p>
    <p v-if="proof.abstract">{{ proof.abstract }}</p>
    <h3 v-if="proof.formulas?.length" :id="`face-${proof.face}-formulas`">Formulas</h3>
    <p v-for="f in proof.formulas" :key="f.identity"><code>{{ f.identity }}</code></p>
    <h3 v-if="proof.measurements" :id="`face-${proof.face}-measurements`">Measurements</h3>
    <p v-if="proof.measurements">
      Hex <code>{{ proof.measurements.hex }}</code>.
      Inner processing {{ proof.measurements.experiment?.inner.processing }}
      exceeds c {{ proof.measurements.experiment?.inner.exceeds }} at seat v={{ proof.measurements.experiment?.control.v }}.
      Capacity {{ proof.measurements.experiment?.quantum.fused }} next to c {{ proof.measurements.experiment?.control.c }}.
    </p>
    <h3 v-if="proof.application" :id="`face-${proof.face}-application`">Application</h3>
    <p v-if="proof.application">
      {{ proof.application.domain }} at {{ proof.application.origin }}.
      Firmware {{ proof.application.firmware }}.
    </p>
    <p v-if="proof.docs">Inline docs power {{ proof.docs.powers }}.</p>
    <h3 :id="`face-${proof.face}-theorems`">Theorems</h3>
    <p v-for="t in proof.theorems" :key="t.kind">
      <VPBadge :type="t.holds ? 'tip' : 'warning'" :text="t.kind" />
      <VPLink :href="t.href">{{ t.name }}</VPLink>
    </p>
    <p>
      <VPButton theme="alt" :href="proof.cross" text="Cross" />
      <VPButton theme="brand" href="/quantum/processing/unit" text="Quantum" />
    </p>
  </section>
</template>
